"use strict";

const demoAssessment = {
  assessment_id: "H4D-DSI-DEMO-0001",
  version: "1.0",
  consent_confirmed: true,
  scope: { mode: "self", description: "Synthetic self-assessment for local dashboard demonstration." },
  findings: [
    { id: "DSI-F-0001", category: "account-security", title: "Primary account does not use MFA", exposure: 4, impact: 5, control_weakness: 5, confidence: 5, urgency: 4, recommendation: "Enable strong MFA, review active sessions, and confirm recovery methods." },
    { id: "DSI-F-0002", category: "privacy-exposure", title: "Profile shares more personal detail than necessary", exposure: 3, impact: 2, control_weakness: 3, confidence: 5, urgency: 2, recommendation: "Review audience settings and remove details that are not needed publicly." },
    { id: "DSI-F-0003", category: "family-safety", title: "No agreed trusted escalation contact", exposure: 1, impact: 3, control_weakness: 4, confidence: 4, urgency: 2, recommendation: "Agree on a trusted contact and review how to use platform safety and reporting tools." }
  ]
};

let currentAssessment = null;
let priorAssessment = null;

const currentFile = document.getElementById("currentFile");
const priorFile = document.getElementById("priorFile");
const demoButton = document.getElementById("demoButton");
const exportButton = document.getElementById("exportButton");
const status = document.getElementById("status");
const findingCount = document.getElementById("findingCount");
const averageRisk = document.getElementById("averageRisk");
const averagePriority = document.getElementById("averagePriority");
const highCount = document.getElementById("highCount");
const riskDelta = document.getElementById("riskDelta");
const findingsTable = document.getElementById("findingsTable");
const checklist = document.getElementById("checklist");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

function priorityClass(label) {
  if (label === "Urgent review") return "priority-urgent";
  if (label === "High") return "priority-high";
  if (label === "Low" || label === "Informational") return "priority-low";
  return "";
}

function setStatus(message, kind = "") {
  status.textContent = message;
  status.className = `status ${kind}`.trim();
}

function clearDashboard() {
  findingCount.textContent = "—";
  averageRisk.textContent = "—";
  averagePriority.textContent = "No assessment";
  highCount.textContent = "—";
  riskDelta.textContent = "—";
  findingsTable.textContent = "Load or generate an assessment to view prioritized findings.";
  findingsTable.className = "empty-state";
  exportButton.disabled = true;
}

