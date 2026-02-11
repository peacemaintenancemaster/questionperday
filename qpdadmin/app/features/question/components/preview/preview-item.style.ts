import { css, type Theme } from '@emotion/react';

export namespace PreviewItemStyle {
	export const wrap = css`
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
		height: 100%;

		border-radius: 8px;
		overflow: hidden;
	`;

	export const itemHeader = css({
		display: 'flex',
		width: '100%',
		justifyContent: 'space-between',
	});

	export const contentWrap = css`
		display: flex;
		flex-direction: column;
		gap: 4px;

		width: 100%;
		height: 100%;

		padding: 4px;
	`;

	export const titleText = (theme: Theme, isEllipsis: boolean) => css`
		color: ${theme.color.grayScale.gray90};
		${theme.fontStyles['Caption/lines/Caption1_13∙150_SemiBold_lines']};

		${isEllipsis &&
		`white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;`}
	`;

	export const contentText = (theme: Theme, isEllipsis: boolean) => css`
		color: ${theme.color.grayScale.gray80};
		${theme.fontStyles['Caption/Caption2_12∙100_Regular']};

		${isEllipsis &&
		css`
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		`}
	`;

	export const timeTextWrap = css`
		display: flex;
		align-items: center;
		padding-top: 4px;
		gap: 4px;
	`;

	export const timeText = (theme: Theme, color: string) => css`
		color: ${color};
		${theme.fontStyles['Caption/Caption1_13∙100_Regular']};
	`;

	export const answerCountWrap = (theme: Theme) =>
		css({
			width: '100%',
			height: '28px',
			borderRadius: '8px',
			border: `1px solid ${theme.color.grayScale.gray40}`,
			backgroundColor: `${theme.color.grayScale.gray20}`,
			display: 'flex',
			justifyContent: 'space-between',
			padding: '8px',
		});

	export const dot = (theme: Theme) =>
		css({
			width: '4px',
			height: '4px',
			borderRadius: '50%',
			background: `${theme.color.red.secondary}`,
		});

	export const answerCountLeftWrap = css({
		display: 'flex',
		alignItems: 'center',
		gap: '4px',
	});

	export const answerCountText = (theme: Theme) => {
		return css({
			...theme.fontStyles['Caption/Caption2_12∙100_SemiBold'],
			color: theme.color?.grayScale?.gray90,
		});
	};
}
