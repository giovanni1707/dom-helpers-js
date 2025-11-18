# Complete Method Reference for Conditions Module

## Core Methods

### 1. `Conditions.whenState(valueFn, conditions, selector, options)`

**What it does:**
Automatically updates HTML elements based on the value of a variable or state. When the value changes, the elements update themselves without you having to write update code.

**Purpose & Use Cases:**
- Show/hide elements based on user authentication status
- Update UI styling based on form validation state
- Display different content based on application mode (dark/light theme)
- Change element properties based on data values

**Parameters:**
- `valueFn` (Function|Any): Either a function that returns the current value, or a direct value
- `conditions` (Object|Function): An object mapping condition patterns to element configurations
- `selector` (String|Element|NodeList): CSS selector or DOM element(s) to target
- `options` (Object, optional): Configuration object with `reactive` property (default: `true`)

**Return Value:**
- In reactive mode: An effect cleanup function
- In non-reactive mode: An object with `update()` and `destroy()` methods

**Beginner Example:**

```javascript
// Create a reactive state
const isLoggedIn = ReactiveUtils.state(false);

// Update button text based on login status
Conditions.whenState(
  () => isLoggedIn.value,
  {
    'true': { textContent: 'Logout' },
    'false': { textContent: 'Login' }
  },
  '#authButton'
);

// Later, when user logs in:
isLoggedIn.value = true; // Button automatically updates to "Logout"
```

**Advanced Real-World Example:**

```javascript
// E-commerce cart system with multiple dynamic UI updates
const cart = ReactiveUtils.state({
  items: [],
  total: 0,
  status: 'empty'
});

// Update cart badge
Conditions.whenState(
  () => cart.value.items.length,
  {
    '0': { 
      classList: { add: 'hidden' },
      textContent: ''
    },
    '>0': { 
      classList: { remove: 'hidden' },
      textContent: (val) => val,
      style: { 
        backgroundColor: '#ff4444',
        color: 'white'
      }
    }
  },
  '.cart-badge'
);

// Update checkout button state
Conditions.whenState(
  () => cart.value.total,
  {
    '0': { 
      disabled: true,
      classList: { add: 'btn-disabled' },
      textContent: 'Cart Empty'
    },
    '>0': { 
      disabled: false,
      classList: { remove: 'btn-disabled' },
      textContent: (val) => `Checkout ($${val.toFixed(2)})`
    }
  },
  '#checkoutButton'
);

// Update shipping message
Conditions.whenState(
  () => cart.value.total,
  {
    '<50': {
      textContent: `Add $${(50 - cart.value.total).toFixed(2)} for free shipping`,
      classList: { add: 'text-warning' }
    },
    '>=50': {
      textContent: '🎉 Free shipping unlocked!',
      classList: { add: 'text-success', remove: 'text-warning' }
    }
  },
  '.shipping-message'
);
```

---

### 2. `Conditions.apply(value, conditions, selector)`

**What it does:**
Applies conditions to elements **once**, without automatic updates. This is a "set it and forget it" operation.

**Purpose & Use Cases:**
- Initialize UI state on page load
- Apply one-time styling based on server data
- Set element properties that won't change
- Use when you don't have reactive state available

**Parameters:**
- `value` (Any|Function): The value to check, or function returning the value
- `conditions` (Object): Condition mappings to element configurations
- `selector` (String|Element|NodeList): Target element(s)

**Return Value:**
Returns the `Conditions` object for method chaining

**Beginner Example:**

```javascript
// Set initial theme based on user preference (one-time)
const userTheme = 'dark'; // from localStorage or server

Conditions.apply(
  userTheme,
  {
    'dark': { 
      classList: { add: 'dark-theme' },
      dataset: { theme: 'dark' }
    },
    'light': { 
      classList: { add: 'light-theme' },
      dataset: { theme: 'light' }
    }
  },
  'body'
);
```

**Advanced Real-World Example:**

```javascript
// Initialize complex dashboard based on user role and permissions
const user = {
  role: 'manager',
  permissions: ['read', 'write', 'approve'],
  department: 'sales'
};

// Set navigation visibility
Conditions.apply(
  user.role,
  {
    'admin': {
      style: { display: 'block' },
      innerHTML: `
        <li><a href="/admin">Admin Panel</a></li>
        <li><a href="/users">User Management</a></li>
        <li><a href="/settings">System Settings</a></li>
      `
    },
    'manager': {
      style: { display: 'block' },
      innerHTML: `
        <li><a href="/reports">Reports</a></li>
        <li><a href="/team">Team Management</a></li>
      `
    },
    'default': {
      style: { display: 'block' },
      innerHTML: '<li><a href="/dashboard">Dashboard</a></li>'
    }
  },
  '#adminNav'
);

// Configure action buttons based on permissions
Conditions.apply(
  user.permissions.includes('approve'),
  {
    'true': {
      style: { display: 'inline-block' },
      addEventListener: {
        click: (e) => handleApproval(e)
      }
    },
    'false': {
      style: { display: 'none' }
    }
  },
  '.approve-button'
);

// Chain multiple applies
Conditions
  .apply(user.department, {
    'sales': { dataset: { dept: 'sales' }, classList: { add: 'dept-sales' } }
  }, '.dashboard-container')
  .apply(user.permissions.length, {
    '>3': { classList: { add: 'power-user' } }
  }, 'body');
```

---

### 3. `Conditions.watch(valueFn, conditions, selector)`

