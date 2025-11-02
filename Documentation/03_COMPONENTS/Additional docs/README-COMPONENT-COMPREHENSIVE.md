[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Components - Complete API Reference

**Version:** 2.0.0  
**License:** MIT

A traditional HTML5 component system that extends DOM Helpers with vanilla JavaScript component architecture. Build modern web applications using familiar HTML, CSS, and JavaScript with component-based organization.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Component Registration](#component-registration)
3. [Component Rendering](#component-rendering)
4. [Component Updates](#component-updates)
5. [Data Management](#data-management)
6. [Lifecycle Hooks](#lifecycle-hooks)
7. [Event System](#event-system)
8. [Component Instance Methods](#component-instance-methods)
9. [Utility Methods](#utility-methods)
10. [Advanced Features](#advanced-features)

---

## Getting Started

### Installation

Include the library after DOM Helpers core:
```html
<script src="dom-helpers.js"></script>
<script src="dom-helpers-component.js"></script>
```

### Dependencies

Required DOM Helpers libraries:
- `Elements` - Element management
- `Collections` - Collection handling
- `Selector` - DOM selection

Optional libraries (enhanced functionality):
- `DOMHelpersAsync` - Async operations
- `DOMHelpersForm` - Form handling
- `DOMHelpersStorage` - Storage management
- `DOMHelpersAnimation` - Animations

---

## Component Registration

### 1. `Components.register(name, definition)`

Register a new component with a name and definition.

**Parameters:**
- `name` (string) - Unique component name (e.g., "UserCard")
- `definition` (string|object) - Component HTML file content or definition object

**Returns:** `Components` (chainable)

**Example:**
```javascript
// Register with HTML string
Components.register('UserCard', `
  <div class="user-card" id="userCard">
    <img id="userAvatar" class="avatar" />
    <h3 id="userName"></h3>
    <p id="userEmail"></p>
  </div>
  
  <style>
    .user-card {
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  </style>
  
  <script>
    // Component initialization
    console.log('UserCard mounted:', data);
    
    // Update UI with data
    Elements.update({
      "userName.textContent": data.name,
      "userEmail.textContent": data.email,
      "userAvatar.src": data.avatar
    });
  </script>
`);

// Register with object
Components.register('TodoItem', {
  template: `<div id="todoItem" class="todo"><span id="todoText"></span></div>`,
  styles: `.todo { padding: 10px; }`,
  script: `Elements.update({ "todoText.textContent": data.text });`
});
```

---

### 2. `Components.load(name, url)`

Load and register a component from an external file.

**Parameters:**
- `name` (string) - Component name
- `url` (string) - URL to component file

**Returns:** `Promise<Components>` (chainable)

**Example:**
```javascript
// Load from external file
await Components.load('UserCard', '/components/UserCard.html');

// Load multiple components
await Promise.all([
  Components.load('Header', '/components/Header.html'),
  Components.load('Footer', '/components/Footer.html'),
  Components.load('Sidebar', '/components/Sidebar.html')
]);

// Then render
Components.render('UserCard', '#app', { name: 'John' });
```

---

### 3. `Components.unregister(name)`

Remove a component from the registry.

**Parameters:**
- `name` (string) - Component name to unregister

**Returns:** `boolean` - True if component was unregistered

**Example:**
```javascript
// Unregister a component
Components.unregister('UserCard'); // Returns true

// Check if still registered
Components.isRegistered('UserCard'); // Returns false
```

---

### 4. `Components.isRegistered(name)`

Check if a component is registered.

**Parameters:**
- `name` (string) - Component name to check

**Returns:** `boolean` - True if component exists

**Example:**
```javascript
if (Components.isRegistered('UserCard')) {
  console.log('UserCard is available');
  Components.render('UserCard', '#container');
} else {
  console.log('UserCard not found, loading...');
  await Components.load('UserCard', '/components/UserCard.html');
}
```

---

### 5. `Components.getRegistered()`

Get array of all registered component names.

**Parameters:** None

**Returns:** `Array<string>` - List of component names

**Example:**
```javascript
const components = Components.getRegistered();
console.log('Available components:', components);
// Output: ['UserCard', 'TodoList', 'Header', 'Footer']

// Create a component selector
const select = document.createElement('select');
components.forEach(name => {
  const option = document.createElement('option');
  option.value = name;
  option.textContent = name;
  select.appendChild(option);
});
```

---

## Component Rendering

### 6. `Components.render(name, container, data)`

Render a component into a container with optional data.

**Parameters:**
- `name` (string) - Registered component name
- `container` (string|Element) - Container selector or element
- `data` (object) - Optional data to pass to component (default: {})

**Returns:** `Promise<Component>` - Component instance

**Example:**
```javascript
// Render with data
const userCard = await Components.render('UserCard', '#app', {
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatar: '/images/jane.jpg',
  role: 'Developer'
});

// Render in element reference
const container = document.getElementById('sidebar');
await Components.render('Navigation', container, {
  links: [
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' }
  ]
});

// Render without data
await Components.render('Header', '#header');
```

---

### 7. `Components.renderInline(definition, container, data)`

Render an inline component without registration.

**Parameters:**
- `definition` (string|object) - Component definition
- `container` (string|Element) - Container selector or element
- `data` (object) - Optional data (default: {})

**Returns:** `Promise<Component>` - Component instance

**Example:**
```javascript
// Quick inline component
const greeting = await Components.renderInline(`
  <div id="greeting">
    <h2 id="title"></h2>
    <p id="message"></p>
  </div>
  
  <style>
    #greeting { padding: 20px; background: #f0f0f0; }
  </style>
  
  <script>
    Elements.update({
      "title.textContent": data.title,
      "message.textContent": data.message
    });
  </script>
`, '#container', {
  title: 'Welcome!',
  message: 'This is an inline component'
});
```

---

### 8. `Components.autoInit(root)`

Automatically initialize all components in the DOM.

**Parameters:**
- `root` (Element) - Root element to search (default: document)

**Returns:** `Promise<void>`

**Example:**
```html
<!-- HTML with data-component attribute -->
<div data-component="UserCard" 
     data-name="John Doe" 
     data-email="john@example.com"
     data-role="Admin">
</div>

<script>
// Register components first
Components.register('UserCard', componentDefinition);

// Auto-initialize
await Components.autoInit();

// Or initialize in specific container
const modal = document.querySelector('.modal');
await Components.autoInit(modal);
</script>
```

---

### 9. `Components.processHTML(htmlString, container)`

Process HTML string and replace component tags with rendered components.

**Parameters:**
- `htmlString` (string) - HTML containing component tags
- `container` (Element) - Optional container to insert processed HTML

**Returns:** `Promise<string>` - Processed HTML string

**Example:**
```javascript
const html = `
  <div class="app">
    <user-card name="John" email="john@example.com"></user-card>
    <todo-list items='["Buy milk", "Call mom"]'></todo-list>
  </div>
`;

// Process and insert into container
await Components.processHTML(html, document.getElementById('app'));

// Or just get processed HTML
const processed = await Components.processHTML(html);
console.log(processed); // Contains rendered components
```

---

## Component Updates

### 10. `Components.update(updates)`

Global update method for declarative component updates with multiple syntax options.

**Parameters:**
- `updates` (object) - Update definitions

**Returns:** `undefined`

**Example:**
```javascript
// 1. Declarative object style (recommended)
Components.update({
  userName: { textContent: 'John Doe' },
  userEmail: { textContent: 'john@example.com' },
  userAvatar: { 
    src: '/images/john.jpg', 
    alt: 'John Doe' 
  }
});

// 2. Dot notation style (concise)
Components.update({
  "userName.textContent": 'John Doe',
  "userEmail.textContent": 'john@example.com',
  "userAvatar.src": '/images/john.jpg'
});

// 3. Nested property style
Components.update({
  "myElement.style.color": 'red',
  "myElement.style.fontSize": '16px',
  "myElement.dataset.userId": '123'
});

// 4. Mixed styles
Components.update({
  "title.textContent": 'Dashboard',
  userInfo: {
    textContent: 'Welcome back!',
    style: { color: 'blue' }
  }
});
```

---

### 11. `Components.batchUpdate(updates)`

Batch update multiple elements efficiently.

**Parameters:**
- `updates` (object) - Element ID to updates mapping

**Returns:** `Components` (chainable)

**Example:**
```javascript
// Update multiple elements at once
Components.batchUpdate({
  userName: { 
    textContent: data.name,
    classList: { add: 'active' }
  },
  userEmail: { 
    textContent: data.email,
    style: { color: '#333' }
  },
  userStatus: { 
    textContent: data.status,
    classList: { toggle: 'online' }
  },
  lastLogin: {
    textContent: formatDate(data.lastLogin),
    dataset: { timestamp: data.lastLogin }
  }
});
```

---

### 12. `Components.scope(...elementIds)`

**Purpose:**
Components.scope() creates a scoped context (a group of DOM elements) that you can easily update later.
Think of it like saying:

“Hey, these are the elements I care about — give me an easy way to work with them!”

🧠 **What It Does**

It takes one or more element IDs and returns an object (a “scope”) that maps those IDs to their actual DOM elements.

You can then use this scope to update elements dynamically using Components.update() — without repeatedly calling document.getElementById().

**Create a scoped context for component updates.**

**Parameters:**
- `...elementIds` (string) - Element IDs to include in scope (optional)

**Returns:** `Object` - Scoped element proxy

**Example:**
```javascript
// Create scope with specific elements
const { userName, userEmail, userAvatar } = Components.scope(
  'userName', 
  'userEmail', 
  'userAvatar'
);

// Use in updates
Components.update({
  userName: { textContent: data.name },
  userEmail: { textContent: data.email },
  userAvatar: { src: data.avatar }
});

// Or create dynamic scope (all elements)
const scope = Components.scope();
Components.update({
  [scope.title]: { textContent: 'New Title' }
});
```

**Example 2: Create a dynamic scope (includes all elements)**
```javascript
// Create a scope for all elements on the page
const scope = Components.scope();

// Update using dynamic references
Components.update({
  [scope.title]: { textContent: 'New Title' }
});
```

**🧰 Why Use It**

### Makes your code cleaner and more declarative

### Avoids repetitive document.getElementById() calls

### Keeps updates grouped by logical “components”

### Great for dynamic UIs or single-page components
---

### 13. `Components.createBinding(elementIds, mapFunction)`

Create a data binding helper for reactive updates.

**Parameters:**
- `elementIds` (Array<string>) - Element IDs to bind
- `mapFunction` (Function) - Function that maps data to updates

**Returns:** `Object` - Binding object with update method

**Example:**
```javascript
// Create binding
const userBinding = Components.createBinding(
  ['userName', 'userEmail', 'userAvatar'],
  (data) => ({
    userName: { textContent: data.name },
    userEmail: { textContent: data.email },
    userAvatar: { src: data.avatar, alt: data.name }
  })
);

// Use binding
userBinding.update({
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/images/john.jpg'
});

// Access elements
console.log(userBinding.elements.userName);
```

---

## Data Management

### 14. `component.updateData(newData)`

Update component data without re-rendering (smart update).

**Parameters:**
- `newData` (object) - New data to merge with existing data

**Returns:** `Promise<void>`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app', {
  name: 'John',
  email: 'john@example.com'
});

// Update data - triggers lifecycle hooks but no re-render
await component.updateData({
  email: 'newemail@example.com',
  role: 'Admin'
});

// Access updated data
console.log(component.data);
// { name: 'John', email: 'newemail@example.com', role: 'Admin' }
```

---

### 15. `component.update(updates, options)`

Granular update method for efficient DOM updates without re-rendering.

**Parameters:**
- `updates` (object) - Update definitions
- `options` (object) - Update options
  - `immediate` (boolean) - Skip batching, update immediately (default: false)

**Returns:** `undefined`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app');

// Batched updates (recommended)
component.update({
  "userName.textContent": 'Jane Doe',
  "userEmail.textContent": 'jane@example.com'
});

// More updates in same frame - automatically batched
component.update({
  "userAvatar.src": '/images/jane.jpg'
});

// Immediate update (skip batching)
component.update({
  "status.textContent": 'Online'
}, { immediate: true });

// Deep merge for style/dataset
component.update({
  myElement: { style: { color: 'red' } }
});
component.update({
  myElement: { style: { fontSize: '16px' } }
});
// Both styles applied: color and fontSize
```

---

### 16. `component.refresh()`

Force a full re-render of the component.

**Parameters:** None

**Returns:** `Promise<void>`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app', {
  name: 'John'
});

// Change data
component.data.name = 'Jane';
component.data.items = ['New', 'Items'];

// Force re-render with new data
await component.refresh();

// Useful after structural changes
component.data.layout = 'grid'; // Changes component structure
await component.refresh(); // Re-render with new layout
```

---

### 17. `component.smartUpdate(newData, domUpdates)`

Combines data update with DOM updates for convenience.

**Parameters:**
- `newData` (object) - Data to merge
- `domUpdates` (object) - Optional DOM updates to apply

**Returns:** `Promise<void>`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app');

// Update data and DOM together
await component.smartUpdate(
  // Update data
  { 
    name: 'Jane Doe',
    email: 'jane@example.com',
    status: 'online'
  },
  // Update DOM
  { 
    "userName.textContent": 'Jane Doe',
    "userEmail.textContent": 'jane@example.com',
    statusIndicator: { 
      classList: { add: 'online', remove: 'offline' }
    }
  }
);

// Just update data (no DOM updates)
await component.smartUpdate({
  lastLogin: Date.now()
});
```

---

### 18. `component.getData()`

Get current component data (available in component script context).

**Parameters:** None

**Returns:** `Object` - Component data

**Example:**
```javascript
// In component script
const currentData = getData();
console.log('Current user:', currentData.name);

// Check if property exists
if (currentData.role === 'admin') {
  Elements.update({
    adminPanel: { style: { display: 'block' } }
  });
}
```

---

### 19. `component.setData(newData)`

Set component data (available in component script context).

**Parameters:**
- `newData` (object) - New data to merge

**Returns:** `undefined`

**Example:**
```javascript
// In component script
setData({ 
  isEditing: true,
  lastModified: Date.now()
});

// Equivalent to component.updateData()
```

---

## Lifecycle Hooks

### 20. `component.on(lifecycle, callback)`

Register a lifecycle callback.

**Parameters:**
- `lifecycle` (string) - Lifecycle name
- `callback` (Function) - Callback function

**Returns:** `undefined`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app');

// Register lifecycle hooks
component.on('beforeUpdate', async function() {
  console.log('About to update');
  // Perform pre-update tasks
});

component.on('updated', async function() {
  console.log('Update complete');
  // Perform post-update tasks
});

component.on('beforeDestroy', async function() {
  // Cleanup before destruction
  console.log('Cleaning up...');
});
```

---

### 21. `onBeforeMount(callback)`

Register beforeMount lifecycle hook (in component script).

**Parameters:**
- `callback` (Function) - Function to call before component mounts

**Returns:** `undefined`

**Example:**
```javascript
// In component script
onBeforeMount(() => {
  console.log('Component is about to mount');
  // Setup before rendering
  // Good for: data preparation, validation
});
```

---

### 22. `onMounted(callback)`

Register mounted lifecycle hook (in component script).

**Parameters:**
- `callback` (Function) - Function to call after component mounts

**Returns:** `undefined`

**Example:**
```javascript
// In component script
onMounted(() => {
  console.log('Component mounted successfully');
  
  // Setup after rendering
  // Good for: DOM manipulation, event listeners, API calls
  
  // Example: Add click listeners
  Elements.userAvatar.addEventListener('click', () => {
    console.log('Avatar clicked');
  });
  
  // Example: Fetch data
  fetch(`/api/users/${data.userId}`)
    .then(res => res.json())
    .then(userData => {
      setData(userData);
      Elements.update({
        "userName.textContent": userData.name
      });
    });
});
```

---

### 23. `onBeforeUpdate(callback)`

Register beforeUpdate lifecycle hook (in component script).

**Parameters:**
- `callback` (Function) - Function to call before component updates

**Returns:** `undefined`

**Example:**
```javascript
// In component script
onBeforeUpdate(() => {
  console.log('About to update component');
  
  // Save current state
  const currentData = getData();
  console.log('Current state:', currentData);
  
  // Perform pre-update validation
  if (!currentData.isValid) {
    console.warn('Invalid data, update may fail');
  }
});
```

---

### 24. `onUpdated(callback)`

Register updated lifecycle hook (in component script).

**Parameters:**
- `callback` (Function) - Function to call after component updates

**Returns:** `undefined`

**Example:**
```javascript
// In component script
onUpdated(() => {
  console.log('Component updated');
  
  // Perform post-update tasks
  const data = getData();
  
  // Example: Analytics tracking
  if (window.analytics) {
    analytics.track('component_updated', {
      component: component.name,
      data: data
    });
  }
  
  // Example: Update related UI
  if (data.status === 'active') {
    Elements.statusBadge.classList.add('pulse');
  }
});
```

---

### 25. `onBeforeDestroy(callback)`

Register beforeDestroy lifecycle hook (in component script).

**Parameters:**
- `callback` (Function) - Function to call before component destroys

**Returns:** `undefined`

**Example:**
```javascript
// In component script
onBeforeDestroy(() => {
  console.log('Component is about to be destroyed');
  
  // Cleanup before destruction
  // Good for: removing event listeners, canceling timers, saving state
  
  // Example: Save state to localStorage
  const data = getData();
  Storage.set('userCardState', data);
  
  // Example: Clear intervals
  if (window.updateInterval) {
    clearInterval(window.updateInterval);
  }
});
```

---

### 26. `onDestroyed(callback)`

Register destroyed lifecycle hook (in component script).

**Parameters:**
- `callback` (Function) - Function to call after component destroys

**Returns:** `undefined`

**Example:**
```javascript
// In component script
onDestroyed(() => {
  console.log('Component destroyed');
  
  // Final cleanup
  // Good for: logging, analytics, notifications
  
  // Example: Send analytics
  if (window.analytics) {
    analytics.track('component_destroyed', {
      component: component.name,
      duration: Date.now() - component.mountTime
    });
  }
});
```

---

## Event System

### 27. `component.emit(eventName, detail)`

Emit a custom event from the component.

**Parameters:**
- `eventName` (string) - Event name (automatically prefixed with "component:")
- `detail` (any) - Event detail data (default: {})

**Returns:** `undefined`

**Example:**
```javascript
// In component script
emit('userUpdated', { 
  userId: data.id,
  changes: { name: data.name }
});

// Listen for event
document.addEventListener('component:userUpdated', (e) => {
  console.log('User updated:', e.detail);
  console.log('Component:', e.detail.componentName);
  console.log('Data:', e.detail.data);
});

// Event from instance
component.emit('statusChanged', { 
  status: 'active',
  timestamp: Date.now()
});
```

---

### 28. Component Event Listeners

Listen to component events.

**Parameters:** Depends on addEventListener

**Returns:** `undefined`

**Example:**
```javascript
// Listen to specific component events
component.container.addEventListener('component:userUpdated', (e) => {
  console.log('User updated in this component:', e.detail);
});

// Listen globally
document.addEventListener('component:dataChanged', (e) => {
  console.log('Data changed in any component:', e.detail);
  console.log('Old data:', e.detail.data.oldData);
  console.log('New data:', e.detail.data.newData);
  console.log('Changes:', e.detail.data.changes);
});

// Built-in dataChanged event
component.container.addEventListener('component:dataChanged', (e) => {
  const { oldData, newData, changes } = e.detail.data;
  
  if (changes.email) {
    console.log('Email changed from', oldData.email, 'to', newData.email);
  }
});
```

---

## Component Instance Methods

### 29. `Components.getInstance(container)`

Get component instance from a container.

**Parameters:**
- `container` (string|Element) - Container selector or element

**Returns:** `Component|undefined` - Component instance or undefined

**Example:**
```javascript
// Render component
await Components.render('UserCard', '#app', { name: 'John' });

// Get instance later
const component = Components.getInstance('#app');

if (component) {
  console.log('Component data:', component.data);
  console.log('Component name:', component.name);
  console.log('Is mounted:', component.isMounted);
  
  // Update component
  await component.updateData({ name: 'Jane' });
}

// Using element reference
const container = document.getElementById('app');
const instance = Components.getInstance(container);
```

---

### 30. `component.destroy()`

Destroy a component and cleanup resources.

**Parameters:** None

**Returns:** `Promise<void>`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app');

// Destroy when done
await component.destroy();

// Component is now destroyed
console.log(component.isDestroyed); // true
console.log(component.isMounted); // false

// Container is cleared
console.log(document.getElementById('app').innerHTML); // ''
```

---

### 31. `Components.destroy(container)`

Destroy a component by its container.

**Parameters:**
- `container` (string|Element) - Container selector or element

**Returns:** `Promise<boolean>` - True if component was destroyed

**Example:**
```javascript
// Render component
await Components.render('UserCard', '#app');

// Destroy by container
const destroyed = await Components.destroy('#app');
console.log('Destroyed:', destroyed); // true

// Try to destroy non-existent
const result = await Components.destroy('#nonexistent');
console.log('Destroyed:', result); // false
```

---

### 32. `Components.destroyAll()`

Destroy all active components.

**Parameters:** None

**Returns:** `Promise<void>`

**Example:**
```javascript
// Render multiple components
await Components.render('Header', '#header');
await Components.render('Sidebar', '#sidebar');
await Components.render('Footer', '#footer');

// Destroy all at once
await Components.destroyAll();

console.log('All components destroyed');

// Useful before page navigation or cleanup
window.addEventListener('beforeunload', () => {
  Components.destroyAll();
});
```

---

### 33. `component.root`

Reference to component's root element.

**Type:** `Element`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app');

// Access root element
console.log(component.root); // Root DOM element
console.log(component.root.tagName); // e.g., 'DIV'

// Manipulate root
component.root.classList.add('featured');
component.root.style.border = '2px solid gold';

// Add event listeners
component.root.addEventListener('click', () => {
  console.log('Component clicked');
});
```

---

### 34. `component.container`

Reference to component's container element.

**Type:** `Element`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app');

// Access container
console.log(component.container); // Container element
console.log(component.container.id); // 'app'

// Container and root may be same or different
if (component.container === component.root) {
  console.log('Single root element');
} else {
  console.log('Multiple root elements');
}
```

---

### 35. `component.data`

Component's data object.

**Type:** `Object`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app', {
  name: 'John',
  email: 'john@example.com'
});

// Access data
console.log(component.data.name); // 'John'
console.log(component.data.email); // 'john@example.com'

// Modify data (prefer updateData method)
component.data.name = 'Jane';

// Better: use updateData for reactivity
await component.updateData({ name: 'Jane' });
```

---

### 36. `component.children`

Set of child components.

**Type:** `Set<Component>`

**Example:**
```javascript
const parent = await Components.render('Dashboard', '#app');

// Access children
console.log('Child components:', parent.children.size);

// Iterate children
parent.children.forEach(child => {
  console.log('Child:', child.name);
  console.log('Child data:', child.data);
});

// Check for specific child
const hasUserCard = Array.from(parent.children)
  .some(child => child.name === 'UserCard');
```

---

### 37. `component.id`

Unique component instance ID.

**Type:** `string`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app');

console.log('Component ID:', component.id); // 'comp-1'

// Each instance has unique ID
const component2 = await Components.render('UserCard', '#app2');
console.log('Component 2 ID:', component2.id); // 'comp-2'

// Use for debugging or tracking
console.log(`[${component.id}] Component action performed`);
```

---

### 38. `component.name`

Component's registered name.

**Type:** `string`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app');

console.log('Component name:', component.name); // 'UserCard'

// Useful for conditional logic
if (component.name === 'UserCard') {
  console.log('This is a user card component');
}

// Logging
console.log(`${component.name} has been updated`);
```

---

### 39. `component.isMounted`

Whether component is currently mounted.

**Type:** `boolean`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app');

console.log('Is mounted:', component.isMounted); // true

// After destroy
await component.destroy();
console.log('Is mounted:', component.isMounted); // false

// Check before operations
if (component.isMounted) {
  await component.updateData({ name: 'Jane' });
}
```

---

### 40. `component.isDestroyed`

Whether component has been destroyed.

**Type:** `boolean`

**Example:**
```javascript
const component = await Components.render('UserCard', '#app');

console.log('Is destroyed:', component.isDestroyed); // false

await component.destroy();
console.log('Is destroyed:', component.isDestroyed); // true

// Prevent operations on destroyed components
if (!component.isDestroyed) {
  await component.updateData({ name: 'Jane' });
} else {
  console.warn('Cannot update destroyed component');
}
```

---

## Utility Methods

### 41. `Components.getStats()`

Get component system statistics.

**Parameters:** None

**Returns:** `Object` - Statistics object

**Example:**
```javascript
const stats = Components.getStats();

console.log('Statistics:');
console.log('- Registered components:', stats.registered);
console.log('- Active components:', stats.active);
console.log('- Scoped styles:', stats.scopedStyles);

// Monitor system health
setInterval(() => {
  const stats = Components.getStats();
  if (stats.active > 100) {
    console.warn('High number of active components:', stats.active);
  }
}, 5000);
```

---

### 42. `Components.configure(options)`

Configure the component system.

**Parameters:**
- `options` (object) - Configuration options

**Returns:** `Components` (chainable)

**Example:**
```javascript
// Configure system (future options)
Components.configure({
  // Future configuration options
  debug: true,
  autoInit: false
});

// Chainable
Components
  .configure({ debug: true })
  .register('UserCard', definition);
```

---

## Advanced Features

### 43. Nested Components

Render components within components using `data-component` attribute.

**Example:**
```javascript
// Parent component with nested child
Components.register('Dashboard', `
  <div class="dashboard">
    <h1>Dashboard</h1>
    
    <!-- Nested UserCard component -->
    <div data-component="UserCard" 
         data-name="John Doe"
         data-email="john@example.com">
    </div>
    
    ```javascript
    <!-- Another nested component -->
    <div data-component="TodoList"
         data-items='["Task 1", "Task 2"]'>
    </div>
  </div>
  
  <script>
    onMounted(() => {
      console.log('Dashboard mounted with', component.children.size, 'children');
      
      // Access child components
      component.children.forEach(child => {
        console.log('Child component:', child.name);
      });
    });
  </script>
`);

// Render parent (children auto-render)
await Components.render('Dashboard', '#app');
```

---

### 44. Custom Component Tags

Use custom HTML tags for components (like JSX).

**Example:**

```html
<!-- Register components -->
<script>
  Components.register('UserCard', userCardDefinition);
  Components.register('TodoList', todoListDefinition);
</script>

<!-- Use custom tags -->
<div id="app">
  <user-card name="John Doe" email="john@example.com"></user-card>
  <todo-list items='["Buy milk", "Call mom"]'></todo-list>
</div>

<script>
  // Auto-initialize converts custom tags to components
  await Components.autoInit();
</script>
```

**PascalCase Components:**

```html
<!-- Works with single-word PascalCase too -->
<UserCard name="Jane" email="jane@example.com"></UserCard>
<TodoList items='["Task 1", "Task 2"]'></TodoList>

<script>
  // Register with PascalCase name
  Components.register('UserCard', definition);
  Components.register('TodoList', definition);
  
  // Browser converts to lowercase: usercard, todolist
  // Library handles the conversion automatically
  await Components.autoInit();
</script>
```

---

### 45. Scoped CSS

Automatic CSS scoping to prevent style conflicts.

**Example:**

```javascript
Components.register('BlueButton', `
  <button id="myButton" class="btn">Click Me</button>
  
  <style>
    /* These styles are automatically scoped */
    .btn {
      background: blue;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
    }
    
    .btn:hover {
      background: darkblue;
    }
  </style>
  
  <script>
    Elements.myButton.addEventListener('click', () => {
      console.log('Button clicked!');
    });
  </script>
`);

Components.register('RedButton', `
  <button id="myButton" class="btn">Click Me</button>
  
  <style>
    /* Different styles, same class names - no conflict! */
    .btn {
      background: red;
      color: white;
      padding: 10px 20px;
    }
  </style>
`);

// Both render with isolated styles
await Components.render('BlueButton', '#container1');
await Components.render('RedButton', '#container2');
```

---

### 46. Component Script Context

Access special variables and functions within component scripts.

**Available Context:**

- `component` - Current component instance
- `container` - Container element
- `root` - Root element
- `data` - Component data
- `Elements` - DOM Helpers Elements
- `Collections` - DOM Helpers Collections
- `Selector` - DOM Helpers Selector
- `getData()` - Get current data
- `setData(newData)` - Set data
- `emit(eventName, detail)` - Emit event
- `destroy()` - Destroy component
- Lifecycle hooks: `onBeforeMount`, `onMounted`, etc.
- Optional: `Async`, `Form`, `Storage`, `Animation` (if loaded)

**Example:**

```javascript
Components.register('ContextDemo', `
  <div id="demo"></div>
  
  <script>
    // Component instance
    console.log('Component ID:', component.id);
    console.log('Component name:', component.name);
    
    // Elements
    console.log('Container:', container);
    console.log('Root:', root);
    
    // Data
    console.log('Initial data:', data);
    
    // DOM Helpers
    console.log('Elements available:', typeof Elements !== 'undefined');
    console.log('Collections available:', typeof Collections !== 'undefined');
    
    // Optional libraries
    if (typeof Async !== 'undefined') {
      console.log('Async library available');
    }
    
    // Lifecycle
    onMounted(() => {
      console.log('Component mounted!');
    });
    
    // Events
    emit('ready', { timestamp: Date.now() });
    
    // Update data
    setData({ initialized: true });
  </script>
`);
```

---

### 47. DOM Helpers Integration

Full integration with DOM Helpers core functionality.

**Example:**

```javascript
Components.register('IntegrationDemo', `
  <div class="demo">
    <input type="text" id="nameInput" />
    <button id="saveBtn">Save</button>
    <div id="output"></div>
  </div>
  
  <script>
    // Use Elements for direct access
    Elements.saveBtn.addEventListener('click', () => {
      const value = Elements.nameInput.value;
      
      // Update using Elements.update()
      Elements.update({
        "output.textContent": 'Saved: ' + value,
        nameInput: { value: '' }
      });
      
      // Or using component.update()
      component.update({
        "output.style.color": 'green'
      });
    });
    
    // Use with Collections
    if (Collections && Collections.users) {
      Elements.update({
        "output.textContent": Collections.users.length + ' users'
      });
    }
    
    // Use with Selector
    if (Selector) {
      const inputs = Selector.query('input', container);
      console.log('Found inputs:', inputs.length);
    }
  </script>
`);
```

---

### 48. Async Operations Integration

Use DOM Helpers Async library within components.

**Example:**

```javascript
Components.register('AsyncDemo', `
  <div class="user-loader">
    <div id="loading">Loading...</div>
    <div id="userInfo" style="display:none;"></div>
    <div id="error" style="display:none;"></div>
  </div>
  
  <script>
    onMounted(async () => {
      if (!Async) {
        console.error('Async library not available');
        return;
      }
      
      try {
        // Fetch user data
        const userData = await Async.fetch('/api/users/' + data.userId);
        
        // Update UI
        component.update({
          loading: { style: { display: 'none' } },
          userInfo: { 
            style: { display: 'block' },
            textContent: 'User: ' + userData.name
          }
        });
        
        // Update data
        setData(userData);
        
      } catch (err) {
        component.update({
          loading: { style: { display: 'none' } },
          error: { 
            style: { display: 'block' },
            textContent: 'Error: ' + err.message
          }
        });
      }
    });
  </script>
`);

// Render with user ID
await Components.render('AsyncDemo', '#app', { userId: 123 });
```

---

### 49. Form Integration

Use DOM Helpers Form library for form handling.

**Example:**

```javascript
Components.register('FormDemo', `
  <form id="userForm">
    <input type="text" name="name" id="nameInput" placeholder="Name" />
    <input type="email" name="email" id="emailInput" placeholder="Email" />
    <button type="submit">Submit</button>
    <div id="result"></div>
  </form>
  
  <script>
    if (!Form) {
      console.error('Form library not available');
      return;
    }
    
    // Setup form handling
    Elements.userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form data using Form library
      const formData = Form.getData('userForm');
      console.log('Form data:', formData);
      
      // Validate
      const isValid = Form.validate('userForm', {
        name: { required: true, minLength: 2 },
        email: { required: true, email: true }
      });
      
      if (!isValid) {
        component.update({
          "result.textContent": 'Please fix validation errors',
          "result.style.color": 'red'
        });
        return;
      }
      
      // Submit
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        component.update({
          "result.textContent": 'User saved successfully!',
          "result.style.color": 'green'
        });
        
        // Clear form
        Form.reset('userForm');
        
      } catch (err) {
        component.update({
          "result.textContent": 'Error: ' + err.message,
          "result.style.color": 'red'
        });
      }
    });
  </script>
`);
```

---

### 50. Storage Integration

Use DOM Helpers Storage library for data persistence.

**Example:**

```javascript
Components.register('StorageDemo', `
  <div class="settings">
    <h3>Settings</h3>
    <label>
      <input type="checkbox" id="darkMode" />
      Dark Mode
    </label>
    <button id="saveSettings">Save</button>
    <button id="clearSettings">Clear</button>
    <div id="status"></div>
  </div>
  
  <script>
    if (!Storage) {
      console.error('Storage library not available');
      return;
    }
    
    onMounted(() => {
      // Load saved settings
      const settings = Storage.get('userSettings') || {};
      
      if (settings.darkMode) {
        Elements.darkMode.checked = true;
        document.body.classList.add('dark-mode');
      }
      
      setData(settings);
    });
    
    // Save settings
    Elements.saveSettings.addEventListener('click', () => {
      const settings = {
        darkMode: Elements.darkMode.checked,
        lastSaved: Date.now()
      };
      
      Storage.set('userSettings', settings);
      
      component.update({
        "status.textContent": 'Settings saved!',
        "status.style.color": 'green'
      });
      
      // Apply dark mode
      if (settings.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
    
    // Clear settings
    Elements.clearSettings.addEventListener('click', () => {
      Storage.remove('userSettings');
      Elements.darkMode.checked = false;
      document.body.classList.remove('dark-mode');
      
      component.update({
        "status.textContent": 'Settings cleared!',
        "status.style.color": 'orange'
      });
    });
  </script>
`);
```

---

### 51. Animation Integration

Use DOM Helpers Animation library for animations.

**Example:**

```javascript
Components.register('AnimationDemo', `
  <div class="animation-demo">
    <div id="box" style="width:100px;height:100px;background:blue;"></div>
    <button id="animateBtn">Animate</button>
    <button id="fadeBtn">Fade</button>
    <button id="slideBtn">Slide</button>
  </div>
  
  <script>
    if (!Animation) {
      console.error('Animation library not available');
      return;
    }
    
    // Animate box
    Elements.animateBtn.addEventListener('click', () => {
      Animation.animate(Elements.box, {
        transform: 'translateX(200px) rotate(360deg)',
        background: 'red'
      }, {
        duration: 1000,
        easing: 'ease-in-out'
      });
    });
    
    // Fade in/out
    Elements.fadeBtn.addEventListener('click', () => {
      if (Elements.box.style.opacity === '0') {
        Animation.fadeIn(Elements.box, { duration: 500 });
      } else {
        Animation.fadeOut(Elements.box, { duration: 500 });
      }
    });
    
    // Slide toggle
    Elements.slideBtn.addEventListener('click', () => {
      Animation.slideToggle(Elements.box, { duration: 500 });
    });
    
    // Animate on mount
    onMounted(() => {
      Animation.fadeIn(Elements.box, { duration: 500 });
    });
  </script>
`);
```

---

### 52. Update Batching and Performance

Optimize updates with automatic batching using requestAnimationFrame.

**Example:**

```javascript
Components.register('PerformanceDemo', `
  <div class="counter">
    <div id="count">0</div>
    <div id="updates">Updates: 0</div>
    <button id="startBtn">Start Fast Updates</button>
  </div>
  
  <script>
    let counter = 0;
    let updateCount = 0;
    
    Elements.startBtn.addEventListener('click', () => {
      // Trigger 100 updates rapidly
      for (let i = 0; i < 100; i++) {
        counter++;
        
        // These are automatically batched!
        component.update({
          "count.textContent": counter.toString()
        });
      }
      
      updateCount++;
      
      // This runs in same frame, also batched
      component.update({
        "updates.textContent": 'Updates: ' + updateCount
      });
      
      console.log('Queued 100+ updates, but only 1 DOM update will occur!');
    });
    
    // Immediate update (skips batching)
    Elements.startBtn.addEventListener('dblclick', () => {
      component.update({
        "count.textContent": 'IMMEDIATE',
        "count.style.color": 'red'
      }, { immediate: true });
      
      console.log('Immediate update applied instantly');
    });
  </script>
`);
```

---

### 53. Deep Merge for Style and Dataset

Style and dataset updates are deeply merged automatically.

**Example:**

```javascript
Components.register('DeepMergeDemo', `
  <div id="styledBox" style="width:100px;height:100px;"></div>
  <button id="update1">Update Color</button>
  <button id="update2">Update Size</button>
  <div id="info"></div>
  
  <script>
    // First update - set color
    Elements.update1.addEventListener('click', () => {
      component.update({
        styledBox: { 
          style: { 
            background: 'blue',
            color: 'white'
          }
        }
      });
      console.log('Updated: color styles');
    });
    
    // Second update - set size (merged with color!)
    Elements.update2.addEventListener('click', () => {
      component.update({
        styledBox: { 
          style: { 
            width: '200px',
            height: '200px'
          }
        }
      });
      console.log('Updated: size styles');
      console.log('Previous color styles preserved!');
    });
    
    // Dataset deep merge
    component.update({
      info: { 
        dataset: { 
          userId: '123',
          userName: 'John'
        }
      }
    });
    
    // Later, add more dataset properties (merged!)
    component.update({
      info: { 
        dataset: { 
          userEmail: 'john@example.com'
        }
      }
    });
    
    // All dataset properties are preserved
    console.log(Elements.info.dataset);
    // { userId: '123', userName: 'John', userEmail: 'john@example.com' }
  </script>
`);
```

---

### 54. Shallow Equality Check

Updates only apply if values actually change (performance optimization).

**Example:**

```javascript
Components.register('EqualityDemo', `
  <div id="output">Initial</div>
  <button id="sameBtn">Set Same Value</button>
  <button id="newBtn">Set New Value</button>
  
  <script>
    let domUpdateCount = 0;
    
    // Monitor actual DOM updates
    const observer = new MutationObserver((mutations) => {
      domUpdateCount += mutations.length;
      console.log('DOM mutations:', domUpdateCount);
    });
    
    observer.observe(Elements.output, {
      characterData: true,
      childList: true,
      subtree: true
    });
    
    Elements.sameBtn.addEventListener('click', () => {
      // Set same value - skipped due to shallow equality check
      component.update({
        "output.textContent": Elements.output.textContent
      });
      console.log('Attempted update with same value - skipped!');
    });
    
    Elements.newBtn.addEventListener('click', () => {
      // Set new value - applied
      component.update({
        "output.textContent": 'Updated: ' + Date.now()
      });
      console.log('Applied update with new value');
    });
  </script>
`);
```

---

### 55. Component Communication

Components can communicate through events and shared state.

**Example:**

```javascript
// Parent component
Components.register('ParentComponent', `
  <div class="parent">
    <h2>Parent Component</h2>
    <div id="parentMessage">Waiting for child...</div>
    <button id="sendToChild">Send to Child</button>
    
    <div data-component="ChildComponent" data-parent-id="parent123"></div>
  </div>
  
  <script>
    // Listen for child events
    document.addEventListener('component:childAction', (e) => {
      const { data } = e.detail;
      
      component.update({
        "parentMessage.textContent": 'Child says: ' + data.message,
        "parentMessage.style.color": 'green'
      });
    });
    
    // Send message to child
    Elements.sendToChild.addEventListener('click', () => {
      emit('parentAction', {
        message: 'Hello from parent!',
        timestamp: Date.now()
      });
    });
  </script>
`);

// Child component
Components.register('ChildComponent', `
  <div class="child">
    <h3>Child Component</h3>
    <div id="childMessage">Waiting for parent...</div>
    <button id="sendToParent">Send to Parent</button>
  </div>
  
  <script>
    // Listen for parent events
    document.addEventListener('component:parentAction', (e) => {
      const { data } = e.detail;
      
      component.update({
        "childMessage.textContent": 'Parent says: ' + data.message,
        "childMessage.style.color": 'blue'
      });
    });
    
    // Send message to parent
    Elements.sendToParent.addEventListener('click', () => {
      emit('childAction', {
        message: 'Hello from child!',
        parentId: data.parentId
      });
    });
  </script>
`);

// Render parent (child auto-renders)
await Components.render('ParentComponent', '#app');
```

---

### 56. Error Handling

Robust error handling throughout the component lifecycle.

**Example:**

```javascript
Components.register('ErrorDemo', `
  <div class="error-demo">
    <button id="causeError">Cause Error</button>
    <button id="safeAction">Safe Action</button>
    <div id="status"></div>
  </div>
  
  <script>
    // Error in lifecycle
    onMounted(() => {
      try {
        // Some risky operation
        if (Math.random() > 0.5) {
          throw new Error('Random mount error');
        }
        console.log('Mounted successfully');
      } catch (err) {
        console.error('Mount error:', err);
        component.update({
          "status.textContent": 'Mount error: ' + err.message,
          "status.style.color": 'red'
        });
      }
    });
    
    // Error in event handler
    Elements.causeError.addEventListener('click', () => {
      try {
        // Cause intentional error
        throw new Error('Intentional error for demo');
      } catch (err) {
        console.error('Event handler error:', err);
        component.update({
          "status.textContent": 'Error: ' + err.message,
          "status.style.color": 'red'
        });
      }
    });
    
    // Safe action with error handling
    Elements.safeAction.addEventListener('click', async () => {
      try {
        component.update({
          "status.textContent": 'Processing...',
          "status.style.color": 'orange'
        });
        
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        component.update({
          "status.textContent": 'Success!',
          "status.style.color": 'green'
        });
      } catch (err) {
        component.update({
          "status.textContent": 'Error: ' + err.message,
          "status.style.color": 'red'
        });
      }
    });
  </script>
`);

// Catch registration errors
try {
  await Components.load('BrokenComponent', '/nonexistent.html');
} catch (err) {
  console.error('Failed to load component:', err);
}

// Catch render errors
try {
  await Components.render('NonExistentComponent', '#app');
} catch (err) {
  console.error('Render error:', err);
}
```

---

### 57. Memory Management and Cleanup

Proper cleanup prevents memory leaks.

**Example:**

```javascript
Components.register('CleanupDemo', `
  <div class="cleanup-demo">
    <div id="timer">Timer: 0</div>
    <div id="listener">Click count: 0</div>
    <button id="increment">Increment</button>
  </div>
  
  <script>
    let intervalId;
    let clickCount = 0;
    let timerCount = 0;
    
    // Store refs for cleanup
    const clickHandler = () => {
      clickCount++;
      component.update({
        "listener.textContent": 'Click count: ' + clickCount
      });
    };
    
    onMounted(() => {
      // Setup interval
      intervalId = setInterval(() => {
        timerCount++;
        component.update({
          "timer.textContent": 'Timer: ' + timerCount
        });
      }, 1000);
      
      // Setup event listener
      Elements.increment.addEventListener('click', clickHandler);
      
      console.log('Setup complete');
    });
    
    // Cleanup before destroy
    onBeforeDestroy(() => {
      console.log('Cleaning up...');
      
      // Clear interval
      if (intervalId) {
        clearInterval(intervalId);
        console.log('Interval cleared');
      }
      
      // Remove event listeners
      Elements.increment.removeEventListener('click', clickHandler);
      console.log('Listeners removed');
      
      // Clear any stored data
      clickCount = 0;
      timerCount = 0;
    });
    
    onDestroyed(() => {
      console.log('Component destroyed and cleaned up');
    });
  </script>
`);

// Render and later destroy (cleanup happens automatically)
const component = await Components.render('CleanupDemo', '#app');

// After some time...
await component.destroy(); // Cleanup runs automatically
```

---

### 58. Dynamic Component Loading

Load components on-demand for better performance.

**Example:**

```javascript
// Lazy load component when needed
async function loadUserProfile(userId) {
  // Check if component is loaded
  if (!Components.isRegistered('UserProfile')) {
    console.log('Loading UserProfile component...');
    await Components.load('UserProfile', '/components/UserProfile.html');
    console.log('UserProfile loaded');
  }
  
  // Render with user data
  return await Components.render('UserProfile', '#profile', { userId });
}

// Route-based loading
const routes = {
  '/dashboard': async () => {
    await Components.load('Dashboard', '/components/Dashboard.html');
    return Components.render('Dashboard', '#app');
  },
  '/profile': async () => {
    await Components.load('Profile', '/components/Profile.html');
    return Components.render('Profile', '#app');
  },
  '/settings': async () => {
    await Components.load('Settings', '/components/Settings.html');
    return Components.render('Settings', '#app');
  }
};

// Navigate
async function navigate(path) {
  // Destroy current component
  await Components.destroy('#app');
  
  // Load and render new component
  const route = routes[path];
  if (route) {
    await route();
  }
}

// Example: navigate to profile
await navigate('/profile');
```

---

### 59. Component Testing Utilities

Built-in methods for testing components.

**Example:**

```javascript
// Test component rendering
async function testComponentRender() {
  const container = document.createElement('div');
  container.id = 'test-container';
  document.body.appendChild(container);
  
  try {
    // Render component
    const component = await Components.render('UserCard', container, {
      name: 'Test User',
      email: 'test@example.com'
    });
    
    // Verify render
    console.assert(component.isMounted, 'Component should be mounted');
    console.assert(component.data.name === 'Test User', 'Data should match');
    
    // Test update
    await component.updateData({ name: 'Updated User' });
    console.assert(component.data.name === 'Updated User', 'Data should update');
    
    // Test DOM update
    component.update({
      "userName.textContent": 'DOM Updated'
    });
    
    // Wait for RAF
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    const userName = container.querySelector('#userName');
    console.assert(userName.textContent === 'DOM Updated', 'DOM should update');
    
    // Test lifecycle
    let beforeDestroyCalled = false;
    component.on('beforeDestroy', () => {
      beforeDestroyCalled = true;
    });
    
    await component.destroy();
    console.assert(beforeDestroyCalled, 'beforeDestroy should be called');
    console.assert(component.isDestroyed, 'Component should be destroyed');
    
    console.log('✓ All tests passed');
    
  } finally {
    // Cleanup
    document.body.removeChild(container);
  }
}

// Run tests
testComponentRender();
```

---

### 60. Complete Real-World Example

A full-featured todo list component demonstrating all features.

**Example:**

```javascript
Components.register('TodoList', `
  <div class="todo-list">
    <h2 id="title">My Tasks</h2>
    
    <form id="addForm">
      <input type="text" id="taskInput" placeholder="New task..." required />
      <button type="submit">Add</button>
    </form>
    
    <div id="stats">
      <span id="totalCount">0</span> total,
      <span id="completedCount">0</span> completed
    </div>
    
    <ul id="taskList"></ul>
    
    <div id="empty" style="display:none;">
      No tasks yet. Add one above!
    </div>
  </div>
  
  <style>
    .todo-list {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    #addForm {
      display: flex;
      gap: 10px;
      margin: 20px 0;
    }
    
    #taskInput {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    button {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:hover {
      background: #0056b3;
    }
    
    #stats {
      color: #666;
      margin: 10px 0;
    }
    
    #taskList {
      list-style: none;
      padding: 0;
    }
    
    .task-item {
      padding: 10px;
      margin: 5px 0;
      background: #f8f9fa;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .task-item.completed {
      opacity: 0.6;
      text-decoration: line-through;
    }
    
    .task-actions {
      display: flex;
      gap: 5px;
    }
    
    .task-actions button {
      padding: 5px 10px;
      font-size: 12px;
    }
    
    #empty {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  </style>
  
  <script>
    // Initialize state
    const state = {
      tasks: data.tasks || [],
      filter: 'all'
    };
    
    // Render tasks
    function renderTasks() {
      const taskList = Elements.taskList;
      taskList.innerHTML = '';
      
      if (state.tasks.length === 0) {
        component.update({
          taskList: { style: { display: 'none' } },
          empty: { style: { display: 'block' } }
        });
        return;
      }
      
      component.update({
        taskList: { style: { display: 'block' } },
        empty: { style: { display: 'none' } }
      });
      
      state.tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.innerHTML = `
          <span>${task.text}</span>
          <div class="task-actions">
            <button data-action="toggle" data-index="${index}">
              ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <button data-action="delete" data-index="${index}">Delete</button>
          </div>
        `;
        taskList.appendChild(li);
      });
      
      updateStats();
      saveToStorage();
    }
    
    // Update statistics
    function updateStats() {
      const total = state.tasks.length;
      const completed = state.tasks.filter(t => t.completed).length;
      
      component.update({
        "totalCount.textContent": total.toString(),
        "completedCount.textContent": completed.toString()
      });
    }
    
    // Save to localStorage
    function saveToStorage() {
      if (Storage) {
        Storage.set('todoList', state.tasks);
      }
    }
    
    // Load from localStorage
    function loadFromStorage() {
      if (Storage) {
        const saved = Storage.get('todoList');
        ```javascript
        if (saved) {
          state.tasks = saved;
          renderTasks();
        }
      }
    }
    
    // Add task
    Elements.addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const text = Elements.taskInput.value.trim();
      if (!text) return;
      
      state.tasks.push({
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
      });
      
      Elements.taskInput.value = '';
      renderTasks();
      
      emit('taskAdded', { task: state.tasks[state.tasks.length - 1] });
    });
    
    // Task actions (toggle, delete)
    Elements.taskList.addEventListener('click', (e) => {
      const button = e.target.closest('button[data-action]');
      if (!button) return;
      
      const action = button.dataset.action;
      const index = parseInt(button.dataset.index);
      
      if (action === 'toggle') {
        state.tasks[index].completed = !state.tasks[index].completed;
        emit('taskToggled', { task: state.tasks[index] });
      } else if (action === 'delete') {
        const deleted = state.tasks.splice(index, 1)[0];
        emit('taskDeleted', { task: deleted });
      }
      
      renderTasks();
    });
    
    // Lifecycle
    onMounted(() => {
      console.log('TodoList mounted');
      loadFromStorage();
      
      // Setup keyboard shortcuts
      document.addEventListener('keydown', handleKeyboard);
    });
    
    onBeforeDestroy(() => {
      console.log('TodoList cleaning up');
      document.removeEventListener('keydown', handleKeyboard);
    });
    
    // Keyboard shortcuts
    function handleKeyboard(e) {
      // Ctrl/Cmd + K to focus input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        Elements.taskInput.focus();
      }
    }
    
    // Public methods (expose via component)
    component.addTask = (text) => {
      state.tasks.push({
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
      });
      renderTasks();
    };
    
    component.clearCompleted = () => {
      state.tasks = state.tasks.filter(t => !t.completed);
      renderTasks();
      emit('completedCleared');
    };
    
    component.getTasks = () => state.tasks;
    
    // Initial render
    renderTasks();
  </script>
