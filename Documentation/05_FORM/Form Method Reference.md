# DOM Helpers Form Library - Complete Method Reference

Based on the `dom-helpers-form.js` library, here's a comprehensive list of all available methods:

## **Forms API (Main Interface)**

### Global Forms Object Access
1. **`Forms[formId]`** - Access form by ID using proxy (e.g., `Forms.loginForm`)
2. **`Forms.helper`** - Access to the ProductionFormsHelper instance
3. **`Forms.stats()`** - Get Forms system statistics
4. **`Forms.clear()`** - Clear the Forms cache
5. **`Forms.destroy()`** - Destroy the Forms helper
6. **`Forms.getAllForms()`** - Get all forms with IDs in the document
7. **`Forms.validateAll(rules)`** - Validate all forms with optional rules
8. **`Forms.resetAll()`** - Reset all forms
9. **`Forms.configure(options)`** - Configure Forms system options

---

## **Enhanced Form Element Methods**

When a form is accessed via `Forms[formId]`, it gets enhanced with these methods:

### Form Values
10. **`form.values`** - Getter/setter for all form values as an object
11. **`form.getField(name)`** - Get a specific form field by name or ID
12. **`form.setField(name, value)`** - Set a specific form field value

### Validation
13. **`form.validate(rules)`** - Validate form with optional custom rules
14. **`form.clearValidation()`** - Clear all validation messages

### Submission
15. **`form.submitData(options)`** - Submit form data with enhanced options (async)
16. **`form.serialize(format)`** - Serialize form data in different formats

### Form Control
17. **`form.reset(options)`** - Enhanced reset method with options
18. **`form.update(updates)`** - Form-aware update method with special properties

---

## **ProductionFormsHelper Class Methods**

### Public Methods
19. **`helper.getStats()`** - Get detailed statistics (hits, misses, cache size, hit rate, uptime)
20. **`helper.clearCache()`** - Manually clear the cache
21. **`helper.destroy()`** - Destroy the helper and cleanup resources
22. **`helper.getAllForms()`** - Get array of all enhanced forms
23. **`helper.validateAll(rules)`** - Validate all forms with rules object
24. **`helper.resetAll()`** - Reset all forms in the document

### Private/Internal Methods (prefixed with `_`)
25. **`helper._initProxy()`** - Initialize the proxy for Forms object
26. **`helper._getForm(prop)`** - Get form by ID with caching
27. **`helper._hasForm(prop)`** - Check if form exists
28. **`helper._getKeys()`** - Get all form IDs
29. **`helper._enhanceForm(form)`** - Enhance form element with methods
30. **`helper._addToCache(id, form)`** - Add form to cache
31. **`helper._initMutationObserver()`** - Initialize DOM mutation observer
32. **`helper._processMutations(mutations)`** - Process DOM mutations
33. **`helper._scheduleCleanup()`** - Schedule automatic cleanup
34. **`helper._performCleanup()`** - Perform cache cleanup
35. **`helper._log(message)`** - Log message (if logging enabled)
36. **`helper._warn(message)`** - Log warning (if logging enabled)

---

## **Standalone Utility Functions**

These are internal functions used by the library:

### Form Enhancement
37. **`enhanceFormWithFormMethods(form)`** - Add form-specific functionality to form element
38. **`createFormUpdateMethod(form)`** - Create form-aware update method

### Form Values
39. **`getFormValues(form)`** - Extract all form values as an object
40. **`setFormValues(form, values)`** - Set multiple form values from object
41. **`getFormField(form, name)`** - Get specific form field
42. **`setFormField(form, name, value)`** - Set specific form field value
43. **`setFieldValue(field, value)`** - Set individual field value based on type

### Validation
44. **`validateForm(form, rules)`** - Validate form with rules
45. **`markFieldInvalid(field, message)`** - Mark field as invalid with error message
46. **`clearFormValidation(form)`** - Clear all validation messages

### Submission & Serialization
47. **`submitFormData(form, options)`** - Submit form data with fetch (async)
48. **`serializeForm(form, format)`** - Serialize form in different formats

---

## **Form Update Method - Special Properties**

When using `form.update()`, these special properties are available:

49. **`updates.values`** - Set form values from object
50. **`updates.validate`** - Trigger validation (boolean or rules object)
51. **`updates.reset`** - Reset form (boolean or options object)
52. **`updates.submit`** - Submit form (boolean or options object)
53. **`updates.addEventListener`** - Add event listeners

---

## **Form Validation Rules**

When using `form.validate(rules)`, these built-in rule types are supported:

54. **`required`** - Field is required
55. **`minLength`** - Minimum string length
56. **`maxLength`** - Maximum string length
57. **`pattern`** - RegExp pattern matching
58. **`email`** - Email format validation
59. **`custom`** - Custom validation function

---

## **Form Serialization Formats**

When using `form.serialize(format)`, these formats are available:

60. **`'object'`** - Plain JavaScript object (default)
61. **`'json'`** - JSON string
62. **`'formdata'`** - FormData object
63. **`'urlencoded'`** - URL-encoded string

---

## **Submit Options Object Properties**

When using `form.submitData(options)`, these options are available:

64. **`url`** - Submission URL
65. **`method`** - HTTP method
66. **`validate`** - Enable validation before submit
67. **`validationRules`** - Custom validation rules
68. **`beforeSubmit`** - Callback before submission
69. **`onSuccess`** - Success callback
70. **`onError`** - Error callback
71. **`transform`** - Data transformation function

---

## **Configuration Options**

When using `Forms.configure(options)`, these options are available:

72. **`enableLogging`** - Enable console logging
73. **`autoCleanup`** - Enable automatic cache cleanup
74. **`cleanupInterval`** - Cleanup interval in milliseconds
75. **`maxCacheSize`** - Maximum cache size
76. **`autoValidation`** - Enable automatic validation

---

## **Form Properties**

Enhanced forms have these special properties:

77. **`form.values`** - Get/set all form values (getter/setter property)
78. **`form._hasFormMethods`** - Internal flag indicating form is enhanced
79. **`form._isEnhancedForm`** - Internal flag indicating full enhancement

---

## **Statistics Object Properties**

The `Forms.stats()` method returns an object with:

80. **`hits`** - Cache hit count
81. **`misses`** - Cache miss count
82. **`cacheSize`** - Current cache size
83. **`lastCleanup`** - Timestamp of last cleanup
84. **`hitRate`** - Cache hit rate (0-1)
85. **`uptime`** - Time since last cleanup

---

## **Validation Result Object**

The `form.validate()` method returns an object with:

86. **`isValid`** - Boolean indicating if form is valid
87. **`errors`** - Object mapping field names to error messages
88. **`values`** - Current form values

---

## **Custom Events**

The library dispatches these custom events:

89. **`'formreset'`** - Fired when form is reset
90. **`'change'`** - Fired when field values are set programmatically

---

## **Total Count: 90+ Methods/Properties/Features**

- **9 Global Forms API methods**
- **9 Enhanced form element methods**
- **18 ProductionFormsHelper methods** (6 public + 12 private)
- **12 Standalone utility functions**
- **5 Special update properties**
- **6 Validation rule types**
- **4 Serialization formats**
- **8 Submit options**
- **5 Configuration options**
- **3 Form properties**
- **6 Statistics properties**
- **3 Validation result properties**
- **2 Custom events**

The library provides a comprehensive form handling solution with intelligent caching, automatic enhancement, validation, and seamless integration with the DOM Helpers ecosystem!