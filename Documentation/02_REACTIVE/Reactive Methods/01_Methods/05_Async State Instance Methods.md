# Async State Instance Methods - Complete Guide

## Overview

Async state provides a specialized reactive manager for handling asynchronous operations like API calls, file uploads, and database queries. Created with `ReactiveUtils.async()`, it automatically manages loading states, error handling, and data storage, eliminating boilerplate code for async operations.

---

## Table of Contents

1. [$execute(fn)](#executefn) - Execute async function with state management
2. [$reset()](#reset) - Reset to initial state
3. [data Property](#data-property) - Access result data
4. [loading Property](#loading-property) - Check loading status
5. [error Property](#error-property) - Access error information
6. [isSuccess Computed Property](#issuccess-computed-property) - Check success state
7. [isError Computed Property](#iserror-computed-property) - Check error state
8. [Complete Example - Data Dashboard](#complete-example---data-dashboard) - Full implementation
9. [Best Practices Summary](#best-practices-summary) - Usage guidelines
10. [API Quick Reference](#api-quick-reference) - Quick lookup

---

## `$execute(fn)`

Execute an async function and automatically manage loading, data, and error states.

### Syntax
```javascript
await asyncState.$execute(asyncFunction)
```

### Parameters
- **`fn`** (Function) - Async function that returns data

### Returns
- `Promise` - Resolves with the returned data or rejects with error

### Example - Basic API Call
```javascript
const userData = ReactiveUtils.async(null);

async function fetchUser(userId) {
  await userData.$execute(async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  });
}

// Usage
fetchUser(123);

console.log(userData.loading); // true during fetch
console.log(userData.data);    // User object when complete
console.log(userData.error);   // Error object if failed
```

### Example - With Loading Indicator
```javascript
const posts = ReactiveUtils.async([]);

// Bind loading state
posts.$bind({
  '#loading-spinner': {
    style: () => ({ display: posts.loading ? 'block' : 'none' })
  },
  '#posts-container': {
    style: () => ({ opacity: posts.loading ? 0.5 : 1 })
  }
});

async function loadPosts() {
  await posts.$execute(async () => {
    const response = await fetch('/api/posts');
    return response.json();
  });
}

loadPosts();
```

### Advanced Example - Error Handling
```javascript
const apiData = ReactiveUtils.async(null);

async function fetchData(endpoint) {
  try {
    const result = await apiData.$execute(async () => {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }
      
      return response.json();
    });
    
    console.log('Success:', result);
    return result;
    
  } catch (error) {
    console.error('Failed:', error);
    // Error is already stored in apiData.error
    
    // Show user-friendly message
    alert(`Failed to load data: ${error.message}`);
  }
}

// Bind error display
apiData.$bind({
  '#error-message': {
    textContent: () => apiData.error?.message || '',
    style: () => ({ display: apiData.isError ? 'block' : 'none' })
  }
});
```

### Example - Sequential Operations
```javascript
const userProfile = ReactiveUtils.async(null);

async function loadUserProfile(userId) {
  await userProfile.$execute(async () => {
    // Step 1: Fetch user
    const userResponse = await fetch(`/api/users/${userId}`);
    const user = await userResponse.json();
    
    // Step 2: Fetch user's posts
    const postsResponse = await fetch(`/api/users/${userId}/posts`);
    const posts = await postsResponse.json();
    
    // Step 3: Fetch user's followers
    const followersResponse = await fetch(`/api/users/${userId}/followers`);
    const followers = await followersResponse.json();
    
    // Return combined data
    return {
      ...user,
      posts,
      followers
    };
  });
}
```

### Example - With Timeout
```javascript
const apiCall = ReactiveUtils.async(null);

async function fetchWithTimeout(url, timeoutMs = 5000) {
  await apiCall.$execute(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Request failed');
      return response.json();
      
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  });
}
```

### Example - Parallel Requests
```javascript
const dashboardData = ReactiveUtils.async(null);

async function loadDashboard() {
  await dashboardData.$execute(async () => {
    // Execute multiple requests in parallel
    const [users, posts, stats] = await Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/stats').then(r => r.json())
    ]);
    
    return { users, posts, stats };
  });
}

// Bind to display
dashboardData.$bind({
  '#user-count': () => dashboardData.data?.users.length || 0,
  '#post-count': () => dashboardData.data?.posts.length || 0,
  '#total-views': () => dashboardData.data?.stats.views || 0
});
```

### Example - Retry Logic
```javascript
const resilientApi = ReactiveUtils.async(null);

async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await resilientApi.$execute(async () => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      });
      
      // Success - exit retry loop
      return resilientApi.data;
      
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
```

### Example - Pagination
```javascript
const paginatedData = ReactiveUtils.async({
  items: [],
  page: 1,
  totalPages: 1,
  hasMore: false
});

async function loadPage(page) {
  await paginatedData.$execute(async () => {
    const response = await fetch(`/api/items?page=${page}`);
    const data = await response.json();
    
    return {
      items: data.items,
      page: data.page,
      totalPages: data.totalPages,
      hasMore: data.page < data.totalPages
    };
  });
}

async function loadNextPage() {
  if (paginatedData.data?.hasMore && !paginatedData.loading) {
    await loadPage(paginatedData.data.page + 1);
  }
}

// Bind pagination controls
paginatedData.$bind({
  '#next-btn': {
    disabled: () => !paginatedData.data?.hasMore || paginatedData.loading
  },
  '#page-info': () => {
    const data = paginatedData.data;
    return data ? `Page ${data.page} of ${data.totalPages}` : '';
  }
});
```

### Example - Form Submission
```javascript
const formSubmission = ReactiveUtils.async(null);
const form = ReactiveUtils.form({
  name: '',
  email: '',
  message: ''
});

async function handleSubmit(e) {
  e.preventDefault();
  
  if (!form.isValid) {
    alert('Please fix form errors');
    return;
  }
  
  try {
    await formSubmission.$execute(async () => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.values)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      return response.json();
    });
    
    // Success
    alert('Message sent successfully!');
    form.$reset();
    
  } catch (error) {
    alert('Failed to send message: ' + error.message);
  }
}

// Bind submission state
formSubmission.$bind({
  '#submit-btn': {
    disabled: () => formSubmission.loading,
    textContent: () => formSubmission.loading ? 'Sending...' : 'Send Message'
  }
});
```

### Example - File Upload
```javascript
const fileUpload = ReactiveUtils.async(null);

async function uploadFile(file) {
  await fileUpload.$execute(async () => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Upload failed');
    
    return response.json();
  });
}

// Bind upload progress
fileUpload.$bind({
  '#upload-status': function() {
    if (this.loading) return 'Uploading...';
    if (this.isSuccess) return `✓ Uploaded: ${this.data.filename}`;
    if (this.isError) return `✗ Error: ${this.error.message}`;
    return 'Ready to upload';
  },
  '#upload-btn': {
    disabled: () => fileUpload.loading
  }
});

// Handle file input
document.getElementById('file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) uploadFile(file);
});
```

### Example - WebSocket Integration
```javascript
const liveData = ReactiveUtils.async([]);

let ws;

async function connectWebSocket() {
  await liveData.$execute(async () => {
    return new Promise((resolve, reject) => {
      ws = new WebSocket('ws://localhost:3000');
      
      ws.onopen = () => {
        console.log('Connected');
        resolve([]);
      };
      
      ws.onerror = (error) => {
        reject(new Error('WebSocket connection failed'));
      };
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        liveData.data = [...liveData.data, message];
      };
    });
  });
}

function disconnectWebSocket() {
  if (ws) {
    ws.close();
    liveData.$reset();
  }
}
```

### Use Cases
- API requests (GET, POST, PUT, DELETE)
- File uploads/downloads
- Database queries
- Authentication flows
- Real-time data fetching
- Background processing
- External service calls

### Important Notes
- Automatically sets `loading = true` at start
- Sets `loading = false` when complete
- Sets `error = null` at start (clears previous errors)
- On success: sets `data` to returned value
- On failure: sets `error` to caught error, throws error
- Returns a Promise that resolves/rejects

---

## `$reset()`

Reset async state to initial values, clearing data, loading state, and errors.

### Syntax
```javascript
asyncState.$reset()
```

### Parameters
- None

### Returns
- `undefined`

### Example - Basic Reset
```javascript
const userData = ReactiveUtils.async(null);

// Fetch data
await userData.$execute(async () => {
  const response = await fetch('/api/user');
  return response.json();
});

console.log(userData.data); // User object
console.log(userData.loading); // false
console.log(userData.isSuccess); // true

// Reset
userData.$reset();

console.log(userData.data); // null (initial value)
console.log(userData.loading); // false
console.log(userData.error); // null
```

### Example - Logout/Clear Data
```javascript
const currentUser = ReactiveUtils.async(null);

async function login(credentials) {
  await currentUser.$execute(async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    return response.json();
  });
}

function logout() {
  // Clear user data
  currentUser.$reset();
  
  // Clear tokens
  localStorage.removeItem('token');
  
  // Redirect
  window.location.href = '/login';
}

// Bind display
currentUser.$bind({
  '#user-name': () => currentUser.data?.name || 'Guest',
  '#logout-btn': {
    style: () => ({ display: currentUser.data ? 'block' : 'none' })
  }
});
```

### Example - Search Clear
```javascript
const searchResults = ReactiveUtils.async([]);
const searchQuery = ReactiveUtils.ref('');

async function search(query) {
  if (!query.trim()) {
    searchResults.$reset();
    return;
  }
  
  await searchResults.$execute(async () => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    return response.json();
  });
}

function clearSearch() {
  searchQuery.value = '';
  searchResults.$reset();
}

// Bind to UI
searchResults.$bind({
  '#search-results': function() {
    if (this.loading) return '<p>Searching...</p>';
    if (this.isError) return `<p>Error: ${this.error.message}</p>`;
    if (this.isSuccess && this.data.length === 0) return '<p>No results found</p>';
    if (this.isSuccess) {
      return this.data.map(item => `<li>${item.title}</li>`).join('');
    }
    return '<p>Enter a search query</p>';
  },
  '#clear-btn': {
    style: () => ({ 
      display: searchResults.data?.length > 0 ? 'inline-block' : 'none' 
    })
  }
});
```

### Example - Error Recovery
```javascript
const apiData = ReactiveUtils.async(null);

async function fetchData() {
  try {
    await apiData.$execute(async () => {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Request failed');
      return response.json();
    });
  } catch (error) {
    // Error is stored in apiData.error
    console.error('Fetch failed:', error);
  }
}

function retry() {
  apiData.$reset(); // Clear error state
  fetchData(); // Try again
}

// Bind error UI
apiData.$bind({
  '#error-panel': {
    style: () => ({ display: apiData.isError ? 'block' : 'none' })
  },
  '#error-message': () => apiData.error?.message || '',
  '#retry-btn': {
    onclick: retry
  }
});
```

### Example - Component Unmount
```javascript
const componentData = ReactiveUtils.async(null);

async function loadComponentData() {
  await componentData.$execute(async () => {
    const response = await fetch('/api/component-data');
    return response.json();
  });
}

function createComponent() {
  loadComponentData();
  
  return {
    data: componentData,
    destroy() {
      // Clean up when component destroyed
      componentData.$reset();
    }
  };
}
```

### Example - Conditional Reset
```javascript
const cache = ReactiveUtils.async(null);
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getData(forceRefresh = false) {
  const now = Date.now();
  const cacheExpired = !cacheTimestamp || (now - cacheTimestamp > CACHE_DURATION);
  
  if (forceRefresh || cacheExpired) {
    cache.$reset(); // Clear old cache
    
    await cache.$execute(async () => {
      const response = await fetch('/api/data');
      return response.json();
    });
    
    cacheTimestamp = now;
  }
  
  return cache.data;
}

function clearCache() {
  cache.$reset();
  cacheTimestamp = null;
}
```

### Example - Multi-Stage Process
```javascript
const wizard = ReactiveUtils.async({
  step: 1,
  results: null
});

async function processStep1() {
  await wizard.$execute(async () => {
    const response = await fetch('/api/step1');
    const result = await response.json();
    return { step: 2, results: result };
  });
}

async function processStep2() {
  await wizard.$execute(async () => {
    const response = await fetch('/api/step2');
    const result = await response.json();
    return { step: 3, results: result };
  });
}

function cancelWizard() {
  wizard.$reset();
  // Returns to: { step: 1, results: null }
}
```

### Use Cases
- Logout/clear user data
- Clear search results
- Reset form after submission
- Error recovery (retry)
- Component cleanup
- Cache invalidation
- Cancel operations

### Important Notes
- Resets `data` to initial value passed to `async()`
- Sets `loading = false`
- Sets `error = null`
- Does **not** cancel in-flight requests
- Triggers reactivity (bindings update)

---

## `data` Property

Contains the result data from successful async operations.

### Syntax
```javascript
const result = asyncState.data
```

### Type
- `any` - Initially set to value from `async(initialValue)`, updated by `$execute()`

### Example - Basic Usage
```javascript
const user = ReactiveUtils.async(null);

await user.$execute(async () => {
  const response = await fetch('/api/user/123');
  return response.json();
});

console.log(user.data);
// { id: 123, name: 'John Doe', email: 'john@example.com' }

// Access nested properties
console.log(user.data.name); // "John Doe"
console.log(user.data.email); // "john@example.com"
```

### Example - Array Data
```javascript
const posts = ReactiveUtils.async([]);

await posts.$execute(async () => {
  const response = await fetch('/api/posts');
  return response.json();
});

// Array operations
console.log(posts.data.length); // Number of posts
console.log(posts.data[0]); // First post

posts.data.forEach(post => {
  console.log(post.title);
});

const titles = posts.data.map(post => post.title);
```

### Example - Binding to DOM
```javascript
const products = ReactiveUtils.async([]);

products.$bind({
  '#product-list': function() {
    if (!this.data || this.data.length === 0) {
      return '<p>No products available</p>';
    }
    
    return this.data.map(product => `
      <div class="product">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `).join('');
  },
  '#product-count': () => products.data?.length || 0
});

await products.$execute(async () => {
  const response = await fetch('/api/products');
  return response.json();
});
```

### Example - Computed from Data
```javascript
const analytics = ReactiveUtils.async({
  pageViews: 0,
  uniqueVisitors: 0,
  bounceRate: 0
});

analytics.$computed('engagementScore', function() {
  if (!this.data) return 0;
  
  const { pageViews, uniqueVisitors, bounceRate } = this.data;
  return ((pageViews / uniqueVisitors) * (1 - bounceRate)) * 100;
});

await analytics.$execute(async () => {
  const response = await fetch('/api/analytics');
  return response.json();
});

console.log(analytics.engagementScore); // Calculated score
```

### Example - Conditional Rendering
```javascript
const userData = ReactiveUtils.async(null);

userData.$bind({
  '#user-profile': function() {
    if (this.loading) {
      return '<div class="spinner">Loading...</div>';
    }
    
    if (this.isError) {
      return `<div class="error">${this.error.message}</div>`;
    }
    
    if (!this.data) {
      return '<div>No user data</div>';
    }
    
    return `
      <div class="profile">
        <img src="${this.data.avatar}" alt="Avatar">
        <h2>${this.data.name}</h2>
        <p>${this.data.email}</p>
        <p>Member since: ${new Date(this.data.joinedAt).toLocaleDateString()}</p>
      </div>
    `;
  }
});
```

### Example - Data Transformation
```javascript
const apiResponse = ReactiveUtils.async(null);

apiResponse.$computed('processedData', function() {
  if (!this.data) return null;
  
  // Transform raw API data
  return {
    ...this.data,
    fullName: `${this.data.firstName} ${this.data.lastName}`,
    displayDate: new Date(this.data.createdAt).toLocaleDateString(),
    isActive: this.data.status === 'active',
    tags: this.data.tags.map(t => t.toLowerCase())
  };
});

await apiResponse.$execute(async () => {
  const response = await fetch('/api/user');
  return response.json();
});

console.log(apiResponse.processedData);
```

### Example - Direct Modification
```javascript
const list = ReactiveUtils.async([]);

await list.$execute(async () => {
  const response = await fetch('/api/items');
  return response.json();
});

// You CAN modify data directly (it's reactive)
list.data.push({ id: 999, name: 'New Item' });

// Or replace entirely
list.data = [...list.data, { id: 1000, name: 'Another Item' }];

// Note: This doesn't set loading/error states
// Use $execute() for operations that should show loading
```

### Use Cases
- Displaying fetched content
- Processing API responses
- Conditional rendering
- Data transformation
- Computed calculations
- List rendering

### Important Notes
- Initially set to value from `async(initialValue)`
- Updated when `$execute()` succeeds
- Can be `null`, array, object, or any type
- Can be modified directly (reactive)
- Check `isSuccess` before assuming data exists

---

## `loading` Property

Boolean flag indicating whether an async operation is currently in progress.

### Syntax
```javascript
if (asyncState.loading) {
  // Operation in progress
}
```

### Type
- `Boolean` - `true` during async operation, `false` otherwise

### Example - Basic Usage
```javascript
const data = ReactiveUtils.async(null);

console.log(data.loading); // false

const promise = data.$execute(async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { result: 'done' };
});

console.log(data.loading); // true

await promise;

console.log(data.loading); // false
```

### Example - Loading Spinner
```javascript
const posts = ReactiveUtils.async([]);

posts.$bind({
  '#loading-spinner': {
    style: () => ({ display: posts.loading ? 'flex' : 'none' })
  },
  '#content': {
    style: () => ({ opacity: posts.loading ? 0.5 : 1 })
  }
});

async function loadPosts() {
  await posts.$execute(async () => {
    const response = await fetch('/api/posts');
    return response.json();
  });
}
```

### Example - Disable Buttons
```javascript
const apiCall = ReactiveUtils.async(null);

apiCall.$bind({
  '#submit-btn': {
    disabled: () => apiCall.loading,
    textContent: () => apiCall.loading ? 'Processing...' : 'Submit'
  },
  '#cancel-btn': {
    disabled: () => apiCall.loading
  }
});

async function handleSubmit() {
  await apiCall.$execute(async () => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({ data: 'example' })
    });
    return response.json();
  });
}
```

### Example - Multiple Loading States
```javascript
const userData = ReactiveUtils.async(null);
const userPosts = ReactiveUtils.async([]);
const userFollowers = ReactiveUtils.async([]);

const ui = ReactiveUtils.state({});

ui.$computed('isLoading', function() {
  return userData.loading || userPosts.loading || userFollowers.loading;
});

ui.$computed('loadingMessage', function() {
  if (userData.loading) return 'Loading user...';
  if (userPosts.loading) return 'Loading posts...';
  if (userFollowers.loading) return 'Loading followers...';
  return '';
});

ui.$bind({
  '#global-spinner': {
    style: () => ({ display: ui.isLoading ? 'block' : 'none' })
  },
  '#loading-text': () => ui.loadingMessage
});

async function loadUserProfile(userId) {
  await userData.$execute(async () => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  });
  
  await Promise.all([
    userPosts.$execute(async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      return response.json();
    }),
    userFollowers.$execute(async () => {
      const response = await fetch(`/api/users/${userId}/followers`);
      return response.json();
    })
  ]);
}
```

### Example - Loading Progress
```javascript
const dataLoader = ReactiveUtils.async(null);
const progress = ReactiveUtils.ref(0);

async function loadWithProgress() {
  progress.value = 0;
  
  await dataLoader.$execute(async () => {
    // Simulate progress updates
    for (let i = 1; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      progress.value = i * 10;
    }
    
    const response = await fetch('/api/data');
    return response.json();
  });
}

dataLoader.$bind({
  '#progress-bar': {
    style: () => ({
      width: `${progress.value}%`,
      display: dataLoader.loading ? 'block' : 'none'
    })
  }
});
```

### Example - Skeleton Loading
```javascript
const articles = ReactiveUtils.async([]);

articles.$bind({
  '#articles-container': function() {
    if (this.loading) {
      // Show skeleton loaders
      return `
        <div class="skeleton-loader"></div>
        <div class="skeleton-loader"></div>
        <div class="skeleton-loader"></div>
      `;
    }
    
    if (this.isSuccess) {
      return this.data.map(article => `
        <article>
          <h2>${article.title}</h2>
          <p>${article.excerpt}</p>
        </article>
      `).join('');
    }
    
    return '';
  }
});
```

### Example - Prevent Concurrent Requests
```javascript
const search = ReactiveUtils.async([]);

async function performSearch(query) {
  // Prevent new search while one is loading
  if (search.loading) {
    console.log('Search already in progress');
    return;
  }
  
  await search.$execute(async () => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
  });
}
```

### Use Cases
- Show/hide loading spinners
- Disable buttons during operations
- Display skeleton loaders
- Prevent duplicate requests
- Show loading progress
- Conditional UI rendering

### Important Notes
- Automatically set by `$execute()`
- `true` at start of execution
- `false` when complete (success or error)
- Not affected by `$reset()` if operation in progress
- Read-only (managed internally)

---

## `error` Property

Contains error object if the async operation failed.

### Syntax
```javascript
if (asyncState.error) {
  console.error(asyncState.error.message);
}
```

### Type
- `Error|null` - Error object if failed, `null` otherwise

### Example - Basic Error Handling
```javascript
const data = ReactiveUtils.async(null);

await data.$execute(async () => {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
});

if (data.error) {
  console.error('Failed to load:', data.error.message);
}
```

### Example - Display Error Messages
```javascript
const userData = ReactiveUtils.async(null);

userData.$bind({
  '#error-banner': {
    textContent: () => userData.error?.message || '',
    style: () => ({
      display: userData.isError ? 'block' : 'none',
      backgroundColor: '#fee',
      color: '#c00',
      padding: '10px',
      marginBottom: '10px'
    })
  },
  '#retry-btn': {
    style: () => ({ display: userData.isError ? 'inline-block' : 'none' })
  }
});

async function loadUser() {
  try {
    await userData.$execute(async () => {
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('Failed to load user');
      return response.json();
    });
  } catch (error) {
    // Error is already in userData.error
    console.error('Load failed:', error);
  }
}
```

### Example - Error Types
```javascript
const apiCall = ReactiveUtils.async(null);

async function makeRequest() {
  try {
    await apiCall.$execute(async () => {
      const response = await fetch('/api/endpoint');
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please log in');
        } else if (response.status === 404) {
          throw new Error('Resource not found');
        } else if (response.status >= 500) {
          throw new Error('Server error - Please try again later');
        } else {
          throw new Error('Request failed');
        }
      }
      
      return response.json();
    });
  } catch (error) {
    // Handle different error types
    if (error.message.includes('Unauthorized')) {
      window.location.href = '/login';
    }
  }
}

apiCall.$bind({
  '#error-message': function() {
    if (!this.error) return '';
    
    // Custom error display based on message
    if (this.error.message.includes('Server error')) {
      return '⚠️ ' + this.error.message;
    }
    return '❌ ' + this.error.message;
  }
});
```

### Example - Error Logging
```javascript
const apiData = ReactiveUtils.async(null);

// Watch for errors
apiData.$watch('error', (newError, oldError) => {
  if (newError) {
    // Log to analytics/monitoring service
    logError({
      message: newError.message,
      stack: newError.stack,
      timestamp: new Date().toISOString(),
      context: 'API Data Fetch'
    });

    ```javascript
    // Show user notification
    showNotification('error', newError.message);
  }
});

async function fetchData() {
  try {
    await apiData.$execute(async () => {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Fetch failed');
      return response.json();
    });
  } catch (error) {
    // Error automatically logged by watcher
  }
}
```

### Example - Retry on Error
```javascript
const resilientApi = ReactiveUtils.async(null);

async function loadWithRetry(maxAttempts = 3) {
  let attempt = 0;
  
  while (attempt < maxAttempts) {
    attempt++;
    
    try {
      await resilientApi.$execute(async () => {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Request failed');
        return response.json();
      });
      
      // Success - exit loop
      break;
      
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxAttempts) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        // Final attempt failed
        console.error('All attempts failed');
      }
    }
  }
}

resilientApi.$bind({
  '#error-display': function() {
    if (!this.error) return '';
    return `
      <div class="error">
        <p>${this.error.message}</p>
        <button onclick="loadWithRetry()">Retry</button>
      </div>
    `;
  }
});
```

### Example - Error Recovery
```javascript
const dataState = ReactiveUtils.async(null);

async function loadData() {
  try {
    await dataState.$execute(async () => {
      const response = await fetch('/api/primary');
      if (!response.ok) throw new Error('Primary source failed');
      return response.json();
    });
  } catch (primaryError) {
    console.warn('Primary source failed, trying fallback...');
    
    try {
      await dataState.$execute(async () => {
        const response = await fetch('/api/fallback');
        if (!response.ok) throw new Error('Fallback source failed');
        return response.json();
      });
    } catch (fallbackError) {
      console.error('All sources failed');
    }
  }
}
```

### Example - Error Context
```javascript
const formSubmission = ReactiveUtils.async(null);

async function submitForm(formData) {
  try {
    await formSubmission.$execute(async () => {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Create error with additional context
        const error = new Error(errorData.message || 'Submission failed');
        error.statusCode = response.status;
        error.fieldErrors = errorData.errors;
        
        throw error;
      }
      
      return response.json();
    });
  } catch (error) {
    // Access error context
    console.error('Status:', error.statusCode);
    console.error('Field errors:', error.fieldErrors);
    
    // Display field-specific errors
    if (error.fieldErrors) {
      Object.entries(error.fieldErrors).forEach(([field, message]) => {
        document.getElementById(`${field}-error`).textContent = message;
      });
    }
  }
}

formSubmission.$bind({
  '#general-error': () => {
    if (!formSubmission.error) return '';
    return formSubmission.error.message;
  }
});
```

### Example - Network Error Detection
```javascript
const apiCall = ReactiveUtils.async(null);

async function makeNetworkRequest() {
  try {
    await apiCall.$execute(async () => {
      const response = await fetch('/api/endpoint');
      return response.json();
    });
  } catch (error) {
    // Check error type
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error - check your connection');
      apiCall.error = new Error('Network connection failed. Please check your internet connection.');
    }
  }
}

apiCall.$bind({
  '#error-type': function() {
    if (!this.error) return '';
    
    if (this.error.message.includes('Network connection')) {
      return `
        <div class="network-error">
          <span class="icon">📡</span>
          <p>${this.error.message}</p>
          <button onclick="makeNetworkRequest()">Retry</button>
        </div>
      `;
    }
    
    return `<div class="error">${this.error.message}</div>`;
  }
});
```

### Use Cases
- Display error messages
- Error logging and monitoring
- Retry logic
- Fallback mechanisms
- User feedback
- Debugging
- Error recovery

### Important Notes
- Set when `$execute()` throws
- Automatically cleared when `$execute()` starts
- Cleared by `$reset()`
- Can be `null` (no error) or Error object
- Accessible after try/catch
- Check with `isError` computed property

---

## `isSuccess` Computed Property

Returns `true` when data has loaded successfully (not loading, no error, has data).

### Syntax
```javascript
if (asyncState.isSuccess) {
  // Data loaded successfully
}
```

### Type
- `Boolean` (computed) - Success state

### Example - Basic Usage
```javascript
const data = ReactiveUtils.async(null);

console.log(data.isSuccess); // false (no data yet)

await data.$execute(async () => {
  const response = await fetch('/api/data');
  return response.json();
});

console.log(data.isSuccess); // true
console.log(data.loading); // false
console.log(data.error); // null
console.log(data.data); // Response data
```

### Example - Conditional Display
```javascript
const products = ReactiveUtils.async([]);

products.$bind({
  '#content': function() {
    if (this.loading) {
      return '<div class="spinner">Loading products...</div>';
    }
    
    if (this.isError) {
      return `<div class="error">${this.error.message}</div>`;
    }
    
    if (this.isSuccess) {
      if (this.data.length === 0) {
        return '<p>No products found</p>';
      }
      
      return this.data.map(product => `
        <div class="product">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
        </div>
      `).join('');
    }
    
    return '<p>Click "Load" to fetch products</p>';
  }
});

async function loadProducts() {
  await products.$execute(async () => {
    const response = await fetch('/api/products');
    return response.json();
  });
}
```

### Example - Success Notification
```javascript
const formSubmit = ReactiveUtils.async(null);

formSubmit.$watch('isSuccess', (isSuccess) => {
  if (isSuccess) {
    showNotification('success', 'Form submitted successfully!');
    
    // Redirect after delay
    setTimeout(() => {
      window.location.href = '/success';
    }, 2000);
  }
});

async function handleSubmit(formData) {
  await formSubmit.$execute(async () => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    return response.json();
  });
}
```

### Example - Enable Actions on Success
```javascript
const userData = ReactiveUtils.async(null);

userData.$bind({
  '#edit-btn': {
    disabled: () => !userData.isSuccess,
    style: () => ({ 
      display: userData.isSuccess ? 'inline-block' : 'none' 
    })
  },
  '#delete-btn': {
    disabled: () => !userData.isSuccess,
    style: () => ({ 
      display: userData.isSuccess ? 'inline-block' : 'none' 
    })
  },
  '#success-icon': {
    style: () => ({ 
      display: userData.isSuccess ? 'inline' : 'none' 
    })
  }
});

async function loadUser(id) {
  await userData.$execute(async () => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  });
}
```

### Example - Multi-State UI
```javascript
const pageData = ReactiveUtils.async(null);

pageData.$computed('uiState', function() {
  if (this.loading) return 'loading';
  if (this.isError) return 'error';
  if (this.isSuccess) return 'success';
  return 'idle';
});

pageData.$bind({
  '#page-container': {
    className: () => `page-state-${pageData.uiState}`,
    innerHTML: function() {
      switch (pageData.uiState) {
        case 'loading':
          return '<div class="loading">Loading...</div>';
        case 'error':
          return `<div class="error">${pageData.error.message}</div>`;
        case 'success':
          return `<div class="content">${renderContent(pageData.data)}</div>`;
        default:
          return '<div class="idle">Ready to load</div>';
      }
    }
  }
});
```

### Example - Success Animation
```javascript
const saveOperation = ReactiveUtils.async(null);

saveOperation.$watch('isSuccess', (isSuccess) => {
  if (isSuccess) {
    // Trigger success animation
    const successElement = document.getElementById('success-checkmark');
    successElement.classList.add('animate-check');
    
    setTimeout(() => {
      successElement.classList.remove('animate-check');
    }, 1000);
  }
});

async function saveData(data) {
  await saveOperation.$execute(async () => {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  });
}
```

### Example - Dependent Operations
```javascript
const step1 = ReactiveUtils.async(null);
const step2 = ReactiveUtils.async(null);
const step3 = ReactiveUtils.async(null);

async function runWorkflow() {
  // Step 1
  await step1.$execute(async () => {
    const response = await fetch('/api/step1');
    return response.json();
  });
  
  if (!step1.isSuccess) {
    console.error('Step 1 failed');
    return;
  }
  
  // Step 2 (depends on step 1)
  await step2.$execute(async () => {
    const response = await fetch('/api/step2', {
      method: 'POST',
      body: JSON.stringify(step1.data)
    });
    return response.json();
  });
  
  if (!step2.isSuccess) {
    console.error('Step 2 failed');
    return;
  }
  
  // Step 3 (depends on step 2)
  await step3.$execute(async () => {
    const response = await fetch('/api/step3', {
      method: 'POST',
      body: JSON.stringify(step2.data)
    });
    return response.json();
  });
  
  if (step3.isSuccess) {
    console.log('Workflow completed successfully!');
  }
}

// Bind progress
Elements.bind({
  'step1-status': () => step1.isSuccess ? '✓' : '○',
  'step2-status': () => step2.isSuccess ? '✓' : '○',
  'step3-status': () => step3.isSuccess ? '✓' : '○'
});
```

### Use Cases
- Conditional rendering
- Success notifications
- Enable/disable actions
- Progress indicators
- Workflow management
- UI state management

### Important Notes
- Computed automatically
- `true` when: `!loading && !error && data !== null`
- Read-only property
- Updates automatically
- Useful for conditional logic

---

## `isError` Computed Property

Returns `true` when an error has occurred (not loading, has error).

### Syntax
```javascript
if (asyncState.isError) {
  // Error occurred
}
```

### Type
- `Boolean` (computed) - Error state

### Example - Basic Usage
```javascript
const data = ReactiveUtils.async(null);

try {
  await data.$execute(async () => {
    throw new Error('Something went wrong');
  });
} catch (error) {
  console.log(data.isError); // true
  console.log(data.loading); // false
  console.log(data.error.message); // "Something went wrong"
}
```

### Example - Error Display
```javascript
const apiData = ReactiveUtils.async(null);

apiData.$bind({
  '#error-panel': {
    style: () => ({ 
      display: apiData.isError ? 'block' : 'none' 
    }),
    innerHTML: function() {
      if (!apiData.isError) return '';
      
      return `
        <div class="error-panel">
          <h3>Error</h3>
          <p>${apiData.error.message}</p>
          <button onclick="retryLoad()">Retry</button>
          <button onclick="apiData.$reset()">Dismiss</button>
        </div>
      `;
    }
  }
});

async function loadData() {
  try {
    await apiData.$execute(async () => {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to load data');
      return response.json();
    });
  } catch (error) {
    // Error state automatically set
  }
}

function retryLoad() {
  apiData.$reset();
  loadData();
}
```

### Example - Error Analytics
```javascript
const apiCall = ReactiveUtils.async(null);

apiCall.$watch('isError', (hasError) => {
  if (hasError) {
    // Log error to analytics
    analytics.track('API Error', {
      endpoint: '/api/endpoint',
      error: apiCall.error.message,
      timestamp: new Date().toISOString()
    });
    
    // Send to error monitoring service
    errorMonitoring.capture(apiCall.error);
  }
});
```

### Example - Fallback Content
```javascript
const content = ReactiveUtils.async(null);

content.$bind({
  '#main-content': function() {
    if (this.loading) {
      return '<div class="skeleton-loader"></div>';
    }
    
    if (this.isError) {
      return `
        <div class="fallback-content">
          <h2>Unable to Load Content</h2>
          <p>We're having trouble loading this page. Here's what you can do:</p>
          <ul>
            <li>Check your internet connection</li>
            <li><a href="#" onclick="location.reload()">Refresh the page</a></li>
            <li><a href="/">Go to homepage</a></li>
          </ul>
        </div>
      `;
    }
    
    if (this.isSuccess) {
      return `<div class="content">${this.data.html}</div>`;
    }
    
    return '';
  }
});
```

### Example - Error Badges
```javascript
const operations = {
  users: ReactiveUtils.async(null),
  posts: ReactiveUtils.async(null),
  comments: ReactiveUtils.async(null)
};

const dashboard = ReactiveUtils.state({});

dashboard.$computed('errorCount', function() {
  return Object.values(operations).filter(op => op.isError).length;
});

dashboard.$computed('hasErrors', function() {
  return this.errorCount > 0;
});

dashboard.$bind({
  '#error-badge': {
    textContent: () => dashboard.errorCount,
    style: () => ({
      display: dashboard.hasErrors ? 'inline-block' : 'none',
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '12px'
    })
  }
});

async function loadDashboard() {
  await Promise.all([
    operations.users.$execute(async () => {
      const r = await fetch('/api/users');
      return r.json();
    }),
    operations.posts.$execute(async () => {
      const r = await fetch('/api/posts');
      return r.json();
    }),
    operations.comments.$execute(async () => {
      const r = await fetch('/api/comments');
      return r.json();
    })
  ].map(p => p.catch(() => {}))); // Handle errors gracefully
}
```

### Example - Error Recovery UI
```javascript
const dataLoad = ReactiveUtils.async(null);

dataLoad.$bind({
  '#status-indicator': {
    className: function() {
      if (this.loading) return 'status loading';
      if (this.isError) return 'status error';
      if (this.isSuccess) return 'status success';
      return 'status idle';
    },
    textContent: function() {
      if (this.loading) return '⏳ Loading...';
      if (this.isError) return '❌ Error';
      if (this.isSuccess) return '✓ Loaded';
      return '○ Ready';
    }
  },
  '#recovery-actions': {
    style: () => ({ 
      display: dataLoad.isError ? 'block' : 'none' 
    }),
    innerHTML: function() {
      return `
        <button onclick="retryWithExponentialBackoff()">Retry</button>
        <button onclick="loadFromCache()">Use Cached Data</button>
        <button onclick="reportIssue()">Report Issue</button>
      `;
    }
  }
});
```

### Example - Error Type Handling
```javascript
const api = ReactiveUtils.async(null);

api.$computed('errorType', function() {
  if (!this.isError) return null;
  
  const message = this.error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch')) {
    return 'network';
  }
  if (message.includes('unauthorized') || message.includes('401')) {
    return 'auth';
  }
  if (message.includes('not found') || message.includes('404')) {
    return 'notfound';
  }
  if (message.includes('500') || message.includes('server')) {
    return 'server';
  }
  
  return 'unknown';
});

