// O arquivo gemini.ts é responsável por configurar e exportar uma instância do Google Gemini AI, permitindo que o aplicativo interaja com os serviços de inteligência artificial do Google.
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";
if (!API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

export default ai;