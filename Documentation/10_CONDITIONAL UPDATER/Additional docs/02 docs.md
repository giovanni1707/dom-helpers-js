# Conditions Default Branch Extension - Complete Documentation

## Overview

The **Conditions Default Branch Extension** adds explicit `default` fallback support to the Conditions module. This extension wraps the original methods non-invasively, preserving all existing functionality while adding the ability to specify a default configuration that applies when no other condition matches.

---

## Installation & Setup

```javascript
<!-- Load in this order -->
<script src="conditions.js"></script>
<script src="conditions-default.js"></script>
```

**Requirements:**
- Conditions.js v4.0.0 or higher
- No breaking changes to existing code
- Fully backward compatible

---

## Core Concept: The `default` Branch

### What is the Default Branch?

The `default` branch is a special key in your conditions object that acts as a fallback. If no other condition matches the current value, the default configuration is applied automatically.

### Before vs After

**Without Extension (Manual Fallback):**
```javascript
Conditions.whenState(
  () => status.value,
  {
    'active': { classList: { add: 'status-active' } },
    'pending': { classList: { add: 'status-pending' } },
    'error': { classList: { add: 'status-error' } },
    // No fallback - if status is 'unknown', nothing happens
  },
  '#statusBadge'
);
```

**With Extension (Automatic Fallback):**
```javascript
Conditions.whenState(
  () => status.value,
  {
    'active': { classList: { add: 'status-active' } },
    'pending': { classList: { add: 'status-pending' } },
    'error': { classList: { add: 'status-error' } },
    'default': { 
      classList: { add: 'status-unknown' },
      textContent: 'Unknown Status'
    }
  },
  '#statusBadge'
);
```

---

## Enhanced Methods

All three primary methods now support the `default` branch:

### 1. `Conditions.whenState()` (Enhanced)

**What Changed:**
Now accepts a `default` key in the conditions object that will be applied when no other condition matches.

**Signature:**
```javascript
Conditions.whenState(valueFn, conditions, selector, options)
```

**Beginner Example:**

```javascript
const userRole = ReactiveUtils.state('guest');

Conditions.whenState(
  () => userRole.value,
  {
    'admin': { 
      textContent: '👑 Administrator',
      style: { backgroundColor: '#gold' }
    },
    'moderator': { 
      textContent: '🛡️ Moderator',
      style: { backgroundColor: '#silver' }
    },
    'user': { 
      textContent: '👤 User',
      style: { backgroundColor: '#lightblue' }
    },
    'default': { 
      textContent: '🔓 Guest',
      style: { backgroundColor: '#lightgray' }
    }
  },
  '#roleBadge'
);

// If userRole becomes 'premium' (not explicitly defined),
// the default branch applies
userRole.value = 'premium'; // Shows "🔓 Guest" with gray background
```

**Advanced Real-World Example:**

```javascript
// API Response Handler with Default Error State
const apiResponse = ReactiveUtils.state({
  status: null,
  code: null,
  message: ''
});

Conditions.whenState(
  () => apiResponse.value.code,
  {
    '200': {
      innerHTML: `
        <div class="alert alert-success">
          <span class="icon">✓</span>
          <span>${apiResponse.value.message || 'Success!'}</span>
        </div>
      `,
      classList: { remove: 'loading' }
    },
    '201': {
      innerHTML: `
        <div class="alert alert-success">
          <span class="icon">🎉</span>
          <span>Created successfully!</span>
        </div>
      `
    },
    '400': {
      innerHTML: `
        <div class="alert alert-warning">
          <span class="icon">⚠️</span>
          <span>Bad Request: ${apiResponse.value.message}</span>
        </div>
      `
    },
    '401': {
      innerHTML: `
        <div class="alert alert-danger">
          <span class="icon">🔒</span>
          <span>Unauthorized - Please login</span>
        </div>
      `,
      addEventListener: {
        click: () => redirectToLogin()
      }
    },
    '404': {
      innerHTML: `
        <div class="alert alert-info">
          <span class="icon">🔍</span>
          <span>Resource not found</span>
        </div>
      `
    },
    '500': {
      innerHTML: `
        <div class="alert alert-danger">
          <span class="icon">💥</span>
          <span>Server Error: ${apiResponse.value.message}</span>
        </div>
      `
    },
    'null': {
      innerHTML: '<div class="loading">Loading...</div>',
      classList: { add: 'loading' }
    },
    // Default catches all other status codes (429, 503, etc.)
    'default': {
      innerHTML: `
        <div class="alert alert-danger">
          <span class="icon">❌</span>
          <span>Error ${apiResponse.value.code}: ${apiResponse.value.message}</span>
          <button onclick="retryRequest()">Retry</button>
        </div>
      `,
      dataset: { 
        errorCode: String(apiResponse.value.code),
        canRetry: 'true'
      }
    }
  },
  '#apiResponseMessage'
);

// Usage
async function fetchData() {
  apiResponse.value = { status: null, code: null, message: '' };
  
  try {
    const response = await fetch('/api/data');
    apiResponse.value = {
      status: response.statusText,
      code: response.status,
      message: await response.text()
    };
  } catch (error) {
    // Network error - triggers default
    apiResponse.value = {
      status: 'error',
      code: 0,
      message: error.message
    };
  }
}
```

