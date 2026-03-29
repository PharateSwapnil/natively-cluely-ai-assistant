import { BraveSearchProvider } from './BraveSearchProvider';

export class CompanyResearchEngine {
  private searchProvider: BraveSearchProvider | null = null;

  setSearchProvider(provider: BraveSearchProvider): void {
    this.searchProvider = provider;
  }

  async researchCompany(companyName: string, jdContext: any = {}, includeSources = true): Promise<any> {
    if (!companyName?.trim()) {
      throw new Error('Company name is required.');
    }

    const provider = this.searchProvider;
    const query = `${companyName} company overview products funding interview process engineering culture`;

    const results = provider ? await provider.search(query, 6) : [];
    const bullets = results.map((r, i) => `${i + 1}. ${r.title}: ${r.snippet}`);

    return {
      companyName,
      generatedAt: new Date().toISOString(),
      roleContext: jdContext,
      summary: bullets.length
        ? `MVP dossier generated from Brave web results for ${companyName}.`
        : `No Brave provider configured; dossier generated without live search for ${companyName}.`,
      insights: bullets,
      sources: includeSources ? results.map((r) => ({ title: r.title, url: r.url })) : [],
    };
  }
}