**What it does:**
Explicitly sets up automatic updates when a value changes. This is an alias for `whenState()` with reactivity forced on.

**Purpose & Use Cases:**
- Make your intention clear that you want reactive updates
- Ensure reactive mode even when auto-detection might fail
- Document that this UI element should respond to state changes

**Parameters:**
- `valueFn` (Function): Function returning the reactive value
- `conditions` (Object): Condition mappings
- `selector` (String|Element|NodeList): Target element(s)

**Return Value:**
Effect cleanup function (requires reactive library)

**Beginner Example:**

```javascript
const temperature = ReactiveUtils.state(72);

// Explicitly watch temperature changes
Conditions.watch(
  () => temperature.value,
  {
    '<60': { 
      textContent: '🥶 Cold',
      style: { color: 'blue' }
    },
    '60-75': { 
      textContent: '😊 Comfortable',
      style: { color: 'green' }
    },
    '>75': { 
      textContent: '🥵 Hot',
      style: { color: 'red' }
    }
  },
  '#tempDisplay'
);

temperature.value = 85; // Display updates automatically
```

**Advanced Real-World Example:**

```javascript
// Real-time monitoring dashboard with multiple watched values
const systemMetrics = ReactiveUtils.state({
  cpuUsage: 45,
  memoryUsage: 62,
  diskSpace: 78,
  networkLatency: 25,
  status: 'healthy'
});

// Watch CPU and update performance indicator
Conditions.watch(
  () => systemMetrics.value.cpuUsage,
  {
    '<50': {
      classList: { add: 'status-good', remove: ['status-warning', 'status-critical'] },
      innerHTML: `
        <span class="icon">✓</span>
        <span>CPU: ${systemMetrics.value.cpuUsage}% - Normal</span>
      `
    },
    '50-80': {
      classList: { add: 'status-warning', remove: ['status-good', 'status-critical'] },
      innerHTML: `
        <span class="icon">⚠</span>
        <span>CPU: ${systemMetrics.value.cpuUsage}% - High</span>
      `
    },
    '>80': {
      classList: { add: 'status-critical', remove: ['status-good', 'status-warning'] },
      innerHTML: `
        <span class="icon">✗</span>
        <span>CPU: ${systemMetrics.value.cpuUsage}% - Critical</span>
      `,
      addEventListener: {
        click: () => alert('CPU usage critical! Check processes.')
      }
    }
  },
  '#cpuIndicator'
);

// Watch overall system status
Conditions.watch(
  () => systemMetrics.value.status,
  {
    'healthy': {
      style: { backgroundColor: '#4caf50', borderColor: '#388e3c' },
      textContent: 'All Systems Operational'
    },
    'degraded': {
      style: { backgroundColor: '#ff9800', borderColor: '#f57c00' },
      textContent: 'Performance Degraded'
    },
    'critical': {
      style: { backgroundColor: '#f44336', borderColor: '#c62828' },
      textContent: '⚠ System Critical',
      classList: { add: 'pulse-animation' }
    }
  },
  '#systemStatus'
);

// Simulate real-time updates
setInterval(() => {
  systemMetrics.value = {
    ...systemMetrics.value,
    cpuUsage: Math.floor(Math.random() * 100),
    status: systemMetrics.value.cpuUsage > 80 ? 'critical' : 
            systemMetrics.value.cpuUsage > 50 ? 'degraded' : 'healthy'
  };
}, 2000);
```

---

### 4. `Conditions.batch(fn)`

**What it does:**
Groups multiple state updates together so the UI only updates once, improving performance.

**Purpose & Use Cases:**
- Optimize performance when changing multiple states at once
- Prevent flickering during complex updates
- Reduce unnecessary re-renders
- Batch related state changes together

**Parameters:**
- `fn` (Function): Function containing multiple state updates

**Return Value:**
Result of the function execution

**Beginner Example:**

```javascript
const firstName = ReactiveUtils.state('John');
const lastName = ReactiveUtils.state('Doe');
const age = ReactiveUtils.state(25);

// Without batch: UI updates 3 times
firstName.value = 'Jane';
lastName.value = 'Smith';
age.value = 30;

// With batch: UI updates only once
Conditions.batch(() => {
  firstName.value = 'Jane';
  lastName.value = 'Smith';
  age.value = 30;
});
```

**Advanced Real-World Example:**

```javascript
// Complex form with interdependent fields
const formState = ReactiveUtils.state({
  country: 'US',
  state: '',
  city: '',
  zipCode: '',
  shippingCost: 0,
  taxRate: 0,
  total: 0
});

// Watch and update display
Conditions.watch(
  () => formState.value.total,
  {
    '>0': {
      textContent: (val) => `Total: $${val.toFixed(2)}`
    }
  },
  '#orderTotal'
);

// Update location - all fields change together
function updateLocation(country, state, city, zipCode) {
  Conditions.batch(() => {
    // Calculate shipping and tax based on location
    const shipping = calculateShipping(country, state);
    const tax = calculateTax(state);
    const subtotal = getCartSubtotal();
    
    // Update all related fields at once
    formState.value = {
      ...formState.value,
      country: country,
      state: state,
      city: city,
      zipCode: zipCode,
      shippingCost: shipping,
      taxRate: tax,
      total: subtotal + shipping + (subtotal * tax)
    };
    // UI updates only once after all changes
  });
}

// Batch multiple UI state changes during animation
function startLoadingSequence() {
  Conditions.batch(() => {
    loadingState.value = 'active';
    progressPercent.value = 0;
    statusMessage.value = 'Initializing...';
    errorMessage.value = '';
    disableAllButtons.value = true;
  });
}
```

