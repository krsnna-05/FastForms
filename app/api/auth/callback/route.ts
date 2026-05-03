import { NextRequest, NextResponse } from "next/server";
import { googleAuthConfig } from "@/config";
import {
  exchangeCodeForTokens,
  getGoogleUserInfo,
  imgURLtoBlob,
  storeImageInAppwrite,
} from "@/services/server/auth/auth";
import { oauth2Client } from "@/providers/googleAuth";

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "No authorization code provided" },
        { status: 400 },
      );
    }

    if (
      !googleAuthConfig.google_auth_client ||
      !googleAuthConfig.google_auth_client_secret
    ) {
      console.error("Missing Google OAuth configuration");
      return NextResponse.json(
        { error: "OAuth configuration not set" },
        { status: 500 },
      );
    }

    const tokens = await exchangeCodeForTokens(code);

    if (!tokens || !tokens.access_token) {
      return NextResponse.json(
        { error: "Failed to obtain access token" },
        { status: 400 },
      );
    }

    const userInfo = await getGoogleUserInfo(oauth2Client, tokens);

    if (!userInfo) {
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status: 400 },
      );
    }

    const fileBlob = await imgURLtoBlob(userInfo.picture || "");
    const fileName = `profile_${userInfo.email}.jpg`;

    const fileId = await storeImageInAppwrite({ imgBlob: fileBlob, fileName });

    const response = NextResponse.redirect("/");

    return response;
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
