# Elements Module - Complete Documentation

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Complete, beginner-friendly documentation for the Elements Helper**
> Learn how to access and manipulate DOM elements by ID with intelligent caching and the powerful `.update()` method

---

## 📚 Documentation Structure

The Elements module documentation is organized into **four comprehensive guides**:

### 1. **[Access Methods](01_Access-Methods.md)** 🎯
*How to get DOM elements by ID*

Learn the 8 different ways to access elements:
- `Elements.{id}` - Proxy access
- `Elements.get()` - Safe access with fallback
- `Elements.exists()` - Check existence
- `Elements.isCached()` - Check cache status
- `Elements.getMultiple()` - Get multiple as array
- `Elements.destructure()` - Get multiple as object
- `Elements.getRequired()` - Required elements with validation
- `Elements.waitFor()` - Async element loading

**[Read Access Methods →](01_Access-Methods.md)**

---

### 2. **[Property Methods](02_Property-Methods.md)** 🔧
*Get and set element properties and attributes*

Master the shorthand methods for element manipulation:
- `Elements.setProperty()` - Set JavaScript properties
- `Elements.getProperty()` - Get JavaScript properties
- `Elements.setAttribute()` - Set HTML attributes
- `Elements.getAttribute()` - Get HTML attributes
- Understanding Properties vs Attributes

**[Read Property Methods →](02_Property-Methods.md)**

---

### 3. **[Bulk Operations](03_Bulk-Operations.md)** ⚡
*Update multiple elements efficiently*

Unlock the power of `Elements.update()`:
- Single element updates
- Multiple element updates
- Available update operations (styles, classes, attributes, events, etc.)
- Performance optimization
- Real-world examples

**[Read Bulk Operations →](03_Bulk-Operations.md)**

---

### 4. **[Utility Methods](04_Utility-Methods.md)** 🛠️
*Manage cache and configure behavior*

Control the Elements Helper internals:
- `Elements.stats()` - Performance statistics
- `Elements.clear()` - Cache management
- `Elements.destroy()` - Cleanup and teardown
- `Elements.configure()` - Runtime configuration

**[Read Utility Methods →](04_Utility-Methods.md)**

---

## 🚀 Quick Start

### Basic Usage

```javascript
// Simple access
const header = Elements.header;
header.textContent = 'Welcome!';

// Better: use .update()
Elements.header.update({
  textContent: 'Welcome!',
  style: { color: 'blue', fontSize: '24px' }
});
```

### Multiple Elements

```javascript
// Get multiple elements
const { header, footer, sidebar } = Elements.destructure(
  'header', 'footer', 'sidebar'
);

// Update multiple elements at once
Elements.update({
  header: { textContent: 'Header' },
  footer: { textContent: 'Footer' },
  sidebar: { classList: { add: ['visible'] } }
});
```

### Required Elements

```javascript
// Ensure critical elements exist
try {
  const { loginForm, emailInput, submitBtn } = Elements.getRequired(
    'loginForm', 'emailInput', 'submitBtn'
  );

  // Safe to use - guaranteed to exist
  setupLoginForm(loginForm, emailInput, submitBtn);
} catch (error) {
  console.error('Critical elements missing:', error.message);
}
```

---

## 📊 Method Overview

### Access Methods (8 methods)

| Method | Use Case | Example |
|--------|----------|---------|
| **Proxy** | Quick single access | `Elements.header` |
| **get()** | Dynamic IDs, fallback | `Elements.get('header', fallback)` |
| **exists()** | Check existence | `Elements.exists('header')` |
| **isCached()** | Check cache | `Elements.isCached('header')` |
| **getMultiple()** | Array of elements | `Elements.getMultiple('h1', 'h2')` |
| **destructure()** | Object destructuring | `const { h1, h2 } = Elements.destructure('h1', 'h2')` |
| **getRequired()** | Critical elements | `Elements.getRequired('h1', 'h2')` (throws if missing) |
| **waitFor()** | Async loading | `await Elements.waitFor('modal')` |

### Property Methods (4 methods)

