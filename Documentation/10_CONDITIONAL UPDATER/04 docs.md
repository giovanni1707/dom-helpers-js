# Conditional Rendering Examples - Display & Visibility Control

Here are comprehensive examples showing how to use Conditions as a **conditional renderer** similar to frameworks like React, Vue, or Angular.

---

## Basic Patterns

### 1. Simple Show/Hide with `display`

```javascript
const isLoggedIn = ReactiveUtils.state(false);

// Basic conditional rendering
Conditions.whenState(
  () => isLoggedIn.value,
  {
    'true': { 
      style: { display: 'block' } 
    },
    'false': { 
      style: { display: 'none' } 
    }
  },
  '#userDashboard'
);

// Shorter version using truthy/falsy
Conditions.whenState(
  () => isLoggedIn.value,
  {
    'truthy': { style: { display: 'block' } },
    'falsy': { style: { display: 'none' } }
  },
  '#loginButton'
);
```

---

### 2. Show/Hide with `visibility`

```javascript
const showTooltip = ReactiveUtils.state(false);

// Using visibility (keeps space, just invisible)
Conditions.whenState(
  () => showTooltip.value,
  {
    'true': { 
      style: { 
        visibility: 'visible',
        opacity: '1',
        transition: 'opacity 0.3s ease'
      } 
    },
    'false': { 
      style: { 
        visibility: 'hidden',
        opacity: '0'
      } 
    }
  },
  '#tooltip'
);
```

---

### 3. Multiple Elements - Conditional Sections

```javascript
const currentView = ReactiveUtils.state('home');

// Show only one view at a time
Conditions.whenState(
  () => currentView.value,
  {
    'home': { style: { display: 'block' } },
    'default': { style: { display: 'none' } }
  },
  '#homeView'
);

Conditions.whenState(
  () => currentView.value,
  {
    'profile': { style: { display: 'block' } },
    'default': { style: { display: 'none' } }
  },
  '#profileView'
);

Conditions.whenState(
  () => currentView.value,
  {
    'settings': { style: { display: 'block' } },
    'default': { style: { display: 'none' } }
  },
  '#settingsView'
);
```

---

## Advanced Conditional Rendering Patterns

### 4. If/Else Pattern (Two-Way Toggle)

```javascript
const hasNotifications = ReactiveUtils.state(false);

// Show notification badge
Conditions.whenState(
  () => hasNotifications.value,
  {
    'true': { 
      style: { display: 'inline-block' },
      textContent: '🔔 New',
      classList: { add: 'badge-visible' }
    },
    'false': { 
      style: { display: 'none' },
      classList: { remove: 'badge-visible' }
    }
  },
  '#notificationBadge'
);

// Show "no notifications" message
Conditions.whenState(
  () => hasNotifications.value,
  {
    'false': { 
      style: { display: 'block' },
      innerHTML: '<p class="empty-state">No new notifications</p>'
    },
    'true': { 
      style: { display: 'none' } 
    }
  },
  '#emptyNotifications'
);
```

---

### 5. Multiple Conditions (Switch/Case Style)

```javascript
const userRole = ReactiveUtils.state('guest');

// Admin panel - only for admins
Conditions.whenState(
  () => userRole.value,
  {
    'admin': { style: { display: 'block' } },
    'default': { style: { display: 'none' } }
  },
  '#adminPanel'
);

// Moderator tools - for moderators and admins
Conditions.whenState(
  () => userRole.value,
  {
    'admin': { style: { display: 'block' } },
    'moderator': { style: { display: 'block' } },
    'default': { style: { display: 'none' } }
  },
  '#moderatorTools'
);

// User content - for everyone except guests
Conditions.whenState(
  () => userRole.value,
  {
    'guest': { style: { display: 'none' } },
    'default': { style: { display: 'block' } }
  },
  '#userContent'
);

// Guest prompt - only for guests
Conditions.whenState(
  () => userRole.value,
  {
    'guest': { style: { display: 'block' } },
    'default': { style: { display: 'none' } }
  },
  '#guestPrompt'
);
```

---

### 6. List Rendering Based on Array Length

```javascript
const items = ReactiveUtils.state([]);

// Show list when items exist
Conditions.whenState(
  () => items.value.length,
  {
    '0': { style: { display: 'none' } },
    '>0': { 
      style: { display: 'block' },
      innerHTML: () => `
        <ul>
          ${items.value.map(item => `
            <li>${item.name}</li>
          `).join('')}
        </ul>
      `
    }
  },
  '#itemList'
);

// Show empty state when no items
Conditions.whenState(
  () => items.value.length,
  {
    '0': { 
      style: { display: 'flex' },
      innerHTML: `
        <div class="empty-state">
          <img src="/empty.svg" alt="No items">
          <h3>No items yet</h3>
          <button onclick="addFirstItem()">Add your first item</button>
        </div>
      `
    },
    '>0': { style: { display: 'none' } }
  },
  '#emptyState'
);
```

---

## Real-World Examples

### 7. E-Commerce Product Availability

