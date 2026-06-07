"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("pixel");
  const [bgMode, setBgMode] = useState("original");
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
        body: JSON.stringify({ prompt, style, transparent: bgMode === "transparent" }),
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
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-2">🎮 GameAI Generator</h1>
      <p className="text-center text-gray-500 mb-8 text-lg">AI game assets in seconds. No sign-up.</p>

      <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-4">
        {/* 提示词 */}
        <textarea
          className="w-full border rounded-xl p-4 resize-none text-base"
          rows={3}
          placeholder="a golden sword with gems"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={generating}
        />

        {/* 风格选择 */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Style</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "pixel", label: "👾 Pixel", desc: "16-bit" },
              { key: "anime", label: "🌸 Anime", desc: "Cel shaded" },
              { key: "fantasy", label: "🐉 Fantasy", desc: "Magic" },
              { key: "realistic", label: "📸 Realistic", desc: "Photo" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setStyle(s.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  style === s.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 背景模式（差异化功能） */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Background</p>
          <div className="flex gap-2">
            {[
              { key: "original", label: "🖼️ Original", desc: "AI decides" },
              { key: "transparent", label: "✨ Transparent", desc: "No background" },
            ].map((bg) => (
              <button
                key={bg.key}
                onClick={() => setBgMode(bg.key)}
                className={`flex-1 px-3 py-3 rounded-xl text-sm font-medium border transition-all text-center ${
                  bgMode === bg.key
                    ? "bg-green-50 text-green-700 border-green-400 ring-1 ring-green-400"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="text-base">{bg.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{bg.desc}</div>
              </button>
            ))}
          </div>
          {bgMode === "transparent" && (
            <p className="text-xs text-green-600 mt-2">⚡ Removes background automatically — perfect for game sprites!</p>
          )}
        </div>

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="w-full bg-blue-600 text-white py-3.5 rounded-full font-semibold text-base disabled:opacity-40 transition-opacity"
        >
          {generating ? "⏳ Generating..." : "Generate →"}
        </button>

        {/* 错误 */}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
            {error.includes("Queue full") ? "🚦 Too busy, try again in a few seconds!" : error}
          </div>
        )}

        {/* 结果 */}
        {result && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border bg-gray-50">
              <img src={result} alt="Generated asset" className="w-full" />
            </div>
            <a
              href={result}
              download="game-asset.png"
              target="_blank"
              className="block text-center py-2.5 bg-gray-100 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              📥 Download
            </a>
          </div>
        )}
      </div>

      {/* 底部卖点 */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs text-gray-400">
        <div className="bg-white rounded-xl p-3 border">
          <div className="text-lg mb-1">🎨</div>
          <div className="font-medium text-gray-600">4 Styles</div>
        </div>
        <div className="bg-white rounded-xl p-3 border">
          <div className="text-lg mb-1">✨</div>
          <div className="font-medium text-gray-600">Transparent BG</div>
        </div>
        <div className="bg-white rounded-xl p-3 border">
          <div className="text-lg mb-1">⚡</div>
          <div className="font-medium text-gray-600">No Sign-Up</div>
        </div>
        <div className="bg-white rounded-xl p-3 border">
          <div className="text-lg mb-1">📥</div>
          <div className="font-medium text-gray-600">Free Download</div>
        </div>
      </div>
    </main>
  );
}
