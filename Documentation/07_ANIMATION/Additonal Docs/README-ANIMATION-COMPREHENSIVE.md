[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Animation - Comprehensive README Documentation

```markdown
# DOM Helpers Animation Module

A lightweight, vanilla JavaScript animation library that integrates seamlessly with DOM Helpers. Provides smooth, performant animations with automatic browser compatibility, easing functions, animation chaining, and queue management—all without external dependencies.

**Version:** 1.0.0  
**License:** MIT

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Core Animation Methods](#core-animation-methods)
4. [Animation Configuration](#animation-configuration)
5. [Animation Chaining](#animation-chaining)
6. [Collection Animations](#collection-animations)
7. [Advanced Features](#advanced-features)
8. [Easing Functions](#easing-functions)
9. [Integration with .update()](#integration-with-update)
10. [Browser Compatibility](#browser-compatibility)
11. [Best Practices](#best-practices)
12. [API Reference](#api-reference)

---

## Installation

### Browser (Global)
```html
<!-- Load DOM Helpers first -->
<script src="dom-helpers.js"></script>

<!-- Then load Animation module -->
<script src="dom-helpers-animation.js"></script>
```

Once loaded, animations are automatically available on all DOM elements and collections:
```javascript
const element = document.getElementById('box');
await element.fadeIn();
```

### Node.js / CommonJS
```javascript
const { Animation } = require('dom-helpers-animation.js');
```

### AMD / RequireJS
```javascript
require(['dom-helpers-animation'], function(Animation) {
  // Use Animation
});
```

---

## Quick Start

```javascript
// Basic fade animation
const box = document.getElementById('box');
await box.fadeIn({ duration: 500 });

// Chain multiple animations
await box.animate()
  .slideUp({ duration: 300 })
  .delay(200)
  .fadeIn({ duration: 300 })
  .play();

// Animate all elements in a collection
const items = document.querySelectorAll('.item');
Items.fadeIn({ duration: 300, stagger: 100 });

// Use with .update() method
Elements('button').update({
  fadeOut: { duration: 200 }
});

// Transform animations
await box.transform({
  translateX: '100px',
  rotate: '45deg',
  scale: 1.5
}, { duration: 500 });
```

---

## Core Animation Methods

Core animations handle the most common visual transitions and effects.

### fadeIn()

**What it does:** Smoothly fades an element in from completely transparent to fully opaque. Perfect for revealing content or showing elements on page load.

**Syntax:**
```javascript
element.fadeIn(options)
```

**Parameters:**
- `options` (Object, optional):
  - `duration` (Number): Animation length in milliseconds. Default: `300`
  - `delay` (Number): Delay before animation starts. Default: `0`
  - `easing` (String): Easing function name. Default: `'ease'`
  - `queue` (Boolean): Queue animation if element is busy. Default: `true`
  - `onComplete` (Function): Callback when animation finishes
  - `cleanup` (Boolean): Remove inline styles after animation. Default: `true`

**Returns:** Promise that resolves when animation completes

**Example:**
```javascript
// Simple fade in
const box = document.getElementById('box');
await box.fadeIn();
console.log('Faded in!');

// With custom duration and easing
await box.fadeIn({
  duration: 800,
  easing: 'ease-in-out-cubic',
  onComplete: (element) => {
    console.log('Element is now visible:', element);
  }
});

// Fade in with delay
await box.fadeIn({
  duration: 500,
  delay: 1000 // Wait 1 second before fading in
});

// Multiple elements
const elements = document.querySelectorAll('.card');
for (const el of elements) {
  await el.fadeIn({ duration: 300 });
}
```

**Use Cases:**
- Page load reveal effects
- Modal dialog appearance
- Tooltip display
- Progressive content loading
- Hover effects

---

### fadeOut()

**What it does:** Smoothly fades an element out from opaque to completely transparent, optionally hiding it afterward. Use for removing elements gracefully.

**Syntax:**
```javascript
element.fadeOut(options)
```

**Parameters:**
- `options` (Object, optional):
  - `duration` (Number): Animation length in milliseconds. Default: `300`
  - `delay` (Number): Delay before animation starts. Default: `0`
  - `easing` (String): Easing function name. Default: `'ease'`
  - `queue` (Boolean): Queue animation. Default: `true`
  - `hide` (Boolean): Set display to 'none' after fade. Default: `true`
  - `onComplete` (Function): Callback when animation finishes
  - `cleanup` (Boolean): Remove inline styles after animation. Default: `true`

**Returns:** Promise that resolves when animation completes

**Example:**
```javascript
// Simple fade out
const notification = document.getElementById('notification');
await notification.fadeOut();

// Fade out but keep element in DOM (display: block)
await notification.fadeOut({
  duration: 300,
  hide: false // Element stays in flow but invisible
});

// Fade out with delay and callback
const modal = document.getElementById('modal');
await modal.fadeOut({
  duration: 500,
  delay: 2000, // Show for 2 seconds then fade
  onComplete: (el) => {
    console.log('Modal hidden');
    // Clean up the element
    el.remove();
  }
});

// Fade out on button click
document.getElementById('closeBtn').addEventListener('click', async () => {
  await notification.fadeOut({ duration: 200 });
});
```

**Use Cases:**
- Dismissing notifications
- Closing modals
- Removing temporary elements
- Transition effects between views
- Unload animations

---

### slideUp()

**What it does:** Collapses an element upward by animating height, padding, and margin to zero. Perfect for accordion-style collapsing.

**Syntax:**
```javascript
element.slideUp(options)
```

**Parameters:**
- `options` (Object, optional):
  - `duration` (Number): Animation length in milliseconds. Default: `300`
  - `delay` (Number): Delay before animation starts. Default: `0`
  - `easing` (String): Easing function name. Default: `'ease'`
  - `queue` (Boolean): Queue animation. Default: `true`
  - `onComplete` (Function): Callback when animation finishes
  - `cleanup` (Boolean): Remove inline styles after animation. Default: `true`

**Returns:** Promise that resolves when animation completes

**Example:**
```javascript
// Simple slide up
const menu = document.getElementById('menu');
await menu.slideUp({ duration: 300 });

// Slide up with easing
await menu.slideUp({
  duration: 500,
  easing: 'ease-in-cubic'
});

// Accordion collapse
const accordionItems = document.querySelectorAll('.accordion-item');
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('accordion-toggle')) {
    const item = e.target.closest('.accordion-item');
    const content = item.querySelector('.accordion-content');
    
    // Collapse the content
    await content.slideUp({ duration: 200 });
    item.classList.remove('open');
  }
});

