"use strict";

const assert = require("node:assert/strict");
const Core = require("../web/core.js");

const alert = {
  record_type: "alert-envelope",
  protocol_version: "0.1",
  alert_id: "CT-TEST-001",
  source: { id: "AUTH-1", name: "Example Authority", source_reference: "https://example.com/alert" },
  source_status: "official-registered",
  integrity_status: "verified",
  sent_at: "2026-08-23T18:00:00Z",
  expires_at: "2026-08-24T03:00:00Z",
  event: "Synthetic Warning",
  severity: "Severe",
  urgency: "Expected",
  certainty: "Likely",
  area_description: "Example area",
  instruction: "Synthetic source instruction."
};

assert.deepEqual(Core.validateAlert(alert), []);
assert.equal(Core.freshness(alert, "2026-08-23T20:00:00Z"), "current");
assert.equal(Core.freshness(alert, "2026-08-25T20:00:00Z"), "expired");

const card = Core.buildActionCard(alert, "2026-08-23T20:00:00Z");
assert.equal(card.record_type, "action-card");
assert.equal(card.alert_id, alert.alert_id);
assert.equal(card.source_instruction, alert.instruction, "Action Card must preserve the source instruction exactly");
assert.equal(card.source_status, "official-registered");
assert.equal(card.integrity_status, "verified");
assert.equal(card.freshness, "current");
assert.ok(!Object.hasOwn(card, "truth"), "Protocol must not add a truth oracle field");

const unknownSource = structuredClone(alert);
unknownSource.source_status = "unknown";
assert.deepEqual(Core.validateAlert(unknownSource), []);
assert.match(Core.sourceLabel("unknown"), /unknown/i);

const failedIntegrity = structuredClone(alert);
failedIntegrity.integrity_status = "failed";
assert.deepEqual(Core.validateAlert(failedIntegrity), []);
assert.match(Core.integrityLabel("failed"), /failed/i);

const checkins = [
  { record_type: "checkin", protocol_version: "0.1", checkin_id: "1", alias: "A", status: "safe", updated_at: "2026-08-23T18:00:00Z" },
  { record_type: "checkin", protocol_version: "0.1", checkin_id: "2", alias: "B", status: "need-assistance", updated_at: "2026-08-23T18:01:00Z" },
  { record_type: "checkin", protocol_version: "0.1", checkin_id: "3", alias: "C", status: "unknown", updated_at: "2026-08-23T18:02:00Z" }
];
const summary = Core.checkinSummary(checkins);
assert.equal(summary.total, 3);
assert.equal(summary.safe, 1);
assert.equal(summary["need-assistance"], 1);
assert.equal(summary.unknown, 1);

const resource = {
  record_type: "community-resource",
  protocol_version: "0.1",
  resource_id: "R1",
  resource_type: "shelter",
  name: "Example Resource",
  area_description: "Example area",
  source: "Example source",
  verification_status: "stale",
  availability: "unknown"
};
assert.deepEqual(Core.validateResource(resource), []);

const invalid = structuredClone(alert);
invalid.source_status = "true";
assert.ok(Core.validateAlert(invalid).length > 0, "Opaque true/false trust status must be rejected");

console.log("CrisisTrust core tests passed.");
