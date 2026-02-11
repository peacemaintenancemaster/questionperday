import { type LoaderFunctionArgs } from "react-router"; 
// 1. 경로 수정: app/api/supabase.ts 위치에 맞게 경로를 ../api/supabase로 변경합니다.
import { supabase } from "../api/supabase"; 

export async function loader({ params, request }: LoaderFunctionArgs) {
    const { id } = params;
    
    if (!id) {
        return { error: "질문 ID가 필요합니다.", status: 400 };
    }

    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") || "10";

    // Supabase에서 해당 질문에 대한 답변 목록과 총 개수를 가져옵니다.
    const { data, count, error } = await supabase
        .from("answers")
        .select("*", { count: "exact" })
        .eq("question_id", id)
        .limit(parseInt(limit));

    if (error) {
        // 2. json() 함수 대신 일반 객체를 반환하거나 Response 객체를 직접 생성합니다.
        return { error: error.message, status: 500 };
    }

    // PreviewItem 컴포넌트가 기대하는 데이터 규격으로 반환합니다.
    return {
        data,
        metadata: { totalCount: count || 0 }
    };
}