```javascript
const product = ReactiveUtils.state({
  id: 'prod-123',
  name: 'Wireless Headphones',
  stock: 5,
  inCart: false
});

// Show "Add to Cart" button when available and not in cart
Conditions.whenState(
  () => ({ stock: product.value.stock, inCart: product.value.inCart }),
  {
    'truthy': () => {
      if (product.value.stock > 0 && !product.value.inCart) {
        return {
          style: { display: 'inline-block' },
          textContent: 'Add to Cart',
          onclick: () => addToCart(product.value.id)
        };
      }
      return { style: { display: 'none' } };
    }
  },
  '#addToCartButton'
);

// Show "Already in Cart" when in cart
Conditions.whenState(
  () => product.value.inCart,
  {
    'true': { 
      style: { display: 'inline-block' },
      textContent: '✓ In Cart',
      classList: { add: 'in-cart' }
    },
    'false': { style: { display: 'none' } }
  },
  '#inCartIndicator'
);

// Show "Out of Stock" when no stock
Conditions.whenState(
  () => product.value.stock,
  {
    '0': { 
      style: { display: 'block' },
      innerHTML: `
        <div class="out-of-stock-banner">
          <span>Out of Stock</span>
          <button onclick="notifyMe()">Notify When Available</button>
        </div>
      `
    },
    '>0': { style: { display: 'none' } }
  },
  '#outOfStockBanner'
);

// Show low stock warning
Conditions.whenState(
  () => product.value.stock,
  {
    '1-5': { 
      style: { display: 'block' },
      innerHTML: () => `⚠️ Only ${product.value.stock} left!`,
      classList: { add: 'low-stock-warning' }
    },
    'default': { style: { display: 'none' } }
  },
  '#lowStockWarning'
);
```

---

### 8. Authentication Flow

```javascript
const auth = ReactiveUtils.state({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null
});

// Show loading spinner
Conditions.whenState(
  () => auth.value.isLoading,
  {
    'true': { 
      style: { display: 'flex' },
      innerHTML: `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Authenticating...</p>
        </div>
      `
    },
    'false': { style: { display: 'none' } }
  },
  '#authLoading'
);

// Show login form (not authenticated, not loading)
Conditions.whenState(
  () => ({ auth: auth.value.isAuthenticated, loading: auth.value.isLoading }),
  {
    'truthy': () => {
      if (!auth.value.isAuthenticated && !auth.value.isLoading) {
        return { style: { display: 'block' } };
      }
      return { style: { display: 'none' } };
    }
  },
  '#loginForm'
);

// Show authenticated content
Conditions.whenState(
  () => auth.value.isAuthenticated,
  {
    'true': { 
      style: { display: 'block' },
      innerHTML: () => `
        <div class="user-dashboard">
          <h2>Welcome, ${auth.value.user.name}!</h2>
          <div class="dashboard-content">
            <!-- Dashboard content here -->
          </div>
        </div>
      `
    },
    'false': { style: { display: 'none' } }
  },
  '#authenticatedContent'
);

// Show error message
Conditions.whenState(
  () => auth.value.error,
  {
    'null': { style: { display: 'none' } },
    'truthy': { 
      style: { display: 'block' },
      innerHTML: () => `
        <div class="error-banner">
          <span>❌ ${auth.value.error}</span>
          <button onclick="dismissError()">✕</button>
        </div>
      `,
      classList: { add: 'error' }
    }
  },
  '#authError'
);
```

---

### 9. Multi-Step Form Wizard

```javascript
const formWizard = ReactiveUtils.state({
  currentStep: 1,
  totalSteps: 4,
  data: {}
});

// Step 1: Personal Info
Conditions.whenState(
  () => formWizard.value.currentStep,
  {
    '1': { style: { display: 'block' } },
    'default': { style: { display: 'none' } }
  },
  '#step1'
);

// Step 2: Address
Conditions.whenState(
  () => formWizard.value.currentStep,
  {
    '2': { style: { display: 'block' } },
    'default': { style: { display: 'none' } }
  },
  '#step2'
);

// Step 3: Payment
Conditions.whenState(
  () => formWizard.value.currentStep,
  {
    '3': { style: { display: 'block' } },
    'default': { style: { display: 'none' } }
  },
  '#step3'
);

// Step 4: Review
Conditions.whenState(
  () => formWizard.value.currentStep,
  {
    '4': { 
      style: { display: 'block' },
      innerHTML: () => `
        <div class="review-step">
          <h3>Review Your Information</h3>
          <pre>${JSON.stringify(formWizard.value.data, null, 2)}</pre>
        </div>
      `
    },
    'default': { style: { display: 'none' } }
  },
  '#step4'
);

// Previous button (hide on first step)
Conditions.whenState(
  () => formWizard.value.currentStep,
  {
    '1': { style: { display: 'none' } },
    '>1': { 
      style: { display: 'inline-block' },
      onclick: () => {
        formWizard.value = {
          ...formWizard.value,
          currentStep: formWizard.value.currentStep - 1
        };
      }
    }
  },
  '#prevButton'
);

// Next button (hide on last step)
Conditions.whenState(
  () => formWizard.value.currentStep,
  {
    '4': { style: { display: 'none' } },
    '<4': { 
      style: { display: 'inline-block' },
      textContent: 'Next',
      onclick: () => {
        formWizard.value = {
          ...formWizard.value,
          currentStep: formWizard.value.currentStep + 1
        };
      }
    }
  },
  '#nextButton'
);

// Submit button (show only on last step)
Conditions.whenState(
  () => formWizard.value.currentStep,
  {
    '4': { 
      style: { display: 'inline-block' },
      textContent: 'Submit',
      onclick: () => submitForm(formWizard.value.data)
    },
    'default': { style: { display: 'none' } }
  },
  '#submitButton'
);
```

