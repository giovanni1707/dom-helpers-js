[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Form Module - Complete Method Reference

## 📋 Forms Object (Main API)

### Form Access
- `Forms.{formId}` - Get form by ID (e.g., `Forms.loginForm`)
- `Forms.helper` - Access the FormsHelper instance

### Utility Methods
- `Forms.stats()` - Get cache statistics
- `Forms.clear()` - Clear cache
- `Forms.destroy()` - Destroy helper
- `Forms.getAllForms()` - Get all forms with IDs as array
- `Forms.validateAll(rules)` - Validate all forms
- `Forms.resetAll()` - Reset all forms
- `Forms.configure(options)` - Configure helper options

---

## 📝 Enhanced Form Object

When you access a form through `Forms.formId`, it gains these methods and properties:

### Properties
- `form.values` - Getter/setter for all form values as object
  ```javascript
  // Get all values
  const data = Forms.myForm.values;
  
  // Set all values
  Forms.myForm.values = { username: 'John', email: 'john@example.com' };
  ```

- `form._hasFormMethods` - Flag indicating form enhancement (internal)
- `form._isEnhancedForm` - Flag indicating full form enhancement (internal)

### Core Methods
- `form.reset(options)` - Enhanced reset with custom options
  ```javascript
  form.reset({ clearCustom: true });
  ```

### Value Management
- `form.getField(name)` - Get specific form field by name or ID
- `form.setField(name, value)` - Set specific field value
- `form.serialize(format)` - Serialize form data
  - Formats: `'object'` (default), `'json'`, `'formdata'`, `'urlencoded'`

### Validation Methods
- `form.validate(rules)` - Validate form with optional rules
  ```javascript
  const result = form.validate({
    username: { required: true, minLength: 3 },
    email: { required: true, email: true }
  });
  // Returns: { isValid: boolean, errors: {}, values: {} }
  ```

- `form.clearValidation()` - Clear all validation messages

### Submission Methods
- `form.submitData(options)` - Submit form data with enhanced options (async)
  ```javascript
  await form.submitData({
    url: '/api/submit',
    method: 'POST',
    validate: true,
    validationRules: {},
    beforeSubmit: (data) => { /* modify data */ },
    onSuccess: (result) => { /* handle success */ },
    onError: (error) => { /* handle error */ },
    transform: (data) => { /* transform data */ return data; }
  });
  ```

### Enhanced Update Method
- `form.update(updates)` - Enhanced update with form-specific operations
  ```javascript
  form.update({
    values: { username: 'John', email: 'john@example.com' },
    validate: true, // or { rules object }
    reset: true, // or { options object }
    submit: { url: '/api/submit' },
    // Plus all standard DOM updates
    style: { display: 'block' },
    className: 'active'
  });
  ```

---

## 🎯 Form Validation Rules

### Built-in Rule Types

#### Object-based Rules
```javascript
{
  fieldName: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z]+$/,
    email: true,
    custom: (value, allValues, field) => {
      // Return true if valid, or error message string if invalid
      return value === 'expected' || 'Value must be "expected"';
    }
  }
}
```

#### Function-based Rules
```javascript
{
  fieldName: (value, allValues, field) => {
    if (value !== 'expected') {
      return 'Custom error message';
    }
    return true; // or undefined for valid
  }
}
```

### Validation Rule Properties
- `required: boolean` - Field is required
- `minLength: number` - Minimum string length
- `maxLength: number` - Maximum string length
- `pattern: RegExp` - Pattern to match
- `email: boolean` - Validate as email
- `custom: function` - Custom validation function

### Validation Result Object
```javascript
{
  isValid: boolean,
  errors: {
    fieldName: 'Error message',
    anotherField: 'Another error'
  },
  values: {
    // All form values
  }
}
```

---

## 🔧 Internal/Helper Functions

These are available but typically used internally:

### Form Enhancement
- `enhanceFormWithFormMethods(form)` - Add form methods to element (internal)
- `createFormUpdateMethod(form)` - Create form-aware update method (internal)

### Value Management
- `getFormValues(form)` - Extract all form values (internal)
- `setFormValues(form, values)` - Set multiple form values (internal)
- `getFormField(form, name)` - Get field element (internal)
- `setFormField(form, name, value)` - Set field value (internal)
- `setFieldValue(field, value)` - Set individual field value (internal)

### Validation
- `validateForm(form, rules)` - Perform validation (internal)
- `markFieldInvalid(field, message)` - Mark field as invalid (internal)
- `clearFormValidation(form)` - Clear validation UI (internal)

### Submission
- `submitFormData(form, options)` - Submit form (internal, async)

### Serialization
- `serializeForm(form, format)` - Serialize in different formats (internal)

---

## 🏗️ ProductionFormsHelper Class

The underlying helper class (accessible via `Forms.helper`):

### Constructor
- `new ProductionFormsHelper(options)` - Create forms helper instance

### Private Methods (Internal)
- `._initProxy()` - Initialize proxy
- `._getForm(prop)` - Get form by ID
- `._hasForm(prop)` - Check if form exists
- `._getKeys()` - Get all form IDs
- `._enhanceForm(form)` - Enhance form with methods
- `._addToCache(id, form)` - Add to cache
- `._initMutationObserver()` - Set up DOM watching
- `._processMutations(mutations)` - Handle DOM changes
- `._scheduleCleanup()` - Schedule cache cleanup
- `._performCleanup()` - Perform cleanup
- `._log(message)` - Log message
- `._warn(message)` - Warn message

### Public Methods
- `.getStats()` - Get statistics
- `.clearCache()` - Clear cache
- `.destroy()` - Destroy helper
- `.getAllForms()` - Get all forms
- `.validateAll(rules)` - Validate all forms
- `.resetAll()` - Reset all forms

---

## ⚙️ Configuration Options

Used in `Forms.configure(options)`:

```javascript
{
  enableLogging: false,        // Enable console logging
  autoCleanup: true,           // Auto-cleanup stale cache
  cleanupInterval: 30000,      // Cleanup interval (ms)
  maxCacheSize: 500,           // Maximum cache size
  autoValidation: false        // Auto-validate on change
}
```

---

## 📊 Form Submission Options

Used in `form.submitData(options)`:

```javascript
{
  url: string,                    // Submit URL (default: form.action)
  method: string,                 // HTTP method (default: form.method or 'POST')
  validate: boolean,              // Validate before submit (default: true)
  validationRules: object,        // Validation rules
  beforeSubmit: function,         // Called before submit (async)
  onSuccess: function,            // Called on success
  onError: function,              // Called on error
  transform: function             // Transform data before sending
}
```

### Submission Result Object
```javascript
{
  success: boolean,
  data: {},           // Response data (on success)
  error: string,      // Error message (on failure)
  errors: {},         // Validation errors (on validation failure)
  cancelled: boolean  // True if cancelled by beforeSubmit
}
```

---

## 📋 Form Reset Options

Used in `form.reset(options)`:

```javascript
{
  clearCustom: boolean  // Clear custom validation messages (default: true)
}
```

---

## 🎨 Form Serialization Formats

Used in `form.serialize(format)`:

### Available Formats
- `'object'` (default) - Returns JavaScript object
- `'json'` - Returns JSON string
- `'formdata'` - Returns FormData object
- `'urlencoded'` - Returns URL-encoded string

### Examples
```javascript
// Object
form.serialize('object');
// { username: 'John', email: 'john@example.com' }

// JSON
form.serialize('json');
// '{"username":"John","email":"john@example.com"}'

// FormData
const formData = form.serialize('formdata');

// URL-encoded
form.serialize('urlencoded');
// 'username=John&email=john%40example.com'
```

---

## 🔄 Form Values Property

### Get Values
```javascript
const values = Forms.myForm.values;
// Returns: { field1: 'value1', field2: 'value2', ... }
```

### Set Values
```javascript
Forms.myForm.values = {
  username: 'John',
  email: 'john@example.com',
  newsletter: true
};
```

### Value Handling by Field Type
- **Text inputs**: String value
- **Checkboxes**: Boolean (single) or Array (multiple with same name)
- **Radio buttons**: Selected value as string
- **Select**: Selected value
- **Select multiple**: Array of selected values
- **File inputs**: Cannot be set programmatically (security)

---

## 📝 Form Field Types Support

### Input Types
- `text`, `email`, `password`, `tel`, `url`, `number`
- `checkbox` - Boolean or array for multiple
- `radio` - Selected value
- `file` - Read-only (security restriction)
- `hidden`, `date`, `time`, `datetime-local`, `month`, `week`, `color`

### Other Elements
- `<textarea>` - Text value
- `<select>` - Selected value
- `<select multiple>` - Array of selected values

---

## 🎯 Form Update Method Extensions

The `form.update()` method supports all standard DOM updates PLUS:

### Form-Specific Updates
```javascript
form.update({
  // Form-specific
  values: { username: 'John', email: 'john@example.com' },
  validate: true, // or validation rules object
  reset: true, // or reset options object
  submit: true, // or submission options object
  
  // Standard DOM updates
  style: { display: 'block' },
  className: 'active',
  addEventListener: { submit: handler },
  // ... any other DOM updates
});
```

---

## 🌐 Integration with DOMHelpers

If the main DOMHelpers object is available:

- `DOMHelpers.Forms` - Forms object
- `DOMHelpers.ProductionFormsHelper` - FormsHelper class

---

## 💡 Complete Usage Example

```javascript
// Access form
const loginForm = Forms.loginForm;

// Get/Set values
const data = loginForm.values;
loginForm.values = { username: 'john', password: 'secret' };

// Validate
const validation = loginForm.validate({
  username: { required: true, minLength: 3 },
  password: { required: true, minLength: 8 }
});

if (validation.isValid) {
  // Submit
  await loginForm.submitData({
    url: '/api/login',
    onSuccess: (result) => {
      console.log('Login successful!', result);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });
}

// Or use update method
loginForm.update({
  values: { username: 'jane' },
  validate: {
    username: { required: true, minLength: 3 }
  }
});

// Reset form
loginForm.reset();

// Get specific field
const usernameField = loginForm.getField('username');

// Set specific field
loginForm.setField('email', 'john@example.com');

// Serialize
const json = loginForm.serialize('json');
const formData = loginForm.serialize('formdata');

// Clear validation
loginForm.clearValidation();
```

---

## 📊 Statistics Object

Returned by `Forms.stats()`:

```javascript
{
  hits: 10,
  misses: 2,
  cacheSize: 5,
  lastCleanup: 1699564800000,
  hitRate: 0.833,
  uptime: 15000
}
```

---

**Total Methods: 50+** across all form utilities and enhancements! 🎉

The Form module provides comprehensive form handling with validation, submission, and seamless integration with the DOM Helpers ecosystem!