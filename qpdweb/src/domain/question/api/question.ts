import { supabase } from '~/lib/supabase';
import { QuestionSchema } from '../schema';

const getKSTDateString = () => {
    const now = new Date();
    const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toISOString().split('T')[0];
};

export const getTodayInfo = async () => {
    const todayStr = getKSTDateString();

    // ▼▼▼ [중요 변경] created_at을 뺐고, order()도 뺐습니다! ▼▼▼
    const { data: question, error } = await supabase
        .from('question') 
        .select('id, "dateAt", "timeAt"') // created_at 없음!
        .eq('"dateAt"', todayStr) 
        // .order() 삭제함 (created_at이 없어서 정렬하면 에러남)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('질문 조회 에러:', error);
        return { questionId: 0, timeAt: new Date().toISOString(), isAnswered: false };
    }

    if (!question) {
        return { questionId: 0, timeAt: new Date().toISOString(), isAnswered: false };
    }

    // ▼▼▼ [중요 변경] 마감 시간도 created_at 대신 dateAt(질문날짜) 기준으로 계산 ▼▼▼
    const baseTime = new Date(question.dateAt).getTime();
    const deadline = new Date(baseTime + 24 * 60 * 60 * 1000).toISOString();

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
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error || !data) throw new Error('질문을 찾을 수 없습니다.');

    // 여기도 dateAt 기준
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
            needPhone: !!data.needPhone, 
            needNickname: !!data.needNickname,
            logoImageId: data.logoImageId || null,
        } as QuestionSchema,
    };
};