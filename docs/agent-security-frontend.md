# Frontend Security Checklist for React.js & Next.js (Turborepo)

## 1. Authentication & Authorization

### React/Next.js Specific

- [ ] Verify JWT tokens are stored securely (httpOnly cookies preferred over localStorage)
- [ ] Check for token expiration and refresh token implementation
- [ ] Ensure authentication state is properly managed (Context API, Zustand, Redux)
- [ ] Verify protected routes have proper authentication guards
- [ ] Check for auth token exposure in browser console/network tab
- [ ] Validate session timeout implementation
- [ ] Review Next.js middleware for auth checks on server-side routes

### Implementation Checks

- [ ] No hardcoded credentials or API keys in code
- [ ] Authentication tokens not stored in localStorage (XSS vulnerable)
- [ ] Proper logout functionality that clears all auth data
- [ ] Multi-factor authentication (MFA) properly implemented if required

## 2. Cross-Site Scripting (XSS) Prevention

### React-Specific Protections

- [ ] Verify React's automatic XSS protection is not bypassed with `dangerouslySetInnerHTML`
- [ ] If `dangerouslySetInnerHTML` is used, ensure content is sanitized with DOMPurify
- [ ] Check for direct DOM manipulation that bypasses React
- [ ] Validate user input rendering in JSX
- [ ] Review third-party components for XSS vulnerabilities

### Common XSS Vectors

- [ ] URL parameters properly sanitized before rendering
- [ ] User-generated content escaped and sanitized
- [ ] SVG uploads sanitized (can contain JavaScript)
- [ ] Markdown rendering uses safe parsers
- [ ] No `eval()` or `Function()` constructor with user input

## 3. Cross-Site Request Forgery (CSRF)

- [ ] CSRF tokens implemented for state-changing operations
- [ ] Next.js API routes protected with CSRF middleware
- [ ] SameSite cookie attribute set (`SameSite=Strict` or `Lax`)
- [ ] Verify `Origin` and `Referer` headers on server
- [ ] Double submit cookie pattern implemented if applicable

## 4. Content Security Policy (CSP)

### Next.js Configuration

- [ ] CSP headers configured in `next.config.js` or middleware
- [ ] Inline scripts use nonces or hashes
- [ ] External scripts whitelisted by domain
- [ ] `unsafe-inline` and `unsafe-eval` avoided
- [ ] Review CSP violations in console

