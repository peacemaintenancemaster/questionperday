import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useState, useEffect } from 'react';
import { supabase } from '~/lib/supabase';
import { useUser, useUserStore } from '~/domain/user/store';
import useModal from '~/shared/hooks/useModal';
import { LoginBottomSheet } from '~/shared/components/ui/bottom-sheet/login/login-bottom-sheet';

export const Route = createFileRoute('/question/')({
  component: QuestionPage,
});

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

function QuestionPage() {
  const navigate = useNavigate();
  const user = useUser();
  const isLogin = useUserStore((s) => s.isLogin);
  const loginModal = useModal('login');

  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoQuestionModal, setShowNoQuestionModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // 입력 상태들
  const [text, setText] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. 오늘의 질문 가져오기 및 24시간 타이머 체크
  // 1. 오늘의 질문 가져오기 및 24시간 타이머 체크
  useEffect(() => {
    const fetchTodayQuestion = async () => {
      setIsLoading(true);
      try {
        // 한국 시간 기준 오늘 날짜 구하기
        // 한국 시간 기준 오늘 날짜 구하기
        const now = new Date();
        const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        const todayStr = kstDate.toISOString().split('T')[0];

        // 오늘 날짜의 질문 가져오기
        // 오늘 날짜의 질문 가져오기
        const { data, error } = await supabase
          .from('question')
          .select('*')
          .eq('dateAt', todayStr)
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('질문 조회 에러:', error);
          setShowNoQuestionModal(true);
        } else if (!data) {
          setShowNoQuestionModal(true);
        } else {
          // 24시간 체크: created_at 시간으로부터 24시간 경과 여부 확인
          const createdAt = new Date(data.created_at);
          const twentyFourHoursLater = new Date(
            createdAt.getTime() + 24 * 60 * 60 * 1000
          );
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

    const intervalId = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1000) {
          clearInterval(intervalId);
          setShowNoQuestionModal(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeRemaining]);

  const handleInteraction = () => {
    if (!isLogin) {
      loginModal.open();
      return false;
    }
    return true;
  };

  // 2. 답변하기
  const handleSubmit = async () => {
    if (!handleInteraction()) return;

    if (!text.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('answer').insert({
        questionId: question?.id,
        userId: user?.id,
        text: text,
        nickname: nickname.trim() || '',
        phone: phone.trim() || '',
        isDel: isPrivate ? 1 : 0,
      });

      if (error) {
        throw error;
      }
      // 성공적으로 제출되었을 때 로직 (e.g., 페이지 이동, 메시지 표시)
      alert('답변이 성공적으로 기록되었습니다.');
      navigate({ to: '/' });
    } catch (error) {
      console.error('답변 제출 에러:', error);
      alert('답변을 기록하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
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
              : '세상에서 감정 하나를\n없앨 수 있다면?'}
          </p>
          <p {...stylex.props(styles.modalSubText)}>
            {timeRemaining !== null && timeRemaining <= 0
              ? ''
              : '관의 힘을 믿고, 사고 따문 것들을 미뤄지 않고\n기록해 보세요.'}
          </p>
          <button
            {...stylex.props(styles.modalButton)}
            onClick={() => navigate({ to: '/' })}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.base, flex.column)}>
      <div {...stylex.props(styles.timerWrapper)}>
        {timeRemaining !== null && (
          <p {...stylex.props(typo['Body/Body1_16∙100_SemiBold'])}>
            {formatTime(timeRemaining)}
          </p>
        )}
      </div>

      <div {...stylex.props(styles.questionSection, flex.column)}>
        <p {...stylex.props(typo['Body/Body2_15∙150_Regular'], styles.dateText)}>
          {question.display_date || question.dateAt}
        </p>
        <span {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.qLabel)}>
          Q.
        </span>
        <h2
          {...stylex.props(
            typo['Heading/H1_28∙130_SemiBold'],
            styles.questionTitle
          )}
        >
          {question.content || question.title}
        </h2>
        {question.subtitle && (
          <p
            {...stylex.props(
              typo['Body/Body3_14∙150_Regular'],
              styles.questionSubtitle
            )}
          >
            {question.subtitle}
          </p>
        )}
      </div>

      <textarea
        {...stylex.props(styles.textArea, typo['Body/Body1_16∙150_Regular'])}
        placeholder="오늘의 생각을 기록해보세요."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleInteraction}
      />

      <div {...stylex.props(styles.inputGroup, flex.column)}>
        {question.needNickname ? (
          <div {...stylex.props(styles.inputRow)}>
            <span {...stylex.props(styles.label)}>닉네임</span>
            <input
              type="text"
              {...stylex.props(styles.input)}
              placeholder="닉네임 (선택)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onFocus={handleInteraction}
            />
          </div>
        ) : null}

        {question.needPhone ? (
          <div {...stylex.props(styles.inputRow)}>
            <span {...stylex.props(styles.label)}>연락처</span>
            <input
              type="text"
              inputMode="numeric"
              {...stylex.props(styles.input)}
              placeholder="숫자만 입력 (선택)"
              value={phone}
              onChange={(e) => {
                const onlyNum = e.target.value.replace(/[^0-9]/g, '');
                setPhone(onlyNum);
              }}
              onFocus={handleInteraction}
            />
          </div>
        ) : null}

        <div {...stylex.props(styles.checkboxRow, flex.vertical)}>
          <input
            type="checkbox"
            id="private-answer"
            checked={isPrivate}
            onChange={() => {
              if (handleInteraction()) {
                setIsPrivate(!isPrivate);
              }
            }}
            {...stylex.props(styles.checkbox)}
          />
          <label
            htmlFor="private-answer"
            {...stylex.props(
              styles.checkboxLabel,
              typo['Body/Body3_14∙100_Regular']
            )}
          >
            혼자서만 보는 답변으로 기록하기
          </label>
        </div>
      </div>

      {/* 하단 버튼 */}
      <button {...stylex.props(styles.startButton)} onClick={handleStartAnswer}>
        <span {...stylex.props(typo['Body/Body2_15∙150_Regular'])}>답변 보내기</span>
      </button>

      {!isLogin && (
        <loginModal.Render type="bottomSheet" animationType="bottomSheet">
          <LoginBottomSheet />
        </loginModal.Render>
      )}
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
    justifyContent: 'space-between',
  },
  header: {},
  dateText: {
    color: colors.gray60,
    marginBottom: 8,
  },
  title: {},
  textArea: {
    flex: 1,
    border: 'none',
    resize: 'none',
    outline: 'none',
    caretColor: colors.main,
    margin: '24px 0',
  },
  inputGroup: {
    gap: 16,
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  label: {
    width: 60,
    color: colors.gray80,
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '8px 0',
    borderBottom: `1px solid ${colors.gray30}`,
  },
  checkboxRow: {
    gap: 8,
    cursor: 'pointer',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    cursor: 'pointer',
  },
  checkboxLabel: {
    color: colors.gray80,
    cursor: 'pointer',
  },
  submitBtn: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.main,
    border: 'none',
    cursor: 'pointer',
    marginTop: 24,
  },
  timerWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 24,
    color: colors.main,
  },
  questionSection: {
    gap: 16,
  },
  qLabel: {
    color: colors.main,
  },
  questionTitle: {
    color: colors.gray90,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  questionSubtitle: {
    color: colors.gray60,
    marginTop: 8,
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '24px',
    backgroundColor: colors.white,
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
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: '32px 24px',
    maxWidth: 340,
    padding: '32px 24px',
    maxWidth: 340,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    gap: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontSize: 20,
    fontWeight: 600,
    color: colors.gray90,
    textAlign: 'center',
    lineHeight: 1.4,
    whiteSpace: 'pre-line',
  },
  modalSubText: {
    fontSize: 14,
    color: colors.gray70,
    textAlign: 'center',
    lineHeight: 1.5,
    whiteSpace: 'pre-line',
  },
  modalButton: {
    width: '100%',
    padding: '16px',
    borderRadius: 12,
    padding: '16px',
    borderRadius: 12,
    backgroundColor: colors.main,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: 15,
    fontSize: 15,
    fontWeight: 600,
  },
});