import { NextRequest, NextResponse } from "next/server";
import { createField } from "@/services/server/prisma/Field";
import { ERROR_CODES, ERROR_MESSAGES } from "@/lib/errorCodes";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) {
  try {
    const { formId: formIdStr } = await params;
    const formId = parseInt(formIdStr, 10);
    const { label, type, required, order } = await req.json();

    if (!label || !type || order === undefined) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: ERROR_MESSAGES.INVALID_INPUT,
          },
        },
        { status: 400 },
      );
    }

    const field = await createField(
      formId,
      label,
      type,
      required ?? false,
      order,
    );

    if (!field) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FIELD_CREATE_FAILED,
            message: ERROR_MESSAGES.FIELD_CREATE_FAILED,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("POST /api/forms/[formId]/fields error:", error);
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
