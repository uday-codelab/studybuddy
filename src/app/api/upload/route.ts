export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embedBatch } from "@/lib/embeddings";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const { text, fileName } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  console.log("✅ Text received, chars:", text.length);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const chunks = await splitter.splitText(text);
  console.log("✅ Chunks:", chunks.length);

  let vectors: number[][];
  try {
    vectors = await embedBatch(chunks);
    console.log("✅ Embeddings done:", vectors.length);
  } catch (err) {
    console.error("❌ Embedding failed:", err);
    return NextResponse.json({ error: "Embedding failed" }, { status: 500 });
  }

  await sql`DELETE FROM document_chunks WHERE user_id = ${userId} AND file_name = ${fileName}`;

  await sql`BEGIN`;
  try {
    for (let i = 0; i < chunks.length; i++) {
      await sql`
        INSERT INTO document_chunks (user_id, file_name, content, embedding)
        VALUES (
          ${userId},
          ${fileName},
          ${chunks[i]},
          ${JSON.stringify(vectors[i])}::vector
        )
      `;
    }
    await sql`COMMIT`;
    console.log("✅ Saved to DB");
  } catch (err) {
    await sql`ROLLBACK`;
    console.error("❌ DB insert failed:", err);
    return NextResponse.json({ error: "Storage failed" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    fileName,
    chunksStored: chunks.length,
  });
}