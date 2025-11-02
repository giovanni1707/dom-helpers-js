[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers - Form Module - Comprehensive Documentation

Specialized form handling utilities that integrate seamlessly with the main DOM Helpers library, providing powerful declarative form management, validation, and submission handling.

**Version:** 1.0.0  
**License:** MIT

---

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Core Concepts](#core-concepts)
3. [Forms Object Methods](#forms-object-methods)
4. [Form Element Methods](#form-element-methods)
5. [Form Values Management](#form-values-management)
6. [Form Validation](#form-validation)
7. [Form Submission](#form-submission)
8. [Form Serialization](#form-serialization)
9. [Form Update Method](#form-update-method)
10. [Field Access Methods](#field-access-methods)
11. [Utility Methods](#utility-methods)
12. [Complete Examples](#complete-examples)

---

## Installation & Setup

### Prerequisites

The Form module requires the main DOM Helpers library to be loaded first.

### Include the Libraries

```html
<!-- Load main DOM Helpers first -->
<script src="path/to/dom-helpers.js"></script>

<!-- Then load Form module -->
<script src="path/to/dom-helpers-form.js"></script>
```

### Basic Usage

```javascript
// Access a form by ID
const loginForm = Forms.loginForm;

// Get all form values
const values = loginForm.values;

// Set form values
loginForm.values = { username: 'john', email: 'john@example.com' };

// Validate form
const result = loginForm.validate();
```

---

## Core Concepts

The Form module extends the main DOM Helpers library with form-specific functionality:

- **Forms Object** - Access forms by ID with caching (similar to Elements)
- **Automatic Enhancement** - Forms are automatically enhanced with special methods
- **Declarative Updates** - Use `.update()` method for complex form operations
- **Built-in Validation** - HTML5 + custom validation rules
- **Easy Submission** - Simplified AJAX form submission
- **Value Management** - Easy get/set of all form values

---

## Forms Object Methods

The Forms object provides ID-based form access with intelligent caching.

### Forms[id]

Access a form by its ID using property syntax.

**Parameters:**
- `id` (string): The form's ID attribute

**Returns:** Enhanced form element or null

**Example:**
```javascript
// HTML: <form id="contactForm">...</form>
const form = Forms.contactForm;

// Form is automatically enhanced with special methods
console.log(form.values); // Get all form values
```

---

### Forms.getAllForms()

Get all forms in the document as an array of enhanced form elements.

**Parameters:** None

**Returns:** Array of enhanced form elements

**Example:**
```javascript
const allForms = Forms.getAllForms();

allForms.forEach(form => {
  console.log(`Form ${form.id}:`, form.values);
});
```

---

### Forms.validateAll(rules)

Validate all forms in the document with optional rules for each form.

**Parameters:**
- `rules` (Object, optional): Object where keys are form IDs and values are validation rules

**Returns:** Object with validation results for each form

**Example:**
```javascript
const results = Forms.validateAll({
  loginForm: {
    username: { required: true },
    password: { required: true, minLength: 8 }
  },
  contactForm: {
    email: { required: true, email: true }
  }
});

console.log(results.loginForm.isValid); // true or false
console.log(results.contactForm.errors); // Object with errors
```

---

### Forms.resetAll()

Reset all forms in the document.

**Parameters:** None

**Returns:** undefined

**Example:**
```javascript
// Reset all forms on the page
Forms.resetAll();
```

---

### Forms.stats()

Get cache statistics for the Forms helper.

**Parameters:** None

**Returns:** Object with statistics (hits, misses, cacheSize, hitRate, uptime)

**Example:**
```javascript
const stats = Forms.stats();
console.log(`Cache hit rate: ${(stats.hitRate * 100).toFixed(2)}%`);
console.log(`Cached forms: ${stats.cacheSize}`);
```

---

### Forms.clear()

Clear the Forms cache manually.

**Parameters:** None

**Returns:** undefined

**Example:**
```javascript
// Clear cache after major DOM changes
Forms.clear();
```

---

### Forms.destroy()

Destroy the Forms helper and clean up resources.

**Parameters:** None

**Returns:** undefined

**Example:**
```javascript
// Clean up before page unload
Forms.destroy();
```

---

### Forms.configure(options)

Configure Forms helper options.

**Parameters:**
- `options` (Object): Configuration options

**Returns:** Forms object for chaining

**Example:**
```javascript
Forms.configure({
  enableLogging: true,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 500,
  autoValidation: false
});
```

---

## Form Element Methods

Each form element is automatically enhanced with special methods and properties.

### form.values (getter)

Get all form values as an object.

**Returns:** Object with field names as keys and values

**Example:**
```javascript
const form = Forms.contactForm;

// Get all values
const values = form.values;
console.log(values);
// { name: 'John', email: 'john@example.com', message: 'Hello' }

// Works with checkboxes, radio buttons, selects, etc.
const surveyForm = Forms.surveyForm;
console.log(surveyForm.values);
// { 
//   age: '25', 
//   interests: ['coding', 'music'], // multiple checkboxes
//   gender: 'male', // radio button
//   country: 'USA' // select
// }
```

---

### form.values (setter)

Set all form values from an object.

**Parameters:**
- `values` (Object): Object with field names as keys and values to set

**Returns:** undefined

**Example:**
```javascript
const form = Forms.registrationForm;

// Set all values at once
form.values = {
  username: 'johndoe',
  email: 'john@example.com',
  age: 25,
  newsletter: true, // checkbox
  gender: 'male', // radio button
  country: 'USA', // select
  interests: ['coding', 'gaming'] // multiple checkboxes
};

// All fields are automatically updated
```

---

### form.reset(options)

Enhanced reset method that clears custom validation and triggers events.

**Parameters:**
- `options` (Object, optional): Reset options
  - `clearCustom` (boolean): Whether to clear custom validation messages (default: true)

**Returns:** Form element for chaining

**Example:**
```javascript
const form = Forms.contactForm;

// Basic reset
form.reset();

// Reset with options
form.reset({ clearCustom: true });

// Triggers 'formreset' custom event
form.addEventListener('formreset', (e) => {
  console.log('Form was reset:', e.detail.form);
});
```

---

### form.validate(rules)

Validate the form with optional custom rules.

**Parameters:**
- `rules` (Object, optional): Validation rules for each field

**Returns:** Object with validation result
- `isValid` (boolean): Whether form is valid
- `errors` (Object): Object with field names as keys and error messages
- `values` (Object): Current form values

**Example:**
```javascript
const form = Forms.registrationForm;

// Basic validation (HTML5 only)
const result = form.validate();
console.log(result.isValid); // true or false
console.log(result.errors); // { username: 'This field is required' }

// With custom rules
const result2 = form.validate({
  username: { required: true, minLength: 3 },
  email: { required: true, email: true },
  password: { required: true, minLength: 8 },
  confirmPassword: {
    custom: (value, values) => {
      return value === values.password || 'Passwords do not match';
    }
  }
});

if (!result2.isValid) {
  console.log('Validation errors:', result2.errors);
}
```

---

### form.clearValidation()

Clear all validation messages and styling from the form.

**Parameters:** None

**Returns:** Form element for chaining

**Example:**
```javascript
const form = Forms.contactForm;

// Clear validation errors
form.clearValidation();

// Chain with other operations
form.clearValidation().reset();
```

---

### form.submitData(options)

Submit form data with enhanced options including validation and AJAX.

**Parameters:**
- `options` (Object, optional): Submission options
  - `url` (string): Submission URL (default: form.action)
  - `method` (string): HTTP method (default: form.method or 'POST')
  - `validate` (boolean): Whether to validate before submit (default: true)
  - `validationRules` (Object): Custom validation rules
  - `beforeSubmit` (Function): Callback before submission
  - `onSuccess` (Function): Callback on successful submission
  - `onError` (Function): Callback on error
  - `transform` (Function): Transform data before submission

**Returns:** Promise resolving to result object

**Example:**
```javascript
const form = Forms.contactForm;

// Basic submission
const result = await form.submitData();

// Advanced submission with options
const result2 = await form.submitData({
  url: '/api/contact',
  method: 'POST',
  validate: true,
  validationRules: {
    email: { required: true, email: true }
  },
  beforeSubmit: async (data, form) => {
    console.log('About to submit:', data);
    // Return false to cancel submission
    return true;
  },
  onSuccess: (response, data) => {
    console.log('Success:', response);
    form.reset();
  },
  onError: (error, errors) => {
    console.error('Error:', error);
  },
  transform: (data) => {
    // Transform data before sending
    return {
      ...data,
      timestamp: Date.now()
    };
  }
});

console.log(result2.success); // true or false
console.log(result2.data); // Response data
```

---

### form.getField(name)

Get a specific form field by name or ID.

**Parameters:**
- `name` (string): Field name or ID

**Returns:** Form field element or null

**Example:**
```javascript
const form = Forms.registrationForm;

// Get field by name
const emailField = form.getField('email');
console.log(emailField.value);

// Get field by ID
const passwordField = form.getField('passwordInput');
```

---

### form.setField(name, value)

Set a specific form field value.

**Parameters:**
- `name` (string): Field name or ID
- `value` (any): Value to set

**Returns:** Form element for chaining

**Example:**
```javascript
const form = Forms.profileForm;

// Set field value
form.setField('username', 'johndoe');
form.setField('email', 'john@example.com');

// Set checkbox
form.setField('newsletter', true);

// Set radio button
form.setField('gender', 'male');

// Set multiple checkboxes
form.setField('interests', ['coding', 'gaming']);

// Chain operations
form.setField('name', 'John')
    .setField('age', '25')
    .setField('city', 'New York');
```

---

### form.serialize(format)

Serialize form data in different formats.

**Parameters:**
- `format` (string, optional): Serialization format
  - `'object'` (default): Plain JavaScript object
  - `'json'`: JSON string
  - `'formdata'`: FormData object
  - `'urlencoded'`: URL-encoded string

**Returns:** Serialized form data in specified format

**Example:**
```javascript
const form = Forms.contactForm;

// As object (default)
const obj = form.serialize();
console.log(obj); // { name: 'John', email: 'john@example.com' }

// As JSON string
const json = form.serialize('json');
console.log(json); // '{"name":"John","email":"john@example.com"}'

// As FormData
const formData = form.serialize('formdata');
// Use with fetch or XMLHttpRequest

// As URL-encoded string
const urlEncoded = form.serialize('urlencoded');
console.log(urlEncoded); // 'name=John&email=john%40example.com'
```

---

## Form Values Management

### Getting Form Values

**Example:**
```javascript
const form = Forms.surveyForm;

// Get all values
const values = form.values;
console.log(values);

// Access specific values
console.log(values.name);
console.log(values.email);

// Handles different field types automatically:
// - Text inputs: string values
// - Checkboxes: boolean or array (for multiple)
// - Radio buttons: selected value
// - Select: selected value or array (for multiple)
// - Textareas: string values
```

---

### Setting Form Values

**Example:**
```javascript
const form = Forms.registrationForm;

// Set all values at once
form.values = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  age: 25,
  agreeToTerms: true, // checkbox
  gender: 'male', // radio
  country: 'USA', // select
  interests: ['coding', 'music'] // multiple checkboxes
};

// Automatically handles:
// - Text fields
// - Checkboxes (checked/unchecked)
// - Radio buttons (selecting correct option)
// - Select dropdowns (single and multiple)
// - Textareas
```

---

### Setting Individual Fields

**Example:**
```javascript
const form = Forms.profileForm;

// Set individual fields
form.setField('username', 'johndoe');
form.setField('bio', 'Developer and musician');
form.setField('newsletter', true);

// For radio buttons
form.setField('contactMethod', 'email');

// For checkboxes (multiple values)
form.setField('skills', ['JavaScript', 'Python', 'React']);
```

---

## Form Validation

### HTML5 Validation

**Example:**
```javascript
const form = Forms.contactForm;

// Use built-in HTML5 validation
const result = form.validate();

if (result.isValid) {
  console.log('Form is valid!');
} else {
  console.log('Errors:', result.errors);
  // { email: 'Please enter a valid email address' }
}
```

---

### Custom Validation Rules

**Example:**
```javascript
const form = Forms.registrationForm;

const result = form.validate({
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9_]+$',
    custom: (value) => {
      if (value.includes('admin')) {
        return 'Username cannot contain "admin"';
      }
      return true;
    }
  },
  email: {
    required: true,
    email: true
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value) => {
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      
      if (!hasUpper || !hasLower || !hasNumber) {
        return 'Password must contain uppercase, lowercase, and numbers';
      }
      return true;
    }
  },
  confirmPassword: {
    required: true,
    custom: (value, allValues) => {
      return value === allValues.password || 'Passwords do not match';
    }
  }
});

if (!result.isValid) {
  console.log('Validation failed:', result.errors);
}
```

---

### Validation Rule Types

**Available Rules:**

1. **required**: Field must have a value
2. **minLength**: Minimum string length
3. **maxLength**: Maximum string length
4. **pattern**: Regex pattern to match
5. **email**: Valid email format
6. **custom**: Custom validation function

**Example:**
```javascript
const rules = {
  fieldName: {
    required: true,
    minLength: 5,
    maxLength: 50,
    pattern: '^[a-zA-Z]+$',
    email: true,
    custom: (value, allValues, field) => {
      // Return true for valid, string error message for invalid
      if (value.startsWith('test')) {
        return 'Cannot start with "test"';
      }
      return true;
    }
  }
};

const result = form.validate(rules);
```

---

### Custom Validation Function

**Example:**
```javascript
const form = Forms.signupForm;

// Function-based validation
const result = form.validate({
  age: (value, allValues, field) => {
    const age = parseInt(value);
    if (isNaN(age)) {
      return 'Age must be a number';
    }
    if (age < 18) {
      return 'Must be 18 or older';
    }
    if (age > 120) {
      return 'Invalid age';
    }
    return true; // Valid
  }
});
```

---

### Clearing Validation

**Example:**
```javascript
const form = Forms.contactForm;

// Validate
form.validate();

// Later, clear validation messages
form.clearValidation();

// Or reset which also clears validation
form.reset();
```

---

## Form Submission

### Basic Form Submission

**Example:**
```javascript
const form = Forms.contactForm;

// Simple submission
const result = await form.submitData();

if (result.success) {
  console.log('Submitted successfully!');
  form.reset();
} else {
  console.error('Submission failed:', result.error);
}
```

---

### Advanced Form Submission

**Example:**
```javascript
const form = Forms.registrationForm;

const result = await form.submitData({
  // Submission URL
  url: '/api/register',
  
  // HTTP method
  method: 'POST',
  
  // Validate before submit
  validate: true,
  
  // Custom validation rules
  validationRules: {
    username: { required: true, minLength: 3 },
    email: { required: true, email: true },
    password: { required: true, minLength: 8 }
  },
  
  // Called before submission
  beforeSubmit: async (data, form) => {
    console.log('Submitting:', data);
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    // Return false to cancel submission
    if (!confirm('Submit registration?')) {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
      return false;
    }
    
    return true;
  },
  
  // Called on success
  onSuccess: (response, submittedData) => {
    console.log('Success:', response);
    alert('Registration successful!');
    form.reset();
    
    // Hide loading state
    submitButton.disabled = false;
    submitButton.textContent = 'Submit';
  },
  
  // Called on error
  onError: (error, validationErrors) => {
    console.error('Error:', error);
    alert('Registration failed: ' + error.message);
    
    // Hide loading state
    submitButton.disabled = false;
    submitButton.textContent = 'Submit';
  },
  
  // Transform data before sending
  transform: (data) => {
    return {
      ...data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };
  }
});
```

---

### Form Submission with Validation

**Example:**
```javascript
const form = Forms.loginForm;

// Submit with automatic validation
const result = await form.submitData({
  url: '/api/login',
  validate: true,
  validationRules: {
    username: { required: true },
    password: { required: true, minLength: 6 }
  }
});

if (result.success) {
  window.location.href = '/dashboard';
} else if (result.errors) {
  console.log('Validation errors:', result.errors);
} else {
  console.error('Submission error:', result.error);
}
```

---

### Form Submission Without AJAX

**Example:**
```javascript
const form = Forms.contactForm;

// Traditional form submission (not AJAX)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Validate
  const result = form.validate({
    email: { required: true, email: true },
    message: { required: true, minLength: 10 }
  });
  
  if (result.isValid) {
    // Submit normally
    form.submit();
  }
});
```

---

## Form Serialization

### Serialize to Object

**Example:**
```javascript
const form = Forms.surveyForm;

const data = form.serialize('object');
console.log(data);
// { name: 'John', age: 25, interests: ['coding', 'gaming'] }
```

---

### Serialize to JSON

**Example:**
```javascript
const form = Forms.contactForm;

const json = form.serialize('json');
console.log(json);
// '{"name":"John","email":"john@example.com","message":"Hello"}'

// Use with fetch
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: json
});
```

---

### Serialize to FormData

**Example:**
```javascript
const form = Forms.uploadForm;

const formData = form.serialize('formdata');

// Use with fetch for file uploads
fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

---

### Serialize to URL-Encoded

**Example:**
```javascript
const form = Forms.searchForm;

const urlEncoded = form.serialize('urlencoded');
console.log(urlEncoded);
// 'query=javascript&category=tutorials&sort=recent'

// Use in URL
const url = `/search?${urlEncoded}`;
window.location.href = url;
```

---

## Form Update Method

The `.update()` method provides declarative form management.

### Basic Form Updates

**Example:**
```javascript
const form = Forms.profileForm;

form.update({
  // Set form values
  values: {
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Developer'
  },
  
  // Add event listener
  addEventListener: {
    submit: (e) => {
      e.preventDefault();
      console.log('Form submitted');
    }
  },
  
  // Set CSS class
  className: 'form-enhanced',
  
  // Set attributes
  setAttribute: {
    'data-form-type': 'profile',
    novalidate: true
  }
});
```

---

### Update with Validation

**Example:**
```javascript
const form = Forms.registrationForm;

form.update({
  // Set values
  values: {
    username: 'newuser',
    email: 'user@example.com'
  },
  
  // Validate with rules
  validate: {
    username: { required: true, minLength: 3 },
    email: { required: true, email: true }
  }
});
```

---

### Update with Reset

**Example:**
```javascript
const form = Forms.contactForm;

form.update({
  // Reset form
  reset: true,
  
  // Or with options
  reset: { clearCustom: true }
});
```

---

### Update with Submission

**Example:**
```javascript
const form = Forms.feedbackForm;

form.update({
  // Submit form with options
  submit: {
    url: '/api/feedback',
    validate: true,
    onSuccess: (response) => {
      console.log('Feedback submitted:', response);
    }
  }
});
```

---

### Combined Updates

**Example:**
```javascript
const form = Forms.loginForm;

form.update({
  // Set values
  values: {
    username: 'admin',
    rememberMe: true
  },
  
  // Validate
  validate: {
    username: { required: true },
    password: { required: true }
  },
  
  // Add styling
  style: {
    padding: '20px',
    backgroundColor: '#f5f5f5'
  },
  
  // Add event handlers
  addEventListener: {
    submit: async (e) => {
      e.preventDefault();
      const result = await form.submitData({
        url: '/api/login'
      });
      if (result.success) {
        window.location.href = '/dashboard';
      }
    },
    reset: () => {
      console.log('Form reset');
    }
  }
});
```

---

## Field Access Methods

### Getting Fields

**Example:**
```javascript
const form = Forms.registrationForm;

// Get field by name
const emailField = form.getField('email');
console.log(emailField.value);

// Get field by ID
const passwordField = form.getField('passwordInput');

// Check if field exists
if (form.getField('newsletter')) {
  console.log('Newsletter field found');
}
```

---

### Setting Fields

**Example:**
```javascript
const form = Forms.profileForm;

// Set text field
form.setField('username', 'johndoe');

// Set checkbox
form.setField('newsletter', true);

// Set radio button
form.setField('gender', 'male');

// Set select
form.setField('country', 'USA');

// Set multiple checkboxes
form.setField('interests', ['coding', 'gaming', 'music']);

// Chain operations
form.setField('firstName', 'John')
    .setField('lastName', 'Doe')
    .setField('email', 'john@example.com');
```

---

## Utility Methods

### Get All Forms

**Example:**
```javascript
// Get all forms on the page
const allForms = Forms.getAllForms();

allForms.forEach(form => {
  console.log(`Form: ${form.id}`);
  console.log('Values:', form.values);
});
```

---

### Validate All Forms

**Example:**
```javascript
// Validate all forms with rules
const results = Forms.validateAll({
  loginForm: {
    username: { required: true },
    password: { required: true }
  },
  contactForm: {
    email: { required: true, email: true }
  }
});

// Check results
Object.entries(results).forEach(([formId, result]) => {
  console.log(`${formId}:`, result.isValid ? 'Valid' : 'Invalid');
  if (!result.isValid) {
    console.log('Errors:', result.errors);
  }
});
```

---

### Reset All Forms

**Example:**
```javascript
// Reset all forms on the page
Forms.resetAll();

// Or reset programmatically before page unload
window.addEventListener('beforeunload', () => {
  Forms.resetAll();
});
```

---

### Form Statistics

**Example:**
```javascript
const stats = Forms.stats();

console.log('Cache Statistics:');
console.log('- Hit Rate:', `${(stats.hitRate * 100).toFixed(2)}%`);
console.log('- Cache Size:', stats.cacheSize);
console.log('- Total Hits:', stats.hits);
console.log('- Total Misses:', stats.misses);
console.log('- Uptime:', `${stats.uptime}ms`);
```

---

## Complete Examples

### Example 1: Login Form with Validation

```javascript
const loginForm = Forms.loginForm;

loginForm.update({
  addEventListener: {
    submit: async (e) => {
      e.preventDefault();
      
      // Validate
      const validation = loginForm.validate({
        username: { required: true },
        password: { required: true, minLength: 6 }
      });
      
      if (!validation.isValid) {
        alert('Please fix the errors');
        return;
      }
      
      // Submit
      const result = await loginForm.submitData({
        url: '/api/login',
        validate: false, // Already validated
        beforeSubmit: (data) => {
          loginButton.disabled = true;
          loginButton.textContent = 'Logging in...';
          return true;
        },
        onSuccess: (response) => {
          alert('Login successful!');
          window.location.href = '/dashboard';
        },
        onError: (error) => {
          alert('Login failed: ' + error.message);
          loginButton.disabled = false;
          loginButton.textContent = 'Login';
        }
      });
    }
  }
});
```

---

### Example 2: Registration Form with Advanced Validation

```javascript
const regForm = Forms.registrationForm;

regForm.update({
  addEventListener: {
    submit: async (e) => {
      e.preventDefault();
      
      // Comprehensive validation
      const result = regForm.validate({
        username: {
          required: true,
          minLength: 3,
          maxLength: 20,
          pattern: '^[a-zA-Z0-9_]+$',
          custom: async (value) => {
            // Check if username is taken
            const response = await fetch(`/api/check-username?username=${value}`);
            const data = await response.json();
            return data.available || 'Username is already taken';
          }
        },
        email: {
          required: true,
          email: true,
          custom: async (value) => {
            // Check if email is taken
            const response = await fetch(`/api/check-email?email=${value}`);
            const data = await response.json();
            return data.available || 'Email is already registered';
          }
        },
        password: {
          required: true,
          minLength: 8,
          custom: (value) => {
            const hasUpper = /[A-Z]/.test(value);
            const hasLower = /[a-z]/.test(value);
            const hasNumber = /\d/.test(value);
            const hasSpecial = /[!@#$%^&*]/.test(value);
            
            if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
              return 'Password must contain uppercase, lowercase, number, and special character';
            }
            return true;
          }
        },
        confirmPassword: {
          required: true,
          custom: (value, allValues) => {
            return value === allValues.password || 'Passwords do not match';
          }
        },
        agreeToTerms: {
          custom: (value) => {
            return value === true || 'You must agree to the terms';
          }
        }
      });
      
      if (!result.isValid) {
        console.log('Validation errors:', result.errors);
        return;
      }
      
      // Submit
      const submitResult = await regForm.submitData({
        url: '/api/register',
        transform: (data) => {
          // Remove confirm password before sending
          const { confirmPassword, ...rest } = data;
          return rest;
        },
        onSuccess: (response) => {
          alert('Registration successful!');
          window.location.href = '/welcome';
        },
        onError: (error) => {
          alert('Registration failed: ' + error.message);
        }
      });
    }
  }
});
```

---

### Example 3: Contact Form with File Upload

```javascript
const contactForm = Forms.contactForm;

contactForm.update({
  addEventListener: {
    submit: async (e) => {
      e.preventDefault();
      
      // Validate
      const result = contactForm.validate({
        name: { required: true },
        email: { required: true, email: true },
        message: { required: true, minLength: 20 }
      });
      
      if (!result.isValid) {
        return;
      }
      
      // Get form data including file
      const formData = contactForm.serialize('formdata');
      
      // Submit with FormData
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          body: formData // Don't set Content-Type, browser sets it with boundary
        });
        
        const data = await response.json();
        
        if (response.ok) {
          alert('Message sent successfully!');
          contactForm.reset();
        } else {
          alert('Failed to send message');
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  }
});
```

---

### Example 4: Multi-Step Form

```javascript
const wizardForm = Forms.wizardForm;
let currentStep = 1;
const totalSteps = 3;

// Step validation rules
const stepRules = {
  1: {
    firstName: { required: true },
    lastName: { required: true },
    email: { required: true, email: true }
  },
  2: {
    address: { required: true },
    city: { required: true },
    zipCode: { required: true, pattern: '^\\d{5}$' }
  },
  3: {
    cardNumber: { required: true, pattern: '^\\d{16}$' },
    expiryDate: { required: true },
    cvv: { required: true, pattern: '^\\d{3}$' }
  }
};

// Next button handler
document.getElementById('nextBtn').addEventListener('click', () => {
  // Validate current step
  const result = wizardForm.validate(stepRules[currentStep]);
  
  if (!result.isValid) {
    alert('Please fill in all required fields correctly');
    return;
  }
  
  // Hide current step, show next
  document.querySelector(`.step-${currentStep}`).style.display = 'none';
  currentStep++;
  document.querySelector(`.step-${currentStep}`).style.display = 'block';
  
  // Update buttons
  document.getElementById('prevBtn').style.display = 'inline-block';
  if (currentStep === totalSteps) {
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'inline-block';
  }
});

// Previous button handler
document.getElementById('prevBtn').addEventListener('click', () => {
  document.querySelector(`.step-${currentStep}`).style.display = 'none';
  currentStep--;
  document.querySelector(`.step-${currentStep}`).style.display = 'block';
  
  // Update buttons
  document.getElementById('nextBtn').style.display = 'inline-block';
  document.getElementById('submitBtn').style.display = 'none';
  if (currentStep === 1) {
    document.getElementById('prevBtn').style.display = 'none';
  }
});

// Submit handler
wizardForm.update({
  addEventListener: {
    submit: async (e) => {
      e.preventDefault();
      
      // Validate final step
      const result = wizardForm.validate(stepRules[currentStep]);
      
      if (!result.isValid) {
        alert('Please fill in all required fields correctly');
        return;
      }
      
      // Submit all data
      const submitResult = await wizardForm.submitData({
        url: '/api/checkout',
        beforeSubmit: () => {
          document.getElementById('submitBtn').disabled = true;
          document.getElementById('submitBtn').textContent = 'Processing...';
          return true;
        },
        onSuccess: (response) => {
          alert('Order completed successfully!');
          window.location.href = '/confirmation?orderId=' + response.orderId;
        },
        onError: (error) => {
          alert('Order failed: ' + error.message);
          document.getElementById('submitBtn').disabled = false;
          document.getElementById('submitBtn').textContent = 'Complete Order';
        }
      });
    }
  }
});
```

---

### Example 5: Dynamic Form with Real-Time Validation

```javascript
const signupForm = Forms.signupForm;

// Real-time validation on blur
['username', 'email', 'password'].forEach(fieldName => {
  const field = signupForm.getField(fieldName);
  
  if (field) {
    field.addEventListener('blur', () => {
      // Validate single field
      const rules = {};
      rules[fieldName] = {
        username: { required: true, minLength: 3 },
        email: { required: true, email: true },
        password: { required: true, minLength: 8 }
      }[fieldName];
      
      const result = signupForm.validate({ [fieldName]: rules });
      
      // Update field styling
      if (result.errors[fieldName]) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
      } else {
        field.classList.add('is-valid');
        field.classList.remove('is-invalid');
      }
    });
  }
});

// Password strength indicator
const passwordField = signupForm.getField('password');
const strengthIndicator = document.getElementById('strengthIndicator');

if (passwordField) {
  passwordField.addEventListener('input', () => {
    const password = passwordField.value;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    const strengthText = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997'];
    
    strengthIndicator.textContent = strengthText[strength - 1] || 'Too Short';
    strengthIndicator.style.color = strengthColors[strength - 1] || '#6c757d';
  });
}

// Form submission
signupForm.update({
  addEventListener: {
    submit: async (e) => {
      e.preventDefault();
      
      const result = await signupForm.submitData({
        url: '/api/signup',
        validationRules: {
          username: { 
            required: true, 
            minLength: 3,
            custom: async (value) => {
              const response = await fetch(`/api/check-username?username=${value}`);
              const data = await response.json();
              return data.available || 'Username already taken';
            }
          },
          email: { 
            required: true, 
            email: true,
            custom: async (value) => {
              const response = await fetch(`/api/check-email?email=${value}`);
              const data = await response.json();
              return data.available || 'Email already registered';
            }
          },
          password: { 
            required: true, 
            minLength: 8,
            custom: (value) => {
              const strength = calculatePasswordStrength(value);
              return strength >= 3 || 'Password is too weak';
            }
          }
        }
      });
      
      if (result.success) {
        window.location.href = '/welcome';
      }
    }
  }
});

function calculatePasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
}
```

---

## Configuration Options

### Global Configuration

```javascript
Forms.configure({
  // Enable console logging
  enableLogging: true,
  
  // Automatic cache cleanup
  autoCleanup: true,
  
  // Cleanup interval in milliseconds
  cleanupInterval: 30000,
  
  // Maximum cache size
  maxCacheSize: 500,
  
  // Auto validation on field change
  autoValidation: false
});
```

---

## Events

### Custom Events

The Form module dispatches custom events:

**formreset Event**
```javascript
form.addEventListener('formreset', (e) => {
  console.log('Form was reset:', e.detail.form);
});
```

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required
- FormData API required
- Fetch API required (or use polyfill)
- Proxy support required

---

## Integration with Main Library

The Form module seamlessly integrates with the main DOM Helpers library:

```javascript
// Access form via Elements
const form = Elements.myForm;

// Access form via Forms
const sameForm = Forms.myForm;

// Both return the same enhanced form
console.log(form === sameForm); // May be true due to caching

// Use with Selector
const formBySelector = Selector.query('#myForm');

// Use with Collections
const allForms = Collections.TagName.form;
```

---

## Best Practices

1. **Always Validate** - Use validation before submission
2. **Provide Feedback** - Show clear error messages to users
3. **Handle Errors** - Implement proper error handling in submission callbacks
4. **Transform Data** - Clean/transform data before sending to server
5. **Security** - Never trust client-side validation alone; always validate server-side
6. **User Experience** - Show loading states during submission
7. **Clear Forms** - Reset forms after successful submission
8. **Accessibility** - Use proper ARIA attributes and form labels

---

## Performance Tips

1. **Use Caching** - Forms are automatically cached for performance
2. **Batch Operations** - Set multiple values at once using `form.values`
3. **Debounce Validation** - For real-time validation, debounce input events
4. **Lazy Validation** - Validate on blur or submit, not on every keystroke
5. **Clean Up** - Call `Forms.destroy()` before page unload if needed

---

## Troubleshooting

### Form not found
```javascript
// Ensure form has an ID
// <form id="myForm">...</form>

const form = Forms.myForm;
if (!form) {
  console.error('Form not found - check ID');
}
```

### Validation not working
```javascript
// Ensure HTML5 validation attributes are set
// <input type="email" required>

// Or provide custom rules
form.validate({
  email: { required: true, email: true }
});
```

### Submission failing
```javascript
// Check network errors
form.submitData({
  url: '/api/submit',
  onError: (error) => {
    console.error('Submission error:', error);
  }
});
```

---

## License

MIT License - See LICENSE file for details

---

## Support

For issues, questions, or contributions, visit the GitHub repository.

---

**End of Documentation**

