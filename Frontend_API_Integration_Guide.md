# Employee Management API - Frontend Integration Guide

## 🚀 Complete API Documentation for Frontend Development

### Base Configuration

```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:8081/api/employees';

// Headers for all requests
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};
```

---

## 📋 Complete API Endpoints Reference

### 1. CRUD Operations

#### **1.1 Create Employee**
- **Method:** `POST`
- **Endpoint:** `/api/employees`
- **Request Body:** EmployeeRequestDTO

```javascript
// Create Employee Function
async function createEmployee(employeeData) {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(employeeData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newEmployee = await response.json();
        return newEmployee;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
}

// Usage Example
const newEmployee = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phoneNumber: "+1234567890",
    department: "IT",
    position: "Software Developer",
    salary: 75000.00,
    hireDate: "2024-01-15",
    status: "ACTIVE",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    emergencyContactName: "Jane Doe",
    emergencyContactPhone: "+1987654321"
};

createEmployee(newEmployee)
    .then(employee => console.log('Created:', employee))
    .catch(error => console.error('Error:', error));
```

#### **1.2 Get All Employees (Paginated)**
- **Method:** `GET`
- **Endpoint:** `/api/employees?page={page}&size={size}&sortBy={field}&sortDir={direction}`

```javascript
// Get All Employees with Pagination
async function getAllEmployees(page = 0, size = 10, sortBy = 'id', sortDir = 'asc') {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDir
        });
        
        const response = await fetch(`${API_BASE_URL}?${queryParams}`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const pageData = await response.json();
        return pageData;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
}

// Usage Example
getAllEmployees(0, 5, 'firstName', 'asc')
    .then(pageData => {
        console.log('Employees:', pageData.content);
        console.log('Total Pages:', pageData.totalPages);
        console.log('Total Elements:', pageData.totalElements);
    })
    .catch(error => console.error('Error:', error));
```

#### **1.3 Get Employee by ID**
- **Method:** `GET`
- **Endpoint:** `/api/employees/{id}`

```javascript
// Get Employee by ID
async function getEmployeeById(employeeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${employeeId}`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Employee not found');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employee = await response.json();
        return employee;
    } catch (error) {
        console.error('Error fetching employee:', error);
        throw error;
    }
}

// Usage Example
getEmployeeById(1)
    .then(employee => console.log('Employee:', employee))
    .catch(error => console.error('Error:', error));
