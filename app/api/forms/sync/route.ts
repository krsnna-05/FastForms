// api route to sync current google form structure to google forms

import { extractToken, verifyToken } from "@/lib/jwt";
import { buildGoogleFormRequestBody } from "../../chat/utils";
import googleFormsService from "@/services/googleFormsService";

export async function POST(req: Request) {
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
    0;
    return new Response(
      JSON.stringify({ error: "Unauthorized: Invalid or expired token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json();

  const formId = body.formId;
  const userId = payload.userId;
  const form = body.form;

  if (!formId || !userId) {
    return new Response(
      JSON.stringify({ error: "Bad request: formId or userId is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const googleFormService = new googleFormsService();

  await googleFormService.initialize(userId);

  const googleFormBody = buildGoogleFormRequestBody(form);

  console.log(
    "Google Form Request Body:",
    JSON.stringify(googleFormBody, null, 2)
  );

  try {
    // Update the Google Form with the new structure
    const result = await googleFormService.createform({
      requestBody: {
        info: {
          title: form.formTitle,
          documentTitle: form.formTitle,
        },
      },
    });

    const googleFormId = result.data.formId;

    const updateFormRes = await googleFormService.updateForm(googleFormId!, {
      requestBody: {
        includeFormInResponse: true,
        requests: [
          {
            updateFormInfo: {
              info: {
                description: form.formDescription,
              },
              updateMask: "description",
            },
          },
          ...googleFormBody.requests,
        ],
      },
    });

    console.log("Google Form synced successfully:", result);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Form synced successfully",
        result,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error syncing form:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to sync form to Google Forms",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
