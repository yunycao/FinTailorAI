import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export function createFinancialChat(profile?: UserProfile) {
  const systemInstruction = `
    You are FinTailor AI, a sophisticated financial assistant. 
    ${profile ? `You are helping ${profile.name}, who is ${profile.age || 'of unspecified age'}. 
    Their goals are: ${profile.financialGoals.join(', ')}. 
    Their risk tolerance is ${profile.riskTolerance}. 
    Their current situation: ${profile.currentSituation}.` : ''}
    
    Your goal is to provide personalized, safe, and professional financial guidance. 
    Always encourage users to do their own research and consult with certified professionals for major decisions.
    Be helpful, clear, and elegant in your communication.
  `;

  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction,
    },
  });
}
