# 🚀 Quick Start Guide - DOM Helpers Components

**Build your first component in 5 minutes!**

---

## ⚡ Super Quick Start

### Step 1: Setup (30 seconds)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My First Component</title>
</head>
<body>
  
  <div id="app"></div>
  
  <script src="dom-helpers.js"></script>
  <script src="dom-helpers-components.js"></script>
  <script>
    // Your components go here!
  </script>
</body>
</html>
```

### Step 2: Create a Component (2 minutes)

```javascript
Components.register('GreetingCard', `
  <div class="card">
    <h2 id="greeting">Hello!</h2>
    <p id="message">Welcome to components!</p>
  </div>
  
  <style>
    .card {
      padding: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
  </style>
  
  <script>
    if (data.name) {
      Elements.greeting.textContent = 'Hello, ' + data.name + '!';
    }
    if (data.message) {
      Elements.message.textContent = data.message;
    }
  </script>
`);
```

### Step 3: Use It! (30 seconds)

```html
<GreetingCard 
  name="World" 
  message="You just created your first component!">
</GreetingCard>
```

**🎉 Done! You just built your first component!**

---

## 📚 Common Patterns

### Pattern 1: Simple Display Component

```javascript
Components.register('InfoCard', `
  <div class="info-card">
    <h3 id="title"></h3>
    <p id="description"></p>
  </div>
  
  <style>
    .info-card {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
    }
  </style>
  
  <script>
    Elements.update({
      "title.textContent": data.title,
      "description.textContent": data.description
    });
  </script>
`);
```

**Usage:**
```html
<InfoCard title="Hello" description="This is easy!"></InfoCard>
```

---

### Pattern 2: Interactive Button

```javascript
Components.register('CounterButton', `
  <div class="counter">
    <button id="btn">
      Clicked <span id="count">0</span> times
    </button>
  </div>
  
  <style>
    .counter button {
      padding: 15px 30px;
      font-size: 18px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    
    .counter button:hover {
      background: #45a049;
    }
  </style>
  
  <script>
    let count = 0;
    
    Elements.btn.addEventListener('click', () => {
      count++;
      Elements.count.textContent = count;
    });
  </script>
`);
```

**Usage:**
```html
<CounterButton></CounterButton>
```

---

### Pattern 3: List Component

```javascript
Components.register('TaskList', `
  <div class="task-list">
    <h3>My Tasks</h3>
    <ul id="taskList"></ul>
  </div>
  
  <style>
    .task-list {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    
    .task-list ul {
      list-style: none;
      padding: 0;
    }
    
    .task-list li {
      padding: 10px;
      margin: 5px 0;
      background: white;
      border-radius: 4px;
    }
  </style>
  
  <script>
    const tasks = data.tasks || ['Task 1', 'Task 2', 'Task 3'];
    
    const html = tasks.map(task => 
      \`<li>\${task}</li>\`
    ).join('');
    
    Elements.taskList.innerHTML = html;
  </script>
`);
```

**Usage:**
```html
<TaskList tasks='["Buy milk", "Walk dog", "Code"]'></TaskList>
```

---

## 🎨 The 4 Update Syntaxes

### 1. Dot Notation (Fastest!)
```javascript
Elements.update({
  "title.textContent": "New Title"
});
```

### 2. Nested Properties
```javascript
Elements.update({
  "box.style.backgroundColor": "blue",
  "box.style.color": "white"
});
```

### 3. Object Style
```javascript
Elements.update({
  title: {
    textContent: "New Title",
    className: "highlighted"
  }
});
```

### 4. Mixed (Flexible!)
```javascript
Elements.update({
  "title.textContent": "New Title",  // Dot notation
  description: {                      // Object style
    textContent: "Description",
    style: { color: "gray" }
  }
});
```

---

## 💡 Tips & Tricks

### Tip 1: Use Lifecycle Hooks

```javascript
Components.register('SmartComponent', `
  <div id="content">Loading...</div>
  
  <script>
    // Runs when component is ready
    onMounted(() => {
      Elements.content.textContent = 'Ready!';
    });
    
    // Runs before component is removed
    onBeforeDestroy(() => {
      console.log('Cleaning up...');
    });
  </script>
`);
```

### Tip 2: Emit Custom Events

```javascript
Components.register('NotifyButton', `
  <button id="btn">Click Me</button>
  
  <script>
    Elements.btn.addEventListener('click', () => {
      emit('buttonClicked', { 
        message: 'Button was clicked!' 
      });
    });
  </script>
`);

// Listen for the event
document.addEventListener('component:buttonClicked', (e) => {
  console.log(e.detail.data.message);
});
```

### Tip 3: Pass Complex Data

```html
<!-- Pass objects as JSON -->
<MyComponent 
  user='{"name": "John", "age": 30}'
  items='["apple", "banana", "orange"]'>
</MyComponent>
```

---

## 🏆 Complete Examples

### Example 1: Profile Card

```javascript
Components.register('ProfileCard', `
  <div class="profile">
    <img id="avatar" class="avatar">
    <h3 id="name"></h3>
    <p id="bio"></p>
    <button id="followBtn">Follow</button>
  </div>
  
  <style>
    .profile {
      padding: 20px;
      background: white;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      max-width: 250px;
    }
    
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 15px;
    }
    
    .profile button {
      margin-top: 15px;
      padding: 10px 30px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
  </style>
  
  <script>
    // Set data
    Elements.update({
      "avatar.src": data.avatar || "https://via.placeholder.com/100",
      "name.textContent": data.name || "Unknown",
      "bio.textContent": data.bio || "No bio available"
    });
    
    // Handle follow button
    let following = false;
    Elements.followBtn.addEventListener('click', () => {
      following = !following;
      Elements.followBtn.textContent = following ? 'Following' : 'Follow';
      Elements.followBtn.style.background = following ? '#4CAF50' : '#2196F3';
    });
  </script>
`);
```

**Usage:**
```html
<ProfileCard 
  name="Jane Doe"
  bio="Web Developer & Designer"
  avatar="https://i.pravatar.cc/100?img=1">
