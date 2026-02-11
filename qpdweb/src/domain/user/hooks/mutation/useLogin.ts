import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/shared/constants/query/query-key';
import { AuthSchema } from '../../schema/user.auth';
import { UserAPI } from '../../api';

export const useLogin = () =>
	useMutation({
		mutationKey: QUERY_KEYS.auth.login,
		mutationFn: (data: AuthSchema) => UserAPI.Auth.login(data),
	});
