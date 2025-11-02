# DOM Helpers Library - Complete Method Reference

Based on the `dom-helpers.js` (combined bundle) library, here's a comprehensive list of all available methods:

## **EnhancedUpdateUtility API**

### Core Update Functions
1. **`EnhancedUpdateUtility.createEnhancedUpdateMethod(context, isCollection)`** - Create enhanced update method
2. **`EnhancedUpdateUtility.enhanceElementWithUpdate(element)`** - Add update method to element
3. **`EnhancedUpdateUtility.enhanceCollectionWithUpdate(collection)`** - Add update method to collection
4. **`EnhancedUpdateUtility.autoEnhanceWithUpdate(obj)`** - Auto-enhance element or collection
5. **`EnhancedUpdateUtility.isCollection(obj)`** - Check if object is a collection
6. **`EnhancedUpdateUtility.updateSingleElement(element, updates)`** - Update single element
7. **`EnhancedUpdateUtility.updateCollection(collection, updates)`** - Update collection
8. **`EnhancedUpdateUtility.applyEnhancedUpdate(element, key, value)`** - Apply single update
9. **`EnhancedUpdateUtility.handleClassListUpdate(element, classListUpdates)`** - Handle classList updates
10. **`EnhancedUpdateUtility.createUpdateExample()`** - Create comprehensive update example

### Internal Update Functions
11. **`getPreviousProps(element)`** - Get previous props for element
12. **`storePreviousProps(element, key, value)`** - Store props for element
13. **`getElementEventListeners(element)`** - Get event listeners for element
14. **`isEqual(value1, value2)`** - Deep equality check
15. **`updateStyleProperties(element, newStyles)`** - Update styles with change detection
16. **`addEventListenerOnce(element, eventType, handler, options)`** - Add event listener with duplicate prevention
17. **`removeEventListenerIfPresent(element, eventType, handler, options)`** - Remove event listener if exists
18. **`handleEnhancedEventListener(element, value)`** - Handle event listener updates
19. **`handleEnhancedEventListenerWithTracking(element, value)`** - Handle event listeners with tracking
20. **`createEnhancedEventHandler(originalHandler)`** - Create enhanced event handler

---

## **Elements API (ID-based Access)**

### Element Access
21. **`Elements[elementId]`** - Access element by ID using proxy (e.g., `Elements.myButton`)
22. **`Elements.helper`** - Access ProductionElementsHelper instance
23. **`Elements.stats()`** - Get Elements system statistics
24. **`Elements.clear()`** - Clear the Elements cache
25. **`Elements.destroy()`** - Destroy the Elements helper

### Destructuring & Batch Access
26. **`Elements.destructure(...ids)`** - Get multiple elements as object
27. **`Elements.getRequired(...ids)`** - Get required elements (throws if missing)
28. **`Elements.waitFor(...ids)`** - Wait for elements to exist (async, with timeout)
29. **`Elements.get(id, fallback)`** - Get element with fallback value
30. **`Elements.exists(id)`** - Check if element exists
31. **`Elements.getMultiple(...ids)`** - Get multiple elements as object

### Element Manipulation
32. **`Elements.setProperty(id, property, value)`** - Set element property
33. **`Elements.getProperty(id, property, fallback)`** - Get element property
34. **`Elements.setAttribute(id, attribute, value)`** - Set element attribute
35. **`Elements.getAttribute(id, attribute, fallback)`** - Get element attribute

### Cache Management
36. **`Elements.isCached(id)`** - Check if element is cached
37. **`Elements.configure(options)`** - Configure Elements options

### Bulk Operations
38. **`Elements.update(updates)`** - Bulk update multiple elements by ID

---

## **ProductionElementsHelper Class Methods**

