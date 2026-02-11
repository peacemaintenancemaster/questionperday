import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/shared/constants/query/query-key';
import { QuestionAPI } from '../api';

export const useTodayQuestionInfo = () => {
	return useQuery({
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
};
