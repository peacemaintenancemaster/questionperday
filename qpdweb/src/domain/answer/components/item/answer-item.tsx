import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { Question } from '../../api';
import type { Memo } from '~/shared/store/mock-data';
import { Icon } from '~/shared/images';

interface Props {
	questionData: Question | undefined;
	latestMemo?: Memo;
	showBookmark?: boolean;
	bookmarkActive?: boolean;
	onClick?: () => void;
	onDownload?: (e: React.MouseEvent) => void;
}

export const AnswerItem = ({
	questionData,
	latestMemo,
	showBookmark = false,
	bookmarkActive = false,
	onClick,
	onDownload,
}: Props) => {
	if (!questionData) return null;

	return (
		<div
			data-answer-card
			{...stylex.props(styles.base, flex.column, onClick && styles.clickable)}
			onClick={onClick}>
			<div
				{...stylex.props(styles.questionMarkWrap, flex.between, flex.vertical)}>
				<p
					{...stylex.props(
						typo['Body/Body1_16∙100_SemiBold'],
						styles.mainColor,
					)}>
					Q.
				</p>
			</div>

			<div {...stylex.props(styles.textWrap, flex.column)}>
				<p data-answer-title {...stylex.props(typo['Body/lines/Body3_14∙150_SemiBold_lines'])}>
					{questionData?.title}
				</p>

				<p
					data-answer-text
					{...stylex.props(
						typo['Body/lines/Body3_14∙150_Regular_lines'],
						styles.gray80,
					)}>
					{questionData?.answerList[0]?.text}
				</p>
			</div>

			{latestMemo && (
				<div {...stylex.props(styles.memoSection, flex.column)}>
					<span
						data-memo-tag
						{...stylex.props(
							styles.memoTag,
							typo['Caption/Caption2_12∙100_SemiBold'],
						)}>
						{'추가한 메모'}
					</span>
					<p
						data-answer-text
						{...stylex.props(
							typo['Body/lines/Body3_14∙150_Regular_lines'],
							styles.gray80,
						)}>
						{latestMemo.text}
					</p>
				</div>
			)}

			<div {...stylex.props(styles.footer, flex.between, flex.vertical)}>
				<p
					{...stylex.props(
						typo['Caption/Caption1_13∙100_SemiBold'],
						styles.mainColor,
					)}>
					{questionData?.dateAt?.replace(/-/g, '.')}
				</p>

				<button
					{...stylex.props(styles.downloadBtn)}
					onClick={e => {
						e.stopPropagation();
						onDownload?.(e);
					}}>
					<Icon.Download size='18' color='#9a9a9a' />
				</button>
			</div>
		</div>
	);
};

const styles = stylex.create({
	base: {
		width: '100%',
		padding: '16px',
		border: `1px solid ${colors.main}`,
		borderRadius: 14,
	},
	clickable: {
		cursor: 'pointer',
	},
	titleWrap: {
		marginBottom: 4,
	},
	questionMarkWrap: {
		marginBottom: 12,
	},
	textWrap: {
		gap: 8,
	},
	mainColor: {
		color: colors.main,
	},
	gray80: {
		color: colors.gray80,
	},
	memoSection: {
		marginTop: 12,
		gap: 6,
	},
	memoTag: {
		display: 'inline-flex',
		alignSelf: 'flex-start',
		padding: '3px 8px',
		borderRadius: 4,
		backgroundColor: colors.secondary,
		color: colors.main,
	},
	footer: {
		marginTop: 12,
	},
	downloadBtn: {
		padding: 4,
		cursor: 'pointer',
	},
	bookmarkIcon: {
		padding: 2,
	},
});
