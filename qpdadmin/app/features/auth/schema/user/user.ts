import { z } from 'zod';

export type UserSchema = z.infer<typeof userSchema>;

export const userSchema = z.object({
    // Supabase Auth의 UID(UUID)를 수용할 수 있도록 number에서 string으로 변경합니다.
    id: z.string(), 
    username: z.string(),
});