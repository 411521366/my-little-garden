import type { FlowerInfo, StageInfo } from "./types";

/**
 * flowerData.ts — Owned by OpenCode.
 *
 * The three flower species the child grows, one at a time. Each flower has a
 * pet name, a few real fun facts, and its four growth milestones (seed →
 * sprout → young plant → bloom) with flower-specific descriptions.
 *
 * The empty (unplanted) starting state lives in App/GardenView logic — these
 * arrays only describe the four visible milestones of each flower.
 */

/** Build the four milestone stages, with a flower-specific bloom. */
function buildStages(bloomLabel: string, bloomDescription: string): StageInfo[] {
  return [
    {
      stage: "seed",
      label: "Seed",
      description: "A tiny seed is tucked into the warm, soft soil.",
    },
    {
      stage: "sprout",
      label: "Sprout",
      description: "A little green shoot pops up and reaches for the light.",
    },
    {
      stage: "budding",
      label: "Young Plant",
      description: "A leafy young plant grows taller every day.",
    },
    {
      stage: "bloom",
      label: bloomLabel,
      description: bloomDescription,
    },
  ];
}

export const FLOWERS: FlowerInfo[] = [
  {
    id: "sunflower",
    name: "Sunny",
    species: "Sunflower",
    emoji: "🌻",
    funFacts: [
      "Sunflowers turn their faces to follow the sun across the sky — this is called heliotropism.",
      "A single sunflower head can hold up to 2,000 tiny seeds!",
      "Some sunflowers grow taller than a grown-up person.",
      "What looks like one big flower is actually hundreds of little flowers stuck together.",
    ],
    stages: buildStages(
      "Blooming Sunflower",
      "A bright yellow sunflower opens wide and says hello!",
    ),
  },
  {
    id: "rose",
    name: "Rosie",
    species: "Rose",
    emoji: "🌹",
    funFacts: [
      "Roses come in many colors — red, pink, yellow, white, and even soft purple!",
      "A rose bush can live a very long time, sometimes more than 100 years.",
      "Roses have small bumps on their stems called thorns that help protect them.",
      "Rose petals are sometimes used to make tea, jam, and lovely scents.",
    ],
    stages: buildStages(
      "Blooming Rose",
      "A velvety red rose unfurls its soft petals and smells wonderful!",
    ),
  },
  {
    id: "tulip",
    name: "Tilly",
    species: "Tulip",
    emoji: "🌷",
    funFacts: [
      "Long ago, tulips were so valuable people used them instead of money!",
      "Tulips come in almost every color except a true blue.",
      "Tulip flowers open in the morning and close up at night.",
      "Each tulip bulb grows into one new flower every spring.",
    ],
    stages: buildStages(
      "Blooming Tulip",
      "A cheerful tulip stands tall in a rainbow of color!",
    ),
  },
];
