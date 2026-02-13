import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useState, useEffect } from 'react';
import { supabase } from '~/lib/supabase';
import { useUser } from '~/domain/user/store';
import { z } from 'zod';

const searchSchema = z.object({
  questionId: z.number(),
});

export const Route = createFileRoute('/answer/memo')({
  component: MemoPage,
  validateSearch: searchSchema,
});

function MemoPage() {
  const { questionId } = Route.useSearch();
  const user = useUser();
  const [question, setQuestion] = useState<any>(null);
  const [myAnswer, setMyAnswer] = useState<any>(null);
  const [memos, setMemos] = useState<any[]>([]); // 기존 메모들
  const [newMemo, setNewMemo] = useState('');    // 새로 입력할 메모
  const [loading, setLoading] = useState(false);

  // 데이터 불러오기 (질문 + 내 답변 + 내 메모들)
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // 1. 질문 정보
      const { data: qData } = await supabase.from('question').select('*').eq('id', questionId).single();
      setQuestion(qData);

      // 2. 내 답변 (Main Answer)
      const { data: aData } = await supabase
        .from('answer')
        .select('*')
        .eq('questionId', questionId)
        .eq('userId', user.id)
        .eq('isDel', 0)
        .single(); // 답변은 하나여야 함
      setMyAnswer(aData);

      // 3. 내 메모들 (Sub Thoughts)
      const { data: mData } = await supabase
        .from('memo')
        .select('*')
        .eq('questionId', questionId) // 혹은 answerId를 참조할 수도 있음 (DB 구조에 따라)
        .eq('userId', user.id)
        .eq('isDel', 0)
        .order('createdAt', { ascending: true });
      setMemos(mData || []);
    };
    fetchData();
  }, [questionId, user]);

  // 메모 추가하기 (검증 완료: memo 테이블 사용)
  const handleAddMemo = async () => {
    if (!newMemo.trim()) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('memo') // [검증] answer가 아니라 memo 테이블에 저장
        .insert({
          userId: user?.id,
          questionId: questionId,
          text: newMemo,
          isDel: 0,
        })
        .select()
        .single();

      if (error) throw error;

      // 화면에 즉시 반영
      setMemos([...memos, data]);
      setNewMemo('');
    } catch (e) {
      console.error(e);
      alert('메모 저장 실패');
    } finally {
      setLoading(false);
    }
  };

  if (!question) return <div className="p-5">로딩 중...</div>;

  return (
    <div {...stylex.props(styles.base, flex.column)}>
      {/* 질문 영역 */}
      <div {...stylex.props(styles.section)}>
        <p {...stylex.props(typo['Body/Body2_15∙150_Regular'], styles.date)}>{question.dateAt}</p>
        <h2 {...stylex.props(typo['Heading/H3_20∙130_SemiBold'])}>{question.title}</h2>
      </div>

      {/* 내 답변 영역 (수정 불가, 보기 전용) */}
      <div {...stylex.props(styles.answerCard)}>
        <p {...stylex.props(typo['Body/Body1_16∙150_Regular'])}>
          {myAnswer ? myAnswer.text : '아직 답변을 남기지 않았습니다.'}
        </p>
      </div>

      <hr {...stylex.props(styles.divider)} />

      {/* 메모 리스트 (추가된 생각들) */}
      <div {...stylex.props(styles.memoList, flex.column)}>
        {memos.map((memo) => (
          <div key={memo.id} {...stylex.props(styles.memoItem)}>
            <div {...stylex.props(styles.memoDot)} />
            <p {...stylex.props(typo['Body/Body2_15∙150_Regular'])}>{memo.text}</p>
          </div>
        ))}
      </div>

      {/* 메모 입력창 (하단 고정) */}
      <div {...stylex.props(styles.inputWrap, flex.vertical)}>
        <input
          type="text"
          {...stylex.props(styles.input)}
          placeholder="생각 덧붙이기..."
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddMemo()}
        />
        <button {...stylex.props(styles.sendBtn)} onClick={handleAddMemo} disabled={loading}>
          ↑
        </button>
      </div>
    </div>
  );
}

const styles = stylex.create({
  base: { padding: '20px', minHeight: '100vh', backgroundColor: '#fff', paddingBottom: 80 },
  section: { marginBottom: 20 },
  date: { color: colors.gray60, marginBottom: 4 },
  answerCard: {
    padding: 16, backgroundColor: colors.gray20, borderRadius: 12, marginBottom: 24
  },
  divider: {
    border: 'none', borderTop: `1px solid ${colors.gray30}`, margin: '0 0 24px 0'
  },
  memoList: { gap: 12 },
  memoItem: { display: 'flex', gap: 10, alignItems: 'flex-start' },
  memoDot: {
    width: 6, height: 6, borderRadius: '50%', backgroundColor: colors.gray40, marginTop: 8
  },
  inputWrap: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    padding: '12px 20px', backgroundColor: '#fff', borderTop: `1px solid ${colors.gray30}`,
    gap: 8
  },
  input: {
    flex: 1, padding: '10px 14px', borderRadius: 20,
    border: `1px solid ${colors.gray40}`, outline: 'none', fontSize: 14
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: '50%', backgroundColor: colors.main,
    color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
  }
});