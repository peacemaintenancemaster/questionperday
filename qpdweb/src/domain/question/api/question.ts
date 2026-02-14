import { supabase } from '~/lib/supabase';
import { QuestionSchema } from '../schema';

const getKSTDateString = () => {
    const now = new Date();
    const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toISOString().split('T')[0];
};

export const getTodayInfo = async () => {
    const todayStr = getKSTDateString();

    // [핵심 수정] 대소문자 섞인 컬럼("dateAt")은 반드시 쌍따옴표로 감싸야 인식됨
    const { data: question, error } = await supabase
        .from('question') 
        .select('id, created_at, "dateAt"') // "dateAt"으로 수정
        .lte('"dateAt"', todayStr)          // "dateAt"으로 수정
        .order('"dateAt"', { ascending: false }) // "dateAt"으로 수정
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('질문 조회 에러:', error);
        return { questionId: 0, timeAt: new Date().toISOString(), isAnswered: false };
    }

    if (!question) {
        return { questionId: 0, timeAt: new Date().toISOString(), isAnswered: false };
    }

    const deadline = new Date(new Date(question.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString();

    const { data: { session } } = await supabase.auth.getSession();
    let isAnswered = false;
    
    if (session?.user) {
        // answer 테이블은 snake_case 컬럼이라고 가정 (question_id)
        const { count, error: answerError } = await supabase
            .from('answer') 
            .select('*', { count: 'exact', head: true })
            .eq('question_id', question.id) 
            .eq('user_id', session.user.id);
        
        if (answerError) console.error(answerError);
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

    const deadline = new Date(new Date(data.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString();

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