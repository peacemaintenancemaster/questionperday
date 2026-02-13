import { supabase } from '~/lib/supabase'; // 프로젝트의 supabase client 경로
import { QuestionAddSchema } from '../schema/question.add';

export const addQuestion = async (params: QuestionAddSchema) => {
  // [수정] 'questions'를 'question'으로 변경
  const { data, error } = await supabase
    .from('question') 
    .insert({
      title: params.title,
      subText: params.subText,
      dateAt: params.dateAt,
      needNickname: params.needNickname,
      needPhone: params.needPhone,
      logoImageId: params.logoImageId,
      article: params.article,
      timeAt: params.timeAt,
    });

  if (error) {
    console.error('Supabase 저장 에러:', error);
    throw error;
  }
  return data;
};