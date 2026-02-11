import { useQuery } from '@tanstack/react-query';
import { API } from '~/api';
import { QUERY_KEYS } from '~/constant/query-key';

export const useGetBanner = ({ page }: { page: number }) => {
	return useQuery({
		queryKey: [QUERY_KEYS.banner.list],
		queryFn: () => API.Banner.getList({ page, limit: 99 }),
	});
};
