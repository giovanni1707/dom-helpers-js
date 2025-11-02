# DOM Helpers Async Library - Complete Method Reference

Based on the `dom-helpers-async.js` library, here's a comprehensive list of all available methods:

## **AsyncModule API (Main Interface)**

### Core Access
1. **`AsyncHelpers`** - Global access to the entire AsyncModule
2. **`AsyncModule.version`** - Get library version
3. **`AsyncModule.isDOMHelpersAvailable()`** - Check if DOM Helpers is available
4. **`AsyncModule.integrate()`** - Manually integrate with DOM Helpers
5. **`AsyncModule.configure(options)`** - Configure default options

---

## **Core Async Utilities**

### Timing & Control Flow
6. **`debounce(func, delay, options)`** - Delay execution until after delay has passed since last call
7. **`debounced.cancel()`** - Cancel pending debounced execution
8. **`debounced.flush(...args)`** - Immediately execute pending debounced function
9. **`throttle(func, delay, options)`** - Ensure function is called at most once per delay period
10. **`throttled.cancel()`** - Cancel throttled execution
11. **`sleep(ms)`** - Async delay/sleep utility (returns Promise)

### Security
12. **`sanitize(input, options)`** - Sanitize input for XSS protection

---

## **Fetch Utilities**

### Enhanced Fetch
13. **`enhancedFetch(url, options)`** - Enhanced fetch with retries, timeout, and callbacks (async)
14. **`fetchJSON(url, options)`** - Fetch and parse JSON response (async)
15. **`fetchText(url, options)`** - Fetch text response (async)
16. **`fetchBlob(url, options)`** - Fetch blob response (async)

### Fetch Aliases
17. **`AsyncModule.fetch(url, options)`** - Alias for enhancedFetch
18. **`AsyncModule.fetchJSON(url, options)`** - Alias for fetchJSON
19. **`AsyncModule.fetchText(url, options)`** - Alias for fetchText
20. **`AsyncModule.fetchBlob(url, options)`** - Alias for fetchBlob

---

## **Form Utilities**

### Form Handling
21. **`asyncHandler(handler, options)`** - Async event handler wrapper with loading states
22. **`validateForm(form, rules)`** - Form validation utility
23. **`getFormData(form, options)`** - Extract form data as object
24. **`showFormMessage(form, message, type, options)`** - Show form message utility

---

## **Parallel Request Management**

25. **`parallelAll(promises, options)`** - Enhanced Promise.all with progress tracking (async)
26. **`raceWithTimeout(promises, timeout)`** - Promise race with timeout (async)

---

## **Global Shortcuts**

When loaded in browser, these are available globally:

27. **`window.debounce`** - Global debounce function
28. **`window.throttle`** - Global throttle function
29. **`window.sanitize`** - Global sanitize function

---

## **Extended Elements API**

When integrated with DOM Helpers Elements:

30. **`Elements.debounce`** - Debounce utility
31. **`Elements.throttle`** - Throttle utility
32. **`Elements.sanitize`** - Sanitize utility
33. **`Elements.sleep`** - Sleep utility
34. **`Elements.fetch`** - Enhanced fetch
35. **`Elements.fetchJSON`** - Fetch JSON
36. **`Elements.fetchText`** - Fetch text
37. **`Elements.fetchBlob`** - Fetch blob
38. **`Elements.asyncHandler`** - Async handler wrapper
39. **`Elements.validateForm(form, rules)`** - Validate form
40. **`Elements.getFormData(form, options)`** - Get form data
41. **`Elements.showFormMessage(form, message, type, options)`** - Show form message
42. **`Elements.parallelAll`** - Parallel promises
43. **`Elements.raceWithTimeout`** - Race with timeout

---

## **Extended Collections API**

When integrated with DOM Helpers Collections:

44. **`Collections.debounce`** - Debounce utility
45. **`Collections.throttle`** - Throttle utility
46. **`Collections.sanitize`** - Sanitize utility
47. **`Collections.sleep`** - Sleep utility
48. **`Collections.fetch`** - Enhanced fetch
49. **`Collections.fetchJSON`** - Fetch JSON
50. **`Collections.fetchText`** - Fetch text
51. **`Collections.fetchBlob`** - Fetch blob
52. **`Collections.asyncHandler`** - Async handler wrapper
53. **`Collections.parallelAll`** - Parallel promises
54. **`Collections.raceWithTimeout`** - Race with timeout

---

## **Extended Selector API**

When integrated with DOM Helpers Selector:

55. **`Selector.debounce`** - Debounce utility
56. **`Selector.throttle`** - Throttle utility
57. **`Selector.sanitize`** - Sanitize utility
58. **`Selector.sleep`** - Sleep utility
59. **`Selector.fetch`** - Enhanced fetch
60. **`Selector.fetchJSON`** - Fetch JSON
61. **`Selector.fetchText`** - Fetch text
62. **`Selector.fetchBlob`** - Fetch blob
63. **`Selector.asyncHandler`** - Async handler wrapper
64. **`Selector.parallelAll`** - Parallel promises
65. **`Selector.raceWithTimeout`** - Race with timeout

