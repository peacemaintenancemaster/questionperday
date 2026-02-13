import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { supabase } from '../../../../lib/supabase';
import { useUserActions } from '../../../../domain/user/store';
import { useNavigationRestore } from '../../../../shared/hooks/useNavigationRestore';

export const Route = createFileRoute('/user/kakao/bridge/login')({
  component: RouteComponent,
  validateSearch: z.object({
    code: z.string().optional(),
    error: z.string().optional(),
    state: z.string().optional(),
    error_msg: z.string().optional(),
    success: z.boolean().optional(),
    tempToken: z.string().optional(),
  }),
});

function RouteComponent() {
  const { code, error } = Route.useSearch();
  const navigate = useNavigate();
  const { setUser } = useUserActions();
  const { restoreNavigation } = useNavigationRestore();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (error) {
      alert('카카오 로그인 에러');
      navigate({ to: '/' });
      return;
    }

    if (!code || isProcessing) return;

    const processLogin = async () => {
      setIsProcessing(true);
      try {
        // [STEP 1] 카카오 토큰 발급
        const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
            redirect_uri: window.location.origin + '/user/kakao/bridge/login',
            code,
          }),
        });
        const tokenData = await tokenRes.json();
        
        if (!tokenData.access_token) throw new Error('토큰 발급 실패');

        // [STEP 2] 카카오 유저 정보 요청
        const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const kakaoInfo = await userRes.json();

        if (!kakaoInfo.id) throw new Error('유저 정보 없음');

        // [STEP 3] Supabase DB 조회
        const { data: dbUser, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('kakaoId', kakaoInfo.id)
          .maybeSingle();

        if (dbError) throw dbError;

        let finalUser = dbUser;

        // [STEP 4] 없으면 회원가입
        if (!dbUser) {
          const { data: newUser, error: joinError } = await supabase
            .from('users')
            .insert({
              kakaoId: kakaoInfo.id,
              nickname: kakaoInfo.properties?.nickname || '',
              email: kakaoInfo.kakao_account?.email || '',
              isDel: 0, 
            })
            .select()
            .single();

          if (joinError) throw joinError;
          finalUser = newUser;
        }

        // [STEP 5] 탈퇴 체크
        if (finalUser && finalUser.isDel === 1) {
          alert('탈퇴한 회원입니다.');
          navigate({ to: '/' });
          return;
        }

        // [STEP 6] 상태 저장 (수정됨: 불필요한 필드 제거)
        if (finalUser) {
          setUser({
            id: finalUser.id, // [추가] 이제 id는 필수입니다
            name: finalUser.nickname || '',
            email: finalUser.email || '',
            // [삭제] phone, gender, birthday 등 에러 나던 필드 싹 제거함
          });
        }

        // [STEP 7] 이동
        const restored = restoreNavigation();
        if (!restored) {
          navigate({ to: '/', replace: true });
        }

      } catch (err) {
        console.error('Login Error:', err);
        alert('로그인 중 오류가 발생했습니다.');
        navigate({ to: '/' });
      } finally {
        setIsProcessing(false);
      }
    };

    processLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, error]); 

  return <div>로그인 처리 중...</div>;
}