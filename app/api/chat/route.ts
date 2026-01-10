import type { NextRequest, NextResponse } from "next/server";
import { generateText, ollama } from "ai-sdk-ollama";
import { convertToModelMessages, Output, streamText, UIMessage } from "ai";
import systemPrompt from "@/systemPrompt.json";
import z from "zod";
import { buildGoogleFormRequestBody } from "./utils";

const askQuestion = async (
  prompt: UIMessage[],
  promptType: "create" | "update"
) => {
  if (promptType !== "create") {
    return new Response(JSON.stringify({ error: "Unsupported prompt type" }), {
      status: 400,
    });
  }

  const schema = z.object({
    message: z.string().describe("A brief message confirming form creation"),
    formTitle: z.string(),
    form: z.array(
      z.object({
        type: z.enum([
          "short_text",
          "long_text",
          "multiple_choice",
          "checkboxes",
        ]),
        question: z.string(),
        required: z.boolean(),
        options: z.array(z.string()).optional(),
      })
    ),
  });

  const output = await generateText({
    model: ollama("ministral-3:3b"),
    output: Output.object({ schema }),
    messages: prompt,
    system: systemPrompt.systemPromptForCreateForm.content,
  });

  const formData = schema.safeParse(JSON.parse(output.text));
  if (!formData.success) {
    return new Response(
      JSON.stringify({
        error: "Failed to parse form data",
        details: formData.error,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const requestBody = buildGoogleFormRequestBody(formData.data);

  return new Response(JSON.stringify(requestBody, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      promptType,
    }: { messages: UIMessage[]; promptType: "create" | "update" } =
      await req.json();

    if (!messages) {
      return new Response(
        JSON.stringify({ error: "No prompt provided in the request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const prompt = messages || "Who are you ?";

    return await askQuestion(prompt, promptType);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
