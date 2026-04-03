export interface UserProfile {
  name: string;
  age?: number;
  financialGoals: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  currentSituation: string;
  communicationStyle: 'professional' | 'casual' | 'educational' | 'direct';
}

export interface MarketingMaterial {
  title: string;
  tagline: string;
  summary: string;
  keyBenefits: string[];
  recommendedServices: {
    name: string;
    provider: string;
    description: string;
    whyItFits: string;
    link?: string;
  }[];
  topProductRecommendation: {
    name: string;
    provider: string;
    actionLabel: string;
    link: string;
  };
}

export type Step = 'intro' | 'profile' | 'generating' | 'result' | 'chat';
