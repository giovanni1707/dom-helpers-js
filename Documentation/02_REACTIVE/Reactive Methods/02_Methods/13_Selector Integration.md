# Selector Integration Methods - Complete Guide

## Overview

When the reactive library is integrated with DOM Helpers, all reactive functionality becomes available through the `Selector` namespace and its sub-namespaces (`Selector.query` and `Selector.queryAll`). This namespace is specifically designed for working with flexible CSS selectors, providing seamless integration between reactive state management and advanced selector-based DOM manipulation.

---

## Table of Contents

1. [Integration Overview](#integration-overview)
2. [Selector Base Methods](#selector-base-methods)
3. [Selector.query Methods](#selectorquery-methods)
4. [Selector.queryAll Methods](#selectorqueryall-methods)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)
7. [API Quick Reference](#api-quick-reference)

---

## Integration Overview

### What is Selector Integration?

The reactive library automatically integrates with DOM Helpers Selector namespace, exposing all reactive functionality for flexible selector-based element manipulation. This provides three levels of integration:

1. **`Selector`** - Base namespace with all reactive methods
2. **`Selector.query`** - For single element queries (`querySelector`)
3. **`Selector.queryAll`** - For multiple element queries (`querySelectorAll`)

### Key Features

- Work with any CSS selector (IDs, classes, attributes, pseudo-classes, etc.)
- Create reactive state for complex selector-based UIs
- Leverage the power of querySelector/querySelectorAll
- Apply updates to elements matched by flexible selectors

### Checking Integration

```javascript
// Check if reactive library is integrated with Selector
if (Selector.state) {
  console.log('Reactive library integrated with Selector!');
}

// Check sub-namespaces
console.log(typeof Selector.query.state);       // 'function'
console.log(typeof Selector.queryAll.state);    // 'function'
```

### Namespace Hierarchy

```javascript
// All equivalent for core methods
Selector.state({ count: 0 })
Selector.query.state({ count: 0 })
Selector.queryAll.state({ count: 0 })
Elements.state({ count: 0 })
Collections.state({ count: 0 })
ReactiveUtils.state({ count: 0 })
```

---

## Selector Base Methods

The base `Selector` namespace includes all 21 reactive methods:

### State Creation (5 methods)

```javascript
Selector.state(initialState)
Selector.createState(initialState, bindingDefs)
Selector.ref(value)
Selector.refs(defs)
Selector.list(items)
```

### Reactivity (5 methods)

```javascript
Selector.computed(state, defs)
Selector.watch(state, defs)
Selector.effect(fn)
Selector.effects(defs)
Selector.bindings(defs)
```

### Specialized (3 methods)

```javascript
Selector.store(initialState, options)
Selector.component(config)
Selector.reactive(initialState) // Returns builder
```

### Batch Operations (4 methods)

```javascript
Selector.batch(fn)
Selector.pause()
Selector.resume(flush)
Selector.untrack(fn)
```

### Utilities (4 methods)

```javascript
Selector.updateAll(state, updates)
Selector.isReactive(value)
Selector.toRaw(value)
Selector.notify(state, key)
```

### Example - Using Selector Base

```javascript
const app = Selector.state({
  activeSection: 'home',
  theme: 'light'
});

Selector.computed(app, {
  currentPath() {
    return `/${this.activeSection}`;
  }
});

// Use with any selector
Selector.bindings({
  'nav > ul > li.active': () => app.activeSection,
  'section[data-theme]': {
    dataset: () => ({ theme: app.theme })
  },
  'button[aria-selected="true"]': {
    textContent: () => app.activeSection
  }
});
```

---

## Selector.query Methods

The `Selector.query` sub-namespace provides all reactive methods plus a special `bind()` for single element queries.

### All Core Methods Available

```javascript
// All 21 methods available
Selector.query.state(initialState)
Selector.query.createState(initialState, bindingDefs)
Selector.query.ref(value)
Selector.query.refs(defs)
Selector.query.list(items)
Selector.query.computed(state, defs)
Selector.query.watch(state, defs)
Selector.query.effect(fn)
Selector.query.effects(defs)
Selector.query.bindings(defs)
Selector.query.store(initialState, options)
Selector.query.component(config)
Selector.query.reactive(initialState)
Selector.query.batch(fn)
Selector.query.pause()
Selector.query.resume(flush)
Selector.query.untrack(fn)
Selector.query.updateAll(state, updates)
Selector.query.isReactive(value)
Selector.query.toRaw(value)
Selector.query.notify(state, key)
```

### Special: `Selector.query.bind(bindingDefs)`

Bindings optimized for single element queries using `querySelector`.

**Syntax:**
```javascript
Selector.query.bind(bindingDefs)
```

**Example:**
```javascript
const state = Selector.query.state({
  user: { name: 'John', role: 'admin' },
  notifications: 5
});

// Bind to first matching elements only
Selector.query.bind({
  'nav .user-name': () => state.user.name,
  'header [data-role]': {
    dataset: () => ({ role: state.user.role })
  },
  '.notification-badge:first-of-type': {
    textContent: () => state.notifications,
    className: () => state.notifications > 0 ? 'badge active' : 'badge'
  },
  'button[type="submit"]:not([disabled])': {
    textContent: () => state.user.role === 'admin' ? 'Publish' : 'Submit'
  }
});

// Only first matching element for each selector updates
```

**Use Cases:**
- Forms with unique field selectors
- Single navigation elements
- Primary action buttons
- Specific attribute selectors
- First-of-type elements

**Example - Complex Form:**
```javascript
const formState = Selector.query.state({
  email: '',
  password: '',
  rememberMe: false,
  isValid: false
});

Selector.query.computed(formState, {
  canSubmit() {
    return this.isValid && this.email && this.password;
  }
});

// Bind to specific form elements
Selector.query.bind({
  'form[name="login"] input[type="email"]': {
    value: () => formState.email
  },
  'form[name="login"] button[type="submit"]': {
    disabled: () => !formState.canSubmit,
    textContent: () => formState.canSubmit ? 'Login' : 'Please fill all fields'
  },
  'form .error-message:first-child': {
    textContent: () => formState.isValid ? '' : 'Invalid credentials'
  }
});
```

---

## Selector.queryAll Methods

The `Selector.queryAll` sub-namespace provides all reactive methods plus a special `bind()` for multiple element queries.

### All Core Methods Available

```javascript
// All 21 methods available
Selector.queryAll.state(initialState)
Selector.queryAll.createState(initialState, bindingDefs)
Selector.queryAll.ref(value)
Selector.queryAll.refs(defs)
Selector.queryAll.list(items)
Selector.queryAll.computed(state, defs)
Selector.queryAll.watch(state, defs)
Selector.queryAll.effect(fn)
Selector.queryAll.effects(defs)
Selector.queryAll.bindings(defs)
Selector.queryAll.store(initialState, options)
Selector.queryAll.component(config)
Selector.queryAll.reactive(initialState)
Selector.queryAll.batch(fn)
Selector.queryAll.pause()
Selector.queryAll.resume(flush)
Selector.queryAll.untrack(fn)
Selector.queryAll.updateAll(state, updates)
Selector.queryAll.isReactive(value)
Selector.queryAll.toRaw(value)
Selector.queryAll.notify(state, key)
```

### Special: `Selector.queryAll.bind(bindingDefs)`

Bindings optimized for multiple element queries using `querySelectorAll`.

**Syntax:**
```javascript
Selector.queryAll.bind(bindingDefs)
```

**Example:**
```javascript
const state = Selector.queryAll.state({
  theme: 'dark',
  fontSize: 16,
  items: []
});

// Bind to ALL matching elements
Selector.queryAll.bind({
  'section[data-theme]': {
    dataset: () => ({ theme: state.theme })
  },
  'div.card, article.post': {
    style: () => ({
      fontSize: `${state.fontSize}px`,
      backgroundColor: state.theme === 'dark' ? '#1a1a1a' : '#ffffff'
    })
  },
  'li[data-item], .item-element': {
    textContent: () => `Total items: ${state.items.length}`
  },
  'button[data-action="theme-toggle"]': {
    textContent: () => `Switch to ${state.theme === 'dark' ? 'Light' : 'Dark'}`
  }
});

// ALL matching elements for each selector update
```

**Use Cases:**
- Theme application across multiple elements
- Bulk styling updates
- Multiple similar components
- Complex multi-selector patterns
- Attribute-based selections

**Example - Gallery with Complex Selectors:**
```javascript
const gallery = Selector.queryAll.state({
  items: [],
  filter: 'all',
  selected: []
});

Selector.queryAll.computed(gallery, {
  filteredItems() {
    if (this.filter === 'all') return this.items;
    return this.items.filter(item => item.category === this.filter);
  }
});

// Update all matching elements
Selector.queryAll.bind({
  '.gallery-item[data-category], article.photo': function() {
    return gallery.filteredItems.map(item => `
      <div class="item ${gallery.selected.includes(item.id) ? 'selected' : ''}"
           data-id="${item.id}" 
           data-category="${item.category}">
        <img src="${item.url}">
      </div>
    `).join('');
  },
  'button[data-filter], .filter-btn': {
    className: function() {
      const filter = this.dataset.filter;
      return filter === gallery.filter ? 'btn active' : 'btn';
    }
  },
  '.item-counter, [data-role="counter"]': {
    textContent: () => `${gallery.filteredItems.length} items`
  }
});
```

---

## Usage Examples

### Example 1: Advanced Form with Selector.query

```javascript
const formApp = Selector.query.component({
  state: {
    values: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    errors: {},
    touched: {},
    isSubmitting: false
  },
  
  computed: {
    isValid() {
      return Object.keys(this.errors).length === 0;
    },
    passwordMatch() {
      return this.values.password === this.values.confirmPassword;
    }
  },
  
  actions: {
    validate(state, field) {
      const value = state.values[field];
      
      if (field === 'username' && value.length < 3) {
        state.errors[field] = 'Username must be at least 3 characters';
      } else if (field === 'email' && !value.includes('@')) {
        state.errors[field] = 'Invalid email address';
      } else if (field === 'password' && value.length < 6) {
        state.errors[field] = 'Password must be at least 6 characters';
      } else if (field === 'confirmPassword' && !state.passwordMatch) {
        state.errors[field] = 'Passwords do not match';
      } else {
        delete state.errors[field];
      }
    },
    
    async submit(state) {
      if (!state.isValid) return;
      
      state.isSubmitting = true;
      
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Selector.query.toRaw(state.values))
        });
        
        if (response.ok) {
          window.location.href = '/dashboard';
        }
      } catch (error) {
        state.errors.form = 'Submission failed';
      } finally {
        state.isSubmitting = false;
      }
    }
  },
  
  bindings: {
    'form[name="register"] input[name="username"]': {
      value: () => formApp.values.username
    },
    'form[name="register"] .error[data-field="username"]': {
      textContent: () => formApp.errors.username || '',
      style: () => ({
        display: formApp.errors.username ? 'block' : 'none'
      })
    },
    'form[name="register"] button[type="submit"]': {
      disabled: () => !formApp.isValid || formApp.isSubmitting,
      textContent: () => formApp.isSubmitting ? 'Submitting...' : 'Register'
    }
  },
  
  mounted() {
    // Use querySelector for single element
    const form = document.querySelector('form[name="register"]');
    
    form.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => {
        const field = e.target.name;
        formApp.values[field] = e.target.value;
        formApp.touched[field] = true;
        
        if (formApp.touched[field]) {
          formApp.validate(field);
        }
      });
    });
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formApp.submit();
    });
  }
});
```

### Example 2: Theme System with Selector.queryAll

```javascript
const themeSystem = Selector.queryAll.component({
  state: {
    theme: 'light',
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    fontSize: 16,
    fontFamily: 'Arial',
    borderRadius: 4,
    shadows: true,
    animations: true
  },
  
  computed: {
    cssVariables() {
      return {
        '--theme-mode': this.theme,
        '--primary-color': this.primaryColor,
        '--secondary-color': this.secondaryColor,
        '--font-size': `${this.fontSize}px`,
        '--font-family': this.fontFamily,
        '--border-radius': `${this.borderRadius}px`
      };
    },
    isDark() {
      return this.theme === 'dark';
    }
  },
  
  actions: {
    applyTheme(state) {
      const root = document.documentElement;
      Object.entries(state.cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    },
    
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      this.applyTheme();
    },
    
    updateColor(state, type, color) {
      if (type === 'primary') {
        state.primaryColor = color;
      } else {
        state.secondaryColor = color;
      }
      this.applyTheme();
    }
  },
  
  bindings: {
    // Apply theme to all matching elements
    '[data-theme-bg], section.themed, .content-area': {
      style: function() {
        return {
          backgroundColor: themeSystem.isDark ? '#1a1a1a' : '#ffffff',
          color: themeSystem.isDark ? '#ffffff' : '#000000',
          fontSize: `${themeSystem.fontSize}px`,
          fontFamily: themeSystem.fontFamily
        };
      }
    },
    'button.primary, .btn-primary, [data-style="primary"]': {
      style: () => ({
        backgroundColor: themeSystem.primaryColor,
        borderRadius: `${themeSystem.borderRadius}px`
      })
    },
    '.card, article, [data-component="card"]': {
      className: function() {
        let classes = 'themed-card';
        if (themeSystem.shadows) classes += ' with-shadow';
        if (themeSystem.animations) classes += ' animated';
        return classes;
      }
    }
  },
  
  mounted() {
    // Initial theme application
    this.applyTheme();
    
    // Theme toggle buttons (all of them)
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.toggleTheme();
      });
    });
    
    // Color pickers
    document.querySelectorAll('input[type="color"]').forEach(input => {
      input.addEventListener('change', (e) => {
        const type = e.target.dataset.colorType;
        this.updateColor(type, e.target.value);
      });
    });
  }
});
```

### Example 3: Data Grid with Complex Selectors

```javascript
const dataGrid = Selector.component({
  state: {
    rows: [],
    columns: ['id', 'name', 'email', 'status'],
    sortColumn: null,
    sortDirection: 'asc',
    filters: {},
    selectedRows: [],
    page: 1,
    pageSize: 20
  },
  
  computed: {
    filteredRows() {
      return this.rows.filter(row => {
        return Object.entries(this.filters).every(([key, value]) => {
          if (!value) return true;
          return String(row[key]).toLowerCase().includes(value.toLowerCase());
        });
      });
    },
    
    sortedRows() {
      if (!this.sortColumn) return this.filteredRows;
      
      return [...this.filteredRows].sort((a, b) => {
        const aVal = a[this.sortColumn];
        const bVal = b[this.sortColumn];
        const mult = this.sortDirection === 'asc' ? 1 : -1;
        
        if (aVal < bVal) return -1 * mult;
        if (aVal > bVal) return 1 * mult;
        return 0;
      });
    },
    
    paginatedRows() {
      const start = (this.page - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedRows.slice(start, end);
    },
    
    totalPages() {
      return Math.ceil(this.sortedRows.length / this.pageSize);
    }
  },
  
  actions: {
    sort(state, column) {
      if (state.sortColumn === column) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortColumn = column;
        state.sortDirection = 'asc';
      }
    },
    
    toggleSelection(state, id) {
      const index = state.selectedRows.indexOf(id);
      if (index === -1) {
        state.selectedRows.push(id);
      } else {
        state.selectedRows.splice(index, 1);
      }
    },
    
    selectAll(state) {
      state.selectedRows = state.paginatedRows.map(r => r.id);
    },
    
    deselectAll(state) {
      state.selectedRows = [];
    }
  },
  
  bindings: {
    'table.data-grid tbody, [data-component="grid-body"]': function() {
      return dataGrid.paginatedRows.map(row => `
        <tr data-id="${row.id}" 
            class="${dataGrid.selectedRows.includes(row.id) ? 'selected' : ''}">
          <td><input type="checkbox" ${dataGrid.selectedRows.includes(row.id) ? 'checked' : ''}></td>
          ${dataGrid.columns.map(col => `<td>${row[col]}</td>`).join('')}
        </tr>
      `).join('');
    },
    
    'table.data-grid thead th[data-column], th.sortable': {
      className: function() {
        const column = this.dataset.column;
        if (dataGrid.sortColumn !== column) return 'sortable';
        return `sortable sorted-${dataGrid.sortDirection}`;
      }
    },
    
    '.pagination-info, [data-role="page-info"]': {
      textContent: () => {
        return `Page ${dataGrid.page} of ${dataGrid.totalPages} (${dataGrid.sortedRows.length} total)`;
      }
    },
    
    'button[data-action="prev-page"]': {
      disabled: () => dataGrid.page === 1
    },
    
    'button[data-action="next-page"]': {
      disabled: () => dataGrid.page === dataGrid.totalPages
    }
  },
  
  mounted() {
    // Column sorting
    document.querySelectorAll('th[data-column]').forEach(th => {
      th.addEventListener('click', () => {
        this.sort(th.dataset.column);
      });
    });
    
    // Row selection (delegated)
    const tbody = document.querySelector('table.data-grid tbody');
    tbody.addEventListener('click', (e) => {
      if (e.target.type === 'checkbox') {
        const tr = e.target.closest('tr');
        const id = Number(tr.dataset.id);
        this.toggleSelection(id);
      }
    });
    
    // Pagination
    document.querySelector('[data-action="prev-page"]')?.addEventListener('click', () => {
      if (this.page > 1) this.page--;
    });
    
    document.querySelector('[data-action="next-page"]')?.addEventListener('click', () => {
      if (this.page < this.totalPages) this.page++;
    });
  }
});
```

---

## Best Practices

### ✅ DO

```javascript
// Use appropriate sub-namespace
Selector.query.bind({
  'form input[type="submit"]': { /* single element */ }
});

Selector.queryAll.bind({
  '.theme-element': { /* all matching elements */ }
});

// Leverage complex selectors
Selector.bindings({
  'section[data-active="true"] > .content': () => /* ... */,
  'nav li.active a, nav li.current a': () => /* ... */,
  'input[required]:not([disabled])': () => /* ... */
});

// Use with attribute selectors
Selector.query.bind({
  '[data-role="main-title"]': () => state.title,
  '[aria-selected="true"]': () => state.activeItem
});
```

### ❌ DON'T

```javascript
// Don't mix query/queryAll inappropriately
Selector.query.bind({
  '.multiple-elements': () => /* ... */ // Should use queryAll
});

Selector.queryAll.bind({
  '#unique-id': () => /* ... */ // Should use query or Elements
});

// Don't overcomplicate selectors unnecessarily
Selector.bindings({
  'div#main > section.content > article:first-child p.text': () => /* ... */
  // Could be simplified
});

// Don't forget specificity issues
Selector.query.bind({
  'button': () => /* ... */ // Too generic, might match wrong element
});
```

---

## API Quick Reference

### Selector Base Namespace (21 methods)

```javascript
// State Creation
Selector.state(initialState)
Selector.createState(initialState, bindings)
Selector.ref(value)
Selector.refs(defs)
Selector.list(items)

// Reactivity
Selector.computed(state, defs)
Selector.watch(state, defs)
Selector.effect(fn)
Selector.effects(defs)
Selector.bindings(defs)

// Specialized
Selector.store(initialState, options)
Selector.component(config)
Selector.reactive(initialState)

// Batch Operations
Selector.batch(fn)
Selector.pause()
Selector.resume(flush)
Selector.untrack(fn)

// Utilities
Selector.updateAll(state, updates)
Selector.isReactive(value)
Selector.toRaw(value)
Selector.notify(state, key)
```

### Selector.query (21 methods + special bind)

```javascript
// All 21 methods available (same as above)
Selector.query.state(...)
// ... etc

// Special method
Selector.query.bind(bindingDefs) // querySelector-based bindings
```

### Selector.queryAll (21 methods + special bind)

```javascript
// All 21 methods available (same as above)
Selector.queryAll.state(...)
// ... etc

// Special method
Selector.queryAll.bind(bindingDefs) // querySelectorAll-based bindings
```

---

## Summary

### Key Benefits of Selector Integration

1. **Flexible Selectors** - Use any CSS selector pattern
2. **Three Levels** - Base, query (single), queryAll (multiple)
3. **Powerful Selection** - Leverage full querySelector capabilities
4. **Unified API** - Consistent across all namespaces

### Namespace Comparison

| Namespace | Best For | Selection Method | Special bind() |
|-----------|----------|------------------|----------------|
| **Selector** | Any selector | Mixed | Standard bindings() |
| **Selector.query** | Single element | querySelector | First match only |
| **Selector.queryAll** | Multiple elements | querySelectorAll | All matches |
| **Elements** | IDs | getElementById | ID-based (no #) |
| **Collections** | Classes | getElementsByClassName | Class-based (no .) |

### When to Use Each

- **Selector**: Complex selectors, attribute-based selection
- **Selector.query**: Forms, unique elements, first-of-type
- **Selector.queryAll**: Themes, bulk updates, multiple similar elements
- **Elements**: Simple ID-based selection
- **Collections**: Simple class-based selection

### Common Workflows

```javascript
// 1. Choose appropriate namespace
const state = Selector.query.state({ ... }); // For single element
const state = Selector.queryAll.state({ ... }); // For multiple elements

// 2. Add reactivity
Selector.computed(state, { ... });

// 3. Set up bindings
Selector.query.bind({
  'form input[type="submit"]': () => /* ... */
});

Selector.queryAll.bind({
  'section[data-theme]': () => /* ... */
});

// 4. Handle events
document.querySelectorAll('[data-action]').forEach(el => {
  el.addEventListener('click', () => { /* ... */ });
});
```

---