### Public Methods
39. **`helper.getStats()`** - Get detailed statistics
40. **`helper.clearCache()`** - Clear cache manually
41. **`helper.destroy()`** - Destroy helper and cleanup
42. **`helper.isCached(id)`** - Check if ID is cached
43. **`helper.getCacheSnapshot()`** - Get array of cached IDs
44. **`helper.destructure(...ids)`** - Get multiple elements
45. **`helper.getRequired(...ids)`** - Get required elements
46. **`helper.waitFor(...ids)`** - Wait for elements (async)
47. **`helper.get(id, fallback)`** - Get element with fallback
48. **`helper.exists(id)`** - Check element existence
49. **`helper.getMultiple(...ids)`** - Get multiple elements
50. **`helper.setProperty(id, property, value)`** - Set property
51. **`helper.getProperty(id, property, fallback)`** - Get property
52. **`helper.setAttribute(id, attribute, value)`** - Set attribute
53. **`helper.getAttribute(id, attribute, fallback)`** - Get attribute

### Private/Internal Methods
54. **`helper._initProxy()`** - Initialize proxy
55. **`helper._getElement(prop)`** - Get element by ID
56. **`helper._hasElement(prop)`** - Check if element exists
57. **`helper._getKeys()`** - Get all element IDs
58. **`helper._addToCache(id, element)`** - Add to cache
59. **`helper._initMutationObserver()`** - Initialize DOM observer
60. **`helper._processMutations(mutations)`** - Process DOM changes
61. **`helper._scheduleCleanup()`** - Schedule cache cleanup
62. **`helper._performCleanup()`** - Perform cleanup
63. **`helper._debounce(func, delay)`** - Debounce function
64. **`helper._log(message)`** - Log message
65. **`helper._warn(message)`** - Log warning
66. **`helper._enhanceElementWithUpdate(element)`** - Add update method to element

---

## **Collections API (Class/Tag/Name-based Access)**

### Collection Access
67. **`Collections.ClassName[className]`** - Get elements by class name
68. **`Collections.ClassName(className)`** - Function-style class access
69. **`Collections.TagName[tagName]`** - Get elements by tag name
70. **`Collections.TagName(tagName)`** - Function-style tag access
71. **`Collections.Name[name]`** - Get elements by name attribute
72. **`Collections.Name(name)`** - Function-style name access

### Utilities
73. **`Collections.helper`** - Access ProductionCollectionHelper instance
74. **`Collections.stats()`** - Get Collections statistics
75. **`Collections.clear()`** - Clear Collections cache
76. **`Collections.destroy()`** - Destroy Collections helper
77. **`Collections.isCached(type, value)`** - Check if collection is cached
78. **`Collections.getMultiple(requests)`** - Get multiple collections
79. **`Collections.waitFor(type, value, minCount, timeout)`** - Wait for collection (async)
80. **`Collections.enableEnhancedSyntax()`** - Enable enhanced syntax
81. **`Collections.disableEnhancedSyntax()`** - Disable enhanced syntax
82. **`Collections.configure(options)`** - Configure Collections options

### Bulk Operations
83. **`Collections.update(updates)`** - Bulk update multiple collections

---

## **Enhanced Collection Methods**

When a collection is accessed, it has these methods:

### Array-like Methods
84. **`collection.length`** - Get number of elements
85. **`collection.item(index)`** - Get element by index
86. **`collection.namedItem(name)`** - Get element by name
87. **`collection.toArray()`** - Convert to array
88. **`collection.forEach(callback, thisArg)`** - Iterate over elements
89. **`collection.map(callback, thisArg)`** - Map over elements
90. **`collection.filter(callback, thisArg)`** - Filter elements
91. **`collection.find(callback, thisArg)`** - Find element
92. **`collection.some(callback, thisArg)`** - Test if some match
93. **`collection.every(callback, thisArg)`** - Test if all match
94. **`collection.reduce(callback, initialValue)`** - Reduce elements

### Utility Methods
95. **`collection.first()`** - Get first element
96. **`collection.last()`** - Get last element
97. **`collection.at(index)`** - Get element at index (supports negative)
98. **`collection.isEmpty()`** - Check if empty

