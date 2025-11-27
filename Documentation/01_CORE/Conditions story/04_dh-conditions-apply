# The Saga of Conditions.apply(): The Standalone Warrior

Imagine you're an explorer who needs a survival tool that works *anywhere*—in the jungle, in the desert, in the Arctic. You can't rely on having a full toolkit or external support. You need something self-contained, battle-tested, and versatile. A Swiss Army knife of code.

This is the story of `Conditions.apply()`—a **standalone implementation** that doesn't depend on the sprawling DOM Helpers ecosystem. While its siblings rely on parent modules and sophisticated integrations, this module stands alone, self-sufficient and proud. It's version **2.0.0**, announcing "Added default branch support"—a major feature enhancement.

This is a tale of **independence**, **completeness**, and **defensive engineering**. Every piece of functionality it needs, it implements itself. Let me take you through this self-reliant masterpiece.

---

## 🎬 Chapter 1: The Philosophy of Independence

```javascript
(function(global) {
  'use strict';
  
  // No dependency checks!
  // No "if (!global.Conditions) return;"
  // This module stands alone
```

Notice what's **missing**: dependency checks. This module doesn't start by verifying if other modules exist. It assumes nothing, provides everything.

**Why standalone?**

Sometimes you need conditional rendering but don't want to load an entire ecosystem. Maybe you're building a lightweight widget, a browser extension, or a microsite. This module is your answer—drop it in, and it works.

It's the difference between:
- **Dependent module:** "I need A, B, and C to work"
- **Standalone module:** "I am complete within myself"

---

## 🛡️ Chapter 2: Safe Array Conversion—The Symbol Problem Solved

```javascript
function safeArrayFrom(collection) {
  if (!collection) return [];
  
  // Already an array
  if (Array.isArray(collection)) {
    return collection;
  }
  
  // Standard NodeList or HTMLCollection
  if (collection instanceof NodeList || collection instanceof HTMLCollection) {
    return Array.from(collection);
  }
  
  // Custom collection with length property
  if (typeof collection === 'object' && 'length' in collection) {
    const elements = [];
    const len = Number(collection.length);
    if (!isNaN(len) && len >= 0) {
      for (let i = 0; i < len; i++) {
        // Only access numeric indices, skip Symbols
        if (Object.prototype.hasOwnProperty.call(collection, i)) {
          const item = collection[i];
          if (item instanceof Element) {
            elements.push(item);
          }
        }
      }
    }
    return elements;
  }
  
  return [];
}
```

This function is a **comprehensive solution** to the Proxy/Symbol iterator problem we've encountered before.

**The layered approach:**

**Layer 1: Quick returns**
```javascript
if (!collection) return [];
if (Array.isArray(collection)) return collection;
```

Handle the simple cases immediately—no collection returns empty array, existing array returns as-is.

**Layer 2: Native collections**
```javascript
if (collection instanceof NodeList || collection instanceof HTMLCollection) {
  return Array.from(collection);
}
```

NodeList and HTMLCollection have proper iterators, so `Array.from()` works reliably.

**Layer 3: Custom collections (the complex case)**
```javascript
if (typeof collection === 'object' && 'length' in collection) {
  const elements = [];
  const len = Number(collection.length);
  if (!isNaN(len) && len >= 0) {
    for (let i = 0; i < len; i++) {
      if (Object.prototype.hasOwnProperty.call(collection, i)) {
        const item = collection[i];
        if (item instanceof Element) {
          elements.push(item);
        }
      }
    }
  }
  return elements;
}
```

This is where the magic happens. Let's break it down:

**Step 1: Validate length**
```javascript
const len = Number(collection.length);
if (!isNaN(len) && len >= 0)
```

Convert length to number and ensure it's valid. This handles edge cases:
```javascript
Number('5')  // 5 ✓
Number('abc')  // NaN ✗
Number(-1)  // -1, but caught by >= 0 check ✗
```

