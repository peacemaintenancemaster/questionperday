import { useTheme } from '@emotion/react';
import { format, isValid } from 'date-fns'; // isValid 추가
import { ko } from 'date-fns/locale/ko';
import { useState, type MouseEventHandler, type MouseEvent } from 'react';
import { Badge } from '~/components/ui/badge/badge';
import { Icon } from '~/images';
import { colorVariantMap } from '~/utils/color';
import type { QuestionBaseSchema } from '../../schema/question.add';
import type { QuestionType } from '~/types/answer/answer';
import { PreviewItemStyle as styles } from './preview-item.style';
import { useGetAnswerList } from '~/features/answer/hooks/useGetAnswerList';

type Props = QuestionBaseSchema & { type: QuestionType } & {
    isEllipsis?: boolean;
    canDelete?: boolean;
    onClickOpenDelModal?: (id: number, dateAt: string) => void;
    onClickOpenSidebar?: (e: MouseEvent) => void;
    isAnswerListOpen?: boolean;
};

export function PreviewItem(props: Props) {
    const {
        id,
        type,
        dateAt,
        timeAt,
        title,
        subText,
        isEllipsis = false,
        canDelete = false,
        onClickOpenDelModal: _onClickOpenDelModal = () => {},
        onClickOpenSidebar = () => {},
    } = props;

    const theme = useTheme();
    const [isHover, setIsHover] = useState(false);
    const { data, isSuccess } = useGetAnswerList(id);

    function onHover() {
        setIsHover(s => !s);
    }

    const onClickOpenDelModal: MouseEventHandler<HTMLButtonElement> = e => {
        e.stopPropagation();
        _onClickOpenDelModal(id, dateAt);
    };

    // --- 날짜 안전 처리 로직 추가 ---
    const rawDateStr = `${dateAt || ''} ${timeAt || ''}`.trim();
    const targetDate = new Date(rawDateStr);
    
    // 날짜가 유효한지 확인하고, 유효하지 않으면 대시(-) 등으로 표시합니다.
    const formattedDate = isValid(targetDate) && rawDateStr !== ""
        ? format(targetDate, 'yy.MM.d / HH시 mm분', { locale: ko })
        : '일시 정보 없음';
    // ----------------------------

    return (
        <div css={styles.wrap} onMouseEnter={onHover} onMouseLeave={onHover}>
            <header css={styles.itemHeader}>
                <Badge type={type} />

                {canDelete && isHover && (
                    <button css={{ cursor: 'pointer' }} onClick={onClickOpenDelModal}>
                        <Icon.TrashBin size='14' />
                    </button>
                )}
            </header>

            <div css={styles.contentWrap}>
                <p css={styles.titleText(theme, isEllipsis)}>{title}</p>
                <p css={styles.contentText(theme, isEllipsis)}>{subText}</p>
                <div css={styles.timeTextWrap}>
                    <Icon.Clock size='14' color={colorVariantMap[type]} />
                    <p css={styles.timeText(theme, colorVariantMap[type])}>
                        {formattedDate} 
                    </p>
                </div>
            </div>

            {isSuccess &&
                typeof _onClickOpenDelModal === 'function' &&
                Boolean(data?.metadata?.totalCount) && (
                    <button
                        data-dateAt={dateAt}
                        css={styles.answerCountWrap(theme)}
                        onClick={onClickOpenSidebar}>
                        <div css={styles.answerCountLeftWrap}>
                            <div css={styles.dot(theme)} />
                            <p css={styles.answerCountText(theme)}>
                                {data?.metadata?.totalCount}개의 답변
                            </p>
                        </div>
                        <Icon.ArrowRight size='12' />
                    </button>
                )}
        </div>
    );
}