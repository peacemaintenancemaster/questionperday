import { useMutation } from '@tanstack/react-query';
import { API } from '~/api';
import type { BannerBody } from '~/features/banner/schema';

export const useEditBanner = () => {
	return useMutation({
		mutationFn: (banner: BannerBody & { id: number }) =>
			API.Banner.edit(banner),
	});
};
