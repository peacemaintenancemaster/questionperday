import {
    createFileRoute,
    useNavigate,
    useSearch,
} from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';
import { useCalendar } from '~/shared/hooks/useCalendar';
import { Calendar } from '~/domain/home/calendar/calendar';
import { isSameDay, isAfter, startOfDay, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useUser } from '~/domain/user/store';
import { supabase } from '~/lib/supabase';

const searchSchema = z.object({
    dateAt: z.string().optional(),
});

type SearchSchema = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/')({
    component: RouteComponent,
    validateSearch: zodValidator(searchSchema),
});

function RouteComponent() {
    const search = useSearch({ from: '/' });
    const user = useUser();
    const navigate = useNavigate();
    const calendar = useCalendar<SearchSchema>(search);

    const [answeredDates, setAnsweredDates] = useState<Set<string>>(new Set());
    const [totalCount, setTotalCount] = useState(0);

    // [기능] 실제 데이터 가져오기 (총 기록 횟수 & 답변한 날짜들)
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const { data: dateData } = await supabase
                .from('answer')
                .select('question:questionId ( dateAt )')
                .eq('userId', user.id)
                .eq('isDel', 0);

            if (dateData) {
                const dates = new Set(dateData.map((item: any) => item.question?.dateAt).filter(Boolean));
                setAnsweredDates(dates as Set<string>);
            }

            const { count } = await supabase
                .from('answer')
                .select('*', { count: 'exact', head: true })
                .eq('userId', user.id)
                .eq('isDel', 0);
            
            if (count !== null) setTotalCount(count);
        };
        fetchData();
    }, [user]);

    // [수정] 렌더링 로직 - 숫자가 겹치지 않게 '장식'만 리턴합니다.
    const renderCell = ({ date }: { date: Date }) => {
        const isSelected = isSameDay(date, calendar.currentSelectedDate);
        const formattedDate = format(date, 'yyyy-MM-dd');
        const hasAnswer = answeredDates.has(formattedDate);
        const isFuture = isAfter(startOfDay(date), startOfDay(new Date()));

        return (
            <div {...stylex.props(styles.cellWrap)}>
                {/* 선택 시 나타나는 파란색 원 배경 */}
                <div {...stylex.props(isSelected && styles.circle)} />
                
                {/* [중요] 숫자는 Calendar 컴포넌트가 직접 그리므로 여기선 그리지 않습니다.
                    대신 파란 점만 조건부로 띄웁니다. */}
                {hasAnswer && !isFuture && <div {...stylex.props(styles.dot)} />}
            </div>
        );
    };

    const handleDayClick = (date: Date) => {
        // [기능] 미래의 날짜는 클릭해도 아무 일 없게 막음
        if (isAfter(startOfDay(date), startOfDay(new Date()))) return;
        calendar.onClickDay(date);
    };

    return (
        <section {...stylex.props(styles.base)}>
            {/* [수정] 문구 연동 섹션 */}
            <div data-promotion {...stylex.props(styles.promotion, flex.column)}>
                <div {...stylex.props(styles.promotionTitle, flex.vertical)}>
                    <h3 {...stylex.props(styles.primaryBlack, typo['Heading/lines/H3_20∙130_SemiBold_lines'])}>
                        지금까지 <span {...stylex.props(styles.primaryColor)}>총 {totalCount}번</span> 기록했어요!
                    </h3>
                </div>
                <p {...stylex.props(typo['Body/lines/Body3_14∙150_Regular_lines'], styles.promotionSub)}>
                    오늘 떠오른 생각도 가볍게 기록해 보세요.
                </p>
            </div>

            {/* 사용자님의 원래 커스텀 캘린더 */}
            <div data-calendar-wrap {...stylex.props(styles.calendar)}>
                <Calendar
                    {...calendar}
                    onClickDay={handleDayClick}
                    renderCell={renderCell}
                />
            </div>

            {/* 하단 날짜 표시 및 버튼 */}
            <div {...stylex.props(styles.answerWrap, flex.center, flex.column)}>
                <p {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.primaryBlack)}>
                    {format(calendar.currentSelectedDate, 'yyyy.MM.dd')}
                </p>
                <button
                    {...stylex.props(styles.submitBtn)}
                    onClick={() => navigate({ to: '/question' })}
                >
                    오늘의 질문 답하기
                </button>
            </div>
        </section>
    );
}

const styles = stylex.create({
    base: { padding: '24px 18px', paddingBottom: 60 },
    promotion: { width: '100%', padding: '16px', borderRadius: 14, backgroundColor: colors.gray20, gap: 8 },
    promotionTitle: { gap: 8 },
    promotionSub: { color: colors.gray80 },
    primaryBlack: { color: colors.gray90 },
    primaryColor: { color: colors.main },
    calendar: { paddingTop: 28, paddingBottom: 32, borderBottom: `1px solid ${colors.gray40}`, marginBottom: 24 },
    cellWrap: { position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    circle: { position: 'absolute', width: 32, height: 32, borderRadius: '50%', backgroundColor: colors.main, zIndex: -1 },
    dot: { position: 'absolute', bottom: -6, width: 4, height: 4, borderRadius: '50%', backgroundColor: colors.main },
    answerWrap: { marginTop: 20 },
    submitBtn: { 
        marginTop: '16px', padding: '14px 32px', borderRadius: '100px', 
        backgroundColor: colors.main, color: '#fff', border: 'none', 
        fontWeight: 700, cursor: 'pointer' 
    },
});