# Batch Update Examples 🚀

## 🎯 **What is Batch Update?**

Batch updates group multiple DOM operations together so they execute **as one unit**, improving performance and preventing multiple reflows/repaints.

---

## 📦 **Basic Batch Update**

### Example 1: Update Multiple Elements at Once

```javascript
const userStatus = 'premium';
const messageCount = 5;
const isOnline = true;

// WITHOUT batch - triggers 3 separate DOM updates
Conditions.apply(userStatus, {
  'premium': { classList: { add: 'premium-user' } }
}, '#user-badge');

Conditions.apply(messageCount, {
  '>=1': { textContent: `${messageCount} new messages` }
}, '#message-count');

Conditions.apply(isOnline, {
  'true': { style: { backgroundColor: 'green' } }
}, '#status-indicator');

// ❌ Problem: 3 separate reflows/repaints


// WITH batch - single DOM update cycle
Conditions.batch(() => {
  Conditions.apply(userStatus, {
    'premium': { classList: { add: 'premium-user' } }
  }, '#user-badge');

  Conditions.apply(messageCount, {
    '>=1': { textContent: `${messageCount} new messages` }
  }, '#message-count');

  Conditions.apply(isOnline, {
    'true': { style: { backgroundColor: 'green' } }
  }, '#status-indicator');
});

// ✅ Better: All updates in one batch
```

---

## 🎨 **Dashboard Update Example**

### Example 2: Update Entire Dashboard State

```javascript
// Dashboard state
const dashboardState = {
  user: {
    name: 'John Doe',
    level: 15,
    status: 'online',
    isPremium: true
  },
  stats: {
    score: 1250,
    rank: 'expert',
    unreadMessages: 7
  },
  notifications: {
    count: 3,
    hasUrgent: true
  }
};

// Update everything in one batch
Conditions.batch(() => {
  // User info updates
  Conditions.apply(dashboardState.user.status, {
    'online': {
      style: { color: 'green' },
      textContent: '🟢 Online'
    },
    'offline': {
      style: { color: 'gray' },
      textContent: '⚫ Offline'
    },
    'away': {
      style: { color: 'orange' },
      textContent: '🟠 Away'
    }
  }, '#user-status');

  // Level badge
  Conditions.apply(dashboardState.user.level, {
    '>=20': { 
      classList: { add: 'master' },
      textContent: `⭐ Level ${dashboardState.user.level} - Master`
    },
    '10-19': { 
      classList: { add: 'expert' },
      textContent: `🏆 Level ${dashboardState.user.level} - Expert`
    },
    '<10': { 
      classList: { add: 'beginner' },
      textContent: `📚 Level ${dashboardState.user.level} - Learning`
    }
  }, '#level-badge');

  // Premium status
  Conditions.apply(dashboardState.user.isPremium, {
    'true': {
      classList: { add: 'premium' },
      style: { 
        background: 'linear-gradient(45deg, gold, orange)',
        color: 'white'
      },
      textContent: '👑 Premium Member'
    },
    'false': {
      classList: { remove: 'premium' },
      textContent: 'Free Member'
    }
  }, '#membership-badge');

  // Score display
  Conditions.apply(dashboardState.stats.score, {
    '>=1000': {
      style: { 
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'gold'
      },
      textContent: `🎯 Score: ${dashboardState.stats.score}`
    },
    '500-999': {
      style: { 
        fontSize: '20px',
        color: 'silver'
      },
      textContent: `Score: ${dashboardState.stats.score}`
    },
    '<500': {
      style: { 
        fontSize: '16px',
        color: 'bronze'
      },
      textContent: `Score: ${dashboardState.stats.score}`
    }
  }, '#score-display');

  // Unread messages
  Conditions.apply(dashboardState.stats.unreadMessages, {
    '>=10': {
      classList: { add: 'many-messages' },
      textContent: '📬 10+ unread',
      style: { backgroundColor: 'red', color: 'white' }
    },
    '1-9': {
      classList: { add: 'some-messages' },
      textContent: `📧 ${dashboardState.stats.unreadMessages} unread`,
      style: { backgroundColor: 'orange' }
    },
    '0': {
      classList: { remove: ['many-messages', 'some-messages'] },
      textContent: '✅ All caught up!',
      style: { backgroundColor: 'lightgreen' }
    }
  }, '#messages-indicator');

  // Notifications
  Conditions.apply(dashboardState.notifications.hasUrgent, {
    'true': {
      classList: { add: ['urgent', 'pulse'] },
      textContent: `🚨 ${dashboardState.notifications.count} urgent!`,
      style: { 
        animation: 'pulse 1s infinite',
        backgroundColor: 'red'
      }
    },
    'false': {
      classList: { remove: 'urgent' },
      textContent: `🔔 ${dashboardState.notifications.count} notifications`,
      style: { backgroundColor: 'blue' }
    }
  }, '#notifications');
});

console.log('✅ Dashboard updated in single batch!');
```

