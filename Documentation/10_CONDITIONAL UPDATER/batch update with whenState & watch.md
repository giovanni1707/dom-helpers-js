# Batch Updates with `whenState` and `watch` 🚀

Yes! You can absolutely use batch updates with `whenState` and `watch`. Let me show you all the ways!

---

## 🎯 **Method 1: Multiple `whenState` Inside `batch`**

### Example 1: Setup Multiple Reactive Watchers at Once

```javascript
// Reactive state
const state = {
  count: 0,
  status: 'idle',
  user: 'guest',
  theme: 'light'
};

// Setup all reactive watchers in a batch
Conditions.batch(() => {
  // Each whenState creates its own reactive effect
  Conditions.whenState(
    () => state.count,
    {
      '0': { textContent: 'No items', style: { color: 'gray' } },
      '1-5': { textContent: `${state.count} items`, style: { color: 'blue' } },
      '>=6': { textContent: `${state.count} items!`, style: { color: 'green' } }
    },
    '#counter'
  );

  Conditions.whenState(
    () => state.status,
    {
      'idle': { textContent: '⏸️ Idle', style: { backgroundColor: 'lightgray' } },
      'loading': { textContent: '⏳ Loading...', style: { backgroundColor: 'yellow' } },
      'success': { textContent: '✅ Success!', style: { backgroundColor: 'lightgreen' } },
      'error': { textContent: '❌ Error', style: { backgroundColor: 'lightcoral' } }
    },
    '#status'
  );

  Conditions.whenState(
    () => state.theme,
    {
      'dark': { 
        classList: { add: 'dark-mode' },
        style: { backgroundColor: '#1a1a1a', color: 'white' }
      },
      'light': { 
        classList: { add: 'light-mode' },
        style: { backgroundColor: 'white', color: 'black' }
      }
    },
    'body'
  );

  Conditions.whenState(
    () => state.user,
    {
      'guest': { textContent: '👤 Guest', style: { fontStyle: 'italic' } },
      'default': { textContent: `👋 ${state.user}`, style: { fontWeight: 'bold' } }
    },
    '#username'
  );
});

console.log('✅ All reactive watchers initialized in batch!');
```

---

## 🎯 **Method 2: Batch Updates INSIDE a Reactive Effect**

This is the **most powerful pattern** - batch multiple DOM updates triggered by a single state change!

### Example 2: Single State Change → Batched DOM Updates

```javascript
// Reactive state
const appState = {
  isLoggedIn: false,
  username: '',
  credits: 0,
  notifications: 0,
  theme: 'light'
};

// Watch ONE state property, but update MULTIPLE elements in a batch
Conditions.whenState(
  () => appState.isLoggedIn,
  () => {
    // When isLoggedIn changes, batch ALL related updates
    return Conditions.batch(() => {
      // This returns the conditions object
      if (appState.isLoggedIn) {
        return {
          'true': {
            // These updates happen in parallel within the batch
            textContent: 'Dashboard',
            style: { display: 'block' }
          }
        };
      } else {
        return {
          'false': {
            textContent: 'Login',
            style: { display: 'none' }
          }
        };
      }
    });
  },
  '#main-content'
);
```

### Better Pattern - Multiple Elements from One State:

```javascript
// BETTER: Watch state and update MULTIPLE elements in batch
Conditions.whenState(
  () => appState.isLoggedIn,
  {
    'true': {
      // This will be applied, but we'll add batch for other elements
    },
    'false': {
      // Same here
    }
  },
  '#nav',
  { reactive: true }
);

// MORE POWERFUL APPROACH:
// Create a custom effect that batches multiple element updates

if (window.ReactiveUtils && ReactiveUtils.effect) {
  ReactiveUtils.effect(() => {
    // This entire function re-runs when appState changes
    
    // Batch all DOM updates together
    Conditions.batch(() => {
      // Navigation
      Conditions.apply(appState.isLoggedIn, {
        'true': {
          textContent: 'Logout',
          style: { display: 'block' }
        },
        'false': {
          textContent: 'Login',
          style: { display: 'none' }
        }
      }, '#nav-auth');

      // User profile
      Conditions.apply(appState.username, {
        'empty': { textContent: 'Guest' },
        'default': { textContent: `Welcome, ${appState.username}!` }
      }, '#user-greeting');

      // Credits display
      Conditions.apply(appState.credits, {
        '0': { 
          textContent: 'No credits',
          style: { color: 'red' }
        },
        '1-10': { 
          textContent: `${appState.credits} credits`,
          style: { color: 'orange' }
        },
        '>=11': { 
          textContent: `${appState.credits} credits`,
          style: { color: 'green' }
        }
      }, '#credits');

      // Notifications
      Conditions.apply(appState.notifications, {
        '0': { style: { display: 'none' } },
        '>=1': { 
          textContent: appState.notifications,
          style: { 
            display: 'flex',
            backgroundColor: 'red'
          }
        }
      }, '#notification-badge');

      // Theme
      Conditions.apply(appState.theme, {
        'dark': { classList: { add: 'dark-theme' } },
        'light': { classList: { add: 'light-theme' } }
      }, 'body');
    });
  });
}
```

