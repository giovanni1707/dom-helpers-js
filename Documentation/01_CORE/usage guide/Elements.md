# DOM Helpers - Elements Helper Documentation

## Overview

The **Elements Helper** provides high-performance, ID-based DOM element access with intelligent caching and the powerful `.update()` method. It automatically tracks elements, manages cache invalidation via MutationObserver, and enhances all returned elements with chainable update capabilities.

---

## Core Features

- **Intelligent Caching**: Automatically caches elements by ID with smart invalidation
- **MutationObserver**: Tracks DOM changes to keep cache fresh
- **Auto-Enhancement**: All elements get the `.update()` method automatically
- **Type Safety**: Robust error handling with helpful warnings
- **Performance**: Optimized for production with configurable cache limits

---

## Basic Usage

### Simple Element Access

```javascript
// Access element by ID - returns enhanced element with .update()
const button = Elements.myButton;
const header = Elements.pageHeader;
const form = Elements.loginForm;

// Direct property access (camelCase or exact ID)
const nav = Elements.mainNav;        // Accesses #mainNav
const sidebar = Elements.sidebar;     // Accesses #sidebar
```

### Safe Element Access

```javascript
// Get element with fallback if not found
const element = Elements.get('myButton', null);
const withDefault = Elements.get('optional', document.createElement('div'));

// Check if element exists
if (Elements.exists('myButton')) {
  console.log('Button exists in DOM');
}

// Check if element is cached
if (Elements.isCached('myButton')) {
  console.log('Button is in cache (faster access)');
}
```

---

## Multiple Element Access

### Basic Multiple Access

```javascript
// Get multiple elements as object
const { header, footer, sidebar } = Elements.getMultiple('header', 'footer', 'sidebar');

// Alternative: Using destructure (same as getMultiple)
const { loginBtn, signupBtn } = Elements.destructure('loginBtn', 'signupBtn');

// All missing elements will be null
console.log(loginBtn);  // Element or null
console.log(signupBtn); // Element or null
```

### Required Elements

```javascript
// Throws error if any element is missing - useful for critical elements
try {
  const { header, nav, main, footer } = Elements.getRequired(
    'header',
    'nav', 
    'main',
    'footer'
  );
  
  // All elements guaranteed to exist here
  header.update({ textContent: 'Welcome!' });
  
} catch (error) {
  console.error('Required elements missing:', error.message);
  // Handle missing critical elements
}
```

### Async Element Waiting

```javascript
// Wait for elements to appear in DOM (useful for dynamic content)
async function initializeDynamicContent() {
  try {
    // Wait up to 5 seconds (default) for elements to appear
    const { dynamicHeader, asyncContent } = await Elements.waitFor(
      'dynamicHeader',
      'asyncContent'
    );
    
    // Elements are guaranteed to exist now
    dynamicHeader.update({ textContent: 'Loaded!' });
    
  } catch (error) {
    console.error('Timeout waiting for elements:', error.message);
  }
}

// Custom timeout (10 seconds)
const { slowElement } = await Elements.waitFor('slowElement');
// Note: Timeout is currently fixed at 5s, check with 5s intervals of 100ms
```

---

## Property & Attribute Methods

### Set/Get Properties

```javascript
// Set element property
Elements.setProperty('myButton', 'textContent', 'Click Me');
Elements.setProperty('myInput', 'value', 'Hello World');
Elements.setProperty('myDiv', 'innerHTML', '<strong>Bold</strong>');

// Get element property with fallback
const text = Elements.getProperty('myButton', 'textContent', 'Default');
const value = Elements.getProperty('myInput', 'value', '');
const isDisabled = Elements.getProperty('myButton', 'disabled', false);

// Returns fallback if element doesn't exist or property is undefined
const missing = Elements.getProperty('nonExistent', 'value', 'fallback');
console.log(missing); // 'fallback'
```

### Set/Get Attributes

```javascript
// Set attribute
Elements.setAttribute('myImage', 'src', '/images/photo.jpg');
Elements.setAttribute('myLink', 'href', 'https://example.com');
Elements.setAttribute('myButton', 'data-action', 'submit');

// Get attribute with fallback
const src = Elements.getAttribute('myImage', 'src', '/default.jpg');
const href = Elements.getAttribute('myLink', 'href', '#');
const action = Elements.getAttribute('myButton', 'data-action', 'none');

// Returns fallback if element or attribute doesn't exist
const missing = Elements.getAttribute('nonExistent', 'src', 'fallback.jpg');
console.log(missing); // 'fallback.jpg'
```

---

## Bulk Operations

