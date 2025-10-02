# Publishing to NPM - Complete Guide

This guide walks you through the complete process of publishing your DOM Helpers library to npm.

## 📋 Prerequisites

Before publishing to npm, ensure you have:

1. **npm Account**
   - Create account at https://www.npmjs.com/signup
   - Verify your email address

2. **npm CLI Installed**
   ```bash
   npm --version
   ```
   If not installed, install Node.js from https://nodejs.org

3. **Git Repository**
   - Code pushed to GitHub: https://github.com/giovanni1707/dom-helpers-js
   - Clean working directory (all changes committed)

## 🎯 Pre-Publication Checklist

### 1. Update package.json

Replace placeholder values in `package.json`:

```json
{
  "name": "@yourusername/dom-helpers",  // ⚠️ Change to your npm username
  "version": "1.0.0",                   // ⚠️ Semantic versioning
  "author": "Your Name <your.email@example.com>",  // ⚠️ Your details
}
```

**Important Notes:**
- For scoped packages (`@username/package`): Requires npm paid account OR publish as public
- For unscoped packages: Use `"name": "dom-helpers-yourname"` to avoid name conflicts
- Version follows semver: MAJOR.MINOR.PATCH (1.0.0)

### 2. Update LICENSE

Replace placeholder in `LICENSE` file:

```
Copyright (c) 2025 Your Name  // ⚠️ Change to your name
```

### 3. Install Dependencies

```bash
npm install
```

This installs `terser` required for the build process.

### 4. Test Build Process

```bash
npm run build
```

This should:
- Create `dom-helpers-combined.js`
- Create minified versions in `helpers-min/` directory
- Display success messages

Verify output:
```bash
# Check combined file was created
ls -la dom-helpers-combined.js

# Check minified files
ls -la helpers-min/
```

### 5. Test Package Locally

Before publishing, test the package locally:

```bash
# Create a tarball of your package
npm pack

# This creates: yourusername-dom-helpers-1.0.0.tgz
```

Install in a test project:
```bash
# In another directory
mkdir test-dom-helpers
cd test-dom-helpers
npm init -y
npm install /path/to/yourusername-dom-helpers-1.0.0.tgz

# Test the import
node -e "const { Elements } = require('@yourusername/dom-helpers'); console.log(Elements);"
```

## 🚀 Publishing Steps

### Step 1: Login to npm

```bash
npm login
```

Enter your:
- Username
- Password
- Email (public)
- One-time password (if 2FA enabled)

Verify login:
```bash
npm whoami
```

### Step 2: Verify Package Contents

Check what will be included in the package:

```bash
npm pack --dry-run
```

This shows all files that will be published. Verify:
- ✅ Source files (.js files) are included
- ✅ Minified files (helpers-min/) are included
- ✅ README.md is included
- ✅ LICENSE is included
- ❌ Examples_Test/ is excluded
- ❌ node_modules/ is excluded
- ❌ .git/ is excluded

### Step 3: Publish (First Time)

For **scoped packages** (e.g., `@yourusername/dom-helpers`):

```bash
# Public package (free)
npm publish --access public

# Private package (requires paid account)
npm publish
```

For **unscoped packages** (e.g., `dom-helpers-yourname`):

```bash
npm publish
```

### Step 4: Verify Publication

1. Check npm website:
   ```
   https://www.npmjs.com/package/@yourusername/dom-helpers
   ```

2. Test installation:
   ```bash
   npm install @yourusername/dom-helpers
   ```

## 🔄 Publishing Updates

### Updating Version Numbers

Follow semantic versioning (semver):

- **Patch** (1.0.0 → 1.0.1): Bug fixes, no API changes
  ```bash
  npm version patch
  ```

- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
  ```bash
  npm version minor
  ```

- **Major** (1.0.0 → 2.0.0): Breaking changes
  ```bash
  npm version major
  ```

This automatically:
- Updates version in package.json
- Creates a git commit
- Creates a git tag

### Publishing Updates

```bash
# 1. Update version
npm version patch  # or minor/major

# 2. Push changes and tags to GitHub
git push
git push --tags

# 3. Publish to npm
npm publish --access public
```

## 📦 Package.json Configuration Explained

### Essential Fields

