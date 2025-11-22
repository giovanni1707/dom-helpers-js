/**
 * DOM Helpers - Form Module
 * Specialized form handling utilities that integrate with the main DOM Helpers library
 * 
 * Features:
 * - Forms object for accessing forms by ID
 * - Automatic form value extraction and setting
 * - Declarative form handling with .update() method
 * - Seamless integration with Elements, Collections, and Selector
 * - Enhanced form validation and submission handling
 * 
 * @version 1.0.0
 * @license MIT
 */
(function(global) {
    "use strict";
    if (typeof global.Elements === "undefined" && typeof Elements === "undefined") {
        console.warn("[DOM Helpers Form] Main DOM Helpers library must be loaded before the Form module");
        return;
    }
    function enhanceFormWithFormMethods(form) {
        if (!form || form._hasFormMethods) {
            return form;
        }
        Object.defineProperty(form, "_hasFormMethods", {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
        });
        Object.defineProperty(form, "values", {
            get: function() {
                return getFormValues(form);
            },
            set: function(values) {
                setFormValues(form, values);
            },
            enumerable: true,
            configurable: true
        });
        const originalReset = form.reset;
        form.reset = function(options = {}) {
            if (options.clearCustom !== false) {
                clearFormValidation(form);
            }
            originalReset.call(form);
            form.dispatchEvent(new CustomEvent("formreset", {
                detail: {
                    form: form
                },
                bubbles: true
            }));
            return form;
        };
        form.validate = function(rules = {}) {
            return validateForm(form, rules);
        };
        form.clearValidation = function() {
            clearFormValidation(form);
            return form;
        };
        form.submitData = function(options = {}) {
            return submitFormData(form, options);
        };
        form.getField = function(name) {
            return getFormField(form, name);
        };
        form.setField = function(name, value) {
            setFormField(form, name, value);
            return form;
        };
        form.serialize = function(format = "object") {
            return serializeForm(form, format);
        };
        return form;
    }
    function getFormValues(form) {
        const values = {};
        const formData = new FormData(form);
        for (const [name, value] of formData.entries()) {
            if (values[name]) {
                if (Array.isArray(values[name])) {
                    values[name].push(value);
                } else {
                    values[name] = [ values[name], value ];
                }
            } else {
                values[name] = value;
            }
        }
        const inputs = form.querySelectorAll('input[type="checkbox"], input[type="radio"]');
        inputs.forEach(input => {
            if (!input.checked && input.name && !values.hasOwnProperty(input.name)) {
                if (input.type === "checkbox") {
                    values[input.name] = false;
                }
            }
        });
        return values;
    }
    function setFormValues(form, values) {
        if (!values || typeof values !== "object") {
            console.warn("[DOM Helpers Form] Invalid values object provided to setFormValues");
            return;
        }
        Object.entries(values).forEach(([name, value]) => {
            setFormField(form, name, value);
        });
    }
    function getFormField(form, name) {
        let field = form.querySelector(`[name="${name}"]`);
        if (!field) {
            field = form.querySelector(`#${name}`);
        }
        return field;
    }
    function setFormField(form, name, value) {
        const fields = form.querySelectorAll(`[name="${name}"]`);
        if (fields.length === 0) {
            const field = form.querySelector(`#${name}`);
            if (field) {
                setFieldValue(field, value);
            }
            return;
        }
        if (fields.length === 1) {
            setFieldValue(fields[0], value);
        } else {
            fields.forEach(field => {
                if (field.type === "radio") {
                    field.checked = field.value === String(value);
                } else if (field.type === "checkbox") {
                    if (Array.isArray(value)) {
                        field.checked = value.includes(field.value);
                    } else {
                        field.checked = Boolean(value);
                    }
                } else {
                    setFieldValue(field, value);
                }
            });
        }
    }
    function setFieldValue(field, value) {
        if (!field) return;
        switch (field.type) {
          case "checkbox":
            field.checked = Boolean(value);
            break;

          case "radio":
            field.checked = field.value === String(value);
            break;

          case "file":
            console.warn("[DOM Helpers Form] Cannot set file input values programmatically");
            break;

          case "select-multiple":
            if (Array.isArray(value)) {
                Array.from(field.options).forEach(option => {
                    option.selected = value.includes(option.value);
                });
            }
            break;

          default:
            field.value = value;
            break;
        }
        field.dispatchEvent(new Event("change", {
            bubbles: true
        }));
    }
    function validateForm(form, rules = {}) {
        const errors = {};
        const values = getFormValues(form);
        clearFormValidation(form);
        const isValid = form.checkValidity();
        if (!isValid) {
            const invalidFields = form.querySelectorAll(":invalid");
            invalidFields.forEach(field => {
                if (field.name) {
                    errors[field.name] = field.validationMessage || "Invalid value";
                    markFieldInvalid(field, errors[field.name]);
                }
            });
        }
        Object.entries(rules).forEach(([fieldName, rule]) => {
            const value = values[fieldName];
            const field = getFormField(form, fieldName);
            if (typeof rule === "function") {
                const result = rule(value, values, field);
                if (result !== true && result !== undefined) {
                    errors[fieldName] = result || "Invalid value";
                    if (field) markFieldInvalid(field, errors[fieldName]);
                }
            } else if (typeof rule === "object") {
                Object.entries(rule).forEach(([ruleName, ruleValue]) => {
                    if (errors[fieldName]) return;
                    let isInvalid = false;
                    let message = "";
                    switch (ruleName) {
                      case "required":
                        if (ruleValue && (!value || typeof value === "string" && value.trim() === "")) {
                            isInvalid = true;
                            message = "This field is required";
                        }
                        break;

                      case "minLength":
                        if (value && value.length < ruleValue) {
                            isInvalid = true;
                            message = `Minimum length is ${ruleValue} characters`;
                        }
                        break;

                      case "maxLength":
                        if (value && value.length > ruleValue) {
                            isInvalid = true;
                            message = `Maximum length is ${ruleValue} characters`;
                        }
                        break;

                      case "pattern":
                        if (value && !new RegExp(ruleValue).test(value)) {
                            isInvalid = true;
                            message = "Invalid format";
                        }
                        break;

                      case "email":
                        if (ruleValue && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                            isInvalid = true;
                            message = "Invalid email address";
                        }
                        break;

                      case "custom":
                        if (typeof ruleValue === "function") {
                            const result = ruleValue(value, values, field);
                            if (result !== true && result !== undefined) {
                                isInvalid = true;
                                message = result || "Invalid value";
                            }
                        }
                        break;
                    }
                    if (isInvalid) {
                        errors[fieldName] = message;
                        if (field) markFieldInvalid(field, message);
                    }
                });
            }
        });
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors,
            values: values
        };
    }
    function markFieldInvalid(field, message) {
        field.classList.add("form-invalid");
        field.setAttribute("aria-invalid", "true");
        let errorElement = field.parentNode.querySelector(".form-error-message");
        if (!errorElement) {
            errorElement = document.createElement("div");
            errorElement.className = "form-error-message";
            errorElement.style.color = "#dc3545";
            errorElement.style.fontSize = "0.875em";
            errorElement.style.marginTop = "0.25rem";
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    function clearFormValidation(form) {
        const invalidFields = form.querySelectorAll(".form-invalid");
        invalidFields.forEach(field => {
            field.classList.remove("form-invalid");
            field.removeAttribute("aria-invalid");
        });
        const errorMessages = form.querySelectorAll(".form-error-message");
        errorMessages.forEach(msg => msg.remove());
    }
    async function submitFormData(form, options = {}) {
        const {url: url = form.action || window.location.href, method: method = form.method || "POST", validate: validate = true, validationRules: validationRules = {}, beforeSubmit: beforeSubmit = null, onSuccess: onSuccess = null, onError: onError = null, transform: transform = null} = options;
        try {
            if (validate) {
                const validation = validateForm(form, validationRules);
                if (!validation.isValid) {
                    if (onError) onError(new Error("Validation failed"), validation.errors);
                    return {
                        success: false,
                        errors: validation.errors
                    };
                }
            }
            let data = getFormValues(form);
            if (typeof transform === "function") {
                data = transform(data);
            }
            if (typeof beforeSubmit === "function") {
                const shouldContinue = await beforeSubmit(data, form);
                if (shouldContinue === false) {
                    return {
                        success: false,
                        cancelled: true
                    };
                }
            }
            const requestOptions = {
                method: method.toUpperCase(),
                headers: {
                    "Content-Type": "application/json"
                }
            };
            if (method.toUpperCase() !== "GET") {
                requestOptions.body = JSON.stringify(data);
            }
            const response = await fetch(url, requestOptions);
            const result = await response.json();
            if (response.ok) {
                if (onSuccess) onSuccess(result, data);
                return {
                    success: true,
                    data: result
                };
            } else {
                throw new Error(result.message || "Submission failed");
            }
        } catch (error) {
            if (onError) onError(error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    function serializeForm(form, format = "object") {
        const values = getFormValues(form);
        switch (format) {
          case "json":
            return JSON.stringify(values);

          case "formdata":
            const formData = new FormData;
            Object.entries(values).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => formData.append(key, v));
                } else {
                    formData.append(key, value);
                }
            });
            return formData;

          case "urlencoded":
            return new URLSearchParams(values).toString();

          case "object":
          default:
            return values;
        }
    }
    function createFormUpdateMethod(form) {
        const originalUpdate = form.update;
        return function formUpdate(updates = {}) {
            if (!updates || typeof updates !== "object") {
                console.warn("[DOM Helpers Form] .update() called with invalid updates object");
                return form;
            }
            const formUpdates = {
                ...updates
            };
            if (formUpdates.values) {
                setFormValues(form, formUpdates.values);
                delete formUpdates.values;
            }
            if (formUpdates.validate) {
                const rules = formUpdates.validate === true ? {} : formUpdates.validate;
                validateForm(form, rules);
                delete formUpdates.validate;
            }
            if (formUpdates.reset) {
                const resetOptions = formUpdates.reset === true ? {} : formUpdates.reset;
                form.reset(resetOptions);
                delete formUpdates.reset;
            }
            if (formUpdates.submit) {
                const submitOptions = formUpdates.submit === true ? {} : formUpdates.submit;
                form.submitData(submitOptions);
                delete formUpdates.submit;
            }
            if (Object.keys(formUpdates).length > 0) {
                return originalUpdate.call(form, formUpdates);
            }
            return form;
        };
    }
    class ProductionFormsHelper {
        constructor(options = {}) {
            this.cache = new Map;
            this.options = {
                enableLogging: options.enableLogging ?? false,
                autoCleanup: options.autoCleanup ?? true,
                cleanupInterval: options.cleanupInterval ?? 3e4,
                maxCacheSize: options.maxCacheSize ?? 500,
                autoValidation: options.autoValidation ?? false,
                ...options
            };
            this.stats = {
                hits: 0,
                misses: 0,
                cacheSize: 0,
                lastCleanup: Date.now()
            };
            this.cleanupTimer = null;
            this.isDestroyed = false;
            this._initProxy();
            this._initMutationObserver();
            this._scheduleCleanup();
        }
        _initProxy() {
            this.Forms = new Proxy(this, {
                get: (target, prop) => {
                    if (typeof prop === "symbol" || prop.startsWith("_") || typeof target[prop] === "function") {
                        return target[prop];
                    }
                    return target._getForm(prop);
                },
                has: (target, prop) => target._hasForm(prop),
                ownKeys: target => target._getKeys(),
                getOwnPropertyDescriptor: (target, prop) => {
                    if (target._hasForm(prop)) {
                        return {
                            enumerable: true,
                            configurable: true,
                            value: target._getForm(prop)
                        };
                    }
                    return undefined;
                }
            });
        }
        _getForm(prop) {
            if (typeof prop !== "string") {
                this._warn(`Invalid form property type: ${typeof prop}`);
                return null;
            }
            if (this.cache.has(prop)) {
                const form = this.cache.get(prop);
                if (form && form.nodeType === Node.ELEMENT_NODE && document.contains(form)) {
                    this.stats.hits++;
                    return form._isEnhancedForm ? form : this._enhanceForm(form);
                } else {
                    this.cache.delete(prop);
                }
            }
            const form = document.getElementById(prop);
            if (form && form.tagName.toLowerCase() === "form") {
                const enhancedForm = form._isEnhancedForm ? form : this._enhanceForm(form);
                this._addToCache(prop, enhancedForm);
                this.stats.misses++;
                return enhancedForm;
            }
            this.stats.misses++;
            if (this.options.enableLogging) {
                this._warn(`Form with id '${prop}' not found`);
            }
            return null;
        }
        _hasForm(prop) {
            if (typeof prop !== "string") return false;
            if (this.cache.has(prop)) {
                const form = this.cache.get(prop);
                if (form && form.nodeType === Node.ELEMENT_NODE && document.contains(form)) {
                    return true;
                }
                this.cache.delete(prop);
            }
            const form = document.getElementById(prop);
            return form && form.tagName.toLowerCase() === "form";
        }
        _getKeys() {
            const forms = document.querySelectorAll("form[id]");
            return Array.from(forms).map(form => form.id).filter(id => id);
        }
        _enhanceForm(form) {
            if (!form || form._isEnhancedForm) {
                return form;
            }
            try {
                if (global.Elements && global.Elements.helper) {
                    form = global.Elements.helper._enhanceElementWithUpdate(form);
                } else if (typeof Elements !== "undefined" && Elements.helper) {
                    form = Elements.helper._enhanceElementWithUpdate(form);
                }
            } catch (error) {
                console.warn("[DOM Helpers Form] Could not enhance with Elements helper:", error.message);
            }
            form = enhanceFormWithFormMethods(form);
            if (form.update) {
                form.update = createFormUpdateMethod(form);
            } else {
                form.update = function(updates = {}) {
                    if (!updates || typeof updates !== "object") {
                        console.warn("[DOM Helpers Form] .update() called with invalid updates object");
                        return form;
                    }
                    const formUpdates = {
                        ...updates
                    };
                    if (formUpdates.values) {
                        setFormValues(form, formUpdates.values);
                        delete formUpdates.values;
                    }
                    if (formUpdates.validate) {
                        const rules = formUpdates.validate === true ? {} : formUpdates.validate;
                        validateForm(form, rules);
                        delete formUpdates.validate;
                    }
                    if (formUpdates.reset) {
                        const resetOptions = formUpdates.reset === true ? {} : formUpdates.reset;
                        form.reset(resetOptions);
                        delete formUpdates.reset;
                    }
                    if (formUpdates.submit) {
                        const submitOptions = formUpdates.submit === true ? {} : formUpdates.submit;
                        form.submitData(submitOptions);
                        delete formUpdates.submit;
                    }
                    if (formUpdates.addEventListener) {
                        if (typeof handleEnhancedEventListener === "function") {
                            handleEnhancedEventListener(form, formUpdates.addEventListener);
                        } else {
                            if (typeof formUpdates.addEventListener === "object") {
                                Object.entries(formUpdates.addEventListener).forEach(([eventType, handler]) => {
                                    if (typeof handler === "function") {
                                        form.addEventListener(eventType, handler);
                                    }
                                });
                            }
                        }
                        delete formUpdates.addEventListener;
                    }
                    Object.entries(formUpdates).forEach(([key, value]) => {
                        try {
                            if (key in form) {
                                form[key] = value;
                            } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                                form.setAttribute(key, value);
                            }
                        } catch (error) {
                            console.warn(`[DOM Helpers Form] Could not set ${key}:`, error.message);
                        }
                    });
                    return form;
                };
            }
            Object.defineProperty(form, "_isEnhancedForm", {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false
            });
            return form;
        }
        _addToCache(id, form) {
            if (this.cache.size >= this.options.maxCacheSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            this.cache.set(id, form);
            this.stats.cacheSize = this.cache.size;
        }
        _initMutationObserver() {
            this.observer = new MutationObserver(mutations => {
                this._processMutations(mutations);
            });
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
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "form" && node.id) {
                        addedIds.add(node.id);
                    }
                });
                mutation.removedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "form" && node.id) {
                        removedIds.add(node.id);
                    }
                });
                if (mutation.type === "attributes" && mutation.attributeName === "id") {
                    const target = mutation.target;
                    if (target.tagName.toLowerCase() === "form") {
                        const oldId = mutation.oldValue;
                        const newId = target.id;
                        if (oldId && oldId !== newId) {
                            removedIds.add(oldId);
                        }
                        if (newId && newId !== oldId) {
                            addedIds.add(newId);
                        }
                    }
                }
            });
            addedIds.forEach(id => {
                const form = document.getElementById(id);
                if (form && form.tagName.toLowerCase() === "form") {
                    this._addToCache(id, form);
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
            const staleIds = [];
            for (const [id, form] of this.cache) {
                if (!form || form.nodeType !== Node.ELEMENT_NODE || !document.contains(form) || form.id !== id || form.tagName.toLowerCase() !== "form") {
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
        _log(message) {
            if (this.options.enableLogging) {
                console.log(`[Forms] ${message}`);
            }
        }
        _warn(message) {
            if (this.options.enableLogging) {
                console.warn(`[Forms] ${message}`);
            }
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
            this._log("Forms helper destroyed");
        }
        getAllForms() {
            const forms = document.querySelectorAll("form[id]");
            return Array.from(forms).map(form => {
                if (form._isEnhancedForm) {
                    return form;
                }
                return this._enhanceForm(form);
            });
        }
        validateAll(rules = {}) {
            const results = {};
            this.getAllForms().forEach(form => {
                if (form.id) {
                    results[form.id] = form.validate(rules[form.id] || {});
                }
            });
            return results;
        }
        resetAll() {
            this.getAllForms().forEach(form => form.reset());
        }
    }
    const FormsHelper = new ProductionFormsHelper({
        enableLogging: false,
        autoCleanup: true,
        cleanupInterval: 3e4,
        maxCacheSize: 500
    });
    const Forms = FormsHelper.Forms;
    Forms.helper = FormsHelper;
    Forms.stats = () => FormsHelper.getStats();
    Forms.clear = () => FormsHelper.clearCache();
    Forms.destroy = () => FormsHelper.destroy();
    Forms.getAllForms = () => FormsHelper.getAllForms();
    Forms.validateAll = rules => FormsHelper.validateAll(rules);
    Forms.resetAll = () => FormsHelper.resetAll();
    Forms.configure = options => {
        Object.assign(FormsHelper.options, options);
        return Forms;
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            Forms: Forms,
            ProductionFormsHelper: ProductionFormsHelper
        };
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return {
                Forms: Forms,
                ProductionFormsHelper: ProductionFormsHelper
            };
        });
    } else {
        global.Forms = Forms;
        global.ProductionFormsHelper = ProductionFormsHelper;
    }
    if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", () => {
            FormsHelper.destroy();
        });
    }
    if (global.DOMHelpers) {
        global.DOMHelpers.Forms = Forms;
        global.DOMHelpers.ProductionFormsHelper = ProductionFormsHelper;
    }
    console.log("[DOM Helpers Form] Form module loaded successfully");
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

