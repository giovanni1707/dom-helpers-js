
---

# `Elements.destructure(...ids)`

Returns **multiple enhanced elements**, but instead of giving you an array, it returns an **object whose keys match the IDs you requested**.

This is a more semantic version of `Elements.getMultiple()`.
Where `getMultiple()` is perfect for array-destructuring,
`destructure()` is perfect for **named destructuring**.

---

## What it does conceptually

Internally, the logic is basically:

```javascript
function destructure(...ids) {
  const result = {};
  ids.forEach(id => {
    result[id] = Elements.get(id, null);
  });
  return result;
}
```

So for each ID:

* the element is looked up
* enhanced (if found)
* assigned as `result[id]`
* or set to `null` if missing

The returned object mirrors the ID names exactly.

---

## Why this method exists

### ✔ 1. Clean named destructuring

Instead of:

```javascript
const [header, sidebar] = Elements.getMultiple('header', 'sidebar');
```

You can do:

```javascript
const { header, sidebar } = Elements.destructure('header', 'sidebar');
```

Much more readable, especially in component-based code.

---

### ✔ 2. Ideal for UI modules and components

When you know the names of the elements you depend on, object destructuring is cleaner:

```javascript
const { card, title, button } = Elements.destructure('card', 'title', 'button');
```

### ✔ 3. Avoids positional mistakes

With array destructuring, order matters.
With this, order is irrelevant.

---

## Parameters

### `...ids` (string[])

Any number of element IDs.

---

## Returns

**Object** — where each key is the ID, and each value is:

* enhanced element (if found)
* `null` (if not found)

---

# Basic Example

```javascript
const { header, footer } = Elements.destructure('header', 'footer');

console.log(header); // enhanced element or null
console.log(footer); // enhanced element or null
```

---

# Practical Example — Component Setup

```javascript
const { wrapper, button, label } = Elements.destructure(
  'profileWrapper',
  'saveButton',
  'nameLabel'
);

if (wrapper) {
  wrapper.update({ classList: ['mounted'] });
}

if (button) {
  button.on('click', () => console.log('Saved!'));
}
```

---

# Example: Clear developer workflow

```javascript
const ids = ['nav', 'main', 'footer'];

const parts = Elements.destructure(...ids);

parts.nav?.update({ classList: ['expanded'] });
parts.main?.update({ textContent: 'Loaded' });
parts.footer?.update({ classList: ['visible'] });
```

Notice how convenient it is to access them by name.

---
