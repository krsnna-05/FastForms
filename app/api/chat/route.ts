import type { NextRequest, NextResponse } from "next/server";
import { ollama } from "ai-sdk-ollama";
import { convertToModelMessages, streamText, UIMessage } from "ai";

const askQuestion = async (prompt: UIMessage[]) => {
  try {
    const result = streamText({
      model: ollama("ministral-3:3b"),
      prompt: await convertToModelMessages(prompt),
      temperature: 0.8,
      system: "You are a helpful assistant. who always answers in english.",
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

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

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

    return await askQuestion(prompt);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
