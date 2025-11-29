# Id Shortcut Module Documentation

## Overview

The **Id Shortcut Module** (`02_dh-idShortcut.js`) provides a convenient wrapper around the Elements helper for accessing DOM elements by their ID. It offers a cleaner, more intuitive API than `document.getElementById()` while maintaining full integration with the core Elements helper's caching system.

**Version:** 1.0.0  
**License:** MIT  
**Dependencies:** `dh-core.js` (Elements helper)

---

## Installation & Setup

### Basic Usage

```html
<!-- Load core module first -->
<script src="dh-core.js"></script>

<!-- Then load Id shortcut -->
<script src="02_dh-idShortcut.js"></script>
```

### Module Formats Supported

- **Browser globals** (standard `<script>` tag)
- **CommonJS** (Node.js: `const Id = require('./02_dh-idShortcut')`)
- **AMD/RequireJS** compatible

---

## Core Functionality

### Basic Element Access

#### `Id(id)`

Retrieves an element by its ID with automatic caching and enhancement.

**Parameters:**
- `id` (string) - The element's ID attribute

**Returns:**
- `HTMLElement` with `.update()` method, or `null` if not found

**Examples:**

```javascript
// Simple element retrieval
const button = Id('submitBtn');

// Chained operations with .update()
Id('myButton').update({
  textContent: 'Click Me',
  style: { color: 'blue' }
});

// Null-safe operations
const header = Id('header');
if (header) {
  header.textContent = 'Welcome!';
}
```

**Key Features:**
- Automatic input validation (type checking, whitespace trimming)
- Leverages Elements helper caching for performance
- Returns enhanced elements with `.update()` method
- Null-safe - returns `null` for missing elements

---

## Advanced Methods

### Multiple Element Operations

#### `Id.multiple(...ids)`

Retrieve multiple elements at once as an object.

**Parameters:**
- `...ids` (string[]) - Element IDs to retrieve

**Returns:**
- Object with IDs as keys and elements as values

**Examples:**

```javascript
// Basic destructuring
const { header, footer, sidebar } = Id.multiple('header', 'footer', 'sidebar');

// With null checks
const elements = Id.multiple('btn1', 'btn2', 'btn3');
if (elements.btn1 && elements.btn2) {
  elements.btn1.textContent = 'First';
  elements.btn2.textContent = 'Second';
}
```

---

#### `Id.required(...ids)`

Get elements that **must** exist. Throws an error if any are missing.

**Parameters:**
- `...ids` (string[]) - Required element IDs

**Returns:**
- Object with ID keys and element values

**Throws:**
- `Error` if any required element is not found

**Examples:**

```javascript
try {
  const { header, mainContent } = Id.required('header', 'mainContent');
  // Safe to use - guaranteed to exist
  header.textContent = 'Welcome';
} catch (error) {
  console.error('Required elements missing:', error.message);
}
```

**Use Case:** Critical application setup where missing elements should halt execution.

---

### Asynchronous Operations

#### `Id.waitFor(id, timeout = 5000)`

Wait for an element to appear in the DOM (useful for dynamic content).

**Parameters:**
- `id` (string) - Element ID to wait for
- `timeout` (number) - Maximum wait time in milliseconds (default: 5000)

**Returns:**
- `Promise<HTMLElement>` that resolves when element appears

**Throws:**
- `Error` if timeout is reached

**Examples:**

```javascript
// Promise-based
Id.waitFor('dynamicButton', 3000)
  .then(button => {
    button.textContent = 'Loaded!';
  })
  .catch(error => {
    console.error('Element never appeared:', error);
  });

// Async/await
async function setupDynamicContent() {
  try {
    const modal = await Id.waitFor('modal');
    modal.style.display = 'block';
  } catch (error) {
    console.error('Modal not found');
  }
}
```

---

### Utility Methods

#### `Id.exists(id)`

Check if an element exists without retrieving it.

**Parameters:**
- `id` (string) - Element ID to check

**Returns:**
- `boolean` - True if element exists

**Example:**

```javascript
if (Id.exists('optionalFeature')) {
  Id('optionalFeature').classList.add('active');
}
```

---

#### `Id.get(id, fallback = null)`

Get element with a fallback value if not found.

**Parameters:**
- `id` (string) - Element ID to retrieve
- `fallback` (any) - Value to return if element not found (default: null)

**Returns:**
- `HTMLElement` or fallback value

**Example:**

```javascript
// Always get a button element
const button = Id.get('submitBtn', document.createElement('button'));

// With custom fallback
const container = Id.get('container', document.body);
```

---

### Bulk Operations

#### `Id.update(updates)`

Update multiple elements at once.

**Parameters:**
- `updates` (Object) - Object where keys are element IDs and values are update configurations

**Returns:**
- Object with success/failure status for each ID

**Example:**

```javascript
Id.update({
  header: { 
    textContent: 'New Title', 
    style: { color: 'red' } 
  },
  footer: { 
    textContent: 'Copyright 2024' 
  },
  sidebar: { 
    classList: { add: 'active' } 
  }
});
```

---

### Property & Attribute Methods

#### `Id.setProperty(id, property, value)`

Set a property on an element.

**Example:**

```javascript
Id.setProperty('myInput', 'value', 'Hello World');
Id.setProperty('myDiv', 'textContent', 'Updated text');
```

---

#### `Id.getProperty(id, property, fallback)`

Get a property from an element with optional fallback.

**Example:**

```javascript
const value = Id.getProperty('myInput', 'value', '');
const text = Id.getProperty('myDiv', 'textContent', 'default');
```

