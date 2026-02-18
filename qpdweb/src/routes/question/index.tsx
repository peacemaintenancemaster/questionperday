import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useState, useEffect } from 'react';
import { supabase } from '~/lib/supabase';
import { AnswerTimer } from '~/domain/answer/components/timer/answer-timer';
import { CheckBox } from '~/shared/components/ui/checkbox/checkbox';
import useModal from '~/shared/hooks/useModal';
import { LoginBottomSheet } from '~/shared/components/ui/bottom-sheet/login/login-bottom-sheet';
import { useUserStore } from '~/domain/user/store';
import { AnswerAPI } from '~/domain/answer/api';

export const Route = createFileRoute('/question/')({
  component: QuestionPage,
});

function QuestionPage() {
  const navigate = useNavigate();
  const { isLogin } = useUserStore();
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoQuestionModal, setShowNoQuestionModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  // 답변 작성 관련 상태
  const [answer, setAnswer] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTriggeredLogin, setHasTriggeredLogin] = useState(false);
  
  // 단계 상태: 'question' | 'write' | 'nickname' | 'complete'
  const [step, setStep] = useState<'question' | 'write' | 'nickname' | 'complete'>('question');
  
  const LoginPortal = useModal('question-login-portal');

  // 1. 오늘의 질문 가져오기 및 24시간 타이머 체크
  useEffect(() => {
    const fetchTodayQuestion = async () => {
      setIsLoading(true);
      try {
        const now = new Date();
        const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        const todayStr = kstDate.toISOString().split('T')[0];

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
          setShowNoQuestionModal(true);
        } else {
          const createdAt = new Date(data.created_at);
          const twentyFourHoursLater = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
          const nowTime = new Date();
          
          if (nowTime > twentyFourHoursLater) {
            setShowNoQuestionModal(true);
          } else {
            setQuestion(data);
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

  // 로그인 트리거
  const triggerLogin = () => {
    if (!isLogin && !hasTriggeredLogin) {
      setHasTriggeredLogin(true);
      LoginPortal.open();
    }
  };

  // 답변 작성 시작
  const handleStartAnswer = () => {
    setStep('write');
  };

  // 텍스트 입력 포커스
  const handleTextareaFocus = () => {
    triggerLogin();
  };

  // 체크박스 클릭
  const handleCheckboxClick = () => {
    triggerLogin();
    setIsPrivate(!isPrivate);
  };

  // 작성 완료
  const handleWriteComplete = () => {
    if (!answer.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    if (!isLogin) {
      alert('로그인이 필요합니다.');
      LoginPortal.open();
      return;
    }

    setStep('nickname');
  };

  // 닉네임 단계에서 완료
  const handleNicknameComplete = async () => {
    setIsSubmitting(true);

    try {
      await AnswerAPI.add(question.id, {
        text: answer,
        nickname: nickname.trim(),
        phone: '',
        isShared: !isPrivate
      });

      localStorage.setItem('answer', JSON.stringify({
        question: question,
        text: answer,
        nickname: nickname || '익명'
      }));

      setStep('complete');
    } catch (error) {
      console.error('답변 저장 실패:', error);
      alert('답변 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이전 단계로
  const handleBack = () => {
    if (step === 'write') {
      setStep('question');
    } else if (step === 'nickname') {
      setStep('write');
    }
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
              : ''}
          </p>
          <button
            {...stylex.props(styles.modalButton)}
            onClick={() => navigate({ to: '/' })}>
            확인
          </button>
        </div>
      </div>
    );
  }

  // 질문 표시 단계
  if (step === 'question') {
    return (
      <>
        <div {...stylex.props(styles.base, flex.column)}>
          <div {...stylex.props(styles.questionHeader, flex.column)}>
            <span {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.qLabel)}>
              Q.
            </span>
            <h2 {...stylex.props(typo['Heading/H1_28∙130_SemiBold'], styles.questionTitle)}>
              {question.title}
            </h2>
          </div>

          <button {...stylex.props(styles.startButton)} onClick={handleStartAnswer}>
            답변 보내기
          </button>
        </div>
      </>
    );
  }

  // 작성 단계
  if (step === 'write') {
    const isAnswerMax = answer.length >= 300;
    const charCountColor = !answer ? colors.gray70 : isAnswerMax ? colors.redPrimary : colors.main;

    return (
      <>
        <div {...stylex.props(styles.base, flex.column)}>
          <div {...stylex.props(styles.writeHeader, flex.between, flex.vertical)}>
            <span {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.qLabel)}>
              Q.
            </span>
            <AnswerTimer timeAt={question.created_at} />
          </div>

          <h2 {...stylex.props(typo['Heading/H1_28∙130_SemiBold'], styles.questionTitle)}>
            {question.title}
          </h2>

          <div {...stylex.props(styles.charCountWrap, flex.end, flex.vertical)}>
            <span
              {...stylex.props(typo['Caption/Caption1_13∙100_Regular'])}
              style={{ color: charCountColor }}>
              ({answer.length}/300)
            </span>
          </div>

          <textarea
            {...stylex.props(styles.textarea, typo['Body/Body3_14∙150_Regular'])}
            placeholder="여기구 저기구 답변 작성 중입니다. ㅣ"
            maxLength={300}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onFocus={handleTextareaFocus}
          />

          <div {...stylex.props(styles.watchAlone, flex.start)} onClick={handleCheckboxClick}>
            <CheckBox isChecked={isPrivate} />
            <div {...stylex.props(flex.column, styles.checkboxTextWrap)}>
              <p {...stylex.props(typo['Caption/Caption1_13∙100_SemiBold'], styles.checkboxTitle)}>
                혼자서만 보는 답변으로 기록하기
              </p>
              <p {...stylex.props(typo['Caption/Caption1_13∙100_Regular'], styles.checkboxDesc)}>
                체크하면 다음 뉴스레터에 실리지 않아요.
              </p>
            </div>
          </div>

          <button {...stylex.props(styles.completeButton)} onClick={handleWriteComplete}>
            작성 완료
          </button>
        </div>

        <LoginPortal.Render type='bottomSheet' animationType='bottomSheet'>
          <LoginBottomSheet />
        </LoginPortal.Render>
      </>
    );
  }

  // 닉네임 설정 단계
  if (step === 'nickname') {
    return (
      <div {...stylex.props(styles.nicknameBase, flex.column)}>
        <div {...stylex.props(styles.nicknameTimerWrap)}>
          <AnswerTimer timeAt={question.created_at} />
        </div>

        <div {...stylex.props(styles.nicknameHeader, flex.column)}>
          <p {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.nicknameSubtitle)}>
            내일의 뉴스레터에 활용됩니다!
          </p>
          <h2 {...stylex.props(typo['Heading/H1_28∙130_SemiBold'], styles.nicknameTitle)}>
            적어주신 답변과 어울리는{'\n'}닉네임을 정해주세요.
          </h2>
          <p {...stylex.props(typo['Body/Body3_14∙150_Regular'], styles.nicknameDescription)}>
            입력하지 않을 시 랜덤 닉네임으로 발행됩니다.
          </p>
        </div>

        <input
          {...stylex.props(styles.nicknameInput, typo['Body/Body2_15∙150_Regular'])}
          placeholder="감귤웹123"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
        />

        <button 
          {...stylex.props(styles.nicknameSaveButton)} 
          onClick={handleNicknameComplete}
          disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : '답변 보내기'}
        </button>
      </div>
    );
  }

  // 완료 단계
  if (step === 'complete') {
    return (
      <div {...stylex.props(styles.completeBase, flex.column)}>
        <div {...stylex.props(styles.completeTimerWrap)}>
          <AnswerTimer timeAt={question.created_at} />
        </div>

        <div {...stylex.props(styles.completeContent, flex.column)}>
          <span {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.qLabel)}>
            Q.
          </span>
          <h2 {...stylex.props(typo['Heading/H1_28∙130_SemiBold'], styles.questionTitle)}>
            {question.title}
          </h2>
          <p {...stylex.props(typo['Body/Body3_14∙150_Regular'], styles.completeDesc)}>
            관의 힘을 믿고, 사고 떠오른 것들을 미루지 않고{'\n'}
            기록해 보세요.
          </p>
        </div>

        <div {...stylex.props(styles.completeTimeBox)}>
          <AnswerTimer timeAt={question.created_at} showFullFormat />
          <p {...stylex.props(typo['Caption/Caption1_13∙100_Regular'], styles.completeTimeText)}>
            24시간 동안만 답변 보낼 수 있어요!
          </p>
        </div>

        <button {...stylex.props(styles.completeGoButton)} onClick={() => navigate({ to: '/' })}>
          답변 작성하기
        </button>
      </div>
    );
  }

  return null;
}

const styles = stylex.create({
  base: { 
    padding: '24px 18px', 
    minHeight: '100vh',
    backgroundColor: colors.white, 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
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
  // 질문 표시 단계
  questionHeader: {
    gap: 16,
    paddingTop: 40,
    flex: 1,
    justifyContent: 'center'
  },
  qLabel: {
    color: colors.main,
  },
  questionTitle: {
    color: colors.gray90,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  startButton: {
    width: '100%', 
    padding: '18px', 
    borderRadius: 12,
    backgroundColor: colors.main, 
    border: 'none', 
    cursor: 'pointer',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    lineHeight: '150%'
  },
  // 작성 단계
  writeHeader: {
    width: '100%',
    marginBottom: 16
  },
  charCountWrap: {
    padding: '16px 0',
  },
  textarea: {
    width: '100%',
    flex: 1,
    minHeight: 200,
    borderTop: `1px solid ${colors.gray40}`,
    borderBottom: `1px solid ${colors.gray40}`,
    resize: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    padding: '16px 0',
    outline: 'none',
    backgroundColor: colors.white,
    color: colors.gray90
  },
  watchAlone: {
    width: '100%',
    padding: '12px 8px',
    borderRadius: '8px',
    border: `1px solid ${colors.gray40}`,
    minHeight: '58px',
    gap: 8,
    cursor: 'pointer',
    marginTop: 16,
    marginBottom: 16
  },
  checkboxTextWrap: {
    gap: 4
  },
  checkboxTitle: {
    color: colors.gray80,
  },
  checkboxDesc: {
    color: colors.gray70,
  },
  completeButton: {
    width: '100%', 
    padding: '18px', 
    borderRadius: 12,
    backgroundColor: colors.main, 
    border: 'none', 
    cursor: 'pointer',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    lineHeight: '150%'
  },
  // 닉네임 단계
  nicknameBase: {
    padding: '24px 18px',
    minHeight: '100vh',
    backgroundColor: colors.white,
    justifyContent: 'space-between'
  },
  nicknameTimerWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 24
  },
  nicknameHeader: {
    gap: 12,
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40
  },
  nicknameSubtitle: {
    color: colors.main
  },
  nicknameTitle: {
    color: colors.gray90,
    whiteSpace: 'pre-line',
    lineHeight: '130%'
  },
  nicknameDescription: {
    color: colors.gray80,
    marginTop: 8
  },
  nicknameInput: {
    width: '100%',
    padding: '16px 20px',
    borderRadius: 12,
    border: `1px solid ${colors.gray40}`,
    outline: 'none',
    color: colors.gray90,
    backgroundColor: colors.white,
    fontSize: 15,
    marginBottom: 16,
    '::placeholder': {
      color: colors.gray40
    }
  },
  nicknameSaveButton: {
    width: '100%', 
    padding: '18px', 
    borderRadius: 12,
    backgroundColor: colors.main, 
    border: 'none', 
    cursor: 'pointer',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    lineHeight: '150%',
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  // 완료 단계
  completeBase: {
    padding: '24px 18px',
    minHeight: '100vh',
    backgroundColor: colors.white,
    justifyContent: 'space-between'
  },
  completeTimerWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 24
  },
  completeContent: {
    gap: 16,
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40
  },
  completeDesc: {
    color: colors.gray60,
    marginTop: 8,
    whiteSpace: 'pre-line',
    lineHeight: '150%'
  },
  completeTimeBox: {
    width: '100%',
    padding: '16px',
    borderRadius: 12,
    border: `1px solid ${colors.main}`,
    backgroundColor: colors.secondary,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  completeTimeText: {
    color: colors.gray70
  },
  completeGoButton: {
    width: '100%', 
    padding: '18px', 
    borderRadius: 12,
    backgroundColor: colors.main, 
    border: 'none', 
    cursor: 'pointer',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    lineHeight: '150%'
  }
});