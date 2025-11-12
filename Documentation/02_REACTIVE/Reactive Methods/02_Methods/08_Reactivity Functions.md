# Reactivity Functions - Complete Guide

## Overview

The Reactivity Functions are powerful utilities that add reactive behavior to state objects. These functions enable you to create computed properties, watch for changes, execute side effects, and bind state to DOM elements. They are the building blocks of the reactive system and can be used standalone or with any reactive state object.

---

## Table of Contents

1. [computed()](#computed) - Add multiple computed properties
2. [watch()](#watch) - Add multiple watchers
3. [effect()](#effect) - Create single reactive effect
4. [effects()](#effects) - Create multiple effects
5. [bindings()](#bindings) - Create DOM bindings
6. [Comparison Table](#comparison-table)
7. [Best Practices](#best-practices)

---

## `computed(state, defs)`

Add multiple computed properties to a reactive state object. Computed properties automatically recalculate when their dependencies change and are cached until dependencies update.

### Syntax
```javascript
ReactiveUtils.computed(state, definitions)
// or
Elements.computed(state, definitions)
```

### Parameters
- **`state`** (Object) - Reactive state object
- **`definitions`** (Object) - Object where keys are property names and values are getter functions

### Returns
- The same state object (for chaining)

### Basic Example
```javascript
const cart = ReactiveUtils.state({
  items: [
    { name: 'Laptop', price: 999, qty: 1 },
    { name: 'Mouse', price: 29, qty: 2 }
  ]
});

// Add computed properties
ReactiveUtils.computed(cart, {
  total() {
    return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  },
  
  itemCount() {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  },
  
  formatted() {
    return `$${this.total.toFixed(2)}`;
  }
});

console.log(cart.total); // 1057
console.log(cart.itemCount); // 3
console.log(cart.formatted); // "$1057.00"

// Updates automatically when dependencies change
cart.items[0].qty = 2;
console.log(cart.total); // 2056
```

### Features
- ✅ **Automatic Dependency Tracking**: Computed properties automatically track which state properties they use
- ✅ **Lazy Evaluation**: Only recalculates when accessed and dependencies have changed
- ✅ **Caching**: Result is cached until dependencies update
- ✅ **Chainable**: Returns state object for method chaining
- ✅ **Nested Computeds**: Computed properties can depend on other computed properties

### Advanced Example - Nested Computeds
```javascript
const store = ReactiveUtils.state({
  products: [
    { id: 1, name: 'Phone', price: 699, category: 'electronics', inStock: true },
    { id: 2, name: 'Laptop', price: 999, category: 'electronics', inStock: true },
    { id: 3, name: 'Desk', price: 299, category: 'furniture', inStock: false }
  ],
  selectedCategory: 'all',
  searchTerm: ''
});

ReactiveUtils.computed(store, {
  // First level computed
  availableProducts() {
    return this.products.filter(p => p.inStock);
  },
  
  // Depends on another computed
  filteredProducts() {
    let products = this.availableProducts;
    
    if (this.selectedCategory !== 'all') {
      products = products.filter(p => p.category === this.selectedCategory);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(term)
      );
    }
    
    return products;
  },
  
  // Depends on filteredProducts
  totalValue() {
    return this.filteredProducts.reduce((sum, p) => sum + p.price, 0);
  },
  
  // Multiple dependencies
  summary() {
    return {
      count: this.filteredProducts.length,
      total: this.totalValue,
      categories: [...new Set(this.filteredProducts.map(p => p.category))]
    };
  }
});

console.log(store.filteredProducts.length); // 2
console.log(store.totalValue); // 1698
console.log(store.summary);
// { count: 2, total: 1698, categories: ['electronics'] }

// Change filter - all computeds update automatically
store.selectedCategory = 'electronics';
console.log(store.filteredProducts.length); // 2
```

### Advanced Example - Complex Business Logic
```javascript
const dashboard = ReactiveUtils.state({
  sales: [
    { date: '2024-01-01', amount: 1500, region: 'North' },
    { date: '2024-01-02', amount: 2300, region: 'South' },
    { date: '2024-01-03', amount: 1800, region: 'North' }
  ],
  expenses: [
    { date: '2024-01-01', amount: 500, category: 'Marketing' },
    { date: '2024-01-02', amount: 800, category: 'Operations' }
  ],
  targetRevenue: 10000
});

ReactiveUtils.computed(dashboard, {
  totalSales() {
    return this.sales.reduce((sum, s) => sum + s.amount, 0);
  },
  
  totalExpenses() {
    return this.expenses.reduce((sum, e) => sum + e.amount, 0);
  },
  
  netProfit() {
    return this.totalSales - this.totalExpenses;
  },
  
  profitMargin() {
    if (this.totalSales === 0) return 0;
    return (this.netProfit / this.totalSales) * 100;
  },
  
  revenueProgress() {
    return (this.totalSales / this.targetRevenue) * 100;
  },
  
  salesByRegion() {
    return this.sales.reduce((acc, sale) => {
      if (!acc[sale.region]) acc[sale.region] = 0;
      acc[sale.region] += sale.amount;
      return acc;
    }, {});
  },
  
  topRegion() {
    const byRegion = this.salesByRegion;
    return Object.keys(byRegion).reduce((top, region) => 
      byRegion[region] > byRegion[top] ? region : top
    , Object.keys(byRegion)[0]);
  },
  
  performance() {
    return {
      sales: this.totalSales,
      expenses: this.totalExpenses,
      profit: this.netProfit,
      margin: this.profitMargin.toFixed(2) + '%',
      target: this.revenueProgress.toFixed(2) + '%',
      topRegion: this.topRegion
    };
  }
});

// Bind to dashboard UI
Elements.bind({
  'total-sales': () => `$${dashboard.totalSales.toLocaleString()}`,
  'net-profit': () => `$${dashboard.netProfit.toLocaleString()}`,
  'profit-margin': () => dashboard.profitMargin.toFixed(2) + '%',
  'top-region': () => dashboard.topRegion
});
```

### Use Cases
- Shopping cart totals and counts
- Form validation states
- Dashboard statistics and KPIs
- Filtered and sorted lists
- Derived UI states
- Analytics and reporting
- Search results

### Performance Notes
- Computed properties are **lazy** - they only compute when accessed
- Results are **cached** - subsequent accesses return cached value
- Recalculation only happens when dependencies change
- Ideal for expensive calculations that are used multiple times

---

## `watch(state, defs)`

Add multiple watchers to a reactive state object. Watchers execute callbacks whenever specified properties change, perfect for side effects and reactions to state changes.

### Syntax
```javascript
const cleanup = ReactiveUtils.watch(state, definitions)
// or
const cleanup = Elements.watch(state, definitions)
```

### Parameters
- **`state`** (Object) - Reactive state object
- **`definitions`** (Object) - Object where keys are property names or functions, and values are callback functions

### Returns
- Cleanup function to stop all watchers

### Callback Signature
```javascript
callback(newValue, oldValue)
```

### Basic Example
```javascript
const user = ReactiveUtils.state({
  name: 'John',
  email: 'john@example.com',
  age: 30
});

// Add watchers
const cleanup = ReactiveUtils.watch(user, {
  // Watch single property
  name(newName, oldName) {
    console.log(`Name changed from ${oldName} to ${newName}`);
  },
  
  // Watch another property
  email(newEmail, oldEmail) {
    console.log(`Email updated: ${newEmail}`);
    // Could send verification email here
  },
  
  // Watch with complex logic
  age(newAge, oldAge) {
    if (newAge >= 18 && oldAge < 18) {
      console.log('User is now an adult!');
    }
  }
});

user.name = 'Jane'; // Logs: "Name changed from John to Jane"
user.email = 'jane@example.com'; // Logs: "Email updated: jane@example.com"

// Stop watching
cleanup();
```

### Features
- ✅ **Multiple Watchers**: Add multiple watchers at once
- ✅ **Old/New Values**: Callbacks receive both old and new values
- ✅ **Function Watchers**: Watch computed expressions
- ✅ **Cleanup**: Returns function to stop all watchers
- ✅ **Immediate Execution**: Watchers run immediately on first change

### Advanced Example - Function Watchers
```javascript
const app = ReactiveUtils.state({
  user: {
    firstName: 'John',
    lastName: 'Doe'
  },
  theme: 'light',
  notifications: []
});

ReactiveUtils.watch(app, {
  // Watch computed expression
  () => app.user.firstName + ' ' + app.user.lastName(fullName, oldFullName) {
    console.log(`Full name changed to: ${fullName}`);
    document.title = fullName;
  },
  
  // Watch nested property changes
  () => app.user.firstName(newFirst) {
    console.log(`First name: ${newFirst}`);
  },
  
  // Watch array length
  () => app.notifications.length(count) {
    if (count > 0) {
      showNotificationBadge(count);
    } else {
      hideNotificationBadge();
    }
  }
});

app.user.firstName = 'Jane'; // Triggers both firstName and fullName watchers
```

### Advanced Example - Side Effects
```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  password: ''
});

// Validation watchers
ReactiveUtils.watch(form, {
  'values.username'(username) {
    if (username.length < 3) {
      form.$setError('username', 'Must be at least 3 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      form.$setError('username', 'Only letters, numbers, and underscores');
    } else {
      form.$setError('username', null);
      // Check if username is available
      checkUsernameAvailability(username);
    }
  },
  
  'values.email'(email) {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      form.$setError('email', 'Invalid email format');
    } else {
      form.$setError('email', null);
      // Send verification code
      sendVerificationCode(email);
    }
  },
  
  'values.password'(password) {
    const strength = calculatePasswordStrength(password);
    form.$setError('password', 
      strength < 3 ? 'Password too weak' : null
    );
  }
});
```

### Advanced Example - State Synchronization
```javascript
const localState = ReactiveUtils.state({
  theme: 'light',
  language: 'en',
  fontSize: 16,
  notifications: true
});

// Sync with localStorage
ReactiveUtils.watch(localState, {
  theme(newTheme) {
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  },
  
  language(newLang) {
    localStorage.setItem('language', newLang);
    i18n.changeLanguage(newLang);
  },
  
  fontSize(size) {
    localStorage.setItem('fontSize', size);
    document.documentElement.style.fontSize = size + 'px';
  },
  
  notifications(enabled) {
    localStorage.setItem('notifications', enabled);
    if (enabled) {
      requestNotificationPermission();
    }
  }
});

// Load initial values from localStorage
Object.keys(localState).forEach(key => {
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    localState[key] = JSON.parse(saved);
  }
});
```

### Advanced Example - API Synchronization
```javascript
const todoList = ReactiveUtils.state({
  todos: [],
  lastSync: null
});

// Auto-sync with server
const syncCleanup = ReactiveUtils.watch(todoList, {
  async todos(newTodos, oldTodos) {
    // Debounce API calls
    clearTimeout(this.syncTimeout);
    this.syncTimeout = setTimeout(async () => {
      try {
        await fetch('/api/todos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTodos)
        });
        todoList.lastSync = new Date();
        console.log('Todos synced with server');
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }, 1000);
  }
});

// Cleanup when done
syncCleanup();
```

### Use Cases
- Form validation
- LocalStorage synchronization
- API data syncing
- Logging and debugging
- Side effects (DOM updates, API calls)
- State history tracking
- Analytics tracking

### Best Practices
- **Debounce expensive operations**: Use setTimeout for API calls
- **Cleanup**: Always store and call cleanup function when done
- **Avoid infinite loops**: Don't modify the watched property inside its watcher
- **Keep watchers simple**: Complex logic should be in actions or computed properties

---

## `effect(fn)`

Create a single reactive effect that automatically re-runs when any reactive properties it accesses change. Effects are the foundation of the reactive system.

### Syntax
```javascript
const cleanup = ReactiveUtils.effect(fn)
// or
const cleanup = Elements.effect(fn)
```

### Parameters
- **`fn`** (Function) - Function to execute reactively

### Returns
- Cleanup function to stop the effect

### Basic Example
```javascript
const state = ReactiveUtils.state({
  count: 0,
  multiplier: 2
});

// Create effect
const cleanup = ReactiveUtils.effect(() => {
  console.log(`Result: ${state.count * state.multiplier}`);
});
// Immediately logs: "Result: 0"

state.count = 5;
// Logs: "Result: 10"

state.multiplier = 3;
// Logs: "Result: 15"

// Stop effect
cleanup();
state.count = 10; // No longer logs
```

### Features
- ✅ **Automatic Tracking**: Automatically tracks all reactive properties accessed
- ✅ **Immediate Execution**: Runs immediately and on every change
- ✅ **Auto Re-run**: Re-executes when any dependency changes
- ✅ **Cleanup**: Returns function to stop the effect

### Advanced Example - DOM Updates
```javascript
const ui = ReactiveUtils.state({
  userName: 'Guest',
  unreadCount: 5,
  isOnline: true
});

// Update DOM automatically
ReactiveUtils.effect(() => {
  const userEl = document.getElementById('user-name');
  if (userEl) {
    userEl.textContent = ui.userName;
  }
});

ReactiveUtils.effect(() => {
  const badgeEl = document.getElementById('notification-badge');
  if (badgeEl) {
    badgeEl.textContent = ui.unreadCount;
    badgeEl.style.display = ui.unreadCount > 0 ? 'block' : 'none';
  }
});

ReactiveUtils.effect(() => {
  const statusEl = document.getElementById('status-indicator');
  if (statusEl) {
    statusEl.className = ui.isOnline ? 'online' : 'offline';
  }
});

// All DOM updates happen automatically
ui.userName = 'John Doe';
ui.unreadCount = 3;
ui.isOnline = false;
```

### Advanced Example - Side Effects
```javascript
const app = ReactiveUtils.state({
  theme: 'light',
  notifications: [],
  currentPage: 'home'
});

// Theme effect
ReactiveUtils.effect(() => {
  document.body.className = app.theme;
  localStorage.setItem('theme', app.theme);
});

// Notification effect
ReactiveUtils.effect(() => {
  if (app.notifications.length > 0) {
    const latest = app.notifications[app.notifications.length - 1];
    showToast(latest.message, latest.type);
  }
});

// Page effect
ReactiveUtils.effect(() => {
  document.title = `MyApp - ${app.currentPage}`;
  window.scrollTo(0, 0);
  analytics.trackPageView(app.currentPage);
});
```

### Advanced Example - Computed-like Behavior
```javascript
const data = ReactiveUtils.state({
  numbers: [1, 2, 3, 4, 5]
});

// Track result in another state
const results = ReactiveUtils.state({
  sum: 0,
  average: 0,
  max: 0
});

ReactiveUtils.effect(() => {
  const nums = data.numbers;
  results.sum = nums.reduce((a, b) => a + b, 0);
  results.average = results.sum / nums.length;
  results.max = Math.max(...nums);
});

console.log(results.sum); // 15
console.log(results.average); // 3
console.log(results.max); // 5

data.numbers.push(10);
console.log(results.sum); // 25
console.log(results.max); // 10
```

### Advanced Example - Multiple Dependencies
```javascript
const game = ReactiveUtils.state({
  score: 0,
  level: 1,
  lives: 3,
  combo: 1
});

// Complex effect with multiple dependencies
ReactiveUtils.effect(() => {
  const { score, level, lives, combo } = game;
  
  // Update display
  document.getElementById('score').textContent = score;
  document.getElementById('level').textContent = level;
  document.getElementById('lives').textContent = '❤️'.repeat(lives);
  
  // Check achievements
  if (score > 1000 && level < 5) {
    game.level++;
    showMessage('Level Up!');
  }
  
  if (lives === 0) {
    gameOver();
  }
  
  // Update combo multiplier display
  if (combo > 1) {
    showComboIndicator(combo);
  }
});
```

### Use Cases
- Automatic DOM updates
- Side effects (logging, analytics)
- Synchronizing related state
- Real-time displays
- Animation triggers
- Derived calculations

### Performance Tips
- Effects run immediately and on every change
- Keep effects lightweight and fast
- Avoid expensive operations inside effects
- Use computed properties for calculations
- Use debouncing for expensive side effects

---

## `effects(defs)`

Create multiple effects from an object definition. This is a convenience method for adding several effects at once.

### Syntax
```javascript
const cleanup = ReactiveUtils.effects(definitions)
// or
const cleanup = Elements.effects(definitions)
```

### Parameters
- **`definitions`** (Object) - Object where values are effect functions

### Returns
- Cleanup function to stop all effects

### Basic Example
```javascript
const state = ReactiveUtils.state({
  temperature: 20,
  humidity: 60,
  pressure: 1013
});

// Create multiple effects
const cleanup = ReactiveUtils.effects({
  logTemperature() {
    console.log(`Temperature: ${state.temperature}°C`);
  },
  
  updateDisplay() {
    document.getElementById('temp').textContent = state.temperature;
    document.getElementById('humidity').textContent = state.humidity;
  },
  
  checkAlerts() {
    if (state.temperature > 30) {
      showAlert('High temperature!');
    }
    if (state.humidity > 80) {
      showAlert('High humidity!');
    }
  }
});

// All effects run when state changes
state.temperature = 32;

// Stop all effects
cleanup();
```

### Features
- ✅ **Multiple Effects**: Define multiple effects in one call
- ✅ **Named Effects**: Object keys provide meaningful names
- ✅ **Single Cleanup**: One cleanup function for all effects
- ✅ **Organized Code**: Group related effects together

### Advanced Example - Dashboard
```javascript
const metrics = ReactiveUtils.state({
  activeUsers: 0,
  revenue: 0,
  conversionRate: 0,
  serverLoad: 0
});

ReactiveUtils.effects({
  updateCharts() {
    updateRevenueChart(metrics.revenue);
    updateUsersChart(metrics.activeUsers);
    updateConversionChart(metrics.conversionRate);
  },
  
  updateIndicators() {
    document.getElementById('users').textContent = metrics.activeUsers;
    document.getElementById('revenue').textContent = `$${metrics.revenue}`;
    document.getElementById('conversion').textContent = 
      `${metrics.conversionRate.toFixed(2)}%`;
  },
  
  monitorHealth() {
    const loadIndicator = document.getElementById('server-load');
    loadIndicator.style.width = `${metrics.serverLoad}%`;
    
    if (metrics.serverLoad > 80) {
      loadIndicator.className = 'critical';
      notifyAdmins('High server load');
    } else if (metrics.serverLoad > 60) {
      loadIndicator.className = 'warning';
    } else {
      loadIndicator.className = 'normal';
    }
  },
  
  saveSnapshot() {
    // Debounced save to database
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      saveMetricsToDatabase(metrics);
    }, 5000);
  },
  
  trackAnalytics() {
    analytics.track('metrics_updated', {
      users: metrics.activeUsers,
      revenue: metrics.revenue,
      timestamp: Date.now()
    });
  }
});
```

### Advanced Example - Game Engine
```javascript
const gameState = ReactiveUtils.state({
  player: { x: 0, y: 0, health: 100, score: 0 },
  enemies: [],
  powerups: [],
  gameTime: 0,
  isPaused: false
});

ReactiveUtils.effects({
  renderPlayer() {
    if (!gameState.isPaused) {
      drawPlayer(gameState.player.x, gameState.player.y);
    }
  },
  
  renderEnemies() {
    if (!gameState.isPaused) {
      gameState.enemies.forEach(enemy => {
        drawEnemy(enemy.x, enemy.y, enemy.type);
      });
    }
  },
  
  updateUI() {
    document.getElementById('score').textContent = gameState.player.score;
    document.getElementById('health').style.width = 
      `${gameState.player.health}%`;
    document.getElementById('time').textContent = 
      formatTime(gameState.gameTime);
  },
  
  checkCollisions() {
    if (gameState.isPaused) return;
    
    gameState.enemies.forEach(enemy => {
      if (collides(gameState.player, enemy)) {
        gameState.player.health -= 10;
        playSound('hit');
      }
    });
    
    gameState.powerups.forEach((powerup, index) => {
      if (collides(gameState.player, powerup)) {
        applyPowerup(powerup);
        gameState.powerups.splice(index, 1);
        playSound('powerup');
      }
    });
  },
  
  saveProgress() {
    localStorage.setItem('gameState', JSON.stringify({
      score: gameState.player.score,
      health: gameState.player.health,
      time: gameState.gameTime
    }));
  }
});
```

### Advanced Example - Form System
```javascript
const formState = ReactiveUtils.form({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

ReactiveUtils.effects({
  validateUsername() {
    const { username } = formState.values;
    const usernameField = document.getElementById('username');
    
    if (username.length < 3) {
      usernameField.classList.add('invalid');
      formState.$setError('username', 'Too short');
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      usernameField.classList.add('invalid');
      formState.$setError('username', 'Invalid characters');
    } else {
      usernameField.classList.remove('invalid');
      formState.$setError('username', null);
    }
  },
  
  validateEmail() {
    const { email } = formState.values;
    const emailField = document.getElementById('email');
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      emailField.classList.add('invalid');
      formState.$setError('email', 'Invalid email');
    } else {
      emailField.classList.remove('invalid');
      formState.$setError('email', null);
    }
  },
  
  validatePasswords() {
    const { password, confirmPassword } = formState.values;
    
    if (password.length < 8) {
      formState.$setError('password', 'Must be 8+ characters');
    } else {
      formState.$setError('password', null);
    }
    
    if (password !== confirmPassword) {
      formState.$setError('confirmPassword', 'Passwords must match');
    } else {
      formState.$setError('confirmPassword', null);
    }
  },
  
  updateSubmitButton() {
    const submitBtn = document.getElementById('submit');
    submitBtn.disabled = !formState.isValid || formState.isSubmitting;
    submitBtn.textContent = formState.isSubmitting ? 'Submitting...' : 'Submit';
  },
  
  showErrors() {
    Object.entries(formState.errors).forEach(([field, error]) => {
      const errorEl = document.getElementById(`${field}-error`);
      if (errorEl) {
        errorEl.textContent = error || '';
      }
    });
  }
});
```

### Use Cases
- Multiple related side effects
- Dashboard updates
- Game rendering
- Form validation
- Analytics tracking
- State synchronization

### Best Practices
- **Group related effects**: Keep logically related effects together
- **Name meaningfully**: Use descriptive names for each effect
- **Keep effects focused**: Each effect should do one thing
- **Handle cleanup**: Always call the returned cleanup function

---

## `bindings(defs)`

Create reactive DOM bindings that automatically update elements when state changes. This is the most powerful way to connect state to the DOM.

### Syntax
```javascript
const cleanup = ReactiveUtils.bindings(definitions)
// or
const cleanup = Elements.bindings(definitions)
```

### Parameters
- **`definitions`** (Object) - Object mapping selectors to binding definitions

### Returns
- Cleanup function to stop all bindings

### Binding Types
```javascript
{
  'selector': value,                    // Simple value binding
  'selector': 'propertyName',           // Property binding
  'selector': () => expression,         // Computed binding
  'selector': {                         // Multi-property binding
    prop1: () => expression,
    prop2: 'propertyName'
  }
}
```

### Basic Example
```javascript
const counter = ReactiveUtils.state({
  count: 0,
  step: 1
});

// Create bindings
const cleanup = ReactiveUtils.bindings({
  // Simple text binding
  '#counter': () => counter.count,
  
  // Property binding
  '#step-input': {
    value: () => counter.step
  },
  
  // Multiple properties
  '#status': {
    textContent: () => `Count: ${counter.count}`,
    className: () => counter.count > 10 ? 'high' : 'low',
    style: () => ({
      color: counter.count > 10 ? 'red' : 'green'
    })
  }
});

counter.count++; // DOM updates automatically

// Stop bindings
cleanup();
```

### Supported Selectors
- `#id` - Element by ID (fastest)
- `.class` - Elements by class name
- `tag` - Elements by tag name
- `[attribute]` - Elements by attribute
- Any valid CSS selector

### Supported Properties
- **`textContent`** - Element text
- **`innerHTML`** - Element HTML
- **`value`** - Input value
- **`className`** / **`classList`** - CSS classes
- **`style`** - Inline styles (object or string)
- **`disabled`** - Disabled state
- **`checked`** - Checkbox/radio state
- **`src`** - Image/media source
- **`href`** - Link href
- **`dataset`** - Data attributes (object)
- Any valid element property or attribute

### Features
- ✅ **Auto-Update**: DOM updates automatically on state change
- ✅ **Multiple Elements**: One selector can match multiple elements
- ✅ **Type Support**: Handles strings, numbers, booleans, arrays, objects
- ✅ **Style Objects**: Set multiple styles at once
- ✅ **Class Arrays**: Set classes from arrays
- ✅ **Dataset Objects**: Set multiple data attributes

### Advanced Example - Todo List
```javascript
const todos = ReactiveUtils.state({
  items: [
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Walk dog', done: true }
  ],
  filter: 'all'
});

ReactiveUtils.bindings({
  // Todo count
  '#todo-count': () => {
    const active = todos.items.filter(t => !t.done).length;
    return `${active} ${active === 1 ? 'item' : 'items'} left`;
  },
  
  // Todo list
  '#todo-list': {
    innerHTML: () => {
      let items = todos.items;
      
      if (todos.filter === 'active') {
        items = items.filter(t => !t.done);
      } else if (todos.filter === 'completed') {
        items = items.filter(t => t.done);
      }
      
      return items.map(todo => `
        <li class="${todo.done ? 'done' : ''}">
          <input type="checkbox" ${todo.done ? 'checked' : ''} 
                 data-id="${todo.id}">
          <span>${todo.text}</span>
          <button data-id="${todo.id}">Delete</button>
        </li>
      `).join('');
    }
  },
  
  // Filter buttons
  '.filter-all': {
    className: () => todos.filter === 'all' ? 'active' : ''
  },
  '.filter-active': {
    className: () => todos.filter === 'active' ? 'active' : ''
  },
  '.filter-completed': {
    className: () => todos.filter === 'completed' ? 'active' : ''
  }
});
```

### Advanced Example - Dashboard
```javascript
const dashboard = ReactiveUtils.state({
  user: { name: 'John', avatar: '/default.jpg' },
  stats: { views: 1234, likes: 567, shares: 89 },
  notifications: [],
  isOnline: true,
  lastUpdate: new Date()
});

ReactiveUtils.bindings({
  // User info
  '#user-name': () => dashboard.user.name,
  '#user-avatar': {
    src: () => dashboard.user.avatar,
    alt: () => `${dashboard.user.name}'s avatar`
  },
  
  // Stats
  '#view-count': () => dashboard.stats.views.toLocaleString(),
  '#like-count': () => dashboard.stats.likes.toLocaleString(),
  '#share-count': () => dashboard.stats.shares.toLocaleString(),
  
  // Progress bars
  '.views-bar': {
    style: () => ({
      width: `${(dashboard.stats.views / 10000) * 100}%`,
      backgroundColor: '#3b82f6'
    })
  },
  
  // Status indicator
  '#status': {
    textContent: () => dashboard.isOnline ? 'Online' : 'Offline',
    className: () => `status ${dashboard.isOnline ? 'online' : 'offline'}`,
    style: () => ({
      color: dashboard.isOnline ? '#22c55e' : '#ef4444'
    })
  },
  
  // Notifications
  '#notification-badge': {
    textContent: () => dashboard.notifications.length,
    style: () => ({
      display: dashboard.notifications.length > 0 ? 'block' : 'none'
    })
  },
  
  '#notification-list': {
    innerHTML: () => dashboard.notifications.map(n => `
      <li class="notification ${n.type}">
        <span class="time">${formatTime(n.timestamp)}</span>
        <span class="message">${n.message}</span>
      </li>
    `).join('')
  },
  
  // Last update
  '#last-update': () => `Updated ${formatTimeAgo(dashboard.lastUpdate)}`
});
```

### Advanced Example - Form Bindings
```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  subscribe: false
});

ReactiveUtils.bindings({
  // Input values (two-way binding)
  '#username': {
    value: () => form.values.username
  },
  '#email': {
    value: () => form.values.email
  },
  '#subscribe': {
    checked: () => form.values.subscribe
  },
  
  // Validation errors
  '#username-error': () => form.errors.username || '',
  '#email-error': () => form.errors.email || '',
  
  // Error visibility
  '.username-error': {
    style: () => ({
      display: form.errors.username ? 'block' : 'none'
    })
  },
  
  // Submit button state
  '#submit-btn': {
    disabled: () => !form.isValid || form.isSubmitting,
    textContent: () => form.isSubmitting ? 'Submitting...' : 'Submit',
    className: () => form.isValid ? 'btn-primary' : 'btn-disabled'
  },
  
  // Form status
  '#form-status': {
    textContent: () => {
      if (form.isSubmitting) return 'Saving...';
      if (!form.isValid) return 'Please fix errors';
      if (!form.isDirty) return 'No changes';
      return 'Ready to submit';
    },
    className: () => {
      if (!form.isValid) return 'error';
      if (form.isDirty) return 'warning';
      return 'info';
    }
  }
});

// Two-way binding: Update state when inputs change
document.getElementById('username').addEventListener('input', e => {
  form.$setValue('username', e.target.value);
});
document.getElementById('email').addEventListener('input', e => {
  form.$setValue('email', e.target.value);
});
document.getElementById('subscribe').addEventListener('change', e => {
  form.values.subscribe = e.target.checked;
});
```

### Advanced Example - Shopping Cart
```javascript
const cart = ReactiveUtils.state({
  items: [
    { id: 1, name: 'Laptop', price: 999, qty: 1, image: '/laptop.jpg' },
    { id: 2, name: 'Mouse', price: 29, qty: 2, image: '/mouse.jpg' }
  ],
  discount: 0,
  shipping: 10,
  taxRate: 0.08
});

ReactiveUtils.computed(cart, {
  subtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  },
  tax() {
    return this.subtotal * this.taxRate;
  },
  total() {
    return this.subtotal + this.tax + this.shipping - this.discount;
  },
  itemCount() {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }
});

ReactiveUtils.bindings({
  // Cart items
  '#cart-items': {
    innerHTML: () => cart.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p class="price">$${item.price.toFixed(2)}</p>
          <div class="quantity">
            <button class="qty-minus" data-id="${item.id}">-</button>
            <span>${item.qty}</span>
            <button class="qty-plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="item-total">$${(item.price * item.qty).toFixed(2)}</div>
        <button class="remove" data-id="${item.id}">×</button>
      </div>
    `).join('')
  },
  
  // Summary
  '#subtotal': () => `$${cart.subtotal.toFixed(2)}`,
  '#tax': () => `$${cart.tax.toFixed(2)}`,
  '#shipping': () => `$${cart.shipping.toFixed(2)}`,
  '#discount': () => cart.discount > 0 ? `-$${cart.discount.toFixed(2)}` : '$0.00',
  '#total': () => `$${cart.total.toFixed(2)}`,
  
  // Cart badge
  '.cart-badge': {
    textContent: () => cart.itemCount,
    style: () => ({
      display: cart.itemCount > 0 ? 'block' : 'none'
    })
  },
  
  // Empty state
  '#empty-cart': {
    style: () => ({
      display: cart.items.length === 0 ? 'block' : 'none'
    })
  },
  
  // Checkout button
  '#checkout-btn': {
    disabled: () => cart.items.length === 0,
    textContent: () => `Checkout (${cart.itemCount} items)`
  }
});
```

### Advanced Example - Real-time Data
```javascript
const liveData = ReactiveUtils.state({
  temperature: 22,
  humidity: 60,
  pressure: 1013,
  windSpeed: 5,
  lastUpdate: Date.now(),
  alerts: []
});

ReactiveUtils.bindings({
  // Sensor values
  '#temperature': {
    textContent: () => `${liveData.temperature}°C`,
    className: () => {
      if (liveData.temperature > 30) return 'hot';
      if (liveData.temperature < 10) return 'cold';
      return 'normal';
    }
  },
  
  '#humidity': {
    textContent: () => `${liveData.humidity}%`,
    style: () => ({
      color: liveData.humidity > 70 ? '#ef4444' : '#22c55e'
    })
  },
  
  // Gauges
  '.temp-gauge': {
    style: () => ({
      transform: `rotate(${(liveData.temperature / 50) * 180}deg)`
    })
  },
  
  '.humidity-bar': {
    style: () => ({
      width: `${liveData.humidity}%`,
      backgroundColor: liveData.humidity > 70 ? '#ef4444' : '#3b82f6'
    })
  },
  
  // Alerts
  '#alert-list': {
    innerHTML: () => liveData.alerts.map(alert => `
      <div class="alert ${alert.severity}">
        <span class="icon">${alert.icon}</span>
        <span class="message">${alert.message}</span>
        <span class="time">${formatTime(alert.timestamp)}</span>
      </div>
    `).join('')
  },
  
  '#alert-count': {
    textContent: () => liveData.alerts.length,
    style: () => ({
      display: liveData.alerts.length > 0 ? 'inline' : 'none'
    })
  },
  
  // Status
  '#last-update': () => {
    const seconds = Math.floor((Date.now() - liveData.lastUpdate) / 1000);
    return `${seconds}s ago`;
  },
  
  '#connection-status': {
    textContent: () => {
      const timeSince = Date.now() - liveData.lastUpdate;
      return timeSince < 5000 ? 'Connected' : 'Disconnected';
    },
    className: () => {
      const timeSince = Date.now() - liveData.lastUpdate;
      return timeSince < 5000 ? 'connected' : 'disconnected';
    }
  }
});

// Update status every second
setInterval(() => {
  liveData.lastUpdate = liveData.lastUpdate; // Trigger update
}, 1000);
```

### Type Handling

**Primitives (string, number, boolean)**
```javascript
ReactiveUtils.bindings({
  '#text': () => 'Hello',           // Sets textContent
  '#count': () => 42,                // Sets textContent
  '#visible': () => true             // Sets textContent
});
```

**Arrays**
```javascript
ReactiveUtils.bindings({
  '#tags': () => ['vue', 'react', 'angular'],  // Joins with comma
  '.classes': {
    className: () => ['btn', 'btn-primary']    // Sets class names
  }
});
```

**Objects**
```javascript
ReactiveUtils.bindings({
  '#element': {
    style: () => ({                  // Style object
      color: 'red',
      fontSize: '16px',
      backgroundColor: '#f0f0f0'
    }),
    dataset: () => ({                // Data attributes
      userId: '123',
      role: 'admin'
    })
  }
});
```

### Use Cases
- Real-time dashboards
- Form interfaces
- Shopping carts
- Todo lists
- Live data displays
- Game UIs
- Notification systems

### Performance Tips
- **Use ID selectors**: `#id` is fastest
- **Batch DOM updates**: Multiple bindings update together
- **Avoid complex selectors**: Simple selectors perform better
- **Minimize HTML generation**: Cache template strings when possible

---

## Comparison Table

| Function | Purpose | Returns | Re-runs On | Use For |
|----------|---------|---------|------------|---------|
| `computed()` | Derived values | State | Dependency change | Calculations |
| `watch()` | Observe changes | Cleanup fn | Property change | Side effects |
| `effect()` | Auto side effect | Cleanup fn | Any dependency | DOM updates |
| `effects()` | Multiple effects | Cleanup fn | Any dependency | Grouped effects |
| `bindings()` | DOM sync | Cleanup fn | Any dependency | DOM binding |

---

## Best Practices

### 1. Use the Right Tool

```javascript
// ✅ Good: Use computed for derived values
const store = ReactiveUtils.state({ price: 100, qty: 2 });
ReactiveUtils.computed(store, {
  total() { return this.price * this.qty; }
});

// ❌ Bad: Using effect for calculations
ReactiveUtils.effect(() => {
  store.total = store.price * store.qty; // Don't do this
});
```

### 2. Cleanup Effects

```javascript
// ✅ Good: Store and call cleanup
const cleanup = ReactiveUtils.effect(() => {
  console.log(state.value);
});

// Later...
cleanup();

// ❌ Bad: Not cleaning up
ReactiveUtils.effect(() => {
  console.log(state.value);
}); // Memory leak if component is destroyed
```

### 3. Avoid Infinite Loops

```javascript
// ❌ Bad: Watcher modifies watched property
ReactiveUtils.watch(state, {
  count(newVal) {
    state.count++; // Infinite loop!
  }
});

// ✅ Good: Modify different property
ReactiveUtils.watch(state, {
  count(newVal) {
    state.doubled = newVal * 2; // Safe
  }
});
```

### 4. Batch Multiple Updates

```javascript
// ❌ Bad: Multiple separate updates
state.count = 1;
state.name = 'John';
state.active = true;
// Triggers 3 separate effect runs

// ✅ Good: Batch updates
state.$batch(() => {
  state.count = 1;
  state.name = 'John';
  state.active = true;
});
// Triggers effects only once
```

### 5. Keep Effects Simple

```javascript
// ✅ Good: Simple, focused effect
ReactiveUtils.effect(() => {
  document.getElementById('count').textContent = state.count;
});

// ❌ Bad: Complex logic in effect
ReactiveUtils.effect(() => {
  const element = document.getElementById('count');
  const value = state.count * state.multiplier + state.offset;
  const formatted = new Intl.NumberFormat('en-US').format(value);
  element.textContent = formatted;
  element.style.color = value > 100 ? 'red' : 'green';
  // Too complex - use computed properties instead
});
```

### 6. Use Computed for Expensive Calculations

```javascript
// ✅ Good: Computed caches result
ReactiveUtils.computed(state, {
  expensiveValue() {
    return this.items
      .filter(i => i.active)
      .map(i => processItem(i))
      .reduce((sum, val) => sum + val, 0);
  }
});

// Accessed multiple times, computed only once
console.log(state.expensiveValue);
console.log(state.expensiveValue);
console.log(state.expensiveValue);
```

### 7. Organize Related Effects

```javascript
// ✅ Good: Group related effects
ReactiveUtils.effects({
  updateDisplay() { /* ... */ },
  syncLocalStorage() { /* ... */ },
  trackAnalytics() { /* ... */ }
});

// ❌ Bad: Scattered individual effects
ReactiveUtils.effect(() => { /* update display */ });
ReactiveUtils.effect(() => { /* sync storage */ });
ReactiveUtils.effect(() => { /* track analytics */ });
```

### 8. Prefer Bindings for DOM Updates

```javascript
// ✅ Good: Use bindings
ReactiveUtils.bindings({
  '#counter': () => state.count,
  '#status': () => state.isActive ? 'Active' : 'Inactive'
});

// ❌ Bad: Manual effect for each element
ReactiveUtils.effect(() => {
  document.getElementById('counter').textContent = state.count;
});
ReactiveUtils.effect(() => {
  document.getElementById('status').textContent = 
    state.isActive ? 'Active' : 'Inactive';
});
```

---

## Common Patterns

### Pattern 1: Form Validation
```javascript
const form = ReactiveUtils.form({ email: '', password: '' });

ReactiveUtils.watch(form, {
  'values.email'(email) {
    if (!email.includes('@')) {
      form.$setError('email', 'Invalid email');
    } else {
      form.$setError('email', null);
    }
  },
  'values.password'(password) {
    if (password.length < 8) {
      form.$setError('password', 'Too short');
    } else {
      form.$setError('password', null);
    }
  }
});
```

### Pattern 2: Auto-save
```javascript
const doc = ReactiveUtils.state({ title: '', content: '' });

ReactiveUtils.watch(doc, {
  title() { autoSave(); },
  content() { autoSave(); }
});

function autoSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    api.save(doc);
  }, 1000);
}
```

### Pattern 3: Derived State Chain
```javascript
const store = ReactiveUtils.state({ items: [], filter: 'all' });

ReactiveUtils.computed(store, {
  filteredItems() {
    return this.items.filter(item => {
      if (this.filter === 'active') return !item.done;
      if (this.filter === 'completed') return item.done;
      return true;
    });
  },
  activeCount() {
    return this.items.filter(i => !i.done).length;
  },
  completedCount() {
    return this.items.filter(i => i.done).length;
  }
});
```

### Pattern 4: Conditional Effects
```javascript
ReactiveUtils.effect(() => {
  if (state.isAuthenticated) {
    loadUserData();
    startPolling();
  } else {
    stopPolling();
    clearUserData();
  }
});
```

---

## Performance Considerations

### Computed Properties
- ✅ Lazy evaluation - only computes when accessed
- ✅ Cached until dependencies change
- ✅ Perfect for expensive calculations
- ⚠️ Can create dependency chains

### Effects
- ⚠️ Run immediately on creation
- ⚠️ Run on every dependency change
- ⚠️ Should be lightweight and fast
- ⚠️ Can cause performance issues if overused

### Bindings
- ✅ Efficient DOM updates
- ✅ Batched updates prevent layout thrashing
- ⚠️ Complex selectors are slower
- ⚠️ innerHTML regeneration can be expensive

### Optimization Tips
1. Use `$batch()` for multiple state changes
2. Prefer computed properties over recalculating in effects
3. Use specific selectors (#id) instead of complex queries
4. Debounce expensive operations
5. Cleanup unused watchers and effects

---

## Troubleshooting

### Effect Not Running
```javascript
// Problem: Effect doesn't track dependencies
const value = state.count;
ReactiveUtils.effect(() => {
  console.log(value); // Uses closure, not reactive
});

// Solution: Access inside effect
ReactiveUtils.effect(() => {
  console.log(state.count); // Now tracked
});
```

### Infinite Loop
```javascript
// Problem: Watcher modifies watched property
ReactiveUtils.watch(state, {
  count() {
    state.count++; // Infinite loop!
  }
});

// Solution: Modify different property or use flag
let updating = false;
ReactiveUtils.watch(state, {
  count() {
    if (!updating) {
      updating = true;
      state.other = state.count * 2;
      updating = false;
    }
  }
});
```

### Binding Not Updating
```javascript
// Problem: Element doesn't exist when binding created
ReactiveUtils.bindings({
  '#late-element': () => state.value
});

// Solution: Create bindings after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  ReactiveUtils.bindings({
    '#late-element': () => state.value
  });
});
```

---

## Summary

The Reactivity Functions provide a complete toolkit for building reactive applications:

- **`computed()`** - For derived values and calculations
- **`watch()`** - For reacting to specific changes
- **`effect()`** - For automatic side effects
- **`effects()`** - For organizing multiple effects
- **`bindings()`** - For automatic DOM synchronization

Choose the right tool for each task, follow best practices, and your reactive application will be performant, maintainable, and powerful.
