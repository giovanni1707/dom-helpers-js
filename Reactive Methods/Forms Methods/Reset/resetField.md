# Understanding `resetField()` - A Beginner's Guide

## What is `resetField()`?

`resetField()` is a method that resets a **single field** back to its initial state. It clears the value, error, and touched state for just that one field.

Think of it as your **single field refresh button** - like `reset()`, but for one field instead of the whole form.

---

## Why Does This Exist?

### The Problem: Resetting One Field

You need to reset just one field without affecting the rest of the form:

```javascript
const form = Reactive.form({
  name: 'John',
  email: 'john@example.com',
  phone: '1234567890'
});

// User changes all fields
form.setValue('name', 'Jane');
form.setValue('email', 'jane@example.com');
form.setValue('phone', '9876543210');

// ❌ Want to reset only email, but have to manually do it all
form.values.email = 'john@example.com'; // Initial value
form.clearError('email');
form.touched.email = false;
// Easy to forget something

// ✅ With resetField() - one clean call
form.resetField('email');
// Email back to 'john@example.com', error and touched cleared
```

**Why this matters:**
- Reset individual fields without affecting others
- Single method for complete field reset
- Consistent reset behavior
- Cleaner code
- Better control

---

## How Does It Work?

### The Simple Process

When you call `resetField(fieldName)`:

1. **Resets field value** - Sets field back to initial value
2. **Clears field error** - Removes error message
3. **Clears touched state** - Marks field as untouched
4. **Triggers UI update** - Field appears fresh

Think of it like this:

```
resetField('email')
    ↓
Reset email value to initial
    ↓
Clear email error
    ↓
Clear email touched state
    ↓
Email field looks brand new
```

---

## Basic Usage

### Reset Single Field

```javascript
const form = Reactive.form({
  username: '',
  email: '',
  password: ''
});

// User fills fields
form.setValue('email', 'invalid-email');
form.setTouched('email');

// Reset just email
form.resetField('email');

console.log(form.values.email);    // '' (initial value)
console.log(form.hasError('email')); // false
console.log(form.isTouched('email')); // false
```

### Reset Button Per Field

```javascript
const form = Reactive.form({
  firstName: '',
  lastName: '',
  email: ''
});

document.getElementById('reset-email-btn').onclick = () => {
  form.resetField('email');
};
```

### Reset Field with Initial Value

```javascript
const form = Reactive.form({
  country: 'USA',
  state: 'California'
});

// User changes
form.setValue('country', 'Canada');

// Reset to 'USA'
form.resetField('country');

console.log(form.values.country); // 'USA'
```

---

## Simple Examples Explained

### Example 1: Field-Level Reset Buttons

```javascript
const profileForm = Reactive.form(
  {
    username: 'john_doe',
    email: 'john@example.com',
    bio: 'Developer and designer',
    website: 'https://johndoe.com'
  },
  {
    validators: {
      username: Reactive.validators.minLength(3),
      email: Reactive.validators.email(),
      website: Reactive.validators.pattern(/^https?:\/\//)
    }
  }
);

// Reset button for each field
['username', 'email', 'bio', 'website'].forEach(field => {
  const resetBtn = document.getElementById(`reset-${field}-btn`);

  resetBtn.onclick = () => {
    if (confirm(`Reset ${field} to original value?`)) {
      profileForm.resetField(field);
    }
  };

  // Show reset button only if field changed
  Reactive.effect(() => {
    const input = document.getElementById(field);
    const initialValue = profileForm.initialValues[field];
    const currentValue = profileForm.values[field];

    resetBtn.style.display = currentValue !== initialValue ? 'inline-block' : 'none';
  });
});
```

**What happens:**

1. Each field has its own reset button
2. Buttons only appear when field changes
3. Clicking resets that specific field
4. Other fields remain unchanged
5. Confirmation prevents accidents

---

### Example 2: Conditional Field Reset

```javascript
const orderForm = Reactive.form({
  shippingCountry: 'USA',
  shippingState: 'California',
  shippingCity: '',
  billingCountry: 'USA',
  billingState: 'California',
  billingCity: '',
  sameAsShipping: true
});

// When country changes, reset state and city
Reactive.effect(() => {
  const country = orderForm.values.shippingCountry;

  // Reset dependent fields when country changes
  orderForm.resetField('shippingState');
  orderForm.resetField('shippingCity');
});

// Copy shipping to billing
document.getElementById('copy-shipping-btn').onclick = () => {
  orderForm.setValue('billingCountry', orderForm.values.shippingCountry);
  orderForm.setValue('billingState', orderForm.values.shippingState);
  orderForm.setValue('billingCity', orderForm.values.shippingCity);
};

// Reset billing address
document.getElementById('reset-billing-btn').onclick = () => {
  orderForm.resetField('billingCountry');
  orderForm.resetField('billingState');
  orderForm.resetField('billingCity');
};
```

