/**
 * DOM Helpers - Reactive Core
 *
 * Core reactive state management with Vue/React-like reactivity
 * Provides proxy-based reactive objects with automatic dependency tracking
 *
 * @version 2.3.1
 * @license MIT
 */

(function (global, factory) {
  'use strict';

  // UMD pattern for universal module support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    global.DOMHelpersReactiveCore = factory();

    // Legacy global exports for backward compatibility
    global.ReactiveState = {
      create: global.DOMHelpersReactiveCore.state,
      async: global.DOMHelpersReactiveCore.async,
      // Note: collection and form have been moved to separate modules
      // Use reactive-collections.js and reactive-forms.js instead
    };
    global.ReactiveUtils = global.DOMHelpersReactiveCore;
    global.updateAll = global.DOMHelpersReactiveCore.updateAll;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // Detect core DOM Helpers modules
  const hasElements = typeof Elements !== 'undefined';
  const hasCollections = typeof Collections !== 'undefined';
  const hasSelector = typeof Selector !== 'undefined';

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const reactiveMap = new WeakMap();
  let currentEffect = null;
  let batchDepth = 0;
  let pendingUpdates = new Set();

  const RAW = Symbol('raw');
  const IS_REACTIVE = Symbol('reactive');

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Check if a value is reactive
   * @param {*} v - Value to check
   * @returns {boolean}
   */
  function isReactive(v) {
    return !!(v && v[IS_REACTIVE]);
  }

  /**
   * Get the raw (non-reactive) value
   * @param {*} v - Reactive value
   * @returns {*} Raw value
   */
  function toRaw(v) {
    return (v && v[RAW]) || v;
  }

  /**
   * Get nested property value
   * @param {Object} obj - Source object
   * @param {string} path - Dot-separated property path
   * @returns {*} Property value
   * @exported Used by reactive-collections and reactive-forms
   */
  function getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Set nested property value
   * @param {Object} obj - Target object
   * @param {string} path - Dot-separated property path
   * @param {*} value - Value to set
   * @exported Used by reactive-collections and reactive-forms
   */
  function setNestedProperty(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }

  // ============================================================================
  // BATCHING
  // ============================================================================

  /**
   * Execute a function within a batch context
   * Updates are collected and flushed together for performance
   * @param {Function} fn - Function to execute
   * @returns {*} Result of function execution
   */
  function batch(fn) {
    batchDepth++;
    try {
      return fn();
    } finally {
      batchDepth--;
      if (batchDepth === 0) flush();
    }
  }

  /**
   * Flush all pending updates
   * @internal
   */
  function flush() {
    if (pendingUpdates.size === 0) return;
    const updates = Array.from(pendingUpdates);
    pendingUpdates.clear();
    updates.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error('[Reactive] Error:', e);
      }
    });
  }

  /**
   * Queue an update for execution
   * @param {Function} fn - Update function
   * @internal
   */
  function queueUpdate(fn) {
    if (batchDepth > 0) {
      pendingUpdates.add(fn);
    } else {
      fn();
    }
  }

  // ============================================================================
  // REACTIVE PROXY
  // ============================================================================

  /**
   * Create a reactive proxy for an object
   * Changes to the proxy trigger automatic updates in effects and watchers
   * @param {Object} target - Object to make reactive
   * @returns {Proxy} Reactive proxy
   */
  function createReactive(target) {
    if (!target || typeof target !== 'object') return target;
    if (isReactive(target)) return target;

    const deps = new Map();
    const computedMap = new Map();

    const proxy = new Proxy(target, {
      get(obj, key) {
        if (key === RAW) return target;
        if (key === IS_REACTIVE) return true;

        // Track dependency
        if (currentEffect && typeof key !== 'symbol') {
          if (!deps.has(key)) deps.set(key, new Set());
          deps.get(key).add(currentEffect);
          if (currentEffect.onDep) currentEffect.onDep(key);
        }

        let value = obj[key];

        // Handle computed properties
        if (computedMap.has(key)) {
          const comp = computedMap.get(key);
          if (comp.dirty) {
            comp.deps.clear();
            const prevEffect = currentEffect;
            currentEffect = {
              isComputed: true,
              onDep: (k) => comp.deps.add(k)
            };
            try {
              value = comp.fn.call(proxy);
              comp.value = value;
              comp.dirty = false;
            } finally {
              currentEffect = prevEffect;
            }
          }
          value = comp.value;

          // Track computed as dependency
          if (currentEffect && !currentEffect.isComputed) {
            if (!deps.has(key)) deps.set(key, new Set());
            deps.get(key).add(currentEffect);
          }

          return value;
        }

        // Deep reactivity - make nested objects reactive
        if (value && typeof value === 'object' && !isReactive(value)) {
          value = createReactive(value);
          obj[key] = value;
        }

        return value;
      },

      set(obj, key, value) {
        if (obj[key] === value) return true;
        obj[key] = toRaw(value);

        // Trigger updates
        const effects = deps.get(key);
        if (effects) {
          // Mark computed properties as dirty and notify their dependents
          computedMap.forEach((comp, compKey) => {
            if (comp.deps.has(key)) {
              comp.dirty = true;
              const compDeps = deps.get(compKey);
              if (compDeps) {
                compDeps.forEach(effect => {
                  if (effect && !effect.isComputed) {
                    queueUpdate(effect);
                  }
                });
              }
            }
          });

          // Schedule effect updates
          effects.forEach(effect => {
            if (effect && !effect.isComputed) {
              queueUpdate(effect);
            }
          });
        }

        return true;
      }
    });

    reactiveMap.set(proxy, { deps, computedMap });

    // Add instance methods
    if (!proxy.$computed) {
      Object.defineProperties(proxy, {
        $computed: {
          value: function(key, fn) {
            addComputed(this, key, fn);
            return this;
          },
          enumerable: false,
          configurable: true
        },
        $watch: {
          value: function(keyOrFn, callback) {
            return addWatch(this, keyOrFn, callback);
          },
          enumerable: false,
          configurable: true
        },
        $batch: {
          value: function(fn) {
            return batch(() => fn.call(this));
          },
          enumerable: false,
          configurable: true
        },
        $notify: {
          value: function(key) {
            notify(this, key);
          },
          enumerable: false,
          configurable: true
        },
        $raw: {
          get() { return toRaw(this); },
          enumerable: false,
          configurable: true
        },
        $update: {
          value: function(updates) {
            return updateMixed(this, updates);
          },
          enumerable: false,
          configurable: true
        },
        $set: {
          value: function(updates) {
            return setWithFunctions(this, updates);
          },
          enumerable: false,
          configurable: true
        },
        $bind: {
          value: function(bindingDefs) {
            return createBindings(this, bindingDefs);
          },
          enumerable: false,
          configurable: true
        }
      });
    }

    return proxy;
  }

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Create a reactive effect that automatically re-runs when dependencies change
   * @param {Function} fn - Effect function to execute
   * @returns {Function} Cleanup function
   */
  function effect(fn) {
    const execute = () => {
      const prevEffect = currentEffect;
      currentEffect = execute;
      try {
        fn();
      } finally {
        currentEffect = prevEffect;
      }
    };
    execute();
    return () => { currentEffect = null; };
  }

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /**
   * Add a computed property to a reactive state
   * Computed properties are lazily evaluated and cached until dependencies change
   * @param {Object} state - Reactive state object
   * @param {string} key - Property name
   * @param {Function} fn - Computation function
   */
  function addComputed(state, key, fn) {
    const meta = reactiveMap.get(state);
    if (!meta) {
      console.error('[Reactive] Cannot add computed to non-reactive state');
      return;
    }

    const comp = {
      fn,
      value: undefined,
      dirty: true,
      deps: new Set()
    };

    meta.computedMap.set(key, comp);

    Object.defineProperty(state, key, {
      get() {
        if (comp.dirty) {
          comp.deps.clear();
          const prevEffect = currentEffect;
          currentEffect = {
            isComputed: true,
            onDep: (k) => comp.deps.add(k)
          };
          try {
            comp.value = fn.call(state);
            comp.dirty = false;
          } finally {
            currentEffect = prevEffect;
          }
        }

        if (currentEffect && !currentEffect.isComputed) {
          if (!meta.deps.has(key)) meta.deps.set(key, new Set());
          meta.deps.get(key).add(currentEffect);
        }

        return comp.value;
      },
      enumerable: true,
      configurable: true
    });
  }

  // ============================================================================
  // WATCHERS
  // ============================================================================

  /**
   * Watch a property or computed value for changes
   * @param {Object} state - Reactive state object
   * @param {string|Function} keyOrFn - Property name or getter function
   * @param {Function} callback - Callback(newValue, oldValue)
   * @returns {Function} Cleanup function
   */
  function addWatch(state, keyOrFn, callback) {
    let oldValue;
    if (typeof keyOrFn === 'function') {
      oldValue = keyOrFn.call(state);
      return effect(() => {
        const newValue = keyOrFn.call(state);
        if (newValue !== oldValue) {
          callback(newValue, oldValue);
          oldValue = newValue;
        }
      });
    } else {
      oldValue = state[keyOrFn];
      return effect(() => {
        const newValue = state[keyOrFn];
        if (newValue !== oldValue) {
          callback(newValue, oldValue);
          oldValue = newValue;
        }
      });
    }
  }

  /**
   * Manually trigger effects for a property
   * @param {Object} state - Reactive state object
   * @param {string} [key] - Specific property (or all if not provided)
   */
  function notify(state, key) {
    const meta = reactiveMap.get(state);
    if (!meta) return;

    if (key) {
      const effects = meta.deps.get(key);
      if (effects) {
        effects.forEach(e => e && !e.isComputed && queueUpdate(e));
      }
    } else {
      meta.deps.forEach(effects => {
        effects.forEach(e => e && !e.isComputed && queueUpdate(e));
      });
    }
  }

  // ============================================================================
  // DOM BINDINGS
  // ============================================================================

  /**
   * Apply a value to a DOM element property
   * @param {HTMLElement} el - Target element
   * @param {string|null} prop - Property name (null for textContent)
   * @param {*} value - Value to apply
   * @internal
   */
  function applyValue(el, prop, value) {
    if (value == null) {
      if (prop) el[prop] = '';
      else el.textContent = '';
      return;
    }

    const type = typeof value;

    if (type === 'string' || type === 'number' || type === 'boolean') {
      if (prop) {
        if (prop in el) el[prop] = value;
        else el.setAttribute(prop, String(value));
      } else {
        el.textContent = String(value);
      }
    } else if (Array.isArray(value)) {
      if (prop === 'classList' || prop === 'className') {
        el.className = value.filter(Boolean).join(' ');
      } else if (!prop) {
        el.textContent = value.join(', ');
      }
    } else if (type === 'object') {
      if (prop === 'style') {
        Object.entries(value).forEach(([k, v]) => el.style[k] = v);
      } else if (prop === 'dataset') {
        Object.entries(value).forEach(([k, v]) => el.dataset[k] = String(v));
      } else if (!prop) {
        Object.entries(value).forEach(([k, v]) => {
          if (k === 'style' && typeof v === 'object') {
            Object.entries(v).forEach(([sk, sv]) => el.style[sk] = sv);
          } else if (k in el) {
            el[k] = v;
          }
        });
      }
    }
  }

  /**
   * Create reactive bindings between state and DOM elements
   * @param {Object} state - Reactive state object
   * @param {Object} bindingDefs - Binding definitions { selector: binding }
   * @returns {Function} Cleanup function
   */
  function createBindings(state, bindingDefs) {
    const cleanups = [];

    Object.entries(bindingDefs).forEach(([selector, binding]) => {
      let elements = [];

      if (selector.startsWith('#')) {
        const el = document.getElementById(selector.slice(1));
        if (el) elements = [el];
      } else if (selector.startsWith('.')) {
        elements = Array.from(document.getElementsByClassName(selector.slice(1)));
      } else {
        elements = Array.from(document.querySelectorAll(selector));
      }

      elements.forEach(el => {
        if (typeof binding === 'string') {
          // Simple property binding: '#counter': 'count'
          cleanups.push(effect(() => {
            const value = binding.includes('.')
              ? getNestedProperty(state, binding)
              : state[binding];
            applyValue(el, null, value);
          }));
        } else if (typeof binding === 'function') {
          // Computed binding: '#userName': () => state.user.name
          cleanups.push(effect(() => {
            const value = binding.call(state);
            applyValue(el, null, value);
          }));
        } else if (typeof binding === 'object') {
          // Multiple property bindings
          Object.entries(binding).forEach(([prop, value]) => {
            if (typeof value === 'function') {
              cleanups.push(effect(() => {
                const result = value.call(state);
                applyValue(el, prop, result);
              }));
            } else if (typeof value === 'string') {
              cleanups.push(effect(() => {
                const result = value.includes('.')
                  ? getNestedProperty(state, value)
                  : state[value];
                applyValue(el, prop, result);
              }));
            }
          });
        }
      });
    });

    return () => cleanups.forEach(c => c());
  }

  /**
   * Create bindings with selector-based effects
   * @param {Object} defs - Binding definitions
   * @returns {Function} Cleanup function
   */
  function bindings(defs) {
    const cleanups = [];

    Object.entries(defs).forEach(([selector, bindingDef]) => {
      let elements = [];

      if (selector.startsWith('#')) {
        const el = document.getElementById(selector.slice(1));
        if (el) elements = [el];
      } else if (selector.startsWith('.')) {
        elements = Array.from(document.getElementsByClassName(selector.slice(1)));
      } else {
        elements = Array.from(document.querySelectorAll(selector));
      }

      elements.forEach(el => {
        if (typeof bindingDef === 'function') {
          cleanups.push(effect(() => {
            const value = bindingDef();
            applyValue(el, null, value);
          }));
        } else if (typeof bindingDef === 'object') {
          Object.entries(bindingDef).forEach(([prop, fn]) => {
            if (typeof fn === 'function') {
              cleanups.push(effect(() => {
                const value = fn();
                applyValue(el, prop, value);
              }));
            }
          });
        }
      });
    });

    return () => cleanups.forEach(c => c());
  }

  // ============================================================================
  // UPDATE UTILITIES
  // ============================================================================

  /**
   * Update DOM elements by selector
   * @param {string} selector - CSS selector
   * @param {Object|*} updates - Updates to apply
   * @internal
   */
  function updateDOMElements(selector, updates) {
    let elements = [];

    if (selector.startsWith('#')) {
      const el = document.getElementById(selector.slice(1));
      if (el) elements = [el];
    } else if (selector.startsWith('.')) {
      elements = Array.from(document.getElementsByClassName(selector.slice(1)));
    } else {
      elements = Array.from(document.querySelectorAll(selector));
    }

    elements.forEach(el => {
      if (typeof updates === 'object' && updates !== null) {
        Object.entries(updates).forEach(([prop, value]) => {
          applyValue(el, prop, value);
        });
      } else {
        applyValue(el, null, updates);
      }
    });
  }

  /**
   * Mixed state and DOM updates
   * Automatically detects selectors and updates both state and DOM
   * @param {Object} state - Reactive state object
   * @param {Object} updates - Updates { key: value, '.selector': {...} }
   * @returns {Object} Updated state
   */
  function updateMixed(state, updates) {
    return batch(() => {
      Object.entries(updates).forEach(([key, value]) => {
        // Check if it's a DOM selector
        if (key.startsWith('#') || key.startsWith('.') || key.includes('[') || key.includes('>')) {
          updateDOMElements(key, value);
        } else {
          // It's a state update
          if (key.includes('.')) {
            setNestedProperty(state, key, value);
          } else {
            state[key] = value;
          }
        }
      });
      return state;
    });
  }

  /**
   * Functional updates - values can be functions
   * @param {Object} state - Reactive state object
   * @param {Object} updates - Updates { key: value | (prev) => newValue }
   * @returns {Object} Updated state
   */
  function setWithFunctions(state, updates) {
    return batch(() => {
      Object.entries(updates).forEach(([key, value]) => {
        const finalValue = typeof value === 'function'
          ? value(key.includes('.') ? getNestedProperty(state, key) : state[key])
          : value;

        if (key.includes('.')) {
          setNestedProperty(state, key, finalValue);
        } else {
          state[key] = finalValue;
        }
      });
      return state;
    });
  }

  /**
   * Unified update method (alias for updateMixed)
   * @param {Object} state - Reactive state object
   * @param {Object} updates - Updates to apply
   * @returns {Object} Updated state
   */
  function updateAll(state, updates) {
    return updateMixed(state, updates);
  }

  // ============================================================================
  // STATE CREATORS
  // ============================================================================

  /**
   * Create state with automatic bindings
   * @param {Object} initialState - Initial state values
   * @param {Object} [bindingDefs] - Optional binding definitions
   * @returns {Object} Reactive state with bindings
   */
  function createStateWithBindings(initialState, bindingDefs) {
    const state = createReactive(initialState);

    if (bindingDefs) {
      createBindings(state, bindingDefs);
    }

    return state;
  }

  /**
   * Create a reactive reference
   * Wraps a single value in a reactive object with .value property
   * @param {*} value - Initial value
   * @returns {Object} Reactive ref with .value
   */
  function ref(value) {
    const state = createReactive({ value });
    state.valueOf = function() { return this.value; };
    state.toString = function() { return String(this.value); };
    return state;
  }

  /**
   * Create async state with loading/error tracking
   * @param {*} [initialValue=null] - Initial data value
   * @returns {Object} Reactive async state
   */
  function asyncState(initialValue = null) {
    const state = createReactive({
      data: initialValue,
      loading: false,
      error: null
    });

    addComputed(state, 'isSuccess', function() {
      return !this.loading && !this.error && this.data !== null;
    });

    addComputed(state, 'isError', function() {
      return !this.loading && this.error !== null;
    });

    state.$execute = async function(fn) {
      this.loading = true;
      this.error = null;
      try {
        const result = await fn();
        this.data = result;
        return result;
      } catch (e) {
        this.error = e;
        throw e;
      } finally {
        this.loading = false;
      }
    };

    state.$reset = function() {
      this.data = initialValue;
      this.loading = false;
      this.error = null;
    };

    return state;
  }

  /**
   * Create a store with getters and actions
   * @param {Object} initialState - Initial state
   * @param {Object} [options] - Options { getters, actions }
   * @returns {Object} Reactive store
   */
  function store(initialState, options = {}) {
    const state = createReactive(initialState);

    if (options.getters) {
      Object.entries(options.getters).forEach(([key, fn]) => {
        addComputed(state, key, fn);
      });
    }

    if (options.actions) {
      Object.entries(options.actions).forEach(([name, fn]) => {
        state[name] = function(...args) {
          return fn(this, ...args);
        };
      });
    }

    return state;
  }

  /**
   * Create a component with state, computed, watch, effects, and bindings
   * @param {Object} config - Component configuration
   * @returns {Object} Component state with $destroy method
   */
  function component(config) {
    const state = createReactive(config.state || {});

    if (config.computed) {
      Object.entries(config.computed).forEach(([key, fn]) => {
        addComputed(state, key, fn);
      });
    }

    const cleanups = [];

    if (config.watch) {
      Object.entries(config.watch).forEach(([key, callback]) => {
        cleanups.push(addWatch(state, key, callback));
      });
    }

    if (config.effects) {
      Object.values(config.effects).forEach(fn => {
        cleanups.push(effect(fn));
      });
    }

    if (config.bindings) {
      cleanups.push(bindings(config.bindings));
    }

    if (config.actions) {
      Object.entries(config.actions).forEach(([name, fn]) => {
        state[name] = function(...args) {
          return fn(this, ...args);
        };
      });
    }

    if (config.mounted) {
      config.mounted.call(state);
    }

    state.$destroy = function() {
      cleanups.forEach(c => c());
      if (config.unmounted) {
        config.unmounted.call(this);
      }
    };

    return state;
  }

  /**
   * Reactive builder pattern for fluent API
   * @param {Object} initialState - Initial state
   * @returns {Object} Builder with chainable methods
   */
  function reactive(initialState) {
    const state = createReactive(initialState);
    const cleanups = [];

    const builder = {
      state,
      computed(defs) {
        Object.entries(defs).forEach(([k, fn]) => addComputed(state, k, fn));
        return this;
      },
      watch(defs) {
        Object.entries(defs).forEach(([k, cb]) => {
          cleanups.push(addWatch(state, k, cb));
        });
        return this;
      },
      effect(fn) {
        cleanups.push(effect(fn));
        return this;
      },
      bind(defs) {
        cleanups.push(bindings(defs));
        return this;
      },
      action(name, fn) {
        state[name] = function(...args) { return fn(this, ...args); };
        return this;
      },
      actions(defs) {
        Object.entries(defs).forEach(([name, fn]) => this.action(name, fn));
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

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const api = {
    // Core
    state: createReactive,
    createState: createStateWithBindings,
    ref,
    refs: (defs) => {
      const result = {};
      Object.entries(defs).forEach(([k, v]) => result[k] = ref(v));
      return result;
    },

    // Advanced
    store,
    component,
    reactive,
    async: asyncState,

    // Computed & Watch
    computed: (state, defs) => {
      Object.entries(defs).forEach(([k, fn]) => addComputed(state, k, fn));
      return state;
    },
    watch: (state, defs) => {
      const cleanups = Object.entries(defs).map(([k, cb]) => addWatch(state, k, cb));
      return () => cleanups.forEach(c => c());
    },

    // Effects
    effect,
    effects: (defs) => {
      const cleanups = Object.values(defs).map(fn => effect(fn));
      return () => cleanups.forEach(c => c());
    },

    // Bindings
    bindings,

    // Updates
    updateAll,

    // Utilities
    batch,
    isReactive,
    toRaw,
    notify,
    pause: () => batchDepth++,
    resume: (fl) => {
      batchDepth = Math.max(0, batchDepth - 1);
      if (fl && batchDepth === 0) flush();
    },
    untrack: (fn) => {
      const prev = currentEffect;
      currentEffect = null;
      try {
        return fn();
      } finally {
        currentEffect = prev;
      }
    },

    // Exported utilities for other modules
    getNestedProperty,
    setNestedProperty,
    applyValue,

    // Version
    version: '2.3.1'
  };

  // ============================================================================
  // DOM HELPERS INTEGRATION
  // ============================================================================

  // Integrate with Elements helper if available
  if (hasElements && typeof Elements !== 'undefined') {
    Object.assign(Elements, api);

    // Elements.bind for ID-based bindings
    Elements.bind = function(bindingDefs) {
      Object.entries(bindingDefs).forEach(([id, bindingDef]) => {
        const element = document.getElementById(id);
        if (element) {
          if (typeof bindingDef === 'function') {
            effect(() => applyValue(element, null, bindingDef()));
          } else if (typeof bindingDef === 'object') {
            Object.entries(bindingDef).forEach(([prop, fn]) => {
              if (typeof fn === 'function') {
                effect(() => applyValue(element, prop, fn()));
              }
            });
          }
        }
      });
    };
  }

  // Integrate with Collections helper if available
  if (hasCollections && typeof Collections !== 'undefined') {
    Object.assign(Collections, api);

    // Collections.bind for class-based bindings
    Collections.bind = function(bindingDefs) {
      Object.entries(bindingDefs).forEach(([className, bindingDef]) => {
        const elements = document.getElementsByClassName(className);
        Array.from(elements).forEach(element => {
          if (typeof bindingDef === 'function') {
            effect(() => applyValue(element, null, bindingDef()));
          } else if (typeof bindingDef === 'object') {
            Object.entries(bindingDef).forEach(([prop, fn]) => {
              if (typeof fn === 'function') {
                effect(() => applyValue(element, prop, fn()));
              }
            });
          }
        });
      });
    };
  }

  // Integrate with Selector helper if available
  if (hasSelector && typeof Selector !== 'undefined') {
    Object.assign(Selector, api);

    // Selector.query for single element queries
    if (Selector.query) {
      Object.assign(Selector.query, api);

      Selector.query.bind = function(bindingDefs) {
        Object.entries(bindingDefs).forEach(([selector, bindingDef]) => {
          const element = document.querySelector(selector);
          if (element) {
            if (typeof bindingDef === 'function') {
              effect(() => applyValue(element, null, bindingDef()));
            } else if (typeof bindingDef === 'object') {
              Object.entries(bindingDef).forEach(([prop, fn]) => {
                if (typeof fn === 'function') {
                  effect(() => applyValue(element, prop, fn()));
                }
              });
            }
          }
        });
      };
    }

    // Selector.queryAll for multiple element queries
    if (Selector.queryAll) {
      Object.assign(Selector.queryAll, api);

      Selector.queryAll.bind = function(bindingDefs) {
        Object.entries(bindingDefs).forEach(([selector, bindingDef]) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (typeof bindingDef === 'function') {
              effect(() => applyValue(element, null, bindingDef()));
            } else if (typeof bindingDef === 'object') {
              Object.entries(bindingDef).forEach(([prop, fn]) => {
                if (typeof fn === 'function') {
                  effect(() => applyValue(element, prop, fn()));
                }
              });
            }
          });
        });
      };
    }
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Reactive Core] v2.3.1 loaded successfully');
    console.log('[DOM Helpers Reactive Core] Features available:');
    console.log('  - state.$update() - Mixed state + DOM updates');
    console.log('  - state.$set() - Functional updates');
    console.log('  - state.$bind() - Create reactive bindings');
    console.log('  - Elements/Collections/Selector.createState() - State with auto-bindings');
    console.log('  - Elements/Collections/Selector.updateAll() - Unified updates');
    console.log('  Note: collection() and form() moved to reactive-collections.js and reactive-forms.js');
  }

  return api;
});
