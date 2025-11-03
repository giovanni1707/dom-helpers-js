# Collections Integration Methods - Complete Guide

## Overview

When the reactive library is integrated with DOM Helpers, all reactive functionality becomes available through the `Collections` namespace. This namespace is specifically designed for working with multiple elements via class selectors, providing seamless integration between reactive state management and class-based DOM manipulation.

---

## Table of Contents

1. [Integration Overview](#integration-overview)
2. [State Creation Methods](#state-creation-methods)
3. [Reactivity Methods](#reactivity-methods)
4. [Specialized Constructors](#specialized-constructors)
5. [Batch Operations](#batch-operations)
6. [Utility Methods](#utility-methods)
7. [Special Integration Methods](#special-integration-methods)
8. [Usage Examples](#usage-examples)
9. [Best Practices](#best-practices)
10. [API Quick Reference](#api-quick-reference)

---

## Integration Overview

### What is Collections Integration?

The reactive library automatically integrates with DOM Helpers Collections namespace, exposing all reactive functionality for class-based element manipulation. This allows you to:

- Work with multiple elements using classes
- Create reactive state for collections of DOM elements
- Leverage class-based selectors with reactive bindings
- Apply updates to all elements matching a class

### Checking Integration

```javascript
// Check if reactive library is integrated with Collections
if (Collections.state) {
  console.log('Reactive library integrated with Collections!');
}

// All reactive methods available on Collections
console.log(typeof Collections.state);      // 'function'
console.log(typeof Collections.computed);   // 'function'
console.log(typeof Collections.batch);      // 'function'
```

### Namespace Availability

The same reactive functionality is available through multiple namespaces:

```javascript
// All equivalent (when integrated)
Collections.state({ count: 0 })
Elements.state({ count: 0 })
Selector.state({ count: 0 })
ReactiveUtils.state({ count: 0 })

// Use Collections when working primarily with classes
const state = Collections.state({ items: [] });
```

---

## State Creation Methods

### `Collections.state(initialState)`

Create reactive state through Collections namespace.

**Syntax:**
```javascript
Collections.state(initialState)
```

**Example:**
```javascript
const gallery = Collections.state({
  images: [],
  currentFilter: 'all',
  view: 'grid'
});

// Update all gallery items with same class
gallery.$bind({
  '.gallery-item': function() {
    return this.images.map(img => `
      <div class="item" data-id="${img.id}">
        <img src="${img.url}">
      </div>
    `).join('');
  }
});

// Use with Collections helper
Collections('.filter-btn').on('click', function() {
  gallery.currentFilter = Collections(this).data('filter');
});
```

---

### `Collections.createState(initialState, bindingDefs)`

Create reactive state with automatic DOM bindings for class selectors.

**Syntax:**
```javascript
Collections.createState(initialState, bindingDefs)
```

**Example:**
```javascript
const app = Collections.createState(
  { 
    count: 0, 
    status: 'idle' 
  },
  {
    '.counter': () => app.count,
    '.status-badge': () => app.status
  }
);

// All elements with these classes update automatically
app.count = 10;     // Updates all .counter elements
app.status = 'active'; // Updates all .status-badge elements
```

---

### `Collections.ref(value)`

Create a single ref value.

**Syntax:**
```javascript
Collections.ref(value)
```

**Example:**
```javascript
const activeTab = Collections.ref('home');

Collections('.tab-btn').on('click', function() {
  activeTab.value = Collections(this).data('tab');
});

// Update all tab displays
activeTab.$bind({
  '.active-tab-name': () => activeTab.value
});
```

---

### `Collections.refs(defs)`

Create multiple refs at once.

**Syntax:**
```javascript
Collections.refs(defs)
```

**Example:**
```javascript
const refs = Collections.refs({
  filter: 'all',
  sort: 'date',
  view: 'grid'
});

// Update controls
Collections('.filter-option').on('click', function() {
  refs.filter.value = Collections(this).data('filter');
});

Collections('.sort-option').on('click', function() {
  refs.sort.value = Collections(this).data('sort');
});
```

---

### `Collections.list(items)`

Create a reactive collection - perfect for Collections namespace.

**Syntax:**
```javascript
Collections.list(items)
```

**Example:**
```javascript
const products = Collections.list([
  { id: 1, name: 'Product 1', price: 19.99 },
  { id: 2, name: 'Product 2', price: 29.99 }
]);

products.$bind({
  '.product-list': function() {
    return this.items.map(p => `
      <div class="product-card" data-id="${p.id}">
        <h3>${p.name}</h3>
        <p class="price">$${p.price}</p>
      </div>
    `).join('');
  },
  '.product-count': () => products.items.length
});

// Add products with event
Collections('.add-product').on('click', () => {
  products.$add({
    id: Date.now(),
    name: 'New Product',
    price: 39.99
  });
});
```

---

## Reactivity Methods

### `Collections.computed(state, defs)`

Add computed properties to state.

**Syntax:**
```javascript
Collections.computed(state, defs)
```

**Example:**
```javascript
const cart = Collections.state({
  items: [
    { id: 1, price: 19.99, quantity: 2 },
    { id: 2, price: 29.99, quantity: 1 }
  ]
});

Collections.computed(cart, {
  total() {
    return this.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  },
  itemCount() {
    return this.items.reduce((sum, item) => 
      sum + item.quantity, 0
    );
  },
  formattedTotal() {
    return `$${this.total.toFixed(2)}`;
  }
});

// Bind to all elements with class
Collections.bind({
  'cart-total': () => cart.formattedTotal,
  'cart-count': () => cart.itemCount
});
```

---

### `Collections.watch(state, defs)`

Add watchers to state.

**Syntax:**
```javascript
Collections.watch(state, defs)
```

**Example:**
```javascript
const filters = Collections.state({
  category: 'all',
  priceRange: [0, 100],
  inStock: false
});

Collections.watch(filters, {
  category(newVal, oldVal) {
    console.log(`Category changed from ${oldVal} to ${newVal}`);
    
    // Update all category buttons
    Collections('.category-btn').removeClass('active');
    Collections(`.category-btn[data-category="${newVal}"]`).addClass('active');
  },
  inStock(val) {
    // Toggle classes on all product cards
    if (val) {
      Collections('.product-card').addClass('stock-filter');
    } else {
      Collections('.product-card').removeClass('stock-filter');
    }
  }
});
```

---

### `Collections.effect(fn)`

Create a reactive effect.

**Syntax:**
```javascript
Collections.effect(fn)
```

**Example:**
```javascript
const theme = Collections.state({ 
  mode: 'light',
  primaryColor: '#007bff'
});

Collections.effect(() => {
  // Update all themed elements
  Collections('.themed-element').css({
    'background-color': theme.mode === 'dark' ? '#333' : '#fff',
    'color': theme.mode === 'dark' ? '#fff' : '#000'
  });
  
  Collections('.primary-btn').css('background-color', theme.primaryColor);
});

theme.mode = 'dark'; // Updates all themed elements
```

---

### `Collections.effects(defs)`

Create multiple effects from object.

**Syntax:**
```javascript
Collections.effects(defs)
```

**Example:**
```javascript
const ui = Collections.state({
  sidebarOpen: false,
  modalOpen: false,
  loading: false
});

Collections.effects({
  updateSidebar() {
    if (ui.sidebarOpen) {
      Collections('.sidebar').addClass('open');
      Collections('.overlay').fadeIn();
    } else {
      Collections('.sidebar').removeClass('open');
      Collections('.overlay').fadeOut();
    }
  },
  updateModal() {
    if (ui.modalOpen) {
      Collections('.modal').fadeIn();
      Collections('.modal-overlay').show();
    } else {
      Collections('.modal').fadeOut();
      Collections('.modal-overlay').hide();
    }
  },
  updateLoading() {
    if (ui.loading) {
      Collections('.loading-spinner').show();
    } else {
      Collections('.loading-spinner').hide();
    }
  }
});
```

---

### `Collections.bindings(defs)`

Create DOM bindings with selectors (classes, IDs, etc.).

**Syntax:**
```javascript
Collections.bindings(defs)
```

**Example:**
```javascript
const app = Collections.state({
  users: [],
  currentUser: null,
  notifications: 0
});

Collections.bindings({
  '.user-count': () => app.users.length,
  '.current-user-name': () => app.currentUser?.name || 'Guest',
  '.notification-badge': {
    textContent: () => app.notifications,
    className: () => app.notifications > 0 ? 'badge visible' : 'badge'
  },
  // Can mix with IDs too
  '#main-status': () => app.currentUser ? 'Logged in' : 'Guest'
});
```

---

## Specialized Constructors

### `Collections.store(initialState, options)`

Create a store with getters and actions.

**Syntax:**
```javascript
Collections.store(initialState, options)
```

**Example:**
```javascript
const productStore = Collections.store(
  {
    products: [],
    filters: {
      category: 'all',
      minPrice: 0,
      maxPrice: 1000
    }
  },
  {
    getters: {
      filteredProducts() {
        return this.products.filter(p => {
          if (this.filters.category !== 'all' && p.category !== this.filters.category) {
            return false;
          }
          if (p.price < this.filters.minPrice || p.price > this.filters.maxPrice) {
            return false;
          }
          return true;
        });
      },
      categories() {
        return [...new Set(this.products.map(p => p.category))];
      }
    },
    actions: {
      async loadProducts(state) {
        const products = await fetch('/api/products').then(r => r.json());
        state.products = products;
        
        // Update all product displays
        Collections('.product-card').remove();
        Collections('.product-list').html(
          products.map(p => `<div class="product-card">${p.name}</div>`).join('')
        );
      },
      setFilter(state, filterType, value) {
        state.filters[filterType] = value;
        
        // Update all filter buttons
        Collections(`.filter-btn[data-filter="${filterType}"]`).removeClass('active');
        Collections(`.filter-btn[data-filter="${filterType}"][data-value="${value}"]`).addClass('active');
      }
    }
  }
);

// Use with Collections
Collections('.load-products-btn').on('click', () => {
  productStore.loadProducts();
});
```

---

### `Collections.component(config)`

Create a component with state, computed, watchers, and lifecycle.

**Syntax:**
```javascript
Collections.component(config)
```

**Example:**
```javascript
const galleryComponent = Collections.component({
  state: {
    images: [],
    filter: 'all',
    view: 'grid',
    selectedIds: []
  },
  
  computed: {
    filteredImages() {
      if (this.filter === 'all') return this.images;
      return this.images.filter(img => img.category === this.filter);
    },
    selectedCount() {
      return this.selectedIds.length;
    }
  },
  
  actions: {
    selectImage(state, id) {
      const index = state.selectedIds.indexOf(id);
      if (index === -1) {
        state.selectedIds.push(id);
      } else {
        state.selectedIds.splice(index, 1);
      }
    },
    deleteSelected(state) {
      state.images = state.images.filter(
        img => !state.selectedIds.includes(img.id)
      );
      state.selectedIds = [];
    },
    changeView(state, view) {
      state.view = view;
      
      // Update all gallery containers
      Collections('.gallery-container')
        .removeClass('grid list')
        .addClass(view);
    }
  },
  
  bindings: {
    '.gallery-grid': function() {
      return this.filteredImages.map(img => `
        <div class="gallery-item ${this.selectedIds.includes(img.id) ? 'selected' : ''}" 
             data-id="${img.id}">
          <img src="${img.url}">
        </div>
      `).join('');
    },
    '.selection-count': () => galleryComponent.selectedCount,
    '.filter-status': () => `Showing: ${galleryComponent.filter}`
  },
  
  mounted() {
    // Handle image selection
    Collections('.gallery-grid').on('click', '.gallery-item', function() {
      const id = Number(Collections(this).data('id'));
      galleryComponent.selectImage(id);
    });
    
    // Handle filter changes
    Collections('.filter-btn').on('click', function() {
      galleryComponent.filter = Collections(this).data('filter');
    });
    
    // Handle view changes
    Collections('.view-btn').on('click', function() {
      const view = Collections(this).data('view');
      galleryComponent.changeView(view);
    });
  }
});
```

---

### `Collections.reactive(initialState)`

Fluent builder for reactive state.

**Syntax:**
```javascript
Collections.reactive(initialState)
```

**Example:**
```javascript
const builder = Collections.reactive({ 
  items: [],
  filter: 'all' 
})
  .computed({
    filteredItems() {
      if (this.filter === 'all') return this.items;
      return this.items.filter(i => i.category === this.filter);
    },
    count() {
      return this.filteredItems.length;
    }
  })
  .watch({
    filter(val) {
      console.log('Filter changed to:', val);
      
      // Update all filter displays
      Collections('.active-filter').text(val);
    }
  })
  .effect(() => {
    // Update all item displays
    Collections('.item-count').text(builder.state.count);
  })
  .action('addItem', (state, item) => {
    state.items.push(item);
  })
  .action('setFilter', (state, filter) => {
    state.filter = filter;
  });

const state = builder.build();

// Use with Collections
Collections('.add-btn').on('click', () => {
  state.addItem({ id: Date.now(), category: 'new' });
});
```

---

## Batch Operations

### `Collections.batch(fn)`

Batch multiple updates into one.

**Syntax:**
```javascript
Collections.batch(fn)
```

**Example:**
```javascript
const ui = Collections.state({
  theme: 'light',
  fontSize: 16,
  spacing: 'normal'
});

ui.$bind({
  '.themed-content': function() {
    return `Theme: ${this.theme}, Size: ${this.fontSize}, Spacing: ${this.spacing}`;
  }
});

Collections('.apply-theme').on('click', () => {
  Collections.batch(() => {
    ui.theme = 'dark';
    ui.fontSize = 18;
    ui.spacing = 'comfortable';
  });
  // All .themed-content elements update once
  
  // Apply CSS to all themed elements
  Collections('.themed-element').css({
    'font-size': ui.fontSize + 'px',
    'padding': ui.spacing === 'comfortable' ? '20px' : '10px'
  });
});
```

---

### `Collections.pause()`

Pause reactivity.

**Syntax:**
```javascript
Collections.pause()
```

**Example:**
```javascript
const items = Collections.list([]);

Collections('.bulk-import').on('click', async () => {
  const data = await fetchLargeDataset();
  
  Collections.pause();
  
  try {
    data.forEach(item => items.$add(item));
  } finally {
    Collections.resume(true);
  }
  
  // Update all item displays once
  Collections('.item-status').text(`Loaded ${items.items.length} items`);
});
```

---

### `Collections.resume(flush)`

Resume reactivity.

**Syntax:**
```javascript
Collections.resume(flush)
```

**Example:**
```javascript
Collections.pause();

// Make multiple updates
state.count = 10;
state.message = 'Updated';
state.status = 'active';

Collections.resume(true); // Flush all updates

// All class-based elements update together
Collections('.status-indicator').addClass('active');
```

---

### `Collections.untrack(fn)`

Run function without tracking dependencies.

**Syntax:**
```javascript
Collections.untrack(fn)
```

**Example:**
```javascript
const state = Collections.state({
  items: [],
  debugMode: false
});

Collections.effect(() => {
  console.log('Items updated:', state.items.length);
  
  // Update all item counters
  Collections('.item-counter').text(state.items.length);
  
  // Check debug mode without tracking it
  const debug = Collections.untrack(() => state.debugMode);
  if (debug) {
    Collections('.debug-info').show().text(JSON.stringify(state.items));
  } else {
    Collections('.debug-info').hide();
  }
});
```

---

## Utility Methods

### `Collections.updateAll(state, updates)`

Unified state and DOM updates.

**Syntax:**
```javascript
Collections.updateAll(state, updates)
```

**Example:**
```javascript
const app = Collections.state({
  user: null,
  theme: 'light',
  notifications: 0
});

Collections('.login-btn').on('click', async () => {
  const userData = await login();
  
  Collections.updateAll(app, {
    // Update state
    user: userData,
    theme: userData.preferences.theme,
    notifications: userData.unreadCount,
    
    // Update DOM - can use classes
    '.user-name': { textContent: userData.name },
    '.user-avatar': { src: userData.avatar },
    '.notification-count': { textContent: userData.unreadCount },
    '.theme-indicator': { className: `theme-${userData.preferences.theme}` }
  });
  
  // Additional class updates
  Collections('.user-panel').addClass('logged-in');
  Collections('.login-panel').hide();
});
```

---

### `Collections.isReactive(value)`

Check if value is reactive.

**Syntax:**
```javascript
Collections.isReactive(value)
```

**Example:**
```javascript
const state = Collections.state({ items: [] });
const plain = { items: [] };

console.log(Collections.isReactive(state)); // true
console.log(Collections.isReactive(plain)); // false

function processData(data) {
  if (Collections.isReactive(data)) {
    // Use reactive features with all matching elements
    data.$computed('count', function() {
      return this.items.length;
    });
    
    Collections('.data-count').text(data.count);
  }
}
```

---

### `Collections.toRaw(value)`

Get raw non-reactive value.

**Syntax:**
```javascript
Collections.toRaw(value)
```

**Example:**
```javascript
const cart = Collections.state({
  items: [
    { id: 1, name: 'Product 1', price: 19.99 }
  ]
});

Collections('.checkout-btn').on('click', async () => {
  const raw = Collections.toRaw(cart);
  
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(raw)
  });
  
  if (response.ok) {
    Collections('.success-message').show();
    Collections('.cart-items').empty();
  }
});
```

---

### `Collections.notify(state, key)`

Manually notify dependencies.

**Syntax:**
```javascript
Collections.notify(state, key)
```

**Example:**
```javascript
const list = Collections.state({
  items: [3, 1, 4, 1, 5, 9, 2, 6]
});

Collections('.sort-btn').on('click', () => {
  const raw = Collections.toRaw(list);
  raw.items.sort((a, b) => a - b);
  Collections.notify(list, 'items');
  
  // Update all list displays
  Collections('.list-display').text(list.items.join(', '));
});
```

---

## Special Integration Methods

### `Collections.bind(bindingDefs)` - Class-Based Bindings

Special method for class-based bindings (without `.` prefix).

**Syntax:**
```javascript
Collections.bind(bindingDefs)
```

**Key Difference:**
- `Collections.bindings()` - Uses full selectors (`.class`, `#id`)
- `Collections.bind()` - Uses classes directly (without `.`)

**Example:**
```javascript
const state = Collections.state({
  count: 0,
  status: 'idle',
  message: 'Ready'
});

// Class-based bindings (no . needed)
Collections.bind({
  'counter-display': () => state.count,
  'status-badge': () => state.status,
  'message-box': () => state.message,
  'counter-value': {
    textContent: () => state.count,
    className: () => state.count > 10 ? 'high' : 'low'
  }
});

// Equivalent to:
Collections.bindings({
  '.counter-display': () => state.count,
  '.status-badge': () => state.status,
  '.message-box': () => state.message,
  '.counter-value': {
    textContent: () => state.count,
    className: () => state.count > 10 ? 'high' : 'low'
  }
});
```

**When to Use:**
```javascript
// Use Collections.bind() when working primarily with classes
Collections.bind({
  'product-card': function() {
    return products.items.map(p => `<div>${p.name}</div>`).join('');
  },
  'product-count': () => products.items.length
});

// Use Collections.bindings() for mixed selectors
Collections.bindings({
  '.product-card': () => /* ... */,
  '#product-count': () => products.items.length,
  'div[data-type="product"]': () => /* ... */
});
```

**Advantage with Collections:**
```javascript
// Perfect for updating multiple elements with same class
Collections.bind({
  'notification': {
    textContent: () => state.message,
    className: () => `notification ${state.type}`
  },
  'status-indicator': {
    className: () => state.isOnline ? 'online' : 'offline'
  }
});

// All elements with class="notification" update together
// All elements with class="status-indicator" update together
```

---

## Usage Examples

### Example 1: Product Catalog with Collections

```javascript
// Create reactive product catalog
const catalog = Collections.state({
  products: [],
  filters: {
    category: 'all',
    minPrice: 0,
    maxPrice: 1000,
    inStock: false
  },
  sort: 'name',
  view: 'grid'
});

// Add computed properties
Collections.computed(catalog, {
  filteredProducts() {
    return this.products.filter(p => {
      if (this.filters.category !== 'all' && p.category !== this.filters.category) {
        return false;
      }
      if (p.price < this.filters.minPrice || p.price > this.filters.maxPrice) {
        return false;
      }
      if (this.filters.inStock && !p.inStock) {
        return false;
      }
      return true;
    });
  },
  sortedProducts() {
    const products = [...this.filteredProducts];
    if (this.sort === 'price-low') {
      return products.sort((a, b) => a.price - b.price);
    }
    if (this.sort === 'price-high') {
      return products.sort((a, b) => b.price - a.price);
    }
    return products.sort((a, b) => a.name.localeCompare(b.name));
  }
});

// Set up class-based bindings
Collections.bind({
  'product-grid': function() {
    return catalog.sortedProducts.map(p => `
      <div class="product-card ${p.inStock ? 'in-stock' : 'out-of-stock'}" 
           data-id="${p.id}">
        <img src="${p.image}" class="product-image">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-price">$${p.price.toFixed(2)}</p>
        <span class="product-category">${p.category}</span>
        ${p.inStock ? 
          '<button class="add-to-cart-btn">Add to Cart</button>' : 
          '<span class="out-of-stock-label">Out of Stock</span>'}
      </div>
    `).join('');
  },
  'product-count': () => `Showing ${catalog.sortedProducts.length} products`,
  'active-filters': function() {
    const filters = [];
    if (catalog.filters.category !== 'all') filters.push(`Category: ${catalog.filters.category}`);
    if (catalog.filters.inStock) filters.push('In Stock Only');
    if (catalog.filters.minPrice > 0 || catalog.filters.maxPrice < 1000) {
      filters.push(`Price: $${catalog.filters.minPrice}-$${catalog.filters.maxPrice}`);
    }
    return filters.join(' | ') || 'No filters';
  }
});

// Set up event handlers with Collections
Collections('.category-filter').on('click', function() {
  const category = Collections(this).data('category');
  catalog.filters.category = category;
  
  Collections('.category-filter').removeClass('active');
  Collections(this).addClass('active');
});

Collections('.sort-option').on('click', function() {
  catalog.sort = Collections(this).data('sort');
  
  Collections('.sort-option').removeClass('active');
  Collections(this).addClass('active');
});

Collections('.view-toggle').on('click', function() {
  catalog.view = Collections(this).data('view');
  
  Collections('.product-grid')
    .removeClass('grid list')
    .addClass(catalog.view);
});

Collections('.stock-toggle').on('change', function() {
  catalog.filters.inStock = Collections(this).prop('checked');
});

// Handle add to cart (delegated to all product cards)
Collections('.product-grid').on('click', '.add-to-cart-btn', function() {
  const productId = Number(Collections(this).closest('.product-card').data('id'));
  const product = catalog.products.find(p => p.id === productId);
  
  if (product) {
    addToCart(product);
    Collections(this).text('Added!').prop('disabled', true);
    
    setTimeout(() => {
      Collections(this).text('Add to Cart').prop('disabled', false);
    }, 2000);
  }
});
```

### Example 2: Multi-Tab Dashboard

```javascript
const dashboard = Collections.component({
  state: {
    activeTab: 'overview',
    metrics: {
      overview: { users: 0, revenue: 0, orders: 0 },
      sales: { daily: 0, weekly: 0, monthly: 0 },
      users: { active: 0, new: 0, returning: 0 }
    },
    loading: false,
    lastUpdate: null
  },
  
  computed: {
    currentMetrics() {
      return this.metrics[this.activeTab];
    },
    formattedUpdate() {
      return this.lastUpdate 
        ? this.lastUpdate.toLocaleTimeString()
        : 'Never';
    }
  },
  
  actions: {
    async switchTab(state, tab) {
      state.activeTab = tab;
      state.loading = true;
      
      // Update all tab buttons
      Collections('.tab-btn').removeClass('active');
      Collections(`.tab-btn[data-tab="${tab}"]`).addClass('active');
      
      // Update tab panels
      Collections('.tab-panel').removeClass('active');
      Collections(`.tab-panel[data-tab="${tab}"]`).addClass('active');
      
      try {
        const data = await fetch(`/api/metrics/${tab}`).then(r => r.json());
        state.metrics[tab] = data;
        state.lastUpdate = new Date();
      } finally {
        state.loading = false;
      }
    },
    
    async refreshAll(state) {
      state.loading = true;
      
      try {
        const [overview, sales, users] = await Promise.all([
          fetch('/api/metrics/overview').then(r => r.json()),
          fetch('/api/metrics/sales').then(r => r.json()),
          fetch('/api/metrics/users').then(r => r.json())
        ]);
        
        Collections.batch(() => {
          state.metrics = { overview, sales, users };
          state.lastUpdate = new Date();
        });
      } finally {
        state.loading = false;
      }
    }
  },
  
  bindings: {
    '.metric-value': function() {
      const metrics = dashboard.currentMetrics;
      return Object.values(metrics).join(' | ');
    },
    '.last-update': () => dashboard.formattedUpdate,
    '.loading-indicator': {
      style: () => ({
        display: dashboard.loading ? 'block' : 'none'
      })
    }
  },
  
  mounted() {
    // Initial load
    this.switchTab('overview');
    
    // Tab navigation
    Collections('.tab-btn').on('click', function() {
      const tab = Collections(this).data('tab');
      dashboard.switchTab(tab);
    });
    
    // Refresh button
    Collections('.refresh-all-btn').on('click', () => {
      dashboard.refreshAll();
    });
    
    // Auto-refresh every minute
    setInterval(() => {
      if (!dashboard.loading) {
        dashboard.refreshAll();
      }
    }, 60000);
  }
});
```

### Example 3: Theme Manager with Class Updates

```javascript
const themeManager = Collections.state({
  theme: 'light',
  primaryColor: '#007bff',
  fontSize: 16,
  animations: true
});

// Apply theme to all themed elements
Collections.effect(() => {
  const isDark = themeManager.theme === 'dark';
  
  Collections('.themed-bg').css({
    'background-color': isDark ? '#1a1a1a' : '#ffffff',
    'color': isDark ? '#ffffff' : '#000000'
  });
  
  Collections('.primary-color').css('color', themeManager.primaryColor);
  Collections('.primary-bg').css('background-color', themeManager.primaryColor);
  
  Collections('.text-content').css('font-size', `${themeManager.fontSize}px`);
  
  if (themeManager.animations) {
    Collections('.animated-element').addClass('with-animation');
  } else {
    Collections('.animated-element').removeClass('with-animation');
  }
});

// Theme controls
Collections('.theme-toggle').on('click', () => {
  themeManager.theme = themeManager.theme === 'light' ? 'dark' : 'light';
});

Collections('.color-picker').on('change', function() {
  themeManager.primaryColor = Collections(this).val();
});

Collections('.font-size-slider').on('input', function() {
  themeManager.fontSize = Number(Collections(this).val());
});

Collections('.animations-toggle').on('change', function() {
  themeManager.animations = Collections(this).prop('checked');
});
```

---

## Best Practices

### ✅ DO

```javascript
// Use Collections namespace consistently
const state = Collections.state({ items: [] });
Collections.computed(state, { count() { return this.items.length; } });
Collections('.item').on('click', () => { /* ... */ });

// Use Collections.bind() for class-only bindings
Collections.bind({
  'product-card': () => products.items.map(/* ... */).join(''),
  'product-count': () => products.items.length
});

// Leverage class selectors for multiple elements
Collections('.notification').addClass('active');
Collections('.theme-element').css('color', theme.color);

// Batch updates with DOM operations
Collections.batch(() => {
  state.theme = 'dark';
  state.fontSize = 18;
  Collections('.themed').addClass('dark-theme');
});
```

### ❌ DON'T

```javascript
// Don't mix namespaces unnecessarily
const state = Collections.state({ items: [] });
Elements.computed(state, { /* ... */ }); // Confusing
ReactiveUtils.watch(state, { /* ... */ }); // Inconsistent

// Don't use Collections.bind() with dot prefixes
Collections.bind({
  '.product-card': () => /* ... */ // ❌ Don't include .
});

// Use Collections.bindings() instead
Collections.bindings({
  '.product-card': () => /* ... */ // ✅ Correct
});

// Don't forget Collections targets multiple elements
Collections('.item').text('Same text'); // Sets same text on ALL .item elements
// Be mindful of this behavior
```

---

## API Quick Reference

```javascript
// State Creation
Collections.state(initialState)
Collections.createState(initialState, bindings)
Collections.ref(value)
Collections.refs(defs)
Collections.list(items)

// Reactivity
Collections.computed(state, defs)
Collections.watch(state, defs)
Collections.effect(fn)
Collections.effects(defs)
Collections.bindings(defs)

// Specialized
Collections.store(initialState, options)
Collections.component(config)
Collections.reactive(initialState) // Returns builder

// Batch Operations
Collections.batch(fn)
Collections.pause()
Collections.resume(flush)
Collections.untrack(fn)

// Utilities
Collections.updateAll(state, updates)
Collections.isReactive(value)
Collections.toRaw(value)
Collections.notify(state, key)

// Special
Collections.bind(bindingDefs) // Class-based (no . needed)
```

---

## Summary

### Key Benefits of Collections Integration

1. **Class-Based Focus** - Perfect for working with multiple elements
2. **Unified API** - Reactive state + class-based DOM manipulation
3. **Bulk Updates** - Update all elements with same class together
4. **Consistent Naming** - All methods available through Collections namespace

### Common Workflows

```javascript
// 1. Create state
const state = Collections.state({ ... });

// 2. Add reactivity
Collections.computed(state, { ... });
Collections.watch(state, { ... });

// 3. Set up class-based bindings
Collections.bind({
  'product-card': () => /* ... */,
  'status-badge': () => /* ... */
});

// 4. Handle events on multiple elements
Collections('.item').on('click', function() {
  // Handle click on any .item element
});

// 5. Batch updates
Collections.batch(() => {
  // Multiple updates
});
```

### When to Use Collections Integration

- ✅ Working primarily with class selectors
- ✅ Need to update multiple elements together
- ✅ Building grid/list-based UIs
- ✅ Managing theme/style across many elements
- ❌ Only need single element updates (use Elements)
- ❌ Not using class-based selectors

### Collections vs Elements

| Feature | Collections | Elements |
|---------|-------------|----------|
| **Primary Use** | Class selectors | ID selectors |
| **Target** | Multiple elements | Single/multiple elements |
| **Special bind()** | Class-based (no `.`) | ID-based (no `#`) |
| **Best For** | Grids, lists, themes | Forms, unique elements |

---
