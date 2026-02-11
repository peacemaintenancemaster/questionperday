import { useMutation } from '@tanstack/react-query';
import { UserAPI } from '../../api';
import { QUERY_KEYS } from '~/shared/constants/query/query-key';
import { AuthSchema } from '../../schema/user.auth';

export const useRegister = () =>
	useMutation({
		mutationKey: QUERY_KEYS.auth.register,
		mutationFn: (data: AuthSchema) => UserAPI.Auth.register(data),
	});
