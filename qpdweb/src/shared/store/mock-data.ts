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

// [정리] 모든 모의 데이터를 비워 실제 DB 데이터를 받을 준비를 합니다.
const MOCK_QUESTIONS: Question[] = [];
const MOCK_MEMOS: Memo[] = [];

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
                const parts = yearMonth.split('-');
                if (parts.length < 2) return {};
                const year = Number(parts[0]);
                const month = Number(parts[1]);
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