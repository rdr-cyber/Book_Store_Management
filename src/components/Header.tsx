
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
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
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
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface NavLink {
  href: string;
  label: string;
  icon: any;
}

type NavLinksConfig = {
  reader: NavLink[];
  author: NavLink[];
  admin?: NavLink[];
  guest: NavLink[];
};

const navLinksConfig: NavLinksConfig = {
  reader: [
    { href: '/reader/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/books', label: 'Browse Books', icon: Book },
    { href: '/ai/suggestions?role=reader', label: 'AI Suggestions', icon: Wand2 },
  ],
  author: [
    { href: '/author/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/ai/suggestions?role=author', label: 'AI Book Ideas', icon: Wand2 },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Admin Panel', icon: Settings },
    { href: '/admin/users', label: 'Users', icon: User },
  ],
  guest: [
    { href: '/', label: 'Home', icon: Home },
  ]
};

type UserInfo = {
  firstName: string;
  lastName: string;
  role: UserRole;
};

export default function Header() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
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
    setHasMounted(true);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'loggedInUser' || event.key === null) { 
        updateUserState();
      }
      if (event.key === 'cart' || event.key === null) {
        updateCartCount();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const handleCartUpdate = () => {
      updateCartCount();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    window.dispatchEvent(new StorageEvent('storage', { key: 'loggedInUser', newValue: null }));
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const role = user?.role;
  const navLinks = hasMounted && role && navLinksConfig[role as keyof NavLinksConfig] ? navLinksConfig[role as keyof NavLinksConfig] : navLinksConfig.guest;
  const homePath = hasMounted && role ? (role === 'author' ? '/author/dashboard' : '/reader/dashboard') : '/';
  
  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/95 shadow-lg shadow-black/5"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container flex h-16 items-center">
        {/* Logo Section */}
        <div className="mr-4 hidden md:flex">
          <Link href={homePath} className="mr-6 flex items-center space-x-3 group">
            <motion.div
              className="p-2.5 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-2xl shadow-lg group-hover:shadow-xl"
              whileHover={{ 
                scale: 1.05,
                rotate: 5,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
              }}
              transition={{ duration: 0.3, type: "spring", stiffness: 400 }}
            >
              <BookOpenCheck className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex items-center space-x-2">
              <span className="hidden font-black sm:inline-block font-headline text-2xl bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                ShelfWise
              </span>
              <motion.div
                className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
              >
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </motion.div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-1">
            {navLinks?.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    <IconComponent className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-600 relative z-10" />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Mobile Navigation */}
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Sheet>
              <SheetTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl">
                <SheetHeader>
                  <Link href={homePath} className="flex items-center space-x-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-2xl shadow-lg">
                      <BookOpenCheck className="h-6 w-6 text-white" />
                    </div>
                    <SheetTitle className="font-black text-2xl bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                      ShelfWise
                    </SheetTitle>
                  </Link>
                  <SheetDescription className="text-gray-600 font-medium">Navigate the future of reading.</SheetDescription>
                </SheetHeader>
                {hasMounted && (
                  <nav className="mt-6 flex flex-col space-y-2">
                    {navLinks?.map((link, index) => {
                      const IconComponent = link.icon;
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <Link
                            href={link.href}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 group relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                            <IconComponent className="h-5 w-5 relative z-10 group-hover:text-blue-600 transition-colors duration-300" />
                            <span className="relative z-10">{link.label}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                )}
              </SheetContent>
            </Sheet>
          </div>
          
            {/* Enhanced Search for Readers */}
          {hasMounted && role === 'reader' && (
            <motion.form 
              onSubmit={handleSearch} 
              className="relative flex-1 md:grow-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search amazing books..."
                className="w-full rounded-2xl bg-gray-50/80 backdrop-blur-sm border-0 pl-12 pr-4 py-3 md:w-[220px] lg:w-[360px] transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:shadow-2xl focus:scale-105 text-sm font-medium placeholder:text-gray-500"
              />
            </motion.form>
          )}

          {/* Action Buttons */}
          <nav className="flex items-center space-x-1">
            {/* Enhanced Shopping Cart */}
            {hasMounted && role === 'reader' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Button variant="ghost" size="icon" asChild className="relative hover:bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-lg">
                    <Link href="/cart">
                      <div className="relative">
                        <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-blue-600 transition-colors duration-300" />
                        <AnimatePresence>
                          {cartCount > 0 && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute -top-2 -right-2"
                            >
                              <Badge 
                                variant="destructive" 
                                className="h-6 w-6 p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 border-2 border-white shadow-lg"
                              >
                                {cartCount > 99 ? '99+' : cartCount}
                              </Badge>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <span className="sr-only">Shopping Cart</span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
            {/* Enhanced User Menu */}
            {hasMounted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-lg">
                        {user ? (
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {user.firstName.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <User className="h-5 w-5 text-gray-700 hover:text-blue-600 transition-colors duration-300" />
                        )}
                        <span className="sr-only">User Menu</span>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-2">
                    {user ? (
                      <>
                        <DropdownMenuLabel className="px-3 py-2">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-semibold text-gray-900">
                              Welcome, {user.firstName}!
                            </p>
                            <p className="text-xs text-gray-600 capitalize bg-blue-50 px-2 py-1 rounded-full w-fit">
                              {user.role}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-200/50" />
                        {user.role === 'reader' ? (
                          <>
                            <DropdownMenuItem asChild className="rounded-xl transition-colors duration-200 hover:bg-blue-50 focus:bg-blue-50">
                              <Link href="/reader/dashboard" className="flex items-center px-3 py-2">
                                <LayoutDashboard className="mr-3 h-4 w-4 text-blue-600" />
                                <span className="font-medium">Dashboard</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-xl transition-colors duration-200 hover:bg-blue-50 focus:bg-blue-50">
                              <Link href="/reader/library" className="flex items-center px-3 py-2">
                                <Library className="mr-3 h-4 w-4 text-purple-600" />
                                <span className="font-medium">My Library</span>
                              </Link>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem asChild className="rounded-xl transition-colors duration-200 hover:bg-blue-50 focus:bg-blue-50">
                            <Link href="/author/dashboard" className="flex items-center px-3 py-2">
                              <LayoutDashboard className="mr-3 h-4 w-4 text-blue-600" />
                              <span className="font-medium">Dashboard</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild className="rounded-xl transition-colors duration-200 hover:bg-blue-50 focus:bg-blue-50">
                          <Link href="/settings" className="flex items-center px-3 py-2">
                            <Settings className="mr-3 h-4 w-4 text-gray-600" />
                            <span className="font-medium">Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-200/50" />
                        <DropdownMenuItem 
                          onClick={handleLogout} 
                          className="rounded-xl transition-colors duration-200 hover:bg-red-50 focus:bg-red-50 text-red-600 px-3 py-2 cursor-pointer"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          <span className="font-medium">Sign out</span>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuLabel className="px-3 py-2">
                          <span className="text-sm font-semibold text-gray-900">Welcome to ShelfWise</span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-200/50" />
                        <DropdownMenuItem asChild className="rounded-xl transition-colors duration-200 hover:bg-blue-50 focus:bg-blue-50">
                          <Link href="/auth/login" className="flex items-center px-3 py-2">
                            <LogIn className="mr-3 h-4 w-4 text-blue-600" />
                            <span className="font-medium">Sign In</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl transition-colors duration-200 hover:bg-purple-50 focus:bg-purple-50">
                          <Link href="/auth/register" className="flex items-center px-3 py-2">
                            <User className="mr-3 h-4 w-4 text-purple-600" />
                            <span className="font-medium">Get Started</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}