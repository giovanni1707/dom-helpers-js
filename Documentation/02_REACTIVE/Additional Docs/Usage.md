[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


## Complete Usage Examples

Here are comprehensive examples showing how to use the production-grade reactive module:

### Basic Usage

```javascript
// Create reactive state
const state = ReactiveState.create({
  count: 0,
  name: 'John'
});

// Bind to DOM elements
Elements.bind({
  'counter': () => state.count,
  'username': () => state.name
});

// Update state (automatically updates DOM)
state.count++;
state.name = 'Jane';
```

### Computed Properties

```javascript
const state = ReactiveState.create({
  firstName: 'John',
  lastName: 'Doe'
});

// Add computed property
state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

Elements.bind({
  'full-name': () => state.fullName
});

state.firstName = 'Jane'; // fullName updates automatically
```

### Batching for Performance

```javascript
const state = ReactiveState.create({
  items: [1, 2, 3]
});

// Batch multiple updates
state.$batch(() => {
  state.items.push(4);
  state.items.push(5);
  state.items.push(6);
  // DOM updates only once after all changes
});

// Or use global batch
ReactiveState.batch(() => {
  state.items.push(7);
  state.items.push(8);
});
```

### Watch for Changes

```javascript
const state = ReactiveState.create({
  temperature: 20
});

// Watch specific property
const unwatch = state.$watch('temperature', (newVal, oldVal) => {
  console.log(`Temperature changed from ${oldVal} to ${newVal}`);
});

// Watch computed value
const unwatch2 = state.$watch(
  function() { return this.temperature > 30; },
  (isHot) => {
    console.log(isHot ? 'Too hot!' : 'Temperature OK');
  }
);

// Stop watching
unwatch();
```

### Collection Helper

```javascript
const todos = ReactiveState.collection([
  { id: 1, text: 'Learn reactive', done: false },
  { id: 2, text: 'Build app', done: false }
]);

// Add item
todos.$add({ id: 3, text: 'Deploy', done: false });

// Remove item
todos.$remove(item => item.id === 2);

// Update item
todos.$update(
  item => item.id === 1,
  { done: true }
);

// Clear all
todos.$clear();

// Bind to DOM
Elements.bind({
  'todo-list': () => todos.items.map(t => 
    `<li>${t.text} - ${t.done ? 'Done' : 'Pending'}</li>`
  ).join('')
});
```

### Form Helper

```javascript
const form = ReactiveState.form({
  email: '',
  password: ''
});

// Bind form inputs
Selector.query.bind({
  '#email': {
    value: () => form.values.email,
    oninput: (e) => form.$setValue('email', e.target.value)
  },
  '#password': {
    value: () => form.values.password,
    oninput: (e) => form.$setValue('password', e.target.value)
  }
});

// Validate
form.$watch('values', (values) => {
  if (!values.email.includes('@')) {
    form.$setError('email', 'Invalid email');
  } else {
    form.$setError('email', null);
  }
});

// Bind error display
Elements.bind({
  'email-error': () => form.errors.email || '',
  'submit-btn': {
    disabled: () => !form.isValid || form.isSubmitting
  }
});
```

### Async State Helper

```javascript
const userData = ReactiveState.async(null);

// Bind loading states
Elements.bind({
  'loading': () => userData.loading ? 'Loading...' : '',
  'error': () => userData.error ? userData.error.message : '',
  'user-data': () => userData.data ? userData.data.name : ''
});

// Fetch data
async function loadUser(id) {
  await userData.$execute(async () => {
    const response = await fetch(`/api/users/${id}`);
    return await response.json();
  });
}
```

### Complex Binding

```javascript
const state = ReactiveState.create({
  user: {
    name: 'John',
    age: 30,
    active: true
  },
  theme: 'dark'
});

// Bind multiple properties
Elements.bind({
  'user-card': {
    textContent: () => state.user.name,
    style: () => ({
      backgroundColor: state.theme === 'dark' ? '#333' : '#fff',
      color: state.theme === 'dark' ? '#fff' : '#000',
      opacity: state.user.active ? 1 : 0.5
    }),
    dataset: () => ({
      userId: state.user.age,
      theme: state.theme
    }),
    classList: () => ({
      'active': state.user.active,
      'inactive': !state.user.active,
      [`theme-${state.theme}`]: true
    })
  }
});
```

### Debug Utilities

```javascript
const state = ReactiveState.create({ count: 0 });

// Enable debug mode
ReactiveState.configure({ enableDebugMode: true });

// Debug state
state.$debug('My Counter');

// Get dependencies
console.log(ReactiveState.debug.getStateDependencies(state));

// Get reactive stats
console.log(ReactiveState.debug.getReactiveStats());

// Get element bindings
const el = document.getElementById('counter');
console.log(ReactiveState.debug.getElementBindingInfo(el));
```

### Pause/Resume Tracking

```javascript
const state = ReactiveState.create({ count: 0 });

// Pause reactivity
ReactiveState.pauseTracking();

// These won't trigger updates
state.count = 10;
state.count = 20;
state.count = 30;

// Resume and flush all pending updates
ReactiveState.resumeTracking(true); // DOM updates to 30
```

### Untracked Reads

```javascript
const state = ReactiveState.create({
  count: 0,
  lastCount: 0
});

state.$computed('doubled', function() {
  // Read count reactively
  const current = this.count;
  
  // Read lastCount without tracking
  const last = ReactiveState.untrack(() => this.lastCount);
  
  return current * 2;
});
```

### Custom Error Handler

```javascript
ReactiveState.configure({
  errorHandler: (error, context, data) => {
    // Send to error tracking service
    console.error('Reactive error:', {
      error: error.message,
      context,
      element: data?.element,
      property: data?.property
    });
    
    // Show user-friendly message
    alert('Something went wrong. Please refresh the page.');
  }
});
```

This production-grade version includes:

✅ **Fixed batching** - Properly integrated and functional  
✅ **Fixed computed properties** - With caching and proper dependency tracking  
✅ **Memory leak fixes** - Proper cleanup of dependencies  
✅ **Circular dependency detection** - Prevents infinite loops  
✅ **Enhanced error handling** - Custom error handlers  
✅ **Debug utilities** - Comprehensive debugging tools  
✅ **Helper methods** - Collection, Form, and Async state helpers  
✅ **Performance monitoring** - Detects slow updates  
✅ **Pause/Resume** - Control reactivity flow  
✅ **Untracked reads** - Read without creating dependencies  
✅ **Better type handling** - Improved value application logic  
✅ **Watch API** - Manual subscription to changes  

The code is now production-ready! 🚀