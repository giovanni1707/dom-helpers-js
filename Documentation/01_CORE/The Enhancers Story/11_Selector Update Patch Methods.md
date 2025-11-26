# DOM Helpers - Selector Update Patch Module (Index Selection)

## Available Methods & Usage Guide

This module enhances the core DOM Helpers library by adding **index-based access** and **advanced update capabilities** to collections.

---

## 🎯 **Core Concept**

This patch allows you to:
1. Access individual elements in collections with **automatic `.update()` enhancement**
2. Use **negative indices** to access elements from the end
3. Mix **index-specific updates** with **bulk updates** in a single call

---

## 🔧 **Module API Methods**

### 1. `IndexSelection.enhance(collection)`
**Purpose:** Manually enhance a collection with index-based access and update capabilities.

**Usage:**
```javascript
const collection = document.querySelectorAll('.item');
const enhanced = IndexSelection.enhance(collection);

// Now you can access enhanced elements by index
enhanced[0].update({ textContent: 'First' });
enhanced[1].update({ textContent: 'Second' });
```

---

### 2. `IndexSelection.enhanceElement(element)`
**Purpose:** Ensure a single element has the `.update()` method.

**Usage:**
```javascript
const element = document.getElementById('myElement');
const enhanced = IndexSelection.enhanceElement(element);

enhanced.update({
  textContent: 'Updated',
  style: { color: 'blue' }
});
```

---

### 3. `IndexSelection.reinitialize()`
**Purpose:** Re-run the initialization to hook into Collections and Selector helpers.

**Usage:**
```javascript
// If DOM Helpers loads after this module
IndexSelection.reinitialize();
```

---

### 4. `IndexSelection.isEnhanced(collection)`
**Purpose:** Check if a collection has been enhanced by this module.

**Returns:** `true` or `false`

**Usage:**
```javascript
const items = Collections.ClassName.item;

if (IndexSelection.isEnhanced(items)) {
  console.log('Collection is enhanced!');
}
```

---

### 5. `IndexSelection.at(collection, index)`
**Purpose:** Access an element at a specific index with `.update()` enhancement. Supports negative indices.

**Usage:**
```javascript
const items = queryAll('.item');

// Positive index
const first = IndexSelection.at(items, 0);
first.update({ textContent: 'First item' });

// Negative index (from end)
const last = IndexSelection.at(items, -1);
last.update({ textContent: 'Last item' });

const secondLast = IndexSelection.at(items, -2);
secondLast.update({ textContent: 'Second to last' });
```

---

### 6. `IndexSelection.update(collection, updates)`
**Purpose:** Apply updates to a collection (wrapper for enhanced `.update()` method).

**Usage:**
```javascript
const items = queryAll('.item');

IndexSelection.update(items, {
  0: { textContent: 'First' },
  1: { textContent: 'Second' },
  '-1': { textContent: 'Last' }
});
```

---

## 🚀 **Enhanced Collection Features**

Once this module is loaded, **all collections** from DOM Helpers automatically gain these features:

### 📌 **Feature 1: Index Access Returns Enhanced Elements**

**Before Patch:**
```javascript
const items = queryAll('.item');
items[0].textContent = 'Hello'; // Standard access
```

**After Patch:**
```javascript
const items = queryAll('.item');

// Element at index has .update() method automatically
items[0].update({
  textContent: 'Hello',
  style: { color: 'red' }
});

items[1].update({
  textContent: 'World',
  style: { color: 'blue' }
});
```

---

### 📌 **Feature 2: Negative Index Support via `.at()`**

**Usage:**
```javascript
const items = queryAll('.item');

// Access last element
items.at(-1).update({
  textContent: 'Last item',
  style: { fontWeight: 'bold' }
});

// Access second-to-last element
items.at(-2).update({
  textContent: 'Second to last',
  style: { fontStyle: 'italic' }
});

// Access first element (alternative to [0])
items.at(0).update({
  textContent: 'First item'
});
```

---

### 📌 **Feature 3: Mixed Index & Bulk Updates**

