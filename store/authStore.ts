import { create } from "zustand";
import { persist } from "zustand/middleware";

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

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
