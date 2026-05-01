"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-destructive" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground text-base max-w-sm">
            You are not authorized to access this page. Please log in with a
            valid account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-2 rounded-md border border-border text-foreground font-medium hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Return Home
          </button>
        </div>

        {/* Additional Info */}
        <div className="pt-8 border-t border-border mt-8">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/" className="text-primary hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
