/**
 * DOM Helpers - Combined Bundle (Unminified)
 * High-performance vanilla JavaScript DOM utilities with intelligent caching
 *
 * Includes:
 * - Update Utility (Universal .update() method)
 * - Elements Helper (ID-based DOM access)
 * - Collections Helper (Class/Tag/Name-based DOM access)
 * - Selector Helper (querySelector/querySelectorAll with caching)
 *
 * @version 2.3.1
 * @license MIT
 */
(function(global) {
    "use strict";
    const isDevelopment = typeof process !== "undefined" && process.env && process.env.NODE_ENV === "development" || typeof location !== "undefined" && location.hostname === "localhost";
    const DEFAULTS = {
        enableLogging: false,
        enableWarnings: !isDevelopment,
        autoEnhanceCreateElement: true
    };
    function createBatchSetter(propertyName) {
        return function(mapping) {
            if (!mapping || typeof mapping !== "object") {
                console.warn("[DOM Helpers] Invalid mapping object");
                return this;
            }
            Object.entries(mapping).forEach(([key, value]) => {
                let element;
                if (typeof this.Elements !== "undefined") {
                    element = typeof key === "number" ? this.elements?.[key] : document.getElementById(key);
                } else if (this._originalCollection) {
                    const index = parseInt(key, 10);
                    element = this._originalCollection[index];
                } else if (this._originalNodeList) {
                    const index = parseInt(key, 10);
                    element = this._originalNodeList[index];
                }
                if (element && element.nodeType === Node.ELEMENT_NODE) {
                    element[propertyName] = value;
                }
            });
            return this;
        };
    }
    function createComplexBatchSetter(setterFn) {
        return function(mapping) {
            if (!mapping || typeof mapping !== "object") {
                console.warn("[DOM Helpers] Invalid mapping object");
                return this;
            }
            Object.entries(mapping).forEach(([key, values]) => {
                let element;
                if (typeof this.Elements !== "undefined") {
                    element = typeof key === "number" ? this.elements?.[key] : document.getElementById(key);
                } else if (this._originalCollection) {
                    const index = parseInt(key, 10);
                    element = this._originalCollection[index];
                } else if (this._originalNodeList) {
                    const index = parseInt(key, 10);
                    element = this._originalNodeList[index];
                }
                if (element && element.nodeType === Node.ELEMENT_NODE) {
                    setterFn(element, values);
                }
            });
            return this;
        };
    }
    const styleSetter = (el, styles) => {
        Object.entries(styles).forEach(([prop, value]) => {
            if (value !== null && value !== undefined) {
                el.style[prop] = value;
            }
        });
    };
    const datasetSetter = (el, data) => {
        Object.entries(data).forEach(([key, value]) => {
            el.dataset[key] = value;
        });
    };
    const attrsSetter = (el, attributes) => {
        Object.entries(attributes).forEach(([attr, value]) => {
            if (value === null || value === false) {
                el.removeAttribute(attr);
            } else {
                el.setAttribute(attr, String(value));
            }
        });
    };
    const classesSetter = (el, operations) => {
        if (typeof operations === "string") {
            el.className = operations;
        } else if (typeof operations === "object") {
            if (operations.add) {
                const addList = Array.isArray(operations.add) ? operations.add : [ operations.add ];
                el.classList.add(...addList);
            }
            if (operations.remove) {
                const removeList = Array.isArray(operations.remove) ? operations.remove : [ operations.remove ];
                el.classList.remove(...removeList);
            }
            if (operations.toggle) {
                const toggleList = Array.isArray(operations.toggle) ? operations.toggle : [ operations.toggle ];
                toggleList.forEach(cls => el.classList.toggle(cls));
            }
            if (operations.replace && Array.isArray(operations.replace) && operations.replace.length === 2) {
                el.classList.replace(operations.replace[0], operations.replace[1]);
            }
        }
    };
    const elementPreviousProps = new WeakMap;
    const elementEventListeners = new WeakMap;
    function getPreviousProps(element) {
        if (!elementPreviousProps.has(element)) {
            elementPreviousProps.set(element, {});
        }
        return elementPreviousProps.get(element);
    }
    function storePreviousProps(element, key, value) {
        const prevProps = getPreviousProps(element);
        prevProps[key] = value;
    }
    function getElementEventListeners(element) {
        if (!elementEventListeners.has(element)) {
            elementEventListeners.set(element, new Map);
        }
        return elementEventListeners.get(element);
    }
    function isEqual(value1, value2) {
        if (value1 === value2) return true;
        if (value1 == null || value2 == null) return value1 === value2;
        if (typeof value1 !== typeof value2) return false;
        if (typeof value1 === "object") {
            if (Array.isArray(value1) && Array.isArray(value2)) {
                if (value1.length !== value2.length) return false;
                return value1.every((val, idx) => isEqual(val, value2[idx]));
            }
            const keys1 = Object.keys(value1);
            const keys2 = Object.keys(value2);
            if (keys1.length !== keys2.length) return false;
            return keys1.every(key => isEqual(value1[key], value2[key]));
        }
        return false;
    }
    function updateStyleProperties(element, newStyles) {
        const prevProps = getPreviousProps(element);
        const prevStyles = prevProps.style || {};
        Object.entries(newStyles).forEach(([property, newValue]) => {
            if (newValue === null || newValue === undefined) return;
            const currentValue = element.style[property];
            if (currentValue !== newValue && prevStyles[property] !== newValue) {
                element.style[property] = newValue;
                prevStyles[property] = newValue;
            }
        });
        prevProps.style = prevStyles;
    }
    function addEventListenerOnce(element, eventType, handler, options) {
        const listeners = getElementEventListeners(element);
        if (!listeners.has(eventType)) {
            listeners.set(eventType, new Map);
        }
        const handlersForEvent = listeners.get(eventType);
        const handlerKey = handler;
        if (!handlersForEvent.has(handlerKey)) {
            element.addEventListener(eventType, handler, options);
            handlersForEvent.set(handlerKey, {
                handler: handler,
                options: options
            });
        }
    }
    function removeEventListenerIfPresent(element, eventType, handler, options) {
        const listeners = getElementEventListeners(element);
        if (listeners.has(eventType)) {
            const handlersForEvent = listeners.get(eventType);
            const handlerKey = handler;
            if (handlersForEvent.has(handlerKey)) {
                element.removeEventListener(eventType, handler, options);
                handlersForEvent.delete(handlerKey);
                if (handlersForEvent.size === 0) {
                    listeners.delete(eventType);
                }
            }
        }
    }
    function createEnhancedUpdateMethod(context, isCollection = false) {
        return function update(updates = {}) {
            if (!updates || typeof updates !== "object") {
                console.warn("[DOM Helpers] .update() called with invalid updates object");
                return context;
            }
            if (!isCollection) {
                return updateSingleElement(context, updates);
            }
            return updateCollection(context, updates);
        };
    }
    function updateSingleElement(element, updates) {
        if (!element || !element.nodeType) {
            console.warn("[DOM Helpers] .update() called on null or invalid element");
            return element;
        }
        try {
            Object.entries(updates).forEach(([key, value]) => {
                applyEnhancedUpdate(element, key, value);
            });
        } catch (error) {
            console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
        }
        return element;
    }
    function updateCollection(collection, updates) {
        if (!collection) {
            console.warn("[DOM Helpers] .update() called on null collection");
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
            console.warn("[DOM Helpers] .update() called on unrecognized collection type");
            return collection;
        }
        if (elements.length === 0) {
            console.info("[DOM Helpers] .update() called on empty collection");
            return collection;
        }
        try {
            elements.forEach(element => {
                if (element && element.nodeType === Node.ELEMENT_NODE) {
                    Object.entries(updates).forEach(([key, value]) => {
                        applyEnhancedUpdate(element, key, value);
                    });
                }
            });
        } catch (error) {
            console.warn(`[DOM Helpers] Error in collection .update(): ${error.message}`);
        }
        return collection;
    }
    function applyEnhancedUpdate(element, key, value) {
        try {
            const prevProps = getPreviousProps(element);
            if (key === "textContent" || key === "innerText") {
                if (element[key] !== value && prevProps[key] !== value) {
                    element[key] = value;
                    storePreviousProps(element, key, value);
                }
                return;
            }
            if (key === "innerHTML") {
                if (element.innerHTML !== value && prevProps.innerHTML !== value) {
                    element.innerHTML = value;
                    storePreviousProps(element, "innerHTML", value);
                }
                return;
            }
            if (key === "style" && typeof value === "object" && value !== null) {
                updateStyleProperties(element, value);
                return;
            }
            if (key === "classList" && typeof value === "object" && value !== null) {
                handleClassListUpdate(element, value);
                return;
            }
            if (key === "setAttribute") {
                if (Array.isArray(value) && value.length >= 2) {
                    const [attrName, attrValue] = value;
                    const currentValue = element.getAttribute(attrName);
                    if (currentValue !== attrValue) {
                        element.setAttribute(attrName, attrValue);
                    }
                } else if (typeof value === "object" && value !== null) {
                    Object.entries(value).forEach(([attrName, attrValue]) => {
                        const currentValue = element.getAttribute(attrName);
                        if (currentValue !== attrValue) {
                            element.setAttribute(attrName, attrValue);
                        }
                    });
                }
                return;
            }
            if (key === "removeAttribute") {
                if (Array.isArray(value)) {
                    value.forEach(attr => {
                        if (element.hasAttribute(attr)) {
                            element.removeAttribute(attr);
                        }
                    });
                } else if (typeof value === "string") {
                    if (element.hasAttribute(value)) {
                        element.removeAttribute(value);
                    }
                }
                return;
            }
            if (key === "getAttribute" && typeof value === "string") {
                const attrValue = element.getAttribute(value);
                console.log(`[DOM Helpers] getAttribute('${value}'):`, attrValue);
                return;
            }
            if (key === "addEventListener") {
                handleEnhancedEventListenerWithTracking(element, value);
                return;
            }
            if (key === "removeEventListener" && Array.isArray(value) && value.length >= 2) {
                const [eventType, handler, options] = value;
                removeEventListenerIfPresent(element, eventType, handler, options);
                return;
            }
            if (key === "dataset" && typeof value === "object" && value !== null) {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    if (element.dataset[dataKey] !== dataValue) {
                        element.dataset[dataKey] = dataValue;
                    }
                });
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
                if (!isEqual(element[key], value) && !isEqual(prevProps[key], value)) {
                    element[key] = value;
                    storePreviousProps(element, key, value);
                }
                return;
            }
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                const currentValue = element.getAttribute(key);
                const stringValue = String(value);
                if (currentValue !== stringValue) {
                    element.setAttribute(key, stringValue);
                }
                return;
            }
            console.warn(`[DOM Helpers] Unknown property or method: ${key}`);
        } catch (error) {
            console.warn(`[DOM Helpers] Failed to apply update ${key}: ${error.message}`);
        }
    }
    function handleEnhancedEventListener(element, value) {
        if (Array.isArray(value) && value.length >= 2) {
            const [eventType, handler, options] = value;
            const enhancedHandler = createEnhancedEventHandler(handler);
            element.addEventListener(eventType, enhancedHandler, options);
            return;
        }
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            Object.entries(value).forEach(([eventType, handler]) => {
                if (typeof handler === "function") {
                    const enhancedHandler = createEnhancedEventHandler(handler);
                    element.addEventListener(eventType, enhancedHandler);
                } else if (Array.isArray(handler) && handler.length >= 1) {
                    const [handlerFunc, options] = handler;
                    if (typeof handlerFunc === "function") {
                        const enhancedHandler = createEnhancedEventHandler(handlerFunc);
                        element.addEventListener(eventType, enhancedHandler, options);
                    }
                }
            });
            return;
        }
        console.warn("[DOM Helpers] Invalid addEventListener value format");
    }
    function handleEnhancedEventListenerWithTracking(element, value) {
        if (Array.isArray(value) && value.length >= 2) {
            const [eventType, handler, options] = value;
            const enhancedHandler = createEnhancedEventHandler(handler);
            addEventListenerOnce(element, eventType, enhancedHandler, options);
            return;
        }
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            Object.entries(value).forEach(([eventType, handler]) => {
                if (typeof handler === "function") {
                    const enhancedHandler = createEnhancedEventHandler(handler);
                    addEventListenerOnce(element, eventType, enhancedHandler);
                } else if (Array.isArray(handler) && handler.length >= 1) {
                    const [handlerFunc, options] = handler;
                    if (typeof handlerFunc === "function") {
                        const enhancedHandler = createEnhancedEventHandler(handlerFunc);
                        addEventListenerOnce(element, eventType, enhancedHandler, options);
                    }
                }
            });
            return;
        }
        console.warn("[DOM Helpers] Invalid addEventListener value format");
    }
    function createEnhancedEventHandler(originalHandler) {
        return function enhancedEventHandler(event) {
            if (event.target && !event.target.update) {
                enhanceElementWithUpdate(event.target);
            }
            if (this && this.nodeType === Node.ELEMENT_NODE && !this.update) {
                enhanceElementWithUpdate(this);
            }
            return originalHandler.call(this, event);
        };
    }
    function handleClassListUpdate(element, classListUpdates) {
        Object.entries(classListUpdates).forEach(([method, classes]) => {
            try {
                switch (method) {
                  case "add":
                    if (Array.isArray(classes)) {
                        element.classList.add(...classes);
                    } else if (typeof classes === "string") {
                        element.classList.add(classes);
                    }
                    break;

                  case "remove":
                    if (Array.isArray(classes)) {
                        element.classList.remove(...classes);
                    } else if (typeof classes === "string") {
                        element.classList.remove(classes);
                    }
                    break;

                  case "toggle":
                    if (Array.isArray(classes)) {
                        classes.forEach(cls => element.classList.toggle(cls));
                    } else if (typeof classes === "string") {
                        element.classList.toggle(classes);
                    }
                    break;

                  case "replace":
                    if (Array.isArray(classes) && classes.length === 2) {
                        element.classList.replace(classes[0], classes[1]);
                    }
                    break;

                  case "contains":
                    if (Array.isArray(classes)) {
                        classes.forEach(cls => {
                            console.log(`[DOM Helpers] classList.contains('${cls}'):`, element.classList.contains(cls));
                        });
                    } else if (typeof classes === "string") {
                        console.log(`[DOM Helpers] classList.contains('${classes}'):`, element.classList.contains(classes));
                    }
                    break;

                  default:
                    console.warn(`[DOM Helpers] Unknown classList method: ${method}`);
                }
            } catch (error) {
                console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
            }
        });
    }
    function enhanceElementWithUpdate(element) {
        if (!element || element._hasEnhancedUpdateMethod) {
            return element;
        }
        try {
            Object.defineProperty(element, "update", {
                value: createEnhancedUpdateMethod(element, false),
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(element, "_hasEnhancedUpdateMethod", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (error) {
            element.update = createEnhancedUpdateMethod(element, false);
            element._hasEnhancedUpdateMethod = true;
        }
        return element;
    }
    function enhanceCollectionWithUpdate(collection) {
        if (!collection || collection._hasEnhancedUpdateMethod) {
            return collection;
        }
        try {
            Object.defineProperty(collection, "update", {
                value: createEnhancedUpdateMethod(collection, true),
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(collection, "_hasEnhancedUpdateMethod", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (error) {
            collection.update = createEnhancedUpdateMethod(collection, true);
            collection._hasEnhancedUpdateMethod = true;
        }
        return collection;
    }
    function isCollection(obj) {
        return obj && (obj.length !== undefined || obj._originalCollection || obj._originalNodeList || obj instanceof NodeList || obj instanceof HTMLCollection);
    }
    function autoEnhanceWithUpdate(obj) {
        if (!obj) return obj;
        if (isCollection(obj)) {
            return enhanceCollectionWithUpdate(obj);
        } else if (obj.nodeType === Node.ELEMENT_NODE) {
            return enhanceElementWithUpdate(obj);
        }
        return obj;
    }
    function createUpdateExample() {
        return {
            textContent: "Enhanced Button",
            innerHTML: "<strong>Enhanced</strong> Button",
            id: "myEnhancedButton",
            className: "btn btn-primary",
            style: {
                color: "white",
                backgroundColor: "#007bff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px"
            },
            classList: {
                add: [ "fancy", "highlight" ],
                remove: [ "old-class" ],
                toggle: "active",
                replace: [ "btn-old", "btn-new" ]
            },
            setAttribute: [ "data-role", "button" ],
            removeAttribute: "disabled",
            dataset: {
                userId: "123",
                action: "submit"
            },
            addEventListener: [ "click", e => {
                console.log("Button clicked!", e);
                e.target.classList.toggle("clicked");
            } ],
            focus: [],
            scrollIntoView: [ {
                behavior: "smooth"
            } ]
        };
    }
    const EnhancedUpdateUtility = {
        createEnhancedUpdateMethod: createEnhancedUpdateMethod,
        enhanceElementWithUpdate: enhanceElementWithUpdate,
        enhanceCollectionWithUpdate: enhanceCollectionWithUpdate,
        autoEnhanceWithUpdate: autoEnhanceWithUpdate,
        isCollection: isCollection,
        updateSingleElement: updateSingleElement,
        updateCollection: updateCollection,
        applyEnhancedUpdate: applyEnhancedUpdate,
        handleClassListUpdate: handleClassListUpdate,
        createUpdateExample: createUpdateExample
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = EnhancedUpdateUtility;
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return EnhancedUpdateUtility;
        });
    } else {
        global.EnhancedUpdateUtility = EnhancedUpdateUtility;
    }
    let UpdateUtility;
    if (typeof require !== "undefined") {
        try {
            UpdateUtility = require("./update-utility.js");
        } catch (e) {}
    } else if (typeof global !== "undefined" && global.UpdateUtility) {
        UpdateUtility = global.UpdateUtility;
    }
    class ProductionElementsHelper {
        constructor(options = {}) {
            this.cache = new Map;
            this.weakCache = new WeakMap;
            this.options = {
                enableLogging: options.enableLogging ?? false,
                autoCleanup: options.autoCleanup ?? true,
                cleanupInterval: options.cleanupInterval ?? 3e4,
                maxCacheSize: options.maxCacheSize ?? 1e3,
                debounceDelay: options.debounceDelay ?? 16,
                ...options
            };
            this.stats = {
                hits: 0,
                misses: 0,
                cacheSize: 0,
                lastCleanup: Date.now()
            };
            this.pendingUpdates = new Set;
            this.cleanupTimer = null;
            this.isDestroyed = false;
            this._initProxy();
            this._initMutationObserver();
            this._scheduleCleanup();
        }
        _initProxy() {
            this.Elements = new Proxy(this, {
                get: (target, prop) => {
                    if (typeof prop === "symbol" || prop.startsWith("_") || typeof target[prop] === "function") {
                        return target[prop];
                    }
                    return target._getElement(prop);
                },
                has: (target, prop) => target._hasElement(prop),
                ownKeys: target => target._getKeys(),
                getOwnPropertyDescriptor: (target, prop) => {
                    if (target._hasElement(prop)) {
                        return {
                            enumerable: true,
                            configurable: true,
                            value: target._getElement(prop)
                        };
                    }
                    return undefined;
                }
            });
        }
        _getElement(prop) {
            if (typeof prop !== "string") {
                this._warn(`Invalid element property type: ${typeof prop}`);
                return null;
            }
            if (this.cache.has(prop)) {
                const element = this.cache.get(prop);
                if (element && element.nodeType === Node.ELEMENT_NODE && document.contains(element)) {
                    this.stats.hits++;
                    return this._enhanceElementWithUpdate(element);
                } else {
                    this.cache.delete(prop);
                }
            }
            const element = document.getElementById(prop);
            if (element) {
                this._addToCache(prop, element);
                this.stats.misses++;
                return this._enhanceElementWithUpdate(element);
            }
            this.stats.misses++;
            if (this.options.enableLogging) {
                this._warn(`Element with id '${prop}' not found`);
            }
            return null;
        }
        _hasElement(prop) {
            if (typeof prop !== "string") return false;
            if (this.cache.has(prop)) {
                const element = this.cache.get(prop);
                if (element && element.nodeType === Node.ELEMENT_NODE && document.contains(element)) {
                    return true;
                }
                this.cache.delete(prop);
            }
            return !!document.getElementById(prop);
        }
        _getKeys() {
            const elements = document.querySelectorAll("[id]");
            return Array.from(elements).map(el => el.id).filter(id => id);
        }
        _addToCache(id, element) {
            if (this.cache.size >= this.options.maxCacheSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            this.cache.set(id, element);
            this.stats.cacheSize = this.cache.size;
            this.weakCache.set(element, {
                id: id,
                cachedAt: Date.now(),
                accessCount: 1
            });
        }
        _initMutationObserver() {
            const debouncedUpdate = this._debounce(mutations => {
                this._processMutations(mutations);
            }, this.options.debounceDelay);
            this.observer = new MutationObserver(debouncedUpdate);
            if (document.body) {
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: [ "id" ],
                    attributeOldValue: true
                });
            } else {
                document.addEventListener("DOMContentLoaded", () => {
                    if (document.body && !this.isDestroyed) {
                        this.observer.observe(document.body, {
                            childList: true,
                            subtree: true,
                            attributes: true,
                            attributeFilter: [ "id" ],
                            attributeOldValue: true
                        });
                    }
                });
            }
        }
        _processMutations(mutations) {
            if (this.isDestroyed) return;
            const addedIds = new Set;
            const removedIds = new Set;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.id) addedIds.add(node.id);
                        try {
                            const childrenWithIds = node.querySelectorAll ? node.querySelectorAll("[id]") : [];
                            childrenWithIds.forEach(child => {
                                if (child.id) addedIds.add(child.id);
                            });
                        } catch (e) {}
                    }
                });
                mutation.removedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.id) removedIds.add(node.id);
                        try {
                            const childrenWithIds = node.querySelectorAll ? node.querySelectorAll("[id]") : [];
                            childrenWithIds.forEach(child => {
                                if (child.id) removedIds.add(child.id);
                            });
                        } catch (e) {}
                    }
                });
                if (mutation.type === "attributes" && mutation.attributeName === "id") {
                    const oldId = mutation.oldValue;
                    const newId = mutation.target.id;
                    if (oldId && oldId !== newId) {
                        removedIds.add(oldId);
                    }
                    if (newId && newId !== oldId) {
                        addedIds.add(newId);
                    }
                }
            });
            addedIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    this._addToCache(id, element);
                }
            });
            removedIds.forEach(id => {
                this.cache.delete(id);
            });
            this.stats.cacheSize = this.cache.size;
        }
        _scheduleCleanup() {
            if (!this.options.autoCleanup || this.isDestroyed) return;
            this.cleanupTimer = setTimeout(() => {
                this._performCleanup();
                this._scheduleCleanup();
            }, this.options.cleanupInterval);
        }
        _performCleanup() {
            if (this.isDestroyed) return;
            const beforeSize = this.cache.size;
            const staleIds = [];
            for (const [id, element] of this.cache) {
                if (!element || element.nodeType !== Node.ELEMENT_NODE || !document.contains(element) || element.id !== id) {
                    staleIds.push(id);
                }
            }
            staleIds.forEach(id => this.cache.delete(id));
            this.stats.cacheSize = this.cache.size;
            this.stats.lastCleanup = Date.now();
            if (this.options.enableLogging && staleIds.length > 0) {
                this._log(`Cleanup completed. Removed ${staleIds.length} stale entries.`);
            }
        }
        _debounce(func, delay) {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        }
        _log(message) {
            if (this.options.enableLogging) {
                console.log(`[Elements] ${message}`);
            }
        }
        _warn(message) {
            if (this.options.enableLogging) {
                console.warn(`[Elements] ${message}`);
            }
        }
        _enhanceElementWithUpdate(element) {
            if (!element || element._hasUpdateMethod) {
                return element;
            }
            if (EnhancedUpdateUtility && EnhancedUpdateUtility.enhanceElementWithUpdate) {
                return EnhancedUpdateUtility.enhanceElementWithUpdate(element);
            }
            try {
                Object.defineProperty(element, "update", {
                    value: (updates = {}) => {
                        if (!updates || typeof updates !== "object") {
                            console.warn("[DOM Helpers] .update() called with invalid updates object");
                            return element;
                        }
                        try {
                            Object.entries(updates).forEach(([key, value]) => {
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
                                        try {
                                            switch (method) {
                                              case "add":
                                                if (Array.isArray(classes)) {
                                                    element.classList.add(...classes);
                                                } else if (typeof classes === "string") {
                                                    element.classList.add(classes);
                                                }
                                                break;

                                              case "remove":
                                                if (Array.isArray(classes)) {
                                                    element.classList.remove(...classes);
                                                } else if (typeof classes === "string") {
                                                    element.classList.remove(classes);
                                                }
                                                break;

                                              case "toggle":
                                                if (Array.isArray(classes)) {
                                                    classes.forEach(cls => element.classList.toggle(cls));
                                                } else if (typeof classes === "string") {
                                                    element.classList.toggle(classes);
                                                }
                                                break;

                                              case "replace":
                                                if (Array.isArray(classes) && classes.length === 2) {
                                                    element.classList.replace(classes[0], classes[1]);
                                                }
                                                break;
                                            }
                                        } catch (error) {
                                            console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
                                        }
                                    });
                                    return;
                                }
                                if (key === "setAttribute") {
                                    if (Array.isArray(value) && value.length >= 2) {
                                        element.setAttribute(value[0], value[1]);
                                    } else if (typeof value === "object" && value !== null) {
                                        Object.entries(value).forEach(([attrName, attrValue]) => {
                                            element.setAttribute(attrName, attrValue);
                                        });
                                    }
                                    return;
                                }
                                if (key === "removeAttribute") {
                                    if (Array.isArray(value)) {
                                        value.forEach(attr => element.removeAttribute(attr));
                                    } else if (typeof value === "string") {
                                        element.removeAttribute(value);
                                    }
                                    return;
                                }
                                if (key === "dataset" && typeof value === "object" && value !== null) {
                                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                                        element.dataset[dataKey] = dataValue;
                                    });
                                    return;
                                }
                                if (key === "addEventListener") {
                                    handleEnhancedEventListener(element, value);
                                    return;
                                }
                                if (key === "removeEventListener" && Array.isArray(value) && value.length >= 2) {
                                    const [eventType, handler, options] = value;
                                    element.removeEventListener(eventType, handler, options);
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
                                    element.setAttribute(key, value);
                                }
                            });
                        } catch (error) {
                            console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
                        }
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
                element.update = (updates = {}) => {
                    if (!updates || typeof updates !== "object") {
                        console.warn("[DOM Helpers] .update() called with invalid updates object");
                        return element;
                    }
                    try {
                        Object.entries(updates).forEach(([key, value]) => {
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
                                    try {
                                        switch (method) {
                                          case "add":
                                            if (Array.isArray(classes)) {
                                                element.classList.add(...classes);
                                            } else if (typeof classes === "string") {
                                                element.classList.add(classes);
                                            }
                                            break;

                                          case "remove":
                                            if (Array.isArray(classes)) {
                                                element.classList.remove(...classes);
                                            } else if (typeof classes === "string") {
                                                element.classList.remove(classes);
                                            }
                                            break;

                                          case "toggle":
                                            if (Array.isArray(classes)) {
                                                classes.forEach(cls => element.classList.toggle(cls));
                                            } else if (typeof classes === "string") {
                                                element.classList.toggle(classes);
                                            }
                                            break;

                                          case "replace":
                                            if (Array.isArray(classes) && classes.length === 2) {
                                                element.classList.replace(classes[0], classes[1]);
                                            }
                                            break;
                                        }
                                    } catch (error) {
                                        console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
                                    }
                                });
                                return;
                            }
                            if (key === "setAttribute") {
                                if (Array.isArray(value) && value.length >= 2) {
                                    element.setAttribute(value[0], value[1]);
                                } else if (typeof value === "object" && value !== null) {
                                    Object.entries(value).forEach(([attrName, attrValue]) => {
                                        element.setAttribute(attrName, attrValue);
                                    });
                                }
                                return;
                            }
                            if (key === "addEventListener") {
                                handleEnhancedEventListener(element, value);
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
                                element.setAttribute(key, value);
                            }
                        });
                    } catch (error) {
                        console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
                    }
                    return element;
                };
                element._hasUpdateMethod = true;
            }
            return element;
        }
        getStats() {
            return {
                ...this.stats,
                hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
                uptime: Date.now() - this.stats.lastCleanup
            };
        }
        clearCache() {
            this.cache.clear();
            this.stats.cacheSize = 0;
            this._log("Cache cleared manually");
        }
        destroy() {
            this.isDestroyed = true;
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.cleanupTimer) {
                clearTimeout(this.cleanupTimer);
                this.cleanupTimer = null;
            }
            this.cache.clear();
            this._log("Elements helper destroyed");
        }
        isCached(id) {
            return this.cache.has(id);
        }
        getCacheSnapshot() {
            return Array.from(this.cache.keys());
        }
        destructure(...ids) {
            const result = {};
            const missing = [];
            ids.forEach(id => {
                const element = this.Elements[id];
                if (element) {
                    result[id] = element;
                } else {
                    missing.push(id);
                    result[id] = null;
                }
            });
            if (missing.length > 0 && this.options.enableLogging) {
                this._warn(`Missing elements during destructuring: ${missing.join(", ")}`);
            }
            return result;
        }
        getRequired(...ids) {
            const elements = this.destructure(...ids);
            const missing = ids.filter(id => !elements[id]);
            if (missing.length > 0) {
                throw new Error(`Required elements not found: ${missing.join(", ")}`);
            }
            return elements;
        }
        async waitFor(...ids) {
            const maxWait = 5e3;
            const checkInterval = 100;
            const startTime = Date.now();
            while (Date.now() - startTime < maxWait) {
                const elements = this.destructure(...ids);
                const allFound = ids.every(id => elements[id]);
                if (allFound) {
                    return elements;
                }
                await new Promise(resolve => setTimeout(resolve, checkInterval));
            }
            throw new Error(`Timeout waiting for elements: ${ids.join(", ")}`);
        }
        get(id, fallback = null) {
            const element = this._getElement(id);
            return element || fallback;
        }
        exists(id) {
            return !!this._getElement(id);
        }
        getMultiple(...ids) {
            return this.destructure(...ids);
        }
        destructure(...ids) {
            const result = {};
            const missing = [];
            ids.forEach(id => {
                const element = this.Elements[id];
                if (element) {
                    result[id] = element;
                } else {
                    missing.push(id);
                    result[id] = null;
                }
            });
            if (missing.length > 0 && this.options.enableLogging) {
                this._warn(`Missing elements during destructuring: ${missing.join(", ")}`);
            }
            return result;
        }
        destructure(...ids) {
            const result = {};
            const missing = [];
            ids.forEach(id => {
                const element = this._getElement(id);
                if (element) {
                    result[id] = element;
                } else {
                    missing.push(id);
                    result[id] = null;
                }
            });
            if (missing.length > 0 && this.options.enableLogging) {
                this._warn(`Missing elements during destructuring: ${missing.join(", ")}`);
            }
            return result;
        }
        setProperty(id, property, value) {
            const element = this.Elements[id];
            if (element && property in element) {
                element[property] = value;
                return true;
            }
            return false;
        }
        getProperty(id, property, fallback = undefined) {
            const element = this.Elements[id];
            if (element && property in element) {
                return element[property];
            }
            return fallback;
        }
        setAttribute(id, attribute, value) {
            const element = this.Elements[id];
            if (element) {
                element.setAttribute(attribute, value);
                return true;
            }
            return false;
        }
        getAttribute(id, attribute, fallback = null) {
            const element = this.Elements[id];
            if (element) {
                return element.getAttribute(attribute) || fallback;
            }
            return fallback;
        }
    }
    const ElementsHelper = new ProductionElementsHelper({
        enableLogging: false,
        autoCleanup: true,
        cleanupInterval: 3e4,
        maxCacheSize: 1e3
    });
    const Elements = ElementsHelper.Elements;
    Elements.helper = ElementsHelper;
    Elements.stats = () => ElementsHelper.getStats();
    Elements.clear = () => ElementsHelper.clearCache();
    Elements.destroy = () => ElementsHelper.destroy();
    Elements.destructure = (...ids) => {
        const obj = {};
        ids.forEach(id => {
            obj[id] = document.getElementById(id);
        });
        return obj;
    };
    Elements.getRequired = (...ids) => {
        const elements = Elements.destructure(...ids);
        const missing = ids.filter(id => !elements[id]);
        if (missing.length > 0) {
            throw new Error(`Required elements not found: ${missing.join(", ")}`);
        }
        return elements;
    };
    Elements.waitFor = async (...ids) => {
        const maxWait = 5e3;
        const checkInterval = 100;
        const startTime = Date.now();
        while (Date.now() - startTime < maxWait) {
            const elements = Elements.destructure(...ids);
            const allFound = ids.every(id => elements[id]);
            if (allFound) {
                return elements;
            }
            await new Promise(resolve => setTimeout(resolve, checkInterval));
        }
        throw new Error(`Timeout waiting for elements: ${ids.join(", ")}`);
    };
    Elements.isCached = id => ElementsHelper.cache.has(id);
    Elements.get = (id, fallback = null) => document.getElementById(id) || fallback;
    Elements.exists = id => !!document.getElementById(id);
    Elements.getMultiple = (...ids) => {
        const obj = {};
        ids.forEach(id => {
            obj[id] = document.getElementById(id);
        });
        return obj;
    };
    Elements.setProperty = (id, property, value) => ElementsHelper.setProperty(id, property, value);
    Elements.getProperty = (id, property, fallback) => ElementsHelper.getProperty(id, property, fallback);
    Elements.setAttribute = (id, attribute, value) => ElementsHelper.setAttribute(id, attribute, value);
    Elements.getAttribute = (id, attribute, fallback) => ElementsHelper.getAttribute(id, attribute, fallback);
    Elements.configure = options => {
        Object.assign(ElementsHelper.options, options);
        return Elements;
    };
    Elements.textContent = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.textContent() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
        return Elements;
    };
    Elements.innerHTML = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.innerHTML() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.innerHTML = value;
        });
        return Elements;
    };
    Elements.value = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.value() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });
        return Elements;
    };
    Elements.className = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.className() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.className = value;
        });
        return Elements;
    };
    Elements.disabled = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.disabled() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.disabled = value;
        });
        return Elements;
    };
    Elements.checked = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.checked() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.checked = value;
        });
        return Elements;
    };
    Elements.placeholder = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.placeholder() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.placeholder = value;
        });
        return Elements;
    };
    Elements.href = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.href() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.href = value;
        });
        return Elements;
    };
    Elements.src = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.src() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.src = value;
        });
        return Elements;
    };
    Elements.alt = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.alt() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.alt = value;
        });
        return Elements;
    };
    Elements.title = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.title() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.title = value;
        });
        return Elements;
    };
    Elements.style = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.style() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, styles]) => {
            const element = document.getElementById(id);
            if (element && typeof styles === "object") {
                styleSetter(element, styles);
            }
        });
        return Elements;
    };
    Elements.dataset = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.dataset() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, data]) => {
            const element = document.getElementById(id);
            if (element && typeof data === "object") {
                datasetSetter(element, data);
            }
        });
        return Elements;
    };
    Elements.attrs = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.attrs() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, attributes]) => {
            const element = document.getElementById(id);
            if (element && typeof attributes === "object") {
                attrsSetter(element, attributes);
            }
        });
        return Elements;
    };
    Elements.classes = function(mapping) {
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.classes() requires an object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, operations]) => {
            const element = document.getElementById(id);
            if (element) {
                classesSetter(element, operations);
            }
        });
        return Elements;
    };
    Elements.prop = function(propertyName, mapping) {
        if (!propertyName || typeof propertyName !== "string") {
            console.warn("[DOM Helpers] Elements.prop() requires a property name");
            return Elements;
        }
        if (!mapping || typeof mapping !== "object") {
            console.warn("[DOM Helpers] Elements.prop() requires a mapping object");
            return Elements;
        }
        Object.entries(mapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (!element) return;
            const props = propertyName.split(".");
            let target = element;
            for (let i = 0; i < props.length - 1; i++) {
                target = target[props[i]];
                if (!target) return;
            }
            const finalProp = props[props.length - 1];
            const targetProp = target[finalProp];
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                if (typeof targetProp === "object" && targetProp !== null) {
                    Object.entries(value).forEach(([k, v]) => {
                        targetProp[k] = v;
                    });
                } else {
                    target[finalProp] = value;
                }
            } else {
                target[finalProp] = value;
            }
        });
        return Elements;
    };
    Elements.update = (updates = {}) => {
        if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
            console.warn("[DOM Helpers] Elements.update() requires an object with element IDs as keys");
            return {};
        }
        const results = {};
        const successful = [];
        const failed = [];
        Object.entries(updates).forEach(([elementId, updateData]) => {
            try {
                const element = Elements[elementId];
                if (element && element.nodeType === Node.ELEMENT_NODE) {
                    if (typeof element.update === "function") {
                        element.update(updateData);
                        results[elementId] = {
                            success: true,
                            element: element
                        };
                        successful.push(elementId);
                    } else {
                        Object.entries(updateData).forEach(([key, value]) => {
                            applyEnhancedUpdate(element, key, value);
                        });
                        results[elementId] = {
                            success: true,
                            element: element
                        };
                        successful.push(elementId);
                    }
                } else {
                    results[elementId] = {
                        success: false,
                        error: `Element with ID '${elementId}' not found`
                    };
                    failed.push(elementId);
                }
            } catch (error) {
                results[elementId] = {
                    success: false,
                    error: error.message
                };
                failed.push(elementId);
            }
        });
        if (ElementsHelper.options.enableLogging) {
            console.log(`[Elements] Bulk update completed: ${successful.length} successful, ${failed.length} failed`);
            if (failed.length > 0) {
                console.warn(`[Elements] Failed IDs:`, failed);
            }
        }
        return results;
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            Elements: Elements,
            ProductionElementsHelper: ProductionElementsHelper
        };
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return {
                Elements: Elements,
                ProductionElementsHelper: ProductionElementsHelper
            };
        });
    } else {
        global.Elements = Elements;
        global.ProductionElementsHelper = ProductionElementsHelper;
    }
    if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", () => {
            ElementsHelper.destroy();
        });
    }
    class ProductionCollectionHelper {
        constructor(options = {}) {
            this.cache = new Map;
            this.weakCache = new WeakMap;
            this.options = {
                enableLogging: options.enableLogging ?? false,
                autoCleanup: options.autoCleanup ?? true,
                cleanupInterval: options.cleanupInterval ?? 3e4,
                maxCacheSize: options.maxCacheSize ?? 1e3,
                debounceDelay: options.debounceDelay ?? 16,
                enableEnhancedSyntax: options.enableEnhancedSyntax ?? true,
                ...options
            };
            this.stats = {
                hits: 0,
                misses: 0,
                cacheSize: 0,
                lastCleanup: Date.now()
            };
            this.pendingUpdates = new Set;
            this.cleanupTimer = null;
            this.isDestroyed = false;
            this._initProxies();
            this._initMutationObserver();
            this._scheduleCleanup();
        }
        _initProxies() {
            this.ClassName = this._createCollectionProxy("className");
            this.TagName = this._createCollectionProxy("tagName");
            this.Name = this._createCollectionProxy("name");
        }
        _createCollectionProxy(type) {
            const baseFunction = value => {
                const collection = this._getCollection(type, value);
                if (this.options.enableEnhancedSyntax) {
                    return this._createEnhancedCollectionProxy(collection);
                }
                return collection;
            };
            return new Proxy(baseFunction, {
                get: (target, prop) => {
                    if (typeof prop === "symbol" || prop === "constructor" || prop === "prototype" || prop === "apply" || prop === "call" || prop === "bind" || typeof target[prop] === "function") {
                        return target[prop];
                    }
                    const collection = this._getCollection(type, prop);
                    if (this.options.enableEnhancedSyntax) {
                        return this._createEnhancedCollectionProxy(collection);
                    }
                    return collection;
                },
                apply: (target, thisArg, args) => {
                    if (args.length > 0) {
                        return target(args[0]);
                    }
                    return this._createEmptyCollection();
                }
            });
        }
        _createEnhancedCollectionProxy(collection) {
            if (!collection || !this.options.enableEnhancedSyntax) return collection;
            return new Proxy(collection, {
                get: (target, prop) => {
                    if (!isNaN(prop) && parseInt(prop) >= 0) {
                        const index = parseInt(prop);
                        const element = target[index];
                        if (element) {
                            return this._createElementProxy(element);
                        }
                        return element;
                    }
                    return target[prop];
                },
                set: (target, prop, value) => {
                    try {
                        target[prop] = value;
                        return true;
                    } catch (e) {
                        this._warn(`Failed to set collection property ${prop}: ${e.message}`);
                        return false;
                    }
                }
            });
        }
        _createElementProxy(element) {
            if (!element || !this.options.enableEnhancedSyntax) return element;
            return new Proxy(element, {
                get: (target, prop) => target[prop],
                set: (target, prop, value) => {
                    try {
                        target[prop] = value;
                        return true;
                    } catch (e) {
                        this._warn(`Failed to set element property ${prop}: ${e.message}`);
                        return false;
                    }
                }
            });
        }
        _createCacheKey(type, value) {
            return `${type}:${value}`;
        }
        _getCollection(type, value) {
            if (typeof value !== "string") {
                this._warn(`Invalid ${type} property type: ${typeof value}`);
                return this._createEmptyCollection();
            }
            const cacheKey = this._createCacheKey(type, value);
            if (this.cache.has(cacheKey)) {
                const cachedCollection = this.cache.get(cacheKey);
                if (this._isValidCollection(cachedCollection)) {
                    this.stats.hits++;
                    return cachedCollection;
                } else {
                    this.cache.delete(cacheKey);
                }
            }
            let htmlCollection;
            try {
                switch (type) {
                  case "className":
                    htmlCollection = document.getElementsByClassName(value);
                    break;

                  case "tagName":
                    htmlCollection = document.getElementsByTagName(value);
                    break;

                  case "name":
                    htmlCollection = document.getElementsByName(value);
                    break;

                  default:
                    this._warn(`Unknown collection type: ${type}`);
                    return this._createEmptyCollection();
                }
            } catch (error) {
                this._warn(`Error getting ${type} collection for "${value}": ${error.message}`);
                return this._createEmptyCollection();
            }
            const collection = this._enhanceCollection(htmlCollection, type, value);
            this._addToCache(cacheKey, collection);
            this.stats.misses++;
            return collection;
        }
        _isValidCollection(collection) {
            if (!collection || !collection._originalCollection) return false;
            const live = collection._originalCollection;
            if (live.length === 0) return true;
            const firstElement = live[0];
            return firstElement && firstElement.nodeType === Node.ELEMENT_NODE && document.contains(firstElement);
        }
        _enhanceCollection(htmlCollection, type, value) {
            const collection = {
                _originalCollection: htmlCollection,
                _type: type,
                _value: value,
                _cachedAt: Date.now(),
                get length() {
                    return htmlCollection.length;
                },
                item(index) {
                    return htmlCollection.item(index);
                },
                namedItem(name) {
                    return htmlCollection.namedItem ? htmlCollection.namedItem(name) : null;
                },
                toArray() {
                    return Array.from(htmlCollection);
                },
                forEach(callback, thisArg) {
                    Array.from(htmlCollection).forEach(callback, thisArg);
                },
                map(callback, thisArg) {
                    return Array.from(htmlCollection).map(callback, thisArg);
                },
                filter(callback, thisArg) {
                    return Array.from(htmlCollection).filter(callback, thisArg);
                },
                find(callback, thisArg) {
                    return Array.from(htmlCollection).find(callback, thisArg);
                },
                some(callback, thisArg) {
                    return Array.from(htmlCollection).some(callback, thisArg);
                },
                every(callback, thisArg) {
                    return Array.from(htmlCollection).every(callback, thisArg);
                },
                reduce(callback, initialValue) {
                    return Array.from(htmlCollection).reduce(callback, initialValue);
                },
                first() {
                    return htmlCollection.length > 0 ? htmlCollection[0] : null;
                },
                last() {
                    return htmlCollection.length > 0 ? htmlCollection[htmlCollection.length - 1] : null;
                },
                at(index) {
                    if (index < 0) index = htmlCollection.length + index;
                    return index >= 0 && index < htmlCollection.length ? htmlCollection[index] : null;
                },
                isEmpty() {
                    return htmlCollection.length === 0;
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
                },
                visible() {
                    return this.filter(el => {
                        const style = window.getComputedStyle(el);
                        return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
                    });
                },
                hidden() {
                    return this.filter(el => {
                        const style = window.getComputedStyle(el);
                        return style.display === "none" || style.visibility === "hidden" || style.opacity === "0";
                    });
                },
                enabled() {
                    return this.filter(el => !el.disabled && !el.hasAttribute("disabled"));
                },
                disabled() {
                    return this.filter(el => el.disabled || el.hasAttribute("disabled"));
                }
            };
            for (let i = 0; i < htmlCollection.length; i++) {
                Object.defineProperty(collection, i, {
                    get() {
                        return htmlCollection[i];
                    },
                    enumerable: true
                });
            }
            collection[Symbol.iterator] = function*() {
                for (let i = 0; i < htmlCollection.length; i++) {
                    yield htmlCollection[i];
                }
            };
            return this._enhanceCollectionWithUpdate(collection);
        }
        _createEmptyCollection() {
            const emptyCollection = {
                length: 0,
                item: () => null,
                namedItem: () => null
            };
            return this._enhanceCollection(emptyCollection, "empty", "");
        }
        _addToCache(cacheKey, collection) {
            if (this.cache.size >= this.options.maxCacheSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            this.cache.set(cacheKey, collection);
            this.stats.cacheSize = this.cache.size;
            this.weakCache.set(collection, {
                cacheKey: cacheKey,
                cachedAt: Date.now(),
                accessCount: 1
            });
        }
        _initMutationObserver() {
            const debouncedUpdate = this._debounce(mutations => {
                this._processMutations(mutations);
            }, this.options.debounceDelay);
            this.observer = new MutationObserver(debouncedUpdate);
            if (document.body) {
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: [ "class", "name" ],
                    attributeOldValue: true
                });
            } else {
                document.addEventListener("DOMContentLoaded", () => {
                    if (document.body && !this.isDestroyed) {
                        this.observer.observe(document.body, {
                            childList: true,
                            subtree: true,
                            attributes: true,
                            attributeFilter: [ "class", "name" ],
                            attributeOldValue: true
                        });
                    }
                });
            }
        }
        _processMutations(mutations) {
            if (this.isDestroyed) return;
            const affectedClasses = new Set;
            const affectedNames = new Set;
            const affectedTags = new Set;
            mutations.forEach(mutation => {
                [ ...mutation.addedNodes, ...mutation.removedNodes ].forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.className) {
                            node.className.split(/\s+/).forEach(cls => {
                                if (cls) affectedClasses.add(cls);
                            });
                        }
                        if (node.name) {
                            affectedNames.add(node.name);
                        }
                        affectedTags.add(node.tagName.toLowerCase());
                        try {
                            const children = node.querySelectorAll ? node.querySelectorAll("*") : [];
                            children.forEach(child => {
                                if (child.className) {
                                    child.className.split(/\s+/).forEach(cls => {
                                        if (cls) affectedClasses.add(cls);
                                    });
                                }
                                if (child.name) {
                                    affectedNames.add(child.name);
                                }
                                affectedTags.add(child.tagName.toLowerCase());
                            });
                        } catch (e) {}
                    }
                });
                if (mutation.type === "attributes") {
                    const target = mutation.target;
                    if (mutation.attributeName === "class") {
                        const oldClasses = mutation.oldValue ? mutation.oldValue.split(/\s+/) : [];
                        const newClasses = target.className ? target.className.split(/\s+/) : [];
                        [ ...oldClasses, ...newClasses ].forEach(cls => {
                            if (cls) affectedClasses.add(cls);
                        });
                    }
                    if (mutation.attributeName === "name") {
                        if (mutation.oldValue) affectedNames.add(mutation.oldValue);
                        if (target.name) affectedNames.add(target.name);
                    }
                }
            });
            const keysToDelete = [];
            for (const key of this.cache.keys()) {
                const [type, value] = key.split(":", 2);
                if (type === "className" && affectedClasses.has(value) || type === "name" && affectedNames.has(value) || type === "tagName" && affectedTags.has(value)) {
                    keysToDelete.push(key);
                }
            }
            keysToDelete.forEach(key => this.cache.delete(key));
            this.stats.cacheSize = this.cache.size;
            if (keysToDelete.length > 0 && this.options.enableLogging) {
                this._log(`Invalidated ${keysToDelete.length} cache entries due to DOM changes`);
            }
        }
        _scheduleCleanup() {
            if (!this.options.autoCleanup || this.isDestroyed) return;
            this.cleanupTimer = setTimeout(() => {
                this._performCleanup();
                this._scheduleCleanup();
            }, this.options.cleanupInterval);
        }
        _performCleanup() {
            if (this.isDestroyed) return;
            const beforeSize = this.cache.size;
            const staleKeys = [];
            for (const [key, collection] of this.cache) {
                if (!this._isValidCollection(collection)) {
                    staleKeys.push(key);
                }
            }
            staleKeys.forEach(key => this.cache.delete(key));
            this.stats.cacheSize = this.cache.size;
            this.stats.lastCleanup = Date.now();
            if (this.options.enableLogging && staleKeys.length > 0) {
                this._log(`Cleanup completed. Removed ${staleKeys.length} stale entries.`);
            }
        }
        _debounce(func, delay) {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        }
        _log(message) {
            if (this.options.enableLogging) {
                console.log(`[Collections] ${message}`);
            }
        }
        _warn(message) {
            if (this.options.enableLogging) {
                console.warn(`[Collections] ${message}`);
            }
        }
        _applyEnhancedUpdateToElement(element, key, value) {
            applyEnhancedUpdate(element, key, value);
        }
        _handleClassListUpdate(element, classListUpdates) {
            Object.entries(classListUpdates).forEach(([method, classes]) => {
                try {
                    switch (method) {
                      case "add":
                        if (Array.isArray(classes)) {
                            element.classList.add(...classes);
                        } else if (typeof classes === "string") {
                            element.classList.add(classes);
                        }
                        break;

                      case "remove":
                        if (Array.isArray(classes)) {
                            element.classList.remove(...classes);
                        } else if (typeof classes === "string") {
                            element.classList.remove(classes);
                        }
                        break;

                      case "toggle":
                        if (Array.isArray(classes)) {
                            classes.forEach(cls => element.classList.toggle(cls));
                        } else if (typeof classes === "string") {
                            element.classList.toggle(classes);
                        }
                        break;

                      case "replace":
                        if (Array.isArray(classes) && classes.length === 2) {
                            element.classList.replace(classes[0], classes[1]);
                        }
                        break;

                      case "contains":
                        if (Array.isArray(classes)) {
                            classes.forEach(cls => {
                                console.log(`[DOM Helpers] classList.contains('${cls}'):`, element.classList.contains(cls));
                            });
                        } else if (typeof classes === "string") {
                            console.log(`[DOM Helpers] classList.contains('${classes}'):`, element.classList.contains(classes));
                        }
                        break;

                      default:
                        console.warn(`[DOM Helpers] Unknown classList method: ${method}`);
                    }
                } catch (error) {
                    console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
                }
            });
        }
        _enhanceCollectionWithUpdate(collection) {
            if (!collection || collection._hasEnhancedUpdateMethod) {
                return collection;
            }
            if (EnhancedUpdateUtility && EnhancedUpdateUtility.enhanceCollectionWithUpdate) {
                return EnhancedUpdateUtility.enhanceCollectionWithUpdate(collection);
            }
            try {
                Object.defineProperty(collection, "update", {
                    value: (updates = {}) => {
                        if (!updates || typeof updates !== "object") {
                            console.warn("[DOM Helpers] .update() called with invalid updates object");
                            return collection;
                        }
                        let elements = [];
                        if (collection._originalCollection) {
                            elements = Array.from(collection._originalCollection);
                        } else if (collection.length !== undefined) {
                            elements = Array.from(collection);
                        }
                        if (elements.length === 0) {
                            console.info("[DOM Helpers] .update() called on empty collection");
                            return collection;
                        }
                        try {
                            elements.forEach(element => {
                                if (element && element.nodeType === Node.ELEMENT_NODE) {
                                    Object.entries(updates).forEach(([key, value]) => {
                                        this._applyEnhancedUpdateToElement(element, key, value);
                                    });
                                }
                            });
                        } catch (error) {
                            console.warn(`[DOM Helpers] Error in collection .update(): ${error.message}`);
                        }
                        return collection;
                    },
                    writable: false,
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(collection, "_hasEnhancedUpdateMethod", {
                    value: true,
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
            } catch (error) {
                collection.update = (updates = {}) => {
                    if (!updates || typeof updates !== "object") {
                        console.warn("[DOM Helpers] .update() called with invalid updates object");
                        return collection;
                    }
                    let elements = [];
                    if (collection._originalCollection) {
                        elements = Array.from(collection._originalCollection);
                    } else if (collection.length !== undefined) {
                        elements = Array.from(collection);
                    }
                    if (elements.length === 0) {
                        console.info("[DOM Helpers] .update() called on empty collection");
                        return collection;
                    }
                    try {
                        elements.forEach(element => {
                            if (element && element.nodeType === Node.ELEMENT_NODE) {
                                Object.entries(updates).forEach(([key, value]) => {
                                    this._applyEnhancedUpdateToElement(element, key, value);
                                });
                            }
                        });
                    } catch (error) {
                        console.warn(`[DOM Helpers] Error in collection .update(): ${error.message}`);
                    }
                    return collection;
                };
                collection._hasEnhancedUpdateMethod = true;
            }
            return collection;
        }
        getStats() {
            return {
                ...this.stats,
                hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
                uptime: Date.now() - this.stats.lastCleanup
            };
        }
        clearCache() {
            this.cache.clear();
            this.stats.cacheSize = 0;
            this._log("Cache cleared manually");
        }
        destroy() {
            this.isDestroyed = true;
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.cleanupTimer) {
                clearTimeout(this.cleanupTimer);
                this.cleanupTimer = null;
            }
            this.cache.clear();
            this._log("Collections helper destroyed");
        }
        isCached(type, value) {
            return this.cache.has(this._createCacheKey(type, value));
        }
        getCacheSnapshot() {
            return Array.from(this.cache.keys());
        }
        getMultiple(requests) {
            const results = {};
            requests.forEach(({type: type, value: value, as: as}) => {
                const key = as || `${type}_${value}`;
                switch (type) {
                  case "className":
                    results[key] = this.ClassName[value];
                    break;

                  case "tagName":
                    results[key] = this.TagName[value];
                    break;

                  case "name":
                    results[key] = this.Name[value];
                    break;
                }
            });
            return results;
        }
        async waitForElements(type, value, minCount = 1, timeout = 5e3) {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                let collection;
                switch (type) {
                  case "className":
                    collection = this.ClassName[value];
                    break;

                  case "tagName":
                    collection = this.TagName[value];
                    break;

                  case "name":
                    collection = this.Name[value];
                    break;

                  default:
                    throw new Error(`Unknown collection type: ${type}`);
                }
                if (collection && collection.length >= minCount) {
                    return collection;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            throw new Error(`Timeout waiting for ${type}="${value}" (min: ${minCount})`);
        }
        enableEnhancedSyntax() {
            this.options.enableEnhancedSyntax = true;
            return this;
        }
        disableEnhancedSyntax() {
            this.options.enableEnhancedSyntax = false;
            return this;
        }
    }
    const CollectionHelper = new ProductionCollectionHelper({
        enableLogging: false,
        autoCleanup: true,
        cleanupInterval: 3e4,
        maxCacheSize: 1e3,
        enableEnhancedSyntax: true
    });
    const Collections = {
        ClassName: CollectionHelper.ClassName,
        TagName: CollectionHelper.TagName,
        Name: CollectionHelper.Name,
        helper: CollectionHelper,
        stats: () => CollectionHelper.getStats(),
        clear: () => CollectionHelper.clearCache(),
        destroy: () => CollectionHelper.destroy(),
        isCached: (type, value) => CollectionHelper.isCached(type, value),
        getMultiple: requests => CollectionHelper.getMultiple(requests),
        waitFor: (type, value, minCount, timeout) => CollectionHelper.waitForElements(type, value, minCount, timeout),
        enableEnhancedSyntax: () => CollectionHelper.enableEnhancedSyntax(),
        disableEnhancedSyntax: () => CollectionHelper.disableEnhancedSyntax(),
        configure: options => {
            Object.assign(CollectionHelper.options, options);
            return Collections;
        }
    };
    Collections.update = (updates = {}) => {
        if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
            console.warn("[DOM Helpers] Collections.update() requires an object with collection identifiers as keys");
            return {};
        }
        const results = {};
        const successful = [];
        const failed = [];
        Object.entries(updates).forEach(([identifier, updateData]) => {
            try {
                let type, value, collection;
                if (identifier.includes(":")) {
                    [type, value] = identifier.split(":", 2);
                    switch (type.toLowerCase()) {
                      case "class":
                      case "classname":
                        collection = Collections.ClassName[value];
                        break;

                      case "tag":
                      case "tagname":
                        collection = Collections.TagName[value];
                        break;

                      case "name":
                        collection = Collections.Name[value];
                        break;

                      default:
                        results[identifier] = {
                            success: false,
                            error: `Unknown collection type: ${type}. Use 'class', 'tag', or 'name'`
                        };
                        failed.push(identifier);
                        return;
                    }
                } else {
                    collection = Collections.ClassName[identifier];
                    value = identifier;
                }
                if (collection && collection.length > 0) {
                    if (typeof collection.update === "function") {
                        collection.update(updateData);
                        results[identifier] = {
                            success: true,
                            collection: collection,
                            elementsUpdated: collection.length
                        };
                        successful.push(identifier);
                    } else {
                        const elements = Array.from(collection);
                        elements.forEach(element => {
                            if (element && element.nodeType === Node.ELEMENT_NODE) {
                                Object.entries(updateData).forEach(([key, val]) => {
                                    applyEnhancedUpdate(element, key, val);
                                });
                            }
                        });
                        results[identifier] = {
                            success: true,
                            collection: collection,
                            elementsUpdated: elements.length
                        };
                        successful.push(identifier);
                    }
                } else if (collection) {
                    results[identifier] = {
                        success: true,
                        collection: collection,
                        elementsUpdated: 0,
                        warning: "Collection is empty - no elements to update"
                    };
                    successful.push(identifier);
                } else {
                    results[identifier] = {
                        success: false,
                        error: `Collection '${identifier}' not found or invalid`
                    };
                    failed.push(identifier);
                }
            } catch (error) {
                results[identifier] = {
                    success: false,
                    error: error.message
                };
                failed.push(identifier);
            }
        });
        if (CollectionHelper.options.enableLogging) {
            const totalElements = successful.reduce((sum, id) => sum + (results[id].elementsUpdated || 0), 0);
            console.log(`[Collections] Bulk update completed: ${successful.length} collections (${totalElements} elements), ${failed.length} failed`);
            if (failed.length > 0) {
                console.warn(`[Collections] Failed identifiers:`, failed);
            }
        }
        return results;
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            Collections: Collections,
            ProductionCollectionHelper: ProductionCollectionHelper
        };
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return {
                Collections: Collections,
                ProductionCollectionHelper: ProductionCollectionHelper
            };
        });
    } else {
        global.Collections = Collections;
        global.ProductionCollectionHelper = ProductionCollectionHelper;
    }
    if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", () => {
            CollectionHelper.destroy();
        });
    }
    class ProductionSelectorHelper {
        constructor(options = {}) {
            this.cache = new Map;
            this.weakCache = new WeakMap;
            this.options = {
                enableLogging: options.enableLogging ?? false,
                autoCleanup: options.autoCleanup ?? true,
                cleanupInterval: options.cleanupInterval ?? 3e4,
                maxCacheSize: options.maxCacheSize ?? 1e3,
                debounceDelay: options.debounceDelay ?? 16,
                enableSmartCaching: options.enableSmartCaching ?? true,
                enableEnhancedSyntax: options.enableEnhancedSyntax ?? true,
                ...options
            };
            this.stats = {
                hits: 0,
                misses: 0,
                cacheSize: 0,
                lastCleanup: Date.now(),
                selectorTypes: new Map
            };
            this.pendingUpdates = new Set;
            this.cleanupTimer = null;
            this.isDestroyed = false;
            this.selectorPatterns = this._buildSelectorPatterns();
            this._initProxies();
            this._initMutationObserver();
            this._scheduleCleanup();
        }
        _buildSelectorPatterns() {
            return {
                id: /^#([a-zA-Z][\w-]*)$/,
                class: /^\.([a-zA-Z][\w-]*)$/,
                tag: /^([a-zA-Z][a-zA-Z0-9]*)$/,
                attribute: /^\[([^\]]+)\]$/,
                descendant: /^(\w+)\s+(\w+)$/,
                child: /^(\w+)\s*>\s*(\w+)$/,
                pseudo: /^(\w+):([a-zA-Z-]+)$/
            };
        }
        _initProxies() {
            this.query = this._createQueryFunction("single");
            this.queryAll = this._createQueryFunction("multiple");
            if (this.options.enableEnhancedSyntax) {
                this._initEnhancedSyntax();
            }
            this.Scoped = {
                within: (container, selector) => {
                    const containerEl = typeof container === "string" ? document.querySelector(container) : container;
                    if (!containerEl) return null;
                    const cacheKey = `scoped:${containerEl.id || "anonymous"}:${selector}`;
                    return this._getScopedQuery(containerEl, selector, "single", cacheKey);
                },
                withinAll: (container, selector) => {
                    const containerEl = typeof container === "string" ? document.querySelector(container) : container;
                    if (!containerEl) return this._createEmptyCollection();
                    const cacheKey = `scopedAll:${containerEl.id || "anonymous"}:${selector}`;
                    return this._getScopedQuery(containerEl, selector, "multiple", cacheKey);
                }
            };
        }
        _initEnhancedSyntax() {
            const originalQuery = this.query;
            this.query = new Proxy(originalQuery, {
                get: (target, prop) => {
                    if (typeof prop === "symbol" || prop === "constructor" || prop === "prototype" || prop === "apply" || prop === "call" || prop === "bind" || typeof target[prop] === "function") {
                        return target[prop];
                    }
                    const selector = this._normalizeSelector(prop);
                    const element = this._getQuery("single", selector);
                    if (element) {
                        return this._createElementProxy(element);
                    }
                    return element;
                },
                apply: (target, thisArg, args) => {
                    if (args.length > 0) {
                        return this._getQuery("single", args[0]);
                    }
                    return null;
                }
            });
            const originalQueryAll = this.queryAll;
            this.queryAll = new Proxy(originalQueryAll, {
                get: (target, prop) => {
                    if (typeof prop === "symbol" || prop === "constructor" || prop === "prototype" || prop === "apply" || prop === "call" || prop === "bind" || typeof target[prop] === "function") {
                        return target[prop];
                    }
                    const selector = this._normalizeSelector(prop);
                    const collection = this._getQuery("multiple", selector);
                    return this._createCollectionProxy(collection);
                },
                apply: (target, thisArg, args) => {
                    if (args.length > 0) {
                        return this._getQuery("multiple", args[0]);
                    }
                    return this._createEmptyCollection();
                }
            });
        }
        _createElementProxy(element) {
            if (!element || !this.options.enableEnhancedSyntax) return element;
            return new Proxy(element, {
                get: (target, prop) => target[prop],
                set: (target, prop, value) => {
                    try {
                        target[prop] = value;
                        return true;
                    } catch (e) {
                        this._warn(`Failed to set property ${prop}: ${e.message}`);
                        return false;
                    }
                }
            });
        }
        _createCollectionProxy(collection) {
            if (!collection || !this.options.enableEnhancedSyntax) return collection;
            return new Proxy(collection, {
                get: (target, prop) => {
                    if (!isNaN(prop) && parseInt(prop) >= 0) {
                        const index = parseInt(prop);
                        const element = target[index];
                        if (element) {
                            return this._createElementProxy(element);
                        }
                        return element;
                    }
                    return target[prop];
                },
                set: (target, prop, value) => {
                    try {
                        target[prop] = value;
                        return true;
                    } catch (e) {
                        this._warn(`Failed to set collection property ${prop}: ${e.message}`);
                        return false;
                    }
                }
            });
        }
        _createQueryFunction(type) {
            const func = selector => this._getQuery(type, selector);
            func._queryType = type;
            func._helper = this;
            return func;
        }
        _normalizeSelector(prop) {
            const propStr = prop.toString();
            const conversions = {
                id: str => `#${this._camelToKebab(str)}`,
                class: str => `.${this._camelToKebab(str)}`,
                direct: str => str
            };
            if (propStr.startsWith("id") && propStr.length > 2) {
                return conversions.id(propStr.slice(2));
            }
            if (propStr.startsWith("class") && propStr.length > 5) {
                return conversions.class(propStr.slice(5));
            }
            if (/^[a-z][a-zA-Z]*$/.test(propStr) && /[A-Z]/.test(propStr)) {
                return conversions.class(propStr);
            }
            if (/^[a-z]+$/.test(propStr) && propStr.length < 10) {
                return propStr;
            }
            if (propStr.match(/^[a-zA-Z][\w-]*$/)) {
                return `#${propStr}`;
            }
            return propStr;
        }
        _camelToKebab(str) {
            return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        }
        _createCacheKey(type, selector) {
            return `${type}:${selector}`;
        }
        _getQuery(type, selector) {
            if (typeof selector !== "string") {
                this._warn(`Invalid selector type: ${typeof selector}`);
                return type === "single" ? null : this._createEmptyCollection();
            }
            const cacheKey = this._createCacheKey(type, selector);
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (this._isValidQuery(cached, type)) {
                    this.stats.hits++;
                    this._trackSelectorType(selector);
                    return cached;
                } else {
                    this.cache.delete(cacheKey);
                }
            }
            let result;
            try {
                if (type === "single") {
                    const element = document.querySelector(selector);
                    result = this._enhanceElementWithUpdate(element);
                } else {
                    const nodeList = document.querySelectorAll(selector);
                    result = this._enhanceNodeList(nodeList, selector);
                }
            } catch (error) {
                this._warn(`Invalid selector "${selector}": ${error.message}`);
                return type === "single" ? null : this._createEmptyCollection();
            }
            this._addToCache(cacheKey, result);
            this.stats.misses++;
            this._trackSelectorType(selector);
            return result;
        }
        _getScopedQuery(container, selector, type, cacheKey) {
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (this._isValidQuery(cached, type)) {
                    this.stats.hits++;
                    return cached;
                } else {
                    this.cache.delete(cacheKey);
                }
            }
            let result;
            try {
                if (type === "single") {
                    result = container.querySelector(selector);
                } else {
                    const nodeList = container.querySelectorAll(selector);
                    result = this._enhanceNodeList(nodeList, selector);
                }
            } catch (error) {
                this._warn(`Invalid scoped selector "${selector}": ${error.message}`);
                return type === "single" ? null : this._createEmptyCollection();
            }
            this._addToCache(cacheKey, result);
            this.stats.misses++;
            return result;
        }
        _isValidQuery(cached, type) {
            if (type === "single") {
                return cached && cached.nodeType === Node.ELEMENT_NODE && document.contains(cached);
            } else {
                if (!cached || !cached._originalNodeList) return false;
                const nodeList = cached._originalNodeList;
                if (nodeList.length === 0) return true;
                const firstElement = nodeList[0];
                return firstElement && document.contains(firstElement);
            }
        }
        _enhanceNodeList(nodeList, selector) {
            const collection = {
                _originalNodeList: nodeList,
                _selector: selector,
                _cachedAt: Date.now(),
                get length() {
                    return nodeList.length;
                },
                item(index) {
                    return nodeList.item(index);
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
                    return Array.from(nodeList);
                },
                forEach(callback, thisArg) {
                    nodeList.forEach(callback, thisArg);
                },
                map(callback, thisArg) {
                    return Array.from(nodeList).map(callback, thisArg);
                },
                filter(callback, thisArg) {
                    return Array.from(nodeList).filter(callback, thisArg);
                },
                find(callback, thisArg) {
                    return Array.from(nodeList).find(callback, thisArg);
                },
                some(callback, thisArg) {
                    return Array.from(nodeList).some(callback, thisArg);
                },
                every(callback, thisArg) {
                    return Array.from(nodeList).every(callback, thisArg);
                },
                reduce(callback, initialValue) {
                    return Array.from(nodeList).reduce(callback, initialValue);
                },
                first() {
                    return nodeList.length > 0 ? nodeList[0] : null;
                },
                last() {
                    return nodeList.length > 0 ? nodeList[nodeList.length - 1] : null;
                },
                at(index) {
                    if (index < 0) index = nodeList.length + index;
                    return index >= 0 && index < nodeList.length ? nodeList[index] : null;
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
                },
                visible() {
                    return this.filter(el => {
                        const style = window.getComputedStyle(el);
                        return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
                    });
                },
                hidden() {
                    return this.filter(el => {
                        const style = window.getComputedStyle(el);
                        return style.display === "none" || style.visibility === "hidden" || style.opacity === "0";
                    });
                },
                enabled() {
                    return this.filter(el => !el.disabled && !el.hasAttribute("disabled"));
                },
                disabled() {
                    return this.filter(el => el.disabled || el.hasAttribute("disabled"));
                },
                within(selector) {
                    const results = [];
                    this.forEach(el => {
                        const found = el.querySelectorAll(selector);
                        results.push(...Array.from(found));
                    });
                    return this._helper._enhanceNodeList(results, `${this._selector} ${selector}`);
                }
            };
            for (let i = 0; i < nodeList.length; i++) {
                Object.defineProperty(collection, i, {
                    get() {
                        return nodeList[i];
                    },
                    enumerable: true
                });
            }
            collection[Symbol.iterator] = function*() {
                for (let i = 0; i < nodeList.length; i++) {
                    yield nodeList[i];
                }
            };
            return this._enhanceCollectionWithUpdate(collection);
        }
        _createEmptyCollection() {
            const emptyNodeList = document.querySelectorAll("nonexistent-element-that-never-exists");
            return this._enhanceNodeList(emptyNodeList, "empty");
        }
        _trackSelectorType(selector) {
            const type = this._classifySelector(selector);
            const current = this.stats.selectorTypes.get(type) || 0;
            this.stats.selectorTypes.set(type, current + 1);
        }
        _classifySelector(selector) {
            if (this.selectorPatterns.id.test(selector)) return "id";
            if (this.selectorPatterns.class.test(selector)) return "class";
            if (this.selectorPatterns.tag.test(selector)) return "tag";
            if (this.selectorPatterns.attribute.test(selector)) return "attribute";
            if (this.selectorPatterns.descendant.test(selector)) return "descendant";
            if (this.selectorPatterns.child.test(selector)) return "child";
            if (this.selectorPatterns.pseudo.test(selector)) return "pseudo";
            return "complex";
        }
        _addToCache(cacheKey, result) {
            if (this.cache.size >= this.options.maxCacheSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            this.cache.set(cacheKey, result);
            this.stats.cacheSize = this.cache.size;
            if (result && result.nodeType === Node.ELEMENT_NODE) {
                this.weakCache.set(result, {
                    cacheKey: cacheKey,
                    cachedAt: Date.now(),
                    accessCount: 1
                });
            }
        }
        _initMutationObserver() {
            if (!this.options.enableSmartCaching) return;
            const debouncedUpdate = this._debounce(mutations => {
                this._processMutations(mutations);
            }, this.options.debounceDelay);
            this.observer = new MutationObserver(debouncedUpdate);
            if (document.body) {
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: [ "id", "class", "style", "hidden", "disabled" ]
                });
            } else {
                document.addEventListener("DOMContentLoaded", () => {
                    if (document.body && !this.isDestroyed) {
                        this.observer.observe(document.body, {
                            childList: true,
                            subtree: true,
                            attributes: true,
                            attributeFilter: [ "id", "class", "style", "hidden", "disabled" ]
                        });
                    }
                });
            }
        }
        _processMutations(mutations) {
            if (this.isDestroyed) return;
            const affectedSelectors = new Set;
            mutations.forEach(mutation => {
                if (mutation.type === "childList") {
                    affectedSelectors.add("*");
                }
                if (mutation.type === "attributes") {
                    const target = mutation.target;
                    const attrName = mutation.attributeName;
                    if (attrName === "id") {
                        const oldValue = mutation.oldValue;
                        if (oldValue) affectedSelectors.add(`#${oldValue}`);
                        if (target.id) affectedSelectors.add(`#${target.id}`);
                    }
                    if (attrName === "class") {
                        const oldClasses = mutation.oldValue ? mutation.oldValue.split(/\s+/) : [];
                        const newClasses = target.className ? target.className.split(/\s+/) : [];
                        [ ...oldClasses, ...newClasses ].forEach(cls => {
                            if (cls) affectedSelectors.add(`.${cls}`);
                        });
                    }
                    affectedSelectors.add(`[${attrName}]`);
                }
            });
            if (affectedSelectors.has("*")) {
                this.cache.clear();
            } else {
                const keysToDelete = [];
                for (const key of this.cache.keys()) {
                    const [type, selector] = key.split(":", 2);
                    for (const affected of affectedSelectors) {
                        if (selector.includes(affected)) {
                            keysToDelete.push(key);
                            break;
                        }
                    }
                }
                keysToDelete.forEach(key => this.cache.delete(key));
            }
            this.stats.cacheSize = this.cache.size;
        }
        _scheduleCleanup() {
            if (!this.options.autoCleanup || this.isDestroyed) return;
            this.cleanupTimer = setTimeout(() => {
                this._performCleanup();
                this._scheduleCleanup();
            }, this.options.cleanupInterval);
        }
        _performCleanup() {
            if (this.isDestroyed) return;
            const beforeSize = this.cache.size;
            const staleKeys = [];
            for (const [key, value] of this.cache) {
                const [type] = key.split(":", 1);
                if (!this._isValidQuery(value, type === "single" ? "single" : "multiple")) {
                    staleKeys.push(key);
                }
            }
            staleKeys.forEach(key => this.cache.delete(key));
            this.stats.cacheSize = this.cache.size;
            this.stats.lastCleanup = Date.now();
            if (this.options.enableLogging && staleKeys.length > 0) {
                this._log(`Cleanup completed. Removed ${staleKeys.length} stale entries.`);
            }
        }
        _debounce(func, delay) {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        }
        _log(message) {
            if (this.options.enableLogging) {
                console.log(`[Selector] ${message}`);
            }
        }
        _warn(message) {
            if (this.options.enableLogging) {
                console.warn(`[Selector] ${message}`);
            }
        }
        _enhanceElementWithUpdate(element) {
            if (!element || element._hasEnhancedUpdateMethod) {
                return element;
            }
            if (EnhancedUpdateUtility && EnhancedUpdateUtility.enhanceElementWithUpdate) {
                return EnhancedUpdateUtility.enhanceElementWithUpdate(element);
            }
            try {
                Object.defineProperty(element, "update", {
                    value: (updates = {}) => {
                        if (!updates || typeof updates !== "object") {
                            console.warn("[DOM Helpers] .update() called with invalid updates object");
                            return element;
                        }
                        try {
                            Object.entries(updates).forEach(([key, value]) => {
                                if (key === "style" && typeof value === "object" && value !== null) {
                                    Object.entries(value).forEach(([styleProperty, styleValue]) => {
                                        if (styleValue !== null && styleValue !== undefined) {
                                            element.style[styleProperty] = styleValue;
                                        }
                                    });
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
                                if (typeof value === "string" || typeof value === "number") {
                                    element.setAttribute(key, value);
                                }
                            });
                        } catch (error) {
                            console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
                        }
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
                element.update = (updates = {}) => {
                    if (!updates || typeof updates !== "object") {
                        console.warn("[DOM Helpers] .update() called with invalid updates object");
                        return element;
                    }
                    try {
                        Object.entries(updates).forEach(([key, value]) => {
                            if (key === "style" && typeof value === "object" && value !== null) {
                                Object.entries(value).forEach(([styleProperty, styleValue]) => {
                                    if (styleValue !== null && styleValue !== undefined) {
                                        element.style[styleProperty] = styleValue;
                                    }
                                });
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
                            if (typeof value === "string" || typeof value === "number") {
                                element.setAttribute(key, value);
                            }
                        });
                    } catch (error) {
                        console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
                    }
                    return element;
                };
                element._hasUpdateMethod = true;
            }
            return element;
        }
        _enhanceCollectionWithUpdate(collection) {
            if (!collection || collection._hasEnhancedUpdateMethod) {
                return collection;
            }
            if (collection._originalCollection) {
                Array.from(collection._originalCollection).forEach(element => {
                    if (element && element.nodeType === Node.ELEMENT_NODE) {}
                });
            }
            if (EnhancedUpdateUtility && EnhancedUpdateUtility.enhanceCollectionWithUpdate) {
                return EnhancedUpdateUtility.enhanceCollectionWithUpdate(collection);
            }
            try {
                Object.defineProperty(collection, "update", {
                    value: (updates = {}) => {
                        if (!updates || typeof updates !== "object") {
                            console.warn("[DOM Helpers] .update() called with invalid updates object");
                            return collection;
                        }
                        let elements = [];
                        if (collection._originalNodeList) {
                            elements = Array.from(collection._originalNodeList);
                        } else if (collection.length !== undefined) {
                            elements = Array.from(collection);
                        }
                        if (elements.length === 0) {
                            console.info("[DOM Helpers] .update() called on empty collection");
                            return collection;
                        }
                        try {
                            elements.forEach(element => {
                                if (element && element.nodeType === Node.ELEMENT_NODE) {
                                    Object.entries(updates).forEach(([key, value]) => {
                                        if (key === "style" && typeof value === "object" && value !== null) {
                                            Object.entries(value).forEach(([styleProperty, styleValue]) => {
                                                if (styleValue !== null && styleValue !== undefined) {
                                                    element.style[styleProperty] = styleValue;
                                                }
                                            });
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
                                        if (typeof value === "string" || typeof value === "number") {
                                            element.setAttribute(key, value);
                                        }
                                    });
                                }
                            });
                        } catch (error) {
                            console.warn(`[DOM Helpers] Error in collection .update(): ${error.message}`);
                        }
                        return collection;
                    },
                    writable: false,
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(collection, "_hasUpdateMethod", {
                    value: true,
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
            } catch (error) {
                collection.update = (updates = {}) => {
                    if (!updates || typeof updates !== "object") {
                        console.warn("[DOM Helpers] .update() called with invalid updates object");
                        return collection;
                    }
                    let elements = [];
                    if (collection._originalNodeList) {
                        elements = Array.from(collection._originalNodeList);
                    } else if (collection.length !== undefined) {
                        elements = Array.from(collection);
                    }
                    if (elements.length === 0) {
                        console.info("[DOM Helpers] .update() called on empty collection");
                        return collection;
                    }
                    try {
                        elements.forEach(element => {
                            if (element && element.nodeType === Node.ELEMENT_NODE) {
                                Object.entries(updates).forEach(([key, value]) => {
                                    if (key === "style" && typeof value === "object" && value !== null) {
                                        Object.entries(value).forEach(([styleProperty, styleValue]) => {
                                            if (styleValue !== null && styleValue !== undefined) {
                                                element.style[styleProperty] = styleValue;
                                            }
                                        });
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
                                    if (typeof value === "string" || typeof value === "number") {
                                        element.setAttribute(key, value);
                                    }
                                });
                            }
                        });
                    } catch (error) {
                        console.warn(`[DOM Helpers] Error in collection .update(): ${error.message}`);
                    }
                    return collection;
                };
                collection._hasUpdateMethod = true;
            }
            return collection;
        }
        getStats() {
            return {
                ...this.stats,
                hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
                uptime: Date.now() - this.stats.lastCleanup,
                selectorBreakdown: Object.fromEntries(this.stats.selectorTypes)
            };
        }
        clearCache() {
            this.cache.clear();
            this.stats.cacheSize = 0;
            this.stats.selectorTypes.clear();
            this._log("Cache cleared manually");
        }
        destroy() {
            this.isDestroyed = true;
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.cleanupTimer) {
                clearTimeout(this.cleanupTimer);
                this.cleanupTimer = null;
            }
            this.cache.clear();
            this._log("Selector helper destroyed");
        }
        async waitForSelector(selector, timeout = 5e3) {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                const element = this.query(selector);
                if (element) {
                    return element;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            throw new Error(`Timeout waiting for selector: ${selector}`);
        }
        async waitForSelectorAll(selector, minCount = 1, timeout = 5e3) {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                const elements = this.queryAll(selector);
                if (elements && elements.length >= minCount) {
                    return elements;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            throw new Error(`Timeout waiting for selector: ${selector} (min: ${minCount})`);
        }
        enableEnhancedSyntax() {
            this.options.enableEnhancedSyntax = true;
            this._initEnhancedSyntax();
            return this;
        }
        disableEnhancedSyntax() {
            this.options.enableEnhancedSyntax = false;
            this.query = this._createQueryFunction("single");
            this.queryAll = this._createQueryFunction("multiple");
            return this;
        }
    }
    const SelectorHelper = new ProductionSelectorHelper({
        enableLogging: false,
        autoCleanup: true,
        cleanupInterval: 3e4,
        maxCacheSize: 1e3,
        enableSmartCaching: true,
        enableEnhancedSyntax: true
    });
    const Selector = {
        query: SelectorHelper.query,
        queryAll: SelectorHelper.queryAll,
        Scoped: SelectorHelper.Scoped,
        helper: SelectorHelper,
        stats: () => SelectorHelper.getStats(),
        clear: () => SelectorHelper.clearCache(),
        destroy: () => SelectorHelper.destroy(),
        waitFor: (selector, timeout) => SelectorHelper.waitForSelector(selector, timeout),
        waitForAll: (selector, minCount, timeout) => SelectorHelper.waitForSelectorAll(selector, minCount, timeout),
        enableEnhancedSyntax: () => SelectorHelper.enableEnhancedSyntax(),
        disableEnhancedSyntax: () => SelectorHelper.disableEnhancedSyntax(),
        configure: options => {
            Object.assign(SelectorHelper.options, options);
            return Selector;
        }
    };
    Selector.update = (updates = {}) => {
        if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
            console.warn("[DOM Helpers] Selector.update() requires an object with CSS selectors as keys");
            return {};
        }
        const results = {};
        const successful = [];
        const failed = [];
        Object.entries(updates).forEach(([selector, updateData]) => {
            try {
                const elements = Selector.queryAll(selector);
                if (elements && elements.length > 0) {
                    if (typeof elements.update === "function") {
                        elements.update(updateData);
                        results[selector] = {
                            success: true,
                            elements: elements,
                            elementsUpdated: elements.length
                        };
                        successful.push(selector);
                    } else {
                        const elementsArray = Array.from(elements);
                        elementsArray.forEach(element => {
                            if (element && element.nodeType === Node.ELEMENT_NODE) {
                                Object.entries(updateData).forEach(([key, val]) => {
                                    applyEnhancedUpdate(element, key, val);
                                });
                            }
                        });
                        results[selector] = {
                            success: true,
                            elements: elements,
                            elementsUpdated: elementsArray.length
                        };
                        successful.push(selector);
                    }
                } else {
                    results[selector] = {
                        success: true,
                        elements: null,
                        elementsUpdated: 0,
                        warning: "No elements found matching selector"
                    };
                    successful.push(selector);
                }
            } catch (error) {
                results[selector] = {
                    success: false,
                    error: error.message
                };
                failed.push(selector);
            }
        });
        if (SelectorHelper.options.enableLogging) {
            const totalElements = successful.reduce((sum, sel) => sum + (results[sel].elementsUpdated || 0), 0);
            console.log(`[Selector] Bulk update completed: ${successful.length} selectors (${totalElements} elements), ${failed.length} failed`);
            if (failed.length > 0) {
                console.warn(`[Selector] Failed selectors:`, failed);
            }
        }
        return results;
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            Selector: Selector,
            ProductionSelectorHelper: ProductionSelectorHelper
        };
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return {
                Selector: Selector,
                ProductionSelectorHelper: ProductionSelectorHelper
            };
        });
    } else {
        global.Selector = Selector;
        global.ProductionSelectorHelper = ProductionSelectorHelper;
    }
    if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", () => {
            SelectorHelper.destroy();
        });
    }
    const DOMHelpers = {
        Elements: global.Elements,
        Collections: global.Collections,
        Selector: global.Selector,
        ProductionElementsHelper: global.ProductionElementsHelper,
        ProductionCollectionHelper: global.ProductionCollectionHelper,
        ProductionSelectorHelper: global.ProductionSelectorHelper,
        version: "2.3.1",
        isReady() {
            return !!(this.Elements && this.Collections && this.Selector);
        },
        getStats() {
            const stats = {};
            if (this.Elements && typeof this.Elements.stats === "function") {
                stats.elements = this.Elements.stats();
            }
            if (this.Collections && typeof this.Collections.stats === "function") {
                stats.collections = this.Collections.stats();
            }
            if (this.Selector && typeof this.Selector.stats === "function") {
                stats.selector = this.Selector.stats();
            }
            return stats;
        },
        clearAll() {
            if (this.Elements && typeof this.Elements.clear === "function") {
                this.Elements.clear();
            }
            if (this.Collections && typeof this.Collections.clear === "function") {
                this.Collections.clear();
            }
            if (this.Selector && typeof this.Selector.clear === "function") {
                this.Selector.clear();
            }
        },
        destroyAll() {
            if (this.Elements && typeof this.Elements.destroy === "function") {
                this.Elements.destroy();
            }
            if (this.Collections && typeof this.Collections.destroy === "function") {
                this.Collections.destroy();
            }
            if (this.Selector && typeof this.Selector.destroy === "function") {
                this.Selector.destroy();
            }
        },
        configure(options = {}) {
            if (this.Elements && typeof this.Elements.configure === "function") {
                this.Elements.configure(options.elements || options);
            }
            if (this.Collections && typeof this.Collections.configure === "function") {
                this.Collections.configure(options.collections || options);
            }
            if (this.Selector && typeof this.Selector.configure === "function") {
                this.Selector.configure(options.selector || options);
            }
            return this;
        }
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            DOMHelpers: DOMHelpers,
            Elements: global.Elements,
            Collections: global.Collections,
            Selector: global.Selector,
            ProductionElementsHelper: global.ProductionElementsHelper,
            ProductionCollectionHelper: global.ProductionCollectionHelper,
            ProductionSelectorHelper: global.ProductionSelectorHelper
        };
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return {
                DOMHelpers: DOMHelpers,
                Elements: global.Elements,
                Collections: global.Collections,
                Selector: global.Selector,
                ProductionElementsHelper: global.ProductionElementsHelper,
                ProductionCollectionHelper: global.ProductionCollectionHelper,
                ProductionSelectorHelper: global.ProductionSelectorHelper
            };
        });
    } else {
        global.DOMHelpers = DOMHelpers;
    }
    if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", () => {
            DOMHelpers.destroyAll();
        });
    }
    (function() {
        "use strict";
        const originalCreateElement = document.createElement;
        function enhancedCreateElement(tagName, options) {
            const element = originalCreateElement.call(document, tagName, options);
            if (typeof enhanceElementWithUpdate === "function") {
                return enhanceElementWithUpdate(element);
            } else if (typeof EnhancedUpdateUtility !== "undefined" && EnhancedUpdateUtility.enhanceElementWithUpdate) {
                return EnhancedUpdateUtility.enhanceElementWithUpdate(element);
            } else {
                return addBasicUpdateMethod(element);
            }
        }
        function createElementsBulk(definitions = {}) {
            if (!definitions || typeof definitions !== "object") {
                console.warn("[DOM Helpers] createElement.bulk() requires an object");
                return null;
            }
            const createdElements = {};
            const elementsList = [];
            Object.entries(definitions).forEach(([tagName, config]) => {
                try {
                    let actualTagName = tagName;
                    const match = tagName.match(/^([A-Z]+)(_\d+)?$/i);
                    if (match) {
                        actualTagName = match[1];
                    }
                    const element = DEFAULTS.autoEnhanceCreateElement ? enhancedCreateElement(actualTagName) : originalCreateElement.call(document, actualTagName);
                    if (config && typeof config === "object") {
                        Object.entries(config).forEach(([key, value]) => {
                            try {
                                if (key === "style" && typeof value === "object" && value !== null) {
                                    Object.assign(element.style, value);
                                    return;
                                }
                                if (key === "classList" && typeof value === "object" && value !== null) {
                                    Object.entries(value).forEach(([method, classes]) => {
                                        try {
                                            switch (method) {
                                              case "add":
                                                const addClasses = Array.isArray(classes) ? classes : [ classes ];
                                                element.classList.add(...addClasses);
                                                break;

                                              case "remove":
                                                const removeClasses = Array.isArray(classes) ? classes : [ classes ];
                                                element.classList.remove(...removeClasses);
                                                break;

                                              case "toggle":
                                                const toggleClasses = Array.isArray(classes) ? classes : [ classes ];
                                                toggleClasses.forEach(cls => element.classList.toggle(cls));
                                                break;

                                              case "replace":
                                                if (Array.isArray(classes) && classes.length === 2) {
                                                    element.classList.replace(classes[0], classes[1]);
                                                }
                                                break;
                                            }
                                        } catch (error) {
                                            console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
                                        }
                                    });
                                    return;
                                }
                                if (key === "setAttribute") {
                                    if (typeof value === "object" && !Array.isArray(value)) {
                                        Object.entries(value).forEach(([attr, attrValue]) => {
                                            element.setAttribute(attr, attrValue);
                                        });
                                    } else if (Array.isArray(value) && value.length >= 2) {
                                        element.setAttribute(value[0], value[1]);
                                    }
                                    return;
                                }
                                if (key === "dataset" && typeof value === "object" && value !== null) {
                                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                                        element.dataset[dataKey] = dataValue;
                                    });
                                    return;
                                }
                                if (key === "addEventListener") {
                                    if (Array.isArray(value) && value.length >= 2) {
                                        const [eventType, handler, options] = value;
                                        element.addEventListener(eventType, handler, options);
                                    } else if (typeof value === "object" && value !== null) {
                                        Object.entries(value).forEach(([eventType, handler]) => {
                                            if (typeof handler === "function") {
                                                element.addEventListener(eventType, handler);
                                            } else if (Array.isArray(handler) && handler.length >= 1) {
                                                const [handlerFunc, options] = handler;
                                                element.addEventListener(eventType, handlerFunc, options);
                                            }
                                        });
                                    }
                                    return;
                                }
                                if (key === "removeAttribute") {
                                    if (Array.isArray(value)) {
                                        value.forEach(attr => element.removeAttribute(attr));
                                    } else if (typeof value === "string") {
                                        element.removeAttribute(value);
                                    }
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
                            } catch (error) {
                                console.warn(`[DOM Helpers] Failed to apply config ${key} to ${tagName}:`, error.message);
                            }
                        });
                    }
                    if (!element._hasUpdateMethod && !DEFAULTS.autoEnhanceCreateElement) {
                        addBasicUpdateMethod(element);
                    }
                    createdElements[tagName] = element;
                    elementsList.push({
                        key: tagName,
                        element: element
                    });
                } catch (error) {
                    console.warn(`[DOM Helpers] Failed to create element ${tagName}:`, error.message);
                }
            });
            return {
                ...createdElements,
                toArray(...tagNames) {
                    if (tagNames.length === 0) {
                        return elementsList.map(({element: element}) => element);
                    }
                    return tagNames.map(key => createdElements[key]).filter(Boolean);
                },
                ordered(...tagNames) {
                    return this.toArray(...tagNames);
                },
                get all() {
                    return elementsList.map(({element: element}) => element);
                },
                updateMultiple(updates = {}) {
                    Object.entries(updates).forEach(([tagName, updateData]) => {
                        const element = createdElements[tagName];
                        if (element) {
                            if (typeof element.update === "function") {
                                element.update(updateData);
                            } else {
                                Object.entries(updateData).forEach(([key, value]) => {
                                    try {
                                        if (key === "style" && typeof value === "object" && value !== null) {
                                            Object.assign(element.style, value);
                                        } else if (key in element) {
                                            element[key] = value;
                                        } else if (typeof value === "string" || typeof value === "number") {
                                            element.setAttribute(key, value);
                                        }
                                    } catch (error) {
                                        console.warn(`[DOM Helpers] Failed to update ${key} on ${tagName}:`, error.message);
                                    }
                                });
                            }
                        }
                    });
                    return this;
                },
                get count() {
                    return elementsList.length;
                },
                get keys() {
                    return elementsList.map(({key: key}) => key);
                },
                has(key) {
                    return key in createdElements;
                },
                get(key, fallback = null) {
                    return createdElements[key] || fallback;
                },
                forEach(callback) {
                    elementsList.forEach(({key: key, element: element}, index) => {
                        callback(element, key, index);
                    });
                },
                map(callback) {
                    return elementsList.map(({key: key, element: element}, index) => callback(element, key, index));
                },
                filter(callback) {
                    return elementsList.filter(({key: key, element: element}, index) => callback(element, key, index)).map(({element: element}) => element);
                },
                appendTo(container) {
                    const containerEl = typeof container === "string" ? document.querySelector(container) : container;
                    if (containerEl) {
                        this.all.forEach(element => containerEl.appendChild(element));
                    }
                    return this;
                },
                appendToOrdered(container, ...tagNames) {
                    const containerEl = typeof container === "string" ? document.querySelector(container) : container;
                    if (containerEl) {
                        this.ordered(...tagNames).forEach(element => {
                            if (element) containerEl.appendChild(element);
                        });
                    }
                    return this;
                }
            };
        }
        enhancedCreateElement.bulk = createElementsBulk;
        enhancedCreateElement.update = createElementsBulk;
        if (DEFAULTS.autoEnhanceCreateElement) {
            document.createElement = enhancedCreateElement;
        }
        if (typeof global.DOMHelpers !== "undefined") {
            global.DOMHelpers.enableCreateElementEnhancement = function() {
                document.createElement = enhancedCreateElement;
                return this;
            };
            global.DOMHelpers.disableCreateElementEnhancement = function() {
                document.createElement = originalCreateElement;
                return this;
            };
        }
        function addBasicUpdateMethod(element) {
            if (element && !element._hasUpdateMethod) {
                if (typeof protectClassList === "function") {}
                try {
                    Object.defineProperty(element, "update", {
                        value: function(updates = {}) {
                            if (!updates || typeof updates !== "object") {
                                console.warn("[DOM Helpers] .update() called with invalid updates object");
                                return element;
                            }
                            try {
                                Object.entries(updates).forEach(([key, value]) => {
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
                                            try {
                                                switch (method) {
                                                  case "add":
                                                    if (Array.isArray(classes)) {
                                                        element.classList.add(...classes);
                                                    } else if (typeof classes === "string") {
                                                        element.classList.add(classes);
                                                    }
                                                    break;

                                                  case "remove":
                                                    if (Array.isArray(classes)) {
                                                        element.classList.remove(...classes);
                                                    } else if (typeof classes === "string") {
                                                        element.classList.remove(classes);
                                                    }
                                                    break;

                                                  case "toggle":
                                                    if (Array.isArray(classes)) {
                                                        classes.forEach(cls => element.classList.toggle(cls));
                                                    } else if (typeof classes === "string") {
                                                        element.classList.toggle(classes);
                                                    }
                                                    break;

                                                  case "replace":
                                                    if (Array.isArray(classes) && classes.length === 2) {
                                                        element.classList.replace(classes[0], classes[1]);
                                                    }
                                                    break;
                                                }
                                            } catch (error) {
                                                console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
                                            }
                                        });
                                        return;
                                    }
                                    if (key === "setAttribute" && Array.isArray(value) && value.length >= 2) {
                                        element.setAttribute(value[0], value[1]);
                                        return;
                                    }
                                    if (key === "removeAttribute") {
                                        if (Array.isArray(value)) {
                                            value.forEach(attr => element.removeAttribute(attr));
                                        } else if (typeof value === "string") {
                                            element.removeAttribute(value);
                                        }
                                        return;
                                    }
                                    if (key === "dataset" && typeof value === "object" && value !== null) {
                                        Object.entries(value).forEach(([dataKey, dataValue]) => {
                                            element.dataset[dataKey] = dataValue;
                                        });
                                        return;
                                    }
                                    if (key === "addEventListener" && Array.isArray(value) && value.length >= 2) {
                                        const [eventType, handler, options] = value;
                                        element.addEventListener(eventType, handler, options);
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
                                        element.setAttribute(key, value);
                                    }
                                });
                            } catch (error) {
                                console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
                            }
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
                    element.update = function(updates = {}) {};
                    element._hasUpdateMethod = true;
                }
            }
            return element;
        }
        function enhancedCreateElement(tagName, options) {
            const isConfigObject = options && typeof options === "object" && !options.is && (options.textContent || options.className || options.style || options.id || options.classList || options.setAttribute);
            let element;
            if (isConfigObject) {
                element = originalCreateElement.call(document, tagName);
                element = enhanceElementWithUpdate(element);
                element.update(options);
            } else {
                element = originalCreateElement.call(document, tagName, options);
                element = enhanceElementWithUpdate(element);
            }
            return element;
        }
        document.createElement.restore = function() {
            document.createElement = originalCreateElement;
        };
        if (typeof global.DOMHelpers !== "undefined") {
            global.DOMHelpers.createElement = enhancedCreateElement;
        }
        global.createElement = enhancedCreateElement;
    })();
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

