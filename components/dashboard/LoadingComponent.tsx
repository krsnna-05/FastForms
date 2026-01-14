"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingComponentProps {
  message?: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  message = "Wait while we create your Google Form",
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background mt-24">
      <div className="flex flex-col items-center justify-center space-y-6 p-8">
        {/* Animated Loading Spinner */}
        <div className="relative w-20 h-20">
          <Loader2 className="w-20 h-20 text-primary animate-spin" />
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground">
            Setting up your form...
          </p>
        </div>

        {/* Progress Dots Animation */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-pulse"
              style={{
                animationDelay: `${i * 200}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
