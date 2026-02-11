import { useState } from 'react';
import { ImageAPI } from '~/api/image';

const parseFileName = (fileName: string) => {
	const lastDotIndex = fileName.lastIndexOf('.');
	if (lastDotIndex === -1) {
		return { filename: fileName, ext: '' };
	}
	return {
		filename: fileName.slice(0, lastDotIndex),
		ext: fileName.slice(lastDotIndex + 1),
	};
};

const createImageListFromFiles = (
	fileList: FileList,
	presignedUrlList: { id: string; presignedUrl: string }[],
) => {
	return Array.from(fileList).map((file, idx) => {
		const { filename, ext } = parseFileName(file.name);
		return {
			id: presignedUrlList[idx].id,
			filename,
			ext,
		};
	});
};

export const useAddPresignedImage = () => {
	const [isUploading, setIsUploading] = useState(false);
	const [imageIdList, setImageIdList] = useState<string[]>([]);
	const [multiImageList, setMultiImageList] = useState<string[]>([]);

	const uploadImage = async (fileList: FileList, isMulti: boolean = false) => {
		if (fileList.length === 0) return;

		setIsUploading(true);

		try {
			// 1. Presigned URL 목록 가져오기
			const { presignedUrlList } = await ImageAPI.getS3PreSignUrl(
				fileList.length,
			);

			const uploadPromises = Array.from(fileList).map((file, idx) =>
				ImageAPI.putS3ToImage(presignedUrlList[idx].presignedUrl, file),
			);

			await Promise.all(uploadPromises);

			const imageList = createImageListFromFiles(fileList, presignedUrlList);

			await ImageAPI.addImage(imageList);

			isMulti
				? setImageIdList(prev =>
						Array.from(new Set([...prev, ...imageList.map(img => img.id)])),
				  )
				: setImageIdList(imageList.map(img => img.id));

			return imageList;
		} catch (error) {
			console.error('이미지 업로드 실패:', error);
			setImageIdList([]);
		} finally {
			setIsUploading(false);
		}
	};

	const uploadMultiImage = (fileList: FileList) => uploadImage(fileList, true);

	return {
		uploadMultiImage,
		uploadImage,
		isUploading,
		imageIdList,
	};
};
