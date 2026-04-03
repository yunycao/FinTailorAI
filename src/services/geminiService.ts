import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, MarketingMaterial } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function generateMarketingMaterial(profile: UserProfile): Promise<MarketingMaterial> {
  const prompt = `
    Create a personalized financial marketing material for the following user profile:
    Name: ${profile.name}
    Age: ${profile.age || 'Not specified'}
    Financial Goals: ${profile.financialGoals.join(', ')}
    Risk Tolerance: ${profile.riskTolerance}
    Current Situation: ${profile.currentSituation}
    Preferred Communication Style: ${profile.communicationStyle}

    The marketing content MUST be written in the "${profile.communicationStyle}" style. 
    - Professional: Formal, authoritative, polished.
    - Casual: Friendly, approachable, conversational.
    - Educational: Informative, explanatory, teaching-focused.
    - Direct: Concise, action-oriented, no-fluff.

    The recommendation engine should suggest relevant, REAL-WORLD financial services and products from existing banks or financial service providers, including but not limited to:
    - Investment Accounts (e.g., Vanguard, Fidelity, Charles Schwab)
    - Savings Vehicles (e.g., Marcus by Goldman Sachs, Ally Bank, American Express)
    - Loans (e.g., SoFi, Rocket Mortgage, LightStream)
    - Insurance Policies (e.g., Lemonade, State Farm, Northwestern Mutual)
    - Retirement Planning (e.g., Betterment, Wealthfront)

    For each recommendation, explain clearly WHY it fits the user's specific needs and preferences.
    Include a "topProductRecommendation" which is the single most relevant product for the user's current situation, with a clear action label and a link to the product page.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          tagline: { type: Type.STRING },
          summary: { type: Type.STRING },
          keyBenefits: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          recommendedServices: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                provider: { type: Type.STRING },
                description: { type: Type.STRING },
                whyItFits: { type: Type.STRING },
                link: { type: Type.STRING }
              },
              required: ["name", "provider", "description", "whyItFits"]
            }
          },
          topProductRecommendation: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              provider: { type: Type.STRING },
              actionLabel: { type: Type.STRING },
              link: { type: Type.STRING }
            },
            required: ["name", "provider", "actionLabel", "link"]
          }
        },
        required: ["title", "tagline", "summary", "keyBenefits", "recommendedServices", "topProductRecommendation"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as MarketingMaterial;
}
