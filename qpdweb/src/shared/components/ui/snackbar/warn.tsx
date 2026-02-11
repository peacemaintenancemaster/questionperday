import { Icon } from '~/shared/images';
import { BaseSnackbar } from './base';
import { colors } from '~/shared/style/common.stylex';

export const WarnSnackbar = ({ text }: { text: string }) => {
	return (
		<BaseSnackbar
			icon={<Icon.Warn size='14' color={colors.redSecondary} />}
			text={text}
		/>
	);
};
