import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type ModalStore = {
	modalSet: Set<string>;
};
const initialStore: ModalStore = {
	modalSet: new Set(),
};
export type ModalActions = {
	modalOpen: (modalKey: string) => void;
	modalClose: (modalKey: string) => void;
	modalClear: () => void;
};

export const useModalStore = create<ModalStore & { actions: ModalActions }>()(
	immer(set => ({
		...initialStore,
		actions: {
			modalOpen: modalKey =>
				set(s => {
					s.modalSet.add(modalKey);
				}),
			modalClose: modalKey =>
				set(s => {
					s.modalSet.delete(modalKey);
				}),
			modalClear: () =>
				set(s => {
					s.modalSet.clear();
				}),
		},
	})),
);

export const useModalActions = () => useModalStore(s => s.actions);
