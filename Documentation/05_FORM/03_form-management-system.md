# Complete Form Management System - Integration Guide

## Table of Contents
1. [Installation & Setup](#installation--setup)
2. [Architecture Overview](#architecture-overview)
3. [Usage Patterns](#usage-patterns)
4. [Complete Examples](#complete-examples)
5. [API Reference](#api-reference)
6. [Best Practices](#best-practices)

---

## Installation & Setup

### Loading Order (Critical!)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Form Management System</title>
    
    <!-- 1. Core Dependencies (REQUIRED) -->
    <script src="dom-helpers-core.js"></script>
    <script src="reactive-utils.js"></script>
    
    <!-- 2. Form Modules (Load in this order) -->
    <script src="dom-forms.js"></script>           <!-- Document 1: DOM Forms -->
    <script src="reactive-forms.js"></script>      <!-- Document 2: Reactive Forms -->
    <script src="form-enhancements.js"></script>   <!-- Document 4: Bridge + Enhancements -->
    
    <style>
        /* Optional: Default styles for form states */
        .form-loading { opacity: 0.6; pointer-events: none; }
        .form-success { border: 2px solid #28a745; }
        .form-error { border: 2px solid #dc3545; }
        .form-invalid { border-color: #dc3545 !important; }
        .button-loading { opacity: 0.7; cursor: wait; }
    </style>
</head>
<body>
    <!-- Your forms here -->
</body>
</html>
```

### Feature Detection

```javascript
// Check what's available
console.log('Available Features:');
console.log('DOM Forms:', typeof Forms !== 'undefined');
console.log('Reactive Forms:', typeof ReactiveUtils?.form !== 'undefined');
console.log('Form Enhancements:', typeof FormEnhancements !== 'undefined');
console.log('Bridge Available:', FormEnhancements?.features?.canBridge);
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Form Management System                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   DOM Forms  │  │   Reactive   │  │      Bridge      │  │
│  │   (Doc 1)    │  │   Forms      │  │  Enhancements    │  │
│  │              │  │   (Doc 2)    │  │   (Doc 4)        │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                  │                    │            │
│         └──────────────────┴────────────────────┘            │
│                            │                                 │
│                   ┌────────▼────────┐                       │
│                   │  Shared Features │                       │
│                   │  - Validation    │                       │
│                   │  - Submission    │                       │
│                   │  - State Mgmt    │                       │
│                   └──────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Usage Patterns

### Pattern 1: DOM Forms Only (Progressive Enhancement)

**Best for:** Server-rendered forms, traditional web apps, progressive enhancement

```html
<form id="contactForm" action="/api/contact" method="POST">
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>
    <button type="submit">Send</button>
</form>
```

```javascript
// Access the form
const form = Forms.contactForm;

// Get/Set values
console.log(form.values); // { name: '', email: '', message: '' }
form.values = { name: 'John', email: 'john@example.com' };

// Validate
const validation = form.validate({
    email: { 
        required: true, 
        email: true 
    },
    message: { 
        required: true, 
        minLength: 10 
    }
});

if (validation.isValid) {
    // Submit
    form.submitData({
        onSuccess: (data) => {
            console.log('Form submitted!', data);
            form.reset();
        },
        onError: (error) => {
            console.error('Submission failed:', error);
        }
    });
}
```

### Pattern 2: Reactive Forms Only (SPA Style)

**Best for:** Single-page apps, dynamic forms, complex state management

```javascript
// Create reactive form
const loginForm = ReactiveUtils.form(
    // Initial values
    { 
        email: '', 
        password: '' 
    },
    // Options
    {
        validators: {
            email: Forms.v.combine(
                Forms.v.required(),
                Forms.v.email()
            ),
            password: Forms.v.combine(
                Forms.v.required(),
                Forms.v.minLength(8, 'Password must be at least 8 characters')
            )
        },
        onSubmit: async (values) => {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });
            return await response.json();
        }
    }
);

// Watch for changes
loginForm.$watch('values', (values) => {
    console.log('Form values changed:', values);
});

loginForm.$watch('errors', (errors) => {
    console.log('Validation errors:', errors);
});

// Computed properties (automatically available)
console.log(loginForm.isValid);    // true/false
console.log(loginForm.isDirty);    // true/false
console.log(loginForm.hasErrors);  // true/false

// Set values
loginForm.setValue('email', 'user@example.com');
loginForm.setValue('password', 'secret123');

// Or set multiple
loginForm.setValues({
    email: 'user@example.com',
    password: 'secret123'
});

// Validate
loginForm.validate(); // Returns true/false

// Submit
const result = await loginForm.submit();
if (result.success) {
    console.log('Login successful!', result.result);
} else {
    console.log('Login failed:', result.errors);
}

// Reset
loginForm.reset();
```

### Pattern 3: Bridge Mode (Best of Both Worlds) ⭐

**Best for:** Most production applications, maximum flexibility

```html
<form id="registrationForm" action="/api/register" method="POST">
    <input type="text" name="username" id="username" required>
    <input type="email" name="email" id="email" required>
    <input type="password" name="password" id="password" required>
    <input type="password" name="confirmPassword" id="confirmPassword" required>
    <button type="submit">Register</button>
    <div id="form-status"></div>
</form>
```

```javascript
// Step 1: Get the DOM form
const domForm = Forms.registrationForm;

// Step 2: Create reactive form with same structure
const reactiveForm = ReactiveUtils.form(
    domForm.values, // Initialize from DOM
    {
        validators: {
            username: Forms.v.combine(
                Forms.v.required(),
                Forms.v.minLength(3),
                Forms.v.pattern(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
            ),
            email: Forms.v.combine(
                Forms.v.required(),
                Forms.v.email()
            ),
            password: Forms.v.combine(
                Forms.v.required(),
                Forms.v.minLength(8)
            ),
            confirmPassword: Forms.v.combine(
                Forms.v.required(),
                Forms.v.match('password', 'Passwords must match')
            )
        }
    }
);

// Step 3: Connect them (THE MAGIC HAPPENS HERE)
const connection = domForm.connectReactive(reactiveForm, {
    syncOnInput: true,    // Sync on every keystroke
    syncOnBlur: true,     // Validate on blur
    autoSyncReactive: true // Two-way binding
});

// Now they're connected! Changes in either update the other automatically

// Step 4: Watch reactive state to update UI
reactiveForm.$watch('errors', (errors) => {
    const statusDiv = document.getElementById('form-status');
    if (Object.keys(errors).length > 0) {
        const errorList = Object.values(errors).filter(Boolean);
        statusDiv.innerHTML = `
            <div style="color: red;">
                ${errorList.map(err => `<div>• ${err}</div>`).join('')}
            </div>
        `;
    } else {
        statusDiv.innerHTML = '';
    }
});

reactiveForm.$watch('isSubmitting', (isSubmitting) => {
    const button = domForm.querySelector('button[type="submit"]');
    button.textContent = isSubmitting ? 'Registering...' : 'Register';
});

// Step 5: Enhanced submission with all features
domForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const result = await FormEnhancements.submit(domForm, {
        // Custom submission handler
        onSubmit: async (values) => {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });
            
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            
            return await response.json();
        },
        
        // Visual feedback
        successMessage: 'Registration successful! Redirecting...',
        errorMessage: 'Registration failed. Please try again.',
        
        // Auto-reset on success
        resetOnSuccess: true,
        
        // Callbacks
        onSuccess: (data) => {
            console.log('User registered:', data);
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        },
        
        onError: (error) => {
            console.error('Registration error:', error);
        }
    });
});

// Bonus: You can still use reactive methods
reactiveForm.setValue('username', 'cooluser123'); // Updates DOM automatically
console.log(domForm.values.username); // 'cooluser123'

// And DOM changes update reactive state
domForm.querySelector('#email').value = 'user@example.com';
domForm.querySelector('#email').dispatchEvent(new Event('input'));
console.log(reactiveForm.values.email); // 'user@example.com'

// Clean up when done (e.g., on page navigation)
// connection.disconnect();
```

### Pattern 4: Declarative Enhancement (Zero JavaScript!)

**Best for:** Simple forms, rapid prototyping, minimal JavaScript

```html
<!-- Just add data attributes and it works! -->
<form id="newsletterForm" 
      data-enhanced
      data-submit-url="/api/newsletter"
      data-submit-method="POST"
      data-success-message="Thanks for subscribing!"
      data-error-message="Subscription failed. Please try again."
      data-reset-on-success
      data-message-position="start">
    
    <input type="email" 
           name="email" 
           required 
           placeholder="Your email">
    
    <button type="submit">Subscribe</button>
</form>

<!-- No JavaScript needed! FormEnhancements auto-initializes -->
```

---

## Complete Examples

### Example 1: Login Form with Remember Me

```html
<form id="loginForm">
    <div>
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
    </div>
    
    <div>
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>
    </div>
    
    <div>
        <label>
            <input type="checkbox" id="remember" name="remember">
            Remember me
        </label>
    </div>
    
    <button type="submit">Login</button>
    <div id="login-status"></div>
</form>
```

```javascript
// Setup
const domForm = Forms.loginForm;
const reactiveForm = ReactiveUtils.form(
    { email: '', password: '', remember: false },
    {
        validators: {
            email: Forms.v.combine(
                Forms.v.required('Email is required'),
                Forms.v.email('Please enter a valid email')
            ),
            password: Forms.v.required('Password is required')
        }
    }
);

// Connect
domForm.connectReactive(reactiveForm);

// Load saved email if "remember me" was checked
const savedEmail = localStorage.getItem('savedEmail');
if (savedEmail) {
    reactiveForm.setValue('email', savedEmail);
    reactiveForm.setValue('remember', true);
}

// Real-time validation feedback
reactiveForm.$watch('errors', (errors) => {
    // Show/hide errors as user types
    Object.keys(errors).forEach(field => {
        const input = document.getElementById(field);
        const error = errors[field];
        
        if (error && reactiveForm.isTouched(field)) {
            input.classList.add('form-invalid');
            // Error message is already handled by connectReactive
        } else {
            input.classList.remove('form-invalid');
        }
    });
});

// Submit handler
domForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const result = await FormEnhancements.submit(domForm, {
        onSubmit: async (values) => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (values.email === 'user@example.com' && values.password === 'password') {
                return { token: 'abc123', user: { email: values.email } };
            } else {
                throw new Error('Invalid credentials');
            }
        },
        
        successMessage: 'Login successful!',
        
        onSuccess: (data, values) => {
            // Save email if remember me is checked
            if (values.remember) {
                localStorage.setItem('savedEmail', values.email);
            } else {
                localStorage.removeItem('savedEmail');
            }
            
            // Store token
            localStorage.setItem('authToken', data.token);
            
            // Redirect
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        },
        
        onError: (error) => {
            document.getElementById('login-status').innerHTML = `
                <div style="color: red; margin-top: 10px;">
                    ${error.message || 'Login failed'}
                </div>
            `;
        }
    });
});
```

### Example 2: Multi-Step Registration Form

```html
<form id="registrationForm">
    <!-- Step 1: Personal Info -->
    <div id="step1" class="form-step">
        <h2>Personal Information</h2>
        <input type="text" name="firstName" placeholder="First Name" required>
        <input type="text" name="lastName" placeholder="Last Name" required>
        <input type="email" name="email" placeholder="Email" required>
        <button type="button" data-next-step>Next</button>
    </div>
    
    <!-- Step 2: Account Details -->
    <div id="step2" class="form-step" style="display: none;">
        <h2>Account Details</h2>
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required>
        <button type="button" data-prev-step>Back</button>
        <button type="button" data-next-step>Next</button>
    </div>
    
    <!-- Step 3: Preferences -->
    <div id="step3" class="form-step" style="display: none;">
        <h2>Preferences</h2>
        <label><input type="checkbox" name="newsletter"> Subscribe to newsletter</label>
        <label><input type="checkbox" name="notifications"> Enable notifications</label>
        <select name="language">
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
        </select>
        <button type="button" data-prev-step>Back</button>
        <button type="submit">Complete Registration</button>
    </div>
    
    <!-- Progress indicator -->
    <div class="progress-bar">
        <div class="progress" style="width: 33%;"></div>
    </div>
</form>

<style>
.form-step { min-height: 300px; }
.progress-bar { 
    width: 100%; 
    height: 4px; 
    background: #eee; 
    margin-top: 20px; 
}
.progress { 
    height: 100%; 
    background: #007bff; 
    transition: width 0.3s ease; 
}
</style>
```

```javascript
// Multi-step form logic
const domForm = Forms.registrationForm;
const steps = ['step1', 'step2', 'step3'];
let currentStep = 0;

// Create reactive form with validation
const reactiveForm = ReactiveUtils.form(
    {
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        newsletter: false,
        notifications: true,
        language: 'en'
    },
    {
        validators: {
            firstName: Forms.v.required(),
            lastName: Forms.v.required(),
            email: Forms.v.combine(
                Forms.v.required(),
                Forms.v.email()
            ),
            username: Forms.v.combine(
                Forms.v.required(),
                Forms.v.minLength(3),
                Forms.v.pattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores')
            ),
            password: Forms.v.combine(
                Forms.v.required(),
                Forms.v.minLength(8),
                Forms.v.pattern(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    'Must contain uppercase, lowercase, and number'
                )
            ),
            confirmPassword: Forms.v.combine(
                Forms.v.required(),
                Forms.v.match('password', 'Passwords must match')
            )
        }
    }
);

// Connect
domForm.connectReactive(reactiveForm);

// Step navigation
function showStep(stepIndex) {
    steps.forEach((stepId, index) => {
        const stepEl = document.getElementById(stepId);
        stepEl.style.display = index === stepIndex ? 'block' : 'none';
    });
    
    currentStep = stepIndex;
    updateProgress();
}

function updateProgress() {
    const progress = ((currentStep + 1) / steps.length) * 100;
    document.querySelector('.progress').style.width = progress + '%';
}

// Validate current step
function validateCurrentStep() {
    const stepFields = {
        0: ['firstName', 'lastName', 'email'],
        1: ['username', 'password', 'confirmPassword'],
        2: [] // No validation needed for preferences
    };
    
    const fieldsToValidate = stepFields[currentStep];
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
        reactiveForm.setTouched(field);
        if (!reactiveForm.validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Next button
document.querySelectorAll('[data-next-step]').forEach(button => {
    button.addEventListener('click', () => {
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                showStep(currentStep + 1);
            }
        } else {
            alert('Please fix the errors before continuing');
        }
    });
});

// Previous button
document.querySelectorAll('[data-prev-step]').forEach(button => {
    button.addEventListener('click', () => {
        if (currentStep > 0) {
            showStep(currentStep - 1);
        }
    });
});

// Form submission
domForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    reactiveForm.touchAll();
    if (!reactiveForm.validate()) {
        alert('Please fix all errors before submitting');
        return;
    }
    
    const result = await FormEnhancements.submit(domForm, {
        onSubmit: async (values) => {
            // Remove confirmPassword before sending
            const { confirmPassword, ...dataToSend } = values;
            
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            
            if (!response.ok) throw new Error('Registration failed');
            return await response.json();
        },
        
        successMessage: 'Registration complete! Welcome aboard!',
        
        onSuccess: (data) => {
            console.log('User registered:', data);
            setTimeout(() => {
                window.location.href = '/welcome';
            }, 2000);
        }
    });
});

// Initialize
showStep(0);
```

### Example 3: Dynamic Form with Conditional Fields

```html
<form id="surveyForm">
    <div>
        <label>Are you a developer?</label>
        <input type="radio" name="isDeveloper" value="yes" id="dev-yes"> Yes
        <input type="radio" name="isDeveloper" value="no" id="dev-no"> No
    </div>
    
    <!-- Conditional section (only shows if developer) -->
    <div id="developerSection" style="display: none;">
        <h3>Developer Questions</h3>
        
        <label>Primary Programming Language</label>
        <select name="primaryLanguage">
            <option value="">Select...</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="other">Other</option>
        </select>
        
        <label>Years of Experience</label>
        <input type="number" name="yearsExperience" min="0" max="50">
        
        <label>Favorite Framework</label>
        <input type="text" name="favoriteFramework">
    </div>
    
    <div>
        <label>Additional Comments</label>
        <textarea name="comments"></textarea>
    </div>
    
    <button type="submit">Submit Survey</button>
</form>
```

```javascript
const domForm = Forms.surveyForm;
const reactiveForm = ReactiveUtils.form(
    {
        isDeveloper: '',
        primaryLanguage: '',
        yearsExperience: '',
        favoriteFramework: '',
        comments: ''
    },
    {
        validators: {
            isDeveloper: Forms.v.required('Please select an option'),
            // Conditional validation
            primaryLanguage: (value, allValues) => {
                if (allValues.isDeveloper === 'yes' && !value) {
                    return 'Please select your primary language';
                }
                return null;
            },
            yearsExperience: (value, allValues) => {
                if (allValues.isDeveloper === 'yes') {
                    if (!value || value === '') {
                        return 'Please enter years of experience';
                    }
                    if (value < 0 || value > 50) {
                        return 'Please enter a valid number (0-50)';
                    }
                }
                return null;
            }
        }
    }
);

// Connect
domForm.connectReactive(reactiveForm);

// Show/hide developer section based on selection
reactiveForm.$watch('values.isDeveloper', (value) => {
    const devSection = document.getElementById('developerSection');
    
    if (value === 'yes') {
        devSection.style.display = 'block';
        // Make fields required
        domForm.querySelector('[name="primaryLanguage"]').required = true;
        domForm.querySelector('[name="yearsExperience"]').required = true;
    } else {
        devSection.style.display = 'none';
        // Remove required and clear values
        domForm.querySelector('[name="primaryLanguage"]').required = false;
        domForm.querySelector('[name="yearsExperience"]').required = false;
        
        // Clear developer fields
        reactiveForm.setValues({
            primaryLanguage: '',
            yearsExperience: '',
            favoriteFramework: ''
        });
    }
});

// Submit
domForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    await FormEnhancements.submit(domForm, {
        onSubmit: async (values) => {
            // Only send developer fields if they're a developer
            const dataToSend = { ...values };
            if (values.isDeveloper !== 'yes') {
                delete dataToSend.primaryLanguage;
                delete dataToSend.yearsExperience;
                delete dataToSend.favoriteFramework;
            }
            
            console.log('Submitting:', dataToSend);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true, id: Date.now() };
        },
        
        successMessage: 'Thank you for completing the survey!',
        resetOnSuccess: true
    });
});
```

### Example 4: File Upload with Progress

```html
<form id="uploadForm" enctype="multipart/form-data">
    <div>
        <label>Select File</label>
        <input type="file" name="file" id="fileInput" accept="image/*" required>
    </div>
    
    <div>
        <label>Description</label>
        <input type="text" name="description" required>
    </div>
    
    <div id="preview" style="margin: 20px 0;"></div>
    
    <div class="upload-progress" style="display: none;">
        <div class="progress-bar">
            <div class="progress-fill" style="width: 0%;"></div>
        </div>
        <div class="progress-text">0%</div>
    </div>
    
    <button type="submit">Upload</button>
</form>

<style>
.upload-progress { margin: 20px 0; }
.progress-bar {
    width: 100%;
    height: 20px;
    background: #f0f0f0;
    border-radius: 10px;
    overflow: hidden;
}
.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #45a049);
    transition: width 0.3s ease;
}
.progress-text {
    text-align: center;
    margin-top: 5px;
    font-weight: bold;
}
#preview img {
    max-width: 300px;
    max-height: 300px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>
```

```javascript
const domForm = Forms.uploadForm;
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');

// Create reactive form (for description only, file handled separately)
const reactiveForm = ReactiveUtils.form(
    { description: '' },
    {
        validators: {
            description: Forms.v.combine(
                Forms.v.required(),
                Forms.v.minLength(10, 'Please provide a detailed description')
            )
        }
    }
);

domForm.connectReactive(reactiveForm);

// Preview image on selection
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

// Upload with progress
domForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate description
    if (!reactiveForm.validate()) {
        alert('Please provide a valid description');
        return;
    }
    
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    // Show progress UI
    const progressContainer = document.querySelector('.upload-progress');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    progressContainer.style.display = 'block';
    
    // Disable form
    const submitButton = domForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Uploading...';
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', reactiveForm.values.description);
    
    // Upload with progress tracking
    try {
        await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            // Track progress
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    progressFill.style.width = percentComplete + '%';
                    progressText.textContent = Math.round(percentComplete) + '%';
                }
            });
            
            // Handle completion
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error('Upload failed'));
                }
            });
            
            xhr.addEventListener('error', () => reject(new Error('Network error')));
            xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));
            
            // Send request
            xhr.open('POST', '/api/upload');
            xhr.send(formData);
        });
        
        // Success
        FormEnhancements.showSuccess(domForm, 'File uploaded successfully!');
        
        setTimeout(() => {
            domForm.reset();
            preview.innerHTML = '';
            progressContainer.style.display = 'none';
            progressFill.style.width = '0%';
            progressText.textContent = '0%';
            reactiveForm.reset();
        }, 2000);
        
    } catch (error) {
        FormEnhancements.showError(domForm, error.message || 'Upload failed');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Upload';
    }
});
```

### Example 5: Search Form with Debouncing

```html
<form id="searchForm">
    <input type="search" 
           name="query" 
           id="searchInput" 
           placeholder="Search..."
           autocomplete="off">
    
    <div id="searchResults"></div>
</form>

<style>
#searchResults {
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    max-height: 400px;
    overflow-y: auto;
    display: none;
}
.search-result-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}
.search-result-item:hover {
    background: #f5f5f5;
}
.search-loading {
    padding: 20px;
    text-align: center;
    color: #666;
}
.search-empty {
    padding: 20px;
    text-align: center;
    color: #999;
}
</style>
```

```javascript
const domForm = Forms.searchForm;
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('searchResults');

// Create reactive form
const reactiveForm = ReactiveUtils.form(
    { query: '' },
    {
        validators: {
            query: Forms.v.minLength(2, 'Enter at least 2 characters')
        }
    }
);

domForm.connectReactive(reactiveForm);

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search function
async function performSearch(query) {
    if (!query || query.length < 2) {
        resultsContainer.style.display = 'none';
        return;
    }
    
    // Show loading
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = '<div class="search-loading">Searching...</div>';
    
    try {
        // Simulate API call
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const results = await response.json();
        
        // Display results
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-empty">No results found</div>';
        } else {
            resultsContainer.innerHTML = results.map(item => `
                <div class="search-result-item" data-id="${item.id}">
                    <strong>${item.title}</strong>
                    <div>${item.description}</div>
                </div>
            `).join('');
            
            // Add click handlers
            resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const id = item.getAttribute('data-id');
                    console.log('Selected item:', id);
                    // Handle selection
                    window.location.href = `/item/${id}`;
                });
            });
        }
    } catch (error) {
        resultsContainer.innerHTML = `
            <div class="search-empty" style="color: red;">
                Error: ${error.message}
            </div>
        `;
    }
}

// Debounced search (300ms delay)
const debouncedSearch = debounce(performSearch, 300);

// Watch for query changes
reactiveForm.$watch('values.query', (query) => {
    debouncedSearch(query);
});

// Close results when clicking outside
document.addEventListener('click', (e) => {
    if (!domForm.contains(e.target)) {
        resultsContainer.style.display = 'none';
    }
});

// Prevent form submission
domForm.addEventListener('submit', (e) => {
    e.preventDefault();
});
```

---

## API Reference

### DOM Forms API (Document 1)

```javascript
// Access form by ID
const form = Forms.formId;

// Form Properties
form.values              // Get/set all form values as object
form.values = { name: 'John', email: 'john@example.com' }

// Form Methods
form.validate(rules)     // Validate form with optional rules
form.clearValidation()   // Clear all validation messages
form.reset(options)      // Reset form (enhanced)
form.submitData(options) // Submit form with enhanced options
form.getField(name)      // Get specific field element
form.setField(name, val) // Set specific field value
form.serialize(format)   // Serialize form ('object', 'json', 'formdata', 'urlencoded')

// Helper Methods
Forms.helper.getStats()   // Get cache statistics
Forms.helper.clearCache() // Clear form cache
Forms.helper.getAllForms() // Get all forms with IDs
Forms.helper.validateAll(rules) // Validate all forms
Forms.helper.resetAll()   // Reset all forms
```

### Reactive Forms API (Document 2)

```javascript
// Create reactive form
const form = ReactiveUtils.form(initialValues, options);

// Options
{
    validators: {
        fieldName: validatorFunction
    },
    onSubmit: async (values) => { ... }
}

// Computed Properties (auto-available)
form.isValid      // true if no errors
form.isDirty      // true if any field touched
form.hasErrors    // true if any errors exist
form.touchedFields // Array of touched field names
form.errorFields  // Array of fields with errors

// Form State
form.values       // Current form values
form.errors       // Current validation errors
form.touched      // Touched fields
form.isSubmitting // Submission in progress
form.submitCount  // Number of submissions

// Value Methods
form.setValue(field, value)    // Set single field
form.setValues(valuesObject)   // Set multiple fields
form.getValue(field)           // Get field value

// Error Methods
form.setError(field, error)    // Set field error
form.setErrors(errorsObject)   // Set multiple errors
form.clearError(field)         // Clear field error
form.clearErrors()             // Clear all errors
form.getError(field)           // Get field error
form.hasError(field)           // Check if field has error

// Touched Methods
form.setTouched(field, bool)   // Mark field as touched
form.setTouchedFields(array)   // Mark multiple fields
form.touchAll()                // Mark all fields touched
form.isTouched(field)          // Check if field touched

// Validation Methods
form.validateField(field)      // Validate single field
form.validate()                // Validate all fields
form.shouldShowError(field)    // Check if should show error (touched + has error)

// Submission
form.submit(handler)           // Submit form (async)
await form.submit()            // Uses onSubmit from options

// Reset Methods
form.reset(newValues)          // Reset to initial or new values
form.resetField(field)         // Reset single field

// Event Handlers
form.handleChange(event)       // Handle input change event
form.handleBlur(event)         // Handle input blur event
form.getFieldProps(field)      // Get props for field binding

// Binding
form.bindToInputs(selector)    // Bind to DOM inputs

// Watchers
form.$watch('values', callback, options)
form.$watch('errors', callback, options)
form.$watch('values.fieldName', callback)

// Utilities
form.toObject()                // Convert to plain object
```

### Form Enhancements API (Document 4)

```javascript
// Configuration
FormEnhancements.configure({
    autoPreventDefault: true,
    autoDisableButtons: true,
    showLoadingStates: true,
    loadingClass: 'form-loading',
    successClass: 'form-success',
    errorClass: 'form-error',
    messageTimeout: 3000,
    retryAttempts: 0,
    retryDelay: 1000,
    timeout: 30000,
    enableLogging: false
});

FormEnhancements.getConfig() // Get current config

// Enhancement
FormEnhancements.enhance(form, options)

// Submission
await FormEnhancements.submit(form, {
    // Submission
    url: '/api/endpoint',
    method: 'POST',
    
    // Handler
    onSubmit: async (values, form) => {
        // Custom submission logic
        return response;
    },
    
    // Transformation
    transform: (values) => {
        // Transform values before submission
        return transformedValues;
    },
    
    // Validation
    validate: true,
    validationRules: { ... },
    
    // Callbacks
    beforeSubmit: async (values, form) => {
        // Return false to cancel
    },
    onSuccess: (result, values) => { ... },
    onError: (error) => { ... },
    
    // Visual feedback
    successMessage: 'Success!',
    errorMessage: 'Error occurred',
    
    // Behavior
    resetOnSuccess: true,
    retryAttempts: 3,
    retryDelay: 1000
});

// Bridge Connection
const connection = FormEnhancements.connect(domForm, reactiveForm, {
    syncOnInput: true,
    syncOnBlur: true,
    autoSyncReactive: true
});

// Or via DOM form
const connection = domForm.connectReactive(reactiveForm, options);

// Disconnect
connection.disconnect();

// State Management
FormEnhancements.getState(form)
FormEnhancements.clearQueue()

// Visual Feedback
FormEnhancements.showSuccess(form, message)
FormEnhancements.showError(form, error)
FormEnhancements.disableButtons(form)
FormEnhancements.enableButtons(form)

// Validators (shared between DOM and Reactive)
FormEnhancements.validators.required(message)
FormEnhancements.validators.email(message)
FormEnhancements.validators.minLength(min, message)
FormEnhancements.validators.maxLength(max, message)
FormEnhancements.validators.pattern(regex, message)
FormEnhancements.validators.min(min, message)
FormEnhancements.validators.max(max, message)
FormEnhancements.validators.match(fieldName, message)
FormEnhancements.validators.custom(validatorFn)
FormEnhancements.validators.combine(...validators)

// Shorthand
FormEnhancements.v.required()
FormEnhancements.v.email()
// etc...

// DOM form enhancements (auto-added)
form.configure(options)              // Configure form-specific options
form.connectReactive(reactiveForm)   // Connect to reactive form
form.submitData(options)             // Enhanced submission (auto-added)
```

### Shared Validators

```javascript
// All validators return a function that validates a value

// Basic validators
Forms.v.required('Custom message')
Forms.v.email('Invalid email')
Forms.v.minLength(5, 'Too short')
Forms.v.maxLength(100, 'Too long')
Forms.v.pattern(/^\d+$/, 'Numbers only')
Forms.v.min(0, 'Must be positive')
Forms.v.max(100, 'Too large')
Forms.v.match('passwordField', 'Passwords must match')

// Custom validator
Forms.v.custom((value, allValues, field) => {
    if (value !== 'specific') {
        return 'Error message';
    }
    return null; // or true for success
})

// Combine multiple validators
Forms.v.combine(
    Forms.v.required(),
    Forms.v.minLength(8),
    Forms.v.pattern(/^(?=.*[A-Z])/, 'Must contain uppercase')
)

// Usage in DOM forms
form.validate({
    email: {
        required: true,
        email: true
    },
    password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[A-Z])/
    }
});

// Usage in Reactive forms
const form = ReactiveUtils.form(values, {
    validators: {
        email: Forms.v.combine(
            Forms.v.required(),
            Forms.v.email()
        ),
        password: Forms.v.combine(
            Forms.v.required(),
            Forms.v.minLength(8)
        )
    }
});
```

---

## Best Practices

### 1. **Choose the Right Pattern**

```javascript
// ✅ Good: Use DOM forms for server-rendered forms
const form = Forms.contactForm;
form.submitData({ url: '/contact' });

// ✅ Good: Use Reactive forms for SPAs
const form = ReactiveUtils.form(initialValues);
form.$watch('values', updateUI);

// ⭐ Best: Bridge both for maximum flexibility
const domForm = Forms.contactForm;
const reactiveForm = ReactiveUtils.form(domForm.values);
domForm.connectReactive(reactiveForm);
```

### 2. **Always Validate Before Submission**

```javascript
// ❌ Bad: No validation
domForm.submitData({ url: '/api/submit' });

// ✅ Good: Validation enabled
domForm.submitData({
    validate: true,
    validationRules: {
        email: { required: true, email: true }
    }
});

// ⭐ Best: Reactive validation with real-time feedback
const reactiveForm = ReactiveUtils.form(values, {
    validators: {
        email: Forms.v.combine(
            Forms.v.required(),
            Forms.v.email()
        )
    }
});

reactiveForm.$watch('errors', (errors) => {
    // Update UI in real-time
});
```

### 3. **Handle Loading States**

```javascript
// ✅ Good: Automatic loading states (default)
FormEnhancements.submit(form, {
    onSubmit: async (values) => {
        // Loading state automatically shown
        return await api.submit(values);
    }
});

// ⭐ Best: Custom loading feedback
reactiveForm.$watch('isSubmitting', (isSubmitting) => {
    const button = document.querySelector('button[type="submit"]');
    button.disabled = isSubmitting;
    button.textContent = isSubmitting ? '⌛ Submitting...' : 'Submit';
});
```

### 4. **Provide User Feedback**

```javascript
// ✅ Good: Success/error messages
FormEnhancements.submit(form, {
    successMessage: 'Saved successfully!',
    errorMessage: 'Save failed. Please try again.',
    onSuccess: (data) => {
        // Additional success handling
    }
});

// ⭐ Best: Rich feedback with reactive state
reactiveForm.$watch('errors', (errors) => {
    Object.entries(errors).forEach(([field, message]) => {
        if (message) {
            showInlineError(field, message);
        }
    });
});
```

### 5. **Clean Up Resources**

```javascript
// ✅ Good: Disconnect when done
const connection = domForm.connectReactive(reactiveForm);

// Later...
connection.disconnect();

// ⭐ Best: Automatic cleanup on navigation
window.addEventListener('beforeunload', () => {
    connection.disconnect();
    FormEnhancements.clearQueue();
});

// Or in SPA:
function cleanupPage() {
    connection?.disconnect();
    reactiveForm = null;
}
```

### 6. **Use Declarative Attributes for Simple Forms**

```html
<!-- ⭐ Best: Zero JavaScript needed -->
<form data-enhanced
      data-submit-url="/api/contact"
      data-success-message="Message sent!"
      data-reset-on-success>
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>
    <button type="submit">Send</button>
</form>
```

### 7. **Debounce Real-Time Validation**

```javascript
// ❌ Bad: Validates on every keystroke
reactiveForm.$watch('values.email', (email) => {
    reactiveForm.validateField('email');
});

// ✅ Good: Validate on blur
domForm.addEventListener('blur', (e) => {
    if (e.target.name) {
        reactiveForm.validateField(e.target.name);
    }
}, true);

// ⭐ Best: Debounced real-time + blur
const debounced = debounce((field) => {
    reactiveForm.validateField(field);
}, 500);

reactiveForm.$watch('values', (values, oldValues) => {
    Object.keys(values).forEach(field => {
        if (values[field] !== oldValues[field]) {
            debounced(field);
        }
    });
}, { deep: true });
```

### 8. **Handle Errors Gracefully**

```javascript
// ⭐ Best: Comprehensive error handling
FormEnhancements.submit(form, {
    onSubmit: async (values) => {
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            // Log for debugging
            console.error('Submission error:', error);
            
            // Re-throw with user-friendly message
            throw new Error(
                error.message === 'Failed to fetch' 
                    ? 'Network error. Please check your connection.'
                    : error.message
            );
        }
    },
    
    retryAttempts: 3,
    retryDelay: 1000,
    
    onError: (error) => {
        // Show error to user
        FormEnhancements.showError(form, error.message);
        
        // Send to error tracking service
        if (window.errorTracker) {
            window.errorTracker.log(error);
        }
    }
});
```

### 9. **Optimize Performance**

```javascript
// ✅ Good: Batch updates
ReactiveUtils.batch(() => {
    reactiveForm.setValue('firstName', 'John');
    reactiveForm.setValue('lastName', 'Doe');
    reactiveForm.setValue('email', 'john@example.com');
});

// ⭐ Best: Use setValues for multiple updates
reactiveForm.setValues({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
});

// Clear cache periodically
setInterval(() => {
    if (Forms.helper) {
        const stats = Forms.helper.getStats();
        if (stats.cacheSize > 100) {
            Forms.helper.clearCache();
        }
    }
}, 60000); // Every minute
```

### 10. **Accessibility First**

```javascript
// ⭐ Best: Accessible form with ARIA attributes
const form = ReactiveUtils.form(values, {
    validators: { email: Forms.v.email() }
});

// Update ARIA attributes based on state
form.$watch('errors', (errors) => {
    Object.keys(errors).forEach(field => {
        const input = document.getElementById(field);
        const hasError = !!errors[field];
        
        // Update ARIA
        input.setAttribute('aria-invalid', hasError);
        
        if (hasError) {
            const errorId = `${field}-error`;
            input.setAttribute('aria-describedby', errorId);
            
            // Ensure error message has correct ID
            const errorEl = document.getElementById(errorId);
            if (errorEl) {
                errorEl.setAttribute('role', 'alert');
                errorEl.setAttribute('aria-live', 'polite');
            }
        } else {
            input.removeAttribute('aria-describedby');
        }
    });
});

// Announce form submission status
form.$watch('isSubmitting', (isSubmitting) => {
    const liveRegion = document.getElementById('form-status');
    if (liveRegion) {
        liveRegion.textContent = isSubmitting 
            ? 'Submitting form...' 
            : '';
    }
});
```

---

## Common Patterns & Recipes

### Pattern: Auto-Save Form

```javascript
const form = ReactiveUtils.form(initialValues);
domForm.connectReactive(form);

// Auto-save every 30 seconds if dirty
setInterval(() => {
    if (form.isDirty && !form.isSubmitting) {
        saveDraft(form.values);
    }
}, 30000);

function saveDraft(values) {
    fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
    }).then(() => {
        console.log('Draft saved');
        // Optionally show success indicator
    });
}

// Also save on beforeunload
window.addEventListener('beforeunload', (e) => {
    if (form.isDirty && !form.isSubmitting) {
        saveDraft(form.values);
        e.preventDefault();
        e.returnValue = 'You have unsaved changes!';
    }
});
```

### Pattern: Wizard/Multi-Step with State Persistence

```javascript
const STORAGE_KEY = 'wizard_state';

// Load saved state
const savedState = localStorage.getItem(STORAGE_KEY);
const initialValues = savedState ? JSON.parse(savedState) : defaultValues;

const form = ReactiveUtils.form(initialValues, { validators });
domForm.connectReactive(form);

// Save state on every change
form.$watch('values', (values) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
}, { deep: true });

// Clear on completion
form.submit = async function() {
    const result = await originalSubmit.call(this);
    if (result.success) {
        localStorage.removeItem(STORAGE_KEY);
    }
    return result;
};
```

### Pattern: Dependent Field Validation

```javascript
const form = ReactiveUtils.form(
    { country: '', state: '', city: '' },
    {
        validators: {
            state: (value, allValues) => {
                // State required only for US
                if (allValues.country === 'US' && !value) {
                    return 'State is required for US addresses';
                }
                return null;
            },
            city: Forms.v.required('City is required')
        }
    }
);

// Re-validate dependent fields when country changes
form.$watch('values.country', () => {
    if (form.isTouched('state')) {
        form.validateField('state');
    }
});
```

### Pattern: Async Validation (Check Username Availability)

```javascript
const checkUsername = debounce(async (username) => {
    if (!username || username.length < 3) return;
    
    try {
        const response = await fetch(`/api/check-username?username=${username}`);
        const data = await response.json();
        
        if (!data.available) {
            form.setError('username', 'Username is already taken');
        } else {
            form.clearError('username');
        }
    } catch (error) {
        console.error('Username check failed:', error);
    }
}, 500);

form.$watch('values.username', (username) => {
    checkUsername(username);
});
```

### Pattern: Form Array (Dynamic Fields)

```javascript
const form = ReactiveUtils.form({
    name: '',
    emails: [''] // Start with one email field
});

// Add email field
function addEmail() {
    form.values.emails.push('');
    renderEmailFields();
}

// Remove email field
function removeEmail(index) {
    form.values.emails.splice(index, 1);
    renderEmailFields();
}

// Render dynamic fields
function renderEmailFields() {
    const container = document.getElementById('email-fields');
    container.innerHTML = form.values.emails.map((email, index) => `
        <div class="email-field">
            <input type="email" 
                   id="email-${index}" 
                   value="${email}"
                   data-index="${index}">
            ${index > 0 ? `<button type="button" onclick="removeEmail(${index})">Remove</button>` : ''}
        </div>
    `).join('');
    
    // Re-attach event listeners
    container.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            form.values.emails[index] = e.target.value;
        });
    });
}

// Initialize
renderEmailFields();
```

### Pattern: Confirmation Dialog

```javascript
FormEnhancements.submit(form, {
    beforeSubmit: async (values) => {
        // Show confirmation dialog
        const confirmed = await showConfirmDialog(
            'Are you sure?',
            'This action cannot be undone.'
        );
        
        // Return false to cancel submission
        return confirmed;
    },
    
    onSubmit: async (values) => {
        // Proceed with submission
        return await api.submit(values);
    }
});

function showConfirmDialog(title, message) {
    return new Promise((resolve) => {
        // Use your preferred modal library or native confirm
        const result = confirm(`${title}\n\n${message}`);
        resolve(result);
    });
}
```

---

## Troubleshooting

### Issue: Forms not found

```javascript
// Problem: Forms.myForm returns null
console.log(Forms.myForm); // null

// Solution 1: Check if form exists and has ID
const formElement = document.getElementById('myForm');
console.log('Form exists:', !!formElement);
console.log('Is form element:', formElement?.tagName === 'FORM');

// Solution 2: Ensure form is loaded before accessing
document.addEventListener('DOMContentLoaded', () => {
    const form = Forms.myForm;
    console.log('Form after DOM loaded:', form);
});

// Solution 3: Check cache stats
console.log(Forms.helper.getStats());
```

### Issue: Reactive form not syncing with DOM

```javascript
// Problem: Changes in inputs don't update reactive form

// Solution: Ensure connection is established
const connection = domForm.connectReactive(reactiveForm, {
    syncOnInput: true,  // ← Make sure this is true
    syncOnBlur: true,
    autoSyncReactive: true
});

// Verify connection
console.log('Connected:', !!connection);

// Check if inputs have name attributes
domForm.querySelectorAll('input, select, textarea').forEach(input => {
    if (!input.name && !input.id) {
        console.warn('Input missing name/id:', input);
    }
});
```

### Issue: Validation not working

```javascript
// Problem: Validation doesn't show errors

// Solution 1: Check validators are properly defined
console.log('Validators:', reactiveForm._validators);

// Solution 2: Manually trigger validation
reactiveForm.touchAll();
const isValid = reactiveForm.validate();
console.log('Valid:', isValid);
console.log('Errors:', reactiveForm.errors);

// Solution 3: Check if fields are marked as touched
console.log('Touched fields:', reactiveForm.touched);
```

### Issue: Form submits twice

```javascript
// Problem: Form submission triggered multiple times

// Solution 1: Prevent default properly
domForm.addEventListener('submit', (e) => {
    e.preventDefault(); // ← Important!
    FormEnhancements.submit(domForm, options);
});

// Solution 2: Use queueSubmissions (default)
FormEnhancements.configure({
    queueSubmissions: true // Prevents double-submit
});

// Solution 3: Check submit button type
// Make sure button is type="submit", not type="button" with onclick
```

### Issue: Memory leaks

```javascript
// Problem: Forms not being garbage collected

// Solution: Disconnect and cleanup
const connection = domForm.connectReactive(reactiveForm);

// When done (e.g., SPA navigation)
function cleanup() {
    connection.disconnect();
    reactiveForm = null;
    domForm = null;
}

// Or use automatic cleanup
window.addEventListener('beforeunload', cleanup);
```

---

## Performance Tips

### 1. Use Batch Updates

```javascript
// ❌ Slow: Multiple updates trigger multiple renders
form.setValue('field1', value1);
form.setValue('field2', value2);
form.setValue('field3', value3);

// ✅ Fast: Single update
form.setValues({ field1: value1, field2: value2, field3: value3 });
```

### 2. Debounce Expensive Operations

```javascript
// Debounce validation
const debouncedValidate = debounce(() => form.validate(), 300);
form.$watch('values', debouncedValidate, { deep: true });

// Debounce API calls
const debouncedSearch = debounce((query) => searchAPI(query), 500);
form.$watch('values.query', debouncedSearch);
```

### 3. Lazy Load Validators

```javascript
// Load complex validators only when needed
const validators = {
    email: Forms.v.email(),
    password: async () => {
        // Dynamically import complex validator
        const { strongPasswordValidator } = await import('./validators.js');
        return strongPasswordValidator;
    }
};
```

### 4. Clear Cache Regularly

```javascript
// Clear stale forms from cache
setInterval(() => {
    Forms.helper.clearCache();
}, 300000); // Every 5 minutes
```

---

## Migration Guide

### From Plain HTML Forms

```html
<!-- Before -->
<form action="/submit" method="POST">
    <input name="email" type="email">
    <button type="submit">Submit</button>
</form>

<script>
document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await fetch('/submit', { method: 'POST', body: formData });
});
</script>
```

```html
<!-- After: Just add data attribute! -->
<form id="myForm"
      data-enhanced
      data-submit-url="/submit"
      data-success-message="Submitted!">
    <input name="email" type="email" required>
    <button type="submit">Submit</button>
</form>

<!-- No JavaScript needed! -->
```

### From jQuery

```javascript
// Before (jQuery)
$('#myForm').on('submit', function(e) {
    e.preventDefault();
    const data = $(this).serialize();
    
    $.ajax({
        url: '/submit',
        method: 'POST',
        data: data,
        success: function(response) {
            alert('Success!');
        },
        error: function(error) {
            alert('Error!');
        }
    });
});
```

```javascript
// After (DOM Helpers)
const form = Forms.myForm;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const result = await FormEnhancements.submit(form, {
        url: '/submit',
        onSuccess: (response) => alert('Success!'),
        onError: (error) => alert('Error!')
    });
});

// Or even simpler with declarative attributes (see above)
```

### From React Hook Form

```javascript
// Before (React Hook Form)
const { register, handleSubmit, formState: { errors } } = useForm();

const onSubmit = async (data) => {
    await api.submit(data);
};

return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email', { required: true })} />
        {errors.email && <span>Required</span>}
        <button>Submit</button>
    </form>
);
```

```javascript
// After (DOM Helpers Reactive)
const form = ReactiveUtils.form(
    { email: '' },
    {
        validators: {
            email: Forms.v.required()
        },
        onSubmit: async (values) => await api.submit(values)
    }
);

// Bind to existing HTML form
form.bindToInputs('#myForm input');

// Watch for errors
form.$watch('errors.email', (error) => {
    const errorEl = document.getElementById('email-error');
    errorEl.textContent = error && form.isTouched('email') ? error : '';
});

// HTML
/*
<form id="myForm">
    <input name="email" id="email">
    <span id="email-error" style="color: red;"></span>
    <button type="submit">Submit</button>
</form>
*/

// Or use bridge mode for automatic error display
const domForm = Forms.myForm;
domForm.connectReactive(form); // Auto-handles error display
```

### From Formik

```javascript
// Before (Formik)
const formik = useFormik({
    initialValues: { email: '', password: '' },
    validate: values => {
        const errors = {};
        if (!values.email) errors.email = 'Required';
        if (!values.password) errors.password = 'Required';
        return errors;
    },
    onSubmit: async values => {
        await api.submit(values);
    }
});

return (
    <form onSubmit={formik.handleSubmit}>
        <input 
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email}
        <button type="submit" disabled={formik.isSubmitting}>
            Submit
        </button>
    </form>
);
```

```javascript
// After (DOM Helpers)
const form = ReactiveUtils.form(
    { email: '', password: '' },
    {
        validators: {
            email: Forms.v.required(),
            password: Forms.v.required()
        },
        onSubmit: async (values) => await api.submit(values)
    }
);

// HTML form
const domForm = Forms.loginForm;
domForm.connectReactive(form);

// Computed properties work like Formik
console.log(form.isSubmitting); // Like formik.isSubmitting
console.log(form.errors);       // Like formik.errors
console.log(form.touched);      // Like formik.touched

// Or use getFieldProps for easy binding
const emailProps = form.getFieldProps('email');
// Returns: { name, value, onChange, onBlur }
```

---

## Advanced Recipes

### Recipe: Form with Real-Time Character Counter

```html
<form id="tweetForm">
    <textarea name="tweet" 
              id="tweet" 
              maxlength="280" 
              placeholder="What's happening?"></textarea>
    <div id="char-count">0 / 280</div>
    <button type="submit">Tweet</button>
</form>
```

```javascript
const form = ReactiveUtils.form(
    { tweet: '' },
    {
        validators: {
            tweet: Forms.v.combine(
                Forms.v.required('Tweet cannot be empty'),
                Forms.v.maxLength(280, 'Tweet is too long')
            )
        }
    }
);

const domForm = Forms.tweetForm;
domForm.connectReactive(form);

// Real-time character counter
form.$watch('values.tweet', (tweet) => {
    const count = tweet.length;
    const countEl = document.getElementById('char-count');
    
    countEl.textContent = `${count} / 280`;
    countEl.style.color = count > 280 ? 'red' : 
                         count > 260 ? 'orange' : 
                         'inherit';
});

// Submit
domForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    await FormEnhancements.submit(domForm, {
        onSubmit: async (values) => {
            return await fetch('/api/tweet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            }).then(r => r.json());
        },
        successMessage: 'Tweet posted!',
        resetOnSuccess: true
    });
});
```

### Recipe: Password Strength Indicator

```html
<form id="signupForm">
    <input type="password" name="password" id="password">
    <div id="strength-indicator">
        <div class="strength-bar"></div>
    </div>
    <ul id="strength-requirements">
        <li data-requirement="length">At least 8 characters</li>
        <li data-requirement="uppercase">One uppercase letter</li>
        <li data-requirement="lowercase">One lowercase letter</li>
        <li data-requirement="number">One number</li>
        <li data-requirement="special">One special character</li>
    </ul>
    <button type="submit">Sign Up</button>
</form>

<style>
#strength-indicator {
    width: 100%;
    height: 5px;
    background: #ddd;
    margin: 10px 0;
    border-radius: 3px;
    overflow: hidden;
}
.strength-bar {
    height: 100%;
    transition: width 0.3s, background-color 0.3s;
    width: 0%;
}
.strength-weak { background: #dc3545; }
.strength-fair { background: #ffc107; }
.strength-good { background: #28a745; }
.strength-strong { background: #155724; }
#strength-requirements li {
    color: #dc3545;
    transition: color 0.2s;
}
#strength-requirements li.met {
    color: #28a745;
}
#strength-requirements li.met::before {
    content: '✓ ';
}
</style>
```

```javascript
const form = ReactiveUtils.form({ password: '' });
const domForm = Forms.signupForm;
domForm.connectReactive(form);

// Password strength checker
function checkPasswordStrength(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const metCount = Object.values(requirements).filter(Boolean).length;
    
    let strength = 'weak';
    if (metCount >= 5) strength = 'strong';
    else if (metCount >= 4) strength = 'good';
    else if (metCount >= 2) strength = 'fair';
    
    return { requirements, strength, metCount };
}

// Update UI based on password strength
form.$watch('values.password', (password) => {
    const { requirements, strength, metCount } = checkPasswordStrength(password);
    
    // Update strength bar
    const bar = document.querySelector('.strength-bar');
    const percentage = (metCount / 5) * 100;
    bar.style.width = percentage + '%';
    bar.className = `strength-bar strength-${strength}`;
    
    // Update requirements list
    Object.entries(requirements).forEach(([req, met]) => {
        const li = document.querySelector(`[data-requirement="${req}"]`);
        li.classList.toggle('met', met);
    });
});

// Custom validator
form.validators = {
    password: (password) => {
        const { metCount } = checkPasswordStrength(password);
        if (metCount < 4) {
            return 'Password is too weak. Meet at least 4 requirements.';
        }
        return null;
    }
};
```

### Recipe: Address Autocomplete

```html
<form id="addressForm">
    <input type="text" 
           name="address" 
           id="address" 
           placeholder="Start typing your address..."
           autocomplete="off">
    <div id="suggestions"></div>
    
    <input type="text" name="city" id="city" readonly>
    <input type="text" name="state" id="state" readonly>
    <input type="text" name="zip" id="zip" readonly>
    
    <button type="submit">Save Address</button>
</form>

<style>
#suggestions {
    border: 1px solid #ddd;
    max-height: 200px;
    overflow-y: auto;
    display: none;
}
.suggestion-item {
    padding: 10px;
    cursor: pointer;
}
.suggestion-item:hover {
    background: #f0f0f0;
}
</style>
```

```javascript
const form = ReactiveUtils.form({
    address: '',
    city: '',
    state: '',
    zip: ''
});

const domForm = Forms.addressForm;
domForm.connectReactive(form);

// Debounced address search
const searchAddress = debounce(async (query) => {
    if (query.length < 3) {
        document.getElementById('suggestions').style.display = 'none';
        return;
    }
    
    try {
        // Using a geocoding API (example: Google Places)
        const response = await fetch(
            `/api/geocode?address=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        
        displaySuggestions(data.results);
    } catch (error) {
        console.error('Address search failed:', error);
    }
}, 300);

// Display suggestions
function displaySuggestions(results) {
    const container = document.getElementById('suggestions');
    
    if (results.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.innerHTML = results.map((result, index) => `
        <div class="suggestion-item" data-index="${index}">
            ${result.formatted_address}
        </div>
    `).join('');
    
    container.style.display = 'block';
    
    // Add click handlers
    container.querySelectorAll('.suggestion-item').forEach((item, index) => {
        item.addEventListener('click', () => selectAddress(results[index]));
    });
}

// Select address from suggestions
function selectAddress(addressData) {
    // Parse address components
    const components = addressData.address_components;
    
    form.setValues({
        address: addressData.formatted_address,
        city: getComponent(components, 'locality'),
        state: getComponent(components, 'administrative_area_level_1'),
        zip: getComponent(components, 'postal_code')
    });
    
    document.getElementById('suggestions').style.display = 'none';
}

function getComponent(components, type) {
    const component = components.find(c => c.types.includes(type));
    return component ? component.short_name : '';
}

// Watch for address input
form.$watch('values.address', (address) => {
    searchAddress(address);
});

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!domForm.contains(e.target)) {
        document.getElementById('suggestions').style.display = 'none';
    }
});
```

### Recipe: Form with Undo/Redo

```javascript
const MAX_HISTORY = 50;

const form = ReactiveUtils.form({ name: '', email: '', message: '' });
const domForm = Forms.contactForm;
domForm.connectReactive(form);

// History management
const history = {
    past: [],
    present: { ...form.values },
    future: []
};

// Save state to history
function saveState(newState) {
    history.past.push(history.present);
    
    // Limit history size
    if (history.past.length > MAX_HISTORY) {
        history.past.shift();
    }
    
    history.present = newState;
    history.future = []; // Clear future on new action
}

// Undo
function undo() {
    if (history.past.length === 0) return;
    
    const previous = history.past.pop();
    history.future.unshift(history.present);
    history.present = previous;
    
    form.setValues(previous);
}

// Redo
function redo() {
    if (history.future.length === 0) return;
    
    const next = history.future.shift();
    history.past.push(history.present);
    history.present = next;
    
    form.setValues(next);
}

// Track changes for undo/redo
let changeTimeout;
form.$watch('values', (newValues) => {
    // Debounce to avoid saving every keystroke
    clearTimeout(changeTimeout);
    changeTimeout = setTimeout(() => {
        saveState({ ...newValues });
    }, 500);
}, { deep: true });

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
    }
});

// Add undo/redo buttons
const undoBtn = document.createElement('button');
undoBtn.textContent = 'Undo';
undoBtn.type = 'button';
undoBtn.onclick = undo;

const redoBtn = document.createElement('button');
redoBtn.textContent = 'Redo';
redoBtn.type = 'button';
redoBtn.onclick = redo;

domForm.prepend(undoBtn, redoBtn);

// Update button states
form.$watch('values', () => {
    undoBtn.disabled = history.past.length === 0;
    redoBtn.disabled = history.future.length === 0;
}, { deep: true });
```

### Recipe: Form Analytics & Tracking

```javascript
const form = ReactiveUtils.form(initialValues);
const domForm = Forms.analyticsForm;
domForm.connectReactive(form);

// Analytics tracker
const analytics = {
    startTime: Date.now(),
    fieldInteractions: {},
    validationErrors: {},
    abandonedFields: new Set(),
    
    track(event, data) {
        console.log('[Analytics]', event, data);
        
        // Send to analytics service
        if (window.gtag) {
            gtag('event', event, data);
        }
    }
};

// Track form start
analytics.track('form_start', {
    form_id: domForm.id,
    timestamp: analytics.startTime
});

// Track field interactions
form.$watch('touched', (touched) => {
    Object.keys(touched).forEach(field => {
        if (!analytics.fieldInteractions[field]) {
            analytics.fieldInteractions[field] = {
                firstInteraction: Date.now(),
                interactionCount: 0
            };
            
            analytics.track('field_focus', { field });
        }
        analytics.fieldInteractions[field].interactionCount++;
    });
}, { deep: true });

// Track validation errors
form.$watch('errors', (errors) => {
    Object.entries(errors).forEach(([field, error]) => {
        if (error) {
            if (!analytics.validationErrors[field]) {
                analytics.validationErrors[field] = 0;
            }
            analytics.validationErrors[field]++;
            
            analytics.track('validation_error', {
                field,
                error,
                errorCount: analytics.validationErrors[field]
            });
        }
    });
}, { deep: true });

// Track field abandonment (user left without filling)
document.addEventListener('blur', (e) => {
    if (domForm.contains(e.target) && e.target.name) {
        const field = e.target.name;
        const value = form.getValue(field);
        
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            analytics.abandonedFields.add(field);
            
            analytics.track('field_abandoned', { field });
        }
    }
}, true);

