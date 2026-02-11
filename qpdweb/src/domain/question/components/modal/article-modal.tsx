import * as stylex from '@stylexjs/stylex';
import { Link } from '@tanstack/react-router';
import { Header } from '~/shared/components/layout/header/header';
import { Button } from '~/shared/components/ui/button/button';
import { flex } from '~/shared/style/common.stylex';

interface Props {
	onClickClose: () => void;
	article: string;
}

export const ArticleModal = ({ onClickClose, article }: Props) => {
	return (
		<div {...stylex.props(styles.base, flex.column)}>
			<Header variant='back' onClickCallback={onClickClose} />

			<div {...stylex.props(styles.body)}>
				<div
					className='quill'
					style={{
						zIndex: 1,
					}}>
					<div
						className='ql-container ql-snow'
						style={{
							border: 0,
							position: 'relative',
						}}>
						<div
							{...stylex.props(styles.articlePreview)}
							dangerouslySetInnerHTML={{
								__html: article as string,
							}}
						/>
					</div>
				</div>
			</div>

			<div {...stylex.props(styles.buttonWrap)}>
				<Link to='/question/write' search={{ step: 1 }} style={{ zIndex: 1 }}>
					<Button variants='primary' onClick={() => {}}>
						답변 작성하러가기
					</Button>
				</Link>
			</div>
		</div>
	);
};

const styles = stylex.create({
	base: {
		width: 'var(--modal-width, 600px)',
		height: '100vh',
		backgroundColor: '#fff',
		margin: '0 auto',
	},
	body: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		position: 'relative',
		padding: '0 18px 40px 18px',
		marginBottom: 16,
		overflowY: 'scroll',

		'::-webkit-scrollbar': {
			display: 'none',
		},
	},
	articlePreview: {
		height: 126,
	},
	buttonWrap: {
		marginTop: 'auto',
		padding: '0 18px 12px 18px',
	},
});
