
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
 * @version 1.0.0
 * @license MIT
 */
(function(global) {
    "use strict";
    const hasEnhancedUpdateUtility = typeof global.EnhancedUpdateUtility !== "undefined";
    const hasGlobalQuery = typeof global.querySelectorAll === "function" || typeof global.qsa === "function";
    if (!hasEnhancedUpdateUtility) {
        console.warn("[Indexed Updates] EnhancedUpdateUtility not found. Load main DOM helpers first!");
    }
    if (!hasGlobalQuery) {
        console.warn("[Indexed Updates] Global query functions not found. Load global-query.js first!");
    }
    function updateCollectionWithIndices(collection, updates) {
        if (!collection) {
            console.warn("[Indexed Updates] .update() called on null collection");
            return collection;
        }
        let elements = [];
        if (collection.length !== undefined) {
            elements = Array.from(collection);
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
         const hasNumericIndices = updateKeys.some(key => {
    // Skip Symbol keys
    if (typeof key === 'symbol') return false;
    
    const num = parseInt(key);
    return !isNaN(num);
});

            if (hasNumericIndices) {
                console.log("[Indexed Updates] Using index-based update mode");
                updateKeys.forEach(key => {

                     // Skip Symbol keys
    if (typeof key === 'symbol') return;
                    const num = parseInt(key);
                    if (!isNaN(num)) {
                        let index = num;
                        if (index < 0) {
                            index = elements.length + index;
                        }
                        const element = elements[index];
                        if (element && element.nodeType === Node.ELEMENT_NODE) {
                            const elementUpdates = updates[key];
                            if (elementUpdates && typeof elementUpdates === "object") {
                                if (typeof global.EnhancedUpdateUtility !== "undefined" && global.EnhancedUpdateUtility.applyEnhancedUpdate) {
                                    Object.entries(elementUpdates).forEach(([updateKey, value]) => {
                                        global.EnhancedUpdateUtility.applyEnhancedUpdate(element, updateKey, value);
                                    });
                                } else {
                                    if (typeof element.update === "function") {
                                        element.update(elementUpdates);
                                    } else {
                                        applyBasicUpdate(element, elementUpdates);
                                    }
                                }
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
                        if (typeof global.EnhancedUpdateUtility !== "undefined" && global.EnhancedUpdateUtility.applyEnhancedUpdate) {
                            Object.entries(updates).forEach(([key, value]) => {
                                global.EnhancedUpdateUtility.applyEnhancedUpdate(element, key, value);
                            });
                        } else {
                            if (typeof element.update === "function") {
                                element.update(updates);
                            } else {
                                applyBasicUpdate(element, updates);
                            }
                        }
                    }
                });
            }
        } catch (error) {
            console.warn(`[Indexed Updates] Error in collection .update(): ${error.message}`);
        }
        return collection;
    }
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
                        const classList = Array.isArray(classes) ? classes : [ classes ];
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
    function patchCollectionUpdate(collection) {
        if (!collection || collection._hasIndexedUpdateSupport) {
            return collection;
        }
        const originalUpdate = collection.update;
        try {
            Object.defineProperty(collection, "update", {
                value: function(updates = {}) {
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
            collection.update = function(updates = {}) {
                return updateCollectionWithIndices(this, updates);
            };
            collection._hasIndexedUpdateSupport = true;
        }
        return collection;
    }
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
        return patchCollectionUpdate(collection);
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
    if (hasEnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceCollectionWithUpdate) {
        const originalEnhance = global.EnhancedUpdateUtility.enhanceCollectionWithUpdate;
        global.EnhancedUpdateUtility.enhanceCollectionWithUpdate = function(collection) {
            const enhanced = originalEnhance.call(this, collection);
            return patchCollectionUpdate(enhanced);
        };
        console.log("[Indexed Updates] Patched EnhancedUpdateUtility.enhanceCollectionWithUpdate");
    }
    const IndexedUpdates = {
        version: "1.0.0",
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
    console.log("[DOM Helpers] Indexed collection updates loaded - v1.0.0");
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);