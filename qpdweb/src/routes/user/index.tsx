import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameDay, isAfter, startOfDay, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useUser } from '~/domain/user/store';
import { supabase } from '~/lib/supabase';

// [핵심 1] 캘린더 라이브러리 타입 정의 (이게 있어야 에러가 안 납니다)
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const Route = createFileRoute('/user/')({
  component: UserPageIndex,
});

function UserPageIndex() {
  const user = useUser();
  const navigate = useNavigate();

  // [핵심 2] useState가 'Value' 타입을 받을 수 있게 설정
  const [value, setValue] = useState<Value>(new Date());
  const [answeredDates, setAnsweredDates] = useState<Set<string>>(new Set());

  // 1. 답변한 날짜 가져오기
  useEffect(() => {
    if (!user) return;
    const fetchDates = async () => {
      const { data } = await supabase
        .from('answer')
        .select('question:questionId ( dateAt )')
        .eq('userId', user.id)
        .eq('isDel', 0);

      if (data) {
        const dates = new Set(data.map((item: any) => item.question?.dateAt).filter(Boolean));
        setAnsweredDates(dates as Set<string>);
      }
    };
    fetchDates();
  }, [user]);

  // [핵심 3] 타입 충돌을 막아주는 핸들러 함수
  const handleDateChange = (nextValue: Value) => {
    // 날짜가 선택되었을 때만 처리 (null이나 배열 처리)
    if (nextValue instanceof Date) {
      // 미래 날짜 클릭 시 무시
      if (isAfter(startOfDay(nextValue), startOfDay(new Date()))) return;
    }
    setValue(nextValue);
  };

  // 2. 캘린더 셀 렌더링 (파란 점 & 미래 회색 처리)
  const renderCell = ({ date }: { date: Date }) => {
    let isSelected = false;
    // value가 단일 날짜인지 확인 후 비교
    if (value instanceof Date) {
      isSelected = isSameDay(date, value);
    } else if (Array.isArray(value) && value[0]) {
       isSelected = isSameDay(date, value[0] as Date);
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    const hasAnswer = answeredDates.has(dateStr);
    const isFuture = isAfter(startOfDay(date), startOfDay(new Date()));

    return (
      <div {...stylex.props(styles.cellWrap, isFuture && styles.disabledCell)}>
        <div {...stylex.props(isSelected && styles.circle)} />
        <div
          {...stylex.props(
            styles.cell,
            isFuture && styles.gray,
            isSelected && styles.white,
            typo['Caption/Caption2_12∙100_SemiBold'],
          )}
        >
          {date.getDate()}
        </div>
        {hasAnswer && !isFuture && <div {...stylex.props(styles.dot)} />}
      </div>
    );
  };

  // 선택된 날짜 텍스트 (Date 타입일 때만 포맷팅)
  const selectedDateStr = value instanceof Date ? format(value, 'yyyy.MM.dd') : '';

  return (
    <section {...stylex.props(styles.base)}>
      <div {...stylex.props(styles.calendar)}>
        <Calendar
          onChange={handleDateChange} // [수정됨] 이제 에러가 안 납니다
          value={value}
          formatDay={(locale, date) => format(date, 'd')}
          tileContent={renderCell}
          // 기본 기능으로 미래 날짜 클릭 방지
          tileDisabled={({ date }) => isAfter(startOfDay(date), startOfDay(new Date()))}
          next2Label={null}
          prev2Label={null}
        />
      </div>

      <div {...stylex.props(styles.answerWrap, flex.center, flex.column)}>
        <p {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.primaryBlack)}>
          {selectedDateStr}
        </p>

        {!user ? (
            <p className="text-gray-500 mt-4 text-sm">로그인 후 기록을 시작해보세요!</p>
        ) : (
            <button
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-md hover:bg-blue-700 transition"
            onClick={() => {
                // 선택한 날짜에 맞는 질문 페이지 등으로 이동
                navigate({ to: '/question' });
            }}
            >
            오늘의 질문 답하기
            </button>
        )}
      </div>
    </section>
  );
}

const styles = stylex.create({
  base: { padding: '24px 18px', paddingBottom: 60 },
  calendar: { paddingTop: 28, paddingBottom: 32, borderBottom: `1px solid ${colors.gray40}`, marginBottom: 24 },
  cellWrap: { position: 'relative', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer' },
  disabledCell: { cursor: 'not-allowed', opacity: 0.5 },
  circle: { position: 'absolute', top: 4, borderRadius: '50%', width: 22, height: 22, zIndex: 0, backgroundColor: colors.main },
  cell: { position: 'relative', zIndex: 1, borderRadius: '50%', color: colors.gray90, padding: 10 },
  dot: { width: 4, borderRadius: '50%', height: 4, backgroundColor: colors.main },
  gray: { color: colors.gray80 },
  white: { color: colors.white },
  primaryBlack: { color: colors.gray90 },
  answerWrap: { marginTop: 20 },
});