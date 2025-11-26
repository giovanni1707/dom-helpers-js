# DOM Helpers Enhancers Module - Complete Method Reference

## 📦 Module Overview
The Enhancers module (`02_dh-enhancers.js`) extends DOM Helpers with powerful bulk property update methods, providing streamlined syntax for updating multiple elements simultaneously across Elements, Collections, and Selector helpers.

---

## 🎯 Bulk Property Updaters (Elements Helper)

### Text Content Methods
Updates text content across multiple elements by ID.

#### `Elements.textContent(updates)`
```javascript
Elements.textContent({
  title: 'New Title',
  description: 'New Description',
  footer: 'Footer Text'
});
```

#### `Elements.innerHTML(updates)`
```javascript
Elements.innerHTML({
  content: '<strong>Bold</strong> text',
  sidebar: '<ul><li>Item</li></ul>'
});
```

#### `Elements.innerText(updates)`
```javascript
Elements.innerText({
  label: 'Display Text',
  status: 'Active'
});
```

---

### Form Control Methods

#### `Elements.value(updates)`
```javascript
Elements.value({
  username: 'john_doe',
  email: 'john@example.com',
  age: '25'
});
```

#### `Elements.placeholder(updates)`
```javascript
Elements.placeholder({
  searchBox: 'Search...',
  emailInput: 'Enter email',
  phoneInput: 'XXX-XXX-XXXX'
});
```

#### `Elements.disabled(updates)`
```javascript
Elements.disabled({
  submitBtn: true,
  cancelBtn: false,
  resetBtn: false
});
```

#### `Elements.checked(updates)`
```javascript
Elements.checked({
  agreeCheckbox: true,
  notifyCheckbox: false,
  subscribeCheckbox: true
});
```

#### `Elements.readonly(updates)`
```javascript
Elements.readonly({
  userId: true,
  timestamp: true,
  editableField: false
});
```

#### `Elements.selected(updates)`
```javascript
Elements.selected({
  option1: true,
  option2: false
});
```

---

### Visibility & State Methods

#### `Elements.hidden(updates)`
```javascript
Elements.hidden({
  errorMsg: false,  // Show
  loadingSpinner: true,  // Hide
  successMsg: false  // Show
});
```

#### `Elements.title(updates)`
```javascript
Elements.title({
  saveBtn: 'Click to save',
  helpIcon: 'Get help',
  closeBtn: 'Close window'
});
```

---

### Media Methods

#### `Elements.src(updates)`
```javascript
Elements.src({
  mainImage: 'photos/hero.jpg',
  thumbnail: 'photos/thumb.jpg',
  avatar: 'users/avatar.png'
});
```

#### `Elements.href(updates)`
```javascript
Elements.href({
  homeLink: '/home',
  profileLink: '/user/profile',
  logoutLink: '/logout'
});
```

#### `Elements.alt(updates)`
```javascript
Elements.alt({
  profilePic: 'User profile picture',
  logo: 'Company logo',
  banner: 'Hero banner image'
});
```

---

### Style Methods

#### `Elements.style(updates)`
Bulk style updates across multiple elements.
```javascript
Elements.style({
  header: { 
    backgroundColor: '#333', 
    color: 'white',
    padding: '20px' 
  },
  sidebar: { 
    width: '250px', 
    borderRight: '1px solid #ccc' 
  },
  footer: { 
    textAlign: 'center',
    padding: '10px' 
  }
});
```

---

### Data Attribute Methods

#### `Elements.dataset(updates)`
Bulk dataset updates.
```javascript
Elements.dataset({
  userCard: { 
    userId: '123', 
    userName: 'John',
    userRole: 'admin' 
  },
  productCard: { 
    productId: '456', 
    price: '99.99',
    stock: '50' 
  }
});
```

---

### Attribute Methods

#### `Elements.attrs(updates)`
Bulk attribute updates (including removal).
```javascript
Elements.attrs({
  submitBtn: { 
    disabled: true,      // Set attribute
    'aria-label': 'Submit form',
    'data-action': 'submit' 
  },
  link: { 
    href: '/new-page',
    target: '_blank',
    rel: 'noopener'
  },
  input: {
    disabled: null  // Remove attribute
  }
});
```

---

### Class Methods

#### `Elements.classes(updates)`
Bulk class list operations.
```javascript
Elements.classes({
  button: {
    add: ['active', 'primary'],
    remove: 'disabled'
  },
  card: {
    toggle: 'expanded'
  },
  nav: {
    replace: ['old-theme', 'new-theme']
  },
  // Or simple string for direct className assignment
  box: 'container fluid center'
});
```