---

### 2. `Conditions.apply()` (Enhanced)

**What Changed:**
Now supports `default` branch for one-time application with fallback.

**Signature:**
```javascript
Conditions.apply(value, conditions, selector)
```

**Beginner Example:**

```javascript
// Initialize page theme from user preference
const savedTheme = localStorage.getItem('theme') || 'custom-dark';

Conditions.apply(
  savedTheme,
  {
    'light': { 
      classList: ['theme-light'],
      dataset: { theme: 'light' }
    },
    'dark': { 
      classList: ['theme-dark'],
      dataset: { theme: 'dark' }
    },
    'high-contrast': { 
      classList: ['theme-high-contrast'],
      dataset: { theme: 'high-contrast' }
    },
    // If savedTheme is anything else, use default
    'default': { 
      classList: ['theme-light'],
      dataset: { theme: 'default' },
      style: { 
        '--warning': 'orange' // Custom fallback styling
      }
    }
  },
  'body'
);
```

**Advanced Real-World Example:**

```javascript
// Multi-environment Configuration System
const environment = process.env.NODE_ENV || 'unknown';
const buildConfig = {
  env: environment,
  apiUrl: process.env.API_URL,
  features: JSON.parse(process.env.FEATURES || '{}')
};

// Apply environment-specific UI configurations
Conditions.apply(
  buildConfig.env,
  {
    'development': {
      innerHTML: `
        <div class="env-banner dev">
          <strong>🔧 DEV MODE</strong>
          <span>API: ${buildConfig.apiUrl}</span>
          <span>Hot Reload: Active</span>
        </div>
      `,
      style: {
        backgroundColor: '#ffc107',
        color: '#000',
        padding: '8px',
        position: 'fixed',
        bottom: '0',
        width: '100%',
        zIndex: '9999'
      },
      dataset: {
        env: 'development',
        debugMode: 'true'
      }
    },
    'staging': {
      innerHTML: `
        <div class="env-banner staging">
          <strong>🚧 STAGING</strong>
          <span>Testing Environment</span>
        </div>
      `,
      style: {
        backgroundColor: '#ff9800',
        color: '#fff',
        padding: '4px',
        textAlign: 'center'
      },
      dataset: {
        env: 'staging',
        debugMode: 'true'
      }
    },
    'production': {
      style: { display: 'none' },
      dataset: {
        env: 'production',
        debugMode: 'false'
      }
    },
    // Default handles test, qa, local, or any custom env
    'default': {
      innerHTML: `
        <div class="env-banner unknown">
          <strong>⚠️ UNKNOWN ENVIRONMENT: ${buildConfig.env}</strong>
          <span>Please configure environment properly</span>
        </div>
      `,
      style: {
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '8px',
        textAlign: 'center',
        fontWeight: 'bold'
      },
      dataset: {
        env: buildConfig.env,
        debugMode: 'true',
        configWarning: 'true'
      }
    }
  },
  '#environmentBanner'
);

// Apply feature flags based on environment
Conditions.apply(
  buildConfig.env,
  {
    'development': {
      dataset: {
        featureFlags: JSON.stringify({
          analytics: false,
          debugging: true,
          mockData: true,
          ...buildConfig.features
        })
      }
    },
    'staging': {
      dataset: {
        featureFlags: JSON.stringify({
          analytics: true,
          debugging: true,
          mockData: false,
          ...buildConfig.features
        })
      }
    },
    'production': {
      dataset: {
        featureFlags: JSON.stringify({
          analytics: true,
          debugging: false,
          mockData: false,
          ...buildConfig.features
        })
      }
    },
    'default': {
      dataset: {
        featureFlags: JSON.stringify({
          analytics: false,
          debugging: true,
          mockData: true,
          safeMode: true
        })
      }
    }
  },
  'body'
);
```