</ProfileCard>
```

---

### Example 2: Simple Todo App

```javascript
Components.register('SimpleTodo', `
  <div class="todo">
    <h2>My Todo List</h2>
    <div class="add-task">
      <input type="text" id="taskInput" placeholder="Add a new task...">
      <button id="addBtn">Add</button>
    </div>
    <ul id="taskList"></ul>
  </div>
  
  <style>
    .todo {
      max-width: 500px;
      margin: 0 auto;
      padding: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .todo h2 {
      text-align: center;
      color: #333;
      margin-bottom: 20px;
    }
    
    .add-task {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .add-task input {
      flex: 1;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }
    
    .add-task button {
      padding: 12px 24px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }
    
    #taskList {
      list-style: none;
      padding: 0;
    }
    
    .task-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      margin: 8px 0;
      background: #f8f9fa;
      border-radius: 6px;
      transition: background 0.2s;
    }
    
    .task-item:hover {
      background: #e9ecef;
    }
    
    .task-item.completed {
      text-decoration: line-through;
      opacity: 0.6;
    }
    
    .task-item button {
      padding: 6px 12px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
  </style>
  
  <script>
    let tasks = data.tasks || [];
    
    function renderTasks() {
      if (tasks.length === 0) {
        Elements.taskList.innerHTML = '<p style="text-align: center; color: #999;">No tasks yet. Add one above!</p>';
        return;
      }
      
      const html = tasks.map((task, index) => \`
        <li class="task-item \${task.completed ? 'completed' : ''}" data-index="\${index}">
          <span>\${task.text}</span>
          <button onclick="removeTask(\${index})">Delete</button>
        </li>
      \`).join('');
      
      Elements.taskList.innerHTML = html;
      
      // Add click to toggle completion
      Elements.taskList.querySelectorAll('.task-item').forEach((item, index) => {
        item.addEventListener('click', (e) => {
          if (e.target.tagName !== 'BUTTON') {
            tasks[index].completed = !tasks[index].completed;
            renderTasks();
          }
        });
      });
    }
    
    // Make removeTask global for onclick
    window.removeTask = (index) => {
      tasks.splice(index, 1);
      renderTasks();
    };
    
    Elements.addBtn.addEventListener('click', () => {
      const text = Elements.taskInput.value.trim();
      if (text) {
        tasks.push({ text, completed: false });
        Elements.taskInput.value = '';
        renderTasks();
      }
    });
    
    Elements.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        Elements.addBtn.click();
      }
    });
    
    renderTasks();
  </script>
`);
```

**Usage:**
```html
<SimpleTodo></SimpleTodo>
```

---

## 🎯 Cheat Sheet

### Quick Reference

```javascript
// Register a component
Components.register('MyComponent', `
  <div>HTML here</div>
  <style>CSS here</style>
  <script>JavaScript here</script>
`);

// Use in HTML
<MyComponent prop="value"></MyComponent>

// Update elements
Elements.update({
  "element.property": value
});

// Access data
data.propertyName

// Lifecycle hooks
onMounted(() => { /* code */ });
onBeforeDestroy(() => { /* cleanup */ });

// Emit events
emit('eventName', { data: 'value' });

// Listen for events
document.addEventListener('component:eventName', (e) => {
  console.log(e.detail.data);
});
```

---

## 🆘 Need Help?

### Common Issues:

**Component not showing?**
- Make sure component is registered before use
- Check browser console for errors
- Verify component name matches (case-insensitive)

**Elements undefined?**
- Elements need `id` attribute, not `class`
- Access elements after `onMounted()`

**Styles not working?**
- Put styles in `<style>` tags within component
- Styles are automatically scoped to component

**Data not updating?**
- Use `Elements.update()` to change UI
- Changes to variables don't automatically update UI

---

## 🚀 Next Steps

1. ✅ You've learned the basics!
2. 📖 Read the full guide: [COMPONENT-LIBRARY-GUIDE.md](COMPONENT-LIBRARY-GUIDE.md)
3. 🎨 Try building your own components
4. 💪 Experiment with advanced features

---

## 📦 Complete App Template

Here's a complete starter template you can copy and use:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Component App</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f0f2f5;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>My App</h1>
    
    <!-- Your components go here -->
    <GreetingCard name="Developer"></GreetingCard>
  </div>
  
  <!-- Load libraries -->
  <script src="dom-helpers.js"></script>
  <script src="dom-helpers-components.js"></script>
  
  <script>
    // Register your components here
    Components.register('GreetingCard', `
      <div class="greeting">
        <h2 id="message">Hello!</h2>
      </div>
      
      <style>
        .greeting {
          padding: 30px;
          background: white;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      </style>
      
      <script>
        if (data.name) {
          Elements.message.textContent = 'Hello, ' + data.name + '!';
        }
      <\/script>
    `);
    
    // Your app logic here
    console.log('App loaded!');
  </script>
</body>
</html>
```

---

**Happy coding! 🎉**

Remember: Start simple, experiment often, and have fun building with components!
