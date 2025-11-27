# Global Collection Indexed Updates Module - Available Methods

This module adds **indexed update support** to the **Global Collection Shortcuts** (`ClassName`, `TagName`, `Name`), enabling bulk and index-specific updates.

---

## 🎯 **Core Functionality**

### **Enhanced Global Shortcuts**

Automatically patches these global shortcuts to support indexed updates:
- ✅ `ClassName.button` → Enhanced collection with `.update()`
- ✅ `TagName.div` → Enhanced collection with `.update()`
- ✅ `Name.username` → Enhanced collection with `.update()`

```javascript
// Use ClassName with indexed updates
ClassName.button.update({
  // Bulk: Applied to ALL buttons
  disabled: false,
  classList: { add: 'btn-base' },
  
  // Index-specific: Individual buttons
  [0]: { textContent: 'Submit', style: { color: 'green' } },
  [1]: { textContent: 'Cancel', style: { color: 'red' } },
  [-1]: { textContent: 'Last', disabled: true }
});
```

---

## 📦 **GlobalShortcutsIndexedUpdates Object Methods**

### 1. **`updateCollectionWithIndices(collection, updates)`**

Core function that applies both bulk and indexed updates to a collection.

```javascript
const buttons = ClassName.button;

GlobalShortcutsIndexedUpdates.updateCollectionWithIndices(buttons, {
  // Bulk updates
  classList: { add: 'styled' },
  style: { padding: '10px' },
  
  // Index updates
  [0]: { textContent: 'First' },
  [1]: { textContent: 'Second' }
});
```

**Parameters:**
- `collection` (Object): Collection with `.length` property
- `updates` (Object): Object with bulk properties and/or numeric indices

**Returns:** The collection (for chaining)

**How it works:**
1. Separates numeric keys (indices) from non-numeric keys (bulk)
2. Applies bulk updates to ALL elements first
3. Applies index-specific updates second (can override bulk)

---

### 2. **`createEnhancedCollectionWithUpdate(collection)`**

Wraps a collection with indexed update support.

```javascript
// Get a raw collection
const rawCollection = document.getElementsByClassName('item');

// Enhance it
const enhanced = GlobalShortcutsIndexedUpdates.createEnhancedCollectionWithUpdate(rawCollection);

// Now it supports indexed updates
enhanced.update({
  style: { opacity: '1' },
  [0]: { style: { opacity: '0.5' } }
});
```

**Parameters:**
- `collection` (Object): Array-like collection (NodeList, HTMLCollection, etc.)

**Returns:** Enhanced collection with:
- `.update()` method with index support
- `.length` property
- Numeric indices (0, 1, 2, ...)
- Iterator support (`for...of`)
- Array methods (`.forEach()`, `.map()`, `.filter()`)

**Features Added:**
```javascript
const enhanced = GlobalShortcutsIndexedUpdates.createEnhancedCollectionWithUpdate(collection);

// New properties
enhanced.length                    // Collection length
enhanced[0]                        // First element (enhanced)
enhanced.update({ ... })           // Indexed update method
enhanced._hasIndexedUpdateSupport  // true

// Array methods
enhanced.forEach((el, i) => { ... });
enhanced.map(el => el.textContent);
enhanced.filter(el => el.disabled);

// Iteration
for (const el of enhanced) { ... }
```

---

### 3. **`patchGlobalShortcut(originalProxy)`**

Patches a global shortcut proxy to return enhanced collections.

```javascript
// Manually patch a custom proxy
const myProxy = new Proxy(myTarget, myHandler);
const patched = GlobalShortcutsIndexedUpdates.patchGlobalShortcut(myProxy);

// Now collections returned by patched proxy are enhanced
const collection = patched.someProperty;
collection.update({ [0]: { ... } }); // Works!
```

**Parameters:**
- `originalProxy` (Proxy): The proxy to patch

**Returns:** Patched proxy that auto-enhances collections

**Use Cases:**
- Creating custom collection shortcuts
- Extending existing shortcuts
- Building collection-based APIs

---

### 4. **`hasSupport(collection)`**

Check if a collection has indexed update support.

```javascript
const buttons = ClassName.button;

if (GlobalShortcutsIndexedUpdates.hasSupport(buttons)) {
  console.log('Collection supports indexed updates!');
  
  // Safe to use indexed updates
  buttons.update({
    [0]: { textContent: 'First' }
  });
}
```

**Parameters:**
- `collection` (Object): Collection to check

**Returns:** `boolean` - `true` if collection has `_hasIndexedUpdateSupport` flag

---

## 🌐 **Patched Global Shortcuts**

These shortcuts are **automatically patched** when the module loads:

### 1. **`ClassName`**

Access elements by class name with indexed updates.

```javascript
// Get all buttons by class
ClassName.btn.update({
  // Bulk: all buttons
  style: { padding: '12px 24px' },
  classList: { add: 'styled' },
  
  // Index: specific buttons
  [0]: { textContent: 'Primary', classList: { add: 'btn-primary' } },
  [1]: { textContent: 'Secondary', classList: { add: 'btn-secondary' } }
});

// Negative indices
ClassName['menu-item'].update({
  classList: { add: 'item' },
  [-1]: { classList: { add: 'last-item' } }
});
```

