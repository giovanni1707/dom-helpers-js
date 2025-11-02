[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


Core State Creation.md## Core State Creation

- **`state(initialState)`** - Create a reactive state object
- **`createState(initialState, bindingDefs)`** - Create state with auto-bindings
- **`ref(value)`** - Create a reactive reference with `.value` property
- **`refs(defs)`** - Create multiple refs from object definition
- **`collection(items)`** - Create a reactive collection/list
- **`list(items)`** - Alias for collection()
- **`form(initialValues)`** - Create a form state manager
- **`async(initialValue)`** - Create async operation state
- **`store(initialState, options)`** - Create a store with getters/actions
- **`component(config)`** - Create a component with full lifecycle
- **`reactive(initialState)`** - Fluent builder pattern for state

# Core State Creation - Complete Guide

## Overview

The reactive library provides multiple ways to create reactive state objects, each optimized for different use cases. All state objects automatically track dependencies and update the DOM when values change.

---

## `state(initialState)`

Create a basic reactive state object that tracks changes and triggers effects.

### Syntax
```javascript
const state = ReactiveUtils.state(initialState)
// or
const state = Elements.state(initialState)
```

### Parameters
- **`initialState`** (Object) - Plain object with initial properties

### Returns
- Reactive proxy object with automatic change detection

### Example
```javascript
const counter = ReactiveUtils.state({
  count: 0,
  step: 1
});

// Changes are tracked automatically
counter.count++; // Triggers any effects watching 'count'
```

### Features
- ✅ Automatic dependency tracking
- ✅ Deep reactivity (nested objects are reactive)
- ✅ Instance methods: `$computed`, `$watch`, `$batch`, `$notify`, `$update`, `$set`, `$bind`
- ✅ Access raw object via `$raw` property

### Use Cases
- Simple counters and toggles
- Form field values
- UI state management
- Any general-purpose reactive data

### Advanced Example
```javascript
const app = ReactiveUtils.state({
  user: {
    name: 'John',
    age: 30
  },
  theme: 'light'
});

// Nested properties are reactive
app.user.name = 'Jane'; // Triggers updates

// Use instance methods
app.$computed('greeting', function() {
  return `Hello, ${this.user.name}!`;
});

app.$watch('theme', (newVal, oldVal) => {
  document.body.className = newVal;
});
```

---

## `createState(initialState, bindingDefs)`

Create reactive state with automatic DOM bindings. Changes to state immediately update bound elements.

### Syntax
```javascript
const state = ReactiveUtils.createState(initialState, bindingDefs)
```

### Parameters
- **`initialState`** (Object) - Initial state properties
- **`bindingDefs`** (Object, optional) - DOM binding definitions

### Returns
- Reactive state with active DOM bindings

### Binding Definition Format
```javascript
{
  'selector': 'propertyName',           // Simple binding
  'selector': () => expression,         // Computed binding
  'selector': {                         // Multi-property binding
    prop1: 'propertyName',
    prop2: () => expression
  }
}
```

### Example
```javascript
const counter = Elements.createState(
  { count: 0 },
  {
    '#counter': 'count',
    '#doubled': () => counter.count * 2,
    '.status': {
      textContent: () => `Count: ${counter.count}`,
      className: () => counter.count > 10 ? 'high' : 'low'
    }
  }
);

counter.count++; // Automatically updates all bound elements
```

### Supported Selectors
- `#id` - Element by ID
- `.class` - Elements by class name
- `tag` - Elements by tag name
- `[attribute]` - Elements by attribute
- Any valid CSS selector

### Use Cases
- Dashboard displays
- Real-time counters and timers
- Dynamic UI updates
- Live data visualization

### Advanced Example
```javascript
const dashboard = Collections.createState(
  {
    users: 150,
    revenue: 45000,
    status: 'online'
  },
  {
    '.user-count': 'users',
    '.revenue': () => `$${dashboard.revenue.toLocaleString()}`,
    '.status-badge': {
      textContent: 'status',
      className: () => `badge badge-${dashboard.status}`,
      style: () => ({
        backgroundColor: dashboard.status === 'online' ? '#22c55e' : '#ef4444'
      })
    }
  }
);
```

---

## `ref(value)`

Create a reactive reference for a single primitive value. Ideal for simple values that need reactivity.

### Syntax
```javascript
const myRef = ReactiveUtils.ref(value)
```

### Parameters
- **`value`** (any) - Initial value (primitive or object)

### Returns
- Reactive object with `.value` property

### Example
```javascript
const count = ReactiveUtils.ref(0);
const name = ReactiveUtils.ref('John');

console.log(count.value); // 0
count.value++; // 1

// Refs work in expressions
console.log(count.valueOf()); // 1
console.log(count.toString()); // "1"
```

### Special Methods
- **`.value`** - Get/set the ref value
- **`.valueOf()`** - Returns primitive value for coercion
- **`.toString()`** - Returns string representation

### Features
- ✅ Primitive value coercion
- ✅ All instance methods (`$watch`, `$computed`, etc.)
- ✅ Can be used in templates and expressions

### Use Cases
- Single reactive values
- Toggle states
- Primitive counters
- Vue.js-style refs

### Advanced Example
```javascript
const isOpen = ReactiveUtils.ref(false);
const count = ReactiveUtils.ref(0);

// Watch changes
isOpen.$watch('value', (newVal) => {
  console.log(`Menu ${newVal ? 'opened' : 'closed'}`);
});

// Use in computed
const doubled = ReactiveUtils.ref(0);
doubled.$computed('value', () => count.value * 2);

// Bind to DOM
Elements.bind({
  'toggle-btn': {
    textContent: () => isOpen.value ? 'Close' : 'Open'
  }
});
```

---

## `refs(defs)`

Create multiple refs from an object definition. Convenient for creating several refs at once.

### Syntax
```javascript
const refsObj = ReactiveUtils.refs(definitions)
```

### Parameters
- **`definitions`** (Object) - Object where keys are ref names and values are initial values

### Returns
- Object containing multiple ref instances

### Example
```javascript
const ui = ReactiveUtils.refs({
  isOpen: false,
  count: 0,
  name: 'Guest',
  theme: 'light'
});

ui.isOpen.value = true;
ui.count.value++;
console.log(ui.name.value); // "Guest"
```

### Use Cases
- Multiple related toggles
- UI state flags
- Configuration values
- Component props

### Advanced Example
```javascript
const modal = ReactiveUtils.refs({
  isVisible: false,
  title: 'Modal',
  loading: false,
  error: null
});

// Watch multiple refs
modal.isVisible.$watch('value', (visible) => {
  document.body.style.overflow = visible ? 'hidden' : 'auto';
});

modal.loading.$watch('value', (loading) => {
  console.log(loading ? 'Loading...' : 'Ready');
});

// Use in bindings
Elements.bind({
  'modal-title': () => modal.title.value,
  'modal-spinner': {
    style: () => ({ display: modal.loading.value ? 'block' : 'none' })
  }
});
```

---

## `collection(items)` / `list(items)`

Create a reactive collection for managing arrays of items. Perfect for lists, todos, and data tables.

### Syntax
```javascript
const myList = ReactiveUtils.collection(items)
const myList = ReactiveUtils.list(items) // Alias
```

### Parameters
- **`items`** (Array, optional) - Initial array of items (default: `[]`)

### Returns
- Reactive collection with special methods

### Properties
- **`items`** - The reactive array of items

### Methods
- **`$add(item)`** - Add item to collection
- **`$remove(predicate)`** - Remove item by value or predicate function
- **`$update(predicate, updates)`** - Update item by value or predicate
- **`$clear()`** - Remove all items

### Example
```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true }
]);

// Add item
todos.$add({ id: 3, text: 'Read book', done: false });

// Remove by predicate
todos.$remove(todo => todo.id === 1);

// Update item
todos.$update(
  todo => todo.id === 2,
  { done: false }
);

// Access items
console.log(todos.items.length); // 2

// Clear all
todos.$clear();
```

### Use Cases
- Todo lists
- Shopping carts
- Data tables
- Comment threads
- User lists

### Advanced Example
```javascript
const products = ReactiveUtils.collection([
  { id: 1, name: 'Laptop', price: 999, qty: 1 },
  { id: 2, name: 'Mouse', price: 29, qty: 2 }
]);

// Computed total
products.$computed('total', function() {
  return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
});

// Computed count
products.$computed('itemCount', function() {
  return this.items.reduce((sum, item) => sum + item.qty, 0);
});

// Watch changes
products.$watch('items', (newItems) => {
  console.log(`Cart has ${newItems.length} products`);
});

// Bind to DOM
Elements.bind({
  'cart-total': () => `$${products.total.toFixed(2)}`,
  'cart-count': () => products.itemCount
});

// Update quantity
products.$update(p => p.id === 1, { qty: 2 });
```

---

## `form(initialValues)`

Create a form state manager with built-in validation, touched tracking, and submission state.

### Syntax
```javascript
const formState = ReactiveUtils.form(initialValues)
```

### Parameters
- **`initialValues`** (Object, optional) - Initial form field values (default: `{}`)

### Returns
- Reactive form state with validation support

### Properties
- **`values`** - Object containing field values
- **`errors`** - Object containing validation errors
- **`touched`** - Object tracking which fields were touched
- **`isSubmitting`** - Boolean submission state
- **`isValid`** - Computed: true if no errors exist
- **`isDirty`** - Computed: true if any field was touched

### Methods
- **`$setValue(field, value)`** - Set field value and mark as touched
- **`$setError(field, error)`** - Set validation error (or remove if null)
- **`$reset(newValues)`** - Reset form to initial or new values

### Example
```javascript
const loginForm = ReactiveUtils.form({
  email: '',
  password: ''
});

// Set values
loginForm.$setValue('email', 'user@example.com');
loginForm.$setValue('password', 'secret123');

// Validation
if (!loginForm.values.email.includes('@')) {
  loginForm.$setError('email', 'Invalid email');
}

// Check state
console.log(loginForm.isValid); // false
console.log(loginForm.isDirty); // true

// Reset
loginForm.$reset();
```

### Use Cases
- Login/signup forms
- Contact forms
- Multi-step wizards
- Settings panels
- Survey forms

### Advanced Example
```javascript
const registrationForm = ReactiveUtils.form({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Live validation
registrationForm.$watch('values', (values) => {
  // Username validation
  if (values.username.length < 3) {
    registrationForm.$setError('username', 'Must be at least 3 characters');
  } else {
    registrationForm.$setError('username', null);
  }

  // Email validation
  if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    registrationForm.$setError('email', 'Invalid email format');
  } else {
    registrationForm.$setError('email', null);
  }

  // Password match
  if (values.password !== values.confirmPassword) {
    registrationForm.$setError('confirmPassword', 'Passwords must match');
  } else {
    registrationForm.$setError('confirmPassword', null);
  }
});

// Bind to DOM
Elements.bind({
  'submit-btn': {
    disabled: () => !registrationForm.isValid || registrationForm.isSubmitting,
    textContent: () => registrationForm.isSubmitting ? 'Submitting...' : 'Register'
  },
  'username-error': () => registrationForm.errors.username || '',
  'email-error': () => registrationForm.errors.email || ''
});

// Handle submission
async function handleSubmit() {
  if (!registrationForm.isValid) return;
  
  registrationForm.isSubmitting = true;
  try {
    await api.register(registrationForm.values);
    registrationForm.$reset();
  } catch (error) {
    registrationForm.$setError('general', error.message);
  } finally {
    registrationForm.isSubmitting = false;
  }
}
```

---

## `async(initialValue)`

Create async operation state with loading, error, and data tracking. Perfect for API calls and async operations.

### Syntax
```javascript
const asyncState = ReactiveUtils.async(initialValue)
```

### Parameters
- **`initialValue`** (any, optional) - Initial data value (default: `null`)

### Returns
- Reactive async state manager

### Properties
- **`data`** - The result data
- **`loading`** - Boolean loading state
- **`error`** - Error object (null if no error)
- **`isSuccess`** - Computed: true when loaded successfully
- **`isError`** - Computed: true when error occurred

### Methods
- **`$execute(asyncFn)`** - Execute async function with state management
- **`$reset()`** - Reset to initial state

### Example
```javascript
const userData = ReactiveUtils.async(null);

// Execute async operation
async function fetchUser(id) {
  await userData.$execute(async () => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  });
}

// Check state
console.log(userData.loading); // true during fetch
console.log(userData.data); // User object when complete
console.log(userData.error); // Error if failed
```

### Use Cases
- API calls
- File uploads
- Database queries
- Long-running operations
- Data fetching

### Advanced Example
```javascript
const posts = ReactiveUtils.async([]);
const currentPost = ReactiveUtils.async(null);

// Fetch posts
posts.$execute(async () => {
  const response = await fetch('/api/posts');
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
});

// Bind loading states
Elements.bind({
  'posts-spinner': {
    style: () => ({ display: posts.loading ? 'block' : 'none' })
  },
  'posts-error': {
    textContent: () => posts.error?.message || '',
    style: () => ({ display: posts.isError ? 'block' : 'none' })
  },
  'posts-list': {
    innerHTML: () => {
      if (posts.loading) return '<p>Loading...</p>';
      if (posts.isError) return '<p>Error loading posts</p>';
      if (posts.isSuccess) {
        return posts.data.map(p => `<li>${p.title}</li>`).join('');
      }
      return '';
    }
  }
});

// Retry on error
if (posts.isError) {
  setTimeout(() => posts.$execute(fetchPosts), 3000);
}
```

### Error Handling
```javascript
const api = ReactiveUtils.async();

try {
  await api.$execute(async () => {
    throw new Error('Network error');
  });
} catch (error) {
  console.log(api.error); // Error object
  console.log(api.isError); // true
}

// Reset and retry
api.$reset();
await api.$execute(retryFunction);
```

---

## `store(initialState, options)`

Create a centralized store with getters (computed properties) and actions. Ideal for application-wide state management.

### Syntax
```javascript
const myStore = ReactiveUtils.store(initialState, options)
```

### Parameters
- **`initialState`** (Object) - Initial store state
- **`options`** (Object, optional) - Configuration object
  - **`getters`** (Object) - Computed properties
  - **`actions`** (Object) - Action methods

### Returns
- Reactive store with getters and actions

### Example
```javascript
const counterStore = ReactiveUtils.store(
  { count: 0 },
  {
    getters: {
      doubled() {
        return this.count * 2;
      },
      isEven() {
        return this.count % 2 === 0;
      }
    },
    actions: {
      increment(state, amount = 1) {
        state.count += amount;
      },
      decrement(state, amount = 1) {
        state.count -= amount;
      },
      reset(state) {
        state.count = 0;
      }
    }
  }
);

// Use actions
counterStore.increment();
counterStore.increment(5);

// Access getters
console.log(counterStore.doubled); // 12
console.log(counterStore.isEven); // true
```

### Use Cases
- Application state
- Shopping cart
- User authentication
- Theme management
- Global settings

### Advanced Example
```javascript
const appStore = ReactiveUtils.store(
  {
    user: null,
    cart: [],
    theme: 'light',
    notifications: []
  },
  {
    getters: {
      isAuthenticated() {
        return this.user !== null;
      },
      cartTotal() {
        return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      },
      cartCount() {
        return this.cart.reduce((sum, item) => sum + item.qty, 0);
      },
      unreadCount() {
        return this.notifications.filter(n => !n.read).length;
      }
    },
    actions: {
      login(state, userData) {
        state.user = userData;
        localStorage.setItem('user', JSON.stringify(userData));
      },
      logout(state) {
        state.user = null;
        state.cart = [];
        localStorage.removeItem('user');
      },
      addToCart(state, product) {
        const existing = state.cart.find(item => item.id === product.id);
        if (existing) {
          existing.qty++;
        } else {
          state.cart.push({ ...product, qty: 1 });
        }
      },
      removeFromCart(state, productId) {
        state.cart = state.cart.filter(item => item.id !== productId);
      },
      toggleTheme(state) {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        document.body.className = state.theme;
      },
      addNotification(state, message) {
        state.notifications.push({
          id: Date.now(),
          message,
          read: false,
          timestamp: new Date()
        });
      }
    }
  }
);

// Bind to DOM
Elements.bind({
  'user-name': () => appStore.user?.name || 'Guest',
  'cart-count': () => appStore.cartCount,
  'cart-total': () => `$${appStore.cartTotal.toFixed(2)}`,
  'theme-toggle': {
    textContent: () => appStore.theme === 'light' ? '🌙' : '☀️'
  },
  'notification-badge': {
    textContent: () => appStore.unreadCount,
    style: () => ({ display: appStore.unreadCount > 0 ? 'block' : 'none' })
  }
});
```

---

## `component(config)`

Create a self-contained component with state, computed properties, watchers, effects, bindings, and lifecycle hooks.

### Syntax
```javascript
const myComponent = ReactiveUtils.component(config)
```

### Parameters
- **`config`** (Object) - Component configuration
  - **`state`** (Object) - Initial state
  - **`computed`** (Object) - Computed properties
  - **`watch`** (Object) - Watchers
  - **`effects`** (Object) - Side effects
  - **`bindings`** (Object) - DOM bindings
  - **`actions`** (Object) - Action methods
  - **`mounted`** (Function) - Called after component creation
  - **`unmounted`** (Function) - Called when component is destroyed

### Returns
- Component instance with `$destroy()` method

### Example
```javascript
const timer = ReactiveUtils.component({
  state: {
    seconds: 0,
    isRunning: false
  },
  
  computed: {
    formatted() {
      const mins = Math.floor(this.seconds / 60);
      const secs = this.seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  },
  
  watch: {
    isRunning(running) {
      console.log(running ? 'Timer started' : 'Timer stopped');
    }
  },
  
  bindings: {
    '#timer-display': 'formatted',
    '#start-btn': {
      textContent: () => timer.isRunning ? 'Pause' : 'Start'
    }
  },
  
  actions: {
    start(state) {
      state.isRunning = true;
    },
    pause(state) {
      state.isRunning = false;
    },
    reset(state) {
      state.seconds = 0;
      state.isRunning = false;
    }
  },
  
  mounted() {
    this.intervalId = setInterval(() => {
      if (this.isRunning) {
        this.seconds++;
      }
    }, 1000);
  },
  
  unmounted() {
    clearInterval(this.intervalId);
  }
});

// Use component
timer.start();

// Cleanup
timer.$destroy();
```

### Use Cases
- Reusable UI widgets
- Complex forms
- Interactive dashboards
- Game components
- Animation controllers

### Advanced Example
```javascript
const todoApp = ReactiveUtils.component({
  state: {
    todos: [],
    filter: 'all',
    newTodo: ''
  },
  
  computed: {
    filteredTodos() {
      if (this.filter === 'active') {
        return this.todos.filter(t => !t.done);
      }
      if (this.filter === 'completed') {
        return this.todos.filter(t => t.done);
      }
      return this.todos;
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
    '#todo-count': () => `${todoApp.stats.active} items left`,
    '#filter-all': {
      className: () => todoApp.filter === 'all' ? 'active' : ''
    },
    '#filter-active': {
      className: () => todoApp.filter === 'active' ? 'active' : ''
    },
    '#filter-completed': {
      className: () => todoApp.filter === 'completed' ? 'active' : ''
    }
  },
  
  actions: {
    addTodo(state) {
      if (state.newTodo.trim()) {
        state.todos.push({
          id: Date.now(),
          text: state.newTodo.trim(),
          done: false
        });
        state.newTodo = '';
      }
    },
    
    toggleTodo(state, id) {
      const todo = state.todos.find(t => t.id === id);
      if (todo) todo.done = !todo.done;
    },
    
    removeTodo(state, id) {
      state.todos = state.todos.filter(t => t.id !== id);
    },
    
    setFilter(state, filter) {
      state.filter = filter;
    },
    
    clearCompleted(state) {
      state.todos = state.todos.filter(t => !t.done);
    }
  },
  
  mounted() {
    // Load from localStorage
    const saved = localStorage.getItem('todos');
    if (saved) {
      this.todos = JSON.parse(saved);
    }
    
    console.log('Todo app mounted');
  },
  
  unmounted() {
    console.log('Todo app destroyed');
  }
});
```

---

## `reactive(initialState)`

Fluent builder pattern for creating reactive state with chained configuration. Provides maximum flexibility.

### Syntax
```javascript
const builder = ReactiveUtils.reactive(initialState)
```

### Returns
- Builder object with chainable methods

### Builder Methods
- **`.computed(defs)`** - Add computed properties
- **`.watch(defs)`** - Add watchers
- **`.effect(fn)`** - Add single effect
- **`.bind(defs)`** - Add DOM bindings
- **`.action(name, fn)`** - Add single action
- **`.actions(defs)`** - Add multiple actions
- **`.build()`** - Build and return state with `destroy()` method
- **`.destroy()`** - Cleanup all effects immediately

### Properties
- **`.state`** - Access the underlying state object

### Example
```javascript
const counter = ReactiveUtils.reactive({ count: 0 })
  .computed({
    doubled() {
      return this.count * 2;
    }
  })
  .watch({
    count(newVal) {
      console.log('Count changed:', newVal);
    }
  })
  .bind({
    '#counter': 'count'
  })
  .action('increment', (state) => {
    state.count++;
  })
  .build();

counter.increment();
console.log(counter.doubled); // 2

// Cleanup
counter.destroy();
```

### Use Cases
- When you need fine control over setup
- Building reusable factories
- Complex initialization logic
- Progressive enhancement

### Advanced Example
```javascript
function createCounter(initialCount = 0, options = {}) {
  const builder = ReactiveUtils.reactive({ 
    count: initialCount,
    step: options.step || 1
  })
  .computed({
    doubled() {
      return this.count * 2;
    },
    tripled() {
      return this.count * 3;
    }
  })
  .actions({
    increment(state, amount) {
      state.count += amount || state.step;
    },
    decrement(state, amount) {
      state.count -= amount || state.step;
    },
    reset(state) {
      state.count = initialCount;
    }
  });
  
  // Optional bindings
  if (options.selector) {
    builder.bind({
      [options.selector]: 'count'
    });
  }
  
  // Optional effects
  if (options.logChanges) {
    builder.effect(() => {
      console.log('Count:', builder.state.count);
    });
  }
  
  // Optional watchers
  if (options.onCountChange) {
    builder.watch({
      count: options.onCountChange
    });
  }
  
  return builder.build();
}

// Create instances with different configs
const counter1 = createCounter(10, {
  selector: '#counter1',
  logChanges: true,
  step: 5
});

const counter2 = createCounter(0, {
  selector: '#counter2',
  onCountChange: (val) => {
    if (val > 100) alert('Limit reached!');
  }
});
```

### Without Building
```javascript
// Access state before building
const builder = ReactiveUtils.reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } });

console.log(builder.state.count); // 0
builder.state.count = 5;
console.log(builder.state.doubled); // 10

// Destroy without building
builder.destroy();
```

---

## Comparison Table

| Method | Best For | Has Lifecycle | Auto Bindings | Special Features |
|--------|----------|---------------|---------------|------------------|
| `state()` | General state | ❌ | ❌ | Simple, flexible |
| `createState()` | State + DOM | ❌ | ✅ | Immediate DOM sync |
| `ref()` | Single value | ❌ | ❌ | `.value` accessor |
| `refs()` | Multiple values | ❌ | ❌ | Batch ref creation |
| `collection()` | Arrays/Lists | ❌ | ❌ | Array methods |
| `form()` | Forms | ❌ | ❌ | Validation, touched |
| `async()` | API calls | ❌ | ❌ | Loading, error states |
| `store()` | App state | ❌ | ❌ | Getters, actions |
| `component()` | Full widget | ✅ | ✅ | Everything included |
| `reactive()` | Custom setup | ⚠️ | ⚠️ | Builder pattern |

---

## Tips & Best Practices

### When to Use What

- **Simple counter/toggle**: Use `ref()`
- **Multiple toggles**: Use `refs()`
- **Object with computed values**: Use `state()` + `$computed()`
- **State that updates DOM**: Use `createState()`
- **Todo/cart items**: Use `collection()`
- **Form with validation**: Use `form()`
- **API data fetching**: Use `async()`
- **Global app state**: Use `store()`
- **Self-contained widget**: Use `component()`
- **Need fine control**: Use `reactive()` builder

### Performance Tips

1. **Batch updates**: Use `$batch()` for multiple changes
2. **Deep reactivity**: Nested objects are automatically reactive
3. **Computed caching**: Computed properties only recalculate when dependencies change
4. **Cleanup**: Always call `$destroy()` on components when done

### Memory Management

```javascript
// Good: Cleanup when done
const comp = ReactiveUtils.component({...});
// ... use component ...
comp.$destroy(); // Removes all watchers and effects

// Good: Store cleanup functions
const cleanup = state.$watch('count', callback);
// ... later ...
cleanup(); // Stop watching

// Good: Use WeakMaps (automatic in library)
// State dependencies are stored in WeakMaps for GC
```