### Elements.update() - Update Multiple Elements

Update multiple elements by their IDs in a single call. Perfect for batch operations.

```javascript
// Basic bulk update
Elements.update({
  header: { 
    textContent: 'Welcome!',
    style: { color: 'blue', fontSize: '24px' }
  },
  
  subheader: {
    textContent: 'Getting Started',
    style: { color: 'gray' }
  },
  
  loginBtn: {
    textContent: 'Log In',
    disabled: false,
    classList: { add: ['btn-primary', 'active'] }
  }
});
```

### Bulk Update with Event Listeners

```javascript
Elements.update({
  submitBtn: {
    textContent: 'Submit Form',
    classList: { add: 'btn-success' },
    addEventListener: ['click', (e) => {
      console.log('Submit clicked!');
      // e.target.update() is available inside handlers
      e.target.update({ disabled: true });
    }]
  },
  
  cancelBtn: {
    textContent: 'Cancel',
    classList: { add: 'btn-secondary' },
    addEventListener: {
      click: (e) => console.log('Cancel clicked'),
      mouseover: (e) => e.target.update({ style: { opacity: '0.8' } })
    }
  }
});
```

### Bulk Update Return Value

```javascript
// Returns object with results for each element
const results = Elements.update({
  existingBtn: { textContent: 'Updated!' },
  missingBtn: { textContent: 'This will fail' }
});

console.log(results);
/* Output:
{
  existingBtn: { 
    success: true, 
    element: <button> 
  },
  missingBtn: { 
    success: false, 
    error: "Element with ID 'missingBtn' not found" 
  }
}
*/

// Check results programmatically
Object.entries(results).forEach(([id, result]) => {
  if (result.success) {
    console.log(`✓ Updated ${id}`);
  } else {
    console.error(`✗ Failed ${id}: ${result.error}`);
  }
});
```

---

## Utility Methods

### Cache Statistics

```javascript
// Get detailed cache statistics
const stats = Elements.stats();

console.log(stats);
/* Output:
{
  hits: 150,          // Cache hits
  misses: 45,         // Cache misses
  cacheSize: 32,      // Current cache size
  hitRate: 0.769,     // Hit rate (hits / total)
  uptime: 125000,     // Time since last cleanup (ms)
  lastCleanup: 1234567890
}
*/

// Monitor cache performance
setInterval(() => {
  const { hitRate, cacheSize } = Elements.stats();
  console.log(`Cache: ${cacheSize} items, ${(hitRate * 100).toFixed(1)}% hit rate`);
}, 5000);
```

### Clear Cache

```javascript
// Manually clear all cached elements
Elements.clear();

// Useful when doing major DOM restructuring
function rebuildUI() {
  document.body.innerHTML = newContent;
  Elements.clear(); // Clear stale cache
  initializeElements(); // Re-access elements
}
```

### Destroy Helper

```javascript
// Destroy helper and clean up resources
// - Stops MutationObserver
// - Clears cache
// - Stops auto-cleanup timer
Elements.destroy();

// Useful when unmounting SPA components
function cleanupComponent() {
  Elements.destroy();
  // Component cleanup...
}
```

### Configure Helper

```javascript
// Configure Elements Helper options
Elements.configure({
  enableLogging: true,        // Enable console warnings/logs
  autoCleanup: true,          // Auto-cleanup stale cache
  cleanupInterval: 30000,     // Cleanup every 30 seconds
  maxCacheSize: 1000,         // Maximum cached elements
  debounceDelay: 16           // MutationObserver debounce (ms)
});

// Development mode (verbose logging)
Elements.configure({
  enableLogging: true
});

// Production mode (performance-focused)
Elements.configure({
  enableLogging: false,
  maxCacheSize: 500,
  cleanupInterval: 60000
});
```

---

## Real-World Examples

### Example 1: Form Validation UI

```javascript
// Access form elements
const { usernameInput, emailInput, submitBtn, errorMsg } = 
  Elements.getRequired('usernameInput', 'emailInput', 'submitBtn', 'errorMsg');

// Validate and update UI
function validateForm() {
  const username = Elements.getProperty('usernameInput', 'value', '');
  const email = Elements.getProperty('emailInput', 'value', '');
  
  if (!username || !email) {
    Elements.update({
      errorMsg: {
        textContent: 'Please fill all fields',
        style: { display: 'block', color: 'red' }
      },
      submitBtn: { disabled: true }
    });
    return false;
  }
  
  Elements.update({
    errorMsg: { style: { display: 'none' } },
    submitBtn: { disabled: false }
  });
  return true;
}
```

