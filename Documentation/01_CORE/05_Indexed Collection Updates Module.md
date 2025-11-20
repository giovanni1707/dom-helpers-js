# Indexed Collection Updates Module - Available Methods

This module enhances collections (from `querySelectorAll`, `qsa`, etc.) to support **index-specific updates** alongside bulk updates.

---

## 🎯 **Core Functionality**

### **Enhanced `.update()` Method**

The module patches collection `.update()` to support **two types of updates simultaneously**:

1. **Bulk Updates** - Applied to ALL elements
2. **Index-Specific Updates** - Applied to individual elements by index

```javascript
// BOTH bulk AND indexed updates in one call!
qsa('.btn').update({
  // Bulk: Applied to ALL buttons
  classList: { add: 'btn-base' },
  style: { padding: '10px' },
  
  // Index-specific: Override for individual buttons
  [0]: { textContent: 'First', style: { color: 'red' } },
  [1]: { textContent: 'Second', style: { color: 'blue' } },
  [2]: { textContent: 'Third', style: { color: 'green' } }
});
```

---

## 📦 **IndexedUpdates Object Methods**

### 1. **`updateCollectionWithIndices(collection, updates)`**

The core function that processes indexed updates on collections.

```javascript
const buttons = qsa('.btn');

IndexedUpdates.updateCollectionWithIndices(buttons, {
  disabled: true,              // Bulk: all buttons disabled
  [0]: { disabled: false },    // Index: first button enabled
  [1]: { textContent: 'Special' }
});
```

**Parameters:**
- `collection` (NodeList/Collection): Collection to update
- `updates` (Object): Object with bulk properties and/or numeric indices

**Returns:** The collection (for chaining)

---

### 2. **`patchCollectionUpdate(collection)`**

Manually patch a collection to add indexed update support.

```javascript
// Get a raw collection
const items = document.querySelectorAll('.item');

// Patch it
IndexedUpdates.patchCollectionUpdate(items);

// Now it supports indexed updates
items.update({
  className: 'item-base',
  [0]: { className: 'item-base first' }
});
```

**Parameters:**
- `collection` (NodeList/Collection): Collection to enhance

**Returns:** Enhanced collection with `.update()` support

**Alias:** `IndexedUpdates.patch(collection)`

---

### 3. **`hasSupport(collection)`**

Check if a collection already has indexed update support.

```javascript
const buttons = qsa('.btn');

if (IndexedUpdates.hasSupport(buttons)) {
  console.log('Collection supports indexed updates!');
}

// Returns true if collection has _hasIndexedUpdateSupport flag
```

**Parameters:**
- `collection` (NodeList/Collection): Collection to check

**Returns:** `boolean` - `true` if collection supports indexed updates

---

### 4. **`restore()`**

Restore original `querySelectorAll` and `qsa` functions (remove patching).

```javascript
// Remove indexed update patches
IndexedUpdates.restore();

// Now querySelectorAll/qsa work as before the module loaded
const items = qsa('.item');
// items.update() will NOT support indexed updates anymore
```

**Parameters:** None

**Returns:** `undefined`

---

## 🔧 **Automatic Patching**

The module **automatically patches** these functions when loaded:

### Patched Functions:
1. ✅ `querySelectorAll()` - Enhanced with indexed update support
2. ✅ `qsa()` - Enhanced with indexed update support
3. ✅ `Collections.update()` - Works with indexed updates
4. ✅ `Selector.update()` - Works with indexed updates
5. ✅ `EnhancedUpdateUtility.enhanceCollectionWithUpdate()` - Auto-patches collections

---

## 💡 **Usage Examples**

### Example 1: Basic Indexed Updates
```javascript
// Get collection
const buttons = qsa('.btn');

// Update with indices
buttons.update({
  // Bulk update (all buttons)
  style: { padding: '10px 20px' },
  classList: { add: 'btn-styled' },
  
  // Individual updates by index
  [0]: { 
    textContent: 'Submit',
    style: { backgroundColor: 'green' }
  },
  [1]: { 
    textContent: 'Cancel',
    style: { backgroundColor: 'red' }
  },
  [-1]: { 
    textContent: 'Last Button',
    disabled: true
  }
});
```

---

### Example 2: Negative Indices
```javascript
const items = qsa('.list-item');

items.update({
  classList: { add: 'list-item-base' },
  
  [0]: { classList: { add: 'first' } },     // First item
  [-1]: { classList: { add: 'last' } },     // Last item
  [-2]: { classList: { add: 'second-last' } } // Second to last
});
```

---

### Example 3: Override Bulk with Index
```javascript
const cards = qsa('.card');

cards.update({
  // ALL cards get this style
  style: { 
    border: '1px solid #ccc',
    padding: '15px'
  },
  
  // But the first card gets special styling
  [0]: { 
    style: { 
      border: '2px solid gold',
      padding: '20px',
      backgroundColor: '#fffacd'
    }
  }
});
```

---

