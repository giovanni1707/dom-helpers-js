# Understanding `touchedFields` - A Beginner's Guide

## What is `touchedFields`?

`touchedFields` is a computed property that returns an array of field names that have been touched (interacted with). It gives you a list of fields the user has visited.

Think of it as your **interaction tracker** - it tells you which fields the user has touched.

---

## Why Does This Exist?

### The Problem: Finding Touched Fields

You need to know which fields have been touched for progress tracking or analytics:

```javascript
const form = Reactive.form({
  username: '',
  email: '',
  password: ''
});

// ❌ Manual - iterate and filter
const touched = [];
Object.keys(form.touched).forEach(field => {
  if (form.touched[field]) {
    touched.push(field);
  }
});
console.log(touched);

// ✅ With touchedFields - one property
console.log(form.touchedFields);
// ['username', 'email'] - clean array!
```

**Why this matters:**
- Get touched fields as array instantly
- No manual filtering needed
- Perfect for progress tracking
- Great for analytics
- Clean and readable

---

## How Does It Work?

### The Simple Truth

`touchedFields` filters the touched object and returns field names:

```javascript
// What touchedFields does internally:
get touchedFields() {
  return Object.keys(this.touched).filter(key => this.touched[key]);
}
```

Think of it like this:

```
form.touchedFields
    ↓
Look at form.touched
    ↓
Filter for true values
    ↓
Return array of field names
```

---

## Basic Usage

### Get Touched Fields

```javascript
const form = Reactive.form({
  username: '',
  email: '',
  password: ''
});

console.log(form.touchedFields); // []

form.setTouched('username');
form.setTouched('email');

console.log(form.touchedFields); // ['username', 'email']
```

### Show Progress

```javascript
const form = Reactive.form({
  name: '',
  email: '',
  phone: ''
});

Reactive.effect(() => {
  const total = Object.keys(form.values).length;
  const touched = form.touchedFields.length;
  console.log(`${touched}/${total} fields visited`);
});
```

### Check Completion

```javascript
const form = Reactive.form({
  field1: '',
  field2: '',
  field3: ''
});

const allTouched = form.touchedFields.length === Object.keys(form.values).length;
console.log('All fields touched:', allTouched);
```

---

## Simple Examples Explained

### Example 1: Form Progress Indicator

```javascript
const registrationForm = Reactive.form({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
});

// Bind inputs with blur tracking
['username', 'email', 'password', 'confirmPassword'].forEach(field => {
  const input = document.getElementById(field);
  input.oninput = registrationForm.handleChange(field);
  input.onblur = registrationForm.handleBlur(field);
});

// Show progress
Reactive.effect(() => {
  const progressElement = document.getElementById('progress');
  const totalFields = 5;
  const touchedCount = registrationForm.touchedFields.length;
  const percentage = Math.round((touchedCount / totalFields) * 100);

  progressElement.textContent = `${touchedCount}/${totalFields} fields completed (${percentage}%)`;

  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = `${percentage}%`;
});

// Show which fields still need attention
Reactive.effect(() => {
  const allFields = ['username', 'email', 'password', 'confirmPassword', 'terms'];
  const touched = registrationForm.touchedFields;
  const untouched = allFields.filter(f => !touched.includes(f));

  const reminderElement = document.getElementById('reminder');

  if (untouched.length > 0) {
    reminderElement.innerHTML = `
      <p>Fields you haven't visited yet:</p>
      <ul>${untouched.map(f => `<li>${f}</li>`).join('')}</ul>
    `;
    reminderElement.style.display = 'block';
  } else {
    reminderElement.style.display = 'none';
  }
});
```

**What happens:**

1. User starts filling form
2. As they leave each field, it's marked touched
3. Progress bar updates showing touched/total
4. Shows list of untouched fields
5. When all touched, reminder hides
6. Visual progress feedback

---

### Example 2: Field Visit Tracking

