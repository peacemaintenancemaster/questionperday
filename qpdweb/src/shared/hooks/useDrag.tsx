import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useDraggable as Draggable } from 'react-use-draggable-scroll';
import * as stylex from '@stylexjs/stylex';

interface Props {
	safeDisplacement?: number;
	hasBandEffect?: boolean;
	isMounted?: boolean;
}

const containerStyles = stylex.create({
	container: {
		overflowX: 'scroll',
		alignItems: 'flex-start',
		padding: '8px',
		'::-webkit-scrollbar': {
			display: 'none',
		},
	},
});

export const useDrag = ({
	safeDisplacement = 14,
	hasBandEffect = true,
	isMounted = true,
}: Props) => {
	const [event, setEvent] = useState<{
		// eslint-disable-next-line no-unused-vars
		onMouseDown: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	}>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const ref = useRef<any>();

	const { events } = Draggable(ref, {
		applyRubberBandEffect: hasBandEffect,
		safeDisplacement: safeDisplacement,
		isMounted: isMounted,
	});

	useEffect(() => {
		if (!isMounted || !ref.current) return;
		setEvent(events);
	}, [isMounted]);

	const renderContainer = (children: React.ReactNode) => {
		return (
			<div ref={ref} {...event} {...stylex.props(containerStyles.container)}>
				{children}
			</div>
		);
	};

	interface ListProps extends PropsWithChildren {
		ListStyled: React.ElementType;
	}

	const RenderDraggableList = (props: ListProps) => {
		const { ListStyled, children } = props;
		return (
			<ListStyled ref={ref} {...event}>
				{children}
			</ListStyled>
		);
	};

	return { ref, events, event, renderContainer, RenderDraggableList };
};
