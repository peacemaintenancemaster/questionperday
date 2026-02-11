import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// [디버깅용] 브라우저 콘솔(F12)에 키가 출력되는지 확인하세요.
// (배포할 때는 지우는 게 좋습니다)
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key Check:", supabaseKey ? "Key 있음" : "Key 없음(NULL)");

if (!supabaseUrl || !supabaseKey) {
    console.error("🚨 .env 파일 로딩 실패! 서버를 껐다 켜거나 파일 위치를 확인하세요.");
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');