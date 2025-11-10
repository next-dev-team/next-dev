import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export class SecurityManager {
  private allowedOrigins: string[] = ['localhost', '127.0.0.1', 'file://'];

  private restrictedModules: string[] = [
    'child_process',
    'cluster',
    'dgram',
    'fs',
    'net',
    'tls',
    'https',
    'http',
  ];

  async validatePlugin(pluginPath: string, metadata: any): Promise<void> {
    // Validate plugin manifest
    if (!metadata.name || !metadata.version) {
      throw new Error('Plugin must have name and version');
    }

    // Check for suspicious patterns in plugin code
    await this.scanPluginCode(pluginPath);

    // Validate plugin permissions
    this.validatePluginPermissions(metadata);

    // Generate plugin signature
    const signature = await this.generatePluginSignature(pluginPath);

    console.log(`Plugin ${metadata.name} validated with signature: ${signature}`);
  }

  private async scanPluginCode(pluginPath: string): Promise<void> {
    const codeFiles = await this.getCodeFiles(pluginPath);

    for (const file of codeFiles) {
      const content = await fs.readFile(file, 'utf-8');

      // Check for suspicious patterns
      const suspiciousPatterns = [
        /eval\s*\(/,
        /Function\s*\(/,
        /setTimeout\s*\(\s*["'].*["']/,
        /setInterval\s*\(\s*["'].*["']/,
        /require\s*\(\s*["']child_process["']/,
        /require\s*\(\s*["']fs["']/,
        /process\.env/,
        /process\.exit/,
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(content)) {
          throw new Error(`Suspicious pattern found in ${file}: ${pattern}`);
        }
      }
    }
  }

  private async getCodeFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await this.getCodeFiles(fullPath)));
      } else if (entry.isFile() && this.isCodeFile(entry.name)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private isCodeFile(filename: string): boolean {
    const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.json'];
    return codeExtensions.some((ext) => filename.endsWith(ext));
  }

  private validatePluginPermissions(metadata: any): void {
    // Check if plugin requests restricted permissions
    const permissions = metadata.permissions || [];

    for (const permission of permissions) {
      if (this.restrictedModules.includes(permission)) {
        throw new Error(`Plugin requests restricted permission: ${permission}`);
      }
    }
  }

  private async generatePluginSignature(pluginPath: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    const files = await this.getCodeFiles(pluginPath);

    // Sort files for consistent signature
    files.sort();

    for (const file of files) {
      const content = await fs.readFile(file);
      hash.update(content);
    }

    return hash.digest('hex');
  }

  isOriginAllowed(origin: string): boolean {
    return this.allowedOrigins.some((allowed) => origin.includes(allowed));
  }

  sanitizePluginData(data: any): any {
    // Sanitize plugin data to prevent XSS and other attacks
    if (typeof data === 'string') {
      return data
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizePluginData(data[key]);
        }
      }
      return sanitized;
    }

    return data;
  }
}
