
---

# `Elements.get(id, fallback)`

This method retrieves an element by ID and returns it **as an enhanced DOM Helpers element**.
If the element doesn’t exist, it returns whatever fallback you provide (or `null` by default).

Think of it as a *safe selector + enhancer*.

---

## What it does conceptually

Internally, the logic is roughly:

```javascript
const el = document.getElementById(id);
if (!el) return fallback ?? null;
return enhanceElement(el); // the core enhancement system
```

So the key behavior is:

* Try to find the element.
* If found → **wrap it with DOM Helpers features** (`.update()`, `.on()`, mapping helpers, etc.).
* If not found → return a custom fallback instead of `null`.

---

## Why this method exists

### **1. Guarantees enhanced elements**

Instead of manually selecting and then calling enhancement:

```javascript
const el = document.getElementById(id);
if (el) enhance(el);
```

You get one clean line:

```javascript
const el = Elements.get('header');
```

### **2. Eliminates null-check boilerplate**

When you expect something may not exist, you don’t want repeated:

```javascript
const el = document.getElementById('x');
if (!el) return something;
```

Instead:

```javascript
const el = Elements.get('x', 'Not found!');
```

### **3. Works nicely with optional UI sections**

Common for conditional rendering, dynamic modules, admin pages, etc.

### **4. Lets you define *your own* missing-element behavior**

Can be anything:
a new element → a string → `false` → an object → custom error type → etc.

---

# Parameters

### `id` (string)

The target element’s **ID** (no `#`, just `"header"`).

### `fallback` (any, optional)

Returned if the element does **not exist**.
Default: `null`.

---

# Return value

* Returns **enhanced HTMLElement** if found.
* Returns **fallback** if not found.

---

# Basic Example

```javascript
const button = Elements.get('submitBtn', document.createElement('button'));
console.log(button); 
```

If `submitBtn` exists → you get the enhanced element.
If not → you get a new `<button>` element.

---

# Practical Example With DOM Helpers Behavior

Assume you want to update an element *only if it exists*, otherwise return something harmless.

```javascript
const card = Elements.get('productCard', { error: 'Card missing' });

if (card.update) {
  // Element exists and is enhanced
  card.update({
    classList: ['loaded'],
    textContent: 'Product Ready'
  });
} else {
  console.warn(card.error); // fallback object
}
```

---

# Example using default fallback (null)

```javascript
const missing = Elements.get('notHere'); 
// missing === null
```

---

# Real-world usage inside apps

### **Lazy UI mounting**

```javascript
const container = Elements.get('dashboard-root', false);
if (!container) return;

container.update({
  textContent: 'Dashboard Loaded'
});
```

### **Dynamic component injection**

```javascript
const wrapper = Elements.get('modalWrapper', document.body);
wrapper.appendChild(renderModal());
```

---
