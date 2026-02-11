import { z } from 'zod';

export type LoginSchema = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
	username: z.string().nonempty('아이디를 입력해주세요.'),
	password: z.string().nonempty('비밀번호를 입력해주세요.'),
});
