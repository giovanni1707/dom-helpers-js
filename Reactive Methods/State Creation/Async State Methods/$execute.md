# Understanding `$execute()` - A Beginner's Guide

## What is `$execute()`?

`$execute()` is a **method available on async state objects** that executes an asynchronous function while **automatically tracking its loading state, handling errors, and updating data**. It's the easiest way to run async operations with built-in state management.

Think of it as a **smart wrapper for async functions** - you give it an async function, and it handles all the loading/error/success states for you automatically.

---

## Important Note: Only for Async State

`$execute()` is **only available** on async state objects created with `Reactive.async()`:

```javascript
// ✅ Has $execute() method
const asyncState = Reactive.async();
asyncState.$execute(async () => { /* ... */ });

// ❌ Regular state doesn't have $execute()
const regularState = Reactive.state({});
// regularState.$execute() - This doesn't exist!

// ❌ Collections don't have $execute()
const collection = Reactive.collection([]);
// collection.$execute() - This doesn't exist!
```

---

## Why Does `$execute()` Exist?

### The Problem: Manual Async State Management

Without `$execute()`, handling async operations requires lots of manual state management:

```javascript
const state = Reactive.state({
  data: null,
  loading: false,
  error: null
});

// ❌ Manual - lots of boilerplate
async function fetchData() {
  state.loading = true;
  state.error = null;
  
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    state.data = data;
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}
```

**Problems:**
- Lots of boilerplate code
- Easy to forget to set loading/error states
- Manual error handling
- Repetitive pattern
- Error-prone

### The Solution: `$execute()` Does It All

```javascript
const asyncState = Reactive.async();

// ✅ Automatic - $execute() handles everything
await asyncState.$execute(async () => {
  const response = await fetch('/api/data');
  return response.json();
});

// loading, error, and data are managed automatically!
```

**Benefits:**
- Automatic loading state management
- Automatic error handling
- Clean, concise code
- Less boilerplate
- Fewer bugs

---

## How It Works

### The Syntax

```javascript
await asyncState.$execute(asyncFunction);
```

### Parameters

- **`asyncFunction`** `{Function}` - An async function that returns the data
  - Should return the data you want to store
  - Can be any async operation (API call, file read, etc.)
  - Should throw errors if something goes wrong

### Returns

- **`Promise`** - Returns a promise that resolves with the result or rejects with the error

### What It Does Automatically

1. Sets `loading` to `true` before execution
2. Sets `error` to `null` (clears previous errors)
3. Executes your async function
4. If **successful**:
   - Sets `data` to the returned value
   - Sets `loading` to `false`
   - Returns the result
5. If **error occurs**:
   - Sets `error` to the error object
   - Sets `loading` to `false`
   - Throws the error

---

## Basic Usage

### Simple API Call

```javascript
const userData = Reactive.async();

// Execute an async function
await userData.$execute(async () => {
  const response = await fetch('/api/user/123');
  return response.json();
});

// Now you can access the result
console.log(userData.data); // User data
console.log(userData.loading); // false
console.log(userData.error); // null
```

### With Loading Display

```javascript
const posts = Reactive.async([]);

// Show loading state automatically
Reactive.effect(() => {
  if (posts.loading) {
    console.log('Loading posts...');
  } else if (posts.error) {
    console.log('Error:', posts.error.message);
  } else if (posts.isSuccess) {
    console.log('Loaded', posts.data.length, 'posts');
  }
});

// Load posts
await posts.$execute(async () => {
  const response = await fetch('/api/posts');
  return response.json();
});
```

### Error Handling

```javascript
const apiData = Reactive.async();

try {
  await apiData.$execute(async () => {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    return response.json();
  });
  
  console.log('Success!', apiData.data);
} catch (error) {
  console.error('Failed:', error);
  // apiData.error is automatically set
  console.log(apiData.error.message);
}
```

---

## Async State Properties

