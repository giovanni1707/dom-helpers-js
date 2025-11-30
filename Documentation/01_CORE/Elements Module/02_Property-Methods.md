# Elements Module - Property Methods

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Part 2 of 4**: Property Methods for the Elements Helper
> Get and set element properties and attributes with shorthand syntax

---

## Table of Contents

1. [Overview](#overview)
2. [Understanding Properties vs Attributes](#understanding-properties-vs-attributes)
3. [Elements.setProperty() - Set Element Properties](#elementssetproperty---set-element-properties)
4. [Elements.getProperty() - Get Element Properties](#elementsgetproperty---get-element-properties)
5. [Elements.setAttribute() - Set Attributes](#elementssetattribute---set-attributes)
6. [Elements.getAttribute() - Get Attributes](#elementsgetattribute---get-attributes)
7. [Quick Reference Table](#quick-reference-table)
8. [Best Practices](#best-practices)

---

## Overview

The **Property Methods** provide convenient shortcuts for getting and setting **properties** and **attributes** on elements accessed by ID.

**Key features:**
✅ **Shorthand syntax** - Less verbose than traditional DOM methods
✅ **Safe access** - Returns fallback values for missing elements
✅ **Chainable** - Set multiple properties in sequence
✅ **Type-aware** - Handles different property types correctly

---

## Understanding Properties vs Attributes

Before diving in, understand the difference:

### Properties (JavaScript object properties)
Properties are **live, JavaScript object properties** on the DOM element:

```javascript
element.value          // Property
element.checked        // Property
element.disabled       // Property
element.className      // Property
```

Properties can be **any JavaScript type**: strings, numbers, booleans, objects, etc.

### Attributes (HTML attributes)
Attributes are **string values** in the HTML markup:

```html
<input id="email" type="text" value="default" disabled>
```

```javascript
element.getAttribute('value')      // "default" (initial HTML value)
element.value                       // Current property value (may differ)
```

---

### Key Differences Example

```html
<input id="username" value="John" type="text">
```

```javascript
const input = Elements.username;

// 1. Initial state
console.log(input.getAttribute('value'));  // "John" (HTML attribute)
console.log(input.value);                   // "John" (property)

// 2. User types "Jane"
console.log(input.getAttribute('value'));  // "John" (unchanged)
console.log(input.value);                   // "Jane" (current value)

// 3. The property reflects the current state, attribute reflects initial HTML
```

**Rule of thumb:**
- Use **properties** for dynamic, runtime values (checked, value, disabled)
- Use **attributes** for metadata or when you need to manipulate HTML markup (data-*, aria-*, custom attributes)

---

## `Elements.setProperty()` - Set Element Properties

### What it does

**Set a JavaScript property on an element** accessed by ID.

```javascript
Elements.setProperty(id, property, value)
```

**Parameters:**
- `id` (string) - Element ID
- `property` (string) - Property name (e.g., 'value', 'disabled', 'checked')
- `value` (any) - Value to set

**Returns:** The element (for chaining), or null if element doesn't exist

---

### Why use this?

It's a **shorthand** that combines element lookup and property setting:

```javascript
// Traditional JavaScript
const input = document.getElementById('username');
if (input) {
  input.value = 'John Doe';
}

// DOM Helpers shorthand
Elements.setProperty('username', 'value', 'John Doe');
```

---

### Examples

#### Form inputs
```javascript
// Set input value
Elements.setProperty('username', 'value', 'john@example.com');

// Enable/disable inputs
Elements.setProperty('submitBtn', 'disabled', true);
Elements.setProperty('submitBtn', 'disabled', false);

// Set checkbox state
Elements.setProperty('agreeCheckbox', 'checked', true);

// Set select option
Elements.setProperty('countrySelect', 'selectedIndex', 2);
```

#### Text content
```javascript
// Set text (using textContent property)
Elements.setProperty('header', 'textContent', 'Welcome!');

// Set HTML (using innerHTML property)
Elements.setProperty('container', 'innerHTML', '<p>Hello World</p>');
```

#### Element state
```javascript
// Hide element
Elements.setProperty('errorMsg', 'hidden', true);

// Set class name
Elements.setProperty('box', 'className', 'active highlighted');

// Set ID (unusual but possible)
Elements.setProperty('oldId', 'id', 'newId');
```

#### Chaining
```javascript
// Returns the element, so you can chain
Elements.setProperty('username', 'value', 'John')
  ?.update({ style: { borderColor: 'green' } });
```

---

### Advanced: Setting nested properties

```javascript
// Setting style properties (though .update() is preferred)
Elements.setProperty('header', 'style', { color: 'red', fontSize: '20px' });

// Setting dataset values
Elements.setProperty('card', 'dataset', { userId: '123', status: 'active' });
```

**Note:** For complex updates like styles, classList, or dataset, prefer using `.update()` method instead.

---

### Handling missing elements

```javascript
// Returns null if element doesn't exist (no error)
Elements.setProperty('nonExistent', 'value', 'test');  // null

// Safe to chain with optional chaining
Elements.setProperty('maybeExists', 'value', 'data')
  ?.update({ classList: { add: ['updated'] } });
```

---

## `Elements.getProperty()` - Get Element Properties

### What it does

**Retrieve a JavaScript property value** from an element accessed by ID.

```javascript
Elements.getProperty(id, property, fallback)
```

**Parameters:**
- `id` (string) - Element ID
- `property` (string) - Property name to retrieve
- `fallback` (any, optional) - Value to return if element doesn't exist or property is undefined

**Returns:** Property value, or fallback if not found

---

### Why use this?

It's a **safe shorthand** for accessing element properties:

```javascript
// Traditional JavaScript (verbose with null checks)
const input = document.getElementById('username');
const value = input ? input.value : '';

// DOM Helpers shorthand
const value = Elements.getProperty('username', 'value', '');
```

---

### Examples

#### Form values
```javascript
// Get input value
const email = Elements.getProperty('emailInput', 'value', '');

// Get checkbox state
const agreed = Elements.getProperty('termsCheckbox', 'checked', false);

// Get selected option index
const selectedCountry = Elements.getProperty('countrySelect', 'selectedIndex', 0);

// Get textarea content
const message = Elements.getProperty('messageArea', 'value', '');
```

#### Element state
```javascript
// Check if disabled
const isDisabled = Elements.getProperty('submitBtn', 'disabled', false);

// Check if hidden
const isHidden = Elements.getProperty('advancedPanel', 'hidden', true);

// Get current class name
const classes = Elements.getProperty('box', 'className', '');

// Get element type
const inputType = Elements.getProperty('myInput', 'type', 'text');
```

#### Content retrieval
```javascript
// Get text content
const heading = Elements.getProperty('header', 'textContent', 'Default Title');

// Get HTML content
const html = Elements.getProperty('container', 'innerHTML', '');

// Get inner text (rendered text)
const text = Elements.getProperty('paragraph', 'innerText', '');
```

---

### Custom fallback values

The fallback parameter is powerful for providing sensible defaults:

```javascript
// Numeric defaults
const count = Elements.getProperty('counter', 'value', 0);

// Boolean defaults
const isActive = Elements.getProperty('toggleBtn', 'checked', false);

// Object defaults
const bounds = Elements.getProperty('canvas', 'getBoundingClientRect', {
  width: 0, height: 0, top: 0, left: 0
});

// Array defaults
const options = Elements.getProperty('select', 'options', []);
```

---

### Validation with getProperty

```javascript
function validateForm() {
  const email = Elements.getProperty('email', 'value', '');
  const password = Elements.getProperty('password', 'value', '');
  const agreed = Elements.getProperty('terms', 'checked', false);

  if (!email) {
    return { valid: false, error: 'Email required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password too short' };
  }

  if (!agreed) {
    return { valid: false, error: 'Must accept terms' };
  }

  return { valid: true };
}
```

---

### Accessing complex properties

```javascript
// Get computed style (though getComputedStyle is better)
const color = Elements.getProperty('header', 'style')?.color;

// Get dataset
const userId = Elements.getProperty('userCard', 'dataset')?.userId;

// Get classList
const classes = Elements.getProperty('box', 'classList');
if (classes?.contains('active')) {
  console.log('Box is active');
}

// Get child elements
const children = Elements.getProperty('container', 'children', []);
console.log(`Container has ${children.length} children`);
```

---

## `Elements.setAttribute()` - Set Attributes

### What it does

**Set an HTML attribute** on an element accessed by ID.

```javascript
Elements.setAttribute(id, attribute, value)
```

**Parameters:**
- `id` (string) - Element ID
- `attribute` (string) - Attribute name (e.g., 'src', 'href', 'data-id')
- `value` (string) - Attribute value (converted to string)

**Returns:** The element (for chaining), or null if element doesn't exist

---

### Why use attributes?

Attributes are used for:
- **HTML metadata** - `data-*` attributes
- **Accessibility** - `aria-*` attributes, `role`, `tabindex`
- **Links and media** - `href`, `src`, `alt`
- **Form behavior** - `placeholder`, `pattern`, `required`
- **Custom attributes** - Any attribute you define

---

### Examples

#### Image attributes
```javascript
// Set image source
Elements.setAttribute('logo', 'src', '/images/logo.png');

// Set alt text
Elements.setAttribute('logo', 'alt', 'Company Logo');

// Set loading strategy
Elements.setAttribute('heroImage', 'loading', 'lazy');
```

#### Link attributes
```javascript
// Set href
Elements.setAttribute('downloadLink', 'href', '/files/document.pdf');

// Set target
Elements.setAttribute('externalLink', 'target', '_blank');

// Set rel
Elements.setAttribute('externalLink', 'rel', 'noopener noreferrer');
```

#### Data attributes
```javascript
// Set custom data attributes
Elements.setAttribute('userCard', 'data-user-id', '12345');
Elements.setAttribute('userCard', 'data-role', 'admin');
Elements.setAttribute('productCard', 'data-price', '29.99');

// These can be read with dataset:
// Elements.userCard.dataset.userId → "12345"
```

#### Accessibility (ARIA)
```javascript
// Set ARIA attributes
Elements.setAttribute('menu', 'aria-expanded', 'true');
Elements.setAttribute('alert', 'aria-live', 'polite');
Elements.setAttribute('tab', 'aria-selected', 'true');
Elements.setAttribute('button', 'aria-label', 'Close dialog');

// Set role
Elements.setAttribute('nav', 'role', 'navigation');
```

#### Form attributes
```javascript
// Set placeholder
Elements.setAttribute('email', 'placeholder', 'Enter your email');

// Set pattern
Elements.setAttribute('zipCode', 'pattern', '[0-9]{5}');

// Set required
Elements.setAttribute('username', 'required', 'true');

// Set autocomplete
Elements.setAttribute('password', 'autocomplete', 'current-password');
```

---

### Chaining

```javascript
// Set multiple attributes using chaining
Elements.setAttribute('profileImg', 'src', '/avatar.jpg')
  ?.setAttribute('alt', 'User Avatar')
  ?.update({ style: { borderRadius: '50%' } });
```

**Note:** For setting multiple attributes at once, use `.update()`:

```javascript
Elements.profileImg.update({
  setAttribute: {
    src: '/avatar.jpg',
    alt: 'User Avatar',
    loading: 'lazy'
  }
});
```

---

### Boolean attributes

Some attributes are **boolean** (present = true, absent = false):

```html
<button disabled>Click me</button>
<input required>
<video autoplay>
```

```javascript
// Set boolean attribute (pass any truthy value)
Elements.setAttribute('submitBtn', 'disabled', '');
Elements.setAttribute('submitBtn', 'disabled', 'disabled');
Elements.setAttribute('submitBtn', 'disabled', 'true');

// All three set the attribute (element becomes disabled)

// Remove boolean attribute
Elements.removeAttribute('submitBtn', 'disabled');
```

**Better approach for boolean attributes:**
```javascript
// Use properties instead
Elements.setProperty('submitBtn', 'disabled', true);   // Set
Elements.setProperty('submitBtn', 'disabled', false);  // Remove
```

---

## `Elements.getAttribute()` - Get Attributes

### What it does

**Retrieve an HTML attribute value** from an element accessed by ID.

```javascript
Elements.getAttribute(id, attribute, fallback)
```

**Parameters:**
- `id` (string) - Element ID
- `attribute` (string) - Attribute name to retrieve
- `fallback` (string, optional) - Value to return if element doesn't exist or attribute is missing

**Returns:** Attribute value (string), or fallback if not found

---

### Examples

#### Image attributes
```javascript
// Get image source
const logoSrc = Elements.getAttribute('logo', 'src', '/default-logo.png');

// Get alt text
const altText = Elements.getAttribute('banner', 'alt', 'Banner image');
```

#### Link attributes
```javascript
// Get link URL
const downloadUrl = Elements.getAttribute('downloadLink', 'href', '#');

// Get target
const linkTarget = Elements.getAttribute('externalLink', 'target', '_self');
```

#### Data attributes
```javascript
// Get data attributes
const userId = Elements.getAttribute('userCard', 'data-user-id', '0');
const status = Elements.getAttribute('userCard', 'data-status', 'inactive');

// Note: Using dataset is often cleaner:
const userId = Elements.userCard?.dataset.userId || '0';
```

#### ARIA attributes
```javascript
// Get ARIA state
const isExpanded = Elements.getAttribute('menu', 'aria-expanded', 'false');
const isSelected = Elements.getAttribute('tab1', 'aria-selected', 'false');
const label = Elements.getAttribute('closeBtn', 'aria-label', 'Close');
```

#### Form attributes
```javascript
// Get form validation attributes
const pattern = Elements.getAttribute('zipCode', 'pattern', '');
const placeholder = Elements.getAttribute('email', 'placeholder', '');
const maxLength = Elements.getAttribute('username', 'maxlength', '100');
```

---

### Using with validation

```javascript
function validateInput(inputId) {
  const pattern = Elements.getAttribute(inputId, 'pattern', '');
  const value = Elements.getProperty(inputId, 'value', '');

  if (pattern && !new RegExp(pattern).test(value)) {
    return { valid: false, error: 'Input format invalid' };
  }

  return { valid: true };
}
```

---

### Checking attribute existence

```javascript
// getAttribute returns null if attribute doesn't exist
const hasDataId = Elements.getAttribute('card', 'data-id') !== null;

// Or use the element directly
const card = Elements.card;
if (card?.hasAttribute('data-id')) {
  const id = card.getAttribute('data-id');
}
```

---

### Fallback strategies

```javascript
// Fallback to default value
const theme = Elements.getAttribute('app', 'data-theme', 'light');

// Fallback chain
const icon = Elements.getAttribute('button', 'data-icon',
  Elements.getAttribute('button', 'data-default-icon', 'star')
);

// Numeric fallback (convert string to number)
const count = parseInt(Elements.getAttribute('counter', 'data-count', '0'));

// Boolean fallback
const isActive = Elements.getAttribute('toggle', 'data-active', 'false') === 'true';
```

---

## Quick Reference Table

### Properties vs Attributes Methods

| Method | Purpose | Returns | Use For |
|--------|---------|---------|---------|
| **setProperty** | Set JS property | Element | Dynamic runtime values (value, checked, disabled) |
| **getProperty** | Get JS property | Property value | Reading current element state |
| **setAttribute** | Set HTML attribute | Element | HTML metadata (src, href, data-*, aria-*) |
| **getAttribute** | Get HTML attribute | String or fallback | Reading initial/metadata values |

---

### Common Property vs Attribute Examples

| Task | Use Property | Use Attribute |
|------|-------------|---------------|
| Set input value | `setProperty('input', 'value', 'text')` | ❌ |
| Get current checkbox state | `getProperty('cb', 'checked')` | ❌ |
| Set image src | ❌ | `setAttribute('img', 'src', 'url')` |
| Set data attribute | ❌ | `setAttribute('el', 'data-id', '123')` |
| Disable button | `setProperty('btn', 'disabled', true)` | `setAttribute('btn', 'disabled', '')` |
| Set ARIA label | ❌ | `setAttribute('btn', 'aria-label', 'Close')` |

---

## Best Practices

### 1. Choose properties for dynamic values

```javascript
// ✅ Use properties for form values
Elements.setProperty('email', 'value', user.email);
Elements.setProperty('agree', 'checked', true);

// ❌ Don't use attributes for this
Elements.setAttribute('email', 'value', user.email);  // Won't work as expected
```

### 2. Choose attributes for metadata

```javascript
// ✅ Use attributes for data/aria/metadata
Elements.setAttribute('card', 'data-user-id', userId);
Elements.setAttribute('menu', 'aria-expanded', 'true');

// ✅ Properties work here too, via dataset
Elements.setProperty('card', 'dataset', { userId });
```

### 3. Prefer `.update()` for multiple changes

```javascript
// ❌ Multiple method calls
Elements.setProperty('input', 'value', 'John');
Elements.setProperty('input', 'disabled', false);
Elements.setAttribute('input', 'placeholder', 'Name');

// ✅ Single update call
Elements.input.update({
  value: 'John',
  disabled: false,
  setAttribute: { placeholder: 'Name' }
});
```

### 4. Use fallbacks defensively

```javascript
// ✅ Always provide sensible fallbacks
const count = Elements.getProperty('counter', 'value', 0);
const theme = Elements.getAttribute('app', 'data-theme', 'light');

// ❌ Don't leave fallbacks undefined
const count = Elements.getProperty('counter', 'value');  // Could be undefined
```

### 5. Understand the attribute/property relationship

```javascript
// Setting an attribute doesn't always set the property
Elements.setAttribute('input', 'value', 'test');
console.log(Elements.getProperty('input', 'value'));  // May be different!

// For form controls, set properties directly
Elements.setProperty('input', 'value', 'test');  // ✅ Correct way
```

---

## Real-World Examples

### Form management
```javascript
function populateForm(userData) {
  Elements.setProperty('firstName', 'value', userData.firstName);
  Elements.setProperty('lastName', 'value', userData.lastName);
  Elements.setProperty('email', 'value', userData.email);
  Elements.setProperty('newsletter', 'checked', userData.subscribed);

  // Set metadata
  Elements.setAttribute('form', 'data-user-id', userData.id);
}

function getFormData() {
  return {
    id: Elements.getAttribute('form', 'data-user-id', ''),
    firstName: Elements.getProperty('firstName', 'value', ''),
    lastName: Elements.getProperty('lastName', 'value', ''),
    email: Elements.getProperty('email', 'value', ''),
    subscribed: Elements.getProperty('newsletter', 'checked', false)
  };
}
```

### Dynamic image gallery
```javascript
function updateGalleryImage(index, imageData) {
  const imgId = `gallery-img-${index}`;

  Elements.setAttribute(imgId, 'src', imageData.url);
  Elements.setAttribute(imgId, 'alt', imageData.description);
  Elements.setAttribute(imgId, 'data-image-id', imageData.id);

  // Better: use .update()
  Elements.get(imgId)?.update({
    setAttribute: {
      src: imageData.url,
      alt: imageData.description,
      'data-image-id': imageData.id
    }
  });
}
```

### Accessibility controls
```javascript
function toggleMenu(isOpen) {
  Elements.setAttribute('menuButton', 'aria-expanded', isOpen.toString());
  Elements.setAttribute('menu', 'aria-hidden', (!isOpen).toString());

  if (isOpen) {
    Elements.setAttribute('menu', 'aria-label', 'Main navigation menu');
    Elements.setProperty('menuButton', 'textContent', 'Close Menu');
  } else {
    Elements.setProperty('menuButton', 'textContent', 'Open Menu');
  }
}
```

---

## Next Steps

Continue to the other Elements documentation:

- **[Access Methods](01_Access-Methods.md)** - Getting elements by ID
- **[Bulk Operations](03_Bulk-Operations.md)** - `Elements.update()` for multiple elements
- **[Utility Methods](04_Utility-Methods.md)** - `stats()`, `clear()`, `destroy()`, `configure()`

---

**[Back to Documentation Home](../../README.md)**
