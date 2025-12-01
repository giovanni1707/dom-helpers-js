# Selector Module - Additional Methods

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Part 3 of 5**: Array-like, DOM Manipulation, Filtering & Async Methods
> Complete reference for all additional Selector helper methods

---

## Table of Contents

**Array-like Methods** (on queryAll results)
**DOM Manipulation Methods** (on queryAll results)
**Filtering Methods** (on queryAll results)
**Async Methods**
**Utility Methods**

---

## Array-like Methods

All results from `queryAll()` have the same array-like methods as Collections:

- `.forEach(callback)` - Iterate elements
- `.map(callback)` - Transform to array
- `.filter(callback)` - Filter elements
- `.find(callback)` - Find first match
- `.some(callback)` - Test if any match
- `.every(callback)` - Test if all match
- `.reduce(callback, initial)` - Reduce to value
- `.toArray()` - Convert to array
- `.first()` - Get first element
- `.last()` - Get last element
- `.at(index)` - Get by index (supports negative)
- `.isEmpty()` - Check if empty

**See [Collections Array-like Methods](../Collections%20Module/03_Array-like-Methods.md) for detailed documentation.**

---

## DOM Manipulation Methods

All queryAll results have the same DOM manipulation methods as Collections:

- `.addClass(className)` - Add classes
- `.removeClass(className)` - Remove classes
- `.toggleClass(className)` - Toggle classes
- `.setProperty(prop, value)` - Set property
- `.setAttribute(attr, value)` - Set attribute
- `.setStyle(styles)` - Set styles
- `.on(event, handler)` - Add event listener
- `.off(event, handler)` - Remove event listener

**See [Collections DOM Manipulation](../Collections%20Module/04_DOM-Manipulation-and-Filtering.md) for detailed documentation.**

---

## Filtering Methods

All queryAll results have the same filtering methods as Collections:

- `.visible()` - Filter to visible elements
- `.hidden()` - Filter to hidden elements
- `.enabled()` - Filter to enabled elements
- `.disabled()` - Filter to disabled elements
- `.within(selector)` - Filter to elements within selector

### Example: `.within()` filtering
```javascript
const allButtons = Selector.queryAll('.button');

// Filter to only buttons within #modal
const modalButtons = allButtons.within('#modal');

// Filter to only buttons within .sidebar
const sidebarButtons = allButtons.within('.sidebar');
```

**See [Collections Filtering Methods](../Collections%20Module/04_DOM-Manipulation-and-Filtering.md) for detailed documentation.**

---

## Async Methods

### `Selector.waitFor()` - Wait for Single Element

**Asynchronously wait for an element matching a selector to appear.**

```javascript
await Selector.waitFor(selector, timeout)
```

**Parameters:**
- `selector` (string) - CSS selector
- `timeout` (number, default: 5000) - Timeout in milliseconds

**Returns:** Promise that resolves to the element

**Examples:**
```javascript
// Wait for modal to appear
const modal = await Selector.waitFor('#modal');
modal.update({ classList: { add: ['visible'] } });

// Custom timeout
const slowElement = await Selector.waitFor('.dynamic-content', 10000);

// Use in async function
async function loadContent() {
  try {
    const content = await Selector.waitFor('.loaded-content');
    console.log('Content loaded:', content);
  } catch (error) {
    console.error('Timeout waiting for content');
  }
}
```

---

### `Selector.waitForAll()` - Wait for Multiple Elements

**Wait for multiple elements (minimum count) to appear.**

```javascript
await Selector.waitForAll(selector, minCount, timeout)
```

**Parameters:**
- `selector` (string) - CSS selector
- `minCount` (number, default: 1) - Minimum number of elements
- `timeout` (number, default: 5000) - Timeout in milliseconds

**Returns:** Promise that resolves to the collection

**Examples:**
```javascript
// Wait for at least 5 cards
const cards = await Selector.waitForAll('.card', 5);
console.log(`${cards.length} cards loaded`);

// Wait for at least 10 images with custom timeout
const images = await Selector.waitForAll('img', 10, 10000);

// Infinite scroll implementation
async function loadMoreItems() {
  const currentCount = Selector.queryAll('.item').length;

  // Trigger API call
  fetchMoreItems();

  // Wait for new items
  const items = await Selector.waitForAll('.item', currentCount + 5);
  console.log('New items loaded');
}
```

---

## Utility Methods

### `Selector.stats()` - Performance Statistics

**Get performance statistics for the Selector helper.**

```javascript
Selector.stats()
```

**Returns:** Object with performance metrics

**Example:**
```javascript
const stats = Selector.stats();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
console.log(`Cache size: ${stats.cacheSize}`);
```

---

### `Selector.clear()` - Clear Cache

**Manually clear all cached selectors.**

