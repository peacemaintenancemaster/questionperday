import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/shared/constants/query/query-key';
import { QuestionAPI } from '../api';

export const useTodayQuestion = (id: number | undefined) => {
	return useQuery({
		queryKey: [QUERY_KEYS.question.today],
		queryFn: async () => {
			try {
				return await QuestionAPI.getToday(id as number);
			} catch (error) {
				if (error.name === 'HTTPError') {
					throw await error.response.json();
				}
			}
		},
		enabled: !!id,
		retry: false,
	});
};
