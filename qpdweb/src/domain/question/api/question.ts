import { supabase } from '~/lib/supabase';
import { QuestionSchema } from '../schema';

// [유틸] 한국 시간(KST) 기준 YYYY-MM-DD 구하기
const getKSTDateString = () => {
    const now = new Date();
    const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toISOString().split('T')[0];
};

export const getTodayInfo = async () => {
    const todayStr = getKSTDateString();

    // 1. [핵심 수정] 테이블명 'question'(단수) + 컬럼명 'dateAt' 사용
    const { data: question, error } = await supabase
        .from('question') 
        .select('*') // 모든 컬럼 가져오기 (created_at 등 포함)
        .eq('dateAt', todayStr) // "오늘 날짜"인 질문 찾기
        .limit(1)
        .maybeSingle();

    // 에러나 데이터가 없으면 빈 값 반환 (콘솔 에러 방지)
    if (error || !question) {
        if (error) console.error('질문 조회 실패:', error);
        return { questionId: 0, timeAt: new Date().toISOString(), isAnswered: false };
    }

    // 마감 시간 계산 (등록시간 + 24시간)
    const deadline = new Date(new Date(question.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString();

    const { data: { session } } = await supabase.auth.getSession();
    let isAnswered = false;
    
    if (session?.user) {
        // 2. [답변 체크] answer 테이블은 건드리지 않았으므로 기존 컬럼명(snake_case) 유지 예상
        // 혹시 테이블명이 'answers'(복수)였다면 'answers'로 수정 필요. (보통 단수 'answer' 사용)
        const { count } = await supabase
            .from('answer') 
            .select('*', { count: 'exact', head: true })
            .eq('question_id', question.id) // 기존 컬럼명 유지
            .eq('user_id', session.user.id); // 기존 컬럼명 유지
        
        isAnswered = !!count && count > 0;
    }

    return { questionId: question.id, timeAt: deadline, isAnswered };
};

export const getToday = async (id: number): Promise<{ question: QuestionSchema }> => {
    // 3. [상세 조회] 여기도 'question' 테이블로 변경
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error || !data) throw new Error('질문을 찾을 수 없습니다.');

    const deadline = new Date(new Date(data.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString();

    return {
        question: {
            ...data,
            id: data.id,
            // 4. [매핑 수정] DB(title) -> 웹 스키마(title)
            title: data.title,       // (기존 content -> title)
            timeAt: deadline,
            dateAt: data.dateAt,     // (기존 display_date -> dateAt)
            subText: data.subText || '',
            article: data.article || null,
            // DB 값이 integer(1/0)일 수 있으므로 boolean 변환
            needPhone: !!data.needPhone, 
            needNickname: !!data.needNickname,
            logoImageId: data.logoImageId || null,
        } as QuestionSchema,
    };
};