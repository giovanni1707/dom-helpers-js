# Understanding `slice()` - A Beginner's Guide

## What is `slice()`?

`slice()` is a method for reactive collections that returns a shallow copy of a portion of the collection. It works like JavaScript's array `slice()` without modifying the original.

Think of it as **portion extractor** - get a piece without changing the original.

---

## Why Does This Exist?

### The Problem: Extracting Portions

You need to get a subset of items without modifying the collection:

```javascript
// ❌ Without slice - manual extraction
const items = Reactive.collection([1, 2, 3, 4, 5]);

const portion = [];
for (let i = 1; i < 4; i++) {
  portion.push(items[i]);
}
console.log(portion); // [2, 3, 4]
console.log(items); // [1, 2, 3, 4, 5] - unchanged

// ✅ With slice() - clean
const portion = items.slice(1, 4); // [2, 3, 4]
console.log(items); // [1, 2, 3, 4, 5] - unchanged
```

**Why this matters:**
- Non-destructive
- Flexible extraction
- Familiar array method
- Clean syntax

---

## How Does It Work?

### The Slice Process

```javascript
collection.slice(start, end)
    ↓
Extracts items from start to end (exclusive)
    ↓
Returns new array (doesn't modify original)
```

---

## Basic Usage

### Extract Middle Section

```javascript
const items = Reactive.collection([1, 2, 3, 4, 5]);

console.log(items.slice(1, 3)); // [2, 3]
console.log(items.slice(0, 2)); // [1, 2]
console.log(items); // [1, 2, 3, 4, 5] - unchanged
```

### From Index to End

```javascript
const items = Reactive.collection(['a', 'b', 'c', 'd', 'e']);

console.log(items.slice(2)); // ['c', 'd', 'e']
console.log(items.slice(0)); // ['a', 'b', 'c', 'd', 'e'] - full copy
```

### Negative Indices

```javascript
const items = Reactive.collection([1, 2, 3, 4, 5]);

console.log(items.slice(-2)); // [4, 5] - last 2
console.log(items.slice(-3, -1)); // [3, 4]
console.log(items.slice(1, -1)); // [2, 3, 4]
```

---

## Simple Examples Explained

### Example 1: Pagination

```javascript
const allItems = Reactive.collection([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' },
  { id: 6, name: 'Item 6' },
  { id: 7, name: 'Item 7' }
]);

const pagination = Reactive.state({
  currentPage: 1,
  itemsPerPage: 3
});

// Get current page items
const currentPageItems = Reactive.computed(() => {
  const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const end = start + pagination.itemsPerPage;
  return allItems.slice(start, end);
});

// Total pages
const totalPages = Reactive.computed(() => {
  return Math.ceil(allItems.length / pagination.itemsPerPage);
});

// Display current page
Reactive.effect(() => {
  const container = document.getElementById('items');

  container.innerHTML = currentPageItems
    .map(item => `<div class="item">${item.name}</div>`)
    .join('');
});

// Display pagination info
Reactive.effect(() => {
  document.getElementById('page-info').textContent =
    `Page ${pagination.currentPage} of ${totalPages}`;
});

// Navigation
function nextPage() {
  if (pagination.currentPage < totalPages) {
    pagination.currentPage++;
  }
}

function prevPage() {
  if (pagination.currentPage > 1) {
    pagination.currentPage--;
  }
}
```

---

### Example 2: Recent Items Display

```javascript
const activities = Reactive.collection([
  { id: 1, action: 'User logged in', time: '10:00' },
  { id: 2, action: 'File uploaded', time: '10:15' },
  { id: 3, action: 'Comment posted', time: '10:30' },
  { id: 4, action: 'Task completed', time: '10:45' },
  { id: 5, action: 'Meeting scheduled', time: '11:00' }
]);

// Display last 3 activities
Reactive.effect(() => {
  const recent = activities.slice(-3);
  const container = document.getElementById('recent-activities');

  container.innerHTML = `
    <h3>Recent Activities</h3>
    ${recent.map(a => `
      <div class="activity">
        <span>${a.action}</span>
        <small>${a.time}</small>
      </div>
    `).join('')}
  `;
});

// Display all activities with "show more"
const display = Reactive.state({
  showAll: false
});

Reactive.effect(() => {
  const container = document.getElementById('all-activities');
  const items = display.showAll
    ? activities
    : activities.slice(-5);

  container.innerHTML = items
    .map(a => `
      <div class="activity">
        <span>${a.action}</span>
        <small>${a.time}</small>
      </div>
    `)
    .join('');

  if (activities.length > 5) {
    container.innerHTML += `
      <button onclick="display.showAll = !display.showAll">
        ${display.showAll ? 'Show Less' : 'Show More'}
      </button>
    `;
  }
});
```

---

### Example 3: Data Range Selection

