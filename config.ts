interface googleAuthConfigType {
  google_auth_client: string;
  google_auth_client_secret: string;
  google_auth_redirect_url: string;
}

export const googleAuthConfig: googleAuthConfigType = {
  google_auth_client: process.env.GOOGLE_AUTH_CLIENT_ID || "",
  google_auth_client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET || "",
  google_auth_redirect_url: process.env.GOOGLE_AUTH_REDIRECT_URL || "",
};

export const appwriteConfig = {
  appwrite_endpoint: process.env.APPWRITE_ENDPOINT || "",
  appwrite_project_id: process.env.APPWRITE_PROJECT_ID || "",
  appwrite_api_key: process.env.APPWRITE_API_KEY || "",
  appwrite_bucket_id: process.env.APPWRITE_BUCKET_ID || "",
};

export const jwtConfig = {
  jwt_key: process.env.JWT_KEY || "",
  jwt_passphrase: process.env.JWT_PASSPRASE || "",
  jwt_secret: {
    key: process.env.JWT_KEY || "",
    passphrase: process.env.JWT_PASSPRASE || "",
  },
  jwt_expiration: process.env.JWT_EXPIRATION || "1h",
};

export const databaseURL = process.env.DATABASE_URL || "";
