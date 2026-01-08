import googleFormsService from "@/services/googleFormsService";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const formId = url.searchParams.get("formId");
  const userId = url.searchParams.get("userId");

  if (!formId) {
    return new Response(
      JSON.stringify({ error: "No formId provided in the request" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const formService = new googleFormsService();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "No userId provided in the request" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await formService.initialize(userId);

    const form = await formService.getform(formId);

    return new Response(JSON.stringify(form.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in GET /api/forms:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
