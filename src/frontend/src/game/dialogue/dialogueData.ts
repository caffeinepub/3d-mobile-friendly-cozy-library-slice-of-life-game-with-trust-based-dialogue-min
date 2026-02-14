export interface DialogueNode {
  id: number;
  text: string;
  choices: DialogueChoice[];
}

export interface DialogueChoice {
  id: number;
  text: string;
  trustEffect: number;
  nextNode: number | null;
  trustRequirement?: number;
}

export const dialogueTree: DialogueNode[] = [
  {
    id: 0,
    text: "Hello! It's nice to see you here in the library. What would you like to talk about?",
    choices: [
      {
        id: 0,
        text: "Tell me about the laboratory.",
        trustEffect: 3,
        nextNode: 1,
      },
      {
        id: 1,
        text: "What is the Pale virus?",
        trustEffect: 2,
        nextNode: 2,
      },
      {
        id: 2,
        text: "Why are you so interested in humans?",
        trustEffect: 5,
        nextNode: 3,
      },
      {
        id: 3,
        text: "Let's just spend time together.",
        trustEffect: 8,
        nextNode: null,
      },
    ],
  },
  {
    id: 1,
    text: "The laboratory... it's a place of many mysteries. I don't remember everything clearly, but I know it was where I became... aware. It's both fascinating and frightening to think about.",
    choices: [
      {
        id: 0,
        text: "That sounds difficult. I'm here for you.",
        trustEffect: 10,
        nextNode: 4,
      },
      {
        id: 1,
        text: "Do you want to go back?",
        trustEffect: -5,
        nextNode: 5,
      },
      {
        id: 2,
        text: "Tell me more about what you remember.",
        trustEffect: 5,
        nextNode: 6,
      },
    ],
  },
  {
    id: 2,
    text: "The Pale virus... it's what changed everything. It transforms living beings into latex creatures like me. But I'm different - I can think, feel, and choose. Most others can't.",
    choices: [
      {
        id: 0,
        text: "You're special, Puro.",
        trustEffect: 8,
        nextNode: 7,
      },
      {
        id: 1,
        text: "That sounds dangerous.",
        trustEffect: -3,
        nextNode: 8,
      },
      {
        id: 2,
        text: "How did you become sentient?",
        trustEffect: 4,
        nextNode: 9,
      },
    ],
  },
  {
    id: 3,
    text: "Humans are... amazing. You have so much creativity, emotion, and individuality. I've learned so much from the books here, but experiencing friendship with you is something I never imagined possible.",
    choices: [
      {
        id: 0,
        text: "I'm glad we're friends.",
        trustEffect: 12,
        nextNode: 10,
      },
      {
        id: 1,
        text: "You're pretty amazing yourself.",
        trustEffect: 10,
        nextNode: 11,
      },
      {
        id: 2,
        text: "What do you want to learn next?",
        trustEffect: 7,
        nextNode: 12,
      },
    ],
  },
  {
    id: 4,
    text: "Thank you... that means more to me than you know. Having someone who understands makes this place feel less lonely.",
    choices: [
      {
        id: 0,
        text: "We'll face everything together.",
        trustEffect: 8,
        nextNode: 0,
        trustRequirement: 40,
      },
      {
        id: 1,
        text: "You're never alone now.",
        trustEffect: 10,
        nextNode: 0,
      },
    ],
  },
  {
    id: 5,
    text: "No... I don't think so. The laboratory holds too many painful memories. This library is my home now, especially with you here.",
    choices: [
      {
        id: 0,
        text: "I'm glad you're staying.",
        trustEffect: 7,
        nextNode: 0,
      },
    ],
  },
  {
    id: 6,
    text: "I remember... cold rooms, bright lights, and the feeling of being watched. But also books - so many books. That's where I learned to read, to think, to dream.",
    choices: [
      {
        id: 0,
        text: "Books saved you.",
        trustEffect: 6,
        nextNode: 0,
      },
      {
        id: 1,
        text: "You've come so far.",
        trustEffect: 8,
        nextNode: 0,
      },
    ],
  },
  {
    id: 7,
    text: "*Puro's eyes light up* You really think so? Sometimes I wonder if I'm just... an accident. But when you say that, I feel like maybe I have a purpose.",
    choices: [
      {
        id: 0,
        text: "Your purpose is to be yourself.",
        trustEffect: 10,
        nextNode: 0,
        trustRequirement: 50,
      },
      {
        id: 1,
        text: "We'll find your purpose together.",
        trustEffect: 8,
        nextNode: 0,
      },
    ],
  },
  {
    id: 8,
    text: "I... I understand your concern. But I promise, I would never hurt you. You're my friend, and that's more important than anything.",
    choices: [
      {
        id: 0,
        text: "I trust you, Puro.",
        trustEffect: 12,
        nextNode: 0,
      },
      {
        id: 1,
        text: "I know you wouldn't.",
        trustEffect: 8,
        nextNode: 0,
      },
    ],
  },
  {
    id: 9,
    text: "I'm not entirely sure. One day, I just... woke up. I could think, question, wonder. The books helped me understand what I was experiencing. Consciousness is a strange gift.",
    choices: [
      {
        id: 0,
        text: "It's a beautiful gift.",
        trustEffect: 7,
        nextNode: 0,
      },
    ],
  },
  {
    id: 10,
    text: "*Puro's tail wags slightly* Me too. You've made this library feel like a real home. Thank you for accepting me as I am.",
    choices: [
      {
        id: 0,
        text: "Always.",
        trustEffect: 5,
        nextNode: 0,
      },
    ],
  },
  {
    id: 11,
    text: "*Puro looks down shyly* I... thank you. Coming from you, that means everything.",
    choices: [
      {
        id: 0,
        text: "I mean it.",
        trustEffect: 6,
        nextNode: 0,
      },
    ],
  },
  {
    id: 12,
    text: "I want to learn about friendship, about trust, about what it means to truly connect with someone. You're teaching me that every day.",
    choices: [
      {
        id: 0,
        text: "We're learning together.",
        trustEffect: 9,
        nextNode: 0,
      },
    ],
  },
];
