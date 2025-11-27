# The Chronicle of Conditions Collection Extension: When Groups Need Conditional Logic

Imagine you're a choreographer directing a dance troupe. You need to give instructions based on the music's tempo: "When the tempo is fast, all dancers spread out, but dancer #1 moves to center stage, and dancer #5 spins." You need to command the *entire group* while also giving *specific instructions* to individuals—all based on a single condition.

This is the story of the Conditions Collection Extension—a specialized module that brings conditional rendering to *collections* of elements, not just individual ones. It's about applying the power of `whenState()` to groups while maintaining the ability to target specific members of that group.

This is a **bridge module**—it connects two powerful systems (Conditions and Collection Updates) into a unified, expressive API.

Let me take you through this focused, purposeful piece of code.

---

## 🎬 Chapter 1: The Single Dependency—One Requirement

```javascript
(function(global) {
  'use strict';

  if (!global.Conditions) {
    console.error('[Conditions.Collection] Requires Conditions.js');
    return;
  }

  const Conditions = global.Conditions;
```

Unlike some modules we've seen that check for multiple optional dependencies, this one is laser-focused: **it needs Conditions.js, period.**

There's no elaborate fallback strategy, no degraded mode. If Conditions doesn't exist, the module exits immediately with a clear error.

**Why this approach?**

Because this module is explicitly an **extension** of Conditions. Without the parent, the child has no purpose. It's honest about its dependencies rather than pretending to work in isolation.

---

## 🎯 Chapter 2: The Main Function—whenStateCollection

```javascript
function whenStateCollection(valueFn, conditions, selector, options = {}) {
  const hasReactivity = Conditions.hasReactivity;
  const useReactive = options.reactive !== false && hasReactivity;
  
  // Get value function
  const getValue = typeof valueFn === 'function' ? valueFn : () => valueFn;
```

The function signature mirrors `Conditions.whenState()`, making it familiar to existing users:

```javascript
// Original
Conditions.whenState(valueFn, conditions, selector, options)

// Collection version
Conditions.whenStateCollection(valueFn, conditions, selector, options)
```

**The reactivity detection:**

```javascript
const hasReactivity = Conditions.hasReactivity;
const useReactive = options.reactive !== false && hasReactivity;
```

It leverages the parent module's reactivity detection. Rather than re-implementing environment checks, it trusts that `Conditions` has already figured out what's available.

This is **dependency on parent capabilities**—the child inherits the parent's abilities.

**The value normalization:**

```javascript
const getValue = typeof valueFn === 'function' ? valueFn : () => valueFn;
```

Just like the parent module, this allows both functions and static values:

```javascript
whenStateCollection(() => myState.count, ...)  // Function
whenStateCollection(42, ...)  // Static value → wrapped in function
```

---

## 🔍 Chapter 3: The Collection Retrieval—Multi-Strategy Selection

```javascript
function applyToCollection() {
  // Get collection
  let collection;
  
  if (typeof selector === 'string') {
    // Try global shortcuts first
    if (selector.startsWith('.') && global.ClassName) {
      const className = selector.slice(1);
      collection = global.ClassName[className];
    } else if (selector.startsWith('#')) {
      // Single element, use regular whenState
      return Conditions.whenState(valueFn, conditions, selector, options);
    } else if (global.querySelectorAll) {
      collection = global.querySelectorAll(selector);
    } else {
      collection = document.querySelectorAll(selector);
    }
  } else if (selector instanceof Element) {
    // Single element
    collection = [selector];
  } else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
    collection = selector;
  } else if (Array.isArray(selector)) {
    collection = selector;
  } else {
    console.warn('[Conditions.Collection] Invalid selector');
    return;
  }
```

This function handles multiple input types with a cascading strategy.

**For string selectors:**

**Priority 1: Class shortcuts** (`.className`)
```javascript
if (selector.startsWith('.') && global.ClassName) {
  const className = selector.slice(1);
  collection = global.ClassName[className];
}
```

Uses the optimized `ClassName` shortcut if available.

**Priority 2: ID shortcut delegation** (`#id`)
```javascript
else if (selector.startsWith('#')) {
  return Conditions.whenState(valueFn, conditions, selector, options);
}
```

