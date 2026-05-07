import { NextRequest, NextResponse } from "next/server";
import {
  updateField,
  deleteField,
  getFieldById,
} from "@/services/server/prisma/Field";
import { ERROR_CODES, ERROR_MESSAGES } from "@/lib/errorCodes";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string; fieldId: string }> },
) {
  try {
    const { fieldId: fieldIdStr } = await params;
    const fieldId = parseInt(fieldIdStr, 10);
    const field = await getFieldById(fieldId);

    if (!field) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FIELD_NOT_FOUND,
            message: ERROR_MESSAGES.FIELD_NOT_FOUND,
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(field, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("GET /api/forms/[formId]/fields/[fieldId] error:", error);
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
  { params }: { params: Promise<{ formId: string; fieldId: string }> },
) {
  try {
    const { fieldId: fieldIdStr } = await params;
    const fieldId = parseInt(fieldIdStr, 10);
    const { label, type, required, order } = await req.json();

    // Validate that at least one field is being updated
    if (
      label === undefined &&
      type === undefined &&
      required === undefined &&
      order === undefined
    ) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: "At least one field must be provided to update",
          },
        },
        { status: 400 },
      );
    }

    // Check if field exists first
    const existingField = await getFieldById(fieldId);
    if (!existingField) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FIELD_NOT_FOUND,
            message: ERROR_MESSAGES.FIELD_NOT_FOUND,
          },
        },
        { status: 404 },
      );
    }

    const field = await updateField(fieldId, label, type, required, order);

    if (!field) {
      // eslint-disable-next-line no-console
      console.error(
        `Field update returned null for fieldId ${fieldId}. Sent order: ${order}, label: ${label}, type: ${type}, required: ${required}`,
      );
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FIELD_UPDATE_FAILED,
            message: ERROR_MESSAGES.FIELD_UPDATE_FAILED,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(field, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("PATCH /api/forms/[formId]/fields/[fieldId] error:", error);
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
  { params }: { params: Promise<{ formId: string; fieldId: string }> },
) {
  try {
    const { fieldId: fieldIdStr } = await params;
    const fieldId = parseInt(fieldIdStr, 10);
    const field = await deleteField(fieldId);

    if (!field) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FIELD_DELETE_FAILED,
            message: ERROR_MESSAGES.FIELD_DELETE_FAILED,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(field, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("DELETE /api/forms/[formId]/fields/[fieldId] error:", error);
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
