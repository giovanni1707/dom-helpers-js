# DOM Helpers Async Module

A comprehensive, production-ready JavaScript async utilities library that seamlessly integrates with the DOM Helpers ecosystem. This module provides powerful asynchronous functionality while maintaining the core philosophy of enhancing vanilla JavaScript without hiding native APIs.

## 🎯 Purpose & Philosophy

The DOM Helpers Async module bridges the gap between complex async operations and clean, maintainable code. It provides developers with powerful utilities for handling debouncing, throttling, fetch operations, form handling, input sanitization, and parallel request management—all while preserving the flexibility and control of vanilla JavaScript.

**Key Philosophy:**
- **Solve real async pain points** that every developer faces
- **Declarative async operations** with vanilla JS at the core
- **Seamless DOM Helpers integration** with the familiar `.update()` pattern
- **Production-ready reliability** with comprehensive error handling
- **Performance-optimized** with intelligent caching and cleanup

---

## ✨ Features

### 🕐 Timing & Control Utilities
- **Debounce**: Delay function execution until after calls have stopped
- **Throttle**: Limit function execution to once per time period
- **Sleep**: Promise-based delays for better async flow control

### 🛡️ Security & Sanitization
- **XSS Protection**: Built-in input sanitization for preventing injection attacks
- **Configurable Sanitization**: Flexible options for different security needs
- **Safe HTML Processing**: Automatic encoding of dangerous content

### 🌐 Enhanced Fetch Operations
- **Auto-retry Logic**: Configurable retry attempts with exponential backoff
- **Timeout Management**: Automatic request abortion after specified time
- **Loading Indicators**: Built-in loading state management
- **Error Handling**: Comprehensive error catching and callback support
- **Multiple Response Types**: JSON, text, and blob support

### 📋 Form & Validation Utilities
- **Async Form Handling**: Complete form submission with validation
- **Field Validation**: Email, URL, number, length, and custom validation
- **Form Data Extraction**: Clean object extraction from form elements
- **Message Display**: Built-in success/error messaging system
- **Loading States**: Automatic loading indicators during submission

### ⚡ Parallel & Advanced Operations
- **Parallel Requests**: Execute multiple requests simultaneously
- **Progress Tracking**: Real-time progress monitoring for long operations
- **Race Conditions**: Handle timeout races and first-response scenarios
- **Async Handler Wrapper**: Transform any function into an async-ready handler

---

## 🚀 Installation & Setup

### Quick Start
```html
<!-- Load core first -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@1.0.0/dist/dom-helpers.min.js"></script>

<!-- Then load Async module -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@1.0.0/dist/dom-helpers-async.min.js"></script>

```

### Verification
```javascript
// Check if async module loaded successfully
if (typeof AsyncHelpers !== 'undefined') {
    console.log('Async module version:', AsyncHelpers.version);
    console.log('DOM Helpers integration:', AsyncHelpers.isDOMHelpersAvailable());
} else {
    console.error('Async module failed to load');
}
```

---

## 📚 Core Usage Examples

### Debounce & Throttle

#### Debounced Search with DOM Helpers Integration
```javascript
// Using the familiar .update() pattern
Elements.search.update({
    addEventListener: {
        input: Elements.debounce((e) => {
            console.log('Search:', e.target.value);
            // API call here - will only fire after user stops typing
        }, 300) // 300ms delay
    }
});

// Advanced debounce with options
Elements.liveSearch.update({
    addEventListener: {
        input: Elements.debounce(async (e) => {
            const query = e.target.value;
            if (query.length > 2) {
                const results = await Elements.fetchJSON(`/api/search?q=${query}`);
                Elements.results.update({ 
                    innerHTML: results.map(r => `<div>${r.title}</div>`).join('') 
                });
            }
        }, 300, { 
            maxWait: 1000, // Force execution after 1 second max
            immediate: false 
        })
    }
});
```

