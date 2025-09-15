package com.example.Employee.dto;

import com.example.Employee.model.Employee;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeRequestDTO {
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number should be valid")
    private String phoneNumber;
    
    @NotBlank(message = "Position is required")
    private String position;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Salary format is invalid")
    private BigDecimal salary;
    
    @NotNull(message = "Hire date is required")
    @PastOrPresent(message = "Hire date cannot be in the future")
    private LocalDate hireDate;
    
    private Employee.EmployeeStatus status;
    
    private String address;
    
    private String city;
    
    private String state;
    
    @Pattern(regexp = "^\\d{5}(-\\d{4})?$", message = "Zip code format is invalid")
    private String zipCode;
    
    private String emergencyContactName;
    
    private String emergencyContactPhone;
}