// Track form submission
domForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const timeToSubmit = Date.now() - analytics.startTime;
    
    analytics.track('form_submit_attempt', {
        time_to_submit: timeToSubmit,
        field_count: Object.keys(form.values).length,
        error_count: Object.values(analytics.validationErrors).reduce((a, b) => a + b, 0),
        abandoned_fields: Array.from(analytics.abandonedFields)
    });
    
    const result = await FormEnhancements.submit(domForm, {
        onSubmit: async (values) => {
            return await api.submit(values);
        },
        
        onSuccess: (data) => {
            analytics.track('form_submit_success', {
                time_to_submit: timeToSubmit,
                submission_id: data.id
            });
        },
        
        onError: (error) => {
            analytics.track('form_submit_error', {
                error: error.message,
                time_to_submit: timeToSubmit
            });
        }
    });
});

// Track form abandonment (user leaves page)
window.addEventListener('beforeunload', () => {
    if (form.isDirty && !form.isSubmitting) {
        analytics.track('form_abandoned', {
            time_on_form: Date.now() - analytics.startTime,
            completed_fields: Object.keys(form.touched).length,
            total_fields: Object.keys(form.values).length
        });
    }
});
```

### Recipe: Form with Field Dependencies

```javascript
const form = ReactiveUtils.form({
    shippingMethod: 'standard',
    shippingAddress: '',
    billingAddress: '',
    sameAsShipping: false,
    expressDeliveryDate: '',
    insuranceAmount: ''
});

