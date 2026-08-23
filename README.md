# h4ckd4d Digital Safety Intelligence

> **Original creator, project owner, and primary maintainer: Chris Cruz | h4ckd4d**

**h4ckd4d Digital Safety Intelligence (DSI)** is a privacy-first defensive framework for helping individuals and families understand their own digital exposure, prioritize account and privacy risks, preserve minimal evidence when something concerning happens, and improve everyday online safety.

The project intentionally avoids third-party profiling, covert surveillance, location tracking, credential collection, and unauthorized scraping. It is designed around **consent, data minimization, local processing, explainable risk scoring, practical protective actions, and human-verified remediation**.

> **Safety boundary:** DSI is for self-assessment, consensual family safety planning, education, and defensive review. It must not be used to locate, monitor, impersonate, harass, profile, or investigate another person without a legitimate and lawful basis.

## Mission

```text
Understand your exposure
        ↓
Reduce unnecessary public data
        ↓
Strengthen accounts and recovery paths
        ↓
Recognize suspicious or harmful contact
        ↓
Apply protective controls
        ↓
Verify remediation
        ↓
Reassess and improve
```

## Core pillars

| Pillar | Purpose |
| --- | --- |
| Self-Exposure Assessment | Review the user's own public-facing digital footprint and account inventory. |
| Privacy Risk | Identify unnecessary exposure and weak recovery/security controls. |
| Account Security | Promote strong authentication, recovery hygiene, and phishing-resistant practices. |
| Family Digital Safety | Provide consent-based safety planning for families and young people. |
| Evidence Preservation | Preserve minimal, relevant records without escalating or investigating independently. |
| Safety Intelligence | Turn observations into prioritized, explainable protective actions. |
| Remediation Intelligence | Track controls, verification, and closure without rewriting the original assessment. |

## What DSI does not do

DSI does not:

- scrape social networks for third-party profiles;
- infer private traits about people;
- track precise location;
- collect private messages or passwords;
- bypass account protections;
- search for exposed minors;
- perform doxxing or identity correlation against third parties;
- automate confrontation or retaliation;
- treat a public observation as proof of wrongdoing;
- treat a clicked status as proof that risk is eliminated.

## Architecture

```text
Consent / Self-Declared Scope
            ↓
Guided or Imported Assessment
            ↓
Data Minimization
            ↓
Exposure Classification
            ↓
Risk + Confidence Scoring
            ↓
Protective Recommendations
            ↓
Remediation Plan
            ↓
Human Verification
            ↓
Reassessment
```

See [`docs/architecture.md`](docs/architecture.md).

## DSI v1.3 Remediation Intelligence

DSI v1.3 turns findings into a trackable protective lifecycle while keeping the original assessment immutable.

```text
Finding
  ↓
Recommended Control
  ↓
Target Date (optional)
  ↓
Open / In Progress
  ↓
Ready for Verification
  ↓
Human Verification
  ↓
Verified Closure
  ↓
Reassessment
```

Each remediation item includes:

- original finding ID and score;
- normalized control ID;
- protective control;
- explicit verification step;
- workflow status;
- optional target date;
- verification timestamp only when a human marks closure as verified.

Supported statuses are `open`, `in-progress`, `ready-for-verification`, `verified`, `deferred`, and `not-applicable`.

The dashboard can export the remediation plan as JSON only through an explicit user action. No remediation state is persisted automatically.

See [`docs/remediation-intelligence.md`](docs/remediation-intelligence.md).

## DSI v1.2 Guided Assessment

DSI v1.2 lets non-technical users build a valid assessment directly in the local dashboard without editing JSON.

```text
Choose self or consensual-family mode
        ↓
Answer eight control-focused questions
        ↓
Review answers
        ↓
Generate assessment locally
        ↓
Validate + score
        ↓
Load into dashboard
        ↓
Optional local JSON / Markdown export
```

The wizard asks about protective controls only: MFA, recovery, privacy audiences, device security, location-sharing review, connected apps, blocking/reporting knowledge, and trusted support planning.

It does **not** request names, usernames, email addresses, passwords, recovery codes, private messages, coordinates, or precise live location.

Answers support `Yes`, `No`, and `Not sure`. Uncertainty generates a review finding with reduced confidence rather than pretending a weakness is confirmed.

