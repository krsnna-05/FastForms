import getGoogleFormsProvider from "@/providers/googleForms";
import { oauth2Client, googleAuthScopes } from "@/providers/googleAuth";
import appwriteService from "./appwriteService";
import { google } from "googleapis";
import type { forms_v1 } from "googleapis";

class googleFormsService {
  private forms: forms_v1.Resource$Forms | null;
  private oauth2client;

  constructor() {
    this.forms = null;
    this.oauth2client = oauth2Client;
  }

  async initialize(userId: string) {
    console.log("Initializing Google Forms Service for user:", userId);

    const user = await appwriteService.getUserById(userId);

    if (!user || !user.accessToken) {
      throw new Error("User not found or missing access token");
    }

    console.log("User found. Attempting to fetch form with access token");

    // Use the access token directly without refresh
    // This ensures we use the exact token the user granted scopes for
    try {
      this.forms = getGoogleFormsProvider(user.accessToken as string);
      console.log("Google Forms API initialized successfully");
    } catch (error) {
      console.log("Error initializing Google Forms API:", error);
      throw new Error("Failed to initialize Google Forms API");
    }
  }

  setCred = (credentials: any) => {
    this.oauth2client.setCredentials(credentials);
  };

  createform = () => {
    console.log("form created");
  };

  getform = (formId: string) => {
    if (!this.forms) {
      throw new Error("Google Forms service not initialized");
    }

    return this.forms.get({
      formId: formId,
    });
  };
}

export default googleFormsService;
