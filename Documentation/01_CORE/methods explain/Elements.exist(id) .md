
## `Elements.exists(id)` — What it does

This method gives you a **fast, zero-overhead way to confirm that an element with a specific ID exists** in the current DOM.
It avoids queries through `Elements.get()` or `Selector.query()`, which are designed for enhanced element objects.
Instead, it performs a lightweight lookup so you can branch logic safely *before* doing anything expensive.

---

## How it works (conceptually within the library)

Under the hood, it essentially does something equivalent to:

```javascript
return document.getElementById(id) !== null;
```

But wrapped in the `Elements` namespace for three reasons:

### 1. **Consistency**

Instead of mixing raw DOM APIs with the DOM Helpers API, you keep your code unified:

```javascript
if (Elements.exists('nav')) { ... }
```

### 2. **Avoid unnecessary enhancement**

`Elements.get()` returns an **enhanced element** (with `.update()`, `.on()`, etc.).
For simple existence checks, that’s overkill.
`exists()` skips enhancement and simply checks presence.

### 3. **Predictable boolean result**

You always get a strict boolean (`true`/`false`), not an element or `null`.

---

## When you use it

You typically call this method when you want to:

### ✔ Prevent runtime errors

Example: avoid `.update()` calls on missing nodes.

```javascript
if (Elements.exists('sidebar')) {
  Elements.get('sidebar').update({ textContent: 'Loaded' });
}
```

### ✔ Conditionally initialize components

Example: Only mount your widget if the container exists.

```javascript
if (Elements.exists('carousel-root')) {
  initCarousel();
}
```

### ✔ Guard optional UI sections

Example: Admin-only sections, modals, injected components, etc.

---

## Example (simple)

```javascript
if (Elements.exists('header')) {
  console.log('Header found!');
} else {
  console.log('Header missing.');
}
```

---

## Example (practical inside a real DOM Helpers workflow)

```javascript
if (Elements.exists('user-profile')) {
  const profile = Elements.get('user-profile');

  profile.update({
    classList: ['active'],
    textContent: 'Profile Loaded'
  });
}
```

This demonstrates the typical pattern:

* **Check fast**
* **Retrieve enhanced element only if safe**
* **Update using DOM Helpers features**

---