# Internal Methods (Private)

Documentation for private helper methods in the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Methods Reference](#methods-reference)
   - [_getKey()](#_getkey)
   - [_stripNamespace()](#_stripnamespace)
3. [How They Work](#how-they-work)
4. [Examples](#examples)
5. [Understanding the Implementation](#understanding-the-implementation)

---

## Overview

Internal methods are private helper functions used internally by the Storage module to manage namespacing. They handle the conversion between user-facing keys and the actual keys stored in localStorage/sessionStorage.

**⚠️ Important:** These methods are prefixed with an underscore (`_`) to indicate they are **private** and intended for internal use only. You typically should not call these methods directly in your application code.

**Purpose:**
- 🔧 **Internal use only** - Used by the Storage module internally
- 🏷️ **Key transformation** - Convert between namespaced and non-namespaced keys
- 📦 **Namespace management** - Handle the namespace prefix logic
- 🔒 **Encapsulation** - Keep implementation details separate from public API

---

## Methods Reference

### _getKey()

Get the full storage key with namespace prefix.

#### Syntax

```javascript
storage._getKey(key)
```

#### Parameters

- **`key`** (string, required): The user-provided key name

#### Returns

**`string`** - The full key with namespace prefix (if namespace exists)

#### Behavior

- If namespace exists: Returns `"namespace:key"`
- If no namespace: Returns `"key"` unchanged
- Always returns a string

#### Example

```javascript
// Without namespace
const storage = Storage;
storage._getKey('theme');
// Returns: 'theme'

// With namespace
const userStorage = Storage.namespace('user');
userStorage._getKey('name');
// Returns: 'user:name'

// With nested namespace
const userProfile = Storage.namespace('user').namespace('profile');
userProfile._getKey('avatar');
// Returns: 'user:profile:avatar'
```

---

### _stripNamespace()

Remove the namespace prefix from a storage key.

#### Syntax

```javascript
storage._stripNamespace(key)
```

#### Parameters

- **`key`** (string, required): The full storage key (possibly with namespace)

#### Returns

**`string`** - The key without namespace prefix

#### Behavior

- If key has namespace prefix: Returns key without prefix
- If key has no prefix: Returns key unchanged
- Removes only the current namespace prefix
- Handles nested namespaces correctly

#### Example

```javascript
// Without namespace
const storage = Storage;
storage._stripNamespace('theme');
// Returns: 'theme'

// With namespace
const userStorage = Storage.namespace('user');
userStorage._stripNamespace('user:name');
// Returns: 'name'

// With nested namespace
const userProfile = Storage.namespace('user').namespace('profile');
userProfile._stripNamespace('user:profile:avatar');
// Returns: 'avatar'

// Key without matching namespace
userStorage._stripNamespace('app:setting');
// Returns: 'app:setting' (doesn't match 'user:' prefix)
```

---

## How They Work

### Key Transformation Flow

```javascript
// User calls public method
const userStorage = Storage.namespace('user');
userStorage.set('name', 'John');

// Internally, the flow is:
// 1. User provides: 'name'
// 2. _getKey() transforms: 'name' → 'user:name'
// 3. Stores in localStorage: 'user:name' = 'John'

// When retrieving:
userStorage.get('name');

// Internally:
// 1. User provides: 'name'
// 2. _getKey() transforms: 'name' → 'user:name'
// 3. Retrieves from localStorage: 'user:name'
// 4. Returns value: 'John'

// When listing keys:
userStorage.keys();

// Internally:
// 1. Gets all localStorage keys
// 2. Filters keys starting with 'user:'
// 3. _stripNamespace() transforms: 'user:name' → 'name'
// 4. Returns: ['name']
```

### Visual Representation

```
User Input          Internal Key           Storage
─────────────────────────────────────────────────────
'theme'         →   'theme'            →   'theme' = 'dark'
                    (no namespace)

'user:theme'    →   'user:theme'       →   'user:theme' = 'light'
(with namespace)    (_getKey adds prefix)

'user:theme'    ←   'theme'            ←   Storage retrieval
(displayed)         (_stripNamespace 
                     removes prefix)
```

---

## Examples

### Example 1: How set() Uses _getKey()

```javascript
// Simplified internal implementation
class StorageHelper {
  set(key, value, options = {}) {
    // Transform key with namespace
    const fullKey = this._getKey(key);
    // 'theme' becomes 'user:theme' if namespace is 'user'
    
    const serialized = serializeValue(value, options);
    
    // Store with full key
    this.storage.setItem(fullKey, serialized);
    // localStorage['user:theme'] = serialized value
    
    return true;
  }
  
  _getKey(key) {
    return this.namespace ? `${this.namespace}:${key}` : key;
  }
}

// Usage
const userStorage = Storage.namespace('user');
userStorage.set('theme', 'dark');

// Actual storage:
// localStorage['user:theme'] = '{"value":"dark","type":"string","timestamp":...}'
```

### Example 2: How get() Uses _getKey()

```javascript
// Simplified internal implementation
class StorageHelper {
  get(key, defaultValue = null) {
    // Transform key with namespace
    const fullKey = this._getKey(key);
    // 'theme' becomes 'user:theme'
    
    // Retrieve using full key
    const serialized = this.storage.getItem(fullKey);
    // Gets localStorage['user:theme']
    
    if (serialized === null) {
      return defaultValue;
    }
    
    return deserializeValue(serialized);
  }
  
  _getKey(key) {
    return this.namespace ? `${this.namespace}:${key}` : key;
  }
}

// Usage
const userStorage = Storage.namespace('user');
const theme = userStorage.get('theme');
// Internally looks for 'user:theme' in localStorage
```

### Example 3: How keys() Uses _stripNamespace()

```javascript
// Simplified internal implementation
class StorageHelper {
  keys() {
    const keys = [];
    const prefix = this.namespace ? `${this.namespace}:` : '';
    
    // Iterate through all storage keys
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      
      // Only include keys with matching namespace
      if (key && (!this.namespace || key.startsWith(prefix))) {
        // Remove namespace prefix before returning
        keys.push(this._stripNamespace(key));
        // 'user:theme' becomes 'theme'
      }
    }
    
    return keys;
  }
  
  _stripNamespace(key) {
    if (!this.namespace) return key;
    
    const prefix = `${this.namespace}:`;
    return key.startsWith(prefix) ? key.slice(prefix.length) : key;
  }
}

// Usage
const userStorage = Storage.namespace('user');

// Storage contains:
// 'user:theme' = 'dark'
// 'user:name' = 'John'
// 'app:version' = '1.0'

userStorage.keys();
// Returns: ['theme', 'name']
// (app:version is excluded, namespace is stripped)
```

### Example 4: Nested Namespace Handling

```javascript
// Create nested namespace
const userProfile = Storage.namespace('user').namespace('profile');

// _getKey() with nested namespace
userProfile._getKey('avatar');
// Returns: 'user:profile:avatar'

// Storage structure:
userProfile.set('avatar', 'photo.jpg');
// Stored as: localStorage['user:profile:avatar'] = ...

// _stripNamespace() with nested namespace
userProfile._stripNamespace('user:profile:avatar');
// Returns: 'avatar'

// Getting keys works correctly
userProfile.keys();
// Looks for keys starting with 'user:profile:'
// Strips 'user:profile:' prefix from results
// Returns: ['avatar']
```

### Example 5: Edge Cases

```javascript
const userStorage = Storage.namespace('user');

// Edge case 1: Key already contains namespace-like pattern
userStorage._getKey('other:key');
// Returns: 'user:other:key'
// (Adds namespace even if key contains colons)

userStorage._stripNamespace('user:other:key');
// Returns: 'other:key'
// (Only removes the namespace prefix)

// Edge case 2: Empty key
userStorage._getKey('');
// Returns: 'user:'

// Edge case 3: Key that doesn't match namespace
userStorage._stripNamespace('app:setting');
// Returns: 'app:setting'
// (No change - doesn't start with 'user:')

// Edge case 4: Global storage (no namespace)
Storage._getKey('theme');
// Returns: 'theme'
// (No transformation)

Storage._stripNamespace('theme');
// Returns: 'theme'
// (No transformation)
```

---

## Understanding the Implementation

### Actual Source Code

From the Storage module source:

```javascript
/**
 * Get the full key with namespace
 */
_getKey(key) {
  return this.namespace ? `${this.namespace}:${key}` : key;
}

/**
 * Remove namespace from key
 */
_stripNamespace(key) {
  if (!this.namespace) return key;
  const prefix = `${this.namespace}:`;
  return key.startsWith(prefix) ? key.slice(prefix.length) : key;
}
```

### Why These Methods Are Needed

**1. Abstraction**
```javascript
// Without these methods, every public method would need:
set(key, value) {
  const fullKey = this.namespace ? `${this.namespace}:${key}` : key;
  // ... rest of code
}

get(key) {
  const fullKey = this.namespace ? `${this.namespace}:${key}` : key;
  // ... rest of code
}

// Repetitive and error-prone!

// With these methods:
set(key, value) {
  const fullKey = this._getKey(key); // Clean and DRY
  // ... rest of code
}
```

**2. Consistency**
```javascript
// Ensures all methods handle namespacing the same way
set(key, value) {
  const fullKey = this._getKey(key);
  // ...
}

get(key) {
  const fullKey = this._getKey(key);
  // ...
}

remove(key) {
  const fullKey = this._getKey(key);
  // ...
}

// One place to modify if namespace logic changes
```

**3. Maintainability**
```javascript
// If we need to change the namespace separator:
_getKey(key) {
  // Change from ':' to '.' or '/' in one place
  return this.namespace ? `${this.namespace}.${key}` : key;
}

// All methods automatically use the new format
```

---

## Summary

**Quick Reference:**

| Method | Purpose | Example Input | Example Output |
|--------|---------|---------------|----------------|
| `_getKey(key)` | Add namespace prefix | `'theme'` | `'user:theme'` |
| `_stripNamespace(key)` | Remove namespace prefix | `'user:theme'` | `'theme'` |

**Key Points:**

⚠️ **Private methods** - Not for external use  
🔧 **Internal helpers** - Used by Storage module internally  
🏷️ **Key transformation** - Handle namespace prefixes  
🔄 **Bidirectional** - Convert keys both ways  
📦 **Encapsulation** - Keep implementation details hidden  

**What They Do:**

```javascript
// _getKey(): User key → Storage key
'theme' → 'user:theme'

// _stripNamespace(): Storage key → User key  
'user:theme' → 'theme'
```

**Why They Exist:**

1. **DRY principle** - Don't repeat namespace logic
2. **Consistency** - Same behavior across all methods
3. **Maintainability** - Change logic in one place
4. **Abstraction** - Hide implementation details

**Remember:**

- These are **private methods** (indicated by `_` prefix)
- Used internally by the Storage module
- You **don't need to call them** in your code
- They handle namespace transformations automatically
- All public methods use these internally

The Storage module handles all the namespace complexity for you - just use the public API!