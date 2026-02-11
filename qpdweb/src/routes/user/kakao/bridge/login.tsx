import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { z } from 'zod';
import { UserAPI } from '~/domain/user/api';
import { useNavigationRestore } from '~/shared/hooks/useNavigationRestore';

export const Route = createFileRoute('/user/kakao/bridge/login')({
	component: RouteComponent,
	validateSearch: z.object({
		state: z.string().optional(),
		success: z.boolean().optional(),
		tempToken: z.string().optional(),
		error_msg: z.string().optional(),
	}),
});

function RouteComponent() {
	const { success, tempToken, error_msg } = Route.useSearch();
	const navigate = useNavigate();
	const { restoreNavigation } = useNavigationRestore();

	useEffect(() => {
		(async () => {
			if (!success) {
				return;
			}

			await UserAPI.Auth.authenticationKakaoLogin({
				tempToken,
			} as { tempToken: string });

			const restored = restoreNavigation();

			if (!restored) {
				navigate({ to: '/', replace: true });
			}
		})();
	}, [success, error_msg, tempToken]);
	return <div></div>;
}