### DOM Manipulation
99. **`collection.addClass(className)`** - Add class to all elements
100. **`collection.removeClass(className)`** - Remove class from all
101. **`collection.toggleClass(className)`** - Toggle class on all
102. **`collection.setProperty(prop, value)`** - Set property on all
103. **`collection.setAttribute(attr, value)`** - Set attribute on all
104. **`collection.setStyle(styles)`** - Set styles on all
105. **`collection.on(event, handler)`** - Add event listener to all
106. **`collection.off(event, handler)`** - Remove event listener from all

### Filtering
107. **`collection.visible()`** - Filter visible elements
108. **`collection.hidden()`** - Filter hidden elements
109. **`collection.enabled()`** - Filter enabled elements
110. **`collection.disabled()`** - Filter disabled elements

### Update Method
111. **`collection.update(updates)`** - Update all elements in collection

---

## **ProductionCollectionHelper Class Methods**

### Public Methods
112. **`helper.getStats()`** - Get statistics
113. **`helper.clearCache()`** - Clear cache
114. **`helper.destroy()`** - Destroy helper
115. **`helper.isCached(type, value)`** - Check if cached
116. **`helper.getCacheSnapshot()`** - Get cache snapshot
117. **`helper.getMultiple(requests)`** - Get multiple collections
118. **`helper.waitForElements(type, value, minCount, timeout)`** - Wait for elements (async)
119. **`helper.enableEnhancedSyntax()`** - Enable enhanced syntax
120. **`helper.disableEnhancedSyntax()`** - Disable enhanced syntax

### Private/Internal Methods
121. **`helper._initProxies()`** - Initialize proxies
122. **`helper._createCollectionProxy(type)`** - Create collection proxy
123. **`helper._createEnhancedCollectionProxy(collection)`** - Create enhanced proxy
124. **`helper._createElementProxy(element)`** - Create element proxy
125. **`helper._createCacheKey(type, value)`** - Create cache key
126. **`helper._getCollection(type, value)`** - Get collection
127. **`helper._isValidCollection(collection)`** - Validate collection
128. **`helper._enhanceCollection(htmlCollection, type, value)`** - Enhance collection
129. **`helper._createEmptyCollection()`** - Create empty collection
130. **`helper._addToCache(cacheKey, collection)`** - Add to cache
131. **`helper._initMutationObserver()`** - Initialize observer
132. **`helper._processMutations(mutations)`** - Process mutations
133. **`helper._scheduleCleanup()`** - Schedule cleanup
134. **`helper._performCleanup()`** - Perform cleanup
135. **`helper._debounce(func, delay)`** - Debounce function
136. **`helper._log(message)`** - Log message
137. **`helper._warn(message)`** - Log warning
138. **`helper._applyEnhancedUpdateToElement(element, key, value)`** - Apply update to element
139. **`helper._handleClassListUpdate(element, classListUpdates)`** - Handle classList update
140. **`helper._enhanceCollectionWithUpdate(collection)`** - Add update method to collection

---

## **Selector API (querySelector/querySelectorAll with Caching)**

### Query Methods
141. **`Selector.query(selector)`** - Query single element (querySelector)
142. **`Selector.query[property]`** - Enhanced property access for queries
143. **`Selector.queryAll(selector)`** - Query all elements (querySelectorAll)
144. **`Selector.queryAll[property]`** - Enhanced property access for queryAll

### Scoped Queries
145. **`Selector.Scoped.within(container, selector)`** - Query within container (single)
146. **`Selector.Scoped.withinAll(container, selector)`** - Query within container (all)

