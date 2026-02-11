import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import * as stylex from '@stylexjs/stylex';
import { UserAPI } from '~/domain/user/api';
import { useUserActions } from '~/domain/user/store';
import { useNavigationRestore } from '~/shared/hooks/useNavigationRestore';

export const Route = createFileRoute('/user/kakao/bridge/register')({
	component: RouteComponent,
	validateSearch: z.object({
		state: z.string().optional(),
		success: z.boolean().optional(),
		tempToken: z.string().optional(),
		error_msg: z.string().optional(),
	}),
});

export const convertPhone = (phoneNumber?: string): string | undefined => {
	if (!phoneNumber) return undefined;

	const convertedNumber = phoneNumber
		.replace('+82 10', '010')
		.replace('+82 010', '010')
		.replaceAll('-', '')
		.replaceAll('+', '');

	if (!convertedNumber.startsWith('010')) {
		return undefined;
	}

	return convertedNumber;
};

export const convertGender = (g?: string): string => {
	if (!g) return 'M';
	return g.toUpperCase() === 'MALE' ? 'M' : 'W';
};

function RouteComponent() {
	const { success, tempToken, error_msg } = Route.useSearch();
	const navigate = useNavigate();
	const { setUser } = useUserActions();
	const { restoreNavigation } = useNavigationRestore();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const processKakaoAuth = async () => {
			try {
				if (!success) {
					setIsLoading(false);
					return;
				}

				const kakaoAccount = await UserAPI.Auth.authenticationKakaoInfo({
					tempToken,
				} as { tempToken: string });

				const phone = convertPhone(kakaoAccount.phone_number);
				const countryCode = phone
					? kakaoAccount.phone_number?.split(' ').slice(0, -1).join(' ')
					: '+82';

				// 생일 데이터 안전하게 처리
				const birthdayStr = kakaoAccount.birthday || '';
				const month = birthdayStr.length >= 4 ? birthdayStr.slice(0, 2) : '';
				const day = birthdayStr.length >= 4 ? birthdayStr.slice(2, 4) : '';

				const userData = {
					email: kakaoAccount.email || '',
					gender: convertGender(kakaoAccount.gender),
					phone: phone || '',
					country: countryCode,
					birthday: (kakaoAccount.birthyear || '') + birthdayStr,
					year: kakaoAccount.birthyear || '',
					month,
					day,
					name: kakaoAccount.profile?.nickname || '',
				};

				setUser(userData);

				const restored = restoreNavigation();

				if (!restored) {
					navigate({ to: '/', replace: true });
				}
			} catch (error) {
				console.error('❌ 카카오 인증 처리 중 오류:', error);
			}
		};

		processKakaoAuth();
	}, [success, tempToken, navigate, setUser]);

	if (isLoading && success) {
		return <LoadingSkeleton />;
	}

	return (
		<div {...stylex.props(styles.container)}>
			<div {...stylex.props(styles.loadingCard)}>
				{error_msg ? (
					<div>인증 중 오류가 발생했습니다: {error_msg}</div>
				) : (
					<div>카카오 인증을 처리하고 있습니다...</div>
				)}
			</div>
		</div>
	);
}

const LoadingSkeleton = () => (
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
