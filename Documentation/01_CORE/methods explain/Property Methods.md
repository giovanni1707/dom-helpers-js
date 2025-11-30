# DOM Helpers Library - Property Methods Documentation

## Table of Contents

### Elements Property Methods
1. [Elements.setProperty(id, property, value) - Set Element Property](#elementssetpropertyid-property-value---set-element-property)
2. [Elements.getProperty(id, property, fallback) - Get Element Property](#elementsgetpropertyid-property-fallback---get-element-property)
3. [Elements.setAttribute(id, attribute, value) - Set Attribute](#elementssetattributeid-attribute-value---set-attribute)
4. [Elements.getAttribute(id, attribute, fallback) - Get Attribute](#elementsgetattributeid-attribute-fallback---get-attribute)

---

## Elements.setProperty(id, property, value) - Set Element Property

### What it does
This method sets a DOM property on an element by its ID using a functional style. It modifies JavaScript properties (like `value`, `textContent`, `disabled`, `checked`) rather than HTML attributes. Returns `true` if successful, `false` if the element doesn't exist or the property can't be set.

### How it works (conceptually within the library)
Under the hood, it essentially does:

```javascript
const element = document.getElementById(id);
if (element && property in element) {
  element[property] = value;
  return true;
}
return false;
```

**Key distinction:** This sets **properties** (JavaScript), not **attributes** (HTML).
- Properties: `element.value`, `element.disabled` (can be any type)
- Attributes: `<input value="text">` (always strings)

### When you use it
You typically call this method when you want to:

✔ **Functional property updates**
Example: Set properties without storing element references.

```javascript
Elements.setProperty('username', 'value', 'john_doe');
Elements.setProperty('submitBtn', 'disabled', true);
```

✔ **Conditional updates with validation**
Example: Check if the update succeeded.

```javascript
if (Elements.setProperty('notification', 'textContent', 'Success!')) {
  console.log('Notification updated');
}
```

✔ **Batch operations**
Example: Update multiple elements in a loop.

```javascript
['field1', 'field2', 'field3'].forEach(id => {
  Elements.setProperty(id, 'value', '');
});
```

### Example (simple)

```javascript
// Set input value
Elements.setProperty('email', 'value', 'user@example.com');

// Disable button
Elements.setProperty('submit', 'disabled', true);

// Update text
Elements.setProperty('status', 'textContent', 'Loading...');
```

### Example (practical inside a real DOM Helpers workflow)

```javascript
// Clear all form fields
function clearForm() {
  ['username', 'password', 'email'].forEach(id => {
    Elements.setProperty(id, 'value', '');
  });
}

// Toggle loading state
function setLoading(isLoading) {
  Elements.setProperty('submit-btn', 'disabled', isLoading);
  Elements.setProperty('status', 'textContent', isLoading ? 'Loading...' : 'Ready');
}
```

---

## Elements.getProperty(id, property, fallback) - Get Element Property

### What it does
This method retrieves a DOM property value from an element by its ID. It provides safe access with a fallback value if the element doesn't exist or the property is undefined. This is the read companion to `setProperty()`.

### How it works (conceptually within the library)
Under the hood, it essentially does:

```javascript
const element = document.getElementById(id);
if (element && property in element) {
  return element[property];
}
return fallback;
```

The fallback prevents `null` or `undefined` returns, making your code safer.

### When you use it
You typically call this method when you want to:

✔ **Safe property access**
Example: Get values without risking errors.

```javascript
const username = Elements.getProperty('username', 'value', '');
const isDisabled = Elements.getProperty('submit', 'disabled', false);
```

✔ **Form data collection**
Example: Gather input values with defaults.

```javascript
const formData = {
  email: Elements.getProperty('email', 'value', ''),
  terms: Elements.getProperty('terms', 'checked', false)
};
```

✔ **State inspection**
Example: Check element states before operations.

```javascript
if (!Elements.getProperty('submit', 'disabled', false)) {
  submitForm();
}
```

### Example (simple)

```javascript
// Get input value
const email = Elements.getProperty('email', 'value', '');

// Check if checkbox is checked
const agreed = Elements.getProperty('terms', 'checked', false);

// Get text content
const status = Elements.getProperty('status', 'textContent', 'Unknown');
```

### Example (practical inside a real DOM Helpers workflow)

```javascript
// Collect form data
function getFormData() {
  return {
    username: Elements.getProperty('username', 'value', ''),
    email: Elements.getProperty('email', 'value', ''),
    newsletter: Elements.getProperty('newsletter', 'checked', false)
  };
}

// Validate form
function isFormValid() {
  const username = Elements.getProperty('username', 'value', '');
  const email = Elements.getProperty('email', 'value', '');
  return username.length > 0 && email.includes('@');
}
```

---

## Elements.setAttribute(id, attribute, value) - Set Attribute

### What it does
This method sets an HTML attribute on an element by its ID. Unlike `setProperty()`, this modifies the actual HTML attributes that appear in markup. It's essential for data attributes, ARIA labels, custom attributes, and source URLs. Returns `true` if successful, `false` if the element doesn't exist.

### How it works (conceptually within the library)
Under the hood, it essentially does:

```javascript
const element = document.getElementById(id);
if (element) {
  element.setAttribute(attribute, value);
  return true;
}
return false;
```

**Key distinction:** This sets **attributes** (HTML), not **properties** (JavaScript).
- Attributes are always strings: `<input value="5">`
- Custom/data attributes only exist as attributes: `data-user-id="123"`

### When you use it
You typically call this method when you want to:

✔ **Set data attributes**
Example: Store metadata on elements.

```javascript
Elements.setAttribute('product', 'data-product-id', '12345');
Elements.setAttribute('card', 'data-user-name', 'John Doe');
```

✔ **Set ARIA attributes**
Example: Accessibility labels and states.

```javascript
Elements.setAttribute('menu', 'aria-expanded', 'true');
Elements.setAttribute('dialog', 'aria-hidden', 'false');
```

✔ **Set source/URL attributes**
Example: Image sources, link hrefs.

```javascript
Elements.setAttribute('avatar', 'src', '/images/user.jpg');
Elements.setAttribute('link', 'href', '/download.pdf');
```

### Example (simple)

```javascript
// Set image source
Elements.setAttribute('logo', 'src', '/images/logo.png');

// Set data attribute
Elements.setAttribute('card', 'data-card-id', '42');

// Set ARIA state
Elements.setAttribute('dialog', 'aria-hidden', 'false');
```

### Example (practical inside a real DOM Helpers workflow)

```javascript
// Update product card
function updateProduct(productId, data) {
  Elements.setAttribute('product-card', 'data-product-id', productId);
  Elements.setAttribute('product-card', 'data-price', data.price);
  Elements.setAttribute('product-image', 'src', data.imageUrl);
  Elements.setAttribute('product-image', 'alt', data.name);
}

// Toggle accordion
function toggleAccordion(id, isOpen) {
  Elements.setAttribute(`accordion-${id}`, 'aria-expanded', String(isOpen));
  Elements.setAttribute(`panel-${id}`, 'aria-hidden', String(!isOpen));
}
```

---

## Elements.getAttribute(id, attribute, fallback) - Get Attribute

### What it does
This method retrieves an HTML attribute value from an element by its ID. It provides safe access with a fallback value if the element doesn't exist or the attribute is not set. This is the read companion to `setAttribute()`.

### How it works (conceptually within the library)
Under the hood, it essentially does:

```javascript
const element = document.getElementById(id);
if (element) {
  return element.getAttribute(attribute) || fallback;
}
return fallback;
```

Attributes are always strings or `null`. The fallback ensures you never get `null`.

### When you use it
You typically call this method when you want to:

✔ **Read data attributes**
Example: Retrieve stored metadata.

```javascript
const productId = Elements.getAttribute('card', 'data-product-id', '');
const userId = Elements.getAttribute('profile', 'data-user-id', '0');
```

✔ **Check ARIA states**
Example: Read accessibility attributes.

```javascript
const isExpanded = Elements.getAttribute('menu', 'aria-expanded', 'false') === 'true';
const isHidden = Elements.getAttribute('dialog', 'aria-hidden', 'true') === 'true';
```

✔ **Get source/URL values**
Example: Read image sources, link targets.

```javascript
const imageSrc = Elements.getAttribute('photo', 'src', '/default.jpg');
const linkHref = Elements.getAttribute('download', 'href', '#');
```

### Example (simple)

```javascript
// Get image source
const src = Elements.getAttribute('logo', 'src', '');

// Get data attribute
const productId = Elements.getAttribute('card', 'data-product-id', 'unknown');

// Check ARIA state
const expanded = Elements.getAttribute('accordion', 'aria-expanded', 'false');
```

### Example (practical inside a real DOM Helpers workflow)

```javascript
// Get product data
function getProductData(cardId) {
  return {
    id: Elements.getAttribute(cardId, 'data-product-id', ''),
    name: Elements.getAttribute(cardId, 'data-product-name', ''),
    price: Elements.getAttribute(cardId, 'data-price', '0'),
    inStock: Elements.getAttribute(cardId, 'data-in-stock', 'false') === 'true'
  };
}

// Check accordion state
function isAccordionOpen(id) {
  return Elements.getAttribute(`accordion-${id}`, 'aria-expanded', 'false') === 'true';
}

// Filter products by category
function filterByCategory(cardIds, category) {
  return cardIds.filter(id => {
    const cardCategory = Elements.getAttribute(id, 'data-category', '');
    return cardCategory === category;
  });
}
```

---

This demonstrates the typical pattern:
* **Properties** for JavaScript state (`value`, `disabled`, `checked`)
* **Attributes** for HTML metadata (`data-*`, `aria-*`, `src`, `href`)
* Always use fallbacks for safe access
* Return booleans for validation/existence checks