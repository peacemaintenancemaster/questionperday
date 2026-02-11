import React, { useEffect, useMemo, useState, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useModalActions, useModalStore } from '~/shared/store/modal';

const BASE_Z_INDEX = 1000;
const ANIMATION_DURATION = 300; // 모든 애니메이션 타이밍 통일

type AnimationType = 'fade' | 'scale' | 'upDown' | 'right' | 'bottomSheet';
type ModalType = 'modal' | 'snackBar' | 'menu' | 'bottomSheet';

export type UseModalReturn = ReturnType<typeof useModal>;

interface PortalProps {
	children: ReactNode;
}

const Portal = ({ children }: PortalProps) => {
	const element =
		typeof window !== 'undefined' && document.getElementById('modal');

	return element && children ? createPortal(children, element) : null;
};

const fadeIn = stylex.keyframes({
	'0%': { opacity: 0 },
	'100%': { opacity: 1 },
});

const fadeOut = stylex.keyframes({
	'0%': { opacity: 1 },
	'100%': { opacity: 0 },
});

const scaleIn = stylex.keyframes({
	'0%': {
		transform: 'translate(-50%, -50%) scale(0.8)',
		opacity: 0,
	},
	'100%': {
		transform: 'translate(-50%, -50%) scale(1)',
		opacity: 1,
	},
});

const scaleOut = stylex.keyframes({
	'0%': {
		transform: 'translate(-50%, -50%) scale(1)',
		opacity: 1,
	},
	'100%': {
		transform: 'translate(-50%, -50%) scale(0.8)',
		opacity: 0,
	},
});

const upDownIn = stylex.keyframes({
	'0%': {
		transform: 'translate(-50%, -80%)',
		opacity: 0,
	},
	'100%': {
		transform: 'translate(-50%, -50%)',
		opacity: 1,
	},
});

const upDownOut = stylex.keyframes({
	'0%': {
		transform: 'translate(-50%, -50%)',
		opacity: 1,
	},
	'100%': {
		transform: 'translate(-50%, -80%)',
		opacity: 0,
	},
});

const rightIn = stylex.keyframes({
	'0%': {
		transform: 'translateX(100%)',
		opacity: 0,
	},
	'100%': {
		transform: 'translateX(0%)',
		opacity: 1,
	},
});

const rightOut = stylex.keyframes({
	'0%': {
		transform: 'translateX(0%)',
		opacity: 1,
	},
	'100%': {
		transform: 'translateX(100%)',
		opacity: 0,
	},
});

const bottomSheetIn = stylex.keyframes({
	'0%': {
		transform: 'translate(-50%, 100%)',
		opacity: 0,
	},
	'100%': {
		transform: 'translate(-50%, 0%)',
		opacity: 1,
	},
});

const bottomSheetOut = stylex.keyframes({
	'0%': {
		transform: 'translate(-50%, 0%)',
		opacity: 1,
	},
	'100%': {
		transform: 'translate(-50%, 100%)',
		opacity: 0,
	},
});

// 애니메이션 스타일 - in/out 분리
const animationsIn = stylex.create({
	scale: {
		animationName: scaleIn,
		animationDuration: `${ANIMATION_DURATION}ms`,
		animationFillMode: 'forwards',
		animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
	},
	upDown: {
		animationName: upDownIn,
		animationDuration: `${ANIMATION_DURATION}ms`,
		animationFillMode: 'forwards',
		animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
	},
	right: {
		animationName: rightIn,
		animationDuration: `${ANIMATION_DURATION}ms`,
		animationFillMode: 'forwards',
		animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
	},
	bottomSheet: {
		animationName: bottomSheetIn,
		animationDuration: `${ANIMATION_DURATION}ms`,
		animationFillMode: 'forwards',
		animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
	},
	fade: {
		animationName: fadeIn,
		animationDuration: `${ANIMATION_DURATION}ms`,
		animationFillMode: 'forwards',
	},
});

const animationsOut = stylex.create({
	scale: {
		animationName: scaleOut,
		animationDuration: `${ANIMATION_DURATION}ms`,
		animationFillMode: 'forwards',
		animationTimingFunction: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
	},
	upDown: {
		animationName: upDownOut,
		animationDuration: `${ANIMATION_DURATION}ms`,
		animationFillMode: 'forwards',
		animationTimingFunction: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
	},
	right: {
		animationName: rightOut,
		animationDuration: `${ANIMATION_DURATION}ms`,
		animationFillMode: 'forwards',
		animationTimingFunction: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
	},
	bottomSheet: {
		animationName: bottomSheetOut,
		animationDuration: `${ANIMATION_DURATION}ms`,
		animationFillMode: 'forwards',
		animationTimingFunction: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
	},
	fade: {
		animationName: fadeOut,
		animationDuration: `${ANIMATION_DURATION}ms`,
		animationFillMode: 'forwards',
	},
});