---

### 10. Search Results with States

```javascript
const search = ReactiveUtils.state({
  query: '',
  results: [],
  isSearching: false,
  hasSearched: false,
  error: null
});

// Show search prompt (initial state)
Conditions.whenState(
  () => ({ hasSearched: search.value.hasSearched, isSearching: search.value.isSearching }),
  {
    'truthy': () => {
      if (!search.value.hasSearched && !search.value.isSearching) {
        return {
          style: { display: 'flex' },
          innerHTML: `
            <div class="search-prompt">
              <img src="/search-icon.svg" alt="Search">
              <h3>Start Searching</h3>
              <p>Enter keywords to find what you're looking for</p>
            </div>
          `
        };
      }
      return { style: { display: 'none' } };
    }
  },
  '#searchPrompt'
);

// Show loading state
Conditions.whenState(
  () => search.value.isSearching,
  {
    'true': { 
      style: { display: 'flex' },
      innerHTML: `
        <div class="searching">
          <div class="spinner"></div>
          <p>Searching for "${search.value.query}"...</p>
        </div>
      `
    },
    'false': { style: { display: 'none' } }
  },
  '#searchLoading'
);

// Show results (when found)
Conditions.whenState(
  () => ({ 
    results: search.value.results.length, 
    searching: search.value.isSearching,
    searched: search.value.hasSearched
  }),
  {
    'truthy': () => {
      if (search.value.results.length > 0 && 
          !search.value.isSearching && 
          search.value.hasSearched) {
        return {
          style: { display: 'block' },
          innerHTML: () => `
            <div class="search-results">
              <h3>${search.value.results.length} results for "${search.value.query}"</h3>
              <div class="results-grid">
                ${search.value.results.map(result => `
                  <div class="result-card">
                    <h4>${result.title}</h4>
                    <p>${result.description}</p>
                    <a href="${result.url}">View More →</a>
                  </div>
                `).join('')}
              </div>
            </div>
          `
        };
      }
      return { style: { display: 'none' } };
    }
  },
  '#searchResults'
);

// Show no results (when searched but nothing found)
Conditions.whenState(
  () => ({ 
    results: search.value.results.length, 
    searching: search.value.isSearching,
    searched: search.value.hasSearched
  }),
  {
    'truthy': () => {
      if (search.value.results.length === 0 && 
          !search.value.isSearching && 
          search.value.hasSearched) {
        return {
          style: { display: 'flex' },
          innerHTML: () => `
            <div class="no-results">
              <img src="/no-results.svg" alt="No results">
              <h3>No results found</h3>
              <p>We couldn't find anything matching "${search.value.query}"</p>
              <button onclick="clearSearch()">Try a different search</button>
            </div>
          `
        };
      }
      return { style: { display: 'none' } };
    }
  },
  '#noResults'
);

// Show error state
Conditions.whenState(
  () => search.value.error,
  {
    'null': { style: { display: 'none' } },
    'truthy': { 
      style: { display: 'flex' },
      innerHTML: () => `
        <div class="search-error">
          <span class="error-icon">⚠️</span>
          <h3>Search Error</h3>
          <p>${search.value.error}</p>
          <button onclick="retrySearch()">Try Again</button>
        </div>
      `
    }
  },
  '#searchError'
);
```

---

### 11. Shopping Cart Conditional Rendering

