# Selector Module - Complete Documentation

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Complete, beginner-friendly documentation for the Selector Helper**
> Learn how to query DOM elements using CSS selectors with intelligent caching

---

## 📚 Documentation Structure

The Selector module documentation is organized into **three comprehensive guides**:

### 1. **[Query Methods](01_Query-Methods.md)** 🎯
*Basic querySelector and querySelectorAll wrappers*

Learn the core query methods:
- `Selector.query()` - Find first element (querySelector wrapper)
- `Selector.queryAll()` - Find all elements (querySelectorAll wrapper)
- Enhanced syntax with property access
- Understanding CSS selectors
- Common selector patterns

**[Read Query Methods →](01_Query-Methods.md)**

---

### 2. **[Scoped Queries & Bulk Operations](02_Scoped-Bulk-Operations.md)** 📦
*Query within containers and bulk updates*

Master scoped queries and bulk operations:
- `Selector.Scoped.within()` - Query within container (single)
- `Selector.Scoped.withinAll()` - Query within container (multiple)
- `Selector.update()` - Update multiple selectors at once
- Component isolation patterns
- Performance benefits

**[Read Scoped Queries & Bulk Operations →](02_Scoped-Bulk-Operations.md)**

---

### 3. **[Additional Methods](03_Additional-Methods.md)** 🛠️
*Array methods, filtering, async, and utilities*

Complete reference for all additional methods:
- **Array-like methods** - `.forEach()`, `.map()`, `.filter()`, etc.
- **DOM manipulation** - `.addClass()`, `.setStyle()`, `.on()`, etc.
- **Filtering** - `.visible()`, `.hidden()`, `.enabled()`, `.disabled()`
- **Async methods** - `waitFor()`, `waitForAll()`
- **Utility methods** - `stats()`, `clear()`, `configure()`

**[Read Additional Methods →](03_Additional-Methods.md)**

---

## 🚀 Quick Start

### Basic Queries

```javascript
// Find first element
const button = Selector.query('.button');

// Find all elements
const buttons = Selector.queryAll('.button');

// Enhanced syntax (simple selectors)
const header = Selector.query.header;
const cards = Selector.queryAll.card;
```

### CSS Selectors

```javascript
// By class
Selector.query('.button');

// By ID
Selector.query('#header');

// By attribute
Selector.query('[type="email"]');

// Combined
Selector.query('.button.primary');

// Descendant
Selector.query('.card .title');

// Pseudo-class
Selector.query('li:first-child');
```

### Scoped Queries

```javascript
// Query within container
const modalButton = Selector.Scoped.within('#modal', '.button');

// Query all within container
const modalInputs = Selector.Scoped.withinAll('#modal', 'input');
```

### Bulk Updates

```javascript
// Update multiple selectors at once
Selector.update({
  '.button': {
    style: { padding: '10px' },
    classList: { add: ['btn'] }
  },
  '.card': {
    style: { borderRadius: '8px' }
  },
  'img': {
    setAttribute: { loading: 'lazy' }
  }
});
```

### Async Waiting

```javascript
// Wait for element to appear
const modal = await Selector.waitFor('#modal');

// Wait for multiple elements
const cards = await Selector.waitForAll('.card', 5);
```

---

## 📊 Method Overview

### Query Methods (2 core + 2 enhanced)

| Method | Purpose | Example | Returns |
|--------|---------|---------|---------|
| **query()** | Find first element | `Selector.query('.button')` | Element or null |
| **queryAll()** | Find all elements | `Selector.queryAll('.button')` | Enhanced NodeList |
| **query.{class}** | Enhanced syntax | `Selector.query.button` | Element or null |
| **queryAll.{class}** | Enhanced syntax | `Selector.queryAll.button` | Enhanced NodeList |

### Scoped Query Methods (2 methods)

| Method | Purpose | Example | Returns |
|--------|---------|---------|---------|
| **Scoped.within()** | Find first in container | `Selector.Scoped.within('#modal', '.btn')` | Element or null |
| **Scoped.withinAll()** | Find all in container | `Selector.Scoped.withinAll('#modal', '.btn')` | Enhanced NodeList |

### Bulk Operations (1 method)

