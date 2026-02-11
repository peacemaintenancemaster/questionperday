import type { Banner, BannerBody } from '~/features/banner/schema';
import { instance } from '../instance';

export const add = async (banner: BannerBody) =>
	await instance
		.post('banner', {
			json: banner,
		})
		.json();

export const getList = async ({
	page,
	limit,
}: {
	page: number;
	limit: number;
}): Promise<{
	metadata: {
		limit: number;
		page: number;
		totalCount: number;
	};
	bannerList: Banner[];
}> =>
	await instance
		.get('banner', {
			searchParams: {
				page,
				limit,
			},
		})
		.json();

export const editHide = async (id: number) =>
	await instance.patch(`banner/${id}`);

export const edit = async (banner: BannerBody & { id: number }) =>
	await instance.put(`banner/${banner.id}`, { json: banner });

export const del = async (id: number) => await instance.delete(`banner/${id}`);
