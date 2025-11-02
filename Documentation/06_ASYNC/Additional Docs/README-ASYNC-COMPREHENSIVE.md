[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Async - Comprehensive README Documentation


```markdown
# DOM Helpers Async Module

A high-performance vanilla JavaScript async utilities library with seamless DOM integration. This module provides robust async helpers, fetch utilities, form handling, and parallel request management without external dependencies.

**Version:** 1.0.0  
**License:** MIT

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Core Utilities](#core-utilities)
4. [Fetch Utilities](#fetch-utilities)
5. [Form Utilities](#form-utilities)
6. [Parallel Request Management](#parallel-request-management)
7. [Integration with DOM Helpers](#integration-with-dom-helpers)
8. [Configuration](#configuration)
9. [Best Practices](#best-practices)

---

## Installation

### Browser (Global)
```html
<script src="dom-helpers-async.js"></script>
```

Once loaded, all utilities are available via `AsyncHelpers` or as global functions:
```javascript
AsyncHelpers.debounce(func, 300);
// or
debounce(func, 300);
```

### Node.js / CommonJS
```javascript
const AsyncHelpers = require('dom-helpers-async.js');
```

### AMD / RequireJS
```javascript
require(['dom-helpers-async'], function(AsyncHelpers) {
  // Use AsyncHelpers
});
```

---

## Quick Start

```javascript
// Debounce a search input
const searchInput = document.getElementById('search');
const debouncedSearch = AsyncHelpers.debounce((e) => {
  console.log('Searching for:', e.target.value);
}, 500);

searchInput.addEventListener('input', debouncedSearch);

// Fetch data with error handling
AsyncHelpers.fetchJSON('/api/data', {
  retries: 3,
  timeout: 10000,
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.log('Error:', error)
});

// Validate a form
const form = document.getElementById('myForm');
const validation = AsyncHelpers.validateForm(form, {
  email: { type: 'email', required: true, label: 'Email Address' },
  password: { type: 'password', required: true, minLength: 8 }
});

if (!validation.isValid) {
  console.log('Errors:', validation.errors);
}
```

---

## Core Utilities

Core utilities provide essential async operations and data manipulation helpers.

### debounce()

**What it does:** Delays function execution until after a specified delay has passed since the last time the function was called. Perfect for optimizing performance on frequent events like typing or resizing.

**Syntax:**
```javascript
debounce(func, delay, options)
```

**Parameters:**
- `func` (Function, required): The function to debounce
- `delay` (Number, optional): Milliseconds to wait after the last call. Default: `300`
- `options` (Object, optional):
  - `immediate` (Boolean): If `true`, invoke on the leading edge. Default: `false`
  - `maxWait` (Number): Maximum milliseconds to wait before forcing execution. Default: `null`

**Returns:** A debounced function with `.cancel()` and `.flush()` methods

**Example:**
```javascript
// Search input that fires after user stops typing for 500ms
const searchInput = document.getElementById('search');
const handleSearch = AsyncHelpers.debounce((event) => {
  const query = event.target.value;
  console.log('Fetching results for:', query);
  // Make API call here
}, 500);

searchInput.addEventListener('input', handleSearch);

// Manually clear pending debounce
searchInput.addEventListener('blur', () => handleSearch.cancel());

// Force immediate execution
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleSearch.flush();
  }
});
```

**Use Cases:**
- Auto-save functionality
- Search input optimization
- Resize/scroll event handling
- Form field validation

---

### throttle()

**What it does:** Ensures a function is called at most once per specified delay period. Unlike debounce, throttle guarantees execution at regular intervals, ideal for continuous events.

**Syntax:**
```javascript
throttle(func, delay, options)
```

**Parameters:**
- `func` (Function, required): The function to throttle
- `delay` (Number, optional): Milliseconds between calls. Default: `200`
- `options` (Object, optional):
  - `leading` (Boolean): Invoke on leading edge. Default: `true`
  - `trailing` (Boolean): Invoke on trailing edge. Default: `true`

**Returns:** A throttled function with `.cancel()` method

**Example:**
```javascript
// Track scroll position at most once per 200ms
const handleScroll = AsyncHelpers.throttle(() => {
  const scrollPos = window.scrollY;
  console.log('Current scroll position:', scrollPos);
  // Update UI or analytics
}, 200);

window.addEventListener('scroll', handleScroll);

// Throttle mouse movement tracking
const trackMouseMove = AsyncHelpers.throttle((event) => {
  const x = event.clientX;
  const y = event.clientY;
  console.log('Mouse at:', x, y);
}, 100);