// Menu toggle
const toggleBtn = document.getElementById('toggleMenu');
toggleBtn.addEventListener('click', async () => {
  const menu = document.getElementById('mainMenu');
  await menu.slideUp({ duration: 300 });
  toggleBtn.textContent = 'Show Menu';
});
```

**Use Cases:**
- Accordion collapse
- Menu retraction
- Section hiding
- Collapsible content
- Smooth element removal

---

### slideDown()

**What it does:** Expands an element downward by animating height, padding, and margin from zero to full size. Counterpart to slideUp for revealing content.

**Syntax:**
```javascript
element.slideDown(options)
```

**Parameters:**
- `options` (Object, optional):
  - `duration` (Number): Animation length in milliseconds. Default: `300`
  - `delay` (Number): Delay before animation starts. Default: `0`
  - `easing` (String): Easing function name. Default: `'ease'`
  - `queue` (Boolean): Queue animation. Default: `true`
  - `onComplete` (Function): Callback when animation finishes
  - `cleanup` (Boolean): Remove inline styles after animation. Default: `true`

**Returns:** Promise that resolves when animation completes

**Example:**
```javascript
// Simple slide down
const content = document.getElementById('content');
await content.slideDown({ duration: 400 });

// Accordion expand
const accordionToggle = document.querySelector('.accordion-toggle');
accordionToggle.addEventListener('click', async () => {
  const content = accordionToggle.nextElementSibling;
  await content.slideDown({ duration: 300 });
  accordionToggle.closest('.accordion-item').classList.add('open');
});

// Dropdown menu reveal
const dropdownBtn = document.getElementById('dropdownBtn');
const dropdownMenu = document.getElementById('dropdownMenu');

dropdownBtn.addEventListener('click', async () => {
  // Hide if already visible
  if (dropdownMenu.style.display !== 'none') {
    await dropdownMenu.slideUp({ duration: 150 });
  } else {
    await dropdownMenu.slideDown({ duration: 150 });
  }
});

// Smooth content expansion
const expandBtn = document.getElementById('expandBtn');
const expandContent = document.getElementById('expandContent');

expandBtn.addEventListener('click', async () => {
  await expandContent.slideDown({
    duration: 500,
    easing: 'ease-out-cubic',
    onComplete: () => console.log('Content expanded')
  });
});
```

**Use Cases:**
- Accordion expand
- Dropdown menu reveal
- Collapsible section expansion
- Smooth content display
- Menu opening

---

### slideToggle()

**What it does:** Automatically determines if an element is visible and either slides it up (if visible) or slides it down (if hidden). Combines the functionality of slideUp and slideDown.

**Syntax:**
```javascript
element.slideToggle(options)
```

**Parameters:**
- `options` (Object, optional): Same as slideUp/slideDown
  - `duration`, `delay`, `easing`, `queue`, `onComplete`, `cleanup`

**Returns:** Promise that resolves when animation completes

**Example:**
```javascript
// Simple toggle
const menu = document.getElementById('menu');
const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', async () => {
  await menu.slideToggle({ duration: 300 });
});

// Multiple toggles with stagger
const toggles = document.querySelectorAll('.toggle-btn');
toggles.forEach((btn, index) => {
  btn.addEventListener('click', async () => {
    const content = btn.nextElementSibling;
    await content.slideToggle({
      duration: 300,
      delay: index * 50 // Stagger effect
    });
  });
});

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  
  question.addEventListener('click', async () => {
    // Close other items
    faqItems.forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('open')) {
        otherItem.querySelector('.faq-answer').slideUp({ duration: 200 });
        otherItem.classList.remove('open');
      }
    });
    
    // Toggle this item
    await answer.slideToggle({ duration: 300 });
    item.classList.toggle('open');
  });
});

// Details/summary element replacement
const summaryElement = document.querySelector('summary');
const detailsContent = document.querySelector('.details-content');

