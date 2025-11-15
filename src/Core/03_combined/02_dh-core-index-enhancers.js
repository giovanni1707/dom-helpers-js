/**
 * DOM Helpers - Bulk Property Updates Extension
 * Adds convenient shorthand methods for bulk element updates
 * 
 * @version 1.0.0
 * @license MIT
 */
(function(global) {
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
 * Conditions.whenState() - Works with or without Reactive State
 * @version 4.0.0 - Refactored for clarity, scalability, and maintainability
 * @license MIT
 */
(function(global) {
    "use strict";
    const hasReactiveUtils = !!global.ReactiveUtils;
    const hasElements = !!global.Elements;
    const hasCollections = !!global.Collections;
    const hasSelector = !!global.Selector;
    let effect, batch, isReactive;
    if (hasReactiveUtils) {
        effect = global.ReactiveUtils.effect;
        batch = global.ReactiveUtils.batch;
        isReactive = global.ReactiveUtils.isReactive;
    } else if (hasElements && typeof global.Elements.effect === "function") {
        effect = global.Elements.effect;
        batch = global.Elements.batch;
        isReactive = global.Elements.isReactive;
    }
    const hasReactivity = !!(effect && batch);
    const conditionMatchers = {
        booleanTrue: {
            test: condition => condition === "true",
            match: value => value === true
        },
        booleanFalse: {
            test: condition => condition === "false",
            match: value => value === false
        },
        truthy: {
            test: condition => condition === "truthy",
            match: value => !!value
        },
        falsy: {
            test: condition => condition === "falsy",
            match: value => !value
        },
        null: {
            test: condition => condition === "null",
            match: value => value === null
        },
        undefined: {
            test: condition => condition === "undefined",
            match: value => value === undefined
        },
        empty: {
            test: condition => condition === "empty",
            match: value => {
                if (value === null || value === undefined) return true;
                if (typeof value === "string") return value.length === 0;
                if (Array.isArray(value)) return value.length === 0;
                if (typeof value === "object") return Object.keys(value).length === 0;
                return !value;
            }
        },
        quotedString: {
            test: condition => condition.startsWith('"') && condition.endsWith('"') || condition.startsWith("'") && condition.endsWith("'"),
            match: (value, condition) => String(value) === condition.slice(1, -1)
        },
        includes: {
            test: condition => condition.startsWith("includes:"),
            match: (value, condition) => {
                const searchTerm = condition.slice(9).trim();
                return String(value).includes(searchTerm);
            }
        },
        startsWith: {
            test: condition => condition.startsWith("startsWith:"),
            match: (value, condition) => {
                const prefix = condition.slice(11).trim();
                return String(value).startsWith(prefix);
            }
        },
        endsWith: {
            test: condition => condition.startsWith("endsWith:"),
            match: (value, condition) => {
                const suffix = condition.slice(9).trim();
                return String(value).endsWith(suffix);
            }
        },
        regex: {
            test: condition => condition.startsWith("/") && condition.lastIndexOf("/") > 0,
            match: (value, condition) => {
                try {
                    const lastSlash = condition.lastIndexOf("/");
                    const pattern = condition.slice(1, lastSlash);
                    const flags = condition.slice(lastSlash + 1);
                    const regex = new RegExp(pattern, flags);
                    return regex.test(String(value));
                } catch (e) {
                    console.warn("[Conditions] Invalid regex pattern:", condition, e);
                    return false;
                }
            }
        },
        numericRange: {
            test: (condition, value) => typeof value === "number" && condition.includes("-") && !condition.startsWith("<") && !condition.startsWith(">") && !condition.startsWith("="),
            match: (value, condition) => {
                const parts = condition.split("-").map(p => p.trim());
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    const [min, max] = parts.map(Number);
                    return value >= min && value <= max;
                }
                return false;
            }
        },
        numericExact: {
            test: (condition, value) => typeof value === "number" && !isNaN(condition),
            match: (value, condition) => value === Number(condition)
        },
        greaterThanOrEqual: {
            test: (condition, value) => typeof value === "number" && condition.startsWith(">="),
            match: (value, condition) => {
                const target = Number(condition.slice(2).trim());
                return !isNaN(target) && value >= target;
            }
        },
        lessThanOrEqual: {
            test: (condition, value) => typeof value === "number" && condition.startsWith("<="),
            match: (value, condition) => {
                const target = Number(condition.slice(2).trim());
                return !isNaN(target) && value <= target;
            }
        },
        greaterThan: {
            test: (condition, value) => typeof value === "number" && condition.startsWith(">") && !condition.startsWith(">="),
            match: (value, condition) => {
                const target = Number(condition.slice(1).trim());
                return !isNaN(target) && value > target;
            }
        },
        lessThan: {
            test: (condition, value) => typeof value === "number" && condition.startsWith("<") && !condition.startsWith("<="),
            match: (value, condition) => {
                const target = Number(condition.slice(1).trim());
                return !isNaN(target) && value < target;
            }
        },
        stringEquality: {
            test: () => true,
            match: (value, condition) => String(value) === condition
        }
    };
    function matchesCondition(value, condition) {
        condition = String(condition).trim();
        for (const matcher of Object.values(conditionMatchers)) {
            if (matcher.test(condition, value)) {
                return matcher.match(value, condition);
            }
        }
        return false;
    }
    function registerConditionMatcher(name, matcher) {
        if (!matcher.test || !matcher.match) {
            console.error("[Conditions] Invalid matcher. Must have test() and match() methods.");
            return;
        }
        conditionMatchers[name] = matcher;
    }
    const propertyHandlers = {
        style: {
            test: (key, val) => key === "style" && typeof val === "object" && val !== null,
            apply: (element, val) => {
                Object.entries(val).forEach(([prop, value]) => {
                    if (value !== null && value !== undefined) {
                        element.style[prop] = value;
                    }
                });
            }
        },
        classList: {
            test: (key, val) => key === "classList" && typeof val === "object" && val !== null,
            apply: (element, val) => {
                if (Array.isArray(val)) {
                    element.className = "";
                    val.forEach(cls => cls && element.classList.add(cls));
                } else {
                    const operations = {
                        add: classes => {
                            const classList = Array.isArray(classes) ? classes : [ classes ];
                            classList.forEach(cls => cls && element.classList.add(cls));
                        },
                        remove: classes => {
                            const classList = Array.isArray(classes) ? classes : [ classes ];
                            classList.forEach(cls => cls && element.classList.remove(cls));
                        },
                        toggle: classes => {
                            const classList = Array.isArray(classes) ? classes : [ classes ];
                            classList.forEach(cls => cls && element.classList.toggle(cls));
                        },
                        replace: classes => {
                            if (Array.isArray(classes) && classes.length === 2) {
                                element.classList.replace(classes[0], classes[1]);
                            }
                        }
                    };
                    Object.entries(val).forEach(([method, classes]) => {
                        if (operations[method]) {
                            operations[method](classes);
                        }
                    });
                }
            }
        },
        setAttribute: {
            test: (key, val) => (key === "attrs" || key === "setAttribute") && typeof val === "object" && val !== null,
            apply: (element, val) => {
                Object.entries(val).forEach(([attr, attrVal]) => {
                    if (attrVal === null || attrVal === undefined || attrVal === false) {
                        element.removeAttribute(attr);
                    } else {
                        element.setAttribute(attr, String(attrVal));
                    }
                });
            }
        },
        removeAttribute: {
            test: key => key === "removeAttribute",
            apply: (element, val) => {
                if (Array.isArray(val)) {
                    val.forEach(attr => element.removeAttribute(attr));
                } else if (typeof val === "string") {
                    element.removeAttribute(val);
                }
            }
        },
        dataset: {
            test: (key, val) => key === "dataset" && typeof val === "object" && val !== null,
            apply: (element, val) => {
                Object.entries(val).forEach(([dataKey, dataVal]) => {
                    element.dataset[dataKey] = String(dataVal);
                });
            }
        },
        addEventListener: {
            test: (key, val) => key === "addEventListener" && typeof val === "object" && val !== null,
            apply: (element, val) => {
                if (!element._whenStateListeners) {
                    element._whenStateListeners = [];
                }
                Object.entries(val).forEach(([event, handlerConfig]) => {
                    let handler, options;
                    if (typeof handlerConfig === "function") {
                        handler = handlerConfig;
                        options = undefined;
                    } else if (typeof handlerConfig === "object" && handlerConfig !== null) {
                        handler = handlerConfig.handler;
                        options = handlerConfig.options;
                    }
                    if (handler && typeof handler === "function") {
                        element.addEventListener(event, handler, options);
                        element._whenStateListeners.push({
                            event: event,
                            handler: handler,
                            options: options
                        });
                    }
                });
            }
        },
        removeEventListener: {
            test: (key, val) => key === "removeEventListener" && Array.isArray(val) && val.length >= 2,
            apply: (element, val) => {
                const [event, handler, options] = val;
                element.removeEventListener(event, handler, options);
            }
        },
        eventProperty: {
            test: (key, val) => key.startsWith("on") && typeof val === "function",
            apply: (element, val, key) => {
                element[key] = val;
            }
        },
        nativeProperty: {
            test: (key, val, element) => key in element,
            apply: (element, val, key) => {
                element[key] = val;
            }
        },
        fallback: {
            test: (key, val) => typeof val === "string" || typeof val === "number" || typeof val === "boolean",
            apply: (element, val, key) => {
                element.setAttribute(key, String(val));
            }
        }
    };
    function applyProperty(element, key, val) {
        for (const handler of Object.values(propertyHandlers)) {
            if (handler.test(key, val, element)) {
                handler.apply(element, val, key);
                return;
            }
        }
    }
    function registerPropertyHandler(name, handler) {
        if (!handler.test || !handler.apply) {
            console.error("[Conditions] Invalid handler. Must have test() and apply() methods.");
            return;
        }
        const entries = Object.entries(propertyHandlers);
        const fallback = entries.pop();
        propertyHandlers[name] = handler;
        if (fallback) {
            propertyHandlers[fallback[0]] = fallback[1];
        }
    }
    function getElements(selector) {
        if (selector instanceof Element) {
            return [ selector ];
        }
        if (selector instanceof NodeList || selector instanceof HTMLCollection) {
            return Array.from(selector);
        }
        if (Array.isArray(selector)) {
            return selector.filter(el => el instanceof Element);
        }
        if (typeof selector === "string") {
            if (selector.startsWith("#")) {
                const id = selector.slice(1);
                if (hasElements && global.Elements[id]) {
                    return [ global.Elements[id] ];
                }
                const el = document.getElementById(id);
                return el ? [ el ] : [];
            }
            if (selector.startsWith(".")) {
                const className = selector.slice(1);
                if (hasCollections && global.Collections.ClassName) {
                    const collection = global.Collections.ClassName[className];
                    return collection ? Array.from(collection) : [];
                }
                return Array.from(document.getElementsByClassName(className));
            }
            if (hasSelector && global.Selector.queryAll) {
                const result = global.Selector.queryAll(selector);
                return result ? Array.from(result) : [];
            }
            return Array.from(document.querySelectorAll(selector));
        }
        return [];
    }
    function cleanupListeners(element) {
        if (element._whenStateListeners) {
            element._whenStateListeners.forEach(({event: event, handler: handler, options: options}) => {
                element.removeEventListener(event, handler, options);
            });
            element._whenStateListeners = [];
        }
    }
    function applyConfig(element, config, currentValue) {
        if (element.update && typeof element.update === "function") {
            try {
                element.update(config);
                return;
            } catch (e) {
                console.warn("[Conditions] Error using element.update():", e);
            }
        }
        Object.entries(config).forEach(([key, val]) => {
            try {
                applyProperty(element, key, val);
            } catch (e) {
                console.warn(`[Conditions] Failed to apply ${key}:`, e);
            }
        });
    }
    function applyConditions(getValue, conditions, selector) {
        const elements = getElements(selector);
        if (!elements || elements.length === 0) {
            console.warn("[Conditions] No elements found for selector:", selector);
            return;
        }
        let value;
        try {
            value = getValue();
        } catch (e) {
            console.error("[Conditions] Error getting value:", e);
            return;
        }
        let conditionsObj;
        try {
            conditionsObj = typeof conditions === "function" ? conditions() : conditions;
        } catch (e) {
            console.error("[Conditions] Error evaluating conditions:", e);
            return;
        }
        elements.forEach(element => {
            cleanupListeners(element);
            for (const [condition, config] of Object.entries(conditionsObj)) {
                if (matchesCondition(value, condition)) {
                    applyConfig(element, config, value);
                    break;
                }
            }
        });
    }
    const Conditions = {
        whenState(valueFn, conditions, selector, options = {}) {
            if (!conditions || typeof conditions !== "object" && typeof conditions !== "function") {
                console.error("[Conditions] Second argument must be an object or function returning an object");
                return;
            }
            const useReactive = options.reactive !== false && hasReactivity;
            const isFunction = typeof valueFn === "function";
            const getValue = isFunction ? valueFn : () => valueFn;
            const valueIsReactiveState = isFunction && hasReactivity && typeof isReactive === "function" && isReactive(valueFn());
            if (useReactive && (isFunction || valueIsReactiveState)) {
                return effect(() => {
                    applyConditions(getValue, conditions, selector);
                });
            } else {
                applyConditions(getValue, conditions, selector);
                return {
                    update: () => applyConditions(getValue, conditions, selector),
                    destroy: () => {}
                };
            }
        },
        apply(value, conditions, selector) {
            const getValue = typeof value === "function" ? value : () => value;
            applyConditions(getValue, conditions, selector);
            return this;
        },
        watch(valueFn, conditions, selector) {
            if (!hasReactivity) {
                console.warn("[Conditions] watch() requires reactive library");
                return this.apply(valueFn, conditions, selector);
            }
            return this.whenState(valueFn, conditions, selector, {
                reactive: true
            });
        },
        batch(fn) {
            if (batch && typeof batch === "function") {
                return batch(fn);
            }
            return fn();
        },
        registerMatcher(name, matcher) {
            registerConditionMatcher(name, matcher);
            return this;
        },
        registerHandler(name, handler) {
            registerPropertyHandler(name, handler);
            return this;
        },
        getMatchers() {
            return Object.keys(conditionMatchers);
        },
        getHandlers() {
            return Object.keys(propertyHandlers);
        },
        get hasReactivity() {
            return hasReactivity;
        },
        get mode() {
            return hasReactivity ? "reactive" : "static";
        }
    };
    global.Conditions = Conditions;
    if (hasElements) {
        global.Elements.whenState = Conditions.whenState;
        global.Elements.whenApply = Conditions.apply;
        global.Elements.whenWatch = Conditions.watch;
    }
    if (hasCollections) {
        global.Collections.whenState = Conditions.whenState;
        global.Collections.whenApply = Conditions.apply;
        global.Collections.whenWatch = Conditions.watch;
    }
    if (hasSelector) {
        global.Selector.whenState = Conditions.whenState;
        global.Selector.whenApply = Conditions.apply;
        global.Selector.whenWatch = Conditions.watch;
    }
    console.log("[Conditions] v4.0.0 loaded successfully");
    console.log("[Conditions] Mode:", hasReactivity ? "Reactive + Static" : "Static only");
    console.log("[Conditions] Features:");
    console.log("  - Declarative condition matching with strategy pattern");
    console.log("  - Extensible via registerMatcher() and registerHandler()");
    console.log("  - Full backward compatibility maintained");
    console.log("  - Production-ready with enhanced error handling");
})(typeof window !== "undefined" ? window : global);

/**
 * Conditions Default Branch Extension
 * @version 1.0.0
 * @description Adds explicit default branch support to Conditions.whenState()
 * @requires Conditions.js v4.0.0+
 * @license MIT
 */
(function(global) {
    "use strict";
    if (!global.Conditions) {
        console.error("[Conditions.Default] Requires Conditions.js to be loaded first");
        return;
    }
    const Conditions = global.Conditions;
    const _originalWhenState = Conditions.whenState;
    const _originalApply = Conditions.apply;
    const _originalWatch = Conditions.watch;
    function wrapConditionsWithDefault(conditions) {
        const conditionsObj = typeof conditions === "function" ? conditions() : conditions;
        if (!("default" in conditionsObj)) {
            return conditions;
        }
        const {default: defaultConfig, ...regularConditions} = conditionsObj;
        return function() {
            const currentConditions = typeof conditions === "function" ? conditions() : conditions;
            const {default: currentDefault, ...currentRegular} = currentConditions;
            return {
                ...currentRegular,
                "/^[\\s\\S]*$/": currentDefault
            };
        };
    }
    Conditions.whenState = function(valueFn, conditions, selector, options = {}) {
        const wrappedConditions = wrapConditionsWithDefault(conditions);
        return _originalWhenState.call(this, valueFn, wrappedConditions, selector, options);
    };
    Conditions.apply = function(value, conditions, selector) {
        const wrappedConditions = wrapConditionsWithDefault(conditions);
        return _originalApply.call(this, value, wrappedConditions, selector);
    };
    Conditions.watch = function(valueFn, conditions, selector) {
        const wrappedConditions = wrapConditionsWithDefault(conditions);
        return _originalWatch.call(this, valueFn, wrappedConditions, selector);
    };
    Conditions.batch = Conditions.batch;
    Conditions.registerMatcher = Conditions.registerMatcher;
    Conditions.registerHandler = Conditions.registerHandler;
    Conditions.getMatchers = Conditions.getMatchers;
    Conditions.getHandlers = Conditions.getHandlers;
    if (global.Elements) {
        global.Elements.whenState = Conditions.whenState;
        global.Elements.whenApply = Conditions.apply;
        global.Elements.whenWatch = Conditions.watch;
    }
    if (global.Collections) {
        global.Collections.whenState = Conditions.whenState;
        global.Collections.whenApply = Conditions.apply;
        global.Collections.whenWatch = Conditions.watch;
    }
    if (global.Selector) {
        global.Selector.whenState = Conditions.whenState;
        global.Selector.whenApply = Conditions.apply;
        global.Selector.whenWatch = Conditions.watch;
    }
    Conditions.restoreOriginal = function() {
        Conditions.whenState = _originalWhenState;
        Conditions.apply = _originalApply;
        Conditions.watch = _originalWatch;
        console.log("[Conditions.Default] Original methods restored");
    };
    Conditions.extensions = Conditions.extensions || {};
    Conditions.extensions.defaultBranch = "1.0.0";
    console.log("[Conditions.Default] v1.0.0 loaded");
    console.log("[Conditions.Default] ✓ Non-invasive wrapper active");
    console.log("[Conditions.Default] ✓ Original functionality preserved");
    console.log("[Conditions.Default] ✓ Use Conditions.restoreOriginal() to revert if needed");
})(typeof window !== "undefined" ? window : global);

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