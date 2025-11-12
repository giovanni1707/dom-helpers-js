# Component Configuration - Complete Guide

## Overview

The `component()` function accepts a configuration object that defines the structure, behavior, and lifecycle of a reactive component. This configuration provides a declarative way to set up state, computed properties, watchers, effects, actions, bindings, and lifecycle hooks all in one place.

---

## Table of Contents

1. [Configuration Overview](#configuration-overview)
2. [Configuration Properties](#configuration-properties)
3. [Complete Examples](#complete-examples)
4. [Advanced Patterns](#advanced-patterns)
5. [Best Practices](#best-practices)
6. [API Quick Reference](#api-quick-reference)

---

## Configuration Overview

### Basic Structure

```javascript
const myComponent = ReactiveUtils.component({
  state: { /* initial state */ },
  computed: { /* computed properties */ },
  watch: { /* watchers */ },
  effects: { /* or array */ },
  bindings: { /* DOM bindings */ },
  actions: { /* action methods */ },
  mounted() { /* setup code */ },
  unmounted() { /* cleanup code */ }
});
```

### Minimal Component

```javascript
const counter = ReactiveUtils.component({
  state: { count: 0 }
});

console.log(counter.count); // 0
counter.count++;
```

### Full Component

```javascript
const todoApp = ReactiveUtils.component({
  state: {
    todos: [],
    filter: 'all'
  },
  
  computed: {
    filteredTodos() {
      return this.filter === 'all' 
        ? this.todos 
        : this.todos.filter(t => t.done === (this.filter === 'completed'));
    }
  },
  
  watch: {
    dateRange(range) {
      this.loadMetrics();
    }
  },
  
  bindings: {
    '#conversion-rate': () => `${userDashboard.conversionRate}%`,
    '#ctr': () => `${userDashboard.ctr}%`,
    '#views': () => userDashboard.metrics.views.toLocaleString(),
    '#clicks': () => userDashboard.metrics.clicks.toLocaleString(),
    '#conversions': () => userDashboard.metrics.conversions.toLocaleString()
  },
  
  actions: {
    async loadMetrics(state) {
      state.loading = true;
      state.error = null;
      
      try {
        const response = await fetch(`/api/metrics?range=${state.dateRange}`);
        const data = await response.json();
        state.metrics = data;
      } catch (error) {
        state.error = error.message;
      } finally {
        state.loading = false;
      }
    }
  },
  
  mounted() {
    this.loadMetrics();
  }
});
```

---

## Advanced Patterns

### Pattern 1: Reusable Component Factory

```javascript
function createListComponent(config) {
  return ReactiveUtils.component({
    state: {
      items: config.initialItems || [],
      filter: '',
      sort: 'default',
      ...config.state
    },
    
    computed: {
      filteredItems() {
        let items = this.items;
        
        if (this.filter) {
          items = items.filter(config.filterFn(this.filter));
        }
        
        if (this.sort !== 'default' && config.sortFns[this.sort]) {
          items = [...items].sort(config.sortFns[this.sort]);
        }
        
        return items;
      },
      ...config.computed
    },
    
    bindings: config.bindings,
    actions: config.actions,
    
    mounted() {
      if (config.mounted) {
        config.mounted.call(this);
      }
    }
  });
}

// Usage
const products = createListComponent({
  initialItems: [],
  filterFn: (query) => (item) => item.name.includes(query),
  sortFns: {
    name: (a, b) => a.name.localeCompare(b.name),
    price: (a, b) => a.price - b.price
  },
  bindings: {
    '#product-list': function() {
      return products.filteredItems.map(p => `<div>${p.name}</div>`).join('');
    }
  }
});
```

### Pattern 2: Composing Components

```javascript
const userComponent = ReactiveUtils.component({
  state: {
    user: null
  },
  
  actions: {
    async loadUser(state, id) {
      const response = await fetch(`/api/users/${id}`);
      state.user = await response.json();
    }
  }
});

const postsComponent = ReactiveUtils.component({
  state: {
    posts: []
  },
  
  actions: {
    async loadPosts(state, userId) {
      const response = await fetch(`/api/users/${userId}/posts`);
      state.posts = await response.json();
    }
  }
});

// Combine in parent
const profileComponent = ReactiveUtils.component({
  state: {
    userId: null
  },
  
  mounted() {
    const userId = this.userId;
    userComponent.loadUser(userId);
    postsComponent.loadPosts(userId);
  }
});
```

---

## Best Practices

### ✅ DO

```javascript
// Initialize all state properties
state: {
  count: 0,
  items: [],
  user: null
}

// Use computed for derived values
computed: {
  total() {
    return this.items.reduce((sum, item) => sum + item.value, 0);
  }
}

// Use actions for state mutations
actions: {
  addItem(state, item) {
    state.items.push(item);
  }
}

// Clean up in unmounted
unmounted() {
  if (this.timer) clearInterval(this.timer);
  if (this.listener) document.removeEventListener('click', this.listener);
}
```

### ❌ DON'T

```javascript
// Don't leave state uninitialized
state: {
  count // ❌ undefined
}

// Don't mutate state in computed
computed: {
  total() {
    this.count++; // ❌ Side effect
    return this.count;
  }
}

// Don't access component in actions
actions: {
  increment(state) {
    this.count++; // ❌ Use state parameter
  }
}

// Don't forget cleanup
mounted() {
  this.timer = setInterval(() => {}, 1000);
}
// ❌ Missing unmounted() to clear timer
```

---

## API Quick Reference

### Configuration Properties

| Property | Type | Purpose | Required |
|----------|------|---------|----------|
| **state** | Object | Initial state | ✅ |
| **computed** | Object<Function> | Computed properties | ❌ |
| **watch** | Object<Function> | Watchers | ❌ |
| **effects** | Object/Array | Effects | ❌ |
| **bindings** | Object | DOM bindings | ❌ |
| **actions** | Object<Function> | Action methods | ❌ |
| **mounted** | Function | Setup hook | ❌ |
| **unmounted** | Function | Cleanup hook | ❌ |

### Complete Template

```javascript
const component = ReactiveUtils.component({
  // Required
  state: {
    // Initial state properties
  },
  
  // Optional
  computed: {
    // Computed property functions
    // Use 'this' to access state
  },
  
  watch: {
    // Watcher functions
    // Receive (newValue, oldValue)
  },
  
  effects: {
    // Named effect functions
    // Or use array for unnamed effects
  },
  
  bindings: {
    // DOM binding definitions
    // 'selector': function or value
  },
  
  actions: {
    // Action functions
    // Receive (state, ...args)
  },
  
  mounted() {
    // Setup code
    // Access component via 'this'
  },
  
  unmounted() {
    // Cleanup code
  }
});
```

### Usage After Creation

```javascript
// Access state
console.log(component.count);

// Use computed
console.log(component.total);

// Call actions
component.increment();
component.addItem({ id: 1 });

// Destroy component
component.$destroy(); // Calls unmounted() hook
```

---

## Summary

### Configuration Benefits

1. **Declarative** - Define everything in one place
2. **Organized** - Clear separation of concerns
3. **Lifecycle** - Built-in setup and cleanup hooks
4. **Reactive** - Automatic updates and bindings

### Key Points

- **state**: Always initialize all properties
- **computed**: Pure functions, return values synchronously
- **watch**: For side effects only
- **effects**: Automatic DOM updates
- **bindings**: Declarative DOM updates
- **actions**: State mutation methods (receive state parameter)
- **mounted**: One-time setup (access via `this`)
- **unmounted**: Cleanup (clear timers, remove listeners)

### Common Pattern

```javascript
const app = ReactiveUtils.component({
  state: { /* data */ },
  computed: { /* derived */ },
  watch: { /* side effects */ },
  bindings: { /* DOM */ },
  actions: { /* mutations */ },
  mounted() { /* setup */ },
  unmounted() { /* cleanup */ }
});
```

---
    todos(newTodos) {
      localStorage.setItem('todos', JSON.stringify(newTodos));
    }
  },
  
  effects: {
    updateTitle() {
      document.title = `Todos (${todoApp.todos.length})`;
    }
  },
  
  bindings: {
    '#todo-list': function() {
      return todoApp.filteredTodos.map(t => `<li>${t.text}</li>`).join('');
    }
  },
  
  actions: {
    addTodo(state, text) {
      state.todos.push({ id: Date.now(), text, done: false });
    }
  },
  
  mounted() {
    console.log('Component mounted');
  },
  
  unmounted() {
    console.log('Component destroyed');
  }
});
```

---

## Configuration Properties

### `state`

Initial state object for the component.

**Type:** `Object`

**Description:** Defines the reactive state properties that the component will manage.

**Example:**
```javascript
const app = ReactiveUtils.component({
  state: {
    count: 0,
    message: 'Hello',
    user: null,
    items: [],
    settings: {
      theme: 'light',
      language: 'en'
    }
  }
});

console.log(app.count); // 0
console.log(app.settings.theme); // 'light'
```

**Best Practices:**
- Initialize all properties
- Use appropriate default values
- Keep state flat when possible
- Group related properties in objects

**Advanced Example:**
```javascript
const userDashboard = ReactiveUtils.component({
  state: {
    // User data
    user: {
      id: null,
      name: '',
      email: '',
      role: 'user'
    },
    
    // UI state
    ui: {
      sidebarOpen: false,
      modalOpen: false,
      loading: false
    },
    
    // Data
    notifications: [],
    metrics: {
      views: 0,
      clicks: 0,
      conversions: 0
    },
    
    // Filters
    filters: {
      dateRange: 'week',
      category: 'all'
    }
  }
});
```

---

### `computed`

Object of computed property functions.

**Type:** `Object<Function>`

**Description:** Define derived values that automatically update when their dependencies change.

**Example:**
```javascript
const cart = ReactiveUtils.component({
  state: {
    items: [
      { id: 1, price: 19.99, quantity: 2 },
      { id: 2, price: 29.99, quantity: 1 }
    ],
    taxRate: 0.08,
    shippingCost: 5.99
  },
  
  computed: {
    subtotal() {
      return this.items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
    },
    
    tax() {
      return this.subtotal * this.taxRate;
    },
    
    total() {
      return this.subtotal + this.tax + this.shippingCost;
    },
    
    itemCount() {
      return this.items.reduce((sum, item) => 
        sum + item.quantity, 0
      );
    },
    
    formattedTotal() {
      return `$${this.total.toFixed(2)}`;
    }
  }
});

console.log(cart.subtotal); // 69.97
console.log(cart.formattedTotal); // '$80.62'
```

**Best Practices:**
- Keep computations pure (no side effects)
- Reference `this` for state access
- Return values synchronously
- Chain computed properties when needed

**Advanced Example:**
```javascript
const analytics = ReactiveUtils.component({
  state: {
    data: [],
    timeRange: '7d',
    metric: 'views'
  },
  
  computed: {
    filteredData() {
      const days = parseInt(this.timeRange);
      const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
      return this.data.filter(d => d.timestamp > cutoff);
    },
    
    metricData() {
      return this.filteredData.map(d => d[this.metric]);
    },
    
    sum() {
      return this.metricData.reduce((a, b) => a + b, 0);
    },
    
    average() {
      return this.metricData.length ? this.sum / this.metricData.length : 0;
    },
    
    max() {
      return Math.max(...this.metricData, 0);
    },
    
    min() {
      return Math.min(...this.metricData, 0);
    },
    
    trend() {
      if (this.metricData.length < 2) return 'stable';
      const recent = this.metricData.slice(-3).reduce((a, b) => a + b) / 3;
      const older = this.metricData.slice(0, 3).reduce((a, b) => a + b) / 3;
      return recent > older ? 'up' : recent < older ? 'down' : 'stable';
    }
  }
});
```

---

### `watch`

Object of watcher functions.

**Type:** `Object<Function>`

**Description:** React to state changes with side effects.

**Example:**
```javascript
const settings = ReactiveUtils.component({
  state: {
    theme: 'light',
    fontSize: 16,
    language: 'en',
    autoSave: true
  },
  
  watch: {
    theme(newTheme, oldTheme) {
      console.log(`Theme changed from ${oldTheme} to ${newTheme}`);
      document.body.dataset.theme = newTheme;
      localStorage.setItem('theme', newTheme);
    },
    
    fontSize(size) {
      document.documentElement.style.fontSize = `${size}px`;
      localStorage.setItem('fontSize', size);
    },
    
    language(lang) {
      // Load language pack
      loadLanguage(lang);
      localStorage.setItem('language', lang);
    },
    
    autoSave(enabled) {
      if (enabled) {
        console.log('Auto-save enabled');
        startAutoSave();
      } else {
        console.log('Auto-save disabled');
        stopAutoSave();
      }
    }
  }
});
```

**Best Practices:**
- Use for side effects only
- Don't modify other state properties directly
- Keep watchers focused and single-purpose
- Use actions for complex state updates

**Advanced Example:**
```javascript
const form = ReactiveUtils.component({
  state: {
    values: {
      username: '',
      email: '',
      password: ''
    },
    errors: {},
    touched: {},
    isSubmitting: false
  },
  
  watch: {
    'values.username'(val) {
      if (this.touched.username) {
        this.validateField('username', val);
      }
    },
    
    'values.email'(val) {
      if (this.touched.email) {
        this.validateField('email', val);
      }
    },
    
    'values.password'(val) {
      if (this.touched.password) {
        this.validateField('password', val);
      }
    },
    
    errors(newErrors) {
      // Update submit button state
      const hasErrors = Object.keys(newErrors).length > 0;
      document.querySelector('#submit-btn').disabled = hasErrors || this.isSubmitting;
    }
  },
  
  actions: {
    validateField(state, field, value) {
      // Validation logic
      if (field === 'email' && !value.includes('@')) {
        state.errors[field] = 'Invalid email';
      } else {
        delete state.errors[field];
      }
    }
  }
});
```

---

### `effects`

Object or array of effect functions.

**Type:** `Object<Function>` or `Array<Function>`

**Description:** Reactive effects that run when dependencies change.

**Example (Object):**
```javascript
const app = ReactiveUtils.component({
  state: {
    count: 0,
    theme: 'light'
  },
  
  effects: {
    updateTitle() {
      document.title = `Count: ${app.count}`;
    },
    
    applyTheme() {
      document.body.className = `theme-${app.theme}`;
    },
    
    logChanges() {
      console.log('State:', { count: app.count, theme: app.theme });
    }
  }
});
```

**Example (Array):**
```javascript
const app = ReactiveUtils.component({
  state: {
    count: 0,
    message: ''
  },
  
  effects: [
    () => {
      document.title = `Count: ${app.count}`;
    },
    () => {
      console.log('Message:', app.message);
    },
    () => {
      localStorage.setItem('state', JSON.stringify({
        count: app.count,
        message: app.message
      }));
    }
  ]
});
```

**Best Practices:**
- Use for automatic DOM updates
- Keep effects focused
- Avoid infinite loops
- Use object form for named effects (easier debugging)

**Advanced Example:**
```javascript
const dashboard = ReactiveUtils.component({
  state: {
    metrics: { views: 0, clicks: 0 },
    charts: { type: 'line', data: [] },
    refreshInterval: 30000
  },
  
  effects: {
    updateCharts() {
      // Redraw charts when data changes
      if (dashboard.charts.data.length > 0) {
        renderChart(dashboard.charts.type, dashboard.charts.data);
      }
    },
    
    syncMetrics() {
      // Sync metrics to backend
      debounce(() => {
        fetch('/api/metrics', {
          method: 'POST',
          body: JSON.stringify(dashboard.metrics)
        });
      }, 1000)();
    },
    
    updateRefreshTimer() {
      // Adjust refresh timer
      clearInterval(window.refreshTimer);
      window.refreshTimer = setInterval(() => {
        dashboard.loadMetrics();
      }, dashboard.refreshInterval);
    }
  }
});
```

---

### `bindings`

Object of DOM bindings.

**Type:** `Object`

**Description:** Automatically update DOM elements when state changes.

**Example:**
```javascript
const app = ReactiveUtils.component({
  state: {
    count: 0,
    user: { name: 'John', email: 'john@example.com' },
    items: []
  },
  
  bindings: {
    // Simple text binding
    '#counter': () => app.count,
    
    // Object binding
    '#user-name': {
      textContent: () => app.user.name,
      title: () => `User: ${app.user.name}`
    },
    
    // Function binding with HTML
    '#item-list': function() {
      return app.items.map(item => `
        <li>${item.name}</li>
      `).join('');
    },
    
    // Multiple properties
    '.status': {
      textContent: () => `Count: ${app.count}`,
      className: () => app.count > 10 ? 'high' : 'low',
      style: () => ({
        color: app.count > 10 ? 'red' : 'green'
      })
    }
  }
});
```

**Best Practices:**
- Use selectors that won't change
- Return complete HTML for innerHTML updates
- Use object form for multiple properties
- Avoid expensive computations in bindings

**Advanced Example:**
```javascript
const productCatalog = ReactiveUtils.component({
  state: {
    products: [],
    filters: { category: 'all', inStock: false },
    sort: 'name'
  },
  
  computed: {
    filteredProducts() {
      return this.products
        .filter(p => {
          if (this.filters.category !== 'all' && p.category !== this.filters.category) return false;
          if (this.filters.inStock && !p.inStock) return false;
          return true;
        })
        .sort((a, b) => {
          if (this.sort === 'price') return a.price - b.price;
          return a.name.localeCompare(b.name);
        });
    }
  },
  
  bindings: {
    '#product-grid': function() {
      return productCatalog.filteredProducts.map(product => `
        <div class="product-card ${product.inStock ? 'in-stock' : 'out-of-stock'}" 
             data-id="${product.id}">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p class="price">$${product.price.toFixed(2)}</p>
          <span class="category">${product.category}</span>
          ${product.inStock 
            ? '<button class="add-to-cart">Add to Cart</button>' 
            : '<span class="out-of-stock">Out of Stock</span>'}
        </div>
      `).join('');
    },
    
    '#product-count': () => productCatalog.filteredProducts.length,
    
    '#active-filters': function() {
      const filters = [];
      if (productCatalog.filters.category !== 'all') {
        filters.push(`Category: ${productCatalog.filters.category}`);
      }
      if (productCatalog.filters.inStock) {
        filters.push('In Stock Only');
      }
      return filters.length ? filters.join(' | ') : 'No filters';
    },
    
    '.sort-indicator': {
      textContent: () => `Sorted by: ${productCatalog.sort}`,
      dataset: () => ({ sort: productCatalog.sort })
    }
  }
});
```

---

### `actions`

Object of action functions.

**Type:** `Object<Function>`

**Description:** Define methods for modifying state. Actions receive state as first parameter.

**Example:**
```javascript
const counter = ReactiveUtils.component({
  state: {
    count: 0,
    step: 1,
    history: []
  },
  
  actions: {
    increment(state) {
      state.count += state.step;
      state.history.push({ action: 'increment', value: state.count });
    },
    
    decrement(state) {
      state.count -= state.step;
      state.history.push({ action: 'decrement', value: state.count });
    },
    
    reset(state) {
      state.count = 0;
      state.history = [];
    },
    
    setStep(state, value) {
      state.step = value;
    },
    
    addToCount(state, amount) {
      state.count += amount;
      state.history.push({ action: 'add', value: amount });
    }
  }
});

// Use actions
counter.increment();
counter.setStep(5);
counter.addToCount(10);
counter.reset();
```

**Best Practices:**
- Always receive state as first parameter
- Don't access component directly in actions
- Keep actions focused and single-purpose
- Return promises for async actions

**Advanced Example:**
```javascript
const userApp = ReactiveUtils.component({
  state: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  
  actions: {
    async login(state, credentials) {
      state.loading = true;
      state.error = null;
      
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        
        if (!response.ok) {
          throw new Error('Login failed');
        }
        
        const data = await response.json();
        state.user = data.user;
        state.isAuthenticated = true;
        localStorage.setItem('token', data.token);
      } catch (error) {
        state.error = error.message;
      } finally {
        state.loading = false;
      }
    },
    
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    
    async updateProfile(state, updates) {
      state.loading = true;
      
      try {
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        
        if (response.ok) {
          const updated = await response.json();
          state.user = { ...state.user, ...updated };
        }
      } catch (error) {
        state.error = error.message;
      } finally {
        state.loading = false;
      }
    },
    
    clearError(state) {
      state.error = null;
    }
  }
});
```

---

### `mounted`

Lifecycle hook called after component setup.

**Type:** `Function`

**Description:** Runs once after component is created and all reactive features are set up. Use for initialization, event listeners, and data loading.

**Example:**
```javascript
const app = ReactiveUtils.component({
  state: {
    data: [],
    initialized: false
  },
  
  actions: {
    async loadData(state) {
      const response = await fetch('/api/data');
      state.data = await response.json();
    }
  },
  
  mounted() {
    console.log('Component mounted');
    
    // Load initial data
    this.loadData();
    
    // Set up event listeners
    document.getElementById('refresh-btn').addEventListener('click', () => {
      this.loadData();
    });
    
    // Set initialized flag
    this.initialized = true;
    
    // Access component state
    console.log('Initial state:', this.data);
  }
});
```

**Best Practices:**
- Use for one-time setup
- Load initial data here
- Set up external event listeners
- Access component via `this`
- Don't return values (ignored)

**Advanced Example:**
```javascript
const dashboard = ReactiveUtils.component({
  state: {
    metrics: [],
    refreshInterval: 30000,
    autoRefresh: true
  },
  
  actions: {
    async loadMetrics(state) {
      const response = await fetch('/api/metrics');
      state.metrics = await response.json();
    }
  },
  
  mounted() {
    console.log('Dashboard mounted');
    
    // Load initial data
    this.loadMetrics();
    
    // Set up refresh timer
    this.refreshTimer = setInterval(() => {
      if (this.autoRefresh) {
        this.loadMetrics();
      }
    }, this.refreshInterval);
    
    // Set up keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyPress = (e) => {
      if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        this.loadMetrics();
      }
    });
    
    // Set up visibility change handler
    document.addEventListener('visibilitychange', this.handleVisibility = () => {
      if (!document.hidden) {
        this.loadMetrics();
      }
    });
    
    // Initialize third-party library
    this.chart = new Chart('canvas', {
      type: 'line',
      data: { datasets: [] }
    });
    
    // Load saved preferences
    const saved = localStorage.getItem('dashboard-prefs');
    if (saved) {
      const prefs = JSON.parse(saved);
      this.refreshInterval = prefs.refreshInterval || 30000;
      this.autoRefresh = prefs.autoRefresh !== false;
    }
    
    console.log('Dashboard initialized');
  },
  
  unmounted() {
    // Cleanup is done in unmounted hook
  }
});
```

---

### `unmounted`

Lifecycle hook called on component destroy.

**Type:** `Function`

**Description:** Runs when component is destroyed. Use for cleanup: remove event listeners, clear timers, destroy third-party instances.

**Example:**
```javascript
const app = ReactiveUtils.component({
  state: {
    count: 0
  },
  
  mounted() {
    // Set up timer
    this.timer = setInterval(() => {
      this.count++;
    }, 1000);
    
    // Add event listener
    this.handleClick = () => console.log('Clicked');
    document.addEventListener('click', this.handleClick);
  },
  
  unmounted() {
    console.log('Component unmounting');
    
    // Clear timer
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    // Remove event listener
    if (this.handleClick) {
      document.removeEventListener('click', this.handleClick);
    }
    
    console.log('Cleanup complete');
  }
});

