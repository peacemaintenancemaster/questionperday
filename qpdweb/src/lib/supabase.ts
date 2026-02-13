import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("🚨 Supabase 환경변수가 없습니다. .env 파일을 확인하세요.");
}

// [핵심] <any>를 넣으면 "테이블이 있냐 없냐" 따지지 않고 무조건 실행합니다.
// 빨간 줄(Type Error)을 없애는 가장 확실한 방법입니다.
export const supabase = createClient<any>(supabaseUrl || '', supabaseKey || '');