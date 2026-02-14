import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as stylex from '@stylexjs/stylex';
import { colors, flex, typo } from '~/shared/style/common.stylex';
import { useState } from 'react';
import { supabase } from '~/lib/supabase';
import { useUserStore } from '~/domain/user/store';
import useModal from '~/shared/hooks/useModal';
import { Button } from '~/shared/components/ui/button/button';

// 1. 아이콘 에러 해결: 로컬 SVG 컴포넌트 정의
const PencilIcon = ({ size = 20, color = colors.gray60 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.9445 9.1875L14.8125 5.0555L15.8425 4.0255C16.4152 3.45281 17.3448 3.45281 17.9175 4.0255L19.9745 6.0825C20.5472 6.6552 20.5472 7.5848 19.9745 8.1575L18.9445 9.1875ZM17.9145 10.2175L10.0005 18.1315L5.8685 13.9995L13.7825 6.0855L17.9145 10.2175ZM4.9125 19.0875C4.84524 19.1548 4.79632 19.238 4.7705 19.3285L4.0185 21.9605C4.0049 22.0081 4.00416 22.0581 4.01633 22.1061C4.0285 22.1541 4.05315 22.1984 4.08811 22.2351C4.12307 22.2718 4.1671 22.2996 4.21629 22.3161C4.26549 22.3325 4.31811 22.3371 4.3695 22.3295L7.0015 21.5775C7.092 21.5517 7.1752 21.5028 7.2425 21.4355L4.9125 19.0875Z" fill={color}/>
    </svg>
);

export const Route = createFileRoute('/profile')({
    component: ProfilePage,
});

function ProfilePage() {
    const navigate = useNavigate();
    // 2. 스토어 및 유저 정보 에러 해결: any 타입 캐스팅으로 속성 접근 허용 (임시) 및 metadata 참조
    const userStore = useUserStore() as any; 
    const user = userStore.user;
    const setUser = userStore.setUser || userStore.actions?.setUser; // setUser 위치 확인

    const EditNicknameModal = useModal('edit-nickname');
    
    // 카카오 유저 정보는 보통 user_metadata에 들어있습니다.
    const initialNickname = user?.user_metadata?.full_name || user?.user_metadata?.nickname || '';
    const [newNickname, setNewNickname] = useState(initialNickname);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateNickname = async () => {
        if (!user?.id || !newNickname.trim()) return;
        
        setIsUpdating(true);
        try {
            // Supabase Auth 유저 정보 업데이트
            const { error } = await supabase.auth.updateUser({
                data: { nickname: newNickname, full_name: newNickname }
            });

            if (error) throw error;

            // 스토어 업데이트
            if (setUser) {
                setUser({ ...user, user_metadata: { ...user.user_metadata, nickname: newNickname, full_name: newNickname } });
            }
            
            EditNicknameModal.close();
            alert('닉네임이 수정되었습니다.');
        } catch (error) {
            console.error('닉네임 수정 실패:', error);
            alert('수정에 실패했습니다.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <main {...stylex.props(styles.base, flex.column)}>
            <section {...stylex.props(styles.profileSection, flex.column, flex.vertical)}>
                <div {...stylex.props(styles.avatar)}>
                    <img 
                        src={user?.user_metadata?.avatar_url || user?.user_metadata?.profile_image || ''} 
                        alt="프로필" 
                        {...stylex.props(styles.avatarImg)} 
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/80')}
                    />
                </div>

                <div {...stylex.props(flex.center, styles.nameWrapper)}>
                    <h2 {...stylex.props(typo['Heading/H3_20∙130_SemiBold'])}>
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

            <nav {...stylex.props(flex.column, styles.menuList)}>
                <button onClick={() => navigate({ to: '/' })} {...stylex.props(styles.menuItem)}>
                    작성한 답변 보기
                </button>
                <button 
                    onClick={async () => {
                        await supabase.auth.signOut();
                        navigate({ to: '/' });
                    }} 
                    {...stylex.props(styles.menuItem, styles.logout)}
                >
                    로그아웃
                </button>
            </nav>

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
                            style={styles.flex1} // 3. StyleX 에러 해결: 스타일 객체 대신 StyleX 스타일 사용
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
    base: { padding: '40px 20px', backgroundColor: '#fff', minHeight: '100vh' },
    profileSection: { gap: 12, marginBottom: 32 },
    avatar: { 
        width: 80, height: 80, borderRadius: '50%', 
        backgroundColor: colors.gray20, overflow: 'hidden' 
    },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    nameWrapper: { gap: 4, display: 'flex', alignItems: 'center' },
    editBtn: { border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' },
    emailText: { color: colors.gray60 },
    divider: { border: 'none', height: 1, backgroundColor: colors.gray20, margin: '0 -20px 24px -20px' },
    menuList: { gap: 8 },
    menuItem: { 
        padding: '16px 0', border: 'none', backgroundColor: 'transparent', 
        textAlign: 'left', cursor: 'pointer', ...typo['Body/Body2_15∙150_Regular'],
        color: colors.gray90
    },
    logout: { color: colors.main },
    modalContent: { padding: '24px 20px', gap: 16 },
    modalSub: { color: colors.gray60 },
    input: { 
        width: '100%', padding: '12px 16px', borderRadius: 8, 
        border: `1px solid ${colors.gray30}`, outline: 'none',
        fontSize: 16
    },
    modalButtons: { gap: 12, marginTop: 8 },
    // StyleX용 flex 스타일 정의
    flex1: { flex: 1 },
    flex2: { flex: 2 }
});