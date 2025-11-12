# Ref Instance Methods - Complete Guide

## Overview

Refs provide a reactive wrapper for single primitive values. Created with `ReactiveUtils.ref()`, they are ideal for simple toggles, counters, flags, and any single value that needs reactivity. Refs expose special methods for value coercion and primitive access.

---

## Table of Contents

1. [value Property](#value-property) - Get/set the ref's value
2. [valueOf()](#valueof) - Get primitive value for coercion
3. [toString()](#tostring) - Convert to string representation
4. [Complete Example - Toggle Component](#complete-example---toggle-component) - Real-world toggle implementation
5. [Complete Example - Counter with All Methods](#complete-example---counter-with-all-methods) - Comprehensive counter demo
6. [Best Practices](#best-practices) - Usage guidelines
7. [Comparison: Ref vs State](#comparison-ref-vs-state) - When to use what
8. [API Quick Reference](#api-quick-reference) - Quick lookup table

---

## `value` Property

The primary property to get or set the ref's value.

### Syntax
```javascript
ref.value = newValue  // Set
const val = ref.value // Get
```

### Type
- `any` - Can store any type (primitive or object)

### Example - Basic Usage
```javascript
const count = ReactiveUtils.ref(0);

console.log(count.value); // 0

count.value = 5;
console.log(count.value); // 5

count.value++;
console.log(count.value); // 6
```

### Example - String Ref
```javascript
const name = ReactiveUtils.ref('John');

console.log(name.value); // "John"

name.value = 'Jane';
console.log(name.value); // "Jane"

name.value = name.value.toUpperCase();
console.log(name.value); // "JANE"
```

### Example - Boolean Toggle
```javascript
const isOpen = ReactiveUtils.ref(false);

console.log(isOpen.value); // false

// Toggle
isOpen.value = !isOpen.value;
console.log(isOpen.value); // true

// Toggle function
function toggle() {
  isOpen.value = !isOpen.value;
}

toggle(); // false
toggle(); // true
```

### Example - Object Ref
```javascript
const user = ReactiveUtils.ref({
  name: 'John',
  age: 30
});

console.log(user.value.name); // "John"

// Update object
user.value = {
  name: 'Jane',
  age: 25
};

console.log(user.value.name); // "Jane"

// Modify property
user.value.age = 26;
console.log(user.value.age); // 26
```

### Example - Array Ref
```javascript
const items = ReactiveUtils.ref([1, 2, 3]);

console.log(items.value.length); // 3

// Add item
items.value.push(4);
console.log(items.value); // [1, 2, 3, 4]

// Replace array (triggers reactivity)
items.value = [...items.value, 5];
console.log(items.value); // [1, 2, 3, 4, 5]

// Clear array
items.value = [];
console.log(items.value); // []
```

### Example - Computed from Ref
```javascript
const price = ReactiveUtils.ref(100);
const quantity = ReactiveUtils.ref(2);

const total = ReactiveUtils.ref(0);

// Compute total
total.$computed('value', function() {
  return price.value * quantity.value;
});

console.log(total.value); // 200

price.value = 150;
console.log(total.value); // 300

quantity.value = 3;
console.log(total.value); // 450
```

### Example - Watch Ref Value
```javascript
const theme = ReactiveUtils.ref('light');

theme.$watch('value', (newTheme, oldTheme) => {
  console.log(`Theme changed from ${oldTheme} to ${newTheme}`);
  document.body.className = newTheme;
});

theme.value = 'dark'; // Logs: "Theme changed from light to dark"
```

### Example - Bind Ref to DOM
```javascript
const counter = ReactiveUtils.ref(0);

counter.$bind({
  '#counter-display': 'value'
});

// Updates DOM automatically
counter.value = 10;
counter.value++;
counter.value += 5;
```

### Example - Form Input Binding
```javascript
const email = ReactiveUtils.ref('');

// Bind to input
document.getElementById('email-input').addEventListener('input', (e) => {
  email.value = e.target.value;
});

// Watch for validation
email.$watch('value', (value) => {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  
  const errorEl = document.getElementById('email-error');
  errorEl.textContent = isValid ? '' : 'Invalid email';
  errorEl.style.display = isValid ? 'none' : 'block';
});
```

### Example - Loading State
```javascript
const isLoading = ReactiveUtils.ref(false);

isLoading.$bind({
  '#loading-spinner': {
    style: () => ({ display: isLoading.value ? 'block' : 'none' })
  },
  '#submit-btn': {
    disabled: () => isLoading.value,
    textContent: () => isLoading.value ? 'Loading...' : 'Submit'
  }
});

async function submitForm() {
  isLoading.value = true;
  
  try {
    await fetch('/api/submit', { method: 'POST' });
  } finally {
    isLoading.value = false;
  }
}
```

### Example - Counter with Min/Max
```javascript
const counter = ReactiveUtils.ref(0);
const MIN = 0;
const MAX = 10;

function increment() {
  if (counter.value < MAX) {
    counter.value++;
  }
}

function decrement() {
  if (counter.value > MIN) {
    counter.value--;
  }
}

function reset() {
  counter.value = 0;
}

counter.$bind({
  '#counter': () => counter.value,
  '#increment-btn': {
    disabled: () => counter.value >= MAX
  },
  '#decrement-btn': {
    disabled: () => counter.value <= MIN
  }
});
```

### Example - Timer
```javascript
const seconds = ReactiveUtils.ref(0);
const isRunning = ReactiveUtils.ref(false);

let intervalId;

function start() {
  if (!isRunning.value) {
    isRunning.value = true;
    intervalId = setInterval(() => {
      seconds.value++;
    }, 1000);
  }
}

function pause() {
  isRunning.value = false;
  clearInterval(intervalId);
}

function reset() {
  pause();
  seconds.value = 0;
}

seconds.$bind({
  '#timer-display': () => {
    const mins = Math.floor(seconds.value / 60);
    const secs = seconds.value % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
});

isRunning.$bind({
  '#start-pause-btn': {
    textContent: () => isRunning.value ? 'Pause' : 'Start'
  }
});
```

### Use Cases
- Simple counters
- Boolean flags (isOpen, isLoading, isActive)
- Single string values (name, email, searchQuery)
- Theme selection
- Current tab/view
- Single numeric values
- Status indicators

### Important Notes
- Always access/modify through `.value` property
- Changes to `.value` trigger reactivity
- Can store any type (primitive or object)
- For objects/arrays, mutating nested properties may not trigger reactivity
- Replace entire value to ensure reactivity: `ref.value = newValue`

---

## `valueOf()`

Returns the primitive value of the ref for type coercion.

### Syntax
```javascript
const primitive = ref.valueOf()
```

### Parameters
- None

### Returns
- The ref's current value (same as `ref.value`)

### Example - Numeric Operations
```javascript
const count = ReactiveUtils.ref(5);

console.log(count.valueOf()); // 5
console.log(count.value);     // 5 (same)

// Used in numeric operations
const result = count.valueOf() + 10;
console.log(result); // 15

// Automatic coercion
console.log(count + 10); // 15 (valueOf called automatically)
```

### Example - Comparison
```javascript
const age = ReactiveUtils.ref(25);

// Explicit valueOf
if (age.valueOf() >= 18) {
  console.log('Adult');
}

// Automatic coercion
if (age >= 18) {
  console.log('Adult'); // Works the same
}

// Comparison
console.log(age.valueOf() === 25); // true
console.log(age == 25);            // true (coercion)
console.log(age === 25);           // false (different types)
```

### Example - Math Operations
```javascript
const price = ReactiveUtils.ref(99.99);
const quantity = ReactiveUtils.ref(3);

// Using valueOf explicitly
const subtotal = price.valueOf() * quantity.valueOf();
console.log(subtotal); // 299.97

// Automatic coercion
const total = price * quantity;
console.log(total); // 299.97

// Math methods
const rounded = Math.round(price.valueOf());
console.log(rounded); // 100

const max = Math.max(price.valueOf(), 50);
console.log(max); // 99.99
```

### Example - Boolean Context
```javascript
const isActive = ReactiveUtils.ref(true);

// Explicit valueOf
if (isActive.valueOf()) {
  console.log('Active');
}

// Automatic coercion
if (isActive) {
  console.log('Active'); // Works the same
}

// Negation
console.log(!isActive.valueOf()); // false
console.log(!isActive);           // false (coercion)
```

### Example - Array Methods
```javascript
const score = ReactiveUtils.ref(85);

const scores = [90, score.valueOf(), 95, 88];
console.log(scores); // [90, 85, 95, 88]

const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
console.log(average); // 89.5

// Sort with ref
const sortedScores = [90, score, 95, 88].sort((a, b) => {
  const aVal = typeof a === 'object' ? a.valueOf() : a;
  const bVal = typeof b === 'object' ? b.valueOf() : b;
  return aVal - bVal;
});
```

### Example - Template Literals
```javascript
const name = ReactiveUtils.ref('John');
const age = ReactiveUtils.ref(30);

// Using valueOf
const message1 = `Hello, ${name.valueOf()}! You are ${age.valueOf()} years old.`;
console.log(message1); // "Hello, John! You are 30 years old."

// Automatic coercion (toString called)
const message2 = `Hello, ${name}! You are ${age} years old.`;
console.log(message2); // "Hello, John! You are 30 years old."
```

### Example - JSON Serialization
```javascript
const data = {
  count: ReactiveUtils.ref(10),
  name: ReactiveUtils.ref('Test')
};

// Won't serialize refs correctly
console.log(JSON.stringify(data)); 
// {"count":{"value":10},"name":{"value":"Test"}}

// Use valueOf to extract values
const serializable = {
  count: data.count.valueOf(),
  name: data.name.valueOf()
};

console.log(JSON.stringify(serializable));
// {"count":10,"name":"Test"}
```

### Example - Conditional Assignment
```javascript
const score = ReactiveUtils.ref(75);
const passingScore = 60;

// Explicit valueOf
const passed = score.valueOf() >= passingScore;
console.log(passed); // true

// Ternary with coercion
const grade = score >= 90 ? 'A' : 
              score >= 80 ? 'B' : 
              score >= 70 ? 'C' : 
              score >= 60 ? 'D' : 'F';
console.log(grade); // "C"
```

### Use Cases
- Type coercion in expressions
- Mathematical operations
- Comparisons
- Passing to functions expecting primitives
- JSON serialization
- Array/object operations

### Important Notes
- `valueOf()` returns same value as `.value`
- Called automatically in coercion contexts
- Useful for explicit primitive extraction
- Doesn't break reactivity (just reads value)

---

## `toString()`

Converts the ref's value to a string representation.

### Syntax
```javascript
const str = ref.toString()
```

### Parameters
- None

### Returns
- `String` - String representation of the value

### Example - String Conversion
```javascript
const count = ReactiveUtils.ref(42);

console.log(count.toString()); // "42"
console.log(count.value);      // 42

const message = 'Count: ' + count.toString();
console.log(message); // "Count: 42"
```

### Example - Template Literals
```javascript
const name = ReactiveUtils.ref('John');
const age = ReactiveUtils.ref(30);

// Explicit toString
const message1 = `Name: ${name.toString()}, Age: ${age.toString()}`;
console.log(message1); // "Name: John, Age: 30"

// Automatic coercion (toString called)
const message2 = `Name: ${name}, Age: ${age}`;
console.log(message2); // "Name: John, Age: 30"
```

### Example - String Concatenation
```javascript
const firstName = ReactiveUtils.ref('John');
const lastName = ReactiveUtils.ref('Doe');

// Using toString
const fullName1 = firstName.toString() + ' ' + lastName.toString();
console.log(fullName1); // "John Doe"

// Automatic coercion
const fullName2 = firstName + ' ' + lastName;
console.log(fullName2); // "John Doe"
```

### Example - Boolean to String
```javascript
const isActive = ReactiveUtils.ref(true);

console.log(isActive.toString()); // "true"
console.log(String(isActive));    // "true"

// Display in UI
const status = isActive ? 'Active' : 'Inactive';
console.log(status); // "Active"
```

### Example - Number Formatting
```javascript
const price = ReactiveUtils.ref(1234.567);

// Basic toString
console.log(price.toString()); // "1234.567"

// Custom formatting
const formatted = `$${price.value.toFixed(2)}`;
console.log(formatted); // "$1234.57"

// Locale string
const localized = price.value.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD'
});
console.log(localized); // "$1,234.57"
```

### Example - Array to String
```javascript
const items = ReactiveUtils.ref(['apple', 'banana', 'orange']);

console.log(items.toString()); // "apple,banana,orange"

// Custom formatting
const formatted = items.value.join(', ');
console.log(formatted); // "apple, banana, orange"
```

### Example - Object to String
```javascript
const user = ReactiveUtils.ref({
  name: 'John',
  age: 30
});

console.log(user.toString()); // "[object Object]"

// Better formatting
console.log(JSON.stringify(user.value)); // '{"name":"John","age":30}'
console.log(JSON.stringify(user.value, null, 2));
// {
//   "name": "John",
//   "age": 30
// }
```

### Example - Display in DOM
```javascript
const counter = ReactiveUtils.ref(0);

counter.$bind({
  '#display': () => counter.toString(),
  '#message': () => `Current count: ${counter}`,
  '#debug': () => `Type: ${typeof counter.value}, Value: ${counter}`
});

counter.value = 42;
// #display: "42"
// #message: "Current count: 42"
// #debug: "Type: number, Value: 42"
```

### Example - Logging
```javascript
const status = ReactiveUtils.ref('loading');
const progress = ReactiveUtils.ref(0);

function log() {
  console.log(`[${new Date().toISOString()}] Status: ${status}, Progress: ${progress}%`);
}

status.value = 'processing';
progress.value = 50;
log(); // "[2024-01-15T10:30:00.000Z] Status: processing, Progress: 50%"

status.value = 'complete';
progress.value = 100;
log(); // "[2024-01-15T10:30:05.000Z] Status: complete, Progress: 100%"
```

### Example - Form Validation Messages
```javascript
const email = ReactiveUtils.ref('');
const error = ReactiveUtils.ref(null);

email.$watch('value', (value) => {
  if (!value) {
    error.value = 'Email is required';
  } else if (!value.includes('@')) {
    error.value = 'Invalid email format';
  } else {
    error.value = null;
  }
});

error.$bind({
  '#email-error': () => error ? error.toString() : ''
});

email.value = 'test';
// #email-error: "Invalid email format"

email.value = 'test@example.com';
// #email-error: ""
```

### Example - URL Building
```javascript
const baseUrl = ReactiveUtils.ref('https://api.example.com');
const endpoint = ReactiveUtils.ref('/users');
const userId = ReactiveUtils.ref(123);

function buildUrl() {
  return `${baseUrl}${endpoint}/${userId}`;
}

console.log(buildUrl()); // "https://api.example.com/users/123"

userId.value = 456;
console.log(buildUrl()); // "https://api.example.com/users/456"
```

### Example - Debug Information
```javascript
const debugInfo = ReactiveUtils.ref({
  component: 'Dashboard',
  state: 'mounted',
  props: { id: 123 }
});

function debug() {
  console.log('Component:', debugInfo.value.component);
  console.log('State:', debugInfo.value.state);
  console.log('Full info:', debugInfo.toString());
  console.log('Detailed:', JSON.stringify(debugInfo.value, null, 2));
}

debug();
// Component: Dashboard
// State: mounted
// Full info: [object Object]
// Detailed: {
//   "component": "Dashboard",
//   "state": "mounted",
//   "props": { "id": 123 }
// }
```

### Use Cases
- String concatenation
- Template literals
- Display in UI
- Logging and debugging
- URL building
- Message formatting
- Type coercion to string

### Important Notes
- Automatically called in string contexts
- For objects, returns `"[object Object]"` (use `JSON.stringify()` for better output)
- For arrays, returns comma-separated values
- For primitives, returns string representation
- Doesn't modify the original value

---

## Complete Example - Toggle Component

```javascript
// Create reactive toggle ref
const isOpen = ReactiveUtils.ref(false);

// Computed state descriptions
isOpen.$computed('statusText', function() {
  return this.value ? 'Open' : 'Closed';
});

isOpen.$computed('iconClass', function() {
  return this.value ? 'icon-chevron-up' : 'icon-chevron-down';
});

// Watch for changes
isOpen.$watch('value', (newVal, oldVal) => {
  console.log(`Toggle changed: ${oldVal} → ${newVal}`);
  
  // Log as string
  console.log(`Status: ${isOpen.toString()}`);
  
  // Save to localStorage
  localStorage.setItem('toggleState', isOpen.toString());
});

// Bind to DOM
isOpen.$bind({
  '#toggle-btn': {
    textContent: () => isOpen.statusText,
    className: () => isOpen.value ? 'btn-active' : 'btn-inactive',
    'aria-expanded': () => isOpen.toString()
  },
  '#toggle-icon': {
    className: () => isOpen.iconClass
  },
  '#toggle-content': {
    style: () => ({
      display: isOpen.value ? 'block' : 'none',
      maxHeight: isOpen.value ? '500px' : '0'
    })
  },
  '#status-badge': {
    textContent: () => `Status: ${isOpen.statusText}`,
    className: () => `badge ${isOpen.value ? 'badge-success' : 'badge-default'}`
  }
});

// Actions
function toggle() {
  isOpen.value = !isOpen.value;
}

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

// Initialize from localStorage
const saved = localStorage.getItem('toggleState');
if (saved !== null) {
  isOpen.value = saved === 'true';
}

// Attach event listener
document.getElementById('toggle-btn').addEventListener('click', toggle);

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    close();
  }
});

// Usage examples
console.log('Current value:', isOpen.value);        // false
console.log('As primitive:', isOpen.valueOf());     // false
console.log('As string:', isOpen.toString());       // "false"
console.log('In template:', `Open: ${isOpen}`);     // "Open: false"

toggle();
// Logs: "Toggle changed: false → true"
// Logs: "Status: true"

console.log('Current value:', isOpen.value);        // true
console.log('Status text:', isOpen.statusText);     // "Open"
```

---

## Complete Example - Counter with All Methods

```javascript
// Create counter ref
const counter = ReactiveUtils.ref(0);

// Computed properties
counter.$computed('doubled', function() {
  return this.value * 2;
});

counter.$computed('isEven', function() {
  return this.value % 2 === 0;
});

counter.$computed('displayText', function() {
  return `Count: ${this.value} (${this.isEven ? 'Even' : 'Odd'})`;
});

// Watch changes
counter.$watch('value', (newVal, oldVal) => {
  console.log(`Counter: ${oldVal} → ${newVal}`);
  
  // Using toString
  console.log(`As string: "${counter.toString()}"`);
  
  // Using valueOf
  console.log(`As primitive: ${counter.valueOf()}`);
  
  // In expression
  console.log(`Doubled: ${counter * 2}`); // Uses valueOf
});

// Bind to DOM
counter.$bind({
  '#counter-value': 'value',
  '#counter-doubled': 'doubled',
  '#counter-display': 'displayText',
  '#counter-status': {
    textContent: () => counter.isEven ? '✓ Even' : '✗ Odd',
    className: () => counter.isEven ? 'status-success' : 'status-info'
  }
});

// Actions
function increment() {
  counter.value++;
}

function decrement() {
  counter.value--;
}

function incrementBy(amount) {
  counter.value += amount;
}

function reset() {
  counter.value = 0;
}

function setTo(value) {
  counter.value = value;
}

// Examples of using value, valueOf, toString
console.log('=== Direct Access ===');
console.log('counter.value:', counter.value);           // 0

console.log('\n=== valueOf() ===');
console.log('counter.valueOf():', counter.valueOf());   // 0
console.log('counter + 10:', counter + 10);             // 10 (coercion)
console.log('counter * 5:', counter * 5);               // 0 (coercion)

console.log('\n=== toString() ===');
console.log('counter.toString():', counter.toString()); // "0"
console.log(`Template: ${counter}`);                    // "Template: 0"
console.log('Concat: "Value: " + counter');             // "Value: 0"

console.log('\n=== Comparisons ===');
console.log('counter == 0:', counter == 0);             // true (coercion)
console.log('counter === 0:', counter === 0);           // false (different types)
console.log('counter.value === 0:', counter.value === 0); // true

console.log('\n=== Math Operations ===');
const result1 = Math.max(counter, 5);                   // 5
const result2 = Math.abs(counter - 10);                 // 10
console.log('Math.max(counter, 5):', result1);
console.log('Math.abs(counter - 10):', result2);

// Increment and observe
console.log('\n=== After Increment ===');
increment(); // Counter: 0 → 1

console.log('counter.value:', counter.value);           // 1
console.log('counter.valueOf():', counter.valueOf());   // 1
console.log('counter.toString():', counter.toString()); // "1"
console.log('counter.doubled:', counter.doubled);       // 2
console.log('counter.isEven:', counter.isEven);         // false
```

---

## Best Practices

### ✅ DO

```javascript
// Use .value for access and modification
const count = ReactiveUtils.ref(0);
count.value = 5;
console.log(count.value);

// Let coercion work automatically
if (count > 0) { }        // Works (valueOf)
console.log(`Count: ${count}`); // Works (toString)

// Use for simple values
const isLoading = ReactiveUtils.ref(false);
const searchQuery = ReactiveUtils.ref('');
const selectedId = ReactiveUtils.ref(null);
```

### ✅ DO

```javascript
// Bind refs to DOM
const message = ReactiveUtils.ref('Hello');
message.$bind({
  '#display': 'value'
});

// Watch ref changes
message.$watch('value', (newVal) => {
  console.log('Message changed:', newVal);
});
```

### ❌ DON'T

```javascript
// Don't forget .value
const count = ReactiveUtils.ref(0);
count = 5; // ❌ Wrong - reassigns variable
count.value = 5; // ✅ Correct

// Don't rely on strict equality with primitives
if (count === 5) { } // ❌ false (different types)
if (count.value === 5) { } // ✅ Correct
```

### ❌ DON'T

```javascript
// Don't use refs for complex state
const user = ReactiveUtils.ref({ // ❌ Use state() instead
  name: '',
  email: '',
  profile: { /* ... */ }
});

// Better
const user = ReactiveUtils.state({ // ✅ Correct
  name: '',
  email: '',
  profile: { /* ... */ }
});
```

---

## Comparison: Ref vs State

```javascript
// Ref - for single values
const count = ReactiveUtils.ref(0);
count.value++;
console.log(count.value); // 1

// State - for multiple properties
const counter = ReactiveUtils.state({ count: 0, step: 1 });
counter.count++;
console.log(counter.count); // 1

// When to use ref
const isOpen = ReactiveUtils.ref(false);     // ✅ Single boolean
const userId = ReactiveUtils.ref(null);      // ✅ Single ID
const searchQuery = ReactiveUtils.ref('');   // ✅ Single string

// When to use state
const form = ReactiveUtils.state({           // ✅ Multiple related properties
  name: '',
  email: '',
  password: ''
});
```

---

## API Quick Reference

```javascript
const ref = ReactiveUtils.ref(initialValue);

// Properties & Methods
ref.value            // Get/set value
ref.valueOf()        // Get primitive value (for coercion)
ref.toString()       // Convert to string

// Inherited Methods
ref.$computed(key, fn)         // Add computed property
ref.$watch(keyOrFn, callback)  // Watch for changes
ref.$bind(bindingDefs)         // DOM bindings
ref.$batch(fn)                 // Batch updates
ref.$notify(key)               // Manual notify
ref.$raw                       // Get raw value

// Usage Examples
ref.value = 10               // Set value
const val = ref.value        // Get value
const num = ref.valueOf()    // For math: ref + 5
const str = ref.toString()   // For strings: `Count: ${ref}`
```

---
