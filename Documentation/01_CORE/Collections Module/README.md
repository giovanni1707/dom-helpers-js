# Collections Module - Complete Documentation

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Complete, beginner-friendly documentation for the Collections Helper**
> Learn how to work with groups of DOM elements by class, tag, or name with powerful array-like methods

---

## 📚 Documentation Structure

The Collections module documentation is organized into **five comprehensive guides**:

### 1. **[Access Methods](01_Access-Methods.md)** 🎯
*How to get collections of elements*

Learn the 3 ways to access element collections:
- `Collections.ClassName` - By CSS class
- `Collections.TagName` - By HTML tag
- `Collections.Name` - By name attribute
- Understanding live collections
- Property vs function syntax

**[Read Access Methods →](01_Access-Methods.md)**

---

### 2. **[Bulk Operations](02_Bulk-Operations.md)** ⚡
*Update entire collections efficiently*

Master the `Collections.update()` method:
- Single collection updates
- Multiple collection updates
- Available update operations
- Performance optimization
- Real-world patterns

**[Read Bulk Operations →](02_Bulk-Operations.md)**

---

### 3. **[Array-like Methods](03_Array-like-Methods.md)** 🔄
*Use familiar array methods on collections*

Work with collections like JavaScript arrays:
- `.forEach()`, `.map()`, `.filter()`, `.find()`
- `.some()`, `.every()`, `.reduce()`
- `.first()`, `.last()`, `.at()`, `.isEmpty()`
- `.toArray()` conversion

**[Read Array-like Methods →](03_Array-like-Methods.md)**

---

### 4. **[DOM Manipulation & Filtering](04_DOM-Manipulation-and-Filtering.md)** 🛠️
*Shorthand methods for common operations*

Quick methods for DOM manipulation and filtering:
- **Manipulation**: `.addClass()`, `.removeClass()`, `.toggleClass()`
- **Properties**: `.setProperty()`, `.setAttribute()`, `.setStyle()`
- **Events**: `.on()`, `.off()`
- **Filtering**: `.visible()`, `.hidden()`, `.enabled()`, `.disabled()`

**[Read DOM Manipulation & Filtering →](04_DOM-Manipulation-and-Filtering.md)**

---

### 5. **[Utility & Helper Methods](05_Utility-Helper-Methods.md)** 📊
*Manage cache and async operations*

Control the Collections Helper:
- `Collections.stats()` - Performance statistics
- `Collections.clear()` - Cache management
- `Collections.configure()` - Configuration
- `Collections.getMultiple()` - Bulk access
- `Collections.waitFor()` - Async loading

**[Read Utility & Helper Methods →](05_Utility-Helper-Methods.md)**

---

## 🚀 Quick Start

### Basic Access

```javascript
// Get all buttons by class
const buttons = Collections.ClassName.button;

// Get all divs by tag
const divs = Collections.TagName.div;

// Get all email inputs by name
const emailInputs = Collections.Name.email;
```

### Update Collections

```javascript
// Update all buttons
Collections.ClassName.button.update({
  style: { padding: '10px', backgroundColor: 'blue' },
  classList: { add: ['styled'] }
});

// Update multiple collections at once
Collections.update({
  ClassName: {
    button: { style: { padding: '10px' } },
    card: { style: { borderRadius: '8px' } }
  },
  TagName: {
    img: { setAttribute: { loading: 'lazy' } }
  }
});
```

### Use Array Methods

```javascript
const buttons = Collections.ClassName.button;

// Iterate
buttons.forEach(btn => console.log(btn.textContent));

// Transform
const buttonTexts = buttons.map(btn => btn.textContent);

// Filter
const enabledButtons = buttons.filter(btn => !btn.disabled);

// Find
const submitBtn = buttons.find(btn => btn.id === 'submitBtn');
```

### Use Shorthand Methods

```javascript
const buttons = Collections.ClassName.button;

// Add class to all
buttons.addClass('initialized');

// Set style on all
buttons.setStyle({ padding: '10px' });

// Add event listener to all
buttons.on('click', handleClick);

// Filter and update
buttons.visible().forEach(btn => {
  btn.addClass('visible-button');
});
```

---

## 📊 Method Overview

### Access Methods (3 types)

| Method | Selector | Example | Use Case |
|--------|----------|---------|----------|
| **ClassName** | CSS class | `Collections.ClassName.button` | Elements with class="button" |
| **TagName** | HTML tag | `Collections.TagName.div` | All `<div>` elements |
| **Name** | name attribute | `Collections.Name.email` | Elements with name="email" |

### Bulk Operations (1 powerful method)

| Method | Purpose | Example |
|--------|---------|---------|
| **update()** | Update collection(s) | `Collections.update({ ClassName: { button: {...} } })` |

### Array-like Methods (8 core methods)

| Method | Returns | Use Case |
|--------|---------|----------|
| **forEach()** | undefined | Iterate elements |
| **map()** | Array | Transform to values |
| **filter()** | Array | Filter elements |
| **find()** | Element | Find one element |
| **some()** | Boolean | Test if any match |
| **every()** | Boolean | Test if all match |
| **reduce()** | Any | Reduce to value |
| **toArray()** | Array | Convert to array |

