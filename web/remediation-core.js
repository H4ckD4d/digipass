"use strict";

(function (root, factory) {
  const core = typeof module === "object" && module.exports ? require("./dsi-core.js") : root.DSICore;
  const api = factory(core);
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DSIRemediation = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (DSICore) {
  const statuses = new Set([
    "open",
    "in-progress",
    "ready-for-verification",
    "verified",
    "deferred",
    "not-applicable",
  ]);

  const controls = {
    "account-security": {
      id: "DSI-CTRL-AUTH-001",
      control: "Enable strong multi-factor authentication and review active account sessions.",
      verify: "Confirm MFA is enabled on the intended account and review the account security/session page for unexpected sessions.",
    },
    recovery: {
      id: "DSI-CTRL-REC-001",
      control: "Review recovery methods and remove obsolete recovery paths.",
      verify: "Confirm recovery email, phone, and trusted-device options are current without storing recovery secrets in DSI.",
    },
    "privacy-exposure": {
      id: "DSI-CTRL-PRV-001",
      control: "Reduce unnecessary public profile exposure and review audience settings.",
      verify: "Re-open the relevant privacy/audience settings and confirm only intentionally public information remains visible.",
    },
    "device-security": {
      id: "DSI-CTRL-DEV-001",
      control: "Enable a strong device lock and keep supported security updates current.",
      verify: "Confirm device-lock protection is active and the device reports current supported security updates.",
    },
    "location-sharing": {
      id: "DSI-CTRL-LOC-001",
      control: "Review location permissions and remove sharing that is no longer required.",
      verify: "Review platform/app location permissions and confirm only intentionally required sharing remains enabled.",
    },
    "data-sharing": {
      id: "DSI-CTRL-DATA-001",
      control: "Review connected applications and revoke unnecessary access.",
      verify: "Confirm unused or unnecessary connected-app permissions have been removed from the account settings.",
    },
    "unwanted-contact": {
      id: "DSI-CTRL-SAFE-001",
      control: "Establish a blocking/reporting path for unwanted or suspicious contact.",
      verify: "Confirm the relevant platform blocking/reporting controls and trusted support path are known and accessible.",
    },
    "family-safety": {
      id: "DSI-CTRL-FAM-001",
      control: "Agree on a consent-based trusted support and escalation plan.",
      verify: "Confirm the agreed trusted contact and appropriate platform safety/reporting channels are understood by the participants.",
    },
  };

  function generatePlan(assessment, clockValue) {
    const assessmentErrors = DSICore.validateAssessment(assessment);
    if (assessmentErrors.length) throw new Error(assessmentErrors.join(" "));
    const timestamp = clockValue || new Date().toISOString();
    const compact = timestamp.replace(/[^0-9]/g, "").slice(0, 14) || "00000000000000";
    return {
      version: "1.0",
      plan_id: `H4D-DSI-REM-${compact}`,
      assessment_id: assessment.assessment_id || "unknown-assessment",
      scope_mode: assessment.scope.mode,
      created_at: timestamp,
      items: DSICore.scoredFindings(assessment).map(({ finding, score }) => {
        const mapped = controls[finding.category];
        if (!mapped) throw new Error(`No remediation control is mapped for ${finding.category}.`);
        return {
          finding_id: finding.id,
          category: finding.category,
          original_score: score,
          control_id: mapped.id,
          control: mapped.control,
          verification_step: mapped.verify,
          status: "open",
          target_date: null,
          verified_at: null,
        };
      }),
    };
  }

  function validatePlan(plan) {
    const errors = [];
    if (!plan || typeof plan !== "object" || Array.isArray(plan)) return ["Remediation plan must be an object."];
    if (plan.version !== "1.0") errors.push("version must be '1.0'.");
    if (typeof plan.plan_id !== "string" || !plan.plan_id.startsWith("H4D-DSI-REM-")) errors.push("invalid plan_id.");
    if (typeof plan.assessment_id !== "string" || !plan.assessment_id.trim()) errors.push("assessment_id is required.");
    if (!new Set(["self", "consensual-family"]).has(plan.scope_mode)) errors.push("invalid scope_mode.");
    if (typeof plan.created_at !== "string" || !plan.created_at.trim()) errors.push("created_at is required.");
    if (!Array.isArray(plan.items)) return [...errors, "items must be an array."];

    const seen = new Set();
    plan.items.forEach((item, index) => {
      const prefix = `item #${index + 1}`;
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        errors.push(`${prefix} must be an object.`);
        return;
      }
      if (typeof item.finding_id !== "string" || !item.finding_id.startsWith("DSI-F-")) errors.push(`${prefix}: invalid finding_id.`);
      else if (seen.has(item.finding_id)) errors.push(`${prefix}: duplicate finding_id.`);
      else seen.add(item.finding_id);
      if (!DSICore.allowedCategories.has(item.category)) errors.push(`${prefix}: unsupported category.`);
      if (!Number.isInteger(item.original_score) || item.original_score < 0 || item.original_score > 100) errors.push(`${prefix}: invalid original_score.`);
      if (typeof item.control_id !== "string" || !item.control_id.startsWith("DSI-CTRL-")) errors.push(`${prefix}: invalid control_id.`);
      if (typeof item.control !== "string" || !item.control.trim()) errors.push(`${prefix}: control is required.`);
      if (typeof item.verification_step !== "string" || !item.verification_step.trim()) errors.push(`${prefix}: verification_step is required.`);
      if (!statuses.has(item.status)) errors.push(`${prefix}: unsupported status.`);
      if (!(item.target_date === null || /^\d{4}-\d{2}-\d{2}$/.test(item.target_date))) errors.push(`${prefix}: target_date must be null or YYYY-MM-DD.`);
      if (!(item.verified_at === null || typeof item.verified_at === "string")) errors.push(`${prefix}: verified_at must be null or a date-time string.`);
      if (item.status === "verified" && !item.verified_at) errors.push(`${prefix}: verified status requires verified_at.`);
      if (item.status !== "verified" && item.verified_at !== null) errors.push(`${prefix}: verified_at is only allowed for verified status.`);
    });
    return errors;
  }

  function updateItem(plan, findingId, updates, clockValue) {
    const clone = JSON.parse(JSON.stringify(plan));
    const item = clone.items.find((entry) => entry.finding_id === findingId);
    if (!item) throw new Error(`Unknown remediation finding: ${findingId}`);
    if (updates.status !== undefined) {
      if (!statuses.has(updates.status)) throw new Error("Unsupported remediation status.");
      item.status = updates.status;
      item.verified_at = updates.status === "verified" ? (clockValue || new Date().toISOString()) : null;
    }
    if (updates.target_date !== undefined) {
      if (!(updates.target_date === null || /^\d{4}-\d{2}-\d{2}$/.test(updates.target_date))) throw new Error("target_date must be null or YYYY-MM-DD.");
      item.target_date = updates.target_date;
    }
    const errors = validatePlan(clone);
    if (errors.length) throw new Error(errors.join(" "));
    return clone;
  }

  function summarize(plan) {
    const errors = validatePlan(plan);
    if (errors.length) throw new Error(errors.join(" "));
    const counts = {};
    statuses.forEach((status) => { counts[status] = 0; });
    plan.items.forEach((item) => { counts[item.status] += 1; });
    const actionable = plan.items.filter((item) => item.status !== "verified" && item.status !== "not-applicable");
    const remaining_score = actionable.length
      ? Math.round(actionable.reduce((sum, item) => sum + item.original_score, 0) / actionable.length)
      : 0;
    return {
      total: plan.items.length,
      verified: counts.verified,
      actionable: actionable.length,
      completion_percent: plan.items.length ? Math.round((counts.verified / plan.items.length) * 100) : 100,
      remaining_prioritization_score: remaining_score,
      counts,
    };
  }

  return { statuses, controls, generatePlan, validatePlan, updateItem, summarize };
});
