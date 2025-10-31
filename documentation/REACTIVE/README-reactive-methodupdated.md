[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers - Reactive State Extension v2.0.2 - Complete Method List

## Core State Creation

- **`state(initialState)`** - Create a reactive state object
- **`createState(initialState, bindingDefs)`** - Create state with auto-bindings
- **`ref(value)`** - Create a reactive reference with `.value` property
- **`refs(defs)`** - Create multiple refs from object definition
- **`collection(items)`** - Create a reactive collection/list
- **`list(items)`** - Alias for collection()
- **`form(initialValues)`** - Create a form state manager
- **`async(initialValue)`** - Create async operation state
- **`store(initialState, options)`** - Create a store with getters/actions
- **`component(config)`** - Create a component with full lifecycle
- **`reactive(initialState)`** - Fluent builder pattern for state

## Instance Methods (on reactive state objects)

### State Management
- **`$computed(key, fn)`** - Add computed property
- **`$watch(keyOrFn, callback)`** - Watch for changes
- **`$batch(fn)`** - Batch multiple updates
- **`$notify(key)`** - Manually trigger updates for a key (or all if no key)
- **`$raw`** - Property getter to access non-reactive raw object
- **`$update(updates)`** - Mixed state + DOM updates (supports selectors and nested paths)
- **`$set(updates)`** - Functional updates with callbacks
- **`$bind(bindingDefs)`** - Create reactive DOM bindings

## Collection Instance Methods

- **`$add(item)`** - Add item to collection
- **`$remove(predicate)`** - Remove item by predicate function or direct value
- **`$update(predicate, updates)`** - Update item in collection by predicate or value
- **`$clear()`** - Clear all items from collection
- **`items`** - Property containing the reactive array

## Form Instance Methods

- **`$setValue(field, value)`** - Set form field value and mark as touched
- **`$setError(field, error)`** - Set or clear field error
- **`$reset(newValues)`** - Reset form to initial or new values
- **`values`** - Property containing form values
- **`errors`** - Property containing form errors
- **`touched`** - Property containing touched fields
- **`isSubmitting`** - Property for submission state
- **`isValid`** - Computed property for form validity
- **`isDirty`** - Computed property for form dirty state

## Async State Instance Methods

- **`$execute(fn)`** - Execute async operation and update state
- **`$reset()`** - Reset async state to initial values
- **`data`** - Property containing async data
- **`loading`** - Property for loading state
- **`error`** - Property containing error if any
- **`isSuccess`** - Computed property (data loaded, no error)
- **`isError`** - Computed property (has error, not loading)

## Component Instance Methods

- **`$destroy()`** - Clean up all effects, watchers, and bindings

## Ref Instance Methods

- **`value`** - Property to get/set the ref value
- **`valueOf()`** - Get primitive value
- **`toString()`** - Convert to string

## Reactivity Functions

- **`computed(state, defs)`** - Add multiple computed properties to state
- **`watch(state, defs)`** - Add multiple watchers to state
- **`effect(fn)`** - Create single reactive effect
- **`effects(defs)`** - Create multiple effects from object
- **`bindings(defs)`** - Create DOM bindings with selectors

## Batch Operations

- **`batch(fn)`** - Batch updates manually (executes fn and flushes after)
- **`pause()`** - Pause reactivity (increment batch depth)
- **`resume(flush)`** - Resume reactivity (decrement batch depth, optionally flush)
- **`untrack(fn)`** - Run function without tracking dependencies

## Utility Functions

- **`isReactive(value)`** - Check if value is reactive
- **`toRaw(value)`** - Get raw non-reactive value (handles nested RAW symbol)
- **`notify(state, key)`** - Manually notify dependencies for a key or all keys
- **`updateAll(state, updates)`** - Unified state + DOM updates

## Integration Methods (Elements namespace)

- **`Elements.state()`** - Create reactive state
- **`Elements.createState(initialState, bindingDefs)`** - Create state with bindings
- **`Elements.updateAll(state, updates)`** - Unified updates
- **`Elements.computed(state, defs)`** - Add computed properties
- **`Elements.watch(state, defs)`** - Add watchers
- **`Elements.effect(fn)`** - Create effect
- **`Elements.effects(defs)`** - Create multiple effects
- **`Elements.ref(value)`** - Create ref
- **`Elements.refs(defs)`** - Create multiple refs
- **`Elements.store(initialState, options)`** - Create store
- **`Elements.component(config)`** - Create component
- **`Elements.reactive(initialState)`** - Fluent builder
- **`Elements.bindings(defs)`** - Create bindings
- **`Elements.list(items)`** - Create collection
- **`Elements.batch(fn)`** - Batch updates
- **`Elements.isReactive(value)`** - Check reactive
- **`Elements.toRaw(value)`** - Get raw value
- **`Elements.notify(state, key)`** - Notify dependencies
- **`Elements.pause()`** - Pause reactivity
- **`Elements.resume(flush)`** - Resume reactivity
- **`Elements.untrack(fn)`** - Untrack dependencies
- **`Elements.bind(bindingDefs)`** - ID-based bindings (special)

## Integration Methods (Collections namespace)

- **`Collections.state()`** - Create reactive state
- **`Collections.createState(initialState, bindingDefs)`** - Create state with bindings
- **`Collections.updateAll(state, updates)`** - Unified updates
- **`Collections.computed(state, defs)`** - Add computed properties
- **`Collections.watch(state, defs)`** - Add watchers
- **`Collections.effect(fn)`** - Create effect
- **`Collections.effects(defs)`** - Create multiple effects
- **`Collections.ref(value)`** - Create ref
- **`Collections.refs(defs)`** - Create multiple refs
- **`Collections.store(initialState, options)`** - Create store
- **`Collections.component(config)`** - Create component
- **`Collections.reactive(initialState)`** - Fluent builder
- **`Collections.bindings(defs)`** - Create bindings
- **`Collections.list(items)`** - Create collection
- **`Collections.batch(fn)`** - Batch updates
- **`Collections.isReactive(value)`** - Check reactive
- **`Collections.toRaw(value)`** - Get raw value
- **`Collections.notify(state, key)`** - Notify dependencies
- **`Collections.pause()`** - Pause reactivity
- **`Collections.resume(flush)`** - Resume reactivity
- **`Collections.untrack(fn)`** - Untrack dependencies
- **`Collections.bind(bindingDefs)`** - Class-based bindings (special)

## Integration Methods (Selector namespace)

- **`Selector.state()`** - Create reactive state
- **`Selector.createState(initialState, bindingDefs)`** - Create state with bindings
- **`Selector.updateAll(state, updates)`** - Unified updates
- **`Selector.computed(state, defs)`** - Add computed properties
- **`Selector.watch(state, defs)`** - Add watchers
- **`Selector.effect(fn)`** - Create effect
- **`Selector.effects(defs)`** - Create multiple effects
- **`Selector.ref(value)`** - Create ref
- **`Selector.refs(defs)`** - Create multiple refs
- **`Selector.store(initialState, options)`** - Create store
- **`Selector.component(config)`** - Create component
- **`Selector.reactive(initialState)`** - Fluent builder
- **`Selector.bindings(defs)`** - Create bindings
- **`Selector.list(items)`** - Create collection
- **`Selector.batch(fn)`** - Batch updates
- **`Selector.isReactive(value)`** - Check reactive
- **`Selector.toRaw(value)`** - Get raw value
- **`Selector.notify(state, key)`** - Notify dependencies
- **`Selector.pause()`** - Pause reactivity
- **`Selector.resume(flush)`** - Resume reactivity
- **`Selector.untrack(fn)`** - Untrack dependencies

### Selector.query Methods
- **`Selector.query.state()`** - All core methods (same as above)
- **`Selector.query.bind(bindingDefs)`** - Single element bindings (special)

### Selector.queryAll Methods
- **`Selector.queryAll.state()`** - All core methods (same as above)
- **`Selector.queryAll.bind(bindingDefs)`** - Multiple element bindings (special)

## Builder Pattern Methods (reactive() return value)

- **`.state`** - Access to the created reactive state
- **`.computed(defs)`** - Add computed properties, returns builder
- **`.watch(defs)`** - Add watchers, returns builder
- **`.effect(fn)`** - Add effect, returns builder
- **`.bind(defs)`** - Add bindings, returns builder
- **`.action(name, fn)`** - Add single action, returns builder
- **`.actions(defs)`** - Add multiple actions, returns builder
- **`.build()`** - Build and return state with destroy method
- **`.destroy()`** - Clean up all effects

## Global Objects

- **`ReactiveState.create(initialState)`** - Create reactive state
- **`ReactiveState.form(initialValues)`** - Create form state
- **`ReactiveState.async(initialValue)`** - Create async state
- **`ReactiveState.collection(items)`** - Create collection
- **`ReactiveUtils`** - Object containing all API methods
- **`updateAll(state, updates)`** - Global unified updates function

## Internal Symbols (not for direct use)

- **`RAW`** - Symbol for accessing raw object
- **`IS_REACTIVE`** - Symbol for checking reactivity

## Store Options (for store() function)

- **`getters`** - Object of getter functions (become computed properties)
- **`actions`** - Object of action functions

## Component Config (for component() function)

- **`state`** - Initial state object
- **`computed`** - Object of computed property functions
- **`watch`** - Object of watcher functions
- **`effects`** - Object/array of effect functions
- **`bindings`** - Object of DOM bindings
- **`actions`** - Object of action functions
- **`mounted`** - Lifecycle hook called after setup
- **`unmounted`** - Lifecycle hook called on destroy

---

**Total Methods:** 100+ methods including all namespace integrations and variations