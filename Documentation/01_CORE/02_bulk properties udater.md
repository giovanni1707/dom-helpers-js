# DOM Helpers - Bulk Property Updaters Methods

Based on the code you've provided, here's a comprehensive list of all available methods in the **Bulk Property Updaters** module:

## 🎯 Elements Helper - Bulk Methods

These methods allow you to update multiple elements by their IDs in a single call:

### 1. **Elements.textContent(updates)**
Updates the text content of multiple elements.

```javascript
Elements.textContent({
  title: "New Title",
  description: "New description text",
  footer: "© 2024 Company"
});
```

### 2. **Elements.innerHTML(updates)**
Updates the HTML content of multiple elements.

```javascript
Elements.innerHTML({
  container: "<div><strong>Bold</strong> content</div>",
  sidebar: "<ul><li>Item 1</li><li>Item 2</li></ul>"
});
```

### 3. **Elements.innerText(updates)**
Updates the inner text of multiple elements.

```javascript
Elements.innerText({
  heading: "Welcome!",
  paragraph: "This is some text"
});
```

### 4. **Elements.value(updates)**
Updates the value property of input elements.

```javascript
Elements.value({
  username: "john_doe",
  email: "john@example.com",
  age: "25"
});
```

### 5. **Elements.placeholder(updates)**
Updates placeholder text for input fields.

```javascript
Elements.placeholder({
  searchBox: "Search products...",
  emailInput: "Enter your email",
  passwordInput: "Enter password"
});
```

### 6. **Elements.title(updates)**
Updates the title attribute (tooltip) of elements.

```javascript
Elements.title({
  helpIcon: "Click for help",
  deleteBtn: "Delete this item",
  saveBtn: "Save changes"
});
```

### 7. **Elements.disabled(updates)**
Enables or disables multiple elements.

```javascript
Elements.disabled({
  submitBtn: true,    // Disable
  cancelBtn: false,   // Enable
  inputField: true    // Disable
});
```

### 8. **Elements.checked(updates)**
Sets the checked state of checkboxes/radio buttons.

```javascript
Elements.checked({
  agreeCheckbox: true,
  optionA: false,
  optionB: true
});
```

### 9. **Elements.readonly(updates)**
Sets the readonly state of input elements.

```javascript
Elements.readonly({
  usernameInput: true,   // Make readonly
  emailInput: false      // Make editable
});
```

### 10. **Elements.hidden(updates)**
Shows or hides elements.

```javascript
Elements.hidden({
  loadingSpinner: false,  // Show
  errorMessage: true,     // Hide
  successMessage: false   // Show
});
```

### 11. **Elements.selected(updates)**
Sets the selected state of option elements.

```javascript
Elements.selected({
  option1: true,
  option2: false
});
```

### 12. **Elements.src(updates)**
Updates the src attribute of images, iframes, etc.

```javascript
Elements.src({
  profilePic: "images/user.jpg",
  bannerImage: "images/banner.png",
  videoFrame: "videos/intro.mp4"
});
```

### 13. **Elements.href(updates)**
Updates the href attribute of links.

```javascript
Elements.href({
  homeLink: "/home",
  profileLink: "/profile/123",
  logoutLink: "/logout"
});
```

### 14. **Elements.alt(updates)**
Updates the alt text of images.

```javascript
Elements.alt({
  logo: "Company Logo",
  heroImage: "Hero banner showing products",
  icon: "Settings icon"
});
```

### 15. **Elements.style(updates)**
Updates styles for multiple elements.

```javascript
Elements.style({
  header: {
    backgroundColor: "#333",
    color: "white",
    padding: "20px"
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#f5f5f5"
  },
  footer: {
    textAlign: "center",
    padding: "10px"
  }
});
```

### 16. **Elements.dataset(updates)**
Updates data attributes for multiple elements.

```javascript
Elements.dataset({
  userCard: {
    userId: "123",
    role: "admin",
    status: "active"
  },
  productItem: {
    productId: "456",
    price: "29.99",
    category: "electronics"
  }
});
```

### 17. **Elements.attrs(updates)**
Updates HTML attributes for multiple elements.

```javascript
Elements.attrs({
  submitBtn: {
    type: "submit",
    name: "submitAction",
    value: "send"
  },
  inputField: {
    maxlength: "100",
    pattern: "[A-Za-z]+",
    required: true
  },
  image: {
    width: "300",
    height: "200",
    loading: "lazy"
  }
});

// Remove attributes by setting to null or false
Elements.attrs({
  submitBtn: {
    disabled: null  // Removes disabled attribute
  }
});
```

### 18. **Elements.classes(updates)**
Updates CSS classes for multiple elements.

```javascript
// Simple string replacement
Elements.classes({
  header: "navbar navbar-dark bg-primary",
  sidebar: "sidebar collapsed"
});

// classList operations
Elements.classes({
  header: {
    add: ["active", "highlighted"],
    remove: ["hidden"]
  },
  sidebar: {
    toggle: "collapsed"
  },
  footer: {
    replace: ["old-class", "new-class"]
  }
});
```