document.addEventListener('mousemove', trackMouseMove);
```

**Use Cases:**
- Scroll event handling
- Mouse movement tracking
- Window resize optimization
- Real-time analytics

---

### sanitize()

**What it does:** Removes potentially dangerous content from user input, preventing XSS (Cross-Site Scripting) attacks. Provides flexible control over what HTML is allowed.

**Syntax:**
```javascript
sanitize(input, options)
```

**Parameters:**
- `input` (String): The text to sanitize
- `options` (Object, optional):
  - `allowedTags` (Array): HTML tags to preserve. Default: `[]` (removes all HTML)
  - `allowedAttributes` (Array): Attributes to keep. Default: `[]`
  - `removeScripts` (Boolean): Strip script tags and javascript: protocols. Default: `true`
  - `removeEvents` (Boolean): Remove event attributes (onclick, etc.). Default: `true`
  - `removeStyles` (Boolean): Remove style attributes. Default: `false`

**Returns:** Sanitized string

**Example:**
```javascript
// Remove all HTML and dangerous content
const userComment = '<script>alert("XSS")</script>Hello <b>World</b>';
const safe = AsyncHelpers.sanitize(userComment);
console.log(safe); // 'Hello &lt;b&gt;World&lt;/b&gt;'

// Allow specific HTML tags
const richText = 'Hello <b>World</b>, check <a href="https://example.com">this</a>';
const withTags = AsyncHelpers.sanitize(richText, {
  allowedTags: ['b', 'i', 'a']
});
console.log(withTags); // 'Hello <b>World</b>, check <a>this</a>'

// Remove event handlers but keep basic structure
const dangerous = '<div onclick="hack()">Click me</div>';
const cleaned = AsyncHelpers.sanitize(dangerous, {
  allowedTags: ['div'],
  removeEvents: true
});
console.log(cleaned); // '<div>Click me</div>'
```

**Use Cases:**
- Displaying user-generated content
- Preventing XSS vulnerabilities
- Sanitizing rich text input
- Processing untrusted HTML

---

### sleep()

**What it does:** Returns a promise that resolves after a specified number of milliseconds. Useful for delays, pacing async operations, or creating timed sequences.

**Syntax:**
```javascript
sleep(milliseconds)
```

**Parameters:**
- `milliseconds` (Number, required): Delay duration in milliseconds

**Returns:** Promise that resolves after the specified delay

**Example:**
```javascript
// Simple delay
await AsyncHelpers.sleep(2000);
console.log('After 2 seconds');

// Retry logic with delays
async function fetchWithDelay() {
  for (let i = 0; i < 3; i++) {
    try {
      return await fetch('/api/data');
    } catch (error) {
      console.log(`Attempt ${i + 1} failed, waiting...`);
      await AsyncHelpers.sleep(1000 * (i + 1)); // Exponential backoff
    }
  }
}

// Animation sequence
async function animateSequence() {
  console.log('Step 1');
  await AsyncHelpers.sleep(500);
  console.log('Step 2');
  await AsyncHelpers.sleep(500);
  console.log('Step 3');
}

animateSequence();
```

**Use Cases:**
- Retry delays with exponential backoff
- Sequencing async operations
- Debouncing rapid API calls
- Creating timed UI animations

---

## Fetch Utilities

Advanced fetch helpers with built-in error handling, retries, timeouts, and loading indicators.

### enhancedFetch()

**What it does:** A robust wrapper around the native Fetch API that adds automatic retries, timeout handling, error management, and loading indicators. Handles both successful and failed requests gracefully.

**Syntax:**
```javascript
enhancedFetch(url, options)
```

**Parameters:**
- `url` (String, required): URL to fetch from
- `options` (Object, optional):
  - `method` (String): HTTP method. Default: `'GET'`
  - `headers` (Object): Custom headers. Default: `{}`
  - `body` (String/Object): Request body (auto-converted to JSON)
  - `timeout` (Number): Request timeout in milliseconds. Default: `10000`
  - `retries` (Number): Number of retry attempts. Default: `0`
  - `retryDelay` (Number): Delay between retries in milliseconds. Default: `1000`
  - `loadingIndicator` (Element/Object): DOM element to show/hide during request
  - `onSuccess` (Function): Called on successful response
  - `onError` (Function): Called on error
  - `onStart` (Function): Called before the request starts
  - `onFinally` (Function): Called after success or error
  - `signal` (AbortSignal): For request cancellation

**Returns:** Promise resolving to parsed JSON data

**Example:**
```javascript
// Basic GET request
const data = await AsyncHelpers.enhancedFetch('/api/users');

// POST with retries and timeout
const result = await AsyncHelpers.enhancedFetch('/api/submit', {
  method: 'POST',
  body: { name: 'John', email: 'john@example.com' },
  timeout: 15000,
  retries: 3,
  retryDelay: 2000
});

// With loading indicator
const loader = document.getElementById('loading');
const users = await AsyncHelpers.enhancedFetch('/api/users', {
  loadingIndicator: loader,
  onSuccess: (data) => console.log('Users loaded:', data),
  onError: (error) => console.log('Failed to load users:', error),
  onStart: () => console.log('Starting request...'),
  onFinally: () => console.log('Request complete')
});

