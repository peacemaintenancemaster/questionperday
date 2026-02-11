import { css, type Theme } from '@emotion/react';

export namespace SidebarStyle {
	export const wrap = css({
		width: '100%',
		height: '100%',
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		gap: '16px',
	});

	export const header = css({
		width: '100%',
		padding: '16px 18px',
		height: '56px',
	});

	export const form = css({
		width: '100%',
		padding: '0 40px 0 18px',
		display: 'flex',
		flexDirection: 'column',
		gap: '24px',
		flex: 1,
		overflowY: 'scroll',
		paddingBottom: '120px',
		scrollbarWidth: 'none',
	});

	export const row = css({
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		gap: '4px',
	});

	export const label = (theme: Theme) => {
		return css({
			...theme.fontStyles['Caption/Caption1_13∙150_SemiBold'],
			color: theme.color.grayScale.gray80,
		});
	};

	export const dateInput = (theme: Theme) =>
		css({
			...theme.fontStyles['Body/Body3_14∙100_Regular'],
			height: '30px',
			backgroundColor: theme.color.grayScale.gray20,
			color: theme.color.main,
		});

	export const inputWrap = css({
		position: 'relative',
	});

	export const dateButton = (theme: Theme) =>
		css({
			...theme.fontStyles['Caption/Caption1_13∙100_SemiBold'],
			backgroundColor: 'transparent',
			color: theme.color.main,
			position: 'absolute',
			top: '8px',
			right: '12px',
			transition: 'all 0.2s ease-out',
		});

	export const calendarWrap = (theme: Theme) =>
		css({
			position: 'absolute',
			top: '30px',
			right: '0',
			width: '280px',
			height: '381px',
			borderRadius: '20px',
			display: 'flex',
			border: `1px solid ${theme.color.grayScale.gray40}`,
			flexDirection: 'column',
			transition: 'all 0.2s ease-out',
			gap: '18px',
			background: '#fff',
			zIndex: 1,
		});

	export const buttonGroup = css({
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end',
		alignSelf: 'flex-end',
		gap: '12px',
		padding: '0 16px 16px 0',
	});

	export const button = css({
		width: '55px',
		height: '29px',
		borderRadius: '10px',
		padding: '8px 16px',
	});

	export const text = (theme: Theme) =>
		css({
			...theme.fontStyles['Caption/Caption1_13∙100_SemiBold'],
		});

	export const cancelButton = (theme: Theme) =>
		css([
			button,
			{
				transition: 'all 0.2s ease-out',
				backgroundColor: theme.color.grayScale.gray20,
			},
		]);

	export const cancelButtonText = (theme: Theme) =>
		css([
			text(theme),
			{ transition: 'all 0.2s ease-out', color: theme.color.grayScale.gray90 },
		]);

	export const confirmButton = (theme: Theme) =>
		css([
			button,
			{
				width: '81px',
				transition: 'all 0.2s ease-out',
				backgroundColor: theme.color.main,
			},
		]);

	export const confirmButtonText = (theme: Theme) => css([text(theme)]);

	export const textarea = (theme: Theme) =>
		css({
			padding: '16px 12px',
			width: '100%',
			height: '78px',
			borderRadius: '10px',
			border: `1px solid ${theme.color.grayScale.gray50}`,
			...theme.fontStyles['Body/lines/Body2_15∙150_Regular_lines'],
			resize: 'none',
			lineHeight: '150%',
		});

	export const timeWrap = css({
		display: 'flex',
		gap: '12px',
	});

	export const timeLabelWrap = css({
		display: 'flex',
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
	});

	export const timeInput = (theme: Theme) =>
		css({
			width: '100%',
			padding: '8px 12px',
			height: '31px',
			borderRadius: '8px',
			border: `1px solid ${theme.color.grayScale.gray40}`,
			...theme.fontStyles['Body/Body2_15∙100_Regular'],
			color: theme.color.grayScale.gray80,
		});

	export const timeInputWrap = css({
		position: 'relative',
		width: '100%',
	});

	export const timeText = (theme: Theme) =>
		css({
			position: 'absolute',
			top: '8px',
			right: '12px',
			color: theme.color.grayScale.gray80,
			...theme.fontStyles['Caption/Caption1_13∙100_Regular'],
		});

	export const toggleRowWrap = css({
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
	});

	export const toggleRow = (theme: Theme) =>
		css({
			...theme.flex.row,
			justifyContent: 'space-between',
			width: '100%',
			gap: '12px',
			padding: '8px 12px',
			borderRadius: '8px',
			backgroundColor: theme.color.grayScale.gray20,
			height: '34px',
		});

	export const toggleText = (theme: Theme) =>
		css({
			...theme.fontStyles['Body/Body3_14∙100_Regular'],
			color: theme.color.grayScale.gray90,
		});

	export const footerButtonGroup = css({
		position: 'sticky',
		bottom: '20px',
		width: '100%',
		display: 'flex',
		gap: '12px',
		height: '80px',
		padding: '20px 40px 20px 18px',
		backgroundColor: '#fff',
		zIndex: 1001,
	});

	export const footerButton = (theme: Theme) =>
		css({
			width: '100%',
			height: '50px',
			borderRadius: '14px',

			...theme.fontStyles['Body/Body2_15∙100_Bold'],

			':disabled': {
				backgroundColor: theme.color.grayScale.gray50,
				color: '#fff',
			},
		});
}
