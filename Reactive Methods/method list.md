# Complete List of Public Methods - DOM Helpers Reactive Library

## Core State Methods (reactive-core.js)

### State Creation
- `state()` - Create basic reactive state
- `createState()` - Create state with automatic bindings
- `ref()` - Create reactive reference with .value property
- `refs()` - Create multiple refs from object definition
- `store()` - Create store with getters and actions
- `component()` - Create component with full lifecycle
- `reactive()` - Builder pattern for fluent API
- `async()` - Create async state with loading/error tracking

### Computed Properties
- `computed()` - Add computed properties to state
- `$computed()` - Instance method to add computed property

### Watchers
- `watch()` - Watch properties for changes
- `$watch()` - Instance method to watch property

### Effects
- `effect()` - Create reactive effect
- `effects()` - Create multiple effects

### Bindings
- `bindings()` - Create selector-based bindings
- `$bind()` - Instance method to create bindings

### Updates
- `updateAll()` - Unified state and DOM updates
- `$update()` - Instance method for mixed updates
- `$set()` - Instance method for functional updates

### Utilities
- `batch()` - Execute function in batch context
- `$batch()` - Instance method for batched execution
- `isReactive()` - Check if value is reactive
- `toRaw()` - Get non-reactive value
- `$raw` - Instance property to get raw value
- `notify()` - Manually trigger effects
- `$notify()` - Instance method to trigger effects
- `pause()` - Pause reactive updates
- `resume()` - Resume reactive updates
- `untrack()` - Execute without tracking dependencies
- `getNestedProperty()` - Get nested property value
- `setNestedProperty()` - Set nested property value
- `applyValue()` - Apply value to DOM element

### Component Lifecycle
- `$destroy()` - Destroy component and cleanup

### Builder Methods (reactive builder)
- `computed()` - Add computed properties (builder)
- `watch()` - Add watchers (builder)
- `effect()` - Add effect (builder)
- `bind()` - Add bindings (builder)
- `action()` - Add single action (builder)
- `actions()` - Add multiple actions (builder)
- `build()` - Build final state
- `destroy()` - Destroy builder state

### Async State Methods
- `$execute()` - Execute async function with tracking
- `$reset()` - Reset async state

## Collections Methods (reactive-collections.js)

### Collection Creation
- `create()` - Create reactive collection
- `createWithComputed()` - Create collection with computed properties
- `createFiltered()` - Create filtered view of collection
- `collection()` - Alias for create
- `list()` - Alias for create

### Basic Operations
- `add()` - Add item to collection
- `remove()` - Remove item from collection
- `update()` - Update item in collection
- `clear()` - Clear all items

### Search & Filter
- `find()` - Find item in collection
- `filter()` - Filter items
- `map()` - Map items
- `forEach()` - Iterate over items

### Sorting & Ordering
- `sort()` - Sort items
- `reverse()` - Reverse items

### Getters
- `length` - Get collection length (property)
- `first` - Get first item (property)
- `last` - Get last item (property)

### Array Methods
- `at()` - Get item at index
- `includes()` - Check if includes item
- `indexOf()` - Get index of item
- `slice()` - Get slice of items
- `splice()` - Splice items
- `push()` - Push items to end
- `pop()` - Pop item from end
- `shift()` - Shift item from start
- `unshift()` - Unshift items to start

### Advanced Operations
- `toggle()` - Toggle boolean field
- `removeWhere()` - Remove all matching items
- `updateWhere()` - Update all matching items
- `reset()` - Reset collection with new items
- `toArray()` - Convert to plain array
- `isEmpty()` - Check if empty

## Forms Methods (reactive-forms.js)

### Form Creation
- `create()` - Create reactive form
- `form()` - Alias for create

### Value Management
- `setValue()` - Set single field value
- `setValues()` - Set multiple field values
- `getValue()` - Get field value

### Error Management
- `setError()` - Set field error
- `setErrors()` - Set multiple errors
- `clearError()` - Clear field error
- `clearErrors()` - Clear all errors
- `hasError()` - Check if field has error
- `getError()` - Get field error message

### Touched State Management
- `setTouched()` - Mark field as touched
- `setTouchedFields()` - Mark multiple fields as touched
- `touchAll()` - Mark all fields as touched
- `isTouched()` - Check if field is touched
- `shouldShowError()` - Check if should show error

### Validation
- `validateField()` - Validate single field
- `validate()` - Validate all fields

### Reset
- `reset()` - Reset form to initial values
- `resetField()` - Reset single field

### Submission
- `submit()` - Handle form submission

### Event Handlers
- `handleChange()` - Handle input change event
- `handleBlur()` - Handle input blur event
- `getFieldProps()` - Get field props for binding

### DOM Binding
- `bindToInputs()` - Bind form to DOM inputs

### Serialization
- `toObject()` - Convert to plain object

### Computed Properties (Form)
- `isValid` - Check if form is valid (property)
- `isDirty` - Check if form is dirty (property)
- `hasErrors` - Check if has errors (property)
- `touchedFields` - Get touched fields (property)
- `errorFields` - Get error fields (property)

## Validators (reactive-forms.js)

### Built-in Validators
- `validators.required()` - Required field validator
- `validators.email()` - Email format validator
- `validators.minLength()` - Minimum length validator
- `validators.maxLength()` - Maximum length validator
- `validators.pattern()` - Pattern/regex validator
- `validators.min()` - Minimum value validator
- `validators.max()` - Maximum value validator
- `validators.match()` - Match field validator
- `validators.custom()` - Custom validator
- `validators.combine()` - Combine multiple validators

### Validator Aliases
- `v.required()` - Alias for validators.required
- `v.email()` - Alias for validators.email
- `v.minLength()` - Alias for validators.minLength
- `v.maxLength()` - Alias for validators.maxLength
- `v.pattern()` - Alias for validators.pattern
- `v.min()` - Alias for validators.min
- `v.max()` - Alias for validators.max
- `v.match()` - Alias for validators.match
- `v.custom()` - Alias for validators.custom
- `v.combine()` - Alias for validators.combine

## Array Support Methods (reactive-array-support.js)

### Array Patching
- `state()` - Enhanced state creation with array support
- `patchArray()` - Manually patch array property

### Reactive Array Methods (automatically patched)
- `push()` - Add to end (reactive)
- `pop()` - Remove from end (reactive)
- `shift()` - Remove from start (reactive)
- `unshift()` - Add to start (reactive)
- `splice()` - Add/remove at index (reactive)
- `sort()` - Sort in place (reactive)
- `reverse()` - Reverse in place (reactive)
- `fill()` - Fill with value (reactive)
- `copyWithin()` - Copy within array (reactive)

## Module Loaders (reactive.js)

### Loading Functions
- `loadAll()` - Load all reactive modules
- `loadCore()` - Load core module only
- `loadArraySupport()` - Load array support module
- `loadCollections()` - Load collections module
- `loadForms()` - Load forms module

---

**Total Public Methods: 140+**