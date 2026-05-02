"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("Auth error:", error);
      setTimeout(() => router.push("/"), 100);
      return;
    }

    if (code) {
      const handleCallback = async () => {
        try {
          const response = await fetch("/api/auth/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });

          if (response.ok) {
            // Redirect to dashboard on success
            setTimeout(() => router.push("/dashboard"), 100);
          } else {
            setTimeout(() => router.push("/"), 100);
          }
        } catch (err) {
          console.error("Callback error:", err);
          setTimeout(() => router.push("/"), 100);
        }
      };

      handleCallback();
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          Processing authentication...
        </h1>
        <p className="text-muted-foreground">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
}
