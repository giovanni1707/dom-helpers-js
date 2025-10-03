// DOM Helpers Documentation - Main JavaScript

// ==================== DARK MODE ====================
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Get theme from localStorage or default to light
let currentTheme = localStorage.getItem('theme') || 'light';

// Function to set theme
function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleDarkIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleDarkIcon.classList.remove('hidden');
        themeToggleLightIcon.classList.add('hidden');
    }
}

// Initialize theme on page load
setTheme(currentTheme);

// Toggle theme on button click
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
}

// ==================== MOBILE MENU ====================
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// ==================== COPY TO CLIPBOARD ====================
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification();
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback for older browsers
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification();
    } catch (err) {
        console.error('Fallback: Failed to copy:', err);
    }
    
    document.body.removeChild(textArea);
}

// Show copy notification
function showCopyNotification() {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Copied to clipboard!</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add copy buttons to all code blocks
document.addEventListener('DOMContentLoaded', () => {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock) => {
        const pre = codeBlock.parentElement;
        
        // Don't add button if it already exists
        if (pre.querySelector('.copy-code-button')) {
            return;
        }
        
        // Create copy button
        const button = document.createElement('button');
        button.className = 'copy-code-button absolute top-2 right-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200';
        button.innerHTML = `
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Copy
        `;
        
        button.addEventListener('click', () => {
            const code = codeBlock.textContent;
            copyToClipboard(code);
            
            // Update button text
            button.innerHTML = `
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Copied!
            `;
            button.classList.add('bg-green-600');
            
            setTimeout(() => {
                button.innerHTML = `
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    Copy
                `;
                button.classList.remove('bg-green-600');
            }, 2000);
        });
        
        // Make pre relative and add group class
        pre.style.position = 'relative';
        pre.classList.add('group');
        
        pre.appendChild(button);
    });
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== ACTIVE NAVIGATION ====================
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Update active navigation on scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNavigation, 50);
});

// Update on page load
updateActiveNavigation();

// ==================== SEARCH FUNCTIONALITY ====================
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) return;
    
    let searchIndex = [];
    let searchTimeout;
    
    // Build search index from page content
    function buildSearchIndex() {
        const sections = document.querySelectorAll('section, article');
        
        sections.forEach(section => {
            const title = section.querySelector('h1, h2, h3')?.textContent || '';
            const content = section.textContent || '';
            const id = section.id || '';
            
            if (title || content) {
                searchIndex.push({
                    title,
                    content: content.substring(0, 200),
                    id,
                    element: section
                });
            }
        });
    }
    
    // Perform search
    function performSearch(query) {
        if (!query || query.length < 2) {
            if (searchResults) {
                searchResults.classList.add('hidden');
            }
            return;
        }
        
        const results = searchIndex.filter(item => {
            return item.title.toLowerCase().includes(query.toLowerCase()) ||
                   item.content.toLowerCase().includes(query.toLowerCase());
        });
        
        displaySearchResults(results);
    }
    
    // Display search results
    function displaySearchResults(results) {
        if (!searchResults) return;
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="p-4 text-gray-500">No results found</div>';
            searchResults.classList.remove('hidden');
            return;
        }
        
        const resultsHTML = results.slice(0, 5).map(result => `
            <a href="#${result.id}" class="block p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <h4 class="font-semibold text-gray-900 dark:text-white">${result.title}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${result.content.substring(0, 100)}...</p>
            </a>
        `).join('');
        
        searchResults.innerHTML = resultsHTML;
        searchResults.classList.remove('hidden');
    }
    
    // Initialize search
    buildSearchIndex();
    
    // Search on input
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && searchResults && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });
}

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSearch);
} else {
    initializeSearch();
}

// ==================== CODE PLAYGROUND ====================
function createCodePlayground(elementId, code) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '400px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '0.5rem';
    
    container.appendChild(iframe);
    
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: system-ui, -apple-system, sans-serif;
                    padding: 20px;
                    margin: 0;
                }
            </style>
            <script src="https://cdn.jsdelivr.net/npm/@giovanni1707/dom-helpers@1.0.0/dist/dom-helpers.min.js"><\/script>
        </head>
        <body>
            ${code}
        </body>
        </html>
    `);
    doc.close();
}

// ==================== SCROLL TO TOP ====================
const scrollToTopBtn = document.getElementById('scroll-to-top');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.remove('hidden');
        } else {
            scrollToTopBtn.classList.add('hidden');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== EXPORT FUNCTIONS ====================
// Make functions available globally if needed
window.copyToClipboard = copyToClipboard;
window.createCodePlayground = createCodePlayground;

// ==================== ANALYTICS (Optional) ====================
// Add your analytics code here if needed
// Example: Google Analytics, Plausible, etc.