// Request cancellation
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000); // Cancel after 5 seconds

try {
  const data = await AsyncHelpers.enhancedFetch('/api/long-running', {
    signal: controller.signal,
    timeout: 10000
  });
} catch (error) {
  console.log('Request was cancelled or timed out');
}

// Custom headers
const data = await AsyncHelpers.enhancedFetch('/api/protected', {
  headers: {
    'Authorization': 'Bearer token123',
    'X-Custom-Header': 'value'
  }
});
```

**Use Cases:**
- Reliable API communication
- Automatic retry on network failures
- Progress indication during loading
- Request cancellation
- Timeout prevention

---

### fetchJSON()

**What it does:** Convenience method for fetching JSON data. A simpler wrapper around `enhancedFetch()` optimized for JSON responses.

**Syntax:**
```javascript
fetchJSON(url, options)
```

**Parameters:** Same as `enhancedFetch()`

**Returns:** Promise resolving to parsed JSON data

**Example:**
```javascript
// Simple JSON fetch
const users = await AsyncHelpers.fetchJSON('/api/users');

// With options
const user = await AsyncHelpers.fetchJSON('/api/user/123', {
  timeout: 5000,
  retries: 2,
  onSuccess: (data) => console.log('User:', data.name)
});

// POST JSON data
const newUser = await AsyncHelpers.fetchJSON('/api/users', {
  method: 'POST',
  body: { name: 'Jane Doe', email: 'jane@example.com' }
});
```

---

### fetchText()

**What it does:** Fetches and returns response as plain text. Useful for CSV, plain text files, or HTML content.

**Syntax:**
```javascript
fetchText(url, options)
```

**Parameters:** Same as `enhancedFetch()`

**Returns:** Promise resolving to text string

**Example:**
```javascript
// Fetch plain text file
const readme = await AsyncHelpers.fetchText('/docs/README.txt');
console.log(readme);

// Fetch CSV and parse
const csv = await AsyncHelpers.fetchText('/data/export.csv');
const rows = csv.split('\n').map(row => row.split(','));

// Fetch HTML template
const template = await AsyncHelpers.fetchText('/templates/user-card.html');
document.getElementById('container').innerHTML = template;
```

---

### fetchBlob()

**What it does:** Fetches and returns response as a Blob. Essential for downloading files, images, or binary data.

**Syntax:**
```javascript
fetchBlob(url, options)
```

**Parameters:** Same as `enhancedFetch()`

**Returns:** Promise resolving to Blob object

**Example:**
```javascript
// Download and display image
const imageBlob = await AsyncHelpers.fetchBlob('/images/photo.jpg');
const imageUrl = URL.createObjectURL(imageBlob);
document.getElementById('img').src = imageUrl;

// Download file
const fileBlob = await AsyncHelpers.fetchBlob('/files/document.pdf');
const link = document.createElement('a');
link.href = URL.createObjectURL(fileBlob);
link.download = 'document.pdf';
link.click();

// Process audio/video
const audioBlob = await AsyncHelpers.fetchBlob('/media/song.mp3');
const audio = new Audio(URL.createObjectURL(audioBlob));
audio.play();
```

---

## Form Utilities

Comprehensive form handling including validation, data extraction, async submission, and user feedback.

### asyncHandler()

**What it does:** Wraps an async function to automatically manage loading states on form elements during execution. Adds/removes loading classes and data attributes for visual feedback.

**Syntax:**
```javascript
asyncHandler(handler, options)
```

**Parameters:**
- `handler` (Function, required): Async function to execute
- `options` (Object, optional):
  - `errorHandler` (Function): Called if handler throws error
  - `loadingClass` (String): CSS class to add during loading. Default: `'loading'`
  - `loadingAttribute` (String): Data attribute to set. Default: `'data-loading'`

**Returns:** Wrapped async function

**Example:**
```javascript
// Wrap button click handler
const submitBtn = document.getElementById('submit');
submitBtn.addEventListener('click', AsyncHelpers.asyncHandler(
  async (event) => {
    event.preventDefault();
    const result = await fetch('/api/submit');
    return result.json();
  },
  {
    loadingClass: 'is-loading',
    errorHandler: (error) => console.error('Submit failed:', error)
  }
));

// Usage in CSS
/* 
.is-loading {
  opacity: 0.6;
  pointer-events: none;
}

.is-loading::after {
  content: '...';
}
*/

// Multiple async operations
const saveBtn = document.getElementById('save');
const deleteBtn = document.getElementById('delete');

const handleSave = AsyncHelpers.asyncHandler(async () => {
  const data = new FormData(document.getElementById('form'));
  await AsyncHelpers.enhancedFetch('/api/save', {
    method: 'POST',
    body: data
  });
}, { loadingClass: 'btn-saving' });

const handleDelete = AsyncHelpers.asyncHandler(async () => {
  await AsyncHelpers.enhancedFetch('/api/delete', { method: 'DELETE' });
}, { loadingClass: 'btn-deleting' });

