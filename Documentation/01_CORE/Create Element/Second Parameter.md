[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


## 🎯 **Simple Minimal Demo**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>createElement with Config Demo</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
    }

    .box {
      padding: 20px;
      margin: 15px 0;
      border-radius: 8px;
    }

    .card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    button {
      padding: 10px 20px;
      margin: 5px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <h1>createElement with Config Object</h1>
  
  <div>
    <button onclick="addBox()">Add Box</button>
    <button onclick="addCard()">Add Card</button>
    <button onclick="addButton()">Add Button</button>
  </div>

  <div id="container"></div>

  <!-- Include DOM Helpers library -->
  <script src="../../src/dom-helpers.js"></script>

  <script>
    // Example 1: Simple Box
    function addBox() {
      const div = createElement('div', {
        className: 'box',
        textContent: 'Enhanced Box - Created in one line!',
        style: {
          padding: '20px',
          background: '#007bff',
          color: 'white'
        }
      });

      Elements.container.appendChild(div);
    }

    // Example 2: Card with Multiple Properties
    function addCard() {
      const card = createElement('div', {
        className: 'card',
        innerHTML: '<h3>Card Title</h3><p>This card was created with a config object!</p>',
        style: {
          background: '#f8f9fa',
          borderLeft: '4px solid #28a745'
        },
        dataset: {
          cardId: Date.now(),
          type: 'example'
        }
      });

      Elements.container.appendChild(card);
    }

    // Example 3: Interactive Button
    function addButton() {
      const button = createElement('button', {
        textContent: 'Click Me!',
        style: {
          background: '#28a745',
          color: 'white',
          padding: '15px 30px',
          fontSize: '18px'
        },
        addEventListener: ['click', function(e) {
          const clicks = parseInt(this.dataset.clicks || '0') + 1;
          
          // You can still use .update() after creation!
          e.target.update({
            textContent: `Clicked ${clicks} times!`,
            dataset: { clicks: clicks },
            style: {
              background: clicks > 3 ? '#dc3545' : '#ffc107',
              transform: 'scale(1.1)'
            }
          });

          setTimeout(() => {
            e.target.update({
              style: { transform: 'scale(1)' }
            });
          }, 200);
        }]
      });

      Elements.container.appendChild(button);
    }

    // Example 4: More Complex Example
    function createUserCard(name, email) {
      const card = createElement('div', {
        className: 'card',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        },
        dataset: {
          userId: Date.now()
        }
      });

      const title = createElement('h3', {
        textContent: name,
        style: {
          margin: '0 0 10px 0'
        }
      });

      const emailText = createElement('p', {
        textContent: email,
        style: {
          margin: '0',
          opacity: '0.9'
        }
      });

      card.appendChild(title);
      card.appendChild(emailText);

      return card;
    }

    // Add a sample user card on load
    window.addEventListener('DOMContentLoaded', () => {
      const userCard = createUserCard('John Doe', 'john@example.com');
      Elements.container.appendChild(userCard);

      // Show welcome message
      const welcome = createElement('div', {
        className: 'box',
        textContent: '✨ Now you can pass config objects directly to createElement()!',
        style: {
          background: '#28a745',
          color: 'white',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold'
        }
      });

      Elements.container.insertBefore(welcome, Elements.container.firstChild);
    });

    // Test in console
    console.log('Try this in console:');
    console.log(`
      const test = createElement('div', {
        textContent: 'Console Test',
        style: { 
          background: 'red', 
          color: 'white', 
          padding: '20px',
          margin: '10px 0'
        }
      });
      Elements.container.appendChild(test);
    `);
  </script>
</body>
</html>


```
## 🎯 **Key Features**

### **1. Direct Configuration:**
```javascript
const div = createElement('div', {
  className: 'box',
  textContent: 'Enhanced Box',
  style: {
    padding: '20px',
    background: '#007bff',
    color: 'white'
  }
});
```

### **2. With Event Listeners:**
```javascript
const button = createElement('button', {
  textContent: 'Click Me',
  style: { background: 'green', color: 'white' },
  addEventListener: ['click', (e) => alert('Clicked!')]
});
```

### **3. With Data Attributes:**
```javascript
const div = createElement('div', {
  textContent: 'Data Example',
  dataset: {
    userId: '123',
    role: 'admin'
  }
});
```

### **4. Still Works with .update():**
```javascript
const div = createElement('div', {
  textContent: 'Initial'
});

// Can still update later
div.update({
  textContent: 'Updated!',
  style: { color: 'red' }
});
```

## 📊 **Browser Console Test**

Open the console and try:

```javascript
// Test 1: Simple
const test1 = createElement('p', {
  textContent: 'Test 1',
  style: { color: 'red', fontSize: '20px' }
});
Elements.container.appendChild(test1);

// Test 2: Complex
const test2 = createElement('div', {
  className: 'box',
  innerHTML: '<strong>Bold Text</strong>',
  style: {
    background: '#ffc107',
    color: '#333',
    padding: '15px'
  },
  dataset: { test: 'value' }
});
Elements.container.appendChild(test2);
```

## ⚡ **How It Works**

The enhanced `createElement` detects if the second parameter is:
- **A config object** (has properties like `className`, `style`, `textContent`, etc.)
  → Creates element and applies config via `.update()`
  
- **Native options** (has `is` property for custom elements)
  → Uses standard `createElement` behavior

This gives you the **best of both worlds**! 🚀
