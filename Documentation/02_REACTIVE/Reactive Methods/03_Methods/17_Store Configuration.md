# Store Configuration - Complete Guide

## Overview

The `store()` function accepts an options object that defines getters and actions for a reactive store. This configuration provides a Vuex-like or Redux-like pattern for managing application state with computed properties (getters) and state mutation methods (actions).

---

## Table of Contents

1. [Store Overview](#store-overview)
2. [Configuration Properties](#configuration-properties)
3. [Complete Examples](#complete-examples)
4. [Advanced Patterns](#advanced-patterns)
5. [Best Practices](#best-practices)
6. [API Quick Reference](#api-quick-reference)

---

## Store Overview

### Basic Structure

```javascript
const store = ReactiveUtils.store(
  initialState,
  {
    getters: { /* getter functions */ },
    actions: { /* action functions */ }
  }
);
```

### Minimal Store

```javascript
const counterStore = ReactiveUtils.store({ count: 0 });

console.log(counterStore.count); // 0
counterStore.count++;
```

### Full Store

```javascript
const userStore = ReactiveUtils.store(
  {
    users: [],
    currentUser: null,
    loading: false
  },
  {
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
          const response = await fetch('/api/users');
          state.users = await response.json();
        } finally {
          state.loading = false;
        }
      },
      
      setCurrentUser(state, userId) {
        state.currentUser = state.users.find(u => u.id === userId);
      }
    }
  }
);

// Use getters (computed properties)
console.log(userStore.activeUsers);
console.log(userStore.userCount);

// Call actions
userStore.loadUsers();
userStore.setCurrentUser(1);
```

---

## Configuration Properties

### `getters`

Object of getter functions that become computed properties.

**Type:** `Object<Function>`

**Description:** Define computed properties that derive values from state. Getters automatically recalculate when their dependencies change. Access state via `this` context.

**Syntax:**
```javascript
{
  getters: {
    getterName() {
      return /* computed value based on this.stateProperty */;
    }
  }
}
```

**Basic Example:**
```javascript
const cartStore = ReactiveUtils.store(
  {
    items: [
      { id: 1, name: 'Product 1', price: 19.99, quantity: 2 },
      { id: 2, name: 'Product 2', price: 29.99, quantity: 1 }
    ],
    taxRate: 0.08,
    discount: 0
  },
  {
    getters: {
      subtotal() {
        return this.items.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
      },
      
      tax() {
        return this.subtotal * this.taxRate;
      },
      
      discountAmount() {
        return this.subtotal * this.discount;
      },
      
      total() {
        return this.subtotal + this.tax - this.discountAmount;
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
  }
);

// Access getters like properties
console.log(cartStore.subtotal); // 69.97
console.log(cartStore.total); // 75.57
console.log(cartStore.formattedTotal); // '$75.57'
console.log(cartStore.itemCount); // 3
```

**Advanced Example - E-commerce Store:**
```javascript
const productStore = ReactiveUtils.store(
  {
    products: [],
    categories: [],
    filters: {
      category: 'all',
      priceRange: [0, 1000],
      inStock: false,
      searchQuery: ''
    },
    sortBy: 'name',
    sortDirection: 'asc'
  },
  {
    getters: {
      // Filter products
      filteredProducts() {
        return this.products.filter(product => {
          // Category filter
          if (this.filters.category !== 'all' && 
              product.category !== this.filters.category) {
            return false;
          }
          
          // Price range filter
          if (product.price < this.filters.priceRange[0] || 
              product.price > this.filters.priceRange[1]) {
            return false;
          }
          
          // Stock filter
          if (this.filters.inStock && !product.inStock) {
            return false;
          }
          
          // Search filter
          if (this.filters.searchQuery) {
            const query = this.filters.searchQuery.toLowerCase();
            return product.name.toLowerCase().includes(query) ||
                   product.description.toLowerCase().includes(query);
          }
          
          return true;
        });
      },
      
      // Sort products
      sortedProducts() {
        const products = [...this.filteredProducts];
        
        return products.sort((a, b) => {
          let comparison = 0;
          
          switch (this.sortBy) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'price':
              comparison = a.price - b.price;
              break;
            case 'rating':
              comparison = (b.rating || 0) - (a.rating || 0);
              break;
            case 'popularity':
              comparison = (b.sales || 0) - (a.sales || 0);
              break;
          }
          
          return this.sortDirection === 'asc' ? comparison : -comparison;
        });
      },
      
      // Product statistics
      productStats() {
        return {
          total: this.products.length,
          filtered: this.filteredProducts.length,
          inStock: this.products.filter(p => p.inStock).length,
          outOfStock: this.products.filter(p => !p.inStock).length,
          averagePrice: this.products.reduce((sum, p) => sum + p.price, 0) / 
                       this.products.length
        };
      },
      
      // Category statistics
      categoryStats() {
        return this.categories.map(category => ({
          name: category,
          count: this.products.filter(p => p.category === category).length,
          inStock: this.products.filter(p => 
            p.category === category && p.inStock
          ).length
        }));
      },
      
      // Price range for current filtered products
      priceRange() {
        if (this.filteredProducts.length === 0) {
          return { min: 0, max: 0 };
        }
        
        const prices = this.filteredProducts.map(p => p.price);
        return {
          min: Math.min(...prices),
          max: Math.max(...prices)
        };
      },
      
      // Available categories (categories with products)
      availableCategories() {
        const categoriesWithProducts = new Set(
          this.products.map(p => p.category)
        );
        return this.categories.filter(c => categoriesWithProducts.has(c));
      },
      
      // Check if filters are active
      hasActiveFilters() {
        return this.filters.category !== 'all' ||
               this.filters.inStock ||
               this.filters.searchQuery !== '' ||
               this.filters.priceRange[0] > 0 ||
               this.filters.priceRange[1] < 1000;
      }
    }
  }
);
```

**Best Practices for Getters:**

✅ **DO:**
```javascript
getters: {
  // Keep getters pure (no side effects)
  total() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  },
  
  // Chain getters
  taxAmount() {
    return this.total * this.taxRate;
  },
  
  grandTotal() {
    return this.total + this.taxAmount;
  },
  
  // Use meaningful names
  activeUserCount() {
    return this.users.filter(u => u.active).length;
  }
}
```

❌ **DON'T:**
```javascript
getters: {
  // Don't mutate state in getters
  badGetter() {
    this.count++; // ❌ Side effect
    return this.count;
  },
  
  // Don't make async calls in getters
  async asyncGetter() { // ❌ Getters should be synchronous
    const data = await fetch('/api/data');
    return data;
  },
  
  // Don't use unclear names
  get1() { // ❌ Non-descriptive name
    return this.users.length;
  }
}
```

---

### `actions`

Object of action functions for state mutations.

**Type:** `Object<Function>`

**Description:** Define methods that modify store state. Actions receive the state as their first parameter, followed by any additional arguments. Actions can be synchronous or asynchronous (return promises).

**Syntax:**
```javascript
{
  actions: {
    actionName(state, ...args) {
      state.property = value;
    }
  }
}
```

**Basic Example:**
```javascript
const todoStore = ReactiveUtils.store(
  {
    todos: [],
    filter: 'all'
  },
  {
    actions: {
      addTodo(state, text) {
        state.todos.push({
          id: Date.now(),
          text,
          done: false,
          createdAt: new Date()
        });
      },
      
      toggleTodo(state, id) {
        const todo = state.todos.find(t => t.id === id);
        if (todo) {
          todo.done = !todo.done;
        }
      },
      
      deleteTodo(state, id) {
        const index = state.todos.findIndex(t => t.id === id);
        if (index !== -1) {
          state.todos.splice(index, 1);
        }
      },
      
      setFilter(state, filter) {
        state.filter = filter;
      },
      
      clearCompleted(state) {
        state.todos = state.todos.filter(t => !t.done);
      }
    }
  }
);

// Call actions
todoStore.addTodo('Buy groceries');
todoStore.toggleTodo(1);
todoStore.setFilter('active');
todoStore.clearCompleted();
```

**Advanced Example - User Management Store:**
```javascript
const userStore = ReactiveUtils.store(
  {
    users: [],
    currentUser: null,
    roles: ['user', 'admin', 'moderator'],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0
    }
  },
  {
    getters: {
      paginatedUsers() {
        const start = (this.pagination.page - 1) * this.pagination.pageSize;
        const end = start + this.pagination.pageSize;
        return this.users.slice(start, end);
      },
      
      totalPages() {
        return Math.ceil(this.users.length / this.pagination.pageSize);
      },
      
      usersByRole() {
        return this.roles.reduce((acc, role) => {
          acc[role] = this.users.filter(u => u.role === role);
          return acc;
        }, {});
      }
    },
    
    actions: {
      // Async action - Load users
      async loadUsers(state, filters = {}) {
        state.loading = true;
        state.error = null;
        
        try {
          const queryParams = new URLSearchParams(filters);
          const response = await fetch(`/api/users?${queryParams}`);
          
          if (!response.ok) {
            throw new Error('Failed to load users');
          }
          
          const data = await response.json();
          state.users = data.users;
          state.pagination.total = data.total;
        } catch (error) {
          state.error = error.message;
          console.error('Error loading users:', error);
        } finally {
          state.loading = false;
        }
      },
      
      // Async action - Create user
      async createUser(state, userData) {
        state.loading = true;
        state.error = null;
        
        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          });
          
          if (!response.ok) {
            throw new Error('Failed to create user');
          }
          
          const newUser = await response.json();
          state.users.push(newUser);
          return newUser;
        } catch (error) {
          state.error = error.message;
          throw error;
        } finally {
          state.loading = false;
        }
      },
      
      // Async action - Update user
      async updateUser(state, userId, updates) {
        state.loading = true;
        state.error = null;
        
        try {
          const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          });
          
          if (!response.ok) {
            throw new Error('Failed to update user');
          }
          
          const updatedUser = await response.json();
          const index = state.users.findIndex(u => u.id === userId);
          
          if (index !== -1) {
            state.users[index] = { ...state.users[index], ...updatedUser };
          }
          
          if (state.currentUser?.id === userId) {
            state.currentUser = { ...state.currentUser, ...updatedUser };
          }
          
          return updatedUser;
        } catch (error) {
          state.error = error.message;
          throw error;
        } finally {
          state.loading = false;
        }
      },
      
      // Async action - Delete user
      async deleteUser(state, userId) {
        state.loading = true;
        state.error = null;
        
        try {
          const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) {
            throw new Error('Failed to delete user');
          }
          
          const index = state.users.findIndex(u => u.id === userId);
          if (index !== -1) {
            state.users.splice(index, 1);
          }
          
          if (state.currentUser?.id === userId) {
            state.currentUser = null;
          }
        } catch (error) {
          state.error = error.message;
          throw error;
        } finally {
          state.loading = false;
        }
      },
      
      // Sync action - Set current user
      setCurrentUser(state, userId) {
        state.currentUser = state.users.find(u => u.id === userId) || null;
      },
      
      // Sync action - Change user role
      changeUserRole(state, userId, newRole) {
        if (!state.roles.includes(newRole)) {
          console.error('Invalid role:', newRole);
          return;
        }
        
        const user = state.users.find(u => u.id === userId);
        if (user) {
          user.role = newRole;
        }
      },
      
      // Sync action - Pagination
      setPage(state, page) {
        if (page >= 1 && page <= this.totalPages) {
          state.pagination.page = page;
        }
      },
      
      nextPage(state) {
        if (state.pagination.page < this.totalPages) {
          state.pagination.page++;
        }
      },
      
      prevPage(state) {
        if (state.pagination.page > 1) {
          state.pagination.page--;
        }
      },
      
      // Sync action - Clear error
      clearError(state) {
        state.error = null;
      },
      
      // Batch action - Bulk update
      async bulkUpdateUsers(state, updates) {
        state.loading = true;
        state.error = null;
        
        try {
          const promises = updates.map(({ id, data }) =>
            fetch(`/api/users/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })
          );
          
          const responses = await Promise.all(promises);
          const results = await Promise.all(
            responses.map(r => r.json())
          );
          
          results.forEach(updatedUser => {
            const index = state.users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              state.users[index] = { ...state.users[index], ...updatedUser };
            }
          });
          
          return results;
        } catch (error) {
          state.error = error.message;
          throw error;
        } finally {
          state.loading = false;
        }
      }
    }
  }
);
```

**Best Practices for Actions:**

✅ **DO:**
```javascript
actions: {
  // Always receive state as first parameter
  updateCount(state, value) {
    state.count = value;
  },
  
  // Return promises for async actions
  async loadData(state) {
    state.loading = true;
    try {
      const data = await fetch('/api/data').then(r => r.json());
      state.data = data;
      return data;
    } finally {
      state.loading = false;
    }
  },
  
  // Handle errors appropriately
  async saveData(state, data) {
    try {
      await fetch('/api/save', { method: 'POST', body: JSON.stringify(data) });
    } catch (error) {
      state.error = error.message;
      throw error;
    }
  },
  
  // Use descriptive action names
  addItemToCart(state, item) {
    state.cart.push(item);
  }
}
```

❌ **DON'T:**
```javascript
actions: {
  // Don't access store directly
  badAction() {
    this.count++; // ❌ Use state parameter
  },
  
  // Don't forget state parameter
  anotherBadAction(value) { // ❌ Missing state parameter
    // Can't access state
  },
  
  // Don't use unclear names
  action1(state) { // ❌ Non-descriptive
    state.value = 10;
  }
}
```

---

## Complete Examples

### Example 1: Shopping Cart Store

```javascript
const cartStore = ReactiveUtils.store(
  {
    items: [],
    couponCode: '',
    taxRate: 0.08,
    shippingCost: 5.99,
    freeShippingThreshold: 50
  },
  {
    getters: {
      subtotal() {
        return this.items.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
      },
      
      tax() {
        return this.subtotal * this.taxRate;
      },
      
      shipping() {
        return this.subtotal >= this.freeShippingThreshold ? 0 : this.shippingCost;
      },
      
      discount() {
        if (this.couponCode === 'SAVE10') {
          return this.subtotal * 0.1;
        }
        if (this.couponCode === 'SAVE20') {
          return this.subtotal * 0.2;
        }
        return 0;
      },
      
      total() {
        return this.subtotal + this.tax + this.shipping - this.discount;
      },
      
      itemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      isEmpty() {
        return this.items.length === 0;
      },
      
      formattedTotal() {
        return `$${this.total.toFixed(2)}`;
      }
    },
    
    actions: {
      addItem(state, product) {
        const existing = state.items.find(item => item.id === product.id);
        
        if (existing) {
          existing.quantity++;
        } else {
          state.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
          });
        }
      },
      
      removeItem(state, productId) {
        const index = state.items.findIndex(item => item.id === productId);
        if (index !== -1) {
          state.items.splice(index, 1);
        }
      },
      
      updateQuantity(state, productId, quantity) {
        const item = state.items.find(i => i.id === productId);
        if (item) {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            this.removeItem(productId);
          } else {
            item.quantity = quantity;
          }
        }
      },
      
      incrementQuantity(state, productId) {
        const item = state.items.find(i => i.id === productId);
        if (item) {
          item.quantity++;
        }
      },
      
      decrementQuantity(state, productId) {
        const item = state.items.find(i => i.id === productId);
        if (item && item.quantity > 1) {
          item.quantity--;
        } else if (item) {
          this.removeItem(productId);
        }
      },
      
      applyCoupon(state, code) {
        state.couponCode = code.toUpperCase();
      },
      
      removeCoupon(state) {
        state.couponCode = '';
      },
      
      clearCart(state) {
        state.items = [];
        state.couponCode = '';
      },
      
      async checkout(state) {
        try {
          const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: state.items,
              couponCode: state.couponCode,
              total: this.total
            })
          });
          
          if (response.ok) {
            const order = await response.json();
            state.items = [];
            state.couponCode = '';
            return order;
          } else {
            throw new Error('Checkout failed');
          }
        } catch (error) {
          console.error('Checkout error:', error);
          throw error;
        }
      }
    }
  }
);

