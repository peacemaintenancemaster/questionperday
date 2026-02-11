import { z } from 'zod';
import type { QuestionType } from '~/types/answer/answer';

// 1. 변수(스키마)를 먼저 정의합니다.
export const questionBaseSchema = z.object({
    id: z.number().optional(),
    article: z.string().nullable(),
    title: z.string().min(0),
    subText: z.string().min(0),
    dateAt: z.string(),
    needPhone: z.boolean().optional().default(false),
    needNickname: z.boolean().optional().default(false),
    timeAt: z.string().optional(),
    isTemp: z.boolean().optional(),
    logoImageId: z.string().optional(),
});

// 2. 정의된 변수에서 타입을 추출합니다.
export type QuestionBaseSchema = z.infer<typeof questionBaseSchema>;

export type QuestionSchemaWithType = QuestionBaseSchema & {
    type?: QuestionType;
};

export const initBaseQuestion = {
    title: '',
    subText: '',
    dateAt: new Date().toISOString().split('T')[0], // 클라이언트 규격 통일
    needNickname: false,
    logoImageId: '',
    article: '',
    needPhone: false,
    timeAt: '',
};