import { supabase } from '~/lib/supabase';
import { QuestionSchema } from '../schema';

// [유틸] 한국 시간 기준 YYYY-MM-DD 문자열 구하기
const getKSTDateString = () => {
    const now = new Date();
    // UTC+9 (한국 시간) 보정
    const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toISOString().split('T')[0];
};

export const getTodayInfo = async () => {
    const todayStr = getKSTDateString();

    // 1. [수정] 'questions' -> 'question' 테이블 사용
    // 2. [수정] 오늘 날짜(dateAt)에 해당하는 질문을 찾음 (없으면 가장 최근 과거 질문)
    const { data: question, error } = await supabase
        .from('question') 
        .select('id, created_at, dateAt')
        .lte('dateAt', todayStr) // 오늘 포함 과거 날짜 중
        .order('dateAt', { ascending: false }) // 가장 최근 날짜
        .limit(1)
        .single();

    if (error || !question) return { questionId: 0, timeAt: new Date().toISOString(), isAnswered: false };

    // 3. 마감 시간 계산 (여기서는 created_at 대신 오늘 자정 등 기획에 따라 다를 수 있으나, 일단 기존 로직 유지)
    const deadline = new Date(new Date(question.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString();

    const { data: { session } } = await supabase.auth.getSession();
    let isAnswered = false;
    
    if (session?.user) {
        const { count } = await supabase
            .from('answer') // [수정] 'answers' -> 'answer'
            .select('*', { count: 'exact', head: true })
            .eq('questionId', question.id) // [수정] 'question_id' -> 'questionId' (DB 컬럼명 확인 필요, 보통 camelCase로 맞추셨다면)
            .eq('userId', session.user.id); // [수정] 'user_id' -> 'userId'
        
        isAnswered = !!count && count > 0;
    }

    return { questionId: question.id, timeAt: deadline, isAnswered };
};

export const getToday = async (id: number): Promise<{ question: QuestionSchema }> => {
    // [수정] 'questions' -> 'question'
    const { data, error } = await supabase.from('question').select('*').eq('id', id).single();
    
    if (error || !data) throw new Error('질문을 찾을 수 없습니다.');

    const deadline = new Date(new Date(data.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString();

    return {
        question: {
            ...data,
            id: data.id,
            // [수정] DB 컬럼명(title)과 프론트 스키마(title) 매핑
            title: data.title,       // 예전 코드: data.content
            timeAt: deadline,
            dateAt: data.dateAt,     // 예전 코드: data.display_date
            subText: data.subText || '',
            article: data.article || null,
            // [수정] DB는 integer(1/0)일 수 있으므로 boolean으로 변환 (만약 DB가 int라면)
            needPhone: !!data.needPhone, 
            needNickname: !!data.needNickname,
            logoImageId: data.logoImageId || null,
        } as QuestionSchema,
    };
};