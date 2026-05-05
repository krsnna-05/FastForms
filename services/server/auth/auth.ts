import { appwriteConfig } from "@/config";
import { storage } from "@/providers/appwrite";
import { oauth2Client, googleAuthScopes } from "@/providers/googleAuth";
import type { Credentials, OAuth2Client } from "google-auth-library";
import { ID } from "node-appwrite";

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string | null;
}

// Creates the Google OAuth consent URL for the current client configuration.
export const createGoogleAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: googleAuthScopes,
    include_granted_scopes: true,
  });
};

export const exchangeCodeForTokens = async (code: string) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    return tokens;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    throw new Error("Failed to exchange code for tokens");
  }
};

export const getGoogleUserInfo = async (
  oAuthClient: typeof oauth2Client,
  tokens: Credentials,
): Promise<GoogleUserInfo> => {
  try {
    oAuthClient.setCredentials(tokens);

    const response = await oAuthClient.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const userInfo = response.data as {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };

    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture || null,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to fetch user info");
  }
};

export const imgURLtoBlob = async (url: string): Promise<Blob> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error converting image URL to Blob:", error);
    throw new Error("Failed to convert image URL to Blob");
  }
};