**What happens:**

1. Changing country resets state and city
2. Can copy shipping to billing
3. Can reset billing address separately
4. Shipping address remains untouched
5. Granular control over resets

---

### Example 3: Undo Single Field Change

```javascript
const settingsForm = Reactive.form({
  theme: 'light',
  fontSize: 16,
  language: 'en',
  notifications: true
});

// Track which fields user changed
const changedFields = new Set();

// Watch for changes
Reactive.effect(() => {
  const fields = ['theme', 'fontSize', 'language', 'notifications'];

  fields.forEach(field => {
    const initial = settingsForm.initialValues[field];
    const current = settingsForm.values[field];

    if (current !== initial) {
      changedFields.add(field);
    } else {
      changedFields.delete(field);
    }
  });

  // Show undo button if any changes
  document.getElementById('undo-btn').style.display =
    changedFields.size > 0 ? 'block' : 'none';
});

// Undo all changes
document.getElementById('undo-btn').onclick = () => {
  if (confirm(`Undo ${changedFields.size} change(s)?`)) {
    changedFields.forEach(field => {
      settingsForm.resetField(field);
    });
    changedFields.clear();
  }
};

// Undo single field (keyboard shortcut)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') {
    const activeField = document.activeElement.name;
    if (activeField && changedFields.has(activeField)) {
      settingsForm.resetField(activeField);
      alert(`Undone: ${activeField}`);
    }
  }
});
```

**What happens:**

1. Tracks which fields changed
2. Shows undo button when changes exist
3. Can undo all changes at once
4. Ctrl+Z undoes focused field
5. Other fields remain unaffected

---

## Real-World Example: Dynamic Form with Field Reset

```javascript
const accountForm = Reactive.form(
  {
    accountType: 'personal',
    companyName: '',
    taxId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    receiveNewsletter: false
  },
  {
    validators: {
      companyName: Reactive.validators.custom(
        (value, values) => {
          if (values.accountType === 'business' && !value) {
            return 'Company name is required for business accounts';
          }
          return true;
        }
      ),
      taxId: Reactive.validators.custom(
        (value, values) => {
          if (values.accountType === 'business' && !value) {
            return 'Tax ID is required for business accounts';
          }
          return true;
        }
      ),
      firstName: Reactive.validators.required(),
      lastName: Reactive.validators.required(),
      email: Reactive.validators.email(),
      phone: Reactive.validators.pattern(/^\d{10}$/, 'Phone must be 10 digits')
    }
  }
);

// When account type changes, reset business fields
Reactive.effect(() => {
  const accountType = accountForm.values.accountType;

  if (accountType === 'personal') {
    // Reset business-only fields
    accountForm.resetField('companyName');
    accountForm.resetField('taxId');

    // Hide business fields
    document.getElementById('business-fields').style.display = 'none';
  } else {
    // Show business fields
    document.getElementById('business-fields').style.display = 'block';
  }
});

// Individual field reset buttons
['companyName', 'taxId', 'firstName', 'lastName', 'email', 'phone'].forEach(field => {
  const resetBtn = document.getElementById(`${field}-reset`);
  const input = document.getElementById(field);

  resetBtn.onclick = () => {
    accountForm.resetField(field);
    input.focus();
  };

  // Show reset button only if field changed and has value
  Reactive.effect(() => {
    const initial = accountForm.initialValues[field];
    const current = accountForm.values[field];
    const hasChanged = current !== initial;
    const hasValue = current !== '' && current !== null;

    resetBtn.style.display = (hasChanged && hasValue) ? 'inline-block' : 'none';
  });
});

// Reset all personal info
document.getElementById('reset-personal-btn').onclick = () => {
  if (confirm('Reset all personal information?')) {
    accountForm.resetField('firstName');
    accountForm.resetField('lastName');
    accountForm.resetField('email');
    accountForm.resetField('phone');
  }
};

// Reset all business info
document.getElementById('reset-business-btn').onclick = () => {
  if (confirm('Reset all business information?')) {
    accountForm.resetField('companyName');
    accountForm.resetField('taxId');
  }
};

// Show changed fields count
Reactive.effect(() => {
  const fields = Object.keys(accountForm.values);
  const changedCount = fields.filter(field => {
    return accountForm.values[field] !== accountForm.initialValues[field];
  }).length;

  const statusElement = document.getElementById('changes-status');
  if (changedCount > 0) {
    statusElement.textContent = `${changedCount} field(s) modified`;
    statusElement.className = 'status-modified';
  } else {
    statusElement.textContent = 'No changes';
    statusElement.className = 'status-clean';
  }
});

// Form submission
document.getElementById('account-form').onsubmit = async (e) => {
  e.preventDefault();

  accountForm.touchAll();

  if (!accountForm.isValid) {
    alert('Please fix the errors');
    return;
  }

  try {
    await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountForm.values)
    });

    alert('Account updated successfully!');
    // Don't reset - keep values as new baseline
  } catch (err) {
    alert('Failed to update account');
  }
};
```

