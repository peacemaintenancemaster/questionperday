import type { Theme } from '@emotion/react';
import { css, useTheme } from '@emotion/react';
import { use } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { MiniCalendar } from '~/components/ui/calendar/mini/mini-calendar';
import { AddAdminSidebar } from '~/features/auth/components/sidebar/add-admin-sidebar';
import { PreviewCard } from '~/features/question/components/preview/preview-card';
import { PreviewItem } from '~/features/question/components/preview/preview-item';
import { QuestionContext } from '~/features/question/context/question';
import type { QuestionBaseSchema } from '~/features/question/schema/question.add';
import { useCalendar } from '~/hooks/useCalendar';
import { useModal } from '~/hooks/useModal';
import { Icon } from '~/images';
import { theme } from '~/style/theme';
import type { QuestionType } from '~/types/answer/answer';

export function CalendarPanel() {
	const [searchParams] = useSearchParams();
	const selectedDate = searchParams.get('dateAt') as string;
	const theme = useTheme();
	const { state: questionState } = use(QuestionContext);
	const previewData =
		questionState.calendarMap[selectedDate] ??
		({} as QuestionBaseSchema & { type: QuestionType });
	MiniCalendar;
	const navigate = useNavigate();
	const AddSidebarPortal = useModal('add-adm-sidebar');
	const calendarState = useCalendar();

	const onClickOpenAddADM = () => AddSidebarPortal.open();

	const onClickRouteBanner = () => navigate('/banner', { state: {} });

	return (
		<aside css={wrap}>
			<div css={panel(theme)}>
				<MiniCalendar {...calendarState} />

				<div css={divider(theme)} />

				<div css={paddingWrap}>
					{Boolean(previewData.title) && (
						<PreviewCard>
							<PreviewItem {...previewData} />
						</PreviewCard>
					)}
				</div>
			</div>

			<div css={buttonGroup}>
				<button css={bottomMenuWrap} onClick={onClickOpenAddADM}>
					<Icon.Plus color={theme.color.main} size='14' />

					<p css={caption13}>관리자 등록</p>
				</button>

				<div css={verticalDivider} />

				<button css={bottomMenuWrap} onClick={onClickRouteBanner}>
					<Icon.Check />

					<p css={caption13}>배너 관리</p>
				</button>
			</div>

			<AddSidebarPortal.Render
				type='sidebar'
				animationType='slideInRight'
				withoutOverlay>
				<AddAdminSidebar onClickClose={AddSidebarPortal.close} />
			</AddSidebarPortal.Render>
		</aside>
	);
}

const wrap = css({
	display: 'flex',
	flexDirection: 'column',
	gap: '12px',
});

const panel = (theme: Theme) => css`
	width: 280px;
	height: 948px;

	display: flex;
	flex-direction: column;

	border-radius: 20px;
	background-color: ${theme.color.grayScale.gray20};
	margin-top: 11px;
`;

const divider = (theme: Theme) => css`
	margin: 0 16px;
	height: 1px;
	background-color: ${theme.color.grayScale.gray40};
`;

const paddingWrap = css`
	justify-content: center;
	align-items: center;
	padding: 0 16px;
	margin-top: 12px;
`;

const bottomMenuWrap = css({
	display: 'flex',
	gap: '4px',
	alignItems: 'center',
});

const buttonGroup = css({
	display: 'flex',
	alignItems: 'center',
});

const caption13 = css({
	...theme.fontStyles['Caption/Caption1_13∙100_SemiBold'],
	color: theme.color.main,
});

const verticalDivider = css({
	backgroundColor: theme.color.grayScale.gray50,
	width: '1px',
	height: '100%',
	margin: '0 8px',
});
