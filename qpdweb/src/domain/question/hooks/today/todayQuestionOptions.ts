import { queryOptions } from '@tanstack/react-query';
import { QuestionAPI } from '../../api';
import { QUERY_KEYS } from '~/shared/constants/query/query-key';

export const todayQuestionInfoOptions = queryOptions({
	queryKey: QUERY_KEYS.question.todayInfo,
	queryFn: async () => {
		try {
			return await QuestionAPI.getTodayInfo();
		} catch (error) {
			if (error.name === 'HTTPError') {
				throw await error.response.json();
			}
		}
	},

	retry: false,
});

export const getTodayQuestionOptions = (questionId: number) =>
	queryOptions({
		queryKey: [QUERY_KEYS.question.today, questionId],
		queryFn: async () => {
			try {
				return QuestionAPI.getToday(questionId);
			} catch (error) {
				if (error.name === 'HTTPError') {
					throw await error.response.json();
				}
			}
		},
		enabled: !!questionId,
		retry: false,
	});