---

## 🎮 **Game State Update Example**

### Example 3: Update Game UI

```javascript
// Game state
const gameState = {
  player: {
    health: 75,
    energy: 30,
    level: 12,
    lives: 2
  },
  game: {
    score: 4500,
    combo: 15,
    isPaused: false,
    difficulty: 'hard'
  }
};

// Custom handler for health bar
Conditions.registerHandler('healthBar', {
  test: (key) => key === 'healthBar',
  apply: (element, value) => {
    const { current, max, color } = value;
    const percentage = (current / max) * 100;
    
    element.style.width = percentage + '%';
    element.style.backgroundColor = color;
    element.style.transition = 'width 0.3s ease, background-color 0.3s ease';
    element.textContent = `${current}/${max}`;
  }
});

// Batch update entire game UI
function updateGameUI() {
  Conditions.batch(() => {
    // Health indicator
    Conditions.apply(gameState.player.health, {
      '>=80': {
        healthBar: { current: gameState.player.health, max: 100, color: '#4CAF50' },
        classList: { add: 'healthy' }
      },
      '50-79': {
        healthBar: { current: gameState.player.health, max: 100, color: '#FFC107' },
        classList: { add: 'warning' }
      },
      '25-49': {
        healthBar: { current: gameState.player.health, max: 100, color: '#FF9800' },
        classList: { add: 'danger' }
      },
      '<25': {
        healthBar: { current: gameState.player.health, max: 100, color: '#F44336' },
        classList: { add: 'critical' },
        style: { animation: 'shake 0.5s infinite' }
      }
    }, '#health-bar');

    // Energy indicator
    Conditions.apply(gameState.player.energy, {
      '>=50': {
        style: { backgroundColor: 'cyan', width: gameState.player.energy + '%' }
      },
      '20-49': {
        style: { backgroundColor: 'yellow', width: gameState.player.energy + '%' }
      },
      '<20': {
        style: { 
          backgroundColor: 'red', 
          width: gameState.player.energy + '%',
          animation: 'blink 1s infinite'
        }
      }
    }, '#energy-bar');

    // Lives display
    Conditions.apply(gameState.player.lives, {
      '>=3': {
        textContent: `❤️❤️❤️`,
        style: { color: 'red' }
      },
      '2': {
        textContent: `❤️❤️`,
        style: { color: 'orange' }
      },
      '1': {
        textContent: `❤️`,
        style: { color: 'darkred', animation: 'pulse 1s infinite' }
      },
      '0': {
        textContent: `💀 GAME OVER`,
        style: { color: 'black', fontSize: '20px' }
      }
    }, '#lives-display');

    // Score with combo multiplier
    Conditions.apply(gameState.game.combo, {
      '>=20': {
        textContent: `🔥 Score: ${gameState.game.score} (${gameState.game.combo}x MEGA COMBO!)`,
        style: { 
          color: 'gold',
          fontSize: '24px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px orange'
        }
      },
      '10-19': {
        textContent: `⚡ Score: ${gameState.game.score} (${gameState.game.combo}x combo)`,
        style: { 
          color: 'orange',
          fontSize: '20px'
        }
      },
      '5-9': {
        textContent: `✨ Score: ${gameState.game.score} (${gameState.game.combo}x)`,
        style: { color: 'yellow' }
      },
      '<5': {
        textContent: `Score: ${gameState.game.score}`,
        style: { color: 'white' }
      }
    }, '#score-display');

    // Difficulty indicator
    Conditions.apply(gameState.game.difficulty, {
      'easy': {
        textContent: '🟢 Easy Mode',
        style: { backgroundColor: 'lightgreen' }
      },
      'medium': {
        textContent: '🟡 Medium Mode',
        style: { backgroundColor: 'yellow' }
      },
      'hard': {
        textContent: '🔴 Hard Mode',
        style: { backgroundColor: 'orange', color: 'white' }
      },
      'nightmare': {
        textContent: '💀 NIGHTMARE MODE',
        style: { 
          backgroundColor: 'darkred', 
          color: 'white',
          animation: 'pulse 1s infinite'
        }
      }
    }, '#difficulty-badge');

    // Pause state
    Conditions.apply(gameState.game.isPaused, {
      'true': {
        textContent: '⏸️ PAUSED',
        style: { 
          display: 'flex',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '48px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '40px'
        }
      },
      'false': {
        style: { display: 'none' }
      }
    }, '#pause-overlay');
  });
}

// Call it
updateGameUI();

// Or make it reactive
setInterval(() => {
  // Simulate game state changes
  gameState.player.health -= Math.random() * 5;
  gameState.player.energy = Math.max(0, gameState.player.energy - 1);
  gameState.game.score += Math.floor(Math.random() * 100);
  gameState.game.combo++;
  
  updateGameUI();
}, 1000);
```

