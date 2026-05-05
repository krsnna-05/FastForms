import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/services/server/auth/jwt";
import { prisma } from "@/providers/prisma";
import { appwriteConfig } from "@/config";

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

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userIdCookie) },
      select: {
        id: true,
        name: true,
        email: true,
        profileImgId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build Appwrite image URL
    let profileImageUrl: string | null = null;

    if (user.profileImgId) {
      profileImageUrl = `${appwriteConfig.appwrite_endpoint}/storage/buckets/${appwriteConfig.appwrite_bucket_id}/files/${user.profileImgId}/preview?project=${appwriteConfig.appwrite_project_id}`;
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      profileImgId: user.profileImgId,
      profileImageUrl,
    });
  } catch (error) {
    console.error("GET /me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
