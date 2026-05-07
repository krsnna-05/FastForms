import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/services/server/auth/jwt";
import { getFormById, updateFormMetadata } from "@/services/server/prisma/Form";
import { ERROR_CODES, ERROR_MESSAGES } from "@/lib/errorCodes";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    const userIdCookie = request.cookies.get("userId")?.value;

    if (!token || !userIdCookie) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.MISSING_CREDENTIALS,
            message: ERROR_MESSAGES.MISSING_CREDENTIALS,
          },
        },
        { status: 401 },
      );
    }

    // Verify JWT token
    const decoded = await verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_TOKEN,
            message: ERROR_MESSAGES.INVALID_TOKEN,
          },
        },
        { status: 401 },
      );
    }

    const { formId } = await params;
    const form = await getFormById(parseInt(formId));

    if (!form) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORM_NOT_FOUND,
            message: ERROR_MESSAGES.FORM_NOT_FOUND,
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("GET /api/forms/[formId] error:", error);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    const userIdCookie = request.cookies.get("userId")?.value;

    if (!token || !userIdCookie) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.MISSING_CREDENTIALS,
            message: ERROR_MESSAGES.MISSING_CREDENTIALS,
          },
        },
        { status: 401 },
      );
    }

    // Verify JWT token
    const decoded = await verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_TOKEN,
            message: ERROR_MESSAGES.INVALID_TOKEN,
          },
        },
        { status: 401 },
      );
    }

    const userId = parseInt(userIdCookie);
    const { formId } = await params;
    const formIdNum = parseInt(formId);
    const body = await request.json();

    const { title, description, fields } = body;

    // Verify user owns this form
    const existingForm = await getFormById(formIdNum);

    if (!existingForm) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORM_NOT_FOUND,
            message: ERROR_MESSAGES.FORM_NOT_FOUND,
          },
        },
        { status: 404 },
      );
    }

    if (existingForm.creatorId !== userId) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORM_NOT_OWNED,
            message: ERROR_MESSAGES.FORM_NOT_OWNED,
          },
        },
        { status: 403 },
      );
    }

    // Save directly to database
    const updatedForm = await updateFormMetadata(formIdNum, title, description);

    if (!updatedForm) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORM_UPDATE_FAILED,
            message: ERROR_MESSAGES.FORM_UPDATE_FAILED,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error("PUT /api/forms/[formId] error:", error);
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
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    const userIdCookie = request.cookies.get("userId")?.value;

    if (!token || !userIdCookie) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.MISSING_CREDENTIALS,
            message: ERROR_MESSAGES.MISSING_CREDENTIALS,
          },
        },
        { status: 401 },
      );
    }

    // Verify JWT token
    const decoded = await verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_TOKEN,
            message: ERROR_MESSAGES.INVALID_TOKEN,
          },
        },
        { status: 401 },
      );
    }

    const userId = parseInt(userIdCookie);
    const { formId } = await params;
    const formIdNum = parseInt(formId);
    const body = await request.json();

    const { title, description } = body;

    // Verify user owns this form
    const existingForm = await getFormById(formIdNum);

    if (!existingForm) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORM_NOT_FOUND,
            message: ERROR_MESSAGES.FORM_NOT_FOUND,
          },
        },
        { status: 404 },
      );
    }

    if (existingForm.creatorId !== userId) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORM_NOT_OWNED,
            message: ERROR_MESSAGES.FORM_NOT_OWNED,
          },
        },
        { status: 403 },
      );
    }

    // Update form metadata only
    const updatedForm = await updateFormMetadata(formIdNum, title, description);

    if (!updatedForm) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORM_UPDATE_FAILED,
            message: ERROR_MESSAGES.FORM_UPDATE_FAILED,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error("PATCH /api/forms/[formId] error:", error);
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
