import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useState, useEffect } from 'react';
import { supabase } from '~/lib/supabase';
import { useUserStore } from '~/domain/user/store';

// [핵심] 빌드 에러 해결을 위해 Route를 반드시 export 해야 합니다.
export const Route = createFileRoute('/question/')({
  component: QuestionPage,
});

function QuestionPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoQuestionModal, setShowNoQuestionModal] = useState(false);
  
  const [text, setText] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

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
        
        if (error || !data) {
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

  const handleSubmit = async () => {
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
        '"isDel"': 0,
      });

      if (error) throw error;
      alert('오늘의 답변이 기록되었습니다.');
      navigate({ to: '/' });
    } catch (e) {
      console.error(e);
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div {...stylex.props(styles.loading)}>불러오는 중...</div>;

  if (showNoQuestionModal || !question) {
    return (
      <div {...stylex.props(styles.modalOverlay)}>
        <div {...stylex.props(styles.modalContent)}>
          <p>오늘의 질문이 없습니다.</p>
          <button onClick={() => navigate({ to: '/' })}>확인</button>
        </div>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.base, flex.column)}>
      <div {...stylex.props(styles.header)}>
        <p {...stylex.props(typo['Body/Body2_15∙150_Regular'], styles.dateText)}>
          {question.dateAt}
        </p>
        <h2 {...stylex.props(typo['Heading/H3_20∙130_SemiBold'], styles.title)}>
          {question.title}
        </h2>
      </div>

      <textarea
        {...stylex.props(styles.textArea, typo['Body/Body1_16∙150_Regular'])}
        placeholder="오늘의 생각을 기록해보세요."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div {...stylex.props(styles.inputGroup, flex.column)}>
        {question.needNickname && (
          <input
            {...stylex.props(styles.input)}
            placeholder="닉네임 (선택)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        )}
        {question.needPhone && (
          <input
            {...stylex.props(styles.input)}
            placeholder="연락처 (선택)"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
          />
        )}
      </div>

      <button {...stylex.props(styles.submitBtn)} onClick={handleSubmit}>
        기록하기
      </button>
    </div>
  );
}

const styles = stylex.create({
  base: { padding: '24px 20px', minHeight: '100vh', gap: 24 },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  header: { gap: 8 },
  dateText: { color: colors.gray60 },
  title: { color: colors.gray90 },
  textArea: { width: '100%', flex: 1, padding: 16, borderRadius: 12, border: 'none', backgroundColor: colors.gray20 },
  inputGroup: { gap: 12 },
  input: { padding: 12, borderRadius: 8, border: `1px solid ${colors.gray30}` },
  submitBtn: { padding: 16, borderRadius: 12, backgroundColor: colors.main, color: '#fff', border: 'none' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 16, textAlign: 'center' }
});