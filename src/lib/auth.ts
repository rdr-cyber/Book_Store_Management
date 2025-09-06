import { supabase, isSupabaseConfigured } from './supabase';
import { createUser, getUserByEmail } from './database';
import { User, UserRole, AuthUser } from './types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthError, User as SupabaseUser } from '@supabase/supabase-js';

// Register a new user
export const registerUser = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string, 
  role: UserRole
): Promise<AuthUser> => {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      // For development without Supabase, simulate user creation
      console.warn('Supabase not configured. Using mock authentication.');
      
      // Check if user already exists (mock)
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create mock user
      const mockUserId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const userData: Omit<User, 'id'> = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date(),
        isActive: true,
      };

      await createUser(userData);

      return {
        uid: mockUserId,
        email,
        role,
        firstName,
        lastName,
      };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role,
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // Hash password for database storage
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user document in Supabase database
    const userData: Omit<User, 'id'> = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      isActive: true,
    };

    await createUser(userData);

    return {
      uid: authData.user.id,
      email: authData.user.email!,
      role,
      firstName,
      lastName,
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Sign in user
export const signInUser = async (email: string, password: string): Promise<AuthUser> => {
  try {
    // Get user from database to check role and status
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    if (!user.password) {
      throw new Error('User password not found');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // If Supabase is configured, sign in with Supabase Auth
    if (isSupabaseConfigured) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.warn('Supabase auth error:', authError.message);
        // Continue with mock auth if Supabase fails
      } else if (authData.user) {
        return {
          uid: authData.user.id,
          email: authData.user.email!,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      }
    }

    // Mock authentication for development
    console.warn('Using mock authentication.');
    const mockUserId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      uid: mockUserId,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (error) {
    console.error('Error signing in user:', error);
    throw error;
  }
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  try {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      console.warn('Using mock sign out.');
    }
  } catch (error) {
    console.error('Error signing out user:', error);
    throw error;
  }
};

// Get current user session
export const getCurrentUser = async (): Promise<SupabaseUser | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Generate JWT token
export const generateJWTToken = (user: AuthUser): string => {
  const payload = {
    uid: user.uid,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '24h',
  });
};

// Verify JWT token
export const verifyJWTToken = (token: string): AuthUser => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Auth state listener using Supabase
export const onAuthStateChange = (callback: (user: SupabaseUser | null) => void) => {
  if (!isSupabaseConfigured) {
    // Mock implementation for development
    console.warn('Supabase not configured. Using mock auth state listener.');
    
    // Return a mock unsubscribe function
    return () => {
      console.log('Mock auth state listener unsubscribed');
    };
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
};

// Validate password strength
export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

// Compare password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};