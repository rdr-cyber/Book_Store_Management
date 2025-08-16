
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const userType = searchParams.get("role") || "reader";

  const handleLogin = (event: React.FormEvent<HTMLFormElement>, role: UserRole) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("first-name") as string;
    const lastName = formData.get("last-name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!firstName || !lastName || !email || !password) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please fill out all fields.",
      });
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = storedUsers.find(
      (u: any) =>
        u.firstName === firstName &&
        u.lastName === lastName &&
        u.email === email &&
        u.password === password &&
        u.role === role
    );

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      toast({
        title: "Login Successful",
        description: `Welcome back, ${firstName}! Redirecting to your dashboard.`,
      });
      router.push(role === "author" ? `/author/dashboard` : `/reader/dashboard`);
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials or user does not exist for this role. Please sign up.",
      });
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-secondary/50">
      <Tabs defaultValue={userType} className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reader">Reader</TabsTrigger>
          <TabsTrigger value="author">Author</TabsTrigger>
        </TabsList>
        <TabsContent value="reader">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">
                Reader Login
              </CardTitle>
              <CardDescription>
                Enter your details below to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleLogin(e, "reader")} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="first-name-reader">First Name</Label>
                        <Input id="first-name-reader" name="first-name" placeholder="John" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="last-name-reader">Last Name</Label>
                        <Input id="last-name-reader" name="last-name" placeholder="Doe" required />
                    </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email-reader">Email</Label>
                  <Input
                    id="email-reader"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password-reader">Password</Label>
                  </div>
                  <Input id="password-reader" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="author">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">
                Author Login
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your author dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleLogin(e, "author")} className="grid gap-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="first-name-author">First Name</Label>
                        <Input id="first-name-author" name="first-name" placeholder="Jane" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="last-name-author">Last Name</Label>
                        <Input id="last-name-author" name="last-name" placeholder="Smith" required />
                    </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email-author">Email</Label>
                  <Input
                    id="email-author"
                    name="email"
                    type="email"
                    placeholder="author@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password-author">Password</Label>
                  </div>
                  <Input id="password-author" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Not an author yet?{" "}
                <Link href="/register" className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
