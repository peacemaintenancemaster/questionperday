import { createFileRoute, Link } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { AnswerAPI } from '~/domain/answer/api';
import { useTodayQuestionInfo } from '~/domain/question/hooks/useTodayQuestionInfo';
import { useTodayQuestion } from '~/domain/question/hooks/useTodayQuestion';

export const Route = createFileRoute('/')({
    component: HomePage,
});

function HomePage() {
    // 1. 누적 답변 횟수 데이터
    const { data: countData } = useQuery({
        queryKey: ['answer-counts'],
        queryFn: () => AnswerAPI.getAnswerCounts(),
    });

    // 2. 오늘의 질문 데이터
    const { data: todayQuestionInfo } = useTodayQuestionInfo();
    const { data: questionData } = useTodayQuestion(todayQuestionInfo?.questionId);

    const count = countData?.answerCounts ?? 0;
    const question = questionData?.question;

    return (
        <main {...stylex.props(styles.container, flex.column)}>
            {/* 횟수 안내 문구 (수정됨) */}
            <section {...stylex.props(styles.header)}>
                <p {...stylex.props(typo['Body/Body2_15∙150_Regular'], styles.countInfo)}>
                    지금까지 총 <strong {...stylex.props(styles.bold)}>{count}</strong>번 기록했어요!
                </p>
            </section>

            {/* 질문 표시 영역 (없는 카드 대신 직접 구현) */}
            <section {...stylex.props(styles.content)}>
                {question ? (
                    <Link 
                        to="/question/write" 
                        search={{ step: 1 }}
                        {...stylex.props(styles.questionBox, flex.column)}
                    >
                        <span {...stylex.props(typo['Body/Body3_14∙150_Regular'], styles.date)}>
                            {question.dateAt}
                        </span>
                        <h2 {...stylex.props(typo['Heading/H3_20∙130_SemiBold'], styles.title)}>
                            {question.title}
                        </h2>
                        <div {...stylex.props(styles.bottomRow, flex.row, flex.between)}>
                            <span {...stylex.props(styles.status)}>
                                {todayQuestionInfo?.isAnswered ? '기록 완료' : '기록하기'}
                            </span>
                        </div>
                    </Link>
                ) : (
                    <div {...stylex.props(styles.loading)}>오늘의 질문을 찾는 중...</div>
                )}
            </section>
        </main>
    );
}

const styles = stylex.create({
    container: {
        padding: '24px 20px',
        minHeight: '100vh',
        gap: '32px',
    },
    header: {
        display: 'flex',
    },
    countInfo: {
        color: colors.gray80,
    },
    bold: {
        color: colors.main,
        fontWeight: '700',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
    },
    questionBox: {
        padding: '24px',
        borderRadius: '16px',
        backgroundColor: colors.gray10, // 다크모드 대응 필요 시 색상 변수 확인
        textDecoration: 'none',
        gap: '12px',
    },
    date: {
        color: colors.gray60,
    },
    title: {
        color: colors.gray90,
        wordBreak: 'keep-all',
    },
    bottomRow: {
        marginTop: '12px',
    },
    status: {
        fontSize: '14px',
        color: colors.main,
        fontWeight: '600',
    },
    loading: {
        padding: '40px 0',
        textAlign: 'center',
        color: colors.gray60,
    }
});