api.$bind({
  '#error-display': function() {
    if (!this.isError) return '';
    
    const errorMessages = {
      network: '📡 Network connection error. Please check your internet.',
      auth: '🔒 Authentication required. Please log in.',
      notfound: '🔍 Resource not found.',
      server: '⚙️ Server error. Please try again later.',
      unknown: '❌ An unexpected error occurred.'
    };
    
    const message = errorMessages[api.errorType] || errorMessages.unknown;
    
    return `
      <div class="error-${api.errorType}">
        <p>${message}</p>
        <p class="error-detail">${this.error.message}</p>
      </div>
    `;
  }
});
```

### Use Cases
- Error message display
- Error recovery UI
- Analytics and logging
- Conditional rendering
- Fallback content
- Error badges/indicators

### Important Notes
- Computed automatically
- `true` when: `!loading && error !== null`
- Read-only property
- Updates automatically
- Complements `isSuccess`

---

## Complete Example - Data Dashboard

```javascript
// Create async states for different data sources
const users = ReactiveUtils.async([]);
const analytics = ReactiveUtils.async(null);
const recentActivity = ReactiveUtils.async([]);

// Dashboard state
const dashboard = ReactiveUtils.state({
  lastRefresh: null,
  autoRefresh: false
});

// Computed properties
dashboard.$computed('isLoading', function() {
  return users.loading || analytics.loading || recentActivity.loading;
});

