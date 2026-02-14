import { supabase } from '../supabase';
import type { QuestionBaseSchema } from '~/features/question/schema/question.add';
import type { QuestionBaseSchemaWithId } from '~/features/question/context/question';

export const getQuestionMap = async (dateAt: string) => {
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .like('dateAt', `${dateAt}%`);

    if (error) throw error;
    const questionDateMap: Record<string, QuestionBaseSchemaWithId> = {};
    
    data?.forEach((item) => {
        if (item.dateAt) {
            questionDateMap[item.dateAt] = {
                id: item.id,
                title: item.title, 
                dateAt: item.dateAt, 
                subText: '',
                article: '',
            } as QuestionBaseSchemaWithId;
        }
    });
    return { questionDateMap };
};

export const Del = async (id: number) => {
    const { error } = await supabase.from('question').delete().eq('id', id);
    if (error) throw error;
};

export const add = async (data: QuestionBaseSchema) => {
    const { data: insertedData, error } = await supabase
        .from('question')
        .insert([{ 
            dateAt: data.dateAt,
            title: data.title || "",
            subText: data.subText || "",
            needNickname: (data.needNickname ?? true) ? 1 : 0,
            needPhone: (data.needPhone ?? false) ? 1 : 0,
            logoImageId: data.logoImageId || null,
            article: data.article || null,
            timeAt: data.timeAt || null,
        }])
        .select()
        .single();

    if (error) {
        throw error;
    }
    return insertedData;
};

export const edit = async (id: number, data: QuestionBaseSchema) => {
    const { data: updatedData, error } = await supabase
        .from('question')
        .update({ 
            dateAt: data.dateAt,
            subText: data.subText || "",
            needNickname: (data.needNickname ?? true) ? 1 : 0,
            needPhone: (data.needPhone ?? false) ? 1 : 0,
            logoImageId: data.logoImageId || null,
            article: data.article || null,
            timeAt: data.timeAt || null,
        })
        .eq('id', id)
        .select().single();
    if (error) throw error;
    return updatedData;
};

export const getList = async (dateAt: string) => {
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .like('dateAt', `${dateAt}%`);
    if (error) throw error;
    return {
        questionList: (data || []).map((item) => ({
            id: item.id,
            title: item.title,
            dateAt: item.dateAt,
            subText: '',
            article: '',
        })) as QuestionBaseSchemaWithId[],
    };
};