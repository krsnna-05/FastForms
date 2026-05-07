import { prisma } from "@/providers/prisma";

export const createOption = async (
  fieldId: number,
  value: string,
  order: number,
) => {
  try {
    const option = await prisma.option.create({
      data: {
        fieldId,
        value,
        order,
      },
    });

    return option;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("createOption error:", error);
    return null;
  }
};

export const updateOption = async (
  optionId: number,
  value?: string,
  order?: number,
) => {
  try {
    const updateData: any = {};
    if (value !== undefined) updateData.value = value;
    if (order !== undefined) updateData.order = order;

    const option = await prisma.option.update({
      where: { id: optionId },
      data: updateData,
    });

    return option;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("updateOption error:", error);
    return null;
  }
};

export const deleteOption = async (optionId: number) => {
  try {
    const option = await prisma.option.delete({
      where: { id: optionId },
    });

    return option;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("deleteOption error:", error);
    return null;
  }
};

export const getOptionById = async (optionId: number) => {
  try {
    const option = await prisma.option.findUnique({
      where: { id: optionId },
    });

    return option;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getOptionById error:", error);
    return null;
  }
};

export const getFieldOptions = async (fieldId: number) => {
  try {
    const options = await prisma.option.findMany({
      where: { fieldId },
      orderBy: { order: "asc" },
    });

    return options;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getFieldOptions error:", error);
    return [];
  }
};
