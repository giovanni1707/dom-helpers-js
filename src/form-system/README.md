# DOM Helpers - Form System

**Version:** 2.0.0
**License:** MIT

Complete form handling system with value extraction, validation, enhanced submission, and reactive form bridge.

---

## Quick Start

```html
<script src="form-core.js"></script>
<script src="form-validation.js"></script>
<script src="form-enhancements.js"></script>
<script src="form.js"></script>

<form id="myForm">
  <input name="email" type="email" required>
  <input name="password" type="password">
  <button type="submit">Submit</button>
</form>

<script>
  // Access form by ID
  const form = Forms.myForm;

  // Get/set values
  console.log(form.values); // { email: '', password: '' }
  form.values = { email: 'user@example.com', password: '123456' };

  // Validate
  const result = form.validate({
    email: Forms.v.email(),
    password: Forms.v.minLength(8, 'Password must be 8+ characters')
  });

  // Submit with enhancements
  form.submitData({
    onSuccess: (result) => console.log('Success!', result),
    onError: (error) => console.error('Error:', error),
    resetOnSuccess: true
  });
</script>
```

---

## Features

✅ **Proxy-based form access** - `Forms.formId` syntax
✅ **Value extraction/setting** - Get/set all form values as objects
✅ **10+ built-in validators** - Email, required, length, pattern, etc.
✅ **Enhanced submission** - Loading states, retry logic, visual feedback
✅ **Reactive bridge** - Connect DOM forms with ReactiveUtils
✅ **Automatic caching** - MutationObserver-based smart caching
✅ **Serialization** - Multiple formats (object, JSON, FormData, URLencoded)
✅ **Declarative** - Data attributes for configuration
✅ **Zero dependencies** - Works standalone

---

## Installation

### Option 1: Load All Features

```html
<script src="form-core.js"></script>
<script src="form-validation.js"></script>
<script src="form-enhancements.js"></script>
<script src="form.js"></script>
```

### Option 2: Core Only

```html
<script src="form-core.js"></script>
```

### Option 3: ES6 Modules

```javascript
import Forms from './form.js';
```

---

## Module Structure

```
src/form-system/
├── form-core.js           ~500 lines, ~16 KB  Core handling
├── form-validation.js     ~450 lines, ~14 KB  Validation
├── form-enhancements.js   ~650 lines, ~21 KB  Enhancements
└── form.js                ~500 lines, ~16 KB  Unified entry
```

---

## Core Features

### 1. Form Access

```javascript
// Access by ID (proxy-based)
const myForm = Forms.myForm;
const loginForm = Forms.loginForm;

// Check if form exists
if ('myForm' in Forms) {
  console.log('Form exists');
}

// Get all forms
const allForms = Forms.getAllForms();

// Direct access
const form = Forms.helper._getForm('myForm');
```

### 2. Value Extraction & Setting

```javascript
// Get all values
const values = form.values;
// { name: 'John', email: 'john@example.com', subscribe: true }

// Set all values
form.values = {
  name: 'Jane',
  email: 'jane@example.com',
  subscribe: false
};

// Get specific field
const email = form.getField('email').value;

// Set specific field
form.setField('email', 'new@example.com');
```

### 3. Serialization

```javascript
// As object (default)
const obj = form.serialize('object');
// { name: 'John', email: 'john@example.com' }

// As JSON string
const json = form.serialize('json');
// '{"name":"John","email":"john@example.com"}'

// As FormData
const formData = form.serialize('formdata');
// FormData object

// As URLencoded
const urlencoded = form.serialize('urlencoded');
// 'name=John&email=john%40example.com'

// Shortcuts
form.toJSON();
form.toFormData();
form.toURLEncoded();
```

### 4. Form Update Method

```javascript
// Update values
form.update({
  values: { name: 'John', email: 'john@example.com' }
});

// Reset form
form.update({ reset: true });

// Combined
form.update({
  values: { name: 'Jane' },
  className: 'form-updated',
  'data-status': 'modified'
});
```

---

## Validation

### Built-in Validators

```javascript
const { v } = Forms; // Shortcut to validators

// Required
v.required('This field is required')

// Email
v.email('Invalid email address')

// Length
v.minLength(8, 'Must be at least 8 characters')
v.maxLength(100, 'Must be at most 100 characters')

// Numeric
v.min(18, 'Must be at least 18')
v.max(100, 'Must be at most 100')
v.number('Must be a number')
v.integer('Must be an integer')

// Pattern
v.pattern(/^[A-Z]/, 'Must start with uppercase')

// Match another field
v.match('password', 'Passwords must match')

// URL
v.url('Invalid URL')

// Custom
v.custom((value, values, field) => {
  return value === 'admin' ? true : 'Invalid value';
})
```

### Form Validation

