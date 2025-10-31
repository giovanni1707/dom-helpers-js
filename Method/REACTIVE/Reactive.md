[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Reactive Module - Complete Method Reference

## 🔄 ReactiveState Object

### State Creation
- `ReactiveState.create(initialState)` - Create a reactive state proxy from an object or array

---

## 🎯 Elements Integration (Elements.state & Elements.bind)

### State Creation
- `Elements.state(initialState)` - Create reactive state (alias for `ReactiveState.create()`)

### Binding Methods
- `Elements.bind(bindings)` - Bind reactive functions to elements by ID
  ```javascript
  Elements.bind({
    'elementId': () => state.value,
    'anotherId': {
      textContent: () => state.text,
      style: () => ({ color: state.color })
    }
  });
  ```

### Unbinding Methods
- `Elements.unbind(id)` - Remove all bindings for an element by ID

---

## 📦 Collections Integration (Collections.bind)

### Binding Methods
- `Collections.bind(bindings)` - Bind reactive functions to elements by class name
  ```javascript
  Collections.bind({
    'className': () => state.value,
    'anotherClass': {
      textContent: () => state.text,
      disabled: () => state.isDisabled
    }
  });
  ```

### Unbinding Methods
- `Collections.unbind(className)` - Remove all bindings for elements by class name

---

## 🔍 Selector.query Integration

### Binding Methods
- `Selector.query.bind(bindings)` - Bind reactive functions to first matching element by selector
  ```javascript
  Selector.query.bind({
    '#myElement': () => state.value,
    '.my-class': {
      textContent: () => state.text,
      className: () => state.cssClass
    }
  });
  ```

### Unbinding Methods
- `Selector.query.unbind(selector)` - Remove all bindings for elements matching selector

---

## 🔍 Selector.queryAll Integration

### Binding Methods
- `Selector.queryAll.bind(bindings)` - Bind reactive functions to all matching elements by selector
  ```javascript
  Selector.queryAll.bind({
    '.items': () => state.count,
    'button.action': {
      disabled: () => state.isProcessing,
      textContent: () => state.buttonText
    }
  });
  ```

### Unbinding Methods
- `Selector.queryAll.unbind(selector)` - Remove all bindings for all elements matching selector

---

## 🏗️ Internal/Advanced Methods

These are available but typically used internally:

### Binding Creation & Management
- `createBinding(element, property, fn)` - Create a single binding (internal)
- `applyBindingDef(element, bindingDef)` - Apply binding definition to element (internal)
- `executeBinding(binding)` - Execute a binding function (internal)
- `cleanupBinding(binding)` - Clean up a single binding (internal)
- `unbindElement(element)` - Remove all bindings from specific element (internal)

### Reactive System Internals
- `createReactiveProxy(target, path, parent)` - Create reactive proxy (internal)
- `trackDependency(state, key, binding)` - Track dependency for change detection (internal)
- `triggerUpdate(state, key)` - Trigger updates for dependent bindings (internal)
- `applyBindingValue(element, property, value)` - Apply value to DOM element (internal)

### Utility Functions
- `deepClone(value)` - Deep clone value for comparison (internal)
- `isEqual(a, b)` - Deep equality check (internal)
- `getElementBindings(element)` - Get bindings set for element (internal)
- `setupAutoCleanup()` - Initialize MutationObserver for cleanup (internal)

### Batch Binding Utilities
- `bindElements(bindings)` - Bind by element IDs (internal, called by Elements.bind)
- `bindCollections(bindings)` - Bind by class names (internal, called by Collections.bind)
- `bindQuerySingle(bindings)` - Bind by selector (single) (internal)
- `bindQueryAll(bindings)` - Bind by selector (all) (internal)

### Unbinding Utilities
- `unbindElements(id)` - Unbind element by ID (internal)
- `unbindCollections(className)` - Unbind by class name (internal)
- `unbindQuery(selector)` - Unbind by selector (internal)

---

## 📊 Reactive State Features

### Automatic Features (Built into the Proxy)

When you create a reactive state, these features are automatically available:

#### Property Access Tracking
- Automatically tracks which bindings depend on which properties
- Updates only affected bindings when properties change

#### Nested Object/Array Reactivity
- Nested objects and arrays are automatically made reactive
- Changes to nested properties trigger updates correctly

#### Array Method Reactivity
- Array mutating methods are automatically reactive:
  - `push()`, `pop()`, `shift()`, `unshift()`
  - `splice()`, `sort()`, `reverse()`
- Non-mutating methods work normally (map, filter, etc.)

#### Property Operations
- `state.property = value` - Set property (triggers updates)
- `delete state.property` - Delete property (triggers updates)
- `state[key]` - Get property (tracks dependency)

---

## 🎨 Binding Definition Formats

### Simple Function Binding
```javascript
Elements.bind({
  'elementId': () => state.value
});
// Binds to textContent by default
```

### Property-Specific Binding
```javascript
Elements.bind({
  'elementId': {
    textContent: () => state.text,
    className: () => state.cssClass,
    disabled: () => state.isDisabled,
    style: () => ({ color: state.color, fontSize: '16px' }),
    dataset: () => ({ userId: state.userId })
  }
});
```

### Multiple Elements
```javascript
Elements.bind({
  'title': () => state.title,
  'description': () => state.description,
  'status': {
    textContent: () => state.status,
    className: () => `status-${state.type}`
  }
});
```

---

## 🔗 Supported Binding Properties

You can bind to any of these element properties:

### Content Properties
- `textContent` - Text content
- `innerHTML` - HTML content
- `value` - Input value
- `checked` - Checkbox/radio checked state
- `selected` - Option selected state

### Attribute Properties
- `id`, `className`, `name`, `type`, `href`, `src`, `alt`, `title`, etc.
- Any valid DOM property or attribute

### Special Object Properties
- `style` - Style object `{ color: 'red', fontSize: '16px' }`
- `dataset` - Dataset object `{ userId: '123', role: 'admin' }`

### State Properties
- `disabled`, `hidden`, `required`, `readonly`
- Any boolean property

---

## 📋 Binding Value Types

Bindings can return different types of values:

### Primitives
```javascript
() => 'Hello' // string
() => 42 // number
() => true // boolean
```

### Arrays
```javascript
() => ['Item 1', 'Item 2'] // Joins with ', ' for textContent
```

### Objects
```javascript
// For style property
() => ({ color: 'red', fontSize: '16px' })

// For multiple properties (when no specific property defined)
() => ({
  textContent: 'Hello',
  className: 'active',
  disabled: false
})
```

### DOM Nodes
```javascript
() => document.createElement('span') // Replaces element content
```

### Null/Undefined
```javascript
() => null // Clears textContent
```

---

## 🧹 Automatic Cleanup

### MutationObserver
- Automatically detects when bound elements are removed from DOM
- Cleans up bindings for removed elements
- Prevents memory leaks
- No manual cleanup needed in most cases

### Manual Cleanup (Optional)
```javascript
// Unbind specific element
Elements.unbind('elementId');

// Unbind all elements with class
Collections.unbind('className');

// Unbind selector matches
Selector.query.unbind('.my-selector');
```

---

## 💡 Complete Usage Example

```javascript
// Create reactive state
const state = Elements.state({
  count: 0,
  name: 'John',
  items: ['Apple', 'Banana', 'Cherry'],
  settings: {
    theme: 'dark',
    fontSize: 16
  }
});

// Bind to elements
Elements.bind({
  'counter': () => `Count: ${state.count}`,
  'username': () => state.name,
  'itemList': () => state.items.join(', '),
  'themeIndicator': {
    textContent: () => state.settings.theme,
    className: () => `theme-${state.settings.theme}`,
    style: () => ({ fontSize: `${state.settings.fontSize}px` })
  }
});

// Update state (bindings update automatically)
state.count++;
state.name = 'Jane';
state.items.push('Date');
state.settings.theme = 'light';

// Unbind when done (optional, auto-cleanup handles this)
Elements.unbind('counter');
```

---

## 🌐 Integration with DOMHelpers

The Reactive module extends these existing helpers:

- **Elements Helper** - Adds `Elements.state()`, `Elements.bind()`, `Elements.unbind()`
- **Collections Helper** - Adds `Collections.bind()`, `Collections.unbind()`
- **Selector Helper** - Adds `Selector.query.bind()`, `Selector.queryAll.bind()`, unbind methods

---

**Total Methods: 30+** (10+ public API methods, 20+ internal methods)

The Reactive module focuses on a clean, simple public API while handling complexity internally! 🎉