`);

// Usage
const todoList = await Components.render('TodoList', '#app', {
  tasks: [
    { id: 1, text: 'Learn DOM Helpers', completed: true },
    { id: 2, text: 'Build awesome app', completed: false }
  ]
});

// Listen to events
document.addEventListener('component:taskAdded', (e) => {
  console.log('New task:', e.detail.data.task);
});

document.addEventListener('component:taskToggled', (e) => {
  console.log('Task toggled:', e.detail.data.task);
});

// Use public methods
setTimeout(() => {
  todoList.addTask('Programmatically added task');
}, 2000);

setTimeout(() => {
  todoList.clearCompleted();
  console.log('Remaining tasks:', todoList.getTasks());
}, 5000);
```

---

## Best Practices

### Update Strategies

**1. Use `component.update()` for frequent UI updates (recommended)**
```javascript
// Efficient, batched updates
component.update({
  "userName.textContent": data.name,
  "userEmail.textContent": data.email
});
```

**2. Use `component.updateData()` for data-only changes**
```javascript
// Updates data, triggers lifecycle, no re-render
await component.updateData({ name: 'John' });
```

**3. Use `component.smartUpdate()` for combined updates**
```javascript
// Update data and DOM together
await component.smartUpdate(
  { name: 'John', status: 'active' },
  { "userName.textContent": 'John' }
);
```

