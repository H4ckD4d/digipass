"use strict";

const assert = require("assert");
const core = require("../web/dsi-core.js");

assert.strictEqual(core.wizardQuestions.length, 8, "expected eight guided control questions");

const allYes = Object.fromEntries(core.wizardQuestions.map((question) => [question.id, "yes"]));
const clean = core.buildAssessment("self", allYes, "2026-08-23T18:00:00Z");
assert.deepStrictEqual(core.validateAssessment(clean), []);
assert.strictEqual(clean.findings.length, 0);
assert.strictEqual(clean.scope.mode, "self");
assert.strictEqual(clean.assessment_id, "H4D-DSI-WIZARD-20260823180000");

const mixed = { ...allYes, mfa: "no", privacy: "unsure", "trusted-support": "no" };
const assessment = core.buildAssessment("consensual-family", mixed, "2026-08-23T18:01:00Z");
assert.deepStrictEqual(core.validateAssessment(assessment), []);
assert.strictEqual(assessment.findings.length, 3);
assert.strictEqual(assessment.scope.mode, "consensual-family");

const mfa = assessment.findings.find((finding) => finding.category === "account-security");
const privacy = assessment.findings.find((finding) => finding.category === "privacy-exposure");
assert.ok(mfa);
assert.ok(privacy);
assert.ok(privacy.title.includes("review needed"));
assert.ok(privacy.confidence < mfa.confidence, "unsure answers should lower confidence");
assert.ok(core.scoreFinding(mfa) > 60, "missing strong MFA should receive high protective priority");

const serialized = JSON.stringify(assessment).toLowerCase();
for (const forbidden of ["password", "recovery_code", "session_token", "latitude", "longitude", "private_messages"]) {
  assert.ok(!serialized.includes(forbidden), `generated assessment must not contain ${forbidden}`);
}

assert.throws(() => core.buildAssessment("third-party", allYes), /Unsupported assessment mode/);
assert.throws(() => core.buildAssessment("self", { ...allYes, mfa: undefined }), /Missing answer/);

console.log("DSI guided assessment core tests passed.");
