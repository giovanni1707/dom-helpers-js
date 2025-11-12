# Advanced Operations

Complete documentation for advanced storage operations in the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Methods Reference](#methods-reference)
   - [increment()](#increment)
   - [decrement()](#decrement)
   - [toggle()](#toggle)
3. [Use Cases](#use-cases)
4. [Examples](#examples)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)

---

## Overview

Advanced operations provide convenient methods for working with numeric and boolean values in storage. Instead of manually getting, modifying, and setting values, these methods handle the entire operation in a single call.

**Key Benefits:**
- ⚡ **Simpler code** - One method call instead of three
- 🔒 **Atomic-like** - Get, modify, and set in one operation
- 🛡️ **Auto-initialization** - Handles missing keys gracefully
- 🎯 **Type-safe** - Designed for specific data types
- 📊 **Perfect for counters** - Ideal for analytics and tracking

---

## Methods Reference

### increment()

Increment a numeric value in storage.

#### Syntax

```javascript
storage.increment(key, amount)
```

#### Parameters

- **`key`** (string, required): The storage key
- **`amount`** (number, optional): Amount to increment by
  - Default: `1`
  - Can be positive or negative
  - Can include decimals

#### Returns

**`number`** - The new value after incrementing

#### Behavior

- If key doesn't exist, initializes to `0` then increments
- If key exists but isn't a number, treats as `0` then increments
- Returns the new value immediately

#### Examples

```javascript
// Basic increment
Storage.set('counter', 5);
Storage.increment('counter');      // Returns 6
Storage.increment('counter');      // Returns 7

// Custom increment amount
Storage.increment('score', 10);    // Returns 17
Storage.increment('score', 5);     // Returns 22

// Auto-initialization
Storage.increment('newCounter');   // Returns 1 (initialized from 0)

// Negative increment (same as decrement)
Storage.increment('lives', -1);    // Decreases by 1

// Decimal increment
Storage.increment('rating', 0.5);  // Returns 22.5
```

---

### decrement()

Decrement a numeric value in storage.

#### Syntax

```javascript
storage.decrement(key, amount)
```

#### Parameters

- **`key`** (string, required): The storage key
- **`amount`** (number, optional): Amount to decrement by
  - Default: `1`
  - Positive number (subtracted from current value)
  - Can include decimals

#### Returns

**`number`** - The new value after decrementing

#### Behavior

- If key doesn't exist, initializes to `0` then decrements
- If key exists but isn't a number, treats as `0` then decrements
- Returns the new value immediately
- Equivalent to `increment(key, -amount)`

#### Examples

```javascript
// Basic decrement
Storage.set('lives', 3);
Storage.decrement('lives');        // Returns 2
Storage.decrement('lives');        // Returns 1

// Custom decrement amount
Storage.set('stock', 100);
Storage.decrement('stock', 25);    // Returns 75
Storage.decrement('stock', 30);    // Returns 45

// Auto-initialization (results in negative)
Storage.decrement('newCounter');   // Returns -1 (initialized from 0)

// Decimal decrement
Storage.set('balance', 100.50);
Storage.decrement('balance', 10.25); // Returns 90.25
```

---

### toggle()

Toggle a boolean value in storage.

#### Syntax

```javascript
storage.toggle(key)
```

#### Parameters

- **`key`** (string, required): The storage key

#### Returns

**`boolean`** - The new toggled value

#### Behavior

- If key doesn't exist, initializes to `false` then toggles to `true`
- `true` becomes `false`
- `false` becomes `true`
- Non-boolean values are treated as falsy and become `true`
- Returns the new value immediately

#### Examples

```javascript
// Basic toggle
Storage.set('darkMode', false);
Storage.toggle('darkMode');        // Returns true
Storage.toggle('darkMode');        // Returns false

// Auto-initialization
Storage.toggle('newFlag');         // Returns true (initialized as false, then toggled)

// Toggle repeatedly
Storage.set('enabled', true);
Storage.toggle('enabled');         // false
Storage.toggle('enabled');         // true
Storage.toggle('enabled');         // false

// Works with truthy/falsy values
Storage.set('setting', 0);
Storage.toggle('setting');         // Returns true (0 is falsy)
```

---

## Use Cases

### 1. Page View Counter

```javascript
// Track page views
function trackPageView() {
  const views = Storage.increment('pageViews');
  console.log(`Page viewed ${views} times`);
}

// Call on each page load
trackPageView();
```

### 2. Login Attempts Tracker

```javascript
function handleFailedLogin() {
  const attempts = Storage.increment('loginAttempts');
  
  if (attempts >= 3) {
    lockAccount();
    Storage.set('accountLocked', true);
  }
  
  return attempts;
}

function handleSuccessfulLogin() {
  // Reset attempts on success
  Storage.set('loginAttempts', 0);
}
```

### 3. Shopping Cart Quantity

```javascript
function addToCart(productId) {
  const quantity = Storage.increment(`cart:${productId}`);
  updateCartUI(productId, quantity);
  return quantity;
}

function removeFromCart(productId) {
  const quantity = Storage.decrement(`cart:${productId}`);
  
  if (quantity <= 0) {
    Storage.remove(`cart:${productId}`);
    return 0;
  }
  
  updateCartUI(productId, quantity);
  return quantity;
}
```

### 4. Feature Toggle

```javascript
// Toggle dark mode
function toggleDarkMode() {
  const isDark = Storage.toggle('darkMode');
  document.body.classList.toggle('dark-mode', isDark);
  return isDark;
}

// Toggle notifications
function toggleNotifications() {
  const enabled = Storage.toggle('notificationsEnabled');
  
  if (enabled) {
    enableNotifications();
  } else {
    disableNotifications();
  }
  
  return enabled;
}
```

### 5. Game Score System

```javascript
class GameScore {
  addPoints(points) {
    return Storage.increment('gameScore', points);
  }
  
  subtractPoints(points) {
    return Storage.decrement('gameScore', points);
  }
  
  getScore() {
    return Storage.get('gameScore', 0);
  }
  
  resetScore() {
    Storage.set('gameScore', 0);
  }
  
  addLife() {
    return Storage.increment('lives');
  }
  
  loseLife() {
    const lives = Storage.decrement('lives');
    
    if (lives <= 0) {
      this.gameOver();
    }
    
    return lives;
  }
  
  gameOver() {
    const finalScore = this.getScore();
    alert(`Game Over! Final Score: ${finalScore}`);
    this.resetScore();
  }
}
```

---

## Examples

### Example 1: Analytics Dashboard

```javascript
class Analytics {
  constructor() {
    this.storage = Storage.namespace('analytics');
  }
  
  // Track events
  trackPageView() {
    this.storage.increment('pageViews');
    this.storage.set('lastView', new Date());
  }
  
  trackClick(elementId) {
    this.storage.increment(`clicks:${elementId}`);
  }
  
  trackError() {
    this.storage.increment('errors');
  }
  
  // Get statistics
  getStats() {
    return {
      pageViews: this.storage.get('pageViews', 0),
      errors: this.storage.get('errors', 0),
      lastView: this.storage.get('lastView')
    };
  }
  
  // Reset statistics
  reset() {
    this.storage.clear();
  }
}

// Usage
const analytics = new Analytics();

// Track events
analytics.trackPageView();
analytics.trackClick('buy-button');
analytics.trackClick('buy-button');
analytics.trackClick('share-button');

// Get stats
const stats = analytics.getStats();
console.log(`${stats.pageViews} page views`);
console.log(`Last viewed: ${stats.lastView}`);
```

### Example 2: Inventory Management

```javascript
class Inventory {
  constructor() {
    this.storage = Storage.namespace('inventory');
  }
  
  // Add stock
  addStock(productId, quantity = 1) {
    const newStock = this.storage.increment(productId, quantity);
    console.log(`${productId}: ${newStock} in stock`);
    return newStock;
  }
  
  // Remove stock
  removeStock(productId, quantity = 1) {
    const newStock = this.storage.decrement(productId, quantity);
    
    if (newStock < 0) {
      this.storage.set(productId, 0);
      return 0;
    }
    
    if (newStock < 10) {
      this.sendLowStockAlert(productId, newStock);
    }
    
    return newStock;
  }
  
  // Get current stock
  getStock(productId) {
    return this.storage.get(productId, 0);
  }
  
  // Check if in stock
  isInStock(productId, quantity = 1) {
    return this.getStock(productId) >= quantity;
  }
  
  // Low stock alert
  sendLowStockAlert(productId, currentStock) {
    console.warn(`⚠️ Low stock alert: ${productId} (${currentStock} remaining)`);
  }
  
  // Restock
  restock(productId, quantity) {
    return this.addStock(productId, quantity);
  }
}

// Usage
const inventory = new Inventory();

// Initial stock
inventory.addStock('LAPTOP-001', 50);
inventory.addStock('MOUSE-001', 200);

// Sale
if (inventory.isInStock('LAPTOP-001', 1)) {
  inventory.removeStock('LAPTOP-001', 1);
  console.log('Sale completed');
}

// Restock
inventory.restock('LAPTOP-001', 25);

// Check stock
console.log('Laptops in stock:', inventory.getStock('LAPTOP-001'));
```

### Example 3: User Preferences Manager

```javascript
class PreferencesManager {
  constructor() {
    this.storage = Storage.namespace('preferences');
  }
  
  // Toggle preferences
  toggleDarkMode() {
    const isDark = this.storage.toggle('darkMode');
    this.applyTheme(isDark);
    return isDark;
  }
  
  toggleNotifications() {
    const enabled = this.storage.toggle('notifications');
    this.updateNotificationSettings(enabled);
    return enabled;
  }
  
  toggleAutoSave() {
    const enabled = this.storage.toggle('autoSave');
    this.configureAutoSave(enabled);
    return enabled;
  }
  
  toggleCompactMode() {
    const enabled = this.storage.toggle('compactMode');
    document.body.classList.toggle('compact', enabled);
    return enabled;
  }
  
  // Font size management
  increaseFontSize() {
    const newSize = this.storage.increment('fontSize', 2);
    const maxSize = 24;
    
    if (newSize > maxSize) {
      this.storage.set('fontSize', maxSize);
      return maxSize;
    }
    
    this.applyFontSize(newSize);
    return newSize;
  }
  
  decreaseFontSize() {
    const newSize = this.storage.decrement('fontSize', 2);
    const minSize = 10;
    
    if (newSize < minSize) {
      this.storage.set('fontSize', minSize);
      return minSize;
    }
    
    this.applyFontSize(newSize);
    return newSize;
  }
  
  resetFontSize() {
    const defaultSize = 14;
    this.storage.set('fontSize', defaultSize);
    this.applyFontSize(defaultSize);
    return defaultSize;
  }
  
  // Get all preferences
  getAll() {
    return {
      darkMode: this.storage.get('darkMode', false),
      notifications: this.storage.get('notifications', true),
      autoSave: this.storage.get('autoSave', true),
      compactMode: this.storage.get('compactMode', false),
      fontSize: this.storage.get('fontSize', 14)
    };
  }
  
  // Apply methods (placeholder)
  applyTheme(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
  }
  
  applyFontSize(size) {
    document.documentElement.style.fontSize = `${size}px`;
  }
  
  updateNotificationSettings(enabled) {
    console.log(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  configureAutoSave(enabled) {
    console.log(`Auto-save ${enabled ? 'enabled' : 'disabled'}`);
  }
}

// Usage
const prefs = new PreferencesManager();

// Toggle settings
document.getElementById('darkModeToggle').onclick = () => {
  const isDark = prefs.toggleDarkMode();
  console.log(`Dark mode: ${isDark ? 'ON' : 'OFF'}`);
};

document.getElementById('notificationsToggle').onclick = () => {
  const enabled = prefs.toggleNotifications();
  console.log(`Notifications: ${enabled ? 'ON' : 'OFF'}`);
};

// Font size controls
document.getElementById('fontIncrease').onclick = () => {
  const size = prefs.increaseFontSize();
  console.log(`Font size: ${size}px`);
};

document.getElementById('fontDecrease').onclick = () => {
  const size = prefs.decreaseFontSize();
  console.log(`Font size: ${size}px`);
};

document.getElementById('fontReset').onclick = () => {
  prefs.resetFontSize();
};
```

### Example 4: Rate Limiter

```javascript
class RateLimiter {
  constructor(maxAttempts = 5, resetTime = 300) {
    this.storage = Storage.namespace('rateLimit');
    this.maxAttempts = maxAttempts;
    this.resetTime = resetTime; // seconds
  }
  
  // Check if action is allowed
  canPerformAction(action) {
    const attempts = this.storage.get(action, 0);
    return attempts < this.maxAttempts;
  }
  
  // Record an attempt
  recordAttempt(action) {
    const attempts = this.storage.increment(action);
    
    // Set expiry on first attempt
    if (attempts === 1) {
      this.storage.set(action, attempts, { expires: this.resetTime });
    }
    
    if (attempts >= this.maxAttempts) {
      this.handleRateLimitExceeded(action);
    }
    
    return {
      attempts,
      remaining: Math.max(0, this.maxAttempts - attempts),
      isLimited: attempts >= this.maxAttempts
    };
  }
  
  // Get remaining attempts
  getRemainingAttempts(action) {
    const attempts = this.storage.get(action, 0);
    return Math.max(0, this.maxAttempts - attempts);
  }
  
  // Reset rate limit for action
  reset(action) {
    this.storage.remove(action);
  }
  
  // Handle rate limit exceeded
  handleRateLimitExceeded(action) {
    console.warn(`⚠️ Rate limit exceeded for: ${action}`);
  }
}

// Usage
const limiter = new RateLimiter(3, 60); // 3 attempts per 60 seconds

function performSearch(query) {
  if (!limiter.canPerformAction('search')) {
    const remaining = limiter.getRemainingAttempts('search');
    alert('Too many searches. Please wait before trying again.');
    return;
  }
  
  const result = limiter.recordAttempt('search');
  console.log(`Search performed. ${result.remaining} attempts remaining.`);
  
  // Perform actual search
  executeSearch(query);
}

function executeSearch(query) {
  console.log(`Searching for: ${query}`);
}
```

### Example 5: Notification Badge Counter

```javascript
class NotificationBadge {
  constructor(badgeElement) {
    this.badge = badgeElement;
    this.storage = Storage.namespace('notifications');
  }
  
  // Add notification
  addNotification() {
    const count = this.storage.increment('unreadCount');
    this.updateBadge(count);
    return count;
  }
  
  // Add multiple notifications
  addMultiple(amount) {
    const count = this.storage.increment('unreadCount', amount);
    this.updateBadge(count);
    return count;
  }
  
  // Mark one as read
  markAsRead() {
    const count = this.storage.decrement('unreadCount');
    const finalCount = Math.max(0, count);
    this.storage.set('unreadCount', finalCount);
    this.updateBadge(finalCount);
    return finalCount;
  }
  
  // Mark all as read
  markAllAsRead() {
    this.storage.set('unreadCount', 0);
    this.updateBadge(0);
  }
  
  // Get count
  getCount() {
    return this.storage.get('unreadCount', 0);
  }
  
  // Update badge UI
  updateBadge(count) {
    if (count > 0) {
      this.badge.textContent = count > 99 ? '99+' : count;
      this.badge.style.display = 'inline-block';
    } else {
      this.badge.style.display = 'none';
    }
  }
  
  // Initialize
  init() {
    const count = this.getCount();
    this.updateBadge(count);
  }
}

// Usage
const badge = new NotificationBadge(document.getElementById('notificationBadge'));
badge.init();

// Simulate receiving notifications
function receiveNotification() {
  const count = badge.addNotification();
  console.log(`New notification! Total: ${count}`);
}

// Mark notification as read
function readNotification() {
  const remaining = badge.markAsRead();
  console.log(`Notification read. Remaining: ${remaining}`);
}

// Clear all
document.getElementById('clearAll').onclick = () => {
  badge.markAllAsRead();
};
```

---

## Best Practices

### 1. Initialize with Defaults

```javascript
// Good: Set initial value explicitly
Storage.set('counter', 0);
Storage.increment('counter'); // 1

// Also works: Auto-initialization
Storage.increment('newCounter'); // 1 (auto-initialized from 0)
```

### 2. Validate Bounds

```javascript
// Good: Check limits
function incrementWithLimit(key, amount, max) {
  const current = Storage.get(key, 0);
  
  if (current + amount > max) {
    Storage.set(key, max);
    return max;
  }
  
  return Storage.increment(key, amount);
}

// Usage
incrementWithLimit('volume', 10, 100); // Won't exceed 100
```

### 3. Use Meaningful Keys

```javascript
// Good: Clear and descriptive
Storage.increment('pageViews');
Storage.increment('cartItems');
Storage.toggle('darkModeEnabled');

// Avoid: Vague names
Storage.increment('count');
Storage.toggle('flag');
```

### 4. Combine with Namespaces

```javascript
// Good: Organized with namespaces
const analytics = Storage.namespace('analytics');
analytics.increment('pageViews');
analytics.increment('uniqueVisitors');

const game = Storage.namespace('game');
game.increment('score', 100);
game.decrement('lives');
```

### 5. Handle Edge Cases

```javascript
// Good: Prevent negative values where needed
function decrementWithFloor(key, amount, min = 0) {
  const newValue = Storage.decrement(key, amount);
  
  if (newValue < min) {
    Storage.set(key, min);
    return min;
  }
  
  return newValue;
}

// Good: Handle toggle state changes
function toggleWithCallback(key, onEnable, onDisable) {
  const newState = Storage.toggle(key);
  
  if (newState) {
    onEnable();
  } else {
    onDisable();
  }
  
  return newState;
}
```

### 6. Use Return Values

```javascript
// Good: Use the returned value
const newScore = Storage.increment('score', 10);
if (newScore >= 1000) {
  unlockAchievement('high-scorer');
}

const lives = Storage.decrement('lives');
if (lives <= 0) {
  gameOver();
}

const isDark = Storage.toggle('darkMode');
updateThemeIcon(isDark);
```

---

## Common Patterns

### Pattern 1: Counter with Reset

```javascript
class Counter {
  constructor(key, namespace = '') {
    this.storage = namespace ? 
      Storage.namespace(namespace) : 
      Storage;
    this.key = key;
  }
  
  increment(amount = 1) {
    return this.storage.increment(this.key, amount);
  }
  
  decrement(amount = 1) {
    return this.storage.decrement(this.key, amount);
  }
  
  get() {
    return this.storage.get(this.key, 0);
  }
  
  reset() {
    this.storage.set(this.key, 0);
  }
  
  set(value) {
    this.storage.set(this.key, value);
  }
}

// Usage
const pageViews = new Counter('views', 'analytics');
pageViews.increment();
console.log(pageViews.get()); // Get current count
pageViews.reset(); // Reset to 0
```

### Pattern 2: Boolean Flag Manager

```javascript
class FeatureFlags {
  constructor() {
    this.storage = Storage.namespace('features');
  }
  
  toggle(feature) {
    return this.storage.toggle(feature);
  }
  
  enable(feature) {
    this.storage.set(feature, true);
  }
  
  disable(feature) {
    this.storage.set(feature, false);
  }
  
  isEnabled(feature) {
    return this.storage.get(feature, false);
  }
  
  getAll() {
    const keys = this.storage.keys();
    const flags = {};
    keys.forEach(key => {
      flags[key] = this.storage.get(key);
    });
    return flags;
  }
}
```

### Pattern 3: Limited Resource Manager

```javascript
class ResourceManager {
  constructor(resourceName, max) {
    this.storage = Storage.namespace('resources');
    this.key = resourceName;
    this.max = max;
    
    // Initialize if not set
    if (!this.storage.has(this.key)) {
      this.storage.set(this.key, max);
    }
  }
  
  consume(amount = 1) {
    const current = this.storage.get(this.key, 0);
    
    if (current < amount) {
      return false; // Not enough resources
    }
    
    this.storage.decrement(this.key, amount);
    return true;
  }
  
  restore(amount = 1) {
    const newAmount = this.storage.increment(this.key, amount);
    
    if (newAmount > this.max) {
      this.storage.set(this.key, this.max);
      return this.max;
    }
    
    return newAmount;
  }
  
  getCurrent() {
    return this.storage.get(this.key, 0);
  }
  
  getMax() {
    return this.max;
  }
  
  getPercentage() {
    return Math.round((this.getCurrent() / this.max) * 100);
  }
  
  isFull() {
    return this.getCurrent() >= this.max;
  }
  
  isEmpty() {
    return this.getCurrent() <= 0;
  }
  
  refill() {
    this.storage.set(this.key, this.max);
  }
}

// Usage
const energy = new ResourceManager('energy', 100);
const credits = new ResourceManager('credits', 1000);

if (energy.consume(20)) {
  console.log('Action performed');
} else {
  console.log('Not enough energy');
}

energy.restore(10);
console.log(`Energy: ${energy.getPercentage()}%`);
```

---

## Summary

**Quick Reference:**

| Method | Purpose | Example |
|--------|---------|---------|
| `increment(key, amount)` | Add to number | `Storage.increment('score', 10)` |
| `decrement(key, amount)` | Subtract from number | `Storage.decrement('lives', 1)` |
| `toggle(key)` | Switch boolean | `Storage.toggle('darkMode')` |

**Key Points:**

✅ **One-line operations** for common tasks  
✅ **Auto-initialization** handles missing keys  
✅ **Return values** for immediate use  
✅ **Type-specific** for numbers and booleans  
✅ **Perfect for counters** and feature flags  

**Common Uses:**

- 📊 Analytics and tracking
- 🎮 Game scores and lives
- 🛒 Shopping cart quantities
- 🔔 Notification counters
- ⚙️ Feature toggles
- 🚦 Rate limiting
- 📈 Progress tracking

**Remember:**

- Use `increment()` for adding (counters, scores, views)
- Use `decrement()` for subtracting (lives, stock, attempts)
- Use `toggle()` for on/off states (dark mode, notifications)
- Combine with namespaces for better organization
- Validate bounds when needed (min/max limits)

These methods make working with numeric and boolean storage values simple and intuitive!