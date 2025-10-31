[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Async Module - Complete Method Reference

## ⚡ AsyncModule / AsyncHelpers Object (Main API)

### Core Async Utilities
- `AsyncModule.debounce(func, delay, options)` - Debounce function execution
  ```javascript
  const debouncedFn = debounce(() => console.log('Called!'), 300, {
    immediate: false,  // Execute on leading edge
    maxWait: 1000     // Maximum wait time
  });
  
  // Also available:
  debouncedFn.cancel();  // Cancel pending execution
  debouncedFn.flush();   // Execute immediately
  ```

- `AsyncModule.throttle(func, delay, options)` - Throttle function execution
  ```javascript
  const throttledFn = throttle(() => console.log('Called!'), 200, {
    leading: true,   // Execute on leading edge
    trailing: true   // Execute on trailing edge
  });
  
  // Also available:
  throttledFn.cancel();  // Cancel pending execution
  ```

- `AsyncModule.sanitize(input, options)` - Sanitize input for XSS protection
  ```javascript
  sanitize('<script>alert("xss")</script>Hello', {
    allowedTags: ['b', 'i', 'strong'],
    allowedAttributes: ['class', 'id'],
    removeScripts: true,
    removeEvents: true,
    removeStyles: false
  });
  ```

- `AsyncModule.sleep(ms)` - Sleep/delay utility (async)
  ```javascript
  await sleep(1000); // Wait 1 second
  ```

### Fetch Utilities
- `AsyncModule.fetch(url, options)` - Enhanced fetch with retries, timeout, loading indicators (async)
  ```javascript
  await AsyncModule.fetch('/api/data', {
    method: 'GET',
    headers: {},
    body: null,
    timeout: 10000,
    retries: 3,
    retryDelay: 1000,
    loadingIndicator: element,  // Element to show/hide
    onSuccess: (data, response) => {},
    onError: (error) => {},
    onStart: () => {},
    onFinally: () => {},
    signal: abortController.signal
  });
  ```

- `AsyncModule.fetchJSON(url, options)` - Fetch JSON data (async)
- `AsyncModule.fetchText(url, options)` - Fetch as text (async)
- `AsyncModule.fetchBlob(url, options)` - Fetch as blob (async)

### Form Utilities
- `AsyncModule.asyncHandler(handler, options)` - Async event handler wrapper
  ```javascript
  const handler = asyncHandler(async (event) => {
    await someAsyncOperation();
  }, {
    errorHandler: (error, event) => {},
    loadingClass: 'loading',
    loadingAttribute: 'data-loading'
  });
  
  element.addEventListener('click', handler);
  ```

- `AsyncModule.validateForm(form, rules)` - Validate form with rules
  ```javascript
  const result = validateForm(form, {
    email: {
      required: true,
      type: 'email',
      label: 'Email Address'
    },
    password: {
      required: true,
      minLength: 8,
      maxLength: 100,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'Password must contain uppercase, lowercase, and number',
      validator: (value) => {
        return value.length >= 8 || 'Password too short';
      }
    }
  });
  // Returns: { isValid: boolean, errors: string[] }
  ```

- `AsyncModule.getFormData(form, options)` - Extract form data as object
  ```javascript
  const data = getFormData(form, {
    includeEmpty: false,
    excludeDisabled: true,
    transform: (data) => {
      // Transform data
      return data;
    }
  });
  ```

- `AsyncModule.showFormMessage(form, message, type, options)` - Show form message
  ```javascript
  showFormMessage(form, 'Success!', 'success', {
    duration: 5000,
    className: 'form-message',
    container: null  // Custom container element
  });
  // Types: 'info', 'success', 'warning', 'error'
  ```

### Parallel Request Utilities
- `AsyncModule.parallelAll(promises, options)` - Enhanced Promise.all with progress (async)
  ```javascript
  await parallelAll([promise1, promise2, promise3], {
    onProgress: (completed, total, result) => {
      console.log(`${completed}/${total} completed`);
    },
    failFast: false  // Continue on errors
  });
  // Returns array of { status: 'fulfilled'|'rejected', value|reason }
  ```

- `AsyncModule.raceWithTimeout(promises, timeout)` - Promise race with timeout (async)
  ```javascript
  await raceWithTimeout([promise1, promise2], 5000);
  ```

### Configuration & Utilities
- `AsyncModule.configure(options)` - Configure default options
  ```javascript
  AsyncModule.configure({
    debounceDelay: 300,
    throttleDelay: 200,
    fetchTimeout: 10000,
    fetchRetries: 0
  });
  ```

- `AsyncModule.integrate()` - Manually integrate with DOM Helpers
- `AsyncModule.isDOMHelpersAvailable()` - Check if DOM Helpers is loaded
- `AsyncModule.version` - Module version string
- `AsyncModule.config` - Current configuration object

---

## 🎯 Integration with Elements Helper

When integrated, Elements gains these methods:

### Elements Async Methods
- `Elements.debounce(func, delay, options)` - Same as AsyncModule.debounce
- `Elements.throttle(func, delay, options)` - Same as AsyncModule.throttle
- `Elements.sanitize(input, options)` - Same as AsyncModule.sanitize
- `Elements.sleep(ms)` - Same as AsyncModule.sleep
- `Elements.fetch(url, options)` - Same as AsyncModule.fetch
- `Elements.fetchJSON(url, options)` - Same as AsyncModule.fetchJSON
- `Elements.fetchText(url, options)` - Same as AsyncModule.fetchText
- `Elements.fetchBlob(url, options)` - Same as AsyncModule.fetchBlob
- `Elements.asyncHandler(handler, options)` - Same as AsyncModule.asyncHandler
- `Elements.validateForm(form, rules)` - Same as AsyncModule.validateForm
- `Elements.getFormData(form, options)` - Same as AsyncModule.getFormData
- `Elements.showFormMessage(form, message, type, options)` - Same as AsyncModule.showFormMessage
- `Elements.parallelAll(promises, options)` - Same as AsyncModule.parallelAll
- `Elements.raceWithTimeout(promises, timeout)` - Same as AsyncModule.raceWithTimeout

### Enhanced Form Elements

When a form element is accessed through Elements, it gains:

- `form.validate(rules)` - Validate form
  ```javascript
  Elements.myForm.validate({
    email: { required: true, type: 'email' },
    password: { required: true, minLength: 8 }
  });
  ```

- `form.getData(options)` - Get form data
  ```javascript
  const data = Elements.myForm.getData({
    includeEmpty: false,
    excludeDisabled: true
  });
  ```

- `form.showMessage(message, type, options)` - Show form message
  ```javascript
  Elements.myForm.showMessage('Success!', 'success');
  ```

- `form.submitAsync(options)` - Async form submission
  ```javascript
  await Elements.myForm.submitAsync({
    validate: true,
    validationRules: {
      email: { required: true, type: 'email' }
    },
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error),
    timeout: 10000,
    retries: 3
  });
  ```

---

## 📦 Integration with Collections Helper

When integrated, Collections gains these methods:

### Collections Async Methods
- `Collections.debounce(func, delay, options)`
- `Collections.throttle(func, delay, options)`
- `Collections.sanitize(input, options)`
- `Collections.sleep(ms)`
- `Collections.fetch(url, options)`
- `Collections.fetchJSON(url, options)`
- `Collections.fetchText(url, options)`
- `Collections.fetchBlob(url, options)`
- `Collections.asyncHandler(handler, options)`
- `Collections.parallelAll(promises, options)`
- `Collections.raceWithTimeout(promises, timeout)`

---

## 🔍 Integration with Selector Helper

When integrated, Selector gains these methods:

### Selector Async Methods
- `Selector.debounce(func, delay, options)`
- `Selector.throttle(func, delay, options)`
- `Selector.sanitize(input, options)`
- `Selector.sleep(ms)`
- `Selector.fetch(url, options)`
- `Selector.fetchJSON(url, options)`
- `Selector.fetchText(url, options)`
- `Selector.fetchBlob(url, options)`
- `Selector.asyncHandler(handler, options)`
- `Selector.parallelAll(promises, options)`
- `Selector.raceWithTimeout(promises, timeout)`

---

## 🌐 Global Utilities

For convenience, these are also available globally:

- `global.debounce` - Direct access to debounce
- `global.throttle` - Direct access to throttle
- `global.sanitize` - Direct access to sanitize
- `global.AsyncHelpers` - Full AsyncModule object

---

## ⚙️ Debounce Function

### Main Function
- `debounce(func, delay, options)` - Create debounced function

### Options
```javascript
{
  immediate: boolean,  // Execute on leading edge (default: false)
  maxWait: number     // Maximum wait time in ms (default: null)
}
```

### Returned Function Methods
- `debouncedFn.cancel()` - Cancel pending execution
- `debouncedFn.flush(...args)` - Execute immediately with args

---

## ⏱️ Throttle Function

### Main Function
- `throttle(func, delay, options)` - Create throttled function

### Options
```javascript
{
  leading: boolean,   // Execute on leading edge (default: true)
  trailing: boolean   // Execute on trailing edge (default: true)
}
```

### Returned Function Methods
- `throttledFn.cancel()` - Cancel pending execution

---

## 🧹 Sanitize Function

### Main Function
- `sanitize(input, options)` - Sanitize string input

### Options
```javascript
{
  allowedTags: string[],        // Allowed HTML tags (default: [])
  allowedAttributes: string[],  // Allowed attributes (default: [])
  removeScripts: boolean,       // Remove <script> tags (default: true)
  removeEvents: boolean,        // Remove event attributes (default: true)
  removeStyles: boolean         // Remove style attributes (default: false)
}
```

---

## 🌐 Enhanced Fetch Options

Used in `fetch()`, `fetchJSON()`, `fetchText()`, `fetchBlob()`:

```javascript
{
  method: string,              // HTTP method (default: 'GET')
  headers: object,             // Request headers
  body: any,                   // Request body (auto-stringified)
  timeout: number,             // Timeout in ms (default: 10000)
  retries: number,             // Number of retries (default: 0)
  retryDelay: number,          // Delay between retries in ms (default: 1000)
  loadingIndicator: Element,   // Element to show/hide during request
  onSuccess: function,         // Success callback (data, response)
  onError: function,           // Error callback (error)
  onStart: function,           // Called before request starts
  onFinally: function,         // Called after request completes
  signal: AbortSignal          // AbortController signal
}
```

---

## 📋 Form Validation Rules

Used in `validateForm()` and `form.validate()`:

### Rule Object Structure
```javascript
{
  fieldName: {
    required: boolean,           // Field is required
    type: string,               // 'email', 'url', 'number'
    minLength: number,          // Minimum string length
    maxLength: number,          // Maximum string length
    pattern: RegExp,            // Pattern to match
    message: string,            // Custom error message for pattern
    label: string,              // Field label for error messages
    validator: function         // Custom validation function
  }
}
```

### Validator Function
```javascript
validator: (value, element) => {
  if (/* validation fails */) {
    return 'Error message';
  }
  return true; // Valid
}
```

### Validation Result
```javascript
{
  isValid: boolean,
  errors: string[]
}
```

---

## 📊 Async Handler Options

Used in `asyncHandler()`:

```javascript
{
  errorHandler: function,      // Error handler (error, event, ...args)
  loadingClass: string,        // CSS class to add during execution (default: 'loading')
  loadingAttribute: string     // Attribute to set during execution (default: 'data-loading')
}
```

---

## 📦 Get Form Data Options

Used in `getFormData()` and `form.getData()`:

```javascript
{
  includeEmpty: boolean,       // Include empty values (default: false)
  excludeDisabled: boolean,    // Exclude disabled fields (default: true)
  transform: function          // Transform function (data) => transformedData
}
```

---

## 💬 Form Message Options

Used in `showFormMessage()` and `form.showMessage()`:

```javascript
{
  duration: number,           // Auto-hide duration in ms (default: 5000, 0 = no auto-hide)
  className: string,          // Base CSS class name (default: 'form-message')
  container: Element          // Custom container element (default: auto-created)
}
```

### Message Types
- `'info'` - Information message
- `'success'` - Success message
- `'warning'` - Warning message
- `'error'` - Error message

---

## 🔄 Parallel All Options

Used in `parallelAll()`:

```javascript
{
  onProgress: function,       // Progress callback (completed, total, result)
  failFast: boolean          // Stop on first error (default: true)
}
```

### Progress Callback
```javascript
onProgress: (completed, total, result) => {
  console.log(`${completed}/${total} completed`);
  // result: { status: 'fulfilled'|'rejected', value|reason }
}
```

### Return Value (when failFast: false)
```javascript
[
  { status: 'fulfilled', value: result1 },
  { status: 'rejected', reason: error1 },
  { status: 'fulfilled', value: result2 }
]
```

---

## 💡 Complete Usage Examples

### Debounce
```javascript
const searchHandler = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

input.addEventListener('input', (e) => searchHandler(e.target.value));
```

### Throttle
```javascript
const scrollHandler = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 200);

window.addEventListener('scroll', scrollHandler);
```

### Enhanced Fetch
```javascript
const data = await AsyncModule.fetch('/api/users', {
  method: 'POST',
  body: { name: 'John', email: 'john@example.com' },
  timeout: 5000,
  retries: 3,
  loadingIndicator: Elements.loadingSpinner,
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error)
});
```

### Form Validation
```javascript
const validation = Elements.myForm.validate({
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    label: 'Username'
  },
  email: {
    required: true,
    type: 'email',
    label: 'Email Address'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must contain uppercase, lowercase, and number'
  }
});

if (!validation.isValid) {
  Elements.myForm.showMessage(validation.errors.join(', '), 'error');
}
```

### Async Form Submission
```javascript
Elements.contactForm.addEventListener('submit', asyncHandler(async (e) => {
  e.preventDefault();
  
  const validation = Elements.contactForm.validate({
    name: { required: true },
    email: { required: true, type: 'email' },
    message: { required: true, minLength: 10 }
  });
  
  if (!validation.isValid) {
    Elements.contactForm.showMessage(validation.errors.join(', '), 'error');
    return;
  }
  
  const data = Elements.contactForm.getData();
  
  await AsyncModule.fetch('/api/contact', {
    method: 'POST',
    body: data,
    onSuccess: () => {
      Elements.contactForm.showMessage('Message sent!', 'success');
      Elements.contactForm.reset();
    },
    onError: (error) => {
      Elements.contactForm.showMessage('Failed to send message', 'error');
    }
  });
}));
```

### Parallel Requests
```javascript
const results = await parallelAll([
  AsyncModule.fetchJSON('/api/users'),
  AsyncModule.fetchJSON('/api/posts'),
  AsyncModule.fetchJSON('/api/comments')
], {
  onProgress: (completed, total) => {
    console.log(`Loading: ${completed}/${total}`);
  },
  failFast: false
});

console.log('All requests completed:', results);
```

---

**Total Methods: 35+** across all async utilities and integrations! 🎉

The Async module provides comprehensive asynchronous functionality with seamless DOM Helpers integration for modern web development!