**Step 2: Manual iteration**
```javascript
for (let i = 0; i < len; i++) {
  if (Object.prototype.hasOwnProperty.call(collection, i)) {
```

Loop through numeric indices. The `hasOwnProperty.call()` is **crucial**:

```javascript
// Why not just: collection.hasOwnProperty(i) ?
// Because the collection might not have hasOwnProperty method!

// Safer: Use the prototype version directly
Object.prototype.hasOwnProperty.call(collection, i)
```

This checks if the numeric property exists on the collection without relying on the collection having `hasOwnProperty` method.

**Step 3: Element filtering**
```javascript
const item = collection[i];
if (item instanceof Element) {
  elements.push(item);
}
```

Only push actual DOM elements. This filters out:
- Text nodes
- Comment nodes
- `null` or `undefined` values
- Any non-Element items

**Why this approach works:**

Even if the collection is a Proxy with broken `Symbol.iterator`, numeric property access (`collection[0]`, `collection[1]`) still works because Proxy's `get` trap intercepts it.

---

## 🔍 Chapter 3: Element Selection—Self-Sufficient Querying

```javascript
function getElements(selector) {
  // Single element
  if (selector instanceof Element) {
    return [selector];
  }
  
  // NodeList or HTMLCollection
  if (selector instanceof NodeList || selector instanceof HTMLCollection) {
    return safeArrayFrom(selector);
  }
  
  // Array
  if (Array.isArray(selector)) {
    return selector.filter(el => el instanceof Element);
  }

  // String selector
  if (typeof selector === 'string') {
    // ID selector
    if (selector.startsWith('#')) {
      const el = document.getElementById(selector.slice(1));
      return el ? [el] : [];
    }
    
    // Class selector
    if (selector.startsWith('.')) {
      return safeArrayFrom(document.getElementsByClassName(selector.slice(1)));
    }
    
    // Generic selector
    return safeArrayFrom(document.querySelectorAll(selector));
  }

  return [];
}
```

This function handles element selection **without any external dependencies**.

**The string selector optimization:**

For ID and class selectors, it uses optimized native methods:

```javascript
// ID: Use getElementById (fastest)
if (selector.startsWith('#')) {
  const el = document.getElementById(selector.slice(1));
  return el ? [el] : [];
}

// Class: Use getElementsByClassName (faster than querySelectorAll)
if (selector.startsWith('.')) {
  return safeArrayFrom(document.getElementsByClassName(selector.slice(1)));
}

// Generic: Use querySelectorAll (most flexible)
return safeArrayFrom(document.querySelectorAll(selector));
```

**Performance hierarchy:**
1. `getElementById()` - O(1) hash lookup
2. `getElementsByClassName()` - O(n) but optimized by browsers
3. `querySelectorAll()` - O(n) with CSS parsing overhead

The function automatically chooses the fastest method.

**Safe conversion everywhere:**

Notice every collection conversion uses `safeArrayFrom()`:
```javascript
return safeArrayFrom(document.getElementsByClassName(...));
return safeArrayFrom(document.querySelectorAll(...));
```

This ensures Proxy compatibility throughout.

---

## 🎯 Chapter 4: Condition Matching—Complete Implementation

```javascript
function matchesCondition(value, condition) {
  condition = String(condition).trim();
  
  // Boolean literals
  if (condition === 'true') return value === true;
  if (condition === 'false') return value === false;
  if (condition === 'truthy') return !!value;
  if (condition === 'falsy') return !value;
  
  // Null/Undefined
  if (condition === 'null') return value === null;
  if (condition === 'undefined') return value === undefined;
  
  // Empty check
  if (condition === 'empty') {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return !value;
  }
  
  // ... more matchers
  
  // Default: string equality
  return String(value) === condition;
}
```

This is a **complete reimplementation** of the condition matching system from the full Conditions module. It includes:

✅ Boolean literals (`'true'`, `'false'`)
✅ Truthiness (`'truthy'`, `'falsy'`)
✅ Null/undefined checks
✅ Empty detection
✅ Quoted strings
✅ String patterns (includes, startsWith, endsWith)
✅ Regex patterns
✅ Numeric comparisons (ranges, exact, >, <, >=, <=)
✅ String equality fallback

**Every matcher from the parent module is here**, implemented from scratch. This is what makes the module truly standalone—it doesn't delegate to parent functionality because there is no parent.

---

## 🎨 Chapter 5: Property Application—Full Handler Suite

```javascript
function applyProperty(element, key, val) {
  try {
    // Style object
    if (key === 'style' && typeof val === 'object' && val !== null) {
      Object.entries(val).forEach(([prop, value]) => {
        if (value !== null && value !== undefined) {
          element.style[prop] = value;
        }
      });
      return;
    }
    
    // classList operations
    if (key === 'classList' && typeof val === 'object' && val !== null) {
      if (Array.isArray(val)) {
        element.className = '';
        val.forEach(cls => cls && element.classList.add(cls));
      } else {
        if (val.add) {
          const classes = Array.isArray(val.add) ? val.add : [val.add];
          classes.forEach(cls => cls && element.classList.add(cls));
        }
        if (val.remove) {
          const classes = Array.isArray(val.remove) ? val.remove : [val.remove];
          classes.forEach(cls => cls && element.classList.remove(cls));
        }
        if (val.toggle) {
          const classes = Array.isArray(val.toggle) ? val.toggle : [val.toggle];
          classes.forEach(cls => cls && element.classList.toggle(cls));
        }
      }
      return;
    }
    
    // ... more handlers
    
  } catch (e) {
    console.warn(`[Conditions] Failed to apply ${key}:`, e);
  }
}
```

Again, a complete implementation of property handlers. Every handler from the parent module is reimplemented:

✅ Style objects
✅ classList operations (add, remove, toggle)
✅ Attributes (set, remove)
✅ Dataset
✅ Event listeners
✅ Event properties (`onclick`, etc.)
✅ Native DOM properties
✅ Fallback setAttribute

**The simplified classList handler:**

Notice this version doesn't include `replace` operation:

```javascript
if (val.add) { /* ... */ }
if (val.remove) { /* ... */ }
if (val.toggle) { /* ... */ }
// No 'replace'
```

This is **pragmatic minimalism**—include the 90% use cases, omit the rare operations to keep code lean.

---

## 🔧 Chapter 6: Collection-Aware Application—The Core Innovation

```javascript
function applyToCollection(elements, config) {
  // Separate index-specific and shared properties
  const sharedProps = {};
  const indexProps = {};
  
  Object.entries(config).forEach(([key, value]) => {
    // Check if key is a numeric index (including negative)
    if (/^-?\d+$/.test(key)) {
      indexProps[key] = value;
    } else {
      sharedProps[key] = value;
    }
  });
  
  // Apply shared properties to ALL elements
  if (Object.keys(sharedProps).length > 0) {
    elements.forEach(element => {
      applyConfig(element, sharedProps);
    });
  }
  
  // Apply index-specific properties
  Object.entries(indexProps).forEach(([indexStr, updates]) => {
    let index = parseInt(indexStr);
    
    // Handle negative indices
    if (index < 0) {
      index = elements.length + index;
    }
    
    // Apply if index is valid
    if (index >= 0 && index < elements.length) {
      const element = elements[index];
      applyConfig(element, updates);
    }
  });
}
```

This is the **defining feature** that makes this module special—collection-aware updates with index support.

**The separation:**

```javascript
config = {
  style: { padding: '10px' },      // Shared
  classList: { add: ['item'] },    // Shared
  [0]: { textContent: 'First' },   // Index
  [-1]: { textContent: 'Last' }    // Index
}

// After separation:
sharedProps = {
  style: { padding: '10px' },
  classList: { add: ['item'] }
}
indexProps = {
  [0]: { textContent: 'First' },
  [-1]: { textContent: 'Last' }
}
```