```javascript
const cart = ReactiveUtils.state({
  items: [],
  total: 0,
  isCheckingOut: false
});

// Show cart items (when cart has items)
Conditions.whenState(
  () => cart.value.items.length,
  {
    '>0': { 
      style: { display: 'block' },
      innerHTML: () => `
        <div class="cart-items">
          <h3>Your Cart (${cart.value.items.length} ${cart.value.items.length === 1 ? 'item' : 'items'})</h3>
          ${cart.value.items.map(item => `
            <div class="cart-item">
              <img src="${item.image}" alt="${item.name}">
              <div class="item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <input type="number" value="${item.quantity}" min="1" 
                       onchange="updateQuantity('${item.id}', this.value)">
              </div>
              <button onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
          `).join('')}
          <div class="cart-total">
            <strong>Total: $${cart.value.total.toFixed(2)}</strong>
          </div>
        </div>
      `
    },
    '0': { style: { display: 'none' } }
  },
  '#cartItems'
);

// Show empty cart message
Conditions.whenState(
  () => cart.value.items.length,
  {
    '0': { 
      style: { display: 'flex' },
      innerHTML: `
        <div class="empty-cart">
          <img src="/empty-cart.svg" alt="Empty cart">
          <h3>Your cart is empty</h3>
          <p>Add some items to get started!</p>
          <button onclick="continueShopping()">Continue Shopping</button>
        </div>
      `
    },
    '>0': { style: { display: 'none' } }
  },
  '#emptyCart'
);

// Show checkout button (only when cart has items and not checking out)
Conditions.whenState(
  () => ({ items: cart.value.items.length, checkout: cart.value.isCheckingOut }),
  {
    'truthy': () => {
      if (cart.value.items.length > 0 && !cart.value.isCheckingOut) {
        return {
          style: { display: 'block' },
          innerHTML: () => `
            <button class="checkout-button" onclick="startCheckout()">
              Proceed to Checkout ($${cart.value.total.toFixed(2)})
            </button>
          `
        };
      }
      return { style: { display: 'none' } };
    }
  },
  '#checkoutButton'
);

// Show shipping calculator (only when cart has items)
Conditions.whenState(
  () => cart.value.items.length,
  {
    '>0': { 
      style: { display: 'block' },
      innerHTML: () => {
        const freeShippingThreshold = 50;
        const remaining = freeShippingThreshold - cart.value.total;
        
        if (remaining > 0) {
          return `
            <div class="shipping-info">
              <p>Add $${remaining.toFixed(2)} more for free shipping!</p>
              <div class="progress-bar">
                <div style="width: ${(cart.value.total / freeShippingThreshold * 100)}%"></div>
              </div>
            </div>
          `;
        } else {
          return `
            <div class="shipping-info free">
              <p>🎉 You qualify for free shipping!</p>
            </div>
          `;
        }
      }
    },
    '0': { style: { display: 'none' } }
  },
  '#shippingCalculator'
);

// Show checkout progress
Conditions.whenState(
  () => cart.value.isCheckingOut,
  {
    'true': { 
      style: { display: 'block' },
      innerHTML: `
        <div class="checkout-overlay">
          <div class="checkout-modal">
            <h3>Processing Checkout...</h3>
            <div class="progress-spinner"></div>
          </div>
        </div>
      `
    },
    'false': { style: { display: 'none' } }
  },
  '#checkoutOverlay'
);
```

---

### 12. Notification System

```javascript
const notifications = ReactiveUtils.state([]);

// Show notification container (only when notifications exist)
Conditions.whenState(
  () => notifications.value.length,
  {
    '>0': { style: { display: 'block' } },
    '0': { style: { display: 'none' } }
  },
  '#notificationContainer'
);

// Render each notification type
Conditions.whenState(
  () => notifications.value.length,
  {
    '>0': { 
      style: { display: 'block' },
      innerHTML: () => `
        <div class="notifications">
          ${notifications.value.map((notif, index) => `
            <div class="notification notification-${notif.type}" 
                 style="display: block; animation: slideIn 0.3s ease;">
              <span class="icon">${getNotificationIcon(notif.type)}</span>
              <div class="content">
                <strong>${notif.title}</strong>
                <p>${notif.message}</p>
              </div>
              <button onclick="dismissNotification(${index})">✕</button>
            </div>
          `).join('')}
        </div>
      `
    },
    '0': { style: { display: 'none' } }
  },
  '#notificationList'
);

// Show notification badge count
Conditions.whenState(
  () => notifications.value.length,
  {
    '0': { style: { display: 'none' } },
    '>0': { 
      style: { display: 'inline-flex' },
      textContent: () => notifications.value.length > 99 ? '99+' : String(notifications.value.length),
      classList: { add: 'badge-active' }
    }
  },
  '#notificationBadge'
);

// Helper functions
function getNotificationIcon(type) {
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };
  return icons[type] || 'ℹ';
}

function dismissNotification(index) {
  notifications.value = notifications.value.filter((_, i) => i !== index);
}

// Add notification example
function addNotification(title, message, type = 'info') {
  notifications.value = [
    ...notifications.value,
    { title, message, type, id: Date.now() }
  ];
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    notifications.value = notifications.value.slice(1);
  }, 5000);
}
```

---

### 13. Modal/Dialog Conditional Rendering

