import * as stylex from '@stylexjs/stylex';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { produce } from 'immer';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { QUERY_KEYS } from '~/shared/constants/query/query-key';
import { useLogin } from '~/domain/user/hooks/mutation/useLogin';
import { colors, flex } from '~/shared/style/common.stylex';

export const Route = createFileRoute('/user/auth/login')({
	component: RouteComponent,
});

function RouteComponent() {
	const [input, setInput] = useState({
		email: '',
		password: '',
	});
	const queryClient = useQueryClient();
	const { mutate, data, isSuccess } = useLogin();

	useEffect(() => {
		if (!isSuccess || !data) return;

		queryClient.setQueryData(QUERY_KEYS.auth.login, data);
	}, [isSuccess, data, queryClient]);

	const onChangeInput: ChangeEventHandler<HTMLInputElement> = e =>
		setInput(
			produce(draft => {
				draft[e.target.name as keyof typeof draft] = e.target.value;
			}),
		);

	return (
		<section {...stylex.props(styles.base, flex.column)}>
			<input name='email' onChange={onChangeInput} value={input.email} />
			<input
				name='password'
				onChange={onChangeInput}
				value={input.password}
				type='password'
			/>

			<button {...stylex.props(styles.button)} onClick={() => mutate(input)}>
				로그인
			</button>
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
