import type { NextApiRequest, NextApiResponse } from "next";
import { createEmbedding } from "@/lib/embeddings";
import { clampMemoryInput } from "@/lib/memory-engine";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!supabase) {
    return res.status(503).json({ error: "Supabase is not configured" });
  }

  if (req.method === "GET") {
    const room = String(req.query.room ?? "default");
    const status = String(req.query.status ?? "active");
    const source = String(req.query.source ?? "all");
    const search = String(req.query.search ?? "").trim();
    const sort = String(req.query.sort ?? "importance");
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.min(50, Math.max(5, Number(req.query.pageSize ?? 20)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from("memories").select("*", { count: "exact" }).eq("room", room);

    if (status === "archived") {
      query = query.eq("is_active", false);
    } else {
      query = query.eq("is_active", true);
    }

    if (source === "diary") {
      query = query.like("source", "old-diary:%");
    } else if (source === "other") {
      query = query.not("source", "like", "old-diary:%");
    }

    if (search) {
      query = query.or(`description.ilike.%${search}%,title.ilike.%${search}%,source.ilike.%${search}%,author.ilike.%${search}%`);
    }

    query = sort === "latest"
      ? query.order("created_at", { ascending: false })
      : query.order("importance", { ascending: false }).order("created_at", { ascending: false });

    const { data, error, count } = await query.range(from, to);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ memories: data ?? [], count: count ?? 0 });
  }

  if (req.method === "POST") {
    const payload = clampMemoryInput(req.body);
    let embedding = null;

    if (req.body.embed === true) {
      try {
        embedding = await createEmbedding(payload.description);
      } catch {
        embedding = null;
      }
    }

    const { data, error } = await supabase
      .from("memories")
      .insert({ ...payload, embedding })
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ memory: data });
  }

  if (req.method === "PUT") {
    const id = String(req.body.id ?? "");

    if (!id) {
      return res.status(400).json({ error: "Missing memory id" });
    }

    const payload = clampMemoryInput(req.body);
    const { data, error } = await supabase
      .from("memories")
      .update({ ...payload, embedding: null })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ memory: data });
  }

  if (req.method === "DELETE") {
    const id = String(req.query.id ?? req.body?.id ?? "");
    const mode = String(req.query.mode ?? req.body?.mode ?? "archive");

    if (!id) {
      return res.status(400).json({ error: "Missing memory id" });
    }

    const request = mode === "delete"
      ? supabase.from("memories").delete().eq("id", id)
      : supabase.from("memories").update({ is_active: false }).eq("id", id);

    const { error } = await request;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
