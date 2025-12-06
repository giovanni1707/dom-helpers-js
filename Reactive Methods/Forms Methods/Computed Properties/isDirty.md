# Understanding `isDirty` - A Beginner's Guide

## What is `isDirty`?

`isDirty` is a computed property that tells you if the form has been modified from its initial state. It returns `true` if any field value has changed, `false` if all fields match their initial values.

Think of it as your **form modification detector** - it knows if the user has made changes.

---

## Why Does This Exist?

### The Problem: Detecting Changes

You need to know if the user has modified the form to warn them before leaving or enable save buttons:

```javascript
const form = Reactive.form({
  name: 'John',
  email: 'john@example.com'
});

// ❌ Manual check - compare all fields
const nameChanged = form.values.name !== 'John';
const emailChanged = form.values.email !== 'john@example.com';
const isModified = nameChanged || emailChanged;

if (isModified) {
  warnBeforeLeaving();
}

// ✅ With isDirty - one property
if (form.isDirty) {
  warnBeforeLeaving();
}
```

**Why this matters:**
- Single property to check modifications
- No manual field comparison needed
- Automatically tracks initial values
- Perfect for unsaved changes warnings
- Clean and readable

---

## How Does It Work?

### The Simple Truth

`isDirty` compares current values with initial values:

```javascript
// What isDirty does internally:
get isDirty() {
  return Object.keys(this.values).some(key =>
    this.values[key] !== this.initialValues[key]
  );
}
```

Think of it like this:

```
form.isDirty
    ↓
Compare each field:
  current value vs initial value
    ↓
Any different? → Yes → Return true
               → No → Return false
```

---

## Basic Usage

### Check if Form Modified

```javascript
const form = Reactive.form({
  username: 'john',
  email: 'john@example.com'
});

console.log(form.isDirty); // false (no changes yet)

// User changes username
form.setValue('username', 'jane');

console.log(form.isDirty); // true (modified!)
```

### Warn Before Leaving

```javascript
const form = Reactive.form({ message: '' });

window.onbeforeunload = (e) => {
  if (form.isDirty) {
    e.preventDefault();
    return 'You have unsaved changes. Leave anyway?';
  }
};
```

### Enable Save Button

```javascript
const form = Reactive.form({ title: '', content: '' });

Reactive.effect(() => {
  const saveBtn = document.getElementById('save-btn');
  saveBtn.disabled = !form.isDirty;
});
```

---

## Simple Examples Explained

### Example 1: Unsaved Changes Warning

```javascript
const profileForm = Reactive.form({
  name: 'John Doe',
  email: 'john@example.com',
  bio: 'Software developer',
  website: 'https://johndoe.com'
});

// Bind inputs
profileForm.bindToInputs('#profile-form');

// Show unsaved changes indicator
Reactive.effect(() => {
  const indicator = document.getElementById('unsaved-indicator');

  if (profileForm.isDirty) {
    indicator.textContent = '⚠️ You have unsaved changes';
    indicator.style.display = 'block';
  } else {
    indicator.style.display = 'none';
  }
});

// Warn before leaving page
window.onbeforeunload = (e) => {
  if (profileForm.isDirty) {
    e.preventDefault();
    return 'You have unsaved changes. Are you sure you want to leave?';
  }
};

// Warn before navigation
document.querySelectorAll('a').forEach(link => {
  link.onclick = (e) => {
    if (profileForm.isDirty) {
      if (!confirm('You have unsaved changes. Leave anyway?')) {
        e.preventDefault();
      }
    }
  };
});
```

**What happens:**

1. Form loaded with initial values
2. `isDirty` is `false`
3. User changes name field
4. `isDirty` becomes `true`
5. Warning indicator appears
6. Browser warns before leaving
7. User can't accidentally lose changes

---

### Example 2: Save/Reset Button States

