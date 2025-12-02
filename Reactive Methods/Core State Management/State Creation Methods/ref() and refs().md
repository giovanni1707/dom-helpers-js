# Understanding `ref()` and `refs()` - A Beginner's Guide

## What is `ref()`?

`ref()` is a special function that **wraps a single value** in a reactive container. It's designed for **primitive values** (numbers, strings, booleans) that need to be reactive.

Think of it as putting a single value in a **smart box** that can detect when the value inside changes.

---

## Why Does `ref()` Exist?

### The Problem with Primitive Values

In JavaScript, primitive values (numbers, strings, booleans) are **passed by value**, not by reference. This makes them hard to make reactive:

```javascript
// This doesn't work for reactivity
let count = 0;

Reactive.effect(() => {
  console.log(count); // Captures the VALUE (0), not the VARIABLE
});

count = 5; // Effect doesn't run! The value was copied, not referenced
```

**The problem:** The effect captured the **value** (0), not a **reference** to the variable. When you change `count`, the effect doesn't know about it.

### The Solution: `ref()`

`ref()` wraps the value in an object, so we can track changes:

```javascript
// This works! ✨
const count = Reactive.ref(0);

Reactive.effect(() => {
  console.log(count.value); // Access via .value
});
// Logs: 0

count.value = 5; // Effect runs!
// Logs: 5
```

**Why it works:** `count` is now an **object** (not a primitive), so the effect has a **reference** to it. When `count.value` changes, the effect knows and re-runs.

---

## How Does `ref()` Work?

### The Structure

When you create a ref, you get a **reactive object** with a `.value` property:

```javascript
const message = Reactive.ref('Hello');

console.log(message);        // { value: 'Hello' } (simplified view)
console.log(message.value);  // "Hello"
```

**Behind the scenes:**
```
message = {
  value: 'Hello'  ← The actual data
}
↑
This whole object is reactive (made with state())
```

### Accessing the Value

Always use `.value` to get or set the actual value:

```javascript
const count = Reactive.ref(0);

// Reading
console.log(count.value); // 0

// Writing
count.value = 10;
console.log(count.value); // 10
```

---

## Basic Usage of `ref()`

### Creating a Ref

```javascript
// Numbers
const age = Reactive.ref(25);

// Strings
const name = Reactive.ref('John');

// Booleans
const isActive = Reactive.ref(true);

// Any single value
const data = Reactive.ref(null);
```

### Using Refs with Effects

```javascript
const count = Reactive.ref(0);

Reactive.effect(() => {
  console.log('Count is:', count.value);
});
// Logs: "Count is: 0"

count.value++;
// Logs: "Count is: 1"

count.value += 5;
// Logs: "Count is: 6"
```

### Updating the DOM

```javascript
const greeting = Reactive.ref('Hello World');

Reactive.effect(() => {
  document.getElementById('greeting').textContent = greeting.value;
});
// Page shows: "Hello World"

greeting.value = 'Hi there!';
// Page updates to: "Hi there!"
```

---

## Special Features of `ref()`

### Feature 1: `valueOf()` - Works in Math Operations

Refs have a special `valueOf()` method that lets you use them in calculations:

```javascript
const price = Reactive.ref(100);

// You can use it directly in math!
console.log(price + 50);      // 150
console.log(price * 1.2);     // 120
console.log(price - 10);      // 90

// The actual value doesn't change
console.log(price.value);     // Still 100
```

**How it works:** JavaScript automatically calls `valueOf()` when you use the ref in a numeric operation.

### Feature 2: `toString()` - Works in String Operations

Refs also have a `toString()` method for string operations:

```javascript
const name = Reactive.ref('Alice');

// You can use it directly in strings!
console.log('Hello, ' + name);           // "Hello, Alice"
console.log(`Welcome ${name}!`);         // "Welcome Alice!"
console.log('Name: ' + name);            // "Name: Alice"

// The actual value doesn't change
console.log(name.value);                 // Still "Alice"
```

