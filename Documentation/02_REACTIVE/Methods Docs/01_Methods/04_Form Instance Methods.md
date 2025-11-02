# Form Instance Methods - Complete Guide

## Overview

Forms provide a specialized reactive state manager for handling form inputs, validation, touched states, and submission flows. Created with `ReactiveUtils.form()`, forms are ideal for login pages, registration, settings panels, surveys, and any user input scenario.

---

## Table of Contents

1. [$setValue(field, value)](#setvaluefield-value) - Set field value and mark as touched
2. [$setError(field, error)](#seterrorfield-error) - Set or clear validation error
3. [$reset(newValues)](#resetnewvalues) - Reset form to initial or new values
4. [values Property](#values-property) - Access all form field values
5. [errors Property](#errors-property) - Access validation errors
6. [touched Property](#touched-property) - Track user-interacted fields
7. [isSubmitting Property](#issubmitting-property) - Submission state flag
8. [isValid Computed Property](#isvalid-computed-property) - Check if form has no errors
9. [isDirty Computed Property](#isdirty-computed-property) - Check if any field touched
10. [Complete Example - Registration Form](#complete-example---registration-form) - Full implementation
11. [Best Practices Summary](#best-practices-summary) - Do's and Don'ts
12. [API Quick Reference](#api-quick-reference) - Quick lookup

---

## `$setValue(field, value)`

Set a form field value and automatically mark it as touched.

### Syntax
```javascript
form.$setValue(field, value)
```

### Parameters
- **`field`** (String) - Name of the form field
- **`value`** (any) - New value for the field

### Returns
- `undefined`

### Example - Basic Usage
```javascript
const loginForm = ReactiveUtils.form({
  email: '',
  password: ''
});

// Set field values
loginForm.$setValue('email', 'user@example.com');
loginForm.$setValue('password', 'secret123');

console.log(loginForm.values.email); // "user@example.com"
console.log(loginForm.touched.email); // true
```

### Example - Input Event Handlers
```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  age: ''
});

// HTML: <input id="username" type="text">
document.getElementById('username').addEventListener('input', (e) => {
  form.$setValue('username', e.target.value);
});

document.getElementById('email').addEventListener('input', (e) => {
  form.$setValue('email', e.target.value);
});

document.getElementById('age').addEventListener('input', (e) => {
  form.$setValue('age', parseInt(e.target.value) || 0);
});
```

### Advanced Example - With Validation
```javascript
const registrationForm = ReactiveUtils.form({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

function setUsername(value) {
  registrationForm.$setValue('username', value);
  
  // Validate
  if (value.length < 3) {
    registrationForm.$setError('username', 'Username must be at least 3 characters');
  } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    registrationForm.$setError('username', 'Username can only contain letters, numbers, and underscores');
  } else {
    registrationForm.$setError('username', null);
  }
}

function setEmail(value) {
  registrationForm.$setValue('email', value);
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    registrationForm.$setError('email', 'Invalid email address');
  } else {
    registrationForm.$setError('email', null);
  }
}

function setPassword(value) {
  registrationForm.$setValue('password', value);
  
  // Validate password strength
  if (value.length < 8) {
    registrationForm.$setError('password', 'Password must be at least 8 characters');
  } else if (!/[A-Z]/.test(value)) {
    registrationForm.$setError('password', 'Password must contain an uppercase letter');
  } else if (!/[0-9]/.test(value)) {
    registrationForm.$setError('password', 'Password must contain a number');
  } else {
    registrationForm.$setError('password', null);
  }
  
  // Re-validate confirm password if already filled
  if (registrationForm.values.confirmPassword) {
    setConfirmPassword(registrationForm.values.confirmPassword);
  }
}

function setConfirmPassword(value) {
  registrationForm.$setValue('confirmPassword', value);
  
  if (value !== registrationForm.values.password) {
    registrationForm.$setError('confirmPassword', 'Passwords do not match');
  } else {
    registrationForm.$setError('confirmPassword', null);
  }
}
```

### Example - With Debouncing
```javascript
const searchForm = ReactiveUtils.form({
  query: '',
  results: []
});

let debounceTimer;

function setSearchQuery(value) {
  searchForm.$setValue('query', value);
  
  // Clear previous timer
  clearTimeout(debounceTimer);
  
  // Debounce API call
  if (value.trim()) {
    debounceTimer = setTimeout(async () => {
      const results = await searchAPI(value);
      searchForm.values.results = results;
    }, 300);
  } else {
    searchForm.values.results = [];
  }
}

// HTML: <input type="text" oninput="setSearchQuery(this.value)">
```

### Example - Type Conversion
```javascript
const productForm = ReactiveUtils.form({
  name: '',
  price: 0,
  quantity: 0,
  available: false,
  tags: []
});

function setPrice(value) {
  // Convert string to number
  const numericValue = parseFloat(value) || 0;
  productForm.$setValue('price', Math.max(0, numericValue));
}

function setQuantity(value) {
  // Integer only
  const intValue = parseInt(value) || 0;
  productForm.$setValue('quantity', Math.max(0, intValue));
}

function toggleAvailable() {
  productForm.$setValue('available', !productForm.values.available);
}

function addTag(tag) {
  const currentTags = productForm.values.tags;
  if (!currentTags.includes(tag)) {
    productForm.$setValue('tags', [...currentTags, tag]);
  }
}
```

### Example - Nested Field Values
```javascript
const profileForm = ReactiveUtils.form({
  user: {
    firstName: '',
    lastName: '',
    email: ''
  },
  address: {
    street: '',
    city: '',
    zipCode: ''
  }
});

// For nested fields, update the parent object
function setFirstName(value) {
  profileForm.$setValue('user', {
    ...profileForm.values.user,
    firstName: value
  });
}

function setCity(value) {
  profileForm.$setValue('address', {
    ...profileForm.values.address,
    city: value
  });
}

// Or use a helper function
function setNestedValue(path, value) {
  const keys = path.split('.');
  const field = keys[0];
  const nestedKey = keys[1];
  
  profileForm.$setValue(field, {
    ...profileForm.values[field],
    [nestedKey]: value
  });
}

setNestedValue('user.firstName', 'John');
setNestedValue('address.city', 'New York');
```

### Use Cases
- Input field changes
- Checkbox toggles
- Radio button selections
- Dropdown selections
- Textarea updates
- File uploads
- Date/time pickers

### Important Notes
- Automatically marks field as **touched**
- Does **not** trigger validation automatically (do that separately)
- Triggers reactivity - any watchers/computed will update
- Can set any value type (string, number, boolean, object, array)

---

## `$setError(field, error)`

Set or clear a validation error for a specific field.

### Syntax
```javascript
form.$setError(field, error)
```

### Parameters
- **`field`** (String) - Name of the form field
- **`error`** (String|null) - Error message or `null` to clear

### Returns
- `undefined`

### Example - Basic Validation
```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Set error
form.$setError('email', 'Invalid email format');

// Clear error
form.$setError('email', null);

console.log(form.errors.email); // null
console.log(form.isValid); // true (if no other errors)
```

### Example - Real-Time Validation
```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  password: ''
});

// Watch username changes
form.$watch('values', (values) => {
  // Username validation
  if (values.username.length > 0 && values.username.length < 3) {
    form.$setError('username', 'Username must be at least 3 characters');
  } else if (values.username.length > 20) {
    form.$setError('username', 'Username must be less than 20 characters');
  } else {
    form.$setError('username', null);
  }
  
  // Email validation
  if (values.email && !values.email.includes('@')) {
    form.$setError('email', 'Invalid email address');
  } else {
    form.$setError('email', null);
  }
  
  // Password validation
  if (values.password.length > 0 && values.password.length < 8) {
    form.$setError('password', 'Password must be at least 8 characters');
  } else {
    form.$setError('password', null);
  }
});

// Bind errors to DOM
form.$bind({
  '#username-error': () => form.errors.username || '',
  '#email-error': () => form.errors.email || '',
  '#password-error': () => form.errors.password || ''
});
```

### Advanced Example - Multi-Field Validation
```javascript
const form = ReactiveUtils.form({
  password: '',
  confirmPassword: '',
  startDate: '',
  endDate: ''
});

// Cross-field validation
form.$watch('values', (values) => {
  // Password match validation
  if (values.confirmPassword && values.password !== values.confirmPassword) {
    form.$setError('confirmPassword', 'Passwords must match');
  } else {
    form.$setError('confirmPassword', null);
  }
  
  // Date range validation
  if (values.startDate && values.endDate) {
    const start = new Date(values.startDate);
    const end = new Date(values.endDate);
    
    if (end <= start) {
      form.$setError('endDate', 'End date must be after start date');
    } else {
      form.$setError('endDate', null);
    }
  }
});
```

### Example - Async Validation
```javascript
const form = ReactiveUtils.form({
  username: '',
  email: ''
});

let validationTimer;

async function validateUsername(username) {
  clearTimeout(validationTimer);
  
  if (username.length < 3) {
    form.$setError('username', 'Username must be at least 3 characters');
    return;
  }
  
  // Debounce API call
  validationTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/check-username?username=${username}`);
      const data = await response.json();
      
      if (data.exists) {
        form.$setError('username', 'Username already taken');
      } else {
        form.$setError('username', null);
      }
    } catch (error) {
      form.$setError('username', 'Unable to validate username');
    }
  }, 500);
}

async function validateEmail(email) {
  clearTimeout(validationTimer);
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    form.$setError('email', 'Invalid email format');
    return;
  }
  
  validationTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/check-email?email=${email}`);
      const data = await response.json();
      
      if (data.exists) {
        form.$setError('email', 'Email already registered');
      } else {
        form.$setError('email', null);
      }
    } catch (error) {
      form.$setError('email', 'Unable to validate email');
    }
  }, 500);
}

// Watch for changes
form.$watch('values', (values) => {
  if (form.touched.username) {
    validateUsername(values.username);
  }
  if (form.touched.email) {
    validateEmail(values.email);
  }
});
```

### Example - Validation Rules Engine
```javascript
const form = ReactiveUtils.form({
  name: '',
  email: '',
  age: 0,
  website: ''
});

const validationRules = {
  name: [
    {
      test: (value) => value.length >= 2,
      message: 'Name must be at least 2 characters'
    },
    {
      test: (value) => /^[a-zA-Z\s]+$/.test(value),
      message: 'Name can only contain letters and spaces'
    }
  ],
  email: [
    {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Invalid email format'
    }
  ],
  age: [
    {
      test: (value) => value >= 18,
      message: 'Must be at least 18 years old'
    },
    {
      test: (value) => value <= 120,
      message: 'Invalid age'
    }
  ],
  website: [
    {
      test: (value) => !value || /^https?:\/\/.+/.test(value),
      message: 'Website must start with http:// or https://'
    }
  ]
};

function validateField(field, value) {
  const rules = validationRules[field];
  if (!rules) return;
  
  for (const rule of rules) {
    if (!rule.test(value)) {
      form.$setError(field, rule.message);
      return;
    }
  }
  
  // All rules passed
  form.$setError(field, null);
}

function validateAll() {
  Object.keys(validationRules).forEach(field => {
    validateField(field, form.values[field]);
  });
}

// Validate on change
form.$watch('values', (values) => {
  Object.keys(values).forEach(field => {
    if (form.touched[field]) {
      validateField(field, values[field]);
    }
  });
});
```

### Example - Error Display Patterns
```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Pattern 1: Show error only if field touched
form.$bind({
  '#email-error': function() {
    return this.touched.email && this.errors.email 
      ? this.errors.email 
      : '';
  }
});

// Pattern 2: Show error with icon
form.$bind({
  '#email-container': {
    className: function() {
      if (!this.touched.email) return 'form-field';
      return this.errors.email 
        ? 'form-field has-error' 
        : 'form-field has-success';
    }
  }
});

// Pattern 3: Inline error with style
form.$bind({
  '#password-error': {
    textContent: function() {
      return this.errors.password || '';
    },
    style: function() {
      return {
        display: this.errors.password ? 'block' : 'none',
        color: '#ef4444',
        fontSize: '0.875rem',
        marginTop: '0.25rem'
      };
    }
  }
});

// Pattern 4: Error summary
form.$computed('errorList', function() {
  return Object.entries(this.errors)
    .filter(([_, error]) => error !== null)
    .map(([field, error]) => ({ field, error }));
});

form.$bind({
  '#error-summary': function() {
    if (this.errorList.length === 0) return '';
    
    return `
      <div class="error-summary">
        <h4>Please fix the following errors:</h4>
        <ul>
          ${this.errorList.map(({ field, error }) => `
            <li><strong>${field}:</strong> ${error}</li>
          `).join('')}
        </ul>
      </div>
    `;
  }
});
```

### Use Cases
- Form field validation
- Password strength checking
- Email format validation
- Username availability checking
- Cross-field validation (password match, date ranges)
- Custom business rules
- Server-side validation errors

### Important Notes
- Setting error to `null` **clears** the error
- Errors are stored in `form.errors` object
- Use with `form.touched` to show errors only after user interaction
- Affects `form.isValid` computed property

---

## `$reset(newValues)`

Reset form to initial values or provide new default values.

### Syntax
```javascript
form.$reset(newValues)
```

### Parameters
- **`newValues`** (Object, optional) - New default values (uses initial values if omitted)

### Returns
- `undefined`

### Example - Reset to Initial
```javascript
const form = ReactiveUtils.form({
  name: '',
  email: '',
  message: ''
});

// User fills form
form.$setValue('name', 'John Doe');
form.$setValue('email', 'john@example.com');
form.$setValue('message', 'Hello!');

// Reset to initial empty values
form.$reset();

console.log(form.values.name); // ''
console.log(form.touched); // {}
console.log(form.errors); // {}
```

### Example - Reset to New Values
```javascript
const form = ReactiveUtils.form({
  firstName: '',
  lastName: '',
  email: ''
});

// Load user data
async function loadUser(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const user = await response.json();
  
  // Reset form with loaded data
  form.$reset({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  });
}

loadUser(123);
```

### Advanced Example - Edit Mode
```javascript
const userForm = ReactiveUtils.form({
  id: null,
  name: '',
  email: '',
  role: 'user'
});

let originalData = null;

// Start editing
function startEdit(user) {
  originalData = { ...user };
  userForm.$reset(user);
}

// Cancel editing
function cancelEdit() {
  if (originalData) {
    userForm.$reset(originalData);
  } else {
    userForm.$reset();
  }
}

// Save changes
async function saveChanges() {
  if (!userForm.isValid) {
    alert('Please fix form errors');
    return;
  }
  
  userForm.isSubmitting = true;
  
  try {
    await fetch(`/api/users/${userForm.values.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm.values)
    });
    
    alert('Changes saved!');
    originalData = { ...userForm.values };
  } catch (error) {
    alert('Failed to save: ' + error.message);
  } finally {
    userForm.isSubmitting = false;
  }
}

// Check for unsaved changes
userForm.$computed('hasChanges', function() {
  if (!originalData) return false;
  return JSON.stringify(this.values) !== JSON.stringify(originalData);
});

// Warn before leaving
window.addEventListener('beforeunload', (e) => {
  if (userForm.hasChanges) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  }
});
```

### Example - Multi-Step Form
```javascript
const wizardForm = ReactiveUtils.form({
  step: 1,
  personal: {
    name: '',
    email: ''
  },
  address: {
    street: '',
    city: '',
    zipCode: ''
  },
  preferences: {
    newsletter: false,
    notifications: true
  }
});

function goToStep(step) {
  wizardForm.values.step = step;
}

function resetWizard() {
  form.$reset({
    step: 1,
    personal: { name: '', email: '' },
    address: { street: '', city: '', zipCode: '' },
    preferences: { newsletter: false, notifications: true }
  });
}

function previousStep() {
  if (wizardForm.values.step > 1) {
    wizardForm.values.step--;
  }
}

function nextStep() {
  // Validate current step before proceeding
  if (validateCurrentStep()) {
    wizardForm.values.step++;
  }
}
```

### Example - Form with Defaults
```javascript
const settingsForm = ReactiveUtils.form({
  theme: 'light',
  fontSize: 14,
  notifications: true,
  autoSave: true
});

const defaultSettings = {
  theme: 'light',
  fontSize: 14,
  notifications: true,
  autoSave: true
};

// Reset to defaults
function resetToDefaults() {
  if (confirm('Reset all settings to defaults?')) {
    settingsForm.$reset(defaultSettings);
    saveSettings();
  }
}

// Load saved settings
async function loadSettings() {
  try {
    const response = await fetch('/api/user/settings');
    const settings = await response.json();
    settingsForm.$reset(settings);
  } catch (error) {
    console.error('Failed to load settings:', error);
    settingsForm.$reset(defaultSettings);
  }
}

// Save settings
async function saveSettings() {
  try {
    await fetch('/api/user/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsForm.values)
    });
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}
```

### Example - After Successful Submission
```javascript
const contactForm = ReactiveUtils.form({
  name: '',
  email: '',
  subject: '',
  message: ''
});

async function submitForm() {
  if (!contactForm.isValid) return;
  
  contactForm.isSubmitting = true;
  
  try {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm.values)
    });
    
    alert('Message sent successfully!');
    
    // Reset form after successful submission
    contactForm.$reset();
    
  } catch (error) {
    alert('Failed to send message');
  } finally {
    contactForm.isSubmitting = false;
  }
}
```

### Example - Partial Reset
```javascript
const form = ReactiveUtils.form({
  search: '',
  filters: {
    category: 'all',
    priceMin: 0,
    priceMax: 1000,
    inStock: false
  },
  sort: 'relevance'
});

