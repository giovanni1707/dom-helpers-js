# Storage System - Public Methods

Based on the storage-system modules, here are all available public methods:

## storage.js (Unified Entry Point)

### Storage Object Methods

- `Storage.set(key, value, options)` - Set a value
- `Storage.get(key, defaultValue)` - Get a value
- `Storage.remove(key)` - Remove a value
- `Storage.has(key)` - Check if key exists
- `Storage.keys()` - Get all keys
- `Storage.values()` - Get all values
- `Storage.entries()` - Get all entries
- `Storage.clear()` - Clear all storage
- `Storage.size()` - Get number of items

### Vanilla-like Aliases

- `Storage.setItem(key, value, options)` - Alias for set()
- `Storage.getItem(key, defaultValue)` - Alias for get()
- `Storage.removeItem(key)` - Alias for remove()

### Bulk Operations

- `Storage.setMultiple(obj, options)` - Set multiple values
- `Storage.getMultiple(keys, defaultValue)` - Get multiple values
- `Storage.removeMultiple(keys)` - Remove multiple keys

### Advanced Operations

- `Storage.increment(key, amount)` - Increment numeric value
- `Storage.decrement(key, amount)` - Decrement numeric value
- `Storage.toggle(key)` - Toggle boolean value

### Instances & Utilities

- `Storage.session` - sessionStorage instance
- `Storage.local` - localStorage instance
- `Storage.namespace(name)` - Create namespaced storage
- `Storage.cleanup()` - Clean expired items from both storages
- `Storage.stats()` - Get statistics for both storages

### Module References

- `Storage.core` - StorageCore module
- `Storage.forms` - StorageForms module
- `Storage.StorageHelper` - Class reference
- `Storage.serializeValue` - Serialization utility
- `Storage.deserializeValue` - Deserialization utility
- `Storage.isExpired` - Check if expired utility
- `Storage.enhanceForm` - Form enhancement function

---

## storage-core.js

### Core Functions

- `serializeValue(value, options)` - Serialize value with metadata
- `deserializeValue(serialized)` - Deserialize stored value
- `isExpired(serialized)` - Check if value is expired

### StorageHelper Class

**Constructor:**
```javascript
new StorageHelper(storageType, namespace)
```

**Core Operations:**
- `set(key, value, options)` - Set a value
- `get(key, defaultValue)` - Get a value
- `remove(key)` - Remove a value
- `has(key)` - Check if exists (and not expired)
- `keys()` - Get all keys in namespace
- `values()` - Get all values
- `entries()` - Get all [key, value] pairs
- `clear()` - Clear storage (namespace-aware)
- `size()` - Get number of items

**Namespace Support:**
- `namespace(name)` - Create namespaced instance

**Vanilla-like Aliases:**
- `setItem(key, value, options)` - Alias for set()
- `getItem(key, defaultValue)` - Alias for get()
- `removeItem(key)` - Alias for remove()

**Bulk Operations:**
- `setMultiple(obj, options)` - Set multiple key-value pairs
- `getMultiple(keys, defaultValue)` - Get multiple values
- `removeMultiple(keys)` - Remove multiple keys

**Advanced Operations:**
- `increment(key, amount)` - Increment numeric value
- `decrement(key, amount)` - Decrement numeric value
- `toggle(key)` - Toggle boolean value

**Maintenance:**
- `cleanup()` - Remove expired items
- `stats()` - Get storage statistics

### Set Options

```javascript
{
  expires: 3600           // Seconds until expiry
  // or
  expires: new Date()     // Date object for expiry
}
```

---

## storage-forms.js

### Form Enhancement

- `enhanceFormWithStorage(form)` - Add storage methods to form
- `addFormsIntegration()` - Hook into Forms helper
- `enhanceExistingForms()` - Enhance all forms with IDs

### Enhanced Form Methods (auto-added)

**Auto-Save:**
```javascript
form.autoSave(storageKey, options)
```

**Restore:**
```javascript
form.restore(storageKey, options)
```

**Clear:**
```javascript
form.clearAutoSave()
```

### Auto-Save Options

```javascript
{
  storage: 'localStorage',    // or 'sessionStorage'
  interval: 1000,             // Debounce delay in ms
  events: ['input', 'change'], // Events to listen to
  namespace: '',              // Storage namespace
  expires: null               // Expiry in seconds
}
```

### Restore Options

```javascript
{
  storage: 'localStorage',    // or 'sessionStorage'
  namespace: '',              // Storage namespace
  clearAfterRestore: false    // Remove after restore
}
```

---

## Complete API Surface

### Global Access

```javascript
// Main API (defaults to localStorage)
Storage.set(key, value, options)
Storage.get(key, defaultValue)

// Session storage
Storage.session.set(key, value, options)
Storage.session.get(key, defaultValue)

// Namespaced storage
const userStorage = Storage.namespace('user')
userStorage.set(key, value)

// Forms integration (if Forms loaded)
Forms.myForm.autoSave('formData')
Forms.myForm.restore('formData')
Forms.myForm.clearAutoSave()
```

### Direct Class Usage

```javascript
// Create custom instance
const storage = new StorageHelper('localStorage', 'namespace')
storage.set(key, value, options)
storage.get(key, defaultValue)

// Create nested namespace
const nested = storage.namespace('preferences')
nested.set('theme', 'dark')
```

### Utility Functions

```javascript
// Serialization
const serialized = Storage.serializeValue(value, { expires: 3600 })
const deserialized = Storage.deserializeValue(serialized)
const expired = Storage.isExpired(serialized)

// Maintenance
const cleaned = Storage.cleanup() // { local: 5, session: 2 }
const stats = Storage.stats()     // { local: {...}, session: {...} }
```

---

## Statistics Object Structure

```javascript
{
  keys: 15,                    // Number of keys
  totalSize: 2048,             // Total bytes
  averageSize: 136,            // Average bytes per key
  namespace: 'global',         // Namespace name
  storageType: 'localStorage'  // Storage type
}
```