dashboard.$computed('hasErrors', function() {
  return users.isError || analytics.isError || recentActivity.isError;
});

dashboard.$computed('isReady', function() {
  return users.isSuccess && analytics.isSuccess && recentActivity.isSuccess;
});

// Load all dashboard data
async function loadDashboard() {
  dashboard.lastRefresh = new Date();
  
  await Promise.allSettled([
    users.$execute(async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to load users');
      return response.json();
    }),
    
    analytics.$execute(async () => {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to load analytics');
      return response.json();
    }),
    
    recentActivity.$execute(async () => {
      const response = await fetch('/api/activity');
      if (!response.ok) throw new Error('Failed to load activity');
      return response.json();
    })
  ]);
}

// Auto-refresh
let refreshInterval;

function startAutoRefresh() {
  dashboard.autoRefresh = true;
  refreshInterval = setInterval(loadDashboard, 60000); // Every minute
}

function stopAutoRefresh() {
  dashboard.autoRefresh = false;
  clearInterval(refreshInterval);
}

// Bind to UI
dashboard.$bind({
  '#refresh-btn': {
    disabled: () => dashboard.isLoading,
    textContent: () => dashboard.isLoading ? 'Refreshing...' : 'Refresh'
  },
  '#auto-refresh-toggle': {
    checked: () => dashboard.autoRefresh
  },
  '#last-refresh': () => {
    return dashboard.lastRefresh 
      ? `Last updated: ${dashboard.lastRefresh.toLocaleTimeString()}`
      : 'Never updated';
  },
  '#loading-overlay': {
    style: () => ({ display: dashboard.isLoading ? 'flex' : 'none' })
  }
});

