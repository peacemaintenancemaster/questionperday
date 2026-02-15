import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useState, useEffect } from 'react';
import { supabase } from '~/lib/supabase';
import { AnswerTimer } from '~/domain/answer/components/timer/answer-timer';

export const Route = createFileRoute('/question/')({
  component: QuestionPage,
});

function QuestionPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoQuestionModal, setShowNoQuestionModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // 1. 오늘의 질문 가져오기 및 24시간 타이머 체크
  useEffect(() => {
    const fetchTodayQuestion = async () => {
      setIsLoading(true);
      try {
        // 한국 시간 기준 오늘 날짜 구하기
        const now = new Date();
        const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        const todayStr = kstDate.toISOString().split('T')[0];

        // 오늘 날짜의 질문 가져오기
        const { data, error } = await supabase
          .from('question')
          .select('*')
          .eq('"dateAt"', todayStr)
          .limit(1)
          .maybeSingle();
        
        if (error) {
          console.error('질문 조회 에러:', error);
          setShowNoQuestionModal(true);
        } else if (!data) {
          // 데이터가 없는 경우
          setShowNoQuestionModal(true);
        } else {
          // 24시간 체크: created_at 시간으로부터 24시간 경과 여부 확인
          const createdAt = new Date(data.created_at);
          const twentyFourHoursLater = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
          const nowTime = new Date();
          
          if (nowTime > twentyFourHoursLater) {
            // 24시간이 지난 경우
            setShowNoQuestionModal(true);
          } else {
            setQuestion(data);
            // 남은 시간 계산 (밀리초)
            setTimeRemaining(twentyFourHoursLater.getTime() - nowTime.getTime());
          }
        }
      } catch (error) {
        console.error('질문 조회 에러:', error);
        setShowNoQuestionModal(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodayQuestion();
  }, []);

  // 타이머 카운트다운
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          setShowNoQuestionModal(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const handleStartAnswer = () => {
    // 답변 작성 페이지로 이동 (질문 데이터를 state로 전달)
    navigate({ 
      to: '/question/write',
      state: { question }
    });
  };

  if (isLoading) {
    return (
      <div {...stylex.props(styles.loading)}>
        <p>오늘의 질문을 불러오는 중...</p>
      </div>
    );
  }

  if (showNoQuestionModal || !question) {
    return (
      <div {...stylex.props(styles.modalOverlay)}>
        <div {...stylex.props(styles.modalContent)}>
          <p {...stylex.props(styles.modalText)}>
            {timeRemaining !== null && timeRemaining <= 0 
              ? '24시간 동안만 답변 가능합니다!' 
              : '세상에서 감정 하나를\n없앨 수 있다면?'}
          </p>
          <p {...stylex.props(styles.modalSubText)}>
            {timeRemaining !== null && timeRemaining <= 0
              ? ''
              : '관의 힘을 믿고, 사고 따문 것들을 미뤄지 않고\n기록해 보세요.'}
          </p>
          <button
            {...stylex.props(styles.modalButton)}
            onClick={() => navigate({ to: '/' })}>
            답변 작성하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.base, flex.column)}>
      {/* 상단 타이머 */}
      <div {...stylex.props(styles.timerWrapper)}>
        <AnswerTimer timeAt={question.created_at} />
      </div>

      {/* 질문 섹션 */}
      <div {...stylex.props(styles.questionSection, flex.column)}>
        <span {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.qLabel)}>
          Q.
        </span>
        <h2 {...stylex.props(typo['Heading/H1_28∙130_SemiBold'], styles.questionTitle)}>
          {question.title}
        </h2>
        {question.subtitle && (
          <p {...stylex.props(typo['Body/Body3_14∙150_Regular'], styles.questionSubtitle)}>
            {question.subtitle}
          </p>
        )}
      </div>

      {/* 하단 버튼 */}
      <button {...stylex.props(styles.startButton)} onClick={handleStartAnswer}>
        <span {...stylex.props(typo['Body/Body2_15∙150_Regular'])}>답변 보내기</span>
      </button>
    </div>
  );
}

const styles = stylex.create({
  base: { 
    padding: '24px 20px', 
    height: '100vh', 
    backgroundColor: colors.white, 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  timerWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 24
  },
  questionSection: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    paddingBottom: 80
  },
  qLabel: {
    color: colors.main,
  },
  questionTitle: {
    color: colors.gray90,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  questionSubtitle: {
    color: colors.gray60,
    marginTop: 8
  },
  startButton: {
    width: '100%', 
    padding: 16, 
    borderRadius: 12,
    backgroundColor: colors.main, 
    border: 'none', 
    cursor: 'pointer',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '24px',
    backgroundColor: colors.white
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: '32px 24px',
    maxWidth: 340,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 600,
    color: colors.gray90,
    textAlign: 'center',
    lineHeight: 1.4,
    whiteSpace: 'pre-line'
  },
  modalSubText: {
    fontSize: 14,
    color: colors.gray70,
    textAlign: 'center',
    lineHeight: 1.5,
    whiteSpace: 'pre-line'
  },
  modalButton: {
    width: '100%',
    padding: '16px',
    borderRadius: 12,
    backgroundColor: colors.main,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 600,
  },
});