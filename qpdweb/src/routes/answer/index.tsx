import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
import { useUser } from '~/domain/user/store';
import { Icon } from '~/shared/images';

export const Route = createFileRoute('/answer/')({
  component: AnswerListPage,
});

function AnswerListPage() {
  const user = useUser();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchMyAnswers = async () => {
      // 내 답변 가져오기 (질문 정보 포함)
      const { data, error } = await supabase
        .from('answer')
        .select(`
          *,
          question:questionId ( title, dateAt )
        `)
        .eq('userId', user.id)
        .eq('isDel', 0)
        .order('createdAt', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setAnswers(data || []);
      }
      setLoading(false);
    };

    fetchMyAnswers();
  }, [user]);

  return (
    <div {...stylex.props(styles.base, flex.column)}>
      {/* 헤더 */}
      <div {...stylex.props(styles.header, flex.between, flex.vertical)}>
        <button onClick={() => navigate({ to: '/' })} {...stylex.props(styles.backBtn)}>
          <Icon.ArrowLeft size="24" color="#333" />
        </button>
        <span {...stylex.props(typo['Body/Body1_16∙100_SemiBold'])}>나의 기록</span>
        <div style={{ width: 24 }} />
      </div>

      {/* 리스트 */}
      <div {...stylex.props(styles.listWrap, flex.column)}>
        {loading ? (
          <div {...stylex.props(flex.center, styles.emptyText)}>로딩 중...</div>
        ) : answers.length === 0 ? (
          <div {...stylex.props(flex.center, styles.emptyText)}>
            아직 작성한 답변이 없어요.
          </div>
        ) : (
          answers.map((item) => (
            <div
              key={item.id}
              {...stylex.props(styles.card, flex.column)}
              onClick={() => navigate({ to: '/answer/memo', search: { questionId: item.questionId } })}
            >
              <div {...stylex.props(styles.dateText)}>
                {item.question?.dateAt}
              </div>
              <div {...stylex.props(styles.questionTitle)}>
                {item.question?.title}
              </div>
              <div {...stylex.props(styles.answerText)}>
                {item.text}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = stylex.create({
  base: {
    padding: '0 20px',
    paddingTop: 20,
    paddingBottom: 80,
    minHeight: '100vh',
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    paddingBottom: 20,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  listWrap: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.gray20,
    cursor: 'pointer',
    gap: 8,
  },
  dateText: {
    fontSize: 12,
    color: colors.gray70,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.gray90,
  },
  answerText: {
    fontSize: 14,
    color: colors.gray80,
    lineHeight: 1.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  emptyText: {
    padding: 40,
    color: colors.gray60,
  },
});