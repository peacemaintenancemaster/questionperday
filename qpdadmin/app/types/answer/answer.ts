export type QuestionType = 'temp' | 'previous' | 'saved';

export const statusTextMap: Record<QuestionType, string> = {
	previous: '지난 질문',
	temp: '저장됨',
	saved: '예약됨',
} as const;
