import { ollama, streamText } from "ai-sdk-ollama";

const askQuestion = async (prompt: string) => {
  const result = await streamText({
    model: ollama("ministral-3:3b"),
    prompt: prompt,
    temperature: 0.8,
  });

  return;
};

askQuestion("Who are you ?");
