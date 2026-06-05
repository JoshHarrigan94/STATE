import { getAssessmentById } from "./assessment-store.js";

export function selectAssessment(store, assessmentId) {
  const assessment = getAssessmentById(assessmentId);

  if (!assessment) return;

  store.assessment.activeId = assessment.id;
  store.assessment.status = "selected";
  store.assessment.startedAt = null;
  store.assessment.endedAt = null;
  store.assessment.elapsedMs = 0;
  store.assessment.result = null;
}

export function startAssessment(store) {
  const assessment = getAssessmentById(store.assessment.activeId);

  if (!assessment) return;

  store.assessment.status = "running";
  store.assessment.startedAt = performance.now();
  store.assessment.endedAt = null;
  store.assessment.elapsedMs = 0;
  store.assessment.result = null;
}

export function stopAssessment(store) {
  if (store.assessment.status !== "running") return;

  store.assessment.status = "complete";
  store.assessment.endedAt = performance.now();
  store.assessment.elapsedMs =
    store.assessment.endedAt - store.assessment.startedAt;
}

export function resetAssessment(store) {
  store.assessment.activeId = "passive-scan";
  store.assessment.status = "idle";
  store.assessment.startedAt = null;
  store.assessment.endedAt = null;
  store.assessment.elapsedMs = 0;
  store.assessment.result = null;
}

export function updateAssessmentTiming(store) {
  if (store.assessment.status !== "running") return;

  store.assessment.elapsedMs =
    performance.now() - store.assessment.startedAt;

  const assessment = getAssessmentById(store.assessment.activeId);

  if (!assessment) return;

  const maxMs = assessment.durationSec * 1000;

  if (store.assessment.elapsedMs >= maxMs) {
    stopAssessment(store);
  }
}