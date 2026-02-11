import { z } from 'zod';

export const questionSchema = z.object({
	id: z.number().optional(),
	title: z.string(),
	subText: z.string(),
	article: z.string().nullable(),
	dateAt: z.string(),
	timeAt: z.string(),
	needPhone: z.boolean(),
	needNickname: z.boolean(),
	logoImageId: z.string().nullable(),
});

export type QuestionSchema = z.infer<typeof questionSchema>;
