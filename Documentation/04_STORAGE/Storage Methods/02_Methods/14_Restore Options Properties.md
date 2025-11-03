# Restore Options Properties

Complete documentation for options available when using `form.restore()` in the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Options Reference](#options-reference)
   - [storage](#storage)
   - [namespace](#namespace)
   - [clearAfterRestore](#clearafterrestore)
3. [Complete Options Object](#complete-options-object)
4. [Use Cases](#use-cases)
5. [Examples](#examples)
6. [Best Practices](#best-practices)
7. [Common Patterns](#common-patterns)

---

## Overview

When restoring saved form data using `form.restore(storageKey, options)`, you can customize the restoration behavior with various options. These options control where to retrieve data from, how to organize storage access, and whether to clean up after restoration.

**Key Benefits:**
- 🔄 **Flexible restoration** - Control where data comes from
- 📦 **Namespace matching** - Restore from organized storage
- 🗑️ **Auto-cleanup** - Optionally remove data after restoring
- 🎯 **Storage selection** - Choose localStorage or sessionStorage
- 🔗 **Consistent API** - Matches autoSave options

---

## Options Reference

### storage

Specify which Web Storage API to retrieve form data from.

#### Type

**`string`**

#### Values

- `'localStorage'` - Retrieve from persistent storage
- `'sessionStorage'` - Retrieve from temporary storage

#### Default

`'localStorage'`

#### Description

Determines where to look for saved form data. Must match the storage type used when saving the data with `autoSave()` or manual storage.

#### Examples

```javascript
// Restore from localStorage (default)
Forms.contactForm.restore('contact-draft');

// Explicitly restore from localStorage
Forms.articleForm.restore('article-draft', {
  storage: 'localStorage'
});

// Restore from sessionStorage
Forms.wizardForm.restore('wizard-progress', {
  storage: 'sessionStorage'
});

// Search form - session storage
Forms.searchForm.restore('search-query', {
  storage: 'sessionStorage'
});
```

#### Matching with autoSave

```javascript
// IMPORTANT: Must match the storage type used in autoSave

// Save to localStorage
Forms.contactForm.autoSave('draft', {
  storage: 'localStorage'
});

// Restore from localStorage (matches)
Forms.contactForm.restore('draft', {
  storage: 'localStorage'  // ✅ Correct
});

// ---

// Save to sessionStorage
Forms.wizardForm.autoSave('progress', {
  storage: 'sessionStorage'
});

// Restore from sessionStorage (matches)
Forms.wizardForm.restore('progress', {
  storage: 'sessionStorage'  // ✅ Correct
});

// Restore from localStorage (WRONG - won't find data)
Forms.wizardForm.restore('progress', {
  storage: 'localStorage'  // ❌ Mismatch - no data found
});
```

---

### namespace

Specify the storage namespace to retrieve data from.

#### Type

**`string`**

#### Default

`''` (empty string - no namespace)

#### Description

Namespace specifies where to look for the stored data. Must match the namespace used when saving the data. The actual storage key becomes `namespace:storageKey`.

#### Format

Looks for key: `namespace:storageKey`

#### Examples

```javascript
// No namespace (global storage)
Forms.contactForm.restore('contact-draft');
// Looks for: 'contact-draft'

// With namespace
Forms.contactForm.restore('draft', {
  namespace: 'forms:contact'
});
// Looks for: 'forms:contact:draft'

// Blog posts namespace
Forms.postEditor.restore('draft', {
  namespace: 'blog:posts'
});
// Looks for: 'blog:posts:draft'

// User-specific namespace
const userId = getCurrentUserId();
Forms.profileForm.restore('profile', {
  namespace: `user:${userId}`
});
// Looks for: 'user:123:profile'

// Nested namespace
Forms.surveyForm.restore('responses', {
  namespace: 'surveys:satisfaction'
});
// Looks for: 'surveys:satisfaction:responses'
```

#### Matching with autoSave

```javascript
// IMPORTANT: Must match the namespace used in autoSave

// Save with namespace
Forms.postEditor.autoSave('draft', {
  namespace: 'blog:posts'
});

// Restore with same namespace (matches)
Forms.postEditor.restore('draft', {
  namespace: 'blog:posts'  // ✅ Correct
});

// Restore without namespace (WRONG - won't find data)
Forms.postEditor.restore('draft');  // ❌ Mismatch

// Restore with different namespace (WRONG - won't find data)
Forms.postEditor.restore('draft', {
  namespace: 'blog:comments'  // ❌ Wrong namespace
});
```

---

### clearAfterRestore

Remove the stored data after successfully restoring it.

#### Type

**`boolean`**

#### Default

`false`

#### Description

When `true`, the stored data is removed from storage immediately after being restored to the form. Useful for one-time use data, preventing data duplication, or ensuring clean state.

#### Behavior

- `false` - Data remains in storage after restoration
- `true` - Data is removed from storage after restoration

#### Examples

```javascript
// Keep data after restore (default)
Forms.contactForm.restore('draft');
// Data remains in storage for future restoration

// Explicitly keep data
Forms.articleForm.restore('draft', {
  clearAfterRestore: false
});
// Data remains in storage

// Remove data after restore
Forms.registrationForm.restore('registration-draft', {
  clearAfterRestore: true
});
// Data is restored to form, then removed from storage

// Wizard form - clear after restoring
Forms.wizardForm.restore('wizard-progress', {
  storage: 'sessionStorage',
  clearAfterRestore: true
});
// Useful for ensuring one-time restoration
```

#### When to Use Each

**`clearAfterRestore: false` (default):**
- Regular drafts that might be restored multiple times
- Data that should persist until explicitly cleared
- Forms where user might refresh page multiple times
- Draft data that should survive navigation

**`clearAfterRestore: true`:**
- One-time data restoration
- Migration from old storage format
- Preventing stale data issues
- Import/export scenarios
- Ensuring clean state after restore

---

## Complete Options Object

### Full Syntax

```javascript
form.restore(storageKey, {
  storage: 'localStorage' | 'sessionStorage',  // Default: 'localStorage'
  namespace: string,                            // Default: ''
  clearAfterRestore: boolean                    // Default: false
})
```

### Default Values

```javascript
{
  storage: 'localStorage',
  namespace: '',
  clearAfterRestore: false
}
```

### Minimal Example

```javascript
// Using all defaults
Forms.myForm.restore('draft');
```

### Complete Example

```javascript
// Custom configuration
Forms.articleForm.restore('draft', {
  storage: 'localStorage',
  namespace: 'blog:articles',
  clearAfterRestore: false
});
```

---

## Use Cases

### 1. Simple Draft Restoration

```javascript
// Restore contact form draft
Forms.contactForm.restore('contact-draft');

// Data persists in storage for future restorations
```

### 2. Session Data Restoration

```javascript
// Restore temporary session data
Forms.wizardForm.restore('wizard-progress', {
  storage: 'sessionStorage'
});
```

### 3. Namespaced Restoration

```javascript
// Restore from organized storage
Forms.postEditor.restore('draft', {
  namespace: 'blog:posts'
});
```

### 4. One-time Restoration

```javascript
// Restore and clear (import scenario)
Forms.settingsForm.restore('imported-settings', {
  clearAfterRestore: true
});
```

### 5. Complete Configuration

```javascript
// Full options
Forms.applicationForm.restore('application', {
  storage: 'localStorage',
  namespace: 'careers:applications',
  clearAfterRestore: false
});
```

---

## Examples

### Example 1: Basic Draft System

```html
<form id="contactForm">
  <input type="text" name="name" placeholder="Name">
  <input type="email" name="email" placeholder="Email">
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Send</button>
  <button type="button" id="clearDraft">Clear Draft</button>
</form>

<script>
// Restore on page load
window.addEventListener('DOMContentLoaded', () => {
  Forms.contactForm.restore('contact-draft');
});

// Enable auto-save
Forms.contactForm.autoSave('contact-draft', {
  interval: 1000,
  expires: 86400
});

// Clear draft button
document.getElementById('clearDraft').onclick = () => {
  Forms.contactForm.clearAutoSave();
  Forms.contactForm.reset();
};

// Clear after successful submission
Forms.contactForm.on('submit', async (e) => {
  e.preventDefault();
  
  await submitForm(Forms.contactForm.values);
  Forms.contactForm.clearAutoSave();
  alert('Message sent!');
});
</script>
```

### Example 2: Session Storage with Confirmation

```html
<form id="wizardForm">
  <div class="step active" data-step="1">
    <input type="text" name="firstName" placeholder="First Name">
    <input type="text" name="lastName" placeholder="Last Name">
  </div>
  <div class="step" data-step="2">
    <input type="email" name="email" placeholder="Email">
    <input type="tel" name="phone" placeholder="Phone">
  </div>
</form>

<script>
// Check for saved progress on load
window.addEventListener('DOMContentLoaded', () => {
  if (Storage.session.has('wizard-progress')) {
    const restore = confirm(
      'You have unsaved progress. Would you like to continue where you left off?'
    );
    
    if (restore) {
      Forms.wizardForm.restore('wizard-progress', {
        storage: 'sessionStorage'
      });
      
      // Restore current step
      const step = Storage.session.get('wizard-step', 1);
      goToStep(step);
    } else {
      // User declined - clear old data
      Storage.session.remove('wizard-progress');
      Storage.session.remove('wizard-step');
    }
  }
});

// Enable auto-save
Forms.wizardForm.autoSave('wizard-progress', {
  storage: 'sessionStorage',
  interval: 500
});

function goToStep(stepNumber) {
  // Step navigation logic
  document.querySelectorAll('.step').forEach(el => {
    el.classList.remove('active');
  });
  document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');
  
  Storage.session.set('wizard-step', stepNumber);
}
</script>
```

### Example 3: Namespaced Blog Editor

```html
<form id="postEditor">
  <input type="text" name="title" placeholder="Post Title">
  <textarea name="content" rows="20" placeholder="Content"></textarea>
  <button type="submit">Publish</button>
  <button type="button" id="saveDraft">Save Draft</button>
</form>

<div id="draftStatus"></div>

<script>
const NAMESPACE = 'blog:posts';

// Check for draft on page load
window.addEventListener('DOMContentLoaded', () => {
  const storage = Storage.namespace(NAMESPACE);
  
  if (storage.has('draft')) {
    const draftAge = getDraftAge(storage);
    
    const restore = confirm(
      `A draft from ${draftAge} was found. Restore it?`
    );
    
    if (restore) {
      Forms.postEditor.restore('draft', {
        namespace: NAMESPACE
      });
      updateStatus('Draft restored');
    } else {
      storage.remove('draft');
      updateStatus('Starting fresh');
    }
  }
});

// Enable auto-save
Forms.postEditor.autoSave('draft', {
  namespace: NAMESPACE,
  interval: 2000,
  expires: 604800  // 7 days
});

// Manual save
document.getElementById('saveDraft').onclick = () => {
  const storage = Storage.namespace(NAMESPACE);
  storage.set('draft', Forms.postEditor.values, { expires: 604800 });
  updateStatus('Draft saved manually');
};

// Publish and clear
Forms.postEditor.on('submit', async (e) => {
  e.preventDefault();
  
  await publishPost(Forms.postEditor.values);
  Forms.postEditor.clearAutoSave();
  updateStatus('Published!');
});

function updateStatus(message) {
  document.getElementById('draftStatus').textContent = message;
}

function getDraftAge(storage) {
  // Simplified - would need to parse stored timestamp
  return 'recently';
}
</script>
```

### Example 4: One-time Import with Clear

```html
<form id="settingsForm">
  <input type="text" name="siteName" placeholder="Site Name">
  <input type="text" name="siteUrl" placeholder="Site URL">
  <select name="theme">
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
</form>

<input type="file" id="importFile" accept=".json">
<button id="exportBtn">Export Settings</button>

<script>
// Import settings from file
document.getElementById('importFile').onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const text = await file.text();
  const settings = JSON.parse(text);
  
  // Store temporarily
  Storage.set('imported-settings', settings);
  
  // Restore and clear (one-time operation)
  Forms.settingsForm.restore('imported-settings', {
    clearAfterRestore: true  // Remove after restoring
  });
  
  alert('Settings imported successfully!');
  
  // Verify it was cleared
  console.log('Imported data cleared:', !Storage.has('imported-settings'));
};

// Export settings to file
document.getElementById('exportBtn').onclick = () => {
  const settings = Forms.settingsForm.values;
  const blob = new Blob([JSON.stringify(settings, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `settings-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Regular auto-save for current editing
Forms.settingsForm.autoSave('settings-draft', {
  interval: 1000
});

// Restore current draft on load
Forms.settingsForm.restore('settings-draft');
</script>
```

### Example 5: User-specific Restoration

```html
<form id="profileForm">
  <input type="text" name="displayName" placeholder="Display Name">
  <input type="email" name="email" placeholder="Email">
  <textarea name="bio" placeholder="Bio"></textarea>
  <button type="submit">Save Profile</button>
</form>

<script>
class UserProfileManager {
  constructor(userId) {
    this.userId = userId;
    this.namespace = `users:${userId}:profile`;
    this.draftKey = 'draft';
  }
  
  restoreDraft() {
    const storage = Storage.namespace(this.namespace);
    
    if (storage.has(this.draftKey)) {
      const age = this.getDraftAge();
      
      if (age > 86400) { // Older than 24 hours
        const restore = confirm(
          'You have an old draft. Would you like to restore it?'
        );
        
        if (!restore) {
          storage.remove(this.draftKey);
          return false;
        }
      }
      
      Forms.profileForm.restore(this.draftKey, {
        namespace: this.namespace
      });
      
      return true;
    }
    
    return false;
  }
  
  enableAutoSave() {
    Forms.profileForm.autoSave(this.draftKey, {
      namespace: this.namespace,
      interval: 1500,
      expires: 604800  // 7 days
    });
  }
  
  clearDraft() {
    Forms.profileForm.clearAutoSave();
  }
  
  getDraftAge() {
    const storage = Storage.namespace(this.namespace);
    const key = storage._getKey(this.draftKey);
    const raw = localStorage.getItem(key);
    
    if (!raw) return 0;
    
    try {
      const data = JSON.parse(raw);
      return Math.floor((Date.now() - data.timestamp) / 1000);
    } catch {
      return 0;
    }
  }
  
  async saveProfile(data) {
    // Save to server
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    // Clear draft after successful save
    this.clearDraft();
  }
}

// Usage
const currentUserId = getCurrentUserId();
const profileManager = new UserProfileManager(currentUserId);

// Restore draft on page load
window.addEventListener('DOMContentLoaded', () => {
  const restored = profileManager.restoreDraft();
  
  if (restored) {
    console.log('Draft restored');
  } else {
    console.log('No draft found or user declined');
  }
  
  // Enable auto-save
  profileManager.enableAutoSave();
});

// Handle form submission
Forms.profileForm.on('submit', async (e) => {
  e.preventDefault();
  
  await profileManager.saveProfile(Forms.profileForm.values);
  alert('Profile saved successfully!');
});

function getCurrentUserId() {
  return Storage.get('currentUserId', 'guest');
}
</script>
```

### Example 6: Migration with Clear

```javascript
// Migrate from old storage format to new format
class StorageMigration {
  constructor() {
    this.oldKey = 'contact_form_draft';  // Old key format
    this.newKey = 'draft';
    this.namespace = 'forms:contact';
  }
  
  needsMigration() {
    // Check if old format data exists
    return Storage.has(this.oldKey) && 
           !Storage.namespace(this.namespace).has(this.newKey);
  }
  
  migrate() {
    if (!this.needsMigration()) {
      return false;
    }
    
    console.log('Migrating storage format...');
    
    // Get old data
    const oldData = Storage.get(this.oldKey);
    
    // Save in new format
    const newStorage = Storage.namespace(this.namespace);
    newStorage.set(this.newKey, oldData, { expires: 86400 });
    
    // Remove old data
    Storage.remove(this.oldKey);
    
    console.log('Migration complete');
    return true;
  }
  
  restore() {
    // Try migration first
    this.migrate();
    
    // Restore from new format
    Forms.contactForm.restore(this.newKey, {
      namespace: this.namespace
    });
  }
}

// Usage
const migration = new StorageMigration();

window.addEventListener('DOMContentLoaded', () => {
  migration.restore();
  
  // Setup auto-save with new format
  Forms.contactForm.autoSave('draft', {
    namespace: 'forms:contact',
    interval: 1000,
    expires: 86400
  });
});
```

---

## Best Practices

### 1. Match Storage Type with autoSave

```javascript
// Good: Matching storage types
Forms.myForm.autoSave('draft', {
  storage: 'localStorage'
});

Forms.myForm.restore('draft', {
  storage: 'localStorage'  // ✅ Matches
});

// ---

// Bad: Mismatched storage types
Forms.myForm.autoSave('draft', {
  storage: 'sessionStorage'
});

Forms.myForm.restore('draft', {
  storage: 'localStorage'  // ❌ Won't find data
});
```

### 2. Match Namespace with autoSave

```javascript
// Good: Matching namespaces
Forms.postEditor.autoSave('draft', {
  namespace: 'blog:posts'
});

Forms.postEditor.restore('draft', {
  namespace: 'blog:posts'  // ✅ Matches
});

// ---

// Bad: Mismatched namespaces
Forms.postEditor.autoSave('draft', {
  namespace: 'blog:posts'
});

Forms.postEditor.restore('draft', {
  namespace: 'blog:drafts'  // ❌ Wrong namespace
});

// Bad: Missing namespace
Forms.postEditor.restore('draft');  // ❌ Won't find data
```

### 3. Use clearAfterRestore Appropriately

```javascript
// Good: Keep data for multiple restorations
Forms.contactForm.restore('draft', {
  clearAfterRestore: false  // Can restore again if needed
});

// Good: One-time operations
Forms.importForm.restore('imported-data', {
  clearAfterRestore: true  // ✅ Import once, then clear
});

// Good: Migration scenarios
Forms.myForm.restore('old-format-data', {
  clearAfterRestore: true  // ✅ Migrate and clean up
});

// Avoid: Clearing regular drafts
Forms.articleForm.restore('draft', {
  clearAfterRestore: true  // ❌ User can't restore again after refresh
});
```

### 4. Check for Data Existence

```javascript
// Good: Check before restoring
if (Storage.has('contact-draft')) {
  Forms.contactForm.restore('contact-draft');
} else {
  console.log('No draft found');
}

// Good: Conditional restoration with user choice
if (Storage.namespace('blog').has('draft')) {
  const restore = confirm('A draft was found. Restore it?');
  
  if (restore) {
    Forms.postEditor.restore('draft', {
      namespace: 'blog'
    });
  } else {
    Storage.namespace('blog').remove('draft');
  }
}

// Avoid: Blind restoration
Forms.myForm.restore('draft');  
// Silent failure if no data exists
```

### 5. Handle Restore Timing

```javascript
// Good: Restore on page load
window.addEventListener('DOMContentLoaded', () => {
  Forms.contactForm.restore('draft');
});

// Good: Restore before auto-save
Forms.contactForm.restore('draft');
Forms.contactForm.autoSave('draft', {
  interval: 1000
});

// Avoid: Auto-save before restore
Forms.contactForm.autoSave('draft');
Forms.contactForm.restore('draft');  // ❌ Might overwrite with empty data
```

### 6. Provide User Feedback

```javascript
// Good: Inform user about restoration
window.addEventListener('DOMContentLoaded', () => {
  if (Storage.has('contact-draft')) {
    Forms.contactForm.restore('contact-draft');
    showNotification('Your draft has been restored', 'info');
  }
});

// Good: Show draft age
function restoreWithInfo() {
  if (Storage.has('draft')) {
    const age = getDraftAge();
    const restore = confirm(
      `A draft from ${formatAge(age)} was found. Restore it?`
    );
    
    if (restore) {
      Forms.myForm.restore('draft');
    }
  }
}

function getDraftAge() {
  // Calculate age from timestamp
  const raw = localStorage.getItem('draft');
  const data = JSON.parse(raw);
  return Date.now() - data.timestamp;
}

function formatAge(ms) {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes} minutes ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}
```

### 7. Document Your Restoration Logic

```javascript
// Good: Clear constants
const RESTORE_CONFIG = {
  CONTACT_FORM: {
    key: 'contact-draft',
    storage: 'localStorage',
    namespace: ''
  },
  ARTICLE_EDITOR: {
    key: 'draft',
    storage: 'localStorage',
    namespace: 'blog:posts'
  },
  WIZARD_FORM: {
    key: 'wizard-progress',
    storage: 'sessionStorage',
    namespace: 'wizard'
  }
};

// Usage
function restoreContactForm() {
  const config = RESTORE_CONFIG.CONTACT_FORM;
  
  if (Storage.has(config.key)) {
    Forms.contactForm.restore(config.key, {
      storage: config.storage,
      namespace: config.namespace
    });
  }
}
```

---

## Common Patterns

### Pattern 1: Restore with Confirmation

```javascript
function restoreWithConfirmation(form, key, options = {}) {
  const storage = options.namespace ? 
    Storage.namespace(options.namespace) : 
    (options.storage === 'sessionStorage' ? Storage.session : Storage);
  
  if (storage.has(key)) {
    const restore = confirm(
      'You have unsaved changes. Would you like to restore them?'
    );
    
    if (restore) {
      form.restore(key, options);
      return true;
    } else {
      storage.remove(key);
      return false;
    }
  }
  
  return false;
}

// Usage
restoreWithConfirmation(Forms.contactForm, 'contact-draft');

restoreWithConfirmation(Forms.postEditor, 'draft', {
  namespace: 'blog:posts'
});
```

### Pattern 2: Restore with Age Check

```javascript
class DraftRestorer {
  constructor(form, key, options = {}) {
    this.form = form;
    this.key = key;
    this.options = options;
    this.maxAge = options.maxAge || 604800; // 7 days default
  }
  
  restore() {
    const storage = this.getStorage();
    
    if (!storage.has(this.key)) {
      return false;
    }
    
    const age = this.getDraftAge();
    
    if (age > this.maxAge) {
      const restore = confirm(
        `This draft is ${this.formatAge(age)} old. Restore it anyway?`
      );
      
      if (!restore) {
        storage.remove(this.key);
        return false;
      }
    }
    
    this.form.restore(this.key, this.options);
    return true;
  }
  
  getStorage() {
    return this.options.namespace ?
      Storage.namespace(this.options.namespace) :
      (this.options.storage === 'sessionStorage' ? Storage.session : Storage);
  }
  
  getDraftAge() {
    const storage = this.getStorage();
    const fullKey = storage._getKey(this.key);
    const raw = localStorage.getItem(fullKey);
    
    if (!raw) return 0;
    
    try {
      const data = JSON.parse(raw);
      return Math.floor((Date.now() - data.timestamp) / 1000);
    } catch {
      return 0;
    }
  }
  
  formatAge(seconds) {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours`;
    
    const days = Math.floor(hours / 24);
    return `${days} days`;
  }
}

// Usage
const restorer = new DraftRestorer(Forms.contactForm, 'draft', {
  maxAge: 86400,  // 24 hours
  namespace: 'forms'
});

restorer.restore();
```

### Pattern 3: Progressive Restoration

```javascript
class ProgressiveRestorer {
  constructor(forms) {
    this.forms = forms;  // Array of {form, key, options}
  }
  
  async restoreAll() {
    const results = [];
    
    for (const config of this.forms) {
      const result = await this.restoreOne(config);
      results.push(result);
    }
    
    return results;
  }
  
  async restoreOne({form, key, options = {}}) {
    return new Promise((resolve) => {
      const storage = this.getStorage(options);
      
      if (!storage.has(key)) {
        resolve({form: form.id, restored: false, reason: 'no_data'});
        return;
      }
      
      if (options.confirm) {
        const restore = confirm(
          `Restore draft for ${form.id}?`
        );
        
        if (!restore) {
          resolve({form: form.id, restored: false, reason: 'declined'});
          return;
        }
      }
      
      form.restore(key, options);
      resolve({form: form.id, restored: true});
    });
  }
  
  getStorage(options) {
    return options.namespace ?
      Storage.namespace(options.namespace) :
      (options.storage === 'sessionStorage' ? Storage.session : Storage);
  }
}

// Usage
const restorer = new ProgressiveRestorer([
  {
    form: Forms.contactForm,
    key: 'contact-draft',
    options: { confirm: true }
  },
  {
    form: Forms.feedbackForm,
    key: 'feedback-draft',
    options: { confirm: true }
  },
  {
    form: Forms.profileForm,
    key: 'profile',
    options: { 
      namespace: `user:${userId}`,
      confirm: false
    }
  }
]);

// Restore all forms
restorer.restoreAll().then(results => {
  console.log('Restoration results:', results);
});
```

### Pattern 4: Conditional Clear After Restore

```javascript
function restoreWithConditionalClear(form, key, options = {}) {
  const shouldClear = options.clearAfterRestore || false;
  
  // Check data age
  const storage = options.namespace ?
    Storage.namespace(options.namespace) :
    (options.storage === 'sessionStorage' ? Storage.session : Storage);
  
  if (!storage.has(key)) {
    return false;
  }
  
  // Restore
  form.restore(key, {
    ...options,
    clearAfterRestore: false  // Don't auto-clear yet
  });
  
  // Conditionally clear based on custom logic
  if (shouldClear) {
    if (options.clearCondition) {
      // Use custom condition
      if (options.clearCondition()) {
        storage.remove(key);
      }
    } else {
      // Default: clear immediately
      storage.remove(key);
    }
  }
  
  return true;
}

// Usage

// Clear if form is complete
restoreWithConditionalClear(Forms.wizardForm, 'progress', {
  storage: 'sessionStorage',
  clearAfterRestore: true,
  clearCondition: () => {
    const values = Forms.wizardForm.values;
    return Object.keys(values).length > 10;  // All fields filled
  }
});

// Clear if data is old
restoreWithConditionalClear(Forms.contactForm, 'draft', {clearAfterRestore: true,
  clearCondition: () => {
    const age = getDraftAge('contact-draft');
    return age > 86400; // Older than 24 hours
  }
});

// Always clear (migration)
restoreWithConditionalClear(Forms.settingsForm, 'old-settings', {
  clearAfterRestore: true  // No condition = always clear
});
```

---

## Troubleshooting

### Issue 1: Data Not Restoring

**Problem:** Form fields remain empty after calling `restore()`

**Solutions:**

```javascript
// Check if data exists
const data = Storage.get('draft-key');
console.log('Data exists:', data !== null);
console.log('Data:', data);

// Verify storage type matches
Forms.myForm.autoSave('draft', {
  storage: 'sessionStorage'
});
// Must restore from sessionStorage too!
Forms.myForm.restore('draft', {
  storage: 'sessionStorage'  // ✅ Match storage type
});

// Verify namespace matches
Forms.myForm.autoSave('draft', {
  namespace: 'forms:contact'
});
// Must restore with same namespace!
Forms.myForm.restore('draft', {
  namespace: 'forms:contact'  // ✅ Match namespace
});

// Check for expired data
if (Storage.has('draft')) {
  console.log('Data exists and not expired');
} else {
  console.log('Data missing or expired');
}

// Debug with manual retrieval
const storage = Storage.namespace('blog');
const manualData = storage.get('draft');
console.log('Manual retrieval:', manualData);
```

### Issue 2: Wrong Storage Type

**Problem:** Data saved to localStorage but trying to restore from sessionStorage

**Solution:**

```javascript
// Bad: Mismatch
Forms.myForm.autoSave('draft', { storage: 'localStorage' });
Forms.myForm.restore('draft', { storage: 'sessionStorage' }); // ❌

// Good: Consistent
const STORAGE_TYPE = 'localStorage';

Forms.myForm.autoSave('draft', { storage: STORAGE_TYPE });
Forms.myForm.restore('draft', { storage: STORAGE_TYPE }); // ✅

// Or use constants
const FORM_CONFIG = {
  storage: 'localStorage',
  namespace: 'forms'
};

Forms.myForm.autoSave('draft', FORM_CONFIG);
Forms.myForm.restore('draft', FORM_CONFIG);
```

### Issue 3: Namespace Mismatch

**Problem:** Data not found due to wrong namespace

**Solution:**

```javascript
// Debug namespace issues
function debugNamespace(key, namespace) {
  console.log('Looking for key:', key);
  console.log('In namespace:', namespace);
  
  const storage = namespace ? 
    Storage.namespace(namespace) : 
    Storage;
  
  console.log('Full key:', storage._getKey(key));
  console.log('Exists:', storage.has(key));
  console.log('All keys in namespace:', storage.keys());
}

// Usage
debugNamespace('draft', 'blog:posts');

// Fix: Use consistent namespace
const NAMESPACE = 'blog:posts';

Forms.postEditor.autoSave('draft', { namespace: NAMESPACE });
Forms.postEditor.restore('draft', { namespace: NAMESPACE });
```

### Issue 4: Data Cleared Unexpectedly

**Problem:** Data disappears after restoration

**Solution:**

```javascript
// Check if clearAfterRestore is set
Forms.myForm.restore('draft', {
  clearAfterRestore: true  // ⚠️ This clears data!
});

// Fix: Only clear when intended
Forms.myForm.restore('draft', {
  clearAfterRestore: false  // ✅ Data persists
});

// Or use default (false)
Forms.myForm.restore('draft');  // ✅ Data persists
```

### Issue 5: Expired Data

**Problem:** Data was saved with expiry and has expired

**Solution:**

```javascript
// Check expiry
if (Storage.has('draft')) {
  console.log('Data exists and not expired');
  Forms.myForm.restore('draft');
} else {
  console.log('Data expired or does not exist');
  showNotification('No draft found or draft expired');
}

// Prevent expiry for important drafts
Forms.myForm.autoSave('draft', {
  // Don't set expires, or use very long expiry
  expires: 31536000  // 1 year
});

// Or check and extend before restoring
const data = Storage.get('draft');
if (data) {
  // Re-save to extend expiry
  Storage.set('draft', data, { expires: 86400 });
  Forms.myForm.restore('draft');
}
```

---

## Advanced Usage

### Multi-Form Restoration Manager

```javascript
class MultiFormRestorer {
  constructor() {
    this.forms = new Map();
  }
  
  register(formId, config) {
    this.forms.set(formId, {
      form: Forms[formId],
      key: config.key || formId,
      options: config.options || {},
      onRestore: config.onRestore,
      shouldRestore: config.shouldRestore || (() => true)
    });
  }
  
  async restoreAll(options = {}) {
    const results = {
      restored: [],
      skipped: [],
      failed: []
    };
    
    for (const [formId, config] of this.forms) {
      try {
        // Check if should restore
        if (!config.shouldRestore()) {
          results.skipped.push(formId);
          continue;
        }
        
        // Check if data exists
        const storage = this.getStorage(config.options);
        if (!storage.has(config.key)) {
          results.skipped.push(formId);
          continue;
        }
        
        // Confirm if needed
        if (options.confirmEach) {
          const restore = confirm(`Restore ${formId}?`);
          if (!restore) {
            results.skipped.push(formId);
            continue;
          }
        }
        
        // Restore
        config.form.restore(config.key, config.options);
        
        // Callback
        if (config.onRestore) {
          await config.onRestore(config.form, config.key);
        }
        
        results.restored.push(formId);
        
      } catch (error) {
        console.error(`Failed to restore ${formId}:`, error);
        results.failed.push({ formId, error: error.message });
      }
    }
    
    return results;
  }
  
  restoreOne(formId) {
    const config = this.forms.get(formId);
    if (!config) {
      throw new Error(`Form ${formId} not registered`);
    }
    
    const storage = this.getStorage(config.options);
    if (!storage.has(config.key)) {
      return false;
    }
    
    config.form.restore(config.key, config.options);
    
    if (config.onRestore) {
      config.onRestore(config.form, config.key);
    }
    
    return true;
  }
  
  getStorage(options) {
    if (options.namespace) {
      return Storage.namespace(options.namespace);
    }
    return options.storage === 'sessionStorage' ? 
      Storage.session : Storage;
  }
  
  clearAll() {
    for (const [formId, config] of this.forms) {
      const storage = this.getStorage(config.options);
      storage.remove(config.key);
    }
  }
}

// Usage
const restorer = new MultiFormRestorer();

// Register forms
restorer.register('contactForm', {
  key: 'contact-draft',
  options: {
    storage: 'localStorage'
  },
  onRestore: (form) => {
    console.log('Contact form restored');
    showNotification('Your draft has been restored');
  }
});

restorer.register('articleForm', {
  key: 'draft',
  options: {
    storage: 'localStorage',
    namespace: 'blog:posts'
  },
  shouldRestore: () => {
    // Only restore if user is logged in
    return isUserLoggedIn();
  },
  onRestore: (form, key) => {
    console.log('Article restored');
    updateWordCount();
  }
});

restorer.register('wizardForm', {
  key: 'progress',
  options: {
    storage: 'sessionStorage',
    namespace: 'wizard'
  },
  onRestore: (form) => {
    // Restore current step
    const step = Storage.session.get('wizard:step', 1);
    goToStep(step);
  }
});

// Restore all forms on page load
window.addEventListener('DOMContentLoaded', async () => {
  const results = await restorer.restoreAll({
    confirmEach: false  // Don't confirm each restoration
  });
  
  console.log('Restoration results:', results);
  console.log(`Restored: ${results.restored.length}`);
  console.log(`Skipped: ${results.skipped.length}`);
  console.log(`Failed: ${results.failed.length}`);
});

// Restore specific form
document.getElementById('restoreArticle').onclick = () => {
  const restored = restorer.restoreOne('articleForm');
  if (restored) {
    alert('Article restored');
  } else {
    alert('No draft found');
  }
};
```

---

## Summary

**Complete Options:**

```javascript
{
  storage: 'localStorage' | 'sessionStorage',  // Where to retrieve from
  namespace: string,                            // Storage organization
  clearAfterRestore: boolean                    // Remove after restoring
}
```

**Default Configuration:**

```javascript
{
  storage: 'localStorage',
  namespace: '',
  clearAfterRestore: false
}
```

**Quick Reference:**

| Option | Type | Default | Purpose |
|--------|------|---------|---------|
| `storage` | `string` | `'localStorage'` | Storage type |
| `namespace` | `string` | `''` | Storage organization |
| `clearAfterRestore` | `boolean` | `false` | Remove after restore |

**Common Patterns:**

```javascript
// Simple restore
Forms.myForm.restore('draft');

// From sessionStorage
Forms.myForm.restore('draft', {
  storage: 'sessionStorage'
});

// With namespace
Forms.myForm.restore('draft', {
  namespace: 'forms:contact'
});

// One-time restore
Forms.myForm.restore('imported-data', {
  clearAfterRestore: true
});

// Complete configuration
Forms.myForm.restore('draft', {
  storage: 'localStorage',
  namespace: 'blog:posts',
  clearAfterRestore: false
});
```

**Key Requirements:**

✅ **Match storage type** with autoSave  
✅ **Match namespace** with autoSave  
✅ **Check data existence** before restoring  
✅ **Handle timing** (restore before auto-save)  
✅ **Provide user feedback** about restoration  
✅ **Use clearAfterRestore** only when appropriate  
✅ **Document your configuration**  

**When to Clear After Restore:**

- ✅ One-time imports
- ✅ Data migrations
- ✅ Temporary operations
- ❌ Regular drafts
- ❌ User-editable data
- ❌ Multi-session forms

**Common Use Cases:**

- 📝 Draft restoration on page load
- 🔄 Session data recovery
- 📦 Import/export operations
- 🔀 Data migration
- 👤 User-specific restoration
- 📊 Multi-form systems

**Best Practices:**

1. Always match options with autoSave
2. Check for data existence first
3. Provide user confirmation for old drafts
4. Use clearAfterRestore sparingly
5. Handle restoration timing properly
6. Give feedback about restoration status
7. Document your restoration logic

The restore options provide flexible control over how saved form data is retrieved and managed!