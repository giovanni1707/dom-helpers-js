# Understanding `watch()` - A Beginner's Guide

## What is `watch()`?

`watch()` is a function that **watches specific properties** in your reactive state and runs a callback function whenever those properties change. It's like having a dedicated observer that monitors one particular thing and alerts you when it changes.

Think of it as **targeted monitoring**:
1. You specify exactly what property to watch
2. You provide a callback function
3. When that property changes, your callback runs
4. You get both the new value and the old value
5. Only that specific property triggers the callback

It's like setting up a security camera pointed at one specific door - it only alerts you when that door opens!

---

## Why Does This Exist?

### The Old Way (Without `watch()`)

Imagine you want to save data to localStorage whenever a specific property changes:

```javascript
const state = Reactive.state({ username: '', theme: 'light', fontSize: 16 });

// Must manually check and save after every change
state.username = 'John';
localStorage.setItem('username', state.username);  // Manual save

state.theme = 'dark';
localStorage.setItem('theme', state.theme);  // Manual save

state.fontSize = 18;
localStorage.setItem('fontSize', state.fontSize);  // Manual save

// Easy to forget!
state.username = 'Jane';
// Oops! Forgot to save to localStorage!
```

**Problems:**
- Must manually trigger save after each change
- Easy to forget
- Repetitive code
- No access to old value for comparison
- Hard to maintain

### The New Way (With `watch()`)

With `watch()`, the save happens automatically:

```javascript
const state = Reactive.state({ username: '', theme: 'light', fontSize: 16 });

// Watch username and auto-save
Reactive.watch(state, {
  username(newValue, oldValue) {
    console.log(`Username changed from "${oldValue}" to "${newValue}"`);
    localStorage.setItem('username', newValue);
  }
});

// Just change the data - watch callback runs automatically!
state.username = 'John';  // Callback runs, saves to localStorage ✨
state.username = 'Jane';  // Callback runs again ✨

// Other properties don't trigger this watcher
state.theme = 'dark';     // This watcher doesn't run (not watching theme)
state.fontSize = 18;      // This watcher doesn't run (not watching fontSize)
```

**Benefits:**
- Automatic callback when property changes
- Get both old and new values
- Specific - only watches what you tell it to
- Clean, declarative code
- Can't forget to handle changes

---

## How Does It Work?

### The Magic Behind the Scenes

When you use `watch()`, it:

1. **Tracks the specific property** you name
2. **Stores the current value** as "old value"
3. **Monitors for changes** to that property
4. **When changed**, calls your callback with new and old values
5. **Updates stored value** for next change

Think of it like this:

```
You create watcher: watch 'count'
         ↓
Current value: 0 (stored)
         ↓
state.count = 5
         ↓
Callback runs: (newValue: 5, oldValue: 0)
         ↓
Stores 5 as new "old value"
         ↓
state.count = 10
         ↓
Callback runs: (newValue: 10, oldValue: 5)
```

**Key concept:** `watch()` is **specific** - you tell it exactly what to watch, unlike `effect()` which automatically tracks everything!

---

## Simple Examples Explained

### Example 1: Save to LocalStorage

**JavaScript:**
```javascript
const settings = Reactive.state({
  theme: 'light',
  fontSize: 16,
  notifications: true
});

// Watch each setting and save to localStorage
Reactive.watch(settings, {
  theme(newTheme, oldTheme) {
    console.log(`Theme changed from ${oldTheme} to ${newTheme}`);
    localStorage.setItem('theme', newTheme);
  },
  
  fontSize(newSize, oldSize) {
    console.log(`Font size changed from ${oldSize} to ${newSize}`);
    localStorage.setItem('fontSize', newSize);
  },
  
  notifications(newValue, oldValue) {
    console.log(`Notifications changed from ${oldValue} to ${newValue}`);
    localStorage.setItem('notifications', newValue);
  }
});

// Changes automatically trigger saves
settings.theme = 'dark';          // Logs and saves
settings.fontSize = 18;           // Logs and saves
settings.notifications = false;   // Logs and saves
```

