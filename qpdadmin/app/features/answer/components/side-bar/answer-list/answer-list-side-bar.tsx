import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { AnswerSidebarLayout } from '../layout/answer-side-bar-layout';
import { AnswerListStyle as styles } from './answer-list-side.style';
import type { AnswerSchema } from '~/features/answer/schema/answer';
import { useGetAnswerList } from '~/features/answer/hooks/useGetAnswerList';
import { format } from 'date-fns';

interface Props {
	onClickClose: () => void;
	questionId: number;
}

export const AnswerListSidebar = (props: Props) => {
	const { onClickClose = () => {}, questionId = 0 } = props;
	const { data, isLoading, isError } = useGetAnswerList(questionId);

	const answerList = data?.answerList || [];

	const columnHelper = createColumnHelper<AnswerSchema>();

	const columns = [
		columnHelper.accessor('user.nickname', {
			id: 'user.nickname',
			header: '이름 (카카오 프로필 닉네임)',
			cell: info => <div css={styles.textCell}>{info?.getValue()}</div>,
			size: 172,
		}),
		columnHelper.accessor('nickname', {
			id: 'nickname',
			header: '닉네임',
			cell: info => <div css={styles.textCell}>{info?.getValue()}</div>,
			size: 172,
		}),
		// columnHelper.accessor('id', {
		// 	header: '연락처',
		// 	cell: info => <div css={styles.textCell}></div>,
		// 	size: 172,
		// }),
		columnHelper.accessor('createdAt', {
			header: '가입일',
			cell: info => {
				const formattedDateAt = format(new Date(info?.getValue()), 'yy.MM.dd');

				return <div css={styles.textCell}>{formattedDateAt}</div>;
			},
			size: 172,
		}),
		columnHelper.accessor('text', {
			header: '질문 내용',
			cell: info => <div css={styles.textCell}>{info.getValue()}</div>,
			size: 350,
		}),
		columnHelper.accessor('createdAt', {
			header: '답변 생성 시간',
			cell: info => <div css={styles.textCell}>{info.getValue()}</div>,
			size: 350,
		}),
		columnHelper.accessor('isShared', {
			header: '나만 보기',
			cell: info => (
				<div css={styles.textCell}>{Boolean(info.getValue()) ? 'X' : 'O'}</div>
			),
			size: 61,
		}),
	];

	const table = useReactTable({
		data: answerList,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	if (isLoading) {
		return (
			<AnswerSidebarLayout onClickClose={onClickClose}>
				<div>데이터 로딩 중...</div>
			</AnswerSidebarLayout>
		);
	}

	if (isError) {
		return (
			<AnswerSidebarLayout onClickClose={onClickClose}>
				<div>데이터를 불러오는 데 실패했습니다.</div>
			</AnswerSidebarLayout>
		);
	}

	return (
		<AnswerSidebarLayout onClickClose={onClickClose}>
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
						{table.getRowModel().rows.map(row => (
							<tr key={row.id} css={styles.tableRow}>
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
					</tbody>
				</table>
			</div>
		</AnswerSidebarLayout>
	);
};
