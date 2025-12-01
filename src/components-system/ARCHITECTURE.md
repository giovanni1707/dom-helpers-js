# Components System Architecture

## Overview

The Components System is a modular, **traditional HTML5-based** component architecture designed for building reusable UI components with full lifecycle management, scoped styles, and event communication.

## Core Philosophy: Pure HTML + JavaScript

**This system follows the traditional HTML5 philosophy:**

1. **HTML remains HTML** - No template interpolation (`{{variable}}`), no special syntax
2. **IDs and classes** - Traditional HTML structure with `id="elementId"` and `class="className"`
3. **JavaScript manipulates DOM** - Use `Elements.update()` or direct DOM APIs
4. **DOM Helpers integration** - Leverage Elements, Collections, Selector for convenience
5. **Separation of concerns** - HTML (structure), CSS (styles), JavaScript (behavior)

This is **NOT** a template-based framework. Components are pure HTML that gets manipulated by JavaScript after rendering.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    components.js (Entry Point)               │
│  - Unified API                                               │
│  - DOM Helpers Integration                                   │
│  - Auto-initialization                                       │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ component-core   │ │component-registry│ │component-renderer│
│                  │ │                  │ │                  │
│ - Component      │ │ - Registration   │ │ - Rendering      │
│   Class          │ │ - Management     │ │ - Custom Tags    │
│ - Lifecycle      │ │ - Namespacing    │ │ - Auto-init      │
│ - Scoped CSS     │ │ - Versioning     │ │ - Props Extract  │
│ - Templates      │ │ - Bulk Ops       │ │ - DOM Processing │
│ - Error Bounds   │ │ - Hooks          │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘

          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ component-events │ │ component-utils  │ │component-loader  │
│                  │ │                  │ │                  │
│ - Event Bus      │ │ - Scope Utils    │ │ - Load from URL  │
│ - Pub/Sub        │ │ - Batch Update   │ │ - Lazy Loading   │
│ - Namespaces     │ │ - Data Binding   │ │ - Caching        │
│ - Wildcards      │ │ - Statistics     │ │ - Preloading     │
│ - Event History  │ │ - Performance    │ │ - Batch Loading  │
│ - Priorities     │ │ - Debug Tools    │ │ - Dynamic Import │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

## Module Breakdown

### 1. component-core.js (~550 lines, ~18 KB)

**Purpose:** Core Component class with lifecycle management

**Key Features:**
- Component class with full lifecycle hooks
- Template/styles/script parsing (HTML string or object)
- **Pure HTML templates** - No interpolation, traditional HTML5 structure
- Scoped CSS with unique scope IDs
- Props validation with type checking
- Smart update system with RAF batching
- Error boundaries and error handling
- Event system for component communication
- Full DOM Helpers integration (Elements, Collections, Selector)

**Lifecycle Hooks:**
```javascript
{
  beforeMount,    // Before initial render
  mounted,        // After initial render
  beforeUpdate,   // Before re-render
  updated,        // After re-render
  beforeDestroy,  // Before cleanup
  destroyed,      // After cleanup
  errorCaptured   // Error boundary
}
```

**Update Methods:**
- `updateData(newData)` - Smart data update without full re-render
- `update(updates, options)` - Granular DOM updates with RAF batching
- `refresh()` - Force full re-render

### 2. component-registry.js (~400 lines, ~13 KB)

**Purpose:** Component registration and management

**Key Features:**
- Component registration with validation
- Namespace support for organization
- Component versioning
- Bulk registration/unregistration
- Registration hooks for plugins
- Search and query functionality
- Import/export for backup/transfer
- Component cloning

**API:**
```javascript
registry.register(name, definition, options)
registry.unregister(name)
registry.get(name)
registry.has(name)
registry.getByNamespace(namespace)
registry.clone(sourceName, targetName)
```

### 3. component-renderer.js (~450 lines, ~14 KB)

**Purpose:** Component rendering and DOM processing