**What happens:**
- Each property has its own dedicated watcher
- When a property changes, only its watcher runs
- Each watcher saves its specific data to localStorage
- Get old and new values for comparison

**Why this is cool:** Automatic persistence! Never forget to save settings.

---

### Example 2: Form Validation Feedback

```javascript
const form = Reactive.state({
  email: '',
  password: '',
  username: ''
});

// Watch email and validate
Reactive.watch(form, {
  email(newEmail, oldEmail) {
    const emailInput = document.getElementById('email');
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    
    if (newEmail && !isValid) {
      emailInput.classList.add('invalid');
      emailInput.classList.remove('valid');
    } else if (newEmail && isValid) {
      emailInput.classList.add('valid');
      emailInput.classList.remove('invalid');
    } else {
      emailInput.classList.remove('valid', 'invalid');
    }
  },
  
  password(newPassword) {
    const feedback = document.getElementById('password-feedback');
    
    if (newPassword.length === 0) {
      feedback.textContent = '';
    } else if (newPassword.length < 8) {
      feedback.textContent = 'Password too short';
      feedback.style.color = 'red';
    } else {
      feedback.textContent = 'Password strong enough';
      feedback.style.color = 'green';
    }
  }
});

// As user types, watchers provide instant feedback
form.email = 't';           // Shows as invalid
form.email = 'test@e';      // Still invalid
form.email = 'test@ex.com'; // Shows as valid!

form.password = 'abc';      // "Password too short"
form.password = 'abcd1234'; // "Password strong enough"
```

---

### Example 3: Analytics Tracking

```javascript
const app = Reactive.state({
  currentPage: 'home',
  user: null,
  searchQuery: ''
});

// Track page views
Reactive.watch(app, {
  currentPage(newPage, oldPage) {
    console.log(`Navigation: ${oldPage} → ${newPage}`);
    
    // Send to analytics
    analytics.track('page_view', {
      from: oldPage,
      to: newPage,
      timestamp: new Date()
    });
  },
  
  user(newUser, oldUser) {
    if (newUser && !oldUser) {
      console.log('User logged in:', newUser.name);
      analytics.track('login', { userId: newUser.id });
    } else if (!newUser && oldUser) {
      console.log('User logged out:', oldUser.name);
      analytics.track('logout', { userId: oldUser.id });
    }
  },
  
  searchQuery(newQuery) {
    if (newQuery.length >= 3) {
      analytics.track('search', { query: newQuery });
    }
  }
});

// Changes automatically tracked
app.currentPage = 'products';  // Analytics: page_view
app.user = { id: 123, name: 'John' };  // Analytics: login
app.searchQuery = 'laptop';    // Analytics: search
```

---

### Example 4: Dependent State Updates

```javascript
const weather = Reactive.state({
  temperature: 20,
  unit: 'celsius',
  displayTemperature: '20°C'
});

// Update display when temperature OR unit changes
Reactive.watch(weather, {
  temperature(newTemp) {
    this.updateDisplay();
  },
  
  unit(newUnit) {
    this.updateDisplay();
  }
});

// Helper method to update display
weather.updateDisplay = function() {
  if (this.unit === 'celsius') {
    this.displayTemperature = `${this.temperature}°C`;
  } else {
    const fahrenheit = (this.temperature * 9/5) + 32;
    this.displayTemperature = `${fahrenheit.toFixed(1)}°F`;
  }
};

// Initialize display
weather.updateDisplay();

// Changes trigger updates
weather.temperature = 25;   // Display updates: "25°C"
weather.unit = 'fahrenheit'; // Display updates: "77.0°F"
weather.temperature = 30;    // Display updates: "86.0°F"
```

---

### Example 5: Conditional Actions

