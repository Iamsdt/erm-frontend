# Security Guide

This document outlines security best practices and implementations for this React application.

## Table of Contents

1. [Security Headers](#security-headers)
2. [HTML Sanitization](#html-sanitization)
3. [Production Build Verification](#production-build-verification)
4. [HTTPS Enforcement](#https-enforcement)
5. [Input Validation](#input-validation)

---

## Security Headers

### Implementation

Security headers have been added to `index.html` to protect against common attacks:

- **X-Frame-Options: DENY** - Prevents clickjacking attacks
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information
- **Permissions-Policy** - Restricts browser features
- **Content-Security-Policy (CSP)** - Prevents XSS attacks

### Content Security Policy (CSP)

The CSP is configured in `index.html`. Adjust it based on your needs:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
/>
```

**Note:** `'unsafe-inline'` and `'unsafe-eval'` are needed for Vite in development. For production, consider:

- Using nonces for inline scripts
- Removing `'unsafe-eval'` if possible
- Restricting `connect-src` to your API domains only

### Server-Side Headers

For additional security, configure your web server (Nginx, Apache, etc.) to set these headers:

**Nginx Example:**

```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';" always;
```

**Apache Example:**

```apache
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

---

## HTML Sanitization

### Installation

Install DOMPurify for HTML sanitization:

```bash
npm install dompurify
```

### Usage

#### Basic Sanitization

```javascript
import { sanitizeHtml } from '@/lib/utils/sanitize'

// Sanitize user-generated HTML
const userContent = "<p>Hello <script>alert('XSS')</script> World</p>"
const safe = sanitizeHtml(userContent)
// Result: "<p>Hello  World</p>" (script tag removed)

// Render safely
<div dangerouslySetInnerHTML={{ __html: safe }} />
```

#### Using the React Component

```javascript
import { SanitizedHtml } from "@/lib/utils/sanitize"

function Comment({ content }) {
  return (
    <div>
      <SanitizedHtml html={content} className="comment-content" />
    </div>
  )
}
```

#### Plain Text Sanitization

```javascript
import { sanitizeText } from "@/lib/utils/sanitize"

const userInput = "<script>alert('XSS')</script>Hello"
const safe = sanitizeText(userInput)
// Result: "Hello" (all HTML stripped)
```

### When to Use

**Always sanitize:**

- User-generated content (comments, posts, reviews)
- Content from external APIs
- Content stored in database
- Rich text editor output

**You don't need to sanitize:**

- Hardcoded strings in your code
- Content from trusted sources (your own CMS)
- Content already validated server-side

### Configuration

Customize allowed tags and attributes:

```javascript
import { sanitizeHtml } from "@/lib/utils/sanitize"

const options = {
  ALLOWED_TAGS: ["p", "strong", "em", "a"],
  ALLOWED_ATTR: ["href", "title"],
}

const safe = sanitizeHtml(userContent, options)
```

---

## Production Build Verification

### Console and Debugger Removal

The build configuration automatically removes `console` and `debugger` statements in production:

```javascript
// vite.config.js
esbuild: {
  drop: ["console", "debugger"], // Removes console & debugger in prod
}
```

### Verification Steps

1. **Build for production:**

   ```bash
   npm run build
   ```

2. **Preview the production build:**

   ```bash
   npm run preview
   ```

3. **Verify:**

   - Open browser DevTools
   - Check Console tab - should be empty (no console.log statements)
   - Check Network tab - verify no debug endpoints
   - Verify Redux DevTools are not accessible

4. **Automated Check Script:**

Create `scripts/verify-production.js`:

```javascript
#!/usr/bin/env node

import { readFileSync } from "fs"
import { join } from "path"

const distPath = join(process.cwd(), "dist")
const indexPath = join(distPath, "index.html")

try {
  const html = readFileSync(indexPath, "utf-8")

  // Check for console statements
  if (html.includes("console.")) {
    console.error("❌ Production build contains console statements!")
    process.exit(1)
  }

  // Check for debugger statements
  if (html.includes("debugger")) {
    console.error("❌ Production build contains debugger statements!")
    process.exit(1)
  }

  console.log("✅ Production build verified - no debug code found")
} catch (error) {
  console.error("❌ Could not verify production build:", error.message)
  process.exit(1)
}
```

Add to `package.json`:

```json
{
  "scripts": {
    "build:verify": "npm run build && node scripts/verify-production.js"
  }
}
```

---

## HTTPS Enforcement

### Client-Side Enforcement

While HTTPS should primarily be enforced server-side, you can add client-side checks:

#### 1. Service Worker Check

Create `public/sw-https.js`:

```javascript
// Service Worker HTTPS enforcement
if (
  self.location.protocol !== "https:" &&
  self.location.hostname !== "localhost"
) {
  self.location.replace(
    "https:" + self.location.href.substring(self.location.protocol.length)
  )
}
```

#### 2. Meta Tag (Limited Effectiveness)

```html
<!-- Note: This has limited browser support -->
<meta
  http-equiv="Strict-Transport-Security"
  content="max-age=31536000; includeSubDomains"
/>
```

### Server-Side Enforcement (Recommended)

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name example.com;

    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # HSTS header
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Your app configuration
    root /path/to/dist;
    index index.html;
}
```

**Apache Configuration:**

```apache
<VirtualHost *:80>
    ServerName example.com
    Redirect permanent / https://example.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName example.com

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem

    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

    DocumentRoot /path/to/dist
</VirtualHost>
```

### Development

For local development, HTTP is acceptable. The enforcement should only apply in production:

```javascript
// src/lib/utils/https-check.js
export const enforceHTTPS = () => {
  if (
    import.meta.env.PROD &&
    window.location.protocol !== "https:" &&
    window.location.hostname !== "localhost"
  ) {
    window.location.replace(
      "https:" + window.location.href.substring(window.location.protocol.length)
    )
  }
}

// Call in main.jsx or App.jsx
if (import.meta.env.PROD) {
  enforceHTTPS()
}
```

---

## Input Validation

### Client-Side Validation

Use Zod for form validation (already implemented):

```javascript
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// Validate before submission
const result = schema.safeParse(formData)
```

### Server-Side Validation

**Important:** Always validate on the server. Client-side validation can be bypassed.

### Best Practices

1. **Validate Early:** Validate input as soon as it's received
2. **Whitelist, Don't Blacklist:** Allow only known good patterns
3. **Sanitize Output:** Sanitize when rendering, not just when storing
4. **Use Parameterized Queries:** Prevent SQL injection (server-side)
5. **Rate Limiting:** Implement rate limiting (server-side)

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Web Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/Security)

---

## Security Checklist

Before deploying to production:

- [ ] Security headers configured in `index.html`
- [ ] Server-side security headers configured
- [ ] DOMPurify installed and used for user content
- [ ] Production build verified (no console/debugger)
- [ ] HTTPS enforced (server-side)
- [ ] Environment variables secured (not in git)
- [ ] API endpoints use HTTPS
- [ ] Input validation on both client and server
- [ ] Error messages don't leak sensitive information
- [ ] Authentication tokens stored securely
