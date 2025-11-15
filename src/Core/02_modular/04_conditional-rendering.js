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