import * as stylex from '@stylexjs/stylex';
import { colors } from '~/shared/style/common.stylex';

interface DownloadCardProps {
	question: string;
	answer: string;
}

/**
 * Reuses the same background image (207.png) and text overlay approach
 * from the existing confirm page download logic.
 */
export const AnswerDownloadCard = ({
	question,
	answer,
}: DownloadCardProps) => {
	return (
		<div {...stylex.props(styles.imageWrap)}>
			<img
				src='/image/207.png'
				crossOrigin='anonymous'
				{...stylex.props(styles.image)}
			/>
			<div {...stylex.props(styles.textWrap)}>
				<p {...stylex.props(styles.titleText)}>{question}</p>
				<p {...stylex.props(styles.answerText)}>{answer}</p>
			</div>
		</div>
	);
};

const styles = stylex.create({
	imageWrap: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		position: 'relative',
		flexShrink: 0,
		width: 280,
		height: 388,
	},
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
	},
	textWrap: {
		position: 'absolute',
		display: 'flex',
		flexDirection: 'column',
		gap: 16,
		height: 144,
		padding: 12,
	},
	titleText: {
		color: colors.white,
		fontSize: '16px',
		fontStyle: 'normal',
		fontWeight: 700,
		lineHeight: '150%',
	},
	answerText: {
		color: colors.white,
		fontSize: '13px',
		fontStyle: 'normal',
		fontWeight: 200,
		lineHeight: '150%',
		whiteSpace: 'pre-wrap',
	},
});
