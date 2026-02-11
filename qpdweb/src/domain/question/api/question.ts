import { supabase } from '~/lib/supabase';
import { QuestionSchema } from '../schema';

export const getTodayInfo = async () => {
    // 1. 가장 최근 질문 1개를 가져옴 (새 질문 등록 시 타이머 리셋 반영)
    const { data: question, error } = await supabase
        .from('questions')
        .select('id, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !question) return { questionId: 0, timeAt: new Date().toISOString(), isAnswered: false };

    // 2. 등록 시간(created_at) 기준 24시간 뒤를 마감 시간으로 계산
    const deadline = new Date(new Date(question.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString();

    const { data: { session } } = await supabase.auth.getSession();
    let isAnswered = false;
    if (session?.user) {
        const { count } = await supabase
            .from('answers')
            .select('*', { count: 'exact', head: true })
            .eq('question_id', question.id)
            .eq('user_id', session.user.id);
        isAnswered = !!count && count > 0;
    }

    return { questionId: question.id, timeAt: deadline, isAnswered };
};

export const getToday = async (id: number): Promise<{ question: QuestionSchema }> => {
    const { data, error } = await supabase.from('questions').select('*').eq('id', id).single();
    if (error || !data) throw new Error('질문을 찾을 수 없습니다.');

    // 3. ★핵심 수정★: 상세 데이터에서도 등록 시간 기준 24시간 뒤를 계산해서 보냅니다.
    const deadline = new Date(new Date(data.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString();

    return {
        question: {
            ...data,
            id: data.id,
            title: data.content, // DB의 content를 제목으로 사용
            timeAt: deadline,    // display_date 대신 계산된 deadline 전달
            dateAt: data.display_date,
            subText: data.subText || '',
            article: data.article || null,
            needPhone: data.needPhone || false,
            needNickname: data.needNickname || false,
            logoImageId: data.logoImageId || null,
        } as QuestionSchema,
    };
};