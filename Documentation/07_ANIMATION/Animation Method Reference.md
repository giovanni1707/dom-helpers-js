# DOM Helpers Animation Library - Complete Method Reference

Based on the `dom-helpers-animation.js` library, here's a comprehensive list of all available methods:

## **Animation API (Main Interface)**

### Core Animation Functions
1. **`Animation.fadeIn(element, options)`** - Fade in element (async)
2. **`Animation.fadeOut(element, options)`** - Fade out element (async)
3. **`Animation.slideUp(element, options)`** - Slide up element (async)
4. **`Animation.slideDown(element, options)`** - Slide down element (async)
5. **`Animation.slideToggle(element, options)`** - Toggle slide up/down (async)
6. **`Animation.transform(element, transformations, options)`** - Apply CSS transforms (async)

### Configuration
7. **`Animation.setDefaults(config)`** - Set default animation configuration
8. **`Animation.getDefaults()`** - Get current default configuration
9. **`Animation.version`** - Get library version

### Browser Support
10. **`Animation.isSupported(feature)`** - Check browser support for 'transitions' or 'transforms'

### Queue Management
11. **`Animation.clearQueue(element)`** - Clear animation queue for element

### Manual Enhancement
12. **`Animation.enhance(element)`** - Manually enhance element with animation methods

### Animation Chaining
13. **`Animation.chain(element)`** - Create animation chain for element

### Easing Functions
14. **`Animation.easing`** - Object containing all easing function definitions

---

## **Enhanced Element Methods**

When an element is enhanced, it gets these methods:

### Direct Animation Methods
15. **`element.fadeIn(options)`** - Fade in the element (async)
16. **`element.fadeOut(options)`** - Fade out the element (async)
17. **`element.slideUp(options)`** - Slide up the element (async)
18. **`element.slideDown(options)`** - Slide down the element (async)
19. **`element.slideToggle(options)`** - Toggle slide the element (async)
20. **`element.transform(transformations, options)`** - Apply transforms (async)

### Animation Control
21. **`element.animate()`** - Create animation chain for this element
22. **`element.stopAnimations()`** - Stop all animations on this element

### Enhanced Update Method
23. **`element.update(updates)`** - Animation-aware update method (supports animation properties)

---

## **Enhanced Collection Methods**

When a collection is enhanced, it gets these methods:

### Collection Animation Methods
24. **`collection.fadeIn(options)`** - Fade in all elements in collection (async)
25. **`collection.fadeOut(options)`** - Fade out all elements in collection (async)
26. **`collection.slideUp(options)`** - Slide up all elements in collection (async)
27. **`collection.slideDown(options)`** - Slide down all elements in collection (async)
28. **`collection.slideToggle(options)`** - Toggle slide all elements in collection (async)
29. **`collection.transform(transformations, options)`** - Apply transforms to all elements (async)

### Collection Control
30. **`collection.stopAnimations()`** - Stop all animations in collection

### Enhanced Update Method
31. **`collection.update(updates)`** - Animation-aware update method for collections

---

## **AnimationChain Class Methods**

When using `element.animate()` or `Animation.chain(element)`:

### Chainable Animation Methods
32. **`chain.fadeIn(options)`** - Add fadeIn to chain
33. **`chain.fadeOut(options)`** - Add fadeOut to chain
34. **`chain.slideUp(options)`** - Add slideUp to chain
35. **`chain.slideDown(options)`** - Add slideDown to chain
36. **`chain.slideToggle(options)`** - Add slideToggle to chain
37. **`chain.transform(transformations, options)`** - Add transform to chain

### Chain Control
38. **`chain.delay(ms)`** - Add delay to chain
39. **`chain.then(callback)`** - Add custom callback to chain
40. **`chain.play()`** - Execute the animation chain (async)

---

## **AnimationQueue Class Methods** (Internal)

### Queue Management
41. **`animationQueue.add(element, animation)`** - Add animation to queue
42. **`animationQueue.process(element)`** - Process animation queue
43. **`animationQueue.clear(element)`** - Clear queue for element
44. **`animationQueue.isEmpty(element)`** - Check if queue is empty

---

## **Animation Options Properties**

Available options for all animation methods:

45. **`duration`** - Animation duration in milliseconds (default: 300)
46. **`delay`** - Animation delay in milliseconds (default: 0)
47. **`easing`** - Easing function (default: 'ease')
48. **`cleanup`** - Auto-cleanup inline styles after animation (default: true)
49. **`queue`** - Enable animation queuing (default: true)
50. **`onComplete`** - Callback function when animation completes
51. **`hide`** - Hide element after fadeOut (default: true)
52. **`stagger`** - Stagger delay for collections (in ms)

---

## **Transform Properties**

Available transformations for `transform()` method:

53. **`translateX`** - Translate on X axis
54. **`translateY`** - Translate on Y axis
55. **`translateZ`** - Translate on Z axis
56. **`translate`** - Translate on X and Y (array or string)
57. **`translate3d`** - 3D translation (array: [x, y, z])
58. **`scale`** - Uniform scale
59. **`scaleX`** - Scale on X axis
60. **`scaleY`** - Scale on Y axis
61. **`scaleZ`** - Scale on Z axis
62. **`rotate`** - 2D rotation
63. **`rotateX`** - Rotate on X axis
64. **`rotateY`** - Rotate on Y axis
65. **`rotateZ`** - Rotate on Z axis
66. **`skew`** - Skew transformation
67. **`skewX`** - Skew on X axis
68. **`skewY`** - Skew on Y axis