Async state created with `Reactive.async()` has these properties:

### `data`
The result of the async operation. Initially set to the initial value you provided.

### `loading`
Boolean indicating if an async operation is in progress.

### `error`
Contains error information if the operation failed, otherwise `null`.

### `isSuccess` (computed)
True when not loading, no error, and data is not null.

### `isError` (computed)
True when not loading and an error exists.

---

## Complete Example: User Profile Loader

```javascript
const userProfile = Reactive.async(null);

// Display user profile with loading/error states
Reactive.effect(() => {
  const container = document.getElementById('profile');
  
  if (userProfile.loading) {
    container.innerHTML = '<div class="loading">Loading profile...</div>';
    return;
  }
  
  if (userProfile.isError) {
    container.innerHTML = `
      <div class="error">
        <p>Error: ${userProfile.error.message}</p>
        <button onclick="loadProfile()">Retry</button>
      </div>
    `;
    return;
  }
  
  if (userProfile.isSuccess) {
    const user = userProfile.data;
    container.innerHTML = `
      <div class="profile">
        <h2>${user.name}</h2>
        <p>Email: ${user.email}</p>
        <p>Member since: ${new Date(user.joinDate).toLocaleDateString()}</p>
      </div>
    `;
  }
});

async function loadProfile(userId) {
  try {
    await userProfile.$execute(async () => {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    });
    
    console.log('Profile loaded successfully');
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
}

// Load profile
loadProfile(123);
```

---

## Practical Examples

### Example 1: Simple Data Fetching

```javascript
const articles = Reactive.async([]);

async function loadArticles() {
  await articles.$execute(async () => {
    const response = await fetch('/api/articles');
    return response.json();
  });
}

// Display articles
Reactive.effect(() => {
  const list = document.getElementById('article-list');
  
  if (articles.loading) {
    list.innerHTML = '<p>Loading articles...</p>';
  } else if (articles.isError) {
    list.innerHTML = `<p class="error">${articles.error.message}</p>`;
  } else {
    list.innerHTML = '';
    articles.data.forEach(article => {
      const div = document.createElement('div');
      div.innerHTML = `<h3>${article.title}</h3><p>${article.excerpt}</p>`;
      list.appendChild(div);
    });
  }
});

// Load on page load
loadArticles();
```

### Example 2: Form Submission

```javascript
const submitState = Reactive.async(null);

async function handleSubmit(formData) {
  try {
    await submitState.$execute(async () => {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Submission failed');
      }
      
      return response.json();
    });
    
    // Success!
    alert('Form submitted successfully!');
    console.log('Server response:', submitState.data);
    
  } catch (error) {
    alert(`Submission failed: ${error.message}`);
  }
}

// Update submit button based on state
Reactive.effect(() => {
  const submitBtn = document.getElementById('submit-btn');
  
  submitBtn.disabled = submitState.loading;
  submitBtn.textContent = submitState.loading ? 'Submitting...' : 'Submit';
});

// Form submission
document.getElementById('my-form').onsubmit = async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
  
  await handleSubmit(formData);
};
```

### Example 3: Search with Debouncing

```javascript
const searchResults = Reactive.async([]);
const searchQuery = Reactive.ref('');

let searchTimeout;

// Watch search query and perform search
Reactive.effect(() => {
  const query = searchQuery.value;
  
  clearTimeout(searchTimeout);
  
  if (!query.trim()) {
    searchResults.$reset(); // Clear results
    return;
  }
  
  // Debounce search
  searchTimeout = setTimeout(async () => {
    await searchResults.$execute(async () => {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      return response.json();
    });
  }, 300);
});

// Display search results
Reactive.effect(() => {
  const container = document.getElementById('search-results');
  
  if (searchResults.loading) {
    container.innerHTML = '<p>Searching...</p>';
    return;
  }
  
  if (searchResults.isError) {
    container.innerHTML = `<p class="error">Search failed: ${searchResults.error.message}</p>`;
    return;
  }
  
  if (searchResults.isSuccess) {
    if (searchResults.data.length === 0) {
      container.innerHTML = '<p>No results found</p>';
    } else {
      container.innerHTML = '';
      searchResults.data.forEach(result => {
        const div = document.createElement('div');
        div.className = 'search-result';
        div.innerHTML = `
          <h4>${result.title}</h4>
          <p>${result.description}</p>
        `;
        container.appendChild(div);
      });
    }
  }
});

// Input handler
document.getElementById('search-input').oninput = (e) => {
  searchQuery.value = e.target.value;
};
```