This is clever—ID selectors return a *single element*, not a collection. Rather than duplicating the single-element logic, it **delegates** back to the original `whenState()`:

```javascript
whenStateCollection(value, conditions, '#my-button')
// Internally becomes:
Conditions.whenState(value, conditions, '#my-button')
```

It's **smart routing**—recognize when collection handling isn't needed and use the appropriate tool.

**Priority 3: Global querySelectorAll**
```javascript
else if (global.querySelectorAll) {
  collection = global.querySelectorAll(selector);
}
```

Uses the global enhanced version if available (from previous modules).

**Priority 4: Native querySelectorAll**
```javascript
else {
  collection = document.querySelectorAll(selector);
}
```

Fallback to native browser API.

**For non-string selectors:**

```javascript
else if (selector instanceof Element) {
  collection = [selector];  // Wrap in array
}
else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
  collection = selector;  // Use as-is
}
else if (Array.isArray(selector)) {
  collection = selector;  // Use as-is
}
```

Each type is handled appropriately. Single elements are wrapped in arrays to unify the interface.

---

## 🎭 Chapter 4: The Value and Conditions Retrieval—Error-Safe Access

```javascript
// Get current value
let value;
try {
  value = getValue();
} catch (e) {
  console.error('[Conditions.Collection] Error getting value:', e);
  return;
}

// Get conditions object
let conditionsObj;
try {
  conditionsObj = typeof conditions === 'function' ? conditions() : conditions;
} catch (e) {
  console.error('[Conditions.Collection] Error evaluating conditions:', e);
  return;
}
```

Each operation is wrapped in try-catch. Why?

**getValue() might throw:**
```javascript
getValue()
// Might try to access: state.user.profile.name
// If user or profile is undefined → Error
```

**Conditions function might throw:**
```javascript
conditions()
// Might compute: { [`>${threshold}`]: config }
// If threshold is undefined → Error
```

The try-catch prevents one error from crashing the entire system. Instead, it logs and exits gracefully.

---

## 🎯 Chapter 5: The Condition Matching—Finding the Right Configuration

```javascript
// Find matching condition
let matchingConfig = null;
for (const [condition, config] of Object.entries(conditionsObj)) {
  if (matchCondition(value, condition)) {
    matchingConfig = config;
    break;
  }
}

if (!matchingConfig) {
  console.info('[Conditions.Collection] No matching condition for value:', value);
  return;
}
```

This loops through conditions in order, stopping at the first match:

```javascript
conditions = {
  'active': { style: { color: 'green' } },
  'inactive': { style: { color: 'red' } },
  'truthy': { style: { color: 'blue' } }  // Broader condition
}

// If value = 'active':
// Tries 'active' → matches! → stops
// Never checks 'inactive' or 'truthy'
```

The `break` is crucial—without it, we might apply multiple conflicting configurations.

**The no-match case:**

```javascript
if (!matchingConfig) {
  console.info('[Conditions.Collection] No matching condition for value:', value);
  return;
}
```

Uses `console.info` (not `warn` or `error`) because no match might be intentional—maybe the developer only wants to handle specific states.

---

## 🔧 Chapter 6: The Collection Update—Dual-Path Application

```javascript
// Apply to collection using .update() if available
if (collection.update && typeof collection.update === 'function') {
  try {
    collection.update(matchingConfig);
  } catch (e) {
    console.warn('[Conditions.Collection] Error using collection.update():', e);
    applyManually(collection, matchingConfig);
  }
} else {
  applyManually(collection, matchingConfig);
}
```

**The two-path strategy:**

**Path 1: Use collection's .update() method** (preferred)
```javascript
collection.update({
  style: { padding: '10px' },  // Bulk
  [0]: { textContent: 'First' }  // Index
})
```

If the collection has an enhanced `.update()` method (from previous modules), use it. It's optimized and handles both bulk and index updates.

**Path 2: Manual application** (fallback)
```javascript
applyManually(collection, matchingConfig)
```

If `.update()` doesn't exist or throws an error, fall back to manual processing.

The try-catch around `.update()` is defensive—even if the method exists, it might fail for various reasons. Rather than crash, we gracefully degrade to the manual path.

---

## 🎨 Chapter 7: The Manual Application—Handling Index and Bulk Updates

