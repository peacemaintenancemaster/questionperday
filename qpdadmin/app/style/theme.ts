const color = {
	main: '#2C5AFF',
	secondary: '#ECF0FF',
	red: {
		primary: '#F95756',
		secondary: '#fc7070',
		sub01: '#eb5c34',
		sub02: '#E98670',
		sub03: '#fff6f6',
	},
	blue: {
		primary: '#008FF6',
		secondary: '#00A3FF',
		sub01: '#56ABF9',
		sub02: '#A0D5FB',
		sub03: '#EFF8FF',
	},
	yellow: {
		primary: '#FFA800',
		secondary: '#FFBB00',
		sub01: '#FFC525',
		sub02: '#FFDC8C',
		sub03: '#FFF4DE',
	},
	purple: {
		primary: '#1A00B7',
		secondary: '#572DFF',
		sub01: '#7D7DFF',
		sub02: '#DCD3FF',
		sub03: '#ECECFF',
	},
	grayScale: {
		gray90: '#252525',
		gray80: '#6a6a6a',
		gray70: '#9a9a9a',
		gray60: '#bcbcbc',
		gray50: '#dbdbdb',
		gray40: '#e9e9e9',
		gray30: '#f3f6f5',
		gray20: '#f8f8f8',
		gray10: '#fbfbfb',
		bgColor: 'rgba(25, 25, 25, 0.5)',
		black: '#000',
		white: '#fff',
	},
	snackbar: 'rgba(37, 37, 37, 0.90)',
} as const;

