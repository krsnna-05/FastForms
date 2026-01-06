import type { NextRequest, NextResponse } from "next/server";
import { ollama } from "ai-sdk-ollama";
import { streamText } from "ai";

const askQuestion = async (prompt: string) => {
  try {
    const result = streamText({
      model: ollama("ministral-3:3b"),
      prompt: prompt,
      temperature: 0.8,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export async function GET(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.prompt) {
      return new Response(
        JSON.stringify({ error: "No prompt provided in the request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const prompt = body.prompt || "Who are you ?";

    return await askQuestion(prompt);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
