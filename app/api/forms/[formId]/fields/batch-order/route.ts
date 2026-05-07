import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/providers/prisma";
import { ERROR_CODES, ERROR_MESSAGES } from "@/lib/errorCodes";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) {
  try {
    const { formId: formIdStr } = await params;
    const formId = parseInt(formIdStr, 10);
    const { fields } = (await req.json()) as {
      fields: Array<{ id: number; order: number }>;
    };

    if (!Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: "Fields array must be provided and non-empty",
          },
        },
        { status: 400 },
      );
    }

    // Use transaction to update all fields atomically
    // First, set all orders to negative values to avoid constraint conflicts
    const tempOrders = fields.map((f, idx) => ({
      ...f,
      tempOrder: -(idx + 1),
    }));

    // Step 1: Set all to temporary negative values
    await Promise.all(
      tempOrders.map((f) =>
        prisma.field.update({
          where: { id: f.id },
          data: { order: f.tempOrder },
        }),
      ),
    );

    // Step 2: Set all to final values
    const updatedFields = await Promise.all(
      fields.map((f) =>
        prisma.field.update({
          where: { id: f.id },
          data: { order: f.order },
          include: { options: true },
        }),
      ),
    );

    return NextResponse.json(updatedFields, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      "Batch field order update error:",
      error instanceof Error ? error.message : String(error),
    );
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error("Stack:", error.stack);
    }
    return NextResponse.json(
      {
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: ERROR_MESSAGES.INTERNAL_ERROR,
        },
      },
      { status: 500 },
    );
  }
}
