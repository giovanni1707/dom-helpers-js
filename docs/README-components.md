# DOM Helpers Components

A lightweight component system that extends DOM Helpers with traditional HTML5 and vanilla JavaScript. Build component-based applications following the DOM Helpers philosophy without framework dependencies.

## Overview

DOM Helpers Components brings component-based development to vanilla JavaScript using:

- **Custom HTML Tags** - Use components like native HTML: `<user-card name="Alice" />`
- **Props Support** - Pass data through attributes with intelligent type conversion
- **Traditional HTML5 structure** with standard IDs and classes
- **Full DOM Helpers integration** with Elements, Collections, and Selector
- **Scoped CSS** with automatic style isolation
- **Component lifecycle management** with hooks
- **Event delegation** and custom events
- **Seamless integration** with all DOM Helpers libraries (async, form, storage, animation)
- **Vanilla JavaScript** following DOM Helpers philosophy

## ⭐ Quick Start - Custom Tags

The easiest way to use components is with custom HTML tags:

```html
<!-- Use components like native HTML elements -->
<user-card 
  name="Alice Johnson"
  email="alice@example.com"
  avatar="https://example.com/avatar.jpg"
  is-online="true">
</user-card>

<todo-list 
  title="My Daily Tasks"
  todos='[{"id":1,"text":"Learn Components","completed":false}]'>
</todo-list>
```

**Automatic Props Conversion:**
- `name="Alice Johnson"` → `data.name = "Alice Johnson"`
- `is-online="true"` → `data.isOnline = true`
- `todos='[...]'` → `data.todos = [parsed array]`

## Installation & Setup

1. Include DOM Helpers library:
```html
<script src="dom-helpers.js"></script>
```

2. Include DOM Helpers Components:
```html
<script src="dom-helpers-components.js"></script>
```

The component system will be available globally as `Components` and integrates automatically with DOM Helpers.

## Basic Usage

### 1. Create a Component File

**UserCard.html**
```html
<div class="user-card">
  <img id="userAvatar" class="avatar" src="https://via.placeholder.com/64" alt="User Avatar" />
  <div class="user-info">
    <h3 id="userName" class="name">John Doe</h3>
    <p id="userEmail" class="email">john@example.com</p>
    <span id="userStatus" class="status" style="display: none;">Online</span>
    <button id="contactBtn" class="contact-btn">Contact</button>
  </div>
</div>

<style>
  .user-card {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    background: white;
    margin: 8px 0;
  }
  
  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin-right: 16px;
  }
  
  .contact-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
  }
</style>

<script>
  // Initialize component with data
  const userData = data.user || {};
  
  // Update user information using DOM Helpers Elements
  if (userData.name) {
    Elements.userName.update({
      textContent: userData.name
    });
  }
  
  if (userData.email) {
    Elements.userEmail.update({
      textContent: userData.email
    });
  }
  
  if (userData.avatar) {
    Elements.userAvatar.update({
      src: userData.avatar,
      alt: userData.name || 'User Avatar'
    });
  }
  
  // Show online status if user is online
  if (userData.isOnline) {
    Elements.userStatus.update({
      style: { display: 'inline-block' }
    });
  }
  
  // Handle contact button click
  Elements.contactBtn.addEventListener('click', function() {
    // Emit custom event
    emit('userContact', userData);
    
    // Update button using DOM Helpers .update() method
    Elements.contactBtn.update({
      textContent: 'Contacted!',
      disabled: true,
      style: { 
        background: '#10b981'
      }
    });
    
    // Reset after 2 seconds
    setTimeout(() => {
      Elements.contactBtn.update({
        textContent: 'Contact',
        disabled: false,
        style: { 
          background: '#3b82f6'
        }
      });
    }, 2000);
  });
  
  // Lifecycle callbacks
  onMounted(() => {
    console.log('[UserCard] Component mounted for user:', userData.name);
  });
</script>
```

### 2. Register Components for Custom Tags

