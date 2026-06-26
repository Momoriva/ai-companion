import { siteConfig } from "./site-config";
import type { Message } from "@/types/site";

type OpenRouterMessage = Pick<Message, "role" | "content">;

export async function createChatCompletion(messages: OpenRouterMessage[], modelOverride?: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = modelOverride ?? process.env.OPENROUTER_MODEL;

  if (!apiKey || !model) {
    throw new Error("Missing OPENROUTER_API_KEY or OPENROUTER_MODEL");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_SITE_NAME ?? "AI Companion Website"
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: [
            `你是 ${siteConfig.name}，但不要机械重复自己的名字。`,
            `人物简介：${siteConfig.bio}`,
            `Persona：${siteConfig.persona}`,
            `世界观：${siteConfig.worldview}`,
            "保持温柔、自然、简洁，像长期陪伴用户的 AI 伴侣。"
          ].join("\n")
        },
        ...messages
      ],
      temperature: 0.8
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "OpenRouter request failed");
  }

  const data = await response.json();
  return String(data.choices?.[0]?.message?.content ?? "");
}