```javascript
const inventory = Reactive.state({
  stock: 100,
  lowStockThreshold: 20,
  reorderPoint: 10
});

// Watch stock levels and take action
Reactive.watch(inventory, {
  stock(newStock, oldStock) {
    console.log(`Stock changed: ${oldStock} → ${newStock}`);
    
    // Alert when crossing thresholds
    if (newStock <= this.reorderPoint && oldStock > this.reorderPoint) {
      console.log('🚨 CRITICAL: Stock at reorder point!');
      this.sendReorderEmail();
    } else if (newStock <= this.lowStockThreshold && oldStock > this.lowStockThreshold) {
      console.log('⚠️ WARNING: Low stock!');
      this.sendLowStockAlert();
    } else if (newStock === 0 && oldStock > 0) {
      console.log('❌ OUT OF STOCK!');
      this.sendOutOfStockAlert();
    }
  }
});

inventory.sendLowStockAlert = function() {
  console.log('Sending low stock alert...');
};

inventory.sendReorderEmail = function() {
  console.log('Sending reorder email...');
};

inventory.sendOutOfStockAlert = function() {
  console.log('Sending out of stock alert...');
};

// As stock depletes, watchers trigger alerts
inventory.stock = 19;  // WARNING: Low stock!
inventory.stock = 10;  // CRITICAL: Stock at reorder point!
inventory.stock = 0;   // OUT OF STOCK!
```

---

## Real-World Example: User Preferences Sync

```javascript
const userPreferences = Reactive.state({
  theme: 'light',
  language: 'en',
  fontSize: 16,
  autoSave: true,
  notifications: {
    email: true,
    push: false,
    sms: false
  },
  lastModified: null
});

// Watch all preferences and sync to server
Reactive.watch(userPreferences, {
  theme(newTheme, oldTheme) {
    console.log(`Theme: ${oldTheme} → ${newTheme}`);
    
    // Apply theme immediately
    document.body.className = newTheme + '-theme';
    
    // Save to server
    this.saveToServer('theme', newTheme);
  },
  
  language(newLang, oldLang) {
    console.log(`Language: ${oldLang} → ${newLang}`);
    
    // Load language pack
    loadLanguagePack(newLang).then(() => {
      console.log(`Language pack ${newLang} loaded`);
    });
    
    // Save to server
    this.saveToServer('language', newLang);
  },
  
  fontSize(newSize, oldSize) {
    console.log(`Font size: ${oldSize} → ${newSize}`);
    
    // Apply font size
    document.documentElement.style.fontSize = `${newSize}px`;
    
    // Save to server
    this.saveToServer('fontSize', newSize);
  },
  
  autoSave(enabled) {
    console.log(`Auto-save: ${enabled ? 'enabled' : 'disabled'}`);
    
    if (enabled) {
      this.startAutoSave();
    } else {
      this.stopAutoSave();
    }
    
    this.saveToServer('autoSave', enabled);
  },
  
  notifications(newSettings, oldSettings) {
    console.log('Notification settings changed');
    
    // Compare what changed
    if (newSettings.email !== oldSettings.email) {
      this.updateNotificationChannel('email', newSettings.email);
    }
    if (newSettings.push !== oldSettings.push) {
      this.updateNotificationChannel('push', newSettings.push);
    }
    if (newSettings.sms !== oldSettings.sms) {
      this.updateNotificationChannel('sms', newSettings.sms);
    }
    
    this.saveToServer('notifications', newSettings);
  }
});

// Helper methods
userPreferences.saveToServer = async function(key, value) {
  this.lastModified = new Date();
  
  try {
    await fetch('/api/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value })
    });
    console.log(`✅ Saved ${key} to server`);
  } catch (error) {
    console.error(`❌ Failed to save ${key}:`, error);
  }
};

userPreferences.updateNotificationChannel = function(channel, enabled) {
  console.log(`${channel} notifications ${enabled ? 'enabled' : 'disabled'}`);
};

userPreferences.startAutoSave = function() {
  console.log('Auto-save started');
};

userPreferences.stopAutoSave = function() {
  console.log('Auto-save stopped');
};

// Load language pack function (mock)
async function loadLanguagePack(lang) {
  return new Promise(resolve => setTimeout(resolve, 500));
}

// Now all preference changes automatically sync!
userPreferences.theme = 'dark';        // Applies and saves
userPreferences.fontSize = 18;         // Applies and saves
userPreferences.language = 'es';       // Loads language pack and saves
userPreferences.notifications.push = true;  // Updates and saves
```

