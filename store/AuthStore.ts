import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  userData: UserDataType | null;
  token: string | null;
  setAuthState: (
    isAuthenticated: boolean,
    userId: string | null,
    userData: UserDataType | null,
    token?: string | null
  ) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  userData: null,
  token:
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null,

  setAuthState: (isAuthenticated, userId, userData, token) => {
    if (token) {
      localStorage.setItem("auth_token", token);
    }
    set({ isAuthenticated, userId, userData, token });
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    set({ isAuthenticated: false, userId: null, userData: null, token: null });
  },
}));

export default useAuthStore;
