import * as stylex from '@stylexjs/stylex';

const shimmer = stylex.keyframes({
	'0%': { transform: 'translateX(-100%)' },
	'100%': { transform: 'translateX(100%)' },
});

const styles = stylex.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '100vh',
		padding: '2rem',
		backgroundColor: '#fafafa',
	},
	loadingCard: {
		backgroundColor: 'white',
		borderRadius: '16px',
		padding: '2rem',
		boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
		width: '100%',
		maxWidth: '400px',
	},
	skeleton: {
		position: 'relative',
		backgroundColor: '#f0f0f0',
		borderRadius: '8px',
		overflow: 'hidden',
		'::before': {
			content: '""',
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			background:
				'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
			animationName: shimmer,
			animationDuration: '1.5s',
			animationIterationCount: 'infinite',
		},
	},
	profileSkeleton: {
		width: '80px',
		height: '80px',
		borderRadius: '50%',
		margin: '0 auto 1.5rem auto',
	},
	titleSkeleton: {
		height: '24px',
		marginBottom: '0.75rem',
	},
	textSkeleton: {
		height: '16px',
		marginBottom: '0.5rem',
	},
	textSkeletonShort: {
		height: '16px',
		width: '60%',
		marginBottom: '1rem',
	},
	buttonSkeleton: {
		height: '48px',
		borderRadius: '24px',
		marginTop: '1rem',
	},
	kakaoIcon: {
		fontSize: '2rem',
		marginBottom: '1rem',
	},
});

export const LoadingSkeleton = () => (
	<div {...stylex.props(styles.container)}>
		<div {...stylex.props(styles.loadingCard)}>
			<div {...stylex.props(styles.kakaoIcon)}>🍃</div>
			<div {...stylex.props(styles.skeleton, styles.profileSkeleton)} />
			<div {...stylex.props(styles.skeleton, styles.titleSkeleton)} />
			<div {...stylex.props(styles.skeleton, styles.textSkeleton)} />
			<div {...stylex.props(styles.skeleton, styles.textSkeleton)} />
			<div {...stylex.props(styles.skeleton, styles.textSkeletonShort)} />
			<div {...stylex.props(styles.skeleton, styles.buttonSkeleton)} />
		</div>
	</div>
);
