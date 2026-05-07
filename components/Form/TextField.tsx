"use client";

import { GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TextFieldProps {
  id: string;
  label: string;
  required?: boolean;
  onUpdate: (field: Partial<TextFieldProps>) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: any;
  isLoading?: boolean;
}

export const TextField = ({
  id,
  label,
  required = false,
  onUpdate,
  onDelete,
  dragHandleProps,
  isLoading = false,
}: TextFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(label);

  const handleSave = () => {
    onUpdate({ label: editLabel });
    setIsEditing(false);
  };

  return (
    <div className="relative border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          className="p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
          {...dragHandleProps}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(id)}
          className="p-1 h-auto hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>

      {/* Field Type Badge */}
      <div className="text-xs font-semibold text-primary bg-primary/10 w-fit px-2 py-1 rounded mb-3">
        TEXT
      </div>

      {/* Label */}
      <div className="mb-3">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              placeholder="Field label"
              className="text-sm"
              autoFocus
            />
            <Button size="sm" onClick={handleSave} className="px-3">
              Save
            </Button>
          </div>
        ) : (
          <p
            onClick={() => setIsEditing(true)}
            className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors"
          >
            {editLabel || "Untitled field"}{" "}
            {required && <span className="text-destructive">*</span>}
          </p>
        )}
      </div>

      {/* Preview */}
      <Input
        type="text"
        placeholder="Short text answer"
        disabled
        className="text-xs"
      />
    </div>
  );
};
