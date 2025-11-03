# DOM Helpers Components Library - Complete Method Reference

Based on the `dom-helpers-component.js` library, here's a comprehensive list of all available methods:

## **Components API (Main Interface)**

### Registration & Loading
1. **`Components.register(name, definition)`** - Register a component with a name and definition
2. **`Components.load(name, url)`** - Load a component from an external file
3. **`Components.unregister(name)`** - Unregister a component
4. **`Components.isRegistered(name)`** - Check if a component is registered
5. **`Components.getRegistered()`** - Get array of all registered component names

### Rendering
6. **`Components.render(name, container, data)`** - Render a registered component
7. **`Components.renderInline(definition, container, data)`** - Render an inline component without registration
8. **`Components.autoInit(root)`** - Auto-initialize all components in DOM
9. **`Components.processHTML(htmlString, container)`** - Process HTML string and replace component tags

### Updates & Data Binding
10. **`Components.update(updates)`** - Enhanced update method with dot notation support
11. **`Components.batchUpdate(updates)`** - Batch update multiple elements at once
12. **`Components.scope(...elementIds)`** - Create a scoped context for component updates
13. **`Components.createBinding(elementIds, mapFunction)`** - Create a data binding helper for reactive updates

### Instance Management
14. **`Components.getInstance(container)`** - Get component instance from container
15. **`Components.destroy(container)`** - Destroy a specific component
16. **`Components.destroyAll()`** - Destroy all active components

### Utilities
17. **`Components.getStats()`** - Get component system statistics
18. **`Components.configure(options)`** - Configure component system

### Internal/Private Methods (prefixed with `_`)
19. **`Components._processCustomTags(root)`** - Process custom component tags
20. **`Components._isComponentTag(tagName)`** - Check if tag name is a component tag
21. **`Components._tagNameToComponentName(tagName)`** - Convert tag name to component name
22. **`Components._extractPropsFromElement(element)`** - Extract props from element attributes
23. **`Components._attributeNameToPropName(attrName)`** - Convert attribute name to prop name
24. **`Components._extractDataFromElement(element)`** - Extract data from element for auto-init

---

## **Component Class (Instance Methods)**

### Lifecycle Management
25. **`component.render()`** - Render the component
26. **`component.destroy()`** - Destroy component and cleanup
27. **`component.on(lifecycle, callback)`** - Add lifecycle callback

### Data & State Updates
28. **`component.updateData(newData)`** - Update component data (smart, avoids unnecessary re-renders)
29. **`component.update(updates, options)`** - Granular DOM update without re-rendering
30. **`component.refresh()`** - Force a full re-render of the component
31. **`component.smartUpdate(newData, domUpdates)`** - Combined data and DOM update

### Events
32. **`component.emit(eventName, detail)`** - Emit custom event

### Internal/Private Methods
33. **`component._parseDefinition()`** - Parse component definition
34. **`component._extractTemplate(content)`** - Extract template from definition
35. **`component._extractStyles(content)`** - Extract styles from definition
36. **`component._extractScript(content)`** - Extract script from definition
37. **`component._createDOM()`** - Create DOM structure from template
38. **`component._injectScopedStyles()`** - Inject scoped styles
39. **`component._scopeCSS(css)`** - Scope CSS rules to component instance
40. **`component._applyScopeAttributes()`** - Apply scope attributes to elements
41. **`component._executeScript()`** - Execute component script with context
42. **`component._processNestedComponents()`** - Process nested components in template
43. **`component._extractDataFromElement(element)`** - Extract data from element attributes
44. **`component._enhanceWithDOMHelpers()`** - Enhance elements with DOM Helpers functionality
45. **`component._deepMergeUpdates(queue, updates)`** - Deep merge for style and dataset objects
46. **`component._flushUpdates()`** - Flush queued updates to DOM
47. **`component._applyUpdatesWithCoreSystem(updates)`** - Apply updates using core fine-grained system
48. **`component._applyUpdatesFallback(updates)`** - Fallback update implementation
49. **`component._callLifecycle(name)`** - Call lifecycle callbacks

---

## **Lifecycle Callbacks Available in Component Scripts**

When writing component scripts, these callbacks can be registered:

50. **`onBeforeMount(callback)`** - Called before component mounts
51. **`onMounted(callback)`** - Called after component mounts
52. **`onBeforeUpdate(callback)`** - Called before component updates
53. **`onUpdated(callback)`** - Called after component updates
54. **`onBeforeDestroy(callback)`** - Called before component destroys
55. **`onDestroyed(callback)`** - Called after component destroys

---

## **Component Script Context Methods**

Available inside component `<script>` blocks:

56. **`getData()`** - Get component data
57. **`setData(newData)`** - Set component data
58. **`emit(eventName, detail)`** - Emit custom event
59. **`destroy()`** - Destroy the component

---

## **Extended Elements API**

60. **`Elements.update(updates)`** - Enhanced update method (automatically added when library loads)

---

## **Total Count: 60 Methods**

- **18 Public Components API methods**
- **6 Private Components helper methods**
- **15 Public Component instance methods**
- **15 Private Component instance methods**
- **6 Lifecycle callbacks**
- **4 Component script context methods**
- **1 Enhanced Elements method**