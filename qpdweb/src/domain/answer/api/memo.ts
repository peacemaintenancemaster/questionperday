import { supabase } from '~/lib/supabase';

export const getMemos = async (answerId: string) => {
    const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('answer_id', answerId)
        .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
};

export const addMemoToSupabase = async (answerId: string, content: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('로그인이 필요합니다.');
    const { data, error } = await supabase
        .from('memos')
        .insert({ answer_id: answerId, content, user_id: session.user.id })
        .select().single();
    if (error) throw error;
    return data;
};

// 메모 수정 API
export const updateMemoInSupabase = async (memoId: string, content: string) => {
    const { data, error } = await supabase
        .from('memos')
        .update({ content })
        .eq('id', memoId)
        .select().single();
    if (error) throw error;
    return data;
};

// 메모 삭제 API
export const deleteMemoInSupabase = async (memoId: string) => {
    const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', memoId);
    if (error) throw error;
};