### Example 4: Multiple Sequential API Calls

```javascript
const dashboardData = Reactive.async(null);

async function loadDashboard(userId) {
  await dashboardData.$execute(async () => {
    // Load user data
    const userResponse = await fetch(`/api/users/${userId}`);
    const user = await userResponse.json();
    
    // Load user's posts
    const postsResponse = await fetch(`/api/users/${userId}/posts`);
    const posts = await postsResponse.json();
    
    // Load user's stats
    const statsResponse = await fetch(`/api/users/${userId}/stats`);
    const stats = await statsResponse.json();
    
    // Return combined data
    return {
      user,
      posts,
      stats,
      loadedAt: new Date()
    };
  });
}

// Display dashboard
Reactive.effect(() => {
  if (dashboardData.loading) {
    document.getElementById('dashboard').innerHTML = 
      '<div class="loading">Loading dashboard...</div>';
    return;
  }
  
  if (dashboardData.isError) {
    document.getElementById('dashboard').innerHTML = 
      `<div class="error">Failed to load dashboard: ${dashboardData.error.message}</div>`;
    return;
  }
  
  if (dashboardData.isSuccess) {
    const { user, posts, stats } = dashboardData.data;
    
    document.getElementById('dashboard').innerHTML = `
      <div class="dashboard">
        <h2>Welcome, ${user.name}!</h2>
        <div class="stats">
          <div>Posts: ${stats.postCount}</div>
          <div>Followers: ${stats.followers}</div>
          <div>Following: ${stats.following}</div>
        </div>
        <div class="recent-posts">
          <h3>Recent Posts</h3>
          ${posts.map(post => `<div class="post">${post.title}</div>`).join('')}
        </div>
      </div>
    `;
  }
});

// Load dashboard
loadDashboard(123);
```

### Example 5: File Upload with Progress

```javascript
const uploadState = Reactive.async(null);

async function uploadFile(file) {
  await uploadState.$execute(async () => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    return response.json();
  });
}

// Display upload state
Reactive.effect(() => {
  const status = document.getElementById('upload-status');
  
  if (uploadState.loading) {
    status.innerHTML = '<p>Uploading file...</p>';
    status.className = 'status loading';
  } else if (uploadState.isError) {
    status.innerHTML = `<p>Upload failed: ${uploadState.error.message}</p>`;
    status.className = 'status error';
  } else if (uploadState.isSuccess) {
    status.innerHTML = `<p>File uploaded successfully!</p>`;
    status.className = 'status success';
  }
});

// File input handler
document.getElementById('file-input').onchange = async (e) => {
  const file = e.target.files[0];
  
  if (!file) return;
  
  try {
    await uploadFile(file);
    console.log('Upload result:', uploadState.data);
  } catch (error) {
    console.error('Upload error:', error);
  }
};
```

### Example 6: Retry Logic

