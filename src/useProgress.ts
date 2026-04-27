import { useCallback, useEffect, useRef, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";

export type BookProgress = {
  current_essay: number;          // 1-indexed
  scroll: Record<string, number>; // key = essay order as string, value 0..1
};
export type ProgressMap = Record<string, BookProgress>;
export type CompletedEssaysMap = Record<string, number[]>;

export type Streak = {
  current: number;
  longest: number;
  last_read_date: string | null;
};

export const EMPTY_STREAK: Streak = { current: 0, longest: 0, last_read_date: null };
const DEBOUNCE_MS = 1500;
const COMPLETION_THRESHOLD = 0.95;

export function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  const a = new Date(fy, fm - 1, fd).getTime();
  const b = new Date(ty, tm - 1, td).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function computeStreak(prev: Streak, today: string): Streak {
  if (prev.last_read_date === today) return prev;
  const continued = !!prev.last_read_date && daysBetween(prev.last_read_date, today) === 1;
  const current = continued ? prev.current + 1 : 1;
  const longest = Math.max(prev.longest, current);
  return { current, longest, last_read_date: today };
}

export function useProgress(user: User | null) {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [completedEssays, setCompletedEssays] = useState<CompletedEssaysMap>({});
  const [streak, setStreak] = useState<Streak>(EMPTY_STREAK);
  const [loaded, setLoaded] = useState(false);

  const progressRef = useRef<ProgressMap>({});
  const completedRef = useRef<CompletedEssaysMap>({});
  const streakRef = useRef<Streak>(EMPTY_STREAK);

  const pendingProgressRef = useRef<Set<string>>(new Set()); // bookSlugs to flush
  const pendingCompletedRef = useRef<Set<string>>(new Set());
  const streakDirtyRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { completedRef.current = completedEssays; }, [completedEssays]);
  useEffect(() => { streakRef.current = streak; }, [streak]);

  useEffect(() => {
    if (!user) {
      setProgress({});
      setCompletedEssays({});
      setStreak(EMPTY_STREAK);
      progressRef.current = {};
      completedRef.current = {};
      streakRef.current = EMPTY_STREAK;
      setLoaded(true);
      return;
    }
    let cancelled = false;
    setLoaded(false);
    getDoc(doc(db, "users", user.uid))
      .then((snap) => {
        if (cancelled) return;
        const data = snap.data() ?? {};
        const p = (data.progress ?? {}) as ProgressMap;
        const ce = (data.completed_essays ?? {}) as CompletedEssaysMap;
        const st = (data.streak ?? EMPTY_STREAK) as Streak;
        setProgress(p);
        setCompletedEssays(ce);
        setStreak(st);
        progressRef.current = p;
        completedRef.current = ce;
        streakRef.current = st;
      })
      .catch((e) => console.error("progress load failed", e))
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [user]);

  const flushPending = useCallback(
    async (uid: string, email: string | null, displayName: string | null) => {
      const pendingP = pendingProgressRef.current;
      const pendingC = pendingCompletedRef.current;
      const streakDirty = streakDirtyRef.current;
      pendingProgressRef.current = new Set();
      pendingCompletedRef.current = new Set();
      streakDirtyRef.current = false;

      if (pendingP.size === 0 && pendingC.size === 0 && !streakDirty) return;

      const update: Record<string, unknown> = {
        email,
        display_name: displayName,
        last_seen: serverTimestamp(),
      };
      if (pendingP.size > 0) {
        const out: Record<string, unknown> = {};
        for (const slug of pendingP) {
          const bp = progressRef.current[slug];
          if (bp) out[slug] = { ...bp, updated_at: serverTimestamp() };
        }
        update.progress = out;
      }
      if (pendingC.size > 0) {
        const out: Record<string, number[]> = {};
        for (const slug of pendingC) out[slug] = completedRef.current[slug] ?? [];
        update.completed_essays = out;
      }
      if (streakDirty) update.streak = streakRef.current;

      try {
        await setDoc(doc(db, "users", uid), update, { merge: true });
      } catch (e) {
        console.error("progress save failed", e);
      }
    },
    [],
  );

  const recordProgress = useCallback(
    (bookSlug: string, essayOrder: number, scrollFrac: number) => {
      if (!user) return;
      const clamped = Math.max(0, Math.min(1, scrollFrac));
      const key = String(essayOrder);
      const existing = progressRef.current[bookSlug] ?? {
        current_essay: essayOrder,
        scroll: {},
      };

      const prevScroll = existing.scroll[key] ?? 0;
      const positionChanged =
        existing.current_essay !== essayOrder ||
        Math.abs(prevScroll - clamped) >= 0.02;
      if (positionChanged) {
        const next: BookProgress = {
          current_essay: essayOrder,
          scroll: { ...existing.scroll, [key]: Math.max(prevScroll, clamped) },
        };
        progressRef.current = { ...progressRef.current, [bookSlug]: next };
        setProgress(progressRef.current);
        pendingProgressRef.current.add(bookSlug);
      }

      if (clamped >= COMPLETION_THRESHOLD) {
        const list = completedRef.current[bookSlug] ?? [];
        if (!list.includes(essayOrder)) {
          const nextList = [...list, essayOrder].sort((a, b) => a - b);
          completedRef.current = { ...completedRef.current, [bookSlug]: nextList };
          setCompletedEssays(completedRef.current);
          pendingCompletedRef.current.add(bookSlug);

          const today = localDateKey();
          const nextStreak = computeStreak(streakRef.current, today);
          if (nextStreak !== streakRef.current) {
            streakRef.current = nextStreak;
            setStreak(nextStreak);
            streakDirtyRef.current = true;
          }
        }
      }

      const dirty =
        pendingProgressRef.current.size > 0 ||
        pendingCompletedRef.current.size > 0 ||
        streakDirtyRef.current;
      if (dirty) {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          flushPending(user.uid, user.email, user.displayName);
        }, DEBOUNCE_MS);
      }
    },
    [user, flushPending],
  );

  useEffect(() => {
    if (!user) return;
    const onHide = () => {
      const hasPending =
        pendingProgressRef.current.size > 0 ||
        pendingCompletedRef.current.size > 0 ||
        streakDirtyRef.current;
      if (hasPending) {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        flushPending(user.uid, user.email, user.displayName);
      }
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [user, flushPending]);

  return { progress, completedEssays, streak, loaded, recordProgress };
}
