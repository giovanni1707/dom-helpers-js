[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Bulk Update Feature Guide

## Overview

The Bulk Update feature allows you to update multiple DOM elements in a single method call, making your code more concise, readable, and maintainable. This feature is available for all three main APIs: `Elements`, `Collections`, and `Selector`.

## Benefits

- **Reduced Code Duplication**: Update multiple elements with one call
- **Improved Readability**: Declarative syntax makes code intentions clear
- **Better Performance**: Batch updates are more efficient than individual operations
- **Consistent API**: Same update syntax across all helper methods
- **Enhanced Maintainability**: Easier to manage complex UI updates

## API Methods

### 1. Elements.update()

Update multiple elements by their IDs in a single call.

#### Syntax

```javascript
Elements.update({
  elementId1: updateObject1,
  elementId2: updateObject2,
  // ... more elements
});
```

#### Example: Simple Updates

```html
<body>
  <main id="card" role="main" aria-labelledby="title">
    <h1 id="title">Original page title</h1>
    <p id="description">
      This is the original description text — it will be updated by
      Elements.update().
    </p>

    <button id="submitBtn" disabled>Waiting…</button>

    <div class="meta" aria-live="polite">Bulk update demo for DOM Helpers</div>
  </main>
</body>
```

```javascript
Elements.update({
  title: {
    textContent: "New Title",
    style: { color: "blue", fontSize: "24px" },
  },
  description: {
    textContent: "Updated description",
    style: { color: "#333", fontSize: "16px" },
  },
  submitBtn: {
    textContent: "Submit Now",
    disabled: false,
  },
});
```

#### Example: Complex Updates with Event Listeners

```javascript
Elements.update({
  saveBtn: {
    textContent: "Save Changes",
    style: { backgroundColor: "#28a745", color: "white" },
    addEventListener: [
      "click",
      () => {
        console.log("Saving...");
        // Save logic here
      },
    ],
  },
  cancelBtn: {
    textContent: "Cancel",
    style: { backgroundColor: "#dc3545", color: "white" },
    addEventListener: [
      "click",
      () => {
        console.log("Cancelled");
        // Cancel logic here
      },
    ],
  },
  statusMessage: {
    textContent: "Ready to save",
    style: { color: "#17a2b8" },
  },
});
```

#### Return Value

Returns an object with results for each element ID:

```javascript
{
  elementId1: { success: true, element: HTMLElement },
  elementId2: { success: false, error: "Element not found" },
  // ...
}
```

### 2. Collections.update()

Update multiple collections of elements (by class, tag, or name) in a single call.

#### Syntax

```javascript
Collections.update({
  "type:value": updateObject,
  // ... more collections
});
```

**Supported Types:**

- `class:className` or `classname:className` - Elements with class name
- `tag:tagName` or `tagname:tagName` - Elements with tag name
- `name:elementName` - Elements with name attribute
- `className` (shorthand) - Assumes class if no prefix

#### Example: Multiple Collections

```javascript
Collections.update({
  "class:btn": {
    style: { padding: "10px 20px", borderRadius: "4px" },
  },
  "tag:p": {
    style: { lineHeight: "1.6", marginBottom: "15px" },
  },
  "name:username": {
    disabled: false,
    placeholder: "Enter your username",
  },
});
```

#### Example: Shorthand Syntax

```javascript
// Assumes 'card' is a class name
Collections.update({
  card: {
    style: {
      padding: "20px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
    },
  },
});
```

#### Return Value

Returns an object with results for each collection:

```javascript
{
  'class:btn': {
    success: true,
    collection: EnhancedCollection,
    elementsUpdated: 5
  },
  'tag:p': {
    success: true,
    collection: EnhancedCollection,
    elementsUpdated: 12
  },
  // ...
}
```

### 3. Selector.update()

Update multiple elements/collections using CSS selectors in a single call.

#### Syntax

```javascript
Selector.update({
  cssSelector1: updateObject1,
  cssSelector2: updateObject2,
  // ... more selectors
});
```

#### Example: Various Selectors

```javascript
Selector.update({
  "#header": {
    textContent: "Welcome!",
    style: { fontSize: "32px", fontWeight: "bold" },
  },
  ".alert": {
    style: {
      backgroundColor: "#fff3cd",
      padding: "15px",
      borderRadius: "4px",
    },
  },
  'input[type="text"]': {
    placeholder: "Enter text here...",
    style: { borderColor: "#28a745" },
  },
  ".container > .row": {
    style: { marginBottom: "20px" },
  },
});
```

#### Example: Form Styling

```javascript
Selector.update({
  'input[type="email"]': {
    placeholder: "your.email@example.com",
    style: {
      borderColor: "#17a2b8",
      padding: "10px",
      borderRadius: "4px",
    },
  },
  'input[type="password"]': {
    placeholder: "Enter secure password",
    style: {
      borderColor: "#6c757d",
      padding: "10px",
      borderRadius: "4px",
    },
  },
  'button[type="submit"]': {
    textContent: "Sign In",
    style: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "12px 30px",
    },
  },
});
```

#### Return Value

Returns an object with results for each selector:

```javascript
{
  '#header': {
    success: true,
    elements: EnhancedCollection,
    elementsUpdated: 1
  },
  '.alert': {
    success: true,
    elements: EnhancedCollection,
    elementsUpdated: 3
  },
  // ...
}
```

## Update Object Properties

All bulk update methods support the same update properties as the individual `.update()` method:

### Basic Properties

```javascript
{
  textContent: 'New text',
  innerHTML: '<strong>HTML</strong> content',
  value: 'input value',
  disabled: true,
  checked: false,
  // ... any DOM property
}
```

### Style Updates

```javascript
{
  style: {
    color: 'blue',
    backgroundColor: '#f0f0f0',
    fontSize: '16px',
    padding: '10px',
    // ... any CSS property (camelCase)
  }
}
```

### Class List Operations

```javascript
{
  classList: {
    add: ['class1', 'class2'],
    remove: ['old-class'],
    toggle: 'active',
    replace: ['old-class', 'new-class']
  }
}
```

### Attributes

```javascript
{
  setAttribute: {
    'data-id': '123',
    'aria-label': 'Close button'
  },
  removeAttribute: ['hidden', 'disabled']
}
```

### Event Listeners

```javascript
{
  addEventListener: [
    "click",
    (e) => {
      console.log("Clicked!", e);
    },
  ];
}
```

Or with options:

```javascript
{
  addEventListener: {
    click: (e) => console.log('Click'),
    mouseenter: (e) => console.log('Enter')
  }
}
```

### Dataset

```javascript
{
  dataset: {
    userId: '123',
    action: 'submit',
    value: 'custom'
  }
}
```

## Error Handling

All bulk update methods handle errors gracefully:

```javascript
const results = Elements.update({
  existingElement: { textContent: "Updated!" },
  nonExistentElement: { textContent: "This will fail" },
});

console.log(results);
// {
//   existingElement: { success: true, element: HTMLElement },
//   nonExistentElement: { success: false, error: "Element with ID 'nonExistentElement' not found" }
// }
```

### Checking Results

```javascript
const results = Elements.update({
  /* ... */
});

// Check if all updates succeeded
const allSuccessful = Object.values(results).every((r) => r.success);

// Get failed updates
const failed = Object.entries(results)
  .filter(([_, result]) => !result.success)
  .map(([id, result]) => ({ id, error: result.error }));

if (failed.length > 0) {
  console.error("Failed updates:", failed);
}
```

## Real-World Examples

### Example 1: Form Validation Feedback

```javascript
function showValidationErrors(errors) {
  const updates = {};

  Object.entries(errors).forEach(([fieldId, errorMsg]) => {
    updates[fieldId] = {
      style: { borderColor: "#dc3545", backgroundColor: "#fff5f5" },
      setAttribute: { "aria-invalid": "true" },
    };
    updates[`${fieldId}Error`] = {
      textContent: errorMsg,
      style: { color: "#dc3545", display: "block" },
    };
  });

  Elements.update(updates);
}

// Usage
showValidationErrors({
  email: "Please enter a valid email",
  password: "Password must be at least 8 characters",
});
```

### Example 2: Theme Switcher

```javascript
function applyTheme(theme) {
  if (theme === "dark") {
    Collections.update({
      "class:card": {
        style: {
          backgroundColor: "#2d3748",
          color: "#f7fafc",
          borderColor: "#4a5568",
        },
      },
      "class:btn-primary": {
        style: {
          backgroundColor: "#4299e1",
          color: "white",
        },
      },
    });
  } else {
    // Light theme
    Collections.update({
      "class:card": {
        style: {
          backgroundColor: "white",
          color: "#2d3748",
          borderColor: "#e2e8f0",
        },
      },
      "class:btn-primary": {
        style: {
          backgroundColor: "#3182ce",
          color: "white",
        },
      },
    });
  }
}
```

### Example 3: Dynamic Dashboard Update

```javascript
function updateDashboard(data) {
  Elements.update({
    totalUsers: {
      textContent: data.users.toLocaleString(),
      style: { fontSize: "32px", fontWeight: "bold" },
    },
    totalRevenue: {
      textContent: `$${data.revenue.toLocaleString()}`,
      style: { fontSize: "32px", color: "#28a745" },
    },
    activeProjects: {
      textContent: data.projects,
      style: { fontSize: "32px" },
    },
    lastUpdate: {
      textContent: `Last updated: ${new Date().toLocaleTimeString()}`,
      style: { fontSize: "12px", color: "#6c757d" },
    },
  });
}
```

### Example 4: Bulk Form Reset

```javascript
function resetForm() {
  Selector.update({
    'input[type="text"]': {
      value: "",
      style: { borderColor: "#ced4da", backgroundColor: "white" },
      removeAttribute: ["aria-invalid"],
    },
    'input[type="email"]': {
      value: "",
      style: { borderColor: "#ced4da", backgroundColor: "white" },
    },
    ".error-message": {
      textContent: "",
      style: { display: "none" },
    },
    'button[type="submit"]': {
      disabled: false,
      textContent: "Submit",
    },
  });
}
```

## Performance Considerations

1. **Batch Updates**: Bulk updates are optimized for performance by processing all updates in a single pass
2. **Fine-Grained Detection**: The library only updates properties that have actually changed
3. **Event Deduplication**: Event listeners are automatically deduplicated to prevent multiple attachments
4. **Efficient Selectors**: Use specific selectors to minimize the number of elements matched

## Best Practices

1. **Use Specific Identifiers**: Use IDs for unique elements, classes for groups
2. **Group Related Updates**: Bundle related UI changes into a single bulk update call
3. **Handle Errors**: Always check the return value to ensure all updates succeeded
4. **Avoid Overly Complex Selectors**: Keep selectors simple and efficient
5. **Leverage Type Prefixes**: Use `class:`, `tag:`, `name:` prefixes for clarity in Collections.update()

## Logging

Enable logging to debug bulk updates:

```javascript
// Enable logging for Elements
Elements.configure({ enableLogging: true });

// Enable logging for Collections
Collections.configure({ enableLogging: true });

// Enable logging for Selector
Selector.configure({ enableLogging: true });

// Now bulk updates will log summary information
Elements.update({
  /* ... */
});
// Console: [Elements] Bulk update completed: 3 successful, 1 failed
```

## Migration from Individual Updates

### Before (Individual Updates)

```javascript
Elements.title.update({ textContent: "New Title" });
Elements.description.update({ textContent: "New Description" });
Elements.submitBtn.update({ textContent: "Submit", disabled: false });
```

### After (Bulk Update)

```javascript
Elements.update({
  title: { textContent: "New Title" },
  description: { textContent: "New Description" },
  submitBtn: { textContent: "Submit", disabled: false },
});
```

## Browser Support

The bulk update feature works in all modern browsers and environments that support the base DOM Helpers library:

- Chrome 15+
- Firefox 4+
- Safari 5+
- Edge (all versions)
- IE 9+

## Conclusion

The Bulk Update feature significantly improves code organization and readability when working with multiple DOM elements. By consolidating updates into single method calls, you can write cleaner, more maintainable code while maintaining the full power and flexibility of the DOM Helpers library.
