# Local Privacy & Safety Dashboard

> **Original creator, project owner, and primary maintainer: Chris Cruz | h4ckd4d**

The DSI dashboard is a local-first interface for reviewing a Digital Safety Intelligence assessment without uploading it to a backend service.

## Privacy design

The dashboard is intentionally simple:

- no backend;
- no analytics;
- no cookies;
- no CDN dependencies;
- no automatic browser storage;
- no `fetch`, XHR, WebSocket, or telemetry calls;
- no third-party profiling;
- no hidden monitoring.

Imported JSON is processed in the active browser session. Closing or refreshing the page clears the imported assessment unless the user separately retains the original file.

## Start the dashboard

The HTML can be opened directly from `web/index.html`, or it can be served on the local loopback interface:

```bash
python scripts/serve_dashboard.py
```

The local server binds to `127.0.0.1` only. The default port is `8765`.

## Current assessment

Use **Current assessment** to load a DSI-compatible JSON file. The dashboard validates:

- assessment version;
- explicit consent flag;
- supported scope mode;
- finding IDs;
- supported risk categories;
- 0–5 scoring dimensions;
- required title and protective recommendation.

A rejected assessment is not rendered.

## Before/after comparison

An optional prior assessment can be loaded to compare the average risk score with the current assessment.

The comparison exists only in memory. DSI does not write a history database or automatically retain imported assessments.

A lower current average indicates reduced assessed exposure/control weakness. It does not prove that every risk has been eliminated.

## Protection checklist

The dashboard includes a session-only checklist for common protective controls:

- strong MFA;
- recovery-method review;
- privacy audience review;
- location-sharing review;
- device lock and updates;
- trusted support/reporting plan.

The checklist is educational and is not automatically stored.

## Family mode

Family Digital Safety is based on shared planning rather than covert monitoring. Reviews should be limited to agreed accounts and settings, minimize identifiers, and avoid collecting private-message contents.

When a young person needs help with an online safety concern, DSI favors trusted-adult support and platform safety/reporting tools rather than independent investigation or confrontation.

## Report export

The browser can generate a Markdown report from the currently loaded assessment. Export is performed entirely client-side using a temporary browser object URL.

The report contains assessment findings and protective recommendations. Users should keep reports private and avoid adding passwords, recovery codes, tokens, precise live locations, or unnecessary private content to the source assessment.

## Developer validation

Run:

```bash
python scripts/validate_dashboard.py
```

The validator checks that the dashboard remains self-contained and rejects common network/persistence mechanisms such as external URLs, `fetch`, XHR, WebSockets, cookies, `localStorage`, and `sessionStorage`.

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*