---

## **Easing Functions**

Available easing functions (26 total):

69. **`linear`** - Linear easing
70. **`ease`** - Default ease
71. **`ease-in`** - Ease in
72. **`ease-out`** - Ease out
73. **`ease-in-out`** - Ease in and out
74. **`ease-in-quad`** - Quadratic ease in
75. **`ease-out-quad`** - Quadratic ease out
76. **`ease-in-out-quad`** - Quadratic ease in-out
77. **`ease-in-cubic`** - Cubic ease in
78. **`ease-out-cubic`** - Cubic ease out
79. **`ease-in-out-cubic`** - Cubic ease in-out
80. **`ease-in-quart`** - Quartic ease in
81. **`ease-out-quart`** - Quartic ease out
82. **`ease-in-out-quart`** - Quartic ease in-out
83. **`ease-in-quint`** - Quintic ease in
84. **`ease-out-quint`** - Quintic ease out
85. **`ease-in-out-quint`** - Quintic ease in-out
86. **`ease-in-sine`** - Sinusoidal ease in
87. **`ease-out-sine`** - Sinusoidal ease out
88. **`ease-in-out-sine`** - Sinusoidal ease in-out
89. **`ease-in-expo`** - Exponential ease in
90. **`ease-out-expo`** - Exponential ease out
91. **`ease-in-out-expo`** - Exponential ease in-out
92. **`ease-in-circ`** - Circular ease in
93. **`ease-out-circ`** - Circular ease out
94. **`ease-in-out-circ`** - Circular ease in-out
95. **`ease-in-back`** - Back ease in
96. **`ease-out-back`** - Back ease out
97. **`ease-in-out-back`** - Back ease in-out

---

## **Update Method Animation Properties**

When using `.update()` with animation support:

98. **`updates.fadeIn`** - Trigger fadeIn (boolean or options object)
99. **`updates.fadeOut`** - Trigger fadeOut (boolean or options object)
100. **`updates.slideUp`** - Trigger slideUp (boolean or options object)
101. **`updates.slideDown`** - Trigger slideDown (boolean or options object)
102. **`updates.slideToggle`** - Trigger slideToggle (boolean or options object)
103. **`updates.transform`** - Trigger transform (object with transformations and options)
104. **`updates.stopAnimations`** - Stop all animations (boolean)

---

## **Utility Functions** (Internal)

### Configuration & Parsing
105. **`parseConfig(options)`** - Parse and normalize animation config
106. **`getComputedStyleValue(element, property)`** - Get computed style value
107. **`setElementStyle(element, styles)`** - Set multiple styles on element
108. **`removeElementStyles(element, properties)`** - Remove multiple styles from element

### Transition Management
109. **`createTransition(element, properties, config)`** - Create CSS transition
110. **`waitForTransition(element, config)`** - Wait for transition to complete (async)
111. **`cleanupAnimation(element, config, propertiesToClean)`** - Cleanup after animation

### Enhancement Functions
112. **`enhanceElementWithAnimation(element)`** - Add animation methods to element
113. **`enhanceCollectionWithAnimation(collection)`** - Add animation methods to collection
114. **`createAnimationUpdateMethod(originalUpdate, isCollection)`** - Create animation-aware update method

### Integration
115. **`integrateWithDOMHelpers()`** - Integrate with DOM Helpers ecosystem

---

## **Browser Support Detection** (Internal)

116. **`BROWSER_SUPPORT.transitions`** - Object with transition property and event names
117. **`BROWSER_SUPPORT.transforms`** - Transform property name for current browser

---

## **Configuration Objects**

118. **`DEFAULT_CONFIG`** - Default animation configuration object
119. **`EASING_FUNCTIONS`** - Map of all easing function definitions

---

## **Element Properties**

Enhanced elements have these internal properties:

120. **`element._hasAnimationMethods`** - Flag indicating animation enhancement
121. **`collection._hasAnimationMethods`** - Flag indicating collection animation enhancement

---

## **Total Count: 121 Methods/Properties/Features**

- **14 Main Animation API methods**
- **9 Enhanced element methods**
- **8 Enhanced collection methods**
- **9 AnimationChain methods**
- **4 AnimationQueue methods** (internal)
- **8 Animation options**
- **16 Transform properties**
- **29 Easing functions**
- **7 Update method animation properties**
- **11 Utility functions** (internal)
- **2 Browser support objects**
- **2 Configuration objects**
- **2 Element properties**

The library provides comprehensive animation capabilities with:
- **6 core animation types** (fadeIn, fadeOut, slideUp, slideDown, slideToggle, transform)
- **29 easing functions** for smooth animations
- **Chainable API** for complex animation sequences
- **Collection support** with stagger effects
- **Queue management** for sequential animations
- **Seamless integration** with DOM Helpers ecosystem