// Users section
users.$bind({
  '#users-container': function() {
    if (this.loading) {
      return '<div class="skeleton-loader"></div>';
    }
    
    if (this.isError) {
      return `
        <div class="error">
          <p>${this.error.message}</p>
          <button onclick="users.$execute(fetchUsers)">Retry</button>
        </div>
      `;
    }
    
    if (this.isSuccess) {
      return `
        <div class="stats">
          <h3>Total Users: ${this.data.length}</h3>
          <p>Active: ${this.data.filter(u => u.active).length}</p>
        </div>
        <ul class="user-list">
          ${this.data.slice(0, 5).map(user => `
            <li>${user.name} (${user.email})</li>
          `).join('')}
        </ul>
      `;
    }
    
    return '<p>No data</p>';
  }
});

// Analytics section
analytics.$bind({
  '#analytics-container': function() {
    if (this.loading) {
      return '<div class="spinner">Loading analytics...</div>';
    }
    
    if (this.isError) {
      return `<div class="error">${this.error.message}</div>`;
    }
    
    if (this.isSuccess) {
      return `
        <div class="analytics-grid">
          <div class="metric">
            <h4>Page Views</h4>
            <p class="value">${this.data.pageViews.toLocaleString()}</p>
          </div>
          <div class="metric">
            <h4>Unique Visitors</h4>
            <p class="value">${this.data.uniqueVisitors.toLocaleString()}</p>
          </div>
          <div class="metric">
            <h4>Bounce Rate</h4>
            <p class="value">${(this.data.bounceRate * 100).toFixed(1)}%</p>
          </div>
        </div>
      `;
    }
    
    return '';
  }
});