---

## 🎯 **Method 3: Multiple `watch` Calls in Batch**

### Example 3: Setup Multiple Watch Calls

```javascript
const gameState = {
  health: 100,
  mana: 50,
  stamina: 75,
  level: 1,
  experience: 0
};

// Initialize all watchers in a batch
Conditions.batch(() => {
  // Watch health
  Conditions.watch(
    () => gameState.health,
    {
      '>=75': { 
        style: { width: gameState.health + '%', backgroundColor: 'green' }
      },
      '50-74': { 
        style: { width: gameState.health + '%', backgroundColor: 'yellow' }
      },
      '25-49': { 
        style: { width: gameState.health + '%', backgroundColor: 'orange' }
      },
      '<25': { 
        style: { 
          width: gameState.health + '%', 
          backgroundColor: 'red',
          animation: 'pulse 0.5s infinite'
        }
      }
    },
    '#health-bar'
  );

  // Watch mana
  Conditions.watch(
    () => gameState.mana,
    {
      '>=50': { style: { width: gameState.mana + '%', backgroundColor: 'cyan' } },
      '25-49': { style: { width: gameState.mana + '%', backgroundColor: 'blue' } },
      '<25': { style: { width: gameState.mana + '%', backgroundColor: 'darkblue' } }
    },
    '#mana-bar'
  );

  // Watch stamina
  Conditions.watch(
    () => gameState.stamina,
    {
      '>=60': { style: { width: gameState.stamina + '%', backgroundColor: 'lime' } },
      '30-59': { style: { width: gameState.stamina + '%', backgroundColor: 'yellowgreen' } },
      '<30': { style: { width: gameState.stamina + '%', backgroundColor: 'olive' } }
    },
    '#stamina-bar'
  );

  // Watch level
  Conditions.watch(
    () => gameState.level,
    {
      '1-10': { textContent: `Level ${gameState.level} - Beginner` },
      '11-25': { textContent: `Level ${gameState.level} - Intermediate` },
      '26-50': { textContent: `Level ${gameState.level} - Advanced` },
      '>50': { textContent: `Level ${gameState.level} - Master` }
    },
    '#level-display'
  );

  // Watch experience
  Conditions.watch(
    () => gameState.experience,
    {
      'default': { 
        style: { width: (gameState.experience % 100) + '%' },
        textContent: `${gameState.experience} XP`
      }
    },
    '#xp-bar'
  );
});

console.log('✅ All watch effects initialized!');
```

---

## 🎯 **Method 4: Advanced Pattern - Computed State with Batch**

### Example 4: Watch Computed Values, Update Multiple Elements