// Reset only filters
function resetFilters() {
  form.$reset({
    ...form.values,
    filters: {
      category: 'all',
      priceMin: 0,
      priceMax: 1000,
      inStock: false
    }
  });
}

// Keep search, reset everything else
function resetExceptSearch() {
  const currentSearch = form.values.search;
  form.$reset();
  form.$setValue('search', currentSearch);
}
```

### Use Cases
- Cancel button functionality
- Clear form after submission
- Load new data for editing
- Reset to default settings
- Discard changes
- Multi-step form navigation
- Form initialization

### Important Notes
- Clears **all** errors
- Clears **all** touched fields
- Preserves form structure (doesn't add/remove fields)
- If `newValues` omitted, uses values from `form()` creation
- Does **not** reset `isSubmitting` (set manually if needed)

---

## `values` Property

Object containing all form field values.

### Syntax
```javascript
const fieldValues = form.values
```

### Type
- `Object` - Reactive object with form values

### Example - Reading Values
```javascript
const form = ReactiveUtils.form({
  username: 'john_doe',
  email: 'john@example.com',
  age: 30
});

console.log(form.values.username); // "john_doe"
console.log(form.values.email); // "john@example.com"
console.log(form.values.age); // 30

// Access all values
console.log(form.values);
// { username: 'john_doe', email: 'john@example.com', age: 30 }
```

### Example - Direct Modification
```javascript
const form = ReactiveUtils.form({
  name: '',
  email: ''
});