summaryElement.addEventListener('click', (e) => {
  e.preventDefault();
  detailsContent.slideToggle({ duration: 250 });
  summaryElement.closest('.details').classList.toggle('open');
});
```

**Use Cases:**
- Toggle visibility without tracking state
- Accordion menus
- Show/hide content
- FAQ sections
- Expandable details

---

### transform()

**What it does:** Applies CSS transform animations including translate, scale, rotate, and skew. Creates complex movement and deformation effects smoothly over time.

**Syntax:**
```javascript
element.transform(transformations, options)
```

**Parameters:**
- `transformations` (Object, required): Transform operations to apply:
  - `translateX` (String): X-axis movement (e.g., '100px', '10%')
  - `translateY` (String): Y-axis movement
  - `translateZ` (String): Z-axis movement (3D)
  - `translate` (String/Array): X,Y translation. Can be array `['100px', '50px']`
  - `translate3d` (Array): `[x, y, z]` coordinates for 3D translation
  - `scale` (Number): Scale factor (1 = normal, 2 = double size)
  - `scaleX` (Number): Horizontal scale
  - `scaleY` (Number): Vertical scale
  - `scaleZ` (Number): Z-axis scale (3D)
  - `rotate` (String): Rotation in degrees (e.g., '45deg', '0.5turn')
  - `rotateX` (String): X-axis 3D rotation
  - `rotateY` (String): Y-axis 3D rotation
  - `rotateZ` (String): Z-axis 3D rotation
  - `skew` (String): Skew both axes (e.g., '10deg')
  - `skewX` (String): Horizontal skew
  - `skewY` (String): Vertical skew

- `options` (Object, optional):
  - `duration` (Number): Animation time. Default: `300`
  - `delay` (Number): Delay before start. Default: `0`
  - `easing` (String): Easing function. Default: `'ease'`
  - `queue` (Boolean): Queue animations. Default: `true`
  - `onComplete` (Function): Completion callback
  - `cleanup` (Boolean): Remove inline styles after. Default: `true`

**Returns:** Promise that resolves when animation completes

**Example:**
```javascript
// Simple translation
const box = document.getElementById('box');
await box.transform({
  translateX: '100px'
}, { duration: 500 });

// Multiple transforms combined
const card = document.getElementById('card');
await card.transform({
  translateX: '50px',
  translateY: '30px',
  scale: 1.1,
  rotate: '5deg'
}, {
  duration: 400,
  easing: 'ease-in-out-cubic'
});

// 3D rotation
const cube = document.getElementById('cube');
await cube.transform({
  rotateX: '360deg',
  rotateY: '180deg'
}, { duration: 1000 });

// Scale animation
const button = document.getElementById('btn');
button.addEventListener('click', async () => {
  await button.transform({
    scale: 0.95
  }, { duration: 100 });
  
  await button.transform({
    scale: 1
  }, { duration: 100 });
});

// Hover zoom effect
const image = document.getElementById('image');
image.addEventListener('mouseenter', async () => {
  await image.transform({
    scale: 1.2
  }, { duration: 300 });
});

image.addEventListener('mouseleave', async () => {
  await image.transform({
    scale: 1
  }, { duration: 300 });
});

// Skew effect
const textElement = document.getElementById('text');
await textElement.transform({
  skewX: '20deg',
  skewY: '10deg'
}, { duration: 600 });

// Carousel slide transition
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

async function goToSlide(index) {
  const offset = -index * 100;
  await slides[currentSlide].transform({
    translateX: `${offset}%`
  }, { duration: 500 });
  currentSlide = index;
}

// 3D perspective effect
const card3d = document.getElementById('card-3d');
await card3d.transform({
  translate3d: ['50px', '50px', '100px'],
  rotateX: '15deg'
}, { duration: 800 });
```

**Use Cases:**
- Sliding/panning animations
- Zoom effects
- Rotations and flips
- Skew effects
- 3D transformations
- Carousel/slider animations
- Interactive gestures
- Hover effects

---

## Animation Configuration

Configure default values and get information about animation settings.

### setDefaults()

**What it does:** Sets default animation configuration that applies to all animations module-wide. Eliminates repetition when all animations share common settings.

**Syntax:**
```javascript
Animation.setDefaults(config)
```

**Parameters:**
- `config` (Object): Default options to set:
  - `duration` (Number): Default duration in ms. Default: `300`
  - `delay` (Number): Default delay in ms. Default: `0`
  - `easing` (String): Default easing function. Default: `'ease'`
  - `cleanup` (Boolean): Default cleanup behavior. Default: `true`
  - `queue` (Boolean): Default queue behavior. Default: `true`

**Returns:** Animation module (chainable)

**Example:**
```javascript
// Set project-wide animation defaults
Animation.setDefaults({
  duration: 400,
  easing: 'ease-in-out-cubic',
  cleanup: true
});

// Now all animations use these defaults
await element.fadeIn(); // Uses 400ms duration and ease-in-out-cubic

// Can still override per-animation
await element.fadeIn({ duration: 200 }); // Uses 200ms instead

// Chain multiple configurations
Animation.setDefaults({ duration: 500 })
  .setDefaults({ easing: 'ease-out-quad' });

// Different configs for different scenarios
function setupFastAnimations() {
  Animation.setDefaults({
    duration: 150,
    easing: 'ease-out'
  });
}

function setupSmoothAnimations() {
  Animation.setDefaults({
    duration: 600,
    easing: 'ease-in-out-cubic'
  });
}

setupFastAnimations(); // For snappy UI
```

**Use Cases:**
- Project-wide consistency
- Performance optimization
- Theme-based animation speeds
- Device-specific settings
- Accessibility considerations

---

### getDefaults()

**What it does:** Returns the current default animation configuration. Useful for reviewing settings or creating modified versions.

**Syntax:**
```javascript
Animation.getDefaults()
```

**Returns:** Object containing current default configuration

**Example:**
```javascript
// Get current defaults
const defaults = Animation.getDefaults();
console.log(defaults);
// Output: { duration: 300, delay: 0, easing: 'ease', cleanup: true, queue: true }

// Modify and reapply
const newDefaults = Animation.getDefaults();
newDefaults.duration = 500;
Animation.setDefaults(newDefaults);

// Check specific setting
if (Animation.getDefaults().duration > 400) {
  console.log('Using slow animations');
}

// Create variation from defaults
const fastDefaults = {
  ...Animation.getDefaults(),
  duration: 200
};

