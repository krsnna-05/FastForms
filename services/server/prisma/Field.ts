import { prisma } from "@/providers/prisma";

export const createField = async (
  formId: number,
  label: string,
  type: string,
  required: boolean,
  order: number,
) => {
  try {
    const field = await prisma.field.create({
      data: {
        formId,
        label,
        type: type as any,
        required,
        order,
      },
      include: {
        options: true,
      },
    });

    return field;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("createField error:", error);
    return null;
  }
};

export const updateField = async (
  fieldId: number,
  label?: string,
  type?: string,
  required?: boolean,
  order?: number,
) => {
  try {
    const updateData: any = {};
    if (label !== undefined) updateData.label = label;
    if (type !== undefined) updateData.type = type;
    if (required !== undefined) updateData.required = required;
    if (order !== undefined) updateData.order = order;

    // If no fields to update, return null
    if (Object.keys(updateData).length === 0) {
      console.error("updateField: No fields to update for fieldId", fieldId);
      return null;
    }

    const field = await prisma.field.update({
      where: { id: fieldId },
      data: updateData,
      include: {
        options: true,
      },
    });

    return field;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `updateField error for fieldId ${fieldId}:`,
      error instanceof Error ? error.message : String(error),
    );
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(`updateField stack:`, error.stack);
    }
    return null;
  }
};

export const deleteField = async (fieldId: number) => {
  try {
    const field = await prisma.field.delete({
      where: { id: fieldId },
      include: {
        options: true,
      },
    });

    return field;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("deleteField error:", error);
    return null;
  }
};

export const getFieldById = async (fieldId: number) => {
  try {
    const field = await prisma.field.findUnique({
      where: { id: fieldId },
      include: {
        options: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return field;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getFieldById error:", error);
    return null;
  }
};