### Example 4: Form Field Updates
```javascript
const inputs = qsa('input[type="text"]');

inputs.update({
  // All inputs
  classList: { add: 'form-control' },
  setAttribute: { autocomplete: 'off' },
  
  // Specific inputs
  [0]: { placeholder: 'Enter your name' },
  [1]: { placeholder: 'Enter your email' },
  [2]: { placeholder: 'Enter your phone' }
});
```

---

### Example 5: Event Handlers with Indices
```javascript
const buttons = qsa('.action-btn');

buttons.update({
  // All buttons
  style: { cursor: 'pointer' },
  classList: { add: 'interactive' },
  
  // Specific handlers
  [0]: {
    addEventListener: ['click', () => console.log('First clicked!')]
  },
  [1]: {
    addEventListener: ['click', () => console.log('Second clicked!')]
  }
});
```

---

### Example 6: Mixing Collections API
```javascript
// Using Collections helper with indices
Collections.ClassName.btn.update({
  disabled: false,        // All buttons enabled
  [0]: { disabled: true } // Except first one
});

// Using Selector helper with indices
Selector.queryAll('.item').update({
  style: { opacity: '1' },
  [2]: { style: { opacity: '0.5' } }
});
```

---

## 🎨 **Advanced Patterns**

### Pattern 1: Alternating Styles
```javascript
const rows = qsa('tr');

rows.update({
  style: { backgroundColor: '#fff' },
  
  // Every other row
  [1]: { style: { backgroundColor: '#f5f5f5' } },
  [3]: { style: { backgroundColor: '#f5f5f5' } },
  [5]: { style: { backgroundColor: '#f5f5f5' } }
});
```

---

### Pattern 2: Progressive Enhancements
```javascript
const cards = qsa('.card');

cards.update({
  // Base styles for all
  classList: { add: 'card-base' },
  style: { 
    opacity: '0',
    transform: 'translateY(20px)'
  },
  
  // Progressive delays for animation
  [0]: { style: { transitionDelay: '0s' } },
  [1]: { style: { transitionDelay: '0.1s' } },
  [2]: { style: { transitionDelay: '0.2s' } },
  [3]: { style: { transitionDelay: '0.3s' } }
});
```

---

### Pattern 3: Dynamic Configuration
```javascript
const items = qsa('.item');

const config = {
  // Bulk config
  classList: { add: 'processed' },
  dataset: { processed: 'true' }
};

// Add index-specific configs dynamically
items.forEach((item, index) => {
  config[index] = {
    dataset: { index: String(index) },
    textContent: `Item ${index + 1}`
  };
});

items.update(config);
```

---

## 🔍 **How It Works Internally**

### Update Processing Order:
1. **Separates updates** into bulk and indexed
2. **Applies bulk updates** to ALL elements first
3. **Applies indexed updates** second (can override bulk)

```javascript
// This update object:
{
  color: 'blue',        // Bulk (non-numeric key)
  disabled: true,       // Bulk (non-numeric key)
  [0]: { color: 'red' }, // Index (numeric key)
  [1]: { color: 'green' } // Index (numeric key)
}

// Becomes:
// Step 1: Apply {color: 'blue', disabled: true} to ALL
// Step 2: Apply {color: 'red'} to element[0]
// Step 3: Apply {color: 'green'} to element[1]
```

---

## ⚠️ **Important Notes**

### 1. **Load Order**
```html
<!-- Correct order -->
<script src="01_dom-helpers.js"></script>
<script src="04_dh-global-query.js"></script>
<script src="05_dh-indexed-collection-updates.js"></script> <!-- LAST -->
```

### 2. **Numeric Keys Only**
Only **pure numeric indices** are treated as indexed updates:
```javascript
// ✅ Indexed updates (numeric)
{ [0]: {...}, [1]: {...}, [-1]: {...} }

// ❌ Bulk updates (non-numeric)
{ color: '...', disabled: true, textContent: '...' }
```

### 3. **Negative Indices**
Supports Python-style negative indices:
```javascript
const items = qsa('.item'); // 5 items

items.update({
  [-1]: { ... },  // Last item (index 4)
  [-2]: { ... }   // Second to last (index 3)
});
```

---

## 📊 **Module Information**

```javascript
console.log(IndexedUpdates.version); // "1.1.0"

// Check if module is available
if (typeof IndexedUpdates !== 'undefined') {
  console.log('Indexed updates available!');
}

// Access via DOMHelpers
DOMHelpers.IndexedUpdates.patch(myCollection);
```

---

## 🎯 **Key Benefits**

1. ✅ **Bulk + Individual** updates in one call
2. ✅ **Negative indices** support
3. ✅ **Auto-patches** global query functions
4. ✅ **Chainable** - returns collection
5. ✅ **Type-safe** - validates indices
6. ✅ **Fallback-ready** - works with or without main bundle

---

This module is perfect for scenarios where you need to apply **common styling/behavior to all elements** while **customizing specific items** by their position! 🚀