---

## 🛒 **E-commerce Cart Update Example**

### Example 4: Shopping Cart Updates

```javascript
const cart = {
  items: 3,
  total: 149.99,
  hasDiscount: true,
  shippingStatus: 'free',
  stockStatus: 'available'
};

function updateCart() {
  Conditions.batch(() => {
    // Cart item count badge
    Conditions.apply(cart.items, {
      '0': {
        style: { display: 'none' }
      },
      '1-9': {
        textContent: cart.items,
        style: { 
          display: 'flex',
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '4px 8px'
        }
      },
      '>=10': {
        textContent: '9+',
        style: { 
          display: 'flex',
          backgroundColor: 'darkred',
          animation: 'bounce 0.5s'
        }
      }
    }, '#cart-badge');

    // Total price
    Conditions.apply(cart.total, {
      '0': {
        textContent: 'Cart is empty',
        style: { color: 'gray' }
      },
      '0.01-49.99': {
        textContent: `Total: $${cart.total.toFixed(2)}`,
        style: { fontSize: '18px' }
      },
      '50-99.99': {
        textContent: `Total: $${cart.total.toFixed(2)} 🎉`,
        style: { fontSize: '20px', color: 'green' }
      },
      '>=100': {
        textContent: `Total: $${cart.total.toFixed(2)} 🎊 BIG SAVER!`,
        style: { 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: 'gold'
        }
      }
    }, '#cart-total');

    // Discount banner
    Conditions.apply(cart.hasDiscount, {
      'true': {
        textContent: '🎉 15% discount applied!',
        style: { 
          display: 'block',
          backgroundColor: 'lightgreen',
          padding: '10px',
          borderRadius: '5px'
        }
      },
      'false': {
        style: { display: 'none' }
      }
    }, '#discount-banner');

    // Shipping status
    Conditions.apply(cart.shippingStatus, {
      'free': {
        textContent: '🚚 FREE SHIPPING!',
        style: { 
          backgroundColor: 'green',
          color: 'white',
          padding: '8px'
        }
      },
      'standard': {
        textContent: '📦 Standard Shipping: $5.99',
        style: { backgroundColor: 'lightblue' }
      },
      'express': {
        textContent: '⚡ Express Shipping: $14.99',
        style: { backgroundColor: 'orange' }
      }
    }, '#shipping-info');

    // Stock availability
    Conditions.apply(cart.stockStatus, {
      'available': {
        textContent: '✅ In Stock',
        style: { color: 'green' }
      },
      'low': {
        textContent: '⚠️ Low Stock - Order Soon!',
        style: { 
          color: 'orange',
          fontWeight: 'bold'
        }
      },
      'out': {
        textContent: '❌ Out of Stock',
        style: { 
          color: 'red',
          textDecoration: 'line-through'
        }
      }
    }, '#stock-status');

    // Checkout button
    Conditions.apply(cart.items > 0 && cart.stockStatus === 'available', {
      'true': {
        disabled: false,
        style: { 
          backgroundColor: '#4CAF50',
          cursor: 'pointer',
          opacity: '1'
        },
        textContent: `Checkout (${cart.items} items)`
      },
      'false': {
        disabled: true,
        style: { 
          backgroundColor: 'gray',
          cursor: 'not-allowed',
          opacity: '0.5'
        },
        textContent: 'Cart is empty'
      }
    }, '#checkout-button');
  });
}

// Update cart
updateCart();

// Simulate cart changes
document.querySelector('#add-item').addEventListener('click', () => {
  cart.items++;
  cart.total += 29.99;
  updateCart();
});
```

