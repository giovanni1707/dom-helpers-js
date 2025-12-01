/**
 * DOM Helpers - Storage Core Module
 *
 * Web Storage API wrapper with automatic serialization, expiry system,
 * and namespace support.
 *
 * Features:
 * - Automatic JSON serialization/deserialization
 * - Expiry system for time-based storage
 * - Namespace support for organized storage
 * - Dual API: shorthand (set/get) and vanilla-like (setItem/getItem)
 * - Bulk operations (setMultiple, getMultiple, removeMultiple)
 * - Advanced operations (increment, decrement, toggle)
 * - Cleanup expired items
 * - Statistics tracking
 *
 * @version 2.0.0
 * @license MIT
 */

(function (global, factory) {
  'use strict';

  // UMD pattern for universal module support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    global.DOMHelpersStorageCore = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // SERIALIZATION UTILITIES
  // ============================================================================

  /**
   * Serialize value for storage with metadata
   * Adds timestamp and optional expiry
   *
   * @param {*} value - Value to serialize
   * @param {Object} options - Options (expires)
   * @returns {string} Serialized JSON string
   */
  function serializeValue(value, options = {}) {
    const data = {
      value: value,
      type: typeof value,
      timestamp: Date.now()
    };

    // Add expiry if specified
    if (options.expires) {
      if (typeof options.expires === 'number') {
        // Expires is in seconds
        data.expires = Date.now() + (options.expires * 1000);
      } else if (options.expires instanceof Date) {
        data.expires = options.expires.getTime();
      }
    }

    return JSON.stringify(data);
  }

  /**
   * Deserialize value from storage
   * Returns null if expired or invalid
   *
   * @param {string} serialized - Serialized JSON string
   * @returns {*} Deserialized value or null
   */
  function deserializeValue(serialized) {
    if (!serialized) return null;

    try {
      const data = JSON.parse(serialized);

      // Check if expired
      if (data.expires && Date.now() > data.expires) {
        return null; // Expired
      }

      return data.value;
    } catch (error) {
      // Fallback for non-JSON values (legacy support)
      return serialized;
    }
  }

  /**
   * Check if a stored value is expired
   *
   * @param {string} serialized - Serialized JSON string
   * @returns {boolean} True if expired
   */
  function isExpired(serialized) {
    if (!serialized) return true;

    try {
      const data = JSON.parse(serialized);
      return data.expires && Date.now() > data.expires;
    } catch (error) {
      return false; // Non-JSON values don't expire
    }
  }

  // ============================================================================
  // STORAGE HELPER CLASS
  // ============================================================================

  /**
   * StorageHelper - Wrapper for Web Storage API
   * Provides namespace support, serialization, and expiry
   */
  class StorageHelper {
    /**
     * Create a storage helper instance
     *
     * @param {string} storageType - 'localStorage' or 'sessionStorage'
     * @param {string} namespace - Optional namespace prefix
     */
    constructor(storageType = 'localStorage', namespace = '') {
      this.storageType = storageType;
      this.namespace = namespace;

      // Try to get the storage object
      const globalObj = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};
      this.storage = globalObj[storageType];

      if (!this.storage) {
        console.warn(`[Storage Core] ${storageType} is not available`);
        // Fallback to in-memory storage
        this.storage = {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
          key: () => null,
          length: 0
        };
      }
    }

    /**
     * Get the full key with namespace
     *
     * @param {string} key - Key name
     * @returns {string} Namespaced key
     */
    _getKey(key) {
      return this.namespace ? `${this.namespace}:${key}` : key;
    }

    /**
     * Remove namespace from key
     *
     * @param {string} key - Namespaced key
     * @returns {string} Key without namespace
     */
    _stripNamespace(key) {
      if (!this.namespace) return key;
      const prefix = `${this.namespace}:`;
      return key.startsWith(prefix) ? key.slice(prefix.length) : key;
    }

    // ========================================================================
    // CORE OPERATIONS
    // ========================================================================

    /**
     * Set a value in storage
     *
     * @param {string} key - Key name
     * @param {*} value - Value to store
     * @param {Object} options - Options (expires)
     * @returns {boolean} Success status
     */
    set(key, value, options = {}) {
      try {
        const fullKey = this._getKey(key);
        const serialized = serializeValue(value, options);
        this.storage.setItem(fullKey, serialized);
        return true;
      } catch (error) {
        console.warn(`[Storage Core] Failed to set ${key}:`, error.message);
        return false;
      }
    }

    /**
     * Get a value from storage
     *
     * @param {string} key - Key name
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored value or default
     */
    get(key, defaultValue = null) {
      try {
        const fullKey = this._getKey(key);
        const serialized = this.storage.getItem(fullKey);

        if (serialized === null) {
          return defaultValue;
        }

        // Check if expired and remove if so
        if (isExpired(serialized)) {
          this.storage.removeItem(fullKey);
          return defaultValue;
        }

        const value = deserializeValue(serialized);
        return value !== null ? value : defaultValue;
      } catch (error) {
        console.warn(`[Storage Core] Failed to get ${key}:`, error.message);
        return defaultValue;
      }
    }

    /**
     * Remove a value from storage
     *
     * @param {string} key - Key name
     * @returns {boolean} Success status
     */
    remove(key) {
      try {
        const fullKey = this._getKey(key);
        this.storage.removeItem(fullKey);
        return true;
      } catch (error) {
        console.warn(`[Storage Core] Failed to remove ${key}:`, error.message);
        return false;
      }
    }

    /**
     * Check if a key exists in storage
     *
     * @param {string} key - Key name
     * @returns {boolean} True if exists and not expired
     */
    has(key) {
      try {
        const fullKey = this._getKey(key);
        const serialized = this.storage.getItem(fullKey);

        if (serialized === null) {
          return false;
        }

        // Check if expired
        if (isExpired(serialized)) {
          this.storage.removeItem(fullKey);
          return false;
        }

        return true;
      } catch (error) {
        return false;
      }
    }

    /**
     * Get all keys (within namespace if set)
     *
     * @returns {Array<string>} Array of keys
     */
    keys() {
      try {
        const keys = [];
        const prefix = this.namespace ? `${this.namespace}:` : '';

        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (key && (!this.namespace || key.startsWith(prefix))) {
            // Check if expired and remove if so
            if (isExpired(this.storage.getItem(key))) {
              this.storage.removeItem(key);
              continue;
            }
            keys.push(this._stripNamespace(key));
          }
        }

        return keys;
      } catch (error) {
        console.warn('[Storage Core] Failed to get keys:', error.message);
        return [];
      }
    }

    /**
     * Get all values (within namespace if set)
     *
     * @returns {Array} Array of values
     */
    values() {
      try {
        const values = [];
        const keys = this.keys();

        keys.forEach(key => {
          const value = this.get(key);
          if (value !== null) {
            values.push(value);
          }
        });

        return values;
      } catch (error) {
        console.warn('[Storage Core] Failed to get values:', error.message);
        return [];
      }
    }

    /**
     * Get all entries as key-value pairs
     *
     * @returns {Array<Array>} Array of [key, value] pairs
     */
    entries() {
      try {
        const entries = [];
        const keys = this.keys();

        keys.forEach(key => {
          const value = this.get(key);
          if (value !== null) {
            entries.push([key, value]);
          }
        });

        return entries;
      } catch (error) {
        console.warn('[Storage Core] Failed to get entries:', error.message);
        return [];
      }
    }

    /**
     * Clear all storage (within namespace if set)
     *
     * @returns {boolean} Success status
     */
    clear() {
      try {
        if (this.namespace) {
          // Clear only namespaced keys
          const keys = this.keys();
          keys.forEach(key => this.remove(key));
        } else {
          // Clear all storage
          this.storage.clear();
        }
        return true;
      } catch (error) {
        console.warn('[Storage Core] Failed to clear storage:', error.message);
        return false;
      }
    }

    /**
     * Get storage size (number of items)
     *
     * @returns {number} Number of items
     */
    size() {
      return this.keys().length;
    }

    // ========================================================================
    // NAMESPACE SUPPORT
    // ========================================================================

    /**
     * Create a namespaced storage instance
     *
     * @param {string} name - Namespace name
     * @returns {StorageHelper} Namespaced storage instance
     */
    namespace(name) {
      const namespacedName = this.namespace ? `${this.namespace}:${name}` : name;
      return new StorageHelper(this.storageType, namespacedName);
    }

    // ========================================================================
    // VANILLA-LIKE ALIASES
    // ========================================================================

    /**
     * Alias for set() - vanilla-like API
     */
    setItem(key, value, options) {
      return this.set(key, value, options);
    }

    /**
     * Alias for get() - vanilla-like API
     */
    getItem(key, defaultValue) {
      return this.get(key, defaultValue);
    }

    /**
     * Alias for remove() - vanilla-like API
     */
    removeItem(key) {
      return this.remove(key);
    }

    // ========================================================================
    // BULK OPERATIONS
    // ========================================================================

    /**
     * Set multiple key-value pairs
     *
     * @param {Object} obj - Object with key-value pairs
     * @param {Object} options - Options applied to all
     * @returns {Object} Results for each key
     */
    setMultiple(obj, options = {}) {
      const results = {};
      Object.entries(obj).forEach(([key, value]) => {
        results[key] = this.set(key, value, options);
      });
      return results;
    }

    /**
     * Get multiple values by keys
     *
     * @param {Array<string>} keys - Array of keys
     * @param {*} defaultValue - Default value for missing keys
     * @returns {Object} Object with key-value pairs
     */
    getMultiple(keys, defaultValue = null) {
      const results = {};
      keys.forEach(key => {
        results[key] = this.get(key, defaultValue);
      });
      return results;
    }

    /**
     * Remove multiple keys
     *
     * @param {Array<string>} keys - Array of keys
     * @returns {Object} Results for each key
     */
    removeMultiple(keys) {
      const results = {};
      keys.forEach(key => {
        results[key] = this.remove(key);
      });
      return results;
    }

    // ========================================================================
    // ADVANCED OPERATIONS
    // ========================================================================

    /**
     * Increment a numeric value
     *
     * @param {string} key - Key name
     * @param {number} amount - Amount to increment
     * @returns {number} New value
     */
    increment(key, amount = 1) {
      const current = this.get(key, 0);
      const newValue = (typeof current === 'number' ? current : 0) + amount;
      this.set(key, newValue);
      return newValue;
    }

    /**
     * Decrement a numeric value
     *
     * @param {string} key - Key name
     * @param {number} amount - Amount to decrement
     * @returns {number} New value
     */
    decrement(key, amount = 1) {
      return this.increment(key, -amount);
    }

    /**
     * Toggle a boolean value
     *
     * @param {string} key - Key name
     * @returns {boolean} New value
     */
    toggle(key) {
      const current = this.get(key, false);
      const newValue = !current;
      this.set(key, newValue);
      return newValue;
    }

    // ========================================================================
    // MAINTENANCE
    // ========================================================================

    /**
     * Cleanup expired items
     *
     * @returns {number} Number of items cleaned
     */
    cleanup() {
      try {
        let cleaned = 0;
        const prefix = this.namespace ? `${this.namespace}:` : '';

        for (let i = this.storage.length - 1; i >= 0; i--) {
          const key = this.storage.key(i);
          if (key && (!this.namespace || key.startsWith(prefix))) {
            if (isExpired(this.storage.getItem(key))) {
              this.storage.removeItem(key);
              cleaned++;
            }
          }
        }

        return cleaned;
      } catch (error) {
        console.warn('[Storage Core] Failed to cleanup:', error.message);
        return 0;
      }
    }

    /**
     * Get statistics about storage usage
     *
     * @returns {Object} Statistics object
     */
    stats() {
      try {
        const keys = this.keys();
        const values = this.values();
        const totalSize = JSON.stringify(values).length;

        return {
          keys: keys.length,
          totalSize: totalSize,
          averageSize: keys.length > 0 ? Math.round(totalSize / keys.length) : 0,
          namespace: this.namespace || 'global',
          storageType: this.storageType
        };
      } catch (error) {
        return {
          keys: 0,
          totalSize: 0,
          averageSize: 0,
          namespace: this.namespace || 'global',
          storageType: this.storageType
        };
      }
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const StorageCore = {
    // Class
    StorageHelper,

    // Utility functions
    serializeValue,
    deserializeValue,
    isExpired,

    // Version
    version: '2.0.0'
  };

  // ============================================================================
  // GLOBAL EXPORT
  // ============================================================================

  // Export to global namespace
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    // Create Storage namespace if it doesn't exist
    if (!globalObj.Storage) {
      globalObj.Storage = {};
    }

    // Attach core
    globalObj.Storage.core = StorageCore;
    globalObj.StorageHelper = StorageHelper;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Storage Core] v2.0.0 initialized');
  }

  return StorageCore;
});
