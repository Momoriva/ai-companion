import type { NextApiRequest, NextApiResponse } from "next";
import { createEmbedding } from "@/lib/embeddings";
import { chunkText } from "@/lib/memory-engine";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!supabase) {
    return res.status(503).json({ error: "Supabase is not configured" });
  }

  if (req.method === "GET") {
    const room = String(req.query.room ?? "default");
    const { data, error } = await supabase
      .from("knowledge_documents")
      .select("id, source_name, file_type, room, created_at")
      .eq("room", room)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ documents: data ?? [] });
  }

  if (req.method === "POST") {
    const sourceName = String(req.body.source_name ?? "").trim();
    const originalContent = String(req.body.original_content ?? "").trim();
    const fileType = String(req.body.file_type ?? "txt");
    const room = String(req.body.room ?? "default");

    if (!sourceName || !originalContent) {
      return res.status(400).json({ error: "Missing source_name or original_content" });
    }

    const { data: document, error: documentError } = await supabase
      .from("knowledge_documents")
      .insert({
        source_name: sourceName,
        original_content: originalContent,
        file_type: fileType,
        room
      })
      .select("*")
      .single();

    if (documentError) {
      return res.status(500).json({ error: documentError.message });
    }

    const chunks = chunkText(originalContent);
    const rows = [];

    for (let index = 0; index < chunks.length; index += 1) {
      let embedding = null;

      try {
        embedding = await createEmbedding(chunks[index]);
      } catch {
        embedding = null;
      }

      rows.push({
        document_id: document.id,
        source_name: sourceName,
        chunk_index: index,
        content: chunks[index],
        room,
        embedding
      });
    }

    const { error: chunksError } = await supabase.from("knowledge_chunks").insert(rows);

    if (chunksError) {
      return res.status(500).json({ error: chunksError.message });
    }

    return res.status(201).json({ document, chunks: rows.length });
  }

  if (req.method === "DELETE") {
    const id = String(req.query.id ?? req.body?.id ?? "");
    const deleteMemories = String(req.query.deleteMemories ?? req.body?.deleteMemories ?? "false") === "true";

    if (!id) {
      return res.status(400).json({ error: "Missing document id" });
    }

    const { data: document, error: loadError } = await supabase
      .from("knowledge_documents")
      .select("source_name")
      .eq("id", id)
      .single();

    if (loadError) {
      return res.status(500).json({ error: loadError.message });
    }

    if (deleteMemories) {
      await supabase.from("memories").delete().eq("source", `old-diary:${document.source_name}`);
    }

    const { error } = await supabase.from("knowledge_documents").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