| Method | Purpose | Example | Returns |
|--------|---------|---------|---------|
| **update()** | Update multiple selectors | `Selector.update({ '.btn': {...} })` | Selector |

### Array-like Methods (12 methods)

Same as Collections - see [Collections Array-like Methods](../Collections%20Module/03_Array-like-Methods.md):
- `forEach()`, `map()`, `filter()`, `find()`, `some()`, `every()`, `reduce()`, `toArray()`
- `first()`, `last()`, `at()`, `isEmpty()`

### DOM Manipulation Methods (8 methods)

Same as Collections - see [Collections DOM Manipulation](../Collections%20Module/04_DOM-Manipulation-and-Filtering.md):
- `addClass()`, `removeClass()`, `toggleClass()`
- `setProperty()`, `setAttribute()`, `setStyle()`
- `on()`, `off()`

### Filtering Methods (5 methods)

Same as Collections + `.within()`:
- `visible()`, `hidden()`, `enabled()`, `disabled()`, `within()`

### Async Methods (2 methods)

| Method | Purpose | Example |
|--------|---------|---------|
| **waitFor()** | Wait for element | `await Selector.waitFor('#modal')` |
| **waitForAll()** | Wait for multiple | `await Selector.waitForAll('.card', 5)` |

### Utility Methods (6 methods)

| Method | Purpose | Example |
|--------|---------|---------|
| **stats()** | Get statistics | `Selector.stats()` |
| **clear()** | Clear cache | `Selector.clear()` |
| **destroy()** | Cleanup | `Selector.destroy()` |
| **configure()** | Update config | `Selector.configure({ maxCacheSize: 2000 })` |
| **enableEnhancedSyntax()** | Enable features | `Selector.enableEnhancedSyntax()` |
| **disableEnhancedSyntax()** | Disable features | `Selector.disableEnhancedSyntax()` |

---

## 💡 Key Concepts

### CSS Selector Power

Use any valid CSS selector:

```javascript
// Simple
Selector.query('.button');
Selector.query('#header');

// Combined
Selector.query('.card.featured');
Selector.query('div.container');

// Descendant
Selector.query('.nav .menu-item');
Selector.query('#modal .close-button');

// Attribute
Selector.query('[type="email"]');
Selector.query('[href^="http"]');

// Pseudo-class
Selector.query('li:first-child');
Selector.query('button:not(:disabled)');
```

---

### Intelligent Caching

Selectors are cached for performance:

```javascript
Selector.query('.button');  // Queries DOM
Selector.query('.button');  // Returns from cache (fast!)

// Cache management
Selector.clear();  // Clear cache
Selector.stats();  // Check cache performance
```

---

### Enhanced Results

All query results are enhanced:

```javascript
const buttons = Selector.queryAll('.button');

// Array methods
buttons.forEach(btn => console.log(btn));
const texts = buttons.map(btn => btn.textContent);

// Utility methods
const firstBtn = buttons.first();

// DOM manipulation
buttons.addClass('styled');
buttons.on('click', handler);

// Filtering
const visibleBtns = buttons.visible();

// Update method
buttons.update({ style: { padding: '10px' } });
```

---

### Scoped Queries

Query within specific containers:

```javascript
// Global query
const button = Selector.query('.button'); // Searches entire document

// Scoped query
const modalButton = Selector.Scoped.within('#modal', '.button'); // Only in modal

// Benefits: performance, specificity, component isolation
```

---

## 🎯 Common Patterns

### Pattern 1: Find and Update
```javascript
const button = Selector.query('.submit-button');
button?.update({
  textContent: 'Processing...',
  disabled: true
});
```

---

### Pattern 2: Bulk Styling
```javascript
Selector.queryAll('.card').update({
  style: {
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
});
```

---

### Pattern 3: Event Handling
```javascript
Selector.queryAll('.menu-item').on('click', function() {
  Selector.queryAll('.menu-item').removeClass('active');
  this.classList.add('active');
});
```

---

### Pattern 4: Component Isolation
```javascript
function initModal(modalId) {
  const closeBtn = Selector.Scoped.within(modalId, '.close-button');
  const form = Selector.Scoped.within(modalId, 'form');
  const inputs = Selector.Scoped.withinAll(modalId, 'input');

  closeBtn?.addEventListener('click', () => closeModal());
  inputs.forEach(input => validateField(input));
}
```

