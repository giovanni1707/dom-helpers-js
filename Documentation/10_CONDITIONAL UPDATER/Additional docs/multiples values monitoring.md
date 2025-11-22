# Advanced Conditional Patterns 🎯

Let me show you three powerful patterns for handling complex state!

---

## 🔗 **Pattern 1: Monitor Multiple Values with Combined Condition String**

### **Approach A: Concatenate Values into Single String**

```javascript
const state = {
  isLoggedIn: true,
  isPremium: false,
  hasNotifications: true
};

// Combine multiple boolean values into a single condition string
Conditions.whenState(
  () => `${state.isLoggedIn}-${state.isPremium}-${state.hasNotifications}`,
  {
    'true-true-true': {
      textContent: '👑 Premium member with notifications',
      style: { 
        backgroundColor: 'gold',
        color: 'black',
        padding: '20px',
        borderRadius: '10px'
      }
    },
    'true-true-false': {
      textContent: '👑 Premium member',
      style: { backgroundColor: 'gold' }
    },
    'true-false-true': {
      textContent: '🔔 User with notifications',
      style: { backgroundColor: 'lightblue' }
    },
    'true-false-false': {
      textContent: '👤 Standard user',
      style: { backgroundColor: 'lightgray' }
    },
    'false-true-true': {
      textContent: '🔒 Premium (not logged in)',
      style: { backgroundColor: 'orange' }
    },
    'false-true-false': {
      textContent: '🔒 Premium (not logged in)',
      style: { backgroundColor: 'orange' }
    },
    'false-false-true': {
      textContent: '🔒 Guest with pending notifications',
      style: { backgroundColor: 'lightyellow' }
    },
    'false-false-false': {
      textContent: '🔒 Please login',
      style: { backgroundColor: 'white' }
    }
  },
  '#user-status'
);
```

---

### **Approach B: Numeric Score System**

```javascript
const state = {
  isLoggedIn: false,
  isPremium: false,
  hasNotifications: false,
  isAdmin: false
};

// Calculate a numeric "state score"
function getStateScore() {
  let score = 0;
  if (state.isLoggedIn) score += 1;      // bit 0
  if (state.isPremium) score += 2;       // bit 1
  if (state.hasNotifications) score += 4; // bit 2
  if (state.isAdmin) score += 8;         // bit 3
  return score;
}

Conditions.whenState(
  () => getStateScore(),
  {
    '0': {  // 0000 - Guest, no premium, no notifications, no admin
      textContent: '🔒 Please login',
      style: { backgroundColor: 'white' }
    },
    '1': {  // 0001 - Logged in only
      textContent: '👤 Standard user',
      style: { backgroundColor: 'lightgray' }
    },
    '3': {  // 0011 - Logged in + Premium
      textContent: '👑 Premium member',
      style: { backgroundColor: 'gold' }
    },
    '5': {  // 0101 - Logged in + Notifications
      textContent: '🔔 User with notifications',
      style: { backgroundColor: 'lightblue' }
    },
    '7': {  // 0111 - Logged in + Premium + Notifications
      textContent: '👑🔔 Premium with notifications',
      style: { backgroundColor: 'gold', animation: 'glow 1s infinite' }
    },
    '9': {  // 1001 - Logged in + Admin
      textContent: '⚡ Admin',
      style: { backgroundColor: 'darkred', color: 'white' }
    },
    '11': { // 1011 - Logged in + Premium + Admin
      textContent: '⚡👑 Premium Admin',
      style: { backgroundColor: 'purple', color: 'gold' }
    },
    '15': { // 1111 - Everything!
      textContent: '⚡👑🔔 Premium Admin (All features)',
      style: { 
        background: 'linear-gradient(45deg, purple, gold)',
        color: 'white',
        fontWeight: 'bold',
        animation: 'rainbow 2s infinite'
      }
    },
    'default': {
      textContent: '🤔 Unknown state',
      style: { backgroundColor: 'gray' }
    }
  },
  '#user-badge'
);
```

---

### **Approach C: JSON String (Complex Objects)**

