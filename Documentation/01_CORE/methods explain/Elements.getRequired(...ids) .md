

---

# `Elements.getRequired(...ids)`

Retrieve **one or more elements by ID**, but unlike `Elements.get()` or `getMultiple()`, this method is *strict*.
If **any requested element is missing**, it throws a descriptive error.

Use this when your code **cannot run without specific DOM elements present** — for example, for critical UI components.

---

## What it does conceptually

Internally, the logic is something like:

```javascript
function getRequired(...ids) {
  return ids.map(id => {
    const el = Elements.get(id, null);
    if (!el) {
      throw new Error(`[DOM Helpers] Required element missing: #${id}`);
    }
    return el;
  });
}
```

So for each ID:

* Try to load and enhance the element
* If found → return it
* If not found → **throw**

This ensures you never silently proceed with missing dependencies.

---

# Why this method exists

### ✔ **1. Fail fast**

Great for critical UI, initialization code, or components that *must* find their elements.

```javascript
// If sidebar is missing, stop everything immediately
const [sidebar] = Elements.getRequired('sidebar');
```

### ✔ **2. Removes conditional clutter**

Instead of manually checking every element:

```javascript
const el1 = Elements.get('a');
if (!el1) throw new Error();

const el2 = Elements.get('b');
if (!el2) throw new Error();
```

You write:

```javascript
const [a, b] = Elements.getRequired('a', 'b');
```

### ✔ **3. Supports defensive programming**

Perfect for modules that require strict DOM contracts.

---

# Parameters

### `...ids` (string[])

Any number of element IDs.

---

# Returns

**Array** — enhanced elements.
Always valid — no `null`, no `fallback`, no missing values.

If even 1 element is missing → throws.

---

# Throws

```
Error: [DOM Helpers] Required element missing: #elementId
```

---

# Basic Example

```javascript
const [header, main] = Elements.getRequired('header', 'main');

header.update({ classList: ['ready'] });
main.update({ textContent: 'Initialized' });
```

If either ID is missing → the script throws instantly.

---

# Practical Example — Component Setup

```javascript
const [wrapper, title, button] = Elements.getRequired(
  'profileWrapper',
  'profileTitle',
  'profileButton'
);

wrapper.update({ classList: ['mounted'] });
button.on('click', () => console.log('Saved!'));
```

If *any* of the IDs are missing, you get a clear error.

---

# Example Combined With Strong UI Guarantees

```javascript
try {
  const [modal, closeBtn] = Elements.getRequired('modal', 'closeBtn');
  closeBtn.on('click', () => modal.update({ classList: ['hidden'] }));
} catch (err) {
  console.error(err);
}
```

---

