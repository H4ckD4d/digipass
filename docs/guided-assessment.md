# Guided Assessment

> **Original creator, project owner, and primary maintainer: Chris Cruz | h4ckd4d**

DSI v1.2 adds a browser-based guided assessment so users can build a valid Digital Safety Intelligence assessment without manually editing JSON.

## Design goals

The wizard is designed to be:

- local-only;
- consent-based;
- understandable by non-technical users;
- useful without collecting personal identifiers;
- compatible with the existing DSI assessment schema;
- deterministic and testable;
- suitable for self-assessment and consensual family safety planning.

## What the wizard asks

The guided assessment evaluates protective controls in eight areas:

| Area | Control question theme |
| --- | --- |
| Account Security | Strong MFA on important accounts |
| Recovery | Current and controlled recovery methods |
| Privacy & Public Exposure | Intentional public sharing |
| Devices | Screen lock and current security updates |
| Location Sharing | Review of unnecessary location-sharing permissions |
| Data Sharing | Review of connected applications and permissions |
| Unwanted Contact | Knowledge of blocking and platform reporting controls |
| Trusted Support | A trusted support or escalation plan |

The wizard does **not** request names, email addresses, usernames, passwords, recovery codes, private messages, coordinates, or precise live location.

## Answer semantics

Each question supports three answers:

- `Yes` — the control is considered present and does not create a finding;
- `No` — a protective finding is generated;
- `Not sure` — a finding is generated with reduced confidence, indicating that the control should be verified rather than assumed absent.

This distinction prevents uncertainty from being presented as a confirmed weakness.

## Data flow

```text
Choose assessment mode
        ↓
Answer eight control questions
        ↓
Review answers
        ↓
Generate local assessment object
        ↓
Validate against DSI rules
        ↓
Load into dashboard
        ↓
Optional local JSON download
        ↓
Risk scoring / report export
```

No step requires a network request.

## Assessment modes

### Self-assessment

Use for reviewing the user's own account, privacy, recovery, device, and safety controls.

### Consensual family assessment

Use only when the people involved understand and agree to the review. Family mode is intended for shared safety planning, not hidden monitoring or independent investigation.

## Risk generation

The wizard does not ask users to choose severity numbers. Each protective control has documented default dimensions for:

- exposure;
- impact;
- control weakness;
- confidence;
- urgency.

The existing DSI deterministic scoring model then calculates priority from the generated finding.

A generated score is a prioritization aid. It is not proof of compromise, wrongdoing, danger, or intent.

## Privacy properties

Wizard state exists only in JavaScript memory during the active page session. The project does not automatically write answers to browser storage.

Users may explicitly download the generated assessment JSON. That is an intentional user action, and the downloaded file should be treated as private security information.

## Accessibility

The wizard uses semantic buttons, radio inputs, status regions, keyboard focus management, and a review step before generating an assessment.

Contributors should preserve keyboard navigation, visible focus, understandable labels, responsive layouts, and screen-reader-compatible status messaging.

## Engineering structure

- `web/dsi-core.js` contains validation, scoring, question definitions, and assessment generation.
- `web/wizard.js` manages browser interaction and session state.
- `web/app.js` renders validated assessments and reports.
- `scripts/test_web_core.js` tests the pure JavaScript engine under Node.js.
- `scripts/validate_dashboard.py` enforces privacy and structural guarantees.

Keeping the core separate from the interface makes the risk logic independently reviewable and testable.

## Contributing

Developers, privacy engineers, educators, accessibility specialists, family-safety practitioners, QA engineers, and technical writers are invited to improve the guided assessment through professional Issues and Pull Requests.

High-value contributions include better question wording, accessibility testing, translations, explainability, test coverage, safer data models, and privacy-preserving usability improvements.

Accepted contributors receive credit through Git history, Pull Requests, release notes, and acknowledgments where appropriate. Original project authorship and ownership remain attributed to **Chris Cruz | h4ckd4d**.

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*