---

## **Enhanced Form Element Methods**

When Forms module is loaded and integrated:

66. **`formElement.validate(rules)`** - Validate the form
67. **`formElement.getData(options)`** - Get form data as object
68. **`formElement.showMessage(message, type, options)`** - Show message in form
69. **`formElement.submitAsync(options)`** - Submit form asynchronously with validation

---

## **Debounce Options**

When using `debounce(func, delay, options)`:

70. **`immediate`** - Execute on leading edge instead of trailing
71. **`maxWait`** - Maximum time to wait before forcing execution

---

## **Throttle Options**

When using `throttle(func, delay, options)`:

72. **`leading`** - Execute on leading edge (default: true)
73. **`trailing`** - Execute on trailing edge (default: true)

---

## **Sanitize Options**

When using `sanitize(input, options)`:

74. **`allowedTags`** - Array of allowed HTML tags
75. **`allowedAttributes`** - Array of allowed attributes
76. **`removeScripts`** - Remove script tags (default: true)
77. **`removeEvents`** - Remove event attributes (default: true)
78. **`removeStyles`** - Remove style attributes (default: false)

---

## **Enhanced Fetch Options**

When using `enhancedFetch(url, options)`:

79. **`method`** - HTTP method (default: 'GET')
80. **`headers`** - Request headers object
81. **`body`** - Request body (string or object)
82. **`timeout`** - Request timeout in ms (default: 10000)
83. **`retries`** - Number of retry attempts (default: 0)
84. **`retryDelay`** - Delay between retries in ms (default: 1000)
85. **`loadingIndicator`** - Element to show/hide during request
86. **`onSuccess`** - Success callback function
87. **`onError`** - Error callback function
88. **`onStart`** - Callback when request starts
89. **`onFinally`** - Callback that always runs after request
90. **`signal`** - AbortController signal

---

## **AsyncHandler Options**

When using `asyncHandler(handler, options)`:

91. **`errorHandler`** - Custom error handler function
92. **`loadingClass`** - CSS class to add during loading (default: 'loading')
93. **`loadingAttribute`** - Data attribute to set during loading (default: 'data-loading')

---

## **Form Validation Rules**

When using `validateForm(form, rules)`, each field can have:

94. **`required`** - Field is required
95. **`type`** - Field type validation ('email', 'url', 'number')
96. **`minLength`** - Minimum string length
97. **`maxLength`** - Maximum string length
98. **`pattern`** - RegExp pattern for validation
99. **`message`** - Custom error message
100. **`label`** - Field label for error messages
101. **`validator`** - Custom validation function

---

## **GetFormData Options**

When using `getFormData(form, options)`:

102. **`includeEmpty`** - Include empty fields (default: false)
103. **`transform`** - Transform function for data
104. **`excludeDisabled`** - Exclude disabled fields (default: true)

---

## **ShowFormMessage Options**

When using `showFormMessage(form, message, type, options)`:

105. **`duration`** - Auto-hide duration in ms (default: 5000)
106. **`className`** - CSS class name (default: 'form-message')
107. **`container`** - Specific container element

---

## **ParallelAll Options**

When using `parallelAll(promises, options)`:

108. **`onProgress`** - Progress callback function
109. **`failFast`** - Stop on first error (default: true)

---

## **Configuration Options**

When using `AsyncModule.configure(options)`:

110. **`debounceDelay`** - Default debounce delay (default: 300)
111. **`throttleDelay`** - Default throttle delay (default: 200)
112. **`fetchTimeout`** - Default fetch timeout (default: 10000)
113. **`fetchRetries`** - Default fetch retries (default: 0)

---

## **FormElement.submitAsync Options**

When using enhanced form's `submitAsync(options)`:

114. **`validate`** - Enable validation (default: true)
115. **`validationRules`** - Validation rules object
116. **`onSuccess`** - Success callback
117. **`onError`** - Error callback
118. **`...fetchOptions`** - All enhancedFetch options

---

## **Validation Result Object**

The `validateForm()` method returns:

119. **`isValid`** - Boolean indicating if form is valid
120. **`errors`** - Array of error messages

---

## **Private/Internal Functions**

121. **`integrateWithDOMHelpers()`** - Internal integration function

---

## **Total Count: 121 Methods/Properties/Options**

- **5 Main AsyncModule API methods**
- **11 Core async utilities** (including debounce/throttle sub-methods)
- **8 Fetch utilities** (including aliases)
- **4 Form utilities**
- **2 Parallel request methods**
- **3 Global shortcuts**
- **43 Extended API methods** (Elements, Collections, Selector)
- **4 Enhanced form element methods**
- **32 Options/configurations** across all utilities
- **2 Validation result properties**
- **1 Internal function**

The library provides comprehensive async capabilities with seamless DOM Helpers integration, automatic enhancement of form elements, and extensive configuration options!