// Usage
cartStore.addItem({ id: 1, name: 'Product 1', price: 29.99 });
cartStore.addItem({ id: 2, name: 'Product 2', price: 19.99 });
cartStore.applyCoupon('SAVE10');

console.log(cartStore.itemCount); // 2
console.log(cartStore.formattedTotal); // '$48.59'

cartStore.checkout().then(order => {
  console.log('Order placed:', order);
});
```

### Example 2: Authentication Store

```javascript
const authStore = ReactiveUtils.store(
  {
    user: null,
    token: localStorage.getItem('auth_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    loading: false,
    error: null
  },
  {
    getters: {
      isAuthenticated() {
        return this.token !== null && this.user !== null;
      },
      
      userName() {
        return this.user?.name || 'Guest';
      },
      
      userRole() {
        return this.user?.role || 'guest';
      },
      
      hasPermission() {
        return (permission) => {
          if (!this.user) return false;
          return this.user.permissions?.includes(permission) || false;
        };
      },
      
      isAdmin() {
        return this.userRole === 'admin';
      }
    },
    
    actions: {
      async login(state, credentials) {
        state.loading = true;
        state.error = null;
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          });
          
          if (!response.ok) {
            throw new Error('Invalid credentials');
          }
          
          const data = await response.json();
          
          state.user = data.user;
          state.token = data.token;
          state.refreshToken = data.refreshToken;
          
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('refresh_token', data.refreshToken);
          
          return data;
        } catch (error) {
          state.error = error.message;
          throw error;
        } finally {
          state.loading = false;
        }
      },
      
      async logout(state) {
        state.loading = true;
        
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${state.token}` }
          });
        } finally {
          state.user = null;
          state.token = null;
          state.refreshToken = null;
          state.error = null;
          state.loading = false;
          
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        }
      },
      
      async refreshAuth(state) {
        if (!state.refreshToken) {
          throw new Error('No refresh token available');
        }
        
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: state.refreshToken })
          });
          
          if (!response.ok) {
            throw new Error('Token refresh failed');
          }
          
          const data = await response.json();
          
          state.token = data.token;
          localStorage.setItem('auth_token', data.token);
          
          return data;
        } catch (error) {
          // Token refresh failed, log out
          this.logout();
          throw error;
        }
      },
      
      async checkAuth(state) {
        if (!state.token) return false;
        
        try {
          const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${state.token}` }
          });
          
          if (response.ok) {
            state.user = await response.json();
            return true;
          } else {
            // Token invalid, try to refresh
            return await this.refreshAuth();
          }
        } catch (error) {
          state.error = error.message;
          return false;
        }
      },
      
      clearError(state) {
        state.error = null;
      }
    }
  }
);

