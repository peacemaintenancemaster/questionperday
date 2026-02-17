import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useState, useEffect, useRef } from 'react';
import { AnswerTimer } from '~/domain/answer/components/timer/answer-timer';
import { CheckBox } from '~/shared/components/ui/checkbox/checkbox';
import useModal from '~/shared/hooks/useModal';
import { LoginBottomSheet } from '~/shared/components/ui/bottom-sheet/login/login-bottom-sheet';
import { useUserStore } from '~/domain/user/store';

export const Route = createFileRoute('/question/write')({
  component: WriteStep,
});

function WriteStep() {
  const navigate = useNavigate();
  const location = useLocation();
  const question = (location.state as any)?.question;
  const { isLogin } = useUserStore();
  
  const [answer, setAnswer] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [hasTriggeredLogin, setHasTriggeredLogin] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const LoginPortal = useModal('write-login-portal');

  // 질문이 없으면 첫 페이지로 이동
  useEffect(() => {
    if (!question) {
      navigate({ to: '/question' });
    }
  }, [question, navigate]);

  // 로그인 트리거 함수
  const triggerLogin = () => {
    if (!isLogin && !hasTriggeredLogin) {
      setHasTriggeredLogin(true);
      LoginPortal.open();
    }
  };

  // 텍스트 입력 시작 시 로그인 체크
  const handleTextareaFocus = () => {
    triggerLogin();
  };

  // 체크박스 클릭 시 로그인 체크
  const handleCheckboxClick = () => {
    triggerLogin();
    setIsPrivate(!isPrivate);
  };

  const handleNext = () => {
    if (!answer.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    if (!isLogin) {
      alert('로그인이 필요합니다.');
      LoginPortal.open();
      return;
    }

    // [수정] 타입 에러 해결: as any를 사용하여 강제로 이동시킵니다.
    navigate({
      to: '/question/nickname',
      state: {
        question,
        answer,
        isPrivate
      }
    } as any);
  };

  const handlePrev = () => {
    navigate({ to: '/question' });
  };

  if (!question) {
    return null;
  }

  const isAnswerMax = answer.length >= 300;
  const charCountColor = !answer ? colors.gray70 : isAnswerMax ? colors.redPrimary : colors.main;

  return (
    <>
      <div {...stylex.props(styles.base, flex.column)}>
        {/* 상단: Q 레이블과 타이머 */}
        <div {...stylex.props(styles.timerWrap, flex.between, flex.vertical)}>
          <span {...stylex.props(styles.primaryText, typo['Body/Body1_16∙100_SemiBold'])}>
            Q.
          </span>
          <AnswerTimer timeAt={question.created_at} />
        </div>

        {/* 질문 제목 */}
        <h2 {...stylex.props(styles.question, typo['Heading/lines/H1_28∙130_SemiBold_lines'])}>
          {question.title}
        </h2>

        {/* 글자 수 카운터 */}
        <div {...stylex.props(styles.textCountWrap, flex.end, flex.vertical)}>
          <span
            {...stylex.props(typo['Caption/Caption1_13∙100_Regular'])}
            style={{ color: charCountColor }}>
            ({answer.length}/300)
          </span>
        </div>

        {/* 답변 입력 영역 */}
        <textarea
          ref={textareaRef}
          {...stylex.props(styles.textarea, typo['Body/lines/Body3_14∙150_Regular_lines'])}
          placeholder="간단한 생각이라도 좋아요. 지금 떠오른 것들을 미뤄지 않고 기록해 보세요."
          maxLength={300}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onFocus={handleTextareaFocus}
        />

        {/* 혼자 보는 답변 체크박스 */}
        <div {...stylex.props(styles.watchAlone, flex.start)} onClick={handleCheckboxClick}>
          <CheckBox isChecked={isPrivate} />
          <div {...stylex.props(flex.column, styles.gap8)}>
            <p {...stylex.props(typo['Caption/Caption1_13∙100_SemiBold'], styles.highlightedGray)}>
              혼자서만 보는 답변으로 기록하기
            </p>
            <p {...stylex.props(typo['Caption/Caption1_13∙100_Regular'], styles.grayText)}>
              체크하면 다음 뉴스레터에 실리지 않아요.
            </p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div {...stylex.props(flex.row, styles.buttonGroup)}>
          <button
            onClick={handlePrev}
            {...stylex.props(styles.prevButton, typo['Body/Body2_15∙150_Regular'])}>
            이전
          </button>
          <button
            onClick={handleNext}
            {...stylex.props(
              styles.nextButton,
              typo['Body/Body2_15∙150_Regular']
            )}>
            작성 완료
          </button>
        </div>
      </div>

      {/* 로그인 모달 */}
      <LoginPortal.Render type='bottomSheet' animationType='bottomSheet'>
        <LoginBottomSheet />
      </LoginPortal.Render>
    </>
  );
}

const styles = stylex.create({
  base: {
    backgroundColor: colors.white,
    display: 'flex',
    padding: '24px 18px',
    flexDirection: 'column',
    width: '100%',
    height: '100vh',
    gap: 16
  },
  timerWrap: {
    width: '100%',
  },
  primaryText: {
    color: colors.main,
  },
  question: {
    color: colors.gray90,
    marginTop: 8
  },
  textCountWrap: {
    padding: '12px 8px',
  },
  grayText: {
    color: colors.gray70,
  },
  textarea: {
    width: '100%',
    flex: 1,
    borderTop: `1px solid ${colors.gray40}`,
    borderBottom: `1px solid ${colors.gray40}`,
    resize: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    padding: '16px 0',
    outline: 'none',
    backgroundColor: colors.white
  },
  watchAlone: {
    width: '100%',
    padding: '12px 8px',
    borderRadius: '8px',
    border: `1px solid ${colors.gray40}`,
    minHeight: '58px',
    gap: 8,
    cursor: 'pointer'
  },
  highlightedGray: {
    color: colors.gray80,
  },
  gap8: {
    gap: 8,
  },
  buttonGroup: {
    gap: 12,
    width: '100%',
    marginTop: 12
  },
  prevButton: {
    flex: 1,
    padding: '16px',
    borderRadius: 12,
    backgroundColor: colors.gray20,
    color: colors.gray60,
    border: 'none',
    cursor: 'pointer'
  },
  nextButton: {
    flex: 2,
    padding: '16px',
    borderRadius: 12,
    backgroundColor: colors.main,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
});