---

### 5. `Conditions.registerMatcher(name, matcher)`

**What it does:**
Adds your own custom condition types that the module doesn't have built-in.

**Purpose & Use Cases:**
- Create domain-specific condition checks (e.g., email validation, credit card format)
- Add business logic conditions
- Extend the module for specialized applications
- Share custom matchers across your team

**Parameters:**
- `name` (String): Unique name for your matcher
- `matcher` (Object): Object with `test(condition, value)` and `match(value, condition)` methods

**Return Value:**
Returns the `Conditions` object for method chaining

**Beginner Example:**

```javascript
// Add a matcher for even/odd numbers
Conditions.registerMatcher('evenOdd', {
  test: (condition) => condition === 'even' || condition === 'odd',
  match: (value, condition) => {
    if (typeof value !== 'number') return false;
    if (condition === 'even') return value % 2 === 0;
    if (condition === 'odd') return value % 2 !== 0;
    return false;
  }
});

// Use it
const number = ReactiveUtils.state(4);

Conditions.whenState(
  () => number.value,
  {
    'even': { classList: { add: 'even-number' }, textContent: 'Even!' },
    'odd': { classList: { add: 'odd-number' }, textContent: 'Odd!' }
  },
  '#numberDisplay'
);
```

**Advanced Real-World Example:**

```javascript
// Register multiple custom matchers for a form validation system

// 1. Email validation matcher
Conditions.registerMatcher('email', {
  test: (condition) => condition === 'validEmail' || condition === 'invalidEmail',
  match: (value, condition) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    return condition === 'validEmail' ? isValid : !isValid;
  }
});

// 2. Password strength matcher
Conditions.registerMatcher('passwordStrength', {
  test: (condition) => ['weak', 'medium', 'strong'].includes(condition),
  match: (value, condition) => {
    if (typeof value !== 'string') return false;
    
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;
    
    const strengthMap = {
      'weak': strength <= 1,
      'medium': strength === 2 || strength === 3,
      'strong': strength === 4
    };
    
    return strengthMap[condition];
  }
});

// 3. Credit card type matcher
Conditions.registerMatcher('cardType', {
  test: (condition) => ['visa', 'mastercard', 'amex', 'discover'].includes(condition),
  match: (value, condition) => {
    const cardPatterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/
    };
    return cardPatterns[condition]?.test(value.replace(/\s/g, ''));
  }
});

// 4. Date range matcher
Conditions.registerMatcher('dateRange', {
  test: (condition) => condition.startsWith('dateWithin:'),
  match: (value, condition) => {
    const days = parseInt(condition.split(':')[1]);
    const date = new Date(value);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }
});

// Use the custom matchers in a registration form
const email = ReactiveUtils.state('');
const password = ReactiveUtils.state('');

Conditions.whenState(
  () => email.value,
  {
    'validEmail': {
      classList: { add: 'valid', remove: 'invalid' },
      innerHTML: '<span class="icon">✓</span> Valid email',
      style: { color: 'green' }
    },
    'invalidEmail': {
      classList: { add: 'invalid', remove: 'valid' },
      innerHTML: '<span class="icon">✗</span> Invalid email',
      style: { color: 'red' }
    }
  },
  '#emailValidation'
);

Conditions.whenState(
  () => password.value,
  {
    'weak': {
      style: { backgroundColor: '#ffcccc' },
      innerHTML: '🔴 Weak - Add more characters and symbols'
    },
    'medium': {
      style: { backgroundColor: '#ffffcc' },
      innerHTML: '🟡 Medium - Add special characters for strong password'
    },
    'strong': {
      style: { backgroundColor: '#ccffcc' },
      innerHTML: '🟢 Strong - Good password!'
    }
  },
  '#passwordStrength'
);
```

---

### 6. `Conditions.registerHandler(name, handler)`

**What it does:**
Adds custom ways to update elements beyond the built-in properties like `style`, `classList`, etc.

**Purpose & Use Cases:**
- Integrate with third-party libraries (charts, maps, animations)
- Create reusable UI update patterns
- Add framework-specific handlers
- Build domain-specific element manipulations

**Parameters:**
- `name` (String): Unique name for your handler
- `handler` (Object): Object with `test(key, val, element)` and `apply(element, val, key)` methods

**Return Value:**
Returns the `Conditions` object for method chaining

**Beginner Example:**

```javascript
// Add a handler for smooth color transitions
Conditions.registerHandler('smoothColor', {
  test: (key) => key === 'smoothColor',
  apply: (element, val) => {
    element.style.transition = 'color 0.3s ease';
    element.style.color = val;
  }
});

// Use it
const status = ReactiveUtils.state('success');

Conditions.whenState(
  () => status.value,
  {
    'success': { smoothColor: 'green' },
    'error': { smoothColor: 'red' },
    'warning': { smoothColor: 'orange' }
  },
  '#statusMessage'
);
```

**Advanced Real-World Example:**