#### Throttled Scroll Events
```javascript
// Throttled scroll for performance
Elements.window.update({
    addEventListener: {
        scroll: Elements.throttle(() => {
            const scrollPercent = (window.scrollY / document.body.scrollHeight) * 100;
            Elements.progressBar.update({ 
                style: { width: `${scrollPercent}%` } 
            });
        }, 200) // Maximum once per 200ms
    }
});
```

### Input Sanitization & XSS Protection

#### Basic XSS Protection
```javascript
// Dangerous user input
const userInput = '<img src=x onerror=alert(1)><script>alert("XSS")</script>';

// Safe insertion using built-in sanitization
Elements.output.update({
    innerHTML: Elements.sanitize(userInput) // Automatically cleaned
});

// Result: &lt;img src=x&gt;&lt;/script&gt; (safe, encoded HTML)
```

#### Advanced Sanitization Options
```javascript
// Configure sanitization for specific needs
const safeContent = Elements.sanitize(userInput, {
    allowedTags: ['p', 'strong', 'em'], // Allow specific tags
    allowedAttributes: ['class'], // Allow specific attributes
    removeScripts: true, // Remove all scripts (default: true)
    removeEvents: true, // Remove event handlers (default: true)
    removeStyles: false // Keep style attributes (default: false)
});

Elements.contentArea.update({
    innerHTML: safeContent
});
```

### Enhanced Fetch Operations

#### Basic Fetch with All Features
```javascript
// Complete fetch example with error handling
Elements.fetch('/api/data', {
    timeout: 5000,      // Auto-abort after 5 seconds
    retries: 3,         // Auto-retry 3 times on failure
    retryDelay: 1000,   // 1 second between retries (exponential backoff)
    loadingIndicator: Elements.loader, // Show/hide loading automatically
    
    onSuccess: (data) => {
        Elements.output.update({ textContent: JSON.stringify(data) });
    },
    
    onError: (err) => {
        Elements.output.update({ textContent: `Error: ${err.message}` });
    },
    
    onStart: () => {
        console.log('Request started');
    },
    
    onFinally: () => {
        console.log('Request completed');
    }
});
```

#### Different Response Types
```javascript
// JSON response (default)
const data = await Elements.fetchJSON('/api/users');

// Text response
const html = await Elements.fetchText('/api/template');

// Binary response
const blob = await Elements.fetchBlob('/api/download');
```

### Async Form Handling

#### Complete Form with Validation
```javascript
// Comprehensive form handling
Elements.contactForm.update({
    addEventListener: {
        submit: Elements.asyncHandler(async (e) => {
            e.preventDefault();
            const form = e.target;
            
            // 1. Validate form with rules
            const validation = Elements.validateForm(form, {
                name: { 
                    required: true, 
                    label: 'Name', 
                    minLength: 2 
                },
                email: { 
                    required: true, 
                    type: 'email', 
                    label: 'Email' 
                },
                message: { 
                    maxLength: 500, 
                    label: 'Message',
                    validator: (value) => {
                        // Custom validation
                        return value.includes('@') ? 'Message cannot contain @ symbol' : true;
                    }
                }
            });
            
            if (!validation.isValid) {
                form.showMessage(validation.errors.join(', '), 'error');
                return;
            }
            
            // 2. Extract form data safely
            const data = form.getData({
                includeEmpty: false, // Skip empty fields
                excludeDisabled: true, // Skip disabled fields
                transform: (data) => {
                    // Transform data before sending
                    data.timestamp = new Date().toISOString();
                    return data;
                }
            });
            
            // 3. Submit with enhanced fetch
            await Elements.fetchJSON(form.action || '/api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
                timeout: 10000,
                retries: 2
            });
            
            // 4. Show success and reset
            form.showMessage('Message sent successfully!', 'success');
            form.reset();
            
        }, {
            loadingClass: 'loading', // CSS class for loading state
            loadingAttribute: 'data-loading', // HTML attribute for loading state
            errorHandler: (error) => {
                Elements.showFormMessage(
                    Elements.contactForm, 
                    `Submission failed: ${error.message}`, 
                    'error'
                );
            }
        })
    }
});
```

