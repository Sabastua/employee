package com.example.Employee.service;

import com.example.Employee.dto.EmployeeRequestDTO;
import com.example.Employee.dto.EmployeeResponseDTO;
import com.example.Employee.exception.DuplicateEmailException;
import com.example.Employee.exception.EmployeeNotFoundException;
import com.example.Employee.model.Employee;
import com.example.Employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {
    
    private final EmployeeRepository employeeRepository;
    
    // Create new employee
    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO requestDTO) {
        // Check if email already exists
        if (employeeRepository.existsByEmail(requestDTO.getEmail())) {
            throw new DuplicateEmailException(requestDTO.getEmail());
        }
        
        Employee employee = mapRequestDTOToEntity(requestDTO);
        Employee savedEmployee = employeeRepository.save(employee);
        
        return EmployeeResponseDTO.fromEntity(savedEmployee);
    }
    
    // Get employee by ID
    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
        
        return EmployeeResponseDTO.fromEntity(employee);
    }
    
    // Get all employees with pagination
    @Transactional(readOnly = true)
    public Page<EmployeeResponseDTO> getAllEmployees(int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Employee> employees = employeeRepository.findAll(pageable);
        return employees.map(EmployeeResponseDTO::fromEntity);
    }
    
    // Update employee
    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO requestDTO) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
        
        // Check if email is being changed and if new email already exists
        if (!existingEmployee.getEmail().equals(requestDTO.getEmail()) && 
            employeeRepository.existsByEmailAndIdNot(requestDTO.getEmail(), id)) {
            throw new DuplicateEmailException(requestDTO.getEmail());
        }
        
        updateEmployeeFromRequestDTO(existingEmployee, requestDTO);
        Employee updatedEmployee = employeeRepository.save(existingEmployee);
        
        return EmployeeResponseDTO.fromEntity(updatedEmployee);
    }
    
    // Delete employee
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
        
        employeeRepository.delete(employee);
    }
    
    // Search employees
    @Transactional(readOnly = true)
    public Page<EmployeeResponseDTO> searchEmployees(String searchTerm, int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Employee> employees = employeeRepository.searchEmployees(searchTerm, pageable);
        return employees.map(EmployeeResponseDTO::fromEntity);
    }
    
    // Get employees by department
    @Transactional(readOnly = true)
    public Page<EmployeeResponseDTO> getEmployeesByDepartment(String department, int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Employee> employees = employeeRepository.findByDepartment(department, pageable);
        return employees.map(EmployeeResponseDTO::fromEntity);
    }
    
    // Get employees by position
    @Transactional(readOnly = true)
    public Page<EmployeeResponseDTO> getEmployeesByPosition(String position, int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Employee> employees = employeeRepository.findByPosition(position, pageable);
        return employees.map(EmployeeResponseDTO::fromEntity);
    }
    
    // Get employees by status
    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getEmployeesByStatus(Employee.EmployeeStatus status) {
        List<Employee> employees = employeeRepository.findByStatus(status);
        return employees.stream()
                .map(EmployeeResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    // Get employees hired between dates
    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getEmployeesHiredBetween(LocalDate startDate, LocalDate endDate) {
        List<Employee> employees = employeeRepository.findByHireDateBetween(startDate, endDate);
        return employees.stream()
                .map(EmployeeResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    // Get employees with salary greater than
    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getEmployeesWithSalaryGreaterThan(BigDecimal salary) {
        List<Employee> employees = employeeRepository.findBySalaryGreaterThan(salary);
        return employees.stream()
                .map(EmployeeResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    // Get employees with salary between range
    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getEmployeesWithSalaryBetween(BigDecimal minSalary, BigDecimal maxSalary) {
        List<Employee> employees = employeeRepository.findBySalaryBetween(minSalary, maxSalary);
        return employees.stream()
                .map(EmployeeResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    // Get recently hired employees (last N months)
    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getRecentlyHiredEmployees(int months) {
        LocalDate dateThreshold = LocalDate.now().minusMonths(months);
        List<Employee> employees = employeeRepository.findRecentlyHiredEmployees(dateThreshold);
        return employees.stream()
                .map(EmployeeResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    // Get department statistics
    @Transactional(readOnly = true)
    public Map<String, Long> getDepartmentStatistics() {
        List<Object[]> results = employeeRepository.countEmployeesByDepartment();
        Map<String, Long> statistics = new HashMap<>();
        
        for (Object[] result : results) {
            statistics.put((String) result[0], (Long) result[1]);
        }
        
        return statistics;
    }
    
    // Get status statistics
    @Transactional(readOnly = true)
    public Map<String, Long> getStatusStatistics() {
        List<Object[]> results = employeeRepository.countEmployeesByStatus();
        Map<String, Long> statistics = new HashMap<>();
        
        for (Object[] result : results) {
            statistics.put(result[0].toString(), (Long) result[1]);
        }
        
        return statistics;
    }
    
    // Helper method to map DTO to entity
    private Employee mapRequestDTOToEntity(EmployeeRequestDTO requestDTO) {
        return Employee.builder()
                .firstName(requestDTO.getFirstName())
                .lastName(requestDTO.getLastName())
                .email(requestDTO.getEmail())
                .phoneNumber(requestDTO.getPhoneNumber())
                .position(requestDTO.getPosition())
                .department(requestDTO.getDepartment())
                .salary(requestDTO.getSalary())
                .hireDate(requestDTO.getHireDate())
                .status(requestDTO.getStatus() != null ? requestDTO.getStatus() : Employee.EmployeeStatus.ACTIVE)
                .address(requestDTO.getAddress())
                .city(requestDTO.getCity())
                .state(requestDTO.getState())
                .zipCode(requestDTO.getZipCode())
                .emergencyContactName(requestDTO.getEmergencyContactName())
                .emergencyContactPhone(requestDTO.getEmergencyContactPhone())
                .build();
    }
    
    // Helper method to update entity from DTO
    private void updateEmployeeFromRequestDTO(Employee employee, EmployeeRequestDTO requestDTO) {
        employee.setFirstName(requestDTO.getFirstName());
        employee.setLastName(requestDTO.getLastName());
        employee.setEmail(requestDTO.getEmail());
        employee.setPhoneNumber(requestDTO.getPhoneNumber());
        employee.setPosition(requestDTO.getPosition());
        employee.setDepartment(requestDTO.getDepartment());
        employee.setSalary(requestDTO.getSalary());
        employee.setHireDate(requestDTO.getHireDate());
        employee.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus() : employee.getStatus());
        employee.setAddress(requestDTO.getAddress());
        employee.setCity(requestDTO.getCity());
        employee.setState(requestDTO.getState());
        employee.setZipCode(requestDTO.getZipCode());
        employee.setEmergencyContactName(requestDTO.getEmergencyContactName());
        employee.setEmergencyContactPhone(requestDTO.getEmergencyContactPhone());
    }
}