---

### 3. `Conditions.watch()` (Enhanced)

**What Changed:**
Explicitly reactive mode now supports `default` branch.

**Signature:**
```javascript
Conditions.watch(valueFn, conditions, selector)
```

**Beginner Example:**

```javascript
const networkStatus = ReactiveUtils.state('online');

Conditions.watch(
  () => networkStatus.value,
  {
    'online': { 
      style: { display: 'none' }
    },
    'offline': { 
      innerHTML: '📡 No internet connection',
      style: { 
        display: 'block',
        backgroundColor: '#f44',
        color: 'white',
        padding: '10px',
        textAlign: 'center'
      }
    },
    'slow': { 
      innerHTML: '🐌 Slow connection detected',
      style: { 
        display: 'block',
        backgroundColor: '#ff9800',
        color: 'white',
        padding: '10px',
        textAlign: 'center'
      }
    },
    // Default handles any other status (e.g., 'connecting', 'unstable')
    'default': { 
      innerHTML: () => `⚠️ Connection status: ${networkStatus.value}`,
      style: { 
        display: 'block',
        backgroundColor: '#ccc',
        padding: '10px',
        textAlign: 'center'
      }
    }
  },
  '#connectionBanner'
);

// Simulate network changes
window.addEventListener('online', () => networkStatus.value = 'online');
window.addEventListener('offline', () => networkStatus.value = 'offline');
```

**Advanced Real-World Example:**

```javascript
// Real-time Collaborative Editing Status
const collaborators = ReactiveUtils.state([]);
const currentUserStatus = ReactiveUtils.state('active');

// Watch collaborator presence and show appropriate UI
Conditions.watch(
  () => collaborators.value.length,
  {
    '0': {
      innerHTML: `
        <div class="collab-status solo">
          <span class="icon">👤</span>
          <span>You're editing alone</span>
        </div>
      `,
      classList: { add: 'solo-mode' },
      style: { borderLeft: '3px solid #999' }
    },
    '1': {
      innerHTML: () => `
        <div class="collab-status duo">
          <span class="icon">👥</span>
          <span>Editing with ${collaborators.value[0].name}</span>
          <span class="status-indicator ${collaborators.value[0].status}"></span>
        </div>
      `,
      classList: { add: 'duo-mode' },
      style: { borderLeft: '3px solid #4caf50' }
    },
    '2-5': {
      innerHTML: () => `
        <div class="collab-status group">
          <span class="icon">👥</span>
          <span>${collaborators.value.length} people editing</span>
          <div class="avatars">
            ${collaborators.value.map(c => `
              <img src="${c.avatar}" alt="${c.name}" title="${c.name}" />
            `).join('')}
          </div>
        </div>
      `,
      classList: { add: 'group-mode' },
      style: { borderLeft: '3px solid #2196f3' }
    },
    '>5': {
      innerHTML: () => `
        <div class="collab-status crowded">
          <span class="icon">👥</span>
          <span>${collaborators.value.length} editors (busy!)</span>
          <button onclick="showAllCollaborators()">View All</button>
        </div>
      `,
      classList: { add: 'crowded-mode' },
      style: { 
        borderLeft: '3px solid #ff9800',
        backgroundColor: '#fff3e0'
      },
      addEventListener: {
        mouseenter: () => showCollaboratorsList(),
        mouseleave: () => hideCollaboratorsList()
      }
    },
    // Default handles unexpected states (negative numbers, NaN, etc.)
    'default': {
      innerHTML: `
        <div class="collab-status error">
          <span class="icon">⚠️</span>
          <span>Sync issues - Reconnecting...</span>
        </div>
      `,
      classList: { add: 'sync-error' },
      style: { 
        borderLeft: '3px solid #f44',
        backgroundColor: '#ffebee'
      }
    }
  },
  '#collaborationStatus'
);

// Watch user's own status
Conditions.watch(
  () => currentUserStatus.value,
  {
    'active': {
      dataset: { userStatus: 'active' },
      style: { filter: 'none', opacity: '1' }
    },
    'idle': {
      dataset: { userStatus: 'idle' },
      style: { filter: 'grayscale(30%)', opacity: '0.9' }
    },
    'away': {
      dataset: { userStatus: 'away' },
      style: { filter: 'grayscale(50%)', opacity: '0.7' }
    },
    // Default handles custom statuses like 'presenting', 'in-meeting', etc.
    'default': {
      dataset: { 
        userStatus: currentUserStatus.value,
        customStatus: 'true'
      },
      innerHTML: () => `
        <div class="custom-status-indicator">
          ${currentUserStatus.value}
        </div>
      `,
      style: { 
        filter: 'hue-rotate(45deg)',
        opacity: '0.85'
      }
    }
  },
  '.user-presence-indicator'
);
```