### Example 2: Dynamic Dashboard

```javascript
// Wait for dashboard elements to load
async function initDashboard() {
  try {
    const { statsPanel, chartContainer, userProfile } = 
      await Elements.waitFor('statsPanel', 'chartContainer', 'userProfile');
    
    // Update dashboard with data
    Elements.update({
      statsPanel: {
        innerHTML: `<h3>Stats Loaded</h3>`,
        style: { opacity: '1' }
      },
      userProfile: {
        textContent: `Welcome, ${userName}`,
        classList: { add: 'loaded' }
      }
    });
    
  } catch (error) {
    console.error('Dashboard elements not found:', error);
    showFallbackUI();
  }
}
```

### Example 3: Theme Switcher

```javascript
// Bulk update theme colors
function applyTheme(theme) {
  const colors = themes[theme];
  
  Elements.update({
    header: {
      style: { 
        backgroundColor: colors.headerBg,
        color: colors.headerText 
      }
    },
    
    sidebar: {
      style: { 
        backgroundColor: colors.sidebarBg,
        borderColor: colors.border 
      }
    },
    
    mainContent: {
      style: { 
        backgroundColor: colors.contentBg,
        color: colors.text 
      }
    }
  });
  
  // Save theme preference
  Elements.setAttribute('body', 'data-theme', theme);
}
```

### Example 4: Progressive Enhancement

```javascript
// Safely enhance elements that may not exist
function enhanceOptionalFeatures() {
  // Only update if element exists
  if (Elements.exists('tooltipContainer')) {
    Elements.tooltipContainer.update({
      classList: { add: 'enhanced' },
      setAttribute: { 'aria-live': 'polite' }
    });
  }
  
  // Batch check and update
  const optional = ['shareBtn', 'likeBtn', 'commentBtn'];
  optional.forEach(id => {
    if (Elements.exists(id)) {
      Elements[id].update({
        classList: { add: 'social-enhanced' }
      });
    }
  });
}
```

---

## Best Practices

### ✅ Do's

```javascript
// ✅ Use getRequired for critical elements
const critical = Elements.getRequired('header', 'main', 'footer');

// ✅ Use get() with fallbacks for optional elements
const optional = Elements.get('tooltip', null);

// ✅ Use bulk updates for multiple changes
Elements.update({
  btn1: { textContent: 'One' },
  btn2: { textContent: 'Two' }
});

// ✅ Check cache stats in development
if (DEV_MODE) {
  console.log('Cache stats:', Elements.stats());
}

// ✅ Clear cache after major DOM changes
function rebuildPage() {
  updateDOM();
  Elements.clear();
}
```

### ❌ Don'ts

```javascript
// ❌ Don't access non-existent elements without checks
const broken = Elements.nonExistent.update({}); // Warning logged, returns null

// ❌ Don't assume elements exist
// BAD:
const el = Elements.maybeExists;
el.textContent = 'Crash!'; // TypeError if null

// GOOD:
const el = Elements.get('maybeExists');
if (el) el.textContent = 'Safe!';

// ❌ Don't disable caching unless necessary
Elements.configure({ maxCacheSize: 0 }); // Defeats purpose

// ❌ Don't manually manage cache in production
// BAD: Excessive clearing
setInterval(() => Elements.clear(), 100);

// GOOD: Let auto-cleanup handle it
Elements.configure({ autoCleanup: true, cleanupInterval: 30000 });
```

---

## Performance Tips

1. **Cache Hit Rate**: Aim for >80% hit rate for optimal performance
2. **Max Cache Size**: Default 1000 is good for most apps; adjust based on element count
3. **Cleanup Interval**: 30s default works well; increase for more stable DOMs
4. **Logging**: Disable in production for better performance
5. **Bulk Operations**: Use `Elements.update()` instead of multiple individual updates

---

## Configuration Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableLogging` | boolean | `false` | Enable console warnings/logs |
| `autoCleanup` | boolean | `true` | Automatically clean stale cache |
| `cleanupInterval` | number | `30000` | Cleanup interval (ms) |
| `maxCacheSize` | number | `1000` | Maximum cached elements |
| `debounceDelay` | number | `16` | MutationObserver debounce (ms) |

---

## Summary

The **Elements Helper** provides:
- Fast, cached ID-based element access
- Automatic `.update()` enhancement on all elements  
- Safe access methods with fallbacks
- Bulk update operations
- Async element waiting
- Property/attribute helpers
- Cache management and statistics

Perfect for applications that need reliable, performant element access with intelligent caching and powerful update capabilities.