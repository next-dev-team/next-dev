import fs from 'fs';
import path from 'path';

export class SecurityManager {
  private suspiciousPatterns = [
    /child_process\./,
    /eval\(/,
    /Function\(/,
  ];

  validatePluginCode(entryPath: string): { valid: boolean; warnings?: string[]; errors?: string[] } {
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      const code = fs.readFileSync(entryPath, 'utf-8');
      for (const pattern of this.suspiciousPatterns) {
        if (pattern.test(code)) {
          warnings.push(`Suspicious pattern detected: ${pattern}`);
        }
      }
    } catch (e: any) {
      errors.push(`Failed to read plugin entry: ${e?.message || e}`);
    }

    return { valid: errors.length === 0, warnings, errors };
  }

  sanitizePluginData<T extends Record<string, any>>(data: T): T {
    const clone = { ...data };
    delete (clone as any).__proto__;
    delete (clone as any).constructor;
    return clone;
  }
}