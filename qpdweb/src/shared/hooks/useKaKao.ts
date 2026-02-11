import { supabase } from '~/lib/supabase';

export const useKaKao = () => {
  const kakaoLogin = async () => {
    try {
      // 1. 현재 브라우저의 주소(예: http://localhost:7021)를 가져옵니다.
      // (마지막에 슬래시 / 가 있으면 제거하여 깔끔하게 만듭니다)
      const currentOrigin = window.location.origin.replace(/\/$/, '');

      console.log(`🚀 카카오 로그인 시작! (돌아올 주소: ${currentOrigin})`);

      // 2. Supabase에 로그인 요청
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          // 로그인 후 다시 이 사이트로 돌아오게 설정
          redirectTo: currentOrigin,
          // 카카오 로그인 창을 강제로 띄움 (자동 로그인 방지용, 필요 없으면 삭제 가능)
          queryParams: {
            prompt: 'login',
          },
        },
      });

      // 3. 요청 단계에서 에러가 났을 경우 (보통 네트워크나 설정 문제)
      if (error) {
        console.error('❌ Supabase 로그인 요청 실패:', error.message);
        alert(`로그인 요청 중 오류가 발생했습니다.\n${error.message}`);
      }
    } catch (err) {
      // 4. 알 수 없는 예외 처리
      console.error('🚨 예기치 못한 에러:', err);
      alert('로그인 시스템에 문제가 발생했습니다. 관리자에게 문의하세요.');
    }
  };

  return { kakaoLogin };
};