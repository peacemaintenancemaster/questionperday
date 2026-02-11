import { useEffect } from 'react';
import { UserAPI } from '../../api';
import { useUserActions } from '../../store';
import { config } from '~/config';

export const SessionCheck = () => {
	const { setUser } = useUserActions();

	useEffect(() => {
		if (!config.server.host) return;

		(async () => {
			try {
				const { user } = await UserAPI.Auth.session();
				setUser(user);
			} catch {
				try {
					await UserAPI.Auth.logout();
				} catch {
					// ignore logout errors
				}
			}
		})();
	}, []);

	return <></>;
};