---

### Generic Property Method

#### `Elements.prop(propertyPath, updates)`
Update any element property, including nested properties.
```javascript
// Simple property
Elements.prop('disabled', {
  btn1: true,
  btn2: false
});

// Nested property (dot notation)
Elements.prop('style.color', {
  title: 'red',
  subtitle: 'blue'
});

Elements.prop('dataset.userId', {
  card1: '123',
  card2: '456'
});
```

---

## 🎯 Collection Updaters (Index-Based)

### Collection Text Content Methods
All text content methods work with numeric indices.

#### `collection.textContent(updates)`
```javascript
ClassName.buttons.textContent({
  0: 'First Button',
  1: 'Second Button',
  2: 'Third Button',
  [-1]: 'Last Button'  // Negative indices supported
});
```

#### `collection.innerHTML(updates)`
```javascript
TagName.div.innerHTML({
  0: '<strong>First</strong>',
  1: '<em>Second</em>',
  2: '<u>Third</u>'
});
```

#### `collection.value(updates)`
```javascript
TagName.input.value({
  0: 'Value 1',
  1: 'Value 2',
  2: 'Value 3'
});
```

---

### Collection Style Methods

#### `collection.style(updates)`
```javascript
ClassName.cards.style({
  0: { backgroundColor: 'red', padding: '10px' },
  1: { backgroundColor: 'blue', padding: '15px' },
  2: { backgroundColor: 'green', padding: '20px' }
});
```

---

### Collection Dataset Methods

#### `collection.dataset(updates)`
```javascript
ClassName.items.dataset({
  0: { itemId: '1', status: 'active' },
  1: { itemId: '2', status: 'pending' },
  2: { itemId: '3', status: 'complete' }
});
```

---

### Collection Class Methods

#### `collection.classes(updates)`
```javascript
TagName.button.classes({
  0: { add: 'primary', remove: 'secondary' },
  1: { toggle: 'active' },
  2: 'new-class-name'  // Direct className
});
```

---

## 🌍 Global Shortcuts

### ClassName, TagName, Name Proxies
Enhanced global shortcuts with index support and bulk updates.

#### Access Patterns
```javascript
// Property access
ClassName.button      // Get all buttons
ClassName.button[0]   // First button
ClassName.button[1]   // Second button
ClassName.button[-1]  // Last button

// Function call
ClassName('button')   // Get all buttons
TagName('div')        // Get all divs
Name('username')      // Get by name attribute
```

#### Index Support
```javascript
// Positive indices
ClassName.button[0].textContent = 'First';
ClassName.button[1].textContent = 'Second';

// Negative indices (from end)
ClassName.button[-1].textContent = 'Last';
ClassName.button[-2].textContent = 'Second to Last';
```

#### Update Methods
All collections from global shortcuts support the bulk update methods:
```javascript
ClassName.button.update({
  0: { textContent: 'First', style: { color: 'red' } },
  1: { textContent: 'Second', style: { color: 'blue' } }
});
```

---

## 🔍 Global Query Functions

### querySelector/querySelectorAll Enhancements

#### `querySelector(selector)` / `query(selector)`
Enhanced single element query with `.update()` support.
```javascript
const element = querySelector('#myElement');
// or
const element = query('#myElement');

element.update({
  textContent: 'New Text',
  style: { color: 'red' }
});
```

#### `querySelectorAll(selector)` / `queryAll(selector)`
Enhanced collection query with bulk updates.
```javascript
const elements = querySelectorAll('.items');
// or
const elements = queryAll('.items');

// Index-based updates
elements.update({
  0: { textContent: 'First' },
  1: { textContent: 'Second' }
});

// Bulk property updates
elements.textContent({
  0: 'First Item',
  1: 'Second Item',
  2: 'Third Item'
});
```

#### `queryWithin(container, selector)`
Scoped single element query.
```javascript
const element = queryWithin('#container', '.item');
```

#### `queryAllWithin(container, selector)`
Scoped collection query.
```javascript
const elements = queryAllWithin('#container', '.items');
```

---

## 📊 Enhanced Collections Features

### Array Methods
All enhanced collections support standard array methods:
- `.forEach(callback)`
- `.map(callback)`
- `.filter(callback)`
- `.find(callback)`
- `.findIndex(callback)`
- `.some(callback)`
- `.every(callback)`
- `.reduce(callback, initial)`
- `.slice(start, end)`

