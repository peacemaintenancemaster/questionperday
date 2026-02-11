import { useMutation } from '@tanstack/react-query';
import { API } from '~/api';
import type { LoginSchema } from '../schema/login/login';

export const useAddAdmin = () => {
	return useMutation({
		mutationFn: ({ username, password }: LoginSchema) =>
			API.Auth.register({ username, password }),
	});
};
