import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { z } from 'zod';
import { supabase } from '~/lib/supabase'; // 아까 만든 설정 파일
import { useUserActions } from '~/domain/user/store';
import { useNavigationRestore } from '~/shared/hooks/useNavigationRestore';

export const Route = createFileRoute('/user/kakao/bridge/login')({
  component: RouteComponent,
  validateSearch: z.object({
    code: z.string().optional(),
    error: z.string().optional(),
  }),
});

function RouteComponent() {
  const { code, error } = Route.useSearch();
  const navigate = useNavigate();
  const { setUser } = useUserActions();
  const { restoreNavigation } = useNavigationRestore();

  useEffect(() => {
    if (error) {
      alert('카카오 로그인 실패');
      navigate({ to: '/' });
      return;
    }
    
    if (!code) return;

    const login = async () => {
      try {
        // 1. 카카오 토큰 받기
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

        // 2. 카카오 유저 정보 받기
        const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const kakaoInfo = await userRes.json();
        
        // 3. Supabase DB 조회 (users 테이블)
        const { data: dbUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('kakaoId', kakaoInfo.id)
          .maybeSingle();

        if (error) throw error;

        let finalUser = dbUser;

        // 4. 없으면 회원가입 (0/1 데이터로 저장)
        if (!dbUser) {
          const { data: newUser, error: joinError } = await supabase
            .from('users')
            .insert({
              kakaoId: kakaoInfo.id,
              nickname: kakaoInfo.properties?.nickname,
              email: kakaoInfo.kakao_account?.email,
              isDel: 0, // 숫자 0 저장
            })
            .select()
            .single();
            
          if (joinError) throw joinError;
          finalUser = newUser;
        }

        // 5. 탈퇴 체크 (1이면 탈퇴)
        if (finalUser.isDel === 1) {
          alert('탈퇴한 회원입니다.');
          navigate({ to: '/' });
          return;
        }

        // 6. 상태 저장 (Store에는 맞게 변환해서 넣기)
        setUser({
          name: finalUser.nickname,
          email: finalUser.email,
        });

        // 7. 페이지 이동
        const restored = restoreNavigation();
        if (!restored) navigate({ to: '/', replace: true });

      } catch (err) {
        console.error(err);
        alert('로그인 처리 중 오류가 발생했습니다.');
        navigate({ to: '/' });
      }
    };

    login();
  }, [code, error, navigate, setUser, restoreNavigation]);

  return <div>로그인 중...</div>;
}