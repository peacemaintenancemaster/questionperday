import {
    createFileRoute,
    useNavigate,
    useSearch,
} from '@tanstack/react-router';
import * as styleX from '@stylexjs/stylex';
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
    
    // 사용자님의 커스텀 훅 (월간 뷰 데이터 관리)
    const calendar = useCalendar<SearchSchema>(search);

    const [answeredDates, setAnsweredDates] = useState<Set<string>>(new Set());
    const [totalCount, setTotalCount] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null); // 선택한 날짜의 답변
    const [latestAnswer, setLatestAnswer] = useState<any>(null);     // 가장 최근 답변

    // 1. 데이터 로드 (총 개수, 파란 점용 날짜들, 최신 기록 1건)
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            // 답변한 날짜 목록 (파란 점용)
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

            // 가장 최신 답변 1건 (나의 기록들 섹션용)
            const { data: latest } = await supabase
                .from('answer')
                .select(`*, question:questionId ( title, dateAt )`)
                .eq('userId', user.id)
                .eq('isDel', 0)
                .order('createdAt', { ascending: false })
                .limit(1)
                .maybeSingle();
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

    // [중요] 숫자가 겹치지 않게 '장식'만 리턴 (숫자는 Calendar가 직접 그림)
    const renderCell = ({ date }: { date: Date }) => {
        const isSelected = isSameDay(date, calendar.currentSelectedDate);
        const formattedDate = format(date, 'yyyy-MM-dd');
        const hasAnswer = answeredDates.has(formattedDate);
        const isFuture = isAfter(startOfDay(date), startOfDay(new Date()));

        return (
            <div {...styleX.props(styles.cellWrap)}>
                {/* 선택 시 파란 원 배경 */}
                {isSelected && <div {...styleX.props(styles.circle)} />}
                {/* 답변 완료 시 하단 파란 점 */}
                {hasAnswer && !isFuture && <div {...styleX.props(styles.dot)} />}
            </div>
        );
    };

    const handleDayClick = (date: Date) => {
        if (isAfter(startOfDay(date), startOfDay(new Date()))) return;
        calendar.onClickDay(date);
    };

    return (
        <section {...styleX.props(styles.base)}>
            {/* 상단 통계 배너 */}
            <div {...styleX.props(styles.promotion, flex.column)}>
                <h3 {...styleX.props(styles.primaryBlack, typo['Heading/lines/H3_20∙130_SemiBold_lines'])}>
                    지금까지 <span {...styleX.props(styles.primaryColor)}>총 {totalCount}번</span> 기록했어요!
                </h3>
                <p {...styleX.props(typo['Body/lines/Body3_14∙150_Regular_lines'], styles.promotionSub)}>
                    오늘 떠오른 생각도 가볍게 기록해 보세요.
                </p>
            </div>

            {/* 메인 캘린더 (월간 뷰 유지) */}
            <div {...styleX.props(styles.calendar)}>
                <Calendar {...calendar} onClickDay={handleDayClick} renderCell={renderCell} />
            </div>

            {/* 선택한 날짜 답변 섹션 */}
            <div {...styleX.props(styles.section)}>
                <p {...styleX.props(typo['Body/Body1_16∙100_SemiBold'], styles.mb16)}>
                    {format(calendar.currentSelectedDate, 'yyyy.MM.dd')}
                </p>

                {selectedAnswer ? (
                    <div 
                        {...styleX.props(styles.answerPreview, flex.column)}
                        onClick={() => navigate({ to: '/answer/memo', search: { questionId: selectedAnswer.questionId } })}
                    >
                        <p {...styleX.props(typo['Body/Body2_15∙150_SemiBold_lines'])}>{selectedAnswer.question?.title}</p>
                        <p {...styleX.props(typo['Body/lines/Body3_14∙150_Regular_lines'], styles.gray80)}>{selectedAnswer.text}</p>
                        <span {...styleX.props(styles.moreLink)}>생각 덧붙이기 &gt;</span>
                    </div>
                ) : (
                    <button {...stylex.props(styles.submitBtn)} onClick={() => navigate({ to: '/question' })}>
                        오늘의 질문 답하기
                    </button>
                )}
            </div>

            {/* 나의 기록들 섹션 (최신 기록 1건 + 전체보기) */}
            <div {...styleX.props(styles.section, flex.column)}>
                <div {...styleX.props(flex.between, flex.vertical, styles.mb16)}>
                    <h4 {...styleX.props(typo['Body/Body1_16∙100_SemiBold'])}>나의 기록들</h4>
                    <button 
                        {...styleX.props(styles.viewAllBtn)}
                        onClick={() => navigate({ to: '/answer' })}
                    >
                        전체보기
                    </button>
                </div>

                {latestAnswer ? (
                    <div 
                        {...styleX.props(styles.latestCard, flex.column)}
                        onClick={() => navigate({ to: '/answer/memo', search: { questionId: latestAnswer.questionId } })}
                    >
                        <span {...styleX.props(styles.latestDate)}>{latestAnswer.question?.dateAt}</span>
                        <p {...styleX.props(typo['Body/Body2_15∙150_SemiBold_lines'])}>{latestAnswer.question?.title}</p>
                        <p {...styleX.props(styles.latestText)}>{latestAnswer.text}</p>
                    </div>
                ) : (
                    <div {...styleX.props(styles.emptyCard)}>아직 기록이 없어요.</div>
                )}
            </div>
        </section>
    );
}

const styles = styleX.create({
    base: { padding: '24px 18px', paddingBottom: 100 },
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
    answerPreview: { padding: 20, borderRadius: 16, backgroundColor: colors.gray20, cursor: 'pointer', gap: 8, border: `1px solid ${colors.gray30}` },
    moreLink: { fontSize: 12, color: colors.main, fontWeight: 600, marginTop: 4 },
    submitBtn: { width: '100%', padding: '16px', borderRadius: 14, backgroundColor: colors.main, color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' },
    latestSection: { gap: 16 },
    viewAllBtn: { background: 'none', border: 'none', color: colors.gray60, fontSize: 13, cursor: 'pointer', fontWeight: 600 },
    latestCard: { padding: 20, borderRadius: 16, backgroundColor: '#fff', border: `1px solid ${colors.gray40}`, cursor: 'pointer', gap: 6 },
    latestDate: { fontSize: 12, color: colors.gray60 },
    latestText: { fontSize: 14, color: colors.gray80, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
    emptyCard: { padding: 40, textAlign: 'center', color: colors.gray50, backgroundColor: colors.gray20, borderRadius: 16 },
    gray80: { color: colors.gray80 },
});