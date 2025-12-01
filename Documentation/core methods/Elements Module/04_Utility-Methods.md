# Elements Module - Utility Methods

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Part 4 of 4**: Utility Methods for the Elements Helper
> Manage cache, configure behavior, and monitor performance

---

## Table of Contents

1. [Overview](#overview)
2. [Elements.stats() - Performance Statistics](#elementsstats---performance-statistics)
3. [Elements.clear() - Cache Management](#elementsclear---cache-management)
4. [Elements.destroy() - Cleanup and Teardown](#elementsdestroy---cleanup-and-teardown)
5. [Elements.configure() - Configuration](#elementsconfigure---configuration)
6. [Quick Reference](#quick-reference)
7. [Best Practices](#best-practices)
8. [Advanced Use Cases](#advanced-use-cases)

---

## Overview

**Utility Methods** provide control over the Elements Helper's internal behavior and performance monitoring. These methods help you:

✅ **Monitor performance** - Track cache hits, misses, and efficiency
✅ **Manage cache** - Clear stale entries manually when needed
✅ **Configure behavior** - Customize caching, cleanup, and logging
✅ **Clean up resources** - Properly destroy the helper when no longer needed

---

## `Elements.stats()` - Performance Statistics

### What it does

**Get detailed statistics** about the Elements Helper's performance and cache usage.

```javascript
Elements.stats()
```

**Parameters:** None

**Returns:** Object with performance metrics

---

### Statistics object structure

```javascript
{
  hits: 150,              // Number of cache hits
  misses: 25,             // Number of cache misses
  hitRate: 0.857,         // Hit rate percentage (0-1)
  cacheSize: 42,          // Current number of cached elements
  lastCleanup: 1234567890 // Timestamp of last cache cleanup
}
```

---

### Understanding the metrics

#### **hits**
Number of times an element was **found in cache** (fast access).

```javascript
Elements.header;  // Miss (first access, not cached)
Elements.header;  // Hit (cached from previous access)
Elements.header;  // Hit (still cached)
```

#### **misses**
Number of times an element was **not in cache** and had to be fetched from DOM.

Misses occur when:
- First access to an element
- Element was removed from DOM (cache invalidated)
- Cache was cleared manually
- Element was evicted due to cache size limit

#### **hitRate**
Percentage of accesses that were cache hits (0 = 0%, 1 = 100%).

**Good hit rate:** > 0.8 (80%+)
**Excellent hit rate:** > 0.9 (90%+)

```javascript
// 150 hits, 25 misses = 175 total accesses
// hitRate = 150 / 175 = 0.857 (85.7%)
```

#### **cacheSize**
Current number of elements stored in cache.

**Default max:** 1000 elements (configurable)

#### **lastCleanup**
Unix timestamp (milliseconds) of the last automatic cache cleanup.

**Default cleanup interval:** 30 seconds (configurable)

---

### Examples

#### Basic monitoring
```javascript
// Get stats
const stats = Elements.stats();

console.log(`Cache size: ${stats.cacheSize}`);
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
console.log(`Hits: ${stats.hits}, Misses: ${stats.misses}`);
```

#### Performance dashboard
```javascript
function displayPerformanceMetrics() {
  const stats = Elements.stats();

  Elements.update({
    cacheHits: { textContent: stats.hits },
    cacheMisses: { textContent: stats.misses },
    hitRate: { textContent: `${(stats.hitRate * 100).toFixed(1)}%` },
    cacheSize: { textContent: stats.cacheSize },
    lastCleanup: {
      textContent: new Date(stats.lastCleanup).toLocaleString()
    }
  });

  // Color-code hit rate
  const hitRateElement = Elements.hitRate;
  if (stats.hitRate > 0.9) {
    hitRateElement.update({ style: { color: 'green' } });
  } else if (stats.hitRate > 0.7) {
    hitRateElement.update({ style: { color: 'orange' } });
  } else {
    hitRateElement.update({ style: { color: 'red' } });
  }
}
```

#### Debugging cache behavior
```javascript
// Test caching
console.log('Initial stats:', Elements.stats());

Elements.header;  // First access
console.log('After first access:', Elements.stats());

Elements.header;  // Second access (should be cached)
console.log('After second access:', Elements.stats());

Elements.clear();
console.log('After cache clear:', Elements.stats());
```

#### Performance testing
```javascript
function benchmarkCaching() {
  Elements.clear();  // Start fresh

  // Access 100 elements repeatedly
  const elementIds = Array.from({ length: 100 }, (_, i) => `element${i}`);

  console.time('Without cache');
  Elements.clear();
  elementIds.forEach(id => Elements.get(id));
  console.timeEnd('Without cache');

  console.time('With cache');
  elementIds.forEach(id => Elements.get(id));
  console.timeEnd('With cache');

  console.log('Final stats:', Elements.stats());
}
```

---

### When to use `stats()`

✅ **Performance monitoring** - Track cache efficiency in production
✅ **Debugging** - Understand caching behavior during development
✅ **Optimization** - Identify if cache is helping or if configuration needs tuning
✅ **Dashboards** - Display real-time performance metrics
✅ **Testing** - Verify caching works as expected

---

## `Elements.clear()` - Cache Management

### What it does

**Manually clear all cached elements**, forcing fresh DOM queries on next access.

```javascript
Elements.clear()
```

**Parameters:** None

**Returns:** The Elements helper (for chaining)

---

### What gets cleared

When you call `Elements.clear()`:
1. **All cached elements are removed** from the cache Map
2. **Statistics are reset** (hits, misses, cache size)
3. **Next access** to any element will query the DOM (cache miss)

**Note:** The cache **does not clear references** stored in your variables:

```javascript
const header = Elements.header;  // Cached and stored in variable

Elements.clear();  // Cache cleared

// 'header' variable still holds the element reference
header.update({ textContent: 'Still works!' });

// But Elements.header will query DOM again
const freshHeader = Elements.header;  // Fresh DOM query
```

---

### Examples

#### Manual cache cleanup
```javascript
// Clear cache after major DOM changes
function rebuildPage() {
  document.body.innerHTML = newPageHTML;

  // Clear cache since all elements changed
  Elements.clear();

  // Next accesses will fetch fresh elements
  const header = Elements.header;  // Fresh DOM query
}
```

#### Testing and development
```javascript
// During testing, clear cache between tests
afterEach(() => {
  Elements.clear();
});

it('should find header element', () => {
  const header = Elements.header;
  expect(header).toBeTruthy();
});
```

#### Forced refresh
```javascript
// Force refresh of specific workflow
function resetWorkflow() {
  // Clear cache to ensure fresh elements
  Elements.clear();

  // Reinitialize with fresh DOM queries
  const { form, inputs, buttons } = Elements.destructure(
    'form', 'inputs', 'buttons'
  );

  // Reconfigure workflow
  setupWorkflow(form, inputs, buttons);
}
```

#### Memory management
```javascript
// For long-running SPAs, periodically clear cache
setInterval(() => {
  const stats = Elements.stats();

  // If cache is full, clear it
  if (stats.cacheSize > 900) {
    console.log('Cache nearly full, clearing...');
    Elements.clear();
  }
}, 60000);  // Every minute
```

---

### When to use `clear()`

✅ **After major DOM changes** - When innerHTML or major re-renders happen
✅ **Route changes in SPAs** - Clear cache when navigating to new pages
✅ **Testing** - Reset state between test cases
✅ **Memory pressure** - If cache grows too large
✅ **Development** - Force fresh queries when debugging

⚠️ **Don't overuse:**
- Automatic cleanup already handles removed elements
- Clearing too often negates the performance benefits of caching

---

## `Elements.destroy()` - Cleanup and Teardown

### What it does

**Completely destroy the Elements Helper**, cleaning up all resources including cache, observers, and timers.

```javascript
Elements.destroy()
```

**Parameters:** None

**Returns:** `undefined`

---

### What gets destroyed

1. **Cache cleared** - All cached elements removed
2. **MutationObserver disconnected** - Stops watching DOM changes
3. **Cleanup timers stopped** - No more automatic cleanup
4. **Helper marked as destroyed** - Prevents further use

After calling `destroy()`, the Elements helper is **unusable** until reinitialized.

---

### Examples

#### Application teardown
```javascript
// When unmounting your application
function shutdownApp() {
  // Clean up all DOM helpers
  Elements.destroy();
  Collections.destroy();
  Selector.destroy();

  console.log('Application cleaned up');
}

window.addEventListener('beforeunload', shutdownApp);
```

#### Component lifecycle (React example)
```javascript
function useElementsHelper() {
  useEffect(() => {
    // Initialize if needed
    // (Elements is already initialized globally)

    return () => {
      // Cleanup on unmount
      Elements.destroy();
    };
  }, []);
}
```

#### Testing teardown
```javascript
afterAll(() => {
  // Clean up after all tests
  Elements.destroy();
});
```

#### Memory leak prevention
```javascript
// In a long-running application
function resetHelpers() {
  // Destroy old instance
  Elements.destroy();

  // Helpers will auto-reinitialize on next use
  // (if your setup supports it)

  console.log('Helpers reset');
}
```

---

### When to use `destroy()`

✅ **Application shutdown** - When app is unmounting/closing
✅ **Component unmounting** - In framework component cleanup
✅ **Testing cleanup** - After test suites complete
✅ **Memory management** - To free resources in long-running apps

⚠️ **Rare usage:**
- Most apps don't need to call this
- Automatic cleanup handles most scenarios
- Only use when you're certain the helper won't be needed again

---

## `Elements.configure()` - Configuration

### What it does

**Update the Elements Helper's configuration** at runtime.

```javascript
Elements.configure(options)
```

**Parameters:**
- `options` (object) - Configuration options to update

**Returns:** The Elements helper (for chaining)

---

### Available options

```javascript
{
  enableLogging: false,        // Enable console logging
  autoCleanup: true,           // Enable automatic cache cleanup
  cleanupInterval: 30000,      // Cleanup interval in ms (30 seconds)
  maxCacheSize: 1000,          // Maximum cached elements
  debounceDelay: 16,           // Debounce delay for updates (ms)
  waitForTimeout: 5000,        // Default timeout for waitFor() (ms)
  waitForInterval: 50          // Check interval for waitFor() (ms)
}
```

---

### Option details

#### **enableLogging**
Type: `boolean`
Default: `false`

Enable detailed console logging for debugging:
```javascript
Elements.configure({ enableLogging: true });

Elements.header;
// Console: "[Elements] Cache miss for 'header'"
// Console: "[Elements] Caching element 'header'"
```

---

#### **autoCleanup**
Type: `boolean`
Default: `true`

Enable automatic cache cleanup:
- Removes stale entries (elements removed from DOM)
- Runs on a timer (see `cleanupInterval`)

```javascript
// Disable auto-cleanup (not recommended)
Elements.configure({ autoCleanup: false });

// Re-enable
Elements.configure({ autoCleanup: true });
```

---

#### **cleanupInterval**
Type: `number` (milliseconds)
Default: `30000` (30 seconds)

How often automatic cleanup runs:

```javascript
// More frequent cleanup (every 10 seconds)
Elements.configure({ cleanupInterval: 10000 });

// Less frequent cleanup (every 2 minutes)
Elements.configure({ cleanupInterval: 120000 });
```

**Tradeoff:**
- **Shorter interval** = More CPU, cleaner cache
- **Longer interval** = Less CPU, possible stale entries

---

#### **maxCacheSize**
Type: `number`
Default: `1000`

Maximum number of elements to cache:

```javascript
// Increase cache size for large apps
Elements.configure({ maxCacheSize: 5000 });

// Decrease for memory-constrained environments
Elements.configure({ maxCacheSize: 100 });
```

When cache is full, **oldest entries are evicted** (LRU strategy).

---

#### **debounceDelay**
Type: `number` (milliseconds)
Default: `16` (~60fps)

Delay for debouncing rapid updates:

```javascript
// Faster updates (not recommended)
Elements.configure({ debounceDelay: 0 });

// Slower updates (for high-frequency changes)
Elements.configure({ debounceDelay: 100 });
```

---

#### **waitForTimeout**
Type: `number` (milliseconds)
Default: `5000` (5 seconds)

Default timeout for `Elements.waitFor()`:

```javascript
// Increase timeout for slow-loading content
Elements.configure({ waitForTimeout: 10000 });

await Elements.waitFor('slowElement');  // Waits up to 10 seconds
```

---

#### **waitForInterval**
Type: `number` (milliseconds)
Default: `50`

How often `waitFor()` checks for elements:

```javascript
// Check more frequently
Elements.configure({ waitForInterval: 25 });

// Check less frequently (use less CPU)
Elements.configure({ waitForInterval: 100 });
```

---

### Examples

#### Development vs Production
```javascript
// Development mode
if (process.env.NODE_ENV === 'development') {
  Elements.configure({
    enableLogging: true,
    cleanupInterval: 10000  // More frequent cleanup
  });
}

// Production mode
if (process.env.NODE_ENV === 'production') {
  Elements.configure({
    enableLogging: false,
    maxCacheSize: 2000      // Larger cache
  });
}
```

#### Memory-constrained environment
```javascript
// Mobile or low-memory devices
Elements.configure({
  maxCacheSize: 200,         // Smaller cache
  cleanupInterval: 15000,    // More frequent cleanup
  autoCleanup: true          // Ensure cleanup is enabled
});
```

#### High-performance requirements
```javascript
// High-frequency updates
Elements.configure({
  debounceDelay: 0,          // No debouncing
  maxCacheSize: 5000,        // Large cache
  cleanupInterval: 60000     // Less frequent cleanup
});
```

#### Async-heavy application
```javascript
// Many async element loads
Elements.configure({
  waitForTimeout: 15000,     // Longer timeout
  waitForInterval: 100       // Less frequent checks (save CPU)
});
```

---

### Chaining configuration

```javascript
Elements
  .configure({ enableLogging: true })
  .configure({ maxCacheSize: 2000 })
  .clear();
```

---

### When to use `configure()`

✅ **Environment-specific behavior** - Different settings for dev/prod
✅ **Performance tuning** - Optimize for your application's needs
✅ **Memory constraints** - Adjust cache size and cleanup
✅ **Debugging** - Enable logging during development

---

## Quick Reference

| Method | Purpose | Returns | Common Use |
|--------|---------|---------|------------|
| **stats()** | Get performance metrics | Object | Monitoring, debugging |
| **clear()** | Clear all cached elements | Elements | After DOM changes, testing |
| **destroy()** | Cleanup and teardown | undefined | App shutdown, unmounting |
| **configure()** | Update configuration | Elements | Environment setup, tuning |

---

## Best Practices

### 1. Monitor performance in development

```javascript
// Setup performance monitoring
if (process.env.NODE_ENV === 'development') {
  Elements.configure({ enableLogging: true });

  setInterval(() => {
    const stats = Elements.stats();
    console.log(`Cache efficiency: ${(stats.hitRate * 100).toFixed(1)}%`);
  }, 30000);
}
```

---

### 2. Clear cache after major DOM updates

```javascript
function loadNewContent(html) {
  // Replace page content
  document.getElementById('app').innerHTML = html;

  // Clear cache since DOM changed
  Elements.clear();

  // Re-initialize with fresh elements
  initializePage();
}
```

---

### 3. Configure once at application start

```javascript
// app.js
Elements.configure({
  maxCacheSize: 2000,
  cleanupInterval: 30000,
  enableLogging: isDevelopment
});

// Rest of application...
```

---

### 4. Use stats for optimization decisions

```javascript
// Analyze cache effectiveness
const stats = Elements.stats();

if (stats.hitRate < 0.5) {
  console.warn('Low cache hit rate. Consider:');
  console.warn('- Increasing maxCacheSize');
  console.warn('- Reducing dynamic element access');
  console.warn('- Using Elements.destructure() for bulk access');
}
```

---

## Advanced Use Cases

### Custom cache warming

```javascript
// Pre-populate cache with critical elements
function warmCache() {
  const criticalElements = [
    'header', 'nav', 'main', 'footer',
    'loginForm', 'searchBar'
  ];

  criticalElements.forEach(id => {
    Elements[id];  // Access to cache
  });

  console.log('Cache warmed:', Elements.stats());
}

// Run on page load
warmCache();
```

---

### Adaptive cache sizing

```javascript
// Adjust cache size based on usage
function optimizeCacheSize() {
  const stats = Elements.stats();

  if (stats.cacheSize > 800 && stats.hitRate > 0.9) {
    // Cache is effective and nearly full - increase size
    Elements.configure({ maxCacheSize: 2000 });
    console.log('Cache size increased');
  }

  if (stats.hitRate < 0.5) {
    // Low hit rate - maybe decrease to save memory
    Elements.configure({ maxCacheSize: 500 });
    console.log('Cache size decreased');
  }
}

// Run periodically
setInterval(optimizeCacheSize, 300000);  // Every 5 minutes
```

---

### Intelligent cleanup scheduling

```javascript
// Cleanup during idle time
let idleTimer;

function scheduleIdleCleanup() {
  clearTimeout(idleTimer);

  idleTimer = setTimeout(() => {
    Elements.clear();
    console.log('Idle cleanup performed');
  }, 60000);  // 1 minute of idle time
}

// Reset timer on user activity
document.addEventListener('click', scheduleIdleCleanup);
document.addEventListener('keypress', scheduleIdleCleanup);
```

---

### Performance logging

```javascript
class ElementsPerformanceLogger {
  constructor() {
    this.logs = [];
    this.startLogging();
  }

  startLogging() {
    setInterval(() => {
      const stats = Elements.stats();
      this.logs.push({
        timestamp: Date.now(),
        ...stats
      });

      // Keep only last 100 entries
      if (this.logs.length > 100) {
        this.logs.shift();
      }
    }, 5000);  // Every 5 seconds
  }

  getReport() {
    const avgHitRate = this.logs.reduce((sum, log) => sum + log.hitRate, 0) / this.logs.length;
    const avgCacheSize = this.logs.reduce((sum, log) => sum + log.cacheSize, 0) / this.logs.length;

    return {
      averageHitRate: avgHitRate,
      averageCacheSize: avgCacheSize,
      samples: this.logs.length
    };
  }
}

const perfLogger = new ElementsPerformanceLogger();
// Later: perfLogger.getReport()
```

---

## Summary

**Utility Methods** give you full control over the Elements Helper:

✅ **`stats()`** - Monitor cache performance and efficiency
✅ **`clear()`** - Manually reset cache when needed
✅ **`destroy()`** - Clean up resources on shutdown
✅ **`configure()`** - Tune behavior for your application

**Remember:**
- Monitor stats during development
- Clear cache after major DOM changes
- Configure once at app startup
- Only destroy when truly shutting down

---

## Complete Elements Module Documentation

You've completed all four parts of the Elements Module:

1. **[Access Methods](01_Access-Methods.md)** ✅ - Getting elements by ID
2. **[Property Methods](02_Property-Methods.md)** ✅ - Setting/getting properties and attributes
3. **[Bulk Operations](03_Bulk-Operations.md)** ✅ - Updating multiple elements
4. **[Utility Methods](04_Utility-Methods.md)** ✅ - Cache and configuration (this document)

---

**[Back to Documentation Home](../../README.md)**
