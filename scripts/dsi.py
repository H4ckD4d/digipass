#!/usr/bin/env python3
"""Offline CLI for h4ckd4d Digital Safety Intelligence.

Project owner / original creator / primary maintainer: Chris Cruz | h4ckd4d

This tool performs local validation, deterministic scoring, and Markdown report
generation. It does not contact external services or collect third-party data.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

ALLOWED_CATEGORIES = {
    "account-security",
    "privacy-exposure",
    "recovery",
    "location-sharing",
    "unwanted-contact",
    "device-security",
    "data-sharing",
    "family-safety",
}

DIMENSIONS = ("exposure", "impact", "control_weakness", "confidence", "urgency")


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def validate_assessment(data: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    if data.get("version") != "1.0":
        errors.append("version must be '1.0'")
    if data.get("consent_confirmed") is not True:
        errors.append("consent_confirmed must be true")

    scope = data.get("scope")
    if not isinstance(scope, dict):
        errors.append("scope must be an object")
    else:
        if scope.get("mode") not in {"self", "consensual-family"}:
            errors.append("scope.mode must be self or consensual-family")
        if not isinstance(scope.get("description"), str) or not scope.get("description", "").strip():
            errors.append("scope.description is required")

    findings = data.get("findings")
    if not isinstance(findings, list):
        errors.append("findings must be an array")
        return errors

    seen_ids: set[str] = set()
    for index, finding in enumerate(findings, start=1):
        prefix = f"finding #{index}"
        if not isinstance(finding, dict):
            errors.append(f"{prefix} must be an object")
            continue

        finding_id = finding.get("id")
        if not isinstance(finding_id, str) or not finding_id.startswith("DSI-F-"):
            errors.append(f"{prefix}: invalid id")
        elif finding_id in seen_ids:
            errors.append(f"{prefix}: duplicate id {finding_id}")
        else:
            seen_ids.add(finding_id)

        if finding.get("category") not in ALLOWED_CATEGORIES:
            errors.append(f"{prefix}: unsupported category {finding.get('category')!r}")

        for field in DIMENSIONS:
            value = finding.get(field)
            if not isinstance(value, int) or isinstance(value, bool) or not 0 <= value <= 5:
                errors.append(f"{prefix}: {field} must be an integer from 0 to 5")

        if not isinstance(finding.get("title"), str) or not finding.get("title", "").strip():
            errors.append(f"{prefix}: title is required")
        if not isinstance(finding.get("recommendation"), str) or not finding.get("recommendation", "").strip():
            errors.append(f"{prefix}: recommendation is required")

    return errors


def score_finding(finding: dict[str, Any]) -> int:
    raw = (
        finding["exposure"] * 4
        + finding["impact"] * 5
        + finding["control_weakness"] * 5
        + finding["confidence"] * 2
        + finding["urgency"] * 4
    )
    return max(0, min(100, round(raw)))


def priority(score: int) -> str:
    if score <= 20:
        return "Informational"
    if score <= 40:
        return "Low"
    if score <= 60:
        return "Moderate"
    if score <= 80:
        return "High"
    return "Urgent review"


def scored_findings(data: dict[str, Any]) -> list[tuple[int, dict[str, Any]]]:
    rows = [(score_finding(finding), finding) for finding in data["findings"]]
    return sorted(rows, key=lambda item: (-item[0], item[1]["id"]))


def render_report(data: dict[str, Any]) -> str:
    rows = scored_findings(data)
    lines = [
        "# Digital Safety Intelligence Report",
        "",
        f"**Assessment:** `{data.get('assessment_id', 'unknown')}`  ",
        f"**Scope:** `{data['scope']['mode']}`  ",
        "**Processing:** local/offline",
        "",
        "> This report prioritizes protective actions. A score is not proof of compromise, intent, or wrongdoing.",
        "",
        "## Prioritized findings",
        "",
        "| Score | Priority | Category | Finding |",
        "| ---: | --- | --- | --- |",
    ]

    for score, finding in rows:
        title = finding["title"].replace("|", "/")
        lines.append(f"| {score} | {priority(score)} | {finding['category']} | {title} |")

    lines.extend(["", "## Recommended actions", ""])
    for score, finding in rows:
        lines.extend(
            [
                f"### {finding['id']} — {finding['title']}",
                "",
                f"**Priority:** {priority(score)} ({score}/100)",
                "",
                finding["recommendation"],
                "",
            ]
        )

    lines.extend(
        [
            "## Privacy note",
            "",
            "Keep assessment files private. Do not add passwords, recovery codes, session tokens, precise live locations, or private-message contents.",
            "",
            "---",
            "",
            "**Chris Cruz | h4ckd4d**  ",
            "Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  ",
            "OSCP | CEH | CISSP | MITRE ATT&CK® Contributor",
            "",
            "**Founder — Project h4ckd4d**  ",
            "Technology for Child Protection • OSINT • Threat Intelligence",
            "",
            '*"Protect. Detect. Defend."*',
            "",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="h4ckd4d Digital Safety Intelligence offline CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    for command in ("validate", "score", "report"):
        sub = subparsers.add_parser(command)
        sub.add_argument("assessment", type=Path)
        if command == "report":
            sub.add_argument("--output", type=Path)

    args = parser.parse_args()

    try:
        data = load_json(args.assessment)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"Unable to read assessment: {exc}")
        return 2

    errors = validate_assessment(data)
    if errors:
        print("Assessment validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    if args.command == "validate":
        print(f"Assessment is valid: {len(data['findings'])} finding(s).")
        return 0

    if args.command == "score":
        for score, finding in scored_findings(data):
            print(f"{finding['id']}\t{score}\t{priority(score)}\t{finding['title']}")
        return 0

    report = render_report(data)
    if args.output:
        args.output.write_text(report, encoding="utf-8")
        print(f"Report written to {args.output}")
    else:
        print(report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
