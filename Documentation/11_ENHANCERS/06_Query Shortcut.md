# Global Query Module - Available Methods

Based on the provided code, here's a comprehensive list of all available methods in the **Global Query** module:

---

## 🎯 **Core Query Functions**

### 1. **`querySelector(selector, context)`**
**Alias:** `query(selector, context)`

Selects a single element matching the CSS selector, with `.update()` support.

```javascript
// Basic usage
const button = querySelector('#myButton');
const link = query('.nav-link'); // Using alias

// With custom context
const item = querySelector('.item', containerElement);

// Chaining with .update()
querySelector('#title').update({
  textContent: 'New Title',
  style: { color: 'blue' }
});
```

**Parameters:**
- `selector` (string): CSS selector
- `context` (Element, optional): DOM element to search within (defaults to `document`)

**Returns:** Enhanced element with `.update()` method or `null` if not found

---

### 2. **`querySelectorAll(selector, context)`**
**Alias:** `queryAll(selector, context)`

Selects all elements matching the CSS selector, returns enhanced collection with `.update()` support.

```javascript
// Basic usage
const buttons = querySelectorAll('.btn');
const items = queryAll('li'); // Using alias

// With custom context
const links = querySelectorAll('a', navElement);

// Chaining with .update()
querySelectorAll('.card').update({
  style: { padding: '20px' },
  classList: { add: 'shadow' }
});
```

**Parameters:**
- `selector` (string): CSS selector
- `context` (Element, optional): DOM element to search within (defaults to `document`)

**Returns:** Enhanced NodeList collection with `.update()` method and array-like methods

---

## 🔍 **Scoped Query Functions**

### 3. **`queryWithin(container, selector)`**

Searches for a single element within a specific container.

```javascript
// Using element reference
const container = document.getElementById('sidebar');
const link = queryWithin(container, '.menu-link');

// Using selector string for container
const button = queryWithin('#modal', '.submit-btn');

// Chaining
queryWithin('.header', '.logo').update({
  setAttribute: { alt: 'Company Logo' }
});
```

**Parameters:**
- `container` (Element|string): Container element or CSS selector
- `selector` (string): CSS selector to find within container

**Returns:** Enhanced element or `null` if not found

---

### 4. **`queryAllWithin(container, selector)`**

Searches for all elements within a specific container.

```javascript
// Using element reference
const sidebar = document.getElementById('sidebar');
const items = queryAllWithin(sidebar, '.menu-item');

// Using selector string for container
const cards = queryAllWithin('#content', '.card');

// Chaining with updates
queryAllWithin('.gallery', 'img').update({
  setAttribute: { loading: 'lazy' },
  style: { borderRadius: '8px' }
});
```

**Parameters:**
- `container` (Element|string): Container element or CSS selector
- `selector` (string): CSS selector to find within container

**Returns:** Enhanced NodeList collection

---

## 🛠️ **Utility Functions**

### 5. **`enhanceElement(element)`**

Manually enhance any element with the `.update()` method.

```javascript
// Get element without enhancement
const rawElement = document.getElementById('myDiv');

// Enhance it
const enhancedElement = GlobalQuery.enhanceElement(rawElement);

// Now it has .update()
enhancedElement.update({
  textContent: 'Enhanced!',
  style: { color: 'green' }
});
```

**Parameters:**
- `element` (Element): DOM element to enhance

**Returns:** Enhanced element with `.update()` method

---

### 6. **`enhanceNodeList(nodeList, selector)`**

Manually enhance a NodeList or array of elements.

```javascript
// Get raw NodeList
const rawList = document.getElementsByClassName('item');

// Enhance it
const enhancedList = GlobalQuery.enhanceNodeList(rawList, '.item');

// Now it has .update() and array methods
enhancedList.update({
  classList: { add: 'enhanced' }
});
```

**Parameters:**
- `nodeList` (NodeList|Array): Collection to enhance
- `selector` (string): Selector string for reference

**Returns:** Enhanced collection with `.update()` and array-like methods

---

## 📦 **Enhanced Collection Methods**

When you use `querySelectorAll()` or `queryAll()`, you get an enhanced collection with these additional methods:

### Array-Like Methods
```javascript
const items = queryAll('.item');

// Standard iteration
items.forEach((el, index) => console.log(el));
items.map(el => el.textContent);
items.filter(el => el.classList.contains('active'));
items.find(el => el.dataset.id === '123');
items.some(el => el.disabled);
items.every(el => el.hasAttribute('data-valid'));
items.reduce((acc, el) => acc + el.offsetHeight, 0);

// Array conversion
const array = items.toArray();

// Access specific items
items.first(); // First element
items.last();  // Last element
items.at(0);   // Element at index (supports negative indices)
items.isEmpty(); // Check if empty
```

### DOM Manipulation Helpers
```javascript
const buttons = queryAll('.btn');

// Class manipulation
buttons.addClass('btn-primary');
buttons.removeClass('old-class');
buttons.toggleClass('active');

// Property/attribute setting
buttons.setProperty('disabled', true);
buttons.setAttribute('data-role', 'button');

// Style setting
buttons.setStyle({
  padding: '10px',
  backgroundColor: '#007bff'
});

// Event handling
buttons.on('click', handleClick);
buttons.off('click', handleClick);
```

---

## 📋 **Complete Usage Examples**

### Example 1: Simple Query and Update
```javascript
// Query single element
query('#header').update({
  textContent: 'Welcome!',
  style: { fontSize: '32px', color: '#333' }
});

// Query multiple elements
queryAll('.card').update({
  classList: { add: ['shadow', 'rounded'] },
  style: { padding: '20px' }
});
```

### Example 2: Scoped Queries
```javascript
// Find elements within a specific container
const sidebar = document.getElementById('sidebar');

// Single element within container
queryWithin(sidebar, '.menu-title').update({
  textContent: 'Navigation'
});

// Multiple elements within container
queryAllWithin('#modal', 'input').update({
  setAttribute: { placeholder: 'Enter value...' },
  classList: { add: 'form-control' }
});
```

### Example 3: Chaining with Enhanced Collections
```javascript
// Get collection and manipulate
queryAll('.product')
  .filter(el => parseFloat(el.dataset.price) > 50)
  .forEach(el => {
    el.update({
      classList: { add: 'premium' },
      style: { borderColor: 'gold' }
    });
  });
```

### Example 4: Working with Enhanced Elements
```javascript
// Every element returned has .update()
const button = query('#submitBtn');

button.update({
  textContent: 'Submit Form',
  addEventListener: ['click', (e) => {
    // e.target also has .update()!
    e.target.update({
      textContent: 'Submitting...',
      disabled: true
    });
  }]
});
```

---

## 🔑 **Key Features**

1. **Auto-Enhancement**: All returned elements/collections automatically have `.update()` method
2. **Global Access**: Functions available globally (`querySelector`, `query`, etc.)
3. **Context Support**: Query within specific containers
4. **Array Methods**: Enhanced collections work like arrays
5. **Chainable**: Most methods return the element/collection for chaining
6. **Safe**: Handles invalid selectors gracefully with warnings

---

## ⚙️ **Accessing the Module**

```javascript
// Global functions (recommended)
querySelector('#myId');
query('.myClass');
queryAll('div');

// Via GlobalQuery object
GlobalQuery.querySelector('#myId');
GlobalQuery.query('.myClass');

// Via DOMHelpers (if main bundle loaded)
DOMHelpers.querySelector('#myId');
DOMHelpers.query('.myClass');
```

---

This module essentially provides **jQuery-like** query functionality with the power of the `.update()` method from your core DOM Helpers library! 🚀