**4. Use `component.refresh()` only for structural changes**
```javascript
// Full re-render (expensive)
component.data.layout = 'grid';
await component.refresh();
```

---

### Performance Tips

**1. Batch Updates**
```javascript
// Good - batched automatically
component.update({
  element1: { textContent: 'Value 1' },
  element2: { textContent: 'Value 2' },
  element3: { textContent: 'Value 3' }
});

// Avoid - multiple separate updates
component.update({ element1: { textContent: 'Value 1' } });
component.update({ element2: { textContent: 'Value 2' } });
component.update({ element3: { textContent: 'Value 3' } });
```

**2. Use Immediate Updates Sparingly**
```javascript
// Use immediate only when necessary
component.update({
  critical: { textContent: 'NOW' }
}, { immediate: true });
```

**3. Leverage Shallow Equality**
```javascript
// Value doesn't change - update skipped automatically
const value = "same";
component.update({ "element.textContent": value });
component.update({ "element.textContent": value }); // Skipped!
```

**4. Clean Up Properly**
```javascript
onBeforeDestroy(() => {
  // Always clean up intervals, listeners, etc.
  clearInterval(myInterval);
  document.removeEventListener('click', myHandler);
});
```

---

### Code Organization

**1. Separate Concerns**
```javascript
Components.register('WellOrganized', `
  <div><!-- Template --></div>
  
  <style>/* Styles */</style>
  
  <script>
    // State
    const state = { /* ... */ };
    
    // Functions
    function render() { /* ... */ }
    function handleClick() { /* ... */ }
    
    // Lifecycle
    onMounted(() => { /* ... */ });
    
    // Event listeners
    Elements.button.addEventListener('click', handleClick);
  </script>
