"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import UnauthorizedPage from "./UnauthorizedPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token, setAuthState, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);

      // If already authenticated in store, allow
      if (isAuthenticated) {
        setAuthorized(true);
        setLoading(false);
        return;
      }

      // Check if token exists
      const storedToken = token || localStorage.getItem("auth_token");
      if (!storedToken) {
        setAuthorized(false);
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
          setAuthorized(true);
        } else {
          // Token is invalid
          logout();
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        logout();
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, token, setAuthState, logout]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!authorized) {
    return <UnauthorizedPage />;
  }

  // Authorized - render children
  return <>{children}</>;
};

export default ProtectedRoute;
