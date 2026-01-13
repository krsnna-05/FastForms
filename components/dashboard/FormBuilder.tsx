"use client";

import { useState } from "react";
import TopBar from "./TopBar";
import FormPreview from "./FormPreview";
import LoadingComponent from "./LoadingComponent";

const FormBuilder = () => {
  const [view, setView] = useState<"structure" | "chat">("chat");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden">
      <TopBar />
      {/* Mobile View */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {isLoading ? (
          <LoadingComponent message="Wait while we create your Google Form" />
        ) : (
          <FormPreview />
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
