export class WebSecurityManager {
  private allowedOrigins: Set<string> = new Set();

  allowOrigin(origin: string) {
    this.allowedOrigins.add(origin);
  }

  isOriginAllowed(origin: string) {
    return this.allowedOrigins.size === 0 || this.allowedOrigins.has(origin);
  }
}
