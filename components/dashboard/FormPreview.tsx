"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useParams } from "next/navigation";

type FormField = {
  type: "short_text" | "long_text" | "multiple_choice" | "checkboxes";
  question: string;
  required: boolean;
  options?: string[];
};

type FormData = {
  formTitle: string;
  formDescription: string;
  fields: FormField[];
};

// Dummy form data
const dummyFormData: FormData = {
  formTitle: "Customer Feedback Survey",
  formDescription: "Help us improve our service by sharing your feedback",
  fields: [
    {
      type: "short_text",
      question: "What is your full name?",
      required: true,
    },
    {
      type: "short_text",
      question: "What is your email address?",
      required: true,
    },
    {
      type: "long_text",
      question: "Please describe your experience with our service",
      required: true,
    },
    {
      type: "multiple_choice",
      question: "How satisfied are you with our service?",
      required: true,
      options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
    },
    {
      type: "checkboxes",
      question: "Which features do you use most? (Select all that apply)",
      required: false,
      options: ["Dashboard", "Analytics", "Reporting", "Integration"],
    },
  ],
};

const ShortTextComponent = ({
  Question,
  Required,
}: {
  Question: string;
  Required: boolean;
}) => {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">
        {Question}
        {Required && <span className="text-destructive ml-1.5">*</span>}
      </label>
      <Input
        type="text"
        placeholder="Your answer here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-input/50 text-foreground placeholder:text-muted-foreground border-border focus:border-primary focus:ring-primary/20"
      />
    </div>
  );
};

const LongTextComponent = ({
  Question,
  Required,
}: {
  Question: string;
  Required: boolean;
}) => {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">
        {Question}
        {Required && <span className="text-destructive ml-1.5">*</span>}
      </label>
      <Textarea
        placeholder="Your detailed answer here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full min-h-24 bg-input/50 text-foreground placeholder:text-muted-foreground border-border focus:border-primary focus:ring-primary/20 resize-none"
      />
    </div>
  );
};

const MultipleChoiceComponent = ({
  Question,
  Options,
  Required,
}: {
  Question: string;
  Options: string[];
  Required: boolean;
}) => {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-foreground">
        {Question}
        {Required && <span className="text-destructive ml-1.5">*</span>}
      </label>
      <RadioGroup value={value} onValueChange={setValue} className="space-y-3">
        {Options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3">
            <RadioGroupItem value={option} id={`option-${index}`} />
            <label
              htmlFor={`option-${index}`}
              className="text-sm font-medium text-foreground cursor-pointer hover:text-accent transition-colors"
            >
              {option}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

const CheckboxesComponent = ({
  Question,
  Options,
  Required,
}: {
  Question: string;
  Options: string[];
  Required: boolean;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleChange = (option: string, checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    if (isChecked) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-foreground">
        {Question}
        {Required && <span className="text-destructive ml-1.5">*</span>}
      </label>
      <div className="space-y-3">
        {Options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Checkbox
              id={`checkbox-${index}`}
              checked={selectedOptions.includes(option)}
              onCheckedChange={(checked) => handleChange(option, checked)}
            />
            <label
              htmlFor={`checkbox-${index}`}
              className="text-sm font-medium text-foreground cursor-pointer hover:text-accent transition-colors"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const FormPreview = () => {
  const { formId } = useParams();

  const userForm = JSON.parse(localStorage.getItem(`form_${formId}`) || "{}");

  console.log("Loaded form data for preview:", userForm);

  return (
    <div className="w-full overflow-y-auto p-6 md:p-8 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Form Header */}
        <div className="rounded-lg border border-border bg-card shadow-sm p-8 space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            {userForm.formTitle}
          </h1>
          <p className="text-muted-foreground text-base">
            {userForm.formDescription}
          </p>
        </div>

        {/* Form Fields */}
        <div className="rounded-lg border border-border bg-card shadow-sm p-8 space-y-8">
          {userForm.form.map((field, index) => (
            <div
              key={index}
              className={
                index !== dummyFormData.fields.length - 1
                  ? "pb-8 border-b border-border"
                  : ""
              }
            >
              {field.type === "short_text" && (
                <ShortTextComponent
                  Question={field.question}
                  Required={field.required}
                />
              )}
              {field.type === "long_text" && (
                <LongTextComponent
                  Question={field.question}
                  Required={field.required}
                />
              )}
              {field.type === "multiple_choice" && (
                <MultipleChoiceComponent
                  Question={field.question}
                  Options={field.options || []}
                  Required={field.required}
                />
              )}
              {field.type === "checkboxes" && (
                <CheckboxesComponent
                  Question={field.question}
                  Options={field.options || []}
                  Required={field.required}
                />
              )}
            </div>
          ))}

          {/* Submit Button */}
          <div className="pt-4">
            <button className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-[calc(var(--radius))] font-semibold hover:opacity-90 transition-opacity shadow-md hover:shadow-lg duration-200">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
export {
  ShortTextComponent,
  LongTextComponent,
  MultipleChoiceComponent,
  CheckboxesComponent,
};
