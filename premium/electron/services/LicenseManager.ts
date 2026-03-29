export class LicenseManager {
  private static instance: LicenseManager;
  private premium = false;

  private constructor() {
    // MVP: allow enabling premium profile flows via env for local development.
    this.premium = process.env.ENABLE_PROFILE_INTELLIGENCE === 'true';
  }

  static getInstance(): LicenseManager {
    if (!LicenseManager.instance) {
      LicenseManager.instance = new LicenseManager();
    }
    return LicenseManager.instance;
  }

  async activateLicense(key: string): Promise<{ success: boolean; error?: string }> {
    if (!key?.trim()) return { success: false, error: 'License key is required.' };
    this.premium = true;
    return { success: true };
  }

  isPremium(): boolean {
    return this.premium;
  }

  deactivate(): void {
    this.premium = false;
  }

  getHardwareId(): string {
    return 'local-dev-hardware-id';
  }
}
