# Dependency Optimization Guide

## Overview

This guide covers dependency optimization strategies to reduce bundle size and improve performance.

## Current Issues

### Moment.js ⚠️ **Should be Replaced**

**Problem:**
- Moment.js is **deprecated** and no longer maintained
- Large bundle size: ~70KB minified + gzipped (~230KB uncompressed)
- Not tree-shakeable
- Performance impact on bundle size

**Current Usage:**
```javascript
// src/main.jsx
import moment from "moment-timezone"
const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
moment.tz.setDefault(zone)
```

**Impact:** This single import adds significant bundle size for minimal functionality.

---

## Replacement Options

### Option 1: Native JavaScript (Recommended for Simple Use Cases) ✅

**Bundle Size:** 0KB (native browser API)

**Advantages:**
- No dependencies
- Zero bundle impact
- Modern browser support (99%+)
- Sufficient for most timezone operations

**Implementation:**

```javascript
// src/lib/utils/datetime.js

/**
 * Get user's timezone
 * @returns {string} IANA timezone identifier
 */
export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Format date with timezone
 * @param {Date|string|number} date - Date to format
 * @param {string} timezone - IANA timezone (e.g., 'America/New_York')
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDateWithTimezone(date, timezone, options = {}) {
  const d = date instanceof Date ? date : new Date(date)
  
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    ...options
  }).format(d)
}

/**
 * Convert date to specific timezone
 * @param {Date} date - Date to convert
 * @param {string} timezone - Target timezone
 * @returns {string} ISO string in target timezone
 */
export function toTimezone(date, timezone) {
  return new Date(date.toLocaleString('en-US', { timeZone: timezone }))
}

/**
 * Get timezone offset
 * @param {string} timezone - IANA timezone
 * @returns {number} Offset in minutes
 */
export function getTimezoneOffset(timezone) {
  const now = new Date()
  const tzString = now.toLocaleString('en-US', { timeZone: timezone })
  const tzDate = new Date(tzString)
  const localDate = new Date(now.toLocaleString('en-US'))
  
  return (tzDate.getTime() - localDate.getTime()) / 60000
}

// Example usage
const userTz = getUserTimezone() // "America/New_York"
const formatted = formatDateWithTimezone(new Date(), userTz, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short'
})
```

**Replace in main.jsx:**

```javascript
// Before
import moment from "moment-timezone"
const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
moment.tz.setDefault(zone)

// After (no library needed!)
const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
console.log('User timezone:', zone)
// Store in config or state if needed
```

### Option 2: date-fns (Recommended for Complex Use Cases) ✅

**Bundle Size:** ~13KB minified + gzipped (tree-shakeable, only import what you need)

**Advantages:**
- Modular and tree-shakeable
- Modern, actively maintained
- Immutable date objects
- TypeScript support
- Similar API to Moment.js

**Installation:**

```bash
npm uninstall moment moment-timezone
npm install date-fns date-fns-tz
```

**Implementation:**

```javascript
// src/lib/utils/datetime.js
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc, format as formatTz } from 'date-fns-tz'

/**
 * Format date
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (e.g., 'yyyy-MM-dd HH:mm:ss')
 * @returns {string} Formatted date
 */
export function formatDate(date, formatStr = 'yyyy-MM-dd') {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, formatStr)
}

/**
 * Format date with timezone
 * @param {Date} date - Date to format
 * @param {string} timezone - IANA timezone
 * @param {string} formatStr - Format string
 * @returns {string} Formatted date
 */
export function formatDateInTimezone(date, timezone, formatStr = 'yyyy-MM-dd HH:mm:ss zzz') {
  const zonedDate = utcToZonedTime(date, timezone)
  return formatTz(zonedDate, formatStr, { timeZone: timezone })
}

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

// Example usage
import { formatDate, formatDateInTimezone, getRelativeTime } from '@/lib/utils/datetime'

formatDate(new Date(), 'MMM dd, yyyy') // "Jan 11, 2026"
formatDateInTimezone(new Date(), 'America/New_York', 'HH:mm zzz') // "15:30 EST"
getRelativeTime(new Date(Date.now() - 3600000)) // "about 1 hour ago"
```

### Option 3: Day.js (Lightest Alternative) ✅

**Bundle Size:** ~7KB minified + gzipped (smallest)

**Advantages:**
- Smallest bundle size
- API similar to Moment.js (easy migration)
- Plugin system
- Good for simple use cases

**Installation:**

```bash
npm uninstall moment moment-timezone
npm install dayjs
```

**Implementation:**

```javascript
// src/lib/utils/datetime.js
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'

// Extend dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

/**
 * Get user timezone
 */
export function getUserTimezone() {
  return dayjs.tz.guess()
}

/**
 * Format date with timezone
 */
export function formatDateInTimezone(date, timezone, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).tz(timezone).format(format)
}

/**
 * Get relative time
 */
export function getRelativeTime(date) {
  return dayjs(date).fromNow()
}

// Set default timezone
const userTimezone = getUserTimezone()
dayjs.tz.setDefault(userTimezone)

export default dayjs
```

