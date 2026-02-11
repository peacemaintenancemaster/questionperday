import { useMutation } from '@tanstack/react-query';
import { AnswerAPI, AnswerBody } from '../api';

export const useAddAnswer = () => {
	return useMutation({
		mutationFn: ({
			answer,
			questionId,
		}: {
			answer: AnswerBody;
			questionId: number;
		}) => AnswerAPI.add(questionId, answer),
	});
};
