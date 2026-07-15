import { createClient } from "@supabase/supabase-js";

// Supabase URL and Anon Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
