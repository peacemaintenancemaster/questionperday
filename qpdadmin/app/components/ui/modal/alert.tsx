import { css } from '@emotion/react';
import type { Theme } from 'node_modules/@emotion/react/dist/declarations/src';
import type { UseModalPortalReturn } from '~/hooks/useModal';

interface Props {
	modal: UseModalPortalReturn;
	text: string;
	onClickConfirm?: () => void;
}

export const AlertModal = (props: Props) => {
	const { modal, text, onClickConfirm } = props;

	const onClickConfirmButton = () => {
		if (onClickConfirm && typeof onClickConfirm === 'function') {
			onClickConfirm();
		}

		modal.close();
	};

	return (
		<div css={wrapStyle}>
			<div css={modalTextWrapStyle}>
				<p css={modalTextStyle}>{text}</p>
			</div>

			<div css={buttonWrapStyle}>
				<button css={confirmButtonStyle} onClick={onClickConfirmButton}>
					확인
				</button>
			</div>
		</div>
	);
};

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
	gap: '2px',
	justifyContent: 'center',

	whiteSpace: 'pre',
});

const modalTextStyle = (theme: Theme) =>
	css({
		fontSize: '14px',
		fontWeight: 600,
		color: theme.color.grayScale.gray90,
		textAlign: 'center',
	});

const buttonWrapStyle = css({
	display: 'flex',
	gap: '11px',
	alignItems: 'center',
	width: '100%',
});

const confirmButtonStyle = (theme: Theme) =>
	css({
		width: '100%',
		height: '50px',

		color: '#fff',

		backgroundColor: theme.color.main,
		borderRadius: '14px',
	});