// Can modify directly (but doesn't mark as touched)
form.values.name = 'John';
form.values.email = 'john@example.com';

// Better: Use $setValue to mark as touched
form.$setValue('name', 'John');
```

### Example - Watching Values
```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Watch all value changes
form.$watch('values', (newValues, oldValues) => {
  console.log('Form changed:', newValues);
  
  // Auto-save to localStorage
  localStorage.setItem('formDraft', JSON.stringify(newValues));
});

// Watch specific field
form.$watch('values', (values) => {
  if (values.email) {
    console.log('Email changed:', values.email);
  }
});
```

### Example - Computed from Values
```javascript
const orderForm = ReactiveUtils.form({
  quantity: 1,
  price: 10.00,
  taxRate: 0.08,
  discountCode: ''
});

orderForm.$computed('subtotal', function() {
  return this.values.quantity * this.values.price;
});

orderForm.$computed('tax', function() {
  return this.subtotal * this.values.taxRate;
});

orderForm.$computed('discount', function() {
  if (this.values.discountCode === 'SAVE10') {
    return this.subtotal * 0.1;
  }
  return 0;
});

orderForm.$computed('total', function() {
  return this.subtotal + this.tax - this.discount;
});

console.log(orderForm.total); // Calculated total
```

### Example - Serialization
```javascript
const form = ReactiveUtils.form({
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    notifications: true
  }
});

