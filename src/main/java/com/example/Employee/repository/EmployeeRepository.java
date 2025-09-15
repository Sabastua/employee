package com.example.Employee.repository;

import com.example.Employee.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // Find by email (should be unique)
    Optional<Employee> findByEmail(String email);
    
    // Find by status
    List<Employee> findByStatus(Employee.EmployeeStatus status);
    
    // Find by department
    List<Employee> findByDepartment(String department);
    Page<Employee> findByDepartment(String department, Pageable pageable);
    
    // Find by position
    List<Employee> findByPosition(String position);
    Page<Employee> findByPosition(String position, Pageable pageable);
    
    // Find by department and status
    List<Employee> findByDepartmentAndStatus(String department, Employee.EmployeeStatus status);
    
    // Find employees hired between dates
    List<Employee> findByHireDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Find employees with salary greater than
    List<Employee> findBySalaryGreaterThan(BigDecimal salary);
    
    // Find employees with salary between range
    List<Employee> findBySalaryBetween(BigDecimal minSalary, BigDecimal maxSalary);
    
    // Custom query to search employees by name (first or last name)
    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Employee> findByNameContaining(@Param("searchTerm") String searchTerm);
    
    // Custom query for comprehensive search
    @Query("SELECT e FROM Employee e WHERE " +
           "(:searchTerm IS NULL OR " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.department) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.position) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Employee> searchEmployees(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Count employees by department
    @Query("SELECT e.department, COUNT(e) FROM Employee e GROUP BY e.department")
    List<Object[]> countEmployeesByDepartment();
    
    // Count employees by status
    @Query("SELECT e.status, COUNT(e) FROM Employee e GROUP BY e.status")
    List<Object[]> countEmployeesByStatus();
    
    // Find employees hired in the last N months
    @Query("SELECT e FROM Employee e WHERE e.hireDate >= :dateThreshold")
    List<Employee> findRecentlyHiredEmployees(@Param("dateThreshold") LocalDate dateThreshold);
    
    // Check if email exists (for validation)
    boolean existsByEmail(String email);
    
    // Check if email exists excluding current employee (for updates)
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Employee e WHERE e.email = :email AND e.id != :employeeId")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("employeeId") Long employeeId);
}
