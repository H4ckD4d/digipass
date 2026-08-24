"use strict";

const syntheticAlert = {
  record_type: "alert-envelope",
  protocol_version: "0.1",
  alert_id: "CT-ALERT-DEMO-0001",
  cap_identifier: "example-authority-20260823-0001",
  language: "en",
  source: {
    id: "EXAMPLE-AUTHORITY",
    name: "Example Emergency Authority",
    registry_reference: "synthetic-fixture-only",
    source_reference: "https://example.com/alerts/CT-ALERT-DEMO-0001"
  },
  source_status: "official-registered",
  integrity_status: "verified",
  sent_at: "2026-08-23T18:00:00Z",
  effective_at: "2026-08-23T18:00:00Z",
  expires_at: "2099-08-24T03:00:00Z",
  event: "Extreme Heat Warning — Synthetic Demo",
  severity: "Severe",
  urgency: "Expected",
  certainty: "Likely",
  area_description: "Example District — documentation fixture only",
  description: "Synthetic alert used to test CrisisTrust. It does not describe a real emergency.",
  instruction: "Follow the instructions of your local emergency authority. This sentence is synthetic test content and is not real-world emergency guidance."
};

const syntheticResources = [
  {
    record_type: "community-resource",
    protocol_version: "0.1",
    resource_id: "CT-RESOURCE-DEMO-001",
    resource_type: "cooling-center",
    name: "Example Community Cooling Center",
    area_description: "Example District — documentation fixture only",
    address: "100 Example Avenue, Example City",
    source: "Example Emergency Authority",
    verification_status: "verified",
    last_verified_at: "2026-08-23T18:05:00Z",
    availability: "available",
    availability_note: "Synthetic availability for interface testing only.",
    accessibility_note: "Synthetic accessibility note for interface testing only."
  },
  {
    record_type: "community-resource",
    protocol_version: "0.1",
    resource_id: "CT-RESOURCE-DEMO-002",
    resource_type: "information-point",
    name: "Example Official Information Point",
    area_description: "Example District — documentation fixture only",
    source: "Example Emergency Authority",
    verification_status: "stale",
    last_verified_at: "2026-08-23T12:00:00Z",
    availability: "unknown",
    availability_note: "Synthetic stale record used to test freshness warnings."
  }
];

const initialCircle = [
  { alias: "Trusted person A", status: "safe" },
  { alias: "Trusted person B", status: "unknown" },
  { alias: "Trusted person C", status: "need-assistance" }
];

let circleState = structuredClone(initialCircle);
let activeAlert = null;

const alertFile = document.getElementById("alertFile");
const demoButton = document.getElementById("demoButton");
const resetCircle = document.getElementById("resetCircle");
const loadStatus = document.getElementById("loadStatus");
const sourceMetric = document.getElementById("sourceMetric");
const sourceMetricHelp = document.getElementById("sourceMetricHelp");
const integrityMetric = document.getElementById("integrityMetric");
const integrityMetricHelp = document.getElementById("integrityMetricHelp");
const freshnessMetric = document.getElementById("freshnessMetric");
const circleMetric = document.getElementById("circleMetric");
const actionCard = document.getElementById("actionCard");
const trustDetails = document.getElementById("trustDetails");
const circleBoard = document.getElementById("circleBoard");
const resourceList = document.getElementById("resourceList");

function setLoadStatus(message, kind = "") {
  loadStatus.textContent = message;
  loadStatus.className = `status ${kind}`.trim();
}

function tag(text, kind = "") {
  const node = document.createElement("span");
  node.className = `tag ${kind}`.trim();
  node.textContent = text;
  return node;
}

function renderActionCard(alert) {
  const card = CrisisTrustCore.buildActionCard(alert);
  actionCard.textContent = "";
  actionCard.className = "action-card";

  const header = document.createElement("div");
  header.className = "action-header";
  const titleWrap = document.createElement("div");
  const event = document.createElement("h3");
  event.textContent = card.event;
  const source = document.createElement("p");
  source.className = "muted";
  source.textContent = `Source: ${card.source_name}`;
  titleWrap.append(event, source);

  const tags = document.createElement("div");
  tags.className = "tags";
  tags.append(
    tag(card.severity, card.severity === "Extreme" ? "danger" : card.severity === "Severe" ? "warn" : ""),
    tag(card.urgency),
    tag(card.certainty),
    tag(card.freshness, card.freshness === "current" ? "ok" : card.freshness === "expired" ? "danger" : "warn")
  );
  header.append(titleWrap, tags);

  const area = document.createElement("p");
  area.textContent = `Affected area: ${card.area_description}`;

  const instructionTitle = document.createElement("strong");
  instructionTitle.textContent = "Instruction preserved from source";
  const instruction = document.createElement("div");
  instruction.className = "instruction";
  instruction.textContent = card.source_instruction;

  actionCard.append(header, area, instructionTitle, instruction);
}

