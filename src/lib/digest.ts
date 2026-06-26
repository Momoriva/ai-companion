import { createChatCompletion } from "./openrouter";
import { clampMemoryInput, type MemoryInput } from "./memory-engine";

type DigestOptions = {
  sourceName: string;
  room?: string;
  model?: string;
};

export async function digestDiary(content: string, options: DigestOptions): Promise<ReturnType<typeof clampMemoryInput>[]> {
  const trimmed = content.trim();

  if (trimmed.length <= 30) {
    return [
      clampMemoryInput({
        description: trimmed,
        source: `old-diary:${options.sourceName}`,
        room: options.room
      })
    ];
  }

  const prompt = [
    "把以下日记抽取成结构化记忆 JSON 数组。",
    "规则：1 条 = 1 个主题；去掉口语冗余；零碎信息可合并；ToDo 单列；不要编造。",
    "每项字段：title, description, valence(-1到1), arousal(0到1), importance(1到10), type(memory|anniversary|event)。",
    "只返回 JSON 数组。",
    `日记来源：${options.sourceName}`,
    "日记正文：",
    trimmed
  ].join("\n");

  const reply = await createChatCompletion([{ role: "user", content: prompt }], options.model);
  const parsed = parseJsonArray(reply);

  return parsed.map((item) =>
    clampMemoryInput({
      ...(item as MemoryInput),
      source: `old-diary:${options.sourceName}`,
      room: options.room
    })
  );
}

export function parseJsonArray(text: string): unknown[] {
  const stripped = text.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
  const start = stripped.indexOf("[");
  const end = stripped.lastIndexOf("]");

  if (start < 0 || end < start) {
    throw new Error("Digest response does not contain a JSON array");
  }

  const json = stripped.slice(start, end + 1);
  const parsed = JSON.parse(json);

  if (!Array.isArray(parsed)) {
    throw new Error("Digest JSON is not an array");
  }

  return parsed;
}
