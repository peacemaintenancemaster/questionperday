import { supabase } from '~/api/supabase';
import type { QuestionBaseSchema } from '~/features/question/schema/question.add';

const TABLE_NAME = 'question';

// 날짜 포맷 안전장치
const normalizeDate = (dateStr: string) => {
  if (!dateStr) return dateStr;
  if (dateStr.length === 8 && /^\d{2}-/.test(dateStr)) {
    return `20${dateStr}`;
  }
  return dateStr;
};

export const getQuestionList = async (dateAt: string) => {
  const safeDate = normalizeDate(dateAt);
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    // [수정] gte, lte를 지우고 eq(일치)로 변경
    // DB에 '2026-02-14'라고 저장되어 있으므로, 정확히 그 문자열과 같은지 비교해야 합니다.
    .eq('dateAt', safeDate);

  if (error) {
    throw error;
  }
  return data;
};

// ... 아래는 기존 코드와 동일 ...

export const getQuestion = async (id: number) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const add = async (data: QuestionBaseSchema) => {
    const safeDate = normalizeDate(data.dateAt);

    const { data: insertedData, error } = await supabase
        .from(TABLE_NAME)
        .insert([{ 
            dateAt: safeDate,
            title: data.title || "",
            subText: data.subText || "",
            needNickname: (data.needNickname ?? true) ? 1 : 0,
            needPhone: (data.needPhone ?? false) ? 1 : 0,
            logoImageId: data.logoImageId || null,
            article: data.article || null,
            timeAt: data.timeAt || null,
            isDel: 0 
        }])
        .select()
        .single();

  if (error) {
    console.error('질문 추가 에러:', error);
    throw error;
  }
  return insertedData;
};

export const edit = async (id: number, data: QuestionBaseSchema) => {
    const safeDate = normalizeDate(data.dateAt);

    const { data: updatedData, error } = await supabase
        .from(TABLE_NAME)
        .update({ 
            dateAt: safeDate,
            title: data.title || "",
            subText: data.subText || "",
            needNickname: (data.needNickname ?? true) ? 1 : 0,
            needPhone: (data.needPhone ?? false) ? 1 : 0,
            logoImageId: data.logoImageId || null,
            article: data.article || null,
            timeAt: data.timeAt || null,
        })
        .eq('id', id)
        .select()
        .single();
        
    if (error) {
        console.error('질문 수정 에러:', error);
        throw error;
    }
    return updatedData;
};

export const deleteQuestion = async (id: number) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }
  return data;
};