saveBtn.addEventListener('click', handleSave);
deleteBtn.addEventListener('click', handleDelete);
```

**Use Cases:**
- Button submit handlers
- Form action triggers
- Visual loading feedback
- Error handling on user actions

---

### validateForm()

**What it does:** Validates form fields against defined rules. Automatically applies error classes to invalid fields and returns detailed error messages.

**Syntax:**
```javascript
validateForm(form, rules)
```

**Parameters:**
- `form` (HTMLFormElement, required): The form to validate
- `rules` (Object, required): Validation rules keyed by field name:
  - `required` (Boolean): Field must have a value
  - `type` (String): Field type ('email', 'url', 'number')
  - `minLength` (Number): Minimum character count
  - `maxLength` (Number): Maximum character count
  - `pattern` (RegExp): Regex pattern to match
  - `validator` (Function): Custom validation function returning `true` or error message
  - `label` (String): Field name for error messages

**Returns:** Object with `{ isValid: Boolean, errors: Array }`

**Example:**
```javascript
const form = document.getElementById('registrationForm');

// Define validation rules
const rules = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
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
    validator: (value) => {
      // Password must contain letter and number
      if (!/[a-z]/.test(value) || !/[0-9]/.test(value)) {
        return 'Password must contain letters and numbers';
      }
      return true;
    },
    label: 'Password'
  },
  website: {
    type: 'url',
    label: 'Website'
  },
  age: {
    type: 'number',
    label: 'Age'
  }
};

// Validate on form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const validation = AsyncHelpers.validateForm(form, rules);
  
  if (!validation.isValid) {
    console.log('Validation errors:', validation.errors);
    // Display errors to user
    validation.errors.forEach(error => {
      console.log('- ' + error);
    });
  } else {
    console.log('Form is valid, submitting...');
    // Submit form
  }
});

// Real-time validation on blur
form.querySelectorAll('input').forEach(field => {
  field.addEventListener('blur', () => {
    const validation = AsyncHelpers.validateForm(form, rules);
    // Highlight any errors
  });
});
```

**Validation Types:**
- `required`: Must have a value
- `email`: Valid email format
- `url`: Valid URL starting with http:// or https://
- `number`: Parseable as a number
- Custom: Function returning true or error message

**Use Cases:**
- Client-side form validation
- Real-time field validation
- Pre-submission checks
- User feedback on errors

---

### getFormData()

**What it does:** Extracts all form field values into a JavaScript object. Handles multiple values (checkboxes, multi-select), empty fields, and disabled elements intelligently.

**Syntax:**
```javascript
getFormData(form, options)
```

**Parameters:**
- `form` (HTMLFormElement, required): The form to extract data from
- `options` (Object, optional):
  - `includeEmpty` (Boolean): Include fields with empty values. Default: `false`
  - `transform` (Function): Transform the data object before returning
  - `excludeDisabled` (Boolean): Skip disabled fields. Default: `true`

**Returns:** Object containing form field names and values

**Example:**
```javascript
const form = document.getElementById('userForm');

// Basic extraction
const data = AsyncHelpers.getFormData(form);
console.log(data);
// Output: { username: 'john_doe', email: 'john@example.com', subscribe: 'on' }

// Include all fields (even empty ones)
const allData = AsyncHelpers.getFormData(form, {
  includeEmpty: true
});

// Handle multiple checkboxes
// HTML: <input type="checkbox" name="interests" value="coding">
//       <input type="checkbox" name="interests" value="gaming">
const interests = AsyncHelpers.getFormData(form);
console.log(interests.interests); // Array if multiple checked, single value otherwise

// Transform data before using
const transformed = AsyncHelpers.getFormData(form, {
  transform: (data) => {
    // Convert to uppercase, add timestamp
    return {
      ...data,
      username: data.username.toUpperCase(),
      timestamp: new Date().toISOString()
    };
  }
});

// Skip disabled fields
const activeData = AsyncHelpers.getFormData(form, {
  excludeDisabled: true
});
```

**Use Cases:**
- Collecting form data for submission
- Preparing data for API calls
- Form data transformation
- Handling complex form structures

---

### showFormMessage()

**What it does:** Displays a status message within a form (success, error, info, warning). Automatically hides after a specified duration.

**Syntax:**
```javascript
showFormMessage(form, message, type, options)
```

**Parameters:**
- `form` (HTMLFormElement, required): The form to display message in
- `message` (String, required): Message text to display
- `type` (String, optional): Message type ('info', 'success', 'error', 'warning'). Default: `'info'`
- `options` (Object, optional):
  - `duration` (Number): Auto-hide milliseconds (0 = never). Default: `5000`
  - `className` (String): Base CSS class name. Default: `'form-message'`
  - `container` (Element): Custom message container element

**Returns:** The message element

**Example:**
```javascript
const form = document.getElementById('contactForm');

