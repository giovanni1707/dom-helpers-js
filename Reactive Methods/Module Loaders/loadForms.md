# Understanding `loadForms()` - A Beginner's Guide

## What is `loadForms()`?

`loadForms()` loads the forms module, enabling `Reactive.form()` and validators. Load this when you need form validation features.

Think of it as **forms enabler** - use Reactive.form() and validators.

---

## Why Does This Exist?

### The Problem: Need Forms

You want to use `Reactive.form()` but don't want to load everything:

```javascript
// ❌ Without forms - method doesn't exist
Reactive.loadCore();
const form = Reactive.form({});  // Error!

// ✅ With forms
Reactive.loadCore();
Reactive.loadForms();
const form = Reactive.form({});  // Works!
```

---

## What's Included

Forms module provides:
- `Reactive.form()` - Create reactive forms
- `Reactive.create()` - Alias for form()
- All validators (required, email, minLength, etc.)
- `v` shorthand for validators
- Form methods (submit, reset, validate, etc.)

---

## Basic Usage

```javascript
// Load core + forms
Reactive.loadCore();
Reactive.loadForms();

// Create form with validation
const loginForm = Reactive.form({
  email: ['', v.combine([
    v.required('Email is required'),
    v.email('Invalid email')
  ])],
  password: ['', v.combine([
    v.required('Password is required'),
    v.minLength(8, 'Password must be 8+ characters')
  ])]
});

// Check validation
console.log(loginForm.isValid);
console.log(loginForm.errors);
```

---

## When to Use

### Use `loadForms()` when:
- Need Reactive.form()
- Working with forms
- Need validators
- Building form-heavy apps

### Don't use when:
- No forms in app
- Don't need validation
- Already using loadAll()

---

## Example: Contact Form

```javascript
// Load core + forms
Reactive.loadCore();
Reactive.loadForms();

// Create form
const contactForm = Reactive.form({
  name: ['', v.required('Name is required')],
  email: ['', v.combine([
    v.required('Email is required'),
    v.email('Invalid email format')
  ])],
  message: ['', v.combine([
    v.required('Message is required'),
    v.minLength(10, 'Message must be at least 10 characters')
  ])]
});

// Bind to HTML form
contactForm.bindToInputs('#contact-form');

// Submit handler
async function submitContact(event) {
  event.preventDefault();

  contactForm.submit(async () => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contactForm.values)
    });

    if (response.ok) {
      alert('Message sent!');
      contactForm.reset();
    }
  });
}

// Display validation
Reactive.effect(() => {
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = !contactForm.isValid;
});
```

---

## Available Validators

When you load forms, you get all validators:

```javascript
v.required()       // Required field
v.email()          // Email format
v.minLength(n)     // Minimum length
v.maxLength(n)     // Maximum length
v.min(n)           // Minimum value
v.max(n)           // Maximum value
v.pattern(regex)   // Pattern match
v.match(field)     // Match another field
v.custom(fn)       // Custom validator
v.combine([...])   // Combine validators
```

---

## Summary

### What `loadForms()` Provides:

1. ✅ Reactive.form()
2. ✅ Reactive.create()
3. ✅ All validators
4. ✅ Form methods
5. ✅ Validation utilities

### When to Use It:

- Need forms
- Form validation
- User input handling
- Form-heavy apps

---

**Remember:** Load this when you need Reactive.form() and validators! 🎉
