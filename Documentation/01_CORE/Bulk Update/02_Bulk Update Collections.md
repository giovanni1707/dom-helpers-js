# Global Shortcuts ClassName,tagName,Name Bulk Update - Usage Documentation

## Overview
### A Powerful Approach To Use Bulk Update Method On Collections

The Global Shortcuts Bulk Update extension adds convenient `.update()` methods to `ClassName`, `TagName`, and `Name` shortcuts, allowing you to update multiple collections of elements in a single call.


## Basic Syntax

```javascript
ClassName.update({ 
  'class-name': { /* updates */ } 
});

TagName.update({ 
  'tag-name': { /* updates */ } 
});

Name.update({ 
  'name-attribute': { /* updates */ } 
});
```

---

## ClassName.update()

Update all elements with specific class names.

### Basic Properties

```javascript
ClassName.update({
  'btn': {
    textContent: 'Click Me',
    disabled: false,
    title: 'Submit button'
  },
  
  'alert': {
    textContent: 'Warning message',
    hidden: false
  }
});
```

### Styling

```javascript
ClassName.update({
  'card': {
    style: {
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  },
  
  'header': {
    style: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333'
    }
  }
});
```

### Class List Operations

```javascript
ClassName.update({
  'btn': {
    classList: {
      add: ['active', 'highlighted'],
      remove: 'disabled',
      toggle: 'selected'
    }
  },
  
  'menu-item': {
    classList: {
      replace: ['old-class', 'new-class']
    }
  }
});
```

### Attributes

```javascript
ClassName.update({
  'product-img': {
    setAttribute: {
      loading: 'lazy',
      alt: 'Product image'
    }
  },
  
  'input-field': {
    setAttribute: {
      placeholder: 'Enter text...',
      maxlength: '100'
    },
    removeAttribute: 'readonly'
  }
});
```

### Dataset (Data Attributes)

```javascript
ClassName.update({
  'product-card': {
    dataset: {
      productId: '12345',
      category: 'electronics',
      inStock: 'true'
    }
  }
});
```

### Event Listeners

```javascript
ClassName.update({
  'submit-btn': {
    addEventListener: ['click', (e) => {
      console.log('Submit clicked!', e.target);
      // Handle submit
    }]
  },
  
  'delete-btn': {
    addEventListener: {
      click: handleDelete,
      mouseover: (e) => e.target.style.opacity = '0.8',
      mouseout: (e) => e.target.style.opacity = '1'
    }
  }
});
```

### Combined Updates

```javascript
ClassName.update({
  'notification': {
    textContent: 'Update successful!',
    style: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '15px',
      borderRadius: '4px'
    },
    classList: { add: 'show' },
    dataset: { status: 'success' },
    setAttribute: { role: 'alert' }
  }
});
```

---

## TagName.update()

Update all elements with specific tag names.

### Basic Usage

```javascript
TagName.update({
  'p': {
    style: {
      lineHeight: '1.6',
      color: '#333',
      marginBottom: '1em'
    }
  },
  
  'h1': {
    style: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#222'
    }
  },
  
  'button': {
    style: { cursor: 'pointer' },
    classList: { add: 'interactive' }
  }
});
```

### Form Elements

```javascript
TagName.update({
  'input': {
    style: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px'
    },
    setAttribute: { autocomplete: 'off' }
  },
  
  'textarea': {
    style: {
      width: '100%',
      minHeight: '100px',
      resize: 'vertical'
    }
  },
  
  'select': {
    style: {
      padding: '8px',
      borderRadius: '4px'
    }
  }
});
```

### Media Elements

```javascript
TagName.update({
  'img': {
    setAttribute: {
      loading: 'lazy',
      decoding: 'async'
    },
    style: {
      maxWidth: '100%',
      height: 'auto'
    }
  },
  
  'video': {
    setAttribute: {
      controls: true,
      preload: 'metadata'
    }
  }
});
```

---

## Name.update()

Update all elements with specific name attributes.

### Form Fields

```javascript
Name.update({
  'username': {
    value: '',
    placeholder: 'Enter username...',
    disabled: false,
    classList: { remove: 'error' },
    style: { borderColor: '#4CAF50' }
  },
  
  'email': {
    placeholder: 'you@example.com',
    setAttribute: {
      type: 'email',
      autocomplete: 'email',
      required: true
    }
  },
  
  'password': {
    setAttribute: {
      minlength: '8',
      maxlength: '50'
    },
    classList: { add: 'secure-input' }
  }
});
```

### Radio Buttons & Checkboxes