```javascript
const surveyForm = Reactive.form({
  question1: '',
  question2: '',
  question3: '',
  question4: '',
  question5: ''
});

// Bind inputs
surveyForm.bindToInputs('#survey-form');

// Track field visits in real-time
Reactive.effect(() => {
  const touchedFields = surveyForm.touchedFields;

  console.log('Visited fields:', touchedFields);

  // Send analytics
  if (touchedFields.length > 0) {
    trackEvent('survey_progress', {
      fieldsVisited: touchedFields,
      completionRate: (touchedFields.length / 5) * 100
    });
  }
});

// Show completion checklist
Reactive.effect(() => {
  const checklistElement = document.getElementById('checklist');
  const allFields = ['question1', 'question2', 'question3', 'question4', 'question5'];
  const touched = surveyForm.touchedFields;

  const checklistHTML = allFields.map(field => {
    const isTouched = touched.includes(field);
    const icon = isTouched ? '✅' : '○';
    const className = isTouched ? 'completed' : 'pending';

    return `<li class="${className}">${icon} ${field}</li>`;
  }).join('');

  checklistElement.innerHTML = `<ul>${checklistHTML}</ul>`;
});

// Enable submit only when all fields touched
Reactive.effect(() => {
  const submitBtn = document.getElementById('submit-btn');
  const allTouched = surveyForm.touchedFields.length === 5;

  if (allTouched) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Survey';
  } else {
    submitBtn.disabled = true;
    submitBtn.textContent = `Complete ${5 - surveyForm.touchedFields.length} more field(s)`;
  }
});
```

**What happens:**

1. Tracks which fields user has visited
2. Sends analytics on progress
3. Shows checklist with completed/pending markers
4. Submit button disabled until all touched
5. Button shows how many fields remain
6. Encourages form completion

---

### Example 3: Smart Field Navigation

```javascript
const applicationForm = Reactive.form({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: ''
});

// Bind inputs
applicationForm.bindToInputs('#application-form');

// Auto-focus next untouched field
function focusNextUntouchedField() {
  const allFields = Object.keys(applicationForm.values);
  const touched = applicationForm.touchedFields;
  const nextField = allFields.find(f => !touched.includes(f));

  if (nextField) {
    document.getElementById(nextField).focus();
    return true;
  }
  return false;
}

// "Next" button advances to next untouched field
document.getElementById('next-btn').onclick = () => {
  if (!focusNextUntouchedField()) {
    alert('All fields completed!');
  }
};

// Show navigation help
Reactive.effect(() => {
  const helpElement = document.getElementById('navigation-help');
  const allFields = Object.keys(applicationForm.values);
  const touched = applicationForm.touchedFields;
  const remaining = allFields.length - touched.length;

  if (remaining > 0) {
    const nextField = allFields.find(f => !touched.includes(f));
    helpElement.textContent = `${remaining} field(s) remaining. Next: ${nextField}`;
    helpElement.style.display = 'block';
  } else {
    helpElement.textContent = '✅ All fields visited!';
    helpElement.classList.add('complete');
  }
});

// Show field completion badges
Reactive.effect(() => {
  const allFields = Object.keys(applicationForm.values);
  const touched = applicationForm.touchedFields;

  allFields.forEach(field => {
    const badge = document.getElementById(`${field}-badge`);
    if (badge) {
      if (touched.includes(field)) {
        badge.textContent = '✓';
        badge.className = 'badge badge-complete';
      } else {
        badge.textContent = '○';
        badge.className = 'badge badge-pending';
      }
    }
  });
});
```

**What happens:**

1. Next button focuses next untouched field
2. Help text shows remaining fields and next field
3. Each field has completion badge
4. Guides user through form systematically
5. Shows clear progress
6. Smart navigation UX

---

## Real-World Example: Multi-Section Form

