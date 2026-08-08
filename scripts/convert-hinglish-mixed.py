#!/usr/bin/env python3
"""Convert Romanized Hindi to Devanagari while preserving English tokens.

This is an editorial migration helper, not part of the production build. Run it
on explicit book directories and inspect every resulting diff.
"""

from __future__ import annotations

import argparse
from collections import Counter
import json
import re
import subprocess
import time
import urllib.parse
import urllib.request
from pathlib import Path


DEVANAGARI_DIGITS = str.maketrans("०१२३४५६७८९", "0123456789")
ROMAN_TOKEN = re.compile(r"[A-Za-z][A-Za-z'-]*")
PROTECTED = re.compile(r"https?://[^\s)]+|`[^`]+`|café|,|\b\d+(?:[.:/-]\d+)*\b", re.IGNORECASE)
PLACEHOLDER = re.compile(r"§([०-९0-9]+)§")

# Roman spellings that are Hindi even when an English dictionary contains the
# same token. Extend this list from the post-conversion audit when needed.
HINDI_ROMAN = {
    "aa", "aaj", "aata", "aayi", "ab", "abhi", "achha", "agar", "agla",
    "aksar", "alag", "aman", "apna", "apne", "apni", "asal", "aur", "awaaz",
    "arjun", "aman", "bengaluru", "farah", "hyderabad", "indore", "leena", "meera",
    "mohit", "priya", "radhika", "vikram",
    "baad", "baar", "baat", "bada", "badal", "badla", "ban", "bana", "banana", "banaye",
    "bas", "beech", "beta", "beti", "bhi", "bilkul", "bina", "bola", "bolna",
    "chaar", "chahta", "chala", "chalega", "chahiye", "chhota", "chhodna", "chhodun",
    "daav", "daalte", "de", "dein", "dekh", "dekha", "dekhe", "dekho", "dekhna",
    "dena", "di", "diya", "do", "dono", "doosra", "doosre", "dus", "farq",
    "filhaal", "gaya", "gaye", "gayi", "ghar", "girta", "hai", "hain", "ham",
    "hamesha", "har", "hi", "hissa", "ho", "hoga", "hogi", "hone", "honi",
    "hoon", "hota", "hote", "hoti", "hua", "hue", "hui", "hum", "is", "iska",
    "isliye", "isme", "iss", "jaata", "jaate", "jaati", "jaaye", "jaayega", "jab",
    "jahan", "jis", "jiske", "jisme", "jo", "ka", "kaam", "kabhi", "kaha", "kahan",
    "kaise", "kaisi", "kam", "kar", "karega", "karenge", "karke", "karna", "karne",
    "karo", "karta", "karte", "karti", "kaun", "kaunsa", "kaunsi", "ke", "keh",
    "kehna", "kehta", "kha", "khada", "kharidne", "kho", "kholna", "khud", "ki",
    "kis", "kisi", "kitna", "kitne", "ko", "koi", "kuch", "laga", "lagega", "lagegi",
    "lagta", "le", "lega", "lena", "lene", "lenge", "leta", "lete", "li", "liye",
    "liya", "log", "logon", "maa", "maan", "maana", "maane", "mahine", "main",
    "maine", "mana", "mat", "matlab", "mein", "mere", "mila", "mili", "na", "naam",
    "nahi", "naya", "nayi", "ne", "paas", "padh", "padhte", "pahunch", "paise", "par",
    "pata", "pehla", "pehle", "phir", "poocha", "poochho", "purana", "purane", "pyaar",
    "raat", "raha", "rahe", "rahi", "rakhe", "rakhi", "rakho", "rehne", "roti", "saal",
    "saamne", "saath", "sab", "sabke", "sabne", "sahi", "sakta", "sakte", "sakti",
    "samjho", "se", "shaadi", "sirf", "suna", "tab", "tak", "tarah", "tareeka", "teen",
    "teesra", "tha", "the", "thi", "thoda", "to", "tum", "tumhare", "tumhari", "tumne",
    "turant", "us", "uska", "uske", "uski", "usme", "usne", "usse", "utna", "waise",
    "wahan", "wahi", "waqt", "wala", "wale", "wali", "woh", "ya", "yaad", "yahan",
    "ye", "yeh", "zindagi", "zaroor", "zaroori", "zyada", "lo",
    # Common inflections and connective words found in the longer essay books.
    "aage", "aana", "aane", "aap", "aapka", "aapke", "aapki", "aapko",
    "aapse", "aapne", "achhe", "achhi", "agle", "agli", "aaya", "aaye",
    "aise", "andar", "asli", "bacha", "bachata", "bachna", "banao", "banata",
    "banaya", "banaye", "banne", "banta", "bata", "bhi", "bol", "bolkar",
    "chacha", "cheez", "chuka", "chup", "darr", "deta", "dete", "deti",
    "dil", "dunga", "ek", "gayab", "haan", "hona", "isi", "isse", "itna",
    "ja", "jaana", "jaldi", "jaisa", "jaisi", "jayega", "kab", "kaafi",
    "kal", "kare", "karni", "karoge", "khatam", "kiya", "kiye", "koshish",
    "kya", "kyun", "kyunki", "lage", "lagi", "lekin", "leti", "likha",
    "maang", "mera", "meri", "mil", "mile", "milna", "mujhe", "neeche",
    "pada", "padta", "pe", "pehli", "poori", "pooja", "rakha", "rakhna",
    "rehna", "rehta", "roz", "sach", "sameer", "sana", "sawaal", "seema",
    "shayad", "shuru", "toh", "tumhe", "unhe", "unhone", "unka", "upar",
    "use", "usi", "wapas",
    # Indian names and places should also be rendered in Devanagari.
    "aarif", "aditi", "ahmedabad", "alka", "anushka", "arun", "arush",
    "ayesha", "babulal", "bhopal", "chandigarh", "chennai", "devika", "faizan",
    "ghaziabad", "gurgaon", "hiba", "isha", "jaipur", "kabir", "kanpur",
    "kavya", "kochi", "kolkata", "kunal", "lucknow", "madhav", "manav",
    "meher", "meenal", "mumbai", "nandini", "nilofer", "nitin", "noida",
    "patna", "prateek", "pune", "raghav", "rhea", "ritu", "rohan", "rohit",
    "shalini", "tara", "vivek", "zoya",
}

