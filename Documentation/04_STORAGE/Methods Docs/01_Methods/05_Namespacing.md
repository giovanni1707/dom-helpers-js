# Namespacing

Complete documentation for creating and using namespaced storage instances in the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Method Reference](#method-reference)
3. [Why Use Namespaces?](#why-use-namespaces)
4. [Basic Usage](#basic-usage)
5. [Nested Namespaces](#nested-namespaces)
6. [Common Patterns](#common-patterns)
7. [Examples](#examples)
8. [Best Practices](#best-practices)

---

## Overview

Namespacing allows you to create isolated storage areas within localStorage or sessionStorage. This helps organize your data, prevent naming conflicts, and makes it easier to manage related data as a group.

**Key Benefits:**
- 🗂️ **Organization** - Group related data together
- 🔒 **Isolation** - Prevent key naming conflicts
- 🧹 **Easy Cleanup** - Clear entire namespaces at once
- 🎯 **Clarity** - Self-documenting storage structure
- 🔧 **Maintainability** - Easier to manage complex applications

---

## Method Reference

### `storage.namespace(name)`

Create a new namespaced storage instance.

**Parameters:**
- `name` (string, required): The namespace name

**Returns:** 
- `StorageHelper` - A new storage instance scoped to the namespace

**Example:**
```javascript
const userStorage = Storage.namespace('user');
const appStorage = Storage.namespace('app');
```

**Storage Key Format:**
```javascript
// Without namespace
Storage.set('theme', 'dark');
// Stored as: 'theme'

// With namespace
const settings = Storage.namespace('settings');
settings.set('theme', 'dark');
// Stored as: 'settings:theme'
```

---

## Why Use Namespaces?

### Without Namespaces (Problems)

```javascript
// Multiple developers working on the same app
Storage.set('userId', 123);        // Auth module
Storage.set('userId', 456);        // Different module - CONFLICT!

Storage.set('settings', {...});    // App settings
Storage.set('settings', {...});    // User settings - CONFLICT!

Storage.set('cache', data);        // Module A
Storage.set('cache', data);        // Module B - CONFLICT!

// All keys in global namespace - hard to manage
Storage.keys(); 
// ['userId', 'settings', 'cache', 'theme', 'lang', 'token', ...]
```

### With Namespaces (Solution)

```javascript
// Each module has its own namespace
const auth = Storage.namespace('auth');
const user = Storage.namespace('user');
const app = Storage.namespace('app');

auth.set('userId', 123);           // Stored as 'auth:userId'
user.set('userId', 456);           // Stored as 'user:userId' - No conflict!

app.set('settings', {...});        // Stored as 'app:settings'
user.set('settings', {...});       // Stored as 'user:settings' - No conflict!

// Easy to see what belongs where
auth.keys();  // ['userId', 'token', 'expiresAt']
user.keys();  // ['userId', 'name', 'email', 'settings']
app.keys();   // ['settings', 'version', 'initialized']
```

---

## Basic Usage

### Creating Namespaces

```javascript
// Create namespace for user data
const user = Storage.namespace('user');

// Create namespace for app settings
const settings = Storage.namespace('settings');

// Create namespace for cache
const cache = Storage.namespace('cache');
```

### Using Namespaced Storage

```javascript
// User namespace
const user = Storage.namespace('user');
user.set('name', 'John Doe');
user.set('email', 'john@example.com');
user.set('role', 'admin');

// Settings namespace
const settings = Storage.namespace('settings');
settings.set('theme', 'dark');
settings.set('language', 'en');
settings.set('notifications', true);

// Retrieve values
console.log(user.get('name'));           // 'John Doe'
console.log(settings.get('theme'));      // 'dark'

// Check keys in each namespace
console.log(user.keys());                // ['name', 'email', 'role']
console.log(settings.keys());            // ['theme', 'language', 'notifications']
```

### Clearing Namespaces

```javascript
const temp = Storage.namespace('temp');
temp.set('data1', 'value1');
temp.set('data2', 'value2');

// Clear only the 'temp' namespace
temp.clear(); // Removes 'temp:data1' and 'temp:data2'

// Other namespaces remain untouched
console.log(user.keys()); // Still has data
```

---

## Nested Namespaces

Create namespaces within namespaces for deeper organization.

### Creating Nested Namespaces

```javascript
// Create parent namespace
const user = Storage.namespace('user');

// Create nested namespaces
const userProfile = user.namespace('profile');
const userSettings = user.namespace('settings');
const userActivity = user.namespace('activity');

// Store data in nested namespaces
userProfile.set('avatar', 'avatar.jpg');      // 'user:profile:avatar'
userSettings.set('theme', 'dark');            // 'user:settings:theme'
userActivity.set('lastLogin', new Date());    // 'user:activity:lastLogin'
```

### Multi-level Nesting

```javascript
// Deep nesting
const app = Storage.namespace('app');
const modules = app.namespace('modules');
const dashboard = modules.namespace('dashboard');

dashboard.set('layout', 'grid');
// Stored as: 'app:modules:dashboard:layout'

// Another branch
const reports = modules.namespace('reports');
reports.set('defaultView', 'monthly');
// Stored as: 'app:modules:reports:defaultView'
```

### Visual Structure

```
Storage Root
│
├── user:profile:avatar
├── user:profile:bio
├── user:settings:theme
├── user:settings:language
├── user:activity:lastLogin
│
├── app:modules:dashboard:layout
├── app:modules:reports:defaultView
│
└── cache:api:users
    └── cache:api:posts
```

---

## Common Patterns

### 1. Module-based Organization

```javascript
// Authentication module
const auth = Storage.namespace('auth');
auth.set('token', 'abc123');
auth.set('refreshToken', 'xyz789');
auth.set('expiresAt', Date.now() + 3600000);

// Shopping cart module
const cart = Storage.namespace('cart');
cart.set('items', []);
cart.set('total', 0);
cart.set('currency', 'USD');

// User preferences module
const prefs = Storage.namespace('preferences');
prefs.set('theme', 'dark');
prefs.set('notifications', true);
```

### 2. Feature-based Organization

```javascript
// Shopping feature
const shopping = Storage.namespace('shopping');
const shoppingCart = shopping.namespace('cart');
const shoppingWishlist = shopping.namespace('wishlist');
const shoppingHistory = shopping.namespace('history');

shoppingCart.set('items', [...]);
shoppingWishlist.set('items', [...]);
shoppingHistory.set('orders', [...]);
```

### 3. Environment-based Organization

```javascript
// Different namespaces for different environments
const env = 'production'; // or 'development', 'staging'
const config = Storage.namespace(`config:${env}`);

config.set('apiUrl', 'https://api.example.com');
config.set('debug', false);
```

### 4. User-specific Organization

```javascript
// Multi-user application
function getUserStorage(userId) {
  return Storage.namespace(`user:${userId}`);
}

const user1Storage = getUserStorage(123);
const user2Storage = getUserStorage(456);

user1Storage.set('theme', 'dark');
user2Storage.set('theme', 'light');
// No conflicts!
```

### 5. Temporary vs Permanent Data

```javascript
// Permanent data
const permanent = Storage.namespace('permanent');
permanent.set('userId', 123);
permanent.set('preferences', {...});

// Temporary/cache data
const temp = Storage.namespace('temp');
temp.set('searchResults', [...], { expires: 600 });
temp.set('draftData', {...}, { expires: 3600 });

// Easy to clear all temporary data
temp.clear();
```

---

## Examples

### Example 1: Multi-tenant Application

```javascript
class TenantStorage {
  constructor(tenantId) {
    this.storage = Storage.namespace(`tenant:${tenantId}`);
  }
  
  saveData(key, value) {
    return this.storage.set(key, value);
  }
  
  loadData(key) {
    return this.storage.get(key);
  }
  
  clearAll() {
    return this.storage.clear();
  }
}

// Usage
const tenant1 = new TenantStorage('company-a');
const tenant2 = new TenantStorage('company-b');

tenant1.saveData('settings', { theme: 'blue' });
tenant2.saveData('settings', { theme: 'green' });
// No conflicts - completely isolated
```

### Example 2: Feature Flags System

```javascript
class FeatureManager {
  constructor() {
    this.storage = Storage.namespace('features');
    this.beta = this.storage.namespace('beta');
    this.experimental = this.storage.namespace('experimental');
  }
  
  enableBeta(feature) {
    this.beta.set(feature, true);
  }
  
  enableExperimental(feature) {
    this.experimental.set(feature, true);
  }
  
  isBetaEnabled(feature) {
    return this.beta.get(feature, false);
  }
  
  isExperimentalEnabled(feature) {
    return this.experimental.get(feature, false);
  }
  
  clearAllExperimental() {
    this.experimental.clear();
  }
}

// Usage
const features = new FeatureManager();
features.enableBeta('newDashboard');
features.enableExperimental('aiAssistant');

if (features.isBetaEnabled('newDashboard')) {
  loadNewDashboard();
}
```

### Example 3: Cache Management System

```javascript
class CacheManager {
  constructor() {
    this.cache = Storage.namespace('cache');
    this.api = this.cache.namespace('api');
    this.images = this.cache.namespace('images');
    this.static = this.cache.namespace('static');
  }
  
  cacheAPIResponse(endpoint, data, ttl = 600) {
    this.api.set(endpoint, data, { expires: ttl });
  }
  
  getCachedAPIResponse(endpoint) {
    return this.api.get(endpoint);
  }
  
  cacheImage(url, blob, ttl = 3600) {
    this.images.set(url, blob, { expires: ttl });
  }
  
  clearAPICache() {
    this.api.clear();
  }
  
  clearImageCache() {
    this.images.clear();
  }
  
  clearAllCache() {
    this.cache.clear();
  }
  
  getCacheStats() {
    return {
      api: this.api.stats(),
      images: this.images.stats(),
      static: this.static.stats()
    };
  }
}

// Usage
const cache = new CacheManager();

// Cache API responses
cache.cacheAPIResponse('/users', userData, 300);
cache.cacheAPIResponse('/posts', postsData, 600);

// Get cached data
const users = cache.getCachedAPIResponse('/users');

// Clear specific cache
cache.clearAPICache();

// Get statistics
const stats = cache.getCacheStats();
console.log('API cache:', stats.api.keys, 'items');
```

### Example 4: Settings Manager with Categories

```javascript
class SettingsManager {
  constructor() {
    this.root = Storage.namespace('settings');
    this.appearance = this.root.namespace('appearance');
    this.privacy = this.root.namespace('privacy');
    this.notifications = this.root.namespace('notifications');
    this.advanced = this.root.namespace('advanced');
  }
  
  // Appearance settings
  setTheme(theme) {
    this.appearance.set('theme', theme);
  }
  
  setFontSize(size) {
    this.appearance.set('fontSize', size);
  }
  
  getAppearanceSettings() {
    return {
      theme: this.appearance.get('theme', 'light'),
      fontSize: this.appearance.get('fontSize', 14),
      compactMode: this.appearance.get('compactMode', false)
    };
  }
  
  // Privacy settings
  setDataSharing(enabled) {
    this.privacy.set('dataSharing', enabled);
  }
  
  setAnalytics(enabled) {
    this.privacy.set('analytics', enabled);
  }
  
  getPrivacySettings() {
    return {
      dataSharing: this.privacy.get('dataSharing', false),
      analytics: this.privacy.get('analytics', true),
      cookies: this.privacy.get('cookies', true)
    };
  }
  
  // Notification settings
  setEmailNotifications(enabled) {
    this.notifications.set('email', enabled);
  }
  
  setPushNotifications(enabled) {
    this.notifications.set('push', enabled);
  }
  
  getNotificationSettings() {
    return {
      email: this.notifications.get('email', true),
      push: this.notifications.get('push', true),
      sms: this.notifications.get('sms', false)
    };
  }
  
  // Reset category
  resetAppearance() {
    this.appearance.clear();
  }
  
  resetPrivacy() {
    this.privacy.clear();
  }
  
  // Reset all settings
  resetAll() {
    this.root.clear();
  }
}

// Usage
const settings = new SettingsManager();

// Set appearance
settings.setTheme('dark');
settings.setFontSize(16);

// Set privacy
settings.setDataSharing(false);
settings.setAnalytics(true);

// Set notifications
settings.setEmailNotifications(true);
settings.setPushNotifications(false);

// Get settings by category
const appearance = settings.getAppearanceSettings();
const privacy = settings.getPrivacySettings();
const notifications = settings.getNotificationSettings();

// Reset specific category
settings.resetAppearance();

// Reset everything
settings.resetAll();
```

### Example 5: Form Wizard with Steps

```javascript
class WizardStorage {
  constructor(wizardName) {
    this.wizard = Storage.namespace(`wizard:${wizardName}`);
    this.steps = this.wizard.namespace('steps');
    this.meta = this.wizard.namespace('meta');
  }
  
  saveStep(stepNumber, data) {
    this.steps.set(`step${stepNumber}`, data);
    this.meta.set('lastStep', stepNumber);
    this.meta.set('updatedAt', new Date());
  }
  
  getStep(stepNumber) {
    return this.steps.get(`step${stepNumber}`, {});
  }
  
  getAllSteps() {
    const keys = this.steps.keys();
    const data = {};
    keys.forEach(key => {
      data[key] = this.steps.get(key);
    });
    return data;
  }
  
  getCurrentStep() {
    return this.meta.get('lastStep', 1);
  }
  
  markStepComplete(stepNumber) {
    const completed = this.meta.get('completedSteps', []);
    if (!completed.includes(stepNumber)) {
      completed.push(stepNumber);
      this.meta.set('completedSteps', completed);
    }
  }
  
  isStepComplete(stepNumber) {
    const completed = this.meta.get('completedSteps', []);
    return completed.includes(stepNumber);
  }
  
  clear() {
    this.wizard.clear();
  }
  
  getProgress(totalSteps) {
    const completed = this.meta.get('completedSteps', []);
    return Math.round((completed.length / totalSteps) * 100);
  }
}

// Usage
const registration = new WizardStorage('registration');

// Save step data
registration.saveStep(1, {
  firstName: 'John',
  lastName: 'Doe'
});

registration.saveStep(2, {
  email: 'john@example.com',
  phone: '555-0100'
});

// Mark steps as complete
registration.markStepComplete(1);

// Get current progress
const currentStep = registration.getCurrentStep();
const progress = registration.getProgress(5);

console.log(`Step ${currentStep} - ${progress}% complete`);

// Retrieve all data
const allData = registration.getAllSteps();

// Clear wizard after submission
registration.clear();
```

---

## Best Practices

### 1. Use Descriptive Namespace Names

```javascript
// Good: Clear and descriptive
const userProfile = Storage.namespace('user:profile');
const appSettings = Storage.namespace('app:settings');
const apiCache = Storage.namespace('cache:api');

// Avoid: Vague or unclear
const ns1 = Storage.namespace('data');
const temp = Storage.namespace('stuff');
```

### 2. Establish Naming Conventions

```javascript
// Consistent naming pattern
const auth = Storage.namespace('auth');
const user = Storage.namespace('user');
const cart = Storage.namespace('cart');
const prefs = Storage.namespace('prefs');

// Use colons for hierarchy
const userSettings = Storage.namespace('user:settings');
const userActivity = Storage.namespace('user:activity');
```

### 3. Don't Over-nest

```javascript
// Good: 2-3 levels max
const dashboard = Storage.namespace('app').namespace('dashboard');

// Avoid: Too deep
const widget = Storage.namespace('app')
  .namespace('modules')
  .namespace('dashboard')
  .namespace('widgets')
  .namespace('chart'); // Too complex!
```

### 4. Group Related Data

```javascript
// Good: Logical grouping
const shopping = Storage.namespace('shopping');
const shoppingCart = shopping.namespace('cart');
const shoppingWishlist = shopping.namespace('wishlist');
const shoppingOrders = shopping.namespace('orders');

// Clear related data together
shopping.clear(); // Clears cart, wishlist, and orders
```

### 5. Use Namespaces for Temporary Data

```javascript
// Separate temporary from permanent
const permanent = Storage.namespace('data');
const temporary = Storage.namespace('temp');

permanent.set('userId', 123);
temporary.set('wizardDraft', data, { expires: 3600 });

// Easy cleanup
temporary.clear();
```

### 6. Create Factory Functions

```javascript
// Factory for user-specific storage
function createUserStorage(userId) {
  const user = Storage.namespace(`user:${userId}`);
  
  return {
    profile: user.namespace('profile'),
    settings: user.namespace('settings'),
    activity: user.namespace('activity'),
    
    clearAll() {
      user.clear();
    }
  };
}

// Usage
const johnStorage = createUserStorage(123);
johnStorage.profile.set('name', 'John');
johnStorage.settings.set('theme', 'dark');
```

### 7. Document Your Namespace Structure

```javascript
/**
 * Storage Structure:
 * 
 * app:
 *   ├── settings:
 *   │   ├── theme
 *   │   └── language
 *   └── cache:
 *       ├── users
 *       └── posts
 * 
 * user:
 *   ├── profile:
 *   │   ├── name
 *   │   └── avatar
 *   └── activity:
 *       └── lastLogin
 */

const app = Storage.namespace('app');
const user = Storage.namespace('user');
```

---

## Summary

**Key Points:**

✅ **Organize data** with isolated namespaces  
✅ **Prevent conflicts** with separate storage areas  
✅ **Easy cleanup** by clearing entire namespaces  
✅ **Nest namespaces** for hierarchical organization  
✅ **Better code** through logical grouping

**When to Use Namespaces:**

- Multiple modules or features
- Multi-user applications
- Separating temporary from permanent data
- Organizing cache by type
- Feature flags and A/B testing
- Different environments (dev, staging, prod)

**Quick Reference:**

```javascript
// Create namespace
const ns = Storage.namespace('myapp');

// Use like regular storage
ns.set('key', 'value');
ns.get('key');
ns.remove('key');
ns.clear();

// Nest namespaces
const sub = ns.namespace('subsection');

// Works with all storage methods
ns.setMultiple({...});
ns.getMultiple([...]);
ns.increment('counter');
```

Namespaces are essential for building organized, maintainable applications with clean storage architecture!