```javascript
const profileForm = Reactive.form({
  // Personal Info
  firstName: '',
  lastName: '',
  dateOfBirth: '',

  // Contact
  email: '',
  phone: '',

  // Address
  street: '',
  city: '',
  state: '',
  zipCode: '',

  // Preferences
  newsletter: false,
  notifications: true
});

// Bind inputs
profileForm.bindToInputs('#profile-form');

// Section definitions
const sections = {
  personal: ['firstName', 'lastName', 'dateOfBirth'],
  contact: ['email', 'phone'],
  address: ['street', 'city', 'state', 'zipCode'],
  preferences: ['newsletter', 'notifications']
};

// Track section completion
Reactive.effect(() => {
  const touched = profileForm.touchedFields;

  Object.entries(sections).forEach(([sectionName, fields]) => {
    const sectionElement = document.getElementById(`section-${sectionName}`);
    const touchedInSection = fields.filter(f => touched.includes(f)).length;
    const totalInSection = fields.length;
    const percentage = Math.round((touchedInSection / totalInSection) * 100);

    // Update section header
    const header = sectionElement.querySelector('.section-header');
    header.innerHTML = `
      <h3>${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}</h3>
      <span class="section-progress">${touchedInSection}/${totalInSection} (${percentage}%)</span>
    `;

    // Update section status
    if (touchedInSection === 0) {
      sectionElement.classList.add('not-started');
      sectionElement.classList.remove('in-progress', 'completed');
    } else if (touchedInSection < totalInSection) {
      sectionElement.classList.add('in-progress');
      sectionElement.classList.remove('not-started', 'completed');
    } else {
      sectionElement.classList.add('completed');
      sectionElement.classList.remove('not-started', 'in-progress');
    }
  });
});

// Overall progress
Reactive.effect(() => {
  const totalFields = Object.keys(profileForm.values).length;
  const touchedCount = profileForm.touchedFields.length;
  const percentage = Math.round((touchedCount / totalFields) * 100);

  document.getElementById('overall-progress-bar').style.width = `${percentage}%`;
  document.getElementById('overall-progress-text').textContent = `${touchedCount}/${totalFields} fields completed`;
});

// Section navigation
Object.entries(sections).forEach(([sectionName, fields], index) => {
  const nextBtn = document.getElementById(`${sectionName}-next`);
  if (nextBtn) {
    nextBtn.onclick = () => {
      // Touch all fields in current section
      fields.forEach(field => profileForm.setTouched(field));

      // Move to next section
      const sectionNames = Object.keys(sections);
      const nextSectionName = sectionNames[index + 1];
      if (nextSectionName) {
        document.getElementById(`section-${nextSectionName}`).scrollIntoView({
          behavior: 'smooth'
        });
      }
    };
  }
});

// Analytics - track abandonment points
let lastTouchedCount = 0;

Reactive.effect(() => {
  const touchedCount = profileForm.touchedFields.length;

  if (touchedCount > lastTouchedCount) {
    trackEvent('form_progress', {
      fieldsCompleted: touchedCount,
      totalFields: Object.keys(profileForm.values).length,
      lastField: profileForm.touchedFields[profileForm.touchedFields.length - 1]
    });

    lastTouchedCount = touchedCount;
  }
});

// Show completion celebration
Reactive.effect(() => {
  const celebrationElement = document.getElementById('completion-celebration');
  const allTouched = profileForm.touchedFields.length === Object.keys(profileForm.values).length;

  if (allTouched) {
    celebrationElement.innerHTML = `
      <div class="celebration">
        <h2>🎉 Amazing!</h2>
        <p>You've completed all sections!</p>
        <p>Review your information and submit when ready.</p>
      </div>
    `;
    celebrationElement.style.display = 'block';
  } else {
    celebrationElement.style.display = 'none';
  }
});
```

**What happens:**
- Tracks completion per section
- Shows section progress bars
- Visual status (not-started/in-progress/completed)
- Overall progress tracking
- Next button touches all section fields
- Analytics tracking
- Celebration when all fields touched
- Professional multi-section form UX