```javascript
// Method 1: Register inline component
Components.register('UserCard', {
  template: `
    <div class="user-card">
      <img id="userAvatar" class="avatar" src="https://via.placeholder.com/64" />
      <h3 id="userName" class="name">John Doe</h3>
      <p id="userEmail" class="email">john@example.com</p>
      <button id="contactBtn" class="contact-btn">Contact</button>
    </div>
  `,
  styles: `
    .user-card { padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
    .avatar { width: 64px; height: 64px; border-radius: 50%; }
    .contact-btn { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; }
  `,
  script: `
    // Access props directly from data
    if (data.name) Elements.userName.textContent = data.name;
    if (data.email) Elements.userEmail.textContent = data.email;
    if (data.avatar) Elements.userAvatar.src = data.avatar;
    
    // Handle events
    Elements.contactBtn.addEventListener('click', () => {
      emit('userContact', data);
    });
  `
});

// Method 2: Load from external file (requires server)
await Components.load('UserCard', './UserCard.html');
```

### 3. Use Custom Tags in HTML

```html
<!DOCTYPE html>
<html>
<head>
    <script src="dom-helpers.js"></script>
    <script src="dom-helpers-components.js"></script>
</head>
<body>
    <!-- Components are automatically processed -->
    <user-card 
      name="Alice Johnson"
      email="alice@example.com" 
      avatar="https://example.com/avatar.jpg"
      is-online="true">
    </user-card>
    
    <!-- Multiple instances with different props -->
    <user-card name="Bob Smith" email="bob@example.com"></user-card>
    <user-card name="Carol Davis" email="carol@example.com" is-online="true"></user-card>
    
    <!-- Complex props with JSON -->
    <todo-list 
      title="My Tasks"
      todos='[{"id":1,"text":"Learn Components","completed":false}]'>
    </todo-list>
</body>
</html>
```

### 4. Dynamic Custom Tag Creation

```javascript
// Create custom tags dynamically
const userCard = document.createElement('user-card');
userCard.setAttribute('name', 'Dynamic User');
userCard.setAttribute('email', 'dynamic@example.com');
userCard.setAttribute('is-online', 'true');

// Add to DOM
document.body.appendChild(userCard);

// Process new custom tags
await Components._processCustomTags(document.body);
```

### 5. Traditional Usage Methods

```javascript
// Register inline component
Components.register('SimpleButton', {
  template: `
    <button id="myBtn" class="btn">Click me</button>
  `,
  styles: `
    .btn { 
      padding: 8px 16px; 
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
    }
  `,
  script: `
    Elements.myBtn.addEventListener('click', () => {
      emit('buttonClick', { timestamp: Date.now() });
    });
  `
});

// Render inline component
await Components.renderInline(`
  <div class="counter">
    <button id="decrementBtn">-</button>
    <span id="countDisplay">0</span>
    <button id="incrementBtn">+</button>
  </div>
  
  <style>
    .counter { display: flex; align-items: center; gap: 8px; }
  </style>
  
  <script>
    let count = data.initialCount || 0;
    
    function updateDisplay() {
      Elements.countDisplay.update({ textContent: count });
    }
    
    Elements.incrementBtn.addEventListener('click', () => {
      count++;
      updateDisplay();
      emit('countChanged', { count });
    });
    
    Elements.decrementBtn.addEventListener('click', () => {
      count--;
      updateDisplay();
      emit('countChanged', { count });
    });
    
    updateDisplay();
  </script>
`, container, { initialCount: 5 });
```

## Component Features

### DOM Helpers Integration

Components have full access to all DOM Helpers functionality:

```javascript
// In component script context
// Elements - Access by ID
Elements.myButton.update({
  textContent: 'Updated!',
  style: { background: 'red' }
});

// Collections - Access by class/tag/name
Collections.ClassName.todoItem.update({
  style: { opacity: '0.5' }
});

// Selector - querySelector with caching
const items = Selector.queryAll('.item');
items.update({ 
  classList: { add: 'processed' }
});
```

### Component Context

Inside component scripts, you have access to:

```javascript
// Component data passed during render
console.log(data.user.name);

// Component instance
console.log(component.id, component.name);

// Container elements
console.log(container, root);

// DOM Helpers libraries
Elements.myElement.update({ textContent: 'Hello' });
Collections.ClassName.items.forEach(item => item.click());
Selector.query('#myId').style.color = 'red';

// Event emission
emit('customEvent', { data: 'value' });

// Component data management
setData({ newProperty: 'value' });
const currentData = getData();

// Lifecycle registration
onMounted(() => console.log('Component mounted'));
onBeforeDestroy(() => console.log('Component destroying'));

// Integration with other DOM Helpers libraries
if (typeof Async !== 'undefined') {
  Async.delay(1000).then(() => console.log('Delayed'));
}

if (typeof Storage !== 'undefined') {
  Storage.setItem('key', 'value');
}

if (typeof Form !== 'undefined') {
  Form.validateForm(Elements.myForm);
}

if (typeof Animation !== 'undefined') {
  Animation.fadeIn(Elements.myElement);
}
```

### Lifecycle Hooks

```javascript
// In component script
onBeforeMount(() => {
  console.log('Component about to mount');
});

onMounted(() => {
  console.log('Component mounted and ready');
  // Perfect for initialization, focus, animations
});

onBeforeUpdate(() => {
  console.log('Component about to update');
});

onUpdated(() => {
  console.log('Component updated');
});

onBeforeDestroy(() => {
  console.log('Component about to be destroyed');
  // Cleanup resources, remove event listeners
});

onDestroyed(() => {
  console.log('Component destroyed');
});
```

### Scoped Styles

CSS is automatically scoped to prevent conflicts:

```html
<style>
  /* These styles only apply within this component */
  .title {
    color: blue;
    font-size: 24px;
  }
  
  .card {
    border: 1px solid #ddd;
    padding: 16px;
  }
  
  /* Media queries and keyframes work too */
  @media (max-width: 768px) {
    .card { padding: 8px; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
```

### Event System

**Emit events from components:**
```javascript
// In component script
Elements.myButton.addEventListener('click', () => {
  emit('userAction', { action: 'click', timestamp: Date.now() });
});
```

**Listen for events:**
```javascript
// Listen for component events
document.addEventListener('component:userAction', (e) => {
  console.log('User action:', e.detail.data.action);
  console.log('From component:', e.detail.componentName);
});

// Or listen on specific container
container.addEventListener('component:userAction', (e) => {
  console.log('Action from this component:', e.detail.data);
});
```

### Data Management

```javascript
// In component script
const currentData = getData();
console.log(currentData.user.name);

// Update component data
setData({
  user: { ...currentData.user, isOnline: true }
});

// Or use the component instance
component.updateData({ 
  theme: 'dark',
  settings: { animation: true }
});
```

## Advanced Usage

### Nested Components

Components can contain other components using `data-component` attributes:

**Parent.html**
```html
<div class="dashboard">
  <h1 id="dashboardTitle">User Dashboard</h1>
  
  <!-- Nested components -->
  <div data-component="UserCard" data-user-id="123"></div>
  <div data-component="ActivityFeed" data-limit="10"></div>
  <div data-component="NotificationCenter"></div>
</div>

<script>
  Elements.dashboardTitle.update({
    textContent: `Welcome, ${data.userName || 'User'}`
  });
  
  // Listen for events from child components
  container.addEventListener('component:userContact', (e) => {
    console.log('Child component user contact:', e.detail.data);
  });
</script>
```

### Dynamic Component Management

```javascript
// Get component instance
const component = Components.getInstance(container);

// Update component data
await component.updateData({
  user: updatedUserData,
  theme: 'dark'
});

// Check component state
console.log('Is mounted:', component.isMounted);
console.log('Component data:', component.data);

// Add lifecycle callback
component.on('mounted', () => {
  console.log('Component mounted');
});

// Destroy component
await component.destroy();
```

### Collections Integration

Use Collections for bulk operations on component elements:

```javascript
// In component script
// Update all todo items
Collections.ClassName.todoItem.update({
  style: { opacity: '0.5' },
  classList: { add: 'processing' }
});

// Add event listeners to all buttons
Collections.ClassName.actionBtn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    emit('actionTriggered', { 
      action: e.target.dataset.action 
    });
  });
});

// Animate all cards
Collections.ClassName.card.update({
  style: { 
    transform: 'scale(1.05)',
    transition: 'transform 0.2s ease'
  }
});
```

### Integration with DOM Helpers Libraries

**With Async Library:**
```javascript
// In component script
onMounted(async () => {
  // Show loading state
  Elements.loadingSpinner.style.display = 'block';
  
  try {
    // Use Async library for API calls
    const userData = await Async.fetchJSON(`/api/users/${data.userId}`);
    
    // Update UI
    Elements.userName.textContent = userData.name;
    Elements.userEmail.textContent = userData.email;
    
  } catch (error) {
    Elements.errorMessage.textContent = 'Failed to load user data';
  } finally {
    Elements.loadingSpinner.style.display = 'none';
  }
});
```

**With Form Library:**
```javascript
// In component script
onMounted(() => {
  // Validate form using Form library
  const form = Elements.userForm;
  
  Form.addValidation(form, {
    email: { required: true, pattern: 'email' },
    name: { required: true, minLength: 2 }
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (Form.validateForm(form)) {
      const formData = Form.getFormData(form);
      emit('formSubmit', formData);
    }
  });
});
```

**With Storage Library:**
```javascript
// In component script
onMounted(() => {
  // Load saved preferences
  const preferences = Storage.getItem('userPreferences') || {};
  
  if (preferences.theme) {
    Elements.themeSelector.value = preferences.theme;
  }
});

onBeforeDestroy(() => {
  // Save current state
  const currentPreferences = {
    theme: Elements.themeSelector.value,
    notifications: Elements.notificationToggle.checked
  };
  
  Storage.setItem('userPreferences', currentPreferences);
});
```

**With Animation Library:**
```javascript
// In component script
onMounted(() => {
  // Animate component entrance
  Animation.slideIn(root, { duration: 300 });
  
  // Animate child elements with stagger
  Collections.ClassName.listItem.forEach((item, index) => {
    Animation.fadeIn(item, { 
      delay: index * 100,
      duration: 200 
    });
  });
});

Elements.deleteBtn.addEventListener('click', () => {
  // Animate before removal
  Animation.slideOut(root, { duration: 200 }).then(() => {
    component.destroy();
  });
});
```

## API Reference

### Components Methods

#### `Components.register(name, definition)`
Register a component with a name and definition.

```javascript
Components.register('MyComponent', {
  template: '<div id="content">Content</div>',
  styles: '#content { padding: 10px; }',
  script: 'console.log("Component loaded");'
});
```

#### `Components.load(name, url)`
Load component from external file.

```javascript
await Components.load('UserCard', './components/UserCard.html');
```

#### `Components.render(name, container, data)`
Render component in container with data.

```javascript
const component = await Components.render('UserCard', Elements.container, {
  user: { name: 'Alice', email: 'alice@example.com' }
});
```

#### `Components.renderInline(definition, container, data)`
Render component from inline definition.

```javascript
await Components.renderInline(`
  <div>Hello {{name}}</div>
  <script>console.log('Inline component');</script>
`, container, { name: 'World' });
```

#### `Components.getInstance(container)`
Get component instance from container.

```javascript
const component = Components.getInstance(Elements.myContainer);
```

#### `Components.destroy(container)`
Destroy component in container.

```javascript
await Components.destroy(Elements.myContainer);
```

#### `Components.autoInit(root)`
Auto-initialize components with `data-component` attributes.

```javascript
await Components.autoInit(); // Initialize in whole document
await Components.autoInit(Elements.specificSection); // Initialize in section
```

#### `Components.getStats()`
Get component system statistics.

```javascript
const stats = Components.getStats();
console.log('Registered:', stats.registered);
console.log('Active:', stats.active);
console.log('Scoped styles:', stats.scopedStyles);
```

### Component Instance Methods

#### `component.updateData(newData)`
Update component data and re-render if needed.

```javascript
await component.updateData({
  user: updatedUser,
  theme: 'dark'
});
```

#### `component.emit(eventName, detail)`
Emit custom event from component.

```javascript
component.emit('dataChanged', { newData: data });
```

#### `component.on(lifecycle, callback)`
Add lifecycle callback.

```javascript
component.on('mounted', () => {
  console.log('Component mounted');
});
```

#### `component.destroy()`
Destroy component and cleanup.

```javascript
await component.destroy();
```

### HTML Attributes

#### `data-component`
Specify component to render in element.

```html
<div data-component="UserCard" data-user-name="Alice" data-user-email="alice@test.com"></div>
```

Data attributes (`data-*`) are automatically passed as component data, converted to camelCase.

## Best Practices

### 1. Component Structure
- Use meaningful IDs and classes following HTML5 standards
- Keep components focused on single responsibilities
- Organize related components in folders

### 2. DOM Helpers Integration
- Use `Elements` for single element access by ID
- Use `Collections` for bulk operations on multiple elements
- Use `Selector` for complex queries with caching
- Leverage the `.update()` method for DOM manipulation

### 3. Data Flow
- Pass data through the render method
- Use `emit()` for parent-child communication
- Store component-specific state in `data`
- Use DOM Helpers Storage for persistence

### 4. Performance
- Leverage DOM Helpers caching for frequently accessed elements
- Use lifecycle hooks for setup and cleanup
- Batch DOM updates using Collections
- Avoid unnecessary re-renders

### 5. Styling
- Use scoped styles to avoid conflicts
- Follow consistent CSS naming conventions
- Use CSS custom properties for theming

## Examples

### Complete Todo Application

**TodoApp.html**
```html
<div class="todo-app">
  <h1 id="todoTitle" class="title">Todo App</h1>
  
  <div class="add-todo">
    <input id="newTodoInput" type="text" placeholder="Add a task..." />
    <button id="addBtn">Add</button>
  </div>
  
  <div id="todoList" class="todo-list">
    <!-- Dynamic content -->
  </div>
  
  <div id="todoStats" class="stats">
    <span id="totalCount">Total: 0</span>
    <span id="completedCount">Completed: 0</span>
  </div>
</div>

<style>
  .todo-app {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .add-todo {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }
  
  .add-todo input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .todo-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-bottom: 1px solid #eee;
  }
  
  .todo-item.completed .todo-text {
    text-decoration: line-through;
    opacity: 0.6;
  }
</style>

<script>
  // Initialize data
  const todos = data.todos || [];
  
  // Set title
  Elements.todoTitle.update({
    textContent: data.title || 'Todo App'
  });
  
  function renderTodos() {
    Elements.todoList.innerHTML = '';
    
    todos.forEach(todo => {
      const item = document.createElement('div');
      item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      item.dataset.todoId = todo.id;
      
      item.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${todo.text}</span>
        <button class="delete-btn">×</button>
      `;
      
      Elements.todoList.appendChild(item);
    });
    
    updateStats();
  }
  
  function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    
    Elements.totalCount.update({ textContent: `Total: ${total}` });
    Elements.completedCount.update({ textContent: `Completed: ${completed}` });
  }
  
  function addTodo() {
    const text = Elements.newTodoInput.value.trim();
    if (!text) return;
    
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false
    };
    
    todos.push(newTodo);
    Elements.newTodoInput.value = '';
    renderTodos();
    
    emit('todoAdded', newTodo);
  }
  
  // Event handlers
  Elements.addBtn.addEventListener('click', addTodo);
  Elements.newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });
  
  // Event delegation for todo items
  Elements.todoList.addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;
    
    const todoId = parseInt(todoItem.dataset.todoId);
    const todo = todos.find(t => t.id === todoId);
    
    if (e.target.classList.contains('todo-checkbox')) {
      todo.completed = !todo.completed;
      todoItem.classList.toggle('completed');
      updateStats();
      emit('todoToggled', todo);
      
    } else if (e.target.classList.contains('delete-btn')) {
      const index = todos.findIndex(t => t.id === todoId);
      todos.splice(index, 1);
      renderTodos();
      emit('todoDeleted', todoId);
    }
  });
  
  // Initialize
  onMounted(() => {
    renderTodos();
    Elements.newTodoInput.focus();
  });
