// Main Application Entry Point
// Coordinates all components and handles app initialization

class EmployeeManagementApp {
    constructor() {
        this.isInitialized = false;
        this.version = '1.0.0';
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Employee Management System v' + this.version);
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.startApp();
                });
            } else {
                this.startApp();
            }
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.showInitializationError(error);
        }
    }

    async startApp() {
        try {
            // Show loading state
            this.showLoadingState(true);

            // Verify required dependencies
            this.checkDependencies();

            // Initialize app components
            await this.initializeComponents();

            // Setup global error handling
            this.setupGlobalErrorHandling();

            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();

            // Setup service worker (for future PWA support)
            this.setupServiceWorker();

            // Hide loading state
            this.showLoadingState(false);

            // Mark as initialized
            this.isInitialized = true;

            console.log('✅ Employee Management System initialized successfully!');
            
            // Show welcome message for first-time users
            this.showWelcomeMessage();

        } catch (error) {
            console.error('❌ Error starting application:', error);
            this.showInitializationError(error);
        }
    }

    checkDependencies() {
        const requiredDependencies = [
            { name: 'Chart.js', check: () => typeof Chart !== 'undefined' },
            { name: 'API Service', check: () => typeof api !== 'undefined' },
            { name: 'UI Manager', check: () => typeof ui !== 'undefined' },
            { name: 'Charts Manager', check: () => typeof charts !== 'undefined' }
        ];

        const missingDependencies = requiredDependencies.filter(dep => !dep.check());
        
        if (missingDependencies.length > 0) {
            throw new Error(`Missing dependencies: ${missingDependencies.map(d => d.name).join(', ')}`);
        }

        console.log('✅ All dependencies loaded successfully');
    }

    async initializeComponents() {
        // Components are already initialized via their respective files
        // This method can be used for additional setup if needed
        
        // Verify API connectivity
        await this.testAPIConnection();
        
        // Load initial application state
        await this.loadApplicationState();

        console.log('✅ All components initialized');
    }

    async testAPIConnection() {
        try {
            // Test with a simple statistics call
            await api.getDepartmentStatistics();
            console.log('✅ API connection successful');
        } catch (error) {
            console.warn('⚠️ API connection test failed:', error.message);
            
            if (ui) {
                ui.showToast('Warning: Unable to connect to API. Some features may not work.', 'warning', 8000);
            }
        }
    }

    async loadApplicationState() {
        // Load user preferences from localStorage
        const preferences = this.loadUserPreferences();
        
        // Apply saved preferences
        this.applyUserPreferences(preferences);
        
        console.log('✅ Application state loaded');
    }

    loadUserPreferences() {
        try {
            const saved = localStorage.getItem('employeeApp_preferences');
            return saved ? JSON.parse(saved) : this.getDefaultPreferences();
        } catch (error) {
            console.warn('Warning: Could not load user preferences:', error);
            return this.getDefaultPreferences();
        }
    }

    getDefaultPreferences() {
        return {
            theme: 'light',
            pageSize: 10,
            defaultSort: 'firstName',
            autoRefresh: false,
            notifications: true
        };
    }

    applyUserPreferences(preferences) {
        // Theme is already handled by UI manager
        
        // Apply page size preference
        if (ui && preferences.pageSize) {
            ui.pageSize = preferences.pageSize;
        }
        
        // Apply default sort preference
        if (ui && preferences.defaultSort) {
            ui.currentSort.field = preferences.defaultSort;
        }
    }

    saveUserPreferences() {
        try {
            const preferences = {
                theme: document.documentElement.getAttribute('data-theme'),
                pageSize: ui?.pageSize || 10,
                defaultSort: ui?.currentSort?.field || 'firstName',
                autoRefresh: false,
                notifications: true
            };
            
            localStorage.setItem('employeeApp_preferences', JSON.stringify(preferences));
        } catch (error) {
            console.warn('Warning: Could not save user preferences:', error);
        }
    }

    setupGlobalErrorHandling() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            console.error('Uncaught error:', event.error);
            this.handleGlobalError(event.error);
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            
            // Don't show UI errors for API errors (already handled by API service)
            if (!(event.reason instanceof APIError)) {
                this.handleGlobalError(event.reason);
            }
        });

        console.log('✅ Global error handling setup complete');
    }

    handleGlobalError(error) {
        const message = error?.message || 'An unexpected error occurred';
        
        if (ui && ui.showToast) {
            ui.showToast(`Error: ${message}`, 'error');
        } else {
            alert(`Error: ${message}`);
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Don't trigger shortcuts when typing in form fields
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            const { ctrlKey, metaKey, shiftKey, key } = event;
            const cmdOrCtrl = ctrlKey || metaKey;

            // Ctrl/Cmd + N: Add new employee
            if (cmdOrCtrl && key === 'n' && !shiftKey) {
                event.preventDefault();
                if (ui) {
                    ui.showAddEmployeeModal();
                }
            }

            // Ctrl/Cmd + K: Focus search
            if (cmdOrCtrl && key === 'k') {
                event.preventDefault();
                const searchInput = document.getElementById('quickSearch');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Ctrl/Cmd + Shift + D: Go to dashboard
            if (cmdOrCtrl && shiftKey && key === 'D') {
                event.preventDefault();
                if (ui) {
                    ui.showSection('dashboard');
                }
            }

            // Ctrl/Cmd + Shift + E: Go to employees
            if (cmdOrCtrl && shiftKey && key === 'E') {
                event.preventDefault();
                if (ui) {
                    ui.showSection('employees');
                }
            }

            // Ctrl/Cmd + Shift + S: Go to search
            if (cmdOrCtrl && shiftKey && key === 'S') {
                event.preventDefault();
                if (ui) {
                    ui.showSection('search');
                }
            }

            // Ctrl/Cmd + Shift + R: Go to reports
            if (cmdOrCtrl && shiftKey && key === 'R') {
                event.preventDefault();
                if (ui) {
                    ui.showSection('reports');
                }
            }

            // Escape: Close modal or clear search
            if (key === 'Escape') {
                const modal = document.getElementById('employeeModal');
                if (modal && modal.classList.contains('show')) {
                    ui.hideModal();
                } else {
                    const searchInput = document.getElementById('quickSearch');
                    if (searchInput && searchInput.value) {
                        searchInput.value = '';
                        if (ui) {
                            ui.loadEmployees();
                        }
                    }
                }
            }

            // Ctrl/Cmd + /: Show keyboard shortcuts help
            if (cmdOrCtrl && key === '/') {
                event.preventDefault();
                this.showKeyboardShortcutsHelp();
            }
        });

        console.log('⌨️ Keyboard shortcuts setup complete');
    }

    showKeyboardShortcutsHelp() {
        const shortcuts = [
            'Ctrl/Cmd + N: Add new employee',
            'Ctrl/Cmd + K: Focus search',
            'Ctrl/Cmd + Shift + D: Go to Dashboard',
            'Ctrl/Cmd + Shift + E: Go to Employees',
            'Ctrl/Cmd + Shift + S: Go to Search',
            'Ctrl/Cmd + Shift + R: Go to Reports',
            'Escape: Close modal or clear search',
            'Ctrl/Cmd + /: Show this help'
        ];

        const message = shortcuts.join('\n');
        
        if (ui) {
            ui.showToast('Keyboard Shortcuts:\n' + message, 'info', 10000);
        } else {
            alert('Keyboard Shortcuts:\n' + message);
        }
    }

    setupServiceWorker() {
        // Register service worker for future PWA support
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }
    }

    showLoadingState(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('show', show);
        }
    }

    showInitializationError(error) {
        // Create error overlay if it doesn't exist
        let errorOverlay = document.getElementById('errorOverlay');
        
        if (!errorOverlay) {
            errorOverlay = document.createElement('div');
            errorOverlay.id = 'errorOverlay';
            errorOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                color: white;
                font-family: 'Inter', sans-serif;
            `;
            
            errorOverlay.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: #1e293b; border-radius: 12px; max-width: 500px; margin: 1rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f59e0b; margin-bottom: 1rem;"></i>
                    <h2 style="margin-bottom: 1rem;">Initialization Error</h2>
                    <p style="margin-bottom: 1rem; opacity: 0.8;">${error.message}</p>
                    <button onclick="location.reload()" style="background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">
                        Reload Application
                    </button>
                </div>
            `;
            
            document.body.appendChild(errorOverlay);
        }
    }

    showWelcomeMessage() {
        const hasSeenWelcome = localStorage.getItem('employeeApp_hasSeenWelcome');
        
        if (!hasSeenWelcome) {
            setTimeout(() => {
                if (ui) {
                    ui.showToast('Welcome to Employee Management System! Press Ctrl+/ to see keyboard shortcuts.', 'info', 8000);
                }
                localStorage.setItem('employeeApp_hasSeenWelcome', 'true');
            }, 2000);
        }
    }

    // Public API for external access
    getVersion() {
        return this.version;
    }

    isReady() {
        return this.isInitialized;
    }

    restart() {
        location.reload();
    }

    exportData() {
        if (api && ui) {
            api.getAllEmployees(0, 1000)
                .then(data => {
                    api.exportEmployeesToCSV(data.content);
                })
                .catch(error => {
                    ui.showToast('Error exporting data', 'error');
                    console.error('Export error:', error);
                });
        }
    }

    // Cleanup method
    cleanup() {
        // Save user preferences before cleanup
        this.saveUserPreferences();
        
        // Cleanup charts
        if (charts) {
            charts.destroyCharts();
        }
        
        // Clear API cache
        if (api) {
            api.clearCache();
        }
        
        console.log('🧹 Application cleanup complete');
    }
}

// Initialize the application
const app = new EmployeeManagementApp();

// Make app globally available
window.app = app;

// Save preferences on page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        app.cleanup();
    }
});

// Handle page visibility changes for potential optimizations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('📱 App went to background');
        // Could pause auto-refresh or other background tasks
    } else {
        console.log('📱 App came to foreground');
        // Could refresh data or resume tasks
    }
});

// Development helpers
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.app = app;
    
    console.log('🔧 Development mode detected');
    console.log('Available global objects:', { app, api, ui, charts });
    console.log('Try: app.getVersion(), app.exportData(), ui.showSection("dashboard")');
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmployeeManagementApp;
}