---

## Utility Methods

### 4. `Conditions.restoreOriginal()`

**What it does:**
Removes the default branch extension and restores the original Conditions methods. Useful for debugging or if you need to disable the feature temporarily.

**Purpose & Use Cases:**
- Debug issues with default branch behavior
- Temporarily disable the extension
- A/B testing with/without defaults
- Troubleshooting conflicts

**Parameters:** None

**Return Value:** Undefined (logs confirmation message)

**Beginner Example:**

```javascript
// Extension is active
Conditions.whenState(
  () => value.value,
  {
    'a': { textContent: 'A' },
    'default': { textContent: 'Unknown' }
  },
  '#element'
);

// Disable extension
Conditions.restoreOriginal();

// Now default branch is treated as a literal condition
// (will only match if value equals the string "default")
```

**Advanced Real-World Example:**

```javascript
// Feature Flag System with Extension Toggle
class FeatureFlagManager {
  constructor() {
    this.features = {
      useDefaultBranch: true,
      experimentalMatchers: false,
      debugMode: false
    };
    
    this.originalMethodsRestored = false;
  }
  
  toggleFeature(featureName, enabled) {
    this.features[featureName] = enabled;
    
    if (featureName === 'useDefaultBranch') {
      if (enabled && this.originalMethodsRestored) {
        console.warn('Cannot re-enable default branch - reload page');
      } else if (!enabled && !this.originalMethodsRestored) {
        Conditions.restoreOriginal();
        this.originalMethodsRestored = true;
        console.log('Default branch extension disabled');
      }
    }
  }
  
  getStatus() {
    return {
      ...this.features,
      extensionActive: !this.originalMethodsRestored,
      version: Conditions.extensions?.defaultBranch || 'N/A'
    };
  }
}

// Debug panel
const featureFlags = new FeatureFlagManager();

document.getElementById('toggleDefaultBranch')?.addEventListener('click', () => {
  const currentState = featureFlags.features.useDefaultBranch;
  featureFlags.toggleFeature('useDefaultBranch', !currentState);
  
  console.log('Feature Status:', featureFlags.getStatus());
});
```

---

## Complete Real-World Application

Here's a comprehensive example showing the default branch in action:

