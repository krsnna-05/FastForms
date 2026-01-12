"use client";

import useAuthStore from "@/store/AuthStore";

/**
 * Hook to access auth state and methods from Zustand store
 * Use this in any component to get auth info and manage auth
 */
export const useAuth = () => {
  const {
    isAuthenticated,
    userId,
    userData,
    token,
    setAuthState,
    setToken,
    logout,
  } = useAuthStore();

  return {
    isAuthenticated,
    userId,
    userData,
    token,
    setAuthState,
    setToken,
    logout,
  };
};