---

## Common Patterns

### Pattern 1: Get Touched Count

```javascript
const touchedCount = form.touchedFields.length;
```

### Pattern 2: Check Specific Field

```javascript
const isEmailTouched = form.touchedFields.includes('email');
```

### Pattern 3: Find Untouched Fields

```javascript
const allFields = Object.keys(form.values);
const untouched = allFields.filter(f => !form.touchedFields.includes(f));
```

### Pattern 4: Progress Percentage

```javascript
const percentage = (form.touchedFields.length / Object.keys(form.values).length) * 100;
```

---

## Common Beginner Questions

### Q: What's the difference between `touchedFields` and `touched`?

**Answer:**

- **`touchedFields`** = Array of touched field names
- **`touched`** = Object with field names as keys

```javascript
form.setTouched('email');
form.setTouched('password');

console.log(form.touchedFields); // ['email', 'password'] - array
console.log(form.touched); // { email: true, password: true } - object
```

### Q: Does it include false values?

**Answer:**

No! Only fields where touched is `true`:

```javascript
form.touched = { email: true, password: false };

console.log(form.touchedFields); // ['email'] - only true values
```

### Q: Is it reactive?

**Answer:**

Yes! Updates automatically:

```javascript
Reactive.effect(() => {
  console.log('Touched fields:', form.touchedFields);
  // Re-runs when touched state changes
});
```

### Q: What's the order of fields?

**Answer:**

The order matches the order in the form object:

```javascript
const form = Reactive.form({ a: '', b: '', c: '' });

form.setTouched('c');
form.setTouched('a');

console.log(form.touchedFields); // ['a', 'c'] - form order, not touch order
```

### Q: Can I modify the array?

**Answer:**

It's a new array each time, so modifying it won't affect the form:

```javascript
const touched = form.touchedFields;
touched.push('newField'); // Doesn't affect form

console.log(form.touchedFields); // Original array, unchanged
```

---

## Tips for Success

### 1. Use for Progress Tracking

```javascript
// ✅ Show completion percentage
const percentage = (form.touchedFields.length / totalFields) * 100;
```

### 2. Find Untouched Fields

```javascript
// ✅ Get fields not yet visited
const untouched = allFields.filter(f => !form.touchedFields.includes(f));
```

### 3. Use in Analytics

```javascript
// ✅ Track form completion
trackEvent('form_progress', {
  fieldsCompleted: form.touchedFields.length
});
```

### 4. Section Completion

```javascript
// ✅ Track section progress
const sectionFields = ['field1', 'field2'];
const touchedInSection = sectionFields.filter(f => form.touchedFields.includes(f)).length;
```

### 5. Conditional Display

```javascript
// ✅ Show message when all touched
if (form.touchedFields.length === totalFields) {
  showCompletionMessage();
}
```

---

## Summary

### What `touchedFields` Does:

1. ✅ Computed property (not a method)
2. ✅ Returns array of touched field names
3. ✅ Only includes fields where touched is `true`
4. ✅ Reactive - updates automatically
5. ✅ Perfect for progress tracking
6. ✅ Great for analytics

### When to Use It:

- Progress indicators (most common)
- Completion tracking
- Analytics and tracking
- Finding untouched fields
- Section completion
- Navigation hints

### The Basic Pattern:

```javascript
const form = Reactive.form({ field1: '', field2: '', field3: '' });

// Get touched fields
console.log(form.touchedFields); // []

form.setTouched('field1');
form.setTouched('field2');

console.log(form.touchedFields); // ['field1', 'field2']

// Show progress
Reactive.effect(() => {
  const total = Object.keys(form.values).length;
  const touched = form.touchedFields.length;
  console.log(`${touched}/${total} completed`);
});
```

---

**Remember:** `touchedFields` gives you an array of field names that have been touched. Perfect for progress tracking, analytics, and showing users what they've completed! 🎉
