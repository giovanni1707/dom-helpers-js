# Understanding `reset()` - A Beginner's Guide

## What is `reset()`?

`reset()` is a method that resets the entire form back to its initial state. It clears all values, errors, touched states, and submission counts - essentially giving you a fresh form.

Think of it as your **form refresh button** - it returns the form to exactly how it was when first created.

---

## Why Does This Exist?

### The Problem: Starting Fresh After Submit

You need to clear the form after successful submission or let users start over:

```javascript
const form = Reactive.form(
  {
    name: '',
    email: '',
    message: ''
  },
  {
    validators: {
      name: Reactive.validators.required(),
      email: Reactive.validators.email(),
      message: Reactive.validators.minLength(10)
    }
  }
);

// ❌ Manual reset - tedious and error-prone
form.onsubmit = async (e) => {
  e.preventDefault();

  if (form.isValid) {
    await submitForm();

    // Clear everything manually
    form.values.name = '';
    form.values.email = '';
    form.values.message = '';
    form.errors = {};
    form.touched = { name: false, email: false, message: false };
    form.submitCount = 0;
    // Did I forget anything?
  }
};

// ✅ With reset() - one clean call
form.onsubmit = async (e) => {
  e.preventDefault();

  if (form.isValid) {
    await submitForm();
    form.reset(); // Everything cleared!
  }
};
```

**Why this matters:**
- Single method clears everything
- Returns to initial state
- Consistent reset behavior
- No forgotten properties
- Better user experience

---

## How Does It Work?

### The Simple Process

When you call `reset()`:

1. **Resets all values** - Sets fields back to initial values
2. **Clears all errors** - Removes all error messages
3. **Clears touched state** - Marks all fields as untouched
4. **Resets submit count** - Sets `submitCount` to 0
5. **Triggers UI update** - Form appears fresh

Think of it like this:

```
reset()
    ↓
Reset values to initial state
    ↓
Clear all errors
    ↓
Clear all touched states
    ↓
Reset submitCount to 0
    ↓
Form looks brand new
```

---

## Basic Usage

### Reset After Submission

```javascript
const form = Reactive.form({
  email: '',
  password: ''
});

document.querySelector('form').onsubmit = async (e) => {
  e.preventDefault();

  if (form.isValid) {
    await submitForm(form.values);
    form.reset(); // Clear form
    alert('Form submitted and reset!');
  }
};
```

### Reset Button

```javascript
const form = Reactive.form({
  username: '',
  email: '',
  message: ''
});

document.getElementById('reset-btn').onclick = () => {
  form.reset();
  alert('Form has been reset');
};
```

### Reset with Custom Values

```javascript
const form = Reactive.form({
  name: 'John',
  email: 'john@example.com'
});

// User makes changes
form.setValue('name', 'Jane');
form.setValue('email', 'jane@example.com');

// Reset to original values
form.reset();

console.log(form.values);
// { name: 'John', email: 'john@example.com' }
```

---

## Simple Examples Explained

### Example 1: Contact Form Reset

```javascript
const contactForm = Reactive.form(
  {
    name: '',
    email: '',
    subject: '',
    message: ''
  },
  {
    validators: {
      name: Reactive.validators.required(),
      email: Reactive.validators.email(),
      subject: Reactive.validators.required(),
      message: Reactive.validators.minLength(10)
    }
  }
);

// Show success message and reset
document.getElementById('contact-form').onsubmit = async (e) => {
  e.preventDefault();

  contactForm.touchAll();

  if (contactForm.isValid) {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(contactForm.values)
      });

      // Success!
      alert('Message sent successfully!');
      contactForm.reset(); // Clear form
    } catch (err) {
      alert('Failed to send message');
    }
  }
};
```

**What happens:**

1. User fills form and submits
2. Validation passes
3. Form submitted successfully
4. Success message shown
5. Form reset to empty state
6. User can submit again

---

### Example 2: Form with Reset Button

```javascript
const registrationForm = Reactive.form({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Submit button
document.getElementById('submit-btn').onclick = (e) => {
  e.preventDefault();
  registrationForm.touchAll();

  if (registrationForm.isValid) {
    submitRegistration();
    registrationForm.reset();
  }
};

// Reset button
document.getElementById('reset-btn').onclick = () => {
  if (confirm('Are you sure you want to reset the form?')) {
    registrationForm.reset();
  }
};

// Show reset button only if form is dirty
Reactive.effect(() => {
  const resetBtn = document.getElementById('reset-btn');
  resetBtn.style.display = registrationForm.isDirty ? 'inline-block' : 'none';
});
```

