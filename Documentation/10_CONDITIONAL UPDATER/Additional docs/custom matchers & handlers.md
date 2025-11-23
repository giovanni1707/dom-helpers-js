# Custom Matchers and Custom Handlers Explained 🎯

Let's break down these two powerful features in simple terms!

---

## 🔍 **Custom Matchers** - Teaching the system NEW ways to compare values

### What are they?

Custom matchers let you define **NEW CONDITIONS** for comparing values. Think of them as teaching the system a new language for making decisions.

### The Anatomy of a Matcher

```javascript
{
  test: (condition, value) => boolean,  // "Should I use this matcher?"
  match: (value, condition) => boolean  // "Does the value match?"
}
```

### 📊 Simple Illustration

```
Built-in matcher:
┌─────────────────────────────────────┐
│ Condition: "true"                   │
│ Value: true                         │
│ ✓ MATCH! → Apply config            │
└─────────────────────────────────────┘

Custom matcher you create:
┌─────────────────────────────────────┐
│ Condition: "even"                   │
│ Value: 42                          │
│ ✓ MATCH! → Apply config            │
└─────────────────────────────────────┘
```

---

## 🎨 **Example 1: Even/Odd Number Matcher**

```javascript
// Register a custom matcher for even/odd numbers
Conditions.registerMatcher('evenOdd', {
  // Step 1: Should this matcher be used?
  test: (condition, value) => {
    return condition === 'even' || condition === 'odd';
  },
  
  // Step 2: Does the value match the condition?
  match: (value, condition) => {
    if (typeof value !== 'number') return false;
    
    if (condition === 'even') {
      return value % 2 === 0;  // True if divisible by 2
    }
    if (condition === 'odd') {
      return value % 2 !== 0;  // True if NOT divisible by 2
    }
    return false;
  }
});

// Now you can use it!
Conditions.apply(42, {
  'even': { textContent: '✓ Even number!', style: { color: 'green' } },
  'odd': { textContent: '✗ Odd number', style: { color: 'red' } }
}, '#result');
```

**What happens:**
```
Value: 42
↓
test('even', 42) → true (this matcher should handle it)
↓
match(42, 'even') → true (42 % 2 === 0)
↓
Apply: { textContent: '✓ Even number!', color: 'green' }
```

---

## 🎨 **Example 2: Day of Week Matcher**

```javascript
Conditions.registerMatcher('dayOfWeek', {
  test: (condition) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 
                  'friday', 'saturday', 'sunday'];
    return days.includes(condition.toLowerCase());
  },
  
  match: (value, condition) => {
    // value should be a Date object
    if (!(value instanceof Date)) return false;
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 
                  'thursday', 'friday', 'saturday'];
    const dayName = days[value.getDay()];
    
    return dayName === condition.toLowerCase();
  }
});

// Usage
const today = new Date();

Conditions.apply(today, {
  'monday': { textContent: '😫 Monday Blues' },
  'friday': { textContent: '🎉 TGIF!' },
  'saturday': { textContent: '😎 Weekend!' },
  'sunday': { textContent: '😴 Lazy Sunday' }
}, '#greeting');
```

---

## 🎨 **Example 3: Score Range Matcher**

```javascript
Conditions.registerMatcher('grade', {
  test: (condition) => {
    return ['A', 'B', 'C', 'D', 'F'].includes(condition.toUpperCase());
  },
  
  match: (value, condition) => {
    if (typeof value !== 'number') return false;
    
    const grade = condition.toUpperCase();
    
    if (grade === 'A') return value >= 90;
    if (grade === 'B') return value >= 80 && value < 90;
    if (grade === 'C') return value >= 70 && value < 80;
    if (grade === 'D') return value >= 60 && value < 70;
    if (grade === 'F') return value < 60;
    
    return false;
  }
});

// Usage
const studentScore = 85;

Conditions.apply(studentScore, {
  'A': { 
    textContent: 'Excellent! 🌟',
    style: { backgroundColor: 'gold' }
  },
  'B': { 
    textContent: 'Good job! 👍',
    style: { backgroundColor: 'lightgreen' }
  },
  'C': { 
    textContent: 'Okay',
    style: { backgroundColor: 'yellow' }
  },
  'F': { 
    textContent: 'Need improvement',
    style: { backgroundColor: 'lightcoral' }
  }
}, '.grade-display');
```