```javascript
const settingsForm = Reactive.form({
  theme: 'light',
  fontSize: 16,
  notifications: true,
  autoSave: false
});

// Bind inputs
settingsForm.bindToInputs('#settings-form');

// Save button state
Reactive.effect(() => {
  const saveBtn = document.getElementById('save-btn');

  if (settingsForm.isDirty && settingsForm.isValid) {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Changes';
    saveBtn.classList.add('btn-primary');
  } else if (settingsForm.isDirty) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Fix Errors';
    saveBtn.classList.remove('btn-primary');
  } else {
    saveBtn.disabled = true;
    saveBtn.textContent = 'No Changes';
    saveBtn.classList.remove('btn-primary');
  }
});

// Reset button state
Reactive.effect(() => {
  const resetBtn = document.getElementById('reset-btn');

  if (settingsForm.isDirty) {
    resetBtn.disabled = false;
    resetBtn.style.display = 'inline-block';
  } else {
    resetBtn.disabled = true;
    resetBtn.style.display = 'none';
  }
});

// Save changes
document.getElementById('save-btn').onclick = async () => {
  if (!settingsForm.isDirty) return;

  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsForm.values)
    });

    // Update initial values after save
    settingsForm.initialValues = { ...settingsForm.values };

    alert('Settings saved!');
  } catch (err) {
    alert('Failed to save settings');
  }
};

// Reset to initial values
document.getElementById('reset-btn').onclick = () => {
  if (confirm('Reset all changes?')) {
    settingsForm.reset();
  }
};
```

**What happens:**

1. Settings loaded with defaults
2. Save and reset buttons disabled (`isDirty` is `false`)
3. User changes theme
4. `isDirty` becomes `true`
5. Save button enables
6. Reset button appears
7. User can save or reset
8. After save, `isDirty` becomes `false` again

---

### Example 3: Auto-Save Draft

```javascript
const postForm = Reactive.form({
  title: '',
  content: '',
  category: 'general',
  tags: ''
});

// Bind inputs
postForm.bindToInputs('#post-form');

// Auto-save draft when dirty
let autoSaveTimeout;

Reactive.effect(() => {
  if (postForm.isDirty) {
    clearTimeout(autoSaveTimeout);

    autoSaveTimeout = setTimeout(() => {
      saveDraft();
    }, 2000); // Save 2 seconds after last change
  }
});

// Show draft status
Reactive.effect(() => {
  const statusElement = document.getElementById('draft-status');

  if (postForm.isDirty) {
    statusElement.textContent = '📝 Unsaved changes...';
    statusElement.className = 'status-unsaved';
  } else {
    statusElement.textContent = '✓ All changes saved';
    statusElement.className = 'status-saved';
  }
});

async function saveDraft() {
  try {
    await fetch('/api/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...postForm.values,
        savedAt: new Date().toISOString()
      })
    });

    // Update initial values after save
    postForm.initialValues = { ...postForm.values };

    showNotification('Draft saved');
  } catch (err) {
    console.error('Failed to save draft:', err);
  }
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}

// Publish post
document.getElementById('publish-btn').onclick = async () => {
  postForm.touchAll();

  if (!postForm.isValid) {
    alert('Please fix errors before publishing');
    return;
  }

  try {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postForm.values)
    });

    alert('Post published!');

    // Clear form and reset dirty state
    postForm.reset();

    window.location.href = '/posts';
  } catch (err) {
    alert('Failed to publish post');
  }
};
```

**What happens:**

1. User starts typing
2. `isDirty` becomes `true`
3. Shows "Unsaved changes" status
4. After 2 seconds of inactivity, auto-saves
5. Updates initial values after save
6. `isDirty` becomes `false`
7. Shows "All changes saved" status
8. Continues for each change
9. User never loses work

---

## Real-World Example: Complete Editor Form

