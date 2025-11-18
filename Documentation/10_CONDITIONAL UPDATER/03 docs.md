# Yes! Functions Work Perfectly in Conditions

The Conditions module (both base and with the default extension) **fully supports functions** in multiple ways. Let me show you all the possibilities:

---

## 1. Functions as Property Values

You can use functions to compute values dynamically based on the current state:

### Basic Example

```javascript
const count = ReactiveUtils.state(5);

Conditions.whenState(
  () => count.value,
  {
    '>0': {
      // Function executed each time condition matches
      textContent: () => `You have ${count.value} items`,
      title: () => `Count: ${count.value}`,
      style: {
        color: () => count.value > 10 ? 'red' : 'green'
      }
    }
  },
  '#counter'
);
```

### Advanced Example

```javascript
const user = ReactiveUtils.state({
  name: 'Alice',
  points: 150,
  level: 3
});

Conditions.whenState(
  () => user.value.level,
  {
    '1-2': {
      textContent: () => `Beginner: ${user.value.name} (${user.value.points} pts)`,
      style: {
        backgroundColor: () => {
          // Complex logic in function
          const ratio = user.value.points / 100;
          return `rgba(0, 255, 0, ${ratio})`;
        }
      }
    },
    '3-5': {
      textContent: () => `Intermediate: ${user.value.name} (${user.value.points} pts)`,
      innerHTML: () => `
        <div class="user-card">
          <h3>${user.value.name}</h3>
          <div class="progress">
            <div style="width: ${(user.value.points / 500) * 100}%"></div>
          </div>
          <p>${user.value.points} / 500 points</p>
        </div>
      `
    },
    'default': {
      textContent: () => `Level ${user.value.level}: ${user.value.name}`
    }
  },
  '#userBadge'
);
```

---

## 2. Event Handler Functions

Execute functions when events occur:

### Basic Example

```javascript
const isEnabled = ReactiveUtils.state(false);

Conditions.whenState(
  () => isEnabled.value,
  {
    'true': {
      textContent: 'Click Me!',
      // Function executed on click
      onclick: () => {
        console.log('Button clicked!');
        alert('You clicked the button');
      },
      // Or use addEventListener
      addEventListener: {
        click: () => console.log('Clicked'),
        mouseenter: () => console.log('Mouse entered'),
        dblclick: (e) => {
          console.log('Double clicked at', e.clientX, e.clientY);
        }
      }
    },
    'false': {
      textContent: 'Disabled',
      onclick: null // Remove handler
    }
  },
  '#actionButton'
);
```

### Advanced Example with Complex Event Logic

```javascript
const gameState = ReactiveUtils.state({
  mode: 'playing',
  score: 0,
  lives: 3
});

Conditions.whenState(
  () => gameState.value.mode,
  {
    'playing': {
      addEventListener: {
        // Keyboard controls
        keydown: (e) => {
          switch(e.key) {
            case 'ArrowUp':
              movePlayer('up');
              break;
            case 'ArrowDown':
              movePlayer('down');
              break;
            case ' ':
              shootProjectile();
              break;
            case 'p':
              gameState.value = { ...gameState.value, mode: 'paused' };
              break;
          }
        },
        // Mouse/touch controls
        click: (e) => {
          const rect = e.target.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          handleGameClick(x, y);
        },
        // Track mouse for aiming
        mousemove: (e) => {
          updateCrosshair(e.clientX, e.clientY);
        }
      },
      textContent: () => `Score: ${gameState.value.score} | Lives: ${gameState.value.lives}`
    },
    'paused': {
      addEventListener: {
        keydown: (e) => {
          if (e.key === 'p') {
            gameState.value = { ...gameState.value, mode: 'playing' };
          }
        },
        click: () => {
          gameState.value = { ...gameState.value, mode: 'playing' };
        }
      },
      innerHTML: '<div class="pause-screen">PAUSED<br>Press P or Click to Resume</div>'
    },
    'gameover': {
      addEventListener: {
        click: () => restartGame(),
        keydown: (e) => {
          if (e.key === 'r') restartGame();
        }
      },
      innerHTML: () => `
        <div class="gameover-screen">
          <h2>GAME OVER</h2>
          <p>Final Score: ${gameState.value.score}</p>
          <button onclick="restartGame()">Play Again (R)</button>
        </div>
      `
    },
    'default': {
      addEventListener: {
        click: () => console.log('Unknown game mode:', gameState.value.mode)
      }
    }
  },
  '#gameCanvas'
);
```

---

## 3. Functions in the Conditions Object

The entire conditions object can be a function for dynamic condition sets:

### Basic Example

