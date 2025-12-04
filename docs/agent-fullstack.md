# Fullstack Security Scan & Prevention Checklist

## 1. Automated Code Scanning Tools

### Static Application Security Testing (SAST)

#### JavaScript/TypeScript Scanners

- [ ] **ESLint Security Plugins**

  ```bash
  npm install --save-dev eslint-plugin-security eslint-plugin-no-secrets
  ```

  - Detects: Hardcoded secrets, unsafe regex, eval usage
  - Config in `.eslintrc.json`:

  ```json
  {
    "plugins": ["security", "no-secrets"],
    "extends": ["plugin:security/recommended"],
    "rules": {
      "no-secrets/no-secrets": "error",
      "security/detect-object-injection": "warn"
    }
  }
  ```

- [ ] **SonarQube/SonarCloud**

  ```bash
  # Install scanner
  npm install -g sonarqube-scanner

  # Run scan
  sonar-scanner \
    -Dsonar.projectKey=your-project \
    -Dsonar.sources=. \
    -Dsonar.host.url=http://localhost:9000
  ```

  - Detects: Code smells, vulnerabilities, security hotspots
  - Supports: JavaScript, TypeScript, Python, Java, PHP

- [ ] **Semgrep**

  ```bash
  # Install
  pip install semgrep

  # Scan with security rules
  semgrep --config=auto .

  # Specific rule sets
  semgrep --config=p/security-audit \
          --config=p/secrets \
          --config=p/owasp-top-ten .
  ```

  - Fast, customizable security patterns
  - Detects: SQL injection, XSS, authentication issues

- [ ] **CodeQL (GitHub)**

  ```yaml
  # .github/workflows/codeql.yml
  name: 'CodeQL'
  on:
    push:
      branches: [main, develop]
    pull_request:
      branches: [main]

  jobs:
    analyze:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: github/codeql-action/init@v2
          with:
            languages: javascript, typescript
        - uses: github/codeql-action/analyze@v2
  ```

### Secret Scanning

- [ ] **TruffleHog**

  ```bash
  # Install
  pip install truffleHog

  # Scan entire git history
  truffleHog git https://github.com/user/repo

  # Scan local directory
  truffleHog filesystem ./
  ```

  - Detects: API keys, passwords, tokens in git history

- [ ] **GitGuardian**

  ```bash
  # Install ggshield
  pip install ggshield

  # Scan commits
  ggshield secret scan repo .

  # Pre-commit hook
  ggshield secret scan pre-commit
  ```

  - Real-time secret detection
  - Dashboard for monitoring

- [ ] **git-secrets (AWS)**

  ```bash
  # Install
  brew install git-secrets

  # Setup
  git secrets --install
  git secrets --register-aws

  # Scan
  git secrets --scan
  ```

## 2. Dependency & Package Scanning

### Package.json Security Analysis

- [ ] **npm audit**

  ```bash
  # Run audit
  npm audit

  # Show full details
  npm audit --json > audit-report.json

  # Fix automatically (with caution)
  npm audit fix

  # Fix breaking changes
  npm audit fix --force
  ```

- [ ] **pnpm audit**

  ```bash
  # Run audit
  pnpm audit

  # Get machine-readable output
  pnpm audit --json

  # Fix vulnerabilities
  pnpm audit --fix
  ```

- [ ] **yarn audit**

  ```bash
  # Run audit
  yarn audit

  # Get JSON output
  yarn audit --json
  ```

- [ ] **Snyk**

  ```bash
  # Install
  npm install -g snyk

  # Authenticate
  snyk auth

  # Test for vulnerabilities
  snyk test

  # Monitor project
  snyk monitor

  # Test specific package.json
  snyk test --file=apps/web/package.json

  # Fix vulnerabilities
  snyk fix
  ```

- [ ] **OWASP Dependency-Check**

  ```bash
  # Install via brew
  brew install dependency-check

  # Scan project
  dependency-check --scan . --out ./reports

  # Scan specific files
  dependency-check --scan package.json --out ./reports
  ```

