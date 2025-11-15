/**
 * Global Collection Shortcuts for DOM Helpers (Enhanced with Index Support)
 * Provides ClassName, TagName, Name globally with index selection
 * 
 * Usage:
 *   ClassName.button              // All buttons
 *   ClassName.button[0]           // First button
 *   ClassName.button[1]           // Second button
 *   ClassName.button[-1]          // Last button
 *   ClassName['container.item'][2] // Third item in container
 * 
 * @version 2.0.0
 * @requires DOM Helpers Library (Collections helper)
 * @license MIT
 */
(function(global) {
    "use strict";
    if (typeof global.Collections === "undefined") {
        console.error("[Global Shortcuts] Collections helper not found. Please load DOM Helpers library first.");
        return;
    }
    function createEnhancedCollectionWrapper(collection) {
        if (!collection) return collection;
        if (collection._isEnhancedWrapper) {
            return collection;
        }
        return new Proxy(collection, {
            get(target, prop) {
                if (!isNaN(prop)) {
                    const index = parseInt(prop);
                    let element;
                    if (index < 0) {
                        const positiveIndex = target.length + index;
                        element = target[positiveIndex];
                    } else {
                        element = target[index];
                    }
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
                            return global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
                        }
                    }
                    return element;
                }
                return target[prop];
            },
            set(target, prop, value) {
                if (!isNaN(prop)) {
                    const index = parseInt(prop);
                    if (index >= 0 && index < target.length) {
                        console.warn("[Global Shortcuts] Cannot set element at index in live collection");
                        return false;
                    }
                }
                try {
                    target[prop] = value;
                    return true;
                } catch (e) {
                    return false;
                }
            }
        });
    }
    function createGlobalCollectionProxy(type) {
        const collectionHelper = global.Collections[type];
        if (!collectionHelper) {
            console.warn(`[Global Shortcuts] Collections.${type} not found`);
            return null;
        }
        const baseFunction = function(value) {
            const collection = collectionHelper(value);
            return createEnhancedCollectionWrapper(collection);
        };
        return new Proxy(baseFunction, {
            get: (target, prop) => {
                if (typeof prop === "symbol" || prop === "constructor" || prop === "prototype" || prop === "apply" || prop === "call" || prop === "bind" || prop === "length" || prop === "name") {
                    return target[prop];
                }
                if (prop === "toString" || prop === "valueOf") {
                    return target[prop];
                }
                const collection = collectionHelper[prop];
                return createEnhancedCollectionWrapper(collection);
            },
            apply: (target, thisArg, args) => {
                const collection = collectionHelper(...args);
                return createEnhancedCollectionWrapper(collection);
            },
            has: (target, prop) => prop in collectionHelper,
            ownKeys: target => Reflect.ownKeys(collectionHelper),
            getOwnPropertyDescriptor: (target, prop) => Reflect.getOwnPropertyDescriptor(collectionHelper, prop)
        });
    }
    const ClassName = createGlobalCollectionProxy("ClassName");
    const TagName = createGlobalCollectionProxy("TagName");
    const Name = createGlobalCollectionProxy("Name");
    if (ClassName) global.ClassName = ClassName;
    if (TagName) global.TagName = TagName;
    if (Name) global.Name = Name;
    if (typeof global.DOMHelpers !== "undefined") {
        if (ClassName) global.DOMHelpers.ClassName = ClassName;
        if (TagName) global.DOMHelpers.TagName = TagName;
        if (Name) global.DOMHelpers.Name = Name;
    }
    const GlobalCollectionShortcuts = {
        ClassName: ClassName,
        TagName: TagName,
        Name: Name,
        version: "2.0.0"
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = GlobalCollectionShortcuts;
    }
    if (typeof define === "function" && define.amd) {
        define([], function() {
            return GlobalCollectionShortcuts;
        });
    }
    global.GlobalCollectionShortcuts = GlobalCollectionShortcuts;
    if (typeof console !== "undefined" && console.log) {
        console.log("[DOM Helpers] Global shortcuts v2.0.0 loaded with index support");
        console.log("[DOM Helpers] Usage: ClassName.button[0], TagName.div[1], Name.username[-1]");
    }
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

