import { css, useTheme } from '@emotion/react';
import { format } from 'date-fns';
import {
	Fragment,
	useContext,
	useEffect,
	useRef,
	useState,
	type MouseEvent,
	type MouseEventHandler,
} from 'react';
import { PreviewItem } from '~/features/question/components/preview/preview-item';
import { useCalendar } from '~/hooks/useCalendar';
import { Icon } from '~/images';
import { AnimatePresence, motion } from 'motion/react';
import type { Theme } from '~/style/theme';
import { SideBarLayout } from '~/components/layout/side-bar/side-bar-layout';
import { useOutsideClick } from '~/hooks/useOutSideClick';
import { QuestionContext } from '~/features/question/context/question';
import { useSearchParams } from 'react-router';
import { API } from '~/api';
import { useModal } from '~/hooks/useModal';
import { ConfirmModal } from '~/components/ui/modal/confirm';
import { AddQuestionSideBar } from '~/features/question/components/side-bar/add-question-side-bar';
import { AlertModal } from '~/components/ui/modal/alert';
import { EditQuestionSideBar } from '~/features/question/components/side-bar/edit-question-side-bar';
import { AnswerSidebarLayout } from '~/features/answer/components/side-bar/layout/answer-side-bar-layout';
import { AnswerListSidebar } from '~/features/answer/components/side-bar/answer-list/answer-list-side-bar';

type ReturnUseCalendar = ReturnType<typeof useCalendar>;

interface Props {
	weekDays: ReturnUseCalendar['weekDays'];
	onClickDay: ReturnUseCalendar['onClickDay'];
	gridDays: ReturnUseCalendar['gridDays'];
	startOfCurrentMonth: ReturnUseCalendar['startOfCurrentMonth'];
	endOfCurrentMonth: ReturnUseCalendar['endOfCurrentMonth'];
	currentSelectedDate: ReturnUseCalendar['currentSelectedDate'];
	direction: number;
}