### Utility Methods
- `.first()` - Get first element
- `.last()` - Get last element
- `.at(index)` - Get element at index (negative supported)
- `.isEmpty()` - Check if empty
- `.toArray()` - Convert to plain array

### DOM Helper Methods
- `.addClass(className)`
- `.removeClass(className)`
- `.toggleClass(className)`
- `.setProperty(prop, value)`
- `.setAttribute(attr, value)`
- `.setStyle(styles)`
- `.on(event, handler)`
- `.off(event, handler)`

---

## 🎨 Indexed Updates Feature

### Index Selection Pattern
Update specific elements by index across all helpers.

#### Elements (Not Applicable)
Elements helper uses IDs, not indices.

#### Collections & Selector
```javascript
// Basic index updates
collection.update({
  0: { textContent: 'First' },
  1: { textContent: 'Second' },
  [-1]: { textContent: 'Last' }
});

// Mixed with bulk updates
collection.update({
  // Bulk: applies to ALL
  style: { padding: '10px' },
  
  // Index-specific: applies to specific elements
  0: { textContent: 'Special First', style: { color: 'red' } },
  1: { textContent: 'Special Second', style: { color: 'blue' } }
});
```

### Negative Index Support
```javascript
collection.update({
  [-1]: { textContent: 'Last Element' },
  [-2]: { textContent: 'Second to Last' }
});
```

---

## 🔧 Configuration & Utilities

### Version Information
```javascript
// Check versions
GlobalCollectionShortcuts.version  // "2.0.1"
GlobalQuery.version                // "1.0.1"
IndexedUpdates.version             // "1.1.0"
```

### Feature Detection
```javascript
// Check if indexed updates supported
IndexedUpdates.hasSupport(collection);  // true/false

// Check if collection enhanced
IndexSelection.isEnhanced(collection);  // true/false
```

### Manual Enhancement
```javascript
// Enhance collection manually
IndexedUpdates.patch(collection);

// Enhance element manually
IndexSelection.enhanceElement(element);
```

---

## 📋 Complete Method Summary

### Elements Helper Methods (19)
1. `textContent(updates)`
2. `innerHTML(updates)`
3. `innerText(updates)`
4. `value(updates)`
5. `placeholder(updates)`
6. `title(updates)`
7. `disabled(updates)`
8. `checked(updates)`
9. `readonly(updates)`
10. `hidden(updates)`
11. `selected(updates)`
12. `src(updates)`
13. `href(updates)`
14. `alt(updates)`
15. `style(updates)`
16. `dataset(updates)`
17. `attrs(updates)`
18. `classes(updates)`
19. `prop(propertyPath, updates)`

### Collection Instance Methods (19)
Same as Elements, but with index-based updates:
1-19. All methods from Elements helper

### Global Shortcuts (3 proxies)
1. `ClassName` - With index support `[0]`, `[-1]`
2. `TagName` - With index support `[0]`, `[-1]`
3. `Name` - With index support `[0]`, `[-1]`

### Global Query Functions (4)
1. `querySelector(selector)` / `query(selector)`
2. `querySelectorAll(selector)` / `queryAll(selector)`
3. `queryWithin(container, selector)`
4. `queryAllWithin(container, selector)`

### Collection Enhancement Methods (15+)
- Array methods: `forEach`, `map`, `filter`, `find`, `findIndex`, `some`, `every`, `reduce`, `slice`
- Utility: `first`, `last`, `at`, `isEmpty`, `toArray`
- DOM helpers: `addClass`, `removeClass`, `toggleClass`, `setProperty`, `setAttribute`, `setStyle`, `on`, `off`

---

## 🎯 Design Philosophy

### Consistency
All bulk updaters follow the same pattern:
```javascript
Helper.property({
  identifier: value,
  identifier2: value2
});
```

### Chainability
Most methods return `this` for chaining:
```javascript
Elements
  .textContent({ title: 'Hello' })
  .style({ header: { color: 'blue' } })
  .classes({ nav: { add: 'active' } });
```

### Type Safety
Methods validate inputs and warn on errors without throwing.

### Performance
- Batch updates minimize DOM operations
- Index-based updates avoid unnecessary re-renders
- Shallow equality checks prevent redundant updates

---

**Total Public Methods: 60+** across all enhancer features! 🎉