import { supabase } from '../supabase';
import type { QuestionBaseSchema } from '~/features/question/schema/question.add';

const TABLE_NAME = 'question';

export const getQuestionList = async (dateAt: string) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .gte('dateAt', `${dateAt} 00:00:00`)
    .lte('dateAt', `${dateAt} 23:59:59`);

  if (error) {
    throw error;
  }
  return data;
};

export const getQuestion = async (id: number) => {
  const { data, error } = await supabase.from(TABLE_NAME).select('*').eq('id', id).single();

  if (error) {
    throw error;
  }
  return data;
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

export const deleteQuestion = async (id: number) => {
  const { data, error } = await supabase.from(TABLE_NAME).delete().eq('id', id).select('*').single();

  if (error) {
    throw error;
  }
  return data;
};
