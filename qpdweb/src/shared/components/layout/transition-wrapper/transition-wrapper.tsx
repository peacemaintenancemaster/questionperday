import { useLocation, useMatches } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { PropsWithChildren, useEffect, useRef } from 'react';

export const SlideTransitionWrapper = ({ children }: PropsWithChildren) => {
	const location = useLocation();
	const matches = useMatches();
	const prevMatchesRef = useRef(matches);
	const key = location.pathname + location.search;

	useEffect(() => {
		prevMatchesRef.current = matches;
	}, [matches]);

	return (
		<motion.div
			key={key}
			initial={{ x: '100%' }}
			animate={{ x: 0 }}
			exit={{ x: '-100%' }}
			transition={{ type: 'tween', duration: 0.5 }}
			style={{
				position: 'relative',
				width: '100%',
				height: '100%',
			}}>
			{children}
		</motion.div>
	);
};
