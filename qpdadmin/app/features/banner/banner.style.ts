import { css } from '@emotion/react';
import { theme } from '~/style/theme';

export namespace BannerStyle {
	export const wrap = css({});

	export const header = css({
		display: 'flex',
		width: '894px',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: '20px',
	});

	export const headerLeftWrap = css({
		display: 'flex',
		gap: 12,
		alignItems: 'center',
	});

	export const headerLeftText = css({
		...theme.fontStyles['Caption/Caption1_13∙100_SemiBold'],
		color: theme.color.grayScale.gray80,
	});

	export const addText = css({
		...theme.fontStyles['Caption/Caption1_13∙100_SemiBold'],
		color: theme.color.main,
	});

	export const tableWrap = css({
		width: '894px',
		display: 'flex',
		flexDirection: 'column',
		padding: '0 40px',
	});
}
