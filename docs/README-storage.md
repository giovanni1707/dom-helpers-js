# DOM Helpers Storage Module

A powerful, feature-rich storage utility library that extends the native Web Storage API with advanced functionality including automatic JSON serialization, expiry system, namespaces, and seamless forms integration.

## 🚀 Overview

The DOM Helpers Storage Module transforms the basic `localStorage` and `sessionStorage` APIs into a comprehensive data management solution. Whether you're building a simple web app or a complex application, this library provides the tools you need to handle client-side data storage efficiently and reliably.

### Why Use DOM Helpers Storage?

- **🔄 Automatic Serialization**: Store any JavaScript data type without manual JSON conversion
- **⏰ Built-in Expiry System**: Set TTL (Time To Live) for stored data with automatic cleanup
- **🏷️ Namespace Support**: Organize data with hierarchical namespaces to avoid key conflicts
- **📝 Forms Integration**: Auto-save and restore form data with minimal setup
- **🔀 Dual API**: Choose between shorthand methods or vanilla-like API
- **💾 Session & Local Storage**: Unified interface for both storage types
- **🛡️ Error Handling**: Graceful fallbacks and comprehensive error management

## 📦 Installation

### CDN Include
```html
<!-- Include the main DOM Helpers library first -->

<!-- Load core first -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@1.0.0/dist/dom-helpers.min.js"></script>

<!-- Then load the Storage module -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@1.0.0/dist/dom-helpers-storage.min.js"></script>

<!-- Forms -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@1.0.0/dist/dom-helpers-form.min.js"></script> <!-- Optional, for forms integration -->

```

### Module Import
```javascript
// ES6 Modules
import { Storage, StorageHelper } from './dom-helpers-storage.js';

// CommonJS
const { Storage, StorageHelper } = require('./dom-helpers-storage.js');
```

## 🎯 Quick Start

```javascript
// Basic usage - works just like localStorage but better
Storage.set('username', 'john_doe');
Storage.set('preferences', { theme: 'dark', language: 'en' });
Storage.set('cart', ['item1', 'item2', 'item3']);

// Retrieve data (automatically deserialized)
const username = Storage.get('username');
const preferences = Storage.get('preferences');
const cart = Storage.get('cart', []); // with default value

// Check if data exists
if (Storage.has('username')) {
    console.log('User is logged in');
}
```

## 📚 Core Features

### 1. Basic Storage Operations

#### Setting Data
```javascript
// Store different data types
Storage.set('string', 'Hello World');
Storage.set('number', 42);
Storage.set('boolean', true);
Storage.set('object', { name: 'Alice', age: 30 });
Storage.set('array', [1, 2, 3, 'four']);

// Returns true on success, false on failure
const success = Storage.set('key', 'value');
```

#### Getting Data
```javascript
// Get data with automatic type restoration
const data = Storage.get('object'); // Returns: { name: 'Alice', age: 30 }

// Get with default value if key doesn't exist
const theme = Storage.get('theme', 'light');
const items = Storage.get('items', []);
```

#### Checking Existence
```javascript
if (Storage.has('userToken')) {
    // User is authenticated
    redirectToApp();
} else {
    // Show login form
    showLogin();
}
```

#### Removing Data
```javascript
Storage.remove('temporaryData');

// Check if removal was successful
const removed = Storage.remove('key'); // Returns true/false
```

#### Clearing Storage
```javascript
// Clear all data in current namespace
Storage.clear();

// Get all keys and values
const allKeys = Storage.keys();
const allValues = Storage.values();
const allEntries = Storage.entries(); // Returns [key, value] pairs
```

### 2. Session Storage

```javascript
// Use session storage (data persists only for the session)
Storage.session.set('temporaryData', 'This will be gone when tab closes');
Storage.session.set('cartItems', ['item1', 'item2']);

// Get session data
const tempData = Storage.session.get('temporaryData');
const cartItems = Storage.session.get('cartItems', []);

// All methods work the same as localStorage
Storage.session.has('key');
Storage.session.remove('key');
Storage.session.clear();
Storage.session.keys();
```

