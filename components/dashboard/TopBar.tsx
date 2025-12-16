import { useState } from "react";
import { LayoutGrid, MessageCircle } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

const TopBar = ({
  view,
  setView,
}: {
  view: "structure" | "chat";
  setView: (view: "structure" | "chat") => void;
}) => {
  const [formName, setFormName] = useState("Untitled Form");
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <div className=" border-b border-muted-foreground/50 backdrop-blur-sm bg-background h-14 flex items-center">
      {/* Top section */}
      <div className="py-3 flex items-center gap-4 flex-1">
        {/* Left - Sidebar trigger & Form name */}
        <div className="flex items-center gap-3 min-w-0 flex-1 h-full">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors shrink-0" />

          {/* Form Name - Editable */}
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                className="px-2 py-1 bg-input border border-primary/30 rounded-md text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 flex-1 max-w-xs"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="px-2 py-1 text-sm font-semibold text-foreground hover:bg-card/50 rounded-md transition-colors truncate flex-1 text-left"
                title="Click to edit form name"
              >
                {formName}
              </button>
            )}
            <span className="text-xs text-muted-foreground/60 hidden sm:inline whitespace-nowrap">
              • Last edited 2 min ago
            </span>
          </div>
        </div>

        {/* Right - View switcher & Actions */}
        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="flex items-center gap-1 p-1 bg-card/50 border border-border/60 rounded-lg">
            <button
              onClick={() => setView("chat")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                view === "chat"
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden md:inline">Chat</span>
            </button>
            <button
              onClick={() => setView("structure")}
              className={`  px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex  items-center gap-1.5 ${
                view === "structure"
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Structure</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
