import { AddLabelStyle as styles } from './label.style';

interface Props {
	text: string;
	isRequired?: boolean;
}

export const AddAdminLabel = ({ text, isRequired }: Props) => {
	return (
		<label css={styles.label}>
			{text} {Boolean(isRequired) && <span css={styles.requiredSpan}>*</span>}
		</label>
	);
};
