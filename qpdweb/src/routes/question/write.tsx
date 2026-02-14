import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { AnswerTimer } from '~/domain/answer/components/timer/answer-timer';
import { Question } from '~/domain/answer/api';

// [수정] Props에 question 추가 (Timer에 시간을 넘겨주기 위함)
interface Props {
    question: Question; 
    value: string;
    setValue: (value: string) => void;
    onNext: () => void;
    onPrev: () => void;
}

// [수정] Props에서 question 구조 분해 할당
export const NicknameStep = ({ question, value, setValue, onNext, onPrev }: Props) => {
    return (
        <div {...stylex.props(flex.column, styles.container)}>
            <div {...stylex.props(flex.column, styles.header)}>
                {/* [수정] timeAt 속성 전달 */}
                <AnswerTimer timeAt={question.dateAt} /> 
                <h2 {...stylex.props(typo['Heading/H3_20∙130_SemiBold'], styles.title)}>
                    닉네임을 입력해주세요
                </h2>
                <p {...stylex.props(typo['Body/Body3_14∙150_Regular'], styles.description)}>
                    답변과 함께 보여질 닉네임이에요.
                </p>
            </div>

            <div {...stylex.props(flex.column, styles.inputWrapper)}>
                <input
                    {...stylex.props(styles.input, typo['Body/Body1_16∙150_Regular'])}
                    placeholder="닉네임 입력"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    maxLength={10}
                />
                <span {...stylex.props(typo['Body/Body4_13∙150_Regular'], styles.counter)}>
                    {value.length}/10
                </span>
            </div>

            <div {...stylex.props(flex.row, styles.buttonGroup)}>
                <button 
                    onClick={onPrev}
                    {...stylex.props(styles.prevButton, typo['Body/Body2_15∙150_Regular'])}
                >
                    이전
                </button>
                <button 
                    onClick={onNext}
                    disabled={!value.trim()}
                    {...stylex.props(
                        styles.nextButton, 
                        !value.trim() && styles.disabled,
                        typo['Body/Body2_15∙150_Regular']
                    )}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

const styles = stylex.create({
    container: {
        height: '100%',
        justifyContent: 'space-between',
        paddingBottom: 20
    },
    header: {
        gap: 12,
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 40
    },
    title: {
        color: colors.gray90
    },
    description: {
        color: colors.gray60
    },
    inputWrapper: {
        width: '100%',
        gap: 8
    },
    input: {
        width: '100%',
        padding: '16px 20px',
        borderRadius: 12,
        backgroundColor: colors.gray10,
        border: 'none',
        outline: 'none',
        color: colors.gray90,
        '::placeholder': {
            color: colors.gray40
        }
    },
    counter: {
        alignSelf: 'flex-end',
        color: colors.gray50
    },
    buttonGroup: {
        gap: 12,
        width: '100%'
    },
    prevButton: {
        flex: 1,
        padding: '16px',
        borderRadius: 12,
        backgroundColor: colors.gray20,
        color: colors.gray60,
        border: 'none',
        cursor: 'pointer'
    },
    nextButton: {
        flex: 2,
        padding: '16px',
        borderRadius: 12,
        backgroundColor: colors.main,
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    disabled: {
        backgroundColor: colors.gray30,
        color: colors.gray50,
        cursor: 'not-allowed'
    }
});