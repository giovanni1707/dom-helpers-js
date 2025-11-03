# DOM Helpers Storage Library - Complete Method Reference

Based on the `dom-helpers-storage.js` library, here's a comprehensive list of all available methods:

## **Storage API (Main Interface)**

### Global Storage Access
1. **`Storage`** - Main storage object (defaults to localStorage)
2. **`Storage.local`** - Access localStorage explicitly
3. **`Storage.session`** - Access sessionStorage
4. **`Storage.namespace(name)`** - Create namespaced storage instance
5. **`Storage.cleanup()`** - Cleanup expired items from both storages
6. **`Storage.stats()`** - Get statistics for both storages

---

## **StorageHelper Class Methods**

### Basic Operations (Shorthand API)
7. **`storage.set(key, value, options)`** - Set a value in storage
8. **`storage.get(key, defaultValue)`** - Get a value from storage
9. **`storage.remove(key)`** - Remove a value from storage
10. **`storage.has(key)`** - Check if a key exists in storage
11. **`storage.clear()`** - Clear all storage (respects namespace)

### Vanilla-like API (Aliases)
12. **`storage.setItem(key, value, options)`** - Alias for set()
13. **`storage.getItem(key, defaultValue)`** - Alias for get()
14. **`storage.removeItem(key)`** - Alias for remove()

### Iteration & Inspection
15. **`storage.keys()`** - Get all keys (within namespace if set)
16. **`storage.values()`** - Get all values (within namespace if set)
17. **`storage.entries()`** - Get all entries as key-value pairs
18. **`storage.size()`** - Get number of items in storage

### Namespacing
19. **`storage.namespace(name)`** - Create a new namespaced storage instance

### Bulk Operations
20. **`storage.setMultiple(obj, options)`** - Set multiple key-value pairs
21. **`storage.getMultiple(keys, defaultValue)`** - Get multiple values by keys
22. **`storage.removeMultiple(keys)`** - Remove multiple keys

### Advanced Operations
23. **`storage.increment(key, amount)`** - Increment a numeric value (default: +1)
24. **`storage.decrement(key, amount)`** - Decrement a numeric value (default: -1)
25. **`storage.toggle(key)`** - Toggle a boolean value

### Maintenance
26. **`storage.cleanup()`** - Remove expired items
27. **`storage.stats()`** - Get storage statistics

### Internal Methods (Private)
28. **`storage._getKey(key)`** - Get full key with namespace prefix
29. **`storage._stripNamespace(key)`** - Remove namespace from key

---

## **Enhanced Form Methods**

When a form is enhanced with storage integration:

### Form Storage Methods
30. **`form.autoSave(storageKey, options)`** - Enable auto-save for form
31. **`form.restore(storageKey, options)`** - Restore form values from storage
32. **`form.clearAutoSave()`** - Clear auto-save timeout and stored data

### Form Properties
33. **`form._autoSaveTimeout`** - Internal timeout ID for auto-save
34. **`form._autoSaveKey`** - Internal storage key for auto-save
35. **`form._autoSaveStorage`** - Internal storage instance for auto-save
36. **`form._hasStorageIntegration`** - Flag indicating storage enhancement

---

## **Set Options Properties**

When using `set()` or `setItem()`, these options are available:

37. **`expires`** - Expiry time (number in seconds or Date object)

---

## **AutoSave Options Properties**

When using `form.autoSave(storageKey, options)`:

38. **`storage`** - Storage type ('localStorage' or 'sessionStorage', default: 'localStorage')
39. **`interval`** - Debounce interval in ms (default: 1000)
40. **`events`** - Array of events to listen to (default: ['input', 'change'])
41. **`namespace`** - Namespace for storage
42. **`expires`** - Expiry time (from set options)

---

## **Restore Options Properties**

When using `form.restore(storageKey, options)`:

43. **`storage`** - Storage type (default: 'localStorage')
44. **`namespace`** - Namespace for storage
45. **`clearAfterRestore`** - Clear storage after restoring (default: false)

---

## **Statistics Object Properties**

The `stats()` method returns an object with:

46. **`keys`** - Number of keys in storage
47. **`totalSize`** - Total size in bytes
48. **`averageSize`** - Average size per item
49. **`namespace`** - Current namespace ('global' if none)
50. **`storageType`** - Storage type ('localStorage' or 'sessionStorage')

---

## **Combined Stats Object**

When using `Storage.stats()`, returns:

51. **`local`** - Statistics for localStorage
52. **`session`** - Statistics for sessionStorage

---

## **Cleanup Result Object**

When using `Storage.cleanup()`, returns:

53. **`local`** - Number of items cleaned from localStorage
54. **`session`** - Number of items cleaned from sessionStorage

---

## **Utility Functions** (Internal)

### Serialization
55. **`serializeValue(value, options)`** - Serialize value for storage
56. **`deserializeValue(serialized)`** - Deserialize value from storage
57. **`isExpired(serialized)`** - Check if stored value is expired

### Form Integration
58. **`addFormsIntegration()`** - Add Forms module integration
59. **`enhanceFormWithStorageIntegration(form)`** - Enhance form with storage methods
60. **`enhanceExistingForms()`** - Enhance all existing forms in DOM

---

## **StorageHelper Constructor**

61. **`new StorageHelper(storageType, namespace)`** - Create new storage helper instance

---

## **Storage Types**

62. **`'localStorage'`** - Persistent storage (survives browser restart)
63. **`'sessionStorage'`** - Session storage (cleared when tab closes)

---

## **Serialized Data Structure**

Internal data structure stored in storage:

64. **`value`** - The actual stored value
65. **`type`** - Type of the stored value
66. **`timestamp`** - Timestamp when value was stored
67. **`expires`** - Expiry timestamp (optional)

---

## **Usage Examples by Method Type**

### Basic Storage Operations
```javascript
Storage.set('username', 'John');
Storage.get('username');
Storage.remove('username');
Storage.has('username');
Storage.clear();
```

### Expiry System
```javascript
Storage.set('token', 'abc123', { expires: 3600 }); // Expires in 1 hour
```

### Namespacing
```javascript
const userStorage = Storage.namespace('user');
userStorage.set('profile', { name: 'John' });
```

### Bulk Operations
```javascript
Storage.setMultiple({ key1: 'value1', key2: 'value2' });
Storage.getMultiple(['key1', 'key2']);
Storage.removeMultiple(['key1', 'key2']);
```

### Advanced Operations
```javascript
Storage.increment('counter', 5);
Storage.decrement('counter', 2);
Storage.toggle('isDarkMode');
```

### Form Integration
```javascript
Forms.myForm.autoSave('formData', {
  interval: 2000,
  events: ['input', 'change'],
  expires: 86400 // 24 hours
});

Forms.myForm.restore('formData');
Forms.myForm.clearAutoSave();
```

### Iteration
```javascript
Storage.keys();        // ['key1', 'key2', 'key3']
Storage.values();      // ['value1', 'value2', 'value3']
Storage.entries();     // [['key1', 'value1'], ['key2', 'value2']]
Storage.size();        // 3
```

### Maintenance
```javascript
Storage.cleanup();     // Remove expired items
Storage.stats();       // Get storage statistics
```

---

## **Total Count: 67 Methods/Properties/Features**

- **6 Global Storage API methods**
- **23 StorageHelper public methods**
- **2 StorageHelper private methods**
- **6 Enhanced form methods/properties**
- **1 Set option**
- **5 AutoSave options**
- **3 Restore options**
- **5 Statistics properties**
- **2 Combined stats properties**
- **2 Cleanup result properties**
- **3 Utility functions**
- **1 Constructor**
- **2 Storage types**
- **4 Serialized data structure properties**
- **2 Special features** (expiry system, automatic cleanup)

The library provides comprehensive storage capabilities with:
- **Dual API**: Shorthand (set/get) and vanilla-like (setItem/getItem)
- **Automatic serialization**: JSON serialization/deserialization
- **Expiry system**: Time-based storage with automatic cleanup
- **Namespace support**: Organized storage with isolated namespaces
- **Forms integration**: Auto-save and restore form values
- **Bulk operations**: Efficient multi-key operations
- **Advanced utilities**: Increment, decrement, toggle operations
- **Statistics**: Storage usage insights