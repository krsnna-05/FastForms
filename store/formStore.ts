import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FormState = "not-saved" | "saved" | "synced";

interface FormField {
  id: number;
  label: string;
  type: "TEXT" | "PARA" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "DROPDOWN";
  required: boolean;
  order: number;
  options: Array<{
    id: number;
    value: string;
    order: number;
  }>;
}

interface FormStoreData {
  id: number;
  title: string;
  description: string | null;
  fields: FormField[];
  state: FormState;
  lastSavedAt?: string;
  lastSyncedAt?: string;
}

interface FormStoreState {
  forms: Record<number, FormStoreData>;
  setForm: (formId: number, formData: FormStoreData, state: FormState) => void;
  updateForm: (formId: number, formData: Partial<FormStoreData>) => void;
  getForm: (formId: number) => FormStoreData | undefined;
  getFormState: (formId: number) => FormState;
  setFormState: (formId: number, state: FormState) => void;
  clearForm: (formId: number) => void;
}

export const useFormStore = create<FormStoreState>()(
  persist(
    (set, get) => ({
      forms: {},

      setForm: (formId: number, formData: FormStoreData, state: FormState) => {
        set((prevState) => ({
          forms: {
            ...prevState.forms,
            [formId]: {
              ...formData,
              state,
            },
          },
        }));
      },

      updateForm: (formId: number, formData: Partial<FormStoreData>) => {
        set((prevState) => {
          const existingForm = prevState.forms[formId];
          if (!existingForm) return prevState;

          return {
            forms: {
              ...prevState.forms,
              [formId]: {
                ...existingForm,
                ...formData,
                // Mark as not-saved when content changes (unless explicitly setting state)
                state: formData.state || ("not-saved" as FormState),
              },
            },
          };
        });
      },

      getForm: (formId: number) => {
        return get().forms[formId];
      },

      getFormState: (formId: number) => {
        return get().forms[formId]?.state || "saved";
      },

      setFormState: (formId: number, state: FormState) => {
        set((prevState) => {
          const existingForm = prevState.forms[formId];
          if (!existingForm) return prevState;

          return {
            forms: {
              ...prevState.forms,
              [formId]: {
                ...existingForm,
                state,
                ...(state === "saved" && {
                  lastSavedAt: new Date().toISOString(),
                }),
                ...(state === "synced" && {
                  lastSyncedAt: new Date().toISOString(),
                }),
              },
            },
          };
        });
      },

      clearForm: (formId: number) => {
        set((prevState) => {
          const { [formId]: _, ...rest } = prevState.forms;
          return { forms: rest };
        });
      },
    }),
    {
      name: "form-store",
      partialize: (state) => ({
        forms: state.forms,
      }),
    },
  ),
);