#### Standalone Form Methods
```javascript
// Use form utilities independently
const form = Elements.myForm;

// Validate only
const validation = Elements.validateForm(form, validationRules);
if (validation.isValid) {
    console.log('Form is valid!');
} else {
    console.log('Errors:', validation.errors);
}

// Extract data only
const formData = Elements.getFormData(form, {
    includeEmpty: true,
    transform: (data) => ({
        ...data,
        processed: true
    })
});

// Show messages
Elements.showFormMessage(form, 'Processing...', 'info', {
    duration: 3000, // Auto-hide after 3 seconds
    className: 'custom-message'
});
```

### Parallel Requests & Progress

#### Parallel API Calls with Progress
```javascript
// Execute multiple requests simultaneously
const requests = [
    Elements.fetchJSON('/api/users'),
    Elements.fetchJSON('/api/posts'), 
    Elements.fetchJSON('/api/comments')
];

const results = await Elements.parallelAll(requests, {
    failFast: false, // Don't stop on first error
    onProgress: (completed, total, latestResult) => {
        const percent = (completed / total) * 100;
        
        Elements.progressBar.update({ 
            style: { width: `${percent}%` } 
        });
        
        Elements.status.update({
            textContent: `Progress: ${completed}/${total} requests completed`
        });
        
        console.log('Latest result:', latestResult);
    }
});

// Process results (mix of success and failure)
results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
        console.log(`Request ${index} succeeded:`, result.value);
    } else {
        console.log(`Request ${index} failed:`, result.reason);
    }
});
```

#### Race Conditions & Timeouts
```javascript
// First response wins, with timeout
try {
    const fastestResult = await Elements.raceWithTimeout([
        Elements.fetchJSON('/api/server1/data'),
        Elements.fetchJSON('/api/server2/data'),
        Elements.fetchJSON('/api/server3/data')
    ], 3000); // 3 second timeout
    
    Elements.output.update({ textContent: JSON.stringify(fastestResult) });
} catch (error) {
    Elements.output.update({ textContent: `All requests failed or timed out: ${error.message}` });
}
```

---

## 🔄 Vanilla JavaScript vs DOM Helpers Async

### Debounced Search Implementation

#### Vanilla JavaScript (Complex & Error-Prone)
```javascript
// Traditional vanilla JS - verbose and manual cleanup needed
let searchTimeout;
let searchController;

function handleSearch(event) {
    const query = event.target.value.trim();
    
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Abort previous request
    if (searchController) {
        searchController.abort();
    }
    
    // Skip short queries
    if (query.length < 2) {
        document.getElementById('results').innerHTML = '';
        document.getElementById('results').style.display = 'none';
        return;
    }
    
    searchTimeout = setTimeout(async () => {
        try {
            // Show loading
            const loadingEl = document.getElementById('loading');
            loadingEl.style.display = 'block';
            
            // Create new abort controller
            searchController = new AbortController();
            
            // Manual XSS protection (incomplete)
            const safeQuery = query.replace(/[<>]/g, '');
            
            // Manual fetch with timeout
            const timeoutId = setTimeout(() => searchController.abort(), 5000);
            
            const response = await fetch(`/api/search?q=${encodeURIComponent(safeQuery)}`, {
                signal: searchController.signal,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Hide loading
            loadingEl.style.display = 'none';
            
            // Update results (manual XSS protection needed)
            const resultsEl = document.getElementById('results');
            resultsEl.innerHTML = data.map(item => 
                `<div class="result-item">${item.title.replace(/[<>]/g, '')}</div>`
            ).join('');
            resultsEl.style.display = 'block';
            
        } catch (error) {
            document.getElementById('loading').style.display = 'none';
            
            if (error.name === 'AbortError') {
                console.log('Search aborted');
            } else {
                console.error('Search failed:', error);
                document.getElementById('results').innerHTML = 
                    '<div class="error">Search failed. Please try again.</div>';
            }
        }
    }, 300);
}

// Manual event binding
document.getElementById('search').addEventListener('input', handleSearch);
```

