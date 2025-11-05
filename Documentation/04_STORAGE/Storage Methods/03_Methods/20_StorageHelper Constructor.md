# StorageHelper Constructor

Complete documentation for creating custom StorageHelper instances in the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Constructor Reference](#constructor-reference)
3. [Parameters](#parameters)
4. [Use Cases](#use-cases)
5. [Examples](#examples)
6. [Best Practices](#best-practices)

---

## Overview

The `StorageHelper` constructor allows you to create custom storage instances with specific storage types and namespaces. While the main `Storage` object provides convenient access to localStorage, you can create custom instances for specialized use cases.

**Key Benefits:**
- 🎯 **Custom configuration** - Create storage instances with specific settings
- 📦 **Namespace isolation** - Organize storage with custom namespaces
- 🔄 **Multiple instances** - Create separate storage managers for different features
- 💾 **Storage type control** - Choose localStorage or sessionStorage
- 🛠️ **Advanced scenarios** - Build complex storage architectures

---

## Constructor Reference

### Syntax

```javascript
new StorageHelper(storageType, namespace)
```

### Parameters

#### storageType

**Type:** `string`

**Description:** The Web Storage API to use

**Values:**
- `'localStorage'` - Persistent storage (survives browser restart)
- `'sessionStorage'` - Temporary storage (cleared when tab closes)

**Default:** `'localStorage'`

**Required:** Yes

#### namespace

**Type:** `string`

**Description:** Namespace prefix for organizing storage keys

**Format:** Any string (will be used as prefix with `:` separator)

**Default:** `''` (empty string - no namespace)

**Required:** No (can be empty string)

### Returns

**`StorageHelper`** - A new storage helper instance with all storage methods

---

## Parameters

### storageType Parameter

```javascript
// localStorage (persistent)
const localHelper = new StorageHelper('localStorage', 'myapp');

// sessionStorage (temporary)
const sessionHelper = new StorageHelper('sessionStorage', 'temp');
```

**Characteristics:**

```javascript
// localStorage
const local = new StorageHelper('localStorage', '');
// - Data persists after browser restart
// - Shared across all tabs/windows
// - ~5-10 MB storage limit
// - Use for: user preferences, drafts, cached data

// sessionStorage
const session = new StorageHelper('sessionStorage', '');
// - Data cleared when tab closes
// - Isolated to current tab
// - ~5-10 MB storage limit
// - Use for: temporary session data, wizard forms
```

### namespace Parameter

```javascript
// No namespace
const global = new StorageHelper('localStorage', '');
// Keys stored as: 'key'

// With namespace
const user = new StorageHelper('localStorage', 'user');
// Keys stored as: 'user:key'

// Nested namespace
const userProfile = new StorageHelper('localStorage', 'user:profile');
// Keys stored as: 'user:profile:key'
```

**Namespace Benefits:**

- **Organization** - Group related data together
- **Isolation** - Prevent key naming conflicts
- **Cleanup** - Clear entire namespace at once
- **Multi-tenant** - Separate data by user/feature/module

---

## Use Cases

### 1. Custom Application Storage

```javascript
// Create app-specific storage
const appStorage = new StorageHelper('localStorage', 'myapp');

// Use like regular storage
appStorage.set('version', '1.0.0');
appStorage.set('initialized', true);

console.log(appStorage.get('version')); // '1.0.0'
```

### 2. User-Specific Storage

```javascript
// Create storage for specific user
function createUserStorage(userId) {
  return new StorageHelper('localStorage', `user:${userId}`);
}

const user123 = createUserStorage(123);
user123.set('preferences', { theme: 'dark' });

const user456 = createUserStorage(456);
user456.set('preferences', { theme: 'light' });

// No conflicts - isolated by userId
```

### 3. Feature-Based Storage

```javascript
// Separate storage for each feature
const authStorage = new StorageHelper('localStorage', 'auth');
const cacheStorage = new StorageHelper('localStorage', 'cache');
const settingsStorage = new StorageHelper('localStorage', 'settings');

authStorage.set('token', 'abc123');
cacheStorage.set('users', userData);
settingsStorage.set('theme', 'dark');

// Each feature has its own namespace
```

### 4. Temporary Session Storage

```javascript
// Create temporary storage for wizard
const wizardStorage = new StorageHelper('sessionStorage', 'wizard');

wizardStorage.set('step1', formData);
wizardStorage.set('currentStep', 2);

// Automatically cleared when tab closes
```

### 5. Multi-Environment Storage

```javascript
// Different storage for different environments
const env = 'production'; // or 'development', 'staging'

const config = new StorageHelper('localStorage', `config:${env}`);
config.set('apiUrl', 'https://api.example.com');
config.set('debug', false);

// Environment-specific configuration
```

---

## Examples

### Example 1: Basic Custom Instance

```javascript
// Create custom storage instance
const myStorage = new StorageHelper('localStorage', 'myapp');

// Use all storage methods
myStorage.set('user', { name: 'John', age: 30 });
myStorage.set('theme', 'dark');
myStorage.set('lastLogin', new Date());

// Retrieve data
const user = myStorage.get('user');
console.log(user.name); // 'John'

// Check existence
if (myStorage.has('theme')) {
  console.log('Theme is set');
}

// Get all keys
const keys = myStorage.keys();
console.log('Stored keys:', keys); // ['user', 'theme', 'lastLogin']

// Clear all data in this namespace
myStorage.clear();
```

### Example 2: Cache Manager

```javascript
class CacheManager {
  constructor(namespace = 'cache', ttl = 3600) {
    this.storage = new StorageHelper('localStorage', namespace);
    this.defaultTTL = ttl;
  }
  
  set(key, value, ttl = this.defaultTTL) {
    this.storage.set(key, value, { expires: ttl });
  }
  
  get(key) {
    return this.storage.get(key);
  }
  
  has(key) {
    return this.storage.has(key);
  }
  
  remove(key) {
    this.storage.remove(key);
  }
  
  clear() {
    this.storage.clear();
  }
  
  cleanup() {
    return this.storage.cleanup();
  }
  
  stats() {
    return this.storage.stats();
  }
}

// Usage
const apiCache = new CacheManager('api:cache', 600);

apiCache.set('/users', userData);
apiCache.set('/posts', postsData);

const users = apiCache.get('/users');
console.log(users);

// Clear all cached data
apiCache.clear();
```

### Example 3: Multi-Tenant Application

```javascript
class TenantStorage {
  constructor(tenantId) {
    this.tenantId = tenantId;
    this.storage = new StorageHelper('localStorage', `tenant:${tenantId}`);
  }
  
  saveData(key, value) {
    this.storage.set(key, value);
  }
  
  loadData(key, defaultValue = null) {
    return this.storage.get(key, defaultValue);
  }
  
  removeData(key) {
    this.storage.remove(key);
  }
  
  clearAllData() {
    this.storage.clear();
  }
  
  getAllKeys() {
    return this.storage.keys();
  }
  
  getStorageInfo() {
    const stats = this.storage.stats();
    return {
      tenantId: this.tenantId,
      itemCount: stats.keys,
      totalSize: stats.totalSize,
      namespace: stats.namespace
    };
  }
}

// Usage
const tenant1 = new TenantStorage('company-a');
const tenant2 = new TenantStorage('company-b');

tenant1.saveData('settings', { theme: 'blue' });
tenant2.saveData('settings', { theme: 'green' });

console.log(tenant1.loadData('settings')); // { theme: 'blue' }
console.log(tenant2.loadData('settings')); // { theme: 'green' }

// Completely isolated - no conflicts
```

### Example 4: Session Manager

```javascript
class SessionManager {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.storage = new StorageHelper('sessionStorage', `session:${sessionId}`);
  }
  
  start(userData) {
    this.storage.set('user', userData);
    this.storage.set('startTime', Date.now());
    this.storage.set('active', true);
  }
  
  update(key, value) {
    this.storage.set(key, value);
    this.storage.set('lastActivity', Date.now());
  }
  
  getData(key) {
    return this.storage.get(key);
  }
  
  isActive() {
    return this.storage.get('active', false);
  }
  
  end() {
    this.storage.clear();
  }
  
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      user: this.storage.get('user'),
      startTime: this.storage.get('startTime'),
      lastActivity: this.storage.get('lastActivity'),
      active: this.isActive()
    };
  }
}

// Usage
const session = new SessionManager('sess_abc123');

session.start({ userId: 123, name: 'John' });
session.update('currentPage', '/dashboard');

const info = session.getSessionInfo();
console.log(info);

// End session (clears all data)
session.end();
```

### Example 5: Feature Flag Manager

```javascript
class FeatureFlagManager {
  constructor(environment = 'production') {
    this.environment = environment;
    this.storage = new StorageHelper('localStorage', `features:${environment}`);
  }
  
  enable(feature) {
    this.storage.set(feature, true);
    console.log(`Feature "${feature}" enabled in ${this.environment}`);
  }
  
  disable(feature) {
    this.storage.set(feature, false);
    console.log(`Feature "${feature}" disabled in ${this.environment}`);
  }
  
  toggle(feature) {
    const current = this.isEnabled(feature);
    this.storage.set(feature, !current);
    return !current;
  }
  
  isEnabled(feature) {
    return this.storage.get(feature, false);
  }
  
  getAll() {
    const keys = this.storage.keys();
    const flags = {};
    keys.forEach(key => {
      flags[key] = this.storage.get(key);
    });
    return flags;
  }
  
  reset() {
    this.storage.clear();
    console.log(`All feature flags reset in ${this.environment}`);
  }
}

// Usage
const devFlags = new FeatureFlagManager('development');
const prodFlags = new FeatureFlagManager('production');

devFlags.enable('newDashboard');
devFlags.enable('betaFeatures');

prodFlags.enable('stableFeatures');

// Check flags
if (devFlags.isEnabled('newDashboard')) {
  loadNewDashboard();
}

// Get all flags
console.log('Dev flags:', devFlags.getAll());
console.log('Prod flags:', prodFlags.getAll());
```

### Example 6: Namespaced Storage Factory

```javascript
class StorageFactory {
  static create(type, namespace) {
    return new StorageHelper(type, namespace);
  }
  
  static createLocal(namespace) {
    return new StorageHelper('localStorage', namespace);
  }
  
  static createSession(namespace) {
    return new StorageHelper('sessionStorage', namespace);
  }
  
  static createForUser(userId, type = 'localStorage') {
    return new StorageHelper(type, `user:${userId}`);
  }
  
  static createForFeature(feature, type = 'localStorage') {
    return new StorageHelper(type, `feature:${feature}`);
  }
  
  static createForModule(module, type = 'localStorage') {
    return new StorageHelper(type, `module:${module}`);
  }
}

// Usage
const userStorage = StorageFactory.createForUser(123);
const authStorage = StorageFactory.createForFeature('auth');
const dashboardStorage = StorageFactory.createForModule('dashboard', 'sessionStorage');

userStorage.set('preferences', { theme: 'dark' });
authStorage.set('token', 'abc123');
dashboardStorage.set('layout', 'grid');

// Clean API for creating storage instances
```

---

## Best Practices

### 1. Use Descriptive Namespaces

```javascript
// Good: Clear and descriptive
const userAuth = new StorageHelper('localStorage', 'user:auth');
const apiCache = new StorageHelper('localStorage', 'api:cache');
const wizardData = new StorageHelper('sessionStorage', 'wizard:registration');

// Avoid: Vague or unclear
const storage1 = new StorageHelper('localStorage', 'data');
const temp = new StorageHelper('localStorage', 'tmp');
```

### 2. Choose Appropriate Storage Type

```javascript
// Good: Persistent data in localStorage
const settings = new StorageHelper('localStorage', 'app:settings');

// Good: Temporary data in sessionStorage
const wizard = new StorageHelper('sessionStorage', 'wizard');

// Avoid: Sensitive data in localStorage
const payments = new StorageHelper('localStorage', 'payments'); // ❌

// Better: Use sessionStorage for sensitive data
const payments = new StorageHelper('sessionStorage', 'payments'); // ✅
```

### 3. Create Wrapper Classes

```javascript
// Good: Wrap StorageHelper in custom class
class AppStorage {
  constructor() {
    this.storage = new StorageHelper('localStorage', 'myapp');
  }
  
  saveSettings(settings) {
    this.storage.set('settings', settings);
  }
  
  loadSettings() {
    return this.storage.get('settings', {});
  }
}

// Clean, application-specific API
const app = new AppStorage();
app.saveSettings({ theme: 'dark' });
```

### 4. Handle Namespace Naming

```javascript
// Good: Consistent naming convention
const namespaces = {
  USER_AUTH: 'user:auth',
  USER_PROFILE: 'user:profile',
  APP_CACHE: 'app:cache',
  APP_SETTINGS: 'app:settings'
};

const auth = new StorageHelper('localStorage', namespaces.USER_AUTH);
const cache = new StorageHelper('localStorage', namespaces.APP_CACHE);

// Easy to maintain and consistent
```

### 5. Document Instance Purpose

```javascript
/**
 * Storage for user authentication data
 * - Token storage with expiry
 * - Session management
 * - Login state tracking
 */
const authStorage = new StorageHelper('sessionStorage', 'auth');

/**
 * Storage for application cache
 * - API response caching
 * - Short-term data storage
 * - Automatic cleanup
 */
const cacheStorage = new StorageHelper('localStorage', 'cache');
```

### 6. Use Factory Pattern

```javascript
// Good: Factory for consistent creation
class StorageManager {
  static instances = new Map();
  
  static get(namespace, type = 'localStorage') {
    const key = `${type}:${namespace}`;
    
    if (!this.instances.has(key)) {
      this.instances.set(key, new StorageHelper(type, namespace));
    }
    
    return this.instances.get(key);
  }
}

// Reuses instances
const auth1 = StorageManager.get('auth');
const auth2 = StorageManager.get('auth');
console.log(auth1 === auth2); // true (same instance)
```

### 7. Validate Constructor Arguments

```javascript
// Good: Validate arguments
function createStorage(type, namespace) {
  const validTypes = ['localStorage', 'sessionStorage'];
  
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid storage type: ${type}`);
  }
  
  if (typeof namespace !== 'string') {
    throw new Error('Namespace must be a string');
  }
  
  return new StorageHelper(type, namespace);
}

// Safe creation with validation
const storage = createStorage('localStorage', 'myapp');
```

---

## Summary

**Constructor Signature:**

```javascript
new StorageHelper(storageType, namespace)
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `storageType` | `string` | Yes | - | `'localStorage'` or `'sessionStorage'` |
| `namespace` | `string` | No | `''` | Namespace prefix for keys |

**Quick Examples:**

```javascript
// Basic instances
const local = new StorageHelper('localStorage', 'myapp');
const session = new StorageHelper('sessionStorage', 'temp');

// With namespaces
const user = new StorageHelper('localStorage', 'user:123');
const cache = new StorageHelper('localStorage', 'cache:api');

// No namespace
const global = new StorageHelper('localStorage', '');
```

**Common Patterns:**

```javascript
// User-specific
const userStorage = new StorageHelper('localStorage', `user:${userId}`);

// Feature-based
const authStorage = new StorageHelper('localStorage', 'auth');

// Environment-based
const configStorage = new StorageHelper('localStorage', `config:${env}`);

// Module-based
const dashboardStorage = new StorageHelper('sessionStorage', 'dashboard');
```

**Key Points:**

✅ **Custom instances** - Create specialized storage managers  
✅ **Namespace isolation** - Organize data by feature/user/module  
✅ **Storage type control** - Choose persistent or temporary  
✅ **Full API access** - All storage methods available  
✅ **Multiple instances** - Create as many as needed  
✅ **Flexible** - Adapt to any storage architecture  

**Use When:**

- Building multi-tenant applications
- Need feature-specific storage
- Creating reusable storage modules
- Implementing complex storage architectures
- Need custom storage behavior
- Want namespace-specific instances

**Common Use Cases:**

- 👤 User-specific storage
- 🎯 Feature flags management
- 💾 Cache systems
- 🔐 Authentication storage
- 🏢 Multi-tenant applications
- 📦 Module isolation
- 🌐 Environment-specific config

The `StorageHelper` constructor provides the foundation for building custom, organized, and scalable storage solutions!