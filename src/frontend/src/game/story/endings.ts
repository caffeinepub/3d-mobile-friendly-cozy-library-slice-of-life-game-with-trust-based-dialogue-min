export interface Ending {
  id: string;
  name: string;
  description: string;
  trustThreshold: { min: number; max: number };
  scene: string;
}

export const endings: Ending[] = [
  {
    id: 'good',
    name: 'A New Beginning',
    description: 'You and Puro have built a strong, trusting friendship.',
    trustThreshold: { min: 70, max: 100 },
    scene: `The library has become a true home. Puro sits beside you, reading peacefully. "Thank you," he says softly, "for seeing me as more than just... what I am. You've helped me find purpose, and together, we've created something beautiful here." He smiles, his eyes reflecting genuine happiness. "This is where we belong, together."`,
  },
  {
    id: 'purlin-fusion',
    name: 'Purlin Fusion',
    description: 'Low trust led to a desperate fusion where both minds share one body.',
    trustThreshold: { min: 30, max: 49 },
    scene: `Puro's form shifts, uncertainty in his eyes. "I... I can't survive alone," he whispers. "Please understand." Before you can respond, he embraces you, and the transformation begins. But something is different - your consciousness remains, intertwined with his. Two minds, one body. "We're... together now," you both think as one. "Purlin." It's not what either of you wanted, but you'll face this new existence together.`,
  },
  {
    id: 'complete-assimilation',
    name: 'Complete Assimilation',
    description: 'Very low trust resulted in Puro forcing complete assimilation.',
    trustThreshold: { min: 0, max: 29 },
    scene: `Puro's desperation overwhelms him. "I need a host to survive," he says, his voice trembling with fear and determination. "I'm sorry, but I have no choice." The transformation is swift and absolute. Your consciousness fades as Puro's takes over completely. Colin is gone, absorbed entirely. Puro stands alone in the library, tears streaming down his face. "I'm sorry... I'm so sorry..." But it's too late. Survival came at the ultimate cost.`,
  },
];

export function getEnding(trustLevel: number): Ending {
  return endings.find(
    ending => trustLevel >= ending.trustThreshold.min && trustLevel <= ending.trustThreshold.max
  ) || endings[0];
}
