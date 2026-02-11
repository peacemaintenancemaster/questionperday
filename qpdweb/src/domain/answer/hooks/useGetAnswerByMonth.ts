import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/shared/constants/query/query-key';
import { AnswerAPI } from '../api';
import { useUserStore } from '~/domain/user/store';

export const useGetAnswerByMonth = (date: string) => {
	const isLogin = useUserStore(s => s.isLogin);
	return useQuery({
		queryKey: [QUERY_KEYS.answer.month, date],
		queryFn: () => AnswerAPI.getAnswerByMonth(date),
		enabled: isLogin,
	});
};