---

### 2. **`TagName`**

Access elements by tag name with indexed updates.

```javascript
// Update all paragraphs
TagName.p.update({
  // Bulk
  style: { lineHeight: '1.6', color: '#333' },
  
  // First paragraph special
  [0]: { 
    style: { fontSize: '20px', fontWeight: 'bold' },
    classList: { add: 'intro' }
  }
});

// All list items
TagName.li.update({
  classList: { add: 'list-item' },
  [0]: { classList: { add: 'first' } },
  [-1]: { classList: { add: 'last' } }
});
```

---

### 3. **`Name`**

Access elements by name attribute with indexed updates.

```javascript
// Update form fields by name
Name.username.update({
  // Bulk
  classList: { add: 'form-control' },
  setAttribute: { autocomplete: 'off' },
  
  // First input special
  [0]: { 
    placeholder: 'Enter your username',
    required: true
  }
});

// Radio buttons
Name.gender.update({
  classList: { add: 'radio-input' },
  [0]: { checked: true }
});
```

---

## 💡 **Usage Examples**

### Example 1: Button Collection
```javascript
ClassName.button.update({
  // Apply to ALL buttons
  style: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer'
  },
  classList: { add: 'btn' },
  
  // Specific buttons
  [0]: { 
    textContent: 'Save',
    style: { backgroundColor: '#28a745', color: 'white' },
    classList: { add: 'btn-success' }
  },
  [1]: { 
    textContent: 'Cancel',
    style: { backgroundColor: '#dc3545', color: 'white' },
    classList: { add: 'btn-danger' }
  },
  [2]: { 
    textContent: 'Reset',
    style: { backgroundColor: '#6c757d', color: 'white' },
    classList: { add: 'btn-secondary' }
  }
});
```

---

### Example 2: Card Grid
```javascript
ClassName.card.update({
  // Base styles for all cards
  style: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'white'
  },
  classList: { add: 'card-base' },
  
  // Featured card (first one)
  [0]: {
    style: {
      border: '2px solid gold',
      backgroundColor: '#fffacd',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    classList: { add: 'card-featured' }
  }
});
```

---

### Example 3: Table Rows
```javascript
TagName.tr.update({
  // All rows
  style: { height: '40px' },
  classList: { add: 'table-row' },
  
  // Header row
  [0]: {
    style: { 
      backgroundColor: '#f8f9fa',
      fontWeight: 'bold'
    },
    classList: { add: 'header-row' }
  },
  
  // Alternating row colors
  [1]: { style: { backgroundColor: '#fff' } },
  [2]: { style: { backgroundColor: '#f9f9f9' } },
  [3]: { style: { backgroundColor: '#fff' } },
  [4]: { style: { backgroundColor: '#f9f9f9' } }
});
```

---

### Example 4: Form Inputs
```javascript
Name.email.update({
  // All email inputs
  classList: { add: 'form-control' },
  setAttribute: {
    type: 'email',
    autocomplete: 'email'
  },
  
  // First email input
  [0]: {
    placeholder: 'Primary email address',
    required: true,
    dataset: { primary: 'true' }
  },
  
  // Second email input
  [1]: {
    placeholder: 'Secondary email (optional)',
    required: false
  }
});
```

---

### Example 5: Navigation Items
```javascript
ClassName['nav-link'].update({
  // All nav links
  style: {
    padding: '8px 16px',
    textDecoration: 'none',
    color: '#333',
    display: 'inline-block'
  },
  classList: { add: 'nav-item' },
  
  // Active link (first one)
  [0]: {
    classList: { add: 'active' },
    style: {
      color: '#007bff',
      fontWeight: 'bold',
      borderBottom: '2px solid #007bff'
    }
  }
});
```

---

### Example 6: Negative Indices
```javascript
TagName.li.update({
  // All list items
  style: { padding: '8px', margin: '4px 0' },
  
  // First item
  [0]: { 
    classList: { add: 'first-item' },
    style: { borderTop: 'none' }
  },
  
  // Last item (negative index)
  [-1]: { 
    classList: { add: 'last-item' },
    style: { borderBottom: 'none' }
  },
  
  // Second to last
  [-2]: { 
    classList: { add: 'almost-last' }
  }
});
```

---

## 🔍 **How It Works Internally**

### **Update Processing Flow:**

```javascript
ClassName.button.update({
  disabled: false,     // Bulk property
  classList: {...},    // Bulk property
  [0]: {...},         // Index property
  [1]: {...}          // Index property
})

// Internally:
// 1. Separate updates
//    bulkUpdates = { disabled: false, classList: {...} }
//    indexUpdates = { 0: {...}, 1: {...} }

// 2. Apply bulk to ALL elements
//    elements.forEach(el => applyUpdates(el, bulkUpdates))

// 3. Apply index updates (can override bulk)
//    applyUpdates(elements[0], indexUpdates[0])
//    applyUpdates(elements[1], indexUpdates[1])
```

