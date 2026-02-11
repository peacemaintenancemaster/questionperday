import type { Color, Flex, FontStyle } from './theme';

declare module '@emotion/react' {
	export interface Theme {
		color: Color;
		fontStyles: FontStyle;
		flex: Flex;
	}
}
