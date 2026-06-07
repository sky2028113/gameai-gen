"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("pixel");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data.imageUrl);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-center mb-4">🎮 GameAI Generator</h1>
      <p className="text-center text-gray-500 mb-10 text-lg">AI game assets in seconds. No sign-up.</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <textarea
          className="w-full border rounded-xl p-4 mb-4 resize-none"
          rows={3}
          placeholder="a glowing health potion, pixel art"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={generating}
        />

        <div className="flex gap-2 mb-4 flex-wrap">
          {["pixel", "anime", "fantasy", "realistic"].map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                style === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {s === "pixel" ? "👾 Pixel" : s === "anime" ? "🌸 Anime" : s === "fantasy" ? "🐉 Fantasy" : "📸 Realistic"}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-full font-medium disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate →"}
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {result && (
          <div className="mt-6">
            <img src={result} alt="Generated" className="rounded-xl w-full" />
            <a href={result} download className="block text-center mt-3 text-blue-600 underline">
              Download
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