# Dictionary collisions found by auditing the generated prose. These are valid
# English spellings in some contexts, but Hindi connective/action words in this
# corpus. Keeping the smaller set separate lets the targeted repair avoid
# touching complete English sentences that legitimately contain "is/to/do".
REMAINING_HINDI_ROMAN = {
    "bach", "bade", "bahut", "band", "bane", "banate", "bani", "bant",
    "batata", "bhar", "bigad", "bole", "bolo", "bolti", "chal", "chalta",
    "dar", "dene", "din", "doge", "doon", "hon", "jawab", "jod", "jodo",
    "karaya", "khadi", "la", "lana", "lao", "mar", "pa", "papa", "pasand",
    "pooch", "rakh", "reh", "roka", "sake", "subah", "taraf", "toda", "tu",
}
HINDI_ROMAN.update(REMAINING_HINDI_ROMAN)

EXPLICIT_ENGLISH = {
    "EMI", "HR", "PM", "ROI",
    "Instagram",
    "startup", "podcast", "podcasts", "layoff", "layoffs", "runway", "spreadsheet",
    "whistleblowing", "childcare", "cowardice", "dependents", "reversible", "irreversible",
    # Modern work/life vocabulary missing from the system's legacy dictionary.
    "ADHD", "CC", "OTP", "QA", "WhatsApp",
    "anonymize", "app", "apps", "async", "bandwidth", "brainstorming", "callback",
    "became", "behaviour", "box", "caregiver", "caregivers", "caregiving", "casteist",
    "checkpoint", "checklist", "cheaper", "children's", "clarified", "cleanest",
    "co-owners", "colour", "committed", "confusing", "controlled", "controlling",
    "cooperation", "coordinate", "coordination", "counterfactual", "counselling",
    "counsellor", "coworker", "coworkers", "deeply", "deeper", "demo", "denied",
    "earlier", "emoji", "end-to-end", "escalation", "evaluator", "expertise",
    "face-to-face", "father's", "favour", "favourable", "favourite", "favourites",
    "fewer", "formatting", "freelance", "fridge", "gatekeeping", "goalpost",
    "goalposts", "handover", "handovers", "healthcare", "healthier", "higher-paid",
    "hiring", "implied", "inbox", "judgement", "laptop", "larger", "liberating",
    "mic", "mindset", "mockups", "multitask", "neighbour", "neurodivergent",
    "newborn", "offline", "one-to-one", "overshare", "packaging", "paid", "paid-work",
    "paperwork", "people's", "person's", "pharma", "planned", "planning", "policing",
    "pre-read", "pre-resolved", "pricing", "quitting", "robotics", "rumour", "rumours",
    "safer", "screenshot", "screenshots", "sexist", "shortcut", "shortcuts", "skipped",
    "slower", "smallest", "softer", "son's", "spokesperson", "stronger", "theatre",
    "timeline", "timestamps", "to-do", "unpredictability", "verified", "weaker",
    "website", "weakest", "widest", "wider", "willpower", "woman's", "women", "workflow",
    "worksheet", "workaholics",
}
EXPLICIT_ENGLISH_LOWER = {word.lower() for word in EXPLICIT_ENGLISH}
ENGLISH_FUNCTION_WORDS = {
    "a", "am", "an", "and", "are", "as", "at", "be", "been", "being", "but",
    "by", "do", "for", "from", "had", "has", "have", "he", "her", "his", "how",
    "if", "in", "is", "it", "no", "not", "of", "on", "or", "our", "she", "than",
    "that", "the", "their", "then", "these", "they", "this", "those", "to", "was",
    "we", "were", "what", "when", "where", "who", "why", "with", "you", "your",
}
ENGLISH_SENTENCE_NEUTRAL = {
    "alka", "arun", "hiba", "isha", "nitin", "prateek", "raghav", "rohan",
    "sameer", "sandeep", "seema", "tara", "zoya", "log",
}


