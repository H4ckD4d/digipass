# Risk Model

> **Project owner: Chris Cruz | h4ckd4d**

The Digital Safety Intelligence score is a prioritization model for the user's own digital-safety review. It is not a diagnosis, a prediction of victimization, or proof of compromise.

## Dimensions

Each finding is represented through five dimensions:

| Dimension | Range | Meaning |
| --- | ---: | --- |
| Exposure | 0–5 | How publicly reachable or visible the condition is. |
| Impact | 0–5 | Potential consequence if the condition is abused. |
| Control weakness | 0–5 | Degree to which protective controls are missing or weak. |
| Confidence | 0–5 | Reliability of the input or observation. |
| Urgency | 0–5 | Need for near-term protective attention. |

## Weighted score

The initial deterministic model is:

```text
raw = exposure*4 + impact*5 + control_weakness*5 + confidence*2 + urgency*4
score = round(raw / 100 * 100)
```

Because the maximum weighted raw value is 100, the result is naturally normalized to `0–100`.

## Priority bands

| Score | Priority |
| ---: | --- |
| 0–20 | Informational |
| 21–40 | Low |
| 41–60 | Moderate |
| 61–80 | High |
| 81–100 | Urgent review |

`Urgent review` means the user should prioritize protective action and trusted support; it does not mean the project has confirmed an attack.

## Control examples

Protective controls that can reduce risk include:

- phishing-resistant MFA or strong MFA;
- unique passwords managed securely;
- reviewed recovery methods;
- private or limited profile visibility;
- removal of unnecessary precise-location sharing;
- account-login alerts;
- current device/software security updates;
- trusted recovery contacts where supported;
- platform blocking/reporting tools for unwanted contact.

## Confidence

Confidence is deliberately separate from severity. A potentially serious issue with weak evidence should not be presented as a confirmed event.

## Limitations

The model is intentionally simple for auditability. Future revisions should remain explainable, versioned, tested, and documented before changing weights.

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*
