"use client";
import React, { useState, FormEvent } from "react";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "../ai-elements/prompt-input";

import { SidebarTrigger } from "../ui/sidebar";
import { Check, Clipboard, Lightbulb, Pencil, Star } from "lucide-react";

const PromptInputCom = () => {
  const handleSubmit = (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>
  ) => {
    console.log("Prompt submitted:", message);
  };

  const [text, setText] = useState("");

  return (
    <PromptInput
      onSubmit={handleSubmit}
      className="mt-8 shadow-[0px_0px_10px_5px] shadow-primary/20 border border-primary/30 overflow-hidden rounded-md"
      globalDrop
      multiple
    >
      <PromptInputHeader className="bg-background/50 ">
        <PromptInputAttachments>
          {(attachment) => <PromptInputAttachment data={attachment} />}
        </PromptInputAttachments>
      </PromptInputHeader>
      <PromptInputBody className="bg-background">
        <PromptInputTextarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder="Create a Google Form For ..."
          className="bg-background focus:border-primary/30 min-h-[140px] text-base"
        />
      </PromptInputBody>
      <PromptInputFooter className="bg-background ">
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit />
      </PromptInputFooter>
    </PromptInput>
  );
};

const QuickTips = () => {
  const tips = [
    {
      icon: <Pencil />,
      title: "Be Descriptive",
      description: "Clearly describe what fields you need and their purpose",
    },
    {
      icon: <Clipboard />,
      title: "Specify Field Types",
      description: "Mention email, date picker, dropdown, checkbox, etc.",
    },
    {
      icon: <Star />,
      title: "Mark Required Fields",
      description: "Specify which fields are mandatory for users to fill",
    },
    {
      icon: <Check />,
      title: "Add Validation",
      description: "Include validation rules like email format or number range",
    },
  ];

  return (
    <div className="mt-8 space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Lightbulb className="text-primary" /> Quick Tips
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0 text-primary">{tip.icon}</span>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">
                  {tip.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tip.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreateForm = () => {
  const [view, setView] = useState<"structure" | "chat">("structure");

  return (
    <div className="flex-1 text-foreground flex flex-col bg-background pt-24 p-6 items-center">
      {/* Header with Sidebar Trigger */}
      <div className="mb-12 max-w-4xl w-full flex items-start justify-between">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
              <span className="text-xs font-semibold text-primary flex items-center gap-1">
                <Star size={15} /> AI Powered
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Create New Form
          </h1>
          <p className="text-base text-muted-foreground">
            Describe your form in plain English. AI will generate it instantly.
          </p>
        </div>
        <div className="">
          <SidebarTrigger className="text-foreground hover:bg-primary/10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full">
        <PromptInputCom />
        <QuickTips />
      </div>
    </div>
  );
};

export default CreateForm;