// Apply temporarily
Animation.setDefaults(fastDefaults);
await element.fadeIn();
```

---

## Animation Chaining

Chain multiple animations together for complex sequences.

### animate()

**What it does:** Creates an AnimationChain object that allows chaining multiple animations in sequence. Animations execute one after another, and the chain can include delays and custom callbacks.

**Syntax:**
```javascript
element.animate()
```

**Returns:** AnimationChain object with chainable methods

**Example:**
```javascript
// Simple chain
const box = document.getElementById('box');
await box.animate()
  .fadeIn({ duration: 300 })
  .slideDown({ duration: 400 })
  .play();

// Complex animation sequence
const card = document.getElementById('card');
await card.animate()
  .fadeIn({ duration: 200 })
  .delay(500) // Wait half second
  .transform({ scale: 1.1 }, { duration: 300 })
  .delay(300)
  .slideDown({ duration: 400 })
  .transform({ rotate: '5deg' }, { duration: 200 })
  .play();

// Chain with custom callbacks
const modal = document.getElementById('modal');
await modal.animate()
  .fadeIn({ 
    duration: 300,
    onComplete: () => console.log('Fade complete')
  })
  .delay(1000)
  .slideUp({
    duration: 300,
    onComplete: () => console.log('Slide complete')
  })
  .then((element) => {
    // Custom function between animations
    element.classList.add('processed');
  })
  .play();

// Animation sequence on page load
window.addEventListener('load', async () => {
  const intro = document.getElementById('intro');
  const content = document.getElementById('content');
  const footer = document.getElementById('footer');
  
  await intro.animate()
    .fadeIn({ duration: 400 })
    .slideDown({ duration: 300 })
    .play();
  
  await content.animate()
    .fadeIn({ duration: 300 })
    .play();
  
  await footer.animate()
    .slideUp({ duration: 200 })
    .play();
});

// Staggered animation on multiple elements
const items = document.querySelectorAll('.item');
for (let i = 0; i < items.length; i++) {
  items[i].animate()
    .delay(i * 100)
    .fadeIn({ duration: 300 })
    .transform({ translateX: '0px' }, { duration: 400 })
    .play(); // Don't await, let them run in parallel
}
```

**Chainable Methods:**
- `.fadeIn(options)` - Add fade in to chain
- `.fadeOut(options)` - Add fade out to chain
- `.slideUp(options)` - Add slide up to chain
- `.slideDown(options)` - Add slide down to chain
- `.slideToggle(options)` - Add slide toggle to chain
- `.transform(transforms, options)` - Add transform to chain
- `.delay(milliseconds)` - Add delay between animations
- `.then(callback)` - Execute custom function
- `.play()` - Execute the animation chain

**Use Cases:**
- Complex page transitions
- Multi-step animations
- Sequential element reveals
- Choreographed animations
- Page load sequences

---

### Chain Methods

**delay(milliseconds)**

Adds a delay before the next animation in the chain.

```javascript
await element.animate()
  .fadeIn({ duration: 300 })
  .delay(500) // Wait 500ms
  .slideDown({ duration: 200 })
  .play();
```

**then(callback)**

Executes a custom function between animations.

```javascript
await element.animate()
  .fadeIn()
  .then((el) => {
    // Do something custom
    el.textContent = 'Updated';
    el.classList.add('active');
  })
  .slideDown()
  .play();
```

**play()**

Executes the entire animation chain sequentially.

```javascript
const chain = element.animate()
  .fadeIn()
  .delay(300)
  .transform({ scale: 1.2 })
  .fadeOut();

await chain.play(); // Execute all animations
```

---

## Collection Animations

Animate multiple elements with built-in stagger and sequential options.

### Collection Methods

When you select multiple elements using DOM Helpers Collections, all animation methods are available and apply to each element in the collection.

**Syntax:**
```javascript
collection.fadeIn(options)
collection.fadeOut(options)
collection.slideUp(options)
collection.slideDown(options)
collection.slideToggle(options)
collection.transform(transformations, options)
```

**Parameters:**
- `options` (Object, optional): Same animation options plus:
  - `stagger` (Number): Delay between each element in milliseconds. Default: `0`

**Returns:** Promise that resolves when all animations complete

**Example:**
```javascript
// Animate all items without stagger
const items = document.querySelectorAll('.item');
await items.fadeIn({ duration: 300 });

// Animate with stagger (each starts after previous)
await items.fadeIn({
  duration: 300,
  stagger: 100 // 100ms delay between each item
});
// Item 1: starts at 0ms
// Item 2: starts at 100ms
// Item 3: starts at 200ms
// etc.

// Staggered slide down
const listItems = document.querySelectorAll('li');
await listItems.slideDown({
  duration: 200,
  stagger: 50
});

// Cards reveal with stagger
const cards = document.querySelectorAll('.card');
await cards.animate()
  .fadeIn({ duration: 300 })
  .transform({ translateY: '0px' }, { duration: 400 })
  .play(); // Note: this doesn't stagger, items animate together

// Better approach for staggered chain
const items = document.querySelectorAll('.item');
items.forEach((item, index) => {
  item.animate()
    .delay(index * 100)
    .fadeIn({ duration: 300 })
    .transform({ scale: 1 }, { duration: 200 })
    .play();
});

// Stop all animations in collection
items.stopAnimations();

// Get all list items and animate
const listItems = document.querySelectorAll('ul li');
await listItems.fadeIn({
  duration: 250,
  stagger: 75
});
```

**Use Cases:**
- Staggered list item reveals
- Simultaneous element animations
- Gallery/grid animations
- Sequential card displays
- Batch animations

---

### stopAnimations()

**What it does:** Immediately stops all queued and running animations on an element or collection of elements, clearing the animation queue.

**Syntax:**
```javascript
element.stopAnimations()
collection.stopAnimations()
```

**Returns:** The element or collection (chainable)

**Example:**
```javascript
// Stop animations on single element
const element = document.getElementById('box');
element.stopAnimations();

