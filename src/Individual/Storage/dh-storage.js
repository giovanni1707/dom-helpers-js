/**
 * DOM Helpers - Storage Module
 * Web Storage API utilities that integrate with the main DOM Helpers library
 * 
 * Features:
 * - Storage object for localStorage and sessionStorage
 * - Automatic JSON serialization/deserialization
 * - Expiry system for time-based storage
 * - Namespace support for organized storage
 * - Forms integration for auto-save/restore
 * - Dual API: shorthand (set/get) and vanilla-like (setItem/getItem)
 * - Seamless integration with Elements, Collections, Selector, and Forms
 * 
 * @version 1.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // Check if main DOM Helpers library is loaded
  if (typeof global.Elements === 'undefined' && typeof Elements === 'undefined') {
    console.warn('[DOM Helpers Storage] Main DOM Helpers library should be loaded before the Storage module for full integration');
  }

  /**
   * Storage utility functions
   */
  
  /**
   * Serialize value for storage
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

  /**
   * Storage Helper Class
   */
  class StorageHelper {
    constructor(storageType = 'localStorage', namespace = '') {
      this.storageType = storageType;
      this.namespace = namespace;
      this.storage = global[storageType];
      
      if (!this.storage) {
        console.warn(`[DOM Helpers Storage] ${storageType} is not available`);
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

    /**
     * Set a value in storage
     */
    set(key, value, options = {}) {
      try {
        const fullKey = this._getKey(key);
        const serialized = serializeValue(value, options);
        this.storage.setItem(fullKey, serialized);
        return true;
      } catch (error) {
        console.warn(`[DOM Helpers Storage] Failed to set ${key}:`, error.message);
        return false;
      }
    }

    /**
     * Get a value from storage
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
        console.warn(`[DOM Helpers Storage] Failed to get ${key}:`, error.message);
        return defaultValue;
      }
    }

    /**
     * Remove a value from storage
     */
    remove(key) {
      try {
        const fullKey = this._getKey(key);
        this.storage.removeItem(fullKey);
        return true;
      } catch (error) {
        console.warn(`[DOM Helpers Storage] Failed to remove ${key}:`, error.message);
        return false;
      }
    }

    /**
     * Check if a key exists in storage
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
        console.warn('[DOM Helpers Storage] Failed to get keys:', error.message);
        return [];
      }
    }

    /**
     * Get all values (within namespace if set)
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
        console.warn('[DOM Helpers Storage] Failed to get values:', error.message);
        return [];
      }
    }

    /**
     * Get all entries as key-value pairs
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
        console.warn('[DOM Helpers Storage] Failed to get entries:', error.message);
        return [];
      }
    }

    /**
     * Clear all storage (within namespace if set)
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
        console.warn('[DOM Helpers Storage] Failed to clear storage:', error.message);
        return false;
      }
    }

    /**
     * Get storage size (number of items)
     */
    size() {
      return this.keys().length;
    }

    /**
     * Create a namespaced storage instance
     */
    namespace(name) {
      const namespacedName = this.namespace ? `${this.namespace}:${name}` : name;
      return new StorageHelper(this.storageType, namespacedName);
    }

    /**
     * Vanilla-like aliases
     */
    setItem(key, value, options) {
      return this.set(key, value, options);
    }

    getItem(key, defaultValue) {
      return this.get(key, defaultValue);
    }

    removeItem(key) {
      return this.remove(key);
    }

    /**
     * Bulk operations
     */
    setMultiple(obj, options = {}) {
      const results = {};
      Object.entries(obj).forEach(([key, value]) => {
        results[key] = this.set(key, value, options);
      });
      return results;
    }

    getMultiple(keys, defaultValue = null) {
      const results = {};
      keys.forEach(key => {
        results[key] = this.get(key, defaultValue);
      });
      return results;
    }

    removeMultiple(keys) {
      const results = {};
      keys.forEach(key => {
        results[key] = this.remove(key);
      });
      return results;
    }

    /**
     * Advanced operations
     */
    increment(key, amount = 1) {
      const current = this.get(key, 0);
      const newValue = (typeof current === 'number' ? current : 0) + amount;
      this.set(key, newValue);
      return newValue;
    }

    decrement(key, amount = 1) {
      return this.increment(key, -amount);
    }

    toggle(key) {
      const current = this.get(key, false);
      const newValue = !current;
      this.set(key, newValue);
      return newValue;
    }

    /**
     * Cleanup expired items
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
        console.warn('[DOM Helpers Storage] Failed to cleanup:', error.message);
        return 0;
      }
    }

    /**
     * Get statistics about storage usage
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

  /**
   * Forms Integration
   */
  function addFormsIntegration() {
    // Only add if Forms is available
    if (typeof global.Forms === 'undefined' && typeof Forms === 'undefined') {
      console.log('[DOM Helpers Storage] Forms not available, skipping integration');
      return;
    }

    const FormsObject = global.Forms || Forms;

    // Check if Forms helper exists and has _getForm method
    if (!FormsObject.helper || typeof FormsObject.helper._getForm !== 'function') {
      console.warn('[DOM Helpers Storage] Forms helper not properly initialized, trying alternative approach');
      
      // Alternative approach: Try to enhance forms directly
      if (FormsObject && typeof FormsObject === 'object') {
        // Create a proxy to intercept form access
        const originalProxy = FormsObject;
        
        // Try to wrap the proxy getter
        try {
          const handler = {
            get: function(target, prop) {
              const form = Reflect.get(target, prop);
              if (form && form.tagName && form.tagName.toLowerCase() === 'form') {
                return enhanceFormWithStorageIntegration(form);
              }
              return form;
            }
          };
          
          // This won't work with existing proxy, so let's try a different approach
          console.log('[DOM Helpers Storage] Using direct form enhancement approach');
        } catch (error) {
          console.warn('[DOM Helpers Storage] Could not wrap Forms proxy:', error.message);
        }
      }
      return;
    }

    console.log('[DOM Helpers Storage] Adding Forms integration');

    // Add autoSave method to form objects
    const originalGetForm = FormsObject.helper._getForm.bind(FormsObject.helper);
    FormsObject.helper._getForm = function(prop) {
      const form = originalGetForm(prop);
      return enhanceFormWithStorageIntegration(form);
    };
  }

  /**
   * Enhance a form with storage integration methods
   */
  function enhanceFormWithStorageIntegration(form) {
    if (!form || form._hasStorageIntegration) {
      return form;
    }

    // Add storage integration methods
    form.autoSave = function(storageKey, options = {}) {
      const {
        storage = 'localStorage',
        interval = 1000,
        events = ['input', 'change'],
        namespace = ''
      } = options;

      const storageHelper = namespace ? 
        Storage.namespace(namespace) : 
        (storage === 'sessionStorage' ? Storage.session : Storage);

      // Save current form values
      const saveValues = () => {
        const values = form.values;
        storageHelper.set(storageKey, values, options);
      };

      // Set up auto-save listeners
      events.forEach(eventType => {
        form.addEventListener(eventType, () => {
          clearTimeout(form._autoSaveTimeout);
          form._autoSaveTimeout = setTimeout(saveValues, interval);
        });
      });

      // Initial save
      saveValues();

      // Store reference for cleanup
      form._autoSaveKey = storageKey;
      form._autoSaveStorage = storageHelper;

      return form;
    };

    form.restore = function(storageKey, options = {}) {
      const {
        storage = 'localStorage',
        namespace = '',
        clearAfterRestore = false
      } = options;

      const storageHelper = namespace ? 
        Storage.namespace(namespace) : 
        (storage === 'sessionStorage' ? Storage.session : Storage);

      const savedValues = storageHelper.get(storageKey);
      
      if (savedValues) {
        form.values = savedValues;
        
        if (clearAfterRestore) {
          storageHelper.remove(storageKey);
        }
      }

      return form;
    };

    form.clearAutoSave = function() {
      if (form._autoSaveTimeout) {
        clearTimeout(form._autoSaveTimeout);
      }
      if (form._autoSaveKey && form._autoSaveStorage) {
        form._autoSaveStorage.remove(form._autoSaveKey);
      }
      return form;
    };

    // Mark as having storage integration
    Object.defineProperty(form, '_hasStorageIntegration', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    return form;
  }

  // Create storage instances
  const localStorage = new StorageHelper('localStorage');
  const sessionStorage = new StorageHelper('sessionStorage');

  // Main Storage object with localStorage as default
  const Storage = localStorage;

  // Add session storage
  Storage.session = sessionStorage;

  // Add utility methods to main Storage object
  Storage.local = localStorage;
  Storage.namespace = (name) => localStorage.namespace(name);
  Storage.cleanup = () => {
    const localCleaned = localStorage.cleanup();
    const sessionCleaned = sessionStorage.cleanup();
    return { local: localCleaned, session: sessionCleaned };
  };

  Storage.stats = () => ({
    local: localStorage.stats(),
    session: sessionStorage.stats()
  });

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = { Storage, StorageHelper };
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], function() {
      return { Storage, StorageHelper };
    });
  } else {
    // Browser globals
    global.Storage = Storage;
    global.StorageHelper = StorageHelper;
  }

  // Add Forms integration if available
  if (typeof document !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        addFormsIntegration();
        // Also try to enhance forms directly after a delay
        setTimeout(enhanceExistingForms, 100);
      });
    } else {
      // DOM is already ready
      setTimeout(function() {
        addFormsIntegration();
        enhanceExistingForms();
      }, 0);
    }
  }

  /**
   * Enhance existing forms directly
   */
  function enhanceExistingForms() {
    // Try to enhance forms directly by finding the actual DOM elements
    const forms = document.querySelectorAll('form[id]');
    forms.forEach(form => {
      if (!form._hasStorageIntegration) {
        console.log(`[DOM Helpers Storage] Enhancing DOM form ${form.id} directly`);
        enhanceFormWithStorageIntegration(form);
        
        // Now try to make sure the Forms proxy returns this enhanced form
        if (typeof global.Forms !== 'undefined' || typeof Forms !== 'undefined') {
          const FormsObject = global.Forms || Forms;
          
          // Try to intercept the proxy getter for this specific form
          try {
            // Store a reference to the enhanced form
            if (FormsObject && FormsObject.helper && FormsObject.helper.cache) {
              // Try to update the cache if it exists
              FormsObject.helper.cache.set(form.id, form);
            }
          } catch (error) {
            console.warn(`[DOM Helpers Storage] Could not update Forms cache for ${form.id}:`, error.message);
          }
        }
      }
    });
  }

  // Add Storage to the main DOMHelpers object if it exists
  if (global.DOMHelpers) {
    global.DOMHelpers.Storage = Storage;
    global.DOMHelpers.StorageHelper = StorageHelper;
  }

  console.log('[DOM Helpers Storage] Storage module loaded successfully');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
