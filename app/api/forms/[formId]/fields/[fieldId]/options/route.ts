import { NextRequest, NextResponse } from "next/server";
import { createOption, getFieldOptions } from "@/services/server/prisma/Option";
import { ERROR_CODES, ERROR_MESSAGES } from "@/lib/errorCodes";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string; fieldId: string }> },
) {
  try {
    const { fieldId: fieldIdStr } = await params;
    const fieldId = parseInt(fieldIdStr, 10);
    const { value, order } = await req.json();

    if (!value || order === undefined) {
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

    const option = await createOption(fieldId, value, order);

    if (!option) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.OPTION_CREATE_FAILED,
            message: ERROR_MESSAGES.OPTION_CREATE_FAILED,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(option, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      "POST /api/forms/[formId]/fields/[fieldId]/options error:",
      error,
    );
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string; fieldId: string }> },
) {
  try {
    const { fieldId: fieldIdStr } = await params;
    const fieldId = parseInt(fieldIdStr, 10);
    const options = await getFieldOptions(fieldId);

    return NextResponse.json(options, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      "GET /api/forms/[formId]/fields/[fieldId]/options error:",
      error,
    );
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
