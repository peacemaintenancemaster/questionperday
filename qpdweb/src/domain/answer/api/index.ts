import { supabase } from '~/lib/supabase'; // Supabase 클라이언트 임포트
// import { instance } from '~/shared/api/instance'; // 기존 가짜 API는 주석 처리하거나 삭제

export interface AnswerBody {
    text: string;
    nickname: string;
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
    dateAt: string;
    createdAt: string;
    updatedAt: string;
}

const add = async (questionId: number, answer: AnswerBody) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('로그인이 필요합니다.');

    const { data, error } = await supabase
        .from('answers')
        .insert({
            question_id: questionId,
            content: answer.text,
            user_id: session.user.id,
            // 닉네임이 빈 문자열("")이면 null로 변환해서 저장
            nickname: answer.nickname ? answer.nickname : null, 
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

// --- 아래 조회 함수들도 서버가 없다면 작동하지 않습니다. 추후 Supabase 로직으로 교체가 필요할 수 있습니다. ---

const getAnswerByMonth = async (
    dateAt: string,
): Promise<{
    answerDateCountMap: Record<string, number>;
}> => {
    // 임시: 서버가 없으므로 빈 값 반환 (에러 방지용)
    // 실제 구현 시 supabase.from('answers').select... 로직 필요
    return { answerDateCountMap: {} };
};

const getAnswerCounts = async (): Promise<{
    answerCounts: number;
}> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { answerCounts: 0 };

    const { count, error } = await supabase
        .from('answers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

    if (error) {
        console.error('답변 수 조회 에러:', error);
        return { answerCounts: 0 };
    }

    return { answerCounts: count || 0 };
};

const getAnswerByDate = async (
    dateAt: string,
): Promise<{
    question: Question;
}> => {
    // 임시: 날짜별 질문/답변 조회 로직 필요
    // 이 부분은 기존 로직이 복잡하여 일단 에러만 안 나게 처리하거나, 
    // 질문 조회 기능이 따로 있다면 그쪽을 활용해야 합니다.
    throw new Error('아직 구현되지 않은 기능입니다.');
};

export const AnswerAPI = {
    add,
    getAnswerByMonth,
    getAnswerCounts,
    getAnswerByDate,
};