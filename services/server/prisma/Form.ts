import { prisma } from "@/providers/prisma";

export const getFormsForUser = async (userId: number) => {
  try {
    const forms = await prisma.form.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: "desc" },
    });

    return forms;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getFormsForUser error:", error);
    return [];
  }
};

export const getFormById = async (formId: number) => {
  try {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: {
          include: {
            options: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return form;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getFormById error:", error);
    return null;
  }
};

export const createFormWithFields = async (
  userId: number,
  title: string,
  description: string | null,
  fields: Array<{
    label: string;
    type: string;
    required: boolean;
    order: number;
    options?: Array<{ value: string; order: number }>;
  }>,
) => {
  try {
    const form = await prisma.form.create({
      data: {
        title,
        description,
        creatorId: userId,
        fields: {
          create: fields.map((field) => ({
            label: field.label,
            type: field.type as any,
            required: field.required,
            order: field.order,
            options: field.options
              ? {
                  create: field.options,
                }
              : undefined,
          })),
        },
      },
      include: {
        fields: {
          include: {
            options: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return form;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("createFormWithFields error:", error);
    return null;
  }
};

export const deleteFormById = async (formId: number) => {
  try {
    // Delete options first (if cascade delete is not set up)
    await prisma.option.deleteMany({
      where: {
        field: {
          formId,
        },
      },
    });

    // Delete fields
    await prisma.field.deleteMany({
      where: {
        formId,
      },
    });

    // Delete form
    const form = await prisma.form.delete({
      where: { id: formId },
    });

    return form;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("deleteFormById error:", error);
    return null;
  }
};
