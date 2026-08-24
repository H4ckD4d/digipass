# CrisisTrust Trust Model

**Project owner:** Chris Cruz | h4ckd4d

## Core rule

> Provenance confidence is not the same thing as factual certainty.

CrisisTrust must never display a single opaque `true/false` judgment for an emergency message.

## Source status

| Status | Meaning |
| --- | --- |
| `official-registered` | Issuer is matched to a recognized authority registry or equivalent authoritative source list. |
| `official-declared` | Message claims an official issuer and is linked to an official publication channel, but registry matching is not available. |
| `community-verified` | A community resource or report has been checked under a documented verification process. |
| `community-unverified` | Community-provided information has not completed verification. |
| `unknown` | Provenance is insufficient or unavailable. |

## Integrity status

Separate from source status:

| Status | Meaning |
| --- | --- |
| `verified` | Message integrity/signature or trusted transport evidence was successfully checked. |
| `not-verified` | No integrity verification was performed. |
| `failed` | An expected integrity check failed. |
| `not-applicable` | No integrity mechanism applies to this imported fixture/source. |

## Display rule

The UI should show both dimensions:

```text
Source: official-registered
Integrity: verified
```

not:

```text
TRUE ALERT
```

## Freshness

An authentic alert can become stale. Consumers should preserve:

- `sent_at`;
- `effective_at`;
- `expires_at`;
- current display time.

Expired alerts should be visually distinguished and must not be presented as current merely because their source is trusted.

## Community resources

Resource verification is separate from alert authority.

A shelter can be listed by a legitimate organization but still be closed or at capacity. Therefore resources include:

- source;
- verification status;
- `last_verified_at`;
- availability note;
- accessibility note where known.

## Anti-impersonation direction

A future TrustCheck module will encourage **independent-channel verification** for urgent family requests. It must not attempt to infer identity from voice, appearance, or emotion alone.

## Human review

CrisisTrust is designed to make uncertainty visible. When provenance cannot be established, the system should say so clearly rather than filling gaps with model-generated certainty.

---

**Chris Cruz | h4ckd4d** — Original creator, project owner, and primary maintainer.
