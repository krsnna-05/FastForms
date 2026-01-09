import { create } from "zustand";

type FormState = {
  forms: Array<{ id: string; title: string }>;
  addForm: (id: string, title: string) => void;
  removeForm: (id: string) => void;
};

const useFormStore = create<FormState>((set) => ({
  forms: [],
  addForm: (id, title) =>
    set((state) => ({
      forms: [...state.forms, { id, title }],
    })),
  removeForm: (id) =>
    set((state) => ({
      forms: state.forms.filter((form) => form.id !== id),
    })),
}));

export default useFormStore;
