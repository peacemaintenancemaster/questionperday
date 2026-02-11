import { css } from '@emotion/react';
import { theme } from '~/style/theme';

export namespace AddImageButtonStyle {
	export const image = css({
		width: '100%',
		borderRadius: '10px',
	});

	export const imageWrap = css({
		position: 'relative',
		width: '100%s',
	});

	export const editImageButton = css({
		position: 'absolute',
		bottom: '8px',
		right: '8px',
		width: '24px',
		height: '24px',
		backgroundColor: '#fff',
		borderRadius: '50%',
	});

	export const caption14 = css({
		...theme.fontStyles['Caption/Caption1_13∙100_SemiBold'],
		color: theme.color.main,
	});
	export const addImageButton = css({
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		gap: '4px',
		border: `1px dashed ${theme.color.main}`,
		borderRadius: '10px',
		width: '100%',
		height: '100%',
	});
}
