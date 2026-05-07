import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/services/server/auth/jwt";
import {
  getFormsForUser,
  getFormById,
  createFormWithFields,
  deleteFormById,
} from "@/services/server/prisma/Form";
import { ERROR_CODES } from "@/lib/errorCodes";
import dummyForm from "@/dummyform.json";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    const userIdCookie = request.cookies.get("userId")?.value;

    if (!token || !userIdCookie) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.MISSING_CREDENTIALS,
            message: "Missing authentication credentials",
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
            message: "Your session has expired",
          },
        },
        { status: 401 },
      );
    }

    // Get forms for the user
    const userId = parseInt(userIdCookie);
    const forms = await getFormsForUser(userId);

    return NextResponse.json(forms);
  } catch (error) {
    console.error("GET /api/forms error:", error);
    return NextResponse.json(
      {
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: "Internal server error",
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    const userIdCookie = request.cookies.get("userId")?.value;

    if (!token || !userIdCookie) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.MISSING_CREDENTIALS,
            message: "Missing authentication credentials",
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
            message: "Your session has expired",
          },
        },
        { status: 401 },
      );
    }

    const userId = parseInt(userIdCookie);

    // Create form with dummy data
    const form = await createFormWithFields(
      userId,
      dummyForm.title,
      dummyForm.description || null,
      dummyForm.fields as any,
    );

    if (!form) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORM_CREATE_FAILED,
            message: "Failed to create form",
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error("POST /api/forms error:", error);
    return NextResponse.json(
      {
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: "Internal server error",
        },
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    const userIdCookie = request.cookies.get("userId")?.value;

    if (!token || !userIdCookie) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.MISSING_CREDENTIALS,
            message: "Missing authentication credentials",
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
            message: "Your session has expired",
          },
        },
        { status: 401 },
      );
    }

    // Get form ID from query string
    const url = new URL(request.url);
    const formId = url.searchParams.get("id");

    if (!formId) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: "Form ID is required",
          },
        },
        { status: 400 },
      );
    }

    const userId = parseInt(userIdCookie);
    const formIdNum = parseInt(formId);

    // Verify user owns this form
    const existingForm = await getFormById(formIdNum);

    if (!existingForm) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORM_NOT_FOUND,
            message: "Form not found",
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
            message: "You do not have permission to delete this form",
          },
        },
        { status: 403 },
      );
    }

    const form = await deleteFormById(formIdNum);

    if (!form) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORM_DELETE_FAILED,
            message: "Failed to delete form",
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/forms error:", error);
    return NextResponse.json(
      {
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: "Internal server error",
        },
      },
      { status: 500 },
    );
  }
}