```javascript
const modal = ReactiveUtils.state({
  isOpen: false,
  type: null,
  data: null
});

// Show modal overlay
Conditions.whenState(
  () => modal.value.isOpen,
  {
    'true': { 
      style: { 
        display: 'flex',
        animation: 'fadeIn 0.3s ease'
      },
      onclick: (e) => {
        if (e.target.id === 'modalOverlay') {
          closeModal();
        }
      }
    },
    'false': { 
      style: { display: 'none' } 
    }
  },
  '#modalOverlay'
);

// Show confirm modal
Conditions.whenState(
  () => ({ open: modal.value.isOpen, type: modal.value.type }),
  {
    'truthy': () => {
      if (modal.value.isOpen && modal.value.type === 'confirm') {
        return {
          style: { display: 'block' },
          innerHTML: () => `
            <div class="modal confirm-modal">
              <h3>${modal.value.data.title}</h3>
              <p>${modal.value.data.message}</p>
              <div class="modal-actions">
                <button class="btn-cancel" onclick="modal.value.data.onCancel()">
                  Cancel
                </button>
                <button class="btn-confirm" onclick="modal.value.data.onConfirm()">
                  Confirm
                </button>
              </div>
            </div>
          `
        };
      }
      return { style: { display: 'none' } };
    }
  },
  '#confirmModal'
);

// Show alert modal
Conditions.whenState(
  () => ({ open: modal.value.isOpen, type: modal.value.type }),
  {
    'truthy': () => {
      if (modal.value.isOpen && modal.value.type === 'alert') {
        return {
          style: { display: 'block' },
          innerHTML: () => `
            <div class="modal alert-modal">
              <h3>${modal.value.data.title}</h3>
              <p>${modal.value.data.message}</p>
              <button onclick="closeModal()">OK</button>
            </div>
          `
        };
      }
      return { style: { display: 'none' } };
    }
  },
  '#alertModal'
);

// Show custom content modal
Conditions.whenState(
  () => ({ open: modal.value.isOpen, type: modal.value.type }),
  {
    'truthy': () => {
      if (modal.value.isOpen && modal.value.type === 'custom') {
        return {
          style: { display: 'block' },
          innerHTML: () => modal.value.data.content
        };
      }
      return { style: { display: 'none' } };
    }
  },
  '#customModal'
);

// Helper functions
function closeModal() {
  modal.value = { isOpen: false, type: null, data: null };
}

function showConfirm(title, message, onConfirm, onCancel = closeModal) {
  modal.value = {
    isOpen: true,
    type: 'confirm',
    data: { title, message, onConfirm, onCancel }
  };
}

function showAlert(title, message) {
  modal.value = {
    isOpen: true,
    type: 'alert',
    data: { title, message }
  };
}
```

---

### 14. Tabs/Accordion Pattern

```javascript
const tabs = ReactiveUtils.state({
  activeTab: 'overview'
});

// Tab 1: Overview
Conditions.whenState(
  () => tabs.value.activeTab,
  {
    'overview': { 
      style: { display: 'block' },
      classList: { add: 'tab-active' }
    },
    'default': { 
      style: { display: 'none' },
      classList: { remove: 'tab-active' }
    }
  },
  '#tabOverview'
);

// Tab 2: Specifications
Conditions.whenState(
  () => tabs.value.activeTab,
  {
    'specifications': { 
      style: { display: 'block' },
      classList: { add: 'tab-active' }
    },
    'default': { 
      style: { display: 'none' },
      classList: { remove: 'tab-active' }
    }
  },
  '#tabSpecifications'
);

// Tab 3: Reviews
Conditions.whenState(
  () => tabs.value.activeTab,
  {
    'reviews': { 
      style: { display: 'block' },
      classList: { add: 'tab-active' }
    },
    'default': { 
      style: { display: 'none' },
      classList: { remove: 'tab-active' }
    }
  },
  '#tabReviews'
);

// Tab buttons - highlight active
Conditions.whenState(
  () => tabs.value.activeTab,
  {
    'overview': { classList: { add: 'active' } },
    'default': { classList: { remove: 'active' } }
  },
  '#btnOverview'
);

Conditions.whenState(
  () => tabs.value.activeTab,
  {
    'specifications': { classList: { add: 'active' } },
    'default': { classList: { remove: 'active' } }
  },
  '#btnSpecifications'
);

Conditions.whenState(
  () => tabs.value.activeTab,
  {
    'reviews': { classList: { add: 'active' } },
    'default': { classList: { remove: 'active' } }
  },
  '#btnReviews'
);

// Tab switching function
function switchTab(tabName) {
  tabs.value = { activeTab: tabName };
}
```

---

## Helper: Reusable Conditional Renderer

Create a helper function for common patterns:

```javascript
// Helper function for simple show/hide
function conditionalRender(condition, selector, display = 'block') {
  Conditions.whenState(
    condition,
    {
      'truthy': { style: { display } },
      'falsy': { style: { display: 'none' } }
    },
    selector
  );
}

// Usage examples
const showSidebar = ReactiveUtils.state(true);
const hasData = ReactiveUtils.state(false);
const isAdmin = ReactiveUtils.state(false);

conditionalRender(() => showSidebar.value, '#sidebar');
conditionalRender(() => hasData.value, '#dataTable');
conditionalRender(() => isAdmin.value, '#adminPanel', 'flex');

// ============================================================================
// ADVANCED HELPER: Multi-State Conditional Renderer
// ============================================================================

class ConditionalRenderer {
  constructor() {
    this.activeViews = new Map();
  }

  /**
   * Show only one element from a group at a time
   */
  showOnly(state, mapping) {
    Object.entries(mapping).forEach(([condition, selector]) => {
      Conditions.whenState(
        state,
        {
          [condition]: { style: { display: 'block' } },
          'default': { style: { display: 'none' } }
        },
        selector
      );
    });
  }

  /**
   * Toggle visibility based on boolean state
   */
  toggle(state, showSelector, hideSelector) {
    Conditions.whenState(
      state,
      {
        'true': { style: { display: 'block' } },
        'false': { style: { display: 'none' } }
      },
      showSelector
    );

    if (hideSelector) {
      Conditions.whenState(
        state,
        {
          'true': { style: { display: 'none' } },
          'false': { style: { display: 'block' } }
        },
        hideSelector
      );
    }
  }

  /**
   * Show/hide based on array length
   */
  whenHasItems(arrayState, selector, emptySelector) {
    Conditions.whenState(
      () => arrayState().length,
      {
        '>0': { style: { display: 'block' } },
        '0': { style: { display: 'none' } }
      },
      selector
    );

    if (emptySelector) {
      Conditions.whenState(
        () => arrayState().length,
        {
          '0': { style: { display: 'block' } },
          '>0': { style: { display: 'none' } }
        },
        emptySelector
      );
    }
  }

  /**
   * Show element only when condition is met
   */
  showWhen(conditionFn, selector, display = 'block') {
    Conditions.whenState(
      conditionFn,
      {
        'truthy': { style: { display } },
        'falsy': { style: { display: 'none' } }
      },
      selector
    );
  }

  /**
   * Hide element when condition is met
   */
  hideWhen(conditionFn, selector) {
    Conditions.whenState(
      conditionFn,
      {
        'truthy': { style: { display: 'none' } },
        'falsy': { style: { display: 'block' } }
      },
      selector
    );
  }
}

// Create global instance
const renderer = new ConditionalRenderer();

// ============================================================================
// USAGE EXAMPLES WITH HELPER
// ============================================================================

const appState = ReactiveUtils.state({
  view: 'home',
  isLoading: false,
  user: null,
  notifications: [],
  searchResults: []
});

// Example 1: Show only one view at a time
renderer.showOnly(
  () => appState.value.view,
  {
    'home': '#homeView',
    'profile': '#profileView',
    'settings': '#settingsView',
    'admin': '#adminView'
  }
);

// Example 2: Toggle loading spinner
renderer.toggle(
  () => appState.value.isLoading,
  '#loadingSpinner',
  '#mainContent'
);

// Example 3: Show notifications only when they exist
renderer.whenHasItems(
  () => appState.value.notifications,
  '#notificationsList',
  '#noNotifications'
);

// Example 4: Show admin panel only for admins
renderer.showWhen(
  () => appState.value.user?.role === 'admin',
  '#adminPanel'
);

// Example 5: Hide login button when authenticated
renderer.hideWhen(
  () => appState.value.user !== null,
  '#loginButton'
);

// Example 6: Show search results
renderer.whenHasItems(
  () => appState.value.searchResults,
  '#searchResults',
  '#noResults'
);
```

---

## Complete Application Example: Task Manager

```javascript
// ============================================================================
// FULL TASK MANAGER APP WITH CONDITIONAL RENDERING
// ============================================================================

const taskApp = ReactiveUtils.state({
  tasks: [],
  filter: 'all', // 'all', 'active', 'completed'
  isLoading: false,
  error: null,
  selectedTask: null,
  showAddForm: false
});

// ============================================================================
// LOADING STATE
// ============================================================================

Conditions.whenState(
  () => taskApp.value.isLoading,
  {
    'true': { 
      style: { 
        display: 'flex',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '9999'
      },
      innerHTML: `
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      `
    },
    'false': { 
      style: { display: 'none' } 
    }
  },
  '#loadingOverlay'
);

// ============================================================================
// ERROR STATE
// ============================================================================

Conditions.whenState(
  () => taskApp.value.error,
  {
    'null': { style: { display: 'none' } },
    'truthy': { 
      style: { 
        display: 'block',
        padding: '1rem',
        backgroundColor: '#ffebee',
        borderLeft: '4px solid #f44336',
        marginBottom: '1rem'
      },
      innerHTML: () => `
        <div class="error-message">
          <strong>Error:</strong> ${taskApp.value.error}
          <button onclick="dismissError()" style="float: right;">✕</button>
        </div>
      `
    }
  },
  '#errorBanner'
);

// ============================================================================
// ADD TASK FORM
// ============================================================================

Conditions.whenState(
  () => taskApp.value.showAddForm,
  {
    'true': { 
      style: { 
        display: 'block',
        animation: 'slideDown 0.3s ease'
      },
      innerHTML: `
        <form id="addTaskForm" onsubmit="handleAddTask(event)">
          <input type="text" id="taskTitle" placeholder="Task title" required>
          <textarea id="taskDescription" placeholder="Description"></textarea>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Add Task</button>
            <button type="button" onclick="cancelAddTask()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      `
    },
    'false': { 
      style: { display: 'none' } 
    }
  },
  '#addTaskForm'
);

// Toggle "Add Task" button text
Conditions.whenState(
  () => taskApp.value.showAddForm,
  {
    'true': { 
      style: { display: 'none' }
    },
    'false': { 
      style: { display: 'inline-block' },
      textContent: '+ Add Task',
      onclick: () => {
        taskApp.value = { ...taskApp.value, showAddForm: true };
      }
    }
  },
  '#addTaskButton'
);

