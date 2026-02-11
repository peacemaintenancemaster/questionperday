import { css, useTheme } from '@emotion/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useContext } from 'react';
import { QuestionContext } from '~/features/question/context/question';
import { useCalendar } from '~/hooks/useCalendar';
import { Icon } from '~/images';
import type { Theme } from '~/style/theme';
import type { QuestionType } from '~/types/answer/answer';
import { colorVariantMap } from '~/utils/color';

interface Props extends ReturnType<typeof useCalendar> {
	prevDateDisable?: boolean;
}

export function MiniCalendar(props: Props) {
	const { prevDateDisable = false } = props;
	const { state: questionState } = useContext(QuestionContext);
	const theme = useTheme();

	const {
		onClickDay,
		onClickMonth,
		gridDays,
		weekDays,
		currentSelectedDate,
		startOfCurrentMonth,
		endOfCurrentMonth,
	} = props;

	const prevButtonColor = prevDateDisable
		? theme.color.grayScale.gray50
		: theme.color.grayScale.gray90;

	return (
		<div css={wrap(theme)}>
			<header css={header}>
				<p css={headerText(theme)}>
					{format(currentSelectedDate, 'yyyy년 MM월', { locale: ko })}
				</p>

				<div css={arrowButtonWrap}>
					<button onClick={() => onClickMonth(-1)} disabled={prevDateDisable}>
						<Icon.ArrowLeft size='14' color={prevButtonColor} />
					</button>

					<button onClick={() => onClickMonth(+1)}>
						<Icon.ArrowRight size='14' />
					</button>
				</div>
			</header>

			<div css={gridWrap}>
				<div css={weekHeader(theme)}>
					{weekDays.map((day, index) => (
						<div key={index} css={weekDay(theme)}>
							{day}
						</div>
					))}
				</div>

				<div css={calendarGrid}>
					{gridDays.map((date, idx) => {
						const isCurrentMonth =
							date >= startOfCurrentMonth && date <= endOfCurrentMonth;

						const isSameDay =
							currentSelectedDate.toDateString() === date.toDateString();

						const dateString = format(date, 'yyyy-MM-dd');
						const question = questionState[dateString];

						return (
							<div
								key={idx}
								onClick={e => {
									e.stopPropagation();
									onClickDay(date);
								}}
								css={dateWrap(theme)}>
								<button css={dateInner(theme, isSameDay, isCurrentMonth)}>
									{format(date, 'd')}
								</button>

								{question && (
									<div
										css={dot(colorVariantMap[question.type as QuestionType])}
									/>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

const wrap = (theme: Theme) => css`
	width: 100%;
	height: auto;
	background-color: transparent;
	display: flex;
	flex-direction: column;
`;

const header = css`
	width: 100%;
	display: flex;

	justify-content: space-between;
	padding: 16px;
`;

const headerText = (theme: Theme) => css`
	${theme.fontStyles['Caption/lines/Caption1_13∙150_SemiBold_lines']}
	color:  ${theme.color.grayScale.gray90};
`;

const arrowButtonWrap = css`
	display: flex;
	align-items: center;
`;

const gridWrap = css`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 10px;
`;

const weekHeader = (theme: Theme) => css`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	text-align: center;
	background-color: transparent;
`;

const weekDay = (theme: Theme) => css`
	width: 34px;
	height: 30px;
	color: ${theme.color.grayScale.gray80};

	font-weight: bold;
	${theme.fontStyles['Caption/Caption2_12∙100_SemiBold']}
	display: flex;
	justify-content: center;
	align-items: center;
`;

const calendarGrid = css`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-gap: 4px;
`;

const dateWrap = (theme: Theme) => css`
	position: relative;
	display: flex;
	justify-content: center;

	width: 30px;
	height: 38px;
	background-color: transparent;
	text-align: center;
	line-height: 40px;
	border-radius: 4px;
	cursor: pointer;

	&:hover {
		background-color: ${theme.color.grayScale.gray40};
	}
`;

const dateInner = (theme: Theme, isToday: boolean, isCurrentMonth: boolean) => {
	let textColor = theme.color.grayScale.gray90;
	let backgroundColor = 'transparent';

	if (isToday) {
		textColor = theme.color.grayScale.white;
		backgroundColor = theme.color.main;
	} else if (!isCurrentMonth) {
		textColor = theme.color.grayScale.gray50;
		backgroundColor = 'transparent';
	} else {
		textColor = theme.color.grayScale.gray90;
	}

	return css`
		position: absolute;
		top: 0;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background-color: ${backgroundColor};
		${theme.fontStyles['Caption/Caption2_12∙100_SemiBold']};
		color: ${textColor};
	`;
};

const dot = (color: string) => css`
	position: absolute;
	bottom: 5px;
	border-radius: 50%;
	width: 4px;
	height: 4px;
	background-color: ${color};
`;
