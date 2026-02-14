// [수정] 사용자님이 알려주신 경로(app/api/supabase.ts)로 연결
import { supabase } from '~/api/supabase';
import type { QuestionBaseSchema } from '~/features/question/schema/question.add';

const TABLE_NAME = 'question';

// [안전장치] 날짜가 '26-02-14'처럼 오면 '2026-02-14'로 변환하는 함수
const normalizeDate = (dateStr: string) => {
  if (!dateStr) return dateStr;
  // 길이가 8자리(YY-MM-DD)이고 숫자로 시작하면 앞에 '20'을 붙임
  if (dateStr.length === 8 && /^\d{2}-/.test(dateStr)) {
    return `20${dateStr}`;
  }
  return dateStr;
};

export const getQuestionList = async (dateAt: string) => {
  // 조회할 때도 20xx 포맷으로 변환해서 조회
  const safeDate = normalizeDate(dateAt);
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .gte('dateAt', `${safeDate} 00:00:00`)
    .lte('dateAt', `${safeDate} 23:59:59`);

  if (error) {
    throw error;
  }
  return data;
};

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
    // 저장하기 전에 날짜 포맷 강제 변환 (26 -> 2026)
    const safeDate = normalizeDate(data.dateAt);

    const { data: insertedData, error } = await supabase
        .from(TABLE_NAME)
        .insert([{ 
            dateAt: safeDate,
            title: data.title || "",
            subText: data.subText || "",
            // DB 컬럼이 integer(1/0)이므로 true/false를 숫자로 변환
            needNickname: (data.needNickname ?? true) ? 1 : 0,
            needPhone: (data.needPhone ?? false) ? 1 : 0,
            logoImageId: data.logoImageId || null,
            article: data.article || null,
            timeAt: data.timeAt || null,
            // isDel 컬럼 기본값 처리
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
    // 수정할 때도 날짜 포맷 안전하게 변환
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