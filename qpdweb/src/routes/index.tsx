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
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
    const [latestAnswer, setLatestAnswer] = useState<any>(null);

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

            const { data: latest } = await supabase
                .from('answer')
                .select('*, question:questionId ( title, dateAt )')
                .eq('userId', user.id)
                .eq('isDel', 0)
                .order('createdAt', { ascending: false })
                .limit(1)
                .maybeSingle();
            setLatestAnswer(latest);
        };
        fetchData();
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const fetchSelected = async () => {
            const dateStr = format(calendar.currentSelectedDate, 'yyyy-MM-dd');
            const { data } = await supabase
                .from('answer')
                .select('*, question:questionId ( title, dateAt )')
                .eq('userId', user.id)
                .eq('isDel', 0)
                .filter('question.dateAt', 'eq', dateStr)
                .maybeSingle();
            setSelectedAnswer(data);
        };
        fetchSelected();
    }, [calendar.currentSelectedDate, user]);

    const renderCell = ({ date }: { date: Date }) => {
        const isSelected = isSameDay(date, calendar.currentSelectedDate);
        const formattedDate = format(date, 'yyyy-MM-dd');
        const hasAnswer = answeredDates.has(formattedDate);
        const isFuture = isAfter(startOfDay(date), startOfDay(new Date()));

        return (
            <div {...stylex.props(styles.cellWrap)}>
                {isSelected && <div {...stylex.props(styles.circle)} />}
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
            <div {...stylex.props(styles.promotion, flex.column)}>
                <h3 {...stylex.props(typo['Heading/lines/H3_20∙130_SemiBold_lines'], styles.primaryBlack)}>
                    지금까지 <span {...stylex.props(styles.primaryColor)}>총 {totalCount}번</span> 기록했어요!
                </h3>
                <p {...stylex.props(typo['Body/lines/Body3_14∙150_Regular_lines'], styles.promotionSub)}>
                    오늘 떠오른 생각도 가볍게 기록해 보세요.
                </p>
            </div>

            <div {...stylex.props(styles.calendar)}>
                <Calendar {...calendar} onClickDay={handleDayClick} renderCell={renderCell} />
            </div>

            <div {...stylex.props(styles.section)}>
                <p {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.mb16, styles.primaryBlack)}>
                    {format(calendar.currentSelectedDate, 'yyyy.MM.dd')}
                </p>
                {selectedAnswer ? (
                    <div 
                        {...stylex.props(styles.answerCard, flex.column)}
                        onClick={() => navigate({ to: '/answer/memo', search: { questionId: selectedAnswer.questionId } })}
                    >
                        <p {...stylex.props(typo['Body/Body2_15∙150_SemiBold_lines'])}>{selectedAnswer.question?.title}</p>
                        <p {...stylex.props(typo['Body/lines/Body3_14∙150_Regular_lines'], styles.gray80)}>{selectedAnswer.text}</p>
                        <span {...stylex.props(styles.moreLink)}>생각 덧붙이기 &gt;</span>
                    </div>
                ) : (
                    <button {...stylex.props(styles.submitBtn)} onClick={() => navigate({ to: '/question' })}>
                        오늘의 질문 답하기
                    </button>
                )}
            </div>

            <div {...stylex.props(styles.section, flex.column)}>
                <div {...stylex.props(flex.between, flex.vertical, styles.mb16)}>
                    <h4 {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.primaryBlack)}>나의 기록들</h4>
                    <button {...stylex.props(styles.viewAllBtn)} onClick={() => navigate({ to: '/answer' })}>전체보기</button>
                </div>
                {latestAnswer ? (
                    <div 
                        {...stylex.props(styles.latestCard, flex.column)}
                        onClick={() => navigate({ to: '/answer/memo', search: { questionId: latestAnswer.questionId } })}
                    >
                        <span {...stylex.props(styles.latestDate)}>{latestAnswer.question?.dateAt}</span>
                        <p {...stylex.props(typo['Body/Body2_15∙150_SemiBold_lines'])}>{latestAnswer.question?.title}</p>
                        <p {...stylex.props(styles.latestText)}>{latestAnswer.text}</p>
                    </div>
                ) : (
                    <div {...stylex.props(styles.emptyCard)}>아직 기록이 없어요.</div>
                )}
            </div>
        </section>
    );
}

const styles = stylex.create({
    base: { padding: '24px 18px', paddingBottom: 60 },
    promotion: { width: '100%', padding: '20px', borderRadius: 16, backgroundColor: colors.gray20, gap: 8, marginBottom: 24 },
    promotionSub: { color: colors.gray80 },
    primaryBlack: { color: colors.gray90 },
    primaryColor: { color: colors.main },
    calendar: { paddingBottom: 32, borderBottom: `1px solid ${colors.gray40}`, marginBottom: 32 },
    cellWrap: { position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    circle: { position: 'absolute', width: 32, height: 32, borderRadius: '50%', backgroundColor: colors.main, zIndex: -1 },
    dot: { position: 'absolute', bottom: -6, width: 4, height: 4, borderRadius: '50%', backgroundColor: colors.main },
    section: { marginBottom: 40 },
    mb16: { marginBottom: 16 },
    answerCard: { padding: 20, borderRadius: 16, backgroundColor: colors.gray20, cursor: 'pointer', gap: 8, border: `1px solid ${colors.gray30}` },
    moreLink: { fontSize: 12, color: colors.main, fontWeight: 600, marginTop: 4 },
    submitBtn: { width: '100%', padding: '16px', borderRadius: 14, backgroundColor: colors.main, color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' },
    viewAllBtn: { background: 'none', border: 'none', color: colors.gray60, fontSize: 13, cursor: 'pointer', fontWeight: 600 },
    latestCard: { padding: 20, borderRadius: 16, backgroundColor: '#fff', border: `1px solid ${colors.gray40}`, cursor: 'pointer', gap: 6 },
    latestDate: { fontSize: 12, color: colors.gray60 },
    latestText: { fontSize: 14, color: colors.gray80, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
    emptyCard: { padding: 40, textAlign: 'center', color: colors.gray50, backgroundColor: colors.gray20, borderRadius: 16 },
    gray80: { color: colors.gray80 },
});