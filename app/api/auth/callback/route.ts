import { NextRequest, NextResponse } from "next/server";
import { googleAuthConfig } from "@/config";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

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

    // Exchange authorization code for tokens with Google
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: googleAuthConfig.google_auth_client,
        client_secret: googleAuthConfig.google_auth_client_secret,
        redirect_uri: googleAuthConfig.google_auth_redirect_url,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error("Token exchange failed:", error);
      return NextResponse.json(
        { error: "Token exchange failed", details: error },
        { status: 400 },
      );
    }

    const tokens = await tokenResponse.json();

    // Get user info from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status: 400 },
      );
    }

    const userInfo = await userResponse.json();

    // TODO: Store user in database and create session
    // For now, we'll just return success
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        },
      },
      { status: 200 },
    );

    // Set authentication cookies if needed
    // response.cookies.set("auth-token", tokens.access_token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: tokens.expires_in,
    // });

    return response;
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