```javascript
const apiData = Reactive.async(null);

async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await apiData.$execute(async () => {
        console.log(`Attempt ${attempt} of ${maxRetries}...`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        return response.json();
      });
      
      // Success!
      console.log('Data loaded successfully');
      return;
      
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // All retries failed
  console.error('All retry attempts failed:', lastError);
  throw lastError;
}

// Display data with retry button
Reactive.effect(() => {
  const container = document.getElementById('data-container');
  
  if (apiData.loading) {
    container.innerHTML = '<p>Loading...</p>';
  } else if (apiData.isError) {
    container.innerHTML = `
      <div class="error">
        <p>Error: ${apiData.error.message}</p>
        <button onclick="retryLoad()">Retry</button>
      </div>
    `;
  } else if (apiData.isSuccess) {
    container.innerHTML = `<pre>${JSON.stringify(apiData.data, null, 2)}</pre>`;
  }
});

async function retryLoad() {
  await fetchWithRetry('/api/data');
}

// Initial load
fetchWithRetry('/api/data');
```

### Example 7: Polling for Updates

```javascript
const liveData = Reactive.async(null);
let pollingInterval;

async function fetchData() {
  await liveData.$execute(async () => {
    const response = await fetch('/api/live-data');
    return response.json();
  });
}

function startPolling(intervalMs = 5000) {
  // Initial fetch
  fetchData();
  
  // Poll every intervalMs
  pollingInterval = setInterval(() => {
    fetchData();
  }, intervalMs);
}

function stopPolling() {
  clearInterval(pollingInterval);
}

// Display live data with last update time
Reactive.effect(() => {
  const container = document.getElementById('live-data');
  
  if (liveData.loading && !liveData.data) {
    // First load
    container.innerHTML = '<p>Loading initial data...</p>';
  } else if (liveData.isSuccess) {
    container.innerHTML = `
      <div class="live-data">
        <pre>${JSON.stringify(liveData.data, null, 2)}</pre>
        <p class="last-update">
          Last updated: ${new Date().toLocaleTimeString()}
          ${liveData.loading ? ' (Refreshing...)' : ''}
        </p>
      </div>
    `;
  } else if (liveData.isError) {
    container.innerHTML = `
      <div class="error">
        <p>Error: ${liveData.error.message}</p>
        <button onclick="startPolling()">Retry</button>
      </div>
    `;
  }
});

// Start polling on page load
startPolling(5000);

// Stop polling when page is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopPolling();
  } else {
    startPolling(5000);
  }
});
```

---

## Common Patterns

### Pattern 1: Simple Fetch

```javascript
const data = Reactive.async();

await data.$execute(async () => {
  const response = await fetch('/api/data');
  return response.json();
});
```

### Pattern 2: Fetch with Error Handling

```javascript
const data = Reactive.async();

try {
  await data.$execute(async () => {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  });
} catch (error) {
  console.error('Failed:', error);
}
```

### Pattern 3: POST Request

```javascript
const result = Reactive.async();

await result.$execute(async () => {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  return response.json();
});
```

### Pattern 4: Conditional Execution

```javascript
async function loadUserData(userId) {
  if (!userId) {
    userData.$reset();
    return;
  }
  
  await userData.$execute(async () => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  });
}
```

### Pattern 5: Sequential Operations

```javascript
await asyncState.$execute(async () => {
  const step1 = await doStep1();
  const step2 = await doStep2(step1);
  const step3 = await doStep3(step2);
  return step3;
});
```

---

## Common Questions

### Q: Can I call `$execute()` multiple times?

**Answer:** Yes! Each call will reset loading/error and execute:

```javascript
const data = Reactive.async();

// First execution
await data.$execute(async () => {
  return fetchData(1);
});

// Second execution (overwrites previous data)
await data.$execute(async () => {
  return fetchData(2);
});
```

### Q: What if `$execute()` is called while already loading?

**Answer:** The new execution starts immediately, replacing the previous operation:

```javascript
const data = Reactive.async();

// Start first request
data.$execute(async () => {
  await delay(5000);
  return 'First';
});

// Start second request immediately (first is abandoned)
data.$execute(async () => {
  await delay(1000);
  return 'Second';
});

// Result will be 'Second'
```

### Q: Does `$execute()` return the result?

**Answer:** Yes! It returns a promise that resolves with the result:

