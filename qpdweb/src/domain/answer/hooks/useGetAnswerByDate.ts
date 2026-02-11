import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '~/domain/user/store';
import { QUERY_KEYS } from '~/shared/constants/query/query-key';
import { AnswerAPI } from '../api';

export const useGetAnswerByDate = (date: string = '') => {
	const isLogin = useUserStore(s => s.isLogin);
	return useQuery({
		queryKey: [QUERY_KEYS.answer.date, date],
		queryFn: () => AnswerAPI.getAnswerByDate(date),
		enabled: !!isLogin && !!date,
	});
};
