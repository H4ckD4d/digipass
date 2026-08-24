# CrisisTrust Architecture

**Project owner:** Chris Cruz | h4ckd4d

## Objective

CrisisTrust separates four concepts that are often collapsed during emergencies:

```text
Information
    ≠
Source provenance
    ≠
Protective instruction
    ≠
Human safety status
```

A message can be authentic yet outdated. A source can be recognized while a specific message still requires integrity checks. A check-in can report that a person is safe without revealing their precise location.

## v0.1 components

### 1. AlertTrust

Accepts a normalized alert envelope containing:

- alert identifier;
- source identifier and display name;
- source provenance status;
- integrity status;
- CAP-compatible event, severity, urgency, and certainty;
- effective and expiry times when available;
- human-readable affected-area description;
- authoritative instruction text;
- source reference.

### 2. Provenance layer

Provenance answers:

> Where did this message come from and what evidence supports that attribution?

It does **not** answer:

> Is every statement in the message objectively true?

### 3. Action Card

Action Cards summarize the alert while preserving the authoritative instruction. The reference implementation must not generate new emergency instructions with an LLM or silently rewrite safety-critical meaning.

### 4. Trusted Circle

Trusted Circle state is intentionally minimal:

```text
alias
status = safe | need-assistance | unknown
updated_at
```

The v0.1 protocol does not require precise location, movement history, contacts, device identifiers, or background monitoring.

### 5. Community Resources

Resources are service locations or public support points, not people. Examples include:

- shelters;
- cooling centers;
- public charging points;
- water distribution points;
- medical facilities;
- official information points.

Each resource requires provenance and verification metadata.

## Data flow

```text
Alert source
    ↓
Parser / adapter
    ↓
Normalized alert envelope
    ↓
Schema validation
    ↓
Provenance assessment
    ↓
Action Card
    ↓
Local dashboard
    ├── trusted-circle check-in
    └── community resources
```

## Trust boundary

The client should distinguish:

- `official-registered`;
- `official-declared`;
- `community-verified`;
- `community-unverified`;
- `unknown`.

These labels describe **provenance confidence**, not absolute truth.

## Offline-first direction

The v0.1 reference app is static and local-first. Future synchronization must preserve:

- user consent;
- minimal disclosure;
- no continuous location tracking;
- explicit retention policy;
- cryptographic integrity where feasible;
- ability to operate in degraded connectivity.

## Future architecture

```text
CAP / Official feeds
       ↓
CrisisTrust adapters
       ↓
Protocol core
       ↓
┌───────────────┬────────────────┐
│               │                │
Mobile/PWA   NGO node       Community node
│               │                │
└───────────────┴────────────────┘
       ↓
Privacy-preserving synchronization
```

---

**Chris Cruz | h4ckd4d** — Original creator, project owner, and primary maintainer.
