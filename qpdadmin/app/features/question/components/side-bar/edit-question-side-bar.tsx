import { useTheme, type Theme } from '@emotion/react';
import { SidebarStyle as styles } from './side-bar.style';

import { useEffect, type ChangeEvent } from 'react';
import { Button } from '~/components/ui/button/Button';
import { MiniCalendar } from '~/components/ui/calendar/mini/mini-calendar';
import { Input } from '~/components/ui/input/Input';
import { Icon } from '~/images';
import { type QuestionBaseSchema } from '../../schema/question.add';
import { useCalendar } from '~/hooks/useCalendar';
import { produce } from 'immer';
import { format } from 'date-fns';
import { ToggleSwitch } from '~/components/ui/button/toggle/toggle-button';
import { API } from '~/api';
import {
	QuestionContext,
	type QuestionBaseSchemaWithId,
} from '../../context/question';
import type { QuestionType } from '~/types/answer/answer';
import { initBaseQuestion } from '../../schema/question.add';
import { Editor } from '~/components/ui/editor/Editor';
import React from 'react';
import { useAddPresignedImage } from '~/hooks/useAddPresigendImage';
import { AddImageButton } from '~/components/ui/button/add-image/AddImageButton';

interface Props {
	onClickClose: () => void;
	hoveredDate?: Date | null;
	selectedDate?: Date | null;
	question?: QuestionBaseSchema & { type: QuestionType };
	openSavedModal: () => void;
	openSavedErrorModal: () => void;
}

