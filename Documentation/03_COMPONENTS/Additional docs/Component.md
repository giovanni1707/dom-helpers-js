[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Components Module - Complete Method Reference

## 🧩 Components Object (Main API)

### Component Registration
- `Components.register(name, definition)` - Register a component
  ```javascript
  Components.register('UserCard', componentDefinition);
  ```

- `Components.load(name, url)` - Load component from external file (async)
  ```javascript
  await Components.load('UserCard', '/components/user-card.html');
  ```

- `Components.unregister(name)` - Unregister a component
- `Components.isRegistered(name)` - Check if component is registered
- `Components.getRegistered()` - Get array of all registered component names

### Component Rendering
- `Components.render(name, container, data)` - Render a component (async)
  ```javascript
  await Components.render('UserCard', '#user-container', { name: 'John' });
  ```

- `Components.renderInline(definition, container, data)` - Render inline component (async)
  ```javascript
  await Components.renderInline(htmlString, '#container', { data });
  ```

### Component Management
- `Components.getInstance(container)` - Get component instance from container
- `Components.destroy(container)` - Destroy a component (async)
- `Components.destroyAll()` - Destroy all components (async)
- `Components.autoInit(root)` - Auto-initialize components in DOM (async)
  - Processes `[data-component]` attributes
  - Processes custom component tags (e.g., `<UserCard>`)

### Enhanced Update Methods
- `Components.update(updates)` - Enhanced update with multiple syntax support
  ```javascript
  // Dot notation
  Components.update({
    "userName.textContent": "John",
    "userEmail.textContent": "john@example.com"
  });
  
  // Declarative object style
  Components.update({
    userName: { textContent: "John" },
    userEmail: { textContent: "john@example.com" }
  });
  
  // Nested properties
  Components.update({
    "myElement.style.color": "red",
    "myElement.style.fontSize": "16px"
  });
  ```

- `Components.batchUpdate(updates)` - Batch update multiple elements
  ```javascript
  Components.batchUpdate({
    userName: { textContent: data.name },
    userEmail: { textContent: data.email },
    userStatus: { 
      textContent: data.status,
      classList: { toggle: 'active' }
    }
  });
  ```

### Scoping & Binding Helpers
- `Components.scope(...elementIds)` - Create scoped context for updates
  ```javascript
  const { userName, userEmail } = Components.scope('userName', 'userEmail');
  ```

- `Components.createBinding(elementIds, mapFunction)` - Create data binding helper
  ```javascript
  const binding = Components.createBinding(
    ['userName', 'userEmail'],
    (data) => ({
      userName: { textContent: data.name },
      userEmail: { textContent: data.email }
    })
  );
  binding.update({ name: 'John', email: 'john@example.com' });
  ```

### HTML Processing
- `Components.processHTML(htmlString, container)` - Process HTML and replace component tags (async)

### Utility Methods
- `Components.getStats()` - Get component statistics
  ```javascript
  // Returns: { registered, active, scopedStyles }
  ```

- `Components.configure(options)` - Configure component system

---

## 🎯 Component Instance (Individual Component)

### Properties
- `component.id` - Unique component ID
- `component.name` - Component name
- `component.definition` - Component definition
- `component.container` - Container element
- `component.root` - Root element (could be container or first child)
- `component.data` - Component data object
- `component.children` - Set of child components
- `component.isDestroyed` - Destruction flag
- `component.isMounted` - Mount flag
- `component.scopeId` - CSS scope ID
- `component.lifecycle` - Lifecycle callbacks object
- `component.template` - Parsed template
- `component.styles` - Parsed styles
- `component.script` - Parsed script

### Rendering Methods
- `component.render()` - Render the component (async)

### Update Methods

#### Granular Update (Recommended)
- `component.update(updates, options)` - Granular DOM updates without re-render
  ```javascript
  component.update({
    "userName.textContent": "New Name",
    "userEmail.textContent": "new@email.com",
    userAvatar: { src: "avatar.jpg", alt: "User" }
  });
  
  // Options
  component.update(updates, { immediate: true }); // Skip batching
  ```

#### Data Updates
- `component.updateData(newData)` - Update component data (async)
  ```javascript
  await component.updateData({ name: 'John', email: 'john@example.com' });
  ```

#### Smart Update
- `component.smartUpdate(newData, domUpdates)` - Update data + DOM (async)
  ```javascript
  await component.smartUpdate(
    { name: 'John', email: 'john@example.com' },
    { 
      "userName.textContent": "John",
      "userEmail.textContent": "john@example.com"
    }
  );
  ```

#### Full Re-render
- `component.refresh()` - Force full re-render (async)

### Event Methods
- `component.emit(eventName, detail)` - Emit custom event
  ```javascript
  component.emit('userUpdated', { userId: 123 });
  ```

### Lifecycle Methods
- `component.on(lifecycle, callback)` - Add lifecycle callback
  ```javascript
  component.on('mounted', () => console.log('Mounted!'));
  ```

### Lifecycle Hooks Available
- `beforeMount` - Before component mounts
- `mounted` - After component mounted
- `beforeUpdate` - Before data update
- `updated` - After data update
- `beforeDestroy` - Before component destroyed
- `destroyed` - After component destroyed

### Destruction
- `component.destroy()` - Destroy component and cleanup (async)

---

## 🔧 Internal/Private Component Methods

These are available but typically used internally:

### Parsing & Processing
- `component._parseDefinition()` - Parse component definition (internal)
- `component._extractTemplate(content)` - Extract template from HTML (internal)
- `component._extractStyles(content)` - Extract styles from HTML (internal)
- `component._extractScript(content)` - Extract script from HTML (internal)

### DOM Creation & Styling
- `component._createDOM()` - Create DOM structure (internal)
- `component._injectScopedStyles()` - Inject scoped CSS (internal)
- `component._scopeCSS(css)` - Scope CSS rules (internal)
- `component._applyScopeAttributes()` - Apply scope attributes (internal)

### Script & Components
- `component._executeScript()` - Execute component script (internal, async)
- `component._processNestedComponents()` - Process nested components (internal, async)
- `component._extractDataFromElement(element)` - Extract data from attributes (internal)

### Enhancement & Updates
- `component._enhanceWithDOMHelpers()` - Enhance with .update() method (internal)
- `component._deepMergeUpdates(queue, updates)` - Deep merge updates (internal)
- `component._flushUpdates()` - Flush queued updates (internal)
- `component._applyUpdatesWithCoreSystem(updates)` - Apply updates using core system (internal)
- `component._applyUpdatesFallback(updates)` - Fallback update implementation (internal)

### Lifecycle Management
- `component._callLifecycle(name)` - Call lifecycle callbacks (internal, async)

---

## 📝 Component Definition Formats

### HTML File Format
```html
<style>
  /* Scoped CSS */
  .user-card { padding: 20px; }
  h3 { color: blue; }
</style>

<div class="user-card">
  <h3 id="userName">User Name</h3>
  <p id="userEmail">user@example.com</p>
</div>

<script>
  // Component script
  console.log('Component mounted!', data);
  
  Elements.userName.textContent = data.name || 'Anonymous';
  Elements.userEmail.textContent = data.email || 'No email';
  
  // Lifecycle
  onMounted(() => {
    console.log('Lifecycle: mounted');
  });
</script>
```

### Object Format
```javascript
{
  template: '<div>...</div>',
  styles: '.class { color: red; }',
  script: 'console.log("Hello");'
}
```

---

## 🎨 Component Script Context

When component scripts execute, they have access to:

### Component Properties
- `component` - The component instance
- `container` - Container element
- `root` - Root element
- `data` - Component data object

### DOM Helpers Integration
- `Elements` - Elements helper
- `Collections` - Collections helper
- `Selector` - Selector helper

### Component Methods
- `getData()` - Get component data
- `setData(newData)` - Set component data
- `emit(eventName, detail)` - Emit custom event
- `destroy()` - Destroy component

### Lifecycle Registration
- `onBeforeMount(callback)` - Register beforeMount hook
- `onMounted(callback)` - Register mounted hook
- `onBeforeUpdate(callback)` - Register beforeUpdate hook
- `onUpdated(callback)` - Register updated hook
- `onBeforeDestroy(callback)` - Register beforeDestroy hook
- `onDestroyed(callback)` - Register destroyed hook

### Utilities
- `console` - Console object
- `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`
- `fetch` - Fetch API (if available)

### Optional Libraries (if loaded)
- `Async` - DOMHelpersAsync
- `Form` - DOMHelpersForm
- `Storage` - DOMHelpersStorage
- `Animation` - DOMHelpersAnimation

---

## 🔄 Update Syntax Variants

### 1. Declarative Object Style (Recommended)
```javascript
component.update({
  userName: { textContent: data.name },
  userEmail: { textContent: data.email },
  userAvatar: { 
    src: data.avatar,
    alt: data.name || "User Avatar"
  }
});
```

### 2. Dot Notation Style (Concise)
```javascript
component.update({
  "userName.textContent": data.name,
  "userEmail.textContent": data.email,
  "userAvatar.src": data.avatar,
  "userAvatar.alt": data.name || "User Avatar"
});
```

### 3. Nested Property Style
```javascript
component.update({
  "myElement.style.color": "red",
  "myElement.style.fontSize": "16px",
  "myElement.dataset.userId": "123"
});
```

### 4. Mixed Style
```javascript
component.update({
  "userName.textContent": data.name,
  userAvatar: { 
    src: data.avatar,
    alt: data.name
  },
  "status.style.color": data.isOnline ? "green" : "gray"
});
```

---

## ⚙️ Update Options

Used in `component.update(updates, options)`:

```javascript
{
  immediate: boolean  // Skip batching, update immediately (default: false)
}
```

### Update Batching
- By default, updates are batched using `requestAnimationFrame`
- Multiple `update()` calls are merged into a single DOM update
- Deep merge for `style` and `dataset` objects
- Set `immediate: true` to skip batching

---

## 🎭 Component Auto-Initialization

### Using data-component Attribute
```html
<div data-component="UserCard" data-name="John" data-email="john@example.com"></div>
```

### Using Custom Tags
```html
<!-- Kebab-case -->
<user-card name="John" email="john@example.com"></user-card>

<!-- PascalCase (converted to lowercase by browser) -->
<UserCard name="John" email="john@example.com"></UserCard>
```

Both will be automatically initialized when `Components.autoInit()` is called (automatically on DOM ready).

---

## 📊 Component Statistics

Returned by `Components.getStats()`:

```javascript
{
  registered: 5,      // Number of registered components
  active: 3,          // Number of active (non-destroyed) instances
  scopedStyles: 3     // Number of scoped style elements
}
```

---

## 🎯 Component Lifecycle Flow

```
1. Component Creation
   ↓
2. beforeMount
   ↓
3. Parse Definition (template, styles, script)
   ↓
4. Create DOM
   ↓
5. Inject Scoped Styles
   ↓
6. Execute Script
   ↓
7. Process Nested Components
   ↓
8. Enhance with DOM Helpers
   ↓
9. mounted
   ↓
10. Component is Active
    ↓
11. Data Updates (beforeUpdate → updated)
    ↓
12. beforeDestroy
    ↓
13. Cleanup (styles, children, DOM)
    ↓
14. destroyed
```

---

## 🔗 Integration with DOM Helpers

### Enhanced Elements.update()
```javascript
// The Components module enhances Elements.update() with dot notation
Elements.update({
  "userName.textContent": "John",
  "userEmail.textContent": "john@example.com"
});
```

### Access Components in Scripts
```javascript
// In component scripts
Elements.myElement.textContent = data.value;
Collections.ClassName.btn.forEach(btn => btn.disabled = true);
Selector.query('.my-class').style.color = 'red';
```

---

## 💡 Complete Usage Example

```javascript
// Register component
Components.register('UserCard', `
  <style>
    .user-card { 
      padding: 20px; 
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    .user-name { font-weight: bold; }
  </style>

  <div class="user-card">
    <h3 id="userName" class="user-name">Loading...</h3>
    <p id="userEmail">Loading...</p>
    <img id="userAvatar" src="" alt="">
    <button id="editBtn">Edit</button>
  </div>

  <script>
    // Initialize with data
    Elements.userName.textContent = data.name || 'Anonymous';
    Elements.userEmail.textContent = data.email || 'No email';
    Elements.userAvatar.src = data.avatar || '/default-avatar.png';

    // Event handlers
    Elements.editBtn.addEventListener('click', () => {
      emit('editUser', { userId: data.id });
    });

    // Lifecycle
    onMounted(() => {
      console.log('User card mounted!');
    });

    onBeforeDestroy(() => {
      console.log('Cleaning up user card');
    });
  </script>
`);

// Render component
const userCard = await Components.render('UserCard', '#container', {
  id: 123,
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/john-avatar.jpg'
});

// Update component data
await userCard.updateData({ name: 'Jane Doe' });

// Granular DOM update
userCard.update({
  "userName.textContent": "Jane Doe",
  "userEmail.textContent": "jane@example.com"
});

// Smart update (data + DOM)
await userCard.smartUpdate(
  { name: 'Bob', email: 'bob@example.com' },
  {
    "userName.textContent": "Bob",
    "userEmail.textContent": "bob@example.com"
  }
);

// Listen to component events
document.addEventListener('component:editUser', (e) => {
  console.log('Edit user:', e.detail.data.userId);
});

// Destroy component
await userCard.destroy();
```

---

## 🌐 Integration with Other Modules

The Components module integrates seamlessly with:

- **Elements, Collections, Selector** - Full DOM Helpers API access
- **Forms Module** - Access via `Form` in component scripts (if loaded)
- **Storage Module** - Access via `Storage` in component scripts (if loaded)
- **Reactive Module** - Reactive state works with component updates
- **Animation Module** - Access via `Animation` in component scripts (if loaded)

---

**Total Methods: 60+** (30+ public API methods, 30+ internal/component methods)

The Components module provides a complete traditional HTML5 component architecture with modern features! 🎉