| Method | Purpose | Example |
|--------|---------|---------|
| **setProperty()** | Set JS property | `Elements.setProperty('input', 'value', 'text')` |
| **getProperty()** | Get JS property | `Elements.getProperty('input', 'value', '')` |
| **setAttribute()** | Set HTML attribute | `Elements.setAttribute('img', 'src', 'url')` |
| **getAttribute()** | Get HTML attribute | `Elements.getAttribute('img', 'src', '')` |

### Bulk Operations (1 method, infinite power)

| Method | Purpose | Example |
|--------|---------|---------|
| **update()** | Update element(s) | `Elements.update({ header: { textContent: 'Hi' } })` |

### Utility Methods (4 methods)

| Method | Purpose | Example |
|--------|---------|---------|
| **stats()** | Performance metrics | `Elements.stats()` |
| **clear()** | Clear cache | `Elements.clear()` |
| **destroy()** | Cleanup | `Elements.destroy()` |
| **configure()** | Configuration | `Elements.configure({ maxCacheSize: 2000 })` |

---

## 💡 Key Concepts

### Intelligent Caching

The Elements Helper **automatically caches elements** after first access:

```javascript
Elements.header;  // Fetches from DOM (slow)
Elements.header;  // Returns from cache (fast!)
Elements.header;  // Still cached (fast!)
```

**Benefits:**
- Faster repeated access
- Reduced DOM queries
- Automatic cleanup of removed elements

---

### The `.update()` Method

The **universal update method** is available on all elements:

```javascript
element.update({
  textContent: 'Text',
  style: { color: 'red' },
  classList: { add: ['active'] },
  setAttribute: { 'data-id': '123' },
  addEventListener: ['click', handler]
});
```

**Features:**
- Declarative syntax
- Fine-grained change detection
- Batch multiple changes
- Works on single elements and collections

---

### Fine-Grained Change Detection

DOM Helpers only updates **what actually changed**:

```javascript
// First update
Elements.header.update({ textContent: 'Hello', style: { color: 'blue' } });

// Second update - only textContent changes
Elements.header.update({ textContent: 'Hi', style: { color: 'blue' } });
// The 'color' style is NOT reapplied (no change detected)
```

This prevents unnecessary DOM operations and improves performance.

---

## 🎯 Common Patterns

### Pattern 1: Component Initialization

```javascript
function initializeApp() {
  const { header, nav, main, footer } = Elements.getRequired(
    'header', 'nav', 'main', 'footer'
  );

  header.update({ textContent: config.appName });
  nav.update({ classList: { add: ['initialized'] } });
  main.update({ innerHTML: loadContent() });
  footer.update({ textContent: config.copyright });
}
```

---

### Pattern 2: Form Handling

```javascript
function setupLoginForm() {
  const { loginForm, emailInput, passwordInput, submitBtn } =
    Elements.destructure('loginForm', 'emailInput', 'passwordInput', 'submitBtn');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    submitBtn.update({
      disabled: true,
      textContent: 'Logging in...'
    });

    login(email, password)
      .then(() => {
        // Success
      })
      .catch(() => {
        submitBtn.update({
          disabled: false,
          textContent: 'Login'
        });
      });
  });
}
```

---

### Pattern 3: Theme Switching

```javascript
function applyTheme(theme) {
  const config = theme === 'dark' ? darkTheme : lightTheme;

  Elements.update({
    body: {
      style: { backgroundColor: config.bg, color: config.text }
    },
    header: {
      style: { backgroundColor: config.headerBg }
    },
    sidebar: {
      style: { backgroundColor: config.sidebarBg }
    }
  });
}
```

---

### Pattern 4: Dynamic Content Loading

```javascript
async function loadUserProfile(userId) {
  // Show loading state
  Elements.update({
    profileCard: { classList: { add: ['loading'] } },
    loadingSpinner: { style: { display: 'block' } }
  });

  const userData = await fetchUser(userId);

  // Wait for dynamic elements to appear
  const { avatar, userName, userBio } = await Elements.waitFor(
    'avatar', 'userName', 'userBio'
  );

  // Update with user data
  Elements.update({
    avatar: { setAttribute: { src: userData.avatar } },
    userName: { textContent: userData.name },
    userBio: { textContent: userData.bio },
    profileCard: { classList: { remove: ['loading'] } },
    loadingSpinner: { style: { display: 'none' } }
  });
}
```

