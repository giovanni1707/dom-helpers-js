# DOM Helpers Library - Access Methods Documentation

## Table of Contents

### Elements Access Methods
1. [Elements.{id} - Direct Property Access](#elements-id---direct-property-access)
2. [Elements.get(id, fallback) - Safe Access with Fallback](#elements-get-id-fallback---safe-access-with-fallback)
3. [Elements.exists(id) - Check Element Existence](#elements-exists-id---check-element-existence)
4. [Elements.isCached(id) - Check Cache Status](#elements-is-cached-id---check-cache-status)
5. [Elements.getMultiple(...ids) - Batch Element Retrieval](#elements-get-multiple-ids---batch-element-retrieval)
6. [Elements.destructure(...ids) - Destructure Into Object](#elements-destructure-ids---destructure-into-object)
7. [Elements.getRequired(...ids) - Required Elements](#elements-get-required-ids---required-elements)
8. [Elements.waitFor(...ids) - Async Element Waiting](#elements-wait-for-ids---async-element-waiting)

---

## Elements.{id} - Direct Property Access

### What it does
This method provides the most intuitive and concise way to access DOM elements by their ID. It uses JavaScript's Proxy feature to let you treat element IDs as if they were properties of the `Elements` object itself. When you access `Elements.myButton`, the library automatically fetches the element with `id="myButton"`, enhances it with the `.update()` method, and caches it for future use.

### How it works (conceptually within the library)
Behind the scenes, the `Elements` object is wrapped in a JavaScript Proxy that intercepts property access:

```javascript
Elements.myButton
  ↓
Proxy intercepts "myButton"
  ↓
Checks cache for "myButton"
  ↓
If not cached: document.getElementById("myButton")
  ↓
Enhances element with .update() method
  ↓
Stores in cache
  ↓
Returns enhanced element
```

The actual implementation looks conceptually like:

```javascript
const element = cache.get('myButton') || document.getElementById('myButton');
enhanceElementWithUpdate(element);
cache.set('myButton', element);
return element;
```

### When you use it
You use this method when you want:

✔ **Clean, readable code**
Example: The most natural syntax for accessing known elements.

```javascript
Elements.submitButton.update({ disabled: false });
```

✔ **Rapid prototyping**
Example: Quick access without verbose function calls.

```javascript
Elements.header.textContent = 'Welcome!';
Elements.footer.style.display = 'none';
```

✔ **Chained operations**
Example: Immediate access to enhanced methods.

```javascript
Elements.modal.update({ 
  classList: { add: 'active' },
  style: { opacity: '1' }
});
```

### Example (simple)

```javascript
// Get element by ID
const button = Elements.myButton;

// Use it
button.textContent = 'Click Me';
button.classList.add('primary');
```

### Example (practical inside a real DOM Helpers workflow)

```javascript
// Initialize navigation
function setupNav() {
  // Access multiple elements cleanly
  Elements.navToggle.update({
    addEventListener: ['click', () => {
      Elements.navMenu.classList.toggle('open');
    }]
  });
  
  Elements.navMenu.update({
    classList: { add: ['nav', 'hidden'] },
    style: { 
      transition: 'all 0.3s ease',
      opacity: '0'
    }
  });
  
  // Direct property access for simple checks
  if (Elements.userAvatar) {
    Elements.userAvatar.update({
      setAttribute: { 
        src: '/images/avatar.png',
        alt: 'User Avatar'
      }
    });
  }
}
```

---

## Elements.get(id, fallback) - Safe Access with Fallback

### What it does
This method provides a defensive way to access elements by ID with a fallback value if the element doesn't exist. Unlike direct property access (`Elements.{id}`), which returns `null` for missing elements, `.get()` lets you specify exactly what should be returned when an element isn't found. This prevents `null` reference errors and makes your code more resilient.

### How it works (conceptually within the library)
The method wraps the standard element lookup with a fallback mechanism:

```javascript
Elements.get(id, fallback)
  ↓
Attempts: Elements[id]
  ↓
If element exists: return enhanced element
If element is null: return fallback value
```

Conceptually:

```javascript
function get(id, fallback = null) {
  const element = document.getElementById(id);
  return element ? enhanceElement(element) : fallback;
}
```

### When you use it
You use this method when you want:

✔ **Safe default values**
Example: Provide a default element or placeholder when optional elements might be missing.

```javascript
const sidebar = Elements.get('sidebar', document.body);
```

✔ **Graceful degradation**
Example: Handle optional UI components that may not exist on all pages.

```javascript
const tooltip = Elements.get('tooltip', createFallbackTooltip());
```

✔ **Conditional logic without null checks**
Example: Avoid explicit `if (element)` checks by using meaningful fallbacks.

```javascript
const banner = Elements.get('promo-banner', { style: {} });
banner.style.display = 'none'; // Safe even if banner doesn't exist
```

### Example (simple)

```javascript
// Get element with fallback
const notification = Elements.get('notification', document.createElement('div'));

// Safe to use even if element doesn't exist
notification.textContent = 'Welcome!';
```

### Example (practical inside a real DOM Helpers workflow)

```javascript
// Initialize optional components with fallbacks
function initializeDashboard() {
  // Get main container or create one
  const container = Elements.get('dashboard', document.createElement('div'));
  
  // Get optional widgets with safe defaults
  const weatherWidget = Elements.get('weather-widget', {
    update: () => console.log('Weather widget not available'),
    textContent: 'Weather: N/A'
  });
  
  const newsWidget = Elements.get('news-widget', {
    update: () => console.log('News widget not available'),
    innerHTML: '<p>No news available</p>'
  });
  
  // Update with confidence - fallbacks prevent errors
  weatherWidget.update({
    textContent: 'Loading weather...',
    classList: { add: 'loading' }
  });
  
  newsWidget.update({
    innerHTML: '<h3>Latest News</h3><p>Loading...</p>',
    style: { opacity: '0.5' }
  });
  
  // Safe even if elements don't exist
  container.appendChild(weatherWidget);
  container.appendChild(newsWidget);
}
```

---

## Elements.exists(id) - Check Element Existence

### What it does
This method gives you a fast, zero-overhead way to confirm that an element with a specific ID exists in the current DOM. It avoids queries through `Elements.get()` or the enhanced element system, which are designed for full element objects. Instead, it performs a lightweight boolean check so you can branch logic safely before doing anything expensive.

### How it works (conceptually within the library)
Under the hood, it essentially does something equivalent to:

```javascript
function exists(id) {
  return document.getElementById(id) !== null;
}
```

But wrapped in the `Elements` namespace for three reasons:

1. **Consistency** - Instead of mixing raw DOM APIs with the DOM Helpers API, you keep your code unified:
   ```javascript
   if (Elements.exists('nav')) { ... }
   ```

2. **Avoid unnecessary enhancement** - `Elements.get()` returns an enhanced element (with `.update()`, etc.). For simple existence checks, that's overkill. `exists()` skips enhancement and simply checks presence.

3. **Predictable boolean result** - You always get a strict boolean (`true`/`false`), not an element or `null`.

### When you use it
You typically call this method when you want to:

✔ **Prevent runtime errors**
Example: Avoid `.update()` calls on missing nodes.

```javascript
if (Elements.exists('sidebar')) {
  Elements.sidebar.update({ textContent: 'Loaded' });
}
```

✔ **Conditionally initialize components**
Example: Only mount your widget if the container exists.

```javascript
if (Elements.exists('carousel-root')) {
  initCarousel();
}
```

✔ **Guard optional UI sections**
Example: Admin-only sections, modals, injected components, etc.

### Example (simple)

```javascript
if (Elements.exists('header')) {
  console.log('Header found!');
} else {
  console.log('Header missing.');
}
```

### Example (practical inside a real DOM Helpers workflow)

```javascript
// Safely initialize page components
function initializePage() {
  // Check for authentication UI
  if (Elements.exists('login-form')) {
    setupLoginForm();
  }
  
  if (Elements.exists('user-profile')) {
    const profile = Elements.userProfile;
    profile.update({
      classList: { add: 'active' },
      textContent: 'Profile Loaded'
    });
  }
  
  // Initialize optional features
  if (Elements.exists('search-bar')) {
    setupSearch();
  } else {
    console.info('Search functionality not available on this page');
  }
  
  // Conditional feature loading
  const features = ['comments', 'ratings', 'share-buttons'];
  features.forEach(feature => {
    if (Elements.exists(feature)) {
      loadFeature(feature);
    }
  });
}

function setupLoginForm() {
  Elements.loginForm.update({
    addEventListener: ['submit', handleLogin]
  });
}
```

---

## Elements.isCached(id) - Check Cache Status

### What it does
This method tells you whether an element with a specific ID is currently stored in the DOM Helpers internal cache. This is useful for performance debugging, understanding cache behavior, or deciding whether to trigger a fresh DOM query. It doesn't query the DOM itself—it only checks the cache's internal Map structure.

### How it works (conceptually within the library)
The library maintains a cache (using JavaScript's `Map`) of previously accessed elements:

```javascript
function isCached(id) {
  return cache.has(id);
}
```

When you access an element via `Elements.{id}` or `Elements.get()`, it's automatically cached. `isCached()` simply checks if that ID key exists in the cache Map.

The cache workflow:
```
First access: Elements.myButton
  ↓
Cache miss → Query DOM
  ↓
Store in cache: cache.set('myButton', element)
  ↓
Subsequent access: Elements.myButton
  ↓
Cache hit → Return from cache (faster!)
```

### When you use it
You use this method when you want:

✔ **Performance debugging**
Example: Check if elements are being cached as expected.

```javascript
console.log('Button cached:', Elements.isCached('submitButton'));
```

✔ **Cache warmup strategies**
Example: Pre-load commonly used elements into cache.

```javascript
const criticalElements = ['header', 'nav', 'footer'];
criticalElements.forEach(id => {
  if (!Elements.isCached(id)) {
    Elements[id]; // Access to trigger caching
  }
});
```

✔ **Conditional logic based on cache state**
Example: Decide whether to use cached data or force a refresh.

```javascript
if (!Elements.isCached('dynamicContent')) {
  // First time accessing, set up observers
  setupContentObserver();
}
```

### Example (simple)

```javascript
// Check cache before accessing
if (Elements.isCached('modal')) {
  console.log('Modal is cached');
} else {
  console.log('Modal will be fetched from DOM');
  Elements.modal; // First access
}
```

### Example (practical inside a real DOM Helpers workflow)

```javascript
// Performance monitoring utility
class DOMPerformanceMonitor {
  constructor() {
    this.criticalElements = [
      'header', 'nav', 'main', 'footer', 
      'sidebar', 'search', 'user-menu'
    ];
  }
  
  checkCacheStatus() {
    const report = {
      cached: [],
      notCached: [],
      cacheHitRate: 0
    };
    
    this.criticalElements.forEach(id => {
      if (Elements.isCached(id)) {
        report.cached.push(id);
      } else {
        report.notCached.push(id);
      }
    });
    
    report.cacheHitRate = 
      (report.cached.length / this.criticalElements.length) * 100;
    
    return report;
  }
  
  warmupCache() {
    console.log('Warming up element cache...');
    
    this.criticalElements.forEach(id => {
      if (!Elements.isCached(id) && Elements.exists(id)) {
        Elements[id]; // Access to cache
        console.log(`✓ Cached: ${id}`);
      }
    });
    
    console.log('Cache warmup complete:', this.checkCacheStatus());
  }
}

// Usage
const monitor = new DOMPerformanceMonitor();
monitor.warmupCache();

// Later, check performance
console.log('Cache Status:', monitor.checkCacheStatus());
// Output: { cached: [...], notCached: [...], cacheHitRate: 85.7 }
```

---

## Elements.getMultiple(...ids) - Batch Element Retrieval

### What it does
This method retrieves multiple elements by their IDs in a single call, returning them as an object where keys are the element IDs and values are the enhanced elements (or `null` if not found). It's essentially a batch version of `Elements.get()` that saves you from writing multiple access statements when you need several elements at once.

### How it works (conceptually within the library)
The method iterates through the provided IDs and builds an object:

```javascript
function getMultiple(...ids) {
  const result = {};
  ids.forEach(id => {
    result[id] = Elements[id] || null;
  });
  return result;
}
```

The workflow:
```
Elements.getMultiple('header', 'nav', 'footer')
  ↓
Loops through ['header', 'nav', 'footer']
  ↓
For each: result[id] = Elements[id]
  ↓
Returns: { header: Element, nav: Element, footer: Element }
```

### When you use it
You use this method when you want:

✔ **Batch element retrieval**
Example: Get several related elements at once.

```javascript
const { header, nav, footer } = Elements.getMultiple('header', 'nav', 'footer');
```

✔ **Reduce repetitive code**
Example: Instead of multiple separate access statements.

```javascript
// Instead of:
const header = Elements.header;
const nav = Elements.nav;
const footer = Elements.footer;

// Use:
const { header, nav, footer } = Elements.getMultiple('header', 'nav', 'footer');
```

✔ **Component initialization**
Example: Get all elements needed for a component setup.

```javascript
const parts = Elements.getMultiple('title', 'description', 'image', 'cta');
```

### Example (simple)

```javascript
// Get multiple elements
const elements = Elements.getMultiple('username', 'email', 'password');

console.log(elements);
// { username: Element, email: Element, password: Element }

// Access them
elements.username.value = 'john_doe';
elements.email.value = 'john@example.com';
```

### Example (practical inside a real DOM Helpers workflow)

```javascript
// Initialize a complex form component
function setupRegistrationForm() {
  // Get all form elements at once
  const {
    form,
    usernameInput,
    emailInput,
    passwordInput,
    confirmPasswordInput,
    submitButton,
    errorDisplay
  } = Elements.getMultiple(
    'registration-form',
    'username-input',
    'email-input',
    'password-input',
    'confirm-password-input',
    'submit-button',
    'error-display'
  );
  
  // Check if all required elements exist
  if (!form || !submitButton) {
    console.error('Registration form incomplete');
    return;
  }
  
  // Configure all elements
  usernameInput?.update({
    setAttribute: { 
      placeholder: 'Choose a username',
      autocomplete: 'username'
    }
  });
  
  emailInput?.update({
    setAttribute: { 
      placeholder: 'Your email address',
      type: 'email'
    }
  });
  
  passwordInput?.update({
    setAttribute: { 
      placeholder: 'Create a password',
      type: 'password'
    }
  });
  
  confirmPasswordInput?.update({
    setAttribute: { 
      placeholder: 'Confirm password',
      type: 'password'
    }
  });
  
  submitButton.update({
    textContent: 'Create Account',
    addEventListener: ['click', handleFormSubmit]
  });
  
  errorDisplay?.update({
    style: { display: 'none', color: 'red' }
  });
}

// Card component setup
function createProductCard(productData) {
  const { 
    cardImage, 
    cardTitle, 
    cardPrice, 
    cardDescription, 
    addToCartBtn 
  } = Elements.getMultiple(
    `product-image-${productData.id}`,
    `product-title-${productData.id}`,
    `product-price-${productData.id}`,
    `product-desc-${productData.id}`,
    `add-to-cart-${productData.id}`
  );
  
  // Update all at once
  cardImage?.update({ 
    setAttribute: { src: productData.imageUrl, alt: productData.name }
  });
  cardTitle && (cardTitle.textContent = productData.name);
  cardPrice && (cardPrice.textContent = `$${productData.price}`);
  cardDescription && (cardDescription.textContent = productData.description);
  addToCartBtn?.update({
    addEventListener: ['click', () => addToCart(productData.id)]
  });
}
```

---

## Elements.destructure(...ids) - Destructure Into Object

### What it does
This method is functionally identical to `Elements.getMultiple()` but with a name that emphasizes its use with JavaScript destructuring syntax. It retrieves multiple elements by ID and returns them as an object, making it semantically clear that you intend to destructure the result. The method also logs warnings for any missing elements when logging is enabled.

### How it works (conceptually within the library)
The implementation is essentially the same as `getMultiple()`:

```javascript
function destructure(...ids) {
  const result = {};
  const missing = [];
  
  ids.forEach(id => {
    const element = Elements[id];
    if (element) {
      result[id] = element;
    } else {
      missing.push(id);
      result[id] = null;
    }
  });
  
  if (missing.length > 0 && options.enableLogging) {
    console.warn(`Missing elements: ${missing.join(', ')}`);
  }
  
  return result;
}
```

### When you use it
You use this method when you want:

✔ **Clear destructuring intent**
Example: Make it obvious you're using destructuring syntax.

```javascript
const { header, nav, footer } = Elements.destructure('header', 'nav', 'footer');
```

✔ **Component property extraction**
Example: Extract specific elements for a component.

```javascript
const { modal, overlay, closeBtn } = Elements.destructure('modal', 'overlay', 'close-btn');
```

✔ **Readable element grouping**
Example: Group related elements semantically.

```javascript
const formFields = Elements.destructure('username', 'password', 'email');
```

### Example (simple)

```javascript
// Destructure elements directly
const { header, footer } = Elements.destructure('header', 'footer');

header.textContent = 'Welcome!';
footer.style.backgroundColor = '#333';
```

### Example (practical inside a real DOM Helpers workflow)

```javascript
// Modal component with destructured elements
class Modal {
  constructor(modalId) {
    // Destructure all modal parts
    const { 
      modal, 
      modalOverlay, 
      modalContent, 
      modalTitle, 
      modalBody, 
      modalClose 
    } = Elements.destructure(
      `${modalId}`,
      `${modalId}-overlay`,
      `${modalId}-content`,
      `${modalId}-title`,
      `${modalId}-body`,
      `${modalId}-close`
    );
    
    // Store as instance properties
    this.modal = modal;
    this.overlay = modalOverlay;
    this.content = modalContent;
    this.title = modalTitle;
    this.body = modalBody;
    this.closeBtn = modalClose;
    
    this.init();
  }
  
  init() {
    if (!this.modal) {
      console.error('Modal element not found');
      return;
    }
    
    // Set up close handlers
    this.closeBtn?.update({
      addEventListener: ['click', () => this.close()]
    });
    
    this.overlay?.update({
      addEventListener: ['click', () => this.close()]
    });
  }
  
  open(title, content) {
    this.title && (this.title.textContent = title);
    this.body && (this.body.innerHTML = content);
    
    this.modal.update({
      classList: { add: 'active' },
      style: { display: 'block' }
    });
  }
  
  close() {
    this.modal.update({
      classList: { remove: 'active' },
      style: { display: 'none' }
    });
  }
}

// Navigation setup with clear destructuring
function setupNavigation() {
  const { 
    navMenu, 
    navToggle, 
    navOverlay, 
    navClose 
  } = Elements.destructure(
    'nav-menu',
    'nav-toggle',
    'nav-overlay',
    'nav-close'
  );
  
  const toggleNav = () => {
    navMenu?.classList.toggle('open');
    navOverlay?.classList.toggle('visible');
  };
  
  navToggle?.update({
    addEventListener: ['click', toggleNav]
  });
  
  navClose?.update({
    addEventListener: ['click', toggleNav]
  });
  
  navOverlay?.update({
    addEventListener: ['click', toggleNav]
  });
}
```

---

## Elements.getRequired(...ids) - Required Elements

### What it does
This method retrieves multiple elements by ID with a crucial difference from `getMultiple()` or `destructure()`: if any requested element is missing from the DOM, it throws an error immediately. This makes it perfect for critical components that cannot function without specific elements present. It enforces element availability at the API level rather than relying on manual checks.

### How it works (conceptually within the library)
The method checks all requested elements and throws if any are missing:

```javascript
function getRequired(...ids) {
  const elements = destructure(...ids);
  const missing = ids.filter(id => !elements[id]);
  
  if (missing.length > 0) {
    throw new Error(`Required elements not found: ${missing.join(', ')}`);
  }
  
  return elements;
}
```

The workflow:
```
Elements.getRequired('header', 'nav', 'footer')
  ↓
Fetches all elements
  ↓
Checks if any are null/missing
  ↓
If ALL exist: Return { header, nav, footer }
If ANY missing: throw Error('Required elements not found: ...')
```

### When you use it
You use this method when you want:

✔ **Fail-fast validation**
Example: Critical components that can't work without specific elements.

```javascript
// Will throw if any element is missing
const { form, submitBtn } = Elements.getRequired('checkout-form', 'submit-button');
```

✔ **Clear error messages**
Example: Better debugging with explicit missing element names.

```javascript
try {
  const { modal, overlay } = Elements.getRequired('modal', 'modal-overlay');
} catch (error) {
  console.error('Cannot initialize modal:', error.message);
  // Output: "Cannot initialize modal: Required elements not found: modal-overlay"
}
```

✔ **Component initialization guards**
Example: Prevent partial initialization of components.

```javascript
function initCriticalFeature() {
  const elements = Elements.getRequired('feature-container', 'feature-trigger');
  // Code here only runs if ALL elements exist
}
```

### Example (simple)

```javascript
try {
  // This will throw if either element is missing
  const { username, password } = Elements.getRequired('username', 'password');
  
  console.log('Login form elements found');
  username.focus();
} catch (error) {
  console.error('Login form incomplete:', error.message);
}
```

### Example (practical inside a real DOM Helpers workflow)

```javascript
// Critical application shell initialization
function initializeApp() {
  try {
    // These elements MUST exist for the app to function
    const {
      appContainer,
      appHeader,
      appNav,
      appMain,
      appFooter,
      loadingScreen
    } = Elements.getRequired(
      'app-container',
      'app-header',
      'app-nav',
      'app-main',
      'app-footer',
      'loading-screen'
    );
    
    // Safe to proceed - all critical elements exist
    console.log('✓ All required elements found');
    
    // Hide loading screen
    loadingScreen.update({
      style: { opacity: '0' },
      addEventListener: ['transitionend', function() {
        this.style.display = 'none';
      }]
    });
    
    // Initialize app shell
    appHeader.update({
      classList: { add: 'initialized' }
    });
    
    appNav.update({
      classList: { add: 'ready' }
    });
    
    // Start app
    startApplication();
    
  } catch (error) {
    // Catastrophic failure - show error page
    document.body.innerHTML = `
      <div class="error-page">
        <h1>Application Error</h1>
        <p>${error.message}</p>
        <p>Please refresh the page or contact support.</p>
      </div>
    `;
    console.error('App initialization failed:', error);
  }
}

// Payment form that requires all fields
class PaymentForm {
  constructor() {
    try {
      // All these fields are required for payment
      const {
        cardNumber,
        cardExpiry,
        cardCVV,
        billingAddress,
        submitButton
      } = Elements.getRequired(
        'card-number',
        'card-expiry',
        'card-cvv',
        'billing-address',
        'payment-submit'
      );
      
      this.fields = {
        cardNumber,
        cardExpiry,
        cardCVV,
        billingAddress,
        submitButton
      };
      
      this.init();
      
    } catch (error) {
      throw new Error(
        `Payment form initialization failed: ${error.message}. ` +
        'Please ensure all payment form elements are present in the HTML.'
      );
    }
  }
  
  init() {
    this.fields.submitButton.update({
      addEventListener: ['click', (e) => this.handleSubmit(e)]
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    // Payment processing logic
  }
}

// Usage with proper error handling
try {
  const paymentForm = new PaymentForm();
  console.log('✓ Payment form initialized');
} catch (error) {
  console.error('Payment form error:', error);
  showUserMessage('Payment form unavailable. Please try again later.');
}
```

---

## Elements.waitFor(...ids) - Async Element Waiting

### What it does
This method asynchronously waits for one or more elements to appear in the DOM, returning a Promise that resolves when all requested elements exist. It's essential for handling dynamically loaded content, SPAs, or components that aren't available at initial page load. By default, it polls every 100ms for up to 5 seconds before timing out.

### How it works (conceptually within the library)
The method uses an async polling loop:

```javascript
async function waitFor(...ids) {
  const maxWait = 5000; // 5 seconds
  const checkInterval = 100; // 100ms
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWait) {
    const elements = destructure(...ids);
    const allFound = ids.every(id => elements[id]);
    
    if (allFound) {
      return elements; // All elements found!
    }
    
    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }
  
  throw new Error(`Timeout waiting for elements: ${ids.join(', ')}`);
}
```

The workflow:
```
Elements.waitFor('dynamic-content', 'user-widget')
  ↓
Check every 100ms
  ↓
Are both elements in DOM?
  ↓
YES: Resolve promise with { dynamic-content, user-widget }
NO: Keep checking...
  ↓
After 5 seconds: throw TimeoutError
```

### When you use it
You use this method when you want:

✔ **Handle dynamic content**
Example: Wait for content loaded via AJAX or injected by JavaScript.

```javascript
const { userPanel } = await Elements.waitFor('user-panel');
```

✔ **SPA route transitions**
Example: Wait for new page components after navigation.

```javascript
await Elements.waitFor('dashboard-content', 'sidebar', 'header');
setupDashboard();
```

✔ **Third-party widget loading**
Example: Wait for external libraries to inject their elements.

```javascript
await Elements.waitFor('twitter-widget', 'facebook-feed');
```

### Example (simple)

```javascript
async function loadDynamicContent() {
  try {
    console.log('Waiting for content to load...');
    
    const { dynamicContent } = await Elements.waitFor('dynamic-content');
    
    console.log('Content loaded!');
    dynamicContent.update({
      classList: { add: 'loaded' }
    });
    
  } catch (error) {
    console.error('Content failed to load:', error);
  }
}

loadDynamicContent();
```

### Example (practical inside a real DOM Helpers workflow)

```javascript
// SPA Router with async component loading
class Router {
  async navigateTo(route) {
    console.log(`Navigating to: ${route}`);
    
    // Show loading state
    Elements.mainContent?.update({
      innerHTML: '<div class="spinner">Loading...</div>'
    });
    
    // Fetch and inject route content
    const html = await fetch(`/routes/${route}.html`).then(r => r.text());
    Elements.mainContent.innerHTML = html;
    
    try {
      // Wait for route-specific elements to be rendered
      if (route === 'dashboard') {
        const { 
          dashboardHeader, 
          statsPanel, 
          activityFeed 
        } = await Elements.waitFor(
          'dashboard-header',
          'stats-panel',
          'activity-feed'
        );
        
        this.initDashboard({ dashboardHeader, statsPanel, activityFeed });
      }
      
      if (route === 'profile') {
        const { 
          profileForm, 
          avatarUpload 
        } = await Elements.waitFor(
          'profile-form',
          'avatar-upload'
        );
        
        this.initProfile({ profileForm, avatarUpload });
      }
      
    } catch (error) {
      console.error('Route initialization failed:', error);
      Elements.mainContent.innerHTML = `
        <div class="error">
          <h2>Page Load Error</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }
  
  initDashboard(elements) {
    console.log('✓ Dashboard elements ready');
    elements.statsPanel.update({
      classList: { add: 'animate-in' }
    });
  }
  
  initProfile(elements) {
    console.log('✓ Profile elements ready');
    elements.profileForm.update({
      addEventListener: ['submit', handleProfileSubmit]
    });
  }
}

// Chat application with dynamic messages
class ChatApp {
  async loadConversation(conversationId) {
    // Inject conversation HTML
    const html = await this.fetchConversation(conversationId);
    Elements.chatContainer.innerHTML = html;
    
    try {
      // Wait for message elements to appear
      const { 
        messageList, 
        messageInput, 
        sendButton 
      } = await Elements.waitFor(
        `messages-${conversationId}`,
        'message-input',
        'send-button'
      );
      
      console.log('✓ Conversation loaded');
      
      // Scroll to bottom
      messageList.scrollTop = messageList.scrollHeight;
      
      // Focus input
      messageInput.focus();
      
      // Setup send handler
      sendButton.update({
        addEventListener: ['click', () => this.sendMessage()]
      });
      
    } catch (error) {
      console.error('Failed to load conversation:', error);
      this.showError('Conversation could not be loaded');
    }
  }
  
  async fetchConversation(id) {
    // Simulate API call
    return `<div id="messages-${id}">...</div>
            <input id="message-input" />
            <button id="send-button">Send</button>`;
  }
}

// Modal that waits for lazy-loaded content
async function openProductModal(productId) {
  // Open modal shell
  Elements.modal.update({
    classList: { add: 'active' },
    innerHTML: '<div class="loading">Loading product details...</div>'
  });
  
  // Fetch product content
  const html = await fetch(`/products/${productId}`).then(r => r.text());
  Elements.modal.innerHTML = html;
  
  try {
    // Wait for product elements
    const {
      productImage,
      productTitle,
      productPrice,
      addToCartBtn
    } = await Elements.waitFor(
      `product-image-${productId}`,
      `product-title-${productId}`,
      `product-price-${productId}`,
      `add-cart-${productId}`
    );
    
    console.log('✓ Product modal ready');
    
    // Enhance product elements
    addToCartBtn.update({
      addEventListener: ['click', () => addToCart(productId)]
    });
    
    // Animate in
    productImage.update({
      classList: { add: 'fade-in' }
    });
    
  } catch (error) {
    console.error('Product modal failed:', error);
    Elements.modal.innerHTML = '<div class="error">Failed to load product</div>';
  }
}
```

---

