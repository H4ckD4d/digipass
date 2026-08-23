"use strict";

const wizardStart = document.getElementById("wizardStart");
const wizardModeSelf = document.getElementById("wizardModeSelf");
const wizardModeFamily = document.getElementById("wizardModeFamily");
const wizardStep = document.getElementById("wizardStep");
const wizardSection = document.getElementById("wizardSection");
const wizardPrompt = document.getElementById("wizardPrompt");
const wizardHelp = document.getElementById("wizardHelp");
const wizardChoices = document.getElementById("wizardChoices");
const wizardBack = document.getElementById("wizardBack");
const wizardNext = document.getElementById("wizardNext");
const wizardCancel = document.getElementById("wizardCancel");
const wizardCancelReview = document.getElementById("wizardCancelReview");
const wizardReview = document.getElementById("wizardReview");
const wizardReviewList = document.getElementById("wizardReviewList");
const wizardGenerate = document.getElementById("wizardGenerate");
const wizardDownload = document.getElementById("wizardDownload");
const wizardStatus = document.getElementById("wizardStatus");

let wizardMode = "self";
let wizardIndex = 0;
let wizardAnswers = {};
let generatedAssessment = null;

function setWizardStatus(message, kind = "") {
  wizardStatus.textContent = message;
  wizardStatus.className = `status ${kind}`.trim();
}

function resetWizard() {
  wizardIndex = 0;
  wizardAnswers = {};
  generatedAssessment = null;
  wizardStep.hidden = true;
  wizardReview.hidden = true;
  wizardStart.hidden = false;
  wizardDownload.disabled = true;
  setWizardStatus("Wizard data exists only in this browser session.");
}

function startWizard(mode) {
  wizardMode = mode;
  wizardIndex = 0;
  wizardAnswers = {};
  generatedAssessment = null;
  wizardStart.hidden = true;
  wizardReview.hidden = true;
  wizardStep.hidden = false;
  renderStep();
  setWizardStatus(mode === "self" ? "Self-assessment started locally." : "Consensual family assessment started locally.", "success");
}

function selectedAnswer() {
  const selected = wizardChoices.querySelector('input[name="wizard-answer"]:checked');
  return selected ? selected.value : null;
}

function renderStep() {
  const question = DSICore.wizardQuestions[wizardIndex];
  wizardSection.textContent = `${question.section} · Step ${wizardIndex + 1} of ${DSICore.wizardQuestions.length}`;
  wizardPrompt.textContent = question.prompt;
  wizardHelp.textContent = question.help;
  wizardChoices.textContent = "";
  [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]].forEach(([value, label]) => {
    const choice = document.createElement("label");
    choice.className = "wizard-choice";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "wizard-answer";
    input.value = value;
    input.checked = wizardAnswers[question.id] === value;
    const text = document.createElement("span");
    text.textContent = label;
    choice.append(input, text);
    wizardChoices.appendChild(choice);
  });
  wizardBack.disabled = wizardIndex === 0;
  wizardNext.textContent = wizardIndex === DSICore.wizardQuestions.length - 1 ? "Review answers" : "Next";
  wizardPrompt.focus();
}

function nextStep() {
  const answer = selectedAnswer();
  if (!answer) return setWizardStatus("Choose Yes, No, or Not sure before continuing.", "error");
  const question = DSICore.wizardQuestions[wizardIndex];
  wizardAnswers[question.id] = answer;
  if (wizardIndex < DSICore.wizardQuestions.length - 1) {
    wizardIndex += 1;
    renderStep();
    return setWizardStatus("Answer recorded in session memory only.", "success");
  }
  renderReview();
}

function previousStep() {
  if (wizardIndex === 0) return;
  const answer = selectedAnswer();
  if (answer) wizardAnswers[DSICore.wizardQuestions[wizardIndex].id] = answer;
  wizardIndex -= 1;
  renderStep();
}

function renderReview() {
  wizardStep.hidden = true;
  wizardReview.hidden = false;
  wizardReviewList.textContent = "";
  DSICore.wizardQuestions.forEach((question) => {
    const item = document.createElement("li");
    const label = document.createElement("strong");
    label.textContent = question.section;
    const value = document.createElement("span");
    const answer = wizardAnswers[question.id];
    value.textContent = answer === "yes" ? "Yes" : answer === "no" ? "No" : "Not sure";
    item.append(label, value);
    wizardReviewList.appendChild(item);
  });
  wizardGenerate.focus();
  setWizardStatus("Review complete. Generate only when the scope and answers are correct.");
}

function generateAssessment() {
  try {
    generatedAssessment = DSICore.buildAssessment(wizardMode, wizardAnswers);
    const errors = DSICore.validateAssessment(generatedAssessment);
    if (errors.length) throw new Error(errors.join(" "));
    window.dispatchEvent(new CustomEvent("dsi:wizard-assessment", { detail: structuredClone(generatedAssessment) }));
    wizardDownload.disabled = false;
    setWizardStatus(`Assessment generated locally with ${generatedAssessment.findings.length} prioritized finding(s).`, "success");
  } catch (error) {
    setWizardStatus(`Assessment could not be generated: ${error.message}`, "error");
  }
}

function downloadAssessment() {
  if (!generatedAssessment) return;
  const blob = new Blob([`${JSON.stringify(generatedAssessment, null, 2)}\n`], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${generatedAssessment.assessment_id}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

wizardModeSelf.addEventListener("click", () => startWizard("self"));
wizardModeFamily.addEventListener("click", () => startWizard("consensual-family"));
wizardBack.addEventListener("click", previousStep);
wizardNext.addEventListener("click", nextStep);
wizardCancel.addEventListener("click", resetWizard);
wizardCancelReview.addEventListener("click", resetWizard);
wizardGenerate.addEventListener("click", generateAssessment);
wizardDownload.addEventListener("click", downloadAssessment);

resetWizard();
