import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eqihnwcwvxjpspzezzhc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxaWhud2N3dnhqcHNwemV6emhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjI2NzEsImV4cCI6MjA5ODgzODY3MX0.LIwnL-5LrI2W2jLdvLeW6LRYQ1RjxXnZQtL50yjjguE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
