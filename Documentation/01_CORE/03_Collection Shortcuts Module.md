# DOM Helpers - Collection Shortcuts Module

## 📚 Overview

The **Collection Shortcuts** module provides global shortcuts for accessing collections without the `Collections.` prefix, plus enhanced index-based element selection (including negative indices).

---

## 🎯 Available Global Shortcuts

### 1. **ClassName**
Access elements by CSS class name.

```javascript
// Instead of: Collections.ClassName.button
// Use:
ClassName.button              // Returns collection of all buttons

// Index access
ClassName.button[0]           // First button
ClassName.button[1]           // Second button
ClassName.button[2]           // Third button
ClassName.button[-1]          // Last button
ClassName.button[-2]          // Second to last button
```

**Complex class names with dots:**
```javascript
ClassName['container.item']       // All elements with class "container item"
ClassName['container.item'][0]    // First element
ClassName['container.item'][-1]   // Last element
```

### 2. **TagName**
Access elements by HTML tag name.

```javascript
// Instead of: Collections.TagName.div
// Use:
TagName.div                   // All divs
TagName.p                     // All paragraphs
TagName.button                // All buttons
TagName.input                 // All inputs

// Index access
TagName.div[0]                // First div
TagName.div[1]                // Second div
TagName.p[-1]                 // Last paragraph
TagName.input[2]              // Third input
```

### 3. **Name**
Access elements by `name` attribute.

```javascript
// Instead of: Collections.Name.username
// Use:
Name.username                 // All elements with name="username"
Name.email                    // All elements with name="email"
Name.password                 // All elements with name="password"

// Index access
Name.username[0]              // First username field
Name.email[1]                 // Second email field
Name.country[-1]              // Last country selector
```

---

## 🔑 Key Features

### 1. **Negative Index Support**
Access elements from the end of the collection using negative indices.

```javascript
const buttons = ClassName.btn;

buttons[0]    // First button
buttons[-1]   // Last button
buttons[-2]   // Second to last button
```

### 2. **Auto-Enhancement**
Elements retrieved via index are automatically enhanced with the `.update()` method.

```javascript
// Element is already enhanced when accessed
ClassName.btn[0].update({
  textContent: "Click Me!",
  style: { backgroundColor: "blue" }
});
```

### 3. **Function Call Support**
Still supports the original function-style calls.

```javascript
// Function-style calls still work
ClassName('btn')              // Same as ClassName.btn
TagName('div')                // Same as TagName.div
Name('username')              // Same as Name.username
```

---

## 📝 Practical Examples

### Example 1: Basic Collection Access
```javascript
// Get all buttons with class "primary"
const primaryButtons = ClassName.primary;

console.log(primaryButtons.length);  // Number of elements
console.log(primaryButtons[0]);      // First element
console.log(primaryButtons[-1]);     // Last element
```

### Example 2: Working with Specific Elements
```javascript
// Update the first button
ClassName.btn[0].update({
  textContent: "First Button",
  style: { backgroundColor: "green" }
});

// Update the last button
ClassName.btn[-1].update({
  textContent: "Last Button",
  style: { backgroundColor: "red" }
});

// Update the middle button (assuming 3 buttons)
ClassName.btn[1].update({
  textContent: "Middle Button",
  style: { backgroundColor: "blue" }
});
```

### Example 3: Iterating Collections
```javascript
// Get all paragraph elements
const paragraphs = TagName.p;

// Use collection methods
paragraphs.forEach((p, index) => {
  console.log(`Paragraph ${index}:`, p.textContent);
});

// Or access by index
for (let i = 0; i < paragraphs.length; i++) {
  paragraphs[i].update({
    style: { color: i % 2 === 0 ? "blue" : "red" }
  });
}
```

### Example 4: Form Elements
```javascript
// Get all input fields with name="email"
const emailInputs = Name.email;

// Update the first email input
emailInputs[0].update({
  value: "user@example.com",
  placeholder: "Enter your email"
});

// Validate the last email input
if (emailInputs[-1].value === "") {
  emailInputs[-1].update({
    style: { borderColor: "red" }
  });
}
```

### Example 5: Dynamic Content Management
```javascript
// Get all cards
const cards = ClassName.card;

// Update first card
cards[0].update({
  innerHTML: "<h3>First Card</h3><p>This is the first card</p>",
  style: { borderColor: "green" }
});

// Update last card
cards[-1].update({
  innerHTML: "<h3>Last Card</h3><p>This is the last card</p>",
  style: { borderColor: "red" }
});

// Hide middle cards
for (let i = 1; i < cards.length - 1; i++) {
  cards[i].update({ hidden: true });
}
```

### Example 6: Navigation Menus
```javascript
// Get all navigation items
const navItems = ClassName['nav-item'];

// Highlight the first item as active
navItems[0].update({
  classList: { add: ['active'] },
  setAttribute: { 'aria-current': 'page' }
});

// Disable the last item
navItems[-1].update({
  classList: { add: ['disabled'] },
  setAttribute: { 'aria-disabled': 'true' }
});
```

### Example 7: Table Rows
```javascript
// Get all table rows
const rows = TagName.tr;

// Update header row (first)
rows[0].update({
  style: { 
    backgroundColor: "#333", 
    color: "white",
    fontWeight: "bold"
  }
});

// Alternate row colors
for (let i = 1; i < rows.length; i++) {
  rows[i].update({
    style: { 
      backgroundColor: i % 2 === 0 ? "#f5f5f5" : "white" 
    }
  });
}

// Update footer row (last)
rows[-1].update({
  style: { 
    backgroundColor: "#e0e0e0",
    fontStyle: "italic"
  }
});
```

