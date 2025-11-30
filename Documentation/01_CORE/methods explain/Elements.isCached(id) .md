

---

# `Elements.isCached(id)`

Checks whether an element with the given ID is **already stored in the internal Elements cache**.

DOM Helpers internally caches enhanced elements so they don’t need to be re-wrapped or re-enhanced every time you call `Elements.get()`.
`Elements.isCached(id)` tells you *if that enhanced element already exists in the cache*.

---

## What it actually does (conceptually)

Internally you have something like:

```javascript
const cache = new Map(); // example

function isCached(id) {
  return cache.has(id);
}
```

So this method simply checks if that `id` key exists inside the enhancement/cache system.

---

## Why this method exists

### ✔ **1. Performance awareness**

Sometimes you want to know if retrieving an element will require enhancement or not.

Example:

```javascript
if (!Elements.isCached('sidebar')) {
  console.log('Sidebar will be enhanced for the first time.');
}
```

### ✔ **2. Useful for debugging**

You can see whether your app is accidentally enhancing the same element more than once.

### ✔ **3. Supports advanced workflows**

Especially when building big apps with DOM Helpers, devs sometimes want to control or inspect:

* when elements enter the cache
* when to clear/refresh them
* whether caching is behaving correctly

---

## Parameters

### `id` (string)

The element’s ID whose cache status you want to check.

---

## Returns

**boolean**

* `true` → element is already cached
* `false` → element has not been enhanced/cached yet

---

## Example

```javascript
if (Elements.isCached('header')) {
  console.log('Header already enhanced and cached.');
} else {
  console.log('Header not yet cached.');
}
```

---

## Example in a real workflow

```javascript
// First access will cache the element
const header = Elements.get('header');

// Check again later
if (Elements.isCached('header')) {
  console.log('Fast path — no re-enhancement needed.');
}
```

---

## Visual mental model

```
DOM → element (#header)
    ↓ first lookup
Enhancer → enhanced element object
    ↓
Cache → { header: EnhancedElement }

Elements.isCached('header') → true
```

---