### 19. **Elements.prop(propertyPath, updates)**
Updates any property (including nested properties) for multiple elements.

```javascript
// Simple property
Elements.prop("disabled", {
  btn1: true,
  btn2: false
});

// Nested property
Elements.prop("style.color", {
  title: "red",
  subtitle: "blue",
  footer: "gray"
});

Elements.prop("style.fontSize", {
  heading: "24px",
  paragraph: "16px"
});
```

---

## 🎯 Collections Helper - Index-Based Bulk Methods

These methods work on collection instances (ClassName, TagName, Name) and update elements by their index:

### 1. **collection.textContent(updates)**
Updates text content by element index in collection.

```javascript
const buttons = Collections.ClassName.btn;

buttons.textContent({
  0: "First Button",
  1: "Second Button",
  2: "Third Button"
});
```

### 2. **collection.innerHTML(updates)**
Updates HTML content by element index.

```javascript
const containers = Collections.ClassName.container;

containers.innerHTML({
  0: "<h2>Section 1</h2>",
  1: "<h2>Section 2</h2>",
  2: "<h2>Section 3</h2>"
});
```

### 3. **collection.value(updates)**
Updates value property by element index.

```javascript
const inputs = Collections.TagName.input;

inputs.value({
  0: "Value for first input",
  1: "Value for second input",
  2: "Value for third input"
});
```

### 4. **collection.style(updates)**
Updates styles by element index.

```javascript
const divs = Collections.TagName.div;

divs.style({
  0: {
    backgroundColor: "red",
    padding: "10px"
  },
  1: {
    backgroundColor: "blue",
    margin: "5px"
  },
  2: {
    backgroundColor: "green",
    borderRadius: "5px"
  }
});
```

### 5. **collection.dataset(updates)**
Updates data attributes by element index.

```javascript
const cards = Collections.ClassName.card;

cards.dataset({
  0: {
    id: "card-1",
    status: "active"
  },
  1: {
    id: "card-2",
    status: "inactive"
  }
});
```

### 6. **collection.classes(updates)**
Updates CSS classes by element index.

```javascript
const items = Collections.ClassName.item;

// String replacement
items.classes({
  0: "item active highlighted",
  1: "item disabled"
});

// classList operations
items.classes({
  0: {
    add: ["active", "selected"],
    remove: ["disabled"]
  },
  1: {
    toggle: "collapsed"
  },
  2: {
    replace: ["old-state", "new-state"]
  }
});
```

---

## 🔗 Method Chaining

All bulk methods return the context object, allowing for method chaining:

```javascript
// Elements chaining
Elements
  .textContent({ title: "New Title" })
  .style({ title: { color: "red", fontSize: "24px" } })
  .classes({ title: { add: ["active"] } })
  .disabled({ submitBtn: false });

// Collections chaining
Collections.ClassName.btn
  .textContent({ 0: "Click Me", 1: "Submit" })
  .style({ 0: { backgroundColor: "blue" } })
  .classes({ 0: { add: ["primary"] } });
```

---

## 📝 Practical Examples

### Example 1: Form Management
```javascript
// Populate form fields
Elements.value({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com"
});

// Update placeholders
Elements.placeholder({
  firstName: "Enter first name",
  lastName: "Enter last name",
  email: "your.email@example.com"
});

// Disable submit button
Elements.disabled({
  submitBtn: true
});
```

### Example 2: Styling Multiple Elements
```javascript
Elements.style({
  header: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "20px"
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#ecf0f1"
  },
  mainContent: {
    marginLeft: "250px",
    padding: "20px"
  }
});
```

### Example 3: Working with Collections
```javascript
// Update all buttons in a collection
const allButtons = Collections.ClassName.btn;

allButtons.style({
  0: { backgroundColor: "green" },
  1: { backgroundColor: "blue" },
  2: { backgroundColor: "red" }
});

allButtons.textContent({
  0: "Success",
  1: "Info",
  2: "Danger"
});
```

### Example 4: Managing Visibility
```javascript
// Show/hide elements
Elements.hidden({
  loadingSpinner: true,    // Hide
  mainContent: false,      // Show
  errorMessage: true       // Hide
});

// Add/remove classes for visibility
Elements.classes({
  modal: { add: ["show"] },
  overlay: { remove: ["hidden"] }
});
```

---

## ⚠️ Important Notes

1. **All methods are chainable** - They return the context for method chaining
2. **Type safety** - Invalid element IDs or indices are logged as warnings
3. **Graceful degradation** - Falls back to direct DOM manipulation if `.update()` is unavailable
4. **Index-based for collections** - Collection methods use numeric indices (0, 1, 2...)
5. **ID-based for Elements** - Elements methods use element IDs as keys

This module significantly reduces code verbosity when updating multiple elements with the same property type!