# The Tale of Custom Matchers and Handlers: A Journey Through Conditional Logic

*A narrative guide to extending Conditions.js with your own rules*

---

## 🎭 **Prologue: The Theater of Conditions**

Imagine you're the director of a theater production. Your stage (the DOM) needs to change based on what's happening in the story (your application state). 

- **Matchers** are your script readers — they decide *which scene* to perform based on the current plot point
- **Handlers** are your stage crew — they execute *how* each scene transformation happens

Out of the box, Conditions.js gives you a talented repertoire company and a skilled crew. But what if your play needs something special? Something the default cast can't handle?

That's where **custom matchers and handlers** come in. Let's follow their journey.

---

## 📖 **Act I: Understanding the Registry System**

### Scene 1: The Matcher's Audition Room

Deep inside `01_dh-conditional-rendering.js`, there's a special room called `conditionMatchers`. It's an object — a registry where every matcher waits for their turn to audition.

```javascript
const conditionMatchers = {
  booleanTrue: {
    test: (condition) => condition === 'true',
    match: (value) => value === true
  },
  booleanFalse: {
    test: (condition) => condition === 'false',
    match: (value) => value === false
  },
  truthy: {
    test: (condition) => condition === 'truthy',
    match: (value) => !!value
  },
  // ... dozens more matchers waiting
}
```

**The Audition Process:**

Every matcher has two methods:
1. **`test(condition, value)`** — "Can I handle this condition string?"
2. **`match(value, condition)`** — "Does the actual value match this condition?"

Think of it like this:

```
Director: "We need someone who can handle the condition 'truthy'"
Matcher:  "I can! My test() says I recognize 'truthy'"
Director: "Great! Now, is the value 42 truthy?"
Matcher:  "Yes! My match() says !!42 is true"
```

---

### Scene 2: The Handler's Workshop

Parallel to the matcher room is another space: `propertyHandlers`. This is where the stage crew hangs out, each specialist ready to transform the DOM in their unique way.

```javascript
const propertyHandlers = {
  style: {
    test: (key, val) => key === 'style' && typeof val === 'object',
    apply: (element, val) => {
      Object.entries(val).forEach(([prop, value]) => {
        element.style[prop] = value;
      });
    }
  },
  classList: {
    test: (key, val) => key === 'classList' && typeof val === 'object',
    apply: (element, val) => {
      // Complex class manipulation magic
    }
  },
  // ... more handlers
}
```

**The Workshop Process:**

Every handler has two methods:
1. **`test(key, val, element)`** — "Can I handle this property update?"
2. **`apply(element, val, key)`** — "Let me transform this element!"

```
Foreman: "We need to update 'style' with an object"
Handler: "That's me! My test() recognizes style objects"
Foreman: "Do it!"
Handler: "Applying styles..." *element transforms*
```

---

## 🎬 **Act II: The Execution Flow (The Performance)**

### Scene 1: When a Condition Arrives

Let's follow a single condition through the system. Imagine this code:

```javascript
Conditions.whenState(
  () => currentScore,
  {
    '>=100': { style: { color: 'gold' } },
    '>=50': { style: { color: 'silver' } },
    'default': { style: { color: 'bronze' } }
  },
  '#player-badge'
);
```

**Step 1: The Value Arrives** *(currentScore = 75)*

```javascript
function applyConditions(getValue, conditions, selector) {
  let value = getValue(); // value = 75
  let conditionsObj = conditions; // Our condition map
  
  // Now we need to find which condition matches...
}
```

**Step 2: The Matcher Auditions Begin**

```javascript
function matchesCondition(value, condition) {
  condition = String(condition).trim(); // ">=50"
  
  // The registry iterates through all matchers
  for (const matcher of Object.values(conditionMatchers)) {
    if (matcher.test(condition, value)) {
      // Found one! Let's see if it matches
      return matcher.match(value, condition);
    }
  }
}
```

Here's what happens internally:

