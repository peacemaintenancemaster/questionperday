import { supabase } from '../supabase'; // ./supabase에서 ../supabase로 수정
import type { QuestionBaseSchema } from '~/features/question/schema/question.add';
import type { QuestionBaseSchemaWithId } from '~/features/question/context/question';

export const getQuestionMap = async (dateAt: string) => {
    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .like('display_date', `${dateAt}%`);

    if (error) throw error;
    const questionDateMap: Record<string, QuestionBaseSchemaWithId> = {};
    
    data?.forEach((item) => {
        if (item.display_date) {
            questionDateMap[item.display_date] = {
                id: item.id,
                title: item.content, // 에러 메시지에 따라 content -> title
                dateAt: item.display_date, // 에러 메시지에 따라 displayDate -> dateAt
                subText: '',
                article: '',
            } as QuestionBaseSchemaWithId;
        }
    });
    return { questionDateMap };
};

export const Del = async (id: number) => {
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) throw error;
};

export const add = async (data: QuestionBaseSchema) => {
    // 님의 스키마(data)에서 값을 뽑아 DB 컬럼에 맞게 삽입
    const { data: insertedData, error } = await supabase
        .from('questions')
        .insert([{ 
            content: data.title, 
            display_date: data.dateAt 
        }])
        .select().single();
    if (error) throw error;
    return insertedData;
};

export const edit = async (id: number, data: QuestionBaseSchema) => {
    const { data: updatedData, error } = await supabase
        .from('questions')
        .update({ 
            content: data.title, 
            display_date: data.dateAt 
        })
        .eq('id', id)
        .select().single();
    if (error) throw error;
    return updatedData;
};

export const getList = async (dateAt: string) => {
    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .like('display_date', `${dateAt}%`);
    if (error) throw error;
    return {
        questionList: (data || []).map((item) => ({
            id: item.id,
            title: item.content,
            dateAt: item.display_date,
            subText: '',
            article: '',
        })) as QuestionBaseSchemaWithId[],
    };
};