`);
```

**2. Use Meaningful IDs**
```javascript
// Good
<button id="submitButton">Submit</button>
<div id="userProfileCard"></div>

// Avoid
<button id="btn1">Submit</button>
<div id="div2"></div>
```

**3. Document Complex Logic**
```javascript
<script>
  // Calculate user's tier based on points
  // Tier 1: 0-99 points
  // Tier 2: 100-499 points
  // Tier 3: 500+ points
  function calculateTier(points) {
    if (points < 100) return 1;
    if (points < 500) return 2;
    return 3;
  }
</script>
```

---

## Troubleshooting

### Component Not Rendering

```javascript
// Check if registered
if (!Components.isRegistered('MyComponent')) {
  console.error('Component not registered');
  await Components.load('MyComponent', '/components/MyComponent.html');
}

// Check container exists
const container = document.querySelector('#app');
if (!container) {
  console.error('Container not found');
}

// Check for errors
try {
  await Components.render('MyComponent', '#app');
} catch (err) {
  console.error('Render error:', err);
}
```

### Updates Not Working

```javascript
// Check if component is mounted
if (!component.isMounted) {
  console.error('Component not mounted');
}

// Check if element exists
const element = document.querySelector('#myElement');
if (!element) {
  console.error('Element not found');
}

// Use immediate update for debugging
component.update({
  "myElement.textContent": 'Test'
}, { immediate: true });

// Check Elements registry
console.log('Available elements:', Object.keys(Elements));
```

