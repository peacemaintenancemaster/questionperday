import { BannerListTableStyle as styles } from './banner-list-table.style';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useModal } from '~/hooks/useModal';
import React, { useMemo } from 'react';
import type { Banner } from '../../schema';
import { config } from '~/config';
import { ToggleSwitch } from '~/components/ui/button/toggle/toggle-button';
import { AlertModal } from '~/components/ui/modal/alert';
import { useEditHide } from '../hooks/useEditHide';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/constant/query-key';
import { useDelBanner } from '~/hooks/useDelBanner';
import { useTheme } from '@emotion/react';

interface Props {
	bannerList: Banner[];
	onClickOpenEditSidebar: (banner: Banner) => void;
}

export const BannerListTable = ({
	bannerList = [],
	onClickOpenEditSidebar = () => {},
}: Props) => {
	const theme = useTheme();
	const columnHelper = createColumnHelper<Banner>();
	const SavePortal = useModal('save-alert');
	const SaveErrorPortal = useModal('admin-save-error');
	const data = useMemo(() => bannerList, [bannerList]);
	const queryClient = useQueryClient();
	const { mutateAsync: editHide } = useEditHide();
	const { mutateAsync: del } = useDelBanner();

	const onClickEditHide = async (id: number) => {
		try {
			await editHide(id);
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banner.list] });
			SavePortal.open();
		} catch (error) {
			SaveErrorPortal.open();
		}
	};

	const onClickDel = async (id: number) => {
		try {
			await del(id);
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banner.list] });
			SavePortal.open();
		} catch (error) {
			SaveErrorPortal.open();
		}
	};

	const onClickOpenLink = (href: string) => {
		if (href.includes('questionperday.me')) {
			window.open(`https://questionperday.me/${href}`, '_blank');

			return;
		}

		window.open(href, '_blank');
	};

	const columns = [
		columnHelper.accessor('imageId', {
			id: 'imageId',
			header: '배너 이미지',
			cell: info => (
				<img
					css={styles.imagePreview}
					src={config.image.host + info.getValue()}
				/>
			),
			size: 423,
		}),
		columnHelper.accessor('title', {
			id: 'title',
			header: '배너 이름',
			cell: info => <div css={styles.textCell}>{info?.getValue()}</div>,
			size: 166,
		}),
		columnHelper.accessor('href', {
			header: '베너 링크',
			cell: info => (
				<div css={styles.textCell}>
					<p
						css={styles.linkText}
						onClick={() => onClickOpenLink(info.getValue())}>
						{info.getValue()}
					</p>
				</div>
			),
			size: 160,
		}),
		columnHelper.accessor('isHide', {
			header: '노출 여부',
			cell: info => {
				return (
					<div css={styles.textCell}>
						<ToggleSwitch
							isOn={Boolean(info.getValue())}
							onClickToggle={() => onClickEditHide(info.row.original.id)}
						/>
					</div>
				);
			},
			size: 65,
		}),
		columnHelper.accessor('id', {
			header: '삭제',
			cell: info => (
				<div css={styles.textCell}>
					<p
						css={[
							styles.linkText,
							{
								color: theme.color.red.secondary,
								textAlign: 'center',
							},
						]}
						onClick={e => {
							e.stopPropagation();
							onClickDel(info.getValue());
						}}>
						삭제
					</p>
				</div>
			),
			size: 80,
		}),
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<section css={styles.wrap}>
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
								onClick={e => {
									onClickOpenEditSidebar(row.original);
								}}>
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

			<SavePortal.Render>
				<AlertModal modal={SavePortal} text='처리가 완료되었습니다.' />
			</SavePortal.Render>

			<SaveErrorPortal.Render>
				<AlertModal
					modal={SaveErrorPortal}
					text='수정 중 문제가 발생했습니다.'
				/>
			</SaveErrorPortal.Render>
		</section>
	);
};
