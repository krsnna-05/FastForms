import type { NextRequest, NextResponse } from "next/server";
import { generateText, ollama } from "ai-sdk-ollama";
import { convertToModelMessages, Output, streamText, UIMessage } from "ai";
import systemPrompt from "@/systemPrompt.json";
import z from "zod";
import { buildGoogleFormRequestBody } from "./utils";
import googleFormsService from "@/services/googleFormsService";
import { useId } from "react";

const askQuestion = async (
  prompt: UIMessage[],
  promptType: "create" | "update",
  userId: string
) => {
  if (promptType !== "create") {
    return new Response(JSON.stringify({ error: "Unsupported prompt type" }), {
      status: 400,
    });
  }

  console.log("Creating Google Form...", userId, prompt);

  const googleFormService = new googleFormsService();
  await googleFormService.initialize(userId);

  const schema = z.object({
    formTitle: z.string(),
    formDescription: z.string(),
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
    messages: await convertToModelMessages(prompt),
    system: systemPrompt.systemPromptForCreateForm.content,
  });

  console.log("LLM Output:", JSON.parse(output.text));

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
  return new Response(
    JSON.stringify(
      {
        success: true,
        form: formData.data,
      },
      null,
      2
    ),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      promptType,
      userId,
    }: {
      messages: UIMessage[];
      promptType: "create" | "update";
      userId: string;
    } = await req.json();

    if (!messages) {
      return new Response(
        JSON.stringify({ error: "No prompt provided in the request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return await askQuestion(messages, promptType, userId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
