/**
 * 10a_dh-conditional-rendering
 * 
 * Conditions.whenState() - Works with or without Reactive State
 * @version 4.0.1 - Fixed Proxy/Symbol iterator issue with Collections
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
    function toArray(collection) {
        if (!collection) return [];
        if (Array.isArray(collection)) {
            return collection;
        }
        if (collection instanceof NodeList || collection instanceof HTMLCollection) {
            return Array.from(collection);
        }
        if (typeof collection === "object" && "length" in collection) {
            try {
                return Array.from(collection);
            } catch (e) {
                const arr = [];
                const len = collection.length;
                for (let i = 0; i < len; i++) {
                    if (i in collection) {
                        arr.push(collection[i]);
                    }
                }
                return arr;
            }
        }
        return [];
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
                    if (collection) {
                        return toArray(collection);
                    }
                }
                return Array.from(document.getElementsByClassName(className));
            }
            if (hasSelector && global.Selector.queryAll) {
                const result = global.Selector.queryAll(selector);
                return result ? toArray(result) : [];
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
    console.log("[Conditions] v4.0.1 loaded successfully");
    console.log("[Conditions] Mode:", hasReactivity ? "Reactive + Static" : "Static only");
    console.log("[Conditions] Features:");
    console.log("  - Declarative condition matching with strategy pattern");
    console.log("  - Extensible via registerMatcher() and registerHandler()");
    console.log("  - Full backward compatibility maintained");
    console.log("  - Production-ready with enhanced error handling");
    console.log("  - Fixed: Proxy/Symbol iterator compatibility");
})(typeof window !== "undefined" ? window : global);

/**
 * 10b_dh-conditions-default
 * 
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
 * 10c_dh-conditions-collection-extension
 * 
 * Conditions Collection Extension
 * Adds collection-level conditional updates with index support
 * 
 * @version 1.0.0
 * @requires Conditions.js v4.0.0+
 * @license MIT
 */
