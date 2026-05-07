"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Save,
  Cloud,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
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
import { ERROR_MESSAGES, type ErrorCode } from "@/lib/errorCodes";

interface ApiError {
  code: ErrorCode;
  message: string;
}

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
  const [error, setError] = useState<ApiError | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState<FormState>("saved");
  const [showFieldTypeMenu, setShowFieldTypeMenu] = useState(false);
  const [operatingFieldId, setOperatingFieldId] = useState<number | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);

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
        setError(null);
        const response = await fetch(`/api/forms/${formId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw (
            errorData.error || {
              code: "INTERNAL_ERROR" as ErrorCode,
              message: "Failed to fetch form",
            }
          );
        }

        const data = await response.json();
        setForm(data);
        setEditTitle(data.title);

        // Initialize form in store with "saved" state since it's from DB
        setFormInStore(formId, data, "saved");
        setFormState("saved");
      } catch (err) {
        const apiError = err as ApiError;
        setError(
          apiError || {
            code: "INTERNAL_ERROR" as ErrorCode,
            message: "An error occurred",
          },
        );
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId, setFormInStore]);

  const handleUpdateField = async (
    fieldId: number,
    updates: Partial<Field>,
  ) => {
    if (!form) return;

    try {
      setError(null);
      setOperatingFieldId(fieldId);

      // Optimistically update local state
      const updatedForm = {
        ...form,
        fields: form.fields.map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field,
        ),
      };

      setForm(updatedForm);
      updateFormInStore(formId, { ...updatedForm, state: "not-saved" });
      setFormState("not-saved");

      // Send update to API
      const response = await fetch(`/api/forms/${formId}/fields/${fieldId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw (
          errorData.error || {
            code: "FIELD_UPDATE_FAILED" as ErrorCode,
            message: ERROR_MESSAGES.FIELD_UPDATE_FAILED,
          }
        );
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Error updating field:", err);
      // Revert to previous state on error by refetching
      // Could also maintain previous state
    } finally {
      setOperatingFieldId(null);
    }
  };

  const handleDeleteField = async (fieldId: number) => {
    if (!form) return;

    try {
      setError(null);
      setOperatingFieldId(fieldId);

      // Optimistically update local state
      const updatedForm = {
        ...form,
        fields: form.fields.filter((field) => field.id !== fieldId),
      };

      setForm(updatedForm);
      updateFormInStore(formId, { ...updatedForm, state: "not-saved" });
      setFormState("not-saved");

      // Send delete to API
      const response = await fetch(`/api/forms/${formId}/fields/${fieldId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw (
          errorData.error || {
            code: "FIELD_DELETE_FAILED" as ErrorCode,
            message: ERROR_MESSAGES.FIELD_DELETE_FAILED,
          }
        );
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Error deleting field:", err);
      // Revert state on error by refetching
    } finally {
      setOperatingFieldId(null);
    }
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

  const handleAddField = async (
    type: "TEXT" | "PARA" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "DROPDOWN",
  ) => {
    if (!form) return;

    try {
      setError(null);
      setIsAddingField(true);
      const newOrder = form.fields.length + 1;
      const response = await fetch(`/api/forms/${formId}/fields`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: `New ${type} Field`,
          type,
          required: false,
          order: newOrder,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw (
          errorData.error || {
            code: "FIELD_CREATE_FAILED" as ErrorCode,
            message: ERROR_MESSAGES.FIELD_CREATE_FAILED,
          }
        );
      }

      const newField = await response.json();

      const updatedForm = {
        ...form,
        fields: [...form.fields, newField],
      };

      setForm(updatedForm);
      updateFormInStore(formId, { ...updatedForm, state: "not-saved" });
      setFormState("not-saved");
      setShowFieldTypeMenu(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Error adding field:", err);
    } finally {
      setIsAddingField(false);
    }
  };

  const handleSaveForm = async () => {
    if (!form) return;

    try {
      setIsSaving(true);
      setError(null);

      // First, save form metadata (title, description)
      const metaResponse = await fetch(`/api/forms/${formId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
        }),
      });

      if (!metaResponse.ok) {
        const errorData = await metaResponse.json();
        throw (
          errorData.error || {
            code: "FORM_UPDATE_FAILED" as ErrorCode,
            message: ERROR_MESSAGES.FORM_UPDATE_FAILED,
          }
        );
      }

      // Then, save field orders in batch (atomic transaction)
      const orderResponse = await fetch(
        `/api/forms/${formId}/fields/batch-order`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: form.fields.map((f) => ({
              id: f.id,
              order: f.order,
            })),
          }),
        },
      );

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error(
          "Batch field order update failed:",
          JSON.stringify(errorData, null, 2),
        );
        throw (
          errorData.error || {
            code: "FIELD_UPDATE_FAILED" as ErrorCode,
            message: `Failed to update field positions (status ${orderResponse.status})`,
          }
        );
      }

      // Consume response body
      await orderResponse.json().catch(() => {
        // Ignore parse errors
      });

      // Update store state to "saved"
      updateFormInStore(formId, { ...form, state: "saved" });
      setFormState("saved");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error(
        "Error saving form - Details:",
        JSON.stringify(
          {
            code: apiError?.code,
            message: apiError?.message,
            fullError: JSON.stringify(err),
          },
          null,
          2,
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncWithGoogle = async () => {
    if (!form) return;

    try {
      setIsSaving(true);
      setError(null);
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
        const errorData = await response.json();
        throw (
          errorData.error || {
            code: "INTERNAL_ERROR" as ErrorCode,
            message: "Failed to sync form",
          }
        );
      }

      // Update store state to "synced"
      updateFormInStore(formId, { ...form, state: "synced" });
      setFormState("synced");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
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
      // Order will be saved when user clicks Save button
    }
  };

  const renderField = (field: Field, dragHandleProps?: any) => {
    const isLoading = operatingFieldId === field.id;
    const commonProps = {
      id: field.id.toString(),
      label: field.label,
      required: field.required,
      formId: formId,
      onUpdate: (updates: any) => handleUpdateField(field.id, updates),
      onDelete: () => handleDeleteField(field.id),
      dragHandleProps,
      isLoading,
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
        <div className="text-center max-w-md">
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg inline-flex">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Form</h2>
          <p className="text-destructive mb-4">{error.message}</p>
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
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Error</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
                    <div className="relative inline-block">
                      <Button
                        className="gap-2"
                        onClick={() => setShowFieldTypeMenu(!showFieldTypeMenu)}
                        disabled={isAddingField}
                      >
                        <Plus className="w-4 h-4" />
                        {isAddingField ? "Adding..." : "Add Field"}
                      </Button>
                      {showFieldTypeMenu && (
                        <div className="absolute top-full mt-2 bg-white border border-border rounded-lg shadow-lg z-50 w-48">
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-muted disabled:opacity-50"
                            onClick={() => {
                              handleAddField("TEXT");
                              setShowFieldTypeMenu(false);
                            }}
                            disabled={isAddingField}
                          >
                            Short Text
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-muted disabled:opacity-50"
                            onClick={() => {
                              handleAddField("PARA");
                              setShowFieldTypeMenu(false);
                            }}
                            disabled={isAddingField}
                          >
                            Paragraph
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-muted disabled:opacity-50"
                            onClick={() => {
                              handleAddField("SINGLE_CHOICE");
                              setShowFieldTypeMenu(false);
                            }}
                            disabled={isAddingField}
                          >
                            Single Choice
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-muted disabled:opacity-50"
                            onClick={() => {
                              handleAddField("MULTIPLE_CHOICE");
                              setShowFieldTypeMenu(false);
                            }}
                            disabled={isAddingField}
                          >
                            Multiple Choice
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-muted disabled:opacity-50"
                            onClick={() => {
                              handleAddField("DROPDOWN");
                              setShowFieldTypeMenu(false);
                            }}
                            disabled={isAddingField}
                          >
                            Dropdown
                          </button>
                        </div>
                      )}
                    </div>
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
          <div className="flex justify-center relative">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowFieldTypeMenu(!showFieldTypeMenu)}
              disabled={isAddingField}
            >
              <Plus className="w-4 h-4" />
              {isAddingField ? "Adding..." : "Add Field"}
            </Button>
            {showFieldTypeMenu && (
              <div className="absolute top-full mt-2 bg-white border border-border rounded-lg shadow-lg z-50 w-48">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-muted disabled:opacity-50"
                  onClick={() => {
                    handleAddField("TEXT");
                    setShowFieldTypeMenu(false);
                  }}
                  disabled={isAddingField}
                >
                  Short Text
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-muted disabled:opacity-50"
                  onClick={() => {
                    handleAddField("PARA");
                    setShowFieldTypeMenu(false);
                  }}
                  disabled={isAddingField}
                >
                  Paragraph
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-muted disabled:opacity-50"
                  onClick={() => {
                    handleAddField("SINGLE_CHOICE");
                    setShowFieldTypeMenu(false);
                  }}
                  disabled={isAddingField}
                >
                  Single Choice
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-muted disabled:opacity-50"
                  onClick={() => {
                    handleAddField("MULTIPLE_CHOICE");
                    setShowFieldTypeMenu(false);
                  }}
                >
                  Multiple Choice
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-muted"
                  onClick={() => {
                    handleAddField("DROPDOWN");
                    setShowFieldTypeMenu(false);
                  }}
                >
                  Dropdown
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