function updateTrustDetails(alert) {
  const values = [
    CrisisTrustCore.sourceLabel(alert.source_status),
    CrisisTrustCore.integrityLabel(alert.integrity_status),
    alert.certainty,
    alert.area_description
  ];
  [...trustDetails.querySelectorAll("dd")].forEach((dd, index) => {
    dd.textContent = values[index];
  });
}

function renderMetrics(alert) {
  sourceMetric.textContent = alert.source_status;
  sourceMetricHelp.textContent = CrisisTrustCore.sourceLabel(alert.source_status);
  integrityMetric.textContent = alert.integrity_status;
  integrityMetricHelp.textContent = CrisisTrustCore.integrityLabel(alert.integrity_status);
  freshnessMetric.textContent = CrisisTrustCore.freshness(alert);
  renderCircleMetric();
}

function loadAlert(alert, sourceDescription) {
  const errors = CrisisTrustCore.validateAlert(alert);
  if (errors.length) {
    setLoadStatus(`Alert rejected: ${errors.join(" ")}`, "error");
    return false;
  }
  activeAlert = structuredClone(alert);
  renderActionCard(activeAlert);
  updateTrustDetails(activeAlert);
  renderMetrics(activeAlert);
  setLoadStatus(`${sourceDescription} loaded and validated locally.`, "success");
  return true;
}

function renderCircleMetric() {
  const syntheticRecords = circleState.map((item, index) => ({
    record_type: "checkin",
    protocol_version: "0.1",
    checkin_id: `CT-SESSION-${String(index + 1).padStart(3, "0")}`,
    alias: item.alias,
    status: item.status,
    updated_at: "2026-08-23T18:15:00Z"
  }));
  const summary = CrisisTrustCore.checkinSummary(syntheticRecords);
  circleMetric.textContent = `${summary.safe}/${summary.total} safe`;
}

function renderCircle() {
  circleBoard.textContent = "";
  circleState.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "circle-row";
    const label = document.createElement("strong");
    label.textContent = item.alias;
    const select = document.createElement("select");
    select.setAttribute("aria-label", `Status for ${item.alias}`);
    [
      ["safe", "Safe"],
      ["need-assistance", "Need assistance"],
      ["unknown", "Unknown"]
    ].forEach(([value, text]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      option.selected = item.status === value;
      select.appendChild(option);
    });
    select.addEventListener("change", () => {
      circleState[index].status = select.value;
      renderCircleMetric();
    });
    row.append(label, select);
    circleBoard.appendChild(row);
  });
  renderCircleMetric();
}

function renderResources() {
  resourceList.textContent = "";
  syntheticResources.forEach((item) => {
    const errors = CrisisTrustCore.validateResource(item);
    if (errors.length) return;
    const card = document.createElement("article");
    card.className = "resource-card";
    const heading = document.createElement("strong");
    heading.textContent = item.name;
    const tags = document.createElement("div");
    tags.className = "tags";
    tags.append(
      tag(item.resource_type),
      tag(item.verification_status, item.verification_status === "verified" ? "ok" : "warn"),
      tag(item.availability, item.availability === "available" ? "ok" : item.availability === "unavailable" ? "danger" : "warn")
    );
    const area = document.createElement("div");
    area.className = "resource-meta";
    area.textContent = item.address ? `${item.area_description} · ${item.address}` : item.area_description;
    const provenance = document.createElement("div");
    provenance.className = "resource-meta";
    provenance.textContent = `Source: ${item.source} · Last verified: ${item.last_verified_at || "unknown"}`;
    const note = document.createElement("div");
    note.className = "resource-meta";
    note.textContent = item.availability_note || "No availability note provided.";
    card.append(heading, tags, area, provenance, note);
    resourceList.appendChild(card);
  });
}

alertFile.addEventListener("change", async () => {
  const [file] = alertFile.files;
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    loadAlert(data, "Imported alert");
  } catch (_error) {
    setLoadStatus("Alert file could not be parsed as JSON.", "error");
  }
});

demoButton.addEventListener("click", () => loadAlert(syntheticAlert, "Synthetic demo"));
resetCircle.addEventListener("click", () => {
  circleState = structuredClone(initialCircle);
  renderCircle();
});

renderCircle();
renderResources();
