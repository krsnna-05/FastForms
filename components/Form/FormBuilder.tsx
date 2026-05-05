"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Pencil, Save, Cloud, Check } from "lucide-react";
import Link from "next/link";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { TextField } from "@/components/Form/TextField";
import { ParagraphField } from "@/components/Form/ParagraphField";
import { SingleChoiceField } from "@/components/Form/SingleChoiceField";
import { MultipleChoiceField } from "@/components/Form/MultipleChoiceField";
import { DropdownField } from "@/components/Form/DropdownField";
import { useFormStore, type FormState } from "@/store/formStore";

interface Option {
  id: number;
  value: string;
  order: number;
}

interface Field {
  id: number;
  label: string;
  type: "TEXT" | "PARA" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "DROPDOWN";
  required: boolean;
  order: number;
  options: Option[];
}

interface FormData {
  id: number;
  title: string;
  description: string | null;
  fields: Field[];
  createdAt: string;
  updatedAt: string;
}

interface FormBuilderProps {
  formId: number;
}

export default function FormBuilder({ formId }: FormBuilderProps) {
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState<FormState>("saved");

  const {
    setForm: setFormInStore,
    updateForm: updateFormInStore,
    getFormState: getStoreFormState,
  } = useFormStore();

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = useFormStore.subscribe(
      (state) => state.forms[formId]?.state,
      (state) => {
        if (state) setFormState(state);
      },
    );
    return unsubscribe;
  }, [formId]);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/forms/${formId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch form");
        }

        const data = await response.json();
        setForm(data);
        setEditTitle(data.title);

        // Initialize form in store with "saved" state since it's from DB
        setFormInStore(formId, data, "saved");
        setFormState("saved");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId, setFormInStore]);

  const handleUpdateField = (fieldId: number, updates: Partial<Field>) => {
    if (!form) return;

    const updatedForm = {
      ...form,
      fields: form.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field,
      ),
    };

    setForm(updatedForm);
    // Mark as not-saved in store
    updateFormInStore(formId, { ...updatedForm, state: "not-saved" });
    setFormState("not-saved");
  };

  const handleDeleteField = (fieldId: number) => {
    if (!form) return;

    const updatedForm = {
      ...form,
      fields: form.fields.filter((field) => field.id !== fieldId),
    };

    setForm(updatedForm);
    updateFormInStore(formId, { ...updatedForm, state: "not-saved" });
    setFormState("not-saved");
  };

  const handleSaveTitle = () => {
    if (!form) return;

    const updatedForm = {
      ...form,
      title: editTitle,
    };

    setForm(updatedForm);
    updateFormInStore(formId, { ...updatedForm, state: "not-saved" });
    setFormState("not-saved");
    setIsEditing(false);
  };

  const handleSaveForm = async () => {
    if (!form) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          fields: form.fields,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save form");
      }

      // Update store state to "saved"
      updateFormInStore(formId, { ...form, state: "saved" });
      setFormState("saved");
    } catch (err) {
      console.error("Error saving form:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncWithGoogle = async () => {
    if (!form) return;

    try {
      setIsSaving(true);
      // This is a placeholder for Google Forms sync
      // In real implementation, call Google Forms API
      const response = await fetch(`/api/forms/${formId}/sync`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to sync form");
      }

      // Update store state to "synced"
      updateFormInStore(formId, { ...form, state: "synced" });
      setFormState("synced");
    } catch (err) {
      console.error("Error syncing form:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const getStateColor = (state: FormState) => {
    switch (state) {
      case "saved":
        return "text-green-600 bg-green-50";
      case "synced":
        return "text-blue-600 bg-blue-50";
      case "not-saved":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStateIcon = (state: FormState) => {
    switch (state) {
      case "saved":
        return <Check className="w-3 h-3" />;
      case "synced":
        return <Cloud className="w-3 h-3" />;
      case "not-saved":
        return <Save className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    )
      return;

    if (form && destination.droppableId === "fields") {
      const newFields = Array.from(form.fields);
      const [movedField] = newFields.splice(source.index, 1);
      newFields.splice(destination.index, 0, movedField);

      // Update order values
      const fieldsWithUpdatedOrder = newFields.map((field, idx) => ({
        ...field,
        order: idx + 1,
      }));

      const updatedForm: FormData = {
        ...form,
        fields: fieldsWithUpdatedOrder,
      };

      // Update local state first for immediate visual feedback
      setForm(updatedForm);

      // Update store with fields change and mark as not-saved
      updateFormInStore(formId, {
        ...updatedForm,
        state: "not-saved",
      });
      setFormState("not-saved");

      // Auto-save order changes immediately
      saveFormOrder(updatedForm);
    }
  };

  const saveFormOrder = async (updatedForm: FormData) => {
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedForm.title,
          description: updatedForm.description,
          fields: updatedForm.fields,
        }),
      });

      if (response.ok) {
        console.log("Form order updated successfully");
      }
    } catch (err) {
      console.error("Error saving form order:", err);
    }
  };

  const renderField = (field: Field, dragHandleProps?: any) => {
    const commonProps = {
      id: field.id.toString(),
      label: field.label,
      required: field.required,
      onUpdate: (updates: any) => handleUpdateField(field.id, updates),
      onDelete: () => handleDeleteField(field.id),
      dragHandleProps,
    };

    switch (field.type) {
      case "TEXT":
        return <TextField key={field.id} {...commonProps} />;
      case "PARA":
        return <ParagraphField key={field.id} {...commonProps} />;
      case "SINGLE_CHOICE":
        return (
          <SingleChoiceField
            key={field.id}
            {...commonProps}
            options={field.options}
          />
        );
      case "MULTIPLE_CHOICE":
        return (
          <MultipleChoiceField
            key={field.id}
            {...commonProps}
            options={field.options}
          />
        );
      case "DROPDOWN":
        return (
          <DropdownField
            key={field.id}
            {...commonProps}
            options={field.options}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Form not found</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background/50">
      {/* Header */}
      <div className="border-b border-border bg-background sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div className="flex-1 mx-4">
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Form title"
                  className="text-lg font-semibold"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveTitle} className="px-4">
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 className="text-2xl font-bold">{form.title}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* State Indicator */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getStateColor(formState)}`}
            >
              {getStateIcon(formState)}
              <span className="capitalize">{formState}</span>
            </div>

            {/* Save Button */}
            {formState === "not-saved" && (
              <Button
                className="gap-2"
                onClick={handleSaveForm}
                disabled={isSaving}
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            )}

            {/* Sync Button */}
            {formState === "saved" && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleSyncWithGoogle}
                disabled={isSaving}
              >
                <Cloud className="w-4 h-4" />
                {isSaving ? "Syncing..." : "Sync"}
              </Button>
            )}

            {/* Saved State Button */}
            {formState === "saved" && !isSaving && (
              <Button className="gap-2" onClick={handleSaveForm}>
                <Check className="w-4 h-4" />
                Saved
              </Button>
            )}

            {/* Synced State Button */}
            {formState === "synced" && !isSaving && (
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Cloud className="w-4 h-4" />
                Synced
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Form Description */}
        {form.description && (
          <Card className="p-6 mb-8 bg-muted/50">
            <p className="text-muted-foreground">{form.description}</p>
          </Card>
        )}

        {/* Fields */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="fields">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-4 mb-8 ${snapshot.isDraggingOver ? "bg-muted/30 rounded-lg p-4" : ""}`}
              >
                {form.fields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground mb-4">No fields yet</p>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Field
                    </Button>
                  </div>
                ) : (
                  form.fields.map((field, index) => (
                    <Draggable
                      key={field.id}
                      draggableId={`field-${field.id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                        >
                          <div
                            className="mb-2"
                            data-field-drag-handle={`field-${field.id}`}
                          >
                            {renderField(field, provided.dragHandleProps)}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add Field Button */}
        {form.fields.length > 0 && (
          <div className="flex justify-center">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Field
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