---

## 🔍 When to Use What

### Use Proxy Access when:
✅ ID is known at write-time
✅ ID follows JavaScript naming rules
✅ Quick access for a single element

```javascript
const header = Elements.header;
```

---

### Use `get()` when:
✅ ID is dynamic or computed
✅ ID has hyphens or special characters
✅ You want a custom fallback

```javascript
const el = Elements.get(`item-${id}`, fallback);
```

---

### Use `destructure()` when:
✅ Getting multiple elements at once
✅ You prefer object destructuring

```javascript
const { header, footer } = Elements.destructure('header', 'footer');
```

---

### Use `getRequired()` when:
✅ Elements are critical to your app
✅ You want fail-fast behavior
✅ You want clear error messages

```javascript
const { form, input } = Elements.getRequired('form', 'input');
```

---

### Use `waitFor()` when:
✅ Elements load dynamically
✅ Working with SPAs or AJAX content
✅ Elements may not exist immediately

```javascript
const { modal } = await Elements.waitFor('modal');
```

---

### Use `.update()` when:
✅ Making any DOM changes (always!)
✅ Setting multiple properties
✅ You want optimized updates

```javascript
element.update({ textContent: 'Hi', style: { color: 'blue' } });
```

---

## 🎓 Learning Path

### Beginner (Start Here)
1. Read **[Access Methods](01_Access-Methods.md)** - Learn proxy access and `destructure()`
2. Try basic examples with `Elements.{id}` and `.update()`
3. Practice with simple DOM manipulation

### Intermediate
1. Read **[Property Methods](02_Property-Methods.md)** - Understand properties vs attributes
2. Read **[Bulk Operations](03_Bulk-Operations.md)** - Master `Elements.update()`
3. Use `getRequired()` for critical elements
4. Learn about fine-grained updates

### Advanced
1. Read **[Utility Methods](04_Utility-Methods.md)** - Monitor performance
2. Use `waitFor()` for dynamic content
3. Optimize cache configuration
4. Build complex update patterns

---

## 📖 Full Documentation

### Complete Guides

1. **[Access Methods](01_Access-Methods.md)** - All 8 ways to get elements
2. **[Property Methods](02_Property-Methods.md)** - Properties and attributes
3. **[Bulk Operations](03_Bulk-Operations.md)** - The `.update()` power method
4. **[Utility Methods](04_Utility-Methods.md)** - Cache and configuration

---

## 🌟 Why Use Elements Helper?

### Before (Plain JavaScript)
```javascript
const header = document.getElementById('header');
const footer = document.getElementById('footer');

if (header) {
  header.textContent = 'Welcome';
  header.style.color = 'blue';
  header.style.fontSize = '24px';
  header.classList.add('active');
}

if (footer) {
  footer.textContent = '© 2024';
  footer.style.textAlign = 'center';
}
```

### After (DOM Helpers)
```javascript
Elements.update({
  header: {
    textContent: 'Welcome',
    style: { color: 'blue', fontSize: '24px' },
    classList: { add: ['active'] }
  },
  footer: {
    textContent: '© 2024',
    style: { textAlign: 'center' }
  }
});
```

**Benefits:**
✅ 50% less code
✅ More readable
✅ Optimized updates
✅ Automatic caching
✅ Fail-safe access

---

## 📝 Next Steps

1. **Start with basics**: Read [Access Methods](01_Access-Methods.md)
2. **Practice**: Try examples in your project
3. **Master updates**: Study [Bulk Operations](03_Bulk-Operations.md)
4. **Optimize**: Configure using [Utility Methods](04_Utility-Methods.md)

---

## 🔗 Links

- **[Documentation Home](../../README.md)**
- **[Core Methods List](../Core%20Methods%20List.md)**
- **[Collections Module](../Collections%20Module/)** (Coming Soon)
- **[Selector Module](../Selector%20Module/)** (Coming Soon)

---

**[Back to Documentation Home](../../README.md)**

---

*Made with ❤️ for developers who love clean, efficient code*
