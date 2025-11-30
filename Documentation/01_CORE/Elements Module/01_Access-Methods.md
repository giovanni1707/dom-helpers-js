# Elements Module - Access Methods

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Part 1 of 4**: Access Methods for the Elements Helper
> Get DOM elements by ID with intelligent caching and automatic enhancement

---

## Table of Contents

1. [Overview](#overview)
2. [Elements.{id} - Proxy Access](#elementsid---proxy-access)
3. [Elements.get() - Safe Access with Fallback](#elementsget---safe-access-with-fallback)
4. [Elements.exists() - Check Element Existence](#elementsexists---check-element-existence)
5. [Elements.isCached() - Check Cache Status](#elementsiscached---check-cache-status)
6. [Elements.getMultiple() - Fetch Multiple Elements](#elementsgetmultiple---fetch-multiple-elements)
7. [Elements.destructure() - Object Destructuring](#elementsdestructure---object-destructuring)
8. [Elements.getRequired() - Required Elements with Validation](#elementsgetrequired---required-elements-with-validation)
9. [Elements.waitFor() - Async Element Loading](#elementswaitfor---async-element-loading)
10. [Quick Reference Table](#quick-reference-table)

---

## Overview

The **Elements Helper** provides 8 different ways to access DOM elements by their `id` attribute. All methods:

✅ **Use intelligent caching** - Elements are cached after first access for better performance
✅ **Auto-enhance elements** - All returned elements get the `.update()` method
✅ **Handle missing elements** - Various strategies from silent fallback to fail-fast errors
✅ **Support multiple elements** - Fetch single or multiple elements in one call

---

## `Elements.{id}` - Proxy Access

### What it does

The **simplest and most elegant way** to access elements by ID using JavaScript property syntax.

```javascript
const header = Elements.header;
const submitBtn = Elements.submitBtn;
```

This is equivalent to:
```javascript
const header = document.getElementById('header');
const submitBtn = document.getElementById('submitBtn');
```

---

### How it works

Elements uses a **JavaScript Proxy** to intercept property access:

```javascript
Elements.myButton  →  document.getElementById('myButton')
```

1. You access `Elements.myButton`
2. The proxy checks the cache
3. If cached and still in DOM, returns cached element
4. Otherwise, calls `document.getElementById('myButton')`
5. Caches the result for future access
6. Returns enhanced element with `.update()` method

---

### When to use

✅ **Quick element access** - Cleanest syntax for single elements
✅ **When IDs match JavaScript naming** - IDs like `header`, `navBar`, `submitBtn`
✅ **Interactive development** - Fast prototyping and testing

⚠️ **Avoid for:**
- IDs with hyphens (`Elements.my-button` won't work)
- IDs starting with numbers (`Elements.404page` is invalid)
- Dynamic/computed IDs (use `Elements.get()` instead)

---

### Example: Before vs After

**Before (Plain JavaScript):**
```javascript
const header = document.getElementById('header');
const footer = document.getElementById('footer');
const sidebar = document.getElementById('sidebar');

if (header) {
  header.textContent = 'Welcome!';
  header.style.color = 'blue';
}
```

**After (DOM Helpers):**
```javascript
const header = Elements.header;
const footer = Elements.footer;
const sidebar = Elements.sidebar;

header.update({
  textContent: 'Welcome!',
  style: { color: 'blue' }
});
```

---

### Edge cases

```javascript
// Returns null if element doesn't exist (no error)
const missing = Elements.nonExistent;  // null

// Safe chaining with optional chaining operator
Elements.header?.update({ textContent: 'Hello' });

// Check before use
if (Elements.header) {
  Elements.header.update({ ... });
}
```

---

## `Elements.get()` - Safe Access with Fallback

### What it does

**Safely access an element with a fallback value** if the element doesn't exist.

```javascript
Elements.get(id, fallback = null)
```

**Parameters:**
- `id` (string) - The element ID to find
- `fallback` (any, optional) - Value to return if element not found (default: `null`)

**Returns:** Element if found, otherwise the fallback value

---

### Why it's useful

Unlike proxy access, `Elements.get()` allows you to:

1. **Provide custom fallbacks** - Return a default element, placeholder, or any value
2. **Use dynamic IDs** - IDs from variables or computed at runtime
3. **Handle missing elements gracefully** - No null checks needed

---

### Examples

#### Basic usage
```javascript
// Returns element or null
const header = Elements.get('header');

// Custom fallback
const header = Elements.get('header', document.body);
```

#### Dynamic IDs
```javascript
const userId = 'user-123';
const userElement = Elements.get(userId);

// With template strings
const element = Elements.get(`item-${index}`);
```

#### Fallback strategies
```javascript
// Fallback to another element
const main = Elements.get('mainContent', Elements.get('defaultContent'));

// Fallback to creating an element
const container = Elements.get('container', document.createElement('div'));

// Fallback to a boolean flag
const exists = Elements.get('header', false) !== false;
```

---

### Use cases

| Scenario | Code Example |
|----------|-------------|
| **Optional UI elements** | `const tooltip = Elements.get('tooltip', null);` |
| **Dynamic component IDs** | `const card = Elements.get(\`card-${id}\`);` |
| **Fallback chains** | `const el = Elements.get('primary', Elements.get('secondary'));` |
| **Feature detection** | `if (Elements.get('advancedPanel')) { ... }` |

---

## `Elements.exists()` - Check Element Existence

### What it does

**Check if an element exists in the DOM** without retrieving it.

```javascript
Elements.exists(id)
```

**Parameters:**
- `id` (string) - The element ID to check

**Returns:** `true` if element exists, `false` otherwise

---

### Why use this instead of `Elements.get()`?

```javascript
// Both work, but exists() is more semantic:
if (Elements.exists('header')) { ... }      // ✅ Clear intent
if (Elements.get('header')) { ... }         // ✅ Works but less clear
if (Elements.header) { ... }                 // ✅ Also works
```

**Use `Elements.exists()` when:**
- You're checking existence without immediately using the element
- The code reads better with an explicit "exists" check
- You want to avoid retrieving/caching an element you might not use

---

### Examples

#### Conditional logic
```javascript
if (Elements.exists('sidebar')) {
  // Initialize sidebar features
  initializeSidebar();
}

// Guard clause pattern
if (!Elements.exists('requiredPanel')) {
  console.error('Required panel missing');
  return;
}
```

#### Feature detection
```javascript
const features = {
  hasNavbar: Elements.exists('navbar'),
  hasSidebar: Elements.exists('sidebar'),
  hasFooter: Elements.exists('footer')
};

if (features.hasNavbar && features.hasSidebar) {
  enableAdvancedLayout();
}
```

#### Pre-validation
```javascript
// Check before expensive operations
const requiredElements = ['header', 'main', 'footer'];
const allExist = requiredElements.every(id => Elements.exists(id));

if (!allExist) {
  console.error('Missing critical page elements');
}
```

---

## `Elements.isCached()` - Check Cache Status

### What it does

**Check if an element is currently stored in the cache** (without fetching it if not cached).

```javascript
Elements.isCached(id)
```

**Parameters:**
- `id` (string) - The element ID to check

**Returns:** `true` if element is in cache, `false` otherwise

---

### Understanding the cache

The Elements Helper caches elements after first access to improve performance:

```javascript
// First access - queries DOM, then caches
const header = Elements.header;
console.log(Elements.isCached('header'));  // true

// Second access - uses cache (fast!)
const sameHeader = Elements.header;
```

**Cache invalidation** happens automatically when:
- Elements are removed from the DOM (via MutationObserver)
- You manually call `Elements.clear()`
- Cache reaches max size (LRU eviction)

---

### When to use

**Performance optimization:**
```javascript
// Pre-cache frequently used elements
if (!Elements.isCached('header')) {
  Elements.header;  // Cache it
}

// Later accesses are instant
Elements.header.update({ ... });
```

**Debugging:**
```javascript
// Check cache state
console.log('Cached elements:',
  ['header', 'footer', 'sidebar'].filter(id => Elements.isCached(id))
);
```

**Testing:**
```javascript
// Verify caching behavior
Elements.clear();
console.log(Elements.isCached('header'));  // false
Elements.header;
console.log(Elements.isCached('header'));  // true
```

---

## `Elements.getMultiple()` - Fetch Multiple Elements

### What it does

**Fetch multiple elements at once** and return them as an array.

```javascript
Elements.getMultiple(...ids)
```

**Parameters:**
- `...ids` (strings) - One or more element IDs

**Returns:** Array of elements (nulls for missing elements)

---

### Why use this?

Instead of:
```javascript
const header = Elements.header;
const footer = Elements.footer;
const sidebar = Elements.sidebar;
```

Do this:
```javascript
const [header, footer, sidebar] = Elements.getMultiple('header', 'footer', 'sidebar');
```

---

### Examples

#### Array destructuring
```javascript
const [form, input, button] = Elements.getMultiple('loginForm', 'username', 'submitBtn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(input.value);
});
```

#### Iterate over elements
```javascript
const navItems = Elements.getMultiple('nav1', 'nav2', 'nav3', 'nav4');

navItems.forEach((item, index) => {
  if (item) {
    item.update({
      textContent: `Item ${index + 1}`,
      dataset: { index }
    });
  }
});
```

#### Filter valid elements
```javascript
const elements = Elements.getMultiple('panel1', 'panel2', 'panel3');
const validPanels = elements.filter(el => el !== null);

console.log(`Found ${validPanels.length} panels`);
```

#### Bulk operations
```javascript
const [header, main, footer] = Elements.getMultiple('header', 'main', 'footer');

// Update all at once
[header, main, footer].forEach(el => {
  el?.update({ classList: { add: ['loaded'] } });
});
```

---

### Comparison with other methods

| Method | Returns | Missing Elements | Use Case |
|--------|---------|------------------|----------|
| `getMultiple()` | Array | `null` values | When you need array methods |
| `destructure()` | Object | `null` values | When you want named access |
| `getRequired()` | Object | Throws error | When all must exist |

---

## `Elements.destructure()` - Object Destructuring

### What it does

**Fetch multiple elements and return them as an object** for clean destructuring.

```javascript
Elements.destructure(...ids)
```

**Parameters:**
- `...ids` (strings) - One or more element IDs

**Returns:** Object with IDs as keys, elements as values

---

### The power of destructuring

```javascript
// Clean, readable, one-line access
const { header, footer, sidebar } = Elements.destructure('header', 'footer', 'sidebar');

// Now use them directly
header.update({ textContent: 'Welcome!' });
footer.update({ classList: { add: ['visible'] } });
```

This is the **preferred method for accessing multiple elements** when you know their IDs.

---

### Examples

#### Component initialization
```javascript
function initializeApp() {
  const { header, nav, main, sidebar, footer } = Elements.destructure(
    'header', 'nav', 'main', 'sidebar', 'footer'
  );

  header.update({ textContent: 'My App' });
  nav.update({ classList: { add: ['active'] } });
  // ... etc
}
```

#### Form handling
```javascript
const { loginForm, emailInput, passwordInput, submitBtn, errorMsg } =
  Elements.destructure('loginForm', 'emailInput', 'passwordInput', 'submitBtn', 'errorMsg');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    errorMsg.update({
      textContent: 'All fields required',
      style: { display: 'block' }
    });
  }
});
```

#### Partial destructuring
```javascript
// Get some elements, ignore others
const { header, footer } = Elements.destructure('header', 'nav', 'main', 'footer');
// 'nav' and 'main' are fetched but not assigned

// Or be explicit
const result = Elements.destructure('header', 'nav', 'main', 'footer');
const header = result.header;
const footer = result.footer;
```

---

### Handling missing elements

```javascript
const { header, footer, sidebar } = Elements.destructure('header', 'footer', 'sidebar');

// Check what exists
if (header) header.update({ ... });
if (footer) footer.update({ ... });
if (sidebar) sidebar.update({ ... });

// Or use optional chaining
header?.update({ ... });
footer?.update({ ... });
```

---

## `Elements.getRequired()` - Required Elements with Validation

### What it does

**Fetch multiple elements with a guarantee they all exist**, throwing an error if any are missing.

```javascript
Elements.getRequired(...ids)
```

**Parameters:**
- `...ids` (strings) - One or more element IDs (all required)

**Returns:** Object with IDs as keys, elements as values

**Throws:** Error if any element is missing

---

### Why it's powerful

#### 1. Fail-fast safety

In plain JavaScript:
```javascript
const header = document.getElementById('header');
header.textContent = 'Welcome!';
// Error: Cannot set property 'textContent' of null
```

With `getRequired`:
```javascript
const { header, footer } = Elements.getRequired('header', 'footer');
// If any element is missing, this line throws immediately
header.update({ textContent: 'Welcome!' });
// This line only runs if both elements exist
```

---

#### 2. Multiple elements in one call

Instead of:
```javascript
const header = document.getElementById('header');
const footer = document.getElementById('footer');
const sidebar = document.getElementById('sidebar');

if (!header || !footer || !sidebar) {
  throw new Error('Required elements missing');
}
```

Do this:
```javascript
const { header, footer, sidebar } = Elements.getRequired('header', 'footer', 'sidebar');
// All three guaranteed to exist beyond this point
```

---

#### 3. Enhanced elements ready to use

```javascript
const { header, footer } = Elements.getRequired('header', 'footer');

// Immediately use .update() without checks
header.update({ textContent: 'Welcome!' });
footer.update({
  classList: { add: ['loaded'] },
  textContent: 'Footer loaded'
});
```

---

### Examples

#### Critical component initialization
```javascript
function initializeDashboard() {
  try {
    const { header, sidebar, mainPanel, footer } = Elements.getRequired(
      'header', 'sidebar', 'mainPanel', 'footer'
    );

    // Safe to use all elements
    header.update({ textContent: 'Dashboard' });
    sidebar.update({ classList: { add: ['visible'] } });
    mainPanel.update({ innerHTML: loadContent() });
    footer.update({ textContent: '© 2024' });

  } catch (error) {
    console.error('Dashboard initialization failed:', error.message);
    // Show user-friendly error
    document.body.innerHTML = '<h1>Page structure error. Please refresh.</h1>';
  }
}
```

#### Form validation setup
```javascript
function setupLoginForm() {
  const { loginForm, emailInput, passwordInput, submitBtn } = Elements.getRequired(
    'loginForm', 'emailInput', 'passwordInput', 'submitBtn'
  );

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // All form elements guaranteed to exist
    const credentials = {
      email: emailInput.value,
      password: passwordInput.value
    };
    submitLogin(credentials);
  });
}
```

#### Feature gates
```javascript
// Enable advanced features only if all required elements exist
try {
  const { chart, controls, dataTable } = Elements.getRequired(
    'chart', 'controls', 'dataTable'
  );

  enableAdvancedAnalytics(chart, controls, dataTable);
} catch (error) {
  // Gracefully degrade to basic version
  console.warn('Advanced features unavailable:', error.message);
  enableBasicMode();
}
```

---

### Error messages

```javascript
Elements.getRequired('header', 'missing1', 'footer', 'missing2');
// Error: Required elements not found: missing1, missing2
```

The error message **lists all missing elements**, making debugging easier.

---

### When to use `getRequired`

✅ **Critical UI components** - Elements your app cannot function without
✅ **Component initialization** - When multiple elements must exist together
✅ **Fail-fast architecture** - Prefer early errors over runtime bugs
✅ **Clean code** - Avoid nested if-checks for element existence

⚠️ **Don't use for:**
- Optional elements (use `get()` or `destructure()`)
- Elements that load dynamically (use `waitFor()`)
- When graceful degradation is needed

---

## `Elements.waitFor()` - Async Element Loading

### What it does

**Asynchronously wait for elements to appear in the DOM**, useful for dynamically loaded content.

```javascript
await Elements.waitFor(...ids)
```

**Parameters:**
- `...ids` (strings) - One or more element IDs to wait for
- Options (implicit):
  - `timeout`: 5000ms default
  - `interval`: 50ms check interval

**Returns:** Promise that resolves to an object with elements (like `destructure`)

**Rejects:** If timeout is reached before all elements exist

---

### Why you need this

Modern web apps often load content dynamically:
- AJAX/fetch responses
- Single Page Applications (SPAs)
- Lazy-loaded components
- Content rendered by frameworks

Traditional access fails because elements don't exist yet:
```javascript
const popup = Elements.popup;  // null - not loaded yet
```

`waitFor()` solves this:
```javascript
const { popup } = await Elements.waitFor('popup');
// Waits until popup exists, then returns it
```

---

### Examples

#### Wait for dynamically loaded content
```javascript
async function showUserProfile(userId) {
  // Trigger content load
  loadUserProfile(userId);

  // Wait for profile elements to appear
  const { profileCard, avatar, userName } = await Elements.waitFor(
    'profileCard', 'avatar', 'userName'
  );

  // Safe to use - elements now exist
  avatar.update({ setAttribute: { src: user.avatarUrl } });
  userName.update({ textContent: user.name });
}
```

#### SPA route transitions
```javascript
async function navigateToDashboard() {
  router.navigate('/dashboard');

  // Wait for new page elements
  try {
    const { dashboardMain, statsPanel } = await Elements.waitFor(
      'dashboardMain', 'statsPanel'
    );

    initializeDashboard(dashboardMain, statsPanel);
  } catch (error) {
    console.error('Dashboard load timeout:', error);
    showErrorPage();
  }
}
```

#### Modal/popup handling
```javascript
async function openModal(modalId) {
  triggerModal(modalId);

  const { modalOverlay, modalContent, closeBtn } = await Elements.waitFor(
    'modalOverlay', 'modalContent', 'closeBtn'
  );

  // Elements guaranteed to exist
  closeBtn.addEventListener('click', () => closeModal());
  modalContent.update({ classList: { add: ['fade-in'] } });
}
```

#### Lazy-loaded components
```javascript
// Wait for component to be injected by framework
async function initializeWidget() {
  const { widget, widgetControls } = await Elements.waitFor(
    'widget', 'widgetControls'
  );

  widget.update({ dataset: { initialized: 'true' } });
  bindWidgetEvents(widgetControls);
}
```

---

### Timeout handling

```javascript
// Custom timeout configuration
Elements.configure({ waitForTimeout: 10000 });  // 10 seconds

try {
  const { slowElement } = await Elements.waitFor('slowElement');
} catch (error) {
  console.error('Element never appeared:', error);
  // Fallback logic
}
```

---

### Combining with other methods

```javascript
// Wait for required elements
const { header } = await Elements.waitFor('header');

// Then get optional elements
const sidebar = Elements.get('sidebar', null);

// Initialize with what's available
initializePage(header, sidebar);
```

---

### When to use `waitFor`

✅ **Dynamic content** - AJAX, fetch, or framework-rendered elements
✅ **SPAs** - Route transitions with new DOM content
✅ **Lazy loading** - Components loaded on-demand
✅ **Third-party scripts** - Widgets injected by external code

⚠️ **Avoid for:**
- Static page elements (use `getRequired()`)
- Immediately available elements (use `get()` or proxy)
- When you can use framework lifecycle hooks instead

---

## Quick Reference Table

| Method | Syntax | Returns | Missing Element | Use Case |
|--------|--------|---------|-----------------|----------|
| **Proxy** | `Elements.header` | Element or null | Returns null | Quick single access |
| **get** | `Elements.get('id', fallback)` | Element or fallback | Returns fallback | Dynamic IDs, custom fallback |
| **exists** | `Elements.exists('id')` | Boolean | Returns false | Check existence |
| **isCached** | `Elements.isCached('id')` | Boolean | Returns false | Cache inspection |
| **getMultiple** | `Elements.getMultiple(...ids)` | Array | null in array | Array operations |
| **destructure** | `Elements.destructure(...ids)` | Object | null in object | Clean named access |
| **getRequired** | `Elements.getRequired(...ids)` | Object | Throws error | Critical elements |
| **waitFor** | `await Elements.waitFor(...ids)` | Promise→Object | Rejects on timeout | Dynamic content |

---

## Best Practices

### 1. Choose the right method for the job

```javascript
// Static, critical elements
const { header, footer } = Elements.getRequired('header', 'footer');

// Optional elements
const tooltip = Elements.get('tooltip', null);

// Dynamic IDs
const item = Elements.get(`item-${id}`);

// Lazy-loaded content
const { modal } = await Elements.waitFor('modal');
```

### 2. Use destructuring for multiple elements

```javascript
// ❌ Repetitive
const header = Elements.header;
const footer = Elements.footer;
const sidebar = Elements.sidebar;

// ✅ Clean
const { header, footer, sidebar } = Elements.destructure('header', 'footer', 'sidebar');
```

### 3. Validate critical elements early

```javascript
// Component initialization
function initApp() {
  // Fail fast if critical elements missing
  const { main, nav } = Elements.getRequired('main', 'nav');

  // Optional features
  if (Elements.exists('advancedPanel')) {
    initAdvancedFeatures();
  }
}
```

### 4. Handle async elements properly

```javascript
async function loadContent() {
  try {
    const { content } = await Elements.waitFor('content');
    content.update({ innerHTML: data });
  } catch (error) {
    console.error('Content load failed:', error);
    showFallbackUI();
  }
}
```

---

## Next Steps

Continue to the other Elements documentation:

- **[Property Methods](02_Property-Methods.md)** - `setProperty`, `getProperty`, `setAttribute`, `getAttribute`
- **[Bulk Operations](03_Bulk-Operations.md)** - `Elements.update()` for multiple elements
- **[Utility Methods](04_Utility-Methods.md)** - `stats()`, `clear()`, `destroy()`, `configure()`

---

**[Back to Documentation Home](../../README.md)**
