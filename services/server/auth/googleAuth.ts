import { oauth2Client, googleAuthScopes } from "@/providers/googleAuth";

// Creates the Google OAuth consent URL for the current client configuration.
export const createGoogleAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: googleAuthScopes,
    include_granted_scopes: true,
  });
};