**The application order:**

```javascript
// 1. Apply shared to ALL
elements.forEach(element => {
  applyConfig(element, sharedProps);
});

// 2. Apply index-specific
Object.entries(indexProps).forEach(([indexStr, updates]) => {
  // ...
});
```

Shared first, then index-specific. This ensures index updates can override shared properties if needed.

---

## 🎁 Chapter 7: The Default Branch—Version 2.0 Feature

```javascript
apply(value, conditions, selector) {
  // Get elements
  const elements = getElements(selector);
  
  // ... validation ...
  
  // Get conditions object
  const conditionsObj = typeof conditions === 'function' ? conditions() : conditions;
  
  // ✅ NEW: Extract default branch if present
  const { default: defaultConfig, ...regularConditions } = conditionsObj;
  
  // Find matching condition from regular conditions
  let matchingConfig = null;
  for (const [condition, config] of Object.entries(regularConditions)) {
    if (matchesCondition(value, condition)) {
      matchingConfig = config;
      break;
    }
  }
  
  // ✅ NEW: Fall back to default if no match found
  if (!matchingConfig && defaultConfig) {
    matchingConfig = defaultConfig;
    console.log('[Conditions] Using default branch for value:', value);
  }
  
  if (!matchingConfig) {
    console.info('[Conditions] No matching condition or default for value:', value);
    return this;
  }
  
  // Apply configuration to collection
  applyToCollection(elements, matchingConfig);
  
  return this;
}
```

This is the v2.0 enhancement—native default branch support!

**The extraction:**

```javascript
const { default: defaultConfig, ...regularConditions } = conditionsObj;
```

This destructuring pulls out the `default` key separately from all other conditions.

```javascript
conditions = {
  'active': { style: { color: 'green' } },
  'inactive': { style: { color: 'red' } },
  default: { style: { color: 'gray' } }
}

// After destructuring:
defaultConfig = { style: { color: 'gray' } }
regularConditions = {
  'active': { style: { color: 'green' } },
  'inactive': { style: { color: 'red' } }
}
```

**The matching logic:**

```javascript
// Try regular conditions first
for (const [condition, config] of Object.entries(regularConditions)) {
  if (matchesCondition(value, condition)) {
    matchingConfig = config;
    break;
  }
}

// If no match, use default
if (!matchingConfig && defaultConfig) {
  matchingConfig = defaultConfig;
  console.log('[Conditions] Using default branch for value:', value);
}
```

Default is a **fallback**, not a primary condition. It only applies when nothing else matches.

**Why not use the regex trick from the default extension?**

The default extension converted `default` to a catch-all regex:
```javascript
'/^[\\s\\S]*$/': defaultConfig
```

This module takes a simpler approach—explicit check after trying all conditions. It's more direct and easier to understand.

---

## 🎯 Chapter 8: The Public API—Minimal and Complete

```javascript
const ConditionsApply = {
  apply(value, conditions, selector) {
    // ... implementation ...
    return this;
  },
  
  batch(fn) {
    if (typeof fn === 'function') {
      fn();
    }
    return this;
  },
  
  getElements(selector) {
    return getElements(selector);
  },
  
  testCondition(value, condition) {
    return matchesCondition(value, condition);
  }
};
```

**The main method: apply()**

```javascript
ConditionsApply.apply(userStatus, {
  'online': { style: { color: 'green' } },
  'away': { style: { color: 'yellow' } },
  default: { style: { color: 'gray' } }
}, '.status-indicator');
```

Simple, declarative, powerful.

**The batch method:**

```javascript
batch(fn) {
  if (typeof fn === 'function') {
    fn();
  }
  return this;
}
```

This is simpler than the parent module's batch. There's no reactive batching here—it just executes the function immediately. But it maintains **API compatibility** with the parent.

**The debug helpers:**

```javascript
getElements(selector)     // Expose element selection
testCondition(value, condition)  // Expose condition matching
```

