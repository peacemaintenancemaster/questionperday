import { css } from '@emotion/react';
import { theme } from '~/style/theme';

export namespace AnswerListStyle {
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
		padding: '12px 8px',
		textAlign: 'left',
		fontWeight: 600,
		whiteSpace: 'nowrap',
	});

	export const tableCell = css({
		padding: '12px 8px',
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

	export const textCell = css({
		...theme.fontStyles['Body/lines/Body3_14∙150_Regular_lines'],
	});

	export const timeCell = css({
		...theme.fontStyles['Body/lines/Body3_14∙150_Regular_lines'],
	});

	export const titleCell = css({
		...theme.fontStyles['Body/lines/Body3_14∙150_Regular_lines'],
		maxWidth: '370px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	});

	export const subTextCell = css({
		...theme.fontStyles['Body/lines/Body3_14∙150_Regular_lines'],
		maxWidth: '470px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	});

	export const actionButton = css({
		...theme.fontStyles['Body/lines/Body3_14∙150_Regular_lines'],
	});

	export const deleteButton = css({
		...theme.fontStyles['Caption/Caption1_13∙100_SemiBold'],
		color: theme.color.red.secondary,
	});

	export const emptyCell = css({
		padding: '48px 16px',
		textAlign: 'center',
		color: '#6c757d',
		fontSize: '16px',
	});
}
