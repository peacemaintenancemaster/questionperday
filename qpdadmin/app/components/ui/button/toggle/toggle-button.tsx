import { memo } from 'react';
import { css } from '@emotion/react';

interface StyledProps {
	color?: string;
}
interface SwitchProps extends StyledProps {
	isOn: boolean;
	onClickToggle: () => void;
	text?: string;
	textStyles?: StyledProps;
}
export const ToggleSwitch = memo((props: SwitchProps) => {
	const { isOn, onClickToggle, text, textStyles } = props;

	return (
		<div css={switchWrapStyle}>
			<span css={switchSpanStyle(textStyles)}>{text ? text : null}</span>
			<div
				css={switchBoxStyle(isOn)}
				onClick={e => {
					e.stopPropagation();
					onClickToggle();
				}}>
				<span css={switchBtnSpanStyle(isOn)} />
			</div>
		</div>
	);
});

const switchWrapStyle = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	boxSizing: 'border-box',
	width: 'auto',
	height: '22px',
	'& > label:active > span': {
		width: '25px',
	},
});

const switchSpanStyle = ({ color }: StyledProps = {}) =>
	css({
		cursor: 'pointer',
		marginRight: '4px',
		fontSize: '13px',
		fontWeight: 400,
		lineHeight: '19px',
		color: color ? color : '#000',
	});

const switchBoxStyle = (isOn: boolean) =>
	css({
		cursor: 'pointer',
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		boxSizing: 'border-box',
		width: '41px',
		height: '20px',
		background: isOn ? '#00CE7C' : '#BCBCBC',
		borderRadius: '10px',
		transition: 'background-color 0.2s ease-out',
		'&:active & > span': {
			width: '60px',
		},
	});

const switchBtnSpanStyle = (isOn: boolean) =>
	css({
		content: "''",
		position: 'absolute',
		top: 0,
		left: isOn ? '21px' : '0',
		boxSizing: 'border-box',
		width: '20px',
		height: '20px',
		background: '#f8f8f8',
		border: '1px solid #f2f2f2',
		borderRadius: '22px',
		boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
		transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
	});
