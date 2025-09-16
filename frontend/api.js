// Employee Management API Service
// Handles all 17 API endpoints with comprehensive error handling and loading states

class EmployeeAPI {
    constructor() {
        this.baseURL = 'http://localhost:8081/api/employees';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        this.loading = false;
    }

    // Utility method for making API requests
    async makeRequest(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
        
        try {
            this.setLoading(true);
            
            const config = {
                headers: this.defaultHeaders,
                ...options
            };

            console.log(`Making ${config.method || 'GET'} request to: ${url}`);
            
            const response = await fetch(url, config);
            
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = { message: `HTTP Error ${response.status}: ${response.statusText}` };
                }
                
                throw new APIError(
                    errorData.message || `HTTP ${response.status}`,
                    response.status,
                    errorData
                );
            }

            // Handle empty responses (like DELETE operations)
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return null;
            }

            const data = await response.json();
            console.log('API Response:', data);
            return data;
            
        } catch (error) {
            console.error('API Error:', error);
            
            if (error instanceof APIError) {
                throw error;
            }
            
            // Network or other errors
            throw new APIError('Network error or server unavailable', 0, null);
        } finally {
            this.setLoading(false);
        }
    }

    // Loading state management
    setLoading(state) {
        this.loading = state;
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('show', state);
        }
    }

    // 1. CRUD Operations

    // Create Employee
    async createEmployee(employeeData) {
        return await this.makeRequest('', {
            method: 'POST',
            body: JSON.stringify(employeeData)
        });
    }

    // Get All Employees (Paginated)
    async getAllEmployees(page = 0, size = 10, sortBy = 'id', sortDir = 'asc') {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDir
        });
        
        return await this.makeRequest(`?${queryParams}`);
    }

    // Get Employee by ID
    async getEmployeeById(id) {
        return await this.makeRequest(`/${id}`);
    }

    // Update Employee
    async updateEmployee(id, employeeData) {
        return await this.makeRequest(`/${id}`, {
            method: 'PUT',
            body: JSON.stringify(employeeData)
        });
    }

    // Delete Employee
    async deleteEmployee(id) {
        return await this.makeRequest(`/${id}`, {
            method: 'DELETE'
        });
    }

    // 2. Search & Filter Operations

    // Search Employees
    async searchEmployees(query, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') {
        const queryParams = new URLSearchParams({
            query,
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDir
        });
        
        return await this.makeRequest(`/search?${queryParams}`);
    }

    // Get Employees by Department
    async getEmployeesByDepartment(department, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDir
        });
        
        return await this.makeRequest(`/department/${encodeURIComponent(department)}?${queryParams}`);
    }

    // Get Employees by Position
    async getEmployeesByPosition(position, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDir
        });
        
        return await this.makeRequest(`/position/${encodeURIComponent(position)}?${queryParams}`);
    }

    // Get Employees by Status
    async getEmployeesByStatus(status) {
        return await this.makeRequest(`/status/${status}`);
    }

    // 3. Date & Salary Filters

    // Get Employees Hired Between Dates
    async getEmployeesHiredBetween(startDate, endDate) {
        const queryParams = new URLSearchParams({
            startDate, // Format: YYYY-MM-DD
            endDate    // Format: YYYY-MM-DD
        });
        
        return await this.makeRequest(`/hired-between?${queryParams}`);
    }

    // Get Recently Hired Employees (Last N months)
    async getRecentlyHiredEmployees(months) {
        return await this.makeRequest(`/recently-hired/${months}`);
    }

    // Get Employees with Salary Greater Than
    async getEmployeesWithSalaryGreaterThan(amount) {
        return await this.makeRequest(`/salary/greater-than/${amount}`);
    }

    // Get Employees with Salary Between Range
    async getEmployeesWithSalaryBetween(minSalary, maxSalary) {
        const queryParams = new URLSearchParams({
            minSalary: minSalary.toString(),
            maxSalary: maxSalary.toString()
        });
        
        return await this.makeRequest(`/salary/between?${queryParams}`);
    }

    // 4. Statistics & Reports

    // Get Department Statistics
    async getDepartmentStatistics() {
        return await this.makeRequest('/statistics/departments');
    }

    // Get Status Statistics
    async getStatusStatistics() {
        return await this.makeRequest('/statistics/status');
    }

    // 5. Advanced Search with Multiple Criteria
    async advancedSearch(criteria) {
        const {
            query,
            department,
            position,
            status,
            minSalary,
            maxSalary,
            startDate,
            endDate,
            page = 0,
            size = 10,
            sortBy = 'id',
            sortDir = 'asc'
        } = criteria;

        // If we have a general query, use search endpoint
        if (query) {
            return await this.searchEmployees(query, page, size, sortBy, sortDir);
        }

        // If we have department filter
        if (department) {
            return await this.getEmployeesByDepartment(department, page, size, sortBy, sortDir);
        }

        // If we have position filter
        if (position) {
            return await this.getEmployeesByPosition(position, page, size, sortBy, sortDir);
        }

        // If we have status filter
        if (status) {
            return await this.getEmployeesByStatus(status);
        }

        // If we have salary range
        if (minSalary && maxSalary) {
            return await this.getEmployeesWithSalaryBetween(minSalary, maxSalary);
        }

        // If we have date range
        if (startDate && endDate) {
            return await this.getEmployeesHiredBetween(startDate, endDate);
        }

        // Default to getting all employees
        return await this.getAllEmployees(page, size, sortBy, sortDir);
    }

    // 6. Bulk Operations (for future enhancement)
    async bulkDeleteEmployees(ids) {
        const promises = ids.map(id => this.deleteEmployee(id));
        return await Promise.allSettled(promises);
    }

    // 7. Data Validation Helpers
    validateEmployee(employeeData) {
        const errors = [];
        
        if (!employeeData.firstName || employeeData.firstName.trim() === '') {
            errors.push('First name is required');
        }
        
        if (!employeeData.lastName || employeeData.lastName.trim() === '') {
            errors.push('Last name is required');
        }
        
        if (!employeeData.email || !this.isValidEmail(employeeData.email)) {
            errors.push('Valid email is required');
        }
        
        if (!employeeData.department || employeeData.department.trim() === '') {
            errors.push('Department is required');
        }
        
        if (!employeeData.position || employeeData.position.trim() === '') {
            errors.push('Position is required');
        }
        
        if (!employeeData.salary || employeeData.salary <= 0) {
            errors.push('Valid salary is required');
        }
        
        if (!employeeData.hireDate) {
            errors.push('Hire date is required');
        }
        
        if (!employeeData.status || !['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'].includes(employeeData.status)) {
            errors.push('Valid status is required');
        }
        
        return errors;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 8. Utility Methods

    // Format employee data for display
    formatEmployeeForDisplay(employee) {
        return {
            ...employee,
            fullName: `${employee.firstName} ${employee.lastName}`,
            formattedSalary: this.formatCurrency(employee.salary),
            formattedHireDate: this.formatDate(employee.hireDate),
            statusBadge: this.getStatusBadgeClass(employee.status)
        };
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    getStatusBadgeClass(status) {
        const statusClasses = {
            'ACTIVE': 'status-active',
            'INACTIVE': 'status-inactive',
            'ON_LEAVE': 'status-on-leave',
            'TERMINATED': 'status-terminated'
        };
        return statusClasses[status] || 'status-inactive';
    }

    // 9. Cache Management (for better performance)
    cache = new Map();
    
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < 60000) { // 1 minute cache
            return cached.data;
        }
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }

    // 10. Batch Operations for Dashboard
    async getDashboardData() {
        try {
            const [
                allEmployeesData,
                departmentStats,
                statusStats,
                recentHires
            ] = await Promise.all([
                this.getAllEmployees(0, 1), // Just get count
                this.getDepartmentStatistics(),
                this.getStatusStatistics(),
                this.getRecentlyHiredEmployees(6)
            ]);

            return {
                totalEmployees: allEmployeesData.totalElements || 0,
                activeEmployees: statusStats.ACTIVE || 0,
                totalDepartments: Object.keys(departmentStats).length,
                recentHires: recentHires.length || 0,
                departmentStats,
                statusStats,
                recentEmployees: recentHires.slice(0, 5) // Latest 5 for dashboard
            };
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            throw error;
        }
    }

    // 11. Export/Import functionality (future enhancement)
    exportEmployeesToCSV(employees) {
        const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Department', 'Position', 'Salary', 'Hire Date', 'Status'];
        const csvContent = [
            headers.join(','),
            ...employees.map(emp => [
                emp.id,
                emp.firstName,
                emp.lastName,
                emp.email,
                emp.department,
                emp.position,
                emp.salary,
                emp.hireDate,
                emp.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Custom Error Class for API Errors
class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }

    isValidationError() {
        return this.status === 400;
    }

    isNotFoundError() {
        return this.status === 404;
    }

    isServerError() {
        return this.status >= 500;
    }

    getErrorMessage() {
        if (this.data && this.data.errors) {
            return this.data.errors.join(', ');
        }
        return this.message;
    }
}

// Global API instance
const api = new EmployeeAPI();

// Global error handler
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason instanceof APIError) {
        console.error('Unhandled API Error:', event.reason.getErrorMessage());
        // Show toast notification
        if (window.ui) {
            window.ui.showToast(event.reason.getErrorMessage(), 'error');
        }
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EmployeeAPI, APIError };
}

// Debug helpers (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.api = api;
    window.APIError = APIError;
    
    console.log('Employee API initialized. Available methods:');
    console.log('- api.getAllEmployees(page, size, sortBy, sortDir)');
    console.log('- api.createEmployee(data)');
    console.log('- api.updateEmployee(id, data)');
    console.log('- api.deleteEmployee(id)');
    console.log('- api.searchEmployees(query)');
    console.log('- api.getDashboardData()');
    console.log('- See console.log output for all available methods');
}
