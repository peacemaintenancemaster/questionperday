import { useSearchParams } from 'react-router';
import type { Route } from './+types/home';
import { use, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { MainCalendar } from '~/features/main/calendar/main-calendar';
import { MainHeader } from '~/features/main/header/main-header';
import { useCalendar } from '~/hooks/useCalendar';

import { motion } from 'motion/react';
import { CalendarPanel } from '~/components/layout/calendar-panel/calendar-panel';
import { Header } from '~/components/layout/header/Header';
import { API } from '~/api';
import { QuestionContext } from '~/features/question/context/question';
import { formatQuestion, getCombinedDateMap } from '~/utils/question';
import { useModal } from '~/hooks/useModal';
import { AlertModal } from '~/components/ui/modal/alert';
import { AddQuestionSideBar } from '~/features/question/components/side-bar/add-question-side-bar';
import { QuestionListTable } from '~/features/question/components/table/qusestion-list-table';
import { SideBarLayout } from '~/components/layout/side-bar/side-bar-layout';

export function meta({}: Route.MetaArgs) {
	return [{ title: 'qpd-admin' }];
}

export default function Home() {
	const [searchParams] = useSearchParams();
	const viewType = searchParams.get('view');
	const dateAt = searchParams.get('dateAt') as string;
	const { onClickMonth, ...calendarState } = useCalendar();

	const SavePortal = useModal('question-save');
	const SaveErrorPortal = useModal('question-save-error');
	const { state, dispatch } = use(QuestionContext);
	const [direction, setDirection] = useState(0);
	const [isQuestionSidebarOpen, setIsQuestionSidebarOpen] = useState(false);
	const questionSidebarRef = useRef(null);

	useEffect(() => {
		(async function () {
			if (!dateAt || viewType !== 'calendar') return;

			const targetMonth = dateAt.slice(0, 7);
			const isMonthLoaded = Object.keys(state).some(dateKey =>
				dateKey.startsWith(targetMonth),
			);

			if (isMonthLoaded) return;

			const { questionDateMap } = await API.Question.getQuestionMap(dateAt);

			dispatch({
				type: 'MONTH',
				payload: getCombinedDateMap(questionDateMap),
			});
		})();
	}, [dateAt, viewType]);

	useEffect(() => {
		(async function () {
			if (viewType !== 'list') return;

			const { questionList } = await API.Question.getList(dateAt);

			const formattedQuestion = formatQuestion(questionList);

			dispatch({
				type: 'LIST',
				payload: formattedQuestion,
			});
		})();
	}, [dateAt, viewType]);

	function onChangeMonth(dir: number) {
		setDirection(dir);
		onClickMonth(dir);
	}

	function onClickOpenAddSideBar() {
		setIsQuestionSidebarOpen(s => !s);
	}

	return (
		<main css={main}>
			<Header />
			<motion.section
				css={wrap}
				initial={{ opacity: 0, translateY: 20 }}
				animate={{ opacity: 1, translateY: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}>
				<CalendarPanel />

				<section css={inner}>
					<MainHeader
						{...calendarState}
						onClickMonth={onChangeMonth}
						onClickOpenAddSideBar={onClickOpenAddSideBar}
					/>

					{viewType === 'calendar' && (
						<MainCalendar {...calendarState} direction={direction} />
					)}
					{viewType === 'list' && <QuestionListTable />}
				</section>

				<SideBarLayout
					type='question'
					isOpen={isQuestionSidebarOpen}
					ref={questionSidebarRef}>
					<AddQuestionSideBar
						onClickClose={onClickOpenAddSideBar}
						hoveredDate={new Date()}
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
		</main>
	);
}
const main = css`
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
`;

const wrap = css`
	display: flex;
	width: 100%;
	padding-left: 40px;
`;

const inner = css({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	padding: '18px 40px 18px 24px',
});