// Stop animations on collection
const items = document.querySelectorAll('.item');
items.stopAnimations();

// Stop animations when leaving page
window.addEventListener('beforeunload', () => {
  document.querySelectorAll('*').stopAnimations();
});

// Stop on user interaction
const slider = document.getElementById('slider');
slider.addEventListener('mousedown', () => {
  slider.stopAnimations(); // Stop any running slide animation
});

// Cancel animation chain
const element = document.getElementById('element');
const fadePromise = element.fadeIn({ duration: 2000 });

setTimeout(() => {
  element.stopAnimations(); // Stops the fade
}, 500);
```

**Use Cases:**
- Interrupt animations
- Clean page transitions
- Handle user interactions
- Emergency cleanup
- Animation cancellation

---

## Advanced Features

Advanced utilities for browser detection and manual enhancement.

### isSupported()

**What it does:** Detects browser support for specific animation features (transitions, transforms). Useful for providing fallbacks or alternative implementations.

**Syntax:**
```javascript
Animation.isSupported(feature)
```

**Parameters:**
- `feature` (String): Feature to check:
  - `'transitions'` - CSS transitions support
  - `'transforms'` - CSS transforms support

**Returns:** Boolean (true if supported, false otherwise)

**Example:**
```javascript
// Check transition support
if (Animation.isSupported('transitions')) {
  console.log('Transitions are supported');
  await element.fadeIn();
} else {
  console.log('No transition support, using fallback');
  element.style.opacity = '1';
}

// Check transform support
if (Animation.isSupported('transforms')) {
  await element.transform({ scale: 1.5 });
} else {
  // Resize element instead
  element.style.width = '150%';
  element.style.height = '150%';
}

// Feature detection for app initialization
function initializeAnimations() {
  const transitionsSupported = Animation.isSupported('transitions');
  const transformsSupported = Animation.isSupported('transforms');
  
  if (!transitionsSupported || !transformsSupported) {
    // Disable fancy animations on older browsers
    document.body.classList.add('no-animations');
    console.log('Running in compatibility mode');
  }
}

initializeAnimations();
```

**Use Cases:**
- Browser compatibility detection
- Progressive enhancement
- Feature-based configuration
- Fallback implementation
- Legacy browser support

---

### clearQueue()

**What it does:** Manually clears the animation queue for a specific element without stopping current animations. Useful for removing pending animations.

**Syntax:**
```javascript
Animation.clearQueue(element)
```

**Parameters:**
- `element` (Element, required): DOM element whose queue to clear

**Returns:** Animation module (chainable)

**Example:**
```javascript
const element = document.getElementById('box');

// Queue multiple animations
element.fadeIn({ queue: true });
element.slideDown({ queue: true });
element.fadeOut({ queue: true });

// Clear pending animations (but current one still runs)
Animation.clearQueue(element);
// First animation completes, but second and third are cancelled

// Clear queue on user action
const cancelBtn = document.getElementById('cancelBtn');
const animatingElement = document.getElementById('animatingElement');

cancelBtn.addEventListener('click', () => {
  Animation.clearQueue(animatingElement);
  console.log('Animation queue cleared');
});

// Clean up on page navigation
window.addEventListener('beforeunload', () => {
  document.querySelectorAll('[data-animating]').forEach(el => {
    Animation.clearQueue(el);
  });
});
```

---

### enhance()

**What it does:** Manually adds animation methods to an element or collection. Usually automatic, but useful for dynamically created elements or manual enhancement.

**Syntax:**
```javascript
Animation.enhance(element)
Animation.enhance(collection)
```

**Parameters:**
- `element` (Element): DOM element or collection to enhance

**Returns:** The enhanced element or collection

**Example:**
```javascript
// Enhance a dynamically created element
const newElement = document.createElement('div');
newElement.textContent = 'New Element';
document.body.appendChild(newElement);

// Manually enhance
Animation.enhance(newElement);
await newElement.fadeIn();

// Enhance AJAX-loaded elements
async function loadContent() {
  const response = await fetch('/api/content');
  const html = await response.text();
  
  const container = document.getElementById('container');
  container.innerHTML = html;
  
  // Enhance all new elements
  container.querySelectorAll('*').forEach(el => {
    Animation.enhance(el);
  });
  
  // Now all new elements have animation methods
  await container.querySelectorAll('.item').fadeIn({ stagger: 100 });
}

// Enhance collection
const items = document.querySelectorAll('.item');
Animation.enhance(items);
await items.slideDown({ stagger: 50 });
```

---

### chain()

**What it does:** Manually creates an AnimationChain for standalone use without calling animate() on an element.

**Syntax:**
```javascript
Animation.chain(element)
```

**Parameters:**
- `element` (Element, required): Element to create chain for

**Returns:** AnimationChain object

**Example:**
```javascript
// Create chain manually
const element = document.getElementById('box');
const chain = Animation.chain(element);

await chain
  .fadeIn()
  .delay(300)
  .slideDown()
  .play();

// Programmatically build chain
const element = document.getElementById('card');
const chain = Animation.chain(element);

const animations = ['fadeIn', 'slideDown', 'fadeOut'];
animations.forEach(animation => {
  chain[animation]();
});

await chain.play();

// Conditional chaining based on state
const element = document.getElementById('box');
const chain = Animation.chain(element);

