import * as stylex from '@stylexjs/stylex';
import { PropsWithChildren } from 'react';
import { flex } from '~/shared/style/common.stylex';

export const QuestionBlurLayout = ({ children }: PropsWithChildren) => {
	return (
		<section {...stylex.props(styles.wrap)}>
			<article {...stylex.props(styles.inner, flex.between, flex.column)}>
				{children}
			</article>

			<aside {...stylex.props(styles.background)} />
			<section {...stylex.props(styles.blur)} />
			<section {...stylex.props(styles.gradient)} />
		</section>
	);
};

const styles = stylex.create({
	shadow: {
		marginBottom: 4,
	},
	wrap: {
		position: 'relative',
		overflow: 'hidden', // 추가
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		maxWidth: 600,
		height: 'calc(100% - 44px)',
	},
	inner: {
		position: 'absolute',
		top: '44px',
		width: '100%',
		height: 'calc(100% - 44px)',
		padding: '0 18px 10px 18px',
		flex: 1,
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: 'calc(100% - 44px)',
	},
	background: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		zIndex: 1,
	},
	blur: {
		position: 'absolute',
		width: '100%',
		maxWidth: 600,
		height: '100%',
		backdropFilter: 'blur(250px)',
		background: 'rgba(255, 255, 255, 0.8)',
		transition: 'all 0.6s ease-out',
	},
	gradient: {
		position: 'relative',
		top: '44px',
		width: '100%',
		maxWidth: 600,
		height: '100%',
		backgroundImage: 'linear-gradient(#2C5AFF 100%, #7C99FF 100% , #fff 80%)',
		zIndex: -1,
		transition: 'backgroundImage 0.2s ease-in-out',
	},
});