/**
 * DOM Helpers - Global Query Functions Enhancement
 * Adds global querySelector and querySelectorAll functions with .update() support
 * 
 * IMPORTANT: Load this AFTER the main DOM helpers bundle!
 * 
 * @version 1.0.1
 * @license MIT
 */
(function(global) {
    "use strict";
    const hasUpdateUtility = typeof global.EnhancedUpdateUtility !== "undefined";
    if (!hasUpdateUtility) {
        console.warn("[Global Query] EnhancedUpdateUtility not found. Load main DOM helpers first!");
    }
    function enhanceElement(element) {
        if (!element || element._hasGlobalQueryUpdate || element._hasEnhancedUpdateMethod) {
            return element;
        }
        if (hasUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
            const enhanced = global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
            try {
                Object.defineProperty(enhanced, "_hasGlobalQueryUpdate", {
                    value: true,
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
            } catch (e) {
                enhanced._hasGlobalQueryUpdate = true;
            }
            return enhanced;
        }
        return element;
    }
    function enhanceNodeList(nodeList, selector) {
        if (!nodeList) {
            return createEmptyCollection();
        }
        if (nodeList._hasGlobalQueryUpdate || nodeList._hasEnhancedUpdateMethod) {
            return nodeList;
        }
        const collection = {
            _originalNodeList: nodeList,
            _selector: selector,
            _cachedAt: Date.now(),
            get length() {
                return nodeList.length;
            },
            item(index) {
                return enhanceElement(nodeList.item(index));
            },
            entries() {
                return nodeList.entries();
            },
            keys() {
                return nodeList.keys();
            },
            values() {
                return nodeList.values();
            },
            toArray() {
                return Array.from(nodeList).map(el => enhanceElement(el));
            },
            forEach(callback, thisArg) {
                Array.from(nodeList).forEach((el, index) => {
                    callback.call(thisArg, enhanceElement(el), index, collection);
                }, thisArg);
            },
            map(callback, thisArg) {
                return Array.from(nodeList).map((el, index) => callback.call(thisArg, enhanceElement(el), index, collection), thisArg);
            },
            filter(callback, thisArg) {
                return Array.from(nodeList).filter((el, index) => callback.call(thisArg, enhanceElement(el), index, collection), thisArg);
            },
            find(callback, thisArg) {
                return Array.from(nodeList).find((el, index) => callback.call(thisArg, enhanceElement(el), index, collection), thisArg);
            },
            some(callback, thisArg) {
                return Array.from(nodeList).some((el, index) => callback.call(thisArg, enhanceElement(el), index, collection), thisArg);
            },
            every(callback, thisArg) {
                return Array.from(nodeList).every((el, index) => callback.call(thisArg, enhanceElement(el), index, collection), thisArg);
            },
            reduce(callback, initialValue) {
                return Array.from(nodeList).reduce((acc, el, index) => callback(acc, enhanceElement(el), index, collection), initialValue);
            },
            first() {
                return nodeList.length > 0 ? enhanceElement(nodeList[0]) : null;
            },
            last() {
                return nodeList.length > 0 ? enhanceElement(nodeList[nodeList.length - 1]) : null;
            },
            at(index) {
                if (index < 0) index = nodeList.length + index;
                return index >= 0 && index < nodeList.length ? enhanceElement(nodeList[index]) : null;
            },
            isEmpty() {
                return nodeList.length === 0;
            },
            addClass(className) {
                this.forEach(el => el.classList.add(className));
                return this;
            },
            removeClass(className) {
                this.forEach(el => el.classList.remove(className));
                return this;
            },
            toggleClass(className) {
                this.forEach(el => el.classList.toggle(className));
                return this;
            },
            setProperty(prop, value) {
                this.forEach(el => el[prop] = value);
                return this;
            },
            setAttribute(attr, value) {
                this.forEach(el => el.setAttribute(attr, value));
                return this;
            },
            setStyle(styles) {
                this.forEach(el => {
                    Object.assign(el.style, styles);
                });
                return this;
            },
            on(event, handler) {
                this.forEach(el => el.addEventListener(event, handler));
                return this;
            },
            off(event, handler) {
                this.forEach(el => el.removeEventListener(event, handler));
                return this;
            }
        };
        for (let i = 0; i < nodeList.length; i++) {
            Object.defineProperty(collection, i, {
                get() {
                    return enhanceElement(nodeList[i]);
                },
                enumerable: true
            });
        }
        collection[Symbol.iterator] = function*() {
            for (let i = 0; i < nodeList.length; i++) {
                yield enhanceElement(nodeList[i]);
            }
        };
        if (hasUpdateUtility && global.EnhancedUpdateUtility.enhanceCollectionWithUpdate) {
            global.EnhancedUpdateUtility.enhanceCollectionWithUpdate(collection);
        }
        try {
            Object.defineProperty(collection, "_hasGlobalQueryUpdate", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (e) {
            collection._hasGlobalQueryUpdate = true;
        }
        return collection;
    }
    function createEmptyCollection() {
        return enhanceNodeList([], "empty");
    }
    function querySelector(selector, context = document) {
        if (typeof selector !== "string") {
            console.warn("[Global Query] querySelector requires a string selector");
            return null;
        }
        try {
            const element = context.querySelector(selector);
            return element ? enhanceElement(element) : null;
        } catch (error) {
            console.warn(`[Global Query] Invalid selector "${selector}": ${error.message}`);
            return null;
        }
    }
    function querySelectorAll(selector, context = document) {
        if (typeof selector !== "string") {
            console.warn("[Global Query] querySelectorAll requires a string selector");
            return createEmptyCollection();
        }
        try {
            const nodeList = context.querySelectorAll(selector);
            return enhanceNodeList(nodeList, selector);
        } catch (error) {
            console.warn(`[Global Query] Invalid selector "${selector}": ${error.message}`);
            return createEmptyCollection();
        }
    }
    const qs = querySelector;
    const qsa = querySelectorAll;
    function queryWithin(container, selector) {
        const containerEl = typeof container === "string" ? document.querySelector(container) : container;
        if (!containerEl) {
            console.warn("[Global Query] Container not found");
            return null;
        }
        return querySelector(selector, containerEl);
    }
    function queryAllWithin(container, selector) {
        const containerEl = typeof container === "string" ? document.querySelector(container) : container;
        if (!containerEl) {
            console.warn("[Global Query] Container not found");
            return createEmptyCollection();
        }
        return querySelectorAll(selector, containerEl);
    }
    global.querySelector = querySelector;
    global.querySelectorAll = querySelectorAll;
    global.qs = qs;
    global.qsa = qsa;
    global.queryWithin = queryWithin;
    global.queryAllWithin = queryAllWithin;
    const GlobalQuery = {
        version: "1.0.1",
        querySelector: querySelector,
        querySelectorAll: querySelectorAll,
        qs: qs,
        qsa: qsa,
        queryWithin: queryWithin,
        queryAllWithin: queryAllWithin,
        enhanceElement: enhanceElement,
        enhanceNodeList: enhanceNodeList
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = GlobalQuery;
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return GlobalQuery;
        });
    } else {
        global.GlobalQuery = GlobalQuery;
    }
    if (typeof global.DOMHelpers !== "undefined") {
        global.DOMHelpers.GlobalQuery = GlobalQuery;
        global.DOMHelpers.querySelector = querySelector;
        global.DOMHelpers.querySelectorAll = querySelectorAll;
        global.DOMHelpers.qs = qs;
        global.DOMHelpers.qsa = qsa;
        global.DOMHelpers.queryWithin = queryWithin;
        global.DOMHelpers.queryAllWithin = queryAllWithin;
    }
    console.log("[DOM Helpers] Global querySelector/querySelectorAll functions loaded");
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

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
 */ (function(global) {
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
                const num = parseInt(key);
                return !isNaN(num);
            });
            if (hasNumericIndices) {
                console.log("[Indexed Updates] Using index-based update mode");
                updateKeys.forEach(key => {
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

(function patchSelectorForBulkUpdates() {
    if (typeof Selector === "undefined" || typeof BulkPropertyUpdaters === "undefined") return;
    const originalQueryAll = Selector.queryAll;
    Selector.queryAll = function(...args) {
        const result = originalQueryAll.apply(this, args);
        return BulkPropertyUpdaters.enhanceCollectionInstance(result);
    };
})();

/**
 * Global Collection Shortcuts - Indexed Updates Integration
 * Adds bulk indexed update support to Global Collection Shortcuts
 * 
 * Enables syntax like:
 *   ClassName.button.update({
 *     [0]: { textContent: 'First', style: { color: 'red' } },
 *     [1]: { textContent: 'Second', style: { color: 'blue' } },
 *     [-1]: { textContent: 'Last', style: { color: 'green' } }
 *   })
 * 
 * IMPORTANT: Load this AFTER:
 *   1. DOM Helpers Library (Collections)
 *   2. Global Collection Shortcuts
 *   3. EnhancedUpdateUtility (main DOM helpers)
 * 
 * @version 1.0.0
 * @license MIT
 */
(function(global) {
    "use strict";
    const hasCollections = typeof global.Collections !== "undefined";
    const hasGlobalShortcuts = typeof global.ClassName !== "undefined" || typeof global.TagName !== "undefined" || typeof global.Name !== "undefined";
    const hasUpdateUtility = typeof global.EnhancedUpdateUtility !== "undefined";
    if (!hasCollections) {
        console.error("[Global Shortcuts Indexed Updates] Collections helper not found. Please load DOM Helpers library first.");
        return;
    }
    if (!hasGlobalShortcuts) {
        console.error("[Global Shortcuts Indexed Updates] Global Collection Shortcuts not found. Please load global-collection-shortcuts.js first.");
        return;
    }
    if (!hasUpdateUtility) {
        console.warn("[Global Shortcuts Indexed Updates] EnhancedUpdateUtility not found. Basic update functionality will be limited.");
    }
    function updateCollectionWithIndices(collection, updates) {
        if (!collection) {
            console.warn("[Global Shortcuts Indexed Updates] .update() called on null collection");
            return collection;
        }
        let elements = [];
        if (collection.length !== undefined) {
            for (let i = 0; i < collection.length; i++) {
                elements.push(collection[i]);
            }
        } else {
            console.warn("[Global Shortcuts Indexed Updates] .update() called on unrecognized collection type");
            return collection;
        }
        if (elements.length === 0) {
            console.info("[Global Shortcuts Indexed Updates] .update() called on empty collection");
            return collection;
        }
        try {
            const updateKeys = Object.keys(updates);
            const hasNumericIndices = updateKeys.some(key => {
                const num = parseInt(key);
                return !isNaN(num) && key === String(num);
            });
            if (hasNumericIndices) {
                console.log("[Global Shortcuts Indexed Updates] Using index-based update mode");
                updateKeys.forEach(key => {
                    const num = parseInt(key);
                    if (!isNaN(num) && key === String(num)) {
                        let index = num;
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
                            console.warn(`[Global Shortcuts Indexed Updates] Element at index ${key} is not a valid DOM element`);
                        } else {
                            console.warn(`[Global Shortcuts Indexed Updates] No element at index ${key} (resolved to ${index}, collection has ${elements.length} elements)`);
                        }
                    }
                });
            } else {
                console.log("[Global Shortcuts Indexed Updates] Using standard update mode (all elements)");
                elements.forEach(element => {
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        applyUpdatesToElement(element, updates);
                    }
                });
            }
        } catch (error) {
            console.error(`[Global Shortcuts Indexed Updates] Error in collection .update(): ${error.message}`);
        }
        return collection;
    }
    function applyUpdatesToElement(element, updates) {
        if (typeof element.update === "function") {
            element.update(updates);
            return;
        }
        if (hasUpdateUtility && global.EnhancedUpdateUtility.applyEnhancedUpdate) {
            Object.entries(updates).forEach(([key, value]) => {
                global.EnhancedUpdateUtility.applyEnhancedUpdate(element, key, value);
            });
            return;
        }
        applyBasicUpdate(element, updates);
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
                        Object.entries(value).forEach(([attr, val]) => {
                            element.setAttribute(attr, val);
                        });
                    }
                    return;
                }
                if (key in element) {
                    element[key] = value;
                } else if (typeof value === "string" || typeof value === "number") {
                    element.setAttribute(key, value);
                }
            } catch (error) {
                console.warn(`[Global Shortcuts Indexed Updates] Failed to apply ${key}:`, error.message);
            }
        });
    }
    function createEnhancedCollectionWithUpdate(collection) {
        if (!collection) return collection;
        if (collection._hasIndexedUpdateSupport) {
            return collection;
        }
        const enhancedCollection = Object.create(null);
        Object.defineProperty(enhancedCollection, "length", {
            get() {
                return collection.length;
            },
            enumerable: false
        });
        for (let i = 0; i < collection.length; i++) {
            Object.defineProperty(enhancedCollection, i, {
                get() {
                    const element = collection[i];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (hasUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
                            return global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
                        }
                    }
                    return element;
                },
                enumerable: true
            });
        }
        Object.defineProperty(enhancedCollection, "update", {
            value: function(updates = {}) {
                return updateCollectionWithIndices(this, updates);
            },
            writable: false,
            enumerable: false,
            configurable: false
        });
        Object.defineProperty(enhancedCollection, "_hasIndexedUpdateSupport", {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
        });
        enhancedCollection[Symbol.iterator] = function*() {
            for (let i = 0; i < collection.length; i++) {
                yield enhancedCollection[i];
            }
        };
        enhancedCollection.forEach = function(callback, thisArg) {
            for (let i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
        enhancedCollection.map = function(callback, thisArg) {
            const result = [];
            for (let i = 0; i < this.length; i++) {
                result.push(callback.call(thisArg, this[i], i, this));
            }
            return result;
        };
        enhancedCollection.filter = function(callback, thisArg) {
            const result = [];
            for (let i = 0; i < this.length; i++) {
                if (callback.call(thisArg, this[i], i, this)) {
                    result.push(this[i]);
                }
            }
            return result;
        };
        return enhancedCollection;
    }
    function patchGlobalShortcut(originalProxy) {
        if (!originalProxy) return originalProxy;
        return new Proxy(originalProxy, {
            get(target, prop) {
                const result = target[prop];
                if (result && typeof result === "object" && "length" in result && !result._hasIndexedUpdateSupport) {
                    return createEnhancedCollectionWithUpdate(result);
                }
                return result;
            },
            apply(target, thisArg, args) {
                const result = Reflect.apply(target, thisArg, args);
                if (result && typeof result === "object" && "length" in result && !result._hasIndexedUpdateSupport) {
                    return createEnhancedCollectionWithUpdate(result);
                }
                return result;
            }
        });
    }
    let patchCount = 0;
    if (global.ClassName) {
        global.ClassName = patchGlobalShortcut(global.ClassName);
        patchCount++;
        console.log("[Global Shortcuts Indexed Updates] ✓ Patched ClassName");
    }
    if (global.TagName) {
        global.TagName = patchGlobalShortcut(global.TagName);
        patchCount++;
        console.log("[Global Shortcuts Indexed Updates] ✓ Patched TagName");
    }
    if (global.Name) {
        global.Name = patchGlobalShortcut(global.Name);
        patchCount++;
        console.log("[Global Shortcuts Indexed Updates] ✓ Patched Name");
    }
    if (typeof global.DOMHelpers !== "undefined") {
        if (global.DOMHelpers.ClassName) {
            global.DOMHelpers.ClassName = global.ClassName;
        }
        if (global.DOMHelpers.TagName) {
            global.DOMHelpers.TagName = global.TagName;
        }
        if (global.DOMHelpers.Name) {
            global.DOMHelpers.Name = global.Name;
        }
    }
    const GlobalShortcutsIndexedUpdates = {
        version: "1.0.0",
        updateCollectionWithIndices: updateCollectionWithIndices,
        createEnhancedCollectionWithUpdate: createEnhancedCollectionWithUpdate,
        patchGlobalShortcut: patchGlobalShortcut,
        hasSupport(collection) {
            return !!(collection && collection._hasIndexedUpdateSupport);
        }
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = GlobalShortcutsIndexedUpdates;
    }
    if (typeof define === "function" && define.amd) {
        define([], function() {
            return GlobalShortcutsIndexedUpdates;
        });
    }
    global.GlobalShortcutsIndexedUpdates = GlobalShortcutsIndexedUpdates;
    if (typeof global.DOMHelpers !== "undefined") {
        global.DOMHelpers.GlobalShortcutsIndexedUpdates = GlobalShortcutsIndexedUpdates;
    }
    console.log(`[Global Shortcuts Indexed Updates] v1.0.0 loaded - ${patchCount} shortcuts patched`);
    console.log("[Global Shortcuts Indexed Updates] Usage: ClassName.button.update({ [0]: {...}, [1]: {...} })");
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

/**
 * DOM Helpers - Index Selection Enhancement v2
 * Adds index-based access and update capabilities
 * 
 * @version 2.0.0
 * @license MIT
 */
(function(global) {
    "use strict";
    if (typeof global.Collections === "undefined" && typeof global.Selector === "undefined") {
        console.warn("[Index Selection] DOM Helpers not found.");
        return;
    }
    function ensureElementHasUpdate(element) {
        if (!element || element._hasUpdateMethod || element._hasEnhancedUpdateMethod) {
            return element;
        }
        if (typeof global.enhanceElementWithUpdate === "function") {
            return global.enhanceElementWithUpdate(element);
        }
        if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
            return global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
        }
        addBasicUpdateMethod(element);
        return element;
    }
    function addBasicUpdateMethod(element) {
        if (!element || element._hasUpdateMethod) return element;
        try {
            Object.defineProperty(element, "update", {
                value: function(updates = {}) {
                    if (!updates || typeof updates !== "object") {
                        console.warn("[Index Selection] .update() requires an object");
                        return element;
                    }
                    Object.entries(updates).forEach(([key, value]) => {
                        try {
                            if (key === "style" && typeof value === "object" && value !== null) {
                                Object.entries(value).forEach(([prop, val]) => {
                                    if (val !== null && val !== undefined) {
                                        element.style[prop] = val;
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

                                      case "replace":
                                        if (classes.length === 2) element.classList.replace(classes[0], classes[1]);
                                        break;
                                    }
                                });
                                return;
                            }
                            if (key === "setAttribute") {
                                if (Array.isArray(value) && value.length >= 2) {
                                    element.setAttribute(value[0], value[1]);
                                } else if (typeof value === "object" && value !== null) {
                                    Object.entries(value).forEach(([attr, val]) => element.setAttribute(attr, val));
                                }
                                return;
                            }
                            if (key === "removeAttribute") {
                                const attrs = Array.isArray(value) ? value : [ value ];
                                attrs.forEach(attr => element.removeAttribute(attr));
                                return;
                            }
                            if (key === "dataset" && typeof value === "object" && value !== null) {
                                Object.entries(value).forEach(([k, v]) => element.dataset[k] = v);
                                return;
                            }
                            if (key === "addEventListener") {
                                if (Array.isArray(value) && value.length >= 2) {
                                    element.addEventListener(value[0], value[1], value[2]);
                                } else if (typeof value === "object" && value !== null) {
                                    Object.entries(value).forEach(([event, handler]) => {
                                        if (typeof handler === "function") {
                                            element.addEventListener(event, handler);
                                        } else if (Array.isArray(handler)) {
                                            element.addEventListener(event, handler[0], handler[1]);
                                        }
                                    });
                                }
                                return;
                            }
                            if (key.startsWith("on") && typeof value === "function") {
                                element[key] = value;
                                return;
                            }
                            if (typeof element[key] === "function") {
                                if (Array.isArray(value)) {
                                    element[key](...value);
                                } else {
                                    element[key](value);
                                }
                                return;
                            }
                            if (key in element) {
                                element[key] = value;
                                return;
                            }
                            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                                element.setAttribute(key, String(value));
                            }
                        } catch (err) {
                            console.warn(`[Index Selection] Failed to apply ${key}:`, err.message);
                        }
                    });
                    return element;
                },
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(element, "_hasUpdateMethod", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (error) {
            element.update = function(updates) {};
            element._hasUpdateMethod = true;
        }
        return element;
    }
    function createEnhancedCollectionProxy(collection) {
        if (!collection) return collection;
        return new Proxy(collection, {
            get(target, prop) {
                if (!isNaN(prop) && parseInt(prop) >= 0) {
                    const index = parseInt(prop);
                    let element;
                    if (target._originalCollection) {
                        element = target._originalCollection[index];
                    } else if (target._originalNodeList) {
                        element = target._originalNodeList[index];
                    } else if (target[index]) {
                        element = target[index];
                    }
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        return ensureElementHasUpdate(element);
                    }
                    return element;
                }
                if (prop === "at" && typeof target.at === "function") {
                    return function(index) {
                        const element = target.at.call(target, index);
                        if (element && element.nodeType === Node.ELEMENT_NODE) {
                            return ensureElementHasUpdate(element);
                        }
                        return element;
                    };
                }
                return target[prop];
            }
        });
    }
    function createIndexAwareUpdate(collection) {
        return function indexAwareUpdate(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[Index Selection] .update() requires an object");
                return collection;
            }
            let elements = [];
            if (collection._originalCollection) {
                elements = Array.from(collection._originalCollection);
            } else if (collection._originalNodeList) {
                elements = Array.from(collection._originalNodeList);
            } else if (collection.length !== undefined) {
                elements = Array.from(collection);
            }
            if (elements.length === 0) {
                console.info("[Index Selection] Collection is empty");
                return collection;
            }
            const length = elements.length;
            const indexUpdates = {};
            const bulkUpdates = {};
            let hasIndexUpdates = false;
            let hasBulkUpdates = false;
            Object.entries(updates).forEach(([key, value]) => {
                if (/^-?\d+$/.test(key)) {
                    indexUpdates[key] = value;
                    hasIndexUpdates = true;
                } else {
                    bulkUpdates[key] = value;
                    hasBulkUpdates = true;
                }
            });
            if (hasBulkUpdates) {
                elements.forEach(element => {
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        const enhanced = ensureElementHasUpdate(element);
                        if (enhanced.update) {
                            enhanced.update(bulkUpdates);
                        }
                    }
                });
            }
            if (hasIndexUpdates) {
                Object.entries(indexUpdates).forEach(([indexStr, updateData]) => {
                    let index = parseInt(indexStr, 10);
                    if (index < 0) index = length + index;
                    if (index >= 0 && index < length) {
                        const element = elements[index];
                        if (element && element.nodeType === Node.ELEMENT_NODE) {
                            const enhanced = ensureElementHasUpdate(element);
                            if (enhanced.update) {
                                enhanced.update(updateData);
                            }
                        }
                    } else {
                        console.warn(`[Index Selection] Index ${indexStr} out of bounds (length: ${length})`);
                    }
                });
            }
            return collection;
        };
    }
    function wrapCollection(collection) {
        if (!collection || collection._indexSelectionEnhanced) {
            return collection;
        }
        const newUpdate = createIndexAwareUpdate(collection);
        try {
            Object.defineProperty(collection, "update", {
                value: newUpdate,
                writable: true,
                enumerable: false,
                configurable: true
            });
        } catch (error) {
            collection.update = newUpdate;
        }
        try {
            Object.defineProperty(collection, "_indexSelectionEnhanced", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (error) {
            collection._indexSelectionEnhanced = true;
        }
        return createEnhancedCollectionProxy(collection);
    }
    function hookCollections() {
        if (!global.Collections || !global.Collections.helper) return;
        const helper = global.Collections.helper;
        if (helper._enhanceCollection) {
            const original = helper._enhanceCollection.bind(helper);
            helper._enhanceCollection = function(htmlCollection, type, value) {
                const collection = original(htmlCollection, type, value);
                return wrapCollection(collection);
            };
        }
        if (helper._enhanceCollectionWithUpdate) {
            const original = helper._enhanceCollectionWithUpdate.bind(helper);
            helper._enhanceCollectionWithUpdate = function(collection) {
                const enhanced = original(collection);
                return wrapCollection(enhanced);
            };
        }
    }
    function hookSelector() {
        if (!global.Selector || !global.Selector.helper) return;
        const helper = global.Selector.helper;
        if (helper._enhanceNodeList) {
            const original = helper._enhanceNodeList.bind(helper);
            helper._enhanceNodeList = function(nodeList, selector) {
                const collection = original(nodeList, selector);
                return wrapCollection(collection);
            };
        }
        if (helper._enhanceCollectionWithUpdate) {
            const original = helper._enhanceCollectionWithUpdate.bind(helper);
            helper._enhanceCollectionWithUpdate = function(collection) {
                const enhanced = original(collection);
                return wrapCollection(enhanced);
            };
        }
    }
    function initialize() {
        try {
            hookCollections();
            hookSelector();
            console.log("[Index Selection] v2.0.0 initialized - Individual element access enhanced");
            return true;
        } catch (error) {
            console.error("[Index Selection] Failed to initialize:", error);
            return false;
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
    const IndexSelection = {
        version: "2.0.0",
        enhance: wrapCollection,
        enhanceElement: ensureElementHasUpdate,
        reinitialize: initialize,
        isEnhanced: collection => collection && collection._indexSelectionEnhanced === true,
        at: (collection, index) => {
            let elements = [];
            if (collection._originalCollection) {
                elements = Array.from(collection._originalCollection);
            } else if (collection._originalNodeList) {
                elements = Array.from(collection._originalNodeList);
            } else if (collection.length !== undefined) {
                elements = Array.from(collection);
            }
            if (index < 0) index = elements.length + index;
            const element = elements[index] || null;
            return element ? ensureElementHasUpdate(element) : null;
        },
        update: (collection, updates) => {
            const enhanced = wrapCollection(collection);
            return enhanced.update(updates);
        }
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = IndexSelection;
    } else if (typeof define === "function" && define.amd) {
        define([], () => IndexSelection);
    } else {
        global.IndexSelection = IndexSelection;
        if (global.DOMHelpers) {
            global.DOMHelpers.IndexSelection = IndexSelection;
        }
    }
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);