### 3. Vanilla-like API

For developers who prefer the traditional localStorage syntax:

```javascript
// Traditional localStorage-style methods
Storage.setItem('key', 'value');
Storage.setItem('user', { name: 'John', email: 'john@example.com' });

const value = Storage.getItem('key');
const user = Storage.getItem('user');

Storage.removeItem('key');

// Works with session storage too
Storage.session.setItem('sessionKey', 'sessionValue');
const sessionData = Storage.session.getItem('sessionKey');
```

### 4. Namespace System

Organize your data with hierarchical namespaces to avoid conflicts:

```javascript
// Create namespaced storage instances
const appStorage = Storage.namespace('myApp');
const userStorage = Storage.namespace('user');
const settingsStorage = Storage.namespace('settings');

// Store data in different namespaces
appStorage.set('version', '1.0.0');
userStorage.set('name', 'Alice');
settingsStorage.set('theme', 'dark');

// Data is isolated between namespaces
appStorage.get('theme'); // undefined
settingsStorage.get('theme'); // 'dark'

// Nested namespaces
const appSettings = appStorage.namespace('settings');
appSettings.set('debugMode', true);

// Clear only specific namespace
userStorage.clear(); // Only clears user namespace
```

### 5. Expiry System

Set automatic expiration for stored data:

```javascript
// Expire in 5 seconds
Storage.set('temporaryToken', 'abc123', { expires: 5 });

// Expire at specific date
const expiryDate = new Date('2024-12-31');
Storage.set('yearEndData', 'data', { expires: expiryDate });

// Expire in 1 hour (3600 seconds)
Storage.set('sessionData', userData, { expires: 3600 });

// Data automatically returns null after expiry
setTimeout(() => {
    const token = Storage.get('temporaryToken'); // null (expired)
}, 6000);

// Manual cleanup of expired items
const cleanedCount = Storage.cleanup(); // Returns number of items cleaned
```

### 6. Advanced Operations

#### Bulk Operations
```javascript
// Set multiple items at once
const results = Storage.setMultiple({
    'user.name': 'Alice',
    'user.email': 'alice@example.com',
    'user.preferences': { theme: 'dark' }
});

// Get multiple items
const userData = Storage.getMultiple(['user.name', 'user.email']);
// Returns: { 'user.name': 'Alice', 'user.email': 'alice@example.com' }

// Remove multiple items
Storage.removeMultiple(['temp1', 'temp2', 'temp3']);
```

#### Increment/Decrement
```javascript
// Initialize counter
Storage.set('pageViews', 0);

// Increment by 1 (default)
Storage.increment('pageViews'); // Returns 1
Storage.increment('pageViews'); // Returns 2

// Increment by custom amount
Storage.increment('score', 10); // Adds 10

// Decrement
Storage.decrement('lives'); // Subtracts 1
Storage.decrement('health', 5); // Subtracts 5

// Works with non-existent keys (starts from 0)
Storage.increment('newCounter'); // Returns 1
```

#### Toggle Boolean Values
```javascript
// Toggle boolean values
Storage.set('darkMode', false);
Storage.toggle('darkMode'); // Returns true
Storage.toggle('darkMode'); // Returns false

// Works with non-existent keys (starts as false, toggles to true)
Storage.toggle('newFlag'); // Returns true
```

### 7. Storage Statistics

Monitor your storage usage:

```javascript
// Get detailed statistics
const stats = Storage.stats();
console.log(stats);
/* Returns:
{
  local: {
    keys: 15,
    totalSize: 2048,
    averageSize: 136,
    namespace: 'global',
    storageType: 'localStorage'
  },
  session: {
    keys: 3,
    totalSize: 256,
    averageSize: 85,
    namespace: 'global',
    storageType: 'sessionStorage'
  }
}
*/

// Get stats for specific namespace
const appStorage = Storage.namespace('myApp');
const appStats = appStorage.stats();
```

## 📝 Forms Integration

Automatically save and restore form data:

### Basic Form Integration

