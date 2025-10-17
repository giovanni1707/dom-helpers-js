# Fix Instructions for dom-helpers.js

## Problem
The file has duplicate `destructure()` methods and the methods `get()`, `exists()`, and `destructure()` are calling `this.Elements[id]` which causes infinite recursion through the proxy.

## Solution
Find these lines in `src/dom-helpers.js` around line 2890-2940:

### 1. Remove these duplicate `destructure()` methods:

Delete these TWO duplicate sections (keep only the FIRST one):

```javascript
    // Enhanced methods for destructuring support
    destructure(...ids) {
      const result = {};
      const missing = [];
      
      ids.forEach(id => {
        const element = this.Elements[id];  // ❌ THIS CAUSES RECURSION
        if (element) {
          result[id] = element;
        } else {
          missing.push(id);
          result[id] = null;
        }
      });
      
      if (missing.length > 0 && this.options.enableLogging) {
        this._warn(`Missing elements during destructuring: ${missing.join(', ')}`);
      }
      
      return result;
    }
```

### 2. Keep ONLY this version (should be around line 2826):

```javascript
    // Enhanced methods for destructuring support
    destructure(...ids) {
      const result = {};
      const missing = [];
      
      ids.forEach(id => {
        const element = this._getElement(id);  // ✅ CORRECT - uses _getElement
        if (element) {
          result[id] = element;
        } else {
          missing.push(id);
          result[id] = null;
        }
      });
      
      if (missing.length > 0 && this.options.enableLogging) {
        this._warn(`Missing elements during destructuring: ${missing.join(', ')}`);
      }
      
      return result;
    }
```

### 3. Also fix these methods in `setProperty`, `getProperty`, `setAttribute`, `getAttribute`:

Find around line 2950 and change:
```javascript
setProperty(id, property, value) {
  const element = this.Elements[id];  // ❌ WRONG
```

To:
```javascript
setProperty(id, property, value) {
  const element = this._getElement(id);  // ✅ CORRECT
```

And similarly for all other methods that use `this.Elements[id]` - change them to `this._getElement(id)`.

## Quick Fix via Text Editor

1. Open `src/dom-helpers.js` in your text editor
2. Search for all occurrences of `this.Elements[id]` (there should be about 4-5)
3. Replace them with `this._getElement(id)`
4. Search for duplicate `destructure(...ids)` methods  
5. Delete the duplicate methods (keep only ONE)
6. Save the file
7. Test again with the test file

## After Applying Fix

Run the test file again:
```
examples/test/elements-methods-test.html
```

All tests should now pass!
