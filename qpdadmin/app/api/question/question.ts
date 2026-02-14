import { supabase } from '../supabase';
import type { QuestionBaseSchema } from '~/features/question/schema/question.add';
import type { QuestionBaseSchemaWithId } from '~/features/question/context/question';

// [추가] 날짜 형식을 '26-02-11'에서 '2026-02-11'로 교정하는 헬퍼 함수
const formatToFullDate = (dateStr: string) => {
    if (!dateStr) return dateStr;
    // '26-'로 시작하는 8자리 문자열이면 앞에 '20'을 붙여줍니다.
    if (dateStr.length === 8 && dateStr.startsWith('26-')) {
        return `20${dateStr}`;
    }
    return dateStr;
};

export const getQuestionMap = async (dateAt: string) => {
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .like('dateAt', `${dateAt}%`);

    if (error) throw error;
    const questionDateMap: Record<string, QuestionBaseSchemaWithId> = {};
    
    data?.forEach((item) => {
        if (item.display_date) {
            questionDateMap[item.display_date] = {
                id: item.id,
                title: item.content, 
                dateAt: item.display_date, 
                subText: '',
                article: '',
            } as QuestionBaseSchemaWithId;
        }
    });
    return { questionDateMap };
};

export const Del = async (id: number) => {
    const { error } = await supabase.from('question').delete().eq('id', id);
    if (error) throw error;
};

export const add = async (data: QuestionBaseSchema) => {
    // 날짜 형식을 무조건 2026-MM-DD로 강제 변환합니다.
    let finalDate = data.dateAt || "";
    
    if (typeof finalDate === 'string' && finalDate.includes('-')) {
        const parts = finalDate.split('-');
        // 연도가 26처럼 두 자리라면 앞에 20을 붙여 2026으로 만듭니다.
        if (parts[0].length === 2) {
            parts[0] = `20${parts[0]}`;
        }
        finalDate = parts.join('-');
    }

    // 서버로 보내기 직전의 값을 브라우저 콘솔(F12)에 출력합니다.
    console.log("최종 저장 시도 날짜:", finalDate);

    const { data: insertedData, error } = await supabase
        .from('question')
        .insert([{ 
            content: data.title, 
            display_date: finalDate,
            title: data.title || "",
            subText: data.subText || "",
            needNickname: data.needNickname ?? true,
            needPhone: data.needPhone ?? false,
            logoImageId: data.logoImageId || null,
            article: data.article || null,
            timeAt: data.timeAt || null,
        }])
        .select()
        .single();

    if (error) {
        console.error("Supabase 상세 에러:", error.message);
        throw error;
    }
    return insertedData;
};

export const edit = async (id: number, data: QuestionBaseSchema) => {
    const { data: updatedData, error } = await supabase
        .from('question')
        .update({ 
            content: data.title, 
            // [교정] 수정할 때도 날짜 형식을 바꿉니다.
            display_date: formatToFullDate(data.dateAt),
            subText: data.subText || "",
            needNickname: data.needNickname ?? true,
            needPhone: data.needPhone ?? false,
            logoImageId: data.logoImageId || null,
            article: data.article || null,
            timeAt: data.timeAt || null,
        })
        .eq('id', id)
        .select().single();
    if (error) throw error;
    return updatedData;
};

export const getList = async (dateAt: string) => {
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .like('dateAt', `${dateAt}%`);
    if (error) throw error;
    return {
        questionList: (data || []).map((item) => ({
            id: item.id,
            title: item.content,
            dateAt: item.display_date,
            subText: '',
            article: '',
        })) as QuestionBaseSchemaWithId[],
    };
};