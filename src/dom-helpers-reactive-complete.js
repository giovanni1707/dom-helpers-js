/**
 * DOM Helpers - Reactive State Extension v2.0.0
 * Complete production-ready implementation
 * @license MIT
 */

(function(global) {
  'use strict';

  // Check if DOM Helpers is loaded
  const hasDOM = typeof document !== 'undefined';
  const hasElements = !!global.Elements;
  const hasCollections = !!global.Collections;
  const hasSelector = !!global.Selector;

  if (!hasElements || !hasCollections || !hasSelector) {
    console.warn('[DOM Helpers Reactive] Core DOM Helpers library not detected.');
  }

  // Configuration
  const config = {
    maxDependencyDepth: 100,
    enableDebugMode: false,
    errorHandler: null
  };

  // Reactive system state
  const reactiveMetadata = new WeakMap();
  const nestedProxies = new WeakMap();
  const elementBindings = new WeakMap();
  
  let currentBinding = null;
  const bindingStack = [];

  const RAW = Symbol('raw');
  const IS_REACTIVE = Symbol('isReactive');

  // Batching
  let batchDepth = 0;
  let pendingUpdates = new Set();
  let isFlushing = false;

  // Pause/Resume
  let isPaused = false;
  let pausedUpdates = [];

  // Error handling
  function handleError(error, context, data) {
    if (config.errorHandler) {
      config.errorHandler(error, context, data);
    } else {
      console.error(`[DOM Helpers Reactive] Error in ${context}:`, error, data);
    }
  }

  // Batch updates
  function batch(fn) {
    batchDepth++;
    try {
      return fn();
    } finally {
      batchDepth--;
      if (batchDepth === 0 && !isFlushing) {
        flushUpdates();
      }
    }
  }

  function flushUpdates() {
    if (isFlushing || pendingUpdates.size === 0) return;

    isFlushing = true;
    const updates = Array.from(pendingUpdates);
    pendingUpdates.clear();

    updates.forEach(binding => {
      try {
        executeBinding(binding);
      } catch (error) {
        handleError(error, 'flushUpdates', binding);
      }
    });

    isFlushing = false;
  }

  // Check if value is reactive
  function isReactive(value) {
    return !!(value && typeof value === 'object' && value[IS_REACTIVE]);
  }

  // Get raw value
  function toRaw(value) {
    return (value && value[RAW]) || value;
  }

  // Create reactive proxy
  function createReactiveProxy(target) {
    if (target === null || typeof target !== 'object') return target;
    if (isReactive(target)) return target;
    if (nestedProxies.has(target)) return nestedProxies.get(target);

    const proxy = new Proxy(target, {
      get(obj, key) {
        if (key === RAW) return target;
        if (key === IS_REACTIVE) return true;

        if (currentBinding && typeof key !== 'symbol') {
          trackDependency(proxy, key, currentBinding);
        }

        const value = obj[key];

        // Reactive array methods
        if (Array.isArray(obj) && typeof value === 'function') {
          return function(...args) {
            const result = value.apply(obj, args);
            const mutatingMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
            if (mutatingMethods.includes(key)) {
              batch(() => {
                const metadata = reactiveMetadata.get(proxy);
                if (metadata) {
                  metadata.dependencies.forEach(bindings => {
                    bindings.forEach(binding => scheduleUpdate(binding));
                  });
                }
              });
            }
            return result;
          };
        }

        // Deep reactivity
        if (value !== null && typeof value === 'object' && !isReactive(value)) {
          const nestedProxy = createReactiveProxy(value);
          nestedProxies.set(value, nestedProxy);
          return nestedProxy;
        }

        return value;
      },

      set(obj, key, value) {
        const oldValue = obj[key];
        if (oldValue === value) return true;

        obj[key] = toRaw(value);
        triggerUpdate(proxy, key);
        return true;
      },

      deleteProperty(obj, key) {
        const hadKey = key in obj;
        const result = delete obj[key];
        if (result && hadKey) triggerUpdate(proxy, key);
        return result;
      }
    });

    reactiveMetadata.set(proxy, {
      target,
      dependencies: new Map(),
      computedProperties: new Map()
    });

    nestedProxies.set(target, proxy);
    return proxy;
  }

  // Dependency tracking
  function trackDependency(state, key, binding) {
    const metadata = reactiveMetadata.get(state);
    if (!metadata) return;

    if (bindingStack.length > config.maxDependencyDepth) {
      console.warn('[DOM Helpers Reactive] Max dependency depth exceeded');
      return;
    }

    if (!metadata.dependencies.has(key)) {
      metadata.dependencies.set(key, new Set());
    }
    metadata.dependencies.get(key).add(binding);

    if (!binding.trackedStates) binding.trackedStates = new Map();
    if (!binding.trackedStates.has(state)) binding.trackedStates.set(state, new Set());
    binding.trackedStates.get(state).add(key);
  }

  function scheduleUpdate(binding) {
    if (batchDepth > 0) {
      pendingUpdates.add(binding);
    } else if (!isFlushing) {
      try {
        executeBinding(binding);
      } catch (error) {
        handleError(error, 'scheduleUpdate', binding);
      }
    }
  }

  function triggerUpdate(state, key) {
    if (isPaused) {
      pausedUpdates.push({ state, key });
      return;
    }

    const metadata = reactiveMetadata.get(state);
    if (!metadata) return;

    const bindings = metadata.dependencies.get(key);
    if (!bindings) return;

    bindings.forEach(binding => {
      if (binding.isComputed) {
        binding.fn();
      } else {
        scheduleUpdate(binding);
      }
    });

    if (config.enableDebugMode) {
      console.log(`[Reactive Debug] Triggered ${bindings.size} binding(s) for "${String(key)}"`);
    }
  }

  // Execute binding
  function executeBinding(binding) {
    if (binding.isComputed) return;
    if (binding.element && hasDOM && !document.contains(binding.element)) {
      cleanupBinding(binding);
      return;
    }

    clearBindingDependencies(binding);

    const prevBinding = currentBinding;
    currentBinding = binding;
    bindingStack.push(binding);

    try {
      const value = binding.fn();
      if (binding.element) {
        applyBindingValue(binding.element, binding.property, value);
      }
      if (binding.callback) {
        binding.callback(value, binding.lastValue);
      }
      binding.lastValue = value;
    } catch (error) {
      handleError(error, 'executeBinding', binding);
    } finally {
      bindingStack.pop();
      currentBinding = prevBinding;
    }
  }

  function clearBindingDependencies(binding) {
    if (!binding.trackedStates) return;
    binding.trackedStates.forEach((keys, state) => {
      const metadata = reactiveMetadata.get(state);
      if (metadata) {
        keys.forEach(key => {
          const bindings = metadata.dependencies.get(key);
          if (bindings) bindings.delete(binding);
        });
      }
    });
    binding.trackedStates.clear();
  }

  // Apply binding value to DOM
  function applyBindingValue(element, property, value) {
    if (value === null || value === undefined) {
      if (!property) element.textContent = '';
      else if (property === 'value') element.value = '';
      return;
    }

    const type = typeof value;
    
    if (type === 'string' || type === 'number' || type === 'boolean') {
      if (property) {
        if (property in element) element[property] = value;
        else element.setAttribute(property, String(value));
      } else {
        element.textContent = String(value);
      }
    } else if (Array.isArray(value)) {
      if (property === 'classList' || property === 'className') {
        element.className = value.filter(Boolean).join(' ');
      } else if (!property) {
        element.textContent = value.join(', ');
      } else {
        element[property] = value;
      }
    } else if (value instanceof Node) {
      if (!property) {
        element.innerHTML = '';
        element.appendChild(value);
      }
    } else if (type === 'object') {
      if (property === 'style') {
        Object.entries(value).forEach(([k, v]) => {
          element.style[k] = v;
        });
      } else if (property === 'dataset') {
        Object.entries(value).forEach(([k, v]) => {
          element.dataset[k] = String(v);
        });
      } else if (!property) {
        Object.entries(value).forEach(([k, v]) => {
          if (k === 'style' && typeof v === 'object') {
            Object.entries(v).forEach(([sk, sv]) => element.style[sk] = sv);
          } else if (k in element) {
            element[k] = v;
          } else {
            element.setAttribute(k, String(v));
          }
        });
      }
    }
  }

  // Cleanup binding
  function cleanupBinding(binding) {
    clearBindingDependencies(binding);
    if (binding.element && elementBindings.has(binding.element)) {
      elementBindings.get(binding.element).delete(binding);
    }
    pendingUpdates.delete(binding);
  }

  // Create binding
  function createBinding(element, property, fn, options = {}) {
    const binding = {
      element,
      property,
      fn,
      lastValue: undefined,
      trackedStates: new Map(),
      isComputed: options.isComputed || false,
      callback: options.callback
    };

    if (element) {
      if (!elementBindings.has(element)) {
        elementBindings.set(element, new Set());
      }
      elementBindings.get(element).add(binding);
    }

    if (!options.defer) {
      executeBinding(binding);
    }

    return binding;
  }

  // Add computed property
  function addComputedProperty(state, key, computeFn) {
    const metadata = reactiveMetadata.get(state);
    if (!metadata) {
      console.error('[Reactive] Cannot add computed to non-reactive state');
      return;
    }

    let cachedValue;
    let isDirty = true;

    const computedBinding = {
      element: null,
      property: key,
      isComputed: true,
      fn: () => {
        // Just mark as dirty, don't trigger updates yet
        // Updates will happen when bindings read the computed property
        isDirty = true;
      },
      trackedStates: new Map()
    };

    metadata.computedProperties.set(key, { computeFn, binding: computedBinding });

    Object.defineProperty(state, key, {
      get() {
        if (isDirty) {
          clearBindingDependencies(computedBinding);
          const prevBinding = currentBinding;
          currentBinding = computedBinding;
          try {
            const newValue = computeFn.call(state);
            const valueChanged = cachedValue !== newValue;
            cachedValue = newValue;
            isDirty = false;
            
            // Only trigger updates if value actually changed AND we're not being called from a binding
            if (valueChanged && !prevBinding) {
              // Defer the trigger to avoid recursion
              setTimeout(() => triggerUpdate(state, key), 0);
            }
          } finally {
            currentBinding = prevBinding;
          }
        }

        if (currentBinding && currentBinding !== computedBinding) {
          trackDependency(state, key, currentBinding);
        }

        return cachedValue;
      },
      enumerable: true,
      configurable: true
    });
  }

  // Pause/Resume
  function pauseTracking() {
    isPaused = true;
  }

  function resumeTracking(flush = true) {
    isPaused = false;
    if (flush && pausedUpdates.length > 0) {
      batch(() => {
        pausedUpdates.forEach(({ state, key }) => {
          triggerUpdate(state, key);
        });
      });
      pausedUpdates = [];
    } else {
      pausedUpdates = [];
    }
  }

  // Untracked reads
  function untrack(fn) {
    const prevBinding = currentBinding;
    currentBinding = null;
    try {
      return fn();
    } finally {
      currentBinding = prevBinding;
    }
  }

  // Manual notification
  function notify(state, key) {
    if (!isReactive(state)) {
      console.warn('[Reactive] notify() called on non-reactive state');
      return;
    }

    if (key) {
      triggerUpdate(state, key);
    } else {
      const metadata = reactiveMetadata.get(state);
      if (metadata) {
        metadata.dependencies.forEach((_, k) => triggerUpdate(state, k));
      }
    }
  }

  // Binding functions
  function createBindingDef(selector, bindingDef) {
    const cleanups = [];
    let elements = [];

    if (selector.startsWith('#')) {
      const el = document.getElementById(selector.slice(1));
      if (el) elements = [el];
    } else if (selector.startsWith('.')) {
      elements = Array.from(document.getElementsByClassName(selector.slice(1)));
    } else {
      elements = Array.from(document.querySelectorAll(selector));
    }

    elements.forEach(element => {
      if (typeof bindingDef === 'function') {
        const binding = createBinding(element, null, bindingDef);
        cleanups.push(() => cleanupBinding(binding));
      } else if (typeof bindingDef === 'object') {
        Object.entries(bindingDef).forEach(([prop, fn]) => {
          if (typeof fn === 'function') {
            const binding = createBinding(element, prop, fn);
            cleanups.push(() => cleanupBinding(binding));
          }
        });
      }
    });

    return () => cleanups.forEach(c => c());
  }

  // Auto-cleanup with MutationObserver
  if (hasDOM && document.body) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.removedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (elementBindings.has(node)) {
              elementBindings.get(node).forEach(binding => cleanupBinding(binding));
              elementBindings.delete(node);
            }
            node.querySelectorAll('*').forEach(child => {
              if (elementBindings.has(child)) {
                elementBindings.get(child).forEach(binding => cleanupBinding(binding));
                elementBindings.delete(child);
              }
            });
          }
        });
      });
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  }

  // ===== REACTIVE STATE API =====

  const ReactiveState = {
    create(initialState) {
      const proxy = createReactiveProxy(initialState);
      
      // Instance methods
      Object.defineProperty(proxy, '$computed', {
        value: function(key, computeFn) {
          addComputedProperty(this, key, computeFn);
          return this;
        },
        enumerable: false
      });

      Object.defineProperty(proxy, '$watch', {
        value: function(keyOrFn, callback) {
          const binding = createBinding(null, null, 
            typeof keyOrFn === 'function' ? keyOrFn.bind(this) : () => this[keyOrFn],
            { callback: (newVal, oldVal) => oldVal !== undefined && callback(newVal, oldVal) }
          );
          return () => cleanupBinding(binding);
        },
        enumerable: false
      });

      Object.defineProperty(proxy, '$notify', {
        value: function(key) { notify(this, key); },
        enumerable: false
      });

      Object.defineProperty(proxy, '$batch', {
        value: function(fn) { return batch(() => fn.call(this)); },
        enumerable: false
      });

      Object.defineProperty(proxy, '$raw', {
        get() { return toRaw(this); },
        enumerable: false
      });

      Object.defineProperty(proxy, '$debug', {
        value: function(label) {
          console.group(`[Reactive Debug] ${label || 'State'}`);
          console.log('Raw:', toRaw(this));
          console.log('Dependencies:', ReactiveState.debug.getStateDependencies(this));
          console.groupEnd();
        },
        enumerable: false
      });

      return proxy;
    },

    // Helpers
    collection(initialArray = []) {
      const state = this.create({ items: initialArray });
      
      Object.defineProperty(state, '$add', {
        value(item) { this.items.push(item); },
        enumerable: false
      });
      
      Object.defineProperty(state, '$remove', {
        value(predicate) {
          const idx = typeof predicate === 'function' 
            ? this.items.findIndex(predicate)
            : this.items.indexOf(predicate);
          if (idx !== -1) this.items.splice(idx, 1);
        },
        enumerable: false
      });
      
      Object.defineProperty(state, '$update', {
        value(predicate, updates) {
          const idx = typeof predicate === 'function'
            ? this.items.findIndex(predicate)
            : this.items.indexOf(predicate);
          if (idx !== -1) Object.assign(this.items[idx], updates);
        },
        enumerable: false
      });
      
      Object.defineProperty(state, '$clear', {
        value() { this.items.length = 0; },
        enumerable: false
      });

      return state;
    },

    form(initialValues = {}) {
      const state = this.create({
        values: { ...initialValues },
        errors: {},
        touched: {},
        isSubmitting: false
      });

      state.$computed('isValid', function() {
        return Object.keys(this.errors).length === 0;
      });

      state.$computed('isDirty', function() {
        return Object.keys(this.touched).length > 0;
      });

      Object.defineProperty(state, '$setValue', {
        value(field, value) {
          this.values[field] = value;
          this.touched[field] = true;
        },
        enumerable: false
      });

      Object.defineProperty(state, '$setError', {
        value(field, error) {
          if (error) this.errors[field] = error;
          else delete this.errors[field];
        },
        enumerable: false
      });

      Object.defineProperty(state, '$reset', {
        value(newValues = initialValues) {
          this.values = { ...newValues };
          this.errors = {};
          this.touched = {};
          this.isSubmitting = false;
        },
        enumerable: false
      });

      return state;
    },

    async(initialValue = null) {
      const state = this.create({
        data: initialValue,
        loading: false,
        error: null
      });

      state.$computed('isSuccess', function() {
        return !this.loading && !this.error && this.data !== null;
      });

      state.$computed('isError', function() {
        return !this.loading && this.error !== null;
      });

      Object.defineProperty(state, '$execute', {
        value: async function(asyncFn) {
          this.loading = true;
          this.error = null;
          try {
            const result = await asyncFn();
            this.data = result;
            return result;
          } catch (error) {
            this.error = error;
            throw error;
          } finally {
            this.loading = false;
          }
        },
        enumerable: false
      });

      Object.defineProperty(state, '$reset', {
        value() {
          this.data = initialValue;
          this.loading = false;
          this.error = null;
        },
        enumerable: false
      });

      return state;
    },

    // Utilities
    batch,
    untrack,
    pauseTracking,
    resumeTracking,
    isReactive,
    toRaw,
    notify,

    // Debug
    debug: {
      getStateDependencies(state) {
        const metadata = reactiveMetadata.get(state);
        if (!metadata) return null;
        
        const result = {};
        metadata.dependencies.forEach((bindings, key) => {
          result[key] = {
            count: bindings.size,
            bindings: Array.from(bindings).map(b => ({
              element: b.element,
              property: b.property
            }))
          };
        });
        return result;
      },

      getReactiveStats() {
        return {
          pendingUpdates: pendingUpdates.size,
          batchDepth,
          isFlushing,
          isPaused,
          pausedUpdatesCount: pausedUpdates.length
        };
      },

      setDebugMode(enabled) {
        config.enableDebugMode = enabled;
      },

      debugState(state, label) {
        console.group(`[Reactive Debug] ${label || 'State'}`);
        console.log('Raw:', toRaw(state));
        console.log('Dependencies:', this.getStateDependencies(state));
        console.groupEnd();
      }
    },

    configure(options) {
      Object.assign(config, options);
    }
  };

  // ===== ADVANCED FEATURES =====

  // Watch (standalone)
  function watch(state, watchDefs) {
    const cleanups = Object.entries(watchDefs).map(([key, callback]) => {
      return state.$watch(key, callback);
    });
    return () => cleanups.forEach(c => c());
  }

  // Computed (standalone)
  function computed(state, computedDefs) {
    Object.entries(computedDefs).forEach(([key, computeFn]) => {
      state.$computed(key, computeFn);
    });
    return state;
  }

  // Effect
  function effect(effectFn) {
    const binding = createBinding(null, null, effectFn);
    return () => cleanupBinding(binding);
  }

  // Effects (multiple)
  function effects(effectDefs) {
    const cleanups = Object.values(effectDefs).map(fn => effect(fn));
    return () => cleanups.forEach(c => c());
  }

  // Ref
  function ref(initialValue) {
    const state = ReactiveState.create({ value: initialValue });
    
    // Auto-unwrap in operations
    state.valueOf = function() { return this.value; };
    state.toString = function() { return String(this.value); };
    
    return state;
  }

  // Refs (multiple)
  function refs(refDefs) {
    const result = {};
    Object.entries(refDefs).forEach(([key, value]) => {
      result[key] = ref(value);
    });
    return result;
  }

  // Store
  function store(initialState, options = {}) {
    const state = ReactiveState.create(initialState);

    // Add getters
    if (options.getters) {
      computed(state, options.getters);
    }

    // Add actions
    if (options.actions) {
      Object.entries(options.actions).forEach(([name, actionFn]) => {
        state[name] = function(...args) {
          return actionFn(this, ...args);
        };
      });
    }

    // Add mutations
    if (options.mutations) {
      Object.defineProperty(state, '$commit', {
        value(type, payload) {
          if (options.mutations[type]) {
            options.mutations[type](this, payload);
          }
        },
        enumerable: false
      });
    }

    return state;
  }

  // Component
  function component(config) {
    const state = ReactiveState.create(config.state || {});

    // Computed
    if (config.computed) {
      computed(state, config.computed);
    }

    // Watch
    const watchCleanups = [];
    if (config.watch) {
      watchCleanups.push(watch(state, config.watch));
    }

    // Effects
    const effectCleanups = [];
    if (config.effects) {
      effectCleanups.push(effects(config.effects));
    }

    // Bindings
    const bindingCleanups = [];
    if (config.bindings) {
      Object.entries(config.bindings).forEach(([selector, bindingDef]) => {
        bindingCleanups.push(createBindingDef(selector, bindingDef));
      });
    }

    // Actions
    if (config.actions) {
      Object.entries(config.actions).forEach(([name, actionFn]) => {
        state[name] = function(...args) {
          return actionFn(this, ...args);
        };
      });
    }

    // Lifecycle
    if (config.mounted) {
      config.mounted.call(state);
    }

    // Destroy method
    Object.defineProperty(state, '$destroy', {
      value() {
        watchCleanups.forEach(c => c());
        effectCleanups.forEach(c => c());
        bindingCleanups.forEach(c => c());
        if (config.unmounted) {
          config.unmounted.call(this);
        }
      },
      enumerable: false
    });

    return state;
  }

  // Fluent builder
  function reactive(initialState) {
    const state = ReactiveState.create(initialState);
    const cleanups = [];

    const builder = {
      state,
      
      computed(defs) {
        computed(state, defs);
        return this;
      },

      watch(defs) {
        cleanups.push(watch(state, defs));
        return this;
      },

      effect(fn) {
        cleanups.push(effect(fn));
        return this;
      },

      bind(defs) {
        Object.entries(defs).forEach(([selector, bindingDef]) => {
          cleanups.push(createBindingDef(selector, bindingDef));
        });
        return this;
      },

      action(name, fn) {
        state[name] = function(...args) {
          return fn(this, ...args);
        };
        return this;
      },

      actions(defs) {
        Object.entries(defs).forEach(([name, fn]) => {
          this.action(name, fn);
        });
        return this;
      },

      build() {
        state.destroy = () => cleanups.forEach(c => c());
        return state;
      },

      destroy() {
        cleanups.forEach(c => c());
      }
    };

    return builder;
  }

  // Declarative bindings
  function bindings(bindingDefs) {
    const cleanups = [];
    Object.entries(bindingDefs).forEach(([selector, bindingDef]) => {
      cleanups.push(createBindingDef(selector, bindingDef));
    });
    return () => cleanups.forEach(c => c());
  }

  // ===== INTEGRATE WITH DOM HELPERS =====

  const integrationAPI = {
    state: initialState => ReactiveState.create(initialState),
    computed,
    watch,
    effect,
    effects,
    ref,
    refs,
    store,
    component,
    reactive,
    bindings,
    list: initialArray => ReactiveState.collection(initialArray),
    batch,
    untrack,
    pause: pauseTracking,
    resume: resumeTracking,
    isReactive,
    toRaw,
    notify
  };

  // Add to Elements
  if (hasElements) {
    Object.assign(global.Elements, integrationAPI);
    
    global.Elements.bind = function(bindingDefs) {
      Object.entries(bindingDefs).forEach(([id, bindingDef]) => {
        const element = document.getElementById(id);
        if (element) {
          if (typeof bindingDef === 'function') {
            createBinding(element, null, bindingDef);
          } else if (typeof bindingDef === 'object') {
            Object.entries(bindingDef).forEach(([prop, fn]) => {
              if (typeof fn === 'function') {
                createBinding(element, prop, fn);
              }
            });
          }
        }
      });
    };
  }

  // Add to Collections
  if (hasCollections) {
    Object.assign(global.Collections, integrationAPI);
    
    global.Collections.bind = function(bindingDefs) {
      Object.entries(bindingDefs).forEach(([className, bindingDef]) => {
        const elements = document.getElementsByClassName(className);
        Array.from(elements).forEach(element => {
          if (typeof bindingDef === 'function') {
            createBinding(element, null, bindingDef);
          } else if (typeof bindingDef === 'object') {
            Object.entries(bindingDef).forEach(([prop, fn]) => {
              if (typeof fn === 'function') {
                createBinding(element, prop, fn);
              }
            });
          }
        });
      });
    };
  }

  // Add to Selector
  if (hasSelector && global.Selector.query) {
    Object.assign(global.Selector, integrationAPI);
    
    global.Selector.query.bind = function(bindingDefs) {
      Object.entries(bindingDefs).forEach(([selector, bindingDef]) => {
        const element = document.querySelector(selector);
        if (element) {
          if (typeof bindingDef === 'function') {
            createBinding(element, null, bindingDef);
          } else if (typeof bindingDef === 'object') {
            Object.entries(bindingDef).forEach(([prop, fn]) => {
              if (typeof fn === 'function') {
                createBinding(element, prop, fn);
              }
            });
          }
        }
      });
    };

    global.Selector.queryAll.bind = function(bindingDefs) {
      Object.entries(bindingDefs).forEach(([selector, bindingDef]) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (typeof bindingDef === 'function') {
            createBinding(element, null, bindingDef);
          } else if (typeof bindingDef === 'object') {
            Object.entries(bindingDef).forEach(([prop, fn]) => {
              if (typeof fn === 'function') {
                createBinding(element, prop, fn);
              }
            });
          }
        });
      });
    };
  }

  // Export to global
  global.ReactiveState = ReactiveState;
  global.ReactiveUtils = {
    batch,
    untrack,
    pauseTracking,
    resumeTracking,
    isReactive,
    toRaw,
    notify
  };

  console.log('[DOM Helpers Reactive] v2.0.0 loaded successfully');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
