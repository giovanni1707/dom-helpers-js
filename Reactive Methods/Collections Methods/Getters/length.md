# Understanding `length` - A Beginner's Guide

## What is `length`?

`length` is a reactive property of collections that returns the number of items. It works like JavaScript's array `length` property but on reactive collections and updates automatically.

Think of it as **collection counter** - always knows how many items.

---

## Why Does This Exist?

### The Problem: Tracking Collection Size

You need to know how many items are in a collection:

```javascript
// ❌ Without length - manual counting
const items = Reactive.collection([1, 2, 3, 4, 5]);

let count = 0;
for (let item of items) {
  count++;
}
console.log(count); // 5

// ✅ With length - automatic
console.log(items.length); // 5
```

**Why this matters:**
- Automatic count
- Always up-to-date
- Reactive updates
- Familiar property

---

## How Does It Work?

### The Length Property

```javascript
collection.length
    ↓
Returns item count
    ↓
Updates automatically when items change
```

---

## Basic Usage

### Get Item Count

```javascript
const items = Reactive.collection([1, 2, 3, 4, 5]);

console.log(items.length); // 5

items.push(6);
console.log(items.length); // 6

items.pop();
console.log(items.length); // 5
```

### Check if Empty

```javascript
const list = Reactive.collection([]);

if (list.length === 0) {
  console.log('List is empty');
}

list.push('item');
if (list.length > 0) {
  console.log('List has items');
}
```

### Display Count

```javascript
const todos = Reactive.collection([
  { title: 'Buy milk', completed: false },
  { title: 'Walk dog', completed: true }
]);

Reactive.effect(() => {
  document.getElementById('count').textContent = `${todos.length} tasks`;
});
```

---

## Simple Examples Explained

### Example 1: Shopping Cart Counter

```javascript
const cart = Reactive.collection([]);

// Display cart count
Reactive.effect(() => {
  const badge = document.getElementById('cart-badge');

  if (cart.length === 0) {
    badge.style.display = 'none';
  } else {
    badge.style.display = 'block';
    badge.textContent = cart.length;
  }
});

// Add to cart
function addToCart(product) {
  cart.push(product);
  // length automatically updates
}

// Remove from cart
function removeFromCart(productId) {
  const index = cart.findIndex(p => p.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
    // length automatically updates
  }
}
```

---

### Example 2: Task Counter

```javascript
const tasks = Reactive.collection([
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Walk dog', completed: true },
  { id: 3, title: 'Read book', completed: false }
]);

// Display task statistics
Reactive.effect(() => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const remaining = total - completed;

  document.getElementById('total-tasks').textContent = total;
  document.getElementById('completed-tasks').textContent = completed;
  document.getElementById('remaining-tasks').textContent = remaining;
});

// Add task
function addTask(title) {
  tasks.push({
    id: Date.now(),
    title: title,
    completed: false
  });
}

// Complete task
function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = true;
  }
}
```

---

### Example 3: Pagination

```javascript
const items = Reactive.collection([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' }
]);

const pagination = Reactive.state({
  currentPage: 1,
  itemsPerPage: 2
});

// Calculate total pages
const totalPages = Reactive.computed(() => {
  return Math.ceil(items.length / pagination.itemsPerPage);
});

// Get current page items
const currentItems = Reactive.computed(() => {
  const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const end = start + pagination.itemsPerPage;
  return items.slice(start, end);
});

// Display pagination info
Reactive.effect(() => {
  document.getElementById('page-info').textContent =
    `Page ${pagination.currentPage} of ${totalPages} (${items.length} total items)`;
});

// Display current page items
Reactive.effect(() => {
  const list = document.getElementById('items');
  list.innerHTML = currentItems
    .map(item => `<li>${item.name}</li>`)
    .join('');
});

// Next page
document.getElementById('next').onclick = () => {
  if (pagination.currentPage < totalPages) {
    pagination.currentPage++;
  }
};

// Previous page
document.getElementById('prev').onclick = () => {
  if (pagination.currentPage > 1) {
    pagination.currentPage--;
  }
};
```

---

## Real-World Example: Notification System

