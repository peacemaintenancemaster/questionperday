import { css, useTheme, type Interpolation } from '@emotion/react';
import type { Theme } from '~/style/theme';

export function Input(
	props: React.ClassAttributes<HTMLInputElement> &
		React.InputHTMLAttributes<HTMLInputElement> & {
			css?: Interpolation<Theme>;
		},
) {
	const theme = useTheme();
	return <input css={[input(theme), props.css]} {...props} />;
}

const input = (theme: Theme) => css`
	width: 100%;
	padding: 16px 12px;
	border-radius: 10px;
	border: 1px solid ${theme.color.grayScale.gray40};
	height: 50px;
	${theme.fontStyles['Body/Body2_15∙150_Regular']};

	::placeholder {
		${theme.fontStyles['Body/Body2_15∙150_Regular']};
		${theme.color.grayScale.gray80};
	}

	::-webkit-outer-spin-button,
	::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;
