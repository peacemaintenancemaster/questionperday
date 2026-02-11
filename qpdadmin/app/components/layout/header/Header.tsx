import { css, useTheme } from '@emotion/react';
import React from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '~/features/auth/context/auth';
import { Icon } from '~/images';
import type { Theme } from '~/style/theme';

export function Header() {
	const { state, dispatch } = React.useContext(AuthContext);
	const { isAuthenticated } = state;
	const { color, fontStyles } = useTheme();
	const navigate = useNavigate();

	function onClickLogout() {
		dispatch({ type: 'LOGOUT' });
		navigate('/login');
	}

	const textStyle = css([
		{ color: color.main },
		fontStyles['Caption/Caption1_13∙100_SemiBold'],
	]);

	return (
		<header css={wrap(isAuthenticated, color)}>
			<Icon.Logo size='74' height='23' />

			{isAuthenticated && (
				<button css={textStyle} onClick={onClickLogout}>
					로그아웃
				</button>
			)}
		</header>
	);
}

const wrap = (isAuthenticated: boolean, color: Theme['color']) => css`
	position: sticky;
	top: 0;
	display: flex;
	justify-content: space-between;
	height: 80px;
	padding: 28px 40px;
	border-bottom: ${isAuthenticated && `1px solid ${color.grayScale.gray40}`};
	background-color: #fff;
	z-index: 1;
`;
