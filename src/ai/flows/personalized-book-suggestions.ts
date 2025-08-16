'use server';

/**
 * @fileOverview AI flows for book suggestions for readers and authors.
 *
 * - getPersonalizedBookSuggestions - A function that provides book recommendations based on reading history.
 * - getAuthorBookIdeas - A function that generates book ideas for authors based on a prompt.
 * - SuggestionsInput - The input type for the suggestion functions.
 * - SuggestionsOutput - The return type for the suggestion functions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestionsInputSchema = z.object({
  readingHistory: z
    .string()
    .describe('A comma separated list of books the user has read, or a topic/genre for an author.'),
  numberOfSuggestions: z.number().default(3).describe('The number of suggestions to return.'),
});
export type SuggestionsInput = z.infer<
  typeof SuggestionsInputSchema
>;

const SuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of personalized book suggestions.'),
});
export type SuggestionsOutput = z.infer<
  typeof SuggestionsOutputSchema
>;

// Flow for Readers
export async function getPersonalizedBookSuggestions(
  input: SuggestionsInput
): Promise<SuggestionsOutput> {
  return personalizedBookSuggestionsFlow(input);
}

const readerPrompt = ai.definePrompt({
  name: 'personalizedBookSuggestionsPrompt',
  input: {schema: SuggestionsInputSchema},
  output: {schema: SuggestionsOutputSchema},
  prompt: `You are a book recommendation expert. Given a user's reading history, provide personalized book suggestions.

Reading History: {{{readingHistory}}}

Please provide {{numberOfSuggestions}} book suggestions that the user might enjoy.`,
});

const personalizedBookSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedBookSuggestionsFlow',
    inputSchema: SuggestionsInputSchema,
    outputSchema: SuggestionsOutputSchema,
  },
  async input => {
    const {output} = await readerPrompt(input);
    return output!;
  }
);


// Flow for Authors
export async function getAuthorBookIdeas(
  input: SuggestionsInput
): Promise<SuggestionsOutput> {
    return authorBookIdeasFlow(input);
}

const authorPrompt = ai.definePrompt({
    name: 'authorBookIdeasPrompt',
    input: {schema: SuggestionsInputSchema},
    output: {schema: SuggestionsOutputSchema},
    prompt: `You are an expert in creative writing and publishing. Based on the following topic or genre, generate compelling book ideas for an author.

Topic/Genre: {{{readingHistory}}}

Please provide {{numberOfSuggestions}} unique and interesting book ideas. For each idea, give a catchy title and a one-sentence synopsis. Format each suggestion as: "Title: [Book Title] - [Synopsis]"`,
});

const authorBookIdeasFlow = ai.defineFlow(
    {
        name: 'authorBookIdeasFlow',
        inputSchema: SuggestionsInputSchema,
        outputSchema: SuggestionsOutputSchema,
    },
    async input => {
        const {output} = await authorPrompt(input);
        return output!;
    }
);
