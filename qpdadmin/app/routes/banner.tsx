import { BannerListTable } from '~/features/banner/components/table/banner-list-table';
import { BannerStyle as styles } from '~/features/banner/banner.style';
import { Header } from '~/components/layout/header/Header';
import { Icon } from '~/images';
import { theme } from '~/style/theme';
import { useNavigate } from 'react-router';
import { useModal } from '~/hooks/useModal';
import { useQueryParser } from '~/hooks/useQueryParser';
import { useGetBanner } from '~/features/banner/components/hooks/useGetBannerList';
import { BannerSidebar } from '~/features/banner/components/sidebar/add-banner-sidebar';
import type { Banner } from '~/features/banner/schema';

const Banner = () => {
	const navigate = useNavigate();
	const AddBannerSidebarPortal = useModal('add-banner');
	const EditBannerSidebarPortal = useModal<Banner>('edit-banner');
	const [queryParams, setQueryParams] = useQueryParser<{
		page: number;
		limit: number;
	}>();
	const { data } = useGetBanner({ page: queryParams.page ?? 1 });

	const onClickOpenSidebar = () => AddBannerSidebarPortal.open();

	const onClickOpenEditSidebar = (banner: Banner) => {
		EditBannerSidebarPortal.open(banner);
	};

	return (
		<section css={styles.wrap}>
			<Header />

			<section css={styles.tableWrap}>
				<header css={styles.header}>
					<div css={styles.headerLeftWrap}>
						<button onClick={() => navigate('/')}>
							<Icon.ArrowLeft color={theme.color.grayScale.gray90} size='20' />
						</button>

						<p css={styles.headerLeftText}>배너 관리</p>
					</div>

					<button css={styles.addText} onClick={onClickOpenSidebar}>
						배너추가
					</button>
				</header>
				<BannerListTable
					bannerList={data?.bannerList}
					onClickOpenEditSidebar={onClickOpenEditSidebar}
				/>
			</section>

			<AddBannerSidebarPortal.Render
				type='sidebar'
				animationType='slideInRight'
				withoutOverlay>
				<BannerSidebar onClickClose={AddBannerSidebarPortal.close} />
			</AddBannerSidebarPortal.Render>

			<EditBannerSidebarPortal.Render
				type='sidebar'
				animationType='slideInRight'
				withoutOverlay>
				<BannerSidebar
					onClickClose={EditBannerSidebarPortal.close}
					banner={EditBannerSidebarPortal?.value}
				/>
			</EditBannerSidebarPortal.Render>
		</section>
	);
};

export default Banner;
