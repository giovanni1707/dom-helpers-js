# AutoSave Options Properties

Complete documentation for options available when using `form.autoSave()` in the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Options Reference](#options-reference)
   - [storage](#storage)
   - [interval](#interval)
   - [events](#events)
   - [namespace](#namespace)
   - [expires](#expires)
3. [Complete Options Object](#complete-options-object)
4. [Use Cases](#use-cases)
5. [Examples](#examples)
6. [Best Practices](#best-practices)
7. [Option Combinations](#option-combinations)

---

## Overview

When enabling auto-save for forms using `form.autoSave(storageKey, options)`, you can customize the behavior with various options. These options control where data is stored, how frequently it's saved, which events trigger saves, and how long data persists.

**Key Benefits:**
- 🎛️ **Flexible configuration** - Customize auto-save behavior
- 💾 **Storage control** - Choose localStorage or sessionStorage
- ⚡ **Performance tuning** - Adjust save frequency
- 🎯 **Event control** - Specify which events trigger saves
- 📦 **Organization** - Use namespaces for structured storage
- ⏰ **Automatic expiry** - Set draft expiration times

---

## Options Reference

### storage

Specify which Web Storage API to use for storing form data.

#### Type

**`string`**

#### Values

- `'localStorage'` - Persistent storage (survives browser restart)
- `'sessionStorage'` - Temporary storage (cleared when tab closes)

#### Default

`'localStorage'`

#### Description

Determines where form data is saved. Use localStorage for drafts that should persist across sessions, or sessionStorage for temporary data that should be cleared when the tab closes.

#### Examples

```javascript
// Use localStorage (default - persistent)
Forms.contactForm.autoSave('contact-draft');

// Explicitly use localStorage
Forms.articleForm.autoSave('article-draft', {
  storage: 'localStorage'
});

// Use sessionStorage (temporary)
Forms.searchForm.autoSave('search-query', {
  storage: 'sessionStorage'
});

// Wizard form - session only
Forms.wizardForm.autoSave('wizard-progress', {
  storage: 'sessionStorage'
});
```

#### When to Use Each

**localStorage:**
- Blog post drafts
- Application forms
- Settings changes
- Long-term drafts
- Data that should survive browser restart

**sessionStorage:**
- Search queries
- Wizard/multi-step forms
- Temporary form data
- Session-specific data
- Data that should be cleared on tab close

---

### interval

Set the debounce delay before saving form data.

#### Type

**`number`**

#### Unit

Milliseconds

#### Default

`1000` (1 second)

#### Description

Debounce interval controls how long to wait after the last user input before actually saving the data. This prevents excessive storage operations while the user is actively typing.

#### Range

- Minimum: `0` (immediate save, not recommended)
- Typical: `500` - `3000` (0.5 to 3 seconds)
- Maximum: Any positive number

#### Examples

```javascript
// Default (1 second)
Forms.contactForm.autoSave('draft');

// Fast save (500ms)
Forms.paymentForm.autoSave('payment-draft', {
  interval: 500
});

// Moderate save (1.5 seconds)
Forms.feedbackForm.autoSave('feedback-draft', {
  interval: 1500
});

// Slow save (3 seconds)
Forms.articleForm.autoSave('article-draft', {
  interval: 3000
});

// Immediate save (not recommended - performance impact)
Forms.criticalForm.autoSave('critical-draft', {
  interval: 0
});
```

#### Performance Considerations

```javascript
// Too frequent - may impact performance
interval: 100  // Saves every 100ms ❌

// Good balance - responsive but efficient
interval: 1000 // Saves every 1 second ✅

// Conservative - less frequent saves
interval: 3000 // Saves every 3 seconds ✅

// Too slow - user may lose more data
interval: 10000 // Saves every 10 seconds ⚠️
```

---

### events

Specify which DOM events trigger auto-save.

#### Type

**`Array<string>`**

#### Default

`['input', 'change']`

#### Description

Array of event names that will trigger the debounced auto-save. Common events include `'input'`, `'change'`, `'blur'`, and `'keyup'`.

#### Common Events

- `'input'` - Fires on every keystroke (text inputs, textareas)
- `'change'` - Fires when value changes and element loses focus
- `'blur'` - Fires when element loses focus
- `'keyup'` - Fires when key is released
- `'keydown'` - Fires when key is pressed

#### Examples

```javascript
// Default (input and change)
Forms.contactForm.autoSave('draft');

// Input only (most responsive)
Forms.textEditor.autoSave('draft', {
  events: ['input']
});

// Change only (less frequent)
Forms.settingsForm.autoSave('settings', {
  events: ['change']
});

// Input and blur (save on type and focus loss)
Forms.commentForm.autoSave('comment-draft', {
  events: ['input', 'blur']
});

// Multiple events for comprehensive coverage
Forms.applicationForm.autoSave('app-draft', {
  events: ['input', 'change', 'blur']
});

// Keyup for custom behavior
Forms.searchForm.autoSave('search-history', {
  events: ['keyup']
});
```

#### Event Behavior

```javascript
// 'input' - Best for text fields
// Triggers: Every character typed
<input type="text" name="name">
// User types "Hello" → 5 debounced saves triggered

// 'change' - Best for selects, checkboxes, radios
// Triggers: When value changes and loses focus
<select name="country">
// User selects option → Save triggered on selection

// 'blur' - Best for ensuring save on focus loss
// Triggers: When user clicks outside field
<textarea name="message">
// User types, then clicks elsewhere → Save triggered
```

---

### namespace

Organize form data within a storage namespace.

#### Type

**`string`**

#### Default

`''` (empty string - no namespace)

#### Description

Namespace creates an isolated storage area for the form data, prefixing the storage key with the namespace. Useful for organizing multiple forms or preventing key conflicts.

#### Format

Stored key becomes: `namespace:storageKey`

#### Examples

```javascript
// No namespace (global storage)
Forms.contactForm.autoSave('contact-draft');
// Stored as: 'contact-draft'

// With namespace
Forms.contactForm.autoSave('draft', {
  namespace: 'forms:contact'
});
// Stored as: 'forms:contact:draft'

// Blog posts namespace
Forms.postEditor.autoSave('draft', {
  namespace: 'blog:posts'
});
// Stored as: 'blog:posts:draft'

// User-specific namespace
const userId = getCurrentUserId();
Forms.profileForm.autoSave('profile', {
  namespace: `user:${userId}`
});
// Stored as: 'user:123:profile'

// Nested namespace
Forms.surveyForm.autoSave('responses', {
  namespace: 'surveys:satisfaction'
});
// Stored as: 'surveys:satisfaction:responses'
```

#### Organization Strategies

```javascript
// By feature
Forms.loginForm.autoSave('draft', { namespace: 'auth' });
Forms.registerForm.autoSave('draft', { namespace: 'auth' });

// By module
Forms.checkoutForm.autoSave('draft', { namespace: 'ecommerce:checkout' });
Forms.cartForm.autoSave('draft', { namespace: 'ecommerce:cart' });

// By user
Forms.preferencesForm.autoSave('prefs', { 
  namespace: `users:${userId}` 
});

// By type
Forms.draftPost.autoSave('draft', { namespace: 'drafts:posts' });
Forms.draftComment.autoSave('draft', { namespace: 'drafts:comments' });
```

---

### expires

Set expiration time for the saved form data.

#### Type

**`number | Date`**

#### Default

No expiration (data persists until manually removed)

#### Description

Automatically expire saved form data after a specified time. Accepts either seconds (number) or a specific date (Date object). Inherited from the storage module's `set()` options.

#### Format

- **`number`**: Expiry time in **seconds** from now
- **`Date`**: Specific expiration date/time

#### Examples

```javascript
// Expire in 1 hour (3600 seconds)
Forms.contactForm.autoSave('draft', {
  expires: 3600
});

// Expire in 24 hours
Forms.applicationForm.autoSave('draft', {
  expires: 86400
});

// Expire in 7 days
Forms.articleForm.autoSave('draft', {
  expires: 604800
});

// Expire at specific date
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
Forms.eventForm.autoSave('draft', {
  expires: tomorrow
});

// Expire at midnight
const midnight = new Date();
midnight.setHours(24, 0, 0, 0);
Forms.dailyForm.autoSave('draft', {
  expires: midnight
});

// No expiry (default)
Forms.settingsForm.autoSave('draft');
```

#### Common Expiry Times

```javascript
const EXPIRY = {
  HOUR: 3600,
  SIX_HOURS: 21600,
  DAY: 86400,
  WEEK: 604800,
  MONTH: 2592000
};

// Use constants
Forms.draftForm.autoSave('draft', {
  expires: EXPIRY.DAY
});
```

---

## Complete Options Object

### Full Syntax

```javascript
form.autoSave(storageKey, {
  storage: 'localStorage' | 'sessionStorage',  // Default: 'localStorage'
  interval: number,                             // Default: 1000 (ms)
  events: Array<string>,                        // Default: ['input', 'change']
  namespace: string,                            // Default: ''
  expires: number | Date                        // Default: no expiration
})
```

### Default Values

```javascript
{
  storage: 'localStorage',
  interval: 1000,
  events: ['input', 'change'],
  namespace: '',
  expires: undefined
}
```

### Minimal Example

```javascript
// Using all defaults
Forms.myForm.autoSave('draft');
```

### Complete Example

```javascript
// Custom configuration
Forms.articleForm.autoSave('draft', {
  storage: 'localStorage',
  interval: 2000,
  events: ['input', 'change', 'blur'],
  namespace: 'blog:articles',
  expires: 604800  // 7 days
});
```

---

## Use Cases

### 1. Contact Form (Simple)

```javascript
// Basic contact form with persistence
Forms.contactForm.autoSave('contact-draft', {
  interval: 1000,
  expires: 86400  // 24 hours
});
```

### 2. Blog Editor (Comprehensive)

```javascript
// Full-featured blog post editor
Forms.postEditor.autoSave('draft', {
  storage: 'localStorage',      // Persist across sessions
  interval: 2000,                // Save every 2 seconds
  events: ['input', 'blur'],     // Save on type and focus loss
  namespace: 'blog:posts',       // Organized storage
  expires: 604800                // Keep for 7 days
});
```

### 3. Checkout Form (Session)

```javascript
// Checkout form cleared on tab close
Forms.checkoutForm.autoSave('checkout-data', {
  storage: 'sessionStorage',     // Temporary only
  interval: 500,                 // Fast save
  events: ['input', 'change'],   // Multiple triggers
  namespace: 'ecommerce'
});
```

### 4. Survey Form (Focused)

```javascript
// Survey with specific event handling
Forms.surveyForm.autoSave('responses', {
  storage: 'sessionStorage',
  interval: 1000,
  events: ['change'],            // Save only on value change
  namespace: 'surveys',
  expires: 3600                  // 1 hour expiry
});
```

### 5. Application Form (Long-term)

```javascript
// Job application with extended persistence
Forms.applicationForm.autoSave('application', {
  storage: 'localStorage',
  interval: 1500,
  events: ['input', 'change', 'blur'],
  namespace: 'careers:applications',
  expires: 2592000               // 30 days
});
```

---

## Examples

### Example 1: Responsive Text Editor

```javascript
// Blog post editor with aggressive saving
Forms.postEditor.autoSave('post-draft', {
  storage: 'localStorage',
  interval: 500,                 // Very responsive
  events: ['input', 'blur'],     // Save on type and focus change
  namespace: 'blog',
  expires: 604800
});

// Visual feedback
let saveTimeout;
Forms.postEditor.addEventListener('input', () => {
  clearTimeout(saveTimeout);
  
  document.getElementById('saveStatus').textContent = 'Saving...';
  
  saveTimeout = setTimeout(() => {
    document.getElementById('saveStatus').textContent = 'All changes saved';
  }, 600); // Slightly longer than interval
});
```

### Example 2: Multi-step Form Wizard

```javascript
// Wizard form with session storage
Forms.wizardForm.autoSave('wizard-progress', {
  storage: 'sessionStorage',     // Clear on tab close
  interval: 1000,
  events: ['input', 'change'],
  namespace: 'wizard'
});

// Step tracking
function goToStep(stepNumber) {
  Storage.session.set('wizard:currentStep', stepNumber, {
    namespace: 'wizard'
  });
}

// Restore on page load
window.addEventListener('load', () => {
  Forms.wizardForm.restore('wizard-progress', {
    storage: 'sessionStorage',
    namespace: 'wizard'
  });
  
  const step = Storage.session.get('wizard:currentStep', 1);
  goToStep(step);
});
```

### Example 3: Critical Payment Form

```javascript
// Payment form with fast, comprehensive saving
Forms.paymentForm.autoSave('payment-draft', {
  storage: 'sessionStorage',     // Never persist payment data long-term
  interval: 300,                 // Very fast save
  events: ['input', 'change', 'blur'], // All possible events
  namespace: 'payment',
  expires: 900                   // 15 minutes max
});

// Clear on successful submission
Forms.paymentForm.on('submit', async (e) => {
  e.preventDefault();
  
  const success = await processPayment(Forms.paymentForm.values);
  
  if (success) {
    Forms.paymentForm.clearAutoSave();
    // Also clear namespace
    Storage.session.namespace('payment').clear();
  }
});
```

### Example 4: Survey with Event-specific Behavior

```javascript
// Survey form with different behaviors for different events
Forms.surveyForm.autoSave('survey-responses', {
  storage: 'sessionStorage',
  interval: 2000,
  events: ['change', 'blur'],    // Only on value change or focus loss
  namespace: 'surveys:customer',
  expires: 7200                  // 2 hours
});

// Progress indicator
const totalQuestions = document.querySelectorAll('.question').length;

Forms.surveyForm.addEventListener('change', () => {
  const answered = Object.keys(Forms.surveyForm.values).length;
  const progress = Math.round((answered / totalQuestions) * 100);
  
  document.getElementById('progress').textContent = `${progress}% complete`;
});
```

### Example 5: Per-user Form Configuration

```javascript
// User-specific form auto-save
class UserFormAutoSave {
  constructor(form, formKey) {
    this.form = form;
    this.formKey = formKey;
    this.userId = this.getCurrentUserId();
  }
  
  enable(customOptions = {}) {
    const options = {
      storage: 'localStorage',
      interval: 1000,
      events: ['input', 'change'],
      namespace: `users:${this.userId}:forms`,
      expires: 86400,
      ...customOptions
    };
    
    this.form.autoSave(this.formKey, options);
  }
  
  getCurrentUserId() {
    // Get from session, cookie, or auth system
    return Storage.get('currentUserId', 'guest');
  }
  
  restore() {
    this.form.restore(this.formKey, {
      storage: 'localStorage',
      namespace: `users:${this.userId}:forms`
    });
  }
  
  clear() {
    this.form.clearAutoSave();
  }
}

// Usage
const profileAutoSave = new UserFormAutoSave(Forms.profileForm, 'profile');

// Enable with user-specific namespace
profileAutoSave.enable({
  interval: 1500,
  expires: 604800  // 7 days
});

// Restore user's draft
profileAutoSave.restore();
```

### Example 6: Adaptive Save Frequency

```javascript
// Adjust save frequency based on form complexity
class AdaptiveAutoSave {
  constructor(form, storageKey) {
    this.form = form;
    this.storageKey = storageKey;
    this.fieldCount = form.querySelectorAll('input, textarea, select').length;
  }
  
  enable() {
    // Calculate interval based on form size
    const interval = this.calculateInterval();
    
    this.form.autoSave(this.storageKey, {
      storage: 'localStorage',
      interval: interval,
      events: ['input', 'change', 'blur'],
      expires: 86400
    });
    
    console.log(`Auto-save enabled with ${interval}ms interval for ${this.fieldCount} fields`);
  }
  
  calculateInterval() {
    // More fields = longer interval to reduce saves
    if (this.fieldCount <= 5) {
      return 500;   // Small form - responsive
    } else if (this.fieldCount <= 15) {
      return 1000;  // Medium form - balanced
    } else if (this.fieldCount <= 30) {
      return 2000;  // Large form - conservative
    } else {
      return 3000;  // Very large form - very conservative
    }
  }
}

// Usage
const autoSave = new AdaptiveAutoSave(Forms.applicationForm, 'app-draft');
autoSave.enable();
```

---

## Best Practices

### 1. Choose Appropriate Storage Type

```javascript
// Good: Persistent data in localStorage
Forms.articleForm.autoSave('draft', {
  storage: 'localStorage'
});

// Good: Temporary data in sessionStorage
Forms.searchForm.autoSave('query', {
  storage: 'sessionStorage'
});

// Avoid: Payment data in localStorage
Forms.paymentForm.autoSave('payment', {
  storage: 'localStorage'  // ❌ Security risk!
});

// Better: Use sessionStorage for sensitive data
Forms.paymentForm.autoSave('payment', {
  storage: 'sessionStorage',  // ✅ Cleared on tab close
  expires: 900  // 15 minutes max
});
```

### 2. Balance Interval with User Experience

```javascript
// Good: Fast interval for critical forms
Forms.checkoutForm.autoSave('draft', {
  interval: 500  // 0.5 seconds
});

// Good: Moderate interval for normal forms
Forms.contactForm.autoSave('draft', {
  interval: 1000  // 1 second (default)
});

// Good: Longer interval for large forms
Forms.applicationForm.autoSave('draft', {
  interval: 2000  // 2 seconds
});

// Avoid: Too fast (performance impact)
Forms.myForm.autoSave('draft', {
  interval: 50  // ❌ Too frequent!
});

// Avoid: Too slow (data loss risk)
Forms.myForm.autoSave('draft', {
  interval: 30000  // ❌ 30 seconds is too long
});
```

### 3. Select Appropriate Events

```javascript
// Good: Input for text fields
Forms.textEditor.autoSave('draft', {
  events: ['input']
});

// Good: Change for selects/radios/checkboxes
Forms.settingsForm.autoSave('settings', {
  events: ['change']
});

// Good: Blur to ensure save on navigation
Forms.multiStepForm.autoSave('draft', {
  events: ['input', 'blur']
});

// Comprehensive coverage
Forms.importantForm.autoSave('draft', {
  events: ['input', 'change', 'blur']
});
```

### 4. Use Namespaces for Organization

```javascript
// Good: Organized by feature
Forms.loginForm.autoSave('draft', {
  namespace: 'auth:login'
});

Forms.registerForm.autoSave('draft', {
  namespace: 'auth:register'
});

// Good: Organized by user
Forms.profileForm.autoSave('profile', {
  namespace: `user:${userId}`
});

// Good: Hierarchical organization
Forms.postEditor.autoSave('draft', {
  namespace: 'blog:posts:drafts'
});
```

### 5. Set Appropriate Expiry Times

```javascript
// Good: Short expiry for temporary data
Forms.searchForm.autoSave('query', {
  storage: 'sessionStorage',
  expires: 3600  // 1 hour
});

// Good: Medium expiry for drafts
Forms.contactForm.autoSave('draft', {
  expires: 86400  // 24 hours
});

// Good: Long expiry for important drafts
Forms.articleForm.autoSave('draft', {
  expires: 604800  // 7 days
});

// Good: No expiry for user preferences
Forms.settingsForm.autoSave('settings');
// No expires = persists until manually removed
```

### 6. Document Your Configuration

```javascript
// Good: Clear constants
const AUTO_SAVE_CONFIG = {
  CONTACT_FORM: {
    storage: 'localStorage',
    interval: 1000,
    events: ['input', 'change'],
    expires: 86400
  },
  ARTICLE_EDITOR: {
    storage: 'localStorage',
    interval: 2000,
    events: ['input', 'blur'],
    namespace: 'blog:posts',
    expires: 604800
  },
  CHECKOUT_FORM: {
    storage: 'sessionStorage',
    interval: 500,
    events: ['input', 'change', 'blur'],
    namespace: 'ecommerce',
    expires: 1800
  }
};

// Usage
Forms.contactForm.autoSave('draft', AUTO_SAVE_CONFIG.CONTACT_FORM);
Forms.articleEditor.autoSave('draft', AUTO_SAVE_CONFIG.ARTICLE_EDITOR);
```

### 7. Handle Edge Cases

```javascript
// Good: Warn before page unload
window.addEventListener('beforeunload', (e) => {
  // Check if form has unsaved changes
  const hasDraft = Storage.namespace('blog').has('draft');
  
  if (hasDraft) {
    e.preventDefault();
    e.returnValue = ''; // Required for Chrome
  }
});

// Good: Clear sensitive data on logout
function logout() {
  // Clear all auto-saved sensitive data
  Forms.paymentForm.clearAutoSave();
  Forms.profileForm.clearAutoSave();
  
  // Redirect
  window.location.href = '/login';
}

// Good: Restore with confirmation
if (Storage.has('contact-draft')) {
  const restore = confirm('A draft was found. Would you like to restore it?');
  
  if (restore) {
    Forms.contactForm.restore('contact-draft');
  } else {
    Storage.remove('contact-draft');
  }
}
```

---

## Option Combinations

### Combination 1: Fast, Temporary, Namespaced

```javascript
// Quick-saving session form
Forms.wizardForm.autoSave('progress', {
  storage: 'sessionStorage',
  interval: 500,
  events: ['input', 'change'],
  namespace: 'wizard'
});
```

### Combination 2: Slow, Persistent, Expiring

```javascript
// Long-form with conservative saving
Forms.applicationForm.autoSave('draft', {
  storage: 'localStorage',
  interval: 3000,
  events: ['change', 'blur'],
  namespace: 'careers',
  expires: 2592000  // 30 days
});
```

### Combination 3: Balanced, Organized

```javascript
// Standard blog editor
Forms.postEditor.autoSave('draft', {
  storage: 'localStorage',
  interval: 2000,
  events: ['input', 'blur'],
  namespace: 'blog:posts',
  expires: 604800
});
```

### Combination 4: Secure, Short-lived

```javascript
// Sensitive payment form
Forms.paymentForm.autoSave('payment-temp', {
  storage: 'sessionStorage',
  interval: 300,
  events: ['input', 'change', 'blur'],
  namespace: 'payment',
  expires: 900  // 15 minutes
});
```

---

## Summary

**Complete Options:**

```javascript
{
  storage: 'localStorage' | 'sessionStorage',  // Where to store
  interval: number,                             // Debounce delay (ms)
  events: Array<string>,                        // Triggering events
  namespace: string,                            // Storage organization
  expires: number | Date                        // Expiration time
}
```

**Default Configuration:**

```javascript
{
  storage: 'localStorage',
  interval: 1000,
  events: ['input', 'change'],
  namespace: '',
  expires: undefined
}
```

**Quick Reference:**

| Option | Type | Default | Purpose |
|--------|------|---------|---------|
| `storage` | `string` | `'localStorage'` | Storage location |
| `interval` | `number` | `1000` | Debounce delay (ms) |
| `events` | `Array` | `['input', 'change']` | Trigger events |
| `namespace` | `string` | `''` | Storage organization |
| `expires` | `number\|Date` | `undefined` | Expiration time |

**Common Patterns:**

```javascript
// Simple form
Forms.myForm.autoSave('draft');

// Temporary form
Forms.myForm.autoSave('draft', {
  storage: 'sessionStorage'
});

// Fast-saving form
Forms.myForm.autoSave('draft', {
  interval: 500
});

// Organized form
Forms.myForm.autoSave('draft', {
  namespace: 'forms:contact'
});

// Expiring draft
Forms.myForm.autoSave('draft', {
  expires: 86400
});

// Full configuration
Forms.myForm.autoSave('draft', {
  storage: 'localStorage',
  interval: 2000,
  events: ['input', 'blur'],
  namespace: 'my:forms',
  expires: 604800
});
```

**Key Recommendations:**

✅ Use `sessionStorage` for temporary data  
✅ Balance `interval` with form complexity  
✅ Choose `events` based on field types  
✅ Use `namespace` for organization  
✅ Set `expires` for draft management  
✅ Document your configuration  
✅ Test with real user behavior  

The auto-save options provide powerful control over form data persistence and user experience!