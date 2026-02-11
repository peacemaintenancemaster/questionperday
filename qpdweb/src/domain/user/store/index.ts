import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface KakaoAccount {
	email: string;
	phone_number: string;
	gender: string;
	birthyear: string;
	birthday: string;
	countryCode: string;
	profile: {
		nickname: string;
	};
}

export interface User {
	email: string;
	gender: string;
	phone: string;
	country: string;
	birthday: string;
	year: string;
	month: string;
	day: string;
	name: string;
}

type Store = {
	user: Partial<User>;
	isLogin: boolean;
};

const initialStore: Store = {
	user: {
		email: '',
		gender: '',
		phone: '',
		country: '',
		birthday: '',
		year: '',
		month: '',
		day: '',
		name: '',
	},
	isLogin: false,
};

export type Actions = {
	// eslint-disable-next-line no-unused-vars
	setUser: (user: Partial<User>) => void;
};

export const useUserStore = create<Store & { actions: Actions }>()(
	immer(set => ({
		...initialStore,
		actions: {
			setUser: user => {
				set(state => {
					state.user = user;
					state.isLogin = true;
				});
			},
		},
	})),
);

export const useUserActions = () => useUserStore(s => s.actions);
