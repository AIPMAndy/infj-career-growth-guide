#!/usr/bin/env python3
"""Verify that actually deployed GitHub Pages bytes match this main checkout.

Run only AFTER deploy. A successful commit/build alone is not a live delivery.
"""
from __future__ import annotations

import hashlib
import json
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://aipmandy.github.io/infj-career-growth-guide/"
FILES = [
    "index.html", "evidence.html", "evidence.js",
    "robots.txt", "sitemap.xml", "pdf/infj-career-growth-guide-guide.pdf",
]


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main():
    edition = json.loads((ROOT / "pdf/edition.json").read_text(encoding="utf-8"))
    pdf = ROOT / edition["pdf_path"]
    if len(pdf.read_bytes()) != edition["bytes"]:
        raise SystemExit("FAIL: historical PDF bytes differ from edition manifest")
    if sha256(pdf.read_bytes()) != edition["sha256"]:
        raise SystemExit("FAIL: historical PDF SHA-256 differs from edition manifest")
    print("PASS historical PDF edition manifest: no PDF was regenerated")
    fail = []
    for name in FILES:
        expected = sha256((ROOT / name).read_bytes())
        url = BASE + quote(name, safe="/")
        last_error = None
        for attempt in range(9):
            try:
                req = Request(url + "?verify=" + expected[:14], headers={"User-Agent": "AIPMAndy-Pages-Live-QA/1.0"})
                with urlopen(req, timeout=25) as response:
                    status = response.status
                    body = response.read()
                actual = sha256(body)
                if status == 200 and actual == expected:
                    print(f"PASS live HTTP 200 SHA-256: {name} {actual}")
                    last_error = None
                    break
                last_error = f"HTTP {status}, expected {expected}, got {actual}"
            except (HTTPError, URLError, TimeoutError) as exc:
                last_error = repr(exc)
            if attempt < 8:
                time.sleep(12)
        if last_error:
            fail.append(f"{name}: {last_error}")
            print("FAIL live " + fail[-1])
    if fail:
        raise SystemExit(f"FAIL: {len(fail)}/{len(FILES)} live resources: " + "; ".join(fail))
    print(f"PASS {len(FILES)}/{len(FILES)} deployed website resources match main checkout")


if __name__ == "__main__":
    main()
