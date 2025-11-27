# The Epic of Conditional Rendering: When State Meets Strategy

Imagine you're a traffic controller at a busy intersection. Cars approach from different directions, and based on current conditions—the time of day, traffic density, emergency vehicles—you must make instant decisions: show green light here, red light there, adjust timing, change flow. But here's the challenge: conditions change constantly, and you must react in real-time while maintaining smooth operation.

This is the story of the Conditional Rendering module—a sophisticated system that watches state changes and applies appropriate configurations to DOM elements based on declarative conditions. It's not just about rendering; it's about **reactive decision-making** using elegant design patterns that make complex conditional logic feel natural and maintainable.

This is version **4.0.1**, proudly declaring "Fixed: Proxy/Symbol iterator compatibility"—showing it's a mature, battle-tested solution that has evolved through real-world challenges.

Let me take you on this journey through one of the most architecturally sophisticated modules we've encountered.

---

## 🎬 Chapter 1: The Environment Detection—Understanding the Landscape

```javascript
(function(global) {
  'use strict';

  // ============================================================================
  // ENVIRONMENT DETECTION
  // ============================================================================

  const hasReactiveUtils = !!global.ReactiveUtils;
  const hasElements = !!global.Elements;
  const hasCollections = !!global.Collections;
  const hasSelector = !!global.Selector;
```

The module begins with comprehensive environment detection. The `!!` double-negation converts any value to a boolean:

```javascript
const hasReactiveUtils = !!global.ReactiveUtils;

// If ReactiveUtils exists:
!!global.ReactiveUtils  // true

// If ReactiveUtils doesn't exist:
!!undefined  // false
```

**Why detect the environment?**

This module is designed to work in **multiple configurations**:
- With reactive state management (optimal)
- Without reactive state (degraded but functional)
- With DOM Helpers (enhanced)
- Without DOM Helpers (basic)

**Detecting reactive capabilities:**

```javascript
let effect, batch, isReactive;

if (hasReactiveUtils) {
  effect = global.ReactiveUtils.effect;
  batch = global.ReactiveUtils.batch;
  isReactive = global.ReactiveUtils.isReactive;
} else if (hasElements && typeof global.Elements.effect === 'function') {
  effect = global.Elements.effect;
  batch = global.Elements.batch;
  isReactive = global.Elements.isReactive;
}

const hasReactivity = !!(effect && batch);
```

This is a **cascading search** for reactive capabilities:

**Priority 1:** Look in `ReactiveUtils` (dedicated reactive library)
**Priority 2:** Look in `Elements` (DOM Helpers might include reactivity)
**Fallback:** Set `hasReactivity = false` (static mode)

The final check `!!(effect && batch)` ensures we have *both* critical functions. Having only one is useless—we need the complete reactive system or none at all.

---

## 🎯 Chapter 2: The Strategy Pattern—Condition Matchers Registry

Now we encounter a beautiful implementation of the **Strategy Pattern**—a design pattern where multiple algorithms (strategies) are encapsulated and made interchangeable.

```javascript
const conditionMatchers = {
  // Boolean literals
  booleanTrue: {
    test: (condition) => condition === 'true',
    match: (value) => value === true
  },
  booleanFalse: {
    test: (condition) => condition === 'false',
    match: (value) => value === false
  },
  // ... many more matchers
};
```

Each matcher is an object with two methods:
- **`test(condition, value)`** - "Does this matcher apply to this condition string?"
- **`match(value, condition)`** - "Does the actual value match the condition?"

**Understanding the two-phase process:**

**Phase 1: test()** - Identify which matcher to use
```javascript
booleanTrue: {
  test: (condition) => condition === 'true',
  // "Should I use this matcher? Only if condition string is 'true'"
}
```

**Phase 2: match()** - Apply the matcher
```javascript
booleanTrue: {
  match: (value) => value === true
  // "Does the actual value equal true?"
}
```

**Example flow:**

```javascript
// User writes:
whenState(myValue, { 'true': { style: { color: 'green' } } }, '.status')

// Condition string: 'true'
// Current value: true

// Phase 1: Which matcher applies?
booleanTrue.test('true')  // true ✓ (this one!)
booleanFalse.test('true')  // false
truthy.test('true')  // false

// Phase 2: Does value match?
booleanTrue.match(true)  // true ✓ (apply config!)
```

