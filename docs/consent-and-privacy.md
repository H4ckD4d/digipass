# Consent and Privacy Model

> **Project owner: Chris Cruz | h4ckd4d**

Digital Safety Intelligence treats consent and data minimization as technical requirements, not optional documentation.

## Consent rules

An assessment should be limited to:

- the user's own accounts, devices, domains, and public profiles;
- family safety planning where the relevant people understand the purpose and scope;
- environments the user is authorized to administer.

The project should not provide workflows for covert monitoring or profiling of another person.

## Data-minimization rules

Prefer categories and booleans over raw sensitive values. For example:

- record `mfa_enabled: true` instead of an authenticator secret;
- record `recovery_email_reviewed: true` instead of storing a recovery address when it is not necessary;
- record `location_exposure: medium` instead of storing coordinates;
- record that an incident screenshot exists instead of embedding unrelated private conversations.

## Youth and family design

When supporting a young person:

- avoid precise location and school identifiers;
- avoid publishing usernames or contact details;
- explain recommendations in age-appropriate language;
- encourage support from a trusted adult when a situation is confusing, threatening, or persistent;
- use platform safety/reporting tools rather than independent investigation;
- preserve only the information necessary for a legitimate report.

## Retention

Assessment files should be easy to delete. Applications built on this project should avoid cloud retention by default and provide clear export/delete controls.

## Transparency

Every risk score should be explainable from the input fields. Hidden profiling or inferred sensitive traits are outside project scope.

## Reference frameworks

The methodology borrows general concepts from NIST CSF 2.0 and the NIST Privacy Framework. These frameworks are reference material only and do not imply endorsement or certification.

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*
