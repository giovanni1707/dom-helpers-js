# DOM Helpers Enhancers - Complete Beginner to Advanced Guide

## 📚 Table of Contents
1. [What is the Enhancers Module?](#what-is-the-enhancers-module)
2. [Getting Started](#getting-started)
3. [Beginner Level - Basic Updates](#beginner-level---basic-updates)
4. [Intermediate Level - Bulk Operations](#intermediate-level---bulk-operations)
5. [Advanced Level - Index-Based Updates](#advanced-level---index-based-updates)
6. [Expert Level - Complex Patterns](#expert-level---complex-patterns)
7. [Real-World Examples](#real-world-examples)
8. [Common Mistakes & Solutions](#common-mistakes--solutions)

---

## What is the Enhancers Module?

### Simple Explanation
Imagine you have a webpage with many buttons, text fields, and images. Normally, to change them, you'd write code like this for EACH element:

```javascript
// The old, repetitive way 😓
document.getElementById('button1').textContent = 'Click Me';
document.getElementById('button2').textContent = 'Submit';
document.getElementById('button3').textContent = 'Cancel';
```

The Enhancers module lets you update MULTIPLE elements at once:

```javascript
// The new, easy way! 😊
Elements.textContent({
  button1: 'Click Me',
  button2: 'Submit',
  button3: 'Cancel'
});
```

### What Does It Do?
The Enhancers module adds special "bulk update" methods that let you:
- **Update many elements at once** instead of one by one
- **Write less code** - save time and reduce errors
- **Keep your code organized** - all related updates in one place
- **Update by ID, class, or tag** - flexible and powerful

---

## Getting Started

### Prerequisites
Make sure you have the DOM Helpers library loaded:

```html
<script src="01_dh-core.js"></script>
<script src="02_dh-enhancers.js"></script>
```

### Your First Enhancement
Let's start with the simplest example. Suppose you have these buttons:

```html
<button id="saveBtn">Old Text</button>
<button id="cancelBtn">Old Text</button>
<button id="deleteBtn">Old Text</button>
```

**Traditional way (boring and repetitive):**
```javascript
document.getElementById('saveBtn').textContent = 'Save';
document.getElementById('cancelBtn').textContent = 'Cancel';
document.getElementById('deleteBtn').textContent = 'Delete';
```

**Enhancers way (clean and simple):**
```javascript
Elements.textContent({
  saveBtn: 'Save',
  cancelBtn: 'Cancel',
  deleteBtn: 'Delete'
});
```

**Result:** All three buttons update at once! ✨

---

## Beginner Level - Basic Updates

### 1. Changing Text Content

#### What is Text Content?
Text content is the text you see inside an element. Not HTML tags, just plain text.

#### HTML Setup:
```html
<h1 id="pageTitle">Loading...</h1>
<p id="description">Please wait...</p>
<span id="status">Connecting...</span>
```

#### Using `.textContent()`
```javascript
// Update all three elements at once
Elements.textContent({
  pageTitle: 'Welcome!',
  description: 'Your dashboard is ready',
  status: 'Connected'
});
```

**What happened?**
1. Found element with id="pageTitle" → Changed text to "Welcome!"
2. Found element with id="description" → Changed text to "Your dashboard is ready"
3. Found element with id="status" → Changed text to "Connected"

---

### 2. Changing HTML Content

#### What is HTML Content?
HTML content includes tags like `<strong>`, `<em>`, `<span>`, etc.

#### HTML Setup:
```html
<div id="message">Old message</div>
<div id="alert">Old alert</div>
```

#### Using `.innerHTML()`
```javascript
Elements.innerHTML({
  message: '<strong>Important:</strong> Please read this',
  alert: '<em>Warning:</em> Check your email'
});
```

**Result:**
- `message` now shows: **Important:** Please read this
- `alert` now shows: *Warning:* Check your email

---

### 3. Changing Input Values

#### What are Input Values?
Input values are what users type into text boxes, or what appears in them.

#### HTML Setup:
```html
<input id="username" type="text">
<input id="email" type="email">
<input id="phone" type="tel">
```

#### Using `.value()`
```javascript
// Fill in the form automatically
Elements.value({
  username: 'john_doe',
  email: 'john@example.com',
  phone: '555-1234'
});
```

**Perfect for:**
- Pre-filling forms
- Loading saved data
- Auto-completing fields

---

### 4. Changing Placeholders

#### What are Placeholders?
Placeholders are the gray hint text inside empty input fields.

#### HTML Setup:
```html
<input id="searchBox" type="text">
<input id="emailInput" type="email">
<input id="passwordInput" type="password">
```

#### Using `.placeholder()`
```javascript
Elements.placeholder({
  searchBox: 'Search products...',
  emailInput: 'Enter your email',
  passwordInput: 'Min 8 characters'
});
```

**Result:** Each input now shows helpful hint text!

---

### 5. Hiding and Showing Elements

#### HTML Setup:
```html
<div id="errorMessage">Error!</div>
<div id="successMessage">Success!</div>
<div id="loadingSpinner">Loading...</div>
```

#### Using `.hidden()`
```javascript
// true = hide, false = show
Elements.hidden({
  errorMessage: true,      // Hide error
  successMessage: false,   // Show success
  loadingSpinner: true     // Hide spinner
});
```

**Common Pattern:**
```javascript
// Show loading, hide messages
Elements.hidden({
  loadingSpinner: false,
  errorMessage: true,
  successMessage: true
});

// After loading: show success, hide loading
Elements.hidden({
  loadingSpinner: true,
  errorMessage: true,
  successMessage: false
});
```

---

### 6. Enabling and Disabling Buttons

#### HTML Setup:
```html
<button id="submitBtn">Submit</button>
<button id="saveBtn">Save</button>
<button id="cancelBtn">Cancel</button>
```

#### Using `.disabled()`
```javascript
// true = disabled (can't click), false = enabled (can click)
Elements.disabled({
  submitBtn: true,    // Disable submit
  saveBtn: false,     // Enable save
  cancelBtn: false    // Enable cancel
});
```

**Real-World Example:**
```javascript
// When form is being submitted
Elements.disabled({
  submitBtn: true,
  saveBtn: true
});

Elements.textContent({
  submitBtn: 'Submitting...'
});

// After submission completes
Elements.disabled({
  submitBtn: false,
  saveBtn: false
});

Elements.textContent({
  submitBtn: 'Submit'
});
```

---

### 7. Changing Images

#### HTML Setup:
```html
<img id="avatar" src="default.jpg" alt="Old alt">
<img id="banner" src="default.jpg" alt="Old alt">
<img id="logo" src="default.jpg" alt="Old alt">
```

#### Using `.src()` and `.alt()`
```javascript
// Change image sources
Elements.src({
  avatar: 'users/john.jpg',
  banner: 'images/hero.jpg',
  logo: 'images/logo.png'
});

// Change alt text (for accessibility)
Elements.alt({
  avatar: 'John Doe profile picture',
  banner: 'Hero banner showing office',
  logo: 'Company Logo'
});
```

---

### 8. Changing Links

#### HTML Setup:
```html
<a id="homeLink" href="#">Home</a>
<a id="profileLink" href="#">Profile</a>
<a id="logoutLink" href="#">Logout</a>
```

#### Using `.href()`
```javascript
Elements.href({
  homeLink: '/dashboard',
  profileLink: '/user/profile',
  logoutLink: '/logout'
});
```

---

## Intermediate Level - Bulk Operations

### 1. Styling Multiple Elements

#### What are Styles?
Styles control how elements look: colors, sizes, spacing, etc.

#### HTML Setup:
```html
<div id="header">Header</div>
<div id="sidebar">Sidebar</div>
<div id="footer">Footer</div>
```

#### Using `.style()`
```javascript
Elements.style({
  header: {
    backgroundColor: '#333',
    color: 'white',
    padding: '20px',
    fontSize: '24px'
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f0f0f0',
    padding: '15px'
  },
  footer: {
    textAlign: 'center',
    padding: '10px',
    color: '#666'
  }
});
```

**Each element gets its own style object!**

#### Single Property Across Many Elements:
```javascript
// Make all boxes the same height
Elements.style({
  box1: { height: '200px' },
  box2: { height: '200px' },
  box3: { height: '200px' }
});
```

---

### 2. Managing Classes

#### What are Classes?
Classes are CSS class names that apply pre-defined styles.

#### HTML Setup:
```html
<button id="btn1" class="old-class">Button 1</button>
<button id="btn2" class="">Button 2</button>
<button id="btn3" class="some-class">Button 3</button>
```

#### Using `.classes()`

**Add Classes:**
```javascript
Elements.classes({
  btn1: { add: 'active' },
  btn2: { add: ['primary', 'large'] },  // Multiple classes
  btn3: { add: 'highlight' }
});
```

**Remove Classes:**
```javascript
Elements.classes({
  btn1: { remove: 'old-class' },
  btn2: { remove: ['unwanted', 'old'] },
  btn3: { remove: 'some-class' }
});
```

**Toggle Classes:**
```javascript
// Toggle means: if it has the class, remove it. If not, add it.
Elements.classes({
  btn1: { toggle: 'active' },
  btn2: { toggle: 'selected' }
});
```

**Replace Classes:**
```javascript
Elements.classes({
  btn1: { replace: ['old-theme', 'new-theme'] }
  // Removes 'old-theme', adds 'new-theme'
});
```

**Set Entire ClassName:**
```javascript
// Replace ALL classes at once
Elements.classes({
  btn1: 'btn primary large active',
  btn2: 'btn secondary small',
  btn3: 'btn danger'
});
```

**Combine Operations:**
```javascript
Elements.classes({
  btn1: {
    add: ['active', 'primary'],
    remove: 'disabled'
  },
  btn2: {
    toggle: 'selected',
    add: 'highlight'
  }
});
```

---

### 3. Working with Data Attributes

#### What are Data Attributes?
Custom attributes that store extra information on elements (start with `data-`).

#### HTML Setup:
```html
<div id="userCard">User</div>
<div id="productCard">Product</div>
<div id="orderCard">Order</div>
```

#### Using `.dataset()`
```javascript
Elements.dataset({
  userCard: {
    userId: '12345',
    userName: 'John Doe',
    userRole: 'admin'
  },
  productCard: {
    productId: 'ABC-123',
    price: '99.99',
    inStock: 'true'
  },
  orderCard: {
    orderId: 'ORD-789',
    status: 'shipped',
    total: '299.99'
  }
});
```

**Result HTML:**
```html
<div id="userCard" 
     data-user-id="12345" 
     data-user-name="John Doe"
     data-user-role="admin">User</div>

<div id="productCard" 
     data-product-id="ABC-123" 
     data-price="99.99"
     data-in-stock="true">Product</div>
```

**Accessing Data Later:**
```javascript
// Read the data
const userId = Elements.userCard.dataset.userId;  // "12345"
const price = Elements.productCard.dataset.price;  // "99.99"
```

---

### 4. Managing Attributes

#### What are Attributes?
Attributes are properties on HTML elements like `disabled`, `href`, `target`, etc.

#### HTML Setup:
```html
<button id="submitBtn">Submit</button>
<a id="externalLink" href="#">Link</a>
<input id="emailField" type="email">
```

#### Using `.attrs()`

**Set Attributes:**
```javascript
Elements.attrs({
  submitBtn: {
    disabled: true,
    'aria-label': 'Submit form',
    title: 'Click to submit'
  },
  externalLink: {
    href: 'https://example.com',
    target: '_blank',
    rel: 'noopener noreferrer'
  },
  emailField: {
    required: true,
    placeholder: 'Enter email',
    maxlength: '100'
  }
});
```

**Remove Attributes:**
```javascript
// Set to null or false to remove
Elements.attrs({
  submitBtn: {
    disabled: null  // Remove disabled attribute
  },
  emailField: {
    required: false  // Remove required attribute
  }
});
```

---

### 5. Generic Property Updates

#### What is `.prop()`?
A powerful method that can update ANY property on elements, even nested ones.

#### Basic Usage:
```javascript
// Update simple properties
Elements.prop('disabled', {
  btn1: true,
  btn2: false,
  btn3: true
});
```

#### Nested Properties (Dot Notation):
```javascript
// Update nested properties like style.color
Elements.prop('style.color', {
  title: 'red',
  subtitle: 'blue',
  footer: 'gray'
});

// Update dataset properties
Elements.prop('dataset.userId', {
  card1: '123',
  card2: '456'
});
```

**When to Use `.prop()`:**
- When no specific method exists
- For nested properties
- For custom element properties

---

## Advanced Level - Index-Based Updates

### Understanding Collections

#### What is a Collection?
A collection is a group of elements that share something in common:
- **Same class:** All elements with class="button"
- **Same tag:** All `<div>` elements
- **Same name:** All inputs with name="email"

#### HTML Setup:
```html
<button class="action-btn">Button 1</button>
<button class="action-btn">Button 2</button>
<button class="action-btn">Button 3</button>
<button class="action-btn">Button 4</button>
```

### Accessing Collections

**Get all buttons with class "action-btn":**
```javascript
const buttons = ClassName['action-btn'];
// or
const buttons = ClassName('action-btn');

console.log(buttons.length);  // 4
```

---

### Index-Based Updates

#### What is an Index?
An index is the position of an element in a collection:
- Index 0 = First element
- Index 1 = Second element
- Index 2 = Third element
- Index -1 = Last element
- Index -2 = Second to last element

#### Accessing Individual Elements:
```javascript
const buttons = ClassName['action-btn'];

// Get individual buttons
const firstButton = buttons[0];
const secondButton = buttons[1];
const lastButton = buttons[-1];  // Negative index!
```

#### Updating by Index:
```javascript
// Update specific buttons
buttons.textContent({
  0: 'First Button',
  1: 'Second Button',
  2: 'Third Button',
  [-1]: 'Last Button'  // Negative index supported!
});
```

**Result:**
```html
<button class="action-btn">First Button</button>
<button class="action-btn">Second Button</button>
<button class="action-btn">Third Button</button>
<button class="action-btn">Last Button</button>
```

---

### Mixed Updates (Bulk + Index)

#### The Power of Mixing
You can update ALL elements AND specific elements at the same time!

#### Example:
```html
<div class="card">Card 1</div>
<div class="card">Card 2</div>
<div class="card">Card 3</div>
<div class="card">Card 4</div>
```

```javascript
ClassName.card.update({
  // This applies to ALL cards
  style: { 
    padding: '20px',
    border: '1px solid #ddd'
  },
  
  // These apply to specific cards
  0: {
    textContent: 'Featured Card',
    style: { backgroundColor: 'gold' }
  },
  1: {
    textContent: 'Special Offer',
    style: { backgroundColor: 'lightblue' }
  },
  [-1]: {
    textContent: 'Last Card',
    style: { backgroundColor: 'lightgreen' }
  }
});
```

**What Happened:**
1. **ALL cards** got padding and border
2. **First card** (index 0) became gold with "Featured Card" text
3. **Second card** (index 1) became light blue with "Special Offer" text
4. **Last card** (index -1) became light green with "Last Card" text
5. **Third card** (index 2) just has the base padding and border

---

### Collection Bulk Updates

#### HTML Setup:
```html
<input class="form-field" type="text">
<input class="form-field" type="text">
<input class="form-field" type="text">
<input class="form-field" type="text">
```

#### Update All at Once:
```javascript
ClassName['form-field'].style({
  0: { backgroundColor: 'lightyellow' },
  1: { backgroundColor: 'lightblue' },
  2: { backgroundColor: 'lightgreen' },
  3: { backgroundColor: 'lightpink' }
});
```

#### Different Properties for Each:
```javascript
const fields = ClassName['form-field'];

fields.placeholder({
  0: 'First Name',
  1: 'Last Name',
  2: 'Email Address',
  3: 'Phone Number'
});

fields.value({
  0: 'John',
  1: 'Doe',
  2: 'john@example.com',
  3: '555-1234'
});
```

---

### Global Shortcuts

#### What are Global Shortcuts?
Quick ways to access collections without typing `Collections.ClassName` every time.

#### Three Shortcuts:
1. **ClassName** - Get elements by class
2. **TagName** - Get elements by tag name
3. **Name** - Get elements by name attribute

#### Using ClassName:
```html
<button class="btn">Button 1</button>
<button class="btn">Button 2</button>
<button class="btn">Button 3</button>
```

```javascript
// Instead of: Collections.ClassName.btn
// Just use:
ClassName.btn.textContent({
  0: 'Save',
  1: 'Cancel',
  2: 'Delete'
});
```

#### Using TagName:
```html
<p>Paragraph 1</p>
<p>Paragraph 2</p>
<p>Paragraph 3</p>
```

```javascript
TagName.p.textContent({
  0: 'First paragraph text',
  1: 'Second paragraph text',
  2: 'Third paragraph text'
});
```

#### Using Name:
```html
<input name="username" type="text">
<input name="username" type="text">
<input name="username" type="text">
```

```javascript
Name.username.value({
  0: 'user1',
  1: 'user2',
  2: 'user3'
});
```

---

### Global Query Functions

#### What are Query Functions?
Functions that find elements using CSS selectors (like `document.querySelector`).

#### The Four Functions:

**1. querySelector / query (Single Element):**
```javascript
// Find one element
const button = querySelector('#myButton');
// or shorthand:
const button = query('#myButton');

button.update({
  textContent: 'Click Me',
  style: { color: 'blue' }
});
```

**2. querySelectorAll / queryAll (Multiple Elements):**
```javascript
// Find multiple elements
const buttons = querySelectorAll('.btn');
// or shorthand:
const buttons = queryAll('.btn');

buttons.textContent({
  0: 'First',
  1: 'Second',
  2: 'Third'
});
```

**3. queryWithin (Scoped Single Element):**
```javascript
// Find element within a container
const button = queryWithin('#container', '.btn');
```

**4. queryAllWithin (Scoped Multiple Elements):**
```javascript
// Find elements within a container
const buttons = queryAllWithin('#sidebar', '.nav-btn');
```

---

## Expert Level - Complex Patterns

### 1. Conditional Updates

```javascript
// Update based on user role
const userRole = 'admin';

if (userRole === 'admin') {
  Elements.hidden({
    adminPanel: false,
    userPanel: true
  });
  
  Elements.textContent({
    welcomeMsg: 'Welcome, Administrator'
  });
} else {
  Elements.hidden({
    adminPanel: true,
    userPanel: false
  });
  
  Elements.textContent({
    welcomeMsg: 'Welcome, User'
  });
}
```

---

### 2. Form State Management

```javascript
// Complete form state control
function setFormState(state) {
  const states = {
    loading: {
      disabled: { submitBtn: true, cancelBtn: true },
      textContent: { submitBtn: 'Loading...', status: 'Processing...' },
      hidden: { errorMsg: true, successMsg: true, spinner: false }
    },
    success: {
      disabled: { submitBtn: false, cancelBtn: false },
      textContent: { submitBtn: 'Submit', status: 'Success!' },
      hidden: { errorMsg: true, successMsg: false, spinner: true }
    },
    error: {
      disabled: { submitBtn: false, cancelBtn: false },
      textContent: { submitBtn: 'Retry', status: 'Error occurred' },
      hidden: { errorMsg: false, successMsg: true, spinner: true }
    }
  };
  
  const config = states[state];
  Elements.disabled(config.disabled);
  Elements.textContent(config.textContent);
  Elements.hidden(config.hidden);
}

// Usage:
setFormState('loading');  // Show loading state
setFormState('success');  // Show success state
setFormState('error');    // Show error state
```

---

### 3. Dynamic List Updates

```html
<ul id="taskList">
  <li class="task">Task 1</li>
  <li class="task">Task 2</li>
  <li class="task">Task 3</li>
</ul>
```

```javascript
// Update task statuses
const tasks = ClassName.task;

function updateTaskStatus(taskIndex, completed) {
  tasks.update({
    [taskIndex]: {
      classList: {
        toggle: 'completed'
      },
      style: {
        textDecoration: completed ? 'line-through' : 'none',
        color: completed ? 'gray' : 'black'
      }
    }
  });
}

// Mark first task as complete
updateTaskStatus(0, true);

// Mark third task as complete
updateTaskStatus(2, true);
```

---

### 4. Responsive Updates

```javascript
// Update UI based on screen size
function updateLayout() {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    Elements.classes({
      nav: 'nav-mobile',
      sidebar: 'sidebar-mobile',
      content: 'content-mobile'
    });
    
    Elements.hidden({
      desktopMenu: true,
      mobileMenu: false
    });
  } else {
    Elements.classes({
      nav: 'nav-desktop',
      sidebar: 'sidebar-desktop',
      content: 'content-desktop'
    });
    
    Elements.hidden({
      desktopMenu: false,
      mobileMenu: true
    });
  }
}

// Run on load and resize
updateLayout();
window.addEventListener('resize', updateLayout);
```

---

### 5. Data-Driven Updates

```javascript
// Update UI from data object
const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  avatar: 'images/john.jpg',
  isActive: true
};

// Map data to UI
Elements.textContent({
  userName: userData.name,
  userEmail: userData.email,
  userRole: userData.role.toUpperCase()
});

Elements.src({
  userAvatar: userData.avatar
});

Elements.classes({
  userStatus: userData.isActive ? 'status-active' : 'status-inactive'
});

Elements.dataset({
  userCard: {
    userId: '12345',
    userName: userData.name,
    userRole: userData.role
  }
});
```

---

## Real-World Examples

### Example 1: Login Form

```html
<form id="loginForm">
  <input id="usernameField" type="text">
  <input id="passwordField" type="password">
  <button id="loginBtn">Login</button>
  <button id="cancelBtn">Cancel</button>
  <div id="errorMsg" style="display:none">Error</div>
  <div id="successMsg" style="display:none">Success</div>
  <div id="loadingSpinner" style="display:none">Loading...</div>
</form>
```

```javascript
// Initial state
Elements.placeholder({
  usernameField: 'Enter username',
  passwordField: 'Enter password'
});

Elements.hidden({
  errorMsg: true,
  successMsg: true,
  loadingSpinner: true
});

// On login button click
document.getElementById('loginBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  
  // Show loading state
  Elements.disabled({
    loginBtn: true,
    cancelBtn: true
  });
  
  Elements.textContent({
    loginBtn: 'Logging in...'
  });
  
  Elements.hidden({
    loadingSpinner: false,
    errorMsg: true,
    successMsg: true
  });
  
  try {
    // Simulate API call
    await simulateLogin();
    
    // Success state
    Elements.hidden({
      loadingSpinner: true,
      successMsg: false
    });
    
    Elements.textContent({
      successMsg: 'Login successful! Redirecting...'
    });
    
  } catch (error) {
    // Error state
    Elements.hidden({
      loadingSpinner: true,
      errorMsg: false
    });
    
    Elements.textContent({
      errorMsg: 'Login failed. Please try again.'
    });
    
    Elements.disabled({
      loginBtn: false,
      cancelBtn: false
    });
    
    Elements.textContent({
      loginBtn: 'Login'
    });
  }
});

function simulateLogin() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.5 ? resolve() : reject();
    }, 2000);
  });
}
```

---

### Example 2: Shopping Cart

```html
<div class="cart-item">
  <span class="item-name">Product 1</span>
  <span class="item-price">$10</span>
  <button class="remove-btn">Remove</button>
</div>
<div class="cart-item">
  <span class="item-name">Product 2</span>
  <span class="item-price">$20</span>
  <button class="remove-btn">Remove</button>
</div>
<div class="cart-item">
  <span class="item-name">Product 3</span>
  <span class="item-price">$30</span>
  <button class="remove-btn">Remove</button>
</div>
<div id="totalPrice">Total: $0</div>
```

```javascript
// Update cart item prices
function updateCart(items) {
  const names = ClassName['item-name'];
  const prices = ClassName['item-price'];
  
  // Update each item
  items.forEach((item, index) => {
    names.textContent({
      [index]: item.name
    });
    
    prices.textContent({
      [index]: `$${item.price}`
    });
  });
  
  // Calculate and show total
  const total = items.reduce((sum, item) => sum + item.price, 0);
  Elements.textContent({
    totalPrice: `Total: $${total}`
  });
}

// Example usage
const cartItems = [
  { name: 'Laptop', price: 999 },
  { name: 'Mouse', price: 25 },
  { name: 'Keyboard', price: 75 }
];

updateCart(cartItems);
```

---

### Example 3: Todo List

```html
<ul id="todoList">
  <li class="todo">
    <input type="checkbox" class="todo-check">
    <span class="todo-text">Task 1</span>
    <button class="todo-delete">Delete</button>
  </li>
  <li class="todo">
    <input type="checkbox" class="todo-check">
    <span class="todo-text">Task 2</span>
    <button class="todo-delete">Delete</button>
  </li>
  <li class="todo">
    <input type="checkbox" class="todo-check">
    <span class="todo-text">Task 3</span>
    <button class="todo-delete">Delete</button>
  </li>
</ul>
```

```javascript
// Toggle todo completion
function toggleTodo(index, completed) {
  const todos = ClassName.todo;
  const todoTexts = ClassName['todo-text'];
  
  todos.update({
    [index]: {
      classList: completed ? { add: 'completed' } : { remove: 'completed' }
    }
  });
  
  todoTexts.update({
    [index]: {
      style: {
        textDecoration: completed ? 'line-through' : 'none',
        color: completed ? '#999' : '#000'
      }
    }
  });
}

// Add click listeners to checkboxes
const checkboxes = ClassName['todo-check'];
checkboxes.forEach((checkbox, index) => {
  checkbox.addEventListener('change', (e) => {
    toggleTodo(index, e.target.checked);
  });
});
```

---

### Example 4: Tab System

```html
<div class="tabs">
  <button class="tab-btn active" data-tab="tab1">Tab 1</button>
  <button class="tab-btn" data-tab="tab2">Tab 2</button>
  <button class="tab-btn" data-tab="tab3">Tab 3</button>
</div>

<div id="tab1" class="tab-content">Content 1</div>
<div id="tab2" class="tab-content" style="display:none">Content 2</div>
<div id="tab3" class="tab-content" style="display:none">Content 3</div>
```

  ```javascript
function switchTab(tabIndex) {
  const buttons = ClassName['tab-btn'];
  const contents = ClassName['tab-content'];
  
  // Update all buttons: remove active from all
  buttons.classes({
    0: { remove: 'active' },
    1: { remove: 'active' },
    2: { remove: 'active' }
  });
  
  // Add active to clicked button
  buttons.classes({
    [tabIndex]: { add: 'active' }
  });
  
  // Hide all content
  contents.style({
    0: { display: 'none' },
    1: { display: 'none' },
    2: { display: 'none' }
  });
  
  // Show selected content
  contents.style({
    [tabIndex]: { display: 'block' }
  });
}

// Add click listeners
const tabButtons = ClassName['tab-btn'];
tabButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    switchTab(index);
  });
});
```

---

### Example 5: Image Gallery

```html
<div class="gallery">
  <img class="gallery-img" src="img1.jpg" alt="Image 1">
  <img class="gallery-img" src="img2.jpg" alt="Image 2">
  <img class="gallery-img" src="img3.jpg" alt="Image 3">
  <img class="gallery-img" src="img4.jpg" alt="Image 4">
</div>

<div id="lightbox" style="display:none">
  <img id="lightboxImg" src="">
  <button id="prevBtn">Previous</button>
  <button id="nextBtn">Next</button>
  <button id="closeBtn">Close</button>
</div>
```

```javascript
let currentImageIndex = 0;
const images = [
  { src: 'img1.jpg', alt: 'Beautiful sunset' },
  { src: 'img2.jpg', alt: 'Mountain landscape' },
  { src: 'img3.jpg', alt: 'Ocean waves' },
  { src: 'img4.jpg', alt: 'Forest path' }
];

// Open lightbox with selected image
function openLightbox(index) {
  currentImageIndex = index;
  
  Elements.hidden({
    lightbox: false
  });
  
  Elements.src({
    lightboxImg: images[index].src
  });
  
  Elements.alt({
    lightboxImg: images[index].alt
  });
  
  // Disable prev/next buttons at edges
  Elements.disabled({
    prevBtn: index === 0,
    nextBtn: index === images.length - 1
  });
}

// Close lightbox
function closeLightbox() {
  Elements.hidden({
    lightbox: true
  });
}

// Navigate images
function showPrevious() {
  if (currentImageIndex > 0) {
    openLightbox(currentImageIndex - 1);
  }
}

function showNext() {
  if (currentImageIndex < images.length - 1) {
    openLightbox(currentImageIndex + 1);
  }
}

// Add click listeners to gallery images
const galleryImages = ClassName['gallery-img'];
galleryImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    openLightbox(index);
  });
});

// Add lightbox controls
document.getElementById('closeBtn').addEventListener('click', closeLightbox);
document.getElementById('prevBtn').addEventListener('click', showPrevious);
document.getElementById('nextBtn').addEventListener('click', showNext);
```

---

### Example 6: Progress Tracker

```html
<div class="progress-steps">
  <div class="step" id="step1">
    <div class="step-number">1</div>
    <div class="step-label">Account</div>
  </div>
  <div class="step" id="step2">
    <div class="step-number">2</div>
    <div class="step-label">Profile</div>
  </div>
  <div class="step" id="step3">
    <div class="step-number">3</div>
    <div class="step-label">Payment</div>
  </div>
  <div class="step" id="step4">
    <div class="step-number">4</div>
    <div class="step-label">Confirm</div>
  </div>
</div>

<button id="prevStepBtn">Previous</button>
<button id="nextStepBtn">Next</button>
```

```javascript
let currentStep = 0;
const totalSteps = 4;

function updateStepProgress(step) {
  // Update all steps based on current position
  for (let i = 0; i < totalSteps; i++) {
    const stepId = `step${i + 1}`;
    
    if (i < step) {
      // Completed steps
      Elements.classes({
        [stepId]: { add: 'completed', remove: ['active', 'pending'] }
      });
    } else if (i === step) {
      // Current step
      Elements.classes({
        [stepId]: { add: 'active', remove: ['completed', 'pending'] }
      });
    } else {
      // Future steps
      Elements.classes({
        [stepId]: { add: 'pending', remove: ['completed', 'active'] }
      });
    }
  }
  
  // Update button states
  Elements.disabled({
    prevStepBtn: step === 0,
    nextStepBtn: step === totalSteps - 1
  });
  
  Elements.textContent({
    nextStepBtn: step === totalSteps - 1 ? 'Finish' : 'Next'
  });
}

// Navigation
document.getElementById('prevStepBtn').addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    updateStepProgress(currentStep);
  }
});

document.getElementById('nextStepBtn').addEventListener('click', () => {
  if (currentStep < totalSteps - 1) {
    currentStep++;
    updateStepProgress(currentStep);
  } else {
    alert('Form completed!');
  }
});

// Initialize
updateStepProgress(currentStep);
```

---

### Example 7: Notification System

```html
<div id="notificationContainer"></div>
<button id="showInfoBtn">Show Info</button>
<button id="showSuccessBtn">Show Success</button>
<button id="showWarningBtn">Show Warning</button>
<button id="showErrorBtn">Show Error</button>
```

```javascript
const notifications = [];

function createNotification(type, message) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <button class="notification-close">×</button>
  `;
  
  document.getElementById('notificationContainer').appendChild(notification);
  
  // Add to tracking array
  notifications.push(notification);
  
  // Style all notifications
  const notifs = ClassName.notification;
  notifs.style({
    [notifs.length - 1]: {
      opacity: '0',
      transform: 'translateY(-20px)'
    }
  });
  
  // Animate in
  setTimeout(() => {
    notifs.style({
      [notifs.length - 1]: {
        opacity: '1',
        transform: 'translateY(0)'
      }
    });
  }, 10);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification);
  }, 5000);
  
  // Close button functionality
  notification.querySelector('.notification-close').addEventListener('click', () => {
    removeNotification(notification);
  });
}

function removeNotification(notification) {
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(-20px)';
  
  setTimeout(() => {
    notification.remove();
    const index = notifications.indexOf(notification);
    if (index > -1) {
      notifications.splice(index, 1);
    }
  }, 300);
}

// Button handlers
document.getElementById('showInfoBtn').addEventListener('click', () => {
  createNotification('info', 'This is an information message');
});

document.getElementById('showSuccessBtn').addEventListener('click', () => {
  createNotification('success', 'Operation completed successfully!');
});

document.getElementById('showWarningBtn').addEventListener('click', () => {
  createNotification('warning', 'Please review your input');
});

document.getElementById('showErrorBtn').addEventListener('click', () => {
  createNotification('error', 'An error occurred. Please try again.');
});
```

---

## Common Mistakes & Solutions

### Mistake 1: Wrong Identifier Type

**❌ Wrong:**
```javascript
// Using class name with Elements (Elements uses IDs only!)
Elements.textContent({
  'my-button': 'Click Me'  // This won't work!
});
```

**✅ Correct:**
```javascript
// Use Elements with IDs
Elements.textContent({
  myButton: 'Click Me'  // ID without #
});

// Or use ClassName for classes
ClassName['my-button'].textContent({
  0: 'Click Me'
});
```

**Remember:**
- `Elements` → Use element **IDs** (no `#`)
- `ClassName` → Use **class names** (no `.`)
- `TagName` → Use **tag names** (like `div`, `button`)
- `Name` → Use **name attributes**

---

### Mistake 2: Forgetting Index-Based Syntax

**❌ Wrong:**
```javascript
// Trying to use Elements syntax on collections
ClassName.button.textContent({
  button1: 'Text',  // ❌ Collections don't have IDs!
  button2: 'Text'
});
```

**✅ Correct:**
```javascript
// Use indices for collections
ClassName.button.textContent({
  0: 'First Button',
  1: 'Second Button',
  2: 'Third Button'
});
```

---

### Mistake 3: Incorrect Style Object

**❌ Wrong:**
```javascript
// Trying to set styles as strings
Elements.style({
  myDiv: 'color: red; padding: 10px'  // ❌ Wrong format!
});
```

**✅ Correct:**
```javascript
// Use object format
Elements.style({
  myDiv: {
    color: 'red',
    padding: '10px'
  }
});
```

---

### Mistake 4: Mixing Bulk and Index Updates Incorrectly

**❌ Wrong:**
```javascript
// Trying to mix without understanding
ClassName.card.update({
  textContent: 'All Cards',  // This applies to ALL
  0: 'First Card'            // But this conflicts!
});
```

**✅ Correct:**
```javascript
// Bulk properties apply to all, index properties override
ClassName.card.update({
  // Base styles for ALL cards
  style: { 
    padding: '10px',
    border: '1px solid #ddd'
  },
  
  // Specific override for first card
  0: {
    textContent: 'Special Card',
    style: { 
      backgroundColor: 'gold'  // Adds to base styles
    }
  }
});
```

---

### Mistake 5: Forgetting Quotes for CSS Property Names

**❌ Wrong:**
```javascript
Elements.style({
  myDiv: {
    background-color: 'red'  // ❌ Hyphen creates invalid JS!
  }
});
```

**✅ Correct:**
```javascript
// Use camelCase
Elements.style({
  myDiv: {
    backgroundColor: 'red'  // ✅ camelCase
  }
});

// Or use quotes for hyphenated names
Elements.style({
  myDiv: {
    'background-color': 'red'  // ✅ Quoted
  }
});
```

---

### Mistake 6: Not Understanding Collection vs Element

**❌ Wrong:**
```javascript
// Trying to use element methods on a collection
const buttons = ClassName.button;
buttons.textContent = 'Click Me';  // ❌ Won't work!
```

**✅ Correct:**
```javascript
// Use bulk update methods on collections
const buttons = ClassName.button;
buttons.textContent({
  0: 'Click Me',
  1: 'Submit',
  2: 'Cancel'
});

// Or access individual elements
buttons[0].textContent = 'Click Me';  // ✅ Works on single element
```

---

### Mistake 7: Incorrect Class Operations

**❌ Wrong:**
```javascript
Elements.classes({
  myButton: 'active'  // This replaces ALL classes!
});
```

**✅ Correct:**
```javascript
// To add a class (keep existing classes):
Elements.classes({
  myButton: { add: 'active' }
});

// To replace all classes:
Elements.classes({
  myButton: 'btn primary active'  // This is intentional replacement
});
```

---

### Mistake 8: Wrong Data Attribute Format

**❌ Wrong:**
```javascript
Elements.dataset({
  myDiv: {
    'data-user-id': '123'  // ❌ Don't include 'data-' prefix!
  }
});
```

**✅ Correct:**
```javascript
Elements.dataset({
  myDiv: {
    userId: '123'  // ✅ camelCase, no 'data-' prefix
  }
});
// Results in: data-user-id="123" in HTML
```

---

### Mistake 9: Trying to Update Non-Existent Elements

**❌ Problem:**
```javascript
Elements.textContent({
  nonExistentElement: 'Text'  // Element doesn't exist
});
// Silently fails - no error, no update
```

**✅ Solution:**
```javascript
// Check if element exists first
if (Elements.exists('myElement')) {
  Elements.textContent({
    myElement: 'Text'
  });
} else {
  console.log('Element not found');
}
```

---

### Mistake 10: Incorrect Negative Index Usage

**❌ Wrong:**
```javascript
const items = ClassName.item;
// Assuming there are 5 items (indices 0-4)

items.textContent({
  [-6]: 'Text'  // ❌ Out of bounds!
});
```

**✅ Correct:**
```javascript
const items = ClassName.item;
console.log(items.length);  // Check length first

items.textContent({
  [-1]: 'Last Item',   // ✅ Valid
  [-2]: 'Second Last'  // ✅ Valid
});
```

---

## Performance Tips

### Tip 1: Batch Updates Together

**❌ Slow:**
```javascript
// Multiple separate calls
Elements.textContent({ title: 'Hello' });
Elements.style({ title: { color: 'red' } });
Elements.classes({ title: { add: 'active' } });
```

**✅ Fast:**
```javascript
// One combined update
Elements.update({
  title: {
    textContent: 'Hello',
    style: { color: 'red' },
    classList: { add: 'active' }
  }
});
```

---

### Tip 2: Use Specific Methods When Possible

**❌ Less Efficient:**
```javascript
// Using generic .update()
Elements.update({
  btn1: { textContent: 'Text 1' },
  btn2: { textContent: 'Text 2' },
  btn3: { textContent: 'Text 3' }
});
```

**✅ More Efficient:**
```javascript
// Using specific .textContent() method
Elements.textContent({
  btn1: 'Text 1',
  btn2: 'Text 2',
  btn3: 'Text 3'
});
```

---

### Tip 3: Avoid Unnecessary Updates

**❌ Wasteful:**
```javascript
// Updating every frame
setInterval(() => {
  Elements.textContent({
    clock: new Date().toLocaleTimeString()
  });
}, 16);  // 60 times per second!
```

**✅ Efficient:**
```javascript
// Update only when needed (every second)
setInterval(() => {
  Elements.textContent({
    clock: new Date().toLocaleTimeString()
  });
}, 1000);  // Once per second
```

---

### Tip 4: Cache Collection References

**❌ Inefficient:**
```javascript
// Re-querying every time
for (let i = 0; i < 10; i++) {
  ClassName.button.textContent({
    [i]: `Button ${i}`
  });
}
```

**✅ Efficient:**
```javascript
// Query once, use many times
const buttons = ClassName.button;
const updates = {};

for (let i = 0; i < 10; i++) {
  updates[i] = `Button ${i}`;
}

buttons.textContent(updates);
```

---

## Best Practices Summary

### ✅ DO:
1. **Group related updates together** for better performance
2. **Use specific methods** (`.textContent()`, `.style()`) when updating single properties
3. **Use `.update()`** when changing multiple properties on same elements
4. **Cache collection references** if using them multiple times
5. **Check element existence** before critical updates
6. **Use camelCase** for CSS properties in JavaScript
7. **Use index 0** for first element, `-1` for last element
8. **Combine bulk and index updates** for flexible styling

### ❌ DON'T:
1. **Don't mix ID and class syntaxes** - Elements uses IDs, ClassName uses classes
2. **Don't forget to use objects** for style/dataset/attrs values
3. **Don't include prefixes** - no `#` for IDs, no `.` for classes, no `data-` for dataset
4. **Don't update in tight loops** without batching
5. **Don't assume elements exist** - check first for critical updates
6. **Don't use string styles** - always use object format
7. **Don't confuse collections with elements** - collections need index syntax
8. **Don't forget negative indices are supported** for accessing from end

---

## Quick Reference Card

```javascript
// ========================================
// ELEMENTS (By ID)
// ========================================

// Text
Elements.textContent({ myDiv: 'Text' });
Elements.innerHTML({ myDiv: '<strong>HTML</strong>' });

// Forms
Elements.value({ input: 'Value' });
Elements.placeholder({ input: 'Hint...' });
Elements.disabled({ button: true });
Elements.checked({ checkbox: true });

// Visibility
Elements.hidden({ div: true });

// Media
Elements.src({ img: 'image.jpg' });
Elements.href({ link: '/page' });
Elements.alt({ img: 'Description' });

// Styles
Elements.style({
  div: { color: 'red', padding: '10px' }
});

// Classes
Elements.classes({
  div: { add: 'active', remove: 'old' }
});

// Data
Elements.dataset({
  div: { userId: '123', role: 'admin' }
});

// Attributes
Elements.attrs({
  button: { disabled: true, title: 'Click me' }
});

// Generic
Elements.prop('disabled', { btn1: true, btn2: false });

// ========================================
// COLLECTIONS (By Class/Tag/Name)
// ========================================

// Access
ClassName.button     // All buttons with class="button"
TagName.div          // All <div> elements
Name.username        // All with name="username"

// Index-based updates
ClassName.button.textContent({
  0: 'First',
  1: 'Second',
  [-1]: 'Last'
});

// Mixed updates
ClassName.card.update({
  // For ALL
  style: { padding: '10px' },
  // For specific
  0: { textContent: 'Special', style: { color: 'red' } }
});

// ========================================
// GLOBAL QUERY
// ========================================

// Single element
const el = querySelector('#id');
const el = query('.class');

// Multiple elements
const els = querySelectorAll('.class');
const els = queryAll('.class');

// Index updates on query results
queryAll('.items').textContent({
  0: 'First',
  1: 'Second'
});
```

---

## Conclusion

The Enhancers module transforms DOM manipulation from tedious repetition into elegant, declarative updates. By understanding these patterns:

- **Beginners** can quickly update multiple elements
- **Intermediate users** can manage complex UI states
- **Advanced developers** can build scalable, maintainable applications

**Remember the key principle:** Update many elements with one method call!

Start with simple text updates, progress to styles and classes, then master index-based collection updates. With practice, you'll write cleaner, faster, more maintainable code.

Happy coding! 🎉