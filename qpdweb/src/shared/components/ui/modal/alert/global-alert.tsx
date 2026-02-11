import { useRef, useEffect } from 'react';
import {
	useGlobalModalStore,
	useGlobalModalActions,
} from '~/shared/store/global-modal';
import { AlertModal } from '../alert-modal';
import useModal from '~/shared/hooks/useModal';

export const GlobalAlert = () => {
	const AlertPortal = useModal('global-alert');
	const { isOpen, message, callback } = useGlobalModalStore(
		state => state.alert,
	);
	const { closeAlert } = useGlobalModalActions();
	const isInitialMount = useRef(true);

	useEffect(() => {
		const isFirstMount = isInitialMount.current;
		isInitialMount.current = false;

		if (isOpen) {
			AlertPortal.open();
			return;
		}

		if (!isFirstMount) {
			AlertPortal.close();
		}
	}, [isOpen]);

	const onClose = () => {
		callback?.();
		closeAlert();
	};

	return (
		<AlertPortal.Render onClickBackground={() => {}}>
			<AlertModal text={message} modal={AlertPortal} onClickConfirm={onClose} />
		</AlertPortal.Render>
	);
};
