import { NextRequest, NextResponse } from "next/server";
import {
  updateOption,
  deleteOption,
  getOptionById,
} from "@/services/server/prisma/Option";
import { ERROR_CODES, ERROR_MESSAGES } from "@/lib/errorCodes";

export async function GET(
  req: NextRequest,
  {
    params,
  }: { params: Promise<{ formId: string; fieldId: string; optionId: string }> },
) {
  try {
    const { optionId: optionIdStr } = await params;
    const optionId = parseInt(optionIdStr, 10);
    const option = await getOptionById(optionId);

    if (!option) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.OPTION_NOT_FOUND,
            message: ERROR_MESSAGES.OPTION_NOT_FOUND,
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(option, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      "GET /api/forms/[formId]/fields/[fieldId]/options/[optionId] error:",
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

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: { params: Promise<{ formId: string; fieldId: string; optionId: string }> },
) {
  try {
    const { optionId: optionIdStr } = await params;
    const optionId = parseInt(optionIdStr, 10);
    const { value, order } = await req.json();

    const option = await updateOption(optionId, value, order);

    if (!option) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.OPTION_UPDATE_FAILED,
            message: ERROR_MESSAGES.OPTION_UPDATE_FAILED,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(option, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      "PATCH /api/forms/[formId]/fields/[fieldId]/options/[optionId] error:",
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

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: { params: Promise<{ formId: string; fieldId: string; optionId: string }> },
) {
  try {
    const { optionId: optionIdStr } = await params;
    const optionId = parseInt(optionIdStr, 10);
    const option = await deleteOption(optionId);

    if (!option) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.OPTION_DELETE_FAILED,
            message: ERROR_MESSAGES.OPTION_DELETE_FAILED,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(option, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      "DELETE /api/forms/[formId]/fields/[fieldId]/options/[optionId] error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
