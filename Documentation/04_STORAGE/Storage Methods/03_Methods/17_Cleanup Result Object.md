# Cleanup Result Object

Complete documentation for the cleanup result object returned by `Storage.cleanup()` in the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Object Structure](#object-structure)
3. [Properties Reference](#properties-reference)
   - [local](#local)
   - [session](#session)
4. [Return Variations](#return-variations)
5. [Use Cases](#use-cases)
6. [Examples](#examples)
7. [Best Practices](#best-practices)

---

## Overview

When calling `Storage.cleanup()` on the main Storage object, it returns a cleanup result object containing the number of expired items removed from both localStorage and sessionStorage. This allows you to track cleanup effectiveness and monitor data hygiene.

**Key Benefits:**
- 📊 **Track cleanup effectiveness** - Know how many items were removed
- 🔍 **Identify storage health** - High cleanup counts indicate issues
- 📈 **Monitor patterns** - Track cleanup trends over time
- 🎯 **Verify operations** - Confirm cleanup executed successfully
- 🛠️ **Debugging** - Identify which storage had expired data

---

## Object Structure

### Complete Structure

```javascript
const results = Storage.cleanup();

// Returns:
{
  local: number,    // Items cleaned from localStorage
  session: number   // Items cleaned from sessionStorage
}
```

### Example Output

```javascript
const results = Storage.cleanup();
console.log(results);

// Output:
{
  local: 5,      // 5 expired items removed from localStorage
  session: 2     // 2 expired items removed from sessionStorage
}
```

---

## Properties Reference

### local

Number of expired items removed from localStorage.

#### Type

**`number`**

#### Description

Count of items that were expired and successfully removed from localStorage during the cleanup operation. Includes all namespaced and non-namespaced items in localStorage.

#### Range

- Minimum: `0` (no expired items found)
- Maximum: Total number of items in localStorage (all expired)

#### Examples

```javascript
// Perform cleanup
const results = Storage.cleanup();
console.log('localStorage cleaned:', results.local);

// No expired items
// Output: localStorage cleaned: 0

// Some expired items
// Output: localStorage cleaned: 5

// Check if cleanup was needed
if (results.local > 0) {
  console.log(`Removed ${results.local} expired items from localStorage`);
} else {
  console.log('No expired items in localStorage');
}

// Calculate cleanup percentage
const statsBefore = Storage.stats();
const results = Storage.cleanup();
const statsAfter = Storage.stats();

const cleanupPercent = statsBefore.local.keys > 0 ?
  (results.local / statsBefore.local.keys) * 100 : 0;

console.log(`Cleaned ${cleanupPercent.toFixed(1)}% of localStorage items`);
```

#### What It Counts

```javascript
// Set items with different expiry times
Storage.set('temp1', 'value', { expires: 1 });  // Expires in 1 second
Storage.set('temp2', 'value', { expires: 1 });  // Expires in 1 second
Storage.set('permanent', 'value');               // No expiry

// Wait for expiry
setTimeout(() => {
  const results = Storage.cleanup();
  console.log(results.local);  // 2 (temp1 and temp2 expired)
  
  // permanent is still there
  console.log(Storage.has('permanent'));  // true
}, 2000);
```

---

### session

Number of expired items removed from sessionStorage.

#### Type

**`number`**

#### Description

Count of items that were expired and successfully removed from sessionStorage during the cleanup operation. Includes all namespaced and non-namespaced items in sessionStorage.

#### Range

- Minimum: `0` (no expired items found)
- Maximum: Total number of items in sessionStorage (all expired)

#### Examples

```javascript
// Perform cleanup
const results = Storage.cleanup();
console.log('sessionStorage cleaned:', results.session);

// No expired items
// Output: sessionStorage cleaned: 0

// Some expired items
// Output: sessionStorage cleaned: 3

// Check if cleanup was needed
if (results.session > 0) {
  console.log(`Removed ${results.session} expired items from sessionStorage`);
} else {
  console.log('No expired items in sessionStorage');
}

// Session-specific cleanup
Storage.session.set('temp1', 'value', { expires: 1 });
Storage.session.set('temp2', 'value', { expires: 1 });

setTimeout(() => {
  const results = Storage.cleanup();
  console.log('Session items cleaned:', results.session);  // 2
}, 2000);
```

#### What It Counts

```javascript
// Set session items with expiry
Storage.session.set('wizard:step1', data, { expires: 60 });
Storage.session.set('wizard:step2', data, { expires: 60 });
Storage.session.set('search:query', query, { expires: 30 });

// Some time passes and items expire
setTimeout(() => {
  const results = Storage.cleanup();
  console.log(`Cleaned ${results.session} session items`);
}, 70000);  // After 70 seconds
```

---

## Return Variations

### Main Storage Object

When calling `Storage.cleanup()` on the main Storage object:

```javascript
const results = Storage.cleanup();

// Returns object with both properties
{
  local: number,
  session: number
}

// Example
{
  local: 3,
  session: 1
}
```

### Specific Storage Instance

When calling `cleanup()` on a specific storage instance:

```javascript
// localStorage instance
const localCleaned = Storage.local.cleanup();
console.log(localCleaned);  // Returns: number (e.g., 3)

// sessionStorage instance
const sessionCleaned = Storage.session.cleanup();
console.log(sessionCleaned);  // Returns: number (e.g., 1)

// Namespaced storage
const blogCleaned = Storage.namespace('blog').cleanup();
console.log(blogCleaned);  // Returns: number (e.g., 2)
```

### Comparison

```javascript
// Main Storage object - returns object
const results = Storage.cleanup();
console.log(results);  // { local: 3, session: 1 }

// Specific instance - returns number
const count = Storage.local.cleanup();
console.log(count);  // 3

// To get same format manually:
const manual = {
  local: Storage.local.cleanup(),
  session: Storage.session.cleanup()
};
console.log(manual);  // { local: 3, session: 1 }
```

---

## Use Cases

### 1. Basic Cleanup with Reporting

```javascript
// Perform cleanup and report results
function cleanupAndReport() {
  console.log('Running storage cleanup...');
  
  const results = Storage.cleanup();
  
  if (results.local === 0 && results.session === 0) {
    console.log('✓ No expired items found');
  } else {
    console.log('✓ Cleanup complete:');
    console.log(`  localStorage: ${results.local} items removed`);
    console.log(`  sessionStorage: ${results.session} items removed`);
    console.log(`  Total: ${results.local + results.session} items removed`);
  }
  
  return results;
}

// Usage
cleanupAndReport();
```

### 2. Scheduled Maintenance

```javascript
// Regular cleanup with logging
function scheduledCleanup() {
  const timestamp = new Date().toLocaleString();
  const results = Storage.cleanup();
  const total = results.local + results.session;
  
  if (total > 0) {
    console.log(`[${timestamp}] Cleaned ${total} expired items (${results.local} local, ${results.session} session)`);
  }
  
  return results;
}

// Run every hour
setInterval(scheduledCleanup, 3600000);

// Run on page load
scheduledCleanup();
```

### 3. Conditional Actions Based on Results

```javascript
// Take action based on cleanup results
function smartCleanup() {
  const results = Storage.cleanup();
  const total = results.local + results.session;
  
  if (total > 10) {
    console.warn('⚠️ High number of expired items detected:', total);
    console.warn('Consider reviewing expiry times');
  }
  
  if (results.local > results.session * 5) {
    console.warn('⚠️ localStorage has significantly more expired items');
    console.warn('Consider using shorter expiry times for localStorage');
  }
  
  // Trigger re-check after cleanup
  if (total > 0) {
    const stats = Storage.stats();
    console.log('Storage after cleanup:');
    console.log(`  localStorage: ${stats.local.keys} items, ${formatBytes(stats.local.totalSize)}`);
    console.log(`  sessionStorage: ${stats.session.keys} items, ${formatBytes(stats.session.totalSize)}`);
  }
  
  return results;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
```

### 4. Cleanup History Tracking

```javascript
// Track cleanup history
const cleanupHistory = [];

function trackCleanup() {
  const results = Storage.cleanup();
  
  cleanupHistory.push({
    timestamp: Date.now(),
    local: results.local,
    session: results.session,
    total: results.local + results.session
  });
  
  // Keep last 50 cleanups
  if (cleanupHistory.length > 50) {
    cleanupHistory.shift();
  }
  
  // Save history
  Storage.set('_cleanup_history', cleanupHistory);
  
  return results;
}

function getCleanupStats() {
  const history = cleanupHistory.length > 0 ? cleanupHistory : Storage.get('_cleanup_history', []);
  
  if (history.length === 0) {
    return { message: 'No cleanup history available' };
  }
  
  const totalLocal = history.reduce((sum, h) => sum + h.local, 0);
  const totalSession = history.reduce((sum, h) => sum + h.session, 0);
  const total = totalLocal + totalSession;
  const avgPerCleanup = total / history.length;
  
  return {
    cleanupCount: history.length,
    totalItemsCleaned: total,
    totalLocal,
    totalSession,
    averagePerCleanup: Math.round(avgPerCleanup * 10) / 10,
    lastCleanup: new Date(history[history.length - 1].timestamp)
  };
}

// Usage
trackCleanup();

// Get statistics
const stats = getCleanupStats();
console.log('Cleanup Statistics:', stats);
```

### 5. Cleanup Efficiency Monitoring

```javascript
// Monitor cleanup efficiency
function monitorCleanupEfficiency() {
  const statsBefore = Storage.stats();
  const results = Storage.cleanup();
  const statsAfter = Storage.stats();
  
  const efficiency = {
    itemsRemoved: {
      local: results.local,
      session: results.session,
      total: results.local + results.session
    },
    spaceFreed: {
      local: statsBefore.local.totalSize - statsAfter.local.totalSize,
      session: statsBefore.session.totalSize - statsAfter.session.totalSize
    },
    percentageReduction: {
      local: statsBefore.local.keys > 0 ?
        (results.local / statsBefore.local.keys) * 100 : 0,
      session: statsBefore.session.keys > 0 ?
        (results.session / statsBefore.session.keys) * 100 : 0
    }
  };
  
  efficiency.spaceFreed.total = 
    efficiency.spaceFreed.local + efficiency.spaceFreed.session;
  
  console.log('Cleanup Efficiency Report:');
  console.log(`  Items removed: ${efficiency.itemsRemoved.total}`);
  console.log(`  Space freed: ${formatBytes(efficiency.spaceFreed.total)}`);
  console.log(`  localStorage: ${efficiency.percentageReduction.local.toFixed(1)}% reduction`);
  console.log(`  sessionStorage: ${efficiency.percentageReduction.session.toFixed(1)}% reduction`);
  
  return efficiency;
}
```

---

## Examples

### Example 1: Simple Cleanup Reporter

```javascript
class CleanupReporter {
  static run() {
    console.log('═'.repeat(50));
    console.log('STORAGE CLEANUP REPORT');
    console.log(`Time: ${new Date().toLocaleString()}`);
    console.log('═'.repeat(50));
    
    const results = Storage.cleanup();
    const total = results.local + results.session;
    
    if (total === 0) {
      console.log('\n✓ Storage is clean - no expired items found\n');
    } else {
      console.log('\nExpired Items Removed:');
      console.log(`  localStorage:    ${results.local.toString().padStart(3)} items`);
      console.log(`  sessionStorage:  ${results.session.toString().padStart(3)} items`);
      console.log(`  ─────────────────────────────`);
      console.log(`  Total:           ${total.toString().padStart(3)} items`);
      console.log('');
      
      if (total > 10) {
        console.log('⚠️  Note: High cleanup count may indicate:');
        console.log('   • Aggressive expiry times');
        console.log('   • Infrequent cleanup schedule');
        console.log('   • Consider adjusting expiry settings\n');
      }
    }
    
    console.log('═'.repeat(50));
    
    return results;
  }
}

// Usage
CleanupReporter.run();
```

### Example 2: Automated Cleanup Manager

```javascript
class AutoCleanupManager {
  constructor(options = {}) {
    this.options = {
      interval: options.interval || 3600000,  // 1 hour
      logResults: options.logResults !== false,
      alertThreshold: options.alertThreshold || 20,
      ...options
    };
    
    this.cleanupTimer = null;
    this.history = [];
  }
  
  start() {
    console.log('🧹 Auto-cleanup manager started');
    
    // Initial cleanup
    this.runCleanup();
    
    // Schedule periodic cleanup
    this.cleanupTimer = setInterval(() => {
      this.runCleanup();
    }, this.options.interval);
  }
  
  stop() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
      console.log('🧹 Auto-cleanup manager stopped');
    }
  }
  
  runCleanup() {
    const timestamp = Date.now();
    const results = Storage.cleanup();
    const total = results.local + results.session;
    
    // Record in history
    this.history.push({
      timestamp,
      local: results.local,
      session: results.session,
      total
    });
    
    // Keep last 100 cleanups
    if (this.history.length > 100) {
      this.history.shift();
    }
    
    // Log if enabled
    if (this.options.logResults && total > 0) {
      console.log(`[${new Date(timestamp).toLocaleTimeString()}] Cleanup: ${total} items removed (${results.local} local, ${results.session} session)`);
    }
    
    // Alert if threshold exceeded
    if (total >= this.options.alertThreshold) {
      console.warn(`⚠️ High cleanup count: ${total} items removed`);
      this.onHighCleanup(results);
    }
    
    return results;
  }
  
  onHighCleanup(results) {
    // Override this method for custom behavior
    console.log('Consider reviewing expiry times or cleanup frequency');
  }
  
  getStats() {
    if (this.history.length === 0) {
      return { message: 'No cleanup history' };
    }
    
    const totalCleaned = this.history.reduce((sum, h) => sum + h.total, 0);
    const avgPerCleanup = totalCleaned / this.history.length;
    const maxCleanup = Math.max(...this.history.map(h => h.total));
    
    return {
      totalCleanups: this.history.length,
      totalItemsCleaned: totalCleaned,
      averagePerCleanup: Math.round(avgPerCleanup * 10) / 10,
      maxCleanup,
      lastCleanup: new Date(this.history[this.history.length - 1].timestamp)
    };
  }
  
  generateReport() {
    const stats = this.getStats();
    
    if (stats.message) {
      console.log(stats.message);
      return;
    }
    
    console.log('\n═══ Auto-Cleanup Statistics ═══');
    console.log(`Total Cleanups: ${stats.totalCleanups}`);
    console.log(`Total Items Cleaned: ${stats.totalItemsCleaned}`);
    console.log(`Average per Cleanup: ${stats.averagePerCleanup}`);
    console.log(`Max Single Cleanup: ${stats.maxCleanup}`);
    console.log(`Last Cleanup: ${stats.lastCleanup.toLocaleString()}`);
    console.log('═'.repeat(33));
  }
}

// Usage
const manager = new AutoCleanupManager({
  interval: 300000,      // 5 minutes
  logResults: true,
  alertThreshold: 15
});

manager.start();

// Get statistics anytime
setTimeout(() => {
  manager.generateReport();
}, 600000);  // After 10 minutes

// Stop when needed
// manager.stop();
```

### Example 3: Cleanup Comparison Tool

```javascript
class CleanupComparison {
  static compare() {
    console.log('\n📊 Cleanup Comparison Analysis\n');
    
    const results = Storage.cleanup();
    
    // Calculate ratios and percentages
    const total = results.local + results.session;
    const localPercent = total > 0 ? (results.local / total) * 100 : 0;
    const sessionPercent = total > 0 ? (results.session / total) * 100 : 0;
    const ratio = results.session > 0 ? 
      results.local / results.session : Infinity;
    
    console.log('Results:');
    console.log(`  localStorage:   ${results.local} items (${localPercent.toFixed(1)}%)`);
    console.log(`  sessionStorage: ${results.session} items (${sessionPercent.toFixed(1)}%)`);
    console.log(`  Total:          ${total} items`);
    console.log('');
    
    if (total === 0) {
      console.log('✓ No expired items in either storage\n');
      return results;
    }
    
    console.log('Analysis:');
    
    if (ratio === Infinity) {
      console.log('  • All expired items were in localStorage');
    } else if (ratio > 5) {
      console.log(`  • localStorage had ${ratio.toFixed(1)}x more expired items`);
      console.log('  • Consider reviewing localStorage expiry times');
    } else if (ratio < 0.2) {
      console.log(`  • sessionStorage had ${(1/ratio).toFixed(1)}x more expired items`);
      console.log('  • Session items may be expiring too quickly');
    } else {
      console.log('  • Fairly balanced expiry across both storage types');
    }
    
    console.log('');
    
    return {
      results,
      total,
      distribution: {
        localPercent,
        sessionPercent
      },
      ratio
    };
  }
}

// Usage
CleanupComparison.compare();
```

### Example 4: Before/After Analyzer

```javascript
class CleanupAnalyzer {
  static analyze() {
    console.log('═'.repeat(60));
    console.log('CLEANUP ANALYSIS');
    console.log('═'.repeat(60));
    
    // Get stats before cleanup
    const before = Storage.stats();
    console.log('\nBEFORE CLEANUP:');
    console.log(`  localStorage:   ${before.local.keys} items, ${this.formatBytes(before.local.totalSize)}`);
    console.log(`  sessionStorage: ${before.session.keys} items, ${this.formatBytes(before.session.totalSize)}`);
    
    // Perform cleanup
    console.log('\n🧹 Running cleanup...\n');
    const results = Storage.cleanup();
    
    // Get stats after cleanup
    const after = Storage.stats();
    console.log('AFTER CLEANUP:');
    console.log(`  localStorage:   ${after.local.keys} items, ${this.formatBytes(after.local.totalSize)}`);
    console.log(`  sessionStorage: ${after.session.keys} items, ${this.formatBytes(after.session.totalSize)}`);
    
    // Calculate changes
    console.log('\nCHANGES:');
    console.log(`  localStorage:   -${results.local} items, -${this.formatBytes(before.local.totalSize - after.local.totalSize)}`);
    console.log(`  sessionStorage: -${results.session} items, -${this.formatBytes(before.session.totalSize - after.session.totalSize)}`);
    
    const totalItemsRemoved = results.local + results.session;
    const totalSpaceFreed = (before.local.totalSize - after.local.totalSize) +
                            (before.session.totalSize - after.session.totalSize);
    
    console.log(`  Total:          -${totalItemsRemoved} items, -${this.formatBytes(totalSpaceFreed)}`);
    
    // Calculate percentages
    const localPercentReduction = before.local.keys > 0 ?
      (results.local / before.local.keys) * 100 : 0;
    const sessionPercentReduction = before.session.keys > 0 ?
      (results.session / before.session.keys) * 100 : 0;
    
    console.log('\nREDUCTION PERCENTAGES:');
    console.log(`  localStorage:   ${localPercentReduction.toFixed(1)}%`);
    console.log(`  sessionStorage: ${sessionPercentReduction.toFixed(1)}%`);
    
    console.log('\n' + '═'.repeat(60));
    
    return {
      results,
      before,
      after,
      spaceFreed: totalSpaceFreed,
      percentReduction: {
        local: localPercentReduction,
        session: sessionPercentReduction
      }
    };
  }
  
  static formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Usage
CleanupAnalyzer.analyze();
```

### Example 5: Cleanup Dashboard Widget

```javascript
class CleanupDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.lastCleanup = null;
    this.render();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="cleanup-dashboard">
        <h3>Storage Cleanup</h3>
        <div id="cleanup-stats">
          <p>No cleanup performed yet</p>
        </div>
        <button id="cleanup-btn" class="btn-primary">Run Cleanup</button>
        <div id="cleanup-history"></div>
      </div>
    `;
    
    document.getElementById('cleanup-btn').onclick = () => {
      this.performCleanup();
    };
  }
  
  performCleanup() {
    const results = Storage.cleanup();
    this.lastCleanup = {
      timestamp: Date.now(),
      results
    };
    
    this.displayResults(results);
    this.updateHistory();
  }
  
  displayResults(results) {
    const total = results.local + results.session;
    const statsDiv = document.getElementById('cleanup-stats');
    
    if (total === 0) {
      statsDiv.innerHTML = `
        <div class="success">
          <p>✓ Storage is clean!</p>
          <p>No expired items found</p>
        </div>
      `;
    } else {
      statsDiv.innerHTML = `
        <div class="info">
          <p><strong>${total}</strong> expired items removed</p>
          <ul>
            <li>localStorage: ${results.local} items</li>
            <li>sessionStorage: ${results.session} items</li>
          </ul>
        </div>
      `;
    }
  }
  
  updateHistory() {
    if (!this.lastCleanup) return;
    
    const historyDiv = document.getElementById('cleanup-history');
    const time = new Date(this.lastCleanup.timestamp).toLocaleTimeString();
    const total = this.lastCleanup.results.local + this.lastCleanup.results.session;
    
    historyDiv.innerHTML = `
      <div class="history-item">
        <small>Last cleanup: ${time}</small>
        <small>${total} items removed</small>
      </div>
    `;
  }
}

// Usage
const dashboard = new CleanupDashboard('cleanup-container');
```

---

## Best Practices

### 1. Always Check Return Value

```javascript
// Good: Check if cleanup did anything
const results = Storage.cleanup();

if (results.local > 0 || results.session > 0) {
  console.log('Cleanup removed items');
} else {
  console.log('No expired items found');
}

// Avoid: Ignoring return value
Storage.cleanup();  // ❌ Don't know what happened
```

### 2. Log Significant Cleanups

```javascript
// Good: Log when cleanup removes many items
const results = Storage.cleanup();
const total = results.local + results.session;

if (total > 10) {
  console.warn(`High cleanup count: ${total} items removed`);
  console.log(`  localStorage: ${results.local}`);
  console.log(`  sessionStorage: ${results.session}`);
}
```

### 3. Track Cleanup History

```javascript
// Good: Keep history of cleanup operations
const cleanupLog = [];

function loggedCleanup() {
  const results = Storage.cleanup();
  
  cleanupLog.push({
    timestamp: Date.now(),
    local: results.local,
    session: results.session
  });
  
  return results;
}

// Review history
function reviewCleanupHistory() {
  const totalCleaned = cleanupLog.reduce((sum, entry) => 
    sum + entry.local + entry.session, 0
  );
  
  console.log(`Total cleanups: ${cleanupLog.length}`);
  console.log(`Total items cleaned: ${totalCleaned}`);
}
```

### 4. Use for Performance Monitoring

```javascript
// Good: Monitor cleanup performance
function monitorCleanupPerformance() {
  const start = performance.now();
  const results = Storage.cleanup();
  const duration = performance.now() - start;
  
  console.log(`Cleanup completed in ${duration.toFixed(2)}ms`);
  console.log(`Removed ${results.local + results.session} items`);
  
  if (duration > 100) {
    console.warn('Cleanup took longer than expected');
  }
  
  return { results, duration };
}
```

### 5. Calculate Totals

```javascript
// Good: Calculate and use totals
const results = Storage.cleanup();
const total = results.local + results.session;

console.log(`Total items cleaned: ${total}`);

// Use for conditional logic
if (total > 0) {
  // Refresh UI or update displays
  updateStorageDisplay();
}
```

### 6. Compare Storage Types

```javascript
// Good: Analyze which storage had more expired items
const results = Storage.cleanup();

if (results.local > results.session * 2) {
  console.log('localStorage has significantly more expired items');
  console.log('Consider reviewing localStorage expiry settings');
} else if (results.session > results.local * 2) {
  console.log('sessionStorage has significantly more expired items');
  console.log('Session items may be expiring too quickly');
}
```

### 7. Integrate with Stats

```javascript
// Good: Combine cleanup results with statistics
function cleanupAndAnalyze() {
  const statsBefore = Storage.stats();
  const results = Storage.cleanup();
  const statsAfter = Storage.stats();
  
  return {
    results,
    before: {
      local: statsBefore.local.keys,
      session: statsBefore.session.keys
    },
    after: {
      local: statsAfter.local.keys,
      session: statsAfter.session.keys
    },
    percentReduction: {
      local: statsBefore.local.keys > 0 ?
        (results.local / statsBefore.local.keys) * 100 : 0,
      session: statsBefore.session.keys > 0 ?
        (results.session / statsBefore.session.keys) * 100 : 0
    }
  };
}

const analysis = cleanupAndAnalyze();
console.log('Cleanup Analysis:', analysis);
```

---

## Summary

**Cleanup Result Object:**

```javascript
const results = Storage.cleanup();

// Returns:
{
  local: number,    // Items removed from localStorage
  session: number   // Items removed from sessionStorage
}
```

**Quick Reference:**

```javascript
const results = Storage.cleanup();

// Access properties
results.local      // localStorage cleanup count
results.session    // sessionStorage cleanup count

// Calculate total
const total = results.local + results.session;

// Check if anything was cleaned
if (total > 0) {
  console.log(`Cleaned ${total} items`);
}
```

**Return Value Variations:**

```javascript
// Main Storage object - returns object
Storage.cleanup()
// { local: 3, session: 1 }

// Specific instance - returns number
Storage.local.cleanup()    // 3
Storage.session.cleanup()  // 1
Storage.namespace('blog').cleanup()  // 2
```

**Common Operations:**

```javascript
// Get results
const results = Storage.cleanup();

// Calculate total
const total = results.local + results.session;

// Check specific storage
if (results.local > 0) {
  console.log('localStorage had expired items');
}

// Compare
if (results.local > results.session) {
  console.log('localStorage had more expired items');
}

// Log formatted
console.log(`Cleanup: ${results.local} local, ${results.session} session`);
```

**Key Points:**

✅ **Always available** - Both properties always present  
✅ **Non-negative** - Values are 0 or positive  
✅ **Immediate** - Returns actual count removed  
✅ **Trackable** - Easy to log and monitor  
✅ **Comparable** - Can compare local vs session  
✅ **Useful for analytics** - Track cleanup patterns  

**Best Practices:**

1. Check return value after cleanup
2. Log significant cleanup counts
3. Track cleanup history over time
4. Calculate and use totals
5. Compare storage types
6. Monitor cleanup performance
7. Integrate with statistics

**Common Use Cases:**

- 📊 Cleanup reporting
- 📈 Historical tracking
- ⚠️ Alert systems
- 🔍 Performance monitoring
- 📉 Trend analysis
- 🎯 Storage health checks
- 🛠️ Debugging expiry issues

**Typical Values:**

```javascript
// Clean storage
{ local: 0, session: 0 }

// Normal usage
{ local: 2, session: 1 }

// High expiry rate
{ local: 15, session: 8 }

// Problematic (review expiry settings)
{ local: 50, session: 25 }
```

**Example Patterns:**

```javascript
// Pattern 1: Simple check
const results = Storage.cleanup();
if (results.local + results.session > 0) {
  console.log('Expired items removed');
}

// Pattern 2: Detailed logging
const results = Storage.cleanup();
console.log(`Cleanup: ${results.local} local, ${results.session} session, ${results.local + results.session} total`);

// Pattern 3: Conditional action
const results = Storage.cleanup();
if (results.local + results.session > 20) {
  console.warn('High cleanup count - review expiry times');
}

// Pattern 4: History tracking
cleanupHistory.push({
  timestamp: Date.now(),
  ...results
});

// Pattern 5: Performance monitoring
const start = Date.now();
const results = Storage.cleanup();
const duration = Date.now() - start;
console.log(`Cleaned ${results.local + results.session} items in ${duration}ms`);
```

**Interpreting Results:**

| Total Cleaned | Interpretation | Action |
|---------------|----------------|--------|
| 0 | No expired items | ✓ Storage is clean |
| 1-5 | Normal expiry | ✓ Expected behavior |
| 6-15 | Moderate expiry | ℹ️ Monitor patterns |
| 16-50 | High expiry rate | ⚠️ Review expiry times |
| 50+ | Very high expiry | 🚨 Investigate issue |

**Ratio Analysis:**

```javascript
const results = Storage.cleanup();

if (results.session === 0 && results.local > 0) {
  // Only localStorage has expired items
  console.log('Session items managed well, localStorage needs attention');
}

if (results.local === 0 && results.session > 0) {
  // Only sessionStorage has expired items
  console.log('Local items managed well, session items expiring');
}

const ratio = results.local / (results.session || 1);

if (ratio > 5) {
  console.log('localStorage has significantly more expired items');
} else if (ratio < 0.2) {
  console.log('sessionStorage has significantly more expired items');
} else {
  console.log('Balanced expiry across both storage types');
}
```

**Integration Examples:**

```javascript
// With statistics
function cleanupReport() {
  const before = Storage.stats();
  const results = Storage.cleanup();
  const after = Storage.stats();
  
  return {
    cleaned: results,
    before: {
      local: before.local.keys,
      session: before.session.keys
    },
    after: {
      local: after.local.keys,
      session: after.session.keys
    }
  };
}

// With alerting
function alertingCleanup() {
  const results = Storage.cleanup();
  const total = results.local + results.session;
  
  if (total > 20) {
    sendAlert('High cleanup count', results);
  }
  
  return results;
}

// With analytics
function analyticsCleanup() {
  const results = Storage.cleanup();
  
  trackEvent('storage_cleanup', {
    local_cleaned: results.local,
    session_cleaned: results.session,
    total_cleaned: results.local + results.session
  });
  
  return results;
}
```

**Advanced Usage:**

```javascript
// Cleanup comparison over time
class CleanupTracker {
  constructor() {
    this.history = [];
  }
  
  track() {
    const results = Storage.cleanup();
    this.history.push({
      timestamp: Date.now(),
      local: results.local,
      session: results.session,
      total: results.local + results.session
    });
    return results;
  }
  
  getAverage() {
    if (this.history.length === 0) return { local: 0, session: 0, total: 0 };
    
    const sum = this.history.reduce((acc, entry) => ({
      local: acc.local + entry.local,
      session: acc.session + entry.session,
      total: acc.total + entry.total
    }), { local: 0, session: 0, total: 0 });
    
    const count = this.history.length;
    
    return {
      local: sum.local / count,
      session: sum.session / count,
      total: sum.total / count
    };
  }
  
  getTrend() {
    if (this.history.length < 2) return 'insufficient_data';
    
    const recent = this.history.slice(-5);
    const older = this.history.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, e) => sum + e.total, 0) / recent.length;
    const olderAvg = older.length > 0 ? 
      older.reduce((sum, e) => sum + e.total, 0) / older.length : recentAvg;
    
    if (recentAvg > olderAvg * 1.5) return 'increasing';
    if (recentAvg < olderAvg * 0.5) return 'decreasing';
    return 'stable';
  }
}

// Usage
const tracker = new CleanupTracker();

setInterval(() => {
  const results = tracker.track();
  console.log('Cleanup:', results);
  console.log('Average:', tracker.getAverage());
  console.log('Trend:', tracker.getTrend());
}, 600000); // Every 10 minutes
```

**Visualization Helper:**

```javascript
function visualizeCleanup(results) {
  const total = results.local + results.session;
  
  if (total === 0) {
    console.log('✓ No expired items');
    return;
  }
  
  const localPercent = (results.local / total) * 100;
  const sessionPercent = (results.session / total) * 100;
  
  const barWidth = 40;
  const localBar = Math.round((localPercent / 100) * barWidth);
  const sessionBar = Math.round((sessionPercent / 100) * barWidth);
  
  console.log('Cleanup Distribution:');
  console.log(`localStorage    [${'█'.repeat(localBar)}${'░'.repeat(barWidth - localBar)}] ${results.local} (${localPercent.toFixed(1)}%)`);
  console.log(`sessionStorage  [${'█'.repeat(sessionBar)}${'░'.repeat(barWidth - sessionBar)}] ${results.session} (${sessionPercent.toFixed(1)}%)`);
  console.log(`Total: ${total} items removed`);
}

// Usage
const results = Storage.cleanup();
visualizeCleanup(results);
```

**Error Handling:**

```javascript
function safeCleanup() {
  try {
    const results = Storage.cleanup();
    
    // Validate results
    if (typeof results.local !== 'number' || typeof results.session !== 'number') {
      console.error('Invalid cleanup results');
      return { local: 0, session: 0 };
    }
    
    // Check for unexpected values
    if (results.local < 0 || results.session < 0) {
      console.error('Negative cleanup count detected');
      return { local: 0, session: 0 };
    }
    
    return results;
  } catch (error) {
    console.error('Cleanup failed:', error);
    return { local: 0, session: 0 };
  }
}
```

**Testing Helper:**

```javascript
function testCleanup() {
  console.log('Testing cleanup functionality...\n');
  
  // Setup test data
  Storage.set('test1', 'value', { expires: 1 });
  Storage.set('test2', 'value', { expires: 1 });
  Storage.session.set('test3', 'value', { expires: 1 });
  
  console.log('Created 3 items with 1-second expiry');
  console.log('Waiting for expiry...\n');
  
  setTimeout(() => {
    const results = Storage.cleanup();
    
    console.log('Cleanup Results:');
    console.log(`  localStorage: ${results.local}`);
    console.log(`  sessionStorage: ${results.session}`);
    console.log(`  Total: ${results.local + results.session}`);
    
    // Verify
    const expectedTotal = 3;
    const actualTotal = results.local + results.session;
    
    if (actualTotal === expectedTotal) {
      console.log('\n✓ Test PASSED');
    } else {
      console.log(`\n✗ Test FAILED: Expected ${expectedTotal}, got ${actualTotal}`);
    }
  }, 2000);
}

// Run test
testCleanup();
```

---

## Conclusion

The cleanup result object provides essential feedback about cleanup operations:

**Structure:**
```javascript
{
  local: number,    // localStorage items cleaned
  session: number   // sessionStorage items cleaned
}
```

**Key Takeaways:**

✅ **Simple structure** - Two properties, easy to understand  
✅ **Immediate feedback** - Know exactly what was cleaned  
✅ **Comparable values** - Easy to analyze patterns  
✅ **Actionable data** - Make decisions based on results  
✅ **Historical tracking** - Monitor trends over time  
✅ **Performance insights** - Identify storage issues  

**Remember:**

- Always check the return value
- Log significant cleanup counts
- Track history for pattern analysis
- Calculate totals for overall view
- Compare local vs session
- Use for alerts and monitoring
- Integrate with statistics for complete picture

The cleanup result object is a simple but powerful tool for maintaining healthy storage and identifying potential issues with expiry configurations!