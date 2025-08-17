
"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Eye, EyeOff } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

export default function SettingsPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [user, setUser] = useState<User | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        try {
            const loggedInUserString = localStorage.getItem('loggedInUser');
            if (loggedInUserString) {
                const loggedInUser: User = JSON.parse(loggedInUserString);
                setUser(loggedInUser);
                setFirstName(loggedInUser.firstName);
                setLastName(loggedInUser.lastName);
                setEmail(loggedInUser.email);
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to view this page.' });
                router.push('/login');
            }
        } catch (error) {
            console.error("Failed to load user data", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load your data.' });
        }
    }, [router, toast]);

    const handleSaveChanges = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast({ variant: 'destructive', title: 'Error', description: 'Passwords do not match.' });
            return;
        }

        if (password && password.length < 6) {
             toast({ variant: 'destructive', title: 'Error', description: 'Password must be at least 6 characters long.' });
            return;
        }

        try {
            const allUsersString = localStorage.getItem('users');
            if (!allUsersString || !user) {
                toast({ variant: 'destructive', title: 'Error', description: 'Could not find user data.' });
                return;
            }

            let allUsers: User[] = JSON.parse(allUsersString);
            
            const userIndex = allUsers.findIndex(u => u.id === user.id);
            if (userIndex === -1) {
                 toast({ variant: 'destructive', title: 'Error', description: 'Could not find your account to update.' });
                return;
            }
            
            const updatedUser: User = {
                ...allUsers[userIndex],
                firstName,
                lastName,
                email,
                ...(password && { password: password }), // Only include password if it's being changed
            };
            
            allUsers[userIndex] = updatedUser;
            
            localStorage.setItem('users', JSON.stringify(allUsers));
            localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

            // Manually dispatch storage event to update header immediately
            window.dispatchEvent(new StorageEvent('storage', { key: 'loggedInUser' }));

            toast({ title: 'Success!', description: 'Your account details have been updated.' });
            setPassword('');
            setConfirmPassword('');

        } catch (error) {
            console.error("Failed to save user data", error);
            toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
        }
    };
    
    if (!user) {
        return <div>Loading...</div>; // Or a skeleton loader
    }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Account Settings</CardTitle>
          <CardDescription>
            Manage your account details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveChanges} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <CardTitle className="font-headline text-xl pt-4 border-t">Change Password</CardTitle>
             <p className="text-sm text-muted-foreground -mt-4">
                Leave these fields blank to keep your current password.
            </p>

            <div className="space-y-2 relative">
                <Label htmlFor="password">New Password</Label>
                <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="New password"
                />
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-6 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
            </div>
             <div className="space-y-2 relative">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                 <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                />
                 <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-6 h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
            </div>

            <div className="flex justify-end pt-4">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button type="button">Save Changes</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will update your account details. If you've changed your password, you may need to log in again on other devices.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => (document.querySelector('form') as HTMLFormElement).requestSubmit()}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}