- [ ] **Retire.js** (JavaScript library checker)

  ```bash
  # Install
  npm install -g retire

  # Scan project
  retire --path .

  # Scan with npm packages
  retire --package

  # Output JSON
  retire --outputformat json --outputpath retire-report.json
  ```

- [ ] **npm-check-updates**

  ```bash
  # Install
  npm install -g npm-check-updates

  # Check for updates
  ncu

  # Check vulnerabilities specifically
  ncu --target newest

  # Update package.json
  ncu -u
  ```

### Package.json Audit Checklist

```json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "check:outdated": "npm outdated",
    "check:licenses": "license-checker --summary",
    "security:scan": "snyk test && npm audit"
  },
  "devDependencies": {
    "eslint-plugin-security": "^3.0.0",
    "eslint-plugin-no-secrets": "^1.0.0"
  }
}
```

- [ ] No wildcards (`*`) or loose version ranges in dependencies
- [ ] Critical packages use exact versions (`1.2.3` not `^1.2.3`)
- [ ] Lock file committed (package-lock.json, pnpm-lock.yaml)
- [ ] Regular dependency updates scheduled
- [ ] Pre-commit hooks for security checks

## 3. API Security Scanning

### API Endpoint Testing

- [ ] **OWASP ZAP (Zed Attack Proxy)**

  ```bash
  # Docker installation
  docker run -t owasp/zap2docker-stable zap-baseline.py \
    -t https://api.example.com

  # Full scan
  docker run -t owasp/zap2docker-stable zap-full-scan.py \
    -t https://api.example.com

  # API scan
  docker run -t owasp/zap2docker-stable zap-api-scan.py \
    -t https://api.example.com/openapi.json \
    -f openapi
  ```

- [ ] **Burp Suite**
  - Manual testing for API vulnerabilities
  - Automated scanning available in Pro version
  - Test cases:
    - Authentication bypass
    - Authorization flaws
    - Injection attacks
    - Rate limiting

- [ ] **Postman Security Testing**

  ```javascript
  // Collection pre-request script
  pm.test('Check for security headers', function () {
    pm.expect(pm.response.headers.get('X-Content-Type-Options')).to.equal('nosniff');
    pm.expect(pm.response.headers.get('X-Frame-Options')).to.exist;
  });

  // Test for sensitive data exposure
  pm.test("Response doesn't contain sensitive data", function () {
    const responseBody = pm.response.text();
    pm.expect(responseBody).to.not.include('password');
    pm.expect(responseBody).to.not.include('secret');
    pm.expect(responseBody).to.not.include('api_key');
  });
  ```

- [ ] **API Security Checklist**
  - [ ] Authentication required on all endpoints (except public)
  - [ ] Authorization checks for each resource
  - [ ] Input validation on all parameters
  - [ ] Output encoding to prevent XSS
  - [ ] Rate limiting implemented
  - [ ] CORS configured correctly
  - [ ] Security headers present
  - [ ] Error messages don't leak information
  - [ ] HTTPS enforced (no HTTP)
  - [ ] API versioning implemented

### API Vulnerability Scanning

- [ ] **SQLMap** (SQL Injection Testing)

  ```bash
  # Install
  git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git

  # Test API endpoint
  python sqlmap.py -u "https://api.example.com/users?id=1" \
    --batch --headers="Authorization: Bearer TOKEN"

  # Test POST request
  python sqlmap.py -u "https://api.example.com/login" \
    --data="username=admin&password=test" \
    --method=POST
  ```

- [ ] **Nuclei** (Vulnerability Scanner)

  ```bash
  # Install
  go install -v github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest

  # Scan API
  nuclei -u https://api.example.com -t exposures/ -t vulnerabilities/

  # Scan with specific templates
  nuclei -u https://api.example.com -t cves/ -t exposures/apis/
  ```

