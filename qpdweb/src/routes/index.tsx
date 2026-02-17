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
import { isSameDay, isToday, isFuture, isPast } from 'date-fns';
import { format } from 'date-fns';
import { useGetAnswerByMonth } from '~/domain/answer/hooks/useGetAnswerByMonth';
import useModal from '~/shared/hooks/useModal';
import { LoginBottomSheet } from '~/shared/components/ui/bottom-sheet/login/login-bottom-sheet';
import { useEffect, useState, useMemo } from 'react'; // [수정] useMemo 추가
import { useUserStore } from '~/domain/user/store';
import { useGetAnswerCounts } from '~/domain/answer/hooks/useGetAnswerCounts';
import { useGetAnswerByDate } from '~/domain/answer/hooks/useGetAnswerByDate';
import { AnswerItem } from '~/domain/answer/components/item/answer-item';
import { Button } from '~/shared/components/ui/button/button';
import { useMockStore, useMockActions } from '~/shared/store/mock-data';
import { AnswerDownloadCard } from '~/domain/answer/components/download/answer-download-card';
import { useAnswerDownload } from '~/domain/answer/hooks/useAnswerDownload';

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
  const isLogin = useUserStore(s => s.isLogin);
  const calendar = useCalendar<SearchSchema>(search);

  // [수정] 변수명 명확하게 변경 (answerCountData -> answerListRaw)
  // API가 배열을 반환하므로 배열로 받습니다.
  const { data: answerListRaw } = useGetAnswerByMonth(
      format(calendar.startOfCurrentMonth, 'yyyy-MM-dd'),
  );

  const { data: answerTotalCount } = useGetAnswerCounts();
  const { data: answerDataByDate } = useGetAnswerByDate(
      format(calendar.currentSelectedDate, 'yyyy-MM-dd'),
  );
  const LoginPortal = useModal('login');
  const [shouldRender, setShouldRender] = useState(false);
  const navigate = useNavigate();

  // Download card
  const { cardRef: downloadCardRef, download: downloadAnswer } =
      useAnswerDownload();
  const [downloadQuestion, setDownloadQuestion] = useState('');
  const [downloadAnswerText, setDownloadAnswerText] = useState('');

  const handleDownload = (question: string, answerText: string) => {
      setDownloadQuestion(question);
      setDownloadAnswerText(answerText);
      downloadAnswer();
  };

  // Mock data for testing
  const mockActions = useMockActions();
  const mockQuestions = useMockStore(s => s.questions);
  const useMock = !isLogin;

  const selectedDateStr = format(
      calendar.currentSelectedDate,
      'yyyy-MM-dd',
  );
  const mockQuestionByDate = useMock
      ? mockActions.getQuestionByDate(selectedDateStr)
      : undefined;
  const mockLatestMemo = mockQuestionByDate
      ? mockActions.getLatestMemoByQuestion(mockQuestionByDate.id)
      : undefined;

  const currentMonthStr = format(
      calendar.startOfCurrentMonth,
      'yyyy-MM',
  );
  const mockAnswerCountMap = useMock
      ? mockActions.getAnswerCountByMonth(currentMonthStr)
      : {};

  const mockAllQuestions = useMock ? mockActions.getAllQuestions() : [];
  const mockLatestAnswer = mockAllQuestions[0];
  const mockLatestAnswerMemo = mockLatestAnswer
      ? mockActions.getLatestMemoByQuestion(mockLatestAnswer.id)
      : undefined;

  // [수정] API에서 받은 배열 데이터를 캘린더용 Map 형태로 변환하는 로직 추가
  const realAnswerDateCountMap = useMemo(() => {
      if (!answerListRaw || !Array.isArray(answerListRaw)) return {};
      
      const map: Record<string, number> = {};
      answerListRaw.forEach((item: any) => {
          // item 구조에 따라 question.dateAt 혹은 dateAt을 사용
          // 보통 DB 구조상 item.question?.dateAt 일 확률이 높음
          const dateKey = item.question?.dateAt || item.dateAt; 
          if (dateKey) {
              map[dateKey] = (map[dateKey] || 0) + 1;
          }
      });
      return map;
  }, [answerListRaw]);


  // Effective data (API or mock)
  const effectiveAnswerCountMap = isLogin
      ? realAnswerDateCountMap // [수정] 변환된 맵 사용
      : mockAnswerCountMap;

  const effectiveTotalCount = isLogin
      ? answerTotalCount?.answerCounts
      : mockQuestions.length;
  const effectiveQuestionByDate = isLogin
      ? answerDataByDate?.question
      : mockQuestionByDate;
  const effectiveHasAnswer = isLogin
      ? Boolean(answerDataByDate?.question?.answerList?.length)
      : Boolean(mockQuestionByDate);

  useEffect(() => {
      const timer = requestAnimationFrame(() => {
          setShouldRender(true);
      });
      return () => cancelAnimationFrame(timer);
  }, [isLogin]);

  useEffect(() => {
      if (isLogin) {
          LoginPortal.close();
          return;
      }
      // Don't show login for testing
  }, [isLogin, shouldRender]);

  const onClickOpenLoginBottomSheet = () => {
      LoginPortal.open();
  };

  const isDayDisabled = (date: Date) => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const hasAnswer = Boolean(effectiveAnswerCountMap?.[formattedDate]);

      if (isFuture(date)) {
          return true;
      }

      if (isPast(date) && !hasAnswer) {
          return true;
      }

      return false;
  };

  const renderCell = ({ date }: { date: Date }) => {
      const isCurrentMonth =
          date.getMonth() === calendar.startOfCurrentMonth.getMonth();

      const isSelected = isSameDay(date, calendar.currentSelectedDate);

      const formattedDate = format(date, 'yyyy-MM-dd');

      const hasAnswer = Boolean(effectiveAnswerCountMap?.[formattedDate]);

      const isDisabled = isDayDisabled(date);

      return (
          <div {...stylex.props(styles.cellWrap)}>
              <div {...stylex.props(isSelected && styles.circle)} />

              <div
                  data-cell=''
                  {...stylex.props(
                      styles.cell,
                      typo['Caption/Caption2_12∙100_SemiBold'],
                      !isCurrentMonth && styles.gray,
                      isDisabled && styles.gray,
                      isSelected && styles.white,
                  )}>
                  {date.getDate()}
              </div>

              {hasAnswer && <div {...stylex.props(styles.dot)} />}
          </div>
      );
  };

  return (
      <section {...stylex.props(styles.base)}>
          {/* Promotion Banner */}
          <div data-promotion {...stylex.props(styles.promotion, flex.column)}>
              <div
                  {...stylex.props(styles.promotionTitle, flex.vertical)}
                  onClick={onClickOpenLoginBottomSheet}>
                  <img
                      src='/image/icon/mail.png'
                      alt='프로모션 아이콘'
                      {...stylex.props(styles.promotionIcon)}
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
                              {effectiveTotalCount ?? 0}
                              {'번'}
                          </span>
                          {' 기록했어요!'}
                      </>
                  </h3>
              </div>
              <p
                  {...stylex.props(
                      typo['Body/lines/Body3_14∙150_Regular_lines'],
                      styles.promotionSub,
                  )}>
                  {'오늘 떠오른 생각도 가볍게 기록해 보세요.'}
              </p>
          </div>

          {/* Calendar */}
          <div data-calendar-wrap {...stylex.props(styles.calendar)}>
              <Calendar
                  {...calendar}
                  renderCell={renderCell}
                  isDayDisabled={isDayDisabled}
              />
          </div>

          {/* Date Answer Section */}
          <div {...stylex.props(styles.answerWrap, flex.column)}>
              <div
                  {...stylex.props(
                      styles.answerDateWrap,
                      flex.between,
                      flex.vertical,
                  )}>
                  <p
                      data-primary-black
                      {...stylex.props(
                          typo['Body/Body1_16∙100_SemiBold'],
                          styles.primaryBlack,
                      )}>
                      {format(calendar.currentSelectedDate, 'yyyy.MM.dd')}
                      {' 답변'}
                  </p>

                  {effectiveHasAnswer && (
                      <button
                          {...stylex.props(styles.addMemoBtn, flex.vertical)}
                          onClick={() => {
                              const q = effectiveQuestionByDate;
                              if (q) {
                                  navigate({
                                      to: '/answer/memo',
                                      search: { questionId: q.id },
                                  });
                              }
                          }}>
                          <span
                              {...stylex.props(
                                  styles.mainColor,
                                  typo['Caption/Caption1_13∙100_SemiBold'],
                              )}>
                              {'+ 메모 추가'}
                          </span>
                      </button>
                  )}
              </div>

              {effectiveHasAnswer ? (
                  <AnswerItem
                      questionData={effectiveQuestionByDate}
                      latestMemo={
                          isLogin ? undefined : mockLatestMemo
                      }
                      onClick={() => {
                          const q = effectiveQuestionByDate;
                          if (q) {
                              navigate({
                                  to: '/answer/memo',
                                  search: { questionId: q.id },
                              });
                          }
                      }}
                      onDownload={() => {
                          const q = effectiveQuestionByDate;
                          if (q) {
                              handleDownload(
                                  q.title,
                                  q.answerList[0]?.text ?? '',
                              );
                          }
                      }}
                  />
              ) : (
                  <div {...stylex.props(flex.center, flex.column)}>
                      <p {...stylex.props(styles.answerFallbackText)}>
                          해당 일에 아직 답변이 없어요.
                      </p>

                      {isToday(new Date()) && (
                          <div {...stylex.props(styles.buttonWidthWrap)}>
                              <Button
                                  onClick={() => navigate({ to: '/question' })}
                                  variants='primary'>
                                  지금 답변하러 가기
                              </Button>
                          </div>
                      )}
                  </div>
              )}
          </div>

          {/* My All Answers Section */}
          <div data-all-answers {...stylex.props(styles.allAnswerSection)}>
              <div
                  {...stylex.props(
                      styles.allAnswerHeader,
                      flex.between,
                      flex.vertical,
                  )}>
                  <p
                      data-primary-black
                      {...stylex.props(
                          typo['Body/Body1_16∙100_SemiBold'],
                          styles.primaryBlack,
                      )}>
                      나의 모든 답변
                  </p>

                  <button
                      {...stylex.props(styles.viewAllBtn)}
                      onClick={() => navigate({ to: '/answer' })}>
                      <span
                          {...stylex.props(
                              styles.mainColor,
                              typo['Caption/Caption1_13∙100_SemiBold'],
                          )}>
                          전체보기
                      </span>
                  </button>
              </div>

              {(isLogin ? effectiveQuestionByDate : mockLatestAnswer) ? (
                  <AnswerItem
                      questionData={
                          isLogin ? effectiveQuestionByDate : mockLatestAnswer
                      }
                      latestMemo={isLogin ? undefined : mockLatestAnswerMemo}
                      onClick={() => {
                          const q = isLogin
                              ? effectiveQuestionByDate
                              : mockLatestAnswer;
                          if (q) {
                              navigate({
                                  to: '/answer/memo',
                                  search: { questionId: q.id },
                              });
                          }
                      }}
                      onDownload={() => {
                          const q = isLogin
                              ? effectiveQuestionByDate
                              : mockLatestAnswer;
                          if (q) {
                              handleDownload(
                                  q.title,
                                  q.answerList[0]?.text ?? '',
                              );
                          }
                      }}
                  />
              ) : (
                  <div {...stylex.props(flex.center, styles.emptyAllAnswer)}>
                      <p {...stylex.props(styles.answerFallbackText)}>
                          아직 답변이 없어요.
                      </p>
                  </div>
              )}
          </div>

          {shouldRender && !isLogin && (
              <LoginPortal.Render type='bottomSheet' animationType='bottomSheet'>
                  <LoginBottomSheet />
              </LoginPortal.Render>
          )}

          {/* Hidden download card for image capture */}
          <div
              {...stylex.props(styles.hiddenDownloadCard)}
              ref={downloadCardRef}>
              <AnswerDownloadCard
                  question={downloadQuestion}
                  answer={downloadAnswerText}
              />
          </div>
      </section>
  );
}

