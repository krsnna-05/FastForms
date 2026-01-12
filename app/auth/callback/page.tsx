"use client";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { FormIcon } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useAuthStore from "@/store/AuthStore";

type AuthState = {
  state: "loading" | "success" | "error";
  desc: string;
};

const CallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const authStore = useAuthStore();

  const [authState, setAuthState] = useState<AuthState>({
    state: "loading",
    desc: "Please wait while we log you in...",
  });

  const saveUser = async (code: string, prompt: string) => {
    try {
      const response = await fetch(
        `/api/auth/google/callback?prompt=${prompt}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            code: `Bearer ${code}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        authStore.setAuthState(
          true,
          data.user.id,
          {
            name: data.user.name,
            email: data.user.email,
            profilePhotoUrl: data.user.picture,
          },
          data.token
        );

        setAuthState({
          state: "success",
          desc: "Login successful! Redirecting you now...",
        });

        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setAuthState({
          state: "error",
          desc: data.message || "Authentication failed. Please try again.",
        });

        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error authenticating user:", error);
      setAuthState({
        state: "error",
        desc: "An error occurred during authentication. Please try again.",
      });
    }
  };

  useEffect(() => {
    const handleAuth = async () => {
      const error = searchParams.get("error");
      const code = searchParams.get("code");
      const prompt = searchParams.get("prompt");

      if (error && error === "access_denied") {
        setAuthState({
          state: "error",
          desc: "You denied access. Please try again.",
        });
        return;
      }

      if (!code || !prompt) {
        setAuthState({
          state: "error",
          desc: "No authorization code received. Please try again.",
        });
        return;
      }

      await saveUser(code, prompt);
    };

    handleAuth();
  }, [searchParams]);

  const renderContent = () => {
    switch (authState.state) {
      case "loading":
        return (
          <>
            <h1 className="text-2xl font-bold">Authenticating</h1>
            <CardDescription>{authState.desc}</CardDescription>
            <CardAction>
              <div className="loader mt-4 flex justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
            </CardAction>
          </>
        );
      case "success":
        return (
          <>
            <h1 className="text-2xl font-bold">Successful</h1>
            <CardDescription>{authState.desc}</CardDescription>
            <CardAction>
              <div className="mt-4 flex justify-center">
                <p className="text-sm text-green-600 font-medium">
                  ✓ Login successful
                </p>
              </div>
            </CardAction>
          </>
        );
      case "error":
        return (
          <>
            <h1 className="text-2xl font-bold">Failed</h1>
            <CardDescription>{authState.desc}</CardDescription>
            <CardAction>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => router.push("/")}
                  className="text-sm text-red-600 font-medium hover:underline"
                >
                  ✗ Try again
                </button>
              </div>
            </CardAction>
          </>
        );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center p-3">
      <div
        className="w-full max-w-md flex items-center justify-center gap-2 pl-2 mb-2"
        id="branding"
      >
        <FormIcon className=" text-primary bg-primary/20 p-1 size-8 rounded-sm border border-primary/50" />
        <p className=" text-xl font-bold">FastForms</p>
      </div>
      <Card className="w-full max-w-md px-5 ">
        <CardHeader className="space-y-4">{renderContent()}</CardHeader>
      </Card>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex flex-col justify-center items-center p-3">
          <div
            className="w-full max-w-md flex items-center justify-center gap-2 pl-2 mb-2"
            id="branding"
          >
            <FormIcon className=" text-primary bg-primary/20 p-1 size-8 rounded-sm border border-primary/50" />
            <p className=" text-xl font-bold">FastForms</p>
          </div>
          <Card className="w-full max-w-md px-5 ">
            <CardHeader className="space-y-4">
              <h1 className="text-2xl font-bold">Authenticating</h1>
              <CardDescription>
                Please wait while we log you in...
              </CardDescription>
              <CardAction>
                <div className="loader mt-4 flex justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
              </CardAction>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