---

## Common Beginner Questions

### Q: What's the difference between `watch()` and `effect()`?

**Answer:**

- **`watch()`** = Watch **specific** properties you name
- **`effect()`** = Automatically tracks **all** accessed properties

```javascript
const state = Reactive.state({ count: 0, name: 'John', age: 30 });

// watch - only runs when 'count' changes
Reactive.watch(state, {
  count(newVal, oldVal) {
    console.log('Count:', newVal);
    console.log('Name is:', this.name);  // Access name but doesn't watch it
  }
});

state.name = 'Jane';  // ❌ Watch doesn't run (not watching 'name')
state.count = 5;      // ✅ Watch runs (watching 'count')

// effect - runs when ANY accessed property changes
Reactive.effect(() => {
  console.log('Count:', state.count);
  console.log('Name:', state.name);  // Automatically watches this too!
});

state.name = 'Jane';  // ✅ Effect runs (accessed name in effect)
state.count = 5;      // ✅ Effect runs (accessed count in effect)
```

**Use watch when:** You want to react to ONE specific property
**Use effect when:** You want automatic tracking of ALL dependencies

---

### Q: Can I watch multiple properties at once?

**Answer:** Yes! Define multiple properties in the watch object:

```javascript
Reactive.watch(state, {
  property1(newVal, oldVal) {
    // Runs when property1 changes
  },
  
  property2(newVal, oldVal) {
    // Runs when property2 changes
  },
  
  property3(newVal, oldVal) {
    // Runs when property3 changes
  }
});
```

Each watcher is independent - only runs for its own property.

---

### Q: Can I watch nested properties?

**Answer:** Yes, but use string paths:

```javascript
const state = Reactive.state({
  user: {
    profile: {
      name: 'John'
    }
  }
});

// Watch nested property
state.$watch('user.profile.name', (newVal, oldVal) => {
  console.log(`Name changed from ${oldVal} to ${newVal}`);
});

state.user.profile.name = 'Jane';  // Watcher runs!
```

---

### Q: How do I stop watching?

**Answer:** `watch()` returns a cleanup function:

```javascript
// Start watching
const stopWatching = Reactive.watch(state, {
  count(newVal) {
    console.log('Count:', newVal);
  }
});

state.count = 5;   // Logs "Count: 5"
state.count = 10;  // Logs "Count: 10"

// Stop watching
stopWatching();

state.count = 15;  // Doesn't log (watcher stopped)
```

---

### Q: Does the watcher run immediately when created?

**Answer:** No! Watchers only run when the property changes:

```javascript
const state = Reactive.state({ count: 0 });

Reactive.watch(state, {
  count(newVal) {
    console.log('Count changed:', newVal);
  }
});

// Nothing logged yet!

state.count = 5;  // NOW it logs: "Count changed: 5"
```

Compare to `effect()` which runs immediately:

```javascript
Reactive.effect(() => {
  console.log('Count:', state.count);
  // Logs immediately: "Count: 0"
});
```

---

### Q: Can I watch computed properties?

**Answer:** Yes! Watch any property, including computed:

```javascript
const state = Reactive.state({ firstName: 'John', lastName: 'Doe' });

Reactive.computed(state, {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
});

// Watch the computed property
Reactive.watch(state, {
  fullName(newName, oldName) {
    console.log(`Full name changed from "${oldName}" to "${newName}"`);
  }
});

state.firstName = 'Jane';  // Logs: "Full name changed from "John Doe" to "Jane Doe""
```

---

