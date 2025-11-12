[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Collection Instance Methods - Complete Guide

## Overview

Collections provide a reactive way to manage arrays of items with built-in methods for common operations. Created with `ReactiveUtils.collection()` or `ReactiveUtils.list()`, collections are perfect for todo lists, shopping carts, data tables, and any array-based data.

---

## Table of Contents

1. [$add(item)](#additem) - Add item to collection
2. [$remove(predicate)](#removepredicate) - Remove item from collection
3. [$update(predicate, updates)](#updatepredicate-updates) - Update item in collection
4. [$clear()](#clear) - Remove all items
5. [items Property](#items-property) - Access the array of items
6. [Complete Example - Todo Application](#complete-example---todo-application) - Full implementation
7. [Performance Tips](#performance-tips) - Optimization strategies
8. [Comparison with Standard Arrays](#comparison-with-standard-arrays) - Feature comparison
9. [Common Patterns](#common-patterns) - Real-world examples (7 patterns)
10. [Troubleshooting](#troubleshooting) - Common issues and solutions
11. [Best Practices Summary](#best-practices-summary) - Usage guidelines
12. [API Quick Reference](#api-quick-reference) - Quick lookup

---

## `$add(item)`

Add a new item to the end of the collection.

### Syntax
```javascript
collection.$add(item)
```

### Parameters
- **`item`** (any) - Item to add to the collection

### Returns
- `undefined`

### Example - Simple Items
```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false }
]);

todos.$add({ id: 2, text: 'Walk dog', done: false });
todos.$add({ id: 3, text: 'Read book', done: true });

console.log(todos.items.length); // 3
```

### Example - With Auto-Update
```javascript
const tasks = ReactiveUtils.collection([]);

// Bind to DOM
Elements.bind({
  'task-count': () => tasks.items.length,
  'task-list': () => {
    return tasks.items.map(t => `<li>${t.text}</li>`).join('');
  }
});

// Adding automatically updates DOM
tasks.$add({ id: 1, text: 'New task' });
```

### Advanced Example - Shopping Cart
```javascript
const cart = ReactiveUtils.collection([]);

cart.$computed('total', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

cart.$computed('itemCount', function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

function addToCart(product) {
  // Check if item already exists
  const existing = cart.items.find(item => item.id === product.id);
  
  if (existing) {
    // Update quantity instead
    cart.$update(
      item => item.id === product.id,
      { quantity: existing.quantity + 1 }
    );
  } else {
    // Add new item
    cart.$add({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
}

// Bind to display
Elements.bind({
  'cart-count': () => cart.itemCount,
  'cart-total': () => `$${cart.total.toFixed(2)}`
});

// Add products
addToCart({ id: 1, name: 'Laptop', price: 999 });
addToCart({ id: 2, name: 'Mouse', price: 29 });
addToCart({ id: 1, name: 'Laptop', price: 999 }); // Increases quantity
```

### Example - With Validation
```javascript
const users = ReactiveUtils.collection([]);

function addUser(user) {
  // Validate before adding
  if (!user.email || !user.name) {
    console.error('Invalid user: missing required fields');
    return;
  }
  
  // Check for duplicates
  const exists = users.items.some(u => u.email === user.email);
  if (exists) {
    console.error('User with this email already exists');
    return;
  }
  
  // Add with timestamp
  users.$add({
    ...user,
    id: Date.now(),
    createdAt: new Date().toISOString()
  });
}

addUser({ name: 'John Doe', email: 'john@example.com' });
```

### Example - Batch Add
```javascript
const posts = ReactiveUtils.collection([]);

function importPosts(newPosts) {
  posts.$batch(function() {
    newPosts.forEach(post => {
      this.$add(post);
    });
  });
}

// Efficiently add multiple items with single update
importPosts([
  { id: 1, title: 'Post 1', content: '...' },
  { id: 2, title: 'Post 2', content: '...' },
  { id: 3, title: 'Post 3', content: '...' }
]);
```

### Use Cases
- Adding todo items
- Adding products to cart
- Appending messages to chat
- Growing notification lists
- Adding rows to tables
- Collecting form submissions

### Tips
- Items are added by reference, so modifications affect the collection
- Use `$batch()` when adding multiple items for better performance
- Consider validation before adding to maintain data integrity

---

## `$remove(predicate)`

Remove an item from the collection by predicate function or direct value comparison.

### Syntax
```javascript
collection.$remove(predicate)
```

### Parameters
- **`predicate`** (Function|any) - Predicate function returning `true` for item to remove, or direct value to remove

### Returns
- `undefined`

### Example - Remove by Value
```javascript
const numbers = ReactiveUtils.collection([1, 2, 3, 4, 5]);

numbers.$remove(3); // Removes the number 3
console.log(numbers.items); // [1, 2, 4, 5]
```

### Example - Remove by Predicate
```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true },
  { id: 3, text: 'Read book', done: false }
]);

// Remove by ID
todos.$remove(todo => todo.id === 2);

// Remove first completed item
todos.$remove(todo => todo.done === true);

console.log(todos.items.length); // 1
```

### Advanced Example - Shopping Cart
```javascript
const cart = ReactiveUtils.collection([
  { id: 1, name: 'Laptop', price: 999, qty: 1 },
  { id: 2, name: 'Mouse', price: 29, qty: 2 },
  { id: 3, name: 'Keyboard', price: 79, qty: 1 }
]);

// Remove item by ID
function removeFromCart(productId) {
  const item = cart.items.find(i => i.id === productId);
  
  if (!item) {
    console.error('Item not found');
    return;
  }
  
  // Confirm before removing
  if (confirm(`Remove ${item.name} from cart?`)) {
    cart.$remove(i => i.id === productId);
    console.log(`${item.name} removed from cart`);
  }
}

removeFromCart(2); // Removes mouse
```

### Example - Conditional Bulk Remove
```javascript
const tasks = ReactiveUtils.collection([
  { id: 1, text: 'Task 1', completed: true, priority: 'low' },
  { id: 2, text: 'Task 2', completed: false, priority: 'high' },
  { id: 3, text: 'Task 3', completed: true, priority: 'low' },
  { id: 4, text: 'Task 4', completed: false, priority: 'high' }
]);

// Remove all completed tasks
function clearCompleted() {
  tasks.$batch(function() {
    // Remove in reverse to avoid index issues
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].completed) {
        this.items.splice(i, 1);
      }
    }
    this.$notify('items');
  });
}

// Or better: recreate array
function clearCompleted() {
  tasks.items = tasks.items.filter(task => !task.completed);
}

clearCompleted();
console.log(tasks.items.length); // 2 (only incomplete tasks remain)
```

### Example - Remove with Animation
```javascript
const notifications = ReactiveUtils.collection([
  { id: 1, message: 'Welcome!', type: 'info' },
  { id: 2, message: 'New message', type: 'success' },
  { id: 3, message: 'Warning!', type: 'warning' }
]);

async function removeNotification(id) {
  // Animate out
  const element = document.querySelector(`[data-notification-id="${id}"]`);
  if (element) {
    element.classList.add('fade-out');
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Remove from collection
  notifications.$remove(n => n.id === id);
}
```

### Example - Auto-Remove After Timeout
```javascript
const messages = ReactiveUtils.collection([]);

function showMessage(text, duration = 3000) {
  const id = Date.now();
  
  messages.$add({
    id,
    text,
    timestamp: new Date()
  });
  
  // Auto-remove after duration
  setTimeout(() => {
    messages.$remove(msg => msg.id === id);
  }, duration);
}

showMessage('Operation successful!', 5000);
```

### Use Cases
- Removing completed todos
- Deleting cart items
- Dismissing notifications
- Removing table rows
- Deleting list entries
- Clearing expired items

### Important Notes
- Only removes the **first** matching item
- If predicate is a value, uses strict equality (`===`)
- Returns immediately if item not found (no error)
- Use array filter for removing multiple items at once

### Performance Tip
```javascript
// ❌ Slow: Multiple individual removes
completedTasks.forEach(task => {
  tasks.$remove(t => t.id === task.id);
});

// ✅ Fast: Single immutable update
tasks.items = tasks.items.filter(task => !task.completed);
```

---

## `$update(predicate, updates)`

Update properties of an item in the collection.

### Syntax
```javascript
collection.$update(predicate, updates)
```

### Parameters
- **`predicate`** (Function|any) - Predicate function or direct value to find item
- **`updates`** (Object) - Properties to update on the found item

### Returns
- `undefined`

### Example - Update by Value
```javascript
const numbers = ReactiveUtils.collection([
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  { id: 3, value: 30 }
]);

// Find by reference and update
const item = numbers.items[0];
numbers.$update(item, { value: 100 });

console.log(numbers.items[0].value); // 100
```

### Example - Update by Predicate
```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false },
  { id: 3, text: 'Read book', done: false }
]);

// Toggle todo completion
function toggleTodo(id) {
  const todo = todos.items.find(t => t.id === id);
  todos.$update(
    t => t.id === id,
    { done: !todo.done }
  );
}

toggleTodo(1);
console.log(todos.items[0].done); // true
```

### Advanced Example - Shopping Cart
```javascript
const cart = ReactiveUtils.collection([
  { id: 1, name: 'Laptop', price: 999, qty: 1 },
  { id: 2, name: 'Mouse', price: 29, qty: 2 }
]);

cart.$computed('total', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.qty);
  }, 0);
});

// Update quantity
function updateQuantity(productId, newQty) {
  if (newQty <= 0) {
    cart.$remove(item => item.id === productId);
    return;
  }
  
  cart.$update(
    item => item.id === productId,
    { qty: newQty }
  );
}

// Increment quantity
function incrementQuantity(productId) {
  const item = cart.items.find(i => i.id === productId);
  if (item) {
    cart.$update(
      i => i.id === productId,
      { qty: item.qty + 1 }
    );
  }
}

// Bind to UI
Elements.bind({
  'cart-total': () => `$${cart.total.toFixed(2)}`
});

updateQuantity(1, 3); // Updates laptop quantity to 3
incrementQuantity(2); // Increases mouse quantity by 1
```

### Example - Task Management
```javascript
const tasks = ReactiveUtils.collection([
  { 
    id: 1, 
    title: 'Design homepage', 
    status: 'todo',
    assignee: null,
    priority: 'medium'
  },
  { 
    id: 2, 
    title: 'Write tests', 
    status: 'in-progress',
    assignee: 'john@example.com',
    priority: 'high'
  }
]);

// Assign task
function assignTask(taskId, assignee) {
  tasks.$update(
    task => task.id === taskId,
    { 
      assignee,
      status: 'in-progress',
      assignedAt: new Date().toISOString()
    }
  );
}

// Update status
function updateTaskStatus(taskId, newStatus) {
  const updates = { 
    status: newStatus,
    updatedAt: new Date().toISOString()
  };
  
  if (newStatus === 'done') {
    updates.completedAt = new Date().toISOString();
  }
  
  tasks.$update(task => task.id === taskId, updates);
}

// Change priority
function changePriority(taskId, priority) {
  tasks.$update(
    task => task.id === taskId,
    { priority }
  );
}

assignTask(1, 'jane@example.com');
updateTaskStatus(1, 'done');
changePriority(2, 'critical');
```

### Example - Partial Updates
```javascript
const users = ReactiveUtils.collection([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    profile: {
      avatar: '/avatars/default.jpg',
      bio: 'Developer',
      settings: {
        theme: 'light',
        notifications: true
      }
    }
  }
]);

// Update nested properties
function updateUserTheme(userId, theme) {
  const user = users.items.find(u => u.id === userId);
  
  users.$update(
    u => u.id === userId,
    {
      profile: {
        ...user.profile,
        settings: {
          ...user.profile.settings,
          theme
        }
      }
    }
  );
}

updateUserTheme(1, 'dark');
```

### Example - Bulk Updates
```javascript
const products = ReactiveUtils.collection([
  { id: 1, name: 'Product A', price: 100, onSale: false },
  { id: 2, name: 'Product B', price: 200, onSale: false },
  { id: 3, name: 'Product C', price: 150, onSale: false }
]);

// Apply discount to all products
function applyBulkDiscount(discountPercent) {
  products.$batch(function() {
    this.items.forEach((product, index) => {
      const discountedPrice = product.price * (1 - discountPercent / 100);
      this.$update(
        p => p.id === product.id,
        { 
          price: discountedPrice,
          onSale: true,
          originalPrice: product.price
        }
      );
    });
  });
}

applyBulkDiscount(20); // 20% off all products
```

### Example - With Validation
```javascript
const inventory = ReactiveUtils.collection([
  { id: 1, name: 'Widget', stock: 100, reserved: 0 }
]);

function reserveStock(productId, quantity) {
  const product = inventory.items.find(p => p.id === productId);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  const available = product.stock - product.reserved;
  
  if (quantity > available) {
    throw new Error(`Only ${available} units available`);
  }
  
  inventory.$update(
    p => p.id === productId,
    { reserved: product.reserved + quantity }
  );
}

try {
  reserveStock(1, 50);
  console.log('Stock reserved');
} catch (error) {
  console.error(error.message);
}
```

### Use Cases
- Toggling todo completion
- Updating cart quantities
- Changing task status
- Modifying user profiles
- Adjusting product prices
- Updating form field values

### Important Notes
- Only updates the **first** matching item
- Uses `Object.assign()` internally - shallow merge
- For deep updates, spread existing nested objects
- Changes trigger reactivity automatically

---

## `$clear()`

Remove all items from the collection.

### Syntax
```javascript
collection.$clear()
```

### Parameters
- None

### Returns
- `undefined`

### Example - Basic Clear
```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Task 1' },
  { id: 2, text: 'Task 2' },
  { id: 3, text: 'Task 3' }
]);

console.log(todos.items.length); // 3

todos.$clear();

console.log(todos.items.length); // 0
```

### Example - Clear with Confirmation
```javascript
const cart = ReactiveUtils.collection([
  { id: 1, name: 'Laptop', price: 999, qty: 1 },
  { id: 2, name: 'Mouse', price: 29, qty: 2 }
]);

function clearCart() {
  if (cart.items.length === 0) {
    console.log('Cart is already empty');
    return;
  }
  
  if (confirm(`Remove all ${cart.items.length} items from cart?`)) {
    cart.$clear();
    console.log('Cart cleared');
  }
}

clearCart();
```

### Advanced Example - Reset with Default Items
```javascript
const filters = ReactiveUtils.collection([
  { id: 'status', value: 'all' },
  { id: 'priority', value: 'any' },
  { id: 'assignee', value: null }
]);

const defaultFilters = [
  { id: 'status', value: 'all' },
  { id: 'priority', value: 'any' },
  { id: 'assignee', value: null }
];

function resetFilters() {
  filters.$batch(function() {
    this.$clear();
    defaultFilters.forEach(filter => {
      this.$add({ ...filter });
    });
  });
}

// Or simpler
function resetFilters() {
  filters.items = defaultFilters.map(f => ({ ...f }));
}
```

### Example - Clear with Animation
```javascript
const notifications = ReactiveUtils.collection([
  { id: 1, message: 'Notification 1' },
  { id: 2, message: 'Notification 2' },
  { id: 3, message: 'Notification 3' }
]);

async function clearAllNotifications() {
  // Animate all out
  const elements = document.querySelectorAll('.notification');
  elements.forEach(el => el.classList.add('fade-out'));
  
  // Wait for animation
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Clear collection
  notifications.$clear();
}
```

### Example - Clear Completed Items
```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: true },
  { id: 2, text: 'Walk dog', done: false },
  { id: 3, text: 'Read book', done: true }
]);

function clearCompleted() {
  // Don't use $clear() - it removes everything
  // Instead, filter and reassign
  todos.items = todos.items.filter(todo => !todo.done);
}

clearCompleted();
console.log(todos.items.length); // 1 (only incomplete remains)
```

### Example - Clear with Undo
```javascript
const list = ReactiveUtils.collection([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]);

let backup = null;

function clearWithUndo() {
  // Backup current items
  backup = [...list.items];
  
  list.$clear();
  
  // Show undo option
  showUndoNotification();
}

function undo() {
  if (backup) {
    list.items = backup;
    backup = null;
  }
}

// Auto-expire undo after 5 seconds
function showUndoNotification() {
  const notification = {
    message: 'List cleared',
    action: 'Undo',
    onAction: undo
  };
  
  setTimeout(() => {
    backup = null;
  }, 5000);
}
```

### Example - Clear and Reinitialize
```javascript
const dataTable = ReactiveUtils.collection([]);

async function refreshData() {
  // Show loading
  dataTable.$clear();
  
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    
    dataTable.$batch(function() {
      data.forEach(item => {
        this.$add(item);
      });
    });
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}
```

### Use Cases
- Reset form data
- Clear search results
- Empty shopping cart
- Clear notifications
- Reset filters
- Refresh data tables

### Performance Note
```javascript
// Both have same performance
collection.$clear();

// vs
collection.items = [];
```

---

## `items` Property

The reactive array containing all collection items.

### Syntax
```javascript
const array = collection.items
```

### Type
- `Array` - Reactive array of items

### Example - Direct Access
```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Task 1', done: false },
  { id: 2, text: 'Task 2', done: true }
]);

// Access items
console.log(todos.items.length); // 2
console.log(todos.items[0].text); // "Task 1"

// Iterate
todos.items.forEach(todo => {
  console.log(todo.text);
});

// Map
const texts = todos.items.map(t => t.text);

// Filter
const completed = todos.items.filter(t => t.done);
```

### Example - Direct Manipulation
```javascript
const numbers = ReactiveUtils.collection([1, 2, 3]);

// You CAN modify directly, but need to notify
numbers.items.push(4);
numbers.$notify('items'); // Required for reactivity

// Better: Immutable update (auto-notifies)
numbers.items = [...numbers.items, 4];

// Or use collection methods (auto-notify)
numbers.$add(4);
```

### Example - Array Methods
```javascript
const products = ReactiveUtils.collection([
  { id: 1, name: 'A', price: 100 },
  { id: 2, name: 'B', price: 50 },
  { id: 3, name: 'C', price: 75 }
]);

// Find
const product = products.items.find(p => p.id === 2);

// Some
const hasExpensive = products.items.some(p => p.price > 80);

// Every
const allAffordable = products.items.every(p => p.price < 200);

// Reduce
const total = products.items.reduce((sum, p) => sum + p.price, 0);

// Sort (creates new array)
const sorted = [...products.items].sort((a, b) => a.price - b.price);
```

### Example - With Computed Properties
```javascript
const cart = ReactiveUtils.collection([
  { id: 1, name: 'Laptop', price: 999, qty: 1 },
  { id: 2, name: 'Mouse', price: 29, qty: 2 }
]);

// Computed based on items
cart.$computed('total', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.qty);
  }, 0);
});

cart.$computed('itemCount', function() {
  return this.items.length;
});

cart.$computed('uniqueCount', function() {
  return this.items.reduce((sum, item) => sum + item.qty, 0);
});

console.log(cart.total); // 1057
console.log(cart.itemCount); // 2
console.log(cart.uniqueCount); // 3
```

### Example - Binding to DOM
```javascript
const tasks = ReactiveUtils.collection([
  { id: 1, text: 'Task 1', priority: 'high' },
  { id: 2, text: 'Task 2', priority: 'low' }
]);

Elements.bind({
  'task-list': () => {
    return tasks.items.map(task => `
      <li class="priority-${task.priority}">
        ${task.text}
      </li>
    `).join('');
  },
  'task-count': () => tasks.items.length,
  'high-priority-count': () => {
    return tasks.items.filter(t => t.priority === 'high').length;
  }
});
```

### Important Notes About Direct Manipulation

```javascript
const list = ReactiveUtils.collection([1, 2, 3]);

// ❌ These DON'T trigger reactivity automatically:
list.items.push(4);
list.items.pop();
list.items.splice(1, 1);
list.items.sort();
list.items.reverse();

// You must manually notify:
list.items.push(4);
list.$notify('items');

// ✅ These DO trigger reactivity:
list.items = [...list.items, 4];  // Reassignment
list.$add(4);                      // Collection method
```

### Best Practices

```javascript
// ❌ Bad: Direct mutation without notification
collection.items.push(newItem);

// ⚠️ Okay: Direct mutation with notification
collection.items.push(newItem);
collection.$notify('items');

// ✅ Good: Immutable update
collection.items = [...collection.items, newItem];

// ✅ Best: Use collection methods
collection.$add(newItem);
```

---

## Complete Example - Todo Application

```javascript
// Create todo collection
const todos = ReactiveUtils.collection([]);

// Add computed properties
todos.$computed('activeCount', function() {
  return this.items.filter(t => !t.done).length;
});

todos.$computed('completedCount', function() {
  return this.items.filter(t => t.done).length;
});

todos.$computed('allCompleted', function() {
  return this.items.length > 0 && this.items.every(t => t.done);
});

// Watch for changes
todos.$watch('items', (items) => {
  localStorage.setItem('todos', JSON.stringify(items));
  console.log(`${items.length} todos in list`);
});

// Bind to DOM
todos.$bind({
  '#todo-list': function() {
    return this.items.map(todo => `
      <li class="${todo.done ? 'completed' : ''}" data-id="${todo.id}">
        <input 
          type="checkbox" 
          ${todo.done ? 'checked' : ''}
          onchange="toggleTodo(${todo.id})"
        >
        <span>${todo.text}</span>
        <button onclick="removeTodo(${todo.id})">×</button>
      </li>
    `).join('');
  },
  '#active-count': () => `${todos.activeCount} items left`,
  '#completed-count': () => todos.completedCount,
  '#toggle-all': {
    checked: () => todos.allCompleted
  }
});

// Actions
function addTodo(text) {
  if (!text.trim()) return;
  
  todos.$add({
    id: Date.now(),
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString()
  });
}

function toggleTodo(id) {
  const todo = todos.items.find(t => t.id === id);
  if (todo) {
    todos.$update(t => t.id === id, { done: !todo.done });
  }
}

function removeTodo(id) {
  todos.$remove(t => t.id === id);
}

function clearCompleted() {
  todos.items = todos.items.filter(t => !t.done);
}

function toggleAll() {
  const allDone = todos.allCompleted;
  todos.$batch(function() {
    this.items.forEach((todo, index) => {
      this.$update(t => t.id === todo.id, { done: !allDone });
    });
  });
}

// Load from localStorage
const saved = localStorage.getItem('todos');
if (saved) {
  JSON.parse(saved).forEach(todo => todos.$add(todo));
}
```

---

## Performance Tips

### Tip 1: Batch Multiple Operations
```javascript
// ❌ Slow: Multiple updates
todos.$add(item1);
todos.$add(item2);
todos.$add(item3);
todos.$update(t => t.id === 1, updates);

// ✅ Fast: Single batched operation
todos.$batch(function() {
  this.$add(item1);
  this.$add(item2);
  this.$add(item3);
  this.$update(t => t.id === 1, updates);
});
```

### Tip 2: Use Immutable Updates for Multiple Changes
```javascript
// ❌ Slow: Individual removes
completedItems.forEach(item => {
  collection.$remove(i => i.id === item.id);
});

// ✅ Fast: Single filter operation
collection.items = collection.items.filter(item => !item.completed);
```

### Tip 3: Optimize Predicates
```javascript
// ❌ Slower: Complex predicate
collection.$update(
  item => {
    const found = someArray.find(x => x.id === item.id);
    return found && found.value > 10;
  },
  updates
);

// ✅ Faster: Simple predicate
const targetId = someArray.find(x => x.value > 10)?.id;
collection.$update(item => item.id === targetId, updates);
```

### Tip 4: Minimize DOM Bindings
```javascript
// ❌ Expensive: Rebuilding entire list
collection.$bind({
  '#list': function() {
    return this.items.map(item => `<li>${item.text}</li>`).join('');
  }
});

// ✅ Better: Update only counts/summaries
collection.$bind({
  '#item-count': () => collection.items.length,
  '#total': () => collection.total
});
```

---

## Comparison with Standard Arrays

| Feature | Standard Array | Collection |
|---------|---------------|------------|
| Reactivity | ❌ Manual | ✅ Automatic |
| Add item | `arr.push()` + notify | `$add()` |
| Remove item | `arr.splice()` + notify | `$remove()` |
| Update item | Manual find + assign | `$update()` |
| Clear all | `arr.length = 0` + notify | `$clear()` |
| Computed | Manual recalc | `$computed()` |
| Watch changes | Manual callback | `$watch()` |
| DOM binding | Manual update | `$bind()` |

---


## Common Patterns

### Pattern 1: Pagination

```javascript
const products = ReactiveUtils.collection([]);
const pagination = ReactiveUtils.state({
  currentPage: 1,
  pageSize: 10
});

// Computed for paginated items
products.$computed('currentPageItems', function() {
  const start = (pagination.currentPage - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return this.items.slice(start, end);
});

products.$computed('totalPages', function() {
  return Math.ceil(this.items.length / pagination.pageSize);
});

// Bind to DOM
products.$bind({
  '#product-list': function() {
    return this.currentPageItems.map(p => `
      <div class="product">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
      </div>
    `).join('');
  },
  '#page-info': () => {
    return `Page ${pagination.currentPage} of ${products.totalPages}`;
  }
});

// Navigation
function nextPage() {
  if (pagination.currentPage < products.totalPages) {
    pagination.currentPage++;
  }
}

function prevPage() {
  if (pagination.currentPage > 1) {
    pagination.currentPage--;
  }
}

function goToPage(page) {
  if (page >= 1 && page <= products.totalPages) {
    pagination.currentPage = page;
  }
}
```

### Pattern 2: Sorting and Filtering

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'John', age: 30, role: 'admin', active: true },
  { id: 2, name: 'Jane', age: 25, role: 'user', active: true },
  { id: 3, name: 'Bob', age: 35, role: 'user', active: false }
]);

const controls = ReactiveUtils.state({
  sortBy: 'name',
  sortOrder: 'asc',
  filterRole: 'all',
  filterActive: 'all',
  searchQuery: ''
});

// Computed for filtered and sorted users
users.$computed('filteredUsers', function() {
  let filtered = this.items;
  
  // Filter by role
  if (controls.filterRole !== 'all') {
    filtered = filtered.filter(u => u.role === controls.filterRole);
  }
  
  // Filter by active status
  if (controls.filterActive !== 'all') {
    const isActive = controls.filterActive === 'active';
    filtered = filtered.filter(u => u.active === isActive);
  }
  
  // Search filter
  if (controls.searchQuery) {
    const query = controls.searchQuery.toLowerCase();
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

users.$computed('sortedUsers', function() {
  const sorted = [...this.filteredUsers];
  const { sortBy, sortOrder } = controls;
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    if (typeof a[sortBy] === 'string') {
      comparison = a[sortBy].localeCompare(b[sortBy]);
    } else {
      comparison = a[sortBy] - b[sortBy];
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
});

users.$computed('stats', function() {
  return {
    total: this.items.length,
    filtered: this.filteredUsers.length,
    active: this.items.filter(u => u.active).length,
    admins: this.items.filter(u => u.role === 'admin').length
  };
});

// Bind to DOM
users.$bind({
  '#user-table': function() {
    return this.sortedUsers.map(user => `
      <tr>
        <td>${user.name}</td>
        <td>${user.age}</td>
        <td>${user.role}</td>
        <td>${user.active ? 'Active' : 'Inactive'}</td>
      </tr>
    `).join('');
  },
  '#total-count': () => users.stats.total,
  '#filtered-count': () => users.stats.filtered,
  '#active-count': () => users.stats.active
});

// Controls
function setSort(field) {
  if (controls.sortBy === field) {
    controls.sortOrder = controls.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    controls.sortBy = field;
    controls.sortOrder = 'asc';
  }
}

function setFilter(type, value) {
  if (type === 'role') {
    controls.filterRole = value;
  } else if (type === 'active') {
    controls.filterActive = value;
  }
}

function search(query) {
  controls.searchQuery = query;
}
```

### Pattern 3: Undo/Redo with Collections

```javascript
const tasks = ReactiveUtils.collection([]);
const history = ReactiveUtils.state({
  past: [],
  future: [],
  maxHistory: 50
});

tasks.$computed('canUndo', function() {
  return history.past.length > 0;
});

tasks.$computed('canRedo', function() {
  return history.future.length > 0;
});

// Save state to history
function saveToHistory() {
  const snapshot = JSON.parse(JSON.stringify(tasks.items));
  
  history.$batch(function() {
    this.past.push(snapshot);
    if (this.past.length > this.maxHistory) {
      this.past.shift();
    }
    this.future = []; // Clear redo stack
  });
}

// Wrap actions with history
function addTaskWithHistory(text) {
  saveToHistory();
  tasks.$add({
    id: Date.now(),
    text,
    done: false
  });
}

function removeTaskWithHistory(id) {
  saveToHistory();
  tasks.$remove(t => t.id === id);
}

function updateTaskWithHistory(id, updates) {
  saveToHistory();
  tasks.$update(t => t.id === id, updates);
}

// Undo/Redo
function undo() {
  if (!tasks.canUndo) return;
  
  history.$batch(function() {
    const current = JSON.parse(JSON.stringify(tasks.items));
    this.future.unshift(current);
    
    const previous = this.past.pop();
    tasks.items = previous;
  });
}

function redo() {
  if (!tasks.canRedo) return;
  
  history.$batch(function() {
    const current = JSON.parse(JSON.stringify(tasks.items));
    this.past.push(current);
    
    const next = this.future.shift();
    tasks.items = next;
  });
}

// Bind undo/redo buttons
Elements.bind({
  'undo-btn': {
    disabled: () => !tasks.canUndo
  },
  'redo-btn': {
    disabled: () => !tasks.canRedo
  }
});
```

### Pattern 4: Drag and Drop Reordering

```javascript
const items = ReactiveUtils.collection([
  { id: 1, text: 'Item 1', order: 0 },
  { id: 2, text: 'Item 2', order: 1 },
  { id: 3, text: 'Item 3', order: 2 }
]);

items.$computed('sortedItems', function() {
  return [...this.items].sort((a, b) => a.order - b.order);
});

// Move item up
function moveUp(id) {
  const index = items.sortedItems.findIndex(i => i.id === id);
  if (index <= 0) return;
  
  const current = items.sortedItems[index];
  const above = items.sortedItems[index - 1];
  
  items.$batch(function() {
    this.$update(i => i.id === current.id, { order: above.order });
    this.$update(i => i.id === above.id, { order: current.order });
  });
}

// Move item down
function moveDown(id) {
  const index = items.sortedItems.findIndex(i => i.id === id);
  if (index >= items.sortedItems.length - 1) return;
  
  const current = items.sortedItems[index];
  const below = items.sortedItems[index + 1];
  
  items.$batch(function() {
    this.$update(i => i.id === current.id, { order: below.order });
    this.$update(i => i.id === below.id, { order: current.order });
  });
}

// Move to specific position
function moveTo(id, newIndex) {
  const oldIndex = items.sortedItems.findIndex(i => i.id === id);
  if (oldIndex === newIndex) return;
  
  items.$batch(function() {
    // Update all affected items
    if (newIndex < oldIndex) {
      // Moving up
      for (let i = newIndex; i < oldIndex; i++) {
        this.$update(
          item => item.id === this.sortedItems[i].id,
          { order: i + 1 }
        );
      }
    } else {
      // Moving down
      for (let i = oldIndex + 1; i <= newIndex; i++) {
        this.$update(
          item => item.id === this.sortedItems[i].id,
          { order: i - 1 }
        );
      }
    }
    
    // Update moved item
    this.$update(i => i.id === id, { order: newIndex });
  });
}
```

### Pattern 5: Real-Time Sync with Server

```javascript
const messages = ReactiveUtils.collection([]);
const syncState = ReactiveUtils.state({
  connected: false,
  syncing: false,
  lastSync: null
});

// Watch for changes and sync
let syncTimeout;
messages.$watch('items', () => {
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(syncToServer, 1000); // Debounce 1s
});

async function syncToServer() {
  if (!syncState.connected) return;
  
  syncState.syncing = true;
  
  try {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages.items)
    });
    
    syncState.$update({
      syncing: false,
      lastSync: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync failed:', error);
    syncState.syncing = false;
  }
}

// Real-time updates via WebSocket
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  syncState.connected = true;
};

ws.onclose = () => {
  syncState.connected = false;
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'message:add') {
    messages.$add(data.message);
  } else if (data.type === 'message:update') {
    messages.$update(
      m => m.id === data.message.id,
      data.message
    );
  } else if (data.type === 'message:delete') {
    messages.$remove(m => m.id === data.id);
  }
};

// Bind sync status
Elements.bind({
  'sync-status': function() {
    if (syncState.syncing) return 'Syncing...';
    if (!syncState.connected) return 'Disconnected';
    if (syncState.lastSync) {
      return `Last synced: ${new Date(syncState.lastSync).toLocaleTimeString()}`;
    }
    return 'Connected';
  },
  'sync-indicator': {
    className: function() {
      if (syncState.syncing) return 'syncing';
      return syncState.connected ? 'connected' : 'disconnected';
    }
  }
});
```

### Pattern 6: Grouped Collections

```javascript
const tasks = ReactiveUtils.collection([
  { id: 1, text: 'Task 1', category: 'work', priority: 'high' },
  { id: 2, text: 'Task 2', category: 'personal', priority: 'low' },
  { id: 3, text: 'Task 3', category: 'work', priority: 'medium' },
  { id: 4, text: 'Task 4', category: 'personal', priority: 'high' }
]);

// Computed grouped data
tasks.$computed('byCategory', function() {
  const groups = {};
  
  this.items.forEach(task => {
    if (!groups[task.category]) {
      groups[task.category] = [];
    }
    groups[task.category].push(task);
  });
  
  return groups;
});

tasks.$computed('byPriority', function() {
  const groups = {
    high: [],
    medium: [],
    low: []
  };
  
  this.items.forEach(task => {
    groups[task.priority].push(task);
  });
  
  return groups;
});

tasks.$computed('categoryStats', function() {
  const stats = {};
  
  Object.entries(this.byCategory).forEach(([category, items]) => {
    stats[category] = {
      total: items.length,
      high: items.filter(t => t.priority === 'high').length,
      medium: items.filter(t => t.priority === 'medium').length,
      low: items.filter(t => t.priority === 'low').length
    };
  });
  
  return stats;
});

// Bind grouped display
tasks.$bind({
  '#grouped-tasks': function() {
    return Object.entries(this.byCategory).map(([category, items]) => `
      <div class="category-group">
        <h3>${category} (${items.length})</h3>
        <ul>
          ${items.map(task => `
            <li class="priority-${task.priority}">${task.text}</li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  },
  '#priority-summary': function() {
    return Object.entries(this.byPriority).map(([priority, items]) => `
      <div class="priority-${priority}">
        ${priority}: ${items.length}
      </div>
    `).join('');
  }
});
```

### Pattern 7: Optimistic Updates

```javascript
const posts = ReactiveUtils.collection([]);
const pendingActions = ReactiveUtils.state({
  items: []
});

async function addPostOptimistic(postData) {
  const tempId = `temp-${Date.now()}`;
  const optimisticPost = {
    ...postData,
    id: tempId,
    pending: true,
    createdAt: new Date().toISOString()
  };
  
  // Add immediately (optimistic)
  posts.$add(optimisticPost);
  
  // Track pending action
  pendingActions.items.push(tempId);
  
  try {
    // Send to server
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    
    const savedPost = await response.json();
    
    // Replace temp with real data
    posts.$batch(function() {
      this.$remove(p => p.id === tempId);
      this.$add(savedPost);
    });
    
  } catch (error) {
    // Revert on failure
    posts.$remove(p => p.id === tempId);
    
    // Show error
    alert('Failed to add post: ' + error.message);
  } finally {
    // Remove from pending
    pendingActions.items = pendingActions.items.filter(id => id !== tempId);
  }
}

async function deletePostOptimistic(postId) {
  // Find and backup post
  const post = posts.items.find(p => p.id === postId);
  if (!post) return;
  
  const backup = { ...post };
  
  // Remove immediately (optimistic)
  posts.$remove(p => p.id === postId);
  
  try {
    await fetch(`/api/posts/${postId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    // Revert on failure
    posts.$add(backup);
    alert('Failed to delete post: ' + error.message);
  }
}

// Visual indication of pending items
posts.$bind({
  '#post-list': function() {
    return this.items.map(post => `
      <div class="post ${post.pending ? 'pending' : ''}">
        <h3>${post.title}</h3>
        ${post.pending ? '<span class="badge">Saving...</span>' : ''}
      </div>
    `).join('');
  }
});
```

---

## Troubleshooting

### Issue 1: Collection Not Updating DOM

```javascript
// ❌ Problem: Direct mutation without notification
const items = ReactiveUtils.collection([1, 2, 3]);
items.items.push(4); // DOM doesn't update

// ✅ Solution 1: Notify manually
items.items.push(4);
items.$notify('items');

// ✅ Solution 2: Use collection method
items.$add(4);

// ✅ Solution 3: Immutable update
items.items = [...items.items, 4];
```

### Issue 2: $update Not Finding Item

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'John' }
]);

// ❌ Problem: Predicate returns false
users.$update(u => u.id === 2, { name: 'Jane' }); // No match

// ✅ Solution: Check if item exists first
const user = users.items.find(u => u.id === 2);
if (user) {
  users.$update(u => u.id === 2, { name: 'Jane' });
} else {
  console.error('User not found');
}
```

### Issue 3: Performance with Large Collections

```javascript
// ❌ Problem: Rebuilding entire list on every change
const items = ReactiveUtils.collection([/* 10000 items */]);

items.$bind({
  '#list': function() {
    return this.items.map(item => `<li>${item.text}</li>`).join('');
  }
});

// ✅ Solution 1: Only bind summary data
items.$bind({
  '#item-count': () => items.items.length,
  '#summary': () => `${items.items.length} total items`
});

// ✅ Solution 2: Use pagination
items.$computed('currentPage', function() {
  const page = currentPageNumber;
  return this.items.slice(page * 50, (page + 1) * 50);
});

items.$bind({
  '#list': function() {
    return this.currentPage.map(item => `<li>${item.text}</li>`).join('');
  }
});

// ✅ Solution 3: Virtual scrolling library
```

### Issue 4: Memory Leaks with Watchers

```javascript
// ❌ Problem: Watchers not cleaned up
function createComponent() {
  const items = ReactiveUtils.collection([]);
  
  items.$watch('items', () => {
    console.log('Items changed');
  });
  
  // Component destroyed but watcher still active
}

// ✅ Solution: Store and call cleanup
function createComponent() {
  const items = ReactiveUtils.collection([]);
  
  const cleanupWatch = items.$watch('items', () => {
    console.log('Items changed');
  });
  
  return {
    items,
    destroy() {
      cleanupWatch();
    }
  };
}
```

### Issue 5: Nested Object Updates

```javascript
const items = ReactiveUtils.collection([
  { id: 1, profile: { name: 'John', age: 30 } }
]);

// ❌ Problem: Shallow merge loses nested data
items.$update(
  i => i.id === 1,
  { profile: { age: 31 } } // Loses 'name'!
);

// ✅ Solution: Spread existing nested objects
const item = items.items.find(i => i.id === 1);
items.$update(
  i => i.id === 1,
  { 
    profile: { 
      ...item.profile, 
      age: 31 
    } 
  }
);
```

---

## Best Practices Summary

### ✅ DO

- Use `$add()`, `$remove()`, `$update()`, `$clear()` for automatic reactivity
- Use `$batch()` for multiple operations
- Store cleanup functions from `$watch()` and `$bind()`
- Use computed properties for derived data
- Validate data before adding to collection
- Use immutable updates for complex changes

### ❌ DON'T

- Directly mutate `items` array without `$notify()`
- Forget to clean up watchers in components
- Rebuild entire DOM on every change
- Store non-serializable data (functions, DOM nodes) in items
- Use `$update()` for multiple items (use immutable update instead)

---

## API Quick Reference

```javascript
const collection = ReactiveUtils.collection(initialItems);

// Instance Methods
collection.$add(item)                    // Add item
collection.$remove(predicate)            // Remove item
collection.$update(predicate, updates)   // Update item
collection.$clear()                      // Clear all

// Inherited from State
collection.$computed(key, fn)            // Add computed
collection.$watch(keyOrFn, callback)     // Watch changes
collection.$batch(fn)                    // Batch updates
collection.$notify(key)                  // Manual notify
collection.$update(updates)              // Mixed updates
collection.$set(updates)                 // Functional updates
collection.$bind(bindingDefs)            // DOM bindings

// Properties
collection.items                         // Array of items
collection.$raw                          // Non-reactive version
```

---
