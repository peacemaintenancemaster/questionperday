import { css, useTheme } from '@emotion/react';
import type { Theme } from '~/style/theme';
import { statusTextMap, type QuestionType } from '~/types/answer/answer';
import { getBadgeColor } from '~/utils/color';

interface Props {
	type: QuestionType;
}

export function Badge({ type }: Props) {
	const theme = useTheme();
	const colorArr = getBadgeColor(type, theme);
	const text = statusTextMap[type];

	return <div css={wrap(colorArr, theme)}>{text}</div>;
}

const wrap = (colorArr: string[], theme: Theme) => css`
	display: flex;
	justify-content: center;
	align-items: center;
	width: fit-content;
	white-space: nowrap;
	height: 20px;
	padding: 4px;
	background-color: ${colorArr[0]};
	color: ${colorArr[1]};
	border-radius: 4px;

	${theme.fontStyles['Caption/Caption2_12∙100_SemiBold']};
`;