```javascript
// Validate entire form
const result = form.validate({
  email: Forms.v.email(),
  password: Forms.v.minLength(8),
  confirmPassword: Forms.v.match('password')
});

if (result.isValid) {
  console.log('Valid!', result.values);
} else {
  console.log('Errors:', result.errors);
  // { password: 'Must be at least 8 characters' }
}
```

### Field-level Validation

```javascript
// Validate single field
const fieldResult = form.validateField('email', Forms.v.email());

if (!fieldResult.isValid) {
  console.log(fieldResult.error);
}
```

### Object-based Rules

```javascript
// Instead of validator functions, use objects
const result = form.validate({
  email: {
    required: true,
    email: true,
    message: 'Please enter a valid email'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[A-Z])/,
    custom: (value) => value !== '12345678' ? true : 'Weak password'
  }
});
```

### Clear Validation

```javascript
// Clear all validation messages
form.clearValidation();

// Programmatically mark field as invalid
Forms.validation.markFieldInvalid(field, 'Custom error message');

// Clear specific field
Forms.validation.clearFieldValidation(field);
```

---

## Enhanced Submission

### Basic Submission

```javascript
// Submit with default fetch
form.submitData({
  url: '/api/submit',
  method: 'POST',
  onSuccess: (result, values) => {
    console.log('Success!', result);
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});
```

### Advanced Options

```javascript
form.submitData({
  // Custom submit handler
  onSubmit: async (values, form) => {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    return await response.json();
  },

  // Transform values before submit
  transform: (values) => {
    return {
      ...values,
      timestamp: Date.now()
    };
  },

  // Validate before submit
  validate: true,
  validationRules: {
    email: Forms.v.email(),
    password: Forms.v.minLength(8)
  },

  // Hooks
  beforeSubmit: async (values, form) => {
    console.log('About to submit:', values);
    return true; // Return false to cancel
  },

  onSuccess: (result, values) => {
    console.log('Submitted successfully!', result);
  },

  onError: (error) => {
    console.error('Submission failed:', error);
  },

  // Auto-reset after success
  resetOnSuccess: true,

  // Messages
  successMessage: 'Form submitted successfully!',
  errorMessage: 'Submission failed. Please try again.',

  // Retry logic
  retryAttempts: 3,
  retryDelay: 1000, // ms

  // Loading states
  autoDisableButtons: true,
  showLoadingStates: true,
  loadingText: 'Submitting...',
  loadingSpinner: '⌛'
});
```

### Visual Feedback

```javascript
// Manual success/error states
Forms.enhancements.showSuccess(form, 'Operation successful!');
Forms.enhancements.showError(form, 'Operation failed!');

// CSS classes added automatically:
// - form-loading (during submission)
// - form-success (on success)
// - form-error (on error)
// - button-loading (on submit buttons)
```

### Event Lifecycle

```javascript
// Listen to submission events
form.addEventListener('formsubmitstart', (e) => {
  console.log('Submission started', e.detail);
});

form.addEventListener('formsubmitsuccess', (e) => {
  console.log('Submission successful', e.detail.message);
});

form.addEventListener('formsubmiterror', (e) => {
  console.error('Submission error', e.detail.error);
});

form.addEventListener('formreset', (e) => {
  console.log('Form reset', e.detail);
});
```

---

## Declarative Forms

Use data attributes for configuration:

```html
<form id="contactForm"
      data-enhanced
      data-submit-url="/api/contact"
      data-submit-method="POST"
      data-success-message="Message sent!"
      data-error-message="Failed to send"
      data-reset-on-success
      data-message-position="start">

  <input name="name" required>
  <input name="email" type="email" required>
  <textarea name="message"></textarea>
  <button type="submit">Send</button>
</form>
```

**Attributes:**
- `data-enhanced` - Enable auto-enhancement
- `data-submit-url` - Submission endpoint
- `data-submit-method` - HTTP method (POST, PUT, etc.)
- `data-success-message` - Success message
- `data-error-message` - Error message
- `data-reset-on-success` - Reset form after success
- `data-message-position` - `start` or `end`
- `data-auto-disable="false"` - Disable button auto-disable
- `data-show-loading="false"` - Disable loading states
- `data-allow-default` - Allow default form submission

---

## Reactive Form Bridge

Connect DOM forms with ReactiveUtils forms:

```javascript
// Create reactive form
const reactiveForm = ReactiveUtils.createForm({
  initialValues: { email: '', password: '' },
  validators: {
    email: (value) => /@/.test(value) ? true : 'Invalid email',
    password: (value) => value.length >= 8 ? true : 'Too short'
  }
});

// Connect to DOM form
const connection = Forms.myForm.connectReactive(reactiveForm, {
  syncOnInput: true,    // Sync on input events
  syncOnBlur: true,     // Sync on blur (for validation)
  autoSyncReactive: true // Two-way sync
});

// Now DOM and Reactive forms are synchronized
// DOM changes → Reactive state
// Reactive state → DOM updates
// Reactive errors → DOM error display

// Disconnect when done
connection.disconnect();
```

