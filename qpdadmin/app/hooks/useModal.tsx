import React, {
	type MouseEvent,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import { keyframes, css } from '@emotion/react';
import { createPortal } from 'react-dom';
import { useModalActions, useModalStore } from '~/store/modal'; // Assuming '~/store/modal' is the correct path

let zIndex = 1;
type AnimationType =
	| 'fade'
	| 'scale'
	| 'upDown'
	| 'slideInRight'
	| 'bottomSheet';
type ModalType = 'modal' | 'sidebar' | 'bottomSheet' | 'snackBar'; // Added 'snackBar' as per the first code's usage

export type UseModalPortalReturn = ReturnType<typeof useModal>;
export type UseModalPortalReturnWithValue<V = undefined> = ReturnType<
	typeof useModal<V>
>;

/**
 * @name useModal
 * @author terra @doyoung95
 * @example
 * ```
 * //	한 부모 및에 중복된 키만 사용하지 않으면 됩니다. 고정값이 아닌 랜더링 시마다 새 키를 생성할 경우 동일한 모달이 중복으로 생길 수 있음.
 * const ModalFoo = useModalPortal("your custom string key")
 *
 * return (
 *		<ModalFoo.Render props={"you can use props defined in this hook"}>
 *			<YourCustomModalComponent props={"any props you need"} />
 *		</ModalFoo.Render>
 * )
 * ```
 *
 * @version 1.0.1
 * [231204] Stella
 * 1. clear 함수 HOC로 사용하려면 modalKey Optional로 사용해야 함
 * 2. modal Close Icon on/off props, 기본세팅 Icon 제거
 * 3. modal type 'snackBar' 추가 (default: 'modal')
 */

// Portal component for rendering modals outside the main DOM flow
interface PortalProps {
	children: ReactNode;
}

const Portal = ({ children }: PortalProps) => {
	const element =
		typeof window !== 'undefined' && document.getElementById('modal');
	return element && children ? createPortal(children, element) : null;
};

export function useModal<T = undefined>(modalKey: string) {
	const { modalSet: openList } = useModalStore(); // Renamed list to modalSet to match the second code
	const isOpen = openList.has(modalKey); // Changed includes to has for Set
	const [isActive, setIsActive] = useState(false);
	const [value, setValue] = useState<T | undefined>(undefined);
	const {
		modalOpen: openPortal,
		modalClose: closePortal,
		modalClear: clearPortal,
	} = useModalActions(); // Renamed actions to match the second code

	/**
	 * Animates the modal out before unmounting.
	 */
	useEffect(() => {
		if (isOpen === isActive) return;

		(async () => {
			if (!isOpen) {
				await new Promise(resolve => setTimeout(resolve, 350)); // Simplified wait
			}
			setIsActive(isOpen);
		})();
	}, [isOpen, isActive]); // Added isActive to dependency array

	/**
	 * Prevents scroll and touch actions when a modal is open.
	 */
	useEffect(() => {
		const html = document.getElementsByTagName('html')[0];
		if (isActive || openList.size > 0) {
			// Changed openList.length to openList.size for Set
			html.style.overflow = 'hidden';
		} else {
			html.style.overflow = '';
		}
		return () => {
			html.style.overflow = '';
		};
	}, [isOpen, isActive, openList.size]); // Added openList.size to dependency array

	/**
	 * @description Opens the modal.
	 */
	const open = (value?: T) => {
		openPortal(modalKey);
		setValue(value);
	};

	/**
	 * @description Closes the specific modal.
	 */
	const close = () => {
		setValue(undefined);
		closePortal(modalKey);
	};

	/**
	 * @description Closes all modals.
	 */
	const clear = () => clearPortal();

	interface RenderProps {
		// Renamed Props to RenderProps to avoid conflict
		children: React.ReactNode; // Changed React.ReactChild to React.ReactNode
		/**
		 * @description Disables the modal background.
		 * @default false
		 */
		invisibleBackground?: boolean;
		/**
		 * @description Option to close all modals when this modal is closed.
		 * If enabled on the first opened modal, it simplifies managing the lifecycle of child modals (e.g., confirm, alert).
		 * @default false
		 */
		unmountClearAll?: boolean;
		/**
		 * @description Callback to execute when the background is clicked.
		 * If this callback is provided, the default behavior of closing the modal by clicking the background will not occur.
		 * @default undefined
		 */
		onClickBackground?: () => void;
		animationType?: AnimationType;
		withoutOverlay?: boolean;
		/**
		 * @description Type of modal for specific positioning and styling.
		 * @default 'modal'
		 */
		type?: ModalType;
	}

	const Render = (props: RenderProps) => {
		const {
			children,
			unmountClearAll,
			invisibleBackground,
			onClickBackground,
			animationType = 'upDown',
			type = 'modal',
			withoutOverlay = false,
		} = props;

		const closeModal = unmountClearAll ? clear : close;

		const _onClickBackground = (e: MouseEvent<HTMLDivElement>) => {
			if (onClickBackground && typeof onClickBackground === 'function') {
				onClickBackground();
			} else {
				closeModal();
			}
			e.stopPropagation();
		};

		if (!isActive) return null; // Changed <></> to null

		return (
			<Portal>
				{!invisibleBackground && (
					<div
						css={backgroundStyle(isOpen, zIndex++, withoutOverlay)} // Pass withoutOverlay
						onClick={_onClickBackground}
					/>
				)}

				<div
					onClick={(e: MouseEvent<HTMLDivElement>) => {
						e.stopPropagation();
					}} // Stop propagation for modal content clicks
					css={modalWrapStyle(isOpen, zIndex++, animationType, type)}>
					{children}
				</div>
			</Portal>
		);
	};

	return useMemo(
		() => ({ Render, open, close, clear, value }),
		[isActive, isOpen, value],
	);
}

// Keyframes (already defined in the second code, just ensuring consistency)
const fadeInOut = keyframes`
	0% { opacity: 0; }
	100% { opacity: 1; }
`;

const scaleUpDown = keyframes`
	0% {
		transform: translate(-50%, -50%) scale(0);
		opacity: 0;
	}
	100% {
		transform: translate(-50%, -50%) scale(1);
		opacity: 1;
	}
`;

const upDown = keyframes`
	0% {
		transform: translate(-50%, 200%);
		opacity: 0;
	}
	100% {
		transform: translate(-50%, -50%);
		opacity: 1;
	}
`;

const slideInRight = keyframes` // Renamed 'right' to 'slideInRight'
	0% {
		transform: translateX(240%);
		opacity: 0;
	}
	100% {
		transform: translateX(0);
		opacity: 1;
	}
`;

const bottomSheet = keyframes`
	0% {
		transform: translate(-50%, 200%);
		opacity: 0;
	}
	100% {
		transform: translate(-50%, 0%);
		opacity: 1;
	}
`;

const animations = {
	fade: fadeInOut,
	scale: scaleUpDown,
	upDown: upDown,
	slideInRight: slideInRight, // Changed 'right' to 'slideInRight'
	bottomSheet: bottomSheet,
};

// Styles
const backgroundStyle = (
	isOpen: boolean,
	zIndex: number,
	withoutOverlay: boolean,
) =>
	css({
		cursor: 'pointer',
		position: 'fixed',
		zIndex,
		top: 0,
		left: 0,
		width: '100vw', // Changed '100%' to '100vw'
		height: '100vh', // Changed '100%' to '100vh'
		backgroundColor: withoutOverlay ? 'transparent' : 'rgba(0, 0, 0, 0.3)',
		animation: `${fadeInOut} 300ms forwards ${isOpen ? '' : 'reverse'}`,
	});

const modalWrapStyle = (
	isOpen: boolean,
	zIndex: number,
	animationType: AnimationType,
	type: ModalType,
) =>
	css({
		position: 'fixed',
		zIndex,
		display: 'flex',
		justifyContent: 'center',
		animation: `${animations[animationType]} 300ms forwards ${
			isOpen ? '' : 'reverse'
		}`,
		...(type === 'modal' && {
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		}),
		...(type === 'snackBar' && {
			top: 0,
			left: '50%', // Added left and transform for snackBar to be centered
			transform: 'translateX(-50%)',
		}),
		...(type === 'sidebar' && {
			// Changed 'menu' to 'sidebar'
			top: '60px', // As per the first code
			right: 0,
			bottom: 0,
			left: 'unset', // As per the first code
			transform: 'translateX(0)', // As per the first code
		}),
		...(type === 'bottomSheet' && {
			top: 'unset',
			bottom: 0,
			left: '50%',
			transform: 'translateX(-50%)',
		}),
	});
