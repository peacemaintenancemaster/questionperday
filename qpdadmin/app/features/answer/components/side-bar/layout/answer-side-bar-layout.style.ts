import { css } from '@emotion/react';

export namespace AnswerSidebarStyle {
	export const wrap = css({
		width: '1277px',
		height: 'calc(100%)',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#fff',
		borderRadius: '20px 0px 0px 0px',
		marginTop: '20px',
		boxShadow: '-4px 0px 20px 0px rgba(25, 25, 25, 0.10)',
	});

	export const header = css({
		display: 'flex',
		alignItems: 'center',
		gap: '12px',
		padding: '16px 18px',
		height: '56px',
	});

	export const body = css({
		padding: '0 18px 48px',
		overflowY: 'scroll',
		'::webkit-scrollbar': {
			display: 'none',
		},
	});
}
