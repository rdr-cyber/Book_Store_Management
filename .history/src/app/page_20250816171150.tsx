import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, BookUp, UserCheck } from "lucide-react";
import BookCard from "@/components/BookCard";
import { allBooks } from "@/lib/sample-data";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="bg-secondary py-20 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Find Your Next Great Read
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Discover a world of stories. ShelfWise brings you closer to the
            books you'll love, from talented authors around the globe.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/login?role=reader">Explore the Bookstore</Link>
            </Button>
            <Button asChild variant="link" size="lg">
              <Link href="/login?role=author">
                Start Publishing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                A Platform for Authors & Readers
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                ShelfWise is a community-driven marketplace where authors can
                independently publish their work and readers can discover new
                voices. We provide the tools for authors to succeed and the
                platform for readers to explore.
              </p>
              <div className="mt-8 flex gap-4">
                <Button asChild>
                  <Link href="/register?as=reader">Start Reading</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/register?as=author">Start Publishing</Link>
                </Button>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="C:\Users\debad\Desktop\Book_Store_Management\home_page_logo.pny"
                width="600"
                height="400"
                alt="A platform for authors and readers"
                className="rounded-lg shadow-xl"
                data-ai-hint="authors readers"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16 sm:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center">
                <UserCheck className="mr-3 h-8 w-8 text-primary" /> For Readers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Our AI-powered recommendation engine helps you discover books
                tailored to your unique taste. Build your digital library and
                access your purchased books anytime.
              </p>
              <Button asChild>
                <Link href="/register?as=reader">Create Reader Account</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center">
                <BookUp className="mr-3 h-8 w-8 text-primary" /> For Authors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Publish your work with ease and reach a global audience. Our
                platform provides the tools you need to manage your books and
                track your royalties.
              </p>
              <Button asChild>
                <Link href="/register?as=author">Create Author Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