```javascript
const editorForm = Reactive.form({
  documentName: 'Untitled',
  content: '',
  author: currentUser.name,
  isPublic: false,
  allowComments: true,
  category: 'draft'
});

// Bind inputs
editorForm.bindToInputs('#editor-form');

// Show dirty indicator in title
Reactive.effect(() => {
  const titleElement = document.querySelector('title');
  const documentName = editorForm.values.documentName || 'Untitled';

  if (editorForm.isDirty) {
    titleElement.textContent = `● ${documentName} - Unsaved`;
  } else {
    titleElement.textContent = `${documentName}`;
  }
});

// Show save button state
Reactive.effect(() => {
  const saveBtn = document.getElementById('save-btn');
  const saveIcon = document.getElementById('save-icon');

  if (editorForm.isDirty) {
    saveBtn.disabled = !editorForm.isValid;
    saveBtn.classList.add('btn-highlight');
    saveIcon.textContent = '💾';
    saveBtn.textContent = 'Save';
  } else {
    saveBtn.disabled = true;
    saveBtn.classList.remove('btn-highlight');
    saveIcon.textContent = '✓';
    saveBtn.textContent = 'Saved';
  }
});

// Keyboard shortcut: Ctrl+S / Cmd+S
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();

    if (editorForm.isDirty && editorForm.isValid) {
      saveDocument();
    }
  }
});

// Warn before closing
window.onbeforeunload = (e) => {
  if (editorForm.isDirty) {
    e.preventDefault();
    return 'You have unsaved changes.';
  }
};

// Auto-save every 30 seconds if dirty
setInterval(() => {
  if (editorForm.isDirty && editorForm.isValid) {
    autoSave();
  }
}, 30000);

// Show last saved time
let lastSavedTime = null;

Reactive.effect(() => {
  const lastSavedElement = document.getElementById('last-saved');

  if (!editorForm.isDirty && lastSavedTime) {
    const timeAgo = getTimeAgo(lastSavedTime);
    lastSavedElement.textContent = `Last saved ${timeAgo}`;
    lastSavedElement.style.display = 'block';
  } else if (editorForm.isDirty) {
    lastSavedElement.textContent = 'Unsaved changes';
    lastSavedElement.style.display = 'block';
  } else {
    lastSavedElement.style.display = 'none';
  }
});

// Update time ago every minute
setInterval(() => {
  if (lastSavedTime) {
    const lastSavedElement = document.getElementById('last-saved');
    const timeAgo = getTimeAgo(lastSavedTime);
    lastSavedElement.textContent = `Last saved ${timeAgo}`;
  }
}, 60000);

// Save document
async function saveDocument() {
  if (!editorForm.isValid) {
    alert('Please fix errors before saving');
    return;
  }

  try {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editorForm.values,
        savedAt: new Date().toISOString()
      })
    });

    if (response.ok) {
      // Update initial values after successful save
      editorForm.initialValues = { ...editorForm.values };
      lastSavedTime = new Date();

      showToast('Document saved successfully');
    } else {
      throw new Error('Save failed');
    }
  } catch (err) {
    alert('Failed to save document');
  }
}

// Auto-save (silent)
async function autoSave() {
  try {
    await fetch('/api/documents/autosave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editorForm.values)
    });

    editorForm.initialValues = { ...editorForm.values };
    lastSavedTime = new Date();

    console.log('Auto-saved at', lastSavedTime);
  } catch (err) {
    console.error('Auto-save failed:', err);
  }
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Save button
document.getElementById('save-btn').onclick = () => {
  if (editorForm.isDirty) {
    saveDocument();
  }
};
```

**What happens:**
- Page title shows unsaved indicator (●) when dirty
- Save button highlights when dirty
- Ctrl+S/Cmd+S keyboard shortcut saves
- Warns before closing with unsaved changes
- Auto-saves every 30 seconds if dirty
- Shows "last saved" timestamp
- After save, initial values updated, isDirty becomes false
- Professional editor experience

---

## Common Patterns

### Pattern 1: Warn Before Leaving

```javascript
window.onbeforeunload = (e) => {
  if (form.isDirty) {
    e.preventDefault();
    return 'Unsaved changes';
  }
};
```

### Pattern 2: Enable Save Button

```javascript
Reactive.effect(() => {
  saveBtn.disabled = !form.isDirty;
});
```