```javascript
// Complex state
const shopState = {
  cart: {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0
  },
  user: {
    isPremium: false,
    loyaltyPoints: 0
  },
  promo: {
    code: null,
    discount: 0
  }
};

// Computed values
function getTotal() {
  return shopState.cart.subtotal + 
         shopState.cart.tax + 
         shopState.cart.shipping - 
         shopState.promo.discount;
}

function getDiscountPercentage() {
  if (shopState.cart.subtotal === 0) return 0;
  return (shopState.promo.discount / shopState.cart.subtotal) * 100;
}

function getShippingStatus() {
  if (shopState.user.isPremium) return 'free-premium';
  if (shopState.cart.subtotal >= 50) return 'free-threshold';
  return 'standard';
}

// Watch computed total and batch update entire checkout UI
Conditions.whenState(
  () => getTotal(),  // Computed value
  () => {
    const total = getTotal();
    
    // Return conditions, but batch internal updates
    return {
      '0': {
        textContent: 'Cart is empty',
        style: { color: 'gray' }
      },
      '>=0.01': {
        // For the main element
        textContent: `Total: $${total.toFixed(2)}`,
        style: { 
          fontSize: '24px',
          fontWeight: 'bold'
        }
      }
    };
  },
  '#checkout-total'
);

// Better approach: Single effect that batches everything
if (window.ReactiveUtils && ReactiveUtils.effect) {
  ReactiveUtils.effect(() => {
    // Runs whenever ANY tracked state changes
    
    const total = getTotal();
    const discount = getDiscountPercentage();
    const shipping = getShippingStatus();
    const itemCount = shopState.cart.items.length;
    
    // Batch ALL updates
    Conditions.batch(() => {
      // Item count
      Conditions.apply(itemCount, {
        '0': {
          textContent: 'Empty cart',
          style: { display: 'none' }
        },
        '>=1': {
          textContent: `${itemCount} items`,
          style: { display: 'block' }
        }
      }, '#item-count');

      // Subtotal
      Conditions.apply(shopState.cart.subtotal, {
        '0': { textContent: '$0.00' },
        'default': { textContent: `$${shopState.cart.subtotal.toFixed(2)}` }
      }, '#subtotal');

      // Discount
      Conditions.apply(discount, {
        '0': { style: { display: 'none' } },
        '>0': {
          textContent: `-$${shopState.promo.discount.toFixed(2)} (${discount.toFixed(0)}% off)`,
          style: { 
            display: 'block',
            color: 'green',
            fontWeight: 'bold'
          }
        }
      }, '#discount-line');

      // Shipping
      Conditions.apply(shipping, {
        'free-premium': {
          textContent: '🎉 FREE (Premium Member)',
          style: { color: 'gold' }
        },
        'free-threshold': {
          textContent: '🎉 FREE (Over $50)',
          style: { color: 'green' }
        },
        'standard': {
          textContent: `$${shopState.cart.shipping.toFixed(2)}`,
          style: { color: 'black' }
        }
      }, '#shipping-line');

      // Total
      Conditions.apply(total, {
        '0': {
          textContent: '$0.00',
          style: { fontSize: '18px', color: 'gray' }
        },
        '0.01-49.99': {
          textContent: `$${total.toFixed(2)}`,
          style: { fontSize: '24px', color: 'black' }
        },
        '50-99.99': {
          textContent: `$${total.toFixed(2)} 💰`,
          style: { fontSize: '28px', color: 'green' }
        },
        '>=100': {
          textContent: `$${total.toFixed(2)} 🎊`,
          style: { 
            fontSize: '32px', 
            color: 'gold',
            fontWeight: 'bold'
          }
        }
      }, '#total-amount');

      // Checkout button
      Conditions.apply(itemCount > 0 && total > 0, {
        'true': {
          disabled: false,
          textContent: 'Proceed to Checkout',
          style: { 
            backgroundColor: '#4CAF50',
            cursor: 'pointer'
          }
        },
        'false': {
          disabled: true,
          textContent: 'Add items to checkout',
          style: { 
            backgroundColor: 'gray',
            cursor: 'not-allowed'
          }
        }
      }, '#checkout-button');

      // Loyalty points indicator
      Conditions.apply(shopState.user.loyaltyPoints, {
        '0': { style: { display: 'none' } },
        '1-99': {
          textContent: `⭐ ${shopState.user.loyaltyPoints} points`,
          style: { display: 'block', color: 'orange' }
        },
        '>=100': {
          textContent: `🌟 ${shopState.user.loyaltyPoints} points - Redeem for discount!`,
          style: { 
            display: 'block', 
            color: 'gold',
            animation: 'glow 1s infinite'
          }
        }
      }, '#loyalty-points');
    });
  });
}
```

---

## 🎯 **Method 5: Real-World Dashboard Example**

### Example 5: Complete Dashboard with Reactive Batch Updates