```javascript
const cart = {
  items: 3,
  total: 149.99,
  hasDiscount: true,
  shippingMethod: 'express'
};

// Serialize relevant state into JSON string
Conditions.whenState(
  () => JSON.stringify({
    hasItems: cart.items > 0,
    isHighValue: cart.total >= 100,
    hasDiscount: cart.hasDiscount,
    shipping: cart.shippingMethod
  }),
  {
    '{"hasItems":true,"isHighValue":true,"hasDiscount":true,"shipping":"express"}': {
      textContent: '🎉 VIP Order: Express + Discount + High Value!',
      style: { 
        background: 'linear-gradient(45deg, gold, orange)',
        color: 'white',
        padding: '20px',
        fontWeight: 'bold'
      }
    },
    '{"hasItems":true,"isHighValue":true,"hasDiscount":false,"shipping":"express"}': {
      textContent: '⚡ High Value Express Order',
      style: { backgroundColor: 'lightgreen' }
    },
    '{"hasItems":true,"isHighValue":false,"hasDiscount":true,"shipping":"standard"}': {
      textContent: '💰 Standard Order with Discount',
      style: { backgroundColor: 'lightyellow' }
    },
    '{"hasItems":false,"isHighValue":false,"hasDiscount":false,"shipping":"standard"}': {
      textContent: '🛒 Your cart is empty',
      style: { backgroundColor: 'lightgray', color: 'gray' }
    }
  },
  '#cart-status'
);
```

---

### **Approach D: Custom Matcher for Complex Conditions**

```javascript
// Register a custom matcher that can evaluate complex expressions
Conditions.registerMatcher('expression', {
  test: (condition) => condition.startsWith('expr:'),
  match: (value, condition) => {
    // value is an object with multiple properties
    // condition is like "expr:isLoggedIn && isPremium"
    
    const expr = condition.slice(5).trim(); // Remove 'expr:' prefix
    
    try {
      // Create a function that evaluates the expression
      const fn = new Function(...Object.keys(value), `return ${expr};`);
      return fn(...Object.values(value));
    } catch (e) {
      console.warn('Invalid expression:', expr, e);
      return false;
    }
  }
});

// Now use it with complex conditions!
const userState = {
  isLoggedIn: true,
  isPremium: false,
  credits: 150,
  level: 12
};

Conditions.whenState(
  () => userState,
  {
    'expr:isLoggedIn && isPremium && credits > 100': {
      textContent: '👑 Premium VIP (High Credits)',
      style: { backgroundColor: 'gold' }
    },
    'expr:isLoggedIn && level >= 10 && credits > 50': {
      textContent: '⭐ Advanced User',
      style: { backgroundColor: 'silver' }
    },
    'expr:isLoggedIn && !isPremium': {
      textContent: '👤 Standard Member',
      style: { backgroundColor: 'lightgray' }
    },
    'expr:!isLoggedIn': {
      textContent: '🔒 Please Login',
      style: { backgroundColor: 'white' }
    }
  },
  '#status'
);
```

---

## 🎯 **Pattern 2: Multiple Separate Conditions**

### **Approach A: Independent `whenState` for Each Condition**

