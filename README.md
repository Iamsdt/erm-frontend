# Frontend Base - Production-Ready React Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg)](https://vitejs.dev/)
[![TypeScript Ready](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://www.typescriptlang.org/)

A modern, production-ready React application boilerplate with best practices, comprehensive testing, and advanced features built-in.

## 🚀 Features

### Core Features

- ⚡ **Lightning Fast** - Built with Vite for instant HMR and optimized builds
- 🎯 **Modern Stack** - React 19, React Router 7, TanStack Query v5
- 🎨 **Beautiful UI** - Radix UI components with Tailwind CSS 4
- 🔐 **State Management** - Redux Toolkit with persistence
- 🌐 **Internationalization** - Multi-language support (i18next)
- 🎭 **Dark Mode** - System-aware theme switching

### Developer Experience

- ✅ **Comprehensive Testing** - Vitest + Testing Library + MSW
- 📊 **Code Quality** - ESLint with modern plugins + Prettier
- 🧪 **Test Utilities** - 1,450+ lines of test helpers and fixtures
- 📝 **TypeScript Ready** - JSDoc comments + easy TypeScript migration
- 🔍 **DevTools** - Redux DevTools + React Query DevTools

### Production Features

- 🚀 **PWA Ready** - Service Worker, offline support, installable
- 📈 **Performance Monitoring** - Web Vitals tracking
- 🛡️ **Security** - XSS protection, secure headers
- ⚡ **Optimized** - Code splitting, lazy loading, image optimization
- 🎯 **SEO Ready** - Meta tags, OpenGraph support

### Advanced Features

- 🎭 **Mock API** - MSW for realistic API mocking
- 🔄 **Request Cancellation** - Automatic cleanup with TanStack Query
- 📱 **Responsive** - Mobile-first design
- ♿ **Accessible** - WCAG 2.1 compliance focused
- 🔄 **Error Boundaries** - Graceful error handling
- 📊 **Analytics Ready** - Easy integration with analytics services

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Building](#-building)
- [Documentation](#-documentation)
- [Architecture](#-architecture)
- [Contributing](#-contributing)

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 (or yarn/pnpm)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd frontend-base

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Setup

Create environment-specific files:

```bash
# Copy example file
cp .env.example .env.development

# Edit with your settings
# .env.development - For development
# .env.production - For production
```

**Essential variables:**

```env
# API Configuration
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=100000
VITE_API_RETRY_ATTEMPTS=3

# Development Features
VITE_ENABLE_MOCKING=true
VITE_ENABLE_DEVTOOLS=true

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_PERFORMANCE_MONITORING=true

# Error Monitoring (Optional)
VITE_SENTRY_DSN=your-sentry-dsn
VITE_SENTRY_ENVIRONMENT=development
```

See [CONFIGURATION_GUIDE.md](./src/docs/CONFIGURATION_GUIDE.md) for complete configuration reference and validation details.

## 📁 Project Structure

```
frontend-base/
├── public/              # Static assets
│   ├── locales/        # Translation files
│   ├── sw.js           # Service Worker
│   └── manifest.json   # PWA manifest
├── src/
│   ├── components/     # Reusable components
│   │   ├── ui/        # Base UI components (Radix UI)
│   │   ├── layout/    # Layout components
│   │   └── comments/  # Feature-specific components
│   ├── pages/         # Page components (route handlers)
│   ├── route/         # Route configurations
│   ├── services/      # External services
│   │   ├── api/      # API service layer
│   │   ├── mock/     # MSW mock handlers
│   │   ├── query/    # TanStack Query hooks
│   │   └── store/    # Redux store & slices
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   │   ├── constants/ # Application constants
│   │   ├── context/   # React contexts
│   │   └── utils/     # Helper utilities
│   ├── docs/          # Technical documentation
│   └── tests/         # Test utilities and fixtures
├── .github/           # GitHub configuration
│   ├── agents/       # AI agent configurations
│   ├── prompts/      # AI prompt templates
│   └── skills/       # Reusable skills
└── docs/             # Project documentation
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier

# Testing
npm run test             # Run tests in watch mode
npm run test:ui          # Run tests with UI + coverage
npm run test:coverage    # Generate coverage report
npm run test:report      # Open coverage report

# Validation
npm run build:verify     # Build and verify production bundle
```

### Development Workflow

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Enable Mock API** (for development without backend)

   ```bash
   VITE_ENABLE_MSW=true npm run dev
   ```

3. **Run Tests While Developing**

   ```bash
   npm run test
   ```

4. **Check Code Quality**
   ```bash
   npm run lint
   npm run format
   ```

### Hot Module Replacement (HMR)

Vite provides instant HMR. Changes to your React components will reflect immediately without full page reloads.

### DevTools

- **Redux DevTools**: Available in development mode
- **React Query DevTools**: Available at bottom-left corner
- **React DevTools**: Install browser extension

## 🧪 Testing

This project has comprehensive testing setup with utilities for all scenarios.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI and coverage
npm run test:ui

# Generate coverage report
npm run test:coverage

# View coverage report
npm run test:report
```

### Test Coverage

Current coverage: **80%+** across all metrics

### Writing Tests

```javascript
import { render, screen, userEvent } from "@/tests/utils"
import { createMockComment } from "@/tests/fixtures"

test("should display comment", async () => {
  const comment = createMockComment()

  render(<CommentCard {...comment} />)

  expect(screen.getByText(comment.name)).toBeInTheDocument()
})
```

### Testing Guides

- **[TESTING_GUIDE.md](./src/docs/TESTING_GUIDE.md)** - Comprehensive testing documentation
- **[MOCKING_GUIDE.md](./src/docs/MOCKING_GUIDE.md)** - API mocking with MSW

### Test Utilities

The project includes 1,450+ lines of test utilities:

- **Custom render functions** with all providers
- **Mock factories** for generating test data
- **API response fixtures** for consistent testing
- **Helper functions** for common assertions
- **Browser API mocks** (IntersectionObserver, ResizeObserver, etc.)

## 🏗️ Building

### Production Build

```bash
npm run build
```

Output: `dist/` directory

### Build Optimization

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Dead code elimination
- **Minification**: Terser for JS, cssnano for CSS
- **Asset Optimization**: Images, fonts, and static files
- **Bundle Analysis**: Use `npm run build -- --analyze`

### Build Verification

```bash
npm run build:verify
```

This script:

1. Creates production build
2. Verifies bundle size limits
3. Checks for common issues
4. Validates asset optimization

### Environment-Specific Builds

```bash
# Staging
VITE_ENV=staging npm run build

# Production
VITE_ENV=production npm run build
```

## 📚 Documentation

### Technical Documentation

Located in `src/docs/`:

**Core Architecture:**
- **[ARCHITECTURE.md](./src/docs/ARCHITECTURE.md)** - Complete architecture overview, patterns, and decisions
- **[API.md](./src/docs/API.md)** - API documentation and integration guide

**Configuration & Setup:**
- **[CONFIGURATION_GUIDE.md](./src/docs/CONFIGURATION_GUIDE.md)** - Environment variables, validation, feature flags
- **[DEPLOYMENT.md](./src/docs/DEPLOYMENT.md)** - Deployment strategies and guides
- **[DEPENDENCY_OPTIMIZATION_GUIDE.md](./src/docs/DEPENDENCY_OPTIMIZATION_GUIDE.md)** - Bundle size optimization

**Security & Performance:**
- **[SECURITY_GUIDE.md](./src/docs/SECURITY_GUIDE.md)** - XSS protection, sanitization, security headers
- **[REQUEST_CANCELLATION_GUIDE.md](./src/docs/REQUEST_CANCELLATION_GUIDE.md)** - Prevent memory leaks with automatic request cleanup
- **[FRONTEND_MONITORING.md](./src/docs/FRONTEND_MONITORING.md)** - Web Vitals and performance monitoring
- **[ERROR_MONITORING_SETUP.md](./src/docs/ERROR_MONITORING_SETUP.md)** - Sentry integration and error tracking

**Development Guides:**
- **[TESTING_GUIDE.md](./src/docs/TESTING_GUIDE.md)** - Comprehensive testing guide with utilities
- **[MOCKING_GUIDE.md](./src/docs/MOCKING_GUIDE.md)** - MSW setup and realistic API mocking
- **[AUTHENTICATION_PATTERNS.md](./src/docs/AUTHENTICATION_PATTERNS.md)** - Authentication implementation patterns
- **[IMPLEMENTATION_SUMMARY.md](./src/docs/IMPLEMENTATION_SUMMARY.md)** - Recent feature implementations

### Project Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture overview and design decisions
- **[API.md](./API.md)** - API documentation and integration guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide

## 🎯 Production-Ready Features

This template includes enterprise-grade features for production deployments:

### Security Hardening
- **XSS Protection**: DOMPurify sanitization for user-generated content
- **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options configured
- **Input Validation**: Zod schemas for type-safe validation
- **Error Boundaries**: Graceful error handling to prevent app crashes
- **Secure Configuration**: Environment-specific settings with validation

### Performance Optimization
- **Request Cancellation**: Automatic cleanup with AbortController to prevent memory leaks
- **Code Splitting**: Route-based lazy loading for optimal bundle sizes
- **Image Optimization**: Lazy loading and responsive image utilities
- **Bundle Analysis**: Vite optimization with vendor chunk splitting
- **Memoization**: useMemo/useCallback patterns for expensive operations

### Monitoring & Observability
- **Web Vitals**: LCP, FID, CLS, FCP, TTFB tracking
- **Performance Metrics**: Built-in performance monitoring utilities
- **Error Tracking**: Sentry integration ready
- **Redux DevTools**: State inspection in development
- **React Query DevTools**: Cache and query inspection

### Developer Experience
- **Comprehensive Testing**: 1,450+ lines of test utilities and fixtures
- **Mock API**: MSW for realistic development without backend
- **Type Safety**: JSDoc comments for better IDE support
- **Code Quality**: ESLint + Prettier + SonarJS rules
- **Hot Reload**: Instant HMR with Vite

### Reliability
- **Error Handling**: Loading, error, and empty states for all data
- **Request Retry**: Automatic retry logic with exponential backoff
- **Offline Support**: PWA with service worker and offline fallback
- **State Persistence**: Redux persist for seamless user experience
- **Configuration Validation**: Runtime validation of environment variables

## 🏛️ Architecture

### Core Principles

1. **Feature-First Organization** - Code organized by features, not technical concerns
2. **Service Layer Pattern** - Separation of API calls from UI logic
3. **Container/Presentational Pattern** - Business logic separate from presentation
4. **Composition Over Inheritance** - Favor component composition
5. **Single Responsibility** - Each component/function has one clear purpose

### Technology Stack

**Frontend Framework:**

- React 19.2.0 - UI library
- React Router 7.6.1 - Routing
- Vite 6.3.5 - Build tool

**State Management:**

- Redux Toolkit 2.9.0 - Global state
- TanStack Query 5.90.12 - Server state
- Redux Persist 6.0.0 - State persistence

**UI & Styling:**

- Radix UI - Accessible components
- Tailwind CSS 4.1.12 - Utility-first CSS
- Lucide React - Icons

**Data Fetching:**

- Axios 1.10.0 - HTTP client
- TanStack Query - Cache & sync

**Testing:**

- Vitest 4.0.15 - Test runner
- Testing Library 16.3.0 - Component testing
- MSW 2.9.0 - API mocking

**Code Quality:**

- ESLint 9.28.0 - Linting
- Prettier 3.5.3 - Formatting
- SonarJS - Code quality rules

**Internationalization:**

- i18next 25.2.1 - i18n framework
- react-i18next 15.5.2 - React bindings

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

### Key Patterns

**API Service Layer:**

```javascript
// src/services/api/comments.api.js
export const getComments = async (options) => {
  return api.get(ct.api.comment.comment, options)
}
```

**TanStack Query Hook:**

```javascript
// src/services/query/comments.query.js
export const useFetchComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: ({ signal }) => getComments({ signal }),
  })
}
```

**Container Component:**

```javascript
// src/pages/comments/index.jsx
const CommentsPage = () => {
  const { data, isError, isLoading } = useFetchComments()
  // Business logic here
  return <CommentsUI {...props} />
}
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure tests pass (`npm run test`)
5. Ensure code quality (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards

- Follow ESLint rules (run `npm run lint`)
- Write tests for new features
- Maintain 80%+ code coverage
- Add JSDoc comments for functions
- Follow existing code patterns

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- [MSW](https://mswjs.io/) - Seamless API mocking

## 📞 Support

- Documentation: [./docs](./docs)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

## 🗺️ Roadmap

- [ ] TypeScript migration
- [ ] Visual regression testing (BackstopJS)
- [ ] E2E testing (Playwright)
- [ ] Storybook integration
- [ ] Performance budgets
- [ ] Automated accessibility testing

---

**Built with ❤️ for production-ready applications**
