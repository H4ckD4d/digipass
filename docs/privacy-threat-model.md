# Privacy Threat Model

> **Original creator, project owner, and primary maintainer: Chris Cruz | h4ckd4d**

This document defines the privacy and abuse-resistance assumptions for h4ckd4d Digital Safety Intelligence.

## Protected interests

DSI is designed to protect:

- assessment confidentiality;
- user consent and control;
- minimal collection of personal data;
- safety of young people and families;
- integrity of risk calculations;
- clarity about what a finding does and does not prove.

## Primary threats

### Unintended data exfiltration

Risk: assessment data could leave the user's device through analytics, remote APIs, third-party assets, or telemetry.

Controls:

- dashboard has no external runtime dependencies;
- no analytics or advertising libraries;
- no network APIs in client-side code;
- CI statically rejects common outbound-network constructs.

### Unintended persistence

Risk: sensitive assessment data could remain in browser storage after the user expects a session to end.

Controls:

- no `localStorage`;
- no `sessionStorage`;
- no cookies;
- no IndexedDB use in the v1.1 dashboard;
- before/after comparisons are session-memory only.

### Overcollection

Risk: users or contributors could add unnecessary identifiers, secrets, precise locations, or private-message contents.

Controls:

- schemas limit accepted fields;
- project validator checks synthetic fixtures for prohibited sensitive fields;
- documentation repeatedly instructs users to minimize data;
- evidence records are designed around minimal context rather than content replication.

### Covert monitoring or third-party profiling

Risk: a safety tool could be repurposed to monitor someone who has not consented.

Controls:

- supported scope modes are `self` and `consensual-family`;
- no scraping or identity-search adapters;
- no location tracking;
- no hidden background collection;
- no account-access or credential workflows.

### Misinterpretation of risk scores

Risk: a score could be treated as proof of compromise, malicious intent, or wrongdoing.

Controls:

- scoring is deterministic and documented;
- reports state that scores are prioritization signals only;
- confidence is modeled separately;
- recommendations focus on protective controls, not accusations.

### Sensitive evidence amplification

Risk: preserving too much evidence can create a second privacy exposure.

Controls:

- evidence schema favors timestamps, platform context, brief description, and secure references;
- passwords, tokens, recovery codes, precise live locations, and unnecessary private content are out of scope;
- users are directed toward appropriate platform reporting and trusted support channels.

## Trust boundaries

```text
User-controlled assessment file
            ↓
Local browser or CLI process
            ↓
In-memory validation/scoring
            ↓
Local display or user-initiated export
```

There is no DSI-hosted backend in v1.1.

## Youth and family safety

DSI does not provide covert parental monitoring. Family features are designed around consent, shared safety planning, data minimization, and trusted support.

The project should not introduce features that help conceal monitoring from the person being monitored, bypass platform protections, or collect a young person's precise live location.

## Security review questions for contributors

Before adding a feature, ask:

1. Can the same protective outcome be achieved with less personal data?
2. Does the feature require a network request? If yes, can it remain local instead?
3. Does it create persistent storage? If yes, is persistence necessary and user-controlled?
4. Could the feature enable covert surveillance or non-consensual profiling?
5. Does the UI clearly distinguish risk prioritization from proof of harm or compromise?
6. Is the feature safe for consensual family use without encouraging overmonitoring?

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*