```javascript
const gameState = {
  health: 75,
  mana: 40,
  stamina: 60,
  level: 8,
  experience: 450,
  gold: 1250
};

// Each property watched independently
Conditions.whenState(
  () => gameState.health,
  {
    '>=80': { 
      style: { backgroundColor: 'green', width: gameState.health + '%' },
      textContent: `HP: ${gameState.health}%`
    },
    '50-79': { 
      style: { backgroundColor: 'yellow', width: gameState.health + '%' },
      textContent: `HP: ${gameState.health}%`
    },
    '25-49': { 
      style: { backgroundColor: 'orange', width: gameState.health + '%' },
      textContent: `HP: ${gameState.health}% ⚠️`
    },
    '<25': { 
      style: { 
        backgroundColor: 'red', 
        width: gameState.health + '%',
        animation: 'pulse 0.5s infinite'
      },
      textContent: `HP: ${gameState.health}% 🚨`
    }
  },
  '#health-bar'
);

Conditions.whenState(
  () => gameState.mana,
  {
    '>=60': { 
      style: { backgroundColor: 'cyan', width: gameState.mana + '%' }
    },
    '30-59': { 
      style: { backgroundColor: 'blue', width: gameState.mana + '%' }
    },
    '<30': { 
      style: { backgroundColor: 'darkblue', width: gameState.mana + '%' }
    }
  },
  '#mana-bar'
);

Conditions.whenState(
  () => gameState.level,
  {
    '1-5': {
      textContent: `Level ${gameState.level} - Novice`,
      style: { color: 'gray', fontSize: '16px' }
    },
    '6-10': {
      textContent: `Level ${gameState.level} - Apprentice`,
      style: { color: 'blue', fontSize: '18px' }
    },
    '11-20': {
      textContent: `Level ${gameState.level} - Expert`,
      style: { color: 'purple', fontSize: '20px' }
    },
    '>20': {
      textContent: `Level ${gameState.level} - Master`,
      style: { color: 'gold', fontSize: '24px', fontWeight: 'bold' }
    }
  },
  '#level-display'
);

Conditions.whenState(
  () => gameState.gold,
  {
    '<100': {
      textContent: `💰 ${gameState.gold}g (Poor)`,
      style: { color: 'brown' }
    },
    '100-999': {
      textContent: `💰 ${gameState.gold}g`,
      style: { color: 'silver' }
    },
    '>=1000': {
      textContent: `💰 ${gameState.gold}g (Rich!)`,
      style: { color: 'gold', fontWeight: 'bold' }
    }
  },
  '#gold-display'
);
```

---

### **Approach B: Batch Multiple Independent Conditions**

```javascript
// Setup all watchers in batch for better performance
Conditions.batch(() => {
  // Health watcher
  Conditions.whenState(() => gameState.health, healthConditions, '#health-bar');
  
  // Mana watcher
  Conditions.whenState(() => gameState.mana, manaConditions, '#mana-bar');
  
  // Stamina watcher
  Conditions.whenState(() => gameState.stamina, staminaConditions, '#stamina-bar');
  
  // Level watcher
  Conditions.whenState(() => gameState.level, levelConditions, '#level-display');
  
  // Gold watcher
  Conditions.whenState(() => gameState.gold, goldConditions, '#gold-display');
  
  // Experience watcher
  Conditions.whenState(() => gameState.experience, xpConditions, '#xp-bar');
});
```

---

### **Approach C: Array of Conditions**

```javascript
// Define all your condition configs
const conditionConfigs = [
  {
    getValue: () => gameState.health,
    conditions: {
      '>=80': { style: { backgroundColor: 'green' } },
      '50-79': { style: { backgroundColor: 'yellow' } },
      '<50': { style: { backgroundColor: 'red' } }
    },
    selector: '#health-bar'
  },
  {
    getValue: () => gameState.mana,
    conditions: {
      '>=60': { style: { backgroundColor: 'cyan' } },
      '<60': { style: { backgroundColor: 'blue' } }
    },
    selector: '#mana-bar'
  },
  {
    getValue: () => gameState.level,
    conditions: {
      '1-10': { textContent: `Level ${gameState.level} - Beginner` },
      '>10': { textContent: `Level ${gameState.level} - Advanced` }
    },
    selector: '#level-display'
  }
];

// Apply all conditions
Conditions.batch(() => {
  conditionConfigs.forEach(config => {
    Conditions.whenState(
      config.getValue,
      config.conditions,
      config.selector
    );
  });
});
```

---

## 🧮 **Pattern 3: Multiple Computed Values**

### **Approach A: Individual Computed Values**