### Utilities
147. **`Selector.helper`** - Access ProductionSelectorHelper instance
148. **`Selector.stats()`** - Get Selector statistics
149. **`Selector.clear()`** - Clear Selector cache
150. **`Selector.destroy()`** - Destroy Selector helper
151. **`Selector.waitFor(selector, timeout)`** - Wait for selector (async)
152. **`Selector.waitForAll(selector, minCount, timeout)`** - Wait for multiple (async)
153. **`Selector.enableEnhancedSyntax()`** - Enable enhanced syntax
154. **`Selector.disableEnhancedSyntax()`** - Disable enhanced syntax
155. **`Selector.configure(options)`** - Configure Selector options

### Bulk Operations
156. **`Selector.update(updates)`** - Bulk update by selectors

---

## **Enhanced NodeList/Collection Methods**

When using Selector.queryAll(), the result has these methods:

### Standard Methods
157. **`nodeList.length`** - Get number of elements
158. **`nodeList.item(index)`** - Get element by index
159. **`nodeList.entries()`** - Get entries iterator
160. **`nodeList.keys()`** - Get keys iterator
161. **`nodeList.values()`** - Get values iterator

### Enhanced Array Methods
162. **`nodeList.toArray()`** - Convert to array
163. **`nodeList.forEach(callback, thisArg)`** - Iterate
164. **`nodeList.map(callback, thisArg)`** - Map
165. **`nodeList.filter(callback, thisArg)`** - Filter
166. **`nodeList.find(callback, thisArg)`** - Find
167. **`nodeList.some(callback, thisArg)`** - Test some
168. **`nodeList.every(callback, thisArg)`** - Test all
169. **`nodeList.reduce(callback, initialValue)`** - Reduce

### Utility Methods
170. **`nodeList.first()`** - Get first element
171. **`nodeList.last()`** - Get last element
172. **`nodeList.at(index)`** - Get at index
173. **`nodeList.isEmpty()`** - Check if empty

### DOM Manipulation
174. **`nodeList.addClass(className)`** - Add class to all
175. **`nodeList.removeClass(className)`** - Remove class from all
176. **`nodeList.toggleClass(className)`** - Toggle class on all
177. **`nodeList.setProperty(prop, value)`** - Set property on all
178. **`nodeList.setAttribute(attr, value)`** - Set attribute on all
179. **`nodeList.setStyle(styles)`** - Set styles on all
180. **`nodeList.on(event, handler)`** - Add event listener to all
181. **`nodeList.off(event, handler)`** - Remove event listener from all

### Filtering
182. **`nodeList.visible()`** - Filter visible
183. **`nodeList.hidden()`** - Filter hidden
184. **`nodeList.enabled()`** - Filter enabled
185. **`nodeList.disabled()`** - Filter disabled

### Nested Queries
186. **`nodeList.within(selector)`** - Query within results

### Update Method
187. **`nodeList.update(updates)`** - Update all elements

---

## **ProductionSelectorHelper Class Methods**

### Public Methods
188. **`helper.getStats()`** - Get statistics with selector breakdown
189. **`helper.clearCache()`** - Clear cache
190. **`helper.destroy()`** - Destroy helper
191. **`helper.waitForSelector(selector, timeout)`** - Wait for selector (async)
192. **`helper.waitForSelectorAll(selector, minCount, timeout)`** - Wait for multiple (async)
193. **`helper.enableEnhancedSyntax()`** - Enable enhanced syntax
194. **`helper.disableEnhancedSyntax()`** - Disable enhanced syntax

