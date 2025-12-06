# Understanding `notify()` - A Beginner's Guide

## What is `notify()`?

`notify()` is a function that **manually triggers all effects** that depend on a specific property (or all properties) of your reactive state. It forces effects to re-run, even if you didn't change the reactive state through normal means.

Think of it as a **manual refresh button**:
1. You make changes outside the reactive system
2. Call `notify()` to alert the reactive system
3. All dependent effects run as if the property changed
4. UI and other reactions update

It's like manually ringing a bell to alert everyone, instead of waiting for the automatic alarm!

---

## Why Does This Exist?

### The Problem

Sometimes you change data in ways the reactive system can't detect:

```javascript
const state = Reactive.state({
  items: [1, 2, 3]
});

Reactive.effect(() => {
  console.log('Items:', state.items.length);
});
// Logs: "Items: 3"

// Change via raw object - no effect runs
const raw = Reactive.toRaw(state);
raw.items.push(4);

console.log(state.items.length);  // 4
// But effect didn't run! UI might be out of sync!
```

**Problems:**
- Changes via `toRaw()` don't trigger effects
- Direct array mutations might not be detected
- External updates need manual triggering
- No way to force refresh without changing data

### The Solution

With `notify()`, you can manually trigger effects:

```javascript
const state = Reactive.state({
  items: [1, 2, 3]
});

Reactive.effect(() => {
  console.log('Items:', state.items.length);
});
// Logs: "Items: 3"

// Change via raw object
const raw = Reactive.toRaw(state);
raw.items.push(4);

// Manually notify that items changed
Reactive.notify(state, 'items');
// Logs: "Items: 4" - effect runs!
```

**Benefits:**
- Force effects to run after manual changes
- Complete control over when effects trigger
- Works with `toRaw()` for performance + reactivity
- Can refresh UI on demand
- Useful for external data updates

---

## How Does It Work?

The reactive system tracks which effects depend on which properties. `notify()` manually triggers those tracked effects:

```javascript
const state = Reactive.state({ count: 0 });

Reactive.effect(() => {
  console.log('Count:', state.count);
  // This effect is tracked as depending on 'count'
});

// Internally, system knows: effect1 depends on state.count

Reactive.notify(state, 'count');
// System: "Run all effects that depend on state.count"
// → effect1 runs
```

**Key concept:** `notify()` bypasses normal change detection and directly triggers effects!

---

## Simple Examples Explained

### Example 1: Basic Notification

```javascript
const state = Reactive.state({ message: 'Hello' });

Reactive.effect(() => {
  console.log('Message:', state.message);
});
// Logs: "Message: Hello"

// Notify without changing anything - effect still runs
Reactive.notify(state, 'message');
// Logs: "Message: Hello" again

// Useful for force-refreshing
state.message = 'Hi';
// Logs: "Message: Hi"
```

---

### Example 2: With toRaw() for Performance

```javascript
const todos = Reactive.state({
  items: []
});

Reactive.effect(() => {
  console.log('Total todos:', todos.items.length);
  renderTodos(todos.items);
});

// Add many items efficiently
const raw = Reactive.toRaw(todos);

// No effects during loop (fast!)
for (let i = 0; i < 100; i++) {
  raw.items.push({ id: i, text: `Task ${i}` });
}

// Trigger effect once when done
Reactive.notify(todos, 'items');
// Logs: "Total todos: 100"
// Renders once, not 100 times!
```

---

### Example 3: Notify All Properties

```javascript
const form = Reactive.state({
  name: '',
  email: '',
  phone: ''
});

Reactive.effect(() => {
  console.log('Form changed:', form.name, form.email, form.phone);
});

// Update multiple properties via raw
const raw = Reactive.toRaw(form);
raw.name = 'John';
raw.email = 'john@example.com';
raw.phone = '555-1234';

// Notify without specifying property - triggers all effects
Reactive.notify(form);
// Logs all updated values
```

---

### Example 4: External Data Updates