const modalPosition = stylex.create({
	modal: {
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
	},
	snackBar: {
		width: '100%',
		maxWidth: '400px',
		top: 'unset',
		bottom: '90px',
		left: '50%',
		transform: 'translateX(-50%)',
	},
	menu: {
		top: '50%',
		left: 'unset',
		right: '20px',
		transform: 'translateY(-50%)',
	},
	bottomSheet: {
		top: 'unset',
		bottom: 0,
		left: '50%',
		width: '100%',
		maxWidth: '600px',
		transform: 'translateX(-50%)',
	},
});

const styles = stylex.create({
	background: (zIndex: number, isClosing: boolean) => ({
		cursor: 'pointer',
		position: 'fixed',
		zIndex: zIndex - 1,
		top: 0,
		left: '50%',
		transform: 'translateX(-50%)',
		width: '100%',
		maxWidth: '600px',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		animationName: isClosing ? fadeOut : fadeIn,
		animationDuration: `${ANIMATION_DURATION}ms`,
		animationFillMode: 'forwards',
	}),
	modalWrap: (zIndex: number) => ({
		position: 'fixed',
		zIndex: zIndex,
		pointerEvents: 'none',
	}),
	modalContent: {
		pointerEvents: 'auto',
	},
});

// zIndex 생성 함수
const createZIndex = (() => {
	let counter = 0;
	return () => BASE_Z_INDEX + ++counter;
})();

export const useModal = (modalKey: string) => {
	const { modalSet } = useModalStore();
	const { modalOpen, modalClose, modalClear } = useModalActions();
	const isOpen = modalSet.has(modalKey);
	const [isActive, setIsActive] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const zIndexRef = useRef<number | null>(null);

	// zIndex 할당 (한 번만)
	if (zIndexRef.current === null) {
		zIndexRef.current = createZIndex();
	}

	useEffect(() => {
		if (isOpen === isActive) return;

		const handleStateChange = async () => {
			if (isOpen) {
				// 열기
				setIsActive(true);
				setIsClosing(false);
			} else {
				// 닫기
				setIsClosing(true);
				await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));
				setIsActive(false);
				setIsClosing(false);
			}
		};

		handleStateChange();
	}, [isOpen, isActive]);

	// body 스크롤 제어
	useEffect(() => {
		const body = document.body;
		const html = document.documentElement;

		if (isActive && !isClosing) {
			const scrollY = window.scrollY;
			body.style.position = 'fixed';
			body.style.top = `-${scrollY}px`;
			body.style.width = '100%';
			html.style.overflow = 'hidden';
		} else {
			const scrollY = body.style.top;
			body.style.position = '';
			body.style.top = '';
			body.style.width = '';
			html.style.overflow = '';
			if (scrollY) {
				window.scrollTo(0, parseInt(scrollY || '0') * -1);
			}
		}

		return () => {
			body.style.position = '';
			body.style.top = '';
			body.style.width = '';
			html.style.overflow = '';
		};
	}, [isActive, isClosing]);

	const open = () => modalOpen(modalKey);
	const close = () => modalClose(modalKey);

	interface Props {
		children: ReactNode;
		invisibleBackground?: boolean;
		unmountClearAll?: boolean;
		onClickBackground?: () => void;
		preventBackgroundClose?: boolean;
		animationType?: AnimationType;
		type?: ModalType;
		snackbarDelay?: number;
	}

	const Render = (props: Props) => {
		const {
			children,
			unmountClearAll,
			invisibleBackground,
			onClickBackground,
			preventBackgroundClose = false,
			animationType = 'upDown',
			type = 'modal',
			snackbarDelay = 2000,
		} = props;

		// 스낵바 자동 닫기
		useEffect(() => {
			if (type !== 'snackBar' || !isOpen) return;

			const timer = setTimeout(() => {
				modalClose(modalKey);
			}, snackbarDelay);

			return () => clearTimeout(timer);
		}, [isOpen, type, snackbarDelay]);

		const closeModal = unmountClearAll ? modalClear : close;

		const handleBackgroundClick = () => {
			if (preventBackgroundClose) return;

			if (onClickBackground) {
				onClickBackground();
				return;
			}
			closeModal();
		};

		const handleContentClick = (e: React.MouseEvent) => {
			e.stopPropagation();
		};

		if (!isActive) return null;

		const currentAnimations = isClosing ? animationsOut : animationsIn;

		return (
			<Portal>
				{!invisibleBackground && (
					<div
						{...stylex.props(styles.background(zIndexRef.current!, isClosing))}
						onClick={handleBackgroundClick}
					/>
				)}
				<div
					{...stylex.props(
						styles.modalWrap(zIndexRef.current!),
						modalPosition[type],
						currentAnimations[animationType],
					)}
					onClick={handleContentClick}>
					<div {...stylex.props(styles.modalContent)}>{children}</div>
				</div>
			</Portal>
		);
	};

	return useMemo(
		() => ({
			Render,
			open,
			close,
			clear: modalClear,
			isOpen,
			isActive,
			isClosing,
		}),
		[isActive, isOpen, isClosing],
	);
};

export default useModal;
