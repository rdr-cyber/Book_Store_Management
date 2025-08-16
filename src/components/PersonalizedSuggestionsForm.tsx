"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { suggestBooks, type State } from "@/app/ai/suggestions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2, BookHeart, BookX, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        "Thinking..."
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Get Suggestions
        </>
      )}
    </Button>
  );
}

export default function PersonalizedSuggestionsForm({ role }: { role: string }) {
  const initialState: State = { message: null, errors: {}, suggestions: [] };
  const [state, dispatch] = useActionState(suggestBooks, initialState);
  const { toast } = useToast();

  const formDetails = {
      reader: {
          title: "What have you read?",
          label: "List some books or authors you enjoy, or describe your taste.",
          placeholder: "e.g., 'I love epic fantasy like The Lord of the Rings, and historical fiction set in ancient Rome. I recently read and enjoyed Project Hail Mary.'",
          icon: <BookHeart className="h-4 w-4" />,
          alertTitle: "Your Recommendations"
      },
      author: {
          title: "What's your next book about?",
          label: "Describe a genre, theme, or a vague idea you have.",
          placeholder: "e.g., 'A sci-fi mystery set on a space station orbiting a black hole.' or 'A fantasy novel about a school for dragon riders.'",
          icon: <Lightbulb className="h-4 w-4" />,
          alertTitle: "Your Book Ideas"
      }
  }

  const details = role === 'author' ? formDetails.author : formDetails.reader;
  
  useEffect(() => {
    if (state.message && state.errors && Object.keys(state.errors).length > 0) {
       toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center font-headline text-2xl">
          {details.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="role" value={role} />
          <div className="space-y-2">
            <Label htmlFor="readingHistory">
              {details.label}
            </Label>
            <Textarea
              id="readingHistory"
              name="readingHistory"
              placeholder={details.placeholder}
              rows={5}
              required
            />
            {state?.errors?.readingHistory && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.readingHistory.join(", ")}
              </p>
            )}
          </div>
          <SubmitButton />
        </form>

        {state.suggestions && state.suggestions.length > 0 && (
          <div className="mt-6">
            <Alert>
              {details.icon}
              <AlertTitle className="font-headline">
                {details.alertTitle}
              </AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {state.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {state.message && (!state.suggestions || state.suggestions.length === 0) && (!state.errors || Object.keys(state.errors).length === 0) && (
             <div className="mt-6">
                <Alert variant="destructive">
                  <BookX className="h-4 w-4" />
                  <AlertTitle className="font-headline">Oops!</AlertTitle>
                  <AlertDescription>
                   {state.message}
                  </AlertDescription>
                </Alert>
              </div>
        )}

      </CardContent>
    </Card>
  );
}
