import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const dimensionMap: Record<string, { w: number; h: number }> = {
  "16:9": { w: 1280, h: 720 },
  "1:1":  { w: 1080, h: 1080 },
  "9:16": { w: 720,  h: 1280 },
};

/**
 * Step 1 — Gemini (text only, always free) enhances the user's inputs
 * into a detailed, Stable-Diffusion-optimised image prompt.
 */
async function enhancePromptWithGemini(
  title: string,
  style: string,
  color_scheme: string,
  user_prompt: string
): Promise<string> {
  const meta = `
Topic / Title : "${title}"
Visual Style  : ${style}
Color Scheme  : ${color_scheme}
Extra Details : ${user_prompt || "none"}
  `.trim();

  const systemInstruction = `You are an expert AI image-prompt engineer specialising in YouTube thumbnail visuals.
Given a topic and creative preferences, write ONE concise image-generation prompt (max 80 words) for Pollinations AI (Stable Diffusion).
Rules:
- Describe ONLY visual elements: subject, composition, lighting, mood, colours, camera angle.
- Do NOT mention text, typography, watermarks, or logos.
- Use comma-separated descriptive phrases (SD style).
- Be specific and vivid — make the output look like a professional thumbnail.
- Output the prompt text ONLY, nothing else.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Create an image generation prompt for this thumbnail:\n\n${meta}`,
    config: { systemInstruction },
  });

  const enhanced = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
  if (!enhanced) throw new Error("Gemini returned an empty prompt");
  return enhanced;
}

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    const { title, prompt: user_prompt, style, aspect_ratio, color_scheme } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!title)  return res.status(400).json({ message: "Title is required" });

    const { w, h } = dimensionMap[aspect_ratio] ?? dimensionMap["16:9"];

    // Step 1 — Gemini enhances the prompt (falls back to template if rate-limited)
    let enhancedPrompt: string;
    try {
      console.log("✨ Enhancing prompt with Gemini...");
      enhancedPrompt = await enhancePromptWithGemini(title, style, color_scheme, user_prompt ?? "");
      console.log("📝 Gemini-enhanced prompt:", enhancedPrompt);
    } catch (geminiErr: any) {
      // Graceful fallback — Gemini quota exceeded or unavailable
      console.warn("⚠️ Gemini unavailable:", geminiErr.message?.slice(0, 80));
      console.log("🔄 Using built-in template prompt instead...");
      const styleMap: Record<string, string> = {
        "Bold & Graphic": "bold graphic design, high contrast colors, dramatic expressive face, cinematic lighting",
        "Tech/Futuristic": "futuristic tech scene, dark background, glowing neon accents, holographic elements",
        "Minimalist": "minimalist design, two colors, large empty space, single centered subject, clean",
        "Photorealistic": "photorealistic DSLR photo, sharp focus, natural lighting, bokeh background",
        "Illustrated": "digital illustration, cartoon style, bold outlines, flat cel-shading",
      };
      const colorMap: Record<string, string> = {
        vibrant: "vibrant red blue yellow", sunset: "warm orange pink magenta",
        forest: "earthy greens brown", neon: "neon magenta cyan cyberpunk",
        purple: "purple violet magenta", monochrome: "black and white",
        ocean: "navy turquoise teal", pastel: "soft pink lavender mint",
      };
      let p = `${title}, ${styleMap[style] ?? "professional scene"}`;
      if (color_scheme) p += `, ${colorMap[color_scheme] ?? ""}`;
      if (user_prompt?.trim()) p += `, ${user_prompt.trim()}`;
      p += `, no text, no watermark, ultra high quality`;
      enhancedPrompt = p;
      console.log("📝 Fallback prompt:", enhancedPrompt);
    }

    // Step 2 — Build Pollinations URL with the enhanced prompt
    // Browser fetches this directly — no server-side timeout risk
    const seed     = Math.floor(Math.random() * 999_999);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${w}&height=${h}&nologo=true&seed=${seed}&enhance=false`;
    console.log("🔗 Pollinations URL:", imageUrl);

    // Step 3 — Save to DB immediately, return URL to client
    const thumbnail = await Thumbnail.create({
      userId,
      title,
      prompt_used: enhancedPrompt,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      image_url: imageUrl,
      isGenerating: false,
    });

    console.log("✅ Thumbnail record created. Browser will load image from Pollinations.");
    return res.json({ message: "Thumbnail Generated", thumbnail });

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    await Thumbnail.findByIdAndDelete({ _id: id, userId });
    res.json({ message: "Thumbnail deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};