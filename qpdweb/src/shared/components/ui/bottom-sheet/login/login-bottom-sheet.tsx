import * as stylex from '@stylexjs/stylex';
import { Icon } from '~/shared/images';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { Button } from '../../button/button';
import { useKaKao } from '~/shared/hooks/useKaKao';
import { saveNavigationState } from '~/shared/hooks/useNavigationRestore';
import { useLocation } from '@tanstack/react-router';
import { useUserStore } from '~/domain/user/store';

export const LoginBottomSheet = () => {
	const { kakaoLogin } = useKaKao();
	const { isLogin } = useUserStore();
	const location = useLocation();

	const onClickKakaoLogin = () => {
		saveNavigationState(location);

		setTimeout(() => kakaoLogin(), 100);
	};

	if (isLogin) return <></>;

	return (
		<section {...stylex.props(styles.wrap, flex.column)}>
			<div {...stylex.props(styles.top, flex.column)}>
				<Icon.Person color={colors.gray90} size='24' />

				<h3
					{...stylex.props(
						styles.title,
						typo['Heading/lines/H3_20∙130_SemiBold_lines'],
					)}>
					로그인하면 나의 답변이 차곡차곡 기록돼요!
				</h3>
			</div>

			<div {...stylex.props(styles.bottom, flex.column)}>
				<Button
					style={[styles.kakao, flex.between, flex.vertical]}
					onClick={onClickKakaoLogin}>
					<Icon.Talk size='20' color={colors.gray90} />
					카카오로 간편 로그인
					<div {...stylex.props(styles.shadow)} />
				</Button>
			</div>
		</section>
	);
};

const styles = stylex.create({
	wrap: {
		width: '100%',
		maxWidth: 600,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: '#fff',
		padding: '32px 18px 10px',
		gap: 34,
	},
	top: {
		width: '100%',
		height: 84,
		gap: 8,
	},
	title: {
		width: '80%',
		color: colors.gray90,
		whiteSpace: 'pre-line',
		wordBreak: 'break-all',
	},
	bottom: {
		gap: 16,
	},
	kakao: {
		backgroundColor: '#FEE500',
		color: colors.gray90,
		padding: 16,
		borderRadius: 14,
	},
	shadow: {},
	email: {
		padding: 16,
		backgroundColor: colors.white,
		border: `1px solid ${colors.gray50}`,
		borderRadius: 14,
	},
});
