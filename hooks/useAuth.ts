import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";

let authFetched = false;

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if we haven't already fetched and don't have user data
    if (authFetched || isAuthenticated) {
      setLoading(false);
      return;
    }

    authFetched = true;

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          login({
            id: userData.id.toString(),
            name: userData.name,
            email: userData.email,
            avatarUrl: userData.profileImageUrl,
          });
        } else {
          logout();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isAuthenticated, loading };
};