```javascript
const temperature = ReactiveUtils.state(72);
const unit = ReactiveUtils.state('F');

Conditions.whenState(
  () => temperature.value,
  // Conditions as a function - evaluated each time
  () => {
    const isCelsius = unit.value === 'C';
    
    if (isCelsius) {
      return {
        '<0': { 
          textContent: '🥶 Freezing',
          style: { color: 'blue' }
        },
        '0-20': { 
          textContent: '🌡️ Cold',
          style: { color: 'lightblue' }
        },
        '20-30': { 
          textContent: '😊 Pleasant',
          style: { color: 'green' }
        },
        '>30': { 
          textContent: '🥵 Hot',
          style: { color: 'red' }
        }
      };
    } else {
      return {
        '<32': { 
          textContent: '🥶 Freezing',
          style: { color: 'blue' }
        },
        '32-68': { 
          textContent: '🌡️ Cold',
          style: { color: 'lightblue' }
        },
        '68-86': { 
          textContent: '😊 Pleasant',
          style: { color: 'green' }
        },
        '>86': { 
          textContent: '🥵 Hot',
          style: { color: 'red' }
        }
      };
    }
  },
  '#tempDisplay'
);
```

### Advanced Example with Dynamic Conditions

```javascript
const product = ReactiveUtils.state({
  price: 99.99,
  stock: 15,
  discount: 0,
  currency: 'USD'
});

const user = ReactiveUtils.state({
  country: 'US',
  isPremium: false,
  cartValue: 0
});

Conditions.whenState(
  () => product.value.stock,
  // Dynamic conditions based on multiple factors
  () => {
    const finalPrice = product.value.price * (1 - product.value.discount);
    const hasPremiumDiscount = user.value.isPremium;
    const hasVolumeDiscount = user.value.cartValue > 500;
    const currencySymbol = getCurrencySymbol(product.value.currency);
    
    // Determine stock thresholds based on user type
    const lowStockThreshold = hasPremiumDiscount ? 10 : 5;
    
    return {
      '0': {
        innerHTML: `
          <div class="out-of-stock">
            <h3>Out of Stock</h3>
            <button onclick="notifyWhenAvailable()">Notify Me</button>
          </div>
        `,
        classList: { add: 'unavailable' },
        onclick: () => {
          console.log('Product unavailable');
          showNotificationModal();
        }
      },
      [`1-${lowStockThreshold}`]: {
        innerHTML: () => `
          <div class="low-stock-warning">
            <p>⚠️ Only ${product.value.stock} left!</p>
            <p class="price">${currencySymbol}${finalPrice.toFixed(2)}</p>
            ${hasPremiumDiscount ? '<span class="premium-badge">Premium Price</span>' : ''}
          </div>
        `,
        style: {
          backgroundColor: '#fff3e0',
          borderColor: '#ff9800'
        },
        onclick: () => {
          addToCart(product.value);
          trackUrgentPurchase();
        }
      },
      [`>${lowStockThreshold}`]: {
        innerHTML: () => `
          <div class="in-stock">
            <p>✓ In Stock</p>
            <p class="price">${currencySymbol}${finalPrice.toFixed(2)}</p>
            ${hasVolumeDiscount ? '<span class="volume-discount">Volume Discount Applied</span>' : ''}
          </div>
        `,
        style: {
          backgroundColor: '#e8f5e9',
          borderColor: '#4caf50'
        },
        onclick: () => {
          addToCart(product.value);
          trackNormalPurchase();
        }
      },
      'default': {
        innerHTML: '<div class="error">Unable to determine stock status</div>',
        onclick: () => console.error('Stock data invalid:', product.value.stock)
      }
    };
  },
  '#productAvailability'
);
```

---

## 4. Callback Functions After State Changes

Execute functions as side effects when conditions match:

### Using Custom Property Handler

```javascript
// Register a custom handler that executes functions
Conditions.registerHandler('onMatch', {
  test: (key) => key === 'onMatch',
  apply: (element, fn) => {
    if (typeof fn === 'function') {
      fn(element);
    }
  }
});

// Now use it
const status = ReactiveUtils.state('idle');

Conditions.whenState(
  () => status.value,
  {
    'loading': {
      textContent: 'Loading...',
      classList: { add: 'spinner' },
      // Execute function when this condition matches
      onMatch: (el) => {
        console.log('Loading started');
        startLoadingAnimation(el);
        trackEvent('loading_started');
      }
    },
    'success': {
      textContent: '✓ Success',
      onMatch: (el) => {
        console.log('Success!');
        playSuccessSound();
        confetti(el);
        setTimeout(() => {
          status.value = 'idle';
        }, 2000);
      }
    },
    'error': {
      textContent: '✗ Error',
      onMatch: (el) => {
        console.error('Error occurred');
        logErrorToServer();
        showErrorModal();
      }
    },
    'default': {
      onMatch: () => console.log('Unknown status:', status.value)
    }
  },
  '#statusIndicator'
);
```

