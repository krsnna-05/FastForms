import type { NextRequest } from "next/server";
import { verifyToken, extractToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = extractToken(authHeader);

    if (!token) {
      return new Response(
        JSON.stringify({ error: "No token provided", authenticated: false }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(
        JSON.stringify({
          error: "Invalid or expired token",
          authenticated: false,
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        authenticated: true,
        user: payload,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message, authenticated: false }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
