import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useMockStore, useMockActions } from '~/shared/store/mock-data';
import { AnswerItem } from '~/domain/answer/components/item/answer-item';
import { AnswerDownloadCard } from '~/domain/answer/components/download/answer-download-card';
import { useAnswerDownload } from '~/domain/answer/hooks/useAnswerDownload';
import { useState, useRef, useEffect } from 'react';
import { Icon } from '~/shared/images';
import { useModal } from '~/shared/hooks/useModal';
import { useUser } from '~/domain/user/store';
import { supabase } from '~/lib/supabase';

export const Route = createFileRoute('/profile')({
	component: ProfilePage,
});

function ProfilePage() {
	const navigate = useNavigate();
	const { getAllQuestions, getLatestMemoByQuestion } = useMockActions();
	const allQuestions = getAllQuestions();

	const bookmarkedQuestion = allQuestions[0];
	const bookmarkedMemo = bookmarkedQuestion
		? getLatestMemoByQuestion(bookmarkedQuestion.id)
		: undefined;

	// Download
	const { cardRef: downloadCardRef, download: downloadAnswer } =
		useAnswerDownload();
	const [dlQuestion, setDlQuestion] = useState('');
	const [dlAnswerText, setDlAnswerText] = useState('');

	const handleDownload = (question: string, answerText: string) => {
		setDlQuestion(question);
		setDlAnswerText(answerText);
		downloadAnswer();
	};

	// Modals
	const profileModal = useModal('profile-edit');
	const inviteModal = useModal('invite-friends');
	const withdrawModal = useModal('withdraw-confirm');

	const user = useUser();
	
	// Profile edit state - 카카오톡 닉네임을 기본값으로 사용
	const [nickname, setNickname] = useState(user?.name || '');
	const [editNickname, setEditNickname] = useState(user?.name || '');
	const [isEditingNickname, setIsEditingNickname] = useState(false);
	const nicknameInputRef = useRef<HTMLInputElement>(null);

	// 사용자 정보가 변경되면 닉네임 업데이트
	useEffect(() => {
		if (user?.name) {
			setNickname(user.name);
			setEditNickname(user.name);
		}
	}, [user?.name]);

	const handleProfileSave = async () => {
		try {
			// Supabase에 닉네임 업데이트
			const { data: { session } } = await supabase.auth.getSession();
			if (session?.user) {
				const { error } = await supabase
					.from('users')
					.update({ nickname: editNickname })
					.eq('id', user?.id);

				if (error) throw error;
			}
			
			setNickname(editNickname);
			setIsEditingNickname(false);
			profileModal.close();
		} catch (error) {
			console.error('닉네임 저장 에러:', error);
			alert('닉네임 저장에 실패했습니다.');
		}
	};

	const handleProfileOpen = () => {
		setEditNickname(nickname);
		setIsEditingNickname(false);
		profileModal.open();
	};

	const handleWithdraw = () => {
		withdrawModal.close();
	};

	return (
		<section {...stylex.props(styles.base, flex.column)}>
			{/* Profile Card */}
			<div data-profile-card {...stylex.props(styles.profileCard, flex.vertical)}>
				<div {...stylex.props(styles.avatar)}>
					<Icon.User size='32' color='#9a9a9a' />
				</div>
				<div {...stylex.props(styles.profileInfo, flex.column)}>
					<div {...stylex.props(flex.between, flex.vertical)}>
						<p
							data-primary-black
							{...stylex.props(
								typo['Heading/H4_18∙100_SemiBold'],
								styles.primaryBlack,
							)}>
							{nickname}님
						</p>
						<button
							{...stylex.props(styles.editBtn)}
							onClick={() => {
								setIsEditingNickname(true);
								setTimeout(() => nicknameInputRef.current?.focus(), 50);
							}}>
							<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
								<path d='M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13' stroke='#2C5AFF' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
								<path d='M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z' stroke='#2C5AFF' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
							</svg>
						</button>
					</div>
					<div {...stylex.props(flex.vertical, styles.emailRow)}>
						<p
							data-gray-text
							{...stylex.props(
								typo['Body/Body3_14∙100_Regular'],
								styles.gray80,
							)}>
							{user?.email || 'user@naver.com'}
						</p>
						<Icon.ArrowRight size='12' color='#9a9a9a' />
					</div>
				</div>
			</div>

			{/* Invite Section */}
			<div
				data-profile-section
				{...stylex.props(styles.section, flex.between, flex.vertical)}>
				<div {...stylex.props(flex.column)}>
					<p
						data-primary-black
						{...stylex.props(
							typo['Body/Body1_16∙100_SemiBold'],
							styles.primaryBlack,
						)}>
						친구 초대하기
					</p>
				</div>
				<button
					{...stylex.props(styles.inviteBtn)}
					onClick={async () => {
						try {
							await navigator.clipboard.writeText('https://questionperday.me/');
							alert('링크가 복사되었습니다!');
						} catch (error) {
							console.error('링크 복사 실패:', error);
							alert('링크 복사에 실패했습니다.');
						}
					}}>
					<span
						{...stylex.props(
							typo['Body/Body3_14∙100_SemiBold'],
						)}>
						링크 복사
					</span>
				</button>
			</div>

			{/* Bookmark Section */}
			<div data-profile-section {...stylex.props(styles.bookmarkSection, flex.column)}>
				<p
					data-primary-black
					{...stylex.props(
						typo['Body/Body1_16∙100_SemiBold'],
						styles.primaryBlack,
					)}>
					북마크
				</p>

				{bookmarkedQuestion ? (
					<div {...stylex.props(styles.bookmarkCardWrap)}>
						<AnswerItem
							questionData={bookmarkedQuestion}
							latestMemo={bookmarkedMemo}
							showBookmark
							bookmarkActive
							onClick={() =>
								navigate({
									to: '/answer/memo',
									search: { questionId: bookmarkedQuestion.id },
								})
							}
							onDownload={() =>
								handleDownload(
									bookmarkedQuestion.title,
									bookmarkedQuestion.answerList[0]?.text ?? '',
								)
							}
						/>
					</div>
				) : (
					<p
						data-gray-text
						{...stylex.props(
							typo['Body/Body3_14∙100_Regular'],
							styles.gray80,
						)}>
						북마크한 답변이 없어요.
					</p>
				)}
			</div>

			{/* Feedback Section */}
			<div data-profile-section {...stylex.props(styles.feedbackSection, flex.column)}>
				<p
					data-primary-black
					{...stylex.props(
						typo['Body/lines/Body1_16∙150_SemiBold_lines'],
						styles.primaryBlack,
					)}>
					{'퀘스천퍼데이, 이용해보니 어땠나요?'}
					{'\n'}
					{'아래 버튼을 눌러 피드백을 보내주세요!'}
				</p>

				<div {...stylex.props(styles.feedbackBtns, flex.vertical)}>
					<button {...stylex.props(styles.feedbackBtn, styles.feedbackBtnOutline)}>
						<span {...stylex.props(styles.feedbackBtnText)}>
							{'아쉬워요'}
						</span>
					</button>
					<button {...stylex.props(styles.feedbackBtn, styles.feedbackBtnFilled)}>
						<span {...stylex.props(styles.feedbackBtnTextWhite)}>
							{'좋았어요'}
						</span>
					</button>
				</div>
			</div>

			{/* Footer */}
			<div data-footer-card {...stylex.props(styles.footer, flex.column)}>
				<svg
					width='80'
					height='24'
					viewBox='0 0 1182 361'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'>
					<g clipPath='url(#profile_clip)'>
						<path
							d='M242.226 53.9421H385.741V360.996H242.226V182.158C242.226 161.409 217.753 151.451 192.871 151.451C160.523 151.451 145.169 166.797 145.169 182.158C145.169 199.584 160.508 213.685 192.871 213.685C216.099 213.685 236.006 205.807 241.817 187.122L208.635 311.194C190.382 315.338 172.555 317.418 155.547 317.418C70.5058 317.433 0 268.056 0 182.993C0 97.9306 75.4823 47.7188 148.492 47.7188C182.508 47.7188 215.675 58.511 241.392 80.0802C241.801 80.49 242.226 80.0802 242.226 79.6704V53.9421Z'
							fill='#2C5AFF'
						/>
						<path
							d='M634.552 317.433C604.268 317.433 569.432 309.555 546.613 294.194C546.203 293.784 545.779 294.194 545.779 294.604V360.996H402.264V53.9421H545.779V182.993C545.779 203.743 570.252 213.7 595.134 213.7C627.482 213.7 642.836 198.354 642.836 182.993C642.836 165.568 627.497 151.451 595.134 151.451C571.905 151.451 551.999 159.329 546.188 178.014L579.37 53.9421C597.622 49.7831 615.45 47.7188 632.458 47.7188C717.484 47.7188 787.99 97.0957 787.99 182.158C787.99 267.221 712.917 317.433 634.522 317.433H634.552Z'
							fill='#2C5AFF'
						/>
						<path
							d='M1038.5 178.018C1038.5 157.269 1014.03 147.311 989.144 147.311C956.797 147.311 941.443 162.657 941.443 178.018C941.443 195.444 956.782 209.56 989.144 209.56C1012.37 209.56 1032.28 201.682 1038.09 182.997L1004.91 311.213C987.081 315.782 972.971 317.437 951.821 317.437C866.795 317.437 796.289 268.06 796.289 182.997C796.289 91.3011 875.094 47.7225 952.245 47.7225C984.183 47.7225 1020.26 53.9458 1037.7 72.2061C1038.11 72.6159 1038.53 72.2061 1038.53 71.7962V0H1182.05V311.213H1038.53V178.018H1038.5Z'
							fill='#2C5AFF'
						/>
					</g>
					<defs>
						<clipPath id='profile_clip'>
							<rect width='1182' height='361' fill='white' />
						</clipPath>
					</defs>
				</svg>
				<p
					data-gray-text
					{...stylex.props(
						typo['Caption/lines/Caption1_13∙150_Regular_lines'],
						styles.gray80,
					)}>
					매일 질문을 던지는 뉴스레터, 퀘스천퍼데이
				</p>

				<div {...stylex.props(styles.socialIcons, flex.vertical)}>
					<button {...stylex.props(styles.socialBtn)}>
						<Icon.Mail size='20' color='#6a6a6a' />
					</button>
					<button {...stylex.props(styles.socialBtn)}>
						<svg
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<rect
								x='2'
								y='2'
								width='20'
								height='20'
								rx='5'
								stroke='#6a6a6a'
								strokeWidth='1.5'
							/>
							<circle
								cx='12'
								cy='12'
								r='5'
								stroke='#6a6a6a'
								strokeWidth='1.5'
							/>
							<circle cx='18' cy='6' r='1' fill='#6a6a6a' />
						</svg>
					</button>
				</div>
			</div>

			{/* Withdrawal */}
			<div {...stylex.props(styles.withdrawWrap, flex.end)}>
				<button
					{...stylex.props(styles.withdrawBtn)}
					onClick={() => withdrawModal.open()}>
					<span
						data-gray-text
						{...stylex.props(
							typo['Caption/Caption1_13∙100_Regular'],
							styles.gray70,
						)}>
						탈퇴하기
					</span>
				</button>
			</div>

			{/* Hidden download card */}
			<div
				{...stylex.props(styles.hiddenDownloadCard)}
				ref={downloadCardRef}>
				<AnswerDownloadCard question={dlQuestion} answer={dlAnswerText} />
			</div>

			{/* Profile Edit Bottom Sheet */}
			<profileModal.Render type='bottomSheet' animationType='bottomSheet'>
				<div {...stylex.props(sheetStyles.sheet, flex.column)}>
					<div {...stylex.props(sheetStyles.handle)} />
					<p
						{...stylex.props(
							typo['Body/Body1_16∙100_SemiBold'],
							sheetStyles.sheetTitle,
						)}>
						프로필 수정
					</p>

					{/* Avatar with camera */}
					<div {...stylex.props(sheetStyles.avatarWrap, flex.center)}>
						<div {...stylex.props(sheetStyles.avatarLarge)}>
							<Icon.User size='40' color='#9a9a9a' />
						</div>
						<div {...stylex.props(sheetStyles.cameraBadge, flex.center)}>
							<svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
								<path d='M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z' stroke='#fff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
								<circle cx='12' cy='13' r='4' stroke='#fff' strokeWidth='2' />
							</svg>
						</div>
					</div>

					{/* Nickname input */}
					<div {...stylex.props(sheetStyles.nicknameWrap, flex.center)}>
						{isEditingNickname ? (
							<input
								ref={nicknameInputRef}
								type='text'
								value={editNickname}
								onChange={e => setEditNickname(e.target.value)}
								onBlur={() => setIsEditingNickname(false)}
								maxLength={20}
								{...stylex.props(
									sheetStyles.nicknameInput,
									typo['Body/Body1_16∙100_SemiBold'],
								)}
							/>
						) : (
							<button
								{...stylex.props(sheetStyles.nicknameDisplay, flex.center)}
								onClick={() => {
									setIsEditingNickname(true);
									setTimeout(() => nicknameInputRef.current?.focus(), 50);
								}}>
								<span
									{...stylex.props(
										typo['Body/Body1_16∙100_SemiBold'],
										sheetStyles.nicknameText,
									)}>
									{editNickname}님
								</span>
								<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
									<path d='M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13' stroke='#9a9a9a' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
									<path d='M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z' stroke='#9a9a9a' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
								</svg>
							</button>
						)}
					</div>

					{/* Save button */}
					<button
						{...stylex.props(sheetStyles.saveBtn)}
						onClick={handleProfileSave}>
						<span
							{...stylex.props(
								typo['Body/Body1_16∙100_SemiBold'],
								sheetStyles.saveBtnText,
							)}>
							수정 완료
						</span>
					</button>
				</div>
			</profileModal.Render>

			{/* Invite Bottom Sheet */}
			<inviteModal.Render type='bottomSheet' animationType='bottomSheet'>
				<div {...stylex.props(sheetStyles.sheet, flex.column)}>
					<div {...stylex.props(sheetStyles.handle)} />
					<p
						{...stylex.props(
							typo['Body/Body1_16∙100_SemiBold'],
							sheetStyles.sheetTitle,
						)}>
						친구 초대하기
					</p>

					<div {...stylex.props(sheetStyles.inviteList, flex.column)}>
						<button {...stylex.props(sheetStyles.inviteRow, flex.vertical)}>
							<div {...stylex.props(sheetStyles.inviteIcon)}>
								<svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
									<rect width='24' height='24' rx='12' fill='#FEE500' />
									<path d='M12 6.5C8.96243 6.5 6.5 8.38604 6.5 10.7143C6.5 12.2188 7.52832 13.5357 9.07692 14.2857L8.46154 16.7857C8.43269 16.9006 8.56346 16.997 8.66346 16.929L11.4615 15.0714C11.6369 15.0857 11.8154 15.0929 12 15.0929C15.0376 15.0929 17.5 13.1283 17.5 10.7143C17.5 8.38604 15.0376 6.5 12 6.5Z' fill='#3C1E1E' />
								</svg>
							</div>
							<span
								{...stylex.props(
									typo['Body/Body3_14∙100_Regular'],
									sheetStyles.inviteText,
								)}>
								카카오톡으로 초대하기
							</span>
						</button>

						<button {...stylex.props(sheetStyles.inviteRow, flex.vertical)}>
							<div {...stylex.props(sheetStyles.inviteIcon)}>
								<svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
									<defs>
										<linearGradient id='igGrad' x1='0' y1='24' x2='24' y2='0'>
											<stop offset='0%' stopColor='#feda75' />
											<stop offset='25%' stopColor='#fa7e1e' />
											<stop offset='50%' stopColor='#d62976' />
											<stop offset='75%' stopColor='#962fbf' />
											<stop offset='100%' stopColor='#4f5bd5' />
										</linearGradient>
									</defs>
									<rect x='1' y='1' width='22' height='22' rx='6' stroke='url(#igGrad)' strokeWidth='1.5' fill='white' />
									<circle cx='12' cy='12' r='4.5' stroke='url(#igGrad)' strokeWidth='1.5' fill='none' />
									<circle cx='17.5' cy='6.5' r='1' fill='url(#igGrad)' />
								</svg>
							</div>
							<span
								{...stylex.props(
									typo['Body/Body3_14∙100_Regular'],
									sheetStyles.inviteText,
								)}>
								인스타그램으로 초대하기
							</span>
						</button>

						<button {...stylex.props(sheetStyles.inviteRow, flex.vertical)}>
							<div {...stylex.props(sheetStyles.inviteIcon)}>
								<svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
									<rect width='24' height='24' rx='4' fill='#333' />
									<path d='M8 11H16V13H8V11ZM7 8H17V10H7V8ZM9 14H15V16H9V14Z' fill='white' />
								</svg>
							</div>
							<span
								{...stylex.props(
									typo['Body/Body3_14∙100_Regular'],
									sheetStyles.inviteText,
								)}>
								링크 복사하기
							</span>
						</button>
					</div>
				</div>
			</inviteModal.Render>

			{/* Withdraw Alert */}
			<withdrawModal.Render type='modal' animationType='scale'>
				<div {...stylex.props(alertStyles.alertBox, flex.column)}>
					<div {...stylex.props(alertStyles.alertContent, flex.column)}>
						<p
							{...stylex.props(
								typo['Body/lines/Body2_15∙150_Bold_lines'],
								alertStyles.alertTitle,
							)}>
							정말로 탈퇴하시나요?
						</p>
						<p
							{...stylex.props(
								typo['Body/lines/Body3_14∙150_Regular_lines'],
								alertStyles.alertDesc,
							)}>
							{'지금껏 기록한 내용이 모두 사라져요.'}
							{'\n'}
							{'언제든 재가입은 가능합니다.'}
						</p>
					</div>

					<div {...stylex.props(alertStyles.alertBtns, flex.vertical)}>
						<button
							{...stylex.props(alertStyles.alertBtn, alertStyles.cancelBtn)}
							onClick={() => withdrawModal.close()}>
							<span
								{...stylex.props(
									typo['Body/Body3_14∙100_SemiBold'],
									alertStyles.cancelText,
								)}>
								취소
							</span>
						</button>
						<button
							{...stylex.props(alertStyles.alertBtn, alertStyles.withdrawBtnFill)}
							onClick={handleWithdraw}>
							<span
								{...stylex.props(
									typo['Body/Body3_14∙100_SemiBold'],
									alertStyles.withdrawText,
								)}>
								탈퇴
							</span>
						</button>
					</div>
				</div>
			</withdrawModal.Render>
		</section>
	);
}

