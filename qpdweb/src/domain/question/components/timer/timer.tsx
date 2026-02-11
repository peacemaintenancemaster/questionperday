import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';
import { Icon } from '~/shared/images';
import { colors, flex, typo } from '~/shared/style/common.stylex';

export const Timer = memo(
	({
		hours,
		minutes,
		seconds,
	}: {
		hours: string;
		minutes: string;
		seconds: string;
	}) => {
		return (
			<div {...stylex.props(styles.timer, flex.vertical)}>
				<Icon.Clock size='20' />
				<span
					{...stylex.props(styles.time, typo['Heading/H3_20∙100_SemiBold'])}>
					{hours} : {minutes} : {seconds}
				</span>
			</div>
		);
	},
);

export const styles = stylex.create({
	timer: {
		gap: 8,
	},
	time: {
		color: colors.main,
	},
});
