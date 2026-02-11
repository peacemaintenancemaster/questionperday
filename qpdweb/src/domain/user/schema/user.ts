import { z } from 'zod';

export const userSchema = z.object({
	id: z.number(),
	email: z.string(),
	nickname: z.string(),
});

export type UserSchema = z.infer<typeof userSchema>;
