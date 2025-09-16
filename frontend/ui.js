// UI Manager for Employee Management System
// Handles all user interface interactions, form management, and data display

class UIManager {
    constructor() {
        this.currentPage = 0;
        this.pageSize = 10;
        this.currentSort = { field: 'id', direction: 'asc' };
        this.currentSection = 'dashboard';
        this.editingEmployeeId = null;
        this.departments = new Set();
        
        this.init();
    }

    // Initialize UI components and event listeners
    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.loadInitialData();
    }

    // Setup all event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Add Employee Button
        const addEmployeeBtn = document.getElementById('addEmployeeBtn');
        if (addEmployeeBtn) {
            addEmployeeBtn.addEventListener('click', () => this.showAddEmployeeModal());
        }

        // Modal controls
        const modal = document.getElementById('employeeModal');
        const modalClose = document.getElementById('modalClose');
        const cancelBtn = document.getElementById('cancelBtn');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.hideModal());
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideModal());
        }

        // Click outside modal to close
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal();
                }
            });
        }

        // Form submission
        const employeeForm = document.getElementById('employeeForm');
        if (employeeForm) {
            employeeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Search and filters
        this.setupSearchAndFilters();

        // Pagination
        this.setupPagination();

        // Advanced search
        this.setupAdvancedSearch();

        // Reports
        this.setupReports();
    }

    // Setup search and filter controls
    setupSearchAndFilters() {
        const quickSearch = document.getElementById('quickSearch');
        if (quickSearch) {
            let searchTimeout;
            quickSearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleQuickSearch(e.target.value);
                }, 300);
            });
        }

        const departmentFilter = document.getElementById('departmentFilter');
        if (departmentFilter) {
            departmentFilter.addEventListener('change', () => this.handleFilters());
        }

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.handleFilters());
        }

        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', () => this.handleSortChange());
        }

        const sortDirection = document.getElementById('sortDirection');
        if (sortDirection) {
            sortDirection.addEventListener('change', () => this.handleSortChange());
        }
    }

    // Setup pagination controls
    setupPagination() {
        const prevPage = document.getElementById('prevPage');
        if (prevPage) {
            prevPage.addEventListener('click', () => {
                if (this.currentPage > 0) {
                    this.currentPage--;
                    this.loadEmployees();
                }
            });
        }

        const nextPage = document.getElementById('nextPage');
        if (nextPage) {
            nextPage.addEventListener('click', () => {
                this.currentPage++;
                this.loadEmployees();
            });
        }
    }

    // Setup advanced search
    setupAdvancedSearch() {
        const advancedSearchBtn = document.getElementById('advancedSearchBtn');
        if (advancedSearchBtn) {
            advancedSearchBtn.addEventListener('click', () => this.handleAdvancedSearch());
        }

        const clearSearchBtn = document.getElementById('clearSearchBtn');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => this.clearAdvancedSearch());
        }
    }

    // Setup reports functionality
    setupReports() {
        const salaryAnalysisBtn = document.getElementById('salaryAnalysisBtn');
        if (salaryAnalysisBtn) {
            salaryAnalysisBtn.addEventListener('click', () => this.performSalaryAnalysis());
        }

        const hiringTrendsBtn = document.getElementById('hiringTrendsBtn');
        if (hiringTrendsBtn) {
            hiringTrendsBtn.addEventListener('click', () => this.performHiringTrends());
        }
    }

    // Theme management
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Section navigation
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentSection = sectionName;

        // Load section-specific data
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'employees':
                this.loadEmployees();
                break;
            case 'search':
                this.loadDepartmentOptions();
                break;
            case 'reports':
                this.loadReports();
                break;
        }
    }

    // Load initial data
    async loadInitialData() {
        try {
            await this.loadDashboard();
        } catch (error) {
            this.showToast('Error loading initial data', 'error');
            console.error('Error loading initial data:', error);
        }
    }

    // Dashboard functionality
    async loadDashboard() {
        try {
            const dashboardData = await api.getDashboardData();
            this.updateDashboardStats(dashboardData);
            this.updateRecentEmployeesTable(dashboardData.recentEmployees);
            
            // Update charts if charts.js is available
            if (window.charts) {
                window.charts.updateDepartmentChart(dashboardData.departmentStats);
                window.charts.updateStatusChart(dashboardData.statusStats);
            }
        } catch (error) {
            this.showToast('Error loading dashboard data', 'error');
            console.error('Error loading dashboard:', error);
        }
    }

    updateDashboardStats(data) {
        const updates = [
            { id: 'totalEmployees', value: data.totalEmployees },
            { id: 'activeEmployees', value: data.activeEmployees },
            { id: 'totalDepartments', value: data.totalDepartments },
            { id: 'recentHires', value: data.recentHires }
        ];

        updates.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element) {
                this.animateNumber(element, parseInt(element.textContent) || 0, value);
            }
        });
    }

    animateNumber(element, start, end, duration = 1000) {
        const range = end - start;
        const startTime = Date.now();
        
        const updateNumber = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + range * easeOut);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        updateNumber();
    }

    updateRecentEmployeesTable(employees) {
        const tbody = document.getElementById('recentEmployeesTable');
        if (!tbody) return;

        if (!employees || employees.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No recent employees found</td></tr>';
            return;
        }

        tbody.innerHTML = employees.map(employee => `
            <tr>
                <td>${employee.firstName} ${employee.lastName}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td>${api.formatDate(employee.hireDate)}</td>
                <td><span class="status-badge ${api.getStatusBadgeClass(employee.status)}">${employee.status}</span></td>
            </tr>
        `).join('');
    }

    // Employee management
    async loadEmployees() {
        try {
            const data = await api.getAllEmployees(
                this.currentPage,
                this.pageSize,
                this.currentSort.field,
                this.currentSort.direction
            );
            
            this.updateEmployeeTable(data.content);
            this.updatePagination(data);
            this.updateDepartmentOptions(data.content);
        } catch (error) {
            this.showToast('Error loading employees', 'error');
            console.error('Error loading employees:', error);
        }
    }

    updateEmployeeTable(employees) {
        const tbody = document.getElementById('employeeTable');
        if (!tbody) return;

        if (!employees || employees.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: var(--text-muted);">No employees found</td></tr>';
            return;
        }

        tbody.innerHTML = employees.map(employee => `
            <tr>
                <td>${employee.id}</td>
                <td>${employee.firstName} ${employee.lastName}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td>${api.formatCurrency(employee.salary)}</td>
                <td>${api.formatDate(employee.hireDate)}</td>
                <td><span class="status-badge ${api.getStatusBadgeClass(employee.status)}">${employee.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="ui.editEmployee(${employee.id})" title="Edit Employee">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="ui.confirmDeleteEmployee(${employee.id})" title="Delete Employee">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updatePagination(data) {
        const paginationInfo = document.getElementById('paginationInfo');
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');
        const pageNumbers = document.getElementById('pageNumbers');

        if (paginationInfo) {
            const start = data.empty ? 0 : (data.number * data.size) + 1;
            const end = Math.min((data.number + 1) * data.size, data.totalElements);
            paginationInfo.textContent = `Showing ${start}-${end} of ${data.totalElements} employees`;
        }

        if (prevPage) {
            prevPage.disabled = data.first;
        }

        if (nextPage) {
            nextPage.disabled = data.last;
        }

        // Update page numbers
        if (pageNumbers) {
            const totalPages = data.totalPages;
            const currentPage = data.number;
            let pagesHTML = '';

            // Always show first page
            if (totalPages > 0) {
                pagesHTML += `<button class="page-btn ${currentPage === 0 ? 'active' : ''}" onclick="ui.goToPage(0)">1</button>`;
            }

            // Show ellipsis if needed
            if (currentPage > 2) {
                pagesHTML += '<span>...</span>';
            }

            // Show pages around current page
            for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
                if (i > 0 && i < totalPages - 1) {
                    pagesHTML += `<button class="page-btn ${currentPage === i ? 'active' : ''}" onclick="ui.goToPage(${i})">${i + 1}</button>`;
                }
            }

            // Show ellipsis if needed
            if (currentPage < totalPages - 3) {
                pagesHTML += '<span>...</span>';
            }

            // Always show last page
            if (totalPages > 1) {
                pagesHTML += `<button class="page-btn ${currentPage === totalPages - 1 ? 'active' : ''}" onclick="ui.goToPage(${totalPages - 1})">${totalPages}</button>`;
            }

            pageNumbers.innerHTML = pagesHTML;
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.loadEmployees();
    }

    updateDepartmentOptions(employees) {
        employees.forEach(emp => this.departments.add(emp.department));
        
        const selects = [
            document.getElementById('departmentFilter'),
            document.getElementById('searchDepartment')
        ];

        selects.forEach(select => {
            if (select) {
                const currentValue = select.value;
                const defaultOption = select.querySelector('option[value=""]');
                select.innerHTML = defaultOption ? defaultOption.outerHTML : '<option value="">All Departments</option>';
                
                Array.from(this.departments).sort().forEach(dept => {
                    const option = document.createElement('option');
                    option.value = dept;
                    option.textContent = dept;
                    select.appendChild(option);
                });
                
                select.value = currentValue;
            }
        });
    }

    // Modal management
    showAddEmployeeModal() {
        this.editingEmployeeId = null;
        document.getElementById('modalTitle').textContent = 'Add Employee';
        document.getElementById('saveBtn').textContent = 'Save Employee';
        this.clearForm();
        this.showModal();
    }

    async editEmployee(id) {
        try {
            const employee = await api.getEmployeeById(id);
            this.editingEmployeeId = id;
            document.getElementById('modalTitle').textContent = 'Edit Employee';
            document.getElementById('saveBtn').textContent = 'Update Employee';
            this.populateForm(employee);
            this.showModal();
        } catch (error) {
            this.showToast('Error loading employee data', 'error');
            console.error('Error loading employee:', error);
        }
    }

    showModal() {
        const modal = document.getElementById('employeeModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal() {
        const modal = document.getElementById('employeeModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Form management
    clearForm() {
        const form = document.getElementById('employeeForm');
        if (form) {
            form.reset();
            // Set default hire date to today
            const hireDateField = document.getElementById('hireDate');
            if (hireDateField) {
                hireDateField.value = new Date().toISOString().split('T')[0];
            }
            // Clear validation states
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
        }
    }

    populateForm(employee) {
        const fields = [
            'firstName', 'lastName', 'email', 'phoneNumber',
            'department', 'position', 'salary', 'hireDate', 'status',
            'address', 'city', 'state', 'zipCode',
            'emergencyContactName', 'emergencyContactPhone'
        ];

        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element && employee[field] !== undefined) {
                element.value = employee[field];
            }
        });
    }

    getFormData() {
        const form = document.getElementById('employeeForm');
        const formData = new FormData(form);
        const data = {};

        // Get all form fields
        const fields = [
            'firstName', 'lastName', 'email', 'phoneNumber',
            'department', 'position', 'salary', 'hireDate', 'status',
            'address', 'city', 'state', 'zipCode',
            'emergencyContactName', 'emergencyContactPhone'
        ];

        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                data[field] = element.value.trim();
            }
        });

        // Convert salary to number
        if (data.salary) {
            data.salary = parseFloat(data.salary);
        }

        return data;
    }

    async handleFormSubmit() {
        try {
            const employeeData = this.getFormData();
            
            // Validate data
            const errors = api.validateEmployee(employeeData);
            if (errors.length > 0) {
                this.showValidationErrors(errors);
                return;
            }

            if (this.editingEmployeeId) {
                await api.updateEmployee(this.editingEmployeeId, employeeData);
                this.showToast('Employee updated successfully', 'success');
            } else {
                await api.createEmployee(employeeData);
                this.showToast('Employee created successfully', 'success');
            }

            this.hideModal();
            this.loadEmployees();
            
            // Refresh dashboard if we're on it
            if (this.currentSection === 'dashboard') {
                this.loadDashboard();
            }

        } catch (error) {
            let message = 'Error saving employee';
            
            if (error instanceof APIError) {
                message = error.getErrorMessage();
                
                if (error.isValidationError()) {
                    this.showValidationErrors([message]);
                    return;
                }
            }
            
            this.showToast(message, 'error');
            console.error('Error saving employee:', error);
        }
    }

    showValidationErrors(errors) {
        // Clear previous errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });

        // Show errors
        this.showToast(errors.join(', '), 'error');
    }

    // Delete employee
    confirmDeleteEmployee(id) {
        if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
            this.deleteEmployee(id);
        }
    }

    async deleteEmployee(id) {
        try {
            await api.deleteEmployee(id);
            this.showToast('Employee deleted successfully', 'success');
            this.loadEmployees();
            
            // Refresh dashboard if we're on it
            if (this.currentSection === 'dashboard') {
                this.loadDashboard();
            }
        } catch (error) {
            this.showToast('Error deleting employee', 'error');
            console.error('Error deleting employee:', error);
        }
    }

    // Search and filter functionality
    handleQuickSearch(query) {
        if (query.trim() === '') {
            this.loadEmployees();
        } else {
            this.performSearch({ query: query.trim() });
        }
    }

    handleFilters() {
        const departmentFilter = document.getElementById('departmentFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        const filters = {};
        
        if (departmentFilter && departmentFilter.value) {
            filters.department = departmentFilter.value;
        }
        
        if (statusFilter && statusFilter.value) {
            filters.status = statusFilter.value;
        }
        
        if (Object.keys(filters).length > 0) {
            this.performSearch(filters);
        } else {
            this.loadEmployees();
        }
    }

    handleSortChange() {
        const sortBy = document.getElementById('sortBy');
        const sortDirection = document.getElementById('sortDirection');
        
        if (sortBy && sortDirection) {
            this.currentSort.field = sortBy.value;
            this.currentSort.direction = sortDirection.value;
            this.currentPage = 0; // Reset to first page
            this.loadEmployees();
        }
    }

    async performSearch(criteria) {
        try {
            const searchCriteria = {
                ...criteria,
                page: this.currentPage,
                size: this.pageSize,
                sortBy: this.currentSort.field,
                sortDir: this.currentSort.direction
            };
            
            const data = await api.advancedSearch(searchCriteria);
            this.updateEmployeeTable(data.content || data); // Handle both paginated and non-paginated responses
            
            if (data.totalElements !== undefined) {
                this.updatePagination(data);
            }
        } catch (error) {
            this.showToast('Error performing search', 'error');
            console.error('Error performing search:', error);
        }
    }

    // Advanced search
    async handleAdvancedSearch() {
        const criteria = this.getAdvancedSearchCriteria();
        
        try {
            const data = await api.advancedSearch(criteria);
            this.displaySearchResults(data);
        } catch (error) {
            this.showToast('Error performing advanced search', 'error');
            console.error('Error performing advanced search:', error);
        }
    }

    getAdvancedSearchCriteria() {
        const elements = [
            'searchQuery', 'searchDepartment', 'searchPosition', 'searchStatus',
            'minSalary', 'maxSalary', 'startDate', 'endDate'
        ];
        
        const criteria = {};
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element && element.value.trim()) {
                const key = id.replace('search', '').toLowerCase();
                criteria[key === 'query' ? 'query' : key] = element.value.trim();
            }
        });
        
        return criteria;
    }

    displaySearchResults(data) {
        const resultsTable = document.getElementById('searchResultsTable');
        if (!resultsTable) return;

        const employees = data.content || data;
        
        if (!employees || employees.length === 0) {
            resultsTable.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No employees found matching your criteria</td></tr>';
            return;
        }

        resultsTable.innerHTML = employees.map(employee => `
            <tr>
                <td>${employee.firstName} ${employee.lastName}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td>${api.formatCurrency(employee.salary)}</td>
                <td>${api.formatDate(employee.hireDate)}</td>
                <td><span class="status-badge ${api.getStatusBadgeClass(employee.status)}">${employee.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="ui.editEmployee(${employee.id})" title="Edit Employee">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="ui.confirmDeleteEmployee(${employee.id})" title="Delete Employee">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    clearAdvancedSearch() {
        const elements = [
            'searchQuery', 'searchDepartment', 'searchPosition', 'searchStatus',
            'minSalary', 'maxSalary', 'startDate', 'endDate'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = '';
            }
        });

        // Clear results
        const resultsTable = document.getElementById('searchResultsTable');
        if (resultsTable) {
            resultsTable.innerHTML = '';
        }
    }

    async loadDepartmentOptions() {
        try {
            if (this.departments.size === 0) {
                const data = await api.getAllEmployees(0, 100); // Get more for department list
                this.updateDepartmentOptions(data.content);
            }
        } catch (error) {
            console.error('Error loading department options:', error);
        }
    }

    // Reports functionality
    async loadReports() {
        try {
            const [departmentStats, statusStats] = await Promise.all([
                api.getDepartmentStatistics(),
                api.getStatusStatistics()
            ]);
            
            this.updateDepartmentStats(departmentStats);
            this.updateStatusStats(statusStats);
        } catch (error) {
            this.showToast('Error loading reports', 'error');
            console.error('Error loading reports:', error);
        }
    }

    updateDepartmentStats(stats) {
        const container = document.getElementById('departmentStats');
        if (!container) return;

        container.innerHTML = Object.entries(stats)
            .sort(([, a], [, b]) => b - a)
            .map(([department, count]) => `
                <div class="stats-item">
                    <span class="stats-label">${department}</span>
                    <span class="stats-value">${count} employees</span>
                </div>
            `).join('');
    }

    updateStatusStats(stats) {
        const container = document.getElementById('statusStats');
        if (!container) return;

        container.innerHTML = Object.entries(stats)
            .sort(([, a], [, b]) => b - a)
            .map(([status, count]) => `
                <div class="stats-item">
                    <span class="stats-label">${status}</span>
                    <span class="stats-value">${count} employees</span>
                </div>
            `).join('');
    }

    async performSalaryAnalysis() {
        try {
            const threshold = document.getElementById('salaryThreshold').value || 70000;
            const [highEarners, salaryBetween] = await Promise.all([
                api.getEmployeesWithSalaryGreaterThan(threshold),
                api.getEmployeesWithSalaryBetween(threshold * 0.7, threshold)
            ]);

            const container = document.getElementById('salaryStats');
            if (container) {
                container.innerHTML = `
                    <div class="stats-item">
                        <span class="stats-label">Above $${parseInt(threshold).toLocaleString()}</span>
                        <span class="stats-value">${highEarners.length} employees</span>
                    </div>
                    <div class="stats-item">
                        <span class="stats-label">$${parseInt(threshold * 0.7).toLocaleString()} - $${parseInt(threshold).toLocaleString()}</span>
                        <span class="stats-value">${salaryBetween.length} employees</span>
                    </div>
                `;
            }
        } catch (error) {
            this.showToast('Error performing salary analysis', 'error');
            console.error('Error performing salary analysis:', error);
        }
    }

    async performHiringTrends() {
        try {
            const months = document.getElementById('hiringPeriod').value || 6;
            const recentHires = await api.getRecentlyHiredEmployees(months);

            const container = document.getElementById('hiringStats');
            if (container) {
                // Group by month
                const monthlyHires = {};
                recentHires.forEach(employee => {
                    const date = new Date(employee.hireDate);
                    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    monthlyHires[monthKey] = (monthlyHires[monthKey] || 0) + 1;
                });

                container.innerHTML = Object.entries(monthlyHires)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([month, count]) => `
                        <div class="stats-item">
                            <span class="stats-label">${new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                            <span class="stats-value">${count} hires</span>
                        </div>
                    `).join('') || '<div class="stats-item"><span class="stats-label">No recent hires</span></div>';
            }
        } catch (error) {
            this.showToast('Error analyzing hiring trends', 'error');
            console.error('Error analyzing hiring trends:', error);
        }
    }

    // Toast notifications
    showToast(message, type = 'info', duration = 5000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="toast-icon ${icons[type]}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });

        container.appendChild(toast);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, duration);
        }
    }
}

// Initialize UI Manager
const ui = new UIManager();

// Make UI globally available
window.ui = ui;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
