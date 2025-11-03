# DOM Helpers Storage - Global Storage Access

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Global Storage Access](#global-storage-access)
   - [Main Storage Object](#main-storage-object)
   - [Explicit Storage Types](#explicit-storage-types)
   - [Namespacing](#namespacing)
   - [Maintenance Operations](#maintenance-operations)
5. [API Reference](#api-reference)
   - [Storage Properties](#storage-properties)
   - [Storage Methods](#storage-methods)
6. [Detailed Examples](#detailed-examples)
   - [Basic Usage](#basic-usage)
   - [Working with Namespaces](#working-with-namespaces)
   - [Session vs Local Storage](#session-vs-local-storage)
   - [Expiry System](#expiry-system)
   - [Statistics and Monitoring](#statistics-and-monitoring)
7. [Advanced Usage](#advanced-usage)
   - [Multiple Namespaces](#multiple-namespaces)
   - [Automatic Cleanup](#automatic-cleanup)
   - [Storage Quotas](#storage-quotas)
8. [Best Practices](#best-practices)
9. [Browser Compatibility](#browser-compatibility)
10. [Troubleshooting](#troubleshooting)

---

## Introduction

The **Global Storage Access** API provides a unified, intuitive interface for working with browser storage (localStorage and sessionStorage). It extends the native Web Storage API with powerful features like automatic serialization, expiry management, namespacing, and statistics tracking.

### Key Features

- ✅ **Unified Interface** - Single API for both localStorage and sessionStorage
- ✅ **Automatic Serialization** - JSON serialization/deserialization handled automatically
- ✅ **Expiry System** - Time-based storage with automatic cleanup
- ✅ **Namespacing** - Organize storage with isolated namespaces
- ✅ **Statistics** - Track storage usage and performance
- ✅ **Type Safety** - Preserves data types (numbers, booleans, objects, arrays)

---

## Installation

The Storage module is part of the DOM Helpers library. Include it in your HTML:

```html
<!-- Main DOM Helpers library (required) -->
<script src="dom-helpers.js"></script>

<!-- Storage Module -->
<script src="dom-helpers-storage.js"></script>
```

Or use ES modules:

```javascript
import { Storage } from 'dom-helpers-storage.js';
```

---

## Quick Start

```javascript
// Store a value
Storage.set('username', 'JohnDoe');

// Retrieve a value
const username = Storage.get('username'); // 'JohnDoe'

// Store with expiry (1 hour)
Storage.set('token', 'abc123', { expires: 3600 });

// Use namespaces
const userStorage = Storage.namespace('user');
userStorage.set('profile', { name: 'John', age: 30 });

// Session storage
Storage.session.set('tempData', 'value');

// Get statistics
console.log(Storage.stats());
```

---

## Global Storage Access

### Main Storage Object

#### `Storage`

The main storage object that defaults to `localStorage`. This is your primary entry point for all storage operations.

**Type:** `StorageHelper`

**Default Behavior:** All operations use `localStorage`

```javascript
// These are equivalent:
Storage.set('key', 'value');
Storage.local.set('key', 'value');
```

**Example:**

```javascript
// Simple string storage
Storage.set('username', 'Alice');
console.log(Storage.get('username')); // 'Alice'

// Object storage (automatically serialized)
Storage.set('user', { name: 'Alice', role: 'admin' });
console.log(Storage.get('user')); // { name: 'Alice', role: 'admin' }

// Array storage
Storage.set('tags', ['javascript', 'storage', 'api']);
console.log(Storage.get('tags')); // ['javascript', 'storage', 'api']

// Number storage (type preserved)
Storage.set('count', 42);
console.log(Storage.get('count')); // 42 (number, not string)

// Boolean storage (type preserved)
Storage.set('isActive', true);
console.log(Storage.get('isActive')); // true (boolean, not string)
```

---

### Explicit Storage Types

#### `Storage.local`

Explicitly access `localStorage`. Provides persistent storage that survives browser restarts.

**Type:** `StorageHelper`

**Persistence:** Permanent (until manually cleared or expired)

**Use Case:** User preferences, authentication tokens, cached data

```javascript
// Explicitly use localStorage
Storage.local.set('theme', 'dark');
Storage.local.set('language', 'en');

// Data persists after browser restart
console.log(Storage.local.get('theme')); // 'dark'
```

**Comparison with Storage:**

```javascript
// These are identical:
Storage.set('key', 'value');
Storage.local.set('key', 'value');

// Storage is just an alias for Storage.local
```

---

#### `Storage.session`

Access `sessionStorage`. Provides temporary storage that is cleared when the browser tab/window is closed.

**Type:** `StorageHelper`

**Persistence:** Session-only (cleared on tab/window close)

**Use Case:** Temporary data, form drafts, current session state

```javascript
// Use sessionStorage for temporary data
Storage.session.set('tempToken', 'xyz789');
Storage.session.set('formDraft', { field1: 'value1', field2: 'value2' });

// Data is available in current session
console.log(Storage.session.get('tempToken')); // 'xyz789'

// After closing and reopening the tab
console.log(Storage.session.get('tempToken')); // null (data cleared)
```

**Session Storage Characteristics:**

- ✅ Isolated per tab/window
- ✅ Automatically cleared on close
- ✅ Higher privacy (less persistent)
- ✅ Ideal for sensitive temporary data

**Example: Tab-Specific State**

```javascript
// Each browser tab has its own session storage
// Tab 1:
Storage.session.set('currentPage', 1);

// Tab 2:
Storage.session.set('currentPage', 5);

// Each tab maintains its own value independently
```

---

### Namespacing

#### `Storage.namespace(name)`

Create an isolated storage namespace. Namespaces prevent key collisions and organize storage logically.

**Parameters:**
- `name` (string): The namespace identifier

**Returns:** `StorageHelper` - A new storage instance scoped to the namespace

**How It Works:**

Keys are prefixed with the namespace: `namespace:key`

```javascript
// Without namespace
Storage.set('config', { theme: 'light' }); // Stored as: 'config'

// With namespace
const appStorage = Storage.namespace('myApp');
appStorage.set('config', { theme: 'dark' }); // Stored as: 'myApp:config'

// No collision!
Storage.get('config'); // { theme: 'light' }
appStorage.get('config'); // { theme: 'dark' }
```

**Use Cases:**

1. **Multi-App Storage**
```javascript
const app1 = Storage.namespace('app1');
const app2 = Storage.namespace('app2');

app1.set('settings', { color: 'blue' });
app2.set('settings', { color: 'red' });

// Independent namespaces
console.log(app1.get('settings')); // { color: 'blue' }
console.log(app2.get('settings')); // { color: 'red' }
```

2. **Feature-Based Organization**
```javascript
const authStorage = Storage.namespace('auth');
const cacheStorage = Storage.namespace('cache');
const uiStorage = Storage.namespace('ui');

authStorage.set('token', 'abc123');
cacheStorage.set('apiData', { users: [...] });
uiStorage.set('sidebar', 'collapsed');
```

3. **User-Specific Storage**
```javascript
function getUserStorage(userId) {
  return Storage.namespace(`user:${userId}`);
}

const user1Storage = getUserStorage('user123');
const user2Storage = getUserStorage('user456');

user1Storage.set('preferences', { theme: 'dark' });
user2Storage.set('preferences', { theme: 'light' });
```

**Nested Namespaces:**

```javascript
const appStorage = Storage.namespace('myApp');
const userStorage = appStorage.namespace('user'); // Creates 'myApp:user'

userStorage.set('profile', { name: 'Alice' });
// Stored as: 'myApp:user:profile'
```

**Namespace Isolation:**

```javascript
const ns1 = Storage.namespace('app1');
const ns2 = Storage.namespace('app2');

ns1.set('key', 'value1');
ns2.set('key', 'value2');

// Each namespace is completely isolated
console.log(ns1.get('key')); // 'value1'
console.log(ns2.get('key')); // 'value2'

// Clearing one namespace doesn't affect others
ns1.clear();
console.log(ns1.get('key')); // null
console.log(ns2.get('key')); // 'value2' (still exists)
```

---

### Maintenance Operations

#### `Storage.cleanup()`

Remove all expired items from both localStorage and sessionStorage. Returns a count of cleaned items.

**Returns:** `Object`
```javascript
{
  local: number,    // Items cleaned from localStorage
  session: number   // Items cleaned from sessionStorage
}
```

**When to Use:**
- Regularly scheduled maintenance
- After setting many items with expiry
- Before checking available storage space
- On application startup

**Example:**

```javascript
// Store items with expiry
Storage.set('temp1', 'value1', { expires: 10 }); // 10 seconds
Storage.set('temp2', 'value2', { expires: 10 });
Storage.session.set('temp3', 'value3', { expires: 10 });

// Wait for expiry
setTimeout(() => {
  const result = Storage.cleanup();
  console.log(result);
  // { local: 2, session: 1 }
  
  // All expired items removed
  console.log(Storage.get('temp1')); // null
  console.log(Storage.get('temp2')); // null
  console.log(Storage.session.get('temp3')); // null
}, 11000);
```

**Automatic Cleanup:**

Expired items are automatically removed when accessed:

```javascript
Storage.set('autoExpire', 'value', { expires: 5 });

setTimeout(() => {
  // Automatically removed on access
  console.log(Storage.get('autoExpire')); // null (auto-cleaned)
}, 6000);
```

**Manual Cleanup Schedule:**

```javascript
// Clean up every hour
setInterval(() => {
  const result = Storage.cleanup();
  console.log(`Cleaned ${result.local} local, ${result.session} session items`);
}, 3600000);
```

---

#### `Storage.stats()`

Get detailed statistics about storage usage for both localStorage and sessionStorage.

**Returns:** `Object`
```javascript
{
  local: {
    keys: number,           // Number of keys
    totalSize: number,      // Total size in bytes
    averageSize: number,    // Average size per item
    namespace: string,      // Current namespace ('global' if none)
    storageType: string     // 'localStorage'
  },
  session: {
    keys: number,
    totalSize: number,
    averageSize: number,
    namespace: string,
    storageType: string     // 'sessionStorage'
  }
}
```

**Example:**

```javascript
// Add some data
Storage.set('user', { name: 'Alice', age: 30 });
Storage.set('settings', { theme: 'dark', language: 'en' });
Storage.session.set('tempData', 'temporary value');

// Get statistics
const stats = Storage.stats();
console.log(stats);

// Output:
{
  local: {
    keys: 2,
    totalSize: 156,
    averageSize: 78,
    namespace: 'global',
    storageType: 'localStorage'
  },
  session: {
    keys: 1,
    totalSize: 45,
    averageSize: 45,
    namespace: 'global',
    storageType: 'sessionStorage'
  }
}
```

**Namespace-Specific Stats:**

```javascript
const appStorage = Storage.namespace('myApp');

appStorage.set('config', { theme: 'dark' });
appStorage.set('cache', { data: [1, 2, 3] });

// Stats for specific namespace
const appStats = appStorage.stats();
console.log(appStats);

// Output:
{
  keys: 2,
  totalSize: 89,
  averageSize: 44.5,
  namespace: 'myApp',
  storageType: 'localStorage'
}
```

**Monitoring Storage Usage:**

```javascript
function monitorStorage() {
  const stats = Storage.stats();
  
  console.log(`Local Storage: ${stats.local.keys} items, ${stats.local.totalSize} bytes`);
  console.log(`Session Storage: ${stats.session.keys} items, ${stats.session.totalSize} bytes`);
  
  // Check if approaching quota (typical: 5-10MB)
  const quotaWarning = 5 * 1024 * 1024; // 5MB
  if (stats.local.totalSize > quotaWarning) {
    console.warn('LocalStorage approaching quota limit!');
  }
}

// Monitor every minute
setInterval(monitorStorage, 60000);
```

**Storage Health Dashboard:**

```javascript
function storageHealthCheck() {
  const stats = Storage.stats();
  
  return {
    localStorage: {
      itemCount: stats.local.keys,
      sizeKB: Math.round(stats.local.totalSize / 1024),
      avgSizeBytes: Math.round(stats.local.averageSize),
      percentFull: (stats.local.totalSize / (5 * 1024 * 1024) * 100).toFixed(2) + '%'
    },
    sessionStorage: {
      itemCount: stats.session.keys,
      sizeKB: Math.round(stats.session.totalSize / 1024),
      avgSizeBytes: Math.round(stats.session.averageSize),
      percentFull: (stats.session.totalSize / (5 * 1024 * 1024) * 100).toFixed(2) + '%'
    }
  };
}

console.table(storageHealthCheck());
```

---

## API Reference

### Storage Properties

| Property | Type | Description |
|----------|------|-------------|
| `Storage` | `StorageHelper` | Main storage object (localStorage) |
| `Storage.local` | `StorageHelper` | Explicit localStorage access |
| `Storage.session` | `StorageHelper` | SessionStorage access |

### Storage Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `Storage.namespace(name)` | `StorageHelper` | Create namespaced storage |
| `Storage.cleanup()` | `Object` | Remove expired items |
| `Storage.stats()` | `Object` | Get storage statistics |

---

## Detailed Examples

### Basic Usage

```javascript
// Simple key-value storage
Storage.set('username', 'Alice');
Storage.set('age', 30);
Storage.set('isActive', true);

// Retrieve values (types preserved)
console.log(Storage.get('username')); // 'Alice' (string)
console.log(Storage.get('age'));      // 30 (number)
console.log(Storage.get('isActive')); // true (boolean)

// Complex objects
Storage.set('user', {
  name: 'Alice',
  email: 'alice@example.com',
  roles: ['admin', 'user']
});

const user = Storage.get('user');
console.log(user.roles); // ['admin', 'user']

// Default values
const theme = Storage.get('theme', 'light'); // 'light' if not set
```

### Working with Namespaces

```javascript
// Create separate namespaces for different features
const authStorage = Storage.namespace('auth');
const cacheStorage = Storage.namespace('cache');
const settingsStorage = Storage.namespace('settings');

// Each namespace is isolated
authStorage.set('token', 'abc123');
authStorage.set('refreshToken', 'xyz789');
authStorage.set('expiresAt', Date.now() + 3600000);

cacheStorage.set('users', [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]);

settingsStorage.set('theme', 'dark');
settingsStorage.set('language', 'en');

// Access namespace data
console.log(authStorage.get('token')); // 'abc123'
console.log(cacheStorage.get('users')); // [{ id: 1, ... }, ...]

// List keys in namespace
console.log(authStorage.keys()); // ['token', 'refreshToken', 'expiresAt']

// Clear specific namespace
authStorage.clear(); // Only clears 'auth' namespace
console.log(authStorage.keys()); // []
console.log(cacheStorage.keys()); // ['users'] (still exists)
```

### Session vs Local Storage

```javascript
// Persistent data (localStorage)
Storage.local.set('userPreferences', {
  theme: 'dark',
  fontSize: 16,
  notifications: true
});

// Temporary data (sessionStorage)
Storage.session.set('currentPage', 3);
Storage.session.set('filterState', {
  search: 'example',
  sortBy: 'date'
});

// After page reload:
console.log(Storage.local.get('userPreferences')); // Still exists
console.log(Storage.session.get('currentPage'));   // Still exists

// After closing and reopening browser:
console.log(Storage.local.get('userPreferences')); // Still exists ✓
console.log(Storage.session.get('currentPage'));   // null (cleared) ✗
```

### Expiry System

```javascript
// Store with expiry (seconds)
Storage.set('tempToken', 'abc123', { expires: 3600 }); // 1 hour

// Store with Date object
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
Storage.set('dailyData', { date: Date.now() }, { expires: tomorrow });

// Check if expired (automatic)
setTimeout(() => {
  console.log(Storage.get('tempToken')); // null (auto-removed if expired)
}, 3700000);

// Manual cleanup
const cleaned = Storage.cleanup();
console.log(`Removed ${cleaned.local} expired items`);
```

### Statistics and Monitoring

```javascript
// Monitor storage usage
function displayStorageStats() {
  const stats = Storage.stats();
  
  console.group('Storage Statistics');
  console.log('LocalStorage:');
  console.log(`  - Items: ${stats.local.keys}`);
  console.log(`  - Size: ${(stats.local.totalSize / 1024).toFixed(2)} KB`);
  console.log(`  - Avg: ${stats.local.averageSize} bytes/item`);
  
  console.log('SessionStorage:');
  console.log(`  - Items: ${stats.session.keys}`);
  console.log(`  - Size: ${(stats.session.totalSize / 1024).toFixed(2)} KB`);
  console.log(`  - Avg: ${stats.session.averageSize} bytes/item`);
  console.groupEnd();
}

// Display stats every 5 minutes
setInterval(displayStorageStats, 300000);
```

---

## Advanced Usage

### Multiple Namespaces

```javascript
// Create multiple app namespaces
const apps = {
  auth: Storage.namespace('auth'),
  cache: Storage.namespace('cache'),
  ui: Storage.namespace('ui'),
  analytics: Storage.namespace('analytics')
};

// Auth namespace
apps.auth.set('accessToken', 'token123', { expires: 3600 });
apps.auth.set('refreshToken', 'refresh456', { expires: 86400 });

// Cache namespace with expiry
apps.cache.set('apiResponse', { data: [...] }, { expires: 300 });

// UI preferences
apps.ui.set('sidebar', 'expanded');
apps.ui.set('theme', 'dark');

// Analytics data
apps.analytics.set('pageViews', 42);
apps.analytics.set('sessionStart', Date.now());

// Get all namespace stats
Object.entries(apps).forEach(([name, storage]) => {
  const stats = storage.stats();
  console.log(`${name}: ${stats.keys} items, ${stats.totalSize} bytes`);
});
```

### Automatic Cleanup

```javascript
// Setup automatic cleanup on app start
function setupStorageCleanup() {
  // Clean on load
  const initial = Storage.cleanup();
  console.log(`Initial cleanup: ${initial.local} local, ${initial.session} session`);
  
  // Clean periodically (every hour)
  setInterval(() => {
    const result = Storage.cleanup();
    if (result.local > 0 || result.session > 0) {
      console.log(`Cleaned: ${result.local} local, ${result.session} session items`);
    }
  }, 3600000);
  
  // Clean on page unload
  window.addEventListener('beforeunload', () => {
    Storage.cleanup();
  });
}

setupStorageCleanup();
```

### Storage Quotas

```javascript
// Check available storage
function checkStorageQuota() {
  const stats = Storage.stats();
  const maxSize = 5 * 1024 * 1024; // 5MB typical limit
  
  const localUsage = (stats.local.totalSize / maxSize * 100).toFixed(2);
  const sessionUsage = (stats.session.totalSize / maxSize * 100).toFixed(2);
  
  console.log(`LocalStorage: ${localUsage}% used`);
  console.log(`SessionStorage: ${sessionUsage}% used`);
  
  if (localUsage > 80) {
    console.warn('LocalStorage approaching limit! Consider cleanup.');
  }
}

// Monitor quota
checkStorageQuota();
```

---

## Best Practices

### 1. Use Namespaces for Organization

```javascript
// ✅ Good: Organized with namespaces
const userStorage = Storage.namespace('user');
const appStorage = Storage.namespace('app');

userStorage.set('profile', userData);
appStorage.set('config', appConfig);

// ❌ Bad: Everything in global namespace
Storage.set('userProfile', userData);
Storage.set('appConfig', appConfig);
```

### 2. Set Appropriate Expiry Times

```javascript
// ✅ Good: Expiry for temporary data
Storage.set('authToken', token, { expires: 3600 });      // 1 hour
Storage.set('cachedData', data, { expires: 300 });       // 5 minutes
Storage.set('dailyQuote', quote, { expires: 86400 });    // 24 hours

// ❌ Bad: No expiry for temporary data
Storage.set('authToken', token); // Never expires!
```

### 3. Use Session Storage for Temporary Data

```javascript
// ✅ Good: Session storage for temporary state
Storage.session.set('currentTab', activeTab);
Storage.session.set('formDraft', formData);

// ✅ Good: Local storage for persistent preferences
Storage.local.set('userSettings', settings);
```

### 4. Regular Cleanup

```javascript
// ✅ Good: Regular cleanup schedule
setInterval(() => Storage.cleanup(), 3600000);

// ✅ Good: Cleanup on app start
window.addEventListener('load', () => Storage.cleanup());
```

### 5. Monitor Storage Usage

```javascript
// ✅ Good: Monitor and warn
function monitorStorage() {
  const stats = Storage.stats();
  const usage = stats.local.totalSize / (5 * 1024 * 1024);
  
  if (usage > 0.8) {
    console.warn('Storage almost full! Consider cleanup.');
  }
}
```

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| localStorage | ✅ All | ✅ All | ✅ All | ✅ All |
| sessionStorage | ✅ All | ✅ All | ✅ All | ✅ All |
| JSON serialization | ✅ All | ✅ All | ✅ All | ✅ All |
| Expiry system | ✅ All | ✅ All | ✅ All | ✅ All |

**Storage Limits:**
- Desktop: ~5-10MB per origin
- Mobile: ~5MB per origin
- Private/Incognito: May be limited or disabled

---

## Troubleshooting

### Storage Quota Exceeded

```javascript
// Check and handle quota exceeded
try {
  Storage.set('largeData', veryLargeObject);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    console.error('Storage quota exceeded!');
    
    // Cleanup and retry
    Storage.cleanup();
    Storage.set('largeData', veryLargeObject);
  }
}
```

### Accessing Expired Items

```javascript
// Expired items return null
const value = Storage.get('expiredKey'); // null

// Use default values
const value = Storage.get('expiredKey', 'default'); // 'default'
```

### Namespace Not Found

```javascript
// Always create namespace before using
const ns = Storage.namespace('myApp');
ns.set('key', 'value'); // ✅ Correct

// Don't try to access non-existent namespace
Storage.myApp.set('key', 'value'); // ❌ Error!
```

### Private/Incognito Mode

```javascript
// Check if storage is available
function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    Storage.set(test, test);
    Storage.remove(test);
    return true;
  } catch (e) {
    return false;
  }
}

if (!isStorageAvailable()) {
  console.warn('Storage not available (private mode?)');
}
```

---

## Summary

The **Global Storage Access** API provides a powerful, intuitive interface for browser storage with these key methods:

- **`Storage`** - Main storage object (localStorage by default)
- **`Storage.local`** - Explicit localStorage access
- **`Storage.session`** - SessionStorage for temporary data
- **`Storage.namespace(name)`** - Create isolated storage namespaces
- **`Storage.cleanup()`** - Remove expired items automatically
- **`Storage.stats()`** - Monitor storage usage and health

With automatic serialization, expiry management, and namespacing, managing browser storage has never been easier!