// Show success message (auto-hide after 5 seconds)
AsyncHelpers.showFormMessage(form, 'Message sent successfully!', 'success');

// Show error message (stays visible)
AsyncHelpers.showFormMessage(
  form,
  'An error occurred. Please try again.',
  'error',
  { duration: 0 }
);

// Show info message
AsyncHelpers.showFormMessage(
  form,
  'Please check your email for confirmation.',
  'info',
  { duration: 3000 }
);

// Use with form submission
form.addEventListener('submit', AsyncHelpers.asyncHandler(async (e) => {
  e.preventDefault();
  
  try {
    const data = AsyncHelpers.getFormData(form);
    await AsyncHelpers.enhancedFetch('/api/contact', {
      method: 'POST',
      body: data
    });
    
    AsyncHelpers.showFormMessage(form, 'Message sent!', 'success');
    form.reset();
  } catch (error) {
    AsyncHelpers.showFormMessage(
      form,
      'Failed: ' + error.message,
      'error',
      { duration: 0 }
    );
  }
}));
```

**CSS Styling:**
```css
.form-message {
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  display: none;
}

.form-message--success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.form-message--error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.form-message--info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.form-message--warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}
```

**Use Cases:**
- Form submission feedback
- Validation error display
- User action confirmation
- Status updates

---

## Parallel Request Management

Utilities for managing multiple async operations efficiently.

### parallelAll()

**What it does:** Executes multiple promises in parallel with optional progress tracking. Provides an alternative to `Promise.all()` that can continue even if some requests fail.

**Syntax:**
```javascript
parallelAll(promises, options)
```

**Parameters:**
- `promises` (Array, required): Array of promises to execute
- `options` (Object, optional):
  - `onProgress` (Function): Called after each promise completes with `(completed, total, result)`
  - `failFast` (Boolean): Stop on first error if `true`. Default: `true`

**Returns:** Promise resolving to array of results with `{ status, value/reason }`

**Example:**
```javascript
// Fetch multiple resources in parallel
const requests = [
  AsyncHelpers.fetchJSON('/api/users'),
  AsyncHelpers.fetchJSON('/api/posts'),
  AsyncHelpers.fetchJSON('/api/comments')
];

const results = await AsyncHelpers.parallelAll(requests);
console.log('All requests complete');

// With progress tracking
const userIds = [1, 2, 3, 4, 5];
const userRequests = userIds.map(id => 
  AsyncHelpers.fetchJSON(`/api/users/${id}`)
);

await AsyncHelpers.parallelAll(userRequests, {
  onProgress: (completed, total, result) => {
    console.log(`Loading ${completed}/${total} users...`);
    const progressPercent = (completed / total) * 100;
    document.getElementById('progress').style.width = progressPercent + '%';
  },
  failFast: false // Continue even if some fail
});

// Handle mixed success and failure
const promises = [
  Promise.resolve({ id: 1, name: 'User 1' }),
  Promise.reject(new Error('Failed to load user 2')),
  Promise.resolve({ id: 3, name: 'User 3' })
];

const results = await AsyncHelpers.parallelAll(promises, { failFast: false });

results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`Item ${index}:`, result.value);
  } else {
    console.log(`Item ${index} failed:`, result.reason.message);
  }
});
```

**Use Cases:**
- Loading multiple API endpoints
- Batch processing with progress
- Graceful degradation
- Parallel file downloads

---

### raceWithTimeout()

**What it does:** Races multiple promises and automatically fails if none complete within the specified timeout. Returns the first successful result.

**Syntax:**
```javascript
raceWithTimeout(promises, timeout)
```

**Parameters:**
- `promises` (Array, required): Array of promises to race
- `timeout` (Number, optional): Timeout in milliseconds. Default: `5000`

**Returns:** Promise resolving to the first completed promise, or rejecting on timeout

**Example:**
```javascript
// Race multiple API endpoints, use the fastest
const endpoints = [
  AsyncHelpers.fetchJSON('https://api1.example.com/data'),
  AsyncHelpers.fetchJSON('https://api2.example.com/data'),
  AsyncHelpers.fetchJSON('https://api3.example.com/data')
];

try {
  const data = await AsyncHelpers.raceWithTimeout(endpoints, 3000);
  console.log('Got data from fastest endpoint:', data);
} catch (error) {
  console.log('All endpoints too slow or failed:', error.message);
}

// Image loading race
const images = [
  'https://cdn1.example.com/image.jpg',
  'https://cdn2.example.com/image.jpg'
];

const imagePromises = images.map(url => 
  AsyncHelpers.fetchBlob(url)
);

try {
  const fastestImage = await AsyncHelpers.raceWithTimeout(imagePromises, 5000);
  document.getElementById('img').src = URL.createObjectURL(fastestImage);
} catch (error) {
  console.log('Image load timed out');
}

