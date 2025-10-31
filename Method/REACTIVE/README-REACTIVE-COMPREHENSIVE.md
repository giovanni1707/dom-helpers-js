[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers - Reactive State Module - Comprehensive Documentation

Smart reactivity system for declarative DOM updates with automatic dependency tracking and fine-grained updates.

**Version:** 1.0.0  
**License:** MIT

---

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Core Concepts](#core-concepts)
3. [Creating Reactive State](#creating-reactive-state)
4. [Binding to Elements](#binding-to-elements)
5. [Binding to Collections](#binding-to-collections)
6. [Binding with Selectors](#binding-with-selectors)
7. [Reactive Arrays](#reactive-arrays)
8. [Nested Objects](#nested-objects)
9. [Dependency Tracking](#dependency-tracking)
10. [Unbinding](#unbinding)
11. [Advanced Patterns](#advanced-patterns)
12. [Complete Examples](#complete-examples)

---

## Installation & Setup

### Prerequisites

The Reactive module requires the main DOM Helpers library to be loaded first.

### Include the Libraries

```html
<!-- Load main DOM Helpers first -->
<script src="path/to/dom-helpers.js"></script>

<!-- Then load Reactive module -->
<script src="path/to/dom-helpers-reactive.js"></script>
```

### Basic Usage

```javascript
// Create reactive state
const state = ReactiveState.create({
  count: 0,
  name: 'John'
});

// Bind to element
Elements.bind({
  counter: () => state.count,
  username: () => state.name
});

// Update state (automatically updates DOM)
state.count++;
state.name = 'Jane';
```

---

## Core Concepts

The Reactive module provides a smart reactivity system with these features:

- **Automatic Updates** - DOM updates automatically when state changes
- **Fine-Grained Tracking** - Only updates what actually changed
- **Nested Reactivity** - Works with nested objects and arrays
- **Automatic Cleanup** - Bindings are cleaned up when elements are removed
- **Unified API** - Same binding interface across Elements, Collections, and Selector
- **Dependency Tracking** - Tracks which bindings depend on which state properties

---

## Creating Reactive State

### ReactiveState.create(initialState)

Create a new reactive state object with automatic change detection.

**Parameters:**
- `initialState` (Object): Initial state object

**Returns:** Reactive proxy object

**Example:**
```javascript
// Create reactive state
const state = ReactiveState.create({
  count: 0,
  user: {
    name: 'John',
    email: 'john@example.com'
  },
  items: ['apple', 'banana', 'orange']
});

// Updates trigger automatic DOM updates
state.count = 5;
state.user.name = 'Jane';
state.items.push('grape');
```

---

### Elements.state(initialState)

Create reactive state through the Elements helper (alias for ReactiveState.create).

**Parameters:**
- `initialState` (Object): Initial state object

**Returns:** Reactive proxy object

**Example:**
```javascript
// Create state through Elements
const appState = Elements.state({
  isLoading: false,
  message: 'Welcome!',
  users: []
});

// Use the state
appState.isLoading = true;
appState.users.push({ id: 1, name: 'John' });
```

---

## Binding to Elements

### Elements.bind(bindings)

Bind reactive functions to elements by their ID.

**Parameters:**
- `bindings` (Object): Object where keys are element IDs and values are binding functions or binding objects

**Returns:** undefined

**Example:**
```javascript
// Create state
const state = ReactiveState.create({
  count: 0,
  message: 'Hello'
});

// HTML: <div id="counter"></div>
//       <p id="message"></p>

// Simple binding - updates textContent
Elements.bind({
  counter: () => state.count,
  message: () => state.message
});

// Now when state changes, DOM updates automatically
state.count = 5;  // #counter now shows "5"
state.message = 'Hi';  // #message now shows "Hi"
```

---

### Binding to Specific Properties

**Example:**
```javascript
const state = ReactiveState.create({
  color: 'blue',
  isActive: true,
  width: 100
});

// HTML: <div id="box"></div>

// Bind to specific properties
Elements.bind({
  box: {
    // Bind to style
    style: () => ({
      backgroundColor: state.color,
      width: state.width + 'px',
      opacity: state.isActive ? 1 : 0.5
    }),
    
    // Bind to className
    className: () => state.isActive ? 'active' : 'inactive',
    
    // Bind to textContent
    textContent: () => `Width: ${state.width}px`
  }
});

// Update state
state.color = 'red';  // Box turns red
state.width = 200;    // Box widens to 200px
state.isActive = false;  // Box becomes inactive
```

---

### Binding with Computed Values

**Example:**
```javascript
const state = ReactiveState.create({
  firstName: 'John',
  lastName: 'Doe',
  age: 25
});

// HTML: <span id="fullName"></span>
//       <span id="canVote"></span>

Elements.bind({
  fullName: () => `${state.firstName} ${state.lastName}`,
  canVote: () => state.age >= 18 ? 'Yes' : 'No'
});

// Updates automatically
state.firstName = 'Jane';  // Shows "Jane Doe"
state.age = 17;  // Shows "No"
```

---

### Binding to Multiple Properties

**Example:**
```javascript
const state = ReactiveState.create({
  title: 'Dashboard',
  theme: 'dark',
  online: true
});

// HTML: <div id="header"></div>

Elements.bind({
  header: {
    textContent: () => state.title,
    className: () => `header theme-${state.theme}`,
    dataset: () => ({
      online: state.online,
      theme: state.theme
    })
  }
});
```

---

## Binding to Collections

### Collections.bind(bindings)

Bind reactive functions to all elements with a specific class name.

**Parameters:**
- `bindings` (Object): Object where keys are class names and values are binding functions

**Returns:** undefined

**Example:**
```javascript
const state = ReactiveState.create({
  items: [
    { id: 1, name: 'Apple', price: 1.5 },
    { id: 2, name: 'Banana', price: 0.8 }
  ]
});

// HTML: <div class="item-card" data-index="0"></div>
//       <div class="item-card" data-index="1"></div>

Collections.bind({
  'item-card': function() {
    const index = parseInt(this.dataset.index);
    const item = state.items[index];
    
    if (item) {
      return `${item.name} - $${item.price}`;
    }
    return '';
  }
});

// Update item
state.items[0].price = 2.0;  // All item-card elements update
```

---

### Binding Collections to Specific Properties

**Example:**
```javascript
const state = ReactiveState.create({
  buttonColor: 'blue',
  disabled: false
});

// HTML: <button class="action-btn">Button 1</button>
//       <button class="action-btn">Button 2</button>

Collections.bind({
  'action-btn': {
    style: () => ({
      backgroundColor: state.buttonColor,
      opacity: state.disabled ? 0.5 : 1
    }),
    disabled: () => state.disabled
  }
});

// Update all buttons at once
state.buttonColor = 'green';
state.disabled = true;
```

---

## Binding with Selectors

### Selector.query.bind(bindings)

Bind reactive functions to the first element matching a CSS selector.

**Parameters:**
- `bindings` (Object): Object where keys are CSS selectors and values are binding functions

**Returns:** undefined

**Example:**
```javascript
const state = ReactiveState.create({
  headerText: 'Welcome',
  theme: 'light'
});

// Bind to first matching element
Selector.query.bind({
  '.page-header': () => state.headerText,
  '#theme-indicator': () => `Theme: ${state.theme}`
});

// Updates the first .page-header element
state.headerText = 'Hello!';
```

---

### Selector.queryAll.bind(bindings)

Bind reactive functions to all elements matching a CSS selector.

**Parameters:**
- `bindings` (Object): Object where keys are CSS selectors and values are binding functions

**Returns:** undefined

**Example:**
```javascript
const state = ReactiveState.create({
  highlightColor: 'yellow',
  showAll: true
});

// Bind to all matching elements
Selector.queryAll.bind({
  '.highlight': {
    style: () => ({
      backgroundColor: state.highlightColor,
      display: state.showAll ? 'block' : 'none'
    })
  },
  '.status-badge': () => state.showAll ? 'Visible' : 'Hidden'
});

// Updates all matching elements
state.highlightColor = 'lightblue';
state.showAll = false;
```

---

## Reactive Arrays

Arrays in reactive state automatically track changes from array methods.

### Array Methods Support

All mutating array methods trigger updates:
- `push()`, `pop()`
- `shift()`, `unshift()`
- `splice()`
- `sort()`, `reverse()`

**Example:**
```javascript
const state = ReactiveState.create({
  todos: [
    { id: 1, text: 'Learn React', done: false },
    { id: 2, text: 'Build App', done: false }
  ]
});

// HTML: <ul id="todoList"></ul>

Elements.bind({
  todoList: {
    innerHTML: () => {
      return state.todos
        .map(todo => `
          <li class="${todo.done ? 'done' : ''}">
            ${todo.text}
          </li>
        `)
        .join('');
    }
  }
});

// Array operations trigger updates
state.todos.push({ id: 3, text: 'Deploy', done: false });
state.todos[0].done = true;
state.todos.splice(1, 1);  // Remove item at index 1
```

---

### Array Length Binding

**Example:**
```javascript
const state = ReactiveState.create({
  items: ['apple', 'banana', 'orange']
});

// HTML: <span id="itemCount"></span>

Elements.bind({
  itemCount: () => `Total: ${state.items.length}`
});

// Length updates automatically
state.items.push('grape');  // Shows "Total: 4"
state.items.pop();          // Shows "Total: 3"
```

---

### Iterating Over Reactive Arrays

**Example:**
```javascript
const state = ReactiveState.create({
  users: [
    { name: 'John', age: 25 },
    { name: 'Jane', age: 30 }
  ]
});

// HTML: <div id="userList"></div>

Elements.bind({
  userList: {
    innerHTML: () => {
      return state.users
        .map(user => `<div>${user.name} (${user.age})</div>`)
        .join('');
    }
  }
});

// Add user
state.users.push({ name: 'Bob', age: 35 });

// Update user
state.users[0].age = 26;

// Remove user
state.users.shift();
```

---

## Nested Objects

Reactive state works with deeply nested objects.

### Nested Object Reactivity

**Example:**
```javascript
const state = ReactiveState.create({
  user: {
    profile: {
      name: 'John',
      address: {
        city: 'New York',
        zip: '10001'
      }
    },
    settings: {
      theme: 'dark',
      notifications: true
    }
  }
});

// HTML: <div id="userInfo"></div>

Elements.bind({
  userInfo: {
    innerHTML: () => `
      <h2>${state.user.profile.name}</h2>
      <p>City: ${state.user.profile.address.city}</p>
      <p>Theme: ${state.user.settings.theme}</p>
    `
  }
});

// Deep updates work
state.user.profile.name = 'Jane';
state.user.profile.address.city = 'Boston';
state.user.settings.theme = 'light';
```

---

### Adding Nested Properties

**Example:**
```javascript
const state = ReactiveState.create({
  config: {}
});

// Add nested properties dynamically
state.config.api = {
  url: 'https://api.example.com',
  key: 'abc123'
};

state.config.features = {
  search: true,
  filters: true
};

// All nested properties are reactive
Elements.bind({
  apiUrl: () => state.config.api?.url || 'No URL'
});
```

---

## Dependency Tracking

The reactive system automatically tracks dependencies.

### Automatic Dependency Detection

**Example:**
```javascript
const state = ReactiveState.create({
  a: 1,
  b: 2,
  c: 3
});

// HTML: <div id="sum"></div>
//       <div id="product"></div>

Elements.bind({
  // Only re-runs when a or b changes
  sum: () => state.a + state.b,
  
  // Only re-runs when b or c changes
  product: () => state.b * state.c
});

state.a = 5;  // Only updates 'sum'
state.b = 10; // Updates both 'sum' and 'product'
state.c = 7;  // Only updates 'product'
```

---

### Conditional Dependencies

**Example:**
```javascript
const state = ReactiveState.create({
  showDetails: false,
  name: 'John',
  email: 'john@example.com'
});

// HTML: <div id="info"></div>

Elements.bind({
  info: () => {
    if (state.showDetails) {
      // Depends on name and email when showDetails is true
      return `${state.name} - ${state.email}`;
    } else {
      // Only depends on name when showDetails is false
      return state.name;
    }
  }
});

// Dependencies change based on condition
state.showDetails = true;
state.email = 'jane@example.com';  // Now triggers update
```

---

## Unbinding

Remove reactive bindings when no longer needed.

### Elements.unbind(id)

Unbind all bindings for an element by ID.

**Parameters:**
- `id` (string): Element ID

**Returns:** undefined

**Example:**
```javascript
const state = ReactiveState.create({
  count: 0
});

// Bind
Elements.bind({
  counter: () => state.count
});

// Later, unbind
Elements.unbind('counter');

// Updates no longer affect the element
state.count = 100;  // Element doesn't update
```

---

### Collections.unbind(className)

Unbind all bindings for elements with a class name.

**Parameters:**
- `className` (string): Class name

**Returns:** undefined

**Example:**
```javascript
const state = ReactiveState.create({
  message: 'Hello'
});

// Bind
Collections.bind({
  'status-text': () => state.message
});

// Later, unbind
Collections.unbind('status-text');
```

---

### Selector.query.unbind(selector) / Selector.queryAll.unbind(selector)

Unbind all bindings for elements matching a selector.

**Parameters:**
- `selector` (string): CSS selector

**Returns:** undefined

**Example:**
```javascript
// Bind
Selector.queryAll.bind({
  '.card': () => state.content
});

// Later, unbind
Selector.queryAll.unbind('.card');
```

---

### Automatic Cleanup

Bindings are automatically cleaned up when elements are removed from the DOM.

**Example:**
```javascript
const state = ReactiveState.create({
  message: 'Hello'
});

// Create and bind element
const div = document.createElement('div');
div.id = 'temp';
document.body.appendChild(div);

Elements.bind({
  temp: () => state.message
});

// Remove element - binding is automatically cleaned up
div.remove();

// Updates no longer happen
state.message = 'Goodbye';  // No update (element removed)
```

---

## Advanced Patterns

### Computed Properties

**Example:**
```javascript
const state = ReactiveState.create({
  items: [
    { name: 'Apple', price: 1.5, quantity: 2 },
    { name: 'Banana', price: 0.8, quantity: 5 }
  ]
});

// HTML: <div id="total"></div>
//       <div id="itemCount"></div>

Elements.bind({
  total: () => {
    const total = state.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    return `Total: $${total.toFixed(2)}`;
  },
  
  itemCount: () => {
    const count = state.items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);
    return `Items: ${count}`;
  }
});

// Add item
state.items.push({ name: 'Orange', price: 1.2, quantity: 3 });

// Update quantity
state.items[0].quantity = 5;
```

---

### Conditional Rendering

**Example:**
```javascript
const state = ReactiveState.create({
  isLoggedIn: false,
  username: '',
  isLoading: false
});

// HTML: <div id="authStatus"></div>

Elements.bind({
  authStatus: {
    innerHTML: () => {
      if (state.isLoading) {
        return '<div class="spinner">Loading...</div>';
      }
      
      if (state.isLoggedIn) {
        return `<div>Welcome, ${state.username}!</div>`;
      }
      
      return '<div>Please log in</div>';
    }
  }
});

// Change state
state.isLoading = true;
setTimeout(() => {
  state.isLoading = false;
  state.isLoggedIn = true;
  state.username = 'John';
}, 1000);
```

---

### List Filtering

**Example:**
```javascript
const state = ReactiveState.create({
  items: [
    { id: 1, name: 'Apple', category: 'fruit' },
    { id: 2, name: 'Carrot', category: 'vegetable' },
    { id: 3, name: 'Banana', category: 'fruit' }
  ],
  filter: 'all'  // 'all', 'fruit', 'vegetable'
});

// HTML: <ul id="itemList"></ul>
//       <div id="filterButtons"></div>

Elements.bind({
  itemList: {
    innerHTML: () => {
      const filtered = state.filter === 'all' 
        ? state.items 
        : state.items.filter(item => item.category === state.filter);
      
      return filtered
        .map(item => `<li>${item.name} (${item.category})</li>`)
        .join('');
    }
  }
});

// Change filter
state.filter = 'fruit';  // Shows only fruits
state.filter = 'all';     // Shows all items
```

---

### Form Binding

**Example:**
```javascript
const state = ReactiveState.create({
  formData: {
    name: '',
    email: '',
    age: 0
  },
  errors: {}
});

// HTML: <input id="nameInput" />
//       <input id="emailInput" />
//       <input id="ageInput" type="number" />
//       <div id="formSummary"></div>

// Bind inputs to state
document.getElementById('nameInput').addEventListener('input', (e) => {
  state.formData.name = e.target.value;
});

document.getElementById('emailInput').addEventListener('input', (e) => {
  state.formData.email = e.target.value;
});

document.getElementById('ageInput').addEventListener('input', (e) => {
  state.formData.age = parseInt(e.target.value) || 0;
});

// Show form summary
Elements.bind({
  formSummary: {
    innerHTML: () => `
      <h3>Form Data:</h3>
      <p>Name: ${state.formData.name || '(empty)'}</p>
      <p>Email: ${state.formData.email || '(empty)'}</p>
      <p>Age: ${state.formData.age || '0'}</p>
    `
  }
});
```

---

### Toggle States

**Example:**
```javascript
const state = ReactiveState.create({
  isDarkMode: false,
  sidebarOpen: false,
  notificationsEnabled: true
});

// HTML: <body id="app"></body>
//       <button id="toggleTheme">Toggle Theme</button>
//       <button id="toggleSidebar">Toggle Sidebar</button>

Elements.bind({
  app: {
    className: () => {
      const classes = [];
      if (state.isDarkMode) classes.push('dark-mode');
      if (state.sidebarOpen) classes.push('sidebar-open');
      return classes.join(' ');
    }
  },
  
  toggleTheme: {
    textContent: () => state.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'
  },
  
  toggleSidebar: {
    textContent: () => state.sidebarOpen ? '← Close' : 'Menu →'
  }
});

// Add event listeners
document.getElementById('toggleTheme').addEventListener('click', () => {
  state.isDarkMode = !state.isDarkMode;
});

document.getElementById('toggleSidebar').addEventListener('click', () => {
  state.sidebarOpen = !state.sidebarOpen;
});
```

---

## Complete Examples

### Example 1: Counter App

```javascript
// Create state
const state = ReactiveState.create({
  count: 0
});

// HTML:
// <div id="counter"></div>
// <button id="increment">+</button>
// <button id="decrement">-</button>
// <button id="reset">Reset</button>

// Bind counter display
Elements.bind({
  counter: {
    textContent: () => state.count,
    style: () => ({
      color: state.count > 0 ? 'green' : state.count < 0 ? 'red' : 'black',
      fontSize: '48px',
      fontWeight: 'bold'
    })
  }
});

// Add event listeners
document.getElementById('increment').addEventListener('click', () => {
  state.count++;
});

document.getElementById('decrement').addEventListener('click', () => {
  state.count--;
});

document.getElementById('reset').addEventListener('click', () => {
  state.count = 0;
});
```

---

### Example 2: Todo List

```javascript
const state = ReactiveState.create({
  todos: [],
  newTodo: '',
  filter: 'all' // 'all', 'active', 'completed'
});

// HTML:
// <input id="todoInput" placeholder="Add todo..." />
// <button id="addTodo">Add</button>
// <div id="filterButtons"></div>
// <ul id="todoList"></ul>
// <div id="stats"></div>

// Bind todo list
Elements.bind({
  todoList: {
    innerHTML: () => {
      let filtered = state.todos;
      
      if (state.filter === 'active') {
        filtered = state.todos.filter(t => !t.completed);
      } else if (state.filter === 'completed') {
        filtered = state.todos.filter(t => t.completed);
      }
      
      if (filtered.length === 0) {
        return '<li class="empty">No todos</li>';
      }
      
      return filtered
        .map((todo, index) => `
          <li class="${todo.completed ? 'completed' : ''}">
            <input 
              type="checkbox" 
              ${todo.completed ? 'checked' : ''}
              onchange="toggleTodo(${index})"
            />
            <span>${todo.text}</span>
            <button onclick="deleteTodo(${index})">Delete</button>
          </li>
        `)
        .join('');
    }
  },
  
  stats: {
    textContent: () => {
      const total = state.todos.length;
      const active = state.todos.filter(t => !t.completed).length;
      const completed = state.todos.filter(t => t.completed).length;
      return `Total: ${total} | Active: ${active} | Completed: ${completed}`;
    }
  },
  
  filterButtons: {
    innerHTML: () => {
      const filters = ['all', 'active', 'completed'];
      return filters
        .map(f => `
          <button 
            class="${state.filter === f ? 'active' : ''}"
            onclick="state.filter = '${f}'"
          >
            ${f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        `)
        .join('');
    }
  }
});

// Bind input
const todoInput = document.getElementById('todoInput');
todoInput.addEventListener('input', (e) => {
  state.newTodo = e.target.value;
});

// Add todo
document.getElementById('addTodo').addEventListener('click', () => {
  if (state.newTodo.trim()) {
    state.todos.push({
      text: state.newTodo.trim(),
      completed: false,
      id: Date.now()
    });
    state.newTodo = '';
    todoInput.value = '';
  }
});

// Global functions for todo operations
window.toggleTodo = (index) => {
  state.todos[index].completed = !state.todos[index].completed;
};

window.deleteTodo = (index) => {
  state.todos.splice(index, 1);
};
```

---

### Example 3: Shopping Cart

```javascript
const state = ReactiveState.create({
  cart: [],
  products: [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Mouse', price: 29.99 },
    { id: 3, name: 'Keyboard', price: 79.99 }
  ]
});

// HTML:
// <div id="products"></div>
// <div id="cart"></div>
// <div id="total"></div>

Elements.bind({
  products: {
    innerHTML: () => {
      return state.products
        .map(product => `
          <div class="product">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">
              Add to Cart
            </button>
          </div>
        `)
        .join('');
    }
  },
  
  cart: {
    innerHTML: () => {
      if (state.cart.length === 0) {
        return '<p>Cart is empty</p>';
      }
      
      return state.cart
        .map((item, index) => {
          const product = state.products.find(p => p.id === item.productId);
          return `
            <div class="cart-item">
              <span>${product.name}</span>
              <span>$${product.price.toFixed(2)} x ${item.quantity}</span>
              <span>$${(product.price * item.quantity).toFixed(2)}</span>
              <button onclick="removeFromCart(${index})">Remove</button>
            </div>
          `;
        })
        .join('');
    }
  },
  
  total: {
    textContent: () => {
      const total = state.cart.reduce((sum, item) => {
        const product = state.products.find(p => p.id === item.productId);
        return sum + (product.price * item.quantity);
      }, 0);
      return `Total: $${total.toFixed(2)}`;
    }
  }
});

// Add to cart
window.addToCart = (productId) => {
  const existingItem = state.cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    state.cart.push({
      productId,
      quantity: 1
    });
  }
};

// Remove from cart
window.removeFromCart = (index) => {
  state.cart.splice(index, 1);
};
```

---

### Example 4: Real-Time Search

```javascript
const state = ReactiveState.create({
  searchQuery: '',
  items: [
    { id: 1, name: 'Apple', category: 'Fruit' },
    { id: 2, name: 'Banana', category: 'Fruit' },
    { id: 3, name: 'Carrot', category: 'Vegetable' },
    { id: 4, name: 'Date', category: 'Fruit' },
    { id: 5, name: 'Eggplant', category: 'Vegetable' }
  ],
  selectedCategory: 'all'
});

// HTML:
// <input id="searchInput" placeholder="Search..." />
// <select id="categoryFilter">
//   <option value="all">All</option>
//   <option value="Fruit">Fruit</option>
//   <option value="Vegetable">Vegetable</option>
// </select>
// <div id="results"></div>
// <div id="count"></div>

// Bind search input
document.getElementById('searchInput').addEventListener('input', (e) => {
  state.searchQuery = e.target.value.toLowerCase();
});

// Bind category filter
document.getElementById('categoryFilter').addEventListener('change', (e) => {
  state.selectedCategory = e.target.value;
});

// Bind results
Elements.bind({
  results: {
    innerHTML: () => {
      let filtered = state.items;
      
      // Filter by category
      if (state.selectedCategory !== 'all') {
        filtered = filtered.filter(item => 
          item.category === state.selectedCategory
        );
      }
      
      // Filter by search query
      if (state.searchQuery) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(state.searchQuery)
        );
      }
      
      if (filtered.length === 0) {
        return '<div>No results found</div>';
      }
      
      return filtered
        .map(item => `
          <div class="result-item">
            <strong>${item.name}</strong>
            <span class="category">${item.category}</span>
          </div>
        `)
        .join('');
    }
  },
  
  count: {
    textContent: () => {
      let filtered = state.items;
      
      if (state.selectedCategory !== 'all') {
        filtered = filtered.filter(item => 
          item.category === state.selectedCategory
        );
      }
      
      if (state.searchQuery) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(state.searchQuery)
        );
      }
      
      return `Found ${filtered.length} items`;
    }
  }
});
```

---

### Example 5: Dashboard with Live Stats

```javascript
const state = ReactiveState.create({
  stats: {
    users: 1250,
    sales: 45230.50,
    orders: 892,
    revenue: 125000
  },
  isUpdating: false,
  lastUpdate: Date.now()
});

// HTML:
// <div id="userCount"></div>
// <div id="salesCount"></div>
// <div id="ordersCount"></div>
// <div id="revenueCount"></div>
// <div id="updateStatus"></div>

Elements.bind({
  userCount: {
    textContent: () => state.stats.users.toLocaleString(),
    className: () => state.isUpdating ? 'stat updating' : 'stat'
  },
  
  salesCount: {
    textContent: () => `$${state.stats.sales.toFixed(2)}`,
    className: () => state.isUpdating ? 'stat updating' : 'stat'
  },
  
  ordersCount: {
    textContent: () => state.stats.orders.toLocaleString(),
    className: () => state.isUpdating ? 'stat updating' : 'stat'
  },
  
  revenueCount: {
    textContent: () => `$${(state.stats.revenue / 1000).toFixed(1)}K`,
    className: () => state.isUpdating ? 'stat updating' : 'stat'
  },
  
  updateStatus: {
    textContent: () => {
      const elapsed = Math.floor((Date.now() - state.lastUpdate) / 1000);
      return state.isUpdating 
        ? 'Updating...' 
        : `Last updated ${elapsed}s ago`;
    }
  }
});

// Simulate live updates
setInterval(() => {
  state.isUpdating = true;
  
  setTimeout(() => {
    state.stats.users += Math.floor(Math.random() * 10);
    state.stats.sales += Math.random() * 1000;
    state.stats.orders += Math.floor(Math.random() * 5);
    state.stats.revenue += Math.random() * 5000;
    state.lastUpdate = Date.now();
    state.isUpdating = false;
  }, 500);
}, 5000);
```

---

## Best Practices

1. **Keep State Simple** - Use flat structures when possible
2. **Minimize Computations** - Binding functions are called on every state change they depend on
3. **Use Specific Bindings** - Bind to specific properties rather than entire objects when possible
4. **Clean Up** - Unbind when elements are no longer needed (or rely on automatic cleanup)
5. **Avoid Side Effects** - Binding functions should be pure (no side effects)
6. **Use Computed Values** - Create computed properties in binding functions rather than in state
7. **Batch Updates** - Update multiple properties in quick succession; the system will optimize updates

---

## Performance Tips

1. **Dependency Tracking** - Only properties actually accessed in bindings will trigger updates
2. **Fine-Grained Updates** - Only changed values trigger DOM updates
3. **Automatic Cleanup** - Removed elements are automatically cleaned up via MutationObserver
4. **Deep Comparison** - Values are compared before updating to prevent unnecessary DOM changes
5. **Batch Operations** - Multiple array operations can be batched for better performance

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required (Proxy, WeakMap)
- MutationObserver support required

---

## Integration with Main Library

The Reactive module seamlessly integrates with the main DOM Helpers library:

```javascript
// Use with Elements
const state = Elements.state({ count: 0 });
Elements.bind({ counter: () => state.count });

// Use with Collections
Collections.bind({
  'stat-card': () => state.value
});

// Use with Selector
Selector.queryAll.bind({
  '.reactive': () => state.data
});

// Use with Forms
const form = Forms.myForm;
form.values = state.formData;
```

---

## Troubleshooting

### Binding not updating
```javascript
// Ensure the property is actually accessed in the binding
Elements.bind({
  counter: () => state.count  // ✓ Accesses state.count
});

// Not just returned
Elements.bind({
  counter: () => state  // ✗ Doesn't access specific property
});
```

### Updates triggering too often
```javascript
// Use specific property bindings
Elements.bind({
  box: {
    style: () => ({ color: state.color }),  // Only updates on color change
    textContent: () => state.text            // Only updates on text change
  }
});
```

### Array not updating
```javascript
// Use array methods, not direct assignment
state.items.push(newItem);  // ✓ Triggers update
state.items = [...state.items, newItem];  // ✓ Also works

// Modifying array items
state.items[0].name = 'New';  // ✓ Triggers update (nested reactivity)
```

---

## Comparison with Other Solutions

### vs Vue Reactivity
- Similar Proxy-based approach
- Automatic dependency tracking
- DOM Helpers is more lightweight and focused on DOM updates

### vs React useState
- No need for setState calls
- Direct property mutations
- Automatic updates without re-rendering entire components

### vs Svelte Reactivity
- Similar automatic reactivity
- Works with existing DOM instead of compiled components
- More explicit binding syntax

---

## License

MIT License - See LICENSE file for details

---

## Support

For issues, questions, or contributions, visit the GitHub repository.

---

**End of Documentation**