```

#### **1.4 Update Employee**
- **Method:** `PUT`
- **Endpoint:** `/api/employees/{id}`

```javascript
// Update Employee
async function updateEmployee(employeeId, updatedData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${employeeId}`, {
            method: 'PUT',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(updatedData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedEmployee = await response.json();
        return updatedEmployee;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
}

// Usage Example
const updatedData = {
    firstName: "John",
    lastName: "Smith", // Updated last name
    email: "john.smith@company.com", // Updated email
    phoneNumber: "+1234567890",
    department: "IT",
    position: "Senior Software Developer", // Promoted
    salary: 85000.00, // Salary increase
    hireDate: "2024-01-15",
    status: "ACTIVE"
};

updateEmployee(1, updatedData)
    .then(employee => console.log('Updated:', employee))
    .catch(error => console.error('Error:', error));
```

#### **1.5 Delete Employee**
- **Method:** `DELETE`
- **Endpoint:** `/api/employees/{id}`

```javascript
// Delete Employee
async function deleteEmployee(employeeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${employeeId}`, {
            method: 'DELETE',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return true; // Successfully deleted
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
}

// Usage Example
deleteEmployee(1)
    .then(() => console.log('Employee deleted successfully'))
    .catch(error => console.error('Error:', error));
```

---

### 2. Search & Filter Operations

#### **2.1 Search Employees**
- **Method:** `GET`
- **Endpoint:** `/api/employees/search?query={searchTerm}`

```javascript
// Search Employees
async function searchEmployees(query, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') {
    try {
        const queryParams = new URLSearchParams({
            query,
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDir
        });
        
        const response = await fetch(`${API_BASE_URL}/search?${queryParams}`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const searchResults = await response.json();
        return searchResults;
    } catch (error) {
        console.error('Error searching employees:', error);
        throw error;
    }
}

// Usage Example
searchEmployees('john')
    .then(results => console.log('Search Results:', results.content))
    .catch(error => console.error('Error:', error));
```

#### **2.2 Get Employees by Department**
- **Method:** `GET`
- **Endpoint:** `/api/employees/department/{department}`

```javascript
// Get Employees by Department
async function getEmployeesByDepartment(department, page = 0, size = 10) {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        
        const response = await fetch(`${API_BASE_URL}/department/${encodeURIComponent(department)}?${queryParams}`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error fetching employees by department:', error);
        throw error;
    }
}

// Usage Example
getEmployeesByDepartment('IT')
    .then(employees => console.log('IT Employees:', employees.content))
    .catch(error => console.error('Error:', error));
```

#### **2.3 Get Employees by Position**
- **Method:** `GET`
- **Endpoint:** `/api/employees/position/{position}`

```javascript
// Get Employees by Position
async function getEmployeesByPosition(position, page = 0, size = 10) {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        
        const response = await fetch(`${API_BASE_URL}/position/${encodeURIComponent(position)}?${queryParams}`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error fetching employees by position:', error);
        throw error;
    }
}

// Usage Example
getEmployeesByPosition('Software Developer')
    .then(employees => console.log('Developers:', employees.content))
    .catch(error => console.error('Error:', error));
```

#### **2.4 Get Employees by Status**
- **Method:** `GET`
- **Endpoint:** `/api/employees/status/{status}`

```javascript
// Get Employees by Status
async function getEmployeesByStatus(status) {
    try {
        const response = await fetch(`${API_BASE_URL}/status/${status}`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error fetching employees by status:', error);
        throw error;
    }
}

// Usage Example - Valid statuses: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED
getEmployeesByStatus('ACTIVE')
    .then(employees => console.log('Active Employees:', employees))
    .catch(error => console.error('Error:', error));
```

---

### 3. Date & Salary Filters

#### **3.1 Get Employees Hired Between Dates**
- **Method:** `GET`
- **Endpoint:** `/api/employees/hired-between?startDate={start}&endDate={end}`

```javascript
// Get Employees Hired Between Dates
async function getEmployeesHiredBetween(startDate, endDate) {
    try {
        const queryParams = new URLSearchParams({
            startDate: startDate, // Format: YYYY-MM-DD
            endDate: endDate     // Format: YYYY-MM-DD
        });
        
        const response = await fetch(`${API_BASE_URL}/hired-between?${queryParams}`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error fetching employees by hire date:', error);
        throw error;
    }
}

// Usage Example
getEmployeesHiredBetween('2024-01-01', '2024-12-31')
    .then(employees => console.log('Employees hired in 2024:', employees))
    .catch(error => console.error('Error:', error));
```

#### **3.2 Get Recently Hired Employees**
- **Method:** `GET`
- **Endpoint:** `/api/employees/recently-hired/{months}`

```javascript
// Get Recently Hired Employees
async function getRecentlyHiredEmployees(months) {
    try {
        const response = await fetch(`${API_BASE_URL}/recently-hired/${months}`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error fetching recently hired employees:', error);
        throw error;
    }
}

// Usage Example
getRecentlyHiredEmployees(6) // Last 6 months
    .then(employees => console.log('Recently hired:', employees))
    .catch(error => console.error('Error:', error));
```

#### **3.3 Get Employees with Salary Greater Than**
- **Method:** `GET`
- **Endpoint:** `/api/employees/salary/greater-than/{amount}`

```javascript
// Get Employees with Salary Greater Than
async function getEmployeesWithSalaryGreaterThan(amount) {
    try {
        const response = await fetch(`${API_BASE_URL}/salary/greater-than/${amount}`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error fetching high-salary employees:', error);
        throw error;
    }
}

// Usage Example
getEmployeesWithSalaryGreaterThan(70000)
    .then(employees => console.log('High earners:', employees))
    .catch(error => console.error('Error:', error));
```

#### **3.4 Get Employees with Salary Between Range**
- **Method:** `GET`
- **Endpoint:** `/api/employees/salary/between?minSalary={min}&maxSalary={max}`

```javascript
// Get Employees with Salary Between Range
async function getEmployeesWithSalaryBetween(minSalary, maxSalary) {
    try {
        const queryParams = new URLSearchParams({
            minSalary: minSalary.toString(),
            maxSalary: maxSalary.toString()
        });
        
        const response = await fetch(`${API_BASE_URL}/salary/between?${queryParams}`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error fetching employees by salary range:', error);
        throw error;
    }
}

// Usage Example
getEmployeesWithSalaryBetween(50000, 100000)
    .then(employees => console.log('Mid-range earners:', employees))
    .catch(error => console.error('Error:', error));
```

---

### 4. Statistics & Reports

#### **4.1 Get Department Statistics**
- **Method:** `GET`
- **Endpoint:** `/api/employees/statistics/departments`

```javascript
// Get Department Statistics
async function getDepartmentStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics/departments`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const statistics = await response.json();
        return statistics;
    } catch (error) {
        console.error('Error fetching department statistics:', error);
        throw error;
    }
}

// Usage Example
getDepartmentStatistics()
    .then(stats => {
        console.log('Department Statistics:', stats);
        // Expected format: { "IT": 5, "HR": 3, "Finance": 2 }
    })
    .catch(error => console.error('Error:', error));
```

#### **4.2 Get Status Statistics**
- **Method:** `GET`
- **Endpoint:** `/api/employees/statistics/status`

```javascript
// Get Status Statistics
async function getStatusStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics/status`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const statistics = await response.json();
        return statistics;
    } catch (error) {
        console.error('Error fetching status statistics:', error);
        throw error;
    }
}

// Usage Example
getStatusStatistics()
    .then(stats => {
        console.log('Status Statistics:', stats);
        // Expected format: { "ACTIVE": 8, "ON_LEAVE": 1, "INACTIVE": 1 }
    })
    .catch(error => console.error('Error:', error));
```

---

## 🎨 Frontend Framework Examples

### React/Next.js Example

```jsx
import React, { useState, useEffect } from 'react';

// Custom Hook for Employee API
const useEmployeeAPI = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllEmployees = async (page = 0, size = 10) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getAllEmployees(page, size);
            setEmployees(response.content);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createNewEmployee = async (employeeData) => {
        setLoading(true);
        setError(null);
        
        try {
            const newEmployee = await createEmployee(employeeData);
            setEmployees(prev => [newEmployee, ...prev]);
            return newEmployee;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        employees,
        loading,
        error,
        fetchAllEmployees,
        createNewEmployee
    };
};

// Component Example
const EmployeeList = () => {
    const { employees, loading, error, fetchAllEmployees } = useEmployeeAPI();

    useEffect(() => {
        fetchAllEmployees();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Employee List</h2>
            {employees.map(employee => (
                <div key={employee.id} className="employee-card">
                    <h3>{employee.firstName} {employee.lastName}</h3>
                    <p>Department: {employee.department}</p>
                    <p>Position: {employee.position}</p>
                    <p>Email: {employee.email}</p>
                </div>
            ))}
        </div>
    );
};
```

### Vue.js Example

```javascript
// Vue 3 Composition API
import { ref, reactive, onMounted } from 'vue';

export default {
    setup() {
        const employees = ref([]);
        const loading = ref(false);
        const error = ref(null);

        const fetchEmployees = async () => {
            loading.value = true;
            error.value = null;
            
            try {
                const response = await getAllEmployees();
                employees.value = response.content;
            } catch (err) {
                error.value = err.message;
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            fetchEmployees();
        });

        return {
            employees,
            loading,
            error,
            fetchEmployees
        };
    }
};
```

### Angular Service Example

```typescript
// employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    position: string;
    salary: number;
    status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private baseUrl = 'http://localhost:8081/api/employees';

    constructor(private http: HttpClient) {}

    getAllEmployees(page = 0, size = 10): Observable<any> {
        return this.http.get(`${this.baseUrl}?page=${page}&size=${size}`);
    }

    getEmployeeById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.baseUrl}/${id}`);
    }

    createEmployee(employee: Partial<Employee>): Observable<Employee> {
        return this.http.post<Employee>(this.baseUrl, employee);
    }

    updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
        return this.http.put<Employee>(`${this.baseUrl}/${id}`, employee);
    }

    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
```

---

## 🔧 Error Handling Best Practices

```javascript
// Centralized Error Handler
class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// Enhanced Fetch Wrapper
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, {
            headers: DEFAULT_HEADERS,
            ...options
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: 'Unknown error occurred' };
            }

            throw new APIError(
                errorData.message || `HTTP ${response.status}`,
                response.status,
                errorData
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        
        // Network or other errors
        throw new APIError('Network error or server unavailable', 0, null);
    }
}
```

---

## 🎯 Complete Employee Interface (TypeScript)

```typescript
// Employee Types
export interface Employee {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    department: string;
    position: string;
    salary: number;
    hireDate: string; // ISO date string
    status: EmployeeStatus;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface PageResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
}
```

This comprehensive guide provides everything you need to build a complete frontend for your Employee Management API! 🚀

Choose your preferred frontend framework (React, Vue, Angular, or vanilla JavaScript) and start building your user interface using these API integration patterns.
