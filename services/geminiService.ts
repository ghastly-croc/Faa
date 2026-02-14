import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { StudyResource } from '../types';

const mcqSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING },
      options: { type: Type.ARRAY, items: { type: Type.STRING } },
      answer: { type: Type.STRING },
      explanation: { type: Type.STRING },
    },
    required: ["question", "options", "answer", "explanation"],
  },
};

export interface GenerationResult { text: string; resources?: StudyResource[]; }

export const generateStudyMaterial = async (topic: string, type: 'notes' | 'mcq' | 'resources' | 'summary'): Promise<GenerationResult> => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!API_KEY) throw new Error("API_KEY missing in Cloudflare settings.");
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  let prompt: string;
  let modelConfig: any = {};
  
  if (type === 'mcq') {
    prompt = `Generate 15-20 MCQs for '${topic}' for JKSSB FAA exam. Provide correct answers and explanations.`;
    modelConfig = { responseMimeType: "application/json", responseSchema: mcqSchema };
  } else if (type === 'resources') {
    prompt = `Summarize online study resources for '${topic}' for JKSSB FAA exam.`;
    modelConfig = { tools: [{googleSearch: {}}] };
  } else if (type === 'summary') {
    prompt = `Generate concise summary/flashcards for '${topic}' for JKSSB FAA exam.`;
  } else {
    prompt = `Generate detailed study notes for '${topic}' for JKSSB FAA exam with government procurement/salary examples.`;
  }
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: modelConfig,
    });
    
    const text = response.text;
    if (!text) throw new Error("No content generated.");

    if (type === 'resources') {
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const resources: StudyResource[] = chunks?.map((c: any) => c.web && c.web.uri ? ({
            title: c.web.title || c.web.uri,
            uri: c.web.uri,
        }) : null).filter((res): res is StudyResource => res !== null) || [];
        return { text, resources: Array.from(new Map(resources.map(i => [i.uri, i])).values()) };
    }
    return { text };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(`AI Error: ${error.message || "Unknown error"}`);
  }
};