#### DOM Helpers Async (Clean & Declarative)
```javascript
// DOM Helpers - Clean, safe, and powerful
Elements.search.update({
    addEventListener: {
        input: Elements.debounce(async (e) => {
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                Elements.results.update({ 
                    innerHTML: '',
                    style: { display: 'none' }
                });
                return;
            }
            
            try {
                // Built-in XSS protection, timeout, loading, and error handling
                const data = await Elements.fetchJSON(`/api/search?q=${query}`, {
                    timeout: 5000,
                    loadingIndicator: Elements.loading,
                    onError: () => {
                        Elements.results.update({
                            innerHTML: '<div class="error">Search failed. Please try again.</div>'
                        });
                    }
                });
                
                // Safe rendering with built-in sanitization
                Elements.results.update({
                    innerHTML: data.map(item => 
                        `<div class="result-item">${Elements.sanitize(item.title)}</div>`
                    ).join(''),
                    style: { display: 'block' }
                });
                
            } catch (error) {
                console.error('Search error:', error);
            }
        }, 300)
    }
});
```

### Form Submission with Validation

#### Vanilla JavaScript (Manual Everything)
```javascript
// Vanilla JS - Manual validation, data extraction, and submission
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const errors = [];
    
    // Manual validation
    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const messageField = form.querySelector('#message');
    
    // Clear previous errors
    [nameField, emailField, messageField].forEach(field => {
        field.classList.remove('error');
    });
    
    // Validate name
    const name = nameField.value.trim();
    if (!name) {
        errors.push('Name is required');
        nameField.classList.add('error');
    } else if (name.length < 2) {
        errors.push('Name must be at least 2 characters');
        nameField.classList.add('error');
    }
    
    // Validate email
    const email = emailField.value.trim();
    if (!email) {
        errors.push('Email is required');
        emailField.classList.add('error');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email must be valid');
        emailField.classList.add('error');
    }
    
    // Validate message
    const message = messageField.value.trim();
    if (message.length > 500) {
        errors.push('Message must be no more than 500 characters');
        messageField.classList.add('error');
    }
    
    // Show errors
    if (errors.length > 0) {
        let messageEl = form.querySelector('.form-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'form-message form-message--error';
            form.insertBefore(messageEl, form.firstChild);
        }
        messageEl.textContent = errors.join(', ');
        messageEl.style.display = 'block';
        return;
    }
    
    try {
        // Show loading
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Manual data extraction
        const formData = {
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        // Manual timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(form.action || '/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        await response.json();
        
        // Success handling
        let messageEl = form.querySelector('.form-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'form-message';
            form.insertBefore(messageEl, form.firstChild);
        }
        messageEl.className = 'form-message form-message--success';
        messageEl.textContent = 'Message sent successfully!';
        messageEl.style.display = 'block';
        
        form.reset();
        
    } catch (error) {
        // Error handling
        let messageEl = form.querySelector('.form-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'form-message';
            form.insertBefore(messageEl, form.firstChild);
        }
        messageEl.className = 'form-message form-message--error';
        messageEl.textContent = `Submission failed: ${error.message}`;
        messageEl.style.display = 'block';
        
    } finally {
        // Cleanup
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
});
```

#### DOM Helpers Async (Elegant & Comprehensive)
```javascript
// DOM Helpers - All the power, fraction of the code
Elements.contactForm.update({
    addEventListener: {
        submit: Elements.asyncHandler(async (e) => {
            e.preventDefault();
            const form = e.target;
            
            // Built-in validation with comprehensive rules
            const validation = form.validate({
                name: { required: true, label: 'Name', minLength: 2 },
                email: { required: true, type: 'email', label: 'Email' },
                message: { maxLength: 500, label: 'Message' }
            });
            
            if (!validation.isValid) {
                form.showMessage(validation.errors.join(', '), 'error');
                return;
            }
            
            // Extract data with built-in transformation
            const data = form.getData({
                transform: (data) => ({
                    ...data,
                    timestamp: new Date().toISOString()
                })
            });
            
            // Submit with all features built-in
            await Elements.fetchJSON(form.action || '/api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
                timeout: 10000,
                retries: 2
            });
            
            form.showMessage('Message sent successfully!', 'success');
            form.reset();
            
        }, {
            loadingClass: 'loading',
            errorHandler: (error) => {
                Elements.contactForm.showMessage(`Submission failed: ${error.message}`, 'error');
            }
        })
    }
});
```

