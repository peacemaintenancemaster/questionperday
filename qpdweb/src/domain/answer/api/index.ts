import { supabase } from '~/lib/supabase';

export interface Question {
    id: number;
    title: string;
    dateAt: string;
    views: number;
    needNickname: boolean;
    needPhone: boolean;
}

export interface AnswerListItem {
    id: number;
    text: string;
    nickname: string;
    dateAt: string;
    permission: boolean;
}

// [수정] phone 속성 추가
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
                '"questionId"': questionId,
                '"userId"': session.user.id,
                text: answer.text,
                nickname: answer.nickname.trim() || null,
                phone: answer.phone.trim() || null, // [수정] phone 값 DB 전송 추가
                '"isShared"': answer.isShared ? 1 : 0,
                '"isDel"': 0
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
            .eq('"userId"', session.user.id)
            .eq('"isDel"', 0);

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
            .eq('"userId"', session.user.id)
            .eq('"isDel"', 0)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());

        if (error) throw error;
        return data || [];
    }
};