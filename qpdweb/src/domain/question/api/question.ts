import { supabase } from '~/lib/supabase';
import { QuestionSchema } from '../schema';

// [유틸] 한국 시간(KST) 기준 오늘 날짜 문자열 (YYYY-MM-DD)
const getKSTDateString = () => {
    const now = new Date();
    const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toISOString().split('T')[0];
};

export const getTodayInfo = async () => {
    const todayStr = getKSTDateString();

    // 1. [Question 조회] 테이블명 'question', 컬럼명 '"dateAt"'
    // question 테이블에는 created_at이 없으므로 select에서 제외합니다.
    const { data: question, error } = await supabase
        .from('question') 
        .select('id, "dateAt", "timeAt"') 
        .eq('"dateAt"', todayStr) 
        .limit(1)
        .maybeSingle();

    if (error || !question) {
        if (error) console.error('질문 조회 실패:', error);
        return { questionId: 0, timeAt: new Date().toISOString(), isAnswered: false };
    }

    // 2. [마감 시간] dateAt 기준으로 24시간 뒤 계산
    const baseTime = new Date(question.dateAt).getTime();
    const deadline = new Date(baseTime + 24 * 60 * 60 * 1000).toISOString();

    const { data: { session } } = await supabase.auth.getSession();
    let isAnswered = false;
    
    if (session?.user) {
        // 3. [Answer 체크] 확인된 컬럼명 '"questionId"', '"userId"' 사용
        // 대소문자 구분을 위해 반드시 쌍따옴표로 감싸야 합니다.
        const { count, error: answerError } = await supabase
            .from('answer') 
            .select('*', { count: 'exact', head: true })
            .eq('"questionId"', question.id) // [수정] question_id -> "questionId"
            .eq('"userId"', session.user.id)  // [수정] user_id -> "userId"
            .eq('"isDel"', 0);               // 삭제되지 않은 답변만 체크

        if (answerError) console.error('답변 체크 실패:', answerError);
        isAnswered = !!count && count > 0;
    }

    return { questionId: question.id, timeAt: deadline, isAnswered };
};

export const getToday = async (id: number): Promise<{ question: QuestionSchema }> => {
    // 상세 조회 시에도 'question' 테이블 사용
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error || !data) throw new Error('질문을 찾을 수 없습니다.');

    const baseTime = new Date(data.dateAt).getTime();
    const deadline = new Date(baseTime + 24 * 60 * 60 * 1000).toISOString();

    return {
        question: {
            ...data,
            id: data.id,
            title: data.title,
            timeAt: deadline,
            dateAt: data.dateAt, 
            subText: data.subText || '',
            article: data.article || null,
            // 1/0 값을 boolean으로 안전하게 변환
            needPhone: !!data.needPhone, 
            needNickname: !!data.needNickname,
            logoImageId: data.logoImageId || null,
        } as QuestionSchema,
    };
};