# 📖 API Reference - DOM Helpers Components

Complete API documentation for all features and methods.

---

## 📋 Table of Contents

- [Components API](#components-api)
- [Elements.update()](#elementsupdate)
- [Component Definition](#component-definition)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Custom Events](#custom-events)
- [Component Methods](#component-methods)

---

## Components API

### `Components.register(name, definition)`

Register a new component.

**Parameters:**
- `name` (string) - Component name in PascalCase (e.g., 'UserCard')
- `definition` (string|object) - Component HTML/CSS/JS or object with template, styles, script

**Returns:** Components object (chainable)

**Example:**
```javascript
Components.register('MyComponent', `
  <div>HTML</div>
  <style>CSS</style>
  <script>JavaScript</script>
`);
```

---

### `Components.render(name, container, data)`

Render a component into a container.

**Parameters:**
- `name` (string) - Registered component name
- `container` (Element|string) - DOM element or selector
- `data` (object) - Data to pass to component (optional)

**Returns:** Promise<Component> - Component instance

**Example:**
```javascript
await Components.render('UserCard', '#container', {
  name: 'John',
  email: 'john@example.com'
});
```

---

### `Components.load(name, url)`

Load a component from an external file.

**Parameters:**
- `name` (string) - Component name to register
- `url` (string) - URL to component file

**Returns:** Promise<Components>

**Example:**
```javascript
await Components.load('UserCard', '/components/user-card.html');
```

---

### `Components.renderInline(definition, container, data)`

Render a one-time component without registration.

**Parameters:**
- `definition` (string) - Component definition
- `container` (Element|string) - Target container
- `data` (object) - Component data (optional)

**Returns:** Promise<Component>

**Example:**
```javascript
await Components.renderInline(`
  <div id="temp">Temporary Component</div>
`, '#container');
```

---

### `Components.autoInit(root)`

Automatically initialize all components in DOM.

**Parameters:**
- `root` (Element) - Root element to search (default: document)

**Returns:** Promise<void>

**Example:**
```javascript
await Components.autoInit();
```

**Note:** This runs automatically on page load.

---

### `Components.destroy(container)`

Destroy a component instance.

**Parameters:**
- `container` (Element|string) - Component container

**Returns:** Promise<boolean> - true if destroyed

**Example:**
```javascript
await Components.destroy('#myComponent');
```

---

### `Components.destroyAll()`

Destroy all active component instances.

**Returns:** Promise<void>

**Example:**
```javascript
await Components.destroyAll();
```

---

### `Components.getInstance(container)`

Get component instance from container.

**Parameters:**
- `container` (Element|string) - Component container

**Returns:** Component|undefined

**Example:**
```javascript
const component = Components.getInstance('#myComponent');
if (component) {
  console.log(component.data);
}
```

---

### `Components.isRegistered(name)`

Check if a component is registered.

**Parameters:**
- `name` (string) - Component name

**Returns:** boolean

**Example:**
```javascript
if (Components.isRegistered('UserCard')) {
  // Component exists
}
```

---

### `Components.getRegistered()`

Get list of all registered component names.

**Returns:** string[] - Array of component names

**Example:**
```javascript
const components = Components.getRegistered();
console.log(components); // ['UserCard', 'TodoList', ...]
```

---

### `Components.unregister(name)`

Unregister a component.

**Parameters:**
- `name` (string) - Component name

**Returns:** boolean - true if unregistered

**Example:**
```javascript
Components.unregister('OldComponent');
```

---

### `Components.getStats()`

Get component system statistics.

**Returns:** Object with:
- `registered` (number) - Total registered components
- `active` (number) - Currently active instances
- `scopedStyles` (number) - Active style elements

**Example:**
```javascript
const stats = Components.getStats();
console.log(`${stats.active} components active`);
```

---

## Elements.update()

Enhanced update method supporting multiple syntaxes.

### Syntax 1: Dot Notation

```javascript
Elements.update({
  "elementId.property": value
});
```

**Example:**
```javascript
Elements.update({
  "userName.textContent": "John Doe",
  "userEmail.textContent": "john@example.com"
});
```

### Syntax 2: Nested Properties

```javascript
Elements.update({
  "elementId.nested.property": value
});
```

**Example:**
```javascript
Elements.update({
  "myBox.style.backgroundColor": "#3498db",
  "myBox.style.color": "white",
  "myBox.style.padding": "20px"
});
```

### Syntax 3: Object Style

```javascript
Elements.update({
  elementId: {
    property1: value1,
    property2: value2
  }
});
```

**Example:**
```javascript
Elements.update({
  userName: {
    textContent: "John Doe",
    className: "active-user",
    style: { color: "blue" }
  }
});
```

### Syntax 4: Mixed Approach

```javascript
Elements.update({
  "element1.property": value,
  element2: { property: value }
});
```

**Example:**
```javascript
Elements.update({
  "title.textContent": "Welcome",
  subtitle: {
    textContent: "Getting Started",
    style: { color: "#666" }
  }
});
```

---

## Component Definition

### Structure

```javascript
Components.register('ComponentName', `
  <!-- HTML Section -->
  <div class="component">
    <h3 id="title">Title</h3>
  </div>
  
  <!-- Style Section -->
  <style>
    .component { padding: 20px; }
  </style>
  
  <!-- Script Section -->
  <script>
    // Component logic
  </script>
`);
```

### HTML Section

Define the component structure using standard HTML.

**Rules:**
- Use regular HTML tags
- Add `id` attributes to elements you want to access
- Can include any valid HTML

**Example:**
```html
<div class="user-profile">
  <img id="avatar" src="">
  <h3 id="name"></h3>
  <p id="bio"></p>
  <button id="followBtn">Follow</button>
</div>
```

### Style Section

Define component-specific CSS.

**Features:**
- Automatically scoped to component
- Won't affect other components
- Supports all CSS features

**Example:**
```html
<style>
  .user-profile {
    padding: 20px;
    background: white;
    border-radius: 8px;
  }
  
  .user-profile img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  
  @media (max-width: 768px) {
    .user-profile {
      padding: 10px;
    }
  }
</style>
```

### Script Section

Define component behavior.

**Available Variables:**
- `data` - Component props/data
- `Elements` - Access to DOM elements
- `component` - Component instance
- `container` - Component container element
- `emit` - Emit custom events

**Available Functions:**
- `onBeforeMount()` - Before mount hook
- `onMounted()` - After mount hook
- `onBeforeUpdate()` - Before update hook
- `onUpdated()` - After update hook
- `onBeforeDestroy()` - Before destroy hook
- `onDestroyed()` - After destroy hook

**Example:**
```html
<script>
  // Access passed data
  console.log('Name:', data.name);
  
  // Update elements
  Elements.update({
    "name.textContent": data.name,
    "bio.textContent": data.bio
  });
  
  // Add event listeners
  Elements.followBtn.addEventListener('click', () => {
    emit('follow', { userId: data.id });
  });
  
  // Lifecycle hook
  onMounted(() => {
    console.log('Component ready!');
  });
</script>
```

---

## Lifecycle Hooks

### onBeforeMount(callback)

Called before component is added to DOM.

**Use for:**
- Initial data preparation
- Setup before render

**Example:**
```javascript
onBeforeMount(() => {
  console.log('Preparing to mount...');
});
```

---

### onMounted(callback)

Called after component is added to DOM.

**Use for:**
- DOM manipulation
- API calls
- Event listener setup
- Animations

**Example:**
```javascript
onMounted(async () => {
  // Fetch data
  const data = await fetch('/api/user').then(r => r.json());
  
  // Update UI
  Elements.update({
    "userName.textContent": data.name
  });
});
```

---

### onBeforeUpdate(callback)

Called before component data is updated.

**Use for:**
- Prepare for updates
- Save current state

**Example:**
```javascript
onBeforeUpdate(() => {
  console.log('About to update...');
});
```

---

### onUpdated(callback)

Called after component data is updated.

**Use for:**
- React to data changes
- Update derived state

**Example:**
```javascript
onUpdated(() => {
  console.log('Component updated');
});
```

---

### onBeforeDestroy(callback)

Called before component is removed.

**Use for:**
- Cleanup (IMPORTANT!)
- Clear timers/intervals
- Remove event listeners
- Cancel API requests

**Example:**
```javascript
let interval;

onMounted(() => {
  interval = setInterval(() => {
    console.log('Tick');
  }, 1000);
});

onBeforeDestroy(() => {
  clearInterval(interval);
  console.log('Cleaned up!');
});
```

---

### onDestroyed(callback)

Called after component is removed.

**Use for:**
- Final cleanup
- Logging

**Example:**
```javascript
onDestroyed(() => {
  console.log('Component destroyed');
});
```

---

## Custom Events

### emit(eventName, detail)

Emit a custom event from component.

**Parameters:**
- `eventName` (string) - Event name
- `detail` (any) - Event data (optional)

**Example:**
```javascript
Elements.submitBtn.addEventListener('click', () => {
  emit('formSubmitted', {
    name: Elements.nameInput.value,
    email: Elements.emailInput.value
  });
});
```

### Listening to Events

Events are prefixed with `component:` and dispatched on document.

**Example:**
```javascript
document.addEventListener('component:formSubmitted', (event) => {
  console.log('Form data:', event.detail.data);
  // event.detail.data contains the emitted data
  // event.detail.component contains the component instance
  // event.detail.componentName contains the component name
});
```

---

## Component Methods

### component.updateData(newData)

Update component data and trigger re-render.

**Parameters:**
- `newData` (object) - New data to merge

**Returns:** Promise<void>

**Example:**
```javascript
const component = Components.getInstance('#myComponent');
await component.updateData({
  name: 'New Name',
  email: 'new@example.com'
});
```

---

### component.emit(eventName, detail)

Emit custom event from component.

**Parameters:**
- `eventName` (string) - Event name
- `detail` (any) - Event data

**Example:**
```javascript
const component = Components.getInstance('#myComponent');
component.emit('statusChanged', { status: 'active' });
```

---

### component.on(lifecycle, callback)

Add lifecycle callback.

**Parameters:**
- `lifecycle` (string) - Lifecycle name
- `callback` (function) - Callback function

**Example:**
```javascript
const component = Components.getInstance('#myComponent');
component.on('mounted', () => {
  console.log('Component mounted!');
});
```

---

### component.destroy()

Destroy the component.

**Returns:** Promise<void>

**Example:**
```javascript
const component = Components.getInstance('#myComponent');
await component.destroy();
```

---

## Component Props

### Passing Props

Props can be passed as HTML attributes:

```html
<UserCard 
  name="John Doe"
  email="john@example.com"
  age="30"
  active="true"
  tags='["developer", "designer"]'>
</UserCard>
```

### Accessing Props

Props are available in the `data` object:

```javascript
console.log(data.name);    // "John Doe"
console.log(data.email);   // "john@example.com"
console.log(data.age);     // 30 (auto-converted to number)
console.log(data.active);  // true (auto-converted to boolean)
console.log(data.tags);    // ["developer", "designer"] (parsed JSON)
```

### Type Conversion

The library automatically converts:
- `"true"` / `"false"` → boolean
- `"123"` → number
- `'["a","b"]'` → array
- `'{"key":"value"}'` → object

---

## Best Practices

### ✅ DO:

```javascript
// Use PascalCase for component names
Components.register('UserCard', ...);

// Batch updates
Elements.update({
  "name.textContent": data.name,
  "email.textContent": data.email
});

// Clean up in onBeforeDestroy
onBeforeDestroy(() => {
  clearInterval(myInterval);
});

// Validate data
if (!data.name || typeof data.name !== 'string') {
  console.error('Invalid name');
  return;
}
```

### ❌ DON'T:

```javascript
// Don't use generic names
Components.register('component', ...);

// Don't make multiple separate updates
Elements.name.textContent = data.name;
Elements.email.textContent = data.email;

// Don't forget to clean up
// (missing onBeforeDestroy)

// Don't trust data without validation
Elements.name.textContent = data.name; // Could be undefined!
```

---

## Examples

### Complete Component Example

```javascript
Components.register('UserProfile', `
  <!-- HTML -->
  <div class="user-profile">
    <img id="avatar" class="avatar" alt="User Avatar">
    <div class="info">
      <h3 id="name"></h3>
      <p id="email"></p>
      <span id="status" class="status"></span>
    </div>
    <div class="actions">
      <button id="editBtn">Edit</button>
      <button id="deleteBtn">Delete</button>
    </div>
  </div>
  
  <!-- CSS -->
  <style>
    .user-profile {
      display: flex;
      gap: 15px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .info {
      flex: 1;
    }
    
    .info h3 {
      margin: 0 0 5px 0;
      color: #333;
    }
    
    .info p {
      margin: 0 0 5px 0;
      color: #666;
      font-size: 14px;
    }
    
    .status {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
      background: #e8f5e9;
      color: #4CAF50;
    }
    
    .actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .actions button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    #editBtn {
      background: #2196F3;
      color: white;
    }
    
    #deleteBtn {
      background: #f44336;
      color: white;
    }
  </style>
  
  <!-- JavaScript -->
  <script>
    // Validate data
    if (!data.name || !data.email) {
      console.error('UserProfile requires name and email');
      return;
    }
    
    // Initialize UI
    Elements.update({
      "avatar.src": data.avatar || "https://via.placeholder.com/64",
      "name.textContent": data.name,
      "email.textContent": data.email,
      "status.textContent": data.online ? "Online" : "Offline"
    });
    
    // Set status color
    if (data.online) {
      Elements.status.style.background = "#e8f5e9";
      Elements.status.style.color = "#4CAF50";
    } else {
      Elements.status.style.background = "#ffebee";
      Elements.status.style.color = "#f44336";
    }
    
    // Edit button
    Elements.editBtn.addEventListener('click', () => {
      emit('edit', { userId: data.id });
    });
    
    // Delete button
    Elements.deleteBtn.addEventListener('click', () => {
      if (confirm(\`Delete \${data.name}?\`)) {
        emit('delete', { userId: data.id });
      }
    });
    
    // Lifecycle
    onMounted(() => {
      console.log('UserProfile mounted for:', data.name);
    });
    
    onBeforeDestroy(() => {
      console.log('UserProfile destroyed for:', data.name);
    });
  </script>
`);
```

**Usage:**
```html
<UserProfile 
  id="123"
  name="John Doe"
  email="john@example.com"
  avatar="https://i.pravatar.cc/64"
  online="true">
</UserProfile>

<script>
document.addEventListener('component:edit', (e) => {
  console.log('Edit user:', e.detail.data.userId);
});

document.addEventListener('component:delete', (e) => {
  console.log('Delete user:', e.detail.data.userId);
});
</script>
```

---

## Troubleshooting Reference

| Issue | Solution |
|-------|----------|
| Component not rendering | Check component is registered before use |
| Elements undefined | Ensure elements have `id` attributes |
| Styles not applying | Put styles in `<style>` tags |
| Data not updating | Use `Elements.update()` to update DOM |
| Memory leak | Add cleanup in `onBeforeDestroy()` |
| Event not firing | Check event name includes `component:` prefix |

---

## Version Information

**Current Version:** 2.0.0

**Features:**
- ✅ React-style component tags
- ✅ Dot notation syntax
- ✅ Scoped CSS
- ✅ Lifecycle hooks
- ✅ Custom events
- ✅ Auto-initialization
- ✅ TypeScript-ready (types coming soon)

---

**For more examples and tutorials, see:**
- [Quick Start Guide](QUICK-START-GUIDE.md)
- [Component Library Guide](COMPONENT-LIBRARY-GUIDE.md)
