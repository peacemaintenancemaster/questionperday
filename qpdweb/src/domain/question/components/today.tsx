import * as stylex from '@stylexjs/stylex';
import { flex, colors, typo } from '~/shared/style/common.stylex';

interface Props {
	title: string;
	subText: string;
}

export const TodayQuestion = ({ title = '', subText = '' }: Props) => {
	return (
		<section {...stylex.props(styles.wrap, flex.column)}>
			<span
				{...stylex.props(
					styles.mark,
					typo['Body/lines/Body1_16∙150_SemiBold_lines'],
				)}>
				Q.
			</span>

			<h2
				{...stylex.props(
					styles.title,
					typo['Heading/lines/H1_28∙130_SemiBold_lines'],
				)}>
				{title}
			</h2>

			<p
				{...stylex.props(
					styles.text,
					typo['Body/lines/Body3_14∙150_Regular_lines'],
				)}>
				{subText}
			</p>
		</section>
	);
};

const styles = stylex.create({
	wrap: {
		gap: 12,
		zIndex: 1,
	},
	mark: {
		color: colors.main,
	},
	title: {
		color: colors.gray90,
		paddingTop: 4,
	},
	text: {
		color: colors.gray80,
	},
});