// Serialize for API
function submitForm() {
  const payload = JSON.stringify(form.values);
  
  fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload
  });
}

// Save to localStorage
localStorage.setItem('form', JSON.stringify(form.values));

// Load from localStorage
const saved = localStorage.getItem('form');
if (saved) {
  const data = JSON.parse(saved);
  form.$reset(data);
}
```

### Example - Nested Values
```javascript
const profileForm = ReactiveUtils.form({
  user: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  },
  address: {
    street: '123 Main St',
    city: 'New York',
    country: 'USA'
  }
});

// Access nested values
console.log(profileForm.values.user.firstName); // "John"
console.log(profileForm.values.address.city); // "New York"

// Modify nested values
profileForm.values.user.firstName = 'Jane';

// Or use $setValue with updated object
profileForm.$setValue('user', {
  ...profileForm.values.user,
  firstName: 'Jane'
});
```

### Use Cases
- Accessing form data for submission
- Serializing form state
- Computing derived values
- Auto-saving drafts
- Form validation
- Binding to display elements

---

## `errors` Property

Object containing validation errors for form fields.

### Syntax
```javascript
const fieldErrors = form.errors
```

### Type
- `Object` - Reactive object with error messages (or `null`)

### Example - Reading Errors
```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

form.$setError('email', 'Invalid email format');
form.$setError('password', 'Password too short');

console.log(form.errors.email); // "Invalid email format"
console.log(form.errors.password); // "Password too short"

// All errors
console.log(form.errors);
// { email: 'Invalid email format', password: 'Password too short' }
```

### Example - Conditional Display
```javascript
const form = ReactiveUtils.form({
  username: '',
  email: ''
});

// Show error only if field is touched
form.$bind({
  '#username-error': function() {
    if (this.touched.username && this.errors.username) {
      return this.errors.username;
    }
    return '';
  },
  '#email-error': function() {
    if (this.touched.email && this.errors.email) {
      return this.errors.email;
    }
    return '';
  }
});
```

### Example - Error Count
```javascript
const form = ReactiveUtils.form({
  field1: '',
  field2: '',
  field3: ''
});

