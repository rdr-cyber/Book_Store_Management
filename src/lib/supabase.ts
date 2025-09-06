import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Validate that we have proper Supabase configuration
const isValidSupabaseConfig = 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'your_supabase_anon_key' && 
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co');

// Create a mock client for development when Supabase is not configured
const createMockClient = () => ({
  auth: {
    signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: (callback: Function) => {
      // Return a mock subscription
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      order: () => Promise.resolve({ data: [], error: null }),
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      }),
    }),
    update: () => ({
      eq: () => Promise.resolve({ error: new Error('Supabase not configured') }),
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: new Error('Supabase not configured') }),
    }),
  }),
  rpc: () => Promise.resolve({ error: new Error('Supabase not configured') }),
});

// Client-side Supabase client
export const supabase = (() => {
  if (isValidSupabaseConfig) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  return createMockClient();
})();

// Browser client for SSR
export const createSupabaseBrowserClient = () => {
  if (isValidSupabaseConfig) {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return createMockClient();
};

// Export configuration status
export const isSupabaseConfigured = isValidSupabaseConfig;

// Database Tables Schema Types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'reader' | 'author' | 'admin';
          avatar_url?: string;
          bio?: string;
          created_at: string;
          updated_at: string;
          is_active: boolean;
          // Author specific
          author_verified?: boolean;
          total_books?: number;
          total_sales?: number;
          total_revenue?: number;
          // Reader specific
          followed_authors?: string[];
          purchased_books?: string[];
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'reader' | 'author' | 'admin';
          avatar_url?: string;
          bio?: string;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          author_verified?: boolean;
          total_books?: number;
          total_sales?: number;
          total_revenue?: number;
          followed_authors?: string[];
          purchased_books?: string[];
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: 'reader' | 'author' | 'admin';
          avatar_url?: string;
          bio?: string;
          updated_at?: string;
          is_active?: boolean;
          author_verified?: boolean;
          total_books?: number;
          total_sales?: number;
          total_revenue?: number;
          followed_authors?: string[];
          purchased_books?: string[];
        };
      };
      books: {
        Row: {
          id: string;
          title: string;
          author_name: string;
          author_id: string;
          price: number;
          image_url?: string;
          description: string;
          category: string;
          cover_type: string;
          stock: number;
          reorder_point: number;
          book_file_url?: string;
          published_at: string;
          updated_at: string;
          sales: number;
          revenue: number;
          average_rating: number;
          total_reviews: number;
        };
        Insert: {
          id?: string;
          title: string;
          author_name: string;
          author_id: string;
          price: number;
          image_url?: string;
          description: string;
          category: string;
          cover_type: string;
          stock: number;
          reorder_point: number;
          book_file_url?: string;
          published_at?: string;
          updated_at?: string;
          sales?: number;
          revenue?: number;
          average_rating?: number;
          total_reviews?: number;
        };
        Update: {
          title?: string;
          author_name?: string;
          price?: number;
          image_url?: string;
          description?: string;
          category?: string;
          cover_type?: string;
          stock?: number;
          reorder_point?: number;
          book_file_url?: string;
          updated_at?: string;
          sales?: number;
          revenue?: number;
          average_rating?: number;
          total_reviews?: number;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          books: any;
          total_amount: number;
          status: string;
          payment_method: string;
          payment_gateway: string;
          payment_id?: string;
          order_id?: string;
          created_at: string;
          completed_at?: string;
          shipping_address?: any;
        };
        Insert: {
          id?: string;
          user_id: string;
          books: any;
          total_amount: number;
          status: string;
          payment_method: string;
          payment_gateway: string;
          payment_id?: string;
          order_id?: string;
          created_at?: string;
          completed_at?: string;
          shipping_address?: any;
        };
        Update: {
          status?: string;
          payment_id?: string;
          completed_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          book_id: string;
          user_id: string;
          username: string;
          rating: number;
          comment: string;
          created_at: string;
          author_reply?: string;
          reader_follow_up?: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          user_id: string;
          username: string;
          rating: number;
          comment: string;
          created_at?: string;
          author_reply?: string;
          reader_follow_up?: string;
        };
        Update: {
          rating?: number;
          comment?: string;
          author_reply?: string;
          reader_follow_up?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          reader_id: string;
          author_id: string;
          followed_at: string;
        };
        Insert: {
          id?: string;
          reader_id: string;
          author_id: string;
          followed_at?: string;
        };
        Update: {};
      };
    };
  };
};

export default supabase;