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
    // 기본 아이콘 색상 (라이트: 회색, 다크: 연한 회색)
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
            {/* 좌측: 뒤로가기 또는 로고 */}
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

            {/* 우측 버튼 그룹 */}
            <div {...styleX.props(styles.buttonGroup, flex.vertical)}>
                {/* 다크모드 토글 버튼 */}
                <button
                    {...styleX.props(styles.button)}
                    onClick={toggleTheme}
                    aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    {isDark ? (
                        // 다크모드일 땐 태양 아이콘을 무조건 흰색(#ffffff)으로 띄움
                        <Icon.Sun size='24' color='#ffffff' />
                    ) : (
                        // 라이트모드일 땐 초승달 아이콘 표시
                        <Icon.Moon size='24' color={iconColor} />
                    )}
                </button>

                {/* 홈 또는 프로필 버튼 */}
                {isQuestionPath || isProfilePath ? (
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
        backgroundColor: colors.white, // 다크모드 시 common.stylex에서 알아서 바뀔 것으로 예상
    },
    buttonGroup: {
        gap: '14px',
    },
    button: {
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
    },
});