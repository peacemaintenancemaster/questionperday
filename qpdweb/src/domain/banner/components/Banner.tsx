import * as stylex from '@stylexjs/stylex';
import { useGetBannerList } from '../hooks/useGetBannerList';
import { config } from '~/config';

export const Banner = () => {
	const { data } = useGetBannerList();

	if (!data?.bannerList.length) return <></>;

	const onClickOpenLink = (href: string) => {
		if (href.includes('questionperday.me')) {
			window.open(`https://questionperday.me/${href}`, '_blank');

			return;
		}

		window.open(href, '_blank');
	};

	return (
		<img
			onClick={() => onClickOpenLink(data?.bannerList[0]?.href)}
			alt='배너 이미지'
			{...stylex.props(styles.base)}
			src={config.image.host + data?.bannerList[0]?.imageId}
		/>
	);
};

const styles = stylex.create({
	base: {
		display: 'flex',
		flexShrink: 0,
		cursor: 'pointer',
		width: '100%',
		height: 114,
		borderRadius: 14,
		zIndex: 999,
		position: 'relative',
		top: '0',
	},
});