```javascript
// Example next.config.js CSP
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
`;
```

## 5. Dependency Security

### Turborepo Monorepo Checks

- [ ] Run `npm audit` or `pnpm audit` in all workspace packages
- [ ] Check for outdated packages: `npm outdated` or `pnpm outdated`
- [ ] Review package-lock.json/pnpm-lock.yaml for suspicious changes
- [ ] Verify all dependencies come from trusted sources
- [ ] Use tools like Snyk or Dependabot for automated scanning
- [ ] Check for typosquatting in package names
- [ ] Review transitive dependencies for vulnerabilities

### Package Management

- [ ] Lock file (package-lock.json, pnpm-lock.yaml) committed to repo
- [ ] Node version specified in `.nvmrc` or `package.json`
- [ ] Use exact versions for critical packages (no `^` or `~`)

## 6. API Security

### Frontend API Calls

- [ ] API keys not exposed in frontend code
- [ ] Sensitive data not logged in console.log statements
- [ ] HTTPS used for all API requests
- [ ] API responses validated and sanitized
- [ ] Error messages don't leak sensitive information
- [ ] Rate limiting implemented on API routes
- [ ] Proper CORS configuration in Next.js API routes

### Next.js API Routes

- [ ] Input validation on all API route handlers
- [ ] Authentication middleware applied to protected routes
- [ ] Proper HTTP methods enforced (GET, POST, etc.)
- [ ] Request body size limits configured
- [ ] SQL injection prevention (use parameterized queries)

## 7. Data Exposure & Privacy

- [ ] No sensitive data in URLs (use POST body instead)
- [ ] Console.log statements removed or disabled in production
- [ ] Source maps disabled in production build
- [ ] Environment variables properly configured (.env files)
- [ ] Secrets not committed to git (check .gitignore)
- [ ] PII (Personally Identifiable Information) encrypted
- [ ] Local storage/session storage doesn't contain sensitive data

### Environment Variables

```bash
# Check for proper environment variable usage
- [ ] NEXT_PUBLIC_ prefix only for non-sensitive client-side vars
- [ ] Server-side secrets without NEXT_PUBLIC_ prefix
- [ ] .env.local in .gitignore
- [ ] Example .env.example file provided
```

## 8. Third-Party Integrations

- [ ] Review all third-party scripts (analytics, ads, widgets)
- [ ] Use Subresource Integrity (SRI) for CDN resources
- [ ] Audit permissions requested by third-party libraries
- [ ] Verify third-party domains in CSP
- [ ] Check for outdated/unmaintained libraries
- [ ] Review privacy policies of third-party services

## 9. Build & Deployment Security

### Turborepo Specific

- [ ] Build process runs security checks (audit, lint)
- [ ] Separate build pipelines for different apps in monorepo
- [ ] Shared packages (@repo/ui, @repo/config) audited for vulnerabilities
- [ ] Build artifacts don't contain sensitive information

### Next.js Build

- [ ] Production build tested before deployment (`next build`)
- [ ] Security headers configured in production
- [ ] Next.js security features enabled (Strict Mode, etc.)
- [ ] Image optimization configured securely
- [ ] Middleware properly protects routes

### Deployment

- [ ] Environment-specific configurations (dev, staging, prod)
- [ ] CI/CD pipeline includes security scanning
- [ ] Infrastructure as Code (IaC) reviewed for misconfigurations
- [ ] Secrets management system used (not hardcoded)

## 10. Client-Side Vulnerabilities

### React Component Security

- [ ] Props validated with PropTypes or TypeScript
- [ ] User input sanitized before state updates
- [ ] Event handlers don't execute untrusted code
- [ ] File uploads validated (type, size, content)
- [ ] Image uploads checked for malicious code

### Next.js Specific

- [ ] Server-side rendering (SSR) doesn't expose secrets
- [ ] getServerSideProps sanitizes data before passing to client
- [ ] Static generation (SSG) doesn't embed sensitive data
- [ ] Incremental Static Regeneration (ISR) properly secured

## 11. Session Management

- [ ] Session IDs are random and unpredictable
- [ ] Sessions expire after inactivity
- [ ] Concurrent session limits implemented
- [ ] Session fixation protection
- [ ] Secure cookie flags set (`HttpOnly`, `Secure`, `SameSite`)

## 12. Input Validation & Sanitization

- [ ] Client-side validation implemented (UX)
- [ ] Server-side validation enforced (security)
- [ ] File upload validation (type, size, magic bytes)
- [ ] URL validation for external links
- [ ] Email validation with proper regex
- [ ] Form validation libraries used (Zod, Yup, React Hook Form)

### Common Input Vulnerabilities

- [ ] SQL injection prevention (use ORMs/prepared statements)
- [ ] NoSQL injection prevention
- [ ] Command injection prevention
- [ ] Path traversal prevention in file operations
- [ ] XML External Entity (XXE) prevention

## 13. Security Headers

Configure in Next.js `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];
```

- [ ] All security headers implemented
- [ ] HSTS header configured
- [ ] X-Frame-Options prevents clickjacking
- [ ] X-Content-Type-Options prevents MIME sniffing
- [ ] Referrer-Policy configured appropriately
- [ ] Permissions-Policy restricts sensitive features

## 14. Logging & Monitoring

- [ ] Error boundaries implemented to catch React errors
- [ ] Error logging configured (Sentry, LogRocket, etc.)
- [ ] Sensitive data not logged to monitoring services
- [ ] Client-side errors reported without exposing system details
- [ ] Monitoring for unusual patterns (repeated failed logins)
- [ ] Performance monitoring doesn't leak data

## 15. Mobile & PWA Security

- [ ] Service worker properly secured
- [ ] Manifest.json configured securely
- [ ] Push notifications properly authenticated
- [ ] Offline data storage encrypted
- [ ] Web app manifest doesn't expose sensitive info

## 16. TypeScript & Code Quality

- [ ] TypeScript strict mode enabled
- [ ] No `any` types for security-critical code
- [ ] ESLint security plugins configured (eslint-plugin-security)
- [ ] Code reviews include security considerations
- [ ] Sensitive logic on server-side, not client-side

## 17. Turborepo Specific Checks

### Workspace Configuration

- [ ] Shared ESLint config includes security rules
- [ ] Shared Prettier config enforces consistent formatting
- [ ] Shared TypeScript config has strict settings
- [ ] Package versions synchronized across workspaces
- [ ] Build cache doesn't contain sensitive data

### Monorepo Structure

```
turborepo/
├── apps/
│   ├── web/              # Next.js app
│   └── admin/            # Admin dashboard
├── packages/
│   ├── ui/               # Shared UI components
│   ├── config/           # Shared configs (ESLint, TS)
│   └── auth/             # Shared auth logic
└── turbo.json
```

- [ ] Each app has its own security review
- [ ] Shared packages audited for vulnerabilities
- [ ] No circular dependencies between packages
- [ ] Clear separation of concerns

## 18. Regular Security Practices

- [ ] Security audit performed quarterly
- [ ] Penetration testing conducted annually
- [ ] Bug bounty program considered
- [ ] Security training for developers
- [ ] Incident response plan documented
- [ ] Regular backup and recovery testing

## Tools & Resources

### Automated Security Tools

- **npm audit / pnpm audit**: Check for vulnerable dependencies
- **Snyk**: Continuous security monitoring
- **OWASP ZAP**: Web application security scanner
- **ESLint plugins**: eslint-plugin-security, eslint-plugin-no-secrets
- **SonarQube**: Code quality and security analysis
- **Dependabot**: Automated dependency updates

### Manual Testing

- Browser DevTools for inspecting requests/storage
- Burp Suite for penetration testing
- Chrome Lighthouse for security audits
- OWASP Testing Guide

### Next.js Security Resources

- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/security.html)

## Priority Levels

🔴 **Critical**: Must be fixed immediately

- Authentication bypass
- XSS vulnerabilities
- Exposed secrets/API keys
- SQL injection

🟡 **High**: Should be fixed soon

- Missing security headers
- Outdated critical dependencies
- Weak session management

🟢 **Medium**: Should be addressed

- Console.log statements
- Missing input validation
- CSP improvements

⚪ **Low**: Nice to have

- Code organization
- Documentation improvements
- Performance optimizations

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: Security Team
