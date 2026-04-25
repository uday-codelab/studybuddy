"use client";
import { useState } from "react";
import QuizCard from "./QuizCard";
import type { QuizQuestion } from "@/app/api/quiz/route";

export default function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    setQuestions([]);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setQuestions(data.questions ?? []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ring-blue-300"
          placeholder="Topic to quiz on (e.g. 'compliance requirements')"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === "Enter" && generate()}
        />
        <button
          onClick={generate}
          disabled={loading || !topic.trim()}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate Quiz"}
        </button>
      </div>
      {questions.map((q, i) => <QuizCard key={i} q={q} index={i} />)}
    </div>
  );
}