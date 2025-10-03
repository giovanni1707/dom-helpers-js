# DOM Helpers

[![npm version](https://img.shields.io/npm/v/@yourusername/dom-helpers.svg)](https://www.npmjs.com/package/@yourusername/dom-helpers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful, high-performance vanilla JavaScript DOM manipulation library that transforms how you interact with the DOM. Built with intelligent caching, automatic enhancement, and a declarative API that makes complex DOM operations simple and intuitive.

## ✨ Features

- 🎯 **Intelligent Element Access**: Smart caching system for lightning-fast element retrieval
- 🔄 **Universal Update Method**: Declarative `.update()` method for all DOM elements and collections
- 📦 **Multiple Access Patterns**: Access elements by ID, class, tag name, or CSS selectors
- ⚡ **Performance Optimized**: Built-in fine-grained updates and automatic cleanup
- 🛡️ **Error Resilient**: Comprehensive error handling with graceful fallbacks
- 🔧 **Zero Dependencies**: Pure vanilla JavaScript with no external dependencies
- 📱 **Browser Compatible**: Works across all modern browsers (IE 9+)
- 🎨 **Modular Architecture**: Use core library or include specialized modules

## 📦 Installation

```bash
npm install @giovanni1707/dom-helpers
```

## 🚀 Quick Start

“**DOM Helpers** gives you the ***power of declarative updates with the simplicity of vanilla JS***. No frameworks, no heavy abstractions—just a clean, unified API that saves time, reduces boilerplate, and keeps full control of the DOM in your hands.”

### Basic Usage with dom-helpers library

```html
<!DOCTYPE html>
<html>
<head>
    <title>DOM Helpers Demo</title>
</head>
<body>
    <button id="myButton" class="btn">Click Me</button>
    <div class="container">
        <p class="message">Hello World</p>
    </div>
    
    <script src="node_modules/@giovanni1707/dom-helpers/dom-helpers.js"></script>
    <script>
        // Access element by ID - automatically enhanced with .update() method
        Elements.myButton.update({
            textContent: 'Enhanced Button!',
            style: { 
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 20px'
            },
            addEventListener: {
                click: () => alert('Button clicked!')
            }
        });

        // Access elements by class name
        Collections.ClassName.message.update({
            style: { color: 'blue', fontWeight: 'bold' }
        });

        // Use CSS selectors
        Selector.query('.container').update({
            style: { border: '2px solid #ccc', padding: '20px' }
        });
    </script>
</body>
</html>
```

### Without dom-helpers library

```html
<!DOCTYPE html>
<html>
<head>
    <title>DOM Helpers Demo</title>
</head>
<body>
    <button id="myButton" class="btn">Click Me</button>
    <div class="container">
        <p class="message">Hello World</p>
    </div>
    
    <script>
       // Access element by ID
const myButton = document.getElementById('myButton');
myButton.textContent = 'Enhanced Button!';
myButton.style.backgroundColor = '#007bff';
myButton.style.color = 'white';
myButton.style.padding = '10px 20px';
myButton.addEventListener('click', () => alert('Button clicked!'));

// Access elements by class name
const messages = document.getElementsByClassName('message');
for (let msg of messages) {
    msg.style.color = 'blue';
    msg.style.fontWeight = 'bold';
}

// Use CSS selectors
const container = document.querySelector('.container');
container.style.border = '2px solid #ccc';
container.style.padding = '20px';

    </script>
</body>
</html>
```
### ✅ As you can see:

 **Elements.myButton.update(...)** → replaced by ***document.getElementById("myButton")*** then manually setting textContent, style, and addEventListener.

**Collections.ClassName.message.update(...)** → replaced by ***document.getElementsByClassName("message")*** loop and applying styles.

**Selector.query(".container").update(...)** → replaced by ***document.querySelector(".container")*** and applying styles directly.

### The library basically:

***Removes boilerplate*** (like looping over collections).

***Unifies updates*** (styles, attributes, listeners) into a single .update() call.

**Makes imperative** DOM operations ***more declarative*** and ***concise***.


### Improved Readability

Compare this:
**Plain Vanilla JS:**
   ```html
   <script>
const myButton = document.getElementById('myButton');
myButton.textContent = 'Enhanced Button!';
myButton.style.backgroundColor = '#007bff';
myButton.style.color = 'white';
myButton.style.padding = '10px 20px';
myButton.addEventListener('click', () => alert('Button clicked!'));

</script>
```
## dom-helpers (***declarative style***):

```html
<script>
Elements.myButton.update({
   textContent: 'Enhanced Button!',
   style: { backgroundColor: '#007bff', color: 'white', padding: '10px 20px' },
   addEventListener: { click: () => alert('Button clicked!')}
   });

</script>
```

## Simplicity Comparaison
**Plain Vanilla js**
```html
<script>
    const messages = document.getElementsByClassName('message');
for (let msg of messages) {
    msg.style.color = 'blue';
    msg.style.fontWeight = 'bold';
}
</script>
```

**with dom helpers**
```html
<script>
    Collections.ClassName.message.update({
            style: { color: 'blue', fontWeight: 'bold' }
        });
</script>
```
### ES6 Module Import

```javascript
import { Elements, Collections, Selector } from '@giovanni1707/dom-helpers';

// Use the helpers
Elements.myButton.update({
    textContent: 'Click Me!',
    style: { backgroundColor: '#007bff' }
});
```

### CommonJS

```javascript
const { Elements, Collections, Selector } = require('@giovanni1707/dom-helpers');
```

## 🎯 Core Features

### 1. Elements Helper - ID-Based Access

Access any element by its ID with automatic caching:

```javascript
// Simple access
const button = Elements.myButton;

// Declarative updates
Elements.myButton.update({
    textContent: 'Click Me!',
    style: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px'
    },
    classList: {
        add: ['active', 'highlighted'],
        remove: ['disabled']
    },
    addEventListener: {
        click: (e) => console.log('Clicked!'),
        mouseenter: (e) => e.target.style.opacity = '0.8'
    }
});
```

### 2. Collections Helper - Class/Tag/Name Access

Work with collections of elements efficiently:

```javascript
// Access by class name
Collections.ClassName.btn.update({
    style: { padding: '8px 16px' },
    classList: { add: 'enhanced' }
});

// Access by tag name
Collections.TagName.p.update({
    style: { lineHeight: '1.6' }
});

// Utility methods
const buttons = Collections.ClassName.btn;
buttons.forEach(btn => console.log(btn.textContent));
const firstButton = buttons.first();
const visibleButtons = buttons.visible();
```

### 3. Selector Helper - CSS Selector Access

Use standard CSS selectors:

```javascript
// Single element
const header = Selector.query('#header');

// Multiple elements
const allButtons = Selector.queryAll('.btn');

// Scoped queries
const modalButtons = Selector.Scoped.withinAll('#modal', '.btn');
```

## 📚 Available Modules

DOM Helpers includes specialized modules for different use cases:

### Core Module (Required)
- `dom-helpers.js` - Core functionality with Elements, Collections, and Selector helpers

### Optional Modules
- `dom-helpers-storage.js` - LocalStorage and SessionStorage helpers
- `dom-helpers-form.js` - Advanced form handling utilities
- `dom-helpers-animation.js` - Animation and transition helpers
- `dom-helpers-components.js` - Component-based architecture
- `dom-helpers-reactive.js` - Reactive state management
- `dom-helpers-async.js` - Async operations and data fetching

### Combined Build
- `dom-helpers-combined.js` - All modules in one file

### Minified Versions
All modules are available as minified versions in the `helpers-min/` directory.

## 🔄 Fine-Grained Control System

DOM Helpers includes an intelligent fine-grained update system that minimizes unnecessary DOM writes:

```javascript
// Only updates if value actually changed
Elements.myButton.update({
    textContent: "Click Me"  // ✅ Updates DOM
});

Elements.myButton.update({
    textContent: "Click Me"  // ✅ Skips - already set
});

// Granular style updates - only changed properties
Elements.myDiv.update({
    style: {
        color: "blue",      // ✅ Updates
        fontSize: "16px"    // ✅ Updates
    }
});

Elements.myDiv.update({
    style: {
        color: "blue",      // ✅ Skips - unchanged
        padding: "10px"     // ✅ Updates - new property
    }
});
```

## 📊 Performance Benefits

| Operation | Vanilla JS | DOM Helpers | Improvement |
|-----------|-----------|-------------|-------------|
| Element Access | O(1) per call | O(1) cached | Same speed, cached |
| Batch Updates | Multiple writes | Single update call | 70-80% less code |
| Event Listeners | Manual deduplication | Auto-deduped | 100% prevention |
| Style Updates | Overwrites all | Only changed props | ~70% reduction |

## 🎨 Real-World Example

```javascript
function createInteractiveButton(buttonId) {
    const button = Elements[buttonId];
    
    if (!button) {
        console.warn(`Button '${buttonId}' not found`);
        return;
    }
    
    button.update({
        style: {
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        classList: {
            add: ['interactive', 'enhanced']
        },
        addEventListener: {
            click: (e) => {
                e.target.update({
                    classList: { toggle: 'clicked' },
                    style: { transform: 'scale(0.95)' }
                });
                
                setTimeout(() => {
                    e.target.update({
                        style: { transform: 'scale(1)' }
                    });
                }, 150);
            },
            mouseenter: (e) => {
                e.target.update({
                    style: { 
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }
                });
            },
            mouseleave: (e) => {
                e.target.update({
                    style: { 
                        transform: 'translateY(0)',
                        boxShadow: 'none'
                    }
                });
            }
        }
    });
}

// Usage
createInteractiveButton('submitButton');
createInteractiveButton('cancelButton');
```

## 🛠️ Browser Compatibility

- **Modern Browsers**: Chrome 15+, Firefox 4+, Safari 5+
- **Internet Explorer**: IE 9+
- **Mobile**: iOS Safari, Chrome Mobile, Android Browser

## 📖 Documentation

For comprehensive documentation, examples, and API reference, please visit:

- [Complete README](https://github.com/giovanni1707/dom-helpers-js/blob/main/READ%20ME/README.md)
- [API Reference](https://github.com/giovanni1707/dom-helpers-js/blob/main/READ%20ME/API-REFERENCE.md)
- [Component Guide](https://github.com/giovanni1707/dom-helpers-js/blob/main/READ%20ME/COMPONENT-LIBRARY-GUIDE.md)
- [Performance Guide](https://github.com/giovanni1707/dom-helpers-js/blob/main/READ%20ME/PERFORMANCE-OPTIMIZATION-GUIDE.md)
- [Quick Start Guide](https://github.com/giovanni1707/dom-helpers-js/blob/main/READ%20ME/QUICK-START-GUIDE.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ for developers who love vanilla JavaScript but want better DOM manipulation tools.

---

**Ready to transform your DOM manipulation experience?** Install DOM Helpers today and start writing cleaner, more maintainable code!
