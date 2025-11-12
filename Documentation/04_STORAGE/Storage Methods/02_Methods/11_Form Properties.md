# Set Options Properties

Complete documentation for options available when storing data with the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Options Reference](#options-reference)
   - [expires](#expires)
3. [How Expiry Works](#how-expiry-works)
4. [Use Cases](#use-cases)
5. [Examples](#examples)
6. [Best Practices](#best-practices)
7. [Advanced Patterns](#advanced-patterns)

---

## Overview

When storing data using `set()` or `setItem()`, you can pass an options object as the third parameter to control how the data is stored. Currently, the primary option is `expires`, which allows you to set automatic expiration for stored values.

**Key Benefits:**
- ⏰ **Automatic expiration** - Data automatically becomes invalid after set time
- 🧹 **Self-cleaning** - Expired items are removed on access
- 💾 **Storage efficiency** - Prevents accumulation of stale data
- 🔒 **Security** - Sensitive data expires automatically
- 🎯 **Flexible timing** - Use seconds or specific dates

---

## Options Reference

### expires

Set an expiration time for stored data.

#### Syntax

```javascript
storage.set(key, value, { expires: expiryTime })
storage.setItem(key, value, { expires: expiryTime })
```

#### Type

**`number | Date`**

- **`number`**: Expiry time in **seconds** from now
- **`Date`**: Specific expiration date/time

#### Behavior

**With `number` (seconds):**
- Calculates expiry as: `Date.now() + (expires * 1000)`
- Value expires after the specified number of seconds
- Example: `expires: 3600` = expires in 1 hour

**With `Date` object:**
- Uses the exact date/time specified
- Value expires at that specific moment
- Example: `expires: new Date('2025-12-31')` = expires on Dec 31, 2025

**After Expiration:**
- `get()` returns `null` (or default value)
- `has()` returns `false`
- Item is automatically removed from storage
- `keys()`, `values()`, `entries()` skip expired items
- `cleanup()` removes expired items

#### Default

No expiration (data persists until manually removed)

#### Examples

```javascript
// Expire in 60 seconds (1 minute)
Storage.set('token', 'abc123', { expires: 60 });

// Expire in 1 hour (3600 seconds)
Storage.set('session', { id: 123 }, { expires: 3600 });

// Expire in 24 hours (86400 seconds)
Storage.set('cache', data, { expires: 86400 });

// Expire in 7 days (604800 seconds)
Storage.set('draft', content, { expires: 604800 });

// Expire at specific date/time
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
Storage.set('promo', 'SAVE20', { expires: tomorrow });

// Expire at midnight
const midnight = new Date();
midnight.setHours(24, 0, 0, 0);
Storage.set('dailyOffer', offer, { expires: midnight });

// Expire on New Year's Eve
const newYearEve = new Date('2025-12-31T23:59:59');
Storage.set('yearEndSale', true, { expires: newYearEve });
```

---

## How Expiry Works

### Internal Storage Format

When you store data with expiry, it's serialized with metadata:

```javascript
// What you store
Storage.set('token', 'abc123', { expires: 3600 });

// What's actually stored in localStorage
{
  "value": "abc123",
  "type": "string",
  "timestamp": 1699564800000,
  "expires": 1699568400000  // timestamp + 3600 seconds
}
```

### Expiry Checking Flow

```
User calls: Storage.get('token')
        ↓
Retrieve raw data from localStorage
        ↓
Deserialize JSON data
        ↓
Check if 'expires' field exists
        ↓
    YES                          NO
     ↓                            ↓
Compare Date.now() vs expires    Return value
     ↓
Is Date.now() > expires?
     ↓
  YES              NO
   ↓                ↓
Remove item      Return value
Return null
```

### Automatic Cleanup

```javascript
// Set item with 10 second expiry
Storage.set('temp', 'value', { expires: 10 });

// Immediately after
Storage.get('temp'); // 'value'
Storage.has('temp'); // true

// After 5 seconds
Storage.get('temp'); // 'value' (still valid)
Storage.has('temp'); // true

// After 11 seconds
Storage.get('temp'); // null (expired and removed)
Storage.has('temp'); // false (expired and removed)

// Item is automatically removed from localStorage
```

---

## Use Cases

### 1. Authentication Tokens

```javascript
// Token expires in 1 hour
function saveAuthToken(token) {
  Storage.set('authToken', token, { expires: 3600 });
  Storage.set('tokenCreatedAt', Date.now());
}

function getAuthToken() {
  const token = Storage.get('authToken');
  
  if (!token) {
    console.log('Token expired or not found');
    redirectToLogin();
    return null;
  }
  
  return token;
}

// Usage
saveAuthToken('jwt-token-here');

// Auto-expires after 1 hour
setTimeout(() => {
  const token = getAuthToken(); // null - redirects to login
}, 3601000);
```

### 2. Session Data

```javascript
// Session expires after 30 minutes of inactivity
const SESSION_TIMEOUT = 1800; // 30 minutes

function updateSession(data) {
  Storage.session.set('userSession', data, { 
    expires: SESSION_TIMEOUT 
  });
}

function getSession() {
  return Storage.session.get('userSession');
}

// Extend session on activity
document.addEventListener('click', () => {
  const session = getSession();
  if (session) {
    updateSession(session); // Resets expiry timer
  }
});
```

### 3. Cache with TTL

```javascript
// Cache API responses with time-to-live
function cacheAPIResponse(endpoint, data, ttl = 600) {
  const cacheKey = `api:${endpoint}`;
  Storage.set(cacheKey, data, { expires: ttl });
}

async function fetchWithCache(endpoint, ttl = 600) {
  const cacheKey = `api:${endpoint}`;
  
  // Check cache first
  const cached = Storage.get(cacheKey);
  if (cached) {
    console.log('Cache hit');
    return cached;
  }
  
  // Fetch from API
  console.log('Cache miss - fetching from API');
  const response = await fetch(endpoint);
  const data = await response.json();
  
  // Cache for next time
  cacheAPIResponse(endpoint, data, ttl);
  
  return data;
}

// Usage
const users = await fetchWithCache('/api/users', 300); // Cache 5 minutes
```

### 4. Flash Messages

```javascript
// Message expires after being shown once or after timeout
function showFlashMessage(message, type = 'info') {
  Storage.session.set('flashMessage', {
    message,
    type,
    timestamp: Date.now()
  }, { expires: 30 }); // Expires in 30 seconds
}

function getFlashMessage() {
  const flash = Storage.session.get('flashMessage');
  
  if (flash) {
    // Remove after retrieving (one-time display)
    Storage.session.remove('flashMessage');
    return flash;
  }
  
  return null;
}

// Usage
showFlashMessage('Account created successfully!', 'success');

// On next page load
const flash = getFlashMessage();
if (flash) {
  displayNotification(flash.message, flash.type);
}
```

### 5. Temporary Downloads

```javascript
// Store download link temporarily
function generateDownloadLink(fileId) {
  const link = `/download/${fileId}?token=${generateToken()}`;
  
  // Link expires in 5 minutes
  Storage.set(`download:${fileId}`, link, { expires: 300 });
  
  return link;
}

function getDownloadLink(fileId) {
  const link = Storage.get(`download:${fileId}`);
  
  if (!link) {
    throw new Error('Download link expired. Please request a new one.');
  }
  
  return link;
}

// Usage
const link = generateDownloadLink('file123');
console.log('Download available for 5 minutes:', link);
```

---

## Examples

### Example 1: Rate Limiting

```javascript
class RateLimiter {
  constructor(maxAttempts = 5, windowSeconds = 60) {
    this.maxAttempts = maxAttempts;
    this.windowSeconds = windowSeconds;
    this.storage = Storage.namespace('rateLimit');
  }
  
  canAttempt(action) {
    const attempts = this.storage.get(action, 0);
    return attempts < this.maxAttempts;
  }
  
  recordAttempt(action) {
    const attempts = this.storage.get(action, 0);
    
    if (attempts === 0) {
      // First attempt - set with expiry
      this.storage.set(action, 1, { expires: this.windowSeconds });
    } else {
      // Increment existing (keeps original expiry)
      this.storage.increment(action);
    }
    
    return this.getRemainingAttempts(action);
  }
  
  getRemainingAttempts(action) {
    const attempts = this.storage.get(action, 0);
    return Math.max(0, this.maxAttempts - attempts);
  }
  
  reset(action) {
    this.storage.remove(action);
  }
}

// Usage
const limiter = new RateLimiter(3, 60); // 3 attempts per 60 seconds

function attemptLogin(username, password) {
  const action = `login:${username}`;
  
  if (!limiter.canAttempt(action)) {
    alert('Too many login attempts. Please try again later.');
    return false;
  }
  
  const success = performLogin(username, password);
  
  if (!success) {
    const remaining = limiter.recordAttempt(action);
    alert(`Login failed. ${remaining} attempts remaining.`);
  } else {
    limiter.reset(action);
  }
  
  return success;
}
```

### Example 2: Countdown Timer Storage

```javascript
class CountdownStorage {
  constructor(key, durationSeconds) {
    this.key = key;
    this.duration = durationSeconds;
  }
  
  start() {
    const endTime = new Date(Date.now() + this.duration * 1000);
    Storage.set(this.key, endTime.getTime(), { expires: this.duration });
  }
  
  getTimeRemaining() {
    const endTime = Storage.get(this.key);
    
    if (!endTime) {
      return 0; // Expired or not started
    }
    
    const remaining = endTime - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
  }
  
  isActive() {
    return Storage.has(this.key);
  }
  
  cancel() {
    Storage.remove(this.key);
  }
  
  format() {
    const seconds = this.getTimeRemaining();
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

// Usage - Email verification countdown
const verificationTimer = new CountdownStorage('emailVerification', 300);

function sendVerificationEmail() {
  if (verificationTimer.isActive()) {
    const remaining = verificationTimer.format();
    alert(`Please wait ${remaining} before requesting another email.`);
    return;
  }
  
  // Send email
  sendEmail();
  
  // Start countdown
  verificationTimer.start();
  
  // Update UI
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const display = document.getElementById('timerDisplay');
  
  const interval = setInterval(() => {
    if (!verificationTimer.isActive()) {
      clearInterval(interval);
      display.textContent = 'You can request a new email';
      return;
    }
    
    display.textContent = `Resend available in ${verificationTimer.format()}`;
  }, 1000);
}
```

### Example 3: Daily Limits

```javascript
class DailyLimitManager {
  constructor(limitKey, maxLimit) {
    this.limitKey = limitKey;
    this.maxLimit = maxLimit;
    this.storage = Storage.namespace('dailyLimits');
  }
  
  canPerformAction() {
    const count = this.storage.get(this.limitKey, 0);
    return count < this.maxLimit;
  }
  
  performAction() {
    if (!this.canPerformAction()) {
      throw new Error('Daily limit reached');
    }
    
    const count = this.storage.get(this.limitKey, 0);
    
    if (count === 0) {
      // First action of the day - expires at midnight
      const midnight = this.getNextMidnight();
      const secondsUntilMidnight = Math.floor((midnight - Date.now()) / 1000);
      
      this.storage.set(this.limitKey, 1, { 
        expires: secondsUntilMidnight 
      });
    } else {
      // Increment count
      this.storage.increment(this.limitKey);
    }
    
    return this.getRemainingActions();
  }
  
  getRemainingActions() {
    const count = this.storage.get(this.limitKey, 0);
    return Math.max(0, this.maxLimit - count);
  }
  
  getNextMidnight() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }
  
  reset() {
    this.storage.remove(this.limitKey);
  }
}

// Usage - Daily free downloads
const downloadLimit = new DailyLimitManager('downloads', 5);

function downloadFile(fileId) {
  if (!downloadLimit.canPerformAction()) {
    alert('Daily download limit reached. Upgrade to premium for unlimited downloads!');
    return;
  }
  
  // Perform download
  initiateDownload(fileId);
  
  // Track usage
  const remaining = downloadLimit.performAction();
  console.log(`${remaining} downloads remaining today`);
}
```

### Example 4: Temporary Feature Flag

```javascript
class TemporaryFeatureFlag {
  constructor(flagName) {
    this.flagName = flagName;
    this.storage = Storage.namespace('features:temp');
  }
  
  enable(durationSeconds) {
    this.storage.set(this.flagName, true, { 
      expires: durationSeconds 
    });
    console.log(`Feature "${this.flagName}" enabled for ${durationSeconds}s`);
  }
  
  enableUntil(date) {
    const secondsUntil = Math.floor((date.getTime() - Date.now()) / 1000);
    this.storage.set(this.flagName, true, { 
      expires: secondsUntil 
    });
    console.log(`Feature "${this.flagName}" enabled until ${date}`);
  }
  
  isEnabled() {
    return this.storage.get(this.flagName, false);
  }
  
  disable() {
    this.storage.remove(this.flagName);
  }
  
  getTimeRemaining() {
    if (!this.isEnabled()) {
      return 0;
    }
    
    // Would need to access internal storage format
    // For simplicity, just check if still enabled
    return this.isEnabled() ? 'active' : 0;
  }
}

// Usage - Beta feature access
const betaDashboard = new TemporaryFeatureFlag('newDashboard');

// Enable for testing (1 hour)
betaDashboard.enable(3600);

// Check if enabled
if (betaDashboard.isEnabled()) {
  loadNewDashboard();
} else {
  loadOldDashboard();
}

// Enable until specific date (e.g., end of beta)
const betaEndDate = new Date('2025-12-31');
betaDashboard.enableUntil(betaEndDate);
```

### Example 5: Survey Cooldown

```javascript
class SurveyCooldown {
  constructor(surveyId, cooldownDays = 30) {
    this.surveyId = surveyId;
    this.cooldownDays = cooldownDays;
    this.storage = Storage.namespace('surveys');
  }
  
  canShowSurvey() {
    return !this.storage.has(`completed:${this.surveyId}`);
  }
  
  markCompleted() {
    const cooldownSeconds = this.cooldownDays * 24 * 60 * 60;
    
    this.storage.set(`completed:${this.surveyId}`, {
      completedAt: Date.now(),
      surveyId: this.surveyId
    }, { 
      expires: cooldownSeconds 
    });
    
    console.log(`Survey will be available again in ${this.cooldownDays} days`);
  }
  
  dismiss() {
    // Dismiss for 7 days
    const dismissSeconds = 7 * 24 * 60 * 60;
    
    this.storage.set(`dismissed:${this.surveyId}`, true, {
      expires: dismissSeconds
    });
  }
  
  isDismissed() {
    return this.storage.has(`dismissed:${this.surveyId}`);
  }
  
  shouldShow() {
    return this.canShowSurvey() && !this.isDismissed();
  }
}

// Usage
const satisfactionSurvey = new SurveyCooldown('satisfaction-2024', 30);

function checkAndShowSurvey() {
  if (satisfactionSurvey.shouldShow()) {
    showSurveyModal();
  }
}

function onSurveyCompleted() {
  satisfactionSurvey.markCompleted();
  alert('Thank you! We won\'t ask again for 30 days.');
}

function onSurveyDismissed() {
  satisfactionSurvey.dismiss();
  console.log('Survey dismissed for 7 days');
}

// Check on page load
window.addEventListener('load', () => {
  setTimeout(checkAndShowSurvey, 5000); // Show after 5 seconds
});
```

---

## Best Practices

### 1. Choose Appropriate Expiry Times

```javascript
// Good: Specific durations for different data types

// Short-lived: Tokens, sessions
Storage.set('authToken', token, { expires: 3600 }); // 1 hour

// Medium-lived: Cache, drafts
Storage.set('apiCache', data, { expires: 86400 }); // 24 hours

// Long-lived: User preferences (with expiry as safety)
Storage.set('onboardingComplete', true, { expires: 31536000 }); // 1 year

// Avoid: Too short (inefficient) or too long (stale data)
Storage.set('cache', data, { expires: 1 }); // Too short - 1 second
Storage.set('temp', data, { expires: 315360000 }); // Too long - 10 years
```

### 2. Use Seconds for Relative Time

```javascript
// Good: Use seconds for "expires in X time"
Storage.set('session', data, { expires: 1800 }); // 30 minutes from now

// Avoid: Calculating milliseconds manually
const expiryMs = Date.now() + (30 * 60 * 1000);
Storage.set('session', data, { expires: new Date(expiryMs) }); // Unnecessary complexity
```

### 3. Use Date for Absolute Time

```javascript
// Good: Use Date for "expires at specific time"
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);
Storage.set('dailyDeal', deal, { expires: endOfDay });

// Good: Event-based expiry
const eventDate = new Date('2025-12-25T00:00:00');
Storage.set('christmasSale', true, { expires: eventDate });
```

### 4. Document Expiry Times

```javascript
// Good: Clear constants with documentation
const EXPIRY_TIMES = {
  AUTH_TOKEN: 3600,        // 1 hour
  REFRESH_TOKEN: 604800,   // 7 days
  API_CACHE: 300,          // 5 minutes
  USER_SESSION: 1800,      // 30 minutes
  DRAFT: 86400,            // 24 hours
  PROMO_CODE: 2592000      // 30 days
};

Storage.set('token', value, { expires: EXPIRY_TIMES.AUTH_TOKEN });
```

### 5. Handle Expired Data Gracefully

```javascript
// Good: Check and handle expiry
function getAuthToken() {
  const token = Storage.get('authToken');
  
  if (!token) {
    // Token expired or doesn't exist
    refreshAuthToken().then(newToken => {
      Storage.set('authToken', newToken, { expires: 3600 });
    });
    return null;
  }
  
  return token;
}

// Avoid: Assuming data exists
function badGetToken() {
  const token = Storage.get('authToken');
  return token.value; // Error if token is null!
}
```

### 6. Combine with Cleanup

```javascript
// Good: Regular cleanup of expired items
setInterval(() => {
  const results = Storage.cleanup();
  if (results.local > 0) {
    console.log(`Cleaned up ${results.local} expired items`);
  }
}, 3600000); // Every hour

// On app start
Storage.cleanup();
```

### 7. Reset Expiry on Activity

```javascript
// Good: Extend session on user activity
function extendSession() {
  const session = Storage.get('userSession');
  
  if (session) {
    // Reset expiry by re-saving with new expiry
    Storage.set('userSession', session, { expires: 1800 });
  }
}

// Extend on any user interaction
document.addEventListener('click', extendSession);
document.addEventListener('keypress', extendSession);
```

---

## Advanced Patterns

### Pattern 1: Sliding Expiration

```javascript
class SlidingExpiration {
  constructor(key, slidingWindow) {
    this.key = key;
    this.slidingWindow = slidingWindow; // seconds
  }
  
  set(value) {
    Storage.set(this.key, value, { expires: this.slidingWindow });
  }
  
  get() {
    const value = Storage.get(this.key);
    
    if (value !== null) {
      // Slide the expiration window
      this.set(value);
    }
    
    return value;
  }
  
  touch() {
    const value = this.get();
    // Get automatically slides expiration
    return value !== null;
  }
}

// Usage - Session with sliding expiration
const session = new SlidingExpiration('userSession', 1800);

session.set({ userId: 123, name: 'John' });

// Every access extends the expiration
setInterval(() => {
  if (session.touch()) {
    console.log('Session extended');
  } else {
    console.log('Session expired');
    redirectToLogin();
  }
}, 60000); // Check every minute
```

### Pattern 2: Tiered Expiration

```javascript
class TieredCache {
  constructor() {
    this.tiers = {
      hot: 300,     // 5 minutes
      warm: 3600,   // 1 hour
      cold: 86400   // 24 hours
    };
  }
  
  set(key, value, tier = 'warm') {
    const expiry = this.tiers[tier] || this.tiers.warm;
    Storage.set(`cache:${key}`, {
      value,
      tier,
      cachedAt: Date.now()
    }, { expires: expiry });
  }
  
  get(key) {
    const cached = Storage.get(`cache:${key}`);
    return cached ? cached.value : null;
  }
  
  promote(key, newTier) {
    const cached = Storage.get(`cache:${key}`);
    if (cached) {
      this.set(key, cached.value, newTier);
    }
  }
}

// Usage
const cache = new TieredCache();

// Critical data - hot tier (5 min)
cache.set('userProfile', profile, 'hot');

// Frequently accessed - warm tier (1 hour)
cache.set('apiResponse', data, 'warm');

// Rarely accessed - cold tier (24 hours)
cache.set('staticContent', content, 'cold');

// Promote frequently accessed cold data
if (accessCount > 10) {
  cache.promote('staticContent', 'warm');
}
```

### Pattern 3: Expiry with Callback

```javascript
class ExpiryWithCallback {
  constructor() {
    this.callbacks = new Map();
  }
  
  set(key, value, expirySeconds, onExpire) {
    // Store data with expiry
    Storage.set(key, value, { expires: expirySeconds });
    
    // Store callback
    if (onExpire) {
      this.callbacks.set(key, onExpire);
      
      // Set timeout to trigger callback
      setTimeout(() => {
        if (!Storage.has(key)) {
          // Data expired
          const callback = this.callbacks.get(key);
          if (callback) {
            callback(key, value);
            this.callbacks.delete(key);
          }
        }
      }, expirySeconds * 1000);
    }
  }
  
  get(key) {
    return Storage.get(key);
  }
}

// Usage
const expiryStorage = new ExpiryWithCallback();

expiryStorage.set(
  'tempAccess',
  { userId: 123 },
  300, // 5 minutes
  (key, value) => {
    console.log(`Access expired for user ${value.userId}`);
    notifyUser('Your temporary access has expired');
  }
);
```

---

## Summary

**Options Object:**

```javascript
{
  expires: number | Date  // Only option currently available
}
```

**Expiry Formats:**

| Format | Example | Description |
|--------|---------|-------------|
| `number` | `3600` | Seconds from now |
| `Date` | `new Date('2025-12-31')` | Specific date/time |

**Common Expiry Times:**

```javascript
const EXPIRY = {
  MINUTE: 60,
  FIVE_MINUTES: 300,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
  MONTH: 2592000,
  YEAR: 31536000
};
```

**Key Points:**

✅ **Automatic expiration** - Data becomes invalid after set time  
✅ **Self-cleaning** - Expired items removed on access  
✅ **Flexible timing** - Use seconds or dates  
✅ **No manual cleanup** - Handled automatically  
✅ **Perfect for temporary data** - Tokens, sessions, cache  

**Best Practices:**

1. Use seconds for relative time ("in 1 hour")
2. Use Date for absolute time ("at midnight")
3. Document expiry constants
4. Handle expired data gracefully
5. Combine with regular cleanup
6. Reset expiry on user activity
7. Choose appropriate durations

**Common Use Cases:**

- 🔐 Authentication tokens
- 📊 API cache with TTL
- 💾 Session data
- 📝 Draft auto-save
- 🎟️ Promo codes
- ⏱️ Rate limiting
- 🎯 Feature flags
- 📬 Flash messages

The `expires` option makes it easy to implement automatic data expiration without manual cleanup logic!