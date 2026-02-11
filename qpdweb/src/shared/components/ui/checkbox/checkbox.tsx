import * as stylex from '@stylexjs/stylex';
import { Icon } from '~/shared/images';
import { colors, flex } from '~/shared/style/common.stylex';

interface Props {
	isChecked: boolean;
	onClick?: () => void;
}

export const CheckBox = (props: Props) => {
	const { onClick: _onClick, isChecked } = props;

	const onClick = () => {
		if (typeof _onClick === 'function') {
			_onClick();
		}
	};

	return (
		<button
			{...stylex.props(
				styles.wrap,
				!isChecked && styles.border,
				isChecked && styles.background,
				flex.center,
			)}
			onClick={onClick}>
			<Icon.Check />
		</button>
	);
};

const styles = stylex.create({
	wrap: {
		width: 16,
		height: 16,
		borderRadius: '4px',
		overflow: 'hidden',
		transition: 'all 0.3s ease-in-out',
	},
	border: {
		border: `1px solid ${colors.gray40}`,
	},
	background: {
		backgroundColor: colors.main,
	},
});