Let's explore some of the most interesting matchers:

---

## 📚 Chapter 3: The Boolean and Truthiness Matchers

```javascript
truthy: {
  test: (condition) => condition === 'truthy',
  match: (value) => !!value
},
falsy: {
  test: (condition) => condition === 'falsy',
  match: (value) => !value
}
```

These match JavaScript's truthiness concept:

```javascript
// truthy matches:
!!1  // true
!!'hello'  // true
!![]  // true
!!{}  // true

// falsy matches:
!0  // true
!''  // true
!null  // true
!undefined  // true
!false  // true
```

**Usage:**

```javascript
Conditions.whenState(
  () => myState.username,
  {
    'truthy': { classList: { add: 'logged-in' } },
    'falsy': { classList: { add: 'logged-out' } }
  },
  '.user-status'
);
```

---

## 🔍 Chapter 4: The Empty Matcher—Comprehensive Emptiness Detection

```javascript
empty: {
  test: (condition) => condition === 'empty',
  match: (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return !value;
  }
}
```

This is **polymorphic emptiness checking**—it understands "empty" differently for different types:

```javascript
// Strings
'empty'.match('')  // true (empty string)
'empty'.match('hello')  // false

// Arrays
'empty'.match([])  // true (empty array)
'empty'.match([1, 2])  // false

// Objects
'empty'.match({})  // true (no keys)
'empty'.match({ a: 1 })  // false

// Null/undefined
'empty'.match(null)  // true
'empty'.match(undefined)  // true

// Other falsy values
'empty'.match(0)  // true (!0 === true)
'empty'.match(false)  // true (!false === true)
```

This comprehensive check makes "empty" intuitive across all data types.

---

## 📝 Chapter 5: The Quoted String Matcher—Exact String Comparison

```javascript
quotedString: {
  test: (condition) => 
    (condition.startsWith('"') && condition.endsWith('"')) ||
    (condition.startsWith("'") && condition.endsWith("'")),
  match: (value, condition) => String(value) === condition.slice(1, -1)
}
```

This allows exact string matching with quotes:

```javascript
Conditions.whenState(
  () => status,
  {
    '"active"': { style: { color: 'green' } },
    '"inactive"': { style: { color: 'red' } },
    '"pending"': { style: { color: 'yellow' } }
  },
  '.status'
);
```

**The slice trick:**

```javascript
condition.slice(1, -1)
```

This removes the first and last characters (the quotes):

```javascript
'"active"'.slice(1, -1)  // 'active'
"'hello'".slice(1, -1)   // 'hello'
```

Then it compares:

```javascript
String(value) === condition.slice(1, -1)
String('active') === 'active'  // true
```

---

## 🔤 Chapter 6: The String Pattern Matchers—Flexible Text Matching

```javascript
includes: {
  test: (condition) => condition.startsWith('includes:'),
  match: (value, condition) => {
    const searchTerm = condition.slice(9).trim();
    return String(value).includes(searchTerm);
  }
},
startsWith: {
  test: (condition) => condition.startsWith('startsWith:'),
  match: (value, condition) => {
    const prefix = condition.slice(11).trim();
    return String(value).startsWith(prefix);
  }
},
endsWith: {
  test: (condition) => condition.startsWith('endsWith:'),
  match: (value, condition) => {
    const suffix = condition.slice(9).trim();
    return String(value).endsWith(suffix);
  }
}
```

These enable partial string matching:

```javascript
Conditions.whenState(
  () => email,
  {
    'includes:@gmail.com': { classList: { add: 'gmail-user' } },
    'startsWith:admin_': { classList: { add: 'admin' } },
    'endsWith:.edu': { classList: { add: 'student' } }
  },
  '.user-badge'
);
```

**The slice calculations:**

```javascript
// For 'includes:@gmail.com'
condition.slice(9)  // Skip 'includes:' (9 characters)
// Result: '@gmail.com'

// For 'startsWith:admin_'
condition.slice(11)  // Skip 'startsWith:' (11 characters)
// Result: 'admin_'

// For 'endsWith:.edu'
condition.slice(9)  // Skip 'endsWith:' (9 characters)
// Result: '.edu'
```

The `.trim()` removes any accidental whitespace.

---

## 🎭 Chapter 7: The Regex Matcher—Maximum Flexibility

