import { css, useTheme, type Interpolation } from '@emotion/react';
import type { PropsWithChildren } from 'react';
import type { Theme } from '~/style/theme';

type Variant = 'default' | 'danger';

type Props = React.ClassAttributes<HTMLButtonElement> &
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		css?: Interpolation<Theme>;
	} & { variant?: Variant };

export function Button(props: PropsWithChildren<Props>) {
	const { children, variant = 'default' } = props;
	const theme = useTheme();

	const variantMap: Record<Variant, string[]> = {
		danger: [theme.color.red.secondary, theme.color.grayScale.white],
		default: [theme.color.main, theme.color.grayScale.white],
	};

	const button = css([
		{
			backgroundColor: variantMap[variant]?.[0],
			color: variantMap[variant]?.[1],
			cursor: 'pointer',
			width: '100%',
			height: '50px',
			borderRadius: '14px',
			transition: 'all 0.2s ease-in-out',
		},
		{
			':disabled': {
				backgroundColor: theme.color.grayScale.gray50,
			},
		},
	]);

	return (
		<button {...props} css={button}>
			{children}
		</button>
	);
}
