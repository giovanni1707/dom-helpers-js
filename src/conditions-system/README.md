# DOM Helpers - Conditions System

**Version:** 2.3.1
**License:** MIT

Declarative conditional rendering system with automatic reactivity, 15+ condition matchers, and collection-aware updates.

---

## Quick Start

```html
<script src="conditions-core.js"></script>
<script src="conditions.js"></script>

<script>
  const state = { status: 'active' };

  Conditions.whenState(
    () => state.status,
    {
      'active': { className: 'active', style: { color: 'green' } },
      'pending': { className: 'pending', style: { color: 'orange' } },
      'error': { className: 'error', style: { color: 'red' } }
    },
    '#status'
  );
</script>
```

---

## Features

✅ **15+ Condition Matchers** - Boolean, string, regex, numeric comparisons
✅ **10+ Property Handlers** - Style, classList, attributes, events, dataset
✅ **Collection-Aware** - Index-specific + bulk updates
✅ **Default Branch** - Fallback for unmatched conditions
✅ **Reactive Support** - Auto-updates with reactive state
✅ **Extensible** - Register custom matchers and handlers
✅ **Global Shortcuts** - Convenient global functions
✅ **Zero Dependencies** - Works standalone

---

## Installation

### Option 1: Load All Features

```html
<script src="conditions-core.js"></script>
<script src="conditions-default.js"></script>
<script src="conditions-collections.js"></script>
<script src="conditions-shortcuts.js"></script>
<script src="conditions.js"></script>
```

### Option 2: Core Only

```html
<script src="conditions-core.js"></script>
```

### Option 3: ES6 Modules

```javascript
import Conditions from './conditions.js';
```

---

## Module Structure

```
src/conditions-system/
├── conditions-core.js          ~900 lines, ~30 KB  Core system
├── conditions-default.js       ~180 lines,  ~8 KB  Default branch
├── conditions-collections.js   ~250 lines, ~10 KB  Collections
├── conditions-shortcuts.js     ~500 lines, ~18 KB  Shortcuts
└── conditions.js               ~200 lines,  ~6 KB  Unified entry
```

---

## Core Features

### 1. Basic Conditional Rendering

```javascript
Conditions.whenState(
  () => user.role,
  {
    'admin': { textContent: 'Admin Dashboard', className: 'admin' },
    'user': { textContent: 'User Panel', className: 'user' },
    'guest': { textContent: 'Please Login', className: 'guest' }
  },
  '#dashboard'
);
```

### 2. Condition Matchers (15+)

**Boolean:**
```javascript
{
  'true': { ... },      // Strict true
  'false': { ... },     // Strict false
  'truthy': { ... },    // !!value
  'falsy': { ... }      // !value
}
```

**Null/Undefined/Empty:**
```javascript
{
  'null': { ... },
  'undefined': { ... },
  'empty': { ... }      // '', [], {}, null, undefined
}
```

**String Matching:**
```javascript
{
  '"exact"': { ... },           // Quoted string
  'includes:text': { ... },     // String contains
  'startsWith:prefix': { ... }, // String starts with
  'endsWith:suffix': { ... }    // String ends with
}
```

**Regex:**
```javascript
{
  '/^\\d{3}$/': { ... },        // Regex pattern
  '/error/i': { ... }           // Case-insensitive
}
```

**Numeric:**
```javascript
{
  '10-20': { ... },             // Range
  '>=18': { ... },              // Greater than or equal
  '<=100': { ... },             // Less than or equal
  '>0': { ... },                // Greater than
  '<50': { ... }                // Less than
}
```

### 3. Property Handlers (10+)

**Style:**
```javascript
{
  style: {
    color: 'red',
    fontSize: '16px',
    padding: '10px'
  }
}
```

**classList:**
```javascript
{
  classList: {
    add: ['active', 'highlighted'],
    remove: ['disabled'],
    toggle: ['visible']
  }
}

// Or replace all:
{ classList: ['new', 'classes'] }
```

**Attributes:**
```javascript
{
  attrs: {
    'data-status': 'active',
    'aria-label': 'Active Status',
    disabled: false  // Remove attribute
  }
}
```

