import { NextRequest, NextResponse } from "next/server";
import { googleAuthConfig } from "@/config";
import {
  exchangeCodeForTokens,
  getGoogleUserInfo,
  imgURLtoBlob,
} from "@/services/server/auth/auth";

import { storeImageInAppwrite } from "@/services/server/auth/appwrite";
import { oauth2Client } from "@/providers/googleAuth";
import { checkExistingUser, createUser } from "@/services/server/prisma/User";
import { generateJWT } from "@/services/server/auth/jwt";

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

    // Check if user exists
    const { exists: userExists, userId: existingUserId } =
      await checkExistingUser(userInfo.email);

    let userId: number;

    if (userExists && existingUserId) {
      userId = existingUserId;
    } else {
      // Create new user
      const newUser = await createUser({
        email: userInfo.email,
        name: userInfo.name,
        profileId: fileId, // Using proper Appwrite fileId
        googleId: userInfo.id,
      });
      userId = newUser.id;
    }

    // Generate JWT token
    const token = await generateJWT(userId.toString());

    // Create response with redirect
    const response = NextResponse.redirect(
      new URL("/", request.nextUrl.origin),
    );

    // Set cookies
    response.cookies.set("userId", userId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
