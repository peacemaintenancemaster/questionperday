import { createFileRoute, useSearch } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '~/shared/components/ui/button/button';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getToday } from '~/domain/question/api/question';
import { 
    getMemos, 
    addMemoToSupabase, 
    updateMemoInSupabase, 
    deleteMemoInSupabase 
} from '~/domain/answer/api/memo';

interface MemoQuestion {
    id: number;
    title: string;
    dateAt: string;
    answerList?: { id: string; text: string }[];
}

const searchSchema = z.object({
    questionId: z.number(),
});

export const Route = createFileRoute('/answer/memo')({
    component: MemoPage,
    validateSearch: zodValidator(searchSchema),
});

function MemoPage() {
    const { questionId } = useSearch({ from: '/answer/memo' });
    const queryClient = useQueryClient();
    
    const [newMemoText, setNewMemoText] = useState('');
    const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const maxLength = 300;

    const { data: questionData, isLoading: isQuestionLoading } = useQuery({
        queryKey: ['question', questionId],
        queryFn: () => getToday(questionId),
    });

    const question = questionData?.question as unknown as MemoQuestion;
    const answerId = question?.answerList?.[0]?.id;

    const { data: memos = [], isLoading: isMemosLoading } = useQuery({
        queryKey: ['memos', answerId],
        queryFn: () => getMemos(String(answerId)),
        enabled: !!answerId,
    });

    const addMutation = useMutation({
        mutationFn: (text: string) => addMemoToSupabase(String(answerId), text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memos', answerId] });
            setNewMemoText('');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, text }: { id: string; text: string }) => updateMemoInSupabase(id, text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memos', answerId] });
            setEditingMemoId(null);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteMemoInSupabase(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memos', answerId] });
        }
    });

    const handleAddMemo = () => {
        if (!newMemoText.trim() || addMutation.isPending) return;
        addMutation.mutate(newMemoText.trim());
    };

    if (isQuestionLoading || isMemosLoading) return null;

    return (
        <section {...stylex.props(styles.base, flex.column)}>
            <div {...stylex.props(styles.answerCard, flex.column)}>
                <p {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.mainColor)}>Q.</p>
                <div {...stylex.props(styles.answerContent, flex.column)}>
                    <p {...stylex.props(typo['Body/lines/Body3_14∙150_SemiBold_lines'])}>{question?.title}</p>
                    <p {...stylex.props(typo['Body/lines/Body3_14∙150_Regular_lines'], styles.gray80)}>
                        {question?.answerList?.[0]?.text || '작성된 답변이 없습니다.'}
                    </p>
                </div>
                <p {...stylex.props(typo['Caption/Caption1_13∙100_SemiBold'], styles.mainColor)}>
                    {question?.dateAt.replace(/-/g, '.')}
                </p>
            </div>

            <div {...stylex.props(flex.column)}>
                {memos.map(memo => (
                    <div key={memo.id} {...stylex.props(styles.existingMemo, flex.column)}>
                        <div {...stylex.props(flex.between, flex.vertical)}>
                            <div {...stylex.props(flex.vertical, styles.gap8)}>
                                <span {...stylex.props(styles.memoTag, typo['Caption/Caption2_12∙100_SemiBold'])}>추가한 메모</span>
                                <span {...stylex.props(typo['Caption/Caption2_12∙100_Regular'], styles.gray70)}>
                                    {format(new Date(memo.created_at), 'yyyy.MM.dd')}
                                </span>
                            </div>
                            
                            <div {...stylex.props(flex.vertical, styles.gap12)}>
                                <button {...stylex.props(styles.editBtn)} onClick={() => { setEditingMemoId(memo.id); setEditText(memo.content); }}>
                                    <span {...stylex.props(typo['Caption/Caption1_13∙100_SemiBold'], styles.mainColor)}>수정</span>
                                </button>
                                <button {...stylex.props(styles.editBtn)} onClick={() => { if(confirm('삭제할까요?')) deleteMutation.mutate(memo.id) }}>
                                    <span {...stylex.props(typo['Caption/Caption1_13∙100_SemiBold'], styles.gray70)}>삭제</span>
                                </button>
                            </div>
                        </div>

                        {editingMemoId === memo.id ? (
                            <div {...stylex.props(flex.column, styles.editWrapper)}>
                                <textarea 
                                    {...stylex.props(styles.textarea, styles.editArea)} 
                                    value={editText} 
                                    onChange={(e) => setEditText(e.target.value)}
                                    autoFocus
                                />
                                <div {...stylex.props(flex.vertical, styles.editActions)}>
                                    <button {...stylex.props(styles.textBtn)} onClick={() => setEditingMemoId(null)}>취소</button>
                                    <button {...stylex.props(styles.textBtn, styles.mainColor)} onClick={() => updateMutation.mutate({ id: memo.id, text: editText })}>저장</button>
                                </div>
                            </div>
                        ) : (
                            <p {...stylex.props(typo['Body/lines/Body3_14∙150_Regular_lines'], styles.gray80)}>{memo.content}</p>
                        )}
                    </div>
                ))}
            </div>

            <div {...stylex.props(styles.inputSection, flex.column)}>
                <div {...stylex.props(flex.between, flex.vertical, styles.inputHeader)}>
                    <p {...stylex.props(typo['Body/Body3_14∙100_SemiBold'], styles.primaryBlack)}>추가할 메모</p>
                    <p {...stylex.props(typo['Caption/Caption2_12∙100_Regular'], styles.gray70)}>({newMemoText.length}/{maxLength})</p>
                </div>
                <div {...stylex.props(styles.inputDivider)} />
                <textarea
                    {...stylex.props(styles.textarea)}
                    placeholder='기록하고 싶은 생각을 남겨보세요.'
                    maxLength={maxLength}
                    value={newMemoText}
                    onChange={e => setNewMemoText(e.target.value)}
                />
            </div>

            <div {...stylex.props(styles.spacer)} />
            <div {...stylex.props(styles.submitWrap)}>
                <Button variants='primary' disabled={!newMemoText.trim() || addMutation.isPending} onClick={handleAddMemo}>
                    {addMutation.isPending ? '저장 중...' : '메모 추가하기'}
                </Button>
            </div>
        </section>
    );
}

