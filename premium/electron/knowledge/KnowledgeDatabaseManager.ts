export class KnowledgeDatabaseManager {
  constructor(private readonly _db: any) {}
  initializeSchema(): void {
    // MVP: reuse existing DB, no custom schema required yet.
  }
}
