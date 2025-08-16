"use server";

import { getPersonalizedBookSuggestions, getAuthorBookIdeas } from "@/ai/flows/personalized-book-suggestions";
import { z } from "zod";

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
    let result;
    if (role === 'author') {
        result = await getAuthorBookIdeas(input);
    } else {
        result = await getPersonalizedBookSuggestions(input);
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
    return { message: "An unexpected error occurred. Please try again later." };
  }
}
