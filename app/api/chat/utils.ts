type form = {
  message: string;
  formTitle: string;
  form: field[];
};

type field = {
  type: "short_text" | "long_text" | "multiple_choice" | "checkboxes";
  question: string;
  required: boolean;
  options?: string[];
};

function mapFieldToGoogleItem(field: field) {
  const baseItem: any = {
    title: field.question,
    questionItem: {
      question: {
        required: field.required,
      },
    },
  };

  switch (field.type) {
    case "short_text":
      baseItem.questionItem.question.textQuestion = {
        paragraph: false,
      };
      break;

    case "long_text":
      baseItem.questionItem.question.textQuestion = {
        paragraph: true,
      };
      break;

    case "multiple_choice":
      baseItem.questionItem.question.choiceQuestion = {
        type: "RADIO",
        options: (field.options ?? []).map((opt) => ({ value: opt })),
      };
      break;

    case "checkboxes":
      baseItem.questionItem.question.choiceQuestion = {
        type: "CHECKBOX",
        options: (field.options ?? []).map((opt) => ({ value: opt })),
      };
      break;
  }

  return baseItem;
}

const buildGoogleFormRequestBody = (form: form) => {
  const baseRequestBody: any = {
    info: {
      title: form.formTitle,
    },
    items: [],
  };

  form.form.forEach((field) => {
    const googleItem = mapFieldToGoogleItem(field);
    baseRequestBody.items.push(googleItem);
  });

  return baseRequestBody;
};

export { buildGoogleFormRequestBody };
