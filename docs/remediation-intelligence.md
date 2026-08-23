# Remediation Intelligence

> **Original creator, project owner, and primary maintainer: Chris Cruz | h4ckd4d**

DSI v1.3 adds a remediation layer that tracks protective actions without rewriting the original assessment.

## Lifecycle

```text
Finding
  ↓
Recommended Control
  ↓
Target Date (optional)
  ↓
In Progress
  ↓
Ready for Verification
  ↓
Human Verification
  ↓
Verified Closure
  ↓
Reassessment
```

The original assessment remains immutable. Remediation state is stored in a separate plan so a reviewer can distinguish what was observed from what was later changed.

## Status model

| Status | Meaning |
| --- | --- |
| `open` | Protective action has not started. |
| `in-progress` | The action is being implemented. |
| `ready-for-verification` | The action is believed complete and should be checked. |
| `verified` | A human confirmed the stated verification step. |
| `deferred` | The action is intentionally postponed. |
| `not-applicable` | The mapped control does not apply after review. |

`verified` is not set automatically. DSI requires a deliberate user action and records only a timestamp, not screenshots, secrets, device identifiers, or private-message contents.

## Control mapping

Every supported finding category maps to a defensive control and a verification step. Examples include:

- account security → strong MFA and session review;
- recovery → current recovery methods;
- privacy exposure → audience/public-data review;
- device security → lock and supported updates;
- location sharing → intentional permission review;
- data sharing → connected-app permission review;
- unwanted contact → blocking/reporting readiness;
- family safety → consent-based trusted support planning.

The control catalog is implemented in `web/remediation-core.js` and is deterministic.

## Progress metrics

DSI reports:

- total remediation items;
- verified items;
- actionable items;
- completion percentage;
- remaining prioritization score.

The **remaining prioritization score** is the average original score of items that are not `verified` or `not-applicable`. It is a workflow metric, not a guarantee that risk has been eliminated.

## Privacy boundary

Remediation data is local/session-only in the dashboard unless the user explicitly downloads the JSON plan.

The plan intentionally avoids:

- passwords or recovery secrets;
- private messages;
- precise location;
- account credentials;
- hidden telemetry;
- device fingerprints;
- screenshots or unrelated evidence.

Optional target dates are planning metadata only.

## Family and youth safety

In `consensual-family` mode, remediation is for shared safety planning. It must not be used for covert monitoring, secret location tracking, account access, or independent investigation.

Verification should focus on whether a protective control is in place, not on collecting more information about another person.

## Developer contribution areas

High-value contributions include:

- safer control mappings;
- clearer verification language;
- accessibility for remediation workflows;
- deterministic lifecycle tests;
- privacy-preserving export formats;
- multilingual protective guidance;
- improved workflow metrics that do not overstate certainty.

Accepted contributions are credited through Git history, Pull Requests, release notes, and acknowledgments where appropriate. Original project authorship and ownership remain attributed to **Chris Cruz | h4ckd4d**.

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*
