import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  userData: UserDataType | null;
  setAuthState: (
    isAuthenticated: boolean,
    userId: string | null,
    userData: UserDataType | null
  ) => void;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  userData: null,
  setAuthState: (isAuthenticated, userId, userData) =>
    set({ isAuthenticated, userId, userData }),
}));

export default useAuthStore;
