# Understanding `loadCore()` - A Beginner's Guide

## What is `loadCore()`?

`loadCore()` loads only the core reactive module (state, computed, effect, watch). Use this for minimal bundle size when you don't need collections or forms.

Think of it as **essentials loader** - just the core features.

---

## Why Does This Exist?

### The Problem: Unused Features

You only need basic reactivity but `loadAll()` loads everything:

```javascript
// ❌ loadAll - loads unused features
Reactive.loadAll();  // Loads core + arrays + collections + forms

// ✅ loadCore - only what you need
Reactive.loadCore();  // Just core features
```

**Why this matters:**
- Smaller bundle size
- Faster loading
- Only load what you need
- Better performance

---

## What's Included

Core module provides:
- `Reactive.state()` - Create reactive state
- `Reactive.computed()` - Computed values
- `Reactive.effect()` - Side effects
- `Reactive.watch()` - Watch properties
- `Reactive.bind()` - Two-way binding
- `Reactive.asyncState()` - Async state

---

## Basic Usage

```javascript
// Load core only
Reactive.loadCore();

// Use core features
const state = Reactive.state({ count: 0 });

const doubled = Reactive.computed(() => state.count * 2);

Reactive.effect(() => {
  console.log(state.count);
});

Reactive.watch(state, 'count', (newVal) => {
  console.log('Count changed:', newVal);
});
```

---

## When to Use

### Use `loadCore()` when:
- Building lightweight apps
- Only need state management
- Don't need collections
- Don't need forms
- Want minimal bundle

### Don't use when:
- Need Reactive.collection()
- Need Reactive.form()
- Need validators
- Want all features

---

## Example: Counter App

```javascript
// Load core
Reactive.loadCore();

// State
const counter = Reactive.state({
  count: 0,
  step: 1
});

// Computed
const doubled = Reactive.computed(() => counter.count * 2);

// Display
Reactive.effect(() => {
  document.getElementById('count').textContent = counter.count;
  document.getElementById('doubled').textContent = doubled;
});

// Actions
function increment() {
  counter.count += counter.step;
}

function decrement() {
  counter.count -= counter.step;
}

function reset() {
  counter.count = 0;
}
```

---

## Loading Additional Modules

You can load other modules later:

```javascript
// Start with core
Reactive.loadCore();

// Later, load more
Reactive.loadCollections();  // Add collections
Reactive.loadForms();  // Add forms
```

---

## Summary

### What `loadCore()` Provides:

1. ✅ state()
2. ✅ computed()
3. ✅ effect()
4. ✅ watch()
5. ✅ bind()
6. ✅ asyncState()

### When to Use It:

- Minimal apps
- No collections needed
- No forms needed
- Smaller bundle priority

---

**Remember:** Use `loadCore()` for minimal, lightweight reactive apps! 🎉