// Usage
authStore.checkAuth();

// Login
authStore.login({ email: 'user@example.com', password: 'password' })
  .then(() => {
    console.log('Logged in as:', authStore.userName);
    console.log('Is admin:', authStore.isAdmin);
  });

// Check permission
if (authStore.hasPermission('edit_posts')) {
  console.log('User can edit posts');
}

// Logout
authStore.logout();
```

---

## Advanced Patterns

### Pattern 1: Module Store (Namespaced Stores)

```javascript
// User module
const userModule = {
  state: {
    list: [],
    current: null
  },
  getters: {
    activeUsers() {
      return this.list.filter(u => u.active);
    }
  },
  actions: {
    async loadUsers(state) {
      const response = await fetch('/api/users');
      state.list = await response.json();
    }
  }
};

// Product module
const productModule = {
  state: {
    list: [],
    categories: []
  },
  getters: {
    byCategory() {
      return (category) => this.list.filter(p => p.category === category);
    }
  },
  actions: {
    async loadProducts(state) {
      const response = await fetch('/api/products');
      state.list = await response.json();
    }
  }
};

// Combine modules
const rootStore = ReactiveUtils.store({
  users: userModule.state,
  products: productModule.state
}, {
  getters: {
    // User getters
    ...Object.entries(userModule.getters).reduce((acc, [key, fn]) => {
      acc[`users_${key}`] = function() {
        return fn.call(this.users);
      };
      return acc;
    }, {}),
    
    // Product getters
    ...Object.entries(productModule.getters).reduce((acc, [key, fn]) => {
      acc[`products_${key}`] = function() {
        return fn.call(this.products);
      };
      return acc;
    }, {})
  },
  actions: {
    // User actions
    ...Object.entries(userModule.actions).reduce((acc, [key, fn]) => {
      acc[`users_${key}`] = function(state, ...args) {
        return fn.call(this, state.users, ...args);
      };
      return acc;
    }, {}),
    
    // Product actions
    ...Object.entries(productModule.actions).reduce((acc, [key, fn]) => {
      acc[`products_${key}`] = function(state, ...args) {
        return fn.call(this, state.products, ...args);
      };
      return acc;
    }, {})
  }
});
```

### Pattern 2: Store Plugin System

```javascript
// Logger plugin
function loggerPlugin(store) {
  // Log all state changes
  const originalActions = { ...store };
  
  Object.keys(store).forEach(key => {
    if (typeof store[key] === 'function' && !key.startsWith('$')) {
      const original = store[key];
      store[key] = function(...args) {
        console.log(`[Action] ${key}`, args);
        const result = original.apply(this, args);
        console.log(`[State]`, ReactiveUtils.toRaw(store));
        return result;
      };
    }
  });
  
  return store;
}