form.$computed('errorCount', function() {
  return Object.values(this.errors).filter(err => err !== null).length;
});

form.$computed('hasErrors', function() {
  return this.errorCount > 0;
});

// Display error count
form.$bind({
  '#error-count': () => {
    const count = form.errorCount;
    return count > 0 ? `${count} error${count > 1 ? 's' : ''}` : '';
  }
});
```

### Example - Error Styling
```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Apply error classes to inputs
form.$bind({
  '#email-input': {
    className: function() {
      if (!this.touched.email) return 'input';
      return this.errors.email ? 'input input-error' : 'input input-success';
    }
  },
  '#password-input': {
    className: function() {
      if (!this.touched.password) return 'input';
      return this.errors.password ? 'input input-error' : 'input input-success';
    }
  }
});
```

### Use Cases
- Displaying validation messages
- Styling invalid fields
- Preventing form submission
- Error summaries
- Field-level error indicators

---

## `touched` Property

Object tracking which fields have been interacted with.

### Syntax
```javascript
const touchedFields = form.touched
```

### Type
- `Object` - Keys are field names, values are `true` if touched

### Example - Basic Usage
```javascript
const form = ReactiveUtils.form({
  name: '',
  email: ''
});

console.log(form.touched); // {}

form.$setValue('name', 'John');
console.log(form.touched); // { name: true }

form.$setValue('email', 'john@example.com');
console.log(form.touched); // { name: true, email: true }
```

### Example - Show Errors Only When Touched
```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Validate but only show if touched
form.$watch('values', (values) => {
  if (!values.email.includes('@')) {
    form.$setError('email', 'Invalid email');
  } else {
    form.$setError('email', null);
  }
});

form.$bind({
  '#email-error': function() {
    // Only show error if field was touched
    return this.touched.email && this.errors.email 
      ? this.errors.email 
      : '';
  }
});
```

### Example - Touch All Fields on Submit

```javascript
const form = ReactiveUtils.form({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

function touchAllFields() {
  Object.keys(form.values).forEach(field => {
    form.touched[field] = true;
  });
  form.$notify('touched');
}

async function handleSubmit(e) {
  e.preventDefault();
  
  // Touch all fields to show all errors
  touchAllFields();
  
  if (!form.isValid) {
    alert('Please fix all errors before submitting');
    return;
  }
  
  form.isSubmitting = true;
  
  try {
    await submitToAPI(form.values);
    form.$reset();
  } catch (error) {
    alert('Submission failed: ' + error.message);
  } finally {
    form.isSubmitting = false;
  }
}
```

### Example - Progressive Validation

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: '',
  confirmPassword: ''
});

// Only validate fields that have been touched
form.$watch('values', (values) => {
  if (form.touched.email) {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
    form.$setError('email', emailValid ? null : 'Invalid email format');
  }
  
  if (form.touched.password) {
    const passwordValid = values.password.length >= 8;
    form.$setError('password', passwordValid ? null : 'Password must be at least 8 characters');
  }
  
  if (form.touched.confirmPassword) {
    const match = values.password === values.confirmPassword;
    form.$setError('confirmPassword', match ? null : 'Passwords must match');
  }
});

// Bind with touched check
form.$bind({
  '#email-feedback': function() {
    if (!this.touched.email) return '';
    return this.errors.email || '✓ Valid email';
  },
  '#password-feedback': function() {
    if (!this.touched.password) return '';
    return this.errors.password || '✓ Strong password';
  }
});
```

### Example - Manual Touch Control

```javascript
const form = ReactiveUtils.form({
  field1: '',
  field2: '',
  field3: ''
});

// Mark as touched on blur
function handleBlur(fieldName) {
  form.touched[fieldName] = true;
  form.$notify('touched');
}

// HTML example:
// <input onblur="handleBlur('field1')" />

// Check if any field touched
form.$computed('isAnyTouched', function() {
  return Object.keys(this.touched).length > 0;
});

// Check if all fields touched
form.$computed('isAllTouched', function() {
  const fieldNames = Object.keys(this.values);
  return fieldNames.every(field => this.touched[field]);
});
```

### Example - Touched Field Count

```javascript
const form = ReactiveUtils.form({
  name: '',
  email: '',
  phone: '',
  message: ''
});

form.$computed('touchedCount', function() {
  return Object.keys(this.touched).length;
});

form.$computed('totalFields', function() {
  return Object.keys(this.values).length;
});

form.$computed('completionPercent', function() {
  return Math.round((this.touchedCount / this.totalFields) * 100);
});

// Progress indicator
form.$bind({
  '#form-progress': () => {
    return `${form.touchedCount} of ${form.totalFields} fields completed (${form.completionPercent}%)`;
  },
  '#progress-bar': {
    style: () => ({
      width: `${form.completionPercent}%`
    })
  }
});
```

### Use Cases
- Progressive validation (only validate touched fields)
- Show errors only after user interaction
- Form completion tracking
- Dirty field detection
- Focus/blur event handling

---

## `isSubmitting` Property

Boolean flag indicating whether the form is currently being submitted.

### Syntax
```javascript
form.isSubmitting = true|false
```

### Type
- `Boolean` - Submission state flag

### Example - Basic Usage

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

async function handleSubmit() {
  form.isSubmitting = true;
  
  try {
    await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.values)
    });
    
    alert('Login successful!');
  } catch (error) {
    alert('Login failed: ' + error.message);
  } finally {
    form.isSubmitting = false;
  }
}
```

### Example - Disable Submit Button

```javascript
const form = ReactiveUtils.form({
  name: '',
  email: ''
});

