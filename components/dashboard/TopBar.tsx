import { useEffect, useState } from "react";
import { LayoutGrid, MessageCircle, UploadIcon } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";

const TopBar = () => {
  const [formName, setFormName] = useState("Untitled Form");
  const [formStatus, setFormStatus] = useState<"local" | "cloud">("local");
  const { formId } = useParams();

  const form = JSON.parse(localStorage.getItem(`form_${formId}`) || "{}");

  useEffect(() => {
    setFormStatus(form.save === "cloud" ? "cloud" : "local");
  }, [form]);

  const isLocalSave = formStatus === "local";

  const handleExport = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    const res = await fetch("/api/forms/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        formId,
        form: form.form.userForm,
      }),
    });

    if (!res.ok) {
      console.error("Failed to sync form:", await res.text());
      return;
    }

    const data = await res.json();
    console.log("Form synced successfully:", data);

    // Update local storage to mark form as cloud-synced
    const updatedForm = {
      ...form,
      save: "cloud",
    };
    localStorage.setItem(`form_${formId}`, JSON.stringify(updatedForm));
    console.log("Form marked as cloud-synced in localStorage");

    // Update state to trigger re-render
    setFormStatus("cloud");
  };

  return (
    <div className=" border-b border-muted-foreground/50 backdrop-blur-sm bg-background h-14 flex items-center px-3 justify-between">
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
              {form.formTitle || formName}
            </p>

            {formStatus === "local" ? (
              <span
                className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-medium"
                title="This form is saved locally in your browser."
              >
                Local
              </span>
            ) : (
              <span
                className="text-xs px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-medium"
                title="This form is synced with Google Forms."
              >
                Synced
              </span>
            )}

            <span className="text-xs text-muted-foreground/60 whitespace-nowrap">
              Created at edited just now
            </span>
          </div>
        </div>
      </div>

      {formStatus == "local" && (
        <Button className="shrink-0" onClick={handleExport}>
          <UploadIcon className="mr-2 h-4 w-4" />
          Export to Google Forms
        </Button>
      )}
    </div>
  );
};

export default TopBar;
