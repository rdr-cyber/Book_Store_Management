
"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { UserRole, User } from "@/lib/types";


export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const userType = searchParams.get("as") || "reader";

  const handleRegister = (event: React.FormEvent<HTMLFormElement>, role: UserRole) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("first-name") as string;
    const lastName = formData.get("last-name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!firstName || !lastName || !email || !password) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Please fill out all fields.",
      });
      return;
    }

    const storedUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = storedUsers.some((user: User) => user.email === email && user.role === role);

    if (userExists) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: `An account with this email already exists for the ${role} role.`,
      });
      return;
    }

    const newUser: User = { 
        id: `user-${Date.now()}`,
        firstName, 
        lastName, 
        email, 
        password, 
        role 
    };
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    toast({
      title: "Registration Successful!",
      description: "You can now log in with your credentials.",
    });

    router.push(`/login?role=${role}`);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-secondary/50">
      <Tabs defaultValue={userType} className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reader">Reader Signup</TabsTrigger>
          <TabsTrigger value="author">Author Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="reader">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-headline">
                Create a Reader Account
              </CardTitle>
              <CardDescription>
                Join our community to discover and purchase books.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleRegister(e, "reader")} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name-reader">First name</Label>
                    <Input id="first-name-reader" name="first-name" placeholder="Max" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name-reader">Last name</Label>
                    <Input id="last-name-reader" name="last-name" placeholder="Robinson" required />
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
                  <Label htmlFor="password-reader">Password</Label>
                  <Input id="password-reader" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Create an account
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  Sign up with Google
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="author">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-headline">
                Become an Author
              </CardTitle>
              <CardDescription>
                Fill out the form to start publishing your books.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleRegister(e, "author")} className="grid gap-4">
                 <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name-author">First name</Label>
                    <Input id="first-name-author" name="first-name" placeholder="Max" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name-author">Last name</Label>
                    <Input id="last-name-author" name="last-name" placeholder="Robinson" required />
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
                  <Label htmlFor="password-author">Password</Label>
                  <Input id="password-author" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Create Author Account
                </Button>
                 <Button variant="outline" className="w-full" type="button">
                  Sign up with Google
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
