import { supabase } from '../supabase';
import type { LoginSchema } from '~/features/auth/schema/login/login';
import type { UserSchema } from '~/features/auth/schema/user/user';

export const login = async ({
    username, // 여기에 'admin' 입력
    password, // 여기에 '1234' 입력
}: LoginSchema): Promise<{ admin: UserSchema }> => {
    
    // 이메일 형식이 아니면 Supabase 로그인이 안 되므로, 
    // 내부적으로 'admin@questionperday.me'와 같은 고정 이메일로 변환하여 처리합니다.
    const adminEmail = username === 'admin' ? 'admin@questionperday.me' : username;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: password,
    });

    if (error) {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    // 로그인 성공 시 반환할 관리자 정보
    return {
        admin: {
            id: data.user.id,
            username: '관리자',
        }
    };
};

export const session = async (): Promise<{ admin: UserSchema }> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('세션이 만료되었습니다.');

    return {
        admin: {
            id: session.user.id,
            username: '관리자',
        }
    };
};