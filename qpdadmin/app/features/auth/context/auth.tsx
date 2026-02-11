import { createContext, useReducer, type PropsWithChildren } from 'react';
import { produce } from 'immer';

export interface User {
	id?: number;
	username?: string;
	nickname?: string;
}

export interface UserState {
	isAuthenticated: boolean;
	id: number;
	username: string;
}

export type UserAction = { type: 'LOGIN'; payload: User } | { type: 'LOGOUT' };

const initialState: UserState = {
	isAuthenticated: false,
	username: '',
	id: 0,
};

function userReducer(state: UserState, action: UserAction) {
	return produce(state, draft => {
		switch (action.type) {
			case 'LOGIN':
				draft.username = action.payload.username;
				draft.id = action.payload.id;
				draft.isAuthenticated = true;
				break;
			case 'LOGOUT':
				draft.username = '';
				draft.id = 0;
				draft.isAuthenticated = false;
				break;
		}
	});
}
interface Context {
	state: UserState;
	dispatch: React.Dispatch<UserAction>;
}

export const AuthContext = createContext<Context>({
	state: initialState,
	dispatch: () => null,
});

export function AuthProvider({ children }: PropsWithChildren) {
	const [state, dispatch] = useReducer(userReducer, initialState);
	return <AuthContext value={{ state, dispatch }}>{children}</AuthContext>;
}