### But Remember: Always Use `.value` to Change It!

```javascript
const count = Reactive.ref(5);

// ❌ These DON'T work (they don't change the ref)
count = 10;           // Replaces the entire ref object!
count + 5;            // Just returns 10, doesn't change anything

// ✅ This works
count.value = 10;     // Changes the value inside the ref
```

---

## When to Use `ref()` vs `state()`

### Use `ref()` for Single Values

```javascript
// ✅ Good use of ref() - single values
const count = Reactive.ref(0);
const message = Reactive.ref('');
const isLoading = Reactive.ref(false);
```

### Use `state()` for Objects with Multiple Properties

```javascript
// ✅ Good use of state() - multiple related values
const user = Reactive.state({
  name: 'John',
  age: 25,
  email: 'john@example.com'
});
```

### Don't Use `ref()` for Objects (Usually)

```javascript
// ❌ Not ideal - ref wrapping an object
const user = Reactive.ref({
  name: 'John',
  age: 25
});

// You have to do: user.value.name
// Awkward!

// ✅ Better - use state() instead
const user = Reactive.state({
  name: 'John',
  age: 25
});

// Much cleaner: user.name
```

---

## Practical Examples with `ref()`

### Example 1: Simple Counter

```javascript
const count = Reactive.ref(0);

// Update display automatically
Reactive.effect(() => {
  document.getElementById('counter').textContent = count.value;
});

// Button handlers
document.getElementById('increment').onclick = () => {
  count.value++;
};

document.getElementById('decrement').onclick = () => {
  count.value--;
};

document.getElementById('reset').onclick = () => {
  count.value = 0;
};
```

### Example 2: Toggle Switch

```javascript
const isDarkMode = Reactive.ref(false);

// Update theme automatically
Reactive.effect(() => {
  if (isDarkMode.value) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});

// Toggle button
document.getElementById('theme-toggle').onclick = () => {
  isDarkMode.value = !isDarkMode.value;
};
```

### Example 3: Input Binding

```javascript
const searchQuery = Reactive.ref('');

// Watch for changes and filter results
Reactive.effect(() => {
  const query = searchQuery.value.toLowerCase();
  
  // Filter and display results
  const results = allItems.filter(item => 
    item.name.toLowerCase().includes(query)
  );
  
  displayResults(results);
});

// Connect to input
document.getElementById('search-input').oninput = (e) => {
  searchQuery.value = e.target.value;
};
```

### Example 4: Loading State

```javascript
const isLoading = Reactive.ref(false);
const data = Reactive.ref(null);

// Show/hide loading spinner
Reactive.effect(() => {
  const spinner = document.getElementById('spinner');
  spinner.style.display = isLoading.value ? 'block' : 'none';
});

// Fetch data
async function loadData() {
  isLoading.value = true;
  
  try {
    const response = await fetch('/api/data');
    data.value = await response.json();
  } finally {
    isLoading.value = false;
  }
}
```

### Example 5: Computed with Refs

```javascript
const firstName = Reactive.ref('John');
const lastName = Reactive.ref('Doe');

// Create a state that uses the refs
const display = Reactive.state({});

display.$computed('fullName', function() {
  return `${firstName.value} ${lastName.value}`;
});

Reactive.effect(() => {
  console.log('Full name:', display.fullName);
});
// Logs: "Full name: John Doe"

firstName.value = 'Jane';
// Logs: "Full name: Jane Doe"
```

---

## What is `refs()`?

`refs()` is a **convenience function** that creates **multiple refs at once** from an object definition.

Instead of creating refs one by one, you can create them all together.

### The Old Way (One by One)

```javascript
const count = Reactive.ref(0);
const message = Reactive.ref('');
const isActive = Reactive.ref(false);
const score = Reactive.ref(0);
```