// ============================================================================
// TASK LIST FILTERING
// ============================================================================

function getFilteredTasks() {
  const { tasks, filter } = taskApp.value;
  
  switch (filter) {
    case 'active':
      return tasks.filter(t => !t.completed);
    case 'completed':
      return tasks.filter(t => t.completed);
    default:
      return tasks;
  }
}

// Show task list when tasks exist
Conditions.whenState(
  () => getFilteredTasks().length,
  {
    '>0': { 
      style: { display: 'block' },
      innerHTML: () => {
        const filteredTasks = getFilteredTasks();
        return `
          <div class="task-list">
            ${filteredTasks.map(task => `
              <div class="task-item ${task.completed ? 'completed' : ''}" 
                   data-task-id="${task.id}">
                <input 
                  type="checkbox" 
                  ${task.completed ? 'checked' : ''}
                  onchange="toggleTask('${task.id}')"
                >
                <div class="task-content" onclick="selectTask('${task.id}')">
                  <h4>${task.title}</h4>
                  ${task.description ? `<p>${task.description}</p>` : ''}
                  <small>${new Date(task.createdAt).toLocaleDateString()}</small>
                </div>
                <button class="btn-delete" onclick="deleteTask('${task.id}')">
                  🗑️
                </button>
              </div>
            `).join('')}
          </div>
        `;
      }
    },
    '0': { 
      style: { display: 'none' } 
    }
  },
  '#taskList'
);

// Show empty state when no tasks
Conditions.whenState(
  () => getFilteredTasks().length,
  {
    '0': { 
      style: { 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        textAlign: 'center'
      },
      innerHTML: () => {
        const { filter, tasks } = taskApp.value;
        
        if (tasks.length === 0) {
          return `
            <div class="empty-state">
              <img src="/empty-tasks.svg" alt="No tasks" style="max-width: 200px;">
              <h3>No tasks yet</h3>
              <p>Create your first task to get started!</p>
              <button onclick="showAddForm()" class="btn-primary">
                + Add Your First Task
              </button>
            </div>
          `;
        } else {
          // Has tasks but none match filter
          return `
            <div class="empty-state">
              <h3>No ${filter} tasks</h3>
              <p>Try changing the filter or add a new task</p>
            </div>
          `;
        }
      }
    },
    '>0': { 
      style: { display: 'none' } 
    }
  },
  '#emptyState'
);

// ============================================================================
// TASK FILTERS
// ============================================================================

// "All" filter button
Conditions.whenState(
  () => taskApp.value.filter,
  {
    'all': { 
      classList: { add: 'active' },
      style: { fontWeight: 'bold' }
    },
    'default': { 
      classList: { remove: 'active' },
      style: { fontWeight: 'normal' }
    }
  },
  '#filterAll'
);

// "Active" filter button
Conditions.whenState(
  () => taskApp.value.filter,
  {
    'active': { 
      classList: { add: 'active' },
      style: { fontWeight: 'bold' }
    },
    'default': { 
      classList: { remove: 'active' },
      style: { fontWeight: 'normal' }
    }
  },
  '#filterActive'
);

// "Completed" filter button
Conditions.whenState(
  () => taskApp.value.filter,
  {
    'completed': { 
      classList: { add: 'active' },
      style: { fontWeight: 'bold' }
    },
    'default': { 
      classList: { remove: 'active' },
      style: { fontWeight: 'normal' }
    }
  },
  '#filterCompleted'
);

// ============================================================================
// TASK STATISTICS
// ============================================================================

// Show stats bar when tasks exist
Conditions.whenState(
  () => taskApp.value.tasks.length,
  {
    '>0': { 
      style: { display: 'flex' },
      innerHTML: () => {
        const { tasks } = taskApp.value;
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const active = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return `
          <div class="stats-bar">
            <div class="stat">
              <span class="stat-value">${total}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat">
              <span class="stat-value">${active}</span>
              <span class="stat-label">Active</span>
            </div>
            <div class="stat">
              <span class="stat-value">${completed}</span>
              <span class="stat-label">Completed</span>
            </div>
            <div class="stat">
              <span class="stat-value">${completionRate}%</span>
              <span class="stat-label">Progress</span>
            </div>
          </div>
        `;
      }
    },
    '0': { 
      style: { display: 'none' } 
    }
  },
  '#taskStats'
);

// ============================================================================
// TASK DETAIL PANEL (SIDEBAR)
// ============================================================================

