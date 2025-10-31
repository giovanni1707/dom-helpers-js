[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# CDN Usage Guide - DOM Helpers

This guide explains how to use DOM Helpers directly from CDN without any installation or build process.

## 🌐 What is jsDelivr?

jsDelivr is a free, fast, and reliable CDN for open source projects. It automatically serves files from npm and GitHub, making it perfect for quick prototyping and production use.

## 📦 Available CDN Options

### Option 1: NPM-based CDN (Recommended)

Load from npm registry via jsDelivr:

```html
<!-- Core library only -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>

<!-- Combined version (all modules) -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-combined.min.js"></script>
```

### Option 2: GitHub-based CDN

Load directly from GitHub repository:

```html
<script src="https://cdn.jsdelivr.net/gh/giovanni1707/dom-helpers-js@main/dist/dom-helpers-combined.min.js"></script>
```

## 🎯 Choosing the Right File

### Core Library
```html
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
```
**Use when**: You only need basic DOM manipulation (Elements, Collections, Selector)
**Size**
### Combined Library
```html
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-combined.min.js"></script>
```
**Use when**: You need all features (storage, forms, animations, components, reactive, async)
**Size**

### Individual Modules
```html
<!-- Load core first -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>

<!-- Then load only the modules you need -->

 <!-- Storage -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-storage.min.js"></script>

<!-- Forms -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-form.min.js"></script>

<!-- Animations -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-animation.min.js"></script>

<!-- Components -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-components.min.js"></script>

<!-- Reactive -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-reactive.min.js"></script>

<!-- Async -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-async.min.js"></script>
```

## 🔢 Version Management

### Specific Version (Production)
```html
<!-- Always use specific version in production -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
```

### Latest Version (Development)
```html
<!-- Automatically gets the latest version -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@latest/dist/dom-helpers.min.js"></script>
```

### Version Range
```html
<!-- Get latest 1.x version -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@1/dist/dom-helpers.min.js"></script>
```

## 💡 Complete Examples

### Example 1: Simple Page with CDN

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DOM Helpers CDN Demo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .btn {
            padding: 10px 20px;
            margin: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>DOM Helpers CDN Demo</h1>
    
    <button id="primaryBtn" class="btn">Primary Button</button>
    <button id="secondaryBtn" class="btn">Secondary Button</button>
    
    <div id="output"></div>

    <!-- Load DOM Helpers from CDN -->
   
    <script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
   
    
    <script>
        // Style the buttons
        Elements.primaryBtn.update({
            style: {
                backgroundColor: '#007bff',
                color: 'white'
            },
            addEventListener: {
                click: () => {
                    Elements.output.update({
                        textContent: 'Primary button clicked!',
                        style: { color: '#007bff' }
                    });
                }
            }
        });

        Elements.secondaryBtn.update({
            style: {
                backgroundColor: '#6c757d',
                color: 'white'
            },
            addEventListener: {
                click: () => {
                    Elements.output.update({
                        textContent: 'Secondary button clicked!',
                        style: { color: '#6c757d' }
                    });
                }
            }
        });

        // Style all buttons with hover effect
        Collections.ClassName.btn.update({
            addEventListener: {
                mouseenter: (e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.transition = 'transform 0.2s';
                },
                mouseleave: (e) => {
                    e.target.style.transform = 'scale(1)';
                }
            }
        });
    </script>
</body>
</html>
```

### Example 2: Using Combined Version with All Features

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Full Features Demo</title>
</head>
<body>
    <div id="app">
        <h1>Todo List with Full Features</h1>
        <input type="text" id="todoInput" placeholder="Enter a task">
        <button id="addBtn">Add Task</button>
        <ul id="todoList"></ul>
    </div>

    <!-- Load combined version with all modules -->
    <script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-combined.min.js"></script>
    
    <script>
        // Initialize storage for todos
        const todoStore = Storage.Local.init('todos', []);

        // Create reactive state
        const todoState = ReactiveState.create({
            todos: todoStore.get() || []
        });

        // Subscribe to state changes
        todoState.subscribe((state) => {
            renderTodos(state.todos);
            todoStore.set(state.todos);
        });

        // Add todo
        Elements.addBtn.update({
            addEventListener: {
                click: () => {
                    const input = Elements.todoInput;
                    const text = input.value.trim();
                    
                    if (text) {
                        const newTodos = [...todoState.getState().todos, {
                            id: Date.now(),
                            text: text,
                            done: false
                        }];
                        
                        todoState.setState({ todos: newTodos });
                        input.value = '';
                    }
                }
            }
        });

        // Render todos
        function renderTodos(todos) {
            const list = Elements.todoList;
            list.innerHTML = '';
            
            todos.forEach(todo => {
                const li = document.createElement('li');
                li.textContent = todo.text;
                li.style.textDecoration = todo.done ? 'line-through' : 'none';
                li.style.cursor = 'pointer';
                
                li.onclick = () => {
                    const updatedTodos = todos.map(t => 
                        t.id === todo.id ? { ...t, done: !t.done } : t
                    );
                    todoState.setState({ todos: updatedTodos });
                };
                
                list.appendChild(li);
            });
        }

        // Initial render
        renderTodos(todoState.getState().todos);
    </script>
</body>
</html>
```

### Example 3: Loading Individual Modules

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Modular Loading Demo</title>
</head>
<body>
    <form id="contactForm">
        <input type="text" name="name" placeholder="Name" required>
        <input type="email" name="email" placeholder="Email" required>
        <button type="submit">Submit</button>
    </form>
    
    <div id="status"></div>

    <!-- Load only the modules you need -->
    <script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-form.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-storage.min.js"></script>
    
    <script>
        // Use form utilities
        const form = Form.enhance('#contactForm', {
            onSubmit: (data) => {
                console.log('Form data:', data);
                
                // Save to localStorage
                Storage.Local.set('lastSubmission', data);
                
                Elements.status.update({
                    textContent: 'Form submitted successfully!',
                    style: { color: 'green' }
                });
                
                return false; // Prevent default form submission
            }
        });

        // Load and display last submission
        const lastSubmission = Storage.Local.get('lastSubmission');
        if (lastSubmission) {
            console.log('Last submission:', lastSubmission);
        }
    </script>
</body>
</html>
```

## ⚡ Performance Tips

### 1. Use SRI (Subresource Integrity)

For production, add integrity checks:

```html
<script 
    src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"
    integrity="sha384-..."
    crossorigin="anonymous">
</script>
```

Generate SRI hash at: https://www.srihash.org/

### 2. Preload Critical Resources

```html
<link rel="preload" 
      href="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js" 
      as="script">
```

### 3. Defer Loading

```html
<script 
    defer
    src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js">
</script>
```

### 4. Load from Multiple CDNs (Fallback)

```html
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
<script>
    // Fallback to GitHub CDN if jsDelivr fails
    if (typeof Elements === 'undefined') {
        document.write('<script src="https://cdn.jsdelivr.net/gh/giovanni1707/dom-helpers-js@main/dist/dom-helpers.min.js"><\/script>');
    }
</script>
```

## 🌍 CDN Features

### 1. Global Availability
- Served from 750+ locations worldwide
- Automatic geographic routing
- Sub-100ms latency globally

### 2. Built-in Optimizations
- Automatic compression (gzip/brotli)
- HTTP/2 support
- Automatic HTTPS

### 3. Version Control
- Immutable files (versions never change)
- SemVer support
- Easy version switching

## 🔗 CDN URL Patterns

### All Modules Available:

```html
<!-- Core -->
https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js

<!-- Storage -->
https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-storage.min.js

<!-- Forms -->
https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-form.min.js

<!-- Animations -->
https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-animation.min.js

<!-- Components -->
https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-components.min.js

<!-- Reactive -->
https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-reactive.min.js

<!-- Async -->
https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-async.min.js

<!-- Combined (All modules) -->
https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers-combined.min.js
```

## 🎓 Quick Start for Beginners

If you're new to CDNs, here's the simplest way to get started:

1. Create an HTML file
2. Add this script tag before your code:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
   ```
3. Start using DOM Helpers immediately - no installation needed!

## 📚 Additional Resources

- [jsDelivr Documentation](https://www.jsdelivr.com/)
- [DOM Helpers GitHub](https://github.com/giovanni1707/dom-helpers-js)
- [DOM Helpers npm](https://www.npmjs.com/package/@giovanni1707/dom-helpers)

## ⚠️ Important Notes

1. **Always pin versions in production** - Don't use `@latest` in production
2. **Test before deploying** - Always test CDN links before production use
3. **Monitor CDN status** - Check jsDelivr status page if issues arise
4. **Consider caching** - Browsers cache CDN files, but initial load requires internet

## 🎉 Benefits of Using CDN

✅ **Zero Installation** - No npm, no build process
✅ **Fast Loading** - Served from nearest location
✅ **Always Available** - 99.9% uptime guarantee
✅ **Browser Caching** - Users download once, use everywhere
✅ **Perfect for Prototyping** - Start coding immediately
✅ **Production Ready** - Battle-tested infrastructure

---

Start using DOM Helpers from CDN today - no setup required! 🚀
