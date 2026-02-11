import * as styleX from '@stylexjs/stylex';

export const DARK = '@media (prefers-color-scheme: dark)';

export const colors = styleX.defineVars({
	main: { default: '#2C5AFF', [DARK]: '#2C5AFF' },
	secondary: { default: '#ECF0FF', [DARK]: '#ECF0FF' },
	redPrimary: { default: '#F95756', [DARK]: '#F95756' },
	redSecondary: { default: '#fc7070', [DARK]: '#fc7070' },
	redSub01: { default: '#eb5c34', [DARK]: '#eb5c34' },
	redSub02: { default: '#E98670', [DARK]: '#E98670' },
	redSub03: { default: '#fff6f6', [DARK]: '#fff6f6' },
	bluePrimary: { default: '#008FF6', [DARK]: '#008FF6' },
	blueSecondary: { default: '#00A3FF', [DARK]: '#00A3FF' },
	blueSub01: { default: '#56ABF9', [DARK]: '#56ABF9' },
	blueSub02: { default: '#A0D5FB', [DARK]: '#A0D5FB' },
	blueSub03: { default: '#EFF8FF', [DARK]: '#EFF8FF' },
	yellowPrimary: { default: '#FFA800', [DARK]: '#FFA800' },
	yellowSecondary: { default: '#FFBB00', [DARK]: '#FFBB00' },
	yellowSub01: { default: '#FFC525', [DARK]: '#FFC525' },
	yellowSub02: { default: '#FFDC8C', [DARK]: '#FFDC8C' },
	yellowSub03: { default: '#FFF4DE', [DARK]: '#FFF4DE' },
	purplePrimary: { default: '#1A00B7', [DARK]: '#1A00B7' },
	purpleSecondary: { default: '#572DFF', [DARK]: '#572DFF' },
	purpleSub01: { default: '#7D7DFF', [DARK]: '#7D7DFF' },
	purpleSub02: { default: '#DCD3FF', [DARK]: '#DCD3FF' },
	purpleSub03: { default: '#ECECFF', [DARK]: '#ECECFF' },
	gray90: { default: '#252525', [DARK]: '#252525' },
	gray80: { default: '#6a6a6a', [DARK]: '#6a6a6a' },
	gray70: { default: '#9a9a9a', [DARK]: '#9a9a9a' },
	gray60: { default: '#bcbcbc', [DARK]: '#bcbcbc' },
	gray50: { default: '#dbdbdb', [DARK]: '#dbdbdb' },
	gray40: { default: '#e9e9e9', [DARK]: '#e9e9e9' },
	gray30: { default: '#f3f6f5', [DARK]: '#f3f6f5' },
	gray20: { default: '#f8f8f8', [DARK]: '#f8f8f8' },
	gray10: { default: '#fbfbfb', [DARK]: '#fbfbfb' },
	bgColor: {
		default: 'rgba(25, 25, 25, 0.5)',
		[DARK]: 'rgba(25, 25, 25, 0.5)',
	},
	black: { default: '#000', [DARK]: '#000' },
	white: { default: '#fff', [DARK]: '#fff' },
	snackbar: {
		default: 'rgba(37, 37, 37, 0.90)',
		[DARK]: 'rgba(37, 37, 37, 0.90)',
	},
});

export const typo = styleX.create({
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
});

export const flex = styleX.create({
	center: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	horizontal: {
		display: 'flex',
		justifyContent: 'center', // 가로 중앙 정렬
	},
	vertical: {
		display: 'flex',
		alignItems: 'center', // 세로 중앙 정렬
	},
	start: {
		display: 'flex',
		justifyContent: 'flex-start', // 가로 왼쪽 정렬
		alignItems: 'flex-start', // 세로 위쪽 정렬
	},
	end: {
		display: 'flex',
		justifyContent: 'flex-end', // 가로 오른쪽 정렬
	},
	between: {
		display: 'flex',
		justifyContent: 'space-between', // 가로 균등 분배 (양끝 포함)
	},
	around: {
		display: 'flex',
		justifyContent: 'space-around', // 가로 균등 분배 (양끝 제외)
	},
	evenly: {
		display: 'flex',
		justifyContent: 'space-evenly', // 가로 균등 간격
	},
	column: {
		display: 'flex',
		flexDirection: 'column', // 세로 방향 배치
	},
	columnReverse: {
		display: 'flex',
		flexDirection: 'column-reverse', // 세로 역방향 배치
	},
	row: {
		display: 'flex',
		flexDirection: 'row', // 기본 가로 방향 배치
	},
	rowReverse: {
		display: 'flex',
		flexDirection: 'row-reverse', // 가로 역방향 배치
	},
	wrap: {
		display: 'flex',
		flexWrap: 'wrap', // 내용 줄바꿈 허용
	},
	wrapReverse: {
		display: 'flex',
		flexWrap: 'wrap-reverse', // 줄바꿈 역방향
	},
	noWrap: {
		display: 'flex',
		flexWrap: 'nowrap', // 줄바꿈 없음
	},
	alignStart: {
		display: 'flex',
		alignItems: 'flex-start', // 세로 위쪽 정렬
	},
	alignEnd: {
		display: 'flex',
		alignItems: 'flex-end', // 세로 아래쪽 정렬
	},
	alignStretch: {
		display: 'flex',
		alignItems: 'stretch', // 세로 방향으로 늘리기
	},
	alignBaseline: {
		display: 'flex',
		alignItems: 'baseline', // 텍스트 베이스라인 기준 정렬
	},
	contentStart: {
		display: 'flex',
		alignContent: 'flex-start', // 줄 콘텐츠 위쪽 정렬
	},
	contentEnd: {
		display: 'flex',
		alignContent: 'flex-end', // 줄 콘텐츠 아래쪽 정렬
	},
	contentCenter: {
		display: 'flex',
		alignContent: 'center', // 줄 콘텐츠 중앙 정렬
	},
	contentBetween: {
		display: 'flex',
		alignContent: 'space-between', // 줄 콘텐츠 균등 분배 (양끝 포함)
	},
	contentAround: {
		display: 'flex',
		alignContent: 'space-around', // 줄 콘텐츠 균등 분배 (양끝 제외)
	},
	contentStretch: {
		display: 'flex',
		alignContent: 'stretch', // 줄 콘텐츠 늘리기
	},
});
