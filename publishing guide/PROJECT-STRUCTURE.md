# DOM Helpers Project Structure

This document describes the professional folder structure of the DOM Helpers project.

## Directory Structure

```
DOM-helpers-js/
├── src/                          # Source files
│   ├── dom-helpers.js           # Core DOM manipulation library
│   ├── dom-helpers-storage.js   # Storage utilities
│   ├── dom-helpers-form.js      # Form handling utilities
│   ├── dom-helpers-animation.js # Animation utilities
│   ├── dom-helpers-components.js # Component system
│   ├── dom-helpers-reactive.js  # Reactive state management
│   ├── dom-helpers-async.js     # Async utilities
│   └── dom-helpers-combined.js  # Combined build (auto-generated)
│
├── dist/                         # Built/minified files (auto-generated)
│   ├── dom-helpers.min.js
│   ├── dom-helpers-storage.min.js
│   ├── dom-helpers-form.min.js
│   ├── dom-helpers-animation.min.js
│   ├── dom-helpers-components.min.js
│   ├── dom-helpers-reactive.min.js
│   ├── dom-helpers-async.min.js
│   └── dom-helpers-combined.min.js
│
├── docs/                         # Documentation
│   ├── README.md                # Main documentation
│   ├── API-REFERENCE.md         # Complete API reference
│   ├── QUICK-START-GUIDE.md     # Getting started guide
│   ├── COMPONENT-LIBRARY-GUIDE.md
│   ├── PERFORMANCE-OPTIMIZATION-GUIDE.md
│   ├── README-animation.md      # Animation module docs
│   ├── README-async.md          # Async module docs
│   ├── README-components.md     # Components module docs
│   ├── README-components-update.md
│   ├── README-form.md           # Form module docs
│   ├── README-reactive.md       # Reactive module docs
│   └── README-storage.md        # Storage module docs
│
├── examples/                     # Example implementations
│   └── test/                    # Test examples
│       ├── *.html              # Various test files
│       ├── Async Example/
│       └── Components/
│
├── build/                        # Build artifacts (if any)
│
├── .git/                         # Git repository
├── .gitignore                    # Git ignore rules
├── .npmignore                    # NPM ignore rules
├── build.js                      # Build script
├── LICENSE                       # MIT License
├── package.json                  # NPM package configuration
├── PUBLISHING-GUIDE.md          # Publishing instructions
├── PROJECT-STRUCTURE.md         # This file
└── README.md                     # Main project README
```

## Folder Purposes

### `/src`
Contains all source code files. These are the main development files that are:
- Readable and well-commented
- Used for development and debugging
- Combined and minified during the build process

### `/dist`
Contains production-ready, minified versions of the library:
- Generated automatically by the build script
- Optimized for performance (smaller file sizes)
- Ready for CDN or production use
- Should not be edited manually

### `/docs`
Contains all documentation files:
- API references
- User guides
- Module-specific documentation
- Keep documentation organized and easy to find

### `/examples`
Contains example implementations and test files:
- Demonstrates library usage
- Useful for testing features
- Reference for developers
- Not included in NPM package

## Build Process

The build process is defined in `build.js` and performs the following:

1. Reads all source files from `/src`
2. Combines them into `dom-helpers-combined.js`
3. Minifies each individual file to `/dist` with `.min.js` extension
4. Minifies the combined file as well

### Running the Build

```bash
npm run build
```

## NPM Package Configuration

The `package.json` is configured to include:
- All source files from `/src/**/*.js`
- All minified files from `/dist/**/*.min.js`
- README.md and LICENSE

Files in `/examples` and `/docs` (except main README.md) are excluded from the NPM package to keep it lightweight.

## Development Workflow

1. **Development**: Edit files in `/src`
2. **Testing**: Use files in `/examples` to test your changes
3. **Documentation**: Update relevant files in `/docs`
4. **Build**: Run `npm run build` to generate minified files
5. **Commit**: Commit both source and built files
6. **Publish**: Run `npm publish` (build runs automatically via prepublishOnly)

## Git Workflow

- Source files (`/src`) are tracked
- Built files (`/dist`) are tracked (for NPM publishing)
- Examples (`/examples`) are tracked (for reference)
- Docs (`/docs`) are tracked
- node_modules and other temporary files are ignored via `.gitignore`

## Benefits of This Structure

1. **Clear Separation**: Source, build, docs, and examples are clearly separated
2. **Professional**: Follows industry-standard conventions
3. **Maintainable**: Easy to find and update files
4. **Scalable**: Can easily add new modules or documentation
5. **Build-Ready**: Automated build process works seamlessly
6. **NPM-Ready**: Proper configuration for publishing to NPM registry
