import { type ClientLoaderFunctionArgs } from "react-router"; 
import { supabase } from "../api/supabase"; 

// [수정] SPA 모드에서는 loader 대신 clientLoader를 사용해야 합니다.
export async function clientLoader({ params, request }: ClientLoaderFunctionArgs) {
    const { id } = params;
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") || "10";

    const { data, count, error } = await supabase
        .from("answers")
        .select("*", { count: "exact" })
        .eq("question_id", id)
        .limit(parseInt(limit));

    if (error) {
        // [주의] SPA 모드에서는 에러 발생 시 객체를 반환하거나 throw 에러를 사용합니다.
        return { error: error.message, status: 500 };
    }

    return {
        data,
        metadata: { totalCount: count || 0 }
    };
}

// clientLoader를 사용할 때 데이터를 캐싱하지 않으려면 아래 설정을 추가할 수 있습니다.
clientLoader.hydrate = true;