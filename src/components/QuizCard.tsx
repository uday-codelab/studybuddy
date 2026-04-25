"use client";
import { useState } from "react";
import type { QuizQuestion } from "@/app/api/quiz/route";

export default function QuizCard({ q, index }: { q: QuizQuestion; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === q.correctIndex;

  return (
    <div className="rounded-xl border border-gray-200 p-4 space-y-3">
      <p className="font-medium text-sm text-gray-800">
        {index + 1}. {q.question}
      </p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let style = "border-gray-200 text-gray-700";
          if (selected !== null) {
            if (i === q.correctIndex) style = "border-green-400 bg-green-50 text-green-800";
            else if (i === selected) style = "border-red-400 bg-red-50 text-red-800";
          }
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              disabled={selected !== null}
              className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition ${style} disabled:cursor-default`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className={`text-xs rounded-lg p-2 ${correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {correct ? "✓ Correct — " : "✗ Incorrect — "}{q.explanation}
        </p>
      )}
    </div>
  );
}