import { css, Global, useTheme } from '@emotion/react';

export function GlobalStyle() {
	const theme = useTheme();
	return (
		<Global
			styles={css`
				*,
				*::before,
				*::after {
					box-sizing: border-box;
				}

				* {
					margin: 0;
					padding: 0;
					font-family: 'Pretendard Variable', Pretendard, -apple-system,
						BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI',
						'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic',
						'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
				}

				button {
					cursor: pointer;
					border: none;
					background: none;
				}

				ul[role='list'],
				ol[role='list'] {
					list-style: none;
				}

				html:focus-within {
					scroll-behavior: smooth;
				}

				a:not([class]) {
					text-decoration-skip-ink: auto;
				}

				img,
				picture,
				svg,
				video,
				canvas {
					max-width: 100%;
					height: auto;
					vertical-align: middle;
					font-style: italic;
					background-repeat: no-repeat;
					background-size: cover;
				}

				input,
				button,
				textarea,
				select {
					font: inherit;
					outline: none;
				}

				input:-webkit-autofill,
				input:-webkit-autofill:hover,
				input:-webkit-autofill:focus,
				input:-webkit-autofill:active {
					-webkit-box-shadow: 0 0 0 30px white inset !important;
				}

				@media (prefers-reduced-motion: reduce) {
					html:focus-within {
						scroll-behavior: auto;
					}
					*,
					*::before,
					*::after {
						animation-duration: 0.01ms !important;
						animation-iteration-count: 1 !important;
						transition-duration: 0.01ms !important;
						scroll-behavior: auto !important;
						transition: none;
					}
				}

				body,
				html {
					height: 100%;
					scroll-behavior: smooth;
				}

				blockquote {
					border-left: 3px solid var(--gray-3);
					margin: 1.5rem 0;
					padding-left: 1rem;
				}

				hr {
					border: none;
					border-top: 1px solid var(--gray-2);
					margin: 2rem 0;
				}
			`}
		/>
	);
}