// Persistence plugin
function persistencePlugin(store, key = 'store_state') {
  // Load saved state
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      const state = JSON.parse(saved);
      Object.assign(store, state);
    } catch (error) {
      console.error('Failed to load saved state:', error);
    }
  }
  
  // Save state on changes
  const originalActions = {};
  Object.keys(store).forEach(actionKey => {
    if (typeof store[actionKey] === 'function' && !actionKey.startsWith('$')) {
      originalActions[actionKey] = store[actionKey];
      store[actionKey] = function(...args) {
        const result = originalActions[actionKey].apply(this, args);
        
        // Save state after action completes
        setTimeout(() => {
          const stateToSave = ReactiveUtils.toRaw(store);
          localStorage.setItem(key, JSON.stringify(stateToSave));
        }, 0);
        
        return result;
      };
    }
  });
  
  return store;
}

// Usage with plugins
const store = ReactiveUtils.store(
  { count: 0, items: [] },
  { 
    getters: { /* ... */ },
    actions: { /* ... */ }
  }
);

// Apply plugins
loggerPlugin(store);
persistencePlugin(store, 'my_app_state');
```

---

## Best Practices

### ✅ DO

```javascript
// Use descriptive getter names
const store = ReactiveUtils.store(
  { users: [], products: [] },
  {
    getters: {
      activeUsers() {
        return this.users.filter(u => u.active);
      },
      productCount() {
        return this.products.length;
      }
    }
  }
);

