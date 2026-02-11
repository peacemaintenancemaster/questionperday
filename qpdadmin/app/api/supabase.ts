import { createClient } from '@supabase/supabase-js';

// 환경 변수를 읽어오되, 없으면 일단 빈 문자열이라도 넘겨서 빌드 에러를 막습니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);