```javascript
const playerData = {
  strength: 15,
  intelligence: 12,
  agility: 18,
  luck: 8,
  baseHealth: 100,
  baseMana: 50,
  level: 10
};

// Computed value 1: Total Stats
function getTotalStats() {
  return playerData.strength + 
         playerData.intelligence + 
         playerData.agility + 
         playerData.luck;
}

// Computed value 2: Health Pool
function getMaxHealth() {
  return playerData.baseHealth + (playerData.strength * 5) + (playerData.level * 10);
}

// Computed value 3: Mana Pool
function getMaxMana() {
  return playerData.baseMana + (playerData.intelligence * 3) + (playerData.level * 5);
}

// Computed value 4: Critical Chance
function getCritChance() {
  return Math.min(50, (playerData.agility * 0.5) + (playerData.luck * 2));
}

// Computed value 5: Character Rank
function getCharacterRank() {
  const total = getTotalStats();
  if (total >= 80) return 'S';
  if (total >= 60) return 'A';
  if (total >= 40) return 'B';
  if (total >= 20) return 'C';
  return 'D';
}

// Watch each computed value independently
Conditions.whenState(
  () => getTotalStats(),
  {
    '<30': {
      textContent: `Total Stats: ${getTotalStats()} - Weak`,
      style: { color: 'gray' }
    },
    '30-59': {
      textContent: `Total Stats: ${getTotalStats()} - Average`,
      style: { color: 'blue' }
    },
    '60-79': {
      textContent: `Total Stats: ${getTotalStats()} - Strong`,
      style: { color: 'purple' }
    },
    '>=80': {
      textContent: `Total Stats: ${getTotalStats()} - Elite!`,
      style: { color: 'gold', fontWeight: 'bold' }
    }
  },
  '#total-stats'
);

Conditions.whenState(
  () => getMaxHealth(),
  {
    '<200': {
      textContent: `Max HP: ${getMaxHealth()} (Low)`,
      style: { color: 'red' }
    },
    '200-299': {
      textContent: `Max HP: ${getMaxHealth()}`,
      style: { color: 'orange' }
    },
    '>=300': {
      textContent: `Max HP: ${getMaxHealth()} (Tank!)`,
      style: { color: 'green', fontWeight: 'bold' }
    }
  },
  '#max-health'
);

Conditions.whenState(
  () => getCritChance(),
  {
    '<10': {
      textContent: `Crit: ${getCritChance().toFixed(1)}%`,
      style: { color: 'gray' }
    },
    '10-24': {
      textContent: `Crit: ${getCritChance().toFixed(1)}%`,
      style: { color: 'blue' }
    },
    '25-39': {
      textContent: `Crit: ${getCritChance().toFixed(1)}% ⚡`,
      style: { color: 'purple' }
    },
    '>=40': {
      textContent: `Crit: ${getCritChance().toFixed(1)}% 💥`,
      style: { color: 'red', fontWeight: 'bold' }
    }
  },
  '#crit-chance'
);

Conditions.whenState(
  () => getCharacterRank(),
  {
    'S': {
      textContent: '🏆 Rank S - Legendary',
      style: { 
        background: 'linear-gradient(45deg, gold, orange)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px'
      }
    },
    'A': {
      textContent: '⭐ Rank A - Elite',
      style: { backgroundColor: 'purple', color: 'white' }
    },
    'B': {
      textContent: '✓ Rank B - Strong',
      style: { backgroundColor: 'blue', color: 'white' }
    },
    'C': {
      textContent: 'Rank C - Average',
      style: { backgroundColor: 'gray' }
    },
    'D': {
      textContent: 'Rank D - Beginner',
      style: { backgroundColor: 'lightgray' }
    }
  },
  '#character-rank'
);
```

---

### **Approach B: Single Effect with Multiple Computed Values**

