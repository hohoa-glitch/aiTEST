export interface TitleSuggestion {
  title: string;
  description: string; // New field for video description
  reasoning: string;
  tags: string[];
}

export interface VideoAnalysisResponse {
  suggestions: TitleSuggestion[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type TargetAudience = 'KOREAN' | 'GLOBAL';