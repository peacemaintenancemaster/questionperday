import { css } from '@emotion/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, type PropsWithChildren, type Ref } from 'react';

interface Props {
	isOpen: boolean;
	type: 'answer' | 'question';
	ref?: Ref<HTMLElement>;
	onOverlayClick?: () => void;
}

export function SideBarLayout({
	type,
	isOpen,
	children,
	ref,
	onOverlayClick,
}: PropsWithChildren<Props>) {
	const widthMap: Record<typeof type, string> = {
		answer: '60%',
		question: '528px',
	};

	return (
		<AnimatePresence mode='wait'>
			{isOpen && (
				<>
					<motion.div
						css={overlay}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onOverlayClick}
					/>
					<motion.section
						ref={ref}
						css={wrap(widthMap[type])}
						initial={{ x: '100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: '100%', opacity: 0 }}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 30,
							mass: 1,
						}}>
						{children}
					</motion.section>
				</>
			)}
		</AnimatePresence>
	);
}

const overlay = css({
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	backgroundColor: '',
});

const wrap = (width: string) =>
	css({
		position: 'fixed',
		display: 'flex',
		flexDirection: 'column',
		top: '80px',
		right: 0,
		width,
		height: '100%',
		borderRadius: '20px 0px 0px 0px',
		backgroundColor: '#fff',
		boxShadow: '-4px 0px 20px 0px rgba(25, 25, 25, 0.10)',
		zIndex: 20,
	});
