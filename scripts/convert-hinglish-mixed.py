#!/usr/bin/env python3
"""Convert Romanized Hindi to Devanagari while preserving English tokens.

This is an editorial migration helper, not part of the production build. Run it
on explicit book directories and inspect every resulting diff.
"""

from __future__ import annotations

import argparse
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
}

EXPLICIT_ENGLISH = {
    "EMI", "HR", "PM", "ROI",
    "Instagram",
    "startup", "podcast", "podcasts", "layoff", "layoffs", "runway", "spreadsheet",
    "whistleblowing", "childcare", "cowardice", "dependents", "reversible", "irreversible",
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
    if token in EXPLICIT_ENGLISH or (token.isupper() and len(token) > 1):
        return True
    lower = token.lower()
    if lower in HINDI_ROMAN:
        return False
    if lower in ENGLISH_WORDS:
        return True
    for suffix in ("s", "es", "ed", "ing"):
        if lower.endswith(suffix) and lower[: -len(suffix)] in ENGLISH_WORDS:
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


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("directories", nargs="+", type=Path)
    parser.add_argument("--write", action="store_true")
    parser.add_argument(
        "--from-head",
        action="store_true",
        help="Read each source file from HEAD, discarding an earlier generated pass.",
    )
    args = parser.parse_args()

    for directory in args.directories:
        for path in sorted(directory.glob("*.md")):
            if args.from_head:
                original = subprocess.check_output(
                    ["git", "show", f"HEAD:{path.as_posix()}"], text=True
                )
            else:
                original = path.read_text()
            converted = convert_markdown(original)
            if args.write:
                path.write_text(converted)
                print(f"converted {path}")
            elif converted != original:
                print(f"would convert {path}")


if __name__ == "__main__":
    main()
