# Understanding `bind()` (Builder) - A Beginner's Guide

## What is `bind()`?

`bind()` is a builder method that creates two-way bindings between state and DOM elements. Changes sync automatically in both directions.

Think of it as **two-way binding builder** - connect state and DOM while building.

---

## Why Does This Exist?

### The Problem: Manual DOM Sync

Without bind, you manually sync state and DOM:

```javascript
// ❌ Manual sync - tedious
const state = Reactive.state({ name: '' });

const input = document.getElementById('name');
input.value = state.name;
input.oninput = (e) => state.name = e.target.value;

Reactive.effect(() => {
  input.value = state.name;
});

// ✅ With bind - automatic
const state = Reactive.builder()
  .state({ name: '' })
  .bind('name', '#name')
  .build();
```

**Why this matters:**
- Automatic two-way sync
- Less code
- No manual event handlers
- Cleaner setup

---

## How Does It Work?

### The Binding

```javascript
Reactive.builder()
  .state({ value: '' })
  .bind('value', '#input')  // Binds state.value to #input
  .build();
```

---

## Basic Usage

### Bind Input

```javascript
const state = Reactive.builder()
  .state({ username: '' })
  .bind('username', '#username-input')
  .build();

// Type in input → state.username updates
// state.username = 'John' → input updates
```

### Multiple Bindings

```javascript
const form = Reactive.builder()
  .state({
    email: '',
    password: ''
  })
  .bind('email', '#email')
  .bind('password', '#password')
  .build();
```

### Bind Checkbox

```javascript
const settings = Reactive.builder()
  .state({ notifications: false })
  .bind('notifications', '#notifications-checkbox')
  .build();

// Check box → state.notifications = true
// state.notifications = false → box unchecks
```

---

## Simple Examples Explained

### Example 1: Live Preview

```javascript
const editor = Reactive.builder()
  .state({
    title: '',
    content: ''
  })
  .bind('title', '#title-input')
  .bind('content', '#content-textarea')
  .effect(() => {
    document.getElementById('preview-title').textContent = editor.title;
    document.getElementById('preview-content').textContent = editor.content;
  })
  .build();

// Type in inputs → preview updates automatically
```

---

### Example 2: Settings Form

```javascript
const settings = Reactive.builder()
  .state({
    theme: 'light',
    fontSize: 16,
    autoSave: true
  })
  .bind('theme', '#theme-select')
  .bind('fontSize', '#font-size-input')
  .bind('autoSave', '#auto-save-checkbox')
  .effect(() => {
    document.body.className = `theme-${settings.theme}`;
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
  })
  .build();

// Change inputs → settings update → UI updates
```

---

### Example 3: Calculator

```javascript
const calc = Reactive.builder()
  .state({
    num1: 0,
    num2: 0
  })
  .bind('num1', '#num1')
  .bind('num2', '#num2')
  .computed('sum', (s) => Number(s.num1) + Number(s.num2))
  .computed('product', (s) => Number(s.num1) * Number(s.num2))
  .effect(() => {
    document.getElementById('sum').textContent = calc.sum;
    document.getElementById('product').textContent = calc.product;
  })
  .build();

// Type numbers → results update automatically
```

---

## Real-World Example: User Profile Form

```javascript
const profile = Reactive.builder()
  .state({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    newsletter: false,
    country: 'US'
  })
  .bind('firstName', '#first-name')
  .bind('lastName', '#last-name')
  .bind('email', '#email')
  .bind('bio', '#bio')
  .bind('newsletter', '#newsletter')
  .bind('country', '#country')
  .computed('fullName', (s) => `${s.firstName} ${s.lastName}`.trim())
  .computed('isValid', (s) =>
    s.firstName && s.lastName && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)
  )
  .effect(() => {
    document.getElementById('full-name-display').textContent =
      profile.fullName || 'Not set';
  })
  .effect(() => {
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = !profile.isValid;
  })
  .effect(() => {
    const charCount = profile.bio.length;
    document.getElementById('bio-count').textContent = `${charCount}/500`;
  })
  .build();

// Load saved profile
const saved = localStorage.getItem('profile');
if (saved) {
  Object.assign(profile, JSON.parse(saved));
}

// Save button
document.getElementById('save-btn').onclick = () => {
  localStorage.setItem('profile', JSON.stringify({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    bio: profile.bio,
    newsletter: profile.newsletter,
    country: profile.country
  }));
  alert('Profile saved!');
};
```

---

## Common Patterns

### Pattern 1: Text Input

```javascript
.bind('value', '#input')
```

### Pattern 2: Checkbox

```javascript
.bind('checked', '#checkbox')
```

### Pattern 3: Select Dropdown

```javascript
.bind('selected', '#select')
```

### Pattern 4: Multiple Bindings

```javascript
.bind('field1', '#input1')
.bind('field2', '#input2')
.bind('field3', '#input3')
```

---

## Common Questions

### Q: Does it work with all input types?

**Answer:** Yes! Text, checkbox, radio, select, textarea:

```javascript
.bind('text', '#text-input')
.bind('checked', '#checkbox')
.bind('selected', '#select')
```

### Q: Is it two-way?

**Answer:** Yes! State → DOM and DOM → State:

```javascript
state.value = 'Hello'; // Updates input
// Type in input → updates state.value
```

### Q: Can I bind multiple fields to same element?

**Answer:** No, one property per element:

```javascript
// ✅ Each field to different element
.bind('email', '#email')
.bind('password', '#password')
```

---

## Tips for Success

### 1. Bind Early in Builder

```javascript
// ✅ Bind before effects
.state({ value: '' })
.bind('value', '#input')
.effect(() => ...)
.build()
```

### 2. Use with Computed

```javascript
// ✅ Combine with computed
.bind('input', '#input')
.computed('output', (s) => s.input.toUpperCase())
.effect(() => display(state.output))
```

### 3. One Binding Per Property

```javascript
// ✅ One field, one element
.bind('email', '#email')

// ❌ Don't bind same property twice
.bind('email', '#email1')
.bind('email', '#email2') // Don't do this
```

---

## Summary

### What `bind()` Does:

1. ✅ Creates two-way binding
2. ✅ Takes property name and selector
3. ✅ Syncs state ↔ DOM automatically
4. ✅ Returns builder for chaining
5. ✅ Works with all input types

### When to Use It:

- Form inputs
- Settings panels
- Live previews
- Any two-way sync
- Interactive UIs

### The Basic Pattern:

```javascript
const state = Reactive.builder()
  .state({ value: '' })
  .bind('value', '#input')
  .build();

// Two-way sync:
// Type in #input → state.value updates
// state.value = 'Hi' → #input updates
```

---

**Remember:** `bind()` creates automatic two-way sync between state and DOM. No manual event handlers needed! 🎉
