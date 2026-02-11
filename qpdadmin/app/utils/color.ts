import type { Theme } from '@emotion/react';
import { theme } from '~/style/theme';
import type { QuestionType } from '~/types/answer/answer';

export function getBadgeColor(type: QuestionType, theme: Theme) {
	const variantMap: Record<QuestionType, string[]> = {
		previous: [theme.color.grayScale.gray20, theme.color.grayScale.gray70],
		temp: [theme.color.yellow.sub03, theme.color.yellow.primary],
		saved: [theme.color.secondary, theme.color.main],
	};

	return variantMap[type];
}

export const colorVariantMap: Record<QuestionType, string> = {
	temp: theme.color.yellow.primary,
	saved: theme.color.main,
	previous: theme.color.grayScale.gray70,
};