```javascript
// Dashboard state
const dashboard = {
  user: {
    name: 'Alice',
    role: 'admin',
    isOnline: true,
    lastActive: Date.now()
  },
  stats: {
    visitors: 1250,
    sales: 45,
    revenue: 8945.50,
    conversion: 3.6
  },
  alerts: {
    critical: 2,
    warnings: 5,
    info: 12
  },
  system: {
    cpu: 45,
    memory: 72,
    disk: 88,
    status: 'healthy'
  }
};

// Create reactive dashboard with batched updates
if (window.ReactiveUtils) {
  // Make state reactive
  const state = ReactiveUtils.reactive(dashboard);
  
  // Single effect that watches entire state and batches all updates
  ReactiveUtils.effect(() => {
    Conditions.batch(() => {
      // === USER SECTION ===
      Conditions.apply(state.user.role, {
        'admin': {
          textContent: '👑 Admin',
          style: { 
            backgroundColor: 'gold',
            color: 'black',
            padding: '5px 10px',
            borderRadius: '5px'
          }
        },
        'moderator': {
          textContent: '🛡️ Moderator',
          style: { backgroundColor: 'silver' }
        },
        'user': {
          textContent: '👤 User',
          style: { backgroundColor: 'lightgray' }
        }
      }, '#user-role-badge');

      Conditions.apply(state.user.isOnline, {
        'true': {
          textContent: '🟢 Online',
          style: { color: 'green' }
        },
        'false': {
          textContent: '⚫ Offline',
          style: { color: 'gray' }
        }
      }, '#user-status');

      // === STATS SECTION ===
      Conditions.apply(state.stats.visitors, {
        '<100': {
          textContent: `${state.stats.visitors} visitors`,
          style: { fontSize: '16px' }
        },
        '100-999': {
          textContent: `${state.stats.visitors} visitors`,
          style: { fontSize: '20px', color: 'blue' }
        },
        '>=1000': {
          textContent: `${state.stats.visitors} visitors 🎉`,
          style: { 
            fontSize: '24px', 
            color: 'green',
            fontWeight: 'bold'
          }
        }
      }, '#visitors-count');

      Conditions.apply(state.stats.conversion, {
        '<2': {
          textContent: `${state.stats.conversion}% ⚠️`,
          style: { color: 'red' }
        },
        '2-5': {
          textContent: `${state.stats.conversion}% ✓`,
          style: { color: 'orange' }
        },
        '>5': {
          textContent: `${state.stats.conversion}% 🎯`,
          style: { color: 'green', fontWeight: 'bold' }
        }
      }, '#conversion-rate');

      // === ALERTS SECTION ===
      Conditions.apply(state.alerts.critical, {
        '0': { style: { display: 'none' } },
        '>=1': {
          textContent: `${state.alerts.critical} Critical`,
          style: { 
            display: 'block',
            backgroundColor: 'red',
            color: 'white',
            padding: '10px',
            animation: 'pulse 1s infinite'
          }
        }
      }, '#critical-alerts');

      Conditions.apply(state.alerts.warnings, {
        '0': { style: { display: 'none' } },
        '1-5': {
          textContent: `${state.alerts.warnings} Warnings`,
          style: { 
            backgroundColor: 'orange',
            color: 'white'
          }
        },
        '>5': {
          textContent: `${state.alerts.warnings} Warnings ⚠️`,
          style: { 
            backgroundColor: 'darkorange',
            fontWeight: 'bold'
          }
        }
      }, '#warning-alerts');

      // === SYSTEM SECTION ===
      Conditions.apply(state.system.cpu, {
        '<50': {
          style: { 
            width: state.system.cpu + '%',
            backgroundColor: 'green'
          }
        },
        '50-79': {
          style: { 
            width: state.system.cpu + '%',
            backgroundColor: 'yellow'
          }
        },
        '>=80': {
          style: { 
            width: state.system.cpu + '%',
            backgroundColor: 'red',
            animation: 'pulse 0.5s infinite'
          }
        }
      }, '#cpu-bar');

      Conditions.apply(state.system.memory, {
        '<60': { style: { width: state.system.memory + '%', backgroundColor: 'green' } },
        '60-85': { style: { width: state.system.memory + '%', backgroundColor: 'yellow' } },
        '>=86': { style: { width: state.system.memory + '%', backgroundColor: 'red' } }
      }, '#memory-bar');

      Conditions.apply(state.system.status, {
        'healthy': {
          textContent: '✅ System Healthy',
          style: { 
            backgroundColor: 'lightgreen',
            padding: '10px',
            borderRadius: '5px'
          }
        },
        'warning': {
          textContent: '⚠️ System Warning',
          style: { backgroundColor: 'yellow' }
        },
        'critical': {
          textContent: '🚨 System Critical',
          style: { 
            backgroundColor: 'red',
            color: 'white',
            animation: 'shake 0.5s infinite'
          }
        }
      }, '#system-status');
    });
  });

  // Simulate real-time updates
  setInterval(() => {
    state.stats.visitors += Math.floor(Math.random() * 10);
    state.stats.conversion = (Math.random() * 7).toFixed(1);
    state.system.cpu = Math.floor(Math.random() * 100);
    state.system.memory = Math.floor(Math.random() * 100);
    
    // All updates happen in ONE batch automatically!
  }, 2000);
}
```

---

## 📊 **Summary: When to Use Each Pattern**

| Pattern | Use Case | Performance |
|---------|----------|-------------|
| **Multiple `whenState` in batch** | Initialize many watchers at once | Setup optimization |
| **Batch inside reactive effect** | Single state → Multiple elements | ⭐ Best performance |
| **Multiple `watch` in batch** | Setup explicit watchers | Setup optimization |
| **Computed + batch** | Complex derived state → Multiple elements | ⭐⭐ Best for complex UIs |

---

## ✅ **Key Takeaways**

1. **YES**, you can use `batch` with `whenState` and `watch`!
2. **Best pattern**: Create one reactive effect that batches multiple `apply` calls
3. **Performance win**: One state change → One batched DOM update cycle
4. **Use case**: Dashboards, game UIs, complex forms - anywhere multiple elements depend on related state

The magic is: **One reactive trigger → Many batched updates** 🎯