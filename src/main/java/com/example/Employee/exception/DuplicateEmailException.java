package com.example.Employee.exception;

public class DuplicateEmailException extends RuntimeException {
    
    public DuplicateEmailException(String message) {
        super(message);
    }
}
