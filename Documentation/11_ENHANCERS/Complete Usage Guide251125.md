# DOM Helpers Enhancers - Complete Usage Guide

## 📚 Table of Contents

1. [Bulk Property Updaters](#1-bulk-property-updaters)
2. [Collection Shortcuts](#2-collection-shortcuts)
3. [Global Query Functions](#3-global-query-functions)
4. [Indexed Collection Updates](#4-indexed-collection-updates)
5. [Index Selection](#5-index-selection)
6. [Global Collection Indexed Updates](#6-global-collection-indexed-updates)
7. [Bulk Properties for Global Query](#7-bulk-properties-for-global-query)
8. [Selector Update Patch](#8-selector-update-patch)

---

## 1. Bulk Property Updaters

**What it does:** Lets you update multiple elements at once using their IDs as keys.

### Basic Concept

Instead of updating elements one by one:
```javascript
// ❌ Old way - repetitive
document.getElementById('title').textContent = 'Hello';
document.getElementById('subtitle').textContent = 'Welcome';
document.getElementById('button').textContent = 'Click Me';
```

You can now do it all at once:
```javascript
// ✅ New way - clean and simple
Elements.textContent({
  title: 'Hello',
  subtitle: 'Welcome',
  button: 'Click Me'
});
```

### Step-by-Step Examples

#### Example 1: Updating Text Content

**HTML:**
```html
<h1 id="header">Old Title</h1>
<p id="description">Old description</p>
<span id="status">Old status</span>
```

**JavaScript:**
```javascript
// Update all text at once
Elements.textContent({
  header: 'New Title',
  description: 'This is a new description',
  status: 'Active'
});
```

**Result:** All three elements get their text updated simultaneously.

---

#### Example 2: Updating Styles

**HTML:**
```html
<div id="box1">Box 1</div>
<div id="box2">Box 2</div>
<div id="box3">Box 3</div>
```

**JavaScript:**
```javascript
// Update styles for multiple elements
Elements.style({
  box1: { 
    backgroundColor: 'red', 
    color: 'white',
    padding: '20px'
  },
  box2: { 
    backgroundColor: 'blue', 
    color: 'white',
    padding: '20px'
  },
  box3: { 
    backgroundColor: 'green', 
    color: 'white',
    padding: '20px'
  }
});
```

**Step-by-step what happens:**
1. The system finds element with id="box1"
2. Applies all styles in the object (background, color, padding)
3. Repeats for box2 and box3
4. All boxes are styled in one go!

---

#### Example 3: Working with Form Elements

**HTML:**
```html
<input id="username" type="text">
<input id="email" type="email">
<input id="age" type="number">
<input id="terms" type="checkbox">
```

**JavaScript:**
```javascript
// Set multiple form values
Elements.value({
  username: 'john_doe',
  email: 'john@example.com',
  age: '25'
});

// Set placeholders
Elements.placeholder({
  username: 'Enter your username',
  email: 'Enter your email',
  age: 'Enter your age'
});

// Enable/disable checkboxes
Elements.checked({
  terms: true  // Checkbox is now checked
});
```

---

#### Example 4: CSS Classes Management

**HTML:**
```html
<div id="card1" class="card">Card 1</div>
<div id="card2" class="card">Card 2</div>
<div id="card3" class="card">Card 3</div>
```

**JavaScript:**
```javascript
// Add classes to multiple elements
Elements.classes({
  card1: { add: ['active', 'highlighted'] },
  card2: { add: 'featured' },
  card3: { toggle: 'visible' }
});

// Remove classes
Elements.classes({
  card1: { remove: 'highlighted' },
  card2: { remove: ['old-class', 'deprecated'] }
});

// Replace classes
Elements.classes({
  card3: { replace: ['old-class', 'new-class'] }
});
```

**What happens:**
1. `card1` gets two new classes: 'active' and 'highlighted'
2. `card2` gets one class: 'featured'
3. `card3` toggles the 'visible' class (adds if missing, removes if present)

---

#### Example 5: Dataset (data-* attributes)

**HTML:**
```html
<div id="product1">Product 1</div>
<div id="product2">Product 2</div>
```

**JavaScript:**
```javascript
// Set data attributes
Elements.dataset({
  product1: {
    productId: '12345',
    price: '29.99',
    category: 'electronics'
  },
  product2: {
    productId: '67890',
    price: '49.99',
    category: 'books'
  }
});

// Now you can access these like:
// <div id="product1" data-product-id="12345" data-price="29.99" data-category="electronics">
```

---

#### Example 6: HTML Attributes

**HTML:**
```html
<button id="btn1">Button 1</button>
<button id="btn2">Button 2</button>
<img id="logo">
```

**JavaScript:**
```javascript
// Set/remove attributes
Elements.attrs({
  btn1: {
    disabled: true,        // Disables the button
    'aria-label': 'Click me',
    title: 'This is button 1'
  },
  btn2: {
    disabled: false,       // Enables the button
    'data-action': 'submit'
  },
  logo: {
    src: 'logo.png',
    alt: 'Company Logo',
    width: '200',
    height: '100'
  }
});
```

---

#### Example 7: Generic Property Updates

**HTML:**
```html
<input id="search" type="text">
<select id="category"></select>
```

**JavaScript:**
```javascript
// Update any property using .prop()
Elements.prop('readOnly', {
  search: true  // Makes input read-only
});

// Even nested properties work!
Elements.prop('style.fontSize', {
  search: '18px'
});
```

---

### Available Bulk Update Methods

| Method | What it updates | Example |
|--------|----------------|---------|
| `textContent` | Text inside elements | `Elements.textContent({id: 'text'})` |
| `innerHTML` | HTML content | `Elements.innerHTML({id: '<b>Bold</b>'})` |
| `value` | Form input values | `Elements.value({input: 'text'})` |
| `placeholder` | Input placeholders | `Elements.placeholder({input: 'hint'})` |
| `disabled` | Enable/disable state | `Elements.disabled({btn: true})` |
| `checked` | Checkbox state | `Elements.checked({box: true})` |
| `style` | CSS styles | `Elements.style({id: {color: 'red'}})` |
| `classes` | CSS classes | `Elements.classes({id: {add: 'class'}})` |
| `dataset` | data-* attributes | `Elements.dataset({id: {key: 'val'}})` |
| `attrs` | HTML attributes | `Elements.attrs({id: {attr: 'val'}})` |

---

## 2. Collection Shortcuts

**What it does:** Gives you quick access to groups of elements by class name, tag name, or name attribute.

### Basic Concept

```javascript
// Old way
const buttons = document.getElementsByClassName('button');
const divs = document.getElementsByTagName('div');
const inputs = document.getElementsByName('username');

// ✅ New way - much cleaner!
const buttons = ClassName.button;
const divs = TagName.div;
const inputs = Name.username;
```

### Step-by-Step Examples

#### Example 1: Accessing Elements by Class

**HTML:**
```html
<button class="btn">Button 1</button>
<button class="btn">Button 2</button>
<button class="btn">Button 3</button>
```

**JavaScript:**
```javascript
// Get all buttons with class "btn"
const allButtons = ClassName.btn;

// Get specific button by index
const firstButton = ClassName.btn[0];   // Button 1
const secondButton = ClassName.btn[1];  // Button 2
const lastButton = ClassName.btn[-1];   // Button 3 (negative index!)

console.log(allButtons.length);  // 3
```

**Step-by-step:**
1. `ClassName.btn` finds all elements with class="btn"
2. Returns a special collection you can access by index
3. Index [0] = first element, [1] = second, [-1] = last
4. Just like an array, but better!

---

#### Example 2: Working with Tag Names

**HTML:**
```html
<p>Paragraph 1</p>
<p>Paragraph 2</p>
<p>Paragraph 3</p>
```

**JavaScript:**
```javascript
// Get all paragraphs
const paragraphs = TagName.p;

// Access specific ones
const firstPara = TagName.p[0];
const lastPara = TagName.p[-1];

// Loop through all
TagName.p.forEach((para, index) => {
  console.log(`Paragraph ${index}: ${para.textContent}`);
});
```

---

#### Example 3: Form Elements by Name

**HTML:**
```html
<input name="email" type="email">
<input name="email" type="email">  <!-- Multiple inputs with same name -->
<input name="phone" type="tel">
```

**JavaScript:**
```javascript
// Get all inputs with name="email"
const emailInputs = Name.email;

// Get first email input
const firstEmail = Name.email[0];

// Get phone input
const phoneInput = Name.phone[0];
```

---

#### Example 4: Complex Class Names

**HTML:**
```html
<div class="card featured">Card 1</div>
<div class="card featured">Card 2</div>
```

**JavaScript:**
```javascript
// For class names with spaces or special characters, use bracket notation
const featuredCards = ClassName['card featured'];

// Or individual classes
const cards = ClassName.card;
const featured = ClassName.featured;
```

---

#### Example 5: Practical Use Case - Navigation Menu

**HTML:**
```html
<nav>
  <a class="nav-link" href="#home">Home</a>
  <a class="nav-link" href="#about">About</a>
  <a class="nav-link" href="#contact">Contact</a>
</nav>
```

**JavaScript:**
```javascript
// Highlight active link
ClassName['nav-link'][0].classList.add('active');

// Or loop and add click handlers
ClassName['nav-link'].forEach((link, index) => {
  link.addEventListener('click', () => {
    console.log(`Clicked link ${index}: ${link.textContent}`);
  });
});
```

---

### Quick Reference

| Shortcut | What it gets | Example |
|----------|-------------|---------|
| `ClassName.btn` | All elements with class="btn" | `ClassName.btn[0]` |
| `TagName.div` | All `<div>` elements | `TagName.div[1]` |
| `Name.username` | All elements with name="username" | `Name.username[0]` |

**Index Access:**
- `[0]` - First element
- `[1]` - Second element
- `[-1]` - Last element
- `[-2]` - Second to last element

---

## 3. Global Query Functions

**What it does:** Provides enhanced `querySelector` and `querySelectorAll` with built-in `.update()` support.

### Basic Concept

```javascript
// Old way
const element = document.querySelector('.btn');
element.textContent = 'Click';
element.style.color = 'red';

// ✅ New way
querySelector('.btn').update({
  textContent: 'Click',
  style: { color: 'red' }
});
```

### Step-by-Step Examples

#### Example 1: Simple Selection and Update

**HTML:**
```html
<button class="submit-btn">Old Text</button>
```

**JavaScript:**
```javascript
// Select and update in one go
query('.submit-btn').update({
  textContent: 'Submit',
  style: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px 20px'
  }
});
```

**Step-by-step:**
1. `query()` is short for `querySelector()` - finds the button
2. `.update()` applies all changes at once
3. Text changes to "Submit"
4. Styles are applied
5. Everything happens in one clean chain!

---

#### Example 2: Selecting Multiple Elements

**HTML:**
```html
<div class="card">Card 1</div>
<div class="card">Card 2</div>
<div class="card">Card 3</div>
```

**JavaScript:**
```javascript
// Select all cards and update them
queryAll('.card').update({
  style: {
    border: '1px solid #ccc',
    padding: '20px',
    margin: '10px'
  },
  classList: {
    add: 'styled-card'
  }
});
```

**What happens:**
1. `queryAll()` (short for `querySelectorAll()`) finds all cards
2. `.update()` applies the same changes to ALL cards
3. Each card gets the border, padding, and margin
4. Each card gets the 'styled-card' class added

---

#### Example 3: Scoped Queries (Within a Container)

**HTML:**
```html
<div id="sidebar">
  <button class="btn">Sidebar Button 1</button>
  <button class="btn">Sidebar Button 2</button>
</div>

<div id="main">
  <button class="btn">Main Button 1</button>
  <button class="btn">Main Button 2</button>
</div>
```

**JavaScript:**
```javascript
// Find buttons only in sidebar
const sidebar = query('#sidebar');
queryWithin(sidebar, '.btn').update({
  style: { backgroundColor: 'gray' }
});

// Or use string selector
queryWithin('#sidebar', '.btn').update({
  style: { backgroundColor: 'gray' }
});

// Find all buttons only in main area
queryAllWithin('#main', '.btn').update({
  style: { backgroundColor: 'green' }
});
```

**Step-by-step:**
1. `queryWithin()` searches inside a specific container only
2. First example: only buttons in #sidebar turn gray
3. Second example: only buttons in #main turn green
4. Buttons outside these containers are not affected

---

#### Example 4: Chaining with Array Methods

**HTML:**
```html
<div class="item" data-price="10">Item 1</div>
<div class="item" data-price="20">Item 2</div>
<div class="item" data-price="30">Item 3</div>
```

**JavaScript:**
```javascript
// Get items, filter, and update
queryAll('.item')
  .filter(item => parseInt(item.dataset.price) > 15)
  .forEach(item => {
    item.update({
      style: { backgroundColor: 'yellow' },
      textContent: item.textContent + ' (Expensive)'
    });
  });
```

**Step-by-step:**
1. `queryAll('.item')` gets all items
2. `.filter()` keeps only items with price > 15 (Item 2 and Item 3)
3. `.forEach()` loops through filtered items
4. Each filtered item gets yellow background and text update

---

#### Example 5: Working with First/Last Elements

**HTML:**
```html
<li class="menu-item">Home</li>
<li class="menu-item">About</li>
<li class="menu-item">Services</li>
<li class="menu-item">Contact</li>
```

**JavaScript:**
```javascript
const items = queryAll('.menu-item');

// Update first item
items.first().update({
  classList: { add: 'first-item' },
  style: { fontWeight: 'bold' }
});

// Update last item
items.last().update({
  classList: { add: 'last-item' },
  style: { fontStyle: 'italic' }
});

// Access by negative index
items.at(-2).update({
  textContent: 'Services (Popular)'
});
```

---

#### Example 6: Practical Form Example

**HTML:**
```html
<form id="signup">
  <input type="text" name="username" class="form-input">
  <input type="email" name="email" class="form-input">
  <input type="password" name="password" class="form-input">
  <button type="submit">Sign Up</button>
</form>
```

**JavaScript:**
```javascript
// Style all inputs
queryAllWithin('#signup', '.form-input').update({
  style: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100%',
    marginBottom: '10px'
  }
});

// Style the button
queryWithin('#signup', 'button').update({
  textContent: 'Create Account',
  style: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
});
```

---

### Available Functions

| Function | Shorthand | What it does |
|----------|-----------|-------------|
| `querySelector()` | `query()` | Finds one element |
| `querySelectorAll()` | `queryAll()` | Finds all matching elements |
| `queryWithin()` | - | Finds one element within a container |
| `queryAllWithin()` | - | Finds all elements within a container |

### Collection Methods

| Method | What it does | Example |
|--------|-------------|---------|
| `.first()` | Gets first element | `queryAll('.btn').first()` |
| `.last()` | Gets last element | `queryAll('.btn').last()` |
| `.at(index)` | Gets element at index | `queryAll('.btn').at(-1)` |
| `.isEmpty()` | Checks if empty | `queryAll('.btn').isEmpty()` |
| `.addClass()` | Adds class to all | `queryAll('.btn').addClass('active')` |
| `.removeClass()` | Removes class from all | `queryAll('.btn').removeClass('old')` |
| `.toggleClass()` | Toggles class on all | `queryAll('.btn').toggleClass('visible')` |

---

## 4. Indexed Collection Updates

**What it does:** Allows you to update specific elements in a collection by their index number, AND apply bulk updates to all elements at once.

### Basic Concept

```javascript
// Update specific elements by index AND apply shared styles
queryAll('.btn').update({
  // Index-specific updates
  [0]: { textContent: 'First', style: { color: 'red' } },
  [1]: { textContent: 'Second', style: { color: 'blue' } },
  [-1]: { textContent: 'Last', style: { color: 'green' } },
  
  // Bulk updates (applied to ALL elements)
  classList: { add: 'styled-button' },
  style: { padding: '10px' }  // All buttons get padding
});
```

### Step-by-Step Examples

#### Example 1: Styling Specific Buttons

**HTML:**
```html
<button class="btn">Button 1</button>
<button class="btn">Button 2</button>
<button class="btn">Button 3</button>
```

**JavaScript:**
```javascript
queryAll('.btn').update({
  // First button gets special treatment
  [0]: {
    textContent: 'Primary Action',
    style: {
      backgroundColor: 'blue',
      color: 'white'
    }
  },
  
  // Last button (using negative index)
  [-1]: {
    textContent: 'Cancel',
    style: {
      backgroundColor: 'gray',
      color: 'white'
    }
  },
  
  // ALL buttons get this
  style: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px'
  }
});
```

**Step-by-step what happens:**
1. **First**, bulk updates are applied to ALL buttons:
   - All buttons get padding, border, and borderRadius
2. **Then**, index-specific updates override for specific buttons:
   - Button [0] becomes "Primary Action" with blue background
   - Button [-1] (last) becomes "Cancel" with gray background
   - Button [1] keeps its original text

---

#### Example 2: Form Field Validation States

**HTML:**
```html
<input class="field" type="text" placeholder="Name">
<input class="field" type="email" placeholder="Email">
<input class="field" type="password" placeholder="Password">
```

**JavaScript:**
```javascript
// Simulate validation: first field valid, second field error
queryAll('.field').update({
  // Valid field (first one)
  [0]: {
    style: {
      borderColor: 'green',
      backgroundColor: '#f0fff0'
    },
    dataset: {
      valid: 'true'
    }
  },
  
  // Error field (second one)
  [1]: {
    style: {
      borderColor: 'red',
      backgroundColor: '#fff0f0'
    },
    dataset: {
      valid: 'false',
      error: 'Invalid email'
    }
  },
  
  // ALL fields get these styles
  style: {
    padding: '8px',
    border: '2px solid',
    borderRadius: '4px',
    width: '100%',
    marginBottom: '10px'
  }
});
```

**Result:**
- All fields: padding, border style, width, margin
- Field [0]: green border + light green background
- Field [1]: red border + light red background
- Field [2]: just the bulk styles

---

#### Example 3: Table Row Highlighting

**HTML:**
```html
<table>
  <tr class="row"><td>Row 1</td></tr>
  <tr class="row"><td>Row 2</td></tr>
  <tr class="row"><td>Row 3</td></tr>
  <tr class="row"><td>Row 4</td></tr>
  <tr class="row"><td>Row 5</td></tr>
</table>
```

**JavaScript:**
```javascript
queryAll('.row').update({
  // Highlight first row (header-like)
  [0]: {
    style: {
      backgroundColor: '#333',
      color: 'white',
      fontWeight: 'bold'
    }
  },
  
  // Highlight third row (selected)
  [2]: {
    style: {
      backgroundColor: '#ffffcc'
    },
    classList: {
      add: 'selected'
    }
  },
  
  // ALL rows get these
  style: {
    padding: '10px',
    borderBottom: '1px solid #ddd'
  }
});
```

---

#### Example 4: Image Gallery with Featured Image

**HTML:**
```html
<img class="gallery-img" src="img1.jpg" alt="Image 1">
<img class="gallery-img" src="img2.jpg" alt="Image 2">
<img class="gallery-img" src="img3.jpg" alt="Image 3">
<img class="gallery-img" src="img4.jpg" alt="Image 4">
```

**JavaScript:**
```javascript
queryAll('.gallery-img').update({
  // First image is featured (larger)
  [0]: {
    style: {
      width: '400px',
      height: '400px',
      border: '4px solid gold'
    },
    classList: {
      add: 'featured'
    }
  },
  
  // ALL images get these styles
  style: {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    border: '2px solid #ccc',
    margin: '5px',
    cursor: 'pointer'
  }
});
```

**What happens:**
1. All images get 200x200 size, border, margin, cursor
2. First image [0] OVERRIDES with 400x400 and gold border
3. First image also gets 'featured' class

---

#### Example 5: Priority Task List

**HTML:**
```html
<li class="task">Task 1</li>
<li class="task">Task 2</li>
<li class="task">Task 3</li>
<li class="task">Task 4</li>
<li class="task">Task 5</li>
```

**JavaScript:**
```javascript
queryAll('.task').update({
  // High priority (first task)
  [0]: {
    style: {
      backgroundColor: '#ff6b6b',
      color: 'white'
    },
    dataset: {
      priority: 'high'
    }
  },
  
  // Medium priority (second task)
  [1]: {
    style: {
      backgroundColor: '#ffd93d'
    },
    dataset: {
      priority: 'medium'
    }
  },
  
  // Low priority (last task)
  [-1]: {
    style: {
      backgroundColor: '#95e1d3'
    },
    dataset: {
      priority: 'low'
    }
  },
  
  // ALL tasks get these
  style: {
    padding: '15px',
    margin: '5px 0',
    borderRadius: '4px',
    listStyle: 'none'
  }
});
```

---

#### Example 6: Navigation Menu with Active State

**HTML:**
```html
<a class="nav-link" href="#home">Home</a>
<a class="nav-link" href="#about">About</a>
<a class="nav-link" href="#services">Services</a>
<a class="nav-link" href="#contact">Contact</a>
```

**JavaScript:**
```javascript
// Make second link active
queryAll('.nav-link').update({
  // Active link (index 1)
  [1]: {
    style: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    classList: {
      add: 'active'
    }
  },
  
  // ALL links get these
  style: {
    display: 'inline-block',
    padding: '10px 20px',
    textDecoration: 'none',
    color: '#333',
    borderRadius: '4px',
    margin: '0 5px'
  }
});
```

---

### Key Points

✅ **Bulk updates are applied FIRST to all elements**
✅ **Index updates are applied AFTER and can override bulk updates**
✅ **Negative indices work: [-1] = last, [-2] = second to last**
✅ **Mix bulk and index updates freely**

### Update Pattern

```javascript
collection.update({
  // Bulk (ALL elements)
  property: value,
  style: { ... },
  classList: { ... },
  
  // Index-specific (individual elements)
  [0]: { property: value },
  [1]: { property: value },
  [-1]: { property: value }
});
```

---

## 5. Index Selection

**What it does:** Adds `.update()` method support when you access individual elements from collections by index.

### Basic Concept

```javascript
// When you select a collection
const buttons = queryAll('.btn');

// And access an individual element by index
const firstButton = buttons[0];

// That element AUTOMATICALLY has .update() method
firstButton.update({
  textContent: 'Click Me',
  style: { color: 'red' }
});
```

### Step-by-Step Examples

#### Example 1: Updating Individual Elements

**HTML:**
```html
<button class="btn">Button 1</button>
<button class="btn">Button 2</button>
<button class="btn">Button 3</button>
```

**JavaScript:**
```javascript
const buttons = queryAll('.btn');

// Access first button and update it
buttons[0].update({
  textContent: 'Primary',
  style: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px 20px'
  }
});

// Access last button and update it
buttons[-1].update({
  textContent: 'Delete',
  style: {
    backgroundColor: 'red',
    color: 'white'
  }
});
```

**Step-by-step:**
1. `queryAll('.btn')` gets all buttons
2. `buttons[0]` accesses the first button
3. The `.update()` method is automatically available
4. Same for `buttons[-1]` (last button)
5. Each element can be updated independently

---

#### Example 2: Conditional Updates in Loops

**HTML:**
```html
<div class="card">Card 1</div>
<div class="card">Card 2</div>
<div class="card">Card 3</div>
<div class="card">Card 4</div>
<div class="card">Card 5</div>
```

**JavaScript:**
```javascript
const cards = queryAll('.card');

// Update cards based on their position
cards.forEach((card, index) => {
  if (index % 2 === 0) {
    // Even indices (0, 2, 4)
    card.update({
      style: { backgroundColor: '#f0f0f0' }
    });
  } else {
    // Odd indices (1, 3)
    card.update({
      style: { backgroundColor: '#e0e0e0' }
    });
  }
});
```

**What happens:**
1. Loop through all cards
2. Even-positioned cards get light gray background
3. Odd-positioned cards get darker gray background
4. Creates alternating row effect

---

#### Example 3: Using .at() Method

**HTML:**
```html
<li class="item">Item 1</li>
<li class="item">Item 2</li>
<li class="item">Item 3</li>
<li class="item">Item 4</li>
<li class="item">Item 5</li>
```

**JavaScript:**
```javascript
const items = queryAll('.item');

// Access using .at() method
items.at(0).update({
  style: { fontWeight: 'bold' }
});

// Negative indices work too
items.at(-1).update({
  style: { fontStyle: 'italic' }
});

// Access middle element
const middleIndex = Math.floor(items.length / 2);
items.at(middleIndex).update({
  style: { backgroundColor: 'yellow' }
});
```

---

#### Example 4: Dynamic Form Validation

**HTML:**
```html
<input class="input" type="text" placeholder="Name">
<input class="input" type="email" placeholder="Email">
<input class="input" type="tel" placeholder="Phone">
```

**JavaScript:**
```javascript
const inputs = queryAll('.input');

// Function to validate and style
function validateInput(index, isValid) {
  inputs[index].update({
    style: {
      borderColor: isValid ? 'green' : 'red',
      backgroundColor: isValid ? '#f0fff0' : '#fff0f0'
    },
    dataset: {
      valid: isValid.toString()
    }
  });
}

// Example usage
validateInput(0, true);   // First input valid
validateInput(1, false);  // Second input invalid
validateInput(2, true);   // Third input valid
```

---

#### Example 5: Interactive Gallery

**HTML:**
```html
<img class="thumb" src="img1.jpg">
<img class="thumb" src="img2.jpg">
<img class="thumb" src="img3.jpg">
<img class="thumb" src="img4.jpg">
```

**JavaScript:**
```javascript
const thumbnails = queryAll('.thumb');
let currentIndex = 0;

function selectThumbnail(index) {
  // Reset all thumbnails
  thumbnails.forEach(thumb => {
    thumb.update({
      style: {
        border: '2px solid #ccc',
        opacity: '0.6'
      }
    });
  });
  
  // Highlight selected thumbnail
  thumbnails[index].update({
    style: {
      border: '4px solid blue',
      opacity: '1'
    },
    classList: {
      add: 'active'
    }
  });
  
  currentIndex = index;
}

// Add click handlers
thumbnails.forEach((thumb, index) => {
  thumb.addEventListener('click', () => selectThumbnail(index));
});

// Select first by default
selectThumbnail(0);
```

**Step-by-step:**
1. Get all thumbnails
2. Define function to highlight a specific thumbnail
3. Reset all thumbnails to default style
4. Highlight the selected one using `thumbnails[index].update()`
5. Add click handlers to make it interactive

---

#### Example 6: Progress Steps

**HTML:**
```html
<div class="step">Step 1</div>
<div class="step">Step 2</div>
<div class="step">Step 3</div>
<div class="step">Step 4</div>
```

**JavaScript:**
```javascript
const steps = queryAll('.step');
let currentStep = 0;

function goToStep(stepIndex) {
  steps.forEach((step, index) => {
    if (index < stepIndex) {
      // Completed steps
      step.update({
        style: { backgroundColor: 'green', color: 'white' },
        classList: { add: 'completed', remove: ['active', 'pending'] }
      });
    } else if (index === stepIndex) {
      // Current step
      step.update({
        style: { backgroundColor: 'blue', color: 'white' },
        classList: { add: 'active', remove: ['completed', 'pending'] }
      });
    } else {
      // Future steps
      step.update({
        style: { backgroundColor: '#f0f0f0', color: '#999' },
        classList: { add: 'pending', remove: ['active', 'completed'] }
      });
    }
  });
  
  currentStep = stepIndex;
}

// Start at step 2 (index 1)
goToStep(1);
```

---

### Key Features

✅ **Automatic .update() method** on indexed elements
✅ **Works with positive indices**: [0], [1], [2]
✅ **Works with negative indices**: [-1], [-2]
✅ **Works with .at() method**
✅ **Available in forEach loops**

---

## 6. Global Collection Indexed Updates

**What it does:** Adds the indexed update capability to the global shortcuts (ClassName, TagName, Name).

### Basic Concept

```javascript
// Use ClassName, TagName, or Name shortcuts
ClassName.button.update({
  // Index-specific
  [0]: { textContent: 'First', style: { color: 'red' } },
  [1]: { textContent: 'Second', style: { color: 'blue' } },
  
  // Bulk (all buttons)
  classList: { add: 'styled' }
});
```

### Step-by-Step Examples

#### Example 1: Styling Buttons by Class

**HTML:**
```html
<button class="action-btn">Action 1</button>
<button class="action-btn">Action 2</button>
<button class="action-btn">Action 3</button>
```

**JavaScript:**
```javascript
ClassName['action-btn'].update({
  // First button special
  [0]: {
    textContent: 'Primary Action',
    style: {
      backgroundColor: '#007bff',
      color: 'white'
    }
  },
  
  // Last button special
  [-1]: {
    textContent: 'Cancel',
    style: {
      backgroundColor: '#6c757d',
      color: 'white'
    }
  },
  
  // ALL buttons get these
  style: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    margin: '5px',
    cursor: 'pointer'
  }
});
```

---

#### Example 2: Table Cells by Tag

**HTML:**
```html
<table>
  <tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
    <td>Cell 3</td>
  </tr>
</table>
```

**JavaScript:**
```javascript
TagName.td.update({
  // First cell (header-like)
  [0]: {
    style: {
      fontWeight: 'bold',
      backgroundColor: '#f0f0f0'
    }
  },
  
  // Last cell (total-like)
  [-1]: {
    style: {
      fontWeight: 'bold',
      textAlign: 'right'
    }
  },
  
  // ALL cells
  style: {
    padding: '10px',
    border: '1px solid #ddd'
  }
});
```

---

#### Example 3: Radio Buttons by Name

**HTML:**
```html
<label><input type="radio" name="size" value="small"> Small</label>
<label><input type="radio" name="size" value="medium"> Medium</label>
<label><input type="radio" name="size" value="large"> Large</label>
```

**JavaScript:**
```javascript
// Pre-select the middle option and style all
Name.size.update({
  // Select middle option
  [1]: {
    checked: true
  },
  
  // Style ALL radio inputs
  style: {
    margin: '5px',
    cursor: 'pointer'
  }
});
```

---

#### Example 4: Paragraph Highlighting

**HTML:**
```html
<p>Paragraph 1</p>
<p>Paragraph 2</p>
<p>Paragraph 3</p>
<p>Paragraph 4</p>
<p>Paragraph 5</p>
```

**JavaScript:**
```javascript
TagName.p.update({
  // First paragraph
  [0]: {
    style: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333'
    }
  },
  
  // Third paragraph (index 2)
  [2]: {
    style: {
      backgroundColor: '#ffffcc',
      padding: '10px'
    }
  },
  
  // ALL paragraphs
  style: {
    lineHeight: '1.6',
    marginBottom: '15px'
  }
});
```

---

#### Example 5: Navigation Links

**HTML:**
```html
<nav>
  <a class="nav-item" href="#home">Home</a>
  <a class="nav-item" href="#about">About</a>
  <a class="nav-item" href="#services">Services</a>
  <a class="nav-item" href="#contact">Contact</a>
</nav>
```

**JavaScript:**
```javascript
// Set second link as active
ClassName['nav-item'].update({
  // Active link (About)
  [1]: {
    style: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    classList: {
      add: 'active'
    }
  },
  
  // ALL links
  style: {
    display: 'inline-block',
    padding: '10px 15px',
    textDecoration: 'none',
    color: '#333',
    margin: '0 2px',
    borderRadius: '4px'
  }
});
```

---

#### Example 6: Form Inputs with Validation

**HTML:**
```html
<form>
  <input type="text" name="username">
  <input type="email" name="email">
  <input type="password" name="password">
</form>
```

**JavaScript:**
```javascript
// Validate specific fields
TagName.input.update({
  // First field - valid
  [0]: {
    style: {
      borderColor: 'green'
    },
    dataset: {
      status: 'valid'
    }
  },
  
  // Second field - error
  [1]: {
    style: {
      borderColor: 'red'
    },
    dataset: {
      status: 'error',
      message: 'Invalid email'
    }
  },
  
  // ALL fields
  style: {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    border: '2px solid',
    borderRadius: '4px'
  }
});
```

---

### Available Shortcuts

| Shortcut | Example | What it does |
|----------|---------|-------------|
| `ClassName.btn` | `ClassName.btn.update({...})` | Updates all elements with class="btn" |
| `TagName.div` | `TagName.div.update({...})` | Updates all `<div>` elements |
| `Name.username` | `Name.username.update({...})` | Updates all elements with name="username" |

---

## 7. Bulk Properties for Global Query

**What it does:** Adds convenient methods to update specific properties across multiple elements selected with `queryAll()`.

### Basic Concept

```javascript
// Instead of using .update() for everything
queryAll('.btn').update({
  [0]: { textContent: 'One' },
  [1]: { textContent: 'Two' }
});

// You can use specific property methods
queryAll('.btn').textContent({
  [0]: 'One',
  [1]: 'Two'
});
```

### Step-by-Step Examples

#### Example 1: Updating Text Content

**HTML:**
```html
<span class="label">Label 1</span>
<span class="label">Label 2</span>
<span class="label">Label 3</span>
```

**JavaScript:**
```javascript
// Method 1: Using textContent()
queryAll('.label').textContent({
  [0]: 'Name:',
  [1]: 'Email:',
  [2]: 'Phone:'
});

// Method 2: Using innerHTML() for HTML content
queryAll('.label').innerHTML({
  [0]: '<strong>Name:</strong>',
  [1]: '<strong>Email:</strong>',
  [2]: '<strong>Phone:</strong>'
});
```

---

#### Example 2: Form Values

**HTML:**
```html
<input class="field" type="text">
<input class="field" type="text">
<input class="field" type="text">
```

**JavaScript:**
```javascript
// Set values
queryAll('.field').value({
  [0]: 'John Doe',
  [1]: 'john@example.com',
  [2]: '+1234567890'
});

// Set placeholders
queryAll('.field').placeholder({
  [0]: 'Enter your name',
  [1]: 'Enter your email',
  [2]: 'Enter your phone'
});

// Disable specific fields
queryAll('.field').disabled({
  [0]: false,  // Enabled
  [1]: false,  // Enabled
  [2]: true    // Disabled
});
```

---

#### Example 3: Styling Multiple Elements

**HTML:**
```html
<div class="box">Box 1</div>
<div class="box">Box 2</div>
<div class="box">Box 3</div>
```

**JavaScript:**
```javascript
// Update styles for specific boxes
queryAll('.box').style({
  [0]: {
    backgroundColor: 'red',
    color: 'white',
    padding: '20px'
  },
  [1]: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '20px'
  },
  [2]: {
    backgroundColor: 'green',
    color: 'white',
    padding: '20px'
  }
});
```

**Result:** Each box gets its own unique color!

---

#### Example 4: Dataset Updates

**HTML:**
```html
<div class="product">Product 1</div>
<div class="product">Product 2</div>
<div class="product">Product 3</div>
```

**JavaScript:**
```javascript
queryAll('.product').dataset({
  [0]: {
    productId: '101',
    price: '29.99',
    category: 'electronics'
  },
  [1]: {
    productId: '102',
    price: '19.99',
    category: 'books'
  },
  [2]: {
    productId: '103',
    price: '39.99',
    category: 'clothing'
  }
});

// Access later like: element.dataset.productId
```

---

#### Example 5: Class Management

**HTML:**
```html
<div class="card">Card 1</div>
<div class="card">Card 2</div>
<div class="card">Card 3</div>
```

**JavaScript:**
```javascript
queryAll('.card').classes({
  // Add classes to specific cards
  [0]: { add: ['featured', 'highlight'] },
  
  // Remove classes from second card
  [1]: { remove: 'old-class' },
  
  // Toggle class on third card
  [2]: { toggle: 'visible' }
});

// Or replace classes entirely
queryAll('.card').classes({
  [0]: 'card featured',  // String replacement
  [1]: 'card normal',
  [2]: 'card archived'
});
```

---

#### Example 6: Attributes

**HTML:**
```html
<img class="photo">
<img class="photo">
<img class="photo">
```

**JavaScript:**
```javascript
queryAll('.photo').attrs({
  [0]: {
    src: 'photo1.jpg',
    alt: 'Photo 1',
    width: '300',
    height: '200'
  },
  [1]: {
    src: 'photo2.jpg',
    alt: 'Photo 2',
    width: '300',
    height: '200'
  },
  [2]: {
    src: 'photo3.jpg',
    alt: 'Photo 3',
    width: '300',
    height: '200'
  }
});

// Remove attributes
queryAll('.photo').attrs({
  [0]: {
    width: null,   // Removes width attribute
    height: null   // Removes height attribute
  }
});
```

---

#### Example 7: Generic Properties

**HTML:**
```html
<input class="input" type="checkbox">
<input class="input" type="checkbox">
<input class="input" type="checkbox">
```

**JavaScript:**
```javascript
// Set checked state
queryAll('.input').prop('checked', {
  [0]: true,
  [1]: false,
  [2]: true
});

// Even nested properties work!
queryAll('.input').prop('style.backgroundColor', {
  [0]: 'yellow',
  [1]: 'lightblue',
  [2]: 'lightgreen'
});
```

---

#### Example 8: Practical Todo List

**HTML:**
```html
<li class="todo">Buy groceries</li>
<li class="todo">Walk the dog</li>
<li class="todo">Finish report</li>
<li class="todo">Call mom</li>
```

**JavaScript:**
```javascript
// Mark specific tasks as complete
queryAll('.todo').style({
  [0]: {
    textDecoration: 'line-through',
    opacity: '0.5'
  },
  [2]: {
    textDecoration: 'line-through',
    opacity: '0.5'
  }
});

queryAll('.todo').dataset({
  [0]: { completed: 'true' },
  [2]: { completed: 'true' }
});

// Add checkmark to completed
queryAll('.todo').innerHTML({
  [0]: '✓ Buy groceries',
  [2]: '✓ Finish report'
});
```

---

### Available Property Methods

| Method | What it updates | Example |
|--------|----------------|---------|
| `.textContent()` | Text content | `queryAll('.el').textContent({[0]: 'text'})` |
| `.innerHTML()` | HTML content | `queryAll('.el').innerHTML({[0]: '<b>bold</b>'})` |
| `.innerText()` | Inner text | `queryAll('.el').innerText({[0]: 'text'})` |
| `.value()` | Input values | `queryAll('input').value({[0]: 'value'})` |
| `.placeholder()` | Input placeholders | `queryAll('input').placeholder({[0]: 'hint'})` |
| `.disabled()` | Disabled state | `queryAll('input').disabled({[0]: true})` |
| `.checked()` | Checkbox state | `queryAll('input').checked({[0]: true})` |
| `.readonly()` | Readonly state | `queryAll('input').readonly({[0]: true})` |
| `.hidden()` | Hidden state | `queryAll('.el').hidden({[0]: true})` |
| `.src()` | Image/media source | `queryAll('img').src({[0]: 'img.jpg'})` |
| `.href()` | Link href | `queryAll('a').href({[0]: 'url.com'})` |
| `.style()` | CSS styles | `queryAll('.el').style({[0]: {color: 'red'}})` |
| `.dataset()` | Data attributes | `queryAll('.el').dataset({[0]: {key: 'val'}})` |
| `.attrs()` | HTML attributes | `queryAll('.el').attrs({[0]: {attr: 'val'}})` |
| `.classes()` | CSS classes | `queryAll('.el').classes({[0]: {add: 'cls'}})` |
| `.prop()` | Generic properties | `queryAll('.el').prop('prop', {[0]: val})` |

---

## 8. Selector Update Patch

**What it does:** Ensures that when you access individual elements from collections (by index or using `.at()`), those elements automatically have the `.update()` method available.

### Basic Concept

```javascript
// Get a collection
const items = queryAll('.item');

// Access individual element by index
const firstItem = items[0];

// Element automatically has .update() method
firstItem.update({
  textContent: 'Updated!',
  style: { color: 'red' }
});

// Same with .at() method
items.at(-1).update({
  textContent: 'Last item updated'
});
```

### Step-by-Step Examples

#### Example 1: Safe Individual Updates

**HTML:**
```html
<div class="message">Message 1</div>
<div class="message">Message 2</div>
<div class="message">Message 3</div>
```

**JavaScript:**
```javascript
const messages = queryAll('.message');

// Each individual access gets .update() automatically
messages[0].update({
  textContent: 'Success!',
  style: { color: 'green' }
});

messages[1].update({
  textContent: 'Warning!',
  style: { color: 'orange' }
});

messages[2].update({
  textContent: 'Error!',
  style: { color: 'red' }
});
```

**What this patch ensures:**
- No errors when accessing individual elements
- `.update()` is always available
- Works with any collection method

---

#### Example 2: Using in Event Handlers

**HTML:**
```html
<button class="btn">Button 1</button>
<button class="btn">Button 2</button>
<button class="btn">Button 3</button>
```

**JavaScript:**
```javascript
const buttons = queryAll('.btn');

buttons.forEach((button, index) => {
  button.addEventListener('click', function() {
    // 'this' is the individual button
    // It has .update() thanks to the patch
    this.update({
      textContent: `Clicked ${index + 1}!`,
      style: {
        backgroundColor: 'green',
        color: 'white'
      },
      disabled: true
    });
  });
});
```

---

#### Example 3: Dynamic List Management

**HTML:**
```html
<ul id="list">
  <li class="item">Item 1</li>
  <li class="item">Item 2</li>
  <li class="item">Item 3</li>
  <li class="item">Item 4</li>
</ul>
```

**JavaScript:**
```javascript
const items = queryAll('.item');

// Function to mark item as complete
function completeItem(index) {
  items.at(index).update({
    style: {
      textDecoration: 'line-through',
      opacity: '0.5',
      backgroundColor: '#f0f0f0'
    },
    dataset: {
      completed: 'true'
    }
  });
}

// Function to mark item as important
function markImportant(index) {
  items[index].update({
    style: {
      fontWeight: 'bold',
      backgroundColor: '#fffacd'
    },
    dataset: {
      priority: 'high'
    }
  });
}

// Usage
completeItem(0);      // Mark first as complete
markImportant(1);     // Mark second as important
completeItem(-1);     // Mark last as complete (negative index!)
```

---

#### Example 4: Conditional Styling

**HTML:**
```html
<div class="score">85</div>
<div class="score">92</div>
<div class="score">67</div>
<div class="score">78</div>
<div class="score">95</div>
```

**JavaScript:**
```javascript
const scores = queryAll('.score');

scores.forEach((scoreElement, index) => {
  const score = parseInt(scoreElement.textContent);
  
  if (score >= 90) {
    // Excellent
    scoreElement.update({
      style: {
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '10px',
        fontWeight: 'bold'
      },
      dataset: {
        grade: 'A'
      }
    });
  } else if (score >= 80) {
    // Good
    scoreElement.update({
      style: {
        backgroundColor: '#8bc34a',
        color: 'white',
        padding: '10px'
      },
      dataset: {
        grade: 'B'
      }
    });
  } else if (score >= 70) {
    // Average
    scoreElement.update({
      style: {
        backgroundColor: '#ffc107',
        color: 'black',
        padding: '10px'
      },
      dataset: {
        grade: 'C'
      }
    });
  } else {
    // Below average
    scoreElement.update({
      style: {
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px'
      },
      dataset: {
        grade: 'F'
      }
    });
  }
});
```

**Result:** Each score gets color-coded based on its value!

---

#### Example 5: Selecting with .at() Method

**HTML:**
```html
<article class="post">Post 1</article>
<article class="post">Post 2</article>
<article class="post">Post 3</article>
<article class="post">Post 4</article>
<article class="post">Post 5</article>
```

**JavaScript:**
```javascript
const posts = queryAll('.post');

// Style first post
posts.at(0).update({
  style: {
    fontSize: '24px',
    fontWeight: 'bold',
    borderLeft: '5px solid blue'
  }
});

// Style last post
posts.at(-1).update({
  style: {
    fontStyle: 'italic',
    opacity: '0.7'
  }
});

// Style middle post
const middleIndex = Math.floor(posts.length / 2);
posts.at(middleIndex).update({
  style: {
    backgroundColor: '#ffffcc',
    padding: '15px'
  }
});
```

---

#### Example 6: Integration with Collections

**HTML:**
```html
<span class="tag">JavaScript</span>
<span class="tag">HTML</span>
<span class="tag">CSS</span>
<span class="tag">React</span>
```

**JavaScript:**
```javascript
// Works with ClassName too!
const tags = ClassName.tag;

// Access and update individual tags
tags[0].update({
  style: {
    backgroundColor: '#f0db4f',
    color: '#323330',
    padding: '5px 10px',
    borderRadius: '3px'
  }
});

tags[1].update({
  style: {
    backgroundColor: '#e34c26',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '3px'
  }
});

tags[2].update({
  style: {
    backgroundColor: '#264de4',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '3px'
  }
});

tags[-1].update({
  style: {
    backgroundColor: '#61dafb',
    color: '#20232a',
    padding: '5px 10px',
    borderRadius: '3px'
  }
});
```

---

### What the Patch Ensures

✅ **Individual element access always has .update()**
- `collection[0].update()` works
- `collection.at(-1).update()` works
- Elements in `.forEach()` have `.update()`

✅ **Works with all collection types**
- `queryAll()` collections
- `ClassName` collections
- `TagName` collections
- `Name` collections

✅ **Fallback update method**
- If main update utility isn't loaded, provides basic update functionality
- Ensures code doesn't break

✅ **Handles nested properties**
- Can update `element.style.color` directly
- Supports complex updates like `classList` operations

---

## Summary Table

| Enhancer | Main Feature | Best For |
|----------|-------------|----------|
| **Bulk Property Updaters** | Update many elements by ID | Updating specific elements when you know their IDs |
| **Collection Shortcuts** | Quick access with ClassName, TagName, Name | Getting elements by class, tag, or name quickly |
| **Global Query** | Enhanced querySelector with .update() | CSS selector-based element selection |
| **Indexed Updates** | Update specific elements by index in collection | Styling first, last, or specific positioned elements |
| **Index Selection** | Individual elements from collections have .update() | Working with single elements from collections |
| **Global Collection Indexed** | Indexed updates for ClassName/TagName/Name | Combining shortcuts with index-based updates |
| **Bulk Properties for Query** | Shorthand property methods for collections | Quick property updates without .update() |
| **Selector Update Patch** | Ensures .update() always available | Safety and compatibility across all methods |

---

## 🎯 Quick Reference

### Most Common Patterns

```javascript
// Update by ID
Elements.textContent({ title: 'New Title' });

// Update by class
ClassName.button.update({ style: { color: 'red' } });

// Update by selector
queryAll('.item').update({ style: { padding: '10px' } });

// Update specific index
queryAll('.item').update({
  [0]: { style: { color: 'red' } },
  [-1]: { style: { color: 'blue' } }
});

// Update individual element
queryAll('.item')[0].update({ textContent: 'First' });

// Bulk + Index combined
queryAll('.btn').update({
  // All buttons
  style: { padding: '10px' },
  // Specific buttons
  [0]: { style: { backgroundColor: 'blue' } }
});
```

---

This guide covers all 8 enhancers with practical examples you can use right away! Each example is designed to be copy-paste ready and demonstrates real-world use cases.