The enhanced `.update()` method can handle **three types of updates simultaneously**:

1. **Positive index updates** (`"0"`, `"1"`, `"2"`, etc.)
2. **Negative index updates** (`"-1"`, `"-2"`, etc.)
3. **Bulk updates** (any non-numeric key applies to ALL elements)

**Usage:**
```javascript
const items = queryAll('.item');

items.update({
  // Index-specific updates
  0: { 
    textContent: 'First item',
    style: { color: 'red' }
  },
  1: { 
    textContent: 'Second item',
    style: { color: 'green' }
  },
  '-1': { 
    textContent: 'Last item',
    style: { color: 'blue' }
  },
  
  // Bulk updates (applies to ALL items)
  classList: {
    add: ['enhanced']
  },
  dataset: {
    processed: 'true'
  }
});
```

**Result:**
- Element at index `0`: Gets specific updates + bulk updates
- Element at index `1`: Gets specific updates + bulk updates
- Element at index `-1` (last): Gets specific updates + bulk updates
- All other elements: Get only bulk updates

---

## 📋 **Complete Usage Examples**

### Example 1: Basic Index Access
```javascript
const buttons = queryAll('.btn');

// Access and update individual buttons
buttons[0].update({
  textContent: 'Submit',
  style: { backgroundColor: 'green' }
});

buttons[1].update({
  textContent: 'Cancel',
  style: { backgroundColor: 'red' }
});

// Last button using negative index
buttons.at(-1).update({
  textContent: 'Help',
  style: { backgroundColor: 'blue' }
});
```

---

### Example 2: Mixed Updates
```javascript
const listItems = queryAll('li');

listItems.update({
  // First item gets special styling
  0: {
    textContent: '🥇 First Place',
    style: { 
      fontWeight: 'bold',
      color: 'gold'
    }
  },
  
  // Last item gets different styling
  '-1': {
    textContent: '📌 Featured Item',
    style: {
      fontStyle: 'italic',
      color: 'purple'
    }
  },
  
  // All items get these updates
  classList: {
    add: ['list-item', 'enhanced']
  },
  dataset: {
    version: '2.0'
  }
});
```

---

### Example 3: Form Field Updates
```javascript
const inputs = queryAll('input[type="text"]');

inputs.update({
  // First input
  0: {
    value: 'John Doe',
    placeholder: 'Enter full name'
  },
  
  // Second input
  1: {
    value: 'john@example.com',
    placeholder: 'Enter email'
  },
  
  // Last input
  '-1': {
    value: '555-1234',
    placeholder: 'Enter phone'
  },
  
  // All inputs get these styles
  style: {
    padding: '10px',
    borderRadius: '4px'
  },
  
  // All inputs get this class
  classList: {
    add: ['form-control']
  }
});
```

---

### Example 4: Dynamic List Styling
```javascript
const products = queryAll('.product');

products.update({
  // First product - featured
  0: {
    classList: {
      add: ['featured', 'highlight']
    },
    dataset: {
      position: 'first',
      featured: 'true'
    },
    style: {
      border: '3px solid gold',
      boxShadow: '0 4px 8px rgba(255, 215, 0, 0.3)'
    }
  },
  
  // Last product - new arrival
  '-1': {
    classList: {
      add: ['new-arrival']
    },
    dataset: {
      position: 'last',
      badge: 'NEW'
    },
    style: {
      border: '2px dashed blue'
    }
  },
  
  // All products
  dataset: {
    category: 'electronics'
  }
});
```

---

### Example 5: Collections from DOM Helpers
```javascript
// Works with Collections.ClassName
const menuItems = Collections.ClassName.menuItem;

menuItems[0].update({
  textContent: 'Home',
  classList: { add: ['active'] }
});

menuItems.at(-1).update({
  textContent: 'Logout',
  classList: { add: ['danger'] }
});

// Works with Collections.TagName
const paragraphs = Collections.TagName.p;

paragraphs.update({
  0: { style: { fontSize: '18px' } },
  '-1': { style: { fontSize: '14px' } },
  style: { lineHeight: '1.6' } // All paragraphs
});

// Works with Selector
const cards = Selector.queryAll('.card');

cards[0].update({
  innerHTML: '<h3>Featured Card</h3>'
});
```

