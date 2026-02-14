import { createFileRoute } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { AnswerAPI } from '~/domain/answer/api';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  // 실제 누적 답변 횟수 데이터 가져오기
  const { data: countData } = useQuery({
    queryKey: ['answer-counts'],
    queryFn: () => AnswerAPI.getAnswerCounts(),
  });

  const count = countData?.answerCounts ?? 0;

  return (
    <main {...stylex.props(styles.container, flex.column)}>
      {/* 문구 수정: 답변했어요 -> 기록했어요! */}
      <p {...stylex.props(typo['Body/Body2_15∙150_Regular'], styles.countInfo)}>
        지금까지 총 {count}번 기록했어요!
      </p>

      {/* 여기에 질문 카드 등 나머지 메인 UI 코드를 배치하세요 */}
    </main>
  );
}

const styles = stylex.create({
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  countInfo: {
    color: colors.gray80,
  },
});