import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { flex, colors, typo } from '~/shared/style/common.stylex';
import { useTodayQuestionInfo } from '~/domain/question/hooks/useTodayQuestionInfo';
import { useTodayQuestion } from '~/domain/question/hooks/useTodayQuestion';

export const Route = createFileRoute('/question/')({
  component: QuestionPage,
});

function QuestionPage() {
  const navigate = useNavigate();
  
  const { data: todayInfo, isLoading: isInfoLoading } = useTodayQuestionInfo();
  const { data: questionData, isLoading: isQuestionLoading } = useTodayQuestion(todayInfo?.questionId);

  const handleStartAnswer = () => {
    navigate({ to: '/question/write', search: { step: 1 } });
  };

  if (isInfoLoading || isQuestionLoading) {
    return (
        <div {...stylex.props(styles.container, flex.center)}>
            <div {...stylex.props(typo['Body/Body1_16∙100_SemiBold'])}>
                로딩 중...
            </div>
        </div>
    );
  }

  if (!questionData?.question) {
    return (
      <div {...stylex.props(styles.container, flex.center)}>
        <div {...stylex.props(typo['Body/Body1_16∙100_SemiBold'])}>
          오늘의 질문을 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <main {...stylex.props(styles.container, flex.column)}>
      <div {...stylex.props(styles.content)}>
        
        <div style={{ textAlign: 'center' }}>
            {/* [수정] 인라인 객체 제거 -> styles.dateText 사용 */}
            <div {...stylex.props(typo['Body/Body2_14∙150_Regular'], styles.dateText)}>
                {questionData.question.dateAt}
            </div>
            
            {/* [수정] 인라인 객체 제거 -> styles.questionTitle 사용 */}
            <h2 {...stylex.props(typo['Heading/H2_24∙140_Bold'], styles.questionTitle)}>
                {questionData.question.title}
            </h2>
        </div>

      </div>

      <div {...stylex.props(styles.footer)}>
        <button 
          onClick={handleStartAnswer}
          {...stylex.props(styles.button)}
        >
          답변하기
        </button>
      </div>
    </main>
  );
}

const styles = stylex.create({
  container: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    paddingBottom: 80,
  },
  content: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // [수정] 위에서 쓰던 스타일을 정식으로 정의함
  dateText: {
    color: colors.gray60,
    marginBottom: 12,
  },
  questionTitle: {
    color: colors.gray90,
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px',
    backgroundColor: '#fff',
    borderTop: `1px solid ${colors.gray20}`,
    maxWidth: '600px',
    margin: '0 auto',
  },
  button: {
    width: '100%',
    height: '56px',
    borderRadius: '16px',
    backgroundColor: colors.main,
    color: '#fff',
    border: 'none',
    fontSize: '18px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':active': {
      backgroundColor: '#E65050',
    }
  },
});