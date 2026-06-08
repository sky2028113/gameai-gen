import { NextRequest, NextResponse } from "next/server";

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN || "";

export async function POST(req: NextRequest) {
  try {
    const { prompt, style, transparent } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const stylePrefix: Record<string, string> = {
      pixel: "pixel art, 16-bit, retro game sprite, white background, ",
      anime: "anime style, cel shaded, vibrant colors, white background, ",
      fantasy: "fantasy art, magic, detailed illustration, white background, ",
      realistic: "photorealistic, 8k, highly detailed, white background, ",
    };

    const prefix = stylePrefix[style] || "";
    let fullPrompt = prefix + prompt;

    if (transparent) {
      fullPrompt += ", solid white background, isolated, no shadow";
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: { width: 512, height: 512 },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText.slice(0, 200));
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({ imageUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