### Pattern 3: Show Indicator

```javascript
Reactive.effect(() => {
  indicator.style.display = form.isDirty ? 'block' : 'none';
});
```

### Pattern 4: Combine with isValid

```javascript
Reactive.effect(() => {
  saveBtn.disabled = !form.isDirty || !form.isValid;
});
```

---

## Common Beginner Questions

### Q: When does `isDirty` become `true`?

**Answer:**

When any field value differs from its initial value:

```javascript
const form = Reactive.form({ name: 'John' });

console.log(form.isDirty); // false

form.setValue('name', 'Jane');
console.log(form.isDirty); // true

form.setValue('name', 'John'); // Back to initial
console.log(form.isDirty); // false again!
```

### Q: How do I reset `isDirty`?

**Answer:**

Use `reset()` or update `initialValues`:

```javascript
// Method 1: Reset form
form.reset(); // Values and isDirty reset

// Method 2: Update initial values after save
form.initialValues = { ...form.values };
// Now isDirty is false with current values as baseline
```

### Q: Does `isDirty` check touched state?

**Answer:**

No! Only checks if values changed:

```javascript
const form = Reactive.form({ email: '' });

console.log(form.isDirty); // false
console.log(form.isTouched('email')); // false

// These are independent!
```

### Q: What if I load data from server?

**Answer:**

Set values with `setValues()`, then update initialValues:

```javascript
// Load from server
const data = await fetchUserProfile();

// Set form values
form.setValues(data);

// Update initial values to match
form.initialValues = { ...data };

// Now isDirty is false with loaded data as baseline
```

### Q: Is `isDirty` reactive?

**Answer:**

Yes! Updates automatically:

```javascript
Reactive.effect(() => {
  console.log('Form dirty:', form.isDirty);
  // Re-runs when values change
});
```

---

## Tips for Success

### 1. Always Warn Before Leaving

```javascript
// ✅ Prevent accidental data loss
window.onbeforeunload = (e) => {
  if (form.isDirty) {
    e.preventDefault();
    return 'Unsaved changes';
  }
};
```

### 2. Show Save Button Only When Dirty

```javascript
// ✅ Clean UI
Reactive.effect(() => {
  saveBtn.style.display = form.isDirty ? 'block' : 'none';
});
```

### 3. Update initialValues After Save

```javascript
// ✅ Reset dirty state after save
await saveData();
form.initialValues = { ...form.values };
// Now isDirty is false
```

### 4. Combine with isValid

```javascript
// ✅ Enable save only if dirty AND valid
Reactive.effect(() => {
  saveBtn.disabled = !form.isDirty || !form.isValid;
});
```

### 5. Use for Auto-Save

```javascript
// ✅ Save only when changes exist
Reactive.effect(() => {
  if (form.isDirty) {
    autoSaveTimeout = setTimeout(save, 2000);
  }
});
```

---

## Summary

### What `isDirty` Does:

1. ✅ Computed property (not a method)
2. ✅ Returns `true` if form modified
3. ✅ Returns `false` if matches initial values
4. ✅ Reactive - updates automatically
5. ✅ Compares all field values
6. ✅ Perfect for unsaved changes detection

### When to Use It:

- Warn before leaving page (most common)
- Enable/disable save buttons
- Show unsaved changes indicators
- Auto-save triggers
- Form state tracking
- Any modification detection

### The Basic Pattern:

```javascript
const form = Reactive.form({ field: 'initial' });

// Check if modified
if (form.isDirty) {
  console.log('Form has changes!');
}

// Warn before leaving
window.onbeforeunload = (e) => {
  if (form.isDirty) {
    e.preventDefault();
    return 'Unsaved changes';
  }
};

// Enable save button
Reactive.effect(() => {
  saveBtn.disabled = !form.isDirty;
});
```

---

**Remember:** `isDirty` tells you if the form has been modified from its initial state. Use it to warn users about unsaved changes and control save button states. It's reactive and updates automatically! 🎉