### Utility Methods (6 methods + 4 helpers)

| Method | Purpose | Example |
|--------|---------|---------|
| **first()** | Get first element | `collection.first()` |
| **last()** | Get last element | `collection.last()` |
| **at()** | Get by index | `collection.at(-1)` |
| **isEmpty()** | Check if empty | `collection.isEmpty()` |
| **item()** | Get by index (standard) | `collection.item(0)` |
| **namedItem()** | Get by name/ID | `collection.namedItem('id')` |

### DOM Manipulation Methods (8 methods)

| Method | Purpose | Example |
|--------|---------|---------|
| **addClass()** | Add classes | `collection.addClass('active')` |
| **removeClass()** | Remove classes | `collection.removeClass('hidden')` |
| **toggleClass()** | Toggle classes | `collection.toggleClass('open')` |
| **setProperty()** | Set property | `collection.setProperty('disabled', true)` |
| **setAttribute()** | Set attribute | `collection.setAttribute('loading', 'lazy')` |
| **setStyle()** | Set styles | `collection.setStyle({ color: 'red' })` |
| **on()** | Add event listener | `collection.on('click', handler)` |
| **off()** | Remove listener | `collection.off('click', handler)` |

### Filtering Methods (4 methods)

| Method | Purpose | Example |
|--------|---------|---------|
| **visible()** | Get visible elements | `collection.visible()` |
| **hidden()** | Get hidden elements | `collection.hidden()` |
| **enabled()** | Get enabled elements | `collection.enabled()` |
| **disabled()** | Get disabled elements | `collection.disabled()` |

### Helper Methods (9 methods)

| Method | Purpose | Example |
|--------|---------|---------|
| **stats()** | Performance stats | `Collections.stats()` |
| **clear()** | Clear cache | `Collections.clear()` |
| **destroy()** | Cleanup | `Collections.destroy()` |
| **isCached()** | Check cache | `Collections.isCached('className', 'button')` |
| **configure()** | Configure | `Collections.configure({ maxCacheSize: 2000 })` |
| **enableEnhancedSyntax()** | Enable features | `Collections.enableEnhancedSyntax()` |
| **disableEnhancedSyntax()** | Disable features | `Collections.disableEnhancedSyntax()` |
| **getMultiple()** | Get multiple collections | `Collections.getMultiple([...])` |
| **waitFor()** | Async wait | `await Collections.waitFor('className', 'card', 5)` |

---

## 💡 Key Concepts

### Live Collections

Collections automatically update when DOM changes:

```javascript
const buttons = Collections.ClassName.button;
console.log(buttons.length);  // 3

// Add new button to DOM
document.body.appendChild(newButton);

console.log(buttons.length);  // 4 (automatically updated!)
```

---

### Enhanced Collections

All collections are enhanced with:
- **Array methods** - `.forEach()`, `.map()`, `.filter()`, etc.
- **Utility methods** - `.first()`, `.last()`, `.isEmpty()`
- **DOM methods** - `.addClass()`, `.setStyle()`, `.on()`
- **Filtering** - `.visible()`, `.enabled()`
- **Update method** - Universal `.update()`

```javascript
const buttons = Collections.ClassName.button;

// All these work on the collection
buttons.forEach(btn => console.log(btn));
const firstBtn = buttons.first();
buttons.addClass('styled');
const visibleBtns = buttons.visible();
buttons.update({ style: { padding: '10px' } });
```

---

### Intelligent Caching

Collections are cached for performance:

```javascript
Collections.ClassName.button;  // Fetches from DOM
Collections.ClassName.button;  // Returns from cache (fast!)

// Automatic cleanup of removed elements
// Manual cache control
Collections.clear();  // Clear cache
Collections.isCached('className', 'button');  // Check cache
```

---

## 🎯 Common Patterns

### Pattern 1: Styling Elements

```javascript
// Style all buttons
Collections.ClassName.button.update({
  style: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px'
  },
  classList: { add: ['btn'] }
});

// Or use shorthand
Collections.ClassName.button
  .addClass('btn')
  .setStyle({ padding: '10px 20px', backgroundColor: '#007bff' });
```

---

### Pattern 2: Form Handling

```javascript
// Validate required fields
const requiredFields = Collections.ClassName.required;

const allFilled = requiredFields.every(field => field.value.trim() !== '');

if (!allFilled) {
  requiredFields
    .filter(field => !field.value.trim())
    .forEach(field => {
      field.addClass('error').setStyle({ borderColor: 'red' });
    });
}
```

---

### Pattern 3: Event Handling

```javascript
// Add click handlers to all buttons
Collections.ClassName.button.on('click', function(e) {
  console.log('Button clicked:', this.textContent);
});

// Add hover effects
Collections.ClassName.card
  .on('mouseenter', function() {
    this.style.transform = 'scale(1.05)';
  })
  .on('mouseleave', function() {
    this.style.transform = '';
  });
```

