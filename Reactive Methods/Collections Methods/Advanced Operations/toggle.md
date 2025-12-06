# Understanding `toggle()` - A Beginner's Guide

## What is `toggle()`?

`toggle()` is a method for reactive collections that toggles a boolean field on all items. It's a convenient way to flip true/false values across the collection.

Think of it as **boolean flipper** - switch all items' boolean fields.

---

## Why Does This Exist?

### The Problem: Toggling Boolean Fields

You need to flip boolean values across multiple items:

```javascript
// ❌ Without toggle - manual loop
const items = Reactive.collection([
  { id: 1, name: 'Item 1', selected: false },
  { id: 2, name: 'Item 2', selected: false }
]);

items.forEach(item => {
  item.selected = !item.selected;
});

// ✅ With toggle() - clean
items.toggle('selected');
```

**Why this matters:**
- Bulk operations
- Cleaner syntax
- Single method call
- Triggers reactivity

---

## How Does It Work?

### The Toggle Process

```javascript
collection.toggle(fieldName)
    ↓
Flips boolean field on each item
    ↓
true becomes false, false becomes true
Triggers reactive updates
```

---

## Basic Usage

### Toggle Single Field

```javascript
const items = Reactive.collection([
  { id: 1, active: false },
  { id: 2, active: true },
  { id: 3, active: false }
]);

items.toggle('active');
// Item 1: active = true
// Item 2: active = false
// Item 3: active = true
```

### Toggle Selection

```javascript
const todos = Reactive.collection([
  { title: 'Buy milk', completed: false },
  { title: 'Walk dog', completed: true }
]);

todos.toggle('completed');
// Buy milk: completed = true
// Walk dog: completed = false
```

---

## Simple Examples Explained

### Example 1: Select All/Deselect All

```javascript
const items = Reactive.collection([
  { id: 1, name: 'Item 1', selected: false },
  { id: 2, name: 'Item 2', selected: false },
  { id: 3, name: 'Item 3', selected: false }
]);

// Check if all selected
const allSelected = Reactive.computed(() => {
  return items.every(item => item.selected);
});

// Toggle all
function toggleAll() {
  if (allSelected) {
    // Deselect all
    items.forEach(item => item.selected = false);
  } else {
    // Select all
    items.forEach(item => item.selected = true);
  }
}

// Or use toggle() to flip all
function flipAll() {
  items.toggle('selected');
}

// Display items
Reactive.effect(() => {
  const container = document.getElementById('items');
  container.innerHTML = items
    .map(item => `
      <div class="item ${item.selected ? 'selected' : ''}">
        <input type="checkbox"
               ${item.selected ? 'checked' : ''}
               onchange="item.selected = !item.selected">
        ${item.name}
      </div>
    `)
    .join('');
});

// Display toggle all button
Reactive.effect(() => {
  document.getElementById('toggle-all').textContent =
    allSelected ? 'Deselect All' : 'Select All';
});
```

---

### Example 2: Visibility Toggle

```javascript
const layers = Reactive.collection([
  { id: 1, name: 'Background', visible: true },
  { id: 2, name: 'Foreground', visible: true },
  { id: 3, name: 'UI', visible: true }
]);

// Toggle all visibility
function toggleAllVisibility() {
  layers.toggle('visible');
}

// Show all
function showAll() {
  layers.forEach(layer => layer.visible = true);
}

// Hide all
function hideAll() {
  layers.forEach(layer => layer.visible = false);
}

// Display layers
Reactive.effect(() => {
  const container = document.getElementById('layers');
  container.innerHTML = layers
    .map(layer => `
      <div class="layer ${layer.visible ? 'visible' : 'hidden'}">
        <button onclick="layer.visible = !layer.visible">
          ${layer.visible ? '👁️' : '👁️‍🗨️'}
        </button>
        <span>${layer.name}</span>
      </div>
    `)
    .join('');
});
```

---

### Example 3: Task Completion Toggle

```javascript
const tasks = Reactive.collection([
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: true },
  { id: 3, title: 'Task 3', completed: false }
]);

// Toggle all completed status
function toggleAllCompleted() {
  tasks.toggle('completed');
}

// Complete all
function completeAll() {
  tasks.forEach(task => task.completed = true);
}

// Uncomplete all
function uncompleteAll() {
  tasks.forEach(task => task.completed = false);
}

// Display tasks
Reactive.effect(() => {
  const container = document.getElementById('tasks');
  const completedCount = tasks.filter(t => t.completed).length;

  container.innerHTML = `
    <h3>Tasks (${completedCount}/${tasks.length} completed)</h3>
    ${tasks.map(task => `
      <div class="task ${task.completed ? 'completed' : ''}">
        <input type="checkbox"
               ${task.completed ? 'checked' : ''}
               onchange="task.completed = !task.completed">
        <span>${task.title}</span>
      </div>
    `).join('')}
    <div class="actions">
      <button onclick="completeAll()">Complete All</button>
      <button onclick="uncompleteAll()">Uncomplete All</button>
      <button onclick="toggleAllCompleted()">Toggle All</button>
    </div>
  `;
});
```

---

## Real-World Example: Feature Flags Manager

