import { css, useTheme, type Theme } from '@emotion/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useSearchParams } from 'react-router';
import { Icon } from '~/images';
import { MainHeaderStyle as styles } from './main-header.style';
import { color } from 'motion/react';

interface Props {
	currentSelectedDate: Date;
	onClickToday: () => void;
	onClickMonth: (params: number) => void;
	isCurrentMonth: boolean;
	onClickOpenAddSideBar: () => void;
}

export function MainHeader(props: Props) {
	const theme = useTheme();
	const [searchParams, setSearchParams] = useSearchParams();
	const {
		currentSelectedDate,
		onClickMonth,
		onClickToday,
		onClickOpenAddSideBar,
	} = props;

	const displayedDate = currentSelectedDate
		? new Date(currentSelectedDate)
		: new Date();

	const displayedMonth = format(displayedDate, 'yyyy년 MM월', { locale: ko });

	const viewType = searchParams.get('view') as string;

	function onClickViewTypeButton(type: string) {
		searchParams.set('view', type);
		setSearchParams(searchParams);
	}

	return (
		<header css={styles.header}>
			<div css={styles.shadowWrap} />

			<div css={styles.monthButtonWrap}>
				<button onClick={() => onClickMonth(-1)} css={{ cursor: 'pointer' }}>
					<Icon.ArrowLeft size='20' />
				</button>
				<div css={styles.monthTextWrap}>
					<h4 css={styles.monthText(theme)}>{displayedMonth}</h4>

					<button css={styles.badge(theme)} onClick={onClickToday}>
						오늘
					</button>
				</div>

				<button onClick={() => onClickMonth(1)} css={{ cursor: 'pointer' }}>
					<Icon.ArrowRight size='20' />
				</button>
			</div>
			<div css={styles.viewButtonWrap}>
				<button css={styles.addButtonWrap} onClick={onClickOpenAddSideBar}>
					<Icon.Plus color={theme.color.main} size='14' />

					<p css={styles.addText}>질문 추가</p>
				</button>

				<button
					onClick={() => onClickViewTypeButton('calendar')}
					css={{ cursor: 'pointer' }}>
					<Icon.Calendar
						size='22'
						color={
							viewType === 'calendar'
								? theme.color.grayScale.gray80
								: theme.color.grayScale.gray50
						}
					/>
				</button>

				<button
					onClick={() => onClickViewTypeButton('list')}
					css={{ cursor: 'pointer' }}>
					<Icon.List
						size='22'
						color={
							viewType === 'list'
								? theme.color.grayScale.gray80
								: theme.color.grayScale.gray50
						}
					/>
				</button>
			</div>
		</header>
	);
}
