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

    const renderCell = ({ date }: { date: Date }) => {
        const isCurrentMonth = date.getMonth() === calendar.startOfCurrentMonth.getMonth();
        const isSelected = isSameDay(date, calendar.currentSelectedDate);
        const formattedDate = format(date, 'yyyy-MM-dd');
        
        const hasAnswer = answeredDates.has(formattedDate);
        const isFuture = isAfter(startOfDay(date), startOfDay(new Date()));

        // 가독성과 문법 오류 방지를 위해 속성 객체를 미리 정의합니다.
        const cellProps = {
            'data-cell': '',
            ...( (!isCurrentMonth || isFuture) ? { 'data-cell-gray': '' } : {}),
            ...( isSelected ? { 'data-cell-white': '' } : {})
        };

        return (
            <div {...stylex.props(styles.cellWrap)}>
                <div {...stylex.props(isSelected && styles.circle)} />

                <div
                    {...cellProps}
                    {...stylex.props(
                        styles.cell,
                        (!isCurrentMonth || isFuture) && styles.gray,
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

    const handleDayClick = (date: Date) => {
        if (isAfter(startOfDay(date), startOfDay(new Date()))) return;
        calendar.onClickDay(date);
    };

    return (
        <section {...stylex.props(styles.base)}>
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

            <div data-calendar-wrap {...stylex.props(styles.calendar)}>
                <Calendar
                    {...calendar}
                    onClickDay={handleDayClick}
                    renderCell={renderCell}
                />
            </div>

            <div {...stylex.props(styles.answerWrap, flex.center, flex.column)}>
                <p {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.primaryBlack)}>
                    {format(calendar.currentSelectedDate, 'yyyy.MM.dd')}
                </p>
                <button
                    style={{
                        marginTop: '16px',
                        padding: '12px 24px',
                        backgroundColor: colors.main,
                        color: 'white',
                        borderRadius: '12px',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
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
    cellWrap: { position: 'relative', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 4 },
    circle: { position: 'absolute', top: 4, borderRadius: '50%', width: 22, height: 22, zIndex: 0, backgroundColor: colors.main },
    cell: { position: 'relative', zIndex: 1, borderRadius: '50%', color: colors.gray90, padding: 10 },
    dot: { width: 4, borderRadius: '50%', height: 4, backgroundColor: colors.main, marginTop: -2 },
    gray: { color: colors.gray80 },
    white: { color: colors.white },
    answerWrap: { gap: 16 },
});