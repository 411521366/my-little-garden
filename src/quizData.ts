import type { QuizQuestion } from "./types";

/**
 * quizData.ts — Owned by OpenCode.
 *
 * The educational quiz questions. Each question has three choices and a short
 * explanation so children learn a real plant fact every time they answer.
 *
 * Version 5 organizes them into 3 stages of 4 questions each (12 total).
 * Answering every question correctly earns 12 water drops — exactly what it
 * takes to grow all three flowers (4 drops per flower).
 *
 * These are deliberately simple for ages 6-10.
 */

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ---- Stage 1: What plants need ----
  {
    id: "q1-needs",
    stage: 1,
    question: "What do plants need to grow big and strong?",
    choices: ["Water, sunlight, and air", "Candy and juice", "Shoes and a hat"],
    correctIndex: 0,
    explanation:
      "Plants drink water, soak up sunlight, and breathe air to make their own food.",
  },
  {
    id: "q2-roots-water",
    stage: 1,
    question: "Where do plants drink up water from?",
    choices: ["From their roots", "From their leaves", "From their flowers"],
    correctIndex: 0,
    explanation:
      "A plant's roots reach into the soil and soak up water like tiny straws.",
  },
  {
    id: "q3-sun-energy",
    stage: 1,
    question: "What gives a plant the energy it needs to grow?",
    choices: ["The sun", "The moon", "A lamp shade"],
    correctIndex: 0,
    explanation:
      "Plants use sunlight to turn water and air into sugar for food. This is called photosynthesis.",
  },
  {
    id: "q5-air",
    stage: 1,
    question: "What do plants breathe in from the air?",
    choices: ["Carbon dioxide", "Helium", "Steam"],
    correctIndex: 0,
    explanation:
      "Plants breathe in carbon dioxide and breathe out the fresh oxygen we need to live.",
  },

  // ---- Stage 2: How plants grow ----
  {
    id: "q4-roots-hold",
    stage: 2,
    question: "Which part of a plant holds it steady in the dirt?",
    choices: ["The roots", "The petals", "The seeds"],
    correctIndex: 0,
    explanation:
      "Roots grip the soil like an anchor so the plant does not fall over.",
  },
  {
    id: "q6-nutrients",
    stage: 2,
    question: "Tiny helpers in the soil that give plants food are called...",
    choices: ["Nutrients", "Sprinkles", "Pebbles"],
    correctIndex: 0,
    explanation:
      "Nutrients in the soil are like vitamins that keep a plant healthy and strong.",
  },
  {
    id: "q7-sprout",
    stage: 2,
    question:
      "What is a baby plant called when it first pops out of the soil?",
    choices: ["A sprout", "A stump", "A rock"],
    correctIndex: 0,
    explanation:
      "A sprout is the very first little green shoot of a brand new plant.",
  },
  {
    id: "q8-time",
    stage: 2,
    question: "How long does a real sunflower take to grow tall?",
    choices: ["Many weeks or months", "One minute", "One second"],
    correctIndex: 0,
    explanation:
      "Real plants grow slowly over weeks and months — our game just speeds it up so you can see it!",
  },

  // ---- Stage 3: Flowers and seeds ----
  {
    id: "q9-bees",
    stage: 3,
    question: "What do bees collect when they visit a flower?",
    choices: ["Nectar", "Snow", "Sand"],
    correctIndex: 0,
    explanation:
      "Bees sip sweet nectar from flowers, and they help plants make seeds along the way.",
  },
  {
    id: "q10-night",
    stage: 3,
    question: "What happens to many flowers at night?",
    choices: ["They close their petals", "They run away", "They turn into trees"],
    correctIndex: 0,
    explanation:
      "Many flowers fold up their petals at night and open again in the morning sunshine.",
  },
  {
    id: "q11-sunflower-follow",
    stage: 3,
    question: "Which flower is famous for turning to follow the sun?",
    choices: ["The sunflower", "The rose", "The tulip"],
    correctIndex: 0,
    explanation:
      "Sunflowers turn their heads to follow the sun across the sky — it helps them grow!",
  },
  {
    id: "q12-seeds-after-bees",
    stage: 3,
    question: "After a bee visits a flower, what can the flower make?",
    choices: ["Seeds", "Snowflakes", "Rocks"],
    correctIndex: 0,
    explanation:
      "When a bee helps pollinate a flower, the flower can make seeds that grow into new plants.",
  },
];
