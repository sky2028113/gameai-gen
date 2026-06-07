import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

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

    const output = await replicate.run("stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", {
      input: {
        prompt: config.prefix + prompt,
        negative_prompt: config.negative,
        width: 512,
        height: 512,
        num_outputs: 1,
      },
    });

    const imageUrl = Array.isArray(output) && output.length > 0 ? output[0] : null;
    if (!imageUrl) throw new Error("No image generated");

    return NextResponse.json({ imageUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