const domForm = Forms.checkoutForm;
domForm.connectReactive(form);

// Enable/disable fields based on dependencies
form.$watch('values.shippingMethod', (method) => {
    const dateField = document.getElementById('expressDeliveryDate');
    
    if (method === 'express') {
        dateField.disabled = false;
        dateField.required = true;
    } else {
        dateField.disabled = true;
        dateField.required = false;
        form.setValue('expressDeliveryDate', '');
    }
});

// Copy shipping to billing if checkbox is checked
form.$watch('values.sameAsShipping', (isSame) => {
    const billingField = document.getElementById('billingAddress');
    
    if (isSame) {
        form.setValue('billingAddress', form.values.shippingAddress);
        billingField.disabled = true;
    } else {
        billingField.disabled = false;
    }
});

// Auto-sync shipping to billing when enabled
form.$watch('values.shippingAddress', (address) => {
    if (form.values.sameAsShipping) {
        form.setValue('billingAddress', address);
    }
});

// Conditional validators
form.validators = {
    shippingAddress: Forms.v.required(),
    billingAddress: (value, allValues) => {
        if (!allValues.sameAsShipping && !value) {
            return 'Billing address is required';
        }
        return null;
    },
    expressDeliveryDate: (value, allValues) => {
        if (allValues.shippingMethod === 'express' && !value) {
            return 'Delivery date is required for express shipping';
        }
        return null;
    }
};
```

---

## Testing Guide

### Unit Testing Forms

```javascript
// test/forms.test.js
describe('Form Management System', () => {
    let form, domForm;
    
    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = `
            <form id="testForm">
                <input type="email" name="email" id="email">
                <input type="password" name="password" id="password">
                <button type="submit">Submit</button>
            </form>
        `;
        
        // Create reactive form
        form = ReactiveUtils.form(
            { email: '', password: '' },
            {
                validators: {
                    email: Forms.v.email(),
                    password: Forms.v.minLength(8)
                }
            }
        );
        
        // Get DOM form
        domForm = Forms.testForm;
        domForm.connectReactive(form);
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
    });
    
    test('should create reactive form with initial values', () => {
        expect(form.values.email).toBe('');
        expect(form.values.password).toBe('');
    });
    
    test('should validate email format', () => {
        form.setValue('email', 'invalid');
        form.validateField('email');
        
        expect(form.hasError('email')).toBe(true);
        expect(form.getError('email')).toContain('email');
    });
    
    test('should sync DOM input to reactive form', () => {
        const emailInput = document.getElementById('email');
        emailInput.value = 'test@example.com';
        emailInput.dispatchEvent(new Event('input'));
        
        expect(form.values.email).toBe('test@example.com');
    });
    
    test('should sync reactive form to DOM', () => {
        form.setValue('email', 'user@example.com');
        
        const emailInput = document.getElementById('email');
        expect(emailInput.value).toBe('user@example.com');
    });
    
    test('should validate all fields', () => {
        form.setValues({
            email: 'invalid',
            password: 'short'
        });
        
        const isValid = form.validate();
        
        expect(isValid).toBe(false);
        expect(form.hasError('email')).toBe(true);
        expect(form.hasError('password')).toBe(true);
    });
    
    test('should reset form', () => {
        form.setValues({
            email: 'test@example.com',
            password: 'password123'
        });
        
        form.reset();
        
        expect(form.values.email).toBe('');
        expect(form.values.password).toBe('');
        expect(form.isDirty).toBe(false);
    });
    
    test('should handle form submission', async () => {
        const mockSubmit = jest.fn().mockResolvedValue({ success: true });
        
        form.setValues({
            email: 'test@example.com',
            password: 'password123'
        });
        
        const result = await form.submit(mockSubmit);
        
        expect(mockSubmit).toHaveBeenCalledWith(
            { email: 'test@example.com', password: 'password123' },
            form
        );
        expect(result.success).toBe(true);
    });
});
```

### Integration Testing

```javascript
// test/integration.test.js
describe('Form Integration Tests', () => {
    test('should handle complete form flow', async () => {
        // Setup
        document.body.innerHTML = `
            <form id="loginForm" data-enhanced>
                <input type="email" name="email" required>
                <input type="password" name="password" required>
                <button type="submit">Login</button>
            </form>
        `;
        
        const form = Forms.loginForm;
        
        // Fill form
        form.values = {
            email: 'user@example.com',
            password: 'securePassword123'
        };
        
        // Mock API
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ token: 'abc123' })
        });
        
        // Submit
        const result = await FormEnhancements.submit(form, {
            url: '/api/login',
            method: 'POST'
        });
        
        // Assertions
        expect(result.success).toBe(true);
        expect(result.data.token).toBe('abc123');
        expect(fetch).toHaveBeenCalledWith(
            '/api/login',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'user@example.com',
                    password: 'securePassword123'
                })
            })
        );
    });
});
```

---

## FAQ

**Q: Which approach should I use for my project?**
A: 
- **Simple forms with server rendering**: Use DOM Forms (Document 1) with declarative attributes
- **Complex SPAs**: Use Reactive Forms (Document 2)
- **Best of both worlds**: Use Bridge Mode (Document 4) connecting both

**Q: Can I use this without the DOM Forms module?**
A: Yes! Reactive Forms (Document 2) works standalone. Just load ReactiveUtils first.

**Q: Can I use this without the Reactive Forms module?**
A: Yes! DOM Forms (Document 1) works standalone with DOM Helpers Core.

**Q: How do I handle file uploads?**
A: Files can't be reactive. Use DOM Forms with FormData:
```javascript
const formData = new FormData(domForm);
fetch(url, { method: 'POST', body: formData });
```

**Q: Does this work with TypeScript?**
A: Yes, but you'll need to add type definitions. Basic JSDoc is included.

**Q: How do I clear form errors programmatically?**
A: 
```javascript
// Reactive
form.clearErrors();