```javascript
regex: {
  test: (condition) => 
    condition.startsWith('/') && condition.lastIndexOf('/') > 0,
  match: (value, condition) => {
    try {
      const lastSlash = condition.lastIndexOf('/');
      const pattern = condition.slice(1, lastSlash);
      const flags = condition.slice(lastSlash + 1);
      const regex = new RegExp(pattern, flags);
      return regex.test(String(value));
    } catch (e) {
      console.warn('[Conditions] Invalid regex pattern:', condition, e);
      return false;
    }
  }
}
```

This allows full regex patterns in condition strings:

```javascript
Conditions.whenState(
  () => phoneNumber,
  {
    '/^\\d{3}-\\d{3}-\\d{4}$/': { classList: { add: 'valid-phone' } },
    '/^[A-Z]/': { classList: { add: 'capitalized' } },
    '/test/i': { classList: { add: 'contains-test' } }  // i flag for case-insensitive
  },
  '.phone-input'
);
```

**Parsing the regex string:**

For pattern `/^\d{3}-\d{3}-\d{4}$/`:

```javascript
const lastSlash = condition.lastIndexOf('/');  // 24 (position of last /)
const pattern = condition.slice(1, lastSlash);  // '^\d{3}-\d{3}-\d{4}$'
const flags = condition.slice(lastSlash + 1);  // '' (no flags)
const regex = new RegExp(pattern, flags);
```

For pattern `/test/i`:

```javascript
const lastSlash = condition.lastIndexOf('/');  // 5
const pattern = condition.slice(1, lastSlash);  // 'test'
const flags = condition.slice(lastSlash + 1);  // 'i'
const regex = new RegExp('test', 'i');  // Case-insensitive
```

The `try-catch` wrapper ensures invalid regex patterns don't crash the application—they just return `false` and warn.

---

## 🔢 Chapter 8: The Numeric Matchers—Mathematical Comparisons

These matchers only apply when the value is actually a number:

```javascript
numericExact: {
  test: (condition, value) => 
    typeof value === 'number' && !isNaN(condition),
  match: (value, condition) => value === Number(condition)
}
```

Notice the `test()` receives **both** condition and value. This is important—numeric comparisons only make sense if the value is numeric.

**The comparison operators:**

```javascript
greaterThan: {
  test: (condition, value) => 
    typeof value === 'number' && 
    condition.startsWith('>') && 
    !condition.startsWith('>='),
  match: (value, condition) => {
    const target = Number(condition.slice(1).trim());
    return !isNaN(target) && value > target;
  }
}
```

The test ensures:
1. Value is a number
2. Condition starts with `>`
3. Condition doesn't start with `>=` (that's a different operator)

**Usage:**

```javascript
Conditions.whenState(
  () => temperature,
  {
    '>30': { style: { color: 'red' }, textContent: 'Hot!' },
    '20-30': { style: { color: 'orange' }, textContent: 'Warm' },
    '<20': { style: { color: 'blue' }, textContent: 'Cold' }
  },
  '.temperature-display'
);
```

**The range matcher:**

```javascript
numericRange: {
  test: (condition, value) => 
    typeof value === 'number' && 
    condition.includes('-') && 
    !condition.startsWith('<') && 
    !condition.startsWith('>') && 
    !condition.startsWith('='),
  match: (value, condition) => {
    const parts = condition.split('-').map(p => p.trim());
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const [min, max] = parts.map(Number);
      return value >= min && value <= max;
    }
    return false;
  }
}
```

For condition `'20-30'`:

```javascript
condition.split('-')  // ['20', '30']
.map(p => p.trim())  // ['20', '30'] (remove whitespace)
.map(Number)  // [20, 30]

value >= 20 && value <= 30  // Check if in range
```

The test ensures the dash isn't part of a comparison operator like `<-5` or `>-10`.

---

## 🎯 Chapter 9: The matchesCondition Function—The Orchestrator

```javascript
function matchesCondition(value, condition) {
  condition = String(condition).trim();
  
  // Iterate through matchers and return first match
  for (const matcher of Object.values(conditionMatchers)) {
    if (matcher.test(condition, value)) {
      return matcher.match(value, condition);
    }
  }
  
  return false;
}
```

This function orchestrates the matching process:

1. Convert condition to trimmed string
2. Loop through all matchers
3. Find the first matcher whose `test()` returns true
4. Use that matcher's `match()` to check if value matches
5. Return result