```html
<form id="userForm">
    <input type="text" name="name" placeholder="Name">
    <input type="email" name="email" placeholder="Email">
    <select name="country">
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
    </select>
    <textarea name="bio" placeholder="Bio"></textarea>
</form>
```

```javascript
// Enable auto-save (saves every 1 second by default)
Forms.userForm.autoSave('userFormData', {
    interval: 500,        // Save every 500ms
    namespace: 'forms',   // Use 'forms' namespace
    events: ['input', 'change'] // Save on these events
});

// Restore form data
Forms.userForm.restore('userFormData', {
    namespace: 'forms'
});

// Clear auto-save
Forms.userForm.clearAutoSave();
```

### Advanced Form Features

```javascript
// Manual form data management
const formStorage = Storage.namespace('forms');

// Save current form state
const currentData = Forms.userForm.values;
formStorage.set('backup', currentData);

// Load saved state
const savedData = formStorage.get('backup', {});
Forms.userForm.values = savedData;

// Auto-save with expiry
Forms.userForm.autoSave('tempForm', {
    expires: 3600, // Expire in 1 hour
    namespace: 'temporary'
});
```

## 🛠️ Real-World Examples

### User Preferences System
```javascript
const userPrefs = Storage.namespace('userPreferences');

// Save user preferences
function savePreferences(prefs) {
    userPrefs.set('theme', prefs.theme);
    userPrefs.set('language', prefs.language);
    userPrefs.set('notifications', prefs.notifications);
}

// Load user preferences with defaults
function loadPreferences() {
    return {
        theme: userPrefs.get('theme', 'light'),
        language: userPrefs.get('language', 'en'),
        notifications: userPrefs.get('notifications', true)
    };
}

// Apply theme
const prefs = loadPreferences();
document.body.className = `theme-${prefs.theme}`;
```

### Shopping Cart
```javascript
const cartStorage = Storage.namespace('shopping');

function createShoppingCart() {
    const cart = {
        items: cartStorage.get('items', [])
    };
    
    cart.addItem = function(product) {
        this.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
        this.save();
    };
    
    cart.removeItem = function(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
    };
    
    cart.save = function() {
        cartStorage.set('items', this.items);
        cartStorage.set('lastUpdated', new Date().toISOString());
    };
    
    cart.getTotal = function() {
        return this.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );
    };
    
    return cart;
}

// Usage
const shoppingCart = createShoppingCart();
```

### Session Management
```javascript
const sessionMgr = Storage.session.namespace('auth');

function createSessionManager() {
    const sessionManager = {};
    
    sessionManager.login = function(user, token) {
        // Store session data with 8-hour expiry
        sessionMgr.set('user', user, { expires: 28800 });
        sessionMgr.set('token', token, { expires: 28800 });
        sessionMgr.set('loginTime', new Date().toISOString());
    };
    
    sessionManager.logout = function() {
        sessionMgr.clear();
    };
    
    sessionManager.isLoggedIn = function() {
        return sessionMgr.has('token') && sessionMgr.has('user');
    };
    
    sessionManager.getUser = function() {
        return sessionMgr.get('user');
    };
    
    sessionManager.getToken = function() {
        return sessionMgr.get('token');
    };
    
    return sessionManager;
}

// Usage
const sessionManager = createSessionManager();
```

### Recent Searches
```javascript
const searchStorage = Storage.namespace('search');

function addRecentSearch(query) {
    let recent = searchStorage.get('recent', []);
    
    // Remove if already exists
    recent = recent.filter(item => item !== query);
    
    // Add to beginning
    recent.unshift(query);
    
    // Keep only last 10 searches
    recent = recent.slice(0, 10);
    
    searchStorage.set('recent', recent);
}

function getRecentSearches() {
    return searchStorage.get('recent', []);
}

function clearRecentSearches() {
    searchStorage.remove('recent');
}
```

## 🎯 Best Practices

