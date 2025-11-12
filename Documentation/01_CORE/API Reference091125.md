# DOM Helpers Core Library - Complete API Reference

**Version:** 2.3.2  
**Status:** ✅ Production Ready  
**File:** `dom-helpers.bundle.js`

---

## 📚 Table of Contents

1. [Elements Helper](#elements-helper)
2. [Collections Helper](#collections-helper)
3. [Selector Helper](#selector-helper)
4. [Enhanced Update Utility](#enhanced-update-utility)
5. [DOMHelpers Global Object](#domhelpers-global-object)
6. [Enhanced createElement](#enhanced-createelement)
7. [Bulk Property Updaters](#bulk-property-updaters)

---

## 1. Elements Helper

Access DOM elements by ID with intelligent caching and auto-update methods.

### Basic Access

```javascript
// Direct property access
const myElement = Elements.myElementId;
const button = Elements.submitButton;

// Proxy-based access - automatically returns enhanced elements
Utility Methods
Elements.get(id, fallback?)
Get element by ID with optional fallback value.

const el = Elements.get('myId', null);
Elements.exists(id)
Check if element with ID exists.

if (Elements.exists('myId')) { /* ... */ }
Elements.getMultiple(...ids)
Get multiple elements at once.

const { header, footer, main } = Elements.getMultiple('header', 'footer', 'main');
Elements.destructure(...ids)
Destructure multiple elements by ID.

const { header, footer } = Elements.destructure('header', 'footer');
// Returns: { header: <element>, footer: <element> }
Elements.getRequired(...ids)
Get multiple elements, throw error if any missing.

const elements = Elements.getRequired('header', 'footer', 'main');
// Throws if any element not found
Elements.waitFor(...ids)
Async wait for elements to exist (max 5 seconds).

const elements = await Elements.waitFor('header', 'footer');
Elements.isCached(id)
Check if element is in cache.

if (Elements.isCached('myId')) { /* ... */ }
Property Getters/Setters
Elements.setProperty(id, property, value)
Set property on element.

Elements.setProperty('myInput', 'value', 'Hello');
Elements.getProperty(id, property, fallback?)
Get property from element.

const value = Elements.getProperty('myInput', 'value', '');
Elements.setAttribute(id, attribute, value)
Set attribute on element.

Elements.setAttribute('myDiv', 'data-role', 'button');
Elements.getAttribute(id, attribute, fallback?)
Get attribute from element.

const role = Elements.getAttribute('myDiv', 'data-role', 'default');
Bulk Updates
Elements.textContent(mapping)
Update text content of multiple elements.

Elements.textContent({
  header: 'Welcome',
  footer: 'Copyright 2025'
});
Elements.innerHTML(mapping)
Update innerHTML of multiple elements.

Elements.innerHTML({
  content: '<strong>Bold text</strong>',
  sidebar: '<ul><li>Item 1</li></ul>'
});
Elements.value(mapping)
Update values of multiple form inputs.

Elements.value({
  username: 'john_doe',
  email: 'john@example.com'
});
Elements.className(mapping)
Set className of multiple elements.

Elements.className({
  header: 'header-large active',
  footer: 'footer-small'
});
Elements.disabled(mapping)
Set disabled state of multiple elements.

Elements.disabled({
  submitBtn: true,
  resetBtn: false
});
Elements.checked(mapping)
Set checked state of checkboxes.

Elements.checked({
  agree: true,
  newsletter: false
});
Elements.placeholder(mapping)
Set placeholder text.

Elements.placeholder({
  search: 'Search...',
  email: 'Enter email'
});
Elements.href(mapping)
Set href attributes.

Elements.href({
  homeLink: '/home',
  aboutLink: '/about'
});
Elements.src(mapping)
Set src attributes.

Elements.src({
  logo: '/images/logo.png',
  banner: '/images/banner.jpg'
});
Elements.alt(mapping)
Set alt attributes.

Elements.alt({
  logo: 'Company Logo',
  banner: 'Welcome Banner'
});
Elements.title(mapping)
Set title attributes.

Elements.title({
  tooltip: 'Click for more info',
  help: 'Need help?'
});
Elements.style(mapping)
Apply styles to multiple elements.

Elements.style({
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px'
  },
  footer: {
    fontSize: '12px'
  }
});
Elements.dataset(mapping)
Set data attributes.

Elements.dataset({
  card: {
    userId: '123',
    role: 'admin'
  }
});
Elements.attrs(mapping)
Set multiple attributes.

Elements.attrs({
  myLink: {
    href: '/page',
    target: '_blank',
    rel: 'noopener'
  }
});
Elements.classes(mapping)
Advanced classList operations.

Elements.classes({
  header: {
    add: ['active', 'visible'],
    remove: ['hidden'],
    toggle: 'expanded'
  },
  footer: {
    add: 'show',
    remove: 'hide'
  }
});
Elements.prop(propertyName, mapping)
Set any property on multiple elements.

Elements.prop('disabled', {
  btn1: true,
  btn2: false
});

// Nested properties
Elements.prop('style.color', {
  text1: 'red',
  text2: 'blue'
});
Elements.update(updates)
Universal update method for multiple elements.

const results = Elements.update({
  header: {
    textContent: 'Welcome',
    style: { color: 'blue' },
    classList: { add: 'active' }
  },
  footer: {
    innerHTML: '<p>Footer</p>'
  }
});
Cache Management
Elements.stats()
Get cache statistics.

const stats = Elements.stats();
// { hits, misses, cacheSize, hitRate, uptime }
Elements.clear()
Clear element cache.

Elements.clear();
Elements.destroy()
Destroy Elements helper (cleanup).

Elements.destroy();
Elements.configure(options)
Configure Elements helper options.

Elements.configure({
  enableLogging: true,
  maxCacheSize: 2000,
  cleanupInterval: 60000
});
2. Collections Helper
Access collections of elements by className, tagName, or name attribute.

Access Methods
Collections.ClassName[className]
Get elements by class name.

const cards = Collections.ClassName.card;
const buttons = Collections.ClassName['btn-primary'];
Collections.TagName[tagName]
Get elements by tag name.

const divs = Collections.TagName.div;
const inputs = Collections.TagName.input;
Collections.Name[name]
Get elements by name attribute.

const radios = Collections.Name.gender;
const checkboxes = Collections.Name.interests;
Collection Methods
All collections have these methods:

Array-like Methods
collection.toArray()        // Convert to plain array
collection.forEach(fn)      // Iterate over elements
collection.map(fn)          // Map over elements
collection.filter(fn)       // Filter elements
collection.find(fn)         // Find first matching element
collection.some(fn)         // Check if any match
collection.every(fn)        // Check if all match
collection.reduce(fn, init) // Reduce elements
Access Methods
collection.item(index)      // Get element at index
collection.first()          // Get first element
collection.last()           // Get last element
collection.at(index)        // Get element (supports negative indices)
collection.isEmpty()        // Check if empty
collection.length           // Number of elements
Class Manipulation
collection.addClass(className)      // Add class to all
collection.removeClass(className)   // Remove class from all
collection.toggleClass(className)   // Toggle class on all
Property/Attribute Setting
collection.setProperty(prop, value)     // Set property on all
collection.setAttribute(attr, value)    // Set attribute on all
collection.setStyle(styles)             // Set styles on all
Event Handling
collection.on(event, handler)      // Add event listener to all
collection.off(event, handler)     // Remove event listener from all
Filtering
collection.visible()    // Get visible elements
collection.hidden()     // Get hidden elements
collection.enabled()    // Get enabled elements
collection.disabled()   // Get disabled elements
Bulk Update Methods
Collections.update(updates)
Update multiple collections at once.

const results = Collections.update({
  // By class name (implicit)
  'card': {
    style: { borderColor: 'blue' },
    classList: { add: 'active' }
  },
  
  // Explicit collection type
  'class:button': {
    disabled: true
  },
  'tag:input': {
    value: ''
  },
  'name:gender': {
    checked: false
  }
});
Utility Methods
Collections.getMultiple(requests)
Get multiple collections at once.

const collections = Collections.getMultiple([
  { type: 'className', value: 'card', as: 'cards' },
  { type: 'tagName', value: 'button', as: 'buttons' }
]);
// Returns: { cards: [...], buttons: [...] }
Collections.waitFor(type, value, minCount?, timeout?)
Wait for elements to exist.

const buttons = await Collections.waitFor('className', 'btn', 3, 5000);
Collections.isCached(type, value)
Check if collection is cached.

if (Collections.isCached('className', 'card')) { /* ... */ }
Cache Management
Collections.stats()          // Get cache statistics
Collections.clear()          // Clear cache
Collections.destroy()        // Destroy helper
Collections.configure(opts)  // Configure options
3. Selector Helper
Query elements using CSS selectors with caching.

Query Methods
Selector.query(selector)
Get single element (like querySelector).

const element = Selector.query('#header');
const button = Selector.query('.btn-primary');
const input = Selector.query('input[type="email"]');
Selector.queryAll(selector)
Get all matching elements (like querySelectorAll).

const buttons = Selector.queryAll('.button');
const links = Selector.queryAll('a[href^="http"]');
Scoped Queries
Selector.Scoped.within(container, selector)
Query within a specific container (single element).

const item = Selector.Scoped.within('#sidebar', '.menu-item');
const input = Selector.Scoped.within(containerElement, 'input');
Selector.Scoped.withinAll(container, selector)
Query within container (all matching).

const items = Selector.Scoped.withinAll('#sidebar', '.menu-item');
Enhanced Syntax (if enabled)
// Property-based access (camelCase to CSS selector)
const header = Selector.query.header;           // #header
const myButton = Selector.query.myButton;       // #my-button
const card = Selector.query.classCard;          // .card

// Function call still works
const element = Selector.query('#custom-id');
Collection Methods
QueryAll results have all the collection methods:

const buttons = Selector.queryAll('.button');

buttons.forEach(btn => console.log(btn));
buttons.addClass('active');
buttons.setProperty('disabled', true);
buttons.on('click', handler);
buttons.first();
buttons.last();
buttons.visible();
// ... etc.
Bulk Update
Selector.update(updates)
Update elements by selector.

const results = Selector.update({
  '.card': {
    style: { borderColor: 'blue' },
    classList: { add: 'active' }
  },
  '#header': {
    textContent: 'Welcome'
  },
  'input[type="text"]': {
    value: '',
    placeholder: 'Enter text'
  }
});
Utility Methods
Selector.waitFor(selector, timeout?)
Wait for element to exist.

const element = await Selector.waitFor('.dynamic-content', 5000);
Selector.waitForAll(selector, minCount?, timeout?)
Wait for multiple elements.

const items = await Selector.waitForAll('.item', 5, 5000);
Cache Management
Selector.stats()             // Get cache statistics
Selector.clear()             // Clear cache
Selector.destroy()           // Destroy helper
Selector.configure(opts)     // Configure options
Selector.enableEnhancedSyntax()   // Enable enhanced syntax
Selector.disableEnhancedSyntax()  // Disable enhanced syntax
4. Enhanced Update Utility
Universal .update() method available on all elements and collections.

Element Update
const element = document.getElementById('myElement');

element.update({
  // Text content
  textContent: 'Hello',
  innerHTML: '<strong>Bold</strong>',
  innerText: 'Plain text',
  
  // Properties
  id: 'newId',
  className: 'btn btn-primary',
  value: 'input value',
  disabled: true,
  checked: true,
  
  // Styles
  style: {
    color: 'red',
    backgroundColor: '#f0f0f0',
    padding: '10px'
  },
  
  // ClassList operations
  classList: {
    add: ['active', 'visible'],
    remove: 'hidden',
    toggle: 'expanded',
    replace: ['old-class', 'new-class']
  },
  
  // Attributes
  setAttribute: ['data-role', 'button'],
  // or
  setAttribute: {
    'data-id': '123',
    'data-role': 'button'
  },
  removeAttribute: 'disabled',
  // or
  removeAttribute: ['disabled', 'readonly'],
  
  // Dataset
  dataset: {
    userId: '123',
    role: 'admin'
  },
  
  // Event listeners
  addEventListener: ['click', handleClick, { once: true }],
  // or
  addEventListener: {
    click: handleClick,
    mouseover: [handleHover, { passive: true }]
  },
  removeEventListener: ['click', oldHandler],
  
  // Methods
  focus: [],
  blur: [],
  click: [],
  scrollIntoView: [{ behavior: 'smooth' }],
  
  // Any other property
  customProperty: 'value'
});
Collection Update
const collection = Collections.ClassName.card;

collection.update({
  style: { borderColor: 'blue' },
  classList: { add: 'active' },
  dataset: { status: 'selected' }
});
Advanced Features
Smart Detection: Automatically determines if updating a property, attribute, or method
Change Detection: Only updates if value actually changed (performance optimization)
Event Handler Enhancement: Event handlers receive enhanced elements with .update() method
Method Chaining: Returns the element/collection for chaining
5. DOMHelpers Global Object
Central object providing access to all helpers.

Properties
DOMHelpers.Elements       // Elements Helper
DOMHelpers.Collections    // Collections Helper
DOMHelpers.Selector       // Selector Helper
DOMHelpers.version        // Library version: "2.3.2"
Methods
DOMHelpers.isReady()
Check if all helpers are loaded.

if (DOMHelpers.isReady()) {
  // All helpers available
}
DOMHelpers.getStats()
Get statistics from all helpers.

const stats = DOMHelpers.getStats();
// { elements: {...}, collections: {...}, selector: {...} }
DOMHelpers.clearAll()
Clear all caches.

DOMHelpers.clearAll();
DOMHelpers.destroyAll()
Destroy all helpers (cleanup).

DOMHelpers.destroyAll();
DOMHelpers.configure(options)
Configure all helpers at once.

DOMHelpers.configure({
  elements: { enableLogging: true },
  collections: { maxCacheSize: 2000 },
  selector: { enableSmartCaching: true }
});

// Or configure all with same options
DOMHelpers.configure({
  enableLogging: true,
  maxCacheSize: 2000
});

6. Enhanced createElement
Drop-in replacement for document.createElement with auto-enhancement.

Basic Usage
// Auto-enhanced elements
const button = document.createElement('button');
button.update({
  textContent: 'Click me',
  className: 'btn btn-primary',
  style: { padding: '10px' }
});

Create with Configuration
const button = document.createElement('button', {
  textContent: 'Submit',
  className: 'btn btn-primary',
  style: { padding: '10px 20px' },
  dataset: { action: 'submit' },
  addEventListener: ['click', handleClick]
});

Bulk Creation
document.createElement.bulk(definitions)
Create multiple elements at once.

const elements = document.createElement.bulk({
  header: {
    textContent: 'Welcome',
    className: 'header',
    style: { color: 'blue' }
  },
  
  button: {
    textContent: 'Click',
    classList: { add: ['btn', 'btn-primary'] },
    addEventListener: ['click', handleClick]
  },
  
  // Create multiple of same type with unique keys
  div_1: { className: 'card' },
  div_2: { className: 'card' },
  div_3: { className: 'card' }
});

// Access created elements
elements.header.update({ /* ... */ });
elements.button.disabled = true;

// Utility methods
elements.toArray();                    // Get all as array
elements.toArray('header', 'button');  // Get specific ones
elements.ordered('header', 'button');  // Same as toArray
elements.all;                          // Get all as array
elements.count;                        // Number of elements
elements.keys;                         // Array of keys
elements.has('header');                // Check if exists
elements.get('header', null);          // Get with fallback

// Update multiple
elements.updateMultiple({
  header: { style: { color: 'red' } },
  button: { disabled: true }
});

// Append to container
elements.appendTo('#container');
elements.appendToOrdered('#container', 'header', 'button');

// Array methods
elements.forEach((el, key, index) => { /* ... */ });
elements.map((el, key, index) => { /* ... */ });
elements.filter((el, key, index) => { /* ... */ });
Control Enhancement
// Disable auto-enhancement
DOMHelpers.disableCreateElementEnhancement();

// Re-enable
DOMHelpers.enableCreateElementEnhancement();

// Restore original createElement
document.createElement.restore();
7. Bulk Property Updaters
Extension methods for efficient bulk updates (automatically loaded).

Features
All bulk update methods support:

Chainable: Returns the helper for method chaining
Batch Updates: Efficient bulk operations
Type-Safe: Validates inputs
Error Handling: Warns on missing elements
Elements Bulk Methods
See Elements Helper - Bulk Updates section above.

Collections Bulk Methods
Index-based bulk updates on collections:

const cards = Collections.ClassName.card;

// Update by index
cards.textContent({
  0: 'First card',
  1: 'Second card',
  2: 'Third card'
});

cards.style({
  0: { color: 'red' },
  1: { color: 'blue' }
});

cards.classes({
  0: { add: 'featured' },
  1: { remove: 'hidden' }
});

cards.dataset({
  0: { status: 'active' },
  1: { status: 'pending' }
});
Selector Bulk Updates
See Selector Helper - Bulk Update section above.

🎯 Quick Reference Chart
| Feature | Elements | Collections | Selector | |---------|----------|-------------|----------| | Access | By ID | By class/tag/name | By CSS selector | | Caching | ✅ Intelligent | ✅ Live collections | ✅ Smart caching | | Update Method | ✅ element.update() | ✅ collection.update() | ✅ element.update() | | Bulk Updates | ✅ All properties | ✅ Index-based | ✅ Selector-based | | Auto-Enhancement | ✅ Yes | ✅ Yes | ✅ Yes | | Performance | ⚡ Excellent | ⚡ Excellent | ⚡ Excellent |

💡 Best Practices
Use the right helper:

Known IDs → Elements
Class/Tag collections → Collections
Complex selectors → Selector
Leverage caching:

// Good - cached
const header = Elements.header;

// Less efficient - not cached
const header = document.getElementById('header');
Batch updates:

// Good - single update
element.update({
  textContent: 'Hello',
  style: { color: 'red' },
  classList: { add: 'active' }
});

// Less efficient - multiple updates
element.textContent = 'Hello';
element.style.color = 'red';
element.classList.add('active');
Use bulk methods for multiple elements:

// Good
Elements.textContent({
  header: 'Welcome',
  footer: 'Copyright'
});

// Less efficient
Elements.header.textContent = 'Welcome';
Elements.footer.textContent = 'Copyright';
Clean up when done:

// Clear caches periodically if needed
DOMHelpers.clearAll();

// Destroy on page unload (automatic)
// But can be done manually:
DOMHelpers.destroyAll();
📊 Configuration Options
All helpers support these configuration options:

{
  enableLogging: false,        // Enable console logging
  autoCleanup: true,            // Auto cleanup stale cache
  cleanupInterval: 30000,       // Cleanup interval (ms)
  maxCacheSize: 1000,           // Max cache entries
  debounceDelay: 16,            // Debounce delay (ms)
  enableEnhancedSyntax: true    // Enhanced property access (Selector only)
}
Apply via:

Elements.configure({ enableLogging: true });
Collections.configure({ maxCacheSize: 2000 });
Selector.configure({ enableSmartCaching: true });

// Or all at once
DOMHelpers.configure({
  enableLogging: true,
  maxCacheSize: 2000
});
🚀 Performance Tips
Cache frequently accessed elements
Use bulk update methods when updating multiple elements
Leverage the .update() method for multiple property changes
Clean cache periodically for long-running applications
Use getRequired() for critical elements to fail fast
Library Version: 2.3.2
Status: ✅ Production Ready
Last Updated: 2025-11-09

