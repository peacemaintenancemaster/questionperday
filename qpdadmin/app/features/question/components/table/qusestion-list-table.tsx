import React from 'react';
import {
	useReactTable,
	getCoreRowModel,
	createColumnHelper,
	flexRender,
} from '@tanstack/react-table';
import { QuestionContext } from '../../context/question';
import type { QuestionSchemaWithType } from '../../schema/question.add';
import { format } from 'date-fns';
import { QuestionListTableStyle as styles } from './question-list-table.style';
import { Badge } from '~/components/ui/badge/badge';
import type { QuestionType } from '~/types/answer/answer';
import { ConfirmModal } from '~/components/ui/modal/confirm';
import { useModal } from '~/hooks/useModal';
import { useSearchParams } from 'react-router';
import { API } from '~/api';
import { SideBarLayout } from '~/components/layout/side-bar/side-bar-layout';
import { EditQuestionSideBar } from '../side-bar/edit-question-side-bar';
import { AlertModal } from '~/components/ui/modal/alert';
import { useTheme } from '@emotion/react';

export function QuestionListTable() {
	const { state, dispatch } = React.use(QuestionContext);
	const [searchParams] = useSearchParams();
	const [questionId, setQuestionId] = React.useState(0);
	const [selectedDateAt, setSelectedDateAt] = React.useState('');
	const [isEditSidebarOpen, setIsEditSidebarOpen] = React.useState(false);
	const [targetQuestionIdx, setTargetQuestionIdx] = React.useState(0);

	const theme = useTheme();
	const columnHelper = createColumnHelper<QuestionSchemaWithType>();
	const SavePortal = useModal('question-save');
	const SaveErrorPortal = useModal('question-save-error');
	const DelQuestionPortal = useModal('delete-question');
	const editSidebarRef = React.useRef(null);

	const columns = [
		columnHelper.accessor('type', {
			id: 'status',
			header: '질문 상태',
			cell: info => <Badge type={info.getValue() as QuestionType} />,
			size: 100,
		}),
		columnHelper.accessor('dateAt', {
			header: '예약 날짜',
			cell: info => (
				<div
					css={[
						styles.dateCell,
						{ color: colorTypeMap[info.row.original?.type] },
					]}>
					{format(new Date(info.getValue()), 'yy.MM.dd')}
				</div>
			),
			size: 172,
		}),
		columnHelper.accessor('timeAt', {
			header: '예약 시간',
			cell: info => {
				const [hour, minute] = info.getValue()?.split(':');

				return (
					<div css={styles.timeCell}>
						{hour}시 {minute}분
					</div>
				);
			},
			size: 100,
		}),
		columnHelper.accessor('title', {
			header: '질문',
			cell: info => (
				<div css={styles.titleCell} title={info.getValue()}>
					{info.getValue()}
				</div>
			),
			size: 370,
		}),
		columnHelper.accessor('subText', {
			header: '서브 텍스트',
			cell: info => (
				<div css={styles.subTextCell} title={info.getValue()}>
					{info.getValue()}
				</div>
			),
			size: 470,
		}),
		columnHelper.accessor('needPhone', {
			id: 'procedure',
			header: '절차 추가',
			cell: info => {
				return (
					<button css={styles.actionButton}>
						{Boolean(info.row.original?.needPhone) && '연락처'}

						{Boolean(info.row.original?.needNickname) && '닉네임'}

						{!info.row.original?.needNickname &&
							!info.row.original?.needPhone &&
							'추가된 절차 없음'}
					</button>
				);
			},
			size: 160,
		}),
		columnHelper.accessor('id', {
			id: 'delete',
			header: '삭제',
			cell: info => (
				<button
					css={styles.deleteButton}
					onClick={onClickDelOpenDelModal(
						info?.row.original?.id,
						info?.row.original?.dateAt,
					)}>
					삭제
				</button>
			),
			size: 90,
		}),
	];

	const questionList = React.useMemo(() => state.list, [state.list]);

	const table = useReactTable({
		data: questionList,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const onClickDelOpenDelModal =
		(id: number, dateAt: string) => (e: React.MouseEvent) => {
			e.stopPropagation();
			setQuestionId(id);
			setSelectedDateAt(dateAt);
			DelQuestionPortal.open();
		};

	async function onDeleteQuestion() {
		try {
			await API.Question.Del(questionId);

			dispatch({
				type: 'DEL_QUESTION_LIST',
				payload: questionId,
			});
		} catch (error) {}
	}

	function onClickEditSidebarOpen(idx: number) {
		setIsEditSidebarOpen(s => !s);
		setTargetQuestionIdx(idx);
	}

	function onClickCloseSidebar() {
		setIsEditSidebarOpen(s => !s);
	}

	const colorTypeMap: Record<QuestionType, string> = {
		previous: theme.color.grayScale.gray40,
		saved: theme.color.main,
		temp: '',
	};

	return (
		<div css={styles.container}>
			<table css={styles.table}>
				<thead css={styles.tableHead}>
					{table.getHeaderGroups().map(headerGroup => (
						<tr key={headerGroup.id} css={styles.tableRow}>
							{headerGroup.headers.map(header => (
								<th
									key={header.id}
									css={styles.tableHeader}
									style={{ width: header.getSize() }}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
										  )}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody css={styles.tableBody}>
					{table.getRowModel().rows.map((row, idx) => (
						<tr
							key={row.id}
							css={styles.tableRow}
							onClick={() => onClickEditSidebarOpen(idx)}>
							{row.getVisibleCells().map(cell => (
								<td
									key={cell.id}
									css={styles.tableCell}
									style={{ width: cell.column.getSize() }}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}

					{!state.list.length && (
						<tr css={styles.tableRow}>
							<td css={styles.emptyCell} colSpan={columns.length}>
								등록된 질문이 없습니다.
							</td>
						</tr>
					)}
				</tbody>
			</table>

			<SideBarLayout
				type='question'
				isOpen={isEditSidebarOpen}
				ref={editSidebarRef}>
				<EditQuestionSideBar
					question={state.list?.[targetQuestionIdx] as any}
					onClickClose={onClickCloseSidebar}
					openSavedModal={SavePortal.open}
					openSavedErrorModal={SaveErrorPortal.open}
				/>
			</SideBarLayout>

			<DelQuestionPortal.Render>
				<ConfirmModal
					modal={DelQuestionPortal}
					onConfirm={onDeleteQuestion}
					text={`${selectedDateAt}일자 질문을\n` + `삭제하시겠습니까?`}
				/>
			</DelQuestionPortal.Render>

			<SavePortal.Render>
				<AlertModal modal={SavePortal} text='저장이 완료되었습니다.' />
			</SavePortal.Render>

			<SaveErrorPortal.Render>
				<AlertModal
					modal={SaveErrorPortal}
					text='저장중 문제가 발생했습니다.'
				/>
			</SaveErrorPortal.Render>
		</div>
	);
}