(function(global) {
    "use strict";
    if (!global.Conditions) {
        console.error("[Conditions.Collection] Requires Conditions.js");
        return;
    }
    const Conditions = global.Conditions;
    function whenStateCollection(valueFn, conditions, selector, options = {}) {
        const hasReactivity = Conditions.hasReactivity;
        const useReactive = options.reactive !== false && hasReactivity;
        const getValue = typeof valueFn === "function" ? valueFn : () => valueFn;
        function applyToCollection() {
            let collection;
            if (typeof selector === "string") {
                if (selector.startsWith(".") && global.ClassName) {
                    const className = selector.slice(1);
                    collection = global.ClassName[className];
                } else if (selector.startsWith("#")) {
                    return Conditions.whenState(valueFn, conditions, selector, options);
                } else if (global.querySelectorAll) {
                    collection = global.querySelectorAll(selector);
                } else {
                    collection = document.querySelectorAll(selector);
                }
            } else if (selector instanceof Element) {
                collection = [ selector ];
            } else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
                collection = selector;
            } else if (Array.isArray(selector)) {
                collection = selector;
            } else {
                console.warn("[Conditions.Collection] Invalid selector");
                return;
            }
            if (!collection || collection.length === 0) {
                console.warn("[Conditions.Collection] No elements found");
                return;
            }
            let value;
            try {
                value = getValue();
            } catch (e) {
                console.error("[Conditions.Collection] Error getting value:", e);
                return;
            }
            let conditionsObj;
            try {
                conditionsObj = typeof conditions === "function" ? conditions() : conditions;
            } catch (e) {
                console.error("[Conditions.Collection] Error evaluating conditions:", e);
                return;
            }
            let matchingConfig = null;
            for (const [condition, config] of Object.entries(conditionsObj)) {
                if (matchCondition(value, condition)) {
                    matchingConfig = config;
                    break;
                }
            }
            if (!matchingConfig) {
                console.info("[Conditions.Collection] No matching condition for value:", value);
                return;
            }
            if (collection.update && typeof collection.update === "function") {
                try {
                    collection.update(matchingConfig);
                } catch (e) {
                    console.warn("[Conditions.Collection] Error using collection.update():", e);
                    applyManually(collection, matchingConfig);
                }
            } else {
                applyManually(collection, matchingConfig);
            }
        }
        function applyManually(collection, config) {
            const elements = Array.from(collection);
            const indexUpdates = {};
            const bulkUpdates = {};
            Object.entries(config).forEach(([key, value]) => {
                if (/^-?\d+$/.test(key)) {
                    indexUpdates[key] = value;
                } else {
                    bulkUpdates[key] = value;
                }
            });
            if (Object.keys(bulkUpdates).length > 0) {
                elements.forEach(element => {
                    if (element && element.update) {
                        element.update(bulkUpdates);
                    }
                });
            }
            Object.entries(indexUpdates).forEach(([indexStr, updates]) => {
                let index = parseInt(indexStr);
                if (index < 0) index = elements.length + index;
                const element = elements[index];
                if (element && element.update) {
                    element.update(updates);
                }
            });
        }
        function matchCondition(value, condition) {
            condition = String(condition).trim();
            if (Conditions._matchCondition) {
                return Conditions._matchCondition(value, condition);
            }
            if (condition === "true") return value === true;
            if (condition === "false") return value === false;
            if (condition === "truthy") return !!value;
            if (condition === "falsy") return !value;
            return String(value) === condition;
        }
        if (useReactive) {
            if (global.ReactiveUtils && global.ReactiveUtils.effect) {
                return global.ReactiveUtils.effect(applyToCollection);
            } else if (global.Elements && global.Elements.effect) {
                return global.Elements.effect(applyToCollection);
            }
        }
        applyToCollection();
        return {
            update: applyToCollection,
            destroy: () => {}
        };
    }
    Conditions.whenStateCollection = whenStateCollection;
    Conditions.whenCollection = whenStateCollection;
    console.log("[Conditions.Collection] v1.0.0 loaded");
    console.log("[Conditions.Collection] ✓ Supports bulk + index updates in conditions");
})(typeof window !== "undefined" ? window : global);

/**
 * 10d_Conditions.apply() - Standalone Collection-Aware Implementation
 * Works independently without requiring DOM Helpers
 * Supports index-specific updates + shared properties
 * 
 * @version 1.0.0
 * @license MIT
 */