---

### Example 6: Working with Empty Collections
```javascript
const items = queryAll('.non-existent');

// Safe to call - no errors
items.update({
  0: { textContent: 'First' }
});
// Console info: "Collection is empty"

// Safe index access
const first = items[0]; // undefined
const last = items.at(-1); // null
```

---

### Example 7: Check Enhancement Status
```javascript
const items = queryAll('.item');

if (IndexSelection.isEnhanced(items)) {
  console.log('✅ Collection has index selection features');
  
  // Can safely use advanced features
  items[0].update({ textContent: 'Enhanced!' });
  items.at(-1).update({ textContent: 'Also enhanced!' });
}
```

---

### Example 8: Manual Enhancement
```javascript
// Get a native NodeList
const native = document.querySelectorAll('.item');

// Manually enhance it
const enhanced = IndexSelection.enhance(native);

// Now it has all features
enhanced[0].update({ textContent: 'First' });
enhanced.at(-1).update({ textContent: 'Last' });

enhanced.update({
  0: { style: { color: 'red' } },
  '-1': { style: { color: 'blue' } }
});
```

---

## 🔄 **How It Works**

### Initialization Process:
1. Module hooks into `Collections.helper` and `Selector.helper`
2. Intercepts `_enhanceCollection` and `_enhanceNodeList` methods
3. Wraps collections with a **Proxy** for enhanced index access
4. Adds **index-aware update** method

### Proxy Behavior:
```javascript
// When you access by index:
const element = collection[0];

// Proxy intercepts and:
// 1. Gets the element from internal collection
// 2. Ensures it has .update() method
// 3. Returns the enhanced element
```

### Update Method Logic:
```javascript
collection.update({
  0: { ... },      // → Applied to element at index 0
  1: { ... },      // → Applied to element at index 1
  '-1': { ... },   // → Applied to last element
  style: { ... }   // → Applied to ALL elements (non-numeric key)
});
```

---

## ⚙️ **Configuration & Initialization**

### Auto-Initialization:
The module automatically initializes when:
- DOM is ready (if loading)
- Immediately (if DOM already loaded)

**Console output:**
```
[Index Selection] v2.0.0 initialized - Individual element access enhanced
```

---

### Manual Re-initialization:
```javascript
// If you need to re-hook after DOM Helpers loads
IndexSelection.reinitialize();
```

---

## ⚠️ **Important Notes**

1. **String vs Number Indices:**
   - Numeric strings (`"0"`, `"1"`, `"-1"`) are treated as indices
   - Non-numeric strings are treated as bulk update keys

2. **Negative Index Range:**
   - `-1` = last element
   - `-2` = second-to-last element
   - If out of bounds, a warning is logged

3. **Enhancement Marking:**
   - Collections are marked with `_indexSelectionEnhanced = true`
   - Prevents double-enhancement

4. **Performance:**
   - Proxy adds minimal overhead
   - Updates are applied efficiently (no unnecessary loops)

5. **Compatibility:**
   - Works with `Collections.ClassName`, `Collections.TagName`, `Collections.Name`
   - Works with `Selector.query`, `Selector.queryAll`
   - Works with `queryAll()` and `querySelectorAll()`

---

## 🎯 **Key Benefits**

✅ **Cleaner syntax** for updating specific elements in collections  
✅ **Negative indices** for easy last-element access  
✅ **Mix index-specific and bulk updates** in one call  
✅ **Automatic enhancement** - no manual setup needed  
✅ **Chainable operations** - all methods return the collection  
✅ **Safe empty collections** - no errors on empty sets  
✅ **Full backward compatibility** - doesn't break existing code  

---

## 📦 **Version Information**

**Version:** 2.0.0  
**License:** MIT  
**Dependencies:** Requires DOM Helpers core library  
**Module Name:** `IndexSelection` / `dh-selector-update-patch`