```
Round 1:
  Matcher: booleanTrue
  test(">=50", 75) → "Nope, that's not 'true'"
  
Round 2:
  Matcher: truthy
  test(">=50", 75) → "Nope, that's not 'truthy'"
  
Round 3:
  Matcher: regex
  test(">=50", 75) → "Nope, that doesn't start with '/'"
  
Round 4:
  Matcher: greaterThanOrEqual
  test(">=50", 75) → "YES! I recognize '>=' patterns!"
  match(75, ">=50") → 
    target = Number("50") = 50
    return 75 >= 50 → TRUE ✓
```

**Step 3: Configuration Found**

```javascript
// Back in applyConditions()
for (const [condition, config] of Object.entries(conditionsObj)) {
  if (matchesCondition(value, condition)) {
    // Match found! config = { style: { color: 'silver' } }
    applyConfig(element, config, value);
    break;
  }
}
```

**Step 4: The Handlers Take Over**

```javascript
function applyConfig(element, config, currentValue) {
  // config = { style: { color: 'silver' } }
  
  Object.entries(config).forEach(([key, val]) => {
    // key = 'style', val = { color: 'silver' }
    applyProperty(element, key, val);
  });
}
```

**Step 5: Handler Selection**

```javascript
function applyProperty(element, key, val) {
  // Find handler that can handle this property
  for (const handler of Object.values(propertyHandlers)) {
    if (handler.test(key, val, element)) {
      handler.apply(element, val, key);
      return; // First match wins
    }
  }
}
```

The audition:

```
Handler: style
  test('style', { color: 'silver' }) → 
    "YES! key === 'style' && typeof val === 'object'"
  
  apply(element, { color: 'silver' }) →
    Object.entries({ color: 'silver' }).forEach(...)
    element.style.color = 'silver'
    ✓ DONE
```

---

## 🔧 **Act III: Creating Your Own (The Workshop)**

Now that you understand the flow, let's create custom extensions.

### Scene 1: Building a Custom Matcher

**The Challenge:** You need to match ISO date strings like `"2024-01-15"` and check if they're in the current month.

```javascript
// Register a custom matcher
Conditions.registerMatcher('currentMonth', {
  // Step 1: Can I recognize this condition?
  test: (condition) => {
    return condition.startsWith('currentMonth');
  },
  
  // Step 2: Does the value match?
  match: (value, condition) => {
    // value might be "2024-01-15"
    try {
      const date = new Date(value);
      const now = new Date();
      return date.getMonth() === now.getMonth() &&
             date.getFullYear() === now.getFullYear();
    } catch (e) {
      return false;
    }
  }
});
```

**Using It:**

```javascript
Conditions.whenState(
  () => articleDate,
  {
    'currentMonth': { 
      classList: { add: 'badge-new' },
      textContent: '🔥 Fresh!'
    },
    'default': { 
      classList: { remove: 'badge-new' } 
    }
  },
  '.article-date'
);
```

**The Journey:**

```
1. articleDate = "2024-11-15"
2. Condition "currentMonth" arrives
3. Matcher registry checks all matchers:
   → currentMonth.test("currentMonth") → TRUE ✓
4. currentMonth.match("2024-11-15", "currentMonth")
   → Parses date
   → Compares month & year
   → Returns TRUE
5. Config applied: { classList: { add: 'badge-new' }, ... }
```

---

### Scene 2: Building a Custom Handler

**The Challenge:** You want to animate element transformations using a custom animation library.

```javascript
Conditions.registerHandler('animate', {
  // Step 1: Can I handle this property?
  test: (key, val) => {
    return key === 'animate' && typeof val === 'object';
  },
  
  // Step 2: Apply the transformation
  apply: (element, val, key) => {
    // val might be { type: 'fadeIn', duration: 300 }
    const { type, duration = 300, ...options } = val;
    
    // Your custom animation library
    if (window.MyAnimationLib) {
      window.MyAnimationLib.animate(element, type, {
        duration,
        ...options
      });
    }
  }
});
```

**Using It:**

```javascript
Conditions.whenState(
  () => isVisible,
  {
    'true': { 
      animate: { type: 'fadeIn', duration: 300 },
      style: { display: 'block' }
    },
    'false': { 
      animate: { type: 'fadeOut', duration: 300 },
      style: { display: 'none' }
    }
  },
  '#modal'
);
```

