# Statistics Object Properties

Complete documentation for the statistics object returned by the `stats()` method in the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Properties Reference](#properties-reference)
   - [keys](#keys)
   - [totalSize](#totalsize)
   - [averageSize](#averagesize)
   - [namespace](#namespace)
   - [storageType](#storagetype)
3. [Return Format](#return-format)
4. [Use Cases](#use-cases)
5. [Examples](#examples)
6. [Interpreting Statistics](#interpreting-statistics)
7. [Monitoring and Alerts](#monitoring-and-alerts)

---

## Overview

The `stats()` method returns a statistics object containing detailed information about storage usage. This object provides insights into how much data is stored, how it's organized, and where it's located.

**Key Benefits:**
- 📊 **Usage monitoring** - Track storage consumption
- 🔍 **Performance insights** - Identify storage bottlenecks
- 🎯 **Quota management** - Prevent storage overflow
- 📈 **Analytics** - Understand data patterns
- 🛠️ **Debugging** - Diagnose storage issues

---

## Properties Reference

### keys

Number of items stored in the storage area.

#### Type

**`number`**

#### Description

Count of all non-expired key-value pairs in the storage area. For namespaced storage, only counts keys within that namespace.

#### Range

- Minimum: `0` (empty storage)
- Maximum: Browser-dependent (typically no hard limit on count, but size limited)

#### Examples

```javascript
// Get stats for localStorage
const stats = Storage.stats();
console.log(stats.local.keys);  // e.g., 15

// Get stats for specific namespace
const blogStats = Storage.namespace('blog').stats();
console.log(blogStats.keys);  // e.g., 5

// Get stats for sessionStorage
const sessionStats = Storage.session.stats();
console.log(sessionStats.keys);  // e.g., 3

// Empty storage
Storage.clear();
const emptyStats = Storage.stats();
console.log(emptyStats.local.keys);  // 0
```

#### What It Counts

```javascript
// Set some items
Storage.set('key1', 'value1');
Storage.set('key2', 'value2');
Storage.set('key3', 'value3');

const stats = Storage.stats();
console.log(stats.local.keys);  // 3

// Expired items are not counted
Storage.set('temp', 'value', { expires: 1 });
setTimeout(() => {
  const newStats = Storage.stats();
  console.log(newStats.local.keys);  // Still 3 (expired item excluded)
}, 2000);

// Namespace isolation
const userStorage = Storage.namespace('user');
userStorage.set('name', 'John');
userStorage.set('email', 'john@example.com');

console.log(userStorage.stats().keys);  // 2 (only user namespace)
console.log(Storage.stats().local.keys);  // 5 (all items including namespaced)
```

---

### totalSize

Total size of all stored data in bytes.

#### Type

**`number`**

#### Unit

Bytes

#### Description

Approximate total size of all serialized values in storage. Calculated by serializing all values to JSON and measuring the resulting string length. Does not include storage overhead or key names.

#### Range

- Minimum: `0` (empty storage)
- Maximum: Browser-dependent (typically 5-10 MB for localStorage/sessionStorage)

#### Accuracy

Approximate - represents JSON serialized size, actual browser storage size may vary slightly due to:
- Storage engine overhead
- Key name storage
- Internal metadata
- Encoding differences

#### Examples

```javascript
// Get total size
const stats = Storage.stats();
console.log(stats.local.totalSize);  // e.g., 2048 bytes

// Large data example
const largeData = 'x'.repeat(1000000);  // 1 MB of data
Storage.set('large', largeData);

const newStats = Storage.stats();
console.log(newStats.local.totalSize);  // ~1,000,000 bytes

// Format for display
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

console.log(formatBytes(stats.local.totalSize));  // e.g., "2 KB"
```

#### What It Measures

```javascript
// Simple string
Storage.set('name', 'John');  // ~4 bytes

// Object (includes JSON structure)
Storage.set('user', {
  name: 'John',
  age: 30
});  // ~20-30 bytes (depends on serialization)

// Array
Storage.set('items', [1, 2, 3, 4, 5]);  // ~10-15 bytes

// Check size
const stats = Storage.stats();
console.log(`Total: ${stats.local.totalSize} bytes`);
console.log(`Average: ${stats.local.averageSize} bytes per item`);
```

---

### averageSize

Average size per stored item in bytes.

#### Type

**`number`**

#### Unit

Bytes per item

#### Description

Average size of each stored value, calculated as `totalSize / keys`. Useful for understanding if storage contains many small items or few large items.

#### Calculation

```
averageSize = totalSize / keys
```

If `keys === 0`, returns `0`.

#### Range

- Minimum: `0` (empty storage or very small items)
- Typical: `100-1000` bytes per item
- Large: `>10,000` bytes per item

#### Examples

```javascript
// Many small items
Storage.set('a', '1');
Storage.set('b', '2');
Storage.set('c', '3');

let stats = Storage.stats();
console.log(stats.local.averageSize);  // ~1 byte per item

// Few large items
Storage.clear();
Storage.set('large1', 'x'.repeat(10000));
Storage.set('large2', 'y'.repeat(10000));

stats = Storage.stats();
console.log(stats.local.averageSize);  // ~10,000 bytes per item

// Mixed sizes
Storage.clear();
Storage.set('small', 'data');
Storage.set('medium', { name: 'John', data: 'x'.repeat(1000) });
Storage.set('large', 'z'.repeat(100000));

stats = Storage.stats();
console.log(stats.local.averageSize);  // ~33,000 bytes per item
console.log(stats.local.keys);  // 3 items
console.log(stats.local.totalSize);  // ~100,000 bytes total
```

#### Interpretation

```javascript
const stats = Storage.stats().local;

if (stats.averageSize < 100) {
  console.log('Storage has many small items (good for performance)');
} else if (stats.averageSize < 1000) {
  console.log('Storage has moderate-sized items (normal)');
} else if (stats.averageSize < 10000) {
  console.log('Storage has large items (monitor usage)');
} else {
  console.log('Storage has very large items (consider optimization)');
}
```

---

### namespace

Current namespace being analyzed.

#### Type

**`string`**

#### Description

The namespace of the storage instance being measured. Returns `'global'` for non-namespaced storage, or the actual namespace string for namespaced instances.

#### Values

- `'global'` - Main storage without namespace
- Any string - The namespace name used

#### Examples

```javascript
// Global storage (no namespace)
const stats = Storage.stats();
console.log(stats.local.namespace);  // 'global'

// Namespaced storage
const blogStorage = Storage.namespace('blog');
const blogStats = blogStorage.stats();
console.log(blogStats.namespace);  // 'blog'

// Nested namespace
const postsStorage = Storage.namespace('blog').namespace('posts');
const postsStats = postsStorage.stats();
console.log(postsStats.namespace);  // 'blog:posts'

// User-specific namespace
const userStorage = Storage.namespace(`user:${userId}`);
const userStats = userStorage.stats();
console.log(userStats.namespace);  // 'user:123'
```

#### Use Cases

```javascript
// Identify which storage area
function displayStats(storage, label) {
  const stats = storage.stats();
  console.log(`${label} (${stats.namespace}):`);
  console.log(`  Items: ${stats.keys}`);
  console.log(`  Size: ${formatBytes(stats.totalSize)}`);
}

displayStats(Storage, 'Main Storage');
// Main Storage (global):
//   Items: 10
//   Size: 2.5 KB

displayStats(Storage.namespace('cache'), 'Cache');
// Cache (cache):
//   Items: 5
//   Size: 1.2 KB

// Compare namespaces
function compareNamespaces() {
  const global = Storage.stats().local;
  const blog = Storage.namespace('blog').stats();
  const cache = Storage.namespace('cache').stats();
  
  console.log('Storage Distribution:');
  console.log(`  ${global.namespace}: ${global.keys} items`);
  console.log(`  ${blog.namespace}: ${blog.keys} items`);
  console.log(`  ${cache.namespace}: ${cache.keys} items`);
}
```

---

### storageType

Type of storage being measured.

#### Type

**`string`**

#### Values

- `'localStorage'` - Persistent storage
- `'sessionStorage'` - Temporary storage (cleared on tab close)

#### Description

Indicates which Web Storage API is being analyzed. Useful when comparing statistics across different storage types or when working with both localStorage and sessionStorage.

#### Examples

```javascript
// localStorage
const localStats = Storage.local.stats();
console.log(localStats.storageType);  // 'localStorage'

// sessionStorage
const sessionStats = Storage.session.stats();
console.log(sessionStats.storageType);  // 'sessionStorage'

// Main Storage object (defaults to localStorage)
const mainStats = Storage.stats();
console.log(mainStats.local.storageType);  // 'localStorage'
console.log(mainStats.session.storageType);  // 'sessionStorage'

// Namespaced storage (inherits type)
const blogLocal = Storage.namespace('blog');
console.log(blogLocal.stats().storageType);  // 'localStorage'

const blogSession = Storage.session.namespace('blog');
console.log(blogSession.stats().storageType);  // 'sessionStorage'
```

#### Use Cases

```javascript
// Display storage type in UI
function displayStorageInfo(storage) {
  const stats = storage.stats();
  
  const isPersistent = stats.storageType === 'localStorage';
  const icon = isPersistent ? '💾' : '⏱️';
  const label = isPersistent ? 'Persistent' : 'Temporary';
  
  console.log(`${icon} ${label} Storage (${stats.namespace})`);
  console.log(`  Type: ${stats.storageType}`);
  console.log(`  Items: ${stats.keys}`);
}

// Compare storage types
function compareStorageTypes() {
  const localStats = Storage.local.stats();
  const sessionStats = Storage.session.stats();
  
  console.log('Storage Comparison:');
  console.log(`\n${localStats.storageType}:`);
  console.log(`  Items: ${localStats.keys}`);
  console.log(`  Size: ${formatBytes(localStats.totalSize)}`);
  
  console.log(`\n${sessionStats.storageType}:`);
  console.log(`  Items: ${sessionStats.keys}`);
  console.log(`  Size: ${formatBytes(sessionStats.totalSize)}`);
}

// Conditional logic based on type
function getStorageQuota(storageType) {
  // Different browsers, different quotas
  const quotas = {
    localStorage: 5 * 1024 * 1024,   // ~5 MB
    sessionStorage: 5 * 1024 * 1024  // ~5 MB
  };
  
  return quotas[storageType] || 5 * 1024 * 1024;
}

const stats = Storage.stats().local;
const quota = getStorageQuota(stats.storageType);
const usage = (stats.totalSize / quota) * 100;
console.log(`${stats.storageType} usage: ${usage.toFixed(2)}%`);
```

---

## Return Format

### Single Storage Instance

When calling `stats()` on a specific storage instance:

```javascript
const stats = Storage.stats();
// or
const stats = Storage.namespace('blog').stats();

// Returns:
{
  keys: number,           // Number of items
  totalSize: number,      // Total size in bytes
  averageSize: number,    // Average size per item
  namespace: string,      // Namespace name or 'global'
  storageType: string     // 'localStorage' or 'sessionStorage'
}
```

### Main Storage Object

When calling `stats()` on the main Storage object:

```javascript
const stats = Storage.stats();

// Returns:
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

---

## Use Cases

### 1. Basic Storage Monitoring

```javascript
// Simple monitoring
function checkStorage() {
  const stats = Storage.stats();
  
  console.log('=== Storage Status ===');
  console.log(`localStorage: ${stats.local.keys} items, ${formatBytes(stats.local.totalSize)}`);
  console.log(`sessionStorage: ${stats.session.keys} items, ${formatBytes(stats.session.totalSize)}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Run on page load
checkStorage();
```

### 2. Quota Management

```javascript
// Check if approaching quota
function checkQuota() {
  const stats = Storage.stats().local;
  const quota = 5 * 1024 * 1024; // 5 MB typical quota
  const usage = (stats.totalSize / quota) * 100;
  
  if (usage > 90) {
    alert('⚠️ Storage is over 90% full!');
    Storage.cleanup();
  } else if (usage > 75) {
    console.warn('Storage is over 75% full');
  }
  
  return usage;
}

// Monitor periodically
setInterval(checkQuota, 60000); // Every minute
```

### 3. Performance Analysis

```javascript
// Analyze storage performance
function analyzePerformance() {
  const stats = Storage.stats().local;
  
  console.log('=== Storage Performance Analysis ===');
  console.log(`Total Items: ${stats.keys}`);
  console.log(`Total Size: ${formatBytes(stats.totalSize)}`);
  console.log(`Average Item Size: ${formatBytes(stats.averageSize)}`);
  
  // Recommendations
  if (stats.averageSize > 10000) {
    console.warn('⚠️ Large average item size detected');
    console.log('Consider: Data compression, pagination, or external storage');
  }
  
  if (stats.keys > 500) {
    console.warn('⚠️ High item count detected');
    console.log('Consider: Namespacing, cleanup, or archiving old data');
  }
  
  return {
    efficient: stats.averageSize < 1000 && stats.keys < 200,
    needsOptimization: stats.averageSize > 10000 || stats.keys > 500
  };
}
```

### 4. Namespace Comparison

```javascript
// Compare different namespaces
function compareNamespaces() {
  const namespaces = ['blog', 'cache', 'user', 'forms'];
  const results = [];
  
  namespaces.forEach(ns => {
    const storage = Storage.namespace(ns);
    const stats = storage.stats();
    
    results.push({
      namespace: stats.namespace,
      keys: stats.keys,
      size: stats.totalSize,
      avgSize: stats.averageSize
    });
  });
  
  // Sort by size
  results.sort((a, b) => b.size - a.size);
  
  console.log('=== Namespace Usage ===');
  results.forEach(r => {
    console.log(`${r.namespace}:`);
    console.log(`  Items: ${r.keys}`);
    console.log(`  Size: ${formatBytes(r.size)}`);
    console.log(`  Avg: ${formatBytes(r.avgSize)}`);
    console.log('');
  });
  
  return results;
}
```

### 5. Storage Health Check

```javascript
// Comprehensive health check
function healthCheck() {
  const stats = Storage.stats();
  const quota = 5 * 1024 * 1024;
  
  const health = {
    status: 'healthy',
    issues: [],
    warnings: [],
    recommendations: []
  };
  
  // Check localStorage
  const localUsage = (stats.local.totalSize / quota) * 100;
  
  if (localUsage > 95) {
    health.status = 'critical';
    health.issues.push('localStorage is over 95% full');
  } else if (localUsage > 80) {
    health.status = 'warning';
    health.warnings.push('localStorage is over 80% full');
  }
  
  if (stats.local.keys > 1000) {
    health.warnings.push('Very high item count in localStorage');
    health.recommendations.push('Consider using namespaces and cleanup');
  }
  
  if (stats.local.averageSize > 50000) {
    health.warnings.push('Large average item size');
    health.recommendations.push('Consider data compression or external storage');
  }
  
  // Check sessionStorage
  const sessionUsage = (stats.session.totalSize / quota) * 100;
  
  if (sessionUsage > 80) {
    health.warnings.push('sessionStorage is over 80% full');
  }
  
  return health;
}

// Run health check
const health = healthCheck();
console.log('Storage Health:', health.status);
if (health.issues.length > 0) {
  console.error('Issues:', health.issues);
}
if (health.warnings.length > 0) {
  console.warn('Warnings:', health.warnings);
}
if (health.recommendations.length > 0) {
  console.log('Recommendations:', health.recommendations);
}
```

---

## Examples

### Example 1: Storage Dashboard

```javascript
class StorageDashboard {
  constructor() {
    this.updateInterval = null;
  }
  
  start() {
    this.update();
    this.updateInterval = setInterval(() => this.update(), 5000);
  }
  
  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
  
  update() {
    const stats = Storage.stats();
    
    this.updateDisplay('local', stats.local);
    this.updateDisplay('session', stats.session);
    this.updateSummary(stats);
  }
  
  updateDisplay(type, stats) {
    console.log(`\n=== ${stats.storageType} ===`);
    console.log(`Namespace: ${stats.namespace}`);
    console.log(`Items: ${stats.keys}`);
    console.log(`Total Size: ${this.formatBytes(stats.totalSize)}`);
    console.log(`Average Size: ${this.formatBytes(stats.averageSize)}`);
    console.log(`Usage: ${this.getUsagePercent(stats)}%`);
  }
  
  updateSummary(stats) {
    const totalItems = stats.local.keys + stats.session.keys;
    const totalSize = stats.local.totalSize + stats.session.totalSize;
    
    console.log(`\n=== Summary ===`);
    console.log(`Total Items: ${totalItems}`);
    console.log(`Total Size: ${this.formatBytes(totalSize)}`);
  }
  
  getUsagePercent(stats) {
    const quota = 5 * 1024 * 1024; // 5 MB
    return Math.round((stats.totalSize / quota) * 100);
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
const dashboard = new StorageDashboard();
dashboard.start();

// Stop after 30 seconds
setTimeout(() => dashboard.stop(), 30000);
```

### Example 2: Storage Alerts

```javascript
class StorageAlerts {
  constructor(options = {}) {
    this.thresholds = {
      warning: options.warningThreshold || 75,
      critical: options.criticalThreshold || 90
    };
    this.lastAlerts = {
      local: null,
      session: null
    };
  }
  
  check() {
    const stats = Storage.stats();
    
    this.checkStorage('local', stats.local);
    this.checkStorage('session', stats.session);
  }
  
  checkStorage(type, stats) {
    const usage = this.getUsagePercent(stats);
    const currentLevel = this.getAlertLevel(usage);
    const lastLevel = this.lastAlerts[type];
    
    // Only alert if level changed or is critical
    if (currentLevel !== lastLevel || currentLevel === 'critical') {
      this.sendAlert(type, stats, usage, currentLevel);
      this.lastAlerts[type] = currentLevel;
    }
  }
  
  getUsagePercent(stats) {
    const quota = 5 * 1024 * 1024;
    return (stats.totalSize / quota) * 100;
  }
  
  getAlertLevel(usage) {
    if (usage >= this.thresholds.critical) return 'critical';
    if (usage >= this.thresholds.warning) return 'warning';
    return 'normal';
  }
  
  sendAlert(type, stats, usage, level) {
    const message = this.formatAlert(type, stats, usage, level);
    
    if (level === 'critical') {
      console.error(message);
      this.showNotification(message, 'error');
    } else if (level === 'warning') {
      console.warn(message);
      this.showNotification(message, 'warning');
    } else {
      console.log(message);
    }
  }
  
  formatAlert(type, stats, usage, level) {
    const icon = level === 'critical' ? '🚨' : level === 'warning' ? '⚠️' : 'ℹ️';
    
    return `
${icon} Storage Alert: ${stats.storageType}
Level: ${level.toUpperCase()}
Usage: ${usage.toFixed(2)}%
Items: ${stats.keys}
Size: ${this.formatBytes(stats.totalSize)}
Namespace: ${stats.namespace}
    `.trim();
  }
  
  showNotification(message, type) {
    // Implementation depends on your notification system
    if (typeof alert !== 'undefined' && type === 'critical') {
      alert(message);
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
const alerts = new StorageAlerts({
  warningThreshold: 75,
  criticalThreshold: 90
});

// Check every minute
setInterval(() => alerts.check(), 60000);

// Initial check
alerts.check();
```

### Example 3: Storage Analytics

```javascript
class StorageAnalytics {
  constructor() {
    this.history = this.loadHistory();
  }
  
  track() {
    const stats = Storage.stats();
    
    const snapshot = {
      timestamp: Date.now(),
      local: {
        keys: stats.local.keys,
        totalSize: stats.local.totalSize,
        averageSize: stats.local.averageSize
      },
      session: {
        keys: stats.session.keys,
        totalSize: stats.session.totalSize,
        averageSize: stats.session.averageSize
      }
    };
    
    this.history.push(snapshot);
    
    // Keep last 100 snapshots
    if (this.history.length > 100) {
      this.history.shift();
    }
    
    this.saveHistory();
    
    return snapshot;
  }
  
  getGrowthRate(type = 'local') {
    if (this.history.length < 2) return 0;
    
    const recent = this.history.slice(-10);
    const oldest = recent[0][type];
    const newest = recent[recent.length - 1][type];
    
    const timeSpan = newest.timestamp - oldest.timestamp;
    const sizeGrowth = newest.totalSize - oldest.totalSize;
    
    // Bytes per millisecond
    return sizeGrowth / timeSpan;
  }
  
  predictFullDate(type = 'local') {
    const growthRate = this.getGrowthRate(type);
    
    if (growthRate <= 0) return null;
    
    const stats = Storage.stats()[type];
    const quota = 5 * 1024 * 1024;
    const remaining = quota - stats.totalSize;
    
    const msUntilFull = remaining / growthRate;
    return new Date(Date.now() + msUntilFull);
  }
  
  generateReport() {
    const stats = Storage.stats();
    const localGrowth = this.getGrowthRate('local');
    const sessionGrowth = this.getGrowthRate('session');
    const fullDate = this.predictFullDate('local');
    
    console.log('=== Storage Analytics Report ===\n');
    
    console.log('Current Status:');
    console.log(`  localStorage: ${stats.local.keys} items, ${this.formatBytes(stats.local.totalSize)}`);
    console.log(`  sessionStorage: ${stats.session.keys} items, ${this.formatBytes(stats.session.totalSize)}`);
    
    console.log('\nGrowth Rates:');
    console.log(`  localStorage: ${this.formatBytes(localGrowth * 1000)}/second`);
    console.log(`  sessionStorage: ${this.formatBytes(sessionGrowth * 1000)}/second`);
    
    if (fullDate) {
      console.log('\nPredictions:');
      console.log(`  localStorage will be full: ${fullDate.toLocaleString()}`);
      console.log(`  Time remaining: ${this.formatTimeRemaining(fullDate - Date.now())}`);
    }
    
    console.log('\nRecommendations:');
    this.getRecommendations(stats).forEach(rec => {
      console.log(`  • ${rec}`);
    });
  }
  
  getRecommendations(stats) {
    const recommendations = [];
    
    if (stats.local.keys > 500) {
      recommendations.push('High item count - consider cleanup or archiving');
    }
    
    if (stats.local.averageSize > 10000) {
      recommendations.push('Large average size - consider compression');
    }
    
    const quota = 5 * 1024 * 1024;
    const usage = (stats.local.totalSize / quota) * 100;
    
    if (usage > 80) {
      recommendations.push('High storage usage - run cleanup soon');
    }
    
    return recommendations;
  }
  
  loadHistory() {
    return Storage.get('_storage_analytics_history', []);
  }
  
  saveHistory() {
    Storage.set('_storage_analytics_history', this.history);
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  formatTimeRemaining(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} days`;
    if (hours > 0) return `${hours} hours`;
    if (minutes > 0) return `${minutes} minutes`;
    return `${seconds} seconds`;
  }
}

// Usage
const analytics = new StorageAnalytics();

// Track every 10 minutes
setInterval(() => analytics.track(), 600000);

// Generate report
analytics.generateReport();
```

---

## Interpreting Statistics

### Storage Health Matrix

```javascript
function interpretStats(stats) {
  const quota = 5 * 1024 * 1024;
  const usage = (stats.totalSize / quota) * 100;
  
  const interpretation = {
    health: 'unknown',
    issues: [],
    recommendations: []
  };
  
  // Usage-based health
  if (usage < 50) {
    interpretation.health = 'excellent';
  } else if (usage < 75) {
    interpretation.health = 'good';
  } else if (usage < 90) {
    interpretation.health = 'warning';
    interpretation.issues.push('Storage usage is high');
    interpretation.recommendations.push('Consider running cleanup');
  } else {
    interpretation.health = 'critical';
    interpretation.issues.push('Storage nearly full');
    interpretation.recommendations.push('Immediate cleanup required');
  }
  
  // Item count analysis
  if (stats.keys > 1000) {
    interpretation.issues.push('Very high item count');
    interpretation.recommendations.push('Use namespaces for better organization');
  } else if (stats.keys > 500) {
    interpretation.recommendations.push('Consider periodic cleanup');
  }
  
  // Average size analysis
  if (stats.averageSize > 50000) {
    interpretation.issues.push('Very large average item size');
    interpretation.recommendations.push('Consider data compression or external storage');
  } else if (stats.averageSize > 10000) {
    interpretation.recommendations.push('Monitor large items for optimization opportunities');
  }
  
  // Efficiency score (0-100)
  const efficiencyFactors = [
    usage < 75 ? 40 : Math.max(0, 40 - (usage - 75)),
    stats.keys < 500 ? 30 : Math.max(0, 30 - ((stats.keys - 500) / 10)),
    stats.averageSize < 10000 ? 30 : Math.max(0, 30 - ((stats.averageSize - 10000) / 1000))
  ];
  
  interpretation.efficiencyScore = Math.round(efficiencyFactors.reduce((a, b) => a + b, 0));
  
  return interpretation;
}

// Usage
const stats = Storage.stats().local;
const interpretation = interpretStats(stats);

console.log('Storage Health:', interpretation.health);
console.log('Efficiency Score:', interpretation.efficiencyScore + '/100');

if (interpretation.issues.length > 0) {
  console.log('\nIssues:');
  interpretation.issues.forEach(issue => console.log(`  ⚠️ ${issue}`));
}

if (interpretation.recommendations.length > 0) {
  console.log('\nRecommendations:');
  interpretation.recommendations.forEach(rec => console.log(`  💡 ${rec}`));
}
```

### Comparative Analysis

```javascript
function compareStorageAreas() {
  const areas = [
    { name: 'Global', storage: Storage },
    { name: 'Blog', storage: Storage.namespace('blog') },
    { name: 'Cache', storage: Storage.namespace('cache') },
    { name: 'User', storage: Storage.namespace('user') },
    { name: 'Forms', storage: Storage.namespace('forms') }
  ];
  
  const comparison = areas.map(area => {
    const stats = area.storage.stats();
    return {
      name: area.name,
      namespace: stats.namespace,
      keys: stats.keys,
      totalSize: stats.totalSize,
      averageSize: stats.averageSize,
      storageType: stats.storageType
    };
  });
  
  // Sort by size
  comparison.sort((a, b) => b.totalSize - a.totalSize);
  
  console.log('=== Storage Area Comparison ===\n');
  
  comparison.forEach((area, index) => {
    console.log(`${index + 1}. ${area.name} (${area.namespace}):`);
    console.log(`   Type: ${area.storageType}`);
    console.log(`   Items: ${area.keys}`);
    console.log(`   Size: ${formatBytes(area.totalSize)}`);
    console.log(`   Avg: ${formatBytes(area.averageSize)}`);
    console.log('');
  });
  
  // Calculate percentages
  const totalSize = comparison.reduce((sum, area) => sum + area.totalSize, 0);
  
  console.log('Size Distribution:');
  comparison.forEach(area => {
    const percent = ((area.totalSize / totalSize) * 100).toFixed(1);
    console.log(`  ${area.name}: ${percent}%`);
  });
  
  return comparison;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Run comparison
compareStorageAreas();
```

---

## Monitoring and Alerts

### Real-time Monitor

```javascript
class StorageMonitor {
  constructor(options = {}) {
    this.options = {
      updateInterval: options.updateInterval || 5000,
      alertThreshold: options.alertThreshold || 80,
      logChanges: options.logChanges !== false,
      ...options
    };
    
    this.previousStats = null;
    this.monitorInterval = null;
  }
  
  start() {
    console.log('🔍 Storage Monitor started');
    
    this.update();
    this.monitorInterval = setInterval(() => {
      this.update();
    }, this.options.updateInterval);
  }
  
  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
      console.log('🔍 Storage Monitor stopped');
    }
  }
  
  update() {
    const stats = Storage.stats();
    
    if (this.previousStats) {
      this.detectChanges(stats);
    }
    
    this.checkAlerts(stats);
    this.previousStats = stats;
  }
  
  detectChanges(currentStats) {
    const changes = {
      local: this.compareStats(this.previousStats.local, currentStats.local),
      session: this.compareStats(this.previousStats.session, currentStats.session)
    };
    
    if (this.options.logChanges) {
      if (changes.local.hasChanges) {
        console.log('📊 localStorage changed:', changes.local);
      }
      if (changes.session.hasChanges) {
        console.log('📊 sessionStorage changed:', changes.session);
      }
    }
    
    return changes;
  }
  
  compareStats(prev, current) {
    const keysDiff = current.keys - prev.keys;
    const sizeDiff = current.totalSize - prev.totalSize;
    
    return {
      hasChanges: keysDiff !== 0 || sizeDiff !== 0,
      keysDiff,
      sizeDiff,
      keys: current.keys,
      totalSize: current.totalSize
    };
  }
  
  checkAlerts(stats) {
    this.checkStorageAlert('localStorage', stats.local);
    this.checkStorageAlert('sessionStorage', stats.session);
  }
  
  checkStorageAlert(name, stats) {
    const quota = 5 * 1024 * 1024;
    const usage = (stats.totalSize / quota) * 100;
    
    if (usage >= this.options.alertThreshold) {
      console.warn(`⚠️ ${name} is at ${usage.toFixed(1)}% capacity!`);
      console.warn(`   Items: ${stats.keys}, Size: ${this.formatBytes(stats.totalSize)}`);
      
      if (usage >= 95) {
        console.error('🚨 Critical: Storage almost full!');
        this.onCritical(stats);
      }
    }
  }
  
  onCritical(stats) {
    // Override this method to add custom critical handling
    console.log('Running automatic cleanup...');
    Storage.cleanup();
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  getReport() {
    const stats = Storage.stats();
    
    return {
      timestamp: new Date().toISOString(),
      local: {
        namespace: stats.local.namespace,
        storageType: stats.local.storageType,
        keys: stats.local.keys,
        totalSize: stats.local.totalSize,
        averageSize: stats.local.averageSize,
        usage: this.getUsagePercent(stats.local)
      },
      session: {
        namespace: stats.session.namespace,
        storageType: stats.session.storageType,
        keys: stats.session.keys,
        totalSize: stats.session.totalSize,
        averageSize: stats.session.averageSize,
        usage: this.getUsagePercent(stats.session)
      }
    };
  }
  
  getUsagePercent(stats) {
    const quota = 5 * 1024 * 1024;
    return Math.round((stats.totalSize / quota) * 100);
  }
}

// Usage
const monitor = new StorageMonitor({
  updateInterval: 10000,  // Check every 10 seconds
  alertThreshold: 75,     // Alert at 75% usage
  logChanges: true
});

monitor.start();

// Get report anytime
const report = monitor.getReport();
console.log('Storage Report:', report);

// Stop monitoring when needed
// monitor.stop();
```

### Custom Dashboard Widget

```javascript
class StorageWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
    this.startUpdating();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="storage-widget">
        <h3>Storage Monitor</h3>
        
        <div class="storage-item">
          <h4>localStorage</h4>
          <div class="stats">
            <div class="stat">
              <span class="label">Items:</span>
              <span id="local-keys" class="value">-</span>
            </div>
            <div class="stat">
              <span class="label">Size:</span>
              <span id="local-size" class="value">-</span>
            </div>
            <div class="stat">
              <span class="label">Average:</span>
              <span id="local-avg" class="value">-</span>
            </div>
          </div>
          <div class="progress-bar">
            <div id="local-progress" class="progress-fill"></div>
            <span id="local-percent" class="progress-text">0%</span>
          </div>
        </div>
        
        <div class="storage-item">
          <h4>sessionStorage</h4>
          <div class="stats">
            <div class="stat">
              <span class="label">Items:</span>
              <span id="session-keys" class="value">-</span>
            </div>
            <div class="stat">
              <span class="label">Size:</span>
              <span id="session-size" class="value">-</span>
            </div>
            <div class="stat">
              <span class="label">Average:</span>
              <span id="session-avg" class="value">-</span>
            </div>
          </div>
          <div class="progress-bar">
            <div id="session-progress" class="progress-fill"></div>
            <span id="session-percent" class="progress-text">0%</span>
          </div>
        </div>
        
        <div class="actions">
          <button id="cleanup-btn" class="btn">Cleanup</button>
          <button id="refresh-btn" class="btn">Refresh</button>
        </div>
      </div>
    `;
    
    this.attachEvents();
    this.addStyles();
  }
  
  attachEvents() {
    document.getElementById('cleanup-btn').onclick = () => {
      const results = Storage.cleanup();
      alert(`Cleaned ${results.local + results.session} expired items`);
      this.update();
    };
    
    document.getElementById('refresh-btn').onclick = () => {
      this.update();
    };
  }
  
  startUpdating() {
    this.update();
    setInterval(() => this.update(), 5000);
  }
  
  update() {
    const stats = Storage.stats();
    
    this.updateStorage('local', stats.local);
    this.updateStorage('session', stats.session);
  }
  
  updateStorage(type, stats) {
    const quota = 5 * 1024 * 1024;
    const usage = (stats.totalSize / quota) * 100;
    
    document.getElementById(`${type}-keys`).textContent = stats.keys;
    document.getElementById(`${type}-size`).textContent = this.formatBytes(stats.totalSize);
    document.getElementById(`${type}-avg`).textContent = this.formatBytes(stats.averageSize);
    document.getElementById(`${type}-percent`).textContent = `${Math.round(usage)}%`;
    
    const progressBar = document.getElementById(`${type}-progress`);
    progressBar.style.width = `${Math.min(usage, 100)}%`;
    progressBar.className = `progress-fill ${this.getProgressClass(usage)}`;
  }
  
  getProgressClass(percent) {
    if (percent >= 90) return 'danger';
    if (percent >= 75) return 'warning';
    return 'success';
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  addStyles() {
    if (document.getElementById('storage-widget-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'storage-widget-styles';
    style.textContent = `
      .storage-widget {
        font-family: system-ui, -apple-system, sans-serif;
        padding: 20px;
        background: #f5f5f5;
        border-radius: 8px;
        max-width: 500px;
      }
      
      .storage-widget h3 {
        margin: 0 0 20px 0;
        color: #333;
      }
      
      .storage-item {
        background: white;
        padding: 15px;
        border-radius: 6px;
        margin-bottom: 15px;
      }
      
      .storage-item h4 {
        margin: 0 0 10px 0;
        color: #666;
        font-size: 14px;
        text-transform: uppercase;
      }
      
      .stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 15px;
      }
      
      .stat {
        display: flex;
        flex-direction: column;
      }
      
      .stat .label {
        font-size: 12px;
        color: #999;
        margin-bottom: 4px;
      }
      
      .stat .value {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      
      .progress-bar {
        position: relative;
        height: 24px;
        background: #e0e0e0;
        border-radius: 12px;
        overflow: hidden;
      }
      
      .progress-fill {
        height: 100%;
        transition: width 0.3s, background-color 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .progress-fill.success {
        background: linear-gradient(90deg, #4CAF50, #45a049);
      }
      
      .progress-fill.warning {
        background: linear-gradient(90deg, #ff9800, #f57c00);
      }
      
      .progress-fill.danger {
        background: linear-gradient(90deg, #f44336, #d32f2f);
      }
      
      .progress-text {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        font-weight: bold;
        color: #333;
      }
      
      .actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
      }
      
      .btn {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 6px;
        background: #2196F3;
        color: white;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .btn:hover {
        background: #1976D2;
      }
      
      .btn:active {
        transform: scale(0.98);
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Usage
const widget = new StorageWidget('storage-dashboard');
```

---

## Summary

**Statistics Object Properties:**

```javascript
{
  keys: number,           // Number of stored items
  totalSize: number,      // Total size in bytes
  averageSize: number,    // Average size per item in bytes
  namespace: string,      // Namespace name or 'global'
  storageType: string     // 'localStorage' or 'sessionStorage'
}
```

**Quick Reference:**

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `keys` | `number` | Item count | `15` |
| `totalSize` | `number` | Total bytes | `2048` |
| `averageSize` | `number` | Avg bytes/item | `136` |
| `namespace` | `string` | Namespace name | `'blog'` or `'global'` |
| `storageType` | `string` | Storage type | `'localStorage'` |

**Usage Examples:**

```javascript
// Single storage
const stats = Storage.namespace('blog').stats();
console.log(stats.keys);        // 5
console.log(stats.totalSize);   // 1024
console.log(stats.averageSize); // 204
console.log(stats.namespace);   // 'blog'
console.log(stats.storageType); // 'localStorage'

// Both storage types
const allStats = Storage.stats();
console.log(allStats.local.keys);    // localStorage items
console.log(allStats.session.keys);  // sessionStorage items
```

**Common Use Cases:**

- 📊 Storage monitoring
- 🎯 Quota management
- ⚡ Performance analysis
- 🔍 Debugging
- 📈 Analytics tracking
- ⚠️ Alert systems
- 🎛️ Dashboard widgets

**Key Insights:**

✅ **Monitor regularly** - Track usage over time  
✅ **Set thresholds** - Alert before quotas are exceeded  
✅ **Analyze patterns** - Understand data growth  
✅ **Optimize based on stats** - Use insights for improvements  
✅ **Compare namespaces** - Identify heavy users  
✅ **Track changes** - Detect anomalies  
✅ **Plan capacity** - Predict future needs  

**Typical Values:**

- **Small app**: 5-20 keys, 1-10 KB total
- **Medium app**: 20-100 keys, 10-100 KB total
- **Large app**: 100-500 keys, 100 KB - 2 MB total
- **Alert threshold**: 75-80% of 5 MB quota
- **Critical threshold**: 90-95% of quota

The statistics object provides comprehensive insights into storage usage, enabling effective monitoring, optimization, and capacity planning!