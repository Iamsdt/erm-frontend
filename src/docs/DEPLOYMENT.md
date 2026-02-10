# Deployment Guide

Complete guide for deploying the Frontend Base application to various platforms and environments.

## 📋 Table of Contents

- [Overview](#overview)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Build Configuration](#build-configuration)
- [Environment Variables](#environment-variables)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [AWS S3 + CloudFront](#aws-s3--cloudfront)
  - [Docker](#docker)
  - [Nginx](#nginx)
- [CI/CD Setup](#cicd-setup)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Logging](#monitoring--logging)
- [Rollback Strategies](#rollback-strategies)
- [Troubleshooting](#troubleshooting)

## Overview

This application is a static site that can be deployed to any static hosting platform. The build process generates optimized static files that are served via CDN.

### Deployment Architecture

```
┌─────────────┐
│   GitHub    │
│  (Source)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   CI/CD     │  Build & Test
│  Pipeline   │  (GitHub Actions)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Build    │  npm run build
│   Process   │  → dist/
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     CDN     │  Static Files
│  (Hosting)  │  (Vercel, Netlify, etc.)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Users    │
└─────────────┘
```

## Pre-Deployment Checklist

### Code Quality

- [ ] All tests pass (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Test coverage meets requirements (80%+)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Preview build works (`npm run preview`)

### Security

- [ ] No sensitive data in code
- [ ] Environment variables properly configured
- [ ] API keys secured
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Dependencies up to date
- [ ] No known vulnerabilities (`npm audit`)

### Performance

- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Code splitting configured
- [ ] Lighthouse score > 90

### Features

- [ ] All features tested
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Offline support works (PWA)
- [ ] Analytics configured
- [ ] Error monitoring setup

### Documentation

- [ ] README updated
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] Deployment steps verified

## Build Configuration

### Production Build

```bash
# Create production build
npm run build

# Output directory: dist/
```

### Build Output

```
dist/
├── index.html              # Main HTML
├── assets/
│   ├── index-[hash].js    # Main bundle
│   ├── vendor-[hash].js   # Dependencies
│   ├── [route]-[hash].js  # Route chunks
│   └── [route]-[hash].css # Styles
└── public/                 # Static assets
    ├── manifest.json
    ├── sw.js
    └── ...
```

### Build Optimization

**vite.config.js:**

```javascript
export default defineConfig({
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          'ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            // ... other UI deps
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
```

## Environment Variables

### Required Variables

Create `.env.production` file:

```env
# API Configuration
VITE_API_BASE_URL=https://api.production.com
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_MSW=false
VITE_ENABLE_DEVTOOLS=false
VITE_ENABLE_MONITORING=true

# Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx

# App Configuration
VITE_APP_NAME=Frontend Base
VITE_APP_VERSION=1.0.0
```

### Environment-Specific Configs

**Development:**
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_MSW=true
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_MONITORING=false
```

**Staging:**
```env
VITE_API_BASE_URL=https://api.staging.com
VITE_ENABLE_MSW=false
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_MONITORING=true
```

**Production:**
```env
VITE_API_BASE_URL=https://api.production.com
VITE_ENABLE_MSW=false
VITE_ENABLE_DEVTOOLS=false
VITE_ENABLE_MONITORING=true
```

### Security Notes

- ⚠️ Never commit `.env` files
- ✅ Use platform-specific environment variable management
- ✅ Only expose variables prefixed with `VITE_`
- ✅ Store secrets in platform's secure storage

## Deployment Platforms

### Vercel

#### Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Deploy via Git Integration

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import Git repository

2. **Configure Build Settings**
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables
   - Set for Production, Preview, and Development

4. **Deploy**
   - Push to main branch
   - Automatic deployment triggered

#### vercel.json Configuration

```json
{
  "version": 2,
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/.*",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Netlify

#### Deploy via CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

#### Deploy via Git Integration

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Set Environment Variables**
   - Site settings → Build & deploy → Environment
   - Add variables

4. **Configure Redirects**
   
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

#### netlify.toml Configuration

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### AWS S3 + CloudFront

#### 1. Create S3 Bucket

```bash
# Create bucket
aws s3 mb s3://your-app-name

# Enable static website hosting
aws s3 website s3://your-app-name \
  --index-document index.html \
  --error-document index.html
```

#### 2. Configure Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-app-name/*"
    }
  ]
}
```

#### 3. Build and Upload

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-app-name \
  --delete \
  --cache-control "public, max-age=31536000, immutable"

# Upload index.html with short cache
aws s3 cp dist/index.html s3://your-app-name/index.html \
  --cache-control "public, max-age=0, must-revalidate"
```

#### 4. Setup CloudFront

1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Configure custom error responses:
   - 403 → /index.html (200)
   - 404 → /index.html (200)
4. Enable compression
5. Setup custom domain (optional)

#### Deployment Script

```bash
#!/bin/bash
# deploy-aws.sh

set -e

echo "Building..."
npm run build

echo "Uploading to S3..."
aws s3 sync dist/ s3://your-app-name \
  --delete \
  --exclude "index.html" \
  --cache-control "public, max-age=31536000, immutable"

aws s3 cp dist/index.html s3://your-app-name/index.html \
  --cache-control "public, max-age=0, must-revalidate"

echo "Invalidating CloudFront..."
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

### Docker

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Build and Run

```bash
# Build image
docker build -t frontend-base:latest .

# Run container
docker run -p 8080:80 frontend-base:latest

# Or with docker-compose
docker-compose up -d
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:80"
    environment:
      - VITE_API_BASE_URL=${API_BASE_URL}
    restart: unless-stopped
```

### Nginx (Direct)

#### Install Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Configure Site

```nginx
# /etc/nginx/sites-available/frontend-base

server {
    listen 80;
    server_name your-domain.com;

    root /var/www/frontend-base;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # Static assets with long cache
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # HTML with no cache
    location ~* \.html$ {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

#### Enable Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/frontend-base /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

#### Deploy Files

```bash
# Build locally
npm run build

# Upload to server
rsync -avz --delete dist/ user@server:/var/www/frontend-base/

# Set permissions
sudo chown -R www-data:www-data /var/www/frontend-base
```

## CI/CD Setup

### GitHub Actions

**.github/workflows/deploy.yml:**

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_ENABLE_MONITORING: true
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: dist
```

## Performance Optimization

### 1. Caching Strategy

```nginx
# Long cache for assets (1 year)
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# No cache for HTML
location ~* \.html$ {
    expires 0;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}

# Medium cache for other files
location ~* \.(jpg|jpeg|png|gif|svg|ico|css|js)$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800";
}
```

### 2. Compression

Enable Gzip/Brotli compression:

```nginx
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Brotli (if available)
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 3. CDN Configuration

- Use CDN for static assets
- Enable HTTP/2
- Configure proper cache headers
- Enable compression
- Setup custom domain

## Monitoring & Logging

### Error Monitoring (Sentry)

```javascript
// src/lib/monitoring.js
import * as Sentry from '@sentry/react'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0,
  })
}
```

### Performance Monitoring

```javascript
// src/lib/performance.js
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

const sendToAnalytics = (metric) => {
  // Send to analytics service
  console.log(metric)
}

onCLS(sendToAnalytics)
onFID(sendToAnalytics)
onFCP(sendToAnalytics)
onLCP(sendToAnalytics)
onTTFB(sendToAnalytics)
```

### Analytics

```javascript
// Google Analytics
window.gtag('config', import.meta.env.VITE_GA_TRACKING_ID)
```

## Rollback Strategies

### Vercel

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Netlify

```bash
# List deployments
netlify deploy:list

# Rollback via UI or CLI
netlify rollback
```

### AWS S3

```bash
# Keep previous builds
aws s3 sync dist/ s3://your-app-name/releases/$(date +%Y%m%d-%H%M%S)/

# Rollback by syncing previous release
aws s3 sync s3://your-app-name/releases/PREVIOUS_DATE/ s3://your-app-name/
```

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules dist .vite
npm install
npm run build
```

### 404 on Refresh

Ensure SPA fallback is configured:
- Vercel: `vercel.json` routes
- Netlify: `_redirects` file
- Nginx: `try_files $uri /index.html`

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_`
- Check platform environment variable configuration
- Rebuild after changing variables

### Large Bundle Size

```bash
# Analyze bundle
npm run build -- --analyze

# Check what's included
npm run build -- --mode=production --minify
```

---

**For more information:**
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [AWS S3 Static Website](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