const styles = stylex.create({
  base: {
      padding: '24px 18px',
      paddingBottom: 60,
  },
  promotion: {
      width: '100%',
      padding: '16px',
      borderRadius: 14,
      backgroundColor: colors.gray20,
      gap: 8,
  },
  promotionTitle: {
      gap: 8,
  },
  promotionIcon: {
      width: 40,
      height: 40,
  },
  promotionSub: {
      color: colors.gray80,
      paddingLeft: 48,
  },
  primaryBlack: {
      color: colors.gray90,
  },
  primaryColor: {
      color: colors.main,
  },
  mainColor: {
      color: colors.main,
  },
  gray: {
      color: colors.gray80,
  },
  white: {
      color: colors.white,
  },
  calendar: {
      paddingTop: 28,
      paddingBottom: 32,
      borderBottom: `1px solid ${colors.gray40}`,
      marginBottom: 24,
  },
  cellWrap: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
  },
  circle: {
      position: 'absolute',
      top: 4,
      borderRadius: '50%',
      width: 22,
      height: 22,
      zIndex: 0,
      backgroundColor: colors.main,
  },
  cell: {
      position: 'relative',
      zIndex: 1,
      borderRadius: '50%',
      color: colors.gray90,
      padding: 10,
  },
  dot: {
      width: 4,
      borderRadius: '50%',
      height: 4,
      backgroundColor: colors.main,
  },
  answerWrap: {
      gap: 16,
  },
  answerDateWrap: {},
  answerFallbackText: {
      color: colors.gray80,
      fontSize: 14,
      lineHeight: '150%',
      textAlign: 'center',
      marginTop: 16,
      marginBottom: 16,
  },
  buttonWidthWrap: {
      width: 200,
  },
  addMemoBtn: {
      gap: 4,
      cursor: 'pointer',
  },
  allAnswerSection: {
      marginTop: 32,
      paddingTop: 24,
      borderTop: `1px solid ${colors.gray40}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
  },
  allAnswerHeader: {},
  viewAllBtn: {
      cursor: 'pointer',
  },
  emptyAllAnswer: {
      padding: '24px 0',
  },
  hiddenDownloadCard: {
      position: 'fixed',
      top: -9999,
      left: -9999,
      zIndex: -1,
      pointerEvents: 'none',
  },
});