# DOM Helpers Components System

A modular, traditional HTML5-based component system with full lifecycle management, scoped styles, and event communication.

## Philosophy: Pure HTML + JavaScript

**This system follows the traditional HTML5 philosophy:**
- ✅ **HTML remains HTML** - No template interpolation like `{{variable}}`
- ✅ **Use IDs and classes** - Traditional HTML structure with `id="elementId"`
- ✅ **JavaScript updates the DOM** - Use `Elements.update()` or direct DOM manipulation
- ✅ **DOM Helpers integration** - Leverage Elements, Collections, Selector
- ✅ **Separation of concerns** - HTML structure, CSS styles, JavaScript behavior

This is NOT a template-based framework like Vue/Angular. It's pure HTML5 + vanilla JavaScript with DOM Helpers convenience.

## Features

✅ **Component Lifecycle** - Full lifecycle hooks (mount, update, destroy)
✅ **Scoped CSS** - Automatic style isolation per component
✅ **Custom Tags** - Use `<user-card>` in your HTML
✅ **Props Validation** - Type checking and required props
✅ **Event Bus** - Global event system for component communication
✅ **Lazy Loading** - Load components on demand
✅ **Caching** - Cache loaded components for performance
✅ **Error Boundaries** - Catch and handle component errors
✅ **Performance Monitoring** - Track render times and memory
✅ **DOM Helpers Integration** - Works seamlessly with DOM Helpers
✅ **Zero Dependencies** - Works standalone or with DOM Helpers
✅ **UMD Support** - Works in browser, Node.js, AMD

## Installation

### Browser (Full System)

```html
<script src="component-core.js"></script>
<script src="component-registry.js"></script>
<script src="component-renderer.js"></script>
<script src="component-events.js"></script>
<script src="component-utils.js"></script>
<script src="component-loader.js"></script>
<script src="components.js"></script>
```

### Browser (Minimal - Core Only)

```html
<script src="component-core.js"></script>
<script src="component-registry.js"></script>
<script src="component-renderer.js"></script>
<script src="components.js"></script>
```

### NPM/Module Bundler

```javascript
import { Components } from './components.js';
```

## Quick Start

### 1. Register a Component