- [ ] **Astra Security Scanner**

  ```bash
  # Install via npm
  npm install -g @getastra/astra-cli

  # Scan API
  astra scan https://api.example.com
  ```

## 4. External Library Security

### Third-Party Library Scanning

- [ ] **Checkmarx SCA (Software Composition Analysis)**
  - Scans all third-party dependencies
  - Identifies vulnerabilities and licenses
  - Integration with CI/CD

- [ ] **WhiteSource/Mend**
  - Automated open-source security
  - Real-time vulnerability alerts
  - License compliance

- [ ] **Snyk Open Source**

  ```bash
  # Test all dependencies
  snyk test --all-projects

  # Monitor continuously
  snyk monitor

  # Check for malicious packages
  snyk test --prune-repeated-subdependencies
  ```

- [ ] **Socket.dev**

  ```bash
  # Install
  npm install -g @socketsecurity/cli

  # Scan for supply chain attacks
  socket scan

  # Check specific package
  socket info <package-name>
  ```

- [ ] **npm-audit-resolver**

  ```bash
  # Install
  npm install -g npm-audit-resolver

  # Check and resolve audits
  npm-audit-resolver check
  npm-audit-resolver resolve
  ```

### CDN & External Script Scanning

- [ ] **Subresource Integrity (SRI) Checker**

  ```html
  <!-- Always use SRI for external scripts -->
  <script
    src="https://cdn.example.com/library.js"
    integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
    crossorigin="anonymous"
  ></script>
  ```

- [ ] **CSP Evaluator**
  - Test CSP policies at https://csp-evaluator.withgoogle.com/
  - Identifies bypass opportunities

- [ ] Audit all external scripts in HTML/JSX:
  ```bash
  # Find all external script references
  grep -r "https://" . --include=\*.{js,jsx,ts,tsx,html} | grep -E "(src=|href=)"
  ```

### Library Security Checklist

- [ ] Review GitHub stars and last commit date
- [ ] Check npm weekly downloads (popular = more scrutinized)
- [ ] Verify package maintainer reputation
- [ ] Check for known CVEs in library
- [ ] Review library permissions/access
- [ ] Verify official documentation exists
- [ ] Check for typosquatting (similar package names)
- [ ] Review bundle size (suspiciously large?)
- [ ] Verify license compatibility

## 5. CI/CD Security Integration

### GitHub Actions Security Workflow

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0' # Weekly scan

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Full history for secret scanning

      # Dependency scanning
      - name: Run npm audit
        run: npm audit --audit-level=moderate

      # Snyk scanning
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      # Secret scanning
      - name: TruffleHog
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD

      # Code scanning
      - name: Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/secrets
            p/owasp-top-ten

      # SAST scanning
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

      # License checking
      - name: License Check
        run: npx license-checker --summary

  api-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # OWASP ZAP API scan
      - name: ZAP Scan
        uses: zaproxy/action-api-scan@v0.7.0
        with:
          target: 'https://api.staging.example.com'
          rules_file_name: '.zap/rules.tsv'
          cmd_options: '-a'
```

### GitLab CI Security Pipeline

```yaml
# .gitlab-ci.yml
stages:
  - security
  - test

security_scan:
  stage: security
  script:
    - npm audit
    - npm install -g snyk
    - snyk auth $SNYK_TOKEN
    - snyk test --severity-threshold=high
    - snyk monitor
  only:
    - merge_requests
    - main

dependency_scanning:
  stage: security
  image: registry.gitlab.com/gitlab-org/security-products/analyzers/gemnasium:latest
  script:
    - /analyzer run
  artifacts:
    reports:
      dependency_scanning: gl-dependency-scanning-report.json

secret_detection:
  stage: security
  image: registry.gitlab.com/gitlab-org/security-products/analyzers/secrets:latest
  script:
    - /analyzer run
  artifacts:
    reports:
      secret_detection: gl-secret-detection-report.json

