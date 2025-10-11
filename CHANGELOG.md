# Changelog

All notable changes to DOM Helpers will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2025-01-10

### Added

#### 🎉 Bulk Element Creation Feature
- **`createElement.bulk(definitions)`** - Create multiple DOM elements in a single declarative call
- **`createElement.update(definitions)`** - Alias for bulk element creation
- Support for numbered instances (e.g., `DIV_1`, `DIV_2`, `DIV_3`)
- Globally exposed `createElement` function with bulk creation capabilities

#### Rich Return Object API
- Direct element access by key (e.g., `elements.H1`, `elements.P`)
- **`.all`** getter - Returns all elements as array
- **`.toArray(...keys)`** - Get specific elements as array
- **`.ordered(...keys)`** - Get elements in custom order
- **`.count`** getter - Total number of elements
- **`.keys`** getter - Array of all element keys
- **`.has(key)`** - Check if element exists
- **`.get(key, fallback)`** - Safe element retrieval with fallback
- **`.updateMultiple(updates)`** - Batch update multiple elements
- **`.forEach(callback)`** - Iterate over elements
- **`.map(callback)`** - Map over elements
- **`.filter(callback)`** - Filter elements
- **`.appendTo(container)`** - Append all elements to container
- **`.appendToOrdered(container, ...keys)`** - Append specific elements in order

#### Documentation
- Comprehensive [Bulk Element Creation Guide](documentation/BULK-ELEMENT-CREATION-GUIDE.md) (1,500+ lines)
- Complete API reference with all methods and parameters
- 6 detailed usage examples (forms, cards, modals, navigation, etc.)
- 4 advanced techniques (conditional creation, templates, nested components, event-driven updates)
- 10 best practices for clean, maintainable code
- 10 common troubleshooting scenarios with solutions
- Interactive test file with 5 live examples

### Changed
- Updated README.md with bulk element creation documentation
- Enhanced package description to include bulk creation feature
- Updated version from 2.2.1 to 2.3.0

### Improved
- Element configuration now supports comprehensive property types:
  - Style objects with camelCase properties
  - ClassList manipulation (add, remove, toggle, replace)
  - Attributes (both object and array formats)
  - Dataset attributes
  - Event listeners (single or multiple)
  - Any DOM property or method

## [2.2.1] - 2024-12-XX

### Fixed
- Fine-grained update system improvements
- Cache management optimizations
- Event listener deduplication enhancements

### Changed
- Performance optimizations for element access
- Improved error handling and warnings

## [2.2.0] - 2024-11-XX

### Added
- Fine-grained control system for DOM updates
- Intelligent change detection to minimize DOM writes
- Event listener auto-deduplication
- Granular style updates (only changed properties)

### Improved
- 70% reduction in unnecessary DOM operations
- Better memory management
- Enhanced caching mechanisms

## [2.1.0] - 2024-10-XX

### Added
- Collections helper for class/tag/name-based access
- Selector helper with CSS selector support
- Scoped query methods
- Utility methods for collections (first, last, at, visible, hidden, etc.)

### Changed
- Modular architecture improvements
- CDN distribution enhancements

## [2.0.0] - 2024-09-XX

### Added
- Universal `.update()` method for all elements and collections
- Intelligent caching system
- Auto-cleanup on page unload
- Comprehensive error handling

### Changed
- **BREAKING**: Redesigned API for better developer experience
- **BREAKING**: Changed module structure

### Removed
- **BREAKING**: Deprecated old API methods

## [1.x.x] - 2024-XX-XX

### Initial Releases
- Core DOM manipulation utilities
- Basic element access helpers
- Event handling utilities

---

## Upgrade Guide

### Upgrading to 2.3.0 from 2.2.x

No breaking changes! The bulk element creation feature is an addition to the existing API.

#### New Feature Usage

```javascript
// New bulk creation feature
const elements = createElement.bulk({
    H1: { textContent: 'Title' },
    P: { textContent: 'Description' },
    BUTTON: { textContent: 'Click Me' }
});

// Access elements
elements.H1      // The H1 element
elements.all     // Array of all elements

// Append to DOM
document.body.append(...elements.all);
```

#### CDN Update

Update your CDN link to use the latest version:

```html
<!-- Update from 2.2.1 to 2.3.0 -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>

<!-- Or use @latest for automatic updates -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@latest/dist/dom-helpers.min.js"></script>
```

#### NPM Update

```bash
npm update @giovanni1707/dom-helpers
```

---

## Migration Guides

### From 1.x to 2.x

Please refer to the [migration guide](documentation/MIGRATION-1x-TO-2x.md) for detailed instructions.

---

## Support

- 📖 [Documentation](https://github.com/giovanni1707/dom-helpers-js)
- 🐛 [Report Issues](https://github.com/giovanni1707/dom-helpers-js/issues)
- 💬 [Discussions](https://github.com/giovanni1707/dom-helpers-js/discussions)
- 💖 [Sponsor](https://github.com/sponsors/giovanni1707)

---

**Legend:**
- 🎉 New Feature
- ✨ Enhancement
- 🐛 Bug Fix
- 🔒 Security
- 📖 Documentation
- ⚠️ Deprecation
- 💥 Breaking Change
