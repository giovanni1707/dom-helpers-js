# Understanding `loadAll()` - A Beginner's Guide

## What is `loadAll()`?

`loadAll()` loads all reactive modules at once (core, arrays, collections, and forms). It's the simplest way to get full reactive functionality.

Think of it as **everything loader** - load all features at once.

---

## Why Does This Exist?

### The Problem: Loading Multiple Modules

You need all reactive features but don't want to load them individually:

```javascript
// ❌ Without loadAll - load each manually
Reactive.loadCore();
Reactive.loadArraySupport();
Reactive.loadCollections();
Reactive.loadForms();

// ✅ With loadAll() - one call
Reactive.loadAll();
```

**Why this matters:**
- Single function call
- All features available
- Simpler setup
- No missing modules

---

## How Does It Work?

### The LoadAll Process

```javascript
Reactive.loadAll()
    ↓
Loads core module (state, computed, effect, etc.)
Loads array support (reactive arrays)
Loads collections (Reactive.collection)
Loads forms (Reactive.form, validators)
    ↓
All features ready to use
```

---

## Basic Usage

### Simple Setup

```javascript
// Load everything
Reactive.loadAll();

// Now use any feature
const state = Reactive.state({ count: 0 });
const items = Reactive.collection([]);
const form = Reactive.form({ email: '' });
```

### In HTML

```html
<script src="reactive.js"></script>
<script>
  // Load all modules
  Reactive.loadAll();

  // Use reactive features
  const app = Reactive.state({
    todos: [],
    filter: 'all'
  });
</script>
```

---

## Simple Examples

### Example 1: Full Application Setup

```javascript
// Initialize all reactive features
Reactive.loadAll();

// Use state
const appState = Reactive.state({
  user: null,
  isLoggedIn: false,
  notifications: []
});

// Use collections
const todos = Reactive.collection([]);

// Use forms
const loginForm = Reactive.form({
  email: ['', v.required()],
  password: ['', v.required()]
});

// Use effects
Reactive.effect(() => {
  console.log(`${todos.length} todos`);
});
```

---

### Example 2: Dashboard Application

```javascript
// Load all reactive modules
Reactive.loadAll();

// Application state
const dashboardState = Reactive.state({
  selectedTab: 'overview',
  isLoading: false,
  data: []
});

// Collections for different data types
const users = Reactive.collection([]);
const products = Reactive.collection([]);
const orders = Reactive.collection([]);

// Form for filters
const filterForm = Reactive.form({
  startDate: [''],
  endDate: [''],
  category: ['all']
});

// Computed values
const filteredOrders = Reactive.computed(() => {
  return orders.filter(order => {
    // Filter logic
    return true;
  });
});

// Effects for updates
Reactive.effect(() => {
  document.getElementById('tab').textContent = dashboardState.selectedTab;
});
```

---

## Real-World Example: E-commerce App

