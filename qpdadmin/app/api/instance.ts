import ky from 'ky';
import { config } from '~/config';

export const instance = ky.create({
	prefixUrl: config.server.host,
	timeout: 5000,
	credentials: 'include',
});

export const imageInstance = ky.create({
	prefixUrl: 'https://api.questionperday.me/image',
	timeout: 5000,
	credentials: 'include',
});