---

## 🔧 **Internal Helper Functions**

### **`applyUpdatesToElement(element, updates)`**
Applies updates to a single element using:
1. `element.update()` if available
2. `EnhancedUpdateUtility.applyEnhancedUpdate()` if available
3. `applyBasicUpdate()` as fallback

### **`applyBasicUpdate(element, updates)`**
Fallback update implementation supporting:
- `style` objects
- `classList` operations
- `setAttribute`
- Direct property assignment

---

## ⚠️ **Dependencies Required**

### Load Order:
```html
<!-- 1. Core DOM Helpers (includes Collections) -->
<script src="01_dom-helpers.js"></script>

<!-- 2. Global Collection Shortcuts -->
<script src="global-collection-shortcuts.js"></script>

<!-- 3. This module (indexed updates) -->
<script src="07_dh-global-collection-indexed-updates.js"></script>
```

### Required Globals:
- ✅ `Collections` - From DOM Helpers core
- ✅ `ClassName` / `TagName` / `Name` - From global shortcuts
- ⚠️ `EnhancedUpdateUtility` - Optional (for enhanced updates)

---

## 📊 **Module Information**

```javascript
// Version
console.log(GlobalShortcutsIndexedUpdates.version); // "1.1.0"

// Check support
const buttons = ClassName.button;
console.log(GlobalShortcutsIndexedUpdates.hasSupport(buttons)); // true

// Access via DOMHelpers
DOMHelpers.GlobalShortcutsIndexedUpdates.updateCollectionWithIndices(collection, updates);
```

---

## 🎨 **Advanced Patterns**

### Pattern 1: Progressive Animation Delays
```javascript
ClassName.card.update({
  // Base animation for all
  style: {
    opacity: '0',
    transform: 'translateY(20px)',
    transition: 'all 0.3s ease'
  },
  
  // Staggered delays
  [0]: { style: { transitionDelay: '0s' } },
  [1]: { style: { transitionDelay: '0.1s' } },
  [2]: { style: { transitionDelay: '0.2s' } },
  [3]: { style: { transitionDelay: '0.3s' } },
  [4]: { style: { transitionDelay: '0.4s' } }
});

// Trigger animation
setTimeout(() => {
  ClassName.card.update({
    style: { opacity: '1', transform: 'translateY(0)' }
  });
}, 100);
```

---

### Pattern 2: Dynamic Index Updates
```javascript
const buttons = ClassName.btn;
const buttonTexts = ['Save', 'Update', 'Delete', 'Cancel'];

const updates = {
  classList: { add: 'btn-styled' },
  style: { padding: '10px 20px' }
};

// Dynamically add index updates
buttonTexts.forEach((text, index) => {
  updates[index] = { textContent: text };
});

buttons.update(updates);
```

---

### Pattern 3: Conditional Index Updates
```javascript
const items = ClassName.item;

const updates = {
  classList: { add: 'item-base' }
};

// Only update first 3 items with special styling
for (let i = 0; i < Math.min(3, items.length); i++) {
  updates[i] = {
    classList: { add: 'featured' },
    style: { border: '2px solid gold' }
  };
}

items.update(updates);
```

---

## 🐛 **Error Handling**

### Safe Index Access
```javascript
ClassName.button.update({
  [0]: { textContent: 'First' },
  [999]: { textContent: 'Out of bounds' } // Warning logged, skipped
});

// Console: "No element at index 999 (resolved to 999, collection has 3 elements)"
```

### Invalid Elements
```javascript
// If element at index is not valid DOM element
updates[2] = { textContent: 'Invalid' };

// Console: "Element at index 2 is not a valid DOM element"
```

### Empty Collections
```javascript
ClassName.nonexistent.update({
  [0]: { textContent: 'Test' }
});

// Console: ".update() called on empty collection"
```

---

## 📝 **Summary Table**

| Method | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| `updateCollectionWithIndices()` | collection, updates | collection | Apply bulk + indexed updates |
| `createEnhancedCollectionWithUpdate()` | collection | enhanced collection | Wrap collection with `.update()` |
| `patchGlobalShortcut()` | originalProxy | patched proxy | Patch proxy to auto-enhance |
| `hasSupport()` | collection | boolean | Check indexed update support |

---

## 🎯 **Key Features**

1. ✅ **Bulk + Index** updates in one call
2. ✅ **Negative indices** support (`[-1]` = last element)
3. ✅ **Auto-patching** of global shortcuts
4. ✅ **Chainable** - returns collection
5. ✅ **Safe** - validates indices and elements
6. ✅ **Fallback-ready** - works with or without EnhancedUpdateUtility
7. ✅ **Array methods** - `.forEach()`, `.map()`, `.filter()`
8. ✅ **Iterable** - works with `for...of`

---

This module makes working with global collection shortcuts (`ClassName`, `TagName`, `Name`) **incredibly powerful** by combining bulk operations with precise index-specific control! 🚀