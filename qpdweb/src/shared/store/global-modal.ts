import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Immer } from '../types';

interface State {
	alert: {
		message: string;
		isOpen: boolean;
		callback?: () => void;
	};
}

interface Action {
	actions: {
		// eslint-disable-next-line no-unused-vars
		alert: (text: string, callback?: () => void) => void;
		closeAlert: () => void;
	};
}

const initialState: State = {
	alert: {
		message: '',
		isOpen: false,
		callback: undefined,
	},
};

const createActions = (
	// eslint-disable-next-line no-unused-vars
	set: (fn: Immer<State & Action>) => void,
): Action => ({
	actions: {
		alert(text, callback) {
			set(draft => {
				draft.alert.message = text;
				draft.alert.isOpen = true;
				draft.alert.callback = callback;
			});
		},
		closeAlert() {
			set(draft => {
				draft.alert.message = '';
				draft.alert.isOpen = false;
				draft.alert.callback = undefined;
			});
		},
	},
});

export const useGlobalModalStore = create<State & Action>()(
	immer(set => ({
		...initialState,
		...createActions(set),
	})),
);

export const useGlobalModalActions = () =>
	useGlobalModalStore(state => state.actions);