**The order matters:**

```javascript
for (const matcher of Object.values(conditionMatchers))
```

Matchers are tried in the order they're defined in the object. Specific matchers (like `booleanTrue`) come first, with the generic `stringEquality` as the final fallback.

**Example execution:**

```javascript
matchesCondition(25, '>20')

// Try each matcher:
booleanTrue.test('>20')  // false, skip
booleanFalse.test('>20')  // false, skip
truthy.test('>20')  // false, skip
// ... more matchers ...
greaterThan.test('>20', 25)  // true! Use this one

greaterThan.match(25, '>20')
// Parses: target = 20
// Checks: 25 > 20
// Returns: true ✓
```

---

## 🔧 Chapter 10: The Property Handlers Registry—Another Strategy Pattern

Just as condition matching uses strategy pattern, property application does too:

```javascript
const propertyHandlers = {
  style: {
    test: (key, val) => key === 'style' && typeof val === 'object' && val !== null,
    apply: (element, val) => {
      Object.entries(val).forEach(([prop, value]) => {
        if (value !== null && value !== undefined) {
          element.style[prop] = value;
        }
      });
    }
  },
  // ... many more handlers
};
```

Each handler decides:
- **`test(key, val, element)`** - "Should I handle this property?"
- **`apply(element, val, key)`** - "Apply this property to the element"

**The classList handler with operations:**

```javascript
classList: {
  test: (key, val) => key === 'classList' && typeof val === 'object' && val !== null,
  apply: (element, val) => {
    if (Array.isArray(val)) {
      // Replace all classes
      element.className = '';
      val.forEach(cls => cls && element.classList.add(cls));
    } else {
      // Individual operations
      const operations = {
        add: (classes) => {
          const classList = Array.isArray(classes) ? classes : [classes];
          classList.forEach(cls => cls && element.classList.add(cls));
        },
        remove: (classes) => {
          const classList = Array.isArray(classes) ? classes : [classes];
          classList.forEach(cls => cls && element.classList.remove(cls));
        },
        toggle: (classes) => {
          const classList = Array.isArray(classes) ? classes : [classes];
          classList.forEach(cls => cls && element.classList.toggle(cls));
        },
        replace: (classes) => {
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
}
```

This handler supports **two different syntaxes**:

**Syntax 1: Array (replace all classes)**
```javascript
classList: ['btn', 'btn-primary', 'active']
// Becomes: element.className = ''; then add each class
```

**Syntax 2: Object (operations)**
```javascript
classList: {
  add: ['btn', 'btn-primary'],
  remove: ['disabled'],
  toggle: ['active']
}
// Executes each operation
```

The internal `operations` object is a **command pattern**—each operation is a function that can be called dynamically.

---

## 🎪 Chapter 11: The addEventListener Handler—Event Management

```javascript
addEventListener: {
  test: (key, val) => key === 'addEventListener' && typeof val === 'object' && val !== null,
  apply: (element, val) => {
    if (!element._whenStateListeners) {
      element._whenStateListeners = [];
    }
    
    Object.entries(val).forEach(([event, handlerConfig]) => {
      let handler, options;
      
      if (typeof handlerConfig === 'function') {
        handler = handlerConfig;
        options = undefined;
      } else if (typeof handlerConfig === 'object' && handlerConfig !== null) {
        handler = handlerConfig.handler;
        options = handlerConfig.options;
      }
      
      if (handler && typeof handler === 'function') {
        element.addEventListener(event, handler, options);
        element._whenStateListeners.push({ event, handler, options });
      }
    });
  }
}
```

This handler does something clever—it **tracks** the listeners it adds:

```javascript
if (!element._whenStateListeners) {
  element._whenStateListeners = [];
}
```

Each listener is stored in a private array on the element. Why?

**Because conditions can change!**

When the state changes from one condition to another, we need to remove the old event listeners and add new ones. The `_whenStateListeners` array tracks what we've added so we can clean it up later.

**The flexible handler config:**

```javascript
if (typeof handlerConfig === 'function') {
  handler = handlerConfig;
  options = undefined;
} else if (typeof handlerConfig === 'object' && handlerConfig !== null) {
  handler = handlerConfig.handler;
  options = handlerConfig.options;
}
```

This supports two syntaxes:

