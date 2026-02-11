import { Icon } from '~/images';
import { AddSidebarStyle as styles } from './add-admin-sidebar.style';
import { AddAdminLabel } from './label/label';
import { useState, type ChangeEventHandler } from 'react';
import { produce } from 'immer';
import { useAddAdmin } from '../../hooks/useAddAdmin';
import { useModal } from '~/hooks/useModal';
import { AlertModal } from '~/components/ui/modal/alert';

interface Props {
	onClickClose: () => void;
}

export const AddAdminSidebar = ({ onClickClose }: Props) => {
	const { mutate, isSuccess, isError } = useAddAdmin();
	const [form, setForm] = useState({
		username: '',
		password: '',
		passwordConfirm: '',
	});

	const [isPasswordShow, setIsPasswordShow] = useState(false);
	const [isPasswordConfirmShow, setIsPasswordConfirmShow] = useState(false);
	const SavePortal = useModal('admin-save');
	const SaveErrorPortal = useModal('admin-save-error');

	const canRegister = [
		form.username,
		form.password,
		form.passwordConfirm,
	].every(Boolean);

	const onChangeInput: ChangeEventHandler<HTMLInputElement> = e => {
		setForm(
			produce(draft => {
				draft[e.target.name] = e.target.value;
			}),
		);
	};

	const onClickPassword = () => {
		setIsPasswordShow(s => !s);
	};

	const onClickPasswordConfirm = () => {
		setIsPasswordConfirmShow(s => !s);
	};

	const onClickRegisterAdmin = () => {
		if (form.password !== form.passwordConfirm) return;

		mutate({
			username: form.username,
			password: form.password,
		});

		if (isSuccess) {
			SavePortal.open();
			return;
		}

		if (isError) {
			SaveErrorPortal.open();
			return;
		}
	};

	return (
		<section css={styles.wrap}>
			<header css={styles.header}>
				<button onClick={onClickClose}>
					<Icon.ArrowLeft size='24' />
				</button>
			</header>

			<div css={styles.body}>
				{/* <div css={styles.row}>
					<AddAdminLabel isRequired text='이름' />
					<input css={styles.input} placeholder='이름을 입력해주세요.' />
				</div>

				<div css={styles.row}>
					<AddAdminLabel isRequired text='생년월일' />
					<input
						css={styles.input}
						placeholder='생년월일 8자리를 입력해주세요.'
					/>
				</div> */}

				<div css={styles.row}>
					<AddAdminLabel isRequired text='아이디' />
					<input
						onChange={onChangeInput}
						css={styles.input}
						placeholder='사용할 아이디를 입력해주세요.'
						name='username'
					/>
				</div>

				<div css={styles.row}>
					<AddAdminLabel isRequired text='비밀번호' />

					<div css={styles.inputWrap}>
						<input
							onChange={onChangeInput}
							css={styles.input}
							placeholder='비밀번호를 입력해주세요.'
							type={isPasswordShow ? 'text' : 'password'}
							name='password'
						/>

						<button css={styles.showWrap} onClick={onClickPassword}>
							<Icon.Hide size='20' />
						</button>
					</div>
				</div>

				<div css={styles.row}>
					<AddAdminLabel isRequired text='비밀번호 확인' />

					<div css={styles.inputWrap}>
						<input
							onChange={onChangeInput}
							css={styles.input}
							placeholder='다시 한번 입력해주세요'
							type={isPasswordConfirmShow ? 'text' : 'password'}
							name='passwordConfirm'
						/>

						<button css={styles.showWrap} onClick={onClickPasswordConfirm}>
							<Icon.Hide size='20' />
						</button>
					</div>
				</div>
			</div>

			<button
				css={styles.button}
				disabled={!canRegister}
				onClick={onClickRegisterAdmin}>
				관리자 등록
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
