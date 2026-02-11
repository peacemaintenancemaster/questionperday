import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useSearchParams,
} from 'react-router';
import type { Route } from './+types/root';
import { GlobalStyle } from './style/GlobalStyle';
import { ThemeProvider } from '@emotion/react';
import { theme } from './style/theme';
import { AuthContext, AuthProvider } from './features/auth/context/auth';
import { enableMapSet } from 'immer';
import { use, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useSession } from './features/auth/hooks/useSession';
import { QuestionProvider } from './features/question/context/question';
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

export const links: Route.LinksFunction = () => [
	{
		rel: 'stylesheet',
		href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css',
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	enableMapSet();

	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='apple-touch-icon' sizes='180x180' href='/favicon.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='/favicon.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='/favicon.png' />
				<link
					rel='stylesheet'
					href='https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css'
				/>
				<link rel='manifest' href='/site.webmanifest'></link>
				<Meta />
				<Links />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider theme={theme}>
						<GlobalStyle />
						<AuthProvider>
							<QuestionProvider>{children}</QuestionProvider>
						</AuthProvider>
					</ThemeProvider>
				</QueryClientProvider>
				<ScrollRestoration />
				<Scripts />
				<div id='modal'></div>
			</body>
		</html>
	);
}

export function HydrateFallback() {
	return <></>;
}

export default function App() {
	const { state } = use(AuthContext);
	const { isAuthenticated } = state;
	const [searchParams, setSearchParams] = useSearchParams();

	useSession();

	useEffect(() => {
		if (!isAuthenticated) return;
		if (!!searchParams.get('dateAt') || !!searchParams.get('view')) return;

		setSearchParams({
			dateAt: format(new Date(), 'yyyy-MM-dd'),
			view: 'calendar',
		});
	}, [searchParams, isAuthenticated]);

	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return <></>;
}
