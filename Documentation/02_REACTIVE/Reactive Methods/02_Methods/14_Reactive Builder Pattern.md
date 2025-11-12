# Reactive Builder Pattern - Complete Guide

## Overview

The `reactive()` function returns a builder object that provides a fluent API for creating and configuring reactive state. This builder pattern allows you to chain method calls to set up computed properties, watchers, effects, actions, and bindings in a clean, expressive way.

---

## Table of Contents

1. [Builder Pattern Overview](#builder-pattern-overview)
2. [Builder Properties](#builder-properties)
3. [Builder Methods](#builder-methods)
4. [Chaining Examples](#chaining-examples)
5. [Complete Patterns](#complete-patterns)
6. [Best Practices](#best-practices)
7. [API Quick Reference](#api-quick-reference)

---

## Builder Pattern Overview

### What is the Reactive Builder?

The reactive builder is a fluent interface returned by `reactive()` that allows you to configure reactive state using method chaining:

```javascript
const builder = ReactiveUtils.reactive({ count: 0 })
  .computed({ double() { return this.count * 2; } })
  .watch({ count(val) { console.log(val); } })
  .effect(() => { /* ... */ })
  .action('increment', (state) => { state.count++; })
  .bind({ '#counter': () => builder.state.count });

const state = builder.build();
```

### Key Benefits

1. **Fluent API** - Clean, readable method chaining
2. **Declarative** - Express intent clearly
3. **Composable** - Build complex configurations step by step
4. **Cleanup** - Automatic cleanup with `destroy()`

### Basic Structure

```javascript
const builder = ReactiveUtils.reactive(initialState)
  .computed(computedDefs)      // Returns builder
  .watch(watchDefs)            // Returns builder
  .effect(effectFn)            // Returns builder
  .bind(bindingDefs)           // Returns builder
  .action(name, actionFn)      // Returns builder
  .actions(actionDefs)         // Returns builder
  .build();                    // Returns final state
```

---

## Builder Properties

### `.state`

Access the underlying reactive state at any point during building.

**Type:** `Object` (Reactive Proxy)

**Example:**
```javascript
const builder = ReactiveUtils.reactive({ count: 0 });

// Access state during building
console.log(builder.state.count); // 0

builder
  .computed({
    double() {
      return this.count * 2;
    }
  })
  .effect(() => {
    // Can access builder.state here
    console.log('Count:', builder.state.count);
  });

// Access computed on builder.state
console.log(builder.state.double); // 0

const state = builder.build();
console.log(state === builder.state); // true
```

**Use Cases:**
- Access state during builder configuration
- Reference in effects and actions
- Debug during development
- Share state between builder methods

---

## Builder Methods

### `.computed(defs)`

Add computed properties to the state.

**Syntax:**
```javascript
builder.computed(defs)
```

**Parameters:**
- `defs` (Object) - Object with computed property definitions

**Returns:** Builder instance (for chaining)

**Example:**
```javascript
const builder = ReactiveUtils.reactive({
  firstName: 'John',
  lastName: 'Doe',
  age: 30
})
  .computed({
    fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    initials() {
      return `${this.firstName[0]}${this.lastName[0]}`;
    },
    isAdult() {
      return this.age >= 18;
    }
  });

console.log(builder.state.fullName); // 'John Doe'
console.log(builder.state.initials); // 'JD'
console.log(builder.state.isAdult); // true
```

**Advanced Example:**
```javascript
const cartBuilder = ReactiveUtils.reactive({
  items: [
    { id: 1, price: 19.99, quantity: 2 },
    { id: 2, price: 29.99, quantity: 1 }
  ],
  taxRate: 0.08,
  shippingCost: 5.99
})
  .computed({
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
  });
```

---

### `.watch(defs)`

Add watchers that react to state changes.

**Syntax:**
```javascript
builder.watch(defs)
```

**Parameters:**
- `defs` (Object) - Object with property names as keys and watcher functions as values

**Returns:** Builder instance (for chaining)

**Example:**
```javascript
const builder = ReactiveUtils.reactive({
  username: '',
  password: '',
  isValid: false
})
  .watch({
    username(newVal, oldVal) {
      console.log(`Username changed from "${oldVal}" to "${newVal}"`);
      // Trigger validation
      this.isValid = this.username.length >= 3 && this.password.length >= 6;
    },
    password(newVal, oldVal) {
      console.log('Password changed');
      // Trigger validation
      this.isValid = this.username.length >= 3 && this.password.length >= 6;
    }
  });

const state = builder.build();
state.username = 'john'; // Logs change, updates isValid
```

**Advanced Example:**
```javascript
const formBuilder = ReactiveUtils.reactive({
  values: { email: '', password: '' },
  errors: {},
  touched: {}
})
  .watch({
    'values.email'(val) {
      if (this.touched.email) {
        if (!val) {
          this.errors.email = 'Email is required';
        } else if (!val.includes('@')) {
          this.errors.email = 'Invalid email';
        } else {
          delete this.errors.email;
        }
      }
    },
    'values.password'(val) {
      if (this.touched.password) {
        if (!val) {
          this.errors.password = 'Password is required';
        } else if (val.length < 6) {
          this.errors.password = 'Password must be at least 6 characters';
        } else {
          delete this.errors.password;
        }
      }
    }
  });
```

---

### `.effect(fn)`

Add a reactive effect that runs when dependencies change.

**Syntax:**
```javascript
builder.effect(fn)
```

**Parameters:**
- `fn` (Function) - Effect function to run

**Returns:** Builder instance (for chaining)

**Example:**
```javascript
const builder = ReactiveUtils.reactive({
  count: 0,
  message: ''
})
  .effect(() => {
    console.log('State updated:', builder.state.count, builder.state.message);
  })
  .effect(() => {
    // Update DOM
    document.getElementById('counter').textContent = builder.state.count;
  })
  .effect(() => {
    // Save to localStorage
    localStorage.setItem('count', builder.state.count);
  });

const state = builder.build();
state.count = 10; // All three effects run
```

**Advanced Example:**
```javascript
const themeBuilder = ReactiveUtils.reactive({
  theme: 'light',
  primaryColor: '#007bff',
  fontSize: 16
})
  .computed({
    isDark() {
      return this.theme === 'dark';
    }
  })
  .effect(() => {
    // Apply theme to document
    document.documentElement.dataset.theme = themeBuilder.state.theme;
    document.documentElement.style.fontSize = `${themeBuilder.state.fontSize}px`;
  })
  .effect(() => {
    // Update all primary buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.style.backgroundColor = themeBuilder.state.primaryColor;
    });
  })
  .effect(() => {
    // Save preferences
    localStorage.setItem('theme-prefs', JSON.stringify({
      theme: themeBuilder.state.theme,
      primaryColor: themeBuilder.state.primaryColor,
      fontSize: themeBuilder.state.fontSize
    }));
  });
```

---

### `.bind(defs)`

Add DOM bindings that automatically update elements.

**Syntax:**
```javascript
builder.bind(defs)
```

**Parameters:**
- `defs` (Object) - Object with selectors as keys and binding definitions as values

**Returns:** Builder instance (for chaining)

**Example:**
```javascript
const builder = ReactiveUtils.reactive({
  count: 0,
  message: 'Hello'
})
  .bind({
    '#counter': () => builder.state.count,
    '#message': () => builder.state.message,
    '.status': {
      textContent: () => `Count: ${builder.state.count}`,
      className: () => builder.state.count > 10 ? 'high' : 'low'
    }
  });

const state = builder.build();
state.count = 15; // Updates #counter, .status elements
```

**Advanced Example:**
```javascript
const todoBuilder = ReactiveUtils.reactive({
  todos: [],
  filter: 'all'
})
  .computed({
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
  })
  .bind({
    '#todo-list': function() {
      return todoBuilder.state.filteredTodos.map(t => `
        <li class="${t.done ? 'done' : ''}">
          ${t.text}
        </li>
      `).join('');
    },
    '#stats': () => {
      const s = todoBuilder.state.stats;
      return `${s.active} active / ${s.completed} completed / ${s.total} total`;
    },
    '.filter-btn': {
      className: function() {
        const filter = this.dataset.filter;
        return filter === todoBuilder.state.filter ? 'btn active' : 'btn';
      }
    }
  });
```

---

### `.action(name, fn)`

Add a single named action method to the state.

**Syntax:**
```javascript
builder.action(name, fn)
```

**Parameters:**
- `name` (String) - Name of the action
- `fn` (Function) - Action function (receives state as first parameter)

**Returns:** Builder instance (for chaining)

**Example:**
```javascript
const builder = ReactiveUtils.reactive({
  count: 0
})
  .action('increment', (state) => {
    state.count++;
  })
  .action('decrement', (state) => {
    state.count--;
  })
  .action('reset', (state) => {
    state.count = 0;
  })
  .action('setCount', (state, value) => {
    state.count = value;
  });

const state = builder.build();
state.increment(); // count = 1
state.increment(); // count = 2
state.setCount(10); // count = 10
state.reset(); // count = 0
```

**Advanced Example:**
```javascript
const userBuilder = ReactiveUtils.reactive({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
})
  .action('login', async (state, credentials) => {
    state.loading = true;
    state.error = null;
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        const user = await response.json();
        state.user = user;
        state.isAuthenticated = true;
      } else {
        state.error = 'Login failed';
      }
    } catch (err) {
      state.error = err.message;
    } finally {
      state.loading = false;
    }
  })
  .action('logout', (state) => {
    state.user = null;
    state.isAuthenticated = false;
  })
  .action('updateProfile', async (state, updates) => {
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
    } finally {
      state.loading = false;
    }
  });
```

---

### `.actions(defs)`

Add multiple named action methods at once.

**Syntax:**
```javascript
builder.actions(defs)
```

**Parameters:**
- `defs` (Object) - Object with action names as keys and action functions as values

**Returns:** Builder instance (for chaining)

**Example:**
```javascript
const builder = ReactiveUtils.reactive({
  count: 0,
  step: 1
})
  .actions({
    increment(state) {
      state.count += state.step;
    },
    decrement(state) {
      state.count -= state.step;
    },
    reset(state) {
      state.count = 0;
    },
    setStep(state, value) {
      state.step = value;
    },
    multiplyCount(state, multiplier) {
      state.count *= multiplier;
    }
  });

const state = builder.build();
state.increment(); // count = 1
state.setStep(5);
state.increment(); // count = 6
```

**Advanced Example:**
```javascript
const shopBuilder = ReactiveUtils.reactive({
  products: [],
  cart: [],
  filters: { category: 'all', minPrice: 0, maxPrice: 1000 }
})
  .computed({
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
    cartTotal() {
      return this.cart.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
    }
  })
  .actions({
    async loadProducts(state) {
      const products = await fetch('/api/products').then(r => r.json());
      state.products = products;
    },
    
    addToCart(state, product) {
      const existing = state.cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
    },
    
    removeFromCart(state, productId) {
      const index = state.cart.findIndex(item => item.id === productId);
      if (index !== -1) {
        state.cart.splice(index, 1);
      }
    },
    
    updateQuantity(state, productId, quantity) {
      const item = state.cart.find(i => i.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    
    clearCart(state) {
      state.cart = [];
    },
    
    setFilter(state, filterType, value) {
      state.filters[filterType] = value;
    }
  });
```

---

### `.build()`

Finalize the builder and return the configured reactive state with a `destroy` method.

**Syntax:**
```javascript
builder.build()
```

**Parameters:** None

**Returns:** Reactive state object with `destroy()` method

**Example:**
```javascript
const builder = ReactiveUtils.reactive({ count: 0 })
  .computed({ double() { return this.count * 2; } })
  .watch({ count(val) { console.log('Count:', val); } })
  .effect(() => { console.log('Effect running'); });

// Build finalizes the configuration
const state = builder.build();

// state is the reactive object
console.log(state.count); // 0
console.log(state.double); // 0

state.count = 5; // Triggers watchers and effects

// Clean up when done
state.destroy();
```

**Important Notes:**
- Returns the same reactive state accessible via `builder.state`
- Adds a `destroy()` method for cleanup
- Should be called once configuration is complete
- State is fully functional before `build()` is called

---

### `.destroy()`

Clean up all effects, watchers, and bindings created by the builder.

**Syntax:**
```javascript
builder.destroy()
// or
state.destroy() // After build()
```

**Parameters:** None

**Returns:** `undefined`

**Example:**
```javascript
const builder = ReactiveUtils.reactive({ count: 0 })
  .effect(() => {
    console.log('Count:', builder.state.count);
  })
  .bind({
    '#counter': () => builder.state.count
  });

const state = builder.build();

// Use state...
state.count = 10;

// Clean up when component is unmounted or no longer needed
state.destroy();

// Effects and bindings are removed
state.count = 20; // No longer triggers effects or updates DOM
```

**Use Cases:**
- Component unmounting
- Cleaning up temporary state
- Removing event listeners
- Preventing memory leaks

**Advanced Example:**
```javascript
class ModalComponent {
  constructor() {
    this.builder = ReactiveUtils.reactive({
      isOpen: false,
      title: '',
      content: ''
    })
      .computed({
        modalClasses() {
          return this.isOpen ? 'modal open' : 'modal';
        }
      })
      .effect(() => {
        if (this.builder.state.isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      })
      .bind({
        '.modal': {
          className: () => this.builder.state.modalClasses
        },
        '.modal-title': () => this.builder.state.title,
        '.modal-content': () => this.builder.state.content
      })
      .actions({
        open(state, title, content) {
          state.title = title;
          state.content = content;
          state.isOpen = true;
        },
        close(state) {
          state.isOpen = false;
        }
      });
    
    this.state = this.builder.build();
  }
  
  open(title, content) {
    this.state.open(title, content);
  }
  
  close() {
    this.state.close();
  }
  
  destroy() {
    this.state.destroy();
    // Additional cleanup...
  }
}

const modal = new ModalComponent();
modal.open('Welcome', 'Hello, World!');

// Later, when modal is no longer needed
modal.destroy();
```

---

## Chaining Examples

### Example 1: Simple Counter

```javascript
const counter = ReactiveUtils.reactive({ count: 0, step: 1 })
  .computed({
    display() {
      return `Count: ${this.count}`;
    }
  })
  .watch({
    count(val) {
      console.log('Count changed to:', val);
    }
  })
  .bind({
    '#counter': () => counter.state.count,
    '#display': () => counter.state.display
  })
  .actions({
    increment(state) {
      state.count += state.step;
    },
    decrement(state) {
      state.count -= state.step;
    },
    reset(state) {
      state.count = 0;
    }
  })
  .build();

// Use the counter
counter.increment();
counter.increment();
console.log(counter.count); // 2
counter.reset();
```

### Example 2: Todo Application

```javascript
const todoApp = ReactiveUtils.reactive({
  todos: [],
  newTodo: '',
  filter: 'all'
})
  .computed({
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
  })
  .watch({
    todos(newTodos) {
      // Save to localStorage
      localStorage.setItem('todos', JSON.stringify(newTodos));
    }
  })
  .effect(() => {
    // Update title with count
    document.title = `Todos (${todoApp.state.stats.active})`;
  })
  .bind({
    '#todo-list': function() {
      return todoApp.state.filteredTodos.map(t => `
        <li class="${t.done ? 'done' : ''}" data-id="${t.id}">
          <input type="checkbox" ${t.done ? 'checked' : ''}>
          <span>${t.text}</span>
          <button class="delete">×</button>
        </li>
      `).join('');
    },
    '#stats': () => {
      const s = todoApp.state.stats;
      return `${s.active} active, ${s.completed} completed, ${s.total} total`;
    }
  })
  .actions({
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
    
    clearCompleted(state) {
      state.todos = state.todos.filter(t => !t.done);
    }
  })
  .build();

// Load saved todos
const saved = localStorage.getItem('todos');
if (saved) {
  todoApp.todos = JSON.parse(saved);
}
```

### Example 3: User Authentication

```javascript
const authSystem = ReactiveUtils.reactive({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: localStorage.getItem('token')
})
  .computed({
    isLoggedIn() {
      return this.isAuthenticated && this.user !== null;
    },
    userName() {
      return this.user?.name || 'Guest';
    },
    userInitials() {
      if (!this.user) return '?';
      return this.user.name.split(' ').map(n => n[0]).join('');
    }
  })
  .watch({
    token(newToken) {
      if (newToken) {
        localStorage.setItem('token', newToken);
      } else {
        localStorage.removeItem('token');
      }
    },
    isAuthenticated(val) {
      if (val) {
        document.body.classList.add('authenticated');
      } else {
        document.body.classList.remove('authenticated');
      }
    }
  })
  .effect(() => {
    // Update all user displays
    document.querySelectorAll('.user-name').forEach(el => {
      el.textContent = authSystem.state.userName;
    });
  })
  .bind({
    '#user-avatar': () => authSystem.state.user?.avatar || '/default-avatar.png',
    '#user-initials': () => authSystem.state.userInitials,
    '.auth-status': {
      textContent: () => authSystem.state.isLoggedIn ? 'Logged In' : 'Guest',
      className: () => authSystem.state.isLoggedIn ? 'status online' : 'status offline'
    }
  })
  .actions({
    async login(state, credentials) {
      state.loading = true;
      state.error = null;
      
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        
        if (response.ok) {
          const data = await response.json();
          state.user = data.user;
          state.token = data.token;
          state.isAuthenticated = true;
        } else {
          state.error = 'Invalid credentials';
        }
      } catch (err) {
        state.error = 'Network error';
      } finally {
        state.loading = false;
      }
    },
    
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    
    async checkAuth(state) {
      if (!state.token) return;
      
      try {
        const response = await fetch('/api/me', {
          headers: { 'Authorization': `Bearer ${state.token}` }
        });
        
        if (response.ok) {
          const user = await response.json();
          state.user = user;
          state.isAuthenticated = true;
        } else {
          state.token = null;
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    }
  })
  .build();

// Check authentication on load
authSystem.checkAuth();
```

---

## Complete Patterns

### Pattern 1: Form Management

```javascript
function createForm(config) {
  const form = ReactiveUtils.reactive({
    values: config.initialValues || {},
    errors: {},
    touched: {},
    isSubmitting: false
  })
    .computed({
      isValid() {
        return Object.keys(this.errors).length === 0;
      },
      isDirty() {
        return Object.keys(this.touched).length > 0;
      },
      canSubmit() {
        return this.isValid && !this.isSubmitting && this.isDirty;
      }
    })
    .watch(
      // Create watchers for each field
      Object.keys(config.validations || {}).reduce((acc, field) => {
        acc[`values.${field}`] = function(val) {
          if (this.touched[field]) {
            const error = config.validations[field](val, this.values);
            if (error) {
              this.errors[field] = error;
            } else {
              delete this.errors[field];
            }
          }
        };
        return acc;
      }, {})
    )
    .bind(config.bindings || {})
    .actions({
      setValue(state, field, value) {
        state.values[field] = value;
        state.touched[field] = true;
      },
      
      setError(state, field, error) {
        if (error) {
          state.errors[field] = error;
        } else {
          delete state.errors[field];
        }
      },
      
      async submit(state) {
        if (!state.isValid) return false;
        
        state.isSubmitting = true;
        
        try {
          await config.onSubmit(state.values);
          return true;
        } catch (err) {
          state.errors.form = err.message;
          return false;
        } finally {
          state.isSubmitting = false;
        }
      },
      
      reset(state) {
        state.values = config.initialValues || {};
        state.errors = {};
        state.touched = {};
      }
    })
    .build();
  
  return form;
}

// Usage
const loginForm = createForm({
  initialValues: { email: '', password: '' },
  validations: {
    email: (val) => !val ? 'Required' : !val.includes('@') ? 'Invalid email' : null,
    password: (val) => !val ? 'Required' : val.length < 6 ? 'Too short' : null
  },
  bindings: {
    '#email-error': () => loginForm.errors.email || '',
    '#password-error': () => loginForm.errors.password || '',
    '#submit-btn': {
      disabled: () => !loginForm.canSubmit
    }
  },
  onSubmit: async (values) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(values)
    });
    if (!response.ok) throw new Error('Login failed');
  }
});
```

### Pattern 2: Store Factory

```javascript
function createStore(config) {
  const builder = ReactiveUtils.reactive(config.state || {});
  
  // Add computed properties (getters)
  if (config.getters) {
    builder.computed(config.getters);
  }
  
  // Add watchers
  if (config.watch) {
    builder.watch(config.watch);
  }
  
  // Add effects
  if (config.effects) {
    Object.values(config.effects).forEach(effect => {
      builder.effect(effect);
    });
  }
  
  // Add bindings
  if (config.bindings) {
    builder.bind(config.bindings);
  }
  
  // Add actions
  if (config.actions) {
    builder.actions(config.actions);
  }
  
  const store = builder.build();
  
  // Run mounted hook
  if (config.mounted) {
    config.mounted.call(store);
  }
  
  return store;
}

// Usage
const userStore = createStore({
  state: {
    users: [],
    currentUser: null,
    loading: false
  },
  
  getters: {
    activeUsers() {
      return this.users.filter(u => u.active);
    },
    userCount() {
      return this.users.length;
    }
  },
  
  actions: {
    async loadUsers(state) {
      state.loading = true;
      try {
        const users = await fetch('/api/users').then(r => r.json());
        state.users = users;
      } finally {
        state.loading = false;
      }
    }
  },
  
  mounted() {
    this.loadUsers();
  }
});
```

### Pattern 3: Component Wrapper

```javascript
function createComponent(selector, config) {
  const component = ReactiveUtils.reactive(config.state || {});
  
  if (config.computed) {
    component.computed(config.computed);
  }
  
  if (config.watch) {
    component.watch(config.watch);
  }
  
  if (config.effects) {
    Object.values(config.effects).forEach(effect => {
      component.effect(effect);
    });
  }
  
  if (config.bindings) {
    component.bind(config.bindings);
  }
  
  if (config.actions) {
    component.actions(config.actions);
  }
  
  const state = component.build();
  
  if (config.mounted) {
    config.mounted.call(state);
  }
  
  return {
    state,
    destroy() {
      if (config.beforeDestroy) {
        config.beforeDestroy.call(state);
      }
      state.destroy();
      if (config.destroyed) {
        config.destroyed.call(state);
      }
    }
  };
}

// Usage
const todoComponent = createComponent('#todo-app', {
  state: {
    todos: [],
    filter: 'all'
  },
  
  computed: {
    filteredTodos() {
      // ... filtering logic
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
  
  beforeDestroy() {
    console.log('Cleaning up...');
  }
});
```

---

## Best Practices

### ✅ DO

```javascript
// Chain methods for cleaner code
const state = ReactiveUtils.reactive({ count: 0 })
  .computed({ double() { return this.count * 2; } })
  .watch({ count(val) { console.log(val); } })
  .action('increment', (state) => { state.count++; })
  .build();

// Access builder.state during configuration
const builder = ReactiveUtils.reactive({ count: 0 })
  .effect(() => {
    console.log(builder.state.count);
  });

// Always call build() to finalize
const state = builder.build();

// Clean up when done
state.destroy();

// Use actions for complex mutations
builder.actions({
  async loadData(state) {
    state.loading = true;
    try {
      state.data = await fetchData();
    } finally {
      state.loading = false;
    }
  }
});
```

### ❌ DON'T

```javascript
// Don't forget to call build()
const builder = ReactiveUtils.reactive({ count: 0 })
  .computed({ double() { return this.count * 2; } });
// Missing .build() - builder is not finalized

// Don't forget to clean up
const state = builder.build();
// ... use state
// Missing state.destroy() - potential memory leak

// Don't mutate state directly in complex scenarios
state.items.forEach((item, i) => {
  state.items[i] = processItem(item);
});
// Use actions instead for better organization

// Don't overcomplicate chains
const state = ReactiveUtils.reactive({ count: 0 })
  .computed({})
  .watch({})
  .effect(() => {})
  // ... 50 more chained methods
// Break into smaller, reusable pieces
```

---

## API Quick Reference

### Builder Properties

```javascript
builder.state // Access reactive state during building
```

### Builder Methods (All return builder for chaining)

```javascript
builder.computed(defs)           // Add computed properties
builder.watch(defs)              // Add watchers
builder.effect(fn)               // Add single effect
builder.bind(defs)               // Add DOM bindings
builder.action(name, fn)         // Add single action
builder.actions(defs)            // Add multiple actions
```

### Finalization

```javascript
builder.build()                  // Finalize and return state with destroy()
state.destroy()                  // Clean up all effects/bindings
builder.destroy()                // Alternative cleanup method
```

### Complete Example

```javascript
const state = ReactiveUtils.reactive({ count: 0 })
  .computed({
    double() { return this.count * 2; }
  })
  .watch({
    count(val) { console.log('Count:', val); }
  })
  .effect(() => {
    document.getElementById('counter').textContent = state.count;
  })
  .bind({
    '#counter': () => state.count
  })
  .action('increment', (state) => {
    state.count++;
  })
  .actions({
    decrement(state) { state.count--; },
    reset(state) { state.count = 0; }
  })
  .build();

// Use state
state.increment();
console.log(state.double); // Computed property

// Clean up
state.destroy();
```

---

## Summary

### Key Benefits

1. **Fluent API** - Readable, chainable method calls
2. **Declarative** - Express configuration clearly
3. **Flexible** - Access state at any point via `builder.state`
4. **Cleanup** - Built-in `destroy()` method

### Method Overview

| Method | Purpose | Returns | Chainable |
|--------|---------|---------|-----------|
| `.computed()` | Add computed props | Builder | ✅ |
| `.watch()` | Add watchers | Builder | ✅ |
| `.effect()` | Add effect | Builder | ✅ |
| `.bind()` | Add DOM bindings | Builder | ✅ |
| `.action()` | Add single action | Builder | ✅ |
| `.actions()` | Add multiple actions | Builder | ✅ |
| `.build()` | Finalize | State | ❌ |
| `.destroy()` | Clean up | undefined | ❌ |

### Common Patterns

```javascript
// 1. Simple builder
const state = ReactiveUtils.reactive(initialState)
  .computed({ ... })
  .actions({ ... })
  .build();

// 2. With bindings
const state = ReactiveUtils.reactive(initialState)
  .computed({ ... })
  .bind({ ... })
  .actions({ ... })
  .build();

// 3. Full configuration
const state = ReactiveUtils.reactive(initialState)
  .computed({ ... })
  .watch({ ... })
  .effect(() => { ... })
  .bind({ ... })
  .actions({ ... })
  .build();

// 4. Always cleanup
state.destroy();
```

### When to Use Builder Pattern

- ✅ Complex state configurations
- ✅ Need for organized, readable code
- ✅ Multiple computed properties and actions
- ✅ Need automatic cleanup
- ❌ Very simple state (use `state()` directly)
- ❌ One-off reactive values (use `ref()`)

---
