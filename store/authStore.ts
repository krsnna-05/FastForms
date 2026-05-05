import { create } from "zustand";

type User = {
  id: string | null;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
};

interface AuthState {
  user: User;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: null,
    name: null,
    email: null,
    avatarUrl: null,
  },
  isAuthenticated: false,
  login: (user) =>
    set(() => ({
      user,
      isAuthenticated: true,
    })),
  logout: () =>
    set(() => ({
      user: {
        id: null,
        name: null,
        email: null,
        avatarUrl: null,
      },
      isAuthenticated: false,
    })),
}));

export default useAuthStore;
