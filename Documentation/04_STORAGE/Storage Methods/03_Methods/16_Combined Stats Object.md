# Combined Stats Object

Complete documentation for the combined statistics object returned by `Storage.stats()` in the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Object Structure](#object-structure)
3. [Properties Reference](#properties-reference)
   - [local](#local)
   - [session](#session)
4. [Use Cases](#use-cases)
5. [Examples](#examples)
6. [Comparison and Analysis](#comparison-and-analysis)
7. [Best Practices](#best-practices)

---

## Overview

When calling `Storage.stats()` on the main Storage object (not a specific instance), it returns a combined statistics object containing separate statistics for both localStorage and sessionStorage. This allows you to monitor and compare both storage types simultaneously.

**Key Benefits:**
- 📊 **Unified view** - See both storage types at once
- 🔄 **Easy comparison** - Compare local vs session usage
- 📈 **Total tracking** - Calculate combined statistics
- 🎯 **Comprehensive monitoring** - Monitor all storage in one call
- 🛠️ **Efficient** - Single method call for complete overview

---

## Object Structure

### Complete Structure

```javascript
const stats = Storage.stats();

// Returns:
{
  local: {
    keys: number,           // Number of items in localStorage
    totalSize: number,      // Total size in bytes
    averageSize: number,    // Average size per item
    namespace: string,      // 'global' for main Storage
    storageType: string     // 'localStorage'
  },
  session: {
    keys: number,           // Number of items in sessionStorage
    totalSize: number,      // Total size in bytes
    averageSize: number,    // Average size per item
    namespace: string,      // 'global' for main Storage
    storageType: string     // 'sessionStorage'
  }
}
```

### Example Output

```javascript
const stats = Storage.stats();
console.log(stats);

// Output:
{
  local: {
    keys: 15,
    totalSize: 2048,
    averageSize: 136,
    namespace: 'global',
    storageType: 'localStorage'
  },
  session: {
    keys: 3,
    totalSize: 512,
    averageSize: 170,
    namespace: 'global',
    storageType: 'sessionStorage'
  }
}
```

---

## Properties Reference

### local

Statistics for localStorage (persistent storage).

#### Type

**`object`**

#### Structure

```javascript
{
  keys: number,           // Number of items
  totalSize: number,      // Total bytes
  averageSize: number,    // Average bytes per item
  namespace: string,      // Namespace name or 'global'
  storageType: string     // 'localStorage'
}
```

#### Description

Contains complete statistics about localStorage usage, including item count, sizes, and metadata. This represents persistent data that survives browser restarts.

#### Examples

```javascript
// Access localStorage stats
const stats = Storage.stats();
console.log(stats.local);

// Individual properties
console.log('localStorage items:', stats.local.keys);
console.log('localStorage size:', stats.local.totalSize, 'bytes');
console.log('Average item size:', stats.local.averageSize, 'bytes');
console.log('Storage type:', stats.local.storageType);

// Check if localStorage has data
if (stats.local.keys > 0) {
  console.log('localStorage is in use');
}

// Calculate usage percentage
const quota = 5 * 1024 * 1024; // 5 MB
const usage = (stats.local.totalSize / quota) * 100;
console.log('localStorage usage:', usage.toFixed(2) + '%');
```

#### Use Cases

```javascript
// Monitor localStorage health
function checkLocalStorage() {
  const stats = Storage.stats();
  const local = stats.local;
  
  console.log('=== localStorage Health ===');
  console.log(`Items: ${local.keys}`);
  console.log(`Size: ${formatBytes(local.totalSize)}`);
  console.log(`Avg: ${formatBytes(local.averageSize)}`);
  
  if (local.totalSize > 4000000) { // Over 4 MB
    console.warn('⚠️ localStorage is getting full!');
  }
}

// Compare to quota
function getLocalStorageUsage() {
  const stats = Storage.stats();
  const quota = 5 * 1024 * 1024;
  
  return {
    used: stats.local.totalSize,
    available: quota - stats.local.totalSize,
    percentage: (stats.local.totalSize / quota) * 100,
    items: stats.local.keys
  };
}
```

---

### session

Statistics for sessionStorage (temporary storage).

#### Type

**`object`**

#### Structure

```javascript
{
  keys: number,           // Number of items
  totalSize: number,      // Total bytes
  averageSize: number,    // Average bytes per item
  namespace: string,      // Namespace name or 'global'
  storageType: string     // 'sessionStorage'
}
```

#### Description

Contains complete statistics about sessionStorage usage. This represents temporary data that is cleared when the browser tab is closed.

#### Examples

```javascript
// Access sessionStorage stats
const stats = Storage.stats();
console.log(stats.session);

// Individual properties
console.log('sessionStorage items:', stats.session.keys);
console.log('sessionStorage size:', stats.session.totalSize, 'bytes');
console.log('Average item size:', stats.session.averageSize, 'bytes');
console.log('Storage type:', stats.session.storageType);

// Check if sessionStorage is being used
if (stats.session.keys > 0) {
  console.log('Active session data:', stats.session.keys, 'items');
}

// Compare session to local
const ratio = stats.session.totalSize / stats.local.totalSize;
console.log('Session/Local ratio:', ratio.toFixed(2));
```

#### Use Cases

```javascript
// Monitor session data
function checkSessionStorage() {
  const stats = Storage.stats();
  const session = stats.session;
  
  console.log('=== sessionStorage Health ===');
  console.log(`Items: ${session.keys}`);
  console.log(`Size: ${formatBytes(session.totalSize)}`);
  console.log(`Avg: ${formatBytes(session.averageSize)}`);
  
  if (session.totalSize > 1000000) { // Over 1 MB
    console.warn('⚠️ Large session data detected');
  }
}

// Track session activity
function isSessionActive() {
  const stats = Storage.stats();
  return stats.session.keys > 0;
}
```

---

## Use Cases

### 1. Complete Storage Overview

```javascript
// Get complete picture of storage usage
function storageOverview() {
  const stats = Storage.stats();
  
  console.log('=== Storage Overview ===\n');
  
  console.log('localStorage (Persistent):');
  console.log(`  Items: ${stats.local.keys}`);
  console.log(`  Size: ${formatBytes(stats.local.totalSize)}`);
  console.log(`  Average: ${formatBytes(stats.local.averageSize)}`);
  
  console.log('\nsessionStorage (Temporary):');
  console.log(`  Items: ${stats.session.keys}`);
  console.log(`  Size: ${formatBytes(stats.session.totalSize)}`);
  console.log(`  Average: ${formatBytes(stats.session.averageSize)}`);
  
  console.log('\nTotals:');
  const totalItems = stats.local.keys + stats.session.keys;
  const totalSize = stats.local.totalSize + stats.session.totalSize;
  console.log(`  Total Items: ${totalItems}`);
  console.log(`  Total Size: ${formatBytes(totalSize)}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

storageOverview();
```

### 2. Storage Comparison

```javascript
// Compare local vs session storage
function compareStorage() {
  const stats = Storage.stats();
  
  const comparison = {
    itemsRatio: stats.local.keys / (stats.session.keys || 1),
    sizeRatio: stats.local.totalSize / (stats.session.totalSize || 1),
    avgSizeRatio: stats.local.averageSize / (stats.session.averageSize || 1)
  };
  
  console.log('=== Local vs Session Comparison ===\n');
  
  console.log('Item Count:');
  console.log(`  Local: ${stats.local.keys}`);
  console.log(`  Session: ${stats.session.keys}`);
  console.log(`  Ratio: ${comparison.itemsRatio.toFixed(2)}x`);
  
  console.log('\nTotal Size:');
  console.log(`  Local: ${formatBytes(stats.local.totalSize)}`);
  console.log(`  Session: ${formatBytes(stats.session.totalSize)}`);
  console.log(`  Ratio: ${comparison.sizeRatio.toFixed(2)}x`);
  
  console.log('\nAverage Item Size:');
  console.log(`  Local: ${formatBytes(stats.local.averageSize)}`);
  console.log(`  Session: ${formatBytes(stats.session.averageSize)}`);
  console.log(`  Ratio: ${comparison.avgSizeRatio.toFixed(2)}x`);
  
  return comparison;
}
```

### 3. Combined Quota Check

```javascript
// Check both storage quotas
function checkQuotas() {
  const stats = Storage.stats();
  const quota = 5 * 1024 * 1024; // 5 MB typical quota
  
  const localUsage = (stats.local.totalSize / quota) * 100;
  const sessionUsage = (stats.session.totalSize / quota) * 100;
  
  console.log('=== Storage Quota Status ===\n');
  
  console.log('localStorage:');
  console.log(`  Usage: ${localUsage.toFixed(2)}%`);
  console.log(`  Used: ${formatBytes(stats.local.totalSize)}`);
  console.log(`  Available: ${formatBytes(quota - stats.local.totalSize)}`);
  
  if (localUsage > 90) {
    console.error('  🚨 CRITICAL: localStorage nearly full!');
  } else if (localUsage > 75) {
    console.warn('  ⚠️ WARNING: localStorage usage high');
  } else {
    console.log('  ✅ OK');
  }
  
  console.log('\nsessionStorage:');
  console.log(`  Usage: ${sessionUsage.toFixed(2)}%`);
  console.log(`  Used: ${formatBytes(stats.session.totalSize)}`);
  console.log(`  Available: ${formatBytes(quota - stats.session.totalSize)}`);
  
  if (sessionUsage > 90) {
    console.error('  🚨 CRITICAL: sessionStorage nearly full!');
  } else if (sessionUsage > 75) {
    console.warn('  ⚠️ WARNING: sessionStorage usage high');
  } else {
    console.log('  ✅ OK');
  }
  
  return {
    local: { usage: localUsage, status: getStatus(localUsage) },
    session: { usage: sessionUsage, status: getStatus(sessionUsage) }
  };
}

function getStatus(usage) {
  if (usage > 90) return 'critical';
  if (usage > 75) return 'warning';
  return 'ok';
}
```

### 4. Total Storage Calculation

```javascript
// Calculate total storage metrics
function getTotalMetrics() {
  const stats = Storage.stats();
  
  const totalKeys = stats.local.keys + stats.session.keys;
  const totalSize = stats.local.totalSize + stats.session.totalSize;
  const overallAverage = totalKeys > 0 ? totalSize / totalKeys : 0;
  
  return {
    totalItems: totalKeys,
    totalSize: totalSize,
    averageSize: overallAverage,
    distribution: {
      localPercentage: totalSize > 0 ? (stats.local.totalSize / totalSize) * 100 : 0,
      sessionPercentage: totalSize > 0 ? (stats.session.totalSize / totalSize) * 100 : 0
    },
    breakdown: {
      local: stats.local,
      session: stats.session
    }
  };
}

// Usage
const metrics = getTotalMetrics();
console.log('Total Items:', metrics.totalItems);
console.log('Total Size:', formatBytes(metrics.totalSize));
console.log('Overall Average:', formatBytes(metrics.averageSize));
console.log(`Distribution: ${metrics.distribution.localPercentage.toFixed(1)}% local, ${metrics.distribution.sessionPercentage.toFixed(1)}% session`);
```

### 5. Health Check Both Storages

```javascript
// Comprehensive health check
function healthCheckAll() {
  const stats = Storage.stats();
  const quota = 5 * 1024 * 1024;
  
  const health = {
    overall: 'healthy',
    local: checkStorageHealth(stats.local, quota),
    session: checkStorageHealth(stats.session, quota),
    issues: [],
    warnings: []
  };
  
  // Determine overall health
  if (health.local.status === 'critical' || health.session.status === 'critical') {
    health.overall = 'critical';
  } else if (health.local.status === 'warning' || health.session.status === 'warning') {
    health.overall = 'warning';
  }
  
  // Collect issues and warnings
  health.issues = [...health.local.issues, ...health.session.issues];
  health.warnings = [...health.local.warnings, ...health.session.warnings];
  
  return health;
}

function checkStorageHealth(stats, quota) {
  const usage = (stats.totalSize / quota) * 100;
  
  const health = {
    status: 'healthy',
    usage: usage,
    issues: [],
    warnings: []
  };
  
  // Usage-based health
  if (usage > 95) {
    health.status = 'critical';
    health.issues.push(`${stats.storageType} is over 95% full`);
  } else if (usage > 80) {
    health.status = 'warning';
    health.warnings.push(`${stats.storageType} is over 80% full`);
  }
  
  // Item count
  if (stats.keys > 1000) {
    health.warnings.push(`${stats.storageType} has ${stats.keys} items (very high)`);
  }
  
  // Average size
  if (stats.averageSize > 50000) {
    health.warnings.push(`${stats.storageType} has large average item size (${formatBytes(stats.averageSize)})`);
  }
  
  return health;
}

// Usage
const health = healthCheckAll();
console.log('Overall Health:', health.overall.toUpperCase());

if (health.issues.length > 0) {
  console.error('\n🚨 Issues:');
  health.issues.forEach(issue => console.error(`  - ${issue}`));
}

if (health.warnings.length > 0) {
  console.warn('\n⚠️ Warnings:');
  health.warnings.forEach(warning => console.warn(`  - ${warning}`));
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
  
  start(intervalMs = 5000) {
    this.display();
    this.updateInterval = setInterval(() => this.display(), intervalMs);
    console.log(`📊 Dashboard started (updating every ${intervalMs}ms)`);
  }
  
  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      console.log('📊 Dashboard stopped');
    }
  }
  
  display() {
    const stats = Storage.stats();
    
    console.clear();
    console.log('╔════════════════════════════════════════╗');
    console.log('║       STORAGE DASHBOARD                ║');
    console.log('╠════════════════════════════════════════╣');
    
    this.displayStorage('LOCAL STORAGE (Persistent)', stats.local);
    console.log('╟────────────────────────────────────────╢');
    this.displayStorage('SESSION STORAGE (Temporary)', stats.session);
    console.log('╟────────────────────────────────────────╢');
    this.displayTotals(stats);
    console.log('╚════════════════════════════════════════╝');
    
    console.log(`\nLast updated: ${new Date().toLocaleTimeString()}`);
  }
  
  displayStorage(title, stats) {
    const quota = 5 * 1024 * 1024;
    const usage = (stats.totalSize / quota) * 100;
    const bar = this.createProgressBar(usage);
    
    console.log(`║ ${title.padEnd(38)} ║`);
    console.log('║                                        ║');
    console.log(`║ Items:   ${String(stats.keys).padEnd(30)} ║`);
    console.log(`║ Size:    ${this.formatBytes(stats.totalSize).padEnd(30)} ║`);
    console.log(`║ Average: ${this.formatBytes(stats.averageSize).padEnd(30)} ║`);
    console.log(`║ Usage:   ${bar} ${usage.toFixed(1).padStart(5)}% ║`);
  }
  
  displayTotals(stats) {
    const totalItems = stats.local.keys + stats.session.keys;
    const totalSize = stats.local.totalSize + stats.session.totalSize;
    
    console.log('║ TOTALS                                 ║');
    console.log('║                                        ║');
    console.log(`║ Total Items: ${String(totalItems).padEnd(26)} ║`);
    console.log(`║ Total Size:  ${this.formatBytes(totalSize).padEnd(26)} ║`);
  }
  
  createProgressBar(percent, width = 20) {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
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
dashboard.start(5000); // Update every 5 seconds

// Stop after 30 seconds
setTimeout(() => dashboard.stop(), 30000);
```

### Example 2: Comparative Report

```javascript
function generateComparativeReport() {
  const stats = Storage.stats();
  const quota = 5 * 1024 * 1024;
  
  console.log('═'.repeat(60));
  console.log('STORAGE COMPARATIVE REPORT');
  console.log('═'.repeat(60));
  console.log();
  
  // Side by side comparison
  console.log('METRIC'.padEnd(25) + 'LOCAL'.padEnd(20) + 'SESSION');
  console.log('─'.repeat(60));
  
  console.log(
    'Items'.padEnd(25) +
    String(stats.local.keys).padEnd(20) +
    String(stats.session.keys)
  );
  
  console.log(
    'Total Size'.padEnd(25) +
    formatBytes(stats.local.totalSize).padEnd(20) +
    formatBytes(stats.session.totalSize)
  );
  
  console.log(
    'Average Size'.padEnd(25) +
    formatBytes(stats.local.averageSize).padEnd(20) +
    formatBytes(stats.session.averageSize)
  );
  
  const localUsage = (stats.local.totalSize / quota) * 100;
  const sessionUsage = (stats.session.totalSize / quota) * 100;
  
  console.log(
    'Quota Usage'.padEnd(25) +
    `${localUsage.toFixed(2)}%`.padEnd(20) +
    `${sessionUsage.toFixed(2)}%`
  );
  
  console.log();
  console.log('─'.repeat(60));
  
  // Analysis
  console.log('\nANALYSIS:');
  console.log();
  
  if (stats.local.keys > stats.session.keys) {
    const ratio = (stats.local.keys / (stats.session.keys || 1)).toFixed(1);
    console.log(`• localStorage has ${ratio}x more items than sessionStorage`);
  } else if (stats.session.keys > stats.local.keys) {
    const ratio = (stats.session.keys / (stats.local.keys || 1)).toFixed(1);
    console.log(`• sessionStorage has ${ratio}x more items than localStorage`);
  }
  
  if (stats.local.totalSize > stats.session.totalSize) {
    const ratio = (stats.local.totalSize / (stats.session.totalSize || 1)).toFixed(1);
    console.log(`• localStorage uses ${ratio}x more space than sessionStorage`);
  } else if (stats.session.totalSize > stats.local.totalSize) {
    const ratio = (stats.session.totalSize / (stats.local.totalSize || 1)).toFixed(1);
    console.log(`• sessionStorage uses ${ratio}x more space than localStorage`);
  }
  
  if (localUsage > 75 || sessionUsage > 75) {
    console.log('\n⚠️  WARNING: High storage usage detected');
  }
  
  console.log();
  console.log('═'.repeat(60));
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Generate report
generateComparativeReport();
```

### Example 3: Storage Monitor with Alerts

```javascript
class DualStorageMonitor {
  constructor(options = {}) {
    this.options = {
      checkInterval: options.checkInterval || 10000,
      warningThreshold: options.warningThreshold || 75,
      criticalThreshold: options.criticalThreshold || 90,
      ...options
    };
    
    this.monitorInterval = null;
    this.lastAlerts = {
      local: null,
      session: null
    };
  }
  
  start() {
    console.log('🔍 Dual Storage Monitor started');
    this.check();
    this.monitorInterval = setInterval(() => this.check(), this.options.checkInterval);
  }
  
  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      console.log('🔍 Dual Storage Monitor stopped');
    }
  }
  
  check() {
    const stats = Storage.stats();
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(`\n[${timestamp}] Checking storage...`);
    
    this.checkStorage('local', stats.local);
    this.checkStorage('session', stats.session);
    
    this.checkTotals(stats);
  }
  
  checkStorage(type, stats) {
    const quota = 5 * 1024 * 1024;
    const usage = (stats.totalSize / quota) * 100;
    const level = this.getAlertLevel(usage);
    
    // Only alert if level changed or is critical
    if (level !== this.lastAlerts[type] || level === 'critical') {
      this.sendAlert(type, stats, usage, level);
      this.lastAlerts[type] = level;
    }
  }
  
  checkTotals(stats) {
    const totalItems = stats.local.keys + stats.session.keys;
    const totalSize = stats.local.totalSize + stats.session.totalSize;
    const quota = 10 * 1024 * 1024; // Combined quota estimate
    const totalUsage = (totalSize / quota) * 100;
    
    if (totalUsage > 80) {
      console.warn(`⚠️  Combined storage usage: ${totalUsage.toFixed(1)}% (${totalItems} total items)`);
    }
  }
  
  getAlertLevel(usage) {
    if (usage >= this.options.criticalThreshold) return 'critical';
    if (usage >= this.options.warningThreshold) return 'warning';
    return 'normal';
  }
  
  sendAlert(type, stats, usage, level) {
    const icon = level === 'critical' ? '🚨' : level === 'warning' ? '⚠️' : 'ℹ️';
    const storageType = type === 'local' ? 'localStorage' : 'sessionStorage';
    
    console.log(`${icon} ${storageType} ${level.toUpperCase()}`);
    console.log(`   Usage: ${usage.toFixed(2)}%`);
    console.log(`   Items: ${stats.keys}`);
    console.log(`   Size: ${this.formatBytes(stats.totalSize)}`);
    
    if (level === 'critical') {
      this.handleCritical(type);
    }
  }
  
  handleCritical(type) {
    console.log(`   🔧 Running automatic cleanup for ${type}Storage...`);
    
    if (type === 'local') {
      const cleaned = Storage.local.cleanup();
      console.log(`   ✅ Cleaned ${cleaned} expired items`);
    } else {
      const cleaned = Storage.session.cleanup();
      console.log(`   ✅ Cleaned ${cleaned} expired items`);
    }
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  getStatus() {
    const stats = Storage.stats();
    const quota = 5 * 1024 * 1024;
    
    return {
      local: {
        keys: stats.local.keys,
        size: stats.local.totalSize,
        usage: (stats.local.totalSize / quota) * 100,
        status: this.getAlertLevel((stats.local.totalSize / quota) * 100)
      },
      session: {
        keys: stats.session.keys,
        size: stats.session.totalSize,
        usage: (stats.session.totalSize / quota) * 100,
        status: this.getAlertLevel((stats.session.totalSize / quota) * 100)
      }
    };
  }
}

// Usage
const monitor = new DualStorageMonitor({
  checkInterval: 10000,      // Check every 10 seconds
  warningThreshold: 75,
  criticalThreshold: 90
});

monitor.start();

// Get current status anytime
const status = monitor.getStatus();
console.log('Current status:', status);

// Stop monitoring
// monitor.stop();
```

### Example 4: Storage Distribution Pie Chart (Console)

```javascript
function displayStorageDistribution() {
  const stats = Storage.stats();
  
  const totalSize = stats.local.totalSize + stats.session.totalSize;
  
  if (totalSize === 0) {
    console.log('No data in storage');
    return;
  }
  
  const localPercent = (stats.local.totalSize / totalSize) * 100;
  const sessionPercent = (stats.session.totalSize / totalSize) * 100;
  
  console.log('╔════════════════════════════════════════╗');
  console.log('║     STORAGE DISTRIBUTION               ║');
  console.log('╠════════════════════════════════════════╣');
  console.log('║                                        ║');
  
  // Visual bars
  const barWidth = 30;
  const localBar = Math.round((localPercent / 100) * barWidth);
  const sessionBar = Math.round((sessionPercent / 100) * barWidth);
  
  console.log(`║ localStorage    ${'█'.repeat(localBar)}${'░'.repeat(barWidth - localBar)} ║`);
  console.log(`║ ${localPercent.toFixed(1)}%`.padEnd(40) + '║');
  console.log('║                                        ║');
  console.log(`║ sessionStorage  ${'█'.repeat(sessionBar)}${'░'.repeat(barWidth - sessionBar)} ║`);
  console.log(`║ ${sessionPercent.toFixed(1)}%`.padEnd(40) + '║');
  console.log('║                                        ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║ Total Size: ${formatBytes(totalSize).padEnd(26)} ║`);
  console.log(`║ Local:  ${formatBytes(stats.local.totalSize).padEnd(30)} ║`);
  console.log(`║ Session: ${formatBytes(stats.session.totalSize).padEnd(29)} ║`);
  console.log('╚════════════════════════════════════════╝');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Display distribution
displayStorageDistribution();
```

### Example 5: Automated Reporting

```javascript
class StorageReporter {
  constructor() {
    this.reports = [];
  }
  
  generateReport() {
    const stats = Storage.stats();
    const timestamp = Date.now();
    
    const report = {
      timestamp,
      date: new Date(timestamp).toISOString(),
      local: {
        keys: stats.local.keys,
        totalSize: stats.local.totalSize,
        averageSize: stats.local.averageSize
      },
      session: {
        keys: stats.session.keys,
        totalSize: stats.session.totalSize,
        averageSize: stats.session.averageSize
      },
      totals: {
        keys: stats.local.keys + stats.session.keys,
       totalSize + stats.session.totalSize
      }
    };
    
    this.reports.push(report);
    
    // Keep last 100 reports
    if (this.reports.length > 100) {
      this.reports.shift();
    }
    
    return report;
  }
  
  getGrowthTrend(type = 'local', periods = 10) {
    if (this.reports.length < 2) {
      return { trend: 'insufficient_data', growth: 0 };
    }
    
    const recent = this.reports.slice(-periods);
    const oldest = recent[0][type];
    const newest = recent[recent.length - 1][type];
    
    const growth = newest.totalSize - oldest.totalSize;
    const timeSpan = newest.timestamp ? 
      (Date.now() - recent[0].timestamp) : 
      (recent[recent.length - 1].timestamp - recent[0].timestamp);
    
    const growthRate = timeSpan > 0 ? growth / (timeSpan / 1000) : 0; // bytes per second
    
    return {
      trend: growth > 0 ? 'growing' : growth < 0 ? 'shrinking' : 'stable',
      growth,
      growthRate,
      growthRateFormatted: this.formatBytes(Math.abs(growthRate)) + '/s'
    };
  }
  
  printSummary() {
    const latest = this.reports[this.reports.length - 1];
    
    if (!latest) {
      console.log('No reports available');
      return;
    }
    
    console.log('═'.repeat(60));
    console.log('STORAGE REPORT SUMMARY');
    console.log(`Generated: ${new Date(latest.date).toLocaleString()}`);
    console.log('═'.repeat(60));
    console.log();
    
    // Current status
    console.log('CURRENT STATUS:');
    console.log('─'.repeat(60));
    console.log(`localStorage:    ${latest.local.keys} items, ${this.formatBytes(latest.local.totalSize)}`);
    console.log(`sessionStorage:  ${latest.session.keys} items, ${this.formatBytes(latest.session.totalSize)}`);
    console.log(`Total:           ${latest.totals.keys} items, ${this.formatBytes(latest.totals.totalSize)}`);
    console.log();
    
    // Trends
    if (this.reports.length >= 2) {
      console.log('GROWTH TRENDS:');
      console.log('─'.repeat(60));
      
      const localTrend = this.getGrowthTrend('local');
      const sessionTrend = this.getGrowthTrend('session');
      
      console.log(`localStorage:    ${localTrend.trend.toUpperCase()}`);
      console.log(`  Growth: ${this.formatBytes(localTrend.growth)}`);
      console.log(`  Rate: ${localTrend.growthRateFormatted}`);
      console.log();
      
      console.log(`sessionStorage:  ${sessionTrend.trend.toUpperCase()}`);
      console.log(`  Growth: ${this.formatBytes(sessionTrend.growth)}`);
      console.log(`  Rate: ${sessionTrend.growthRateFormatted}`);
      console.log();
    }
    
    // History
    console.log('HISTORY:');
    console.log('─'.repeat(60));
    console.log(`Reports collected: ${this.reports.length}`);
    
    if (this.reports.length > 1) {
      const first = this.reports[0];
      const last = this.reports[this.reports.length - 1];
      
      console.log(`First report: ${new Date(first.date).toLocaleString()}`);
      console.log(`Latest report: ${new Date(last.date).toLocaleString()}`);
      
      const localChange = last.local.totalSize - first.local.totalSize;
      const sessionChange = last.session.totalSize - first.session.totalSize;
      
      console.log(`\nTotal change since first report:`);
      console.log(`  localStorage: ${localChange >= 0 ? '+' : ''}${this.formatBytes(localChange)}`);
      console.log(`  sessionStorage: ${sessionChange >= 0 ? '+' : ''}${this.formatBytes(sessionChange)}`);
    }
    
    console.log();
    console.log('═'.repeat(60));
  }
  
  exportReports() {
    const data = {
      exportDate: new Date().toISOString(),
      reportCount: this.reports.length,
      reports: this.reports
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `storage-reports-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    console.log('Reports exported');
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = Math.round(bytes / Math.pow(k, i) * 100) / 100;
    return (bytes < 0 ? '-' : '') + Math.abs(size) + ' ' + sizes[i];
  }
}

// Usage
const reporter = new StorageReporter();

// Generate report every 30 seconds
setInterval(() => {
  reporter.generateReport();
}, 30000);

// Print summary
setTimeout(() => {
  reporter.printSummary();
}, 60000);

// Export reports
// reporter.exportReports();
```

---

## Comparison and Analysis

### Side-by-Side Comparison Table

```javascript
function compareStorageTable() {
  const stats = Storage.stats();
  const quota = 5 * 1024 * 1024;
  
  const data = [
    {
      metric: 'Storage Type',
      local: stats.local.storageType,
      session: stats.session.storageType
    },
    {
      metric: 'Persistence',
      local: 'Survives restart',
      session: 'Cleared on tab close'
    },
    {
      metric: 'Item Count',
      local: stats.local.keys,
      session: stats.session.keys
    },
    {
      metric: 'Total Size',
      local: formatBytes(stats.local.totalSize),
      session: formatBytes(stats.session.totalSize)
    },
    {
      metric: 'Average Size',
      local: formatBytes(stats.local.averageSize),
      session: formatBytes(stats.session.averageSize)
    },
    {
      metric: 'Quota Usage',
      local: ((stats.local.totalSize / quota) * 100).toFixed(2) + '%',
      session: ((stats.session.totalSize / quota) * 100).toFixed(2) + '%'
    },
    {
      metric: 'Available Space',
      local: formatBytes(quota - stats.local.totalSize),
      session: formatBytes(quota - stats.session.totalSize)
    }
  ];
  
  console.log('\n┌─────────────────────┬──────────────────────┬──────────────────────┐');
  console.log('│ Metric              │ localStorage         │ sessionStorage       │');
  console.log('├─────────────────────┼──────────────────────┼──────────────────────┤');
  
  data.forEach(row => {
    const metric = String(row.metric).padEnd(19);
    const local = String(row.local).padEnd(20);
    const session = String(row.session).padEnd(20);
    console.log(`│ ${metric} │ ${local} │ ${session} │`);
  });
  
  console.log('└─────────────────────┴──────────────────────┴──────────────────────┘\n');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Display comparison
compareStorageTable();
```

### Efficiency Score

```javascript
function calculateEfficiencyScores() {
  const stats = Storage.stats();
  const quota = 5 * 1024 * 1024;
  
  function scoreStorage(storageStats) {
    const usagePercent = (storageStats.totalSize / quota) * 100;
    const itemCount = storageStats.keys;
    const avgSize = storageStats.averageSize;
    
    let score = 100;
    
    // Penalize high usage
    if (usagePercent > 90) score -= 40;
    else if (usagePercent > 75) score -= 20;
    else if (usagePercent > 50) score -= 10;
    
    // Penalize high item count
    if (itemCount > 1000) score -= 30;
    else if (itemCount > 500) score -= 15;
    else if (itemCount > 200) score -= 5;
    
    // Penalize large average size
    if (avgSize > 50000) score -= 30;
    else if (avgSize > 10000) score -= 15;
    else if (avgSize > 5000) score -= 5;
    
    return Math.max(0, score);
  }
  
  const localScore = scoreStorage(stats.local);
  const sessionScore = scoreStorage(stats.session);
  const overallScore = Math.round((localScore + sessionScore) / 2);
  
  console.log('═'.repeat(50));
  console.log('STORAGE EFFICIENCY SCORES');
  console.log('═'.repeat(50));
  console.log();
  console.log(`localStorage:    ${localScore}/100  ${getGrade(localScore)}`);
  console.log(`sessionStorage:  ${sessionScore}/100  ${getGrade(sessionScore)}`);
  console.log(`Overall:         ${overallScore}/100  ${getGrade(overallScore)}`);
  console.log();
  console.log('─'.repeat(50));
  console.log('Rating Guide:');
  console.log('  90-100: Excellent (A)');
  console.log('  80-89:  Good (B)');
  console.log('  70-79:  Fair (C)');
  console.log('  60-69:  Poor (D)');
  console.log('  0-59:   Critical (F)');
  console.log('═'.repeat(50));
  
  return { local: localScore, session: sessionScore, overall: overallScore };
}

function getGrade(score) {
  if (score >= 90) return '(A) ⭐⭐⭐';
  if (score >= 80) return '(B) ⭐⭐';
  if (score >= 70) return '(C) ⭐';
  if (score >= 60) return '(D) ⚠️';
  return '(F) 🚨';
}

// Calculate scores
calculateEfficiencyScores();
```

---

## Best Practices

### 1. Regular Monitoring

```javascript
// Good: Monitor both storage types regularly
function monitorStorage() {
  const stats = Storage.stats();
  
  console.log('Storage Check:', new Date().toLocaleTimeString());
  console.log(`  Local: ${stats.local.keys} items, ${formatBytes(stats.local.totalSize)}`);
  console.log(`  Session: ${stats.session.keys} items, ${formatBytes(stats.session.totalSize)}`);
}

// Check every minute
setInterval(monitorStorage, 60000);
```

### 2. Use Combined Stats for Overview

```javascript
// Good: Get complete picture with single call
const stats = Storage.stats();

// Process both storage types
Object.entries(stats).forEach(([type, data]) => {
  console.log(`${type}:`, data.keys, 'items');
});

// Avoid: Multiple separate calls
const localStats = Storage.local.stats();  // ❌ Unnecessary
const sessionStats = Storage.session.stats(); // ❌ Unnecessary
```

### 3. Compare and Analyze

```javascript
// Good: Compare storage usage patterns
function analyzeUsagePatterns() {
  const stats = Storage.stats();
  
  if (stats.session.totalSize > stats.local.totalSize) {
    console.warn('⚠️ Session storage larger than local storage - check for memory leaks');
  }
  
  const totalItems = stats.local.keys + stats.session.keys;
  if (totalItems > 1000) {
    console.warn('⚠️ Very high total item count - consider cleanup');
  }
}
```

### 4. Implement Alerting

```javascript
// Good: Alert on either storage reaching threshold
function checkBothStorages() {
  const stats = Storage.stats();
  const quota = 5 * 1024 * 1024;
  
  ['local', 'session'].forEach(type => {
    const usage = (stats[type].totalSize / quota) * 100;
    
    if (usage > 90) {
      console.error(`🚨 ${type}Storage is ${usage.toFixed(1)}% full!`);
    } else if (usage > 75) {
      console.warn(`⚠️ ${type}Storage is ${usage.toFixed(1)}% full`);
    }
  });
}
```

### 5. Calculate Total Metrics

```javascript
// Good: Calculate combined totals
function getTotalUsage() {
  const stats = Storage.stats();
  
  return {
    totalItems: stats.local.keys + stats.session.keys,
    totalSize: stats.local.totalSize + stats.session.totalSize,
    breakdown: {
      local: stats.local,
      session: stats.session
    }
  };
}

const usage = getTotalUsage();
console.log(`Total: ${usage.totalItems} items, ${formatBytes(usage.totalSize)}`);
```

### 6. Track Changes Over Time

```javascript
// Good: Track both storage types
const history = [];

function trackStorageHistory() {
  const stats = Storage.stats();
  
  history.push({
    timestamp: Date.now(),
    local: { ...stats.local },
    session: { ...stats.session }
  });
  
  // Keep last 100 entries
  if (history.length > 100) {
    history.shift();
  }
}

setInterval(trackStorageHistory, 60000); // Every minute
```

### 7. Create Unified Reports

```javascript
// Good: Single comprehensive report
function generateUnifiedReport() {
  const stats = Storage.stats();
  const quota = 5 * 1024 * 1024;
  
  return {
    timestamp: new Date().toISOString(),
    local: {
      ...stats.local,
      usagePercent: (stats.local.totalSize / quota) * 100,
      available: quota - stats.local.totalSize
    },
    session: {
      ...stats.session,
      usagePercent: (stats.session.totalSize / quota) * 100,
      available: quota - stats.session.totalSize
    },
    totals: {
      items: stats.local.keys + stats.session.keys,
      size: stats.local.totalSize + stats.session.totalSize
    }
  };
}

const report = generateUnifiedReport();
console.log('Unified Storage Report:', report);
```

---

## Summary

**Combined Stats Structure:**

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

**Quick Access:**

```javascript
const stats = Storage.stats();

// localStorage stats
stats.local.keys
stats.local.totalSize
stats.local.averageSize
stats.local.storageType  // 'localStorage'

// sessionStorage stats
stats.session.keys
stats.session.totalSize
stats.session.averageSize
stats.session.storageType  // 'sessionStorage'
```

**Common Operations:**

```javascript
// Get both stats
const stats = Storage.stats();

// Calculate totals
const totalItems = stats.local.keys + stats.session.keys;
const totalSize = stats.local.totalSize + stats.session.totalSize;

// Compare usage
const localUsage = (stats.local.totalSize / 5000000) * 100;
const sessionUsage = (stats.session.totalSize / 5000000) * 100;

// Check if either is full
const isFull = localUsage > 90 || sessionUsage > 90;

// Get larger storage
const larger = stats.local.totalSize > stats.session.totalSize ? 'local' : 'session';
```

**Key Points:**

✅ **Single call** - Get both storage types at once  
✅ **Easy comparison** - Compare local vs session  
✅ **Calculate totals** - Sum across both types  
✅ **Unified monitoring** - Track all storage together  
✅ **Comprehensive view** - Complete storage picture  
✅ **Efficient** - One method call for everything  

**Best Practices:**

1. Use `Storage.stats()` for complete overview
2. Monitor both storage types regularly
3. Compare usage patterns between types
4. Calculate combined totals when needed
5. Alert on either storage reaching limits
6. Track historical data for both
7. Generate unified reports

**Common Use Cases:**

- 📊 Complete storage dashboards
- 🔍 Comprehensive monitoring
- ⚖️ Comparing local vs session usage
- 📈 Total storage calculations
- ⚠️ Unified alerting systems
- 📝 Combined reporting
- 🎯 Capacity planning

The combined stats object provides a complete view of all storage usage in a single, efficient method call!