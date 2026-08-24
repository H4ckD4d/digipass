# CrisisTrust Protocol v0.1

**Status:** Incubator draft  
**Project owner:** Chris Cruz | h4ckd4d

## Purpose

The CrisisTrust Protocol defines a small set of interoperable safety records that can be implemented by different clients without requiring a centralized vendor.

## Record types

v0.1 defines four record types:

1. `alert-envelope`
2. `action-card`
3. `checkin`
4. `community-resource`

Each type has a JSON Schema under `schemas/`.

## 1. Alert envelope

The alert envelope normalizes authoritative or community alert input without discarding provenance.

Required concepts:

```text
record_type
protocol_version
alert_id
source
source_status
integrity_status
sent_at
event
severity
urgency
certainty
area_description
instruction
```

Optional fields may include effective/expiry timestamps, language, CAP identifier, source URL, and human-readable description.

### CAP mapping

| CrisisTrust | CAP 1.2 concept |
| --- | --- |
| `alert_id` | `identifier` |
| `sent_at` | `sent` |
| `event` | `event` |
| `severity` | `severity` |
| `urgency` | `urgency` |
| `certainty` | `certainty` |
| `area_description` | `areaDesc` |
| `instruction` | `instruction` |

CrisisTrust adds explicit provenance/integrity fields because consumers need to know not only what an alert says, but what evidence supports the issuer attribution and message integrity.

## 2. Action Card

An Action Card is a presentation-oriented derivative of an alert envelope.

It must preserve:

- source identity;
- provenance status;
- integrity status;
- event;
- severity/urgency/certainty;
- affected-area description;
- source instruction;
- freshness/expiry state.

**Critical rule:** Action Cards must not silently replace authoritative instructions with LLM-generated emergency instructions.

## 3. Check-in

A check-in has minimal state:

```json
{
  "record_type": "checkin",
  "protocol_version": "0.1",
  "checkin_id": "CT-CHECKIN-DEMO-001",
  "alias": "Family member A",
  "status": "safe",
  "updated_at": "2026-08-23T20:00:00Z"
}
```

Allowed statuses:

- `safe`
- `need-assistance`
- `unknown`

No precise location is required.

## 4. Community resource

A resource record describes a public service/resource location. It is not a person-tracking record.

Required concepts:

- resource identifier;
- resource type;
- display name;
- area/address description;
- source;
- verification status;
- last verification time when available;
- availability note.

## Versioning

Protocol versions use semantic milestone numbering during incubation:

```text
0.1 — foundation
0.2 — signed provenance / TrustCheck research
0.3 — offline synchronization draft
1.0 — stable interoperability contract
```

Breaking schema changes before 1.0 require explicit migration notes.

## Extension policy

Implementations may add namespaced extension objects, but must not redefine the meaning of core fields.

## Privacy policy

A compliant v0.1 client should not require:

- precise personal GPS history;
- advertising identifiers;
- device fingerprinting;
- private messages;
- credentials;
- biometric identity inference.

## Safety policy

CrisisTrust records are informational and coordination primitives. They do not replace emergency authorities, emergency services, or professional instructions.

---

**Chris Cruz | h4ckd4d** — Original creator, project owner, and primary maintainer.