See [`docs/guided-assessment.md`](docs/guided-assessment.md).

## Local Privacy & Safety Dashboard

The dashboard runs entirely on the user's device.

```text
Guided or imported assessment
      ↓
Local browser validation
      ↓
Risk scorecards + priorities
      ↓
Remediation Intelligence
      ↓
Optional prior-assessment comparison
      ↓
Session-only protection checklist
      ↓
User-initiated JSON / Markdown export
```

The dashboard has **no backend, analytics, cookies, CDN dependencies, automatic browser storage, or external runtime requests**.

Start it on loopback only:

```bash
python scripts/serve_dashboard.py
```

Then open the local address printed by the command. The default is `127.0.0.1:8765`.

You can also open `web/index.html` directly.

See:

- [`docs/dashboard.md`](docs/dashboard.md)
- [`docs/guided-assessment.md`](docs/guided-assessment.md)
- [`docs/remediation-intelligence.md`](docs/remediation-intelligence.md)
- [`docs/privacy-threat-model.md`](docs/privacy-threat-model.md)

## Offline-first CLI

The CLI performs local validation and scoring only. It does **not** query websites or external services.

```bash
python scripts/dsi.py validate examples/self-assessment.synthetic.json
python scripts/dsi.py score examples/self-assessment.synthetic.json
python scripts/dsi.py report examples/self-assessment.synthetic.json
```

## Risk model

DSI separates:

- **exposure** — how visible or reachable something is;
- **impact** — potential consequence if the exposure is abused;
- **control strength** — MFA, recovery, privacy settings, and account hygiene;
- **confidence** — how reliable the input is;
- **urgency** — whether the issue requires immediate protective attention.

A high score is a prioritization signal, not proof that an account or person is compromised. A remediation completion percentage is a workflow metric, not proof that all risk has disappeared.

See [`docs/risk-model.md`](docs/risk-model.md).

## Initial playbooks

- [`playbooks/self-exposure-assessment.md`](playbooks/self-exposure-assessment.md)
- [`playbooks/family-digital-safety.md`](playbooks/family-digital-safety.md)
- [`playbooks/evidence-preservation.md`](playbooks/evidence-preservation.md)

## Privacy and consent

The project follows four non-negotiable rules:

1. Collect the minimum necessary data.
2. Prefer user-entered, self-owned information.
3. Do not retain secrets such as passwords, session tokens, recovery codes, or private-message contents.
4. For young people, minimize identifiers and precise location data and prioritize trusted-adult support and platform safety tools over independent investigation.

See [`docs/consent-and-privacy.md`](docs/consent-and-privacy.md).

## Standards alignment

DSI uses established security and privacy concepts as reference points, including:

- NIST Cybersecurity Framework 2.0;
- NIST Privacy Framework;
- strong authentication and phishing-resistant MFA guidance;
- least privilege, data minimization, recovery planning, and incident documentation practices.

These references guide the methodology; they do not imply endorsement, certification, or affiliation.

## Developers wanted

**Developers, privacy engineers, cybersecurity practitioners, educators, child-safety specialists, UX/accessibility designers, frontend engineers, data-model engineers, QA engineers, and technical writers are invited to help improve DSI professionally.**

High-value contributions include:

- privacy-preserving data models;
- safer risk-scoring methods;
- remediation control mappings and verification language;
- family digital-safety education;
- accessible guided-assessment and remediation UX;
- translations and age-appropriate wording;
- local-first tooling;
- test fixtures and schema validation;
- evidence-handling guidance that minimizes sensitive data;
- integrations that preserve consent and do not enable surveillance.

Accepted contributors receive credit through Git history, pull requests, release notes, and acknowledgments where appropriate. **Original authorship, project ownership, and primary maintenance remain attributed to Chris Cruz | h4ckd4d.**

See [`DEVELOPERS.md`](DEVELOPERS.md).

## Project ecosystem

```text
Internet Exposure Query Atlas
            ↓
Internet Exposure Intelligence
            ↓
Detection Engineering
            ↓
Digital Safety Intelligence
            ↓
Protect. Detect. Defend.
```

## Legacy archive

The original `DigiPass-main.zip` remains in the repository as a historical artifact. It is not part of the DSI architecture or validation pipeline.

## License

Released under the MIT License. See [`LICENSE`](LICENSE).

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*