---

## ⚙️ Configuration & Advanced Options

### Global Configuration
```javascript
// Configure default settings for all async operations
AsyncHelpers.configure({
    debounceDelay: 400,     // Default debounce delay
    throttleDelay: 150,     // Default throttle delay
    fetchTimeout: 8000,     // Default fetch timeout
    fetchRetries: 1         // Default retry attempts
});
```

### Advanced Debounce Options
```javascript
const advancedDebounce = Elements.debounce(handler, 300, {
    immediate: true,    // Execute immediately on first call
    maxWait: 1000,     // Force execution after max wait
    leading: true,     // Execute on leading edge
    trailing: false    // Don't execute on trailing edge
});

// Cancel pending execution
advancedDebounce.cancel();

// Force immediate execution
advancedDebounce.flush();
```

### Advanced Throttle Options
```javascript
const advancedThrottle = Elements.throttle(handler, 200, {
    leading: true,     // Execute on first call
    trailing: false    // Don't execute after throttle period
});

// Cancel pending execution
advancedThrottle.cancel();
```

### Custom Sanitization Rules
```javascript
// Create custom sanitization profiles
const blogPostSanitizer = (content) => Elements.sanitize(content, {
    allowedTags: ['p', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
    allowedAttributes: ['href', 'title', 'class'],
    removeScripts: true,
    removeEvents: true,
    removeStyles: true
});

const commentSanitizer = (content) => Elements.sanitize(content, {
    allowedTags: ['p', 'strong', 'em'],
    allowedAttributes: [],
    removeScripts: true,
    removeEvents: true,
    removeStyles: true
});

// Use in context
Elements.blogContent.update({
    innerHTML: blogPostSanitizer(userContent)
});
```

### Advanced Fetch Configuration
```javascript
// Create reusable fetch configurations
const apiConfig = {
    timeout: 15000,
    retries: 3,
    retryDelay: 2000,
    headers: {
        'Authorization': 'Bearer ' + token,
        'X-API-Version': '2.0'
    },
    onStart: () => console.log('API call started'),
    onError: (error) => console.error('API error:', error),
    onFinally: () => console.log('API call completed')
};

// Use configuration
const userData = await Elements.fetchJSON('/api/user/profile', apiConfig);
const postsData = await Elements.fetchJSON('/api/user/posts', apiConfig);
```

---

## 🎯 Real-World Use Cases

### 1. **Live Search with Auto-Complete**
```javascript
// Complete implementation for production live search
Elements.searchInput.update({
    addEventListener: {
        input: Elements.debounce(async (e) => {
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                Elements.searchResults.update({ 
                    style: { display: 'none' },
                    innerHTML: '' 
                });
                return;
            }
            
            try {
                // Sanitize input before sending to API
                const safeQuery = Elements.sanitize(query);
                
                const suggestions = await Elements.fetchJSON(`/api/search/suggestions`, {
                    method: 'POST',
                    body: JSON.stringify({ query: safeQuery }),
                    timeout: 3000,
                    retries: 1,
                    onStart: () => {
                        Elements.searchResults.update({ 
                            innerHTML: '<div class="loading">Searching...</div>',
                            style: { display: 'block' }
                        });
                    }
                });
                
                Elements.searchResults.update({
                    innerHTML: suggestions.map(item => 
                        `<div class="suggestion" data-id="${item.id}">
                            <strong>${Elements.sanitize(item.title)}</strong>
                            <span>${Elements.sanitize(item.description)}</span>
                        </div>`
                    ).join(''),
                    style: { display: 'block' }
                });
                
            } catch (error) {
                Elements.searchResults.update({
                    innerHTML: '<div class="error">Search temporarily unavailable</div>',
                    style: { display: 'block' }
                });
            }
        }, 300)
    }
});

// Handle suggestion selection
Elements.searchResults.update({
    addEventListener: {
        click: (e) => {
            const suggestion = e.target.closest('.suggestion');
            if (suggestion) {
                const id = suggestion.dataset.id;
                const title = suggestion.querySelector('strong').textContent;
                
                Elements.searchInput.update({ value: title });
                Elements.searchResults.update({ style: { display: 'none' } });
                
                // Navigate or perform action
                window.location.href = `/item/${id}`;
            }
        }
    }
});
```

