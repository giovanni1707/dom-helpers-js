[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers - Comprehensive Method Documentation

A high-performance vanilla JavaScript DOM utilities library with intelligent caching and over 150+ methods for effortless DOM manipulation.

**Version:** 2.3.1  
**License:** MIT

---

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Core Concepts](#core-concepts)
3. [Elements Helper Methods](#elements-helper-methods)
4. [Collections Helper Methods](#collections-helper-methods)
5. [Selector Helper Methods](#selector-helper-methods)
6. [Update System Methods](#update-system-methods)
7. [Element Creation Methods](#element-creation-methods)
8. [DOMHelpers API Methods](#domhelpers-api-methods)
9. [Configuration & Utility Methods](#configuration--utility-methods)

---

`

### Basic Usage

```javascript
// Access an element by ID
const button = Elements.myButton;

// Access elements by class name
const items = Collections.ClassName.item;

// Use CSS selectors
const header = Selector.query('#header');
```

---

## Core Concepts

The library is organized into four main helpers:

- **Elements** - Access elements by ID with caching
- **Collections** - Access elements by class, tag, or name
- **Selector** - CSS selector queries with caching
- **DOMHelpers** - Combined API for all helpers

Each element and collection has an enhanced `.update()` method for efficient DOM updates.

---

## Elements Helper Methods

The Elements helper provides ID-based DOM access with intelligent caching.

### Basic Element Access

#### `Elements[id]`

Access an element by its ID using property syntax.

**Parameters:**
- `id` (string): The element's ID attribute

**Returns:** HTMLElement or null

**Example:**
```javascript
// HTML: <button id="submitBtn">Submit</button>
const button = Elements.submitBtn;
console.log(button.textContent); // "Submit"
```

---

### Element Retrieval Methods

#### `Elements.get(id, fallback)`

Safely get an element with a fallback value if not found.

**Parameters:**
- `id` (string): The element's ID
- `fallback` (any, optional): Value to return if element not found (default: null)

**Returns:** HTMLElement or fallback value

**Example:**
```javascript
const button = Elements.get('submitBtn', document.createElement('button'));
const missing = Elements.get('nonexistent', null);
```

---

#### `Elements.exists(id)`

Check if an element exists in the DOM.

**Parameters:**
- `id` (string): The element's ID to check

**Returns:** boolean - true if element exists, false otherwise

**Example:**
```javascript
if (Elements.exists('header')) {
  console.log('Header found!');
}
```

---

#### `Elements.destructure(...ids)`

Get multiple elements by ID in a single call, returned as an object.

**Parameters:**
- `...ids` (string[]): Variable number of element IDs

**Returns:** Object with element IDs as keys and elements as values

**Example:**
```javascript
// HTML: <h1 id="title">Title</h1>
//       <p id="description">Text</p>
//       <button id="submitBtn">Submit</button>

const { title, description, submitBtn } = Elements.destructure(
  'title', 
  'description', 
  'submitBtn'
);

title.textContent = 'New Title';
description.textContent = 'New Description';
submitBtn.disabled = false;
```

---

#### `Elements.getRequired(...ids)`

Get multiple elements by ID, throwing an error if any are missing.

**Parameters:**
- `...ids` (string[]): Variable number of element IDs

**Returns:** Object with elements

**Throws:** Error if any required elements are not found

**Example:**
```javascript
try {
  const { header, footer, sidebar } = Elements.getRequired(
    'header', 
    'footer', 
    'sidebar'
  );
  // All elements guaranteed to exist here
} catch (error) {
  console.error('Missing required elements:', error.message);
}
```

---

#### `Elements.getMultiple(...ids)`

Get multiple elements by ID (alias for destructure).

**Parameters:**
- `...ids` (string[]): Variable number of element IDs

**Returns:** Object with elements

**Example:**
```javascript
const elements = Elements.getMultiple('nav', 'main', 'footer');
console.log(elements.nav, elements.main, elements.footer);
```

---

#### `Elements.waitFor(...ids)`

Asynchronously wait for elements to appear in the DOM.

**Parameters:**
- `...ids` (string[]): Variable number of element IDs

**Returns:** Promise that resolves with elements object

**Example:**
```javascript
// Wait for dynamically loaded elements
const elements = await Elements.waitFor('dynamicContent', 'lazyImage');
console.log('Elements loaded:', elements);

// With timeout handling
try {
  const { modal } = await Elements.waitFor('modal');
} catch (error) {
  console.error('Timeout waiting for modal');
}
```

---

### Element Property Methods

#### `Elements.setProperty(id, property, value)`

Set a property on an element by ID.

**Parameters:**
- `id` (string): Element ID
- `property` (string): Property name to set
- `value` (any): Value to set

**Returns:** boolean - true if successful, false otherwise

**Example:**
```javascript
Elements.setProperty('myInput', 'value', 'Hello World');
Elements.setProperty('myButton', 'disabled', true);
Elements.setProperty('myDiv', 'textContent', 'Updated text');
```

---

#### `Elements.getProperty(id, property, fallback)`

Get a property value from an element by ID.

**Parameters:**
- `id` (string): Element ID
- `property` (string): Property name to get
- `fallback` (any, optional): Fallback value if property doesn't exist

**Returns:** Property value or fallback

**Example:**
```javascript
const value = Elements.getProperty('myInput', 'value');
const text = Elements.getProperty('myDiv', 'textContent', 'Default');
const isDisabled = Elements.getProperty('myButton', 'disabled', false);
```

---

#### `Elements.setAttribute(id, attribute, value)`

Set an attribute on an element by ID.

**Parameters:**
- `id` (string): Element ID
- `attribute` (string): Attribute name
- `value` (string): Attribute value

**Returns:** boolean - true if successful, false otherwise

**Example:**
```javascript
Elements.setAttribute('myImage', 'src', 'photo.jpg');
Elements.setAttribute('myLink', 'href', 'https://example.com');
Elements.setAttribute('myInput', 'placeholder', 'Enter text...');
```

---

#### `Elements.getAttribute(id, attribute, fallback)`

Get an attribute value from an element by ID.

**Parameters:**
- `id` (string): Element ID
- `attribute` (string): Attribute name
- `fallback` (any, optional): Fallback value if attribute doesn't exist

**Returns:** Attribute value or fallback

**Example:**
```javascript
const src = Elements.getAttribute('myImage', 'src');
const href = Elements.getAttribute('myLink', 'href', '#');
const placeholder = Elements.getAttribute('myInput', 'placeholder', '');
```

---

### Bulk Update Method

#### `Elements.update(updates)`

Update multiple elements by ID in a single call.

**Parameters:**
- `updates` (Object): Object where keys are element IDs and values are update objects

**Returns:** Object with results for each element ID

**Example:**
```javascript
Elements.update({
  title: { 
    textContent: 'New Title',
    style: { color: 'blue', fontSize: '24px' }
  },
  description: { 
    textContent: 'Updated description',
    className: 'text-large'
  },
  submitBtn: { 
    textContent: 'Save Changes',
    disabled: false,
    style: { backgroundColor: 'green' }
  }
});
```

**Advanced Example with Events:**
```javascript
Elements.update({
  searchBtn: {
    textContent: 'Search',
    addEventListener: ['click', () => performSearch()],
    classList: { add: ['btn', 'btn-primary'] }
  },
  resetBtn: {
    textContent: 'Reset',
    addEventListener: {
      click: () => resetForm(),
      mouseover: () => console.log('Hover')
    }
  }
});
```

---

### Cache & Utility Methods

#### `Elements.isCached(id)`

Check if an element is currently in the cache.

**Parameters:**
- `id` (string): Element ID to check

**Returns:** boolean

**Example:**
```javascript
if (Elements.isCached('header')) {
  console.log('Header is cached');
}
```

---

#### `Elements.stats()`

Get cache statistics for the Elements helper.

**Parameters:** None

**Returns:** Object with statistics (hits, misses, cacheSize, hitRate, uptime)

**Example:**
```javascript
const stats = Elements.stats();
console.log(`Cache hit rate: ${(stats.hitRate * 100).toFixed(2)}%`);
console.log(`Cache size: ${stats.cacheSize} elements`);
console.log(`Total hits: ${stats.hits}, misses: ${stats.misses}`);
```

---

#### `Elements.clear()`

Clear the Elements cache manually.

**Parameters:** None

**Returns:** undefined

**Example:**
```javascript
// Clear cache after major DOM changes
Elements.clear();
```

---

#### `Elements.destroy()`

Destroy the Elements helper and clean up resources.

**Parameters:** None

**Returns:** undefined

**Example:**
```javascript
// Clean up before page unload
Elements.destroy();
```

---

#### `Elements.configure(options)`

Configure Elements helper options.

**Parameters:**
- `options` (Object): Configuration options

**Returns:** Elements object for chaining

**Example:**
```javascript
Elements.configure({
  enableLogging: true,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 2000
});
```

---

## Collections Helper Methods

The Collections helper provides access to elements by class name, tag name, or name attribute.

### Collection Access

#### `Collections.ClassName[className]`

Access elements by class name.

**Parameters:**
- `className` (string): The CSS class name

**Returns:** Enhanced collection (live HTMLCollection)

**Example:**
```javascript
// HTML: <div class="item">Item 1</div>
//       <div class="item">Item 2</div>

const items = Collections.ClassName.item;
console.log(items.length); // 2

// Access by index
console.log(items[0].textContent); // "Item 1"

// Iterate
items.forEach(item => {
  console.log(item.textContent);
});
```

---

#### `Collections.ClassName(className)`

Alternative function syntax for accessing elements by class name.

**Parameters:**
- `className` (string): The CSS class name

**Returns:** Enhanced collection

**Example:**
```javascript
const buttons = Collections.ClassName('btn');
const cards = Collections.ClassName('card');
```

---

#### `Collections.TagName[tagName]`

Access elements by tag name.

**Parameters:**
- `tagName` (string): HTML tag name (e.g., 'div', 'p', 'button')

**Returns:** Enhanced collection

**Example:**
```javascript
// Get all paragraphs
const paragraphs = Collections.TagName.p;

// Get all buttons
const buttons = Collections.TagName.button;

// Get all divs
const divs = Collections.TagName.div;

paragraphs.forEach(p => {
  console.log(p.textContent);
});
```

---

#### `Collections.TagName(tagName)`

Alternative function syntax for accessing elements by tag name.

**Parameters:**
- `tagName` (string): HTML tag name

**Returns:** Enhanced collection

**Example:**
```javascript
const sections = Collections.TagName('section');
const images = Collections.TagName('img');
```

---

#### `Collections.Name[name]`

Access elements by name attribute.

**Parameters:**
- `name` (string): The name attribute value

**Returns:** Enhanced collection

**Example:**
```javascript
// HTML: <input type="radio" name="gender" value="male">
//       <input type="radio" name="gender" value="female">

const genderInputs = Collections.Name.gender;
console.log(genderInputs.length); // 2

genderInputs.forEach(input => {
  console.log(input.value);
});
```

---

#### `Collections.Name(name)`

Alternative function syntax for accessing elements by name attribute.

**Parameters:**
- `name` (string): The name attribute value

**Returns:** Enhanced collection

**Example:**
```javascript
const newsletter = Collections.Name('newsletter');
const preferences = Collections.Name('preferences');
```

---

### Collection Array Methods

#### `collection.length`

Get the number of elements in the collection.

**Returns:** number

**Example:**
```javascript
const items = Collections.ClassName.item;
console.log(`Found ${items.length} items`);
```

---

#### `collection.toArray()`

Convert collection to a standard JavaScript array.

**Parameters:** None

**Returns:** Array of elements

**Example:**
```javascript
const items = Collections.ClassName.item;
const itemsArray = items.toArray();

// Now you can use all array methods
const filtered = itemsArray.filter(item => 
  item.textContent.includes('active')
);
```

---

#### `collection.forEach(callback, thisArg)`

Execute a function for each element in the collection.

**Parameters:**
- `callback` (Function): Function to execute for each element
- `thisArg` (any, optional): Value to use as `this` when executing callback

**Returns:** undefined

**Example:**
```javascript
const items = Collections.ClassName.item;

items.forEach((item, index) => {
  console.log(`Item ${index}: ${item.textContent}`);
  item.style.color = index % 2 === 0 ? 'blue' : 'red';
});
```

---

#### `collection.map(callback, thisArg)`

Create a new array with the results of calling a function on every element.

**Parameters:**
- `callback` (Function): Function that produces an element of the new array
- `thisArg` (any, optional): Value to use as `this`

**Returns:** Array of results

**Example:**
```javascript
const items = Collections.ClassName.item;

const texts = items.map(item => item.textContent);
console.log(texts); // ["Item 1", "Item 2", "Item 3"]

const heights = items.map(item => item.offsetHeight);
console.log(heights); // [50, 60, 55]
```

---

#### `collection.filter(callback, thisArg)`

Create a new array with elements that pass the test.

**Parameters:**
- `callback` (Function): Function to test each element
- `thisArg` (any, optional): Value to use as `this`

**Returns:** Array of filtered elements

**Example:**
```javascript
const items = Collections.ClassName.item;

// Filter items with specific text
const activeItems = items.filter(item => 
  item.classList.contains('active')
);

// Filter by content
const longItems = items.filter(item => 
  item.textContent.length > 20
);
```

---

#### `collection.find(callback, thisArg)`

Find the first element that satisfies the testing function.

**Parameters:**
- `callback` (Function): Function to test each element
- `thisArg` (any, optional): Value to use as `this`

**Returns:** First matching element or undefined

**Example:**
```javascript
const items = Collections.ClassName.item;

const activeItem = items.find(item => 
  item.classList.contains('active')
);

const itemWithId = items.find(item => 
  item.id === 'special-item'
);
```

---

#### `collection.some(callback, thisArg)`

Test whether at least one element passes the test.

**Parameters:**
- `callback` (Function): Function to test each element
- `thisArg` (any, optional): Value to use as `this`

**Returns:** boolean

**Example:**
```javascript
const items = Collections.ClassName.item;

const hasActive = items.some(item => 
  item.classList.contains('active')
);

if (hasActive) {
  console.log('At least one item is active');
}
```

---

#### `collection.every(callback, thisArg)`

Test whether all elements pass the test.

**Parameters:**
- `callback` (Function): Function to test each element
- `thisArg` (any, optional): Value to use as `this`

**Returns:** boolean

**Example:**
```javascript
const items = Collections.ClassName.item;

const allVisible = items.every(item => 
  item.style.display !== 'none'
);

if (allVisible) {
  console.log('All items are visible');
}
```

---

#### `collection.reduce(callback, initialValue)`

Execute a reducer function on each element, resulting in a single output value.

**Parameters:**
- `callback` (Function): Reducer function
- `initialValue` (any): Initial value for the accumulator

**Returns:** Accumulated result

**Example:**
```javascript
const items = Collections.ClassName.item;

// Sum of all heights
const totalHeight = items.reduce((sum, item) => 
  sum + item.offsetHeight, 0
);

// Concatenate all text
const allText = items.reduce((text, item) => 
  text + item.textContent + ' ', ''
);
```

---

### Collection Utility Methods

#### `collection.first()`

Get the first element in the collection.

**Parameters:** None

**Returns:** HTMLElement or null

**Example:**
```javascript
const items = Collections.ClassName.item;
const firstItem = items.first();
console.log(firstItem.textContent);
```

---

#### `collection.last()`

Get the last element in the collection.

**Parameters:** None

**Returns:** HTMLElement or null

**Example:**
```javascript
const items = Collections.ClassName.item;
const lastItem = items.last();
console.log(lastItem.textContent);
```

---

#### `collection.at(index)`

Get element at specific index (supports negative indices).

**Parameters:**
- `index` (number): Index of element (negative counts from end)

**Returns:** HTMLElement or null

**Example:**
```javascript
const items = Collections.ClassName.item;

const first = items.at(0);
const second = items.at(1);
const last = items.at(-1);
const secondLast = items.at(-2);
```

---

#### `collection.isEmpty()`

Check if collection has no elements.

**Parameters:** None

**Returns:** boolean

**Example:**
```javascript
const items = Collections.ClassName.item;

if (items.isEmpty()) {
  console.log('No items found');
} else {
  console.log(`Found ${items.length} items`);
}
```

---

#### `collection.item(index)`

Get element at index (standard HTMLCollection method).

**Parameters:**
- `index` (number): Index of element

**Returns:** HTMLElement or null

**Example:**
```javascript
const items = Collections.ClassName.item;
const secondItem = items.item(1);
```

---

### Collection DOM Manipulation Methods

#### `collection.addClass(className)`

Add a class to all elements in the collection.

**Parameters:**
- `className` (string): Class name to add

**Returns:** Collection for chaining

**Example:**
```javascript
const items = Collections.ClassName.item;

items.addClass('highlighted');
items.addClass('active').addClass('visible');
```

---

#### `collection.removeClass(className)`

Remove a class from all elements in the collection.

**Parameters:**
- `className` (string): Class name to remove

**Returns:** Collection for chaining

**Example:**
```javascript
const items = Collections.ClassName.item;

items.removeClass('hidden');
items.removeClass('active').removeClass('selected');
```

---

#### `collection.toggleClass(className)`

Toggle a class on all elements in the collection.

**Parameters:**
- `className` (string): Class name to toggle

**Returns:** Collection for chaining

**Example:**
```javascript
const items = Collections.ClassName.item;

items.toggleClass('active');
items.toggleClass('expanded');
```

---

#### `collection.setProperty(prop, value)`

Set a property on all elements in the collection.

**Parameters:**
- `prop` (string): Property name
- `value` (any): Value to set

**Returns:** Collection for chaining

**Example:**
```javascript
const inputs = Collections.TagName.input;

inputs.setProperty('disabled', true);
inputs.setProperty('value', '');
inputs.setProperty('placeholder', 'Enter text...');
```

---

#### `collection.setAttribute(attr, value)`

Set an attribute on all elements in the collection.

**Parameters:**
- `attr` (string): Attribute name
- `value` (string): Attribute value

**Returns:** Collection for chaining

**Example:**
```javascript
const images = Collections.TagName.img;

images.setAttribute('loading', 'lazy');
images.setAttribute('alt', 'Product image');
```

---

#### `collection.setStyle(styles)`

Set styles on all elements in the collection.

**Parameters:**
- `styles` (Object): Object with CSS property-value pairs

**Returns:** Collection for chaining

**Example:**
```javascript
const items = Collections.ClassName.item;

items.setStyle({
  color: 'blue',
  fontSize: '16px',
  padding: '10px',
  backgroundColor: '#f0f0f0'
});
```

---

#### `collection.on(event, handler)`

Add event listener to all elements in the collection.

**Parameters:**
- `event` (string): Event name
- `handler` (Function): Event handler function

**Returns:** Collection for chaining

**Example:**
```javascript
const buttons = Collections.ClassName.btn;

buttons.on('click', function() {
  console.log('Button clicked:', this.textContent);
});

buttons.on('mouseover', () => {
  console.log('Mouse over button');
});
```

---

#### `collection.off(event, handler)`

Remove event listener from all elements in the collection.

**Parameters:**
- `event` (string): Event name
- `handler` (Function): Event handler function to remove

**Returns:** Collection for chaining

**Example:**
```javascript
const buttons = Collections.ClassName.btn;

function handleClick() {
  console.log('Clicked');
}

buttons.on('click', handleClick);
// Later...
buttons.off('click', handleClick);
```

---

### Collection Filtering Methods

#### `collection.visible()`

Filter to only visible elements.

**Parameters:** None

**Returns:** Array of visible elements

**Example:**
```javascript
const items = Collections.ClassName.item;
const visibleItems = items.visible();

console.log(`${visibleItems.length} items are visible`);
```

---

#### `collection.hidden()`

Filter to only hidden elements.

**Parameters:** None

**Returns:** Array of hidden elements

**Example:**
```javascript
const items = Collections.ClassName.item;
const hiddenItems = items.hidden();

console.log(`${hiddenItems.length} items are hidden`);
```

---

#### `collection.enabled()`

Filter to only enabled elements.

**Parameters:** None

**Returns:** Array of enabled elements

**Example:**
```javascript
const inputs = Collections.TagName.input;
const enabledInputs = inputs.enabled();

console.log(`${enabledInputs.length} inputs are enabled`);
```

---

#### `collection.disabled()`

Filter to only disabled elements.

**Parameters:** None

**Returns:** Array of disabled elements

**Example:**
```javascript
const inputs = Collections.TagName.input;
const disabledInputs = inputs.disabled();

console.log(`${disabledInputs.length} inputs are disabled`);
```

---

### Bulk Collection Update

#### `Collections.update(updates)`

Update multiple collections in a single call.

**Parameters:**
- `updates` (Object): Object where keys are collection identifiers and values are update objects

**Returns:** Object with results

**Example:**
```javascript
Collections.update({
  'class:btn': { 
    style: { padding: '10px 20px', color: 'white' },
    classList: { add: 'enhanced' }
  },
  'tag:p': { 
    style: { lineHeight: '1.6', color: '#333' }
  },
  'name:newsletter': { 
    disabled: false,
    setAttribute: { placeholder: 'Your email...' }
  }
});
```

**Identifier formats:**
- `'class:className'` or just `'className'`
- `'tag:tagName'` or `'tagName'`
- `'name:attributeName'`

---

### Collections Utility Methods

#### `Collections.getMultiple(requests)`

Get multiple collections in one call.

**Parameters:**
- `requests` (Array): Array of request objects with `type`, `value`, and optional `as` properties

**Returns:** Object with collections

**Example:**
```javascript
const collections = Collections.getMultiple([
  { type: 'className', value: 'btn', as: 'buttons' },
  { type: 'tagName', value: 'p', as: 'paragraphs' },
  { type: 'name', value: 'color', as: 'colorInputs' }
]);

console.log(collections.buttons.length);
console.log(collections.paragraphs.length);
console.log(collections.colorInputs.length);
```

---

#### `Collections.waitFor(type, value, minCount, timeout)`

Wait for elements to appear in a collection.

**Parameters:**
- `type` (string): Collection type ('className', 'tagName', or 'name')
- `value` (string): Collection value
- `minCount` (number, optional): Minimum number of elements (default: 1)
- `timeout` (number, optional): Timeout in ms (default: 5000)

**Returns:** Promise resolving to collection

**Example:**
```javascript
// Wait for at least 3 items to load
const items = await Collections.waitFor('className', 'item', 3);
console.log(`Loaded ${items.length} items`);

// Wait for a tag to appear
const sections = await Collections.waitFor('tagName', 'section');
```

---

#### `Collections.stats()`

Get cache statistics for Collections helper.

**Parameters:** None

**Returns:** Object with statistics

**Example:**
```javascript
const stats = Collections.stats();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(2)}%`);
```

---

#### `Collections.clear()`

Clear the Collections cache.

**Parameters:** None

**Returns:** undefined

**Example:**
```javascript
Collections.clear();
```

---

#### `Collections.destroy()`

Destroy the Collections helper.

**Parameters:** None

**Returns:** undefined

**Example:**
```javascript
Collections.destroy();
```

---

#### `Collections.configure(options)`

Configure Collections helper options.

**Parameters:**
- `options` (Object): Configuration options

**Returns:** Collections object for chaining

**Example:**
```javascript
Collections.configure({
  enableLogging: true,
  autoCleanup: true,
  maxCacheSize: 2000
});
```

---

## Selector Helper Methods

The Selector helper provides CSS selector queries with intelligent caching.

### Query Methods

#### `Selector.query(selector)`

Query for a single element using CSS selector.

**Parameters:**
- `selector` (string): CSS selector

**Returns:** HTMLElement or null

**Example:**
```javascript
const header = Selector.query('#header');
const firstButton = Selector.query('.btn');
const input = Selector.query('input[type="email"]');
const nested = Selector.query('.container > .item:first-child');
```

---

#### `Selector.query[selector]`

Alternative property syntax for queries (with enhanced syntax enabled).

**Parameters:**
- `selector` (string): Converted from property name

**Returns:** HTMLElement or null

**Example:**
```javascript
// Camel case to selector conversion
const myButton = Selector.query.myButton; // #my-button
const btnPrimary = Selector.query.btnPrimary; // .btn-primary
```

---

#### `Selector.queryAll(selector)`

Query for all matching elements using CSS selector.

**Parameters:**
- `selector` (string): CSS selector

**Returns:** Enhanced NodeList collection

**Example:**
```javascript
const buttons = Selector.queryAll('.btn');
const images = Selector.queryAll('img');
const cards = Selector.queryAll('.card.active');

buttons.forEach(btn => {
  console.log(btn.textContent);
});
```

---

#### `Selector.queryAll[selector]`

Alternative property syntax for queryAll (with enhanced syntax enabled).

**Parameters:**
- `selector` (string): Converted from property name

**Returns:** Enhanced NodeList collection

**Example:**
```javascript
const items = Selector.queryAll.item; // .item
const paragraphs = Selector.queryAll.p; // p
```

---

### Scoped Query Methods

#### `Selector.Scoped.within(container, selector)`

Query within a specific container element.

**Parameters:**
- `container` (Element|string): Container element or selector
- `selector` (string): CSS selector to query within container

**Returns:** HTMLElement or null

**Example:**
```javascript
// Query within a specific container
const sidebar = document.querySelector('.sidebar');
const sidebarBtn = Selector.Scoped.within(sidebar, '.btn');

// Using selector for container
const item = Selector.Scoped.within('#container', '.item');
```

---

#### `Selector.Scoped.withinAll(container, selector)`

Query all elements within a specific container.

**Parameters:**
- `container` (Element|string): Container element or selector
- `selector` (string): CSS selector to query within container

**Returns:** Enhanced NodeList collection

**Example:**
```javascript
const sidebar = document.querySelector('.sidebar');
const sidebarItems = Selector.Scoped.withinAll(sidebar, '.item');

// Using selector for container
const cards = Selector.Scoped.withinAll('.container', '.card');
```

---

### Selector Bulk Update

#### `Selector.update(updates)`

Update multiple elements/collections using CSS selectors in a single call.

**Parameters:**
- `updates` (Object): Object where keys are CSS selectors and values are update objects

**Returns:** Object with results

**Example:**
```javascript
Selector.update({
  '#header': { 
    textContent: 'Welcome!',
    style: { fontSize: '24px', color: '#333' }
  },
  '.btn': { 
    style: { padding: '10px 20px', backgroundColor: 'blue' },
    classList: { add: 'enhanced' }
  },
  'input[type="text"]': { 
    placeholder: 'Enter text...',
    style: { borderColor: '#ddd' }
  }
});
```

---

### Selector Utility Methods

#### `Selector.waitFor(selector, timeout)`

Wait for an element matching the selector to appear.

**Parameters:**
- `selector` (string): CSS selector
- `timeout` (number, optional): Timeout in ms (default: 5000)

**Returns:** Promise resolving to element

**Example:**
```javascript
// Wait for dynamic content
const modal = await Selector.waitFor('#modal');
console.log('Modal appeared!');

// With custom timeout
const header = await Selector.waitFor('.header', 10000);
```

---

#### `Selector.waitForAll(selector, minCount, timeout)`

Wait for elements matching the selector to appear.

**Parameters:**
- `selector` (string): CSS selector
- `minCount` (number, optional): Minimum number of elements (default: 1)
- `timeout` (number, optional): Timeout in ms (default: 5000)

**Returns:** Promise resolving to collection

**Example:**
```javascript
// Wait for at least 5 items
const items = await Selector.waitForAll('.item', 5);
console.log(`Loaded ${items.length} items`);
```

---

#### `Selector.stats()`

Get cache statistics for Selector helper.

**Parameters:** None

**Returns:** Object with statistics

**Example:**
```javascript
const stats = Selector.stats();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(2)}%`);
console.log('Selector breakdown:', stats.selectorBreakdown);
```

---

#### `Selector.clear()`

Clear the Selector cache.

**Parameters:** None

**Returns:** undefined

**Example:**
```javascript
Selector.clear();
```

---

#### `Selector.destroy()`

Destroy the Selector helper.

**Parameters:** None

**Returns:** undefined

**Example:**
```javascript
Selector.destroy();
```

---

#### `Selector.enableEnhancedSyntax()`

Enable enhanced property syntax for queries.

**Parameters:** None

**Returns:** Selector object for chaining

**Example:**
```javascript
Selector.enableEnhancedSyntax();
const btn = Selector.query.myButton; // Now works
```

---

#### `Selector.disableEnhancedSyntax()`

Disable enhanced property syntax.

**Parameters:** None

**Returns:** Selector object for chaining

**Example:**
```javascript
Selector.disableEnhancedSyntax();
```

---

#### `Selector.configure(options)`

Configure Selector helper options.

**Parameters:**
- `options` (Object): Configuration options

**Returns:** Selector object for chaining

**Example:**
```javascript
Selector.configure({
  enableLogging: true,
  enableSmartCaching: true,
  maxCacheSize: 2000
});
```

---

## Update System Methods

Every element and collection has an enhanced `.update()` method for efficient DOM manipulation.

### Element Update Method

#### `element.update(updates)`

Update a single element with multiple properties in one call.

**Parameters:**
- `updates` (Object): Object with properties to update

**Returns:** Element for chaining

**Example:**
```javascript
const button = Elements.myButton;

button.update({
  textContent: 'Click Me',
  disabled: false,
  className: 'btn btn-primary',
  style: {
    padding: '10px 20px',
    backgroundColor: 'blue',
    color: 'white'
  }
});
```

---

### Update Properties

#### `textContent` / `innerText`

Update the text content of an element.

**Example:**
```javascript
element.update({
  textContent: 'New text content'
});
```

---

#### `innerHTML`

Update the HTML content of an element.

**Example:**
```javascript
element.update({
  innerHTML: '<strong>Bold text</strong> and <em>italic</em>'
});
```

---

#### `style`

Update CSS styles using an object.

**Example:**
```javascript
element.update({
  style: {
    color: 'red',
    fontSize: '16px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd'
  }
});
```

---

#### `classList`

Manipulate CSS classes using methods.

**Example:**
```javascript
element.update({
  classList: {
    add: ['class1', 'class2'],        // Add multiple classes
    remove: ['old-class'],             // Remove classes
    toggle: 'active',                  // Toggle a class
    replace: ['old', 'new']           // Replace a class
  }
});
```

---

#### `setAttribute`

Set HTML attributes using object or array format.

**Example:**
```javascript
// Object format (multiple attributes)
element.update({
  setAttribute: {
    src: 'image.jpg',
    alt: 'Description',
    'data-id': '123'
  }
});

// Array format (single attribute)
element.update({
  setAttribute: ['href', 'https://example.com']
});
```

---

#### `removeAttribute`

Remove HTML attributes.

**Example:**
```javascript
element.update({
  removeAttribute: ['disabled', 'hidden']
});

// Or single attribute
element.update({
  removeAttribute: 'disabled'
});
```

---

#### `getAttribute`

Get an attribute value (mainly for debugging).

**Example:**
```javascript
element.update({
  getAttribute: 'data-id'
});
// Logs the value to console
```

---

#### `dataset`

Set data attributes.

**Example:**
```javascript
element.update({
  dataset: {
    userId: '123',
    action: 'submit',
    timestamp: Date.now()
  }
});

// Access: element.dataset.userId
```

---

#### `addEventListener`

Add event listeners.

**Example:**
```javascript
// Array format: [eventType, handler, options]
element.update({
  addEventListener: ['click', (e) => {
    console.log('Clicked!');
  }, { once: true }]
});

// Object format (multiple events)
element.update({
  addEventListener: {
    click: () => console.log('Clicked'),
    mouseover: () => console.log('Hover'),
    focus: [(e) => console.log('Focused'), { passive: true }]
  }
});
```

---

#### `removeEventListener`

Remove event listeners.

**Example:**
```javascript
function handleClick(e) {
  console.log('Clicked');
}

// Add listener
element.addEventListener('click', handleClick);

// Remove listener
element.update({
  removeEventListener: ['click', handleClick]
});
```

---

### Collection Update Method

#### `collection.update(updates)`

Update all elements in a collection with the same properties.

**Parameters:**
- `updates` (Object): Object with properties to update

**Returns:** Collection for chaining

**Example:**
```javascript
const items = Collections.ClassName.item;

items.update({
  style: {
    padding: '15px',
    margin: '10px 0',
    backgroundColor: '#f5f5f5'
  },
  classList: {
    add: 'enhanced'
  },
  dataset: {
    processed: 'true'
  }
});
```

---

### Update with Method Calls

You can call DOM methods through the update system.

**Example:**
```javascript
element.update({
  focus: [],                           // Call focus()
  click: [],                           // Call click()
  scrollIntoView: [{ behavior: 'smooth' }], // With arguments
  blur: []                             // Call blur()
});
```

---

### Fine-Grained Updates

The update system includes fine-grained change detection:

- Only updates changed properties
- Prevents duplicate event listeners
- Compares values before updating
- Tracks previous state

**Example:**
```javascript
// First update
element.update({ textContent: 'Hello' });

// Second update (no DOM change, same value)
element.update({ textContent: 'Hello' }); // Skipped!

// Third update (DOM change, different value)
element.update({ textContent: 'World' }); // Applied!
```

---

## Element Creation Methods

Create and configure elements with ease.

### createElement Function

#### `createElement(tagName, options)`

Create a new element (optionally enhanced with .update()).

**Parameters:**
- `tagName` (string): HTML tag name
- `options` (Object, optional): Element options

**Returns:** HTMLElement

**Example:**
```javascript
// Basic creation
const div = createElement('div');
const button = createElement('button');

// With options
const input = createElement('input', { is: 'custom-input' });
```

---

### Bulk Element Creation

#### `createElement.bulk(definitions)`

Create multiple elements with configurations in a single call.

**Parameters:**
- `definitions` (Object): Object where keys are tag names (with optional suffixes) and values are config objects

**Returns:** Object with created elements and helper methods

**Example:**
```javascript
const elements = createElement.bulk({
  H1: { 
    textContent: 'Welcome',
    style: { fontSize: '32px', color: '#333' }
  },
  P: { 
    textContent: 'Description text',
    className: 'description'
  },
  DIV_1: { 
    className: 'container',
    style: { padding: '20px' }
  },
  DIV_2: { 
    className: 'sidebar'
  },
  BUTTON: {
    textContent: 'Submit',
    className: 'btn btn-primary',
    addEventListener: ['click', () => console.log('Clicked!')]
  }
});

// Access elements
elements.H1.textContent = 'New Title';
elements.P.style.color = 'blue';
elements.DIV_1.appendChild(elements.P);

// Use helper methods
console.log(elements.count); // 5
console.log(elements.keys); // ['H1', 'P', 'DIV_1', 'DIV_2', 'BUTTON']
```

---

### Bulk Creation Helper Methods

#### `elements.all`

Get all created elements as an array (getter).

**Returns:** Array of elements

**Example:**
```javascript
const elements = createElement.bulk({ DIV: {}, P: {}, SPAN: {} });
console.log(elements.all); // [div, p, span]
```

---

#### `elements.toArray(...tagNames)`

Get specific elements as an array in specified order.

**Parameters:**
- `...tagNames` (string[]): Element keys to retrieve

**Returns:** Array of elements

**Example:**
```javascript
const elements = createElement.bulk({
  H1: {},
  P: {},
  DIV: {},
  BUTTON: {}
});

const ordered = elements.toArray('H1', 'P', 'BUTTON');
// Returns [h1, p, button] in that order

const all = elements.toArray();
// Returns all elements in creation order
```

---

#### `elements.ordered(...tagNames)`

Get elements in specified order (alias for toArray).

**Parameters:**
- `...tagNames` (string[]): Element keys

**Returns:** Array of elements

**Example:**
```javascript
const ordered = elements.ordered('BUTTON', 'H1', 'P');
```

---

#### `elements.count`

Get the number of created elements (getter).

**Returns:** number

**Example:**
```javascript
console.log(elements.count); // 5
```

---

#### `elements.keys`

Get array of all element keys (getter).

**Returns:** Array of strings

**Example:**
```javascript
console.log(elements.keys); // ['H1', 'P', 'DIV_1', 'DIV_2']
```

---

#### `elements.has(key)`

Check if an element exists by key.

**Parameters:**
- `key` (string): Element key to check

**Returns:** boolean

**Example:**
```javascript
if (elements.has('H1')) {
  console.log('H1 element exists');
}
```

---

#### `elements.get(key, fallback)`

Get element by key with fallback.

**Parameters:**
- `key` (string): Element key
- `fallback` (any, optional): Fallback value

**Returns:** Element or fallback

**Example:**
```javascript
const title = elements.get('H1', document.createElement('h1'));
const missing = elements.get('NONEXISTENT', null);
```

---

#### `elements.forEach(callback)`

Execute a callback for each element.

**Parameters:**
- `callback` (Function): Function(element, key, index)

**Returns:** undefined

**Example:**
```javascript
elements.forEach((element, key, index) => {
  console.log(`${index}: ${key} =>`, element.tagName);
  element.style.margin = '10px';
});
```

---

#### `elements.map(callback)`

Map over elements.

**Parameters:**
- `callback` (Function): Function(element, key, index)

**Returns:** Array of results

**Example:**
```javascript
const tagNames = elements.map((element, key) => element.tagName);
console.log(tagNames); // ['H1', 'P', 'DIV', 'BUTTON']
```

---

#### `elements.filter(callback)`

Filter elements.

**Parameters:**
- `callback` (Function): Function(element, key, index)

**Returns:** Array of filtered elements

**Example:**
```javascript
const divs = elements.filter((element) => element.tagName === 'DIV');
console.log(divs.length);
```

---

#### `elements.updateMultiple(updates)`

Update multiple elements at once.

**Parameters:**
- `updates` (Object): Object where keys are element keys and values are update objects

**Returns:** Elements object for chaining

**Example:**
```javascript
elements.updateMultiple({
  H1: { textContent: 'New Title', style: { color: 'blue' } },
  P: { textContent: 'New paragraph', className: 'text-large' },
  BUTTON: { disabled: false, textContent: 'Click Me' }
});
```

---

#### `elements.appendTo(container)`

Append all elements to a container.

**Parameters:**
- `container` (Element|string): Container element or selector

**Returns:** Elements object for chaining

**Example:**
```javascript
// Append all to document body
elements.appendTo(document.body);

// Append to specific element
elements.appendTo('#container');

// Chaining
elements.updateMultiple({...}).appendTo('.main');
```

---

#### `elements.appendToOrdered(container, ...tagNames)`

Append specific elements to a container in order.

**Parameters:**
- `container` (Element|string): Container element or selector
- `...tagNames` (string[]): Element keys to append

**Returns:** Elements object for chaining

**Example:**
```javascript
// Append in specific order
elements.appendToOrdered('#container', 'H1', 'P', 'BUTTON');

// Different from creation order
elements.appendToOrdered('.sidebar', 'BUTTON', 'H1');
```

---

### Element Creation with Configuration

You can configure elements during bulk creation:

**Example:**
```javascript
const form = createElement.bulk({
  FORM: {
    id: 'myForm',
    className: 'form',
    setAttribute: { method: 'post', action: '/submit' }
  },
  INPUT_email: {
    type: 'email',
    name: 'email',
    placeholder: 'Your email',
    required: true,
    className: 'form-input'
  },
  INPUT_password: {
    type: 'password',
    name: 'password',
    placeholder: 'Password',
    required: true,
    className: 'form-input'
  },
  BUTTON: {
    type: 'submit',
    textContent: 'Submit',
    className: 'btn btn-primary',
    addEventListener: {
      click: (e) => {
        e.preventDefault();
        console.log('Form submitted!');
      }
    }
  }
});

// Assemble form
form.FORM.appendChild(form.INPUT_email);
form.FORM.appendChild(form.INPUT_password);
form.FORM.appendChild(form.BUTTON);

// Or use helper
form.appendToOrdered(form.FORM, 'INPUT_email', 'INPUT_password', 'BUTTON');
form.FORM.appendTo(document.body);
```

---

## DOMHelpers API Methods

The DOMHelpers object provides a unified API for all helpers.

### Access Helpers

#### `DOMHelpers.Elements`

Access the Elements helper.

**Example:**
```javascript
const button = DOMHelpers.Elements.myButton;
```

---

#### `DOMHelpers.Collections`

Access the Collections helper.

**Example:**
```javascript
const items = DOMHelpers.Collections.ClassName.item;
```

---

#### `DOMHelpers.Selector`

Access the Selector helper.

**Example:**
```javascript
const header = DOMHelpers.Selector.query('#header');
```

---

### Utility Methods

#### `DOMHelpers.isReady()`

Check if all helpers are available.

**Parameters:** None

**Returns:** boolean

**Example:**
```javascript
if (DOMHelpers.isReady()) {
  console.log('All helpers are ready!');
}
```

---

#### `DOMHelpers.version`

Get the library version.

**Example:**
```javascript
console.log(DOMHelpers.version); // "2.3.1"
```

---

#### `DOMHelpers.getStats()`

Get combined statistics from all helpers.

**Parameters:** None

**Returns:** Object with stats from each helper

**Example:**
```javascript
const stats = DOMHelpers.getStats();
console.log('Elements:', stats.elements);
console.log('Collections:', stats.collections);
console.log('Selector:', stats.selector);
```

---

#### `DOMHelpers.clearAll()`

Clear all caches from all helpers.

**Parameters:** None

**Returns:** undefined

**Example:**
```javascript
// Clear everything after major DOM changes
DOMHelpers.clearAll();
```

---

#### `DOMHelpers.destroyAll()`

Destroy all helpers and clean up resources.

**Parameters:** None

**Returns:** undefined

**Example:**
```javascript
// Clean up before page unload
window.addEventListener('beforeunload', () => {
  DOMHelpers.destroyAll();
});
```

---

#### `DOMHelpers.configure(options)`

Configure all helpers at once.

**Parameters:**
- `options` (Object): Configuration options for all helpers

**Returns:** DOMHelpers object for chaining

**Example:**
```javascript
DOMHelpers.configure({
  enableLogging: true,
  autoCleanup: true,
  maxCacheSize: 2000,
  
  // Helper-specific options
  elements: {
    cleanupInterval: 20000
  },
  collections: {
    enableEnhancedSyntax: true
  },
  selector: {
    enableSmartCaching: true
  }
});
```

---

### createElement Enhancement

#### `DOMHelpers.enableCreateElementEnhancement()`

Enable automatic enhancement of document.createElement.

**Parameters:** None

**Returns:** DOMHelpers object for chaining

**Example:**
```javascript
DOMHelpers.enableCreateElementEnhancement();

// Now all createElement calls return enhanced elements
const div = document.createElement('div');
div.update({ textContent: 'Hello' }); // Works!
```

---

#### `DOMHelpers.disableCreateElementEnhancement()`

Disable automatic enhancement of document.createElement.

**Parameters:** None

**Returns:** DOMHelpers object for chaining

**Example:**
```javascript
DOMHelpers.disableCreateElementEnhancement();
```

---

## Configuration & Utility Methods

### Global Configuration Options

All helpers support these common configuration options:

```javascript
{
  enableLogging: false,          // Enable console logging
  autoCleanup: true,             // Automatic cache cleanup
  cleanupInterval: 30000,        // Cleanup interval in ms
  maxCacheSize: 1000,           // Maximum cache entries
  debounceDelay: 16,            // Debounce delay for mutations (ms)
}
```

---

### Elements-Specific Options

```javascript
Elements.configure({
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 1000
});
```

---

### Collections-Specific Options

```javascript
Collections.configure({
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 1000,
  enableEnhancedSyntax: true    // Enable property access syntax
});
```

---

### Selector-Specific Options

```javascript
Selector.configure({
  enableLogging: false,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 1000,
  enableSmartCaching: true,     // Smart cache invalidation
  enableEnhancedSyntax: true    // Enhanced property syntax
});
```

---

## Complete Usage Examples

### Example 1: Building a Todo App

```javascript
// Create elements
const app = createElement.bulk({
  CONTAINER: { className: 'todo-app' },
  H1: { textContent: 'My Todo List' },
  INPUT: { 
    type: 'text',
    placeholder: 'Add a new task...',
    className: 'todo-input'
  },
  BUTTON: { 
    textContent: 'Add Task',
    className: 'btn btn-primary'
  },
  UL: { className: 'todo-list' }
});

// Assemble app
app.appendToOrdered(app.CONTAINER, 'H1', 'INPUT', 'BUTTON', 'UL');
app.CONTAINER.appendTo(document.body);

// Add functionality
app.BUTTON.addEventListener('click', () => {
  const task = app.INPUT.value.trim();
  if (task) {
    const li = createElement('li');
    li.update({
      textContent: task,
      className: 'todo-item',
      addEventListener: {
        click: function() {
          this.update({
            classList: { toggle: 'completed' }
          });
        }
      }
    });
    app.UL.appendChild(li);
    app.INPUT.value = '';
  }
});
```

---

### Example 2: Dynamic Content Loading

```javascript
async function loadContent() {
  // Show loading state
  Elements.container.update({
    innerHTML: '<div class="spinner">Loading...</div>'
  });
  
  // Wait for data
  const data = await fetchData();
  
  // Wait for container to be ready
  await Elements.waitFor('container');
  
  // Create items
  const items = data.map(item => {
    const div = createElement('div');
    div.update({
      className: 'item',
      dataset: { id: item.id },
      innerHTML: `
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      `,
      addEventListener: {
        click: () => handleItemClick(item.id)
      }
    });
    return div;
  });
  
  // Clear and append
  Elements.container.innerHTML = '';
  items.forEach(item => Elements.container.appendChild(item));
}
```

---

### Example 3: Form Validation

```javascript
// Get all form inputs
const inputs = Collections.TagName.input;

// Add validation
inputs.forEach(input => {
  input.update({
    addEventListener: {
      blur: function() {
        const isValid = this.checkValidity();
        this.update({
          classList: {
            add: isValid ? 'valid' : 'invalid',
            remove: isValid ? 'invalid' : 'valid'
          },
          setAttribute: {
            'aria-invalid': !isValid
          }
        });
      },
      input: function() {
        // Remove error on input
        this.update({
          classList: { remove: 'invalid' }
        });
      }
    }
  });
});

// Form submit
Elements.myForm.update({
  addEventListener: ['submit', (e) => {
    e.preventDefault();
    
    const allValid = inputs.every(input => input.checkValidity());
    
    if (allValid) {
      submitForm();
    } else {
      showErrors();
    }
  }]
});
```

---

### Example 4: Bulk Updates

```javascript
// Update multiple elements by ID
Elements.update({
  header: {
    textContent: 'Dashboard',
    style: { backgroundColor: '#333', color: 'white' }
  },
  subheader: {
    textContent: 'Welcome back!',
    style: { fontSize: '18px' }
  },
  notification: {
    textContent: '5 new messages',
    classList: { add: 'badge' }
  }
});

// Update collections
Collections.update({
  'class:btn': {
    style: { padding: '12px 24px' },
    classList: { add: 'enhanced' }
  },
  'tag:img': {
    setAttribute: { loading: 'lazy' },
    style: { maxWidth: '100%' }
  }
});

// Update by selector
Selector.update({
  '.card': {
    style: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
  },
  'button.primary': {
    style: { backgroundColor: '#007bff', color: 'white' }
  }
});
```

---

## Performance Tips

1. **Use Caching**: The library automatically caches elements - reuse references when possible
2. **Bulk Operations**: Use bulk update methods for multiple elements
3. **Event Delegation**: For dynamic content, consider event delegation
4. **Configuration**: Adjust cache size and cleanup intervals based on your needs
5. **Smart Queries**: Use specific selectors to improve cache hit rates

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required
- Proxy support required
- MutationObserver support required

---

## License

MIT License - See LICENSE file for details

---

## Support

For issues, questions, or contributions, visit the GitHub repository.

---

**End of Documentation**

