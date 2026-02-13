import { supabase } from '~/lib/supabase';

export type QuestionBaseSchema = {
	title: string;
	dateAt: string;
	subText: string;
	needNickname: boolean;
	needPhone: boolean;
	logoImageId?: number | null;
	article?: string | null;
	timeAt?: string;
};

export type QuestionAddSchema = QuestionBaseSchema;

export type QuestionSchemaWithType = QuestionBaseSchema & {
	id: number;
	type: 'saved' | 'temp';
};

export const initBaseQuestion: QuestionBaseSchema = {
	title: '',
	dateAt: new Date().toISOString(),
	subText: '',
	needNickname: true, // 기본값 true로 설정
	needPhone: false,
	logoImageId: null,
	article: null,
	timeAt: '',
};

export const addQuestion = async (params: QuestionAddSchema) => {
	// 테이블명을 'questions'로 수정하고 필드명도 맞춤
	const { data, error } = await supabase
		.from('question')
		.insert({
			content: params.title,
			display_date: params.dateAt,
			title: params.title || '',
			subText: params.subText || '',
			needNickname: params.needNickname ?? true,
			needPhone: params.needPhone ?? false,
			logoImageId: params.logoImageId || null,
			article: params.article || null,
			timeAt: params.timeAt || null,
		});

	if (error) {
		console.error('Supabase 저장 에러:', error);
		throw error;
	}
	return data;
};