### Private/Internal Methods
195. **`helper._buildSelectorPatterns()`** - Build selector pattern matchers
196. **`helper._initProxies()`** - Initialize proxies
197. **`helper._initEnhancedSyntax()`** - Initialize enhanced syntax
198. **`helper._createElementProxy(element)`** - Create element proxy
199. **`helper._createCollectionProxy(collection)`** - Create collection proxy
200. **`helper._createQueryFunction(type)`** - Create query function
201. **`helper._normalizeSelector(prop)`** - Normalize property to selector
202. **`helper._camelToKebab(str)`** - Convert camelCase to kebab-case
203. **`helper._createCacheKey(type, selector)`** - Create cache key
204. **`helper._getQuery(type, selector)`** - Get query result
205. **`helper._getScopedQuery(container, selector, type, cacheKey)`** - Get scoped query
206. **`helper._isValidQuery(cached, type)`** - Validate cached query
207. **`helper._enhanceNodeList(nodeList, selector)`** - Enhance NodeList
208. **`helper._createEmptyCollection()`** - Create empty collection
209. **`helper._trackSelectorType(selector)`** - Track selector type statistics
210. **`helper._classifySelector(selector)`** - Classify selector type
211. **`helper._addToCache(cacheKey, result)`** - Add to cache
212. **`helper._initMutationObserver()`** - Initialize observer
213. **`helper._processMutations(mutations)`** - Process mutations
214. **`helper._scheduleCleanup()`** - Schedule cleanup
215. **`helper._performCleanup()`** - Perform cleanup
216. **`helper._debounce(func, delay)`** - Debounce function
217. **`helper._log(message)`** - Log message
218. **`helper._warn(message)`** - Log warning
219. **`helper._enhanceElementWithUpdate(element)`** - Add update method
220. **`helper._enhanceCollectionWithUpdate(collection)`** - Add update method to collection

---

## **DOMHelpers Combined API**

### Access Points
221. **`DOMHelpers.Elements`** - Access Elements API
222. **`DOMHelpers.Collections`** - Access Collections API
223. **`DOMHelpers.Selector`** - Access Selector API
224. **`DOMHelpers.ProductionElementsHelper`** - Elements helper class
225. **`DOMHelpers.ProductionCollectionHelper`** - Collections helper class
226. **`DOMHelpers.ProductionSelectorHelper`** - Selector helper class

### Unified Methods
227. **`DOMHelpers.version`** - Get library version
228. **`DOMHelpers.isReady()`** - Check if all helpers are available
229. **`DOMHelpers.getStats()`** - Get combined statistics
230. **`DOMHelpers.clearAll()`** - Clear all caches
231. **`DOMHelpers.destroyAll()`** - Destroy all helpers
232. **`DOMHelpers.configure(options)`** - Configure all helpers

---

## **Enhanced createElement API**

### Element Creation
233. **`createElement(tagName, options)`** - Enhanced element creation
234. **`createElement.bulk(definitions)`** - Bulk element creation
235. **`createElement.update(definitions)`** - Alias for bulk creation
236. **`createElement.restore()`** - Restore original createElement

### DOMHelpers createElement Methods
237. **`DOMHelpers.createElement(tagName, options)`** - Create element
238. **`DOMHelpers.enableCreateElementEnhancement()`** - Enable auto-enhancement
239. **`DOMHelpers.disableCreateElementEnhancement()`** - Disable auto-enhancement

---

## **Bulk Creation Result Object**

When using `createElement.bulk()`, the result has these methods:

### Element Access
240. **`result[tagName]`** - Access created element by tag name
241. **`result.toArray(...tagNames)`** - Get elements as array
242. **`result.ordered(...tagNames)`** - Get elements in order
243. **`result.all`** - Get all elements array (getter)
244. **`result.count`** - Get element count (getter)
245. **`result.keys`** - Get array of element keys (getter)

### Manipulation
246. **`result.updateMultiple(updates)`** - Update multiple elements
247. **`result.has(key)`** - Check if element exists
248. **`result.get(key, fallback)`** - Get element with fallback
249. **`result.forEach(callback)`** - Iterate over elements
250. **`result.map(callback)`** - Map over elements
251. **`result.filter(callback)`** - Filter elements

### DOM Operations
252. **`result.appendTo(container)`** - Append all to container
253. **`result.appendToOrdered(container, ...tagNames)`** - Append specific elements

---

## **Element.update() Method Properties**

Available update properties for any enhanced element or collection:

### Content Updates
254. **`textContent`** - Set text content
255. **`innerHTML`** - Set inner HTML
256. **`innerText`** - Set inner text

### Style Updates
257. **`style`** - Object with style properties
258. **`style.{property}`** - Individual style property

### Class List Operations
259. **`classList.add`** - Add classes (string or array)
260. **`classList.remove`** - Remove classes (string or array)
261. **`classList.toggle`** - Toggle classes (string or array)
262. **`classList.replace`** - Replace class (array: [old, new])
263. **`classList.contains`** - Check contains (for debugging)

### Attributes
264. **`setAttribute`** - Set attributes (array [name, value] or object)
265. **`removeAttribute`** - Remove attributes (string or array)
266. **`getAttribute`** - Get attribute (for debugging)

### Dataset
267. **`dataset`** - Object with data attributes
268. **`dataset.{key}`** - Individual data attribute

### Event Handling
269. **`addEventListener`** - Add event listener (array or object)
270. **`removeEventListener`** - Remove event listener (array)

### DOM Properties
271. **`id`** - Set element ID
272. **`className`** - Set class name
273. **`value`** - Set value
274. **`disabled`** - Set disabled state
275. **`checked`** - Set checked state
276. **`src`** - Set source
277. **`href`** - Set href
278. **`alt`** - Set alt text
279. **`title`** - Set title
280. **`placeholder`** - Set placeholder
281. **Any DOM property** - Set any valid DOM property

### DOM Methods
282. **`focus`** - Call focus() method (empty array or args)
283. **`blur`** - Call blur() method
284. **`click`** - Call click() method
285. **`scrollIntoView`** - Call scrollIntoView() method (with options)
286. **Any DOM method** - Call any valid DOM method

---

## **Configuration Options**

### Elements Configuration
287. **`enableLogging`** - Enable console logging
288. **`autoCleanup`** - Enable automatic cache cleanup
289. **`cleanupInterval`** - Cleanup interval in ms
290. **`maxCacheSize`** - Maximum cache size
291. **`debounceDelay`** - Debounce delay for mutations

### Collections Configuration
292. **`enableEnhancedSyntax`** - Enable enhanced property access
293. **(same as Elements)** - Plus all Elements options

### Selector Configuration
294. **`enableSmartCaching`** - Enable smart cache invalidation
295. **`enableEnhancedSyntax`** - Enable enhanced syntax
296. **(same as Elements)** - Plus all Elements options

### Global Configuration
297. **`autoEnhanceCreateElement`** - Auto-enhance createElement (default: true)

---

## **Statistics Objects**

### Elements Stats
298. **`hits`** - Cache hit count
299. **`misses`** - Cache miss count
300. **`cacheSize`** - Current cache size
301. **`lastCleanup`** - Last cleanup timestamp
302. **`hitRate`** - Cache hit rate (0-1)
303. **`uptime`** - Time since last cleanup

### Collections Stats
304. **(same as Elements)** - Same statistics structure

### Selector Stats
305. **(same as Elements)** - Plus:
306. **`selectorBreakdown`** - Object with selector type counts

---

## **Total Count: 306+ Methods/Properties/Features**

### Breakdown by Category:
- **20 EnhancedUpdateUtility methods**
- **18 Elements API methods**
- **28 ProductionElementsHelper methods**
- **17 Collections API methods**
- **29 ProductionCollectionHelper methods**
- **28 Enhanced Collection methods**
- **16 Selector API methods**
- **30 ProductionSelectorHelper methods**
- **28 Enhanced NodeList methods**
- **11 DOMHelpers combined API methods**
- **7 createElement API methods**
- **14 Bulk creation result methods**
- **33 Element.update() properties**
- **11 Configuration options**
- **9 Statistics properties**

This comprehensive DOM manipulation library provides a complete toolkit for efficient, performant, and developer-friendly DOM operations with intelligent caching, fine-grained updates, and seamless integration across all modules!