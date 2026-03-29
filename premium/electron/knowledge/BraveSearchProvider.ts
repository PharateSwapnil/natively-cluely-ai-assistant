export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
}

export class BraveSearchProvider {
  constructor(private readonly apiKey: string) {}

  async search(query: string, count: number = 5): Promise<SearchResultItem[]> {
    const url = new URL('https://api.search.brave.com/res/v1/web/search');
    url.searchParams.set('q', query);
    url.searchParams.set('count', String(count));
    url.searchParams.set('text_decorations', 'false');

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'X-Subscription-Token': this.apiKey,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Brave search failed (${response.status}): ${body}`);
    }

    const payload: any = await response.json();
    const results = payload?.web?.results || [];
    return results.map((r: any) => ({
      title: r.title || 'Untitled',
      url: r.url || '',
      snippet: r.description || '',
    }));
  }
}
