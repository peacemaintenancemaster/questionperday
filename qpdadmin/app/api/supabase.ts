import { createClient } from '@supabase/supabase-js';

// env 뒤에 빨간 줄이 생기면 위 2번 항목을 먼저 수행하세요.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);