export function MainCalendar(props: Props) {
	const {
		weekDays,
		onClickDay,
		direction,
		gridDays,
		startOfCurrentMonth,
		endOfCurrentMonth,
		currentSelectedDate,
	} = props;
	const { state: questionState, dispatch } = useContext(QuestionContext);
	const [searchParams] = useSearchParams();
	const dateAt = searchParams.get('dateAt') as string;
	const DelQuestionPortal = useModal('del-question');
	const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
	const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
	const [isQuestionSidebarOpen, setIsQuestionSidebarOpen] = useState(false);
	const [questionId, setQuestionId] = useState(0);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const questionSideBarRef = useRef<HTMLDivElement>(null);
	const editQuestionSideBarRef = useRef<HTMLDivElement>(null);
	const SavePortal = useModal('question-save');
	const SaveErrorPortal = useModal('question-save-error');
	const [isAnswerListOpen, setIsAnswerListOpen] = useState(false);
	const [targetDateAt, setTargetDateAt] = useState('');
	const AnswerListSidebarPortal = useModal<number>('answer-lst');

	const theme = useTheme();

	useOutsideClick(questionSideBarRef, () => setIsQuestionSidebarOpen(false));
	useOutsideClick(editQuestionSideBarRef, () => setIsEditSidebarOpen(false));

	const variants = {
		enter: (direction: number) => ({
			x: direction * 1000,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			x: direction * -1000,
			opacity: 0,
		}),
	};

	function onHoverDate(day: Date | null) {
		if (isQuestionSidebarOpen || isEditSidebarOpen) return;
		setHoveredDate(day);
	}

	function onClickQuestionSideBar() {
		setIsQuestionSidebarOpen(s => !s);
	}

	function onClickOpenEditSideBar() {
		setIsEditSidebarOpen(s => !s);
	}

	function onClickOpenDelModal(id: number, dateAt: string) {
		setQuestionId(id);
		setTargetDateAt(dateAt);

		DelQuestionPortal.open();
	}

	function onClickCell(date: Date) {
		if (isEditSidebarOpen || isQuestionSidebarOpen) return;

		setSelectedDate(date);
		onClickDay(date);

		if (!questionState.calendarMap[format(date, 'yyyy-MM-dd')]) return;

		onClickOpenEditSideBar();
	}

	async function onDeleteQuestion() {
		try {
			await API.Question.Del(questionId);
			dispatch({
				type: 'DEL_QUESTION',
				payload: dateAt,
			});
		} catch (error) {
			console.error(error);
		}
	}

	const onClickOpenAnswerSidebar =
		(questionId: number) => (e: React.MouseEvent) => {
			e.stopPropagation();
			AnswerListSidebarPortal.open(questionId);
		};

	return (
		<AnimatePresence initial={false} custom={direction}>
			<motion.section css={wrap}>
				<div css={weekHeader}>
					{weekDays.map((day, idx) => (
						<h4 key={`week-${day}-${idx}`} css={weekHeaderCell(theme)}>
							{day}
						</h4>
					))}
				</div>

				<div css={motionWrap}>
					<motion.div
						css={gridWrap(theme)}
						custom={direction}
						variants={variants}
						initial='enter'
						key={`calendar-${startOfCurrentMonth.toISOString()}-${direction}`}
						animate='center'
						exit='exit'
						transition={{
							x: { type: 'spring', stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 },
						}}>
						{gridDays.map((day, idx) => {
							const dayOfWeek = day.getDay();
							const isLeftEdge = dayOfWeek === 0;
							const isRightEdge = dayOfWeek === 6;
							const isCurrentMonth =
								day >= startOfCurrentMonth && day <= endOfCurrentMonth;
							const isSameDay =
								currentSelectedDate.toDateString() === day.toDateString();

							const dateString = format(day, 'yyyy-MM-dd');
							const uniqueKey = `cell-${dateString}-${idx}-${day.getTime()}`;

							return (
								<div
									onMouseEnter={() => onHoverDate(day)}
									onMouseLeave={() => onHoverDate(null)}
									key={uniqueKey}
									css={[
										gridCell(theme, isCurrentMonth),
										isLeftEdge && noLeftBorder,
										isRightEdge && noRightBorder,
									]}
									onClick={() => onClickCell(day)}>
									<div css={dateHeader}>
										<div css={selectedDay(theme, isSameDay)}>
											<div css={dayInner}>{day.getDate()}</div>
										</div>

										{hoveredDate?.toDateString() === day.toDateString() &&
											!questionState.calendarMap[dateString]?.title && (
												<button
													key={`add-btn-${dateString}-${day.getTime()}`}
													css={addButton(theme)}
													onClick={e => {
														e.stopPropagation();
														onClickQuestionSideBar();
													}}>
													<Icon.Plus
														size='14'
														color={theme.color.grayScale.gray80}
													/>
												</button>
											)}
									</div>

									{questionState.calendarMap[dateString]?.title && (
										<Fragment
											key={`question-fragment-${dateString}-${day.getTime()}`}>
											<PreviewItem
												{...questionState.calendarMap[dateString]}
												canDelete
												isEllipsis
												onClickOpenDelModal={onClickOpenDelModal}
												onClickOpenSidebar={onClickOpenAnswerSidebar(
													questionState.calendarMap[dateString].id,
												)}
												isAnswerListOpen={isAnswerListOpen}
											/>
										</Fragment>
									)}
								</div>
							);
						})}
					</motion.div>

					<DelQuestionPortal.Render>
						<ConfirmModal
							modal={DelQuestionPortal}
							onConfirm={onDeleteQuestion}
							text={`${targetDateAt}일자 질문을\n` + `삭제하시겠습니까?`}
						/>
					</DelQuestionPortal.Render>
				</div>

				<SideBarLayout
					type='question'
					isOpen={isQuestionSidebarOpen}
					ref={questionSideBarRef}>
					<AddQuestionSideBar
						onClickClose={onClickQuestionSideBar}
						hoveredDate={hoveredDate}
						openSavedModal={SavePortal.open}
						openSavedErrorModal={SaveErrorPortal.open}
					/>
				</SideBarLayout>

				<SideBarLayout
					type='question'
					isOpen={isEditSidebarOpen}
					ref={editQuestionSideBarRef}>
					<EditQuestionSideBar
						selectedDate={selectedDate}
						question={
							selectedDate
								? questionState.calendarMap[format(selectedDate, 'yyyy-MM-dd')]
								: undefined
						}
						onClickClose={onClickOpenEditSideBar}
						openSavedModal={SavePortal.open}
						openSavedErrorModal={SaveErrorPortal.open}
					/>
				</SideBarLayout>
			</motion.section>

			<SavePortal.Render>
				<AlertModal modal={SavePortal} text='저장이 완료되었습니다.' />
			</SavePortal.Render>

			<SaveErrorPortal.Render>
				<AlertModal
					modal={SaveErrorPortal}
					text='저장중 문제가 발생했습니다.'
				/>
			</SaveErrorPortal.Render>

			<AnswerListSidebarPortal.Render
				type='sidebar'
				withoutOverlay
				animationType='slideInRight'>
				<AnswerListSidebar
					onClickClose={AnswerListSidebarPortal.close}
					questionId={AnswerListSidebarPortal?.value}
				/>
			</AnswerListSidebarPortal.Render>
		</AnimatePresence>
	);
}

