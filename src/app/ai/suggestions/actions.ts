"use server";

import { z } from "zod";

// Fallback function for when AI is not available
function generateFallbackSuggestions(role: string, readingHistory: string, numberOfSuggestions: number) {
  const readerSuggestions = [
    "To Kill a Mockingbird by Harper Lee - A timeless classic about justice and moral growth",
    "1984 by George Orwell - A dystopian masterpiece about surveillance and freedom",
    "The Great Gatsby by F. Scott Fitzgerald - An American classic about dreams and disillusionment",
    "Pride and Prejudice by Jane Austen - A witty romance about love and social class",
    "The Catcher in the Rye by J.D. Salinger - A coming-of-age story about teenage rebellion",
    "Dune by Frank Herbert - An epic science fiction saga about power and survival",
    "The Hobbit by J.R.R. Tolkien - A magical adventure in Middle-earth",
    "Brave New World by Aldous Huxley - A prophetic vision of a controlled society"
  ];

  const authorIdeas = [
    "The Digital Nomad's Dilemma - A contemporary fiction about finding belonging in a connected world",
    "Echoes of Tomorrow - A sci-fi thriller about time manipulation and its consequences",
    "The Last Bookstore - A literary fiction about preserving culture in a digital age",
    "Quantum Hearts - A romance novel set in a world where emotions affect reality",
    "The Memory Thief - A mystery about someone who can steal and manipulate memories",
    "Code of the Wild - An adventure story about surviving in a tech-free wilderness",
    "The AI Whisperer - A thriller about the first person who can communicate with artificial intelligence",
    "Shadows of the Past - A historical fiction about uncovering family secrets across generations"
  ];

  const suggestions = role === 'author' ? authorIdeas : readerSuggestions;
  const shuffled = suggestions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(numberOfSuggestions, suggestions.length));

  return { suggestions: selected };
}

const FormSchema = z.object({
  readingHistory: z
    .string()
    .min(10, { message: "Please provide more detail." }),
  numberOfSuggestions: z.coerce.number().min(1).max(10).default(3),
  role: z.string().default('reader'),
});

export type State = {
  message?: string | null;
  suggestions?: string[];
  errors?: {
    readingHistory?: string[];
    numberOfSuggestions?: string[];
    role?: string[];
  };
};

export async function suggestBooks(
  prevState: State | undefined,
  formData: FormData
) {
  const validatedFields = FormSchema.safeParse({
    readingHistory: formData.get("readingHistory"),
    numberOfSuggestions: formData.get("numberOfSuggestions"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your input.",
    };
  }

  const { role, ...input } = validatedFields.data;

  try {
    // Try to use AI flows, fallback to static suggestions
    let result;
    try {
      const { getPersonalizedBookSuggestions, getAuthorBookIdeas } = await import("@/ai/flows/personalized-book-suggestions");
      if (role === 'author') {
        result = await getAuthorBookIdeas(input);
      } else {
        result = await getPersonalizedBookSuggestions(input);
      }
    } catch (aiError) {
      console.warn('AI flows not available, using fallback suggestions');
      result = generateFallbackSuggestions(role, input.readingHistory, input.numberOfSuggestions);
    }

    if (result.suggestions && result.suggestions.length > 0) {
      return {
        message: "Here are your personalized suggestions!",
        suggestions: result.suggestions,
      };
    } else {
      return { message: "Could not generate suggestions. Please try again." };
    }
  } catch (error) {
    console.error(error);
    // Fallback to static suggestions on error
    const fallbackResult = generateFallbackSuggestions(role, input.readingHistory, input.numberOfSuggestions);
    return {
      message: "Here are some suggestions for you!",
      suggestions: fallbackResult.suggestions,
    };
  }
}