**The Journey:**

```
1. isVisible = true
2. Condition 'true' matches
3. Config = { animate: {...}, style: {...} }
4. For each property:
   
   Property 1: animate
   → Handler registry checks all handlers
   → animate.test('animate', {...}) → TRUE ✓
   → animate.apply(element, { type: 'fadeIn', ... })
   → MyAnimationLib.animate(...) executes
   
   Property 2: style
   → Handler registry checks all handlers
   → style.test('style', {...}) → TRUE ✓
   → style.apply(element, { display: 'block' })
   → element.style.display = 'block'
```

---

## 🎪 **Act IV: Advanced Techniques (The Master Class)**

### Scene 1: Context-Aware Matchers

Sometimes matchers need to be smart about the value type:

```javascript
Conditions.registerMatcher('weekday', {
  test: (condition, value) => {
    // Only applicable if value looks like a date
    return condition === 'weekday' && 
           (value instanceof Date || typeof value === 'string');
  },
  
  match: (value, condition) => {
    const date = value instanceof Date ? value : new Date(value);
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday-Friday
  }
});
```

**Why This Matters:**

```javascript
// This won't try to parse numbers as dates
Conditions.whenState(() => 42, { 'weekday': {...} }, '#el');
// weekday.test() returns false because value is a number

// This will work
Conditions.whenState(() => new Date(), { 'weekday': {...} }, '#el');
// weekday.test() returns true because value is a Date
```

---

### Scene 2: Chainable Handlers

Handlers can coordinate with each other:

```javascript
Conditions.registerHandler('transition', {
  test: (key) => key === 'transition',
  
  apply: (element, val) => {
    // Set up transition
    element.style.transition = `all ${val.duration}ms ${val.easing}`;
    
    // Mark element so other handlers know transition is active
    element._transitionActive = true;
    
    // Clean up after transition
    setTimeout(() => {
      element._transitionActive = false;
      element.style.transition = '';
    }, val.duration);
  }
});

Conditions.registerHandler('transform', {
  test: (key) => key === 'transform',
  
  apply: (element, val) => {
    // Check if transition handler already set up transition
    if (element._transitionActive) {
      // Smooth animated transform
      requestAnimationFrame(() => {
        element.style.transform = val;
      });
    } else {
      // Immediate transform
      element.style.transform = val;
    }
  }
});
```

**Usage:**

```javascript
Conditions.whenState(
  () => isExpanded,
  {
    'true': {
      transition: { duration: 300, easing: 'ease-out' },
      transform: 'scale(1.2) rotate(5deg)',
      style: { opacity: 1 }
    },
    'false': {
      transition: { duration: 200, easing: 'ease-in' },
      transform: 'scale(1)',
      style: { opacity: 0.7 }
    }
  },
  '#card'
);
```

---

### Scene 3: Validation and Error Recovery

Professional matchers handle edge cases gracefully:

```javascript
Conditions.registerMatcher('jsonPath', {
  test: (condition) => condition.startsWith('json:'),
  
  match: (value, condition) => {
    try {
      // Extract path: "json:user.email.verified"
      const path = condition.slice(5);
      
      // Parse value if it's a string
      const obj = typeof value === 'string' ? JSON.parse(value) : value;
      
      // Navigate path
      const parts = path.split('.');
      let current = obj;
      
      for (const part of parts) {
        if (current == null) return false;
        current = current[part];
      }
      
      // Return truthy/falsy of final value
      return !!current;
      
    } catch (e) {
      console.warn('[Matcher:jsonPath] Failed:', e.message);
      return false; // Fail gracefully
    }
  }
});
```

---

## 🎓 **Act V: Real-World Examples (The Portfolio)**

### Example 1: Multi-Language Matcher