const wrap = css`
	display: flex;
	flex-direction: column;

	height: 100%;
`;

const weekHeader = css`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	width: auto;
	text-align: center;
	margin-bottom: 8px;
`;

const weekHeaderCell = (theme: Theme) => css`
	padding: 8px;
	color: ${theme.color.grayScale.gray80};
	${theme.fontStyles['Caption/Caption2_12∙100_SemiBold']}
`;

const gridWrap = (theme: Theme) => css`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	border-top: 1px solid ${theme.color.grayScale.gray40};
`;

const gridCell = (theme: Theme, isCurrentMonth: boolean) => {
	let textColor = '';
	let backgroundColor = 'transparent';

	if (!isCurrentMonth) {
		textColor = theme.color.grayScale.gray50;
		backgroundColor = 'transparent';
	} else {
		textColor = theme.color.grayScale.gray90;
	}
	return css`
		display: flex;
		flex-direction: column;
		padding: 8px;
		cursor: pointer;
		height: 184px;
		min-height: 184px;
		color: ${textColor};
		padding: 4px;
		background-color: ${backgroundColor};

		border-top: 1px solid ${theme.color.grayScale.gray40};
		border-left: 1px solid ${theme.color.grayScale.gray40};
		${theme.fontStyles['Caption/Caption1_13∙100_SemiBold']};
		overflow: hidden;
	`;
};

const dayInner = css({
	padding: '4px',
});

const selectedDay = (theme: Theme, isSameDay: boolean) => css`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	padding: 5px;
	background-color: ${isSameDay
		? theme.color.main
		: theme.color.grayScale.white};
	${theme.fontStyles['Caption/Caption1_13∙100_SemiBold']};
	color: ${isSameDay
		? theme.color.grayScale.white
		: theme.color.grayScale.gray90};
	line-height: 1.2;
`;

const dateHeader = css({
	display: 'flex',
	position: 'relative',
	justifyContent: 'space-between',
	alignItems: 'center',
	marginBottom: '12px',
});

const noLeftBorder = css`
	border-left: none;
`;

const noRightBorder = css`
	border-right: none;
`;

const addButton = (theme: Theme) =>
	css({
		display: 'flex',
		position: 'absolute',
		top: '0',
		right: '0',
		justifyContent: 'center',
		alignItems: 'center',
		width: '32px',
		height: '32px',
		borderRadius: '8px',
		boxShadow: '0px 2px 4px 0px rgba(25, 25, 25, 0.10)',
		border: `1px solid ${theme.color.grayScale.gray40}`,
		':hover': {
			backgroundColor: `${theme.color.grayScale.gray20}`,
		},
		transition: 'all 0.4s ease-in-out',
		cursor: 'pointer',
	});

const motionWrap = css({
	width: '100%',
	heigh: '100%',
	overflow: 'hidden',
	position: 'relative',
});
