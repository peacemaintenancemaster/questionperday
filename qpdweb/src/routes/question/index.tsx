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

function QuestionPage() {
  const navigate = useNavigate();
  const user = useUser();
  const isLogin = useUserStore((s) => s.isLogin);
  const loginModal = useModal('login');

  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoQuestionModal, setShowNoQuestionModal] = useState(false);
  
  // 입력 상태들
  const [text, setText] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. 오늘의 질문 가져오기
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
          setQuestion(data);
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
        '"questionId"': question?.id,
        '"userId"': user?.id,
        text: text,
        nickname: nickname.trim() || '',
        phone: phone.trim() || '',
        '"isDel"': isPrivate ? 1 : 0,
      });

      if (error) throw error;

      alert('오늘의 답변이 기록되었습니다.');
      navigate({ to: '/' }); // 홈으로 이동
    } catch (e) {
      console.error(e);
      alert('저장에 실패했습니다.');
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
          <p {...stylex.props(styles.modalText)}>오늘의 질문이 없습니다</p>
          <button
            {...stylex.props(styles.modalButton)}
            onClick={() => navigate({ to: '/' })}>
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.base, flex.column)}>
      {/* 질문 타이틀 */}
      <div {...stylex.props(styles.header)}>
        <p {...stylex.props(typo['Body/Body2_15∙150_Regular'], styles.dateText)}>
          {question.display_date || question.dateAt}
        </p>
        <h2 {...stylex.props(typo['Heading/H3_20∙130_SemiBold'], styles.title)}>
          {question.content || question.title}
        </h2>
      </div>

      {/* 답변 입력 */}
      <textarea
        {...stylex.props(styles.textArea, typo['Body/Body1_16∙150_Regular'])}
        placeholder="오늘의 생각을 기록해보세요."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleInteraction}
      />

      {/* 추가 정보 입력 */}
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
          <label htmlFor="private-answer" {...stylex.props(styles.checkboxLabel, typo['Body/Body3_14∙100_Regular'])}>
            혼자서만 보는 답변으로 기록하기
          </label>
        </div>
      </div>

      <button {...stylex.props(styles.submitBtn)} onClick={handleSubmit}>
        <span style={{ color: '#fff' }}>기록하기</span>
      </button>

      {!isLogin && (
        <loginModal.Render type='bottomSheet' animationType='bottomSheet'>
          <LoginBottomSheet />
        </loginModal.Render>
      )}
    </div>
  );
}

const styles = stylex.create({
  base: { padding: '24px 20px', height: '100vh', backgroundColor: '#fff', gap: 24 },
  header: { gap: 8 },
  dateText: { color: colors.gray60 },
  title: { color: colors.gray90 },
  textArea: {
    width: '100%', flex: 1, padding: 16, borderRadius: 12,
    backgroundColor: colors.gray20, border: 'none', resize: 'none', outline: 'none'
  },
  inputGroup: { gap: 16 },
  inputRow: { gap: 8, display: 'flex', flexDirection: 'column' },
  label: { fontSize: 13, color: colors.gray70, fontWeight: 600 },
  input: {
    padding: '12px', borderRadius: 8, border: `1px solid ${colors.gray30}`,
    outline: 'none', fontSize: 14
  },
  checkboxRow: {
    gap: 8,
    cursor: 'pointer',
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
    width: '100%', padding: 16, borderRadius: 12,
    backgroundColor: colors.main, border: 'none', cursor: 'pointer'
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '24px',
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '24px',
    maxWidth: 300,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.gray90,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    padding: '12px',
    borderRadius: 8,
    backgroundColor: colors.main,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
  },
});