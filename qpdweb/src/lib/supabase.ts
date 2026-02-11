import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("[v0] Supabase URL:", supabaseUrl);
console.log("[v0] Supabase Key Check:", supabaseKey ? "Key exists" : "Key is NULL");

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    console.warn("[v0] Supabase env vars missing - running without auth");
}

export { supabase };
