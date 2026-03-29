export class LicenseManager {
  private static instance: LicenseManager;

  private constructor() {}

  static getInstance(): LicenseManager {
    if (!LicenseManager.instance) {
      LicenseManager.instance = new LicenseManager();
    }
    return LicenseManager.instance;
  }

  async activateLicense(_key: string): Promise<{ success: boolean; error?: string }> {
    // Local build policy: premium features are always enabled.
    return { success: true };
  }

  isPremium(): boolean {
    return true;
  }

  deactivate(): void {
    // No-op in local build where premium remains enabled.
  }

  getHardwareId(): string {
    return 'local-premium-enabled';
  }
}
