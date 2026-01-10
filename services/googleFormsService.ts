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

    try {
      this.forms = getGoogleFormsProvider(user.accessToken as string);
    } catch (error) {
      throw new Error("Failed to initialize Google Forms API");
    }
  }

  createform = (data: forms_v1.Params$Resource$Forms$Create) => {
    if (!this.forms) {
      throw new Error("Google Forms service not initialized");
    }

    return this.forms.create({
      requestBody: data.requestBody,
    });
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