// Chain getters for derived values
const store = ReactiveUtils.store(
  { items: [], taxRate: 0.08 },
  {
    getters: {
      subtotal() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
      },
      tax() {
        return this.subtotal * this.taxRate;
      },
      total() {
        return this.subtotal + this.tax;
      }
    }
  }
);

// Always receive state parameter in actions
const store = ReactiveUtils.store(
  { count: 0 },
  {
    actions: {
      increment(state) {
        state.count++;
      },
      setCount(state, value) {
        state.count = value;
      }
    }
  }
);

// Handle errors in async actions
const store = ReactiveUtils.store(
  { data: null, loading: false, error: null },
  {
    actions: {
      async loadData(state) {
        state.loading = true;
        state.error = null;
        
        try {
          const response = await fetch('/api/data');
          state.data = await response.json();
        } catch (error) {
          state.error = error.message;
        } finally {
          state.loading = false;
        }
      }
    }
  }
);
```

### ❌ DON'T

```javascript
// Don't mutate state in getters
const store = ReactiveUtils.store(
  { count: 0 },
  {
    getters: {
      badGetter() {
        this.count++; // ❌ Side effect
        return this.count;
      }
    }
  }
);

// Don't make async calls in getters
const store = ReactiveUtils.store(
  { data: null },
  {
    getters: {
      async badAsyncGetter() { // ❌ Getters must be sync
        return await fetch('/api/data');
      }
    }
  }
);

