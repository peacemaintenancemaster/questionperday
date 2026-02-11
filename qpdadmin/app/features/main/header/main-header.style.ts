import { css, type Theme } from '@emotion/react';
import { theme } from '~/style/theme';

export namespace MainHeaderStyle {
	export const header = css`
		display: flex;
		position: sticky;
		top: 0;
		justify-content: space-between;
	`;

	export const shadowWrap = css`
		width: 24px;
		height: 24px;
	`;

	export const monthButtonWrap = css`
		display: flex;
		gap: 16px;
		align-items: center;
	`;

	export const monthTextWrap = css`
		display: flex;
		gap: 8px;

		align-items: center;
	`;

	export const monthText = (theme: Theme) => css`
		color: ${theme.color.grayScale.gray90};
		${theme.fontStyles['Heading/H4_18∙100_SemiBold']};
	`;

	export const viewButtonWrap = css`
		display: flex;
		gap: 12px;
	`;

	export const addButtonWrap = css({
		display: 'flex',
		alignItems: 'center',
		gap: '4px',
	});

	export const addText = css({
		...theme.fontStyles['Caption/Caption1_13∙100_SemiBold'],
		color: theme.color.main,
	});

	export const badge = (theme: Theme) => css`
		display: flex;
		padding: 4px 8px;
		background-color: ${theme.color.secondary};
		color: ${theme.color.main};
		border-radius: 4px;
		${theme.fontStyles['Body/Body3_14∙100_SemiBold']};
	`;
}
