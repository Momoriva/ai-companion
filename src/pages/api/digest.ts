import type { NextApiRequest, NextApiResponse } from "next";
import { digestDiary } from "@/lib/digest";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!supabase) {
    return res.status(503).json({ error: "Supabase is not configured" });
  }

  const documentId = String(req.body.document_id ?? "");
  const model = typeof req.body.model === "string" ? req.body.model : undefined;
  const commit = req.body.commit !== false;

  if (!documentId) {
    return res.status(400).json({ error: "Missing document_id" });
  }

  const { data: document, error } = await supabase
    .from("knowledge_documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const memories = await digestDiary(document.original_content, {
    sourceName: document.source_name,
    room: document.room,
    model
  });

  if (!commit) {
    return res.status(200).json({ preview: memories });
  }

  const { data, error: insertError } = await supabase.from("memories").insert(memories).select("*");

  if (insertError) {
    return res.status(500).json({ error: insertError.message });
  }

  return res.status(201).json({ memories: data ?? [] });
}
