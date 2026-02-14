
import { supabase } from '..';

import { IQuestion, TQuestionList } from '@/types/question';

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
  return data as TQuestionList;
};

export const getQuestion = async (id: number) => {
  const { data, error } = await supabase.from(TABLE_NAME).select('*').eq('id', id).single();

  if (error) {
    throw error;
  }
  return data as IQuestion;
};

export const createQuestion = async (question: Omit<IQuestion, 'id'>) => {
  const { data, error } = await supabase.from(TABLE_NAME).insert(question).select('*').single();

  if (error) {
    throw error;
  }
  return data as IQuestion;
};

export const updateQuestion = async (question: IQuestion) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(question)
    .eq('id', question.id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }
  return data as IQuestion;
};

export const deleteQuestion = async (id: number) => {
  const { data, error } = await supabase.from(TABLE_NAME).delete().eq('id', id).select('*').single();

  if (error) {
    throw error;
  }
  return data as IQuestion;
};
