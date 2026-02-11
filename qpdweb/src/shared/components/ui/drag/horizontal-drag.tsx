import React, { PropsWithChildren, useEffect } from 'react';
import { useDrag } from '~/shared/hooks/useDrag';
import * as stylex from '@stylexjs/stylex';

interface Props {
	isMounted: boolean;
	flag?: unknown;
	hasPadding?: boolean;
}

export const HorizontalDrag = (props: PropsWithChildren<Props>) => {
	const { isMounted, children, flag, hasPadding } = props;
	const { event, ref: dragRef } = useDrag({
		safeDisplacement: 14,
		isMounted,
	});

	useEffect(() => {
		if (!flag) return;
		if (!dragRef.current) return;

		dragRef.current.scrollTo(0, 0);
	}, [flag]);

	const onDragStart = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};

	const onDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};

	return (
		<div
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDrop={onDragStart}
			ref={dragRef}
			{...event}
			{...stylex.props(styles.base, hasPadding && styles.hasPadding)}>
			{children}
		</div>
	);
};

const styles = stylex.create({
	base: {
		userSelect: 'none',
		overflow: 'auto',
		overscrollBehavior: 'auto',
		display: 'flex',
		gap: 12,
		alignItems: 'flex-start',
		width: '100%',
		WebkitUserDrag: 'none',
		'-webkit-user-drag': 'none',
		'-khtml-user-drag': 'none',
		'-moz-user-drag': 'none',
		'-o-user-drag': 'none',
		paddingRight: '0px',
		'::-webkit-scrollbar': {
			display: 'none',
		},
	},
	hasPadding: {
		paddingRight: '18px',
	},
});
