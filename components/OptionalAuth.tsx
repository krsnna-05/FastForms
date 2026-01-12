"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface OptionalAuthProps {
  children: React.ReactNode;
}

/**
 * OptionalAuth wrapper - Verifies auth if token exists, but doesn't block if not authenticated
 * Use this for pages that should work for both authenticated and unauthenticated users (like home page)
 */
const OptionalAuth: React.FC<OptionalAuthProps> = ({ children }) => {
  const { isAuthenticated, token, setAuthState, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);

      // If already authenticated in store, we're good
      if (isAuthenticated) {
        setLoading(false);
        return;
      }

      // Check if token exists
      const storedToken = token || localStorage.getItem("auth_token");
      if (!storedToken) {
        // No token, but that's okay - just render the page
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Token is valid, set auth state
          setAuthState(
            true,
            data.user.userId,
            {
              email: data.user.email,
              name: data.user.name,
            },
            storedToken
          );
        } else {
          // Token is invalid, logout
          logout();
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, token, setAuthState, logout]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Always render children (authenticated or not)
  return <>{children}</>;
};

export default OptionalAuth;