---

# 🔧 **Custom Handlers** - Teaching the system NEW ways to update elements

### What are they?

Custom handlers let you define **NEW WAYS TO UPDATE DOM ELEMENTS**. Think of them as teaching the system new "actions" it can perform.

### The Anatomy of a Handler

```javascript
{
  test: (key, value, element) => boolean,  // "Should I handle this property?"
  apply: (element, value, key) => void     // "How do I apply it?"
}
```

### 📊 Simple Illustration

```
Built-in handler:
┌─────────────────────────────────────┐
│ Property: style                     │
│ Value: { color: 'red' }            │
│ → element.style.color = 'red'      │
└─────────────────────────────────────┘

Custom handler you create:
┌─────────────────────────────────────┐
│ Property: tooltip                   │
│ Value: "Click me!"                 │
│ → Create tooltip element           │
└─────────────────────────────────────┘
```

---

## 🎨 **Example 1: Tooltip Handler**

```javascript
Conditions.registerHandler('tooltip', {
  // Should this handler be used?
  test: (key, value) => {
    return key === 'tooltip' && typeof value === 'string';
  },
  
  // How to apply it?
  apply: (element, value) => {
    // Create a tooltip
    element.setAttribute('title', value);
    
    // Add hover effect
    element.style.cursor = 'help';
    element.style.borderBottom = '1px dotted #999';
  }
});

// Usage
Conditions.apply('active', {
  'active': {
    textContent: 'Status: Active',
    tooltip: 'This item is currently active and running'
  }
}, '#status');
```

**Result:**
```html
<div id="status" 
     title="This item is currently active and running"
     style="cursor: help; border-bottom: 1px dotted #999">
  Status: Active
</div>
```

---

## 🎨 **Example 2: Animation Handler**

```javascript
Conditions.registerHandler('animate', {
  test: (key) => key === 'animate',
  
  apply: (element, value) => {
    // value = { name: 'fadeIn', duration: 300 }
    const { name, duration = 300, easing = 'ease' } = value;
    
    element.style.transition = `all ${duration}ms ${easing}`;
    
    // Trigger animation based on name
    if (name === 'fadeIn') {
      element.style.opacity = '0';
      setTimeout(() => { element.style.opacity = '1'; }, 10);
    }
    else if (name === 'slideDown') {
      element.style.maxHeight = '0';
      element.style.overflow = 'hidden';
      setTimeout(() => { 
        element.style.maxHeight = '500px'; 
      }, 10);
    }
    else if (name === 'bounce') {
      element.style.transform = 'scale(1.2)';
      setTimeout(() => { 
        element.style.transform = 'scale(1)'; 
      }, duration / 2);
    }
  }
});

// Usage
Conditions.apply(true, {
  'true': {
    classList: { add: 'visible' },
    animate: { name: 'fadeIn', duration: 500 }
  }
}, '.notification');
```

---

## 🎨 **Example 3: Badge Counter Handler**

```javascript
Conditions.registerHandler('badge', {
  test: (key) => key === 'badge',
  
  apply: (element, value) => {
    // Remove existing badge
    const existing = element.querySelector('.badge');
    if (existing) existing.remove();
    
    // Create new badge
    if (value > 0) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = value > 99 ? '99+' : value;
      badge.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: red;
        color: white;
        border-radius: 10px;
        padding: 2px 6px;
        font-size: 12px;
        font-weight: bold;
      `;
      
      element.style.position = 'relative';
      element.appendChild(badge);
    }
  }
});

// Usage
const unreadCount = 5;

Conditions.apply(unreadCount, {
  '>=1': { 
    badge: unreadCount,
    style: { fontWeight: 'bold' }
  },
  '0': {
    style: { fontWeight: 'normal' }
  }
}, '#inbox-button');
```

---

## 🎨 **Example 4: Loading Spinner Handler**

```javascript
Conditions.registerHandler('loading', {
  test: (key) => key === 'loading',
  
  apply: (element, value) => {
    if (value === true) {
      // Add spinner
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      spinner.innerHTML = '⏳';
      spinner.style.cssText = `
        display: inline-block;
        margin-left: 8px;
        animation: spin 1s linear infinite;
      `;
      element.appendChild(spinner);
      element.disabled = true;
    } else {
      // Remove spinner
      const spinner = element.querySelector('.spinner');
      if (spinner) spinner.remove();
      element.disabled = false;
    }
  }
});

