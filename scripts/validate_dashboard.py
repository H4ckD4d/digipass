#!/usr/bin/env python3
"""Static privacy validation for the DSI local dashboard.

Project owner / original creator / primary maintainer: Chris Cruz | h4ckd4d
"""

from __future__ import annotations

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
REQUIRED = [WEB / "index.html", WEB / "styles.css", WEB / "app.js"]

FORBIDDEN_JS = [
    "fetch(",
    "XMLHttpRequest",
    "WebSocket",
    "sendBeacon",
    "localStorage",
    "sessionStorage",
    "document.cookie",
]

FORBIDDEN_HTML = [
    "http://",
    "https://",
    "<iframe",
    "<form",
]


def main() -> int:
    errors: list[str] = []

    for path in REQUIRED:
        if not path.is_file():
            errors.append(f"missing dashboard file: {path.relative_to(ROOT)}")

    if errors:
        print("Dashboard validation failed:")
        print("\n".join(f"- {error}" for error in errors))
        return 1

    html = (WEB / "index.html").read_text(encoding="utf-8")
    js = (WEB / "app.js").read_text(encoding="utf-8")

    for token in FORBIDDEN_HTML:
        if token in html:
            errors.append(f"web/index.html contains forbidden external/persistence construct: {token}")

    for token in FORBIDDEN_JS:
        if token in js:
            errors.append(f"web/app.js contains forbidden network/persistence construct: {token}")

    required_text = [
        "Local processing only",
        "Chris Cruz | h4ckd4d",
        "Protect. Detect. Defend.",
        "consent",
    ]
    for token in required_text:
        if token.lower() not in html.lower():
            errors.append(f"web/index.html missing required safety/branding text: {token}")

    if "textContent" not in js:
        errors.append("web/app.js must use textContent for rendering imported user content")

    if errors:
        print("Dashboard validation failed:")
        print("\n".join(f"- {error}" for error in errors))
        return 1

    print("Dashboard validation passed: local-only, no automatic persistence, required safety text present.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