// Bind to submit button
form.$bind({
  '#submit-btn': {
    disabled: function() {
      return this.isSubmitting || !this.isValid;
    },
    textContent: function() {
      return this.isSubmitting ? 'Submitting...' : 'Submit';
    }
  }
});

async function handleSubmit() {
  if (form.isSubmitting || !form.isValid) return;
  
  form.isSubmitting = true;
  
  try {
    await submitToAPI(form.values);
    form.$reset();
  } finally {
    form.isSubmitting = false;
  }
}
```

### Example - Loading Indicators

```javascript
const form = ReactiveUtils.form({
  email: '',
  message: ''
});

form.$bind({
  '#submit-btn': {
    disabled: () => form.isSubmitting,
    innerHTML: function() {
      return this.isSubmitting 
        ? '<span class="spinner"></span> Sending...'
        : 'Send Message';
    }
  },
  '#loading-overlay': {
    style: () => ({
      display: form.isSubmitting ? 'flex' : 'none'
    })
  }
});

async function sendMessage() {
  form.isSubmitting = true;
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.values)
    });
    
    if (!response.ok) throw new Error('Failed to send');
    
    alert('Message sent successfully!');
    form.$reset();
  } catch (error) {
    alert('Error: ' + error.message);
  } finally {
    form.isSubmitting = false;
  }
}
```

### Example - Prevent Multiple Submissions

```javascript
const form = ReactiveUtils.form({
  amount: 0,
  cardNumber: ''
});

async function processPayment() {
  // Prevent multiple clicks
  if (form.isSubmitting) {
    console.log('Already processing payment...');
    return;
  }
  
  if (!form.isValid) {
    alert('Please fix form errors');
    return;
  }
  
  form.isSubmitting = true;
  
  try {
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.values)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Payment processed successfully!');
      form.$reset();
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    alert('Payment failed: ' + error.message);
  } finally {
    form.isSubmitting = false;
  }
}
```

### Example - With Timeout

```javascript
const form = ReactiveUtils.form({
  data: ''
});

async function submitWithTimeout() {
  form.isSubmitting = true;
  
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), 30000)
  );
  
  const request = fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(form.values)
  });
  
  try {
    await Promise.race([request, timeout]);
    alert('Success!');
  } catch (error) {
    alert('Error: ' + error.message);
  } finally {
    form.isSubmitting = false;
  }
}
```

### Use Cases
- Disable submit button during submission
- Show loading spinners
- Prevent duplicate submissions
- Display submission status
- Lock form during API calls

### Important Notes
- **Not** automatically set - you must set it manually
- **Not** reset by `$reset()` - manage separately
- Typically used with try/finally to ensure it's always cleared
- Combine with `isValid` to control submit button state

---

## `isValid` Computed Property

Computed property that returns `true` if there are no validation errors.

### Syntax
```javascript
if (form.isValid) {
  // Form is valid
}
```

### Type
- `Boolean` (computed) - `true` if no errors exist

### Example - Basic Usage

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

console.log(form.isValid); // true (no errors yet)

form.$setError('email', 'Invalid email');
console.log(form.isValid); // false

form.$setError('email', null);
console.log(form.isValid); // true
```

### Example - Conditional Submission

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  password: ''
});

// Validate on change
form.$watch('values', (values) => {
  if (values.username.length < 3) {
    form.$setError('username', 'Too short');
  } else {
    form.$setError('username', null);
  }
  
  if (!values.email.includes('@')) {
    form.$setError('email', 'Invalid email');
  } else {
    form.$setError('email', null);
  }
  
  if (values.password.length < 8) {
    form.$setError('password', 'Too short');
  } else {
    form.$setError('password', null);
  }
});

async function handleSubmit() {
  // Only submit if valid
  if (!form.isValid) {
    alert('Please fix all errors');
    return;
  }
  
  form.isSubmitting = true;
  
  try {
    await submitToAPI(form.values);
    form.$reset();
  } finally {
    form.isSubmitting = false;
  }
}
```

### Example - Enable/Disable Submit Button

```javascript
const form = ReactiveUtils.form({
  name: '',
  email: ''
});

form.$bind({
  '#submit-btn': {
    disabled: function() {
      return !this.isValid || this.isSubmitting;
    },
    className: function() {
      return this.isValid ? 'btn btn-primary' : 'btn btn-disabled';
    }
  }
});
```

### Example - Validation Indicator

```javascript
const form = ReactiveUtils.form({
  field1: '',
  field2: '',
  field3: ''
});

form.$computed('validationStatus', function() {
  if (this.isValid) return 'All fields valid ✓';
  const errorCount = Object.values(this.errors).filter(e => e).length;
  return `${errorCount} error${errorCount > 1 ? 's' : ''} found`;
});

form.$bind({
  '#validation-status': () => form.validationStatus,
  '#validation-icon': {
    textContent: () => form.isValid ? '✓' : '⚠',
    style: () => ({
      color: form.isValid ? '#22c55e' : '#ef4444'
    })
  }
});
```

### Example - Multi-Step Form Validation

```javascript
const wizardForm = ReactiveUtils.form({
  step: 1,
  name: '',
  email: '',
  address: '',
  city: ''
});

wizardForm.$computed('step1Valid', function() {
  return this.values.name && this.values.email && 
         !this.errors.name && !this.errors.email;
});

wizardForm.$computed('step2Valid', function() {
  return this.values.address && this.values.city &&
         !this.errors.address && !this.errors.city;
});

function nextStep() {
  const step = wizardForm.values.step;
  
  if (step === 1 && !wizardForm.step1Valid) {
    alert('Please complete step 1');
    return;
  }
  
  if (step === 2 && !wizardForm.step2Valid) {
    alert('Please complete step 2');
    return;
  }
  
  wizardForm.values.step++;
}

