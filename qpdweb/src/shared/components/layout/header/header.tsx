import * as styleX from '@stylexjs/stylex';
import { useLocation, useNavigate, useRouter } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';
import { config } from '~/config';
import { useTodayQuestion } from '~/domain/question/hooks/useTodayQuestion';
import useModal from '~/shared/hooks/useModal';
import { Icon, Image } from '~/shared/images';
import { colors, flex } from '~/shared/style/common.stylex';
import { LoginBottomSheet } from '../../ui/bottom-sheet/login/login-bottom-sheet';
import { useTodayQuestionInfo } from '~/domain/question/hooks/useTodayQuestionInfo';
import { useThemeStore } from '~/shared/store/theme';

type Variant = 'back';

interface Props {
	variant?: Variant;
	onClickCallback?: () => void;
}

export const Header = ({ variant, onClickCallback }: Props) => {
	const navigate = useNavigate();
	const pathname = useLocation({
		select: location => location.pathname,
	});
	const LoginPortal = useModal('login-portal');
	const router = useRouter();
	const { theme, toggleTheme } = useThemeStore();

	const { data: todayQuestionInfo } = useTodayQuestionInfo();
	const { data: questionData } = useTodayQuestion(
		todayQuestionInfo?.questionId,
	);

	const isQuestionPath = pathname.includes('question');
	const isAnswerPath = pathname.includes('/answer');
	const isProfilePath = pathname === '/profile';
	const showBack = variant === 'back' || isAnswerPath || isProfilePath;
	const onClickRoute = () => navigate({ to: '/' });

	const isDark = theme === 'dark';
	const iconColor = isDark ? '#e6edf3' : '#9a9a9a';

	const onClickBack = () => {
		if (typeof onClickCallback === 'function') {
			onClickCallback();
			return;
		}

		if (isAnswerPath || isProfilePath) {
			navigate({ to: '/' });
			return;
		}

		router.history.back();
	};

	return (
		<header {...styleX.props(styles.wrap, flex.between, flex.vertical)}>
			{showBack ? (
				<button onClick={onClickBack}>
					<Icon.ArrowLeft size='20' color={iconColor} />
				</button>
			) : (
				<button onClick={onClickRoute}>
					{Boolean(questionData?.question?.logoImageId) ? (
						<img
							width={74}
							height={23}
							src={config.image.host + questionData?.question.logoImageId}
						/>
					) : (
						<Image.Logo width='74px' height='23px' />
					)}
				</button>
			)}

			<div {...styleX.props(styles.buttonGroup, flex.vertical)}>
				{/* Dark mode toggle */}
				<button
    {...styleX.props(styles.button)}
    onClick={toggleTheme}
    aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}>
    {isDark ? (
        // [수정] 다크모드일 땐 태양을 '흰색'으로 강제 설정
        <Icon.Sun size='24' color='#ffffff' />
    ) : (
        // 라이트모드일 땐 기존대로 (보통 검은색)
        <Icon.Moon size='24' color={iconColor} />
    )}
</button>

				{isQuestionPath ? (
					<button
						{...styleX.props(styles.button)}
						onClick={() => navigate({ to: '/' })}>
						<Icon.Home size='24' color={iconColor} />
					</button>
				) : isProfilePath ? (
					<button
						{...styleX.props(styles.button)}
						onClick={() => navigate({ to: '/' })}>
						<Icon.Home size='24' color={iconColor} />
					</button>
				) : (
					<button
						{...styleX.props(styles.button)}
						onClick={() => navigate({ to: '/profile' })}>
						<Icon.User size='24' color={iconColor} />
					</button>
				)}
			</div>

			<LoginPortal.Render type='bottomSheet' animationType='bottomSheet'>
				<LoginBottomSheet />
			</LoginPortal.Render>
		</header>
	);
};

const styles = styleX.create({
	wrap: {
		width: '100%',
		padding: '10px 18px',
		backgroundColor: colors.white,
	},
	buttonGroup: {
		gap: '14px',
	},
	iconWrap: {
		display: 'flex',
	},
	button: {
		width: '24px',
		height: '24px',
	},
});