(function(global) {
    "use strict";
    function safeArrayFrom(collection) {
        if (!collection) return [];
        if (Array.isArray(collection)) {
            return collection;
        }
        if (collection instanceof NodeList || collection instanceof HTMLCollection) {
            return Array.from(collection);
        }
        if (typeof collection === "object" && "length" in collection) {
            const elements = [];
            const len = Number(collection.length);
            if (!isNaN(len) && len >= 0) {
                for (let i = 0; i < len; i++) {
                    if (Object.prototype.hasOwnProperty.call(collection, i)) {
                        const item = collection[i];
                        if (item instanceof Element) {
                            elements.push(item);
                        }
                    }
                }
            }
            return elements;
        }
        return [];
    }
    function getElements(selector) {
        if (selector instanceof Element) {
            return [ selector ];
        }
        if (selector instanceof NodeList || selector instanceof HTMLCollection) {
            return safeArrayFrom(selector);
        }
        if (Array.isArray(selector)) {
            return selector.filter(el => el instanceof Element);
        }
        if (typeof selector === "string") {
            if (selector.startsWith("#")) {
                const el = document.getElementById(selector.slice(1));
                return el ? [ el ] : [];
            }
            if (selector.startsWith(".")) {
                return safeArrayFrom(document.getElementsByClassName(selector.slice(1)));
            }
            return safeArrayFrom(document.querySelectorAll(selector));
        }
        return [];
    }
    function matchesCondition(value, condition) {
        condition = String(condition).trim();
        if (condition === "true") return value === true;
        if (condition === "false") return value === false;
        if (condition === "truthy") return !!value;
        if (condition === "falsy") return !value;
        if (condition === "null") return value === null;
        if (condition === "undefined") return value === undefined;
        if (condition === "empty") {
            if (value === null || value === undefined) return true;
            if (typeof value === "string") return value.length === 0;
            if (Array.isArray(value)) return value.length === 0;
            if (typeof value === "object") return Object.keys(value).length === 0;
            return !value;
        }
        if (condition.startsWith('"') && condition.endsWith('"') || condition.startsWith("'") && condition.endsWith("'")) {
            return String(value) === condition.slice(1, -1);
        }
        if (condition.startsWith("includes:")) {
            return String(value).includes(condition.slice(9).trim());
        }
        if (condition.startsWith("startsWith:")) {
            return String(value).startsWith(condition.slice(11).trim());
        }
        if (condition.startsWith("endsWith:")) {
            return String(value).endsWith(condition.slice(9).trim());
        }
        if (condition.startsWith("/") && condition.lastIndexOf("/") > 0) {
            try {
                const lastSlash = condition.lastIndexOf("/");
                const pattern = condition.slice(1, lastSlash);
                const flags = condition.slice(lastSlash + 1);
                const regex = new RegExp(pattern, flags);
                return regex.test(String(value));
            } catch (e) {
                console.warn("[Conditions] Invalid regex:", condition);
                return false;
            }
        }
        if (typeof value === "number") {
            if (condition.includes("-") && !condition.startsWith("<") && !condition.startsWith(">") && !condition.startsWith("=")) {
                const parts = condition.split("-").map(p => p.trim());
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    const [min, max] = parts.map(Number);
                    return value >= min && value <= max;
                }
            }
            if (!isNaN(condition)) {
                return value === Number(condition);
            }
            if (condition.startsWith(">=")) {
                const target = Number(condition.slice(2).trim());
                return !isNaN(target) && value >= target;
            }
            if (condition.startsWith("<=")) {
                const target = Number(condition.slice(2).trim());
                return !isNaN(target) && value <= target;
            }
            if (condition.startsWith(">") && !condition.startsWith(">=")) {
                const target = Number(condition.slice(1).trim());
                return !isNaN(target) && value > target;
            }
            if (condition.startsWith("<") && !condition.startsWith("<=")) {
                const target = Number(condition.slice(1).trim());
                return !isNaN(target) && value < target;
            }
        }
        return String(value) === condition;
    }
    function applyProperty(element, key, val) {
        try {
            if (key === "style" && typeof val === "object" && val !== null) {
                Object.entries(val).forEach(([prop, value]) => {
                    if (value !== null && value !== undefined) {
                        element.style[prop] = value;
                    }
                });
                return;
            }
            if (key === "classList" && typeof val === "object" && val !== null) {
                if (Array.isArray(val)) {
                    element.className = "";
                    val.forEach(cls => cls && element.classList.add(cls));
                } else {
                    if (val.add) {
                        const classes = Array.isArray(val.add) ? val.add : [ val.add ];
                        classes.forEach(cls => cls && element.classList.add(cls));
                    }
                    if (val.remove) {
                        const classes = Array.isArray(val.remove) ? val.remove : [ val.remove ];
                        classes.forEach(cls => cls && element.classList.remove(cls));
                    }
                    if (val.toggle) {
                        const classes = Array.isArray(val.toggle) ? val.toggle : [ val.toggle ];
                        classes.forEach(cls => cls && element.classList.toggle(cls));
                    }
                }
                return;
            }
            if ((key === "attrs" || key === "setAttribute") && typeof val === "object" && val !== null) {
                Object.entries(val).forEach(([attr, attrVal]) => {
                    if (attrVal === null || attrVal === undefined || attrVal === false) {
                        element.removeAttribute(attr);
                    } else {
                        element.setAttribute(attr, String(attrVal));
                    }
                });
                return;
            }
            if (key === "removeAttribute") {
                if (Array.isArray(val)) {
                    val.forEach(attr => element.removeAttribute(attr));
                } else if (typeof val === "string") {
                    element.removeAttribute(val);
                }
                return;
            }
            if (key === "dataset" && typeof val === "object" && val !== null) {
                Object.entries(val).forEach(([dataKey, dataVal]) => {
                    element.dataset[dataKey] = String(dataVal);
                });
                return;
            }
            if (key === "addEventListener" && typeof val === "object" && val !== null) {
                Object.entries(val).forEach(([event, handlerConfig]) => {
                    let handler, options;
                    if (typeof handlerConfig === "function") {
                        handler = handlerConfig;
                    } else if (typeof handlerConfig === "object" && handlerConfig !== null) {
                        handler = handlerConfig.handler;
                        options = handlerConfig.options;
                    }
                    if (handler && typeof handler === "function") {
                        element.addEventListener(event, handler, options);
                    }
                });
                return;
            }
            if (key.startsWith("on") && typeof val === "function") {
                element[key] = val;
                return;
            }
            if (key in element) {
                element[key] = val;
                return;
            }
            if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
                element.setAttribute(key, String(val));
            }
        } catch (e) {
            console.warn(`[Conditions] Failed to apply ${key}:`, e);
        }
    }
    function applyConfig(element, config) {
        Object.entries(config).forEach(([key, val]) => {
            applyProperty(element, key, val);
        });
    }
    function applyToCollection(elements, config) {
        const sharedProps = {};
        const indexProps = {};
        Object.entries(config).forEach(([key, value]) => {
            if (/^-?\d+$/.test(key)) {
                indexProps[key] = value;
            } else {
                sharedProps[key] = value;
            }
        });
        if (Object.keys(sharedProps).length > 0) {
            elements.forEach(element => {
                applyConfig(element, sharedProps);
            });
        }
        Object.entries(indexProps).forEach(([indexStr, updates]) => {
            let index = parseInt(indexStr);
            if (index < 0) {
                index = elements.length + index;
            }
            if (index >= 0 && index < elements.length) {
                const element = elements[index];
                applyConfig(element, updates);
            }
        });
    }
    const ConditionsApply = {
        apply(value, conditions, selector) {
            const elements = getElements(selector);
            if (!elements || elements.length === 0) {
                console.warn("[Conditions] No elements found for selector:", selector);
                return this;
            }
            const conditionsObj = typeof conditions === "function" ? conditions() : conditions;
            if (!conditionsObj || typeof conditionsObj !== "object") {
                console.error("[Conditions] Conditions must be an object");
                return this;
            }
            let matchingConfig = null;
            for (const [condition, config] of Object.entries(conditionsObj)) {
                if (matchesCondition(value, condition)) {
                    matchingConfig = config;
                    break;
                }
            }
            if (!matchingConfig) {
                console.info("[Conditions] No matching condition for value:", value);
                return this;
            }
            applyToCollection(elements, matchingConfig);
            return this;
        },
        batch(fn) {
            if (typeof fn === "function") {
                fn();
            }
            return this;
        },
        getElements(selector) {
            return getElements(selector);
        },
        testCondition(value, condition) {
            return matchesCondition(value, condition);
        }
    };
    if (!global.Conditions) {
        global.Conditions = {};
    }
    global.Conditions.apply = ConditionsApply.apply.bind(ConditionsApply);
    global.Conditions.batch = ConditionsApply.batch.bind(ConditionsApply);
    global.ConditionsApply = ConditionsApply;
    console.log("[Conditions.apply] Standalone v1.0.0 loaded");
    console.log("[Conditions.apply] ✓ Collection-aware with index support");
    console.log("[Conditions.apply] ✓ Works independently");
})(typeof window !== "undefined" ? window : global);