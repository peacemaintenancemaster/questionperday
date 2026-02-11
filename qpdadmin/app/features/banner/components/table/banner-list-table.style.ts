import { css } from '@emotion/react';
import { theme } from '~/style/theme';

export namespace BannerListTableStyle {
	export const wrap = css({
		display: 'flex',
		flexDirection: 'column',
		// padding: '0 40px',
		width: '894px',
	});

	export const header = css({
		display: 'flex',
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

	export const container = css({
		width: '100%',
		overflowX: 'auto',
		backgroundColor: '#fff',
		marginTop: '24px',
	});

	export const table = css({
		width: '100%',
		borderCollapse: 'collapse',
		fontSize: '14px',
	});

	export const tableHead = css({
		backgroundColor: theme.color.grayScale.gray40,
		color: theme.color.grayScale.gray80,
		fontSize: '13px',
		fontWeight: 600,
		lineHeight: '100%',
	});

	export const tableBody = css({
		backgroundColor: '#fff',
	});

	export const tableRow = css({
		borderBottom: '1px solid #e9ecef',
		transition: 'background-color 0.2s',

		':hover': {
			backgroundColor: theme.color.secondary,
		},

		'&:last-child': {
			borderBottom: 'none',
		},
	});

	export const tableHeader = css({
		padding: '12px',
		textAlign: 'left',
		fontWeight: 600,
		whiteSpace: 'nowrap',
	});

	export const tableCell = css({
		padding: '12px 8px',
		color: '#212529',
		verticalAlign: 'middle',
	});

	export const statusCell = (status: string) =>
		css({
			display: 'inline-block',
			padding: '4px 12px',
			borderRadius: '4px',
			fontSize: '12px',
			fontWeight: 500,
			backgroundColor: status === 'active' ? '#d4edda' : '#f8d7da',
			color: status === 'active' ? '#155724' : '#721c24',
		});

	export const dateCell = css({
		...theme.fontStyles['Body/lines/Body3_14∙150_Regular_lines'],
	});

	export const textCell = css({
		...theme.fontStyles['Body/lines/Body3_14∙150_Regular_lines'],
	});

	export const imagePreview = css({
		width: '223px',
		height: '75px',
		borderRadius: '14px',
		objectFit: 'cover',
	});

	export const linkText = css({
		color: theme.color.main,
		cursor: 'pointer',
		textDecoration: 'underline',
	});
}
