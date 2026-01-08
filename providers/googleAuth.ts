import { google } from "googleapis";
import { googleAuthConfig } from "@/config";

export const oauth2Client = new google.auth.OAuth2(
  googleAuthConfig.google_auth_client,
  googleAuthConfig.google_auth_client_secret,
  googleAuthConfig.googl_auth_redirect_url
);

export const googleAuthScopes = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/forms.body",
];
