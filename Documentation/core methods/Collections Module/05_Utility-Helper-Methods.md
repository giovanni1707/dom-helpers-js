# Collections Module - Utility & Helper Methods

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Part 5 of 6**: Utility & Helper Methods for Collections
> Manage cache, configure behavior, and use helper methods

---

## Table of Contents

**Utility Methods:**
1. [Collections.stats() - Performance Statistics](#collectionsstats---performance-statistics)
2. [Collections.clear() - Cache Management](#collectionsclear---cache-management)
3. [Collections.destroy() - Cleanup and Teardown](#collectionsdestroy---cleanup-and-teardown)
4. [Collections.isCached() - Check Cache Status](#collectionsiscached---check-cache-status)
5. [Collections.configure() - Configuration](#collectionsconfigure---configuration)
6. [Collections.enableEnhancedSyntax() - Enable Enhanced Features](#collectionsenableenhancedsyntax---enable-enhanced-features)
7. [Collections.disableEnhancedSyntax() - Disable Enhanced Features](#collectionsdisableenhancedsyntax---disable-enhanced-features)

**Helper Methods:**
8. [Collections.getMultiple() - Get Multiple Collections](#collectionsgetmultiple---get-multiple-collections)
9. [Collections.waitFor() - Async Collection Loading](#collectionswaitfor---async-collection-loading)

10. [Quick Reference](#quick-reference)
11. [Best Practices](#best-practices)

---

## Utility Methods

### `Collections.stats()` - Performance Statistics

**Get detailed statistics about the Collections Helper's performance and cache usage.**

```javascript
Collections.stats()
```

**Returns:** Object with performance metrics

**Statistics object:**
```javascript
{
  hits: 150,              // Cache hits
  misses: 25,             // Cache misses
  hitRate: 0.857,         // Hit rate (0-1)
  cacheSize: 42,          // Current cache size
  lastCleanup: 1234567890 // Last cleanup timestamp
}
```

**Examples:**
```javascript
const stats = Collections.stats();

console.log(`Cache size: ${stats.cacheSize}`);
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
console.log(`Total accesses: ${stats.hits + stats.misses}`);

// Monitor performance
if (stats.hitRate < 0.5) {
  console.warn('Low cache hit rate - consider optimization');
}
```

---

### `Collections.clear()` - Cache Management

**Manually clear all cached collections.**

```javascript
Collections.clear()
```

**Returns:** Collections helper (for chaining)

**Examples:**
```javascript
// Clear cache after major DOM changes
function rebuildPage() {
  document.body.innerHTML = newPageHTML;
  Collections.clear();
}

// Clear cache in tests
afterEach(() => {
  Collections.clear();
});
```

---

### `Collections.destroy()` - Cleanup and Teardown

**Completely destroy the Collections Helper, cleaning up all resources.**

```javascript
Collections.destroy()
```

**Returns:** `undefined`

**What gets destroyed:**
- Cache cleared
- MutationObserver disconnected
- Cleanup timers stopped
- Helper marked as destroyed

**Examples:**
```javascript
// Application shutdown
function shutdownApp() {
  Collections.destroy();
  Elements.destroy();
  Selector.destroy();
}

window.addEventListener('beforeunload', shutdownApp);
```

---

### `Collections.isCached()` - Check Cache Status

**Check if a collection is currently cached.**

```javascript
Collections.isCached(type, value)
```

**Parameters:**
- `type` (string) - Collection type: 'className', 'tagName', or 'name'
- `value` (string) - The value (class name, tag name, or name attribute)

**Returns:** `true` if cached, `false` otherwise

**Examples:**
```javascript
// Check if collection is cached
const isCached = Collections.isCached('className', 'button');

if (!isCached) {
  // Access to cache it
  Collections.ClassName.button;
}

// Check different types
Collections.isCached('tagName', 'div');
Collections.isCached('name', 'email');
```

---

### `Collections.configure()` - Configuration

**Update the Collections Helper's configuration at runtime.**

```javascript
Collections.configure(options)
```

**Parameters:**
- `options` (object) - Configuration options

**Available options:**
```javascript
{
  enableLogging: false,        // Enable console logging
  autoCleanup: true,           // Enable automatic cache cleanup
  cleanupInterval: 30000,      // Cleanup interval in ms
  maxCacheSize: 1000,          // Maximum cached collections
  debounceDelay: 16,           // Debounce delay for updates
  enableEnhancedSyntax: true   // Enable enhanced collection features
}
```

**Examples:**
```javascript
// Enable logging for debugging
Collections.configure({ enableLogging: true });

// Increase cache size for large apps
Collections.configure({ maxCacheSize: 2000 });

// More frequent cleanup
Collections.configure({ cleanupInterval: 10000 });

// Development vs Production
if (isDevelopment) {
  Collections.configure({
    enableLogging: true,
    cleanupInterval: 10000
  });
} else {
  Collections.configure({
    enableLogging: false,
    maxCacheSize: 2000
  });
}
```

---

### `Collections.enableEnhancedSyntax()` - Enable Enhanced Features

**Enable enhanced syntax features (array methods, utility methods, etc.).**

```javascript
Collections.enableEnhancedSyntax()
```

**Returns:** Collections helper (for chaining)

**Enhanced features include:**
- Array-like methods (`.forEach()`, `.map()`, `.filter()`, etc.)
- Utility methods (`.first()`, `.last()`, `.at()`, `.isEmpty()`)
- DOM manipulation methods (`.addClass()`, `.setStyle()`, `.on()`)
- Filtering methods (`.visible()`, `.hidden()`, `.enabled()`)

**Examples:**
```javascript
// Enable enhanced syntax
Collections.enableEnhancedSyntax();

// Now you can use:
const buttons = Collections.ClassName.button;
buttons.forEach(btn => console.log(btn.textContent));
const firstBtn = buttons.first();
buttons.addClass('styled');
```

---

### `Collections.disableEnhancedSyntax()` - Disable Enhanced Features

**Disable enhanced syntax features for lighter weight collections.**

```javascript
Collections.disableEnhancedSyntax()
```

**Returns:** Collections helper (for chaining)

**When to disable:**
- Performance-critical applications
- When you don't need enhanced methods
- To reduce memory footprint

**Examples:**
```javascript
// Disable enhanced syntax
Collections.disableEnhancedSyntax();

// Collections now return standard HTMLCollections/NodeLists
const buttons = Collections.ClassName.button;
// No .forEach(), .first(), .addClass(), etc.
// Use standard array methods: Array.from(buttons).forEach(...)
```

---

## Helper Methods

### `Collections.getMultiple()` - Get Multiple Collections

**Get multiple collections at once.**

```javascript
Collections.getMultiple(requests)
```

**Parameters:**
- `requests` (array) - Array of collection request objects

**Request object:**
```javascript
{
  type: 'className' | 'tagName' | 'name',
  value: 'string'
}
```

**Returns:** Object mapping to collections

**Examples:**
```javascript
// Get multiple collections
const collections = Collections.getMultiple([
  { type: 'className', value: 'button' },
  { type: 'className', value: 'card' },
  { type: 'tagName', value: 'img' }
]);

console.log(collections);
// {
//   'className:button': HTMLCollection,
//   'className:card': HTMLCollection,
//   'tagName:img': HTMLCollection
// }

// More practical example
const { buttons, cards, images } = (() => {
  const colls = Collections.getMultiple([
    { type: 'className', value: 'button' },
    { type: 'className', value: 'card' },
    { type: 'tagName', value: 'img' }
  ]);

  return {
    buttons: colls['className:button'],
    cards: colls['className:card'],
    images: colls['tagName:img']
  };
})();
```

**When to use:**
- Fetching many collections at once
- Initialization code
- Pre-loading/caching collections

---

### `Collections.waitFor()` - Async Collection Loading

**Asynchronously wait for a collection to have a minimum number of elements.**

```javascript
await Collections.waitFor(type, value, minCount, timeout)
```

**Parameters:**
- `type` (string) - Collection type: 'className', 'tagName', or 'name'
- `value` (string) - The value (class name, tag name, or name attribute)
- `minCount` (number, default: 1) - Minimum number of elements required
- `timeout` (number, default: 5000) - Timeout in milliseconds

**Returns:** Promise that resolves to the collection

**Rejects:** If timeout is reached

**Examples:**
```javascript
// Wait for at least 1 button
try {
  const buttons = await Collections.waitFor('className', 'button');
  console.log('Buttons loaded:', buttons.length);
} catch (error) {
  console.error('Timeout waiting for buttons');
}

// Wait for at least 5 cards
const cards = await Collections.waitFor('className', 'card', 5);
console.log('At least 5 cards loaded');

// Custom timeout
const images = await Collections.waitFor('tagName', 'img', 10, 10000); // 10 second timeout
```

**Use cases:**
- Dynamically loaded content
- SPAs with async rendering
- Waiting for API-driven content
- Infinite scroll implementations

**Real-world example:**
```javascript
async function loadGallery() {
  // Show loading state
  Elements.loader.update({ style: { display: 'block' } });

  try {
    // Wait for at least 10 images to load
    const images = await Collections.waitFor('className', 'gallery-image', 10);

    // Initialize gallery
    images.forEach((img, index) => {
      img.update({
        setAttribute: { 'data-index': index },
        addEventListener: ['click', handleImageClick]
      });
    });

    // Hide loader
    Elements.loader.update({ style: { display: 'none' } });

  } catch (error) {
    console.error('Gallery load timeout');
    Elements.errorMsg.update({ textContent: 'Failed to load gallery' });
  }
}
```

---

## Quick Reference

### Utility Methods

| Method | Purpose | Example | Returns |
|--------|---------|---------|---------|
| **stats()** | Get performance stats | `Collections.stats()` | Object |
| **clear()** | Clear cache | `Collections.clear()` | Collections |
| **destroy()** | Cleanup and teardown | `Collections.destroy()` | undefined |
| **isCached()** | Check cache status | `Collections.isCached('className', 'button')` | Boolean |
| **configure()** | Update configuration | `Collections.configure({ maxCacheSize: 2000 })` | Collections |
| **enableEnhancedSyntax()** | Enable features | `Collections.enableEnhancedSyntax()` | Collections |
| **disableEnhancedSyntax()** | Disable features | `Collections.disableEnhancedSyntax()` | Collections |

### Helper Methods

| Method | Purpose | Example | Returns |
|--------|---------|---------|---------|
| **getMultiple()** | Get multiple collections | `Collections.getMultiple([...])` | Object |
| **waitFor()** | Async wait for collection | `await Collections.waitFor('className', 'card', 5)` | Promise→Collection |

---

## Best Practices

### 1. Configure once at application start

```javascript
// app initialization
Collections.configure({
  maxCacheSize: 2000,
  enableLogging: isDevelopment,
  cleanupInterval: 30000
});
```

---

### 2. Monitor performance in development

```javascript
if (isDevelopment) {
  setInterval(() => {
    const stats = Collections.stats();
    console.log(`Collections cache: ${stats.cacheSize}, hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
  }, 30000);
}
```

---

### 3. Use waitFor for dynamic content

```javascript
// ✅ Wait for content to load
async function loadDashboard() {
  const widgets = await Collections.waitFor('className', 'widget', 3);
  widgets.forEach(widget => initializeWidget(widget));
}

// ❌ Don't assume content is ready
function loadDashboard() {
  const widgets = Collections.ClassName.widget; // May be empty!
  widgets.forEach(widget => initializeWidget(widget));
}
```

---

### 4. Clear cache after major DOM changes

```javascript
function loadNewContent(html) {
  document.getElementById('app').innerHTML = html;

  // Clear cache since DOM changed significantly
  Collections.clear();

  // Re-initialize
  initializePage();
}
```

---

### 5. Use getMultiple for initialization

```javascript
// ✅ Efficient bulk loading
async function initializeApp() {
  const collections = Collections.getMultiple([
    { type: 'className', value: 'button' },
    { type: 'className', value: 'card' },
    { type: 'className', value: 'navItem' },
    { type: 'tagName', value: 'img' }
  ]);

  // Process all collections
  Object.entries(collections).forEach(([key, collection]) => {
    console.log(`${key}: ${collection.length} elements`);
  });
}

// ❌ Individual accesses
const buttons = Collections.ClassName.button;
const cards = Collections.ClassName.card;
const navItems = Collections.ClassName.navItem;
const images = Collections.TagName.img;
```

---

## Real-World Examples

### Performance monitoring dashboard

```javascript
class CollectionsMonitor {
  constructor() {
    this.logs = [];
  }

  start() {
    setInterval(() => {
      const stats = Collections.stats();
      this.logs.push({
        timestamp: Date.now(),
        ...stats
      });

      if (this.logs.length > 100) {
        this.logs.shift();
      }

      this.updateUI(stats);
    }, 5000);
  }

  updateUI(stats) {
    Elements.update({
      cacheSize: { textContent: stats.cacheSize },
      hitRate: { textContent: `${(stats.hitRate * 100).toFixed(1)}%` },
      totalHits: { textContent: stats.hits },
      totalMisses: { textContent: stats.misses }
    });
  }

  getReport() {
    const avgHitRate = this.logs.reduce((sum, log) => sum + log.hitRate, 0) / this.logs.length;
    return {
      averageHitRate: avgHitRate,
      samples: this.logs.length,
      currentSize: this.logs[this.logs.length - 1]?.cacheSize
    };
  }
}

const monitor = new CollectionsMonitor();
monitor.start();
```

---

### Adaptive cache configuration

```javascript
function optimizeCacheSettings() {
  const stats = Collections.stats();

  if (stats.cacheSize > 800 && stats.hitRate > 0.9) {
    // Cache is effective and nearly full - increase size
    Collections.configure({ maxCacheSize: 2000 });
    console.log('Increased cache size due to high usage');
  }

  if (stats.hitRate < 0.5) {
    // Low hit rate - maybe decrease to save memory
    Collections.configure({ maxCacheSize: 500 });
    console.log('Decreased cache size due to low hit rate');
  }
}

// Run optimization every 5 minutes
setInterval(optimizeCacheSettings, 300000);
```

---

### Infinite scroll implementation

```javascript
async function loadMoreContent() {
  const currentCount = Collections.ClassName.post.length;

  // Trigger API call to load more posts
  fetchMorePosts();

  try {
    // Wait for at least 5 new posts
    const posts = await Collections.waitFor('className', 'post', currentCount + 5, 10000);

    console.log(`Loaded ${posts.length - currentCount} new posts`);

    // Initialize new posts
    posts.slice(currentCount).forEach(post => {
      initializePost(post);
    });

  } catch (error) {
    console.error('Timeout loading more posts');
    Elements.loadMoreBtn.update({
      disabled: false,
      textContent: 'Load More'
    });
  }
}
```

---

### Environment-specific configuration

```javascript
const config = {
  development: {
    enableLogging: true,
    cleanupInterval: 10000,
    maxCacheSize: 500,
    enableEnhancedSyntax: true
  },
  production: {
    enableLogging: false,
    cleanupInterval: 60000,
    maxCacheSize: 2000,
    enableEnhancedSyntax: true
  },
  testing: {
    enableLogging: false,
    autoCleanup: false,  // Manual cleanup in tests
    enableEnhancedSyntax: true
  }
};

const env = process.env.NODE_ENV || 'development';
Collections.configure(config[env]);
```

---

### Cache warming for critical collections

```javascript
function warmCollectionsCache() {
  const criticalCollections = [
    { type: 'className', value: 'button' },
    { type: 'className', value: 'navItem' },
    { type: 'className', value: 'card' },
    { type: 'tagName', value: 'img' },
    { type: 'tagName', value: 'a' }
  ];

  Collections.getMultiple(criticalCollections);

  console.log('Cache warmed:', Collections.stats());
}

// Run on page load
document.addEventListener('DOMContentLoaded', warmCollectionsCache);
```

---

## Summary

**Utility Methods** provide control over the Collections Helper:
- Performance monitoring: `stats()`
- Cache management: `clear()`, `isCached()`
- Configuration: `configure()`
- Feature toggles: `enableEnhancedSyntax()`, `disableEnhancedSyntax()`
- Cleanup: `destroy()`

**Helper Methods** provide convenience:
- Bulk access: `getMultiple()`
- Async loading: `waitFor()`

**Remember:**
- Configure once at startup
- Monitor stats in development
- Clear cache after major DOM changes
- Use waitFor for dynamic content
- Only destroy on shutdown

---

## Complete Collections Module Documentation

You've completed all parts of the Collections Module:

1. **[Access Methods](01_Access-Methods.md)** ✅ - Getting collections
2. **[Bulk Operations](02_Bulk-Operations.md)** ✅ - `Collections.update()`
3. **[Array-like Methods](03_Array-like-Methods.md)** ✅ - `.forEach()`, `.map()`, etc.
4. **[DOM Manipulation & Filtering](04_DOM-Manipulation-and-Filtering.md)** ✅ - `.addClass()`, `.visible()`, etc.
5. **[Utility & Helper Methods](05_Utility-Helper-Methods.md)** ✅ - This document

---

**[Back to Documentation Home](../../README.md)**
