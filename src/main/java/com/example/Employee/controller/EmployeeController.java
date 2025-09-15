package com.example.Employee.controller;

import com.example.Employee.dto.EmployeeRequestDTO;
import com.example.Employee.dto.EmployeeResponseDTO;
import com.example.Employee.model.Employee;
import com.example.Employee.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmployeeController {
    
    private final EmployeeService employeeService;
    
    // Create new employee
    @PostMapping
    public ResponseEntity<EmployeeResponseDTO> createEmployee(@Valid @RequestBody EmployeeRequestDTO requestDTO) {
        EmployeeResponseDTO createdEmployee = employeeService.createEmployee(requestDTO);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }
    
    // Get employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeById(@PathVariable Long id) {
        EmployeeResponseDTO employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }
    
    // Get all employees with pagination and sorting
    @GetMapping
    public ResponseEntity<Page<EmployeeResponseDTO>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Page<EmployeeResponseDTO> employees = employeeService.getAllEmployees(page, size, sortBy, sortDir);
        return ResponseEntity.ok(employees);
    }
    
    // Update employee
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> updateEmployee(
            @PathVariable Long id, 
            @Valid @RequestBody EmployeeRequestDTO requestDTO) {
        
        EmployeeResponseDTO updatedEmployee = employeeService.updateEmployee(id, requestDTO);
        return ResponseEntity.ok(updatedEmployee);
    }
    
    // Delete employee
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
    
    // Search employees
    @GetMapping("/search")
    public ResponseEntity<Page<EmployeeResponseDTO>> searchEmployees(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Page<EmployeeResponseDTO> employees = employeeService.searchEmployees(query, page, size, sortBy, sortDir);
        return ResponseEntity.ok(employees);
    }
    
    // Get employees by department
    @GetMapping("/department/{department}")
    public ResponseEntity<Page<EmployeeResponseDTO>> getEmployeesByDepartment(
            @PathVariable String department,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Page<EmployeeResponseDTO> employees = employeeService.getEmployeesByDepartment(department, page, size, sortBy, sortDir);
        return ResponseEntity.ok(employees);
    }
    
    // Get employees by position
    @GetMapping("/position/{position}")
    public ResponseEntity<Page<EmployeeResponseDTO>> getEmployeesByPosition(
            @PathVariable String position,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Page<EmployeeResponseDTO> employees = employeeService.getEmployeesByPosition(position, page, size, sortBy, sortDir);
        return ResponseEntity.ok(employees);
    }
    
    // Get employees by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<EmployeeResponseDTO>> getEmployeesByStatus(@PathVariable Employee.EmployeeStatus status) {
        List<EmployeeResponseDTO> employees = employeeService.getEmployeesByStatus(status);
        return ResponseEntity.ok(employees);
    }
    
    // Get employees hired between dates
    @GetMapping("/hired-between")
    public ResponseEntity<List<EmployeeResponseDTO>> getEmployeesHiredBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<EmployeeResponseDTO> employees = employeeService.getEmployeesHiredBetween(startDate, endDate);
        return ResponseEntity.ok(employees);
    }
    
    // Get employees with salary greater than specified amount
    @GetMapping("/salary/greater-than/{amount}")
    public ResponseEntity<List<EmployeeResponseDTO>> getEmployeesWithSalaryGreaterThan(@PathVariable BigDecimal amount) {
        List<EmployeeResponseDTO> employees = employeeService.getEmployeesWithSalaryGreaterThan(amount);
        return ResponseEntity.ok(employees);
    }
    
    // Get employees with salary between range
    @GetMapping("/salary/between")
    public ResponseEntity<List<EmployeeResponseDTO>> getEmployeesWithSalaryBetween(
            @RequestParam BigDecimal minSalary,
            @RequestParam BigDecimal maxSalary) {
        
        List<EmployeeResponseDTO> employees = employeeService.getEmployeesWithSalaryBetween(minSalary, maxSalary);
        return ResponseEntity.ok(employees);
    }
    
    // Get recently hired employees (last N months)
    @GetMapping("/recently-hired/{months}")
    public ResponseEntity<List<EmployeeResponseDTO>> getRecentlyHiredEmployees(@PathVariable int months) {
        List<EmployeeResponseDTO> employees = employeeService.getRecentlyHiredEmployees(months);
        return ResponseEntity.ok(employees);
    }
    
    // Get department statistics
    @GetMapping("/statistics/departments")
    public ResponseEntity<Map<String, Long>> getDepartmentStatistics() {
        Map<String, Long> statistics = employeeService.getDepartmentStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    // Get status statistics
    @GetMapping("/statistics/status")
    public ResponseEntity<Map<String, Long>> getStatusStatistics() {
        Map<String, Long> statistics = employeeService.getStatusStatistics();
        return ResponseEntity.ok(statistics);
    }
}
