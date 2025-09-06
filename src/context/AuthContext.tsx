'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChange } from '@/lib/auth';
import { getUserById } from '@/lib/database';
import { AuthUser, User } from '@/lib/types';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  authUser: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user data
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setAuthUser(userData);
        // Fetch full user data from database
        fetchUserData(userData.uid);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
      }
    }

    // Listen for Supabase auth state changes
    const unsubscribe = onAuthStateChange(async (supabaseUser: SupabaseUser | null) => {
      if (supabaseUser) {
        // User is signed in
        try {
          const userData = await getUserById(supabaseUser.id);
          if (userData) {
            setUser(userData);
            const authUserData: AuthUser = {
              uid: supabaseUser.id,
              email: supabaseUser.email!,
              role: userData.role,
              firstName: userData.firstName,
              lastName: userData.lastName,
            };
            setAuthUser(authUserData);
            localStorage.setItem('currentUser', JSON.stringify(authUserData));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // User is signed out
        setUser(null);
        setAuthUser(null);
        localStorage.removeItem('currentUser');
      }
      setLoading(false);
    });

    // Listen for storage events (for logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser' && e.newValue === null) {
        setUser(null);
        setAuthUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const userData = await getUserById(userId);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (authUser) {
      await fetchUserData(authUser.uid);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setUser(null);
        setAuthUser(null);
        localStorage.removeItem('currentUser');
        // Dispatch storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'currentUser',
          newValue: null,
          oldValue: localStorage.getItem('currentUser'),
        }));
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      authUser,
      loading,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for checking if user has specific role
export function useRole(requiredRole: string) {
  const { authUser } = useAuth();
  return authUser?.role === requiredRole;
}

// Hook for checking if user is authenticated
export function useIsAuthenticated() {
  const { authUser } = useAuth();
  return !!authUser;
}