import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";
if (!API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

export default ai;