**Events:**
```javascript
{
  addEventListener: {
    click: handleClick,
    hover: { handler: handleHover, options: { passive: true } }
  }
}

// Or inline:
{ onclick: handleClick }
```

**Dataset:**
```javascript
{
  dataset: {
    userId: '123',
    status: 'active'
  }
}
```

**Native Properties:**
```javascript
{
  textContent: 'Hello World',
  innerHTML: '<strong>Bold</strong>',
  value: '42',
  checked: true,
  disabled: false
}
```

### 4. Collection-Aware Updates

**Index-Specific + Bulk:**
```javascript
Conditions.apply('active', {
  'active': {
    0: { textContent: 'First Active', className: 'first' },
    -1: { textContent: 'Last Active', className: 'last' },
    style: { color: 'green' }  // Applied to ALL elements
  }
}, '.items');
```

### 5. Default Branch

```javascript
Conditions.whenState(
  () => state.status,
  {
    'active': { className: 'active' },
    'pending': { className: 'pending' },
    default: { className: 'unknown' }  // Matches anything else
  },
  '#status'
);
```

### 6. Reactive Mode

With reactive state library:

```javascript
const state = Reactive.state({ count: 0 });

// Auto-updates when state.count changes
Conditions.whenState(
  () => state.count,
  {
    '0': { textContent: 'Zero' },
    '1-10': { textContent: 'Low' },
    '>10': { textContent: 'High' }
  },
  '#counter'
);

state.count = 5;  // UI updates automatically
```

### 7. Static Mode

Without reactivity:

```javascript
// One-time application
Conditions.apply('active', conditions, '#element');

// Manual updates
const update = Conditions.whenState(value, conditions, '#element', { reactive: false });
update.update();  // Call when needed
```

---

## Collections

### Collection-Level Updates

```javascript
Conditions.whenStateCollection(
  () => state.size,
  {
    'small': {
      0: { textContent: 'First (small)' },
      style: { padding: '5px', fontSize: '12px' }
    },
    'large': {
      0: { textContent: 'First (large)' },
      -1: { textContent: 'Last (large)' },
      style: { padding: '20px', fontSize: '18px' }
    }
  },
  '.items'
);
```

---

## Extension Registration

### Custom Matchers

```javascript
Conditions.registerMatcher('weekday', {
  test: (condition) => condition === 'weekday',
  match: (value) => {
    const day = new Date(value).getDay();
    return day >= 1 && day <= 5;
  }
});

// Usage:
Conditions.whenState(
  () => new Date(),
  {
    'weekday': { textContent: 'Workday' },
    default: { textContent: 'Weekend' }
  },
  '#day-type'
);
```

### Custom Handlers

```javascript
Conditions.registerHandler('animate', {
  test: (key, val) => key === 'animate' && typeof val === 'object',
  apply: (element, val) => {
    element.animate(val.keyframes, val.options);
  }
});

// Usage:
Conditions.apply('active', {
  'active': {
    animate: {
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
      options: { duration: 300 }
    }
  }
}, '#element');
```

---

## Global Shortcuts

When `conditions-shortcuts.js` is loaded:

```javascript
// Instead of:
Conditions.whenState(value, conditions, selector);

// Use:
whenState(value, conditions, selector);
whenApply(value, conditions, selector);
whenWatch(value, conditions, selector);
whenBatch(() => { ... });

// Extension registration:
registerMatcher('myMatcher', { ... });
registerHandler('myHandler', { ... });
registerMatchers({ ... });  // Batch
registerHandlers({ ... });  // Batch

// Utilities:
getMatchers();              // List all matchers
getHandlers();              // List all handlers
hasMatcher('weekday');      // Check if registered
hasHandler('animate');      // Check if registered
printExtensions();          // Print to console
```

---

## API Reference

### Conditions.whenState()

Reactive conditional rendering with automatic updates.

```javascript
Conditions.whenState(
  valueFn,      // Function returning value or direct value
  conditions,   // Object or function returning conditions
  selector,     // String, Element, NodeList, or Array
  options       // { reactive: boolean } (default: true if available)
)
```

