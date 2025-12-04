# Form System - Public Methods

Based on the form-system modules, here are all available public methods:

## **form.js** (Unified Entry Point)

### Forms Object Methods
- `Forms.formId` - Proxy access to forms by ID
- `Forms.stats()` - Get statistics
- `Forms.clear()` - Clear cache
- `Forms.destroy()` - Destroy helper
- `Forms.getAllForms()` - Get all forms with IDs
- `Forms.validateAll(rules)` - Validate all forms
- `Forms.resetAll()` - Reset all forms
- `Forms.configure(options)` - Configure options

### From form-core.js
- `Forms.getFormValues(form)` - Get form values as object
- `Forms.setFormValues(form, values)` - Set form values
- `Forms.getFormField(form, name)` - Get field by name/ID
- `Forms.setFormField(form, name, value)` - Set field value
- `Forms.serializeForm(form, format)` - Serialize form data

### From form-validation.js
- `Forms.validators` / `Forms.v` - Validator functions
- `Forms.validateForm(form, rules)` - Validate form

### From form-enhancements.js
- `Forms.enhance(form, options)` - Manually enhance form
- `Forms.submit(form, options)` - Manual submission
- `Forms.connect(domForm, reactiveForm, options)` - Connect reactive form

---

## **form-core.js**

### Core Functions
- `getFormValues(form)` - Extract all form values
- `setFormValues(form, values)` - Set multiple values
- `getFormField(form, name)` - Get field element
- `setFormField(form, name, value)` - Set field value
- `setFieldValue(field, value)` - Set individual field
- `serializeForm(form, format)` - Serialize ('object'|'json'|'formdata'|'urlencoded')

### Utilities
- `isForm(element)` - Check if element is form
- `getAllForms()` - Get all forms with IDs
- `getFormById(id)` - Find form by ID
- `enhanceFormWithCoreMethods(form)` - Enhance form
- `createFormUpdateMethod(form, originalUpdate)` - Create update method

### Enhanced Form Methods (auto-added)
- `form.values` - Getter/setter for form values
- `form.getField(name)` - Get field
- `form.setField(name, value)` - Set field
- `form.serialize(format)` - Serialize form
- `form.toJSON()` - Get as JSON
- `form.toFormData()` - Get as FormData
- `form.toURLEncoded()` - Get as URL encoded
- `form.reset(options)` - Enhanced reset

---

## **form-validation.js**

### Validators Object (`Forms.validators` or `Forms.v`)
- `required(message)` - Required field
- `email(message)` - Email format
- `minLength(min, message)` - Minimum length
- `maxLength(max, message)` - Maximum length
- `pattern(regex, message)` - Regex pattern
- `min(min, message)` - Minimum value
- `max(max, message)` - Maximum value
- `match(fieldName, message)` - Match another field
- `url(message)` - URL format
- `number(message)` - Number validation
- `integer(message)` - Integer validation
- `custom(fn)` - Custom validator

### Validation Functions
- `validateForm(form, rules)` - Validate entire form
- `validateField(value, rule, values, field)` - Validate single field
- `markFieldInvalid(field, message)` - Mark field invalid
- `clearFieldValidation(field)` - Clear field validation
- `clearFormValidation(form)` - Clear all validation
- `enhanceFormWithValidation(form)` - Add validation methods

### Enhanced Form Methods (auto-added)
- `form.validate(rules)` - Validate form
- `form.clearValidation()` - Clear validation
- `form.validateField(fieldName, rule)` - Validate single field

---

## **form-enhancements.js**

### Main Functions
- `enhancedSubmit(form, options)` - Enhanced submission
- `connectReactiveForm(domForm, reactiveForm, options)` - Bridge to reactive
- `initDeclarativeForm(form)` - Init from attributes
- `enhanceFormWithEnhancements(form)` - Add enhancement methods

### Configuration
- `FormEnhancements.configure(options)` - Set global config
- `FormEnhancements.getConfig()` - Get config

### Manual Operations
- `FormEnhancements.enhance(form, options)` - Enhance form
- `FormEnhancements.submit(form, options)` - Submit form
- `FormEnhancements.connect(domForm, reactiveForm, options)` - Connect forms

### State Management
- `FormEnhancements.getState(form)` - Get form state
- `FormEnhancements.clearQueue()` - Clear submission queue

### Utilities
- `FormEnhancements.disableButtons(form)` - Disable buttons
- `FormEnhancements.enableButtons(form)` - Enable buttons
- `FormEnhancements.showSuccess(form, message)` - Show success
- `FormEnhancements.showError(form, error)` - Show error

### Enhanced Form Methods (auto-added)
- `form.submitData(options)` - Enhanced submit
- `form.connectReactive(reactiveForm, options)` - Connect reactive
- `form.configure(options)` - Configure form

### Enhanced Submit Options
```javascript
{
  onSubmit: async (values, form) => {},
  beforeSubmit: async (values, form) => {},
  onSuccess: (result, values) => {},
  onError: (error) => {},
  transform: (values) => {},
  validate: true,
  validationRules: {},
  resetOnSuccess: true,
  successMessage: 'Success!',
  retryAttempts: 0,
  retryDelay: 1000
}
```