```javascript
// Register handlers for Chart.js integration
Conditions.registerHandler('chartUpdate', {
  test: (key) => key === 'chartData',
  apply: (element, val) => {
    if (!element._chartInstance) {
      // Initialize chart if not exists
      const ctx = element.getContext('2d');
      element._chartInstance = new Chart(ctx, {
        type: val.type || 'line',
        data: val.data,
        options: val.options || {}
      });
    } else {
      // Update existing chart
      element._chartInstance.data = val.data;
      element._chartInstance.update();
    }
  }
});

// Register handler for GSAP animations
Conditions.registerHandler('animate', {
  test: (key) => key === 'animate',
  apply: (element, val) => {
    if (typeof gsap !== 'undefined') {
      gsap.to(element, {
        ...val,
        duration: val.duration || 0.3
      });
    }
  }
});

// Register handler for scroll-based effects
Conditions.registerHandler('scrollReveal', {
  test: (key) => key === 'scrollReveal',
  apply: (element, val) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Object.entries(val).forEach(([prop, value]) => {
            element.style[prop] = value;
          });
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(element);
  }
});

// Register handler for custom component updates
Conditions.registerHandler('customComponent', {
  test: (key) => key === 'componentState',
  apply: (element, val) => {
    // Assuming element has a custom component attached
    if (element.component && typeof element.component.setState === 'function') {
      element.component.setState(val);
    }
  }
});

// Use the handlers in a dashboard
const salesData = ReactiveUtils.state({
  monthly: [45, 52, 48, 70, 65, 80],
  status: 'growing'
});

Conditions.whenState(
  () => salesData.value,
  {
    'truthy': {
      chartData: {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Sales',
            data: salesData.value.monthly,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Monthly Sales'
            }
          }
        }
      }
    }
  },
  '#salesChart'
);

Conditions.whenState(
  () => salesData.value.status,
  {
    'growing': {
      animate: {
        scale: 1.05,
        backgroundColor: '#e8f5e9',
        duration: 0.5
      }
    },
    'declining': {
      animate: {
        scale: 0.95,
        backgroundColor: '#ffebee',
        duration: 0.5
      }
    }
  },
  '.sales-card'
);
```

---

## Utility Methods

### 7. `Conditions.getMatchers()`

**What it does:**
Returns a list of all available condition matchers (both built-in and custom).

**Purpose & Use Cases:**
- Debug your application
- Document available conditions
- Check if a custom matcher was registered successfully
- Build auto-complete tools

**Parameters:** None

**Return Value:**
Array of matcher names (strings)

**Beginner Example:**

```javascript
// See what conditions you can use
const available = Conditions.getMatchers();
console.log(available);
// Output: ['booleanTrue', 'booleanFalse', 'truthy', 'falsy', 'null', 
//          'undefined', 'empty', 'quotedString', 'includes', 'startsWith', 
//          'endsWith', 'regex', 'numericRange', 'numericExact', ...]
```

**Advanced Real-World Example:**

```javascript
// Build a developer debug panel
function createDebugPanel() {
  const panel = document.createElement('div');
  panel.className = 'debug-panel';
  
  const matchers = Conditions.getMatchers();
  const handlers = Conditions.getHandlers();
  
  panel.innerHTML = `
    <h3>Conditions Debug Info</h3>
    <div>
      <strong>Mode:</strong> ${Conditions.mode}
      <br>
      <strong>Reactivity:</strong> ${Conditions.hasReactivity ? 'Enabled' : 'Disabled'}
    </div>
    <details>
      <summary>Available Matchers (${matchers.length})</summary>
      <ul>
        ${matchers.map(m => `<li><code>${m}</code></li>`).join('')}
      </ul>
    </details>
    <details>
      <summary>Available Handlers (${handlers.length})</summary>
      <ul>
        ${handlers.map(h => `<li><code>${h}</code></li>`).join('')}
      </ul>
    </details>
  `;
  
  document.body.appendChild(panel);
}

// Auto-complete helper for IDE integration
function getConditionSuggestions(partialInput) {
  const matchers = Conditions.getMatchers();
  return matchers.filter(m => m.startsWith(partialInput));
}
```

---

### 8. `Conditions.getHandlers()`

**What it does:**
Returns a list of all available property handlers (both built-in and custom).

**Purpose & Use Cases:**
- See what properties you can use in condition configs
- Verify custom handlers are registered
- Build documentation or type definitions
- Debug property application issues

**Parameters:** None

**Return Value:**
Array of handler names (strings)

**Beginner Example:**

```javascript
// Check what properties you can set on elements
const handlers = Conditions.getHandlers();
console.log(handlers);
// Output: ['style', 'classList', 'setAttribute', 'removeAttribute', 
//          'dataset', 'addEventListener', 'removeEventListener', ...]
```

**Advanced Real-World Example:**

```javascript
// Generate TypeScript type definitions
function generateTypeDefinitions() {
  const handlers = Conditions.getHandlers();
  
  const typeDef = `
interface ConditionConfig {
  ${handlers.map(h => `${h}?: any;`).join('\n  ')}
}

interface ConditionsAPI {
  whenState(
    valueFn: () => any,
    conditions: Record<string, ConditionConfig>,
    selector: string | Element
  ): void;
  // ... other methods
}
  `.trim();
  
  return typeDef;
}

// Validation helper
function validateConditionConfig(config) {
  const validHandlers = new Set(Conditions.getHandlers());
  const errors = [];
  
  Object.keys(config).forEach(key => {
    if (!validHandlers.has(key)) {
      errors.push(`Unknown property '${key}'. Valid properties: ${Array.from(validHandlers).join(', ')}`);
    }
  });
  
  if (errors.length > 0) {
    console.warn('[Config Validation]', errors);
  }
  
  return errors.length === 0;
}

// Use validation
const config = {
  style: { color: 'red' },
  invalidProp: 'test' // This will be flagged
};

validateConditionConfig(config);
```