### Conditions.apply()

One-time static application without reactivity.

```javascript
Conditions.apply(
  value,        // Current value to match
  conditions,   // Condition mappings
  selector      // Target elements
)
```

### Conditions.watch()

Explicit reactive watching (requires reactive library).

```javascript
Conditions.watch(
  valueFn,      // Function returning value
  conditions,   // Condition mappings
  selector      // Target elements
)
```

### Conditions.batch()

Batch multiple condition updates.

```javascript
Conditions.batch(() => {
  Conditions.apply(value1, conditions1, selector1);
  Conditions.apply(value2, conditions2, selector2);
});
```

### Conditions.registerMatcher()

Register custom condition matcher.

```javascript
Conditions.registerMatcher(name, {
  test: (condition, value?) => boolean,
  match: (value, condition) => boolean
});
```

### Conditions.registerHandler()

Register custom property handler.

```javascript
Conditions.registerHandler(name, {
  test: (key, val, element?) => boolean,
  apply: (element, val, key) => void
});
```

---

## Advanced Usage

### Dynamic Conditions

```javascript
Conditions.whenState(
  () => state.value,
  () => ({  // Function returning conditions
    [state.threshold]: { ... },  // Dynamic key
    default: { ... }
  }),
  selector
);
```

### Nested Properties

```javascript
Conditions.whenState(
  () => state.user.profile.status,
  conditions,
  selector
);
```

### Multiple Elements

```javascript
// Works with collections
Conditions.apply('active', conditions, '.items');
Conditions.apply('active', conditions, document.querySelectorAll('.items'));
Conditions.apply('active', conditions, [el1, el2, el3]);
```

---

## Bundle Size Optimization

**Core Only:** ~30 KB (conditions-core.js)
**Core + Default:** ~38 KB (+default branch)
**Core + Collections:** ~40 KB (+collections)
**Full System:** ~72 KB (all features)

**Savings:** Up to 58% by loading only core

---

## Browser Support

- Modern browsers (ES6+)
- IE11+ (with polyfills for Proxy, Array.from)

---

## Migration from Original Files

All existing code continues to work with zero changes:

```javascript
// Old (file 01):
Conditions.whenState(value, conditions, selector);

// New (conditions-core.js):
Conditions.whenState(value, conditions, selector);
// Same API, enhanced internally
```

**Key Improvements:**
- Enhanced `apply()` with index support (from file 04)
- Default branch support built-in
- Shared utilities exported
- UMD support for universal compatibility

---

## Examples

### User Role Dashboard

```javascript
const state = { role: 'admin' };

Conditions.whenState(
  () => state.role,
  {
    'admin': {
      textContent: 'Admin Dashboard',
      classList: ['dashboard', 'admin'],
      style: { background: '#f00' }
    },
    'user': {
      textContent: 'User Panel',
      classList: ['dashboard', 'user'],
      style: { background: '#0f0' }
    },
    default: {
      textContent: 'Guest View',
      classList: ['dashboard', 'guest'],
      style: { background: '#ccc' }
    }
  },
  '#dashboard'
);
```

### Status Indicator

```javascript
whenState(
  () => connection.status,
  {
    'connected': {
      textContent: '● Connected',
      style: { color: 'green' },
      attrs: { 'data-status': 'online' }
    },
    'connecting': {
      textContent: '◐ Connecting...',
      style: { color: 'orange' }
    },
    'disconnected': {
      textContent: '○ Disconnected',
      style: { color: 'red' },
      classList: { add: 'error', remove: 'success' }
    }
  },
  '#connection-status'
);
```

### Collection Updates

```javascript
Conditions.whenStateCollection(
  () => theme,
  {
    'dark': {
      0: { textContent: '🌙 Dark Mode', className: 'dark' },
      style: { background: '#222', color: '#fff' }
    },
    'light': {
      0: { textContent: '☀️ Light Mode', className: 'light' },
      style: { background: '#fff', color: '#000' }
    }
  },
  '.theme-items'
);
```

---

## License

MIT License - See LICENSE file for details

---

**Version:** 2.3.1
**Last Updated:** December 2025