```javascript
Selector.clear()
```

**Returns:** Selector helper (for chaining)

**Example:**
```javascript
// Clear cache after major DOM changes
document.body.innerHTML = newContent;
Selector.clear();
```

---

### `Selector.destroy()` - Cleanup

**Destroy the Selector helper and clean up resources.**

```javascript
Selector.destroy()
```

**Returns:** undefined

**Example:**
```javascript
// Application shutdown
window.addEventListener('beforeunload', () => {
  Selector.destroy();
});
```

---

### `Selector.enableEnhancedSyntax()` - Enable Features

**Enable enhanced syntax features (property access, array methods, etc.).**

```javascript
Selector.enableEnhancedSyntax()
```

**Returns:** Selector helper (for chaining)

---

### `Selector.disableEnhancedSyntax()` - Disable Features

**Disable enhanced syntax for lighter weight queries.**

```javascript
Selector.disableEnhancedSyntax()
```

**Returns:** Selector helper (for chaining)

---

### `Selector.configure()` - Configuration

**Update the Selector helper's configuration.**

```javascript
Selector.configure(options)
```

**Available options:**
```javascript
{
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 1000,
  debounceDelay: 16,
  enableSmartCaching: true,
  enableEnhancedSyntax: true
}
```

**Example:**
```javascript
Selector.configure({
  maxCacheSize: 2000,
  enableLogging: true
});
```

---

## Quick Reference

### Async Methods

| Method | Purpose | Example |
|--------|---------|---------|
| **waitFor()** | Wait for single element | `await Selector.waitFor('#modal')` |
| **waitForAll()** | Wait for multiple elements | `await Selector.waitForAll('.card', 5)` |

### Utility Methods

| Method | Purpose | Example |
|--------|---------|---------|
| **stats()** | Get statistics | `Selector.stats()` |
| **clear()** | Clear cache | `Selector.clear()` |
| **destroy()** | Cleanup | `Selector.destroy()` |
| **configure()** | Update config | `Selector.configure({ maxCacheSize: 2000 })` |
| **enableEnhancedSyntax()** | Enable features | `Selector.enableEnhancedSyntax()` |
| **disableEnhancedSyntax()** | Disable features | `Selector.disableEnhancedSyntax()` |

---

## Real-World Examples

### Infinite scroll with waitForAll
```javascript
let loading = false;

window.addEventListener('scroll', async () => {
  if (loading) return;

  const scrollBottom = window.innerHeight + window.scrollY;
  const docHeight = document.documentElement.scrollHeight;

  if (scrollBottom >= docHeight - 100) {
    loading = true;
    const currentCount = Selector.queryAll('.post').length;

    // Fetch more posts
    await fetchPosts();

    // Wait for new posts to render
    try {
      await Selector.waitForAll('.post', currentCount + 10, 5000);
      console.log('New posts loaded');
    } catch (error) {
      console.error('Failed to load more posts');
    }

    loading = false;
  }
});
```

---

### SPA navigation with waitFor
```javascript
async function navigateTo(route) {
  // Update URL
  history.pushState(null, '', route);

  // Load route content
  loadRoute(route);

  try {
    // Wait for main content to render
    const main = await Selector.waitFor('#main-content', 3000);

    // Initialize page
    initializePage(main);

    // Scroll to top
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Navigation timeout');
    showError('Failed to load page');
  }
}
```

---

## Best Practices

### 1. Use waitFor for dynamic content
```javascript
// ✅ Wait for content
async function loadDashboard() {
  const widget = await Selector.waitFor('.dashboard-widget');
  initializeWidget(widget);
}

// ❌ Assuming content is ready
function loadDashboard() {
  const widget = Selector.query('.dashboard-widget'); // Might be null!
  initializeWidget(widget);
}
```

---

### 2. Configure once at startup
```javascript
// app.js
Selector.configure({
  maxCacheSize: 2000,
  enableLogging: isDevelopment
});
```

---

### 3. Clear cache after major changes
```javascript
function replaceContent(newContent) {
  document.getElementById('app').innerHTML = newContent;
  Selector.clear(); // Clear stale cache
}
```

---

## Next Steps

Continue to the other Selector documentation:

- **[Query Methods](01_Query-Methods.md)** - query() and queryAll()
- **[Scoped Queries & Bulk Operations](02_Scoped-Bulk-Operations.md)** - Scoped queries and bulk updates
- **[Selector Module README](README.md)** - Complete overview

For detailed documentation on Array-like, DOM Manipulation, and Filtering methods:
- **[Collections Array-like Methods](../Collections%20Module/03_Array-like-Methods.md)**
- **[Collections DOM Manipulation](../Collections%20Module/04_DOM-Manipulation-and-Filtering.md)**

---

**[Back to Documentation Home](../../README.md)**
