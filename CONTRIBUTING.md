# Contributing

> **Original creator, project owner, and primary maintainer: Chris Cruz | h4ckd4d**

Contributions are welcome when they improve privacy, digital safety, accessibility, documentation, data minimization, local-first tooling, defensive risk analysis, or family-safety education.

## Contribution principles

Every change should preserve these principles:

- consent before collection;
- data minimization by default;
- no third-party profiling;
- no precise-location tracking;
- no credential or secret collection;
- local/offline processing when possible;
- explainable scoring and recommendations;
- age-appropriate and family-safe design;
- synthetic or sanitized test data only.

## High-value contributions

- new self-assessment categories;
- safer risk-scoring logic;
- privacy-preserving schemas;
- accessibility improvements;
- multilingual documentation;
- educational checklists;
- local-first CLI/UI tooling;
- unit tests and synthetic fixtures;
- platform-independent account-security guidance;
- evidence-preservation workflows that minimize sensitive content.

## Do not submit

- passwords, recovery codes, private keys, tokens, or session data;
- real victim data;
- precise locations of minors;
- private conversations;
- stalking, surveillance, doxxing, impersonation, or identity-correlation features;
- tools that bypass privacy/security controls;
- integrations whose primary purpose is investigating third parties.

## Development workflow

Before opening a pull request:

```bash
python scripts/validate_project.py
python scripts/dsi.py validate examples/self-assessment.synthetic.json
python scripts/dsi.py score examples/self-assessment.synthetic.json
```

Describe in the PR:

1. what safety problem the change addresses;
2. what data it requires;
3. why that data is necessary;
4. how consent is established;
5. what is deliberately not collected;
6. expected false positives or scoring limitations;
7. tests or synthetic examples added.

## Attribution

Accepted contributors are credited through Git history, pull requests, release notes, and acknowledgments where appropriate. Contributor credit does not transfer original project authorship or ownership.

**Original authorship, project ownership, and primary maintenance remain attributed to Chris Cruz | h4ckd4d.**

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*
