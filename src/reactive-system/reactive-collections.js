/**
 * DOM Helpers - Reactive Collections
 *
 * Full-featured reactive collections with array management methods
 * Provides 30+ methods for managing reactive arrays
 *
 * @version 2.3.1
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
    global.DOMHelpersReactiveCollections = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCY DETECTION
  // ============================================================================

  let ReactiveCore;

  // Try to load reactive-core module
  if (typeof require !== 'undefined') {
    try {
      ReactiveCore = require('./reactive-core.js');
    } catch (e) {
      // Module not available via require
    }
  }

  // Check for global ReactiveUtils (legacy) or DOMHelpersReactiveCore
  if (!ReactiveCore) {
    if (typeof DOMHelpersReactiveCore !== 'undefined') {
      ReactiveCore = DOMHelpersReactiveCore;
    } else if (typeof ReactiveUtils !== 'undefined') {
      ReactiveCore = ReactiveUtils;
    }
  }

  // Exit if reactive core not found
  if (!ReactiveCore || !ReactiveCore.state) {
    console.error('[Reactive Collections] Reactive core not found. Load reactive-core.js first.');
    return {};
  }

  const { state: createState, batch, effect } = ReactiveCore;

  // ============================================================================
  // COLLECTION CREATION
  // ============================================================================

  /**
   * Create a reactive collection with array management methods
   * Provides 30+ methods for managing reactive arrays
   *
   * @param {Array} items - Initial items
   * @returns {Object} Reactive collection
   *
   * @example
   * const todos = collection([
   *   { id: 1, text: 'Learn React', done: false },
   *   { id: 2, text: 'Build app', done: false }
   * ]);
   *
   * todos.add({ id: 3, text: 'Deploy', done: false });
   * todos.remove(item => item.id === 1);
   * todos.update(item => item.id === 2, { done: true });
   */
  function createCollection(items = []) {
    // Create the base object with items array
    const collectionObj = {
      items: [...items]
    };

    // Make it reactive
    const collection = createState(collectionObj);

    // ========================================================================
    // COLLECTION METHODS
    // ========================================================================

    const methods = {
      // --------------------------------------------------------------------
      // BASIC OPERATIONS
      // --------------------------------------------------------------------

      /**
       * Add an item to the collection
       * @param {*} item - Item to add
       * @returns {Object} this for chaining
       */
      add(item) {
        this.items.push(item);
        return this;
      },

      /**
       * Remove an item from the collection
       * @param {*|Function} predicate - Item or predicate function
       * @returns {Object} this for chaining
       */
      remove(predicate) {
        const idx = typeof predicate === 'function'
          ? this.items.findIndex(predicate)
          : this.items.indexOf(predicate);
        if (idx !== -1) {
          this.items.splice(idx, 1);
        }
        return this;
      },

      /**
       * Update an item in the collection
       * @param {*|Function} predicate - Item or predicate function
       * @param {Object} updates - Properties to update
       * @returns {Object} this for chaining
       */
      update(predicate, updates) {
        const idx = typeof predicate === 'function'
          ? this.items.findIndex(predicate)
          : this.items.indexOf(predicate);
        if (idx !== -1) {
          Object.assign(this.items[idx], updates);
        }
        return this;
      },

      /**
       * Clear all items from the collection
       * @returns {Object} this for chaining
       */
      clear() {
        this.items.length = 0;
        return this;
      },

      // --------------------------------------------------------------------
      // SEARCH & FILTER
      // --------------------------------------------------------------------

      /**
       * Find an item in the collection
       * @param {*|Function} predicate - Item or predicate function
       * @returns {*} Found item or undefined
       */
      find(predicate) {
        return typeof predicate === 'function'
          ? this.items.find(predicate)
          : this.items.find(item => item === predicate);
      },

      /**
       * Filter items in the collection
       * @param {Function} predicate - Filter predicate
       * @returns {Array} Filtered items
       */
      filter(predicate) {
        return this.items.filter(predicate);
      },

      /**
       * Map items in the collection
       * @param {Function} fn - Mapping function
       * @returns {Array} Mapped values
       */
      map(fn) {
        return this.items.map(fn);
      },

      /**
       * Iterate over items in the collection
       * @param {Function} fn - Iterator function
       * @returns {Object} this for chaining
       */
      forEach(fn) {
        this.items.forEach(fn);
        return this;
      },

      // --------------------------------------------------------------------
      // SORTING & ORDERING
      // --------------------------------------------------------------------

      /**
       * Sort items in the collection
       * @param {Function} [compareFn] - Compare function
       * @returns {Object} this for chaining
       */
      sort(compareFn) {
        this.items.sort(compareFn);
        return this;
      },

      /**
       * Reverse items in the collection
       * @returns {Object} this for chaining
       */
      reverse() {
        this.items.reverse();
        return this;
      },

      // --------------------------------------------------------------------
      // GETTERS
      // --------------------------------------------------------------------

      /**
       * Get collection length
       * @returns {number} Number of items
       */
      get length() {
        return this.items.length;
      },

      /**
       * Get first item
       * @returns {*} First item or undefined
       */
      get first() {
        return this.items[0];
      },

      /**
       * Get last item
       * @returns {*} Last item or undefined
       */
      get last() {
        return this.items[this.items.length - 1];
      },

      // --------------------------------------------------------------------
      // ARRAY METHODS
      // --------------------------------------------------------------------

      /**
       * Get item at index (supports negative indices)
       * @param {number} index - Item index
       * @returns {*} Item at index
       */
      at(index) {
        return this.items[index];
      },

      /**
       * Check if collection includes an item
       * @param {*} item - Item to check
       * @returns {boolean} true if item exists
       */
      includes(item) {
        return this.items.includes(item);
      },

      /**
       * Get index of an item
       * @param {*} item - Item to find
       * @returns {number} Index or -1
       */
      indexOf(item) {
        return this.items.indexOf(item);
      },

      /**
       * Get a slice of items
       * @param {number} start - Start index
       * @param {number} [end] - End index
       * @returns {Array} Sliced items
       */
      slice(start, end) {
        return this.items.slice(start, end);
      },

      /**
       * Splice items (add/remove at index)
       * @param {number} start - Start index
       * @param {number} deleteCount - Number to delete
       * @param {...*} items - Items to add
       * @returns {Object} this for chaining
       */
      splice(start, deleteCount, ...items) {
        this.items.splice(start, deleteCount, ...items);
        return this;
      },

      /**
       * Push items to the end
       * @param {...*} items - Items to push
       * @returns {Object} this for chaining
       */
      push(...items) {
        this.items.push(...items);
        return this;
      },

      /**
       * Pop item from the end
       * @returns {*} Popped item
       */
      pop() {
        return this.items.pop();
      },

      /**
       * Shift item from the start
       * @returns {*} Shifted item
       */
      shift() {
        return this.items.shift();
      },

      /**
       * Unshift items to the start
       * @param {...*} items - Items to unshift
       * @returns {Object} this for chaining
       */
      unshift(...items) {
        this.items.unshift(...items);
        return this;
      },

      // --------------------------------------------------------------------
      // ADVANCED OPERATIONS
      // --------------------------------------------------------------------

      /**
       * Toggle a boolean field on an item
       * @param {*|Function} predicate - Item or predicate function
       * @param {string} [field='done'] - Field to toggle
       * @returns {Object} this for chaining
       */
      toggle(predicate, field = 'done') {
        const idx = typeof predicate === 'function'
          ? this.items.findIndex(predicate)
          : this.items.indexOf(predicate);
        if (idx !== -1 && this.items[idx]) {
          this.items[idx][field] = !this.items[idx][field];
        }
        return this;
      },

      /**
       * Remove all items matching a predicate
       * @param {Function} predicate - Predicate function
       * @returns {Object} this for chaining
       */
      removeWhere(predicate) {
        for (let i = this.items.length - 1; i >= 0; i--) {
          if (predicate(this.items[i], i)) {
            this.items.splice(i, 1);
          }
        }
        return this;
      },

      /**
       * Update all items matching a predicate
       * @param {Function} predicate - Predicate function
       * @param {Object} updates - Properties to update
       * @returns {Object} this for chaining
       */
      updateWhere(predicate, updates) {
        this.items.forEach((item, idx) => {
          if (predicate(item, idx)) {
            Object.assign(this.items[idx], updates);
          }
        });
        return this;
      },

      /**
       * Reset collection with new items
       * @param {Array} [newItems=[]] - New items
       * @returns {Object} this for chaining
       */
      reset(newItems = []) {
        this.items.length = 0;
        this.items.push(...newItems);
        return this;
      },

      /**
       * Convert collection to plain array
       * @returns {Array} Copy of items
       */
      toArray() {
        return [...this.items];
      },

      /**
       * Check if collection is empty
       * @returns {boolean} true if empty
       */
      isEmpty() {
        return this.items.length === 0;
      }
    };

    // Attach methods to collection
    Object.keys(methods).forEach(key => {
      const descriptor = Object.getOwnPropertyDescriptor(methods, key);
      if (descriptor.get) {
        // It's a getter
        Object.defineProperty(collection, key, {
          get: descriptor.get,
          enumerable: false,
          configurable: true
        });
      } else {
        // It's a method
        collection[key] = methods[key].bind(collection);
      }
    });

    return collection;
  }

  /**
   * Create a collection with computed properties
   * @param {Array} items - Initial items
   * @param {Object} computed - Computed properties { key: fn }
   * @returns {Object} Reactive collection with computed properties
   *
   * @example
   * const todos = collectionWithComputed(
   *   [{ text: 'Task', done: false }],
   *   {
   *     completed: function() { return this.items.filter(t => t.done); },
   *     pending: function() { return this.items.filter(t => !t.done); }
   *   }
   * );
   */
  function createCollectionWithComputed(items = [], computed = {}) {
    const collection = createCollection(items);

    if (computed && typeof computed === 'object') {
      Object.entries(computed).forEach(([key, fn]) => {
        collection.$computed(key, fn);
      });
    }

    return collection;
  }

  /**
   * Create a filtered view of a collection
   * The filtered collection automatically updates when the source changes
   *
   * @param {Object} collection - Source collection
   * @param {Function} predicate - Filter predicate
   * @returns {Object} Reactive filtered collection
   *
   * @example
   * const todos = collection([...]);
   * const completedTodos = filteredCollection(todos, t => t.done);
   * // completedTodos automatically updates when todos changes
   */
  function createFilteredCollection(collection, predicate) {
    const filtered = createCollection([]);

    // Sync filtered items whenever source changes
    effect(() => {
      const newItems = collection.items.filter(predicate);
      filtered.reset(newItems);
    });

    return filtered;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const api = {
    /**
     * Create a reactive collection
     */
    create: createCollection,

    /**
     * Create a collection with computed properties
     */
    createWithComputed: createCollectionWithComputed,

    /**
     * Create a filtered view of a collection
     */
    createFiltered: createFilteredCollection,

    /**
     * Alias for create
     */
    collection: createCollection,

    /**
     * Alias for create
     */
    list: createCollection,

    /**
     * Version
     */
    version: '2.3.1'
  };

  // ============================================================================
  // GLOBAL INTEGRATION
  // ============================================================================

  // Attach to Collections global if available
  if (typeof Collections !== 'undefined') {
    Object.assign(Collections, api);
  }

  // Add to ReactiveCore/ReactiveUtils
  if (ReactiveCore) {
    ReactiveCore.collection = createCollection;
    ReactiveCore.list = createCollection;
    ReactiveCore.createCollection = createCollection;
  }

  // Legacy support for ReactiveState
  if (typeof ReactiveState !== 'undefined') {
    ReactiveState.collection = createCollection;
    ReactiveState.list = createCollection;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Reactive Collections] v2.3.1 loaded successfully');
    console.log('[DOM Helpers Reactive Collections] Available methods:');
    console.log('  - collection.add(item)');
    console.log('  - collection.remove(predicate)');
    console.log('  - collection.update(predicate, updates)');
    console.log('  - collection.clear()');
    console.log('  - Plus: find, filter, map, forEach, sort, toggle, and 20+ more!');
  }

  return api;
});
