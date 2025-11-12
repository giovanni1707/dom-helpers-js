# Component Instance Methods - Complete Guide

## Overview

Components are self-contained reactive units that combine state, computed properties, watchers, effects, actions, DOM bindings, and lifecycle hooks. Created with `ReactiveUtils.component()`, they provide a complete solution for building interactive UI widgets with automatic cleanup capabilities.

---

## Table of Contents

1. [$destroy()](#destroy) - Clean up component and all resources
2. [What Gets Cleaned Up](#what-gets-cleaned-up) - Automatic cleanup details
3. [Use Cases](#use-cases) - When to use $destroy()
4. [Best Practices](#best-practices) - Do's and Don'ts
5. [Common Patterns](#common-patterns) - Cleanup patterns
6. [Testing Example](#testing-example) - Testing with cleanup
7. [Troubleshooting](#troubleshooting) - Common issues and solutions
8. [API Quick Reference](#api-quick-reference) - Quick lookup

---

## `$destroy()`

Clean up all effects, watchers, bindings, and execute unmounted lifecycle hook.

### Syntax
```javascript
component.$destroy()
```

### Parameters
- None

### Returns
- `undefined`

### Example - Basic Cleanup
```javascript
const counter = ReactiveUtils.component({
  state: {
    count: 0
  },
  
  bindings: {
    '#counter-display': 'count'
  },
  
  mounted() {
    console.log('Counter mounted');
  },
  
  unmounted() {
    console.log('Counter destroyed');
  }
});

// Use the component
counter.count++; // Updates DOM

// Clean up when done
counter.$destroy(); // Logs: "Counter destroyed"
// All bindings removed, watchers stopped
```

### Example - Timer Component
```javascript
const timer = ReactiveUtils.component({
  state: {
    seconds: 0,
    isRunning: false
  },
  
  computed: {
    formatted() {
      const mins = Math.floor(this.seconds / 60);
      const secs = this.seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  },
  
  bindings: {
    '#timer-display': 'formatted',
    '#start-btn': {
      textContent: () => timer.isRunning ? 'Pause' : 'Start'
    }
  },
  
  actions: {
    start(state) {
      state.isRunning = true;
    },
    pause(state) {
      state.isRunning = false;
    },
    reset(state) {
      state.seconds = 0;
      state.isRunning = false;
    }
  },
  
  mounted() {
    console.log('Timer started');
    
    // Store interval ID
    this.intervalId = setInterval(() => {
      if (this.isRunning) {
        this.seconds++;
      }
    }, 1000);
  },
  
  unmounted() {
    console.log('Timer stopped');
    
    // Clean up interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
});

// Use timer
timer.start();

// Later: clean up
timer.$destroy(); // Stops interval, removes bindings
```

### Example - Event Listener Cleanup
```javascript
const dropdown = ReactiveUtils.component({
  state: {
    isOpen: false,
    selectedValue: null
  },
  
  bindings: {
    '#dropdown-menu': {
      className: () => dropdown.isOpen ? 'dropdown-menu open' : 'dropdown-menu'
    },
    '#selected-value': () => dropdown.selectedValue || 'Select an option'
  },
  
  actions: {
    toggle(state) {
      state.isOpen = !state.isOpen;
    },
    select(state, value) {
      state.selectedValue = value;
      state.isOpen = false;
    },
    close(state) {
      state.isOpen = false;
    }
  },
  
  mounted() {
    // Close dropdown when clicking outside
    this.handleClickOutside = (e) => {
      const dropdownEl = document.getElementById('dropdown-menu');
      if (dropdownEl && !dropdownEl.contains(e.target)) {
        this.close();
      }
    };
    
    document.addEventListener('click', this.handleClickOutside);
    
    // Close on Escape key
    this.handleEscape = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    };
    
    document.addEventListener('keydown', this.handleEscape);
    
    console.log('Dropdown mounted, event listeners attached');
  },
  
  unmounted() {
    // Remove event listeners
    if (this.handleClickOutside) {
      document.removeEventListener('click', this.handleClickOutside);
    }
    
    if (this.handleEscape) {
      document.removeEventListener('keydown', this.handleEscape);
    }
    
    console.log('Dropdown destroyed, event listeners removed');
  }
});

// Later: destroy component
dropdown.$destroy(); // Removes all event listeners and bindings
```

### Example - WebSocket Cleanup
```javascript
const liveChat = ReactiveUtils.component({
  state: {
    messages: [],
    connected: false,
    error: null
  },
  
  computed: {
    messageCount() {
      return this.messages.length;
    }
  },
  
  bindings: {
    '#message-list': function() {
      return this.messages.map(msg => `
        <div class="message">
          <strong>${msg.user}:</strong> ${msg.text}
        </div>
      `).join('');
    },
    '#connection-status': function() {
      if (this.connected) return '🟢 Connected';
      if (this.error) return '🔴 Error';
      return '🟡 Connecting...';
    }
  },
  
  actions: {
    addMessage(state, message) {
      state.messages.push(message);
    },
    sendMessage(state, text) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'message', text }));
      }
    }
  },
  
  mounted() {
    console.log('Connecting to chat...');
    
    // Create WebSocket connection
    this.ws = new WebSocket('ws://localhost:3000/chat');
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.connected = true;
      this.error = null;
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.addMessage(data);
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.error = 'Connection error';
      this.connected = false;
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.connected = false;
    };
  },
  
  unmounted() {
    console.log('Closing chat connection...');
    
    // Close WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
});

// Use chat
liveChat.sendMessage('Hello, world!');

// Clean up when leaving page
window.addEventListener('beforeunload', () => {
  liveChat.$destroy(); // Closes WebSocket, removes bindings
});
```

### Example - Animation Frame Cleanup
```javascript
const animator = ReactiveUtils.component({
  state: {
    x: 0,
    y: 0,
    rotation: 0,
    isPaused: false
  },
  
  bindings: {
    '#animated-element': {
      style: function() {
        return {
          transform: `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`
        };
      }
    }
  },
  
  actions: {
    pause(state) {
      state.isPaused = true;
    },
    resume(state) {
      state.isPaused = false;
    }
  },
  
  mounted() {
    console.log('Animation started');
    
    // Animation loop
    const animate = () => {
      if (!this.isPaused) {
        this.rotation = (this.rotation + 2) % 360;
        this.x = Math.sin(this.rotation * Math.PI / 180) * 100;
        this.y = Math.cos(this.rotation * Math.PI / 180) * 100;
      }
      
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  },
  
  unmounted() {
    console.log('Animation stopped');
    
    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
});

// Stop animation when done
animator.$destroy(); // Cancels animation frame
```

### Example - Multiple Components Management
```javascript
class ComponentManager {
  constructor() {
    this.components = new Map();
  }
  
  register(id, component) {
    // Destroy existing component with same ID
    if (this.components.has(id)) {
      this.components.get(id).$destroy();
    }
    
    this.components.set(id, component);
    console.log(`Component "${id}" registered`);
  }
  
  destroy(id) {
    const component = this.components.get(id);
    if (component) {
      component.$destroy();
      this.components.delete(id);
      console.log(`Component "${id}" destroyed`);
    }
  }
  
  destroyAll() {
    console.log(`Destroying ${this.components.size} components...`);
    this.components.forEach((component, id) => {
      component.$destroy();
      console.log(`  - Destroyed "${id}"`);
    });
    this.components.clear();
  }
  
  get count() {
    return this.components.size;
  }
}

// Usage
const manager = new ComponentManager();

// Create and register components
const counter = ReactiveUtils.component({
  state: { count: 0 },
  bindings: { '#counter': 'count' }
});
manager.register('counter', counter);

const timer = ReactiveUtils.component({
  state: { seconds: 0 },
  bindings: { '#timer': 'seconds' },
  mounted() {
    this.intervalId = setInterval(() => this.seconds++, 1000);
  },
  unmounted() {
    clearInterval(this.intervalId);
  }
});
manager.register('timer', timer);

// Destroy specific component
manager.destroy('counter');

// Destroy all components
manager.destroyAll();
```

### Example - SPA Route Cleanup
```javascript
// Router integration
const router = {
  currentComponent: null,
  
  navigateTo(path) {
    // Destroy previous component
    if (this.currentComponent) {
      console.log('Cleaning up previous route');
      this.currentComponent.$destroy();
      this.currentComponent = null;
    }
    
    // Create new component based on route
    switch (path) {
      case '/dashboard':
        this.currentComponent = createDashboard();
        break;
      case '/profile':
        this.currentComponent = createProfile();
        break;
      case '/settings':
        this.currentComponent = createSettings();
        break;
    }
    
    console.log(`Navigated to ${path}`);
  }
};

function createDashboard() {
  return ReactiveUtils.component({
    state: {
      stats: null
    },
    
    mounted() {
      console.log('Dashboard mounted');
      this.loadStats();
    },
    
    unmounted() {
      console.log('Dashboard unmounted');
    },
    
    actions: {
      async loadStats(state) {
        const response = await fetch('/api/stats');
        state.stats = await response.json();
      }
    }
  });
}

function createProfile() {
  return ReactiveUtils.component({
    state: {
      user: null
    },
    
    mounted() {
      console.log('Profile mounted');
      this.loadUser();
    },
    
    unmounted() {
      console.log('Profile unmounted');
    },
    
    actions: {
      async loadUser(state) {
        const response = await fetch('/api/user');
        state.user = await response.json();
      }
    }
  });
}

// Navigate between routes
router.navigateTo('/dashboard');
router.navigateTo('/profile'); // Automatically destroys dashboard component
```

### Example - Modal Component
```javascript
function createModal(options) {
  const modal = ReactiveUtils.component({
    state: {
      isOpen: false,
      title: options.title || 'Modal',
      content: options.content || ''
    },
    
    bindings: {
      '#modal-overlay': {
        style: () => ({ display: modal.isOpen ? 'flex' : 'none' })
      },
      '#modal-title': () => modal.title,
      '#modal-content': () => modal.content
    },
    
    actions: {
      open(state) {
        state.isOpen = true;
        document.body.style.overflow = 'hidden';
      },
      close(state) {
        state.isOpen = false;
        document.body.style.overflow = 'auto';
      }
    },
    
    mounted() {
      console.log('Modal created');
      
      // Close on Escape
      this.handleEscape = (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      };
      document.addEventListener('keydown', this.handleEscape);
      
      // Close on overlay click
      this.handleOverlayClick = (e) => {
        if (e.target.id === 'modal-overlay') {
          this.close();
        }
      };
      document.getElementById('modal-overlay')?.addEventListener('click', this.handleOverlayClick);
    },
    
    unmounted() {
      console.log('Modal destroyed');
      
      // Clean up event listeners
      document.removeEventListener('keydown', this.handleEscape);
      document.getElementById('modal-overlay')?.removeEventListener('click', this.handleOverlayClick);
      
      // Restore body scroll
      document.body.style.overflow = 'auto';
      
      // Call onClose callback if provided
      if (options.onClose) {
        options.onClose();
      }
    }
  });
  
  return modal;
}

// Usage
const confirmModal = createModal({
  title: 'Confirm Action',
  content: 'Are you sure you want to proceed?',
  onClose: () => console.log('Modal closed')
});

confirmModal.open();

// Later: destroy modal
confirmModal.$destroy(); // Removes listeners, calls onClose
```

### Example - Memory Leak Prevention
```javascript
const dataPoller = ReactiveUtils.component({
  state: {
    data: null,
    lastUpdate: null,
    errorCount: 0
  },
  
  bindings: {
    '#data-display': function() {
      return this.data ? JSON.stringify(this.data, null, 2) : 'No data';
    },
    '#last-update': function() {
      return this.lastUpdate 
        ? `Updated: ${this.lastUpdate.toLocaleTimeString()}` 
        : 'Never updated';
    },
    '#error-count': () => `Errors: ${dataPoller.errorCount}`
  },
  
  actions: {
    async fetchData(state) {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Fetch failed');
        
        state.data = await response.json();
        state.lastUpdate = new Date();
        state.errorCount = 0;
      } catch (error) {
        console.error('Fetch error:', error);
        state.errorCount++;
      }
    }
  },
  
  mounted() {
    console.log('Data poller started');
    
    // Initial fetch
    this.fetchData();
    
    // Poll every 5 seconds
    this.pollInterval = setInterval(() => {
      this.fetchData();
    }, 5000);
    
    // Watch for too many errors
    this.unwatchErrors = this.$watch('errorCount', (count) => {
      if (count >= 5) {
        console.error('Too many errors, stopping poller');
        this.$destroy();
      }
    });
  },
  
  unmounted() {
    console.log('Data poller stopped');
    
    // Clear interval (prevents memory leak)
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    
    // Cleanup watcher (already done automatically, but good practice)
    if (this.unwatchErrors) {
      this.unwatchErrors();
    }
  }
});

// Stop polling after 60 seconds
setTimeout(() => {
  dataPoller.$destroy(); // Prevents memory leaks
}, 60000);
```

### Example - Nested Component Cleanup
```javascript
function createApp() {
  const app = ReactiveUtils.component({
    state: {
      view: 'home'
    },
    
    mounted() {
      console.log('App mounted');
      
      // Create child components
      this.children = {
        header: createHeader(),
        sidebar: createSidebar(),
        content: null
      };
      
      // Watch view changes and create appropriate content component
      this.unwatchView = this.$watch('view', (newView) => {
        // Destroy old content component
        if (this.children.content) {
          this.children.content.$destroy();
        }
        
        // Create new content component
        switch (newView) {
          case 'home':
            this.children.content = createHomeView();
            break;
          case 'profile':
            this.children.content = createProfileView();
            break;
          case 'settings':
            this.children.content = createSettingsView();
            break;
        }
      });
      
      // Trigger initial view
      this.view = 'home';
    },
    
    unmounted() {
      console.log('App unmounted');
      
      // Destroy all child components
      Object.values(this.children).forEach(child => {
        if (child) child.$destroy();
      });
      
      // Cleanup watcher
      if (this.unwatchView) {
        this.unwatchView();
      }
    }
  });
  
  return app;
}

function createHeader() {
  return ReactiveUtils.component({
    state: { title: 'My App' },
    bindings: { '#app-title': 'title' },
    mounted() { console.log('Header mounted'); },
    unmounted() { console.log('Header destroyed'); }
  });
}

function createSidebar() {
  return ReactiveUtils.component({
    state: { collapsed: false },
    bindings: { '#sidebar': { className: () => sidebar.collapsed ? 'collapsed' : '' } },
    mounted() { console.log('Sidebar mounted'); },
    unmounted() { console.log('Sidebar destroyed'); }
  });
}

function createHomeView() {
  return ReactiveUtils.component({
    state: { posts: [] },
    mounted() { console.log('Home view mounted'); },
    unmounted() { console.log('Home view destroyed'); }
  });
}

// Usage
const app = createApp();

// Later: destroy entire app and all children
app.$destroy();
// Logs:
// App unmounted
// Header destroyed
// Sidebar destroyed
// Home view destroyed
```

---

## What Gets Cleaned Up

When `$destroy()` is called, the following are automatically cleaned up:

### 1. **DOM Bindings**
All reactive bindings created in the `bindings` configuration are removed.

```javascript
const comp = ReactiveUtils.component({
  state: { value: 0 },
  bindings: {
    '#display': 'value'
  }
});

comp.value = 10; // Updates DOM
comp.$destroy();
comp.value = 20; // No longer updates DOM
```

### 2. **Watchers**
All watchers created in the `watch` configuration are stopped.

```javascript
const comp = ReactiveUtils.component({
  state: { count: 0 },
  watch: {
    count(newVal) {
      console.log('Count:', newVal);
    }
  }
});

comp.count = 1; // Logs: "Count: 1"
comp.$destroy();
comp.count = 2; // No log
```

### 3. **Effects**
All effects created in the `effects` configuration are stopped.

```javascript
const comp = ReactiveUtils.component({
  state: { x: 0 },
  effects: {
    logX() {
      console.log('X is:', comp.x);
    }
  }
});

comp.x = 5; // Logs: "X is: 5"
comp.$destroy();
comp.x = 10; // No log
```

### 4. **Unmounted Hook**
The `unmounted` lifecycle hook is called.

```javascript
const comp = ReactiveUtils.component({
  mounted() {
    console.log('Created');
  },
  unmounted() {
    console.log('Destroyed'); // Called on $destroy()
  }
});

comp.$destroy(); // Logs: "Destroyed"
```

### 5. **Custom Cleanup**
Any custom cleanup code you add in the `unmounted` hook.

```javascript
const comp = ReactiveUtils.component({
  mounted() {
    this.intervalId = setInterval(() => {}, 1000);
    this.eventHandler = () => {};
    document.addEventListener('click', this.eventHandler);
  },
  unmounted() {
    clearInterval(this.intervalId);
    document.removeEventListener('click', this.eventHandler);
  }
});

comp.$destroy(); // Runs all cleanup code
```

---

## Use Cases

### 1. **SPA Route Changes**
Clean up components when navigating between routes.

### 2. **Modal/Dialog Closure**
Destroy modal components when closed.

### 3. **Dynamic Component Creation**
Clean up dynamically created components.

### 4. **Memory Management**
Prevent memory leaks from timers, event listeners, WebSockets.

### 5. **Tab/Page Visibility**
Pause/destroy components when page is hidden.

### 6. **Widget Removal**
Remove dashboard widgets or plugin components.

### 7. **Testing**
Clean up after each test case.

---

## Best Practices

### ✅ DO

```javascript
// Store references to timers/listeners in component
mounted() {
  this.intervalId = setInterval(() => {}, 1000);
  this.clickHandler = () => {};
  document.addEventListener('click', this.clickHandler);
}

unmounted() {
  clearInterval(this.intervalId);
  document.removeEventListener('click', this.clickHandler);
}
```

### ✅ DO

```javascript
// Clean up external resources
unmounted() {
  if (this.ws) this.ws.close();
  if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  if (this.subscription) this.subscription.unsubscribe();
}
```

### ✅ DO

```javascript
// Destroy child components
unmounted() {
  if (this.childComponents) {
    this.childComponents.forEach(child => child.$destroy());
  }
}
```

### ❌ DON'T

```javascript
// Don't forget to clean up intervals
mounted() {
  setInterval(() => {
    this.count++;
  }, 1000);
  // Missing: store intervalId for cleanup
}
```

### ❌ DON'T

```javascript
// Don't leave event listeners attached
mounted() {
  document.addEventListener('scroll', () => {});
  // Missing: cleanup in unmounted
}
```

### ❌ DON'T

```javascript
// Don't call $destroy() inside effects/watchers
watch: {
  someValue(val) {
    if (val > 10) {
      this.$destroy(); // Can cause issues
    }
  }
}
```

---

## Common Patterns

### Pattern 1: Conditional Cleanup

```javascript
const comp = ReactiveUtils.component({
  mounted() {
    if (this.needsPolling) {
      this.intervalId = setInterval(() => {}, 1000);
    }
  },
  
  unmounted() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
});
```

### Pattern 2: Cleanup Array

```javascript
const comp = ReactiveUtils.component({
  mounted() {
    this.cleanupFunctions = [];
    
    // Add multiple cleanup functions
    const interval = setInterval(() => {}, 1000);
    this.cleanupFunctions.push(() => clearInterval(interval));
    
    const handler = () => {};
    document.addEventListener('click', handler);
    this.cleanupFunctions.push(() => document.removeEventListener('click', handler));
  },
  
  unmounted() {
    // Run all cleanup functions
    this.cleanupFunctions.forEach(fn => fn());
  }
});
```

### Pattern 3: Graceful Shutdown

```javascript
const comp = ReactiveUtils.component({
  state: {
    isShuttingDown: false
  },
  
  actions: {
    async shutdown(state) {
      state.isShuttingDown = true;
      
      // Save state
      await this.saveState();
      
      // Close connections
      await this.closeConnections();
      
      // Destroy component
      this.$destroy();
    }
  },
  
  unmounted() {
    if (!this.isShuttingDown) {
      console.warn('Component destroyed without proper shutdown');
    }
  }
});
```

---

## Testing Example

```javascript
describe('Component', () => {
  let component;
  
  beforeEach(() => {
    component = ReactiveUtils.component({
      state: { count: 0 },
      bindings: { '#test': 'count' }
    });
  });
  
  afterEach(() => {
    // Clean up after each test
    if (component) {
      component.$destroy();
      component = null;
    }
  });
  
  it('should update display', () => {
    component.count = 5;
    expect(document.getElementById('test').textContent).toBe('5');
  });
  
  it('should clean up bindings', () => {
    component.$destroy();
    component.count = 10;
    expect(document.getElementById('test').textContent).not.toBe('10');
  });
});
```

---

## Troubleshooting

### Issue: Memory Leak from Interval

```javascript
// ❌ Problem: Interval continues after destroy
mounted() {
  setInterval(() => {
    this.count++;
  }, 1000);
}

// ✅ Solution: Store and clear interval
mounted() {
  this.intervalId = setInterval(() => {
    this.count++;
  }, 1000);
}

unmounted() {
  clearInterval(this.intervalId);
}
```

### Issue: Event Listener Not Removed

```javascript
// ❌ Problem: Anonymous function can't be removed
mounted() {
  document.addEventListener('click', () => {
    console.log(this.value);
  });
}

// ✅ Solution: Store function reference
mounted() {
  this.clickHandler = () => {
    console.log(this.value);
  };
  document.addEventListener('click', this.clickHandler);
}

unmounted() {
  document.removeEventListener('click', this.clickHandler);
}
```

### Issue: Child Components Not Destroyed

```javascript
// ❌ Problem: Child components leaked
mounted() {
  this.modal = createModal();
}

// ✅ Solution: Destroy in unmounted
unmounted() {
  if (this.modal) {
    this.modal.$destroy();
  }
}
```

---

## API Quick Reference

```javascript
const component = ReactiveUtils.component(config);

// Destroy method
component.$destroy()  // Clean up all resources

// What gets cleaned up:
// - All DOM bindings (from 'bindings' config)
// - All watchers (from 'watch' config)
// - All effects (from 'effects' config)
// - Calls 'unmounted' lifecycle hook
// - Custom cleanup code in 'unmounted'
```

---
