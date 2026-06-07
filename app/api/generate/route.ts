import { NextRequest, NextResponse } from "next/server";

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN || "";

const STYLES: Record<string, { prefix: string; negative: string }> = {
  pixel: { prefix: "pixel art, 16-bit, ", negative: "realistic, blurry, photo" },
  anime: { prefix: "anime style, cel shaded, ", negative: "realistic, 3d, photo" },
  fantasy: { prefix: "fantasy art, magic, detailed, ", negative: "modern, scifi, blurry" },
  realistic: { prefix: "photorealistic, 8k, ", negative: "cartoon, anime, 3d render" },
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();
    if (!prompt || !style) {
      return NextResponse.json({ error: "Missing prompt or style" }, { status: 400 });
    }

    const config = STYLES[style] || STYLES.pixel;

    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: config.prefix + prompt,
        parameters: {
          negative_prompt: config.negative,
          width: 512,
          height: 512,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({ imageUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