---

## Global Configuration

```javascript
// Configure enhancements globally
Forms.enhancements.configure({
  autoPreventDefault: true,
  autoDisableButtons: true,
  showLoadingStates: true,
  loadingText: 'Please wait...',
  loadingSpinner: '⏳',
  messageTimeout: 5000,
  retryAttempts: 2,
  retryDelay: 1500,
  enableLogging: true
});

// Configure helper
Forms.configure({
  enableLogging: true,
  maxCacheSize: 1000,
  cleanupInterval: 60000
});
```

---

## Utility Methods

```javascript
// Get all forms
const allForms = Forms.getAllForms();

// Validate all forms
const allResults = Forms.validateAll({
  myForm: { email: Forms.v.email() },
  contactForm: { name: Forms.v.required() }
});

// Reset all forms
Forms.resetAll();

// Clear cache
Forms.clear();

// Get stats
const stats = Forms.stats();
// { hits: 45, misses: 5, cacheSize: 12, hitRate: 0.9 }

// Destroy (cleanup)
Forms.destroy();
```

---

## Examples

### Login Form

```javascript
const loginForm = Forms.loginForm;

loginForm.submitData({
  validationRules: {
    email: Forms.v.email('Please enter a valid email'),
    password: Forms.v.minLength(8, 'Password must be at least 8 characters')
  },

  onSubmit: async (values) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    return await response.json();
  },

  onSuccess: (result) => {
    // Store token
    localStorage.setItem('token', result.token);

    // Redirect
    window.location.href = '/dashboard';
  },

  onError: (error) => {
    console.error('Login failed:', error.message);
  }
});
```

### Registration Form

```javascript
const regForm = Forms.registrationForm;

regForm.validate({
  username: {
    required: true,
    minLength: 3,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Username must be alphanumeric'
  },
  email: Forms.v.email(),
  password: Forms.v.minLength(8),
  confirmPassword: Forms.v.match('password', 'Passwords must match'),
  terms: Forms.v.required('You must accept the terms')
});

regForm.submitData({
  url: '/api/register',
  successMessage: 'Registration successful! Redirecting...',
  resetOnSuccess: true,

  onSuccess: (result) => {
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }
});
```

### Contact Form

```javascript
const contactForm = Forms.contactForm;

contactForm.update({
  values: {
    name: currentUser.name,
    email: currentUser.email
  }
});

contactForm.submitData({
  validationRules: {
    name: Forms.v.required(),
    email: Forms.v.email(),
    message: Forms.v.minLength(10, 'Message too short')
  },

  transform: (values) => ({
    ...values,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  }),

  successMessage: 'Message sent! We\'ll get back to you soon.',
  resetOnSuccess: true,

  retryAttempts: 3,
  retryDelay: 1000
});
```

---

## API Reference

### Forms Object

```javascript
Forms.myForm                    // Access form by ID
Forms.getAllForms()             // Get all forms
Forms.validateAll(rules)        // Validate all forms
Forms.resetAll()                // Reset all forms
Forms.clear()                   // Clear cache
Forms.stats()                   // Get statistics
Forms.destroy()                 // Cleanup
Forms.configure(options)        // Configure helper
```

### Form Instance

```javascript
form.values                     // Get/set all values
form.getField(name)             // Get field element
form.setField(name, value)      // Set field value
form.serialize(format)          // Serialize form
form.toJSON()                   // Serialize as JSON
form.toFormData()               // Serialize as FormData
form.toURLEncoded()             // Serialize as URLencoded
form.validate(rules)            // Validate form
form.validateField(name, rule)  // Validate field
form.clearValidation()          // Clear validation
form.submitData(options)        // Submit with enhancements
form.connectReactive(reactive)  // Connect reactive form
form.configure(options)         // Configure form
form.update(updates)            // Update form
form.reset()                    // Reset form
```

### Validators (Forms.v)

```javascript
Forms.v.required(message)
Forms.v.email(message)
Forms.v.minLength(min, message)
Forms.v.maxLength(max, message)
Forms.v.min(num, message)
Forms.v.max(num, message)
Forms.v.pattern(regex, message)
Forms.v.match(fieldName, message)
Forms.v.url(message)
Forms.v.number(message)
Forms.v.integer(message)
Forms.v.custom(fn)
```

---

## Browser Support

- Modern browsers (ES6+)
- IE11+ (with polyfills for Proxy, Map, WeakMap)

---

## Bundle Size Optimization

**Core Only:** ~16 KB (form-core.js)
**Core + Validation:** ~30 KB (+validation)
**Core + Enhancements:** ~37 KB (+enhancements)
**Full System:** ~67 KB (all features)

**Savings:** Up to 76% by loading only core

---

## License

MIT License - See LICENSE file for details

---

**Version:** 2.0.0
**Last Updated:** December 2025