// Usage
let isLoading = true;

Conditions.apply(isLoading, {
  'true': {
    textContent: 'Saving...',
    loading: true,
    style: { opacity: 0.6 }
  },
  'false': {
    textContent: 'Save',
    loading: false,
    style: { opacity: 1 }
  }
}, '#save-button');
```

---

## 🎯 **Complete Example: Score Tracker with Custom Matchers & Handlers**

```javascript
// CUSTOM MATCHER: Score levels
Conditions.registerMatcher('scoreLevel', {
  test: (condition) => ['beginner', 'intermediate', 'expert', 'master'].includes(condition),
  match: (value, condition) => {
    if (condition === 'beginner') return value < 100;
    if (condition === 'intermediate') return value >= 100 && value < 500;
    if (condition === 'expert') return value >= 500 && value < 1000;
    if (condition === 'master') return value >= 1000;
    return false;
  }
});

// CUSTOM HANDLER: Progress bar
Conditions.registerHandler('progressBar', {
  test: (key) => key === 'progressBar',
  apply: (element, value) => {
    const { current, max, color = '#4CAF50' } = value;
    const percentage = (current / max) * 100;
    
    let bar = element.querySelector('.progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'progress-bar';
      bar.style.cssText = `
        width: 100%;
        height: 20px;
        background: #eee;
        border-radius: 10px;
        overflow: hidden;
      `;
      element.appendChild(bar);
    }
    
    let fill = bar.querySelector('.fill');
    if (!fill) {
      fill = document.createElement('div');
      fill.className = 'fill';
      bar.appendChild(fill);
    }
    
    fill.style.cssText = `
      width: ${percentage}%;
      height: 100%;
      background: ${color};
      transition: width 0.3s ease;
    `;
  }
});

// CUSTOM HANDLER: Achievement badge
Conditions.registerHandler('achievement', {
  test: (key) => key === 'achievement',
  apply: (element, value) => {
    const badge = document.createElement('div');
    badge.className = 'achievement';
    badge.textContent = `🏆 ${value}`;
    badge.style.cssText = `
      background: gold;
      padding: 10px;
      border-radius: 8px;
      margin-top: 10px;
      font-weight: bold;
      animation: fadeIn 0.5s ease;
    `;
    element.appendChild(badge);
  }
});

// USE IT ALL TOGETHER
const playerScore = 750;

Conditions.apply(playerScore, {
  'beginner': {
    textContent: `Score: ${playerScore} - Keep practicing!`,
    style: { color: '#888' },
    progressBar: { current: playerScore, max: 1000, color: '#ccc' }
  },
  'intermediate': {
    textContent: `Score: ${playerScore} - You're getting better!`,
    style: { color: '#2196F3' },
    progressBar: { current: playerScore, max: 1000, color: '#2196F3' }
  },
  'expert': {
    textContent: `Score: ${playerScore} - Excellent work!`,
    style: { color: '#FF9800' },
    progressBar: { current: playerScore, max: 1000, color: '#FF9800' },
    achievement: 'Expert Level Reached!'
  },
  'master': {
    textContent: `Score: ${playerScore} - You are a master!`,
    style: { color: 'gold' },
    progressBar: { current: 1000, max: 1000, color: 'gold' },
    achievement: 'Master Level Unlocked!'
  }
}, '#score-display');
```

---

## 📝 **Summary**

| Feature | Purpose | When to Use |
|---------|---------|-------------|
| **Custom Matchers** | Define NEW conditions for comparison | When built-in conditions (`'true'`, `'>=10'`, etc.) aren't enough |
| **Custom Handlers** | Define NEW ways to update elements | When built-in properties (`style`, `classList`, etc.) aren't enough |

**Think of it like:**
- **Matchers** = New "IF conditions" you create
- **Handlers** = New "ACTIONS" you create

Both make your conditional rendering system infinitely extensible! 🚀