```javascript
const dataPoints = Reactive.collection([
  { date: '2024-01-01', value: 100 },
  { date: '2024-01-02', value: 120 },
  { date: '2024-01-03', value: 110 },
  { date: '2024-01-04', value: 130 },
  { date: '2024-01-05', value: 125 },
  { date: '2024-01-06', value: 140 },
  { date: '2024-01-07', value: 135 }
]);

const range = Reactive.state({
  startIndex: 0,
  endIndex: 3
});

// Get selected range
const selectedData = Reactive.computed(() => {
  return dataPoints.slice(range.startIndex, range.endIndex + 1);
});

// Display selected data
Reactive.effect(() => {
  const container = document.getElementById('chart-data');

  container.innerHTML = selectedData
    .map(d => `
      <div class="data-point">
        <span>${d.date}</span>
        <span>${d.value}</span>
      </div>
    `)
    .join('');
});

// Display range selector
Reactive.effect(() => {
  const container = document.getElementById('range-selector');

  container.innerHTML = `
    <label>
      Start:
      <input type="range"
             min="0"
             max="${dataPoints.length - 1}"
             value="${range.startIndex}"
             oninput="range.startIndex = parseInt(this.value)">
      <span>${range.startIndex}</span>
    </label>
    <label>
      End:
      <input type="range"
             min="${range.startIndex}"
             max="${dataPoints.length - 1}"
             value="${range.endIndex}"
             oninput="range.endIndex = parseInt(this.value)">
      <span>${range.endIndex}</span>
    </label>
    <p>Selected: ${selectedData.length} items</p>
  `;
});
```

---

## Real-World Example: Infinite Scroll Preview

```javascript
const allPosts = Reactive.collection([]);
const displayState = Reactive.state({
  loadedCount: 10,
  batchSize: 10,
  isLoading: false
});

// Simulate loading posts
function loadInitialPosts() {
  for (let i = 1; i <= 50; i++) {
    allPosts.push({
      id: i,
      title: `Post ${i}`,
      content: `Content for post ${i}`,
      date: new Date(Date.now() - i * 3600000).toISOString()
    });
  }
}

// Get visible posts
const visiblePosts = Reactive.computed(() => {
  return allPosts.slice(0, displayState.loadedCount);
});

// Display posts
Reactive.effect(() => {
  const container = document.getElementById('posts');

  container.innerHTML = visiblePosts
    .map(post => `
      <article class="post">
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <small>${new Date(post.date).toLocaleString()}</small>
      </article>
    `)
    .join('');
});

// Display load more button
Reactive.effect(() => {
  const button = document.getElementById('load-more');
  const hasMore = displayState.loadedCount < allPosts.length;

  if (hasMore) {
    button.style.display = 'block';
    button.textContent = displayState.isLoading
      ? 'Loading...'
      : `Load More (${allPosts.length - displayState.loadedCount} remaining)`;
    button.disabled = displayState.isLoading;
  } else {
    button.style.display = 'none';
  }
});

// Load more posts
function loadMore() {
  if (displayState.isLoading) return;

  displayState.isLoading = true;

  setTimeout(() => {
    displayState.loadedCount += displayState.batchSize;
    displayState.isLoading = false;
  }, 500);
}

// Infinite scroll detection
window.addEventListener('scroll', () => {
  const scrollBottom = window.scrollY + window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;

  if (scrollBottom >= pageHeight - 100) {
    loadMore();
  }
});

// Initialize
loadInitialPosts();
```

---

## Common Patterns

### Pattern 1: Get First N Items

```javascript
const first5 = collection.slice(0, 5);
```

### Pattern 2: Get Last N Items

```javascript
const last3 = collection.slice(-3);
```

### Pattern 3: Remove First/Last

```javascript
const withoutFirst = collection.slice(1);
const withoutLast = collection.slice(0, -1);
```

### Pattern 4: Shallow Copy

```javascript
const copy = collection.slice();
```

---

## Common Questions

### Q: Does it modify the original?

**Answer:** No, returns new array:

```javascript
const items = Reactive.collection([1, 2, 3]);
const sliced = items.slice(1);
console.log(items); // [1, 2, 3] - unchanged
```

### Q: Is the result reactive?

**Answer:** No, returns plain array:

```javascript
const sliced = collection.slice(0, 3);
// sliced is a plain array, not reactive
```

### Q: What if indices are out of bounds?

**Answer:** Adjusts automatically:

```javascript
const items = Reactive.collection([1, 2, 3]);
console.log(items.slice(0, 100)); // [1, 2, 3]
console.log(items.slice(10)); // []
```

---

## Tips for Success

### 1. Use for Non-Destructive Extraction

```javascript
// ✅ Original unchanged
const portion = items.slice(2, 5);
```

### 2. Negative Indices for End

```javascript
// ✅ Get last items
const last3 = items.slice(-3);
```

### 3. Shallow Copy

```javascript
// ✅ Create copy
const copy = items.slice();
```

---

## Summary

### What `slice()` Does:

1. ✅ Extracts portion
2. ✅ Returns new array
3. ✅ Doesn't modify original
4. ✅ Supports negative indices
5. ✅ Works like array slice()

### When to Use It:

- Pagination
- Recent items
- Data ranges
- Shallow copies
- Non-destructive extraction

### The Basic Pattern:

```javascript
const collection = Reactive.collection([1, 2, 3, 4, 5]);

// Get middle portion
const middle = collection.slice(1, 4); // [2, 3, 4]

// Get last items
const last2 = collection.slice(-2); // [4, 5]

// Copy all
const copy = collection.slice(); // [1, 2, 3, 4, 5]
```

---

**Remember:** `slice()` never modifies the original collection. Perfect for safe extraction! 🎉