sast:
  stage: security
  image: registry.gitlab.com/gitlab-org/security-products/analyzers/semgrep:latest
  script:
    - /analyzer run
  artifacts:
    reports:
      sast: gl-sast-report.json
```

## 6. Pre-commit Hooks

### Husky + lint-staged Configuration

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run security:check",
      "pre-push": "npm audit"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix --max-warnings=0", "prettier --write"]
  },
  "scripts": {
    "security:check": "npm audit && git secrets --scan",
    "prepare": "husky install"
  }
}
```

### Git Hooks Setup

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running security checks..."

# Check for secrets
if command -v git-secrets &> /dev/null; then
    git secrets --scan
fi

# Run npm audit
if [ -f "package.json" ]; then
    npm audit --audit-level=moderate
    if [ $? -ne 0 ]; then
        echo "❌ npm audit found vulnerabilities"
        exit 1
    fi
fi

# Check for hardcoded secrets in staged files
git diff --cached --name-only | while read file; do
    if grep -i -E "(api_key|apikey|secret|password|token).*=.*['\"][^'\"]{8,}" "$file"; then
        echo "❌ Potential secret found in $file"
        exit 1
    fi
done

echo "✅ Security checks passed"
```

## 7. Docker Security Scanning

```bash
# Trivy (Container vulnerability scanner)
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image your-image:tag

# Snyk Container
snyk container test your-image:tag

# Docker Scan (built-in)
docker scan your-image:tag

# Anchore
anchore-cli image add your-image:tag
anchore-cli image wait your-image:tag
anchore-cli image vuln your-image:tag all
```

## 8. Database Security Scanning

```bash
# MongoDB
npm install -g mongodb-security-checker
mongo-security-checker --host localhost --port 27017

# PostgreSQL
# Check for default passwords
psql -h localhost -U postgres -c "\du"

# MySQL
# Run mysql_secure_installation
mysql_secure_installation

# Check for SQL injection in queries
semgrep --config=p/sql-injection .
```

## 9. Environment Variable Security

### .env File Scanner

```bash
# Check for exposed .env files
find . -name ".env*" -not -path "*/node_modules/*" -exec cat {} \;

# Verify .gitignore includes .env
grep -q "^\.env" .gitignore || echo "⚠️  .env not in .gitignore"

# Check for .env in git history
git log --all --full-history -- "*/.env*"
```

### Environment Variable Validator

```javascript
// scripts/validate-env.js
const requiredEnvVars = ['DATABASE_URL', 'API_KEY', 'JWT_SECRET'];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:', missingVars);
  process.exit(1);
}

// Check for default/weak values
const weakPatterns = [
  { name: 'JWT_SECRET', pattern: /^(secret|password|12345)$/i },
  { name: 'DATABASE_URL', pattern: /localhost/ },
];

weakPatterns.forEach(({ name, pattern }) => {
  if (process.env[name] && pattern.test(process.env[name])) {
    console.warn(`⚠️  Weak ${name} detected`);
  }
});
```

## 10. Security Reporting & Dashboard

### Automated Security Report Script

```javascript
// scripts/security-report.js
const { execSync } = require('child_process');
const fs = require('fs');

const report = {
  timestamp: new Date().toISOString(),
  checks: [],
};

function runCheck(name, command) {
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    report.checks.push({
      name,
      status: 'passed',
      output: output.trim(),
    });
  } catch (error) {
    report.checks.push({
      name,
      status: 'failed',
      error: error.message,
      output: error.stdout,
    });
  }
}

// Run checks
runCheck('NPM Audit', 'npm audit --json');
runCheck('Outdated Packages', 'npm outdated --json');
runCheck('Snyk Test', 'snyk test --json');
runCheck('ESLint Security', 'eslint . --ext .js,.jsx,.ts,.tsx');

// Generate report
fs.writeFileSync('security-report.json', JSON.stringify(report, null, 2));

console.log('✅ Security report generated: security-report.json');

