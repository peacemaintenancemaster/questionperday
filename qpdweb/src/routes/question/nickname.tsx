import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useState, useEffect } from 'react';
import { AnswerTimer } from '~/domain/answer/components/timer/answer-timer';
import { AnswerAPI } from '~/domain/answer/api';

// [수정] 타입 에러 원흉: 경로를 인식 못하는 문제를 'as any'로 강제 해결
export const Route = createFileRoute('/question/nickname' as any)({
  component: NicknameStep,
});

function NicknameStep() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as any) || {};
  const { question, answer, isPrivate } = state;
  
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이전 데이터가 없으면 질문 페이지로 이동
  useEffect(() => {
    if (!question || !answer) {
      navigate({ to: '/question' });
    }
  }, [question, answer, navigate]);

  const handlePrev = () => {
    // [수정] 'as any' 추가
    navigate({
      to: '/question/write',
      state: { question }
    } as any);
  };

  const handleNext = async () => {
    // 닉네임 입력은 선택사항이므로 빈 값도 허용
    setIsSubmitting(true);

    try {
      // 답변 저장
      await AnswerAPI.add(question.id, {
        text: answer,
        nickname: nickname.trim(),
        phone: '', // 연락처 필드는 현재 사용하지 않음
        isShared: !isPrivate // isPrivate가 true면 공유하지 않음
      });

      // localStorage에 답변 정보 저장 (confirm 페이지에서 사용)
      localStorage.setItem('answer', JSON.stringify({
        question: question,
        text: answer,
        nickname: nickname || '익명'
      }));

      // 완료 페이지로 이동
      // [수정] 'as any' 추가
      navigate({ to: '/question/confirm' } as any);
    } catch (error) {
      console.error('답변 저장 실패:', error);
      alert('답변 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!question || !answer) {
    return null;
  }

  return (
    <div {...stylex.props(flex.column, styles.container)}>
      {/* 상단 타이머 */}
      <div {...stylex.props(styles.timerWrapper)}>
        <AnswerTimer timeAt={question.created_at} />
      </div>

      {/* 타이틀 섹션 */}
      <div {...stylex.props(flex.column, styles.header)}>
        <h2 {...stylex.props(typo['Heading/H3_20∙130_SemiBold'], styles.title)}>
          적어주신 답변과 어울리는{'\n'}닉네임을 정해주세요.
        </h2>
        <p {...stylex.props(typo['Body/Body3_14∙150_Regular'], styles.description)}>
          입력하지 않을 시 랜덤 닉네임으로 발행됩니다.
        </p>
      </div>

      {/* 닉네임 입력 */}
      <div {...stylex.props(flex.column, styles.inputWrapper)}>
        <input
          {...stylex.props(styles.input, typo['Body/Body1_16∙150_Regular'])}
          placeholder="기록하는 토마토"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
        />
        <span {...stylex.props(typo['Body/Body4_13∙150_Regular'], styles.counter)}>
          {nickname.length}/20
        </span>
      </div>

      {/* 하단 버튼 */}
      <div {...stylex.props(flex.row, styles.buttonGroup)}>
        <button
          onClick={handlePrev}
          disabled={isSubmitting}
          {...stylex.props(styles.prevButton, typo['Body/Body2_15∙150_Regular'])}>
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          {...stylex.props(
            styles.nextButton,
            typo['Body/Body2_15∙150_Regular']
          )}>
          {isSubmitting ? '저장 중...' : '다음'}
        </button>
      </div>
    </div>
  );
}

const styles = stylex.create({
  container: {
    height: '100vh',
    padding: '24px 18px',
    justifyContent: 'space-between',
    backgroundColor: colors.white
  },
  timerWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%'
  },
  header: {
    gap: 12,
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40
  },
  title: {
    color: colors.gray90,
    whiteSpace: 'pre-line',
    textAlign: 'left'
  },
  description: {
    color: colors.gray60,
    marginTop: 8
  },
  inputWrapper: {
    width: '100%',
    gap: 8,
    marginBottom: 20
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    borderRadius: 12,
    backgroundColor: colors.gray10,
    border: 'none',
    outline: 'none',
    color: colors.gray90,
    '::placeholder': {
      color: colors.gray40
    }
  },
  counter: {
    alignSelf: 'flex-end',
    color: colors.gray50
  },
  buttonGroup: {
    gap: 12,
    width: '100%'
  },
  prevButton: {
    flex: 1,
    padding: '16px',
    borderRadius: 12,
    backgroundColor: colors.gray20,
    color: colors.gray60,
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  nextButton: {
    flex: 2,
    padding: '16px',
    borderRadius: 12,
    backgroundColor: colors.main,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  }
});