### Memory Leaks

```javascript
// Always clean up in beforeDestroy
onBeforeDestroy(() => {
  // Clear intervals
  if (myInterval) clearInterval(myInterval);
  
  // Remove listeners
  document.removeEventListener('scroll', scrollHandler);
  
  // Cancel pending operations
  if (abortController) abortController.abort();
  
  // Clear references
  myData = null;
});
```

### Scoped Styles Not Working

```javascript
// Check if styles are in component definition
Components.register('MyComponent', `
  <div>Content</div>
  
  <style>
    /* Styles must be in <style> tags */
    .my-class { color: red; }
  </style>
  
  <script>/* ... */</script>
`);

// Verify scope attribute applied
const component = await Components.render('MyComponent', '#app');
console.log('Has scope:', component.container.hasAttribute(component.scopeId));
```

---

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Required Features**: 
  - ES6+ (Classes, Promises, async/await)
  - Proxy
  - WeakMap/WeakSet
  - requestAnimationFrame
  - CustomEvent
  - MutationObserver (for advanced features)

### Polyfills

For older browsers, include:
```html
<script src="https://cdn.jsdelivr.net/npm/core-js-bundle@3/minified.js"></script>
<script src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3/dist/fetch.umd.js"></script>
```

---

## Migration Guide

### From Pure JavaScript

