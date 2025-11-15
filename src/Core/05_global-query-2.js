/**
 * DOM Helpers - Indexed Collection Updates Enhancement
 * Standalone module that adds indexed update support to collections
 * 
 * IMPORTANT: Load this AFTER the main DOM helpers bundle AND global-query.js!
 * 
 * Enables syntax like:
 * querySelectorAll('.btn').update({
 *   [0]: { textContent: 'First', style: { color: 'red' } },
 *   [1]: { textContent: 'Second', style: { color: 'blue' } }
 * })
 * 
 * @version 1.0.1
 * @license MIT
 */
(function(global) {
    "use strict";

    // ===== DEPENDENCY CHECKS =====
    const hasEnhancedUpdateUtility = typeof global.EnhancedUpdateUtility !== "undefined";
    const hasGlobalQuery = typeof global.querySelectorAll === "function" || typeof global.qsa === "function";

    if (!hasEnhancedUpdateUtility) {
        console.warn("[Indexed Updates] EnhancedUpdateUtility not found. Load main DOM helpers first!");
    }
    if (!hasGlobalQuery) {
        console.warn("[Indexed Updates] Global query functions not found. Load global-query.js first!");
    }

    // ===== HELPER: APPLY UPDATES TO SINGLE ELEMENT =====
    /**
     * Applies updates to a single element
     */
    function applyUpdatesToElement(element, updates) {
        if (typeof global.EnhancedUpdateUtility !== "undefined" && 
            global.EnhancedUpdateUtility.applyEnhancedUpdate) {
            Object.entries(updates).forEach(([key, value]) => {
                global.EnhancedUpdateUtility.applyEnhancedUpdate(element, key, value);
            });
        } else if (typeof element.update === "function") {
            element.update(updates);
        } else {
            applyBasicUpdate(element, updates);
        }
    }

    // ===== BASIC UPDATE FALLBACK =====
    /**
     * Basic update implementation for elements without .update() method
     */
    function applyBasicUpdate(element, updates) {
        Object.entries(updates).forEach(([key, value]) => {
            try {
                if (key === "style" && typeof value === "object" && value !== null) {
                    Object.entries(value).forEach(([styleProperty, styleValue]) => {
                        if (styleValue !== null && styleValue !== undefined) {
                            element.style[styleProperty] = styleValue;
                        }
                    });
                    return;
                }

                if (key === "classList" && typeof value === "object" && value !== null) {
                    Object.entries(value).forEach(([method, classes]) => {
                        const classList = Array.isArray(classes) ? classes : [classes];
                        switch (method) {
                            case "add":
                                element.classList.add(...classList);
                                break;
                            case "remove":
                                element.classList.remove(...classList);
                                break;
                            case "toggle":
                                classList.forEach(c => element.classList.toggle(c));
                                break;
                        }
                    });
                    return;
                }

                if (key === "setAttribute") {
                    if (Array.isArray(value) && value.length >= 2) {
                        element.setAttribute(value[0], value[1]);
                    } else if (typeof value === "object") {
                        Object.entries(value).forEach(([attr, val]) => element.setAttribute(attr, val));
                    }
                    return;
                }

                if (key in element) {
                    element[key] = value;
                } else if (typeof value === "string" || typeof value === "number") {
                    element.setAttribute(key, value);
                }
            } catch (error) {
                console.warn(`[Indexed Updates] Failed to apply ${key}:`, error.message);
            }
        });
    }

    // ===== CORE: INDEXED UPDATE FUNCTION =====
    /**
     * Updates collection with support for indexed updates
     */
    function updateCollectionWithIndices(collection, updates) {
        if (!collection) {
            console.warn("[Indexed Updates] .update() called on null collection");
            return collection;
        }

        // Extract elements from collection
        let elements = [];
        if (collection.length !== undefined) {
            try {
                elements = Array.from(collection);
            } catch (e) {
                // Fallback for non-iterable collections
                for (let i = 0; i < collection.length; i++) {
                    elements.push(collection[i]);
                }
            }
        } else if (collection._originalCollection) {
            elements = Array.from(collection._originalCollection);
        } else if (collection._originalNodeList) {
            elements = Array.from(collection._originalNodeList);
        } else {
            console.warn("[Indexed Updates] .update() called on unrecognized collection type");
            return collection;
        }

        if (elements.length === 0) {
            console.info("[Indexed Updates] .update() called on empty collection");
            return collection;
        }

        try {
            const updateKeys = Object.keys(updates);
            
            // Check for numeric indices (properly filter out Symbol keys and non-numeric strings)
            const hasNumericIndices = updateKeys.some(key => {
                if (typeof key === 'symbol') return false;
                const asNumber = Number(key);
                // A key is numeric if it's a finite integer and converting back gives the same string
                return Number.isFinite(asNumber) && 
                       Number.isInteger(asNumber) && 
                       String(asNumber) === key;
            });

            if (hasNumericIndices) {
                console.log("[Indexed Updates] Using index-based update mode");
                updateKeys.forEach(key => {
                    // Skip Symbol keys
                    if (typeof key === 'symbol') return;
                    
                    const asNumber = Number(key);
                    // Only process actual numeric keys
                    if (Number.isFinite(asNumber) && 
                        Number.isInteger(asNumber) && 
                        String(asNumber) === key) {
                        
                        let index = asNumber;
                        if (index < 0) {
                            index = elements.length + index;
                        }

                        const element = elements[index];
                        if (element && element.nodeType === Node.ELEMENT_NODE) {
                            const elementUpdates = updates[key];
                            if (elementUpdates && typeof elementUpdates === "object") {
                                applyUpdatesToElement(element, elementUpdates);
                            }
                        } else if (index >= 0 && index < elements.length) {
                            console.warn(`[Indexed Updates] Element at index ${key} is not a valid DOM element`);
                        } else {
                            console.warn(`[Indexed Updates] No element at index ${key} (resolved to ${index}, collection has ${elements.length} elements)`);
                        }
                    }
                });
            } else {
                console.log("[Indexed Updates] Using standard update mode (all elements)");
                elements.forEach(element => {
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        applyUpdatesToElement(element, updates);
                    }
                });
            }
        } catch (error) {
            console.warn(`[Indexed Updates] Error in collection .update(): ${error.message}`);
            console.error(error);
        }

        return collection;
    }

    // ===== PATCH COLLECTION UPDATE METHOD =====
    /**
     * Patches a collection's update method to support indexed updates
     */
    function patchCollectionUpdate(collection) {
        if (!collection || collection._hasIndexedUpdateSupport) {
            return collection;
        }

        // Store reference to original update method
        const originalUpdate = collection.update;

        try {
            Object.defineProperty(collection, "update", {
                value: function(updates = {}) {
                    // Check if this is an indexed update or standard update
                    const updateKeys = Object.keys(updates);
                    const hasNumericIndices = updateKeys.some(key => {
                        if (typeof key === 'symbol') return false;
                        const asNumber = Number(key);
                        return Number.isFinite(asNumber) && 
                               Number.isInteger(asNumber) && 
                               String(asNumber) === key;
                    });

                    // If it has numeric indices, use indexed update
                    if (hasNumericIndices) {
                        return updateCollectionWithIndices(this, updates);
                    }

                    // Otherwise, use the original update method if it exists
                    if (originalUpdate && typeof originalUpdate === 'function') {
                        return originalUpdate.call(this, updates);
                    }

                    // Fallback: apply updates to all elements in standard mode
                    return updateCollectionWithIndices(this, updates);
                },
                writable: false,
                enumerable: false,
                configurable: true
            });

            Object.defineProperty(collection, "_hasIndexedUpdateSupport", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (e) {
            // Fallback if defineProperty fails
            collection.update = function(updates = {}) {
                const updateKeys = Object.keys(updates);
                const hasNumericIndices = updateKeys.some(key => {
                    if (typeof key === 'symbol') return false;
                    const asNumber = Number(key);
                    return Number.isFinite(asNumber) && 
                           Number.isInteger(asNumber) && 
                           String(asNumber) === key;
                });

                if (hasNumericIndices) {
                    return updateCollectionWithIndices(this, updates);
                }

                if (originalUpdate && typeof originalUpdate === 'function') {
                    return originalUpdate.call(this, updates);
                }

                return updateCollectionWithIndices(this, updates);
            };
            collection._hasIndexedUpdateSupport = true;
        }

        return collection;
    }

    // ===== PATCH GLOBAL QUERY FUNCTIONS =====

    const originalQS = global.querySelector;
    const originalQSA = global.querySelectorAll;
    const originalQSShort = global.qs;
    const originalQSAShort = global.qsa;

    function enhancedQuerySelectorAll(selector, context = document) {
        let collection;
        if (originalQSA) {
            collection = originalQSA.call(global, selector, context);
        } else if (originalQSAShort) {
            collection = originalQSAShort.call(global, selector, context);
        } else {
            console.warn("[Indexed Updates] No querySelectorAll function found");
            return null;
        }

        // Only patch if collection doesn't already have indexed update support
        if (collection && !collection._hasIndexedUpdateSupport) {
            return patchCollectionUpdate(collection);
        }
        
        return collection;
    }

    function enhancedQSA(selector, context = document) {
        return enhancedQuerySelectorAll(selector, context);
    }

    if (originalQSA) {
        global.querySelectorAll = enhancedQuerySelectorAll;
        console.log("[Indexed Updates] Enhanced querySelectorAll");
    }

    if (originalQSAShort) {
        global.qsa = enhancedQSA;
        console.log("[Indexed Updates] Enhanced qsa");
    }

    // ===== PATCH COLLECTIONS HELPER =====

    if (global.Collections) {
        const originalCollectionsUpdate = global.Collections.update;
        global.Collections.update = function(updates = {}) {
            const hasColonKeys = Object.keys(updates).some(key => key.includes(":"));
            if (hasColonKeys) {
                return originalCollectionsUpdate.call(this, updates);
            } else {
                return updateCollectionWithIndices(this, updates);
            }
        };
        console.log("[Indexed Updates] Patched Collections.update");
    }

    // ===== PATCH SELECTOR HELPER =====

    if (global.Selector) {
        const originalSelectorUpdate = global.Selector.update;
        global.Selector.update = function(updates = {}) {
            const firstKey = Object.keys(updates)[0];
            const looksLikeSelector = firstKey && (firstKey.startsWith("#") || firstKey.startsWith(".") || firstKey.includes("["));
            if (looksLikeSelector) {
                return originalSelectorUpdate.call(this, updates);
            } else {
                return updateCollectionWithIndices(this, updates);
            }
        };
        console.log("[Indexed Updates] Patched Selector.update");
    }

    // ===== PATCH ENHANCED UPDATE UTILITY =====

    if (hasEnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceCollectionWithUpdate) {
        const originalEnhance = global.EnhancedUpdateUtility.enhanceCollectionWithUpdate;
        global.EnhancedUpdateUtility.enhanceCollectionWithUpdate = function(collection) {
            const enhanced = originalEnhance.call(this, collection);
            return patchCollectionUpdate(enhanced);
        };
        console.log("[Indexed Updates] Patched EnhancedUpdateUtility.enhanceCollectionWithUpdate");
    }

    // ===== EXPORTS =====

    const IndexedUpdates = {
        version: "1.0.1",
        updateCollectionWithIndices: updateCollectionWithIndices,
        patchCollectionUpdate: patchCollectionUpdate,
        patch(collection) {
            return patchCollectionUpdate(collection);
        },
        hasSupport(collection) {
            return !!(collection && collection._hasIndexedUpdateSupport);
        },
        restore() {
            if (originalQSA) global.querySelectorAll = originalQSA;
            if (originalQSAShort) global.qsa = originalQSAShort;
            console.log("[Indexed Updates] Restored original functions");
        }
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = IndexedUpdates;
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return IndexedUpdates;
        });
    } else {
        global.IndexedUpdates = IndexedUpdates;
    }

    if (typeof global.DOMHelpers !== "undefined") {
        global.DOMHelpers.IndexedUpdates = IndexedUpdates;
    }

    console.log("[DOM Helpers] Indexed collection updates loaded - v1.0.1");
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);