function renderFindings(rows) {
  findingsTable.textContent = "";
  findingsTable.className = "table-wrap";
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Score", "Priority", "Category", "Finding", "Protective action"].forEach((label) => {
    const th = document.createElement("th");
    th.textContent = label;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rows.forEach(({ finding, score }) => {
    const row = document.createElement("tr");
    const priorityLabel = DSICore.priority(score);
    [score, priorityLabel, finding.category, finding.title, finding.recommendation].forEach((value, index) => {
      const td = document.createElement("td");
      td.textContent = String(value);
      if (index === 0) td.classList.add("score");
      if (index === 1) td.classList.add(priorityClass(priorityLabel));
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  findingsTable.appendChild(table);
}

function renderDashboard() {
  if (!currentAssessment) return clearDashboard();
  const rows = DSICore.scoredFindings(currentAssessment);
  const average = DSICore.averageScore(currentAssessment);
  findingCount.textContent = String(rows.length);
  averageRisk.textContent = `${average}/100`;
  averagePriority.textContent = DSICore.priority(average);
  highCount.textContent = String(rows.filter((row) => row.score > 60).length);

  if (priorAssessment) {
    const delta = average - DSICore.averageScore(priorAssessment);
    riskDelta.textContent = `${delta > 0 ? "+" : ""}${delta}`;
    riskDelta.title = delta < 0 ? "Average risk decreased" : delta > 0 ? "Average risk increased" : "No average-risk change";
  } else {
    riskDelta.textContent = "—";
    riskDelta.title = "Load a prior assessment to compare";
  }

  renderFindings(rows);
  exportButton.disabled = false;
}

function loadAssessment(data, role = "Current") {
  const errors = DSICore.validateAssessment(data);
  if (errors.length) {
    setStatus(`${role} assessment rejected: ${errors.join(" ")}`, "error");
    return false;
  }
  if (role === "Prior") {
    priorAssessment = structuredClone(data);
  } else {
    currentAssessment = structuredClone(data);
  }
  setStatus(`${role} assessment loaded and validated locally.`, "success");
  renderDashboard();
  if (role !== "Prior") {
    window.dispatchEvent(new CustomEvent("dsi:assessment-loaded", { detail: structuredClone(currentAssessment) }));
  }
  return true;
}

async function handleAssessmentFile(file, role) {
  try {
    const data = JSON.parse(await file.text());
    loadAssessment(data, role);
  } catch (_error) {
    setStatus(`${role} assessment could not be read as JSON.`, "error");
  }
}

function markdownReport(data) {
  const rows = DSICore.scoredFindings(data);
  const lines = [
    "# Digital Safety Intelligence Dashboard Report", "",
    `**Assessment:** \`${data.assessment_id || "unknown"}\`  `,
    `**Scope:** \`${data.scope.mode}\`  `,
    "**Processing:** local/offline browser session", "",
    "> This report prioritizes protective actions. A score is not proof of compromise, intent, or wrongdoing.", "",
    "## Prioritized findings", "",
    "| Score | Priority | Category | Finding |",
    "| ---: | --- | --- | --- |"
  ];
  rows.forEach(({ finding, score }) => lines.push(`| ${score} | ${DSICore.priority(score)} | ${finding.category} | ${finding.title.replaceAll("|", "/")} |`));
  lines.push("", "## Recommended actions", "");
  rows.forEach(({ finding, score }) => lines.push(`### ${finding.id} — ${finding.title}`, "", `**Priority:** ${DSICore.priority(score)} (${score}/100)`, "", finding.recommendation, ""));
  lines.push(
    "## Privacy note", "",
    "Keep assessment files private. Do not add passwords, recovery codes, session tokens, precise live locations, or unnecessary private-message contents.", "",
    "---", "",
    "**Chris Cruz | h4ckd4d**  ",
    "Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  ",
    "OSCP | CEH | CISSP | MITRE ATT&CK® Contributor", "",
    "**Founder — Project h4ckd4d**  ",
    "Technology for Child Protection • OSINT • Threat Intelligence", "",
    '*"Protect. Detect. Defend."*', ""
  );
  return lines.join("\n");
}

function downloadReport() {
  if (!currentAssessment) return;
  const blob = new Blob([markdownReport(currentAssessment)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${currentAssessment.assessment_id || "dsi-assessment"}-report.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function updateChecklist() {
  const boxes = [...checklist.querySelectorAll('input[type="checkbox"]')];
  const checked = boxes.filter((box) => box.checked).length;
  const percent = Math.round((checked / boxes.length) * 100);
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}% complete (${checked}/${boxes.length})`;
}

currentFile.addEventListener("change", () => { const [file] = currentFile.files; if (file) handleAssessmentFile(file, "Current"); });
priorFile.addEventListener("change", () => { const [file] = priorFile.files; if (file) handleAssessmentFile(file, "Prior"); });
demoButton.addEventListener("click", () => { priorAssessment = null; loadAssessment(demoAssessment, "Current"); setStatus("Synthetic demo loaded. No personal data is included.", "success"); });
exportButton.addEventListener("click", downloadReport);
checklist.addEventListener("change", updateChecklist);
window.addEventListener("dsi:wizard-assessment", (event) => loadAssessment(event.detail, "Current"));

window.DSIDashboard = Object.freeze({ loadAssessment });
clearDashboard();
updateChecklist();
