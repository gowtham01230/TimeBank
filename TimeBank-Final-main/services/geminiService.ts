
import { GoogleGenAI } from "@google/genai";

// Per coding guidelines, the API key must be obtained exclusively from the environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateServiceDescription = async (title: string): Promise<string> => {
  try {
    const prompt = `Generate a compelling and friendly service description for a community time bank. The service is "${title}". The description should be 2-3 sentences long, highlight the value of the service, and be written in a welcoming tone. Do not use markdown.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return "Could not generate an AI description at this time. Please write one manually.";
  }
};