---

## Property Accessors

### 9. `Conditions.hasReactivity` (getter)

**What it does:**
Tells you if reactive/automatic updates are available in your environment.

**Purpose & Use Cases:**
- Check if ReactiveUtils or Elements library is loaded
- Decide whether to use reactive or manual updates
- Show appropriate error messages to developers
- Feature detection

**Parameters:** None (it's a property, not a method)

**Return Value:**
Boolean (`true` if reactive features available, `false` otherwise)

**Beginner Example:**

```javascript
if (Conditions.hasReactivity) {
  console.log('You can use automatic updates!');
  // Use whenState() or watch()
} else {
  console.log('Reactive library not found. Use apply() for manual updates.');
  // Use apply() instead
}
```

**Advanced Real-World Example:**

```javascript
// Adaptive initialization based on environment
class AppInitializer {
  constructor() {
    this.mode = Conditions.hasReactivity ? 'reactive' : 'manual';
    this.updateStrategies = new Map();
  }
  
  initializeUI() {
    if (this.mode === 'reactive') {
      this.setupReactiveUI();
    } else {
      this.setupManualUI();
      console.warn(
        'Running in manual mode. Install ReactiveUtils for automatic updates.'
      );
    }
  }
  
  setupReactiveUI() {
    // Use automatic updates
    const theme = ReactiveUtils.state('light');
    
    Conditions.whenState(
      () => theme.value,
      {
        'light': { classList: { add: 'theme-light' } },
        'dark': { classList: { add: 'theme-dark' } }
      },
      'body'
    );
  }
  
  setupManualUI() {
    // Provide manual update methods
    this.theme = 'light';
    
    this.updateTheme = (newTheme) => {
      this.theme = newTheme;
      Conditions.apply(
        this.theme,
        {
          'light': { classList: { add: 'theme-light' } },
          'dark': { classList: { add: 'theme-dark' } }
        },
        'body'
      );
    };
  }
  
  // Graceful degradation
  updateValue(key, value) {
    if (this.mode === 'reactive') {
      // Value updates automatically trigger UI updates
      this.state[key].value = value;
    } else {
      // Manual UI update required
      this.state[key] = value;
      this.updateStrategies.get(key)?.();
    }
  }
}
```

---

### 10. `Conditions.mode` (getter)

**What it does:**
Returns the current operating mode of the Conditions module.

**Purpose & Use Cases:**
- Display current mode in debug tools
- Log initialization status
- Conditional feature enablement
- User-facing status indicators

**Parameters:** None (it's a property)

**Return Value:**
String: either `'reactive'` or `'static'`

**Beginner Example:**

```javascript
console.log(`Conditions is running in ${Conditions.mode} mode`);
// Output: "Conditions is running in reactive mode"
// or: "Conditions is running in static mode"
```

**Advanced Real-World Example:**

```javascript
// Comprehensive application diagnostics
class SystemDiagnostics {
  constructor() {
    this.diagnostics = {
      conditionsMode: Conditions.mode,
      hasReactivity: Conditions.hasReactivity,
      availableMatchers: Conditions.getMatchers().length,
      availableHandlers: Conditions.getHandlers().length,
      timestamp: new Date().toISOString()
    };
  }
  
  generateReport() {
    const status = this.diagnostics.hasReactivity ? '✅' : '⚠️';
    
    return `
=== Conditions Module Diagnostics ===
Status: ${status}
Mode: ${this.diagnostics.conditionsMode}
Reactivity: ${this.diagnostics.hasReactivity ? 'Enabled' : 'Disabled'}
Matchers: ${this.diagnostics.availableMatchers}
Handlers: ${this.diagnostics.availableHandlers}
Checked: ${this.diagnostics.timestamp}

${this.getRecommendations()}
    `.trim();
  }
  
  getRecommendations() {
    if (!this.diagnostics.hasReactivity) {
      return `
⚠️ Recommendations:
- Install ReactiveUtils for automatic UI updates
- Use Conditions.apply() for manual updates
- Consider Elements library for enhanced features
      `.trim();
    }
    
    return '✅ All systems operational. No recommendations.';
  }
  
  displayInConsole() {
    console.group('🔍 Conditions Module Diagnostics');
    console.log(this.generateReport());
    
    if (this.diagnostics.conditionsMode === 'static') {
      console.warn('Consider loading ReactiveUtils for enhanced features');
    }
    
    console.groupEnd();
  }
  
  displayInUI() {
    const statusPanel = document.createElement('div');
    statusPanel.className = 'system-status';
    statusPanel.innerHTML = `
      <div class="status-header">
        <h3>System Status</h3>
        <span class="mode-badge mode-${this.diagnostics.conditionsMode}">
          ${this.diagnostics.conditionsMode.toUpperCase()}
        </span>
      </div>
      <pre>${this.generateReport()}</pre>
    `;
    
    document.body.appendChild(statusPanel);
  }
}

// Usage in app initialization
document.addEventListener('DOMContentLoaded', () => {
  const diagnostics = new SystemDiagnostics();
  diagnostics.displayInConsole();
  
  // Only show UI panel in development
  if (window.location.hostname === 'localhost') {
    diagnostics.displayInUI();
  }
});
```

---

## Built-in Condition Patterns

The module supports numerous condition patterns out-of-the-box. Here's a comprehensive reference:

### Boolean Conditions

```javascript
// Exact boolean matching
'true'    // matches boolean true
'false'   // matches boolean false
'truthy'  // matches any truthy value (non-zero, non-empty, etc.)
'falsy'   // matches any falsy value (0, '', null, undefined, false)

// Example
Conditions.whenState(
  () => userLoggedIn.value,
  {
    'true': { textContent: 'Welcome back!' },
    'false': { textContent: 'Please log in' }
  },
  '#greeting'
);
```

### Null/Undefined/Empty Checks

```javascript
'null'      // matches null exactly
'undefined' // matches undefined exactly
'empty'     // matches empty strings, arrays, objects, null, or undefined

// Example
Conditions.whenState(
  () => searchResults.value,
  {
    'empty': { 
      innerHTML: '<p class="no-results">No results found</p>',
      style: { display: 'block' }
    },
    'truthy': {
      innerHTML: () => renderResults(searchResults.value),
      style: { display: 'grid' }
    }
  },
  '#resultsContainer'
);
```

### String Matching

```javascript
// Exact string match
'"hello"'  // matches the string "hello"
"'world'"  // matches the string "world"

// Pattern matching
'includes:search'   // string contains "search"
'startsWith:https'  // string starts with "https"
'endsWith:.com'     // string ends with ".com"

// Regex patterns
'/^[A-Z]/'         // starts with uppercase letter
'/\d{3}-\d{4}/i'   // matches phone pattern, case insensitive

// Example
Conditions.whenState(
  () => url.value,
  {
    'startsWith:https': { 
      classList: { add: 'secure' },
      innerHTML: '🔒 Secure connection'
    },
    'startsWith:http': { 
      classList: { add: 'insecure' },
      innerHTML: '⚠️ Not secure'
    }
  },
  '#securityBadge'
);
```

### Numeric Comparisons

```javascript
// Exact number
'42'           // equals 42

// Ranges
'18-65'        // between 18 and 65 (inclusive)
'0-100'        // between 0 and 100

// Comparison operators
'>50'          // greater than 50
'>=50'         // greater than or equal to 50
'<50'          // less than 50
'<=50'         // less than or equal to 50

// Example
Conditions.whenState(
  () => batteryLevel.value,
  {
    '>80': { 
      style: { backgroundColor: '#4caf50', color: 'white' },
      textContent: () => `Battery: ${batteryLevel.value}% - Full`
    },
    '20-80': { 
      style: { backgroundColor: '#ffc107', color: 'black' },
      textContent: () => `Battery: ${batteryLevel.value}% - Good`
    },
    '<=20': { 
      style: { backgroundColor: '#f44336', color: 'white' },
      textContent: () => `Battery: ${batteryLevel.value}% - Low!`,
      classList: { add: 'pulse' }
    }
  },
  '#batteryIndicator'
);
```

---

## Built-in Property Handlers

The module can manipulate elements in many ways:

### Style Manipulation

```javascript
{
  style: {
    color: 'red',
    backgroundColor: '#f0f0f0',
    fontSize: '16px',
    display: 'block',
    transition: 'all 0.3s ease'
  }
}

// Real example
Conditions.whenState(
  () => alertType.value,
  {
    'error': {
      style: {
        backgroundColor: '#fee',
        borderLeft: '4px solid #f44',
        padding: '1rem',
        marginBottom: '1rem'
      }
    },
    'success': {
      style: {
        backgroundColor: '#efe',
        borderLeft: '4px solid #4f4',
        padding: '1rem',
        marginBottom: '1rem'
      }
    }
  },
  '.alert-box'
);
```

### Class List Operations

```javascript
{
  classList: {
    add: 'active',              // Add single class
    add: ['class1', 'class2'],  // Add multiple classes
    remove: 'inactive',         // Remove single class
    remove: ['old1', 'old2'],   // Remove multiple
    toggle: 'visible',          // Toggle class
    replace: ['oldClass', 'newClass']  // Replace class
  }
}

// Or replace all classes
{
  classList: ['new', 'classes', 'only']
}

// Real example
Conditions.whenState(
  () => menuState.value,
  {
    'open': {
      classList: {
        add: ['menu-open', 'overlay-visible'],
        remove: 'menu-closed'
      }
    },
    'closed': {
      classList: {
        add: 'menu-closed',
        remove: ['menu-open', 'overlay-visible']
      }
    }
  },
  '#navigationMenu'
);
```

### Attributes

```javascript
{
  setAttribute: {
    'data-status': 'active',
    'aria-label': 'Close menu',
    'disabled': true,
    'href': 'https://example.com'
  },
  
  // Or use attrs alias
  attrs: {
    'title': 'Click to expand',
    'role': 'button'
  },
  
  // Remove attributes
  removeAttribute: ['disabled', 'hidden'],
  // Or single attribute
  removeAttribute: 'readonly'
}

// Real example
Conditions.whenState(
  () => formValid.value,
  {
    'true': {
      attrs: {
        'aria-invalid': 'false',
        'data-valid': 'true'
      },
      removeAttribute: 'disabled'
    },
    'false': {
      attrs: {
        'aria-invalid': 'true',
        'data-valid': 'false',
        'disabled': true
      }
    }
  },
  '#submitButton'
);
```

### Dataset (data-* attributes)

```javascript
{
  dataset: {
    userId: '12345',
    role: 'admin',
    lastLogin: '2024-01-15'
  }
}

// Real example
Conditions.whenState(
  () => user.value,
  {
    'truthy': {
      dataset: {
        userId: user.value.id,
        userName: user.value.name,
        userRole: user.value.role,
        premium: user.value.isPremium ? 'true' : 'false'
      }
    }
  },
  '#userProfile'
);
```

### Event Listeners

```javascript
{
  addEventListener: {
    click: handleClick,
    
    // With options
    mouseover: {
      handler: handleHover,
      options: { once: true }
    },
    
    scroll: {
      handler: handleScroll,
      options: { passive: true }
    }
  },
  
  // Remove listeners
  removeEventListener: ['click', handlerFunction, options]
}

// Real example
Conditions.whenState(
  () => editMode.value,
  {
    'true': {
      addEventListener: {
        dblclick: (e) => {
          e.preventDefault();
          openEditor(e.target);
        },
        keydown: {
          handler: (e) => {
            if (e.key === 'Escape') exitEditMode();
          },
          options: { capture: true }
        }
      },
      attrs: {
        contenteditable: 'true',
        'data-editing': 'true'
      }
    },
    'false': {
      removeAttribute: ['contenteditable', 'data-editing']
    }
  },
  '.editable-content'
);
```

### Native DOM Properties

```javascript
{
  textContent: 'Hello World',
  innerHTML: '<strong>Bold text</strong>',
  value: 'input value',
  checked: true,
  disabled: false,
  placeholder: 'Enter text...',
  
  // Event handlers as properties
  onclick: (e) => console.log('Clicked!'),
  onchange: handleChange,
  oninput: handleInput
}

// Real example
Conditions.whenState(
  () => notificationCount.value,
  {
    '0': {
      textContent: 'No notifications',
      style: { display: 'none' }
    },
    '>0': {
      textContent: () => `${notificationCount.value} new`,
      style: { 
        display: 'inline-block',
        backgroundColor: '#ff4444',
        color: 'white',
        borderRadius: '12px',
        padding: '2px 8px',
        fontSize: '12px'
      },
      onclick: () => showNotifications()
    }
  },
  '#notificationBadge'
);
```

---

## Complete Real-World Application Example

Here's a comprehensive example showing multiple methods working together:

```javascript
// ============================================================================
// E-COMMERCE PRODUCT PAGE WITH COMPREHENSIVE STATE MANAGEMENT
// ============================================================================

// Initialize reactive states
const product = ReactiveUtils.state({
  id: 'prod-123',
  name: 'Wireless Headphones',
  price: 199.99,
  inventory: 15,
  rating: 4.5,
  status: 'available'
});

const cart = ReactiveUtils.state({
  items: [],
  quantity: 0,
  total: 0
});

const user = ReactiveUtils.state({
  isLoggedIn: false,
  isPremium: false,
  wishlist: []
});

const ui = ReactiveUtils.state({
  view: 'grid',
  sortBy: 'popular',
  filterPrice: 'all'
});

// ============================================================================
// CUSTOM MATCHERS FOR BUSINESS LOGIC
// ============================================================================

// Stock level matcher
Conditions.registerMatcher('stockLevel', {
  test: (condition) => ['outOfStock', 'lowStock', 'inStock'].includes(condition),
  match: (value, condition) => {
    if (condition === 'outOfStock') return value === 0;
    if (condition === 'lowStock') return value > 0 && value <= 5;
    if (condition === 'inStock') return value > 5;
    return false;
  }
});

// Price range matcher
Conditions.registerMatcher('priceRange', {
  test: (condition) => condition.startsWith('price:'),
  match: (value, condition) => {
    const range = condition.split(':')[1];
    const price = parseFloat(value);
    
    if (range === 'budget') return price < 50;
    if (range === 'mid') return price >= 50 && price < 200;
    if (range === 'premium') return price >= 200;
    return false;
  }
});

// ============================================================================
// CUSTOM HANDLERS FOR UI COMPONENTS
// ============================================================================

// Toast notification handler
Conditions.registerHandler('showToast', {
  test: (key) => key === 'showToast',
  apply: (element, val) => {
    element.textContent = val.message;
    element.className = `toast toast-${val.type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
      element.style.display = 'none';
    }, val.duration || 3000);
  }
});