Conditions.whenState(
  () => taskApp.value.selectedTask,
  {
    'null': { 
      style: { 
        display: 'none',
        transform: 'translateX(100%)'
      } 
    },
    'truthy': { 
      style: { 
        display: 'block',
        transform: 'translateX(0)',
        transition: 'transform 0.3s ease'
      },
      innerHTML: () => {
        const task = taskApp.value.selectedTask;
        return `
          <div class="task-detail">
            <div class="detail-header">
              <h3>${task.title}</h3>
              <button onclick="closeTaskDetail()">✕</button>
            </div>
            <div class="detail-content">
              <div class="detail-status">
                <label>
                  <input 
                    type="checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask('${task.id}')"
                  >
                  ${task.completed ? 'Completed' : 'Mark as complete'}
                </label>
              </div>
              
              ${task.description ? `
                <div class="detail-section">
                  <h4>Description</h4>
                  <p>${task.description}</p>
                </div>
              ` : ''}
              
              <div class="detail-section">
                <h4>Created</h4>
                <p>${new Date(task.createdAt).toLocaleString()}</p>
              </div>
              
              ${task.completedAt ? `
                <div class="detail-section">
                  <h4>Completed</h4>
                  <p>${new Date(task.completedAt).toLocaleString()}</p>
                </div>
              ` : ''}
              
              <div class="detail-actions">
                <button onclick="editTask('${task.id}')" class="btn-secondary">
                  Edit Task
                </button>
                <button onclick="deleteTask('${task.id}')" class="btn-danger">
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        `;
      }
    }
  },
  '#taskDetailPanel'
);

// Show overlay when task detail is open
Conditions.whenState(
  () => taskApp.value.selectedTask,
  {
    'null': { 
      style: { display: 'none' } 
    },
    'truthy': { 
      style: { 
        display: 'block',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: '998'
      },
      onclick: () => closeTaskDetail()
    }
  },
  '#taskDetailOverlay'
);

// ============================================================================
// BULK ACTIONS (Show when multiple tasks selected)
// ============================================================================

const selectedTaskIds = ReactiveUtils.state([]);

Conditions.whenState(
  () => selectedTaskIds.value.length,
  {
    '0': { 
      style: { display: 'none' } 
    },
    '>0': { 
      style: { 
        display: 'flex',
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#333',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        gap: '1rem',
        alignItems: 'center',
        zIndex: '999',
        animation: 'slideUp 0.3s ease'
      },
      innerHTML: () => `
        <span>${selectedTaskIds.value.length} selected</span>
        <button onclick="bulkComplete()" class="btn-small">
          Mark Complete
        </button>
        <button onclick="bulkDelete()" class="btn-small btn-danger">
          Delete
        </button>
        <button onclick="clearSelection()" class="btn-small">
          Cancel
        </button>
      `
    }
  },
  '#bulkActionsBar'
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function showAddForm() {
  taskApp.value = { ...taskApp.value, showAddForm: true };
}

function cancelAddTask() {
  taskApp.value = { ...taskApp.value, showAddForm: false };
}

function handleAddTask(event) {
  event.preventDefault();
  
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  
  const newTask = {
    id: Date.now().toString(),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  taskApp.value = {
    ...taskApp.value,
    tasks: [...taskApp.value.tasks, newTask],
    showAddForm: false
  };
  
  event.target.reset();
}

function toggleTask(taskId) {
  taskApp.value = {
    ...taskApp.value,
    tasks: taskApp.value.tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : null
          }
        : task
    ),
    selectedTask: taskApp.value.selectedTask?.id === taskId
      ? { ...taskApp.value.selectedTask, completed: !taskApp.value.selectedTask.completed }
      : taskApp.value.selectedTask
  };
}

function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    taskApp.value = {
      ...taskApp.value,
      tasks: taskApp.value.tasks.filter(t => t.id !== taskId),
      selectedTask: taskApp.value.selectedTask?.id === taskId ? null : taskApp.value.selectedTask
    };
  }
}

function selectTask(taskId) {
  const task = taskApp.value.tasks.find(t => t.id === taskId);
  taskApp.value = { ...taskApp.value, selectedTask: task };
}

function closeTaskDetail() {
  taskApp.value = { ...taskApp.value, selectedTask: null };
}

function setFilter(filter) {
  taskApp.value = { ...taskApp.value, filter };
}

function dismissError() {
  taskApp.value = { ...taskApp.value, error: null };
}

// ============================================================================
// INITIALIZE APP
// ============================================================================

console.log('Task Manager App initialized with conditional rendering');
console.log('All UI elements respond to state changes automatically');
```

---

## Summary: Conditional Rendering Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Simple Toggle** | Show/hide based on boolean | Login form vs Dashboard |
| **If/Else** | Two mutually exclusive states | Loading vs Content |
| **Switch/Case** | Multiple exclusive options | Tabs, Views, User Roles |
| **List Rendering** | Show content when array has items | Shopping cart, Search results |
| **Empty States** | Show message when no data | "No results found" |
| **Loading States** | Show spinner during async operations | API calls, File uploads |
| **Error States** | Display errors conditionally | Form validation, API errors |
| **Modal/Overlay** | Show dialogs on demand | Confirm dialogs, Image lightbox |
| **Wizard/Steps** | Multi-step forms | Checkout process, Onboarding |
| **Conditional Actions** | Show buttons based on state | Edit/Delete for owners only |

All these patterns work seamlessly with both `display: none/block` and `visibility: hidden/visible`! 🎉