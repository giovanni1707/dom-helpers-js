# Index Selection Module - Available Methods

This is a **very minimal patching module** that bridges the **Selector helper** with the **BulkPropertyUpdaters** module.

---

## 🎯 **Core Functionality**

### **What It Does**

This module automatically enhances collections returned by `Selector.queryAll()` with bulk property update capabilities from the `BulkPropertyUpdaters` module.

---

## 📦 **Module Structure**

### **IIFE (Immediately Invoked Function Expression)**

```javascript
(function patchSelectorForBulkUpdates() {
  // Auto-executes when loaded
  // Patches Selector.queryAll if both dependencies exist
})();
```

**No direct methods to call** - this module works automatically when loaded!

---

## 🔧 **What Gets Patched**

### **`Selector.queryAll()`**

When you use `Selector.queryAll()`, the returned collection is automatically enhanced:

```javascript
// Before patch (if BulkPropertyUpdaters not integrated)
const items = Selector.queryAll('.item');
// items has basic .update() method

// After patch (when this module is loaded)
const items = Selector.queryAll('.item');
// items has ENHANCED bulk property update capabilities
```

---

## 📋 **Dependencies Required**

This module requires **TWO other modules** to be loaded first:

### 1. **Selector Module**
Must have `Selector.queryAll()` available globally

### 2. **BulkPropertyUpdaters Module**
Must have `BulkPropertyUpdaters.enhanceCollectionInstance()` available

---

## 💡 **Usage Examples**

### Example 1: Basic Usage (Automatic)

```javascript
// Just load the modules in order:
// 1. DOM Helpers Core
// 2. Selector Module
// 3. BulkPropertyUpdaters Module
// 4. Index Selection Module (this one)

// Now use Selector.queryAll() normally
const buttons = Selector.queryAll('.btn');

// The collection is automatically enhanced!
// You can use bulk update features from BulkPropertyUpdaters
buttons.update({
  textContent: ['Submit', 'Cancel', 'Reset'],
  style: { padding: '10px' }
});
```

---

### Example 2: Verifying Enhancement

```javascript
const items = Selector.queryAll('.item');

// Check if enhancement worked
if (items._hasBulkPropertySupport) {
  console.log('Collection has bulk property updates!');
  // Use bulk features...
}
```

---

### Example 3: Using Enhanced Features

```javascript
// Assuming BulkPropertyUpdaters provides bulk array updates
const cards = Selector.queryAll('.card');

// Set different text for each card
cards.update({
  textContent: [
    'First Card',
    'Second Card', 
    'Third Card'
  ],
  classList: {
    add: 'card-enhanced'
  }
});
```

---

## 🔍 **How It Works Internally**

### **Patching Process:**

1. **Checks Dependencies**
   ```javascript
   if (typeof Selector === 'undefined' || 
       typeof BulkPropertyUpdaters === 'undefined') {
     return; // Skip patching if dependencies missing
   }
   ```

2. **Stores Original Function**
   ```javascript
   const originalQueryAll = Selector.queryAll;
   ```

3. **Replaces with Enhanced Version**
   ```javascript
   Selector.queryAll = function(...args) {
     const result = originalQueryAll.apply(this, args);
     return BulkPropertyUpdaters.enhanceCollectionInstance(result);
   };
   ```

---

## ⚙️ **What Gets Enhanced**

The returned collection from `Selector.queryAll()` gets enhanced with capabilities from `BulkPropertyUpdaters`, which typically includes:

### **Bulk Property Updates**
```javascript
// Example of what BulkPropertyUpdaters might enable:
const items = Selector.queryAll('.item');

items.update({
  // Array values applied to each element sequentially
  textContent: ['One', 'Two', 'Three'],
  
  // Single value applied to all
  className: 'item-enhanced',
  
  // Style objects
  style: {
    color: ['red', 'green', 'blue'], // Different per element
    padding: '10px'                   // Same for all
  }
});
```

---

## 📊 **Module Information**

### **Properties**
- **No direct exports** - works through side effects
- **No version number** - simple patcher
- **No public API** - automatic enhancement

### **Detection**
```javascript
// Check if module loaded (indirectly)
const testCollection = Selector.queryAll('.test');
const isPatched = typeof testCollection._hasBulkPropertySupport !== 'undefined';

if (isPatched) {
  console.log('Index Selection module is active');
}
```

---

## ⚠️ **Important Notes**

### 1. **Silent Failure**
If dependencies are missing, the module does **nothing** (no errors):
```javascript
// If Selector or BulkPropertyUpdaters undefined
// Module just returns without patching
// No console warnings or errors
```

### 2. **One-Time Patch**
The patch happens **once** when the script loads:
```javascript
// This is NOT a function you call
// It's an IIFE that runs immediately
(function patchSelectorForBulkUpdates() {
  // Runs once on script load
})();
```

### 3. **Not Reversible**
Once patched, `Selector.queryAll()` stays patched:
```javascript
// No built-in way to unpatch
// Would need to manually restore:
Selector.queryAll = originalQueryAll; // If you saved it
```

---

## 🎨 **Common Use Cases**

### Use Case 1: Sequential Content Updates
```javascript
const sections = Selector.queryAll('.section');

sections.update({
  textContent: [
    'Introduction',
    'Main Content',
    'Conclusion'
  ]
});
```

### Use Case 2: Progressive Styling
```javascript
const items = Selector.queryAll('.item');

items.update({
  style: {
    opacity: ['1', '0.9', '0.8', '0.7'],
    fontSize: ['20px', '18px', '16px', '14px']
  }
});
```

### Use Case 3: Mixed Updates
```javascript
const cards = Selector.queryAll('.card');

cards.update({
  // Individual values per card
  textContent: ['Card 1', 'Card 2', 'Card 3'],
  
  // Same for all cards
  classList: { add: 'card-styled' },
  
  // Mixed array/single values
  style: {
    backgroundColor: ['#ff0', '#0f0', '#00f'], // Different
    padding: '15px'                            // Same
  }
});
```

---

## 🔧 **Troubleshooting**

### Problem 1: Patch Not Working
```javascript
// Check dependencies
console.log(typeof Selector);              // Should be 'object'
console.log(typeof BulkPropertyUpdaters);  // Should be 'object'
console.log(typeof Selector.queryAll);     // Should be 'function'
```

### Problem 2: Enhancement Not Applied
```javascript
// Test if collection is enhanced
const test = Selector.queryAll('.test');
console.log(test._hasBulkPropertySupport); // Should be true

// If undefined, BulkPropertyUpdaters.enhanceCollectionInstance() 
// might not be setting the flag
```

---

## 📝 **Summary**

| Feature | Value |
|---------|-------|
| **Type** | Auto-executing patcher |
| **Dependencies** | `Selector`, `BulkPropertyUpdaters` |
| **Exports** | None (side effects only) |
| **API** | No direct methods |
| **Purpose** | Bridge Selector with BulkPropertyUpdaters |
| **Load Order** | AFTER both dependencies |

---

## 🎯 **Key Takeaways**

1. ✅ **Automatic** - No manual calls needed
2. ✅ **Transparent** - Works behind the scenes
3. ✅ **Dependency-safe** - Silently skips if deps missing
4. ✅ **One-time** - Patches once on load
5. ⚠️ **Requires BulkPropertyUpdaters** - Make sure it's loaded!

---

### **Note:**
Since you only provided this small patcher module, I cannot show the **exact methods** that `BulkPropertyUpdaters.enhanceCollectionInstance()` adds. If you provide the **BulkPropertyUpdaters module**, I can give you a complete breakdown of all the bulk update features it enables! 🚀