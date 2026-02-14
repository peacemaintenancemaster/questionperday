import { supabase } from '~/lib/supabase';
import { QuestionSchema } from '../schema';

// [유틸] 한국 시간(KST) YYYY-MM-DD
const getKSTDateString = () => {
    const now = new Date();
    const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toISOString().split('T')[0];
};

export const getTodayInfo = async () => {
    const todayStr = getKSTDateString();

    // 1. [수정] created_at 제거 (DB에 없음)
    // 2. [수정] "dateAt", "timeAt" 가져오기 (따옴표 필수)
    const { data: question, error } = await supabase
        .from('question')
        .select('id, "dateAt", "timeAt"') 
        .eq('"dateAt"', todayStr) 
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('질문 조회 에러:', error);
        return { questionId: 0, timeAt: new Date().toISOString(), isAnswered: false };
    }

    if (!question) {
        return { questionId: 0, timeAt: new Date().toISOString(), isAnswered: false };
    }

    // 3. [수정] 마감 시간 계산 (created_at이 없으므로 dateAt 기준)
    // 질문 날짜(2026-02-14)의 다음 날을 마감으로 설정
    // 만약 timeAt(시간)이 있다면 그 시간 기준 24시간 뒤로 설정할 수도 있음
    const baseDate = new Date(question.dateAt);
    const deadline = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000).toISOString();

    const { data: { session } } = await supabase.auth.getSession();
    let isAnswered = false;
    
    if (session?.user) {
        const { count } = await supabase
            .from('answer') 
            .select('*', { count: 'exact', head: true })
            .eq('question_id', question.id) 
            .eq('user_id', session.user.id);
        
        isAnswered = !!count && count > 0;
    }

    return { questionId: question.id, timeAt: deadline, isAnswered };
};

export const getToday = async (id: number): Promise<{ question: QuestionSchema }> => {
    // 상세 조회
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error || !data) throw new Error('질문을 찾을 수 없습니다.');

    // [수정] 여기도 created_at 대신 dateAt 사용
    const deadline = new Date(new Date(data.dateAt).getTime() + 24 * 60 * 60 * 1000).toISOString();

    return {
        question: {
            ...data,
            id: data.id,
            title: data.title,
            timeAt: deadline,
            dateAt: data.dateAt, 
            subText: data.subText || '',
            article: data.article || null,
            needPhone: !!data.needPhone, 
            needNickname: !!data.needNickname,
            logoImageId: data.logoImageId || null,
        } as QuestionSchema,
    };
};