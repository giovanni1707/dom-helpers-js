# Understanding `loadArraySupport()` - A Beginner's Guide

## What is `loadArraySupport()`?

`loadArraySupport()` loads the array support module, making arrays in state automatically reactive. Load this when you need reactive arrays but not collections or forms.

Think of it as **array enabler** - make state arrays reactive.

---

## Why Does This Exist?

### The Problem: Non-Reactive Arrays

Without array support, array mutations don't trigger reactivity:

```javascript
Reactive.loadCore();

const state = Reactive.state({
  items: [1, 2, 3]
});

state.items.push(4);  // ❌ Doesn't trigger reactivity

// ✅ Load array support
Reactive.loadCore();
Reactive.loadArraySupport();

state.items.push(4);  // ✅ Triggers reactivity!
```

---

## What's Included

Array support module provides:
- Automatic array patching
- Reactive push(), pop(), shift(), unshift()
- Reactive splice(), sort(), reverse()
- Reactive fill(), copyWithin()
- `patchArray()` method

---

## Basic Usage

```javascript
// Load core + array support
Reactive.loadCore();
Reactive.loadArraySupport();

// Arrays are now reactive
const state = Reactive.state({
  todos: []
});

state.todos.push({ title: 'Task 1' });  // Reactive!
state.todos.pop();  // Reactive!
state.todos.splice(0, 1);  // Reactive!
```

---

## When to Use

### Use `loadArraySupport()` when:
- Need reactive arrays in state
- Using lists/arrays
- Don't need Reactive.collection()
- Want smaller bundle than loadAll()

### Don't use when:
- Don't have arrays in state
- Using Reactive.collection() instead
- Already using loadAll()

---

## Example: Todo List

```javascript
// Load core + arrays
Reactive.loadCore();
Reactive.loadArraySupport();

// State with arrays
const todoState = Reactive.state({
  todos: [],
  filter: 'all'
});

// Add todo
function addTodo(title) {
  todoState.todos.push({
    id: Date.now(),
    title: title,
    completed: false
  });
}

// Remove todo
function removeTodo(id) {
  const index = todoState.todos.findIndex(t => t.id === id);
  todoState.todos.splice(index, 1);
}

// Display
Reactive.effect(() => {
  const container = document.getElementById('todos');
  container.innerHTML = todoState.todos
    .map(todo => `<div>${todo.title}</div>`)
    .join('');
});
```

---

## Summary

### What `loadArraySupport()` Provides:

1. ✅ Reactive array methods
2. ✅ Automatic patching
3. ✅ patchArray() function
4. ✅ Works with state arrays

### When to Use It:

- Arrays in state
- Need array reactivity
- Don't need collections
- Smaller bundle

---

**Remember:** Load this when you need reactive arrays in state! 🎉