// Don't access store directly in actions
const store = ReactiveUtils.store(
  { count: 0 },
  {
    actions: {
      badAction() {
        this.count++; // ❌ Use state parameter
      }
    }
  }
);

// Don't forget error handling in async actions
const store = ReactiveUtils.store(
  { data: null },
  {
    actions: {
      async badAsyncAction(state) {
        // ❌ No error handling
        const response = await fetch('/api/data');
        state.data = await response.json();
      }
    }
  }
);
```

---

## API Quick Reference

### Store Creation

```javascript
const store = ReactiveUtils.store(initialState, options);
```

### Configuration Options

| Property | Type | Purpose | Required |
|----------|------|---------|----------|
| **getters** | Object<Function> | Computed properties | ❌ |
| **actions** | Object<Function> | State mutation methods | ❌ |

### Complete Template

```javascript
const store = ReactiveUtils.store(
  // Initial state
  {
    data: null,
    loading: false,
    error: null
  },
  
  // Options
  {
    // Getters (computed properties)
    getters: {
      isLoaded() {
        return this.data !== null && !this.loading;
      },
      hasError() {
        return this.error !== null;
      }
    },
    
    // Actions (state mutations)
    actions: {
      async loadData(state) {
        state.loading = true;
        state.error = null;
        
        try {
          const response = await fetch('/api/data');
          state.data = await response.json();
        } catch (error) {
          state.error = error.message;
        } finally {
          state.loading = false;
        }
      },
      
      clearError(state) {
        state.error = null;
      },
      
      reset(state) {
        state.data = null;
        state.loading = false;
        state.error = null;
      }
    }
  }
);
```

### Usage After Creation

```javascript
// Access state
console.log(store.data);
console.log(store.loading);

