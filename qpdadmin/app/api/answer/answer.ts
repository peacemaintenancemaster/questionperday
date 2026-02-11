import type { AnimationOptionsWithValueOverrides } from 'motion/react';
import { instance } from '../instance';
import type { AnswerSchema } from '~/features/answer/schema/answer';

export const getList = async (
	questionId: number,
	meta: Partial<{
		page: number;
		limit: number;
	}>,
): Promise<{
	metadata: {
		page: number;
		limit: number;
		hasNextPage: boolean;
		totalCount: number;
	};
	answerList: AnswerSchema[];
}> =>
	await instance
		.get(`question/${questionId}/answer`, {
			searchParams: {
				page: meta.page,
				limit: meta.limit,
			},
		})
		.json();
