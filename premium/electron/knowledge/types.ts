export enum DocType {
  RESUME = 'resume',
  JD = 'jd'
}

export interface StructuredResume {
  rawText: string;
  name?: string;
  email?: string;
  role?: string;
  skills: string[];
  experienceYears?: number;
}

export interface StructuredJD {
  rawText: string;
  title?: string;
  company?: string;
  location?: string;
  requirements: string[];
  technologies: string[];
  keywords: string[];
  level?: string;
  compensation_hint?: string;
  min_years_experience?: number;
}

export interface KnowledgeStatus {
  hasResume: boolean;
  hasActiveJD: boolean;
  activeMode: boolean;
  resumeSummary?: {
    name?: string;
    role?: string;
    totalExperienceYears?: number;
  };
  jdSummary?: {
    title?: string;
    company?: string;
  };
}