**Syntax 1: Direct function**
```javascript
addEventListener: {
  click: handleClick,
  mouseover: handleHover
}
```

**Syntax 2: Object with options**
```javascript
addEventListener: {
  click: {
    handler: handleClick,
    options: { once: true, capture: false }
  }
}
```

---

## 🧹 Chapter 12: The Cleanup Function—Memory Management

```javascript
function cleanupListeners(element) {
  if (element._whenStateListeners) {
    element._whenStateListeners.forEach(({ event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    element._whenStateListeners = [];
  }
}
```

This function is called before applying new conditions. It removes all previously attached listeners:

```javascript
// State changes from 'active' to 'inactive'

// Before cleanup:
element has listeners: [click handler, mouseover handler]

// After cleanup:
element._whenStateListeners = []
All listeners removed

// Then new condition applies:
element gets new listeners for 'inactive' state
```

This prevents **listener accumulation**—without cleanup, each state change would add more listeners without removing old ones, causing memory leaks and duplicate events.

---

## 🔄 Chapter 13: The toArray Function—The Proxy Fix

This is the function mentioned in the version note "Fixed: Proxy/Symbol iterator compatibility":

```javascript
function toArray(collection) {
  if (!collection) return [];
  
  // Already an array
  if (Array.isArray(collection)) {
    return collection;
  }
  
  // Native collections - use Array.from safely
  if (collection instanceof NodeList || collection instanceof HTMLCollection) {
    return Array.from(collection);
  }
  
  // Proxy or array-like object with length property
  if (typeof collection === 'object' && 'length' in collection) {
    try {
      // First try Array.from in case it works
      return Array.from(collection);
    } catch (e) {
      // If Array.from fails (due to Symbol iterator issues with Proxy),
      // manually iterate using numeric indices
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
```

**The Proxy problem:**