// Counter animation handler
Conditions.registerHandler('animateCounter', {
  test: (key) => key === 'animateCounter',
  apply: (element, val) => {
    const start = parseInt(element.textContent) || 0;
    const end = val;
    const duration = 500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
});

// ============================================================================
// PRODUCT AVAILABILITY DISPLAY
// ============================================================================

Conditions.whenState(
  () => product.value.inventory,
  {
    'outOfStock': {
      innerHTML: `
        <span class="status-icon">❌</span>
        <span>Out of Stock</span>
      `,
      style: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '8px 16px',
        borderRadius: '4px',
        fontWeight: 'bold'
      }
    },
    'lowStock': {
      innerHTML: () => `
        <span class="status-icon">⚠️</span>
        <span>Only ${product.value.inventory} left!</span>
      `,
      style: {
        backgroundColor: '#fff3e0',
        color: '#e65100',
        padding: '8px 16px',
        borderRadius: '4px',
        fontWeight: 'bold'
      },
      classList: { add: 'pulse-animation' }
    },
    'inStock': {
      innerHTML: `
        <span class="status-icon">✓</span>
        <span>In Stock</span>
      `,
      style: {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        padding: '8px 16px',
        borderRadius: '4px'
      }
    }
  },
  '#stockStatus'
);

// ============================================================================
// ADD TO CART BUTTON STATE
// ============================================================================

