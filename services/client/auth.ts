export const handleAuth = () => {
  window.location.href = "/api/auth";
};

export const handleLogout = async () => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