const styles = stylex.create({
    base: { padding: '24px 18px', minHeight: 'calc(100vh - 50px)', gap: 0 },
    answerCard: { width: '100%', padding: 16, border: `1px solid ${colors.main}`, borderRadius: 14, gap: 12 },
    answerContent: { gap: 8 },
    mainColor: { color: colors.main },
    gray80: { color: colors.gray80 },
    gray70: { color: colors.gray70 },
    primaryBlack: { color: colors.gray90 },
    existingMemo: { marginTop: 16, padding: '12px 0', borderBottom: `1px solid ${colors.gray40}`, gap: 8 },
    memoTag: { display: 'inline-flex', padding: '3px 8px', borderRadius: 4, backgroundColor: colors.secondary, color: colors.main },
    editBtn: { backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0' },
    textBtn: { backgroundColor: 'transparent', border: 'none', cursor: 'pointer' },
    inputSection: { marginTop: 24 },
    inputHeader: { marginBottom: 8 },
    inputDivider: { width: '100%', height: 1, backgroundColor: colors.main, marginBottom: 16 },
    textarea: { width: '100%', minHeight: 100, border: 'none', outline: 'none', resize: 'none', fontSize: 14, lineHeight: '150%', color: colors.gray90, backgroundColor: 'transparent' },
    editWrapper: { gap: 8, marginTop: 12 },
    editActions: { gap: 8, justifyContent: 'flex-end' },
    editArea: { padding: 8, backgroundColor: colors.gray20, borderRadius: 8 },
    spacer: { flexGrow: 1 },
    submitWrap: { position: 'sticky', bottom: 16, width: '100%', paddingTop: 16, backgroundColor: '#fff' },
    gap8: { gap: 8 },
    gap12: { gap: 12 },
});