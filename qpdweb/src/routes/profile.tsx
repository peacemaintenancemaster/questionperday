import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useUser } from '~/domain/user/store'; // [수정] 스토어 연결
import { Icon } from '~/shared/images';
import { useModal } from '~/shared/hooks/useModal';
import { useEffect } from 'react';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const user = useUser(); // [수정] 진짜 유저 정보 가져오기
  
  // 로그인 안 했으면 홈으로
  useEffect(() => {
    if (!user) {
      navigate({ to: '/' });
    }
  }, [user, navigate]);

  const inviteModal = useModal('invite-friends');
  const withdrawModal = useModal('withdraw-confirm');

  if (!user) return null;

  return (
    <section {...stylex.props(styles.base, flex.column)}>
      {/* 프로필 카드 */}
      <div {...stylex.props(styles.profileCard, flex.vertical)}>
        <div {...stylex.props(styles.avatar)}>
          <Icon.User size='32' color='#9a9a9a' />
        </div>
        <div {...stylex.props(styles.profileInfo, flex.column)}>
          <div {...stylex.props(flex.between, flex.vertical)}>
            <p {...stylex.props(typo['Heading/H4_18∙100_SemiBold'], styles.primaryBlack)}>
              {user.name}님 {/* [수정] 진짜 닉네임 표시 */}
            </p>
          </div>
          <div {...stylex.props(flex.vertical, styles.emailRow)}>
            <p {...stylex.props(typo['Body/Body3_14∙100_Regular'], styles.gray80)}>
              {user.email} {/* [수정] 진짜 이메일 표시 */}
            </p>
          </div>
        </div>
      </div>

      {/* 친구 초대 */}
      <div {...stylex.props(styles.section, flex.between, flex.vertical)}>
        <div {...stylex.props(flex.column)}>
          <p {...stylex.props(typo['Body/Body1_16∙100_SemiBold'], styles.primaryBlack)}>
            친구 초대하기
          </p>
          <p {...stylex.props(typo['Caption/lines/Caption1_13∙150_Regular_lines'], styles.gray80, styles.inviteDesc)}>
            친구와 함께 기록해보세요!
          </p>
        </div>
        <button {...stylex.props(styles.inviteBtn)} onClick={() => inviteModal.open()}>
          <span {...stylex.props(typo['Body/Body3_14∙100_SemiBold'])}>초대하기</span>
        </button>
      </div>

      {/* 탈퇴 버튼 */}
      <div {...stylex.props(styles.withdrawWrap, flex.end)}>
        <button {...stylex.props(styles.withdrawBtn)} onClick={() => withdrawModal.open()}>
          <span {...stylex.props(typo['Caption/Caption1_13∙100_Regular'], styles.gray70)}>
            탈퇴하기
          </span>
        </button>
      </div>

      {/* -- 모달 컴포넌트들 (기존 유지) -- */}
      <inviteModal.Render type='bottomSheet' animationType='bottomSheet'>
         <div className="p-5 bg-white text-center">준비 중인 기능입니다.</div>
      </inviteModal.Render>

      <withdrawModal.Render type='modal' animationType='scale'>
        <div {...stylex.props(alertStyles.alertBox, flex.column)}>
          <div {...stylex.props(alertStyles.alertContent, flex.column)}>
            <p {...stylex.props(typo['Body/lines/Body2_15∙150_Bold_lines'], alertStyles.alertTitle)}>
              정말로 탈퇴하시나요?
            </p>
            <p {...stylex.props(typo['Body/lines/Body3_14∙150_Regular_lines'], alertStyles.alertDesc)}>
              지금껏 기록한 내용이 모두 사라져요.
            </p>
          </div>
          <div {...stylex.props(alertStyles.alertBtns, flex.vertical)}>
            <button {...stylex.props(alertStyles.alertBtn, alertStyles.cancelBtn)} onClick={() => withdrawModal.close()}>
              취소
            </button>
            <button {...stylex.props(alertStyles.alertBtn, alertStyles.withdrawText)} onClick={() => alert('관리자에게 문의해주세요.')}>
              탈퇴
            </button>
          </div>
        </div>
      </withdrawModal.Render>
    </section>
  );
}

const styles = stylex.create({
  base: { padding: '24px 18px', paddingBottom: 60 },
  profileCard: { width: '100%', padding: 16, borderRadius: 14, backgroundColor: colors.gray20, gap: 16, marginBottom: 24 },
  avatar: { width: 56, height: 56, borderRadius: '50%', backgroundColor: colors.gray40, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  profileInfo: { flexGrow: 1, gap: 6 },
  primaryBlack: { color: colors.gray90 },
  gray80: { color: colors.gray80 },
  gray70: { color: colors.gray70 },
  emailRow: { gap: 4 },
  section: { width: '100%', paddingBottom: 20, borderBottom: `1px solid ${colors.gray40}`, marginBottom: 20 },
  inviteDesc: { marginTop: 4 },
  inviteBtn: { padding: '8px 16px', borderRadius: 8, border: `1px solid ${colors.gray50}`, cursor: 'pointer', backgroundColor: 'white' },
  withdrawWrap: { width: '100%', display: 'flex' },
  withdrawBtn: { cursor: 'pointer', backgroundColor: 'transparent', border: 'none' },
});

const alertStyles = stylex.create({
  alertBox: { width: 300, borderRadius: 16, backgroundColor: '#fff', overflow: 'hidden' },
  alertContent: { padding: '28px 24px 20px', alignItems: 'center', gap: 8 },
  alertTitle: { color: colors.gray90 },
  alertDesc: { color: colors.gray80, textAlign: 'center' },
  alertBtns: { width: '100%', borderTop: `1px solid ${colors.gray40}`, display: 'flex' },
  alertBtn: { flex: 1, padding: '14px 0', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' },
  cancelBtn: { borderRight: `1px solid ${colors.gray40}`, color: colors.gray80 },
  withdrawText: { color: colors.redPrimary },
});