// With custom timeout
const result = await AsyncHelpers.raceWithTimeout(promises, 10000);
```

**Use Cases:**
- CDN fallbacks
- Multi-endpoint redundancy
- Performance optimization
- Timeout enforcement

---

## Integration with DOM Helpers

Once integrated, all utilities are available through the DOM Helpers ecosystem.

### integrate()

**What it does:** Automatically integrates all async utilities with the DOM Helpers system (Elements, Collections, Selector), making them available as convenient methods.

**Syntax:**
```javascript
AsyncHelpers.integrate()
```

**Usage:**
```javascript
// Manual integration (usually automatic)
AsyncHelpers.integrate();

// Now available on Elements
Elements.debounce(func, 300);
Elements.validateForm(form, rules);
Elements.fetchJSON('/api/data');

// On Collections
Collections.throttle(func, 200);
Collections.fetchJSON('/api/data');

// On Selector
Selector.sanitize(userInput);
Selector.sleep(1000);
```

---

### Form Element Extensions

When integrated with DOM Helpers, form elements get special methods:

#### element.validate(rules)
Validate the form with specified rules.

```javascript
const form = Elements('form#registration');
const validation = form.validate({
  email: { type: 'email', required: true }
});
```

#### element.getData(options)
Extract form data into an object.

```javascript
const form = Elements('form');
const data = form.getData({ includeEmpty: false });
```

#### element.showMessage(message, type, options)
Display a status message in the form.

```javascript
const form = Elements('form');
form.showMessage('Saved successfully!', 'success');
```

#### element.submitAsync(options)
Submit a form asynchronously with built-in validation and error handling.

```javascript
const form = Elements('form#contactForm');
form.submitAsync({
  validate: true,
  validationRules: {
    email: { type: 'email', required: true },
    message: { required: true, minLength: 10 }
  },
  onSuccess: (response) => console.log('Submitted!'),
  onError: (error) => console.log('Error:', error)
});
```

---

## Configuration

### configure()

**What it does:** Sets default options for async utilities across the entire module, avoiding repetition in every function call.

**Syntax:**
```javascript
configure(options)
```

**Parameters:**
- `options` (Object, optional):
  - `debounceDelay` (Number): Default debounce delay. Default: `300`
  - `throttleDelay` (Number): Default throttle delay. Default: `200`
  - `fetchTimeout` (Number): Default fetch timeout. Default: `10000`
  - `fetchRetries` (Number): Default fetch retries. Default: `0`

**Returns:** The AsyncModule (chainable)

**Example:**
```javascript
// Set project-wide defaults
AsyncHelpers.configure({
  debounceDelay: 500,
  throttleDelay: 300,
  fetchTimeout: 15000,
  fetchRetries: 3
});

// Now all debounce calls use 500ms by default
AsyncHelpers.debounce(myFunction); // Uses 500ms instead of 300ms

// Can still override per-call
AsyncHelpers.debounce(myFunction, 100); // Uses 100ms for this specific call
```

**Use Cases:**
- Project-wide performance tuning
- Environment-specific configurations
- Consistent timeout handling
- API retry strategy standardization

---

## Utility Methods

### isDOMHelpersAvailable()

**What it does:** Checks if DOM Helpers (Elements, Collections, or Selector) is loaded and available for integration.

**Syntax:**
```javascript
isDOMHelpersAvailable()
```

**Returns:** Boolean (`true` if DOM Helpers detected, `false` otherwise)

**Example:**
```javascript
if (AsyncHelpers.isDOMHelpersAvailable()) {
  console.log('DOM Helpers is available');
  AsyncHelpers.integrate();
} else {
  console.log('Using standalone AsyncHelpers');
}
```

---

## Best Practices

### Performance Optimization

**1. Use debounce for high-frequency events:**
```javascript
// ❌ Bad: Fires on every keystroke
input.addEventListener('input', async (e) => {
  const results = await AsyncHelpers.fetchJSON('/api/search?q=' + e.target.value);
});

// ✅ Good: Fires once typing stops
input.addEventListener('input', AsyncHelpers.debounce(async (e) => {
  const results = await AsyncHelpers.fetchJSON('/api/search?q=' + e.target.value);
}, 300));
```

**2. Use throttle for continuous events:**
```javascript
// ❌ Bad: Updates on every scroll event
window.addEventListener('scroll', () => {
  updateProgressBar();
});

// ✅ Good: Updates at most 4 times per second
window.addEventListener('scroll', AsyncHelpers.throttle(() => {
  updateProgressBar();
}, 250));
```

**3. Implement retry strategies for critical requests:**
```javascript
// ✅ Good: Retries failed requests
const data = await AsyncHelpers.enhancedFetch('/api/critical', {
  retries: 3,
  retryDelay: 1000,
  timeout: 5000
});
```

### Security

**1. Always sanitize user input:**
```javascript
// ❌ Bad: Vulnerable to XSS
const userHTML = userInput;
element.innerHTML = userHTML;

