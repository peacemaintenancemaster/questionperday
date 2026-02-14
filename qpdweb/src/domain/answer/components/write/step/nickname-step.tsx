import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { AnswerTimer } from '../../timer/answer-timer';
import { ChangeEventHandler } from 'react';

interface Props {
	onChangeNickname: ChangeEventHandler<HTMLInputElement>;
	nickname: string;
	needPhone?: boolean;
	onChangePhone?: ChangeEventHandler<HTMLInputElement>;
	phone?: string;
}

export const AnswerNicknameStep = (props: Props) => {
	const { onChangeNickname, nickname, needPhone, onChangePhone, phone } = props;

	return (
		<section {...stylex.props(styles.wrap, flex.column)}>
			<div {...stylex.props(styles.titleWrap, flex.between, flex.vertical)}>
				<p
					{...stylex.props(
						styles.primaryColor,
						typo['Body/Body1_16∙100_SemiBold'],
					)}>
					내일의 뉴스레터에 활용됩니다!
				</p>

				<AnswerTimer />
			</div>
			<p
				{...stylex.props(
					styles.title,
					typo['Heading/lines/H1_28∙130_SemiBold_lines'],
				)}>
				적어주신 답변과 어울리는 닉네임을 정해주세요.
			</p>

			<p
				{...stylex.props(
					styles.subTitle,
					typo['Body/lines/Body3_14∙150_Regular_lines'],
				)}>
				입력하지 않을 시 랜덤 닉네임으로 발행됩니다.
			</p>

			<input
				{...stylex.props(styles.input, typo['Body/Body2_15∙100_Regular'])}
				placeholder='여행하는 윌리'
				value={nickname}
				onChange={onChangeNickname}
			/>

			{needPhone && (
				<>
					<p
						{...stylex.props(
							styles.subTitle,
							typo['Body/lines/Body3_14∙150_Regular_lines'],
							styles.fieldMargin,
						)}>
						연락처를 남겨주시면 소정의 선물을 드립니다. (선택)
					</p>

					<input
						{...stylex.props(styles.input, typo['Body/Body2_15∙100_Regular'])}
						placeholder='-를 제외한 숫자만 입력'
						value={phone}
						onChange={onChangePhone}
						type='tel'
					/>
				</>
			)}
		</section>
	);
};

const styles = stylex.create({
	wrap: {
		gap: 12,
		height: '100%',
	},
	titleWrap: {
		width: '100%',
	},
	primaryColor: {
		color: colors.main,
	},
	title: {
		paddingTop: 4,
		color: colors.gray90,
		width: '50%',
	},
	subTitle: {
		color: colors.gray80,
	},
	input: {
		width: '100%',
		height: 47,
		padding: '16px 12px',
		borderRadius: 10,
		border: `1px solid ${colors.gray40}`,
	},
	fieldMargin: {
		marginTop: 12,
	},
});
