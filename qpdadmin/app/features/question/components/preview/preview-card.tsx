import { css, useTheme } from '@emotion/react';
import type { Theme } from '~/style/theme';
import type { PropsWithChildren } from 'react';

export function PreviewCard({ children }: PropsWithChildren) {
	const theme = useTheme();
	return <div css={wrap(theme)}>{children}</div>;
}

const wrap = (theme: Theme) => css`
	width: 100%;
	height: 154px;
	padding: 8px;

	border-radius: 8px;
	border: 1px solid ${theme.color.grayScale.gray40};
	background: #fff;
`;
