# Understanding `$execute()` - A Beginner's Guide

## What is `$execute()`?

`$execute()` is a method for async state that executes an async function and automatically tracks loading, error, and data states. It's used with async states created by `asyncState()`.

Think of it as **async executor** - run async functions with automatic state tracking.

---

## Why Does This Exist?

### The Problem: Manual Async State Management

Without `$execute()`, you manually manage loading/error states:

```javascript
// ❌ Manual - tedious
const state = Reactive.state({
  data: null,
  loading: false,
  error: null
});

async function loadData() {
  state.loading = true;
  state.error = null;
  try {
    const response = await fetch('/api/data');
    state.data = await response.json();
  } catch (err) {
    state.error = err.message;
  } finally {
    state.loading = false;
  }
}

// ✅ With asyncState and $execute() - automatic
const state = Reactive.asyncState(async () => {
  const response = await fetch('/api/data');
  return response.json();
});

state.$execute(); // Automatically manages loading/error/data
```

**Why this matters:**
- Automatic loading state
- Automatic error handling
- Cleaner code
- Less boilerplate
- Consistent pattern

---

## How Does It Work?

### The Async Flow

```javascript
const state = Reactive.asyncState(fetchFunction);

state.$execute()
    ↓
Sets loading = true
    ↓
Runs async function
    ↓
Success? → Sets data, loading = false
Error?   → Sets error, loading = false
```

---

## Basic Usage

### Simple Async Call

```javascript
const userLoader = Reactive.asyncState(async () => {
  const response = await fetch('/api/user');
  return response.json();
});

// Execute
await userLoader.$execute();

console.log(userLoader.loading); // false
console.log(userLoader.data);    // User data
console.log(userLoader.error);   // null
```

### With Parameters

```javascript
const userLoader = Reactive.asyncState(async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

// Execute with parameter
await userLoader.$execute(123);

console.log(userLoader.data); // User 123 data
```

### Multiple Executions

```javascript
const search = Reactive.asyncState(async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
});

await search.$execute('react');
console.log(search.data); // React results

await search.$execute('vue');
console.log(search.data); // Vue results
```

---

## Simple Examples Explained

### Example 1: User Profile Loader

```javascript
const profile = Reactive.asyncState(async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
});

// Show loading state
Reactive.effect(() => {
  const display = document.getElementById('profile');

  if (profile.loading) {
    display.innerHTML = '<p>Loading...</p>';
  } else if (profile.error) {
    display.innerHTML = `<p class="error">${profile.error}</p>`;
  } else if (profile.data) {
    display.innerHTML = `
      <h2>${profile.data.name}</h2>
      <p>${profile.data.email}</p>
    `;
  }
});

// Load user
document.getElementById('load-btn').onclick = async () => {
  await profile.$execute(123);
};
```

---

### Example 2: Search with Debounce

```javascript
const searchResults = Reactive.asyncState(async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
});

let searchTimeout;

document.getElementById('search').oninput = (e) => {
  const query = e.target.value;

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    if (query.length >= 3) {
      await searchResults.$execute(query);
    }
  }, 300);
};

// Display results
Reactive.effect(() => {
  const resultsDiv = document.getElementById('results');

  if (searchResults.loading) {
    resultsDiv.innerHTML = '<p>Searching...</p>';
  } else if (searchResults.data) {
    resultsDiv.innerHTML = searchResults.data
      .map(item => `<div>${item.title}</div>`)
      .join('');
  }
});
```

---

### Example 3: Form Submission

```javascript
const formSubmitter = Reactive.asyncState(async (formData) => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    throw new Error('Submission failed');
  }

  return response.json();
});

document.getElementById('contact-form').onsubmit = async (e) => {
  e.preventDefault();

  const formData = {
    name: e.target.name.value,
    email: e.target.email.value,
    message: e.target.message.value
  };

  await formSubmitter.$execute(formData);

  if (formSubmitter.error) {
    alert('Failed to submit: ' + formSubmitter.error);
  } else {
    alert('Submitted successfully!');
    e.target.reset();
  }
};

// Disable submit while loading
Reactive.effect(() => {
  document.getElementById('submit-btn').disabled = formSubmitter.loading;
});
```

---

## Real-World Example: Product Catalog

```javascript
const products = Reactive.asyncState(async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/products?${params}`);
  return response.json();
});

const filters = Reactive.state({
  category: 'all',
  minPrice: 0,
  maxPrice: 1000,
  sortBy: 'name'
});

// Load products when filters change
Reactive.effect(async () => {
  await products.$execute({
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: filters.sortBy
  });
});

// Display products
Reactive.effect(() => {
  const container = document.getElementById('products');

  if (products.loading) {
    container.innerHTML = '<div class="loading">Loading products...</div>';
    return;
  }

  if (products.error) {
    container.innerHTML = `<div class="error">Error: ${products.error}</div>`;
    return;
  }

  if (products.data && products.data.length > 0) {
    container.innerHTML = products.data
      .map(p => `
        <div class="product">
          <h3>${p.name}</h3>
          <p>$${p.price}</p>
          <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      `)
      .join('');
  } else {
    container.innerHTML = '<p>No products found</p>';
  }
});

// Filter controls
document.getElementById('category').onchange = (e) => {
  filters.category = e.target.value;
};

document.getElementById('sort').onchange = (e) => {
  filters.sortBy = e.target.value;
};
```

---

## Common Patterns

### Pattern 1: Simple Execute

```javascript
await state.$execute();
```

### Pattern 2: Execute with Parameters

```javascript
await state.$execute(param1, param2);
```

### Pattern 3: Execute on Event

```javascript
button.onclick = () => state.$execute();
```

### Pattern 4: Check Result

```javascript
await state.$execute();
if (state.error) {
  console.error(state.error);
} else {
  console.log(state.data);
}
```

---

## Common Questions

### Q: Can I call `$execute()` multiple times?

**Answer:** Yes! Each call runs the async function:

```javascript
await state.$execute(1);
await state.$execute(2);
await state.$execute(3);
```

### Q: Does it cancel previous executions?

**Answer:** No, all run. You need to handle that yourself:

```javascript
let currentRequest = null;

async function loadData() {
  const request = {};
  currentRequest = request;

  await state.$execute();

  if (currentRequest !== request) {
    // Was cancelled
    return;
  }
  // Use data
}
```

### Q: Can I await it?

**Answer:** Yes!

```javascript
await state.$execute();
console.log('Done!');
```

---

## Tips for Success

### 1. Always Check Loading State

```javascript
// ✅ Show loading indicator
Reactive.effect(() => {
  if (state.loading) {
    showLoader();
  } else {
    hideLoader();
  }
});
```

### 2. Handle Errors

```javascript
// ✅ Check for errors
await state.$execute();
if (state.error) {
  alert('Error: ' + state.error);
}
```

### 3. Use in Effects

```javascript
// ✅ Auto-reload on dependency change
Reactive.effect(() => {
  state.$execute(dependency);
});
```

---

## Summary

### What `$execute()` Does:

1. ✅ Runs async function
2. ✅ Sets loading = true
3. ✅ On success: sets data, loading = false
4. ✅ On error: sets error, loading = false
5. ✅ Returns promise

### When to Use It:

- API calls
- Data fetching
- Form submission
- Async operations
- Loading states needed

### The Basic Pattern:

```javascript
const state = Reactive.asyncState(async () => {
  const res = await fetch('/api/data');
  return res.json();
});

await state.$execute();

if (state.error) {
  console.error(state.error);
} else {
  console.log(state.data);
}
```

---

**Remember:** `$execute()` automatically manages loading, error, and data states. Perfect for async operations! 🎉
