# Contributing to CrisisTrust

> **Original creator, project owner, and primary maintainer: Chris Cruz | h4ckd4d**

Thank you for helping build safer crisis-information infrastructure.

## Contribution principles

Every contribution must preserve:

- human safety;
- source transparency;
- visible uncertainty;
- privacy and data minimization;
- accessibility;
- interoperability;
- reviewable logic;
- no hidden tracking or advertising.

## Good contribution areas

- CAP adapters and fixtures;
- protocol/schema review;
- provenance models;
- accessibility;
- translations;
- community-resource verification;
- privacy-preserving synchronization research;
- tests and CI;
- humanitarian UX;
- threat modeling;
- documentation.

## Pull Request expectations

A PR should explain:

1. the human problem being solved;
2. data collected or retained;
3. network behavior introduced;
4. effect on crisis-time safety;
5. effect on accessibility;
6. effect on provenance or trust semantics;
7. automated tests added;
8. backward-compatibility impact.

## Safety-sensitive changes

Changes affecting alerts, instructions, source status, check-ins, or community resources require extra review.

Do not:

- replace authoritative safety instructions with generated advice;
- add continuous personal location tracking;
- add crisis-data advertising;
- hide provenance uncertainty;
- automatically promote community information to official status;
- add biometric identity inference as a trust shortcut;
- add telemetry without explicit architectural review.

## Commit convention

Recommended examples:

```text
feat(protocol): add resource freshness metadata
fix(trust): preserve unknown provenance state
docs(cap): clarify CAP field mapping
test(core): add stale alert coverage
refactor(web): separate action-card rendering
```

## Contributor credit

Accepted contributions are credited through Git history, PRs, release notes, and acknowledgments where appropriate.

Original project ownership remains attributed to **Chris Cruz | h4ckd4d**.