```javascript
Name.update({
  'newsletter': {
    checked: true,
    disabled: false
  },
  
  'gender': {
    classList: { add: 'form-radio' },
    style: { marginRight: '5px' }
  }
});
```

---

## Advanced Features

### Empty Collections Warning

```javascript
// If no elements found, you get a warning in results
const results = ClassName.update({
  'nonexistent-class': {
    textContent: 'This will show a warning'
  }
});

console.log(results);
// {
//   'nonexistent-class': {
//     success: true,
//     elementsUpdated: 0,
//     warning: 'No elements found for "nonexistent-class"'
//   }
// }
```

### Results Object

```javascript
const results = ClassName.update({
  'btn': { textContent: 'Click' },
  'card': { style: { padding: '20px' } }
});

console.log(results);
// {
//   'btn': {
//     success: true,
//     elementsUpdated: 5,
//     collection: [HTMLCollection]
//   },
//   'card': {
//     success: true,
//     elementsUpdated: 3,
//     collection: [HTMLCollection]
//   }
// }
```

### Error Handling

```javascript
const results = ClassName.update({
  'valid-class': { textContent: 'OK' },
  'another-class': { invalidProperty: 'error' }
});

// Check for failures
Object.entries(results).forEach(([key, result]) => {
  if (!result.success) {
    console.error(`Failed to update ${key}: ${result.error}`);
  }
});
```

---

## Real-World Examples

### 1. Form Validation Feedback

```javascript
// Show validation errors
ClassName.update({
  'error-message': {
    textContent: 'Please correct the errors below',
    style: { 
      color: 'red',
      display: 'block'
    },
    classList: { add: 'show' }
  },
  
  'form-input': {
    classList: { add: 'error' },
    style: { borderColor: 'red' }
  }
});

// Clear validation errors
ClassName.update({
  'error-message': {
    style: { display: 'none' },
    classList: { remove: 'show' }
  },
  
  'form-input': {
    classList: { remove: 'error' },
    style: { borderColor: '#ccc' }
  }
});
```

### 2. Theme Switching

```javascript
// Apply dark theme
TagName.update({
  'body': {
    style: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff'
    }
  },
  
  'h1': {
    style: { color: '#ffffff' }
  },
  
  'p': {
    style: { color: '#cccccc' }
  },
  
  'a': {
    style: { color: '#4a9eff' }
  }
});
```

### 3. Loading States

```javascript
// Show loading
ClassName.update({
  'submit-btn': {
    disabled: true,
    textContent: 'Loading...',
    classList: { add: 'loading' }
  },
  
  'spinner': {
    style: { display: 'inline-block' }
  }
});

// Hide loading
ClassName.update({
  'submit-btn': {
    disabled: false,
    textContent: 'Submit',
    classList: { remove: 'loading' }
  },
  
  'spinner': {
    style: { display: 'none' }
  }
});
```

### 4. Accessibility Improvements

```javascript
TagName.update({
  'button': {
    setAttribute: {
      type: 'button',
      'aria-label': 'Action button'
    }
  },
  
  'img': {
    setAttribute: {
      alt: 'Descriptive text',
      role: 'img'
    }
  },
  
  'input': {
    setAttribute: {
      'aria-required': 'true',
      'aria-invalid': 'false'
    }
  }
});
```

---

## Tips & Best Practices

### ✅ Do's

- Use descriptive class/tag/name identifiers
- Group related updates together
- Check results object for errors
- Use for batch styling operations
- Combine with event listeners for interactivity

### ❌ Don'ts

- Don't update too many collections at once (performance)
- Don't rely on update order (updates may not be sequential)
- Don't use for single element updates (use `Id()` or `Elements` instead)
- Don't ignore the results object in production code

---

## Checking Support

```javascript
// Check if update methods are available
if (typeof ClassName.update === 'function') {
  console.log('✓ ClassName.update() is available');
}

// Use the utility
const support = GlobalShortcutsBulkUpdate.hasUpdateSupport();
console.log(support);
// { ClassName: true, TagName: true, Name: true }

// Get stats
const stats = GlobalShortcutsBulkUpdate.getStats();
console.log(stats);
// { shortcuts: 3, withUpdate: 3 }
```

---

## Compatibility

- ✅ Works with all modern browsers
- ✅ Compatible with all DOM Helpers enhancers
- ✅ Works alongside indexed updates
- ✅ Supports method chaining (returns results object)

---

## Version

**Current Version:** 1.1.0

**Release Date:** 2024

**License:** MIT