// Recent activity section
recentActivity.$bind({
  '#activity-feed': function() {
    if (this.loading) {
      return '<div class="loading">Loading activity...</div>';
    }
    
    if (this.isError) {
      return `
        <div class="error">
          Unable to load activity
          <button onclick="recentActivity.$reset(); loadDashboard()">Retry</button>
        </div>
      `;
    }
    
    if (this.isSuccess) {
      if (this.data.length === 0) {
        return '<p>No recent activity</p>';
      }
      
      return this.data.map(activity => `
        <div class="activity-item">
          <span class="timestamp">${new Date(activity.timestamp).toLocaleString()}</span>
          <span class="user">${activity.user}</span>
          <span class="action">${activity.action}</span>
        </div>
      `).join('');
    }
    
    return '';
  }
});

// Initialize dashboard
loadDashboard();

// Event handlers
document.getElementById('refresh-btn').addEventListener('click', loadDashboard);
document.getElementById('auto-refresh-toggle').addEventListener('change', (e) => {
  e.target.checked ? startAutoRefresh() : stopAutoRefresh();
});
```

---

## Best Practices Summary

### ✅ DO

- Use `$execute()` for all async operations
- Check `isSuccess` before accessing `data`
- Display loading states with `loading` property
- Show errors with `isError` and `error.message`
- Call `$reset()` when clearing state
- Handle errors in try/catch blocks
- Use async/await for clean code

### ❌ DON'T

- Access `data` without checking `isSuccess`
- Forget to handle errors
- Modify `loading` or `error` directly (use `$execute()`)
- Ignore loading states in UI
- Chain async operations without error handling
- Assume `data` exists without checking

---

## API Quick Reference

```javascript
const asyncState = ReactiveUtils.async(initialValue);

// Methods
await asyncState.$execute(asyncFn)  // Execute async operation
asyncState.$reset()                 // Reset to initial state

// Properties
asyncState.data                     // Result data
asyncState.loading                  // Boolean: is loading
asyncState.error                    // Error object or null
asyncState.isSuccess                // Computed: loaded successfully
asyncState.isError                  // Computed: has error

// Inherited Methods
asyncState.$computed(key, fn)       // Add computed
asyncState.$watch(keyOrFn, callback)// Watch changes
asyncState.$bind(bindingDefs)       // DOM bindings
```

---
