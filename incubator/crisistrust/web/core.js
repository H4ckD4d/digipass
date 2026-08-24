"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CrisisTrustCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const sourceStatuses = new Set([
    "official-registered", "official-declared", "community-verified", "community-unverified", "unknown"
  ]);
  const integrityStatuses = new Set(["verified", "not-verified", "failed", "not-applicable"]);
  const severities = new Set(["Extreme", "Severe", "Moderate", "Minor", "Unknown"]);
  const urgencies = new Set(["Immediate", "Expected", "Future", "Past", "Unknown"]);
  const certainties = new Set(["Observed", "Likely", "Possible", "Unlikely", "Unknown"]);
  const checkinStatuses = new Set(["safe", "need-assistance", "unknown"]);
  const resourceVerificationStatuses = new Set(["verified", "stale", "unverified"]);

  function nonEmpty(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function validateAlert(alert) {
    const errors = [];
    if (!alert || typeof alert !== "object" || Array.isArray(alert)) return ["Alert must be an object."];
    if (alert.record_type !== "alert-envelope") errors.push("record_type must be alert-envelope.");
    if (alert.protocol_version !== "0.1") errors.push("protocol_version must be 0.1.");
    if (!nonEmpty(alert.alert_id)) errors.push("alert_id is required.");
    if (!alert.source || !nonEmpty(alert.source.id) || !nonEmpty(alert.source.name)) errors.push("source.id and source.name are required.");
    if (!sourceStatuses.has(alert.source_status)) errors.push("unsupported source_status.");
    if (!integrityStatuses.has(alert.integrity_status)) errors.push("unsupported integrity_status.");
    if (!nonEmpty(alert.sent_at)) errors.push("sent_at is required.");
    if (!nonEmpty(alert.event)) errors.push("event is required.");
    if (!severities.has(alert.severity)) errors.push("unsupported severity.");
    if (!urgencies.has(alert.urgency)) errors.push("unsupported urgency.");
    if (!certainties.has(alert.certainty)) errors.push("unsupported certainty.");
    if (!nonEmpty(alert.area_description)) errors.push("area_description is required.");
    if (!nonEmpty(alert.instruction)) errors.push("instruction is required.");
    return errors;
  }

  function freshness(alert, nowValue) {
    if (!alert.expires_at) return "unknown";
    const expires = new Date(alert.expires_at);
    const now = nowValue ? new Date(nowValue) : new Date();
    if (Number.isNaN(expires.getTime()) || Number.isNaN(now.getTime())) return "unknown";
    return expires.getTime() >= now.getTime() ? "current" : "expired";
  }

  function buildActionCard(alert, nowValue) {
    const errors = validateAlert(alert);
    if (errors.length) throw new Error(errors.join(" "));
    return {
      record_type: "action-card",
      protocol_version: "0.1",
      card_id: `CT-CARD-${alert.alert_id}`,
      alert_id: alert.alert_id,
      source_name: alert.source.name,
      source_status: alert.source_status,
      integrity_status: alert.integrity_status,
      event: alert.event,
      severity: alert.severity,
      urgency: alert.urgency,
      certainty: alert.certainty,
      area_description: alert.area_description,
      source_instruction: alert.instruction,
      freshness: freshness(alert, nowValue),
      ...(alert.expires_at ? { expires_at: alert.expires_at } : {}),
      ...(alert.source.source_reference ? { source_reference: alert.source.source_reference } : {})
    };
  }

  function validateCheckin(item) {
    const errors = [];
    if (!item || typeof item !== "object" || Array.isArray(item)) return ["Check-in must be an object."];
    if (item.record_type !== "checkin") errors.push("record_type must be checkin.");
    if (item.protocol_version !== "0.1") errors.push("protocol_version must be 0.1.");
    if (!nonEmpty(item.checkin_id)) errors.push("checkin_id is required.");
    if (!nonEmpty(item.alias)) errors.push("alias is required.");
    if (!checkinStatuses.has(item.status)) errors.push("unsupported check-in status.");
    if (!nonEmpty(item.updated_at)) errors.push("updated_at is required.");
    return errors;
  }

  function validateResource(item) {
    const errors = [];
    if (!item || typeof item !== "object" || Array.isArray(item)) return ["Resource must be an object."];
    if (item.record_type !== "community-resource") errors.push("record_type must be community-resource.");
    if (item.protocol_version !== "0.1") errors.push("protocol_version must be 0.1.");
    if (!nonEmpty(item.resource_id)) errors.push("resource_id is required.");
    if (!nonEmpty(item.name)) errors.push("name is required.");
    if (!nonEmpty(item.area_description)) errors.push("area_description is required.");
    if (!nonEmpty(item.source)) errors.push("source is required.");
    if (!resourceVerificationStatuses.has(item.verification_status)) errors.push("unsupported resource verification status.");
    return errors;
  }

  function sourceLabel(status) {
    return {
      "official-registered": "Official source — registry/reference matched",
      "official-declared": "Official source — registry match unavailable",
      "community-verified": "Community information — verification completed",
      "community-unverified": "Community information — unverified",
      "unknown": "Source provenance unknown"
    }[status] || "Source provenance unknown";
  }

  function integrityLabel(status) {
    return {
      "verified": "Message integrity checked",
      "not-verified": "Message integrity not verified",
      "failed": "Integrity check failed",
      "not-applicable": "No integrity mechanism applied"
    }[status] || "Message integrity unknown";
  }

  function checkinSummary(items) {
    const summary = { safe: 0, "need-assistance": 0, unknown: 0, total: 0 };
    for (const item of items || []) {
      if (validateCheckin(item).length === 0) {
        summary[item.status] += 1;
        summary.total += 1;
      }
    }
    return summary;
  }

  return Object.freeze({
    sourceStatuses,
    integrityStatuses,
    severities,
    urgencies,
    certainties,
    checkinStatuses,
    resourceVerificationStatuses,
    validateAlert,
    validateCheckin,
    validateResource,
    freshness,
    buildActionCard,
    sourceLabel,
    integrityLabel,
    checkinSummary
  });
});
