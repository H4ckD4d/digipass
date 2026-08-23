#!/usr/bin/env python3
"""Static repository validation for h4ckd4d Digital Safety Intelligence.

No network access is performed.
"""

from __future__ import annotations

import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "README.md",
    "SECURITY.md",
    "CONTRIBUTING.md",
    "DEVELOPERS.md",
    "CHANGELOG.md",
    "LICENSE",
    "schemas/assessment.schema.json",
    "schemas/evidence.schema.json",
    "catalog/risk-taxonomy.json",
    "examples/self-assessment.synthetic.json",
    "examples/prior-assessment.synthetic.json",
    "scripts/dsi.py",
    "scripts/serve_dashboard.py",
    "scripts/validate_dashboard.py",
    "scripts/test_web_core.js",
    "web/index.html",
    "web/styles.css",
    "web/app.js",
    "web/dsi-core.js",
    "web/wizard.js",
    "docs/dashboard.md",
    "docs/guided-assessment.md",
    "docs/privacy-threat-model.md",
]

FORBIDDEN_KEYS = {
    "password", "passwords", "token", "tokens", "session_token", "session_cookie",
    "cookie", "cookies", "private_key", "recovery_code", "recovery_codes", "latitude",
    "longitude", "coordinates", "private_messages",
}


def walk_keys(value):
    if isinstance(value, dict):
        for key, item in value.items():
            yield key
            yield from walk_keys(item)
    elif isinstance(value, list):
        for item in value:
            yield from walk_keys(item)


def check_assessment(name: str, assessment, errors: list[str]) -> None:
    if not isinstance(assessment, dict):
        errors.append(f"{name} must contain a JSON object")
        return
    if assessment.get("consent_confirmed") is not True:
        errors.append(f"{name} must set consent_confirmed=true")
    mode = assessment.get("scope", {}).get("mode")
    if mode not in {"self", "consensual-family"}:
        errors.append(f"{name} uses invalid scope mode")
    found_forbidden = sorted(set(walk_keys(assessment)) & FORBIDDEN_KEYS)
    if found_forbidden:
        errors.append(f"{name} contains forbidden sensitive field(s): {found_forbidden}")


def main() -> int:
    errors: list[str] = []
    for relative in REQUIRED_FILES:
        if not (ROOT / relative).is_file():
            errors.append(f"missing required file: {relative}")

    json_paths = [
        ROOT / "schemas" / "assessment.schema.json",
        ROOT / "schemas" / "evidence.schema.json",
        ROOT / "catalog" / "risk-taxonomy.json",
        ROOT / "examples" / "self-assessment.synthetic.json",
        ROOT / "examples" / "prior-assessment.synthetic.json",
    ]

    loaded = {}
    for path in json_paths:
        try:
            loaded[path.name] = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"invalid JSON {path.relative_to(ROOT)}: {exc}")

    check_assessment("self-assessment.synthetic.json", loaded.get("self-assessment.synthetic.json"), errors)
    check_assessment("prior-assessment.synthetic.json", loaded.get("prior-assessment.synthetic.json"), errors)

    taxonomy = loaded.get("risk-taxonomy.json")
    if isinstance(taxonomy, dict):
        categories = taxonomy.get("categories")
        if not isinstance(categories, list) or not categories:
            errors.append("risk taxonomy must contain categories")
        else:
            ids = [item.get("id") for item in categories if isinstance(item, dict)]
            if len(ids) != len(set(ids)):
                errors.append("risk taxonomy contains duplicate category ids")

    if not (ROOT / "DigiPass-main.zip").is_file():
        errors.append("legacy DigiPass-main.zip historical artifact is missing")

    if errors:
        print("Digital Safety Intelligence validation failed:\n")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Digital Safety Intelligence repository validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
