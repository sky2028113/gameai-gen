import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const stylePrefix: Record<string, string> = {
      pixel: "pixel art, 16-bit, retro game sprite, ",
      anime: "anime style, cel shaded, vibrant colors, ",
      fantasy: "fantasy art, magic, detailed illustration, ",
      realistic: "photorealistic, 8k, highly detailed, ",
    };

    const prefix = stylePrefix[style] || "";
    const fullPrompt = prefix + prompt;

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=512&height=512&nologo=true`;

    return NextResponse.json({ imageUrl: url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
