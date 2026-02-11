import {
	questionBaseSchema,
	type QuestionBaseSchema,
} from '~/features/question/schema/question.add';
import type { QuestionType } from '~/types/answer/answer';

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

/**
 * 두 날짜가 같은 날짜인지 비교 (시간 정보 제외)
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};

/**
 * 첫 번째 날짜가 두 번째 날짜보다 이전인지 비교 (시간 정보 제외)
 */
export const isBeforeDay = (date1: Date, date2: Date): boolean => {
	if (date1.getFullYear() !== date2.getFullYear()) {
		return date1.getFullYear() < date2.getFullYear();
	}
	if (date1.getMonth() !== date2.getMonth()) {
		return date1.getMonth() < date2.getMonth();
	}
	return date1.getDate() < date2.getDate();
};

/**
 * 첫 번째 날짜/시간이 두 번째 날짜/시간보다 이전인지 비교 (날짜와 시간 모두 고려)
 */
export const isBeforeDateTime = (date1: Date, date2: Date): boolean => {
	// 같은 날짜인 경우 시간을 비교
	if (isSameDay(date1, date2)) {
		// 시간이 같으면 분 비교
		if (date1.getHours() === date2.getHours()) {
			return date1.getMinutes() < date2.getMinutes();
		}
		return date1.getHours() < date2.getHours();
	}
	// 다른 날짜인 경우 날짜 비교
	return isBeforeDay(date1, date2);
};

/**
 * 질문 맵을 처리하여 타입 정보가 추가된 맵 반환
 */
export const getCombinedDateMap = (
	dateMap: Record<string, QuestionBaseSchema>,
) => {
	const now = new Date();

	return Object.entries(dateMap).reduce((acc, [key, question]) => {
		// 타입 결정
		let type: QuestionType = 'saved';

		// 질문 날짜/시간이 현재 날짜/시간보다 이전이면 'previous'
		if (isBeforeDateTime(new Date(question.dateAt), now)) {
			type = 'previous';
		}
		// 질문 날짜가 현재 날짜보다 이후이고 임시 저장된 경우 'temp'
		else if (question.isTemp) {
			type = 'temp';
		}

		// 결과 객체에 추가
		acc[key] = {
			id: question.id,
			article: question.article,
			title: question.title,
			subText: question.subText,
			dateAt: question.dateAt,
			timeAt: question.timeAt,
			needPhone: question.needPhone,
			needNickname: question.needNickname,
			isTemp: question.isTemp,
			logoImageId: question.logoImageId,
			type,
		};
		return acc;
	}, {} as Record<string, any>);
};

export function formatQuestion(list: QuestionBaseSchema[]) {
	return list.map(x => {
		let type: QuestionType = 'saved';

		if (isBeforeDateTime(new Date(x.dateAt), new Date())) {
			type = 'previous';
		} else {
			type = 'saved';
		}

		return {
			...x,
			type,
		};
	});
}
