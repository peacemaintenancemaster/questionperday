import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useState, useEffect } from 'react';
import { supabase } from '~/lib/supabase';
import { useUser } from '~/domain/user/store';

export const Route = createFileRoute('/question/')({
  component: QuestionPage,
});

function QuestionPage() {
  const navigate = useNavigate();
  const user = useUser();
  const [question, setQuestion] = useState<any>(null);
  
  // 입력 상태들
  const [text, setText] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. 오늘의 질문 가져오기
  useEffect(() => {
    const fetchTodayQuestion = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('question')
        .select('*')
        .eq('dateAt', today)
        .single();
      
      if (data) setQuestion(data);
    };
    fetchTodayQuestion();
  }, []);

  // 2. 답변하기 (닉네임/연락처 로직 적용)
  const handleSubmit = async () => {
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
        
        // [핵심] 값이 없으면 빈 문자열로 저장 (에러 안 나게)
        nickname: nickname.trim() || '',
        phone: phone.trim() || '',
        
        isDel: 0,
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

  if (!question) return <div className="p-5">오늘의 질문을 불러오는 중...</div>;

  return (
    <div {...stylex.props(styles.base, flex.column)}>
      {/* 질문 타이틀 */}
      <div {...stylex.props(styles.header)}>
        <p {...stylex.props(typo['Body/Body2_15∙150_Regular'], styles.dateText)}>
          {question.dateAt}
        </p>
        <h2 {...stylex.props(typo['Heading/H3_20∙130_SemiBold'], styles.title)}>
          {question.title}
        </h2>
      </div>

      {/* 답변 입력 */}
      <textarea
        {...stylex.props(styles.textArea, typo['Body/Body1_16∙150_Regular'])}
        placeholder="오늘의 생각을 기록해보세요."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* [수정됨] 추가 정보 입력 (옵션에 따라 표시) */}
      <div {...stylex.props(styles.inputGroup, flex.column)}>
        
        {/* 닉네임: 설정 켜져있으면 보임, 입력 안 해도 됨 */}
        {question.needNickname ? (
          <div {...stylex.props(styles.inputRow)}>
            <span {...stylex.props(styles.label)}>닉네임</span>
            <input
              type="text"
              {...stylex.props(styles.input)}
              placeholder="닉네임 (선택)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        ) : null}

        {/* 연락처: 설정 켜져있으면 보임, 숫자만 입력됨 */}
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
            />
          </div>
        ) : null}
      </div>

      <button {...stylex.props(styles.submitBtn)} onClick={handleSubmit}>
        <span style={{ color: '#fff' }}>기록하기</span>
      </button>
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
  submitBtn: {
    width: '100%', padding: 16, borderRadius: 12,
    backgroundColor: colors.main, border: 'none', cursor: 'pointer'
  }
});