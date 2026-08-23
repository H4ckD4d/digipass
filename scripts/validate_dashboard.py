#!/usr/bin/env python3
"""Static privacy and structure validation for the DSI local dashboard.

Project owner / original creator / primary maintainer: Chris Cruz | h4ckd4d
"""

from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
REQUIRED = [
    WEB / "index.html",
    WEB / "styles.css",
    WEB / "app.js",
    WEB / "dsi-core.js",
    WEB / "wizard.js",
]

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


class StructureParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.inline_handlers: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name == "id" and value:
                self.ids.append(value)
            if name.lower().startswith("on"):
                self.inline_handlers.append(f"{tag}[{name}]")


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
    scripts = {path.name: path.read_text(encoding="utf-8") for path in WEB.glob("*.js")}

    for token in FORBIDDEN_HTML:
        if token in html:
            errors.append(f"web/index.html contains forbidden external/persistence construct: {token}")

    parser = StructureParser()
    parser.feed(html)
    duplicate_ids = sorted(identifier for identifier, count in Counter(parser.ids).items() if count > 1)
    if duplicate_ids:
        errors.append(f"web/index.html contains duplicate id(s): {duplicate_ids}")
    if parser.inline_handlers:
        errors.append(f"web/index.html contains inline event handler(s): {parser.inline_handlers}")

    for filename, js in scripts.items():
        for token in FORBIDDEN_JS:
            if token in js:
                errors.append(f"web/{filename} contains forbidden network/persistence construct: {token}")

    required_text = [
        "Local processing only",
        "Chris Cruz | h4ckd4d",
        "Protect. Detect. Defend.",
        "consent",
        "Guided safety assessment",
        "No personal identifiers requested",
    ]
    for token in required_text:
        if token.lower() not in html.lower():
            errors.append(f"web/index.html missing required safety/branding text: {token}")

    app_js = scripts.get("app.js", "")
    wizard_js = scripts.get("wizard.js", "")
    core_js = scripts.get("dsi-core.js", "")
    if "textContent" not in app_js or "textContent" not in wizard_js:
        errors.append("dashboard rendering must use textContent for imported/generated user-visible content")
    if "wizardQuestions" not in core_js or "buildAssessment" not in core_js:
        errors.append("web/dsi-core.js must expose guided assessment definitions and builder")
    if "consensual-family" not in core_js:
        errors.append("guided assessment engine must preserve explicit consensual-family scope")

    if errors:
        print("Dashboard validation failed:")
        print("\n".join(f"- {error}" for error in errors))
        return 1

    print("Dashboard validation passed: local-only, no automatic persistence, unique DOM ids, no inline handlers, required safety text present.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
