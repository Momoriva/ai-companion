import type { Memory, MemorySettings } from "@/types/site";

export const defaultMemorySettings: MemorySettings = {
  room: "default",
  decay_lambda: 0.015,
  recall_limit: 6,
  pinned_limit: 4,
  knowledge_limit: 5,
  knowledge_similarity_threshold: 0.3,
  default_digest_model: "anthropic/claude-3.5-sonnet"
};

export type MemoryInput = {
  title?: string;
  description: string;
  happened_at?: string;
  type?: Memory["type"];
  valence?: number;
  arousal?: number;
  importance?: number;
  is_pinned?: boolean;
  is_resolved?: boolean;
  is_active?: boolean;
  source?: string;
  author?: string;
  room?: string;
};

export function clampMemoryInput(input: MemoryInput) {
  const description = input.description.trim();

  return {
    title: (input.title?.trim() || description.slice(0, 28) || "Untitled memory"),
    description,
    happened_at: input.happened_at ?? new Date().toISOString().slice(0, 10),
    type: input.type ?? "memory",
    valence: clamp(input.valence ?? 0, -1, 1),
    arousal: clamp(input.arousal ?? 0.35, 0, 1),
    importance: Math.round(clamp(input.importance ?? 5, 1, 10)),
    is_pinned: input.is_pinned ?? false,
    is_resolved: input.is_resolved ?? false,
    is_active: input.is_active ?? true,
    source: input.source ?? "manual",
    author: input.author ?? "user",
    room: input.room ?? "default",
    embedding: null
  };
}

export function scoreMemory(memory: Memory, settings: MemorySettings = defaultMemorySettings): number {
  if (!memory.is_active) {
    return -Infinity;
  }

  if (memory.is_pinned) {
    return 1000 + memory.importance;
  }

  const lastActivated = memory.last_activated_at ? new Date(memory.last_activated_at) : new Date(memory.happened_at);
  const ageDays = Math.max(0, (Date.now() - lastActivated.getTime()) / 86400000);
  const decay = Math.exp(-settings.decay_lambda * ageDays);
  const emotionalIntensity = (Math.abs(memory.valence) + memory.arousal) / 2;
  const activationBoost = Math.log1p(memory.activation_count);
  const resolvedPenalty = memory.is_resolved ? 0.35 : 1;

  return (memory.importance * 1.8 + activationBoost + emotionalIntensity * 3) * decay * resolvedPenalty;
}

export function selectActiveMemories(memories: Memory[], settings: MemorySettings = defaultMemorySettings) {
  const active = memories.filter((memory) => memory.is_active);
  const pinned = active
    .filter((memory) => memory.is_pinned)
    .sort((a, b) => b.importance - a.importance)
    .slice(0, settings.pinned_limit);

  const recalled = active
    .filter((memory) => !memory.is_pinned)
    .map((memory) => ({ memory, score: scoreMemory(memory, settings) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, settings.recall_limit)
    .map(({ memory }) => memory);

  return { pinned, recalled };
}

export function memoryContextBlock(memories: Memory[], settings: MemorySettings = defaultMemorySettings): string {
  const { pinned, recalled } = selectActiveMemories(memories, settings);
  const pinnedText = pinned.map((memory) => `- [PIN][${memory.importance}/10] ${memory.description}`).join("\n");
  const recalledText = recalled.map((memory) => `- [${memory.importance}/10] ${memory.description}`).join("\n");

  return [
    pinnedText ? "置顶记忆：\n" + pinnedText : "",
    recalledText ? "主动浮现记忆：\n" + recalledText : ""
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function chunkText(content: string, chunkSize = 900, overlap = 120): string[] {
  const normalized = content.replace(/\r\n/g, "\n").trim();

  if (!normalized) {
    return [];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    const end = Math.min(normalized.length, start + chunkSize);
    chunks.push(normalized.slice(start, end).trim());

    if (end === normalized.length) {
      break;
    }

    start = Math.max(0, end - overlap);
  }

  return chunks.filter(Boolean);
}

export function isDiaryMemorySource(source: string) {
  return source.startsWith("old-diary:");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
