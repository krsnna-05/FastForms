import { useState } from "react";
import { LayoutGrid, MessageCircle } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

const TopBar = () => {
  const [formName, setFormName] = useState("Untitled Form");
  return (
    <div className=" border-b border-muted-foreground/50 backdrop-blur-sm bg-background h-14 flex items-center px-3">
      {/* Top section */}
      <div className="py-3 flex items-center gap-4 flex-1">
        {/* Left - Sidebar trigger & Form name */}
        <div className="flex items-center gap-3 min-w-0 flex-1 h-full">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors shrink-0" />

          {/* Form Name - Editable */}
          <div className="flex items-center gap-2">
            <p
              className="px-2 py-1 text-sm font-semibold text-foreground hover:bg-card/50 rounded-md transition-colors truncate flex-1 text-left"
              title="Click to edit form name"
            >
              {formName}
            </p>

            <span className="text-xs text-muted-foreground/60 whitespace-nowrap">
              Created at edited just now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