// Exit with error if any check failed
const failed = report.checks.filter((c) => c.status === 'failed');
if (failed.length > 0) {
  console.error(`❌ ${failed.length} security checks failed`);
  process.exit(1);
}
```

## 11. Quick Security Scan Script

```bash
#!/bin/bash
# security-scan.sh

echo "🔍 Starting Security Scan..."
echo "=============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

# Function to run check
run_check() {
    echo -e "\n${YELLOW}▶ $1${NC}"
    if eval "$2"; then
        echo -e "${GREEN}✓ Passed${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
        FAILED=$((FAILED + 1))
    fi
}

# Dependency checks
run_check "NPM Audit" "npm audit --audit-level=moderate"
run_check "Outdated Packages" "npm outdated"
run_check "Snyk Test" "snyk test --severity-threshold=high"

# Secret scanning
run_check "Secret Detection" "trufflehog filesystem . --json"
run_check "Git Secrets" "git secrets --scan"

# Code scanning
run_check "ESLint Security" "eslint . --ext .js,.jsx,.ts,.tsx"
run_check "Semgrep" "semgrep --config=auto ."

# Check for sensitive files
run_check "Sensitive Files" "! find . -name '.env' -not -path '*/node_modules/*' | grep -q '.'"

# Environment checks
run_check "Environment Variables" "node scripts/validate-env.js"

# Docker scanning (if Dockerfile exists)
if [ -f "Dockerfile" ]; then
    run_check "Docker Security" "docker scan -f Dockerfile ."
fi

echo -e "\n=============================="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All security checks passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ $FAILED security check(s) failed${NC}"
    exit 1
fi
```

## 12. Security Monitoring Schedule

### Daily

- [ ] Automated dependency scanning in CI/CD
- [ ] Monitor for new CVEs in used packages
- [ ] Review error logs for suspicious patterns

### Weekly

- [ ] Run full security scan (all tools)
- [ ] Review and update dependencies
- [ ] Check for new security patches

### Monthly

- [ ] Manual penetration testing of APIs
- [ ] Review and update security policies
- [ ] Audit user permissions and access logs
- [ ] Review third-party integrations

### Quarterly

- [ ] Comprehensive security audit
- [ ] Review and update security tools
- [ ] Security training for development team
- [ ] Threat modeling review

## 13. Essential Security Tools Summary

| Tool            | Purpose                    | Install                           | Cost      |
| --------------- | -------------------------- | --------------------------------- | --------- |
| npm audit       | Dependency vulnerabilities | Built-in                          | Free      |
| Snyk            | Comprehensive security     | `npm i -g snyk`                   | Free tier |
| ESLint Security | Code patterns              | `npm i -D eslint-plugin-security` | Free      |
| Semgrep         | SAST scanning              | `pip install semgrep`             | Free      |
| TruffleHog      | Secret detection           | `pip install truffleHog`          | Free      |
| OWASP ZAP       | API security testing       | Docker                            | Free      |
| SonarQube       | Code quality + security    | Docker/Cloud                      | Free tier |
| Trivy           | Container scanning         | Binary/Docker                     | Free      |
| CodeQL          | Advanced SAST              | GitHub Actions                    | Free (GH) |
| GitGuardian     | Secret monitoring          | CLI/Cloud                         | Free tier |

## 14. Compliance & Best Practices

- [ ] **OWASP Top 10** - Address all vulnerabilities
- [ ] **CWE Top 25** - Common Weakness Enumeration
- [ ] **SANS Top 25** - Most dangerous software errors
- [ ] **PCI DSS** - If handling payments
- [ ] **GDPR** - If handling EU user data
- [ ] **SOC 2** - For enterprise customers
- [ ] **ISO 27001** - Information security management

---

**Last Updated**: December 2024  
**Version**: 2.0  
**Maintainer**: Security Team

## Quick Start Command

```bash
# One-line security check
npm audit && snyk test && semgrep --config=auto . && git secrets --scan
```