export const fontStyles = {
	helper: {
		fontSize: '13px',
		fontWeight: 400,
		letterSpacing: '-0.26px',
		lineHeight: '19px',
	},
	'Heading/lines/H1_28∙130_SemiBold_lines': {
		fontSize: '28px',
		fontWeight: 600,
		lineHeight: '130%',
	},
	'Heading/H1_28∙100_SemiBold': {
		fontSize: '28px',
		fontWeight: 600,
		lineHeight: '100%',
	},
	'Heading/lines/H1_28∙130_ExtraLight_lines': {
		fontSize: '28px',
		fontWeight: 200,
		lineHeight: '130%',
	},
	'Heading/H1_28∙100_ExtraLight': {
		fontSize: '28px',
		fontWeight: 200,
		lineHeight: '100%',
	},
	'Heading/lines/H2_24∙130_SemiBold_lines': {
		fontSize: '24px',
		fontWeight: 600,
		lineHeight: '130%',
	},
	'Heading/H2_24∙100_SemiBold': {
		fontSize: '24px',
		fontWeight: 600,
		lineHeight: '100%',
	},
	'Heading/lines/H2_24∙130_Regular_lines': {
		fontSize: '24px',
		fontWeight: 400,
		lineHeight: '130%',
	},
	'Heading/H2_24∙100_Regular': {
		fontSize: '24px',
		fontWeight: 400,
		lineHeight: '100%',
	},
	'Heading/lines/H3_20∙130_SemiBold_lines': {
		fontSize: '20px',
		fontWeight: 600,
		lineHeight: '130%',
	},
	'Heading/H3_20∙100_SemiBold': {
		fontSize: '20px',
		fontWeight: 600,
		lineHeight: '100%',
	},
	'Heading/lines/H3_20∙130_Regular_lines': {
		fontSize: '20px',
		lineHeight: '130%',
	},
	'Heading/H3_20∙100_Regular': {
		fontWeight: 400,
		fontSize: '20px',
		lineHeight: '100%',
	},
	'Heading/lines/H4_18∙150_SemiBold_lines': {
		fontSize: '18px',
		fontWeight: 600,
		lineHeight: '150%',
	},
	'Heading/H4_18∙100_SemiBold': {
		fontSize: '18px',
		fontWeight: 600,
		lineHeight: '100%',
	},
	'Heading/lines/H4_18∙150_Regular_lines': {
		fontSize: '18px',
		fontWeight: 400,
		lineHeight: '150%',
	},
	'Heading/H4_18∙100_Regular': {
		fontSize: '18px',
		fontWeight: 400,
		lineHeight: '100%',
	},
	'Body/lines/Body1_16∙150_SemiBold_lines': {
		fontSize: '16px',
		fontWeight: 600,
		lineHeight: '150%',
	},
	'Body/Body1_16∙100_SemiBold': {
		fontSize: '16px',
		fontWeight: 600,
		lineHeight: '100%',
	},
	'Body/lines/Body1_16∙150_Regular_lines': {
		fontWeight: 400,
		fontSize: '16px',
		lineHeight: '150%',
	},
	'Body/Body1_16∙100_Regular': {
		fontWeight: 400,
		fontSize: '16px',
		lineHeight: '100%',
	},
	'Body/lines/Body2_15∙150_Bold_lines': {
		fontSize: '15px',
		fontWeight: 700,
		lineHeight: '150%',
	},
	'Body/Body2_15∙100_Bold': {
		fontSize: '15px',
		fontWeight: 700,
		lineHeight: '100%',
	},
	'Body/lines/Body2_15∙150_Regular_lines': {
		fontSize: '15px',
		fontWeight: 400,
		lineHeight: '150%',
	},
	'Body/Body2_15∙100_Regular': {
		fontWeight: 400,
		fontSize: '15px',
		lineHeight: '100%',
	},
	'Body/lines/Body3_14∙150_SemiBold_lines': {
		fontSize: '14px',
		fontWeight: 600,
		lineHeight: '150%',
	},
	'Body/Body3_14∙100_SemiBold': {
		fontSize: '14px',
		fontWeight: 600,
		lineHeight: '100%',
	},
	'Body/lines/Body3_14∙150_Regular_lines': {
		fontSize: '14px',
		lineHeight: '150%',
		fontWeight: 400,
	},
	'Body/Body3_14∙100_Regular': {
		fontSize: '14px',
		lineHeight: '100%',
		fontWeight: 400,
	},
	'Caption/lines/Caption1_13∙150_SemiBold_lines': {
		fontSize: '13px',
		fontWeight: 600,
		lineHeight: '150%',
	},
	'Caption/Caption1_13∙100_SemiBold': {
		fontSize: '13px',
		fontWeight: 600,
		lineHeight: '100%',
	},
	'Caption/lines/Caption1_13∙150_Regular_lines': {
		fontSize: '13px',
		fontWeight: 400,
		lineHeight: '150%',
	},
	'Caption/Caption1_13∙150_SemiBold': {
		fontSize: '13px',
		fontWeight: 600,
		lineHeight: 'normal',
	},
	'Caption/Caption1_13∙100_Regular': {
		fontSize: '13px',
		lineHeight: '100%',
		fontWeight: 400,
	},
	'Caption/lines/Caption2_12∙150_SemiBold_lines': {
		fontSize: '12px',
		fontWeight: 600,
		lineHeight: '150%',
	},
	'Caption/Caption2_12∙100_SemiBold': {
		fontSize: '12px',
		fontWeight: 600,
		lineHeight: '100%',
	},
	'Caption/lines/Caption2_12∙150_Regular_lines': {
		fontSize: '12px',
		fontWeight: 400,
		lineHeight: '150%',
	},
	'Caption/Caption2_12∙100_Regular': {
		fontSize: '12px',
		fontWeight: 400,
		lineHeight: '100%',
	},
	'Body/Body2_15∙150_Regular': {
		fontSize: '15px',
		fontStyle: 'normal',
		fontWeight: 400,
		lineHeight: 'normal',
	},
} as const;

const flex = {
	row: {
		display: 'flex',
		alignItems: 'center',
	},
	rowCenter: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	column: {
		display: 'flex',
		flexDirection: 'column',
	},
	columnCenter: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
};

export const theme = {
	color,
	fontStyles,
	flex,
};

export type Theme = typeof theme;
export type Flex = typeof flex;

export type FontStyle = typeof fontStyles;
export type Color = typeof color;