```json
{
  "name": "@yourusername/dom-helpers",
  // Package name - must be unique on npm
  
  "version": "1.0.0",
  // Current version - follows semver
  
  "description": "A powerful, high-performance vanilla JavaScript...",
  // Shows on npm search results
  
  "main": "dom-helpers.js",
  // Entry point for require()
  
  "module": "dom-helpers.js",
  // Entry point for ES6 imports
  
  "files": [
    // Files to include in package
    "dom-helpers.js",
    "dom-helpers-*.js",
    "helpers-min/*.min.js",
    "README.md",
    "LICENSE"
  ],
  
  "keywords": [
    // For npm search - be descriptive
    "dom", "dom-manipulation", "vanilla-javascript"
  ],
  
  "repository": {
    // Link to your GitHub repo
    "type": "git",
    "url": "git+https://github.com/giovanni1707/dom-helpers-js.git"
  }
}
```

### Scripts

```json
{
  "scripts": {
    "build": "node build.js",
    // Builds minified versions
    
    "prepublishOnly": "npm run build",
    // Automatically runs before publish
    
    "test": "echo \"Error: no test specified\" && exit 1"
    // Add tests later
  }
}
```

## 🛡️ Security Best Practices

### 1. Enable 2FA (Two-Factor Authentication)

```bash
npm profile enable-2fa auth-and-writes
```

This requires OTP for:
- Login
- Publishing packages
- Changing settings

### 2. Use .npmignore

Already configured to exclude:
- Test files
- Examples
- Development files
- Git files

### 3. Review Published Package

After publishing, download and inspect:

```bash
npm pack @yourusername/dom-helpers
tar -xzf yourusername-dom-helpers-1.0.0.tgz
cd package
ls -la
```

## 📊 Post-Publication

### 1. Update GitHub

Add npm badge to GitHub README:

```markdown
[![npm version](https://img.shields.io/npm/v/@yourusername/dom-helpers.svg)](https://www.npmjs.com/package/@yourusername/dom-helpers)
```

### 2. Create Release on GitHub

```bash
git tag v1.0.0
git push --tags
```

Then create release on GitHub with changelog.

### 3. Monitor

- Check npm stats: https://www.npmjs.com/package/@yourusername/dom-helpers
- Monitor downloads
- Respond to issues

## 🔧 Troubleshooting

### Error: "You do not have permission to publish"

**Solution:**
```bash
# Check you're logged in
npm whoami

# Check package name isn't taken
npm search @yourusername/dom-helpers

# For scoped packages, add --access public
npm publish --access public
```

### Error: "Package name already exists"

**Solution:**
1. Choose different name
2. Or use scoped package: `@yourusername/dom-helpers`

### Error: "No README data"

**Solution:**
Ensure README.md is in package root and listed in files array.

### Build fails before publish

**Solution:**
```bash
# Ensure terser is installed
npm install --save-dev terser

# Test build manually
npm run build
```

## 📝 Quick Reference Commands

```bash
# Setup
npm login                              # Login to npm
npm whoami                            # Verify login

# Testing
npm pack --dry-run                    # Preview package contents
npm pack                              # Create local tarball
npm run build                         # Build minified files

# Publishing
npm publish --access public           # Publish scoped package
npm publish                           # Publish unscoped package

# Updating
npm version patch                     # Bump version (bug fixes)
npm version minor                     # Bump version (new features)
npm version major                     # Bump version (breaking changes)
git push && git push --tags          # Push to GitHub
npm publish --access public           # Publish update

# Maintenance
npm unpublish @yourusername/dom-helpers@1.0.0  # Unpublish specific version
npm deprecate @yourusername/dom-helpers@1.0.0 "message"  # Deprecate version
```

## 🎯 Final Checklist

Before publishing, ensure:

- [ ] Updated `name` in package.json with your username
- [ ] Updated `author` in package.json
- [ ] Updated copyright in LICENSE file
- [ ] Ran `npm install` successfully
- [ ] Ran `npm run build` successfully
- [ ] Verified minified files in helpers-min/
- [ ] Tested with `npm pack`
- [ ] Logged into npm (`npm login`)
- [ ] Verified you're logged in (`npm whoami`)
- [ ] Committed all changes to git
- [ ] Ready to run `npm publish --access public`

## 🎉 You're Ready!

Once all checkboxes are complete, run:

```bash
npm publish --access public
```

Congratulations! Your package is now on npm! 🚀

---

For questions or issues, refer to:
- npm documentation: https://docs.npmjs.com/
- npm support: https://www.npmjs.com/support
- Your GitHub repository: https://github.com/giovanni1707/dom-helpers-js
