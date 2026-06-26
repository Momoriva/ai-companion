export async function createEmbedding(input: string): Promise<number[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.EMBEDDING_MODEL ?? "openai/text-embedding-3-small";

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY for embeddings");
  }

  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_SITE_NAME ?? "AI Companion Website"
    },
    body: JSON.stringify({ model, input })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  const embedding = data.data?.[0]?.embedding;

  if (!Array.isArray(embedding)) {
    throw new Error("Embedding response is empty");
  }

  return embedding;
}
