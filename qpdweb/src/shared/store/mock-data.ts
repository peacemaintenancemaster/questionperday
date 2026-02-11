import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Question } from '~/domain/answer/api';

export interface Memo {
	id: number;
	answerId: number;
	questionId: number;
	text: string;
	createdAt: string;
}

// Mock questions/answers for testing
const MOCK_QUESTIONS: Question[] = [
	{
		id: 1,
		title: '세상에서 감정을 딱 하나 없앨 수 있다면?',
		subText: '',
		article: '',
		dateAt: '2024-12-02',
		timeAt: '09:00',
		needPhone: false,
		needNickname: false,
		logoImageId: null,
		answerList: [
			{
				id: 1,
				questionId: 1,
				userId: 1,
				text: '저는 불안을 없애고 싶어요. 불안이 없다면 더 자유롭게 도전할 수 있을 것 같아요. 매일 걱정 없이 살 수 있다면 정말 행복할 것 같습니다.',
				nickname: null,
				dateAt: '2024-12-02',
				createdAt: '2024-12-02T09:00:00Z',
				updatedAt: '2024-12-02T09:00:00Z',
			},
		],
	},
	{
		id: 2,
		title: '10년 후의 나에게 한마디를 한다면?',
		subText: '',
		article: '',
		dateAt: '2024-12-01',
		timeAt: '09:00',
		needPhone: false,
		needNickname: false,
		logoImageId: null,
		answerList: [
			{
				id: 2,
				questionId: 2,
				userId: 1,
				text: '지금의 걱정들이 얼마나 사소했는지 웃으며 이야기해줘. 그리고 지금 이 순간을 더 즐기라고 말해주고 싶어.',
				nickname: null,
				dateAt: '2024-12-01',
				createdAt: '2024-12-01T09:00:00Z',
				updatedAt: '2024-12-01T09:00:00Z',
			},
		],
	},
	{
		id: 3,
		title: '가장 기억에 남는 여행지는 어디인가요?',
		subText: '',
		article: '',
		dateAt: '2024-11-28',
		timeAt: '09:00',
		needPhone: false,
		needNickname: false,
		logoImageId: null,
		answerList: [
			{
				id: 3,
				questionId: 3,
				userId: 1,
				text: '제주도에서 보낸 겨울이 가장 기억에 남아요. 한라산에서 본 설경이 정말 아름다웠어요.',
				nickname: null,
				dateAt: '2024-11-28',
				createdAt: '2024-11-28T09:00:00Z',
				updatedAt: '2024-11-28T09:00:00Z',
			},
		],
	},
	{
		id: 4,
		title: '나만의 작은 행복은 무엇인가요?',
		subText: '',
		article: '',
		dateAt: '2024-11-25',
		timeAt: '09:00',
		needPhone: false,
		needNickname: false,
		logoImageId: null,
		answerList: [
			{
				id: 4,
				questionId: 4,
				userId: 1,
				text: '아침에 일어나서 마시는 따뜻한 커피 한 잔. 그 조용한 시간이 저에게는 가장 큰 행복이에요.',
				nickname: null,
				dateAt: '2024-11-25',
				createdAt: '2024-11-25T09:00:00Z',
				updatedAt: '2024-11-25T09:00:00Z',
			},
		],
	},
	{
		id: 5,
		title: '요즘 가장 몰두하고 있는 것은?',
		subText: '',
		article: '',
		dateAt: '2024-11-23',
		timeAt: '09:00',
		needPhone: false,
		needNickname: false,
		logoImageId: null,
		answerList: [
			{
				id: 5,
				questionId: 5,
				userId: 1,
				text: '요즘 글쓰기에 빠져 있어요. 매일 조금씩 생각을 정리하면서 글로 쓰다 보면 마음이 편해져요.',
				nickname: null,
				dateAt: '2024-11-23',
				createdAt: '2024-11-23T09:00:00Z',
				updatedAt: '2024-11-23T09:00:00Z',
			},
		],
	},
	{
		id: 6,
		title: '지금 당장 하고 싶은 일이 있다면?',
		subText: '',
		article: '',
		dateAt: '2024-12-04',
		timeAt: '09:00',
		needPhone: false,
		needNickname: false,
		logoImageId: null,
		answerList: [
			{
				id: 6,
				questionId: 6,
				userId: 1,
				text: '지금 당장 바다를 보러 가고 싶어요. 파도 소리를 들으며 아무 생각 없이 앉아있고 싶습니다.',
				nickname: null,
				dateAt: '2024-12-04',
				createdAt: '2024-12-04T09:00:00Z',
				updatedAt: '2024-12-04T09:00:00Z',
			},
		],
	},
];

const MOCK_MEMOS: Memo[] = [
	{
		id: 1,
		answerId: 1,
		questionId: 1,
		text: '다시 읽어보니 불안보다는 후회를 없애고 싶은 마음이 더 큰 것 같다. 후회 없이 살자.',
		createdAt: '2024-12-03T14:30:00Z',
	},
];

type MockStore = {
	questions: Question[];
	memos: Memo[];
	actions: {
		addMemo: (questionId: number, answerId: number, text: string) => void;
		getMemosByQuestion: (questionId: number) => Memo[];
		getLatestMemoByQuestion: (questionId: number) => Memo | undefined;
		getQuestionByDate: (dateAt: string) => Question | undefined;
		getAnswerCountByMonth: (yearMonth: string) => Record<string, number>;
		getAllQuestions: () => Question[];
	};
};

export const useMockStore = create<MockStore>()(
	immer((set, get) => ({
		questions: MOCK_QUESTIONS,
		memos: MOCK_MEMOS,
		actions: {
			addMemo: (questionId: number, answerId: number, text: string) => {
				set(state => {
					const newMemo: Memo = {
						id: Date.now(),
						answerId,
						questionId,
						text,
						createdAt: new Date().toISOString(),
					};
					state.memos.push(newMemo);
				});
			},
			getMemosByQuestion: (questionId: number) => {
				return get()
					.memos.filter(m => m.questionId === questionId)
					.sort(
						(a, b) =>
							new Date(b.createdAt).getTime() -
							new Date(a.createdAt).getTime(),
					);
			},
			getLatestMemoByQuestion: (questionId: number) => {
				const memos = get()
					.memos.filter(m => m.questionId === questionId)
					.sort(
						(a, b) =>
							new Date(b.createdAt).getTime() -
							new Date(a.createdAt).getTime(),
					);
				return memos[0];
			},
			getQuestionByDate: (dateAt: string) => {
				return get().questions.find(q => q.dateAt === dateAt);
			},
			getAnswerCountByMonth: (yearMonth: string) => {
				const [year, month] = yearMonth.split('-').map(Number);
				const map: Record<string, number> = {};
				get().questions.forEach(q => {
					const d = new Date(q.dateAt);
					if (d.getFullYear() === year && d.getMonth() + 1 === month) {
						map[q.dateAt] = q.answerList.length;
					}
				});
				return map;
			},
			getAllQuestions: () => {
				return [...get().questions].sort(
					(a, b) =>
						new Date(b.dateAt).getTime() - new Date(a.dateAt).getTime(),
				);
			},
		},
	})),
);

export const useMockActions = () => useMockStore(s => s.actions);
