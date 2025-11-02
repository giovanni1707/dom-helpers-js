[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


Here's a complete demo showing how to use `createElement.bulk()` with the library:

## Complete Demo Code

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>createElement.bulk() Demo</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
    }
    
    #container {
      border: 2px solid #333;
      padding: 20px;
      margin: 20px 0;
      min-height: 200px;
      background: #f5f5f5;
    }
    
    .dynamic {
      padding: 10px;
      margin: 10px 0;
      background: white;
      border-left: 4px solid #007bff;
      transition: all 0.3s ease;
    }
    
    .dynamic:hover {
      background: #e3f2fd;
      transform: translateX(5px);
    }
    
    .card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .card h3 {
      margin-top: 0;
      color: #333;
    }
    
    .card p {
      color: #666;
      line-height: 1.6;
    }
    
    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
      margin: 5px;
      transition: background 0.3s ease;
    }
    
    button:hover {
      background: #0056b3;
    }
    
    .controls {
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <h1>createElement.bulk() Demo</h1>
  
  <div class="controls">
    <button id="addSimple">Add Simple Paragraph</button>
    <button id="addMultiple">Add Multiple Elements</button>
    <button id="addCard">Add Card</button>
    <button id="clearAll">Clear All</button>
  </div>
  
  <div id="container"></div>

  <!-- Include your DOM Helpers library -->
  <script src="../../src/dom-helpers.js"></script>

  <script>
    let counter = 0;

    // Example 1: Simple single element creation
    Elements.addSimple.addEventListener('click', () => {
      counter++;
      
      // Create a single paragraph using bulk (even for one element)
      const elements = createElement.bulk({
        P: {
          id: `para${counter}`,
          classList: { add: ["dynamic"] },
          textContent: `This is paragraph #${counter}, created with createElement.bulk()`
        }
      });
      
      // Append to container
      Elements.container.appendChild(elements.P);
      
      // You can still use .update() on it!
      elements.P.update({
        style: {
          animation: 'fadeIn 0.5s ease'
        }
      });
    });

    // Example 2: Create multiple elements at once
    Elements.addMultiple.addEventListener('click', () => {
      counter++;
      
      // Create multiple different elements
      const elements = createElement.bulk({
        H2: {
          textContent: `Section ${counter}`,
          style: { color: '#007bff', marginTop: '20px' }
        },
        P_1: {
          textContent: `This is the first paragraph in section ${counter}.`,
          classList: { add: ["dynamic"] }
        },
        P_2: {
          textContent: `This is the second paragraph in section ${counter}.`,
          classList: { add: ["dynamic"] }
        },
        HR: {
          style: { 
            border: 'none', 
            borderTop: '2px solid #ddd', 
            margin: '20px 0' 
          }
        }
      });
      
      // Append all in order using helper method
      elements.appendTo(Elements.container);

      // Or
      elements.appendToOrdered(Elements.container, 'H2', 'P_1', 'P_2', 'HR');// append in specific order
      
      console.log('Created elements:', elements.keys); // ['H2', 'P_1', 'P_2', 'HR']
    });

    // Example 3: Create a complete card component
    Elements.addCard.addEventListener('click', () => {
      counter++;
      
      const elements = createElement.bulk({
        DIV: {
          classList: { add: ["card"] },
          id: `card${counter}`
        },
        H3: {
          textContent: `Card Title ${counter}`,
          style: { color: '#007bff' }
        },
        P_description: {
          textContent: `This is a description for card ${counter}. It was created using createElement.bulk() with multiple elements.`,
          style: { marginBottom: '10px' }
        },
        BUTTON: {
          textContent: 'Click Me',
          classList: { add: ['btn-primary'] },
          addEventListener: ['click', function(e) {
            alert(`Button in card ${counter} clicked!`);
            // You can use e.target.update() here!
            e.target.update({
              textContent: 'Clicked!',
              style: { background: '#28a745' }
            });
          }]
        }
      });
      
      // Build the card structure
      elements.DIV.appendChild(elements.H3);
      elements.DIV.appendChild(elements.P_description);
      elements.DIV.appendChild(elements.BUTTON);
      
      // Append to container
      Elements.container.appendChild(elements.DIV);
      
      // Update multiple elements at once
      elements.updateMultiple({
        H3: { 
          style: { textDecoration: 'underline' } 
        },
        BUTTON: { 
          style: { marginTop: '10px' } 
        }
      });
    });

    // Example 4: Advanced usage with all helper methods
    Elements.clearAll.addEventListener('click', () => {
      // Clear container
      Elements.container.innerHTML = '';
      counter = 0;
      
      // Create a welcome message
      const welcome = createElement.bulk({
        DIV: {
          classList: { add: ["card"] }
        },
        H2: {
          textContent: 'Welcome Back!',
          style: { color: '#28a745' }
        },
        P: {
          textContent: 'The container has been cleared. Click the buttons above to add elements.',
          style: { fontStyle: 'italic' }
        }
      });
      
      // Use helper methods
      console.log('Element count:', welcome.count); // 3
      console.log('Has DIV?', welcome.has('DIV')); // true
      console.log('All keys:', welcome.keys); // ['DIV', 'H2', 'P']
      
      // Get elements as array
      const [h2, p] = welcome.toArray('H2', 'P');
      
      // Append in custom order
      welcome.DIV.appendChild(h2);
      welcome.DIV.appendChild(p);
      Elements.container.appendChild(welcome.DIV);
      
      // Use forEach
      welcome.forEach((element, key, index) => {
        console.log(`Element ${index} (${key}):`, element);
      });
      
      // Use map to get all text content
      const texts = welcome.map((el) => el.textContent);
      console.log('All text content:', texts);
      
      // Use filter to get only text elements
      const textElements = welcome.filter((el) => el.tagName === 'P' || el.tagName === 'H2');
      console.log('Text elements:', textElements);
    });

    // Example 5: Dynamic element creation with configuration
    function createUserCard(name, email, age) {
      const elements = createElement.bulk({
        DIV: {
          classList: { add: ["card", "user-card"] },
          dataset: { userId: Date.now() }
        },
        H3: {
          textContent: name,
          style: { marginBottom: '10px' }
        },
        P_email: {
          textContent: `Email: ${email}`,
          style: { fontSize: '14px', color: '#666' }
        },
        P_age: {
          textContent: `Age: ${age}`,
          style: { fontSize: '14px', color: '#666' }
        },
        BUTTON_edit: {
          textContent: 'Edit',
          style: { marginRight: '10px' }
        },
        BUTTON_delete: {
          textContent: 'Delete',
          style: { background: '#dc3545' },
          addEventListener: ['click', function() {
            if (confirm(`Delete user ${name}?`)) {
              elements.DIV.remove();
            }
          }]
        }
      });
      
      // Build structure using ordered append
      elements.appendToOrdered(elements.DIV, 'H3', 'P_email', 'P_age', 'BUTTON_edit', 'BUTTON_delete');
      
      return elements.DIV;
    }
    
    // Add a sample user card
    setTimeout(() => {
      const userCard = createUserCard('John Doe', 'john@example.com', 30);
      Elements.container.appendChild(userCard);
    }, 500);

    // Example 6: Chaining and advanced manipulation
    function createInteractiveList(items) {
      const listElements = createElement.bulk({
        UL: {
          style: { 
            listStyle: 'none', 
            padding: 0 
          }
        },
        ...items.reduce((acc, item, index) => {
          acc[`LI_${index}`] = {
            textContent: item,
            classList: { add: ['dynamic'] },
            style: { 
              cursor: 'pointer',
              padding: '10px',
              marginBottom: '5px',
              background: 'white',
              borderRadius: '4px'
            },
            addEventListener: {
              click: function(e) {
                // Use e.target.update()!
                e.target.update({
                  style: { background: '#d4edda', fontWeight: 'bold' }
                });
              },
              mouseenter: function(e) {
                e.target.update({
                  style: { transform: 'scale(1.02)' }
                });
              },
              mouseleave: function(e) {
                e.target.update({
                  style: { transform: 'scale(1)' }
                });
              }
            }
          };
          return acc;
        }, {})
      });
      
      // Append all list items to UL
      listElements.forEach((element, key) => {
        if (key.startsWith('LI_')) {
          listElements.UL.appendChild(element);
        }
      });
      
      return listElements.UL;
    }
    
    // Create an interactive list after 1 second
    setTimeout(() => {
      const list = createInteractiveList([
        'Click me to highlight',
        'Hover over me',
        'I respond to events too!'
      ]);
      Elements.container.appendChild(list);
    }, 1000);

  </script>
</body>
</html>
```

## Key Features Demonstrated

### 1. **Simple Single Element**
```javascript
const elements = createElement.bulk({
  P: { id: 'myId', textContent: 'Hello' }
});
Elements.container.appendChild(elements.P);
```

### 2. **Multiple Elements at Once**
```javascript
const elements = createElement.bulk({
  H2: { textContent: 'Title' },
  P_1: { textContent: 'First paragraph' },
  P_2: { textContent: 'Second paragraph' }
});
elements.appendTo(container); // Appends all
```

### 3. **Helper Methods**
```javascript
elements.count        // Number of elements
elements.keys         // Array of element keys
elements.all          // Array of all elements
elements.has('DIV')   // Check if element exists
elements.get('P', fallbackElement)  // Get with fallback
elements.toArray('H2', 'P')  // Get specific elements
elements.ordered('P', 'H2')  // Get in specific order
```

### 4. **Batch Updates**
```javascript
elements.updateMultiple({
  H2: { style: { color: 'red' } },
  P: { textContent: 'New text' }
});
```

### 5. **All Elements Still Have .update()**
```javascript
elements.P.update({
  classList: { add: ['highlight'] },
  style: { fontSize: '18px' }
});
```

## Browser Console Examples

Try these in the console after running the demo:

```javascript
// Create elements on the fly
const test = createElement.bulk({
  DIV: { id: 'test', textContent: 'Test' },
  SPAN: { textContent: 'Span' }
});

// Access and manipulate
test.DIV.update({ style: { color: 'red' } });
console.log(test.count); // 2
console.log(test.keys);  // ['DIV', 'SPAN']

// Append
Elements.container.appendChild(test.DIV);
```

This demo shows all the powerful features of `createElement.bulk()` while maintaining the `.update()` functionality you need!