---

### Pattern 5: Async Content Loading
```javascript
async function loadDashboard() {
  // Trigger content load
  fetchDashboardData();

  // Wait for widgets to appear
  const widgets = await Selector.waitForAll('.widget', 3);

  // Initialize widgets
  widgets.forEach(widget => initializeWidget(widget));
}
```

---

### Pattern 6: Filter and Update
```javascript
Selector.queryAll('.item')
  .visible()
  .enabled()
  .forEach(item => {
    item.addClass('active');
  });
```

---

## 🔍 When to Use What

### Use query() when:
✅ Finding a single element
✅ First match is what you need
✅ Working with unique selectors

```javascript
const header = Selector.query('#header');
const firstButton = Selector.query('.button');
```

---

### Use queryAll() when:
✅ Finding multiple elements
✅ Iterating over matches
✅ Bulk operations

```javascript
const allButtons = Selector.queryAll('.button');
allButtons.forEach(btn => initButton(btn));
```

---

### Use Scoped queries when:
✅ Working with components
✅ Avoiding selector conflicts
✅ Better performance needed

```javascript
const modalButton = Selector.Scoped.within('#modal', '.button');
```

---

### Use update() when:
✅ Initializing multiple selector types
✅ Theme switching
✅ Batch configuration

```javascript
Selector.update({
  '.button': { style: { padding: '10px' } },
  '.card': { style: { borderRadius: '8px' } }
});
```

---

### Use waitFor() when:
✅ Dynamic content loading
✅ SPA navigation
✅ Async rendering

```javascript
const element = await Selector.waitFor('.dynamic-content');
```

---

## 🎓 Learning Path

### Beginner (Start Here)
1. Read **[Query Methods](01_Query-Methods.md)** - Learn query() and queryAll()
2. Practice with basic CSS selectors
3. Try enhanced syntax

### Intermediate
1. Read **[Scoped Queries & Bulk Operations](02_Scoped-Bulk-Operations.md)**
2. Use scoped queries for components
3. Practice bulk updates

### Advanced
1. Read **[Additional Methods](03_Additional-Methods.md)**
2. Use async methods for dynamic content
3. Optimize with cache configuration

---

## 📖 Full Documentation

### Complete Guides

1. **[Query Methods](01_Query-Methods.md)** - query(), queryAll(), enhanced syntax
2. **[Scoped Queries & Bulk Operations](02_Scoped-Bulk-Operations.md)** - Scoped queries, bulk updates
3. **[Additional Methods](03_Additional-Methods.md)** - Array, DOM, filtering, async, utilities

---

## 🌟 Why Use Selector Helper?

### Before (Plain JavaScript)
```javascript
const buttons = document.querySelectorAll('.button');

buttons.forEach(button => {
  button.style.padding = '10px';
  button.style.backgroundColor = 'blue';
  button.classList.add('styled');

  button.addEventListener('click', function() {
    console.log('Clicked');
  });
});
```

### After (DOM Helpers)
```javascript
Selector.queryAll('.button')
  .setStyle({ padding: '10px', backgroundColor: 'blue' })
  .addClass('styled')
  .on('click', () => console.log('Clicked'));
```

**Benefits:**
✅ 60% less code
✅ Chainable methods
✅ Intelligent caching
✅ Enhanced results
✅ Consistent API

---

## 📝 Next Steps

1. **Start with basics**: Read [Query Methods](01_Query-Methods.md)
2. **Practice selectors**: Try different CSS selector patterns
3. **Learn scoping**: Study [Scoped Queries](02_Scoped-Bulk-Operations.md)
4. **Master async**: Use [waitFor methods](03_Additional-Methods.md)

---

## 🔗 Links

- **[Documentation Home](../../README.md)**
- **[Core Methods List](../Core%20Methods%20List.md)**
- **[Elements Module](../Elements%20Module/README.md)**
- **[Collections Module](../Collections%20Module/README.md)**

---

**[Back to Documentation Home](../../README.md)**

---

*Made with ❤️ for developers who love clean, efficient code*
