import { instance } from '~/shared/api/instance';
import { AuthSchema } from '../schema/user.auth';
import { KakaoAccount } from '../store';

export const register = async (data: AuthSchema) =>
	await instance
		.post('user/auth/register', {
			json: data,
		})
		.json();

export const login = async (data: AuthSchema) =>
	await instance
		.post('user/auth/login', {
			json: data,
		})
		.json();

export const session = async (): Promise<{
	user: {
		id: number;
		email: string;
		nickname: string;
	};
}> => await instance.get('user/auth/session').json();

export const logout = async () => await instance.get('user/auth/logout').json();

export const authenticationKakaoInfo = async (data: {
	tempToken: string;
}): Promise<KakaoAccount> =>
	await instance
		.post('user/auth/kakao/info', {
			json: data,
		})
		.json();

export const authenticationKakaoLogin = async (data: {
	tempToken: string;
}): Promise<void> =>
	await instance
		.post('user/auth/kakao/login', {
			json: data,
		})
		.json();
