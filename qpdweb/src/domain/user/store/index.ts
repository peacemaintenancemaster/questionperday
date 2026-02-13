import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface User {
  id: number;
  email: string;
  name: string;
}

type Store = {
  user: User | null;
  isLogin: boolean;
  actions: {
    setUser: (user: User) => void;
    logout: () => void;
  };
};

export const useUserStore = create<Store>()(
  immer((set) => ({
    user: null,
    isLogin: false,
    actions: {
      setUser: (user) => {
        set((state) => {
          state.user = user;
          state.isLogin = true;
        });
      },
      logout: () => {
        set((state) => {
          state.user = null;
          state.isLogin = false;
        });
      },
    },
  }))
);

export const useUserActions = () => useUserStore((s) => s.actions);
export const useUser = () => useUserStore((s) => s.user);