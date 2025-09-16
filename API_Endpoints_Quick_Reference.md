# Employee Management API - Quick Reference

## 🚀 All API Endpoints Summary

**Base URL:** `http://localhost:8081/api/employees`

---

## 📋 **1. CRUD Operations**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/employees` | Create new employee |
| `GET` | `/api/employees` | Get all employees (paginated) |
| `GET` | `/api/employees/{id}` | Get employee by ID |
| `PUT` | `/api/employees/{id}` | Update employee |
| `DELETE` | `/api/employees/{id}` | Delete employee |

---

## 🔍 **2. Search & Filter**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees/search?query={term}` | Search employees |
| `GET` | `/api/employees/department/{dept}` | Filter by department |
| `GET` | `/api/employees/position/{position}` | Filter by position |
| `GET` | `/api/employees/status/{status}` | Filter by status |

---

## 📅 **3. Date & Salary Filters**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees/hired-between?startDate={start}&endDate={end}` | Employees hired between dates |
| `GET` | `/api/employees/recently-hired/{months}` | Recently hired (last N months) |
| `GET` | `/api/employees/salary/greater-than/{amount}` | Salary greater than amount |
| `GET` | `/api/employees/salary/between?minSalary={min}&maxSalary={max}` | Salary in range |

---

## 📊 **4. Statistics & Reports**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees/statistics/departments` | Department statistics |
| `GET` | `/api/employees/statistics/status` | Status statistics |

---

## 🎯 **Employee Status Values**

- `ACTIVE`
- `INACTIVE` 
- `ON_LEAVE`
- `TERMINATED`

---

## 📝 **Sample Employee JSON**

```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@company.com",
  "phoneNumber": "+1234567890",
  "department": "IT",
  "position": "Software Developer",
  "salary": 75000.00,
  "hireDate": "2024-01-15",
  "status": "ACTIVE",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY", 
  "zipCode": "10001",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1987654321"
}
```

---

## ⚡ **Quick Test URLs**

### Basic Operations
- `GET http://localhost:8081/api/employees` - List all employees
- `GET http://localhost:8081/api/employees/1` - Get employee with ID 1

### Statistics  
- `GET http://localhost:8081/api/employees/statistics/departments` - Department counts
- `GET http://localhost:8081/api/employees/statistics/status` - Status counts

### Filters
- `GET http://localhost:8081/api/employees/department/IT` - IT department employees
- `GET http://localhost:8081/api/employees/status/ACTIVE` - Active employees
- `GET http://localhost:8081/api/employees/search?query=john` - Search for "john"

---

## 🔥 **Frontend Integration Tips**

1. **Use the detailed guide** in `Frontend_API_Integration_Guide.md`
2. **Start with GET endpoints** to fetch data
3. **Implement error handling** for all requests
4. **Use pagination** for large datasets
5. **Validate data** before POST/PUT operations