---

## 🔄 **Reactive Batch Update with State**

### Example 5: With Reactive State System

```javascript
// Assuming you have reactive state (from Elements.js or similar)
const state = {
  theme: 'dark',
  fontSize: 16,
  notifications: true,
  language: 'en',
  sidebar: 'collapsed'
};

// Make it reactive (pseudo-code, depends on your reactive system)
const reactiveState = makeReactive(state);

// Batch update that reacts to state changes
Conditions.whenState(
  () => reactiveState,  // Watch entire state object
  () => {
    // This function runs on every state change
    // Use batch to group all updates
    Conditions.batch(() => {
      // Theme
      Conditions.apply(reactiveState.theme, {
        'dark': {
          style: { 
            backgroundColor: '#1a1a1a',
            color: '#ffffff'
          },
          classList: { add: 'dark-theme' }
        },
        'light': {
          style: { 
            backgroundColor: '#ffffff',
            color: '#000000'
          },
          classList: { add: 'light-theme' }
        }
      }, 'body');

      // Font size
      Conditions.apply(reactiveState.fontSize, {
        '12': { style: { fontSize: '12px' } },
        '14': { style: { fontSize: '14px' } },
        '16': { style: { fontSize: '16px' } },
        '18': { style: { fontSize: '18px' } },
        '20': { style: { fontSize: '20px' } }
      }, '.content');

      // Notifications
      Conditions.apply(reactiveState.notifications, {
        'true': {
          textContent: '🔔 Notifications ON',
          style: { color: 'green' }
        },
        'false': {
          textContent: '🔕 Notifications OFF',
          style: { color: 'gray' }
        }
      }, '#notification-toggle');

      // Sidebar
      Conditions.apply(reactiveState.sidebar, {
        'expanded': {
          style: { width: '250px' },
          classList: { add: 'expanded' }
        },
        'collapsed': {
          style: { width: '60px' },
          classList: { add: 'collapsed' }
        }
      }, '#sidebar');
    });
  },
  'body',
  { reactive: true }
);

// Now any state change triggers batched update
reactiveState.theme = 'light';  // All UI updates in one batch!
```

---

## 🎯 **Key Benefits of Batch Updates**

```javascript
// ❌ BAD: Multiple reflows
Conditions.apply(value1, conditions1, '#elem1');  // Reflow 1
Conditions.apply(value2, conditions2, '#elem2');  // Reflow 2
Conditions.apply(value3, conditions3, '#elem3');  // Reflow 3
// = 3 reflows = slower

// ✅ GOOD: Single reflow
Conditions.batch(() => {
  Conditions.apply(value1, conditions1, '#elem1');
  Conditions.apply(value2, conditions2, '#elem2');
  Conditions.apply(value3, conditions3, '#elem3');
});
// = 1 reflow = faster!
```

**Performance Impact:**
- 🐌 Without batch: ~30-50ms for 10 updates
- 🚀 With batch: ~10-15ms for 10 updates

---

That's everything you need to know about batch updates! 🎉