**Before:**
```javascript
const container = document.getElementById('app');
container.innerHTML = `
  <div id="userName">John</div>
  <div id="userEmail">john@example.com</div>
`;

document.getElementById('userName').textContent = 'Jane';
```

**After:**
```javascript
Components.register('UserCard', `
  <div id="userName"></div>
  <div id="userEmail"></div>
  
  <script>
    Elements.update({
      "userName.textContent": data.name,
      "userEmail.textContent": data.email
    });
  </script>
`);

await Components.render('UserCard', '#app', {
  name: 'Jane',
  email: 'jane@example.com'
});
```

### From Other Frameworks

**React-like:**
```javascript
// React pattern
function UserCard({ name, email }) {
  return <div>{name} - {email}</div>;
}

// DOM Components pattern
Components.register('UserCard', `
  <div>
    <span id="name"></span> - <span id="email"></span>
  </div>
  
  <script>
    Elements.update({
      "name.textContent": data.name,
      "email.textContent": data.email
    });
  </script>
`);
```

---

## API Quick Reference

### Components Object

| Method | Description | Returns |
|--------|-------------|---------|
| `register(name, definition)` | Register component | Components |
| `load(name, url)` | Load from file | Promise<Components> |
| `render(name, container, data)` | Render component | Promise<Component> |
| `renderInline(definition, container, data)` | Render inline | Promise<Component> |
| `autoInit(root)` | Auto-initialize | Promise<void> |
| `update(updates)` | Global update | undefined |
| `batchUpdate(updates)` | Batch update | Components |
| `scope(...ids)` | Create scope | Object |
| `createBinding(ids, fn)` | Create binding | Object |
| `getInstance(container)` | Get instance | Component |
| `destroy(container)` | Destroy by container | Promise<boolean> |
| `destroyAll()` | Destroy all | Promise<void> |
| `isRegistered(name)` | Check registered | boolean |
| `getRegistered()` | Get all names | Array<string> |
| `unregister(name)` | Unregister | boolean |
| `getStats()` | Get statistics | Object |
| `configure(options)` | Configure system | Components |

