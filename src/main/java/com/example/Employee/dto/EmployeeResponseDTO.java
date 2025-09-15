package com.example.Employee.dto;

import com.example.Employee.model.Employee;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponseDTO {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String position;
    private String department;
    private BigDecimal salary;
    private LocalDate hireDate;
    private Employee.EmployeeStatus status;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Factory method to create DTO from Entity
    public static EmployeeResponseDTO fromEntity(Employee employee) {
        return EmployeeResponseDTO.builder()
                .id(employee.getId())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .fullName(employee.getFullName())
                .email(employee.getEmail())
                .phoneNumber(employee.getPhoneNumber())
                .position(employee.getPosition())
                .department(employee.getDepartment())
                .salary(employee.getSalary())
                .hireDate(employee.getHireDate())
                .status(employee.getStatus())
                .address(employee.getAddress())
                .city(employee.getCity())
                .state(employee.getState())
                .zipCode(employee.getZipCode())
                .emergencyContactName(employee.getEmergencyContactName())
                .emergencyContactPhone(employee.getEmergencyContactPhone())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }
}
