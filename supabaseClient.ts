import { createClient } from '@supabase/supabase-js';
import { DiaryEntry } from './types';

// --- IMPORTANT SETUP ---
// The application requires your Supabase credentials to connect to the database.
// Please replace the placeholder values below with your actual Supabase URL and Anon Key.
// You can find these in your Supabase project dashboard under Project Settings > API.
const supabaseUrl = 'https://ksubsviatxrqfjdgreca.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdWJzdmlhdHhycWZqZGdyZWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNzU5NTEsImV4cCI6MjA3NDg1MTk1MX0.KhHGzeaHWJy31fiKtv2D2cOQYdxdyqQg_0lV1Udnj8U';

if (supabaseUrl.includes('YOUR_SUPABASE_URL_HERE') || supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY_HERE')) {
  // This console error is a reminder for the developer to configure the credentials.
  // The app will not crash, but will show an alert on the first data fetch attempt.
  console.error("Supabase credentials are not set. Please update supabaseClient.ts with your project's URL and Anon Key.");
}

// FIX: Extracted the database schema to a named type alias.
// This helps TypeScript correctly infer the types for Supabase client operations,
// resolving the 'never' type errors for insert and update calls.
export type Database = {
    public: {
        Tables: {
            entries: {
                Row: DiaryEntry;
                // FIX: Defined Insert and Update types explicitly to resolve 'never' type errors.
                // This makes the types easier for TypeScript to understand compared to nested utility types.
                Insert: {
                    date: string;
                    content: string | null;
                    ideas: string | null;
                    image_url: string | null;
                };
                Update: {
                    date?: string;
                    content?: string | null;
                    ideas?: string | null;
                    image_url?: string | null;
                };
            }
        }
    }
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