**Key Features:**
- Render components to containers
- Custom tag support (`<user-card>`, `<UserCard>`)
- Auto-initialization from DOM
- Props extraction from attributes (intelligent parsing)
- Data extraction from data-* attributes
- Optimized DOM scanning (avoids querySelectorAll('*'))
- Inline component rendering
- HTML string processing

**Custom Tags:**
```javascript
// Kebab-case
<user-card name="John" age="30"></user-card>

// PascalCase (converted to lowercase by browser)
<UserCard name="John" age="30"></UserCard>

// Auto-initialized with data-component
<div data-component="UserCard" data-name="John"></div>
```

### 4. component-events.js (~350 lines, ~11 KB)

**Purpose:** Global event bus for component communication

**Key Features:**
- Pub/sub event system
- Event namespacing
- Wildcard listeners (`user:*`, `*`)
- Once listeners
- Event priorities
- Event history with replay
- Async event handling
- Event stopping (bubble control)

**API:**
```javascript
events.on(eventName, handler, options)
events.once(eventName, handler)
events.off(eventName, handler)
events.emit(eventName, data)
events.emitAsync(eventName, data) // Returns results
events.createNamespace(namespace)
```

### 5. component-utils.js (~350 lines, ~11 KB)

**Purpose:** Utility functions and helpers

**Key Features:**
- Scoped element access
- Batch update utilities
- Data binding helpers
- Component statistics
- Performance monitoring
- Component search/find
- Wait for component
- Debug tools

**API:**
```javascript
utils.scope('userName', 'userEmail')
utils.batchUpdate({ userName: { textContent: 'John' } })
utils.createBinding(['userName'], (data) => ({ ... }))
utils.findComponents('UserCard')
utils.waitForComponent('UserCard', 5000)
utils.debugComponent('UserCard')
```

### 6. component-loader.js (~400 lines, ~13 KB)

**Purpose:** Component loading and caching

**Key Features:**
- Load components from external files
- Lazy loading (load when needed)
- Preloading (background loading)
- Component caching
- Batch loading (parallel/sequential)
- Retry logic with exponential backoff
- Timeout handling
- CDN support
- Dynamic imports (ES6)

**API:**
```javascript
loader.load('UserCard', '/components/user-card.html')
loader.loadByName('UserCard') // Auto-resolves URL
loader.lazy('UserCard', '/components/user-card.html')
loader.preload('UserCard', '/components/user-card.html')
loader.loadBatch([...], { parallel: true })
```

### 7. components.js (~300 lines, ~10 KB)

**Purpose:** Unified entry point

**Key Features:**
- Combines all modules into single API
- DOM Helpers integration
- Auto-initialization
- Global exports
- Configuration management
- Enhanced Elements.update() with dot notation

**Usage:**
```javascript
// All-in-one import
<script src="components.js"></script>

// Or module loading
<script src="component-core.js"></script>
<script src="component-registry.js"></script>
<script src="component-renderer.js"></script>
<script src="components.js"></script>
```

## Data Flow

### Component Registration Flow
```
Definition (HTML/Object)
    ↓
Validation
    ↓
Registry Storage
    ↓
Namespace Assignment
    ↓
Registration Hooks
```

### Component Rendering Flow
```
render(name, container, data)
    ↓
Get Definition from Registry
    ↓
Create Component Instance
    ↓
beforeMount Hook
    ↓
Parse Template/Styles/Script
    ↓
Process Template with Data
    ↓
Process Slots
    ↓
Insert into Container
    ↓
Inject Scoped Styles
    ↓
Execute Script
    ↓
mounted Hook
```

### Update Flow
```
update(updates)
    ↓
Merge into Update Queue
    ↓
Schedule RAF
    ↓
Flush Updates (batched)
    ↓
Apply to DOM
```

## Component Definition Formats

