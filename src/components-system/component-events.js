/**
 * DOM Helpers - Component Events Module
 *
 * Global event bus system for component communication.
 *
 * Features:
 * - Global event bus for inter-component communication
 * - Event namespacing
 * - Wildcard event listeners
 * - Once listeners
 * - Event history/replay
 * - Event priorities
 * - Async event handling
 *
 * @version 2.0.0
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
    global.DOMHelpersComponentEvents = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // EVENT BUS
  // ============================================================================

  const eventListeners = new Map();
  const eventHistory = [];
  const wildcardListeners = [];
  let maxHistorySize = 100;
  let enableHistory = true;

  /**
   * Subscribe to an event
   */
  function on(eventName, handler, options = {}) {
    if (!eventName || typeof eventName !== 'string') {
      throw new Error('[Component Events] Event name must be a non-empty string');
    }

    if (typeof handler !== 'function') {
      throw new Error('[Component Events] Handler must be a function');
    }

    const {
      once = false,
      priority = 0,
      namespace = null
    } = options;

    const listener = {
      handler,
      once,
      priority,
      namespace,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Handle wildcard listeners
    if (eventName === '*' || eventName.endsWith('*')) {
      wildcardListeners.push({
        pattern: eventName,
        listener
      });
      wildcardListeners.sort((a, b) => b.listener.priority - a.listener.priority);
      return listener.id;
    }

    // Regular event
    if (!eventListeners.has(eventName)) {
      eventListeners.set(eventName, []);
    }

    const listeners = eventListeners.get(eventName);
    listeners.push(listener);

    // Sort by priority (higher first)
    listeners.sort((a, b) => b.priority - a.priority);

    return listener.id;
  }

  /**
   * Subscribe to an event once
   */
  function once(eventName, handler, options = {}) {
    return on(eventName, handler, { ...options, once: true });
  }

  /**
   * Unsubscribe from an event
   */
  function off(eventName, handlerOrId = null) {
    // Remove by ID
    if (typeof handlerOrId === 'string') {
      return _removeListenerById(handlerOrId);
    }

    // Remove all listeners for event
    if (!handlerOrId) {
      if (eventName === '*') {
        wildcardListeners.length = 0;
      } else {
        eventListeners.delete(eventName);
      }
      return true;
    }

    // Remove specific handler
    if (!eventListeners.has(eventName)) {
      return false;
    }

    const listeners = eventListeners.get(eventName);
    const index = listeners.findIndex(l => l.handler === handlerOrId);

    if (index > -1) {
      listeners.splice(index, 1);
      if (listeners.length === 0) {
        eventListeners.delete(eventName);
      }
      return true;
    }

    return false;
  }

  /**
   * Remove listener by ID
   */
  function _removeListenerById(id) {
    // Check regular listeners
    for (const [eventName, listeners] of eventListeners.entries()) {
      const index = listeners.findIndex(l => l.id === id);
      if (index > -1) {
        listeners.splice(index, 1);
        if (listeners.length === 0) {
          eventListeners.delete(eventName);
        }
        return true;
      }
    }

    // Check wildcard listeners
    const wildcardIndex = wildcardListeners.findIndex(w => w.listener.id === id);
    if (wildcardIndex > -1) {
      wildcardListeners.splice(wildcardIndex, 1);
      return true;
    }

    return false;
  }

  /**
   * Emit an event
   */
  async function emit(eventName, data = {}, options = {}) {
    if (!eventName || typeof eventName !== 'string') {
      throw new Error('[Component Events] Event name must be a non-empty string');
    }

    const {
      async = false,
      bubble = true
    } = options;

    const event = {
      name: eventName,
      data,
      timestamp: Date.now(),
      stopped: false
    };

    // Add to history
    if (enableHistory) {
      eventHistory.push(event);
      if (eventHistory.length > maxHistorySize) {
        eventHistory.shift();
      }
    }

    // Get listeners
    const listeners = _getListenersForEvent(eventName);

    // Call listeners
    const results = [];

    for (const listener of listeners) {
      if (event.stopped) break;

      try {
        const result = listener.handler(event.data, {
          eventName,
          stop: () => { event.stopped = true; }
        });

        if (async && result instanceof Promise) {
          results.push(await result);
        } else {
          results.push(result);
        }

        // Remove once listeners
        if (listener.once) {
          _removeListenerById(listener.id);
        }

      } catch (error) {
        console.error(`[Component Events] Error in event handler for "${eventName}":`, error);
      }
    }

    return async ? results : undefined;
  }

  /**
   * Emit event synchronously
   */
  function emitSync(eventName, data = {}) {
    return emit(eventName, data, { async: false });
  }

  /**
   * Emit event asynchronously (returns array of results)
   */
  async function emitAsync(eventName, data = {}) {
    return emit(eventName, data, { async: true });
  }

  /**
   * Get all listeners for an event (including wildcard)
   */
  function _getListenersForEvent(eventName) {
    const listeners = [];

    // Add specific listeners
    if (eventListeners.has(eventName)) {
      listeners.push(...eventListeners.get(eventName));
    }

    // Add wildcard listeners
    wildcardListeners.forEach(({ pattern, listener }) => {
      if (_matchesWildcard(eventName, pattern)) {
        listeners.push(listener);
      }
    });

    // Sort by priority
    listeners.sort((a, b) => b.priority - a.priority);

    return listeners;
  }

  /**
   * Check if event name matches wildcard pattern
   */
  function _matchesWildcard(eventName, pattern) {
    if (pattern === '*') return true;

    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*') + '$'
    );

    return regex.test(eventName);
  }

  /**
   * Remove all listeners by namespace
   */
  function offNamespace(namespace) {
    let removed = 0;

    // Remove from regular listeners
    for (const [eventName, listeners] of eventListeners.entries()) {
      const filtered = listeners.filter(l => l.namespace !== namespace);
      removed += listeners.length - filtered.length;

      if (filtered.length === 0) {
        eventListeners.delete(eventName);
      } else {
        eventListeners.set(eventName, filtered);
      }
    }

    // Remove from wildcard listeners
    const filteredWildcard = wildcardListeners.filter(w => w.listener.namespace !== namespace);
    removed += wildcardListeners.length - filteredWildcard.length;
    wildcardListeners.length = 0;
    wildcardListeners.push(...filteredWildcard);

    return removed;
  }

  /**
   * Get all listeners
   */
  function getListeners(eventName = null) {
    if (eventName) {
      return _getListenersForEvent(eventName);
    }

    // Return all listeners
    const all = [];

    eventListeners.forEach((listeners, name) => {
      listeners.forEach(listener => {
        all.push({ eventName: name, ...listener });
      });
    });

    wildcardListeners.forEach(({ pattern, listener }) => {
      all.push({ eventName: pattern, ...listener });
    });

    return all;
  }

  /**
   * Get event history
   */
  function getHistory(eventName = null, limit = null) {
    let history = eventName
      ? eventHistory.filter(e => e.name === eventName)
      : [...eventHistory];

    if (limit) {
      history = history.slice(-limit);
    }

    return history;
  }

  /**
   * Clear event history
   */
  function clearHistory() {
    eventHistory.length = 0;
  }

  /**
   * Configure event system
   */
  function configure(options = {}) {
    if (options.maxHistorySize !== undefined) {
      maxHistorySize = options.maxHistorySize;
    }

    if (options.enableHistory !== undefined) {
      enableHistory = options.enableHistory;
    }

    return { maxHistorySize, enableHistory };
  }

  /**
   * Replay events from history
   */
  async function replay(eventName = null, options = {}) {
    const { from = 0, to = null } = options;

    const toReplay = getHistory(eventName)
      .slice(from, to || undefined);

    for (const event of toReplay) {
      await emit(event.name, event.data, { async: true });
    }

    return toReplay.length;
  }

  /**
   * Clear all listeners
   */
  function clear() {
    eventListeners.clear();
    wildcardListeners.length = 0;
    console.log('[Component Events] All event listeners cleared');
  }

  /**
   * Get statistics
   */
  function getStats() {
    let totalListeners = 0;

    eventListeners.forEach(listeners => {
      totalListeners += listeners.length;
    });

    totalListeners += wildcardListeners.length;

    return {
      events: eventListeners.size,
      wildcardListeners: wildcardListeners.length,
      totalListeners,
      historySize: eventHistory.length,
      historyEnabled: enableHistory
    };
  }

  /**
   * Create namespaced event bus
   */
  function createNamespace(namespace) {
    return {
      on: (eventName, handler, options = {}) =>
        on(eventName, handler, { ...options, namespace }),

      once: (eventName, handler, options = {}) =>
        once(eventName, handler, { ...options, namespace }),

      off: (eventName, handler) => off(eventName, handler),

      emit: (eventName, data, options) => emit(eventName, data, options),

      emitSync: (eventName, data) => emitSync(eventName, data),

      emitAsync: (eventName, data) => emitAsync(eventName, data),

      clear: () => offNamespace(namespace),

      namespace
    };
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const ComponentEvents = {
    // Subscribe
    on,
    once,
    off,
    offNamespace,

    // Emit
    emit,
    emitSync,
    emitAsync,

    // Query
    getListeners,
    getHistory,
    getStats,

    // Management
    clear,
    clearHistory,
    configure,
    replay,

    // Namespaces
    createNamespace,

    // Version
    version: '2.0.0'
  };

  // ============================================================================
  // GLOBAL EXPORT
  // ============================================================================

  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    if (!globalObj.ComponentHelpers) {
      globalObj.ComponentHelpers = {};
    }

    globalObj.ComponentHelpers.events = ComponentEvents;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Component Events] v2.0.0 initialized');
  }

  return ComponentEvents;
});
