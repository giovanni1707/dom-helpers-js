# Understanding `$reset()` - A Beginner's Guide

## What is `$reset()`?

`$reset()` is a method for async state that resets it back to its initial state (no data, no error, not loading). It's used with async states created by `asyncState()`.

Think of it as **async state resetter** - clear everything back to the beginning.

---

## Why Does This Exist?

### The Problem: Clearing Async State

Without `$reset()`, you manually clear each property:

```javascript
// ❌ Manual - tedious
const state = Reactive.asyncState(fetchData);

// After loading...
state.data = null;
state.error = null;
state.loading = false;

// ✅ With $reset() - one call
state.$reset();
```

**Why this matters:**
- Clear state in one call
- Consistent reset behavior
- Less code
- No forgotten properties

---

## How Does It Work?

### The Reset Process

```javascript
state.$reset()
    ↓
Sets data = null
Sets error = null
Sets loading = false
    ↓
Back to initial state
```

---

## Basic Usage

### Simple Reset

```javascript
const userLoader = Reactive.asyncState(async () => {
  const response = await fetch('/api/user');
  return response.json();
});

// Load data
await userLoader.$execute();
console.log(userLoader.data); // User data

// Reset
userLoader.$reset();
console.log(userLoader.data);    // null
console.log(userLoader.error);   // null
console.log(userLoader.loading); // false
```

### Reset After Error

```javascript
const fetcher = Reactive.asyncState(async () => {
  throw new Error('Failed!');
});

await fetcher.$execute();
console.log(fetcher.error); // 'Failed!'

fetcher.$reset();
console.log(fetcher.error); // null
```

### Reset Before New Request

```javascript
const search = Reactive.asyncState(async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
});

await search.$execute('react');
console.log(search.data); // React results

// Clear before new search
search.$reset();
await search.$execute('vue');
```

---

## Simple Examples Explained

### Example 1: User Profile with Clear Button

```javascript
const profile = Reactive.asyncState(async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
});

// Display profile
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
      <button onclick="clearProfile()">Clear</button>
    `;
  } else {
    display.innerHTML = '<p>No profile loaded</p>';
  }
});

// Load profile
document.getElementById('load-btn').onclick = async () => {
  await profile.$execute(123);
};

// Clear profile
window.clearProfile = () => {
  profile.$reset();
};
```

---

### Example 2: Search with Clear

```javascript
const searchResults = Reactive.asyncState(async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
});

const searchInput = document.getElementById('search');
const clearBtn = document.getElementById('clear-search');

// Search on input
searchInput.oninput = async (e) => {
  const query = e.target.value;

  if (query.length >= 3) {
    await searchResults.$execute(query);
  } else {
    searchResults.$reset();
  }
};

// Clear button
clearBtn.onclick = () => {
  searchInput.value = '';
  searchResults.$reset();
};

// Display results
Reactive.effect(() => {
  const resultsDiv = document.getElementById('results');

  if (searchResults.loading) {
    resultsDiv.innerHTML = '<p>Searching...</p>';
  } else if (searchResults.data && searchResults.data.length > 0) {
    resultsDiv.innerHTML = searchResults.data
      .map(item => `<div>${item.title}</div>`)
      .join('');
  } else if (searchResults.data) {
    resultsDiv.innerHTML = '<p>No results found</p>';
  } else {
    resultsDiv.innerHTML = '';
  }
});
```

---

### Example 3: Form Submission with Reset

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

// Submit form
document.getElementById('contact-form').onsubmit = async (e) => {
  e.preventDefault();

  const formData = {
    name: e.target.name.value,
    email: e.target.email.value,
    message: e.target.message.value
  };

  await formSubmitter.$execute(formData);

  if (formSubmitter.error) {
    alert('Failed: ' + formSubmitter.error);
  } else {
    alert('Submitted successfully!');
    e.target.reset();
    formSubmitter.$reset(); // Clear submission state
  }
};

// Show submission status
Reactive.effect(() => {
  const statusDiv = document.getElementById('status');

  if (formSubmitter.loading) {
    statusDiv.innerHTML = '<p class="loading">Submitting...</p>';
    statusDiv.style.display = 'block';
  } else if (formSubmitter.error) {
    statusDiv.innerHTML = `<p class="error">Error: ${formSubmitter.error}</p>`;
    statusDiv.style.display = 'block';
  } else if (formSubmitter.data) {
    statusDiv.innerHTML = '<p class="success">✓ Submitted successfully!</p>';
    statusDiv.style.display = 'block';

    // Hide after 3 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
      formSubmitter.$reset();
    }, 3000);
  } else {
    statusDiv.style.display = 'none';
  }
});
```