def load_english_words() -> set[str]:
    words: set[str] = set()
    for filename in ("/usr/share/dict/words", "/usr/share/dict/web2"):
        path = Path(filename)
        if path.exists():
            words.update(line.strip().lower() for line in path.read_text(errors="ignore").splitlines())
    return words


ENGLISH_WORDS = load_english_words()


def is_english(token: str) -> bool:
    lower = token.lower()
    if lower in EXPLICIT_ENGLISH_LOWER or (
        token.isupper() and len(token) > 1
    ):
        return True
    if lower in HINDI_ROMAN:
        return False
    if "-" in lower:
        parts = [part for part in lower.split("-") if part]
        if parts and all(is_english(part) for part in parts):
            return True
    if lower in ENGLISH_WORDS:
        return True
    for suffix in ("s", "es", "ed", "ing", "d"):
        if lower.endswith(suffix) and lower[: -len(suffix)] in ENGLISH_WORDS:
            return True
    if lower.endswith("ies") and lower[:-3] + "y" in ENGLISH_WORDS:
        return True
    return False


def transliterate(text: str) -> str:
    if len(text) <= 100:
        return transliterate_chunk(text)

    pieces = re.findall(r"\S+\s*|\s+", text)
    chunks: list[str] = []
    current = ""
    for piece in pieces:
        if current and len(current) + len(piece) > 100:
            chunks.append(current)
            current = piece
        else:
            current += piece
    if current:
        chunks.append(current)
    return "".join(transliterate_chunk(chunk) for chunk in chunks)


