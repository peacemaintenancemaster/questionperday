import { AlertModal } from '~/components/ui/modal/alert';
import { AddAdminLabel } from '~/features/auth/components/sidebar/label/label';
import { useModal } from '~/hooks/useModal';
import { Icon } from '~/images';
import { AddBannerSidebarStyle as styles } from './add-banner-sidebar.style';
import { useRef, useState, type ChangeEventHandler } from 'react';
import { produce } from 'immer';
import { AddImageButton } from '~/components/ui/button/add-image/AddImageButton';
import { useAddBanner } from '../hooks/useAddBanner';
import { useAddPresignedImage } from '~/hooks/useAddPresigendImage';
import type { Banner } from '../../schema';
import { useEditBanner } from '~/hooks/useEditBanner';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/constant/query-key';
interface Props {
	onClickClose: () => void;
	banner?: Partial<Banner>;
}

export const BannerSidebar = ({ onClickClose, banner }: Props) => {
	const SavePortal = useModal('admin-save');
	const SaveErrorPortal = useModal('admin-save-error');
	const queryClient = useQueryClient();
	const { mutateAsync: add } = useAddBanner();
	const { mutateAsync: edit } = useEditBanner();
	const { uploadImage, imageIdList } = useAddPresignedImage();

	const [form, setForm] = useState({
		title: '',
		href: '',
		imageId: imageIdList[0] || '',
		...banner,
	});

	const canRegister = [form.title, form.href, imageIdList.length].every(
		Boolean,
	);

	const onChangeInput: ChangeEventHandler<HTMLInputElement> = e => {
		setForm(
			produce(draft => {
				draft[e.target.name] = e.target.value;
			}),
		);
	};

	const addBanner = async () => {
		try {
			await add({ ...form, imageId: imageIdList[0] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banner.list] });

			SavePortal.open();
		} catch (error) {
			SaveErrorPortal.open();
		}
	};

	const editBanner = async () => {
		try {
			await edit({ ...form, imageId: imageIdList[0], id: form.id });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banner.list] });

			SavePortal.open();
		} catch (error) {
			SaveErrorPortal.open();
		}
	};

	const onClickButton = !!form.id ? editBanner : addBanner;

	return (
		<section css={styles.wrap}>
			<header css={styles.header}>
				<button onClick={onClickClose}>
					<Icon.ArrowLeft size='24' />
				</button>
			</header>

			<div css={styles.body}>
				<div css={styles.row}>
					<AddAdminLabel text='배너 이미지 (339 * 114)' />

					<div css={styles.imageButtonWrap}>
						<AddImageButton
							imageHeight={80}
							buttonHeight={38}
							uploadImage={uploadImage}
							imageIdList={
								Boolean(imageIdList.length) ? imageIdList : [form.imageId]
							}
						/>
					</div>
				</div>

				<div css={styles.row}>
					<AddAdminLabel text='배너 이름' />

					<input
						onChange={onChangeInput}
						css={styles.input}
						placeholder='배너 이름을 입력해주세요'
						name='title'
						value={form.title}
					/>
				</div>

				<div css={styles.row}>
					<AddAdminLabel text='배너 링크' />

					<div css={styles.inputWrap}>
						<input
							onChange={onChangeInput}
							css={styles.input}
							placeholder='배너 링크를 입력해주세요'
							name='href'
							value={form.href}
						/>
					</div>
				</div>
			</div>

			<button
				css={styles.button}
				disabled={!canRegister}
				onClick={onClickButton}>
				배너 등록
			</button>

			<SavePortal.Render>
				<AlertModal modal={SavePortal} text='등록이 완료되었습니다.' />
			</SavePortal.Render>

			<SaveErrorPortal.Render>
				<AlertModal
					modal={SaveErrorPortal}
					text='저장중 문제가 발생했습니다.'
				/>
			</SaveErrorPortal.Render>
		</section>
	);
};