</script>
```

**Usage:**
```javascript
// Load and render the todo app
await Components.load('TodoApp', './TodoApp.html');
await Components.render('TodoApp', Elements.appContainer, {
  title: 'My Tasks',
  todos: [
    { id: 1, text: 'Learn DOM Helpers Components', completed: false },
    { id: 2, text: 'Build an awesome app', completed: false }
  ]
});

// Listen for events
document.addEventListener('component:todoAdded', (e) => {
  console.log('New todo:', e.detail.data.text);
});
```

## Browser Support

- **Modern browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **ES6+ features**: Classes, Async/Await, Template literals, Destructuring
- **DOM APIs**: CustomEvents, WeakMap/WeakSet, Proxy
- **CSS**: Modern CSS selectors, CSS Custom Properties

## Troubleshooting

### Common Issues

1. **Component not loading**
   - Check file path and server setup
   - Verify DOM Helpers is loaded first
   - Check browser console for errors

2. **Elements not found**
   - Ensure IDs exist in component HTML
   - Check that DOM Helpers Elements is working
   - Verify component is mounted before accessing elements

3. **Styles not scoped**
   - Make sure styles are in `<style>` tags
   - Check for CSS syntax errors
   - Inspect elements to see scoped attributes

4. **Events not working**
   - Use `emit()` function in component scripts
   - Listen for `component:eventName` pattern
   - Check event listeners are attached correctly

### Debugging Tips

```javascript
// Check component registration
console.log('Registered:', Components.getRegistered());

// Get component instance
const comp = Components.getInstance(container);
console.log('Component data:', comp.data);

// Monitor all component events
document.addEventListener('component:*', (e) => {
  console.log('Event:', e.type, e.detail);
});

// Check DOM Helpers integration
console.log('Elements cache:', Elements.helper.getStats());
console.log('Collections cache:', Collections.helper.getStats());
```

## License

MIT License - See DOM Helpers main license for details.