export function EditQuestionSideBar(props: Props) {
	const {
		onClickClose,
		question: _question,
		selectedDate,
		openSavedErrorModal,
		openSavedModal,
	} = props;
	const { uploadImage, imageIdList } = useAddPresignedImage();

	const theme = useTheme();
	const {
		onClickDay: _onClickDay,
		onClickMonth: _onClickMonth,
		...calendarState
	} = useCalendar();
	const { dispatch } = React.use(QuestionContext);
	const [isDateOpen, setIsDateOpen] = React.useState(false);
	const [question, setQuestion] = React.useState(_question || initBaseQuestion);

	const [editorText, setEditorText] = React.useState(_question.article);
	const [timeMap, setTimeMap] = React.useState<{
		hours: string;
		minutes: string;
	}>(() => {
		const [hours, minutes] = formatTime(_question?.timeAt || '');

		return {
			hours: hours || '',
			minutes: minutes || '',
		};
	});

	const formattedDateAt = (() => {
		const date = question?.dateAt || !selectedDate;
		return format(new Date(date as string | number | Date), 'yy.MM.dd');
	})();

	const canEditQuestion = [
		question?.dateAt,
		question?.subText,
		question?.title,
	].every(Boolean);

	function onClickDateCalendar() {
		setIsDateOpen(s => !s);
	}

	function onClickDay(date: Date) {
		setQuestion(s =>
			produce(s, draft => {
				_onClickDay(date, 'override');
				const currentTime = draft.dateAt ? new Date(draft.dateAt) : new Date();
				date.setHours(currentTime.getHours());
				date.setMinutes(currentTime.getMinutes());
				draft.dateAt = date.toISOString();
			}),
		);
	}

	function onClickMonth(params: number) {
		setQuestion(s =>
			produce(s, draft => {
				const currentDate = new Date(draft.dateAt);
				_onClickMonth(params, currentDate);
				currentDate.setMonth(currentDate.getMonth() + params);
				draft.dateAt = currentDate.toISOString();
			}),
		);
	}

	function onChangeInput(
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) {
		const { name, value } = e.target;

		if (name === 'hours' || name === 'minutes') {
			setTimeMap(
				produce(draft => {
					draft[name] = value;
				}),
			);

			return;
		}

		setQuestion(
			produce(draft => {
				(draft[name as keyof typeof draft] as any) = value;
			}),
		);
	}

	function onClickToggleButton(type: 'needNickname' | 'needPhone') {
		setQuestion(s =>
			produce(s, draft => {
				draft[type] = !draft[type];
			}),
		);
	}

	async function onClickSave() {
		try {
			const { timeAt, type, ...rest } = question as any;
			const formattedTimeAt = `${timeMap.hours}:${timeMap.minutes}:00`;

			await API.Question.edit(rest.id, {
				...rest,
				article: editorText,
				timeAt: formattedTimeAt,
				logoImageId: imageIdList[0],
			});

			dispatch({
				type: 'SAVE',
				payload: {
					...rest,
					dateAt: rest.dateAt,
					timeAt: formattedTimeAt,
					type: 'saved' as QuestionType,
					logoImageId: imageIdList[0],
				} as QuestionBaseSchemaWithId,
			});

			onClickClose();
			openSavedModal();
		} catch {
			openSavedErrorModal();
		}
	}

	function onChangeEditorText(value: string) {
		setEditorText(value);
	}

	return (
		<section css={styles.wrap}>
			<header css={styles.header}>
				<button onClick={onClickClose}>
					<Icon.DoubleArrow size='24px' />
				</button>
			</header>

			<div css={styles.form}>
				<div css={styles.row}>
					<label css={styles.label(theme)}>날짜</label>

					<div css={styles.inputWrap}>
						<Input
							css={styles.dateInput(theme)}
							value={formattedDateAt as string}
							readOnly
						/>

						<button
							css={styles.dateButton(theme)}
							onClick={onClickDateCalendar}>
							날짜 선택
						</button>

						{isDateOpen && (
							<div css={styles.calendarWrap(theme)}>
								<MiniCalendar
									{...calendarState}
									onClickDay={onClickDay}
									onClickMonth={onClickMonth}
								/>

								<div css={styles.buttonGroup}>
									<Button
										css={styles.cancelButton(theme)}
										onClick={onClickDateCalendar}>
										<p css={styles.cancelButtonText(theme)}>취소</p>
									</Button>

									<Button
										css={styles.confirmButton(theme)}
										onClick={onClickDateCalendar}>
										<p css={styles.confirmButtonText(theme)}>선택 완료</p>
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>

				<div css={styles.row}>
					<div css={styles.timeLabelWrap}>
						<label css={styles.label(theme)}>예약 시간</label>
					</div>

					<div css={styles.timeWrap}>
						<div css={styles.timeInputWrap}>
							<Input
								css={styles.timeInput(theme)}
								onChange={onChangeInput}
								type='number'
								name='hours'
								min={0}
								max={23}
								value={timeMap.hours.toString()}
								placeholder={'시'}
							/>

							<p css={styles.timeText(theme)}>시</p>
						</div>

						<div css={styles.timeInputWrap}>
							<Input
								value={timeMap.minutes}
								css={styles.timeInput(theme)}
								onChange={onChangeInput}
								type='number'
								name='minutes'
								min={0}
								max={59}
								placeholder='분'
							/>

							<p css={styles.timeText(theme)}>분</p>
						</div>
					</div>
				</div>

				<div css={styles.row}>
					<label css={styles.label(theme)}>질문</label>

					<textarea
						placeholder='질문을 입력해주세요.'
						name='title'
						value={question?.title}
						css={styles.textarea(theme)}
						onChange={onChangeInput}
					/>
				</div>

				<div css={styles.row}>
					<label css={styles.label(theme)}>서브 텍스트</label>

					<textarea
						placeholder='서브텍스트를 입력해주세요.'
						name='subText'
						value={question?.subText}
						css={styles.textarea(theme)}
						onChange={onChangeInput}
					/>
				</div>

				<div css={styles.row}>
					<label css={styles.label(theme)}>에디터</label>

					<Editor onChangeValue={onChangeEditorText} value={editorText} />
				</div>

				<div
					css={[
						styles.row,
						{
							marginTop: '60px',
						},
					]}>
					<label css={styles.label(theme)}>절차 추가</label>

					<div css={styles.toggleRowWrap}>
						<div css={styles.toggleRow(theme)}>
							<p css={styles.toggleText(theme)}>닉네임</p>

							<ToggleSwitch
								isOn={question?.needNickname as boolean}
								onClickToggle={() => onClickToggleButton('needNickname')}
							/>
						</div>

						<div css={styles.toggleRow(theme)}>
							<p css={styles.toggleText(theme)}>연락처</p>

							<ToggleSwitch
								isOn={question?.needPhone as boolean}
								onClickToggle={() => onClickToggleButton('needPhone')}
							/>
						</div>
					</div>
				</div>

				<div css={styles.row}>
					<label css={styles.label(theme)}>광고주 콜라보 로고</label>

					<AddImageButton
						buttonHeight={38}
						imageHeight={80}
						uploadImage={uploadImage}
						imageIdList={
							Boolean(imageIdList.length) ? imageIdList : [question.logoImageId]
						}
					/>
				</div>
			</div>

			<div css={styles.footerButtonGroup}>
				<Button
					css={[
						styles.footerButton(theme),
						{
							backgroundColor: theme.color.main,
							color: theme.color.grayScale.white,
						},
					]}
					onClick={onClickSave}
					disabled={!canEditQuestion}>
					예약 완료
				</Button>
			</div>
		</section>
	);
}

function formatTime(timeAt: string) {
	const [hours, minutes, seconds] = timeAt.split(':');

	return [hours, minutes] as const;
}