**What happens:**

1. User starts filling form
2. Reset button appears (form is dirty)
3. User can click reset any time
4. Confirmation dialog prevents accidents
5. Form returns to initial empty state
6. Reset button hides (form no longer dirty)

---

### Example 3: Multi-Step Form Reset

```javascript
const wizardForm = Reactive.form({
  // Step 1
  firstName: '',
  lastName: '',

  // Step 2
  email: '',
  phone: '',

  // Step 3
  address: '',
  city: '',
  zipCode: ''
});

let currentStep = 1;

function goToNextStep() {
  if (isCurrentStepValid()) {
    currentStep++;
    updateStepDisplay();
  }
}

function goToPreviousStep() {
  currentStep--;
  updateStepDisplay();
}

// Start over button
document.getElementById('start-over-btn').onclick = () => {
  if (confirm('Start over? All progress will be lost.')) {
    wizardForm.reset();
    currentStep = 1;
    updateStepDisplay();
  }
};

// Reset after completion
function completeWizard() {
  alert('Wizard completed!');
  wizardForm.reset();
  currentStep = 1;
  updateStepDisplay();
}
```

**What happens:**

1. User fills multi-step form
2. "Start Over" button available throughout
3. Clicking resets all steps
4. Returns to step 1
5. After completion, form resets
6. Ready for next use

---

## Real-World Example: Complete Feedback Form

```javascript
const feedbackForm = Reactive.form(
  {
    name: '',
    email: '',
    rating: 5,
    category: '',
    feedback: '',
    allowContact: false
  },
  {
    validators: {
      name: Reactive.validators.required('Name is required'),
      email: Reactive.validators.email('Please enter a valid email'),
      rating: Reactive.validators.custom(
        (value) => value >= 1 && value <= 5,
        'Rating must be between 1 and 5'
      ),
      category: Reactive.validators.required('Please select a category'),
      feedback: Reactive.validators.combine(
        Reactive.validators.required('Feedback is required'),
        Reactive.validators.minLength(20, 'Feedback must be at least 20 characters')
      )
    }
  }
);

// Show form state
Reactive.effect(() => {
  const statusElement = document.getElementById('form-status');

  if (feedbackForm.isDirty) {
    statusElement.textContent = '⚠️ Form has unsaved changes';
    statusElement.className = 'status-warning';
  } else {
    statusElement.textContent = '✓ Form is empty';
    statusElement.className = 'status-clean';
  }
});

// Warn before leaving if form is dirty
window.onbeforeunload = (e) => {
  if (feedbackForm.isDirty) {
    e.preventDefault();
    return 'You have unsaved changes. Are you sure you want to leave?';
  }
};

// Submit handler
document.getElementById('feedback-form').onsubmit = async (e) => {
  e.preventDefault();

  feedbackForm.touchAll();

  if (!feedbackForm.isValid) {
    alert('Please fix the errors before submitting');
    return;
  }

  try {
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackForm.values)
    });

    if (response.ok) {
      // Show success message
      showSuccessMessage('Thank you for your feedback!');

      // Reset form
      feedbackForm.reset();

      // Reset UI
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Feedback';
    } else {
      throw new Error('Submission failed');
    }
  } catch (err) {
    alert('Failed to submit feedback. Please try again.');

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Feedback';
  }
};

// Reset button
document.getElementById('reset-btn').onclick = () => {
  if (!feedbackForm.isDirty) {
    alert('Form is already empty');
    return;
  }

  if (confirm('Are you sure you want to clear the form?')) {
    feedbackForm.reset();
    alert('Form has been reset');
  }
};

// Auto-save draft
let autoSaveTimeout;
Reactive.effect(() => {
  if (feedbackForm.isDirty) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      localStorage.setItem('feedbackDraft', JSON.stringify(feedbackForm.values));
    }, 1000);
  }
});

// Load draft on page load
const draft = localStorage.getItem('feedbackDraft');
if (draft) {
  if (confirm('Load saved draft?')) {
    feedbackForm.setValues(JSON.parse(draft));
  } else {
    localStorage.removeItem('feedbackDraft');
  }
}

// Clear draft after successful submission
function showSuccessMessage(message) {
  localStorage.removeItem('feedbackDraft');

  const successElement = document.getElementById('success-message');
  successElement.textContent = message;
  successElement.style.display = 'block';

  setTimeout(() => {
    successElement.style.display = 'none';
  }, 5000);
}
```

