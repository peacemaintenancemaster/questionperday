import { css, useTheme, type Theme } from '@emotion/react';
import type { UseModalReturn } from '~/hooks/useModal';

interface Props {
	modal: UseModalReturn;
	onConfirm: Function;
	onCancel?: () => void;
	text: string;
	confirmText?: string;
	confirmButtonColor?: string;
	cancelText?: string;
	subText?: string;
}

export const ConfirmModal = (props: Props) => {
	const {
		modal,
		onConfirm,
		onCancel,
		confirmButtonColor,
		text,
		subText,
		confirmText = '확인',
		cancelText = '취소',
	} = props;
	const theme = useTheme();

	const onClickConfirm = () => {
		if (onConfirm && typeof onConfirm === 'function') {
			onConfirm();
		}
		modal.close();
	};

	const onClickCancel = () => {
		if (onCancel && typeof onCancel === 'function') {
			onCancel();
		}
		modal.close();
	};

	return (
		<div css={wrapStyle}>
			<div css={modalTextWrapStyle}>
				<pre css={modalTextStyle}>
					<h3 css={title(theme)}>{text}</h3>
				</pre>
				<p css={subTextStyle(theme)}>{subText}</p>
			</div>

			<div css={buttonWrapStyle}>
				<button css={cancelButtonStyle(theme)} onClick={onClickCancel}>
					<p css={actionText(theme, theme.color.grayScale.gray90)}>
						{cancelText}
					</p>
				</button>
				<button
					css={confirmButtonStyle(theme, confirmButtonColor)}
					onClick={onClickConfirm}>
					<p css={actionText(theme, '#fff')}>{confirmText}</p>
				</button>
			</div>
		</div>
	);
};

// 개별 스타일 객체
const wrapStyle = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'space-between',
	width: '340px',
	height: '196px',
	padding: '45px 12px 14px',
	backgroundColor: '#fff',
	borderRadius: '20px',
});

const modalTextWrapStyle = css({
	display: 'flex',
	flexDirection: 'column',
	gap: '8px',
	alignItems: 'center',
	justifyContent: 'center',
	whiteSpace: 'pre',
});

const modalTextStyle = css({
	textAlign: 'center',
});

const subTextStyle = (theme: Theme) =>
	css({
		...theme.fontStyles['Body/lines/Body3_14∙150_Regular_lines'],
		color: theme.color.grayScale.gray80,
	});

const buttonWrapStyle = css({
	display: 'flex',
	gap: '11px',
	alignItems: 'center',
});

const cancelButtonStyle = (theme: Theme) =>
	css({
		width: '152px',
		height: '50px',
		color: theme.color.grayScale.gray90,
		backgroundColor: theme.color.grayScale.gray20,
		borderRadius: '14px',
	});

const confirmButtonStyle = (theme: Theme, color?: string) =>
	css({
		width: '152px',
		height: '50px',
		backgroundColor: color || theme.color.red.secondary,
		borderRadius: '14px',
	});

const title = (theme: Theme) =>
	css({
		...theme.fontStyles['Body/lines/Body3_14∙150_SemiBold_lines'],
		color: theme.color.grayScale.gray90,
	});

const actionText = (theme: Theme, color: string) =>
	css({
		...theme.fontStyles['Body/Body2_15∙100_Bold'],
		color,
	});
