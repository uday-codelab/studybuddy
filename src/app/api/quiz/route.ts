import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findRelevantChunks } from "@/lib/search";
import { grok } from "@/lib/grok";

export type QuizQuestion = {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic } = await req.json();

  const chunks = await findRelevantChunks(topic, session.user.id, 8);

  if (chunks.length === 0) {
    return NextResponse.json({ error: "No documents found" }, { status: 404 });
  }

  const context = chunks.join("\n\n");

  const completion = await grok.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    stream: false,
    messages: [
      {
        role: "system",
        content: `You are a quiz generator. Based on the provided text, generate exactly 5 multiple-choice questions.
Return ONLY a raw JSON array — no markdown, no backticks, no explanation.
Each object must have: question (string), options (array of 4 strings), correctIndex (0-3), explanation (string).`,
      },
      {
        role: "user",
        content: `Generate 5 quiz questions from this text:\n\n${context}`,
      },
    ],
  });

  const raw = completion.choices[0].message.content ?? "[]";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    const questions: QuizQuestion[] = JSON.parse(cleaned);
    return NextResponse.json({ questions });
  } catch {
    console.error("Failed to parse quiz JSON:", cleaned);
    return NextResponse.json({ error: "Quiz generation failed" }, { status: 500 });
  }
}