**What happens:**
- Switching account type resets business fields
- Each field has individual reset button
- Reset buttons only show when field changed
- Can reset personal or business info as groups
- Shows count of modified fields
- Granular control over what to reset
- Professional field management

---

## Common Patterns

### Pattern 1: Reset Single Field

```javascript
form.resetField('email');
```

### Pattern 2: Reset Multiple Specific Fields

```javascript
['field1', 'field2', 'field3'].forEach(field => {
  form.resetField(field);
});
```

### Pattern 3: Reset Field and Focus

```javascript
form.resetField('email');
document.getElementById('email').focus();
```

### Pattern 4: Conditional Field Reset

```javascript
if (form.values.email !== form.initialValues.email) {
  form.resetField('email');
}
```

---

## Common Beginner Questions

### Q: What's the difference between `resetField()` and `reset()`?

**Answer:**

- **`resetField(field)`** = Reset ONE field
- **`reset()`** = Reset ENTIRE form

```javascript
// Reset one field
form.resetField('email'); // Only email reset

// Reset all fields
form.reset(); // Everything reset
```

### Q: Can I reset a field that doesn't exist?

**Answer:**

Yes, but it has no effect:

```javascript
form.resetField('nonexistent'); // No error, just does nothing
```

### Q: Does `resetField()` trigger validation?

**Answer:**

No, it clears the error without running validators:

```javascript
form.setValue('email', 'invalid'); // Validator runs
form.resetField('email'); // No validation, just clears
```

### Q: Does it reset to empty or initial value?

**Answer:**

It resets to the **initial value** from form creation:

```javascript
const form = Reactive.form({
  name: 'John', // Initial value
  email: ''
});

form.setValue('name', 'Jane');
form.resetField('name');

console.log(form.values.name); // 'John' (not '')
```

### Q: Is `resetField()` reactive?

**Answer:**

Yes, it triggers reactive updates:

```javascript
Reactive.effect(() => {
  console.log(form.values.email);
  // Re-runs when resetField('email') is called
});

form.resetField('email'); // Effect runs
```

---

## Tips for Success

### 1. Use for Dependent Fields

```javascript
// ✅ Reset dependent fields when parent changes
Reactive.effect(() => {
  if (form.values.country !== previousCountry) {
    form.resetField('state');
    form.resetField('city');
  }
});
```

### 2. Reset Field and Refocus

```javascript
// ✅ Help user start over on that field
form.resetField('email');
document.getElementById('email').focus();
```

### 3. Show Reset Button When Changed

```javascript
// ✅ Only show when field changed
Reactive.effect(() => {
  const changed = form.values.email !== form.initialValues.email;
  resetBtn.style.display = changed ? 'block' : 'none';
});
```

### 4. Reset Related Fields Together

```javascript
// ✅ Group related resets
function resetAddress() {
  form.resetField('street');
  form.resetField('city');
  form.resetField('state');
  form.resetField('zip');
}
```

### 5. Confirm Before Reset if Field Has Content

```javascript
// ✅ Prevent accidental data loss
if (form.values.message && !confirm('Clear message?')) {
  return;
}
form.resetField('message');
```

---

## Summary

### What `resetField()` Does:

1. ✅ Resets single field value to initial state
2. ✅ Clears field error message
3. ✅ Clears field touched state
4. ✅ Doesn't affect other fields
5. ✅ Triggers reactive UI updates

### When to Use It:

- Individual field reset buttons
- Resetting dependent fields
- Undo functionality
- Clearing specific sections
- Conditional resets
- When you need surgical field control

### The Basic Pattern:

```javascript
const form = Reactive.form({ field: 'initial' });

// Reset single field
form.resetField('field');

// Common: Reset button per field
resetBtn.onclick = () => {
  form.resetField('fieldName');
};

// Reset dependent fields
Reactive.effect(() => {
  if (form.values.country !== previousCountry) {
    form.resetField('state');
    form.resetField('city');
  }
});
```

---

**Remember:** `resetField()` is like `reset()` but for a single field. Use it when you want surgical control - reset one field without affecting the rest of your form! 🎉