```javascript
function applyManually(collection, config) {
  const elements = Array.from(collection);
  
  // Separate index and bulk updates
  const indexUpdates = {};
  const bulkUpdates = {};
  
  Object.entries(config).forEach(([key, value]) => {
    if (/^-?\d+$/.test(key)) {
      indexUpdates[key] = value;
    } else {
      bulkUpdates[key] = value;
    }
  });
```

**The separation algorithm:**

We've seen this pattern before—separate numeric indices from regular properties:

```javascript
config = {
  style: { color: 'blue' },      // Bulk
  classList: { add: ['item'] },  // Bulk
  [0]: { textContent: 'First' }, // Index
  [-1]: { textContent: 'Last' }  // Index
}

// After separation:
bulkUpdates = {
  style: { color: 'blue' },
  classList: { add: ['item'] }
}
indexUpdates = {
  [0]: { textContent: 'First' },
  [-1]: { textContent: 'Last' }
}
```

The regex `/^-?\d+$/` ensures we only treat actual integers as indices.

**Applying bulk updates:**

```javascript
if (Object.keys(bulkUpdates).length > 0) {
  elements.forEach(element => {
    if (element && element.update) {
      element.update(bulkUpdates);
    }
  });
}
```

For each element, apply the bulk configuration. The `element.update` check ensures we only call it on enhanced elements.

**Applying index-specific updates:**

```javascript
Object.entries(indexUpdates).forEach(([indexStr, updates]) => {
  let index = parseInt(indexStr);
  if (index < 0) index = elements.length + index;
  
  const element = elements[index];
  if (element && element.update) {
    element.update(updates);
  }
});
```

The familiar negative index handling:
```javascript
elements.length = 5
index = -1
result = 5 + (-1) = 4  // Last element
```

Then apply the specific updates to that indexed element.

---

## 🔍 Chapter 8: The Condition Matcher—Delegating or Implementing

```javascript
function matchCondition(value, condition) {
  condition = String(condition).trim();
  
  // Use Conditions' built-in matcher if available
  if (Conditions._matchCondition) {
    return Conditions._matchCondition(value, condition);
  }

  // Fallback: basic matching
  if (condition === 'true') return value === true;
  if (condition === 'false') return value === false;
  if (condition === 'truthy') return !!value;
  if (condition === 'falsy') return !value;
  
  return String(value) === condition;
}
```

**The delegation attempt:**

```javascript
if (Conditions._matchCondition) {
  return Conditions._matchCondition(value, condition);
}
```

The module tries to use the parent's internal matcher (if exposed). This is **inheritance of functionality**—why reimplement when the parent already has a sophisticated matcher?

**The fallback implementation:**

If the parent doesn't expose its matcher, we implement basic matching:
- Boolean literals (`'true'`, `'false'`)
- Truthiness tests (`'truthy'`, `'falsy'`)
- String equality (default)

This ensures the module works even if the parent's internals change or aren't accessible.

---

## 🔄 Chapter 9: The Execution Mode—Reactive or Static

```javascript
// Execute
if (useReactive) {
  if (global.ReactiveUtils && global.ReactiveUtils.effect) {
    return global.ReactiveUtils.effect(applyToCollection);
  } else if (global.Elements && global.Elements.effect) {
    return global.Elements.effect(applyToCollection);
  }
}

// Non-reactive
applyToCollection();
return {
  update: applyToCollection,
  destroy: () => {}
};
```

**Reactive mode:**

If reactivity is available and not disabled, wrap the application function in an effect:

```javascript
ReactiveUtils.effect(applyToCollection)
```

This creates a reactive context where `applyToCollection` re-runs whenever dependencies change.

**The cascading effect search:**

```javascript
if (global.ReactiveUtils && global.ReactiveUtils.effect) {
  // Use ReactiveUtils
} else if (global.Elements && global.Elements.effect) {
  // Use Elements
}
```

Try multiple locations for the `effect` function, ensuring compatibility with different setups.

**Non-reactive mode:**

```javascript
applyToCollection();
return {
  update: applyToCollection,
  destroy: () => {}
};
```

Execute once, then return an object with manual control methods. This matches the parent module's API for consistency.

---