### Example 8: Gallery Items
```javascript
// Get all gallery images
const galleryImages = ClassName['gallery-img'];

// Enlarge the first image
galleryImages[0].update({
  style: { 
    width: "400px",
    height: "300px",
    border: "3px solid gold"
  },
  title: "Featured Image"
});

// Add click handlers to all images
galleryImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    console.log(`Image ${index} clicked`);
  });
});
```

### Example 9: Complex Selectors
```javascript
// Elements with multiple classes (space-separated)
const containers = ClassName['container fluid'];

// Access specific container
containers[0].update({
  style: { maxWidth: "1200px" }
});

containers[-1].update({
  style: { maxWidth: "100%" }
});
```

### Example 10: Conditional Updates
```javascript
// Get all status indicators
const statusIndicators = ClassName['status-indicator'];

// Update based on position
if (statusIndicators.length > 0) {
  // First indicator: green (active)
  statusIndicators[0].update({
    style: { backgroundColor: "green" },
    textContent: "Active"
  });
  
  // Last indicator: red (inactive)
  if (statusIndicators.length > 1) {
    statusIndicators[-1].update({
      style: { backgroundColor: "red" },
      textContent: "Inactive"
    });
  }
  
  // Middle indicators: yellow (pending)
  for (let i = 1; i < statusIndicators.length - 1; i++) {
    statusIndicators[i].update({
      style: { backgroundColor: "yellow" },
      textContent: "Pending"
    });
  }
}
```

---

## 🔄 Comparison: Before & After

### Before (Without Shortcuts)
```javascript
// Verbose syntax
const firstButton = Collections.ClassName.btn.first();
const lastButton = Collections.ClassName.btn.last();
const allDivs = Collections.TagName.div;

firstButton.update({ textContent: "First" });
lastButton.update({ textContent: "Last" });
```

### After (With Shortcuts)
```javascript
// Concise syntax
ClassName.btn[0].update({ textContent: "First" });
ClassName.btn[-1].update({ textContent: "Last" });
const allDivs = TagName.div;
```

---

## ⚙️ Advanced Usage

### Combining with Collection Methods
```javascript
// Get collection
const items = ClassName.item;

// Use collection methods
const visibleItems = items.visible();
const firstVisible = visibleItems[0];

// Chain operations
ClassName.btn
  .filter(btn => !btn.disabled)
  .forEach((btn, i) => {
    btn.update({ textContent: `Button ${i + 1}` });
  });
```

### Working with Live Collections
```javascript
// Collections are live - they update automatically
const buttons = ClassName.btn;
console.log(buttons.length);  // e.g., 5

// Add a new button to DOM
document.body.appendChild(
  createElement('button', { className: 'btn', textContent: 'New' })
);

console.log(buttons.length);  // Now 6 (automatically updated!)
console.log(buttons[-1].textContent);  // "New"
```

### Negative Index Edge Cases
```javascript
const items = ClassName.item;

// Safe access with fallback
const lastItem = items[-1] || null;
if (lastItem) {
  lastItem.update({ style: { fontWeight: "bold" } });
}

// Check collection length first
if (items.length >= 3) {
  items[-3].update({ /* ... */ });  // Third from end
}
```

---

## 🎭 Special Cases

### 1. Empty Collections
```javascript
const nonExistent = ClassName.doesNotExist;
console.log(nonExistent.length);     // 0
console.log(nonExistent[0]);         // undefined
console.log(nonExistent[-1]);        // undefined
```

### 2. Single Element Collections
```javascript
const unique = ClassName.unique;  // Only 1 element
console.log(unique[0]);           // First (and only) element
console.log(unique[-1]);          // Same element (last is also first)
```

### 3. Class Names with Special Characters
```javascript
// Use bracket notation for complex class names
ClassName['container-fluid']        // Single class with dash
ClassName['container fluid']        // Multiple classes (space)
ClassName['btn.btn-primary'][0]     // Multiple classes (dot notation)
```

---

## 🚨 Important Notes

1. **Index Returns Elements, Not Collections**
   ```javascript
   ClassName.btn        // Returns collection
   ClassName.btn[0]     // Returns single element
   ```

2. **Negative Indices Calculate from End**
   ```javascript
   items[-1]   // Last element (same as items[items.length - 1])
   items[-2]   // Second to last
   ```

3. **Auto-Enhancement of Elements**
   - Elements accessed via index automatically have `.update()` method
   - No need to manually enhance them

4. **Live Collections**
   - Collections update automatically when DOM changes
   - Index access always reflects current state

5. **Backwards Compatible**
   - Function-style calls still work: `ClassName('btn')`
   - Original `Collections.*` API unchanged

---

## 📊 Method Chaining Support

```javascript
// Collections support chaining
ClassName.btn
  .forEach((btn, i) => {
    btn.update({
      textContent: `Button ${i}`,
      dataset: { index: i }
    });
  });

// Individual elements from index
ClassName.btn[0]
  .update({ textContent: "Click Me" })
  .addEventListener('click', () => console.log('Clicked!'));
```

This module dramatically simplifies collection access and makes index-based element selection intuitive and powerful!