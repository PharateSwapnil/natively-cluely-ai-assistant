import { DocType, KnowledgeStatus, StructuredJD, StructuredResume } from './types';
import { extractDocumentText } from './DocumentReader';
import { CompanyResearchEngine } from './CompanyResearchEngine';

function extractEmail(text: string): string | undefined {
  const m = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return m?.[0];
}

function firstNonEmptyLine(text: string): string | undefined {
  return text.split(/\r?\n/).map((l) => l.trim()).find(Boolean);
}

function parseResume(rawText: string): StructuredResume {
  const skills = Array.from(new Set((rawText.match(/\b(JavaScript|TypeScript|Python|Java|Go|Rust|React|Node\.js|SQL|AWS|GCP|Docker|Kubernetes)\b/gi) || []).map((s) => s)));
  const yearsMatch = rawText.match(/(\d{1,2})\+?\s+years?/i);

  return {
    rawText,
    name: firstNonEmptyLine(rawText),
    email: extractEmail(rawText),
    skills,
    experienceYears: yearsMatch ? Number(yearsMatch[1]) : undefined,
  };
}

function parseJD(rawText: string): StructuredJD {
  const tech = Array.from(new Set((rawText.match(/\b(JavaScript|TypeScript|Python|Java|Go|Rust|React|Node\.js|SQL|AWS|GCP|Docker|Kubernetes)\b/gi) || []).map((s) => s)));
  const reqLines = rawText.split(/\r?\n/).filter((l) => /^[\-•*]/.test(l.trim())).map((l) => l.replace(/^[\-•*]\s*/, '').trim());
  return {
    rawText,
    title: firstNonEmptyLine(rawText),
    requirements: reqLines.slice(0, 12),
    technologies: tech,
    keywords: tech,
  };
}

export class KnowledgeOrchestrator {
  private knowledgeMode = false;
  private activeResume: StructuredResume | null = null;
  private activeJD: StructuredJD | null = null;
  private companyResearch = new CompanyResearchEngine();

  constructor(private readonly _db: any) {}

  setGenerateContentFn(_fn: (contents: any[]) => Promise<string>): void {}
  setEmbedFn(_fn: (text: string) => Promise<number[]>): void {}
  setEmbedQueryFn(_fn: (text: string) => Promise<number[]>): void {}
  feedInterviewerUtterance(_text: string): void {}

  async ingestDocument(filePath: string, type: DocType = DocType.RESUME): Promise<{ success: boolean; error?: string }> {
    try {
      const rawText = await extractDocumentText(filePath);
      if (!rawText.trim()) {
        return { success: false, error: 'No text extracted. Try a clearer PDF/image for OCR.' };
      }

      if (type === DocType.RESUME) {
        this.activeResume = parseResume(rawText);
      } else {
        this.activeJD = parseJD(rawText);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  getStatus(): KnowledgeStatus {
    return {
      hasResume: !!this.activeResume,
      hasActiveJD: !!this.activeJD,
      activeMode: this.knowledgeMode,
      resumeSummary: this.activeResume
        ? {
            name: this.activeResume.name,
            role: this.activeResume.role,
            totalExperienceYears: this.activeResume.experienceYears,
          }
        : undefined,
      jdSummary: this.activeJD
        ? {
            title: this.activeJD.title,
            company: this.activeJD.company,
          }
        : undefined,
    };
  }

  setKnowledgeMode(enabled: boolean): void {
    this.knowledgeMode = enabled && !!this.activeResume;
  }

  deleteDocumentsByType(type: DocType): void {
    if (type === DocType.RESUME) this.activeResume = null;
    if (type === DocType.JD) this.activeJD = null;
  }

  getProfileData(): any {
    return {
      activeResume: this.activeResume,
      activeJD: this.activeJD,
    };
  }

  getCompanyResearchEngine(): CompanyResearchEngine {
    return this.companyResearch;
  }

  getNegotiationScript(): any | null { return null; }
  async generateNegotiationScriptOnDemand(): Promise<any | null> { return null; }
  getNegotiationState(): any { return null; }
  resetNegotiationSession(): void {}
}
