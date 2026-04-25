import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findRelevantChunks } from "@/lib/search";
import { grok } from "@/lib/grok";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { question } = await req.json();
  if (!question?.trim()) {
    return NextResponse.json({ error: "No question provided" }, { status: 400 });
  }

  const chunks = await findRelevantChunks(question, session.user.id);

  if (chunks.length === 0) {
    return NextResponse.json({
      answer: "No documents found. Please upload a PDF first.",
    });
  }

  const context = chunks
    .map((c, i) => `--- Chunk ${i + 1} ---\n${c}`)
    .join("\n\n");

  const systemPrompt = `You are a study assistant. Answer the user's question using ONLY the context below.
If the answer is not in the context, say "I couldn't find that in your documents."
Never invent information.

CONTEXT:
${context}`;

  const stream = await grok.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) controller.enqueue(encoder.encode(delta));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}