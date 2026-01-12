import GoogleAuthService from "@/services/AuthService";
import AppwriteService from "@/services/appwriteService";
import { googleAuthScopes } from "@/providers/googleAuth";
import { generateToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const code = req.headers.get("code")?.split(" ")[1] || "";

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error_state: "invalid_code",
          message: "Authorization code is missing",
        },
        { status: 400 }
      );
    }

    // Get tokens from authorization code
    const res = await GoogleAuthService.getToken(code);

    if (!res?.tokens) {
      return NextResponse.json(
        {
          success: false,
          error_state: "token_fetch_failed",
          message: "Failed to fetch token",
        },
        { status: 400 }
      );
    }

    // Verify required scopes
    const formsScope = res.tokens.scope?.includes(googleAuthScopes[2]);

    if (!formsScope) {
      return NextResponse.json(
        {
          success: false,
          error_state: "scopes_not_granted:forms",
        },
        { status: 400 }
      );
    }

    // Set credentials and fetch user info
    GoogleAuthService.setCredentials(res.tokens);
    const userInfo = await GoogleAuthService.getUserInfo();

    if (!userInfo) {
      return NextResponse.json(
        {
          success: false,
          error_state: "user_info_fetch_failed",
          message: "Failed to fetch user info",
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = await AppwriteService.userExists(userInfo.email!);

    // Calculate token expiry date
    const expiryDate = res.tokens.expiry_date
      ? new Date(res.tokens.expiry_date).toISOString()
      : null;

    console.log("User exists response:", userExists);
    console.log("Token expiry date:", expiryDate);
    console.log("Token data:", {
      accessToken: res.tokens.access_token,
      refreshToken: res.tokens.refresh_token,
      expiryDate: res.tokens.expiry_date,
    });

    // Create or update user with tokens
    if (userExists && userExists.total === 0) {
      await AppwriteService.createUser({
        name: userInfo.name || "",
        email: userInfo.email || "",
        refreshToken: res.tokens.refresh_token || "",
        accessToken: res.tokens.access_token || "",
        profilePhotoUrl: userInfo.picture || "",
      });

      console.log("New user created with tokens");
    } else {
      const userId = userExists?.rows[0].$id;

      if (!userId)
        return NextResponse.json(
          { success: false, message: "User ID not found" },
          { status: 400 }
        );

      await AppwriteService.updateUser(userId, {
        refreshToken: res.tokens.refresh_token || "",
        accessToken: res.tokens.access_token || "",
      });

      console.log("Existing user updated with new tokens for ID:", userId);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Token fetched successfully",
        token: generateToken({
          userId: userInfo.id!,
          email: userInfo.email!,
          name: userInfo.name!,
        }),
        user: {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in auth callback:", error);
    return NextResponse.json(
      {
        success: false,
        error_state: "internal_server_error",
        message: "An error occurred during authentication",
      },
      { status: 500 }
    );
  }
}
