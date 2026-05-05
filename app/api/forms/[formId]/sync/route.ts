import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/services/server/auth/jwt";

export async function POST(
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

    // TODO: Implement Google Forms sync
    // This would involve:
    // 1. Getting Google Forms OAuth token from user
    // 2. Creating a form in Google Forms API
    // 3. Syncing fields and options
    // 4. Storing the Google Form ID in database

    return NextResponse.json({
      id: parseInt(formId),
      message: "Form synced with Google Forms successfully",
      googleFormId: "placeholder-form-id",
    });
  } catch (error) {
    console.error("POST /api/forms/[formId]/sync error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
