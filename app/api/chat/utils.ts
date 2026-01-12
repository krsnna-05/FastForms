type form = {
  formTitle: string;
  form: field[];
};

type field = {
  type: "short_text" | "long_text" | "multiple_choice" | "checkboxes";
  question: string;
  required: boolean;
  options?: string[];
};

function mapFieldToGoogleItem(field: field, index: number) {
  const baseItem: any = {
    createItem: {
      item: {
        title: field.question,
        questionItem: {
          question: {
            required: field.required,
          },
        },
      },
      location: {
        index: index,
      },
    },
  };

  switch (field.type) {
    case "short_text":
      baseItem.createItem.item.questionItem.question.textQuestion = {
        paragraph: false,
      };
      break;

    case "long_text":
      baseItem.createItem.item.questionItem.question.textQuestion = {
        paragraph: true,
      };
      break;

    case "multiple_choice":
      baseItem.createItem.item.questionItem.question.choiceQuestion = {
        type: "RADIO",
        options: (field.options ?? []).map((opt) => ({ value: opt })),
      };
      break;

    case "checkboxes":
      baseItem.createItem.item.questionItem.question.choiceQuestion = {
        type: "CHECKBOX",
        options: (field.options ?? []).map((opt) => ({ value: opt })),
      };
      break;
  }
  return baseItem;
}

const buildGoogleFormRequestBody = (form: form) => {
  const baseRequestBody: any = {
    includeFormInResponse: true,
    requests: [],
  };

  form.form.forEach((field, index) => {
    const questionItem = mapFieldToGoogleItem(field, index);
    baseRequestBody.requests.push(questionItem);
  });

  return baseRequestBody;
};

export { buildGoogleFormRequestBody };
