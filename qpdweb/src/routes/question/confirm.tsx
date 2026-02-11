import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useRef } from 'react';
import { Button } from '~/shared/components/ui/button/button';
import { HorizontalDrag } from '~/shared/components/ui/drag/horizontal-drag';
import { Icon } from '~/shared/images';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export const Route = createFileRoute('/question/confirm')({
	component: RouteComponent,
});

function RouteComponent() {
	const imageWrapRefs = useRef<(HTMLDivElement | null)[]>([]);

	const onClickCapture = async (index: number) => {
		const targetRef = imageWrapRefs.current[index];
		if (targetRef) {
			const canvas = await html2canvas(targetRef, {
				scale: 6,
				useCORS: true,
				allowTaint: false,
				backgroundColor: null,
				logging: false,
				imageTimeout: 15000,
			});

			canvas.toBlob(
				blob => {
					if (blob) {
						const fileName = `answer-${format(new Date(), 'yyyy-MM-dd-HHmmss')}-${index + 1}.png`;
						saveAs(blob, fileName);
					}
				},
				'image/png',
				1.0,
			);
		}
	};

	const answer = JSON.parse(localStorage.getItem('answer') as string);

	return (
		<section {...stylex.props(styles.wrap, flex.column)}>
			<p
				{...stylex.props(
					styles.primaryColor,
					typo['Body/Body1_16∙100_SemiBold'],
				)}>
				답변은 이미지로 저장할 수 있어요.
			</p>

			<div {...stylex.props(styles.titleWrap, flex.column)}>
				<h2
					{...stylex.props(
						styles.title,
						typo['Heading/lines/H1_28∙130_SemiBold_lines'],
					)}>
					답변이 완료되었어요!
				</h2>
				<p
					{...stylex.props(
						styles.subTitle,
						typo['Body/lines/Body3_14∙150_Regular_lines'],
					)}>
					공유해주신 답변 중 다섯 분을 선정해 내일의 뉴스레터에 실어 드려요.
				</p>
			</div>

			<div {...stylex.props(styles.horizontalWrap)}>
				<HorizontalDrag isMounted>
					{backgroundList.map((el, idx) => (
						<div key={idx} {...stylex.props(styles.item, flex.center)}>
							<div
								{...stylex.props(styles.imageWrap)}
								ref={element => {
									imageWrapRefs.current[idx] = element;
								}}>
								<img src={el} {...stylex.props(styles.image)} />
								<div {...stylex.props(styles.textWrap)}>
									<p {...stylex.props(titleList[idx])}>
										{answer?.question.title}
									</p>

									<p {...stylex.props(textList[idx])}>{answer?.text}</p>
								</div>
							</div>

							<button
								{...stylex.props(styles.saveButton, flex.center)}
								onClick={() => onClickCapture(idx)}>
								<Icon.Download size='16' color={colors.main} />
								<p
									{...stylex.props(
										styles.primaryColor,
										typo['Caption/Caption1_13∙100_SemiBold'],
									)}>
									이미지 저장
								</p>
							</button>
						</div>
					))}
				</HorizontalDrag>
			</div>

			<Link
				to='/'
				search={{
					dateAt: format(new Date(), 'yyyy-MM-dd'),
				}}>
				<Button variants='primary'>내 답변 보러가기</Button>
			</Link>
		</section>
	);
}

const styles = stylex.create({
	wrap: {
		padding: '24px 0 10px 18px',
		background: 'rgba(255, 255, 255, 0.80)',
		backdropFilter: 'blur(20px)',
		display: 'flex',
		flex: 1,
	},
	primaryColor: {
		color: colors.main,
	},
	titleWrap: {
		paddingTop: 18,
		paddingRight: 18,
		gap: 12,
		height: 'fit-content',
	},
	title: {
		color: colors.gray90,
	},
	subTitle: {
		color: colors.gray80,
	},
	horizontalWrap: {
		width: '100%',
		justifyContent: 'center',
		padding: '40px 0 50px 10%',
		display: 'flex',
		gap: 12,
		flex: 1,
	},
	item: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		gap: 12,
	},
	imageWrap: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		position: 'relative',
		flexShrink: 0,
		width: 280,
		height: 388,
	},
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
	},
	textWrap: {
		position: 'absolute',
		display: 'flex',
		flexDirection: 'column',
		gap: 16,
		height: 144,
		padding: 12,
	},
	saveButton: {
		display: 'flex',
		width: 96,
		height: 32,
		padding: 8,
		borderRadius: 14,
		border: `1px solid ${colors.main}`,
		backgroundColor: colors.secondary,
	},
	baseImageTitle: {
		color: colors.white,
		fontSize: '16px',
		fontStyle: 'normal',
		fontWeight: 700,
		lineHeight: '150%',
	},
	darkImageTitle: {
		color: colors.main,
		fontSize: '16px',
		fontStyle: 'normal',
		fontWeight: 700,
		lineHeight: '150%',
	},
	baseImageText: {
		color: colors.white,
		fontSize: '13px',
		fontStyle: 'normal',
		fontWeight: 200,
		lineHeight: '150%',
		whiteSpace: 'pre-wrap',
	},
	darkImageText: {
		color: colors.main,
		fontSize: '13px',
		fontStyle: 'normal',
		fontWeight: 200,
		whiteSpace: 'pre-wrap',
	},
});

const backgroundList = ['/image/207.png', '/image/208.png', '/image/209.png'];
const titleList = [
	styles.baseImageTitle,
	styles.darkImageTitle,
	styles.darkImageTitle,
];
const textList = [
	styles.baseImageText,
	styles.darkImageText,
	styles.darkImageText,
];
