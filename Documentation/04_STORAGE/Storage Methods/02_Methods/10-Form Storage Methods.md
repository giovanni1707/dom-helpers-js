# Form Storage Methods

Complete documentation for form storage integration in the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Methods Reference](#methods-reference)
   - [autoSave()](#autosave)
   - [restore()](#restore)
   - [clearAutoSave()](#clearautosave)
3. [Use Cases](#use-cases)
4. [Examples](#examples)
5. [Best Practices](#best-practices)
6. [Complete Workflows](#complete-workflows)

---

## Overview

Form Storage Methods provide seamless integration between forms and storage, enabling automatic saving and restoring of form data. This is particularly useful for preventing data loss, creating draft systems, and improving user experience.

**Key Benefits:**
- 💾 **Auto-save** - Automatically save form data as users type
- 🔄 **Restore** - Recover unsaved data after page refresh
- ⏱️ **Debouncing** - Efficient saving with configurable delay
- 🗑️ **Easy cleanup** - Clear saved data with one method
- 🎯 **Flexible** - Works with localStorage or sessionStorage
- ⏰ **Expiry support** - Set expiration for saved drafts

**Requirements:**
- DOM Helpers Forms module must be loaded
- Form must have an `id` attribute
- Forms are accessed via the `Forms` object

---

## Methods Reference

### autoSave()

Enable automatic saving of form data to storage.

#### Syntax

```javascript
form.autoSave(storageKey, options)
```

#### Parameters

- **`storageKey`** (string, required): Key to store form data under

- **`options`** (object, optional): Configuration options
  - `storage` (string): Storage type - `'localStorage'` or `'sessionStorage'`
    - Default: `'localStorage'`
  - `interval` (number): Debounce delay in milliseconds
    - Default: `1000` (1 second)
  - `events` (Array<string>): Events that trigger auto-save
    - Default: `['input', 'change']`
  - `namespace` (string): Storage namespace for organization
    - Default: `''` (no namespace)
  - `expires` (number): Expiration time in seconds
    - Default: No expiration

#### Returns

**`HTMLFormElement`** - The form element (for method chaining)

#### Behavior

- Listens to specified events on the form
- Debounces save operations based on `interval`
- Saves all form field values automatically
- Stores reference to storage key and helper internally
- Can be chained with other methods

#### Example

```javascript
// Basic auto-save
Forms.contactForm.autoSave('contact-draft');

// With options
Forms.checkoutForm.autoSave('checkout-data', {
  storage: 'sessionStorage',
  interval: 500,
  events: ['input', 'change', 'blur'],
  expires: 3600
});

// With namespace
Forms.articleForm.autoSave('draft', {
  namespace: 'blog:articles'
});

// Method chaining
Forms.feedbackForm
  .autoSave('feedback-draft')
  .on('submit', handleSubmit);
```

---

### restore()

Restore previously saved form data from storage.

#### Syntax

```javascript
form.restore(storageKey, options)
```

#### Parameters

- **`storageKey`** (string, required): Key where form data is stored

- **`options`** (object, optional): Configuration options
  - `storage` (string): Storage type - `'localStorage'` or `'sessionStorage'`
    - Default: `'localStorage'`
  - `namespace` (string): Storage namespace to restore from
    - Default: `''` (no namespace)
  - `clearAfterRestore` (boolean): Remove data after restoring
    - Default: `false`

#### Returns

**`HTMLFormElement`** - The form element (for method chaining)

#### Behavior

- Retrieves saved data from storage
- Populates all matching form fields
- Respects field types (text, checkbox, radio, select, etc.)
- Optionally clears storage after restoration
- Silently does nothing if no data found
- Can be chained with other methods

#### Example

```javascript
// Basic restore
Forms.contactForm.restore('contact-draft');

// With options
Forms.checkoutForm.restore('checkout-data', {
  storage: 'sessionStorage'
});

// With namespace
Forms.articleForm.restore('draft', {
  namespace: 'blog:articles'
});

// Restore and clear
Forms.registrationForm.restore('registration-draft', {
  clearAfterRestore: true
});

// Method chaining
Forms.surveyForm
  .restore('survey-draft')
  .on('submit', handleSubmit);
```

---

### clearAutoSave()

Stop auto-saving and remove stored form data.

#### Syntax

```javascript
form.clearAutoSave()
```

#### Parameters

None

#### Returns

**`HTMLFormElement`** - The form element (for method chaining)

#### Behavior

- Clears the debounce timeout (stops saving)
- Removes stored form data from storage
- Uses the storage key from `autoSave()`
- Safe to call even if auto-save not active
- Can be chained with other methods

#### Example

```javascript
// Clear auto-save
Forms.contactForm.clearAutoSave();

// Clear on form reset
Forms.articleForm.on('reset', () => {
  Forms.articleForm.clearAutoSave();
});

// Clear after successful submission
Forms.checkoutForm.on('submit', async (e) => {
  e.preventDefault();
  const success = await submitForm();
  
  if (success) {
    Forms.checkoutForm.clearAutoSave();
  }
});

// Method chaining
Forms.feedbackForm
  .clearAutoSave()
  .reset();
```

---

## Use Cases

### 1. Contact Form Draft

```javascript
// Save contact form as draft
Forms.contactForm.autoSave('contact-draft', {
  interval: 1000,
  expires: 86400 // 24 hours
});

// Restore on page load
Forms.contactForm.restore('contact-draft');

// Clear after submission
Forms.contactForm.on('submit', async (e) => {
  e.preventDefault();
  await sendMessage(Forms.contactForm.values);
  Forms.contactForm.clearAutoSave();
  Forms.contactForm.reset();
});
```

### 2. Multi-step Form Wizard

```javascript
// Save progress as user navigates steps
Forms.wizardForm.autoSave('wizard-progress', {
  storage: 'sessionStorage'
});

// Restore on page load
Forms.wizardForm.restore('wizard-progress', {
  storage: 'sessionStorage'
});

// Clear after completion
function completeWizard() {
  Forms.wizardForm.clearAutoSave();
  showSuccessMessage();
}
```

### 3. Blog Post Editor

```javascript
// Auto-save blog drafts
Forms.postEditor.autoSave('post-draft', {
  namespace: 'blog',
  interval: 2000,
  expires: 604800 // 7 days
});

// Restore draft
Forms.postEditor.restore('post-draft', {
  namespace: 'blog'
});

// Manual save button
document.getElementById('saveDraft').onclick = () => {
  const storage = Storage.namespace('blog');
  storage.set('post-draft', Forms.postEditor.values);
  showNotification('Draft saved!');
};
```

### 4. Survey Form

```javascript
// Save survey responses
Forms.surveyForm.autoSave('survey-responses', {
  storage: 'sessionStorage',
  interval: 500
});

// Restore on page refresh
window.addEventListener('load', () => {
  Forms.surveyForm.restore('survey-responses', {
    storage: 'sessionStorage'
  });
});

// Clear after submission
Forms.surveyForm.on('submit', (e) => {
  e.preventDefault();
  submitSurvey(Forms.surveyForm.values);
  Forms.surveyForm.clearAutoSave();
});
```

### 5. Application Form with Expiry

```javascript
// Auto-save with 1 hour expiry
Forms.applicationForm.autoSave('application-draft', {
  interval: 1500,
  expires: 3600
});

// Restore with notification
const data = Storage.get('application-draft');
if (data) {
  Forms.applicationForm.restore('application-draft');
  showNotification('Your draft has been restored');
} else {
  showNotification('Starting a new application');
}
```

---

## Examples

### Example 1: Simple Contact Form

```html
<form id="contactForm">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send</button>
  <button type="button" id="clearDraft">Clear Draft</button>
</form>

<script>
// Restore saved draft on page load
Forms.contactForm.restore('contact-draft');

// Enable auto-save
Forms.contactForm.autoSave('contact-draft', {
  interval: 1000,
  expires: 86400 // Expires after 24 hours
});

// Clear draft button
document.getElementById('clearDraft').onclick = () => {
  Forms.contactForm.clearAutoSave();
  Forms.contactForm.reset();
  alert('Draft cleared!');
};

// Handle form submission
Forms.contactForm.on('submit', async (e) => {
  e.preventDefault();
  
  const data = Forms.contactForm.values;
  
  try {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    // Clear draft after successful submission
    Forms.contactForm.clearAutoSave();
    Forms.contactForm.reset();
    alert('Message sent successfully!');
  } catch (error) {
    alert('Error sending message. Your draft has been saved.');
  }
});
</script>
```

### Example 2: Blog Post Editor

```html
<form id="postEditor">
  <input type="text" name="title" placeholder="Post Title" required>
  <input type="text" name="slug" placeholder="URL Slug">
  <select name="category">
    <option value="">Select Category</option>
    <option value="tech">Technology</option>
    <option value="design">Design</option>
    <option value="business">Business</option>
  </select>
  <textarea name="content" rows="20" placeholder="Post Content"></textarea>
  <label>
    <input type="checkbox" name="published"> Published
  </label>
  <button type="submit">Save Post</button>
  <button type="button" id="saveDraft">Save Draft</button>
  <button type="button" id="discardDraft">Discard Draft</button>
</form>

<div id="draftStatus"></div>

<script>
const DRAFT_KEY = 'blog-post-draft';
const NAMESPACE = 'blog:editor';

// Check for existing draft on page load
window.addEventListener('DOMContentLoaded', () => {
  const storage = Storage.namespace(NAMESPACE);
  
  if (storage.has(DRAFT_KEY)) {
    const confirmed = confirm('A draft was found. Would you like to restore it?');
    
    if (confirmed) {
      Forms.postEditor.restore(DRAFT_KEY, { namespace: NAMESPACE });
      updateDraftStatus('Draft restored');
    } else {
      storage.remove(DRAFT_KEY);
    }
  }
});

// Enable auto-save
Forms.postEditor.autoSave(DRAFT_KEY, {
  namespace: NAMESPACE,
  interval: 2000, // Save every 2 seconds
  expires: 604800 // Expires after 7 days
});

// Show draft status
let statusTimeout;
function updateDraftStatus(message) {
  const status = document.getElementById('draftStatus');
  status.textContent = message;
  status.className = 'draft-status show';
  
  clearTimeout(statusTimeout);
  statusTimeout = setTimeout(() => {
    status.className = 'draft-status';
  }, 3000);
}

// Update status on auto-save (debounced)
Forms.postEditor.addEventListener('input', debounce(() => {
  updateDraftStatus('Draft auto-saved');
}, 2000));

// Manual save draft
document.getElementById('saveDraft').onclick = () => {
  const storage = Storage.namespace(NAMESPACE);
  storage.set(DRAFT_KEY, Forms.postEditor.values, { expires: 604800 });
  updateDraftStatus('Draft saved manually');
};

// Discard draft
document.getElementById('discardDraft').onclick = () => {
  if (confirm('Are you sure you want to discard this draft?')) {
    Forms.postEditor.clearAutoSave();
    Forms.postEditor.reset();
    updateDraftStatus('Draft discarded');
  }
};

// Handle form submission
Forms.postEditor.on('submit', async (e) => {
  e.preventDefault();
  
  const data = Forms.postEditor.values;
  
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      Forms.postEditor.clearAutoSave();
      Forms.postEditor.reset();
      alert('Post saved successfully!');
      window.location.href = '/posts';
    }
  } catch (error) {
    alert('Error saving post. Your draft has been preserved.');
  }
});

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
</script>

<style>
.draft-status {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.draft-status.show {
  opacity: 1;
}
</style>
```

### Example 3: Multi-Step Registration Form

```html
<form id="registrationForm">
  <!-- Step 1: Personal Info -->
  <div class="step" data-step="1">
    <h2>Step 1: Personal Information</h2>
    <input type="text" name="firstName" placeholder="First Name" required>
    <input type="text" name="lastName" placeholder="Last Name" required>
    <input type="date" name="birthDate" required>
    <button type="button" class="next-step">Next</button>
  </div>
  
  <!-- Step 2: Contact Info -->
  <div class="step" data-step="2" style="display: none;">
    <h2>Step 2: Contact Information</h2>
    <input type="email" name="email" placeholder="Email" required>
    <input type="tel" name="phone" placeholder="Phone" required>
    <input type="text" name="address" placeholder="Address" required>
    <button type="button" class="prev-step">Previous</button>
    <button type="button" class="next-step">Next</button>
  </div>
  
  <!-- Step 3: Account Info -->
  <div class="step" data-step="3" style="display: none;">
    <h2>Step 3: Account Information</h2>
    <input type="text" name="username" placeholder="Username" required>
    <input type="password" name="password" placeholder="Password" required>
    <input type="password" name="confirmPassword" placeholder="Confirm Password" required>
    <button type="button" class="prev-step">Previous</button>
    <button type="submit">Register</button>
  </div>
</form>

<div id="progress">
  <div id="progressBar"></div>
  <span id="progressText">Step 1 of 3</span>
</div>

<button id="clearProgress">Clear Progress</button>

<script>
const STORAGE_KEY = 'registration-progress';
let currentStep = 1;
const totalSteps = 3;

// Restore progress on page load
window.addEventListener('DOMContentLoaded', () => {
  Forms.registrationForm.restore(STORAGE_KEY, {
    storage: 'sessionStorage'
  });
  
  // Restore current step
  const savedStep = Storage.session.get('registration-step', 1);
  goToStep(savedStep);
});

// Enable auto-save
Forms.registrationForm.autoSave(STORAGE_KEY, {
  storage: 'sessionStorage',
  interval: 500
});

// Navigation functions
function goToStep(step) {
  currentStep = step;
  
  // Hide all steps
  document.querySelectorAll('.step').forEach(el => {
    el.style.display = 'none';
  });
  
  // Show current step
  document.querySelector(`[data-step="${step}"]`).style.display = 'block';
  
  // Update progress
  updateProgress();
  
  // Save current step
  Storage.session.set('registration-step', step);
}

function updateProgress() {
  const percent = (currentStep / totalSteps) * 100;
  document.getElementById('progressBar').style.width = `${percent}%`;
  document.getElementById('progressText').textContent = `Step ${currentStep} of ${totalSteps}`;
}

// Next step buttons
document.querySelectorAll('.next-step').forEach(btn => {
  btn.onclick = () => {
    if (validateCurrentStep()) {
      goToStep(currentStep + 1);
    }
  };
});

// Previous step buttons
document.querySelectorAll('.prev-step').forEach(btn => {
  btn.onclick = () => {
    goToStep(currentStep - 1);
  };
});

// Validate current step
function validateCurrentStep() {
  const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
  const inputs = currentStepEl.querySelectorAll('input[required]');
  
  for (const input of inputs) {
    if (!input.value.trim()) {
      alert(`Please fill in: ${input.placeholder}`);
      input.focus();
      return false;
    }
  }
  
  return true;
}

// Clear progress
document.getElementById('clearProgress').onclick = () => {
  if (confirm('Are you sure you want to clear your progress?')) {
    Forms.registrationForm.clearAutoSave();
    Storage.session.remove('registration-step');
    Forms.registrationForm.reset();
    goToStep(1);
    alert('Progress cleared!');
  }
};

// Handle form submission
Forms.registrationForm.on('submit', async (e) => {
  e.preventDefault();
  
  const data = Forms.registrationForm.values;
  
  // Validate passwords match
  if (data.password !== data.confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      Forms.registrationForm.clearAutoSave();
      Storage.session.remove('registration-step');
      alert('Registration successful!');
      window.location.href = '/welcome';
    } else {
      alert('Registration failed. Please try again.');
    }
  } catch (error) {
    alert('Error during registration. Your progress has been saved.');
  }
});
</script>

<style>
#progress {
  margin: 20px 0;
  text-align: center;
}

#progressBar {
  height: 4px;
  background: #4CAF50;
  transition: width 0.3s;
}

#progressText {
  display: block;
  margin-top: 10px;
  color: #666;
}
</style>
```

### Example 4: Survey Form with Session Storage

```html
<form id="surveyForm">
  <h2>Customer Satisfaction Survey</h2>
  
  <div class="question">
    <label>How satisfied are you with our service?</label>
    <select name="satisfaction" required>
      <option value="">Select...</option>
      <option value="very-satisfied">Very Satisfied</option>
      <option value="satisfied">Satisfied</option>
      <option value="neutral">Neutral</option>
      <option value="dissatisfied">Dissatisfied</option>
      <option value="very-dissatisfied">Very Dissatisfied</option>
    </select>
  </div>
  
  <div class="question">
    <label>Would you recommend us to others?</label>
    <label><input type="radio" name="recommend" value="yes" required> Yes</label>
    <label><input type="radio" name="recommend" value="no"> No</label>
    <label><input type="radio" name="recommend" value="maybe"> Maybe</label>
  </div>
  
  <div class="question">
    <label>What features do you use? (Select all that apply)</label>
    <label><input type="checkbox" name="features" value="feature1"> Feature 1</label>
    <label><input type="checkbox" name="features" value="feature2"> Feature 2</label>
    <label><input type="checkbox" name="features" value="feature3"> Feature 3</label>
  </div>
  
  <div class="question">
    <label>Additional Comments:</label>
    <textarea name="comments" rows="4"></textarea>
  </div>
  
  <button type="submit">Submit Survey</button>
</form>

<script>
// Use sessionStorage for survey (cleared when tab closes)
Forms.surveyForm.autoSave('survey-responses', {
  storage: 'sessionStorage',
  interval: 300 // Save frequently (300ms)
});

// Restore on page load
Forms.surveyForm.restore('survey-responses', {
  storage: 'sessionStorage'
});

// Handle submission
Forms.surveyForm.on('submit', async (e) => {
  e.preventDefault();
  
  const responses = Forms.surveyForm.values;
  
  try {
    await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responses)
    });
    
    // Clear auto-save after submission
    Forms.surveyForm.clearAutoSave();
    alert('Thank you for your feedback!');
    Forms.surveyForm.reset();
  } catch (error) {
    alert('Error submitting survey. Your responses have been saved.');
  }
});

// Warn before leaving with unsaved changes
window.addEventListener('beforeunload', (e) => {
  if (Storage.session.has('survey-responses')) {
    e.preventDefault();
    e.returnValue = '';
  }
});
</script>
```

### Example 5: Job Application Form

```html
<form id="jobApplicationForm">
  <h2>Job Application</h2>
  
  <fieldset>
    <legend>Personal Information</legend>
    <input type="text" name="fullName" placeholder="Full Name" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="tel" name="phone" placeholder="Phone" required>
  </fieldset>
  
  <fieldset>
    <legend>Experience</legend>
    <input type="text" name="currentPosition" placeholder="Current Position">
    <input type="number" name="yearsExperience" placeholder="Years of Experience" min="0">
    <textarea name="skills" placeholder="Skills (comma-separated)" rows="3"></textarea>
  </fieldset>
  
  <fieldset>
    <legend>Attach Resume</legend>
    <input type="file" name="resume" accept=".pdf,.doc,.docx">
  </fieldset>
  
  <button type="submit">Submit Application</button>
  <button type="button" id="saveForLater">Save for Later</button>
</form>

<div id="draftInfo"></div>

<script>
const APP_KEY = 'job-application';
const APP_NAMESPACE = 'careers';

// Check for existing draft
window.addEventListener('DOMContentLoaded', () => {
  const storage = Storage.namespace(APP_NAMESPACE);
  
  if (storage.has(APP_KEY)) {
    const draftInfo = document.getElementById('draftInfo');
    draftInfo.innerHTML = `
      <div class="draft-notice">
        <p>You have a saved application draft.</p>
        <button id="restoreDraft">Restore Draft</button>
        <button id="deleteDraft">Start Fresh</button>
      </div>
    `;
    
    document.getElementById('restoreDraft').onclick = () => {
      Forms.jobApplicationForm.restore(APP_KEY, {
        namespace: APP_NAMESPACE
      });
      draftInfo.style.display = 'none';
    };
    
    document.getElementById('deleteDraft').onclick = () => {
      storage.remove(APP_KEY);
      draftInfo.style.display = 'none';
    };
  }
});

// Auto-save with 1-day expiry
Forms.jobApplicationForm.autoSave(APP_KEY, {
  namespace: APP_NAMESPACE,
  interval: 1000,
  expires: 86400 // 24 hours
});

// Manual save for later
document.getElementById('saveForLater').onclick = () => {
  const storage = Storage.namespace(APP_NAMESPACE);
  storage.set(APP_KEY, Forms.jobApplicationForm.values, { expires: 86400 });
  alert('Application saved! You can return to complete it within 24 hours.');
};

// Handle submission
Forms.jobApplicationForm.on('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  try {
    const response = await fetch('/api/apply', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      Forms.jobApplicationForm.clearAutoSave();
      alert('Application submitted successfully!');
      window.location.href = '/application-confirmation';
    } else {
      alert('Error submitting application. Your draft has been saved.');
    }
  } catch (error) {
    alert('Network error. Your draft has been saved.');
  }
});
</script>

<style>
.draft-notice {
  padding: 15px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  margin-bottom: 20px;
}

.draft-notice button {
  margin-right: 10px;
}
</style>
```

---

## Best Practices

### 1. Always Restore Before Auto-Save

```javascript
// Good: Restore first, then enable auto-save
Forms.contactForm.restore('contact-draft');
Forms.contactForm.autoSave('contact-draft');

// This ensures existing data is loaded before auto-saving begins
```

### 2. Use Appropriate Storage Type

```javascript
// Good: sessionStorage for temporary data
Forms.searchForm.autoSave('search-query', {
  storage: 'sessionStorage'
});

// Good: localStorage for persistent drafts
Forms.articleForm.autoSave('article-draft', {
  storage: 'localStorage',
  expires: 604800 // 7 days
});
```

### 3. Set Reasonable Intervals

```javascript
// Good: Short interval for critical forms
Forms.paymentForm.autoSave('payment-draft', {
  interval: 500 // 500ms
});

// Good: Longer interval for less critical forms
Forms.feedbackForm.autoSave('feedback-draft', {
  interval: 2000 // 2 seconds
});

// Avoid: Too short (performance issues)
Forms.myForm.autoSave('draft', {
  interval: 50 // Too frequent!
});
```

### 4. Always Clear After Submission

```javascript
// Good: Clear draft after successful submission
Forms.contactForm.on('submit', async (e) => {
  e.preventDefault();
  
  const success = await submitData();
  
  if (success) {
    Forms.contactForm.clearAutoSave(); // Important!
    Forms.contactForm.reset();
  }
});
```

### 5. Use Namespaces for Organization

```javascript
// Good: Organized with namespaces
Forms.postEditor.autoSave('draft', {
  namespace: 'blog:posts'
});

Forms.commentForm.autoSave('draft', {
  namespace: 'blog:comments'
});

// No conflicts even with same key name
```

### 6. Set Expiration for Drafts

```javascript
// Good: Drafts expire after reasonable time
Forms.applicationForm.autoSave('draft', {
  expires: 86400 // 24 hours
});

// Prevents old drafts from cluttering storage
```

### 7. Confirm Before Restoring

```javascript
// Good: Ask user before restoring
if (Storage.has('contact-draft')) {
  const restore = confirm('A draft was found. Restore it?');
  
  if (restore) {
    Forms.contactForm.restore('contact-draft');
  } else {
    Storage.remove('contact-draft');
  }
}
```

### 8. Handle Clear Action Properly

```javascript
// Good: Clear with confirmation
document.getElementById('clearDraft').onclick = () => {
  if (confirm('Discard draft?')) {
    Forms.myForm.clearAutoSave();
    Forms.myForm.reset();
  }
};
```

---

## Complete Workflows

### Workflow 1: Simple Draft System

```javascript
// 1. Restore on page load
Forms.contactForm.restore('contact-draft');

// 2. Enable auto-save
Forms.contactForm.autoSave('contact-draft', {
  interval: 1000,
  expires: 86400
});

// 3. Clear after submission
Forms.contactForm.on('submit', async (e) => {
  e.preventDefault();
  await submitForm();
  Forms.contactForm.clearAutoSave();
});

// 4. Manual clear button
document.getElementById('clearDraft').onclick = () => {
  Forms.contactForm.clearAutoSave();
  Forms.contactForm.reset();
};
```

### Workflow 2: Multi-Step Form

```javascript
// 1. Restore progress
Forms.wizardForm.restore('wizard-progress', {
  storage: 'sessionStorage'
});

// 2. Auto-save on each change
Forms.wizardForm.autoSave('wizard-progress', {
  storage: 'sessionStorage',
  interval: 500
});

// 3. Save step number separately
function goToStep(step) {
  Storage.session.set('wizard-step', step);
  // Show step UI
}

// 4. Clear on completion
function completeWizard() {
  Forms.wizardForm.clearAutoSave();
  Storage.session.remove('wizard-step');
}
```

### Workflow 3: Draft with Confirmation

```javascript
// 1. Check for draft on load
window.addEventListener('DOMContentLoaded', () => {
  if (Storage.has('article-draft')) {
    showDraftPrompt();
  }
});

function showDraftPrompt() {
  const modal = showModal('Draft found. Restore it?');
  modal.onConfirm = () => {
    Forms.articleForm.restore('article-draft');
    Forms.articleForm.autoSave('article-draft');
  };
  modal.onCancel = () => {
    Storage.remove('article-draft');
  };
}

// 2. Manual save button
document.getElementById('saveDraft').onclick = () => {
  Storage.set('article-draft', Forms.articleForm.values);
  showNotification('Draft saved!);
};

// 3. Clear on publish
Forms.articleForm.on('submit', async (e) => {
  e.preventDefault();
  await publishArticle();
  Forms.articleForm.clearAutoSave();
});
```

### Workflow 4: Auto-save with Visual Feedback

```javascript
// 1. Setup auto-save with status indicator
Forms.postEditor.autoSave('post-draft', {
  namespace: 'blog',
  interval: 2000
});

// 2. Show save status
let saveStatusTimeout;
Forms.postEditor.addEventListener('input', debounce(() => {
  showSaveStatus('Saving...');
  
  setTimeout(() => {
    showSaveStatus('All changes saved');
    
    saveStatusTimeout = setTimeout(() => {
      hideSaveStatus();
    }, 3000);
  }, 2100); // Slightly longer than auto-save interval
}, 2000));

function showSaveStatus(message) {
  const status = document.getElementById('saveStatus');
  status.textContent = message;
  status.classList.add('visible');
  clearTimeout(saveStatusTimeout);
}

function hideSaveStatus() {
  const status = document.getElementById('saveStatus');
  status.classList.remove('visible');
}

// 3. Restore with notification
if (Storage.namespace('blog').has('post-draft')) {
  Forms.postEditor.restore('post-draft', { namespace: 'blog' });
  showNotification('Draft restored', 'info');
}

// Helper function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
```

### Workflow 5: Form with Expiry Warning

```javascript
// 1. Setup with expiry
const EXPIRY_TIME = 3600; // 1 hour
Forms.applicationForm.autoSave('app-draft', {
  expires: EXPIRY_TIME
});

// 2. Check time remaining on page load
window.addEventListener('DOMContentLoaded', () => {
  const draftData = Storage.get('app-draft');
  
  if (draftData) {
    Forms.applicationForm.restore('app-draft');
    
    // Calculate time remaining (if stored with timestamp)
    const storage = localStorage.getItem('app-draft');
    if (storage) {
      const data = JSON.parse(storage);
      const timeRemaining = data.expires - Date.now();
      const minutesRemaining = Math.floor(timeRemaining / 60000);
      
      if (minutesRemaining < 10) {
        showWarning(`Your draft will expire in ${minutesRemaining} minutes!`);
      }
    }
  }
});

// 3. Periodic expiry check
setInterval(() => {
  if (!Storage.has('app-draft')) {
    showError('Your draft has expired. Please save your work.');
  }
}, 60000); // Check every minute

// 4. Extend expiry on activity
Forms.applicationForm.addEventListener('input', () => {
  const currentData = Forms.applicationForm.values;
  Storage.set('app-draft', currentData, { expires: EXPIRY_TIME });
});
```

---

## Common Patterns

### Pattern 1: Draft Manager Class

```javascript
class DraftManager {
  constructor(form, storageKey, options = {}) {
    this.form = form;
    this.storageKey = storageKey;
    this.options = {
      namespace: options.namespace || '',
      storage: options.storage || 'localStorage',
      interval: options.interval || 1000,
      expires: options.expires || 86400,
      autoRestore: options.autoRestore !== false,
      ...options
    };
    
    this.storage = this.options.namespace ?
      Storage.namespace(this.options.namespace) :
      (this.options.storage === 'sessionStorage' ? Storage.session : Storage);
    
    if (this.options.autoRestore) {
      this.restore();
    }
    
    this.enableAutoSave();
  }
  
  enableAutoSave() {
    this.form.autoSave(this.storageKey, {
      namespace: this.options.namespace,
      storage: this.options.storage,
      interval: this.options.interval,
      expires: this.options.expires
    });
  }
  
  restore() {
    if (this.hasDraft()) {
      this.form.restore(this.storageKey, {
        namespace: this.options.namespace,
        storage: this.options.storage
      });
      return true;
    }
    return false;
  }
  
  save() {
    const data = this.form.values;
    this.storage.set(this.storageKey, data, {
      expires: this.options.expires
    });
  }
  
  clear() {
    this.form.clearAutoSave();
  }
  
  hasDraft() {
    return this.storage.has(this.storageKey);
  }
  
  getDraftAge() {
    const key = this.storage._getKey(this.storageKey);
    const raw = localStorage.getItem(key);
    
    if (!raw) return null;
    
    try {
      const data = JSON.parse(raw);
      const age = Date.now() - data.timestamp;
      return Math.floor(age / 1000); // seconds
    } catch {
      return null;
    }
  }
  
  getTimeRemaining() {
    const key = this.storage._getKey(this.storageKey);
    const raw = localStorage.getItem(key);
    
    if (!raw) return null;
    
    try {
      const data = JSON.parse(raw);
      if (!data.expires) return Infinity;
      
      const remaining = data.expires - Date.now();
      return Math.floor(remaining / 1000); // seconds
    } catch {
      return null;
    }
  }
}

// Usage
const contactDraft = new DraftManager(
  Forms.contactForm,
  'contact-draft',
  {
    namespace: 'drafts',
    interval: 1000,
    expires: 86400,
    autoRestore: true
  }
);

// Check draft status
if (contactDraft.hasDraft()) {
  console.log(`Draft is ${contactDraft.getDraftAge()} seconds old`);
  console.log(`Expires in ${contactDraft.getTimeRemaining()} seconds`);
}

// Manual operations
contactDraft.save();
contactDraft.clear();
```

### Pattern 2: Form with Conflict Detection

```javascript
class ConflictAwareDraft {
  constructor(form, storageKey) {
    this.form = form;
    this.storageKey = storageKey;
    this.lastSavedHash = null;
    
    this.init();
  }
  
  init() {
    // Restore and check for conflicts
    const draft = Storage.get(this.storageKey);
    
    if (draft) {
      // Check if server data is newer
      this.checkForConflicts(draft);
    }
    
    // Enable auto-save
    this.form.autoSave(this.storageKey, {
      interval: 1000
    });
    
    // Track changes
    this.lastSavedHash = this.getFormHash();
  }
  
  async checkForConflicts(draft) {
    try {
      const serverData = await this.fetchServerData();
      
      if (this.isNewer(serverData, draft)) {
        this.handleConflict(serverData, draft);
      } else {
        this.form.restore(this.storageKey);
      }
    } catch {
      // If server check fails, restore draft anyway
      this.form.restore(this.storageKey);
    }
  }
  
  handleConflict(serverData, localDraft) {
    const choice = confirm(
      'A newer version exists on the server. ' +
      'Click OK to use server version, Cancel to use your local draft.'
    );
    
    if (choice) {
      this.form.values = serverData;
      this.form.clearAutoSave();
    } else {
      this.form.values = localDraft;
    }
  }
  
  isNewer(serverData, localDraft) {
    return serverData.updatedAt > localDraft.timestamp;
  }
  
  async fetchServerData() {
    const response = await fetch('/api/draft');
    return response.json();
  }
  
  getFormHash() {
    const values = JSON.stringify(this.form.values);
    return this.simpleHash(values);
  }
  
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }
  
  hasUnsavedChanges() {
    const currentHash = this.getFormHash();
    return currentHash !== this.lastSavedHash;
  }
}

// Usage
const editor = new ConflictAwareDraft(Forms.articleForm, 'article-draft');

// Warn before leaving with unsaved changes
window.addEventListener('beforeunload', (e) => {
  if (editor.hasUnsavedChanges()) {
    e.preventDefault();
    e.returnValue = '';
  }
});
```

### Pattern 3: Multi-Form Draft System

```javascript
class MultiFormDraftSystem {
  constructor() {
    this.forms = new Map();
    this.namespace = 'drafts';
  }
  
  register(formId, options = {}) {
    const form = Forms[formId];
    if (!form) {
      console.error(`Form ${formId} not found`);
      return;
    }
    
    const draftKey = options.key || formId;
    
    this.forms.set(formId, {
      form,
      key: draftKey,
      options: {
        interval: options.interval || 1000,
        expires: options.expires || 86400,
        ...options
      }
    });
    
    // Auto-restore
    form.restore(draftKey, {
      namespace: this.namespace
    });
    
    // Enable auto-save
    form.autoSave(draftKey, {
      namespace: this.namespace,
      interval: options.interval || 1000,
      expires: options.expires || 86400
    });
  }
  
  clearAll() {
    this.forms.forEach(({ form }) => {
      form.clearAutoSave();
    });
  }
  
  clearForm(formId) {
    const formData = this.forms.get(formId);
    if (formData) {
      formData.form.clearAutoSave();
    }
  }
  
  getAllDrafts() {
    const storage = Storage.namespace(this.namespace);
    const drafts = {};
    
    this.forms.forEach(({ key }, formId) => {
      if (storage.has(key)) {
        drafts[formId] = storage.get(key);
      }
    });
    
    return drafts;
  }
  
  hasDrafts() {
    const drafts = this.getAllDrafts();
    return Object.keys(drafts).length > 0;
  }
  
  getDraftCount() {
    return Object.keys(this.getAllDrafts()).length;
  }
  
  exportDrafts() {
    const drafts = this.getAllDrafts();
    const blob = new Blob([JSON.stringify(drafts, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drafts-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  importDrafts(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const drafts = JSON.parse(e.target.result);
        const storage = Storage.namespace(this.namespace);
        
        Object.entries(drafts).forEach(([formId, data]) => {
          const formData = this.forms.get(formId);
          if (formData) {
            storage.set(formData.key, data);
            formData.form.restore(formData.key, {
              namespace: this.namespace
            });
          }
        });
        
        alert('Drafts imported successfully!');
      } catch (error) {
        alert('Error importing drafts: ' + error.message);
      }
    };
    
    reader.readAsText(file);
  }
}

// Usage
const draftSystem = new MultiFormDraftSystem();

// Register multiple forms
draftSystem.register('contactForm', {
  interval: 1000,
  expires: 86400
});

draftSystem.register('feedbackForm', {
  interval: 1500,
  expires: 86400
});

draftSystem.register('applicationForm', {
  interval: 2000,
  expires: 604800 // 7 days
});

// Check draft status
console.log(`${draftSystem.getDraftCount()} drafts saved`);

// Export drafts
document.getElementById('exportDrafts').onclick = () => {
  draftSystem.exportDrafts();
};

// Import drafts
document.getElementById('importDrafts').onchange = (e) => {
  const file = e.target.files[0];
  if (file) {
    draftSystem.importDrafts(file);
  }
};

// Clear all drafts
document.getElementById('clearAllDrafts').onclick = () => {
  if (confirm('Clear all drafts?')) {
    draftSystem.clearAll();
  }
};
```

---

## Troubleshooting

### Issue 1: Form Not Auto-saving

**Problem:** Form changes aren't being saved

**Solutions:**
```javascript
// Check if Forms module is loaded
if (typeof Forms === 'undefined') {
  console.error('Forms module not loaded!');
}

// Check if form exists
if (!Forms.myForm) {
  console.error('Form with id="myForm" not found');
}

// Verify auto-save is enabled
Forms.myForm.autoSave('draft', {
  interval: 1000
});

// Check console for errors
// Look for "[DOM Helpers Storage]" messages
```

### Issue 2: Data Not Restoring

**Problem:** Saved data doesn't appear when restored

**Solutions:**
```javascript
// Check if data exists in storage
const data = Storage.get('draft-key');
console.log('Stored data:', data);

// Verify storage key matches
Forms.myForm.autoSave('my-draft'); // Save key
Forms.myForm.restore('my-draft');  // Must match!

// Check namespace
Forms.myForm.autoSave('draft', { namespace: 'forms' });
Forms.myForm.restore('draft', { namespace: 'forms' }); // Must match!

// Check storage type
Forms.myForm.autoSave('draft', { storage: 'sessionStorage' });
Forms.myForm.restore('draft', { storage: 'sessionStorage' }); // Must match!
```

### Issue 3: Expired Data

**Problem:** Draft disappears after some time

**Solutions:**
```javascript
// Check expiration settings
Forms.myForm.autoSave('draft', {
  expires: 86400 // 24 hours
});

// Increase expiration time
Forms.myForm.autoSave('draft', {
  expires: 604800 // 7 days
});

// Or remove expiration
Forms.myForm.autoSave('draft');
// No expires option = never expires
```

### Issue 4: Storage Quota Exceeded

**Problem:** Error when saving large forms

**Solutions:**
```javascript
// Clean up expired items first
Storage.cleanup();

// Use smaller intervals to save less frequently
Forms.myForm.autoSave('draft', {
  interval: 5000 // 5 seconds instead of 1
});

// Clear old drafts
Storage.namespace('drafts').clear();

// Use sessionStorage for temporary data
Forms.myForm.autoSave('draft', {
  storage: 'sessionStorage'
});
```

---

## Summary

**Quick Reference:**

| Method | Purpose | Example |
|--------|---------|---------|
| `autoSave(key, options)` | Enable auto-save | `form.autoSave('draft')` |
| `restore(key, options)` | Restore saved data | `form.restore('draft')` |
| `clearAutoSave()` | Clear auto-save | `form.clearAutoSave()` |

**Typical Workflow:**

```javascript
// 1. Restore on page load
Forms.myForm.restore('draft');

// 2. Enable auto-save
Forms.myForm.autoSave('draft', {
  interval: 1000,
  expires: 86400
});

// 3. Clear after submission
Forms.myForm.on('submit', async (e) => {
  e.preventDefault();
  await submit();
  Forms.myForm.clearAutoSave();
});
```

**Key Options:**

- `storage`: `'localStorage'` (persistent) or `'sessionStorage'` (temporary)
- `interval`: Debounce delay in milliseconds (default: 1000)
- `events`: Events that trigger save (default: `['input', 'change']`)
- `namespace`: Organize drafts (default: none)
- `expires`: Expiration time in seconds (default: none)

**Best Practices:**

✅ Restore before enabling auto-save  
✅ Use appropriate storage type  
✅ Set reasonable save intervals  
✅ Always clear after successful submission  
✅ Use namespaces for organization  
✅ Set expiration for drafts  
✅ Confirm before restoring/clearing  

**Common Use Cases:**

- 📝 Contact forms with drafts
- 📊 Multi-step wizards
- ✍️ Blog post editors
- 📋 Survey forms
- 📄 Application forms
- 💬 Comment forms
- 🛒 Checkout forms

Form storage integration makes it easy to create robust, user-friendly forms that never lose data!