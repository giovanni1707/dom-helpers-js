# Understanding `loadCollections()` - A Beginner's Guide

## What is `loadCollections()`?

`loadCollections()` loads the collections module, enabling `Reactive.collection()` for standalone reactive arrays. Load this when you need collection features.

Think of it as **collections enabler** - use Reactive.collection().

---

## Why Does This Exist?

### The Problem: Need Collections

You want to use `Reactive.collection()` but don't want to load everything:

```javascript
// ❌ Without collections - method doesn't exist
Reactive.loadCore();
const items = Reactive.collection([]);  // Error!

// ✅ With collections
Reactive.loadCore();
Reactive.loadCollections();
const items = Reactive.collection([]);  // Works!
```

---

## What's Included

Collections module provides:
- `Reactive.collection()` - Create reactive collections
- All collection methods (push, pop, filter, map, etc.)
- Advanced operations (toggle, removeWhere, updateWhere)
- Collection utilities (isEmpty, toArray)

---

## Basic Usage

```javascript
// Load core + collections
Reactive.loadCore();
Reactive.loadCollections();

// Create collection
const items = Reactive.collection([1, 2, 3]);

// Use collection methods
items.push(4);
items.removeWhere(i => i > 2);
items.updateWhere(i => i === 1, { value: 10 });
```

---

## When to Use

### Use `loadCollections()` when:
- Need Reactive.collection()
- Working with standalone arrays
- Need collection-specific methods
- Want advanced array operations

### Don't use when:
- Only need arrays in state (use loadArraySupport)
- Don't use collections
- Already using loadAll()

---

## Example: Task Management

```javascript
// Load core + collections
Reactive.loadCore();
Reactive.loadCollections();

// Collections
const tasks = Reactive.collection([]);
const completedTasks = Reactive.collection([]);

// Add task
function addTask(title) {
  tasks.push({
    id: Date.now(),
    title: title,
    status: 'pending'
  });
}

// Complete task
function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    tasks.removeWhere(t => t.id === id);
    task.status = 'completed';
    completedTasks.push(task);
  }
}

// Display
Reactive.effect(() => {
  document.getElementById('pending-count').textContent = tasks.length;
  document.getElementById('completed-count').textContent = completedTasks.length;
});
```

---

## Summary

### What `loadCollections()` Provides:

1. ✅ Reactive.collection()
2. ✅ All collection methods
3. ✅ Advanced operations
4. ✅ Collection utilities

### When to Use It:

- Need collections
- Standalone reactive arrays
- Advanced array operations
- Collection-specific features

---

**Remember:** Load this when you need Reactive.collection()! 🎉