### 2. **Infinite Scroll with Loading States**
```javascript
// Implement infinite scroll with DOM Helpers Async
let isLoading = false;
let page = 1;
let hasMore = true;

Elements.window.update({
    addEventListener: {
        scroll: Elements.throttle(async () => {
            if (isLoading || !hasMore) return;
            
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const scrollPercent = (scrollTop + clientHeight) / scrollHeight;
            
            if (scrollPercent > 0.8) { // Load when 80% scrolled
                isLoading = true;
                
                try {
                    Elements.loadingIndicator.update({ 
                        style: { display: 'block' },
                        textContent: 'Loading more content...'
                    });
                    
                    const data = await Elements.fetchJSON(`/api/content?page=${page}`, {
                        timeout: 10000,
                        retries: 2
                    });
                    
                    if (data.items.length === 0) {
                        hasMore = false;
                        Elements.loadingIndicator.update({ 
                            textContent: 'No more content to load',
                            style: { display: 'block' }
                        });
                        return;
                    }
                    
                    // Append new content safely
                    const newContent = data.items.map(item => 
                        `<article class="content-item">
                            <h3>${Elements.sanitize(item.title)}</h3>
                            <p>${Elements.sanitize(item.excerpt)}</p>
                        </article>`
                    ).join('');
                    
                    Elements.contentContainer.update({
                        innerHTML: Elements.contentContainer.innerHTML + newContent
                    });
                    
                    page++;
                    Elements.loadingIndicator.update({ style: { display: 'none' } });
                    
                } catch (error) {
                    Elements.loadingIndicator.update({
                        textContent: 'Failed to load content. Please try again.',
                        style: { display: 'block' }
                    });
                } finally {
                    isLoading = false;
                }
            }
        }, 200)
    }
});
```

### 3. **Multi-Step Form with Progress**
```javascript
// Complex multi-step form with async validation
const FormWizard = {
    currentStep: 1,
    totalSteps: 3,
    data: {},
    
    async validateStep(step) {
        const stepElement = Elements[`step${step}`];
        const rules = this.getValidationRules(step);
        
        const validation = Elements.validateForm(stepElement, rules);
        
        if (!validation.isValid) {
            Elements.showFormMessage(stepElement, validation.errors.join(', '), 'error');
            return false;
        }
        
        // Additional async validation (e.g., check email availability)
        if (step === 1) {
            try {
                const email = stepElement.querySelector('#email').value;
                const available = await Elements.fetchJSON('/api/check-email', {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                    timeout: 5000
                });
                
                if (!available.isAvailable) {
                    Elements.showFormMessage(stepElement, 'Email is already in use', 'error');
                    return false;
                }
            } catch (error) {
                Elements.showFormMessage(stepElement, 'Unable to verify email availability', 'error');
                return false;
            }
        }
        
        return true;
    },
    
    async nextStep() {
        if (await this.validateStep(this.currentStep)) {
            // Save current step data
            const stepData = Elements.getFormData(Elements[`step${this.currentStep}`]);
            this.data = { ...this.data, ...stepData };
            
            // Hide current step
            Elements[`step${this.currentStep}`].update({ 
                style: { display: 'none' } 
            });
            
            this.currentStep++;
            
            // Show next step
            Elements[`step${this.currentStep}`].update({ 
                style: { display: 'block' } 
            });
            
            // Update progress
            this.updateProgress();
        }
    },
    
    async submitForm() {
        if (await this.validateStep(this.currentStep)) {
            const
