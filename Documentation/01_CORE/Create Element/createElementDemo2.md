Here's a simple demo using **Method 1: Create Then Update**:

## 🎯 **Simple Demo - Create Then Update**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Method 1: Create Then Update Demo</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }

    h1 {
      color: #333;
      text-align: center;
    }

    #container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      min-height: 300px;
    }

    .box {
      padding: 20px;
      margin: 15px 0;
      background: #007bff;
      color: white;
      border-radius: 5px;
      transition: all 0.3s ease;
    }

    .box:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .card {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .card h3 {
      margin-top: 0;
      color: #007bff;
    }

    button {
      background: #28a745;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
      margin: 10px 5px;
      transition: background 0.3s ease;
    }

    button:hover {
      background: #218838;
    }

    .warning {
      background: #ffc107;
      color: #333;
    }

    .danger {
      background: #dc3545;
    }

    .success {
      background: #28a745;
    }

    .controls {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <h1>Method 1: Create Then Update Demo</h1>

  <div class="controls">
    <button id="addBox">Add Simple Box</button>
    <button id="addCard">Add Card</button>
    <button id="addButton">Add Interactive Button</button>
    <button id="addList">Add List</button>
    <button id="clearAll">Clear All</button>
  </div>

  <div id="container"></div>

  <!-- Include your DOM Helpers library -->
  <script src="your-dom-helpers-library.js"></script>

  <script>
    // Enable createElement enhancement
    DOMHelpers.enableCreateElementEnhancement();

    let counter = 0;

    // Example 1: Simple Box
    Elements.addBox.addEventListener('click', () => {
      counter++;

      // Step 1: Create element
      const div = createElement('div');

      // Step 2: Use .update() to configure it
      div.update({
        className: 'box',
        textContent: `Box #${counter} - Created with createElement + update()`,
        style: {
          background: getRandomColor(),
          fontSize: '18px',
          fontWeight: 'bold'
        }
      });

      // Step 3: Append to container
      Elements.container.appendChild(div);
    });

    // Example 2: Card with Multiple Elements
    Elements.addCard.addEventListener('click', () => {
      counter++;

      // Create card container
      const card = createElement('div');
      card.update({
        className: 'card'
      });

      // Create title
      const title = createElement('h3');
      title.update({
        textContent: `Card Title #${counter}`,
        style: {
          color: '#007bff',
          marginBottom: '10px'
        }
      });

      // Create description
      const description = createElement('p');
      description.update({
        textContent: `This is card #${counter}. Each element was created with createElement() and then configured with .update().`,
        style: {
          color: '#666',
          lineHeight: '1.6'
        }
      });

      // Create timestamp
      const timestamp = createElement('small');
      timestamp.update({
        textContent: `Created at: ${new Date().toLocaleTimeString()}`,
        style: {
          color: '#999',
          fontSize: '12px'
        }
      });

      // Assemble card
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(timestamp);

      // Add to container
      Elements.container.appendChild(card);
    });

    // Example 3: Interactive Button
    Elements.addButton.addEventListener('click', () => {
      counter++;

      // Create wrapper div
      const wrapper = createElement('div');
      wrapper.update({
        style: {
          margin: '15px 0',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '5px',
          textAlign: 'center'
        }
      });

      // Create button
      const button = createElement('button');
      button.update({
        textContent: `Click Me #${counter}`,
        className: 'success',
        style: {
          fontSize: '16px',
          padding: '15px 30px'
        },
        addEventListener: ['click', function(e) {
          // Use e.target.update() in event handler!
          const clicks = parseInt(this.dataset.clicks || '0') + 1;
          
          e.target.update({
            textContent: `Clicked ${clicks} times!`,
            dataset: { clicks: clicks },
            style: {
              background: clicks > 3 ? '#dc3545' : '#28a745',
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

      wrapper.appendChild(button);
      Elements.container.appendChild(wrapper);
    });

    // Example 4: Dynamic List
    Elements.addList.addEventListener('click', () => {
      counter++;

      // Create list container
      const listWrapper = createElement('div');
      listWrapper.update({
        className: 'card',
        style: {
          background: '#e3f2fd'
        }
      });

      // Create list title
      const listTitle = createElement('h3');
      listTitle.update({
        textContent: `Todo List #${counter}`,
        style: {
          color: '#1976d2',
          marginBottom: '15px'
        }
      });

      // Create unordered list
      const ul = createElement('ul');
      ul.update({
        style: {
          listStyle: 'none',
          padding: '0',
          margin: '0'
        }
      });

      // Create list items
      const items = [
        'Learn DOM Helpers Library',
        'Create elements with createElement()',
        'Configure with .update() method',
        'Build awesome apps!'
      ];

      items.forEach((itemText, index) => {
        const li = createElement('li');
        li.update({
          textContent: itemText,
          style: {
            padding: '10px',
            margin: '5px 0',
            background: 'white',
            borderRadius: '4px',
            borderLeft: '4px solid #1976d2',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          },
          dataset: {
            index: index,
            completed: 'false'
          },
          addEventListener: ['click', function(e) {
            const isCompleted = this.dataset.completed === 'true';
            
            e.target.update({
              dataset: { completed: !isCompleted },
              style: {
                textDecoration: !isCompleted ? 'line-through' : 'none',
                opacity: !isCompleted ? '0.6' : '1',
                background: !isCompleted ? '#e8f5e9' : 'white'
              }
            });
          }]
        });

        ul.appendChild(li);
      });

      // Assemble list
      listWrapper.appendChild(listTitle);
      listWrapper.appendChild(ul);
      Elements.container.appendChild(listWrapper);
    });

    // Example 5: Clear All
    Elements.clearAll.addEventListener('click', () => {
      // Clear container
      Elements.container.innerHTML = '';
      counter = 0;

      // Create welcome message
      const welcome = createElement('div');
      welcome.update({
        className: 'card',
        style: {
          textAlign: 'center',
          padding: '40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      });

      const welcomeTitle = createElement('h2');
      welcomeTitle.update({
        textContent: '🎉 Container Cleared!',
        style: {
          margin: '0 0 15px 0',
          fontSize: '32px'
        }
      });

      const welcomeText = createElement('p');
      welcomeText.update({
        textContent: 'Click the buttons above to add new elements using createElement() + update()',
        style: {
          fontSize: '18px',
          margin: '0'
        }
      });

      welcome.appendChild(welcomeTitle);
      welcome.appendChild(welcomeText);
      Elements.container.appendChild(welcome);
    });

    // Helper function to generate random colors
    function getRandomColor() {
      const colors = [
        '#007bff', '#28a745', '#dc3545', 
        '#ffc107', '#17a2b8', '#6f42c1',
        '#fd7e14', '#20c997', '#e83e8c'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // Add initial welcome message
    window.addEventListener('DOMContentLoaded', () => {
      const initialMessage = createElement('div');
      initialMessage.update({
        className: 'card',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '30px'
        }
      });

      const title = createElement('h2');
      title.update({
        textContent: '👋 Welcome to Method 1 Demo!',
        style: { margin: '0 0 10px 0' }
      });

      const subtitle = createElement('p');
      subtitle.update({
        textContent: 'All elements are created with createElement() then configured with .update()',
        style: { 
          margin: '0',
          fontSize: '16px',
          opacity: '0.9'
        }
      });

      initialMessage.appendChild(title);
      initialMessage.appendChild(subtitle);
      Elements.container.appendChild(initialMessage);
    });

  </script>
</body>
</html>
```

## 🎯 **Key Points Demonstrated**

### **1. Basic Pattern:**
```javascript
// Step 1: Create
const div = createElement('div');

// Step 2: Configure with .update()
div.update({
  className: 'box',
  textContent: 'Hello World'
});

// Step 3: Append
Elements.container.appendChild(div);
```

### **2. Styling:**
```javascript
const element = createElement('div');
element.update({
  style: {
    padding: '20px',
    background: '#007bff',
    color: 'white'
  }
});
```

### **3. Event Handlers:**
```javascript
const button = createElement('button');
button.update({
  textContent: 'Click Me',
  addEventListener: ['click', function(e) {
    e.target.update({
      textContent: 'Clicked!',
      style: { background: 'red' }
    });
  }]
});
```

### **4. Data Attributes:**
```javascript
const element = createElement('div');
element.update({
  dataset: {
    id: '123',
    name: 'example'
  }
});
```

### **5. Multiple Elements:**
```javascript
const card = createElement('div');
card.update({ className: 'card' });

const title = createElement('h3');
title.update({ textContent: 'Title' });

card.appendChild(title);
```

## 🚀 **Try These in the Console**

```javascript
// Quick test
const test = createElement('div');
test.update({
  textContent: 'Console Test',
  style: { color: 'red', fontSize: '24px' }
});
Elements.container.appendChild(test);
```

This demo shows the **cleanest and most straightforward way** to create and configure elements with your library! 🎉