/**
 * DOM Helpers - Bulk Property Updates Extension
 * Adds convenient shorthand methods for bulk element updates
 *
 * @version 1.0.0
 * @license MIT
 */ (function(global) {
    "use strict";
    function createBulkPropertyUpdater(propertyName, transformer = null) {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn(`[DOM Helpers] ${propertyName}() requires an object with element IDs as keys`);
                return this;
            }
            Object.entries(updates).forEach(([elementId, value]) => {
                try {
                    const element = this[elementId];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        const finalValue = transformer ? transformer(value) : value;
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                [propertyName]: finalValue
                            });
                        } else {
                            element[propertyName] = finalValue;
                        }
                    } else {
                        console.warn(`[DOM Helpers] Element '${elementId}' not found for ${propertyName} update`);
                    }
                } catch (error) {
                    console.warn(`[DOM Helpers] Error updating ${propertyName} for '${elementId}': ${error.message}`);
                }
            });
            return this;
        };
    }
    function createBulkStyleUpdater() {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] style() requires an object with element IDs as keys");
                return this;
            }
            Object.entries(updates).forEach(([elementId, styleObj]) => {
                try {
                    const element = this[elementId];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof styleObj !== "object" || styleObj === null) {
                            console.warn(`[DOM Helpers] style() requires style object for '${elementId}'`);
                            return;
                        }
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                style: styleObj
                            });
                        } else {
                            Object.entries(styleObj).forEach(([prop, val]) => {
                                if (val !== null && val !== undefined) {
                                    element.style[prop] = val;
                                }
                            });
                        }
                    } else {
                        console.warn(`[DOM Helpers] Element '${elementId}' not found for style update`);
                    }
                } catch (error) {
                    console.warn(`[DOM Helpers] Error updating style for '${elementId}': ${error.message}`);
                }
            });
            return this;
        };
    }
    function createBulkDatasetUpdater() {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] dataset() requires an object with element IDs as keys");
                return this;
            }
            Object.entries(updates).forEach(([elementId, dataObj]) => {
                try {
                    const element = this[elementId];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof dataObj !== "object" || dataObj === null) {
                            console.warn(`[DOM Helpers] dataset() requires data object for '${elementId}'`);
                            return;
                        }
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                dataset: dataObj
                            });
                        } else {
                            Object.entries(dataObj).forEach(([key, val]) => {
                                element.dataset[key] = val;
                            });
                        }
                    } else {
                        console.warn(`[DOM Helpers] Element '${elementId}' not found for dataset update`);
                    }
                } catch (error) {
                    console.warn(`[DOM Helpers] Error updating dataset for '${elementId}': ${error.message}`);
                }
            });
            return this;
        };
    }
    function createBulkAttributesUpdater() {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] attrs() requires an object with element IDs as keys");
                return this;
            }
            Object.entries(updates).forEach(([elementId, attrsObj]) => {
                try {
                    const element = this[elementId];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof attrsObj !== "object" || attrsObj === null) {
                            console.warn(`[DOM Helpers] attrs() requires attributes object for '${elementId}'`);
                            return;
                        }
                        Object.entries(attrsObj).forEach(([attrName, attrValue]) => {
                            if (attrValue === null || attrValue === false) {
                                element.removeAttribute(attrName);
                            } else {
                                element.setAttribute(attrName, String(attrValue));
                            }
                        });
                    } else {
                        console.warn(`[DOM Helpers] Element '${elementId}' not found for attrs update`);
                    }
                } catch (error) {
                    console.warn(`[DOM Helpers] Error updating attrs for '${elementId}': ${error.message}`);
                }
            });
            return this;
        };
    }
    function createBulkClassListUpdater() {
        return function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] classes() requires an object with element IDs as keys");
                return this;
            }
            Object.entries(updates).forEach(([elementId, classConfig]) => {
                try {
                    const element = this[elementId];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof classConfig === "string") {
                            element.className = classConfig;
                            return;
                        }
                        if (typeof classConfig === "object" && classConfig !== null) {
                            if (element.update && typeof element.update === "function") {
                                element.update({
                                    classList: classConfig
                                });
                            } else {
                                Object.entries(classConfig).forEach(([method, classes]) => {
                                    try {
                                        const classList = Array.isArray(classes) ? classes : [ classes ];
                                        switch (method) {
                                          case "add":
                                            element.classList.add(...classList);
                                            break;

                                          case "remove":
                                            element.classList.remove(...classList);
                                            break;

                                          case "toggle":
                                            classList.forEach(cls => element.classList.toggle(cls));
                                            break;

                                          case "replace":
                                            if (classList.length === 2) {
                                                element.classList.replace(classList[0], classList[1]);
                                            }
                                            break;
                                        }
                                    } catch (error) {
                                        console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
                                    }
                                });
                            }
                        }
                    } else {
                        console.warn(`[DOM Helpers] Element '${elementId}' not found for classes update`);
                    }
                } catch (error) {
                    console.warn(`[DOM Helpers] Error updating classes for '${elementId}': ${error.message}`);
                }
            });
            return this;
        };
    }
    function createBulkGenericPropertyUpdater() {
        return function(propertyPath, updates = {}) {
            if (typeof propertyPath !== "string") {
                console.warn("[DOM Helpers] prop() requires a property name as first argument");
                return this;
            }
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn("[DOM Helpers] prop() requires an object with element IDs as keys");
                return this;
            }
            const isNested = propertyPath.includes(".");
            const pathParts = isNested ? propertyPath.split(".") : null;
            Object.entries(updates).forEach(([elementId, value]) => {
                try {
                    const element = this[elementId];
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (isNested) {
                            let obj = element;
                            for (let i = 0; i < pathParts.length - 1; i++) {
                                obj = obj[pathParts[i]];
                                if (!obj) {
                                    console.warn(`[DOM Helpers] Invalid property path '${propertyPath}' for '${elementId}'`);
                                    return;
                                }
                            }
                            obj[pathParts[pathParts.length - 1]] = value;
                        } else {
                            if (propertyPath in element) {
                                element[propertyPath] = value;
                            } else {
                                console.warn(`[DOM Helpers] Property '${propertyPath}' not found on element '${elementId}'`);
                            }
                        }
                    } else {
                        console.warn(`[DOM Helpers] Element '${elementId}' not found for prop update`);
                    }
                } catch (error) {
                    console.warn(`[DOM Helpers] Error updating prop '${propertyPath}' for '${elementId}': ${error.message}`);
                }
            });
            return this;
        };
    }
    function enhanceElementsHelper(Elements) {
        if (!Elements) {
            console.warn("[DOM Helpers] Elements helper not found");
            return;
        }
        Elements.textContent = createBulkPropertyUpdater("textContent");
        Elements.innerHTML = createBulkPropertyUpdater("innerHTML");
        Elements.innerText = createBulkPropertyUpdater("innerText");
        Elements.value = createBulkPropertyUpdater("value");
        Elements.placeholder = createBulkPropertyUpdater("placeholder");
        Elements.title = createBulkPropertyUpdater("title");
        Elements.disabled = createBulkPropertyUpdater("disabled");
        Elements.checked = createBulkPropertyUpdater("checked");
        Elements.readonly = createBulkPropertyUpdater("readOnly");
        Elements.hidden = createBulkPropertyUpdater("hidden");
        Elements.selected = createBulkPropertyUpdater("selected");
        Elements.src = createBulkPropertyUpdater("src");
        Elements.href = createBulkPropertyUpdater("href");
        Elements.alt = createBulkPropertyUpdater("alt");
        Elements.style = createBulkStyleUpdater();
        Elements.dataset = createBulkDatasetUpdater();
        Elements.attrs = createBulkAttributesUpdater();
        Elements.classes = createBulkClassListUpdater();
        Elements.prop = createBulkGenericPropertyUpdater();
        return Elements;
    }
    function enhanceCollectionInstance(collectionInstance) {
        if (!collectionInstance || typeof collectionInstance !== "object") {
            return collectionInstance;
        }
        const getElementByIndex = index => {
            if (collectionInstance._originalCollection) {
                return collectionInstance._originalCollection[index];
            } else if (collectionInstance._originalNodeList) {
                return collectionInstance._originalNodeList[index];
            } else if (typeof collectionInstance[index] !== "undefined") {
                return collectionInstance[index];
            }
            return null;
        };
        const createIndexBasedUpdater = (propertyName, transformer = null) => function(updates = {}) {
            if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
                console.warn(`[DOM Helpers] ${propertyName}() requires an object with numeric indices as keys`);
                return this;
            }
            Object.entries(updates).forEach(([index, value]) => {
                try {
                    const numIndex = parseInt(index);
                    if (isNaN(numIndex)) return;
                    const element = getElementByIndex(numIndex);
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        const finalValue = transformer ? transformer(value) : value;
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                [propertyName]: finalValue
                            });
                        } else {
                            element[propertyName] = finalValue;
                        }
                    }
                } catch (error) {
                    console.warn(`[DOM Helpers] Error updating ${propertyName} at index ${index}: ${error.message}`);
                }
            });
            return this;
        };
        const createIndexBasedStyleUpdater = () => function(updates = {}) {
            Object.entries(updates).forEach(([index, styleObj]) => {
                try {
                    const numIndex = parseInt(index);
                    if (isNaN(numIndex)) return;
                    const element = getElementByIndex(numIndex);
                    if (element && element.nodeType === Node.ELEMENT_NODE && typeof styleObj === "object") {
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                style: styleObj
                            });
                        } else {
                            Object.entries(styleObj).forEach(([prop, val]) => {
                                if (val !== null && val !== undefined) {
                                    element.style[prop] = val;
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.warn(`[DOM Helpers] Error updating style at index ${index}: ${error.message}`);
                }
            });
            return this;
        };
        const createIndexBasedDatasetUpdater = () => function(updates = {}) {
            Object.entries(updates).forEach(([index, dataObj]) => {
                try {
                    const numIndex = parseInt(index);
                    if (isNaN(numIndex)) return;
                    const element = getElementByIndex(numIndex);
                    if (element && element.nodeType === Node.ELEMENT_NODE && typeof dataObj === "object") {
                        if (element.update && typeof element.update === "function") {
                            element.update({
                                dataset: dataObj
                            });
                        } else {
                            Object.entries(dataObj).forEach(([key, val]) => {
                                element.dataset[key] = val;
                            });
                        }
                    }
                } catch (error) {
                    console.warn(`[DOM Helpers] Error updating dataset at index ${index}: ${error.message}`);
                }
            });
            return this;
        };
        const createIndexBasedClassesUpdater = () => function(updates = {}) {
            Object.entries(updates).forEach(([index, classConfig]) => {
                try {
                    const numIndex = parseInt(index);
                    if (isNaN(numIndex)) return;
                    const element = getElementByIndex(numIndex);
                    if (element && element.nodeType === Node.ELEMENT_NODE) {
                        if (typeof classConfig === "string") {
                            element.className = classConfig;
                            return;
                        }
                        if (typeof classConfig === "object" && classConfig !== null) {
                            if (element.update && typeof element.update === "function") {
                                element.update({
                                    classList: classConfig
                                });
                            } else {
                                Object.entries(classConfig).forEach(([method, classes]) => {
                                    const classList = Array.isArray(classes) ? classes : [ classes ];
                                    switch (method) {
                                      case "add":
                                        element.classList.add(...classList);
                                        break;

                                      case "remove":
                                        element.classList.remove(...classList);
                                        break;

                                      case "toggle":
                                        classList.forEach(cls => element.classList.toggle(cls));
                                        break;

                                      case "replace":
                                        if (classList.length === 2) element.classList.replace(classList[0], classList[1]);
                                        break;
                                    }
                                });
                            }
                        }
                    }
                } catch (error) {
                    console.warn(`[DOM Helpers] Error updating classes at index ${index}: ${error.message}`);
                }
            });
            return this;
        };
        try {
            Object.defineProperty(collectionInstance, "textContent", {
                value: createIndexBasedUpdater("textContent"),
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(collectionInstance, "innerHTML", {
                value: createIndexBasedUpdater("innerHTML"),
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(collectionInstance, "value", {
                value: createIndexBasedUpdater("value"),
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(collectionInstance, "style", {
                value: createIndexBasedStyleUpdater(),
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(collectionInstance, "dataset", {
                value: createIndexBasedDatasetUpdater(),
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(collectionInstance, "classes", {
                value: createIndexBasedClassesUpdater(),
                writable: false,
                enumerable: false,
                configurable: true
            });
        } catch (error) {
            collectionInstance.textContent = createIndexBasedUpdater("textContent");
            collectionInstance.innerHTML = createIndexBasedUpdater("innerHTML");
            collectionInstance.value = createIndexBasedUpdater("value");
            collectionInstance.style = createIndexBasedStyleUpdater();
            collectionInstance.dataset = createIndexBasedDatasetUpdater();
            collectionInstance.classes = createIndexBasedClassesUpdater();
        }
        return collectionInstance;
    }
    function wrapCollectionsHelper(Collections) {
        if (!Collections) return;
        const originalClassName = Collections.ClassName;
        const originalTagName = Collections.TagName;
        const originalName = Collections.Name;
        Collections.ClassName = new Proxy(originalClassName, {
            get: (target, prop) => {
                const result = Reflect.get(target, prop);
                return enhanceCollectionInstance(result);
            },
            apply: (target, thisArg, args) => {
                const result = Reflect.apply(target, thisArg, args);
                return enhanceCollectionInstance(result);
            }
        });
        Collections.TagName = new Proxy(originalTagName, {
            get: (target, prop) => {
                const result = Reflect.get(target, prop);
                return enhanceCollectionInstance(result);
            },
            apply: (target, thisArg, args) => {
                const result = Reflect.apply(target, thisArg, args);
                return enhanceCollectionInstance(result);
            }
        });
        Collections.Name = new Proxy(originalName, {
            get: (target, prop) => {
                const result = Reflect.get(target, prop);
                return enhanceCollectionInstance(result);
            },
            apply: (target, thisArg, args) => {
                const result = Reflect.apply(target, thisArg, args);
                return enhanceCollectionInstance(result);
            }
        });
    }
    function initializeBulkUpdaters() {
        if (typeof global.Elements !== "undefined") {
            enhanceElementsHelper(global.Elements);
        }
        if (typeof global.Collections !== "undefined") {
            wrapCollectionsHelper(global.Collections);
        }
        if (typeof global.DOMHelpers !== "undefined") {
            global.DOMHelpers.BulkPropertyUpdaters = {
                version: "1.0.0",
                enhanceElementsHelper: enhanceElementsHelper,
                enhanceCollectionInstance: enhanceCollectionInstance,
                wrapCollectionsHelper: wrapCollectionsHelper
            };
        }
    }
    if (typeof global.Elements !== "undefined" || typeof global.Collections !== "undefined") {
        initializeBulkUpdaters();
    } else {
        if (typeof document !== "undefined") {
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", initializeBulkUpdaters);
            } else {
                setTimeout(initializeBulkUpdaters, 100);
            }
        }
    }
    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            enhanceElementsHelper: enhanceElementsHelper,
            enhanceCollectionInstance: enhanceCollectionInstance,
            wrapCollectionsHelper: wrapCollectionsHelper,
            initializeBulkUpdaters: initializeBulkUpdaters
        };
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return {
                enhanceElementsHelper: enhanceElementsHelper,
                enhanceCollectionInstance: enhanceCollectionInstance,
                wrapCollectionsHelper: wrapCollectionsHelper,
                initializeBulkUpdaters: initializeBulkUpdaters
            };
        });
    } else {
        global.BulkPropertyUpdaters = {
            enhanceElementsHelper: enhanceElementsHelper,
            enhanceCollectionInstance: enhanceCollectionInstance,
            wrapCollectionsHelper: wrapCollectionsHelper,
            initializeBulkUpdaters: initializeBulkUpdaters
        };
    }
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
 * DOM Helpers - Global Query Functions Enhancement
 * Adds global querySelector and querySelectorAll functions with .update() support
 * 
 * @version 1.0.0
 * @license MIT
 */
(function(global) {
    "use strict";
    const hasUpdateUtility = typeof global.EnhancedUpdateUtility !== "undefined";
    const hasBulkUpdaters = typeof global.BulkPropertyUpdaters !== "undefined";
    function enhanceElement(element) {
        if (!element || element._hasGlobalQueryUpdate) {
            return element;
        }
        if (hasUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
            return global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
        }
        try {
            Object.defineProperty(element, "update", {
                value: function(updates = {}) {
                    if (!updates || typeof updates !== "object") {
                        console.warn("[Global Query] .update() called with invalid updates object");
                        return element;
                    }
                    try {
                        Object.entries(updates).forEach(([key, value]) => {
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
                                    try {
                                        switch (method) {
                                          case "add":
                                            if (Array.isArray(classes)) {
                                                element.classList.add(...classes);
                                            } else if (typeof classes === "string") {
                                                element.classList.add(classes);
                                            }
                                            break;

                                          case "remove":
                                            if (Array.isArray(classes)) {
                                                element.classList.remove(...classes);
                                            } else if (typeof classes === "string") {
                                                element.classList.remove(classes);
                                            }
                                            break;

                                          case "toggle":
                                            if (Array.isArray(classes)) {
                                                classes.forEach(cls => element.classList.toggle(cls));
                                            } else if (typeof classes === "string") {
                                                element.classList.toggle(classes);
                                            }
                                            break;

                                          case "replace":
                                            if (Array.isArray(classes) && classes.length === 2) {
                                                element.classList.replace(classes[0], classes[1]);
                                            }
                                            break;
                                        }
                                    } catch (error) {
                                        console.warn(`[Global Query] Error in classList.${method}: ${error.message}`);
                                    }
                                });
                                return;
                            }
                            if (key === "setAttribute") {
                                if (Array.isArray(value) && value.length >= 2) {
                                    element.setAttribute(value[0], value[1]);
                                } else if (typeof value === "object" && value !== null) {
                                    Object.entries(value).forEach(([attrName, attrValue]) => {
                                        element.setAttribute(attrName, attrValue);
                                    });
                                }
                                return;
                            }
                            if (key === "removeAttribute") {
                                if (Array.isArray(value)) {
                                    value.forEach(attr => element.removeAttribute(attr));
                                } else if (typeof value === "string") {
                                    element.removeAttribute(value);
                                }
                                return;
                            }
                            if (key === "dataset" && typeof value === "object" && value !== null) {
                                Object.entries(value).forEach(([dataKey, dataValue]) => {
                                    element.dataset[dataKey] = dataValue;
                                });
                                return;
                            }
                            if (key === "addEventListener" && Array.isArray(value) && value.length >= 2) {
                                const [eventType, handler, options] = value;
                                element.addEventListener(eventType, handler, options);
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
                                element.setAttribute(key, value);
                            }
                        });
                    } catch (error) {
                        console.warn(`[Global Query] Error in .update(): ${error.message}`);
                    }
                    return element;
                },
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(element, "_hasGlobalQueryUpdate", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (error) {
            element.update = function(updates = {}) {
                Object.entries(updates).forEach(([key, value]) => {
                    if (key in element) {
                        element[key] = value;
                    }
                });
                return element;
            };
            element._hasGlobalQueryUpdate = true;
        }
        return element;
    }
    function enhanceNodeList(nodeList, selector) {
        if (!nodeList || nodeList._hasGlobalQueryUpdate) {
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
                return nodeList.item(index);
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
                return Array.from(nodeList);
            },
            forEach(callback, thisArg) {
                nodeList.forEach(callback, thisArg);
            },
            map(callback, thisArg) {
                return Array.from(nodeList).map(callback, thisArg);
            },
            filter(callback, thisArg) {
                return Array.from(nodeList).filter(callback, thisArg);
            },
            find(callback, thisArg) {
                return Array.from(nodeList).find(callback, thisArg);
            },
            some(callback, thisArg) {
                return Array.from(nodeList).some(callback, thisArg);
            },
            every(callback, thisArg) {
                return Array.from(nodeList).every(callback, thisArg);
            },
            reduce(callback, initialValue) {
                return Array.from(nodeList).reduce(callback, initialValue);
            },
            first() {
                return nodeList.length > 0 ? nodeList[0] : null;
            },
            last() {
                return nodeList.length > 0 ? nodeList[nodeList.length - 1] : null;
            },
            at(index) {
                if (index < 0) index = nodeList.length + index;
                return index >= 0 && index < nodeList.length ? nodeList[index] : null;
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
            },
            update(updates = {}) {
                if (!updates || typeof updates !== "object") {
                    console.warn("[Global Query] .update() called with invalid updates object");
                    return this;
                }
                const elements = Array.from(nodeList);
                if (elements.length === 0) {
                    console.info("[Global Query] .update() called on empty collection");
                    return this;
                }
                try {
                    elements.forEach(element => {
                        if (element && element.nodeType === Node.ELEMENT_NODE) {
                            Object.entries(updates).forEach(([key, value]) => {
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
                                            classList.forEach(cls => element.classList.toggle(cls));
                                            break;

                                          case "replace":
                                            if (classList.length === 2) element.classList.replace(classList[0], classList[1]);
                                            break;
                                        }
                                    });
                                    return;
                                }
                                if (key === "setAttribute") {
                                    if (Array.isArray(value) && value.length >= 2) {
                                        element.setAttribute(value[0], value[1]);
                                    } else if (typeof value === "object" && value !== null) {
                                        Object.entries(value).forEach(([attrName, attrValue]) => {
                                            element.setAttribute(attrName, attrValue);
                                        });
                                    }
                                    return;
                                }
                                if (key === "removeAttribute") {
                                    if (Array.isArray(value)) {
                                        value.forEach(attr => element.removeAttribute(attr));
                                    } else if (typeof value === "string") {
                                        element.removeAttribute(value);
                                    }
                                    return;
                                }
                                if (key === "dataset" && typeof value === "object" && value !== null) {
                                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                                        element.dataset[dataKey] = dataValue;
                                    });
                                    return;
                                }
                                if (key === "addEventListener") {
                                    if (Array.isArray(value) && value.length >= 2) {
                                        const [eventType, handler, options] = value;
                                        element.addEventListener(eventType, handler, options);
                                    } else if (typeof value === "object" && value !== null) {
                                        Object.entries(value).forEach(([eventType, handler]) => {
                                            if (typeof handler === "function") {
                                                element.addEventListener(eventType, handler);
                                            } else if (Array.isArray(handler) && handler.length >= 1) {
                                                const [handlerFunc, options] = handler;
                                                element.addEventListener(eventType, handlerFunc, options);
                                            }
                                        });
                                    }
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
                                if (typeof value === "string" || typeof value === "number") {
                                    element.setAttribute(key, value);
                                }
                            });
                        }
                    });
                } catch (error) {
                    console.warn(`[Global Query] Error in collection .update(): ${error.message}`);
                }
                return this;
            }
        };
        for (let i = 0; i < nodeList.length; i++) {
            Object.defineProperty(collection, i, {
                get() {
                    return nodeList[i];
                },
                enumerable: true
            });
        }
        collection[Symbol.iterator] = function*() {
            for (let i = 0; i < nodeList.length; i++) {
                yield nodeList[i];
            }
        };
        if (hasBulkUpdaters && global.BulkPropertyUpdaters.enhanceCollectionInstance) {
            global.BulkPropertyUpdaters.enhanceCollectionInstance(collection);
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
    function querySelector(selector, context = document) {
        if (typeof selector !== "string") {
            console.warn("[Global Query] querySelector requires a string selector");
            return null;
        }
        const element = context.querySelector(selector);
        return element ? enhanceElement(element) : element;
    }
    function querySelectorAll(selector, context = document) {
        if (typeof selector !== "string") {
            console.warn("[Global Query] querySelectorAll requires a string selector");
            return enhanceNodeList([], selector);
        }
        const nodeList = context.querySelectorAll(selector);
        return enhanceNodeList(nodeList, selector);
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
            return enhanceNodeList([], selector);
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
        version: "1.0.0",
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
    }
    if (typeof console !== "undefined" && console.log) {
        console.log("[DOM Helpers] Global querySelector/querySelectorAll functions available");
    }
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);