# DOM Helpers Documentation Website

This is the comprehensive documentation website for the DOM Helpers JavaScript library.

## 📁 Structure

```
docs-website/
├── index.html              # Homepage with overview
├── getting-started.html    # Installation & quick start guide
├── api-reference.html      # Complete API overview
├── modules/                # Individual module documentation
│   ├── core.html          # Core module (Elements, Collections, Selector)
│   ├── storage.html       # Storage module (localStorage/sessionStorage)
│   ├── form.html          # Form handling & validation
│   ├── animation.html     # Animation utilities
│   ├── components.html    # Component system
│   ├── reactive.html      # Reactive state management
│   └── async.html         # Async operations
└── examples/              # Interactive examples
    └── index.html         # Live demos with working code

```

## 🎨 Design Features

- **Blue-to-Purple Gradient Theme**: Beautiful modern design with consistent branding
- **Dark Mode by Default**: Easy on the eyes with light mode toggle
- **Glass Effect Navigation**: Frosted glass navigation bar
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Syntax Highlighting**: Code examples with Prism.js
- **Interactive Demos**: Live examples you can try in the browser

## 🚀 Viewing the Documentation

### Option 1: Local Server (Recommended)

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Option 2: Direct File Access

Simply open `index.html` in your web browser. Note: Some features may not work properly with the `file://` protocol.

### Option 3: Deploy to GitHub Pages

1. Push this folder to your GitHub repository
2. Go to Settings > Pages
3. Select the branch and folder containing the docs
4. Your documentation will be available at `https://yourusername.github.io/your-repo/`

## 📝 Features Included

### Homepage (index.html)
- Hero section with call-to-action
- Feature highlights
- Code comparison (Vanilla JS vs DOM Helpers)
- Module overview cards
- Performance statistics
- Links to all sections

### Getting Started (getting-started.html)
- Installation instructions (NPM & CDN)
- First steps tutorial
- Basic usage examples
- Core concepts explanation
- Next steps guidance

### API Reference (api-reference.html)
- Quick navigation
- Overview of all 7 modules
- Code samples for each module
- Links to detailed documentation

### Module Pages (modules/*.html)
Each module page includes:
- Installation instructions
- Key features overview
- Detailed API documentation
- Real-world examples
- Best practices

### Examples Page (examples/index.html)
- Interactive live demos
- Counter app
- Todo list
- Theme switcher
- Form handling
- Fully functional code examples

## 🔧 Technologies Used

- **Tailwind CSS**: For styling and responsive design
- **Prism.js**: For syntax highlighting
- **Pure HTML/CSS/JS**: No build process required
- **DOM Helpers Library**: Loaded from CDN for examples

## 📦 Deployment Options

### GitHub Pages
Perfect for hosting static documentation. Free and easy to set up.

### Netlify
Drag and drop the `docs-website` folder for instant deployment.

### Vercel
Connect your repository for automatic deployments.

### Custom Server
Upload to any web server - no special requirements needed.

## ✨ Customization

### Colors
The gradient theme uses these primary colors:
- Blue: `#3b82f6`
- Purple: `#8b5cf6`

To change, update the Tailwind config in each HTML file.

### Content
All content is in plain HTML files. Simply edit the files to update documentation.

### Navigation
The navigation bar is consistent across all pages. Update in each file to maintain consistency.

## 📄 License

This documentation is part of the DOM Helpers project and is released under the MIT License.

## 🤝 Contributing

To improve the documentation:
1. Edit the relevant HTML files
2. Test locally
3. Submit a pull request

## 📞 Support

- GitHub Issues: Report bugs or request features
- Documentation: You're looking at it!
- Examples: Check the `/examples` folder for working code

---

Built with ❤️ for the DOM Helpers community