if (element.dataset.state === 'hidden') {
  chain.fadeIn().slideDown();
} else {
  chain.fadeOut().slideUp();
}

await chain.play();
```

---

## Easing Functions

Comprehensive easing options for controlling animation pacing and feel.

### easing

**What it does:** Provides access to all available easing function names for smooth, natural-looking animations. Each easing function affects how the animation progresses over time.

**Syntax:**
```javascript
Animation.easing
```

**Available Easing Functions:**

**Basic Easings:**
- `'linear'` - Constant speed throughout
- `'ease'` - Slow start and end (default)
- `'ease-in'` - Slow start, fast end
- `'ease-out'` - Fast start, slow end
- `'ease-in-out'` - Slow start and end

**Advanced Easings (Quad, Cubic, Quart, Quint, Sine, Expo, Circ, Back):**
- `'ease-in-quad'` - Quadratic ease-in
- `'ease-out-quad'` - Quadratic ease-out
- `'ease-in-out-quad'` - Quadratic ease-in-out
- `'ease-in-cubic'` - Cubic ease-in
- `'ease-out-cubic'` - Cubic ease-out
- `'ease-in-out-cubic'` - Cubic ease-in-out
- `'ease-in-quart'` - Quartic ease-in
- `'ease-out-quart'` - Quartic ease-out
- `'ease-in-out-quart'` - Quartic ease-in-out
- `'ease-in-quint'` - Quintic ease-in
- `'ease-out-quint'` - Quintic ease-out
- `'ease-in-out-quint'` - Quintic ease-in-out
- `'ease-in-sine'` - Sine ease-in
- `'ease-out-sine'` - Sine ease-out
- `'ease-in-out-sine'` - Sine ease-in-out
- `'ease-in-expo'` - Exponential ease-in
- `'ease-out-expo'` - Exponential ease-out
- `'ease-in-out-expo'` - Exponential ease-in-out
- `'ease-in-circ'` - Circular ease-in
- `'ease-out-circ'` - Circular ease-out
- `'ease-in-out-circ'` - Circular ease-in-out
- `'ease-in-back'` - Back ease-in (overshoots start)
- `'ease-out-back'` - Back ease-out (overshoots end)
- `'ease-in-out-back'` - Back ease-in-out

**Example:**
```javascript
// List all available easing functions
console.log(Object.keys(Animation.easing));

// Use different easing functions
const box = document.getElementById('box');

// Linear (constant speed)
await box.fadeIn({ easing: 'linear' });

// Ease out quad (fast start, slow end) - bouncy feel
await box.slideDown({ easing: 'ease-out-quad' });

// Ease in-out cubic (smooth deceleration)
await box.fadeOut({ easing: 'ease-in-out-cubic' });

// Ease out back (bouncy, overshoots slightly)
await box.transform({ scale: 1.2 }, { easing: 'ease-out-back' });

// Ease out circ (circular easing)
await box.transform({ translateX: '200px' }, { easing: 'ease-out-circ' });

// Create easing demo
const easingNames = Object.keys(Animation.easing);
const boxes = document.querySelectorAll('.easing-demo');

boxes.forEach((box, index) => {
  const easing = easingNames[index];
  box.textContent = easing;
  
  box.addEventListener('click', async () => {
    await box.transform({ translateX: '100px' }, {
      duration: 1000,
      easing: easing
    });
    
    // Reset
    await box.transform({ translateX: '0px' }, {
      duration: 500,
      easing: 'linear'
    });
  });
});

// Choose easing based on animation type
function getEasing(type) {
  const easings = {
    'entrance': 'ease-out-cubic',
    'exit': 'ease-in-cubic',
    'bounce': 'ease-out-back',
    'smooth': 'ease-in-out-sine',
    'snappy': 'ease-out-quart'
  };
  
  return easings[type] || 'ease';
}

await element.fadeIn({ easing: getEasing('entrance') });
await element.fadeOut({ easing: getEasing('exit') });
```

**Easing Visual Guide:**
- **Linear** - Boring, constant speed
- **Ease** - Smooth, natural feeling
- **Ease-in** - Feels heavy, gathers momentum
- **Ease-out** - Feels light, settles down
- **Back** - Bouncy, slight overshoot
- **Elastic** - Would bounce back and forth
- **Circ** - Smooth circular motion
- **Expo** - Extreme speed changes

**Use Cases:**
- Fine-tuning animation feel
- Creating brand-specific motion
- UI responsiveness perception
- Matching design language
- Accessibility considerations

---

## Integration with .update()

Use animations directly with the DOM Helpers `.update()` method.

### Animation Updates

**What it does:** Allows you to trigger animations using the `.update()` method alongside other DOM updates. Provides a unified interface for modifying elements.

**Syntax:**
```javascript
element.update({
  fadeIn: options,
  fadeOut: options,
  slideUp: options,
  slideDown: options,
  slideToggle: options,
  transform: { transformations: {}, options: {} },
  stopAnimations: true
})
```

**Example:**
```javascript
// Fade in with update
const element = Elements('button#myBtn');
await element.update({
  fadeIn: { duration: 300 }
});

// Multiple updates including animation
const card = Elements('div.card');
await card.update({
  innerHTML: '<h2>New Title</h2>',
  classList: { add: ['highlighted'] },
  fadeIn: { duration: 500, easing: 'ease-out-cubic' }
});

// Transform in update
const box = Elements('div#box');
await box.update({
  style: { background: 'blue' },
  transform: {
    transformations: { scale: 1.2, rotate: '45deg' },
    options: { duration: 600 }
  }
});

// Stop animations
const element = Elements('div.animating');
element.update({
  stopAnimations: true
});