// ── Main page styles ──
const styles = stylex.create({
	base: {
		padding: '24px 18px',
		paddingBottom: 60,
		gap: 0,
	},
	profileCard: {
		width: '100%',
		padding: 16,
		borderRadius: 14,
		backgroundColor: colors.gray20,
		gap: 16,
		marginBottom: 24,
	},
	avatar: {
		width: 56,
		height: 56,
		borderRadius: '50%',
		backgroundColor: colors.gray40,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
	},
	profileInfo: {
		flexGrow: 1,
		gap: 6,
	},
	primaryBlack: {
		color: colors.gray90,
	},
	gray80: {
		color: colors.gray80,
	},
	gray70: {
		color: colors.gray70,
	},
	mainColor: {
		color: colors.main,
	},
	emailRow: {
		gap: 4,
	},
	editBtn: {
		cursor: 'pointer',
	},
	section: {
		width: '100%',
		paddingBottom: 20,
		borderBottom: `1px solid ${colors.gray40}`,
		marginBottom: 20,
	},
	inviteDesc: {
		marginTop: 4,
	},
	inviteBtn: {
		padding: '8px 16px',
		borderRadius: 8,
		border: `1px solid ${colors.gray50}`,
		cursor: 'pointer',
	},
	bookmarkSection: {
		width: '100%',
		paddingBottom: 20,
		borderBottom: `1px solid ${colors.gray40}`,
		marginBottom: 20,
		gap: 16,
	},
	bookmarkCardWrap: {
		width: '100%',
		overflow: 'hidden',
	},
	feedbackSection: {
		width: '100%',
		paddingBottom: 20,
		borderBottom: `1px solid ${colors.gray40}`,
		marginBottom: 20,
		gap: 16,
	},
	feedbackBtns: {
		gap: 12,
		width: '100%',
	},
	feedbackBtn: {
		flex: 1,
		padding: '12px 0',
		borderRadius: 10,
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
	},
	feedbackBtnOutline: {
		border: `1px solid ${colors.gray50}`,
		backgroundColor: 'transparent',
	},
	feedbackBtnFilled: {
		border: 'none',
		backgroundColor: colors.main,
	},
	feedbackBtnText: {
		color: colors.gray90,
		fontSize: 14,
		fontWeight: 600,
	},
	feedbackBtnTextWhite: {
		color: colors.white,
		fontSize: 14,
		fontWeight: 600,
	},
	footer: {
		width: '100%',
		padding: 24,
		borderRadius: 14,
		backgroundColor: colors.gray20,
		gap: 8,
		alignItems: 'flex-start',
		marginBottom: 16,
	},
	socialIcons: {
		gap: 8,
		marginTop: 8,
	},
	socialBtn: {
		width: 36,
		height: 36,
		borderRadius: '50%',
		border: `1px solid ${colors.gray50}`,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
	},
	withdrawWrap: {
		width: '100%',
		display: 'flex',
	},
	withdrawBtn: {
		cursor: 'pointer',
	},
	hiddenDownloadCard: {
		position: 'fixed',
		top: -9999,
		left: -9999,
		zIndex: -1,
		pointerEvents: 'none',
	},
});

