import * as stylex from '@stylexjs/stylex';
import { PropsWithChildren } from 'react';
import { colors, flex } from '~/shared/style/common.stylex';
import { Header } from './header/header';

export const RootLayout = ({ children }: PropsWithChildren) => {
	return (
		<main {...stylex.props(styles.wrap, flex.horizontal)}>
			<section {...stylex.props(styles.inner)}>
				<Header />

				{children}
			</section>
		</main>
	);
};

const styles = stylex.create({
	wrap: {
		height: '100svh',
		backgroundColor: colors.white,
	},
	inner: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		maxWidth: 600,
	},
});
