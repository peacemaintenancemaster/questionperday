import { useMutation } from '@tanstack/react-query';
import { API } from '~/api';
import type { BannerBody } from '../../schema';

export const useAddBanner = () => {
	return useMutation({
		mutationFn: (banner: BannerBody) => API.Banner.add(banner),
	});
};
