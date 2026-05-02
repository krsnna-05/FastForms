import type { NextResponse } from "next/server";

export async function GET() {
  return new Response(
    JSON.stringify({
      mes: "Hello World",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

import { ollama } from "ai-sdk-ollama";
import { streamText } from "ai";

export const askQuestion = (prompt: string, res: NextResponse) => {
  const result = streamText({
    model: ollama("ministral-3:3b"),
    prompt: prompt,
    temperature: 0.8,
  });

  return result.toUIMessageStreamResponse(res);
};