```javascript
// Match against user's preferred languages
Conditions.registerMatcher('lang', {
  test: (condition) => condition.startsWith('lang:'),
  
  match: (value, condition) => {
    // condition = "lang:en,es"
    // value = user's current language
    const acceptedLangs = condition.slice(5).split(',').map(l => l.trim());
    return acceptedLangs.includes(value);
  }
});

// Usage
Conditions.whenState(
  () => user.language,
  {
    'lang:en': { textContent: 'Welcome!' },
    'lang:es': { textContent: '¡Bienvenido!' },
    'lang:fr': { textContent: 'Bienvenue!' },
    'default': { textContent: 'Hello!' }
  },
  '#greeting'
);
```

---

### Example 2: Accessibility Handler

```javascript
// ARIA attributes handler
Conditions.registerHandler('aria', {
  test: (key, val) => key === 'aria' && typeof val === 'object',
  
  apply: (element, val) => {
    Object.entries(val).forEach(([ariaKey, ariaVal]) => {
      // Convert camelCase to kebab-case
      // expanded → aria-expanded
      const attrName = `aria-${ariaKey.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      
      if (ariaVal === false || ariaVal == null) {
        element.removeAttribute(attrName);
      } else {
        element.setAttribute(attrName, String(ariaVal));
      }
    });
  }
});

// Usage
Conditions.whenState(
  () => menuOpen,
  {
    'true': {
      aria: { 
        expanded: true, 
        hidden: false,
        controls: 'main-menu'
      },
      classList: { add: 'open' }
    },
    'false': {
      aria: { 
        expanded: false, 
        hidden: true 
      },
      classList: { remove: 'open' }
    }
  },
  '#menu-button'
);
```

---

### Example 3: Feature Detection Matcher

```javascript
// Match based on browser capabilities
Conditions.registerMatcher('supports', {
  test: (condition) => condition.startsWith('supports:'),
  
  match: (value, condition) => {
    // condition = "supports:grid" or "supports:css.grid"
    const feature = condition.slice(9);
    
    if (feature.startsWith('css.')) {
      // CSS feature detection
      const prop = feature.slice(4);
      return CSS.supports(prop, 'initial');
    }
    
    if (feature.startsWith('api.')) {
      // API detection
      const api = feature.slice(4);
      return api in window;
    }
    
    return false;
  }
});

// Usage - no value needed, matcher uses browser environment
Conditions.whenState(
  () => true, // Dummy value
  {
    'supports:css.grid': {
      style: { display: 'grid' }
    },
    'default': {
      style: { display: 'flex' }
    }
  },
  '.layout'
);
```

---

## 🎯 **Epilogue: The Design Philosophy**

### Why This Architecture?

**1. Strategy Pattern**
- Each matcher/handler is self-contained
- Easy to add/remove without touching core code
- First-match-wins ensures predictable behavior

**2. Fail-Safe by Default**
- Matchers return false on errors (don't break the chain)
- Handlers catch exceptions (one bad property doesn't break others)
- Always falls back to string equality (nothing is unhandleable)

**3. Performance Optimized**
- Early exit on first match (no unnecessary iterations)
- Handlers checked in order (common cases first)
- No regex compilation unless needed

**4. Extensible Without Modification**
- Core code never changes
- Extensions live in registries
- No risk of breaking existing functionality

---

## 📚 **The Complete API**

### Matcher Registration

```javascript
Conditions.registerMatcher(name, {
  test: (condition, value?) => boolean,
  match: (value, condition) => boolean
});
```

### Handler Registration

```javascript
Conditions.registerHandler(name, {
  test: (key, val, element?) => boolean,
  apply: (element, val, key) => void
});
```

### Introspection

```javascript
Conditions.getMatchers()  // Returns array of matcher names
Conditions.getHandlers()  // Returns array of handler names
```

---

## 🎬 **Curtain Call**

You now understand the complete journey:

1. **Values** arrive from your application state
2. **Matchers** audition to determine which condition applies
3. **Configs** are selected based on the winning matcher
4. **Handlers** transform the DOM based on the config
5. **Custom extensions** slot seamlessly into this pipeline

This architecture makes Conditions.js infinitely flexible while maintaining simplicity. You're not just using a library — you're conducting an orchestra where every musician (matcher/handler) knows exactly when to play their part.

*End of story.* 🎭