import ky from 'ky';
import { imageInstance, instance } from '../instance';

const getS3PreSignUrl = async (
	length: number,
): Promise<{
	presignedUrlList: {
		id: string;
		presignedUrl: string;
	}[];
}> => await imageInstance.get('', { searchParams: { length } }).json();

const putS3ToImage = async (url: string, file: File) =>
	await ky.put(url, {
		body: file,
	});

const addImage = async (
	imageList: {
		id: string;
		filename: string;
		ext: string;
	}[],
) =>
	await imageInstance
		.post('', {
			json: { imageList },
		})
		.json();

export const ImageAPI = { getS3PreSignUrl, putS3ToImage, addImage };