```javascript
const weather = Reactive.state({
  temperature: 20,
  condition: 'sunny',
  lastUpdated: null
});

Reactive.effect(() => {
  document.getElementById('temp').textContent = 
    `${weather.temperature}°C - ${weather.condition}`;
});

// Fetch new data from API
async function refreshWeather() {
  const data = await fetch('/api/weather').then(r => r.json());
  
  // Update via raw (no intermediate effect runs)
  const raw = Reactive.toRaw(weather);
  raw.temperature = data.temp;
  raw.condition = data.condition;
  raw.lastUpdated = new Date();
  
  // Trigger UI update once
  Reactive.notify(weather);
  // Display updates with all new data
}
```

---

### Example 5: Force Refresh

```javascript
const clock = Reactive.state({
  time: new Date().toLocaleTimeString()
});

Reactive.effect(() => {
  document.getElementById('clock').textContent = clock.time;
});

// Update clock every second
setInterval(() => {
  // Update raw to avoid effect during assignment
  const raw = Reactive.toRaw(clock);
  raw.time = new Date().toLocaleTimeString();
  
  // Trigger UI update
  Reactive.notify(clock, 'time');
}, 1000);

// Or force refresh without changing anything
document.getElementById('refresh-btn').onclick = () => {
  Reactive.notify(clock, 'time');  // Re-render with same data
};
```

---

### Example 6: State Method Integration

```javascript
const state = Reactive.state({
  items: [],
  count: 0
});

Reactive.effect(() => {
  console.log('State updated:', state.count, 'items');
});

// Can also use $notify method on state
state.$notify('count');  // Triggers effects for 'count'
state.$notify();         // Triggers all effects

// Useful in methods
state.bulkUpdate = function(newItems) {
  const raw = Reactive.toRaw(this);
  raw.items = newItems;
  raw.count = newItems.length;
  this.$notify();  // Trigger all effects
};

state.bulkUpdate([1, 2, 3]);
// Logs: "State updated: 3 items"
```

---

## Real-World Example: Live Data Dashboard

```javascript
const dashboard = Reactive.state({
  users: 0,
  sales: 0,
  revenue: 0,
  orders: [],
  lastSync: null
});

// UI updates automatically
Reactive.effect(() => {
  document.getElementById('users').textContent = dashboard.users;
  document.getElementById('sales').textContent = dashboard.sales;
  document.getElementById('revenue').textContent = `$${dashboard.revenue}`;
  document.getElementById('orders').textContent = dashboard.orders.length;
  
  const syncTime = dashboard.lastSync 
    ? dashboard.lastSync.toLocaleTimeString()
    : 'Never';
  document.getElementById('sync-time').textContent = syncTime;
});

// Sync data from server
async function syncDashboard() {
  console.log('Syncing dashboard data...');
  
  // Fetch all data in parallel
  const [usersData, salesData, revenueData, ordersData] = await Promise.all([
    fetch('/api/users/count').then(r => r.json()),
    fetch('/api/sales/count').then(r => r.json()),
    fetch('/api/revenue/total').then(r => r.json()),
    fetch('/api/orders/recent').then(r => r.json())
  ]);
  
  // Update all at once via raw (no intermediate renders)
  const raw = Reactive.toRaw(dashboard);
  raw.users = usersData.count;
  raw.sales = salesData.count;
  raw.revenue = revenueData.total;
  raw.orders = ordersData.orders;
  raw.lastSync = new Date();
  
  // Trigger single UI update with all new data
  Reactive.notify(dashboard);
  console.log('✅ Dashboard synced');
}

// Auto-sync every 30 seconds
setInterval(syncDashboard, 30000);

// Manual refresh button
document.getElementById('refresh-btn').onclick = syncDashboard;

// Initial sync
syncDashboard();
```

---

## Common Beginner Questions

### Q: What's the difference between `notify()` and normal assignment?

**Answer:**