Conditions.whenState(
  () => ({
    inventory: product.value.inventory,
    isLoggedIn: user.value.isLoggedIn
  }),
  {
    'truthy': (data) => {
      if (data.inventory === 0) {
        return {
          textContent: 'Out of Stock',
          disabled: true,
          classList: { add: 'btn-disabled', remove: 'btn-primary' },
          style: { cursor: 'not-allowed', opacity: '0.5' }
        };
      }
      
      if (!data.isLoggedIn) {
        return {
          textContent: 'Login to Purchase',
          disabled: false,
          classList: { add: 'btn-secondary', remove: 'btn-primary' },
          onclick: () => window.location.href = '/login'
        };
      }
      
      return {
        textContent: 'Add to Cart',
        disabled: false,
        classList: { add: 'btn-primary', remove: ['btn-secondary', 'btn-disabled'] },
        style: { cursor: 'pointer', opacity: '1' },
        onclick: () => addToCart(product.value)
      };
    }
  },
  '#addToCartBtn'
);

// ============================================================================
// PRICE DISPLAY WITH PREMIUM DISCOUNT
// ============================================================================

Conditions.whenState(
  () => user.value.isPremium,
  {
    'true': {
      innerHTML: () => {
        const discount = product.value.price * 0.1;
        const finalPrice = product.value.price - discount;
        return `
          <span class="original-price">$${product.value.price.toFixed(2)}</span>
          <span class="premium-price">$${finalPrice.toFixed(2)}</span>
          <span class="premium-badge">Premium -10%</span>
        `;
      },
      classList: { add: 'has-discount' }
    },
    'false': {
      innerHTML: () => `<span class="price">$${product.value.price.toFixed(2)}</span>`,
      classList: { remove: 'has-discount' }
    }
  },
  '#productPrice'
);