---

## 5. Complete Real-World Example: Interactive Form Validation

Here's a comprehensive example showing functions everywhere:

```javascript
// ============================================================================
// DYNAMIC FORM VALIDATION WITH EXECUTABLE FUNCTIONS
// ============================================================================

const formState = ReactiveUtils.state({
  email: '',
  password: '',
  confirmPassword: '',
  emailValid: null,
  passwordStrength: null,
  passwordsMatch: null,
  submitAttempts: 0
});

// Register custom handler for validation functions
Conditions.registerHandler('validate', {
  test: (key) => key === 'validate',
  apply: (element, validationFn) => {
    if (typeof validationFn === 'function') {
      const result = validationFn();
      element.dataset.valid = result;
    }
  }
});

// ============================================================================
// EMAIL VALIDATION WITH FUNCTIONS
// ============================================================================

Conditions.whenState(
  () => formState.value.emailValid,
  // Dynamic conditions function
  () => {
    const email = formState.value.email;
    const isEmpty = email.length === 0;
    
    return {
      'null': {
        style: { display: 'none' },
        textContent: ''
      },
      'true': {
        innerHTML: () => `
          <span class="validation-msg success">
            ✓ ${email} is valid
          </span>
        `,
        style: { 
          display: 'block',
          color: 'green' 
        },
        // Execute function when valid
        validate: () => {
          console.log('Email validated:', email);
          trackValidation('email', true);
          return true;
        }
      },
      'false': {
        innerHTML: () => {
          if (isEmpty) {
            return '<span class="validation-msg">Email is required</span>';
          }
          if (!email.includes('@')) {
            return '<span class="validation-msg error">Missing @ symbol</span>';
          }
          if (!email.includes('.')) {
            return '<span class="validation-msg error">Missing domain</span>';
          }
          return '<span class="validation-msg error">Invalid email format</span>';
        },
        style: { 
          display: 'block',
          color: 'red' 
        },
        addEventListener: {
          // Click to show helper
          click: () => {
            showEmailFormatHelper();
          }
        },
        validate: () => {
          console.log('Email invalid:', email);
          trackValidation('email', false);
          return false;
        }
      },
      'default': {
        textContent: 'Checking email...',
        style: { color: 'gray' }
      }
    };
  },
  '#emailValidation'
);

// ============================================================================
// PASSWORD STRENGTH WITH DYNAMIC FUNCTIONS
// ============================================================================

Conditions.whenState(
  () => formState.value.passwordStrength,
  () => {
    const password = formState.value.password;
    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    return {
      'weak': {
        innerHTML: () => {
          const suggestions = [];
          if (length < 8) suggestions.push('at least 8 characters');
          if (!hasUpper) suggestions.push('uppercase letter');
          if (!hasNumber) suggestions.push('number');
          if (!hasSpecial) suggestions.push('special character');
          
          return `
            <div class="strength-indicator weak">
              <div class="strength-bar" style="width: 25%; background: red;"></div>
              <p>Weak - Add ${suggestions.join(', ')}</p>
            </div>
          `;
        },
        validate: () => {
          warnWeakPassword();
          return false;
        },
        onclick: () => showPasswordRequirements()
      },
      'medium': {
        innerHTML: () => `
          <div class="strength-indicator medium">
            <div class="strength-bar" style="width: 60%; background: orange;"></div>
            <p>Medium - ${length} chars, ${[hasUpper, hasNumber, hasSpecial].filter(Boolean).length}/3 requirements</p>
          </div>
        `,
        validate: () => {
          return true;
        }
      },
      'strong': {
        innerHTML: () => `
          <div class="strength-indicator strong">
            <div class="strength-bar" style="width: 100%; background: green;"></div>
            <p>Strong - Excellent password! ✓</p>
          </div>
        `,
        validate: () => {
          trackStrongPassword();
          return true;
        },
        // Animate on strong password
        onMatch: (el) => {
          el.style.animation = 'none';
          setTimeout(() => {
            el.style.animation = 'pulse 0.5s ease';
          }, 10);
        }
      },
      'default': {
        textContent: '',
        style: { display: 'none' }
      }
    };
  },
  '#passwordStrength'
);

// ============================================================================
// SUBMIT BUTTON WITH COMPLEX FUNCTION LOGIC
// ============================================================================

Conditions.whenState(
  () => ({
    emailValid: formState.value.emailValid,
    passwordStrength: formState.value.passwordStrength,
    passwordsMatch: formState.value.passwordsMatch
  }),
  () => {
    const canSubmit = 
      formState.value.emailValid === true &&
      formState.value.passwordStrength !== 'weak' &&
      formState.value.passwordsMatch === true;
    
    return {
      'truthy': () => {
        if (canSubmit) {
          return {
            textContent: 'Create Account',
            disabled: false,
            classList: { add: 'btn-primary', remove: 'btn-disabled' },
            style: {
              cursor: 'pointer',
              opacity: '1',
              backgroundColor: '#4caf50'
            },
            onclick: async (e) => {
              e.preventDefault();
              
              // Disable during submission
              e.target.disabled = true;
              e.target.textContent = 'Creating Account...';
              
              try {
                const result = await createAccount({
                  email: formState.value.email,
                  password: formState.value.password
                });
                
                if (result.success) {
                  // Success animation
                  e.target.textContent = '✓ Account Created!';
                  setTimeout(() => {
                    window.location.href = '/dashboard';
                  }, 1000);
                } else {
                  throw new Error(result.error);
                }
              } catch (error) {
                // Error handling
                e.target.textContent = 'Error - Try Again';
                e.target.disabled = false;
                showError(error.message);
                
                formState.value = {
                  ...formState.value,
                  submitAttempts: formState.value.submitAttempts + 1
                };
              }
            },
            // Show tooltip on hover
            addEventListener: {
              mouseenter: (e) => {
                showTooltip(e.target, 'Click to create your account');
              },
              mouseleave: () => {
                hideTooltip();
              }
            }
          };
        } else {
          // Figure out what's missing
          const issues = [];
          if (formState.value.emailValid !== true) issues.push('valid email');
          if (formState.value.passwordStrength === 'weak') issues.push('stronger password');
          if (formState.value.passwordsMatch !== true) issues.push('matching passwords');
          
          return {
            textContent: () => `Complete form (${issues.length} ${issues.length === 1 ? 'issue' : 'issues'})`,
            disabled: true,
            classList: { add: 'btn-disabled', remove: 'btn-primary' },
            style: {
              cursor: 'not-allowed',
              opacity: '0.5'
            },
            title: () => `Required: ${issues.join(', ')}`,
            onclick: (e) => {
              e.preventDefault();
              // Shake animation
              e.target.style.animation = 'shake 0.3s';
              setTimeout(() => {
                e.target.style.animation = '';
              }, 300);
              
              // Show specific errors
              highlightInvalidFields(issues);
            }
          };
        }
      },
      'default': {
        textContent: 'Loading...',
        disabled: true
      }
    };
  },
  '#submitButton'
);

// ============================================================================
// REAL-TIME EMAIL VALIDATION FUNCTION
// ============================================================================

let emailCheckTimeout;

document.getElementById('emailInput').addEventListener('input', (e) => {
  const email = e.target.value;
  
  // Debounce
  clearTimeout(emailCheckTimeout);
  
  if (email.length === 0) {
    formState.value = { ...formState.value, email, emailValid: null };
    return;
  }
  
  emailCheckTimeout = setTimeout(async () => {
    // Validate format
    const formatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (!formatValid) {
      formState.value = { ...formState.value, email, emailValid: false };
      return;
    }
    
    // Check if email exists (async function)
    try {
      const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      formState.value = {
        ...formState.value,
        email,
        emailValid: !data.exists // Valid if doesn't exist
      };
    } catch (error) {
      console.error('Email check failed:', error);
      formState.value = { ...formState.value, email, emailValid: formatValid };
    }
  }, 500);
});

// ============================================================================
// PASSWORD STRENGTH CHECK FUNCTION
// ============================================================================

document.getElementById('passwordInput').addEventListener('input', (e) => {
  const password = e.target.value;
  
  // Calculate strength
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  const strengthLevel = strength <= 2 ? 'weak' : strength <= 3 ? 'medium' : 'strong';
  
  formState.value = {
    ...formState.value,
    password,
    passwordStrength: strengthLevel
  };
});

console.log('Interactive form with executable functions initialized!');
```

---

## Summary: Functions in Conditions

✅ **Yes, you can execute functions in these ways:**

1. **As property values** - Computed dynamically
2. **As event handlers** - `onclick`, `addEventListener`, etc.
3. **As the entire conditions object** - For dynamic condition sets
4. **As custom property handlers** - Register your own function executors
5. **Within HTML/text content** - Using template functions
6. **As side effects** - Through custom handlers like `onMatch`

The module is **extremely flexible** with function support! 🚀