// ✅ Good: Safe from XSS
const safeHTML = AsyncHelpers.sanitize(userInput);
element.innerHTML = safeHTML;
```

**2. Validate form data server-side:**
```javascript
// Client-side validation
const validation = AsyncHelpers.validateForm(form, rules);

// ✅ Always validate again on server
if (validation.isValid) {
  await AsyncHelpers.enhancedFetch('/api/submit', {
    method: 'POST',
    body: AsyncHelpers.getFormData(form)
    // Server validates again
  });
}
```

**3. Use HTTPS and secure headers:**
```javascript
const data = await AsyncHelpers.enhancedFetch('/api/secure', {
  headers: {
    'Authorization': 'Bearer ' + authToken,
    'X-CSRF-Token': csrfToken
  }
});
```

### Error Handling

**1. Always provide error handlers:**
```javascript
try {
  const data = await AsyncHelpers.enhancedFetch('/api/data', {
    onError: (error) => {
      console.error('Fetch failed:', error);
      showUserNotification('Failed to load data');
    }
  });
} catch (error) {
  // Handle error
}
```

**2. Provide user feedback:**
```javascript
const loader = document.getElementById('loader');

await AsyncHelpers.enhancedFetch('/api/data', {
  loadingIndicator: loader,
  onSuccess: () => showNotification('Success!'),
  onError: () => showNotification('Error occurred'),
  onFinally: () => hideLoader()
});
```

**3. Handle form validation errors gracefully:**
```javascript
const validation = AsyncHelpers.validateForm(form, rules);

if (!validation.isValid) {
  // Show all errors
  AsyncHelpers.showFormMessage(
    form,
    validation.errors.join('\n'),
    'error',
    { duration: 0 }
  );
  return;
}
```

### Memory Management

**1. Cancel debounces and throttles when needed:**
```javascript
const debouncedSearch = AsyncHelpers.debounce(search, 500);

// Cancel pending execution
input.addEventListener('blur', () => {
  debouncedSearch.cancel();
});
```

**2. Clean up event listeners:**
```javascript
const handleScroll = AsyncHelpers.throttle(updateUI, 200);

window.addEventListener('scroll', handleScroll);

// Later: Clean up
window.removeEventListener('scroll', handleScroll);
handleScroll.cancel(); // Also cancel pending throttle
```

**3. Abort long-running requests:**
```javascript
const controller = new AbortController();

// Cancel after 10 seconds
const timeout = setTimeout(() => controller.abort(), 10000);

try {
  const data = await AsyncHelpers.enhancedFetch('/api/long', {
    signal: controller.signal
  });
  clearTimeout(timeout);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled');
  }
}
```

### Real-World Examples

**Complete Contact Form:**
```javascript
const form = document.getElementById('contactForm');
const submitBtn = form.querySelector('button[type="submit"]');

// Define validation rules
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    label: 'Name'
  },
  email: {
    required: true,
    type: 'email',
    label: 'Email'
  },
  subject: {
    required: true,
    minLength: 5,
    label: 'Subject'
  },
  message: {
    required: true,
    minLength: 10,
    label: 'Message'
  }
};

// Handle form submission
form.addEventListener('submit', AsyncHelpers.asyncHandler(
  async (event) => {
    event.preventDefault();
    
    // Validate
    const validation = AsyncHelpers.validateForm(form, validationRules);
    if (!validation.isValid) {
      AsyncHelpers.showFormMessage(
        form,
        'Please fix the following errors:\n' + validation.errors.join('\n'),
        'error',
        { duration: 0 }
      );
      return;
    }
    
    // Get sanitized data
    const data = AsyncHelpers.getFormData(form);
    data.message = AsyncHelpers.sanitize(data.message);
    
    // Submit
    const response = await AsyncHelpers.enhancedFetch('/api/contact', {
      method: 'POST',
      body: data,
      timeout: 10000,
      retries: 2
    });
    
    // Show success
    AsyncHelpers.showFormMessage(form, 'Message sent! We\'ll be in touch soon.', 'success');
    form.reset();
    
    return response;
  },
  {
    errorHandler: (error) => {
      AsyncHelpers.showFormMessage(
        form,
        'Failed to send message: ' + error.message,
        'error',
        { duration: 0 }
      );
    }
  }
));

// Real-time validation
form.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('blur', () => {
    AsyncHelpers.validateForm(form, validationRules);
  });
});
```

**Live Search:**
```javascript
const searchInput = document.getElementById('search');
const resultsContainer = document.getElementById('results');

const performSearch = AsyncHelpers.debounce(async (query) => {
  if (!query.trim()) {
    resultsContainer.innerHTML = '';
    return;
  }
  
  try {
    resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
    
    const results = await AsyncHelpers.fetchJSON('/api/search', {
      method: 'POST',
      body: { query },
      timeout: 5000,
      retries: 1
    });
    
    resultsContainer.innerHTML = results.map(item => `
      <div class="result-item">
        <h3>${AsyncHelpers.sanitize(item.title)}</h3>
        <p>${AsyncHelpers.sanitize(item.description)}</p>
      </div>
    `).join('');
    
  } catch (error) {
    resultsContainer.innerHTML = '<div class="error">Search failed</div>';
  }
}, 300);