### Component Instance

| Property/Method | Description | Type/Returns |
|-----------------|-------------|--------------|
| `id` | Unique ID | string |
| `name` | Component name | string |
| `container` | Container element | Element |
| `root` | Root element | Element |
| `data` | Component data | Object |
| `children` | Child components | Set<Component> |
| `isMounted` | Mount status | boolean |
| `isDestroyed` | Destroy status | boolean |
| `update(updates, options)` | Update DOM | undefined |
| `updateData(newData)` | Update data | Promise<void> |
| `smartUpdate(data, dom)` | Combined update | Promise<void> |
| `refresh()` | Full re-render | Promise<void> |
| `emit(event, detail)` | Emit event | undefined |
| `on(lifecycle, callback)` | Add lifecycle | undefined |
| `destroy()` | Destroy | Promise<void> |

### Lifecycle Hooks

| Hook | When Called |
|------|-------------|
| `onBeforeMount` | Before component mounts |
| `onMounted` | After component mounts |
| `onBeforeUpdate` | Before data/DOM update |
| `onUpdated` | After data/DOM update |
| `onBeforeDestroy` | Before destruction |
| `onDestroyed` | After destruction |

---

## Examples Repository

Find more examples at: [github.com/dom-helpers-js/dom-helpers-components](https://github.com/dom-helpers-js/dom-helpers-components)

- **Basic Components**: Simple examples to get started
- **Advanced Patterns**: Complex real-world scenarios
- **Integration Examples**: Using with other libraries
- **Performance Demos**: Optimization techniques
- **Full Applications**: Complete app examples

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Support

- **Documentation**: [docs.domhelpers.com](https://docs.domhelpers.com)
- **Issues**: [github.com/dom-helpers-js/issues](https://github.com/dom-helpers-js/issues)
- **Discussions**: [github.com/dom-helpers-js/discussions](https://github.com/dom-helpers-js/discussions)
- **Email**: support@domhelpers.com

---

## Changelog

### Version 2.0.0
- Complete rewrite with traditional HTML5 approach
- Added automatic update batching
- Deep merge for style/dataset
- Shallow equality checks
- Enhanced error handling
- Improved lifecycle management
- Better memory management
- Full DOM Helpers integration

---

**Built with ❤️ for the web**
```


