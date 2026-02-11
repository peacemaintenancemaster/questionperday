import { css, useTheme } from '@emotion/react';
import { Fragment, useRef, useState, type ChangeEventHandler } from 'react';
import { config } from '~/config';
import { useAddPresignedImage } from '~/hooks/useAddPresigendImage';
import { Icon } from '~/images';
import { theme } from '~/style/theme';
import { AddImageButtonStyle as styles } from './AddImageButton.style';

interface Props {
	imageHeight: number;
	buttonHeight: number;
	uploadImage: (fileList: FileList) => Promise<
		{
			id: string;
			filename: string;
			ext: string;
		}[]
	>;
	imageIdList: string[];
}

export const AddImageButton = ({
	imageHeight,
	buttonHeight,
	uploadImage,
	imageIdList,
}: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const theme = useTheme();

	const onClickAddImageButton = () => {
		if (!inputRef.current) return;

		inputRef.current.click();
	};

	const onChangeImage: ChangeEventHandler<HTMLInputElement> = async e => {
		if (!e.target.files) return;

		await uploadImage(e.target.files);
	};

	return (
		<Fragment>
			{Boolean(imageIdList.length && !!imageIdList[0]) ? (
				<div css={styles.imageWrap}>
					<img
						src={config.image.host + imageIdList[0]}
						css={[styles.image, { height: `${imageHeight}px` }]}
					/>

					<button css={styles.editImageButton} onClick={onClickAddImageButton}>
						<Icon.Photo />
					</button>
				</div>
			) : (
				<>
					<button
						onClick={onClickAddImageButton}
						css={[styles.addImageButton, { height: buttonHeight }]}>
						<Icon.Plus color={theme.color.main} size='14' />

						<p css={styles.caption14}>이미지 추가</p>
					</button>
				</>
			)}
			<input
				onChange={onChangeImage}
				type='file'
				ref={inputRef}
				style={{
					display: 'none',
				}}
			/>
		</Fragment>
	);
};
