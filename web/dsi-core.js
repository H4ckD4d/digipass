"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DSICore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const allowedCategories = new Set([
    "account-security",
    "privacy-exposure",
    "recovery",
    "location-sharing",
    "unwanted-contact",
    "device-security",
    "data-sharing",
    "family-safety",
  ]);

  const dimensions = ["exposure", "impact", "control_weakness", "confidence", "urgency"];

  const wizardQuestions = [
    {
      id: "mfa",
      section: "Account Security",
      prompt: "Do your important accounts use strong multi-factor authentication where it is available?",
      help: "Prefer phishing-resistant methods when available. Never enter passwords, recovery codes, or authentication secrets into DSI.",
      category: "account-security",
      title: "Important accounts may lack strong MFA",
      recommendation: "Enable strong MFA on important accounts, review active sessions, and verify recovery methods.",
      scores: [4, 5, 5, 5, 4],
    },
    {
      id: "recovery",
      section: "Recovery",
      prompt: "Have you reviewed account recovery methods and confirmed they are current and controlled by you?",
      help: "Review recovery email addresses, phone numbers, and trusted devices without recording recovery codes in DSI.",
      category: "recovery",
      title: "Account recovery methods may be outdated",
      recommendation: "Review recovery methods, remove obsolete options, and keep recovery secrets outside DSI files.",
      scores: [3, 5, 4, 5, 4],
    },
    {
      id: "privacy",
      section: "Privacy & Public Exposure",
      prompt: "Do your public profiles expose only information you intentionally want to be public?",
      help: "Think about audience settings and unnecessary personal detail. Do not paste profile contents into the assessment.",
      category: "privacy-exposure",
      title: "Public profiles may expose unnecessary personal detail",
      recommendation: "Review audience settings and remove details that are not necessary to keep public.",
      scores: [4, 3, 3, 4, 2],
    },
    {
      id: "devices",
      section: "Devices",
      prompt: "Are your primary devices protected with a screen lock and current security updates?",
      help: "Use supported device updates and a strong local unlock method appropriate for the device.",
      category: "device-security",
      title: "Primary device security controls may need review",
      recommendation: "Enable a strong device lock, install current security updates, and review device security settings.",
      scores: [3, 5, 4, 5, 4],
    },
    {
      id: "location",
      section: "Location Sharing",
      prompt: "Have you reviewed location-sharing settings and removed sharing that is no longer necessary?",
      help: "Review app and platform settings. DSI should never contain precise live location or coordinates.",
      category: "location-sharing",
      title: "Location-sharing settings may need review",
      recommendation: "Review location permissions and sharing, keeping only the access that is intentionally required.",
      scores: [4, 4, 4, 4, 3],
    },
    {
      id: "connected-apps",
      section: "Data Sharing",
      prompt: "Have you reviewed connected apps and removed access you no longer use?",
      help: "Focus on permissions and account connections, not on collecting app data inside DSI.",
      category: "data-sharing",
      title: "Connected applications may have unnecessary access",
      recommendation: "Review connected apps and permissions, then revoke access that is no longer needed.",
      scores: [3, 4, 4, 4, 3],
    },
    {
      id: "unwanted-contact",
      section: "Unwanted Contact",
      prompt: "Do you know how to block and report unwanted or suspicious contact on the platforms you use?",
      help: "Use platform safety and reporting tools. Avoid confrontation or independent investigation.",
      category: "unwanted-contact",
      title: "Blocking and reporting plan may be unclear",
      recommendation: "Review platform blocking/reporting controls and identify a trusted support path for concerning contact.",
      scores: [2, 4, 4, 4, 3],
    },
    {
      id: "trusted-support",
      section: "Trusted Support",
      prompt: "Is there a trusted support or escalation plan for a concerning digital-safety situation?",
      help: "For family mode, agree on this together. The goal is support and safe reporting, not hidden monitoring.",
      category: "family-safety",
      title: "Trusted digital-safety escalation plan may be missing",
      recommendation: "Agree on a trusted support contact and review appropriate platform safety/reporting channels.",
      scores: [1, 4, 4, 4, 3],
    },
  ];

  function validateAssessment(data) {
    const errors = [];
    if (!data || typeof data !== "object" || Array.isArray(data)) return ["Assessment must be a JSON object."];
    if (data.version !== "1.0") errors.push("version must be '1.0'.");
    if (data.consent_confirmed !== true) errors.push("consent_confirmed must be true.");
    if (!data.scope || typeof data.scope !== "object") {
      errors.push("scope must be an object.");
    } else {
      if (!new Set(["self", "consensual-family"]).has(data.scope.mode)) errors.push("scope.mode must be self or consensual-family.");
      if (typeof data.scope.description !== "string" || !data.scope.description.trim()) errors.push("scope.description is required.");
    }
    if (!Array.isArray(data.findings)) {
      errors.push("findings must be an array.");
      return errors;
    }

    const seen = new Set();
    data.findings.forEach((finding, index) => {
      const prefix = `finding #${index + 1}`;
      if (!finding || typeof finding !== "object" || Array.isArray(finding)) {
        errors.push(`${prefix} must be an object.`);
        return;
      }
      if (typeof finding.id !== "string" || !finding.id.startsWith("DSI-F-")) errors.push(`${prefix}: invalid id.`);
      else if (seen.has(finding.id)) errors.push(`${prefix}: duplicate id ${finding.id}.`);
      else seen.add(finding.id);
      if (!allowedCategories.has(finding.category)) errors.push(`${prefix}: unsupported category.`);
      dimensions.forEach((field) => {
        const value = finding[field];
        if (!Number.isInteger(value) || value < 0 || value > 5) errors.push(`${prefix}: ${field} must be an integer from 0 to 5.`);
      });
      if (typeof finding.title !== "string" || !finding.title.trim()) errors.push(`${prefix}: title is required.`);
      if (typeof finding.recommendation !== "string" || !finding.recommendation.trim()) errors.push(`${prefix}: recommendation is required.`);
    });
    return errors;
  }

  function scoreFinding(finding) {
    const raw = finding.exposure * 4 + finding.impact * 5 + finding.control_weakness * 5 + finding.confidence * 2 + finding.urgency * 4;
    return Math.max(0, Math.min(100, Math.round(raw)));
  }

  function priority(score) {
    if (score <= 20) return "Informational";
    if (score <= 40) return "Low";
    if (score <= 60) return "Moderate";
    if (score <= 80) return "High";
    return "Urgent review";
  }

  function scoredFindings(data) {
    return data.findings
      .map((finding) => ({ finding, score: scoreFinding(finding) }))
      .sort((a, b) => b.score - a.score || a.finding.id.localeCompare(b.finding.id));
  }

  function averageScore(data) {
    if (!data || !Array.isArray(data.findings) || data.findings.length === 0) return 0;
    return Math.round(data.findings.reduce((sum, finding) => sum + scoreFinding(finding), 0) / data.findings.length);
  }

  function buildAssessment(mode, answers, clockValue) {
    if (!new Set(["self", "consensual-family"]).has(mode)) throw new Error("Unsupported assessment mode.");
    const findings = [];
    wizardQuestions.forEach((question, index) => {
      const answer = answers[question.id];
      if (!new Set(["yes", "no", "unsure"]).has(answer)) throw new Error(`Missing answer for ${question.id}.`);
      if (answer === "yes") return;
      const [exposure, impact, control_weakness, baseConfidence, urgency] = question.scores;
      const confidence = answer === "unsure" ? Math.max(1, baseConfidence - 2) : baseConfidence;
      findings.push({
        id: `DSI-F-WZ-${String(index + 1).padStart(4, "0")}`,
        category: question.category,
        title: answer === "unsure" ? `${question.title} (review needed)` : question.title,
        exposure,
        impact,
        control_weakness,
        confidence,
        urgency,
        recommendation: question.recommendation,
      });
    });

    const timestamp = typeof clockValue === "string" && clockValue ? clockValue : new Date().toISOString();
    const compact = timestamp.replace(/[^0-9]/g, "").slice(0, 14) || "00000000000000";
    return {
      assessment_id: `H4D-DSI-WIZARD-${compact}`,
      version: "1.0",
      consent_confirmed: true,
      scope: {
        mode,
        description: mode === "self"
          ? "Guided self-assessment generated locally by DSI."
          : "Guided consensual-family assessment generated locally by DSI.",
      },
      findings,
    };
  }

  return {
    allowedCategories,
    dimensions,
    wizardQuestions,
    validateAssessment,
    scoreFinding,
    priority,
    scoredFindings,
    averageScore,
    buildAssessment,
  };
});