def transliterate_chunk(text: str) -> str:
    leading = text[: len(text) - len(text.lstrip())]
    trailing = text[len(text.rstrip()) :]
    core = text.strip()
    if not core:
        return text

    protected: list[str] = []

    def hold(value: str) -> str:
        index = len(protected)
        protected.append(value)
        return f"§{index}§"

    core = PROTECTED.sub(lambda match: hold(match.group(0)), core)
    core = ROMAN_TOKEN.sub(
        lambda match: hold(match.group(0)) if is_english(match.group(0)) else match.group(0),
        core,
    )
    if not ROMAN_TOKEN.search(core):
        return leading + restore(core, protected) + trailing

    params = urllib.parse.urlencode({"text": core, "itc": "hi-t-i0-und", "num": "1"})
    request = urllib.request.Request(
        f"https://inputtools.google.com/request?{params}",
        headers={"User-Agent": "instamarathi-editorial-migration/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.load(response)
    if payload[0] != "SUCCESS":
        raise RuntimeError(f"Transliteration failed: {payload!r}")
    converted = "".join(segment[1][0] for segment in payload[1])
    time.sleep(0.03)
    return leading + restore(converted, protected) + trailing


def restore(text: str, protected: list[str]) -> str:
    def replace(match: re.Match[str]) -> str:
        index = int(match.group(1).translate(DEVANAGARI_DIGITS))
        return protected[index]

    return PLACEHOLDER.sub(replace, text)


def convert_markdown(raw: str) -> str:
    output: list[str] = []
    in_frontmatter = False
    for line in raw.splitlines(keepends=True):
        ending = "\n" if line.endswith("\n") else ""
        content = line[:-1] if ending else line
        if content == "---":
            in_frontmatter = not in_frontmatter
            output.append(line)
            continue
        if in_frontmatter:
            match = re.match(r"(title|summary):\s*(.*)", content)
            if match:
                output.append(f"{match.group(1)}: {transliterate(match.group(2))}{ending}")
            else:
                output.append(line)
            continue
        output.append(transliterate(content) + ending if content.strip() else line)
    return "".join(output)


def is_english_sentence(text: str) -> bool:
    tokens = ROMAN_TOKEN.findall(text)
    if len(tokens) < 4:
        return False
    lower = [token.lower() for token in tokens]
    # In Roman Hindi, this common shape means "two ... were", not English.
    if lower[0] == "do" and lower[-2:] == ["rest", "vague"]:
        return False
    return all(
        is_english(token)
        or token.lower() in ENGLISH_FUNCTION_WORDS
        or token.lower() in ENGLISH_SENTENCE_NEUTRAL
        for token in tokens
    )


def transliterate_preserving_english_sentences(text: str) -> str:
    pieces = re.split(r"(?<=[.!?])(\s+)", text)
    return "".join(
        piece
        if piece.isspace() or is_english_sentence(piece)
        else transliterate(piece)
        for piece in pieces
    )


def repair_english_sentences(original: str, current: str) -> str:
    original_lines = original.splitlines(keepends=True)
    current_lines = current.splitlines(keepends=True)
    if len(original_lines) != len(current_lines):
        raise ValueError("Cannot repair a file whose line count changed")

    output: list[str] = []
    for source_line, current_line in zip(original_lines, current_lines, strict=True):
        source_sentences = re.split(r"(?<=[.!?])\s+", source_line)
        if any(is_english_sentence(sentence) and sentence not in current_line for sentence in source_sentences):
            ending = "\n" if source_line.endswith("\n") else ""
            content = source_line[:-1] if ending else source_line
            output.append(transliterate_preserving_english_sentences(content) + ending)
        else:
            output.append(current_line)
    return "".join(output)


def repair_remaining_hindi(original: str, current: str) -> str:
    original_lines = original.splitlines(keepends=True)
    current_lines = current.splitlines(keepends=True)
    if len(original_lines) != len(current_lines):
        raise ValueError("Cannot repair a file whose line count changed")

    output: list[str] = []
    for source_line, current_line in zip(original_lines, current_lines, strict=True):
        present = {token.lower() for token in ROMAN_TOKEN.findall(current_line)}
        if present & REMAINING_HINDI_ROMAN:
            ending = "\n" if source_line.endswith("\n") else ""
            content = source_line[:-1] if ending else source_line
            output.append(transliterate_preserving_english_sentences(content) + ending)
        else:
            output.append(current_line)
    return "".join(output)


def repair_missing_english(original: str, current: str) -> str:
    """Reconvert only lines where a newly protected English token was lost."""
    original_lines = original.splitlines(keepends=True)
    current_lines = current.splitlines(keepends=True)
    if len(original_lines) != len(current_lines):
        raise ValueError("Cannot repair a file whose line count changed")

    output: list[str] = []
    for source_line, current_line in zip(original_lines, current_lines, strict=True):
        expected = Counter(
            token.lower() for token in ROMAN_TOKEN.findall(source_line) if is_english(token)
        )
        present = Counter(token.lower() for token in ROMAN_TOKEN.findall(current_line))
        if any(present[token] < count for token, count in expected.items()):
            ending = "\n" if source_line.endswith("\n") else ""
            content = source_line[:-1] if ending else source_line
            output.append(transliterate(content) + ending)
        else:
            output.append(current_line)
    return "".join(output)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "paths",
        nargs="+",
        type=Path,
        help="Book directories or explicit Markdown files to convert.",
    )
    parser.add_argument("--write", action="store_true")
    parser.add_argument(
        "--from-head",
        action="store_true",
        help="Read each source file from HEAD, discarding an earlier generated pass.",
    )
    parser.add_argument(
        "--repair-english-from-head",
        action="store_true",
        help="Reconvert only lines where protected English from HEAD is missing.",
    )
    parser.add_argument(
        "--repair-english-sentences-from-head",
        action="store_true",
        help="Restore complete English sentences while converting their surrounding prose.",
    )
    parser.add_argument(
        "--repair-hindi-from-head",
        action="store_true",
        help="Reconvert lines containing audited Roman Hindi dictionary collisions.",
    )
    args = parser.parse_args()

    for source in args.paths:
        paths = [source] if source.is_file() else sorted(source.glob("*.md"))
        for path in paths:
            if args.from_head:
                original = subprocess.check_output(
                    ["git", "show", f"HEAD:{path.as_posix()}"], text=True
                )
            else:
                original = path.read_text()
            if (
                args.repair_english_from_head
                or args.repair_english_sentences_from_head
                or args.repair_hindi_from_head
            ):
                if not args.from_head:
                    raise ValueError("English repair modes require --from-head")
                if args.repair_hindi_from_head:
                    converted = repair_remaining_hindi(original, path.read_text())
                elif args.repair_english_sentences_from_head:
                    converted = repair_english_sentences(original, path.read_text())
                else:
                    converted = repair_missing_english(original, path.read_text())
            else:
                converted = convert_markdown(original)
            if args.write:
                path.write_text(converted)
                print(f"converted {path}")
            elif converted != original:
                print(f"would convert {path}")


if __name__ == "__main__":
    main()
