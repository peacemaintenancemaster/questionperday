import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/shared/constants/query/query-key';
import { BannerAPI } from '../api';

export const useGetBannerList = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.banner],
		queryFn: () => BannerAPI.getList(),
	});
};
