"use client";

import React, { useState } from "react";
import TopBar from "./TopBar";
import ChatColumn from "./ChatColumn";
import FormPreview from "./FormPreview";

const FormBuilder = () => {
  const [view, setView] = useState<"structure" | "chat">("chat");

  return (
    <div className="flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden">
      <TopBar view={view} setView={setView} />

      {/* Mobile View */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {view === "chat" ? <ChatColumn /> : <FormPreview />}
      </div>
    </div>
  );
};

export default FormBuilder;