**Problems:**
- Repetitive code
- Lots of typing
- Easy to forget the pattern

### The New Way (With `refs()`)

```javascript
const { count, message, isActive, score } = Reactive.refs({
  count: 0,
  message: '',
  isActive: false,
  score: 0
});
```

**Benefits:**
- Less code
- Clearer intent
- All refs defined in one place
- Easy to see all your reactive values

---

## How `refs()` Works

### Input and Output

```javascript
// You give it an object with initial values
const myRefs = Reactive.refs({
  name: 'John',
  age: 25,
  active: true
});

// You get back an object containing refs
console.log(myRefs);
// {
//   name: ref('John'),
//   age: ref(25),
//   active: ref(true)
// }

// Access them like normal refs
console.log(myRefs.name.value);    // "John"
console.log(myRefs.age.value);     // 25
console.log(myRefs.active.value);  // true
```

### Using Destructuring (Common Pattern)

Most people use destructuring to get individual refs:

```javascript
const { name, age, active } = Reactive.refs({
  name: 'John',
  age: 25,
  active: true
});

// Now you have three separate refs
console.log(name.value);    // "John"
console.log(age.value);     // 25
console.log(active.value);  // true

name.value = 'Jane';        // Works!
```

---

## Practical Examples with `refs()`

### Example 1: Form Fields

Instead of this:

```javascript
// ❌ Verbose
const email = Reactive.ref('');
const password = Reactive.ref('');
const rememberMe = Reactive.ref(false);
```

Do this:

```javascript
// ✅ Clean and clear
const { email, password, rememberMe } = Reactive.refs({
  email: '',
  password: '',
  rememberMe: false
});

// Use them like normal refs
Reactive.effect(() => {
  console.log('Email:', email.value);
  console.log('Remember me:', rememberMe.value);
});
```

### Example 2: Game State

```javascript
const { 
  score, 
  lives, 
  level, 
  isPaused, 
  playerName 
} = Reactive.refs({
  score: 0,
  lives: 3,
  level: 1,
  isPaused: false,
  playerName: 'Player'
});

// Update display
Reactive.effect(() => {
  document.getElementById('score').textContent = score.value;
  document.getElementById('lives').textContent = lives.value;
  document.getElementById('level').textContent = level.value;
});

// Game logic
function hitEnemy() {
  lives.value--;
  if (lives.value <= 0) {
    gameOver();
  }
}

function earnPoints(points) {
  score.value += points;
}

function nextLevel() {
  level.value++;
  lives.value = 3; // Reset lives
}
```

### Example 3: Settings Panel

```javascript
const settings = Reactive.refs({
  volume: 50,
  brightness: 75,
  soundEnabled: true,
  notificationsEnabled: true,
  autoSave: false
});

// Don't destructure if you want to keep them grouped
Reactive.effect(() => {
  // Apply volume
  if (settings.soundEnabled.value) {
    setGameVolume(settings.volume.value);
  } else {
    setGameVolume(0);
  }
});

Reactive.effect(() => {
  // Apply brightness
  document.body.style.filter = `brightness(${settings.brightness.value}%)`;
});

// Settings UI
document.getElementById('volume-slider').oninput = (e) => {
  settings.volume.value = e.target.value;
};

document.getElementById('sound-toggle').onchange = (e) => {
  settings.soundEnabled.value = e.target.checked;
};
```

### Example 4: Timer/Stopwatch

```javascript
const { seconds, minutes, hours, isRunning } = Reactive.refs({
  seconds: 0,
  minutes: 0,
  hours: 0,
  isRunning: false
});

let intervalId = null;

// Display time
Reactive.effect(() => {
  const h = String(hours.value).padStart(2, '0');
  const m = String(minutes.value).padStart(2, '0');
  const s = String(seconds.value).padStart(2, '0');
  
  document.getElementById('timer').textContent = `${h}:${m}:${s}`;
});

function start() {
  if (isRunning.value) return;
  
  isRunning.value = true;
  intervalId = setInterval(() => {
    seconds.value++;
    
    if (seconds.value >= 60) {
      seconds.value = 0;
      minutes.value++;
    }
    
    if (minutes.value >= 60) {
      minutes.value = 0;
      hours.value++;
    }
  }, 1000);
}

function stop() {
  isRunning.value = false;
  clearInterval(intervalId);
}

function reset() {
  stop();
  seconds.value = 0;
  minutes.value = 0;
  hours.value = 0;
}
```

