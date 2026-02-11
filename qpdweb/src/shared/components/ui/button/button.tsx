import * as stylex from '@stylexjs/stylex';
import { PropsWithChildren } from 'react';
import { Variants } from '~/shared/components/types/variants';
import { colors, typo } from '~/shared/style/common.stylex';

interface Props {
	variants?: Variants;
	style?: stylex.StyleXStyles;
	disabled?: boolean;
	onClick?: () => void;
}

export const Button = (props: PropsWithChildren<Props>) => {
	const {
		variants,
		children,
		disabled = false,
		style = {},
		onClick = () => {},
	} = props;

	return (
		<button
			onClick={onClick}
			{...stylex.props(
				styles[variants as keyof typeof styles],
				typo['Body/Body2_15∙100_Bold'],
				disabled && styles.disabled,
				style,
			)}
			disabled={disabled}>
			{children}
		</button>
	);
};

const styles = stylex.create({
	primary: {
		width: '100%',
		height: 50,
		borderRadius: 14,
		backgroundColor: colors.main,
		color: '#fff',
		transition: 'all 0.4s ease-in-out',
		flexShrink: 0,
	},
	disabled: {
		backgroundColor: colors.gray50,
	},
});