function submitWizard() {
  if (!wizardForm.isValid) {
    alert('Please fix all errors');
    return;
  }
  
  // Submit...
}
```

### Example - Dynamic Validation Status

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: '',
  terms: false
});

// Custom validation
form.$computed('customIsValid', function() {
  // Check base validity
  if (!this.isValid) return false;
  
  // Additional checks
  if (!this.values.terms) return false;
  if (this.values.email.endsWith('@blocked.com')) return false;
  
  return true;
});

form.$bind({
  '#submit-btn': {
    disabled: () => !form.customIsValid
  }
});
```

### Use Cases
- Enable/disable submit buttons
- Show validation status
- Conditional form submission
- Progress indicators
- Multi-step form navigation
- Custom validation logic

### Important Notes
- Automatically computed based on `errors` object
- Returns `true` if `errors` is empty or all values are `null`
- Updates automatically when errors change
- Read-only (cannot be set directly)

---

## `isDirty` Computed Property

Computed property that returns `true` if any field has been touched.

### Syntax
```javascript
if (form.isDirty) {
  // Form has been modified
}
```

### Type
- `Boolean` (computed) - `true` if any field touched

### Example - Basic Usage

```javascript
const form = ReactiveUtils.form({
  name: '',
  email: ''
});

console.log(form.isDirty); // false

form.$setValue('name', 'John');
console.log(form.isDirty); // true
```

### Example - Unsaved Changes Warning

```javascript
const form = ReactiveUtils.form({
  title: '',
  content: '',
  tags: []
});

// Warn before leaving page
window.addEventListener('beforeunload', (e) => {
  if (form.isDirty) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  }
});

// Show indicator
form.$bind({
  '#unsaved-indicator': {
    textContent: () => form.isDirty ? '● Unsaved changes' : '✓ All changes saved',
    style: () => ({
      color: form.isDirty ? '#f59e0b' : '#22c55e'
    })
  }
});

async function saveChanges() {
  if (!form.isDirty) {
    alert('No changes to save');
    return;
  }
  
  await submitToAPI(form.values);
  form.$reset(form.values); // Reset with current values to clear dirty state
}
```

### Example - Enable Save Button

```javascript
const settingsForm = ReactiveUtils.form({
  theme: 'light',
  fontSize: 14,
  notifications: true
});

settingsForm.$bind({
  '#save-btn': {
    disabled: function() {
      return !this.isDirty || this.isSubmitting;
    },
    textContent: function() {
      if (this.isSubmitting) return 'Saving...';
      return this.isDirty ? 'Save Changes' : 'No Changes';
    }
  },
  '#reset-btn': {
    disabled: () => !settingsForm.isDirty
  }
});
```

### Example - Auto-Save Draft

```javascript
const postForm = ReactiveUtils.form({
  title: '',
  content: '',
  status: 'draft'
});

let autoSaveTimer;

postForm.$watch('values', () => {
  if (!postForm.isDirty) return;
  
  // Debounce auto-save
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(async () => {
    await saveDraft(postForm.values);
    console.log('Draft auto-saved');
  }, 2000);
});

async function saveDraft(data) {
  await fetch('/api/posts/draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
```

### Example - Compare with Original

```javascript
const editForm = ReactiveUtils.form({
  id: null,
  name: '',
  email: '',
  bio: ''
});

let originalData = null;

function loadUserForEdit(user) {
  originalData = { ...user };
  editForm.$reset(user);
}

editForm.$computed('hasChanges', function() {
  if (!originalData || !this.isDirty) return false;
  
  // Deep comparison
  return JSON.stringify(this.values) !== JSON.stringify(originalData);
});

function discardChanges() {
  if (confirm('Discard all changes?')) {
    editForm.$reset(originalData);
  }
}

function saveChanges() {
  if (!editForm.hasChanges) {
    alert('No changes to save');
    return;
  }
  
  // Save...
}
```

### Example - Form State Indicator

```javascript
const form = ReactiveUtils.form({
  data: ''
});

form.$computed('formState', function() {
  if (this.isSubmitting) return 'Saving...';
  if (!this.isDirty) return 'Up to date';
  if (!this.isValid) return 'Has errors';
  return 'Ready to save';
});

form.$bind({
  '#form-status': () => form.formState,
  '#form-status-icon': {
    className: function() {
      if (form.isSubmitting) return 'icon-spinner';
      if (!form.isDirty) return 'icon-check';
      if (!form.isValid) return 'icon-error';
      return 'icon-edit';
    }
  }
});
```

### Example - Conditional Navigation

```javascript
const form = ReactiveUtils.form({
  name: '',
  email: ''
});

function navigateAway() {
  if (form.isDirty) {
    const confirmed = confirm('You have unsaved changes. Leave anyway?');
    if (!confirmed) return;
  }
  
  window.location.href = '/dashboard';
}

// Router integration
router.beforeEach((to, from, next) => {
  if (form.isDirty) {
    const answer = window.confirm('Discard unsaved changes?');
    if (answer) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});
```

### Use Cases
- Unsaved changes warnings
- Enable/disable save buttons
- Auto-save drafts
- Form state indicators
- Navigation guards
- Change tracking

### Important Notes
- Based on `touched` object (not on value changes)
- Returns `true` if any field in `touched` object
- Cleared by `$reset()`
- Read-only (cannot be set directly)
- Useful for detecting user interaction

---

## Complete Example - Registration Form

