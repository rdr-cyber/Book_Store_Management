
'use client';

import Link from 'next/link';
import {
  BookOpenCheck,
  Menu,
  Search,
  ShoppingCart,
  User,
  LogIn,
  LogOut,
  Library,
  LayoutDashboard,
  Home,
  Book,
  Wand2,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/types';


const navLinksConfig = {
    reader: [
        { href: '/reader/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/books', label: 'Browse Books', icon: Book },
        { href: '/ai/suggestions?role=reader', label: 'AI Suggestions', icon: Wand2 },
    ],
    author: [
        { href: '/author/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/ai/suggestions?role=author', label: 'AI Book Ideas', icon: Wand2 },
    ],
    guest: [
        { href: '/', label: 'Home', icon: Home },
    ]
}

type UserInfo = {
    firstName: string;
    lastName: string;
    role: UserRole;
}

export default function Header() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);

    const updateUserState = () => {
        try {
          const loggedInUser = localStorage.getItem('loggedInUser');
          if (loggedInUser) {
              setUser(JSON.parse(loggedInUser));
          } else {
              setUser(null);
          }
        } catch (error) {
            setUser(null);
        }
    };

    const updateCartCount = () => {
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.length);
        } catch (error) {
            setCartCount(0);
        }
    };
    
    updateUserState();
    updateCartCount();

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'loggedInUser' || event.key === 'cart') {
            updateUserState();
            updateCartCount();
        }
    }
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for cart updates from other components
    const handleCartUpdate = () => {
        updateCartCount();
    }
    window.addEventListener('cartUpdated', handleCartUpdate);


    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('cartUpdated', handleCartUpdate);
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery) {
        router.push(`/books?q=${encodeURIComponent(searchQuery)}`);
    } else {
        router.push('/books');
    }
  };
  
  if (!hasMounted) {
    // Render a placeholder or null on the server and initial client render
    return (
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
            {/* This empty div matches the server render to prevent hydration mismatch */}
        </div>
      </header>
    );
  }
  
  const role = user?.role;
  const navLinks = role ? navLinksConfig[role] : navLinksConfig.guest;
  const homePath = role === 'author' ? '/author/dashboard' : role === 'reader' ? '/reader/dashboard' : '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href={homePath} className="mr-6 flex items-center space-x-2">
            <BookOpenCheck className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              ShelfWise
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile Nav */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href={homePath} className="mr-6 flex items-center space-x-2">
                  <BookOpenCheck className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">ShelfWise</span>
                </Link>
                <nav className="mt-6 flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          
          {role === 'reader' && (
             <form onSubmit={handleSearch} className="relative flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                name="search"
                placeholder="Search books..."
                className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
                />
            </form>
          )}


          <nav className="flex items-center">
            {role === 'reader' && (
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/cart" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                             <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                {cartCount}
                            </span>
                        )}
                        <span className="sr-only">Shopping Cart</span>
                    </Link>
                </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuLabel>Welcome, {user.firstName}!</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === 'reader' ? (
                       <>
                        <DropdownMenuItem asChild>
                          <Link href="/reader/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/reader/library">
                            <Library className="mr-2 h-4 w-4" />
                            <span>My Library</span>
                          </Link>
                        </DropdownMenuItem>
                       </>
                    ) : ( // Author links
                      <DropdownMenuItem asChild>
                        <Link href="/author/dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                     <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                  </>
                ) : ( // Guest links
                  <>
                    <DropdownMenuLabel>Welcome</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login">
                          <LogIn className="mr-2 h-4 w-4" />
                          <span>Login</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">
                          <User className="mr-2 h-4 w-4" />
                          <span>Register</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}