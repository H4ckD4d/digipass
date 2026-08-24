# CrisisTrust

> **Open Human Safety & Verification Network**
>
> **Original creator, project owner, and primary maintainer: Chris Cruz | h4ckd4d**

**CrisisTrust** is an open-source, privacy-first project for turning urgent information into **source-aware, accessible, protective action** during crises.

The project addresses the gap between:

```text
Something happened
        ↓
Where did this information come from?
        ↓
What does the official source actually say?
        ↓
What protective action is recommended?
        ↓
Who in my trusted circle has checked in?
        ↓
What verified community resources are available?
```

## Mission

> When people are afraid, information must become trust — and trust must become safe action.

CrisisTrust is designed for disasters, extreme weather, public warnings, family check-ins, community resilience, and emergency-information verification. It does not replace emergency authorities, emergency services, or professional advice.

## v0.1 MVP

The first milestone focuses on five capabilities:

1. **AlertTrust** — ingest a normalized alert envelope derived from an official alert source, including CAP-compatible fields.
2. **Source Provenance** — record who issued an alert, how the source was identified, and whether message integrity was checked.
3. **Action Cards** — display the instruction provided by the authoritative source without inventing new emergency guidance.
4. **Trusted Circle Check-in** — session-only `safe`, `need-assistance`, or `unknown` status without permanent location tracking.
5. **Community Resources** — structured resources such as shelters, cooling centers, charging points, or official information points with source and verification metadata.

## Human-safety principles

1. Human safety before engagement.
2. Verified provenance before virality.
3. Official instructions before generated advice.
4. Privacy before tracking.
5. Consent before location sharing.
6. Accessibility by default.
7. Offline resilience where possible.
8. No advertising during suffering.
9. No sale of crisis data.
10. Open standards before vendor lock-in.

## What CrisisTrust does not do

CrisisTrust does not:

- claim that AI can determine whether an emergency is true;
- replace government or emergency-service instructions;
- continuously track people;
- collect precise personal location by default;
- sell crisis or family data;
- profile individuals;
- scrape private communications;
- use fear, urgency, or crisis status for advertising;
- automatically mark community reports as authoritative.

## Architecture

```text
Official / Declared Source
          ↓
Source Provenance
          ↓
Normalized Alert Envelope
          ↓
CAP-Compatible Semantics
          ↓
Human-readable Action Card
          ↓
Trusted Circle + Community Resources
          ↓
User-controlled protective action
```

See [`docs/architecture.md`](docs/architecture.md), [`docs/trust-model.md`](docs/trust-model.md), and [`docs/protocol.md`](docs/protocol.md).

## Standards foundation

CrisisTrust v0.1 uses the **OASIS Common Alerting Protocol (CAP) 1.2** as the initial interoperability reference. CAP standardizes emergency-alert fields such as event, severity, urgency, certainty, area information, and instructions.

For meteorological and hydrological alerting authorities, the project treats the **WMO Register of Alerting Authorities (RAA)** as an important reference for authority provenance. Registration is evidence about the issuer's authority; it is not a general-purpose truth oracle for every kind of crisis information.

See [`docs/cap-interop.md`](docs/cap-interop.md).

## Privacy model

The reference web prototype is designed to be local-first:

- no analytics;
- no advertising SDKs;
- no cookies;
- no automatic local/session storage;
- no background location tracking;
- no external runtime requests;
- imported demo/user data rendered with safe text APIs;
- export only when the user explicitly requests it.

## Repository layout

```text
crisistrust/
├── docs/
├── examples/
├── schemas/
├── scripts/
├── web/
├── CHANGELOG.md
├── CONTRIBUTING.md
├── DEVELOPERS.md
├── LICENSE
├── README.md
├── ROADMAP.md
└── SECURITY.md
```

## Developers wanted

We welcome developers, emergency-technology engineers, CAP implementers, accessibility specialists, privacy engineers, humanitarian technologists, disaster-risk specialists, UX researchers, translators, QA engineers, technical writers, and community-resilience practitioners.

High-value contributions include:

- CAP interoperability;
- provenance and integrity models;
- accessibility and multilingual design;
- offline-first synchronization research;
- community-resource verification;
- privacy-preserving trusted-circle design;
- threat modeling and abuse resistance;
- synthetic fixtures and tests;
- humanitarian UX research;
- open protocol review.

Accepted contributors receive credit through Git history, Pull Requests, releases, and acknowledgments. **Original authorship and project ownership remain attributed to Chris Cruz | h4ckd4d.**

## Project status

`v0.1-incubator` — protocol foundation and local MVP.

## License

MIT. See [`LICENSE`](LICENSE).

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*
