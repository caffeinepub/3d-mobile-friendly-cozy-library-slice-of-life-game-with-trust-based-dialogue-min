export interface Activity {
  id: string;
  name: string;
  description: string;
  trustEffect: number;
  completionMessage: string;
  unlocksMoment?: string;
}

export const activities: Activity[] = [
  {
    id: 'read',
    name: 'Read Together',
    description: 'Spend a quiet afternoon reading books with Puro.',
    trustEffect: 10,
    completionMessage: 'You and Puro enjoyed a peaceful reading session together.',
    unlocksMoment: 'Sitting on the Mat',
  },
  {
    id: 'stories',
    name: 'Listen to Stories',
    description: 'Hear Puro share stories about his life in the laboratory.',
    trustEffect: 8,
    completionMessage: 'Puro opened up and shared some of his memories with you.',
  },
  {
    id: 'feed',
    name: 'Feed Oranges',
    description: 'Pick fresh oranges from the bonsai tree and share them with Puro.',
    trustEffect: 12,
    completionMessage: 'Puro happily munched on the oranges. He seems very content!',
    unlocksMoment: 'Snack Time',
  },
];
