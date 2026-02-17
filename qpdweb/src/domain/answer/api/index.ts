import { supabase } from '~/lib/supabase';

export interface Question {
    id: number;
    title: string;
    subtitle?: string;
    content?: string;
    dateAt: string;
    display_date?: string;
    views: number;
    needNickname: boolean;
    needPhone: boolean;
    answerList?: AnswerListItem[];
}

export interface AnswerListItem {
    id: number;
    text: string;
    nickname: string;
    dateAt: string;
    permission: boolean;
}

export interface AnswerBody {
    text: string;
    nickname: string;
    phone: string; 
    isShared: boolean;
}

export const AnswerAPI = {
    add: async (questionId: number, answer: AnswerBody) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('로그인이 필요합니다.');

        const { data, error } = await supabase
            .from('answer')
            .insert({
                // [수정] 따옴표 제거: Supabase가 대소문자를 자동 매칭하도록 변경
                questionId: questionId,
                userId: session.user.id,
                text: answer.text,
                nickname: answer.nickname?.trim() || null,
                phone: answer.phone?.trim() || null,
                isShared: answer.isShared ? 1 : 0,
                isDel: 0
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    getAnswerCounts: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return { answerCounts: 0 };

        const { count, error } = await supabase
            .from('answer')
            .select('*', { count: 'exact', head: true })
            // [수정] 따옴표 제거
            .eq('userId', session.user.id)
            .eq('isDel', 0);

        if (error) return { answerCounts: 0 };
        return { answerCounts: count || 0 };
    },

    getAnswerByMonth: async (year: number, month: number) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const { data, error } = await supabase
            .from('answer')
            .select(`
                id,
                text,
                nickname,
                created_at,
                question:questionId (
                    id,
                    title,
                    dateAt
                )
            `)
            // [수정] 따옴표 제거
            .eq('userId', session.user.id)
            .eq('isDel', 0)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());

        if (error) throw error;
        return data || [];
    }
};