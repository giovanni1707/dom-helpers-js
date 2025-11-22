[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Animation Module - Complete Method Reference

## 🎬 Animation Object (Main API)

### Core Animation Functions
- `Animation.fadeIn(element, options)` - Fade in element (async)
  ```javascript
  await Animation.fadeIn(element, {
    duration: 300,
    delay: 0,
    easing: 'ease',
    cleanup: true,
    queue: true,
    onComplete: (element) => {}
  });
  ```

- `Animation.fadeOut(element, options)` - Fade out element (async)
  ```javascript
  await Animation.fadeOut(element, {
    duration: 300,
    delay: 0,
    easing: 'ease',
    cleanup: true,
    queue: true,
    hide: true,  // Set display: none after fade
    onComplete: (element) => {}
  });
  ```

- `Animation.slideUp(element, options)` - Slide up and collapse element (async)
  ```javascript
  await Animation.slideUp(element, options);
  ```

- `Animation.slideDown(element, options)` - Slide down and expand element (async)
  ```javascript
  await Animation.slideDown(element, options);
  ```

- `Animation.slideToggle(element, options)` - Toggle slide up/down (async)
  ```javascript
  await Animation.slideToggle(element, options);
  ```

- `Animation.transform(element, transformations, options)` - Apply CSS transforms (async)
  ```javascript
  await Animation.transform(element, {
    translateX: '100px',
    translateY: '50px',
    translate: ['100px', '50px'],  // Alternative
    translate3d: ['100px', '50px', '0'],
    scale: 1.5,
    scaleX: 1.2,
    scaleY: 0.8,
    scaleZ: 1,
    rotate: '45deg',
    rotateX: '45deg',
    rotateY: '45deg',
    rotateZ: '45deg',
    skew: '10deg',
    skewX: '10deg',
    skewY: '10deg'
  }, options);
  ```

### Configuration
- `Animation.setDefaults(config)` - Set default animation options
  ```javascript
  Animation.setDefaults({
    duration: 400,
    delay: 0,
    easing: 'ease-in-out',
    cleanup: true,
    queue: true
  });
  ```

- `Animation.getDefaults()` - Get current default options

### Browser Support Detection
- `Animation.isSupported(feature)` - Check browser support
  ```javascript
  Animation.isSupported('transitions');  // true/false
  Animation.isSupported('transforms');   // true/false
  ```

### Queue Management
- `Animation.clearQueue(element)` - Clear animation queue for element

### Element Enhancement
- `Animation.enhance(element)` - Manually enhance element with animation methods
  ```javascript
  const enhanced = Animation.enhance(element);
  await enhanced.fadeIn();
  ```

### Animation Chaining
- `Animation.chain(element)` - Create animation chain
  ```javascript
  await Animation.chain(element)
    .fadeIn({ duration: 300 })
    .delay(500)
    .slideUp({ duration: 400 })
    .play();
  ```

### Easing Functions
- `Animation.easing` - Object with all available easing functions
  ```javascript
  Animation.easing['ease-in-out-cubic']
  // See full list below
  ```

### Metadata
- `Animation.version` - Module version string

---

## 🎯 Enhanced Element Methods

When elements are accessed through Elements, Collections, or Selector, they gain these animation methods:

### Element Animation Methods
- `element.fadeIn(options)` - Fade in (async)
  ```javascript
  await Elements.myElement.fadeIn({ duration: 400 });
  ```

- `element.fadeOut(options)` - Fade out (async)
  ```javascript
  await Elements.myElement.fadeOut({ duration: 400, hide: true });
  ```

- `element.slideUp(options)` - Slide up (async)
  ```javascript
  await Elements.myElement.slideUp({ duration: 500 });
  ```

- `element.slideDown(options)` - Slide down (async)
  ```javascript
  await Elements.myElement.slideDown({ duration: 500 });
  ```

- `element.slideToggle(options)` - Toggle slide (async)
  ```javascript
  await Elements.myElement.slideToggle({ duration: 400 });
  ```

- `element.transform(transformations, options)` - Apply transforms (async)
  ```javascript
  await Elements.myElement.transform(
    { translateX: '100px', rotate: '45deg' },
    { duration: 600 }
  );
  ```

- `element.animate()` - Create animation chain
  ```javascript
  await Elements.myElement.animate()
    .fadeIn({ duration: 300 })
    .delay(500)
    .transform({ scale: 1.2 }, { duration: 400 })
    .then((el) => console.log('Done!', el))
    .play();
  ```

- `element.stopAnimations()` - Stop all animations on element
  ```javascript
  Elements.myElement.stopAnimations();
  ```

### Enhanced Update Method

The `.update()` method supports animation operations:

```javascript
// Single animation
await element.update({
  fadeIn: true,  // or { duration: 400, easing: 'ease-in' }
  textContent: 'Hello'
});

// Multiple animations
await element.update({
  slideDown: { duration: 500 },
  style: { backgroundColor: 'blue' }
});

// Transform animation
await element.update({
  transform: {
    transformations: { translateX: '100px', scale: 1.2 },
    options: { duration: 600 }
  }
});

// Stop animations
element.update({
  stopAnimations: true
});
```

---

## 📦 Enhanced Collection Methods

When collections are accessed through Collections or Selector.queryAll, they gain:

### Collection Animation Methods
- `collection.fadeIn(options)` - Fade in all elements (async)
  ```javascript
  await Collections.ClassName.items.fadeIn({ 
    duration: 300,
    stagger: 100  // Delay between each element
  });
  ```

- `collection.fadeOut(options)` - Fade out all elements (async)
  ```javascript
  await Collections.ClassName.items.fadeOut({ 
    duration: 300,
    stagger: 50
  });
  ```

- `collection.slideUp(options)` - Slide up all elements (async)
- `collection.slideDown(options)` - Slide down all elements (async)
- `collection.slideToggle(options)` - Toggle slide all elements (async)

- `collection.transform(transformations, options)` - Transform all elements (async)
  ```javascript
  await Selector.queryAll('.cards').transform(
    { scale: 1.1, rotate: '5deg' },
    { duration: 400, stagger: 100 }
  );
  ```

- `collection.stopAnimations()` - Stop animations on all elements

### Stagger Effect

All collection animation methods support stagger delays:

```javascript
// Animate with 100ms delay between each element
await Collections.ClassName.items.fadeIn({
  duration: 300,
  stagger: 100  // Each element starts 100ms after the previous
});
```

---

## 🔗 AnimationChain Class

Created via `element.animate()` or `Animation.chain(element)`:

### Chain Methods
- `.fadeIn(options)` - Add fadeIn to chain
- `.fadeOut(options)` - Add fadeOut to chain
- `.slideUp(options)` - Add slideUp to chain
- `.slideDown(options)` - Add slideDown to chain
- `.slideToggle(options)` - Add slideToggle to chain
- `.transform(transformations, options)` - Add transform to chain
- `.delay(ms)` - Add delay to chain
  ```javascript
  .delay(500)  // Wait 500ms before next animation
  ```

- `.then(callback)` - Execute callback in chain
  ```javascript
  .then((element) => {
    console.log('Animation step complete', element);
  })
  ```

- `.play()` - Execute the animation chain (async)
  ```javascript
  await chain.play();
  ```

### Complete Chain Example
```javascript
await Elements.myElement.animate()
  .fadeIn({ duration: 300 })
  .delay(500)
  .transform({ scale: 1.2 }, { duration: 400 })
  .delay(200)
  .transform({ scale: 1.0 }, { duration: 400 })
  .then((el) => el.classList.add('completed'))
  .play();
```

---

## ⚙️ Animation Options

Used in all animation methods:

```javascript
{
  duration: 300,          // Animation duration in ms (default: 300)
  delay: 0,               // Delay before animation starts in ms (default: 0)
  easing: 'ease',         // Easing function (default: 'ease')
  cleanup: true,          // Remove inline styles after animation (default: true)
  queue: true,            // Queue animation if element is animating (default: true)
  onComplete: function,   // Callback when animation completes
  hide: true,             // For fadeOut: set display:none after fade (default: true)
  stagger: 0              // For collections: delay between elements in ms (default: 0)
}
```

---

## 🎨 Easing Functions

Available easing functions (use as string in options):

### Standard Easing
- `'linear'` - Linear timing
- `'ease'` - Default ease
- `'ease-in'` - Ease in
- `'ease-out'` - Ease out
- `'ease-in-out'` - Ease in and out

### Quadratic Easing
- `'ease-in-quad'`
- `'ease-out-quad'`
- `'ease-in-out-quad'`

### Cubic Easing
- `'ease-in-cubic'`
- `'ease-out-cubic'`
- `'ease-in-out-cubic'`

### Quartic Easing
- `'ease-in-quart'`
- `'ease-out-quart'`
- `'ease-in-out-quart'`

### Quintic Easing
- `'ease-in-quint'`
- `'ease-out-quint'`
- `'ease-in-out-quint'`

### Sinusoidal Easing
- `'ease-in-sine'`
- `'ease-out-sine'`
- `'ease-in-out-sine'`

### Exponential Easing
- `'ease-in-expo'`
- `'ease-out-expo'`
- `'ease-in-out-expo'`

### Circular Easing
- `'ease-in-circ'`
- `'ease-out-circ'`
- `'ease-in-out-circ'`

### Back Easing
- `'ease-in-back'` - Backs up slightly before starting
- `'ease-out-back'` - Overshoots slightly before settling
- `'ease-in-out-back'` - Backs up and overshoots

### Custom Cubic Bezier
```javascript
easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
```

---

## 🔄 Transform Properties

Used in `transform()` method:

### Translation
```javascript
{
  translateX: '100px',
  translateY: '50px',
  translateZ: '20px',
  translate: ['100px', '50px'],       // [x, y]
  translate3d: ['100px', '50px', '0'] // [x, y, z]
}
```

### Scale
```javascript
{
  scale: 1.5,      // Uniform scale
  scaleX: 1.2,     // Scale X only
  scaleY: 0.8,     // Scale Y only
  scaleZ: 1.1      // Scale Z only
}
```

### Rotation
```javascript
{
  rotate: '45deg',     // 2D rotation
  rotateX: '45deg',    // Rotate around X axis
  rotateY: '45deg',    // Rotate around Y axis
  rotateZ: '45deg'     // Rotate around Z axis
}
```

### Skew
```javascript
{
  skew: '10deg',      // Skew both axes
  skewX: '10deg',     // Skew X axis
  skewY: '5deg'       // Skew Y axis
}
```

### Combined Transforms
```javascript
await element.transform({
  translateX: '100px',
  scale: 1.2,
  rotate: '45deg'
}, { duration: 600 });
```

---

## 🔧 Internal/Helper Functions

These are available but typically used internally:

### Utility Functions
- `parseConfig(options)` - Parse and normalize options (internal)
- `getComputedStyleValue(element, property)` - Get computed style (internal)
- `setElementStyle(element, styles)` - Set multiple styles (internal)
- `removeElementStyles(element, properties)` - Remove styles (internal)
- `createTransition(element, properties, config)` - Create CSS transition (internal)
- `waitForTransition(element, config)` - Wait for transition to complete (internal, async)
- `cleanupAnimation(element, config, properties)` - Remove animation styles (internal)

### Enhancement Functions
- `enhanceElementWithAnimation(element)` - Add animation methods to element (internal)
- `enhanceCollectionWithAnimation(collection)` - Add animation methods to collection (internal)
- `createAnimationUpdateMethod(originalUpdate, isCollection)` - Create enhanced update method (internal)

### Integration
- `integrateWithDOMHelpers()` - Integrate with DOM Helpers (internal)

---

## 🎪 AnimationQueue Class

Internal queue manager for element animations:

### Methods (Internal)
- `queue.add(element, animation)` - Add animation to queue
- `queue.process(element)` - Process queue for element
- `queue.clear(element)` - Clear queue for element
- `queue.isEmpty(element)` - Check if queue is empty

---

## 🌐 Browser Support

### Browser Support Object
```javascript
BROWSER_SUPPORT = {
  transitions: {
    property: 'transition',  // or 'WebkitTransition', etc.
    event: 'transitionend'   // or 'webkitTransitionEnd', etc.
  },
  transforms: 'transform'    // or 'WebkitTransform', etc.
}
```

### Graceful Fallbacks
- If transitions not supported: Uses setTimeout fallback
- If transforms not supported: Logs warning and skips transform
- Automatic vendor prefix detection

---

## 💡 Complete Usage Examples

### Basic Animations
```javascript
// Fade in
await Elements.myElement.fadeIn({ duration: 400 });

// Fade out and hide
await Elements.myElement.fadeOut({ duration: 400, hide: true });

// Slide toggle
await Elements.myElement.slideToggle({ duration: 500 });

// Transform
await Elements.myElement.transform({
  translateX: '100px',
  scale: 1.2,
  rotate: '45deg'
}, { duration: 600 });
```

### Animation Chaining
```javascript
await Elements.myElement.animate()
  .fadeIn({ duration: 300 })
  .delay(500)
  .slideUp({ duration: 400 })
  .delay(200)
  .slideDown({ duration: 400 })
  .fadeOut({ duration: 300 })
  .play();
```

### Collection Animations with Stagger
```javascript
// Fade in all cards with stagger effect
await Collections.ClassName.card.fadeIn({
  duration: 400,
  stagger: 100,  // 100ms delay between each card
  easing: 'ease-out-cubic'
});

// Transform all items
await Selector.queryAll('.item').transform({
  scale: 1.1,
  rotate: '5deg'
}, {
  duration: 500,
  stagger: 50
});
```

### Using with .update()
```javascript
// Animate and update properties
await Elements.myElement.update({
  fadeIn: { duration: 400, easing: 'ease-out' },
  textContent: 'Hello World',
  style: { backgroundColor: 'blue' }
});

// Multiple animations in sequence
await Elements.myElement.update({
  slideDown: { duration: 500 },
  classList: { add: 'active' }
});
```

### Custom Easing and Callbacks
```javascript
await Elements.myElement.fadeIn({
  duration: 600,
  easing: 'ease-in-out-back',
  delay: 200,
  onComplete: (element) => {
    console.log('Animation complete!', element);
    element.classList.add('animated');
  }
});
```

### Queue Management
```javascript
// Animations automatically queue
Elements.myElement.fadeIn({ duration: 400 });
Elements.myElement.slideUp({ duration: 500 });  // Waits for fadeIn

// Stop all animations
Elements.myElement.stopAnimations();

// Clear queue manually
Animation.clearQueue(Elements.myElement);
```

### Parallel vs Sequential
```javascript
// Sequential (default with queue: true)
await Elements.box1.fadeIn({ duration: 400 });
await Elements.box2.fadeIn({ duration: 400 });

// Parallel (queue: false or different elements)
await Promise.all([
  Elements.box1.fadeIn({ duration: 400, queue: false }),
  Elements.box2.fadeIn({ duration: 400, queue: false })
]);
```

### Form Animations
```javascript
// Animate form validation message
await Elements.errorMessage.update({
  slideDown: { duration: 300, easing: 'ease-out' },
  textContent: 'Please enter a valid email',
  classList: { add: 'error' }
});

// Hide after delay
setTimeout(async () => {
  await Elements.errorMessage.update({
    slideUp: { duration: 300 },
    classList: { remove: 'error' }
  });
}, 3000);
```

---

## 🔄 Integration with DOM Helpers

The Animation module automatically integrates with:

- **Elements Helper** - All elements accessed via `Elements.id` get animation methods
- **Collections Helper** - All collections accessed via `Collections.ClassName` get animation methods
- **Selector Helper** - All elements/collections from `Selector.query()` and `Selector.queryAll()` get animation methods
- **Forms Helper** - All forms accessed via `Forms.id` get animation methods

### Auto-Enhancement
```javascript
// Elements are automatically enhanced
Elements.myElement.fadeIn();  // Works immediately

// Collections are automatically enhanced
Collections.ClassName.items.fadeIn({ stagger: 100 });

// Selector results are automatically enhanced
Selector.query('.box').fadeIn();
Selector.queryAll('.box').fadeIn({ stagger: 50 });
```

---

**Total Methods: 45+** (15+ public API methods, 30+ internal/helper methods)

The Animation module provides comprehensive CSS3 animation functionality with seamless DOM Helpers integration! 🎉