### 1. Use Namespaces
```javascript
// ✅ Good - organized and conflict-free
const userStorage = Storage.namespace('user');
const appStorage = Storage.namespace('app');

userStorage.set('name', 'Alice');
appStorage.set('version', '1.0.0');

// ❌ Avoid - potential conflicts
Storage.set('name', 'Alice');
Storage.set('version', '1.0.0');
```

### 2. Always Provide Defaults
```javascript
// ✅ Good - prevents undefined errors
const theme = Storage.get('theme', 'light');
const items = Storage.get('cartItems', []);

// ❌ Risky - might return null/undefined
const theme = Storage.get('theme');
```

### 3. Handle Storage Failures
```javascript
// ✅ Good - check return values
const success = Storage.set('largeData', hugeObject);
if (!success) {
    console.warn('Failed to save data - storage might be full');
    // Handle gracefully
}

// ✅ Good - use try-catch for critical operations
try {
    const criticalData = Storage.get('criticalData');
    processCriticalData(criticalData);
} catch (error) {
    console.error('Storage error:', error);
    // Fallback behavior
}
```

### 4. Use Expiry for Temporary Data
```javascript
// ✅ Good - temporary data with expiry
Storage.set('tempToken', token, { expires: 3600 }); // 1 hour
Storage.set('cacheData', data, { expires: 300 });   // 5 minutes

// ✅ Good - cleanup expired data periodically
setInterval(() => {
    const cleaned = Storage.cleanup();
    if (cleaned > 0) {
        console.log(`Cleaned ${cleaned} expired items`);
    }
}, 60000); // Every minute
```

### 5. Optimize Form Auto-Save
```javascript
// ✅ Good - reasonable interval and specific events
Forms.myForm.autoSave('formData', {
    interval: 2000,  // 2 seconds - not too frequent
    events: ['change', 'blur'], // Only on meaningful changes
    namespace: 'forms'
});

// ❌ Avoid - too frequent, might impact performance
Forms.myForm.autoSave('formData', {
    interval: 100,   // Too frequent
    events: ['input', 'keyup', 'change'] // Too many events
});
```

## ⚙️ Configuration & Customization

### Creating Custom Storage Instances
```javascript
// Create custom storage with specific namespace
const customStorage = new StorageHelper('localStorage', 'myApp.v2');

// Use session storage with namespace
const tempStorage = new StorageHelper('sessionStorage', 'temporary');

// Configure with options
const configuredStorage = new StorageHelper('localStorage', 'app', {
    enableLogging: true,
    autoCleanup: true,
    cleanupInterval: 60000 // 1 minute
});
```

### Error Handling Configuration
```javascript
// The library handles errors gracefully by default
// You can monitor errors through console warnings

// Custom error handling (if extending the library)
Storage.onError = function(operation, key, error) {
    console.error(`Storage ${operation} failed for key "${key}":`, error);
    // Send to error tracking service
    errorTracker.log('storage_error', { operation, key, error });
};
```

## 🔧 Browser Compatibility

### Requirements
- **Modern Browsers**: Chrome 4+, Firefox 3.5+, Safari 4+, IE 8+
- **Storage Support**: localStorage and sessionStorage APIs
- **JavaScript**: ES5+ (ES6+ features are optional)

### Feature Support
| Feature | localStorage | sessionStorage | Notes |
|---------|-------------|----------------|-------|
| Basic Operations | ✅ | ✅ | Full support |
| JSON Serialization | ✅ | ✅ | Automatic |
| Expiry System | ✅ | ✅ | Custom implementation |
| Namespaces | ✅ | ✅ | Hierarchical support |
| Forms Integration | ✅ | ✅ | Requires DOM Helpers Form |

### Fallback Behavior
```javascript
// The library provides graceful fallbacks
if (!localStorage) {
    // Falls back to in-memory storage
    console.warn('localStorage not available, using memory storage');
}
```

## 🚨 Limitations & Considerations

### Storage Limits
- **localStorage**: ~5-10MB per domain (varies by browser)
- **sessionStorage**: ~5-10MB per tab (varies by browser)
- **Quota Exceeded**: Library handles gracefully, returns false on failure