```javascript
// ============================================================================
// CONTENT MANAGEMENT SYSTEM - DYNAMIC CONTENT STATE HANDLING
// ============================================================================

const content = ReactiveUtils.state({
  status: 'draft',
  type: 'article',
  publishDate: null,
  author: null
});

const permissions = ReactiveUtils.state({
  role: 'editor',
  canPublish: false,
  canDelete: false
});

// ============================================================================
// CONTENT STATUS BADGE WITH DEFAULT
// ============================================================================

Conditions.whenState(
  () => content.value.status,
  {
    'published': {
      innerHTML: '<span class="badge badge-success">✓ Published</span>',
      style: {
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold'
      }
    },
    'draft': {
      innerHTML: '<span class="badge badge-secondary">📝 Draft</span>',
      style: {
        backgroundColor: '#9e9e9e',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px'
      }
    },
    'pending': {
      innerHTML: '<span class="badge badge-warning">⏳ Pending Review</span>',
      style: {
        backgroundColor: '#ff9800',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px'
      }
    },
    'archived': {
      innerHTML: '<span class="badge badge-info">📦 Archived</span>',
      style: {
        backgroundColor: '#2196f3',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px'
      }
    },
    // Default handles custom statuses: 'scheduled', 'reviewing', 'rejected', etc.
    'default': {
      innerHTML: () => `<span class="badge badge-custom">⚡ ${content.value.status}</span>`,
      style: {
        backgroundColor: '#673ab7',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        textTransform: 'capitalize'
      },
      dataset: {
        customStatus: 'true',
        statusType: content.value.status
      }
    }
  },
  '#contentStatusBadge'
);

// ============================================================================
// ACTION BUTTONS BASED ON ROLE WITH DEFAULT
// ============================================================================

Conditions.whenState(
  () => permissions.value.role,
  {
    'admin': {
      innerHTML: `
        <button class="btn-publish">Publish</button>
        <button class="btn-edit">Edit</button>
        <button class="btn-delete">Delete</button>
        <button class="btn-settings">Settings</button>
      `,
      dataset: { 
        permissionLevel: 'full',
        canOverride: 'true'
      }
    },
    'editor': {
      innerHTML: `
        <button class="btn-publish" ${!permissions.value.canPublish ? 'disabled' : ''}>
          Publish
        </button>
        <button class="btn-edit">Edit</button>
        <button class="btn-archive">Archive</button>
      `,
      dataset: { permissionLevel: 'edit' }
    },
    'contributor': {
      innerHTML: `
        <button class="btn-edit">Edit My Content</button>
        <button class="btn-submit">Submit for Review</button>
      `,
      dataset: { permissionLevel: 'contribute' }
    },
    'reviewer': {
      innerHTML: `
        <button class="btn-approve">Approve</button>
        <button class="btn-reject">Request Changes</button>
        <button class="btn-comment">Add Comment</button>
      `,
      dataset: { permissionLevel: 'review' }
    },
    // Default handles custom roles: 'guest-editor', 'moderator', 'auditor', etc.
    'default': {
      innerHTML: `
        <button class="btn-view">View Only</button>
        <div class="role-notice">
          Limited permissions for role: <strong>${permissions.value.role}</strong>
        </div>
      `,
      dataset: { 
        permissionLevel: 'limited',
        customRole: 'true',
        roleType: permissions.value.role
      },
      style: {
        opacity: '0.7',
        pointerEvents: 'limited'
      }
    }
  },
  '#actionButtons'
);

// ============================================================================
// CONTENT TYPE ICON WITH DEFAULT
// ============================================================================

Conditions.whenState(
  () => content.value.type,
  {
    'article': { textContent: '📄', title: 'Article' },
    'video': { textContent: '🎥', title: 'Video' },
    'image': { textContent: '🖼️', title: 'Image' },
    'audio': { textContent: '🎵', title: 'Audio' },
    'document': { textContent: '📃', title: 'Document' },
    'page': { textContent: '📋', title: 'Page' },
    // Default handles: 'gallery', 'portfolio', 'case-study', etc.
    'default': {
      textContent: '📦',
      title: () => `${content.value.type} (Custom Type)`,
      dataset: { contentType: content.value.type }
    }
  },
  '#contentTypeIcon'
);

// ============================================================================
// WORKFLOW STATE MACHINE WITH DEFAULT
// ============================================================================

const workflow = ReactiveUtils.state({
  stage: 'initial',
  progress: 0,
  canAdvance: true
});

Conditions.whenState(
  () => workflow.value.stage,
  {
    'initial': {
      innerHTML: `
        <div class="workflow-step active">
          <h3>1. Create Content</h3>
          <p>Start writing your content</p>
          <button onclick="advanceWorkflow('drafting')">Begin</button>
        </div>
      `,
      classList: { add: 'step-initial' }
    },
    'drafting': {
      innerHTML: `
        <div class="workflow-step active">
          <h3>2. Drafting</h3>
          <p>Write and edit your content</p>
          <progress value="${workflow.value.progress}" max="100"></progress>
          <button onclick="advanceWorkflow('review')">Submit for Review</button>
        </div>
      `,
      classList: { add: 'step-drafting' }
    },
    'review': {
      innerHTML: `
        <div class="workflow-step active">
          <h3>3. Under Review</h3>
          <p>Waiting for approval</p>
          <button onclick="advanceWorkflow('approved')">Approve</button>
          <button onclick="advanceWorkflow('drafting')">Request Changes</button>
        </div>
      `,
      classList: { add: 'step-review' }
    },
    'approved': {
      innerHTML: `
        <div class="workflow-step active">
          <h3>4. Approved</h3>
          <p>Ready to publish</p>
          <button onclick="advanceWorkflow('published')">Publish Now</button>
          <button onclick="advanceWorkflow('scheduled')">Schedule</button>
        </div>
      `,
      classList: { add: 'step-approved' }
    },
    'published': {
      innerHTML: `
        <div class="workflow-step complete">
          <h3>✓ Published</h3>
          <p>Content is live</p>
          <button onclick="viewPublished()">View Live</button>
        </div>
      `,
      classList: { add: 'step-complete' }
    },
    // Default handles custom workflow stages
    'default': {
      innerHTML: () => `
        <div class="workflow-step custom">
          <h3>Custom Stage: ${workflow.value.stage}</h3>
          <p>This is a custom workflow stage</p>
          <div class="stage-actions">
            <button onclick="configureCustomStage()">Configure</button>
            <button onclick="resetWorkflow()">Reset Workflow</button>
          </div>
        </div>
      `,
      classList: { add: 'step-custom' },
      dataset: { 
        customStage: 'true',
        stageName: workflow.value.stage
      },
      style: {
        borderLeft: '4px solid #9c27b0',
        backgroundColor: '#f3e5f5'
      }
    }
  },
  '#workflowContainer'
);

// ============================================================================
// VALIDATION MESSAGES WITH DEFAULT
// ============================================================================

const validation = ReactiveUtils.state({
  field: 'title',
  error: null
});

Conditions.whenState(
  () => validation.value.error,
  {
    'required': {
      textContent: 'This field is required',
      classList: { add: 'error-required' }
    },
    'too-short': {
      textContent: 'Must be at least 3 characters',
      classList: { add: 'error-length' }
    },
    'invalid-format': {
      textContent: 'Invalid format',
      classList: { add: 'error-format' }
    },
    'null': {
      style: { display: 'none' }
    },
    // Default handles any custom validation error codes
    'default': {
      textContent: () => `Validation error: ${validation.value.error}`,
      classList: { add: 'error-generic' },
      dataset: { errorCode: validation.value.error }
    }
  },
  `#${validation.value.field}Error`
);

