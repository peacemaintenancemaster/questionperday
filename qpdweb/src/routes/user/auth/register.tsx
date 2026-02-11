import * as stylex from '@stylexjs/stylex';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { produce } from 'immer';
import { ChangeEventHandler, useState } from 'react';
import { useRegister } from '~/domain/user/hooks/mutation/useRegister';
import { useUserStore } from '~/domain/user/store';
import { colors, flex } from '~/shared/style/common.stylex';

export const Route = createFileRoute('/user/auth/register')({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { mutateAsync } = useRegister();

	const [input, setInput] = useState({
		password: '',
	});
	const { user } = useUserStore();

	const onChangeInput: ChangeEventHandler<HTMLInputElement> = e =>
		setInput(
			produce(draft => {
				draft[e.target.name as keyof typeof draft] = e.target.value;
			}),
		);

	const onClickRegister = async () => {
		await mutateAsync({
			email: user.email as string,
			password: input.password,
			nickname:
				'abcbasb' + Math.random().toString(36).substring(2, 15).slice(0, 10),
			// nickname: user.name,
		});

		navigate({ to: '/user/auth/login' });
	};

	return (
		<section {...stylex.props(styles.base, flex.column)}>
			<input
				name='password'
				onChange={onChangeInput}
				value={input.password}
				type='password'
			/>

			<button onClick={onClickRegister}>회원가입</button>
		</section>
	);
}

const styles = stylex.create({
	base: {
		gap: 16,
	},
	button: {
		color: colors.main,
	},
});
