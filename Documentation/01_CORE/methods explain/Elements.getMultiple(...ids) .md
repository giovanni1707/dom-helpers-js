

---

# `Elements.getMultiple(...ids)`

Retrieve **multiple elements by their IDs** in a single call.
Each returned item is either:

* an **enhanced element** (if found), or
* `null` (if not found)

This method is basically a convenience wrapper around `Elements.get()`, but optimized to handle multiple IDs at once and return them in order.

---

## What it does conceptually

Internally, it behaves like:

```javascript
function getMultiple(...ids) {
  return ids.map(id => Elements.get(id, null));
}
```

So for each ID passed in:

* it looks up the element
* enhances it (if found)
* or returns `null`

You end up with an array that mirrors the input order.

---

## Why this method exists

### ✔ 1. Cleaner code

Instead of writing:

```javascript
const header = Elements.get('header');
const nav = Elements.get('nav');
const main = Elements.get('main');
```

You do:

```javascript
const [header, nav, main] = Elements.getMultiple('header', 'nav', 'main');
```

### ✔ 2. Consistent enhancement

Every element returned is automatically enhanced.

### ✔ 3. Useful for component mounting

Often you need a set of related elements (wrapper, button, label, etc.).
This avoids repetitive code and ensures uniform handling of missing IDs.

---

## Parameters

### `...ids` (string[])

Any number of element IDs, passed as separate arguments.

---

## Returns

**Array** — each entry is:

* an enhanced HTMLElement (if found)
* `null` (if missing)

---

# Basic Example

```javascript
const [title, menu, footer] = Elements.getMultiple(
  'titleBar',
  'mainMenu',
  'footer'
);

console.log(title, menu, footer);
```

---

# Practical Example: Component Initialization

```javascript
const [wrapper, button, label] = Elements.getMultiple(
  'cardWrapper',
  'cardButton',
  'cardLabel'
);

if (wrapper && button) {
  wrapper.update({ classList: ['active'] });
  button.on('click', () => console.log('Clicked!'));
}

if (!label) {
  console.warn('Label element missing');
}
```

---

# Example With Dynamic IDs

```javascript
const sectionIds = ['sec1', 'sec2', 'sec3'];
const sections = Elements.getMultiple(...sectionIds);

sections.forEach((sec, i) => {
  if (sec) {
    sec.update({ textContent: `Section ${i + 1} ready` });
  }
});
```

---

