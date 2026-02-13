import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css';
import { isSameDay, isAfter, startOfDay, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useUser } from '~/domain/user/store';
import { supabase } from '~/lib/supabase';

// 캘린더 라이브러리 타입 정의 (에러 방지용)
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUser();
  const navigate = useNavigate();
  
  // 캘린더 상태 및 데이터 상태
  const [value, setValue] = useState<Value>(new Date());
  const [answeredDates, setAnsweredDates] = useState<Set<string>>(new Set());
  const [totalCount, setTotalCount] = useState(0); // [추가] 총 답변 수 저장

  // 1. 데이터 가져오기 (답변한 날짜들 & 총 개수)
  useEffect(() => {
    if (!user) {
        setTotalCount(0);
        return;
    }

    const fetchData = async () => {
      // (1) 답변한 날짜 가져오기 (파란 점 용)
      const { data: dateData } = await supabase
        .from('answer')
        .select('question:questionId ( dateAt )')
        .eq('userId', user.id)
        .eq('isDel', 0);

      if (dateData) {
        const dates = new Set(dateData.map((item: any) => item.question?.dateAt).filter(Boolean));
        setAnsweredDates(dates as Set<string>);
      }

      // (2) 총 답변 개수 가져오기 (카운트 용)
      const { count, error } = await supabase
        .from('answer')
        .select('*', { count: 'exact', head: true }) // 데이터를 다 가져오지 않고 숫자만 셉니다
        .eq('userId', user.id)
        .eq('isDel', 0);
      
      if (!error && count !== null) {
        setTotalCount(count);
      }
    };

    fetchData();
  }, [user]);

  // 캘린더 변경 핸들러 (타입 에러 방지)
  const handleDateChange = (nextValue: Value) => {
    if (nextValue instanceof Date) {
      if (isAfter(startOfDay(nextValue), startOfDay(new Date()))) return;
    }
    setValue(nextValue);
  };

  // 캘린더 셀 렌더링
  const renderCell = ({ date }: { date: Date }) => {
    let isSelected = false;
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

  const selectedDateStr = value instanceof Date ? format(value, 'yyyy.MM.dd') : '';

  return (
    <section {...stylex.props(styles.base)}>
      {/* [수정됨] 프로모션 배너 섹션 */}
      <div {...stylex.props(styles.promotion, flex.column)}>
        <div
            {...stylex.props(styles.promotionTitle, flex.vertical)}
            // 클릭 시 로그인 유도 등 필요한 액션 추가 가능
        >
            <img
                src='/image/icon/mail.png' // 아이콘 경로가 맞는지 확인 필요 (없으면 엑박 뜰 수 있음)
                alt='아이콘'
                {...stylex.props(styles.promotionIcon)}
                onError={(e) => e.currentTarget.style.display = 'none'} // 이미지 없으면 숨김
            />

            <h3
                {...stylex.props(
                    styles.primaryBlack,
                    typo['Heading/lines/H3_20∙130_SemiBold_lines'],
                )}>
                <>
                    {'지금까지 '}
                    <span {...stylex.props(styles.primaryColor)}>
                        {'총 '}
                        {totalCount} {/* [수정] 실제 데이터 연동 */}
                        {'번'}
                    </span>
                    {' 기록했어요!'} {/* [수정] 멘트 변경 */}
                </>
            </h3>
        </div>
        <p
            {...stylex.props(
                typo['Body/lines/Body3_14∙150_Regular_lines'],
                styles.promotionSub,
            )}>
            {'오늘 떠오른 생각도 가볍게 기록해 보세요.'} {/* [수정] 멘트 변경 */}
        </p>
      </div>

      {/* 캘린더 영역 */}
      <div {...stylex.props(styles.calendar)}>
        <Calendar
          onChange={handleDateChange}
          value={value}
          formatDay={(locale, date) => format(date, 'd')}
          tileContent={renderCell}
          tileDisabled={({ date }) => isAfter(startOfDay(date), startOfDay(new Date()))}
          next2Label={null}
          prev2Label={null}
        />
      </div>

      {/* 하단 답변 영역 */}
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
  // 배너 스타일
  promotion: {
    width: '100%',
    padding: '16px',
    borderRadius: 14,
    backgroundColor: colors.gray20,
    gap: 8,
    marginBottom: 24, // 캘린더와 간격
  },
  promotionTitle: {
    gap: 8,
  },
  promotionIcon: {
    width: 24,
    height: 24,
    objectFit: 'contain',
  },
  promotionSub: {
    color: colors.gray80,
    paddingLeft: 32, // 아이콘 너비 + 간격 만큼 들여쓰기
  },
  
  calendar: { paddingTop: 10, paddingBottom: 32, borderBottom: `1px solid ${colors.gray40}`, marginBottom: 24 },
  cellWrap: { position: 'relative', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer' },
  disabledCell: { cursor: 'not-allowed', opacity: 0.5 },
  circle: { position: 'absolute', top: 4, borderRadius: '50%', width: 22, height: 22, zIndex: 0, backgroundColor: colors.main },
  cell: { position: 'relative', zIndex: 1, borderRadius: '50%', color: colors.gray90, padding: 10 },
  dot: { width: 4, borderRadius: '50%', height: 4, backgroundColor: colors.main },
  gray: { color: colors.gray80 },
  white: { color: colors.white },
  primaryBlack: { color: colors.gray90 },
  primaryColor: { color: colors.main },
  answerWrap: { marginTop: 20 },
});