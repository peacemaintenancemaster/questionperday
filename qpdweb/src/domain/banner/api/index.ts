import { instance } from '~/shared/api/instance';

export const getList = async (): Promise<{
	bannerList: Banner[];
}> =>
	await instance
		.get('banner', {
			searchParams: {
				page: 1,
				limit: 99,
			},
		})
		.json();

export const BannerAPI = { getList };

export interface Banner {
	id: number;
	imageId: string;
	title: string;
	href: string;
	createdAt: string;
	updatedAt: string;
}
