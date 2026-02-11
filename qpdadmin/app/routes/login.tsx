import { css, useTheme } from '@emotion/react';
import type { Route } from './+types/login';
import { Input } from '~/components/ui/input/Input';
import type { Theme } from '~/style/theme';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    loginSchema,
    type LoginSchema,
} from '~/features/auth/schema/login/login';
import { Button } from '~/components/ui/button/Button';
import { use, useState } from 'react';
import { useNavigate } from 'react-router';
import { Icon } from '~/images';
import { API } from '~/api';
import { AuthContext } from '~/features/auth/context/auth';

export function meta({}: Route.MetaArgs) {
    return [{ title: '로그인' }];
}

export default function Login() {
    const theme = useTheme();
    const { dispatch } = use(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });
    const navigate = useNavigate();
    const [isMasking, setIsMasking] = useState(true);

    async function onSubmit(data: LoginSchema) {
        try {
            const auth = await API.Auth.login(data);

            // payload 전달 시 id를 숫자로 변환하여 타입 에러 해결
            dispatch({
                type: 'LOGIN',
                payload: {
                    ...auth.admin,
                    id: Number(auth.admin.id), 
                },
            });

            navigate('/');
        } catch (error) {
            console.error(error);
        }
    }

    function onClickMasking() {
        setIsMasking(s => !s);
    }

    return (
        <section css={wrap}>
            <form css={form} onSubmit={handleSubmit(onSubmit)}>
                <p css={text(theme)}>로그인</p>

                <div css={labelWrap}>
                    <label css={label(theme)} htmlFor='user-id'>
                        아이디
                    </label>

                    <Input
                        {...register('username')}
                        placeholder='아이디를 입력해주세요.'
                        id='user-id'
                    />
                </div>

                <div css={labelWrap}>
                    <label css={label(theme)} htmlFor='user-password'>
                        비밀번호
                    </label>

                    <div css={inputWrap}>
                        <Input
                            id='user-password'
                            {...register('password')}
                            placeholder='비밀번호를 입력해주세요.'
                            type={isMasking ? 'password' : 'text'}
                        />

                        <button
                            css={hideButton}
                            type='button'
                            aria-label='비밀번호 보기'
                            onClick={onClickMasking}>
                            <Icon.Hide size='20' />
                        </button>
                    </div>
                </div>

                <Button variant='default' disabled={!isValid} type='submit'>
                    로그인
                </Button>
            </form>
        </section>
    );
}

const wrap = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const text = (theme: Theme) => css`
    color: ${theme.color.main};
    ${theme.fontStyles['Body/Body3_14∙100_SemiBold']};
`;

const form = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 130px;
    gap: 16px;
    width: 339px;
`;

const labelWrap = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const label = (theme: Theme) => css`
    color: ${theme.color.grayScale.gray80};
    ${theme.fontStyles['Caption/Caption1_13∙100_SemiBold']};
`;

const inputWrap = css`
    position: relative;
    width: 100%;
    height: 50px;
`;

const hideButton = css`
    position: absolute;
    cursor: pointer;
    z-index: 1;
    top: 15px;
    width: 20px;
    height: 20px;
    right: 12px;
`;