These expose internal functions for debugging and testing. It's **developer-friendly**—you can test individual pieces without running the whole system.

---

## 🔗 Chapter 9: The Export Strategy—Multiple Targets

```javascript
// Export to global scope
if (!global.Conditions) {
  global.Conditions = {};
}

// Merge with existing Conditions or create new
global.Conditions.apply = ConditionsApply.apply.bind(ConditionsApply);
global.Conditions.batch = ConditionsApply.batch.bind(ConditionsApply);

// Also export standalone
global.ConditionsApply = ConditionsApply;
```

**The careful integration:**

```javascript
if (!global.Conditions) {
  global.Conditions = {};
}
```

Create `Conditions` object if it doesn't exist. This means the module can work:
- **Alone:** If loaded by itself
- **Together:** If loaded with the full Conditions module

**The .bind() pattern:**

```javascript
global.Conditions.apply = ConditionsApply.apply.bind(ConditionsApply);
```

Why `.bind(ConditionsApply)`?

Because when you call `Conditions.apply(...)`, inside the function `this` needs to refer to `ConditionsApply`. The `.bind()` ensures the `this` context is preserved.

Without it:
```javascript
global.Conditions.apply = ConditionsApply.apply;

// Later:
Conditions.apply(...)
// Inside the function, 'this' would be Conditions, not ConditionsApply
// The "return this" would return the wrong object!
```

**Dual export:**

```javascript
global.Conditions.apply  // Integrated API
global.ConditionsApply   // Standalone API
```

Both work:
```javascript
Conditions.apply(...)      // Familiar API
ConditionsApply.apply(...) // Explicit API
```

---

## 🎓 The Profound Lessons—Standalone Engineering

This module teaches us about **self-sufficient design**:

**1. Complete implementation:** Every piece of functionality is implemented, not delegated

**2. Defensive array conversion:** Handle all edge cases, especially Proxy/Symbol issues

**3. Optimized selection:** Use fastest native methods when possible

**4. Full matcher suite:** Reimple all condition types for standalone operation

**5. Collection awareness:** Handle both bulk and index updates naturally

**6. Default branch support:** Provide fallback configuration when no conditions match

**7. API compatibility:** Mirror parent module's API while being independent

**8. Debug helpers:** Expose internal functions for testing and debugging

**9. Careful integration:** Work standalone or alongside parent module

**10. Pragmatic minimalism:** Include 90% use cases, omit rare operations

---

## 🌟 The Final Reflection—The Swiss Army Knife

This module is the **Swiss Army knife** of conditional DOM manipulation:

✅ **Standalone:** Works without any dependencies
✅ **Complete:** Every feature implemented internally
✅ **Compatible:** Can integrate with parent Conditions module
✅ **Collection-aware:** Handles bulk + index updates
✅ **Default branch:** Provides fallback configurations
✅ **Defensive:** Handles Proxies, Symbols, and edge cases
✅ **Optimized:** Uses fastest native methods
✅ **Debuggable:** Exposes helpers for testing

**Usage:**

```javascript
ConditionsApply.apply(
  gameState,
  {
    'won': {
      // All players
      classList: { add: ['victory'] },
      style: { backgroundColor: '#gold' },
      // First player (MVP)
      [0]: {
        textContent: '🏆 MVP',
        style: { fontSize: '24px', fontWeight: 'bold' }
      },
      // Last player
      [-1]: {
        textContent: '🎖️ Team Player'
      }
    },
    'lost': {
      classList: { add: ['defeat'] },
      style: { opacity: '0.6' }
    },
    'draw': {
      classList: { add: ['tie'] },
      style: { backgroundColor: '#gray' }
    },
    default: {
      // Unexpected state
      textContent: '?',
      style: { backgroundColor: '#orange' }
    }
  },
  '.player-card'
);
```

One module, one call, complete functionality.

That's the power of standalone engineering—everything you need, nothing you don't, working anywhere! 🚀✨
