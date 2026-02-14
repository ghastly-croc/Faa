import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { StudyResource } from '../types';

const mcqSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      answer: { type: Type.STRING },
      explanation: { type: Type.STRING },
    },
    required: ["question", "options", "answer", "explanation"],
  },
};

export interface GenerationResult {
    text: string;
    resources?: StudyResource[];
}

export const generateStudyMaterial = async (topic: string, type: 'notes' | 'mcq' | 'resources' | 'summary'): Promise<GenerationResult> => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!API_KEY) {
    throw new Error("API_KEY is not configured. Please add VITE_GEMINI_API_KEY to Cloudflare.");
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  let prompt: string;
  let modelConfig: any = {};
  
  if (type === 'mcq') {
    prompt = `Generate 15 to 20 multiple-choice questions (MCQs) for the topic '${topic}' relevant to the JKSSB Finance Account Assistant exam. Ensure the options are plausible and there is one clear correct answer. For each question, provide the correct answer and a brief explanation detailing why the correct answer is right and the other options are wrong.`;
    modelConfig = {
      responseMimeType: "application/json",
      responseSchema: mcqSchema,
    };
  } else if (type === 'resources') {
    prompt = `Find and summarize in brief paragraphs some online study resources for the topic '${topic}' for the JKSSB Finance Account Assistant exam.`;
    modelConfig = {
        tools: [{googleSearch: {}}],
    };
  } else if (type === 'summary') {
    prompt = `Generate a concise summary or a set of flashcards for the topic '${topic}' for the JKSSB Finance Account Assistant exam. Focus on key points, definitions, and formulas suitable for quick revision. Briefly mention the practical relevance of each key point in a finance and accounting context. Use markdown for formatting.`;
  } else {
    prompt = `Generate comprehensive and detailed study notes for the topic '${topic}' for the JKSSB Finance Account Assistant exam. The notes must be thorough, going beyond simple definitions. Where applicable, include historical context to explain the evolution of concepts. Crucially, provide practical, real-world examples related to government procurement, salary disbursement, or public works expenditure. Use markdown for clear formatting.`;
  }
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: modelConfig,
    });
    
    const text = response.text;
    if (!text) {
        throw new Error("No content generated from API.");
    }

    if (type === 'resources') {
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const resources: StudyResource[] = groundingChunks
            ?.map((chunk: any) => chunk.web && chunk.web.uri ? ({
                title: chunk.web.title || chunk.web.uri,
                uri: chunk.web.uri,
            }) : null)
            .filter((res): res is StudyResource => res !== null) || [];

        const uniqueResources = Array.from(new Map(resources.map(item => [item.uri, item])).values());
        return { text, resources: uniqueResources };
    }

    return { text };

  } catch (error) {
    console.error(`Error calling Gemini API for topic "${topic}":`, error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate study material: ${error.message}`);
    }
    throw new Error("Failed to generate study material due to an unknown error.");
  }
};
