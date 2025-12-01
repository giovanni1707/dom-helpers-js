# DOMHelpers Global Object - Complete Guide

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Unified interface to all DOM Helpers features**
> Access all helpers, methods, and utilities through one global object

---

## Table of Contents

1. [Overview](#overview)
2. [Properties](#properties)
3. [Methods](#methods)
4. [Configuration](#configuration)
5. [Statistics & Cache Management](#statistics--cache-management)
6. [Complete Examples](#complete-examples)
7. [Best Practices](#best-practices)

---

## Overview

### What is DOMHelpers?

**DOMHelpers** is the global object that provides:
- **Unified access** to all helpers (Elements, Collections, Selector)
- **Global methods** for configuration and management
- **Utility methods** for statistics and cache control
- **Version information** and readiness checking

---

### How to access it

```javascript
// DOMHelpers is globally available
console.log(DOMHelpers);

// Access individual helpers
DOMHelpers.Elements
DOMHelpers.Collections
DOMHelpers.Selector

// Call global methods
DOMHelpers.getStats()
DOMHelpers.configure({ ... })
```

---

### Why use DOMHelpers?

✅ **Single entry point** - Everything accessible from one object
✅ **Unified configuration** - Configure all helpers at once
✅ **Combined statistics** - View all performance metrics together
✅ **Centralized control** - Clear all caches, destroy all helpers
✅ **Version management** - Check library version
✅ **Readiness checking** - Verify all helpers are available

---

## Properties

### `DOMHelpers.Elements`

**Reference to the Elements Helper.**

```javascript
DOMHelpers.Elements
```

**Returns:** Elements helper object

**Examples:**
```javascript
// Access Elements helper
const header = DOMHelpers.Elements.header;

// Same as direct access
const header = Elements.header;

// Use Elements methods
const { header, footer } = DOMHelpers.Elements.destructure('header', 'footer');

// Update multiple elements
DOMHelpers.Elements.update({
  header: { textContent: 'Welcome' },
  footer: { textContent: 'Copyright 2024' }
});
```

**When to use:**
- When you want explicit DOMHelpers namespace
- In modules/libraries to avoid global pollution
- For clarity in large codebases

---

### `DOMHelpers.Collections`

**Reference to the Collections Helper.**

```javascript
DOMHelpers.Collections
```

**Returns:** Collections helper object

**Examples:**
```javascript
// Access Collections helper
const buttons = DOMHelpers.Collections.ClassName.button;

// Same as direct access
const buttons = Collections.ClassName.button;

// Use Collections methods
DOMHelpers.Collections.update({
  ClassName: {
    button: { style: { padding: '10px' } }
  }
});

// Get statistics
const stats = DOMHelpers.Collections.stats();
```

---

### `DOMHelpers.Selector`

**Reference to the Selector Helper.**

```javascript
DOMHelpers.Selector
```

**Returns:** Selector helper object

**Examples:**
```javascript
// Access Selector helper
const button = DOMHelpers.Selector.query('.button');

// Same as direct access
const button = Selector.query('.button');

// Use scoped queries
const modalBtn = DOMHelpers.Selector.Scoped.within('#modal', '.button');

// Update multiple selectors
DOMHelpers.Selector.update({
  '.button': { style: { padding: '10px' } },
  '.card': { style: { borderRadius: '8px' } }
});
```

---

### `DOMHelpers.createElement`

**Reference to the enhanced createElement function.**

```javascript
DOMHelpers.createElement
```

**Returns:** Enhanced createElement function

**Examples:**
```javascript
// Use enhanced createElement
const div = DOMHelpers.createElement('div', {
  textContent: 'Hello',
  className: 'box'
});

// Bulk creation
const elements = DOMHelpers.createElement.bulk([
  { tag: 'div', id: 'header' },
  { tag: 'div', id: 'main' }
]);

// Same as global createElement
const div = createElement('div', { ... });
```

---

### `DOMHelpers.version`

**Library version string.**

```javascript
DOMHelpers.version
```

**Returns:** Version string (e.g., "2.3.1")

**Examples:**
```javascript
// Check version
console.log(`DOM Helpers v${DOMHelpers.version}`);

// Version-based feature detection
const [major, minor, patch] = DOMHelpers.version.split('.').map(Number);

if (major >= 2 && minor >= 3) {
  console.log('Advanced features available');
}

// Log for debugging
console.log('Library version:', DOMHelpers.version);
```

---

### `DOMHelpers.ProductionElementsHelper`

**Reference to the Elements Helper class.**

```javascript
DOMHelpers.ProductionElementsHelper
```

**Returns:** ProductionElementsHelper class

**When to use:**
- Creating custom instances
- Advanced usage scenarios
- Testing and development

**Example:**
```javascript
// Create custom instance
const customElements = new DOMHelpers.ProductionElementsHelper({
  enableLogging: true,
  maxCacheSize: 500
});
```

---

### `DOMHelpers.ProductionCollectionHelper`

**Reference to the Collections Helper class.**

```javascript
DOMHelpers.ProductionCollectionHelper
```

**Returns:** ProductionCollectionHelper class

**Example:**
```javascript
// Create custom instance
const customCollections = new DOMHelpers.ProductionCollectionHelper({
  enableLogging: true,
  cleanupInterval: 10000
});
```

---

### `DOMHelpers.ProductionSelectorHelper`

**Reference to the Selector Helper class.**

```javascript
DOMHelpers.ProductionSelectorHelper
```

**Returns:** ProductionSelectorHelper class

**Example:**
```javascript
// Create custom instance
const customSelector = new DOMHelpers.ProductionSelectorHelper({
  enableLogging: true,
  enableSmartCaching: true
});
```

---

## Methods

### `DOMHelpers.isReady()`

**Check if all helpers are available and ready.**

```javascript
DOMHelpers.isReady()
```

**Returns:** Boolean - `true` if all helpers are ready, `false` otherwise

**Examples:**
```javascript
// Check readiness
if (DOMHelpers.isReady()) {
  console.log('All helpers are ready');
  initializeApp();
} else {
  console.error('Some helpers are not available');
}

// Wait for readiness
function waitForReady() {
  if (DOMHelpers.isReady()) {
    initializeApp();
  } else {
    setTimeout(waitForReady, 100);
  }
}

// Use in conditional initialization
if (DOMHelpers.isReady()) {
  const header = Elements.header;
  const buttons = Collections.ClassName.button;
  const modal = Selector.query('.modal');
}
```

**What it checks:**
- Elements helper is available
- Collections helper is available
- Selector helper is available

---

### `DOMHelpers.getStats()`

**Get combined statistics from all helpers.**

```javascript
DOMHelpers.getStats()
```

**Returns:** Object with statistics from all helpers

**Return structure:**
```javascript
{
  elements: {
    hits: 150,
    misses: 25,
    hitRate: 0.857,
    cacheSize: 42,
    lastCleanup: 1234567890
  },
  collections: {
    hits: 200,
    misses: 30,
    hitRate: 0.870,
    cacheSize: 38,
    lastCleanup: 1234567890
  },
  selector: {
    hits: 180,
    misses: 20,
    hitRate: 0.900,
    cacheSize: 45,
    lastCleanup: 1234567890
  }
}
```

**Examples:**
```javascript
// Get all statistics
const stats = DOMHelpers.getStats();

console.log('Elements cache size:', stats.elements.cacheSize);
console.log('Collections hit rate:', (stats.collections.hitRate * 100).toFixed(1) + '%');
console.log('Selector hits:', stats.selector.hits);

// Display all stats
function displayStats() {
  const stats = DOMHelpers.getStats();

  console.table({
    Elements: {
      'Hit Rate': (stats.elements.hitRate * 100).toFixed(1) + '%',
      'Cache Size': stats.elements.cacheSize,
      'Hits': stats.elements.hits,
      'Misses': stats.elements.misses
    },
    Collections: {
      'Hit Rate': (stats.collections.hitRate * 100).toFixed(1) + '%',
      'Cache Size': stats.collections.cacheSize,
      'Hits': stats.collections.hits,
      'Misses': stats.collections.misses
    },
    Selector: {
      'Hit Rate': (stats.selector.hitRate * 100).toFixed(1) + '%',
      'Cache Size': stats.selector.cacheSize,
      'Hits': stats.selector.hits,
      'Misses': stats.selector.misses
    }
  });
}

// Calculate total cache size
const stats = DOMHelpers.getStats();
const totalCacheSize = stats.elements.cacheSize +
                       stats.collections.cacheSize +
                       stats.selector.cacheSize;
console.log('Total cache size:', totalCacheSize);
```

---

### `DOMHelpers.clearAll()`

**Clear all caches from all helpers.**

```javascript
DOMHelpers.clearAll()
```

**Returns:** DOMHelpers (for chaining)

**What it clears:**
- Elements cache
- Collections cache
- Selector cache

**Examples:**
```javascript
// Clear all caches
DOMHelpers.clearAll();

// After major DOM changes
function rebuildPage(newContent) {
  document.body.innerHTML = newContent;

  // Clear all caches
  DOMHelpers.clearAll();

  // Reinitialize
  initializePage();
}

// Clear on route change (SPA)
router.on('route-change', () => {
  DOMHelpers.clearAll();
});

// Periodic cache clearing
setInterval(() => {
  const stats = DOMHelpers.getStats();
  const totalCache = stats.elements.cacheSize +
                     stats.collections.cacheSize +
                     stats.selector.cacheSize;

  if (totalCache > 1000) {
    console.log('Cache full, clearing...');
    DOMHelpers.clearAll();
  }
}, 60000);
```

---

### `DOMHelpers.destroyAll()`

**Destroy all helpers and clean up all resources.**

```javascript
DOMHelpers.destroyAll()
```

**Returns:** `undefined`

**What it destroys:**
- Elements helper (cache, observers, timers)
- Collections helper (cache, observers, timers)
- Selector helper (cache, observers, timers)

**Examples:**
```javascript
// Application shutdown
function shutdownApp() {
  // Clean up all helpers
  DOMHelpers.destroyAll();

  console.log('Application shut down');
}

window.addEventListener('beforeunload', shutdownApp);

// Component unmounting (React example)
useEffect(() => {
  // Initialize app
  initializeApp();

  return () => {
    // Cleanup on unmount
    DOMHelpers.destroyAll();
  };
}, []);

// Test cleanup
afterAll(() => {
  DOMHelpers.destroyAll();
});
```

**⚠️ Warning:** After calling `destroyAll()`, the helpers are unusable until reinitialized.

---

### `DOMHelpers.configure(options)`

**Configure all helpers at once.**

```javascript
DOMHelpers.configure(options)
```

**Parameters:**
- `options` (object) - Configuration options

**Returns:** DOMHelpers (for chaining)

**Option structure:**
```javascript
{
  // Global options (apply to all helpers)
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 1000,

  // Helper-specific options
  elements: { /* Elements-specific options */ },
  collections: { /* Collections-specific options */ },
  selector: { /* Selector-specific options */ }
}
```

---

### Configuration Examples

#### Global configuration (all helpers)
```javascript
// Apply same config to all helpers
DOMHelpers.configure({
  enableLogging: true,
  maxCacheSize: 2000,
  cleanupInterval: 60000
});

// Same as:
Elements.configure({ enableLogging: true, maxCacheSize: 2000, cleanupInterval: 60000 });
Collections.configure({ enableLogging: true, maxCacheSize: 2000, cleanupInterval: 60000 });
Selector.configure({ enableLogging: true, maxCacheSize: 2000, cleanupInterval: 60000 });
```

---

#### Helper-specific configuration
```javascript
// Configure each helper differently
DOMHelpers.configure({
  elements: {
    maxCacheSize: 500,
    enableLogging: true
  },
  collections: {
    maxCacheSize: 1000,
    enableEnhancedSyntax: true
  },
  selector: {
    maxCacheSize: 1500,
    enableSmartCaching: true
  }
});
```

---

#### Mixed configuration
```javascript
// Global + specific options
DOMHelpers.configure({
  // Global (applies to all)
  enableLogging: false,
  autoCleanup: true,

  // Specific overrides
  elements: {
    maxCacheSize: 500  // Only Elements gets this
  },
  selector: {
    enableSmartCaching: true  // Only Selector gets this
  }
});
```

---

#### Environment-based configuration
```javascript
// Development environment
if (process.env.NODE_ENV === 'development') {
  DOMHelpers.configure({
    enableLogging: true,
    cleanupInterval: 10000,  // More frequent cleanup
    maxCacheSize: 500        // Smaller cache for testing
  });
}

// Production environment
if (process.env.NODE_ENV === 'production') {
  DOMHelpers.configure({
    enableLogging: false,
    cleanupInterval: 60000,  // Less frequent cleanup
    maxCacheSize: 2000       // Larger cache for performance
  });
}
```

---

### `DOMHelpers.enableCreateElementEnhancement()`

**Enable the createElement enhancement feature.**

```javascript
DOMHelpers.enableCreateElementEnhancement()
```

**Returns:** DOMHelpers (for chaining)

**What it does:**
- Replaces native `document.createElement` with enhanced version
- All created elements get `.update()` method
- Configuration objects are supported

**Examples:**
```javascript
// Enable enhancement
DOMHelpers.enableCreateElementEnhancement();

// Now createElement is enhanced
const div = document.createElement('div', {
  textContent: 'Hello',
  className: 'box',
  style: { padding: '10px' }
});

div.update({ textContent: 'Updated' });  // Works!

// Check if enabled
console.log('createElement enhanced:',
  document.createElement !== originalCreateElement
);
```

---

### `DOMHelpers.disableCreateElementEnhancement()`

**Disable the createElement enhancement feature.**

```javascript
DOMHelpers.disableCreateElementEnhancement()
```

**Returns:** DOMHelpers (for chaining)

**What it does:**
- Restores native `document.createElement`
- Configuration objects don't work
- No automatic `.update()` method

**Examples:**
```javascript
// Disable enhancement
DOMHelpers.disableCreateElementEnhancement();

// Now createElement is native
const div = document.createElement('div');
// div.update({ ... });  // Error: update is not a function

// Configuration objects don't work
const button = document.createElement('button', {
  textContent: 'Click'  // Ignored
});
```

---

## Configuration

### Available Configuration Options

#### Global Options (All Helpers)

```javascript
{
  enableLogging: false,        // Enable console logging
  autoCleanup: true,           // Enable automatic cache cleanup
  cleanupInterval: 30000,      // Cleanup interval in ms
  maxCacheSize: 1000,          // Maximum cache size
  debounceDelay: 16            // Debounce delay for updates
}
```

---

#### Elements-Specific Options

```javascript
{
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 1000,
  debounceDelay: 16,
  waitForTimeout: 5000,        // Default timeout for waitFor()
  waitForInterval: 50          // Check interval for waitFor()
}
```

---

#### Collections-Specific Options

```javascript
{
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 1000,
  debounceDelay: 16,
  enableEnhancedSyntax: true   // Enable enhanced collection features
}
```

---

#### Selector-Specific Options

```javascript
{
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 1000,
  debounceDelay: 16,
  enableSmartCaching: true,    // Smart cache based on selector patterns
  enableEnhancedSyntax: true   // Enable property-based access
}
```

---

## Statistics & Cache Management

### Understanding Statistics

Each helper tracks:
- **hits** - Number of cache hits (fast access)
- **misses** - Number of cache misses (DOM query)
- **hitRate** - Percentage of cache hits (0-1)
- **cacheSize** - Current number of cached items
- **lastCleanup** - Timestamp of last cleanup

---

### Performance Monitoring

```javascript
// Create performance monitor
class DOMHelpersMonitor {
  constructor() {
    this.logs = [];
  }

  start() {
    setInterval(() => {
      const stats = DOMHelpers.getStats();
      this.logs.push({
        timestamp: Date.now(),
        ...stats
      });

      this.displayStats(stats);
    }, 5000);
  }

  displayStats(stats) {
    console.log('=== DOM Helpers Performance ===');
    console.log(`Elements: ${stats.elements.cacheSize} items, ${(stats.elements.hitRate * 100).toFixed(1)}% hit rate`);
    console.log(`Collections: ${stats.collections.cacheSize} items, ${(stats.collections.hitRate * 100).toFixed(1)}% hit rate`);
    console.log(`Selector: ${stats.selector.cacheSize} items, ${(stats.selector.hitRate * 100).toFixed(1)}% hit rate`);
  }

  getReport() {
    const avgElementsHitRate = this.logs.reduce((sum, log) =>
      sum + log.elements.hitRate, 0) / this.logs.length;

    const avgCollectionsHitRate = this.logs.reduce((sum, log) =>
      sum + log.collections.hitRate, 0) / this.logs.length;

    const avgSelectorHitRate = this.logs.reduce((sum, log) =>
      sum + log.selector.hitRate, 0) / this.logs.length;

    return {
      averageHitRates: {
        elements: avgElementsHitRate,
        collections: avgCollectionsHitRate,
        selector: avgSelectorHitRate
      },
      samples: this.logs.length
    };
  }
}

const monitor = new DOMHelpersMonitor();
monitor.start();
```

---

### Cache Management Strategies

#### Periodic clearing
```javascript
// Clear cache every 5 minutes
setInterval(() => {
  DOMHelpers.clearAll();
  console.log('Cache cleared');
}, 300000);
```

#### Size-based clearing
```javascript
// Clear when cache gets too large
setInterval(() => {
  const stats = DOMHelpers.getStats();
  const totalSize = stats.elements.cacheSize +
                    stats.collections.cacheSize +
                    stats.selector.cacheSize;

  if (totalSize > 2000) {
    DOMHelpers.clearAll();
    console.log('Cache size exceeded threshold, cleared');
  }
}, 60000);
```

#### Event-based clearing
```javascript
// Clear on route change
window.addEventListener('popstate', () => {
  DOMHelpers.clearAll();
});

// Clear on major DOM changes
const observer = new MutationObserver(() => {
  DOMHelpers.clearAll();
});

observer.observe(document.body, {
  childList: true,
  subtree: false
});
```

---

## Complete Examples

### Example 1: Application Setup

```javascript
// app.js - Initialize DOM Helpers
function initializeDOMHelpers() {
  // Check if ready
  if (!DOMHelpers.isReady()) {
    console.error('DOM Helpers not ready');
    return;
  }

  // Log version
  console.log(`DOM Helpers v${DOMHelpers.version}`);

  // Configure all helpers
  const isDev = process.env.NODE_ENV === 'development';

  DOMHelpers.configure({
    // Global settings
    enableLogging: isDev,
    autoCleanup: true,
    cleanupInterval: isDev ? 10000 : 60000,

    // Helper-specific settings
    elements: {
      maxCacheSize: isDev ? 500 : 2000
    },
    collections: {
      enableEnhancedSyntax: true
    },
    selector: {
      enableSmartCaching: true
    }
  });

  // Enable createElement enhancement
  DOMHelpers.enableCreateElementEnhancement();

  // Log initial stats
  if (isDev) {
    console.log('Initial stats:', DOMHelpers.getStats());
  }
}

// Run on load
document.addEventListener('DOMContentLoaded', initializeDOMHelpers);
```

---

### Example 2: Performance Dashboard

```javascript
// Create dashboard
function createPerformanceDashboard() {
  const dashboard = createElement('div', {
    id: 'perfDashboard',
    className: 'performance-dashboard',
    style: {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: '10000'
    }
  });

  // Update stats every second
  setInterval(() => {
    const stats = DOMHelpers.getStats();

    dashboard.innerHTML = `
      <h4 style="margin: 0 0 10px 0;">DOM Helpers Performance</h4>
      <div><strong>Version:</strong> ${DOMHelpers.version}</div>
      <div><strong>Ready:</strong> ${DOMHelpers.isReady() ? 'Yes' : 'No'}</div>

      <h5 style="margin: 10px 0 5px 0;">Elements</h5>
      <div>Cache: ${stats.elements.cacheSize} | Hit Rate: ${(stats.elements.hitRate * 100).toFixed(1)}%</div>

      <h5 style="margin: 10px 0 5px 0;">Collections</h5>
      <div>Cache: ${stats.collections.cacheSize} | Hit Rate: ${(stats.collections.hitRate * 100).toFixed(1)}%</div>

      <h5 style="margin: 10px 0 5px 0;">Selector</h5>
      <div>Cache: ${stats.selector.cacheSize} | Hit Rate: ${(stats.selector.hitRate * 100).toFixed(1)}%</div>

      <button id="clearCacheBtn" style="margin-top: 10px; padding: 5px 10px;">Clear All Caches</button>
    `;

    const clearBtn = dashboard.querySelector('#clearCacheBtn');
    clearBtn.addEventListener('click', () => {
      DOMHelpers.clearAll();
      alert('All caches cleared!');
    });
  }, 1000);

  document.body.appendChild(dashboard);
}

// Show in development
if (process.env.NODE_ENV === 'development') {
  createPerformanceDashboard();
}
```

---

### Example 3: Namespaced Usage

```javascript
// myLibrary.js - Use DOMHelpers namespace to avoid conflicts
const MyLibrary = (function() {
  // Use DOMHelpers namespace
  const { Elements, Collections, Selector } = DOMHelpers;

  function init() {
    // Check readiness
    if (!DOMHelpers.isReady()) {
      throw new Error('DOMHelpers not ready');
    }

    // Configure
    DOMHelpers.configure({
      enableLogging: false,
      maxCacheSize: 1000
    });
  }

  function createComponent(id) {
    // Use helpers via DOMHelpers
    const container = DOMHelpers.Elements.get(id);
    const buttons = DOMHelpers.Collections.ClassName.button;
    const modal = DOMHelpers.Selector.query('.modal');

    return { container, buttons, modal };
  }

  return {
    init,
    createComponent
  };
})();

// Usage
MyLibrary.init();
const component = MyLibrary.createComponent('app');
```

---

### Example 4: SPA Integration

```javascript
// router.js - Clear cache on route changes
class Router {
  constructor() {
    this.routes = new Map();
    this.init();
  }

  init() {
    // Configure DOM Helpers
    DOMHelpers.configure({
      enableLogging: false,
      autoCleanup: true
    });

    // Clear cache on route change
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
  }

  handleRouteChange() {
    // Clear all caches
    DOMHelpers.clearAll();

    // Get new route
    const path = window.location.pathname;
    const route = this.routes.get(path);

    if (route) {
      route();
    }

    // Log stats
    console.log('Route changed, stats:', DOMHelpers.getStats());
  }

  register(path, callback) {
    this.routes.set(path, callback);
  }
}

const router = new Router();
router.register('/home', () => loadHomePage());
router.register('/about', () => loadAboutPage());
```

---

## Best Practices

### 1. Configure once at application start

```javascript
// ✅ Configure during initialization
function initApp() {
  DOMHelpers.configure({
    enableLogging: isDevelopment,
    maxCacheSize: 2000
  });

  // Rest of initialization
}

// ❌ Don't configure repeatedly
function doSomething() {
  DOMHelpers.configure({ ... });  // Bad: Reconfigures every time
}
```

---

### 2. Use isReady() before initialization

```javascript
// ✅ Check readiness
if (DOMHelpers.isReady()) {
  initializeApp();
} else {
  console.error('DOMHelpers not ready');
}

// ❌ Assume it's ready
Elements.header.update({ ... });  // May fail if not ready
```

---

### 3. Monitor statistics in development

```javascript
// ✅ Development monitoring
if (isDevelopment) {
  setInterval(() => {
    console.log('Stats:', DOMHelpers.getStats());
  }, 30000);
}

// ❌ Don't monitor in production
// Monitoring has performance overhead
```

---

### 4. Clear caches after major DOM changes

```javascript
// ✅ Clear after DOM changes
function updatePage(newContent) {
  document.body.innerHTML = newContent;
  DOMHelpers.clearAll();  // Clear stale caches
  initializePage();
}

// ❌ Don't leave stale caches
function updatePage(newContent) {
  document.body.innerHTML = newContent;
  // Caches still point to old elements!
}
```

---

### 5. Destroy on application shutdown

```javascript
// ✅ Clean shutdown
window.addEventListener('beforeunload', () => {
  DOMHelpers.destroyAll();
});

// ✅ Component unmount
useEffect(() => {
  return () => {
    DOMHelpers.destroyAll();
  };
}, []);
```

---

### 6. Use namespace in libraries

```javascript
// ✅ Use DOMHelpers namespace
const MyLib = {
  init() {
    const elements = DOMHelpers.Elements;
    // ...
  }
};

// ❌ Rely on globals
const MyLib = {
  init() {
    const header = Elements.header;  // May conflict with other libraries
  }
};
```

---

## Summary

**DOMHelpers Global Object** provides:

✅ **Properties:**
- `Elements`, `Collections`, `Selector` - Helper references
- `createElement` - Enhanced createElement function
- `version` - Library version
- `ProductionElementsHelper`, `ProductionCollectionHelper`, `ProductionSelectorHelper` - Class references

✅ **Methods:**
- `isReady()` - Check if helpers are available
- `getStats()` - Combined statistics
- `clearAll()` - Clear all caches
- `destroyAll()` - Cleanup all resources
- `configure()` - Configure all helpers
- `enableCreateElementEnhancement()` - Enable createElement
- `disableCreateElementEnhancement()` - Disable createElement

✅ **Use It For:**
- Unified configuration
- Combined statistics
- Cache management
- Version checking
- Namespaced access
- Library integration

---

**[Back to Documentation Home](../README.md)**
