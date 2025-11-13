# DOM Helpers Library - Complete Method Reference

A comprehensive guide to all methods available in this high-performance vanilla JavaScript DOM manipulation library.

---

## Table of Contents

1. [Elements Helper](#elements-helper)
2. [Collections Helper](#collections-helper)
3. [Selector Helper](#selector-helper)
4. [Universal Update Method](#universal-update-method)
5. [Enhanced createElement](#enhanced-createelement)
6. [DOMHelpers Combined API](#domhelpers-combined-api)

---

## Elements Helper

The Elements helper provides **ID-based DOM access** with intelligent caching and auto-enhancement.

### Basic Access

#### `Elements[elementId]`
**Direct property access to elements by ID**

```javascript
// Get element by ID (replaces document.getElementById)
const myButton = Elements.myButton;
const header = Elements.header;

// Works with any valid element ID
const elem = Elements['my-element-id'];
```

- **Returns**: DOM element or `null` if not found
- **Caching**: Automatically cached for performance
- **Auto-enhanced**: Element has `.update()` method attached

---

### Utility Methods

#### `Elements.get(id, fallback)`
**Safe element access with fallback**

```javascript
// Get element with fallback
const btn = Elements.get('submitBtn', null);
const container = Elements.get('container', document.body);
```

- **Parameters**: 
  - `id` (string): Element ID
  - `fallback` (any): Value returned if element not found
- **Returns**: Element or fallback value

---

#### `Elements.exists(id)`
**Check if element exists**

```javascript
if (Elements.exists('myElement')) {
  console.log('Element found!');
}
```

- **Parameters**: `id` (string)
- **Returns**: `boolean`

---

#### `Elements.destructure(...ids)`
**Get multiple elements as an object**

```javascript
// Get multiple elements at once
const { header, footer, sidebar } = Elements.destructure('header', 'footer', 'sidebar');

// Use them immediately
header.textContent = 'Welcome';
footer.style.display = 'block';
```

- **Parameters**: Multiple element IDs
- **Returns**: Object with element IDs as keys
- **Missing elements**: Set to `null` in returned object

---

#### `Elements.getRequired(...ids)`
**Get elements or throw error if missing**

```javascript
try {
  const { loginForm, username, password } = Elements.getRequired(
    'loginForm', 'username', 'password'
  );
  // All elements guaranteed to exist here
} catch (error) {
  console.error('Required elements missing:', error.message);
}
```

- **Parameters**: Multiple element IDs
- **Returns**: Object with elements
- **Throws**: Error if any element is missing
- **Use case**: Critical elements that must exist

---

#### `Elements.waitFor(...ids)`
**Async wait for elements to appear in DOM**

```javascript
// Wait for dynamically loaded elements
const { dynamicContent } = await Elements.waitFor('dynamicContent');

// With timeout (default: 5000ms)
try {
  const elements = await Elements.waitFor('elem1', 'elem2');
} catch (error) {
  console.error('Timeout waiting for elements');
}
```

- **Parameters**: Multiple element IDs
- **Returns**: Promise resolving to object with elements
- **Timeout**: 5 seconds (throws error on timeout)

---

#### `Elements.getMultiple(...ids)`
**Alias for destructure**

```javascript
const elements = Elements.getMultiple('btn1', 'btn2', 'btn3');
```

---

#### `Elements.update(updates)`
**Bulk update multiple elements by ID**

```javascript
// Update multiple elements in one call
Elements.update({
  title: { 
    textContent: 'New Title',
    style: { color: 'blue', fontSize: '24px' }
  },
  description: { 
    textContent: 'Updated description' 
  },
  submitBtn: { 
    disabled: false,
    style: { backgroundColor: 'green' }
  }
});
```

- **Parameters**: Object where keys are element IDs, values are update objects
- **Returns**: Results object with success/failure for each element
- **Behavior**: Applies updates to all matching elements

---

### Property Methods

#### `Elements.setProperty(id, property, value)`
**Set a property on an element**

```javascript
Elements.setProperty('myInput', 'value', 'Hello');
Elements.setProperty('checkbox', 'checked', true);
```

---

#### `Elements.getProperty(id, property, fallback)`
**Get a property from an element**

```javascript
const value = Elements.getProperty('myInput', 'value', '');
const isChecked = Elements.getProperty('checkbox', 'checked', false);
```

---

#### `Elements.setAttribute(id, attribute, value)`
**Set an attribute on an element**

```javascript
Elements.setAttribute('myImage', 'src', 'image.jpg');
Elements.setAttribute('myLink', 'href', 'https://example.com');
```

---

#### `Elements.getAttribute(id, attribute, fallback)`
**Get an attribute from an element**

```javascript
const src = Elements.getAttribute('myImage', 'src', 'default.jpg');
const href = Elements.getAttribute('myLink', 'href', '#');
```

---

### Management Methods

#### `Elements.isCached(id)`
**Check if element is in cache**

```javascript
if (Elements.isCached('myElement')) {
  console.log('Element is cached');
}
```

---

#### `Elements.stats()`
**Get cache statistics**

```javascript
const stats = Elements.stats();
console.log(`Hit rate: ${stats.hitRate}`);
console.log(`Cache size: ${stats.cacheSize}`);
console.log(`Hits: ${stats.hits}, Misses: ${stats.misses}`);
```

---

#### `Elements.clear()`
**Clear the element cache**

```javascript
// Force refresh of cached elements
Elements.clear();
```

---

#### `Elements.destroy()`
**Destroy the Elements helper**

```javascript
// Clean up when no longer needed
Elements.destroy();
```

---

#### `Elements.configure(options)`
**Configure Elements behavior**

```javascript
Elements.configure({
  enableLogging: true,
  maxCacheSize: 2000,
  cleanupInterval: 60000
});
```

**Options**:
- `enableLogging`: Enable console logging
- `maxCacheSize`: Maximum cached elements
- `cleanupInterval`: Cache cleanup frequency (ms)
- `autoCleanup`: Enable automatic cleanup

---

## Collections Helper

The Collections helper provides access to **groups of elements** by class name, tag name, or name attribute.

### Collection Types

#### `Collections.ClassName[className]` or `Collections.ClassName('className')`
**Get elements by class name**

```javascript
// Property access
const buttons = Collections.ClassName.btn;
const cards = Collections.ClassName['card-item'];

// Function call
const items = Collections.ClassName('list-item');

// All return live HTMLCollection with enhanced methods
```

---

#### `Collections.TagName[tagName]` or `Collections.TagName('tagName')`
**Get elements by tag name**

```javascript
// Get all divs
const divs = Collections.TagName.div;

// Get all paragraphs
const paragraphs = Collections.TagName.p;

// Function call
const spans = Collections.TagName('span');
```

---

#### `Collections.Name[name]` or `Collections.Name('name')`
**Get elements by name attribute**

```javascript
// Get form inputs by name
const emailInputs = Collections.Name.email;
const checkboxes = Collections.Name('newsletter');
```

---

### Collection Properties

#### `.length`
**Number of elements in collection**

```javascript
const buttons = Collections.ClassName.btn;
console.log(`Found ${buttons.length} buttons`);
```

---

#### `.item(index)`
**Get element at index**

```javascript
const firstButton = Collections.ClassName.btn.item(0);
```

---

#### `[index]`
**Direct index access**

```javascript
const buttons = Collections.ClassName.btn;
const first = buttons[0];
const second = buttons[1];
```

---

### Array-Like Methods

#### `.toArray()`
**Convert to JavaScript array**

```javascript
const buttonsArray = Collections.ClassName.btn.toArray();
// Now you can use all array methods
buttonsArray.reverse();
```

---

#### `.forEach(callback, thisArg)`
**Iterate over elements**

```javascript
Collections.ClassName.btn.forEach((button, index) => {
  button.textContent = `Button ${index + 1}`;
});
```

---

#### `.map(callback, thisArg)`
**Map over elements**

```javascript
const buttonTexts = Collections.ClassName.btn.map(btn => btn.textContent);
console.log(buttonTexts); // ['Submit', 'Cancel', 'Reset']
```

---

#### `.filter(callback, thisArg)`
**Filter elements**

```javascript
const visibleButtons = Collections.ClassName.btn.filter(btn => {
  return btn.style.display !== 'none';
});
```

---

#### `.find(callback, thisArg)`
**Find first matching element**

```javascript
const submitButton = Collections.ClassName.btn.find(btn => {
  return btn.textContent === 'Submit';
});
```

---

#### `.some(callback, thisArg)`
**Test if any element matches**

```javascript
const hasDisabled = Collections.ClassName.btn.some(btn => btn.disabled);
```

---

#### `.every(callback, thisArg)`
**Test if all elements match**

```javascript
const allVisible = Collections.ClassName.btn.every(btn => {
  return btn.style.display !== 'none';
});
```

---

#### `.reduce(callback, initialValue)`
**Reduce collection to single value**

```javascript
const totalWidth = Collections.ClassName.card.reduce((total, card) => {
  return total + card.offsetWidth;
}, 0);
```

---

### Utility Methods

#### `.first()`
**Get first element**

```javascript
const firstButton = Collections.ClassName.btn.first();
```

---

#### `.last()`
**Get last element**

```javascript
const lastButton = Collections.ClassName.btn.last();
```

---

#### `.at(index)`
**Get element at index (supports negative)**

```javascript
const first = Collections.ClassName.btn.at(0);
const last = Collections.ClassName.btn.at(-1);
const secondLast = Collections.ClassName.btn.at(-2);
```

---

#### `.isEmpty()`
**Check if collection is empty**

```javascript
if (Collections.ClassName.btn.isEmpty()) {
  console.log('No buttons found');
}
```

---

### DOM Manipulation Methods

#### `.addClass(className)`
**Add class to all elements**

```javascript
Collections.ClassName.btn.addClass('active');
```

---

#### `.removeClass(className)`
**Remove class from all elements**

```javascript
Collections.ClassName.btn.removeClass('disabled');
```

---

#### `.toggleClass(className)`
**Toggle class on all elements**

```javascript
Collections.ClassName.btn.toggleClass('highlighted');
```

---

#### `.setProperty(prop, value)`
**Set property on all elements**

```javascript
Collections.ClassName.btn.setProperty('disabled', true);
Collections.TagName.input.setProperty('value', '');
```

---

#### `.setAttribute(attr, value)`
**Set attribute on all elements**

```javascript
Collections.ClassName.btn.setAttribute('data-clicked', 'false');
```

---

#### `.setStyle(styles)`
**Set styles on all elements**

```javascript
Collections.ClassName.card.setStyle({
  backgroundColor: '#f0f0f0',
  padding: '20px',
  borderRadius: '8px'
});
```

---

#### `.on(event, handler)`
**Add event listener to all elements**

```javascript
Collections.ClassName.btn.on('click', (e) => {
  console.log('Button clicked:', e.target);
});
```

---

#### `.off(event, handler)`
**Remove event listener from all elements**

```javascript
const handler = (e) => console.log('Clicked');
Collections.ClassName.btn.on('click', handler);
// Later...
Collections.ClassName.btn.off('click', handler);
```

---

### Filtering Methods

#### `.visible()`
**Get only visible elements**

```javascript
const visibleCards = Collections.ClassName.card.visible();
```

---

#### `.hidden()`
**Get only hidden elements**

```javascript
const hiddenCards = Collections.ClassName.card.hidden();
```

---

#### `.enabled()`
**Get only enabled elements**

```javascript
const enabledInputs = Collections.TagName.input.enabled();
```

---

#### `.disabled()`
**Get only disabled elements**

```javascript
const disabledButtons = Collections.ClassName.btn.disabled();
```

---

### Collections Utility Methods

#### `Collections.update(updates)`
**Bulk update multiple collections**

```javascript
Collections.update({
  'class:btn': { 
    style: { padding: '10px 20px' } 
  },
  'tag:p': { 
    style: { lineHeight: '1.6' } 
  },
  'name:email': { 
    placeholder: 'Enter your email' 
  }
});
```

**Identifier formats**:
- `'class:className'` or just `'className'`
- `'tag:tagName'`
- `'name:attributeName'`

---

#### `Collections.getMultiple(requests)`
**Get multiple collections**

```javascript
const collections = Collections.getMultiple([
  { type: 'className', value: 'btn', as: 'buttons' },
  { type: 'tagName', value: 'div', as: 'divs' },
  { type: 'name', value: 'email', as: 'emailInputs' }
]);

console.log(collections.buttons);
console.log(collections.divs);
```

---

#### `Collections.waitFor(type, value, minCount, timeout)`
**Wait for collection to have minimum elements**

```javascript
// Wait for at least 3 items to load
const items = await Collections.waitFor('className', 'item', 3, 5000);
```

---

#### `Collections.stats()`
**Get collection statistics**

```javascript
const stats = Collections.stats();
console.log(stats);
```

---

#### `Collections.clear()`
**Clear collection cache**

```javascript
Collections.clear();
```

---

#### `Collections.configure(options)`
**Configure Collections behavior**

```javascript
Collections.configure({
  enableLogging: true,
  enableEnhancedSyntax: true
});
```

---

## Selector Helper

The Selector helper provides **CSS selector-based access** with caching and enhancement.

### Basic Query Methods

#### `Selector.query(selector)` or `Selector.query[selector]`
**Query single element (like querySelector)**

```javascript
// Function call
const header = Selector.query('#header');
const button = Selector.query('.btn-primary');
const input = Selector.query('input[type="email"]');

// Property access (enhanced syntax)
const nav = Selector.query.nav;
const form = Selector.query['#loginForm'];
```

- **Returns**: Single element or `null`
- **Caching**: Results are cached
- **Auto-enhanced**: Element has `.update()` method

---

#### `Selector.queryAll(selector)` or `Selector.queryAll[selector]`
**Query all matching elements (like querySelectorAll)**

```javascript
// Function call
const allButtons = Selector.queryAll('.btn');
const allInputs = Selector.queryAll('input');

// Property access
const paragraphs = Selector.queryAll.p;
const links = Selector.queryAll['a.external'];
```

- **Returns**: Enhanced NodeList collection
- **Has all array methods**: map, filter, forEach, etc.

---

### Scoped Query Methods

#### `Selector.Scoped.within(container, selector)`
**Query within a specific container (single element)**

```javascript
// Container as selector
const button = Selector.Scoped.within('#sidebar', '.btn');

// Container as element
const sidebar = document.getElementById('sidebar');
const link = Selector.Scoped.within(sidebar, 'a.active');
```

---

#### `Selector.Scoped.withinAll(container, selector)`
**Query all within a container**

```javascript
const sidebarButtons = Selector.Scoped.withinAll('#sidebar', '.btn');
const formInputs = Selector.Scoped.withinAll('#myForm', 'input');
```

---

### Collection Methods

All methods from Collections helper are available on queryAll results:

```javascript
const buttons = Selector.queryAll('.btn');

// Array methods
buttons.forEach(btn => console.log(btn.textContent));
buttons.map(btn => btn.id);
buttons.filter(btn => !btn.disabled);

// Utility methods
buttons.first();
buttons.last();
buttons.at(-1);
buttons.isEmpty();

// DOM manipulation
buttons.addClass('active');
buttons.setStyle({ padding: '10px' });
buttons.on('click', handler);

// Filtering
buttons.visible();
buttons.enabled();
```

---

### Selector Utility Methods

#### `Selector.update(updates)`
**Bulk update elements by selector**

```javascript
Selector.update({
  '#header': { 
    textContent: 'Welcome!',
    style: { fontSize: '24px' }
  },
  '.btn': { 
    style: { padding: '10px 20px' } 
  },
  'input[type="text"]': { 
    placeholder: 'Enter text...' 
  }
});
```

---

#### `Selector.waitFor(selector, timeout)`
**Wait for element to appear**

```javascript
// Wait for dynamic element
const modal = await Selector.waitFor('#dynamicModal', 5000);

// Handle timeout
try {
  const element = await Selector.waitFor('.loading', 3000);
} catch (error) {
  console.error('Element did not appear');
}
```

---

#### `Selector.waitForAll(selector, minCount, timeout)`
**Wait for minimum number of elements**

```javascript
// Wait for at least 5 list items
const items = await Selector.waitForAll('.list-item', 5, 10000);
```

---

#### `Selector.stats()`
**Get selector statistics**

```javascript
const stats = Selector.stats();
console.log('Cache hit rate:', stats.hitRate);
console.log('Selector breakdown:', stats.selectorBreakdown);
```

---

#### `Selector.clear()`
**Clear selector cache**

```javascript
Selector.clear();
```

---

#### `Selector.configure(options)`
**Configure Selector behavior**

```javascript
Selector.configure({
  enableLogging: true,
  enableSmartCaching: true,
  enableEnhancedSyntax: true
});
```

---

## Universal Update Method

The `.update()` method is available on **all elements** returned by this library. It provides a declarative way to update elements.

### Basic Updates

#### Text Content

```javascript
element.update({
  textContent: 'New text',
  innerText: 'Alternative text',
  innerHTML: '<strong>HTML</strong> content'
});
```

---

#### Properties

```javascript
element.update({
  value: 'Input value',
  checked: true,
  disabled: false,
  placeholder: 'Enter text...',
  id: 'newId',
  className: 'btn btn-primary'
});
```

---

### Style Updates

#### Style Object

```javascript
element.update({
  style: {
    color: 'red',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    fontSize: '16px',
    border: '1px solid #ccc'
  }
});
```

**Fine-grained optimization**: Only changed styles are applied

---

### Class List Operations

```javascript
element.update({
  classList: {
    add: 'active',                    // Single class
    add: ['btn', 'btn-primary'],      // Multiple classes
    remove: 'disabled',
    remove: ['old-class', 'temp'],
    toggle: 'highlighted',
    toggle: ['class1', 'class2'],
    replace: ['old-class', 'new-class']
  }
});
```

---

### Attributes

#### Set Attributes

```javascript
// Object format (recommended)
element.update({
  setAttribute: {
    'data-id': '123',
    'data-role': 'button',
    'aria-label': 'Submit form',
    'src': 'image.jpg',
    'href': 'https://example.com'
  }
});

// Legacy array format
element.update({
  setAttribute: ['src', 'image.jpg']
});
```

---

#### Remove Attributes

```javascript
element.update({
  removeAttribute: 'disabled'           // Single
});

element.update({
  removeAttribute: ['disabled', 'hidden']  // Multiple
});
```

---

#### Get Attributes (for logging)

```javascript
element.update({
  getAttribute: 'data-id'  // Logs the value
});
```

---

### Data Attributes

```javascript
element.update({
  dataset: {
    userId: '123',
    role: 'admin',
    timestamp: Date.now().toString()
  }
});

// Access: element.dataset.userId
```

---

### Event Listeners

#### Array Format (single event)

```javascript
element.update({
  addEventListener: ['click', (e) => {
    console.log('Clicked!', e.target);
  }]
});

// With options
element.update({
  addEventListener: ['click', handler, { once: true, passive: true }]
});
```

---

#### Object Format (multiple events)

```javascript
element.update({
  addEventListener: {
    click: (e) => console.log('Clicked'),
    mouseenter: (e) => console.log('Mouse entered'),
    mouseleave: (e) => console.log('Mouse left'),
    submit: [(e) => {
      e.preventDefault();
      console.log('Form submitted');
    }, { once: true }]
  }
});
```

**Features**:
- Automatic duplicate prevention
- Enhanced handlers with `e.target.update()` and `this.update()`

---

#### Remove Event Listeners

```javascript
const handler = (e) => console.log('Click');

// Add
element.update({
  addEventListener: ['click', handler]
});

// Remove
element.update({
  removeEventListener: ['click', handler]
});
```

---

### Method Calls

```javascript
element.update({
  focus: [],                          // No arguments
  scrollIntoView: [{ behavior: 'smooth' }],  // With arguments
  setAttribute: ['disabled', 'true'],
  removeAttribute: ['hidden']
});
```

---

### Combined Updates

```javascript
// Update everything at once!
element.update({
  textContent: 'Submit Form',
  className: 'btn btn-primary btn-lg',
  disabled: false,
  
  style: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer'
  },
  
  classList: {
    add: ['animated', 'fade-in'],
    remove: 'hidden'
  },
  
  setAttribute: {
    'type': 'submit',
    'data-form': 'login',
    'aria-label': 'Submit login form'
  },
  
  dataset: {
    action: 'login',
    endpoint: '/api/login'
  },
  
  addEventListener: {
    click: (e) => {
      console.log('Submitting form...');
      // Use this.update() or e.target.update() inside handler!
      e.target.update({
        disabled: true,
        textContent: 'Submitting...'
      });
    },
    mouseenter: (e) => {
      e.target.update({
        style: { backgroundColor: '#0056b3' }
      });
    },
    mouseleave: (e) => {
      e.target.update({
        style: { backgroundColor: '#007bff' }
      });
    }
  }
});
```

---

### Update on Collections

```javascript
// Update all elements in collection
const buttons = Collections.ClassName.btn;

buttons.update({
  disabled: false,
  style: {
    padding: '10px 20px',
    backgroundColor: 'blue'
  },
  classList: {
    add: 'active',
    remove: 'disabled'
  }
});
```

---

## Enhanced createElement

Enhanced `document.createElement()` with auto-enhancement and configuration support.

### Basic Creation

```javascript
// Standard usage
const div = document.createElement('div');
// div automatically has .update() method

div.update({
  textContent: 'Hello World',
  className: 'container',
  style: { padding: '20px' }
});
```

---

### Creation with Configuration

```javascript
// Create with configuration object
const button = document.createElement('button', {
  textContent: 'Click Me',
  className: 'btn btn-primary',
  
  style: {
    padding: '10px 20px',
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    borderRadius: '4px'
  },
  
  setAttribute: {
    'type': 'button',
    'data-action': 'submit'
  },
  
  addEventListener: {
    click: (e) => {
      console.log('Button clicked!');
      e.target.update({ disabled: true });
    }
  }
});

document.body.appendChild(button);
```

---

### Bulk Creation

#### `createElement.bulk(definitions)`
**Create multiple elements with configurations**

```javascript
const elements = createElement.bulk({
  // Key = element identifier, Value = configuration
  H1: {
    textContent: 'Welcome!',
    className: 'title',
    style: { color: 'navy', fontSize: '32px' }
  },
  
  P: {
    textContent: 'This is a paragraph',
    className: 'description',
    style: { lineHeight: '1.6' }
  },
  
  BUTTON: {
    textContent: 'Click Me',
    className: 'btn btn-primary',
    addEventListener: {
      click: () => alert('Clicked!')
    }
  },
  
  // Numbered instances for multiple elements of same type
  DIV_1: { className: 'container' },
  DIV_2: { className: 'sidebar' },
  DIV_3: { className: 'footer' }
});

// Access created elements
elements.H1.textContent = 'Updated Title';
elements.P.style.color = 'gray';
elements.BUTTON.disabled = true;
elements.DIV_1.appendChild(elements.H1);
```

---

### Bulk Creation Methods

#### `.toArray(...tagNames)`
**Get elements as array**

```javascript
const elements = createElement.bulk({
  H1: { textContent: 'Title' },
  P: { textContent: 'Paragraph' },
  DIV_1: { className: 'box' },
  DIV_2: { className: 'box' }
});

// Get all elements
const all = elements.toArray();

// Get specific elements in order
const specific = elements.toArray('H1', 'P');

// Get numbered instances
const divs = elements.toArray('DIV_1', 'DIV_2');
```

---

#### `.ordered(...tagNames)`
**Get elements in specific order** (alias for toArray)

```javascript
const [title, content, footer] = elements.ordered('H1', 'P', 'DIV_1');
```

---

#### `.all`
**Get all elements as array** (getter property)

```javascript
const allElements = elements.all;
allElements.forEach(el => console.log(el.tagName));
```

---

#### `.count`
**Get count of created elements** (getter)

```javascript
console.log(`Created ${elements.count} elements`);
```

---

#### `.keys`
**Get array of element keys** (getter)

```javascript
console.log(elements.keys); // ['H1', 'P', 'BUTTON', 'DIV_1', 'DIV_2', 'DIV_3']
```

---

#### `.has(key)`
**Check if element exists**

```javascript
if (elements.has('H1')) {
  console.log('H1 element was created');
}
```

---

#### `.get(key, fallback)`
**Get element with fallback**

```javascript
const header = elements.get('H1', null);
const missing = elements.get('SPAN', document.createElement('span'));
```

---

#### `.forEach(callback)`
**Iterate over elements**

```javascript
elements.forEach((element, key, index) => {
  console.log(`${index}: ${key} = ${element.tagName}`);
  element.style.margin = '10px';
});
```

---

#### `.map(callback)`
**Map over elements**

```javascript
const tagNames = elements.map((element, key, index) => {
  return element.tagName;
});
```

---

#### `.filter(callback)`
**Filter elements**

```javascript
const divs = elements.filter((element, key, index) => {
  return element.tagName === 'DIV';
});
```

---

#### `.updateMultiple(updates)`
**Update multiple elements**

```javascript
elements.updateMultiple({
  H1: { 
    textContent: 'New Title',
    style: { color: 'red' }
  },
  P: { 
    textContent: 'Updated paragraph' 
  },
  BUTTON: { 
    disabled: true 
  }
});
```

---

#### `.appendTo(container)`
**Append all elements to container**

```javascript
// Append to element
elements.appendTo(document.body);

// Append to selector
elements.appendTo('#content');
```

---

#### `.appendToOrdered(container, ...tagNames)`
**Append specific elements in order**

```javascript
// Append in specific order
elements.appendToOrdered('#content', 'H1', 'P', 'DIV_1', 'DIV_2');
```

---

### Complete Bulk Creation Example

```javascript
const ui = createElement.bulk({
  HEADER: {
    className: 'header',
    style: { padding: '20px', backgroundColor: '#333' }
  },
  
  H1: {
    textContent: 'My Application',
    style: { color: 'white', margin: 0 }
  },
  
  NAV: {
    className: 'navigation',
    style: { display: 'flex', gap: '10px' }
  },
  
  LINK_1: {
    textContent: 'Home',
    setAttribute: { href: '#home' },
    className: 'nav-link'
  },
  
  LINK_2: {
    textContent: 'About',
    setAttribute: { href: '#about' },
    className: 'nav-link'
  },
  
  MAIN: {
    className: 'main-content',
    style: { padding: '40px' }
  },
  
  FOOTER: {
    className: 'footer',
    textContent: '© 2024',
    style: { padding: '20px', textAlign: 'center' }
  }
});

// Build structure
ui.HEADER.appendChild(ui.H1);
ui.HEADER.appendChild(ui.NAV);
ui.NAV.appendChild(ui.LINK_1);
ui.NAV.appendChild(ui.LINK_2);

// Append to document in order
ui.appendToOrdered(document.body, 'HEADER', 'MAIN', 'FOOTER');

// Update later
ui.updateMultiple({
  H1: { textContent: 'Updated Title' },
  MAIN: { innerHTML: '<p>Content loaded!</p>' }
});
```

---

## DOMHelpers Combined API

Global object providing access to all helpers and utilities.

## DOMHelpers Combined API (continued)

### Access Helpers

```javascript
// Access individual helpers
DOMHelpers.Elements
DOMHelpers.Collections
DOMHelpers.Selector

// Access helper classes
DOMHelpers.ProductionElementsHelper
DOMHelpers.ProductionCollectionHelper
DOMHelpers.ProductionSelectorHelper
```

---

### Global Methods

#### `DOMHelpers.isReady()`
**Check if all helpers are initialized**

```javascript
if (DOMHelpers.isReady()) {
  console.log('All helpers are ready to use');
}
```

- **Returns**: `boolean`
- **Use case**: Verify library loaded correctly

---

#### `DOMHelpers.getStats()`
**Get combined statistics from all helpers**

```javascript
const stats = DOMHelpers.getStats();
console.log('Elements stats:', stats.elements);
console.log('Collections stats:', stats.collections);
console.log('Selector stats:', stats.selector);
```

**Returns object with**:
- `elements`: Elements helper statistics
- `collections`: Collections helper statistics
- `selector`: Selector helper statistics

**Each contains**:
- `hits`: Cache hits
- `misses`: Cache misses
- `hitRate`: Hit rate percentage (0-1)
- `cacheSize`: Current cache size
- `uptime`: Time since last cleanup

---

#### `DOMHelpers.clearAll()`
**Clear all caches across all helpers**

```javascript
// Clear all caches at once
DOMHelpers.clearAll();

// Equivalent to:
// Elements.clear()
// Collections.clear()
// Selector.clear()
```

**Use cases**:
- Memory management
- Force cache refresh
- Before major DOM updates

---

#### `DOMHelpers.destroyAll()`
**Destroy all helpers and cleanup**

```javascript
// Clean up before page unload or when done
DOMHelpers.destroyAll();
```

**Actions performed**:
- Disconnects all mutation observers
- Clears all caches
- Removes all timers
- Cleans up event listeners

---

#### `DOMHelpers.configure(options)`
**Configure all helpers at once**

```javascript
// Configure all helpers with same options
DOMHelpers.configure({
  enableLogging: true,
  maxCacheSize: 2000,
  cleanupInterval: 60000
});

// Configure specific helpers
DOMHelpers.configure({
  elements: {
    enableLogging: true,
    maxCacheSize: 1500
  },
  collections: {
    enableEnhancedSyntax: true
  },
  selector: {
    enableSmartCaching: true
  }
});
```

**Common options**:
- `enableLogging`: Enable console logging (default: false)
- `maxCacheSize`: Maximum cached items (default: 1000)
- `cleanupInterval`: Auto-cleanup interval in ms (default: 30000)
- `autoCleanup`: Enable automatic cleanup (default: true)
- `debounceDelay`: Mutation observer debounce (default: 16ms)

**Helper-specific options**:
- `enableEnhancedSyntax`: Enhanced property access (Collections/Selector)
- `enableSmartCaching`: Intelligent cache invalidation (Selector)

---

#### `DOMHelpers.version`
**Get library version**

```javascript
console.log('DOM Helpers version:', DOMHelpers.version); // "2.3.1"
```

---

#### `DOMHelpers.createElement`
**Access enhanced createElement**

```javascript
const button = DOMHelpers.createElement('button', {
  textContent: 'Click Me',
  className: 'btn'
});
```

---

#### `DOMHelpers.enableCreateElementEnhancement()`
**Enable auto-enhancement of createElement**

```javascript
// Enable enhancement (opt-in)
DOMHelpers.enableCreateElementEnhancement();

// Now all created elements have .update()
const div = document.createElement('div');
div.update({ textContent: 'Auto-enhanced!' });
```

---

#### `DOMHelpers.disableCreateElementEnhancement()`
**Disable auto-enhancement of createElement**

```javascript
// Disable enhancement (restore original)
DOMHelpers.disableCreateElementEnhancement();

// Back to standard createElement
const div = document.createElement('div');
// div.update is not available unless manually enhanced
```

---

## Advanced Usage Patterns

### Pattern 1: Declarative UI Updates

```javascript
// Update multiple parts of UI declaratively
function updateDashboard(data) {
  Elements.update({
    username: { 
      textContent: data.user.name 
    },
    avatar: { 
      setAttribute: { src: data.user.avatar } 
    },
    notificationBadge: { 
      textContent: data.notifications.count,
      style: { 
        display: data.notifications.count > 0 ? 'block' : 'none' 
      }
    }
  });
  
  Collections.update({
    'class:stat-card': {
      classList: { add: 'updated' }
    }
  });
}
```

---

### Pattern 2: Component Builder

```javascript
function createCard({ title, content, image, onButtonClick }) {
  const elements = createElement.bulk({
    ARTICLE: {
      className: 'card',
      style: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '400px'
      }
    },
    
    IMG: {
      setAttribute: { src: image, alt: title },
      style: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '4px'
      }
    },
    
    H2: {
      textContent: title,
      style: {
        margin: '15px 0 10px',
        fontSize: '24px'
      }
    },
    
    P: {
      textContent: content,
      style: {
        color: '#666',
        lineHeight: '1.6'
      }
    },
    
    BUTTON: {
      textContent: 'Learn More',
      className: 'btn btn-primary',
      addEventListener: {
        click: onButtonClick
      }
    }
  });
  
  // Build structure
  elements.ARTICLE.append(
    elements.IMG,
    elements.H2,
    elements.P,
    elements.BUTTON
  );
  
  return elements.ARTICLE;
}

// Usage
const card = createCard({
  title: 'Amazing Product',
  content: 'This product will change your life...',
  image: 'product.jpg',
  onButtonClick: (e) => {
    console.log('Button clicked!');
  }
});

document.body.appendChild(card);
```

---

### Pattern 3: Form Handler with Validation

```javascript
class FormHandler {
  constructor(formId) {
    this.form = Elements[formId];
    this.inputs = Selector.Scoped.withinAll(this.form, 'input, textarea, select');
    this.setupValidation();
  }
  
  setupValidation() {
    this.inputs.forEach(input => {
      input.addEventListener('blur', (e) => {
        this.validateField(e.target);
      });
    });
    
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validateAll()) {
        this.submit();
      }
    });
  }
  
  validateField(field) {
    const isValid = field.checkValidity();
    
    field.update({
      classList: {
        remove: isValid ? 'invalid' : 'valid',
        add: isValid ? 'valid' : 'invalid'
      },
      setAttribute: {
        'aria-invalid': !isValid
      }
    });
    
    return isValid;
  }
  
  validateAll() {
    const results = this.inputs.map(input => this.validateField(input));
    return results.every(result => result === true);
  }
  
  getFormData() {
    const data = {};
    this.inputs.forEach(input => {
      if (input.name) {
        data[input.name] = input.value;
      }
    });
    return data;
  }
  
  async submit() {
    const submitButton = Selector.query('button[type="submit"]', this.form);
    
    submitButton?.update({
      disabled: true,
      textContent: 'Submitting...'
    });
    
    try {
      const data = this.getFormData();
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        this.handleSuccess();
      } else {
        this.handleError();
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      submitButton?.update({
        disabled: false,
        textContent: 'Submit'
      });
    }
  }
  
  handleSuccess() {
    this.form.update({
      classList: { add: 'submitted' }
    });
    
    this.inputs.update({
      value: '',
      classList: { remove: ['valid', 'invalid'] }
    });
  }
  
  handleError(error) {
    console.error('Form submission error:', error);
    
    Elements['error-message']?.update({
      textContent: 'An error occurred. Please try again.',
      style: { display: 'block' }
    });
  }
}

// Usage
const contactForm = new FormHandler('contactForm');
```

---

### Pattern 4: Dynamic List Manager

```javascript
class ListManager {
  constructor(containerId) {
    this.container = Elements[containerId];
    this.items = [];
  }
  
  addItem(itemData) {
    const item = createElement('li', {
      className: 'list-item',
      textContent: itemData.text,
      
      dataset: {
        id: itemData.id,
        timestamp: Date.now()
      },
      
      style: {
        padding: '10px',
        margin: '5px 0',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    });
    
    const deleteBtn = createElement('button', {
      textContent: '×',
      className: 'delete-btn',
      
      style: {
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        cursor: 'pointer'
      },
      
      addEventListener: {
        click: (e) => {
          this.removeItem(itemData.id);
        }
      }
    });
    
    item.appendChild(deleteBtn);
    this.container.appendChild(item);
    this.items.push({ id: itemData.id, element: item });
    
    return item;
  }
  
  removeItem(id) {
    const index = this.items.findIndex(item => item.id === id);
    
    if (index !== -1) {
      const item = this.items[index];
      
      // Animate out
      item.element.update({
        style: {
          opacity: '0',
          transform: 'translateX(100px)',
          transition: 'all 0.3s ease'
        }
      });
      
      setTimeout(() => {
        item.element.remove();
        this.items.splice(index, 1);
        this.updateCount();
      }, 300);
    }
  }
  
  clear() {
    this.items.forEach(item => item.element.remove());
    this.items = [];
    this.updateCount();
  }
  
  updateCount() {
    Elements['item-count']?.update({
      textContent: `${this.items.length} items`
    });
  }
  
  filter(predicate) {
    this.items.forEach(({ element, id }) => {
      const shouldShow = predicate({ id });
      
      element.update({
        style: {
          display: shouldShow ? 'flex' : 'none'
        }
      });
    });
  }
}

// Usage
const todoList = new ListManager('todo-list');

todoList.addItem({ id: 1, text: 'Buy groceries' });
todoList.addItem({ id: 2, text: 'Walk the dog' });
todoList.addItem({ id: 3, text: 'Write report' });

// Filter completed items
todoList.filter(item => !item.completed);
```

---

### Pattern 5: Theme Switcher

```javascript
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.themes = {
      light: {
        '--bg-color': '#ffffff',
        '--text-color': '#333333',
        '--primary-color': '#007bff',
        '--border-color': '#dddddd'
      },
      dark: {
        '--bg-color': '#1a1a1a',
        '--text-color': '#ffffff',
        '--primary-color': '#4dabf7',
        '--border-color': '#444444'
      }
    };
    
    this.init();
  }
  
  init() {
    this.applyTheme(this.currentTheme);
    this.setupToggle();
  }
  
  applyTheme(themeName) {
    const theme = this.themes[themeName];
    
    if (!theme) return;
    
    // Update CSS variables
    Object.entries(theme).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
    
    // Update toggle button
    Elements['theme-toggle']?.update({
      textContent: themeName === 'light' ? '🌙' : '☀️',
      setAttribute: {
        'aria-label': `Switch to ${themeName === 'light' ? 'dark' : 'light'} theme`
      }
    });
    
    // Update body class
    document.body.update({
      classList: {
        remove: ['theme-light', 'theme-dark'],
        add: `theme-${themeName}`
      }
    });
    
    // Store preference
    localStorage.setItem('theme', themeName);
    this.currentTheme = themeName;
  }
  
  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }
  
  setupToggle() {
    Elements['theme-toggle']?.update({
      addEventListener: {
        click: () => this.toggle()
      }
    });
  }
}

// Usage
const themeManager = new ThemeManager();
```

---

### Pattern 6: Lazy Loading Images

```javascript
class LazyImageLoader {
  constructor() {
    this.images = Selector.queryAll('img[data-src]');
    this.observer = null;
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.setupObserver();
    } else {
      this.loadAllImages();
    }
  }
  
  setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px'
      }
    );
    
    this.images.forEach(img => {
      this.observer.observe(img);
    });
  }
  
  loadImage(img) {
    const src = img.dataset.src;
    
    if (!src) return;
    
    img.update({
      setAttribute: { src },
      removeAttribute: 'data-src',
      
      addEventListener: {
        load: (e) => {
          e.target.update({
            classList: { add: 'loaded' },
            style: {
              opacity: '1',
              transition: 'opacity 0.3s ease'
            }
          });
        },
        
        error: (e) => {
          e.target.update({
            setAttribute: { src: 'placeholder.jpg', alt: 'Failed to load' },
            classList: { add: 'error' }
          });
        }
      }
    });
  }
  
  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
  }
  
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Usage
const lazyLoader = new LazyImageLoader();
```

---

### Pattern 7: Modal Manager

```javascript
class Modal {
  constructor(options = {}) {
    this.options = {
      title: options.title || 'Modal',
      content: options.content || '',
      onConfirm: options.onConfirm || (() => {}),
      onCancel: options.onCancel || (() => {}),
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel'
    };
    
    this.modal = null;
    this.create();
  }
  
  create() {
    const elements = createElement.bulk({
      OVERLAY: {
        className: 'modal-overlay',
        style: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '9999'
        },
        addEventListener: {
          click: (e) => {
            if (e.target === e.currentTarget) {
              this.cancel();
            }
          }
        }
      },
      
      DIALOG: {
        className: 'modal-dialog',
        setAttribute: { role: 'dialog', 'aria-modal': 'true' },
        style: {
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          minWidth: '400px',
          maxWidth: '600px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }
      },
      
      HEADER: {
        className: 'modal-header'
      },
      
      H2: {
        textContent: this.options.title,
        style: {
          margin: '0 0 20px',
          fontSize: '24px'
        }
      },
      
      CONTENT: {
        className: 'modal-content',
        innerHTML: this.options.content,
        style: {
          marginBottom: '20px',
          lineHeight: '1.6'
        }
      },
      
      FOOTER: {
        className: 'modal-footer',
        style: {
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }
      },
      
      BTN_CANCEL: {
        textContent: this.options.cancelText,
        className: 'btn btn-cancel',
        style: {
          padding: '10px 20px',
          border: '1px solid #ddd',
          backgroundColor: 'white',
          borderRadius: '4px',
          cursor: 'pointer'
        },
        addEventListener: {
          click: () => this.cancel()
        }
      },
      
      BTN_CONFIRM: {
        textContent: this.options.confirmText,
        className: 'btn btn-confirm',
        style: {
          padding: '10px 20px',
          border: 'none',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '4px',
          cursor: 'pointer'
        },
        addEventListener: {
          click: () => this.confirm()
        }
      }
    });
    
    // Build structure
    elements.HEADER.appendChild(elements.H2);
    elements.FOOTER.append(elements.BTN_CANCEL, elements.BTN_CONFIRM);
    elements.DIALOG.append(elements.HEADER, elements.CONTENT, elements.FOOTER);
    elements.OVERLAY.appendChild(elements.DIALOG);
    
    this.modal = elements.OVERLAY;
    this.elements = elements;
  }
  
  show() {
    document.body.appendChild(this.modal);
    
    // Focus confirm button
    this.elements.BTN_CONFIRM.focus();
    
    // Handle Escape key
    this.escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.cancel();
      }
    };
    document.addEventListener('keydown', this.escapeHandler);
    
    return this;
  }
  
  hide() {
    this.modal.update({
      style: {
        opacity: '0',
        transition: 'opacity 0.2s ease'
      }
    });
    
    setTimeout(() => {
      this.modal.remove();
      document.removeEventListener('keydown', this.escapeHandler);
    }, 200);
  }
  
  confirm() {
    this.options.onConfirm();
    this.hide();
  }
  
  cancel() {
    this.options.onCancel();
    this.hide();
  }
}

// Usage
const confirmModal = new Modal({
  title: 'Confirm Action',
  content: 'Are you sure you want to proceed?',
  confirmText: 'Yes, proceed',
  cancelText: 'Cancel',
  onConfirm: () => {
    console.log('Action confirmed!');
  },
  onCancel: () => {
    console.log('Action cancelled');
  }
});

confirmModal.show();
```

---

## Performance Tips

### 1. Use Caching Wisely

```javascript
// Good: Elements are cached automatically
const button = Elements.myButton;
button.update({ textContent: 'Click' });

// Avoid: Repeated queries bypass cache benefits
for (let i = 0; i < 1000; i++) {
  document.getElementById('myButton').textContent = 'Click';
}
```

---

### 2. Batch Updates

```javascript
// Good: Single update call
element.update({
  textContent: 'New text',
  className: 'active',
  style: {
    color: 'red',
    padding: '10px'
  }
});

// Avoid: Multiple separate updates
element.textContent = 'New text';
element.className = 'active';
element.style.color = 'red';
element.style.padding = '10px';
```

---

### 3. Use Collections for Bulk Operations

```javascript
// Good: Update all at once
Collections.ClassName.btn.update({
  disabled: false,
  style: { opacity: '1' }
});

// Avoid: Loop with individual updates
document.querySelectorAll('.btn').forEach(btn => {
  btn.disabled = false;
  btn.style.opacity = '1';
});
```

---

### 4. Leverage Fine-Grained Updates

```javascript
// The library only applies changes that actually differ
element.update({
  style: {
    color: 'red',    // Only applied if different
    padding: '10px'  // Only applied if different
  }
});

// Called again with same values
element.update({
  style: {
    color: 'red',    // Skipped (no change)
    padding: '10px'  // Skipped (no change)
  }
});
```

---

### 5. Clear Cache When Needed

```javascript
// After major DOM restructuring
DOMHelpers.clearAll();

// Or clear specific helper
Elements.clear();
Collections.clear();
Selector.clear();
```

---

## Migration from Vanilla JavaScript

### Before (Vanilla JS)

```javascript
// Get elements
const header = document.getElementById('header');
const buttons = document.querySelectorAll('.btn');
const inputs = document.getElementsByTagName('input');

// Update element
header.textContent = 'New Title';
header.style.color = 'blue';
header.style.fontSize = '24px';
header.classList.add('active');
header.setAttribute('data-state', 'loaded');

// Update multiple elements
buttons.forEach(btn => {
  btn.disabled = false;
  btn.style.opacity = '1';
  btn.classList.add('ready');
});

// Event listeners
header.addEventListener('click', (e) => {
  e.target.style.color = 'red';
});
```

---

### After (DOM Helpers)

```javascript
// Get elements (with caching and enhancement)
const header = Elements.header;
const buttons = Collections.ClassName.btn;
const inputs = Collections.TagName.input;

// Update element (declarative, efficient)
header.update({
  textContent: 'New Title',
  style: {
    color: 'blue',
    fontSize: '24px'
  },
  classList: { add: 'active' },
  setAttribute: { 'data-state': 'loaded' }
});

// Update multiple elements (single call)
buttons.update({
  disabled: false,
  style: { opacity: '1' },
  classList: { add: 'ready' }
});

// Event listeners (with e.target.update() support)
header.update({
  addEventListener: {
    click: (e) => {
      e.target.update({ style: { color: 'red' } });
    }
  }
});
```

---

## Conclusion

This DOM Helpers library provides a comprehensive, modern, and performant way to interact with the DOM. Key benefits include:

✅ **Intelligent caching** for better performance  
✅ **Declarative updates** for cleaner code  
✅ **Fine-grained change detection** to minimize DOM operations  
✅ **Automatic enhancement** of all elements  
✅ **Consistent API** across all helpers  
✅ **Type-safe** operations with built-in validation  
✅ **Zero dependencies** - pure vanilla JavaScript  
✅ **Production-ready** with extensive error handling  

Perfect for both beginners learning DOM manipulation and advanced developers building complex web applications!