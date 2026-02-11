import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { Fragment, useEffect, useState } from 'react';
import { RootLayout } from '~/shared/components/layout/RootLayout';
import { enableMapSet } from 'immer';
import { QueryClient } from '@tanstack/react-query';
import { config } from '~/config';
import { GlobalAlert } from '~/shared/components/ui/modal/alert/global-alert';
import { supabase } from '~/lib/supabase';
import { useUserActions } from '~/domain/user/store';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

// Map/Set 에러 방지
enableMapSet();

function RootComponent() {
  const { setUser } = useUserActions();
  
  // [상태] 초기화 중인지 여부 (기본값 true = 로딩 중)
  const [isInitializing, setIsInitializing] = useState(true);

  // [Kakao] 안전한 초기화 (옵션)
  if (config.kakao && typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
    try {
       window.Kakao.init(config.kakao);
    } catch (e) {
       console.error("Kakao Init Error:", e);
    }
  }

  useEffect(() => {
    // 1. Supabase가 아예 없으면 로딩 즉시 종료
    if (!supabase) {
      console.error("❌ Supabase 클라이언트가 없습니다. src/lib/supabase.ts를 확인하세요.");
      setIsInitializing(false);
      return;
    }

    const checkAuth = async () => {
      try {
        console.log("🔄 세션 확인 시작...");
        
        // 2. 세션 가져오기 시도
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
           throw error; // 에러 발생 시 catch로 이동
        }

        if (session?.user) {
          console.log("✅ 세션 발견:", session.user.email);
          setUser({
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || 
                  session.user.user_metadata?.nickname || 
                  session.user.user_metadata?.name || '사용자',
            gender: session.user.user_metadata?.gender || '',
            phone: session.user.user_metadata?.phone || '',
            country: '',
            birthday: '',
            year: '',
            month: '',
            day: '',
          });
        } else {
           console.log("ℹ️ 로그인된 사용자 없음");
        }

      } catch (err) {
        console.error("🚨 인증 확인 중 에러 발생:", err);
        // 에러가 나도 앱은 켜져야 하므로 그냥 넘어갑니다.
      } finally {
        // [핵심] 성공하든 실패하든 무조건 로딩 종료! (무한 로딩 방지)
        console.log("✨ 초기화 종료. 화면을 그립니다.");
        setIsInitializing(false);
      }
    };

    checkAuth();

    // 3. 실시간 상태 변경 감지
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log("⚡ 실시간 로그인 감지");
        setUser({
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || '사용자',
          gender: '',
          phone: '',
          country: '',
          birthday: '',
          year: '',
          month: '',
          day: '',
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  // 로딩 중일 때 (흰 화면 유지하여 깜빡임 방지)
  if (isInitializing) {
    return null; 
  }

  return (
    <Fragment>
      <RootLayout>
        <GlobalAlert />
        <Outlet />
      </RootLayout>
      <ScrollRestoration />
    </Fragment>
  );
}
