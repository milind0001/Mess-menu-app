const axios = require("axios");

const HF_API_URL =
  "https://router.huggingface.co/hf-inference/models/google/flan-t5-base";

async function generateMenuAI(menuText) {
  try {
    const prompt = `
Generate a short summary (max 10 words) and 4-6 tags
for the following mess menu.

Menu:
${menuText}

Return JSON only:
{
  "summary": "...",
  "tags": ["...", "..."]
}
`;

    const response = await axios.post(
      HF_API_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    const rawText = response.data?.[0]?.generated_text || "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { summary: "", tags: [] };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      summary: parsed.summary || "",
      tags: Array.isArray(parsed.tags) ? parsed.tags : []
    };
  } catch (error) {
    console.error("❌ Hugging Face AI failed:", error.response?.data || error.message);
    return { summary: "", tags: [] };
  }
}

module.exports = { generateMenuAI };