When Collections are wrapped in Proxies (as we've seen in previous modules), they sometimes don't properly implement `Symbol.iterator`. This causes `Array.from()` to fail:

```javascript
// Proxy collection without proper Symbol.iterator
const proxyCollection = new Proxy(nodeList, { ... });

Array.from(proxyCollection)  // Error! Symbol.iterator not properly implemented
```

**The solution:**

Try `Array.from()` first (the clean way), but if it fails, fall back to manual iteration:

```javascript
const arr = [];
const len = collection.length;
for (let i = 0; i < len; i++) {
  if (i in collection) {
    arr.push(collection[i]);
  }
}
```

This **manual iteration** uses numeric indices directly, which always works on Proxies because numeric properties can be intercepted by the `get` trap.

The `i in collection` check ensures we don't push `undefined` for missing indices—it verifies the property exists before accessing it.

---

## 🎯 Chapter 14: The getElements Function—Universal Element Retrieval

```javascript
function getElements(selector) {
  // Already an element or NodeList
  if (selector instanceof Element) {
    return [selector];
  }
  if (selector instanceof NodeList || selector instanceof HTMLCollection) {
    return Array.from(selector);
  }
  if (Array.isArray(selector)) {
    return selector.filter(el => el instanceof Element);
  }

  // String selector
  if (typeof selector === 'string') {
    // Use DOM Helpers if available for optimized queries
    if (selector.startsWith('#')) {
      const id = selector.slice(1);
      if (hasElements && global.Elements[id]) {
        return [global.Elements[id]];
      }
      const el = document.getElementById(id);
      return el ? [el] : [];
    }
    
    if (selector.startsWith('.')) {
      const className = selector.slice(1);
      if (hasCollections && global.Collections.ClassName) {
        const collection = global.Collections.ClassName[className];
        // Use safe toArray conversion to handle Proxy objects
        if (collection) {
          return toArray(collection);
        }
      }
      return Array.from(document.getElementsByClassName(className));
    }

    // Use Selector helper if available
    if (hasSelector && global.Selector.queryAll) {
      const result = global.Selector.queryAll(selector);
      return result ? toArray(result) : [];
    }

    // Fallback to native querySelectorAll
    return Array.from(document.querySelectorAll(selector));
  }

  return [];
}
```

This function is **polymorphic**—it accepts many input types and always returns an array of elements.

**Input types handled:**

**1. Single element**
```javascript
getElements(document.getElementById('my-btn'))
// Returns: [element]
```

**2. NodeList or HTMLCollection**
```javascript
getElements(document.querySelectorAll('.button'))
// Returns: [element1, element2, element3]
```

**3. Array**
```javascript
getElements([el1, el2, el3])
// Returns: [el1, el2, el3] (filtered to only Elements)
```

**4. String selector**

This is where it gets interesting—the function tries multiple strategies:

**For ID selectors (`#myId`):**
```javascript
if (selector.startsWith('#')) {
  const id = selector.slice(1);  // Remove #
  
  // Try Elements helper first (if available)
  if (hasElements && global.Elements[id]) {
    return [global.Elements[id]];
  }
  
  // Fallback to native
  const el = document.getElementById(id);
  return el ? [el] : [];
}
```

**For class selectors (`.myClass`):**
```javascript
if (selector.startsWith('.')) {
  const className = selector.slice(1);  // Remove .
  
  // Try Collections helper first
  if (hasCollections && global.Collections.ClassName) {
    const collection = global.Collections.ClassName[className];
    if (collection) {
      return toArray(collection);  // Use safe conversion!
    }
  }
  
  // Fallback to native
  return Array.from(document.getElementsByClassName(className));
}
```

**For complex selectors:**
```javascript
// Try Selector helper
if (hasSelector && global.Selector.queryAll) {
  const result = global.Selector.queryAll(selector);
  return result ? toArray(result) : [];
}

// Fallback to native querySelectorAll
return Array.from(document.querySelectorAll(selector));
```

This **cascading fallback** ensures the function always works, using optimized helpers when available but degrading gracefully to native methods.

---

## 🎨 Chapter 15: The applyConfig Function—Smart Property Application

```javascript
function applyConfig(element, config, currentValue) {
  // Use DOM Helpers' .update() method if available
  if (element.update && typeof element.update === 'function') {
    try {
      element.update(config);
      return;
    } catch (e) {
      console.warn('[Conditions] Error using element.update():', e);
      // Fall through to manual application
    }
  }
  
  // Manual application (fallback)
  Object.entries(config).forEach(([key, val]) => {
    try {
      applyProperty(element, key, val);
    } catch (e) {
      console.warn(`[Conditions] Failed to apply ${key}:`, e);
    }
  });
}
```

**The two-tier approach:**

**Tier 1:** Try using element's `.update()` method (if enhanced)
```javascript
element.update({
  textContent: 'Hello',
  style: { color: 'red' },
  classList: { add: ['active'] }
})
```

**Tier 2:** Manual property-by-property application (fallback)
```javascript
applyProperty(element, 'textContent', 'Hello')
applyProperty(element, 'style', { color: 'red' })
applyProperty(element, 'classList', { add: ['active'] })
```

The try-catch around `.update()` is important—if it throws an error, we gracefully fall back to manual application rather than crashing.

---

## 🎯 Chapter 16: The Core Logic—applyConditions

```javascript
function applyConditions(getValue, conditions, selector) {
  // Get target elements
  const elements = getElements(selector);
  
  if (!elements || elements.length === 0) {
    console.warn('[Conditions] No elements found for selector:', selector);
    return;
  }
  
  // Get current value
  let value;
  try {
    value = getValue();
  } catch (e) {
    console.error('[Conditions] Error getting value:', e);
    return;
  }
  
  // Get conditions (support dynamic conditions via function)
  let conditionsObj;
  try {
    conditionsObj = typeof conditions === 'function' ? conditions() : conditions;
  } catch (e) {
    console.error('[Conditions] Error evaluating conditions:', e);
    return;
  }
  
  // Apply to all matching elements
  elements.forEach(element => {
    // Cleanup previous event listeners
    cleanupListeners(element);
    
    // Find matching condition and apply config
    for (const [condition, config] of Object.entries(conditionsObj)) {
      if (matchesCondition(value, condition)) {
        applyConfig(element, config, value);
        break; // Only apply first matching condition
      }
    }
  });
}
```

This is the orchestrator that brings everything together:

**Step 1:** Get elements using universal `getElements()`

**Step 2:** Get current value (with error handling)

**Step 3:** Get conditions object (supports dynamic conditions via function)

**Step 4:** For each element:
- Clean up old listeners
- Find first matching condition
- Apply that condition's configuration
- Break (only one condition applies)

**The dynamic conditions support:**

```javascript
conditionsObj = typeof conditions === 'function' ? conditions() : conditions;
```

This allows conditions to be computed dynamically:

```javascript
Conditions.whenState(
  () => count,
  () => ({  // Function returns conditions
    [`>${threshold}`]: { style: { color: 'red' } },
    [`<${threshold}`]: { style: { color: 'blue' } }
  }),
  '.count'
);
```

The threshold can change, and conditions update accordingly!

---

## 🚀 Chapter 17: The whenState Method—The Main API

```javascript
whenState(valueFn, conditions,selector, options = {}) {
  // Validate inputs
  if (!conditions || (typeof conditions !== 'object' && typeof conditions !== 'function')) {
    console.error('[Conditions] Second argument must be an object or function returning an object');
    return;
  }

  // Determine if we should use reactive mode
  const useReactive = options.reactive !== false && hasReactivity;
  const isFunction = typeof valueFn === 'function';
  
  // If valueFn is not a function, treat it as a static value
  const getValue = isFunction ? valueFn : () => valueFn;

  // Check if value is reactive state
  const valueIsReactiveState = isFunction && hasReactivity && 
                                typeof isReactive === 'function' && 
                                isReactive(valueFn());

  // Decide execution mode
  if (useReactive && (isFunction || valueIsReactiveState)) {
    // REACTIVE MODE: Use effect for automatic updates
    return effect(() => {
      applyConditions(getValue, conditions, selector);
    });
  } else {
    // NON-REACTIVE MODE: Execute once
    applyConditions(getValue, conditions, selector);
    
    // Return update function for manual updates if needed
    return {
      update: () => applyConditions(getValue, conditions, selector),
      destroy: () => {} // No cleanup needed in non-reactive mode
    };
  }
}
```

**The mode decision logic:**

```javascript
const useReactive = options.reactive !== false && hasReactivity;
```

Reactive mode is used if:
1. `options.reactive` is not explicitly `false`
2. AND reactivity is available (`hasReactivity`)

**The value handling:**

```javascript
const isFunction = typeof valueFn === 'function';
const getValue = isFunction ? valueFn : () => valueFn;
```

If `valueFn` is already a function, use it directly. Otherwise, wrap the static value in a function:

```javascript
// Function value
whenState(() => myState.count, ...)  // getValue = () => myState.count

// Static value
whenState(42, ...)  // getValue = () => 42
```

**Reactive mode:**

```javascript
return effect(() => {
  applyConditions(getValue, conditions, selector);
});
```

The `effect()` function (from reactive library) automatically re-runs whenever reactive dependencies change.

**Non-reactive mode:**

```javascript
applyConditions(getValue, conditions, selector);

return {
  update: () => applyConditions(getValue, conditions, selector),
  destroy: () => {}
};
```

Execute once, then return an object with manual `update()` and `destroy()` methods for consistency.

---

## 🎓 The Profound Lessons—Architectural Mastery

This module teaches us advanced software engineering:

**1. Strategy Pattern:** Encapsulate algorithms (matchers, handlers) in interchangeable objects

**2. Polymorphism:** Functions accept many input types, behaving appropriately for each

**3. Cascading Fallbacks:** Try best option first, gracefully degrade through alternatives

**4. Defensive Programming:** Try-catch everywhere, validate all inputs, handle all edge cases

**5. Extensibility:** `registerMatcher()` and `registerHandler()` let users add custom logic

**6. Dual-mode operation:** Works with or without reactive state management

**7. Memory management:** Track and cleanup event listeners to prevent leaks

**8. Proxy compatibility:** Handle Symbol.iterator issues with manual iteration fallback

When you write:

```javascript
Conditions.whenState(
  () => userState.status,
  {
    'active': {
      style: { color: 'green' },
      classList: { add: ['active'], remove: ['inactive'] },
      textContent: 'Online'
    },
    'away': {
      style: { color: 'yellow' },
      classList: { add: ['away'], remove: ['active', 'inactive'] },
      textContent: 'Away'
    },
    'offline': {
      style: { color: 'gray' },
      classList: { add: ['inactive'], remove: ['active', 'away'] },
      textContent: 'Offline'
    }
  },
  '.user-status'
);
```

You're leveraging:
- Strategy pattern for matching
- Strategy pattern for property application
- Reactive effects for automatic updates
- Universal element selection
- Memory-safe event handling
- Proxy-compatible iteration

All working together in beautiful harmony! 🚀✨