// Use getters
console.log(store.isLoaded);
console.log(store.hasError);

// Call actions
store.loadData();
store.clearError();
store.reset();
```

### Getter vs Action

```javascript
// Getter: Computed value (read-only)
getters: {
  total() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}

// Action: State mutation (write)
actions: {
  addItem(state, item) {
    state.items.push(item);
  }
}
```

---

## Summary

### Configuration Benefits

1. **Organized** - Clear separation between getters and actions
2. **Predictable** - Centralized state management
3. **Scalable** - Easy to extend and maintain
4. **Familiar** - Similar to Vuex/Redux patterns

### Key Points

- **getters**: Computed properties (synchronous, pure functions)
  - Access state via `this`
  - Automatically update when dependencies change
  - Should not mutate state
  
- **actions**: State mutation methods
  - Receive state as first parameter
  - Can be synchronous or asynchronous
  - Should handle errors appropriately

### Common Patterns

```javascript
// Simple store
const store = ReactiveUtils.store({ count: 0 }, {
  getters: {
    double() { return this.count * 2; }
  },
  actions: {
    increment(state) { state.count++; }
  }
});

// Async store
const store = ReactiveUtils.store({ data: null, loading: false }, {
  actions: {
    async load(state) {
      state.loading = true;
      try {
        state.data = await fetchData();
      } finally {
        state.loading = false;
      }
    }
  }
});

// Complex store with chained getters
const store = ReactiveUtils.store({ items: [], tax: 0.08 }, {
  getters: {
    subtotal() { return this.items.reduce((s, i) => s + i.price, 0); },
    taxAmount() { return this.subtotal * this.tax; },
    total() { return this.subtotal + this.taxAmount; }
  },
  actions: {
    addItem(state, item) { state.items.push(item); }
  }
});
```

### When to Use Store Pattern

- ✅ Application-wide state management
- ✅ Need centralized getters/actions
- ✅ Complex state with multiple computed values
- ✅ Team familiar with Vuex/Redux patterns
- ❌ Simple local component state (use `state()` instead)
- ❌ Need full component lifecycle (use `component()` instead)

---
