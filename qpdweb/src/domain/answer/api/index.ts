import { supabase } from '~/lib/supabase';

// 1. [수정] phone 필드 추가 (TypeScript 에러 해결)
export interface AnswerBody {
    text: string;
    nickname: string;
    phone: string;    // 추가
    isShared: boolean;
}

export interface Question {
    id: number;
    title: string;
    subText: string;
    article: string;
    dateAt: string;
    timeAt: string;
    needPhone: boolean;
    needNickname: boolean;
    logoImageId: number | null;
    answerList: AnswerListItem[];
}

export interface AnswerListItem {
    id: number;
    questionId: number;
    userId: number;
    text: string;
    nickname: string | null;
    createdAt: string; // [수정] DB 컬럼명 확인됨
    updatedAt: string; // [수정] DB 컬럼명 확인됨
}

const add = async (questionId: number, answer: AnswerBody) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('로그인이 필요합니다.');

    // 2. [수정] 테이블명 'answer' (단수), 컬럼명 "CamelCase" (따옴표 필수)
    const { data, error } = await supabase
        .from('answer') // 'answers' -> 'answer'
        .insert({
            '"questionId"': questionId, // question_id -> "questionId"
            '"userId"': session.user.id, // user_id -> "userId"
            text: answer.text,           // content -> text
            nickname: answer.nickname.trim() || null,
            phone: answer.phone.trim() || null, // phone 추가
            '"isShared"': answer.isShared ? 1 : 0, // boolean을 숫자로 변환 (DB가 int일 경우)
            '"isDel"': 0
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

const getAnswerCounts = async (): Promise<{
    answerCounts: number;
}> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { answerCounts: 0 };

    // 3. [수정] 테이블명 및 컬럼명 수정
    const { count, error } = await supabase
        .from('answer')
        .select('*', { count: 'exact', head: true })
        .eq('"userId"', session.user.id) // user_id -> "userId"
        .eq('"isDel"', 0);

    if (error) {
        console.error('답변 수 조회 에러:', error);
        return { answerCounts: 0 };
    }

    return { answerCounts: count || 0 };
};

// --- 나머지 함수들은 필요 시 Supabase 로직으로 구현 가능합니다 ---

const getAnswerByMonth = async (
    dateAt: string,
): Promise<{
    answerDateCountMap: Record<string, number>;
}> => {
    return { answerDateCountMap: {} };
};

const getAnswerByDate = async (
    dateAt: string,
): Promise<{
    question: Question;
}> => {
    throw new Error('아직 구현되지 않은 기능입니다.');
};

export const AnswerAPI = {
    add,
    getAnswerByMonth,
    getAnswerCounts,
    getAnswerByDate,
};