```javascript
Components.register('UserCard', `
  <!-- Pure HTML with IDs/classes - NO template interpolation -->
  <div class="user-card">
    <img id="userAvatar" alt="User Avatar">
    <h3 id="userName"></h3>
    <p id="userEmail"></p>
    <button id="btnFollow" class="btn-follow">Follow</button>
  </div>

  <style>
    .user-card {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .user-card img {
      width: 100%;
      border-radius: 50%;
    }
  </style>

  <script>
    // Access component, data, and DOM Helpers
    // component = this component instance
    // data = passed data object
    // Elements, Collections, Selector = DOM Helpers

    // Update DOM using DOM Helpers Elements.update()
    Elements.update({
      userAvatar: { src: data.avatar, alt: data.name },
      userName: { textContent: data.name },
      userEmail: { textContent: data.email }
    });

    // Or use direct DOM manipulation
    const btn = Elements.btnFollow;
    btn.addEventListener('click', () => {
      Components.emit('user:follow', { name: data.name });
    });
  </script>
`);
```

### 2. Render the Component

```javascript
await Components.render('UserCard', '#container', {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/avatar.jpg'
});
```

### 3. Use Custom Tags

```html
<user-card
  data-name="John Doe"
  data-email="john@example.com"
  data-avatar="/avatar.jpg">
</user-card>

<!-- Auto-initialized on DOMContentLoaded -->
<!-- data-* attributes are passed as data object to component script -->
```

## Component Definition Formats

### HTML String Format (Pure HTML - No Template Interpolation)

```javascript
Components.register('TodoItem', `
  <!-- Pure HTML with IDs -->
  <div class="todo-item" id="todoItem">
    <input type="checkbox" id="todoCheckbox" class="todo-checkbox">
    <span id="todoText" class="todo-text"></span>
    <button id="todoDelete" class="todo-delete">Delete</button>
  </div>

  <style>
    .todo-item {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .todo-item.completed .todo-text {
      text-decoration: line-through;
      color: #999;
    }
  </style>

  <script>
    // Update DOM with data using DOM Helpers
    Elements.update({
      todoText: { textContent: data.text },
      todoCheckbox: { checked: data.completed }
    });

    // Update class based on completed state
    if (data.completed) {
      Elements.todoItem.classList.add('completed');
    }

    // Event handlers
    Elements.todoCheckbox.addEventListener('change', (e) => {
      const isCompleted = e.target.checked;
      Elements.todoItem.classList.toggle('completed', isCompleted);

      // Emit event for parent to handle
      Components.emit('todo:toggle', {
        id: data.id,
        completed: isCompleted
      });
    });

    Elements.todoDelete.addEventListener('click', () => {
      Components.emit('todo:delete', { id: data.id });
    });
  </script>
`);
```

### Object Format (Pure HTML Approach)

```javascript
Components.register('TodoItem', {
  template: `
    <div class="todo-item" id="todoItem">
      <input type="checkbox" id="todoCheckbox" class="todo-checkbox">
      <span id="todoText" class="todo-text"></span>
      <button id="todoDelete" class="todo-delete">Delete</button>
    </div>
  `,

  styles: `
    .todo-item {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .todo-item.completed .todo-text {
      text-decoration: line-through;
      color: #999;
    }
  `,

  props: {
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },

  script: function(component, data, Elements) {
    // Update DOM with data
    Elements.update({
      todoText: { textContent: data.text },
      todoCheckbox: { checked: data.completed }
    });

    if (data.completed) {
      Elements.todoItem.classList.add('completed');
    }

    // Event handlers
    Elements.todoCheckbox.addEventListener('change', (e) => {
      Elements.todoItem.classList.toggle('completed', e.target.checked);
      Components.emit('todo:toggle', {
        id: data.id,
        completed: e.target.checked
      });
    });

    Elements.todoDelete.addEventListener('click', () => {
      Components.emit('todo:delete', { id: data.id });
    });
  },

  mounted() {
    console.log('Todo item mounted:', this.data.text);
  }
});
```

## Lifecycle Hooks

```javascript
Components.register('MyComponent', {
  template: '...',

  beforeMount() {
    // Before component is added to DOM
    console.log('About to mount');
  },

  mounted() {
    // After component is added to DOM
    console.log('Mounted - DOM is ready');
    // Add event listeners here
  },

  beforeUpdate() {
    // Before component re-renders
    console.log('About to update');
  },

  updated() {
    // After component re-renders
    console.log('Updated');
  },

  beforeDestroy() {
    // Before component is removed
    console.log('About to destroy');
    // Cleanup timers, external listeners, etc.
  },

  destroyed() {
    // After component is removed
    console.log('Destroyed');
  },

  errorCaptured(error, component, context) {
    // Error boundary
    console.error('Error:', error);
    // Return true to prevent propagation
    return true;
  }
});
```

## Props Validation

```javascript
Components.register('UserCard', {
  template: '...',

  props: {
    name: {
      type: String,
      required: true
    },

    age: {
      type: Number,
      default: 0
    },

    email: {
      type: String,
      validator: (value) => {
        return value.includes('@');
      }
    },

    role: {
      type: String,
      default: 'user',
      validator: (value) => {
        return ['user', 'admin', 'guest'].includes(value);
      }
    }
  }
});
```

## Component Communication

### Event Bus

```javascript
// Component A - Emit event
Components.emit('user:login', {
  username: 'john',
  timestamp: Date.now()
});

// Component B - Listen for event
Components.on('user:login', (data) => {
  console.log('User logged in:', data.username);
});

// Listen once
Components.once('app:ready', () => {
  console.log('App is ready');
});

// Wildcard listeners
Components.on('user:*', (data) => {
  console.log('User event:', data);
});

// Remove listener
Components.off('user:login', handler);
```

### Async Events

```javascript
// Emit async (returns array of results)
const results = await Components.emitAsync('user:validate', {
  username: 'john'
});

console.log('Validation results:', results);
```

### Namespaced Events

```javascript
const userEvents = Components.createNamespace('user');

userEvents.on('login', handler);
userEvents.emit('login', data);
userEvents.clear(); // Clear all user namespace events
```

## Update Methods

### Smart Data Update

```javascript
// Updates data and re-renders
await component.updateData({
  name: 'Jane Doe',
  email: 'jane@example.com'
});
```

### Granular DOM Update

```javascript
// Updates specific elements without re-render (batched with RAF)
component.update({
  userName: { textContent: 'Jane' },
  userEmail: { textContent: 'jane@example.com' },
  userAvatar: { src: '/new-avatar.jpg' }
});

// Immediate update (skip RAF batching)
component.update(updates, { immediate: true });
```

### Force Re-render

```javascript
// Full re-render
await component.refresh();
```

## Lazy Loading

```javascript
// Load component from URL
await Components.load('UserCard', '/components/user-card.html');

// Auto-resolve URL from component name
await Components.loadByName('UserCard'); // Loads from user-card.html

// Lazy load (load when needed)
const lazyComponent = Components.lazy('UserCard', '/components/user-card.html');
await lazyComponent.load(); // Loads now

// Preload (load in background)
Components.preload('UserCard', '/components/user-card.html');

// Batch load
await Components.loadBatch([
  { name: 'UserCard', url: '/components/user-card.html' },
  { name: 'TodoItem', url: '/components/todo-item.html' }
], {
  parallel: true,
  onProgress: (completed, total, name) => {
    console.log(`Loading ${name}: ${completed}/${total}`);
  }
});
```

## Advanced Features

### Data Binding

```javascript
// Create binding
const userBinding = Components.createBinding(
  ['userName', 'userEmail'],
  (data) => ({
    userName: { textContent: data.name },
    userEmail: { textContent: data.email }
  })
);

// Update all bound elements
userBinding.update({
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Batch Updates

```javascript
// Update multiple elements at once
Components.batchUpdate({
  userName: { textContent: 'John' },
  userEmail: { textContent: 'john@example.com' },
  userStatus: {
    textContent: 'Online',
    classList: { add: 'active' }
  }
});
```

### Enhanced Update with Dot Notation

```javascript
// Update nested properties directly
Components.update({
  'userName.textContent': 'John',
  'userAvatar.src': '/avatar.jpg',
  'userStatus.style.color': 'green'
});
```

### Component Utilities

```javascript
// Find components
const userCards = Components.findComponents('UserCard');

// Wait for component
const component = await Components.waitForComponent('UserCard', 5000);

// Debug component
Components.debugComponent('UserCard');

// Get statistics
const stats = Components.getStats();
console.log(stats);
// {
//   registered: 10,
//   active: 5,
//   destroyed: 0,
//   scopedStyles: 5,
//   byName: { UserCard: 2, TodoItem: 3 }
// }
```

## Configuration

```javascript
Components.configure({
  // Loader config
  loader: {
    baseURL: '/components',
    extension: '.html',
    cache: true,
    timeout: 10000,
    retries: 2
  },

  // Events config
  events: {
    maxHistorySize: 100,
    enableHistory: true
  }
});
```

## Integration with DOM Helpers

```javascript
// Use Elements helper
Elements.registerComponent('UserCard', definition);
await Elements.renderComponent('UserCard', '#container');
const component = Elements.getComponent('#container');

// Enhanced update with dot notation
Elements.update({
  'userName.textContent': 'John',
  'userEmail.textContent': 'john@example.com'
});
```

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Opera: ✅
- IE11: ❌ (use polyfills for Promises, fetch, etc.)

## Performance Tips

1. **Use Granular Updates** - Prefer `component.update()` over `updateData()` when possible
2. **Enable Caching** - Cache frequently used components
3. **Lazy Load** - Load components only when needed
4. **Batch Operations** - Use `batchUpdate()` for multiple element updates
5. **Cleanup** - Always remove event listeners in `beforeDestroy`
6. **Avoid Deep Nesting** - Keep component trees shallow

## Bundle Sizes

| Loading Option | Size | Savings |
|---------------|------|---------|
| Full System | ~90 KB | - |
| Core + Optional | ~60 KB | -33% |
| Core Only | ~45 KB | -50% |
| Minimal | ~31 KB | -66% |

## Examples

See [examples/](examples/) directory for complete examples:
- Todo App
- User Dashboard
- Product Catalog
- Real-time Chat

## License

MIT License

## Support

For issues, questions, or contributions, please visit the GitHub repository.