/**
 * Forms Extension for DOM Helpers Reactive State
 * Standalone file - no library modifications needed
 * @license MIT
 */
(function(global) {
    "use strict";
    if (!global.ReactiveUtils) {
        console.error("[Forms] ReactiveUtils not found. Please load the reactive library first.");
        return;
    }
    const {state: createState, batch: batch} = global.ReactiveUtils;
    function createForm(initialValues = {}, options = {}) {
        const formObj = {
            values: {
                ...initialValues
            },
            errors: {},
            touched: {},
            isSubmitting: false,
            submitCount: 0
        };
        const form = createState(formObj);
        form.$computed("isValid", function() {
            const errorKeys = Object.keys(this.errors);
            return errorKeys.length === 0 || errorKeys.every(k => !this.errors[k]);
        });
        form.$computed("isDirty", function() {
            return Object.keys(this.touched).length > 0;
        });
        form.$computed("hasErrors", function() {
            return Object.keys(this.errors).some(k => this.errors[k]);
        });
        form.$computed("touchedFields", function() {
            return Object.keys(this.touched);
        });
        form.$computed("errorFields", function() {
            return Object.keys(this.errors).filter(k => this.errors[k]);
        });
        const validators = options.validators || {};
        const onSubmitCallback = options.onSubmit;
        const methods = {
            setValue(field, value) {
                this.values[field] = value;
                this.touched[field] = true;
                if (validators[field]) {
                    this.validateField(field);
                }
                return this;
            },
            setValues(values) {
                return batch(() => {
                    Object.entries(values).forEach(([field, value]) => {
                        this.setValue(field, value);
                    });
                    return this;
                });
            },
            setError(field, error) {
                if (error) {
                    this.errors[field] = error;
                } else {
                    delete this.errors[field];
                }
                return this;
            },
            setErrors(errors) {
                return batch(() => {
                    Object.entries(errors).forEach(([field, error]) => {
                        this.setError(field, error);
                    });
                    return this;
                });
            },
            clearError(field) {
                delete this.errors[field];
                return this;
            },
            clearErrors() {
                this.errors = {};
                return this;
            },
            setTouched(field, touched = true) {
                if (touched) {
                    this.touched[field] = true;
                } else {
                    delete this.touched[field];
                }
                return this;
            },
            setTouchedFields(fields) {
                return batch(() => {
                    fields.forEach(field => this.setTouched(field));
                    return this;
                });
            },
            touchAll() {
                return batch(() => {
                    Object.keys(this.values).forEach(field => {
                        this.touched[field] = true;
                    });
                    return this;
                });
            },
            validateField(field) {
                const validator = validators[field];
                if (!validator) return true;
                const error = validator(this.values[field], this.values);
                if (error) {
                    this.errors[field] = error;
                    return false;
                } else {
                    delete this.errors[field];
                    return true;
                }
            },
            validate() {
                return batch(() => {
                    let isValid = true;
                    Object.keys(validators).forEach(field => {
                        const valid = this.validateField(field);
                        if (!valid) isValid = false;
                    });
                    return isValid;
                });
            },
            reset(newValues = initialValues) {
                return batch(() => {
                    this.values = {
                        ...newValues
                    };
                    this.errors = {};
                    this.touched = {};
                    this.isSubmitting = false;
                    return this;
                });
            },
            resetField(field) {
                return batch(() => {
                    this.values[field] = initialValues[field];
                    delete this.errors[field];
                    delete this.touched[field];
                    return this;
                });
            },
            async submit(customHandler) {
                const handler = customHandler || onSubmitCallback;
                if (!handler) {
                    console.warn("[Forms] No submit handler provided");
                    return;
                }
                this.touchAll();
                const isValid = this.validate();
                if (!isValid) {
                    console.log("[Forms] Validation failed");
                    return {
                        success: false,
                        errors: this.errors
                    };
                }
                this.isSubmitting = true;
                try {
                    const result = await handler(this.values, this);
                    this.submitCount++;
                    this.isSubmitting = false;
                    return {
                        success: true,
                        result: result
                    };
                } catch (error) {
                    this.isSubmitting = false;
                    console.error("[Forms] Submit error:", error);
                    return {
                        success: false,
                        error: error
                    };
                }
            },
            handleChange(event) {
                const target = event.target;
                const field = target.name || target.id;
                const value = target.type === "checkbox" ? target.checked : target.value;
                this.setValue(field, value);
            },
            handleBlur(event) {
                const target = event.target;
                const field = target.name || target.id;
                this.setTouched(field);
                if (validators[field]) {
                    this.validateField(field);
                }
            },
            getFieldProps(field) {
                return {
                    name: field,
                    value: this.values[field] || "",
                    onChange: e => this.handleChange(e),
                    onBlur: e => this.handleBlur(e)
                };
            },
            hasError(field) {
                return !!this.errors[field];
            },
            isTouched(field) {
                return !!this.touched[field];
            },
            getError(field) {
                return this.errors[field] || null;
            },
            getValue(field) {
                return this.values[field];
            },
            shouldShowError(field) {
                return this.isTouched(field) && this.hasError(field);
            },
            bindToInputs(selector) {
                const inputs = typeof selector === "string" ? document.querySelectorAll(selector) : selector;
                inputs.forEach(input => {
                    const field = input.name || input.id;
                    if (!field) return;
                    if (input.type === "checkbox") {
                        input.checked = !!this.values[field];
                    } else {
                        input.value = this.values[field] || "";
                    }
                    input.addEventListener("input", e => this.handleChange(e));
                    input.addEventListener("blur", e => this.handleBlur(e));
                });
                return this;
            },
            toObject() {
                return {
                    values: {
                        ...this.values
                    },
                    errors: {
                        ...this.errors
                    },
                    touched: {
                        ...this.touched
                    },
                    isValid: this.isValid,
                    isDirty: this.isDirty,
                    isSubmitting: this.isSubmitting,
                    submitCount: this.submitCount
                };
            }
        };
        Object.keys(methods).forEach(key => {
            form[key] = methods[key].bind(form);
        });
        return form;
    }
    const Validators = {
        required(message = "This field is required") {
            return value => {
                if (!value || typeof value === "string" && value.trim() === "") {
                    return message;
                }
                return null;
            };
        },
        email(message = "Invalid email address") {
            return value => {
                if (!value) return null;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? null : message;
            };
        },
        minLength(min, message) {
            return value => {
                if (!value) return null;
                const msg = message || `Must be at least ${min} characters`;
                return value.length >= min ? null : msg;
            };
        },
        maxLength(max, message) {
            return value => {
                if (!value) return null;
                const msg = message || `Must be no more than ${max} characters`;
                return value.length <= max ? null : msg;
            };
        },
        pattern(regex, message = "Invalid format") {
            return value => {
                if (!value) return null;
                return regex.test(value) ? null : message;
            };
        },
        min(min, message) {
            return value => {
                if (value === "" || value == null) return null;
                const msg = message || `Must be at least ${min}`;
                return Number(value) >= min ? null : msg;
            };
        },
        max(max, message) {
            return value => {
                if (value === "" || value == null) return null;
                const msg = message || `Must be no more than ${max}`;
                return Number(value) <= max ? null : msg;
            };
        },
        match(fieldName, message) {
            return (value, allValues) => {
                const msg = message || `Must match ${fieldName}`;
                return value === allValues[fieldName] ? null : msg;
            };
        },
        custom(validatorFn) {
            return validatorFn;
        },
        combine(...validators) {
            return (value, allValues) => {
                for (const validator of validators) {
                    const error = validator(value, allValues);
                    if (error) return error;
                }
                return null;
            };
        }
    };
    const FormsAPI = {
        create: createForm,
        form: createForm,
        validators: Validators,
        v: Validators
    };
    global.Forms = global.Forms || {};
    Object.assign(global.Forms, FormsAPI);
    if (global.ReactiveUtils) {
        global.ReactiveUtils.form = createForm;
        global.ReactiveUtils.createForm = createForm;
        global.ReactiveUtils.validators = Validators;
    }
    if (global.ReactiveState) {
        global.ReactiveState.form = createForm;
    }
    console.log("[Forms Extension] v1.0.0 loaded successfully");
    console.log("[Forms Extension] Available methods:");
    console.log("  - ReactiveUtils.form(initialValues, options)");
    console.log("  - form.setValue(field, value)");
    console.log("  - form.setError(field, error)");
    console.log("  - form.validate()");
    console.log("  - form.submit(handler)");
    console.log("  - form.reset()");
    console.log("  - Plus many more validation and binding helpers!");
})(typeof window !== "undefined" ? window : global);

