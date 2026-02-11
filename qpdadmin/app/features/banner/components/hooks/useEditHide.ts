import { useMutation } from '@tanstack/react-query';
import { API } from '~/api';

export const useEditHide = () => {
	return useMutation({
		mutationFn: (id: number) => API.Banner.editHide(id),
	});
};
