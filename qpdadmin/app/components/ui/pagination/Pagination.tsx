import { css } from '@emotion/react';
import { memo, useEffect, useState } from 'react';
import { Icon } from '~/images';

interface StyledType {
	padding?: string;
	margin?: string;
	width?: string;
	justifyContent?: string;
}

interface PropsType {
	pageSize: number;
	limit?: number;
	wrapStyles?: StyledType;
	page: number;
	pageRouting: (page: number) => void;
}

export const Pagination = memo((props: PropsType) => {
	const { pageSize, limit = 6, wrapStyles, page, pageRouting } = props;

	const [currentPageList, setCurrentPageList] = useState<number[]>([]);
	const [totalPageList, setTotalPageList] = useState<number[][]>([]);

	//1,2,3,4,5,6 현재 페이지 리스트
	useEffect(() => {
		const remain = page % limit;

		switch (remain) {
			case 1:
				setCurrentPageList(totalPageList[Math.floor(page / limit)]);
				break;
			case 0:
				setCurrentPageList(totalPageList[Math.floor(page / limit) - 1]);
				break;
			default:
				break;
		}
		if (pageSize === page) {
			setCurrentPageList(totalPageList.slice(-1)[0]);
		}
		// eslint-disable-next-line
	}, [page, pageSize]);

	const sliceArrayByLimit = (pageSize: number, limit: number) => {
		const totalPageArray = Array(pageSize)
			.fill(0)
			.map((_, i) => i);
		return Array(Math.ceil(pageSize / limit))
			.fill(0)
			.map(() => totalPageArray.splice(0, limit));
	};

	useEffect(() => {
		const slicedPageArray = sliceArrayByLimit(pageSize, limit);

		setTotalPageList(slicedPageArray);
		setCurrentPageList(slicedPageArray[0]);
	}, [pageSize, limit]);

	const onClickPrevNext = (type: string) => {
		switch (type) {
			case 'doublePrev':
				pageRouting(1);
				break;
			case 'prev':
				pageRouting(page - 1);
				break;
			case 'next':
				pageRouting(page + 1);
				break;
			case 'doubleNext':
				pageRouting(pageSize);
				break;
			default:
				break;
		}
	};

	// CSS 스타일 정의
	const paginationWrapStyles = css`
		display: flex;
		align-items: center;
		justify-content: ${wrapStyles?.justifyContent || 'flex-end'};
		width: ${wrapStyles?.width || '100%'};
		height: 32px;
		margin: ${wrapStyles?.margin || '0'};
		padding: ${wrapStyles?.padding || '0'};
	`;

	const buttonStyles = (left: boolean, disabled: boolean) => css`
		cursor: ${disabled ? 'default' : 'pointer'};
		transform: rotate(${left ? 0 : 180}deg);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		margin: 0 5px;
		background-color: #fff;
		border: 1px solid #dbdbdb;
		border-radius: 32px;

		&:hover {
			opacity: ${disabled ? 1 : 0.8};
		}
	`;

	const pageButtonWrapStyles = css`
		display: flex;
		align-items: center;
		justify-content: center;
		width: auto;
		height: 32px;
		margin: 0 10px;
	`;

	const pageButtonStyles = (isSelected: boolean) => css`
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		margin: 0 5px;
		font-size: 16px;
		color: ${isSelected ? '#00ce7c' : '#000'};
		background-color: #fff;
		border: none;

		&:hover {
			opacity: 0.8;
		}
	`;

	if (pageSize === 1) return <></>;

	return (
		<div css={paginationWrapStyles}>
			<button
				disabled={page === 1}
				css={buttonStyles(true, page === 1)}
				onClick={() => onClickPrevNext('doublePrev')}>
				{Array.from({ length: 2 }).map((_, idx) => (
					<Icon.ArrowLeft
						key={idx}
						color={page === 1 ? '#dbdbdb' : '#00CE7C'}
						size='8'
					/>
				))}
			</button>
			<button
				disabled={page === 1}
				css={buttonStyles(true, page === 1)}
				onClick={() => {
					onClickPrevNext('prev');
				}}>
				<Icon.ArrowLeft color={page === 1 ? '#dbdbdb' : '#00CE7C'} size='10' />
			</button>
			<div css={pageButtonWrapStyles}>
				{!!currentPageList?.length &&
					currentPageList.map(i => (
						<button
							key={i + 1}
							onClick={() => {
								pageRouting(i + 1);
							}}
							css={pageButtonStyles(page === i + 1)}>
							{i + 1}
						</button>
					))}
			</div>
			<button
				disabled={page === pageSize}
				css={buttonStyles(false, page === pageSize)}
				onClick={() => {
					onClickPrevNext('next');
				}}>
				<Icon.ArrowRight
					color={page === pageSize ? '#dbdbdb' : '#00CE7C'}
					size='10'
				/>
			</button>
			<button
				disabled={page === pageSize}
				css={buttonStyles(false, page === pageSize)}
				onClick={() => {
					onClickPrevNext('doubleNext');
				}}>
				{Array.from({ length: 2 }).map((_, idx) => (
					<Icon.ArrowRight
						key={idx}
						color={page === pageSize ? '#dbdbdb' : '#00CE7C'}
						size='8'
					/>
				))}
			</button>
		</div>
	);
});
