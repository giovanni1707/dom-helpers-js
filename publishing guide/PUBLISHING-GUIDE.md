# Publishing Guide for DOM Helpers

This guide provides step-by-step instructions for publishing new versions of DOM Helpers to npm and creating GitHub releases.

## Table of Contents

1. [Pre-Publishing Checklist](#pre-publishing-checklist)
2. [Version Management](#version-management)
3. [Building for Production](#building-for-production)
4. [Publishing to npm](#publishing-to-npm)
5. [Creating GitHub Release](#creating-github-release)
6. [CDN Verification](#cdn-verification)
7. [Post-Publishing Tasks](#post-publishing-tasks)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Publishing Checklist

Before publishing a new version, ensure all these items are completed:

### Code Quality
- [ ] All new features are fully implemented and tested
- [ ] All existing tests pass
- [ ] No console errors or warnings in test files
- [ ] Code is properly formatted and linted
- [ ] No unused variables or dead code

### Documentation
- [ ] README.md is updated with new features
- [ ] CHANGELOG.md is updated with version changes
- [ ] API documentation is current
- [ ] Code examples are tested and working
- [ ] All documentation links are valid

### Version Files
- [ ] `package.json` version is updated
- [ ] CHANGELOG.md has entry for new version
- [ ] Version number follows semantic versioning

### Test Coverage
- [ ] Feature works in all supported browsers
- [ ] CDN links work correctly
- [ ] npm package installs without errors
- [ ] Example files demonstrate new features

---

## Version Management

### Semantic Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (2.x.0): New features (backward compatible)
- **PATCH** (2.3.x): Bug fixes (backward compatible)

### Current Version: 2.3.0

For the bulk element creation feature (v2.3.0):
- This is a MINOR version bump (new feature, no breaking changes)
- Previous version: 2.2.1
- New version: 2.3.0

### Update Version Number

Update in `package.json`:

```json
{
  "version": "2.3.0"
}
```

---

## Building for Production

### Step 1: Clean Previous Build

```bash
# Remove old build files
rm -rf dist/
```

### Step 2: Run Build Script

```bash
# Build minified files
npm run build
```

This will:
- Create minified versions of all modules
- Generate source maps
- Place files in `dist/` directory

### Step 3: Verify Build Output

Check that these files were created:

```
dist/
├── dom-helpers.min.js
├── dom-helpers-combined.min.js
├── dom-helpers-storage.min.js
├── dom-helpers-form.min.js
├── dom-helpers-animation.min.js
├── dom-helpers-components.min.js
├── dom-helpers-reactive.min.js
└── dom-helpers-async.min.js
```

### Step 4: Test Built Files

Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Build Test</title>
</head>
<body>
    <div id="test"></div>
    
    <script src="dist/dom-helpers.min.js"></script>
    <script>
        // Test basic functionality
        const elements = createElement.bulk({
            H1: { textContent: 'Test' },
            P: { textContent: 'Success!' }
        });
        
        document.getElementById('test').append(...elements.all);
        console.log('Build test passed!');
    </script>
</body>
</html>
```

---

## Publishing to npm

### Prerequisites

1. **npm Account**
   - Create account at [npmjs.com](https://www.npmjs.com/)
   - Verify your email address

2. **Login to npm**
   ```bash
   npm login
   ```
   
   Enter your:
   - Username
   - Password
   - Email
   - One-time password (if 2FA enabled)

3. **Verify Login**
   ```bash
   npm whoami
   ```
   
   Should display your username.

### Publishing Steps

#### Step 1: Final Pre-Publish Check

```bash
# Check what will be published
npm pack --dry-run
```

This shows all files that will be included in the package.

#### Step 2: Test Package Locally

```bash
# Create a tarball
npm pack

# This creates: giovanni1707-dom-helpers-2.3.0.tgz
```

Test the tarball in a separate project:

```bash
cd /path/to/test-project
npm install /path/to/giovanni1707-dom-helpers-2.3.0.tgz
```

#### Step 3: Publish to npm

```bash
# Publish the package
npm publish --access public
```

**Note**: Use `--access public` for scoped packages (@giovanni1707/dom-helpers).

#### Step 4: Verify Publication

1. Check npm website:
   ```
   https://www.npmjs.com/package/@giovanni1707/dom-helpers
   ```

2. Test installation:
   ```bash
   npm install @giovanni1707/dom-helpers
   ```

3. Verify version:
   ```bash
   npm view @giovanni1707/dom-helpers version
   ```

---

## Creating GitHub Release

### Step 1: Commit and Push Changes

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Release v2.3.0: Add bulk element creation feature"

# Push to main branch
git push origin main
```

### Step 2: Create Git Tag

```bash
# Create annotated tag
git tag -a v2.3.0 -m "Version 2.3.0: Bulk Element Creation"

# Push tag to GitHub
git push origin v2.3.0
```

### Step 3: Create GitHub Release

#### Option A: Via GitHub Website

1. Go to your repository: `https://github.com/giovanni1707/dom-helpers-js`
2. Click on **"Releases"** in the right sidebar
3. Click **"Draft a new release"**
4. Fill in the release form:

   **Tag version:** `v2.3.0` (select existing tag)
   
   **Release title:** `v2.3.0 - Bulk Element Creation`
   
   **Description:**
   ```markdown
   ## 🎉 What's New in v2.3.0

   ### Bulk Element Creation
   
   Create multiple DOM elements in a single declarative call with the new `createElement.bulk()` method!
   
   ```javascript
   const elements = createElement.bulk({
       H1: { textContent: 'Welcome!', style: { color: '#333' } },
       P: { textContent: 'Description', style: { fontSize: '16px' } },
       BUTTON: { textContent: 'Click Me' }
   });
   
   document.body.append(...elements.all);
   ```
   
   ### Key Features
   
   - ✨ Create multiple elements with one function call
   - 🎯 Support for numbered instances (DIV_1, DIV_2, etc.)
   - 🔄 Rich API with helper methods (`.all`, `.ordered()`, `.appendTo()`, etc.)
   - 📦 Seamless integration with existing DOM Helpers features
   - 🚀 70-80% less boilerplate code
   
   ### New API Methods
   
   - `createElement.bulk(definitions)` - Main creation function
   - `createElement.update(definitions)` - Alias for bulk creation
   - `.all` - Get all elements as array
   - `.toArray(...keys)` - Get specific elements
   - `.ordered(...keys)` - Custom order retrieval
   - `.updateMultiple(updates)` - Batch updates
   - `.appendTo(container)` - Bulk append
   - Plus many more utility methods!
   
   ### Documentation
   
   - 📖 [Complete Bulk Element Creation Guide](documentation/BULK-ELEMENT-CREATION-GUIDE.md)
   - 🎮 [Interactive Examples](examples/test/bulk-element-creation-test.html)
   - 📝 [API Reference](documentation/API-REFERENCE.md)
   
   ### Installation
   
   **npm:**
   ```bash
   npm install @giovanni1707/dom-helpers@2.3.1
   ```
   
   **CDN:**
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
   ```
   
   ### Upgrade Notes
   
   ✅ **No breaking changes** - This is a backward-compatible feature addition.
   
   All existing code will continue to work. The new bulk creation feature is opt-in.
   
   ### Full Changelog
   
   See [CHANGELOG.md](CHANGELOG.md) for complete details.
   
   ---
   
   **Thank you** to all contributors and users! 🙏
   
   💖 [Support this project](https://github.com/sponsors/giovanni1707)
   ```

5. **Attach Files** (optional):
   - Upload the npm tarball: `giovanni1707-dom-helpers-2.3.0.tgz`
   - Upload example HTML files if desired

6. Check **"Set as the latest release"**

7. Click **"Publish release"**

#### Option B: Via GitHub CLI

```bash
# Create release with gh CLI
gh release create v2.3.0 \
  --title "v2.3.0 - Bulk Element Creation" \
  --notes-file RELEASE_NOTES.md \
  --latest
```

### Step 4: Verify Release

1. Check release page:
   ```
   https://github.com/giovanni1707/dom-helpers-js/releases/tag/v2.3.0
   ```

2. Verify it appears in releases list

3. Check that tag is correctly linked

---

## CDN Verification

After publishing to npm, CDN services will automatically pick up the new version.

### Test jsDelivr CDN

Wait 5-10 minutes after npm publish, then test:

```html
<!DOCTYPE html>
<html>
<head>
    <title>CDN Test</title>
</head>
<body>
    <div id="test"></div>
    
    <!-- Test version-specific URL -->
    <script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
    
    <script>
        // Verify bulk creation works
        const elements = createElement.bulk({
            H1: { textContent: 'CDN Test Passed!' },
            P: { textContent: 'Version 2.3.0 is live!' }
        });
        
        document.getElementById('test').append(...elements.all);
        console.log('✅ CDN test successful!');
    </script>
</body>
</html>
```

### Verify CDN URLs

Test all these URLs:

```html
<!-- Version-specific -->
https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js

<!-- Latest version -->
https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@latest/dist/dom-helpers.min.js

<!-- GitHub CDN -->
https://cdn.jsdelivr.net/gh/giovanni1707/dom-helpers-js@main/dist/dom-helpers.min.js

<!-- Tag-specific GitHub CDN -->
https://cdn.jsdelivr.net/gh/giovanni1707/dom-helpers-js@v2.3.0/dist/dom-helpers.min.js
```

### Purge CDN Cache (if needed)

If CDN isn't updating:

1. Visit: `https://www.jsdelivr.com/tools/purge`
2. Enter your package URL
3. Click "Purge"

---

## Post-Publishing Tasks

### 1. Update Documentation Links

Ensure all README and documentation links point to correct version:

```markdown
<!-- Update version numbers in README.md -->
<script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@2.3.1/dist/dom-helpers.min.js"></script>
```

### 2. Announce the Release

**Twitter/X:**
```
🎉 DOM Helpers v2.3.0 is here!

✨ New: Bulk Element Creation
Create multiple DOM elements in one call!

const elements = createElement.bulk({
  H1: { textContent: 'Hello!' },
  P: { textContent: 'World!' }
});

📖 https://github.com/giovanni1707/dom-helpers-js

#JavaScript #WebDev #DOM
```

**Dev.to / Medium:**
Write a blog post about the new feature with examples.

**GitHub Discussions:**
Create announcement post in discussions tab.

### 3. Update Project Website (if applicable)

Update any project website or demo pages with new version and examples.

### 4. Monitor for Issues

- Watch GitHub issues for bug reports
- Monitor npm download stats
- Check CDN access logs if available

---

## Troubleshooting

### npm Publish Fails

**Error: "You do not have permission to publish"**
```bash
# Verify you're logged in
npm whoami

# Check package name isn't taken
npm view @giovanni1707/dom-helpers

# Ensure you have access
npm access ls-packages
```

**Error: "Version already exists"**
```bash
# Bump version number
npm version patch  # or minor, or major

# Then publish again
npm publish --access public
```

### GitHub Release Issues

**Tag already exists:**
```bash
# Delete local tag
git tag -d v2.3.0

# Delete remote tag
git push origin :refs/tags/v2.3.0

# Create new tag
git tag -a v2.3.0 -m "Version 2.3.0"
git push origin v2.3.0
```

**Release not showing up:**
- Wait a few minutes for GitHub to process
- Check repository visibility settings
- Verify tag was pushed successfully

### CDN Not Updating

**jsDelivr cache:**
- Wait 12-24 hours for automatic update
- Use purge tool: https://www.jsdelivr.com/tools/purge
- Try version-specific URL first

**GitHub CDN:**
- Ensure files are in correct directory
- Check file paths match exactly
- Verify tag name is correct

---

## Quick Reference Commands

```bash
# Version bump
npm version patch   # 2.3.0 → 2.3.1
npm version minor   # 2.3.0 → 2.4.0
npm version major   # 2.3.0 → 3.0.0

# Build
npm run build

# Publish
npm publish --access public

# Git operations
git add .
git commit -m "Release v2.3.0"
git push origin main
git tag -a v2.3.0 -m "Version 2.3.0"
git push origin v2.3.0

# GitHub CLI
gh release create v2.3.0 --title "v2.3.0" --notes-file RELEASE_NOTES.md
```

---

## Checklist Template

Use this checklist for each release:

```markdown
## Pre-Release
- [ ] All features implemented
- [ ] Tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Build generated (npm run build)
- [ ] Build tested locally

## Publishing
- [ ] Logged into npm
- [ ] npm pack tested
- [ ] npm publish executed
- [ ] npm package verified

## GitHub
- [ ] Changes committed
- [ ] Changes pushed
- [ ] Git tag created
- [ ] Git tag pushed
- [ ] GitHub release created
- [ ] Release notes complete

## Verification
- [ ] npm package installs
- [ ] CDN URLs work (wait 10 min)
- [ ] Documentation links valid
- [ ] Example files work

## Post-Release
- [ ] Announcement posted
- [ ] Issues monitored
- [ ] Download stats checked
```

---

## Support

If you encounter issues during publishing:

1. Check this guide thoroughly
2. Search existing GitHub issues
3. Create new issue with details
4. Contact maintainers

---

**Last Updated:** January 10, 2025  
**Current Version:** 2.3.0