## 📦 Chapter 10: The Public API—Integration and Aliases

```javascript
// Add to Conditions
Conditions.whenStateCollection = whenStateCollection;

// Convenience alias
Conditions.whenCollection = whenStateCollection;

console.log('[Conditions.Collection] v1.0.0 loaded');
console.log('[Conditions.Collection] ✓ Supports bulk + index updates in conditions');
```

**Two names for the same function:**

```javascript
Conditions.whenStateCollection(...)  // Descriptive
Conditions.whenCollection(...)        // Concise
```

This is **API ergonomics**—provide both a descriptive name (clear intent) and a short alias (less typing for common use).

Users can choose based on preference:
- Use `whenStateCollection` in documentation or complex code for clarity
- Use `whenCollection` in everyday coding for brevity

---

## 🎯 Chapter 11: Real-World Usage Examples

Let's see how this module shines in practice:

**Example 1: Status indicators**
```javascript
Conditions.whenCollection(
  () => serverStatus,
  {
    'online': {
      // All servers get green
      style: { backgroundColor: 'green' },
      // But first server shows count
      [0]: { textContent: `Online (${serverCount})` }
    },
    'offline': {
      // All servers get red
      style: { backgroundColor: 'red' },
      classList: { add: ['disabled'] }
    },
    'maintenance': {
      // All servers get yellow
      style: { backgroundColor: 'yellow' },
      // Last server shows message
      [-1]: { textContent: 'Maintenance scheduled' }
    }
  },
  '.server-status'
);
```

**Example 2: Priority levels**
```javascript
Conditions.whenCollection(
  () => taskPriority,
  {
    'high': {
      classList: { add: ['priority-high'], remove: ['priority-low'] },
      [0]: { textContent: '🔥 URGENT', style: { fontWeight: 'bold' } }
    },
    'medium': {
      classList: { add: ['priority-medium'] },
      style: { opacity: '0.8' }
    },
    'low': {
      classList: { add: ['priority-low'] },
      style: { opacity: '0.6' }
    }
  },
  '.task-item'
);
```

**Example 3: Theme switching**
```javascript
Conditions.whenCollection(
  () => theme,
  {
    'dark': {
      style: { 
        backgroundColor: '#1a1a1a',
        color: '#ffffff'
      },
      [0]: { textContent: '🌙 Dark Mode' }
    },
    'light': {
      style: { 
        backgroundColor: '#ffffff',
        color: '#000000'
      },
      [0]: { textContent: '☀️ Light Mode' }
    },
    'auto': {
      classList: { add: ['theme-auto'] },
      [0]: { textContent: '🔄 Auto' }
    }
  },
  '.theme-element'
);
```

---

## 🎓 The Wisdom Gained—Specialized Extensions

This module teaches us about **specialized extensions**:

**1. Focused purpose:** Does one thing well—applies conditions to collections

**2. Parent dependency:** Honestly declares dependency on parent module

**3. Capability inheritance:** Leverages parent's reactivity detection and matching logic

**4. API consistency:** Mirrors parent's API for familiarity

**5. Dual-path execution:** Optimized path when possible, fallback when necessary

**6. Error isolation:** Try-catch around each operation prevents cascading failures

**7. Convenience aliases:** Provide both descriptive and concise names

**8. Smart delegation:** Recognizes when to delegate to other systems (like ID selectors)

---

## 🌟 The Final Reflection—Bridge Building

This module is a **bridge**—it connects conditional logic (from Conditions) with collection updates (from Collection Updates) into a unified, expressive API.

It's not trying to be a standalone system. It's not trying to duplicate existing functionality. It's simply bridging two powerful systems in a way that feels natural and intuitive.

When you write:

```javascript
Conditions.whenCollection(
  () => gameState,
  {
    'won': {
      classList: { add: ['winner'] },
      [0]: { textContent: '🏆 Champion!' }
    },
    'lost': {
      classList: { add: ['loser'] },
      style: { opacity: '0.5' }
    }
  },
  '.player-card'
);
```

You're wielding the combined power of:
- Conditional logic and pattern matching
- Collection-wide updates
- Index-specific targeting
- Reactive state management

All in one expressive declaration.

That's the power of thoughtful bridge-building in software architecture! 🚀✨