searchInput.addEventListener('input', (e) => {
  performSearch(e.target.value);
});
```

**Batch Image Upload:**
```javascript
const form = document.getElementById('uploadForm');
const fileInput = form.querySelector('input[type="file"]');
const progressBar = document.getElementById('uploadProgress');

form.addEventListener('submit', AsyncHelpers.asyncHandler(
  async (event) => {
    event.preventDefault();
    
    const files = Array.from(fileInput.files);
    if (files.length === 0) {
      AsyncHelpers.showFormMessage(form, 'Please select files', 'error');
      return;
    }
    
    const uploadPromises = files.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      
      return AsyncHelpers.enhancedFetch('/api/upload', {
        method: 'POST',
        body: formData,
        timeout: 30000,
        retries: 2
      });
    });
    
    const results = await AsyncHelpers.parallelAll(uploadPromises, {
      onProgress: (completed, total) => {
        const percent = (completed / total) * 100;
        progressBar.style.width = percent + '%';
      },
      failFast: false
    });
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    if (failed === 0) {
      AsyncHelpers.showFormMessage(
        form,
        `Successfully uploaded ${successful} files!`,
        'success'
      );
      form.reset();
    } else {
      AsyncHelpers.showFormMessage(
        form,
        `Uploaded ${successful}, failed ${failed}`,
        'warning',
        { duration: 0 }
      );
    }
  },
  {
    errorHandler: (error) => {
      AsyncHelpers.showFormMessage(form, 'Upload failed: ' + error.message, 'error', { duration: 0 });
    }
  }
));
```

---

## API Reference Summary

| Method | Purpose | Returns |
|--------|---------|---------|
| `debounce()` | Delay execution | Function |
| `throttle()` | Rate-limit execution | Function |
| `sanitize()` | Remove XSS vectors | String |
| `sleep()` | Delay promise | Promise |
| `enhancedFetch()` | Robust fetch with retries | Promise |
| `fetchJSON()` | Fetch JSON data | Promise |
| `fetchText()` | Fetch text data | Promise |
| `fetchBlob()` | Fetch binary data | Promise |
| `asyncHandler()` | Wrap async functions | Function |
| `validateForm()` | Validate form fields | Object |
| `getFormData()` | Extract form data | Object |
| `showFormMessage()` | Display form message | HTMLElement |
| `parallelAll()` | Execute promises in parallel | Promise |
| `raceWithTimeout()` | Race with timeout | Promise |
| `configure()` | Set defaults | AsyncModule |
| `integrate()` | Integrate with DOM Helpers | void |
| `isDOMHelpersAvailable()` | Check DOM Helpers | Boolean |

---

## Browser Compatibility

- **Modern Browsers:** Full support (Chrome 45+, Firefox 39+, Safari 10.1+, Edge 15+)
- **Features requiring polyfills:**
  - `Promise`: IE 11 (use polyfill)
  - `fetch`: IE 11 (use polyfill)
  - `AbortController`: IE 11 (use polyfill)

---

## Troubleshooting

**Q: Form validation isn't working**
```javascript
// Ensure form has name attributes on fields
// ❌ Wrong
<input type="email" />

// ✅ Correct
<input type="email" name="email" />
```

**Q: Debounce/throttle not triggering**
```javascript
// Ensure the callback is properly attached
// ❌ Wrong
window.addEventListener('resize', debounce(handleResize, 300));

// ✅ Correct
const debouncedResize = debounce(handleResize, 300);
window.addEventListener('resize', debouncedResize);
```

**Q: Fetch requests timing out**
```javascript
// Increase timeout for slow connections
const data = await AsyncHelpers.enhancedFetch('/api/slow', {
  timeout: 30000, // 30 seconds
  retries: 3
});
```

**Q: XSS still occurring after sanitize**
```javascript
// Sanitize is for HTML content, use textContent for plain text
// ❌ Wrong
element.innerHTML = sanitize(userInput);

// ✅ Correct for plain text
element.textContent = userInput;

// ✅ Correct for HTML
element.innerHTML = sanitize(userInput, { allowedTags: ['b', 'i', 'a'] });
```

---

## License

MIT License - Free for commercial and personal use.

---

## Support & Resources

- **GitHub:** [Project Repository]
- **Issues:** [Report bugs and request features]
- **Documentation:** This README
- **Examples:** See code examples throughout this document

---

## Version History

**v1.0.0** (Current)
- Initial release
- 14+ core utilities
- Full DOM Helpers integration
- Comprehensive form handling
- Advanced fetch capabilities
- Parallel request management
```



