import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useState, useEffect } from 'react';
import { supabase } from '~/lib/supabase';
import { useUserStore } from '~/domain/user/store';
import useModal from '~/shared/hooks/useModal';
import { Button } from '~/shared/components/ui/button/button';

// 1. 아이콘 컴포넌트 (내부 정의로 경로 에러 방지)
const PencilIcon = ({ size = 20, color = colors.gray60 }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.9445 9.1875L14.8125 5.0555L15.8425 4.0255C16.4152 3.45281 17.3448 3.45281 17.9175 4.0255L19.9745 6.0825C20.5472 6.6552 20.5472 7.5848 19.9745 8.1575L18.9445 9.1875ZM17.9145 10.2175L10.0005 18.1315L5.8685 13.9995L13.7825 6.0855L17.9145 10.2175ZM4.9125 19.0875C4.84524 19.1548 4.79632 19.238 4.7705 19.3285L4.0185 21.9605C4.0049 22.0081 4.00416 22.0581 4.01633 22.1061C4.0285 22.1541 4.05315 22.1984 4.08811 22.2351C4.12307 22.2718 4.1671 22.2996 4.21629 22.3161C4.26549 22.3325 4.31811 22.3371 4.3695 22.3295L7.0015 21.5775C7.092 21.5517 7.1752 21.5028 7.2425 21.4355L4.9125 19.0875Z" fill={color}/>
  </svg>
);

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  // 타입 안전성을 위해 any 사용 (프로젝트 스토어 구조에 맞춤)
  const userStore = useUserStore() as any;
  const user = userStore.user;
  const setUser = userStore.setUser || userStore.actions?.setUser;

  const EditNicknameModal = useModal('edit-nickname');
  
  const [newNickname, setNewNickname] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // 유저 정보 변경 시 닉네임 상태 동기화
  useEffect(() => {
    if (user?.user_metadata) {
      setNewNickname(user.user_metadata.full_name || user.user_metadata.nickname || '');
    }
  }, [user]);

  const handleUpdateNickname = async () => {
    if (!user?.id || !newNickname.trim()) return;
    
    setIsUpdating(true);
    try {
      // 1. Supabase Auth 업데이트 (세션용)
      const { error: authError } = await supabase.auth.updateUser({
        data: { nickname: newNickname, full_name: newNickname }
      });
      if (authError) throw authError;

      // 2. Public Users 테이블 업데이트 (데이터베이스용)
      const { error: dbError } = await supabase
        .from('users')
        .update({ nickname: newNickname })
        .eq('id', user.id);
      
      if (dbError) throw dbError;

      // 3. 전역 상태 갱신
      if (setUser) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            nickname: newNickname,
            full_name: newNickname
          }
        });
      }
      
      EditNicknameModal.close();
      alert('성공적으로 변경되었습니다.');
    } catch (error) {
      console.error(error);
      alert('변경 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main {...stylex.props(styles.base, flex.column)}>
      {/* 프로필 상단 */}
      <section {...stylex.props(styles.profileSection, flex.column)}>
        <div {...stylex.props(styles.avatar)}>
          <img 
            src={user?.user_metadata?.avatar_url || ''} 
            alt="profile" 
            {...stylex.props(styles.avatarImg)} 
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80'; }}
          />
        </div>

        <div {...stylex.props(styles.nameWrapper)}>
          <h2 {...stylex.props(typo['Heading/H3_20∙130_SemiBold'], styles.nameText)}>
            {user?.user_metadata?.full_name || user?.user_metadata?.nickname || '회원님'}
          </h2>
          <button 
            onClick={() => EditNicknameModal.open()}
            {...stylex.props(styles.editBtn)}
          >
            <PencilIcon />
          </button>
        </div>

        <p {...stylex.props(typo['Body/Body3_14∙150_Regular'], styles.emailText)}>
          {user?.email || '이메일 정보 없음'}
        </p>
      </section>

      <hr {...stylex.props(styles.divider)} />

      {/* 메뉴 리스트 */}
      <nav {...stylex.props(flex.column, styles.menuList)}>
        <button 
          onClick={() => navigate({ to: '/' })} 
          {...stylex.props(typo['Body/Body2_15∙150_Regular'], styles.menuItem)}
        >
          작성한 답변 보기
        </button>
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: '/' });
          }} 
          {...stylex.props(typo['Body/Body2_15∙150_Regular'], styles.menuItem, styles.logout)}
        >
          로그아웃
        </button>
      </nav>

      {/* 닉네임 수정 모달 */}
      <EditNicknameModal.Render type="bottomSheet" animationType="bottomSheet">
        <div {...stylex.props(styles.modalContent, flex.column)}>
          <h3 {...stylex.props(typo['Heading/H4_18∙130_SemiBold'])}>닉네임 수정</h3>
          <p {...stylex.props(typo['Body/Body3_14∙150_Regular'], styles.modalSub)}>
            새로운 닉네임을 입력해주세요.
          </p>
          <input 
            type="text" 
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            {...stylex.props(styles.input)}
            placeholder="닉네임 입력"
          />
          <div {...stylex.props(flex.row, styles.modalButtons)}>
            <Button 
              variants="secondary" 
              onClick={() => EditNicknameModal.close()}
              style={styles.flex1}
            >
              취소
            </Button>
            <Button 
              variants="primary" 
              onClick={handleUpdateNickname}
              disabled={isUpdating || !newNickname.trim()}
              style={styles.flex2}
            >
              {isUpdating ? '저장 중...' : '저장하기'}
            </Button>
          </div>
        </div>
      </EditNicknameModal.Render>
    </main>
  );
}

const styles = stylex.create({
  base: { 
    padding: '40px 20px', 
    backgroundColor: '#fff', 
    minHeight: '100vh' 
  },
  profileSection: { 
    gap: 12, 
    marginBottom: 32,
    alignItems: 'center'
  },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: '50%', 
    backgroundColor: colors.gray20, 
    overflow: 'hidden' 
  },
  avatarImg: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover' 
  },
  nameWrapper: { 
    gap: 4, 
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameText: {
    color: colors.gray90
  },
  editBtn: { 
    border: 'none', 
    backgroundColor: 'transparent', 
    cursor: 'pointer', 
    padding: 4, 
    display: 'flex', 
    alignItems: 'center' 
  },
  emailText: { 
    color: colors.gray60 
  },
  divider: { 
    border: 'none', 
    height: 1, 
    backgroundColor: colors.gray20, 
    margin: '0 -20px 24px -20px' 
  },
  menuList: { 
    gap: 8 
  },
  menuItem: { 
    padding: '16px 0', 
    border: 'none', 
    backgroundColor: 'transparent', 
    textAlign: 'left', 
    cursor: 'pointer', 
    color: colors.gray90
  },
  logout: { 
    color: colors.main 
  },
  modalContent: { 
    padding: '24px 20px', 
    gap: 16 
  },
  modalSub: { 
    color: colors.gray60 
  },
  input: { 
    width: '100%', 
    padding: '12px 16px', 
    borderRadius: 8, 
    border: `1px solid ${colors.gray30}`, 
    outline: 'none',
    fontSize: 16
  },
  modalButtons: { 
    gap: 12, 
    marginTop: 8 
  },
  flex1: { 
    flex: 1 
  },
  flex2: { 
    flex: 2 
  }
});