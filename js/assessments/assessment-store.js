export const assessmentDefinitions = [
  {
    id: "passive-scan",
    name: "Passive Scan",
    durationSec: 60,
    category: "Baseline",
    description:
      "Sit naturally while STATE records face and behaviour signals.",
    measures: [
      "Eye openness",
      "Blink activity",
      "Head stability",
      "Expression movement",
    ],
  },
  {
    id: "follow-dot",
    name: "Follow The Dot",
    durationSec: 45,
    category: "Visual Tracking",
    description:
      "Follow a moving dot with your eyes while keeping your head as still as possible.",
    measures: [
      "Visual tracking",
      "Head compensation",
      "Blink disruption",
      "Smooth pursuit",
    ],
  },
  {
    id: "reaction-test",
    name: "Reaction Test",
    durationSec: 30,
    category: "Response Speed",
    description:
      "Tap as soon as the stimulus appears. STATE records response speed and signal change.",
    measures: [
      "Reaction time",
      "Response consistency",
      "Readiness",
      "Blink behaviour",
    ],
  },
  {
    id: "reading-focus",
    name: "Reading Focus",
    durationSec: 90,
    category: "Sustained Attention",
    description:
      "Read a short passage while STATE records attention-related signal patterns.",
    measures: [
      "Reading stability",
      "Blink behaviour",
      "Head stability",
      "Expression movement",
    ],
  },
  {
    id: "stillness-test",
    name: "Stillness Test",
    durationSec: 45,
    category: "Motor Control",
    description:
      "Stay relaxed but still while STATE measures movement and restlessness signals.",
    measures: [
      "Head stability",
      "Micro-movement",
      "Fidget tendency",
      "Signal control",
    ],
  },
];

export function getAssessmentById(id) {
  return assessmentDefinitions.find(assessment => assessment.id === id);
}