// Later, destroy component
app.$destroy();
```

**Best Practices:**
- Clear all timers and intervals
- Remove all event listeners
- Destroy third-party library instances
- Save state if needed
- Clean up DOM if necessary

**Advanced Example:**
```javascript
const videoPlayer = ReactiveUtils.component({
  state: {
    playing: false,
    currentTime: 0,
    duration: 0
  },
  
  mounted() {
    // Initialize video player
    this.player = videojs('video-element', {
      controls: true,
      autoplay: false
    });
    
    // Set up event listeners
    this.player.on('play', () => {
      this.playing = true;
    });
    
    this.player.on('pause', () => {
      this.playing = false;
    });
    
    this.player.on('timeupdate', () => {
      this.currentTime = this.player.currentTime();
    });
    
    // Set up keyboard shortcuts
    this.handleKeyboard = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (this.playing) {
          this.player.pause();
        } else {
          this.player.play();
        }
      }
    };
    document.addEventListener('keydown', this.handleKeyboard);
    
    // Set up auto-save
    this.saveTimer = setInterval(() => {
      localStorage.setItem('video-progress', JSON.stringify({
        currentTime: this.currentTime,
        lastPlayed: Date.now()
      }));
    }, 10000);
    
    // Load saved progress
    const saved = localStorage.getItem('video-progress');
    if (saved) {
      const data = JSON.parse(saved);
      this.player.currentTime(data.currentTime);
    }
  },
  
  unmounted() {
    console.log('Destroying video player');
    
    // Save final state
    localStorage.setItem('video-progress', JSON.stringify({
      currentTime: this.currentTime,
      lastPlayed: Date.now()
    }));
    
    // Clear timers
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
      this.saveTimer = null;
    }
    
    // Remove event listeners
    if (this.handleKeyboard) {
      document.removeEventListener('keydown', this.handleKeyboard);
      this.handleKeyboard = null;
    }
    
    // Destroy video player
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
    
    console.log('Video player destroyed');
  }
});
```

---

## Complete Examples

### Example 1: Todo Application

```javascript
const todoApp = ReactiveUtils.component({
  state: {
    todos: [],
    newTodo: '',
    filter: 'all',
    editing: null
  },
  
  computed: {
    filteredTodos() {
      if (this.filter === 'all') return this.todos;
      if (this.filter === 'active') return this.todos.filter(t => !t.done);
      return this.todos.filter(t => t.done);
    },
    
    stats() {
      return {
        total: this.todos.length,
        active: this.todos.filter(t => !t.done).length,
        completed: this.todos.filter(t => t.done).length
      };
    }
  },
  
  watch: {
    todos(newTodos) {
      localStorage.setItem('todos', JSON.stringify(newTodos));
    }
  },
  
  effects: {
    updateTitle() {
      document.title = `Todos (${todoApp.stats.active})`;
    }
  },
  
  bindings: {
    '#todo-list': function() {
      return todoApp.filteredTodos.map(todo => `
        <li class="${todo.done ? 'done' : ''} ${todoApp.editing === todo.id ? 'editing' : ''}"
            data-id="${todo.id}">
          <input type="checkbox" ${todo.done ? 'checked' : ''}>
          <span class="todo-text">${todo.text}</span>
          <button class="edit">Edit</button>
          <button class="delete">×</button>
        </li>
      `).join('');
    },
    
    '#stats': () => {
      const s = todoApp.stats;
      return `${s.active} active, ${s.completed} completed, ${s.total} total`;
    },
    
    '.filter-btn': {
      className: function() {
        const filter = this.dataset.filter;
        return filter === todoApp.filter ? 'btn active' : 'btn';
      }
    }
  },
  
  actions: {
    addTodo(state) {
      if (!state.newTodo.trim()) return;
      
      state.todos.push({
        id: Date.now(),
        text: state.newTodo,
        done: false
      });
      
      state.newTodo = '';
    },
    
    toggleTodo(state, id) {
      const todo = state.todos.find(t => t.id === id);
      if (todo) todo.done = !todo.done;
    },
    
    deleteTodo(state, id) {
      const index = state.todos.findIndex(t => t.id === id);
      if (index !== -1) state.todos.splice(index, 1);
    },
    
    setFilter(state, filter) {
      state.filter = filter;
    },
    
    editTodo(state, id) {
      state.editing = id;
    },
    
    saveTodo(state, id, newText) {
      const todo = state.todos.find(t => t.id === id);
      if (todo) {
        todo.text = newText;
        state.editing = null;
      }
    },
    
    clearCompleted(state) {
      state.todos = state.todos.filter(t => !t.done);
    }
  },
  
  mounted() {
    console.log('Todo app mounted');
    
    // Load saved todos
    const saved = localStorage.getItem('todos');
    if (saved) {
      this.todos = JSON.parse(saved);
    }
    
    // Set up event listeners
    document.getElementById('add-todo').addEventListener('click', () => {
      this.addTodo();
    });
    
    document.getElementById('todo-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addTodo();
      }
    });
    
    document.getElementById('todo-list').addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        const id = Number(e.target.closest('li').dataset.id);
        this.toggleTodo(id);
      }
    });
    
    document.getElementById('todo-list').addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      
      const id = Number(li.dataset.id);
      
      if (e.target.classList.contains('delete')) {
        this.deleteTodo(id);
      } else if (e.target.classList.contains('edit')) {
        this.editTodo(id);
      }
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFilter(btn.dataset.filter);
      });
    });
    
    document.getElementById('clear-completed').addEventListener('click', () => {
      this.clearCompleted();
    });
  },
  
  unmounted() {
    console.log('Todo app unmounted');
  }
});
```

### Example 2: User Dashboard

```javascript
const userDashboard = ReactiveUtils.component({
  state: {
    user: null,
    metrics: {
      views: 0,
      clicks: 0,
      conversions: 0
    },
    dateRange: '7d',
    loading: false,
    error: null
  },
  
  computed: {
    conversionRate() {
      return this.metrics.clicks > 0 
        ? ((this.metrics.conversions / this.metrics.clicks) * 100).toFixed(2)
        : 0;
    },
    
    ctr() {
      return this.metrics.views > 0 
        ? ((this.metrics.clicks / this.metrics.views) * 100).toFixed(2)
        : 0;
    }
  },
  
  watch: {