```javascript
const notifications = Reactive.collection([]);

const notificationState = Reactive.state({
  maxNotifications: 5,
  showAll: false
});

// Add notification
function addNotification(message, type = 'info') {
  notifications.push({
    id: Date.now(),
    message: message,
    type: type,
    timestamp: new Date()
  });

  // Limit notifications
  if (notifications.length > notificationState.maxNotifications) {
    notifications.shift(); // Remove oldest
  }
}

// Display notification badge
Reactive.effect(() => {
  const badge = document.getElementById('notification-badge');

  if (notifications.length === 0) {
    badge.style.display = 'none';
  } else {
    badge.style.display = 'block';
    badge.textContent = notifications.length;

    // Change color based on count
    if (notifications.length > 3) {
      badge.className = 'badge badge-warning';
    } else {
      badge.className = 'badge badge-info';
    }
  }
});

// Display notification list
Reactive.effect(() => {
  const container = document.getElementById('notifications');

  if (notifications.length === 0) {
    container.innerHTML = '<p>No notifications</p>';
    return;
  }

  const displayItems = notificationState.showAll
    ? notifications
    : notifications.slice(0, 3);

  container.innerHTML = `
    <div class="notification-list">
      ${displayItems.map(n => `
        <div class="notification notification-${n.type}">
          <span>${n.message}</span>
          <button onclick="removeNotification(${n.id})">×</button>
        </div>
      `).join('')}
    </div>
    ${notifications.length > 3 && !notificationState.showAll ? `
      <button onclick="toggleShowAll()">
        Show all ${notifications.length} notifications
      </button>
    ` : ''}
  `;
});

// Remove notification
function removeNotification(id) {
  const index = notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications.splice(index, 1);
  }
}

// Toggle show all
function toggleShowAll() {
  notificationState.showAll = !notificationState.showAll;
}

// Clear all notifications
function clearAllNotifications() {
  notifications.splice(0, notifications.length);
}

// Display clear button only if there are notifications
Reactive.effect(() => {
  const clearBtn = document.getElementById('clear-all');
  clearBtn.style.display = notifications.length > 0 ? 'block' : 'none';
});
```

---

## Common Patterns

### Pattern 1: Check if Empty

```javascript
if (collection.length === 0) {
  console.log('Empty');
}
```

### Pattern 2: Display Count

```javascript
Reactive.effect(() => {
  element.textContent = `${collection.length} items`;
});
```

### Pattern 3: Conditional Rendering

```javascript
Reactive.effect(() => {
  if (collection.length > 0) {
    renderList();
  } else {
    renderEmpty();
  }
});
```

### Pattern 4: Calculate Percentage

```javascript
const completed = items.filter(i => i.done).length;
const percent = (completed / items.length) * 100;
```

---

## Common Questions

### Q: Is length reactive?

**Answer:** Yes! Updates automatically:

```javascript
const items = Reactive.collection([1, 2, 3]);

Reactive.effect(() => {
  console.log(items.length); // Logs: 3
});

items.push(4); // Effect runs, logs: 4
```

### Q: Can I set length?

**Answer:** Yes, truncates or extends collection:

```javascript
const items = Reactive.collection([1, 2, 3, 4, 5]);

items.length = 3;
console.log(items); // [1, 2, 3]

items.length = 5;
console.log(items); // [1, 2, 3, undefined, undefined]
```

### Q: What about empty collections?

**Answer:** Returns 0:

```javascript
const empty = Reactive.collection([]);
console.log(empty.length); // 0
```

---

## Tips for Success

### 1. Check Before Access

```javascript
// ✅ Safe access
if (items.length > 0) {
  const first = items[0];
}
```

### 2. Use in Computed

```javascript
// ✅ Derived counts
const isEmpty = Reactive.computed(() => items.length === 0);
```

### 3. Display Counts

```javascript
// ✅ Show item count
Reactive.effect(() => {
  badge.textContent = items.length;
});
```

---

## Summary

### What `length` Does:

1. ✅ Returns item count
2. ✅ Updates automatically
3. ✅ Always accurate
4. ✅ Can be set
5. ✅ Reactive property

### When to Use It:

- Checking if empty
- Displaying counts
- Calculating percentages
- Conditional rendering
- Pagination logic

### The Basic Pattern:

```javascript
const collection = Reactive.collection([1, 2, 3, 4, 5]);

console.log(collection.length); // 5

collection.push(6);
console.log(collection.length); // 6

// Reactive display
Reactive.effect(() => {
  element.textContent = `${collection.length} items`;
});
```

---

**Remember:** `length` is always up-to-date and triggers reactivity when accessed in effects! 🎉
