import { createGoogleAuthUrl } from "@/services/server/auth/googleAuth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const authUrl = createGoogleAuthUrl();
    console.log("Generated Google auth URL:", authUrl);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 },
    );
  }
}
