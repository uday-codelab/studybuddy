import sql from "@/lib/db";
import { embedText } from "@/lib/embeddings";

export async function findRelevantChunks(
  question: string,
  userId: string,
  topK = 4
): Promise<string[]> {
  const queryVector = await embedText(question);

  const rows = await sql`
    SELECT content
    FROM document_chunks
    WHERE user_id = ${userId}
    ORDER BY embedding <=> ${JSON.stringify(queryVector)}::vector
    LIMIT ${topK}
  `;

  return rows.map((r: any) => r.content);
}