// Combined with form updates
const form = Elements('form#myForm');
await form.update({
  innerHTML: 'Processing...',
  fadeOut: { duration: 200 },
  classList: { add: ['loading'] }
});

// Collection update with animation
const items = Collections('.item');
await items.update({
  fadeIn: { duration: 300, stagger: 100 }
});
```

**Use Cases:**
- Unified DOM manipulation
- Animated content updates
- State transitions
- Streamlined event handlers
- Combined style and animation changes

---

## Browser Compatibility

Automatic detection and graceful degradation for older browsers.

### Supported Browsers

| Browser | Transitions | Transforms | Support |
|---------|-------------|-----------|---------|
| Chrome 45+ | ✅ | ✅ | Full |
| Firefox 39+ | ✅ | ✅ | Full |
| Safari 10.1+ | ✅ | ✅ | Full |
| Edge 15+ | ✅ | ✅ | Full |
| IE 11 | ⚠️ | ⚠️ | Limited |
| Opera 32+ | ✅ | ✅ | Full |
| Mobile Safari | ✅ | ✅ | Full |
| Chrome Mobile | ✅ | ✅ | Full |

**Graceful Degradation:**
- Modern browsers: Full CSS transition and transform support
- Older browsers: Fallback to instant or `setTimeout`-based animations
- No animations: Elements still become visible/hidden as needed
- Transforms unsupported: Scale/rotate handled via width/height

**Example:**
```javascript
// Automatically handles browser differences
await element.fadeIn(); // Works everywhere

// Transforms with fallback
if (Animation.isSupported('transforms')) {
  await element.transform({ scale: 1.5 });
} else {
  // Fallback for IE 11
  element.style.width = '150%';
  element.style.height = '150%';
}
```

---

## Best Practices

Proven techniques for optimal animation performance and user experience.

### Performance Optimization

**1. Use appropriate durations:**
```javascript
// ❌ Too slow - frustrates users
await element.fadeIn({ duration: 5000 });

// ✅ Good - fast enough to feel responsive
await element.fadeIn({ duration: 300 });

// ✅ Longer for complex animations
await element.transform({ 
  translateX: '100px',
  rotate: '360deg' 
}, { duration: 800 });
```

**2. Minimize simultaneous animations:**
```javascript
// ❌ Bad - animates too many elements at once
document.querySelectorAll('.item').forEach(el => {
  el.animate().fadeIn().play(); // All at same time
});

// ✅ Good - staggers animations
document.querySelectorAll('.item').fadeIn({
  stagger: 100
});
```

**3. Clean up after animations:**
```javascript
// ✅ Good - cleanup is automatic with cleanup: true (default)
await element.fadeIn({ cleanup: true });

// Manual cleanup if needed
if (!Animation.isSupported('transitions')) {
  element.style.opacity = '1';
  element.style.transition = 'none';
}
```

**4. Use appropriate easing:**
```javascript
// ❌ Jerky - linear feels mechanical
await element.fadeIn({ easing: 'linear' });

// ✅ Natural - ease-out feels smooth
await element.fadeIn({ easing: 'ease-out-cubic' });
```

### Accessibility

**1. Respect `prefers-reduced-motion`:**
```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const duration = prefersReducedMotion ? 0 : 300;

await element.fadeIn({ duration });
```

**2. Provide alternative interactions:**
```javascript
// Support both animation and instant reveal
const isAnimationSupported = Animation.isSupported('transitions');

if (isAnimationSupported) {
  await element.slideDown({ duration: 300 });
} else {
  element.style.display = 'block';
}
```

**3. Don't rely solely on animations:**
```javascript
// ✅ Good - animation enhances but isn't required
await element.fadeIn({ duration: 300 });
element.setAttribute('aria-hidden', 'false');

// ✅ Good - skip animation for screen readers
const isScreenReader = navigator.userAgent.includes('Screen Reader');
if (!isScreenReader) {
  await element.slideDown();
}
```

### User Experience

**1. Queue animations by default:**
```javascript
// ✅ Good - don't overwhelm with simultaneous animations
element.fadeIn({ queue: true });
element.slideDown({ queue: true });
element.fadeOut({ queue: true });
// They execute in order
```

**2. Provide feedback:**
```javascript
const button = document.getElementById('btn');

button.addEventListener('click', async () => {
  button.disabled = true;
  await button.update({
    textContent: 'Processing...',
    fadeOut: { duration: 200 }
  });
  
  // Do work...
  
  await button.update({
    textContent: 'Done!',
    fadeIn: { duration: 200 }
  });
  button.disabled = false;
});
```

**3. Cancel animations on user input:**
```javascript
const slider = document.getElementById('slider');

slider.addEventListener('click', () => {
  slider.stopAnimations(); // Stop auto-scroll animation
});

slider.addEventListener('touchstart', () => {
  slider.stopAnimations();
});
```

### Real-World Examples

**Modal Entrance/Exit:**
```javascript
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');

async function showModal() {
  await overlay.animate()
    .fadeIn({ duration: 200 })
    .play();
  
  await modal.animate()
    .slideDown({ duration: 300 })
    .play();
}

async function closeModal() {
  await modal.animate()
    .slideUp({ duration: 300 })
    .play();
  
  await overlay.fadeOut({ duration: 200 });
}
```

**Notification Toast:**
```javascript
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `toast toast-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  return notification.animate()
    .slideDown({ duration: 300 })
    .delay(3000)
    .slideUp({ duration: 300 })
    .play();
}

await showNotification('Success!', 'success');
```