```javascript
const state = Reactive.state({ count: 0 });

// Normal assignment - triggers effects automatically
state.count = 5;  // Effects run

// notify() - triggers effects manually
const raw = Reactive.toRaw(state);
raw.count = 10;          // No effects
Reactive.notify(state, 'count');  // Effects run
```

**Use normal assignment** when you want automatic reactivity
**Use notify()** when you've bypassed reactivity and need to trigger manually

---

### Q: Can I notify a property that doesn't exist?

**Answer:** Yes, but it won't do anything unless effects are watching it:

```javascript
const state = Reactive.state({ count: 0 });

Reactive.notify(state, 'nonexistent');  // No error, but no effects run

Reactive.effect(() => {
  console.log(state.nonexistent);  // undefined
});

Reactive.notify(state, 'nonexistent');  // Now effect runs
```

---

### Q: Does notify() work with computed properties?

**Answer:** Yes! Notifying dependencies updates computed:

```javascript
const state = Reactive.state({ a: 1, b: 2 });

Reactive.computed(state, {
  sum() { return this.a + this.b; }
});

const raw = Reactive.toRaw(state);
raw.a = 10;

console.log(state.sum);  // Still 3 (computed not updated yet)

Reactive.notify(state, 'a');
console.log(state.sum);  // 12 (computed recalculated)
```

---

### Q: Can I notify multiple properties at once?

**Answer:** Notify all by omitting the property name:

```javascript
const state = Reactive.state({ a: 1, b: 2, c: 3 });

// Notify all properties
Reactive.notify(state);

// All effects that watch any property will run
```

---

### Q: Does notify() call the same effect multiple times?

**Answer:** No, each effect runs once even if multiple properties are notified:

```javascript
const state = Reactive.state({ a: 1, b: 2 });

let runs = 0;
Reactive.effect(() => {
  runs++;
  console.log(state.a, state.b);
});

Reactive.notify(state, 'a');
Reactive.notify(state, 'b');
console.log('Effect runs:', runs);  // 3 (initial + a + b)

// But if you notify all at once:
Reactive.notify(state);  // Only 1 more run
```

---

## Tips for Beginners

### 1. Pair with toRaw() for Performance

```javascript
// ✅ Best practice
const raw = Reactive.toRaw(state);
// Make multiple changes to raw
raw.prop1 = value1;
raw.prop2 = value2;
// Trigger once
Reactive.notify(state);

// ❌ Triggers effect twice
state.prop1 = value1;  // Effect runs
state.prop2 = value2;  // Effect runs
```

---

### 2. Use for Batch External Updates

```javascript
async function loadAllData(state) {
  const data = await fetchFromAPI();
  
  const raw = Reactive.toRaw(state);
  Object.assign(raw, data);
  
  Reactive.notify(state);  // One update
}
```

---

### 3. Force Refresh When Needed

```javascript
// Refresh display even if data didn't change
function forceRefresh() {
  Reactive.notify(state);  // Re-runs all effects
}

document.getElementById('refresh').onclick = forceRefresh;
```

---

### 4. Notify Specific Properties

```javascript
// Only notify what actually changed
const raw = Reactive.toRaw(state);
raw.items.push(newItem);
Reactive.notify(state, 'items');  // Only 'items' effects run
```

---

## Summary

### What `notify()` Does:

1. ✅ Manually triggers effects for a property
2. ✅ Bypasses normal change detection
3. ✅ Can notify all properties or specific ones
4. ✅ Works perfectly with `toRaw()` for performance
5. ✅ Forces UI refresh on demand

### When to Use It:

- After using `toRaw()` to make changes
- Bulk updates for performance
- External data updates
- Force refresh without changing data
- Fine control over effect timing

### The Basic Pattern:

```javascript
// Make changes via raw (fast, no effects)
const raw = Reactive.toRaw(state);
raw.property = newValue;

// Trigger effects manually (once)
Reactive.notify(state, 'property');

// Or notify all properties
Reactive.notify(state);
```

**Remember:** `notify()` gives you manual control over the reactive system - perfect when you need performance with `toRaw()` or want to force effects to run! 🎉