// DOM
domForm.clearValidation();
```

**Q: Can I use custom validation messages?**
A: Yes!
```javascript
Forms.v.required('Please enter your email address')
Forms.v.email('That doesn't look like a valid email')
```

**Q: How do I prevent double-submission?**
A: It's automatic! `queueSubmissions: true` (default) prevents double-submit.

**Q: Can I use this with server-side rendered apps?**
A: Absolutely! That's what it's designed for with progressive enhancement.

---

## Resources

### Documentation Links
- DOM Helpers Core: (your core library docs)
- ReactiveUtils: (your reactive library docs)
- GitHub Repository: (your repo)

### Community
- Discord: (your community)
- Stack Overflow Tag: dom-helpers
- Twitter: @yourhandle

### Related Libraries
- Validation: validator.js
- Date Handling: date-fns
- File Upload: dropzone.js
- Rich Text: Quill, TinyMCE

---

## Changelog

### Version 1.0.0
- ✅ Initial release
- ✅ DOM Forms module
- ✅ Reactive Forms module  
- ✅ Form Enhancements bridge
- ✅ Shared validator system
- ✅ Declarative attributes
- ✅ Complete documentation

---

## License

MIT License - Free to use in personal and commercial projects

---

## Credits

Created with ❤️ by [Your Name]

Special thanks to contributors and the community!

---

**That's it!** You now have everything you need to build powerful, flexible forms with the DOM Helpers Form Management System. Start with simple declarative forms and scale up to complex reactive applications as needed.

Happy form building! 🚀
