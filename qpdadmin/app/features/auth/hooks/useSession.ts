import { API } from '~/api';
import { AuthContext } from '../context/auth';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

export function useSession() {
	const { state, dispatch } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				if (state.isAuthenticated) return;

				const result = await API.Auth.session();

				dispatch({
					type: 'LOGIN',
					payload: result.admin,
				});
			} catch {
				navigate('/login');
			}
		})();
	}, [state.isAuthenticated]);

	return;
}
