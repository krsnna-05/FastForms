"use client";

import { GripVertical, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Option {
  id: string;
  value: string;
}

interface SingleChoiceFieldProps {
  id: string;
  label: string;
  required?: boolean;
  options?: Option[];
  onUpdate: (field: Partial<SingleChoiceFieldProps>) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: any;
}

export const SingleChoiceField = ({
  id,
  label,
  required = false,
  options = [{ id: "1", value: "Option 1" }],
  onUpdate,
  onDelete,
  dragHandleProps,
}: SingleChoiceFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(label);
  const [editOptions, setEditOptions] = useState<Option[]>(options);

  const handleSave = () => {
    onUpdate({ label: editLabel, options: editOptions });
    setIsEditing(false);
  };

  const addOption = () => {
    const newOption: Option = {
      id: Date.now().toString(),
      value: `Option ${editOptions.length + 1}`,
    };
    setEditOptions([...editOptions, newOption]);
  };

  const updateOption = (id: string, value: string) => {
    setEditOptions(
      editOptions.map((opt) => (opt.id === id ? { ...opt, value } : opt)),
    );
  };

  const removeOption = (id: string) => {
    setEditOptions(editOptions.filter((opt) => opt.id !== id));
  };

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
          className="p-1 h-auto hover:bg-destructive/10"
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