/**
 * DOM Helpers - Form Enhancement Module
 * Adds advanced features and bridges DOM Forms with Reactive Forms
 * 
 * Features:
 * ✅ Automatic form submission prevention
 * ✅ Button state management (disable on submit)
 * ✅ Loading states with visual feedback
 * ✅ Enhanced error handling and display
 * ✅ Success/failure visual feedback
 * ✅ Declarative form handling (data-attributes)
 * ✅ Event system for submission lifecycle
 * ✅ Progress tracking for uploads
 * ✅ Submission queue management
 * ✅ Bridge between DOM and Reactive forms
 * ✅ Shared validator system
 * 
 * @version 1.0.0
 * @license MIT
 */
(function(global) {
    "use strict";
    const hasDOMForms = typeof global.Forms !== "undefined" && global.Forms.helper;
    const hasReactiveForms = typeof global.ReactiveUtils !== "undefined";
    if (!hasDOMForms && !hasReactiveForms) {
        console.warn("[Form Enhancements] No form system detected. Please load DOM Forms or ReactiveUtils first.");
        return;
    }
    console.log("[Form Enhancements] Initializing...");
    console.log(`[Form Enhancements] DOM Forms: ${hasDOMForms ? "✓" : "✗"}`);
    console.log(`[Form Enhancements] Reactive Forms: ${hasReactiveForms ? "✓" : "✗"}`);
    const defaultConfig = {
        autoPreventDefault: true,
        autoDisableButtons: true,
        showLoadingStates: true,
        queueSubmissions: true,
        loadingClass: "form-loading",
        buttonLoadingClass: "button-loading",
        successClass: "form-success",
        errorClass: "form-error",
        disabledClass: "form-disabled",
        messageTimeout: 3e3,
        showSuccessMessage: true,
        showErrorMessage: true,
        loadingText: "Loading...",
        loadingSpinner: "⌛",
        showLoadingSpinner: true,
        retryAttempts: 0,
        retryDelay: 1e3,
        timeout: 3e4,
        autoSyncReactive: true,
        syncOnInput: true,
        syncOnBlur: true,
        enableLogging: false
    };
    let globalConfig = {
        ...defaultConfig
    };
    const submissionQueue = new Map;
    const formStates = new WeakMap;
    function log(...args) {
        if (globalConfig.enableLogging) {
            console.log("[Form Enhancements]", ...args);
        }
    }
    function warn(...args) {
        console.warn("[Form Enhancements]", ...args);
    }
    function getFormState(form) {
        if (!formStates.has(form)) {
            formStates.set(form, {
                isSubmitting: false,
                submitCount: 0,
                lastSubmit: null,
                originalButtonStates: new Map,
                reactiveForm: null,
                config: {
                    ...globalConfig
                }
            });
        }
        return formStates.get(form);
    }
    function mergeConfig(formConfig, overrides = {}) {
        return {
            ...formConfig,
            ...overrides
        };
    }
    function getSubmitButtons(form) {
        return Array.from(form.querySelectorAll('button[type="submit"], input[type="submit"]'));
    }
    function disableButtons(form, config) {
        const state = getFormState(form);
        const buttons = getSubmitButtons(form);
        buttons.forEach(button => {
            state.originalButtonStates.set(button, {
                disabled: button.disabled,
                innerHTML: button.innerHTML,
                textContent: button.textContent
            });
            button.disabled = true;
            button.classList.add(config.buttonLoadingClass);
            if (config.showLoadingSpinner && button.tagName === "BUTTON") {
                const originalContent = button.innerHTML;
                button.innerHTML = `${config.loadingSpinner} ${config.loadingText}`;
                button.setAttribute("data-original-content", originalContent);
            }
        });
        log("Buttons disabled:", buttons.length);
    }
    function enableButtons(form, config) {
        const state = getFormState(form);
        const buttons = getSubmitButtons(form);
        buttons.forEach(button => {
            const originalState = state.originalButtonStates.get(button);
            if (originalState) {
                button.disabled = originalState.disabled;
                if (button.tagName === "BUTTON") {
                    const originalContent = button.getAttribute("data-original-content");
                    if (originalContent) {
                        button.innerHTML = originalContent;
                        button.removeAttribute("data-original-content");
                    } else {
                        button.innerHTML = originalState.innerHTML;
                    }
                }
            } else {
                button.disabled = false;
            }
            button.classList.remove(config.buttonLoadingClass);
        });
        state.originalButtonStates.clear();
        log("Buttons enabled:", buttons.length);
    }
    function addLoadingState(form, config) {
        form.classList.add(config.loadingClass);
        form.setAttribute("aria-busy", "true");
        form.dispatchEvent(new CustomEvent("formsubmitstart", {
            bubbles: true,
            detail: {
                form: form,
                timestamp: Date.now()
            }
        }));
        log("Loading state added to form:", form.id);
    }
    function removeLoadingState(form, config) {
        form.classList.remove(config.loadingClass);
        form.removeAttribute("aria-busy");
        log("Loading state removed from form:", form.id);
    }
    function showSuccess(form, config, message) {
        form.classList.remove(config.errorClass);
        form.classList.add(config.successClass);
        form.setAttribute("data-form-state", "success");
        if (config.showSuccessMessage && message) {
            showMessage(form, message, "success", config);
        }
        form.dispatchEvent(new CustomEvent("formsubmitsuccess", {
            bubbles: true,
            detail: {
                form: form,
                message: message,
                timestamp: Date.now()
            }
        }));
        if (config.messageTimeout > 0) {
            setTimeout(() => {
                form.classList.remove(config.successClass);
                form.removeAttribute("data-form-state");
                removeMessage(form);
            }, config.messageTimeout);
        }
        log("Success state shown");
    }
    function showError(form, config, error) {
        form.classList.remove(config.successClass);
        form.classList.add(config.errorClass);
        form.setAttribute("data-form-state", "error");
        const errorMessage = typeof error === "string" ? error : error.message || "Submission failed";
        if (config.showErrorMessage) {
            showMessage(form, errorMessage, "error", config);
        }
        form.dispatchEvent(new CustomEvent("formsubmiterror", {
            bubbles: true,
            detail: {
                form: form,
                error: error,
                timestamp: Date.now()
            }
        }));
        if (config.messageTimeout > 0) {
            setTimeout(() => {
                form.classList.remove(config.errorClass);
                form.removeAttribute("data-form-state");
                removeMessage(form);
            }, config.messageTimeout);
        }
        log("Error state shown:", errorMessage);
    }
    function showMessage(form, message, type, config) {
        removeMessage(form);
        const messageEl = document.createElement("div");
        messageEl.className = `form-message form-message-${type}`;
        messageEl.setAttribute("role", "alert");
        messageEl.setAttribute("aria-live", "polite");
        messageEl.textContent = message;
        Object.assign(messageEl.style, {
            padding: "12px 16px",
            marginTop: "16px",
            marginBottom: "16px",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "500",
            backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
            color: type === "success" ? "#155724" : "#721c24",
            border: `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`
        });
        const insertPosition = form.getAttribute("data-message-position") || "end";
        if (insertPosition === "start") {
            form.insertBefore(messageEl, form.firstChild);
        } else {
            form.appendChild(messageEl);
        }
        log("Message shown:", message);
    }
    function removeMessage(form) {
        const messages = form.querySelectorAll(".form-message");
        messages.forEach(msg => msg.remove());
    }
    function canSubmit(form, config) {
        if (!config.queueSubmissions) {
            return true;
        }
        const state = getFormState(form);
        return !state.isSubmitting;
    }
    function markSubmitting(form) {
        const state = getFormState(form);
        state.isSubmitting = true;
        state.lastSubmit = Date.now();
        submissionQueue.set(form, state);
    }
    function markSubmitted(form) {
        const state = getFormState(form);
        state.isSubmitting = false;
        state.submitCount++;
        submissionQueue.delete(form);
    }
    async function handleSubmissionWithRetry(form, submitFn, config, attempt = 0) {
        try {
            const result = await submitFn();
            return {
                success: true,
                result: result
            };
        } catch (error) {
            log("Submission error:", error.message, `(attempt ${attempt + 1})`);
            if (attempt < config.retryAttempts) {
                log(`Retrying in ${config.retryDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, config.retryDelay));
                return handleSubmissionWithRetry(form, submitFn, config, attempt + 1);
            }
            return {
                success: false,
                error: error
            };
        }
    }
    async function enhancedSubmit(form, options = {}) {
        const state = getFormState(form);
        const config = mergeConfig(state.config, options);
        if (!canSubmit(form, config)) {
            warn("Form is already submitting");
            return {
                success: false,
                error: "Form is already submitting"
            };
        }
        markSubmitting(form);
        if (config.showLoadingStates) {
            addLoadingState(form, config);
        }
        if (config.autoDisableButtons) {
            disableButtons(form, config);
        }
        removeMessage(form);
        form.classList.remove(config.successClass, config.errorClass);
        const submitHandler = options.onSubmit || config.onSubmit || (async values => {
            const url = form.action || options.url || window.location.href;
            const method = form.method || options.method || "POST";
            const response = await fetch(url, {
                method: method.toUpperCase(),
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }
            return await response.json();
        });
        try {
            let values;
            if (hasDOMForms && form.values) {
                values = form.values;
            } else {
                values = getFormValuesManual(form);
            }
            if (options.transform) {
                values = options.transform(values);
            }
            if (options.beforeSubmit) {
                const shouldContinue = await options.beforeSubmit(values, form);
                if (shouldContinue === false) {
                    markSubmitted(form);
                    removeLoadingState(form, config);
                    enableButtons(form, config);
                    return {
                        success: false,
                        cancelled: true
                    };
                }
            }
            if (state.reactiveForm && state.reactiveForm.validate) {
                const isValid = state.reactiveForm.validate();
                if (!isValid) {
                    markSubmitted(form);
                    removeLoadingState(form, config);
                    enableButtons(form, config);
                    showError(form, config, "Validation failed");
                    return {
                        success: false,
                        errors: state.reactiveForm.errors
                    };
                }
            }
            const submitFn = () => submitHandler(values, form);
            const result = await handleSubmissionWithRetry(form, submitFn, config);
            markSubmitted(form);
            removeLoadingState(form, config);
            enableButtons(form, config);
            if (result.success) {
                showSuccess(form, config, options.successMessage || "Success!");
                if (options.onSuccess) {
                    options.onSuccess(result.result, values);
                }
                if (options.resetOnSuccess) {
                    setTimeout(() => {
                        if (form.reset) form.reset();
                        if (state.reactiveForm && state.reactiveForm.reset) {
                            state.reactiveForm.reset();
                        }
                    }, 500);
                }
                return result;
            } else {
                showError(form, config, result.error);
                if (options.onError) {
                    options.onError(result.error);
                }
                return result;
            }
        } catch (error) {
            markSubmitted(form);
            removeLoadingState(form, config);
            enableButtons(form, config);
            showError(form, config, error);
            if (options.onError) {
                options.onError(error);
            }
            log("Submission failed:", error);
            return {
                success: false,
                error: error
            };
        }
    }
    function getFormValuesManual(form) {
        const values = {};
        const formData = new FormData(form);
        for (const [name, value] of formData.entries()) {
            if (values[name]) {
                if (Array.isArray(values[name])) {
                    values[name].push(value);
                } else {
                    values[name] = [ values[name], value ];
                }
            } else {
                values[name] = value;
            }
        }
        return values;
    }
    function connectReactiveForm(domForm, reactiveForm, options = {}) {
        if (!hasReactiveForms || !reactiveForm) {
            warn("Reactive forms not available or reactiveForm not provided");
            return;
        }
        const state = getFormState(domForm);
        state.reactiveForm = reactiveForm;
        log("Connecting reactive form to DOM form:", domForm.id);
        const config = mergeConfig(state.config, options);
        if (config.syncOnInput || config.autoSyncReactive) {
            domForm.addEventListener("input", e => {
                const field = e.target.name || e.target.id;
                if (field && reactiveForm.setValue) {
                    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
                    reactiveForm.setValue(field, value);
                    log("Synced to reactive:", field, value);
                }
            });
        }
        if (config.syncOnBlur || config.autoSyncReactive) {
            domForm.addEventListener("blur", e => {
                const field = e.target.name || e.target.id;
                if (field && reactiveForm.setTouched) {
                    reactiveForm.setTouched(field);
                    log("Field touched in reactive:", field);
                }
            }, true);
        }
        if (reactiveForm.$watch && config.autoSyncReactive) {
            reactiveForm.$watch("values", newValues => {
                Object.entries(newValues).forEach(([field, value]) => {
                    const input = domForm.querySelector(`[name="${field}"], #${field}`);
                    if (input) {
                        if (input.type === "checkbox") {
                            input.checked = !!value;
                        } else if (input.value !== value) {
                            input.value = value || "";
                        }
                    }
                });
                log("Synced from reactive to DOM");
            }, {
                deep: true
            });
            reactiveForm.$watch("errors", errors => {
                domForm.querySelectorAll(".form-error-message").forEach(el => el.remove());
                domForm.querySelectorAll(".form-invalid").forEach(el => {
                    el.classList.remove("form-invalid");
                    el.removeAttribute("aria-invalid");
                });
                Object.entries(errors).forEach(([field, message]) => {
                    if (message) {
                        const input = domForm.querySelector(`[name="${field}"], #${field}`);
                        if (input) {
                            input.classList.add("form-invalid");
                            input.setAttribute("aria-invalid", "true");
                            let errorEl = input.parentNode.querySelector(".form-error-message");
                            if (!errorEl) {
                                errorEl = document.createElement("div");
                                errorEl.className = "form-error-message";
                                errorEl.style.color = "#dc3545";
                                errorEl.style.fontSize = "0.875em";
                                errorEl.style.marginTop = "0.25rem";
                                input.parentNode.appendChild(errorEl);
                            }
                            errorEl.textContent = message;
                        }
                    }
                });
                log("Synced errors from reactive to DOM");
            }, {
                deep: true
            });
        }
        const originalSubmit = reactiveForm.submit;
        if (originalSubmit) {
            reactiveForm.submit = async function(customHandler) {
                return enhancedSubmit(domForm, {
                    onSubmit: customHandler,
                    ...options
                });
            };
        }
        log("Reactive form connected successfully");
        return {
            disconnect: () => {
                state.reactiveForm = null;
                log("Reactive form disconnected");
            }
        };
    }
    function initDeclarativeForm(form) {
        const config = {
            url: form.getAttribute("data-submit-url") || form.action,
            method: form.getAttribute("data-submit-method") || form.method,
            autoDisableButtons: form.getAttribute("data-auto-disable") !== "false",
            showLoadingStates: form.getAttribute("data-show-loading") !== "false",
            successMessage: form.getAttribute("data-success-message"),
            errorMessage: form.getAttribute("data-error-message"),
            resetOnSuccess: form.hasAttribute("data-reset-on-success"),
            messagePosition: form.getAttribute("data-message-position") || "end"
        };
        const state = getFormState(form);
        state.config = mergeConfig(state.config, config);
        if (globalConfig.autoPreventDefault && !form.hasAttribute("data-allow-default")) {
            form.addEventListener("submit", e => {
                e.preventDefault();
                enhancedSubmit(form, config);
            });
            log("Declarative form initialized:", form.id);
        }
    }
    const SharedValidators = {
        ...hasReactiveForms && global.Forms && global.Forms.validators ? global.Forms.validators : {},
        requiredDOM(message = "This field is required") {
            return (value, values, field) => {
                if (!value || typeof value === "string" && value.trim() === "") {
                    return message;
                }
                return true;
            };
        },
        emailDOM(message = "Invalid email address") {
            return value => {
                if (!value) return true;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? true : message;
            };
        },
        minLengthDOM(min, message) {
            return value => {
                if (!value) return true;
                const msg = message || `Must be at least ${min} characters`;
                return value.length >= min ? true : msg;
            };
        },
        matchDOM(fieldName, message) {
            return (value, values) => {
                const msg = message || `Must match ${fieldName}`;
                return value === values[fieldName] ? true : msg;
            };
        }
    };
    if (hasDOMForms) {
        log("Enhancing DOM Forms module...");
        const originalHelper = global.Forms.helper;
        if (originalHelper && originalHelper._enhanceForm) {
            const originalEnhance = originalHelper._enhanceForm.bind(originalHelper);
            originalHelper._enhanceForm = function(form) {
                form = originalEnhance(form);
                if (form && !form._hasEnhancedSubmit) {
                    Object.defineProperty(form, "_hasEnhancedSubmit", {
                        value: true,
                        writable: false,
                        enumerable: false
                    });
                    form.submitData = function(options = {}) {
                        return enhancedSubmit(form, options);
                    };
                    form.connectReactive = function(reactiveForm, options = {}) {
                        return connectReactiveForm(form, reactiveForm, options);
                    };
                    form.configure = function(options = {}) {
                        const state = getFormState(form);
                        state.config = mergeConfig(state.config, options);
                        return form;
                    };
                    log("Enhanced DOM form:", form.id);
                }
                return form;
            };
        }
    }
    function autoInit() {
        const declarativeForms = document.querySelectorAll("form[data-enhanced]");
        declarativeForms.forEach(form => {
            initDeclarativeForm(form);
        });
        log("Auto-initialized", declarativeForms.length, "declarative forms");
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", autoInit);
    } else {
        autoInit();
    }
    const FormEnhancements = {
        configure: options => {
            Object.assign(globalConfig, options);
            log("Configuration updated:", options);
        },
        getConfig: () => ({
            ...globalConfig
        }),
        enhance: (form, options = {}) => {
            initDeclarativeForm(form);
            const state = getFormState(form);
            state.config = mergeConfig(state.config, options);
            return form;
        },
        submit: (form, options = {}) => enhancedSubmit(form, options),
        connect: (domForm, reactiveForm, options = {}) => connectReactiveForm(domForm, reactiveForm, options),
        getState: form => getFormState(form),
        clearQueue: () => submissionQueue.clear(),
        validators: SharedValidators,
        v: SharedValidators,
        disableButtons: form => disableButtons(form, globalConfig),
        enableButtons: form => enableButtons(form, globalConfig),
        showSuccess: (form, message) => showSuccess(form, globalConfig, message),
        showError: (form, error) => showError(form, globalConfig, error),
        version: "1.0.0"
    };
    global.FormEnhancements = FormEnhancements;
    if (global.Forms) {
        global.Forms.enhance = FormEnhancements;
        global.Forms.enhancements = FormEnhancements;
    }
    if (hasReactiveForms && global.ReactiveUtils) {
        global.ReactiveUtils.formEnhancements = FormEnhancements;
    }
    console.log("[Form Enhancements] ✓ Loaded successfully v1.0.0");
    console.log("[Form Enhancements] Available via: FormEnhancements, Forms.enhance, or ReactiveUtils.formEnhancements");
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);