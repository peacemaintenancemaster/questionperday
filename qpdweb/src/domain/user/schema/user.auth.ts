import { z } from 'zod';

export const authSchema = z.object({
	email: z.string(),
	password: z.string(),
	nickname: z.string().optional(),
});

export type AuthSchema = z.infer<typeof authSchema>;
