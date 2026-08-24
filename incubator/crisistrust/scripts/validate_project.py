#!/usr/bin/env python3
"""Static validation for the CrisisTrust incubator.

No network access is performed.
"""

from __future__ import annotations

import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = [
    "README.md",
    "ROADMAP.md",
    "CONTRIBUTING.md",
    "DEVELOPERS.md",
    "SECURITY.md",
    "docs/architecture.md",
    "docs/trust-model.md",
    "docs/protocol.md",
    "docs/cap-interop.md",
    "docs/threat-model.md",
    "schemas/alert-envelope.schema.json",
    "schemas/action-card.schema.json",
    "schemas/checkin.schema.json",
    "schemas/community-resource.schema.json",
    "examples/alert.synthetic.json",
    "examples/checkins.synthetic.json",
    "examples/resources.synthetic.json",
    "web/index.html",
    "web/styles.css",
    "web/core.js",
    "web/app.js",
    "scripts/test_core.js",
]

FORBIDDEN_WEB_TOKENS = [
    "fetch(",
    "XMLHttpRequest",
    "WebSocket",
    "sendBeacon",
    "localStorage",
    "sessionStorage",
    "document.cookie",
]

FORBIDDEN_PERSON_TRACKING_KEYS = {
    "latitude",
    "longitude",
    "coordinates",
    "device_id",
    "advertising_id",
    "location_history",
}


def walk_keys(value):
    if isinstance(value, dict):
        for key, item in value.items():
            yield key
            yield from walk_keys(item)
    elif isinstance(value, list):
        for item in value:
            yield from walk_keys(item)


def load_json(path: Path, errors: list[str]):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"invalid JSON {path.relative_to(ROOT)}: {exc}")
        return None


def main() -> int:
    errors: list[str] = []

    for relative in REQUIRED:
        if not (ROOT / relative).is_file():
            errors.append(f"missing required file: {relative}")

    json_files = list((ROOT / "schemas").glob("*.json")) + list((ROOT / "examples").glob("*.json"))
    loaded = {}
    for path in json_files:
        loaded[path.name] = load_json(path, errors)

    alert = loaded.get("alert.synthetic.json")
    if isinstance(alert, dict):
        if alert.get("record_type") != "alert-envelope":
            errors.append("synthetic alert must be an alert-envelope")
        if alert.get("protocol_version") != "0.1":
            errors.append("synthetic alert must use protocol_version 0.1")
        if alert.get("source_status") not in {
            "official-registered", "official-declared", "community-verified", "community-unverified", "unknown"
        }:
            errors.append("synthetic alert has invalid source_status")
        if alert.get("integrity_status") not in {"verified", "not-verified", "failed", "not-applicable"}:
            errors.append("synthetic alert has invalid integrity_status")
        forbidden = sorted(set(walk_keys(alert)) & FORBIDDEN_PERSON_TRACKING_KEYS)
        if forbidden:
            errors.append(f"synthetic alert contains forbidden personal-tracking keys: {forbidden}")

    checkins = loaded.get("checkins.synthetic.json")
    if isinstance(checkins, list):
        for index, item in enumerate(checkins, start=1):
            if not isinstance(item, dict) or item.get("status") not in {"safe", "need-assistance", "unknown"}:
                errors.append(f"check-in fixture #{index} has invalid status")
            if isinstance(item, dict):
                forbidden = sorted(set(walk_keys(item)) & FORBIDDEN_PERSON_TRACKING_KEYS)
                if forbidden:
                    errors.append(f"check-in fixture #{index} contains personal-tracking keys: {forbidden}")

    web_files = [ROOT / "web" / "index.html", ROOT / "web" / "core.js", ROOT / "web" / "app.js"]
    web_text = {path.name: path.read_text(encoding="utf-8") for path in web_files if path.is_file()}
    for filename, text in web_text.items():
        for token in FORBIDDEN_WEB_TOKENS:
            if token in text:
                errors.append(f"web/{filename} contains forbidden network/persistence token: {token}")

    html = web_text.get("index.html", "")
    for required_text in [
        "Provenance is not a truth oracle",
        "Local session only",
        "Chris Cruz | h4ckd4d",
        "Trusted Circle",
        "Community resources",
    ]:
        if required_text.lower() not in html.lower():
            errors.append(f"web/index.html missing required safety/branding text: {required_text}")

    ids = re.findall(r'\bid="([^"]+)"', html)
    duplicates = sorted({item for item in ids if ids.count(item) > 1})
    if duplicates:
        errors.append(f"web/index.html contains duplicate ids: {duplicates}")

    if re.search(r"\son[a-zA-Z]+\s*=", html):
        errors.append("web/index.html contains inline event handlers")

    if errors:
        print("CrisisTrust validation failed:\n")
        for error in errors:
            print(f"- {error}")
        return 1

    print("CrisisTrust project validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