---

## Real-World Example: Image Gallery

```javascript
const gallery = Reactive.asyncState(async (albumId) => {
  const response = await fetch(`/api/albums/${albumId}/photos`);
  return response.json();
});

const albums = ['nature', 'architecture', 'portraits'];
let currentAlbum = null;

// Album selector
albums.forEach(albumId => {
  const btn = document.createElement('button');
  btn.textContent = albumId;
  btn.onclick = async () => {
    currentAlbum = albumId;

    // Update active state
    document.querySelectorAll('.album-btn').forEach(b => {
      b.classList.toggle('active', b === btn);
    });

    // Load album
    await gallery.$execute(albumId);
  };
  btn.className = 'album-btn';
  document.getElementById('albums').appendChild(btn);
});

// Clear gallery button
document.getElementById('clear-gallery').onclick = () => {
  gallery.$reset();
  currentAlbum = null;

  // Remove active state
  document.querySelectorAll('.album-btn').forEach(b => {
    b.classList.remove('active');
  });
};

// Display gallery
Reactive.effect(() => {
  const container = document.getElementById('gallery');

  if (gallery.loading) {
    container.innerHTML = '<div class="loading">Loading photos...</div>';
  } else if (gallery.error) {
    container.innerHTML = `<div class="error">Error: ${gallery.error}</div>`;
  } else if (gallery.data) {
    container.innerHTML = gallery.data
      .map(photo => `
        <div class="photo">
          <img src="${photo.thumbnailUrl}" alt="${photo.title}">
          <p>${photo.title}</p>
        </div>
      `)
      .join('');
  } else {
    container.innerHTML = '<p class="empty">Select an album to view photos</p>';
  }
});

// Show/hide clear button
Reactive.effect(() => {
  const clearBtn = document.getElementById('clear-gallery');
  clearBtn.style.display = gallery.data ? 'block' : 'none';
});
```

---

## Common Patterns

### Pattern 1: Simple Reset

```javascript
state.$reset();
```

### Pattern 2: Reset Before New Request

```javascript
state.$reset();
await state.$execute(newParams);
```

### Pattern 3: Reset on Cancel

```javascript
cancelBtn.onclick = () => {
  state.$reset();
};
```

### Pattern 4: Reset After Success

```javascript
await state.$execute();
if (!state.error) {
  state.$reset();
}
```

---

## Common Questions

### Q: When should I use `$reset()`?

**Answer:**

Use it to clear async state:

```javascript
// Clear search results
search.$reset();

// Clear after successful submission
if (!state.error) {
  state.$reset();
}

// Clear on navigation
onPageLeave(() => {
  state.$reset();
});
```

### Q: Does it cancel pending requests?

**Answer:** No, it just clears state:

```javascript
state.$execute(); // Request ongoing
state.$reset();   // State cleared, but request still running
```

### Q: What happens to the data?

**Answer:** Everything becomes null/false:

```javascript
await state.$execute();
console.log(state.data); // Some data

state.$reset();
console.log(state.data);    // null
console.log(state.error);   // null
console.log(state.loading); // false
```

---

## Tips for Success

### 1. Reset Before New Search

```javascript
// ✅ Clear old results
state.$reset();
await state.$execute(newQuery);
```

### 2. Reset on Clear Action

```javascript
// ✅ Clear button
clearBtn.onclick = () => {
  state.$reset();
};
```

### 3. Reset After Success

```javascript
// ✅ Clean up after submit
await state.$execute();
if (!state.error) {
  state.$reset();
}
```

### 4. Reset on Navigation

```javascript
// ✅ Clear when leaving page
onPageChange(() => {
  state.$reset();
});
```

---

## Summary

### What `$reset()` Does:

1. ✅ Sets data = null
2. ✅ Sets error = null
3. ✅ Sets loading = false
4. ✅ Returns to initial state
5. ✅ Clears everything

### When to Use It:

- Clearing search results
- After form submission
- Cancel actions
- Page navigation
- Starting fresh

### The Basic Pattern:

```javascript
const state = Reactive.asyncState(async () => {
  const res = await fetch('/api/data');
  return res.json();
});

// Load data
await state.$execute();
console.log(state.data); // Data

// Clear it
state.$reset();
console.log(state.data);  // null
console.log(state.error); // null
```

---

**Remember:** `$reset()` clears all async state back to initial. Use it when you want to start fresh! 🎉