console.log('CMS with Default Branch support initialized');
console.log('Extension version:', Conditions.extensions.defaultBranch);
```

---

## Benefits & Best Practices

### ✅ Benefits

1. **Graceful Degradation**: Handle unexpected values without breaking
2. **Cleaner Code**: Eliminate manual fallback logic
3. **Better UX**: Always show something meaningful to users
4. **Maintainable**: Add new conditions without worrying about edge cases
5. **Non-Invasive**: No breaking changes to existing code

### 📋 Best Practices

1. **Always provide a default** for user-input or dynamic data
2. **Use specific conditions first**, then default as catch-all
3. **Keep defaults generic** but helpful
4. **Log unexpected values** in default branch for debugging
5. **Test edge cases** to ensure default triggers appropriately

### ⚠️ Common Pitfalls

```javascript
// ❌ BAD: Default too specific
{
  'active': { ... },
  'default': { textContent: 'Error!' } // Too negative
}

// ✅ GOOD: Default neutral and informative
{
  'active': { ... },
  'default': { 
    textContent: () => `Status: ${value}`,
    classList: { add: 'status-unknown' }
  }
}
```

---

## Version & Compatibility

- **Version**: 1.0.0
- **Requires**: Conditions.js v4.0.0+
- **Breaking Changes**: None
- **Restoration**: Use `Conditions.restoreOriginal()` if needed

**Check if loaded:**
```javascript
console.log(Conditions.extensions?.defaultBranch); // "1.0.0"
```

This extension seamlessly adds powerful default fallback support while maintaining 100% backward compatibility!