**Page Transition:**
```javascript
async function navigateToPage(url) {
  const container = document.getElementById('content');
  
  // Fade out current content
  await container.fadeOut({ duration: 300 });
  
  // Load new content
  const response = await fetch(url);
  const html = await response.text();
  container.innerHTML = html;
  
  // Fade in new content
  await container.fadeIn({ duration: 300 });
}
```

**Loading Skeleton:**
```javascript
async function loadContent(url) {
  const container = document.getElementById('container');
  
  // Show skeleton
  container.innerHTML = createSkeleton();
  await container.slideDown({ duration: 200 });
  
  // Fetch data
  const data = await fetch(url).then(r => r.json());
  
  // Fade out skeleton
  await container.fadeOut({ duration: 150 });
  
  // Show content
  container.innerHTML = renderContent(data);
  await container.fadeIn({ duration: 300 });
}
```

**Staggered List Reveal:**
```javascript
async function revealList(listElement) {
  const items = listElement.querySelectorAll('li');
  
  await Promise.all(
    Array.from(items).map((item, index) =>
      item.animate()
        .delay(index * 100)
        .slideDown({ duration: 300 })
        .transform({ translateX: '-20px' }, { duration: 300 })
        .play()
    )
  );
}
```

---

## API Reference Summary

| Method | Purpose | Returns |
|--------|---------|---------|
| `fadeIn()` | Fade in element | Promise |
| `fadeOut()` | Fade out element | Promise |
| `slideUp()` | Collapse element | Promise |
| `slideDown()` | Expand element | Promise |
| `slideToggle()` | Toggle visibility | Promise |
| `transform()` | Apply CSS transforms | Promise |
| `animate()` | Create animation chain | AnimationChain |
| `stopAnimations()` | Stop all animations | Element/Collection |
| `setDefaults()` | Set default config | Animation |
| `getDefaults()` | Get current defaults | Object |
| `isSupported()` | Check feature support | Boolean |
| `clearQueue()` | Clear animation queue | Animation |
| `enhance()` | Add methods to element | Element/Collection |
| `chain()` | Create manual chain | AnimationChain |
| `.update()` | Animate via update | Promise/Element |

---

## Standalone Usage

While Animation is designed for DOM Helpers, it works standalone too.

```javascript
// Standalone without DOM Helpers
const { Animation } = require('dom-helpers-animation');

// Manual element enhancement
const element = document.getElementById('box');
Animation.enhance(element);
await element.fadeIn();

// Using static methods
await Animation.fadeIn(element, { duration: 500 });
await Animation.transform(element, { scale: 1.2 });

// Feature detection
if (Animation.isSupported('transforms')) {
  console.log('Ready for transforms');
}
```

---

## Troubleshooting

**Q: Animations not working**
```javascript
// Check browser support
if (!Animation.isSupported('transitions')) {
  console.log('Transitions not supported');
  // Provide fallback
}

// Ensure element is in DOM
document.body.appendChild(element);
await element.fadeIn();
```

**Q: Animation stops unexpectedly**
```javascript
// Check if queue is full
if (animationQueue.isEmpty(element)) {
  await element.fadeIn();
}

// Clear queue if needed
Animation.clearQueue(element);
```

**Q: Animations janky or stuttering**
```javascript
// Reduce number of simultaneous animations
const items = document.querySelectorAll('.item');
// ❌ Bad - too many at once
items.forEach(item => item.animate().fadeIn().play());

// ✅ Good - stagger them
items.fadeIn({ stagger: 50 });

// Use simpler animations
await element.fadeIn(); // Simpler than complex transforms
```

**Q: Easing not applying**
```javascript
// Use exact easing names
// ❌ Wrong
await element.fadeIn({ easing: 'cubic' });

// ✅ Correct
await element.fadeIn({ easing: 'ease-in-out-cubic' });

// Check available easings
console.log(Object.keys(Animation.easing));
```

**Q: Memory leaks with many animations**
```javascript
// Always cleanup after elements are removed
element.addEventListener('animationComplete', () => {
  Animation.clearQueue(element);
  element.remove();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  document.querySelectorAll('*').forEach(el => {
    Animation.clearQueue(el);
  });
});
```

---

## Performance Tips

**1. Use will-change CSS (sparingly):**
```javascript
element.style.willChange = 'transform, opacity';
await element.fadeIn();
element.style.willChange = 'auto'; // Reset
```

**2. Batch DOM updates:**
```javascript
// ❌ Multiple reflows
element.style.opacity = '0';
element.style.transition = 'opacity 0.3s';
element.style.opacity = '1';

// ✅ Single reflow with animation method
await element.fadeIn({ duration: 300 });
```

**3. Avoid transforming positioned elements:**
```javascript
// ✅ Prefer transforms over position changes
await element.transform({ translateX: '100px' });

// ❌ Avoid repositioning (triggers layout)
element.style.left = '100px';
```

---

## License

MIT License - Free for commercial and personal use.

---

## Support & Resources

- **GitHub:** [Project Repository]
- **Issues:** [Report bugs and request features]
- **Documentation:** This README
- **Examples:** See code examples throughout this document

---

## Version History

**v1.0.0** (Current)
- Initial release
- 6 core animation methods
- Animation chaining system
- Queue management
- 29 easing functions
- Full browser compatibility
- DOM Helpers integration
- Collection support
- Stagger effects

---

## Integration Checklist

✅ Automatically enhances Elements, Collections, and Selector helpers

✅ Works with dynamic/AJAX-loaded content

✅ Supports animation chaining and queuing

✅ Handles browser compatibility gracefully

✅ Cleans up styles automatically

✅ Works with .update() method

✅ Supports collection animations with stagger

✅ Respects animation queue settings

✅ Provides fallbacks for unsupported features

✅ Compatible with all modern and legacy browsers
```

---

