import googleFormsService from "@/services/googleFormsService";
import { verifyToken, extractToken } from "@/lib/jwt";
import appwriteService from "@/services/appwriteService";

export async function GET(req: Request) {
  try {
    // Extract authorization header
    const authHeader = req.headers.get("authorization");
    const token = extractToken(authHeader);

    // Verify token exists
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: No token provided" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify JWT token
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid or expired token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract userId from URL query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    // Validate userId is provided
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Bad request: userId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify that token userId matches request userId for security
    if (payload.userId !== userId) {
      return new Response(
        JSON.stringify({ error: "Forbidden: User ID mismatch" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch forms from Appwrite
    const formsData = await appwriteService.getFormsByUserId(userId);

    if (!formsData) {
      return new Response(JSON.stringify({ error: "Failed to fetch forms" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return forms with count
    return new Response(
      JSON.stringify({
        success: true,
        count: formsData.total || 0,
        forms: formsData.rows || [],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching forms:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