### Performance Considerations
```javascript
// ✅ Efficient - batch operations
Storage.setMultiple({
    'key1': 'value1',
    'key2': 'value2',
    'key3': 'value3'
});

// ❌ Less efficient - multiple individual operations
Storage.set('key1', 'value1');
Storage.set('key2', 'value2');
Storage.set('key3', 'value3');
```

### Security Notes
- **Client-Side Only**: Data is stored locally, not secure for sensitive information
- **Domain Isolation**: Data is isolated per domain/origin
- **No Encryption**: Data is stored in plain text (implement encryption if needed)

```javascript
// For sensitive data, consider encryption
function encryptData(data, key) {
    // Use a proper encryption library
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

function decryptData(encryptedData, key) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// Store encrypted data
const encrypted = encryptData(sensitiveData, userKey);
Storage.set('sensitiveData', encrypted);
```

## 🔍 Debugging & Troubleshooting

### Enable Debug Mode
```javascript
// Check what's stored
console.log('All keys:', Storage.keys());
console.log('All values:', Storage.values());
console.log('Storage stats:', Storage.stats());

// Check specific namespace
const appStorage = Storage.namespace('app');
console.log('App keys:', appStorage.keys());
```

### Common Issues

#### 1. Data Not Persisting
```javascript
// Check if storage is available
if (typeof Storage !== 'undefined') {
    console.log('Storage is available');
} else {
    console.error('Storage is not available');
}

// Check for quota exceeded
const success = Storage.set('test', 'data');
if (!success) {
    console.error('Storage quota may be exceeded');
}
```

#### 2. Forms Not Auto-Saving
```javascript
// Ensure Forms module is loaded
if (typeof Forms !== 'undefined') {
    console.log('Forms module is available');
} else {
    console.error('Forms module not loaded');
}

// Check if form exists
if (Forms.myForm) {
    console.log('Form found');
} else {
    console.error('Form not found - check ID');
}
```

#### 3. Expired Data Issues
```javascript
// Check if data is expired
const data = Storage.get('key');
if (data === null) {
    console.log('Data might be expired or doesn\'t exist');
}

// Manual cleanup
const cleaned = Storage.cleanup();
console.log(`Cleaned ${cleaned} expired items`);
```

## 📈 Performance Tips

### 1. Batch Operations
```javascript
// ✅ Efficient
const data = Storage.getMultiple(['user', 'preferences', 'settings']);

// ❌ Less efficient
const user = Storage.get('user');
const preferences = Storage.get('preferences');
const settings = Storage.get('settings');
```

### 2. Use Appropriate Storage Type
```javascript
// ✅ Use sessionStorage for temporary data
Storage.session.set('tempData', data);

// ✅ Use localStorage for persistent data
Storage.set('userPreferences', preferences);
```

### 3. Optimize Auto-Save Intervals
```javascript
// ✅ Reasonable interval
Forms.myForm.autoSave('data', { interval: 2000 });

// ❌ Too frequent - impacts performance
Forms.myForm.autoSave('data', { interval: 100 });
```

## 🎉 Conclusion

The DOM Helpers Storage Module transforms basic web storage into a powerful, feature-rich data management system. With automatic serialization, expiry management, namespaces, and forms integration, it provides everything you need for modern web application storage requirements.

### Key Benefits:
- **🚀 Developer Friendly**: Intuitive API that's easy to learn and use
- **🔧 Feature Rich**: Advanced functionality beyond basic storage
- **🛡️ Reliable**: Comprehensive error handling and fallbacks
- **📱 Compatible**: Works across all modern browsers
- **🎯 Flexible**: Suitable for simple apps to complex applications

### Getting Started:
1. Include the library in your project
2. Start with basic `Storage.set()` and `Storage.get()` operations
3. Explore namespaces for organization
4. Add expiry for temporary data
5. Integrate with forms for automatic data persistence

Whether you're building a simple todo app or a complex web application, the DOM Helpers Storage Module provides the robust foundation you need for client-side data management.

---

**Ready to get started?** Check out the examples above and begin transforming your web storage experience today!
