import { useMutation } from '@tanstack/react-query';
import { API } from '~/api';

export const useDelBanner = () => {
	return useMutation({
		mutationFn: (id: number) => API.Banner.del(id),
	});
};