### Example 5: Shopping Cart Summary

```javascript
const { itemCount, subtotal, tax, shipping } = Reactive.refs({
  itemCount: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0
});

// Computed total using the refs
const summary = Reactive.state({});
summary.$computed('total', function() {
  return subtotal.value + tax.value + shipping.value;
});

// Update display
Reactive.effect(() => {
  document.getElementById('item-count').textContent = itemCount.value;
  document.getElementById('subtotal').textContent = '$' + subtotal.value.toFixed(2);
  document.getElementById('tax').textContent = '$' + tax.value.toFixed(2);
  document.getElementById('shipping').textContent = '$' + shipping.value.toFixed(2);
  document.getElementById('total').textContent = '$' + summary.total.toFixed(2);
});

// When cart changes
function updateCart(cart) {
  itemCount.value = cart.items.length;
  subtotal.value = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  tax.value = subtotal.value * 0.08;
  shipping.value = subtotal.value > 50 ? 0 : 5.99;
}
```

---

## `ref()` vs `refs()` Comparison

### They Create the Same Thing

```javascript
// Using ref() individually
const count = Reactive.ref(0);
const message = Reactive.ref('');

// Using refs() together
const { count, message } = Reactive.refs({
  count: 0,
  message: ''
});

// Both approaches result in the same refs!
// count.value and message.value work the same way
```

### When to Use Each

**Use `ref()`** when you have just one or two values:

```javascript
const isLoading = Reactive.ref(false);
```

**Use `refs()`** when you have many related values:

```javascript
const { name, email, age, city, country, phone } = Reactive.refs({
  name: '',
  email: '',
  age: null,
  city: '',
  country: '',
  phone: ''
});
```

---

## Common Beginner Questions

### Q: Why do I need `.value`? Can't I just use the ref directly?

**Answer:** The `.value` is necessary because the ref is actually an object wrapping your value. The object itself is what's reactive.

```javascript
const count = Reactive.ref(5);

// count is actually { value: 5 } (simplified)
// So you need .value to get the 5

console.log(count);        // { value: 5 }
console.log(count.value);  // 5
```

**Exception:** In math and string operations, JavaScript automatically calls `valueOf()` or `toString()`:

```javascript
console.log(count + 10);     // 15 (automatic valueOf())
console.log('Count: ' + count); // "Count: 5" (automatic toString())
```

### Q: Should I use `ref()` or `state()` for a single value?

**Answer:** Both work, but `ref()` is cleaner for single values:

```javascript
// ✅ Clean for single value
const count = Reactive.ref(0);
count.value++;

// ✅ Also works, but more verbose
const countState = Reactive.state({ count: 0 });
countState.count++;

// Use ref() for single values, state() for objects
```

### Q: Can I put an object in a `ref()`?

**Answer:** Yes, but it's usually better to use `state()` for objects:

```javascript
// ❌ Works but awkward
const user = Reactive.ref({ name: 'John', age: 25 });
user.value.name = 'Jane';  // Awkward!

// ✅ Better - use state()
const user = Reactive.state({ name: 'John', age: 25 });
user.name = 'Jane';  // Clean!
```

### Q: Do refs work with `$computed()` and `$watch()`?

**Answer:** Yes! Refs are reactive objects, so they support all reactive features:

```javascript
const count = Reactive.ref(0);

// Add computed property
count.$computed('double', function() {
  return this.value * 2;
});

console.log(count.double); // 0

count.value = 5;
console.log(count.double); // 10

// Add watcher
count.$watch('value', (newVal, oldVal) => {
  console.log(`Changed from ${oldVal} to ${newVal}`);
});

count.value = 7; // Logs: "Changed from 5 to 7"
```

### Q: Can I use `refs()` without destructuring?

**Answer:** Absolutely! Sometimes you want to keep them grouped:

```javascript
// Without destructuring - keep as object
const player = Reactive.refs({
  x: 0,
  y: 0,
  health: 100
});

// Access with dot notation
player.x.value = 10;
player.y.value = 20;
player.health.value -= 5;

// With destructuring - separate variables
const { x, y, health } = Reactive.refs({
  x: 0,
  y: 0,
  health: 100
});

x.value = 10;
y.value = 20;
health.value -= 5;

// Choose based on what makes sense for your use case!
```

---

## Tips for Beginners

### 1. Always Remember `.value`

This is the #1 mistake beginners make:

```javascript
const count = Reactive.ref(0);

// ❌ Wrong - doesn't change the ref
count = 5;

// ✅ Correct - changes the value inside the ref
count.value = 5;
```

### 2. Use `ref()` for Primitives, `state()` for Objects

```javascript
// ✅ Good
const count = Reactive.ref(0);
const user = Reactive.state({ name: 'John', age: 25 });

// ❌ Not ideal
const count = Reactive.state({ value: 0 });
const user = Reactive.ref({ name: 'John', age: 25 });
```

### 3. Group Related Refs with `refs()`

```javascript
// ✅ Clean and organized
const { width, height, x, y } = Reactive.refs({
  width: 100,
  height: 50,
  x: 0,
  y: 0
});

// ❌ Verbose and scattered
const width = Reactive.ref(100);
const height = Reactive.ref(50);
const x = Reactive.ref(0);
const y = Reactive.ref(0);
```

### 4. Use Descriptive Names

```javascript
// ❌ Unclear
const r = Reactive.ref(0);

// ✅ Clear
const radius = Reactive.ref(0);
```

### 5. Remember: Refs ARE Objects

```javascript
const count = Reactive.ref(0);

console.log(typeof count);        // "object"
console.log(typeof count.value);  // "number"

// The ref is an object, the value inside is your actual data
```

---

## Summary

### `ref()` - For Single Values

**What it does:**
- Wraps a single value in a reactive container
- Perfect for primitives (numbers, strings, booleans)
- Access and modify via `.value`

**Basic pattern:**
```javascript
const myRef = Reactive.ref(initialValue);

// Read
console.log(myRef.value);

// Write
myRef.value = newValue;
```

**When to use:**
- Single primitive values
- Counters, flags, simple text
- When you don't need an object with multiple properties

---

### `refs()` - For Multiple Single Values

**What it does:**
- Creates multiple refs at once
- Returns an object containing all the refs
- Saves you from repetitive code

**Basic pattern:**
```javascript
const { ref1, ref2, ref3 } = Reactive.refs({
  ref1: value1,
  ref2: value2,
  ref3: value3
});

// Each is a separate ref
ref1.value = newValue;
```

**When to use:**
- Multiple related single values
- Form fields
- Game state
- Configuration values
- Any time you'd create 3+ refs

---

### Key Differences from `state()`

| Feature | `ref()` | `state()` |
|---------|---------|-----------|
| **Purpose** | Single value | Object with properties |
| **Access** | `.value` | Direct property access |
| **Best for** | Primitives | Objects |
| **Example** | `ref(0)` | `state({ count: 0 })` |
| **Change** | `ref.value = 5` | `state.count = 5` |

---

**Remember:** Use `ref()` when you need to make a **single value** reactive. Use `refs()` when you need to create **multiple single values** at once. Both are perfect for primitives, while `state()` is better for objects with multiple properties! 🎉