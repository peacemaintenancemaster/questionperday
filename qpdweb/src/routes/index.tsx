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
import { Icon } from '~/shared/images';

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
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null); // 선택한 날짜의 답변
    const [latestAnswer, setLatestAnswer] = useState<any>(null);     // 가장 최근 답변

    // 1. 초기 데이터 로드 (총 개수, 파란 점용 날짜들, 최신 기록 1건)
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            // 답변한 날짜 목록 (파란 점)
            const { data: dateData } = await supabase
                .from('answer')
                .select('question:questionId ( dateAt )')
                .eq('userId', user.id)
                .eq('isDel', 0);

            if (dateData) {
                const dates = new Set(dateData.map((item: any) => item.question?.dateAt).filter(Boolean));
                setAnsweredDates(dates as Set<string>);
            }

            // 총 기록 횟수
            const { count } = await supabase
                .from('answer')
                .select('*', { count: 'exact', head: true })
                .eq('userId', user.id)
                .eq('isDel', 0);
            if (count !== null) setTotalCount(count);

            // 가장 최신 답변 1건 (하단 섹션용)
            const { data: latest } = await supabase
                .from('answer')
                .select(`*, question:questionId ( title, dateAt )`)
                .eq('userId', user.id)
                .eq('isDel', 0)
                .order('createdAt', { ascending: false })
                .limit(1)
                .single();
            setLatestAnswer(latest);
        };
        fetchData();
    }, [user]);

    // 2. 달력 날짜 변경 시, 해당 날짜의 답변이 있는지 체크
    useEffect(() => {
        if (!user) return;
        const fetchSelectedAnswer = async () => {
            const dateStr = format(calendar.currentSelectedDate, 'yyyy-MM-dd');
            const { data } = await supabase
                .from('answer')
                .select(`*, question:questionId ( title, dateAt )`)
                .eq('userId', user.id)
                .eq('isDel', 0)
                .filter('question.dateAt', 'eq', dateStr)
                .maybeSingle();
            
            setSelectedAnswer(data);
        };
        fetchSelectedAnswer();
    }, [calendar.currentSelectedDate, user]);

    // 달력 셀 렌더링 (숫자 겹침 방지)
    const renderCell = ({ date }: { date: Date }) => {
        const isSelected = isSameDay(date, calendar.currentSelectedDate);
        const formattedDate = format(date, 'yyyy-MM-dd');
        const hasAnswer = answeredDates.has(formattedDate);
        const isFuture = isAfter(startOfDay(date), startOfDay(new Date()));

        return (
            <div {...stylex.props(styles.cellWrap)}>
                <div {...stylex.props(isSelected && styles.circle)} />
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
            {/* 상단 배너 */}
            <div {...stylex.props(styles.promotion, flex.column)}>
                <h3 {...stylex.props(styles.primaryBlack, typo['Heading/lines/H3_20∙130_SemiBold_lines'])}>
                    지금까지 <span {...stylex.props(styles.primaryColor)}>총 {totalCount}번</span> 기록했어요!
                </h3>
                <p {...stylex.props(typo['Body/lines/Body3_14∙150_Regular_lines'], styles.promotionSub)}>
                    오늘 떠오른 생각도 가볍게 기록해 보세요.
                </p>
            </div>

            {/* 캘린더 */}
            <div {...stylex.props(styles.calendar)}>
                <Calendar {...calendar} onClickDay={handleDayClick} renderCell={renderCell} />
            </div>

            {/* [복구] 선택한 날짜의 답변 노출 영역 */}
            <div {...stylex.props(styles.contentArea)}>
                <p {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.primaryBlack)}>
                    {format(calendar.currentSelectedDate, 'yyyy.MM.dd')}
                </p>

                {selectedAnswer ? (
                    <div 
                        {...stylex.props(styles.answerPreview, flex.column)}
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

            {/* [복구] 누적 답변 섹션 (가장 최신 답 노출 + 전체보기) */}
            <div {...stylex.props(styles.latestSection, flex.column)}>
                <div {...stylex.props(flex.between, flex.vertical)}>
                    <h4 {...stylex.props(typo['Body/Body1_16∙100_SemiBold'])}>나의 기록들</h4>
                    <button 
                        {...stylex.props(styles.viewAllBtn)}
                        onClick={() => navigate({ to: '/answer' })}
                    >
                        전체보기
                    </button>
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
    base: { padding: '24px 18px', paddingBottom: 100 },
    promotion: { width: '100%', padding: '20px', borderRadius: 16, backgroundColor: colors.gray20, gap: 8, marginBottom: 24 },
    promotionSub: { color: colors.gray80 },
    primaryBlack: { color: colors.gray90 },
    primaryColor: { color: colors.main },
    calendar: { paddingBottom: 32, borderBottom: `1px solid ${colors.gray40}`, marginBottom: 24 },
    cellWrap: { position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    circle: { position: 'absolute', width: 32, height: 32, borderRadius: '50%', backgroundColor: colors.main, zIndex: -1 },
    dot: { position: 'absolute', bottom: -6, width: 4, height: 4, borderRadius: '50%', backgroundColor: colors.main },
    contentArea: { marginBottom: 40, gap: 16, display: 'flex', flexDirection: 'column' },
    answerPreview: { 
        padding: 20, borderRadius: 16, backgroundColor: colors.gray20, cursor: 'pointer', gap: 8, border: `1px solid ${colors.gray30}` 
    },
    moreLink: { fontSize: 12, color: colors.main, fontWeight: 600, marginTop: 4 },
    submitBtn: { 
        width: '100%', padding: '16px', borderRadius: 14, backgroundColor: colors.main, 
        color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' 
    },
    latestSection: { gap: 16 },
    viewAllBtn: { background: 'none', border: 'none', color: colors.gray60, fontSize: 13, cursor: 'pointer', fontWeight: 600 },
    latestCard: { padding: 20, borderRadius: 16, backgroundColor: '#fff', border: `1px solid ${colors.gray40}`, cursor: 'pointer', gap: 6 },
    latestDate: { fontSize: 12, color: colors.gray60 },
    latestText: { fontSize: 14, color: colors.gray80, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
    emptyCard: { padding: 40, textAlign: 'center', color: colors.gray50, backgroundColor: colors.gray20, borderRadius: 16 },
    gray80: { color: colors.gray80 },
});