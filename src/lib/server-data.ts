import { fallbackMemories, fallbackMoments } from "./mock-data";
import { defaultMemorySettings } from "./memory-engine";
import { supabase } from "./supabase";
import type { Memory, MemorySettings, Moment } from "@/types/site";

export async function getMoments(): Promise<Moment[]> {
  if (!supabase) {
    return fallbackMoments;
  }

  const { data, error } = await supabase
    .from("moments")
    .select("id, content, image_url, likes_count, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return error || !data?.length ? fallbackMoments : data;
}

export async function getMemories(): Promise<Memory[]> {
  if (!supabase) {
    return fallbackMemories;
  }

  const { data, error } = await supabase
    .from("memories")
    .select("id, title, description, happened_at, type, valence, arousal, importance, is_pinned, is_resolved, is_active, source, author, activation_count, last_activated_at, room")
    .order("happened_at", { ascending: false })
    .limit(20);

  return error || !data?.length ? fallbackMemories : data;
}

export async function getRoomMemories(room = "default"): Promise<Memory[]> {
  if (!supabase) {
    return fallbackMemories;
  }

  const { data, error } = await supabase
    .from("memories")
    .select("id, title, description, happened_at, type, valence, arousal, importance, is_pinned, is_resolved, is_active, source, author, activation_count, last_activated_at, room")
    .eq("room", room)
    .eq("is_active", true)
    .limit(100);

  return error ? fallbackMemories : data ?? [];
}

export async function getMemorySettings(room = "default"): Promise<MemorySettings> {
  if (!supabase) {
    return defaultMemorySettings;
  }

  const { data, error } = await supabase
    .from("memory_settings")
    .select("room, decay_lambda, recall_limit, pinned_limit, knowledge_limit, knowledge_similarity_threshold, default_digest_model")
    .eq("room", room)
    .maybeSingle();

  return error || !data ? defaultMemorySettings : data;
}
