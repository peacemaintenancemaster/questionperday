import { css } from '@emotion/react';
import { theme } from '~/style/theme';

export namespace AddLabelStyle {
	export const label = css({
		...theme.fontStyles['Caption/Caption1_13∙150_SemiBold'],
		color: theme.color.grayScale.gray80,
	});

	export const requiredSpan = css({
		...theme.fontStyles['Caption/Caption1_13∙150_Regular'],
		color: theme.color.red.secondary,
	});
}
