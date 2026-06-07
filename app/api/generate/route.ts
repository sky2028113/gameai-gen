import { NextRequest, NextResponse } from "next/server";

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
      fullPrompt = fullPrompt.replace("white background", "solid white background, isolated, product photo, no shadow");
    }

    // 用多个备用域名
    const domains = [
      "https://image.pollinations.ai",
      "https://pollinations.ai/p",
    ];

    const url = `${domains[0]}/prompt/${encodeURIComponent(fullPrompt)}?width=512&height=512&nologo=true&seed=${Date.now()}`;

    return NextResponse.json({ imageUrl: url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
