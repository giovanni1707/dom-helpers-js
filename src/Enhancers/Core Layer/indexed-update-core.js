/**
 * indexed-update-core.js
 *
 * Core module for indexed collection updates
 * Pure functions for separating, resolving, and applying indexed and bulk updates
 *
 * This module extracts the common logic from:
 * - 04_dh-indexed-collection-updates.js
 * - 06_dh-global-collection-indexed-updates.js
 *
 * @version 1.0.0
 * @license MIT
 * @author DOM Helpers Team
 */

(function(root, factory) {
    "use strict";

    // UMD pattern: CommonJS, AMD, and browser globals
    if (typeof module === "object" && module.exports) {
        // CommonJS/Node.js
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        // AMD
        define([], factory);
    } else {
        // Browser globals
        root.IndexedUpdateCore = factory();
    }
}(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this, function() {
    "use strict";

    // ========================================================================
    // INDEX VALIDATION AND RESOLUTION
    // ========================================================================

    /**
     * Checks if a key represents a valid numeric index
     *
     * A valid numeric index must be:
     * - A finite number
     * - An integer (no decimals)
     * - Stringified form matches the original key (e.g., "0", "1", "-1")
     *
     * @param {string|number} key - The key to check
     * @returns {boolean} - True if the key is a valid numeric index
     *
     * @example
     * isNumericIndex("0")      // true
     * isNumericIndex("5")      // true
     * isNumericIndex("-1")     // true
     * isNumericIndex("1.5")    // false
     * isNumericIndex("abc")    // false
     * isNumericIndex("classList") // false
     */
    function isNumericIndex(key) {
        if (typeof key === "symbol") {
            return false;
        }

        const keyStr = String(key);
        const asNumber = Number(keyStr);

        // Must be finite, integer, and string form must match exactly
        return Number.isFinite(asNumber) &&
               Number.isInteger(asNumber) &&
               String(asNumber) === keyStr;
    }

    /**
     * Resolves negative indices to positive indices
     *
     * Negative indices count from the end of the collection:
     * - -1 refers to the last element
     * - -2 refers to the second-to-last element
     * - etc.
     *
     * @param {number} index - The index to resolve (can be negative)
     * @param {number} length - The length of the collection
     * @returns {number} - The resolved positive index
     *
     * @example
     * resolveNegativeIndex(-1, 5)  // 4 (last element)
     * resolveNegativeIndex(-2, 5)  // 3 (second-to-last)
     * resolveNegativeIndex(2, 5)   // 2 (unchanged, already positive)
     * resolveNegativeIndex(-10, 5) // -5 (out of bounds)
     */
    function resolveNegativeIndex(index, length) {
        if (index < 0) {
            return length + index;
        }
        return index;
    }

    /**
     * Validates if an index is within collection bounds
     *
     * @param {number} index - The index to validate (must be resolved/positive)
     * @param {number} length - The length of the collection
     * @returns {boolean} - True if the index is valid
     *
     * @example
     * isValidIndex(2, 5)   // true
     * isValidIndex(-1, 5)  // false (must be resolved first)
     * isValidIndex(10, 5)  // false (out of bounds)
     */
    function isValidIndex(index, length) {
        return index >= 0 && index < length;
    }

    // ========================================================================
    // UPDATE OBJECT SEPARATION
    // ========================================================================

    /**
     * Separates an updates object into bulk properties and indexed updates
     *
     * This function categorizes update properties into two groups:
     * 1. Indexed updates: Properties with numeric keys (e.g., [0], [1], [-1])
     * 2. Bulk updates: Properties with non-numeric keys (e.g., classList, style)
     *
     * @param {Object} updates - The updates object to separate
     * @returns {Object} - Object with { indexedUpdates, bulkUpdates, hasIndexed, hasBulk }
     *
     * @example
     * const updates = {
     *   [0]: { textContent: 'First' },
     *   [1]: { textContent: 'Second' },
     *   classList: { add: ['shared'] },
     *   style: { color: 'red' }
     * };
     *
     * const result = separateIndicesFromBulk(updates);
     * // result.indexedUpdates = { "0": {...}, "1": {...} }
     * // result.bulkUpdates = { classList: {...}, style: {...} }
     * // result.hasIndexed = true
     * // result.hasBulk = true
     */
    function separateIndicesFromBulk(updates) {
        const indexedUpdates = {};
        const bulkUpdates = {};
        let hasIndexed = false;
        let hasBulk = false;

        // Get all keys (excluding symbols)
        const keys = Object.keys(updates);

        keys.forEach(function(key) {
            if (isNumericIndex(key)) {
                indexedUpdates[key] = updates[key];
                hasIndexed = true;
            } else {
                bulkUpdates[key] = updates[key];
                hasBulk = true;
            }
        });

        return {
            indexedUpdates: indexedUpdates,
            bulkUpdates: bulkUpdates,
            hasIndexed: hasIndexed,
            hasBulk: hasBulk
        };
    }

    // ========================================================================
    // COLLECTION TO ARRAY CONVERSION
    // ========================================================================

    /**
     * Converts various collection types to an array of elements
     *
     * Supports:
     * - Array-like objects with .length property
     * - NodeList
     * - HTMLCollection
     * - Collections with _originalCollection or _originalNodeList
     *
     * @param {Object|Array} collection - The collection to convert
     * @returns {Array} - Array of elements
     *
     * @example
     * const nodeList = document.querySelectorAll('.btn');
     * const array = collectionToArray(nodeList);
     * // array = [element1, element2, ...]
     */
    function collectionToArray(collection) {
        if (!collection) {
            return [];
        }

        let elements = [];

        // Try Array.from first (most reliable)
        if (collection.length !== undefined) {
            try {
                elements = Array.from(collection);
            } catch (e) {
                // Fallback for non-iterable collections
                for (let i = 0; i < collection.length; i++) {
                    elements.push(collection[i]);
                }
            }
        }
        // Check for wrapped collections
        else if (collection._originalCollection) {
            try {
                elements = Array.from(collection._originalCollection);
            } catch (e) {
                const original = collection._originalCollection;
                for (let i = 0; i < original.length; i++) {
                    elements.push(original[i]);
                }
            }
        }
        else if (collection._originalNodeList) {
            try {
                elements = Array.from(collection._originalNodeList);
            } catch (e) {
                const original = collection._originalNodeList;
                for (let i = 0; i < original.length; i++) {
                    elements.push(original[i]);
                }
            }
        }

        return elements;
    }

    // ========================================================================
    // BULK UPDATE APPLICATION
    // ========================================================================

    /**
     * Applies bulk updates to all elements in a collection
     *
     * Bulk updates are properties that apply to ALL elements in the collection,
     * such as classList, style, or any non-indexed property.
     *
     * @param {Array} collection - Array of DOM elements
     * @param {Object} bulkUpdates - Updates to apply to all elements
     * @param {Function} updateFn - Function to apply updates to a single element
     *                               Signature: updateFn(element, updates)
     * @returns {number} - Number of elements successfully updated
     *
     * @example
     * const elements = [div1, div2, div3];
     * const updates = { classList: { add: ['active'] } };
     *
     * applyBulkUpdates(elements, updates, function(element, updates) {
     *   element.update(updates);
     * });
     * // All 3 elements now have 'active' class
     */
    function applyBulkUpdates(collection, bulkUpdates, updateFn) {
        if (!bulkUpdates || typeof bulkUpdates !== "object") {
            return 0;
        }

        let updateCount = 0;

        collection.forEach(function(element) {
            if (element && element.nodeType === Node.ELEMENT_NODE) {
                try {
                    updateFn(element, bulkUpdates);
                    updateCount++;
                } catch (error) {
                    console.warn("[IndexedUpdateCore] Error applying bulk update:", error.message);
                }
            }
        });

        return updateCount;
    }

    // ========================================================================
    // INDEXED UPDATE APPLICATION
    // ========================================================================

    /**
     * Applies index-specific updates to elements in a collection
     *
     * Index-specific updates target individual elements by their position,
     * including support for negative indices (counting from the end).
     *
     * @param {Array} collection - Array of DOM elements
     * @param {Object} indexedUpdates - Updates keyed by index (e.g., {"0": {...}, "-1": {...}})
     * @param {Function} updateFn - Function to apply updates to a single element
     *                               Signature: updateFn(element, updates)
     * @returns {Object} - Stats object { successful, failed, outOfBounds }
     *
     * @example
     * const elements = [div1, div2, div3];
     * const updates = {
     *   "0": { textContent: "First" },
     *   "-1": { textContent: "Last" }
     * };
     *
     * applyIndexedUpdates(elements, updates, function(element, updates) {
     *   element.update(updates);
     * });
     * // div1 textContent = "First"
     * // div3 textContent = "Last"
     */
    function applyIndexedUpdates(collection, indexedUpdates, updateFn) {
        if (!indexedUpdates || typeof indexedUpdates !== "object") {
            return { successful: 0, failed: 0, outOfBounds: 0 };
        }

        const stats = {
            successful: 0,
            failed: 0,
            outOfBounds: 0
        };

        const length = collection.length;

        Object.keys(indexedUpdates).forEach(function(key) {
            const originalIndex = Number(key);
            const resolvedIndex = resolveNegativeIndex(originalIndex, length);
            const updates = indexedUpdates[key];

            // Validate index is within bounds
            if (!isValidIndex(resolvedIndex, length)) {
                console.warn(
                    "[IndexedUpdateCore] Index " + key +
                    " (resolved to " + resolvedIndex +
                    ") is out of bounds (collection length: " + length + ")"
                );
                stats.outOfBounds++;
                return;
            }

            const element = collection[resolvedIndex];

            // Validate element exists and is a DOM element
            if (!element || element.nodeType !== Node.ELEMENT_NODE) {
                console.warn(
                    "[IndexedUpdateCore] Element at index " + key +
                    " is not a valid DOM element"
                );
                stats.failed++;
                return;
            }

            // Validate updates object
            if (!updates || typeof updates !== "object") {
                console.warn(
                    "[IndexedUpdateCore] Updates for index " + key +
                    " is not a valid object"
                );
                stats.failed++;
                return;
            }

            // Apply updates
            try {
                updateFn(element, updates);
                stats.successful++;
            } catch (error) {
                console.warn(
                    "[IndexedUpdateCore] Error applying updates to index " + key + ":",
                    error.message
                );
                stats.failed++;
            }
        });

        return stats;
    }

    // ========================================================================
    // MAIN UPDATE ALGORITHM
    // ========================================================================

    /**
     * Main algorithm: Updates a collection with both bulk and indexed updates
     *
     * This is the core algorithm that:
     * 1. Converts the collection to an array
     * 2. Separates indexed updates from bulk updates
     * 3. Applies bulk updates to ALL elements first
     * 4. Applies indexed updates to specific elements (can override bulk)
     *
     * @param {Object|Array} collection - The collection to update
     * @param {Object} updates - Updates object with indexed and/or bulk properties
     * @param {Function} updateFn - Function to apply updates to a single element
     *                               Signature: updateFn(element, updates)
     * @returns {Object} - Results object with stats and status
     *
     * @example
     * const collection = document.querySelectorAll('.btn');
     * const updates = {
     *   [0]: { textContent: 'First', style: { color: 'red' } },
     *   [1]: { textContent: 'Second', style: { color: 'blue' } },
     *   classList: { add: ['btn', 'interactive'] }  // Applied to ALL
     * };
     *
     * updateCollectionWithIndices(collection, updates, function(element, updates) {
     *   // Your update logic here
     *   element.update(updates);
     * });
     */
    function updateCollectionWithIndices(collection, updates, updateFn) {
        // Validate inputs
        if (!collection) {
            console.warn("[IndexedUpdateCore] updateCollectionWithIndices called with null collection");
            return {
                success: false,
                error: "Null collection",
                stats: null
            };
        }

        if (!updates || typeof updates !== "object") {
            console.warn("[IndexedUpdateCore] updateCollectionWithIndices called with invalid updates");
            return {
                success: false,
                error: "Invalid updates object",
                stats: null
            };
        }

        if (typeof updateFn !== "function") {
            console.warn("[IndexedUpdateCore] updateCollectionWithIndices called without update function");
            return {
                success: false,
                error: "Update function not provided",
                stats: null
            };
        }

        // Convert collection to array
        const elements = collectionToArray(collection);

        if (elements.length === 0) {
            console.info("[IndexedUpdateCore] updateCollectionWithIndices called on empty collection");
            return {
                success: true,
                isEmpty: true,
                stats: {
                    collectionLength: 0,
                    bulkUpdateCount: 0,
                    indexedStats: { successful: 0, failed: 0, outOfBounds: 0 }
                }
            };
        }

        // Separate indices from bulk
        const separated = separateIndicesFromBulk(updates);

        const stats = {
            collectionLength: elements.length,
            bulkUpdateCount: 0,
            indexedStats: { successful: 0, failed: 0, outOfBounds: 0 }
        };

        // Apply bulk updates first (to ALL elements)
        if (separated.hasBulk) {
            stats.bulkUpdateCount = applyBulkUpdates(elements, separated.bulkUpdates, updateFn);
        }

        // Apply indexed updates (these can override bulk updates)
        if (separated.hasIndexed) {
            stats.indexedStats = applyIndexedUpdates(elements, separated.indexedUpdates, updateFn);
        }

        // Return comprehensive results
        return {
            success: true,
            isEmpty: false,
            stats: stats
        };
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    /**
     * Public API for IndexedUpdateCore module
     * All functions are pure with no side effects
     */
    const IndexedUpdateCore = {
        // Version
        version: "1.0.0",

        // Index utilities
        isNumericIndex: isNumericIndex,
        resolveNegativeIndex: resolveNegativeIndex,
        isValidIndex: isValidIndex,

        // Separation utilities
        separateIndicesFromBulk: separateIndicesFromBulk,

        // Collection utilities
        collectionToArray: collectionToArray,

        // Update application
        applyBulkUpdates: applyBulkUpdates,
        applyIndexedUpdates: applyIndexedUpdates,

        // Main algorithm
        updateCollectionWithIndices: updateCollectionWithIndices
    };

    return IndexedUpdateCore;
}));
