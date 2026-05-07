"use client";

import { GripVertical, Trash2, Plus } from "lucide-react";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Option {
  id: number | string;
  value: string;
  order?: number;
}

interface SingleChoiceFieldProps {
  id: string;
  label: string;
  required?: boolean;
  formId?: number;
  options?: Option[];
  onUpdate: (field: Partial<SingleChoiceFieldProps>) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: any;
  isLoading?: boolean;
}

export const SingleChoiceField = ({
  id,
  label,
  required = false,
  formId,
  options = [{ id: "1", value: "Option 1" }],
  onUpdate,
  onDelete,
  dragHandleProps,
  isLoading = false,
}: SingleChoiceFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(label);
  const [editOptions, setEditOptions] = useState<Option[]>(options);

  const handleSave = () => {
    onUpdate({ label: editLabel });
    setIsEditing(false);
  };

  const addOption = useCallback(async () => {
    if (!formId) return;

    const newOrder = editOptions.length + 1;
    const newOption: Option = {
      id: `temp-${Date.now()}`,
      value: `Option ${newOrder}`,
      order: newOrder,
    };

    // Optimistic update
    setEditOptions([...editOptions, newOption]);

    try {
      const response = await fetch(
        `/api/forms/${formId}/fields/${id}/options`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: newOption.value,
            order: newOrder,
          }),
        },
      );

      if (response.ok) {
        const createdOption = await response.json();
        // Replace temp option with server option
        setEditOptions((prev) =>
          prev.map((opt) => (opt.id === newOption.id ? createdOption : opt)),
        );
      }
    } catch (err) {
      console.error("Error adding option:", err);
      // Remove the option on error
      setEditOptions((prev) => prev.filter((opt) => opt.id !== newOption.id));
    }
  }, [editOptions, id, formId]);

  const updateOption = useCallback(
    async (optionId: number | string, value: string) => {
      // Optimistic update
      setEditOptions(
        editOptions.map((opt) =>
          opt.id === optionId ? { ...opt, value } : opt,
        ),
      );

      // Only make API call if it's a server option (numeric id)
      if (typeof optionId === "number" && formId) {
        try {
          await fetch(`/api/forms/${formId}/fields/${id}/options/${optionId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ value }),
          });
        } catch (err) {
          console.error("Error updating option:", err);
        }
      }
    },
    [editOptions, id, formId],
  );

  const removeOption = useCallback(
    async (optionId: number | string) => {
      // Optimistic update
      setEditOptions((prev) => prev.filter((opt) => opt.id !== optionId));

      // Only make API call if it's a server option (numeric id)
      if (typeof optionId === "number" && formId) {
        try {
          await fetch(`/api/forms/${formId}/fields/${id}/options/${optionId}`, {
            method: "DELETE",
            credentials: "include",
          });
        } catch (err) {
          console.error("Error deleting option:", err);
          // Restore option on error
          const option = options?.find((opt) => opt.id === optionId);
          if (option) {
            setEditOptions((prev) => [...prev, option]);
          }
        }
      }
    },
    [id, formId, options],
  );

  const handleDragEndOptions = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.index === destination.index) return;

    const newOptions = Array.from(editOptions);
    const [movedOption] = newOptions.splice(source.index, 1);
    newOptions.splice(destination.index, 0, movedOption);

    setEditOptions(newOptions);
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
        SINGLE CHOICE
      </div>

      {/* Label */}
      <div className="mb-3">
        {isEditing ? (
          <div className="flex gap-2 mb-3">
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
      <div className="space-y-2">
        {isEditing ? (
          <>
            <DragDropContext onDragEnd={handleDragEndOptions}>
              <Droppable droppableId={`options-${id}`}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-2 ${snapshot.isDraggingOver ? "bg-muted/20 p-2 rounded" : ""}`}
                  >
                    {editOptions.map((option, index) => (
                      <Draggable
                        key={option.id}
                        draggableId={`option-${option.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex gap-2 items-center ${snapshot.isDragging ? "opacity-50" : ""}`}
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                            </div>
                            <input type="radio" disabled className="w-4 h-4" />
                            <Input
                              value={option.value}
                              onChange={(e) =>
                                updateOption(option.id, e.target.value)
                              }
                              className="text-xs flex-1"
                              placeholder="Option"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOption(option.id)}
                              className="p-1 h-auto"
                            >
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Button
              variant="outline"
              size="sm"
              onClick={addOption}
              className="w-full mt-2 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Option
            </Button>
          </>
        ) : (
          editOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input type="radio" disabled className="w-4 h-4" />
              <span className="text-sm">{option.value}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};
