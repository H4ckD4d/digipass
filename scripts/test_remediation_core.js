"use strict";

const assert = require("node:assert/strict");
const core = require("../web/dsi-core.js");
const remediation = require("../web/remediation-core.js");

const assessment = {
  assessment_id: "H4D-DSI-TEST-0001",
  version: "1.0",
  consent_confirmed: true,
  scope: { mode: "self", description: "Synthetic test assessment." },
  findings: [
    {
      id: "DSI-F-TEST-0001",
      category: "account-security",
      title: "Synthetic missing MFA control",
      exposure: 4,
      impact: 5,
      control_weakness: 5,
      confidence: 5,
      urgency: 4,
      recommendation: "Enable strong MFA."
    },
    {
      id: "DSI-F-TEST-0002",
      category: "privacy-exposure",
      title: "Synthetic privacy review",
      exposure: 3,
      impact: 2,
      control_weakness: 3,
      confidence: 5,
      urgency: 2,
      recommendation: "Review audience settings."
    }
  ]
};

assert.deepEqual(core.validateAssessment(assessment), []);

const plan = remediation.generatePlan(assessment, "2026-08-23T19:20:00Z");
assert.equal(plan.plan_id, "H4D-DSI-REM-20260823192000");
assert.equal(plan.items.length, 2);
assert.equal(plan.items[0].finding_id, "DSI-F-TEST-0001");
assert.equal(plan.items[0].status, "open");
assert.equal(plan.items[0].target_date, null);
assert.deepEqual(remediation.validatePlan(plan), []);

const inProgress = remediation.updateItem(plan, "DSI-F-TEST-0001", {
  status: "in-progress",
  target_date: "2026-09-01"
});
assert.equal(inProgress.items[0].status, "in-progress");
assert.equal(inProgress.items[0].target_date, "2026-09-01");
assert.equal(inProgress.items[0].verified_at, null);

const verified = remediation.updateItem(inProgress, "DSI-F-TEST-0001", {
  status: "verified"
}, "2026-08-23T19:30:00Z");
assert.equal(verified.items[0].verified_at, "2026-08-23T19:30:00Z");

const summary = remediation.summarize(verified);
assert.equal(summary.total, 2);
assert.equal(summary.verified, 1);
assert.equal(summary.actionable, 1);
assert.equal(summary.completion_percent, 50);
assert.equal(summary.remaining_prioritization_score, core.scoreFinding(assessment.findings[1]));

const reopened = remediation.updateItem(verified, "DSI-F-TEST-0001", { status: "open" });
assert.equal(reopened.items[0].verified_at, null);

assert.throws(
  () => remediation.updateItem(plan, "DSI-F-TEST-0001", { target_date: "tomorrow" }),
  /target_date/
);

const sensitiveDump = JSON.stringify(plan).toLowerCase();
[
  "password",
  "recovery_code",
  "private_messages",
  "latitude",
  "longitude",
  "session_token"
].forEach((token) => assert.equal(sensitiveDump.includes(token), false));

console.log("Remediation Intelligence core tests passed.");
