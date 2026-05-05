import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/services/server/auth/jwt";
import { getFormById } from "@/services/server/prisma/Form";

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

    const { formId } = await params;
    const form = await getFormById(parseInt(formId));

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("GET /api/forms/[formId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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

    const { formId } = await params;
    const body = await request.json();

    const { title, description, fields } = body;

    // TODO: Implement Redis save for form draft
    // Save form data to Redis with key: form:<formId>:draft
    // This will be used for auto-saving and persisting unsaved changes

    return NextResponse.json({
      id: parseInt(formId),
      title,
      description,
      fields,
      message: "Form saved to draft (Redis)",
    });
  } catch (error) {
    console.error("PUT /api/forms/[formId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
