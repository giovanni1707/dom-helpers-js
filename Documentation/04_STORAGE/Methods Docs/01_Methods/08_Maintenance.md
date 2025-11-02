# Maintenance Operations

Complete documentation for storage maintenance operations in the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Methods Reference](#methods-reference)
   - [cleanup()](#cleanup)
   - [stats()](#stats)
3. [Why Maintenance Matters](#why-maintenance-matters)
4. [Use Cases](#use-cases)
5. [Examples](#examples)
6. [Best Practices](#best-practices)
7. [Automation Strategies](#automation-strategies)

---

## Overview

Maintenance operations help you keep your storage clean, efficient, and monitored. These methods allow you to remove expired data and gather insights about storage usage.

**Key Benefits:**
- 🧹 **Clean storage** - Remove expired items automatically
- 📊 **Monitor usage** - Track storage size and item count
- ⚡ **Better performance** - Keep storage lean and fast
- 🔍 **Debug help** - Identify storage issues
- 💾 **Quota management** - Prevent storage overflow

---

## Methods Reference

### cleanup()

Remove all expired items from storage.

#### Syntax

```javascript
// On a storage instance
storage.cleanup()

// On main Storage object
Storage.cleanup()
```

#### Parameters

None

#### Returns

**When called on a storage instance:**
- `number` - Count of expired items removed

**When called on main Storage object:**
- `object` - Object with cleanup results for both storage types
  ```javascript
  {
    local: number,    // Items removed from localStorage
    session: number   // Items removed from sessionStorage
  }
  ```

#### Behavior

- Iterates through all keys in storage
- Checks each item for expiration
- Removes expired items
- Returns count of items removed
- Safe to call frequently
- Does not affect non-expired items

#### Examples

```javascript
// Cleanup a specific storage instance
const cache = Storage.namespace('cache');
const removed = cache.cleanup();
console.log(`Removed ${removed} expired cache items`);

// Cleanup all localStorage
const localRemoved = Storage.local.cleanup();
console.log(`Removed ${localRemoved} expired items from localStorage`);

// Cleanup all sessionStorage
const sessionRemoved = Storage.session.cleanup();
console.log(`Removed ${sessionRemoved} expired items from sessionStorage`);

// Cleanup both storage types at once
const results = Storage.cleanup();
console.log(`Removed ${results.local} from localStorage`);
console.log(`Removed ${results.session} from sessionStorage`);
console.log(`Total removed: ${results.local + results.session}`);
```

---

### stats()

Get statistics about storage usage.

#### Syntax

```javascript
// On a storage instance
storage.stats()

// On main Storage object
Storage.stats()
```

#### Parameters

None

#### Returns

**When called on a storage instance:**
- `object` - Statistics object with the following properties:
  ```javascript
  {
    keys: number,           // Number of stored items
    totalSize: number,      // Approximate size in bytes
    averageSize: number,    // Average size per item in bytes
    namespace: string,      // Current namespace (or 'global')
    storageType: string     // 'localStorage' or 'sessionStorage'
  }
  ```

**When called on main Storage object:**
- `object` - Object with statistics for both storage types
  ```javascript
  {
    local: {
      keys: number,
      totalSize: number,
      averageSize: number,
      namespace: string,
      storageType: 'localStorage'
    },
    session: {
      keys: number,
      totalSize: number,
      averageSize: number,
      namespace: string,
      storageType: 'sessionStorage'
    }
  }
  ```

#### Behavior

- Counts all non-expired items
- Calculates approximate size by serializing values
- Averages size across all items
- Does not modify storage
- Safe to call frequently
- Provides real-time statistics

#### Examples

```javascript
// Get stats for specific namespace
const userStorage = Storage.namespace('user');
const userStats = userStorage.stats();
console.log(`User storage has ${userStats.keys} items`);
console.log(`Total size: ${userStats.totalSize} bytes`);
console.log(`Average size: ${userStats.averageSize} bytes per item`);

// Get stats for localStorage
const localStats = Storage.local.stats();
console.log('localStorage:', localStats);

// Get stats for sessionStorage
const sessionStats = Storage.session.stats();
console.log('sessionStorage:', sessionStats);

// Get stats for both storage types
const allStats = Storage.stats();
console.log('Local items:', allStats.local.keys);
console.log('Session items:', allStats.session.keys);
console.log('Total items:', allStats.local.keys + allStats.session.keys);

// Format size nicely
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

const stats = Storage.stats();
console.log(`localStorage: ${formatBytes(stats.local.totalSize)}`);
console.log(`sessionStorage: ${formatBytes(stats.session.totalSize)}`);
```

---

## Why Maintenance Matters

### 1. Prevent Storage Quota Issues

```javascript
// Storage quotas (typically 5-10 MB per domain)
// Without cleanup, expired items waste space

// Bad: Storage fills up with expired items
Storage.set('temp1', largeData, { expires: 60 });
Storage.set('temp2', largeData, { expires: 60 });
Storage.set('temp3', largeData, { expires: 60 });
// After expiry, items still occupy space!

// Good: Regular cleanup
setInterval(() => {
  const results = Storage.cleanup();
  console.log(`Cleaned ${results.local + results.session} expired items`);
}, 60000); // Every minute
```

### 2. Better Performance

```javascript
// Fewer items = faster operations
// Before cleanup
console.log(Storage.keys().length); // 1000 items (many expired)

// After cleanup
Storage.cleanup();
console.log(Storage.keys().length); // 50 items (only active)

// Operations are now faster
const value = Storage.get('key'); // Faster lookup
```

### 3. Debugging and Monitoring

```javascript
// Identify storage issues
const stats = Storage.stats();

if (stats.local.totalSize > 4000000) { // Over 4 MB
  console.warn('localStorage is nearly full!');
  Storage.cleanup(); // Try to free space
}

if (stats.local.keys > 500) {
  console.warn('Too many items in storage!');
}
```

---

## Use Cases

### 1. Periodic Cleanup

```javascript
// Run cleanup every hour
setInterval(() => {
  const results = Storage.cleanup();
  if (results.local > 0 || results.session > 0) {
    console.log(`Cleaned ${results.local} local, ${results.session} session items`);
  }
}, 3600000); // 1 hour
```

### 2. Storage Monitor Dashboard

```javascript
function displayStorageStats() {
  const stats = Storage.stats();
  
  document.getElementById('localItems').textContent = stats.local.keys;
  document.getElementById('localSize').textContent = 
    formatBytes(stats.local.totalSize);
  
  document.getElementById('sessionItems').textContent = stats.session.keys;
  document.getElementById('sessionSize').textContent = 
    formatBytes(stats.session.totalSize);
}

// Update every 5 seconds
setInterval(displayStorageStats, 5000);
```

### 3. Before Critical Operations

```javascript
function saveLargeData(key, data) {
  // Clean up first to free space
  Storage.cleanup();
  
  const stats = Storage.stats();
  const dataSize = JSON.stringify(data).length;
  
  if (stats.local.totalSize + dataSize > 5000000) { // 5 MB limit
    console.error('Not enough storage space');
    return false;
  }
  
  return Storage.set(key, data);
}
```

### 4. Application Startup

```javascript
// Clean up on app initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('Cleaning up expired storage...');
  const results = Storage.cleanup();
  
  if (results.local > 0 || results.session > 0) {
    console.log(`Removed ${results.local + results.session} expired items`);
  }
  
  // Check storage health
  const stats = Storage.stats();
  console.log('Storage stats:', stats);
});
```

### 5. Cache Management

```javascript
class CacheManager {
  cleanup() {
    const cache = Storage.namespace('cache');
    return cache.cleanup();
  }
  
  getStats() {
    const cache = Storage.namespace('cache');
    return cache.stats();
  }
  
  isHealthy() {
    const stats = this.getStats();
    return stats.totalSize < 2000000; // Under 2 MB
  }
  
  optimize() {
    if (!this.isHealthy()) {
      const removed = this.cleanup();
      console.log(`Optimized cache: removed ${removed} items`);
    }
  }
}
```

---

## Examples

### Example 1: Storage Health Monitor

```javascript
class StorageHealthMonitor {
  constructor(warningThreshold = 0.8, criticalThreshold = 0.95) {
    this.warningThreshold = warningThreshold; // 80%
    this.criticalThreshold = criticalThreshold; // 95%
    this.maxSize = 5000000; // 5 MB typical limit
  }
  
  check() {
    const stats = Storage.stats();
    const localUsage = stats.local.totalSize / this.maxSize;
    const sessionUsage = stats.session.totalSize / this.maxSize;
    
    return {
      local: this.getHealthStatus(localUsage, stats.local),
      session: this.getHealthStatus(sessionUsage, stats.session),
      overall: this.getOverallHealth(localUsage, sessionUsage)
    };
  }
  
  getHealthStatus(usage, stats) {
    let status = 'healthy';
    let level = 'success';
    
    if (usage >= this.criticalThreshold) {
      status = 'critical';
      level = 'error';
    } else if (usage >= this.warningThreshold) {
      status = 'warning';
      level = 'warning';
    }
    
    return {
      status,
      level,
      usage: Math.round(usage * 100),
      items: stats.keys,
      size: stats.totalSize,
      averageSize: stats.averageSize
    };
  }
  
  getOverallHealth(localUsage, sessionUsage) {
    const maxUsage = Math.max(localUsage, sessionUsage);
    
    if (maxUsage >= this.criticalThreshold) {
      return 'critical';
    } else if (maxUsage >= this.warningThreshold) {
      return 'warning';
    }
    return 'healthy';
  }
  
  cleanup() {
    const results = Storage.cleanup();
    return {
      itemsRemoved: results.local + results.session,
      local: results.local,
      session: results.session
    };
  }
  
  optimize() {
    const health = this.check();
    
    if (health.overall !== 'healthy') {
      console.log('⚠️ Storage needs optimization');
      const cleaned = this.cleanup();
      console.log(`✅ Removed ${cleaned.itemsRemoved} expired items`);
      
      const newHealth = this.check();
      return {
        before: health,
        after: newHealth,
        cleaned
      };
    }
    
    return { message: 'Storage is healthy', health };
  }
  
  report() {
    const health = this.check();
    
    console.log('=== Storage Health Report ===');
    console.log(`Overall: ${health.overall.toUpperCase()}`);
    console.log('\nLocalStorage:');
    console.log(`  Status: ${health.local.status}`);
    console.log(`  Usage: ${health.local.usage}%`);
    console.log(`  Items: ${health.local.items}`);
    console.log(`  Size: ${this.formatBytes(health.local.size)}`);
    console.log('\nSessionStorage:');
    console.log(`  Status: ${health.session.status}`);
    console.log(`  Usage: ${health.session.usage}%`);
    console.log(`  Items: ${health.session.items}`);
    console.log(`  Size: ${this.formatBytes(health.session.size)}`);
    
    return health;
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Usage
const monitor = new StorageHealthMonitor();

// Check health
const health = monitor.check();
console.log('Storage health:', health.overall);

// Generate report
monitor.report();

// Optimize if needed
monitor.optimize();

// Run periodic checks
setInterval(() => {
  const health = monitor.check();
  
  if (health.overall === 'critical') {
    console.error('🚨 Storage critical! Running optimization...');
    monitor.optimize();
  } else if (health.overall === 'warning') {
    console.warn('⚠️ Storage warning. Consider cleanup.');
  }
}, 300000); // Every 5 minutes
```

### Example 2: Automatic Cache Cleanup

```javascript
class AutoCleanupCache {
  constructor(namespace, maxItems = 100, maxSize = 1000000) {
    this.storage = Storage.namespace(namespace);
    this.maxItems = maxItems;
    this.maxSize = maxSize; // 1 MB
  }
  
  set(key, value, expires = 3600) {
    // Check if cleanup needed before adding
    this.autoCleanup();
    
    return this.storage.set(key, value, { expires });
  }
  
  get(key, defaultValue = null) {
    return this.storage.get(key, defaultValue);
  }
  
  autoCleanup() {
    const stats = this.storage.stats();
    
    // Cleanup if over limits
    if (stats.keys > this.maxItems || stats.totalSize > this.maxSize) {
      console.log('Auto-cleanup triggered');
      
      // First try removing expired items
      const removed = this.storage.cleanup();
      console.log(`Removed ${removed} expired items`);
      
      // Check if still over limits
      const newStats = this.storage.stats();
      
      if (newStats.keys > this.maxItems || newStats.totalSize > this.maxSize) {
        // Remove oldest items (LRU-style)
        this.removeOldest(Math.ceil(this.maxItems * 0.2)); // Remove 20%
      }
    }
  }
  
  removeOldest(count) {
    const entries = this.storage.entries();
    
    // Sort by timestamp (oldest first)
    const sorted = entries.sort((a, b) => {
      const aTime = this.getTimestamp(a[0]);
      const bTime = this.getTimestamp(b[0]);
      return aTime - bTime;
    });
    
    // Remove oldest items
    for (let i = 0; i < Math.min(count, sorted.length); i++) {
      this.storage.remove(sorted[i][0]);
    }
    
    console.log(`Removed ${Math.min(count, sorted.length)} oldest items`);
  }
  
  getTimestamp(key) {
    // Try to get timestamp from stored data
    try {
      const raw = localStorage.getItem(key);
      const data = JSON.parse(raw);
      return data.timestamp || 0;
    } catch {
      return 0;
    }
  }
  
  stats() {
    return this.storage.stats();
  }
  
  cleanup() {
    return this.storage.cleanup();
  }
  
  clear() {
    return this.storage.clear();
  }
}

// Usage
const cache = new AutoCleanupCache('api-cache', 50, 500000);

// Cache automatically cleans up when limits are reached
for (let i = 0; i < 100; i++) {
  cache.set(`item${i}`, { data: 'value' }, 600);
}

// Check stats
const stats = cache.stats();
console.log(`Cache has ${stats.keys} items (${stats.totalSize} bytes)`);
```

### Example 3: Storage Dashboard Component

```javascript
class StorageDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
    this.startMonitoring();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="storage-dashboard">
        <h2>Storage Monitor</h2>
        
        <div class="storage-section">
          <h3>localStorage</h3>
          <div class="stat">
            <span class="label">Items:</span>
            <span id="local-items">-</span>
          </div>
          <div class="stat">
            <span class="label">Size:</span>
            <span id="local-size">-</span>
          </div>
          <div class="stat">
            <span class="label">Average:</span>
            <span id="local-avg">-</span>
          </div>
          <div class="progress">
            <div id="local-progress" class="progress-bar"></div>
          </div>
        </div>
        
        <div class="storage-section">
          <h3>sessionStorage</h3>
          <div class="stat">
            <span class="label">Items:</span>
            <span id="session-items">-</span>
          </div>
          <div class="stat">
            <span class="label">Size:</span>
            <span id="session-size">-</span>
          </div>
          <div class="stat">
            <span class="label">Average:</span>
            <span id="session-avg">-</span>
          </div>
          <div class="progress">
            <div id="session-progress" class="progress-bar"></div>
          </div>
        </div>
        
        <div class="actions">
          <button id="cleanup-btn">Cleanup Expired</button>
          <button id="refresh-btn">Refresh Stats</button>
        </div>
        
        <div id="cleanup-result"></div>
      </div>
    `;
    
    this.attachEvents();
  }
  
  attachEvents() {
    document.getElementById('cleanup-btn').onclick = () => {
      this.performCleanup();
    };
    
    document.getElementById('refresh-btn').onclick = () => {
      this.updateStats();
    };
  }
  
  updateStats() {
    const stats = Storage.stats();
    const maxSize = 5000000; // 5 MB
    
    // localStorage
    document.getElementById('local-items').textContent = stats.local.keys;
    document.getElementById('local-size').textContent = 
      this.formatBytes(stats.local.totalSize);
    document.getElementById('local-avg').textContent = 
      this.formatBytes(stats.local.averageSize);
    
    const localPercent = (stats.local.totalSize / maxSize) * 100;
    const localBar = document.getElementById('local-progress');
    localBar.style.width = `${Math.min(localPercent, 100)}%`;
    localBar.className = 'progress-bar ' + this.getProgressClass(localPercent);
    
    // sessionStorage
    document.getElementById('session-items').textContent = stats.session.keys;
    document.getElementById('session-size').textContent = 
      this.formatBytes(stats.session.totalSize);
    document.getElementById('session-avg').textContent = 
      this.formatBytes(stats.session.averageSize);
    
    const sessionPercent = (stats.session.totalSize / maxSize) * 100;
    const sessionBar = document.getElementById('session-progress');
    sessionBar.style.width = `${Math.min(sessionPercent, 100)}%`;
    sessionBar.className = 'progress-bar ' + this.getProgressClass(sessionPercent);
  }
  
  getProgressClass(percent) {
    if (percent >= 90) return 'danger';
    if (percent >= 70) return 'warning';
    return 'success';
  }
  
  performCleanup() {
    const results = Storage.cleanup();
    const total = results.local + results.session;
    
    const resultDiv = document.getElementById('cleanup-result');
    resultDiv.innerHTML = `
      <div class="cleanup-result ${total > 0 ? 'success' : 'info'}">
        ✓ Cleanup complete: Removed ${total} expired items
        (${results.local} local, ${results.session} session)
      </div>
    `;
    
    setTimeout(() => {
      resultDiv.innerHTML = '';
    }, 5000);
    
    this.updateStats();
  }
  
  startMonitoring() {
    this.updateStats();
    setInterval(() => this.updateStats(), 5000);
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Usage
const dashboard = new StorageDashboard('storage-dashboard');
```

### Example 4: Namespace Analytics

```javascript
class NamespaceAnalytics {
  getAllNamespaces() {
    const keys = [];
    
    // Get all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }
    
    // Extract unique namespaces
    const namespaces = new Set();
    keys.forEach(key => {
      if (key.includes(':')) {
        const namespace = key.split(':')[0];
        namespaces.add(namespace);
      }
    });
    
    return Array.from(namespaces);
  }
  
  getNamespaceStats(namespace) {
    const ns = Storage.namespace(namespace);
    return ns.stats();
  }
  
  getAllStats() {
    const namespaces = this.getAllNamespaces();
    const stats = {};
    
    namespaces.forEach(ns => {
      stats[ns] = this.getNamespaceStats(ns);
    });
    
    // Add global (non-namespaced) stats
    stats.global = {
      keys: this.getGlobalKeyCount(),
      totalSize: this.getGlobalSize()
    };
    
    return stats;
  }
  
  getGlobalKeyCount() {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.includes(':')) {
        count++;
      }
    }
    return count;
  }
  
  getGlobalSize() {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.includes(':')) {
        const value = localStorage.getItem(key);
        size += value ? value.length : 0;
      }
    }
    return size;
  }
  
  cleanupAll() {
    const namespaces = this.getAllNamespaces();
    const results = {};
    
    namespaces.forEach(ns => {
      const storage = Storage.namespace(ns);
      results[ns] = storage.cleanup();
    });
    
    return results;
  }
  
  report() {
    const stats = this.getAllStats();
    
    console.log('=== Storage Analytics ===\n');
    
    Object.entries(stats).forEach(([namespace, data]) => {
      console.log(`${namespace}:`);
      console.log(`  Items: ${data.keys}`);
      console.log(`  Size: ${this.formatBytes(data.totalSize || 0)}`);
      if (data.averageSize) {
        console.log(`  Avg: ${this.formatBytes(data.averageSize)}`);
      }
      console.log('');
    });
    
    const totalSize = Object.values(stats)
      .reduce((sum, s) => sum + (s.totalSize || 0), 0);
    const totalItems = Object.values(stats)
      .reduce((sum, s) => sum + s.keys, 0);
    
    console.log('Total:');
    console.log(`  Items: ${totalItems}`);
    console.log(`  Size: ${this.formatBytes(totalSize)}`);
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Usage
const analytics = new NamespaceAnalytics();

// Get all namespaces
const namespaces = analytics.getAllNamespaces();
console.log('Namespaces:', namespaces);

// Get detailed stats
const allStats = analytics.getAllStats();
console.log('Stats:', allStats);

// Generate report
analytics.report();

// Cleanup all namespaces
const cleanupResults = analytics.cleanupAll();
console.log('Cleanup results:', cleanupResults);
```

### Example 5: Scheduled Maintenance

```javascript
class ScheduledMaintenance {
  constructor(options = {}) {
    this.options = {
      cleanupInterval: options.cleanupInterval || 3600000, // 1 hour
      statsInterval: options.statsInterval || 300000, // 5 minutes
      autoCleanup: options.autoCleanup !== false,
      logging: options.logging !== false
    };
    
    this.cleanupTimer = null;
    this.statsTimer = null;
  }
  
  start() {
    this.log('Starting scheduled maintenance');
    
    // Initial cleanup and stats
    this.runCleanup();
    this.logStats();
    
    // Schedule recurring tasks
    if (this.options.autoCleanup) {
      this.cleanupTimer = setInterval(
        () => this.runCleanup(),
        this.options.cleanupInterval
      );
    }
    
    this.statsTimer = setInterval(
      () => this.logStats(),
      this.options.statsInterval
    );
  }
  
  stop() {
    this.log('Stopping scheduled maintenance');
    
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    if (this.statsTimer) {
      clearInterval(this.statsTimer);
      this.statsTimer = null;
    }
  }
  
  runCleanup() {
    const startTime = Date.now();
    const results = Storage.cleanup();
    const duration = Date.now() - startTime;
    
    const total = results.local + results.session;
    
    if (total > 0 || this.options.logging) {
      this.log(`Cleanup completed in ${duration}ms`);
      this.log(`  Removed: ${total} items (${results.local} local, ${results.session} session)`);
    }
    
    return results;
  }
  
  logStats() {
    const stats = Storage.stats();
    
    if (this.options.logging) {
      this.log('Storage Statistics:');
      this.log(`  localStorage: ${stats.local.keys} items, ${this.formatBytes(stats.local.totalSize)}`);
      this.log(`  sessionStorage: ${stats.session.keys} items, ${this.formatBytes(stats.session.totalSize)}`);
    }
    
    // Check for warnings
    const maxSize = 5000000; // 5 MB
    
    if (stats.local.totalSize > maxSize * 0.9) {
      console.warn('⚠️ localStorage is over 90% full!');
    }
    
    if (stats.local.keys > 500) {
      console.warn('⚠️ Too many items in localStorage!');
    }
    
    return stats;
  }
  
  log(message) {
    if (this.options.logging) {
      console.log(`[Maintenance ${new Date().toLocaleTimeString()}] ${message}`);
    }
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Usage
const maintenance = new ScheduledMaintenance({
  cleanupInterval: 3600000,  // Cleanup every hour
  statsInterval: 300000,     // Log stats every 5 minutes
  autoCleanup: true,
  logging: true
});

// Start maintenance
maintenance.start();

// Stop when needed (e.g., before page unload)
window.addEventListener('beforeunload', () => {
  maintenance.stop();
});
```

---

## Best Practices

### 1. Regular Cleanup Schedule

```javascript
// Good: Regular automated cleanup
setInterval(() => {
  Storage.cleanup();
}, 3600000); // Every hour

// Better: Cleanup on app start and periodically
document.addEventListener('DOMContentLoaded', () => {
  Storage.cleanup(); // Initial cleanup
  
  setInterval(() => {
    Storage.cleanup();
  }, 3600000);
});
```

### 2. Monitor Before Critical Operations

```javascript
// Good: Check before saving large data
function saveLargeData(data) {
  const stats = Storage.stats();
  
  if (stats.local.totalSize > 4000000) { // Over 4 MB
    Storage.cleanup(); // Try to free space
  }
  
  return Storage.set('largeData', data);
}
```

### 3. Log Cleanup Results

```javascript
// Good: Log cleanup activity
function performMaintenance() {
  console.log('Running storage maintenance...');
  
  const before = Storage.stats();
  const results = Storage.cleanup();
  const after = Storage.stats();
  
  console.log(`Removed ${results.local + results.session} expired items`);
  console.log(`Space freed: ${before.local.totalSize - after.local.totalSize} bytes`);
}
```

### 4. Handle Errors Gracefully

```javascript
// Good: Safe maintenance with error handling
function safeMaintenance() {
  try {
    const results = Storage.cleanup();
    const stats = Storage.stats();
    
    return {success: true,
      results,
      stats
    };
  } catch (error) {
    console.error('Maintenance error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

### 5. Namespace-Specific Maintenance

```javascript
// Good: Clean specific namespaces
function cleanupCache() {
  const cache = Storage.namespace('cache');
  return cache.cleanup();
}

function cleanupTemp() {
  const temp = Storage.namespace('temp');
  return temp.cleanup();
}

// Better: Clean multiple namespaces
function cleanupNonCritical() {
  const results = {};
  
  ['cache', 'temp', 'preview'].forEach(ns => {
    const storage = Storage.namespace(ns);
    results[ns] = storage.cleanup();
  });
  
  return results;
}
```

### 6. Combine Stats with Alerts

```javascript
// Good: Monitor and alert
function checkStorageHealth() {
  const stats = Storage.stats();
  const maxSize = 5000000;
  
  if (stats.local.totalSize > maxSize * 0.9) {
    alert('Storage is almost full! Cleaning up...');
    Storage.cleanup();
  }
  
  if (stats.local.keys > 1000) {
    console.warn('Too many items in storage');
  }
}

// Run periodically
setInterval(checkStorageHealth, 60000); // Every minute
```

### 7. Maintenance on Page Visibility Change

```javascript
// Good: Clean when page becomes visible
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Page is now visible - run maintenance
    const results = Storage.cleanup();
    
    if (results.local > 0 || results.session > 0) {
      console.log(`Cleaned ${results.local + results.session} items on visibility`);
    }
  }
});
```

---

## Automation Strategies

### Strategy 1: Time-Based Cleanup

```javascript
class TimeBasedCleanup {
  constructor() {
    this.intervals = {
      fast: 60000,      // 1 minute - for temp data
      normal: 3600000,  // 1 hour - for cache
      slow: 86400000    // 24 hours - for persistent data
    };
    
    this.timers = {};
  }
  
  start() {
    // Fast cleanup for temporary namespaces
    this.timers.fast = setInterval(() => {
      this.cleanupNamespaces(['temp', 'session', 'preview']);
    }, this.intervals.fast);
    
    // Normal cleanup for cache
    this.timers.normal = setInterval(() => {
      this.cleanupNamespaces(['cache', 'api']);
    }, this.intervals.normal);
    
    // Slow cleanup for everything
    this.timers.slow = setInterval(() => {
      Storage.cleanup();
    }, this.intervals.slow);
  }
  
  cleanupNamespaces(namespaces) {
    namespaces.forEach(ns => {
      const storage = Storage.namespace(ns);
      const removed = storage.cleanup();
      
      if (removed > 0) {
        console.log(`Cleaned ${removed} items from ${ns}`);
      }
    });
  }
  
  stop() {
    Object.values(this.timers).forEach(timer => clearInterval(timer));
    this.timers = {};
  }
}

// Usage
const cleanup = new TimeBasedCleanup();
cleanup.start();
```

### Strategy 2: Threshold-Based Cleanup

```javascript
class ThresholdCleanup {
  constructor(thresholds = {}) {
    this.thresholds = {
      itemCount: thresholds.itemCount || 500,
      totalSize: thresholds.totalSize || 4000000, // 4 MB
      namespaceSize: thresholds.namespaceSize || 1000000 // 1 MB
    };
  }
  
  check() {
    const stats = Storage.stats();
    const triggers = [];
    
    // Check item count
    if (stats.local.keys > this.thresholds.itemCount) {
      triggers.push('itemCount');
    }
    
    // Check total size
    if (stats.local.totalSize > this.thresholds.totalSize) {
      triggers.push('totalSize');
    }
    
    if (triggers.length > 0) {
      this.cleanup(triggers);
    }
    
    return triggers;
  }
  
  cleanup(triggers) {
    console.log('Threshold exceeded:', triggers.join(', '));
    
    const before = Storage.stats();
    const results = Storage.cleanup();
    const after = Storage.stats();
    
    const freed = before.local.totalSize - after.local.totalSize;
    
    console.log(`Cleanup freed ${this.formatBytes(freed)}`);
    
    // If still over threshold, do more aggressive cleanup
    if (after.local.totalSize > this.thresholds.totalSize) {
      this.aggressiveCleanup();
    }
  }
  
  aggressiveCleanup() {
    console.log('Running aggressive cleanup...');
    
    // Clear non-critical namespaces
    ['cache', 'temp', 'preview'].forEach(ns => {
      const storage = Storage.namespace(ns);
      storage.clear();
    });
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Usage
const thresholdCleanup = new ThresholdCleanup();

// Check before critical operations
function saveCriticalData(data) {
  thresholdCleanup.check();
  return Storage.set('critical', data);
}

// Check periodically
setInterval(() => thresholdCleanup.check(), 300000); // Every 5 minutes
```

### Strategy 3: Event-Based Cleanup

```javascript
class EventBasedCleanup {
  constructor() {
    this.setupListeners();
  }
  
  setupListeners() {
    // Cleanup on page load
    window.addEventListener('load', () => {
      this.onPageLoad();
    });
    
    // Cleanup before page unload
    window.addEventListener('beforeunload', () => {
      this.onPageUnload();
    });
    
    // Cleanup when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.onPageVisible();
      }
    });
    
    // Cleanup on storage event (changes from other tabs)
    window.addEventListener('storage', (e) => {
      this.onStorageChange(e);
    });
  }
  
  onPageLoad() {
    console.log('Page load - running cleanup');
    const results = Storage.cleanup();
    
    if (results.local > 0 || results.session > 0) {
      console.log(`Cleaned ${results.local + results.session} expired items`);
    }
  }
  
  onPageUnload() {
    console.log('Page unload - running cleanup');
    
    // Clear session-specific data
    const session = Storage.namespace('session');
    session.clear();
    
    // Cleanup expired items
    Storage.cleanup();
  }
  
  onPageVisible() {
    console.log('Page visible - checking storage health');
    
    const stats = Storage.stats();
    
    if (stats.local.keys > 500) {
      console.log('Running cleanup due to high item count');
      Storage.cleanup();
    }
  }
  
  onStorageChange(event) {
    // Another tab modified storage - check if cleanup needed
    if (event.key === null) {
      // Storage was cleared in another tab
      console.log('Storage cleared in another tab');
    }
  }
}

// Usage
const eventCleanup = new EventBasedCleanup();
```

### Strategy 4: Smart Cleanup Manager

```javascript
class SmartCleanupManager {
  constructor(options = {}) {
    this.options = {
      autoStart: options.autoStart !== false,
      aggressive: options.aggressive || false,
      logging: options.logging !== false,
      ...options
    };
    
    this.strategies = {
      time: new TimeBasedCleanup(),
      threshold: new ThresholdCleanup(),
      event: new EventBasedCleanup()
    };
    
    if (this.options.autoStart) {
      this.start();
    }
  }
  
  start() {
    this.log('Starting smart cleanup manager');
    
    // Start time-based cleanup
    this.strategies.time.start();
    
    // Start threshold monitoring
    setInterval(() => {
      this.strategies.threshold.check();
    }, 300000); // Every 5 minutes
    
    // Event-based is automatically started via listeners
  }
  
  stop() {
    this.log('Stopping smart cleanup manager');
    this.strategies.time.stop();
  }
  
  forceCleanup() {
    this.log('Forcing immediate cleanup');
    
    const results = Storage.cleanup();
    const total = results.local + results.session;
    
    this.log(`Forced cleanup removed ${total} items`);
    
    if (this.options.aggressive && total === 0) {
      this.log('No expired items found - running aggressive cleanup');
      this.aggressiveCleanup();
    }
    
    return results;
  }
  
  aggressiveCleanup() {
    // Clear all cache and temporary data
    const namespaces = ['cache', 'temp', 'preview', 'draft'];
    let totalCleared = 0;
    
    namespaces.forEach(ns => {
      const storage = Storage.namespace(ns);
      const stats = storage.stats();
      storage.clear();
      totalCleared += stats.keys;
    });
    
    this.log(`Aggressive cleanup cleared ${totalCleared} items`);
  }
  
  getStatus() {
    const stats = Storage.stats();
    
    return {
      healthy: this.isHealthy(stats),
      stats,
      recommendations: this.getRecommendations(stats)
    };
  }
  
  isHealthy(stats) {
    const maxSize = 5000000;
    const usage = stats.local.totalSize / maxSize;
    
    return usage < 0.8 && stats.local.keys < 500;
  }
  
  getRecommendations(stats) {
    const recommendations = [];
    const maxSize = 5000000;
    const usage = stats.local.totalSize / maxSize;
    
    if (usage > 0.9) {
      recommendations.push('Critical: Storage is over 90% full. Run aggressive cleanup.');
    } else if (usage > 0.7) {
      recommendations.push('Warning: Storage is over 70% full. Consider cleanup.');
    }
    
    if (stats.local.keys > 1000) {
      recommendations.push('Too many items in storage. Consider using namespaces.');
    } else if (stats.local.keys > 500) {
      recommendations.push('High item count. Monitor storage usage.');
    }
    
    if (stats.local.averageSize > 10000) {
      recommendations.push('Large average item size. Consider data compression.');
    }
    
    return recommendations;
  }
  
  generateReport() {
    const status = this.getStatus();
    
    console.log('=== Smart Cleanup Manager Report ===');
    console.log(`Health: ${status.healthy ? '✓ Healthy' : '⚠ Needs Attention'}`);
    console.log('\nStorage Stats:');
    console.log(`  localStorage: ${status.stats.local.keys} items, ${this.formatBytes(status.stats.local.totalSize)}`);
    console.log(`  sessionStorage: ${status.stats.session.keys} items, ${this.formatBytes(status.stats.session.totalSize)}`);
    
    if (status.recommendations.length > 0) {
      console.log('\nRecommendations:');
      status.recommendations.forEach(rec => {
        console.log(`  - ${rec}`);
      });
    }
    
    return status;
  }
  
  log(message) {
    if (this.options.logging) {
      console.log(`[SmartCleanup] ${message}`);
    }
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Usage
const manager = new SmartCleanupManager({
  autoStart: true,
  aggressive: false,
  logging: true
});

// Get status report
const status = manager.getStatus();
console.log('Storage healthy:', status.healthy);

// Generate full report
manager.generateReport();

// Force cleanup if needed
if (!status.healthy) {
  manager.forceCleanup();
}

// Stop when not needed
window.addEventListener('beforeunload', () => {
  manager.stop();
});
```

### Strategy 5: Predictive Cleanup

```javascript
class PredictiveCleanup {
  constructor() {
    this.history = this.loadHistory();
    this.predictionInterval = null;
  }
  
  start() {
    // Track storage growth
    this.trackGrowth();
    
    // Start predictive monitoring
    this.predictionInterval = setInterval(() => {
      this.predict();
    }, 600000); // Every 10 minutes
  }
  
  stop() {
    if (this.predictionInterval) {
      clearInterval(this.predictionInterval);
    }
  }
  
  trackGrowth() {
    const stats = Storage.stats();
    
    this.history.push({
      timestamp: Date.now(),
      size: stats.local.totalSize,
      items: stats.local.keys
    });
    
    // Keep last 100 data points
    if (this.history.length > 100) {
      this.history.shift();
    }
    
    this.saveHistory();
  }
  
  predict() {
    if (this.history.length < 10) {
      return; // Not enough data
    }
    
    // Calculate growth rate
    const recent = this.history.slice(-10);
    const oldest = recent[0];
    const newest = recent[recent.length - 1];
    
    const timeSpan = newest.timestamp - oldest.timestamp;
    const sizeGrowth = newest.size - oldest.size;
    const growthRate = sizeGrowth / timeSpan; // bytes per ms
    
    // Predict when storage will be full
    const maxSize = 5000000; // 5 MB
    const remaining = maxSize - newest.size;
    const timeToFull = remaining / growthRate;
    
    // If will be full within 1 hour, run cleanup
    if (timeToFull < 3600000) {
      console.warn('⚠️ Storage predicted to be full soon. Running cleanup...');
      this.performPreventiveCleanup();
    }
    
    this.trackGrowth(); // Update history
  }
  
  performPreventiveCleanup() {
    const before = Storage.stats();
    Storage.cleanup();
    const after = Storage.stats();
    
    const freed = before.local.totalSize - after.local.totalSize;
    console.log(`Preventive cleanup freed ${this.formatBytes(freed)}`);
  }
  
  loadHistory() {
    return Storage.get('_cleanup_history', []);
  }
  
  saveHistory() {
    Storage.set('_cleanup_history', this.history);
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Usage
const predictive = new PredictiveCleanup();
predictive.start();
```

---

## Summary

**Quick Reference:**

| Method | Purpose | Returns |
|--------|---------|---------|
| `cleanup()` | Remove expired items | `number` or `{local, session}` |
| `stats()` | Get storage statistics | Stats object(s) |

**Cleanup Returns:**
```javascript
// Single storage
const removed = storage.cleanup(); // number

// Both storage types
const results = Storage.cleanup();
// { local: number, session: number }
```

**Stats Returns:**
```javascript
// Single storage
const stats = storage.stats();
// {
//   keys: number,
//   totalSize: number,
//   averageSize: number,
//   namespace: string,
//   storageType: string
// }

// Both storage types
const allStats = Storage.stats();
// {
//   local: {...},
//   session: {...}
// }
```

**Key Points:**

✅ **Regular cleanup** prevents storage quota issues  
✅ **Monitor stats** to track usage and health  
✅ **Automate maintenance** with scheduled tasks  
✅ **Preventive cleanup** before critical operations  
✅ **Log results** for debugging and monitoring  

**Best Practices:**

1. **Run cleanup regularly** (hourly or daily)
2. **Monitor before saving large data**
3. **Check stats to identify issues**
4. **Automate with intervals or events**
5. **Log cleanup results for visibility**
6. **Handle errors gracefully**
7. **Use namespace-specific cleanup**

**Automation Options:**

- ⏰ Time-based (intervals)
- 📊 Threshold-based (size/count limits)
- 🎯 Event-based (page load, visibility)
- 🧠 Predictive (growth analysis)
- 🎛️ Combined (smart manager)

**When to Clean:**

- App initialization
- Before saving large data
- Periodically (hourly/daily)
- On page visibility change
- When storage is nearly full
- Before unload (session data)

Proper maintenance keeps your storage healthy, efficient, and prevents quota exceeded errors!