import stylex from '@stylexjs/stylex';
import { ChangeEventHandler, Fragment } from 'react';
import { CheckBox } from '~/shared/components/ui/checkbox/checkbox';
import { flex, typo, colors } from '~/shared/style/common.stylex';
import { AnswerTimer } from '../../timer/answer-timer';
import { QuestionSchema } from '~/domain/question/schema';

interface Props {
	answer: string;
	isShared: boolean;
	onChangeTextArea: ChangeEventHandler<HTMLTextAreaElement>;
	onClickWatchAlone: () => void;
	question: QuestionSchema | undefined;
}

export const AnswerWriteStep = ({
	answer,
	isShared,
	question,
	onChangeTextArea,
	onClickWatchAlone,
}: Props) => {
	const isAnswerMax = answer.length >= 200;

	return (
		<Fragment>
			<section {...stylex.props(styles.titleWrap, flex.column)}>
				<div {...stylex.props(styles.timerWrap, flex.between, flex.vertical)}>
					<span
						{...stylex.props(
							styles.primaryText,
							typo['Body/Body1_16∙100_SemiBold'],
						)}>
						Q.
					</span>

					<AnswerTimer timeAt={question?.timeAt} />
				</div>

				<h2
					{...stylex.props(
						styles.question,
						typo['Heading/lines/H1_28∙130_SemiBold_lines'],
					)}>
					{question?.title}
				</h2>
			</section>

			<div {...stylex.props(styles.textCountWrap, flex.end, flex.vertical)}>
				<span
					{...stylex.props(
						styles.grayText,
						!!answer && styles.primaryText,
						isAnswerMax && styles.redText,
						typo['Caption/Caption1_13∙100_Regular'],
					)}>
					({answer.length}/200)
				</span>
			</div>

			<textarea
				{...stylex.props(
					styles.textarea,
					typo['Body/lines/Body3_14∙150_Regular_lines'],
				)}
				maxLength={200}
				onChange={onChangeTextArea}
			/>

			<div
				{...stylex.props(styles.watchAlone, flex.start)}
				onClick={onClickWatchAlone}>
				<CheckBox isChecked={!isShared} />

				<div {...stylex.props(flex.column, styles.gap8)}>
					<p
						{...stylex.props(
							typo['Caption/Caption1_13∙100_SemiBold'],
							styles.hightedGray,
						)}>
						혼자보는 답변으로 등록하기
					</p>

					<p
						{...stylex.props(
							typo['Caption/Caption1_13∙100_Regular'],
							styles.grayText,
						)}>
						체크하면 다음 뉴스레터에 실리지 않아요.
					</p>
				</div>
			</div>
		</Fragment>
	);
};

const opacity = stylex.keyframes({
	'0%': {
		opacity: 0,
	},
	'50%': {
		opacity: 0.8,
	},
	'100%': {
		opacity: 1,
	},
});

const styles = stylex.create({
	wrap: {
		backgroundColor: '#fff',
		display: 'flex',
		padding: '24px 18px',
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		flex: 1,
	},
	timerWrap: {
		width: '100%',
	},
	primaryText: {
		color: colors.main,
	},
	question: {
		color: colors.gray90,
	},
	titleWrap: {
		width: '100%',
		backgroundColor: colors.white,
		animationName: opacity,
		animationDuration: '1.1s',
		animationTimingFunction: 'ease-in-out',
		animationFillMode: 'forwards',
		gap: 16,
	},
	clockWrap: {
		padding: '2px',
		gap: '4px',
		backgroundColor: colors.secondary,
		borderRadius: '4px',
	},
	textCountWrap: {
		color: colors.white,
		padding: '20px 8px',
	},
	grayText: {
		color: colors.gray70,
	},
	redText: {
		color: colors.redPrimary,
	},
	textarea: {
		width: '100%',
		height: '100%',
		borderTop: `1px solid ${colors.gray40}`,
		borderBottom: `1px solid ${colors.gray40}`,
		resize: 'none',
		borderLeft: 'none',
		borderRight: 'none',
		padding: '12px 0',
	},
	watchAlone: {
		width: '100%',
		padding: '12px 8px',
		borderRadius: '8px',
		border: `1px solid ${colors.gray40}`,
		height: '58px',
		gap: 8,
		marginTop: 12,
	},
	buttonWrap: {
		marginTop: '45px',
		width: '100%',
	},
	hightedGray: {
		color: colors.gray80,
	},
	gap8: {
		gap: 8,
	},
});
