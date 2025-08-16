import PersonalizedSuggestionsForm from "@/components/PersonalizedSuggestionsForm";

export default function SuggestionsPage({ searchParams }: { searchParams: { role: string }}) {
  const role = searchParams.role || 'reader';

  const pageDetails = {
    reader: {
      title: "AI Book Recommender",
      description: "Discover your next favorite book. Tell us about your reading history, and our AI will provide personalized suggestions just for you.",
    },
    author: {
      title: "AI Book Idea Generator",
      description: "Get inspiration for your next bestseller. Tell us about a genre or theme, and our AI will generate unique book ideas for you.",
    }
  }

  const details = role === 'author' ? pageDetails.author : pageDetails.reader;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          {details.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {details.description}
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-xl">
        <PersonalizedSuggestionsForm role={role} />
      </div>
    </div>
  );
}
