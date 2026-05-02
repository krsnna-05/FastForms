import { create } from "zustand";

type User = {
  id: string | null;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
};

interface AuthState {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
  isAuthenticated: boolean;
  setAuthenticated: (isAuth: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: null,
    name: null,
    email: null,
    avatarUrl: null,
  },
  setUser: (user: User) => set({ user }),
  clearUser: () =>
    set({
      user: {
        id: null,
        name: null,
        email: null,
        avatarUrl: null,
      },
    }),
  isAuthenticated: false,
  setAuthenticated: (isAuth: boolean) => set({ isAuthenticated: isAuth }),
}));

export default useAuthStore;
