import { z } from 'zod';

export type AnswerSchema = z.infer<typeof answerSchema>;

export const answerSchema = z.object({
	id: z.number(),
	questionId: z.number(),
	userId: z.number(),
	text: z.string(),
	nickname: z.string(),
	dateAt: z.string(),
	isShared: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
	user: z.object({
		id: z.number(),
		email: z.string(),
		nickname: z.string(),
	}),
});
