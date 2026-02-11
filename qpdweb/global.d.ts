/* eslint-disable */
// @ts-uncheck

declare global {
	interface Window {
		Kakao: {
			init: (appKey: string) => void;
			isInitialized: () => boolean;
			Auth: {
				login: (options: {
					success: (authObj: any) => void;
					fail: (err: any) => void;
					scope?: string;
				}) => void;
				logout: (callback?: () => void) => void;
				getAccessToken: () => string | null;
				authorize: (options: { redirectUri: string; state: string }) => void;
			};
			API: {
				request: (options: {
					url: string;
					success: (response: any) => void;
					fail: (error: any) => void;
				}) => void;
			};
			Share: {
				sendDefault: (options: any) => void;
			};
		};
	}
}

export {};
