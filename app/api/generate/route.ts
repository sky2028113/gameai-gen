import { NextRequest, NextResponse } from "next/server";

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN || "";

const MODELS: Record<string, string> = {
  pixel: "nerijs/pixel-art-xl",
  anime: "cagliostrolab/animagine-xl-3.1",
  fantasy: "stabilityai/stable-diffusion-2-1",
  realistic: "stabilityai/stable-diffusion-2-1",
};

const PROMPTS: Record<string, string> = {
  pixel: ", pixel art, 16-bit, retro game sprite, white background",
  anime: ", anime style, cel shaded, vibrant colors",
  fantasy: ", fantasy art, magic, detailed illustration",
  realistic: ", photorealistic, 8k, highly detailed",
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();
    if (!prompt || !style) {
      return NextResponse.json({ error: "Missing prompt or style" }, { status: 400 });
    }

    const model = MODELS[style] || MODELS.pixel;
    const stylePrompt = PROMPTS[style] || PROMPTS.pixel;

    // 尝试最多2次
    let lastError = "";
    for (let i = 0; i < 2; i++) {
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt + stylePrompt,
          parameters: { width: 512, height: 512 },
        }),
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        return NextResponse.json({ imageUrl: `data:image/png;base64,${base64}` });
      }

      const errText = await response.text();
      lastError = errText;

      // 如果模型在加载中，等10秒再试
      if (errText.includes("loading")) {
        await new Promise((r) => setTimeout(r, 10000));
        continue;
      }
      break;
    }

    throw new Error(lastError || "Generation failed");
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
