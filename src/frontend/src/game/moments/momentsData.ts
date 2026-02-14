export interface Moment {
  id: string;
  title: string;
  description: string;
  scene: string;
  trustRequirement: number;
}

export const moments: Moment[] = [
  {
    id: 'sitting-mat',
    title: 'Sitting on the Mat',
    description: 'A quiet moment shared with Puro on his favorite mat.',
    scene: 'You and Puro sit together on the soft mat, surrounded by books. The dim light creates a peaceful atmosphere. Puro looks content, his tail gently swaying. "Thank you for being here," he says softly.',
    trustRequirement: 30,
  },
  {
    id: 'snack-time',
    title: 'Snack Time',
    description: 'Watching Puro enjoy his favorite snacks.',
    scene: 'Puro happily munches on fresh oranges from the bonsai tree. His eyes light up with each bite, and he makes small happy sounds. "These are so good!" he exclaims, offering you one with a smile.',
    trustRequirement: 50,
  },
];