```javascript
// Load all reactive features
Reactive.loadAll();

// ======================
// Application State
// ======================
const appState = Reactive.state({
  currentUser: null,
  isAuthenticated: false,
  currentPage: 'home',
  cartOpen: false,
  searchQuery: ''
});

// ======================
// Collections
// ======================
const products = Reactive.collection([]);
const cartItems = Reactive.collection([]);
const wishlist = Reactive.collection([]);

// ======================
// Forms
// ======================
const loginForm = Reactive.form({
  email: ['', v.combine([v.required(), v.email()])],
  password: ['', v.combine([v.required(), v.minLength(6)])]
});

const checkoutForm = Reactive.form({
  name: ['', v.required()],
  address: ['', v.required()],
  city: ['', v.required()],
  zipCode: ['', v.pattern(/^\d{5}$/)],
  cardNumber: ['', v.required()]
});

const searchForm = Reactive.form({
  query: [''],
  category: ['all'],
  minPrice: [0],
  maxPrice: [1000]
});

// ======================
// Computed Values
// ======================
const cartTotal = Reactive.computed(() => {
  return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const cartCount = Reactive.computed(() => {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
});

const filteredProducts = Reactive.computed(() => {
  let filtered = products;

  if (searchForm.values.query) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchForm.values.query.toLowerCase())
    );
  }

  if (searchForm.values.category !== 'all') {
    filtered = filtered.filter(p => p.category === searchForm.values.category);
  }

  filtered = filtered.filter(p =>
    p.price >= searchForm.values.minPrice &&
    p.price <= searchForm.values.maxPrice
  );

  return filtered;
});

// ======================
// Actions
// ======================
function addToCart(product) {
  const existing = cartItems.find(i => i.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
}

function removeFromCart(productId) {
  const index = cartItems.findIndex(i => i.id === productId);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }
}

function toggleWishlist(product) {
  const index = wishlist.findIndex(i => i.id === product.id);

  if (index !== -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(product);
  }
}

async function login() {
  loginForm.submit(async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(loginForm.values)
    });

    if (response.ok) {
      const user = await response.json();
      appState.currentUser = user;
      appState.isAuthenticated = true;
    }
  });
}

// ======================
// Effects
// ======================

// Update cart badge
Reactive.effect(() => {
  const badge = document.getElementById('cart-badge');
  if (cartCount > 0) {
    badge.style.display = 'block';
    badge.textContent = cartCount;
  } else {
    badge.style.display = 'none';
  }
});

// Display cart total
Reactive.effect(() => {
  document.getElementById('cart-total').textContent =
    `$${cartTotal.toFixed(2)}`;
});

// Display products
Reactive.effect(() => {
  const container = document.getElementById('products');

  container.innerHTML = filteredProducts
    .map(product => `
      <div class="product">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
          Add to Cart
        </button>
        <button onclick="toggleWishlist(${JSON.stringify(product).replace(/"/g, '&quot;')})">
          ${wishlist.find(i => i.id === product.id) ? '❤️' : '🤍'}
        </button>
      </div>
    `)
    .join('');
});

// Display cart
Reactive.effect(() => {
  const container = document.getElementById('cart');

  if (cartItems.isEmpty()) {
    container.innerHTML = '<p>Your cart is empty</p>';
    return;
  }

  container.innerHTML = `
    <h3>Shopping Cart (${cartCount} items)</h3>
    ${cartItems.map(item => `
      <div class="cart-item">
        <span>${item.name}</span>
        <span>Qty: ${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `).join('')}
    <div class="cart-total">
      <strong>Total: $${cartTotal.toFixed(2)}</strong>
    </div>
    <button onclick="appState.currentPage = 'checkout'">Checkout</button>
  `;
});

// Load initial products
async function loadProducts() {
  const response = await fetch('/api/products');
  const data = await response.json();
  products.reset(data);
}

loadProducts();
```

---

## Common Patterns

### Pattern 1: Simple Setup

```javascript
Reactive.loadAll();

// Use everything
const state = Reactive.state({});
const collection = Reactive.collection([]);
const form = Reactive.form({});
```

### Pattern 2: Initialization Function

```javascript
function initApp() {
  Reactive.loadAll();

  // Setup application
  setupState();
  setupCollections();
  setupForms();
  setupEffects();
}
```

---

## Common Questions

### Q: What modules does it load?

**Answer:** All four modules:

```javascript
// loadAll() loads:
// 1. Core (state, computed, effect, watch)
// 2. Array Support (reactive arrays)
// 3. Collections (Reactive.collection)
// 4. Forms (Reactive.form, validators)
```

### Q: When should I use loadAll()?

**Answer:** When you need most/all features:

```javascript
// ✅ Use loadAll() - need multiple features
Reactive.loadAll();

// ✅ Use specific loaders - only need one feature
Reactive.loadCore();
```

### Q: Does it affect performance?

**Answer:** Loads more code, but usually negligible:

```javascript
// Loads everything - larger bundle
Reactive.loadAll();

// Only loads what you need - smaller bundle
Reactive.loadCore();
Reactive.loadCollections();
```

---

## Summary

### What `loadAll()` Does:

1. ✅ Loads all modules
2. ✅ Single function call
3. ✅ Full feature access
4. ✅ Simple setup

### When to Use It:

- Full applications
- Need most features
- Quick prototyping
- Don't want selective loading

### The Basic Pattern:

```javascript
// Initialize
Reactive.loadAll();

// Use any feature
const state = Reactive.state({});
const collection = Reactive.collection([]);
const form = Reactive.form({});

const computed = Reactive.computed(() => {});
Reactive.effect(() => {});
```

---

**Remember:** `loadAll()` is the easiest way to get started - loads everything you need! 🎉
