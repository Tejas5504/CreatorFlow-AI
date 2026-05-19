import { Request, Response } from "express";
import Groq from "groq-sdk";
import "dotenv/config";
import Script from "../models/Script.js";

export const generateScript = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, tone = "Educational", length = "Medium" } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });

    if (!process.env.GROQ_API_KEY) {
       return res.status(500).json({ message: "GROQ_API_KEY is missing. Please add it to your .env file." });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const wordCount: Record<string, string> = {
      Short:  "SHORT (approx 300–400 words total). Keep explanations brief and concise. Use 2-3 short paragraphs for the main content.",
      Medium: "MEDIUM (approx 600–800 words total). Provide standard depth. Use 4-5 well-developed paragraphs for the main content.",
      Long:   "LONG (approx 1200–1600 words total). This is a deep-dive video. You MUST write highly detailed, extensive explanations. Use 7-10 long, comprehensive paragraphs for the main content.",
    };

    const systemInstruction = `You are an expert YouTube video script writer. You write engaging, well-structured scripts optimised for audience retention and SEO.
You MUST strictly follow the user's requested LENGTH constraint. If they ask for a LONG script, you must write a massive, highly detailed main content section.
Always return your response as valid JSON (no markdown, no code fences, just raw JSON).`;

    const userMessage = `Write a full YouTube video script for the following topic:

Topic   : "${title}"
Tone    : ${tone}
Length  : ${wordCount[length] ?? wordCount["Medium"]}

Return ONLY a JSON object with exactly these keys (no extra keys, no markdown):
{
  "intro":       "...",
  "hook":        "...",
  "main_content":"...",
  "statistics":  "...",
  "outro":       "...",
  "cta":         "..."
}

Guidelines:
- intro       : 2–3 sentences welcoming the viewer and stating the video purpose.
- hook        : 1 punchy sentence or question that grabs attention (used at the very start).
- main_content: THIS IS THE MOST IMPORTANT SECTION FOR LENGTH. Strictly follow the length constraint provided above. Write as many paragraphs as requested to hit the word count.
- statistics  : 3–5 relevant real-world statistics or facts with context (bullet format inside the string using \\n•).
- outro       : 2–3 sentences wrapping up key takeaways.
- cta         : A compelling call-to-action ending with "Subscribe for more".`;

    console.log(`📝 Generating script for: "${title}" | Tone: ${tone} | Length: ${length}`);

    // Try models in order: Llama 3.3 70B -> Llama 3.1 8B
    const modelsToTry = [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant"
    ];

    let rawText = "";

    for (const model of modelsToTry) {
      try {
        console.log(`🤖 Trying Groq model: ${model}`);
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userMessage }
          ],
          model: model,
          temperature: 0.7,
          // JSON mode forces valid JSON output without markdown backticks!
          response_format: { type: "json_object" }
        });
        
        rawText = chatCompletion.choices[0]?.message?.content || "";
        console.log(`✅ Model ${model} succeeded`);
        break;
      } catch (err: any) {
        console.warn(`⚠️ Model ${model} failed:`, err.response?.data || err.message || err);
        // Continue to the next model
      }
    }

    if (!rawText) throw new Error("No Groq models available or rate limited. Please try again later.");

    const parsedScript = JSON.parse(rawText);

    const required = ["intro", "hook", "main_content", "statistics", "outro", "cta"];
    for (const key of required) {
      if (!parsedScript[key]) throw new Error(`Missing section: ${key}`);
    }

    console.log("✅ Script generated. Saving to DB...");

    // Save to database
    const savedScript = await Script.create({
      userId,
      title,
      tone,
      length,
      hook: parsedScript.hook,
      intro: parsedScript.intro,
      main_content: parsedScript.main_content,
      statistics: parsedScript.statistics,
      outro: parsedScript.outro,
      cta: parsedScript.cta
    });

    console.log("✅ Script saved successfully.");
    return res.json({ message: "Script Generated", script: savedScript });

  } catch (error: any) {
    console.error("❌ Script Generation Error:", error.message);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// Fetch User Scripts
export const getUserScripts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Fetch scripts, sort by newest first
    const scripts = await Script.find({ userId }).sort({ createdAt: -1 });
    return res.json({ scripts });
  } catch (error: any) {
    console.error("Fetch Scripts Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Delete Script
export const deleteScript = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    await Script.findByIdAndDelete({ _id: id, userId });
    return res.json({ message: "Script deleted successfully" });
  } catch (error: any) {
    console.error("Delete Script Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
