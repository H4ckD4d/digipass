"use strict";

const remediationPanel = document.getElementById("remediationPanel");
const remediationStatus = document.getElementById("remediationStatus");
const remediationSummary = document.getElementById("remediationSummary");
const remediationItems = document.getElementById("remediationItems");
const remediationExport = document.getElementById("remediationExport");
const remediationReset = document.getElementById("remediationReset");

let remediationPlan = null;

function setRemediationStatus(message, kind = "") {
  remediationStatus.textContent = message;
  remediationStatus.className = `status ${kind}`.trim();
}

function downloadJson(data, filename) {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderSummary() {
  if (!remediationPlan) {
    remediationSummary.textContent = "Load or generate an assessment to create a remediation plan.";
    remediationExport.disabled = true;
    return;
  }
  const summary = DSIRemediation.summarize(remediationPlan);
  remediationSummary.textContent = "";
  [
    ["Items", summary.total],
    ["Verified", summary.verified],
    ["Actionable", summary.actionable],
    ["Completion", `${summary.completion_percent}%`],
    ["Remaining priority", `${summary.remaining_prioritization_score}/100`],
  ].forEach(([label, value]) => {
    const card = document.createElement("div");
    card.className = "remediation-metric";
    const labelElement = document.createElement("span");
    labelElement.textContent = label;
    const valueElement = document.createElement("strong");
    valueElement.textContent = String(value);
    card.append(labelElement, valueElement);
    remediationSummary.appendChild(card);
  });
  remediationExport.disabled = false;
}

function statusLabel(value) {
  return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function updatePlanItem(findingId, updates) {
  try {
    remediationPlan = DSIRemediation.updateItem(remediationPlan, findingId, updates);
    renderRemediation();
    setRemediationStatus("Remediation plan updated in session memory only.", "success");
  } catch (error) {
    setRemediationStatus(`Remediation update rejected: ${error.message}`, "error");
  }
}

function renderItems() {
  remediationItems.textContent = "";
  if (!remediationPlan || remediationPlan.items.length === 0) {
    remediationItems.className = "empty-state";
    remediationItems.textContent = remediationPlan ? "No remediation items are required for this assessment." : "No remediation plan loaded.";
    return;
  }
  remediationItems.className = "remediation-list";
  remediationPlan.items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "remediation-card";

    const heading = document.createElement("div");
    heading.className = "remediation-card-heading";
    const title = document.createElement("div");
    const finding = document.createElement("strong");
    finding.textContent = item.finding_id;
    const meta = document.createElement("span");
    meta.textContent = `${item.category} · original score ${item.original_score}/100`;
    title.append(finding, meta);
    const controlId = document.createElement("code");
    controlId.textContent = item.control_id;
    heading.append(title, controlId);

    const control = document.createElement("p");
    control.textContent = item.control;
    const verification = document.createElement("p");
    verification.className = "muted";
    verification.textContent = `Verify: ${item.verification_step}`;

    const controls = document.createElement("div");
    controls.className = "remediation-controls";

    const statusField = document.createElement("label");
    statusField.textContent = "Status";
    const select = document.createElement("select");
    DSIRemediation.statuses.forEach((statusValue) => {
      const option = document.createElement("option");
      option.value = statusValue;
      option.textContent = statusLabel(statusValue);
      option.selected = item.status === statusValue;
      select.appendChild(option);
    });
    select.addEventListener("change", () => updatePlanItem(item.finding_id, { status: select.value }));
    statusField.appendChild(select);

    const targetField = document.createElement("label");
    targetField.textContent = "Target date (optional)";
    const target = document.createElement("input");
    target.type = "date";
    target.value = item.target_date || "";
    target.addEventListener("change", () => updatePlanItem(item.finding_id, { target_date: target.value || null }));
    targetField.appendChild(target);

    controls.append(statusField, targetField);

    const closure = document.createElement("p");
    closure.className = "closure-state";
    closure.textContent = item.status === "verified"
      ? `Human-verified closure recorded at ${item.verified_at}. Reassessment is still recommended.`
      : "Closure is not automatic. Use Verified only after completing the stated verification step.";

    card.append(heading, control, verification, controls, closure);
    remediationItems.appendChild(card);
  });
}

function renderRemediation() {
  renderSummary();
  renderItems();
}

function createPlan(assessment) {
  try {
    remediationPlan = DSIRemediation.generatePlan(assessment);
    renderRemediation();
    remediationPanel.hidden = false;
    remediationPanel.scrollIntoView({ block: "nearest" });
    setRemediationStatus(`Remediation plan generated locally with ${remediationPlan.items.length} item(s).`, "success");
  } catch (error) {
    remediationPlan = null;
    renderRemediation();
    setRemediationStatus(`Unable to create remediation plan: ${error.message}`, "error");
  }
}

window.addEventListener("dsi:assessment-loaded", (event) => createPlan(event.detail));

remediationExport.addEventListener("click", () => {
  if (!remediationPlan) return;
  downloadJson(remediationPlan, `${remediationPlan.plan_id}.json`);
  setRemediationStatus("Remediation plan exported by explicit user action.", "success");
});

remediationReset.addEventListener("click", () => {
  remediationPlan = null;
  renderRemediation();
  setRemediationStatus("Remediation session cleared. No browser persistence was used.");
});

renderRemediation();
