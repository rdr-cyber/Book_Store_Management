'use server';

/**
 * @fileOverview AI flows for book suggestions for readers and authors.
 * Deployment-safe version with fallback implementations.
 */

// Define types for deployment safety
export interface SuggestionsInput {
  readingHistory: string;
  numberOfSuggestions?: number;
}

export interface SuggestionsOutput {
  suggestions: string[];
}

// Flow for Readers
export async function getPersonalizedBookSuggestions(
  input: SuggestionsInput
): Promise<SuggestionsOutput> {
  // Fallback recommendations for deployment
  const recommendations = [
    "The Seven Husbands of Evelyn Hugo - A captivating novel about a reclusive Hollywood icon",
    "Project Hail Mary - A thrilling science fiction adventure about saving humanity",
    "The Silent Patient - A psychological thriller that will keep you guessing",
    "Where the Crawdads Sing - A beautiful coming-of-age story set in the marshlands",
    "The Midnight Library - A thought-provoking tale about life's infinite possibilities",
    "Educated - A powerful memoir about education and family",
    "The Alchemist - An inspiring tale of following your dreams",
    "Atomic Habits - A practical guide to building good habits"
  ];
  
  const numberOfSuggestions = input.numberOfSuggestions || 3;
  const shuffled = recommendations.sort(() => 0.5 - Math.random());
  
  return {
    suggestions: shuffled.slice(0, Math.min(numberOfSuggestions, recommendations.length))
  };
}

// Flow for Authors
export async function getAuthorBookIdeas(
  input: SuggestionsInput
): Promise<SuggestionsOutput> {
  // Fallback book ideas for deployment
  const bookIdeas = [
    "Title: The Digital Nomad's Journey - A guide to remote work and travel lifestyle",
    "Title: Quantum Hearts - A sci-fi romance set in parallel universes",
    "Title: The Memory Collector - A mystery about preserving forgotten histories",
    "Title: Code of the Wild - An adventure story about surviving in a tech-free wilderness",
    "Title: The AI Whisperer - A thriller about the first person who can communicate with artificial intelligence",
    "Title: Shadows of the Past - A historical fiction about uncovering family secrets",
    "Title: The Last Bookstore - A literary fiction about preserving culture in a digital age",
    "Title: Echoes of Tomorrow - A sci-fi thriller about time manipulation and its consequences"
  ];
  
  const numberOfSuggestions = input.numberOfSuggestions || 3;
  const shuffled = bookIdeas.sort(() => 0.5 - Math.random());
  
  return {
    suggestions: shuffled.slice(0, Math.min(numberOfSuggestions, bookIdeas.length))
  };
}