---

#### `Id.setAttribute(id, attribute, value)`

Set an HTML attribute on an element.

**Example:**

```javascript
Id.setAttribute('myImage', 'src', 'image.png');
Id.setAttribute('myLink', 'href', 'https://example.com');
```

---

#### `Id.getAttribute(id, attribute, fallback)`

Get an HTML attribute from an element with optional fallback.

**Example:**

```javascript
const src = Id.getAttribute('myImage', 'src', 'default.png');
const href = Id.getAttribute('myLink', 'href', '#');
```

---

## Performance & Caching

### Cache Management

#### `Id.stats()`

Get caching statistics from the underlying Elements helper.

**Returns:**
- Object with cache performance metrics

**Example:**

```javascript
const stats = Id.stats();
console.log('Cache hit rate:', stats.hitRate);
console.log('Total lookups:', stats.totalLookups);
```

---

#### `Id.isCached(id)`

Check if an element is currently in the cache.

**Example:**

```javascript
if (Id.isCached('myButton')) {
  console.log('Element is in cache - fast access!');
}
```

---

#### `Id.clearCache()`

Clear the Elements cache (useful after major DOM changes).

**Example:**

```javascript
// After removing many elements
Id.clearCache();
```

---

## Integration & Access

### Direct Elements Helper Access

```javascript
// Access underlying Elements helper
Id.Elements.someMethod();

// Both are equivalent:
const btn1 = Id('myButton');
const btn2 = Elements.myButton;
```

### DOMHelpers Integration

If the DOMHelpers namespace exists, Id is automatically added:

```javascript
DOMHelpers.Id('myElement');
```

---

## Error Handling & Validation

### Input Validation

The module automatically handles:

- **Type checking** - Warns if non-string ID provided
- **Whitespace trimming** - Removes leading/trailing spaces
- **Empty string detection** - Warns if empty ID provided

**Example Console Warnings:**

```
[Id] Invalid ID type. Expected string, got: number
[Id] Empty ID string provided
```

### Null Safety

All methods return `null` or appropriate fallback values for missing elements:

```javascript
// Safe chaining
const element = Id('mightNotExist');
if (element) {
  element.classList.add('active'); // Only runs if element exists
}
```

---

## Best Practices

### 1. Use Appropriate Method for Context

```javascript
// For optional elements
const sidebar = Id('sidebar');
if (sidebar) { /* use it */ }

// For required elements
const { header, footer } = Id.required('header', 'footer');

// For dynamic content
const modal = await Id.waitFor('modal');
```

### 2. Leverage Bulk Operations

```javascript
// Instead of:
Id('header').update({ textContent: 'Title' });
Id('footer').update({ textContent: 'Footer' });

// Use:
Id.update({
  header: { textContent: 'Title' },
  footer: { textContent: 'Footer' }
});
```

### 3. Use Destructuring for Multiple Elements

```javascript
const { btn1, btn2, btn3 } = Id.multiple('btn1', 'btn2', 'btn3');
```

### 4. Cache Awareness

```javascript
// Check cache status for performance-critical code
if (!Id.isCached('heavyElement')) {
  // First access - might be slower
}
```

---

## Browser Compatibility

- Modern browsers (ES6+)
- IE11+ (with polyfills for `async/await` if using `waitFor`)
- Node.js (for testing/SSR scenarios)

---

## Performance Considerations

1. **Caching:** All element lookups are cached by the underlying Elements helper
2. **Minimal Overhead:** Direct wrapper with negligible performance impact
3. **Bulk Operations:** Use `Id.update()` for better performance when updating multiple elements
4. **Dynamic Content:** Use `Id.waitFor()` instead of polling loops

---

## Common Use Cases

### Form Handling

```javascript
const { username, password, submitBtn } = Id.required('username', 'password', 'submitBtn');

submitBtn.addEventListener('click', () => {
  const user = Id.getProperty('username', 'value');
  const pass = Id.getProperty('password', 'value');
  // Process form...
});
```

### Dynamic Content Loading

```javascript
async function loadWidget() {
  try {
    const widget = await Id.waitFor('dynamicWidget', 10000);
    widget.classList.add('loaded');
  } catch (error) {
    console.error('Widget failed to load');
  }
}
```

### Theme Switching

```javascript
Id.update({
  navbar: { style: { backgroundColor: 'dark' } },
  sidebar: { classList: { add: 'dark-theme' } },
  footer: { style: { color: 'white' } }
});
```

---

## Debugging

### Development Mode

In development environments (localhost or NODE_ENV=development), the module logs initialization:

```
[Id Shortcut] Module loaded successfully. Usage: Id("elementId")
```

### Statistics Monitoring

```javascript
// Monitor cache performance
setInterval(() => {
  const stats = Id.stats();
  console.log('Cache efficiency:', stats);
}, 10000);
```

---

## Migration Guide

### From `document.getElementById()`

```javascript
// Old way
const button = document.getElementById('myButton');

// New way
const button = Id('myButton');
```

### From Elements Helper

```javascript
// Old way
const button = Elements.myButton;

// New way (more explicit)
const button = Id('myButton');
```

---

## Summary

The Id Shortcut Module provides a modern, developer-friendly API for DOM element access with:

- ✅ Clean, intuitive syntax
- ✅ Automatic caching and performance optimization
- ✅ Comprehensive error handling
- ✅ Async support for dynamic content
- ✅ Bulk operations for efficiency
- ✅ Full backward compatibility with Elements helper

Perfect for projects requiring frequent DOM manipulation with optimal performance and code readability.