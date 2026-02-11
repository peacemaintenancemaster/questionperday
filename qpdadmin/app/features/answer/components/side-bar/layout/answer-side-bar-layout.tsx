import type { PropsWithChildren } from 'react';
import { AnswerSidebarStyle as styles } from './answer-side-bar-layout.style';
import { Icon } from '~/images';

interface Props {
	title?: string;
	onClickClose: () => void;
}

export const AnswerSidebarLayout = ({
	children,
	onClickClose,
	title,
}: PropsWithChildren<Props>) => {
	return (
		<section css={styles.wrap}>
			<header css={styles.header}>
				<button onClick={onClickClose}>
					<Icon.ArrowLeft size='24' />
				</button>

				{title}
			</header>

			<div css={styles.body}>{children}</div>
		</section>
	);
};