// ============================================================================
// SHOPPING CART BADGE
// ============================================================================

Conditions.whenState(
  () => cart.value.quantity,
  {
    '0': {
      style: { display: 'none' },
      textContent: ''
    },
    '>0': {
      style: { 
        display: 'inline-flex',
        backgroundColor: '#f44336',
        color: 'white',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold'
      },
      animateCounter: cart.value.quantity,
      classList: { add: 'cart-badge-visible' }
    }
  },
  '#cartBadge'
);

// ============================================================================
// WISHLIST BUTTON
// ============================================================================

Conditions.whenState(
  () => user.value.wishlist.includes(product.value.id),
  {
    'true': {
      innerHTML: '❤️ In Wishlist',
      classList: { add: 'btn-wishlist-active', remove: 'btn-wishlist' },
      onclick: () => removeFromWishlist(product.value.id),
      attrs: { 'aria-label': 'Remove from wishlist' }
    },
    'false': {
      innerHTML: '🤍 Add to Wishlist',
      classList: { add: 'btn-wishlist', remove: 'btn-wishlist-active' },
      onclick: () => addToWishlist(product.value.id),
      attrs: { 'aria-label': 'Add to wishlist' }
    }
  },
  '#wishlistBtn'
);

// ============================================================================
// RATING STARS DISPLAY
// ============================================================================

Conditions.whenState(
  () => product.value.rating,
  {
    'truthy': {
      innerHTML: () => {
        const rating = product.value.rating;
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
        
        return `
          ${'★'.repeat(fullStars)}
          ${hasHalf ? '⯨' : ''}
          ${'☆'.repeat(emptyStars)}
          <span class="rating-number">(${rating})</span>
        `;
      },
      style: { color: '#ffa000', fontSize: '18px' }
    }
  },
  '#productRating'
);

// ============================================================================
// BATCH UPDATE EXAMPLE - ADD TO CART
// ============================================================================

function addToCart(product) {
  Conditions.batch(() => {
    // Update cart state
    cart.value = {
      items: [...cart.value.items, product],
      quantity: cart.value.quantity + 1,
      total: cart.value.total + product.price
    };
    
    // Update inventory
    product.value = {
      ...product.value,
      inventory: product.value.inventory - 1
    };
    
    // Show toast notification
    Conditions.apply(
      'success',
      {
        'success': {
          showToast: {
            message: `${product.name} added to cart!`,
            type: 'success',
            duration: 2000
          }
        }
      },
      '#toastNotification'
    );
  });
  // All UI updates happen once, after batch completes
}

// ============================================================================
// VIEW MODE TOGGLE (Grid vs List)
// ============================================================================

Conditions.whenState(
  () => ui.value.view,
  {
    'grid': {
      classList: { add: 'product-grid', remove: 'product-list' },
      dataset: { view: 'grid' }
    },
    'list': {
      classList: { add: 'product-list', remove: 'product-grid' },
      dataset: { view: 'list' }
    }
  },
  '#productContainer'
);

// ============================================================================
// DEBUG PANEL (Development Only)
// ============================================================================

if (window.location.hostname === 'localhost') {
  console.log('=== Conditions Module Status ===');
  console.log('Mode:', Conditions.mode);
  console.log('Reactivity:', Conditions.hasReactivity);
  console.log('Matchers:', Conditions.getMatchers());
  console.log('Handlers:', Conditions.getHandlers());
}
```

This comprehensive guide covers all methods with beginner-friendly explanations and advanced real-world examples. The module is powerful yet flexible, working with or without reactive state management!