```javascript
const userData = Reactive.async();

const result = await userData.$execute(async () => {
  const response = await fetch('/api/user');
  return response.json();
});

console.log(result); // The user data
console.log(userData.data); // Same data
```

### Q: Can I use `$execute()` without `await`?

**Answer:** Yes, but you won't know when it completes:

```javascript
// Fire and forget
asyncState.$execute(async () => {
  return fetchData();
});

// Better: await it
await asyncState.$execute(async () => {
  return fetchData();
});
```

### Q: How do I cancel an ongoing `$execute()`?

**Answer:** There's no built-in cancel, but you can use AbortController:

```javascript
const data = Reactive.async();
let abortController;

async function load() {
  // Cancel previous request
  if (abortController) {
    abortController.abort();
  }
  
  abortController = new AbortController();
  
  try {
    await data.$execute(async () => {
      const response = await fetch('/api/data', {
        signal: abortController.signal
      });
      return response.json();
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request cancelled');
    } else {
      throw error;
    }
  }
}
```

---

## Tips for Beginners

### 1. Always Use with Async State

```javascript
// ✅ Correct - async state has $execute
const data = Reactive.async();
data.$execute(async () => { /*...*/ });

// ❌ Wrong - regular state doesn't have $execute
const state = Reactive.state({});
// state.$execute() doesn't exist!
```

### 2. Return the Data You Want to Store

```javascript
// ✅ Return the data
await asyncState.$execute(async () => {
  const response = await fetch('/api/data');
  return response.json(); // This goes into asyncState.data
});

// ❌ Don't forget to return
await asyncState.$execute(async () => {
  const response = await fetch('/api/data');
  response.json(); // asyncState.data will be undefined!
});
```

### 3. Handle Errors Appropriately

```javascript
// ✅ Throw errors in the function
await asyncState.$execute(async () => {
  const response = await fetch('/api/data');
  
  if (!response.ok) {
    throw new Error('Request failed'); // Caught automatically
  }
  
  return response.json();
});

// The error is in asyncState.error
console.log(asyncState.error);
```

### 4. Use `isSuccess` and `isError` Computed Properties

```javascript
// ✅ Use computed properties
Reactive.effect(() => {
  if (asyncState.isSuccess) {
    console.log('Data loaded!', asyncState.data);
  }
  
  if (asyncState.isError) {
    console.log('Error occurred!', asyncState.error);
  }
});
```

### 5. Display Loading States in UI

```javascript
// ✅ Always show loading feedback
Reactive.effect(() => {
  if (asyncState.loading) {
    showLoadingSpinner();
  } else {
    hideLoadingSpinner();
  }
});
```

---

## Summary

### What `$execute()` Does:

1. ✅ Executes an async function
2. ✅ Sets `loading` to true before execution
3. ✅ Sets `error` to null (clears previous errors)
4. ✅ On success: stores result in `data`
5. ✅ On error: stores error in `error`
6. ✅ Always sets `loading` to false when done
7. ✅ Returns a promise with the result

### The Basic Pattern:

```javascript
// Create async state
const asyncState = Reactive.async(initialValue);

// Execute async operation
await asyncState.$execute(async () => {
  // Your async code here
  const data = await someAsyncOperation();
  return data; // This goes into asyncState.data
});

// Use the result
if (asyncState.isSuccess) {
  console.log(asyncState.data);
}

if (asyncState.isError) {
  console.error(asyncState.error);
}
```

### Key Points:

- **Only for** async state objects (`Reactive.async()`)
- **Automatic** loading/error/data management
- **Returns** a promise
- **Throws** errors (can be caught with try/catch)
- **Overwrites** previous data on each execution

---

**Remember:** `$execute()` is your friend for async operations! It handles all the tedious state management automatically, letting you focus on the actual async logic. Create an async state, pass your async function to `$execute()`, and let it handle the rest! 🎉