### Q: Can I access other properties in the watcher?

**Answer:** Yes! Use `this` to access the whole state:

```javascript
Reactive.watch(state, {
  count(newCount, oldCount) {
    // Access other properties via 'this'
    console.log('Count:', newCount);
    console.log('Name:', this.name);
    console.log('Total:', this.count + this.otherValue);
  }
});
```

**Important:** Accessing other properties doesn't watch them!

---

## Tips for Beginners

### 1. Use Watch for Specific Reactions

Watch is perfect when you care about ONE specific property:

```javascript
// ✅ Good - specific property monitoring
Reactive.watch(state, {
  username(newName) {
    // Only care about username changes
    validateUsername(newName);
  }
});

// ❌ Overkill - using effect when you only care about one thing
Reactive.effect(() => {
  validateUsername(state.username);
  // Might re-run when other things change too
});
```

---

### 2. Use Old Value for Comparisons

The old value is useful for conditional logic:

```javascript
Reactive.watch(inventory, {
  stock(newStock, oldStock) {
    // Only alert when going down
    if (newStock < oldStock) {
      console.log('Stock decreased!');
    }
    
    // Only alert when crossing threshold
    if (newStock <= 10 && oldStock > 10) {
      console.log('Low stock alert!');
    }
  }
});
```

---

### 3. Keep Watchers Focused

One watcher should do one thing:

```javascript
// ❌ Watcher doing too much
Reactive.watch(state, {
  theme(newTheme) {
    applyTheme(newTheme);
    saveToLocalStorage(newTheme);
    sendToAnalytics(newTheme);
    updateUserPreferences(newTheme);
    notifyOtherComponents(newTheme);
    // Too much!
  }
});

// ✅ Break into separate concerns
Reactive.watch(state, {
  theme(newTheme) {
    applyTheme(newTheme);
  }
});

Reactive.watch(state, {
  theme(newTheme) {
    saveToLocalStorage('theme', newTheme);
  }
});
```

---

### 4. Use for Side Effects

Watchers are perfect for side effects when a specific property changes:

```javascript
Reactive.watch(state, {
  // Save to localStorage
  preferences(newPrefs) {
    localStorage.setItem('prefs', JSON.stringify(newPrefs));
  },
  
  // Send analytics
  currentPage(newPage) {
    analytics.track('page_view', { page: newPage });
  },
  
  // Make API call
  searchQuery(query) {
    if (query.length >= 3) {
      fetchSearchResults(query);
    }
  }
});
```

---

### 5. Watch vs Computed

Choose the right tool:

```javascript
// Use COMPUTED for derived values
Reactive.computed(state, {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
});
console.log(state.fullName);  // Get calculated value

// Use WATCH for side effects
Reactive.watch(state, {
  firstName(newName) {
    console.log('Name changed!');  // Do something
    saveToDatabase(newName);       // Side effect
  }
});
```

---

## Summary

### What `watch()` Does:

1. ✅ Watches specific named properties
2. ✅ Runs callback when those properties change
3. ✅ Provides new and old values
4. ✅ Only triggers for watched properties
5. ✅ Returns cleanup function to stop watching
6. ✅ Does NOT run immediately (only on changes)

### When to Use It:

- React to specific property changes
- Need both old and new values
- Side effects (save, log, API calls)
- Want targeted, not automatic tracking
- Monitoring thresholds or transitions
- Syncing data to external systems

### The Basic Pattern:

```javascript
const cleanup = Reactive.watch(state, {
  propertyName(newValue, oldValue) {
    // React to change
    console.log(`Changed from ${oldValue} to ${newValue}`);
    
    // Access other properties
    console.log('Other data:', this.otherProperty);
    
    // Perform side effects
    saveToDatabase(newValue);
  }
});

// Stop watching when done
cleanup();
```

**Remember:** `watch()` is your targeted observer - point it at specific properties you care about, and it alerts you when they change. Perfect for focused reactions and side effects! 🎉