**What happens:**
- Form shows dirty/clean status
- Warns before leaving page if dirty
- Auto-saves draft every second
- Offers to load saved draft
- On successful submit, resets form
- Clears saved draft
- Shows success message
- Ready for next submission

---

## Common Patterns

### Pattern 1: Reset After Successful Submit

```javascript
form.onsubmit = async (e) => {
  e.preventDefault();

  if (form.isValid) {
    await submitForm();
    form.reset();
  }
};
```

### Pattern 2: Reset with Confirmation

```javascript
resetBtn.onclick = () => {
  if (confirm('Clear form?')) {
    form.reset();
  }
};
```

### Pattern 3: Conditional Reset Button

```javascript
Reactive.effect(() => {
  resetBtn.disabled = !form.isDirty;
});
```

### Pattern 4: Reset and Focus First Field

```javascript
function resetForm() {
  form.reset();
  document.getElementById('first-field').focus();
}
```

---

## Common Beginner Questions

### Q: What's the difference between `reset()` and `clearErrors()`?

**Answer:**

- **`reset()`** = Resets EVERYTHING (values, errors, touched, submitCount)
- **`clearErrors()`** = Only clears errors (keeps values, touched, etc.)

```javascript
// reset() - full reset
form.reset();
// Values: initial, Errors: cleared, Touched: cleared

// clearErrors() - only errors
form.clearErrors();
// Values: unchanged, Errors: cleared, Touched: unchanged
```

### Q: Does `reset()` restore initial values or empty the form?

**Answer:**

It restores the **initial values** you provided when creating the form:

```javascript
const form = Reactive.form({
  name: 'John',
  email: 'john@example.com'
});

form.setValue('name', 'Jane');
form.reset();

console.log(form.values.name); // 'John' (initial value)
```

### Q: Can I reset to different values than initial?

**Answer:**

Not directly with `reset()`. You'd need to use `setValues()`:

```javascript
// Reset to specific values
form.setValues({
  name: '',
  email: '',
  phone: ''
});

// Or create new form with those values
```

### Q: Does `reset()` trigger validation?

**Answer:**

No, `reset()` clears errors without running validators:

```javascript
form.setValue('email', 'invalid'); // Validation runs, error set
form.reset(); // Errors cleared, no validation runs
```

### Q: Is `reset()` reactive?

**Answer:**

Yes, it triggers reactive updates:

```javascript
Reactive.effect(() => {
  console.log(form.values.email);
  // Re-runs when reset() is called
});

form.reset(); // Effect runs
```

---

## Tips for Success

### 1. Always Reset After Successful Submit

```javascript
// ✅ Clean UX
if (form.isValid) {
  await submit();
  form.reset();
}
```

### 2. Confirm Before Reset if Form is Dirty

```javascript
// ✅ Prevent accidental data loss
if (form.isDirty && !confirm('Clear form?')) {
  return;
}
form.reset();
```

### 3. Show Reset Button Only When Needed

```javascript
// ✅ Hide when form is clean
Reactive.effect(() => {
  resetBtn.style.display = form.isDirty ? 'inline-block' : 'none';
});
```

### 4. Focus First Field After Reset

```javascript
// ✅ Help user start over
form.reset();
document.getElementById('first-field').focus();
```

### 5. Clear Any Saved Drafts

```javascript
// ✅ Complete cleanup
form.reset();
localStorage.removeItem('formDraft');
```

---

## Summary

### What `reset()` Does:

1. ✅ Resets all values to initial state
2. ✅ Clears all error messages
3. ✅ Clears all touched states
4. ✅ Resets submitCount to 0
5. ✅ Triggers reactive UI updates

### When to Use It:

- After successful form submission (most common)
- Reset button functionality
- Starting over in multi-step forms
- Canceling form changes
- Clearing form after errors
- Preparing form for next use

### The Basic Pattern:

```javascript
const form = Reactive.form({ field1: '', field2: '' });

// Reset entire form
form.reset();

// Common: After submit
form.onsubmit = async (e) => {
  e.preventDefault();

  if (form.isValid) {
    await submitForm();
    form.reset(); // Start fresh
    alert('Submitted successfully!');
  }
};

// Reset button
resetBtn.onclick = () => {
  if (confirm('Clear form?')) {
    form.reset();
  }
};
```

---

**Remember:** `reset()` is your complete form refresh. It returns everything to the initial state - values, errors, touched states, and submit count. Use it after successful submissions or to let users start over! 🎉
