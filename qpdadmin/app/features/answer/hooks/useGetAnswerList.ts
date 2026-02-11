import { useQuery } from '@tanstack/react-query';
import { API } from '~/api';
import { QUERY_KEYS } from '~/constant/query-key';
import { useQueryParser } from '~/hooks/useQueryParser';

export const useGetAnswerList = (questionId: number) => {
	const [queryParams] = useQueryParser<{
		page: number;
		limit: number;
	}>();
	const { page = 1, limit = 999 } = queryParams;

	return useQuery({
		queryKey: [QUERY_KEYS.answer.list, questionId],
		queryFn: () => API.Answer.getList(questionId, { page, limit }),
		enabled: !!questionId,
	});
};
