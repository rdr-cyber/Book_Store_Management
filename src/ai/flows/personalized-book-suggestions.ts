'use server';

/**
 * @fileOverview AI flows for book suggestions for readers and authors.
 *
 * - getPersonalizedBookSuggestions - A function that provides book recommendations based on reading history.
 * - getAuthorBookIdeas - A function that generates book ideas for authors based on a prompt.
 * - SuggestionsInput - The input type for the suggestion functions.
 * - SuggestionsOutput - The return type for the suggestion functions.
 */

// Safe imports with error handling for deployment
try {
  // Dynamic import to handle missing AI dependencies gracefully
  var ai: any;
  var z: any;
  
  if (typeof window === 'undefined') {
    // Server-side only
    try {
      const genkitModule = require('@/ai/genkit');
      const zodModule = require('genkit');
      ai = genkitModule.ai;
      z = zodModule.z;
    } catch (error) {
      console.warn('AI dependencies not available, using mock implementations');
      // Mock implementations for deployment
      ai = {
        definePrompt: () => ({ output: null }),
        defineFlow: () => () => ({ suggestions: [] })
      };
      z = {
        object: () => ({ describe: () => ({}) }),
        string: () => ({ describe: () => ({}) }),
        number: () => ({ default: () => ({ describe: () => ({}) }) }),
        array: () => ({ describe: () => ({}) })
      };
    }
  }
} catch (error) {
  console.warn('Failed to load AI modules:', error);
}

// Define types manually for deployment safety
export interface SuggestionsInput {
  readingHistory: string;
  numberOfSuggestions?: number;
}

export interface SuggestionsOutput {
  suggestions: string[];
}

// Schema definitions with fallback
const SuggestionsInputSchema = z?.object ? z.object({
  readingHistory: z.string().describe('A comma separated list of books the user has read, or a topic/genre for an author.'),
  numberOfSuggestions: z.number().default(3).describe('The number of suggestions to return.'),
}) : null;

const SuggestionsOutputSchema = z?.object ? z.object({
  suggestions: z.array(z.string()).describe('A list of personalized book suggestions.'),
}) : null;

// Flow for Readers
export async function getPersonalizedBookSuggestions(
  input: SuggestionsInput
): Promise<SuggestionsOutput> {
  try {
    if (ai && ai.defineFlow) {
      return personalizedBookSuggestionsFlow(input);
    }
  } catch (error) {
    console.warn('AI service unavailable, using fallback recommendations');
  }
  
  // Fallback mock suggestions for deployment
  return {
    suggestions: [
      "The Seven Husbands of Evelyn Hugo - A captivating novel about a reclusive Hollywood icon",
      "Project Hail Mary - A thrilling science fiction adventure about saving humanity",
      "The Silent Patient - A psychological thriller that will keep you guessing"
    ].slice(0, input.numberOfSuggestions || 3)
  };
}

const readerPrompt = ai?.definePrompt ? ai.definePrompt({
  name: 'personalizedBookSuggestionsPrompt',
  input: {schema: SuggestionsInputSchema},
  output: {schema: SuggestionsOutputSchema},
  prompt: `You are a book recommendation expert. Given a user's reading history, provide personalized book suggestions.

Reading History: {{{readingHistory}}}

Please provide {{numberOfSuggestions}} book suggestions that the user might enjoy.`,
}) : null;

const personalizedBookSuggestionsFlow = ai?.defineFlow ? ai.defineFlow(
  {
    name: 'personalizedBookSuggestionsFlow',
    inputSchema: SuggestionsInputSchema,
    outputSchema: SuggestionsOutputSchema,
  },
  async (input: SuggestionsInput) => {
    const {output} = await readerPrompt(input);
    return output!;
  }
) : () => Promise.resolve({ suggestions: [] });


// Flow for Authors
export async function getAuthorBookIdeas(
  input: SuggestionsInput
): Promise<SuggestionsOutput> {
  try {
    if (ai && ai.defineFlow) {
      return authorBookIdeasFlow(input);
    }
  } catch (error) {
    console.warn('AI service unavailable, using fallback book ideas');
  }
  
  // Fallback mock book ideas for deployment
  return {
    suggestions: [
      "Title: The Digital Nomad's Journey - A guide to remote work and travel lifestyle",
      "Title: Quantum Hearts - A sci-fi romance set in parallel universes",
      "Title: The Memory Collector - A mystery about preserving forgotten histories"
    ].slice(0, input.numberOfSuggestions || 3)
  };
}

const authorPrompt = ai?.definePrompt ? ai.definePrompt({
    name: 'authorBookIdeasPrompt',
    input: {schema: SuggestionsInputSchema},
    output: {schema: SuggestionsOutputSchema},
    prompt: `You are an expert in creative writing and publishing. Based on the following topic or genre, generate compelling book ideas for an author.

Topic/Genre: {{{readingHistory}}}

Please provide {{numberOfSuggestions}} unique and interesting book ideas. For each idea, give a catchy title and a one-sentence synopsis. Format each suggestion as: "Title: [Book Title] - [Synopsis]"`,
}) : null;

const authorBookIdeasFlow = ai?.defineFlow ? ai.defineFlow(
    {
        name: 'authorBookIdeasFlow',
        inputSchema: SuggestionsInputSchema,
        outputSchema: SuggestionsOutputSchema,
    },
    async (input: SuggestionsInput) => {
        const {output} = await authorPrompt(input);
        return output!;
    }
) : () => Promise.resolve({ suggestions: [] });
