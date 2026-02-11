import * as stylex from '@stylexjs/stylex';
import { ReactNode } from 'react';
import { colors, flex, typo } from '~/shared/style/common.stylex';

interface Props {
	icon: ReactNode;
	text: string;
}

export const BaseSnackbar = (props: Props) => {
	const { icon, text } = props;
	return (
		<article {...stylex.props(styles.wrap, flex.vertical)}>
			<span>{icon}</span>

			<p
				{...stylex.props(
					typo['Caption/Caption1_13∙100_SemiBold'],
					styles.white,
				)}>
				{text}
			</p>
		</article>
	);
};

const styles = stylex.create({
	wrap: {
		width: 195,
		height: 48,
		borderRadius: 14,
		padding: '16px 12px',
		backgroundColor: 'rgba(37, 37, 37, 0.80)',
		gap: 8,
	},
	icon: {
		width: 16,
		height: 16,
	},
	white: {
		color: colors.white,
	},
});
