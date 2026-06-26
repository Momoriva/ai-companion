import type { NextApiRequest, NextApiResponse } from "next";
import { createEmbedding } from "@/lib/embeddings";
import { memoryContextBlock } from "@/lib/memory-engine";
import { createChatCompletion } from "@/lib/openrouter";
import { getMemorySettings, getRoomMemories } from "@/lib/server-data";
import { supabase } from "@/lib/supabase";
import type { Message } from "@/types/site";

type ChatResponse = {
  message?: Message;
  error?: string;
};

type IncomingMessage = {
  role?: Message["role"];
  content?: unknown;
};

function isIncomingChatMessage(message: IncomingMessage): message is { role: Message["role"]; content: string } {
  return Boolean(message.role && typeof message.content === "string" && message.content.trim());
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ChatResponse>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const messages: IncomingMessage[] = Array.isArray(req.body.messages) ? req.body.messages : [];
    const normalizedMessages = messages
      .filter(isIncomingChatMessage)
      .map((message) => ({
        role: message.role,
        content: message.content
      }));

    if (!normalizedMessages.length) {
      return res.status(400).json({ error: "Missing messages" });
    }

    const room = String(req.body.room ?? "default");
    const latestUserMessage = normalizedMessages[normalizedMessages.length - 1];
    const settings = await getMemorySettings(room);
    const memories = await getRoomMemories(room);
    const memoryContext = memoryContextBlock(memories, settings);
    let knowledgeContext = "";

    if (supabase && latestUserMessage?.content) {
      try {
        const embedding = await createEmbedding(latestUserMessage.content);
        const { data } = await supabase.rpc("match_knowledge_chunks", {
          query_embedding: embedding,
          match_room: room,
          match_count: settings.knowledge_limit,
          similarity_threshold: settings.knowledge_similarity_threshold
        });

        knowledgeContext = Array.isArray(data)
          ? data.map((chunk) => `- [${chunk.source_name}] ${chunk.content}`).join("\n")
          : "";
      } catch {
        knowledgeContext = "";
      }
    }

    const contextMessage = [memoryContext ? `记忆上下文：\n${memoryContext}` : "", knowledgeContext ? `日记/知识库检索：\n${knowledgeContext}` : ""]
      .filter(Boolean)
      .join("\n\n");

    const reply = await createChatCompletion([
      ...(contextMessage ? [{ role: "system" as const, content: contextMessage }] : []),
      ...normalizedMessages
    ]);
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: reply,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      await supabase.from("messages").insert([
        {
          role: latestUserMessage.role,
          content: latestUserMessage.content,
          model: process.env.OPENROUTER_MODEL
        },
        {
          role: "assistant",
          content: reply,
          model: process.env.OPENROUTER_MODEL
        }
      ]);
    }

    return res.status(200).json({ message: assistantMessage });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected chat error";
    return res.status(500).json({ error: message });
  }
}