```javascript
// Create ONE reactive effect that computes everything
if (window.ReactiveUtils) {
  ReactiveUtils.effect(() => {
    // Compute all values
    const totalStats = getTotalStats();
    const maxHealth = getMaxHealth();
    const maxMana = getMaxMana();
    const critChance = getCritChance();
    const rank = getCharacterRank();
    
    // Determine overall power level
    const powerLevel = Math.floor(
      (totalStats * 2) + 
      (maxHealth * 0.1) + 
      (maxMana * 0.2) + 
      (critChance * 3)
    );
    
    // Batch update everything based on computed values
    Conditions.batch(() => {
      // Total stats display
      Conditions.apply(totalStats, {
        '<30': { textContent: `Stats: ${totalStats}`, style: { color: 'gray' } },
        '30-59': { textContent: `Stats: ${totalStats}`, style: { color: 'blue' } },
        '60-79': { textContent: `Stats: ${totalStats}`, style: { color: 'purple' } },
        '>=80': { textContent: `Stats: ${totalStats}`, style: { color: 'gold' } }
      }, '#total-stats');
      
      // Health pool
      Conditions.apply(maxHealth, {
        '<200': { textContent: `HP: ${maxHealth}`, style: { color: 'red' } },
        '200-299': { textContent: `HP: ${maxHealth}`, style: { color: 'orange' } },
        '>=300': { textContent: `HP: ${maxHealth}`, style: { color: 'green' } }
      }, '#max-health');
      
      // Mana pool
      Conditions.apply(maxMana, {
        '<100': { textContent: `MP: ${maxMana}`, style: { color: 'lightblue' } },
        '100-199': { textContent: `MP: ${maxMana}`, style: { color: 'blue' } },
        '>=200': { textContent: `MP: ${maxMana}`, style: { color: 'darkblue' } }
      }, '#max-mana');
      
      // Crit chance
      Conditions.apply(critChance, {
        '<10': { textContent: `Crit: ${critChance.toFixed(1)}%` },
        '10-24': { textContent: `Crit: ${critChance.toFixed(1)}%` },
        '25-39': { textContent: `Crit: ${critChance.toFixed(1)}% ⚡` },
        '>=40': { textContent: `Crit: ${critChance.toFixed(1)}% 💥` }
      }, '#crit-chance');
      
      // Character rank
      Conditions.apply(rank, {
        'S': { textContent: '🏆 Rank S', style: { background: 'gold' } },
        'A': { textContent: '⭐ Rank A', style: { background: 'purple' } },
        'B': { textContent: '✓ Rank B', style: { background: 'blue' } },
        'C': { textContent: 'Rank C', style: { background: 'gray' } },
        'D': { textContent: 'Rank D', style: { background: 'lightgray' } }
      }, '#character-rank');
      
      // Power level (combined metric)
      Conditions.apply(powerLevel, {
        '<500': {
          textContent: `Power: ${powerLevel} - Novice`,
          style: { fontSize: '16px', color: 'gray' }
        },
        '500-999': {
          textContent: `Power: ${powerLevel} - Warrior`,
          style: { fontSize: '18px', color: 'blue' }
        },
        '1000-1499': {
          textContent: `Power: ${powerLevel} - Hero`,
          style: { fontSize: '20px', color: 'purple' }
        },
        '>=1500': {
          textContent: `Power: ${powerLevel} - LEGEND!`,
          style: { 
            fontSize: '24px', 
            color: 'gold',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px orange'
          }
        }
      }, '#power-level');
    });
  });
}
```

---

### **Approach C: Computed Object with Multiple Properties**

