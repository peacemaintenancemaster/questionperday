import { css, ThemeContext } from '@emotion/react';
import { answerSchema } from '~/features/answer/schema/answer';
import { theme } from '~/style/theme';

export namespace AddSidebarStyle {
	export const wrap = css({
		width: '528px',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		padding: '0 18px 40px 18px',
		backgroundColor: '#fff',
		borderRadius: '20px 0px 0px 0px',
		marginTop: '20px',
		boxShadow: '-4px 0px 20px 0px rgba(25, 25, 25, 0.10)',
	});

	export const header = css({
		display: 'flex',
		alignItems: 'center',
		gap: '12px',
		padding: '16px 0',
		height: '56px',
	});

	export const body = css({
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		gap: '24px',
		padding: '0',
	});

	export const row = css({
		display: 'flex',
		flexDirection: 'column',
		gap: '4px',
	});

	export const inputWrap = css({
		position: 'relative',
	});

	export const showWrap = css({
		top: '16px',
		right: '12px',
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	});

	export const input = css({
		width: '100%',
		padding: '16px 12px',
		height: '50px',
		borderRadius: '10px',
		border: `1px solid ${theme.color.grayScale.gray40}`,
	});

	export const button = css({
		width: '100%',
		height: '50px',
		borderRadius: '14px',
		padding: '12px 16px',
		justifyContent: 'center',
		alignItems: 'center',
		...theme.fontStyles['Body/Body2_15∙100_Bold'],
		color: '#fff',
		background: theme.color.main,

		':disabled': {
			background: theme.color.grayScale.gray50,
		},
	});
}