// ── Bottom Sheet styles ──
const sheetStyles = stylex.create({
	sheet: {
		width: '100%',
		maxWidth: 600,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: '#fff',
		padding: '12px 18px 32px',
		gap: 0,
		alignItems: 'center',
	},
	handle: {
		width: 40,
		height: 4,
		borderRadius: 2,
		backgroundColor: colors.gray50,
		marginBottom: 20,
	},
	sheetTitle: {
		width: '100%',
		color: colors.gray90,
		marginBottom: 24,
	},
	// Profile edit
	avatarWrap: {
		position: 'relative',
		marginBottom: 24,
	},
	avatarLarge: {
		width: 80,
		height: 80,
		borderRadius: '50%',
		backgroundColor: colors.gray40,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cameraBadge: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 28,
		height: 28,
		borderRadius: '50%',
		backgroundColor: colors.gray80,
		border: '2px solid #fff',
	},
	nicknameWrap: {
		width: '100%',
		marginBottom: 24,
	},
	nicknameDisplay: {
		cursor: 'pointer',
		gap: 6,
		padding: '10px 16px',
		borderRadius: 10,
		border: `1px solid ${colors.gray40}`,
		width: '100%',
	},
	nicknameInput: {
		width: '100%',
		padding: '10px 16px',
		borderRadius: 10,
		border: `1px solid ${colors.main}`,
		outline: 'none',
		textAlign: 'center',
		color: colors.gray90,
	},
	nicknameText: {
		color: colors.gray90,
	},
	saveBtn: {
		width: '100%',
		padding: '16px 0',
		borderRadius: 14,
		backgroundColor: colors.main,
		border: 'none',
		cursor: 'pointer',
	},
	saveBtnText: {
		color: colors.white,
	},
	// Invite
	inviteList: {
		width: '100%',
		gap: 0,
	},
	inviteRow: {
		width: '100%',
		padding: '16px 0',
		gap: 14,
		cursor: 'pointer',
		border: 'none',
		backgroundColor: 'transparent',
	},
	inviteIcon: {
		width: 28,
		height: 28,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inviteText: {
		color: colors.gray90,
	},
});

// ── Alert styles ──
const alertStyles = stylex.create({
	alertBox: {
		width: 300,
		borderRadius: 16,
		backgroundColor: '#fff',
		overflow: 'hidden',
	},
	alertContent: {
		padding: '28px 24px 20px',
		alignItems: 'center',
		gap: 8,
	},
	alertTitle: {
		color: colors.gray90,
		textAlign: 'center',
	},
	alertDesc: {
		color: colors.gray80,
		textAlign: 'center',
	},
	alertBtns: {
		width: '100%',
		borderTop: `1px solid ${colors.gray40}`,
		gap: 0,
	},
	alertBtn: {
		flex: 1,
		padding: '14px 0',
		cursor: 'pointer',
		border: 'none',
		backgroundColor: 'transparent',
	},
	cancelBtn: {
		borderRight: `1px solid ${colors.gray40}`,
	},
	withdrawBtnFill: {
		backgroundColor: 'transparent',
	},
	cancelText: {
		color: colors.gray80,
	},
	withdrawText: {
		color: colors.redPrimary,
	},
});
