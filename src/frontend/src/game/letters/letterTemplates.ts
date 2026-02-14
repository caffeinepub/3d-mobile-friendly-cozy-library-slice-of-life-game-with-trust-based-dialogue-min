const friendlyResponses = [
  "Thank you for your kind words! It's nice to know someone is thinking of us.",
  "Your letter brought warmth to this cold place. We appreciate your friendship.",
  "It's rare to receive such thoughtful messages. Thank you for reaching out.",
  "We're glad to hear from you! The library sounds like a wonderful place.",
  "Your words are comforting. We hope you and Puro are doing well.",
  "Thank you for sharing your thoughts. It means more than you know.",
];

const curiousResponses = [
  "We're curious about life in the library. What's it like there?",
  "Your stories about Puro are fascinating. He sounds like a good friend.",
  "We wonder what books you're reading. Any recommendations?",
  "The bonsai tree sounds beautiful. We wish we could see it.",
];

const encouragingResponses = [
  "Keep building that friendship! It's precious in these times.",
  "Puro is lucky to have you. Don't give up on each other.",
  "Trust is the foundation of any good relationship. You're doing great!",
  "The bond you're forming is special. Cherish it.",
];

export function generateResponse(letterContent: string): string {
  const content = letterContent.toLowerCase();
  
  // Check for keywords to provide contextual responses
  if (content.includes('friend') || content.includes('trust')) {
    return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)];
  }
  
  if (content.includes('?') || content.includes('how') || content.includes('what')) {
    return curiousResponses[Math.floor(Math.random() * curiousResponses.length)];
  }
  
  return friendlyResponses[Math.floor(Math.random() * friendlyResponses.length)];
}
