import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/services/server/auth/jwt";
import {
  getFormsForUser,
  createFormWithFields,
  deleteFormById,
} from "@/services/server/prisma/Form";
import dummyForm from "@/dummyform.json";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    const userIdCookie = request.cookies.get("userId")?.value;

    if (!token || !userIdCookie) {
      return NextResponse.json(
        { error: "Unauthorized: Missing authentication credentials" },
        { status: 401 },
      );
    }

    // Verify JWT token
    const decoded = await verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
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
      { error: "Internal server error" },
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
        { error: "Unauthorized: Missing authentication credentials" },
        { status: 401 },
      );
    }

    // Verify JWT token
    const decoded = await verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
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
        { error: "Failed to create form" },
        { status: 500 },
      );
    }

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error("POST /api/forms error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
        { error: "Unauthorized: Missing authentication credentials" },
        { status: 401 },
      );
    }

    // Verify JWT token
    const decoded = await verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 },
      );
    }

    // Get form ID from query string
    const url = new URL(request.url);
    const formId = url.searchParams.get("id");

    if (!formId) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 },
      );
    }

    const form = await deleteFormById(parseInt(formId));

    if (!form) {
      return NextResponse.json(
        { error: "Failed to delete form" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/forms error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
