# CrisisTrust Threat Model

**Project owner:** Chris Cruz | h4ckd4d

## Safety objective

CrisisTrust operates during moments when people may be stressed, time-constrained, and more vulnerable to misinformation or coercion. Therefore safety failures can be more harmful than ordinary application bugs.

## Assets to protect

- authenticity and provenance metadata;
- integrity of authoritative instructions;
- user check-in privacy;
- trusted-circle membership data;
- community-resource status;
- accessibility of critical information;
- local assessment/session state.

## Primary threats

### Source impersonation

An attacker or mistaken source may present a message as official.

Controls:

- explicit `source_status`;
- authority-registry/reference metadata;
- no generic `verified=true` truth flag;
- integrity state displayed separately;
- source reference retained.

### Stale but authentic alerts

A real warning may have expired or been superseded.

Controls:

- sent/effective/expiry timestamps;
- visible freshness state;
- no automatic assumption that trusted source equals current alert.

### Instruction corruption

A client could alter or summarize critical guidance incorrectly.

Controls:

- preserve authoritative instruction text;
- show source;
- no LLM-generated replacement in the critical path;
- schema validation and tests.

### Crisis-data surveillance

Check-in or location information could become a tracking system.

Controls:

- no continuous location collection;
- no precise location required for check-in;
- session-only reference client;
- explicit export only;
- data minimization.

### Community-resource misinformation

A resource could be incorrectly marked open, safe, or available.

Controls:

- verification status;
- source attribution;
- last verification timestamp;
- availability note;
- community information never inherits official-authority status automatically.

### Panic-amplifying UX

Visual design or wording could create unnecessary fear.

Controls:

- avoid sensational language;
- show severity/urgency/certainty as source fields;
- distinguish unknown from confirmed;
- emphasize official instructions and clear next steps.

### Accessibility failure

Critical information may be inaccessible to people using assistive technologies or people with limited language proficiency.

Controls:

- semantic HTML;
- keyboard usability;
- screen-reader labels;
- simple-language layer without replacing the source instruction;
- multilingual architecture roadmap.

### Malicious extension / dependency

Third-party runtime dependencies could exfiltrate crisis data.

Controls in v0.1:

- no CDN;
- no analytics;
- no external JavaScript dependencies;
- privacy validator rejects runtime network APIs;
- minimal dependency surface.

## Security principle

> In CrisisTrust, uncertainty should remain visible rather than being replaced with false confidence.

## Out of scope for v0.1

- live emergency-feed ingestion;
- cryptographic signature implementation;
- peer-to-peer synchronization;
- precise navigation/routing;
- automated identity verification;
- predictive emergency classification.

These require separate design and review before introduction.

---

**Chris Cruz | h4ckd4d** — Original creator, project owner, and primary maintainer.