**Replace in main.jsx:**

```javascript
// Before
import moment from "moment-timezone"
const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
moment.tz.setDefault(zone)

// After
import { getUserTimezone } from './lib/utils/datetime'
const zone = getUserTimezone()
console.log('User timezone:', zone)
```

---

## Migration Steps

### 1. Audit Moment.js Usage

```bash
# Find all moment usage
grep -r "moment" src/ --include="*.js" --include="*.jsx"
```

### 2. Choose Replacement Strategy

- **Simple timezone detection only?** → Use Native JavaScript (Option 1)
- **Complex date manipulation?** → Use date-fns (Option 2)
- **Want Moment.js-like API?** → Use Day.js (Option 3)

### 3. Create Utility File

Create `src/lib/utils/datetime.js` with chosen implementation (see above).

### 4. Replace Imports

```javascript
// Before
import moment from 'moment'
const formatted = moment(date).format('YYYY-MM-DD')

// After (date-fns)
import { formatDate } from '@/lib/utils/datetime'
const formatted = formatDate(date, 'yyyy-MM-dd')

// Or (Day.js)
import dayjs from '@/lib/utils/datetime'
const formatted = dayjs(date).format('YYYY-MM-DD')

// Or (Native)
import { formatDateWithTimezone } from '@/lib/utils/datetime'
const formatted = formatDateWithTimezone(date, userTz, { year: 'numeric', month: '2-digit', day: '2-digit' })
```

### 5. Test Thoroughly

- Date formatting
- Timezone conversions
- Relative time calculations
- Edge cases (leap years, DST, etc.)

### 6. Remove Moment.js

```bash
npm uninstall moment moment-timezone
```

### 7. Verify Bundle Size

```bash
npm run build
# Check dist/assets/*.js file sizes
```

---

## Bundle Size Comparison

| Library | Minified | Gzipped | Tree-shakeable |
|---------|----------|---------|----------------|
| Moment.js + Timezone | 230 KB | 70 KB | ❌ No |
| date-fns + timezone | 40 KB | 13 KB | ✅ Yes |
| Day.js + plugins | 20 KB | 7 KB | Partial |
| Native JavaScript | 0 KB | 0 KB | ✅ N/A |

**Expected Savings:** ~60-70 KB gzipped by removing Moment.js

---

## Additional Dependency Optimizations

### 1. Analyze Bundle Size

```bash
npm install --save-dev vite-plugin-visualizer
```

```javascript
// vite.config.js
import { visualizer } from 'vite-plugin-visualizer'

export default {
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
}
```

Run build and it will open bundle visualization.

### 2. Check for Duplicate Dependencies

```bash
npm dedupe
npm ls
```

### 3. Audit for Unused Dependencies

```bash
npm install --save-dev depcheck
npx depcheck
```

### 4. Update Dependencies

```bash
# Check for updates
npm outdated

# Update all (carefully)
npm update

# Or update specific package
npm update axios
```

### 5. Use Package Size Checker

```bash
npm install -g bundle-phobia-cli
bundle-phobia <package-name>
```

Or visit: https://bundlephobia.com/

---

## Recommended Actions

### Immediate (High Impact)

1. ✅ **Replace Moment.js** with native JavaScript or date-fns
   - Expected savings: ~60-70 KB gzipped
   - Difficulty: Easy-Medium
   - Risk: Low (good test coverage needed)

2. ✅ **Remove unused dependencies**
   - Run `npx depcheck`
   - Remove any unused packages
   - Expected savings: Varies
   - Difficulty: Easy
   - Risk: Very Low

### Short Term

3. **Optimize Radix UI imports**
   - Only import specific components
   - Tree-shake unused parts
   - Expected savings: ~10-20 KB
   - Difficulty: Easy

4. **Check for duplicate dependencies**
   - Run `npm dedupe`
   - Resolve version conflicts
   - Expected savings: ~5-10 KB
   - Difficulty: Easy

### Long Term

5. **Implement dynamic imports for heavy features**
   - Load heavy libraries only when needed
   - Use React.lazy for components
   - Expected savings: Varies
   - Difficulty: Medium

6. **Consider lighter alternatives for other libraries**
   - Review all dependencies > 50KB
   - Find lighter alternatives where possible
   - Expected savings: Varies
   - Difficulty: Medium-Hard

---

## Implementation Status

### ✅ Completed
- Code splitting with lazy loading
- Tree-shaking enabled in Vite

### ⏳ Pending
- Replace Moment.js (documented, ready to implement)
- Dependency audit
- Bundle size analysis setup

---

## See Also

- [Vite Bundle Optimization](https://vitejs.dev/guide/build.html#build-optimizations)
- [date-fns Documentation](https://date-fns.org/)
- [Day.js Documentation](https://day.js.org/)
- [Bundle Phobia](https://bundlephobia.com/)
