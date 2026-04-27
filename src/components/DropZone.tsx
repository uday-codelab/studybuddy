"use client";
import { useState, useEffect } from "react";

type UploadResult = {
  fileName: string;
  chunksStored: number;
};

function usePdfJs() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ((window as any).pdfjsLib) { setReady(true); return; }
    
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
    script.async = true;
    script.onload = () => {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
      setReady(true);
    };
    document.head.appendChild(script);
  }, []);

  return ready;
}

export default function DropZone({ userId }: { userId: string }) {
  const pdfReady = usePdfJs();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "extracting" | "uploading" | "done" | "error">("idle");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState("");

  async function extractText(file: File): Promise<string> {
    const pdfjsLib = (window as any).pdfjsLib;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return fullText;
  }

  async function handleUpload() {
    if (!file || !pdfReady) return;
    setError("");
    setResult(null);

    try {
      setStatus("extracting");
      const text = await extractText(file);
      console.log("✅ Extracted chars:", text.length);

      if (!text.trim()) {
        throw new Error("No text found in PDF");
      }

      setStatus("uploading");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, fileName: file.name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
      setStatus("done");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Upload failed");
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 space-y-4 bg-blue-">
      <p className="font-semibold text-gray-700">📄 Upload a PDF</p>

      <label className="cursor-pointer flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition w-full">
        <span>⊕ {file ? file.name : "Choose a PDF file"}</span>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={e => {
            setFile(e.target.files?.[0] ?? null);
            setStatus("idle");
            setResult(null);
            setError("");
          }}
        />
      </label>

      <button
        onClick={handleUpload}
        disabled={!file || !pdfReady || status === "extracting" || status === "uploading"}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium disabled:opacity-50 hover:bg-blue-700 transition"
      >
        {!pdfReady ? "Loading..." :
         status === "extracting" ? "📖 Reading PDF..." :
         status === "uploading" ? "⬆️ Indexing..." :
         "Upload & Index"}
      </button>

      {status === "done" && result && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          ✓ <strong>{result.fileName}</strong> — {result.chunksStored} chunks indexed
        </div>
      )}

      {error && <p className="text-sm text-red-600">❌ {error}</p>}
    </div>
  );
}