---

### Pattern 4: Conditional Updates

```javascript
// Update only visible, enabled buttons
Collections.ClassName.button
  .visible()
  .filter(btn => !btn.disabled)
  .forEach(btn => {
    btn.addClass('active').setStyle({ opacity: '1' });
  });

// Or chain filtering methods
const activeButtons = Collections.ClassName.button
  .visible()
  .enabled();

activeButtons.forEach(btn => btn.addClass('clickable'));
```

---

### Pattern 5: Data Collection

```javascript
// Collect data from elements
const cards = Collections.ClassName.productCard;

const products = cards.map(card => ({
  id: card.dataset.productId,
  name: card.querySelector('.name')?.textContent,
  price: parseFloat(card.dataset.price),
  inStock: card.dataset.inStock === 'true'
}));

// Calculate totals
const totalValue = cards.reduce((sum, card) => {
  return sum + parseFloat(card.dataset.price || 0);
}, 0);
```

---

## 🔍 When to Use What

### Use ClassName when:
✅ Styling groups of elements
✅ Elements share a common class
✅ Working with component-based architecture

```javascript
const buttons = Collections.ClassName.button;
const cards = Collections.ClassName.card;
```

---

### Use TagName when:
✅ Operating on all elements of a type
✅ HTML tag-based operations
✅ Broad selections (all images, all links, etc.)

```javascript
const images = Collections.TagName.img;
const links = Collections.TagName.a;
```

---

### Use Name when:
✅ Form field operations
✅ Radio button groups
✅ Elements grouped by name attribute

```javascript
const emailInputs = Collections.Name.email;
const genderRadios = Collections.Name.gender;
```

---

### Use .update() when:
✅ Updating multiple collections
✅ Complex property changes
✅ Batch operations

```javascript
Collections.update({
  ClassName: {
    button: { style: { padding: '10px' } },
    card: { style: { borderRadius: '8px' } }
  }
});
```

---

### Use shorthand methods when:
✅ Simple, single operations
✅ Readable one-liners
✅ Chaining operations

```javascript
buttons.addClass('styled').setStyle({ padding: '10px' }).on('click', handler);
```

---

## 🎓 Learning Path

### Beginner (Start Here)
1. Read **[Access Methods](01_Access-Methods.md)** - Learn ClassName, TagName, Name
2. Try basic examples with collections
3. Practice accessing and iterating collections

### Intermediate
1. Read **[Bulk Operations](02_Bulk-Operations.md)** - Master `Collections.update()`
2. Read **[Array-like Methods](03_Array-like-Methods.md)** - Use `.forEach()`, `.map()`, `.filter()`
3. Practice filtering and transforming collections

### Advanced
1. Read **[DOM Manipulation & Filtering](04_DOM-Manipulation-and-Filtering.md)** - Shorthand methods
2. Read **[Utility & Helper Methods](05_Utility-Helper-Methods.md)** - Async operations and config
3. Build complex patterns with chaining and filtering

---

## 📖 Full Documentation

### Complete Guides

1. **[Access Methods](01_Access-Methods.md)** - All 3 access types
2. **[Bulk Operations](02_Bulk-Operations.md)** - The `.update()` method
3. **[Array-like Methods](03_Array-like-Methods.md)** - Array operations
4. **[DOM Manipulation & Filtering](04_DOM-Manipulation-and-Filtering.md)** - Shorthand methods
5. **[Utility & Helper Methods](05_Utility-Helper-Methods.md)** - Cache and configuration

---

## 🌟 Why Use Collections Helper?

### Before (Plain JavaScript)
```javascript
const buttons = document.getElementsByClassName('button');

for (let i = 0; i < buttons.length; i++) {
  buttons[i].style.padding = '10px';
  buttons[i].style.backgroundColor = 'blue';
  buttons[i].classList.add('styled');

  buttons[i].addEventListener('click', function() {
    console.log('Clicked');
  });
}
```

### After (DOM Helpers)
```javascript
Collections.ClassName.button
  .setStyle({ padding: '10px', backgroundColor: 'blue' })
  .addClass('styled')
  .on('click', () => console.log('Clicked'));
```

**Benefits:**
✅ 70% less code
✅ More readable
✅ Chainable methods
✅ Array-like operations
✅ Automatic caching

---

## 📝 Next Steps

1. **Start with basics**: Read [Access Methods](01_Access-Methods.md)
2. **Practice**: Try examples in your project
3. **Master arrays**: Study [Array-like Methods](03_Array-like-Methods.md)
4. **Optimize**: Learn [Utility & Helper Methods](05_Utility-Helper-Methods.md)

---

## 🔗 Links

- **[Documentation Home](../../README.md)**
- **[Core Methods List](../Core%20Methods%20List.md)**
- **[Elements Module](../Elements%20Module/README.md)**
- **[Selector Module](../Selector%20Module/)** (Coming Soon)

---

**[Back to Documentation Home](../../README.md)**

---

*Made with ❤️ for developers who love clean, efficient code*
