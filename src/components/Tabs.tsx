"use client";
import { useState } from "react";
import ChatInterface from "./ChatInterface";
import QuizGenerator from "./QuizGenerator";

export default function Tabs() {
  const [tab, setTab] = useState<"chat" | "quiz">("chat");

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setTab("chat")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            tab === "chat"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setTab("quiz")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            tab === "quiz"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Quiz
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === "chat" ? <ChatInterface userId="" /> : <QuizGenerator />}
      </div>
    </div>
  );
}