### HTML String Format (Pure HTML - No Interpolation)
```javascript
Components.register('UserCard', `
  <!-- Pure HTML with IDs - NO template interpolation -->
  <div class="user-card">
    <h3 id="userName"></h3>
    <p id="userEmail"></p>
    <div id="actions"></div>
  </div>

  <style>
    .user-card {
      padding: 20px;
      border: 1px solid #ccc;
    }
  </style>

  <script>
    // Access: component, data, Elements, Collections, Selector
    // Update DOM using Elements.update()
    Elements.update({
      userName: { textContent: data.name },
      userEmail: { textContent: data.email }
    });

    // Event handlers
    Elements.userName.addEventListener('click', () => {
      console.log('Hello', data.name);
    });
  </script>
`);
```

### Object Format (Pure HTML Approach)
```javascript
Components.register('UserCard', {
  template: `
    <div class="user-card">
      <h3 id="userName"></h3>
      <p id="userEmail"></p>
    </div>
  `,

  styles: `
    .user-card {
      padding: 20px;
    }
  `,

  props: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      validator: (value) => value.includes('@')
    }
  },

  methods: {
    greet() {
      console.log('Hello', this.data.name);
    }
  },

  beforeMount() {
    console.log('Before mount');
  },

  mounted() {
    console.log('Mounted');
  }
});
```

## Scoped CSS System

Components use attribute-based CSS scoping:

```html
<!-- Component container gets unique scope attribute -->
<div component-UserCard-1638360000000-abc123="">
  <div class="user-card">
    <h3>John</h3>
  </div>
</div>
```

```css
/* Styles are automatically scoped */
[component-UserCard-1638360000000-abc123] .user-card {
  padding: 20px;
}
```

## Performance Optimizations

1. **RAF Batching** - DOM updates batched using requestAnimationFrame
2. **Update Queue** - Multiple updates merged before applying
3. **Component Caching** - Loaded components cached to avoid re-fetching
4. **Lazy Loading** - Components loaded only when needed
5. **Optimized DOM Scanning** - Targeted queries instead of querySelectorAll('*')
6. **Event Listener Tracking** - Proper cleanup to prevent memory leaks

## Bundle Size Optimization

### Loading Options

**Full System** (~90 KB):
```html
<script src="component-core.js"></script>
<script src="component-registry.js"></script>
<script src="component-renderer.js"></script>
<script src="component-events.js"></script>
<script src="component-utils.js"></script>
<script src="component-loader.js"></script>
<script src="components.js"></script>
```

**Core Only** (~45 KB, -50%):
```html
<script src="component-core.js"></script>
<script src="component-registry.js"></script>
<script src="component-renderer.js"></script>
<script src="components.js"></script>
```

**Minimal** (~31 KB, -66%):
```html
<script src="component-core.js"></script>
<script src="component-registry.js"></script>
```

## Backward Compatibility

- 100% backward compatible with original dh-components.js
- Same API surface maintained
- Global exports match original patterns
- Zero breaking changes

## Integration with DOM Helpers

The system seamlessly integrates with DOM Helpers:

```javascript
// Enhanced Elements.update() with dot notation
Elements.update({
  'userName.textContent': 'John',
  'userEmail.textContent': 'john@example.com',
  'userAvatar.src': '/avatar.jpg'
});

// Component methods added to Elements
Elements.registerComponent('UserCard', definition);
Elements.renderComponent('UserCard', '#container');
Elements.getComponent('#container');
```

## Error Handling

Components include error boundaries:

```javascript
Components.register('UserCard', {
  template: '...',

  errorCaptured(error, component, context) {
    console.error('Error in', component.name, ':', error);

    // Handle the error
    this.container.innerHTML = '<p>Error loading component</p>';

    // Return true to prevent error propagation
    return true;
  }
});
```

## Testing Recommendations

1. **Unit Tests** - Test individual modules independently
2. **Integration Tests** - Test module interactions
3. **E2E Tests** - Test full component lifecycle
4. **Performance Tests** - Monitor render times and memory
5. **Bundle Size Tests** - Ensure optimizations maintained

## Migration from Original

No migration needed! The modular system is 100% backward compatible:

```javascript
// Old code (still works)
Components.register('UserCard', definition);
await Components.render('UserCard', '#container');

// New features available
Components.on('user:login', handler);
Components.lazy('UserCard', '/components/user-card.html');
Components.debugComponent('UserCard');
```