```javascript
// Create a computed state object
function getComputedState() {
  const totalStats = getTotalStats();
  const maxHealth = getMaxHealth();
  const maxMana = getMaxMana();
  const critChance = getCritChance();
  const rank = getCharacterRank();
  
  return {
    totalStats,
    maxHealth,
    maxMana,
    critChance,
    rank,
    powerLevel: Math.floor(
      (totalStats * 2) + 
      (maxHealth * 0.1) + 
      (maxMana * 0.2) + 
      (critChance * 3)
    ),
    // Derived classifications
    isTank: maxHealth >= 300,
    isMage: maxMana >= 200,
    isCritBuild: critChance >= 30,
    isBalanced: Math.abs(playerData.strength - playerData.intelligence) <= 5,
    // Overall tier
    tier: rank === 'S' ? 'legendary' : 
          rank === 'A' ? 'elite' : 
          rank === 'B' ? 'advanced' : 'standard'
  };
}

// Watch the computed object and use JSON serialization
Conditions.whenState(
  () => {
    const computed = getComputedState();
    // Create a simple classification string
    return `${computed.tier}-${computed.isTank ? 'tank' : ''}-${computed.isMage ? 'mage' : ''}-${computed.isCritBuild ? 'crit' : ''}`;
  },
  {
    'legendary-tank-mage-crit': {
      textContent: '🏆 ULTIMATE BUILD: Tank/Mage/Crit!',
      style: { 
        background: 'linear-gradient(45deg, gold, purple, red)',
        color: 'white',
        padding: '15px',
        fontSize: '20px',
        fontWeight: 'bold'
      }
    },
    'legendary-tank--': {
      textContent: '🛡️ Legendary Tank',
      style: { background: 'green', color: 'white' }
    },
    'legendary--mage-': {
      textContent: '🔮 Legendary Mage',
      style: { background: 'purple', color: 'white' }
    },
    'legendary---crit': {
      textContent: '⚔️ Legendary Assassin',
      style: { background: 'red', color: 'white' }
    },
    'elite-tank--': {
      textContent: '🛡️ Elite Tank',
      style: { background: 'darkgreen', color: 'white' }
    },
    'elite--mage-': {
      textContent: '🔮 Elite Mage',
      style: { background: 'darkpurple', color: 'white' }
    },
    'standard---': {
      textContent: '⚔️ Standard Warrior',
      style: { background: 'gray', color: 'white' }
    }
  },
  '#build-classification'
);

// Also display individual computed values
Conditions.whenState(
  () => getComputedState().powerLevel,
  {
    '<500': { textContent: `Power: ${getComputedState().powerLevel}` },
    '500-999': { textContent: `Power: ${getComputedState().powerLevel}` },
    '1000-1499': { textContent: `Power: ${getComputedState().powerLevel}` },
    '>=1500': { textContent: `Power: ${getComputedState().powerLevel} 🔥` }
  },
  '#power-display'
);
```

---

### **Approach D: Computed Values with Custom Matchers**

```javascript
// Register matcher for complex computed comparisons
Conditions.registerMatcher('computed', {
  test: (condition) => condition.startsWith('computed:'),
  match: (value, condition) => {
    // value is the computed state object
    // condition is like "computed:isTank && critChance > 25"
    
    const expr = condition.slice(9).trim();
    
    try {
      const fn = new Function('state', `with(state) { return ${expr}; }`);
      return fn(value);
    } catch (e) {
      console.warn('Invalid computed expression:', expr);
      return false;
    }
  }
});

// Use it
Conditions.whenState(
  () => getComputedState(),
  {
    'computed:isTank && isMage': {
      textContent: '🛡️🔮 Battle Mage Build',
      style: { background: 'linear-gradient(45deg, green, purple)' }
    },
    'computed:isCritBuild && powerLevel > 1000': {
      textContent: '⚔️💥 High-Powered Assassin',
      style: { background: 'red', color: 'white' }
    },
    'computed:isBalanced && tier === "legendary"': {
      textContent: '⚖️🏆 Legendary Balanced Build',
      style: { background: 'gold', color: 'black' }
    },
    'computed:powerLevel < 500': {
      textContent: '📚 Training Build',
      style: { background: 'lightgray' }
    }
  },
  '#advanced-classification'
);
```

---

## 📊 **Comparison Summary**

| Pattern | Best For | Pros | Cons |
|---------|----------|------|------|
| **Combined String** | 2-4 boolean flags | Simple, explicit | Gets unwieldy with many combinations |
| **Numeric Score** | Bit flags, state machines | Compact, efficient | Less readable |
| **JSON String** | Complex objects | Flexible | Verbose condition keys |
| **Custom Matcher** | Complex logic | Most powerful | Requires setup |
| **Separate Conditions** | Independent values | Clear, maintainable | Multiple watchers |
| **Computed Values** | Derived state | Automatic recalc | Can be expensive |

---

## ✅ **Best Practices**

1. **Simple cases**: Use separate `whenState` calls
2. **Related booleans**: Combine into string or numeric score
3. **Complex logic**: Use custom matchers with expressions
4. **Performance**: Batch all updates in single effect
5. **Maintainability**: Use computed functions with clear names

Choose the pattern that best fits your use case! 🎯