```javascript
// Create registration form
const registrationForm = ReactiveUtils.form({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
});

// Computed properties
registrationForm.$computed('passwordStrength', function() {
  const pwd = this.values.password;
  if (pwd.length < 6) return 'weak';
  if (pwd.length < 10) return 'medium';
  if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return 'strong';
  return 'medium';
});

registrationForm.$computed('canSubmit', function() {
  return this.isValid && 
         this.values.agreeToTerms && 
         !this.isSubmitting;
});

// Real-time validation
registrationForm.$watch('values', (values) => {
  // Username validation
  if (registrationForm.touched.username) {
    if (values.username.length < 3) {
      registrationForm.$setError('username', 'Username must be at least 3 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
      registrationForm.$setError('username', 'Username can only contain letters, numbers, and underscores');
    } else {
      registrationForm.$setError('username', null);
    }
  }
  
  // Email validation
  if (registrationForm.touched.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      registrationForm.$setError('email', 'Please enter a valid email address');
    } else {
      registrationForm.$setError('email', null);
    }
  }
  
  // Password validation
  if (registrationForm.touched.password) {
    if (values.password.length < 8) {
      registrationForm.$setError('password', 'Password must be at least 8 characters');
    } else if (!/[A-Z]/.test(values.password)) {
      registrationForm.$setError('password', 'Password must contain an uppercase letter');
    } else if (!/[0-9]/.test(values.password)) {
      registrationForm.$setError('password', 'Password must contain a number');
    } else {
      registrationForm.$setError('password', null);
    }
  }
  
  // Confirm password validation
  if (registrationForm.touched.confirmPassword) {
    if (values.password !== values.confirmPassword) {
      registrationForm.$setError('confirmPassword', 'Passwords do not match');
    } else {
      registrationForm.$setError('confirmPassword', null);
    }
  }
  
  // Terms validation
  if (!values.agreeToTerms && registrationForm.touched.agreeToTerms) {
    registrationForm.$setError('agreeToTerms', 'You must agree to the terms');
  } else {
    registrationForm.$setError('agreeToTerms', null);
  }
});

// DOM bindings
registrationForm.$bind({
  // Error messages
  '#username-error': function() {
    return this.touched.username && this.errors.username ? this.errors.username : '';
  },
  '#email-error': function() {
    return this.touched.email && this.errors.email ? this.errors.email : '';
  },
  '#password-error': function() {
    return this.touched.password && this.errors.password ? this.errors.password : '';
  },
  '#confirmPassword-error': function() {
    return this.touched.confirmPassword && this.errors.confirmPassword ? this.errors.confirmPassword : '';
  },
  
  // Password strength indicator
  '#password-strength': function() {
    if (!this.values.password) return '';
    return `Password strength: ${this.passwordStrength}`;
  },
  '#password-strength-bar': {
    className: () => `strength-bar strength-${registrationForm.passwordStrength}`,
    style: function() {
      const widths = { weak: '33%', medium: '66%', strong: '100%' };
      return { width: widths[registrationForm.passwordStrength] || '0%' };
    }
  },
  
  // Submit button
  '#submit-btn': {
    disabled: () => !registrationForm.canSubmit,
    textContent: function() {
      return registrationForm.isSubmitting ? 'Creating Account...' : 'Create Account';
    }
  },
  
  // Form validation status
  '#validation-summary': function() {
    if (!registrationForm.isDirty) return '';
    if (registrationForm.isValid && registrationForm.values.agreeToTerms) {
      return '<span class="success">✓ Ready to submit</span>';
    }
    const errorCount = Object.values(registrationForm.errors).filter(e => e).length;
    return `<span class="error">${errorCount} error${errorCount > 1 ? 's' : ''} remaining</span>`;
  }
});

// Form submission
async function handleRegistration(e) {
  e.preventDefault();
  
  // Touch all fields to show all errors
  Object.keys(registrationForm.values).forEach(field => {
    registrationForm.touched[field] = true;
  });
  registrationForm.$notify('touched');
  
  // Check if valid
  if (!registrationForm.canSubmit) {
    alert('Please fix all errors before submitting');
    return;
  }
  
  registrationForm.isSubmitting = true;
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: registrationForm.values.username,
        email: registrationForm.values.email,
        password: registrationForm.values.password
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    alert('Registration successful! Please check your email.');
    registrationForm.$reset();
    window.location.href = '/login';
    
  } catch (error) {
    alert('Registration failed: ' + error.message);
    
    // Set server-side errors
    if (error.field) {
      registrationForm.$setError(error.field, error.message);
    }
  } finally {
    registrationForm.isSubmitting = false;
  }
}

// Attach to form
document.getElementById('registration-form').addEventListener('submit', handleRegistration);
```

---

## Best Practices Summary

### ✅ DO

- Use `$setValue()` to mark fields as touched
- Use `$setError()` for all validation feedback
- Check `isValid` before submitting
- Set `isSubmitting` during async operations
- Use `touched` to show errors only after interaction
- Call `$reset()` after successful submission
- Validate on `values` watch for real-time feedback

### ❌ DON'T

- Modify `values` directly without `$setValue()` if you need touch tracking
- Forget to set `isSubmitting = false` in finally blocks
- Show errors before fields are touched
- Submit form when `!isValid`
- Forget to clear `isSubmitting` on errors
- Store sensitive data in `values` without encryption

---

## API Quick Reference

```javascript
const form = ReactiveUtils.form(initialValues);

// Methods
form.$setValue(field, value)         // Set value + mark touched
form.$setError(field, error)         // Set/clear error
form.$reset(newValues)               // Reset form

// Properties
form.values                          // Form values object
form.errors                          // Form errors object
form.touched                         // Touched fields object
form.isSubmitting                    // Submission state boolean
form.isValid                         // Computed: no errors
form.isDirty                         // Computed: any touched

// Inherited Methods
form.$computed(key, fn)              // Add computed
form.$watch(keyOrFn, callback)       // Watch changes
form.$batch(fn)                      // Batch updates
form.$bind(bindingDefs)              // DOM bindings
```

---