```javascript
const features = Reactive.collection([
  { id: 1, name: 'Dark Mode', enabled: false, description: 'Enable dark theme' },
  { id: 2, name: 'Notifications', enabled: true, description: 'Show notifications' },
  { id: 3, name: 'Auto Save', enabled: true, description: 'Automatically save changes' },
  { id: 4, name: 'Beta Features', enabled: false, description: 'Enable experimental features' }
]);

// Toggle all features
function toggleAllFeatures() {
  features.toggle('enabled');
}

// Enable all
function enableAll() {
  features.forEach(f => f.enabled = true);
}

// Disable all
function disableAll() {
  features.forEach(f => f.enabled = false);
}

// Reset to defaults
function resetToDefaults() {
  const defaults = {
    'Dark Mode': false,
    'Notifications': true,
    'Auto Save': true,
    'Beta Features': false
  };

  features.forEach(feature => {
    feature.enabled = defaults[feature.name] || false;
  });
}

// Display features
Reactive.effect(() => {
  const container = document.getElementById('features');
  const enabledCount = features.filter(f => f.enabled).length;

  container.innerHTML = `
    <div class="header">
      <h3>Feature Flags (${enabledCount}/${features.length} enabled)</h3>
      <div class="bulk-actions">
        <button onclick="enableAll()">Enable All</button>
        <button onclick="disableAll()">Disable All</button>
        <button onclick="toggleAllFeatures()">Toggle All</button>
        <button onclick="resetToDefaults()">Reset</button>
      </div>
    </div>
    <div class="feature-list">
      ${features.map(feature => `
        <div class="feature ${feature.enabled ? 'enabled' : 'disabled'}">
          <div class="feature-header">
            <label class="toggle-switch">
              <input type="checkbox"
                     ${feature.enabled ? 'checked' : ''}
                     onchange="feature.enabled = !feature.enabled">
              <span class="slider"></span>
            </label>
            <div class="feature-info">
              <strong>${feature.name}</strong>
              <small>${feature.description}</small>
            </div>
          </div>
          <span class="status ${feature.enabled ? 'on' : 'off'}">
            ${feature.enabled ? 'ON' : 'OFF'}
          </span>
        </div>
      `).join('')}
    </div>
  `;
});

// Display stats
Reactive.effect(() => {
  const stats = {
    total: features.length,
    enabled: features.filter(f => f.enabled).length,
    disabled: features.filter(f => !f.enabled).length,
    percentage: Math.round((features.filter(f => f.enabled).length / features.length) * 100)
  };

  document.getElementById('stats').innerHTML = `
    <div class="stat">Total: ${stats.total}</div>
    <div class="stat">Enabled: ${stats.enabled}</div>
    <div class="stat">Disabled: ${stats.disabled}</div>
    <div class="stat">Enabled: ${stats.percentage}%</div>
  `;
});
```

---

## Common Patterns

### Pattern 1: Simple Toggle

```javascript
collection.toggle('fieldName');
```

### Pattern 2: Conditional Toggle

```javascript
if (shouldToggle) {
  collection.toggle('active');
}
```

### Pattern 3: Toggle with Check

```javascript
const allEnabled = collection.every(i => i.enabled);
if (!allEnabled) {
  collection.forEach(i => i.enabled = true);
} else {
  collection.toggle('enabled');
}
```

---

## Common Questions

### Q: What if field doesn't exist?

**Answer:** Creates the field as `true`:

```javascript
const items = Reactive.collection([{ id: 1 }]);
items.toggle('newField');
// Item now has: newField = true
```

### Q: What if field isn't boolean?

**Answer:** Applies `!` operator:

```javascript
const items = Reactive.collection([{ value: 0 }]);
items.toggle('value');
// value becomes true (because !0 = true)
```

### Q: Does it trigger reactivity?

**Answer:** Yes:

```javascript
Reactive.effect(() => {
  console.log(items[0].active);
});
items.toggle('active'); // Effect runs
```

---

## Tips for Success

### 1. Use for Boolean Fields

```javascript
// ✅ Toggle boolean fields
items.toggle('selected');
items.toggle('enabled');
items.toggle('visible');
```

### 2. Combine with Filters

```javascript
// ✅ Toggle only matching items
items
  .filter(i => i.category === 'work')
  .forEach(i => i.active = !i.active);
```

### 3. Use for Bulk Operations

```javascript
// ✅ Flip all at once
function toggleAllSelection() {
  selectedItems.toggle('selected');
}
```

---

## Summary

### What `toggle()` Does:

1. ✅ Flips boolean fields
2. ✅ Affects all items
3. ✅ true → false, false → true
4. ✅ Triggers reactivity
5. ✅ Single method call

### When to Use It:

- Select all/none
- Toggle visibility
- Flip states
- Bulk enable/disable
- Feature flags

### The Basic Pattern:

```javascript
const collection = Reactive.collection([
  { id: 1, active: false },
  { id: 2, active: true },
  { id: 3, active: false }
]);

// Toggle all
collection.toggle('active');
// Result: [true, false, true]
```

---

**Remember:** `toggle()` flips boolean fields on all items at once! 🎉
